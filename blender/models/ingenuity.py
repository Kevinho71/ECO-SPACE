# models/ingenuity.py — Ingenuity (helicóptero de Marte), estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "ingenuity"
LOCATION = "mars"
PI = math.pi


def build():
    P = style.palette()
    glow = style.glow((0.3, 1.0, 0.7))
    root = rh.add_empty("ingenuity", (0, 0, 0))

    # Fuselaje (cubo blanco redondeado) con LA CARA al frente
    rh.add_rbox("fuselage", (0.55, 0.55, 0.50), (0, 0, 0.95), material=P["white"], parent=root, radius=0.14)
    rh.add_face(root, (0.285, 0, 0.97), spacing=0.26, size=0.075)
    rh.add_empty("pov_eye", (0.3, 0, 0.97), rotation=(0, PI / 2, 0), parent=root)
    rh.add_icosphere("status_light", 0.05, (0.0, 0.29, 0.82), material=glow, parent=root)
    rh.add_rbox("body_band", (0.57, 0.57, 0.07), (0, 0, 0.78), material=P["gold"], parent=root, radius=0.03)

    # 4 patas de fibra de carbono con pies
    for k in range(4):
        a = PI / 4 + k * PI / 2
        top = (math.cos(a) * 0.22, math.sin(a) * 0.22, 0.80)
        bot = (math.cos(a) * 0.75, math.sin(a) * 0.75, 0.05)
        rh.add_rod("leg_%d" % k, 0.025, top, bot, material=P["carbon"], parent=root)
        rh.add_cone("foot_%d" % k, 0.10, 0.03, 0.05, bot, material=P["silver"], parent=root, segments=10)

    # Panel solar en lo alto + antena
    rh.add_rbox("solar_panel", (0.95, 0.38, 0.04), (0, 0, 1.78), material=P["solar"], parent=root, radius=0.015)
    ant = rh.add_empty("antenna", (-0.25, 0.0, 1.80), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.012, 0.35, (0, 0, 0.17), material=P["white"], parent=ant,
                                    depth_segments=5)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 60.0)

    # Mástil de rotores + 2 rotores coaxiales contra-rotantes de 2 palas
    rh.add_cylinder("rotor_mast", 0.035, 0.7, (0, 0, 1.4), material=P["silver"], parent=root)
    for name, z, ph in (("rotor_bottom", 1.28, 0.0), ("rotor_top", 1.56, PI / 2)):
        piv = rh.add_empty(name, (0, 0, z), rotation=(0, 0, ph), parent=root)
        rh.add_cylinder(name + "_hub", 0.07, 0.07, (0, 0, 0), material=P["silver"], parent=piv)
        for s, sgn in (("a", 1), ("b", -1)):
            blade = rh.add_icosphere("%s_blade_%s" % (name, s), 1.0, (sgn * 0.62, 0, 0), material=P["carbon"],
                                     parent=piv, scale=(1.05, 0.12, 0.025))
    # Morph de aspa dañada (vuelo 72)
    dmg = rh.add_box_segmented("rotor_damage", (0.9, 0.10, 0.02), (0, 0, -0.35), material=P["carbon"],
                               parent=root, seg_axis="X", segments=8)
    dmg.hide_render = True
    rh.add_bend_shape_key(dmg, "rotor_damage", "Z", "X", 0.0, 35.0)

    # Animaciones: rotores contra-rotantes (lineales)
    top_spin = {"rot": [(0, (0, 0, PI / 2)), (6, (0, 0, PI / 2 + 2 * PI))]}
    bot_spin = {"rot": [(0, (0, 0, 0)), (6, (0, 0, -2 * PI))]}
    rh.add_clip("Fly", {"rotor_top": top_spin, "rotor_bottom": bot_spin,
                        "ingenuity": {"loc": [(0, (0, 0, 0)), (24, (0, 0, 1.2)), (48, (0, 0, 0))]}}, linear=True)
    slow_t = {"rot": [(0, (0, 0, PI / 2)), (96, (0, 0, PI / 2 + 0.6))]}
    slow_b = {"rot": [(0, (0, 0, 0)), (96, (0, 0, -0.6))]}
    rh.add_clip("Idle", {"rotor_top": slow_t, "rotor_bottom": slow_b,
                         "antenna": {"rot": rh.loop("rot", [0.0, 0.08, 0.0, -0.08], 96, "Y")}}, linear=True)
    rh.add_clip("Wake", {"rotor_top": {"rot": [(0, (0, 0, PI / 2)), (30, (0, 0, PI / 2 + 2 * PI))]},
                         "rotor_bottom": {"rot": [(0, (0, 0, 0)), (30, (0, 0, -2 * PI))]}}, linear=True)
    rh.add_clip("Death", {"antenna": {"rot": [(0, (0, 0, 0)), (60, (0.4, 0, 0))]},
                          "rotor_top": {"rot": [(0, (0, 0, PI / 2)), (60, (0.15, 0, PI / 2))]}})
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
