/* ============================================================
   NOVA · Calculadora flotante (semitransparente, abrir/cerrar)
   Se auto-inyecta en cualquier página que incluya este script.
   ============================================================ */
(function () {
  const KEYS = [
    ["C","del","%","÷"],
    ["7","8","9","×"],
    ["4","5","6","−"],
    ["1","2","3","+"],
    ["0",".","="]
  ];

  function build() {
    const wrap = document.createElement("div");
    wrap.className = "novacalc";
    wrap.innerHTML = `
      <button class="novacalc__fab" id="ncFab" aria-label="Abrir calculadora" data-testid="calc-fab">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h4M16 18h.01"/></svg>
      </button>
      <div class="novacalc__panel" id="ncPanel" role="dialog" aria-label="Calculadora" data-testid="calc-panel">
        <div class="novacalc__head">
          <span class="novacalc__title">Cálculo rápido</span>
          <button class="novacalc__close" id="ncClose" aria-label="Cerrar" data-testid="calc-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="novacalc__screen">
          <div class="novacalc__expr" id="ncExpr"></div>
          <div class="novacalc__out" id="ncOut">0</div>
        </div>
        <div class="novacalc__keys" id="ncKeys">
          ${KEYS.map(row=>row.map(k=>{
            const op = ["÷","×","−","+"].includes(k);
            const eq = k==="=";
            const fn = k==="C"||k==="del"||k==="%";
            const zero = k==="0";
            let cls="novacalc__key";
            if(op)cls+=" is-op"; if(eq)cls+=" is-eq"; if(fn)cls+=" is-fn"; if(zero)cls+=" is-zero";
            return `<button class="${cls}" data-k="${k}" data-testid="calc-key-${k}">${k==="del"?"⌫":k}</button>`;
          }).join("")).join("")}
        </div>
      </div>`;
    document.body.appendChild(wrap);
    return wrap;
  }

  function init() {
    const wrap = build();
    const fab = wrap.querySelector("#ncFab");
    const panel = wrap.querySelector("#ncPanel");
    const close = wrap.querySelector("#ncClose");
    const exprEl = wrap.querySelector("#ncExpr");
    const outEl = wrap.querySelector("#ncOut");
    const keys = wrap.querySelector("#ncKeys");

    let expr = "";       // expresión interna (con . * / + -)
    let justEval = false;

    const fmt = s => s.replace(/\*/g,"×").replace(/\//g,"÷").replace(/-/g,"−");
    function render() {
      exprEl.textContent = fmt(expr);
      try {
        if (!expr) { outEl.textContent = "0"; return; }
        const safe = /^[0-9+\-*/.%() ]+$/.test(expr);
        if (!safe) return;
        let e = expr.replace(/%/g, "/100");
        // evita error con operador final
        if (/[+\-*/.]$/.test(e)) e = e.slice(0,-1);
        if (!e) { outEl.textContent = "0"; return; }
        const v = Function('"use strict";return (' + e + ')')();
        if (v === undefined || Number.isNaN(v) || !Number.isFinite(v)) return;
        outEl.textContent = (Math.round(v*10000)/10000).toLocaleString("es-ES");
      } catch (e) { /* expresión incompleta */ }
    }

    function press(k) {
      if (k === "C") { expr = ""; justEval=false; render(); return; }
      if (k === "del") { expr = expr.slice(0,-1); render(); return; }
      if (k === "=") {
        try {
          let e = expr.replace(/%/g,"/100").replace(/[+\-*/.]$/,"");
          if(!e) return;
          const v = Function('"use strict";return ('+e+')')();
          if(Number.isFinite(v)){ expr = String(Math.round(v*10000)/10000); justEval=true; render(); }
        } catch(e){}
        return;
      }
      const opMap = { "÷":"/", "×":"*", "−":"-", "+":"+" };
      if (opMap[k]) {
        if (justEval) justEval=false;
        if (expr==="" ) return;
        if (/[+\-*/]$/.test(expr)) expr = expr.slice(0,-1);
        expr += opMap[k]; render(); return;
      }
      if (k === "%") { if(expr && !/[+\-*/.%]$/.test(expr)) expr += "%"; render(); return; }
      // dígito o punto
      if (justEval && /[0-9.]/.test(k)) { expr=""; justEval=false; }
      if (k === "." ) {
        const last = expr.split(/[+\-*/]/).pop();
        if (last.includes(".")) return;
        if (last==="") expr += "0";
      }
      expr += k; render();
    }

    keys.addEventListener("click", e => {
      const b = e.target.closest("[data-k]"); if(!b) return;
      press(b.getAttribute("data-k"));
    });

    function toggle(open) {
      const show = open===undefined ? !panel.classList.contains("open") : open;
      panel.classList.toggle("open", show);
      fab.classList.toggle("hidden-fab", show);
    }
    fab.addEventListener("click", ()=>toggle(true));
    close.addEventListener("click", ()=>toggle(false));

    // teclado físico cuando el panel está abierto
    document.addEventListener("keydown", e => {
      if (!panel.classList.contains("open")) return;
      const k = e.key;
      if (/[0-9]/.test(k)) press(k);
      else if (k===".") press(".");
      else if (k==="+"||k==="-") press(k==="+"?"+":"−");
      else if (k==="*") press("×");
      else if (k==="/") { e.preventDefault(); press("÷"); }
      else if (k==="%") press("%");
      else if (k==="Enter"||k==="=") { e.preventDefault(); press("="); }
      else if (k==="Backspace") press("del");
      else if (k==="Escape") toggle(false);
      else if (k.toLowerCase()==="c") press("C");
    });

    // enlazar cursor personalizado si existe
    if (window.NovaApp && window.NovaApp._bindCursor) window.NovaApp._bindCursor();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
