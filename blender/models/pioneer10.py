# models/pioneer10.py — Pioneer 10 (espacio profundo)
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "pioneer10"
LOCATION = "beyond"


def build():
    # --- Materiales ---
    bus = rh.new_material("bus", (0.75, 0.75, 0.70), metallic=0.3, roughness=0.4)
    gold = rh.new_material("gold", (0.90, 0.78, 0.35), metallic=0.9, roughness=0.3)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(0.3, 1.0, 0.5), emission_strength=1.0)

    root = rh.add_empty("pioneer10", (0, 0, 0))

    # --- Bus hexagonal (eje de viaje = +Z) ---
    rh.add_cylinder("bus", 0.50, 0.35, (0, 0, 0), material=bus, parent=root, segments=6)

    # Luz de estado
    rh.add_icosphere("status_light", 0.04, (0.30, 0.30, 0.20), subdivisions=2, material=glow, parent=root)

    # --- Antena de alta ganancia (parabólica, mira hacia delante +Z) ---
    dish = rh.add_empty("dish", (0, 0, 0.35), parent=root)
    rh.add_cone("dish_mesh", 0.45, 1.30, 0.50, (0, 0, 0.05), material=silver, parent=dish, segments=24)
    rh.add_cylinder("feed_horn", 0.06, 0.30, (0, 0, 0.60), material=dark, parent=dish)

    # --- Botalón del magnetómetro (largo, hacia -X) ---
    rh.add_rod("mag_boom", 0.02, (0, 0, 0.0), (-2.5, 0, 0.0), material=silver, parent=root)
    rh.add_box("mag_sensor", (0.10, 0.10, 0.10), (-2.6, 0, 0.0), material=dark, parent=root)

    # --- 2 generadores RTG (en botalones laterales) ---
    for side, sign in (("L", -1), ("R", 1)):
        rh.add_rod("rtg_boom_%s" % side, 0.03, (sign * 0.20, 0, 0.0), (sign * 0.65, 0, 0.0),
                   material=silver, parent=root)
        rh.add_cylinder("rtg_%s" % side, 0.09, 0.55, (sign * 0.75, 0, 0.0), material=dark,
                        parent=root, segments=10)

    # --- Placa dorada (mensaje de la humanidad) ---
    rh.add_box("golden_plaque", (0.14, 0.20, 0.015), (0.35, -0.28, 0.10),
               rotation=(0, 0, math.pi / 6), material=gold, parent=root)

    # Anclaje POV (mira hacia delante, en la dirección de viaje +Z)
    rh.add_empty("pov_eye", (0, 0, 0.35), rotation=(0, 0, 0), parent=root)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
