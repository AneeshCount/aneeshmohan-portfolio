export const PROJECTS = [
  {
    name: 'RiDERgy',
    tag: 'Flagship · Agentic AI',
    blurb: 'An EV charging and energy-management SaaS built from the ground up. Agentic watchdogs continuously monitor chargers, batteries and solar, while an LLM chat layer lets users control the system in plain language: start a vehicle charging, shift load to solar, or push a schedule, and the agents execute.',
    tech: ['Agentic AI', 'LangGraph', 'LLMs', 'FastAPI', 'React', 'AWS'],
    link: 'https://www.ridergy.com',
    linkLabel: 'ridergy.com',
    note: 'Proprietary codebase · private walkthrough on request',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    name: 'Aurora Mentors',
    tag: 'Live Product · Mentorship Marketplace',
    blurb: 'A two-sided mentorship marketplace: students planning to study abroad book verified mentors already at universities worldwide.',
    tech: ['Next.js 14', 'Supabase', 'NextAuth', 'Razorpay', 'Marketplace'],
    link: 'https://auroramentors.com',
    linkLabel: 'auroramentors.com',
    accent: 'from-amber-400 to-rose-500',
  },
  {
    name: 'RetailMind',
    tag: 'AI Retail Intelligence',
    blurb: 'An AI dashboard for supermarkets and chains: demand forecasting with confidence bands, an AI reorder engine ranking SKUs by days-of-cover, price-optimization recommendations, and an agentic insights assistant that answers questions and proposes the next action.',
    tech: ['React', 'AI Agent', 'Forecasting', 'Tailwind'],
    link: 'https://retailmind-demo.vercel.app/',
    linkLabel: 'Live demo',
    accent: 'from-indigo-500 to-cyan-500',
  },
  {
    name: 'CargoLink',
    tag: 'Logistics Platform',
    blurb: 'A modern logistics company site with a real-time shipment cost calculator (volumetric weight, multi-mode pricing, fuel and GST), a live tracking widget, and a validated lead-capture flow. Built as a conversion-focused marketing site.',
    tech: ['React', 'Tailwind', 'Node', 'Calculator'],
    link: 'https://aneeshcount.github.io/cargolink-logistics-demo/',
    linkLabel: 'Live demo',
    accent: 'from-sky-500 to-emerald-500',
  },
  {
    name: 'Daksh Sathi',
    tag: 'Hyperlocal Marketplace PWA',
    blurb: 'A 33-service hyperlocal marketplace as an installable PWA: a multi-screen booking flow, masonry partner portfolios with verified badges, and a wallet and escrow payment model with a 30:70 split released by customer PIN.',
    tech: ['React PWA', 'Wallet/Escrow', 'Tailwind', 'PostgreSQL'],
    link: 'https://daksh-sathi-demo.vercel.app/',
    linkLabel: 'Live demo',
    accent: 'from-emerald-500 to-teal-500',
  },
];

export const METRICS = [
  { n: '0→1', l: 'Products shipped from scratch' },
  { n: 'Live', l: 'Agentic AI in production' },
  { n: 'Global', l: 'Async delivery across timezones' },
];

export const SKILLS = [
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Flutter', 'PWAs'] },
  { group: 'Backend', items: ['Node.js / Express', 'Python / FastAPI', 'REST APIs', 'WebSockets'] },
  { group: 'AI / Agents', items: ['LLMs (Claude, GPT, Gemini)', 'LangChain / LangGraph', 'Agentic workflows', 'Voice agents (STT · TTS · telephony)', 'RAG + pgvector'] },
  { group: 'Infra / Ops', items: ['PostgreSQL', 'Redis', 'AWS', 'Docker', 'CI/CD', 'Nginx / VPS'] },
];

export const SERVICES = [
  {
    t: 'Voice agents',
    d: 'AI receptionists and outbound callers that answer, qualify, book and follow up, around the clock, in any language.',
    eg: 'Live demo: take a call below',
  },
  {
    t: 'AI agents & automations',
    d: 'Agents that run real operations: triage, reporting, follow-ups, back-office flows that execute themselves.',
    eg: 'Live demo: run the ops agent below',
  },
  {
    t: 'WhatsApp & support AI',
    d: 'Assistants on WhatsApp and your site that sell, support and answer from your own documents, with clean human handoff.',
    eg: 'RAG over your prices, policies, FAQs',
  },
  {
    t: 'Web & mobile apps',
    d: 'Secure, fully integrated full-stack apps: auth, payments, admin panels, APIs, installable on any phone.',
    eg: 'Daksh Sathi: 33-service marketplace PWA',
  },
  {
    t: 'SaaS & MVPs',
    d: 'Blank page to paying users: multi-tenant products with billing, infra and CI, shipped in weeks.',
    eg: 'RiDERgy: production energy SaaS',
  },
  {
    t: 'Dashboards & analytics',
    d: 'Forecasting, AI insights and reporting that executives actually read and act on.',
    eg: 'RetailMind: AI retail intelligence',
  },
  {
    t: 'Integrations & internal tools',
    d: 'Your CRM, calendar, inbox and telephony stitched into one system that updates itself.',
    eg: 'n8n · Zapier · MCP · WhatsApp API',
  },
  {
    t: 'Websites that sell',
    d: 'Conversion-focused marketing sites with calculators, lead capture and clean SEO.',
    eg: 'CargoLink: logistics site + quote engine',
  },
];

export const TRUST = [
  {
    t: 'Senior-led, always',
    d: 'Every project is led end to end by the founder. Vetted specialist designers and engineers join as your scope grows, so capacity is never the bottleneck.',
  },
  {
    t: 'Your IP, fully yours',
    d: 'Clean contracts, NDA before you share anything sensitive, and full source code and IP transfer on completion.',
  },
  {
    t: 'Security by default',
    d: 'Least-privilege access, encrypted secrets, audit trails and GDPR-aware data handling on every build.',
  },
  {
    t: 'Global, async-first',
    d: 'Clients across US, EU, Middle East and Asia get overlap hours, weekly demo videos and one accountable point of contact.',
  },
  {
    t: 'Milestone billing',
    d: 'Pay per shipped milestone, never for promises. Escrow-friendly: direct, Upwork or Freelancer, whichever protects you best.',
  },
  {
    t: 'Supported after launch',
    d: 'Documentation, handover training and 30 days of included support with every build. Long-term care via retainers.',
  },
];

export const PLATFORMS = [
  'AWS', 'Google Cloud', 'Anthropic Claude', 'OpenAI', 'ElevenLabs', 'Deepgram',
  'Twilio', 'WhatsApp Business', 'Stripe', 'Razorpay', 'Supabase', 'PostgreSQL', 'Vercel', 'Docker',
];

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/AneeshCount', handle: 'AneeshCount' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aneeshmohan3', handle: 'aneeshmohan3' },
  { label: 'X', href: 'https://x.com/aniche03', handle: '@aniche03' },
];
