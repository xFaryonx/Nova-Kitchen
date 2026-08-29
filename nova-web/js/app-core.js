/* ============================================================
   NOVA · App core — shell, memoria, utilidades
   ============================================================ */
window.NovaApp = (function () {
  const eur = n => n.toLocaleString("es-ES",{style:"currency",currency:"EUR"});
  const num = (n,d=2) => n.toLocaleString("es-ES",{minimumFractionDigits:d,maximumFractionDigits:d});

  /* ---- Memoria (localStorage con fallback en memoria) ---- */
  const mem = {};
  const store = {
    get(k,def){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):(mem[k]!==undefined?mem[k]:def);}catch(e){return mem[k]!==undefined?mem[k]:def;} },
    set(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){mem[k]=v;} }
  };
  const defaultProfile = { name:"Chef Aitor", company:"Grupo Nova", cuisine:"Cocina de mercado", role:"Jefe de cocina" };
  function profile(){ return store.get("nova_profile", defaultProfile); }
  function log(){ return store.get("nova_log", []); }
  function pushLog(entry){ const l=log(); l.unshift(Object.assign({t:new Date().toISOString()},entry)); store.set("nova_log", l.slice(0,40)); }

  /* ---- Config de navegación ---- */
  const NAV = [
    { group:"Asistente", items:[
      { id:"app", label:"Asistente", href:"app.html", icon:"M8 12h8M8 8h8M8 16h5M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H9l-5 4V5z" }
    ]},
    { group:"Cocina", items:[
      { id:"recetas", label:"Recetas", href:"recetas.html", icon:"M4 4h13a2 2 0 012 2v14H6a2 2 0 01-2-2V4zM4 4v14M9 8h7M9 12h7" },
      { id:"escandallos", label:"Escandallos", href:"escandallos.html", icon:"M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zM9 7h6M9 11h2M13 11h2M9 15h2M13 15h2" },
      { id:"stock", label:"Stock", href:"stock.html", icon:"M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10" },
      { id:"mermas", label:"Mermas", href:"mermas.html", icon:"M12 3v11m0 0l-4-4m4 4l4-4M5 20h14" },
      { id:"produccion", label:"Producción", href:"produccion.html", icon:"M8 2v4M16 2v4M3 8h18M5 6h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" }
    ]},
    { group:"Servicio", items:[
      { id:"carta", label:"Carta", href:"carta.html", icon:"M5 3h14M5 3v18M19 3v18M5 21h14M9 8h6M9 12h6M9 16h4" },
      { id:"alergenos", label:"Alérgenos", href:"alergenos.html", icon:"M12 3l9 16H3L12 3zM12 10v4M12 17h.01" },
      { id:"appcc", label:"APPCC", href:"appcc.html", icon:"M14 14.76V5a2 2 0 00-4 0v9.76a4 4 0 104 0zM12 9v6" }
    ]},
    { group:"Aprovisionamiento", items:[
      { id:"proveedores", label:"Proveedores", href:"proveedores.html", icon:"M1 3h13v10H1zM14 8h4l3 3v2h-7M5.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" },
      { id:"compras", label:"Compras", href:"compras.html", icon:"M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z" }
    ]}
  ];

  function icon(d){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`; }

  function buildShell(active){
    const p = profile();
    const side = document.getElementById("side");
    const initials = p.name.split(" ").map(w=>w[0]).slice(0,2).join("");
    side.innerHTML = `
      <a class="side__brand" href="index.html" data-cursor>
        <svg viewBox="0 0 32 32" fill="none"><path d="M9 23V9l14 14V9" stroke="#D8451C" stroke-width="2.2"/></svg> Nova
      </a>
      ${NAV.map(g=>`
        <div class="side__group">
          <div class="side__label">${g.group}</div>
          <div class="side__nav">
            ${g.items.map(it=>`<a class="side__link ${it.id===active?'active':''}" href="${it.href}" data-cursor data-testid="side-${it.id}">${icon(it.icon)}<span>${it.label}</span></a>`).join("")}
          </div>
        </div>`).join("")}
      <div class="side__foot">
        <div class="side__user">
          <div class="side__avatar">${initials}</div>
          <div><b>${p.name}</b><span>${p.company}</span></div>
          <button class="side__logout" id="logoutBtn" aria-label="Cerrar sesión" data-testid="logout-btn" data-cursor><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg></button>
        </div>
      </div>`;
    const p2=profile();
    const topMeta=document.getElementById("topMeta");
    if(topMeta) topMeta.innerHTML=`<b>${p2.company}</b><span>${p2.cuisine}</span>`;

    // mobile toggle
    const mob=document.getElementById("mobBtn"), scrim=document.getElementById("scrimM");
    if(mob){mob.addEventListener("click",()=>{side.classList.add("open");scrim.classList.add("show");});
      scrim.addEventListener("click",()=>{side.classList.remove("open");scrim.classList.remove("show");});}
    const lo=document.getElementById("logoutBtn");
    if(lo) lo.addEventListener("click",logout);
  }

  /* ---- Toast ---- */
  let toastEl;
  function toast(msg){
    if(!toastEl){toastEl=document.createElement("div");toastEl.className="toast";document.body.appendChild(toastEl);}
    toastEl.textContent=msg;toastEl.classList.add("show");
    clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove("show"),2600);
  }

  /* ---- Cursor (compartido, ligero) ---- */
  function initCursor(){
    if(!matchMedia("(hover:hover)").matches)return;
    document.body.classList.add("cursor-on");
    const cur=document.createElement("div");cur.className="cursor";
    const ring=document.createElement("div");ring.className="cursor-ring";
    document.body.append(cur,ring);
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+"px";cur.style.top=my+"px";});
    (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop);})();
    const bind=()=>document.querySelectorAll("[data-cursor],a,button,input,select").forEach(el=>{
      if(el._cb)return;el._cb=1;
      el.addEventListener("mouseenter",()=>ring.classList.add("is-active"));
      el.addEventListener("mouseleave",()=>ring.classList.remove("is-active"));
    });
    bind(); window.NovaApp._bindCursor=bind;
  }

  /* ---- Reveal ligero de secciones ---- */
  function reveal(){
    const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
    document.querySelectorAll(".r-app").forEach(el=>{
      if(reduce){el.style.opacity=1;return;}
      const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transition="opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)";e.target.style.opacity=1;e.target.style.transform="none";io.unobserve(e.target);}}),{threshold:.12});
      el.style.opacity=0;el.style.transform="translateY(20px)";io.observe(el);
    });
  }

  /* ---- Acceso local (login + onboarding) ---- */
  function isAuthed(){ return store.get("nova_session",false)===true; }
  function isOnboarded(){ const p=store.get("nova_profile",null); return !!(p && p.onboarded===true); }
  function admin(){ return store.get("nova_admin", { user:"Dominguiito11", pass:"TeAmoFran" }); }
  const CUISINES=["Cocina de mercado","Alta cocina / gastronómico","Cocina tradicional","Catering / colectividades","Hotel / restauración","Obrador / pastelería","Bistró / brasserie","Cocina de autor"];

  function showGate(active){
    const g=document.createElement("div"); g.className="gate";
    document.body.appendChild(g);
    requestAnimationFrame(()=>g.classList.add("open"));

    const brand=`<div class="gate__brand"><svg viewBox="0 0 32 32" fill="none"><path d="M9 23V9l14 14V9" stroke="#D8451C" stroke-width="2.4"/></svg> Nova</div>`;

    function close(){
      g.classList.remove("open");
      setTimeout(()=>{ g.remove(); }, 520);
      buildShell(active);
      window.dispatchEvent(new Event("nova:profile"));
      if(window.NovaApp._bindCursor) window.NovaApp._bindCursor();
    }

    function renderLogin(){
      g.innerHTML=`
        <div class="gate__card" data-testid="login-card">
          ${brand}
          <div class="gate__eyebrow">Acceso profesional</div>
          <h2 class="gate__title">Entra a tu cocina</h2>
          <p class="gate__sub">Introduce tus credenciales para acceder al sistema.</p>
          <form id="loginForm" class="gate__form">
            <label class="gate__field"><span>Usuario</span><input id="gUser" type="text" autocomplete="username" placeholder="Usuario" data-testid="login-user"></label>
            <label class="gate__field"><span>Contraseña</span><input id="gPass" type="password" autocomplete="current-password" placeholder="Contraseña" data-testid="login-pass"></label>
            <div class="gate__err" id="gErr"></div>
            <button class="btn btn--ember btn--lg" type="submit" style="width:100%;justify-content:center" data-testid="login-submit"><span>Acceder</span><span class="arw">→</span></button>
          </form>
          <div class="gate__hint mono">Acceso local · sin servidor</div>
        </div>`;
      g.querySelector("#loginForm").addEventListener("submit",e=>{
        e.preventDefault();
        const u=g.querySelector("#gUser").value.trim(), pw=g.querySelector("#gPass").value;
        const a=admin();
        if(u===a.user && pw===a.pass){ store.set("nova_session",true); if(isOnboarded()) close(); else renderOnboard(); }
        else { const er=g.querySelector("#gErr"); er.textContent="Usuario o contraseña incorrectos."; er.classList.add("show"); }
      });
      if(window.NovaApp._bindCursor) window.NovaApp._bindCursor();
    }

    function renderOnboard(){
      const p=store.get("nova_profile",{});
      g.innerHTML=`
        <div class="gate__card" data-testid="onboarding-card">
          ${brand}
          <div class="gate__eyebrow">Bienvenido · 1 minuto</div>
          <h2 class="gate__title">Personalicemos Nova</h2>
          <p class="gate__sub">Cuéntanos quién eres para adaptar el asistente a tu cocina.</p>
          <form id="obForm" class="gate__form">
            <label class="gate__field"><span>Tu nombre</span><input id="obName" type="text" placeholder="Ej. Chef Aitor" value="${p.name||''}" data-testid="ob-name"></label>
            <label class="gate__field"><span>Empresa / establecimiento</span><input id="obCompany" type="text" placeholder="Ej. Grupo Nova" value="${p.company||''}" data-testid="ob-company"></label>
            <label class="gate__field"><span>Tipo de cocina</span>
              <select id="obCuisine" data-testid="ob-cuisine">${CUISINES.map(c=>`<option ${p.cuisine===c?'selected':''}>${c}</option>`).join("")}</select></label>
            <div class="gate__err" id="obErr"></div>
            <button class="btn btn--ember btn--lg" type="submit" style="width:100%;justify-content:center" data-testid="ob-submit"><span>Empezar a cocinar con Nova</span><span class="arw">→</span></button>
          </form>
        </div>`;
      g.querySelector("#obForm").addEventListener("submit",e=>{
        e.preventDefault();
        const name=g.querySelector("#obName").value.trim();
        const company=g.querySelector("#obCompany").value.trim();
        const cuisine=g.querySelector("#obCuisine").value;
        if(!name||!company){ const er=g.querySelector("#obErr"); er.textContent="Completa tu nombre y tu empresa."; er.classList.add("show"); return; }
        store.set("nova_profile",{ name, company, cuisine, role:"Jefe de cocina", onboarded:true });
        close();
      });
      if(window.NovaApp._bindCursor) window.NovaApp._bindCursor();
    }

    if(!isAuthed()) renderLogin(); else renderOnboard();
  }
  function logout(){ store.set("nova_session",false); location.href="index.html"; }

  /* ---- Impresión / PDF ---- */
  let printBound=false;
  function bindPrint(){
    if(printBound) return; printBound=true;
    document.addEventListener("click", e=>{ if(e.target.closest("[data-print]")){ e.preventDefault(); window.print(); } });
  }

  /* ---- Guardado de datos personalizados ---- */
  function saveIngredient(o){
    const arr=store.get("nova_custom_ings",[]); arr.push(o); store.set("nova_custom_ings",arr);
    window.NOVA_DATA.registerIngredient(o);
  }
  function saveRecipe(o){
    const arr=store.get("nova_custom_recipes",[]); arr.push(o); store.set("nova_custom_recipes",arr);
    window.NOVA_DATA.registerRecipe(o);
  }

  /* ---- Ediciones persistentes ---- */
  const D=()=>window.NOVA_DATA;
  function setPrice(ingId, price){
    if(D().ingMap[ingId]) D().ingMap[ingId].price=price;
    const po=store.get("nova_price_overrides",{}); po[ingId]=price; store.set("nova_price_overrides",po);
  }
  function setSupplierPrice(supId, ingId, price){
    const sup=D().suppliers.find(s=>s.id===supId); if(sup) sup.prices[ingId]=price;
    const so=store.get("nova_supplier_overrides",{}); so[supId]=so[supId]||{}; so[supId][ingId]=price; store.set("nova_supplier_overrides",so);
  }
  function setMenuPvp(recipeId, pvp){
    const m=D().menu.find(x=>x.recipe===recipeId); if(m) m.pvp=pvp;
    const mp=store.get("nova_menu_pvp",{}); mp[recipeId]=pvp; store.set("nova_menu_pvp",mp);
  }
  function saveStock(){ store.set("nova_stock", D().stock); }
  function saveProduction(){ store.set("nova_production", D().production); }
  function updateRecipe(id, o){
    o.id=id; D().recipeMap[id]=o;
    const idx=D().recipes.findIndex(r=>r.id===id); if(idx>=0) D().recipes[idx]=o; else D().recipes.push(o);
    const ro=store.get("nova_recipe_overrides",{}); ro[id]=o; store.set("nova_recipe_overrides",ro);
  }
  function saveAllergens(){ store.set("nova_allergens", Object.assign({}, D().allergenLabels)); }
  function saveSuppliers(){ store.set("nova_suppliers", D().suppliers); }

  /* ---- Edición inline de celdas ---- */
  function inlineEdit(el, opts){
    if(el._editing) return; el._editing=true;
    const old=el.innerHTML;
    const inp=document.createElement("input");
    inp.type=opts.type||"number";
    if(opts.step) inp.step=opts.step;
    if(opts.min!=null) inp.min=opts.min;
    inp.value=opts.value; inp.className="cell-input";
    el.innerHTML=""; el.appendChild(inp); inp.focus();
    if(inp.select) try{inp.select();}catch(e){}
    let done=false;
    function commit(save){
      if(done) return; done=true; el._editing=false;
      if(save && inp.value!=="" ) opts.onCommit(inp.value);
      else if(!save) el.innerHTML=old;
    }
    inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){e.preventDefault();commit(true);} else if(e.key==="Escape"){e.preventDefault();commit(false);} });
    inp.addEventListener("blur",()=>commit(true));
  }

  function init(active){
    buildShell(active);
    initCursor();
    reveal();
    bindPrint();
    if(!isAuthed() || !isOnboarded()){ showGate(active); return false; }
    return true;
  }

  return { init, profile, log, pushLog, toast, eur, num, store, logout, saveIngredient, saveRecipe, isAuthed, isOnboarded, setPrice, setSupplierPrice, setMenuPvp, saveStock, saveProduction, updateRecipe, saveAllergens, saveSuppliers, inlineEdit, _bindCursor:null };
})();
