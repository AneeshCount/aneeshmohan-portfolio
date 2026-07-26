/* ════════════════════════════════════════════════════════════════════════
   Site-wide constants. Anything a future edit is likely to need twice, or
   that a test wants to assert against, belongs here rather than inline.
   ════════════════════════════════════════════════════════════════════════ */

export const SITE_URL = 'https://a-niche.com';

/* Homepage section ids, in nav order. Index-aligned with `s.nav` in i18n.jsx;
   the test suite asserts the two stay the same length. */
export const NAV_IDS = ['work', 'play', 'insights', 'process', 'about', 'contact'];

/* Work section: how many projects sit on the orbit before "view all". Six is
   the floor for the arc to read as an arc; two nodes are just two buttons. */
export const WORK_PREVIEW_COUNT = 6;

/* Process section: how many of the six commitments lead before "see all". */
export const TRUST_PREVIEW_COUNT = 3;

/* Orbit auto-advance interval, ms. Only ever runs at motion tier `full`, and
   stops for good once the visitor picks a node. */
export const ORBIT_DWELL_MS = 5000;

/* Labs cards, index-aligned with `s.labs.items`. null means "not live yet",
   which is what renders the "in the lab" badge instead of a link. */
export const LAB_LINKS = ['labs/journal/', null, null, null];

/* Form relay: Web3Forms (https://web3forms.com). The access key is public by
   design; it maps to the studio inbox without exposing the address anywhere
   on the page or in this bundle. Overridable at build time for a fork. */
export const WEB3FORMS_KEY =
  import.meta.env?.VITE_WEB3FORMS_KEY || '59330203-42bb-48bb-9d3c-a96adeaf35c6';

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/* Consent: single storage key, shared by the banner and the analytics shim. */
export const CONSENT_KEY = 'a-niche-consent';
export const LANG_KEY = 'lang';

/* Motion: the visitor's explicit tier choice, when they have made one.
   Absent means "decide from the device and connection" (src/motion.js). */
export const MOTION_KEY = 'a-niche-motion';
