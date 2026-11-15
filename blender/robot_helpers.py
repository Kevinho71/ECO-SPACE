# robot_helpers.py
# ---------------------------------------------------------------------------
# Helpers procedurales para construir robots low-poly ESTILO "Robot Expressive"
# (three.js webgl_animation_skinning_morph) y exportarlos a GLB.
#
# Estilo: formas redondeadas (bevel) y suaves, colores planos y limpios,
# una CARA con ojos con morph targets (Sad / Surprised / Sleep) y clips de
# animación sobre pivotes con nombre.
#
# Convenciones (importantes para Three.js/R3F):
#   * Cada parte articulada cuelga de un Empty "pivot" con nombre.
#   * "pov_eye" = anclaje de la cámara en primera persona (mira hacia +X local).
#   * "status_light" usa un material emisivo (se anima emissiveIntensity).
#   * "face" = malla de ojos con morph targets Sad / Surprised / Sleep.
#   * Z es "arriba"; el exportador convierte a Y-up.
# ---------------------------------------------------------------------------

import bpy
import bmesh
import math
from mathutils import Vector, Euler

AXIS = {"X": 0, "Y": 1, "Z": 2}
_REST = {}  # pose de reposo (loc, rot, scale) de cada nodo animado


def clear_scene():
    """Borra todos los objetos y purga datos huérfanos."""
    _REST.clear()
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.actions, bpy.data.meshes, bpy.data.materials):
        for d in list(coll):
            if d.users == 0:
                try:
                    coll.remove(d)
                except Exception:
                    pass


def new_material(name, base_color=(0.8, 0.8, 0.8), metallic=0.0, roughness=0.6,
                 emission=None, emission_strength=0.0):
    """Material PBR (BaseColor/Metallic/Roughness/Emissive en glTF)."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (base_color[0], base_color[1], base_color[2], 1.0)  # color en el viewport/Workbench
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
        mat.diffuse_color = (emission[0], emission[1], emission[2], 1.0)
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
    """Parenta conservando la transformación en el mundo."""
    obj.parent = parent
    obj.matrix_parent_inverse = parent.matrix_world.inverted()


def add_mesh_from_bmesh(name, bm, location=(0, 0, 0), rotation=None, material=None, parent=None,
                        smooth=None):
    """smooth: None (plano) | "all" (todo suave) | "side" (suave salvo tapas planas)."""
    if smooth:
        bm.normal_update()
        for f in bm.faces:
            f.smooth = True if smooth == "all" else abs(f.normal.z) < 0.9
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
    """Caja plana (facetada) con dimensiones (x, y, z)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= dims[0]
        v.co.y *= dims[1]
        v.co.z *= dims[2]
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_rbox(name, dims, location=(0, 0, 0), rotation=None, material=None, parent=None,
             radius=0.05, segments=3):
    """Caja REDONDEADA (bevel) y suave: el look 'juguete' del Robot Expressive."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= dims[0]
        v.co.y *= dims[1]
        v.co.z *= dims[2]
    r = min(radius, min(dims) * 0.45)
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=r, segments=segments,
                    profile=0.5, affect="EDGES")
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent, smooth="all")


def add_box_segmented(name, dims, location=(0, 0, 0), rotation=None, material=None, parent=None,
                      seg_axis="X", segments=4):
    """Caja subdividida a lo largo de un eje (para morph targets de flexión)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= dims[0]
        v.co.y *= dims[1]
        v.co.z *= dims[2]
    ai = AXIS[seg_axis]
    edges = [e for e in bm.edges if abs(e.verts[0].co[ai] - e.verts[1].co[ai]) > 1e-5]
    if edges:
        bmesh.ops.subdivide_edges(bm, edges=edges, cuts=segments)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent)


def add_cylinder(name, radius, depth, location=(0, 0, 0), rotation=None, material=None,
                 parent=None, segments=16, flat=False):
    """Cilindro a lo largo de Z. Lados suaves; `flat=True` lo deja facetado (low-poly)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=depth)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent,
                               smooth=None if flat else "side")


def add_segmented_cylinder(name, radius, depth, location=(0, 0, 0), rotation=None, material=None,
                           parent=None, segments=12, depth_segments=4):
    """Cilindro con anillos extra en Z (para morph targets de flexión)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=depth)
    edges = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-5]
    if edges:
        bmesh.ops.subdivide_edges(bm, edges=edges, cuts=depth_segments)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent, smooth="side")


def add_icosphere(name, radius, location=(0, 0, 0), subdivisions=2, material=None, parent=None,
                  scale=(1, 1, 1)):
    """Esfera (o elipsoide con `scale`)."""
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdivisions, radius=radius)
    for v in bm.verts:
        v.co.x *= scale[0]
        v.co.y *= scale[1]
        v.co.z *= scale[2]
    return add_mesh_from_bmesh(name, bm, location, None, material, parent, smooth="all")


def add_cone(name, radius1, radius2, depth, location=(0, 0, 0), rotation=None, material=None,
             parent=None, segments=16, flat=False):
    """Cono/tronco: radius1 en la base (-Z), radius2 en la cima (+Z)."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius1, radius2=radius2, depth=depth)
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent,
                               smooth=None if flat else "side")


def add_dish(name, radius, depth, location=(0, 0, 0), rotation=None, material=None, parent=None,
             rings=6, segs=24, thickness=0.04):
    """Plato parabólico CÓNCAVO hacia +Z local (antena de alta ganancia). Doble cara + borde."""
    bm = bmesh.new()
    k = depth / (radius * radius)
    def surf(z_off):
        c = bm.verts.new((0, 0, z_off))
        rs = [[bm.verts.new((r * math.cos(2 * math.pi * j / segs), r * math.sin(2 * math.pi * j / segs),
                             k * r * r + z_off))
               for j in range(segs)] for r in [radius * (i + 1) / rings for i in range(rings)]]
        return c, rs
    ci, ri = surf(0.0)
    co, ro = surf(-thickness)
    for j in range(segs):
        n = (j + 1) % segs
        bm.faces.new((ci, ri[0][j], ri[0][n]))
        bm.faces.new((co, ro[0][n], ro[0][j]))
        for i in range(rings - 1):
            bm.faces.new((ri[i][j], ri[i + 1][j], ri[i + 1][n], ri[i][n]))
            bm.faces.new((ro[i][n], ro[i + 1][n], ro[i + 1][j], ro[i][j]))
        bm.faces.new((ri[-1][j], ro[-1][j], ro[-1][n], ri[-1][n]))
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    return add_mesh_from_bmesh(name, bm, location, rotation, material, parent, smooth="all")


def add_empty(name, location=(0, 0, 0), rotation=None, parent=None):
    """Empty = pivote/nodo con nombre (ideal para articular desde Three.js)."""
    obj = bpy.data.objects.new(name, None)
    obj.location = Vector(location)
    if rotation is not None:
        obj.rotation_euler = Euler(rotation, "XYZ")
    _link(obj)
    if parent is not None:
        parent_keep(obj, parent)
    return obj


def add_rod(name, radius, a, b, material=None, parent=None, segments=10):
    """Cilindro que une dos puntos 3D (patas, brazos, botalones)."""
    a = Vector(a)
    b = Vector(b)
    mid = (a + b) / 2
    length = (b - a).length
    direction = (b - a).normalized()
    rot = Vector((0, 0, 1)).rotation_difference(direction)
    return add_cylinder(name, radius, length, mid, rotation=rot.to_euler("XYZ"),
                        material=material, parent=parent, segments=segments)


def add_bend_shape_key(obj, name, bend_axis="X", up_axis="Z", pivot=0.0, max_angle_deg=20.0):
    """Morph target de flexión (p. ej. antena que se 'entristece')."""
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


def add_face(parent, location=(0, 0, 0), rotation=None, spacing=0.16, size=0.06, name="face"):
    """Cara expresiva (dos ojos) que MIRA hacia +X local.
    Morph targets: `Sad`, `Surprised`, `Sleep` (ojos cerrados -> corte eléctrico).
    Una sola malla con 2 materiales (esclera / pupila), como la cabeza del Robot Expressive."""
    white = new_material("eye_white", (0.96, 0.96, 0.94), roughness=0.35)
    pupil = new_material("eye_pupil", (0.02, 0.03, 0.05), roughness=0.2)
    bm = bmesh.new()
    info = []  # por vértice: (lado, centro del ojo)
    for side in (-1, 1):
        c = Vector((0, side * spacing / 2, 0))
        for radii, off, mi in (((0.55, 0.85, 1.0), 0.0, 0), ((0.30, 0.52, 0.66), 0.38, 1)):
            nv, nf = len(bm.verts), len(bm.faces)
            bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
            bm.verts.ensure_lookup_table()
            bm.faces.ensure_lookup_table()
            for v in list(bm.verts)[nv:]:
                v.co = Vector((v.co.x * radii[0] * size + off * size,
                               v.co.y * radii[1] * size,
                               v.co.z * radii[2] * size)) + c
                info.append((side, c))
            for f in list(bm.faces)[nf:]:
                f.material_index = mi
                f.smooth = True
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(white)
    mesh.materials.append(pupil)
    obj = bpy.data.objects.new(name, mesh)
    obj.location = Vector(location)
    if rotation is not None:
        obj.rotation_euler = Euler(rotation, "XYZ")
    _link(obj)
    parent_keep(obj, parent)

    obj.shape_key_add(name="Basis")

    def key(kname, fn):
        sk = obj.shape_key_add(name=kname)
        for i, v in enumerate(mesh.vertices):
            side, c = info[i]
            sk.data[i].co = fn(v.co.copy(), side, c)
        sk.value = 0.0

    def surprised(p, side, c):
        return c + (p - c) * 1.3

    def sleep(p, side, c):
        q = p.copy()
        q.z = c.z + (p.z - c.z) * 0.08
        return q

    def sad(p, side, c):
        d = p - c
        a = side * 0.45
        y = d.y * math.cos(a) - d.z * math.sin(a)
        z = d.y * math.sin(a) + d.z * math.cos(a)
        return c + Vector((d.x, y, z * 0.8 - size * 0.15))

    key("Sad", sad)
    key("Surprised", surprised)
    key("Sleep", sleep)
    return obj


def _fcurves(act):
    """fcurves de una Action (API clásica o por capas de Blender 4.4+/5)."""
    fcs = getattr(act, "fcurves", None)
    if fcs is not None:
        return list(fcs)
    out = []
    for layer in getattr(act, "layers", []):
        for strip in layer.strips:
            for cb in getattr(strip, "channelbags", []):
                out.extend(cb.fcurves)
    return out


def add_clip(clip, tracks, fps=24, linear=False):
    """Clip de animación glTF por keyframes sobre nodos con nombre.
    tracks = {"nodo": {"rot": [(frame,(rx,ry,rz)),...], "loc": [...], "scale": [...]}}
    Cada clip va en su propia pista NLA (se exporta con ese nombre)."""
    bpy.context.scene.render.fps = fps
    for nodename, chans in tracks.items():
        obj = bpy.data.objects.get(nodename)
        if obj is None:
            print("[warn] clip %s: no existe el nodo %s" % (clip, nodename))
            continue
        _REST.setdefault(nodename, (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy()))
        obj.animation_data_create()
        act = bpy.data.actions.new("%s|%s" % (clip, nodename))
        obj.animation_data.action = act
        first = None
        for chan, path in (("rot", "rotation_euler"), ("loc", "location"), ("scale", "scale")):
            base = getattr(obj, path).copy()
            for frame, val in chans.get(chan, []):
                setattr(obj, path, val)
                obj.keyframe_insert(path, frame=frame)
                first = frame if first is None else min(first, frame)
            setattr(obj, path, base)
        if linear:
            for fc in _fcurves(act):
                for kp in fc.keyframe_points:
                    kp.interpolation = "LINEAR"
        tr = obj.animation_data.nla_tracks.new()
        tr.name = clip
        strip = tr.strips.new(clip, int(first or 0), act)
        strip.extrapolation = "NOTHING"  # fuera del clip, el nodo queda en su pose de reposo
        obj.animation_data.action = None


def loop(prop, values, frames=48, axis=None, base=0.0):
    """Atajo: keyframes cíclicos [(frame, valor)] para un canal con 1 eje."""
    n = len(values)
    out = []
    for i, v in enumerate(values + [values[0]]):
        f = round(i * frames / n)
        vec = [0.0, 0.0, 0.0]
        vec[AXIS[axis]] = v
        out.append((f, tuple(vec)))
    return out


def export_glb(filepath, draco=True):
    """Exporta a GLB (morph targets, animaciones NLA y Draco)."""
    bpy.context.scene.frame_set(-1000)  # ningún clip activo al hornear los nodos
    for nm, (loc, rot, scl) in _REST.items():  # restaura la pose de reposo real
        o = bpy.data.objects.get(nm)
        if o is not None:
            o.location, o.rotation_euler, o.scale = loc, rot, scl
    bpy.context.view_layer.update()
    kwargs = dict(filepath=filepath, export_format="GLB", use_selection=False,
                  export_yup=True, export_apply=True, export_morph=True, export_skins=True,
                  export_cameras=False, export_lights=False,
                  export_animations=True, export_animation_mode="NLA_TRACKS")
    if draco:
        kwargs["export_draco_mesh_compression_enable"] = True
        kwargs["export_draco_mesh_compression_level"] = 10
    for attempt in range(3):
        try:
            bpy.ops.export_scene.gltf(**kwargs)
            break
        except Exception as e:
            print("[warn] export falló (%s), simplificando..." % e)
            if "export_draco_mesh_compression_enable" in kwargs:
                kwargs.pop("export_draco_mesh_compression_enable")
                kwargs.pop("export_draco_mesh_compression_level", None)
            elif "export_animation_mode" in kwargs:
                kwargs.pop("export_animation_mode")
                kwargs["export_animations"] = False
            else:
                raise
    print("EXPORTED:", filepath)
