# models/ingenuity.py — Mars Helicopter "Ingenuity"
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "ingenuity"
LOCATION = "mars"


def build():
    # --- Materiales ---
    body = rh.new_material("body", (0.65, 0.60, 0.55), metallic=0.2, roughness=0.5)
    solar = rh.new_material("solar_cell", (0.10, 0.14, 0.35), metallic=0.3, roughness=0.4)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(1.0, 0.6, 0.1), emission_strength=1.0)

    root = rh.add_empty("ingenuity", (0, 0, 0))

    # --- Fuselaje ---
    rh.add_box("fuselage", (0.14, 0.14, 0.14), (0, 0, 0.55), material=body, parent=root)
    rh.add_icosphere("status_light", 0.02, (0, 0, 0.65), subdivisions=2, material=glow, parent=root)

    # --- 4 patas ---
    for sx in (-1, 1):
        for sy in (-1, 1):
            top = (sx * 0.06, sy * 0.06, 0.48)
            bottom = (sx * 0.22, sy * 0.22, 0.0)
            rh.add_rod("leg_%s%s" % ("L" if sx < 0 else "R", "B" if sy < 0 else "F"),
                       0.015, top, bottom, material=dark, parent=root)

    # --- Mástil ---
    rh.add_cylinder("mast", 0.02, 0.25, (0, 0, 0.68), material=silver, parent=root)

    # --- Rotores coaxiales (2 rotores, cada uno con 2 aspas) ---
    rotor_top = rh.add_empty("rotor_top", (0, 0, 0.78), parent=root)
    rh.add_cylinder("rotor_top_hub", 0.04, 0.02, (0, 0, 0.0), material=silver, parent=rotor_top)
    blade_top = rh.add_box_segmented("rotor_top_blade", (1.2, 0.04, 0.008),
                                     (0, 0, 0.0), material=dark, parent=rotor_top, seg_axis="X", segments=6)

    rotor_bot = rh.add_empty("rotor_bottom", (0, 0, 0.74), parent=root)
    rh.add_cylinder("rotor_bottom_hub", 0.04, 0.02, (0, 0, 0.0), material=silver, parent=rotor_bot)
    rh.add_box_segmented("rotor_bottom_blade", (1.2, 0.04, 0.008),
                         (0, 0, 0.0), rotation=(0, 0, math.pi / 2), material=dark,
                         parent=rotor_bot, seg_axis="Y", segments=6)

    # Morph target "rotor_damage": dobla las aspas superiores hacia abajo
    # (el "what if" del vuelo 72 donde se dañaron las aspas).
    rh.add_bend_shape_key(blade_top, "rotor_damage", bend_axis="Z", up_axis="X", pivot=0.0, max_angle_deg=18.0)

    # --- Panel solar superior ---
    rh.add_box("solar_panel", (0.16, 0.16, 0.02), (0, 0, 0.90), material=solar, parent=root)

    # --- Antena ---
    rh.add_cylinder("antenna", 0.008, 0.10, (0, 0, 0.95), material=silver, parent=root)

    # Anclaje POV (mira hacia delante, -Y local)
    rh.add_empty("pov_eye", (0, 0, 0.62), rotation=(0, 0, 0), parent=root)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
