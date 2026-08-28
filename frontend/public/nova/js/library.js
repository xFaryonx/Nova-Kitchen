/* ============================================================
   NOVA · Librería de recetas (local, offline)
   Colección lista para explorar y añadir a "Mis recetas".
   Usa ingredientes ya existentes en NOVA_DATA.
   ============================================================ */
window.NOVA_LIBRARY = [
  { id:"lib_tortilla", name:"Tortilla de patatas", cat:"Entrante", base:4, minutes:35, season:["todo"],
    steps:["Freír la patata y la cebolla en aceite","Batir los huevos y mezclar","Cuajar por ambos lados"],
    items:[{ing:"patata",qty:0.6},{ing:"huevo",qty:0.5},{ing:"cebolla",qty:0.15},{ing:"aceite",qty:0.1},{ing:"sal",qty:0.01}] },
  { id:"lib_sopa_tomate", name:"Sopa de tomate", cat:"Entrante", base:4, minutes:40, season:["verano","otoño"],
    steps:["Pochar cebolla y ajo","Añadir el tomate y guisar","Mojar con caldo y triturar"],
    items:[{ing:"tomate",qty:1.0},{ing:"cebolla",qty:0.15},{ing:"ajo",qty:0.02},{ing:"caldo",qty:0.6},{ing:"aceite",qty:0.04},{ing:"sal",qty:0.01}] },
  { id:"lib_arroz_setas", name:"Arroz meloso de setas", cat:"Principal", base:4, minutes:35, season:["otoño","invierno"],
    steps:["Sofreír cebolla y ajo","Nacarar el arroz","Añadir setas y champiñón","Mojar con caldo y cocer"],
    items:[{ing:"arroz",qty:0.32},{ing:"seta",qty:0.25},{ing:"champinon",qty:0.15},{ing:"cebolla",qty:0.1},{ing:"ajo",qty:0.02},{ing:"caldo",qty:1.0},{ing:"aceite",qty:0.03},{ing:"sal",qty:0.01}] },
  { id:"lib_salmon_horno", name:"Salmón al horno con limón", cat:"Principal", base:4, minutes:25, season:["primavera","verano"],
    steps:["Colocar el salmón en bandeja","Regar con aceite y limón","Hornear 12 min"],
    items:[{ing:"salmon",qty:0.64},{ing:"limon",qty:0.15},{ing:"aceite",qty:0.04},{ing:"sal",qty:0.01},{ing:"pimienta",qty:0.002}] },
  { id:"lib_crema_champi", name:"Crema de champiñones", cat:"Entrante", base:4, minutes:35, season:["otoño","invierno"],
    steps:["Pochar cebolla","Saltear los champiñones","Cubrir con caldo, cocer y triturar","Terminar con nata"],
    items:[{ing:"champinon",qty:0.6},{ing:"cebolla",qty:0.1},{ing:"caldo",qty:0.7},{ing:"nata",qty:0.1},{ing:"aceite",qty:0.03},{ing:"sal",qty:0.01}] },
  { id:"lib_graten_patata", name:"Gratén de patata", cat:"Principal", base:4, minutes:60, season:["invierno"],
    steps:["Laminar la patata","Napar con nata","Cubrir de parmesano y gratinar"],
    items:[{ing:"patata",qty:0.9},{ing:"nata",qty:0.35},{ing:"parmesano",qty:0.1},{ing:"mantequilla",qty:0.04},{ing:"sal",qty:0.01}] },
  { id:"lib_risotto_calabaza", name:"Risotto de calabaza", cat:"Principal", base:4, minutes:35, season:["otoño"],
    steps:["Sofreír cebolla","Nacarar el arroz","Añadir calabaza en dados","Mojar con caldo y mantecar"],
    items:[{ing:"arroz",qty:0.32},{ing:"calabaza",qty:0.4},{ing:"cebolla",qty:0.1},{ing:"caldo",qty:1.0},{ing:"parmesano",qty:0.08},{ing:"mantequilla",qty:0.04},{ing:"aceite",qty:0.03},{ing:"sal",qty:0.01}] },
  { id:"lib_pesto", name:"Pasta al pesto", cat:"Principal", base:4, minutes:20, season:["primavera","verano"],
    steps:["Triturar albahaca, ajo, aceite y parmesano","Cocer la pasta","Mezclar con el pesto"],
    items:[{ing:"pasta_lasana",qty:0.4},{ing:"albahaca",qty:0.08},{ing:"parmesano",qty:0.08},{ing:"ajo",qty:0.01},{ing:"aceite",qty:0.08},{ing:"sal",qty:0.01}] },
  { id:"lib_flan", name:"Flan de huevo", cat:"Postre", base:6, minutes:60, season:["todo"],
    steps:["Caramelizar el azúcar en los moldes","Mezclar huevo, leche y azúcar","Cuajar al baño maría"],
    items:[{ing:"huevo",qty:0.35},{ing:"leche",qty:0.7},{ing:"azucar",qty:0.18}] },
  { id:"lib_bizcocho", name:"Bizcocho casero", cat:"Postre", base:8, minutes:50, season:["todo"],
    steps:["Batir huevos con azúcar","Añadir mantequilla y leche","Incorporar la harina y hornear"],
    items:[{ing:"harina",qty:0.3},{ing:"huevo",qty:0.35},{ing:"azucar",qty:0.22},{ing:"mantequilla",qty:0.12},{ing:"leche",qty:0.12}] },
  { id:"lib_sopa_verduras", name:"Sopa de verduras", cat:"Entrante", base:4, minutes:40, season:["invierno"],
    steps:["Pochar cebolla, zanahoria y apio","Añadir patata y caldo","Cocer 25 min"],
    items:[{ing:"zanahoria",qty:0.2},{ing:"apio",qty:0.08},{ing:"cebolla",qty:0.12},{ing:"patata",qty:0.3},{ing:"caldo",qty:1.0},{ing:"aceite",qty:0.03},{ing:"sal",qty:0.01}] },
  { id:"lib_gambas_ensalada", name:"Ensalada templada de gambas", cat:"Entrante", base:4, minutes:15, season:["primavera","verano"],
    steps:["Saltear las gambas","Aliñar con aceite y limón"],
    items:[{ing:"gamba",qty:0.5},{ing:"limon",qty:0.1},{ing:"aceite",qty:0.05},{ing:"sal",qty:0.01}] }
];
