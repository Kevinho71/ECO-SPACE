# models/insight.py — InSight (Marte, Elysium Planitia), estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "insight"
LOCATION = "mars"
PI = math.pi


def build():
    P = style.palette()
    glow = style.glow((0.3, 1.0, 0.6))
    root = rh.add_empty("insight", (0, 0, 0))

    # Cubierta octogonal oscura (como la real) + cuerpo + 3 patas con platos
    rh.add_cylinder("lander_deck", 0.95, 0.10, (0, 0, 1.0), rotation=(0, 0, PI / 8), material=P["carbon"],
                    parent=root, segments=8, flat=True)
    rh.add_rbox("lander_body", (0.9, 0.9, 0.5), (0, 0, 0.65), material=P["white"], parent=root, radius=0.12)
    for k in range(3):
        a = k * 2 * PI / 3 + PI / 3
        top = (math.cos(a) * 0.6, math.sin(a) * 0.6, 0.85)
        bot = (math.cos(a) * 1.35, math.sin(a) * 1.35, 0.06)
        leg = rh.add_empty("leg_%d" % k, top, parent=root)
        rel = (bot[0] - top[0], bot[1] - top[1], bot[2] - top[2])
        rh.add_rod("leg_%d_main" % k, 0.05, (0, 0, 0), rel, material=P["grey"], parent=leg)
        rh.add_cylinder("footpad_%d" % k, 0.22, 0.05, bot, material=P["cream"], parent=root, segments=14)

    # Dos paneles solares circulares (12 lados) con rayos: se despliegan como abanicos
    for side, sgn in (("L", -1), ("R", 1)):
        piv = rh.add_empty("panel_%s" % side, (0.0, sgn * 0.75, 1.0), parent=root)
        rh.add_cylinder("panel_%s_mesh" % side, 1.12, 0.045, (0, sgn * 1.05, 0.0), material=P["solar"],
                        parent=piv, segments=12, flat=True)
        rh.add_cylinder("panel_%s_hub" % side, 0.10, 0.07, (0, sgn * 1.05, 0.0), material=P["kevlar"],
                        parent=piv, segments=10)
        rh.add_cylinder("panel_%s_ring" % side, 1.16, 0.03, (0, sgn * 1.05, -0.02), material=P["gold"],
                        parent=piv, segments=12, flat=True)

    # Instrumentos sobre la cubierta: sismómetro SEIS (cúpula), HP3 "topo", cámara
    rh.add_icosphere("seis_dome", 0.28, (-0.15, 0.0, 1.10), material=P["silver"], parent=root, scale=(1, 1, 0.7))
    rh.add_cylinder("hp3_mole", 0.06, 0.45, (0.30, -0.45, 1.25), material=P["kevlar"], parent=root)

    # Brazo robótico con pinza
    arm = rh.add_empty("arm", (0.25, 0.30, 1.05), parent=root)
    rh.add_rod("arm_upper", 0.04, (0, 0, 0), (0.15, 0.1, 0.55), material=P["grey"], parent=arm)
    rh.add_rod("arm_lower", 0.035, (0.15, 0.1, 0.55), (0.65, 0.2, 0.35), material=P["silver"], parent=arm)
    rh.add_rbox("arm_scoop", (0.12, 0.1, 0.1), (0.70, 0.22, 0.30), material=P["kevlar"], parent=arm, radius=0.03)

    # Cámara/cabeza sobre un cuello: LA CARA (IDC/ICC)
    mast = rh.add_empty("mast", (0.55, 0.0, 1.05), parent=root)
    rh.add_cylinder("mast_mesh", 0.04, 0.4, (0, 0, 0.2), material=P["grey"], parent=mast)
    head = rh.add_empty("mast_head", (0, 0, 0.5), parent=mast)
    rh.add_rbox("imp_camera", (0.26, 0.46, 0.24), (0, 0, 0), material=P["white"], parent=head, radius=0.08)
    rh.add_face(head, (0.135, 0, 0.0), spacing=0.20, size=0.06)
    rh.add_empty("pov_eye", (0.15, 0, 0.0), rotation=(0, PI / 2, 0), parent=head)
    rh.add_icosphere("status_light", 0.05, (0.5, 0.0, 1.12), material=glow, parent=root)

    # Antena UHF
    ant = rh.add_empty("antenna", (-0.5, -0.3, 1.05), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.02, 0.6, (0, 0, 0.3), material=P["white"], parent=ant,
                                    depth_segments=6)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 55.0)

    # Animaciones
    rh.add_clip("Idle", {
        "mast_head": {"rot": rh.loop("rot", [0.0, 0.6, 0.0, -0.6], 96, "Z")},
        "antenna": {"rot": rh.loop("rot", [0.0, 0.05, 0.0, -0.05], 96, "Y")},
    })
    rh.add_clip("Wake", {
        "panel_L": {"rot": [(0, (1.5, 0, 0)), (36, (-0.05, 0, 0)), (46, (0, 0, 0))]},
        "panel_R": {"rot": [(0, (-1.5, 0, 0)), (36, (0.05, 0, 0)), (46, (0, 0, 0))]},
        "mast_head": {"rot": [(0, (0, 0.9, 0)), (30, (0, -0.1, 0)), (40, (0, 0, 0))]},
    })
    rh.add_clip("Dig", {
        "arm": {"rot": [(0, (0, 0, 0)), (30, (0, 0.3, 0.4)), (60, (0, 0.05, 0.1)), (90, (0, 0, 0))]},
    })
    rh.add_clip("Death", {
        "mast_head": {"rot": [(0, (0, 0, 0)), (80, (0, 0.85, 0.1))]},
        "panel_L": {"rot": [(0, (0, 0, 0)), (80, (0.12, 0, 0))]},
        "panel_R": {"rot": [(0, (0, 0, 0)), (80, (-0.12, 0, 0))]},
    })
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
