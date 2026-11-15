# preview.py
# ---------------------------------------------------------------------------
# Abre Blender en modo GUI con un modelo YA construido en la escena,
# listo para orbitar e inspeccionar visualmente.
#
# Uso (desde PowerShell):
#   & "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" `
#     --python "C:\Users\Usuario\OneDrive - UCB\PROYECTOS VS CODE\ECOSPACE\blender\preview.py" `
#     -- opportunity
#
# Cambia `opportunity` por: eagle, surveyor3, pathfinder, opportunity,
# insight, ingenuity, pioneer10.
#
# Consejos de visualización una vez abierto:
#   * Pulsa Z -> "Material Preview" (o Rendered) para ver colores y el
#     material emisivo de `status_light`.
#   * Pulsa Inicio (Home) o Numpad "." para encuadrar el modelo.
#   * Botón central arrastrar = rotar; rueda = zoom; Shift+arrastrar = paneo.
# ---------------------------------------------------------------------------

import os
import sys

# 1) Localizar la carpeta blender/
if "__file__" in globals():
    _base = os.path.dirname(os.path.abspath(__file__))
else:
    # Desde la pestaña Scripting de Blender `__file__` no existe: usar el path del texto.
    try:
        _base = os.path.dirname(bpy.context.space_data.text.filepath)
    except Exception:
        _base = r"C:\Users\Usuario\OneDrive - UCB\PROYECTOS VS CODE\ECOSPACE\blender"
sys.path.insert(0, _base)

import bpy
import robot_helpers as rh
from models import eagle, surveyor3, pathfinder, opportunity, insight, ingenuity, pioneer10

MODELS = {
    "eagle": eagle,
    "surveyor3": surveyor3,
    "pathfinder": pathfinder,
    "opportunity": opportunity,
    "insight": insight,
    "ingenuity": ingenuity,
    "pioneer10": pioneer10,
}

name = "opportunity"
if "--" in sys.argv:
    i = sys.argv.index("--")
    if i + 1 < len(sys.argv):
        name = sys.argv[i + 1]

mod = MODELS.get(name)
if mod is None:
    print("Modelo desconocido '%s'. Opciones: %s" % (name, list(MODELS.keys())))
else:
    rh.clear_scene()

    # Luz solar para que se vea bien en Material Preview / Rendered
    light_data = bpy.data.lights.new(name="Sun", type="SUN")
    light_data.energy = 4.0
    light_obj = bpy.data.objects.new("Sun", light_data)
    bpy.context.scene.collection.objects.link(light_obj)
    light_obj.location = (5, -5, 8)
    light_obj.rotation_euler = (1.1, 0, 0.785)

    mod.build()
    bpy.context.view_layer.update()

    # Seleccionar todo + encuadrar + poner Material Preview (mejor esfuerzo)
    for obj in bpy.context.scene.objects:
        obj.select_set(True)
    try:
        screen = bpy.context.screen
        if screen:
            for area in screen.areas:
                if area.type != "VIEW_3D":
                    continue
                for region in area.regions:
                    if region.type == "WINDOW":
                        with bpy.context.temp_override(area=area, region=region):
                            area.spaces.active.shading.type = "MATERIAL"
                            bpy.ops.view3d.view_selected()
                        break
    except Exception as e:
        print("[info] no se pudo auto-encuadrar (usa Inicio/Home):", e)

    print("MODELO CARGADO:", name)
    print("Z -> Material Preview | Inicio -> encuadrar")
