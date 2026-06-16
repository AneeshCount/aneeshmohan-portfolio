import React, { useEffect, useRef, useState } from 'react';

/* ════════════════════════════════════════════════════════════════════════
   GRID MASTER — plan the power, beat the fuse, maximise efficiency.
   Sources: Solar (free, varies), Battery (store/discharge), Grid (capped fuse).
   Charge every EV before it leaves, stay under the fuse, prefer clean + off-peak.
   ════════════════════════════════════════════════════════════════════════ */

const DAY = 160;          // ticks in a "day"
const TICK_MS = 250;      // 40s round
const DT = 12 / DAY;      // hours per tick
const CHARGER_KW = 7;
const FUSE = 12;          // grid limit (kW)
const SOLAR_MAX = 9;
const BATT_CAP = 20;      // kWh
const BATT_DISCHARGE_KW = 8;
const BATT_CHARGE_KW = 6;
const TRIP_TICKS = 12;    // breaker lockout (~3s)
const TOTAL_CARS = 5;
const OFFPEAK = 8, PEAK = 18, COST_BUDGET = 460;

const fresh = () => ({
  t: 0, solar: 0, peak: false, trip: 0,
  chargers: [{ car: null, on: false }, { car: null, on: false }, { car: null, on: false }],
  batt: { kwh: BATT_CAP * 0.6, mode: 'auto' },
  spawned: 0, nextSpawn: 2,
  gridKW: 0, demandKW: 0,
  clean: 0, gridE: 0, cost: 0, overloads: 0, done: 0, missed: 0,
  flash: null,
});

function step(g) {
  g.t++;
  const frac = g.t / DAY;
  g.solar = +(SOLAR_MAX * Math.max(0, Math.sin(Math.PI * frac))).toFixed(1);
  g.peak = frac > 0.6 && frac < 0.9;
  if (g.trip > 0) g.trip--;

  if (g.spawned < TOTAL_CARS && g.t >= g.nextSpawn) {
    const idx = g.chargers.findIndex((c) => !c.car);
    if (idx >= 0) {
      const need = 11 + Math.floor(Math.random() * 7);
      g.chargers[idx].car = { need, total: need, deadline: g.t + 36 + Math.floor(Math.random() * 18) };
      g.chargers[idx].on = false;
      g.spawned++; g.nextSpawn = g.t + 20 + Math.floor(Math.random() * 12);
    } else { g.nextSpawn = g.t + 3; }
  }

  let demand = 0;
  if (g.trip <= 0) { for (const c of g.chargers) if (c.on && c.car && c.car.need > 0) demand += CHARGER_KW; }
  else { for (const c of g.chargers) c.on = false; }

  let solarUsed = Math.min(demand, g.solar);
  let rem = demand - solarUsed;
  let battKW = 0;
  const wantDis = g.batt.mode === 'discharge' || (g.batt.mode === 'auto' && rem > FUSE);
  if (wantDis && g.batt.kwh > 0 && rem > 0) { battKW = Math.min(rem, BATT_DISCHARGE_KW, g.batt.kwh / DT); rem -= battKW; }
  let grid = rem;

  if (grid > FUSE) {
    g.trip = TRIP_TICKS; g.overloads++;
    for (const c of g.chargers) c.on = false;
    grid = 0; solarUsed = 0; battKW = 0; demand = 0;
    g.flash = { type: 'overload', until: g.t + TRIP_TICKS };
  }
  g.gridKW = +grid.toFixed(1); g.demandKW = demand;

  if (g.trip <= 0) for (const c of g.chargers) if (c.on && c.car && c.car.need > 0) c.car.need = Math.max(0, c.car.need - CHARGER_KW * DT);

  const leftover = Math.max(0, g.solar - solarUsed);
  if ((g.batt.mode === 'charge' || g.batt.mode === 'auto') && leftover > 0)
    g.batt.kwh = Math.min(BATT_CAP, g.batt.kwh + Math.min(BATT_CHARGE_KW, leftover) * DT);
  if (battKW > 0) g.batt.kwh = Math.max(0, g.batt.kwh - battKW * DT);

  g.clean += (solarUsed + battKW) * DT;
  g.gridE += grid * DT;
  g.cost += grid * DT * (g.peak ? PEAK : OFFPEAK);

  for (const c of g.chargers) {
    if (c.car) {
      if (c.car.need <= 0) { g.done++; c.car = null; c.on = false; g.flash = { type: 'done', until: g.t + 6 }; }
      else if (g.t > c.car.deadline) { g.missed++; c.car = null; c.on = false; g.flash = { type: 'missed', until: g.t + 8 }; }
    }
  }
}

const scoreOf = (g) => {
  const completion = g.done / TOTAL_CARS;
  const cleanShare = (g.clean + g.gridE) > 0 ? g.clean / (g.clean + g.gridE) : 1;
  const costScore = 1 - Math.min(1, g.cost / COST_BUDGET);
  return Math.max(0, Math.min(100, Math.round(completion * 50 + cleanShare * 30 + costScore * 20 - g.overloads * 8)));
};
const gradeOf = (s) => s >= 90 ? 'GRID MASTER' : s >= 70 ? 'EFFICIENT' : s >= 50 ? 'GETTING THERE' : 'BROWNOUT';

/* ── UI bits ─────────────────────────────────────────────────────────────── */
const Stat = ({ label, value, accent }) => (
  <div className="text-center">
    <div className={`font-display text-xl ${accent ? 'text-accent' : 'text-ivory'}`}>{value}</div>
    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted mt-1">{label}</div>
  </div>
);

export function EnergyGame() {
  const [status, setStatus] = useState('intro'); // intro | playing | over
  const g = useRef(fresh());
  const [, setFrame] = useState(0);
  const render = () => setFrame((f) => f + 1);

  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      step(g.current);
      if (g.current.t >= DAY) { clearInterval(id); setStatus('over'); }
      render();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status]);

  const start = () => { g.current = fresh(); setStatus('playing'); render(); };
  const toggleCharger = (i) => {
    if (status !== 'playing') return;
    const c = g.current.chargers[i];
    if (c.car && g.current.trip <= 0) { c.on = !c.on; render(); }
  };
  const cycleBattery = () => {
    if (status !== 'playing') return;
    const m = g.current.batt.mode;
    g.current.batt.mode = m === 'auto' ? 'charge' : m === 'charge' ? 'discharge' : 'auto';
    render();
  };

  const s = g.current;
  const load = Math.min(1, s.gridKW / FUSE);
  const loadColor = s.trip > 0 ? 'bg-danger' : load > 0.85 ? 'bg-danger' : load > 0.6 ? 'bg-amber-400' : 'bg-accent';
  const battPct = Math.round((s.batt.kwh / BATT_CAP) * 100);
  const overloading = s.flash?.type === 'overload' && s.t < s.flash.until;

  return (
    <div className="surface p-6 sm:p-8 relative overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl">Grid Master</h3>
          <p className="text-sm text-muted mt-1">Plan the power. Beat the fuse. Charge every car.</p>
        </div>
        {status === 'playing' && (
          <div className="flex gap-6">
            <Stat label="Score" value={scoreOf(s)} accent />
            <Stat label="Time left" value={`${Math.ceil((DAY - s.t) * TICK_MS / 1000)}s`} />
            <Stat label="Charged" value={`${s.done}/${TOTAL_CARS}`} />
          </div>
        )}
      </div>

      {/* INTRO */}
      {status === 'intro' && (
        <div className="mt-8 text-center py-8">
          <p className="text-muted max-w-md mx-auto leading-relaxed">
            Power comes from <span className="text-accent">solar</span> (free, varies), a <span className="text-accent">battery</span>, and the <span className="text-accent">grid</span> (capped by a fuse). Turn chargers on to fill arriving EVs, but keep total grid draw under the fuse or the breaker trips. Prefer solar, battery and off-peak power for a high efficiency score.
          </p>
          <button onClick={start} className="mt-7 rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Start the day</button>
        </div>
      )}

      {/* PLAYING */}
      {status === 'playing' && (
        <div className="mt-6 space-y-5">
          {/* HUD: grid gauge + tariff + cost */}
          <div className="grid sm:grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1.5">
                <span className="text-muted uppercase tracking-wider">Grid load · fuse {FUSE}kW</span>
                <span className={s.trip > 0 ? 'text-danger' : 'text-ivory'}>{s.trip > 0 ? 'BREAKER TRIPPED' : `${s.gridKW.toFixed(1)} kW`}</span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden relative">
                <div className={`h-full ${loadColor} transition-all duration-200`} style={{ width: `${load * 100}%` }} />
                <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: '100%' }} />
              </div>
            </div>
            <div className={`font-mono text-[11px] px-3 py-2 rounded-lg border text-center ${s.peak ? 'border-danger/40 text-danger bg-danger/10' : 'border-accent/30 text-accent bg-accent/5'}`}>
              {s.peak ? 'PEAK TARIFF' : 'OFF-PEAK'}
            </div>
            <Stat label="Cost" value={`₹${Math.round(s.cost)}`} />
          </div>

          {/* Sources */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/[0.07] p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">☀ Solar</div>
              <div className="font-display text-xl text-ivory mt-1">{s.solar.toFixed(1)}<span className="text-sm text-muted"> kW</span></div>
              <div className="h-1 mt-2 rounded bg-white/[0.06] overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${(s.solar / SOLAR_MAX) * 100}%` }} /></div>
            </div>
            <button onClick={cycleBattery} className={`text-left rounded-lg border p-3 transition ${s.batt.mode === 'discharge' ? 'border-accent/50 bg-accent/5' : 'border-white/[0.07] hover:border-white/20'}`}>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted flex justify-between">🔋 Battery <span className="text-accent">{s.batt.mode}</span></div>
              <div className="font-display text-xl text-ivory mt-1">{battPct}<span className="text-sm text-muted">%</span></div>
              <div className="h-1 mt-2 rounded bg-white/[0.06] overflow-hidden"><div className="h-full bg-accent" style={{ width: `${battPct}%` }} /></div>
            </button>
            <div className="rounded-lg border border-white/[0.07] p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">⚡ Grid</div>
              <div className={`font-display text-xl mt-1 ${s.trip > 0 ? 'text-danger' : 'text-ivory'}`}>{s.gridKW.toFixed(1)}<span className="text-sm text-muted"> kW</span></div>
              <div className="font-mono text-[10px] text-muted mt-2">{s.trip > 0 ? `reset in ${Math.ceil(s.trip * TICK_MS / 1000)}s` : 'nominal'}</div>
            </div>
          </div>

          {/* Chargers */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-2">Charging bays · click to power on/off</div>
            <div className="grid grid-cols-3 gap-3">
              {s.chargers.map((c, i) => {
                const urgent = c.car && (c.car.deadline - s.t) < 14;
                const pct = c.car ? Math.round((1 - c.car.need / c.car.total) * 100) : 0;
                return (
                  <button key={i} onClick={() => toggleCharger(i)} disabled={!c.car || s.trip > 0}
                    className={`relative rounded-lg border p-3 min-h-[112px] text-left transition overflow-hidden ${c.car ? (c.on ? 'border-accent bg-accent/[0.06]' : urgent ? 'border-danger/50' : 'border-white/15 hover:border-white/30') : 'border-dashed border-white/10'}`}>
                    {c.car ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">🚗</span>
                          <span className={`font-mono text-[10px] ${urgent ? 'text-danger' : 'text-muted'}`}>{Math.max(0, Math.ceil((c.car.deadline - s.t) * TICK_MS / 1000))}s</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded bg-white/[0.08] overflow-hidden"><div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} /></div>
                        <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-muted">{pct}% charged</span>
                          <span className={c.on ? 'text-accent' : 'text-muted'}>{c.on ? `● ${CHARGER_KW}kW` : '○ off'}</span>
                        </div>
                        {c.on && <div className="absolute bottom-0 left-0 h-0.5 charge-track w-full" />}
                      </>
                    ) : (
                      <div className="h-full grid place-items-center font-mono text-[10px] uppercase tracking-wider text-muted/50">Free bay</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {overloading && (
            <div className="absolute inset-0 grid place-items-center bg-danger/15 backdrop-blur-[1px] pointer-events-none">
              <div className="font-display text-4xl text-danger" style={{ textShadow: '0 0 30px rgba(255,93,93,.6)' }}>⚡ OVERLOAD</div>
            </div>
          )}
        </div>
      )}

      {/* OVER */}
      {status === 'over' && (
        <div className="mt-6 text-center py-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{gradeOf(scoreOf(s))}</div>
          <div className="font-display text-6xl text-ivory mt-3">{scoreOf(s)}<span className="text-2xl text-muted">/100</span></div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
            <Stat label="Cars charged" value={`${s.done}/${TOTAL_CARS}`} />
            <Stat label="Clean energy" value={`${Math.round((s.clean / Math.max(0.001, s.clean + s.gridE)) * 100)}%`} accent />
            <Stat label="Grid cost" value={`₹${Math.round(s.cost)}`} />
            <Stat label="Overloads" value={s.overloads} />
          </div>
          <button onClick={start} className="mt-8 rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Play again</button>
        </div>
      )}
    </div>
  );
}
