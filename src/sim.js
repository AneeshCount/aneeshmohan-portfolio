/* ════════════════════════════════════════════════════════════════════════
   GRID MASTER — simulation core (pure, no React).
   A "day" is fully determined by its seed: car arrivals, energy needs,
   deadlines and price noise all come from one seeded RNG. That makes runs
   comparable — the player, the AI agent and the dumb-charging baseline all
   face the exact same day.
   ════════════════════════════════════════════════════════════════════════ */

export const DAY = 150, TICK_MS = 300, DT = 24 / DAY;      // ~45s = one day
export const SOLAR_MAX = 10, FUSE = 14;                    // kW
export const BATT_CAP = 16, BATT_KW = 6;                   // kWh / kW
export const LEVELS = [0, 3.5, 7, 11];                     // charger throttle (kW)
export const HIGH = 10, FEED = 3;                          // ₹ price threshold / feed-in
export const OVER_TICKS = Math.ceil(3000 / TICK_MS);       // 3s breach = blackout
export const TOTAL_CARS = 5, PMAX = 20;

const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
// Sun sets at f=0.78 (~17:45) — BEFORE the evening building/price peak.
// That's the duck curve: the crunch hour has no solar, which is exactly
// why the battery (and this game) exists.
export const sun = (f) => f < 0.78 ? Math.max(0, Math.sin(Math.PI * f / 0.78)) : 0;
export const buildingAt = (f) => 1.2 + 3.4 * gauss(f, 0.32, 0.06) + 4.2 * gauss(f, 0.8, 0.07) + 1.2 * gauss(f, 0.55, 0.18);
export const priceAt = (f) => 4 + 9 * gauss(f, 0.34, 0.06) + 13 * gauss(f, 0.8, 0.07) + 1.5 * gauss(f, 0.5, 0.2);

// The sim day maps to 06:00 → 21:00 (solar peaks ~13:30, price ~18:00).
export const clockOf = (t) => {
 const h = 6 + (t / DAY) * 15;
 const hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
 return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export const mulberry32 = (a) => () => {
 a |= 0; a = (a + 0x6D2B79F5) | 0;
 let t = Math.imul(a ^ (a >>> 15), 1 | a);
 t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
 return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const newSeed = () => (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;

export function fresh(seed) {
 const rnd = mulberry32(seed);
 const noise = Array.from({ length: DAY }, () => (rnd() - 0.5) * 1.5);
 // Arrivals spread across the whole day (last cars land in the evening
 // peak, where fuse headroom is scarcest — that's the strategic crunch).
 const plan = [];
 for (let i = 0; i < TOTAL_CARS; i++) {
 const at = Math.max(2, Math.floor(DAY * (0.03 + 0.19 * i) + rnd() * 12));
 plan.push({ at, need: 16 + Math.floor(rnd() * 13), dur: 40 + Math.floor(rnd() * 22) });
 }
 const priceCurve = Array.from({ length: DAY }, (_, i) => +(priceAt((i + 1) / DAY) + noise[i]).toFixed(1));
 return {
 seed, plan, qi: 0, priceCurve,
 t: 0, solar: 0, building: 0, price: priceCurve[0],
 chargers: [{ car: null, lvl: 0 }, { car: null, lvl: 0 }, { car: null, lvl: 0 }],
 batt: { kwh: BATT_CAP * 0.55, mode: "auto" },
 gridDraw: 0, load: 0, bCharge: 0, bDischarge: 0,
 importE: 0, exportE: 0, loadE: 0, solarE: 0, cost: 0,
 over: 0, trips: 0, done: 0, missed: 0,
 };
}

export function step(g) {
 g.t++;
 const f = g.t / DAY;
 g.solar = +(SOLAR_MAX * sun(f)).toFixed(2);
 g.building = +buildingAt(f).toFixed(2);
 g.price = g.priceCurve[g.t - 1];

 // planned EV arrivals take the first free bay (deadline runs from placement)
 while (g.qi < g.plan.length && g.plan[g.qi].at <= g.t) {
 const i = g.chargers.findIndex((c) => !c.car);
 if (i < 0) break; // bays full — the car waits outside
 const p = g.plan[g.qi];
 g.chargers[i].car = { need: p.need, total: p.need, deadline: g.t + p.dur };
 g.chargers[i].lvl = 0;
 g.qi++;
 }

 const chargers = g.chargers.reduce((s, c) => s + ((c.car && c.car.need > 0) ? LEVELS[c.lvl] : 0), 0);
 const load = +(g.building + chargers).toFixed(2);
 g.load = load;

 // battery decision
 const socKW = g.batt.kwh / DT, capLeftKW = (BATT_CAP - g.batt.kwh) / DT, surplus = g.solar - load;
 let bC = 0, bD = 0;
 if (g.batt.mode === "idle") { /* no battery participation (dumb baseline) */ }
 else if (g.batt.mode === "charge") bC = Math.min(BATT_KW, capLeftKW);
 else if (g.batt.mode === "discharge") bD = Math.min(BATT_KW, socKW);
 else { // auto: soak surplus solar, else cover load when price is high
 if (surplus > 0.2) bC = Math.min(BATT_KW, capLeftKW, surplus);
 else if (g.price >= HIGH && load > g.solar) bD = Math.min(BATT_KW, socKW, load - g.solar);
 }
 g.batt.kwh = Math.max(0, Math.min(BATT_CAP, g.batt.kwh + bC * DT - bD * DT));
 g.bCharge = +bC.toFixed(2); g.bDischarge = +bD.toFixed(2);

 const gridDraw = +(load + bC - g.solar - bD).toFixed(2);
 g.gridDraw = gridDraw;
 const imp = Math.max(0, gridDraw), exp = Math.max(0, -gridDraw);

 // fuse: sustained import over the limit = blackout
 if (imp > FUSE) g.over++; else g.over = 0;

 // accounting
 g.importE += imp * DT; g.exportE += exp * DT; g.loadE += load * DT; g.solarE += g.solar * DT;
 g.cost += imp * DT * g.price - exp * DT * FEED;

 // deliver charge
 for (const c of g.chargers) if (c.car && c.car.need > 0 && LEVELS[c.lvl] > 0) c.car.need = Math.max(0, c.car.need - LEVELS[c.lvl] * DT);
 for (const c of g.chargers) if (c.car) {
 if (c.car.need <= 0) { g.done++; c.car = null; c.lvl = 0; }
 else if (g.t > c.car.deadline) { g.missed++; c.car = null; c.lvl = 0; }
 }
}

export const selfSuff = (g) => g.loadE > 0 ? Math.max(0, Math.round((1 - g.importE / g.loadE) * 100)) : 100;
export const selfCons = (g) => g.solarE > 0 ? Math.max(0, Math.round((1 - g.exportE / g.solarE) * 100)) : 0;

// Score against the dumb-charging baseline for THIS day, so the cost term
// always spans its full range (a fixed ₹ divisor made it near-useless).
export const scoreOf = (g, naiveCost) => {
 const savings = naiveCost > 1 ? Math.max(0, Math.min(1, (naiveCost - Math.max(0, g.cost)) / naiveCost)) : 0;
 return Math.max(0, Math.min(100, Math.round((g.done / TOTAL_CARS) * 45 + selfSuff(g) * 0.35 + savings * 20)));
};
export const gradeOf = (s) => s >= 90 ? "GRID MASTER" : s >= 70 ? "EFFICIENT" : s >= 50 ? "GETTING THERE" : "INEFFICIENT";

/* ── Controllers ─────────────────────────────────────────────────────────
   A controller mutates charger levels + battery mode before each physics
   step — exactly the levers the human player has. */

// Dumb charging: every car at full blast, no battery management at all.
export function naiveControl(g) {
 for (const c of g.chargers) if (c.car && c.car.need > 0) c.lvl = 3;
 g.batt.mode = "idle";
}

// The agent: deadline-aware charger scheduling under a fuse-headroom budget,
// price-aware deferral, battery as the peak-shaving reserve. The same shape
// of policy RiDERgy's production agents run — just condensed.
export function agentControl(g) {
 const f = (g.t + 1) / DAY;
 const solar = SOLAR_MAX * sun(f), building = buildingAt(f);
 const socKW = g.batt.kwh / DT;
 const price = g.priceCurve[Math.min(g.t, DAY - 1)];

 const active = g.chargers.filter((c) => c.car && c.car.need > 0);
 for (const c of g.chargers) c.lvl = 0;

 // most urgent first: least spare energy headroom at full power
 const slack = (c) => (c.car.deadline - g.t) * DT * LEVELS[3] - c.car.need;
 active.sort((a, b) => slack(a) - slack(b));

 let budget = FUSE - 1.2 + solar - building; // import headroom without the battery
 const battReserve = socKW > 1 ? BATT_KW : 0;
 let needBatt = false;

 for (const c of active) {
 // plan against the sooner of the car's deadline and the end of the day
 const ticksLeft = Math.max(1, Math.min(c.car.deadline, DAY) - g.t);
 const reqKW = c.car.need / (ticksLeft * DT);
 let lvl = LEVELS.findIndex((L) => L >= reqKW * 1.15);
 if (lvl === -1) lvl = 3;
 if (price >= HIGH && reqKW < 2) lvl = Math.min(lvl, 1); // defer relaxed cars off the price peak
 while (lvl > 0 && LEVELS[lvl] > budget + battReserve) lvl--;
 if (LEVELS[lvl] > budget) needBatt = true;
 c.lvl = lvl;
 budget -= LEVELS[lvl];
 }

 g.batt.mode = needBatt && socKW > 0.5 ? "discharge" : "auto";
}

// Run a full day headlessly. Blackouts don't end the run (the breaker
// "recloses"), they're counted — so the baseline can report its failures.
export function runDay(seed, control) {
 const g = fresh(seed);
 let trips = 0;
 while (g.t < DAY) {
 if (control) control(g);
 step(g);
 if (g.over >= OVER_TICKS) { trips++; g.over = 0; }
 }
 g.trips = trips;
 return g;
}
