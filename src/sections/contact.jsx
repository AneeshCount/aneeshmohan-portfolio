import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import { SOCIALS } from '../data.js';
import { WEB3FORMS_ENDPOINT, WEB3FORMS_KEY } from '../config.js';

const FIELD_CLS = 'w-full rounded-lg bg-hair/[0.04] border border-hair/10 px-4 py-3 text-[14px] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition';

/* Exported for tests: the payload the relay receives, derived from the form.
   Keeping this pure keeps the submit handler thin and assertable. */
export function buildSubmission(data) {
  const senderName = data.get('name');
  data.append('access_key', WEB3FORMS_KEY);
  data.append('subject', senderName ? `a-niche New Enquiry from ${senderName}` : 'a-niche New Enquiry');
  return data;
}

function ContactForm() {
  const { s } = useLang();
  const [state, setState] = useState('idle');

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (data.get('botcheck')) return; // honeypot: a bot filled the hidden field
    if (!WEB3FORMS_KEY) { setState('error'); return; }
    setState('sending');
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: buildSubmission(data),
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      if (json.success) { setState('sent'); form.reset(); } else setState('error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="mt-9 mx-auto max-w-lg rounded-2xl border border-accent/30 bg-accent/[0.05] p-8 text-center">
        <div className="card-title">{s.ct.sentH}</div>
        <p className="card-body mt-3">{s.ct.sentP}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-9 mx-auto max-w-lg text-left">
      <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.ct.name}</label>
          <input id="cf-name" name="name" type="text" required maxLength="120" placeholder={s.ct.phName} className={`mt-2 ${FIELD_CLS}`} />
        </div>
        <div>
          <label htmlFor="cf-email" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.ct.email}</label>
          <input id="cf-email" name="email" type="email" required maxLength="200" placeholder={s.ct.phEmail} className={`mt-2 ${FIELD_CLS}`} />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="cf-msg" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.ct.msg}</label>
        <textarea id="cf-msg" name="message" required rows="5" maxLength="4000" placeholder={s.ct.phMsg} className={`mt-2 ${FIELD_CLS} resize-y`} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10px] text-muted">{s.ct.consult}</p>
        <button type="submit" disabled={state === 'sending'} className="btn-primary disabled:opacity-60">
          {state === 'sending' ? s.ct.sending : s.ct.send}
        </button>
      </div>
      {state === 'error' && <p role="status" className="mt-4 text-[13px] text-danger/90">{s.ct.err}</p>}
    </form>
  );
}

export function Contact() {
  const { s } = useLang();
  return (
    <section id="contact" className="relative border-t border-hair/8 overflow-hidden">
      <div className="glow w-[36rem] h-[36rem] -bottom-56 left-1/2 -translate-x-1/2" />
      <div className="relative shell-narrow section-y text-center">
        <div className="flex justify-center"><span className="eyebrow-centred">{s.ct.eyebrow}</span></div>
        <h2 className="display-1 mt-8">{s.ct.h2a}<br /> {s.ct.h2b}</h2>
        <p className="lede mt-7 text-muted max-w-md mx-auto">{s.ct.p}</p>
        <ContactForm />
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.ct.nda}</p>
        <div className="mt-9 charge-track max-w-[14rem] mx-auto" />
        <div className="mt-7 flex flex-wrap justify-center gap-x-10 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em]">
          {SOCIALS.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="text-muted hover:text-ivory transition">{social.label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
