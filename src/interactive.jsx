import { useEffect, useRef } from 'react';
import { tokenColor } from './ui.jsx';

/* ParticleField: a pointer-reactive constellation behind the hero.

   Only ever mounted at motion tier `full` (see sections/hero.jsx), so this
   file no longer carries its own reduced-motion branch: if it is running at
   all, the decision to run it has already been made. That keeps one source of
   truth for how much this device should be asked to animate.

   Colour is resolved from the palette tokens on the canvas itself rather than
   hardcoded, so the field follows the regime it is drawn inside. */
export function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, w, h, dpr;
    const mouse = { x: -9999, y: -9999 };
    let nodes = [];

    /* Read once per resize rather than per frame: getComputedStyle forces a
       style recalc, which is not something to do 60 times a second.

       The drifting field uses the secondary colour and the cursor threads use
       the accent, not the other way round: periwinkle dots on indigo-black
       read as a quiet constellation, marigold threads read as instrumentation
       the visitor is steering. It also means the part of the field the
       visitor is steering is a different signal from the part that is only
       drifting. */
    let line, dot, near;
    const readPalette = () => {
      line = (a) => tokenColor(canvas, '--c-second', a);
      dot = tokenColor(canvas, '--c-second', 0.45);
      near = (a) => tokenColor(canvas, '--c-accent', a);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readPalette();
      const count = Math.min(Math.floor(w / 18), 80);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dxm = mouse.x - n.x, dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 140) { n.x += dxm * 0.008; n.y += dym * 0.008; }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = line(0.11 * (1 - d / 120));
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        /* Threads to the cursor pick up the secondary colour, so the part of
           the field the visitor is steering reads as a different signal from
           the part that is just drifting. */
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 160) {
          ctx.strokeStyle = near(0.3 * (1 - dm / 160));
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = dot;
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-60" aria-hidden />;
}
