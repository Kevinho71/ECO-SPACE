# build_all.py
# ---------------------------------------------------------------------------
# Construye todos los modelos y exporta un GLB por misión a:
#   ../public/models/<luna|marte|mas alla>/<nombre>.glb
#
# Uso (desde la carpeta `blender/`):
#   & "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" --background --python build_all.py
#
# Para construir/exportar UNA sola misión:
#   ... --python build_all.py -- opportunity
# ---------------------------------------------------------------------------

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bpy
import robot_helpers as rh
from models import eagle, surveyor3, pathfinder, opportunity, insight, ingenuity, pioneer10

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.abspath(os.path.join(BASE, "..", "public", "models"))

MODELS = [
    (eagle, "moon"),
    (surveyor3, "moon"),
    (pathfinder, "mars"),
    (opportunity, "mars"),
    (insight, "mars"),
    (ingenuity, "mars"),
    (pioneer10, "beyond"),
]

# Filtro opcional por nombre: build_all.py -- <nombre>
only = None
if "--" in sys.argv:
    i = sys.argv.index("--")
    if i + 1 < len(sys.argv):
        only = sys.argv[i + 1]

for mod, loc in MODELS:
    if only and mod.NAME != only:
        continue
    rh.clear_scene()
    print("=== BUILD %s (%s) ===" % (mod.NAME, loc))
    mod.build()
    bpy.context.view_layer.update()
    outdir = os.path.join(OUT_DIR, loc)
    os.makedirs(outdir, exist_ok=True)
    rh.export_glb(os.path.join(outdir, mod.NAME + ".glb"), draco=True)

print("DONE")
