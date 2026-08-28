/* ============================================================
   NOVA · Datos del dominio (precargados)
   Todos los precios en € · pesos en kg salvo indicación
   ============================================================ */
window.NOVA_DATA = (function () {

  /* ---- Ingredientes: precio de coste, unidad, alérgenos, categoría ---- */
  const ingredients = [
    { id:"harina",     name:"Harina de trigo",      unit:"kg", price:0.85, cat:"Secos",      allergens:["gluten"] },
    { id:"huevo",      name:"Huevo (docena)",       unit:"ud", price:0.21, cat:"Frescos",    allergens:["huevo"] },
    { id:"leche",      name:"Leche entera",         unit:"L",  price:0.95, cat:"Lácteos",    allergens:["lactosa"] },
    { id:"nata",       name:"Nata 35% MG",          unit:"L",  price:2.80, cat:"Lácteos",    allergens:["lactosa"] },
    { id:"mantequilla",name:"Mantequilla",          unit:"kg", price:8.40, cat:"Lácteos",    allergens:["lactosa"] },
    { id:"parmesano",  name:"Parmesano DOP",        unit:"kg", price:16.90,cat:"Lácteos",    allergens:["lactosa"] },
    { id:"mozzarella", name:"Mozzarella fior di latte",unit:"kg",price:7.20,cat:"Lácteos",   allergens:["lactosa"] },
    { id:"ternera",    name:"Carne picada de ternera",unit:"kg",price:9.60,cat:"Cárnicos",   allergens:[] },
    { id:"cerdo",      name:"Carne picada de cerdo",unit:"kg", price:6.30, cat:"Cárnicos",   allergens:[] },
    { id:"jamon",      name:"Jamón serrano",        unit:"kg", price:14.50,cat:"Cárnicos",   allergens:[] },
    { id:"salmon",     name:"Salmón fresco",        unit:"kg", price:13.90,cat:"Pescados",   allergens:["pescado"] },
    { id:"gamba",      name:"Gamba blanca",         unit:"kg", price:18.00,cat:"Pescados",   allergens:["crustaceos"] },
    { id:"tomate",     name:"Tomate pera",          unit:"kg", price:1.60, cat:"Verduras",   allergens:[] },
    { id:"cebolla",    name:"Cebolla",              unit:"kg", price:0.75, cat:"Verduras",   allergens:[] },
    { id:"ajo",        name:"Ajo",                  unit:"kg", price:3.10, cat:"Verduras",   allergens:[] },
    { id:"zanahoria",  name:"Zanahoria",            unit:"kg", price:0.90, cat:"Verduras",   allergens:[] },
    { id:"apio",       name:"Apio",                 unit:"kg", price:1.40, cat:"Verduras",   allergens:["apio"] },
    { id:"calabaza",   name:"Calabaza",             unit:"kg", price:1.10, cat:"Verduras",   allergens:[] },
    { id:"champinon",  name:"Champiñón portobello", unit:"kg", price:4.20, cat:"Verduras",   allergens:[] },
    { id:"seta",       name:"Setas variadas",       unit:"kg", price:9.80, cat:"Verduras",   allergens:[] },
    { id:"patata",     name:"Patata",               unit:"kg", price:0.65, cat:"Verduras",   allergens:[] },
    { id:"arroz",      name:"Arroz arborio",        unit:"kg", price:2.40, cat:"Secos",      allergens:[] },
    { id:"pasta_lasana",name:"Placas de lasaña",    unit:"kg", price:2.10, cat:"Secos",      allergens:["gluten","huevo"] },
    { id:"aceite",     name:"Aceite de oliva V.E.", unit:"L",  price:7.90, cat:"Aceites",    allergens:[] },
    { id:"vino_blanco",name:"Vino blanco cocina",   unit:"L",  price:3.20, cat:"Bodega",     allergens:["sulfitos"] },
    { id:"caldo",      name:"Caldo de verduras",    unit:"L",  price:1.20, cat:"Secos",      allergens:["apio"] },
    { id:"queso_crema",name:"Queso crema",          unit:"kg", price:5.60, cat:"Lácteos",    allergens:["lactosa"] },
    { id:"azucar",     name:"Azúcar",               unit:"kg", price:1.00, cat:"Secos",      allergens:[] },
    { id:"galleta",    name:"Galleta digestive",    unit:"kg", price:3.40, cat:"Secos",      allergens:["gluten","lactosa"] },
    { id:"pan_rallado",name:"Pan rallado",          unit:"kg", price:1.30, cat:"Secos",      allergens:["gluten"] },
    { id:"sal",        name:"Sal marina",           unit:"kg", price:0.60, cat:"Secos",      allergens:[] },
    { id:"pimienta",   name:"Pimienta negra",       unit:"kg", price:22.00,cat:"Especias",   allergens:[] },
    { id:"albahaca",   name:"Albahaca fresca",      unit:"kg", price:14.00,cat:"Hierbas",    allergens:[] },
    { id:"limon",      name:"Limón",                unit:"kg", price:1.80, cat:"Frutas",     allergens:[] }
  ];
  const ingMap = Object.fromEntries(ingredients.map(i => [i.id, i]));

  /* ---- Recetas: cantidades para "base" raciones ---- */
  const recipes = [
    { id:"lasana", name:"Lasaña boloñesa", cat:"Principal", base:4, season:["otoño","invierno"], minutes:75,
      steps:["Pochar sofrito de cebolla, zanahoria y apio","Añadir las carnes y sellar","Incorporar tomate y vino, guisar 40 min","Montar capas con bechamel y placas","Gratinar con parmesano 18 min"],
      items:[
        {ing:"pasta_lasana",qty:0.30},{ing:"ternera",qty:0.35},{ing:"cerdo",qty:0.15},
        {ing:"tomate",qty:0.50},{ing:"cebolla",qty:0.15},{ing:"zanahoria",qty:0.10},
        {ing:"apio",qty:0.06},{ing:"vino_blanco",qty:0.10},{ing:"leche",qty:0.40},
        {ing:"harina",qty:0.04},{ing:"mantequilla",qty:0.04},{ing:"parmesano",qty:0.12},
        {ing:"aceite",qty:0.03},{ing:"sal",qty:0.01} ]},
    { id:"risotto", name:"Risotto de setas", cat:"Principal", base:4, season:["otoño"], minutes:35,
      steps:["Sofreír cebolla y ajo","Nacarar el arroz","Desglasar con vino blanco","Mojar con caldo caliente cazo a cazo","Mantecar con mantequilla y parmesano"],
      items:[
        {ing:"arroz",qty:0.32},{ing:"seta",qty:0.30},{ing:"champinon",qty:0.15},
        {ing:"cebolla",qty:0.10},{ing:"ajo",qty:0.02},{ing:"vino_blanco",qty:0.10},
        {ing:"caldo",qty:1.00},{ing:"mantequilla",qty:0.05},{ing:"parmesano",qty:0.10},
        {ing:"aceite",qty:0.03},{ing:"sal",qty:0.01} ]},
    { id:"salmon", name:"Salmón a la plancha con verduras", cat:"Principal", base:4, season:["primavera","verano"], minutes:25,
      steps:["Racionar el salmón en supremas de 160 g","Marcar piel abajo","Saltear verduras de temporada","Terminar con aceite y limón"],
      items:[
        {ing:"salmon",qty:0.64},{ing:"calabaza",qty:0.20},{ing:"zanahoria",qty:0.15},
        {ing:"aceite",qty:0.04},{ing:"limon",qty:0.10},{ing:"sal",qty:0.01},{ing:"pimienta",qty:0.002} ]},
    { id:"crema", name:"Crema de calabaza", cat:"Entrante", base:4, season:["otoño","invierno"], minutes:40,
      steps:["Pochar cebolla","Añadir calabaza y patata","Cubrir con caldo y cocer 25 min","Triturar y ajustar con nata"],
      items:[
        {ing:"calabaza",qty:0.80},{ing:"patata",qty:0.20},{ing:"cebolla",qty:0.10},
        {ing:"caldo",qty:0.80},{ing:"nata",qty:0.10},{ing:"aceite",qty:0.03},{ing:"sal",qty:0.01} ]},
    { id:"croquetas", name:"Croquetas de jamón", cat:"Entrante", base:6, season:["todo"], minutes:90,
      steps:["Elaborar bechamel densa","Añadir jamón picado","Enfriar y bolear","Empanar y freír"],
      items:[
        {ing:"jamon",qty:0.20},{ing:"leche",qty:0.75},{ing:"harina",qty:0.12},
        {ing:"mantequilla",qty:0.08},{ing:"huevo",qty:0.20},{ing:"pan_rallado",qty:0.20},
        {ing:"aceite",qty:0.15},{ing:"sal",qty:0.01} ]},
    { id:"tarta", name:"Tarta de queso", cat:"Postre", base:8, season:["todo"], minutes:70,
      steps:["Triturar galleta con mantequilla y forrar molde","Batir queso, nata, huevo y azúcar","Hornear a 180º 45 min","Enfriar 4 h"],
      items:[
        {ing:"queso_crema",qty:0.60},{ing:"nata",qty:0.20},{ing:"huevo",qty:0.35},
        {ing:"azucar",qty:0.18},{ing:"galleta",qty:0.15},{ing:"mantequilla",qty:0.08} ]},
    { id:"gambas_ajillo", name:"Gambas al ajillo", cat:"Entrante", base:4, season:["todo"], minutes:15,
      steps:["Confitar ajo laminado en aceite","Añadir las gambas","Puntas de guindilla y perejil"],
      items:[
        {ing:"gamba",qty:0.60},{ing:"ajo",qty:0.05},{ing:"aceite",qty:0.12},{ing:"sal",qty:0.01} ]}
  ];
  const recipeMap = Object.fromEntries(recipes.map(r => [r.id, r]));

  /* ---- Stock actual ---- */
  const stock = [
    { ing:"harina", qty:12.0, min:5, exp:"2026-11-02" },
    { ing:"ternera", qty:3.2, min:6, exp:"2026-06-14" },
    { ing:"cerdo", qty:4.5, min:4, exp:"2026-06-13" },
    { ing:"salmon", qty:1.1, min:4, exp:"2026-06-12" },
    { ing:"gamba", qty:0.4, min:2, exp:"2026-06-12" },
    { ing:"tomate", qty:9.0, min:6, exp:"2026-06-18" },
    { ing:"cebolla", qty:14.0, min:6, exp:"2026-07-30" },
    { ing:"calabaza", qty:7.5, min:4, exp:"2026-06-25" },
    { ing:"seta", qty:2.8, min:2, exp:"2026-06-13" },
    { ing:"arroz", qty:18.0, min:8, exp:"2027-01-20" },
    { ing:"parmesano", qty:1.4, min:2, exp:"2026-09-10" },
    { ing:"nata", qty:2.0, min:3, exp:"2026-06-16" },
    { ing:"leche", qty:9.0, min:6, exp:"2026-06-20" },
    { ing:"jamon", qty:0.8, min:2, exp:"2026-08-01" },
    { ing:"aceite", qty:11.0, min:5, exp:"2027-03-01" },
    { ing:"queso_crema", qty:3.0, min:2, exp:"2026-06-28" }
  ];

  /* ---- Proveedores + precios por ingrediente ---- */
  const suppliers = [
    { id:"huerta", name:"Huerta del Valle", tag:"Verduras y frutas", lead:1, min:80,
      prices:{ tomate:1.45, cebolla:0.70, zanahoria:0.82, calabaza:1.05, ajo:2.95, patata:0.60, limon:1.70 } },
    { id:"mar", name:"Pescadería Marea", tag:"Pescados y mariscos", lead:1, min:120,
      prices:{ salmon:13.20, gamba:17.40 } },
    { id:"carnes", name:"Cárnicas Robles", tag:"Carnes y embutidos", lead:2, min:100,
      prices:{ ternera:9.20, cerdo:6.05, jamon:13.90 } },
    { id:"lacteo", name:"Central Láctea Norte", tag:"Lácteos y huevos", lead:1, min:60,
      prices:{ leche:0.90, nata:2.65, mantequilla:8.10, parmesano:16.20, mozzarella:6.95, queso_crema:5.30, huevo:0.20 } },
    { id:"seco", name:"Distribuciones Alcántara", tag:"Secos y despensa", lead:3, min:150,
      prices:{ harina:0.80, arroz:2.25, pasta_lasana:2.00, aceite:7.60, azucar:0.95, galleta:3.20, pan_rallado:1.20, sal:0.55, caldo:1.10 } }
  ];

  /* ---- Carta actual (platos con PVP) ---- */
  const menu = [
    { recipe:"crema", pvp:7.50, season:"otoño" },
    { recipe:"croquetas", pvp:9.00, season:"todo" },
    { recipe:"gambas_ajillo", pvp:14.50, season:"todo" },
    { recipe:"risotto", pvp:16.00, season:"otoño" },
    { recipe:"lasana", pvp:15.00, season:"invierno" },
    { recipe:"salmon", pvp:19.50, season:"verano" },
    { recipe:"tarta", pvp:6.50, season:"todo" }
  ];

  /* ---- Producción semanal ---- */
  const production = [
    { day:"Lunes", tasks:[{recipe:"crema",portions:30},{recipe:"croquetas",portions:60}] },
    { day:"Martes", tasks:[{recipe:"lasana",portions:24},{recipe:"tarta",portions:16}] },
    { day:"Miércoles", tasks:[{recipe:"risotto",portions:20},{recipe:"crema",portions:24}] },
    { day:"Jueves", tasks:[{recipe:"croquetas",portions:48},{recipe:"tarta",portions:24}] },
    { day:"Viernes", tasks:[{recipe:"lasana",portions:40},{recipe:"salmon",portions:30},{recipe:"gambas_ajillo",portions:24}] },
    { day:"Sábado", tasks:[{recipe:"salmon",portions:40},{recipe:"risotto",portions:30},{recipe:"tarta",portions:32}] },
    { day:"Domingo", tasks:[] }
  ];

  /* ---- Registros APPCC ---- */
  const appcc = [
    { id:"r1", type:"Recepción mercancía", target:"≤ 4 ºC", value:"3.2 ºC", when:"08:12", status:"ok", who:"Marta" },
    { id:"r2", type:"Cámara refrigeración 1", target:"0–4 ºC", value:"2.8 ºC", when:"09:00", status:"ok", who:"Auto" },
    { id:"r3", type:"Congelador", target:"≤ -18 ºC", value:"-16.4 ºC", when:"09:00", status:"alert", who:"Auto" },
    { id:"r4", type:"Aceite freidora", target:"≤ 175 ºC", value:"171 ºC", when:"12:30", status:"ok", who:"Luis" },
    { id:"r5", type:"Regeneración caliente", target:"≥ 65 ºC", value:"68 ºC", when:"13:05", status:"ok", who:"Luis" },
    { id:"r6", type:"Limpieza superficies", target:"Protocolo P-03", value:"Completado", when:"16:40", status:"ok", who:"Marta" }
  ];

  const allergenLabels = {
    gluten:"Gluten", crustaceos:"Crustáceos", huevo:"Huevo", pescado:"Pescado",
    cacahuetes:"Cacahuetes", soja:"Soja", lactosa:"Lácteos", frutos_cascara:"Frutos de cáscara",
    apio:"Apio", mostaza:"Mostaza", sesamo:"Sésamo", sulfitos:"Sulfitos", altramuces:"Altramuces", moluscos:"Moluscos"
  };

  /* ---- Helpers de cálculo ---- */
  function recipeCost(recipeId, portions) {
    const r = recipeMap[recipeId]; if (!r) return null;
    const factor = portions / r.base;
    const lines = r.items.map(it => {
      const ing = ingMap[it.ing];
      const qty = it.qty * factor;
      const cost = qty * ing.price;
      return { id:it.ing, name:ing.name, unit:ing.unit, qty, unitPrice:ing.price, cost, allergens:ing.allergens };
    });
    const total = lines.reduce((s,l)=>s+l.cost,0);
    return { recipe:r, portions, factor, lines, total, perPortion: total/portions };
  }
  function recipeAllergens(recipeId) {
    const r = recipeMap[recipeId]; if (!r) return [];
    const set = new Set();
    r.items.forEach(it => ingMap[it.ing].allergens.forEach(a => set.add(a)));
    return [...set];
  }
  function pvpFromMargin(cost, marginPct) {
    // margen sobre PVP (food cost); PVP = coste / (1 - margen)
    return cost / (1 - marginPct/100);
  }

  // Registro de datos personalizados (mutando los mismos arrays/mapas)
  function registerIngredient(o){
    if(!o||!o.id||ingMap[o.id]) return false;
    ingredients.push(o); ingMap[o.id]=o; return true;
  }
  function registerRecipe(o){
    if(!o||!o.id||recipeMap[o.id]) return false;
    recipes.push(o); recipeMap[o.id]=o; return true;
  }

  return {
    ingredients, ingMap, recipes, recipeMap, stock, suppliers, menu,
    production, appcc, allergenLabels,
    recipeCost, recipeAllergens, pvpFromMargin,
    registerIngredient, registerRecipe
  };
})();
