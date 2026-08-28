/* ============================================================
   NOVA · Consola compartida (proceso IA + render de resultado)
   ============================================================ */
window.NovaConsole = (function () {
  const STEPS_HTML = steps => `
    <div class="ai-process">
      ${steps.map((s,i)=>`<div class="ai-step" data-i="${i}">
        <span class="tick"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" stroke-width="2.4"/></svg></span>${s}</div>`).join("")}
    </div>
    <div class="ai-result" id="aiResult"></div>`;

  function run(bodyEl, query, opts) {
    opts = opts || {};
    const res = window.NovaAI.classify(query);
    bodyEl.innerHTML = STEPS_HTML(res.steps);
    const steps = bodyEl.querySelectorAll(".ai-step");
    const resultEl = bodyEl.querySelector("#aiResult");
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const instant = opts.instant || reduce;
    const gap = instant ? 0 : 240;

    if (instant) {
      steps.forEach(st=>st.classList.add("done"));
    } else {
      steps.forEach((st,i)=>{ setTimeout(()=>st.classList.add("done"), gap*(i+1)); });
    }
    const reveal = ()=>{
      resultEl.innerHTML = `
        <div class="ai-result__head">
          <div class="ai-result__module">${res.module}</div>
          <div class="ai-result__title">${res.title}</div>
          ${res.sub?`<div class="ai-result__sub">${res.sub}</div>`:""}
        </div>${res.html}`;
      if(window.gsap && !instant){
        gsap.fromTo(resultEl,{opacity:0,y:16},{opacity:1,y:0,duration:.7,ease:"power3.out"});
      } else { resultEl.style.opacity=1; }
      resultEl.querySelectorAll("[data-q]").forEach(b=>{
        b.addEventListener("click",()=>run(bodyEl,b.getAttribute("data-q"),opts));
      });
      if(opts.onDone) opts.onDone(res);
    };
    if (instant) reveal(); else setTimeout(reveal, gap*(steps.length+1));

    return res;
  }
  return { run };
})();
