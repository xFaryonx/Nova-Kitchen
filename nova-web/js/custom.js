/* ============================================================
   NOVA · Carga de datos personalizados del usuario
   Fusiona ingredientes y recetas propios (localStorage) en
   NOVA_DATA para que Nova y todos los módulos los conozcan.
   ============================================================ */
(function () {
  if (!window.NOVA_DATA) return;
  function read(k){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):[]; }catch(e){ return (window.__novaMem&&window.__novaMem[k])||[]; } }
  read("nova_custom_ings").forEach(i => window.NOVA_DATA.registerIngredient(i));
  read("nova_custom_recipes").forEach(r => window.NOVA_DATA.registerRecipe(r));
})();
