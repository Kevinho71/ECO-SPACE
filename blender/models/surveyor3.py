# models/surveyor3.py — Surveyor 3 (Luna, Oceanus Procellarum), estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "surveyor3"
LOCATION = "moon"
PI = math.pi


def build():
    P = style.palette()
    glow = style.glow((0.45, 0.95, 1.0))
    root = rh.add_empty("surveyor3", (0, 0, 0))

    # Cuerpo triangular (marco de aluminio) con tres patas y platos de apoyo
    rh.add_rbox("frame_core", (0.75, 0.75, 0.55), (0, 0, 1.05), material=P["white"], parent=root, radius=0.12)
    rh.add_cylinder("frame_ring", 0.62, 0.10, (0, 0, 0.78), material=P["grey"], parent=root, segments=12)
    for k in range(3):
        a = k * 2 * PI / 3 + PI / 6
        top = (math.cos(a) * 0.35, math.sin(a) * 0.35, 0.95)
        bot = (math.cos(a) * 1.45, math.sin(a) * 1.45, 0.10)
        leg = rh.add_empty("leg_%d" % k, top, parent=root)
        rel = (bot[0] - top[0], bot[1] - top[1], bot[2] - top[2])
        rh.add_rod("leg_%d_main" % k, 0.06, (0, 0, 0), rel, material=P["grey"], parent=leg)
        rh.add_cylinder("leg_%d_shock" % k, 0.035, 0.55, (rel[0] * 0.5, rel[1] * 0.5, rel[2] * 0.5 + 0.1),
                        material=P["silver"], parent=leg)
        rh.add_cylinder("footpad_%d" % k, 0.24, 0.06, bot, material=P["cream"], parent=root, segments=16)
        # Compartimento térmico de electrónica en las patas
        rh.add_rbox("comp_%d" % k, (0.38, 0.28, 0.24), (math.cos(a) * 0.62, math.sin(a) * 0.62, 0.62),
                    rotation=(0, 0, a), material=P["gold"], parent=root, radius=0.06)

    # Mástil central con panel solar hexagonal y antena omni
    rh.add_cylinder("solar_mast", 0.05, 0.9, (0, 0, 1.75), material=P["grey"], parent=root)
    rh.add_cylinder("solar_panel", 0.62, 0.05, (0, 0, 2.25), material=P["solar"], parent=root, segments=6, flat=True)
    rh.add_cylinder("antenna_rod", 0.018, 0.55, (0.4, 0.15, 2.5), material=P["white"], parent=root)
    rh.add_icosphere("status_light", 0.055, (-0.25, 0.0, 2.3), material=glow, parent=root)

    # Cámara de TV (¡LA CARA!): cabeza redonda con ojos, mirando hacia +X
    cam = rh.add_empty("tv_camera", (0.0, 0.0, 1.55), parent=root)
    head = rh.add_empty("tv_head", (0.0, 0.0, 0.0), parent=cam)
    rh.add_rbox("tv_shell", (0.46, 0.60, 0.36), (0.38, 0, 0.0), material=P["white"], parent=head, radius=0.13)
    rh.add_face(head, (0.62, 0, 0.0), spacing=0.28, size=0.085)
    rh.add_cylinder("tv_mirror_arm", 0.025, 0.3, (0.38, 0, 0.28), material=P["grey"], parent=head)
    rh.add_rbox("tv_mirror", (0.28, 0.28, 0.03), (0.38, 0, 0.45), rotation=(0, 0.6, 0), material=P["silver"],
                parent=head, radius=0.012)
    rh.add_empty("pov_eye", (0.66, 0, 0.0), rotation=(0, PI / 2, 0), parent=head)

    # Brazo muestreador (pantógrafo) con cucharón
    sam = rh.add_empty("sampler_arm", (0.35, -0.35, 0.95), parent=root)
    rh.add_rod("sampler_upper", 0.035, (0, 0, 0), (0.65, -0.20, -0.10), material=P["grey"], parent=sam)
    rh.add_rod("sampler_lower", 0.03, (0.65, -0.20, -0.10), (1.15, -0.25, -0.55), material=P["silver"], parent=sam)
    rh.add_rbox("sampler_scoop", (0.18, 0.12, 0.08), (1.22, -0.26, -0.60), rotation=(0, 0.5, 0),
                material=P["kevlar"], parent=sam, radius=0.03)

    # Antena de baja ganancia con morph
    ant = rh.add_empty("antenna", (-0.3, 0.25, 0.95), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod2", 0.02, 0.6, (0, 0, 0.3), material=P["white"], parent=ant,
                                    depth_segments=6)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 55.0)

    # Animaciones
    rh.add_clip("Idle", {
        "tv_camera": {"rot": rh.loop("rot", [0.0, 0.7, 0.0, -0.7], 96, "Z")},
        "antenna": {"rot": rh.loop("rot", [0.0, 0.06, 0.0, -0.06], 96, "Y")},
    })
    rh.add_clip("Wake", {
        "tv_camera": {"rot": [(0, (0, 0, 1.6)), (26, (0, 0, -0.15)), (36, (0, 0, 0))]},
    })
    rh.add_clip("Dig", {
        "sampler_arm": {"rot": [(0, (0, 0, 0)), (24, (0, 0.5, 0.35)), (48, (0, 0.15, 0.1)), (72, (0, 0, 0))]},
    })
    rh.add_clip("Death", {
        "tv_camera": {"rot": [(0, (0, 0, 0)), (70, (0, 0.8, 0.1))]},
        "antenna": {"rot": [(0, (0, 0, 0)), (70, (0.35, 0, 0))]},
    })
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
