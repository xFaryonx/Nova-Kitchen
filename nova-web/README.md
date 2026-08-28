# NOVA — El sistema operativo de la cocina profesional

Proyecto web completo, **100 % estático y agnóstico**. Se abre en cualquier navegador
haciendo doble clic en `index.html`. No requiere servidor, build ni conexión a internet:
fuentes, imágenes, librerías y datos están incluidos en la propia carpeta.

## Cómo abrirlo
1. Abre `index.html` (landing) directamente en tu navegador, **o**
2. Entra a la app desde el botón «Entrar a Nova» → `app.html`.

> Consejo: para máxima compatibilidad de `localStorage` en algunos navegadores con `file://`,
> puedes servir la carpeta con `python3 -m http.server` y abrir `http://localhost:8000`.
> No es necesario: la app funciona igualmente con doble clic (incluye memoria en memoria como respaldo).

## Páginas (11)
| Archivo | Contenido |
|---|---|
| `index.html` | Landing cinética: loader con firma, hero con loop, manifiesto, módulos, **demo de IA en vivo** |
| `app.html` | Asistente en lenguaje natural + dashboard con memoria |
| `recetas.html` | Recetario: escalado de raciones, ficha técnica, versiones |
| `escandallos.html` | Coste por ingrediente/ración, margen y PVP en vivo |
| `stock.html` | Inventario, mínimos, caducidades y avisos |
| `produccion.html` | Planificación semanal con coste de materia prima |
| `carta.html` | Cartas por temporada y rentabilidad por plato |
| `appcc.html` | Registros APPCC con evaluación de límites críticos |
| `alergenos.html` | Detección de los 14 alérgenos + matriz de carta |
| `proveedores.html` | Comparativa de precios entre proveedores |
| `compras.html` | Lista de compra automática al mejor precio |

## Estructura
```
nova-web/
├── *.html                 # 11 páginas
├── css/  base · landing · app
├── js/   data · nova-ai · console · landing · app-core · calculator (+ lib/ GSAP·ScrollTrigger·Lenis)
└── assets/ img (imágenes generadas) · fonts (Fraunces·Hanken Grotesk·JetBrains Mono, self-hosted)
```

## La IA de Nova
Motor de intención local (`js/nova-ai.js`). No responde directamente: **analiza →
contextualiza → identifica módulo → recupera datos → genera respuesta**. Entiende
consultas como «Hazme un escandallo para una lasaña de 40 raciones», «¿Qué puedo
cocinar con este stock?», «Diseña una carta de otoño» o «Calcula el PVP del risotto
con un 30 % de margen». La memoria (perfil e historial) se guarda en `localStorage`.

## Extras
- **Calculadora flotante semitransparente** (`js/calculator.js`) disponible en todas las páginas.
- Motion premium: Lenis (scroll con inercia), GSAP + ScrollTrigger, revelados enmascarados, parallax y canvas de vapor.

## Nota honesta sobre el vídeo
Este entorno **no dispone de herramienta de generación de vídeo (Seedance 2)**. El «loop»
del hero se ha resuelto de forma nativa y agnóstica combinando fotografía generada +
movimiento (ken-burns, parallax y una capa de vapor en `<canvas>`), logrando sensación
de vídeo sin depender de ficheros de vídeo externos. Todo lo demás (imágenes generadas y
tratadas con estética coherente, copy profesional y motion) está entregado.

## Acceso y novedades
- **Acceso a la app**: al entrar en `app.html` o cualquier módulo, Nova pide login.
  Cuenta de administrador semilla: usuario `Dominguiito11`, contraseña `TeAmoFran`.
  Tras el primer acceso, un **onboarding** pide nombre, empresa y tipo de cocina para
  personalizar el saludo y los datos. (Login **local**, sin servidor: es una puerta de
  acceso/personalización, no seguridad real, porque el sitio es estático.)
- **Recetas e ingredientes propios** (`recetas.html`): crea y guarda tus recetas e
  ingredientes; Nova los recuerda (`localStorage`) y quedan disponibles en el asistente,
  escandallos, alérgenos, etc.
- **Exportar / Imprimir**: botón «Imprimir / PDF» en Escandallos y en la ficha de Receta
  (usa el diálogo de impresión del navegador → «Guardar como PDF»).
- **Cerrar sesión**: icono en el pie de la barra lateral.

## Recetas: buscador por ingredientes, stock y librería
- **¿Qué cocino con…?**: selecciona uno o varios ingredientes y Nova lista las recetas por
  coincidencia. Incluye una casilla **«Usar solo ingredientes en stock»**: al activarla, el
  selector se limita a lo que tienes en inventario y los resultados muestran solo recetas
  completables con tu stock actual.
- **Librería de recetas (local)**: colección incluida en la app (`js/library.js`), funciona
  **sin conexión**. Explórala, filtra por «las que puedo hacer con mi stock» y añade las que
  quieras a «Mis recetas»; Nova las recordará y las usará en escandallos, alérgenos y sugerencias.
  > Conectar una librería *online* (TheMealDB, Spoonacular, Edamam…) es técnicamente posible,
  > pero requeriría internet y, en algunos casos, claves/CORS, rompiendo el funcionamiento
  > agnóstico `file://`. Por eso la librería se entrega **empaquetada en local**.
