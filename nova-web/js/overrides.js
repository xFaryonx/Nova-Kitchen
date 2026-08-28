/* ============================================================
   NOVA · Overrides — aplica ediciones persistidas a NOVA_DATA
   (precios, stock, proveedores, producción y PVP de carta)
   Debe cargarse tras data.js/custom.js y antes de nova-ai.js.
   ============================================================ */
(function () {
  const D = window.NOVA_DATA; if (!D) return;
  function read(k, def){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch(e){ return def; } }

  // Precios de ingredientes (globales)
  const po = read("nova_price_overrides", {});
  Object.keys(po).forEach(id => { if (D.ingMap[id]) D.ingMap[id].price = po[id]; });

  // Stock completo (copia de trabajo)
  const st = read("nova_stock", null);
  if (Array.isArray(st)) { D.stock.length = 0; st.forEach(s => D.stock.push(s)); }

  // Precios por proveedor
  const so = read("nova_supplier_overrides", {});
  D.suppliers.forEach(sup => { if (so[sup.id]) Object.assign(sup.prices, so[sup.id]); });

  // Producción semanal
  const pr = read("nova_production", null);
  if (Array.isArray(pr)) { D.production.length = 0; pr.forEach(p => D.production.push(p)); }

  // PVP de la carta
  const mp = read("nova_menu_pvp", {});
  D.menu.forEach(m => { if (mp[m.recipe] != null) m.pvp = mp[m.recipe]; });
})();
