# models/insight.py — InSight lander (Mars)
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "insight"
LOCATION = "mars"


def build():
    # --- Materiales ---
    deck_mat = rh.new_material("deck", (0.75, 0.72, 0.60), metallic=0.2, roughness=0.5)
    solar = rh.new_material("solar_cell", (0.10, 0.14, 0.35), metallic=0.3, roughness=0.4)
    gold = rh.new_material("gold_foil", (0.85, 0.70, 0.25), metallic=0.8, roughness=0.4)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(0.2, 0.8, 1.0), emission_strength=1.0)

    root = rh.add_empty("insight", (0, 0, 0))

    # --- Plataforma hexagonal (deck) ---
    rh.add_cylinder("deck", 1.0, 0.15, (0, 0, 0.90), material=deck_mat, parent=root, segments=6)
    rh.add_cylinder("deck_top", 0.55, 0.10, (0, 0, 1.03), material=gold, parent=root, segments=6)

    # Luz de estado
    rh.add_icosphere("status_light", 0.06, (0, 0, 1.15), subdivisions=2, material=glow, parent=root)

    # Anclaje POV (mira al horizonte desde la cubierta)
    rh.add_empty("pov_eye", (0, 0, 1.10), rotation=(0, math.pi / 2, 0), parent=root)

    # --- 3 patas ---
    for k in range(3):
        ang = math.radians(90 + k * 120)
        top = (math.cos(ang) * 0.85, math.sin(ang) * 0.85, 0.82)
        bottom = (math.cos(ang) * 1.55, math.sin(ang) * 1.55, 0.05)
        rh.add_rod("leg_%d" % k, 0.05, top, bottom, material=silver, parent=root)
        rh.add_cylinder("footpad_%d" % k, 0.14, 0.03, bottom, material=dark, parent=root)

    # --- 2 paneles solares circulares (desplegables) ---
    for side, sign in (("L", -1), ("R", 1)):
        piv = rh.add_empty("panel_%s" % side, (0, sign * 0.55, 0.90), parent=root)
        rh.add_cylinder("panel_%s_mesh" % side, 1.05, 0.03, (0, sign * 0.75, 0.0),
                        material=solar, parent=piv, segments=24)

    # --- Brazo robótico (IDA) ---
    arm = rh.add_empty("arm", (0.35, 0.45, 1.00), parent=root)
    rh.add_rod("arm_upper", 0.04, (0, 0, 0.0), (0.35, 0.30, -0.15), material=silver, parent=arm)
    rh.add_rod("arm_lower", 0.04, (0.35, 0.30, -0.15), (0.70, 0.65, -0.25), material=silver, parent=arm)
    rh.add_box("arm_scoop", (0.16, 0.10, 0.06), (0.78, 0.70, -0.28), material=dark, parent=arm)

    # --- Instrumentos desplegados en la superficie ---
    rh.add_icosphere("seis_dome", 0.18, (1.35, 0.0, 0.12), subdivisions=3, material=dark, parent=root)
    rh.add_cylinder("hp3_mole", 0.05, 0.30, (1.75, 0.35, 0.15), material=gold, parent=root)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
