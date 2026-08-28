/* ============================================================
   NOVA · Motor de intención (IA simulada, 100% local)
   No responde directamente: analiza → contextualiza →
   identifica módulo → recupera datos → genera respuesta.
   ============================================================ */
window.NovaAI = (function () {
  const D = window.NOVA_DATA;
  const eur = n => (n).toLocaleString("es-ES",{style:"currency",currency:"EUR"});
  const num = (n,d=2) => n.toLocaleString("es-ES",{minimumFractionDigits:d,maximumFractionDigits:d});
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

  function findRecipe(q){
    const n = norm(q);
    let best=null, score=0;
    D.recipes.forEach(r=>{
      const rn = norm(r.name);
      const words = rn.split(/\s+/);
      let s=0;
      if(n.includes(rn)) s+=10;
      words.forEach(w=>{ if(w.length>3 && n.includes(w)) s+=2; });
      // sinónimos sueltos
      if(n.includes("lasa")&&r.id==="lasana") s+=8;
      if(n.includes("risotto")&&r.id==="risotto") s+=8;
      if(n.includes("salmon")&&r.id==="salmon") s+=8;
      if(n.includes("crema")&&r.id==="crema") s+=6;
      if(n.includes("croqueta")&&r.id==="croquetas") s+=8;
      if((n.includes("tarta")||n.includes("queso"))&&r.id==="tarta") s+=6;
      if(n.includes("gamba")&&r.id==="gambas_ajillo") s+=8;
      if(s>score){score=s;best=r;}
    });
    return score>0?best:null;
  }
  function findPortions(q){ const m=norm(q).match(/(\d+)\s*(raci|comensal|persona|pax|unidad|ración|racion)/); if(m)return parseInt(m[1]); const m2=q.match(/\b(\d{1,4})\b/); return m2?parseInt(m2[1]):null; }
  function findMargin(q){ const m=norm(q).match(/(\d{1,3})\s*%/); return m?parseInt(m[1]):null; }
  function findSeason(q){ const n=norm(q); if(n.includes("otoñ")||n.includes("oton"))return"otoño"; if(n.includes("invierno"))return"invierno"; if(n.includes("primavera"))return"primavera"; if(n.includes("verano"))return"verano"; return null; }

  /* ---------- Renderizadores de resultado ---------- */
  function renderEscandallo(recipe, portions){
    const c = D.recipeCost(recipe.id, portions);
    const rows = c.lines.sort((a,b)=>b.cost-a.cost).map(l=>`
      <tr><td>${l.name}</td>
        <td class="tnum">${num(l.qty,3)} ${l.unit}</td>
        <td class="tnum">${eur(l.unitPrice)}</td>
        <td class="tnum">${eur(l.cost)}</td></tr>`).join("");
    return {
      module:"Escandallos",
      title:`Escandallo · ${recipe.name}`,
      sub:`${portions} raciones`,
      html:`
      <div class="ai-metrics">
        <div class="ai-metric"><span class="overline">Coste total</span><strong>${eur(c.total)}</strong></div>
        <div class="ai-metric"><span class="overline">Coste / ración</span><strong>${eur(c.perPortion)}</strong></div>
        <div class="ai-metric"><span class="overline">Ingredientes</span><strong>${c.lines.length}</strong></div>
      </div>
      <table class="ai-table"><thead><tr><th>Ingrediente</th><th>Cantidad</th><th>€/ud</th><th>Coste</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3">Total escandallo</td><td class="tnum">${eur(c.total)}</td></tr></tfoot></table>
      <p class="ai-note">Sugerencia: con un food cost objetivo del 30 %, el PVP recomendado por ración sería <strong>${eur(D.pvpFromMargin(c.perPortion,70))}</strong>.</p>`
    };
  }
  function renderPricing(recipe, portions, margin){
    const c = D.recipeCost(recipe.id, portions||recipe.base);
    const foodCost = 100-margin; // si "margen 30%" lo interpretamos como beneficio → food cost 70? aclaramos
    const pvp = D.pvpFromMargin(c.perPortion, margin);
    return {
      module:"Escandallos",
      title:`Precio de venta · ${recipe.name}`,
      sub:`Margen bruto objetivo ${margin}%`,
      html:`
      <div class="ai-metrics">
        <div class="ai-metric"><span class="overline">Coste / ración</span><strong>${eur(c.perPortion)}</strong></div>
        <div class="ai-metric ai-metric--ember"><span class="overline">PVP recomendado</span><strong>${eur(pvp)}</strong></div>
        <div class="ai-metric"><span class="overline">Beneficio / ración</span><strong>${eur(pvp-c.perPortion)}</strong></div>
      </div>
      <p class="ai-note">Cálculo: PVP = coste ÷ (1 − margen). Un margen del ${margin}% implica un food cost del ${num(100-margin,0)}%. Precio sin IVA.</p>`
    };
  }
  function renderFicha(recipe){
    const c = D.recipeCost(recipe.id, recipe.base);
    const al = D.recipeAllergens(recipe.id);
    const steps = recipe.steps.map((s,i)=>`<li><span class="mono">${String(i+1).padStart(2,"0")}</span> ${s}</li>`).join("");
    const ings = c.lines.map(l=>`<li>${num(l.qty,3)} ${l.unit} · ${l.name}</li>`).join("");
    const badges = al.map(a=>`<span class="al-badge">${D.allergenLabels[a]||a}</span>`).join("") || '<span class="al-badge al-badge--ok">Sin alérgenos declarados</span>';
    return {
      module:"Recetas",
      title:`Ficha técnica · ${recipe.name}`,
      sub:`${recipe.cat} · ${recipe.base} raciones · ${recipe.minutes} min`,
      html:`
      <div class="ai-cols">
        <div><span class="overline">Ingredientes</span><ul class="ai-list">${ings}</ul></div>
        <div><span class="overline">Elaboración</span><ol class="ai-steps">${steps}</ol></div>
      </div>
      <div class="ai-allergens"><span class="overline">Alérgenos</span><div class="al-row">${badges}</div></div>
      <p class="ai-note">Coste ración estimado: <strong>${eur(c.perPortion)}</strong>.</p>`
    };
  }
  function renderStockCook(){
    // recetas que se pueden producir con stock disponible (cobertura de ingredientes clave)
    const stockMap = Object.fromEntries(D.stock.map(s=>[s.ing,s.qty]));
    const scored = D.recipes.map(r=>{
      const c = D.recipeCost(r.id, r.base);
      let have=0;
      c.lines.forEach(l=>{ if((stockMap[l.id]||0) >= l.qty) have++; });
      return { r, cover: have/c.lines.length };
    }).sort((a,b)=>b.cover-a.cover);
    const rows = scored.slice(0,5).map(s=>`
      <div class="ai-suggest">
        <div><strong>${s.r.name}</strong><span class="ai-tag">${s.r.cat}</span></div>
        <div class="ai-cover"><span style="width:${Math.round(s.cover*100)}%"></span></div>
        <span class="mono">${Math.round(s.cover*100)}% cubierto</span>
      </div>`).join("");
    return { module:"Stock", title:"Qué puedes cocinar hoy", sub:"Según tu inventario actual",
      html:`<div class="ai-suggests">${rows}</div>
      <p class="ai-note">La cobertura mide qué proporción de ingredientes de cada receta tienes en stock ahora mismo.</p>` };
  }
  function renderStockAlerts(){
    const low = D.stock.filter(s=>s.qty<s.min);
    const soon = D.stock.filter(s=>{ const d=(new Date(s.exp)-new Date("2026-06-11"))/86400000; return d<=4; });
    const lowRows = low.map(s=>`<li><strong>${D.ingMap[s.ing].name}</strong> — ${num(s.qty,1)} ${D.ingMap[s.ing].unit} <span class="mono">(mín ${s.min})</span></li>`).join("")||"<li>Sin roturas de stock</li>";
    const soonRows = soon.map(s=>`<li><strong>${D.ingMap[s.ing].name}</strong> — caduca ${new Date(s.exp).toLocaleDateString("es-ES")}</li>`).join("")||"<li>Sin caducidades próximas</li>";
    return { module:"Stock", title:"Avisos de inventario", sub:`${low.length} bajo mínimos · ${soon.length} caducan pronto`,
      html:`<div class="ai-cols">
        <div><span class="overline overline--ember">Bajo mínimos</span><ul class="ai-list">${lowRows}</ul></div>
        <div><span class="overline">Caducidad próxima</span><ul class="ai-list">${soonRows}</ul></div>
      </div>` };
  }
  function renderCarta(season){
    const s = season||"otoño";
    const dishes = D.menu.filter(m=>m.season===s||m.season==="todo").map(m=>{
      const r=D.recipeMap[m.recipe]; const c=D.recipeCost(r.id,r.base);
      const fc = (c.perPortion/m.pvp)*100;
      return {name:r.name,cat:r.cat,pvp:m.pvp,fc};
    });
    const order=["Entrante","Principal","Postre"];
    dishes.sort((a,b)=>order.indexOf(a.cat)-order.indexOf(b.cat));
    const rows=dishes.map(d=>`<tr><td>${d.cat}</td><td>${d.name}</td><td class="tnum">${eur(d.pvp)}</td><td class="tnum ${d.fc>35?'fc-warn':''}">${num(d.fc,0)}%</td></tr>`).join("");
    return { module:"Carta", title:`Propuesta de carta · ${s}`, sub:`${dishes.length} platos · rentabilidad calculada`,
      html:`<table class="ai-table"><thead><tr><th>Pase</th><th>Plato</th><th>PVP</th><th>Food cost</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="ai-note">Los platos con food cost superior al 35% aparecen marcados: revisa escandallo o PVP para proteger el margen.</p>` };
  }
  function renderProduccion(){
    const fri = D.production.find(p=>p.day==="Viernes");
    const rows = fri.tasks.map(t=>{
      const r=D.recipeMap[t.recipe]; const c=D.recipeCost(r.id,t.portions);
      return `<tr><td>${r.name}</td><td class="tnum">${t.portions} rac.</td><td class="tnum">${r.minutes} min</td><td class="tnum">${eur(c.total)}</td></tr>`;
    }).join("");
    const total = fri.tasks.reduce((s,t)=>s+D.recipeCost(t.recipe,t.portions).total,0);
    return { module:"Producción", title:"Producción del viernes", sub:`${fri.tasks.length} elaboraciones planificadas`,
      html:`<table class="ai-table"><thead><tr><th>Elaboración</th><th>Volumen</th><th>Tiempo</th><th>Coste materia</th></tr></thead><tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3">Coste total de materia prima</td><td class="tnum">${eur(total)}</td></tr></tfoot></table>
      <p class="ai-note">Orden sugerido: arranca por las elaboraciones largas (lasaña) y reserva el salmón y las gambas para el pase.</p>` };
  }
  function renderAllergen(recipe){
    const al=D.recipeAllergens(recipe.id);
    const all=Object.keys(D.allergenLabels);
    const grid=all.map(a=>`<div class="al-cell ${al.includes(a)?'is-on':''}"><span>${D.allergenLabels[a]}</span></div>`).join("");
    return { module:"Alérgenos", title:`Alérgenos · ${recipe.name}`, sub:`${al.length} de 14 declarables detectados`,
      html:`<div class="al-grid">${grid}</div>
      <p class="ai-note">Detección automática cruzando los ingredientes de la receta con los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011).</p>` };
  }
  function renderCompras(){
    // ingredientes bajo mínimos → lista de compra con proveedor más barato
    const need = D.stock.filter(s=>s.qty<s.min);
    const rows = need.map(s=>{
      let best=null;
      D.suppliers.forEach(sup=>{ const p=sup.prices[s.ing]; if(p!=null&&(best===null||p<best.p)) best={sup:sup.name,p}; });
      const qty = Math.max(s.min*2 - s.qty, s.min);
      return `<tr><td>${D.ingMap[s.ing].name}</td><td class="tnum">${num(qty,1)} ${D.ingMap[s.ing].unit}</td><td>${best?best.sup:'—'}</td><td class="tnum">${best?eur(best.p*qty):'—'}</td></tr>`;
    }).join("");
    const total = need.reduce((sum,s)=>{ let best=Infinity; D.suppliers.forEach(sup=>{const p=sup.prices[s.ing]; if(p!=null)best=Math.min(best,p);}); const qty=Math.max(s.min*2-s.qty,s.min); return sum+(best===Infinity?0:best*qty); },0);
    return { module:"Compras", title:"Lista de compra automática", sub:`${need.length} referencias a reponer`,
      html:`<table class="ai-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Mejor proveedor</th><th>Importe</th></tr></thead><tbody>${rows}</tbody>
      <tfoot><tr><td colspan="3">Total pedido estimado</td><td class="tnum">${eur(total)}</td></tr></tfoot></table>
      <p class="ai-note">Generada a partir de los productos bajo mínimos, con el proveedor más económico para cada referencia.</p>` };
  }
  function renderProveedores(){
    const items=["tomate","salmon","parmesano","aceite"];
    const rows=items.map(id=>{
      const cells=D.suppliers.map(s=>{ const p=s.prices[id]; return p!=null?eur(p):'·'; });
      const prices=D.suppliers.map(s=>s.prices[id]).filter(p=>p!=null);
      const min=Math.min(...prices);
      const tds=D.suppliers.map(s=>{ const p=s.prices[id]; return `<td class="tnum ${p===min?'cell-best':''}">${p!=null?eur(p):'·'}</td>`; }).join("");
      return `<tr><td>${D.ingMap[id].name}</td>${tds}</tr>`;
    }).join("");
    const heads=D.suppliers.map(s=>`<th>${s.name.split(" ")[0]}</th>`).join("");
    return { module:"Proveedores", title:"Comparativa de proveedores", sub:"Mejor precio resaltado por referencia",
      html:`<table class="ai-table ai-table--sup"><thead><tr><th>Producto</th>${heads}</tr></thead><tbody>${rows}</tbody></table>
      <p class="ai-note">Comparativa en vivo entre tus ${D.suppliers.length} proveedores dados de alta.</p>` };
  }

  function renderMerma(){
    const items=(window.NovaApp && window.NovaApp.store.get("nova_mermas",[]))||[];
    const total=items.reduce((s,m)=>s+m.cost,0);
    const month=items.filter(m=>(m.date||"").slice(0,7)==="2026-06").reduce((s,m)=>s+m.cost,0);
    if(!items.length){
      return { module:"Mermas", title:"Aún no hay mermas registradas", sub:"Empieza a medir tus pérdidas",
        html:`<p class="ai-note">Ve al módulo <strong>Mermas</strong> y registra la primera merma (caducidad, rotura, error…). Nova calculará el dinero perdido por período y por motivo.</p>` };
    }
    const byR={}; items.forEach(m=>byR[m.reason]=(byR[m.reason]||0)+m.cost);
    const rows=Object.entries(byR).sort((a,b)=>b[1]-a[1]).map(([r,v])=>`<tr><td>${r}</td><td class="tnum">${eur(v)}</td><td class="tnum">${num(v/total*100,0)}%</td></tr>`).join("");
    return { module:"Mermas", title:"Tus pérdidas por merma", sub:`${items.length} registros`,
      html:`<div class="ai-metrics">
        <div class="ai-metric"><span class="overline">Merma total</span><strong>${eur(total)}</strong></div>
        <div class="ai-metric ai-metric--ember"><span class="overline">Este mes</span><strong>${eur(month)}</strong></div>
        <div class="ai-metric"><span class="overline">Registros</span><strong>${items.length}</strong></div>
      </div>
      <table class="ai-table"><thead><tr><th>Motivo</th><th>Coste</th><th>%</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="ai-note">Consulta el detalle y registra nuevas mermas en el módulo Mermas.</p>` };
  }

  /* ---------- Guía de uso ---------- */
  function guideSearch(query){
    const g=window.NOVA_GUIDE||[]; const n=norm(query);
    let best=null, score=0;
    g.forEach(t=>{
      let s=0;
      (t.keywords||[]).forEach(k=>{ if(n.includes(norm(k))) s+=3; });
      norm(t.title).split(/\s+/).forEach(w=>{ if(w.length>3 && n.includes(w)) s+=1; });
      if(n.includes(norm(t.module))) s+=2;
      if(s>score){score=s;best=t;}
    });
    return score>=3?best:null;
  }
  function renderGuideTopic(t){
    const steps=t.steps.map((s,i)=>`<li><span class="mono">${String(i+1).padStart(2,"0")}</span> ${s}</li>`).join("");
    return { module:"Guía", title:t.title, sub:t.module,
      html:`<p class="ai-note"><strong>Dónde:</strong> ${t.where}</p>
        <ol class="ai-steps" style="margin-top:6px">${steps}</ol>
        ${t.page?`<a class="btn btn--ghost" href="${t.page}" style="margin-top:16px" data-cursor><span>Abrir ${t.module}</span><span class="arw">→</span></a>`:""}` };
  }
  function renderGuideIndex(){
    const g=window.NOVA_GUIDE||[];
    const items=g.map(t=>`<button class="ai-suggest ai-suggest--btn" data-q="${t.q}"><strong>${t.title}</strong><span class="mono">→</span></button>`).join("");
    return { module:"Guía", title:"Guía de uso de Nova", sub:"Elige un tema o pregúntame directamente",
      html:`<p class="ai-note">Puedes preguntarme cosas como «¿dónde está el stock?» o «¿cómo edito las mermas?». Estos son los temas disponibles:</p>
        <div class="ai-suggests" style="margin-top:12px">${items}</div>` };
  }
  function renderGuide(query){ const t=guideSearch(query); return t?renderGuideTopic(t):renderGuideIndex(); }

  /* ---------- Clasificador de intención ---------- */
  function classify(query){
    const q = norm(query);
    const recipe = findRecipe(query);
    const portions = findPortions(query);
    const margin = findMargin(query);
    const season = findSeason(query);

    const steps = ["Analizando la consulta", "Comprendiendo el contexto", "Identificando módulo", "Recuperando datos", "Generando respuesta"];

    let result, module;
    if(/(c[oó]mo|d[oó]nde|ay[uú]da|gu[ií]a|manual|tutorial|para qu[eé] sirve|qu[eé] es la pesta|no s[eé] (c[oó]mo|d[oó]nde)|expl[ií]ca|ens[eé][ñn]a)/.test(q)){
      module="Guía"; result=renderGuide(query);
    } else if(/(precio de venta|pvp|vender|margen)/.test(q) && (margin!==null || recipe)){
      module="Escandallos"; result=renderPricing(recipe||D.recipeMap.lasana, portions, margin!==null?margin:30);
    } else if(/(escandall|coste|costo|cuanto cuesta|precio de coste)/.test(q)){
      module="Escandallos"; result=renderEscandallo(recipe||D.recipeMap.lasana, portions||(recipe?recipe.base:40));
    } else if(/(ficha tecnica|ficha)/.test(q) && recipe){
      module="Recetas"; result=renderFicha(recipe);
    } else if(/(alergen|alergia|intoleran)/.test(q)){
      module="Alérgenos"; result=renderAllergen(recipe||D.recipeMap.lasana);
    } else if(/(merma|perdid|desperdicio|tirad|desech)/.test(q)){
      module="Mermas"; result=renderMerma();
    } else if(/(que puedo cocinar|que cocino|con este stock|con el stock|aprovech)/.test(q)){
      module="Stock"; result=renderStockCook();
    } else if(/(stock|inventario|caduc|bajo minimo|avisos|reponer alerta)/.test(q)){
      module="Stock"; result=renderStockAlerts();
    } else if(/(carta|menu|men\u00fa)/.test(q)){
      module="Carta"; result=renderCarta(season);
    } else if(/(produccion|producir|organiza|planific|viernes|semana)/.test(q)){
      module="Producción"; result=renderProduccion();
    } else if(/(compra|pedido|lista de la compra|reponer)/.test(q)){
      module="Compras"; result=renderCompras();
    } else if(/(proveedor|comparar precio|comparativa)/.test(q)){
      module="Proveedores"; result=renderProveedores();
    } else if(recipe){
      module="Recetas"; result=renderFicha(recipe);
    } else {
      module="Asistente";
      result={ module:"Asistente", title:"Puedo ayudarte con esto", sub:"Prueba con una de estas órdenes",
        html:`<div class="ai-suggests">
          ${['Hazme un escandallo para una lasaña de 40 raciones','¿Qué puedo cocinar con este stock?','Diseña una carta de otoño','Organiza la producción del viernes','Calcula el precio de venta del risotto con un 30% de margen','Detecta los alérgenos de las croquetas'].map(s=>`<button class="ai-suggest ai-suggest--btn" data-q="${s}"><strong>${s}</strong><span class="mono">→</span></button>`).join("")}
        </div>` };
    }
    result.steps = steps;
    result.query = query;
    return result;
  }

  return { classify, eur, num };
})();
