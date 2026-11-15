# Guía de creación y exportación de modelos (Blender → GLB)

Esta carpeta genera, de forma **procedural** (sin modelado manual), los 7 robots de la NASA para el proyecto **EcoSpace — Abandoned but not Forgotten**. Cada modelo se construye con código Python de Blender y se exporta a `glTF/GLB` listo para cargar en Three.js / `@react-three/fiber`.

---

## 1. Qué hay en esta carpeta

```
blender/
├─ robot_helpers.py       # Funciones reutilizables (primitivas, materiales, pivotes, morph, export)
├─ build_all.py           # Construye y exporta todos los modelos
├─ models/
│  ├─ __init__.py
│  ├─ eagle.py            # 🌕 Apollo 11 LM (etapa de descenso)
│  ├─ surveyor3.py        # 🌕 Surveyor 3
│  ├─ pathfinder.py       # 🔴 Mars Pathfinder + Sojourner
│  ├─ opportunity.py      # 🔴 Opportunity (MER)
│  ├─ insight.py          # 🔴 InSight
│  ├─ ingenuity.py        # 🔴 Ingenuity (helicóptero)
│  └─ pioneer10.py        # 🪐 Pioneer 10
└─ GUIA.md                # Este documento
```

**Salida:** `../public/models/<luna|marte|mas alla>/<nombre>.glb`

---

## 2. Requisitos

- **Blender 3.0 o superior** (probado con **5.3**).
- En Windows, ruta típica del ejecutable:
  `C:\Program Files\Blender Foundation\Blender 5.3\blender.exe`

> Si tu versión/path es distinto, ajusta los comandos siguientes.

---

## 3. Cómo ejecutarlo

### A) Construir y exportar TODOS los modelos

Desde PowerShell, dentro de la carpeta `blender/`:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" --background --python build_all.py
```

Esto genera los 7 `.glb` en `../public/models/…`.

### B) Construir y exportar UN solo modelo

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" --background --python build_all.py -- opportunity
```

Cambia `opportunity` por cualquiera de: `eagle`, `surveyor3`, `pathfinder`, `opportunity`, `insight`, `ingenuity`, `pioneer10`.

### C) Ejecutar un script de modelo suelto (solo construye, no exporta)

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" --background --python models\opportunity.py
```

---

## 4. Inspección visual (GUI de Blender)

**La forma más rápida** es usar `preview.py`, que abre Blender con el modelo ya cargado:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" --python "C:\Users\Usuario\OneDrive - UCB\PROYECTOS VS CODE\ECOSPACE\blender\preview.py" -- opportunity
```

(Cambia `opportunity` por cualquier nombre de misión.) Una vez abierto: pulsa **Z → Material Preview** para ver colores y el material emisivo, y **Inicio** para encuadrar.

Para ver/ajustar un modelo manualmente desde la pestaña Scripting:

1. Abre Blender con la GUI.
2. Ve a la pestaña **Scripting**.
3. Abre `robot_helpers.py` y el modelo que quieras (p. ej. `models/opportunity.py`).
4. Ajusta la primera línea del script del modelo si hace falta (usa rutas absolutas):
   ```python
   sys.path.insert(0, r"C:\Users\Usuario\OneDrive - UCB\PROYECTOS VS CODE\ECOSPACE\blender")
   ```
   (En Scripting el `__file__` no existe, así que la ruta relativa no funciona.)
5. Pulsa **Run Script**.
6. Para exportar manualmente: `File → Export → glTF 2.0 (.glb)` con **Format: glTF Binary (.glb)**, y activa **Mesh > Apply Modifiers** y **Animation > Shape Keys**.

---

## 5. Convenciones de nombres (cómo los consume Three.js)

| Nombre en el GLB | Qué es | Uso en el front |
|------------------|--------|-----------------|
| `<nombre>` | Nodo raíz (empty) | Posicionar todo el robot en la escena |
| `pov_eye` | Empty anclado al "ojo" del robot | Cámara en primera persona (POV) |
| `wheel_*`, `mast`, `mast_head`, `panel_*`, `arm`, `antenna`, `rotor_*`, `dish`, `petal_*` | **Pivotes (empties)** | Articulación: se rotan para animar ruedas, mástil, paneles, brazos, etc. |
| `status_light` (+ material `status_glow`) | Luz de estado emisiva | Se anima `emissiveIntensity` (encendido/apagado y **corte eléctrico**) |
| `antenna_droop`, `rotor_damage` | **Morph targets (shape keys)** | "Expresiones" (antena que se baja, aspa dañada) |

> En Three.js: `scene.getObjectByName("mast")` devuelve el `Object3D` del pivote; rotarlo mueve a sus hijos. El morph se accede con `mesh.morphTargetInfluences`.

---

## 6. Cómo editar un modelo (sin tocar helpers)

Cada script tiene una estructura idéntica:

```python
def build():
    # 1) materiales
    gris = rh.new_material("body_gray", (0.55, 0.57, 0.60), metallic=0.1, roughness=0.5)
    # 2) raíz
    root = rh.add_empty("opportunity", (0, 0, 0))
    # 3) partes
    rh.add_box("body", (1.5, 0.9, 0.45), (0, 0, 0.5), material=gris, parent=root)
    ...
    return root
```

### Funciones disponibles en `robot_helpers`
- `add_box(name, dims, location, rotation, material, parent)`
- `add_box_segmented(..., seg_axis, segments)` — caja subdividida (para flexión)
- `add_cylinder(name, radius, depth, ...)` — cilindro a lo largo de Z
- `add_segmented_cylinder(..., depth_segments)` — cilindro con anillos (para flexión)
- `add_icosphere(name, radius, ...)`
- `add_cone(name, radius1, radius2, depth, ...)` — base `radius1` (−Z), cima `radius2` (+Z)
- `add_empty(name, location, rotation, parent)` — pivote/nodo
- `add_rod(name, radius, a, b, ...)` — cilindro entre dos puntos (patas, botalones)
- `add_bend_shape_key(obj, name, bend_axis, up_axis, pivot, max_angle_deg)` — morph target de flexión
- `new_material(name, base_color, metallic, roughness, emission, emission_strength)` — PBR
- `clear_scene()`, `export_glb(path, draco)`

### Consejos rápidos
- **Coordenadas:** Z = arriba en Blender (el exportador lo convierte a Y-up para glTF).
- **Unidades:** metros aproximados. Los rovers rondan 1–2 unidades; no importa la escala absoluta, solo la coherencia interna.
- **Para que un morph target funcione**, la malla debe tener vértices a lo largo del eje de flexión (usa `add_box_segmented` o `add_segmented_cylinder`).
- **Para darle vida sin morph**, basta con rotar los pivotes (`mast`, `arm`, `wheel_*`, `panel_*`) desde el front.

---

## 7. Notas de exportación (qué hace `export_glb`)

| Ajuste | Valor | Por qué |
|--------|-------|---------|
| Formato | **GLB** | Un solo archivo binario, fácil de servir |
| `export_morph` | **True** | Exporta los morph targets (shape keys) |
| `export_skins` | **True** | Por si añades armature/skinning después |
| `export_apply` | **True** | Aplica modificadores |
| `export_yup` | **True** | Convierte de Z-up (Blender) a Y-up (glTF) |
| Draco | **True** | Compresión de malla (reduce el peso del GLB) |
| Luces/cámaras | **False** | No exportamos luces (usamos emisivos) ni cámaras |

Si el GLB sale demasiado pesado, revisa el tamaño de las texturas (estos modelos procedurales no llevan texturas: usan **materiales de color**, por eso pesan poco) o baja `segments` en cilindros/esferas.

---

## 8. Solución de problemas

| Problema | Solución |
|----------|----------|
| `ImportError: robot_helpers` | Ejecuta desde la carpeta `blender/` (el script inserta su propia carpeta en `sys.path`). En GUI, usa ruta absoluta (ver §4). |
| El modelo sale "acostado" o en una orientación rara | Recuerda: Blender es Z-up; Three.js es Y-up. El exportador ya corrige esto. Si usas `pov_eye`, su -Z local es el "adelante" por defecto; rota el empty si el robot debe mirar a otro lado. |
| Draco falla | `export_glb` reintenta sin compresión automáticamente. También puedes desactivarlo en `build_all.py` (`draco=False`). |
| No se ven los morph targets | Confirma que la malla tiene vértices a lo largo del eje de flexión (usa las funciones `*_segmented`). |
| Quiero otro robot | Crea `models/<nombre>.py` copiando la estructura, defínelo en `build_all.py` (lista `MODELS`) y ejecuta. |

---

## 9. Siguiente paso lógico

1. Ejecuta `build_all.py` y verifica que aparecen los 7 `.glb`.
2. Ábrelos en el visor de glTF (https://gltf-viewer.donmccurdy.com/) para comprobar la geometría, los **nodos con nombre** y los **morph targets**.
3. En el front, carga `useGLTF("/models/mars/opportunity.glb")` y busca los nodos por nombre para la articulación y el POV.
