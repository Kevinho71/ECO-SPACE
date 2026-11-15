# models/surveyor3.py — Surveyor 3 (Luna)
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "surveyor3"
LOCATION = "moon"


def build():
    # --- Materiales ---
    body = rh.new_material("body", (0.80, 0.80, 0.82), metallic=0.2, roughness=0.4)
    solar = rh.new_material("solar_cell", (0.10, 0.14, 0.35), metallic=0.3, roughness=0.4)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(1.0, 0.5, 0.2), emission_strength=1.0)

    root = rh.add_empty("surveyor3", (0, 0, 0))

    # --- Cuerpo central ---
    rh.add_cylinder("body", 0.35, 0.60, (0, 0, 1.05), material=body, parent=root, segments=12)
    rh.add_cylinder("body_top", 0.30, 0.10, (0, 0, 1.40), material=dark, parent=root, segments=12)

    rh.add_icosphere("status_light", 0.04, (0.20, 0, 1.25), subdivisions=2, material=glow, parent=root)

    # --- 3 patas ---
    for k in range(3):
        ang = math.radians(90 + k * 120)
        top = (math.cos(ang) * 0.30, math.sin(ang) * 0.30, 0.78)
        bottom = (math.cos(ang) * 0.95, math.sin(ang) * 0.95, 0.05)
        rh.add_rod("leg_%d" % k, 0.035, top, bottom, material=silver, parent=root)
        rh.add_cylinder("footpad_%d" % k, 0.13, 0.03, bottom, material=dark, parent=root)

    # --- Panel solar (en mástil, inclinable) ---
    solar_piv = rh.add_empty("solar_panel", (0, -0.25, 1.50), parent=root)
    rh.add_cylinder("solar_mast", 0.03, 0.30, (0, 0, 0.10), material=silver, parent=solar_piv)
    rh.add_box("solar_array", (0.60, 0.45, 0.03), (0, 0, 0.35), material=solar, parent=solar_piv)

    # --- Antena plana (con morph de flexión) ---
    ant = rh.add_empty("antenna", (0, 0.20, 1.42), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.02, 0.55, (0, 0, 0.28), material=silver,
                                    parent=ant, depth_segments=5)
    rh.add_box("planar_antenna", (0.5, 0.05, 0.4), (0, 0, 0.60), material=silver, parent=ant)
    rh.add_bend_shape_key(rod, "antenna_droop", bend_axis="X", up_axis="Z", pivot=0.0, max_angle_deg=20.0)

    # --- Muestreador de superficie (brazo + pala) ---
    sampler = rh.add_empty("sampler", (0.28, 0.15, 0.90), parent=root)
    rh.add_rod("sampler_arm", 0.025, (0, 0, 0.0), (0.35, 0.10, -0.15), material=silver, parent=sampler)
    rh.add_box("sampler_scoop", (0.10, 0.12, 0.06), (0.40, 0.10, -0.18), material=dark, parent=sampler)

    # --- Cámara de TV + anclaje POV ---
    rh.add_box("tv_camera", (0.16, 0.14, 0.14), (0.30, 0, 1.30), material=dark, parent=root)
    rh.add_empty("pov_eye", (0.34, 0, 1.30), rotation=(0, math.pi / 2, 0), parent=root)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
