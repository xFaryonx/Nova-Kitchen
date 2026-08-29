/* ============================================================
   NOVA · Landing — motion & interacción
   ============================================================ */
(function () {
  const gsap = window.gsap, Lenis = window.Lenis, ScrollTrigger = window.ScrollTrigger;
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis ---------- */
  let lenis;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = sel => {
    const el = document.querySelector(sel); if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- Cursor ---------- */
  const cur = document.getElementById("cursor"), ring = document.getElementById("cursorRing");
  if (cur && matchMedia("(hover:hover)").matches) {
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+"px";cur.style.top=my+"px";});
    (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop);})();
    const bind=()=>document.querySelectorAll("[data-cursor],a,button,input").forEach(el=>{
      el.addEventListener("mouseenter",()=>ring.classList.add("is-active"));
      el.addEventListener("mouseleave",()=>ring.classList.remove("is-active"));
    });
    bind();
  }

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  function startSite(){
    initReveals(); initHero(); initMarquee(); initStats(); initDemo();
    ScrollTrigger.refresh();
  }
  if (loader && !reduce && !/nointro/.test(location.search)) {
    const letters = document.querySelectorAll("#loaderWord span");
    const sub = document.querySelector(".loader__sub span");
    const bar = document.getElementById("loaderBar");
    const count = document.getElementById("loaderCount");
    const tl = gsap.timeline({ onComplete: startSite });
    tl.to(letters,{y:0,duration:.9,stagger:.08,ease:"power4.out"},.15)
      .to(sub,{y:0,duration:.7,ease:"power3.out"},"-=.5")
      .to(bar,{width:"100%",duration:1.15,ease:"power2.inOut"},.2)
      .to({v:0},{v:100,duration:1.15,ease:"power2.inOut",onUpdate:function(){count.textContent=String(Math.round(this.targets()[0].v)).padStart(2,"0");}},.2)
      .to(loader,{yPercent:-100,duration:.9,ease:"power4.inOut",delay:.15})
      .set(loader,{display:"none"});
  } else if (loader) {
    loader.style.display="none"; startSite();
  }

  /* ---------- Reveals ---------- */
  function initReveals(){
    // Masked line reveal en [data-reveal]
    document.querySelectorAll("[data-reveal]").forEach(el=>{
      const html = el.innerHTML;
      // dividir por <br/> en líneas
      const lines = html.split(/<br\s*\/?>/i);
      el.innerHTML = lines.map(l=>`<span class="r-line"><span>${l}</span></span>`).join("");
      const inner = el.querySelectorAll(".r-line>span");
      if(reduce){gsap.set(inner,{y:0});return;}
      gsap.set(inner,{yPercent:110});
      ScrollTrigger.create({trigger:el,start:"top 85%",once:true,onEnter:()=>{
        gsap.to(inner,{yPercent:0,duration:1,stagger:.09,ease:"power4.out"});
      }});
    });
    // r-up
    gsap.utils.toArray(".r-up").forEach(el=>{
      if(reduce){el.style.opacity=1;return;}
      gsap.to(el,{opacity:1,y:0,duration:.9,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}});
    });
    // module cards stagger
    const cards=gsap.utils.toArray(".mcard");
    if(!reduce&&cards.length){gsap.set(cards,{opacity:0,y:30});
      ScrollTrigger.batch(cards,{start:"top 90%",onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:.8,stagger:.06,ease:"power3.out"})});}
  }

  /* ---------- Nav ---------- */
  const nav=document.getElementById("nav");
  ScrollTrigger.create({start:60,onUpdate:s=>nav.classList.toggle("is-stuck",s.scroll()>60)});
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click",e=>{const h=a.getAttribute("href");if(h.length>1){e.preventDefault();scrollTo(h);closeMenu();}});
  });
  const burger=document.getElementById("burger"),navLinks=document.getElementById("navLinks");
  function closeMenu(){burger.classList.remove("open");navLinks.classList.remove("open");}
  burger&&burger.addEventListener("click",()=>{burger.classList.toggle("open");navLinks.classList.toggle("open");});

  /* ---------- Hero parallax + steam canvas ---------- */
  function initHero(){
    if(!reduce){
      gsap.to(".hero__img",{yPercent:14,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
      gsap.to("#heroSteam",{yPercent:-10,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
      gsap.utils.toArray("[data-parallax] img").forEach(img=>{
        gsap.fromTo(img,{yPercent:-8},{yPercent:8,ease:"none",scrollTrigger:{trigger:img,start:"top bottom",end:"bottom top",scrub:true}});
      });
    }
    // Steam canvas
    const cv=document.getElementById("steamCanvas"); if(!cv||reduce)return;
    const ctx=cv.getContext("2d"); let W,H,parts=[];
    function size(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;}
    size(); addEventListener("resize",size);
    for(let i=0;i<26;i++)parts.push({x:Math.random()*1,y:Math.random(),r:40+Math.random()*90,s:.0006+Math.random()*.0011,o:.02+Math.random()*.05});
    (function draw(){
      ctx.clearRect(0,0,W,H);
      parts.forEach(p=>{
        p.y-=p.s; if(p.y<-0.1){p.y=1.1;p.x=Math.random();}
        const x=p.x*W,y=p.y*H,g=ctx.createRadialGradient(x,y,0,x,y,p.r);
        g.addColorStop(0,`rgba(255,252,245,${p.o})`);g.addColorStop(1,"rgba(255,252,245,0)");
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,p.r,0,7);ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- Marquee ---------- */
  function initMarquee(){
    const track=document.getElementById("marquee"); if(!track)return;
    track.innerHTML+=track.innerHTML;
    if(reduce)return;
    let x=0;const w=track.scrollWidth/2;
    (function m(){x-=0.4;if(-x>=w)x=0;track.style.transform=`translateX(${x}px)`;requestAnimationFrame(m);})();
  }

  /* ---------- Stats count ---------- */
  function initStats(){
    document.querySelectorAll("[data-count]").forEach(el=>{
      const end=+el.getAttribute("data-count");const em=el.querySelector("em");const tgt=em||el;const orig=tgt.textContent;
      if(reduce)return;
      ScrollTrigger.create({trigger:el,start:"top 90%",once:true,onEnter:()=>{
        gsap.fromTo({v:0},{v:0},{v:end,duration:1.4,ease:"power2.out",onUpdate:function(){
          const val=Math.round(this.targets()[0].v);tgt.textContent=(orig.length>1&&orig[0]==="0")?String(val).padStart(2,"0"):val;
        }});
      }});
    });
  }

  /* ---------- Demo IA ---------- */
  function initDemo(){
    const form=document.getElementById("demoForm"),input=document.getElementById("demoInput"),body=document.getElementById("demoBody");
    if(!form)return;
    const go=q=>{window.NovaConsole.run(body,q);};
    form.addEventListener("submit",e=>{e.preventDefault();if(input.value.trim())go(input.value.trim());});
    document.getElementById("demoChips").addEventListener("click",e=>{
      const b=e.target.closest("[data-q]");if(!b)return;input.value=b.getAttribute("data-q");go(input.value);
      scrollTo("#asistente");
    });
    ScrollTrigger.create({trigger:"#asistente",start:"top 60%",once:true,onEnter:()=>go(input.value)});
  }
})();
