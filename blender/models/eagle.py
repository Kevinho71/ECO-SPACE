# models/eagle.py — Apollo 11 LM "Eagle" (etapa de descenso, Luna), estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "eagle"
LOCATION = "moon"
PI = math.pi


def build():
    P = style.palette()
    glow = style.glow((1.0, 0.85, 0.35))
    root = rh.add_empty("eagle", (0, 0, 0))

    # Etapa de descenso: octágono dorado (lámina térmica) redondeado + cubierta superior
    rh.add_cylinder("descent_stage", 1.45, 0.95, (0, 0, 1.05), rotation=(0, 0, PI / 8), material=P["gold"],
                    parent=root, segments=8, flat=True)
    rh.add_rbox("descent_deck", (2.5, 2.5, 0.10), (0, 0, 1.55), material=P["cream"], parent=root, radius=0.04)
    # Motor de descenso (campana) bajo el cuerpo
    rh.add_cone("descent_engine", 0.55, 0.20, 0.55, (0, 0, 0.35), material=P["dark"], parent=root)
    # Tanques redondos laterales
    for k in range(4):
        a = PI / 4 + k * PI / 2 + PI / 4
        rh.add_icosphere("tank_%d" % k, 0.38, (math.cos(a) * 0.95, math.sin(a) * 0.95, 1.85),
                         material=P["silver"], parent=root, scale=(1, 1, 0.9))

    # LA CARA: placa frontal con ojos (como las ventanas del módulo)
    face_plate = rh.add_empty("face_plate", (1.38, 0, 1.05), parent=root)
    rh.add_rbox("forehead", (0.12, 1.25, 0.60), (0, 0, 0), material=P["white"], parent=face_plate, radius=0.05)
    rh.add_face(face_plate, (0.07, 0, 0), spacing=0.55, size=0.17)
    rh.add_icosphere("status_light", 0.07, (0.1, 0, -0.38), material=glow, parent=face_plate)
    rh.add_empty("pov_eye", (0.2, 0, 0), rotation=(0, PI / 2, 0), parent=face_plate)

    # 4 patas articuladas + platos de apoyo (gold)
    for k in range(4):
        a = PI / 4 + k * PI / 2
        top = (math.cos(a) * 1.25, math.sin(a) * 1.25, 0.95)
        bottom = (math.cos(a) * 2.35, math.sin(a) * 2.35, 0.13)
        leg = rh.add_empty("leg_%d" % k, top, parent=root)
        rel = (bottom[0] - top[0], bottom[1] - top[1], bottom[2] - top[2])
        rh.add_rod("leg_%d_main" % k, 0.075, (0, 0, 0), rel, material=P["grey"], parent=leg)
        rh.add_rod("leg_%d_brace" % k, 0.05, (-math.cos(a) * 0.55, -math.sin(a) * 0.55, -0.35), rel,
                   material=P["dark"], parent=leg)
        rh.add_cylinder("footpad_%d" % k, 0.30, 0.06, bottom, material=P["gold"], parent=root, segments=20)

    # Escalera
    ladder = rh.add_empty("ladder", (1.45, -0.45, 0.30), parent=root)
    for s in (-0.12, 0.12):
        rh.add_rod("ladder_rail", 0.03, (0, s, 0), (0.95, s - 0.05, 1.0), material=P["white"], parent=ladder)
    for i in range(5):
        t = i / 4
        rh.add_rod("ladder_rung", 0.02, (0.95 * t, -0.12, 1.0 * t), (0.95 * t, 0.12, 1.0 * t),
                   material=P["white"], parent=ladder)

    # Antena de banda S (plato) con morph de tristeza
    dish = rh.add_empty("dish", (-0.8, 0.5, 1.6), parent=root)
    rh.add_dish("dish_mesh", 0.42, 0.14, (0, 0, 0.25), rotation=(-0.6, 0.4, 0), material=P["silver"], parent=dish)
    rh.add_cylinder("dish_stem", 0.04, 0.3, (0, 0, 0.12), material=P["grey"], parent=dish)
    ant = rh.add_empty("antenna", (0.0, -0.7, 1.6), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.025, 0.7, (0, 0, 0.35), material=P["white"], parent=ant,
                                    depth_segments=6)
    rh.add_icosphere("antenna_tip", 0.05, (0, 0, 0.72), material=P["kevlar"], parent=ant)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 50.0)

    # Instrumentos EASEP en el suelo: reflector láser (¡aún funciona!) y sismómetro
    refl = rh.add_empty("laser_reflector", (3.0, 0.2, 0.0), parent=root)
    rh.add_rbox("reflector_base", (0.5, 0.5, 0.12), (0, 0, 0.08), material=P["silver"], parent=refl, radius=0.04)
    rh.add_rbox("reflector_panel", (0.40, 0.40, 0.04), (0, 0, 0.18), rotation=(0, -0.5, 0), material=P["solar"],
                parent=refl, radius=0.015)
    seis = rh.add_empty("seismometer", (2.6, -1.0, 0.0), parent=root)
    rh.add_cylinder("seis_body", 0.22, 0.22, (0, 0, 0.12), material=P["kevlar"], parent=seis, segments=12)
    rh.add_icosphere("seis_dome", 0.18, (0, 0, 0.26), material=P["gold"], parent=seis, scale=(1, 1, 0.7))
    rh.add_empty("ascent_mount", (0, 0, 1.62), parent=root)

    # Animaciones
    rh.add_clip("Idle", {
        "dish": {"rot": rh.loop("rot", [0.0, 0.5, 0.0, -0.5], 96, "Z")},
        "antenna": {"rot": rh.loop("rot", [0.0, 0.05, 0.0, -0.05], 96, "Y")},
    })
    rh.add_clip("Wake", {
        "face_plate": {"rot": [(0, (0, 0, 0)), (8, (0, 0.4, 0)), (16, (0, -0.1, 0)), (24, (0, 0, 0))]},
        "dish": {"rot": [(0, (0, 0.9, 0)), (30, (0, 0, 0))]},
    })
    rh.add_clip("Land", {
        "leg_%d" % k: {"rot": [(0, (0.12, 0.12, 0)), (10, (-0.04, -0.04, 0)), (20, (0, 0, 0))]} for k in range(4)
    })
    rh.add_clip("Death", {
        "dish": {"rot": [(0, (0, 0, 0)), (60, (0, 0.7, 0.3))]},
        "antenna": {"rot": [(0, (0, 0, 0)), (60, (0.4, 0, 0))]},
    })
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
