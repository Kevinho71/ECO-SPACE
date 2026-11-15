# models/opportunity.py — Mars Exploration Rover "Opportunity" (MER-B)
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import robot_helpers as rh

NAME = "opportunity"
LOCATION = "mars"


def build():
    # --- Materiales ---
    body = rh.new_material("body_gray", (0.55, 0.57, 0.60), metallic=0.1, roughness=0.5)
    kevlar = rh.new_material("kevlar", (0.72, 0.50, 0.26), metallic=0.0, roughness=0.6)
    solar = rh.new_material("solar_cell", (0.10, 0.14, 0.35), metallic=0.3, roughness=0.4)
    silver = rh.new_material("silver", (0.70, 0.72, 0.75), metallic=0.9, roughness=0.3)
    dark = rh.new_material("dark", (0.05, 0.05, 0.06), metallic=0.1, roughness=0.7)
    glow = rh.new_material("status_glow", (0.0, 0.0, 0.0), metallic=0.0, roughness=0.5,
                           emission=(0.1, 1.0, 0.1), emission_strength=1.0)

    root = rh.add_empty("opportunity", (0, 0, 0))

    # --- Cuerpo (warm electronics box) + cubierta solar ---
    rh.add_box("body", (1.5, 0.9, 0.45), (0, 0, 0.50), material=body, parent=root)
    rh.add_box("deck", (1.5, 0.9, 0.05), (0, 0, 0.75), material=solar, parent=root)

    # Luz de estado (emisiva -> se anima en el corte eléctrico)
    rh.add_icosphere("status_light", 0.07, (0.55, 0.0, 0.80), subdivisions=2, material=glow, parent=root)

    # --- 6 ruedas (cada una sobre su propio pivote para girar) ---
    xs = [-0.55, 0.0, 0.55]
    labels = ["R", "M", "F"]
    for i, x in enumerate(xs):
        for side, y in (("L", -0.55), ("R", 0.55)):
            piv = rh.add_empty("wheel_%s%s" % (side, labels[i]), (x, y, 0.16), parent=root)
            rh.add_cylinder("wheel_%s%s_mesh" % (side, labels[i]), 0.16, 0.18,
                            (0, 0, 0), rotation=(math.pi / 2, 0, 0), material=silver,
                            parent=piv, segments=20)

    # --- Paneles solares laterales (desplegables) ---
    for side, sign in (("L", -1), ("R", 1)):
        piv = rh.add_empty("panel_%s" % side, (0.45, sign * 0.45, 0.72), parent=root)
        rh.add_box("panel_%s_mesh" % side, (0.7, 0.5, 0.03), (0, 0, 0), material=solar, parent=piv)

    # --- Mástil (azimut) + cabeza Pancam (elevación) ---
    mast = rh.add_empty("mast", (0.55, 0, 0.72), parent=root)
    rh.add_cylinder("mast_mesh", 0.05, 0.45, (0, 0, 0.22), material=body, parent=mast)
    head = rh.add_empty("mast_head", (0, 0, 0.50), parent=mast)
    rh.add_box("pancam_bar", (0.28, 0.06, 0.06), (0, 0, 0), material=dark, parent=head)
    rh.add_cylinder("pancam_l", 0.05, 0.12, (-0.07, 0, 0.05), rotation=(0, math.pi / 2, 0), material=silver, parent=head)
    rh.add_cylinder("pancam_r", 0.05, 0.12, (0.07, 0, 0.05), rotation=(0, math.pi / 2, 0), material=silver, parent=head)

    # Anclaje POV (el "ojo" del rover; hereda la orientación del mástil/cabeza)
    rh.add_empty("pov_eye", (0.0, 0, 0.12), rotation=(0, math.pi / 2, 0), parent=head)

    # --- Antena LGA (con morph target de "tristeza") ---
    ant = rh.add_empty("antenna", (-0.55, -0.30, 0.75), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.02, 0.45, (0, 0, 0.22),
                                    material=silver, parent=ant, depth_segments=5)
    rh.add_cone("antenna_dish", 0.0, 0.16, 0.12, (0, 0, 0.45), material=silver, parent=ant)
    rh.add_bend_shape_key(rod, "antenna_droop", bend_axis="X", up_axis="Z", pivot=0.0, max_angle_deg=25.0)

    # --- Brazo robótico (IDD) ---
    arm = rh.add_empty("arm", (0.5, 0.35, 0.55), parent=root)
    rh.add_rod("arm_upper", 0.04, (0, 0, 0.0), (0.30, 0.05, 0.12), material=body, parent=arm)
    rh.add_rod("arm_lower", 0.04, (0.30, 0.05, 0.12), (0.55, 0.05, 0.22), material=body, parent=arm)
    rh.add_box("arm_turret", (0.10, 0.10, 0.10), (0.55, 0.05, 0.28), material=kevlar, parent=arm)

    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
    bpy.context.view_layer.update()
    print("Built", NAME)
