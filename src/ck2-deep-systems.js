/**
 * CK2 Deep Systems & Cross-System Mechanics (Wave-1)
 * Deterministic, serializable grand-strategy systems with zero Math.random().
 */
import {allocateCharacterName,allocateCardinalName,allocatePopeName} from './name-pools.js';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const num = n => (Number.isFinite(n) ? n : 0);
const pair = (a, b) => [a, b].sort().join('|');
const ok = (msg, extra = {}) => ({ ok: true, msg, ...extra });
const no = (msg, extra = {}) => ({ ok: false, msg, ...extra });

export function hashStr(s) {
 let h = 2166136261;
 const str = String(s ?? '');
 for (let i = 0; i < str.length; i++) {
  h = Math.imul(h ^ str.charCodeAt(i), 16777619);
 }
 return h >>> 0;
}

function nextRand(g) {
 const d = ensureDeepSystems(g);
 d.seed = (Math.imul(d.seed || 145299, 1664525) + 1013904223) >>> 0;
 return d.seed / 4294967296;
}

function addLog(g, realm, text) {
 const d = ensureDeepSystems(g);
 d.history.unshift({ realm, turn: g.turn || 0, message: text });
 if (d.history.length > 240) d.history.length = 240;
 if (realm === g.player && Array.isArray(g.log)) {
  const date = Number.isInteger(g.year) && Number.isInteger(g.month)
   ? `${g.year} · month ${g.month + 1}`
   : `Turn ${g.turn || 0}`;
  g.log.unshift({ date, text });
  if (g.log.length > 45) g.log.length = 45;
 }
}

const getRulerId = (g, r) => g.politics?.realms?.[r]?.ruler || null;
const getRuler = (g, r) => {
 const id = getRulerId(g, r);
 const p = id ? g.politics?.people?.[id] : null;
 return p?.alive ? p : null;
};
const getController = (g, id) => g.campaignWar?.occupations?.[id]?.by || g.provinces?.[id]?.owner;
const controlledProvinces = (g, r) =>
 Object.values(g.provinces || {}).filter(p => p.owner === r && getController(g, p.id) === r);
const ownedProvinces = (g, r) => Object.values(g.provinces || {}).filter(p => p.owner === r);

const FAITH_FAMILIES = {
 'Latin Christianity': 'Christianity',
 'Eastern Christianity': 'Christianity',
 'Ethiopian Christianity': 'Christianity',
 'Christian traditions': 'Christianity',
 'Sunni Islam': 'Islam',
 'Islamic traditions': 'Islam',
 'Islamic and local traditions': 'Islam',
 'Tibetan Buddhism': 'Buddhism',
 'Theravada Buddhism': 'Buddhism',
 'Hindu traditions': 'Hindu traditions',
 'Hindu-Buddhist traditions': 'Hindu traditions',
 'Chinese ritual traditions': 'East Asian ritual traditions',
 'Confucian ritual traditions': 'East Asian ritual traditions',
 'Vietnamese ritual traditions': 'East Asian ritual traditions'
};

const SACRED_SITES_LOCAL = {
 latium: { name: 'Apostolic See of Rome', system: 'catholic', faith: 'Latin Christianity' },
 jerusalem: { name: 'Holy City of Jerusalem', system: 'catholic', faith: 'Latin Christianity' },
 thrace: { name: 'Imperial Cathedral of Constantinople', system: 'orthodox', faith: 'Eastern Christianity' },
 hejaz: { name: 'Sacred Sanctuary of Mecca', system: 'islamic', faith: 'Sunni Islam' },
 benares: { name: 'Sacred Ghats of Varanasi', system: 'dharmic', faith: 'Hindu traditions' },
 kyoto: { name: 'Sacred Shrines of Kyoto', system: 'dharmic', faith: 'Buddhist and kami traditions' },
 cusco: { name: 'Temple of the Sun at Cusco', system: 'traditional', faith: 'Andean spiritual traditions' },
 lhasa: { name: 'Potala Monastic Sanctuary', system: 'dharmic', faith: 'Tibetan Buddhism' }
};

export function resolveFaithSystem(g, faithLabel) {
 if (!faithLabel) return 'traditional';
 const custom = g?.identity?.faithDefinitions?.[faithLabel];
 const base = custom?.parent || faithLabel;
 if (base === 'Latin Christianity') return 'catholic';
 if (['Eastern Christianity', 'Ethiopian Christianity', 'Christian traditions'].includes(base)) return 'orthodox';
 if (['Sunni Islam', 'Islamic traditions', 'Islamic and local traditions'].includes(base)) return 'islamic';
 if (
  ['Hindu traditions', 'Hindu-Buddhist traditions', 'Theravada Buddhism', 'Tibetan Buddhism', 'Buddhist and kami traditions'].includes(
   base
  )
 ) {
  return 'dharmic';
 }
 return 'traditional';
}

function resolveFaithFamily(g, faithLabel) {
 if (!faithLabel) return null;
 const custom = g?.identity?.faithDefinitions?.[faithLabel];
 if (custom?.family) return custom.family;
 return Object.hasOwn(FAITH_FAMILIES, faithLabel) ? FAITH_FAMILIES[faithLabel] : faithLabel;
}

function getRealmFaith(g, realm) {
 return g?.civic?.realms?.[realm]?.faith || g?.identity?.realms?.[realm]?.faithSystem?.faith || g?.factions?.[realm]?.faith || null;
}

function isAtWar(g, a, b) {
 const p = pair(a, b);
 return Object.values(g.conflict?.wars || {}).some(w => w.status === 'active' && pair(w.attacker, w.defender) === p);
}

function realmPower(g, realm) {
 let troops = 0;
 for (const a of Object.values(g.armies || {})) {
  if (a.owner === realm && !a.contingent && !g.naval?.voyages?.[a.id]) {
   troops += Math.max(0, num(a.infantry) + num(a.archers) + num(a.cavalry) + num(a.count));
  }
 }
 return troops;
}

function personalRelOpinion(g, aId, bId) {
 if (!aId || !bId || aId === bId) return 0;
 return num(g.chronicles?.relationships?.[pair(aId, bId)]?.opinion);
}

function adjustPersonalOpinion(g, aId, bId, delta) {
 if (!aId || !bId || aId === bId) return false;
 const pa = g.politics?.people?.[aId];
 const pb = g.politics?.people?.[bId];
 if (!pa?.alive || !pb?.alive) return false;
 g.chronicles ??= { version: 1, seed: 145211, realms: {}, relationships: {}, history: [], lastTick: -1 };
 g.chronicles.relationships ??= {};
 const k = pair(aId, bId);
 const rec = (g.chronicles.relationships[k] ??= { a: aId, b: bId, opinion: 0, kind: 'acquaintance', last: -120 });
 rec.opinion = clamp(rec.opinion + delta, -100, 100);
 rec.kind = rec.opinion >= 50 ? 'friend' : rec.opinion <= -50 ? 'rival' : 'acquaintance';
 return true;
}

function hasMarriageTie(g, a, b) {
 if (['marriage'].includes(g.factions?.[a]?.treaties?.[b])) return true;
 for (const p of Object.values(g.politics?.people || {})) {
  if (!p?.alive || p.realm !== a) continue;
  const sp = [p.spouse, ...(p.spouses || [])].filter(Boolean);
  if (sp.some(id => g.politics.people[id]?.alive && g.politics.people[id].realm === b)) return true;
 }
 return false;
}

function findRealmCoords(g, realm, world) {
 const wf = world?.factions?.find(f => f.id === realm);
 if (Array.isArray(wf?.capital) && wf.capital.length >= 2) return wf.capital;
 const fac = g.factions?.[realm];
 if (Array.isArray(fac?.capital) && fac.capital.length >= 2) return fac.capital;
 if (world?.provinces?.length) {
  const ownedIds = new Set(ownedProvinces(g, realm).map(p => p.id));
  const wp = world.provinces.find(p => ownedIds.has(p.id) && Array.isArray(p.centroid));
  if (wp) return wp.centroid;
 }
 return null;
}

function realmsBorder(g, a, b, world) {
 if (!world?.provinces?.length) return false;
 for (const wp of world.provinces) {
  if (g.provinces?.[wp.id]?.owner !== a) continue;
  for (const nid of wp.neighbors || []) {
   if (g.provinces?.[nid]?.owner === b) return true;
  }
 }
 return false;
}

// ============================================================================
// CORE STATE INITIALIZATION
// ============================================================================

export function ensureDeepSystems(g) {
 if (!g || typeof g !== 'object') return null;
 const d = (g.deepSystems ??= {
  version: 1,
  seed: 145299,
  lastTick: -1,
  lastIndependentTick: -1,
  favors: {},
  diplomaticFavors: {},
  obligations: {},
  viceroyalties: {},
  viceroyaltyHistory: [],
  minorTitles: {},
  moralAuthority: {},
  moralAuthorityWar: {},
  cardinals: null,
  antipopes: {},
  crusade: null,
  crusadeHistory: [],
  societies: { memberships: {}, history: [] },
  bloodlines: { definitions: {}, members: {} },
  sieges: {},
  prosperity: {},
  tradePosts: {},
  greatWorks: {},
  followups: [],
  history: []
 });
 d.version ??= 1;
 d.seed ??= 145299;
 d.lastTick ??= -1;
 d.lastIndependentTick ??= -1;
 d.favors ??= {};
 d.diplomaticFavors ??= {};
 d.obligations ??= {};
 d.viceroyalties ??= {};
 d.viceroyaltyHistory ??= [];
 d.minorTitles ??= {};
 d.moralAuthority ??= {};
 d.moralAuthorityWar ??= {};
 d.antipopes ??= {};
 d.crusadeHistory ??= [];
 d.societies ??= { memberships: {}, history: [] };
 d.societies.memberships ??= {};
 d.societies.history ??= [];
 d.bloodlines ??= { definitions: {}, members: {} };
 d.bloodlines.definitions ??= {};
 d.bloodlines.members ??= {};
 d.sieges ??= {};
 d.prosperity ??= {};
 d.tradePosts ??= {};
 d.greatWorks ??= {};
 d.deJureDrift ??= {};
 d.deJureOverrides ??= {};
 d.deJureHistory ??= [];
 d.courtIsolation ??= {};
 d.religiousSchools ??= {};
 d.coronations ??= {};
 d.canonized ??= {};
 d.governanceStrain ??= {};
 d.followups ??= [];
 d.history ??= [];
 g.independentPolities ??= {};
 return d;
}

export function initDeepSystems(g, world = null) {
 const d = ensureDeepSystems(g);
 if (!d) return null;

 // 1. Obligations per realm
 for (const realm of Object.keys(g.politics?.realms || {})) {
  d.obligations[realm] ??= {
   feudalObligations: 'balanced',
   cityObligations: 'balanced',
   templeObligations: 'balanced',
   lastChanged: {}
  };
  d.minorTitles[realm] ??= {};
 }

 // 2. Independent polities (never placed in g.politics.realms)
 initIndependentPolities(g, world);

 // 3. Character genetics & historical bloodlines
 initBloodlinesForRealms(g);
 for (const person of Object.values(g.politics?.people || {})) {
  if (!person) continue;
  const parents = (person.parents || []).map(pid => g.politics.people[pid]).filter(Boolean);
  ensureCharacterGenetics(person, parents, `${g.seed || 1450}:${person.id}`);
  inheritBloodlines(g, person, parents);
 }

 // 4. Moral authority & College of Cardinals
 initMoralAuthority(g);
 initCardinals(g);

 // 5. Province prosperity
 for (const p of Object.values(g.provinces || {})) {
  if (!d.prosperity[p.id]) {
   const initialTier = (p.development || 0) >= 8 ? 1 : 0;
   d.prosperity[p.id] = { tier: initialTier, progress: initialTier ? 20 : 0 };
  }
  p.prosperity ??= d.prosperity[p.id].tier;
 }

 return d;
}

// ============================================================================
// 1. WEIGHTED CK2 ALLIANCE & NAP ACCEPTANCE
// ============================================================================

export function allianceTerms(g, actorArg, targetArg, world = null, opts = {}) {
 let actor = actorArg;
 let target = targetArg;
 let w = world;
 let options = opts;
 if (typeof target !== 'string') {
  options = w && typeof w === 'object' && !w.provinces ? w : opts;
  w = target && typeof target === 'object' ? target : null;
  target = actorArg;
  actor = g.player;
 }
 return evaluateDiplomaticPact(g, actor, target, 'alliance', w, options);
}

export function nonAggressionTerms(g, actorArg, targetArg, world = null, opts = {}) {
 let actor = actorArg;
 let target = targetArg;
 let w = world;
 let options = opts;
 if (typeof target !== 'string') {
  options = w && typeof w === 'object' && !w.provinces ? w : opts;
  w = target && typeof target === 'object' ? target : null;
  target = actorArg;
  actor = g.player;
 }
 return evaluateDiplomaticPact(g, actor, target, 'non_aggression', w, options);
}

function evaluateDiplomaticPact(g, actor, target, kind, world = null, opts = {}) {
 const isAlliance = kind === 'alliance';
 const threshold = isAlliance ? 35 : 15;
 const factors = [];
 const f = g.factions?.[actor];
 const o = g.factions?.[target];
 if (!f || !o || actor === target || actor === 'independent' || target === 'independent') {
  return {
   score: -100,
   threshold,
   accepted: false,
   reason: 'Invalid diplomatic target.',
   factors: [{ label: 'Invalid court', value: -100 }]
  };
 }
 if (isAtWar(g, actor, target)) {
  return {
   score: -100,
   threshold,
   accepted: false,
   reason: 'Negotiate peace before seeking a treaty.',
   factors: [{ label: 'Active war', value: -100 }]
  };
 }

 // 1. Opinion / relation
 const theirRel = num(o.relations?.[actor] ?? f.relations?.[target]);
 const ourRel = num(f.relations?.[target]);
 const rActor = getRuler(g, actor);
 const rTarget = getRuler(g, target);
 const charOp = rActor && rTarget ? personalRelOpinion(g, rTarget.id, rActor.id) : 0;
 const traitOp = rActor && rTarget ? characterTraitOpinion(rTarget, rActor) : 0;
 const opScore = Math.round((theirRel - 10) * 0.65 + clamp(ourRel, -30, 50) * 0.1 + charOp * 0.25 + traitOp * 0.4);
 factors.push({ label: 'Opinion & court relations', value: opScore });

 // 2. Relative military strength
 const myStr = realmPower(g, actor);
 const theirStr = realmPower(g, target);
 let strScore = 0;
 if (myStr > 0 || theirStr > 0) {
  const ratio = myStr / Math.max(1, theirStr);
  if (ratio >= 1.5) strScore = isAlliance ? 10 : 8;
  else if (ratio >= 0.85) strScore = 5;
  else if (ratio >= 0.45) strScore = -4;
  else strScore = isAlliance ? -18 : -10;
  factors.push({ label: 'Relative military strength', value: strScore });
 }

 // 3. Threat / infamy penalty
 const threat = num(g.diplomacy?.threat?.[actor]);
 if (threat > 0) {
  const threatPenalty = -Math.round(threat * (isAlliance ? 0.7 : 0.55));
  factors.push({ label: 'Threat / aggressive expansion', value: threatPenalty });
 }
 const coal = g.diplomacy?.coalitions?.[actor];
 if (coal && coal.expires > (g.turn || 0) && coal.members?.includes(target)) {
  factors.push({ label: 'Member of coalition against us', value: -35 });
 }

 // 4. Same vs hostile faith
 const myFaith = getRealmFaith(g, actor);
 const theirFaith = getRealmFaith(g, target);
 if (myFaith && theirFaith) {
  const myFam = resolveFaithFamily(g, myFaith);
  const theirFam = resolveFaithFamily(g, theirFaith);
  let faithVal = 0;
  if (myFaith === theirFaith) faithVal = isAlliance ? 12 : 8;
  else if (myFam && myFam === theirFam) faithVal = isAlliance ? 2 : 4;
  else faithVal = isAlliance ? -26 : -18;
  if (myFam !== theirFam && rTarget?.traits?.includes('zealous')) faithVal -= 12;
  else if (myFaith === theirFaith && rTarget?.traits?.includes('zealous')) faithVal += 5;
  factors.push({ label: myFaith === theirFaith ? 'Same faith' : myFam === theirFam ? 'Kindred faith' : 'Different faith', value: faithVal });
 }

 // 5. Dynastic marriage / NAP pact bonus
 if (hasMarriageTie(g, actor, target)) {
  factors.push({ label: 'Dynastic marriage tie', value: isAlliance ? 22 : 14 });
 }
 if (isAlliance && (g.diplomacy?.pacts?.[pair(actor, target)]?.until || 0) > (g.turn || 0)) {
  factors.push({ label: 'Existing non-aggression pact', value: 10 });
 }

 // 6. Active war need vs rival conflict
 const targetWars = Object.values(g.conflict?.wars || {}).filter(w => w.status === 'active' && [w.attacker, w.defender].includes(target));
 const actorWars = Object.values(g.conflict?.wars || {}).filter(w => w.status === 'active' && [w.attacker, w.defender].includes(actor));
 if (targetWars.length > 0) {
  const fightingAllied = targetWars.some(w => {
   const enemy = w.attacker === target ? w.defender : w.attacker;
   return ['alliance', 'marriage'].includes(f.treaties?.[enemy]);
  });
  if (fightingAllied) factors.push({ label: isAlliance ? 'At war with our ally' : 'Conflict with partner ally', value: isAlliance ? -45 : -10 });
  else if (isAlliance && theirRel >= 0) factors.push({ label: 'Needs military allies in active war', value: 10 });
 }
 const fightingTargetsAlly = actorWars.some(w => {
  const enemy = w.attacker === actor ? w.defender : w.attacker;
  return ['alliance', 'marriage'].includes(o.treaties?.[enemy]);
 });
 if (fightingTargetsAlly) {
  factors.push({ label: isAlliance ? 'Attacking their ally' : 'Aggressive war against partner ally', value: isAlliance ? -45 : -12 });
 }
 // Common active war enemy
 if (
  actorWars.some(aw => {
   const ae = aw.attacker === actor ? aw.defender : aw.attacker;
   return targetWars.some(tw => (tw.attacker === target ? tw.defender : tw.attacker) === ae);
  })
 ) {
  factors.push({ label: 'Common enemy at war', value: 16 });
 }

 // 7. Diplomatic trait modifiers
 let traitScore = 0;
 const tTraits = rTarget?.traits || [];
 if (tTraits.includes('gregarious')) traitScore += 6;
 if (tTraits.includes('generous')) traitScore += 5;
 if (tTraits.includes('just')) traitScore += 4;
 if (tTraits.includes('cautious')) traitScore += isAlliance ? -8 : 6;
 if (tTraits.includes('reserved')) traitScore -= 6;
 if (tTraits.includes('deceitful') || tTraits.includes('arbitrary')) traitScore -= 8;
 if (tTraits.includes('ambitious') && isAlliance) traitScore -= 6;
 if (rActor) {
  const dip = num(rActor.skills?.diplomacy ?? 2);
  traitScore += (dip - 2) * 3;
  if (rActor.congenital?.includes('attractive')) traitScore += 4;
  if (rActor.congenital?.includes('genius')) traitScore += 3;
 }
 if (traitScore !== 0) {
  factors.push({ label: 'Ruler diplomacy & traits', value: traitScore });
 }

 // 8. Bordering / distance concern
 const borders = realmsBorder(g, actor, target, world);
 const cA = findRealmCoords(g, actor, world);
 const cB = findRealmCoords(g, target, world);
 if (borders) {
  factors.push({ label: 'Shared strategic border', value: isAlliance ? 8 : 6 });
 } else if (cA && cB) {
  const dx = Math.min(Math.abs(cA[0] - cB[0]), 360 - Math.abs(cA[0] - cB[0])) * Math.cos(((cA[1] + cB[1]) * Math.PI) / 360);
  const dist = Math.hypot(dx, cA[1] - cB[1]);
  let distScore = 0;
  if (dist > 45) distScore = isAlliance ? -28 : -20;
  else if (dist > 25) distScore = isAlliance ? -16 : -10;
  else if (dist <= 12) distScore = isAlliance ? 5 : 4;
  if (distScore !== 0) {
   factors.push({ label: distScore < 0 ? 'Distant realm' : 'Regional proximity', value: distScore });
  }
 } else if (f.continent && o.continent && f.continent !== o.continent) {
  factors.push({ label: 'Distant continent', value: isAlliance ? -22 : -15 });
 }

 // 9. Active favor diplomatic nudge
 const d = ensureDeepSystems(g);
 const favKey = actor + ':' + target;
 const hasNudge =
  opts.useFavor ||
  (d?.diplomaticFavors?.[favKey] && d.diplomaticFavors[favKey].until >= (g.turn || 0)) ||
  (rActor && rTarget && hasActiveFavor(g, rActor.id, rTarget.id));
 if (opts.useFavor && rActor && rTarget && hasActiveFavor(g, rActor.id, rTarget.id)) {
  factors.push({ label: 'Called-in favor', value: 25 });
 } else if (d?.diplomaticFavors?.[favKey]?.until >= (g.turn || 0)) {
  factors.push({ label: 'Political favor owed', value: 25 });
 } else if (hasNudge && opts.includePotentialFavor) {
  factors.push({ label: 'Favor available', value: 25 });
 }

 const score = factors.reduce((s, x) => s + x.value, 0);
 const accepted = score >= threshold;
 const negatives = factors
  .filter(x => x.value < 0)
  .sort((a, b) => a.value - b.value)
  .slice(0, 3)
  .map(x => `${x.label} (${x.value})`)
  .join(', ');
 const reason = accepted
  ? `${o.name} accepts (${score}/${threshold}).`
  : `${o.name} declines (${score}/${threshold} needed)${negatives ? ': ' + negatives : ''}.`;

 return { score, threshold, accepted, reason, factors };
}

// ============================================================================
// 2. 316 LIVING INDEPENDENT REGIONAL POLITIES
// ============================================================================

const IND_NAMES = {
 Europe: ['Aldhelm', 'Beatrice', 'Conrad', 'Dietrich', 'Elsa', 'Fulk', 'Gerhard', 'Helena', 'Ivar', 'Johanna'],
 Asia: ['Bahadur', 'Chandra', 'Devika', 'Farhad', 'Gauri', 'Harun', 'Indra', 'Jafar', 'Kiran', 'Leila'],
 Africa: ['Abubakar', 'Binta', 'Chidi', 'Djeneba', 'Fasil', 'Hawa', 'Ismail', 'Khadija', 'Mansa', 'Nadia'],
 'North America': ['Acamapichtli', 'Citali', 'Hiawatha', 'Izel', 'Kaya', 'Metztli', 'Nokomis', 'Tecuani'],
 'South America': ['Amaru', 'Chaska', 'Huayna', 'Inti', 'Killa', 'Manco', 'Nayra', 'Tupaq'],
 Oceania: ['Aroha', 'Hemi', 'Kiri', 'Manaia', 'Moana', 'Rangi', 'Tama', 'Whetu']
};

const IND_TITLES = {
 Europe: 'Free Lord',
 Asia: 'Regional Chief',
 Africa: 'Elder Ruler',
 'North America': 'Council Chief',
 'South America': 'Cacique',
 Oceania: 'Rangatira'
};

const PERSONALITY_TRAITS = [
 'ambitious', 'content', 'just', 'arbitrary', 'generous', 'greedy',
 'brave', 'cautious', 'diligent', 'indolent', 'honest', 'deceitful',
 'patient', 'wrathful', 'gregarious', 'reserved', 'zealous'
];

function createPolityRuler(g, pid, wp, continent, faith, culture, ageOffset = 0, gen = 1) {
 const seed = hashStr(`${pid}:${gen}:${wp?.name || pid}`);
 const rawRegion = (wp?.regionName || wp?.historicalPolity || wp?.name || pid).replace(/\s*·\s*\d+$/, '');
 const dynasty = `House of ${rawRegion}`;
 const age = ageOffset || (24 + (seed % 32));
 const sex = (seed & 1) ? 'female' : 'male';
 const t1 = PERSONALITY_TRAITS[seed % PERSONALITY_TRAITS.length];
 const t2 = PERSONALITY_TRAITS[(seed >>> 6) % PERSONALITY_TRAITS.length];
 const traits = t1 === t2 ? [t1] : [t1, t2];
 const ruler = {
  id: `ind_${pid}_${gen}`,
  name: allocateCharacterName(g, {
   continent,
   culture,
   faith,
   place: rawRegion,
   withSeat: gen === 1,
   sex,
   seed: `ind:${pid}:${gen}`
  }),
  dynasty,
  age,
  sex,
  traits,
  skills: {
   diplomacy: 1 + (seed % 5),
   martial: 1 + ((seed >>> 4) % 5),
   stewardship: 1 + ((seed >>> 8) % 5),
   intrigue: 1 + ((seed >>> 12) % 5),
   learning: 1 + ((seed >>> 16) % 5)
  },
  culture,
  faith
 };
 ensureCharacterGenetics(ruler, [], `${pid}:${gen}`);
 return ruler;
}

function makeIndependentPolity(g, p, wp) {
 const pid = p.id;
 const seed = hashStr(`polity:${pid}`);
 const continent = wp?.continent || p.continent || 'Europe';
 const rawLabel = (wp?.historicalPolity || wp?.name || p.name || pid).replace(/\s*·\s*\d+$/, '');
 const faith = g.civic?.provinces?.[pid]?.faith || wp?.faith || 'Local traditions';
 const culture = g.civic?.provinces?.[pid]?.culture || wp?.culture || rawLabel;
 const ruler = createPolityRuler(g, pid, wp, continent, faith, culture, 0, 1);
 const dev = Math.max(1, num(p.development || wp?.development || 2));
 const pop = Math.max(4, num(p.population || wp?.population || 10));
 const garrison = 45 + dev * 14 + (p.buildings?.fort || (wp?.fort ? 1 : 0)) * 45;
 const levies = Math.round(50 + pop * 1.4 + dev * 10);
 const treasury = 65 + (seed % 140) + dev * 12;
 return {
  provinceId: pid,
  name: wp?.historicalPolity || `${rawLabel} Polity`,
  title: IND_TITLES[continent] || 'Chief',
  ruler,
  dynasty: ruler.dynasty,
  culture,
  faith,
  continent,
  age: ruler.age,
  traits: [...ruler.traits],
  opinion: (seed % 21) - 10,
  opinions: {},
  garrison,
  levies,
  treasury,
  stance: 'autonomous',
  suzerain: null,
  tributeUntil: 0,
  tradeCompactWith: null,
  tradeUntil: 0,
  raidCooldownUntil: 0,
  missionaryCooldownUntil: 0,
  conversionProgress: 0,
  generation: 1
 };
}

export function initIndependentPolities(g, world = null) {
 g.independentPolities ??= {};
 const wpMap = new Map((world?.provinces || []).map(wp => [wp.id, wp]));
 for (const [pid, p] of Object.entries(g.provinces || {})) {
  if (p.owner === 'independent') {
   if (!g.independentPolities[pid]) {
    g.independentPolities[pid] = makeIndependentPolity(g, p, wpMap.get(pid));
   } else {
    const pol = g.independentPolities[pid];
    pol.opinions ??= {};
    if (g.player && pol.opinions[g.player] === undefined) pol.opinions[g.player] = num(pol.opinion);
    pol.opinion = pol.opinions[g.player] ?? num(pol.opinion);
   }
  } else if (g.independentPolities[pid]) {
   delete g.independentPolities[pid];
  }
 }
 return g.independentPolities;
}

export function getIndependentPolity(g, pid) {
 return g.independentPolities?.[pid] || null;
}

export function independentPolityTradeIncome(g, realm) {
 let total = 0;
 for (const pol of Object.values(g.independentPolities || {})) {
  if (pol.tradeCompactWith === realm && (pol.tradeUntil || 0) > (g.turn || 0)) {
   const dev = Math.max(1, num(g.provinces?.[pol.provinceId]?.development || 2));
   total += Math.max(4, Math.round(3 + dev * 1.1));
  }
 }
 return total;
}

export function tickIndependentPolities(g, world = null) {
 const d = ensureDeepSystems(g);
 if (d.lastIndependentTick === g.turn) return g.independentPolities;
 d.lastIndependentTick = g.turn;

 const wpMap = world?.provinces?.length ? new Map(world.provinces.map(wp => [wp.id, wp])) : null;

 // Sync creation/removal with current province ownership
 for (const [pid, p] of Object.entries(g.provinces || {})) {
  if (p.owner === 'independent' && !g.independentPolities[pid]) {
   g.independentPolities[pid] = makeIndependentPolity(g, p, wpMap?.get(pid));
  } else if (p.owner !== 'independent' && g.independentPolities[pid]) {
   delete g.independentPolities[pid];
  }
 }

 const annual = (g.turn || 0) > 0 && (g.turn % 12) === 0;
 const quarterly = (g.turn % 3) === 0;

 for (const [pid, pol] of Object.entries(g.independentPolities)) {
  const p = g.provinces?.[pid];
  if (!p) {
   delete g.independentPolities[pid];
   continue;
  }

  // Expire treaties
  if (pol.suzerain && ((pol.tributeUntil || 0) <= g.turn || !g.factions?.[pol.suzerain] || !ownedProvinces(g, pol.suzerain).length)) {
   pol.suzerain = null;
   pol.tributeUntil = 0;
   if (pol.stance === 'tributary') pol.stance = 'autonomous';
  }
  if (pol.tradeCompactWith && ((pol.tradeUntil || 0) <= g.turn || !g.factions?.[pol.tradeCompactWith])) {
   pol.tradeCompactWith = null;
   pol.tradeUntil = 0;
  }

  // Monthly tribute transfer
  if (pol.suzerain && g.factions[pol.suzerain]) {
   const due = Math.min(Math.max(0, Math.floor(pol.treasury * 0.1)), Math.max(4, Math.round(num(p.development) * 1.4)));
   if (due > 0) {
    pol.treasury = Math.max(0, pol.treasury - due);
    g.factions[pol.suzerain].treasury += due;
   }
  }

  // Monthly trade compact revenue
  if (pol.tradeCompactWith && g.factions[pol.tradeCompactWith]) {
   const gain = Math.max(4, Math.round(3 + num(p.development) * 1.1));
   g.factions[pol.tradeCompactWith].treasury += gain;
   pol.treasury += 2;
  }

  // Quarterly recovery & stance check
  if (quarterly) {
   const baseGarrison = 45 + num(p.development) * 14 + (p.buildings?.fort || 0) * 45;
   const baseLevies = Math.round(50 + num(p.population) * 1.4 + num(p.development) * 10);
   pol.garrison = Math.min(baseGarrison, pol.garrison + 6);
   pol.levies = Math.min(baseLevies, pol.levies + 8);
   pol.treasury = Math.min(600, pol.treasury + 4 + Math.round(num(p.development) * 0.8));

   const op = pol.opinions?.[g.player] ?? num(pol.opinion);
   pol.opinion = op;
   if (pol.suzerain) {
    pol.stance = 'tributary';
   } else if (op <= -30 || (pol.raidCooldownUntil || 0) > g.turn) {
    pol.stance = 'hostile';
   } else if (op < 15 && num(g.diplomacy?.threat?.[g.player]) >= 25) {
    pol.stance = 'threatened';
   } else {
    pol.stance = 'autonomous';
   }
  }

  // Annual aging & deterministic succession
  if (annual && pol.ruler) {
   pol.ruler.age++;
   pol.age = pol.ruler.age;
   const dieChance = pol.ruler.age >= 85 ? 0.5 : pol.ruler.age >= 65 ? 0.08 : 0.01;
   const roll = (hashStr(`ind_age:${pid}:${g.turn}`) % 1000) / 1000;
   if (roll < dieChance) {
    pol.generation = (pol.generation || 1) + 1;
    const wp = wpMap?.get(pid);
    pol.ruler = createPolityRuler(g, pid, wp, pol.continent, pol.faith, pol.culture, 20 + (hashStr(pid + g.turn) % 14), pol.generation);
    pol.age = pol.ruler.age;
    pol.traits = [...pol.ruler.traits];
    pol.dynasty = pol.ruler.dynasty;
   }
  }
 }

 return g.independentPolities;
}

export function polityAction(g, pid, action, opts = {}) {
 const d = ensureDeepSystems(g);
 initIndependentPolities(g, opts.world || null);
 const actor = opts.actor || g.player;
 const p = g.provinces?.[pid];
 const pol = g.independentPolities?.[pid];
 const f = g.factions?.[actor];
 if (!p || p.owner !== 'independent' || !pol) return no('Select an active independent regional polity.');
 if (!f || actor === 'independent') return no('Invalid sovereign realm.');
 const r = getRuler(g, actor);
 const myStr = realmPower(g, actor);
 const op = pol.opinions?.[actor] ?? num(pol.opinion);
 const setOp = delta => {
  pol.opinions ??= {};
  const cur = pol.opinions[actor] ?? num(pol.opinion);
  pol.opinions[actor] = clamp(cur + delta, -100, 100);
  if (actor === g.player) pol.opinion = pol.opinions[actor];
 };

 if (action === 'subjugate') {
  const isTrib = pol.suzerain === actor && (pol.tributeUntil || 0) > (g.turn || 0);
  const goldCost = isTrib ? 60 : 120;
  const prestigeCost = isTrib ? 5 : 15;
  if (f.treasury < goldCost) return no(`Need ${goldCost} gold to subjugate ${pol.name}.`);
  if ((f.prestige || 0) < prestigeCost) return no(`Need ${prestigeCost} prestige to subjugate ${pol.name}.`);
  const requiredStr = isTrib ? 0 : Math.round((pol.garrison + pol.levies) * 0.75);
  if (myStr < requiredStr && !opts.force) {
   return no(`Need at least ${requiredStr} field troops to compel ${pol.name}'s submission.`);
  }
  f.treasury -= goldCost;
  f.prestige = Math.max(0, (f.prestige || 0) - prestigeCost);
  p.owner = actor;
  p.unrest = clamp((p.unrest || 0) + (isTrib ? 5 : 14), 0, 100);
  // Reconcile holdings and titles cleanly without touching forbidden modules
  if (g.politics?.realms?.[actor] && g.politics.holdings) {
   const lordId = getRulerId(g, actor);
   g.politics.holdings[pid] = { realm: actor, lord: lordId, loyalty: isTrib ? 75 : 55, tax: 1, levy: 1, autonomy: 1, wealth: Math.round(pol.treasury * 0.4), concessionUntil: 0 };
   if (g.feudal?.titles && g.feudal?.districts) {
    const dist = Object.values(g.feudal.districts).find(dx => dx.members?.includes(pid));
    g.feudal.titles['c:' + pid] = {
     id: 'c:' + pid, tier: 'province', feudalTier: 'county', rank: 2,
     realm: actor, deJureRealm: dist?.deJureRealm || actor, deJureParent: dist?.id || null,
     deFactoLiege: null, holder: lordId, parent: 'k:' + actor, name: pid, province: pid
    };
   }
  }
  delete g.independentPolities[pid];
  g.diplomacy ??= { version: 1, pacts: {}, guarantees: {}, aid: {}, passage: {}, tributes: {}, hostages: {}, coalitions: {}, threat: {}, history: [], lastTick: -1 };
  g.diplomacy.threat[actor] = clamp((g.diplomacy.threat[actor] || 0) + (isTrib ? 2 : 4), 0, 100);
  f.prestige += 10;
  addLog(g, actor, `${pol.name} (${pid}) was subjugated into ${f.name}.`);
  return ok(`${pol.name} subjugated and incorporated into the realm.`, { annexed: true, provinceId: pid });
 }

 if (action === 'protectorate') {
  if (pol.suzerain === actor && (pol.tributeUntil || 0) > (g.turn || 0)) {
   return no(`${pol.name} is already your tributary protectorate.`);
  }
  if (f.treasury < 75) return no('Requires 75 gold to establish a protectorate.');
  const reqStr = Math.round((pol.garrison + pol.levies) * 0.5);
  if (myStr < reqStr && op < 20 && !opts.force) {
   return no(`Requires stronger military presence (${reqStr} troops) or +20 relations.`);
  }
  f.treasury -= 75;
  pol.suzerain = actor;
  pol.tributeUntil = (g.turn || 0) + 60;
  pol.stance = 'tributary';
  setOp(10);
  f.prestige = (f.prestige || 0) + 6;
  addLog(g, actor, `${pol.name} accepted protectorate status under ${f.name}.`);
  return ok(`${pol.name} is now a tributary protectorate for 5 years.`, { polity: pol });
 }

 if (action === 'trade_compact') {
  if (pol.tradeCompactWith === actor && (pol.tradeUntil || 0) > (g.turn || 0)) {
   return no('Trade compact is already active.');
  }
  if (pol.stance === 'hostile' || op < -35) {
   return no(`${pol.name} is hostile and refuses a trade compact.`);
  }
  if (f.treasury < 60) return no('Requires 60 gold to charter a trade compact.');
  f.treasury -= 60;
  pol.tradeCompactWith = actor;
  pol.tradeUntil = (g.turn || 0) + 48;
  setOp(15);
  p.development = clamp((p.development || 1) + 0.5, 1, 20);
  adjustProvinceProsperity(g, pid, 25);
  addLog(g, actor, `Signed a trade compact with ${pol.name}.`);
  return ok(`Trade compact signed with ${pol.name}.`, { polity: pol });
 }

 if (action === 'raid') {
  if ((pol.raidCooldownUntil || 0) > (g.turn || 0)) {
   return no(`Wait until turn ${pol.raidCooldownUntil} before raiding ${pol.name} again.`);
  }
  if (pol.suzerain === actor) return no('Cannot raid your own tributary protectorate.');
  const army = Object.values(g.armies || {}).find(a => a.owner === actor && !a.contingent && num(a.infantry) + num(a.archers) + num(a.cavalry) >= 40);
  if (!army && !opts.force) return no('Requires a field army of at least 40 troops.');
  const aStr = army ? num(army.infantry) + num(army.archers) + num(army.cavalry) : Math.max(100, myStr);
  const def = pol.garrison + Math.round(pol.levies * 0.5);
  const won = aStr >= def * 0.65 || opts.force;
  setOp(-30);
  pol.stance = 'hostile';
  if (won) {
   const loot = Math.min(pol.treasury, 30 + Math.round(num(p.development) * 6));
   pol.treasury = Math.max(0, pol.treasury - loot);
   f.treasury += loot;
   f.prestige = (f.prestige || 0) + 5;
   pol.garrison = Math.max(15, Math.round(pol.garrison * 0.7));
   pol.levies = Math.max(20, Math.round(pol.levies * 0.7));
   pol.raidCooldownUntil = (g.turn || 0) + 12;
   p.unrest = clamp((p.unrest || 0) + 10, 0, 100);
   adjustProvinceProsperity(g, pid, -35);
   addLog(g, actor, `Raided ${pol.name}, seizing ${loot} gold.`);
   return ok(`Raid succeeded! Looted ${loot} gold.`, { loot, polity: pol });
  }
  if (army) army.infantry = Math.max(0, Math.round(army.infantry * 0.92));
  f.prestige = Math.max(0, (f.prestige || 0) - 4);
  pol.raidCooldownUntil = (g.turn || 0) + 6;
  return no(`Raid against ${pol.name} was repulsed by local defenders.`);
 }

 if (action === 'missionary') {
  if ((pol.missionaryCooldownUntil || 0) > (g.turn || 0)) {
   return no(`Missionaries are already operating or on cooldown until turn ${pol.missionaryCooldownUntil}.`);
  }
  if (f.treasury < 50) return no('Requires 50 gold to sponsor missionaries.');
  const actorFaith = getRealmFaith(g, actor) || 'Court faith';
  if (pol.faith === actorFaith) return no(`${pol.name} already follows ${actorFaith}.`);
  f.treasury -= 50;
  pol.missionaryCooldownUntil = (g.turn || 0) + 6;
  const learning = num(r?.skills?.learning || 2);
  pol.conversionProgress = (pol.conversionProgress || 0) + 45 + learning * 10;
  let converted = false;
  if (pol.conversionProgress >= 100 || opts.force) {
   converted = true;
   pol.faith = actorFaith;
   if (pol.ruler) pol.ruler.faith = actorFaith;
   if (g.civic?.provinces?.[pid]) g.civic.provinces[pid].faith = actorFaith;
   pol.conversionProgress = 0;
   setOp(14);
   if (r) r.piety = num(r.piety) + 10;
   f.piety = num(f.piety) + 10;
   adjustMoralAuthority(g, actorFaith, 2, `Converted ${pol.name}`);
   addLog(g, actor, `Missionaries converted ${pol.name} to ${actorFaith}.`);
  } else {
   setOp(pol.traits?.includes('zealous') ? -6 : 4);
   if (r) r.piety = num(r.piety) + 4;
   addLog(g, actor, `Dispatched missionaries to ${pol.name} (${pol.conversionProgress}% progress).`);
  }
  return ok(converted ? `${pol.name} converted to ${actorFaith}!` : `Missionary work advanced (${pol.conversionProgress}%).`, {
   converted,
   progress: pol.conversionProgress,
   polity: pol
  });
 }

 return no('Unknown independent polity action.');
}

// ============================================================================
// 3. CHARACTER GENETICS, CONGENITAL TRAITS, DNA & AGE-16 EDUCATION
// ============================================================================

export const CONGENITAL_TRAITS = Object.freeze({
 genius: { id: 'genius', name: 'Genius', group: 'intellect', positive: true, stats: { diplomacy: 2, martial: 2, stewardship: 2, intrigue: 2, learning: 2 }, prestigeMonthly: 0.5, pietyMonthly: 0.1, opinionMod: 5 },
 quick: { id: 'quick', name: 'Quick', group: 'intellect', positive: true, stats: { diplomacy: 1, martial: 1, stewardship: 1, intrigue: 1, learning: 1 }, prestigeMonthly: 0.25, pietyMonthly: 0, opinionMod: 3 },
 imbecile: { id: 'imbecile', name: 'Imbecile', group: 'intellect', positive: false, stats: { diplomacy: -2, martial: -2, stewardship: -2, intrigue: -2, learning: -2 }, prestigeMonthly: -0.3, pietyMonthly: 0, opinionMod: -15 },
 strong: { id: 'strong', name: 'Strong', group: 'physique', positive: true, stats: { martial: 2, diplomacy: 1 }, prestigeMonthly: 0.3, pietyMonthly: 0, opinionMod: 5 },
 weak: { id: 'weak', name: 'Weak', group: 'physique', positive: false, stats: { martial: -1 }, prestigeMonthly: -0.1, pietyMonthly: 0, opinionMod: -5 },
 attractive: { id: 'attractive', name: 'Attractive', group: 'beauty', positive: true, stats: { diplomacy: 2, intrigue: 1 }, prestigeMonthly: 0.3, pietyMonthly: 0, opinionMod: 10 },
 ugly: { id: 'ugly', name: 'Ugly', group: 'beauty', positive: false, stats: { diplomacy: -1 }, prestigeMonthly: -0.1, pietyMonthly: 0, opinionMod: -10 },
 clubfooted: { id: 'clubfooted', name: 'Clubfooted', group: 'limb', positive: false, stats: { martial: -1 }, prestigeMonthly: -0.05, pietyMonthly: 0, opinionMod: -5 },
 lisp: { id: 'lisp', name: 'Lisp', group: 'speech', positive: false, stats: { diplomacy: -1 }, prestigeMonthly: 0, pietyMonthly: 0, opinionMod: -5 }
});

export const CHILDHOOD_FOCUSES = Object.freeze({
 struggle: { id: 'struggle', name: 'Struggle', skill: 'martial', desc: 'Martial drills, resilience, and tactical training.' },
 thrift: { id: 'thrift', name: 'Thrift', skill: 'stewardship', desc: 'Estate accounts, commerce, and prudent administration.' },
 humility: { id: 'humility', name: 'Humility', skill: 'intrigue', desc: 'Discretion, patience, and court observation.' },
 etiquette: { id: 'etiquette', name: 'Etiquette', skill: 'diplomacy', desc: 'Court grace, persuasion, and noble bearing.' },
 faith: { id: 'faith', name: 'Faith', skill: 'learning', desc: 'Scripture, scholarship, and moral discipline.' }
});

export const EDUCATION_TRAITS = Object.freeze({
 // Martial
 misguided_warrior: { id: 'misguided_warrior', name: 'Misguided Warrior', track: 'martial', tier: 1, stats: { martial: 1 }, prestigeMonthly: 0.1, pietyMonthly: 0, opinionMod: 0 },
 tough_soldier: { id: 'tough_soldier', name: 'Tough Soldier', track: 'martial', tier: 2, stats: { martial: 2 }, prestigeMonthly: 0.2, pietyMonthly: 0, opinionMod: 2 },
 skilled_tactician: { id: 'skilled_tactician', name: 'Skilled Tactician', track: 'martial', tier: 3, stats: { martial: 3, diplomacy: 1 }, prestigeMonthly: 0.35, pietyMonthly: 0, opinionMod: 4 },
 brilliant_strategist: { id: 'brilliant_strategist', name: 'Brilliant Strategist', track: 'martial', tier: 4, stats: { martial: 4, stewardship: 1 }, prestigeMonthly: 0.6, pietyMonthly: 0, opinionMod: 6 },
 // Stewardship
 indulgent_wastrel: { id: 'indulgent_wastrel', name: 'Indulgent Wastrel', track: 'stewardship', tier: 1, stats: { stewardship: 1 }, prestigeMonthly: 0.05, pietyMonthly: 0, opinionMod: 0 },
 thrifty_clerk: { id: 'thrifty_clerk', name: 'Thrifty Clerk', track: 'stewardship', tier: 2, stats: { stewardship: 2 }, prestigeMonthly: 0.15, pietyMonthly: 0, opinionMod: 2 },
 fortune_builder: { id: 'fortune_builder', name: 'Fortune Builder', track: 'stewardship', tier: 3, stats: { stewardship: 3, diplomacy: 1 }, prestigeMonthly: 0.3, pietyMonthly: 0, opinionMod: 4 },
 midas_touched: { id: 'midas_touched', name: 'Midas Touched', track: 'stewardship', tier: 4, stats: { stewardship: 4, learning: 1 }, prestigeMonthly: 0.5, pietyMonthly: 0, opinionMod: 6 },
 // Diplomacy
 naive_appeaser: { id: 'naive_appeaser', name: 'Naive Appeaser', track: 'diplomacy', tier: 1, stats: { diplomacy: 1 }, prestigeMonthly: 0.1, pietyMonthly: 0, opinionMod: 2 },
 underhanded_rogue: { id: 'underhanded_rogue', name: 'Underhanded Rogue', track: 'diplomacy', tier: 2, stats: { diplomacy: 2, intrigue: 1 }, prestigeMonthly: 0.2, pietyMonthly: 0, opinionMod: 4 },
 charismatic_negotiator: { id: 'charismatic_negotiator', name: 'Charismatic Negotiator', track: 'diplomacy', tier: 3, stats: { diplomacy: 3 }, prestigeMonthly: 0.35, pietyMonthly: 0, opinionMod: 6 },
 grey_eminence: { id: 'grey_eminence', name: 'Grey Eminence', track: 'diplomacy', tier: 4, stats: { diplomacy: 4, intrigue: 1 }, prestigeMonthly: 0.55, pietyMonthly: 0, opinionMod: 10 },
 // Intrigue
 amateurish_plotter: { id: 'amateurish_plotter', name: 'Amateurish Plotter', track: 'intrigue', tier: 1, stats: { intrigue: 1 }, prestigeMonthly: 0, pietyMonthly: 0, opinionMod: -2 },
 flamboyant_schemer: { id: 'flamboyant_schemer', name: 'Flamboyant Schemer', track: 'intrigue', tier: 2, stats: { intrigue: 2 }, prestigeMonthly: 0.1, pietyMonthly: 0, opinionMod: 0 },
 intricate_webweaver: { id: 'intricate_webweaver', name: 'Intricate Webweaver', track: 'intrigue', tier: 3, stats: { intrigue: 3, diplomacy: 1 }, prestigeMonthly: 0.25, pietyMonthly: 0, opinionMod: 2 },
 elusive_shadow: { id: 'elusive_shadow', name: 'Elusive Shadow', track: 'intrigue', tier: 4, stats: { intrigue: 4, martial: 1 }, prestigeMonthly: 0.4, pietyMonthly: 0, opinionMod: 4 },
 // Learning
 detached_priest: { id: 'detached_priest', name: 'Detached Priest', track: 'learning', tier: 1, stats: { learning: 1 }, prestigeMonthly: 0.05, pietyMonthly: 0.2, opinionMod: 1 },
 dutiful_cleric: { id: 'dutiful_cleric', name: 'Dutiful Cleric', track: 'learning', tier: 2, stats: { learning: 2 }, prestigeMonthly: 0.1, pietyMonthly: 0.4, opinionMod: 3 },
 scholarly_theologian: { id: 'scholarly_theologian', name: 'Scholarly Theologian', track: 'learning', tier: 3, stats: { learning: 3, diplomacy: 1 }, prestigeMonthly: 0.2, pietyMonthly: 0.6, opinionMod: 5 },
 mastermind_theologian: { id: 'mastermind_theologian', name: 'Mastermind Theologian', track: 'learning', tier: 4, stats: { learning: 4, stewardship: 1 }, prestigeMonthly: 0.35, pietyMonthly: 0.9, opinionMod: 8 }
});

const EDUCATION_TRACKS = {
 martial: ['misguided_warrior', 'tough_soldier', 'skilled_tactician', 'brilliant_strategist'],
 stewardship: ['indulgent_wastrel', 'thrifty_clerk', 'fortune_builder', 'midas_touched'],
 diplomacy: ['naive_appeaser', 'underhanded_rogue', 'charismatic_negotiator', 'grey_eminence'],
 intrigue: ['amateurish_plotter', 'flamboyant_schemer', 'intricate_webweaver', 'elusive_shadow'],
 learning: ['detached_priest', 'dutiful_cleric', 'scholarly_theologian', 'mastermind_theologian']
};

function generateDna(parents, seedVal) {
 const p0 = parents?.[0]?.dna;
 const p1 = parents?.[1]?.dna;
 if (p0 && p1 && p0.length === 16 && p1.length === 16) {
  let out = '';
  for (let i = 0; i < 16; i++) {
   const h = hashStr(`${seedVal}:dna:${i}`);
   const pickFrom = (h & 3) === 0 ? (h >>> 2).toString(16)[0] : (h & 1) ? p0[i] : p1[i];
   out += pickFrom;
  }
  return out;
 }
 const h1 = hashStr(`${seedVal}:dnaA`).toString(16).padStart(8, '0');
 const h2 = hashStr(`${seedVal}:dnaB`).toString(16).padStart(8, '0');
 return (h1 + h2).slice(0, 16);
}

function applyTraitStatDelta(person, traitDef, sign = 1) {
 if (!person?.skills || !traitDef?.stats) return;
 for (const [sk, val] of Object.entries(traitDef.stats)) {
  if (!Object.hasOwn(person.skills, sk)) person.skills[sk] = 1;
  person.skills[sk] = clamp(num(person.skills[sk]) + val * sign, 1, 10);
 }
}

export function ensureCharacterGenetics(person, parents = [], seed = null) {
 if (!person || typeof person !== 'object') return person;
 const baseSeed = seed ?? `${person.id || 'char'}:${person.name || ''}:${person.house || ''}`;
 const parList = Array.isArray(parents) ? parents.filter(Boolean) : [];
 if (!person.dna) {
  person.dna = generateDna(parList, baseSeed);
 }

 if (!Array.isArray(person.congenital)) {
  const inherited = [];
  const groups = new Set();
  const tryAdd = traitId => {
   const def = CONGENITAL_TRAITS[traitId];
   if (!def || groups.has(def.group)) return false;
   groups.add(def.group);
   inherited.push(traitId);
   return true;
  };

  // Inheritance from parents
  const parentTraits = parList.flatMap(par => par.congenital || []);
  for (const tId of parentTraits) {
   const h = hashStr(`${baseSeed}:inherit:${tId}`) % 100;
   // Higher inheritance chance when both parents share it, strong single-parent chance too
   const both = parList.length >= 2 && parList.every(par => (par.congenital || []).includes(tId));
   if (h < (both ? 80 : 45)) {
    tryAdd(tId);
   } else if (tId === 'genius' && h < 70) {
    tryAdd('quick');
   }
  }

  // Deterministic rare spontaneous traits
  if (inherited.length === 0) {
   const roll = hashStr(`${baseSeed}:spont`) % 1000;
   if (roll < 15) tryAdd('quick');
   else if (roll < 22) tryAdd('genius');
   else if (roll < 42) tryAdd('strong');
   else if (roll < 60) tryAdd('attractive');
   else if (roll < 68) tryAdd('weak');
   else if (roll < 74) tryAdd('ugly');
   else if (roll < 80) tryAdd('clubfooted');
   else if (roll < 86) tryAdd('lisp');
   else if (roll < 90) tryAdd('imbecile');
  }

  person.congenital = inherited;
  // Apply congenital skill modifiers once
  if (!person._congenitalApplied && person.skills) {
   for (const tId of person.congenital) {
    applyTraitStatDelta(person, CONGENITAL_TRAITS[tId], 1);
   }
   person._congenitalApplied = true;
  }
 }

 if (!person.childhoodFocus) {
  const focuses = Object.keys(CHILDHOOD_FOCUSES);
  person.childhoodFocus = focuses[hashStr(`${baseSeed}:focus`) % focuses.length];
 }

 if (person.guardianId === undefined) {
  person.guardianId = person.civic?.guardian || parList[0]?.id || null;
 }

 if (person.educationTrait === undefined) {
  if ((person.age || 0) >= 16) {
   // Starter adults receive an education trait matching their highest skill without inflating baseline skills
   const skills = person.skills || { diplomacy: 2, martial: 2, stewardship: 2, intrigue: 2, learning: 2 };
   const bestSkill = Object.keys(EDUCATION_TRACKS).sort(
    (a, b) => num(skills[b]) - num(skills[a]) || a.localeCompare(b)
   )[0];
   const val = num(skills[bestSkill] || 2);
   const tierIdx = clamp(Math.floor((val - 1) / 1.4), 0, 3);
   person.educationTrait = EDUCATION_TRACKS[bestSkill][tierIdx];
   person._educationApplied = true;
  } else {
   person.educationTrait = null;
  }
 }

 return person;
}

export function setChildhoodFocus(g, childId, focus, guardianId = null) {
 const child = g.politics?.people?.[childId];
 if (!child?.alive) return no('Select a living child.');
 if ((child.age || 0) >= 16) return no('Child has already completed education at age 16.');
 if (!Object.hasOwn(CHILDHOOD_FOCUSES, focus) && focus !== 'intrigue') {
  return no('Choose a valid childhood focus (struggle, thrift, humility, etiquette, faith).');
 }
 ensureCharacterGenetics(child, [], `${g.seed || 1450}:${child.id}`);
 child.childhoodFocus = focus;

 if (guardianId !== null && guardianId !== undefined) {
  const guardian = g.politics?.people?.[guardianId];
  if (!guardian?.alive || guardian.id === child.id || (guardian.age || 0) < 16) {
   return no('Select a living adult guardian.');
  }
  child.guardianId = guardian.id;
  if (child.civic) child.civic.guardian = guardian.id;
 }
 return ok(`Set ${child.name}'s childhood focus to ${focus}.`, {
  childId: child.id,
  focus: child.childhoodFocus,
  guardianId: child.guardianId
 });
}

export function completeChildEducation(g, child, guardian = null) {
 if (!child?.alive || (child.age || 0) < 16 || child.educationTrait) return null;
 ensureCharacterGenetics(child, [], `${g.seed || 1450}:${child.id}`);
 const gId = guardian?.id || child.guardianId || child.civic?.guardian;
 const gObj = guardian || (gId ? g.politics?.people?.[gId] : null);
 const focus = child.childhoodFocus || 'etiquette';

 let track = CHILDHOOD_FOCUSES[focus]?.skill || 'diplomacy';
 if (focus === 'humility') {
  if (gObj?.skills) {
   const top = Object.keys(EDUCATION_TRACKS).sort((a, b) => num(gObj.skills[b]) - num(gObj.skills[a]))[0];
   track = top || 'intrigue';
  } else {
   track = 'intrigue';
  }
 } else if (focus === 'intrigue') {
  track = 'intrigue';
 }

 const gSkill = num(gObj?.skills?.[track] ?? 2);
 let qualityScore = gSkill * 16 + num(child.civic?.education) * 1.5;
 if (child.congenital?.includes('genius')) qualityScore += 32;
 else if (child.congenital?.includes('quick')) qualityScore += 18;
 else if (child.congenital?.includes('imbecile')) qualityScore -= 35;
 if (child.traits?.includes('diligent')) qualityScore += 14;
 if (child.traits?.includes('indolent')) qualityScore -= 14;
 if (gObj?.traits?.includes('diligent')) qualityScore += 10;
 if (gObj?.congenital?.includes('genius') || gObj?.congenital?.includes('quick')) qualityScore += 10;
 qualityScore += hashStr(`edu:${child.id}:${g.turn || 0}`) % 18;

 const tierIdx = qualityScore >= 95 ? 3 : qualityScore >= 65 ? 2 : qualityScore >= 38 ? 1 : 0;
 const traitId = EDUCATION_TRACKS[track][tierIdx];
 child.educationTrait = traitId;
 if (!child._educationApplied) {
  applyTraitStatDelta(child, EDUCATION_TRAITS[traitId], 1);
  child._educationApplied = true;
 }
 child.memories ??= [];
 child.memories.push(`Completed education as ${EDUCATION_TRAITS[traitId].name} at age 16.`);
 if (child.memories.length > 40) child.memories = child.memories.slice(-40);
 return traitId;
}

export function characterGeneticModifiers(person) {
 const out = {
  stats: { diplomacy: 0, martial: 0, stewardship: 0, intrigue: 0, learning: 0 },
  prestigeMonthly: 0,
  pietyMonthly: 0,
  opinionMod: 0
 };
 if (!person) return out;
 for (const cid of person.congenital || []) {
  const def = CONGENITAL_TRAITS[cid];
  if (!def) continue;
  for (const [k, v] of Object.entries(def.stats || {})) out.stats[k] += v;
  out.prestigeMonthly += def.prestigeMonthly || 0;
  out.pietyMonthly += def.pietyMonthly || 0;
  out.opinionMod += def.opinionMod || 0;
 }
 if (person.educationTrait && EDUCATION_TRAITS[person.educationTrait]) {
  const ed = EDUCATION_TRAITS[person.educationTrait];
  for (const [k, v] of Object.entries(ed.stats || {})) out.stats[k] += v;
  out.prestigeMonthly += ed.prestigeMonthly || 0;
  out.pietyMonthly += ed.pietyMonthly || 0;
  out.opinionMod += ed.opinionMod || 0;
 }
 return out;
}

export function characterTraitOpinion(observer, target) {
 if (!target) return 0;
 const mod = characterGeneticModifiers(target);
 let bonus = mod.opinionMod;
 // Same education track affinity
 if (
  observer?.educationTrait &&
  target?.educationTrait &&
  EDUCATION_TRAITS[observer.educationTrait]?.track === EDUCATION_TRAITS[target.educationTrait]?.track
 ) {
  bonus += 5;
 }
 return bonus;
}

// ============================================================================
// 4. CONCLAVE FAVORS, GRANULAR OBLIGATION LAWS, VICEROYALTIES & MINOR TITLES
// ============================================================================

export function hasActiveFavor(g, holderId, debtorId) {
 const d = ensureDeepSystems(g);
 if (!d || !holderId || !debtorId) return null;
 const turn = g.turn || 0;
 return Object.values(d.favors).find(
  f => !f.used && f.holder === holderId && f.debtor === debtorId && (f.expires || 0) > turn
 ) || null;
}

export function oweFavor(g, holderId, debtorId, reason = 'political obligation', duration = 60) {
 const d = ensureDeepSystems(g);
 const holder = g.politics?.people?.[holderId];
 const debtor = g.politics?.people?.[debtorId];
 if (!holder?.alive || !debtor?.alive || holderId === debtorId) {
  return no('Both characters must be living and distinct.');
 }
 const id = `fav_${holderId}_${debtorId}_${g.turn || 0}_${Object.keys(d.favors).length + 1}`;
 const rec = {
  id,
  holder: holderId,
  debtor: debtorId,
  reason,
  created: g.turn || 0,
  expires: (g.turn || 0) + duration,
  used: false
 };
 d.favors[id] = rec;

 // Sync with existing council favor system if holder is sovereign of debtor's realm
 const realm = holder.realm;
 if (realm && g.politics?.realms?.[realm]?.ruler === holderId && debtor.realm === realm) {
  g.conflict ??= { next: 1, seed: 987123, lastTick: -1, factions: {}, schemes: {}, claims: {}, wars: {}, truces: {}, favors: {}, council: {}, history: [] };
  g.conflict.favors ??= {};
  const ck = realm + ':' + debtorId;
  g.conflict.favors[ck] = Math.max(g.conflict.favors[ck] || 0, rec.expires);
 }
 return ok(`${debtor.name} now owes a favor to ${holder.name}.`, { favor: rec });
}

export function callInFavor(g, holderId, debtorId, purpose = 'council_vote', target = null) {
 const d = ensureDeepSystems(g);
 const fav = hasActiveFavor(g, holderId, debtorId);
 if (!fav) return no('No active unused favor available.');
 const holder = g.politics?.people?.[holderId];
 const debtor = g.politics?.people?.[debtorId];
 if (!holder?.alive || !debtor?.alive) return no('Favor party is no longer living.');

 fav.used = true;
 fav.usedTurn = g.turn || 0;
 fav.purpose = purpose;

 if (purpose === 'council_vote' || purpose === 'law') {
  const realm = holder.realm;
  g.conflict ??= { next: 1, seed: 987123, lastTick: -1, factions: {}, schemes: {}, claims: {}, wars: {}, truces: {}, favors: {}, council: {}, history: [] };
  g.conflict.favors ??= {};
  g.conflict.favors[realm + ':' + debtorId] = (g.turn || 0) + 12;
  return ok(`Called in favor on ${debtor.name} for council vote support.`, { favor: fav });
 }

 if (purpose === 'faction_leave' || purpose === 'vassal_compliance') {
  const realm = holder.realm;
  for (const fx of Object.values(g.conflict?.factions || {})) {
   if (fx.realm === realm && ['organizing', 'ultimatum'].includes(fx.status)) {
    fx.members = (fx.members || []).filter(pid => g.politics?.holdings?.[pid]?.lord !== debtorId);
    fx.memberLords = (fx.memberLords || []).filter(id => id !== debtorId);
   }
  }
  for (const h of Object.values(g.politics?.holdings || {})) {
   if (h.realm === realm && h.lord === debtorId) h.loyalty = clamp((h.loyalty || 50) + 18, 0, 100);
  }
  return ok(`Called in favor on ${debtor.name} to secure vassal compliance.`, { favor: fav });
 }

 if (purpose === 'alliance' || purpose === 'marriage' || purpose === 'diplomacy') {
  const otherRealm = target || debtor.realm;
  d.diplomaticFavors[holder.realm + ':' + otherRealm] = {
   actor: holder.realm,
   target: otherRealm,
   until: (g.turn || 0) + 6,
   reason: fav.reason
  };
  return ok(`Called in favor on ${debtor.name} for diplomatic negotiation with ${otherRealm}.`, { favor: fav });
 }

 return ok(`Called in favor on ${debtor.name}.`, { favor: fav });
}

export function activeFavors(g, personId = null) {
 const d = ensureDeepSystems(g);
 const turn = g.turn || 0;
 return Object.values(d.favors).filter(
  f => !f.used && (f.expires || 0) > turn && (!personId || f.holder === personId || f.debtor === personId)
 );
}

export const OBLIGATION_POSTURES = Object.freeze({
 tax: { name: 'Tax-focused', tax: 1.18, levy: 0.86, opinion: -4 },
 balanced: { name: 'Balanced', tax: 1.0, levy: 1.0, opinion: 0 },
 levy: { name: 'Levy-focused', tax: 0.86, levy: 1.18, opinion: -4 }
});

export const ESTATE_OBLIGATION_KEYS = Object.freeze({
 feudal: 'feudalObligations',
 feudalObligations: 'feudalObligations',
 city: 'cityObligations',
 cityObligations: 'cityObligations',
 temple: 'templeObligations',
 templeObligations: 'templeObligations'
});

export function getObligationLaws(g, realm = g.player) {
 const d = ensureDeepSystems(g);
 const state = (d.obligations[realm] ??= {
  feudalObligations: 'balanced',
  cityObligations: 'balanced',
  templeObligations: 'balanced',
  lastChanged: {}
 });
 return {
  feudalObligations: state.feudalObligations || 'balanced',
  cityObligations: state.cityObligations || 'balanced',
  templeObligations: state.templeObligations || 'balanced'
 };
}

export function setObligationLaw(g, estate, posture, realm = g.player) {
 const d = ensureDeepSystems(g);
 const key = ESTATE_OBLIGATION_KEYS[estate];
 if (!key) return no('Unknown estate obligation class (use feudal, city, or temple).');
 if (!Object.hasOwn(OBLIGATION_POSTURES, posture)) return no('Obligation posture must be tax, balanced, or levy.');
 if (!g.factions?.[realm] || !g.politics?.realms?.[realm]) return no('Invalid realm.');
 const state = (d.obligations[realm] ??= {
  feudalObligations: 'balanced',
  cityObligations: 'balanced',
  templeObligations: 'balanced',
  lastChanged: {}
 });
 const prev = state[key] || 'balanced';
 if (prev === posture) return no(`${key} is already set to ${posture}.`);
 state[key] = posture;
 state.lastChanged ??= {};
 state.lastChanged[key] = g.turn || 0;

 // Reflect immediate vassal loyalty nudge
 const opinionShift = posture === 'balanced' ? 3 : -4;
 for (const [pid, h] of Object.entries(g.politics?.holdings || {})) {
  if (h.realm === realm && h.lord !== getRulerId(g, realm)) {
   h.loyalty = clamp((h.loyalty || 50) + opinionShift, 0, 100);
  }
 }
 addLog(g, realm, `Obligation law ${key} changed from ${prev} to ${posture}.`);
 return ok(`${key} set to ${posture}.`, getObligationLaws(g, realm));
}

export function obligationLawModifiers(g, realm) {
 const laws = g.deepSystems?.obligations?.[realm];
 if (!laws) return { tax: 1, levy: 1, opinion: 0 };
 const weights = { feudalObligations: 0.5, cityObligations: 0.25, templeObligations: 0.25 };
 let tax = 0;
 let levy = 0;
 let opinion = 0;
 for (const [key, w] of Object.entries(weights)) {
  const p = OBLIGATION_POSTURES[laws[key] || 'balanced'] || OBLIGATION_POSTURES.balanced;
  tax += p.tax * w;
  levy += p.levy * w;
  opinion += p.opinion * w;
 }
 return { tax, levy, opinion: Math.round(opinion) };
}

export function grantViceroyalty(g, titleKeyOrProvId, vassalId, realm = g.player) {
 const d = ensureDeepSystems(g);
 const rId = getRulerId(g, realm);
 const vassal = g.politics?.people?.[vassalId];
 if (!rId || !vassal?.alive || vassal.realm !== realm || vassal.id === rId) {
  return no('Select a living subject in your realm (not the sovereign).');
 }
 if (g.feudal?.prisoners?.[vassalId]?.status === 'held') {
  return no('Cannot grant a viceroyalty to an imprisoned character.');
 }

 let title = g.feudal?.titles?.[titleKeyOrProvId];
 if (!title && g.feudal?.titles) {
  if (g.feudal.titles['c:' + titleKeyOrProvId]) title = g.feudal.titles['c:' + titleKeyOrProvId];
  else title = Object.values(g.feudal.titles).find(t => t.id === titleKeyOrProvId || t.id.startsWith(titleKeyOrProvId + ':'));
 }
 const provId = g.provinces?.[titleKeyOrProvId] ? titleKeyOrProvId : title?.province || null;
 const holding = provId ? g.politics?.holdings?.[provId] : null;

 if (!title && !holding) return no('Select a valid title or province in your realm.');
 if (title && (title.realm !== realm || title.id === 'k:' + realm || title.id === 'e:' + realm)) {
  return no('Cannot grant your primary crown or imperial title as a viceroyalty.');
 }
 if (holding && holding.realm !== realm) return no('Province does not belong to your realm.');

 const key = title?.id || ('c:' + provId);
 if (title) {
  title.holder = vassalId;
  title.viceroyalty = true;
 }
 if (holding) {
  holding.lord = vassalId;
  holding.viceroyalty = true;
  holding.loyalty = clamp((holding.loyalty || 50) + 15, 0, 100);
 }
 d.viceroyalties[key] = {
  titleId: key,
  provinceId: provId,
  tier: title?.feudalTier || title?.tier || 'county',
  realm,
  holder: vassalId,
  grantedBy: rId,
  grantedTurn: g.turn || 0
 };
 adjustPersonalOpinion(g, rId, vassalId, 18);
 addLog(g, realm, `Granted viceroyalty ${key} to ${vassal.name}.`);
 return ok(`Viceroyalty ${key} granted to ${vassal.name}.`, { viceroyalty: d.viceroyalties[key] });
}

export function revertViceroyaltiesOnDeath(g, deceased) {
 const d = g.deepSystems;
 if (!d?.viceroyalties || !deceased?.id) return [];
 const reverted = [];
 for (const [key, vic] of Object.entries(d.viceroyalties)) {
  if (vic.holder !== deceased.id) continue;
  const crownId = getRulerId(g, vic.realm);
  if (!crownId) continue;
  const title = g.feudal?.titles?.[vic.titleId];
  if (title) {
   title.holder = crownId;
   delete title.viceroyalty;
  }
  if (vic.provinceId && g.politics?.holdings?.[vic.provinceId]) {
   const h = g.politics.holdings[vic.provinceId];
   h.lord = crownId;
   h.loyalty = 100;
   delete h.viceroyalty;
  }
  delete d.viceroyalties[key];
  d.viceroyaltyHistory.unshift({ ...vic, revertedTurn: g.turn || 0, revertedTo: crownId });
  if (d.viceroyaltyHistory.length > 80) d.viceroyaltyHistory.length = 80;
  reverted.push(key);
  addLog(g, vic.realm, `Viceroyalty ${key} reverted to the crown upon ${deceased.name}'s death.`);
 }
 return reverted;
}

export const MINOR_TITLES = Object.freeze({
 seneschal: { id: 'seneschal', name: 'High Seneschal', prestigeMonthly: 0.4, opinionBonus: 15, stewardshipBonus: 1, desc: 'Oversees the royal household and steward accounts.' },
 cupbearer: { id: 'cupbearer', name: 'Royal Cupbearer', prestigeMonthly: 0.25, opinionBonus: 12, diplomacyBonus: 1, desc: 'Trusted attendant at the sovereign table.' },
 master_of_horse: { id: 'master_of_horse', name: 'Master of the Horse', prestigeMonthly: 0.35, opinionBonus: 12, martialBonus: 1, desc: 'Commands the royal stables and cavalry retinue.' },
 court_poet: { id: 'court_poet', name: 'Court Poet', prestigeMonthly: 0.5, opinionBonus: 10, learningBonus: 1, desc: 'Celebrates the dynasty in verse and chronicle.' },
 designated_regent: { id: 'designated_regent', name: 'Designated Regent', prestigeMonthly: 0.3, opinionBonus: 18, regentPriority: true, desc: 'Named guardian of the realm during royal minority or incapacity.' }
});

export function grantMinorTitle(g, personId, titleId, realm = g.player) {
 const d = ensureDeepSystems(g);
 const def = MINOR_TITLES[titleId];
 if (!def) return no('Unknown minor title.');
 const rId = getRulerId(g, realm);
 const person = g.politics?.people?.[personId];
 if (!person?.alive || person.realm !== realm || person.id === rId || (person.age || 0) < 16) {
  return no('Select a living adult subject in your realm.');
 }
 d.minorTitles[realm] ??= {};
 const prev = d.minorTitles[realm][titleId];
 if (prev?.personId === personId) return no(`${person.name} already holds ${def.name}.`);
 if (prev?.personId) {
  adjustPersonalOpinion(g, rId, prev.personId, -Math.round(def.opinionBonus * 0.5));
 }
 d.minorTitles[realm][titleId] = {
  titleId,
  personId,
  realm,
  grantedTurn: g.turn || 0
 };
 adjustPersonalOpinion(g, rId, personId, def.opinionBonus);
 for (const h of Object.values(g.politics?.holdings || {})) {
  if (h.realm === realm && h.lord === personId) h.loyalty = clamp((h.loyalty || 50) + 6, 0, 100);
 }
 if (titleId === 'designated_regent' && g.politics?.realms?.[realm]) {
  g.politics.realms[realm].designatedRegent = personId;
 }
 addLog(g, realm, `${person.name} appointed ${def.name}.`);
 return ok(`${person.name} named ${def.name}.`, { assignment: d.minorTitles[realm][titleId] });
}

export function revokeMinorTitle(g, titleId, realm = g.player) {
 const d = ensureDeepSystems(g);
 const assignment = d.minorTitles?.[realm]?.[titleId];
 if (!assignment) return no('Minor title is currently vacant.');
 const rId = getRulerId(g, realm);
 adjustPersonalOpinion(g, rId, assignment.personId, -(MINOR_TITLES[titleId]?.opinionBonus || 10));
 delete d.minorTitles[realm][titleId];
 if (titleId === 'designated_regent' && g.politics?.realms?.[realm]) {
  delete g.politics.realms[realm].designatedRegent;
 }
 return ok('Minor title vacated.');
}

export function minorTitleModifiers(g, realm) {
 const titles = g.deepSystems?.minorTitles?.[realm] || {};
 let prestigeMonthly = 0;
 let opinionTotal = 0;
 let activeCount = 0;
 for (const [tid, rec] of Object.entries(titles)) {
  const def = MINOR_TITLES[tid];
  const p = g.politics?.people?.[rec?.personId];
  if (!def || !p?.alive || p.realm !== realm) continue;
  activeCount++;
  prestigeMonthly += def.prestigeMonthly || 0;
  opinionTotal += def.opinionBonus || 0;
 }
 return { prestigeMonthly, opinionTotal, activeCount };
}

// ============================================================================
// 5. COLLEGE OF CARDINALS, ANTIPOPES, MORAL AUTHORITY & CRUSADES
// ============================================================================

function normalizeReligionKey(g, faithOrSystem) {
 if (!faithOrSystem) return 'traditional';
 const low = String(faithOrSystem).toLowerCase();
 if (['catholic', 'orthodox', 'islamic', 'dharmic', 'traditional'].includes(low)) return low;
 return resolveFaithSystem(g, faithOrSystem);
}

export function initMoralAuthority(g) {
 const d = ensureDeepSystems(g);
 for (const sys of ['catholic', 'orthodox', 'islamic', 'dharmic', 'traditional']) {
  if (!Number.isFinite(d.moralAuthority[sys])) {
   const sites = Object.entries(SACRED_SITES_LOCAL).filter(([, s]) => s.system === sys);
   let controlled = 0;
   for (const [pid] of sites) {
    const owner = g.provinces?.[pid]?.owner;
    if (owner && owner !== 'independent' && resolveFaithSystem(g, getRealmFaith(g, owner)) === sys) controlled++;
   }
   d.moralAuthority[sys] = clamp(60 + controlled * 8, 20, 95);
  }
 }
 return d.moralAuthority;
}

export function getMoralAuthority(g, faithOrSystem) {
 initMoralAuthority(g);
 const key = normalizeReligionKey(g, faithOrSystem);
 return clamp(num(g.deepSystems.moralAuthority[key] ?? 60), 0, 100);
}

export function adjustMoralAuthority(g, faithOrSystem, delta, reason = '') {
 initMoralAuthority(g);
 const key = normalizeReligionKey(g, faithOrSystem);
 g.deepSystems.moralAuthority[key] = clamp(num(g.deepSystems.moralAuthority[key]) + delta, 0, 100);
 if (reason) addLog(g, g.player, `${key} moral authority ${delta >= 0 ? '+' : ''}${delta} (${reason}).`);
 return g.deepSystems.moralAuthority[key];
}

export function moralAuthorityBreakdown(g, faithOrSystem) {
 initMoralAuthority(g);
 const key = normalizeReligionKey(g, faithOrSystem);
 const sites = Object.entries(SACRED_SITES_LOCAL).filter(([, s]) => s.system === key);
 let sitesHeld = 0;
 for (const [pid] of sites) {
  const owner = g.provinces?.[pid]?.owner;
  if (owner && owner !== 'independent' && resolveFaithSystem(g, getRealmFaith(g, owner)) === key) sitesHeld++;
 }
 const antipopeCount = key === 'catholic' ? Object.values(g.deepSystems.antipopes || {}).filter(a => a.active).length : 0;
 const warMod = num(g.deepSystems.moralAuthorityWar?.[key]);
 const value = getMoralAuthority(g, key);
 return {
  system: key,
  value,
  holySitesControlled: sitesHeld,
  totalHolySites: sites.length,
  antipopeCount,
  antipopePenalty: antipopeCount * -15,
  warModifier: warMod
 };
}

export function recomputeMoralAuthority(g) {
 initMoralAuthority(g);
 for (const sys of ['catholic', 'orthodox', 'islamic', 'dharmic', 'traditional']) {
  const sites = Object.entries(SACRED_SITES_LOCAL).filter(([, s]) => s.system === sys);
  let sitesHeld = 0;
  for (const [pid] of sites) {
   const owner = g.provinces?.[pid]?.owner;
   if (owner && owner !== 'independent' && resolveFaithSystem(g, getRealmFaith(g, owner)) === sys) sitesHeld++;
  }
  const antipopePenalty = sys === 'catholic' ? Object.values(g.deepSystems.antipopes || {}).filter(a => a.active).length * 15 : 0;
  const warMod = clamp(num(g.deepSystems.moralAuthorityWar?.[sys]), -25, 25);
  const target = clamp(56 + sitesHeld * 10 + warMod - antipopePenalty, 5, 100);
  const cur = g.deepSystems.moralAuthority[sys];
  g.deepSystems.moralAuthority[sys] = clamp(Math.round(cur + clamp(target - cur, -2, 2)), 0, 100);
 }
 return g.deepSystems.moralAuthority;
}

export function initCardinals(g) {
 const d = ensureDeepSystems(g);
 if (d.cardinals && Array.isArray(d.cardinals.seats)) return d.cardinals;
 const catholicRealms = Object.keys(g.politics?.realms || {}).filter(
  r => resolveFaithSystem(g, getRealmFaith(g, r)) === 'catholic'
 );
 const seats = [];
 const used = new Set();
 for (const r of catholicRealms) {
  if (seats.length >= 9) break;
  const s = g.politics.realms[r];
  const candId = s.council?.scholar || g.living?.realms?.[r]?.faithAdvisor;
  const p = candId ? g.politics.people?.[candId] : null;
  if (p?.alive && !used.has(p.id)) {
   used.add(p.id);
   seats.push({
    seatIndex: seats.length + 1,
    personId: p.id,
    realm: r,
    name: p.name,
    learning: num(p.skills?.learning || 2),
    piety: num(p.piety || 10),
    score: num(p.skills?.learning || 2) * 12 + num(p.piety || 10) * 0.5,
    appointedTurn: g.turn || 0
   });
  }
 }
 while (seats.length < 9) {
  const idx = seats.length + 1;
  const seatRealm = catholicRealms[idx % Math.max(1, catholicRealms.length)] || 'papacy';
  seats.push({
   seatIndex: idx,
   personId: `curia_prelate_${idx}`,
   realm: seatRealm,
   name: allocateCardinalName(g, seatRealm, idx),
   learning: 3 + (idx % 3),
   piety: 25 + idx * 3,
   score: (3 + (idx % 3)) * 12 + (25 + idx * 3) * 0.5,
   appointedTurn: 0
  });
 }
 d.cardinals = {
  maxSeats: 9,
  seats,
  pope: { id: 'pope_nicholas_v', name: 'Pope Nicholas V', realm: 'papacy', age: 53, electedTurn: 0 },
  campaigns: {}
 };
 return d.cardinals;
}

export function promoteCardinal(g, bishopId, gold = 150, actorRealm = g.player) {
 const d = ensureDeepSystems(g);
 const col = initCardinals(g);
 const f = g.factions?.[actorRealm];
 const bishop = g.politics?.people?.[bishopId];
 if (!f || !bishop?.alive || bishop.realm !== actorRealm || (bishop.age || 0) < 18) {
  return no('Select a living adult cleric or scholar in your realm.');
 }
 if (resolveFaithSystem(g, getRealmFaith(g, actorRealm)) !== 'catholic') {
  return no('College of Cardinals is available only to Catholic realms.');
 }
 const spend = Math.max(50, Math.round(num(gold)));
 if (f.treasury < spend) return no(`Need ${spend} gold to campaign for a Cardinal seat.`);
 if (col.seats.some(s => s.personId === bishopId)) {
  return no(`${bishop.name} already holds a seat in the College of Cardinals.`);
 }

 f.treasury -= spend;
 col.campaigns[bishopId] = (col.campaigns[bishopId] || 0) + spend;
 const score = Math.round(num(bishop.skills?.learning || 2) * 12 + num(bishop.piety || 10) * 0.6 + col.campaigns[bishopId] * 0.3);

 const sorted = col.seats.slice().sort((a, b) => a.score - b.score);
 const weakest = sorted[0];
 let elevated = false;
 if (col.seats.length < col.maxSeats || score >= weakest.score || spend >= 150) {
  elevated = true;
  const seatIndex = col.seats.length < col.maxSeats ? col.seats.length + 1 : weakest.seatIndex;
  const newSeat = {
   seatIndex,
   personId: bishop.id,
   realm: actorRealm,
   name: bishop.name,
   learning: num(bishop.skills?.learning || 2),
   piety: num(bishop.piety || 10),
   score,
   appointedTurn: g.turn || 0
  };
  if (col.seats.length < col.maxSeats) {
   col.seats.push(newSeat);
  } else {
   const idx = col.seats.findIndex(s => s.seatIndex === seatIndex);
   col.seats[idx] = newSeat;
  }
  bishop.piety = num(bishop.piety) + 15;
  bishop.prestige = num(bishop.prestige) + 10;
  const r = getRuler(g, actorRealm);
  if (r) r.piety = num(r.piety) + 8;
  const fs = g.identity?.realms?.[actorRealm]?.faithSystem;
  if (fs && fs.system === 'catholic') {
   fs.curiaSeats = Math.min(4, (fs.curiaSeats || 0) + 1);
   fs.papalFavor = clamp((fs.papalFavor || 55) + 10, 0, 100);
  }
  addLog(g, actorRealm, `${bishop.name} was elevated to the College of Cardinals.`);
 }

 return ok(elevated ? `${bishop.name} was elevated to Cardinal!` : `Backed ${bishop.name}'s curial campaign (${score} points).`, {
  elevated,
  score,
  seats: col.seats
 });
}

export function appointAntipope(g, bishopId, actorRealm = g.player) {
 const d = ensureDeepSystems(g);
 const f = g.factions?.[actorRealm];
 const bishop = g.politics?.people?.[bishopId];
 const rId = getRulerId(g, actorRealm);
 if (!f || !bishop?.alive || bishop.realm !== actorRealm || bishop.id === rId || (bishop.age || 0) < 18) {
  return no('Select a living adult cleric or courtier in your realm.');
 }
 if (resolveFaithSystem(g, getRealmFaith(g, actorRealm)) !== 'catholic') {
  return no('Only Catholic realms can appoint an Antipope.');
 }
 if (d.antipopes[actorRealm]?.active) {
  return no('An Antipope is already installed in your realm.');
 }
 if (f.treasury < 100) return no('Requires 100 gold to install an Antipope.');

 f.treasury -= 100;
 d.antipopes[actorRealm] = {
  realm: actorRealm,
  bishopId: bishop.id,
  name: `Antipope ${bishop.name}`,
  started: g.turn || 0,
  active: true,
  lastTax: -120
 };

 const fs = g.identity?.realms?.[actorRealm]?.faithSystem;
 if (fs && fs.system === 'catholic') fs.papalFavor = 0;

 // Shift moral authority & drop Catholic opinion
 adjustMoralAuthority(g, 'catholic', -15, `${f.name} appointed an Antipope`);
 for (const [other, ofac] of Object.entries(g.factions || {})) {
  if (other === actorRealm || other === 'independent') continue;
  if (resolveFaithSystem(g, getRealmFaith(g, other)) === 'catholic') {
   ofac.relations ??= {};
   ofac.relations[actorRealm] = clamp((ofac.relations[actorRealm] || 0) - 20, -100, 100);
  }
 }
 addLog(g, actorRealm, `${f.name} appointed ${bishop.name} as Antipope!`);
 return ok(`${bishop.name} proclaimed Antipope.`, { antipope: d.antipopes[actorRealm] });
}

export function deposeAntipope(g, targetRealm = g.player, actorRealm = g.player) {
 const d = ensureDeepSystems(g);
 const anti = d.antipopes?.[targetRealm];
 if (!anti?.active) return no('No active Antipope to depose.');
 delete d.antipopes[targetRealm];

 adjustMoralAuthority(g, 'catholic', 15, 'Antipope deposed');
 for (const [other, ofac] of Object.entries(g.factions || {})) {
  if (other === targetRealm || other === 'independent') continue;
  if (resolveFaithSystem(g, getRealmFaith(g, other)) === 'catholic') {
   ofac.relations ??= {};
   ofac.relations[targetRealm] = clamp((ofac.relations[targetRealm] || 0) + 15, -100, 100);
  }
 }
 const r = getRuler(g, actorRealm);
 if (r) r.piety = num(r.piety) + 20;
 if (g.factions[actorRealm]) g.factions[actorRealm].piety = num(g.factions[actorRealm].piety) + 20;
 const fs = g.identity?.realms?.[actorRealm]?.faithSystem;
 if (fs && fs.system === 'catholic') fs.papalFavor = clamp((fs.papalFavor || 0) + 25, 0, 100);
 addLog(g, actorRealm, `The Antipope in ${targetRealm} was deposed.`);
 return ok('Antipope deposed; papal relations and moral authority restored.');
}

export function antipopeAction(g, action, target = null, actorRealm = g.player) {
 const d = ensureDeepSystems(g);
 const anti = d.antipopes?.[actorRealm];
 const f = g.factions?.[actorRealm];
 const r = getRuler(g, actorRealm);
 if (!anti?.active || !f || !r) return no('Requires an active Antipope in your realm.');

 if (action === 'tax') {
  if ((g.turn || 0) - (anti.lastTax ?? -120) < 12) return no('Clerical taxes may be demanded once per year.');
  anti.lastTax = g.turn || 0;
  const provCount = Math.max(1, ownedProvinces(g, actorRealm).length);
  const amount = 60 + provCount * 20;
  f.treasury += amount;
  r.piety = Math.max(0, num(r.piety) - 8);
  addLog(g, actorRealm, `Antipope ${anti.name} levied ${amount} gold in clerical taxes.`);
  return ok(`Collected ${amount} gold from clerical revenues.`, { gold: amount });
 }

 if (action === 'excommunicate') {
  const tf = g.factions?.[target];
  if (!tf || target === actorRealm || resolveFaithSystem(g, getRealmFaith(g, target)) !== 'catholic') {
   return no('Select another Catholic realm to excommunicate.');
  }
  if (g.identity?.realms?.[target]) {
   const tRealm = g.identity.realms[target];
   const tFaith = getRealmFaith(g, target) || 'Latin Christianity';
   const tsys = (tRealm.faithSystem ??= {
    system: 'catholic',
    faith: tFaith,
    papalFavor: 55,
    curiaSeats: 1,
    investiture: 'papal',
    excommunicated: false,
    lastIndulgence: -120,
    lastDivorce: -120,
    lastCuria: -120,
    history: []
   });
   tsys.excommunicated = true;
   tsys.excommunicatedUntil = (g.turn || 0) + 36;
  }
  tf.legitimacy = clamp((tf.legitimacy || 60) - 12, 0, 100);
  for (const h of Object.values(g.politics?.holdings || {})) {
   if (h.realm === target) h.loyalty = clamp((h.loyalty || 50) - 12, 0, 100);
  }
  addLog(g, actorRealm, `${anti.name} pronounced excommunication upon ${tf.name}.`);
  return ok(`${tf.name} excommunicated by Antipope.`, { target });
 }

 if (action === 'divorce') {
  const spId = r.spouse;
  const sp = spId ? g.politics?.people?.[spId] : null;
  if (!sp) return no('Ruler has no active spouse.');
  r.spouse = null;
  r.spouses = [];
  if (sp.spouse === r.id) sp.spouse = null;
  if (Array.isArray(sp.spouses)) sp.spouses = sp.spouses.filter(id => id !== r.id);
  delete r.marriageLineage;
  delete sp.marriageLineage;
  for (const m of g.politics?.marriages || []) {
   if (!m.ended && ((m.a === r.id && m.b === sp.id) || (m.b === r.id && m.a === sp.id))) {
    m.ended = 'annulment';
    m.endedTurn = g.turn || 0;
   }
  }
  r.memories ??= [];
  r.memories.push(`Annulled marriage through ${anti.name} in ${g.year || 1450}.`);
  addLog(g, actorRealm, `${anti.name} granted a royal annulment.`);
  return ok('Royal marriage annulled by Antipope.');
 }

 return no('Unknown Antipope demand.');
}

export function declareCrusade(g, targetRegionOrFaction, callerRealm = g.player) {
 const d = ensureDeepSystems(g);
 if (d.crusade && d.crusade.status === 'active') return no('A Crusade or Great Holy War is already active.');
 const f = g.factions?.[callerRealm];
 const r = getRuler(g, callerRealm);
 const callerFaith = getRealmFaith(g, callerRealm);
 const callerSys = resolveFaithSystem(g, callerFaith);
 if (!f || !callerFaith) return no('Invalid caller realm.');

 // Resolve targetRegionOrFaction: could be faction ID, province ID, or region/continent name
 let targetFaction = null;
 let targetProvinces = [];
 let targetLabel = String(targetRegionOrFaction || '');

 if (g.factions?.[targetRegionOrFaction] && targetRegionOrFaction !== callerRealm && targetRegionOrFaction !== 'independent') {
  targetFaction = targetRegionOrFaction;
  targetProvinces = ownedProvinces(g, targetFaction).map(p => p.id);
  targetLabel = g.factions[targetFaction].name;
 } else if (g.provinces?.[targetRegionOrFaction]) {
  const p = g.provinces[targetRegionOrFaction];
  targetFaction = p.owner !== 'independent' ? p.owner : null;
  targetProvinces = [p.id];
  targetLabel = p.name || p.id;
 } else {
  const match = Object.values(g.provinces || {}).filter(
   p => p.owner !== callerRealm && p.owner !== 'independent' && (p.regionName === targetRegionOrFaction || p.continent === targetRegionOrFaction)
  );
  if (match.length) {
   targetProvinces = match.map(p => p.id);
   targetFaction = match[0].owner;
   targetLabel = targetRegionOrFaction;
  }
 }

 if (!targetFaction || !g.factions[targetFaction]) {
  return no('Specify a valid foreign target realm, province, or region.');
 }
 const targetFaith = getRealmFaith(g, targetFaction);
 if (targetFaith && resolveFaithFamily(g, targetFaith) === resolveFaithFamily(g, callerFaith)) {
  return no('Crusade / Great Holy War must target a realm of another faith family.');
 }

 const kind = callerSys === 'islamic' ? 'Jihad' : callerSys === 'catholic' || callerSys === 'orthodox' ? 'Crusade' : 'Great Holy War';
 const callerPower = Math.max(100, realmPower(g, callerRealm));
 d.crusade = {
  id: `ghw_${g.turn || 0}`,
  kind,
  callerFaith,
  callerSystem: callerSys,
  callerRealm,
  targetFaction,
  targetLabel,
  targetProvinces,
  started: g.turn || 0,
  ends: (g.turn || 0) + 48,
  status: 'active',
  warChest: 350,
  pledged: {
   [callerRealm]: { realm: callerRealm, joinedTurn: g.turn || 0, contribution: 25, troopsCommitted: callerPower }
  },
  participants: [callerRealm]
 };

 if (g.identity) {
  const legacyObj = { caller: callerRealm, target: targetFaction, started: g.turn || 0, ends: (g.turn || 0) + 48, participants: [callerRealm] };
  if (callerSys === 'islamic') g.identity.jihad = legacyObj;
  else g.identity.crusade = legacyObj;
 }

 if (r) r.piety = num(r.piety) + 15;
 f.piety = num(f.piety) + 15;
 for (const a of Object.values(g.armies || {})) {
  if (a.owner === callerRealm) a.morale = clamp((a.morale || 75) + 12, 0, 100);
 }
 addLog(g, callerRealm, `${kind} proclaimed against ${targetLabel}!`);
 return ok(`${kind} proclaimed against ${targetLabel}!`, { crusade: d.crusade });
}

export function pledgeCrusade(g, factionId = g.player) {
 const d = ensureDeepSystems(g);
 const c = d.crusade;
 if (!c || c.status !== 'active') return no('No active Crusade or Great Holy War.');
 const f = g.factions?.[factionId];
 if (!f || factionId === c.targetFaction) return no('Invalid crusading realm.');
 const myFaith = getRealmFaith(g, factionId);
 if (myFaith && c.callerFaith && resolveFaithFamily(g, myFaith) !== resolveFaithFamily(g, c.callerFaith)) {
  return no('Only realms sharing the caller faith family may pledge.');
 }
 if (c.pledged[factionId]) return no(`${f.name} has already pledged to the ${c.kind}.`);

 const goldCommit = Math.min(50, Math.max(0, Math.floor(f.treasury * 0.1)));
 f.treasury -= goldCommit;
 c.warChest += 120 + goldCommit;
 const str = Math.max(50, realmPower(g, factionId));
 c.pledged[factionId] = {
  realm: factionId,
  joinedTurn: g.turn || 0,
  contribution: 15 + Math.round(str / 60),
  troopsCommitted: str
 };
 if (!c.participants.includes(factionId)) c.participants.push(factionId);
 if (g.identity?.crusade && c.callerSystem !== 'islamic' && !g.identity.crusade.participants.includes(factionId)) {
  g.identity.crusade.participants.push(factionId);
 }
 if (g.identity?.jihad && c.callerSystem === 'islamic' && !g.identity.jihad.participants.includes(factionId)) {
  g.identity.jihad.participants.push(factionId);
 }
 const r = getRuler(g, factionId);
 if (r) r.piety = num(r.piety) + 15;
 f.piety = num(f.piety) + 15;
 f.prestige = (f.prestige || 0) + 10;
 for (const a of Object.values(g.armies || {})) {
  if (a.owner === factionId) a.morale = clamp((a.morale || 75) + 10, 0, 100);
 }
 addLog(g, factionId, `${f.name} pledged forces and ${goldCommit} gold to the ${c.kind}.`);
 return ok(`${f.name} pledged to the ${c.kind}.`, { summary: crusadeSummary(g) });
}

export function contributeToCrusade(g, factionId, points = 15) {
 const c = g.deepSystems?.crusade;
 if (!c || c.status !== 'active' || !c.pledged?.[factionId]) return false;
 c.pledged[factionId].contribution += Math.max(1, Math.round(points));
 c.warChest += Math.round(points * 2);
 return true;
}

export function crusadeSummary(g) {
 const c = g.deepSystems?.crusade;
 if (!c) return { active: false, participants: [], leaderboard: [], warChest: 0 };
 const entries = Object.values(c.pledged || {});
 const totalContrib = Math.max(1, entries.reduce((s, e) => s + (e.contribution || 0), 0));
 const leaderboard = entries
  .map(e => {
   const share = (e.contribution || 0) / totalContrib;
   return {
    realm: e.realm,
    name: g.factions?.[e.realm]?.name || e.realm,
    contribution: e.contribution,
    sharePct: Math.round(share * 100),
    warChestShare: Math.round(c.warChest * share),
    pietyReward: Math.round(25 + share * 60),
    prestigeReward: Math.round(20 + share * 50)
   };
  })
  .sort((a, b) => b.contribution - a.contribution || a.realm.localeCompare(b.realm));
 return {
  active: c.status === 'active',
  id: c.id,
  kind: c.kind,
  status: c.status,
  callerFaith: c.callerFaith,
  callerRealm: c.callerRealm,
  targetFaction: c.targetFaction,
  targetLabel: c.targetLabel,
  warChest: c.warChest,
  ends: c.ends,
  endsIn: Math.max(0, (c.ends || 0) - (g.turn || 0)),
  participants: [...c.participants],
  leaderboard
 };
}

export function resolveCrusadeIfReady(g, forceSuccess = false) {
 const d = ensureDeepSystems(g);
 const c = d.crusade;
 if (!c || c.status !== 'active') return null;
 const capturedGoal = (c.targetProvinces || []).some(
  pid => c.participants.includes(getController(g, pid))
 );
 const expired = (g.turn || 0) >= (c.ends || 0);
 if (!forceSuccess && !capturedGoal && !expired) return null;

 const won = forceSuccess || capturedGoal;
 const summary = crusadeSummary(g);
 if (won) {
  for (const row of summary.leaderboard) {
   const fac = g.factions?.[row.realm];
   if (!fac) continue;
   fac.treasury += row.warChestShare;
   fac.prestige = (fac.prestige || 0) + row.prestigeReward;
   fac.piety = num(fac.piety) + row.pietyReward;
   const r = getRuler(g, row.realm);
   if (r) {
    r.piety = num(r.piety) + row.pietyReward;
    r.prestige = num(r.prestige) + row.prestigeReward;
   }
  }
  adjustMoralAuthority(g, c.callerSystem, 10, `${c.kind} victory`);
 } else {
  adjustMoralAuthority(g, c.callerSystem, -8, `${c.kind} stalemated`);
 }
 c.status = won ? 'victory' : 'ended';
 c.endedTurn = g.turn || 0;
 d.crusadeHistory.unshift({ ...c, leaderboard: summary.leaderboard });
 if (d.crusadeHistory.length > 20) d.crusadeHistory.length = 20;
 d.crusade = null;
 if (g.identity) {
  if (c.callerSystem === 'islamic') delete g.identity.jihad;
  else delete g.identity.crusade;
 }
 addLog(g, c.callerRealm, `${c.kind} against ${c.targetLabel} concluded (${c.status}).`);
 return { status: c.status, summary };
}

// ============================================================================
// 6. SOCIETIES & HISTORICAL/FORGED BLOODLINES
// ============================================================================

export const SOCIETIES = Object.freeze({
 hermetic_society: {
  id: 'hermetic_society',
  name: 'Hermetic Society',
  focus: 'learning',
  ranks: ['Neophyte', 'Mystic', 'Adept', 'Magus'],
  perks: { learning: 2, stewardship: 1, researchBonus: 3 },
  missions: ['transmute_manuscript', 'celestial_horoscope'],
  desc: 'Natural philosophers, alchemists, and astronomers advancing esoteric scholarship.'
 },
 monastic_order: {
  id: 'monastic_order',
  name: 'Monastic Order',
  focus: 'piety',
  ranks: ['Oblate', 'Novice', 'Devoted Brother', 'Abbot Lay-Patron'],
  perks: { learning: 1, diplomacy: 1, pietyMonthly: 1.5, vassalOpinion: 6 },
  missions: ['copy_scripture', 'monastic_charity'],
  desc: 'Pious spiritual brotherhood cultivating devotion, humility, and clerical goodwill.'
 },
 warrior_lodge: {
  id: 'warrior_lodge',
  name: 'Warrior Lodge',
  focus: 'martial',
  ranks: ['Fledgling', 'Shieldbearer', 'Champion', 'Hero of the Lodge'],
  perks: { martial: 2, combatPower: 0.12, moraleBonus: 8, prestigeMonthly: 1.0 },
  missions: ['lodge_duel', 'warband_drill'],
  desc: 'Brotherhood of commanders sharpening martial prowess and battlefield valor.'
 },
 assassins_order: {
  id: 'assassins_order',
  name: 'Order of Shadows',
  focus: 'intrigue',
  ranks: ['Initiate', 'Operative', 'Master of Daggers', 'Grandmaster'],
  perks: { intrigue: 2, schemeBonus: 12, discoveryAvoidance: 8 },
  missions: ['shadow_network', 'covert_blackmail'],
  desc: 'Clandestine society mastering espionage, covert networks, and silent elimination.'
 }
});

const SOCIETY_RANK_THRESHOLDS = [0, 80, 180, 320];

export function joinSociety(g, societyId, personId = null) {
 const d = ensureDeepSystems(g);
 const def = SOCIETIES[societyId];
 if (!def) return no('Unknown society.');
 const pid = personId || getRulerId(g, g.player);
 const person = g.politics?.people?.[pid];
 if (!person?.alive || (person.age || 0) < 16) return no('Select a living adult character.');
 const cur = d.societies.memberships[pid];
 if (cur?.societyId === societyId) return no(`${person.name} is already a member of ${def.name}.`);

 d.societies.memberships[pid] = {
  personId: pid,
  societyId,
  rank: 1,
  devotion: 30,
  joinedTurn: g.turn || 0,
  lastMissionTurn: -120
 };
 d.societies.history.unshift({ turn: g.turn || 0, personId: pid, societyId, action: 'join' });
 if (d.societies.history.length > 100) d.societies.history.length = 100;
 addLog(g, person.realm, `${person.name} joined the ${def.name}.`);
 return ok(`${person.name} initiated as ${def.ranks[0]} of the ${def.name}.`, {
  membership: d.societies.memberships[pid]
 });
}

export function advanceSocietyRank(g, personId = null) {
 const d = ensureDeepSystems(g);
 const pid = personId || getRulerId(g, g.player);
 const mem = d.societies.memberships?.[pid];
 const person = g.politics?.people?.[pid];
 if (!mem || !person?.alive) return no('Character is not in an active society.');
 const def = SOCIETIES[mem.societyId];
 if (!def) return no('Invalid society.');
 if (mem.rank >= 4) return no(`${person.name} has already reached the highest rank (${def.ranks[3]}).`);

 const req = SOCIETY_RANK_THRESHOLDS[mem.rank];
 if ((mem.devotion || 0) < req) {
  return no(`Need ${req} society devotion to advance (currently ${mem.devotion || 0}). Complete society missions.`);
 }
 mem.rank++;
 const primarySkill = def.focus === 'piety' ? 'learning' : def.focus;
 if (person.skills && Object.hasOwn(person.skills, primarySkill)) {
  person.skills[primarySkill] = clamp(num(person.skills[primarySkill]) + 1, 1, 10);
 }
 person.prestige = num(person.prestige) + 12;
 if (g.factions?.[person.realm]) g.factions[person.realm].prestige = (g.factions[person.realm].prestige || 0) + 12;
 d.societies.history.unshift({ turn: g.turn || 0, personId: pid, societyId: mem.societyId, action: 'rank', rank: mem.rank });
 addLog(g, person.realm, `${person.name} attained the rank of ${def.ranks[mem.rank - 1]} in the ${def.name}.`);
 return ok(`Advanced to rank ${mem.rank}: ${def.ranks[mem.rank - 1]}.`, { membership: mem });
}

export function societyMission(g, personId = null, missionKind = null) {
 const d = ensureDeepSystems(g);
 const pid = personId || getRulerId(g, g.player);
 const mem = d.societies.memberships?.[pid];
 const person = g.politics?.people?.[pid];
 if (!mem || !person?.alive) return no('Character is not in an active society.');
 const def = SOCIETIES[mem.societyId];
 if ((g.turn || 0) - (mem.lastMissionTurn ?? -120) < 3) {
  return no('Society missions require a 3-month interval.');
 }

 mem.lastMissionTurn = g.turn || 0;
 const gain = 85 + mem.rank * 15;
 mem.devotion = (mem.devotion || 0) + gain;
 const f = g.factions?.[person.realm];
 let rewardDesc = '';

 if (mem.societyId === 'hermetic_society') {
  if (g.identity?.realms?.[person.realm]?.research) {
   g.identity.realms[person.realm].research.progress += 15 + mem.rank * 4;
  }
  if (f) f.tech = clamp((f.tech || 1) + 0.15, 1, 10);
  person.skills.learning = clamp(num(person.skills?.learning || 2) + (mem.rank >= 2 ? 1 : 0), 1, 10);
  rewardDesc = 'research and learning advanced';
 } else if (mem.societyId === 'monastic_order') {
  person.piety = num(person.piety) + 18;
  if (f) f.piety = num(f.piety) + 18;
  if (person.civic) person.civic.stress = clamp(num(person.civic.stress) - 10, 0, 100);
  rewardDesc = '+18 piety and reduced stress';
 } else if (mem.societyId === 'warrior_lodge') {
  person.prestige = num(person.prestige) + 18;
  if (f) f.prestige = (f.prestige || 0) + 18;
  for (const a of Object.values(g.armies || {})) {
   if (a.owner === person.realm) a.morale = clamp((a.morale || 75) + 6, 0, 100);
  }
  rewardDesc = '+18 prestige and army morale +6';
 } else if (mem.societyId === 'assassins_order') {
  person.skills.intrigue = clamp(num(person.skills?.intrigue || 2) + (mem.rank >= 2 ? 1 : 0), 1, 10);
  person.prestige = num(person.prestige) + 10;
  for (const p of Object.values(g.intrigue?.plots || {})) {
   if (p.realm === person.realm && p.status === 'active') p.preparation = clamp((p.preparation || 0) + 10, -20, 25);
  }
  rewardDesc = 'intrigue prowess and scheme preparation sharpened';
 }

 addLog(g, person.realm, `${person.name} completed a ${def.name} mission (${rewardDesc}).`);
 return ok(`Society mission succeeded (+${gain} devotion, ${rewardDesc}).`, {
  devotion: mem.devotion,
  rank: mem.rank,
  mission: missionKind || def.missions[0]
 });
}

export function societyModifiers(g, realm) {
 const rId = getRulerId(g, realm);
 const mem = rId ? g.deepSystems?.societies?.memberships?.[rId] : null;
 const def = mem ? SOCIETIES[mem.societyId] : null;
 if (!mem || !def) {
  return { learning: 0, martial: 0, intrigue: 0, diplomacy: 0, stewardship: 0, researchBonus: 0, prestigeMonthly: 0, pietyMonthly: 0, vassalOpinion: 0, combatPower: 0, schemeBonus: 0 };
 }
 const scale = 0.5 + mem.rank * 0.25;
 return {
  learning: Math.round((def.perks.learning || 0) * scale),
  martial: Math.round((def.perks.martial || 0) * scale),
  intrigue: Math.round((def.perks.intrigue || 0) * scale),
  diplomacy: Math.round((def.perks.diplomacy || 0) * scale),
  stewardship: Math.round((def.perks.stewardship || 0) * scale),
  researchBonus: Math.round((def.perks.researchBonus || 0) * scale),
  prestigeMonthly: (def.perks.prestigeMonthly || 0) * scale,
  pietyMonthly: (def.perks.pietyMonthly || 0) * scale,
  vassalOpinion: Math.round((def.perks.vassalOpinion || 0) * scale),
  combatPower: (def.perks.combatPower || 0) * scale,
  schemeBonus: Math.round((def.perks.schemeBonus || 0) * scale)
 };
}

export const BLOODLINES = Object.freeze({
 bloodline_charlemagne: { id: 'bloodline_charlemagne', name: 'Carolingian Legacy', realms: ['france', 'burgundy', 'imperial'], historical: true, prestigeMonthly: 0.5, pietyMonthly: 0.2, vassalOpinion: 6, levyMod: 0.05, taxMod: 0.03 },
 bloodline_plantagenet: { id: 'bloodline_plantagenet', name: 'Angevin Lionheart Line', realms: ['england', 'scotland'], historical: true, prestigeMonthly: 0.5, pietyMonthly: 0.1, vassalOpinion: 5, levyMod: 0.06, taxMod: 0.02 },
 bloodline_osman: { id: 'bloodline_osman', name: 'Gazi House of Osman', realms: ['ottomans'], historical: true, prestigeMonthly: 0.6, pietyMonthly: 0.3, vassalOpinion: 7, levyMod: 0.08, taxMod: 0.03 },
 bloodline_rurik: { id: 'bloodline_rurik', name: 'Varangian Line of Rurik', realms: ['muscovy'], historical: true, prestigeMonthly: 0.5, pietyMonthly: 0.1, vassalOpinion: 6, levyMod: 0.04, taxMod: 0.05 },
 bloodline_timur: { id: 'bloodline_timur', name: 'Timurid Conqueror Line', realms: ['timurids'], historical: true, prestigeMonthly: 0.6, pietyMonthly: 0.1, vassalOpinion: 4, levyMod: 0.1, taxMod: 0 },
 bloodline_ming: { id: 'bloodline_ming', name: 'Mandate of Hongwu', realms: ['ming'], historical: true, prestigeMonthly: 0.5, pietyMonthly: 0.2, vassalOpinion: 6, levyMod: 0.02, taxMod: 0.07 },
 bloodline_solomon: { id: 'bloodline_solomon', name: 'Solomonic Dynasty', realms: ['ethiopia'], historical: true, prestigeMonthly: 0.4, pietyMonthly: 0.5, vassalOpinion: 7, levyMod: 0.04, taxMod: 0.03 },
 bloodline_inti: { id: 'bloodline_inti', name: 'Children of Inti', realms: ['inca'], historical: true, prestigeMonthly: 0.5, pietyMonthly: 0.4, vassalOpinion: 7, levyMod: 0.05, taxMod: 0.04 },
 bloodline_sangama: { id: 'bloodline_sangama', name: 'Vijayanagara Dharma Line', realms: ['vijayanagara'], historical: true, prestigeMonthly: 0.5, pietyMonthly: 0.3, vassalOpinion: 6, levyMod: 0.04, taxMod: 0.05 },
 bloodline_trastamara: { id: 'bloodline_trastamara', name: 'Reconquista Crown', realms: ['castile', 'aragon'], historical: true, prestigeMonthly: 0.45, pietyMonthly: 0.3, vassalOpinion: 5, levyMod: 0.05, taxMod: 0.03 },
 // Forged bloodline templates
 conqueror: { id: 'conqueror', name: 'Conqueror Bloodline', historical: false, prestigeMonthly: 0.6, pietyMonthly: 0.1, vassalOpinion: 5, levyMod: 0.08, taxMod: 0.02 },
 architect: { id: 'architect', name: 'Great Builder Bloodline', historical: false, prestigeMonthly: 0.45, pietyMonthly: 0.1, vassalOpinion: 5, levyMod: 0.02, taxMod: 0.08 },
 saint: { id: 'saint', name: 'Blessed Saintly Bloodline', historical: false, prestigeMonthly: 0.35, pietyMonthly: 0.7, vassalOpinion: 8, levyMod: 0.02, taxMod: 0.03 },
 diplomat: { id: 'diplomat', name: 'Peaceweaver Bloodline', historical: false, prestigeMonthly: 0.5, pietyMonthly: 0.2, vassalOpinion: 10, levyMod: 0.02, taxMod: 0.04 },
 philosopher: { id: 'philosopher', name: 'Scholarly Patron Bloodline', historical: false, prestigeMonthly: 0.45, pietyMonthly: 0.3, vassalOpinion: 6, levyMod: 0, taxMod: 0.06 }
});

function assignBloodlineToPersonAndDescendants(g, person, blId) {
 const d = ensureDeepSystems(g);
 if (!person) return;
 const queue = [person];
 const seen = new Set();
 while (queue.length) {
  const cur = queue.shift();
  if (!cur || seen.has(cur.id)) continue;
  seen.add(cur.id);
  const list = (d.bloodlines.members[cur.id] ??= []);
  if (!list.includes(blId)) list.push(blId);
  cur.bloodlines ??= [];
  if (!cur.bloodlines.includes(blId)) cur.bloodlines.push(blId);
  for (const cid of cur.children || []) {
   if (g.politics?.people?.[cid]) queue.push(g.politics.people[cid]);
  }
 }
}

function initBloodlinesForRealms(g) {
 const d = ensureDeepSystems(g);
 for (const [blId, def] of Object.entries(BLOODLINES)) {
  if (!def.historical) continue;
  if (!d.bloodlines.definitions[blId]) {
   d.bloodlines.definitions[blId] = { ...def, founderId: null, createdTurn: 0 };
  }
  for (const realm of def.realms || []) {
   const r = getRuler(g, realm);
   if (r && !(d.bloodlines.members[r.id] || []).includes(blId)) {
    assignBloodlineToPersonAndDescendants(g, r, blId);
   }
  }
 }
}

export function inheritBloodlines(g, child, parents = []) {
 const d = ensureDeepSystems(g);
 if (!child?.id || !d) return [];
 const set = new Set(d.bloodlines.members[child.id] || []);
 for (const par of parents) {
  if (!par?.id) continue;
  for (const blId of d.bloodlines.members[par.id] || par.bloodlines || []) {
   set.add(blId);
  }
 }
 const list = [...set];
 if (list.length) {
  d.bloodlines.members[child.id] = list;
  child.bloodlines = list;
 }
 return list;
}

export function characterBloodlines(g, personId) {
 const d = ensureDeepSystems(g);
 const ids = d?.bloodlines?.members?.[personId] || g.politics?.people?.[personId]?.bloodlines || [];
 return ids.map(id => d?.bloodlines?.definitions?.[id] || BLOODLINES[id]).filter(Boolean);
}

export function forgeBloodlineAmbition(g, kind = 'conqueror', personId = null) {
 const d = ensureDeepSystems(g);
 const pid = personId || getRulerId(g, g.player);
 const person = g.politics?.people?.[pid];
 if (!person?.alive) return no('Requires a living character.');
 const f = g.factions?.[person.realm];
 const tpl = BLOODLINES[kind] || BLOODLINES.conqueror;
 if (tpl.historical) return no('Choose a forgeable bloodline archetype (conqueror, architect, saint, diplomat, philosopher).');

 const prestige = Math.max(num(f?.prestige), num(person.prestige));
 if (prestige < 150) return no(`Forging a bloodline requires at least 150 prestige (currently ${Math.round(prestige)}).`);

 const alreadyForged = Object.values(d.bloodlines.definitions).some(b => !b.historical && b.founderId === pid);
 if (alreadyForged) return no(`${person.name} has already forged a dynastic bloodline.`);

 const blId = `forged_${pid}_${kind}_${g.turn || 0}`;
 const bl = {
  id: blId,
  name: `Blood of ${person.name}`,
  kind,
  historical: false,
  founderId: pid,
  founderName: person.name,
  dynasty: person.house,
  createdTurn: g.turn || 0,
  prestigeMonthly: tpl.prestigeMonthly,
  pietyMonthly: tpl.pietyMonthly,
  vassalOpinion: tpl.vassalOpinion,
  levyMod: tpl.levyMod,
  taxMod: tpl.taxMod
 };
 d.bloodlines.definitions[blId] = bl;
 assignBloodlineToPersonAndDescendants(g, person, blId);
 if (f) f.prestige += 25;
 person.prestige = num(person.prestige) + 25;
 addLog(g, person.realm, `${person.name} forged a legendary bloodline: ${bl.name}!`);
 return ok(`Bloodline forged: ${bl.name}!`, { bloodline: bl });
}

export function bloodlineModifiers(g, realm) {
 const rId = getRulerId(g, realm);
 const bls = rId ? characterBloodlines(g, rId) : [];
 let prestigeMonthly = 0;
 let pietyMonthly = 0;
 let vassalOpinion = 0;
 let taxMod = 1;
 let levyMod = 1;
 for (const b of bls) {
  prestigeMonthly += b.prestigeMonthly || 0;
  pietyMonthly += b.pietyMonthly || 0;
  vassalOpinion += b.vassalOpinion || 0;
  taxMod += b.taxMod || 0;
  levyMod += b.levyMod || 0;
 }
 return { prestigeMonthly, pietyMonthly, vassalOpinion, taxMod, levyMod, count: bls.length };
}

// ============================================================================
// 7. STRATEGIC COUNTY SIEGES, PROSPERITY, TRADE POSTS & GREAT WORKS
// ============================================================================

export function greatWorkFortBonus(g, pid) {
 const gw = g.deepSystems?.greatWorks?.[pid];
 if (!gw || gw.kind !== 'grand_fortress') return 0;
 return (gw.completedStages || 0);
}

export function activeSiegeAt(g, provinceId) {
 return Object.values(g.deepSystems?.sieges || {}).find(s => s.status === 'active' && s.provinceId === provinceId) || null;
}

export function initSiegeForMarch(g, fromId, toId, armyIds = null, opts = {}) {
 const d = ensureDeepSystems(g);
 const p = g.provinces?.[toId];
 if (!p) return no('Invalid target province.');
 const defender = getController(g, toId);
 const attackerArmies = (Array.isArray(armyIds) && armyIds.length
  ? armyIds.map(id => g.armies?.[id]).filter(Boolean)
  : Object.values(g.armies || {}).filter(a => a.owner === (opts.attacker || g.player) && (a.province === fromId || a.province === toId) && !a.contingent)
 ).filter(a => num(a.infantry) + num(a.archers) + num(a.cavalry) > 0);

 if (!attackerArmies.length) return no('No besieging field army available.');
 const attacker = opts.attacker || attackerArmies[0].owner;
 if (attacker === defender) return no('Province is already controlled by the attacker.');

 const existing = activeSiegeAt(g, toId);
 if (existing) return ok('Reinforced existing siege.', { siege: existing, marchId: existing.id });

 const fortLevel = Math.max(0, num(p.buildings?.fort)) + greatWorkFortBonus(g, toId);
 const maxGarrison = Math.round(45 + num(p.development) * 12 + fortLevel * 85);
 const war = Object.values(g.conflict?.wars || {}).find(
  w => w.status === 'active' && pair(w.attacker, w.defender) === pair(attacker, defender)
 );
 const id = opts.marchId || `siege_${toId}_${g.turn || 0}_${Object.keys(d.sieges).length + 1}`;
 const siege = {
  id,
  marchId: id,
  provinceId: toId,
  fromId,
  attacker,
  defender,
  warId: war?.id || null,
  armyIds: attackerArmies.map(a => a.id),
  fortLevel,
  maxGarrison,
  garrison: maxGarrison,
  initialGarrison: maxGarrison,
  progress: 0,
  breach: 0,
  attackerLosses: 0,
  defenderLosses: 0,
  startedTurn: g.turn || 0,
  status: 'active'
 };
 d.sieges[id] = siege;
 addLog(g, attacker, `Besieged ${p.name || toId} (Fort level ${fortLevel}, Garrison ${maxGarrison}).`);
 return ok(`Siege begun at ${p.name || toId}.`, { siege, marchId: id });
}

function finalizeCapturedSiege(g, siege) {
 const p = g.provinces?.[siege.provinceId];
 if (!p) return;
 siege.status = 'captured';
 siege.progress = 100;
 siege.endedTurn = g.turn || 0;

 const war = siege.warId ? g.conflict?.wars?.[siege.warId] : Object.values(g.conflict?.wars || {}).find(
  w => w.status === 'active' && pair(w.attacker, w.defender) === pair(siege.attacker, siege.defender)
 );
 if (war && war.status === 'active') {
  // Occupy during active war and award real warscore
  g.campaignWar ??= { version: 1, occupations: {}, history: [], lastTick: -1 };
  g.campaignWar.occupations ??= {};
  if (p.owner === siege.attacker) {
   delete g.campaignWar.occupations[p.id];
  } else {
   g.campaignWar.occupations[p.id] = { province: p.id, by: siege.attacker, owner: p.owner, war: war.id, from: siege.fromId, started: g.turn || 0 };
  }
  const sign = siege.attacker === war.attacker ? 1 : -1;
  const scoreDelta = war.goal === p.id ? 35 : 18;
  war.score = clamp((war.score || 0) + sign * scoreDelta, -100, 100);
  if (war.goal === p.id && siege.attacker === war.attacker) war.score = Math.max(65, war.score);
  if (war.civilWar && g.conflict?.factions?.[war.factionId]) {
   g.conflict.factions[war.factionId].score = clamp(-war.score, -100, 100);
  }
 } else {
  // Outside formal war (or against independent polity), transfer province directly
  p.owner = siege.attacker;
  delete g.independentPolities?.[p.id];
  if (g.politics?.realms?.[siege.attacker] && g.politics.holdings) {
   const lordId = getRulerId(g, siege.attacker);
   g.politics.holdings[p.id] = { realm: siege.attacker, lord: lordId, loyalty: 60, tax: 1, levy: 1, autonomy: 1, wealth: 0, concessionUntil: 0 };
   if (g.feudal?.titles) {
    const dist = Object.values(g.feudal.districts || {}).find(dx => dx.members?.includes(p.id));
    g.feudal.titles['c:' + p.id] = {
     id: 'c:' + p.id, tier: 'province', feudalTier: 'county', rank: 2,
     realm: siege.attacker, deJureRealm: dist?.deJureRealm || siege.attacker, deJureParent: dist?.id || null,
     deFactoLiege: null, holder: lordId, parent: 'k:' + siege.attacker, name: p.id, province: p.id
    };
   }
  }
 }

 // Move besieging armies into captured province
 for (const aid of siege.armyIds || []) {
  const a = g.armies?.[aid];
  if (a && a.owner === siege.attacker) a.province = p.id;
 }
 p.unrest = clamp((p.unrest || 0) + 18, 0, 100);
 adjustProvinceProsperity(g, p.id, -45);
 if (g.economy?.provinces?.[p.id]) {
  g.economy.provinces[p.id].devastation = clamp((g.economy.provinces[p.id].devastation || 0) + 12, 0, 100);
 }
 if (g.factions?.[siege.attacker]) g.factions[siege.attacker].prestige = (g.factions[siege.attacker].prestige || 0) + 6;
 if (g.deepSystems?.crusade?.status === 'active' && siege.defender === g.deepSystems.crusade.targetFaction) {
  contributeToCrusade(g, siege.attacker, 25);
 }
 addLog(g, siege.attacker, `${p.name || p.id} surrendered to siege!`);
}

export function advanceProvinceSieges(g, world = null) {
 const d = ensureDeepSystems(g);
 const resolved = [];
 for (const siege of Object.values(d.sieges)) {
  if (siege.status !== 'active') continue;
  const p = g.provinces?.[siege.provinceId];
  if (!p || getController(g, siege.provinceId) === siege.attacker) {
   siege.status = 'lifted';
   continue;
  }
  const armies = (siege.armyIds || []).map(id => g.armies?.[id]).filter(
   a => a && a.owner === siege.attacker && (num(a.infantry) + num(a.archers) + num(a.cavalry)) > 0
  );
  if (!armies.length) {
   siege.status = 'lifted';
   continue;
  }
  if (siege.warId && g.conflict?.wars?.[siege.warId]?.status !== 'active') {
   siege.status = 'lifted';
   continue;
  }

  const totalTroops = armies.reduce((s, a) => s + num(a.infantry) + num(a.archers) + num(a.cavalry), 0);
  const enginePower = armies.reduce((s, a) => {
   const eng = g.military?.armies?.[a.id]?.engines;
   return s + (eng ? num(eng.ram) * 12 + num(eng.catapult) * 20 + num(eng.bombard) * 32 : 0);
  }, 0);
  const ratio = totalTroops / Math.max(40, siege.garrison);
  const fortResist = 1 + (siege.fortLevel || 0) * 0.35;
  const progressGain = clamp(Math.round((12 + ratio * 14 + enginePower * 0.4) / fortResist), 6, 45);
  const breachGain = clamp(Math.round((8 + enginePower * 0.8 + ratio * 5) / fortResist), 4, 40);

  siege.progress = clamp(siege.progress + progressGain, 0, 100);
  siege.breach = clamp(siege.breach + breachGain, 0, 100);

  const defLoss = Math.min(siege.garrison, Math.max(5, Math.round(siege.maxGarrison * (0.08 + enginePower * 0.002))));
  const attLossRate = clamp(0.015 + (siege.fortLevel || 0) * 0.008, 0.01, 0.05);
  let attLost = 0;
  for (const a of armies) {
   const loss = Math.round((num(a.infantry) + num(a.archers) + num(a.cavalry)) * attLossRate);
   attLost += loss;
   a.infantry = Math.max(0, Math.round(a.infantry * (1 - attLossRate)));
   a.archers = Math.max(0, Math.round(a.archers * (1 - attLossRate)));
   a.cavalry = Math.max(0, Math.round(a.cavalry * (1 - attLossRate)));
  }
  siege.garrison = Math.max(0, siege.garrison - defLoss);
  siege.defenderLosses += defLoss;
  siege.attackerLosses += attLost;

  if (siege.progress >= 100 || siege.garrison <= 0) {
   finalizeCapturedSiege(g, siege);
   resolved.push(siege);
  }
 }
 return resolved;
}

export function assaultSiege(g, marchId) {
 const d = ensureDeepSystems(g);
 const siege = d.sieges?.[marchId] || Object.values(d.sieges || {}).find(s => s.status === 'active' && s.provinceId === marchId);
 if (!siege || siege.status !== 'active') return no('No active siege found.');
 const armies = (siege.armyIds || []).map(id => g.armies?.[id]).filter(
  a => a && a.owner === siege.attacker && (num(a.infantry) + num(a.archers) + num(a.cavalry)) > 0
 );
 if (!armies.length) return no('No besieging troops remain for an assault.');

 const totalTroops = armies.reduce((s, a) => s + num(a.infantry) + num(a.archers) + num(a.cavalry), 0);
 const breachBonus = 1 + (siege.breach || 0) / 70;
 const fortPenalty = 1 + (siege.fortLevel || 0) * 0.35 - (siege.breach || 0) / 140;
 const effectiveAttack = totalTroops * breachBonus;
 const effectiveDefense = Math.max(20, siege.garrison * Math.max(0.65, fortPenalty));
 const ratio = effectiveAttack / effectiveDefense;

 const defDamage = Math.min(siege.garrison, Math.max(15, Math.round(siege.garrison * clamp(0.45 * ratio, 0.25, 1.0))));
 const attLossFrac = clamp((0.26 - (siege.breach || 0) * 0.0014) / Math.max(0.5, ratio), 0.05, 0.45);
 let attCasualties = 0;
 for (const a of armies) {
  const before = num(a.infantry) + num(a.archers) + num(a.cavalry);
  a.infantry = Math.max(0, Math.round(a.infantry * (1 - attLossFrac)));
  a.archers = Math.max(0, Math.round(a.archers * (1 - attLossFrac)));
  a.cavalry = Math.max(0, Math.round(a.cavalry * (1 - attLossFrac)));
  attCasualties += before - (num(a.infantry) + num(a.archers) + num(a.cavalry));
 }
 siege.garrison = Math.max(0, siege.garrison - defDamage);
 siege.defenderLosses += defDamage;
 siege.attackerLosses += attCasualties;
 siege.breach = clamp(siege.breach + 25, 0, 100);
 siege.progress = clamp(siege.progress + Math.round(35 * clamp(ratio, 0.5, 2.5)), 0, 100);

 const captured = siege.garrison <= 0 || siege.progress >= 100;
 if (captured) {
  finalizeCapturedSiege(g, siege);
  return ok(`Assault succeeded! ${siege.provinceId} captured.`, {
   captured: true,
   siege,
   attackerCasualties: attCasualties,
   defenderCasualties: defDamage
  });
 }
 return ok(`Assault pressed (${siege.progress}% progress, ${siege.garrison} garrison remaining).`, {
  captured: false,
  siege,
  attackerCasualties: attCasualties,
  defenderCasualties: defDamage
 });
}

export function getProvinceProsperity(g, pid) {
 return clamp(Math.floor(num(g.deepSystems?.prosperity?.[pid]?.tier ?? g.provinces?.[pid]?.prosperity ?? 0)), 0, 3);
}

export function adjustProvinceProsperity(g, pid, progressDelta) {
 const d = ensureDeepSystems(g);
 const p = g.provinces?.[pid];
 if (!p) return 0;
 const rec = (d.prosperity[pid] ??= { tier: clamp(Math.floor(num(p.prosperity)), 0, 3), progress: 0 });
 rec.progress += progressDelta;
 while (rec.progress >= 100 && rec.tier < 3) {
  rec.progress -= 100;
  rec.tier++;
 }
 while (rec.progress < 0 && rec.tier > 0) {
  rec.progress += 100;
  rec.tier--;
 }
 rec.progress = clamp(rec.progress, 0, 100);
 p.prosperity = rec.tier;
 return rec.tier;
}

export function prosperityModifiers(g, realm) {
 const land = ownedProvinces(g, realm);
 if (!land.length) return { avgTier: 0, tax: 1, levy: 1 };
 const avg = land.reduce((s, p) => s + getProvinceProsperity(g, p.id), 0) / land.length;
 return {
  avgTier: Math.round(avg * 100) / 100,
  tax: 1 + avg * 0.1,
  levy: 1 + avg * 0.08
 };
}

export function buildTradePost(g, pid, realm = g.player) {
 const d = ensureDeepSystems(g);
 const p = g.provinces?.[pid];
 const f = g.factions?.[realm];
 if (!p || !f) return no('Invalid province or realm.');
 const owned = p.owner === realm && getController(g, pid) === realm;
 const indCompact = p.owner === 'independent' && g.independentPolities?.[pid]?.tradeCompactWith === realm;
 if (!owned && !indCompact) {
  return no('Trade post requires controlling the province or holding a trade compact with an independent polity.');
 }
 const cur = d.tradePosts[pid];
 const nextLevel = cur ? cur.level + 1 : 1;
 if (nextLevel > 3) return no('Trade post already at maximum level (3).');
 const cost = 150 * nextLevel;
 if (f.treasury < cost) return no(`Need ${cost} gold to build Trade Post level ${nextLevel}.`);

 f.treasury -= cost;
 d.tradePosts[pid] = {
  provinceId: pid,
  owner: realm,
  level: nextLevel,
  builtTurn: cur?.builtTurn ?? (g.turn || 0),
  upgradedTurn: g.turn || 0
 };
 adjustProvinceProsperity(g, pid, 20);
 addLog(g, realm, `Constructed Trade Post (Level ${nextLevel}) in ${p.name || pid}.`);
 return ok(`Trade Post level ${nextLevel} built in ${pid}.`, { tradePost: d.tradePosts[pid] });
}

export function tradePostIncome(g, realm) {
 let sum = 0;
 for (const tp of Object.values(g.deepSystems?.tradePosts || {})) {
  if (tp.owner !== realm) continue;
  const p = g.provinces?.[tp.provinceId];
  if (!p) continue;
  sum += Math.round((12 + num(p.development) * 1.5) * (tp.level || 1));
 }
 return sum;
}

export const GREAT_WORK_KINDS = Object.freeze({
 cathedral: { id: 'cathedral', name: 'Grand Cathedral', cost: 400, stageCost: 300, monthsPerStage: 12, pietyMonthly: 1.0, moralAuthority: 4, unrest: -2, taxBonus: 0.05 },
 grand_fortress: { id: 'grand_fortress', name: 'Grand Fortress', cost: 420, stageCost: 320, monthsPerStage: 12, fortBonus: 2, defenseBonus: 0.25, levyBonus: 0.12 },
 university: { id: 'university', name: 'Great University', cost: 400, stageCost: 300, monthsPerStage: 12, researchBonus: 4, taxBonus: 0.06 },
 royal_palace: { id: 'royal_palace', name: 'Royal Palace', cost: 450, stageCost: 350, monthsPerStage: 12, prestigeMonthly: 1.2, vassalOpinion: 8, legitimacyMonthly: 0.3, taxBonus: 0.05 }
});

export function startGreatWork(g, pid, kind, realm = g.player) {
 const d = ensureDeepSystems(g);
 const def = GREAT_WORK_KINDS[kind];
 const p = g.provinces?.[pid];
 const f = g.factions?.[realm];
 if (!def) return no('Unknown Great Work kind (cathedral, grand_fortress, university, royal_palace).');
 if (!p || !f || p.owner !== realm || getController(g, pid) !== realm) {
  return no('Great Works must be constructed in a controlled province.');
 }
 if (d.greatWorks[pid]) return no(`A Great Work (${d.greatWorks[pid].name}) already exists in ${pid}.`);
 if (f.treasury < def.cost) return no(`Need ${def.cost} gold to begin ${def.name}.`);

 f.treasury -= def.cost;
 f.prestige = (f.prestige || 0) + 10;
 d.greatWorks[pid] = {
  id: `gw_${pid}`,
  provinceId: pid,
  kind,
  name: def.name,
  realm,
  stage: 1,
  maxStage: 3,
  completedStages: 0,
  progress: 0,
  status: 'constructing',
  startedTurn: g.turn || 0
 };
 addLog(g, realm, `Began construction of ${def.name} in ${p.name || pid}.`);
 return ok(`${def.name} construction begun in ${pid}.`, { greatWork: d.greatWorks[pid] });
}

export function upgradeGreatWork(g, pid, realm = g.player) {
 const d = ensureDeepSystems(g);
 const gw = d.greatWorks?.[pid];
 const f = g.factions?.[realm];
 if (!gw || gw.realm !== realm || g.provinces?.[pid]?.owner !== realm) return no('No owned Great Work in this province.');
 if (gw.completedStages >= gw.maxStage) return no(`${gw.name} is already completed (Stage 3).`);
 const def = GREAT_WORK_KINDS[gw.kind];
 const cost = def?.stageCost || 300;
 if (!f || f.treasury < cost) return no(`Need ${cost} gold to accelerate Great Work construction.`);
 f.treasury -= cost;
 gw.progress = 100;
 gw.completedStages++;
 gw.stage = Math.min(gw.maxStage, gw.completedStages + 1);
 if (gw.completedStages >= gw.maxStage) {
  gw.status = 'completed';
  gw.stage = gw.maxStage;
 }
 f.prestige = (f.prestige || 0) + 25;
 adjustProvinceProsperity(g, pid, 40);
 addLog(g, realm, `${gw.name} in ${pid} completed stage ${gw.completedStages}/${gw.maxStage}!`);
 return ok(`${gw.name} advanced to stage ${gw.completedStages}/${gw.maxStage}.`, { greatWork: gw });
}

export function greatWorkModifiers(g, realm) {
 let tax = 1;
 let levy = 1;
 let prestigeMonthly = 0;
 let pietyMonthly = 0;
 let researchBonus = 0;
 let vassalOpinion = 0;
 let legitimacyMonthly = 0;
 for (const gw of Object.values(g.deepSystems?.greatWorks || {})) {
  if (g.provinces?.[gw.provinceId]?.owner !== realm) continue;
  const stages = gw.completedStages || 0;
  if (stages <= 0) continue;
  const def = GREAT_WORK_KINDS[gw.kind];
  if (!def) continue;
  const mult = stages / 3;
  tax += (def.taxBonus || 0) * mult;
  levy += (def.levyBonus || 0) * mult;
  prestigeMonthly += (def.prestigeMonthly || 0) * mult;
  pietyMonthly += (def.pietyMonthly || 0) * mult;
  researchBonus += Math.round((def.researchBonus || 0) * mult);
  vassalOpinion += Math.round((def.vassalOpinion || 0) * mult);
  legitimacyMonthly += (def.legitimacyMonthly || 0) * mult;
 }
 return { tax, levy, prestigeMonthly, pietyMonthly, researchBonus, vassalOpinion, legitimacyMonthly };
}

// ============================================================================
// 8. CROSS-SYSTEM CONSEQUENCE ENGINE
// ============================================================================

export function applyCrossSystemChoice(g, effectSpec = {}, opts = {}) {
 const d = ensureDeepSystems(g);
 if (!effectSpec || typeof effectSpec !== 'object') return [];

 const realm = effectSpec.realm || opts.realm || g.player;
 const f = g.factions?.[realm];
 const rId = getRulerId(g, realm);
 const personId = effectSpec.personId || opts.personId || rId;
 const person = personId ? g.politics?.people?.[personId] : null;
 const badges = [];
 const pushBadge = (key, label, delta, unit = '') => {
  if (!delta) return;
  const sign = delta > 0 ? '+' : '';
  badges.push({
   key,
   label,
   delta,
   value: delta,
   text: `${sign}${delta}${unit ? ' ' + unit : ''} ${label}`.trim(),
   tone: delta > 0 ? 'positive' : 'negative'
  });
 };

 if (Number.isFinite(effectSpec.gold) && effectSpec.gold !== 0 && f) {
  f.treasury = Math.round(f.treasury + effectSpec.gold);
  pushBadge('gold', 'Treasury', effectSpec.gold, 'Gold');
 }
 if (Number.isFinite(effectSpec.prestige) && effectSpec.prestige !== 0 && f) {
  f.prestige = Math.max(0, (f.prestige || 0) + effectSpec.prestige);
  if (person) person.prestige = Math.max(0, num(person.prestige) + effectSpec.prestige);
  pushBadge('prestige', 'Prestige', effectSpec.prestige);
 }
 if (Number.isFinite(effectSpec.piety) && effectSpec.piety !== 0) {
  if (person) person.piety = Math.max(0, num(person.piety) + effectSpec.piety);
  if (f) f.piety = Math.max(0, num(f.piety) + effectSpec.piety);
  pushBadge('piety', 'Piety', effectSpec.piety);
 }
 if (Number.isFinite(effectSpec.legitimacy) && effectSpec.legitimacy !== 0 && f) {
  f.legitimacy = clamp((f.legitimacy || 50) + effectSpec.legitimacy, 0, 100);
  pushBadge('legitimacy', 'Legitimacy', effectSpec.legitimacy);
 }
 if (Number.isFinite(effectSpec.stability) && effectSpec.stability !== 0 && f) {
  f.stability = clamp((f.stability || 50) + effectSpec.stability, 0, 100);
  pushBadge('stability', 'Stability', effectSpec.stability);
 }
 if (Number.isFinite(effectSpec.threat) && effectSpec.threat !== 0) {
  g.diplomacy ??= { version: 1, pacts: {}, guarantees: {}, aid: {}, passage: {}, tributes: {}, hostages: {}, coalitions: {}, threat: {}, history: [], lastTick: -1 };
  g.diplomacy.threat ??= {};
  g.diplomacy.threat[realm] = clamp((g.diplomacy.threat[realm] || 0) + effectSpec.threat, 0, 100);
  pushBadge('threat', 'Threat', effectSpec.threat);
 }
 if (Number.isFinite(effectSpec.moralAuthority) && effectSpec.moralAuthority !== 0) {
  const faith = effectSpec.faith || getRealmFaith(g, realm);
  adjustMoralAuthority(g, faith, effectSpec.moralAuthority);
  pushBadge('moralAuthority', 'Moral Authority', effectSpec.moralAuthority);
 }
 if (Number.isFinite(effectSpec.vassalOpinion) && effectSpec.vassalOpinion !== 0) {
  for (const h of Object.values(g.politics?.holdings || {})) {
   if (h.realm === realm && h.lord !== rId) {
    h.loyalty = clamp((h.loyalty || 50) + effectSpec.vassalOpinion, 0, 100);
    if (rId && h.lord) adjustPersonalOpinion(g, rId, h.lord, Math.round(effectSpec.vassalOpinion * 0.75));
   }
  }
  pushBadge('vassalOpinion', 'Vassal Opinion', effectSpec.vassalOpinion);
 }
 if (effectSpec.factionRelation !== undefined && f) {
  if (typeof effectSpec.factionRelation === 'number' && effectSpec.factionRelation !== 0) {
   const targetRealm = effectSpec.targetRealm || opts.targetRealm;
   if (targetRealm && g.factions?.[targetRealm]) {
    f.relations ??= {};
    g.factions[targetRealm].relations ??= {};
    f.relations[targetRealm] = clamp((f.relations[targetRealm] || 0) + effectSpec.factionRelation, -100, 100);
    g.factions[targetRealm].relations[realm] = clamp((g.factions[targetRealm].relations[realm] || 0) + effectSpec.factionRelation, -100, 100);
    pushBadge('factionRelation', `${g.factions[targetRealm].name} Relation`, effectSpec.factionRelation);
   }
  } else if (effectSpec.factionRelation && typeof effectSpec.factionRelation === 'object') {
   for (const [other, val] of Object.entries(effectSpec.factionRelation)) {
    if (!Number.isFinite(val) || val === 0 || !g.factions?.[other]) continue;
    f.relations ??= {};
    g.factions[other].relations ??= {};
    f.relations[other] = clamp((f.relations[other] || 0) + val, -100, 100);
    g.factions[other].relations[realm] = clamp((g.factions[other].relations[realm] || 0) + val, -100, 100);
    pushBadge('factionRelation', `${g.factions[other].name} Relation`, val);
   }
  }
 }
 if (Number.isFinite(effectSpec.courtLoyalty) && effectSpec.courtLoyalty !== 0) {
  const councilIds = Object.values(g.politics?.realms?.[realm]?.council || {});
  const officeIds = Object.values(g.royalCourt?.realms?.[realm]?.offices || {}).map(o => o.person);
  for (const cid of new Set([...councilIds, ...officeIds])) {
   if (cid && cid !== rId && rId) adjustPersonalOpinion(g, rId, cid, effectSpec.courtLoyalty);
  }
  pushBadge('courtLoyalty', 'Court Loyalty', effectSpec.courtLoyalty);
 }
 if (effectSpec.addTrait && person) {
  const list = Array.isArray(effectSpec.addTrait) ? effectSpec.addTrait : [effectSpec.addTrait];
  for (const tr of list) {
   if (CONGENITAL_TRAITS[tr]) {
    person.congenital ??= [];
    if (!person.congenital.includes(tr)) {
     person.congenital.push(tr);
     applyTraitStatDelta(person, CONGENITAL_TRAITS[tr], 1);
    }
   } else {
    person.traits ??= [];
    if (!person.traits.includes(tr)) person.traits.push(tr);
   }
   badges.push({ key: 'addTrait', label: 'Trait Gained', delta: 1, value: tr, text: `+Trait: ${tr}`, tone: 'positive' });
  }
 }
 if (effectSpec.removeTrait && person) {
  const list = Array.isArray(effectSpec.removeTrait) ? effectSpec.removeTrait : [effectSpec.removeTrait];
  for (const tr of list) {
   if (person.congenital?.includes(tr)) {
    person.congenital = person.congenital.filter(x => x !== tr);
    applyTraitStatDelta(person, CONGENITAL_TRAITS[tr], -1);
   }
   if (person.traits?.includes(tr)) {
    person.traits = person.traits.filter(x => x !== tr);
   }
   badges.push({ key: 'removeTrait', label: 'Trait Lost', delta: -1, value: tr, text: `-Trait: ${tr}`, tone: 'neutral' });
  }
 }
 if (Number.isFinite(effectSpec.prosperityDelta) && effectSpec.prosperityDelta !== 0) {
  const provId = effectSpec.provinceId || opts.provinceId;
  const targets = provId === 'all'
   ? ownedProvinces(g, realm).map(p => p.id)
   : [provId || ownedProvinces(g, realm)[0]?.id].filter(Boolean);
  for (const pid of targets) {
   adjustProvinceProsperity(g, pid, effectSpec.prosperityDelta * 100);
  }
  pushBadge('prosperityDelta', 'Prosperity', effectSpec.prosperityDelta);
 }
 if (effectSpec.followup) {
  const fu = typeof effectSpec.followup === 'string'
   ? { id: effectSpec.followup, delayTurns: 3, effectSpec: {}, label: effectSpec.followup }
   : effectSpec.followup;
  const dueTurn = (g.turn || 0) + Math.max(1, num(fu.delayTurns || 3));
  d.followups.push({
   id: fu.id || `fu_${g.turn || 0}_${d.followups.length + 1}`,
   realm,
   dueTurn,
   label: fu.label || fu.id || 'Follow-up Event',
   effectSpec: fu.effectSpec || null,
   applied: false
  });
  badges.push({ key: 'followup', label: 'Scheduled Follow-up', delta: 1, value: fu.id || fu.label, text: `Follow-up in ${Math.max(1, num(fu.delayTurns || 3))} mo`, tone: 'neutral' });
 }

 return badges;
}

// ============================================================================
// MONTHLY SIMULATION TICK & VIEW AGGREGATION
// ============================================================================

function isHumanActiveRealm(g, realm) {
 const vassalMode = g?.playerCareer?.mode === 'vassal';
 return realm === g?.player && !vassalMode;
}

/**
 * Staggered deterministic AI participation across deep CK2 systems
 * (Societies, Coronations, Schools, Trade Posts, Great Works, Hospitals, Crusades, Cardinals).
 */
export function tickDeepAiAutonomy(g, world = null) {
 const d = ensureDeepSystems(g);
 if (!d || !g.turn || (g.turn % 3) !== 0) return;
 const quarterSlot = Math.floor(g.turn / 3);
 const provByOwner = new Map();
 for (const p of Object.values(g.provinces || {})) {
  if (!p?.owner || p.owner === 'independent') continue;
  let arr = provByOwner.get(p.owner);
  if (!arr) { arr = []; provByOwner.set(p.owner, arr); }
  arr.push(p);
 }

 const crusadeActive = d.crusade?.status === 'active';
 const existingGreatWorkRealms = new Set();
 for (const gw of Object.values(d.greatWorks || {})) {
  const owner = g.provinces?.[gw.provinceId]?.owner;
  if (owner) existingGreatWorkRealms.add(owner);
 }

 for (const realm of Object.keys(g.politics?.realms || {})) {
  if (isHumanActiveRealm(g, realm)) continue;
  const f = g.factions?.[realm];
  const r = getRuler(g, realm);
  if (!f || !r?.alive || (r.age || 0) < 16) continue;
  const land = provByOwner.get(realm) || [];
  if (!land.length) continue;

  const h = hashStr(realm);
  // Stagger realms every 2 quarters (~6 months) to preserve tight campaign pacing & CPU budget
  if (((h + quarterSlot) & 1) !== 0) continue;

  const sortedLand = land.slice().sort((a, b) => (b.development || 0) - (a.development || 0) || a.id.localeCompare(b.id));
  const capProv = sortedLand[0];
  const capId = capProv.id;

  // 1. Coronation if ruler uncrowned
  if (d.coronations?.[realm]?.rulerId !== r.id && g.heritage?.realms?.[realm]?.lastCoronation !== r.id && f.treasury >= 240) {
   const tier = f.treasury >= 520 && land.length >= 8 ? 'imperial' : f.treasury >= 340 ? 'royal' : 'modest';
   coronateRuler(g, realm, tier);
  }

  // 2. Societies: join, complete mission, or advance rank
  const mem = d.societies?.memberships?.[r.id];
  if (!mem) {
   const sk = r.skills || {};
   const traits = r.traits || [];
   const socId = (traits.includes('brave') || (sk.martial || 0) >= 4) ? 'warrior_lodge'
    : (traits.includes('deceitful') || (sk.intrigue || 0) >= 4) ? 'assassins_order'
     : ((sk.learning || 0) >= 4) ? 'hermetic_society' : 'monastic_order';
   joinSociety(g, socId, r.id);
  } else {
   if (mem.rank < 4 && (mem.devotion || 0) >= SOCIETY_RANK_THRESHOLDS[mem.rank]) {
    advanceSocietyRank(g, r.id);
   } else if ((g.turn - (mem.lastMissionTurn ?? -120)) >= 3) {
    societyMission(g, r.id);
   }
  }

  // 3. Religious School adoption
  if (!selectedReligiousSchool(g, realm) && f.treasury >= 240) {
   const faith = getRealmFaith(g, realm);
   const sys = resolveFaithSystem(g, faith);
   const fam = resolveFaithFamily(g, faith);
   const compat = Object.values(RELIGIOUS_SCHOOLS).filter(sc =>
    sys === sc.system || (fam && sc.families.includes(fam)) || sys === 'traditional' || (sys === 'orthodox' && sc.system === 'catholic')
   );
   if (compat.length) {
    selectReligiousSchool(g, realm, compat[(h + quarterSlot) % compat.length].id);
   }
  }

  // 4. Epidemic Hospital & Court Isolation response
  const hasEpi = land.some(p => g.economy?.crises?.[p.id]?.kind === 'epidemic' || g.heritage?.epidemics?.[p.id]);
  if (hasEpi && !isCourtIsolated(g, realm)) {
   toggleCourtIsolation(g, realm);
  } else if (!hasEpi && isCourtIsolated(g, realm)) {
   toggleCourtIsolation(g, realm);
  }
  const capInd = g.economy?.provinces?.[capId]?.industries;
  if (capInd && (capInd.infirmary || 0) < 2 && f.treasury >= (hasEpi ? 420 : 680)) {
   f.treasury -= 250;
   capInd.infirmary = (capInd.infirmary || 0) + 1;
  }

  // 5. Crusade Pledging for same faith system
  if (crusadeActive && !d.crusade.pledged?.[realm] && realm !== d.crusade.targetFaction && f.treasury >= 200) {
   const sys = resolveFaithSystem(g, getRealmFaith(g, realm));
   if (sys === d.crusade.callerSystem && (f.relations?.[d.crusade.targetFaction] || 0) <= 10) {
    pledgeCrusade(g, realm);
   }
  }

  // 6. Catholic Curia Cardinal patronage
  if (resolveFaithSystem(g, getRealmFaith(g, realm)) === 'catholic' && f.treasury >= 650 && ((h + quarterSlot) % 5 === 0)) {
   const col = initCardinals(g);
   const ownSeats = col.seats.filter(s => s.realm === realm).length;
   const scholarId = g.politics?.realms?.[realm]?.council?.scholar;
   if (ownSeats < 2 && scholarId && !col.seats.some(s => s.personId === scholarId)) {
    promoteCardinal(g, scholarId, 150, realm);
   }
  }

  // 7. Trade Posts & Great Works investment when wealthy
  if (f.treasury >= 620 && ((h + quarterSlot) % 4 === 0)) {
   const tpTarget = sortedLand.find(p => getController(g, p.id) === realm && (!d.tradePosts?.[p.id] || d.tradePosts[p.id].level < 3));
   if (tpTarget) buildTradePost(g, tpTarget.id, realm);
  }
  if (!existingGreatWorkRealms.has(realm) && land.length >= 4 && f.treasury >= 1150 && getController(g, capId) === realm) {
   const kinds = ['royal_palace', 'cathedral', 'university', 'grand_fortress'];
   const kind = kinds[(h + r.age) % kinds.length];
   if (startGreatWork(g, capId, kind, realm).ok) {
    existingGreatWorkRealms.add(realm);
   }
  } else if (existingGreatWorkRealms.has(realm) && f.treasury >= 980 && ((h + quarterSlot) % 4 === 0)) {
   const gw = Object.values(d.greatWorks || {}).find(w => w.realm === realm && w.status === 'constructing' && g.provinces?.[w.provinceId]?.owner === realm);
   if (gw) upgradeGreatWork(g, gw.provinceId, realm);
  }
 }
}

export function tickDeepSystems(g, world = null) {
 const d = ensureDeepSystems(g);
 if (!d || d.lastTick === g.turn) return d;
 d.lastTick = g.turn;

 // 1. Independent polities
 tickIndependentPolities(g, world);

 // 2. Advance active province sieges
 advanceProvinceSieges(g, world);

 // 3. Age-16 education & genetics check for youths + monthly congenital/bloodline/society/great-work bonuses
 const quarterly = (g.turn % 3) === 0;
 const annual = (g.turn % 12) === 0;

 for (const p of Object.values(g.politics?.people || {})) {
  if (!p?.alive) {
   if (p && (p.spouse || p.spouses?.length)) {
    const spList = [p.spouse, ...(p.spouses || [])].filter(Boolean);
    for (const sid of spList) {
     const sp = g.politics.people[sid];
     if (!sp) continue;
     if (sp.spouse === p.id) sp.spouse = null;
     if (Array.isArray(sp.spouses)) sp.spouses = sp.spouses.filter(id => id !== p.id);
     delete sp.marriageLineage;
    }
    p.spouse = null;
    p.spouses = [];
    delete p.marriageLineage;
    revertViceroyaltiesOnDeath(g, p);
   }
   continue;
  }
  if ((p.age || 0) >= 16 && !p.educationTrait) {
   completeChildEducation(g, p);
  }
 }

 for (const realm of Object.keys(g.politics?.realms || {})) {
  const f = g.factions?.[realm];
  const r = getRuler(g, realm);
  if (!f || !r?.alive) continue;

  const genMod = characterGeneticModifiers(r);
  const blMod = bloodlineModifiers(g, realm);
  const socMod = societyModifiers(g, realm);
  const minMod = minorTitleModifiers(g, realm);
  const gwMod = greatWorkModifiers(g, realm);

  const monthlyPrestige = genMod.prestigeMonthly + blMod.prestigeMonthly + socMod.prestigeMonthly + gwMod.prestigeMonthly + minMod.prestigeMonthly * 0.5;
  const monthlyPiety = genMod.pietyMonthly + blMod.pietyMonthly + socMod.pietyMonthly + gwMod.pietyMonthly;

  if (monthlyPrestige !== 0) {
   f.prestige = Math.max(0, (f.prestige || 0) + monthlyPrestige);
   r.prestige = Math.max(0, num(r.prestige) + monthlyPrestige);
  }
  if (monthlyPiety !== 0) {
   r.piety = Math.max(0, num(r.piety) + monthlyPiety);
   f.piety = Math.max(0, num(f.piety) + monthlyPiety);
  }
  if (gwMod.legitimacyMonthly > 0) {
   f.legitimacy = clamp((f.legitimacy || 50) + gwMod.legitimacyMonthly, 0, 100);
  }
  if (quarterly && (socMod.researchBonus > 0 || gwMod.researchBonus > 0) && g.identity?.realms?.[realm]?.research) {
   g.identity.realms[realm].research.progress += socMod.researchBonus + gwMod.researchBonus;
  }

  // Minor title holder prestige
  for (const [tid, rec] of Object.entries(d.minorTitles?.[realm] || {})) {
   const holder = g.politics?.people?.[rec?.personId];
   const def = MINOR_TITLES[tid];
   if (!holder?.alive || holder.realm !== realm || !def) {
    delete d.minorTitles[realm][tid];
    continue;
   }
   holder.prestige = num(holder.prestige) + def.prestigeMonthly;
  }
 }

 // 4. Province Prosperity (quarterly) & Great Works (monthly)
 if (quarterly) {
  const warring = new Set(
   Object.values(g.conflict?.wars || {}).filter(w => w.status === 'active').flatMap(w => [w.attacker, w.defender])
  );
  for (const p of Object.values(g.provinces || {})) {
   const occupied = getController(g, p.id) !== p.owner;
   const crisis = g.economy?.crises?.[p.id];
   let delta = 0;
   if (occupied) delta = -20;
   else if (crisis && ['epidemic', 'famine', 'drought'].includes(crisis.kind)) delta = -15;
   else if (!warring.has(p.owner)) delta = 12;
   else delta = 2;
   if (delta !== 0) adjustProvinceProsperity(g, p.id, delta);
  }
 }

 for (const gw of Object.values(d.greatWorks || {})) {
  if (gw.status !== 'constructing') continue;
  const def = GREAT_WORK_KINDS[gw.kind];
  if (!def || g.provinces?.[gw.provinceId]?.owner !== gw.realm) continue;
  gw.progress += Math.ceil(100 / (def.monthsPerStage || 12));
  if (gw.progress >= 100) {
   gw.progress = 0;
   gw.completedStages++;
   if (gw.completedStages >= gw.maxStage) {
    gw.status = 'completed';
    gw.stage = gw.maxStage;
   } else {
    gw.stage = gw.completedStages + 1;
   }
   const f = g.factions?.[gw.realm];
   if (f) f.prestige = (f.prestige || 0) + 25;
   adjustProvinceProsperity(g, gw.provinceId, 35);
   addLog(g, gw.realm, `${gw.name} in ${gw.provinceId} completed stage ${gw.completedStages}/${gw.maxStage}.`);
  }
 }

 // 5. Moral authority & Crusade progression
 if (quarterly) recomputeMoralAuthority(g);
 if (d.crusade?.status === 'active') {
  for (const pid of d.crusade.participants || []) {
   if (d.crusade.pledged[pid]) d.crusade.pledged[pid].contribution += 2;
  }
  resolveCrusadeIfReady(g);
 }

 // 6. Scheduled Cross-System followups
 if (d.followups.length) {
  const remaining = [];
  for (const fu of d.followups) {
   if (!fu.applied && (g.turn || 0) >= fu.dueTurn) {
    fu.applied = true;
    if (fu.effectSpec) applyCrossSystemChoice(g, fu.effectSpec, { realm: fu.realm });
    addLog(g, fu.realm, `Consequence resolved: ${fu.label}.`);
   } else if (!fu.applied) {
    remaining.push(fu);
   }
  }
  d.followups = remaining;
 }

 // 7. Annual cleanup of expired favors
 // 7. Annual cleanup of expired favors & monthly deep realm simulations (drift, epidemics, scale)
 tickDeJureDrift(g, world, { fromTick: true });
 spreadEpidemics(g, world);

 for (const realm of Object.keys(g.politics?.realms || {})) {
  const strain = governanceStrain(g, realm);
  d.governanceStrain[realm] = strain;
  if (quarterly && strain.active) {
   const f = g.factions?.[realm];
   const penalty = Math.max(1, Math.floor(strain.loyaltyPenalty / 4));
   const rId = getRulerId(g, realm);
   for (const [id, h] of Object.entries(g.politics?.holdings || {})) {
    if (h.realm === realm && h.lord !== rId && g.provinces?.[id]?.owner === realm) {
     h.loyalty = clamp((h.loyalty || 50) - penalty, 0, 100);
    }
   }
   if (f && strain.excess >= 3) {
    const drain = Math.min(Math.max(0, f.treasury || 0), Math.round(strain.provinceCount * strain.taxPenalty * 2));
    if (drain > 0) f.treasury -= drain;
   }
  }
  const school = selectedReligiousSchool(g, realm);
  if (school && fPietyEligible(g, realm)) {
   const r = getRuler(g, realm);
   if (r) r.piety = num(r.piety) + (school.pietyMonthly || 0);
   if (g.factions?.[realm]) g.factions[realm].piety = num(g.factions[realm].piety) + (school.pietyMonthly || 0);
   if (quarterly && school.research && g.identity?.realms?.[realm]?.research) {
    g.identity.realms[realm].research.progress += school.research;
   }
  }
 }

 if (annual) {
  // Papal aging & Conclave election
  if (d.cardinals?.pope && d.cardinals?.seats?.length) {
   d.cardinals.pope.age = (d.cardinals.pope.age || 53) + 1;
   if (d.cardinals.pope.age >= 72 && (hashStr(`conclave:${g.turn}`) % 5 === 0)) {
    const sorted = d.cardinals.seats.slice().sort((a, b) => (b.score || 0) - (a.score || 0) || a.seatIndex - b.seatIndex);
    const winner = sorted[0];
    const oldName = d.cardinals.pope.name;
    const newPopeName = allocatePopeName(g, (g.turn || 0) + (winner?.seatIndex || 1));
    d.cardinals.pope = {
     id: `pope_${g.turn}`,
     name: newPopeName,
     realm: winner?.realm || 'papacy',
     age: 52 + (hashStr(newPopeName) % 14),
     electedTurn: g.turn || 0
    };
    if (winner?.realm) {
     const fs = g.identity?.realms?.[winner.realm]?.faithSystem;
     if (fs?.system === 'catholic') fs.papalFavor = clamp((fs.papalFavor || 55) + 15, 0, 100);
     if (g.factions?.[winner.realm]) g.factions[winner.realm].prestige = (g.factions[winner.realm].prestige || 0) + 20;
     addLog(g, winner.realm, `${oldName} passed away; ${winner.name} was elected Pope as ${newPopeName}!`);
     winner.name = allocateCardinalName(g, winner.realm, winner.seatIndex + (g.turn || 1));
     winner.personId = `curia_prelate_${winner.seatIndex}_${g.turn || 1}`;
     winner.appointedTurn = g.turn || 0;
    }
   }
  }
  for (const [id, fav] of Object.entries(d.favors)) {
   if (fav.used && (g.turn || 0) - (fav.usedTurn || 0) > 24) delete d.favors[id];
   else if ((fav.expires || 0) <= (g.turn || 0)) delete d.favors[id];
  }
 }

 tickDeepAiAutonomy(g, world);
 return d;
}

function fPietyEligible(g, realm) {
 return Boolean(g.factions?.[realm] && getRuler(g, realm)?.alive);
}

// ============================================================================
// 8. DE JURE DRIFT, EMPIRE SCALE FRICTION, EPIDEMIC SPREAD & RELIGION DEPTH
// ============================================================================

export function tickDeJureDrift(g, world = null, opts = {}) {
 const d = ensureDeepSystems(g);
 if (!d || !g.provinces) return [];
 if (opts.fromTick && d.lastDeJureTick === g.turn) return [];
 d.lastDeJureTick = g.turn || 0;
 const step = Math.max(1, num(opts.months || 1));
 const drifted = [];

 for (const [pid, prov] of Object.entries(g.provinces)) {
  const owner = prov?.owner;
  if (!owner || owner === 'independent' || !g.politics?.realms?.[owner]) {
   delete d.deJureDrift[pid];
   continue;
  }
  if (getController(g, pid) !== owner) {
   delete d.deJureDrift[pid];
   continue;
  }
  const cTitle = g.feudal?.titles?.['c:' + pid];
  const currentDeJure = d.deJureOverrides[pid] || g.feudal?.countyDeJure?.[pid] || cTitle?.deJureRealm || null;
  if (!currentDeJure || currentDeJure === owner) {
   delete d.deJureDrift[pid];
   continue;
  }
  const rec = d.deJureDrift[pid];
  if (!rec || rec.realm !== owner) {
   d.deJureDrift[pid] = { realm: owner, months: step, fromRealm: currentDeJure };
  } else {
   rec.months += step;
  }
  if (d.deJureDrift[pid].months >= 60) {
   d.deJureOverrides[pid] = owner;
   if (g.feudal) {
    g.feudal.countyDeJure ??= {};
    g.feudal.countyDeJure[pid] = owner;
    if (cTitle) {
     cTitle.deJureRealm = owner;
     cTitle.deJureParent = 'k:' + owner;
    }
    for (const kind of ['castle', 'city', 'temple']) {
     const bt = g.feudal.titles?.['b:' + pid + ':' + kind];
     if (bt) bt.deJureRealm = owner;
    }
    for (const dist of Object.values(g.feudal.districts || {})) {
     if (dist.members?.includes(pid) && dist.members.every(mid => (d.deJureOverrides[mid] || dist.deJureRealm) === owner)) {
      dist.deJureRealm = owner;
     }
    }
   }
   d.deJureHistory.unshift({ province: pid, from: currentDeJure, to: owner, turn: g.turn || 0, year: g.year || 1450 });
   if (d.deJureHistory.length > 100) d.deJureHistory.length = 100;
   addLog(g, owner, `De Jure Drift: ${prov.name || pid} integrated into the de jure realm of ${g.factions?.[owner]?.name || owner}.`);
   drifted.push({ province: pid, from: currentDeJure, to: owner });
   delete d.deJureDrift[pid];
  }
 }
 return drifted;
}

export function governanceStrain(g, realm) {
 ensureDeepSystems(g);
 if (!realm || realm === 'independent' || !g.politics?.realms?.[realm]) {
  return { active: false, vassalCount: 0, limit: 20, excess: 0, delegatedCount: 0, provinceCount: 0, taxPenalty: 0, taxMultiplier: 1, loyaltyPenalty: 0, severity: 0 };
 }
 const rId = getRulerId(g, realm);
 const ruler = getRuler(g, realm);
 const gov = g.civic?.realms?.[realm]?.government;
 const empireRank = gov === 'imperial' || Boolean(g.feudal?.titles?.['e:' + realm]) ? 5 : 4;
 const limit = (gov === 'imperial' ? 8 : 6) + empireRank * 4 + Math.floor(num(ruler?.skills?.diplomacy) / 2) * 2;
 const directVassals = new Set();
 let delegatedCount = 0;
 const titles = g.feudal?.titles || {};
 const hasFeudalTitles = Object.keys(titles).some(k => titles[k]?.realm === realm);
 if (hasFeudalTitles) {
  for (const t of Object.values(titles)) {
   if (t.realm !== realm || !t.holder || t.holder === rId) continue;
   if (['duchy', 'kingdom', 'regional', 'crown'].includes(t.feudalTier || t.tier)) {
    if (!t.deFactoLiege || t.deFactoLiege === rId) directVassals.add(t.holder);
    else delegatedCount++;
   } else if ((t.feudalTier || t.tier) === 'county' || t.tier === 'province') {
    if (!t.deFactoLiege || t.deFactoLiege === rId) directVassals.add(t.holder);
    else delegatedCount++;
   }
  }
 } else {
  for (const [id, h] of Object.entries(g.politics?.holdings || {})) {
   if (h.realm === realm && h.lord && h.lord !== rId && g.provinces?.[id]?.owner === realm) {
    directVassals.add(h.lord);
   }
  }
 }
 const provinceCount = ownedProvinces(g, realm).length;
 const excess = Math.max(0, directVassals.size - limit);
 const taxPenalty = excess > 0 ? clamp(Number((excess * 0.025).toFixed(3)), 0, 0.45) : 0;
 const loyaltyPenalty = excess > 0 ? Math.min(18, Math.ceil(excess * 0.75)) : 0;
 return {
  active: excess > 0,
  vassalCount: directVassals.size,
  limit,
  excess,
  delegatedCount,
  provinceCount,
  taxPenalty,
  taxMultiplier: Number((1 - taxPenalty).toFixed(3)),
  loyaltyPenalty,
  severity: clamp(excess * 5, 0, 100)
 };
}

export function isCourtIsolated(g, realm) {
 return Boolean(g?.heritage?.isolated?.[realm] ?? g?.deepSystems?.courtIsolation?.[realm]);
}

export function toggleCourtIsolation(g, realm = g.player) {
 const d = ensureDeepSystems(g);
 if (!realm || !g.factions?.[realm] || realm === 'independent') return no('Invalid realm.');
 const next = !isCourtIsolated(g, realm);
 g.heritage ??= {};
 g.heritage.isolated ??= {};
 g.heritage.isolated[realm] = next;
 d.courtIsolation[realm] = next;
 if (next) {
  g.factions[realm].prestige = Math.max(0, (g.factions[realm].prestige || 0) - 4);
  const rId = getRulerId(g, realm);
  for (const [pid, h] of Object.entries(g.politics?.holdings || {})) {
   if (h.realm === realm && h.lord !== rId && g.provinces?.[pid]?.owner === realm) {
    h.loyalty = clamp((h.loyalty || 50) - 5, 0, 100);
   }
  }
  addLog(g, realm, `${g.factions[realm].name} closed the royal court gates to slow pestilence.`);
  return ok('Court isolated; the gates are shut against pestilence.', { isolated: true });
 }
 addLog(g, realm, `${g.factions[realm].name} reopened the royal court gates.`);
 return ok('Court isolation ended.', { isolated: false });
}

export function spreadEpidemics(g, world = null) {
 const d = ensureDeepSystems(g);
 if (!d || !g.provinces) return { active: 0, spread: [], infected: [] };
 if (!g.economy?.crises && !Object.keys(g.heritage?.epidemics || {}).length) {
  return { active: 0, spread: [], infected: [] };
 }
 g.economy ??= { provinces: {}, crises: {} };
 g.economy.crises ??= {};
 g.heritage ??= {};
 g.heritage.epidemics ??= {};

 // Normalize externally seeded g.heritage.epidemics into g.economy.crises
 for (const [pid, epi] of Object.entries(g.heritage.epidemics)) {
  if (epi && !g.economy.crises[pid] && g.provinces[pid]) {
   g.economy.crises[pid] = {
    province: pid,
    kind: 'epidemic',
    severity: clamp(num(epi.severity || 55), 10, 90),
    started: epi.started ?? g.turn ?? 0,
    remaining: epi.remaining ?? 8,
    reliefTurn: -12
   };
  }
 }

 const activeCrises = Object.values(g.economy.crises).filter(x => x && x.kind === 'epidemic' && g.provinces[x.province]);
 const activeSet = new Set(activeCrises.map(x => x.province));
 for (const pid of Object.keys(g.heritage.epidemics)) {
  if (!activeSet.has(pid)) delete g.heritage.epidemics[pid];
 }

 const byProv = new Map((world?.provinces || []).map(p => [p.id, p]));
 const ports = g.naval?.ports || {};
 const spread = [];
 const infected = [];

 const protectionAt = pid => {
  const eco = g.economy?.provinces?.[pid];
  const inf = num(eco?.industries?.infirmary);
  const hosp = num(eco?.holdings?.temple?.buildings?.hospitium);
  const owner = g.provinces?.[pid]?.owner;
  const iso = owner && owner !== 'independent' && isCourtIsolated(g, owner) ? 35 : 0;
  return inf * 8 + hosp * 7 + iso;
 };

 for (const epi of activeCrises) {
  const pid = epi.province;
  const prov = g.provinces[pid];
  g.heritage.epidemics[pid] = { province: pid, name: epi.name || 'Pestilence', severity: epi.severity, turn: g.turn || 0 };
  adjustProvinceProsperity(g, pid, -6);

  const owner = prov.owner;
  const ownerIsolated = owner && owner !== 'independent' && isCourtIsolated(g, owner);
  if (epi.severity >= 45 && !ownerIsolated) {
   prov.unrest = clamp(num(prov.unrest) + 2, 0, 100);
  }
  if (owner && owner !== 'independent' && !ownerIsolated && g.politics?.people) {
   const eco = g.economy?.provinces?.[pid];
   const localProt = num(eco?.industries?.infirmary) * 5 + num(eco?.holdings?.temple?.buildings?.hospitium) * 5;
   const hasPhysician = Boolean(g.royalCourt?.realms?.[owner]?.offices?.physician);
   const isCap = g.politics?.realms?.[owner]?.capital === pid;
   const risk = clamp(Math.round((epi.severity - localProt - (hasPhysician ? 14 : 0)) * (isCap ? 0.5 : 0.35)), 2, 48);
   const courtiers = Object.values(g.politics.people).filter(p => p?.alive && p.realm === owner).sort((a, b) => a.id.localeCompare(b.id));
   for (const c of courtiers) {
    if (g.living?.health?.[c.id]?.severity) continue;
    const rollVal = hashStr(`epi_court:${pid}:${c.id}:${g.turn || 0}`) % 100;
    if (rollVal < risk) {
     g.living ??= { version: 1, health: {}, history: [] };
     g.living.health ??= {};
     g.living.health[c.id] = { condition: 'epidemic illness', chronic: false, injury: false, severity: 30 + (rollVal % 20), started: g.turn || 0 };
     infected.push(c.id);
    }
   }
  }

  // Spread across land borders and connected sea port hubs
  const landNeighbors = byProv.get(pid)?.neighbors || [];
  const srcPort = ports[pid];
  const seaNeighbors = srcPort?.basins?.length
   ? Object.values(ports).filter(pt => pt.province !== pid && pt.basins?.some(b => srcPort.basins.includes(b))).map(pt => pt.province)
   : [];
  const targets = [...new Set([...landNeighbors, ...seaNeighbors])];

  for (const tid of targets) {
   if (g.economy.crises[tid] || !g.provinces[tid]) continue;
   const isSea = seaNeighbors.includes(tid) && !landNeighbors.includes(tid);
   if (isSea && epi.severity < 45) continue;
   const targetOwner = g.provinces[tid].owner;
   const targetIso = targetOwner && targetOwner !== 'independent' && isCourtIsolated(g, targetOwner);
   const rawChance = epi.severity - protectionAt(tid) - (isSea ? 18 : 8) - (ownerIsolated ? 25 : 0);
   const chance = clamp(rawChance, targetIso ? 1 : 0, 75);
   if (chance <= 0) continue;
   const rollVal = hashStr(`epi_spread:${pid}:${tid}:${g.turn || 0}`) % 100;
   if (rollVal < chance) {
    const newSev = clamp(Math.max(25, Math.round(epi.severity * 0.72)), 20, 90);
    g.economy.crises[tid] = { province: tid, kind: 'epidemic', severity: newSev, started: g.turn || 0, remaining: 8, reliefTurn: -12 };
    g.heritage.epidemics[tid] = { province: tid, name: epi.name || 'Pestilence', severity: newSev, turn: g.turn || 0 };
    spread.push({ from: pid, to: tid, sea: isSea, severity: newSev });
    if (targetOwner && targetOwner !== 'independent') {
     addLog(g, targetOwner, `Epidemic spread to ${g.provinces[tid].name || tid}${isSea ? ' via sea trade' : ''}.`);
    }
   }
  }
 }
 return { active: activeCrises.length, spread, infected };
}

export const RELIGIOUS_SCHOOLS = Object.freeze({
 ashari: { id: 'ashari', name: "Ash'ari Theology", system: 'islamic', families: ['Islam'], tax: 0, levy: 0.04, morale: 6, research: 1, pietyMonthly: 0.25, desc: 'Orthodox synthesis strengthening clerical authority and martial morale.' },
 mutazili: { id: 'mutazili', name: "Mu'tazili Rationalism", system: 'islamic', families: ['Islam'], tax: 0.06, levy: 0, morale: 0, research: 4, pietyMonthly: 0.1, desc: 'Rationalist scholarship boosting tax efficiency and research.' },
 thomistic: { id: 'thomistic', name: 'Thomistic Scholasticism', system: 'catholic', families: ['Christianity'], tax: 0.05, levy: 0, morale: 2, research: 3, pietyMonthly: 0.2, desc: 'Scholastic theology elevating administration and scholarship.' },
 franciscan: { id: 'franciscan', name: 'Franciscan Devotion', system: 'catholic', families: ['Christianity'], tax: 0, levy: 0.04, morale: 5, research: 1, pietyMonthly: 0.35, desc: 'Mendicant humility raising piety, trust, and army morale.' },
 theravada: { id: 'theravada', name: 'Theravada Sangha', system: 'dharmic', families: ['Buddhism', 'Hindu traditions'], tax: 0.03, levy: 0.02, morale: 4, research: 2, pietyMonthly: 0.3, desc: 'Monastic discipline sustaining realm harmony and scholarship.' },
 mahayana: { id: 'mahayana', name: 'Mahayana Bodhisattva', system: 'dharmic', families: ['Buddhism', 'Hindu traditions', 'East Asian ritual traditions'], tax: 0.05, levy: 0.03, morale: 3, research: 3, pietyMonthly: 0.25, desc: 'Universal merit elevating civic culture and trade.' },
 advaita: { id: 'advaita', name: 'Advaita Vedanta', system: 'dharmic', families: ['Hindu traditions'], tax: 0.04, levy: 0, morale: 2, research: 4, pietyMonthly: 0.25, desc: 'Non-dual philosophy accelerating learning and patronage.' },
 bhakti: { id: 'bhakti', name: 'Bhakti Devotion', system: 'dharmic', families: ['Hindu traditions', 'Buddhism'], tax: 0.02, levy: 0.06, morale: 6, research: 1, pietyMonthly: 0.3, desc: 'Popular devotional movement strengthening levies and morale.' }
});

export function selectedReligiousSchool(g, realm) {
 const rec = g?.deepSystems?.religiousSchools?.[realm];
 return rec ? (RELIGIOUS_SCHOOLS[rec.id] || rec) : null;
}

export function selectReligiousSchool(g, realm = g.player, schoolId) {
 const d = ensureDeepSystems(g);
 const f = g.factions?.[realm];
 const def = RELIGIOUS_SCHOOLS[schoolId];
 if (!f || !def) return no('Select a valid religious school.');
 const faith = getRealmFaith(g, realm);
 const sys = resolveFaithSystem(g, faith);
 const fam = resolveFaithFamily(g, faith);
 const compatible = sys === def.system || (fam && def.families.includes(fam)) || sys === 'traditional' || (sys === 'orthodox' && def.system === 'catholic');
 if (!compatible) return no(`${def.name} is not compatible with ${faith || 'the realm faith'}.`);
 const cur = d.religiousSchools[realm];
 if (cur?.id === schoolId) return no(`${def.name} is already adopted.`);
 if (cur && (g.turn || 0) - (cur.selectedTurn ?? -120) < 12) return no('Religious school may only be changed once per year.');
 if ((f.treasury || 0) < 80) return no('Adopting a religious school requires 80 gold.');
 f.treasury -= 80;
 d.religiousSchools[realm] = { id: schoolId, name: def.name, system: def.system, selectedTurn: g.turn || 0, faith };
 const fs = g.identity?.realms?.[realm]?.faithSystem;
 if (fs) fs.school = schoolId;
 addLog(g, realm, `${f.name} adopted the ${def.name} theological school.`);
 return ok(`Adopted ${def.name}.`, { school: def });
}

export function coronateRuler(g, realm = g.player, tier = 'royal') {
 const d = ensureDeepSystems(g);
 const f = g.factions?.[realm];
 const r = getRuler(g, realm);
 if (!f || !r?.alive) return no('Requires a living ruler.');
 if (d.coronations[realm]?.rulerId === r.id || g.heritage?.realms?.[realm]?.lastCoronation === r.id) {
  return no(`${r.name} has already been crowned.`);
 }
 const tiers = {
  modest: { cost: 70, legitimacy: 8, prestige: 8, piety: 5, clericalOpinion: 6, loyalty: 4 },
  royal: { cost: 140, legitimacy: 14, prestige: 15, piety: 10, clericalOpinion: 12, loyalty: 8 },
  papal: { cost: 220, legitimacy: 18, prestige: 20, piety: 18, clericalOpinion: 18, loyalty: 10 },
  imperial: { cost: 280, legitimacy: 22, prestige: 25, piety: 15, clericalOpinion: 16, loyalty: 12 }
 };
 const cfg = tiers[tier] || tiers.royal;
 if ((f.treasury || 0) < cfg.cost) return no(`Coronation (${tier}) requires ${cfg.cost} gold.`);
 f.treasury -= cfg.cost;
 f.legitimacy = clamp((f.legitimacy || 50) + cfg.legitimacy, 0, 100);
 f.prestige = (f.prestige || 0) + cfg.prestige;
 r.prestige = num(r.prestige) + cfg.prestige;
 r.piety = num(r.piety) + cfg.piety;
 f.piety = num(f.piety) + cfg.piety;
 const fs = g.identity?.realms?.[realm]?.faithSystem;
 if (fs && fs.system === 'catholic') fs.papalFavor = clamp((fs.papalFavor || 55) + (tier === 'papal' ? 14 : 6), 0, 100);
 const scholarId = g.politics?.realms?.[realm]?.council?.scholar;
 if (scholarId && g.politics?.people?.[scholarId]?.alive) adjustPersonalOpinion(g, r.id, scholarId, cfg.clericalOpinion);
 for (const [pid, h] of Object.entries(g.politics?.holdings || {})) {
  if (h.realm === realm && h.lord !== r.id && g.provinces?.[pid]?.owner === realm) {
   h.loyalty = clamp((h.loyalty || 50) + cfg.loyalty, 0, 100);
  }
 }
 d.coronations[realm] = { rulerId: r.id, tier, turn: g.turn || 0, year: g.year || 1450 };
 if (g.heritage?.realms?.[realm]) g.heritage.realms[realm].lastCoronation = r.id;
 r.memories ??= [];
 r.memories.push(`Crowned in a ${tier} coronation ceremony in ${g.year || 1450}.`);
 addLog(g, realm, `${r.name} received a ${tier} coronation, strengthening legitimacy and clerical support.`);
 return ok(`${r.name} crowned (${tier}).`, { coronation: d.coronations[realm], legitimacy: f.legitimacy });
}

export function canonizeAncestor(g, realm = g.player, personId = null) {
 const d = ensureDeepSystems(g);
 const f = g.factions?.[realm];
 const r = getRuler(g, realm);
 if (!f || !r?.alive) return no('Requires a living ruler.');
 const candidates = Object.values(g.politics?.people || {}).filter(
  p => p && !p.alive && !d.canonized[p.id] && (p.realm === realm || p.house === r.house)
 );
 const target = personId ? candidates.find(p => p.id === personId) : candidates.sort((a, b) => num(b.piety) - num(a.piety) || a.id.localeCompare(b.id))[0];
 if (!target) return no('Select an eligible deceased pious ancestor or dynast.');
 const bestPiety = Math.max(num(target.piety), num(r.piety), num(f.piety));
 if (bestPiety < 40) return no('Requires at least 40 piety in the ancestor or dynasty.');
 const cost = num(target.piety) >= 80 ? 100 : 160;
 if ((f.treasury || 0) < cost) return no(`Canonization requires ${cost} gold.`);
 f.treasury -= cost;

 const blId = `saint_${target.id}_${g.turn || 0}`;
 const bl = {
  id: blId,
  name: `Saintly Blood of ${target.name}`,
  kind: 'saint',
  historical: false,
  founderId: target.id,
  founderName: target.name,
  dynasty: target.house || r.house,
  createdTurn: g.turn || 0,
  prestigeMonthly: BLOODLINES.saint.prestigeMonthly,
  pietyMonthly: BLOODLINES.saint.pietyMonthly,
  vassalOpinion: BLOODLINES.saint.vassalOpinion,
  levyMod: BLOODLINES.saint.levyMod,
  taxMod: BLOODLINES.saint.taxMod
 };
 d.bloodlines.definitions[blId] = bl;
 assignBloodlineToPersonAndDescendants(g, target, blId);
 assignBloodlineToPersonAndDescendants(g, r, blId);

 f.piety = num(f.piety) + 25;
 r.piety = num(r.piety) + 20;
 f.prestige = (f.prestige || 0) + 25;
 f.legitimacy = clamp((f.legitimacy || 50) + 10, 0, 100);
 adjustMoralAuthority(g, getRealmFaith(g, realm), 4, `Canonization of ${target.name}`);

 d.canonized[target.id] = { id: target.id, name: target.name, house: target.house, realm, bloodlineId: blId, turn: g.turn || 0, year: g.year || 1450 };
 target.memories ??= [];
 target.memories.push(`Venerated and canonized in ${g.year || 1450}.`);
 addLog(g, realm, `${target.name} was formally canonized, founding a blessed dynastic bloodline!`);
 return ok(`${target.name} canonized; saintly bloodline established.`, { canonization: d.canonized[target.id], bloodline: bl });
}

export function deepSystemsView(g, realm = g.player) {
 const d = ensureDeepSystems(g);
 const rId = getRulerId(g, realm);
 return {
  independentCount: Object.keys(g.independentPolities || {}).length,
  obligations: getObligationLaws(g, realm),
  obligationModifiers: obligationLawModifiers(g, realm),
  minorTitles: d.minorTitles?.[realm] || {},
  viceroyalties: Object.values(d.viceroyalties || {}).filter(v => v.realm === realm),
  favors: activeFavors(g, rId),
  moralAuthority: moralAuthorityBreakdown(g, getRealmFaith(g, realm)),
  cardinals: initCardinals(g),
  antipope: d.antipopes?.[realm] || null,
  crusade: crusadeSummary(g),
  society: rId ? d.societies?.memberships?.[rId] || null : null,
  bloodlines: rId ? characterBloodlines(g, rId) : [],
  sieges: Object.values(d.sieges || {}).filter(s => s.status === 'active'),
  tradePosts: Object.values(d.tradePosts || {}).filter(tp => tp.owner === realm),
  greatWorks: Object.values(d.greatWorks || {}).filter(gw => gw.realm === realm),
  prosperity: prosperityModifiers(g, realm),
  governanceStrain: governanceStrain(g, realm),
  isolated: isCourtIsolated(g, realm),
  religiousSchool: selectedReligiousSchool(g, realm),
  coronation: d.coronations?.[realm] || null,
  canonized: Object.values(d.canonized || {}).filter(c => c.realm === realm),
  deJureDrift: Object.entries(d.deJureDrift || {}).filter(([, rec]) => rec.realm === realm).map(([province, rec]) => ({ province, ...rec }))
 };
}
