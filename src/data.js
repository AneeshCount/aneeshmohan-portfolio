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
  { n: 'Agentic', l: 'AI running in production' },
  { n: 'Full-stack', l: 'Frontend, backend, infra, AI' },
];

export const SKILLS = [
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Flutter', 'PWAs'] },
  { group: 'Backend', items: ['Node.js / Express', 'Python / FastAPI', 'REST APIs', 'WebSockets'] },
  { group: 'AI / Data', items: ['LLMs (Claude, GPT, Gemini)', 'LangChain / LangGraph', 'Agentic workflows', 'RAG + pgvector'] },
  { group: 'Infra / Ops', items: ['PostgreSQL', 'Redis', 'AWS', 'Docker', 'CI/CD', 'Nginx / VPS'] },
];

export const SOCIALS = [
  { label: 'Email', href: 'mailto:mohananeesh003@gmail.com', handle: 'mohananeesh003@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/AneeshCount', handle: 'AneeshCount' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aneeshmohan3', handle: 'aneeshmohan3' },
  { label: 'X', href: 'https://x.com/aniche03', handle: '@aniche03' },
];
