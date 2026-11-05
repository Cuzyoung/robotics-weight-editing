(() => {
  for (const demo of document.querySelectorAll('.rope-demo')) {
    const output=demo.querySelector('output');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0, start=0, visible=false;
    const render=(progress)=> {
      const s=1+progress/4, delta=(s-1)*3, angle=.35+delta;
      output.value=s.toFixed(2);
      for (const group of demo.querySelectorAll('[data-position]')) {
        const i=Number(group.dataset.position), x=280+65*s*i;
        group.querySelector('circle').setAttribute('cx',x);
        group.querySelectorAll('text').forEach(t=>t.setAttribute('x',x));
        group.querySelector('.coordinate').textContent=i===0?'P':`P + ${(s*i).toFixed(2)}`;
      }
      const x=120+62*Math.cos(angle), y=108-62*Math.sin(angle);
      demo.querySelector('.edit-ray').setAttribute('d',`M 120 108 L ${x} ${y}`);
      demo.querySelector('.edit-tip').setAttribute('cx',x);demo.querySelector('.edit-tip').setAttribute('cy',y);
      demo.querySelector('.angle-arc').setAttribute('d',delta<.001?'':`M ${120+42*Math.cos(.35)} ${108-42*Math.sin(.35)} A 42 42 0 0 0 ${120+42*Math.cos(angle)} ${108-42*Math.sin(angle)}`);
      demo.querySelector('.rotation-value').textContent=`Δθ = ${delta.toFixed(4)} rad`;
    };
    const stop=()=>{cancelAnimationFrame(frame);frame=0;};
    const tick=now=>{
      // Hold the original, stretch, hold the teacher, then gently return.
      const t=(now-start)%8000;
      const ease=x=>(1-Math.cos(Math.PI*x))/2;
      const p=t<1200?0:t<4200?ease((t-1200)/3000):t<6000?1:1-ease((t-6000)/2000);
      render(p);frame=requestAnimationFrame(tick);
    };
    const sync=()=>{
      stop();
      if(reduced.matches){render(1);return;}
      if(visible&&!document.hidden){start=performance.now();frame=requestAnimationFrame(tick);}
    };
    render(reduced.matches?1:0);demo.hidden=false;demo.closest('figure').classList.add('has-rope-demo');
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0.15}).observe(demo);
    document.addEventListener('visibilitychange',sync);
    reduced.addEventListener('change',sync);
  }
})();
