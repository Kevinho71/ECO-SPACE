# robot_helpers.py
# ---------------------------------------------------------------------------
# Helpers procedurales para construir robots low-poly en Blender y exportar a GLB.
#
# Convenciones clave (importantes para que Three.js/R3F los encuentre):
#   * Cada parte articulada se cuelga de un Empty "pivot" (nodo con nombre).
#       -> En Three.js: scene.getObjectByName("mast") y rotarlo mueve a sus hijos.
#   * El nodo "pov_eye" marca el anclaje de la cámara en primera persona.
#   * La luz de estado se llama "status_light" y usa un material emisivo
#     (en Three.js se anima emissiveIntensity para el encendido/apagado y el
#     corte eléctrico final).
#   * Los morph targets (shape keys) se añaden con add_bend_shape_key().
#   * Todo se construye con Z como "arriba"; el exportador lo convierte a Y-up.
# ---------------------------------------------------------------------------

import bpy
import bmesh
import math
from mathutils import Vector, Euler

AXIS = {"X": 0, "Y": 1, "Z": 2}


def clear_scene():
    """Borra todos los objetos y purga datos huérfanos."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    try:
        bpy.ops.outliner.orphans_purge(do_recursive=True)
    except Exception:
        for coll in (bpy.data.meshes, bpy.data.materials):
            for d in list(coll):
                if d.users == 0:
                    try:
                        coll.remove(d)
                    except Exception:
                        pass


def new_material(name, base_color=(0.8, 0.8, 0.8), metallic=0.0, roughness=0.6,
                 emission=None, emission_strength=0.0):
    """Material PBR con Principled BSDF (se exporta a glTF como BaseColor/Metallic/Roughness/Emissive)."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
        out = mat.node_tree.nodes.get("Material Output")
        if out:
            mat.node_tree.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (base_color[0], base_color[1], base_color[2], 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission is not None:
        for n in ("Emission Color", "Emission"):
            if n in bsdf.inputs:
                bsdf.inputs[n].default_value = (emission[0], emission[1], emission[2], 1.0)
                break
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat


def _link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def parent_keep(obj, parent):
    """Parenta un objeto conservando su transformación en el mundo."""
    obj.parent = parent
    obj.matrix_parent_inverse = parent.matrix_world.inverted()


def add_mesh_from_bmesh(name, bm, location=(0, 0, 0), rotation=None, material=None, parent=None):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    obj.location = Vector(location)
    if rotation is not None:
        obj.rotation_euler = Euler(rotation, "XYZ")
    if material is not None:
        obj.data.materials.append(material)
    _link(obj)
    if parent is not None:
        parent_keep(obj, parent)
    return obj


def add_box(name, dims, location=(0, 0, 0), rotation=None, material=None, parent=None):
    """Caja con dimensiones (x, y, z) centrada en `location`."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= dims[0] / 2
        v.co.y *= dims[1] / 2
        v.co.z *= dims[2] / 2
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_box_segmented(name, dims, location=(0, 0, 0), rotation=None, material=None, parent=None,
                      seg_axis="X", segments=4):
    """Caja subdividida a lo largo de un eje (útil para morph targets de flexión)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= dims[0] / 2
        v.co.y *= dims[1] / 2
        v.co.z *= dims[2] / 2
    ai = AXIS[seg_axis]
    edges = [e for e in bm.edges if abs(e.verts[0].co[ai] - e.verts[1].co[ai]) > 1e-5]
    if edges:
        bmesh.ops.subdivide_edges(bm, edges=edges, cuts=segments)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_cylinder(name, radius, depth, location=(0, 0, 0), rotation=None, material=None,
                 parent=None, segments=16):
    """Cilindro a lo largo de Z (usa `rotation` para reorientar)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=depth)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_segmented_cylinder(name, radius, depth, location=(0, 0, 0), rotation=None, material=None,
                           parent=None, segments=12, depth_segments=4):
    """Cilindro con anillos extra a lo largo de Z (para morph targets de flexión)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=depth)
    edges = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-5]
    if edges:
        bmesh.ops.subdivide_edges(bm, edges=edges, cuts=depth_segments)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_icosphere(name, radius, location=(0, 0, 0), subdivisions=2, material=None, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdivisions, radius=radius)
    return add_mesh_from_bmesh(name, bm, location, None, material, parent)


def add_cone(name, radius1, radius2, depth, location=(0, 0, 0), rotation=None, material=None,
             parent=None, segments=16):
    """Cono/tronco: radius1 en la base (-Z), radius2 en la cima (+Z)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius1, radius2=radius2, depth=depth)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_empty(name, location=(0, 0, 0), rotation=None, parent=None):
    """Empty = pivote/nodo. Se exporta como nodo sin malla (ideal para articulación)."""
    obj = bpy.data.objects.new(name, None)
    obj.location = Vector(location)
    if rotation is not None:
        obj.rotation_euler = Euler(rotation, "XYZ")
    _link(obj)
    if parent is not None:
        parent_keep(obj, parent)
    return obj


def add_rod(name, radius, a, b, material=None, parent=None, segments=12):
    """Cilindro que une dos puntos 3D `a` y `b` (ideal para patas, brazos, botalones)."""
    a = Vector(a)
    b = Vector(b)
    mid = (a + b) / 2
    length = (b - a).length
    direction = (b - a).normalized()
    rot = Vector((0, 0, 1)).rotation_difference(direction)
    return add_cylinder(name, radius, length, mid, rotation=rot.to_euler("XYZ"),
                        material=material, parent=parent, segments=segments)


def add_bend_shape_key(obj, name, bend_axis="X", up_axis="Z", pivot=0.0, max_angle_deg=20.0):
    """Añade un morph target que flexiona la malla (p. ej. antena que se 'tristeza').
    Requiere una malla con vértices a lo largo de `up_axis` (usa add_*_segmented)."""
    if obj.data.shape_keys is None:
        obj.shape_key_add(name="Basis")
    sk = obj.shape_key_add(name=name)
    sk.value = 0.0
    ia = AXIS[bend_axis]
    iu = AXIS[up_axis]
    verts = obj.data.vertices
    heights = [v.co[iu] for v in verts]
    lo, hi = min(heights), max(heights)
    span = (hi - lo) if (hi - lo) > 1e-6 else 1.0
    for i, v in enumerate(verts):
        c = v.co
        u = c[iu]
        b = c[ia]
        frac = max(0.0, (u - pivot) / span)
        ang = math.radians(max_angle_deg) * frac
        r = u - pivot
        nb = b * math.cos(ang) - r * math.sin(ang)
        nu = pivot + b * math.sin(ang) + r * math.cos(ang)
        nc = c.copy()
        nc[ia] = nb
        nc[iu] = nu
        sk.data[i].co = nc
    return sk


def export_glb(filepath, draco=True):
    """Exporta la escena completa a GLB (con morph targets y compresión Draco)."""
    kwargs = dict(filepath=filepath, export_format="GLB", use_selection=False,
                  export_yup=True, export_apply=True, export_morph=True, export_skins=True,
                  export_cameras=False, export_lights=False)
    if draco:
        kwargs["export_draco_mesh_compression_enable"] = True
        kwargs["export_draco_mesh_compression_level"] = 10
    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except Exception as e:
        if draco:
            print("[warn] Draco falló, reintentando sin compresión:", e)
            kwargs.pop("export_draco_mesh_compression_enable", None)
            kwargs.pop("export_draco_mesh_compression_level", None)
            bpy.ops.export_scene.gltf(**kwargs)
        else:
            raise
    print("EXPORTED:", filepath)
