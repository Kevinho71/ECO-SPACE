# Impacto Social, Ambiental y Cultural
## Proyecto *Abandoned but not Forgotten* — EcoSpace

> **Una frase:** una experiencia web interactiva en 3D que da voz a los robots y equipos que la NASA dejó en la Luna, Marte y el espacio profundo, para que estudiantes y público general descubran —a través de su propia historia— cómo la ingeniería aeroespacial transformó nuestro conocimiento del universo.

Este documento explica por qué el proyecto importa más allá de su valor tecnológico: qué aporta a las **personas** (dimensión social), qué relación tiene con el **planeta** (dimensión ambiental) y cómo se inserta en la **memoria y la identidad** de nuestra especie (dimensión cultural).

---

## 1. Introducción

La exploración espacial suele contarse desde el éxito: la misión activa, la fotografía espectacular, el récord. Pero detrás de cada hito hay **máquinas que se quedaron atrás**: etapas de descenso, rovers que se apagaron, sondas que siguen viajando en silencio. Esos objetos son, a la vez, **archivo científico, patrimonio técnico y símbolo cultural**.

El proyecto convierte ese archivo en una experiencia narrativa accesible. El visitante no lee una ficha técnica: **escucha al robot contar su historia**, explora su cuerpo en 3D, descubre sus instrumentos y comprende, de forma emocional, la ciencia que hizo posible.

Esa decisión de diseño —narrar en primera persona, con audio, en 3D y en la web— es la que produce impacto en las tres dimensiones que se describen a continuación.

---

## 2. Dimensión social

### 2.1 Educación y divulgación STEAM
El reto plantea explícitamente llegar a **estudiantes en edad escolar**. El proyecto traduce datos técnicos densos (NSSDC, science.nasa.gov) en relatos de 60–90 segundos por capítulo, con lenguaje sencillo, analogías y un arco emocional claro.

- **Aprender haciendo:** el usuario no solo consume; **explora** el robot, hace clic en sus partes, gira la cámara, activa la narración.
- **Ciencia integrada, no decorativa:** cada capítulo conecta un instrumento concreto (Pancam, sismómetro, espectrómetro) con el descubrimiento que permitió.
- **Puente con el currículo:** sirve como recurso de apoyo en ciencias, historia y tecnología, sin requerir instalación ni hardware especial.

### 2.2 Accesibilidad e inclusión
La web es el medio más democrático disponible: funciona en una laptop escolar, una tablet o un teléfono.

- **Subtítulos sincronizados** en toda la narración → accesible para personas sordas o con hipoacusia.
- **Audio opcional** → el contenido se comprende sin sonido (contextos ruidosos o con datos limitados).
- **Navegación por teclado y contraste cuidado** → inclusión de usuarios con discapacidad visual o motriz.
- **Diseño responsive y ligero** → pensado para conexiones lentas y dispositivos modestos.

### 2.3 Democratización del conocimiento espacial
Históricamente, el acceso a la historia espacial ha dependido de libros, museos o documentales en inglés. Este proyecto:

- **Reutiliza datos públicos** de la NASA (dominio público) y los **recontextualiza** en una narrativa comprensible.
- Puede ofrecerse **en español** y otros idiomas, ampliando el alcance a comunidades hispanohablantes y a contextos con menos recursos.
- **Reduce la brecha** entre "quienes saben de espacio" y el público casual o escolar.

### 2.4 Comunidad y colaboración
El formato (catálogo abierto, datos tipados, misiones añadibles) permite que **docentes, estudiantes y desarrolladores** contribuyan nuevas misiones. Es una plataforma **extensible**, no un producto cerrado.

### 2.5 Contribución a los Objetivos de Desarrollo Sostenible (ODS)

| ODS | Cómo contribuye el proyecto |
|-----|------------------------------|
| **ODS 4 — Educación de calidad** | Recurso educativo gratuito, interactivo y multilingüe sobre ciencia e historia espacial. |
| **ODS 5 — Igualdad de género** | Narraciones con voces diversas y modelos femeninos/masculinos de científicos e ingenieros; fomenta la participación de niñas en STEAM. |
| **ODS 9 — Industria, innovación e infraestructura** | Demuestra el valor divulgativo de tecnologías web abiertas (WebGL, TTS, 3D). |
| **ODS 10 — Reducción de las desigualdades** | Acceso sin costo desde cualquier dispositivo; contenido en español para comunidades históricamente subrepresentadas. |
| **ODS 17 — Alianzas** | Se apoya en datos y recursos públicos de la NASA y en servicios en la nube accesibles. |

---

## 3. Dimensión ambiental

### 3.1 Una experiencia digital de bajo impacto
Frente a formatos físicos (libros impresos, exposiciones con maquetas, kits), una experiencia web:

- **No requiere fabricación, transporte ni almacenamiento** de materiales.
- **Se actualiza sin reimprimir** ni desechar ejemplares.
- **Escala a miles de usuarios** con un costo material marginal.

### 3.2 Eficiencia de recursos digitales
La sostenibilidad digital también importa. El proyecto se diseña para **minimizar su huella**:

- **Modelos GLB comprimidos (Draco)** y carga diferida por misión → menos datos transferidos.
- **Audio cacheado en CDN** (generado una vez con AWS Polly y reutilizado) → evita cómputo redundante.
- **Texturas optimizadas** y límite de efectos → menor consumo en el dispositivo del usuario.
- **Hosting estático/CDN** → infraestructura eficiente y escalable.

### 3.3 Conciencia ambiental a través del contenido
El tema mismo invita a reflexionar sobre la relación entre la humanidad y el entorno espacial:

- **Desechos espaciales:** los objetos abandonados son, también, una lección sobre el impacto de la actividad humana más allá de la Tierra.
- **Protección planetaria:** las misiones a Marte y la Luna están sujetas a protocolos para no contaminar otros mundos; el proyecto puede explicarlos de forma accesible.
- **Ética de la exploración:** ¿qué dejamos atrás? ¿cómo preservamos esos sitios como patrimonio? Son preguntas ambientales y morales que el relato puede sembrar.

### 3.4 Economía circular del conocimiento
El proyecto **reutiliza datos públicos** (imágenes, especificaciones, historias) en lugar de generar contenido desde cero. Es un ejemplo de cómo el conocimiento abierto se convierte en un recurso sostenible y reutilizable.

---

## 4. Dimensión cultural

### 4.1 El patrimonio espacial como patrimonio de la humanidad
Las naves y rovers abandonados no son chatarra: son **artefactos culturales**. La base de Tranquilidad, el lugar donde se posó Surveyor 3, los restos de Opportunity en Marte —son hitos de la historia humana, comparables a monumentos arqueológicos.

El proyecto contribuye a **preservar su memoria** y a tratarlos como lo que son: **monumentos silenciosos de la exploración**.

### 4.2 Narrativa y memoria
Contar la historia **en primera persona** ("Soy Oppy…") produce una conexión emocional que la ficha técnica no logra. La narrativa:

- **Humaniza la tecnología** sin falsear la ciencia.
- **Recupera voces** que normalmente no se escuchan: la de las máquinas y, a través de ellas, la de las personas que las diseñaron.
- **Convierte la historia en experiencia**, no en dato memorizable.

### 4.3 Diversidad lingüística y acceso cultural
Ofrecer el contenido en **español** (y potencialmente en lenguas originarias o inglés) amplía el acceso cultural a una historia que se ha contado mayoritariamente en inglés. Esto es especialmente relevante para **América Latina**, donde el interés por la astronomía y la exploración espacial es creciente pero el acceso a materiales de calidad es limitado.

### 4.4 Puente generacional
El formato —3D, audio, interacción— conecta con los **nativos digitales**, mientras que el contenido histórico permite que **adultos y docentes** acompañen el aprendizaje. Es un puente entre la generación que vivió el Apolo 11 y la que creció con Perseverance.

### 4.5 Ciencia y arte
El proyecto integra **rigor científico** (datos verificados) con **lenguaje artístico** (modelado 3D, narración, sonido). Esa fusión es una forma de **alfabetización científica** que reconoce que el conocimiento también se transmite por la emoción y la estética.

### 4.6 Contexto latinoamericano y andino
La observación del cielo ha sido parte de las culturas andinas desde hace milenios (calendarios agrícolas, orientación por las estrellas). Un proyecto que invita a "mirar lo que dejamos en el cielo" dialoga con esa tradición: **la curiosidad por el cosmos no es ajena a nuestra cultura; es parte de ella.** El proyecto puede tender un puente entre esa herencia y la exploración contemporánea.

---

## 5. Matriz de impacto

| Dimensión | Impacto directo | Indicador de éxito |
|-----------|-----------------|--------------------|
| **Social** | Educación STEAM accesible; inclusión; democratización del conocimiento | N.º de visitantes, tiempo de sesión, uso en aulas, comentarios de docentes |
| **Ambiental** | Bajo consumo de recursos; reutilización de datos; conciencia ecológica | Peso de la experiencia (MB), consumo por sesión, % de assets cacheados |
| **Cultural** | Preservación del patrimonio espacial; narrativa multilingüe; puente generacional | N.º de misiones narradas, idiomas disponibles, alcance geográfico |

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| **Brecha digital** (dispositivos/conexión limitados) | Versión ligera, carga progresiva, modo sin audio, textos alternativos |
| **Inexactitud histórica** | Validación contra NSSDC y science.nasa.gov; revisión por expertos |
| **Sesgo cultural** (relato centrado solo en EE. UU.) | Incluir misiones y perspectivas diversas; contextualizar el esfuerzo colectivo |
| **Consumo energético del 3D** | Optimización de assets, límites de calidad por dispositivo |
| **Dependencia de servicios en la nube** | Cachear audio; funcionar con assets estáticos si falla el TTS en vivo |

---

## 7. Conclusión

*Abandoned but not Forgotten* no es solo una aplicación 3D. Es una **herramienta educativa** que reduce desigualdades en el acceso al conocimiento (social), un **producto digital de bajo impacto** que reutiliza recursos públicos y siembra conciencia ambiental (ambiental), y un **acto de memoria cultural** que preserva el patrimonio espacial y lo acerca a nuevas generaciones y a nuevas lenguas (cultural).

Su mayor aporte es recordarnos que **detrás de cada máquina abandonada hay una historia humana** —y que contarla bien es, también, una forma de ciencia.
