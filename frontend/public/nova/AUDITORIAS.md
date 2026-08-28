# NOVA · Tres auditorías adversariales

Metodología: un "árbitro" adopta el rol de crítico hostil (jurado de Awwwards + chef
exigente + QA) y busca activamente motivos para rechazar el trabajo. Cada ronda lista
los defectos encontrados y su resolución. Sólo se da por buena cuando no quedan fallos
que rompan experiencia o funcionalidad.

---

## Auditoría 1 — Dirección de arte y craft
**Ángulo del árbitro:** "Esto parece una plantilla de IA. Convénceme de lo contrario."

Defectos detectados:
1. **Capa de vapor del hero rota.** `hero__steam` no tenía tamaño → se veía un panel
   rectangular con costura vertical sobre la foto. → *Resuelto:* `object-fit:cover`,
   tamaño completo y opacidad bajada a 0.22 para textura sutil.
2. **Grid de módulos con huecos.** El bento de 12 columnas con una tarjeta `tall`
   dejaba celdas vacías. → *Resuelto:* `grid-auto-flow:dense`.
3. **KPIs del dashboard con celdas fantasma.** `auto-fit` dejaba 2 huecos grises. →
   *Resuelto:* rejilla fija 2×2 en el panel de resumen.
4. Riesgo de "AI slop": se evitan degradados morados, layouts centrados y fuentes
   genéricas. Paleta papel cálido + brasa (#D8451C), tipografía Fraunces (editorial) +
   Hanken Grotesk + JetBrains Mono. Layouts asimétricos, marquee editorial, capítulos
   numerados. → *Conforme.*

**Veredicto:** aprobado tras corregir 1–3.

---

## Auditoría 2 — Funcionalidad y lógica de negocio
**Ángulo del árbitro:** "Soy jefe de cocina. Si un número está mal, no vuelvo."

Verificaciones (motor probado en Node contra las 9 intenciones):
1. **Escandallo** lasaña 40 rac → 93,63 € total / 2,34 € ración / 14 ingredientes.
   Recalcula al cambiar raciones. → *Correcto.*
2. **PVP por margen**: PVP = coste ÷ (1 − margen). Risotto 30 % coherente. → *Correcto.*
3. **Stock**: detección de bajo mínimos y caducidades ≤ 4 días; valor de inventario. → *Correcto.*
4. **Carta**: food cost por plato, marca en rojo los > 35 %. → *Correcto.*
5. **Producción**: coste de materia por día y total semana; identifica día pico. → *Correcto.*
6. **Alérgenos**: cruce de ingredientes con los 14 declarables + matriz de carta. → *Correcto.*
7. **APPCC**: evalúa la lectura contra el límite (≥/≤) y marca incidencia. → *Correcto.*
8. **Compras/Proveedores**: elige el proveedor más barato por referencia; total en vivo. → *Correcto.*
9. **Memoria**: historial de consultas persistente + botón de vaciar. → *Correcto.*

Defecto detectado: el resultado del asistente sólo aparecía tras animación, dificultando
QA. → *Resuelto:* modo `?instant` para render inmediato (sin afectar la UX normal).

**Veredicto:** aprobado.

---

## Auditoría 3 — Robustez agnóstica, rendimiento y accesibilidad
**Ángulo del árbitro:** "Lo abro con doble clic, sin internet, en un navegador viejo. ¿Aguanta?"

1. **Cero dependencias remotas.** GSAP, ScrollTrigger y Lenis vendorizados en `js/lib/`;
   fuentes woff2 self-hosted; imágenes locales. Sin CDNs. → *Conforme.*
2. **Sin ES modules.** Todos los scripts son clásicos (globales) para funcionar bajo
   `file://` sin CORS. → *Conforme.*
3. **localStorage bajo `file://`.** Algunos navegadores lo bloquean → hay respaldo en
   memoria con `try/catch`. La app no rompe. → *Conforme.*
4. **prefers-reduced-motion.** Loader, revelados y consola respetan el ajuste. → *Conforme.*
5. **Responsive.** Sidebar con menú móvil + scrim; rejillas colapsan; hero fluido. → *Conforme.*
6. **data-testid** en todos los elementos interactivos clave. → *Conforme.*
7. Sin errores en consola del navegador en landing ni app (verificado). → *Conforme.*

**Veredicto:** aprobado. Entrega apta para abrir de forma agnóstica en cualquier navegador.

---

### Resultado global
Tres rondas superadas. Todos los defectos que afectaban a experiencia o funcionalidad
fueron corregidos antes del cierre.
