# models/opportunity.py — Mars Exploration Rover "Opportunity" (MER-B), estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "opportunity"
LOCATION = "mars"
PI = math.pi


def build():
    P = style.palette()
    glow = style.glow((0.2, 1.0, 0.45))
    root = rh.add_empty("opportunity", (0, 0, 0))

    # Caja de electrónica cálida (dorada, como la real) + cubierta solar azul
    rh.add_rbox("body", (1.5, 0.95, 0.46), (0, 0, 0.52), material=P["gold"], parent=root, radius=0.09)
    rh.add_rbox("deck", (1.56, 1.0, 0.05), (0, 0, 0.78), material=P["solar"], parent=root, radius=0.02)
    rh.add_icosphere("status_light", 0.06, (-0.55, 0.0, 0.86), material=glow, parent=root, scale=(1, 1, 0.8))

    # 6 ruedas con brazos de suspensión (rocker-bogie simplificado)
    for i, x in enumerate((-0.58, 0.0, 0.58)):
        lab = "RMF"[i]
        for side, y in (("L", 0.66), ("R", -0.66)):  # mirando a +X: izquierda = +Y, derecha = -Y
            sgn = 1 if side == "L" else -1
            rh.add_rod("susp_%s%s" % (side, lab), 0.035, (x, sgn * 0.42, 0.50), (x, sgn * 0.62, 0.20),
                       material=P["grey"], parent=root)
            piv = rh.add_empty("wheel_%s%s" % (side, lab), (x, y, 0.17), parent=root)
            rh.add_cylinder("wheel_%s%s_mesh" % (side, lab), 0.17, 0.17, (0, 0, 0),
                            rotation=(PI / 2, 0, 0), material=P["silver"], parent=piv, segments=18)
            rh.add_cylinder("wheel_%s%s_hub" % (side, lab), 0.07, 0.19, (0, 0, 0),
                            rotation=(PI / 2, 0, 0), material=P["kevlar"], parent=piv, segments=10)

    # Paneles solares laterales plegables (alas)
    for side, sgn in (("L", 1), ("R", -1)):
        piv = rh.add_empty("panel_%s" % side, (0.0, sgn * 0.50, 0.80), parent=root)
        rh.add_rbox("panel_%s_mesh" % side, (1.2, 0.5, 0.035), (0, sgn * 0.25, 0.0),
                    material=P["solar"], parent=piv, radius=0.015)

    # Mástil + cabeza Pancam: LA CARA del robot
    mast = rh.add_empty("mast", (0.52, 0.0, 0.80), parent=root)
    rh.add_cylinder("mast_mesh", 0.055, 0.5, (0, 0, 0.25), material=P["white"], parent=mast)
    rh.add_cylinder("mast_collar", 0.085, 0.07, (0, 0, 0.05), material=P["kevlar"], parent=mast)
    head = rh.add_empty("mast_head", (0, 0, 0.58), parent=mast)
    rh.add_rbox("head_shell", (0.32, 0.58, 0.30), (0, 0, 0), material=P["white"], parent=head, radius=0.10)
    rh.add_face(head, (0.165, 0, 0.0), spacing=0.25, size=0.075)
    rh.add_rbox("pancam_bar", (0.10, 0.62, 0.05), (-0.02, 0, 0.20), material=P["dark"], parent=head, radius=0.02)
    for sx in (-0.21, 0.21):
        rh.add_cylinder("pancam_lens", 0.04, 0.06, (0.03, sx, 0.20), rotation=(0, PI / 2, 0),
                        material=P["silver"], parent=head, segments=12)
    rh.add_empty("pov_eye", (0.18, 0, 0.0), rotation=(0, PI / 2, 0), parent=head)

    # Antena de alta ganancia (disco) y baja ganancia (varilla con morph de "tristeza")
    hga = rh.add_empty("dish", (-0.45, 0.30, 0.82), parent=root)
    rh.add_cylinder("hga_stem", 0.03, 0.2, (0, 0, 0.1), material=P["grey"], parent=hga)
    rh.add_cylinder("hga_disc", 0.17, 0.035, (0, 0, 0.24), rotation=(0.5, 0, 0), material=P["copper"],
                    parent=hga, segments=16)
    ant = rh.add_empty("antenna", (-0.62, -0.28, 0.82), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.02, 0.5, (0, 0, 0.25), material=P["white"],
                                    parent=ant, depth_segments=6)
    rh.add_icosphere("antenna_tip", 0.04, (0, 0, 0.51), material=P["kevlar"], parent=ant)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 55.0)

    # Brazo robótico (IDD) con torreta
    arm = rh.add_empty("arm", (0.70, 0.30, 0.52), parent=root)
    rh.add_rod("arm_upper", 0.045, (0, 0, 0), (0.28, 0.05, -0.05), material=P["grey"], parent=arm)
    rh.add_rod("arm_lower", 0.04, (0.28, 0.05, -0.05), (0.56, 0.08, -0.16), material=P["dark"], parent=arm)
    rh.add_rbox("arm_turret", (0.14, 0.14, 0.14), (0.62, 0.08, -0.18), material=P["kevlar"], parent=arm,
                radius=0.04)

    # ---- Animaciones ----
    # Idle: giro suave del mástil (es también el ojo del POV)
    rh.add_clip("Idle", {
        "mast_head": {"rot": rh.loop("rot", [0.0, 0.26, 0.0, -0.26], 120, "Z")},
        "antenna": {"rot": rh.loop("rot", [0.0, 0.06, 0.0, -0.06], 96, "Y")},
    })
    rh.add_clip("Wake", {
        "mast_head": {"rot": [(0, (0, 0.9, 0)), (22, (0, -0.1, 0)), (34, (0, 0, 0))]},
        "panel_L": {"rot": [(0, (1.4, 0, 0)), (30, (0, 0, 0))]},
        "panel_R": {"rot": [(0, (-1.4, 0, 0)), (30, (0, 0, 0))]},
    })
    spin = {"rot": [(0, (0, 0, 0)), (24, (0, 2 * PI, 0))]}
    rh.add_clip("Drive", {"wheel_%s%s" % (s, l): spin for s in "LR" for l in "RMF"}, linear=True)
    rh.add_clip("Death", {
        "mast_head": {"rot": [(0, (0, 0, 0)), (60, (0, 0.85, 0.2))]},
        "panel_L": {"rot": [(0, (0, 0, 0)), (60, (0.15, 0, 0))]},
        "panel_R": {"rot": [(0, (0, 0, 0)), (60, (-0.15, 0, 0))]},
    })
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
