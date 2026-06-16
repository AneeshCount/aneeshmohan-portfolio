import React, { useEffect, useRef, useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   ParticleField — mouse-reactive constellation canvas (futuristic hero bg)
   ════════════════════════════════════════════════════════════════════════ */
export function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, w, h, dpr;
    const mouse = { x: -9999, y: -9999 };
    let nodes = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
        // gentle attraction to cursor
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
            ctx.strokeStyle = `rgba(39,224,212,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 160) {
          ctx.strokeStyle = `rgba(39,224,212,${0.3 * (1 - dm / 160)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(94,234,212,0.5)';
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize(); tick();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-70" aria-hidden />;
}

/* ════════════════════════════════════════════════════════════════════════
   AgentConsole — drive a RiDERgy-style agentic energy demo, see real results
   ════════════════════════════════════════════════════════════════════════ */
const CMDS = [
  { label: 'Charge to 80%', key: 'charge' },
  { label: 'Switch to solar', key: 'solar' },
  { label: 'Schedule overnight', key: 'schedule' },
  { label: 'Status report', key: 'status' },
];

export function AgentConsole() {
  const [battery, setBattery] = useState(46);
  const [source, setSource] = useState('grid'); // grid | solar
  const [log, setLog] = useState([{ who: 'agent', text: 'Agent online. Ask me to manage the vehicle and energy.' }]);
  const [busy, setBusy] = useState(false);
  const chargeTimer = useRef(null);
  const logRef = useRef(null);

  useEffect(() => { logRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' }); }, [log]);
  useEffect(() => () => clearInterval(chargeTimer.current), []);

  const run = (key, label) => {
    if (busy) return;
    setBusy(true);
    setLog((l) => [...l, { who: 'you', text: label }]);

    const steps = {
      charge: ['Reading battery state and tariff window', 'Planning charge curve to 80%', 'Dispatching to charger'],
      solar: ['Checking solar generation (4.2 kW available)', 'Rebalancing load from grid to solar', 'Confirming inverter handoff'],
      schedule: ['Finding cheapest overnight window (01:00-05:00)', 'Reserving charger slot', 'Schedule committed'],
      status: ['Querying vehicle + energy telemetry'],
    }[key];

    steps.forEach((s, i) => setTimeout(() => setLog((l) => [...l, { who: 'step', text: s }]), 350 * (i + 1)));

    const after = 350 * (steps.length + 1);
    setTimeout(() => {
      if (key === 'charge') {
        setLog((l) => [...l, { who: 'agent', text: 'Charging to 80% on the cheapest available power. You can watch it climb.' }]);
        clearInterval(chargeTimer.current);
        chargeTimer.current = setInterval(() => {
          setBattery((b) => {
            if (b >= 80) { clearInterval(chargeTimer.current); return 80; }
            return b + 1;
          });
        }, 45);
      } else if (key === 'solar') {
        setSource('solar');
        setLog((l) => [...l, { who: 'agent', text: 'Load shifted to solar. You are now charging on clean, free energy.' }]);
      } else if (key === 'schedule') {
        setLog((l) => [...l, { who: 'agent', text: 'Overnight charge scheduled for 01:00. I will optimise around the lowest tariff.' }]);
      } else {
        setLog((l) => [...l, { who: 'agent', text: `Battery ${battery}%, drawing from ${source}. All systems nominal.` }]);
      }
      setBusy(false);
    }, after + 250);
  };

  return (
    <div className="surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" style={{ animation: 'pulse2 2s infinite' }} /> Agentic energy console
        </h3>
        <span className="font-mono text-[11px] text-slate-600">live demo</span>
      </div>

      {/* battery + source readout */}
      <div className="mt-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Battery</span>
            <span className="font-mono text-white">{battery}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${battery}%`, background: 'linear-gradient(90deg,#27e0d4,#5eead4)' }} />
          </div>
        </div>
        <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${source === 'solar' ? 'border-accent/40 text-accent bg-accent/5' : 'border-white/10 text-slate-400'}`}>
          {source === 'solar' ? 'SOLAR' : 'GRID'}
        </div>
      </div>

      {/* log */}
      <div ref={logRef} className="mt-4 h-36 overflow-y-auto rounded-lg bg-ink/60 border border-white/[0.06] p-3 space-y-1.5 font-mono text-[12px]">
        {log.map((m, i) => (
          <div key={i} className={m.who === 'you' ? 'text-white' : m.who === 'step' ? 'text-slate-500' : 'text-accent'}>
            {m.who === 'you' ? '› ' : m.who === 'step' ? '  ↳ ' : '⚡ '}{m.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CMDS.map((c) => (
          <button key={c.key} onClick={() => run(c.key, c.label)} disabled={busy}
            className="text-xs rounded-lg border border-white/10 px-3 py-2 text-slate-300 hover:border-accent/50 hover:text-accent disabled:opacity-40 transition">
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ReactionGame — "I optimise for speed. Test yours."
   ════════════════════════════════════════════════════════════════════════ */
export function ReactionGame() {
  const [state, setState] = useState('idle'); // idle | waiting | go | result | early
  const [ms, setMs] = useState(null);
  const [best, setBest] = useState(null);
  const t = useRef(null), start = useRef(0);

  useEffect(() => () => clearTimeout(t.current), []);

  const begin = () => {
    setState('waiting'); setMs(null);
    t.current = setTimeout(() => { start.current = performance.now(); setState('go'); }, 1000 + Math.random() * 2200);
  };
  const click = () => {
    if (state === 'idle' || state === 'result' || state === 'early') return begin();
    if (state === 'waiting') { clearTimeout(t.current); setState('early'); return; }
    if (state === 'go') {
      const r = Math.round(performance.now() - start.current);
      setMs(r); setBest((b) => (b == null ? r : Math.min(b, r))); setState('result');
    }
  };

  const ui = {
    idle: { bg: 'bg-panel', title: 'Reflex test', sub: 'Click to start. Tap the instant it turns cyan.' },
    waiting: { bg: 'bg-panel', title: 'Wait for it…', sub: 'Get ready.' },
    go: { bg: 'bg-accent', title: 'CLICK!', sub: '' },
    result: { bg: 'bg-panel', title: `${ms} ms`, sub: 'Click to try again.' },
    early: { bg: 'bg-panel', title: 'Too soon!', sub: 'Wait for cyan. Click to retry.' },
  }[state];

  return (
    <div className="surface p-6 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Speed, quantified</h3>
        <span className="font-mono text-[11px] text-slate-600">{best != null ? `best ${best} ms` : 'mini-game'}</span>
      </div>
      <p className="text-sm text-slate-500 mt-1">I optimise everything for speed. Test your own reflexes.</p>
      <button onClick={click}
        className={`mt-5 flex-1 min-h-[150px] rounded-xl ${ui.bg} ${state === 'go' ? 'text-ink' : 'text-white'} border border-white/[0.07] grid place-items-center transition-colors duration-100 active:scale-[.99]`}>
        <div className="text-center">
          <div className="font-display text-3xl font-bold">{ui.title}</div>
          {ui.sub && <div className={`text-sm mt-1 ${state === 'go' ? 'text-ink/70' : 'text-slate-500'}`}>{ui.sub}</div>}
        </div>
      </button>
    </div>
  );
}
