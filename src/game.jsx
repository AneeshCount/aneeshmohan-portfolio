import React, { useEffect, useRef, useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   GRID MASTER — live site energy management
   Sources: Solar PV, Battery, Grid (capped by a fuse). Loads: Building + EV
   chargers. Keep grid IMPORT under the fuse (3s over = blackout/lose).
   Discharge the battery when spot price is high, soak up solar, charge the cars.
   ════════════════════════════════════════════════════════════════════════ */

const DAY = 150, TICK_MS = 300, DT = 24 / DAY;          // ~45s = one day
const SOLAR_MAX = 10, FUSE = 14;                         // kW
const BATT_CAP = 16, BATT_KW = 6;                        // kWh / kW
const LEVELS = [0, 3.5, 7, 11];                          // charger throttle (kW)
const HIGH = 10, FEED = 3;                               // ₹ price threshold / feed-in
const OVER_TICKS = Math.ceil(3000 / TICK_MS);            // 3s breach = lose
const TOTAL_CARS = 5, PMAX = 20;

const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
const sun = (f) => Math.max(0, Math.sin(Math.PI * f));
const buildingAt = (f) => 1.2 + 3.4 * gauss(f, 0.32, 0.06) + 4.2 * gauss(f, 0.8, 0.07) + 1.2 * gauss(f, 0.55, 0.18);
const priceAt = (f) => 4 + 9 * gauss(f, 0.34, 0.06) + 13 * gauss(f, 0.8, 0.07) + 1.5 * gauss(f, 0.5, 0.2);

const fresh = () => ({
  t: 0, solar: 0, building: 0, price: 6, hist: [],
  chargers: [{ car: null, lvl: 0 }, { car: null, lvl: 0 }, { car: null, lvl: 0 }],
  batt: { kwh: BATT_CAP * 0.55, mode: 'auto' },
  spawned: 0, nextSpawn: 2,
  gridDraw: 0, load: 0, bCharge: 0, bDischarge: 0,
  importE: 0, exportE: 0, loadE: 0, solarE: 0, cost: 0,
  over: 0, done: 0, missed: 0,
});

function step(g) {
  g.t++;
  const f = g.t / DAY;
  g.solar = +(SOLAR_MAX * sun(f)).toFixed(2);
  g.building = +buildingAt(f).toFixed(2);
  g.price = +(priceAt(f) + (Math.random() - 0.5) * 1.5).toFixed(1);
  g.hist.push(g.price);

  // spawn EVs into free bays
  if (g.spawned < TOTAL_CARS && g.t >= g.nextSpawn) {
    const i = g.chargers.findIndex((c) => !c.car);
    if (i >= 0) {
      g.chargers[i].car = { need: 9 + Math.floor(Math.random() * 7), total: 0, deadline: g.t + 40 + Math.floor(Math.random() * 22) };
      g.chargers[i].car.total = g.chargers[i].car.need;
      g.chargers[i].lvl = 0; g.spawned++; g.nextSpawn = g.t + 16 + Math.floor(Math.random() * 12);
    } else g.nextSpawn = g.t + 3;
  }

  const chargers = g.chargers.reduce((s, c) => s + ((c.car && c.car.need > 0) ? LEVELS[c.lvl] : 0), 0);
  const load = +(g.building + chargers).toFixed(2);
  g.load = load; g.chargersKW = chargers;

  // battery decision
  const socKW = g.batt.kwh / DT, capLeftKW = (BATT_CAP - g.batt.kwh) / DT, surplus = g.solar - load;
  let bC = 0, bD = 0;
  if (g.batt.mode === 'charge') bC = Math.min(BATT_KW, capLeftKW);
  else if (g.batt.mode === 'discharge') bD = Math.min(BATT_KW, socKW);
  else { // auto: soak surplus solar, else cover load when price is high
    if (surplus > 0.2) bC = Math.min(BATT_KW, capLeftKW, surplus);
    else if (g.price >= HIGH && load > g.solar) bD = Math.min(BATT_KW, socKW, load - g.solar);
  }
  g.batt.kwh = Math.max(0, Math.min(BATT_CAP, g.batt.kwh + bC * DT - bD * DT));
  g.bCharge = +bC.toFixed(2); g.bDischarge = +bD.toFixed(2);

  const gridDraw = +(load + bC - g.solar - bD).toFixed(2);
  g.gridDraw = gridDraw;
  const imp = Math.max(0, gridDraw), exp = Math.max(0, -gridDraw);

  // fuse: sustained import over the limit loses the game
  if (imp > FUSE) g.over++; else g.over = 0;

  // accounting
  g.importE += imp * DT; g.exportE += exp * DT; g.loadE += load * DT; g.solarE += g.solar * DT;
  g.cost += imp * DT * g.price - exp * DT * FEED;

  // deliver charge
  for (const c of g.chargers) if (c.car && c.car.need > 0 && LEVELS[c.lvl] > 0) c.car.need = Math.max(0, c.car.need - LEVELS[c.lvl] * DT);
  for (const c of g.chargers) if (c.car) {
    if (c.car.need <= 0) { g.done++; c.car = null; c.lvl = 0; }
    else if (g.t > c.car.deadline) { g.missed++; c.car = null; c.lvl = 0; }
  }
}

const selfSuff = (g) => g.loadE > 0 ? Math.max(0, Math.round((1 - g.importE / g.loadE) * 100)) : 100;
const selfCons = (g) => g.solarE > 0 ? Math.max(0, Math.round((1 - g.exportE / g.solarE) * 100)) : 0;
const scoreOf = (g) => Math.max(0, Math.min(100, Math.round(
  (g.done / TOTAL_CARS) * 45 + selfSuff(g) * 0.35 + (1 - Math.min(1, Math.max(0, g.cost) / 500)) * 20
)));
const gradeOf = (s) => s >= 90 ? 'GRID MASTER' : s >= 70 ? 'EFFICIENT' : s >= 50 ? 'GETTING THERE' : 'INEFFICIENT';

/* ── Power-flow diagram (mirrors the Energiemonitor) ─────────────────────── */
function Flow({ g }) {
  const C = 140;
  const nodes = {
    solar: { x: 140, y: 34, into: true, kW: g.solar, color: '#f5b942', icon: '☀', label: 'Solar' },
    grid: { x: 34, y: 140, into: g.gridDraw > 0, kW: Math.abs(g.gridDraw), color: g.gridDraw > 0 ? '#9aa6b2' : '#2FE3BE', icon: '⚡', label: g.gridDraw >= 0 ? 'Grid in' : 'Feed-in' },
    batt: { x: 140, y: 246, into: g.bDischarge > 0.05, kW: g.bDischarge > 0.05 ? g.bDischarge : g.bCharge, color: '#2FE3BE', icon: '🔋', label: g.bDischarge > 0.05 ? 'Batt out' : g.bCharge > 0.05 ? 'Batt in' : 'Battery' },
    load: { x: 246, y: 140, into: false, kW: g.load, color: '#EAF0EE', icon: '🏠', label: 'Load' },
  };
  return (
    <svg viewBox="0 0 280 280" className="w-full h-auto">
      {Object.entries(nodes).map(([k, n]) => {
        const active = n.kW > 0.1;
        const dur = Math.max(0.4, 2.2 - n.kW * 0.13);
        return (
          <g key={k}>
            <line x1={C} y1={C} x2={n.x} y2={n.y} stroke="rgba(255,255,255,.08)" strokeWidth="2" />
            {active && (
              <line x1={n.x} y1={n.y} x2={C} y2={C} stroke={n.color} strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray="2 9" style={{ animation: `flowdash ${dur}s linear infinite`, animationDirection: n.into ? 'normal' : 'reverse', opacity: 0.95 }} />
            )}
            <circle cx={n.x} cy={n.y} r="22" fill="#0f1a1e" stroke={active ? n.color : 'rgba(255,255,255,.12)'} strokeWidth="1.5" />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="16">{n.icon}</text>
            <text x={n.x} y={n.y + (n.y < C ? -30 : 40)} textAnchor="middle" fontSize="9" fill="#AEBFBB" fontFamily="JetBrains Mono">{n.label}</text>
            <text x={n.x} y={n.y + (n.y < C ? -19 : 51)} textAnchor="middle" fontSize="10" fill="#EAF0EE" fontFamily="JetBrains Mono">{n.kW.toFixed(1)}kW</text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r="16" fill="#14242a" stroke="rgba(47,227,190,.4)" strokeWidth="1.5" />
      <text x={C} y={C + 4} textAnchor="middle" fontSize="13">🏭</text>
    </svg>
  );
}

/* ── Spot price chart ────────────────────────────────────────────────────── */
function PriceChart({ hist, price }) {
  const W = 280, H = 84, n = DAY;
  const x = (i) => (i / (n - 1)) * W;
  const y = (p) => H - (Math.min(p, PMAX) / PMAX) * H;
  const pts = hist.map((p, i) => `${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const i = hist.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect x="0" y="0" width={W} height={y(HIGH)} fill="rgba(255,93,93,.07)" />
      <line x1="0" y1={y(HIGH)} x2={W} y2={y(HIGH)} stroke="rgba(255,93,93,.4)" strokeWidth="1" strokeDasharray="3 4" />
      <text x="3" y={y(HIGH) - 3} fontSize="8" fill="#ff5d5d" fontFamily="JetBrains Mono">high ₹{HIGH}</text>
      {hist.length > 1 && <polyline points={pts} fill="none" stroke="#f5b942" strokeWidth="2" strokeLinejoin="round" />}
      {i >= 0 && <circle cx={x(i)} cy={y(hist[i])} r="3" fill={price >= HIGH ? '#ff5d5d' : '#f5b942'} />}
    </svg>
  );
}

const Stat = ({ label, value, tone }) => (
  <div className="text-center">
    <div className={`font-display text-xl ${tone === 'a' ? 'text-accent' : tone === 'd' ? 'text-danger' : 'text-ivory'}`}>{value}</div>
    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted mt-1">{label}</div>
  </div>
);

export function EnergyGame() {
  const [status, setStatus] = useState('intro'); // intro | playing | over | lost
  const g = useRef(fresh());
  const [, setFrame] = useState(0);
  const render = () => setFrame((f) => f + 1);

  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      step(g.current);
      if (g.current.over >= OVER_TICKS) { clearInterval(id); setStatus('lost'); }
      else if (g.current.t >= DAY) { clearInterval(id); setStatus('over'); }
      render();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status]);

  const start = () => { g.current = fresh(); setStatus('playing'); render(); };
  const cycleCharger = (i) => { const c = g.current.chargers[i]; if (status === 'playing' && c.car) { c.lvl = (c.lvl + 1) % LEVELS.length; render(); } };
  const cycleBatt = () => { if (status !== 'playing') return; const m = g.current.batt.mode; g.current.batt.mode = m === 'auto' ? 'charge' : m === 'charge' ? 'discharge' : 'auto'; render(); };

  const s = g.current;
  const imp = Math.max(0, s.gridDraw);
  const load = Math.min(1, imp / FUSE);
  const danger = imp > FUSE;
  const fuseColor = danger ? 'bg-danger' : load > 0.8 ? 'bg-amber-400' : 'bg-accent';
  const battPct = Math.round((s.batt.kwh / BATT_CAP) * 100);
  const secsOver = danger ? Math.max(0, Math.ceil((OVER_TICKS - s.over) * TICK_MS / 1000)) : 0;

  return (
    <div className="surface p-6 sm:p-8 relative overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl">Grid Master</h3>
          <p className="text-sm text-muted mt-1">Balance solar, battery, grid &amp; building. Keep import under the fuse.</p>
        </div>
        {status === 'playing' && (
          <div className="flex gap-5">
            <Stat label="Self-suff." value={`${selfSuff(s)}%`} tone="a" />
            <Stat label="Cost" value={`₹${Math.round(s.cost)}`} />
            <Stat label="Cars" value={`${s.done}/${TOTAL_CARS}`} />
            <Stat label="Left" value={`${Math.ceil((DAY - s.t) * TICK_MS / 1000)}s`} />
          </div>
        )}
      </div>

      {status === 'intro' && (
        <div className="mt-8 text-center py-6">
          <p className="text-muted max-w-lg mx-auto leading-relaxed">
            You run a site powered by <span className="text-accent">solar</span>, a <span className="text-accent">battery</span> and the <span className="text-accent">grid</span>. A <span className="text-ivory">building</span> draws power all day and <span className="text-ivory">EVs</span> arrive to charge. Throttle the chargers and steer the battery so total <span className="text-danger">grid import never stays over the {FUSE} kW fuse for 3 seconds</span>. Discharge the battery when the <span className="text-amber-400">spot price</span> spikes, soak up surplus solar, and charge every car.
          </p>
          <button onClick={start} className="mt-7 rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Start the day</button>
        </div>
      )}

      {status === 'playing' && (
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          {/* left: flow diagram */}
          <div className="rounded-xl border border-white/[0.07] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-1">Energy flow · live</div>
            <Flow g={s} />
          </div>

          {/* right: fuse + price + battery */}
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${danger ? 'border-danger/60 bg-danger/10' : 'border-white/[0.07]'}`}>
              <div className="flex justify-between font-mono text-[11px] mb-1.5">
                <span className="text-muted uppercase tracking-wider">Grid import · fuse {FUSE}kW</span>
                <span className={danger ? 'text-danger font-bold' : 'text-ivory'}>{danger ? `BREACH! ${secsOver}s` : `${imp.toFixed(1)} kW`}</span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden relative">
                <div className={`h-full ${fuseColor} transition-all duration-200`} style={{ width: `${load * 100}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] p-4">
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-muted uppercase tracking-wider">Spot price</span>
                <span className={s.price >= HIGH ? 'text-danger' : 'text-amber-400'}>₹{s.price.toFixed(1)}/kWh</span>
              </div>
              <PriceChart hist={s.hist} price={s.price} />
            </div>

            <button onClick={cycleBatt} className={`w-full rounded-xl border p-4 text-left transition ${s.bDischarge > 0.05 ? 'border-accent/50 bg-accent/5' : 'border-white/[0.07] hover:border-white/20'}`}>
              <div className="flex justify-between font-mono text-[11px] text-muted uppercase tracking-wider">
                <span>🔋 Battery · {s.batt.mode}</span>
                <span className="text-accent">{s.bDischarge > 0.05 ? `out ${s.bDischarge.toFixed(1)}kW` : s.bCharge > 0.05 ? `in ${s.bCharge.toFixed(1)}kW` : 'idle'}</span>
              </div>
              <div className="mt-2 h-2 rounded bg-white/[0.06] overflow-hidden"><div className="h-full bg-accent" style={{ width: `${battPct}%` }} /></div>
              <div className="font-mono text-[10px] text-muted mt-1.5">{battPct}% · tap to cycle auto / charge / discharge</div>
            </button>
          </div>

          {/* building + chargers */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-2">
              <span>Charging bays · tap to throttle (off → 3.5 → 7 → 11 kW)</span>
              <span>🏠 Building {s.building.toFixed(1)}kW</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {s.chargers.map((c, i) => {
                const urgent = c.car && (c.car.deadline - s.t) < 16;
                const pct = c.car ? Math.round((1 - c.car.need / c.car.total) * 100) : 0;
                return (
                  <button key={i} onClick={() => cycleCharger(i)} disabled={!c.car}
                    className={`relative rounded-lg border p-3 min-h-[108px] text-left transition overflow-hidden ${c.car ? (c.lvl > 0 ? 'border-accent bg-accent/[0.06]' : urgent ? 'border-danger/50' : 'border-white/15 hover:border-white/30') : 'border-dashed border-white/10'}`}>
                    {c.car ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">🚗</span>
                          <span className={`font-mono text-[10px] ${urgent ? 'text-danger' : 'text-muted'}`}>{Math.max(0, Math.ceil((c.car.deadline - s.t) * TICK_MS / 1000))}s</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded bg-white/[0.08] overflow-hidden"><div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} /></div>
                        <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-muted">{pct}%</span>
                          <span className={LEVELS[c.lvl] > 0 ? 'text-accent' : 'text-muted'}>{LEVELS[c.lvl] > 0 ? `${LEVELS[c.lvl]}kW` : 'off'}</span>
                        </div>
                        {LEVELS[c.lvl] > 0 && <div className="absolute bottom-0 left-0 h-0.5 charge-track w-full" />}
                      </>
                    ) : <div className="h-full grid place-items-center font-mono text-[10px] uppercase tracking-wider text-muted/50">Free bay</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {(status === 'over' || status === 'lost') && (
        <div className="mt-6 text-center py-6">
          {status === 'lost' ? (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-danger">Blackout</div>
              <div className="font-display text-4xl text-danger mt-3">⚡ Fuse held over limit</div>
              <p className="text-muted mt-3 max-w-sm mx-auto">The grid breaker tripped the whole site. Throttle chargers and discharge the battery sooner to stay under {FUSE} kW.</p>
            </>
          ) : (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{gradeOf(scoreOf(s))}</div>
              <div className="font-display text-6xl text-ivory mt-3">{scoreOf(s)}<span className="text-2xl text-muted">/100</span></div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                <Stat label="Cars charged" value={`${s.done}/${TOTAL_CARS}`} />
                <Stat label="Self-sufficiency" value={`${selfSuff(s)}%`} tone="a" />
                <Stat label="Self-consumption" value={`${selfCons(s)}%`} tone="a" />
                <Stat label="Net cost" value={`₹${Math.round(s.cost)}`} />
              </div>
            </>
          )}
          <button onClick={start} className="mt-8 rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Play again</button>
        </div>
      )}
    </div>
  );
}
