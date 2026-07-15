import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CALLS } from './calls.js';
import { FeedItem } from './agent.jsx';
import { useLang } from './i18n.jsx';
import { locDemo, TTS_LANG } from './demo-i18n.js';

/* ════════════════════════════════════════════════════════════════════════
   VOICE AGENT: a simulated live phone call. The agent's lines are spoken
   aloud with the browser's own TTS (nothing recorded, nothing leaves the
   page); the caller appears as a live STT-style transcript. One button
   lets the visitor barge in mid-sentence and watch the agent recover.
   Deterministic replay; timing is elapsed-time based (throttle-proof).
   ════════════════════════════════════════════════════════════════════════ */

/* Production stacks named on the page: the demo voice is the browser's
   free built-in TTS, and the note below the demo says exactly that. */
const VOICE_STACK = ['ElevenLabs', 'Cartesia', 'OpenAI Realtime', 'Deepgram', 'Whisper', 'AssemblyAI', 'Vapi', 'Retell AI', 'Bland', 'LiveKit', 'Pipecat', 'Twilio', 'Plivo', 'Exotel'];

const synthOK = typeof window !== 'undefined' && 'speechSynthesis' in window;

const VOICE_PREFS = {
  EN: [/Google US English/i, /Samantha/i, /Google UK English Female/i, /en[-_]IN/i, /^en/i],
  DE: [/Google Deutsch/i, /de[-_]DE/i, /^de/i],
  ES: [/Google español/i, /es[-_]ES/i, /es[-_]MX/i, /^es/i],
  FR: [/Google français/i, /fr[-_]FR/i, /fr[-_]CA/i, /^fr/i],
};

function pickVoice(lang) {
  const vs = window.speechSynthesis.getVoices();
  if (!vs.length) return null;
  for (const p of VOICE_PREFS[lang] || VOICE_PREFS.EN) {
    const v = vs.find((v) => p.test(v.name) || p.test(v.lang));
    if (v) return v;
  }
  return vs[0];
}

/* ── Waveform: who is talking, drawn as sound ────────────────────────────── */
const WAVE = {
  agent: { color: '#2FE3BE', amp: 1 },
  caller: { color: '#CBB489', amp: 0.85 },
  think: { color: 'rgba(47,227,190,.45)', amp: 0.2 },
  tool: { color: 'rgba(47,227,190,.45)', amp: 0.3 },
  idle: { color: 'rgba(234,240,238,.22)', amp: 0.07 },
  done: { color: 'rgba(234,240,238,.22)', amp: 0.07 },
};

function Waveform({ modeRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    let raf, t = 0;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== w * dpr || c.height !== h * dpr) { c.width = w * dpr; c.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const m = WAVE[modeRef.current] || WAVE.idle;
      const n = Math.max(28, Math.floor(w / 9));
      ctx.fillStyle = m.color;
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * (w / n);
        const v = (Math.sin(i * 0.9 + t * 0.22) + Math.sin(i * 2.3 - t * 0.14) + Math.sin(i * 0.37 + t * 0.08)) / 3;
        const bh = Math.max(2, Math.abs(v) * m.amp * (h - 8) + 2);
        ctx.fillRect(x - 1.25, (h - bh) / 2, 2.5, bh);
      }
      t += 1;
      if (!still) raf = requestAnimationFrame(draw);
    };
    draw();
    if (still) { const iv = setInterval(draw, 600); return () => clearInterval(iv); }
    return () => cancelAnimationFrame(raf);
  }, [modeRef]);
  return <canvas ref={ref} className="w-full h-11" aria-hidden />;
}

/* ── Transcript rows ─────────────────────────────────────────────────────── */
function Turn({ item }) {
  const { s } = useLang();
  if (item.k === 'tool' || item.k === 'think' || item.k === 'art') return <FeedItem item={item} />;
  const agent = item.k === 'agent';
  return (
    <div className="flex gap-3">
      <span className={`shrink-0 w-12 pt-[3px] font-mono text-[9px] uppercase tracking-[0.18em] ${agent ? 'text-accent' : 'text-gold'}`}>
        {agent ? s.va.roleAgent : s.va.roleCaller}
      </span>
      <p className={`text-[13.5px] leading-relaxed ${agent ? 'text-ivory/95' : 'text-muted'}`}>
        {item.text}
        {item.live && <span className={`ml-0.5 inline-block w-1.5 h-3.5 align-middle ${agent ? 'bg-accent/80' : 'bg-gold/70'}`} style={{ animation: 'pulse2 .9s infinite' }} />}
        {item.cut && <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.14em] text-gold border border-gold/30 rounded px-1 py-px align-middle">{s.va.cutTag}</span>}
      </p>
    </div>
  );
}

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/* ── The call ────────────────────────────────────────────────────────────── */
export function VoiceAgent({ onOps }) {
  const { s: STR, lang } = useLang();
  const V = STR.va;
  const calls = useMemo(() => CALLS.map((c) => locDemo(c, lang)), [lang]);
  const [, setFrame] = useState(0);
  const render = () => setFrame((f) => f + 1);
  const S = useRef({
    phase: 'pick', scen: null, feed: [], queue: [], barge: 'none', armed: false,
    gen: 0, t0: 0, clock: 0, sound: true, state: 'idle', outcome: null, tools: 0,
  }).current;
  const modeRef = useRef('idle');
  const timers = useRef([]);
  const tick = useRef(null);
  const clockIv = useRef(null);
  const utterRef = useRef(null);
  const feedEl = useRef(null);
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stopAll = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    clearInterval(tick.current); clearInterval(clockIv.current);
    if (synthOK) window.speechSynthesis.cancel();
  };
  useEffect(() => stopAll, []);
  useEffect(() => { const el = feedEl.current; if (el) el.scrollTop = el.scrollHeight; });

  const setMode = (m) => { S.state = m; modeRef.current = m; };
  const wait = (fn, ms) => { const g = S.gen; timers.current.push(setTimeout(() => { if (S.gen === g) fn(); }, reduced ? Math.min(ms, 80) : ms)); };

  const finish = () => {
    setMode('done');
    S.armed = false;
    clearInterval(clockIv.current);
    S.outcome = (S.barge === 'used' && S.scen.barge?.outcome) || S.scen.outcome;
    S.phase = 'done';
    render();
  };

  /* Reveal a line over `est` ms; agent lines are also spoken when sound is on. */
  const playLine = (item, est, speak) => {
    const g = S.gen;
    const t0 = Date.now();
    let doneFlag = false;
    const complete = () => {
      if (doneFlag || S.gen !== g) return;
      doneFlag = true;
      clearInterval(tick.current);
      item.text = item.full; item.live = false;
      if (item.k === 'agent') S.armed = false;
      render();
      wait(advance, 380);
    };
    let spoke = false;
    if (speak && S.sound && synthOK) {
      const u = new SpeechSynthesisUtterance(item.full);
      u.lang = TTS_LANG[lang] || TTS_LANG.EN;
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.rate = 1.02; u.pitch = 1;
      u.onboundary = (e) => {
        if (S.gen !== g || !item.live) return;
        let end = item.full.indexOf(' ', e.charIndex);
        if (end < 0) end = item.full.length;
        if (end > item.text.length) { item.text = item.full.slice(0, end); render(); }
      };
      u.onend = complete;
      u.onerror = complete;
      utterRef.current = u; // hold a ref so Chrome doesn't GC the utterance mid-speech
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      spoke = true;
    }
    clearInterval(tick.current);
    tick.current = setInterval(() => {
      if (S.gen !== g || !item.live) { clearInterval(tick.current); return; }
      const frac = Math.min(1, (Date.now() - t0) / est);
      const n = Math.floor(frac * item.full.length);
      if (n > item.text.length) { item.text = item.full.slice(0, n); render(); }
      if (frac >= 1 && !spoke) complete();
    }, 40);
    if (spoke) { const cap = setTimeout(() => { if (S.gen === g) complete(); }, est * 2.2); timers.current.push(cap); }
  };

  const advance = () => {
    const e = S.queue.shift();
    if (!e || e.t === 'done') { finish(); return; }

    if (e.t === 'agent' || e.t === 'caller') {
      const item = { k: e.t, full: e.text, text: reduced ? e.text : '', live: !reduced, cut: false };
      S.feed.push(item);
      setMode(e.t);
      S.armed = e.t === 'agent' && !!e.interruptible && S.barge === 'ready';
      render();
      if (reduced) { item.live = false; wait(advance, 200); return; }
      const est = e.t === 'agent' ? 600 + e.text.length * 66 : 450 + e.text.length * 52;
      playLine(item, est, e.t === 'agent');
    } else if (e.t === 'think') {
      const item = { k: 'think', full: e.text, text: reduced ? e.text : '' };
      S.feed.push(item);
      setMode('think');
      render();
      if (reduced) { wait(advance, 200); return; }
      const g = S.gen, t0 = Date.now();
      clearInterval(tick.current);
      tick.current = setInterval(() => {
        if (S.gen !== g) { clearInterval(tick.current); return; }
        item.text = item.full.slice(0, Math.floor(((Date.now() - t0) / 1000) * 120));
        render();
        if (item.text.length >= item.full.length) { clearInterval(tick.current); wait(advance, 420); }
      }, 24);
    } else if (e.t === 'tool') {
      const item = { k: 'tool', call: e.call, st: 'run' };
      S.feed.push(item);
      setMode('tool');
      render();
      wait(() => {
        item.st = 'done'; item.result = e.result; S.tools += 1;
        if (e.art) S.feed.push({ k: 'art', art: e.art });
        render();
        wait(advance, 480);
      }, e.ms || 1000);
    } else {
      wait(advance, 100);
    }
  };

  const start = (scen) => {
    stopAll();
    S.gen += 1;
    S.phase = 'live'; S.scen = scen;
    S.feed = []; S.queue = [...scen.events];
    S.barge = scen.barge ? 'ready' : 'none';
    S.armed = false; S.outcome = null; S.tools = 0;
    S.t0 = Date.now(); S.clock = 0;
    setMode('idle');
    if (synthOK) window.speechSynthesis.getVoices(); // prime async voice list
    clockIv.current = setInterval(() => { S.clock = Math.round((Date.now() - S.t0) / 1000); render(); }, 1000);
    render();
    wait(advance, 700);
  };

  const bargeIn = () => {
    if (!S.armed || S.barge !== 'ready') return;
    S.gen += 1; // invalidate every pending timer / utterance callback
    stopAll();
    clockIv.current = setInterval(() => { S.clock = Math.round((Date.now() - S.t0) / 1000); render(); }, 1000);
    const cur = [...S.feed].reverse().find((i) => i.k === 'agent');
    if (cur) { cur.live = false; cur.cut = true; cur.text = cur.text.replace(/[,.\s]+$/, '') + '…'; }
    S.barge = 'used'; S.armed = false;
    S.queue = [...S.scen.barge.events];
    setMode('caller');
    render();
    wait(advance, 300);
  };

  const skip = () => {
    S.gen += 1;
    stopAll();
    S.feed.forEach((i) => { if (i.live) { i.text = i.full; i.live = false; } if (i.k === 'tool' && i.st === 'run') i.st = 'done'; });
    for (const e of S.queue) {
      if (e.t === 'agent' || e.t === 'caller') S.feed.push({ k: e.t, full: e.text, text: e.text, live: false });
      else if (e.t === 'think') S.feed.push({ k: 'think', full: e.text, text: e.text });
      else if (e.t === 'tool') {
        S.feed.push({ k: 'tool', call: e.call, st: 'done', result: e.result });
        S.tools += 1;
        if (e.art) S.feed.push({ k: 'art', art: e.art });
      }
    }
    S.queue = [];
    S.clock = Math.round((Date.now() - S.t0) / 1000);
    finish();
  };

  const toggleSound = () => {
    S.sound = !S.sound;
    if (!S.sound && synthOK) window.speechSynthesis.cancel();
    render();
  };

  /* ── pick screen ── */
  if (S.phase === 'pick') {
    return (
      <div className="surface p-6 sm:p-10">
        <div className="max-w-xl">
          <h3 className="text-2xl">{V.title}</h3>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            {V.p1}<span className="text-ivory">{V.b1}</span>{V.p2}<span className="text-ivory">{V.b2}</span>{V.p3}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.05] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gold/90">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />{V.voiceNote}
          </p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {calls.map((c) => (
            <button key={c.id} onClick={() => start(c)}
              className="group text-left rounded-xl border border-white/[0.08] p-6 hover:border-accent/40 hover:bg-accent/[0.03] transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.icon}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70">{c.direction} · {c.domain}</span>
              </div>
              <p className="mt-4 font-display italic text-[17px] text-ivory/90 leading-snug">“{c.goal}”</p>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-accent opacity-60 group-hover:opacity-100 transition">
                {synthOK ? `🔊 ${V.answer}` : V.answer}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          <p className="font-mono text-[10px] text-muted/50 leading-relaxed">
            {V.foot}
          </p>
          <p className="font-mono text-[10px] text-muted/70 leading-relaxed">
            {V.stackLine}
          </p>
          <div className="flex flex-wrap gap-2">
            {VOICE_STACK.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        </div>
      </div>
    );
  }

  const scen = S.scen;
  const live = S.phase === 'live';

  return (
    <div className="surface p-6 sm:p-8">
      {/* call header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70 flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-danger' : 'bg-muted/50'}`} style={live ? { animation: 'pulse2 1.4s infinite' } : undefined} />
              {live ? V.live : V.ended} · {fmt(S.clock)}
            </span>
            <span>{scen.icon} {scen.domain}</span>
          </div>
          <h3 className="text-lg mt-1.5 font-display italic font-normal text-ivory/90">{scen.persona}</h3>
        </div>
        {synthOK && (
          <button onClick={toggleSound}
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] rounded-full px-3.5 py-2 border border-white/10 text-muted hover:text-ivory hover:border-white/30 transition">
            {S.sound ? V.soundOn : V.muted}
          </button>
        )}
      </div>

      {/* waveform + call controls: kept together so the interrupt is always in view */}
      <div className="mt-5 rounded-xl border border-white/[0.07] bg-ink/60 px-4 py-2.5">
        <Waveform modeRef={modeRef} />
        <div className="flex items-center justify-between gap-3 flex-wrap mt-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70">{V.states[S.state]}</span>
          {live && (
            <div className="flex items-center gap-3">
              {S.barge !== 'none' && (
                <button onClick={bargeIn} disabled={!S.armed}
                  title={S.armed ? '' : scen.bargeHint}
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] rounded-full px-3.5 py-1.5 border transition ${
                    S.armed ? 'border-gold/60 text-gold hover:bg-gold/10' : 'border-white/10 text-muted/50'
                  }`} style={S.armed ? { animation: 'pulse2 1.6s infinite' } : undefined}>
                  {S.barge === 'used' ? V.handled : S.armed ? `⚡ ${V.interrupt}: ${scen.bargeLabel}` : `⚡ ${scen.bargeLabel} · ${V.soon}`}
                </button>
              )}
              <button onClick={skip} className="font-mono text-[10px] text-muted/60 hover:text-ivory transition">{V.skip}</button>
            </div>
          )}
        </div>
      </div>

      {/* transcript */}
      <div ref={feedEl} className="mt-4 rounded-xl border border-white/[0.07] bg-ink/60 p-4 sm:p-5 h-[340px] overflow-y-auto space-y-3.5">
        {S.feed.map((item, i) => <Turn key={i} item={item} />)}
        {!live && S.outcome && (
          <div className="rounded-xl border border-accent/30 bg-accent/[0.04] p-5 mt-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">{V.complete} · {fmt(S.clock)} · {V.summary}</div>
            <div className="font-display text-2xl text-ivory mt-2.5">{S.outcome.headline}</div>
            <p className="text-[13px] text-muted mt-2 leading-relaxed">{S.outcome.detail}</p>
            <div className="mt-4 max-w-[320px] font-mono text-[10.5px] divide-y divide-white/[0.05]">
              {S.outcome.extract.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1">
                  <span className="text-muted">{k}</span><span className="text-ivory">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
              {S.outcome.stats.map(([v, l]) => (
                <div key={l}>
                  <span className="font-display text-lg text-accent">{v}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted ml-2">{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 font-mono text-[10px] text-muted/50 leading-relaxed">
        {V.voiceNote}
      </p>

      {/* actions */}
      {!live && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={() => start(scen)} className="rounded-full bg-accent text-ink font-semibold text-sm px-6 py-2.5 hover:brightness-110 active:scale-[.98] transition">
            {S.barge === 'used' ? V.replay : V.replayTry}
          </button>
          {calls.filter((c) => c.id !== scen.id).map((c) => (
            <button key={c.id} onClick={() => start(c)}
              className="rounded-full border border-white/15 text-muted font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 hover:text-ivory hover:border-white/35 transition">
              {c.icon} {c.short}
            </button>
          ))}
          {onOps && (
            <button onClick={onOps}
              className="rounded-full border border-white/15 text-muted font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 hover:text-ivory hover:border-white/35 transition">
              {V.opsBtn}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
