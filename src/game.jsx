import React, { useEffect, useRef, useState } from 'react';
import {
  DAY, TICK_MS, FUSE, BATT_CAP, LEVELS, HIGH, OVER_TICKS, TOTAL_CARS, PMAX,
  clockOf, newSeed, fresh, step, runDay, naiveControl, agentControl,
  selfSuff, selfCons, scoreOf, gradeOf,
} from './sim.js';

/* ════════════════════════════════════════════════════════════════════════
   GRID MASTER — the interactive console. Simulation lives in sim.js; every
   day is seeded, so at the end the same day is replayed by an AI agent and
   by "dumb charging" for a like-for-like comparison.
   ════════════════════════════════════════════════════════════════════════ */

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
    <svg viewBox="0 -18 280 316" className="w-full h-auto">
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

/* ── Spot price: history solid, day-ahead forecast faint ─────────────────── */
function PriceChart({ curve, idx, price }) {
  const W = 280, H = 84;
  const x = (i) => (i / (DAY - 1)) * W;
  const y = (p) => H - (Math.min(p, PMAX) / PMAX) * H;
  const pt = (p, i) => `${x(i).toFixed(1)},${y(p).toFixed(1)}`;
  const all = curve.map(pt).join(' ');
  const past = curve.slice(0, Math.max(1, idx + 1)).map(pt).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect x="0" y="0" width={W} height={y(HIGH)} fill="rgba(255,93,93,.07)" />
      <line x1="0" y1={y(HIGH)} x2={W} y2={y(HIGH)} stroke="rgba(255,93,93,.4)" strokeWidth="1" strokeDasharray="3 4" />
      <text x="3" y={y(HIGH) - 3} fontSize="8" fill="#ff5d5d" fontFamily="JetBrains Mono">high ₹{HIGH}</text>
      <polyline points={all} fill="none" stroke="rgba(245,185,66,.28)" strokeWidth="1.5" strokeDasharray="1 3" strokeLinejoin="round" />
      {idx >= 0 && <polyline points={past} fill="none" stroke="#f5b942" strokeWidth="2" strokeLinejoin="round" />}
      {idx >= 0 && <circle cx={x(idx)} cy={y(curve[idx])} r="3" fill={price >= HIGH ? '#ff5d5d' : '#f5b942'} />}
      <text x={W - 3} y="9" fontSize="8" textAnchor="end" fill="#AEBFBB" fontFamily="JetBrains Mono">forecast ┄</text>
    </svg>
  );
}

const Stat = ({ label, value, tone }) => (
  <div className="text-center">
    <div className={`font-display text-xl ${tone === 'a' ? 'text-accent' : tone === 'd' ? 'text-danger' : 'text-ivory'}`}>{value}</div>
    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted mt-1">{label}</div>
  </div>
);

const practiceHint = (s, danger) =>
  danger ? '⚠ Import is over the fuse. Throttle a charger or force the battery to discharge.'
  : s.price >= HIGH && s.batt.kwh > 1 ? 'Price spike: the battery (auto) covers the load now, grid power is expensive.'
  : s.chargers.some((c) => c.car && c.car.need > 0 && c.lvl === 0) ? 'A car is waiting: tap its bay to raise charging power.'
  : s.solar - s.load > 0.5 && s.batt.kwh < BATT_CAP - 0.5 ? 'Solar surplus: the auto battery is banking it for the evening peak.'
  : 'The faint dashed line is the day-ahead price forecast. Fill the battery before the 18:00 peak.';

export function EnergyGame() {
  const [status, setStatus] = useState('intro'); // intro | playing | paused | done
  const [end, setEnd] = useState(null);
  const [copied, setCopied] = useState(false);
  const g = useRef(fresh(1));
  const seed = useRef(newSeed());
  const practice = useRef(false);
  const autoPaused = useRef(false);
  const statusRef = useRef(status);
  const cardRef = useRef(null);
  const [, setFrame] = useState(0);
  const render = () => setFrame((f) => f + 1);
  useEffect(() => { statusRef.current = status; }, [status]);

  const finish = (lost) => {
    const gg = g.current;
    const nv = runDay(gg.seed, naiveControl);
    const ag = runDay(gg.seed, agentControl);
    const nvCost = Math.max(1, nv.cost);
    const score = scoreOf(gg, nvCost);
    const agScore = scoreOf(ag, nvCost);
    let best = 0, newBest = false;
    try { best = +localStorage.getItem('gridmaster_best') || 0; } catch { /* private mode */ }
    if (!lost && !practice.current && score > best) {
      newBest = true; best = score;
      try { localStorage.setItem('gridmaster_best', String(score)); } catch { /* private mode */ }
    }
    setEnd({
      lost, practice: practice.current, score, grade: gradeOf(score), agScore,
      agDone: ag.done, agCost: Math.round(ag.cost), nvCost: Math.round(nv.cost), nvTrips: nv.trips,
      saved: Math.round(nv.cost - gg.cost), tripAt: clockOf(gg.t), best, newBest,
    });
    setCopied(false);
    setStatus('done');
  };

  // game clock (practice runs at half speed)
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      step(g.current);
      const gg = g.current;
      if (gg.over >= OVER_TICKS) {
        if (practice.current) { gg.trips++; gg.over = 0; }
        else { clearInterval(id); finish(true); return; }
      }
      if (gg.t >= DAY) { clearInterval(id); finish(false); return; }
      render();
    }, practice.current ? TICK_MS * 2 : TICK_MS);
    return () => clearInterval(id);
  }, [status]);

  const start = (asPractice, sameDay = false) => {
    if (!sameDay) seed.current = newSeed();
    g.current = fresh(seed.current);
    practice.current = asPractice;
    autoPaused.current = false;
    setStatus('playing');
  };
  const pause = (auto = false) => {
    if (statusRef.current !== 'playing') return;
    autoPaused.current = auto;
    setStatus('paused');
  };
  const resume = () => { autoPaused.current = false; setStatus('playing'); };

  // auto-pause when the tab is hidden or the game scrolls out of view;
  // auto-resume only if WE paused it (never override a manual pause)
  useEffect(() => {
    const onVis = () => { if (document.hidden) pause(true); };
    document.addEventListener('visibilitychange', onVis);
    const el = cardRef.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) pause(true);
      else if (statusRef.current === 'paused' && autoPaused.current) resume();
    }, { threshold: 0.2 });
    if (el) io.observe(el);
    return () => { document.removeEventListener('visibilitychange', onVis); io.disconnect(); };
  }, []);

  const cycleCharger = (i) => {
    const c = g.current.chargers[i];
    if (statusRef.current === 'playing' && c.car) { c.lvl = (c.lvl + 1) % LEVELS.length; render(); }
  };
  const cycleBatt = () => {
    if (statusRef.current !== 'playing') return;
    const m = g.current.batt.mode;
    g.current.batt.mode = m === 'auto' ? 'charge' : m === 'charge' ? 'discharge' : 'auto';
    render();
  };

  // keyboard: 1/2/3 bays · B battery · Space pause
  useEffect(() => {
    if (status !== 'playing' && status !== 'paused') return;
    const h = (e) => {
      if (e.key >= '1' && e.key <= '3') cycleCharger(+e.key - 1);
      else if (e.key === 'b' || e.key === 'B') cycleBatt();
      else if (e.key === ' ') { e.preventDefault(); statusRef.current === 'playing' ? pause(false) : resume(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [status]);

  const s = g.current;
  const live = status === 'playing' || status === 'paused';
  const imp = Math.max(0, s.gridDraw);
  const load = Math.min(1, imp / FUSE);
  const danger = imp > FUSE;
  const fuseColor = danger ? 'bg-danger' : load > 0.8 ? 'bg-amber-400' : 'bg-accent';
  const battPct = Math.round((s.batt.kwh / BATT_CAP) * 100);
  const secsOver = danger ? Math.max(0, Math.ceil((OVER_TICKS - s.over) * TICK_MS / 1000)) : 0;

  const shareText = end
    ? `⚡ Grid Master: I ran a solar + battery + EV charging site and scored ${end.score}/100 (${end.grade}). The AI agent scored ${end.agScore} on the same day. Think you can beat it?`
    : '';
  const copyScore = async () => {
    try { await navigator.clipboard.writeText(`${shareText} ${window.location.href.split('#')[0]}#play`); setCopied(true); } catch { /* denied */ }
  };

  return (
    <div ref={cardRef} className="surface p-6 sm:p-8 relative">
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-2xl">Grid Master</h3>
          <p className="text-sm text-muted mt-1">Balance solar, battery, grid &amp; building. Keep import under the fuse.</p>
        </div>
        {live && (
          <div className="flex items-center gap-5">
            <Stat label="Time" value={clockOf(s.t)} />
            <Stat label="Self-suff." value={`${selfSuff(s)}%`} tone="a" />
            <Stat label="Cost" value={`₹${Math.round(s.cost)}`} />
            <Stat label="Cars" value={`${s.done}/${TOTAL_CARS}`} />
            <button onClick={() => (status === 'playing' ? pause(false) : resume())}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted border border-white/15 rounded-full px-3 py-1.5 hover:text-ivory hover:border-white/30 transition">
              {status === 'playing' ? '❚❚ Pause' : '▶ Resume'}
            </button>
          </div>
        )}
      </div>

      {/* intro */}
      {status === 'intro' && (
        <div className="mt-8 text-center py-6">
          <p className="text-muted max-w-lg mx-auto leading-relaxed">
            One day, 06:00 → 21:00. Your site runs on <span className="text-accent">solar</span>, a <span className="text-accent">battery</span> and the <span className="text-ivory">grid</span>. EVs arrive with deadlines; the sun sets before the <span className="text-amber-400">evening price peak</span>. Charge every car and never let grid import sit over the <span className="text-danger">{FUSE} kW fuse for 3 seconds</span>.
          </p>
          <p className="text-muted/70 max-w-lg mx-auto mt-3 text-sm leading-relaxed">
            At the end, an <span className="text-accent">AI agent</span>, the kind I build at RiDERgy, replays your exact day. Beat its score.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => start(false)} className="rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Start the day</button>
            <button onClick={() => start(true)} className="rounded-full border border-white/20 text-muted font-semibold px-7 py-3 hover:text-ivory hover:border-white/40 transition">Practice first · half speed, can't lose</button>
          </div>
          <p className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.16em] text-muted/50 mt-6">Keys: 1 2 3 bays · B battery · Space pause</p>
        </div>
      )}

      {/* live console */}
      {live && (
        <>
          {practice.current && (
            <div className="mt-4 rounded-lg border border-accent/30 bg-accent/[0.05] px-4 py-2.5 font-mono text-[11px] text-accent">
              PRACTICE · {practiceHint(s, danger)}
            </div>
          )}

          {/* fuse — sticky on mobile so it's visible while you work the bays */}
          <div className={`mt-4 sticky lg:static top-[88px] z-30 rounded-xl border p-4 bg-panel ${danger ? 'border-danger/60 bg-danger/10' : 'border-white/[0.07]'}`}>
            <div className="flex justify-between font-mono text-[11px] mb-1.5">
              <span className="text-muted uppercase tracking-wider">Grid import · fuse {FUSE}kW</span>
              <span className={danger ? 'text-danger font-bold' : 'text-ivory'}>{danger ? `BREACH! blackout in ${secsOver}s` : `${imp.toFixed(1)} kW`}</span>
            </div>
            <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden relative">
              <div className={`h-full ${fuseColor} transition-all duration-200`} style={{ width: `${load * 100}%` }} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {/* bays first on mobile — they're the controls */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-2">
                <span>Charging bays · tap to throttle (off → 3.5 → 7 → 11 kW)</span>
                <span>🏠 Building {s.building.toFixed(1)}kW</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {s.chargers.map((c, i) => {
                  const urgent = c.car && (Math.min(c.car.deadline, DAY) - s.t) < 16;
                  const pct = c.car ? Math.round((1 - c.car.need / c.car.total) * 100) : 0;
                  return (
                    <button key={i} onClick={() => cycleCharger(i)} disabled={!c.car}
                      aria-label={c.car ? `Bay ${i + 1}: ${pct}% charged, ${LEVELS[c.lvl]} kilowatts` : `Bay ${i + 1}: free`}
                      className={`relative rounded-lg border p-3 min-h-[108px] text-left transition overflow-hidden ${c.car ? (c.lvl > 0 ? 'border-accent bg-accent/[0.06]' : urgent ? 'border-danger/50' : 'border-white/15 hover:border-white/30') : 'border-dashed border-white/10'}`}>
                      {c.car ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">🚗<span className="hidden sm:inline font-mono text-[9px] text-muted/40 align-top ml-1">{i + 1}</span></span>
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

            {/* battery + price */}
            <div className="space-y-4">
              <button onClick={cycleBatt} className={`w-full rounded-xl border p-4 text-left transition ${s.bDischarge > 0.05 ? 'border-accent/50 bg-accent/5' : 'border-white/[0.07] hover:border-white/20'}`}>
                <div className="flex justify-between font-mono text-[11px] text-muted uppercase tracking-wider">
                  <span>🔋 Battery · {s.batt.mode}</span>
                  <span className="text-accent">{s.bDischarge > 0.05 ? `out ${s.bDischarge.toFixed(1)}kW` : s.bCharge > 0.05 ? `in ${s.bCharge.toFixed(1)}kW` : 'idle'}</span>
                </div>
                <div className="mt-2 h-2 rounded bg-white/[0.06] overflow-hidden"><div className="h-full bg-accent" style={{ width: `${battPct}%` }} /></div>
                <div className="font-mono text-[10px] text-muted mt-1.5">{battPct}% · tap to cycle auto / charge / discharge</div>
              </button>
              <div className="rounded-xl border border-white/[0.07] p-4">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-muted uppercase tracking-wider">Spot price + forecast</span>
                  <span className={s.price >= HIGH ? 'text-danger' : 'text-amber-400'}>₹{s.price.toFixed(1)}/kWh</span>
                </div>
                <PriceChart curve={s.priceCurve} idx={s.t - 1} price={s.price} />
              </div>
            </div>

            {/* flow diagram */}
            <div className="rounded-xl border border-white/[0.07] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mb-1">Energy flow · live</div>
              <Flow g={s} />
            </div>
          </div>

          {status === 'paused' && (
            <div className="absolute inset-0 z-40 rounded-xl bg-ink/70 backdrop-blur-[2px] grid place-items-center">
              <button onClick={resume} className="rounded-full bg-accent text-ink font-semibold px-8 py-3.5 hover:brightness-110 transition">▶ Resume · {clockOf(s.t)}</button>
            </div>
          )}
        </>
      )}

      {/* end of day */}
      {status === 'done' && end && (
        <div className="mt-6 text-center py-6">
          {end.lost ? (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-danger">Blackout</div>
              <div className="font-display text-4xl text-danger mt-3">⚡ Breaker tripped at {end.tripAt}</div>
              <p className="text-muted mt-3 max-w-sm mx-auto">Sustained import over {FUSE} kW took the whole site down. Throttle chargers sooner and keep battery in reserve for the evening peak.</p>
            </>
          ) : end.practice ? (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Practice complete</div>
              <div className="font-display text-4xl text-ivory mt-3">Ready for the real thing?</div>
              <p className="text-muted mt-3 max-w-sm mx-auto">Same physics, full speed, and the fuse is live: 3 seconds over and the site goes dark.</p>
            </>
          ) : (
            <>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{end.grade}{end.newBest && ' · new personal best'}</div>
              <div className="font-display text-6xl text-ivory mt-3">{end.score}<span className="text-2xl text-muted">/100</span></div>
              {end.best > 0 && !end.newBest && <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted mt-2">personal best {end.best}</div>}
            </>
          )}

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto">
            <Stat label="Cars charged" value={`${s.done}/${TOTAL_CARS}`} />
            <Stat label="Missed" value={s.missed} tone={s.missed ? 'd' : undefined} />
            <Stat label="Self-sufficiency" value={`${selfSuff(s)}%`} tone="a" />
            <Stat label="Self-consumption" value={`${selfCons(s)}%`} tone="a" />
            <Stat label="Net cost" value={`₹${Math.round(s.cost)}`} />
          </div>

          {/* same day, three operators */}
          <div className="mt-8 max-w-2xl mx-auto rounded-xl border border-white/[0.07] overflow-hidden text-left">
            <div className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted border-b border-white/[0.07]">Same day · three operators</div>
            {[
              { name: end.lost ? 'You (blackout)' : 'You', score: end.lost ? '·' : end.score, cars: `${s.done}/${TOTAL_CARS}`, cost: `₹${Math.round(s.cost)}`, me: true },
              { name: 'The agent', note: 'the kind I build at RiDERgy', score: end.agScore, cars: `${end.agDone}/${TOTAL_CARS}`, cost: `₹${end.agCost}` },
              { name: 'Dumb charging', note: end.nvTrips > 0 ? `${end.nvTrips}× blackout` : 'no management', score: '·', cars: '', cost: `₹${end.nvCost}`, dumb: true },
            ].map((r) => (
              <div key={r.name} className={`px-5 py-3.5 flex items-center justify-between gap-3 border-b border-white/[0.05] last:border-0 ${r.me ? 'bg-accent/[0.04]' : ''}`}>
                <div>
                  <span className={`text-[15px] ${r.me ? 'text-ivory font-semibold' : r.dumb ? 'text-muted' : 'text-accent'}`}>{r.name}</span>
                  {r.note && <span className="font-mono text-[10px] text-muted/70 ml-2">{r.note}</span>}
                </div>
                <div className="flex items-center gap-5 font-mono text-[12px]">
                  {r.cars && <span className="text-muted">{r.cars} cars</span>}
                  <span className="text-muted">{r.cost}</span>
                  <span className={`w-14 text-right ${r.me ? 'text-ivory' : r.dumb ? 'text-muted/60' : 'text-accent'}`}>{r.score === '·' ? '·' : `${r.score}/100`}</span>
                </div>
              </div>
            ))}
            {!end.practice && !end.lost && end.saved > 0 && (
              <div className="px-5 py-3 font-mono text-[11px] text-accent/90 border-t border-white/[0.07] bg-accent/[0.03]">
                Smart operation saved ₹{end.saved} vs dumb charging{end.nvTrips > 0 && `, and avoided ${end.nvTrips} blackout${end.nvTrips > 1 ? 's' : ''}`}. That, at fleet scale, is my day job.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {end.practice ? (
              <button onClick={() => start(false)} className="rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Start the real day</button>
            ) : (
              <>
                <button onClick={() => start(false, true)} className="rounded-full bg-accent text-ink font-semibold px-7 py-3 hover:brightness-110 active:scale-[.98] transition">Replay this day</button>
                <button onClick={() => start(false)} className="rounded-full border border-white/20 text-muted font-semibold px-6 py-3 hover:text-ivory hover:border-white/40 transition">New day</button>
                {!end.lost && (
                  <button onClick={copyScore} className="rounded-full border border-accent/40 text-accent font-semibold px-6 py-3 hover:border-accent transition">
                    {copied ? '✓ Copied' : 'Share score'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
