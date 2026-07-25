import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import { useReveal } from '../ui.jsx';
import { AgentConsole } from '../agent.jsx';
import { VoiceAgent } from '../voice.jsx';

/* ?tab=agent deep-links straight to the ops agent; anything else opens on
   the voice call, which is the stronger first impression. */
function initialTab() {
  try {
    return new URLSearchParams(window.location.search).get('tab') === 'agent' ? 'agent' : 'voice';
  } catch {
    return 'voice';
  }
}

export function Playground() {
  const { s } = useLang();
  const ref = useReveal();
  const [tab, setTab] = useState(initialTab);
  const tabs = [['voice', s.pg.tabVoice], ['agent', s.pg.tabOps]];
  return (
    <section id="play" ref={ref} className="border-t border-white/[0.05]">
      <div className="shell section-y">
        <div className="reveal max-w-2xl">
          <div className="eyebrow">{s.pg.eyebrow}</div>
          <h2 className="display-2 mt-5">{s.pg.h2a}<br className="hidden sm:block" /> {s.pg.h2b}</h2>
          <p className="reveal text-muted mt-6 max-w-xl leading-relaxed">
            {s.pg.p1}<span className="text-ivory">{s.pg.voice}</span>{s.pg.p2}<span className="text-ivory">{s.pg.ops}</span>{s.pg.p3}
          </p>
        </div>

        {/* The two tab labels are full sentences in four languages, so the
            switch scrolls sideways on a phone rather than wrapping each
            label onto two lines inside its own pill. */}
        <div className="reveal mt-8 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div className="inline-flex rounded-full border border-white/[0.08] p-1 font-mono text-[10px] uppercase tracking-[0.16em]">
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`whitespace-nowrap rounded-full px-4 sm:px-5 py-2.5 transition ${tab === id ? 'bg-accent text-ink font-semibold' : 'text-muted hover:text-ivory'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="reveal mt-6">
          {tab === 'voice' ? <VoiceAgent onOps={() => setTab('agent')} /> : <AgentConsole />}
        </div>
      </div>
    </section>
  );
}
