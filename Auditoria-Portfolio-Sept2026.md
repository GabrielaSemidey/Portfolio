# Auditoría del portafolio (gabrielasemidey.github.io/Portfolio)

Revisé todo el código fuente: `index.html`, `journey.html`, `todos-proyectos.html`, las 9 páginas de `proyectos/`, `main.js`, `translations.js` (990 keys × 2 idiomas) y los 5 archivos CSS. No es una revisión visual (no lo vi renderizado en un navegador), es una auditoría de código y contenido. Lo organizo de más a menos urgente.

---

## 1. Bugs reales (rompen algo, no es cuestión de gusto)

**Favicon roto en las dos páginas más visitadas.** `index.html` y `todos-proyectos.html` cargan el favicon con `../assets/images/favicon.png`, pero ambos archivos están en la raíz del proyecto — esa ruta sube un nivel de más y apunta *fuera* del repo. El icono de pestaña no carga en tu home ni en la galería de proyectos. Las páginas dentro de `proyectos/` sí lo tienen bien (ahí `../` es correcto), y `journey.html` también está bien. Es un cambio de una línea en 2 archivos.

**`todos-proyectos.html` carga una hoja de estilos que no existe.** Referencia `./styles/journey.css`, pero en la carpeta `styles/` solo hay `base.css`, `components.css`, `lumi.css`, `project-detail.css` y `sections.css`. Es una petición 404 silenciosa — no rompe la página porque el resto de estilos ya la cubren, pero es un resto de algún refactor a medio terminar.

**El enlace "Frontend" del menú no lleva a ningún lado.** En `todos-proyectos.html` y en las 9 páginas de proyectos, el nav incluye un ítem "Frontend" que apunta a `index.html#frontend` (o `../index.html#frontend`). Ese `id="frontend"` no existe en `index.html` — sus secciones son `#inicio`, `#sobre-mi`, `#proyectos`, `#skills`, `#contacto`. Al hacer clic, no pasa nada (o el navegador te deja donde estás). Intuyo qué pasó: en `todos-proyectos.html` sí tienes tarjetas reales con `data-category="frontend"` — el **Weather Personalities** y el **Pomodoro Focus Timer** (dos proyectos con demo en GitHub Pages, buena onda que estén). El link del nav debería apuntar ahí (algo como `todos-proyectos.html#frontend` combinado con el filtro), no a un ancla de `index.html` que nunca existió. Además, ni `index.html` ni `journey.html` tienen este ítem en su propio menú — el menú de navegación es distinto según en qué página estés, lo cual ya de por sí es inconsistente.

**El repo real se llama `Portfolio`, no `Portafolio`.** Confirmé el remoto en `.git/config`: `git@github.com:GabrielaSemidey/Portfolio.git`. Tu propio `README.md` linkea en dos sitios (el badge de arriba y el pie de página) a `.../Portafolio` — esos enlaces dan 404. Las URLs dentro del README a proyectos individuales sí usan `Portfolio` bien. Es una inconsistencia de copy-paste, pero está en la puerta de entrada de tu repo.

**El link a Cúbico en el README apunta a un archivo que no existe.** El README menciona `proyectos/cubico.html`, pero el archivo real se llama `proyectos/fruta.html` (contiene el proyecto Cúbico/Fruta Global — el nombre del archivo no coincide con el del proyecto, lo cual también confunde si algún día tocas ese código).

---

## 2. Rendimiento — esto es lo que más me preocupa

El sitio pesa mucho más de lo que debería para un portafolio estático sin frameworks:

- `assets/images/favicon.png` pesa **1.6 MB**. Un favicon debería pesar unos kilobytes.
- `assets/images/perfil.png` (tu foto del hero, lo primero que ve cualquiera) pesa **2.8 MB**.
- `assets/images/proyectos/bid/ecosystem-map.gif` pesa **13.8 MB**.
- `assets/images/proyectos/agenda-web/demo-buscador.mp4` pesa **35 MB**.
- Varias imágenes de MINCETUR y UPC pesan entre 3 y 3.8 MB cada una (`herramienta-1.jpg`, `herramienta-2.jpg`, `testeo-genius.jpg`).

Ninguna de estas está optimizada para web (parecen exports directos de captura de pantalla o cámara, sin comprimir ni redimensionar). En una conexión normal, la página de BID o de la Clínica van a tardar varios segundos en cargar solo por esas dos piezas. Para alguien evaluando tu perfil desde el móvil o con prisa, esto puede ser la diferencia entre que se queden a leer el caso o que cierren la pestaña.

**`translations.js` pesa 236 KB y se carga en TODAS las páginas, incluida la home.** Ese archivo contiene el texto completo (ES + EN) de los 9 case studies. Alguien que solo entra a ver tu landing descarga, sin necesitarlo, todo el contenido de texto de cada proyecto en dos idiomas. No es descabellado para un sitio sin build system, pero sí es una oportunidad clara de mejora: podrías separar las traducciones comunes (nav, botones) de las traducciones específicas de cada proyecto, y cargar estas últimas solo en su página.

**Recomendación concreta:** pasar todas las imágenes por un compresor (TinyPNG, Squoosh) y convertir el GIF de BID a un `.mp4` o `.webm` corto — un GIF de 13.8 MB debería ser un video de 1-2 MB con la misma calidad percibida. El video de 35 MB debería comprimirse agresivamente o cargarse solo bajo demanda (poster + botón de play) en vez de estar embebido directo.

---

## 3. SEO y "compartibilidad" (esto importa mucho para un portafolio que vas a mandar a reclutadores)

**No hay ni un solo meta tag Open Graph (`og:title`, `og:image`, `og:description`) en ninguna de las 12 páginas.** Esto significa que cuando pegues el link de tu portafolio en LinkedIn, WhatsApp, Slack o un email, no se genera ninguna tarjeta de previsualización — solo aparece el link pelado. Para un portafolio que depende de que la gente haga clic, es una pérdida de impacto grande y es barato de arreglar (un `og:image` con tu foto o un banner, título y descripción por página).

**No hay `<link rel="canonical">` en ninguna página.** Menor, pero ayuda a que buscadores no dupliquen indexación si alguna vez el sitio se sirve desde más de un dominio/ruta.

**El toggle de idioma causa un parpadeo de contenido (FOUC).** El HTML por defecto está todo en español (`<html lang="es">`, textos hardcodeados en español dentro del markup). El script de idioma decide el idioma real basado en `localStorage` o en `navigator.language` y *después* traduce el DOM. Si alguien tiene el navegador en inglés, ve una fracción de segundo el texto en español antes de que cambie a inglés — no es grave, pero es la clase de detalle que un reclutador técnico podría notar.

---

## 4. Arquitectura de código — mantenibilidad

Este es un sitio 100% HTML/CSS/JS vanilla sin ningún sistema de plantillas (no hay includes, no hay build step). Eso significa que el header, el nav, el footer y los scripts están **copiados y pegados en las 12 páginas**. Ya se nota el costo de eso:

- El nav no es idéntico entre páginas (visto arriba: el ítem "Frontend" y el ítem "Skills" aparecen o desaparecen según la página).
- El footer dice "© 2025" en las 12 páginas — ya estamos en septiembre de 2026. Un detalle menor pero visible, y es exactamente el tipo de cosa que se desincroniza cuando no hay una sola fuente de verdad para el header/footer.
- Cualquier cambio futuro en el nav (agregar una sección, cambiar un texto) hay que replicarlo a mano en 12 archivos, con alto riesgo de que alguno quede desactualizado (como ya pasó).

**En `main.js` hay código duplicado y código muerto:**
- El bloque de "smooth scroll" para anchors (`a[href^="#"]`) está escrito **dos veces**, casi idéntico (líneas ~75 y ~654) — el segundo añade el cierre del menú móvil, pero ambos quedan activos a la vez sobre los mismos elementos.
- Hay una función de lazy-loading de imágenes con dos sistemas distintos y contradictorios (uno usa el atributo nativo `loading="lazy"`, el otro un `IntersectionObserver` para `img.lazy` con `data-src`) — revisando el HTML, ningún `<img>` usa `data-src`, así que ese segundo sistema nunca hace nada.
- Hay un `debounce` para el evento `resize` que llama a una función vacía (`() => {}`) — no hace absolutamente nada, probablemente resto de una función que se quitó.
- El texto del "swipe indicator" (`Desliza para ver más proyectos`) y el `aria-label` del lightbox (`Ver imagen: ${...}` / `Sin descripción`) están **hardcodeados en español** directo en el JS, pese a que existe todo un sistema de traducción — si alguien navega en inglés, esas dos piezas de texto igual aparecen en español. Es una inconsistencia de idioma real, no solo cosmética.

**El markup de las tarjetas de proyecto en `index.html` tiene una indentación muy irregular** (cierres de `<div>`/`<span>` desalineados, ver líneas 300-348) — no rompe nada porque el HTML es tolerante, pero hace que editar esas tarjetas a mano sea más propenso a error.

---

## 5. Contenido / storytelling — lo que le falta al perfil que estás mostrando

**El CV descargable está solo en inglés, en un sitio que por defecto está en español.** El botón "Descargar CV" (aparece dos veces, en el hero y en contacto) apunta siempre a `Gabriela Ojeda Semidey - En.pdf`, sin importar el idioma activo del sitio. Un reclutador español que navega en ES y descarga tu CV se encuentra con uno en inglés. Vale la pena tener ambas versiones y que el botón sirva la que corresponda al idioma activo (o al menos aclarar "(EN)" en el botón).

**El primer case study que ve cualquiera es Lumi, marcado como "(WIP)".** Es la primera tarjeta en la sección de proyectos de tu home, antes que Clínica Alemana (con -40% reclamos, +1.500 telerehabilitación) o BID (80+ entrevistas). Como headline, un proyecto marcado "en progreso" compite en desventaja frente a proyectos ya cerrados y con métricas de impacto reales. Vale la pena considerar si el orden de las tarjetas destacadas en el home debería priorizar los casos con resultados más contundentes y dejar Lumi (que es interesante por el ángulo de producto/IA) en segundo o tercer lugar, o mejor etiquetado.

**El orden cronológico en `journey.html` es confuso.** Bajando por la línea de tiempo (que uno espera leer de más reciente a más antiguo) aparece: 2025 (Consultora) → Feb-Jul 2023 (FRUTA) → **Jul 2022-Dic 2024** (Colectivo23) → Ene 2020-Feb 2022 (Continuum HQ). El bloque de Colectivo23 termina en diciembre 2024 — más tarde que FRUTA, que aparece justo antes en la página — así que el orden visual no respeta ni fecha de inicio ni fecha de fin de forma consistente. Además, "Colectivo23 — Practitioner & Content Creator" no queda claro qué es a simple vista (¿una comunidad? ¿un curso con rol activo? ¿freelance?) ni cómo convive en paralelo con FRUTA y con el inicio de tu etapa de consultora — si es un rol part-time/paralelo, vale la pena decirlo explícitamente para que no parezca un error de fechas.

**No entendí bien:** por qué las tarjetas "Weather Personalities" y "Pomodoro Focus Timer" (proyectos frontend con demo y repo en GitHub) solo viven en `todos-proyectos.html` bajo el filtro "Frontend", sin ninguna presencia en el home ni mención en el README — y a la vez el nav de casi todo el sitio tiene un ítem "Frontend" que no lleva a ellos (ver bug arriba). Si esos proyectos son parte de tu pista "FrontEnd Junior" que mencionaste tener aún indecisa, tiene sentido que estén algo escondidos; si no, valdría la pena decidir si quieres que tengan más visibilidad o quitarlas del todo mientras decides esa dirección.

**La mayoría de los case studies sí tienen métricas cuantificadas** (mérito, esto ya lo tienes bien resuelto en la mayoría de páginas: MINCETUR con "2 años después seguían usando las herramientas", TALI, UPC, Teleconsulta). La excepción notable es **TALI**, que fue pausado por financiamiento — ahí las métricas son de entregables (equipo, duración) en vez de impacto de negocio, lo cual es honesto dado que el proyecto no llegó a lanzarse, pero puede leerse como más débil al lado de los demás. No es un error, es una limitación real del proyecto — solo señalo que contrasta.

---

## 6. Cosas que están bien hechas (para que no se pierdan en la lista de problemas)

- La arquitectura de i18n por keys (`data-i18n` + objeto `translations`) es un enfoque razonable sin depender de un framework, y cubre prácticamente todo el contenido visible.
- El sistema de diseño en CSS (variables en `:root`, ~71 tokens de color/espaciado/tipografía) está bien pensado y consistente entre los 5 archivos.
- El lightbox de imágenes, el acordeón de LumiCoins y el parallax del hero están implementados con manejo de teclado y ARIA (`role="button"`, `aria-expanded`, `tabindex`) — mejor accesibilidad de lo que suele verse en portafolios hechos a mano.
- Los enlaces externos se marcan automáticamamente con `target="_blank"` + `rel="noopener noreferrer"` vía JS — buena práctica de seguridad que mucha gente olvida.
- El uso de `IntersectionObserver` para animaciones al hacer scroll (en vez de escuchar el scroll constantemente) es la forma correcta de hacerlo.
- El contenido de los case studies en sí (proceso, blueprints, hallazgos, reflexiones) es sustancioso y bien estructurado narrativamente — el problema no es la profundidad del contenido, es la capa técnica y de presentación alrededor.

---

## 7. Prioridad sugerida si quieres ir arreglando

**Crítico (impacto directo en primera impresión, arreglo rápido):**
1. Favicon roto en `index.html` y `todos-proyectos.html` (cambiar `../` por `./`).
2. Comprimir `perfil.png` (2.8 MB), `favicon.png` (1.6 MB), el GIF de BID (13.8 MB → video corto) y el video de agenda-web (35 MB).
3. Agregar meta tags Open Graph a cada página (mínimo: `og:title`, `og:description`, `og:image`, `og:url`).
4. Arreglar o quitar el link "Frontend" del nav en las 10 páginas donde está roto.

**Importante:**
5. CV en español disponible y servido según el idioma activo.
6. Arreglar los links rotos del README (`Portafolio` → `Portfolio`, `cubico.html` → `fruta.html`).
7. Eliminar el código muerto de `main.js` (debounce vacío, doble smooth-scroll, sistema de lazy-load sin uso) y traducir los textos hardcodeados (swipe indicator, aria-label del lightbox).
8. Actualizar el "© 2025" del footer (o generarlo por JS con `new Date().getFullYear()` para que nunca vuelva a quedar desactualizado).
9. Revisar el orden cronológico de `journey.html` y aclarar qué es Colectivo23 y cómo convive con los demás roles.

**Nice to have:**
10. Separar `translations.js` en un archivo común + un archivo por proyecto, cargado solo donde corresponde.
11. Unificar el nav para que sea idéntico en las 12 páginas (aunque sea copiando a mano con cuidado, ya que no hay sistema de plantillas).
12. Considerar reordenar las tarjetas destacadas del home para que el primer case study visible sea uno cerrado y con métricas de impacto, no el WIP.
13. Añadir `<link rel="canonical">`.

---

Si quieres, puedo ayudarte a implementar cualquiera de estos arreglos directamente en el código — dime por dónde empezamos y trabajamos sobre los archivos reales (con tu autorización para tocarlos, como ya quedamos).
