# PRD — NOVA (web estática agnóstica)

## Problema original
Proyecto web completo para **Nova**, asistente culinario inteligente y "sistema operativo"
para cocinas profesionales. Entrega: **HTML/CSS/JS puro** que abre en cualquier navegador
(`file://`), sin servidor. Calidad Awwwards. Sin placeholders. Idioma: español.

## Decisiones del usuario
- Web estática pura y agnóstica (sin servidor, sin build, sin npm).
- IA simulada con lógica JS (`js/nova-ai.js`) y datos precargados (`js/data.js`).
- Estética clara, minimalista y limpia. Copy profesional.
- Persistencia de TODAS las ediciones en `localStorage` (capa `js/overrides.js`).
- Calculadora flotante semitransparente en todas las páginas.
- Credenciales de acceso local: usuario `Dominguiito11` / contraseña `TeAmoFran`.

## Arquitectura
- Sitio estático en `/app/nova-web` — código fuente de verdad.
- Copia espejo en `/app/frontend/public/nova` SOLO para previsualización
  (sincronizar con `rsync -a --delete /app/nova-web/ /app/frontend/public/nova/` tras cada cambio).
- GSAP + ScrollTrigger + Lenis vendorizados en `js/lib/`; fuentes self-hosted en `assets/fonts/`.
- `js/app-core.js`: shell (sidebar, login gate, onboarding), toast, `NovaApp.store` (localStorage),
  edición inline (`inlineEdit`), impresión (`[data-print]` → `window.print()`), helpers de
  persistencia (`saveSuppliers`, `saveStock`, `updateRecipe`, `saveAllergens`, etc.).
- `js/overrides.js`: aplica al arranque las ediciones guardadas sobre `NOVA_DATA`.
- Claves localStorage: `nova_session`, `nova_profile`, `nova_admin`, `nova_price_overrides`,
  `nova_supplier_overrides`, `nova_suppliers`, `nova_supplier_items`, `nova_stock`,
  `nova_production`, `nova_menu_pvp`, `nova_recipe_overrides`, `nova_allergens`,
  `nova_appcc`, `nova_appcc_controls`, `nova_custom_ings`, `nova_custom_recipes`,
  `nova_mermas`, `nova_log`.
- Estilos de impresión: `@media print` en `css/app.css` (clase `.no-print` oculta elementos).

## Personas
- Jefe/a de cocina, chef, restaurante, hotel, catering, obrador.

## Módulos (todos funcionales y editables)
- Landing (`index.html`) cinética con demo de IA en vivo.
- Asistente (`app.html`): lenguaje natural, proceso visible, KPIs, memoria.
- Recetas: ficha, edición de recetas base y propias (persistente), impresión PDF.
- Escandallos: agrupados por categoría con subtotales, impresión/exportación.
- Stock, Mermas, Producción: edición persistente.
- Carta: categorías propias, chips de alérgenos, coste, PVP editable, clic → receta.
- Alérgenos: catálogo editable (añadir/quitar), matriz receta×alérgeno, etiquetado.
- APPCC: puntos de control (añadir/renombrar en registro), lecturas, estado con dropdown,
  responsable y punto editables inline; persistente.
- Proveedores: comparativa de precios editable por celda; añadir/quitar productos;
  añadir/editar distribuidores (nombre, especialidad, entrega, mínimo); persistente.
- Compras: lista auto-generada bajo mínimos; checkbox por ítem; × quita ítem temporalmente
  (no persiste; botón restaurar); botón "Imprimir PDF".
- Extras: calculadora flotante, biblioteca de recetas offline, guía de ayuda (`js/guide.js`).

## Historial reciente
- 2026-08-28/29: 6 mejoras del usuario completadas (Carta, Recetas, Alérgenos, APPCC,
  Proveedores, Compras). Verificación con testing_agent: 13/13 comportamientos OK.
  Corregidos post-test: etiqueta "undefined" al borrar alérgeno en uso, KPI "Ítems pendientes",
  titular de Alérgenos sin número fijo, punto de control editable en registros APPCC,
  subtexto de Compras acortado por petición del usuario.
  Resueltos 36 errores de lint (globals gsap/Lenis/ScrollTrigger/NovaApp).

## Backlog / próximos
- P1: exportar más módulos a PDF/impresión (producción, APPCC histórico).
- P2: modo oscuro alternativo.
- P2: borrado de distribuidores (hoy solo alta/edición).
- P2: regenerar `nova-web.zip` para descarga offline con la versión actual.
