# prep_sun.py — compone la textura del Sol a partir de imágenes REALES del SDO (NASA, dominio público):
#   * HMI "Continuum" (luz visible: color naranja, oscurecimiento del limbo, manchas solares)
#   * AIA 193 Å (estructura de la corona/campos magnéticos), mezclada en modo "soft light"
# Recorta los rótulos de texto (todo fuera del disco queda negro). Salida: public/textures/sun.jpg
# Uso: blender --background --python prep_sun.py
import os
import numpy as np
import bpy

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(BASE, "..", "referencias_nasa", "texturas"))
DST = os.path.abspath(os.path.join(BASE, "..", "public", "textures", "sun.jpg"))
N = 1024


def load(name):
    img = bpy.data.images.load(os.path.join(SRC, name))
    img.scale(N, N)
    a = np.array(img.pixels[:], dtype=np.float32).reshape(N, N, 4)[:, :, :3]
    return a


hmi = load("sun_sdo_HMIIC.jpg")
aia = load("sun_sdo_0193.jpg")

yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
c = N / 2.0
R_HMI = 0.468 * N      # radio del disco solar en la imagen HMI (medido sobre la imagen original)
R_AIA = 0.397 * N      # radio del disco en AIA 193
s = R_HMI / R_AIA

# AIA reescalada para que su disco coincida con el de HMI (muestreo por vecino más cercano)
sx = np.clip(np.round(c + (xx - c) / s).astype(int), 0, N - 1)
sy = np.clip(np.round(c + (yy - c) / s).astype(int), 0, N - 1)
aia_al = aia[sy, sx]
lum = aia_al @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
inside = np.hypot(xx - c, yy - c) < R_HMI
mean = lum[inside].mean()
b = np.clip(0.5 + (lum - mean) * 1.1, 0, 1)[..., None]   # detalle centrado en 0.5 (neutro)

# soft light (fórmula Pegtop)
out = (1 - 2 * b) * hmi ** 2 + 2 * b * hmi
out = np.clip(out, 0, 1) ** np.array([0.92, 1.18, 1.7], dtype=np.float32)  # tono más cálido (menos verdoso)

# máscara circular suave (borra rótulos y bordes)
r = np.hypot(xx - c, yy - c)
mask = np.clip((R_HMI * 1.004 - r) / 2.5, 0, 1)[..., None]
out *= mask

img = bpy.data.images.new("sun_out", N, N)
rgba = np.concatenate([out, np.ones((N, N, 1), dtype=np.float32)], axis=2)
img.pixels.foreach_set(rgba.ravel())
scene = bpy.context.scene
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 90
os.makedirs(os.path.dirname(DST), exist_ok=True)
img.save_render(DST, scene=scene)
print("OK sun ->", DST, os.path.getsize(DST) // 1024, "KB")
