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
        </div>
      </div>`;
    const p2=profile();
    const topMeta=document.getElementById("topMeta");
    if(topMeta) topMeta.innerHTML=`<b>${p2.company}</b><span>${p2.cuisine}</span>`;

    // mobile toggle
    const mob=document.getElementById("mobBtn"), scrim=document.getElementById("scrimM");
    if(mob){mob.addEventListener("click",()=>{side.classList.add("open");scrim.classList.add("show");});
      scrim.addEventListener("click",()=>{side.classList.remove("open");scrim.classList.remove("show");});}
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
    bind(); NovaApp._bindCursor=bind;
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

  function init(active){
    buildShell(active);
    initCursor();
    reveal();
  }

  return { init, profile, log, pushLog, toast, eur, num, store, _bindCursor:null };
})();
