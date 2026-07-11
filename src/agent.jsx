import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MISSIONS } from './missions.js';
import { useLang } from './i18n.jsx';
import { locDemo } from './demo-i18n.js';

/* ════════════════════════════════════════════════════════════════════════
   AGENT CONSOLE: pick a mission from any industry and watch an agent
   plan it, work its tools, and adapt when the visitor throws a curveball.
   Deterministic replay of a real agent loop; runs entirely in the browser.
   ════════════════════════════════════════════════════════════════════════ */

/* ── Mini artifacts the agent produces ───────────────────────────────────── */

function Spark({ d, label, marker, markerLabel, color = '#2FE3BE' }) {
  const W = 240, H = 54, P = 4;
  const min = Math.min(...d), max = Math.max(...d), span = max - min || 1;
  const x = (i) => P + (i / (d.length - 1)) * (W - 2 * P);
  const y = (v) => H - P - ((v - min) / span) * (H - 2 * P);
  const pts = d.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const li = d.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} className="w-full max-w-[260px] h-auto" role="img" aria-label={label}>
      {marker != null && (
        <>
          <line x1={x(marker)} y1={P} x2={x(marker)} y2={H - P} stroke="rgba(245,185,66,.5)" strokeWidth="1" strokeDasharray="2 3" />
          {markerLabel && <text x={x(marker)} y={H + 11} textAnchor="middle" fontSize="8.5" fill="#f5b942" fontFamily="JetBrains Mono">{markerLabel}</text>}
        </>
      )}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(li)} cy={y(d[li])} r="3" fill={color} />
      <text x={Math.min(x(li), W - 4)} y={Math.max(9, y(d[li]) - 7)} textAnchor="end" fontSize="9" fill="#EAF0EE" fontFamily="JetBrains Mono">{label}</text>
    </svg>
  );
}

function Bars({ rows }) {
  const max = Math.max(...rows.map((r) => Math.abs(r.v)));
  return (
    <div className="space-y-1.5 max-w-[300px]">
      {rows.map((r) => (
        <div key={r.l} className="flex items-center gap-2 font-mono text-[10px]">
          <span className="w-16 shrink-0 text-muted truncate">{r.l}</span>
          <span className="flex-1 h-2 rounded-sm bg-white/[0.05] overflow-hidden">
            <span className={`block h-full rounded-sm ${r.hot ? 'bg-danger' : 'bg-accent'}`} style={{ width: `${(Math.abs(r.v) / max) * 100}%` }} />
          </span>
          <span className={`w-20 shrink-0 text-right ${r.hot ? 'text-danger' : 'text-ivory'}`}>{r.txt}</span>
        </div>
      ))}
    </div>
  );
}

function KV({ rows }) {
  return (
    <div className="max-w-[320px] font-mono text-[10.5px] divide-y divide-white/[0.05]">
      {rows.map(([k, v, hot]) => (
        <div key={k} className="flex justify-between gap-4 py-1">
          <span className="text-muted">{k}</span>
          <span className={hot ? 'text-amber-400' : 'text-ivory'}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function Diff({ lines }) {
  return (
    <div className="max-w-[320px] font-mono text-[10.5px] rounded border border-white/[0.06] overflow-hidden">
      {lines.map((l, i) => (
        <div key={i} className={`px-2.5 py-0.5 ${l[0] === '-' ? 'bg-danger/[0.08] text-danger/90' : l[0] === '+' ? 'bg-accent/[0.08] text-accent' : 'text-muted'}`}>
          {l}
        </div>
      ))}
    </div>
  );
}

function Msg({ title, body }) {
  return (
    <div className="max-w-[380px] rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">{title}</div>
      <p className="mt-2 text-[13px] text-ivory/90 leading-relaxed font-display italic">{body}</p>
    </div>
  );
}

const ART = { spark: Spark, bars: Bars, kv: KV, diff: Diff, msg: Msg };

/* ── Feed rows ───────────────────────────────────────────────────────────── */

export function ToolRow({ item }) {
  return (
    <div className="font-mono text-[11px] leading-relaxed">
      <div className="text-ivory/90">
        <span className="text-accent">▸</span> {item.call}
        {item.st === 'run' && <span className="ml-2 inline-block w-1.5 h-3 bg-accent/80 align-middle" style={{ animation: 'pulse2 .9s infinite' }} />}
      </div>
      {item.st === 'done' && <div className="text-muted mt-0.5 pl-4">✓ {item.result}</div>}
    </div>
  );
}

export function FeedItem({ item }) {
  if (item.k === 'tool') return <ToolRow item={item} />;
  if (item.k === 'think')
    return <p className="text-[13px] text-muted italic leading-relaxed border-l border-gold/30 pl-3">{item.text}<span className="text-gold/60">{item.text.length < item.full.length ? '▎' : ''}</span></p>;
  if (item.k === 'alert')
    return (
      <div className="rounded-lg border border-danger/40 bg-danger/[0.06] px-3.5 py-2.5">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-danger">⚡ {item.title}</div>
        <p className="mt-1 text-[12px] text-ivory/85">{item.text}</p>
      </div>
    );
  if (item.k === 'art') {
    const A = ART[item.art.kind];
    return <div className="pl-4">{A ? <A {...item.art} /> : null}</div>;
  }
  return null;
}

/* ── Plan sidebar ────────────────────────────────────────────────────────── */

function PlanList({ plan, addedLabel }) {
  return (
    <ol className="space-y-2.5">
      {plan.map((p) => (
        <li key={p.id} className="flex items-start gap-2.5 text-[13px] leading-snug">
          <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
            p.st === 'done' ? 'bg-accent' : p.st === 'active' ? 'bg-accent ring-4 ring-accent/20' : p.added ? 'bg-gold/70' : 'bg-white/15'
          }`} style={p.st === 'active' ? { animation: 'pulse2 1.2s infinite' } : undefined} />
          <span className={p.st === 'done' ? 'text-muted/60' : p.st === 'active' ? 'text-ivory' : 'text-muted'}>
            {p.t}
            {p.added && <span className="ml-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-gold border border-gold/30 rounded px-1 py-px align-middle">{addedLabel}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ── The console ─────────────────────────────────────────────────────────── */

export function AgentConsole() {
  const { s: STR, lang } = useLang();
  const O = STR.ops;
  const missions = useMemo(() => MISSIONS.map((m) => locDemo(m, lang)), [lang]);
  const [, setFrame] = useState(0);
  const render = () => setFrame((f) => f + 1);
  const S = useRef({ phase: 'pick', scen: null, plan: [], feed: [], queue: [], curve: 'none', t0: 0 }).current;
  const timer = useRef(null);
  const typing = useRef(null);
  const feedRef = useRef(null);
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stop = () => { clearTimeout(timer.current); clearInterval(typing.current); };
  useEffect(() => stop, []);
  useEffect(() => { const el = feedRef.current; if (el) el.scrollTop = el.scrollHeight; });

  const wait = (fn, ms) => { timer.current = setTimeout(fn, reduced ? Math.min(ms, 80) : ms); };

  const finish = () => {
    S.plan.forEach((p) => { if (p.st !== 'pending') p.st = 'done'; });
    S.phase = 'done';
    render();
  };

  const applyCurve = () => {
    const cb = S.scen.curveball;
    const at = S.plan.findIndex((p) => p.st === 'active');
    S.plan.splice(at < 0 ? S.plan.length : at + 1, 0, ...cb.steps.map((t, j) => ({ id: `c${j}`, t, st: 'pending', added: true })));
    S.queue.unshift(...cb.events);
    S.curve = 'used';
  };

  /* Pacing: deliberately unhurried so the agent's reasoning can be read,
     with a skip control for visitors who want the outcome now. */
  const advance = () => {
    if (S.curve === 'thrown') applyCurve();
    const e = S.queue.shift();
    if (!e || e.t === 'done') { finish(); return; }

    if (e.t === 'think') {
      const item = { k: 'think', full: e.text, text: reduced ? e.text : '' };
      S.feed.push(item); render();
      if (reduced) { wait(advance, 200); return; }
      const t0 = Date.now(); // time-based so browser timer throttling can't stall it
      typing.current = setInterval(() => {
        item.text = item.full.slice(0, Math.floor(((Date.now() - t0) / 1000) * 60));
        render();
        if (item.text.length >= item.full.length) { clearInterval(typing.current); wait(advance, 1100); }
      }, 24);
    } else if (e.t === 'step') {
      S.plan.forEach((p) => { if (p.st === 'active') p.st = 'done'; });
      const p = S.plan.find((p) => p.id === e.id);
      if (p) p.st = 'active';
      render();
      wait(advance, 500);
    } else if (e.t === 'tool') {
      const item = { k: 'tool', call: e.call, st: 'run', _res: e.result, _art: e.art };
      S.feed.push(item); render();
      wait(() => {
        item.st = 'done'; item.result = e.result;
        if (e.art) S.feed.push({ k: 'art', art: e.art });
        render();
        wait(advance, e.art ? 2000 : 1200);
      }, e.ms || 1100);
    } else if (e.t === 'alert') {
      S.feed.push({ k: 'alert', title: e.title, text: e.text });
      render();
      wait(advance, 2200);
    } else {
      wait(advance, 100);
    }
  };

  const skip = () => {
    stop();
    if (S.curve === 'thrown') applyCurve();
    S.feed.forEach((item) => {
      if (item.k === 'think') item.text = item.full;
      if (item.k === 'tool' && item.st === 'run') {
        item.st = 'done'; item.result = item._res;
        if (item._art) S.feed.push({ k: 'art', art: item._art });
      }
    });
    for (const e of S.queue) {
      if (e.t === 'done') break;
      if (e.t === 'think') S.feed.push({ k: 'think', full: e.text, text: e.text });
      else if (e.t === 'tool') {
        S.feed.push({ k: 'tool', call: e.call, st: 'done', result: e.result });
        if (e.art) S.feed.push({ k: 'art', art: e.art });
      } else if (e.t === 'alert') S.feed.push({ k: 'alert', title: e.title, text: e.text });
    }
    S.queue = [];
    S.plan.forEach((p) => { p.st = 'done'; });
    finish();
  };

  const start = (scen) => {
    stop();
    S.phase = 'run'; S.scen = scen;
    S.plan = scen.plan.map((t, i) => ({ id: i, t, st: 'pending' }));
    S.feed = []; S.queue = [...scen.events];
    S.curve = scen.curveball ? 'ready' : 'none';
    S.t0 = Date.now();
    render();
    wait(advance, 500);
  };

  const throwCurve = () => { if (S.curve === 'ready') { S.curve = 'thrown'; render(); } };

  /* ── pick screen ── */
  if (S.phase === 'pick') {
    return (
      <div className="surface p-6 sm:p-10">
        <div className="max-w-xl">
          <h3 className="text-2xl">{O.title}</h3>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            {O.p1}<span className="text-ivory">{O.loop}</span>{O.p2}
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {missions.map((m) => (
            <button key={m.id} onClick={() => start(m)}
              className={`group text-left rounded-xl border p-6 transition-all duration-300 ${
                m.featured
                  ? 'sm:col-span-2 border-accent/40 bg-accent/[0.04] hover:border-accent/70'
                  : 'border-white/[0.08] hover:border-accent/40 hover:bg-accent/[0.03]'}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl">{m.icon}</span>
                {m.badge && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent border border-accent/40 rounded-full px-2.5 py-1">{m.badge}</span>
                )}
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70">{m.domain}</span>
              </div>
              <p className={`mt-4 font-display italic text-ivory/90 leading-snug ${m.featured ? 'text-[19px]' : 'text-[17px]'}`}>“{m.goal}”</p>
              {m.story && <p className="mt-3 text-[12.5px] text-muted leading-relaxed">{m.story}</p>}
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-accent opacity-60 group-hover:opacity-100 transition">{O.run}</div>
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          <p className="font-mono text-[10px] text-muted/50 leading-relaxed">
            {O.foot}
          </p>
          <p className="font-mono text-[10px] text-muted/70 leading-relaxed">
            {O.stackLine}
          </p>
          <div className="flex flex-wrap gap-2">
            {['Claude', 'GPT', 'Gemini', 'LangGraph', 'OpenClaw', 'MCP', 'n8n', 'Zapier', 'Make', 'Composio'].map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        </div>
      </div>
    );
  }

  const scen = S.scen;
  const done = S.phase === 'done';
  const elapsed = Math.max(1, Math.round((Date.now() - S.t0) / 1000));

  return (
    <div className="surface p-6 sm:p-8">
      {/* header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70">{scen.icon} {scen.domain}</div>
          <h3 className="text-xl mt-1.5 font-display italic font-normal text-ivory/90">“{scen.goal}”</h3>
        </div>
        {!done && (
          <div className="flex items-center gap-3 flex-wrap">
            {S.curve !== 'none' && (
              <button onClick={throwCurve} disabled={S.curve !== 'ready'}
                className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] rounded-full px-4 py-2 border transition ${
                  S.curve === 'ready' ? 'border-gold/50 text-gold hover:bg-gold/10' : 'border-white/10 text-muted/60'
                }`}>
                {S.curve === 'ready' ? `⚡ ${O.curveball}: ${scen.curveball.label}` : S.curve === 'thrown' ? O.incoming : O.adapted}
              </button>
            )}
            <button onClick={skip} className="font-mono text-[10px] text-muted/60 hover:text-ivory transition">{O.skip}</button>
          </div>
        )}
      </div>

      <div className="mt-6 grid lg:grid-cols-[240px_1fr] gap-6">
        {/* plan */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mb-3">{O.plan}</div>
          <PlanList plan={S.plan} addedLabel={O.addedLive} />
        </div>

        {/* feed */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mb-3">{O.liveRun}</div>
          <div ref={feedRef} className="rounded-xl border border-white/[0.07] bg-ink/60 p-4 sm:p-5 h-[360px] overflow-y-auto space-y-3.5">
            {S.feed.map((item, i) => <FeedItem key={i} item={item} />)}
            {done && (
              <div className="rounded-xl border border-accent/30 bg-accent/[0.04] p-5 mt-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">{O.complete} · {elapsed}s{S.curve === 'used' && ` · ${O.curveHandled}`}</div>
                <div className="font-display text-2xl text-ivory mt-2.5">{scen.outcome.headline}</div>
                <p className="text-[13px] text-muted mt-2 leading-relaxed">{scen.outcome.detail}</p>
                <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
                  {scen.outcome.stats.map(([v, l]) => (
                    <div key={l}>
                      <span className="font-display text-lg text-accent">{v}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted ml-2">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* actions */}
      {done && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={() => start(scen)} className="rounded-full bg-accent text-ink font-semibold text-sm px-6 py-2.5 hover:brightness-110 active:scale-[.98] transition">
            {S.curve === 'used' ? O.replay : O.replayTry}
          </button>
          {missions.filter((m) => m.id !== scen.id).map((m) => (
            <button key={m.id} onClick={() => start(m)}
              className="rounded-full border border-white/15 text-muted font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 hover:text-ivory hover:border-white/35 transition">
              {m.icon} {m.short}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
