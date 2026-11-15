# style.py — paleta compartida estilo "Robot Expressive": colores limpios y juguetones,
# poco metálicos (leen bien con luz suave), inspirados en los colores reales de la NASA.
import robot_helpers as rh


def palette():
    m = rh.new_material
    return dict(
        white=m("white", (0.92, 0.91, 0.87), 0.0, 0.55),
        cream=m("cream", (0.86, 0.80, 0.66), 0.0, 0.6),
        grey=m("grey", (0.55, 0.57, 0.62), 0.1, 0.5),
        dark=m("dark", (0.09, 0.10, 0.13), 0.1, 0.6),
        gold=m("gold", (0.95, 0.66, 0.18), 0.35, 0.4),
        kevlar=m("kevlar", (0.90, 0.44, 0.14), 0.0, 0.6),
        solar=m("solar", (0.10, 0.20, 0.55), 0.2, 0.35),
        silver=m("silver", (0.78, 0.80, 0.84), 0.45, 0.35),
        copper=m("copper", (0.72, 0.38, 0.20), 0.4, 0.45),
        carbon=m("carbon", (0.16, 0.17, 0.19), 0.2, 0.45),
    )


def glow(color=(0.2, 1.0, 0.45), strength=1.5):
    """Material emisivo de la luz de estado (nodo `status_light`)."""
    return rh.new_material("status_glow", (0.0, 0.0, 0.0), 0.0, 0.5, emission=color,
                           emission_strength=strength)
