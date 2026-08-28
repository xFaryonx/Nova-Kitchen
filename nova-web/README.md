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
