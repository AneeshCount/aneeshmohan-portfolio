/* ════════════════════════════════════════════════════════════════════════
   SITE DATA: language-independent facts only. Everything a visitor reads
   as prose (tags, blurbs, notes, how-to steps, metric labels) lives in
   i18n.jsx so it exists in all four languages.

   PROJECTS order is the display order and must stay aligned with the
   `projects` array in every language block of i18n.jsx. `id` exists so a
   translation can be traced back to its project; the test suite asserts
   the alignment, so reordering here without reordering i18n fails CI.
   ════════════════════════════════════════════════════════════════════════ */

export const PROJECTS = [
  {
    id: 'ridergy',
    name: 'RiDERgy',
    tech: ['Agentic AI', 'LangGraph', 'LLMs', 'FastAPI', 'React', 'AWS'],
    link: 'https://demo.ridergy.com',
  },
  {
    id: 'aurora-mentors',
    name: 'Aurora Mentors',
    tech: ['Next.js 14', 'Supabase', 'NextAuth', 'Razorpay', 'Marketplace'],
    link: 'https://auroramentors.com',
  },
  {
    id: 'retailmind',
    name: 'RetailMind',
    tech: ['React', 'AI Agent', 'Forecasting', 'Tailwind'],
    link: 'https://retailmind-demo.vercel.app/',
  },
  {
    id: 'cargolink',
    name: 'CargoLink',
    tech: ['React', 'Tailwind', 'Node', 'Calculator'],
    link: 'https://aneeshcount.github.io/cargolink-logistics-demo/',
  },
  {
    id: 'daksh-sathi',
    name: 'Daksh Sathi',
    tech: ['React PWA', 'Wallet/Escrow', 'Tailwind', 'PostgreSQL'],
    link: 'https://daksh-sathi-demo.vercel.app/',
  },
  {
    id: 'solstice-connect',
    name: 'Solstice CONNECT',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'QR/Camera', 'Admin Portal'],
    link: 'https://solstice-connect.vercel.app',
  },
  {
    id: 'espai',
    name: 'ESPAI',
    tech: ['ESP32', 'FreeRTOS', 'Arduino', 'FastAPI', 'React', 'LLMs'],
    link: null,
  },
  {
    id: 'scrapline',
    name: 'ScrapLine',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'RLS'],
    link: 'https://scrapline-mvp.vercel.app',
  },
  {
    id: 'meridian',
    name: 'Meridian',
    tech: ['Laravel', 'jQuery', 'RBAC', 'Chart.js', 'Stripe'],
    link: 'https://bizplatform-poc.onrender.com',
  },
  {
    id: 'collections-portal',
    name: 'Collections Portal',
    tech: ['Next.js', 'Supabase', 'RLS', 'Field Ops'],
    link: 'https://collections-portal-pi.vercel.app/demo?passkey=bqsM2C5Qnkch',
  },
  {
    id: 'smart-money',
    name: 'Smart Money Dashboard',
    tech: ['Python', 'FastAPI', 'Vercel Cron', 'Supabase'],
    link: 'https://smart-money-dashboard-prototype.vercel.app',
  },
  {
    id: 'treasure-hunt',
    name: 'Treasure Hunt',
    tech: ['Next.js PWA', 'Supabase Realtime', 'Leaflet/GPS'],
    link: null,
  },
  {
    id: 'giftr',
    name: 'Giftr',
    tech: ['Next.js', 'Prisma', 'PostgreSQL', 'AI Agent'],
    link: null,
  },
  {
    id: 'resume-search',
    name: 'ResumeSearch',
    tech: ['FastAPI', 'PostgreSQL', 'pgvector', 'Celery', 'Claude API'],
    link: null,
  },
  {
    id: 'reseller-panel',
    name: 'Reseller Panel',
    tech: ['PHP', 'MySQL', 'Wallet/Escrow', 'RBAC'],
    link: null,
  },
  {
    id: 'nmap-pro',
    name: 'Nmap Pro',
    tech: ['Node.js', 'Nmap', 'Docker', 'Self-hosted'],
    link: null,
  },
];

/* Metric figures only; the label under each one is translated (s.metrics). */
export const METRICS = [{ n: '0→1' }, { n: 'Live' }, { n: 'Global' }];

/* Group headings and item names are proper nouns and stay untranslated. */
export const SKILLS = [
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Flutter', 'PWAs'] },
  { group: 'Backend', items: ['Node.js / Express', 'Python / FastAPI', 'REST APIs', 'WebSockets'] },
  { group: 'AI / Agents', items: ['LLMs (Claude, GPT, Gemini)', 'LangChain / LangGraph', 'Agentic workflows', 'Voice agents (STT · TTS · telephony)', 'RAG + pgvector'] },
  { group: 'Infra / Ops', items: ['PostgreSQL', 'Redis', 'AWS', 'Docker', 'CI/CD', 'Nginx / VPS', 'IoT (ESP32 · MQTT · FreeRTOS)'] },
];

export const PLATFORMS = [
  'AWS', 'Google Cloud', 'Anthropic Claude', 'OpenAI', 'ElevenLabs', 'Deepgram',
  'Twilio', 'WhatsApp Business', 'Stripe', 'Razorpay', 'Supabase', 'PostgreSQL', 'Vercel', 'Docker',
];

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aneeshmohan3' },
  { label: 'X', href: 'https://x.com/aniche03' },
];
