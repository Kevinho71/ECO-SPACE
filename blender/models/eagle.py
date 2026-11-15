# models/eagle.py — Apollo 11 LM "Eagle" (etapa de descenso, Luna)
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "eagle"
LOCATION = "moon"


def build():
    # --- Materiales ---
    gold = rh.new_material("gold_foil", (0.85, 0.70, 0.25), metallic=0.8, roughness=0.4)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    gray = rh.new_material("strut", (0.45, 0.47, 0.50), metallic=0.4, roughness=0.5)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(1.0, 0.9, 0.4), emission_strength=1.0)

    root = rh.add_empty("eagle", (0, 0, 0))

    # --- Etapa de descenso (octágono dorado) ---
    rh.add_cylinder("descent_stage", 1.5, 0.85, (0, 0, 1.0), material=gold, parent=root, segments=8)
    rh.add_cylinder("descent_top", 1.1, 0.12, (0, 0, 1.46), material=dark, parent=root, segments=8)

    # Luz de estado
    rh.add_icosphere("status_light", 0.06, (0.8, 0, 1.35), subdivisions=2, material=glow, parent=root)

    # --- 4 patas con patas de apoyo ---
    for k in range(4):
        ang = math.radians(45 + k * 90)
        top = (math.cos(ang) * 1.15, math.sin(ang) * 1.15, 0.60)
        bottom = (math.cos(ang) * 2.1, math.sin(ang) * 2.1, 0.06)
        rh.add_rod("leg_%d" % k, 0.06, top, bottom, material=gray, parent=root)
        rh.add_cylinder("footpad_%d" % k, 0.22, 0.04, bottom, material=silver, parent=root)

    # --- Escalera ---
    rh.add_rod("ladder", 0.03, (1.25, 0.35, 0.05), (1.05, 0.30, 1.45), material=gray, parent=root)

    # --- Montaje de la etapa de ascenso (nodo vacío; aquí se desprendió) ---
    rh.add_empty("ascent_mount", (0, 0, 1.60), parent=root)

    # --- Antena ---
    ant = rh.add_empty("antenna", (-0.9, -0.7, 1.45), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.02, 0.5, (0, 0, 0.25), material=silver,
                                    parent=ant, depth_segments=5)
    rh.add_cone("antenna_dish", 0.0, 0.18, 0.14, (0, 0, 0.5), material=silver, parent=ant)
    rh.add_bend_shape_key(rod, "antenna_droop", bend_axis="X", up_axis="Z", pivot=0.0, max_angle_deg=22.0)

    # --- Instrumentos EASEP: reflector láser (LRRR, ¡aún funciona hoy!) ---
    rh.add_box("laser_reflector", (0.32, 0.32, 0.12), (1.9, 0.0, 0.10), material=silver, parent=root)
    rh.add_icosphere("reflector_glow", 0.04, (1.9, 0.0, 0.20), subdivisions=2, material=glow, parent=root)
    # --- Sismómetro EASEP ---
    rh.add_box("seismometer", (0.30, 0.22, 0.16), (1.6, -0.6, 0.10), material=dark, parent=root)

    # Anclaje POV (mira hacia fuera desde el cuerpo)
    rh.add_empty("pov_eye", (0.7, 0.0, 1.30), rotation=(0, math.pi / 2, 0), parent=root)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
