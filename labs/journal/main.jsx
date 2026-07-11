import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/bodoni-moda/600-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/jetbrains-mono/400.css';
import '../../src/index.css';

/* ════════════════════════════════════════════════════════════════════════
   VOICE JOURNAL · Studio Lab
   Real microphone input via the browser's built-in speech recognition.
   The "structuring" here is a transparent on-device heuristic; the
   production version swaps in an LLM. Entries stay in localStorage.
   ════════════════════════════════════════════════════════════════════════ */

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
const STORE_KEY = 'lab_journal_v1';

const MOODS = [
  { label: 'Upbeat', tone: 'text-accent border-accent/40 bg-accent/10', words: /\b(happy|great|amazing|excited|proud|wonderful|love|fantastic|good day|grateful|thrilled)\b/i },
  { label: 'Heavy', tone: 'text-danger border-danger/40 bg-danger/10', words: /\b(tired|stressed|worried|anxious|sad|angry|frustrated|exhausted|overwhelmed|bad day|upset)\b/i },
  { label: 'Focused', tone: 'text-gold border-gold/40 bg-gold/10', words: /\b(deadline|working on|focus|shipping|building|studying|meeting|project|plan)\b/i },
];

function structure(raw) {
  const text = raw.trim().replace(/\s+/g, ' ');
  const sentences = text.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 2);
  const first = sentences[0] || text;
  const title = first.split(' ').slice(0, 8).join(' ').replace(/[.!?,;:]+$/, '') || 'Journal entry';
  const mood = MOODS.find((m) => m.words.test(text)) || { label: 'Steady', tone: 'text-muted border-white/20 bg-white/5' };
  const actions = sentences.filter((x) => /\b(need to|have to|has to|remind me|must|should|tomorrow|next week|call|buy|email|finish|send|book|pay)\b/i.test(x)).slice(0, 4);
  const summary = sentences.filter((x) => !actions.includes(x)).slice(0, 3);
  return {
    id: Date.now(),
    when: new Date().toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    title: title.charAt(0).toUpperCase() + title.slice(1),
    mood,
    summary: summary.length ? summary : [text.slice(0, 220)],
    actions,
    words: text.split(' ').length,
  };
}

function MicButton({ recording, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={recording ? 'Stop recording' : 'Start recording'}
      className={`relative grid place-items-center w-24 h-24 rounded-full transition active:scale-95 ${
        recording ? 'bg-danger text-white' : 'bg-accent text-ink hover:brightness-110'} disabled:opacity-40`}>
      {recording && (
        <>
          <span className="absolute inset-0 rounded-full bg-danger/40" style={{ animation: 'ringout 1.6s ease-out infinite' }} />
          <span className="absolute inset-0 rounded-full bg-danger/30" style={{ animation: 'ringout 1.6s ease-out infinite', animationDelay: '.8s' }} />
        </>
      )}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 relative">
        {recording
          ? <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
          : <><rect x="9" y="2.5" width="6" height="11.5" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7" /></>}
      </svg>
    </button>
  );
}

function Journal() {
  const [supported] = useState(!!SR);
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [finalText, setFinalText] = useState('');
  const [typed, setTyped] = useState('');
  const [processing, setProcessing] = useState(false);
  const [micError, setMicError] = useState(null);
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
  });
  const recRef = useRef(null);
  const bufRef = useRef('');

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(entries.map(({ mood, ...e }) => ({ ...e, mood: { label: mood.label, tone: mood.tone } })))); } catch { /* full/private */ }
  }, [entries]);

  const finish = (text) => {
    const t = text.trim();
    if (!t) return;
    setProcessing(true);
    setTimeout(() => {
      setEntries((es) => [structure(t), ...es]);
      setProcessing(false);
      setFinalText(''); setInterim(''); setTyped('');
      bufRef.current = '';
    }, 900);
  };

  const start = () => {
    setMicError(null);
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-IN';
    bufRef.current = '';
    rec.onresult = (e) => {
      let inter = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) bufRef.current += r[0].transcript + ' ';
        else inter += r[0].transcript;
      }
      setFinalText(bufRef.current);
      setInterim(inter);
    };
    rec.onerror = (e) => {
      setRecording(false);
      setMicError(e.error === 'not-allowed'
        ? 'Microphone permission was blocked. You can type your entry below instead.'
        : `Speech recognition stopped (${e.error}). You can type below instead.`);
    };
    rec.onend = () => setRecording(false);
    recRef.current = rec;
    rec.start();
    setRecording(true);
  };

  const stop = () => {
    recRef.current?.stop();
    setRecording(false);
    finish(bufRef.current);
  };

  const remove = (id) => setEntries((es) => es.filter((e) => e.id !== id));

  return (
    <div className="min-h-screen bg-ink text-muted">
      <style>{`@keyframes ringout { 0% { transform: scale(.7); opacity: .9; } 100% { transform: scale(1.9); opacity: 0; } }`}</style>

      {/* header */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-2xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-ivory text-lg tracking-tight">Voice Journal</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">Studio Lab</span>
          </div>
          <a href="../../" className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ivory transition">← Studio</a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-24">
        {/* recorder */}
        <section className="pt-14 pb-10 text-center">
          <h1 className="text-3xl sm:text-4xl text-ivory">Speak your mind.<br />Get it back organised.</h1>
          <p className="mt-4 text-[15px] text-muted max-w-md mx-auto leading-relaxed">
            Ramble for a minute about your day. The lab turns it into a titled entry with mood and action items. Nothing leaves your browser.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5">
            {supported && !micError ? (
              <>
                <MicButton recording={recording} onClick={recording ? stop : start} disabled={processing} />
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
                  {processing ? 'Structuring your entry…' : recording ? 'Listening · tap to finish' : 'Tap to start speaking'}
                </p>
              </>
            ) : (
              <div className="w-full max-w-md text-left">
                {micError && <p className="text-[13px] text-danger/90 mb-3">{micError}</p>}
                {!supported && <p className="text-[13px] text-muted mb-3">This browser has no built-in speech recognition (try Chrome). Type your entry instead:</p>}
                <textarea value={typed} onChange={(e) => setTyped(e.target.value)} rows="4"
                  placeholder="Today was hectic. The client call went great but I still need to send the proposal tomorrow…"
                  className="w-full rounded-lg bg-white/[0.03] border border-white/[0.08] px-4 py-3 text-[14px] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition resize-y" />
                <button onClick={() => finish(typed)} disabled={!typed.trim() || processing}
                  className="mt-3 rounded-full bg-accent text-ink font-semibold text-sm px-6 py-2.5 hover:brightness-110 transition disabled:opacity-40">
                  {processing ? 'Structuring…' : 'Structure it'}
                </button>
              </div>
            )}
          </div>

          {(recording || finalText || interim) && (
            <div className="mt-8 mx-auto max-w-md rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60 mb-2">Live transcript</div>
              <p className="text-[14px] leading-relaxed text-ivory/90">
                {finalText}<span className="text-muted/60 italic">{interim}</span>
                {recording && <span className="ml-1 inline-block w-1.5 h-4 bg-accent/80 align-middle" style={{ animation: 'pulse2 .9s infinite' }} />}
              </p>
            </div>
          )}
        </section>

        {/* entries */}
        {entries.length > 0 && (
          <section className="space-y-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">{entries.length} {entries.length === 1 ? 'entry' : 'entries'} · stored on this device</div>
            {entries.map((e) => (
              <article key={e.id} className="surface p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/60">{e.when} · {e.words} words</div>
                    <h2 className="text-xl text-ivory mt-1.5">{e.title}</h2>
                  </div>
                  <span className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] border rounded-full px-2.5 py-1 ${e.mood.tone}`}>{e.mood.label}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {e.summary.map((sn, i) => (
                    <li key={i} className="text-[14px] text-muted leading-relaxed flex gap-2.5">
                      <span className="mt-[9px] w-1 h-1 rounded-full bg-accent/70 shrink-0" />{sn}
                    </li>
                  ))}
                </ul>
                {e.actions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold mb-2">Action items</div>
                    <ul className="space-y-1.5">
                      {e.actions.map((a, i) => (
                        <li key={i} className="text-[13.5px] text-ivory/85 flex gap-2.5 leading-relaxed">
                          <span className="mt-0.5 text-gold/80">☐</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button onClick={() => remove(e.id)} className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/50 hover:text-danger transition">Delete</button>
              </article>
            ))}
          </section>
        )}

        <p className="mt-14 font-mono text-[10px] text-muted/50 leading-relaxed text-center max-w-md mx-auto">
          Lab demo: speech runs on your browser's built-in recognition and the structuring is a transparent on-device heuristic. The production version uses an LLM and syncs to your notes.
        </p>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Journal />
  </React.StrictMode>
);
