/**
 * Sovereign: 1450 — Original Identity Pillar 1: Global Crossroads Eras
 * Tracks historical-divergence macro institutions (Gunpowder, Oceanic Navigation,
 * Printing Press, Chartered Finance, First Contact) across 1450-1650 campaigns.
 * Deterministic, zero Math.random().
 */
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const num = n => (Number.isFinite(n) ? n : 0);
const ok = (msg, extra = {}) => ({ ok: true, msg, ...extra });
const no = (msg, extra = {}) => ({ ok: false, msg, ...extra });

export const CROSSROADS_ERAS = Object.freeze({
 gunpowder_foundry: {
  id: 'gunpowder_foundry',
  name: 'Gunpowder Foundries',
  unlockYear: 1450,
  cost: 160,
  desc: 'Bronze cannon foundries & siege trains transform bastion warfare and state armories.',
  mod: { siege: 1.18, levy: 1.06, unrest: -0.5 }
 },
 oceanic_navigation: {
  id: 'oceanic_navigation',
  name: 'Oceanic Navigation',
  unlockYear: 1458,
  cost: 180,
  desc: 'Caravels, astrolabes, and monsoon charts open transoceanic spice and bullion corridors.',
  mod: { trade: 1.16, prestigeMonthly: 0.4 }
 },
 printing_press: {
  id: 'printing_press',
  name: 'Printing Press & Chanceries',
  unlockYear: 1465,
  cost: 170,
  desc: 'Movable-type edicts standardize royal law, accelerate scholarship, and spread pamphlets.',
  mod: { researchBonus: 1.5, tax: 1.05 }
 },
 chartered_finance: {
  id: 'chartered_finance',
  name: 'Chartered Finance & Bourses',
  unlockYear: 1475,
  cost: 200,
  desc: 'Bills of exchange, maritime insurance, and sovereign credit lower borrowing friction.',
  mod: { tax: 1.1, trade: 1.12 }
 },
 first_contact: {
  id: 'first_contact',
  name: 'Global First Contact',
  unlockYear: 1490,
  cost: 220,
  desc: 'Embassy interpreters, botanical exchanges, and hemispheric silver redefine diplomacy.',
  mod: { trade: 1.15, levy: 1.04, vassalOpinion: 4 }
 }
});

export function initCrossroads(g, world = null) {
 if (!g || typeof g !== 'object') return null;
 const c = (g.crossroads ??= {
  version: 1,
  lastTick: -1,
  globalUnlocked: ['gunpowder_foundry'],
  realms: {},
  history: []
 });
 c.globalUnlocked ??= ['gunpowder_foundry'];
 c.realms ??= {};
 c.history ??= [];

 for (const realm of Object.keys(g.politics?.realms || {})) {
  if (!c.realms[realm]) {
   const initialAdopted = [];
   const fac = g.factions?.[realm];
   if (['ottomans', 'ming', 'france', 'imperial', 'timurids'].includes(realm) || (fac?.tech || 1) >= 2) {
    initialAdopted.push('gunpowder_foundry');
   }
   c.realms[realm] = { adopted: initialAdopted, progress: {}, lastInvest: -24 };
  }
 }
 return c;
}

export function crossroadsModifiers(g, realm) {
 const c = g?.crossroads?.realms?.[realm];
 const out = { tax: 1, levy: 1, trade: 1, siege: 1, researchBonus: 0, vassalOpinion: 0, prestigeMonthly: 0, unrest: 0 };
 if (!c || !Array.isArray(c.adopted)) return out;
 for (const eid of c.adopted) {
  const def = CROSSROADS_ERAS[eid];
  if (!def?.mod) continue;
  if (def.mod.tax) out.tax *= def.mod.tax;
  if (def.mod.levy) out.levy *= def.mod.levy;
  if (def.mod.trade) out.trade *= def.mod.trade;
  if (def.mod.siege) out.siege *= def.mod.siege;
  if (def.mod.researchBonus) out.researchBonus += def.mod.researchBonus;
  if (def.mod.vassalOpinion) out.vassalOpinion += def.mod.vassalOpinion;
  if (def.mod.prestigeMonthly) out.prestigeMonthly += def.mod.prestigeMonthly;
  if (def.mod.unrest) out.unrest += def.mod.unrest;
 }
 return out;
}

export function crossroadsView(g, realm = g?.player) {
 const c = initCrossroads(g);
 if (!c || !realm) return null;
 const rs = c.realms[realm] || { adopted: [], progress: {} };
 const year = g.year || 1450;
 const eras = Object.values(CROSSROADS_ERAS).map(e => {
  const unlocked = year >= e.unlockYear || c.globalUnlocked.includes(e.id) || num(rs.progress[e.id]) >= 50;
  const adopted = rs.adopted.includes(e.id);
  const progress = Math.min(100, num(rs.progress[e.id]));
  return {
   ...e,
   unlocked,
   adopted,
   progress,
   canAdopt: !adopted && unlocked && (g.factions?.[realm]?.treasury || 0) >= e.cost
  };
 });
 return {
  eras,
  adoptedCount: rs.adopted.length,
  modifiers: crossroadsModifiers(g, realm),
  history: c.history.filter(h => h.realm === realm || !h.realm).slice(0, 8)
 };
}

export function crossroadsAction(g, world, type, id = '') {
 const c = initCrossroads(g, world);
 const realm = g?.player;
 const f = g?.factions?.[realm];
 if (!c || !f) return no('No active realm.');
 const rs = (c.realms[realm] ??= { adopted: [], progress: {}, lastInvest: -24 });

 if (type === 'adopt' || type === 'sponsor') {
  const def = CROSSROADS_ERAS[id];
  if (!def) return no('Unknown Crossroads institution.');
  if (rs.adopted.includes(id)) return no(`${def.name} is already adopted.`);
  const year = g.year || 1450;
  const unlocked = year >= def.unlockYear || c.globalUnlocked.includes(id) || num(rs.progress[id]) >= 50;
  if (!unlocked) return no(`${def.name} emerges after ${def.unlockYear} or with 50% patron research.`);
  if (f.treasury < def.cost) return no(`Adopting ${def.name} requires ${def.cost} gold.`);
  f.treasury -= def.cost;
  rs.adopted.push(id);
  rs.progress[id] = 100;
  if (!c.globalUnlocked.includes(id)) c.globalUnlocked.push(id);
  f.prestige = num(f.prestige) + 12;
  c.history.unshift({ year, turn: g.turn || 0, realm, id, text: `${f.name} adopted ${def.name}.` });
  if (c.history.length > 60) c.history.length = 60;
  if (Array.isArray(g.log)) g.log.unshift({ date: `${year} · month ${(g.month || 0) + 1}`, text: `Crossroads Milestone: Adopted ${def.name}!` });
  return ok(`Adopted ${def.name} (+12 prestige).`);
 }

 if (type === 'research' || type === 'patronize') {
  const def = CROSSROADS_ERAS[id];
  if (!def) return no('Select a Crossroads institution to patronize.');
  if (rs.adopted.includes(id)) return no('Already adopted.');
  if ((g.turn || 0) - (rs.lastInvest ?? -24) < 6) return no('Crossroads patronage requires 6 months between grants.');
  if (f.treasury < 80) return no('Crossroads research patronage requires 80 gold.');
  f.treasury -= 80;
  rs.lastInvest = g.turn || 0;
  rs.progress[id] = clamp(num(rs.progress[id]) + 35, 0, 100);
  return ok(`Funded ${def.name} scholars (${rs.progress[id]}% readiness).`);
 }

 return no('Unknown Crossroads action.');
}

export function tickCrossroads(g, world = null) {
 const c = initCrossroads(g, world);
 if (!c || c.lastTick === g.turn) return;
 c.lastTick = g.turn;

 const year = g.year || 1450;
 for (const def of Object.values(CROSSROADS_ERAS)) {
  if (year >= def.unlockYear && !c.globalUnlocked.includes(def.id)) {
   c.globalUnlocked.push(def.id);
  }
 }

 if ((g.turn || 0) % 6 !== 0) return;
 for (const [realm, f] of Object.entries(g.factions || {})) {
  if (!f || realm === 'independent' || !c.realms[realm]) continue;
  const rs = c.realms[realm];
  const r = g.politics?.people?.[g.politics?.realms?.[realm]?.ruler];
  const learning = r?.skills?.learning || 2;
  for (const def of Object.values(CROSSROADS_ERAS)) {
   if (rs.adopted.includes(def.id)) continue;
   if (year >= def.unlockYear || c.globalUnlocked.includes(def.id)) {
    rs.progress[def.id] = clamp(num(rs.progress[def.id]) + 3 + learning, 0, 100);
   }
  }
  // Autonomous AI adoption once wealthy & unlocked
  if (realm !== g.player && f.treasury >= 650 && (g.turn || 0) % 12 === 0) {
   const next = Object.values(CROSSROADS_ERAS).find(e => !rs.adopted.includes(e.id) && (year >= e.unlockYear || c.globalUnlocked.includes(e.id)) && f.treasury >= e.cost + 300);
   if (next) {
    f.treasury -= next.cost;
    rs.adopted.push(next.id);
    rs.progress[next.id] = 100;
    f.prestige = num(f.prestige) + 10;
   }
  }
 }
}
