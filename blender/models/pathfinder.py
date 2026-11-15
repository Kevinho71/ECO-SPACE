# models/pathfinder.py — Mars Pathfinder + Sojourner, estilo Robot Expressive
import os
import sys
import math

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import bpy
import robot_helpers as rh
import style

NAME = "pathfinder"
LOCATION = "mars"
PI = math.pi


def build():
    P = style.palette()
    glow = style.glow((0.35, 1.0, 0.55))
    root = rh.add_empty("pathfinder", (0, 0, 0))

    # Cuerpo tetraédrico (vértices a 0°, 120°, 240°) sobre una base triangular
    rh.add_cone("lander_body", 0.55, 0.20, 0.65, (0, 0, 0.40), material=P["white"], parent=root, segments=3)
    rh.add_cylinder("lander_base", 0.55, 0.10, (0, 0, 0.05), material=P["grey"], parent=root, segments=3, flat=True)

    # 3 pétalos triangulares PEGADOS AL SUELO, uno sobre cada lado de la base.
    # El pivote (bisagra) está en el borde de la base; la punta apunta hacia fuera.
    R = 0.55                      # radio del triángulo (la base tiene lado R*sqrt(3))
    apothem = R / 2               # distancia del centro al punto medio de cada lado
    for k in range(3):
        a = PI / 3 + k * 2 * PI / 3   # 60°, 180°, 300°: punto medio de cada lado
        piv = rh.add_empty("petal_%d" % k, (math.cos(a) * apothem, math.sin(a) * apothem, 0.03),
                           rotation=(0, 0, a), parent=root)
        rh.add_cylinder("petal_%d_mesh" % k, R, 0.05, (R / 2, 0, 0), material=P["gold"], parent=piv,
                        segments=3, flat=True)
        rh.add_rbox("petal_%d_solar" % k, (0.40, 0.30, 0.03), (0.27, 0, 0.04), material=P["solar"],
                    parent=piv, radius=0.012)

    # Mástil IMP: cabeza con cámaras estéreo = LA CARA
    mast = rh.add_empty("mast", (0, 0, 0.72), parent=root)
    rh.add_cylinder("mast_mesh", 0.045, 0.5, (0, 0, 0.25), material=P["grey"], parent=mast)
    head = rh.add_empty("mast_head", (0, 0, 0.58), parent=mast)
    rh.add_rbox("imp_shell", (0.30, 0.50, 0.28), (0, 0, 0), material=P["white"], parent=head, radius=0.09)
    rh.add_face(head, (0.155, 0, 0.0), spacing=0.22, size=0.065)
    rh.add_cylinder("imp_dish", 0.13, 0.03, (-0.05, 0, 0.22), rotation=(0, 0.6, 0), material=P["silver"],
                    parent=head, segments=14)
    rh.add_empty("pov_eye", (0.17, 0, 0.0), rotation=(0, PI / 2, 0), parent=head)
    rh.add_icosphere("status_light", 0.05, (0.08, 0.0, 0.78), material=glow, parent=root)

    # Antena de baja ganancia
    ant = rh.add_empty("antenna", (-0.12, 0.10, 0.70), parent=root)
    rod = rh.add_segmented_cylinder("antenna_rod", 0.018, 0.55, (0, 0, 0.27), material=P["white"], parent=ant,
                                    depth_segments=6)
    rh.add_bend_shape_key(rod, "antenna_droop", "X", "Z", 0.0, 55.0)

    # Airbags desinflados en el suelo, entre los pétalos (0°, 120°, 240°)
    for k in range(3):
        a = k * 2 * PI / 3
        rh.add_icosphere("airbag_%d" % k, 0.30, (math.cos(a) * 1.30, math.sin(a) * 1.30, 0.10),
                         material=P["cream"], parent=root, scale=(1, 1, 0.38))

    # Sojourner: mini rover de 6 ruedas con su propia carita
    SA = PI / 3  # sobre el primer pétalo, mirando hacia fuera
    ux, uy = math.cos(SA), math.sin(SA)
    soj = rh.add_empty("sojourner", (ux * 0.55, uy * 0.55, 0.055), rotation=(0, 0, SA), parent=root)
    rh.add_rbox("soj_body", (0.38, 0.28, 0.14), (0, 0, 0.19), material=P["gold"], parent=soj, radius=0.04)
    rh.add_rbox("soj_solar", (0.40, 0.30, 0.025), (0, 0, 0.28), material=P["solar"], parent=soj, radius=0.01)
    rh.add_icosphere("soj_status", 0.025, (-0.12, 0, 0.32), material=glow, parent=soj)
    smast = rh.add_empty("soj_mast", (0.17, 0, 0.28), parent=soj)
    rh.add_cylinder("soj_mast_mesh", 0.015, 0.12, (0, 0, 0.06), material=P["grey"], parent=smast)
    rh.add_rbox("soj_head", (0.08, 0.14, 0.07), (0, 0, 0.14), material=P["white"], parent=smast, radius=0.02)
    for i, x in enumerate((-0.14, 0.0, 0.14)):
        for side, y in (("L", -0.18), ("R", 0.18)):
            p = rh.add_empty("soj_wheel_%s%d" % (side, i), (x, y, 0.07), parent=soj)
            rh.add_cylinder("soj_wheel_%s%d_mesh" % (side, i), 0.07, 0.06, (0, 0, 0), rotation=(PI / 2, 0, 0),
                            material=P["silver"], parent=p, segments=14)

    # Animaciones
    rh.add_clip("Idle", {
        "mast_head": {"rot": rh.loop("rot", [0.0, 0.6, 0.0, -0.6], 96, "Z")},
        "antenna": {"rot": rh.loop("rot", [0.0, 0.06, 0.0, -0.06], 96, "Y")},
    })
    yaw = lambda k: PI / 3 + k * 2 * PI / 3  # orientación fija de cada pétalo (se conserva en el clip)
    rh.add_clip("Open", {
        "petal_%d" % k: {"rot": [(0, (0, -1.2, yaw(k))), (30, (0, 0.08, yaw(k))), (42, (0, 0, yaw(k)))]}
        for k in range(3)
    })
    spin = {"rot": [(0, (0, 0, 0)), (24, (0, 2 * PI, 0))]}
    tr = {"soj_wheel_%s%d" % (s, i): spin for s in "LR" for i in range(3)}
    tr["sojourner"] = {"loc": [(0, (ux * 0.55, uy * 0.55, 0.055)), (36, (ux * 1.05, uy * 1.05, 0.055)),
                               (46, (ux * 1.2, uy * 1.2, 0.0)), (96, (ux * 2.1, uy * 2.1, 0.0))]}
    rh.add_clip("Drive", tr, linear=True)
    rh.add_clip("Death", {
        **{"petal_%d" % k: {"rot": [(0, (0, 0, yaw(k))), (70, (0, 0.12, yaw(k)))]} for k in range(3)},
        "mast_head": {"rot": [(0, (0, 0, 0)), (70, (0, 0.8, 0.15))]},
        "antenna": {"rot": [(0, (0, 0, 0)), (70, (0.35, 0, 0))]},
    })
    return root


if __name__ == "__main__":
    rh.clear_scene()
    build()
