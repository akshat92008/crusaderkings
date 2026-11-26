/**
 * CK2 All-DLC Expansion Mechanics & Moddable Scenarios Core
 * Covers Way of Life, Sword of Islam, Sons of Abraham, The Republic, Horse Lords,
 * The Old Gods, Charlemagne, The Reaper's Due, Monks & Mystics, Jade Dragon, and Holy Fury.
 * Deterministic, zero Math.random().
 */
import { hashStr, setCrusadeBeneficiary, canonizeAncestor } from './ck2-deep-systems.js';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const num = n => (Number.isFinite(n) ? n : 0);
const ok = (msg, extra = {}) => ({ ok: true, msg, ...extra });
const no = (msg, extra = {}) => ({ ok: false, msg, ...extra });

export const WAY_OF_LIFE_FOCUSES = Object.freeze({
 war: { name: 'War Focus', skill: 'martial', mod: { martialBonus: 2, levy: 1.08 }, desc: 'Sharpen command tactics, duel readiness, and army drills.' },
 hunting: { name: 'Hunting Focus', skill: 'martial', mod: { healthRelief: 8, prestigeMonthly: 0.4 }, desc: 'Vigorous hunts build vitality, hounds, and martial vigor.' },
 carousing: { name: 'Carousing Focus', skill: 'diplomacy', mod: { vassalOpinion: 8, stressRelief: 4 }, desc: 'Host royal banquets that turn rivals and vassals into friends.' },
 business: { name: 'Business Focus', skill: 'stewardship', mod: { tax: 1.1, trade: 1.12 }, desc: 'Charter merchant ventures, mint coinage, and expand urban trade.' },
 stewardship: { name: 'Rulership Focus', skill: 'stewardship', mod: { tax: 1.08, build: 0.92 }, desc: 'Streamline estates, tax rolls, and provincial works.' },
 intrigue: { name: 'Intrigue Focus', skill: 'intrigue', mod: { scheme: 12 }, desc: 'Uncover court secrets, spy networks, and plots.' },
 seduction: { name: 'Seduction Focus', skill: 'intrigue', mod: { fertility: 0.15, diplomacyBonus: 1 }, desc: 'Cultivate romantic intrigues and courtly devotion.' },
 theology: { name: 'Theology Focus', skill: 'learning', mod: { pietyMonthly: 0.6, stressRelief: 3 }, desc: 'Meditation, scriptural study, and ecclesiastical standing.' },
 scholarship: { name: 'Scholarship Focus', skill: 'learning', mod: { researchBonus: 2, siegeSpeed: 1.06 }, desc: 'Build observatories, translate treatises, and advance technology.' },
 rulership: { name: 'Family & Crown Focus', skill: 'diplomacy', mod: { diplomacyBonus: 2, stabilityBoost: 0.5 }, desc: 'Strengthen dynastic bonds, guardianship, and realm harmony.' }
});

export const REFORMATION_NATURES = Object.freeze({
 warmongering: { name: 'Warmongering', desc: 'Allows Great Holy Wars and boosts martial levy readiness.', holyWar: true, levy: 1.1 },
 cosmopolitan: { name: 'Cosmopolitan', desc: 'Encourages interfaith marriages and pluralist tolerance.', holyWar: false, acceptance: 12 },
 dogmatic: { name: 'Dogmatic', desc: 'Strengthens moral authority, missionary zeal, and clergy loyalty.', holyWar: true, conversion: 1.25 },
 peaceful: { name: 'Peaceful', desc: 'Boosts provincial prosperity, development, and vassal loyalty.', holyWar: false, tax: 1.08 }
});

export const REFORMATION_DOCTRINES = Object.freeze({
 meritocracy: { name: 'Meritocracy', desc: 'Unlocks heir designation and lowers council succession friction.' },
 syncretism: { name: 'Syncretism', desc: 'Reduces religious unrest across diverse conquered provinces.' },
 monasticism: { name: 'Monasticism', desc: 'Deepens temple income, learning, and ascetic piety.' },
 sea_bound: { name: 'Sea-Bound', desc: 'Cheaper fleets and coastal raiding bonuses.' },
 astrology: { name: 'Astrology', desc: 'Boosts scholarly societies, research, and natal horoscopes.' }
});

export const JADE_DRAGON_ACTIONS = Object.freeze({
 send_gift: { name: 'Send Tribute Gift', cost: 120, grace: 150, desc: 'Present porcelain, bullion, or Silk Road curiosities (+150 Grace).' },
 send_physician: { name: 'Dispatch Court Scholar/Physician', cost: 40, grace: 200, cooldown: 36, desc: 'Lend a skilled scholar to the Eastern court (+200 Grace).' },
 kowtow: { name: 'Royal Pilgrimage & Kowtow', cost: 90, grace: 250, cooldown: 48, desc: 'Undertake an imperial audience in person (+250 Grace, −10 prestige).' },
 boon_trade: { name: 'Imperial Trade Contract', graceCost: 220, duration: 48, desc: 'Spend 220 Grace for +18% realm trade income for 4 years.' },
 boon_engineers: { name: 'Imperial Siege Engineers', graceCost: 280, duration: 48, desc: 'Spend 280 Grace for +25% siege & fort efficiency for 4 years.' },
 boon_marriage: { name: 'Imperial Diplomatic Pact', graceCost: 350, duration: 60, desc: 'Spend 350 Grace for Eastern Protectorate truce & prestige.' }
});

export const DHARMIC_SECTS = Object.freeze({
 shaiva: { name: 'Shaiva Martial Devotion', desc: '+10% levies & army morale from ascetic warrior orders.', mod: { levy: 1.1 } },
 vaishnava: { name: 'Vaishnava Royal Dharma', desc: '+10% tax yield & royal administrative harmony.', mod: { tax: 1.1 } },
 shakta: { name: 'Shakta Sacred Sovereignty', desc: '+8 vassal loyalty & court prestige.', mod: { vassalOpinion: 8 } },
 guild: { name: 'Shreni Guild Patronage', desc: '+12% commerce & monsoon port trade.', mod: { trade: 1.12 } }
});

export const EASTERN_STANCES = Object.freeze({
 open: { name: 'Open Silk Road', silkRoadMult: 1.15, graceCostMult: 1.0, desc: 'Caravans flourish (+15% trade yield).' },
 expansionist: { name: 'Western Protectorate', silkRoadMult: 0.95, graceCostMult: 1.0, desc: 'Aggressive frontier posture pressures Silk Road tributaries.' },
 isolationist: { name: 'Closed Gates', silkRoadMult: 0.72, graceCostMult: 1.25, desc: 'Reduced Silk Road volume; imperial boons cost +25% Grace.' },
 turmoil: { name: 'Dynastic Turmoil', silkRoadMult: 0.6, graceCostMult: 0.85, desc: 'Disrupted trade, but wandering engineers serve cheaper.' }
});

const REPUBLIC_HOUSES = Object.freeze({
 venice: ['Contarini', 'Dandolo', 'Morosini', 'Foscari', 'Loredan'],
 genoa: ['Doria', 'Spinola', 'Grimaldi', 'Fieschi', 'Adorno'],
 novgorod: ['Miroshkinich', 'Boretsky', 'Pospayev', 'Tverdislav', 'Danilov'],
 hansa: ['Vorrat', 'Pleskow', 'Castorp', 'Warendorp', 'Lunen']
});

function isDharmicRealm(g, realm) {
 const faith = String(g?.civic?.realms?.[realm]?.faith || g?.factions?.[realm]?.faith || '').toLowerCase();
 if (/hindu|buddh|jain|dharm|shaiv|vaishnav|sikh/.test(faith)) return true;
 return ['vijayanagara', 'delhi', 'bahmani', 'bengal', 'gujarat', 'malwa', 'mewar', 'marwar', 'gajapati', 'jaunpur', 'kashmir', 'ceylon', 'ava', 'siam'].includes(realm);
}

function seedPatricianHouses(g, realm, d) {
 if (d.patricianHouses[realm]?.length >= 5) return;
 const rId = g.politics?.realms?.[realm]?.ruler;
 const rulerHouse = g.politics?.people?.[rId]?.house || (g.factions?.[realm]?.name || realm);
 const pool = REPUBLIC_HOUSES[realm] || [rulerHouse, 'Bellini', 'Valier', 'Corsini', 'Alberti'];
 d.patricianHouses[realm] = pool.slice(0, 5).map((name, idx) => ({
  id: `${realm}_house_${idx}`,
  name: idx === 0 ? rulerHouse : name,
  prestige: 60 - idx * 8 + (hashStr(`ph:${realm}:${idx}`) % 16),
  palazzoLevel: idx === 0 ? 2 : 1,
  familyTradePosts: idx === 0 ? 2 : 1 + (idx % 2),
  campaignFund: idx === 0 ? num(d.patricianFunds[rId]) : (hashStr(`pf:${realm}:${idx}`) % 40),
  isRulerHouse: idx === 0
 }));
 d.republicTradeZones[realm] ??= { controllerHouse: d.patricianHouses[realm][0].id, bonusPct: 12 };
 d.republicDogeElections[realm] ??= { nextTurn: (g.turn || 0) + 48, winnerHouse: d.patricianHouses[realm][0].name, lastTurn: g.turn || 0 };
}

function seedNomadClans(g, realm, d) {
 const existing = d.nomadClans[realm];
 const baseManpower = existing?.hordeManpower || 850;
 const sentiment = existing?.clanSentiment ?? 70;
 if (!existing || !Array.isArray(existing.clans) || existing.clans.length < 3) {
  const rId = g.politics?.realms?.[realm]?.ruler;
  const khaganHouse = g.politics?.people?.[rId]?.house || 'Khagan';
  d.nomadClans[realm] = {
   hordeManpower: baseManpower,
   clanSentiment: sentiment,
   grazingShare: existing?.grazingShare ?? 0.65,
   lastSplit: existing?.lastSplit ?? -120,
   grazingDispute: Boolean(existing?.grazingDispute),
   settled: Boolean(existing?.settled),
   clans: [
    { id: `${realm}_khagan`, name: `${khaganHouse} Core`, manpower: Math.round(baseManpower * 0.5), pastureShare: 44, loyalty: clamp(sentiment + 8, 10, 100), royal: true },
    { id: `${realm}_rival_1`, name: 'Nayman Vanguard', manpower: Math.round(baseManpower * 0.28), pastureShare: 30, loyalty: sentiment, royal: false },
    { id: `${realm}_rival_2`, name: 'Jalayir Steppe', manpower: Math.round(baseManpower * 0.22), pastureShare: 26, loyalty: clamp(sentiment - 4, 10, 100), royal: false }
   ]
  };
 }
}

export function initDlcSystems(g, world = null) {
 if (!g || typeof g !== 'object') return null;
 const d = (g.dlcSystems ??= {
  version: 2,
  lastTick: -1,
  focuses: {},
  loans: {},
  pilgrims: {},
  patricianFunds: {},
  patricianHouses: {},
  republicTradeZones: {},
  republicDogeElections: {},
  nomadClans: {},
  secretFaiths: {},
  reformedFaiths: {},
  easternGrace: {},
  easternStatus: { stance: 'open', emperorName: 'Jingtai', silkRoadMult: 1.15, lastShift: 0 },
  boons: {},
  dharmicState: {},
  imperialThemes: {},
  chronicleAnnals: [],
  physicianCooldowns: {},
  duelCooldowns: {},
  raidCooldowns: {}
 });
 d.version = Math.max(2, d.version || 2);
 d.focuses ??= {};
 d.loans ??= {};
 d.pilgrims ??= {};
 d.patricianFunds ??= {};
 d.patricianHouses ??= {};
 d.republicTradeZones ??= {};
 d.republicDogeElections ??= {};
 d.nomadClans ??= {};
 d.secretFaiths ??= {};
 d.reformedFaiths ??= {};
 d.easternGrace ??= {};
 d.easternStatus ??= { stance: 'open', emperorName: 'Jingtai', silkRoadMult: 1.15, lastShift: 0 };
 d.boons ??= {};
 d.dharmicState ??= {};
 d.imperialThemes ??= {};
 d.chronicleAnnals ??= [];
 d.physicianCooldowns ??= {};
 d.duelCooldowns ??= {};
 d.raidCooldowns ??= {};

 // Seed government & regional DLC structures cleanly and deterministically.
 for (const [realm, c] of Object.entries(g.civic?.realms || {})) {
  if (c?.government === 'steppe' && !d.nomadClans[realm]?.settled) {
   seedNomadClans(g, realm, d);
  } else if (c?.government === 'republic' || c?.government === 'city') {
   seedPatricianHouses(g, realm, d);
  } else if (c?.government === 'imperial' && !d.imperialThemes[realm]) {
   d.imperialThemes[realm] = { loyalty: 68, coupRisk: 14, lastAudit: -12 };
  }
  if (isDharmicRealm(g, realm) && !d.dharmicState[realm]) {
   const sects = Object.keys(DHARMIC_SECTS);
   const pick = sects[hashStr(`dharmic:${realm}`) % sects.length];
   d.dharmicState[realm] = { sect: pick, templeEndowments: 0, monsoonActive: (g.month || 0) >= 5 && (g.month || 0) <= 8 };
  }
 }
 return d;
}

function recordAnnal(g, realm, text) {
 const d = initDlcSystems(g);
 if (!d) return;
 d.chronicleAnnals.unshift({ year: g.year || 1450, turn: g.turn || 0, realm, text });
 if (d.chronicleAnnals.length > 200) d.chronicleAnnals.length = 200;
 if (Array.isArray(g.chronicles?.history)) {
  g.chronicles.history.unshift({ turn: g.turn || 0, realm, kind: 'annal', text });
  if (g.chronicles.history.length > 120) g.chronicles.history.length = 120;
 }
 if (realm === g.player && Array.isArray(g.log)) {
  g.log.unshift({ date: `${g.year || 1450} · month ${(g.month || 0) + 1}`, text });
  if (g.log.length > 45) g.log.length = 45;
 }
}

export function dlcModifiers(g, realm) {
 const d = g?.dlcSystems;
 const base = { tax: 1, levy: 1, trade: 1, build: 1, scheme: 0, siege: 1, vassalOpinion: 0, unrest: 0 };
 if (!d || !realm) return base;
 const rulerId = g.politics?.realms?.[realm]?.ruler;
 const focusId = d.focuses?.[rulerId]?.id;
 const fDef = focusId ? WAY_OF_LIFE_FOCUSES[focusId]?.mod : null;
 if (fDef) {
  if (fDef.tax) base.tax *= fDef.tax;
  if (fDef.levy) base.levy *= fDef.levy;
  if (fDef.trade) base.trade *= fDef.trade;
  if (fDef.build) base.build *= fDef.build;
  if (fDef.scheme) base.scheme += fDef.scheme;
  if (fDef.siegeSpeed) base.siege *= fDef.siegeSpeed;
  if (fDef.vassalOpinion) base.vassalOpinion += fDef.vassalOpinion;
 }
 const boon = d.boons?.[realm];
 if (boon?.tradeUntil > (g.turn || 0)) base.trade *= 1.18;
 if (boon?.engineersUntil > (g.turn || 0)) base.siege *= 1.25;

 // Eastern Empire stance influences worldwide Silk Road trade once diplomatic grace is established.
 const est = d.easternStatus;
 if (est?.stance && EASTERN_STANCES[est.stance] && (d.easternGrace?.[realm]?.grace || 0) >= 60) {
  base.trade *= EASTERN_STANCES[est.stance].silkRoadMult;
 }

 // Merchant Republic Patrician Houses & Trade Zone Dominance
 const houses = d.patricianHouses?.[realm];
 if (Array.isArray(houses) && houses.length) {
  const rulerHouse = houses.find(h => h.isRulerHouse) || houses[0];
  base.trade *= 1 + Math.min(0.24, (rulerHouse.palazzoLevel || 1) * 0.04 + (rulerHouse.familyTradePosts || 0) * 0.02);
  base.tax *= 1 + Math.min(0.12, (rulerHouse.palazzoLevel || 1) * 0.025);
  const tz = d.republicTradeZones?.[realm];
  if (tz?.bonusPct) base.trade *= 1 + tz.bonusPct / 100;
 }

 // Nomad Clans & Grazing Disputes
 const clan = d.nomadClans?.[realm];
 if (clan && !clan.settled) {
  if (clan.clanSentiment >= 60) base.levy *= 1.12;
  else if (clan.clanSentiment < 35) base.unrest += 1;
  if (clan.grazingDispute) {
   base.levy *= 0.88;
   base.unrest += 1.5;
  }
 }

 // Imperial Themes stability & coup risk
 const theme = d.imperialThemes?.[realm];
 if (theme) {
  if (theme.coupRisk >= 50) base.tax *= 0.92;
  else if (theme.loyalty >= 75) {
   base.tax *= 1.05;
   base.vassalOpinion += 3;
  }
 }

 // Rajas of India: Dharmic sect, temple endowments, & seasonal monsoon
 const dhar = d.dharmicState?.[realm];
 if (dhar) {
  const sMod = DHARMIC_SECTS[dhar.sect]?.mod;
  if (sMod?.tax) base.tax *= sMod.tax;
  if (sMod?.levy) base.levy *= sMod.levy;
  if (sMod?.trade) base.trade *= sMod.trade;
  if (sMod?.vassalOpinion) base.vassalOpinion += sMod.vassalOpinion;
  if (dhar.templeEndowments > 0) base.tax *= 1 + Math.min(0.1, dhar.templeEndowments * 0.02);
  if (dhar.monsoonActive) base.tax *= 1.08;
 }

 const faithLabel = g.civic?.realms?.[realm]?.faith;
 const reformed = faithLabel ? d.reformedFaiths?.[faithLabel] : null;
 if (reformed) {
  const nat = REFORMATION_NATURES[reformed.nature];
  if (nat?.levy) base.levy *= nat.levy;
  if (nat?.tax) base.tax *= nat.tax;
  if (reformed.doctrines?.includes('syncretism')) base.unrest -= 1;
 }
 return base;
}

export function dlcView(g, realm = g?.player) {
 const d = initDlcSystems(g);
 if (!d || !realm) return null;
 const rId = g.politics?.realms?.[realm]?.ruler;
 const ruler = rId ? g.politics?.people?.[rId] : null;
 const faith = g.civic?.realms?.[realm]?.faith || g.factions?.[realm]?.faith || '';
 const est = d.easternStatus || { stance: 'open', emperorName: 'Jingtai', silkRoadMult: 1.15 };
 const regPol = g.institutions?.realms?.[realm]?.regionalPolitics;
 return {
  focus: d.focuses[rId] || null,
  focuses: WAY_OF_LIFE_FOCUSES,
  loan: d.loans[realm] || null,
  pilgrim: Boolean(d.pilgrims[rId]),
  patricianFund: num(d.patricianFunds[rId]),
  patricianHouses: d.patricianHouses[realm] || null,
  republicTradeZone: d.republicTradeZones[realm] || null,
  dogeElection: d.republicDogeElections[realm] || null,
  nomadClan: d.nomadClans[realm] || null,
  secretFaith: d.secretFaiths[rId] || null,
  reformedFaith: d.reformedFaiths[faith] || null,
  easternGrace: num(d.easternGrace[realm]?.grace),
  easternStatus: { ...est, ...(EASTERN_STANCES[est.stance] || EASTERN_STANCES.open) },
  dharmicState: d.dharmicState[realm] || null,
  imperialTheme: d.imperialThemes[realm] || null,
  sultanateDecadence: regPol?.type === 'sultanate' ? (regPol.decadence ?? 20) : null,
  boon: d.boons[realm] || {},
  annals: d.chronicleAnnals.filter(a => a.realm === realm || !a.realm).slice(0, 12),
  canReformFaith: Boolean(faith && !d.reformedFaiths[faith] && (g.civic?.realms?.[realm]?.faith || '').toLowerCase().includes('tradition')),
  hasCustomKingdom: Boolean(g.feudal?.titles?.['k:custom_' + realm]),
  hasCustomEmpire: Boolean(g.feudal?.titles?.['e:custom_' + realm]),
  rulerHealthSeverity: num(g.living?.health?.[rId]?.severity),
  rulerName: ruler?.name || 'Sovereign'
 };
}

export function dlcAction(g, world, type, id = '', extra = '') {
 const d = initDlcSystems(g, world);
 const realm = g?.player;
 const f = g?.factions?.[realm];
 const s = g?.politics?.realms?.[realm];
 const ruler = s?.ruler ? g.politics?.people?.[s.ruler] : null;
 if (!d || !f || !ruler?.alive) return no('No active ruler or realm.');

 // 1. Way of Life focus selection
 if (type === 'set-focus') {
  if (!WAY_OF_LIFE_FOCUSES[id]) return no('Choose a valid Way of Life focus.');
  const prev = d.focuses[ruler.id];
  if (prev?.id === id) return no('Already following this focus.');
  if (prev && (g.turn || 0) - prev.started < 24) return no('Way of Life focus can be changed every 24 months.');
  d.focuses[ruler.id] = { id, started: g.turn || 0, xp: 0 };
  if (ruler.civic) ruler.civic.focus = WAY_OF_LIFE_FOCUSES[id].skill;
  return ok(`${ruler.name} adopted the ${WAY_OF_LIFE_FOCUSES[id].name}.`);
 }

 // 2. Hajj / Great Pilgrimage
 if (type === 'pilgrimage') {
  if (d.pilgrims[ruler.id]) return no('This ruler has already completed a Great Pilgrimage.');
  if (f.treasury < 120) return no('A Great Pilgrimage costs 120 gold.');
  f.treasury -= 120;
  d.pilgrims[ruler.id] = { turn: g.turn || 0, faith: g.civic?.realms?.[realm]?.faith || 'Faith' };
  ruler.piety = num(ruler.piety) + 18;
  ruler.traits = [...new Set([...(ruler.traits || []), 'pilgrim'])];
  if (ruler.civic) ruler.civic.stress = clamp(num(ruler.civic.stress) - 14, 0, 100);
  recordAnnal(g, realm, `${ruler.name} completed a sacred pilgrimage, earning lifelong piety.`);
  return ok('Pilgrimage completed (+18 piety, -14 stress, Pilgrim trait).');
 }

 // 3. Moneylenders / Court Financiers (Sons of Abraham)
 if (type === 'borrow-loan') {
  if (d.loans[realm]?.active) return no('Repay existing crown debt before borrowing again.');
  if (d.loans[realm]?.expelledUntil > (g.turn || 0)) return no('Court financiers were expelled and will not lend.');
  f.treasury += 300;
  d.loans[realm] = { active: true, principal: 300, repayment: 350, started: g.turn || 0 };
  ruler.prestige = num(ruler.prestige) - 3;
  return ok('Borrowed 300 gold from royal financiers (repay 350g).');
 }
 if (type === 'repay-loan') {
  const loan = d.loans[realm];
  if (!loan?.active) return no('No active crown debt.');
  if (f.treasury < loan.repayment) return no(`Requires ${loan.repayment} gold to clear the debt.`);
  f.treasury -= loan.repayment;
  d.loans[realm] = { active: false, repaidTurn: g.turn || 0 };
  ruler.prestige = num(ruler.prestige) + 5;
  return ok('Repaid crown debt in full (+5 prestige).');
 }

 // 4. Patrician Election Campaign Fund, Palazzos & Trade Zones (The Republic)
 if (type === 'patrician-fund') {
  const amt = Math.max(50, Math.min(300, Number(extra) || 100));
  if (num(ruler.wealth) < amt && f.treasury < amt) return no(`Insufficient funds (${amt}g required).`);
  if (num(ruler.wealth) >= amt) ruler.wealth -= amt;
  else f.treasury -= amt;
  d.patricianFunds[ruler.id] = num(d.patricianFunds[ruler.id]) + amt;
  const houses = d.patricianHouses[realm];
  if (Array.isArray(houses)) {
   const rh = houses.find(h => h.isRulerHouse) || houses[0];
   if (rh) rh.campaignFund = num(rh.campaignFund) + amt;
  }
  return ok(`Contributed ${amt}g to patrician electoral campaign fund.`);
 }
 if (type === 'patrician-palazzo') {
  seedPatricianHouses(g, realm, d);
  const houses = d.patricianHouses[realm];
  const rh = houses?.find(h => h.isRulerHouse) || houses?.[0];
  if (!rh) return no('Only merchant republics and city-states maintain patrician palazzos.');
  if (rh.palazzoLevel >= 4) return no('Ruling patrician palazzo is already at tier 4.');
  const cost = 110 * (rh.palazzoLevel + 1);
  if (f.treasury < cost) return no(`Upgrading the palazzo requires ${cost} gold.`);
  f.treasury -= cost;
  rh.palazzoLevel++;
  rh.prestige += 15;
  ruler.prestige = num(ruler.prestige) + 8;
  recordAnnal(g, realm, `${rh.name} expanded its grand Palazzo to tier ${rh.palazzoLevel}.`);
  return ok(`Upgraded ${rh.name} Palazzo to tier ${rh.palazzoLevel} (+trade & electoral standing).`);
 }
 if (type === 'seize-trade-zone') {
  seedPatricianHouses(g, realm, d);
  const houses = d.patricianHouses[realm];
  const rh = houses?.find(h => h.isRulerHouse) || houses?.[0];
  if (!rh) return no('Requires a merchant republic.');
  if (f.treasury < 140) return no('Chartering a dominant maritime trade zone requires 140 gold.');
  f.treasury -= 140;
  rh.familyTradePosts = Math.min(8, (rh.familyTradePosts || 1) + 1);
  const tz = (d.republicTradeZones[realm] ??= { controllerHouse: rh.id, bonusPct: 12 });
  tz.controllerHouse = rh.id;
  tz.bonusPct = Math.min(30, (tz.bonusPct || 12) + 6);
  const rival = houses.filter(h => h.id !== rh.id).sort((a, b) => b.familyTradePosts - a.familyTradePosts)[0];
  if (rival && rival.familyTradePosts > 1) rival.familyTradePosts--;
  recordAnnal(g, realm, `${rh.name} asserted dominance over the realm's maritime trade zone.`);
  return ok(`${rh.name} expanded trade zone control (${tz.bonusPct}% republic trade bonus).`);
 }

 // 4b. Nomads: Multi-Clan Pasture Redistribution & Settle Feudal (Horse Lords)
 if (type === 'split-clan') {
  const clan = d.nomadClans[realm];
  if (!clan || clan.settled) return no('Only active steppe nomad realms manage horde clans.');
  if ((g.turn || 0) - (clan.lastSplit ?? -120) < 12) return no('Clans can be rebalanced once every 12 months.');
  if (f.treasury < 60 && num(f.prestige) < 10) return no('Requires 60 gold or 10 prestige.');
  if (f.treasury >= 60) f.treasury -= 60;
  else f.prestige = Math.max(0, num(f.prestige) - 10);
  clan.lastSplit = g.turn || 0;
  clan.grazingDispute = false;
  clan.clanSentiment = clamp((clan.clanSentiment ?? 60) + 18, 0, 100);
  for (const sc of clan.clans || []) {
   sc.loyalty = clamp((sc.loyalty ?? 60) + 16, 10, 100);
   if (!sc.royal) sc.pastureShare = Math.min(36, (sc.pastureShare || 28) + 2);
  }
  recordAnnal(g, realm, `${ruler.name} redistributed steppe grazing pastures across the horde clans.`);
  return ok('Nomad grazing pastures balanced (disputes cleared, +18 clan sentiment).');
 }
 if (type === 'settle-feudal') {
  const clan = d.nomadClans[realm];
  if (!clan || g.civic?.realms?.[realm]?.government !== 'steppe') return no('Only active steppe nomad realms may settle into feudalism.');
  const owned = Object.values(g.provinces || {}).filter(p => p.owner === realm);
  if (owned.length < 3 || clan.hordeManpower < 600 || f.treasury < 120) {
   return no('Requires 3 provinces, 600 horde manpower, and 120 gold to establish settled feudal rule.');
  }
  f.treasury -= 120;
  clan.settled = true;
  clan.grazingDispute = false;
  if (g.civic?.realms?.[realm]) g.civic.realms[realm].government = 'feudal';
  f.stability = clamp((f.stability ?? 50) + 10, 0, 100);
  if (owned[0]) owned[0].development = clamp((owned[0].development || 3) + 2, 1, 20);
  recordAnnal(g, realm, `${ruler.name} settled the nomadic horde into a hereditary feudal kingdom!`);
  return ok('Settled the steppe horde into a Feudal monarchy (+10 stability, +2 capital development).');
 }

 // 4c. Rajas of India: Dharmic Sects & Temple Endowments
 if (type === 'dharmic-sect') {
  if (!isDharmicRealm(g, realm)) return no('Sect patronage applies to Dharmic courts.');
  if (!DHARMIC_SECTS[id]) return no('Choose a valid Dharmic sect (shaiva, vaishnava, shakta, guild).');
  const dhar = (d.dharmicState[realm] ??= { sect: 'shaiva', templeEndowments: 0, monsoonActive: false });
  if (dhar.sect === id) return no('Already patronizing this sect.');
  dhar.sect = id;
  ruler.piety = num(ruler.piety) + 6;
  return ok(`Court adopted ${DHARMIC_SECTS[id].name}.`);
 }
 if (type === 'temple-endowment') {
  if (!isDharmicRealm(g, realm)) return no('Temple endowment applies to Dharmic courts.');
  const dhar = (d.dharmicState[realm] ??= { sect: 'shaiva', templeEndowments: 0, monsoonActive: false });
  if (dhar.templeEndowments >= 5) return no('Maximum royal temple endowments reached.');
  if (f.treasury < 110) return no('Endowing a royal temple complex requires 110 gold.');
  f.treasury -= 110;
  dhar.templeEndowments++;
  f.stability = clamp((f.stability ?? 50) + 4, 0, 100);
  ruler.piety = num(ruler.piety) + 12;
  return ok(`Temple endowment expanded (tier ${dhar.templeEndowments}/5, +12 piety, +2% tax).`);
 }

 // 4d. Legacy of Rome Imperial Theme pacification & Crusade Beneficiary / Canonize bridge
 if (type === 'imperial-theme') {
  const th = d.imperialThemes[realm];
  if (!th || g.civic?.realms?.[realm]?.government !== 'imperial') return no('Only imperial courts reorganize provincial themes.');
  if (f.treasury < 100) return no('Reorganizing imperial themes requires 100 gold.');
  f.treasury -= 100;
  th.loyalty = clamp(th.loyalty + 14, 0, 100);
  th.coupRisk = clamp(th.coupRisk - 18, 0, 100);
  th.lastAudit = g.turn || 0;
  return ok(`Imperial themes pacified (Theme loyalty ${th.loyalty}%, coup risk ${th.coupRisk}%).`);
 }
 if (type === 'crusade-beneficiary') {
  return setCrusadeBeneficiary(g, realm, id);
 }
 if (type === 'canonize-saint') {
  return canonizeAncestor(g, realm, id || null);
 }

 // 5. Court Physician Radical Treatment (The Reaper's Due)
 if (type === 'physician-treat') {
  const health = g.living?.health?.[ruler.id];
  if (!health || num(health.severity) <= 0) return no('The ruler does not currently require medical treatment.');
  if ((g.turn || 0) - (d.physicianCooldowns[ruler.id] ?? -24) < 6) return no('Physician treatments have a 6-month recovery interval.');
  const method = ['cautious', 'proven', 'experimental'].includes(id) ? id : 'proven';
  const cost = method === 'experimental' ? 90 : method === 'proven' ? 60 : 30;
  if (f.treasury < cost) return no(`Treatment requires ${cost} gold.`);
  f.treasury -= cost;
  d.physicianCooldowns[ruler.id] = g.turn || 0;
  const roll = hashStr(`phys:${ruler.id}:${method}:${g.turn || 0}`) % 100;
  if (method === 'experimental') {
   if (roll < 62) {
    health.severity = Math.max(0, health.severity - 45);
    if (health.severity === 0) health.condition = 'cured';
    return ok('Radical experiment succeeded! Severe symptoms cleared.');
   }
   health.severity = clamp(health.severity + 10, 0, 100);
   return ok('The experimental treatment proved harsh; recovery stalled.');
  }
  const relief = method === 'proven' ? 28 : 16;
  health.severity = Math.max(0, health.severity - relief);
  if (health.severity === 0) health.condition = 'healthy';
  return ok(`Court physician applied ${method} treatment (-${relief} severity).`);
 }

 // 6. Found Custom Kingdom / Empire (Charlemagne)
 if (type === 'custom-kingdom') {
  const owned = Object.values(g.provinces || {}).filter(p => p.owner === realm);
  if (owned.length < 10) return no('Founding a Custom Kingdom requires at least 10 provinces.');
  if (f.treasury < 350 || num(f.prestige) < 25) return no('Requires 350 gold and 25 prestige.');
  if (g.feudal?.titles?.['k:custom_' + realm]) return no('Custom Kingdom already chartered.');
  f.treasury -= 350;
  f.prestige = num(f.prestige) + 15;
  g.feudal ??= {};
  g.feudal.customTitles ??= {};
  g.feudal.customTitles['k:custom_' + realm] = {
   id: 'k:custom_' + realm, tier: 'crown', feudalTier: 'kingdom', rank: 4,
   realm, deJureRealm: realm, holder: ruler.id, name: `High Kingdom of ${f.name}`,
   members: owned.map(p => 'c:' + p.id)
  };
  g.feudal.titles ??= {};
  g.feudal.titles['k:custom_' + realm] = g.feudal.customTitles['k:custom_' + realm];
  recordAnnal(g, realm, `${ruler.name} proclaimed the ${f.name} High Kingdom.`);
  return ok(`Chartered Custom Kingdom of ${f.name} (+15 prestige).`);
 }
 if (type === 'custom-empire') {
  const owned = Object.values(g.provinces || {}).filter(p => p.owner === realm);
  if (owned.length < 24) return no('Proclaiming a Custom Empire requires at least 24 provinces.');
  if (f.treasury < 700 || num(f.prestige) < 50) return no('Requires 700 gold and 50 prestige.');
  if (g.feudal?.titles?.['e:custom_' + realm]) return no('Custom Empire already proclaimed.');
  f.treasury -= 700;
  f.prestige = num(f.prestige) + 35;
  g.feudal ??= {};
  g.feudal.customTitles ??= {};
  g.feudal.customTitles['e:custom_' + realm] = {
   id: 'e:custom_' + realm, tier: 'empire', feudalTier: 'empire', rank: 5,
   realm, deJureRealm: realm, holder: ruler.id, name: `Imperial Crown of ${f.name}`,
   members: ['k:' + realm]
  };
  g.feudal.titles ??= {};
  g.feudal.titles['e:custom_' + realm] = g.feudal.customTitles['e:custom_' + realm];
  if (g.civic?.realms?.[realm]) g.civic.realms[realm].authority = clamp(num(g.civic.realms[realm].authority) + 10, 0, 100);
  recordAnnal(g, realm, `${ruler.name} founded the Imperial Crown of ${f.name}.`);
  return ok(`Proclaimed Imperial Crown of ${f.name} (+35 prestige, empire rank).`);
 }

 // 7. Coastal / Border Raid (The Old Gods / Horse Lords)
 if (type === 'border-raid') {
  if ((g.turn || 0) - (d.raidCooldowns[realm] ?? -24) < 12) return no('Raids can be launched once per 12 months.');
  const targetProv = g.provinces?.[id];
  if (!targetProv || targetProv.owner === realm || targetProv.owner === 'independent') return no('Choose a foreign settled district.');
  if (f.treaties?.[targetProv.owner] === 'alliance') return no('Cannot raid an allied realm.');
  d.raidCooldowns[realm] = g.turn || 0;
  const enemy = g.factions[targetProv.owner];
  const loot = Math.min(95, Math.max(30, Math.round((targetProv.development || 4) * 14)));
  f.treasury += loot;
  if (enemy) {
   enemy.treasury = Math.max(0, num(enemy.treasury) - Math.round(loot * 0.5));
   enemy.relations[realm] = clamp(num(enemy.relations[realm]) - 15, -100, 100);
  }
  targetProv.unrest = clamp(num(targetProv.unrest) + 10, 0, 100);
  f.prestige = num(f.prestige) + 4;
  recordAnnal(g, realm, `${ruler.name} led a profitable raid against ${targetProv.owner} (+${loot}g).`);
  return ok(`Frontier raid seized ${loot} gold from ${targetProv.owner}.`);
 }

 // 8. Monks & Mystics: Secret Faith Cult & Magnum Opus
 if (type === 'secret-faith') {
  const faithName = String(id || '').trim();
  if (!faithName) return no('Specify a faith to practice secretly.');
  d.secretFaiths[ruler.id] = { faith: faithName, followers: [ruler.id], revealed: false, started: g.turn || 0 };
  return ok(`${ruler.name} quietly adopted secret devotion to ${faithName}.`);
 }
 if (type === 'reveal-cult') {
  const sec = d.secretFaiths[ruler.id];
  if (!sec || sec.revealed) return no('No hidden religious cult to reveal.');
  sec.revealed = true;
  if (g.civic?.realms?.[realm]) g.civic.realms[realm].faith = sec.faith;
  f.faith = sec.faith;
  f.stability = clamp(f.stability - 6, 0, 100);
  ruler.piety = num(ruler.piety) + 12;
  recordAnnal(g, realm, `${ruler.name} openly revealed the secret cult of ${sec.faith}!`);
  return ok(`Openly proclaimed ${sec.faith} as the court's true faith.`);
 }
 if (type === 'magnum-opus') {
  if (ruler.skills?.learning < 3 || f.treasury < 140) return no('Writing a Magnum Opus requires Learning 3+ and 140 gold.');
  if (d.magnumOpus?.[ruler.id]) return no('This scholar-ruler has already authored a Magnum Opus.');
  d.magnumOpus ??= {};
  f.treasury -= 140;
  d.magnumOpus[ruler.id] = { title: `Codex of ${ruler.name}`, author: ruler.id, year: g.year || 1450 };
  g.heritage ??= { realms: {}, artifacts: {}, treasures: {} };
  g.heritage.artifacts ??= {};
  g.heritage.artifacts['opus_' + ruler.id] = { id: 'opus_' + ruler.id, realm, owner: ruler.id, name: `Magnum Opus of ${ruler.name}`, quality: 3, learningBonus: 1, prestigeMonthly: 0.5 };
  ruler.prestige = num(ruler.prestige) + 10;
  return ok(`Authored the Magnum Opus (+1 Learning artifact, +10 prestige).`);
 }

 // 9. Jade Dragon: Eastern Protectorate Grace & Boons
 if (type === 'eastern-grace') {
  const act = JADE_DRAGON_ACTIONS[id];
  if (!act) return no('Unknown Eastern Protectorate action.');
  const state = (d.easternGrace[realm] ??= { grace: 50, cooldowns: {} });
  if (act.grace) {
   if (act.cooldown && (g.turn || 0) - (state.cooldowns[id] ?? -120) < act.cooldown) return no('Action is currently on cooldown.');
   if (f.treasury < act.cost) return no(`Requires ${act.cost} gold.`);
   f.treasury -= act.cost;
   state.grace += act.grace;
   state.cooldowns[id] = g.turn || 0;
   if (id === 'kowtow') f.prestige = Math.max(0, num(f.prestige) - 8);
   return ok(`${act.name}: +${act.grace} Eastern Grace (${state.grace} total).`);
  }
  const stanceMult = EASTERN_STANCES[d.easternStatus?.stance]?.graceCostMult || 1.0;
  const effectiveGraceCost = Math.round(act.graceCost * stanceMult);
  if (state.grace < effectiveGraceCost) return no(`Requires ${effectiveGraceCost} Eastern Grace (have ${state.grace}).`);
  state.grace -= effectiveGraceCost;
  const boon = (d.boons[realm] ??= {});
  if (id === 'boon_trade') boon.tradeUntil = (g.turn || 0) + act.duration;
  else if (id === 'boon_engineers') boon.engineersUntil = (g.turn || 0) + act.duration;
  else if (id === 'boon_marriage') {
   boon.imperialPactUntil = (g.turn || 0) + act.duration;
   f.prestige = num(f.prestige) + 14;
   if (g.factions?.ming && realm !== 'ming') f.treaties.ming = 'alliance';
  }
  return ok(`Redeemed ${act.name} (-${act.graceCost} Grace).`);
 }

 // 10. Holy Fury: Faith Reformation, Forge Bloodline & Duel Rival
 if (type === 'reform-faith') {
  const faith = g.civic?.realms?.[realm]?.faith || '';
  if (!faith || d.reformedFaiths[faith]) return no('Your realm already follows an organized or reformed faith.');
  if (f.treasury < 200 || num(ruler.piety) < 30) return no('Reforming the faith requires 200 gold and 30 ruler piety.');
  const nature = REFORMATION_NATURES[id] ? id : 'warmongering';
  const doc = REFORMATION_DOCTRINES[extra] ? extra : 'meritocracy';
  f.treasury -= 200;
  ruler.piety -= 25;
  d.reformedFaiths[faith] = { nature, doctrines: [doc], reformer: ruler.id, year: g.year || 1450 };
  if (g.identity) {
   g.identity.faithDefinitions ??= {};
   g.identity.faithDefinitions[faith] = { parent: nature === 'warmongering' || nature === 'dogmatic' ? 'Latin Christianity' : 'Hindu traditions', family: faith, reformed: true };
  }
  recordAnnal(g, realm, `${ruler.name} reformed ${faith} (${REFORMATION_NATURES[nature].name} · ${REFORMATION_DOCTRINES[doc].name})!`);
  return ok(`Reformed ${faith} with ${REFORMATION_NATURES[nature].name} & ${REFORMATION_DOCTRINES[doc].name}.`);
 }

 if (type === 'forge-bloodline') {
  if (num(f.prestige) < 40 && num(ruler.prestige) < 40) return no('Requires 40 prestige to forge a founder bloodline.');
  const bId = 'bl_custom_' + ruler.id;
  if (g.deepSystems?.bloodlines?.definitions?.[bId]) return no('This ruler has already forged a bloodline.');
  g.deepSystems ??= { bloodlines: { definitions: {}, members: {} } };
  g.deepSystems.bloodlines ??= { definitions: {}, members: {} };
  g.deepSystems.bloodlines.definitions[bId] = { id: bId, name: `Blood of ${ruler.name}`, founder: ruler.id, vassalOpinion: 6, prestigeMonthly: 0.5, kind: 'heroic' };
  (g.deepSystems.bloodlines.members[ruler.id] ??= []).push(bId);
  ruler.bloodlines = [...new Set([...(ruler.bloodlines || []), bId])];
  recordAnnal(g, realm, `${ruler.name} forged a legendary hereditary bloodline: Blood of ${ruler.name}.`);
  return ok(`Forged hereditary bloodline: Blood of ${ruler.name}.`);
 }

 if (type === 'duel') {
  const opp = g.politics?.people?.[id];
  if (!opp?.alive || opp.id === ruler.id) return no('Choose a living rival or noble.');
  if ((g.turn || 0) - (d.duelCooldowns[ruler.id] ?? -24) < 12) return no('Personal duels have a 12-month cooldown.');
  d.duelCooldowns[ruler.id] = g.turn || 0;
  const myScore = num(ruler.skills?.martial) * 12 + ((ruler.traits || []).includes('brave') ? 14 : 0) + (hashStr(`duel:${ruler.id}:${g.turn}`) % 25);
  const oppScore = num(opp.skills?.martial) * 12 + ((opp.traits || []).includes('brave') ? 14 : 0) + (hashStr(`duel:${opp.id}:${g.turn}`) % 25);
  if (myScore >= oppScore) {
   ruler.prestige = num(ruler.prestige) + 8;
   ruler.traits = [...new Set([...(ruler.traits || []), 'brave'])];
   if (g.living?.health) {
    g.living.health[opp.id] = { condition: 'duel wound', chronic: false, injury: true, severity: 32, started: g.turn || 0 };
   }
   recordAnnal(g, realm, `${ruler.name} bested ${opp.name} in formal trial combat.`);
   return ok(`${ruler.name} won the duel against ${opp.name} (+8 prestige).`);
  }
  if (g.living?.health) {
   g.living.health[ruler.id] = { condition: 'duel wound', chronic: false, injury: true, severity: 28, started: g.turn || 0 };
  }
  return ok(`${opp.name} prevailed in the duel; ${ruler.name} suffered light wounds.`);
 }

 return no('Unknown DLC action.');
}

export function tickDlcSystems(g, world = null) {
 const d = initDlcSystems(g, world);
 if (!d || d.lastTick === g.turn) return;
 d.lastTick = g.turn;

 // Monthly loan interest & autonomous AI Way of Life focuses.
 for (const [realm, s] of Object.entries(g.politics?.realms || {})) {
  const f = g.factions?.[realm];
  const r = g.politics?.people?.[s?.ruler];
  if (!f || !r?.alive) continue;

  const loan = d.loans[realm];
  if (loan?.active && (g.turn || 0) % 12 === 0) {
   f.treasury -= 15;
  }

  // AI focus selection & quarterly focus progression.
  if (!d.focuses[r.id] && r.age >= 18) {
   const keys = Object.keys(WAY_OF_LIFE_FOCUSES);
   const pick = keys[hashStr(`wol:${r.id}:${g.year || 1450}`) % keys.length];
   d.focuses[r.id] = { id: pick, started: g.turn || 0, xp: 0 };
  }
  const foc = d.focuses[r.id];
  if (foc && (g.turn || 0) % 3 === 0) {
   foc.xp += 12;
   if (foc.id === 'hunting' && g.living?.health?.[r.id]?.severity > 0) {
    g.living.health[r.id].severity = Math.max(0, g.living.health[r.id].severity - 5);
   }
   if (foc.id === 'theology') r.piety = num(r.piety) + 1;
   if (foc.id === 'business') r.wealth = num(r.wealth) + 8;
   if (foc.id === 'war') r.prestige = num(r.prestige) + 1;
   if (foc.xp >= 120) {
    foc.xp = 0;
    const sk = WAY_OF_LIFE_FOCUSES[foc.id]?.skill;
    if (sk && r.skills && r.skills[sk] < 5) r.skills[sk]++;
   }
  }

  // Nomadic multi-clan dynamics (Horse Lords)
  const clan = d.nomadClans[realm];
  if (clan && !clan.settled && (g.turn || 0) % 6 === 0) {
   const ownedCount = Object.values(g.provinces || {}).filter(p => p.owner === realm).length;
   clan.hordeManpower = clamp(450 + ownedCount * 120, 400, 8000);
   clan.clanSentiment = clamp(clan.clanSentiment + (f.stability >= 60 ? 2 : -3), 15, 100);
   let lowLoyalty = false;
   for (const sc of clan.clans || []) {
    sc.manpower = Math.round(clan.hordeManpower * ((sc.pastureShare || 33) / 100));
    if (!sc.royal) {
     sc.loyalty = clamp(sc.loyalty + (f.stability >= 55 && sc.pastureShare >= 26 ? 1 : -3), 10, 100);
     if (sc.loyalty < 35) lowLoyalty = true;
    }
   }
   if (clan.clanSentiment < 38 || lowLoyalty) {
    if (!clan.grazingDispute) {
     clan.grazingDispute = true;
     recordAnnal(g, realm, `Minor clan grazing dispute erupted in ${f.name} horde territories!`);
    }
   }
  }

  // Merchant Republic Doge Elections across 5 Patrician Houses
  const houses = d.patricianHouses[realm];
  const doge = d.republicDogeElections[realm];
  if (Array.isArray(houses) && houses.length >= 2 && doge && (g.turn || 0) >= doge.nextTurn) {
   const scored = houses.map(h => ({
    h,
    score: (h.palazzoLevel || 1) * 25 + (h.familyTradePosts || 1) * 15 + (h.prestige || 0) * 0.4 + (h.campaignFund || 0) * 0.5
   })).sort((a, b) => b.score - a.score || a.h.id.localeCompare(b.h.id));
   const winner = scored[0].h;
   for (const h of houses) {
    h.isRulerHouse = h.id === winner.id;
    h.campaignFund = Math.round((h.campaignFund || 0) * 0.25);
   }
   doge.winnerHouse = winner.name;
   doge.lastTurn = g.turn || 0;
   doge.nextTurn = (g.turn || 0) + 48;
   recordAnnal(g, realm, `House ${winner.name} won the Merchant Republic election in ${f.name}.`);
  }

  // Imperial Theme coup risk drift
  const th = d.imperialThemes[realm];
  if (th && (g.turn || 0) % 6 === 0) {
   th.coupRisk = clamp(th.coupRisk + (f.stability < 50 ? 4 : -1), 0, 100);
   th.loyalty = clamp(th.loyalty + (f.stability >= 60 ? 1 : -2), 10, 100);
  }

  // Rajas of India monsoon rhythm (months 5-8)
  const dhar = d.dharmicState[realm];
  if (dhar) {
   const isMonsoon = (g.month || 0) >= 5 && (g.month || 0) <= 8;
   dhar.monsoonActive = isMonsoon;
   if (isMonsoon && (g.turn || 0) % 2 === 0) f.food = (f.food || 0) + 6;
  }
 }

 // Eastern Empire stance shift every 36 months deterministically
 if ((g.turn || 0) > 0 && (g.turn || 0) % 36 === 0) {
  const keys = Object.keys(EASTERN_STANCES);
  const nextKey = keys[hashStr(`eastern:${g.turn}`) % keys.length];
  const def = EASTERN_STANCES[nextKey];
  d.easternStatus = { stance: nextKey, emperorName: d.easternStatus?.emperorName || 'Chenghua', silkRoadMult: def.silkRoadMult, lastShift: g.turn };
 }
}
