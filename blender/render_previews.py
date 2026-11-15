# render_previews.py — renderiza vistas previas PNG (Workbench, sin GPU) de los modelos.
# Uso: blender --background --python render_previews.py -- <nombre|all> [carpeta_salida]
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import robot_helpers as rh
from models import eagle, surveyor3, pathfinder, opportunity, insight, ingenuity, pioneer10

MODELS = {m.NAME: m for m in (eagle, surveyor3, pathfinder, opportunity, insight, ingenuity, pioneer10)}
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
which = args[0] if args else "all"
out = args[1] if len(args) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "_previews")
os.makedirs(out, exist_ok=True)

for name, mod in MODELS.items():
    if which != "all" and name != which:
        continue
    rh.clear_scene()
    mod.build()
    for o in bpy.context.scene.objects:
        if o.animation_data:
            for t in o.animation_data.nla_tracks:
                t.mute = True
    bpy.context.view_layer.update()
    pts = []
    for o in bpy.context.scene.objects:
        if o.type == "MESH":
            pts += [o.matrix_world @ Vector(c) for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    c, size = (lo + hi) / 2, max((hi - lo).length, 0.5)
    focus = os.environ.get("FOCUS")
    if focus:
        fo = bpy.data.objects[focus]
        c, size = fo.matrix_world.translation.copy(), float(os.environ.get("FOCUS_SIZE", "1.0"))
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    cam.location = c + Vector((0.95, -1.0, 0.55)) * size * 0.95
    cam.rotation_euler = (c - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam.data.lens = 50
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_WORKBENCH"
    sc.render.resolution_x, sc.render.resolution_y = 900, 700
    sc.display.shading.light = "STUDIO"
    sc.display.shading.color_type = "MATERIAL"
    sc.world = bpy.data.worlds.new("w")
    sc.world.color = (0.55, 0.62, 0.75)
    sc.render.filepath = os.path.join(out, name + ".png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", sc.render.filepath)
