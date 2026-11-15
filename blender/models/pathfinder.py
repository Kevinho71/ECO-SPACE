# models/pathfinder.py — Mars Pathfinder + Sojourner (Marte)
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "pathfinder"
LOCATION = "mars"


def build():
    # --- Materiales ---
    body = rh.new_material("body", (0.75, 0.72, 0.60), metallic=0.2, roughness=0.5)
    solar = rh.new_material("solar_cell", (0.10, 0.14, 0.35), metallic=0.3, roughness=0.4)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    white = rh.new_material("white", (0.92, 0.92, 0.93), metallic=0.1, roughness=0.4)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(0.3, 1.0, 0.3), emission_strength=1.0)

    root = rh.add_empty("pathfinder", (0, 0, 0))

    # --- Cuerpo central del lander ---
    rh.add_box("lander_body", (0.60, 0.60, 0.40), (0, 0, 0.45), material=body, parent=root)

    # --- 3 pétalos (paneles solares desplegados) ---
    for k in range(3):
        ang = math.radians(90 + k * 120)
        piv = rh.add_empty("petal_%d" % k, (math.cos(ang) * 0.30, math.sin(ang) * 0.30, 0.42), parent=root)
        rh.add_box("petal_%d_mesh" % k, (0.80, 0.60, 0.03),
                   (math.cos(ang) * 0.55, math.sin(ang) * 0.55, 0.0),
                   rotation=(0, 0, -ang), material=solar, parent=piv)

    # --- Mástil con cámara IMP ---
    mast = rh.add_empty("mast", (0, 0, 0.65), parent=root)
    rh.add_cylinder("mast_mesh", 0.03, 0.40, (0, 0, 0.20), material=silver, parent=mast)
    head = rh.add_empty("mast_head", (0, 0, 0.45), parent=mast)
    rh.add_box("imp_camera", (0.16, 0.12, 0.12), (0, 0, 0.0), material=dark, parent=head)
    rh.add_empty("pov_eye", (0.0, 0, 0.08), rotation=(0, math.pi / 2, 0), parent=head)

    # Luz de estado
    rh.add_icosphere("status_light", 0.05, (0, 0, 0.75), subdivisions=2, material=glow, parent=root)

    # --- Airbags desinflados (blobs en la base) ---
    for k in range(4):
        ang = math.radians(k * 90)
        rh.add_icosphere("airbag_%d" % k, 0.28, (math.cos(ang) * 0.55, math.sin(ang) * 0.55, 0.10),
                         subdivisions=2, material=white, parent=root)

    # --- Sojourner (pequeño rover, detalle junto al lander) ---
    soj = rh.add_empty("sojourner", (1.25, 0, 0), parent=root)
    rh.add_box("soj_body", (0.35, 0.22, 0.15), (0, 0, 0.15), material=body, parent=soj)
    rh.add_box("soj_solar", (0.30, 0.20, 0.02), (0, 0, 0.24), material=solar, parent=soj)
    rh.add_icosphere("soj_status", 0.02, (0, 0, 0.26), subdivisions=2, material=glow, parent=soj)
    rh.add_cylinder("soj_mast", 0.015, 0.12, (0.12, 0, 0.26), material=silver, parent=soj)
    for i, x in enumerate([-0.12, 0.0, 0.12]):
        for side, y in (("L", -0.13), ("R", 0.13)):
            piv = rh.add_empty("soj_wheel_%s%d" % (side, i), (x, y, 0.06), parent=soj)
            rh.add_cylinder("soj_wheel_%s%d_mesh" % (side, i), 0.06, 0.05, (0, 0, 0),
                            rotation=(math.pi / 2, 0, 0), material=silver, parent=piv, segments=12)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
