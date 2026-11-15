# models/pioneer10.py — Pioneer 10 (espacio profundo), estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "pioneer10"
LOCATION = "beyond"
PI = math.pi
Y90 = (0, PI / 2, 0)  # lleva el +Z local del plato hacia +X


def build():
    P = style.palette()
    glow = style.glow((0.35, 0.85, 1.0))
    root = rh.add_empty("pioneer10", (0, 0, 0))

    # Plato de alta ganancia (2.74 m): disco cóncavo, apunta a +X (hacia la Tierra)
    dish = rh.add_empty("dish", (0, 0, 0), parent=root)
    rh.add_dish("dish_mesh", 1.5, 0.55, (-0.55, 0, 0), rotation=Y90, material=P["white"], parent=dish,
                rings=7, segs=28, thickness=0.06)

    # Compartimento hexagonal de equipos tras el plato (dorado)
    rh.add_cylinder("bus", 0.62, 0.42, (-0.78, 0, 0), rotation=Y90, material=P["gold"], parent=root,
                    segments=6, flat=True)

    # Tres puntales + alimentador/cabeza al frente: LA CARA mira hacia +X
    head = rh.add_empty("feed_head", (0.55, 0, 0), parent=root)
    for a in (PI / 2, PI / 2 + 2 * PI / 3, PI / 2 + 4 * PI / 3):
        rh.add_rod("feed_strut", 0.022, (-0.50, math.cos(a) * 0.95, math.sin(a) * 0.95), (0.0, 0, 0),
                   material=P["grey"], parent=head)
    rh.add_rbox("feed_horn", (0.28, 0.46, 0.34), (0.08, 0, 0), material=P["white"], parent=head, radius=0.10)
    rh.add_face(head, (0.225, 0, 0.0), spacing=0.20, size=0.060)
    rh.add_empty("pov_eye", (0.24, 0, 0.0), rotation=Y90, parent=head)

    # Brazos con los generadores RTG (2 pares) y botalón del magnetómetro
    for side, sgn in (("L", -1), ("R", 1)):
        boom = rh.add_empty("rtg_boom_%s" % side, (-0.85, sgn * 0.45, 0.0), parent=root)
        rh.add_rod("rtg_arm_%s" % side, 0.03, (0, 0, 0), (-0.1, sgn * 1.9, 0.1), material=P["grey"], parent=boom)
        for j, f in enumerate((0.55, 0.95)):
            rh.add_cylinder("rtg_%s_%d" % (side, j), 0.13, 0.52, (-0.1 * f, sgn * (1.9 * f), 0.1 * f),
                            rotation=(PI / 2, 0, 0), material=P["silver"], parent=boom, segments=14)
            rh.add_cylinder("rtg_%s_%d_cap" % (side, j), 0.14, 0.08, (-0.1 * f, sgn * (1.9 * f), 0.1 * f),
                            rotation=(PI / 2, 0, 0), material=P["kevlar"], parent=boom, segments=14)
    mag = rh.add_empty("mag_boom", (-0.85, 0, -0.45), parent=root)
    rh.add_rod("mag_rod", 0.02, (0, 0, 0), (-0.35, 0.2, -1.9), material=P["grey"], parent=mag)
    rh.add_rbox("mag_sensor", (0.12, 0.12, 0.12), (-0.37, 0.2, -1.95), material=P["gold"], parent=mag, radius=0.03)

    # Placa de oro con el mensaje de la humanidad (en un puntal del plato)
    rh.add_rbox("golden_plaque", (0.04, 0.46, 0.30), (-0.02, 0.0, -0.64), material=P["gold"], parent=root,
                radius=0.012)
    rh.add_cone("antenna_omni", 0.04, 0.0, 0.4, (-1.2, 0.0, 0.0), rotation=(0, -PI / 2, 0),
                material=P["white"], parent=root)

    # Luz de estado + antena con morph
    rh.add_icosphere("status_light", 0.07, (-1.05, 0.0, 0.55), material=glow, parent=root)
    ant = rh.add_empty("antenna", (-1.0, 0.3, 0.3), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.015, 0.5, (0, 0, 0.25), material=P["white"], parent=ant,
                                    depth_segments=6)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 55.0)

    # Animaciones
    rh.add_clip("Idle", {
        "dish": {"rot": rh.loop("rot", [0.0, 0.04, 0.0, -0.04], 96, "Z")},
        "feed_head": {"rot": rh.loop("rot", [0.0, 0.3, 0.0, -0.3], 96, "X")},
        "mag_boom": {"rot": rh.loop("rot", [0.0, 0.05, 0.0, -0.05], 96, "X")},
    })
    spin = {"rot": [(0, (0, 0, 0)), (96, (2 * PI, 0, 0))]}
    rh.add_clip("Spin", {"pioneer10": spin}, linear=True)
    rh.add_clip("Wake", {"feed_head": {"rot": [(0, (1.6, 0.4, 0)), (20, (-0.15, 0, 0)), (30, (0, 0, 0))]}})
    rh.add_clip("Death", {"feed_head": {"rot": [(0, (0, 0, 0)), (80, (0, 0.5, 0.3))]},
                          "antenna": {"rot": [(0, (0, 0, 0)), (80, (0.4, 0, 0))]}})
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
