# prep_textures.py — reduce las texturas NASA (referencias_nasa/texturas) para la web.
# Uso: blender --background --python prep_textures.py
# Salida: ../public/textures/<nombre>.jpg (máx. 2048 px de ancho, JPEG 85)
import os
import bpy

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(BASE, "..", "referencias_nasa", "texturas"))
DST = os.path.abspath(os.path.join(BASE, "..", "public", "textures"))
os.makedirs(DST, exist_ok=True)

# salida -> archivo fuente (si difiere). La Luna usa el mapa equirectangular LRO (CGI Moon Kit, NASA SVS 4720).
SOURCES = {"moon": "moon_lro_2k.tif"}
WANTED = {"earth": 2048, "moon": 2048, "mars": 2048, "venus": 1024, "jupiter": 1024,
          "saturn": 1024, "neptune": 1024, "stars_hipparcos": 2048, "phobos": 512}

scene = bpy.context.scene
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 85

for name, maxw in WANTED.items():
    src = os.path.join(SRC, SOURCES.get(name, name + ".jpg"))
    if not os.path.exists(src):
        print("[skip]", src)
        continue
    img = bpy.data.images.load(src)
    w, h = img.size
    if w > maxw:
        img.scale(maxw, int(h * maxw / w))
    out = os.path.join(DST, name + ".jpg")
    img.save_render(out, scene=scene)
    print("OK", name, "%dx%d -> %dx%d" % (w, h, img.size[0], img.size[1]), os.path.getsize(out) // 1024, "KB")
