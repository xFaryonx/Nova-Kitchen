# PRD — NOVA (web estática agnóstica)

## Problema original
Proyecto web completo para **Nova**, asistente culinario inteligente y "sistema operativo"
para cocinas profesionales. Entrega: **HTML/CSS/JS puro** que abre en cualquier navegador
(`file://`), sin servidor. Calidad Awwwards. Tres auditorías adversariales. Sin placeholders.

## Decisiones del usuario
- Web estática pura y agnóstica.
- IA simulada con lógica JS y datos precargados.
- Estética clara, minimalista y limpia. Español.
- Todas las páginas/módulos.
- Interacciones poco convencionales con valor real; copy de calidad profesional.
- (Añadido) Calculadora flotante semitransparente en todas las páginas.

## Arquitectura
- Sitio estático en `/app/nova-web` (copiado a `/app/frontend/public/nova` sólo para previsualizar).
- Sin build ni dependencias remotas. GSAP + ScrollTrigger + Lenis vendorizados; fuentes self-hosted.
- Motor de intención en `js/nova-ai.js`; datos en `js/data.js`; memoria en `localStorage` con respaldo.

## Personas
- Jefe/a de cocina, chef, restaurante, hotel, catering, obrador.

## Implementado (2026-06-11)
- Landing cinética: loader con firma, hero con loop (ken-burns + parallax + canvas de vapor),
  claim, marquee editorial, manifiesto (3 capítulos), bento de 9 módulos, **demo de IA en vivo**,
  fotografía tratada, stats, cita, CTA, footer.
- App/Asistente (`app.html`): input en lenguaje natural, proceso interno visible, dashboard KPIs, memoria.
- 9 módulos funcionales: Recetas, Escandallos, Stock, Producción, Carta, APPCC, Alérgenos, Proveedores, Compras.
- Calculadora flotante semitransparente (abrir/cerrar, teclado físico).
- Imágenes generadas y tratadas con estética coherente. Copy profesional.
- Tres auditorías documentadas en `AUDITORIAS.md`.

## Limitaciones conocidas
- No hay generación de vídeo (Seedance 2) en el entorno → el "loop" del hero es un efecto
  cinético nativo (imagen + movimiento + canvas), agnóstico y sin ficheros de vídeo.

## Backlog / próximos
- P1: editor de recetas/ingredientes persistente (crear y guardar propias).
- P1: exportar escandallos y fichas técnicas a PDF/impresión.
- P2: onboarding para personalizar perfil de empresa/tipo de cocina.
- P2: modo oscuro alternativo.
