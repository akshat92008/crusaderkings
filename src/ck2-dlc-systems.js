/**
 * CK2 All-DLC Expansion Mechanics & Moddable Scenarios Core
 * Covers Way of Life, Sword of Islam, Sons of Abraham, The Republic, Horse Lords,
 * The Old Gods, Charlemagne, The Reaper's Due, Monks & Mystics, Jade Dragon, and Holy Fury.
 * Deterministic, zero Math.random().
 */
import { hashStr } from './ck2-deep-systems.js';

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

export function initDlcSystems(g, world = null) {
 if (!g || typeof g !== 'object') return null;
 const d = (g.dlcSystems ??= {
  version: 1,
  lastTick: -1,
  focuses: {},
  loans: {},
  pilgrims: {},
  patricianFunds: {},
  nomadClans: {},
  secretFaiths: {},
  reformedFaiths: {},
  easternGrace: {},
  boons: {},
  chronicleAnnals: [],
  physicianCooldowns: {},
  duelCooldowns: {},
  raidCooldowns: {}
 });
 d.focuses ??= {};
 d.loans ??= {};
 d.pilgrims ??= {};
 d.patricianFunds ??= {};
 d.nomadClans ??= {};
 d.secretFaiths ??= {};
 d.reformedFaiths ??= {};
 d.easternGrace ??= {};
 d.boons ??= {};
 d.chronicleAnnals ??= [];
 d.physicianCooldowns ??= {};
 d.duelCooldowns ??= {};
 d.raidCooldowns ??= {};

 // Seed nomadic clan balance for steppe realms.
 for (const [realm, c] of Object.entries(g.civic?.realms || {})) {
  if (c?.government === 'steppe' && !d.nomadClans[realm]) {
   d.nomadClans[realm] = { hordeManpower: 850, clanSentiment: 70, grazingShare: 0.65, lastSplit: -120 };
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

 const clan = d.nomadClans?.[realm];
 if (clan && clan.clanSentiment >= 60) {
  base.levy *= 1.12;
 } else if (clan && clan.clanSentiment < 35) {
  base.unrest += 1;
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
 return {
  focus: d.focuses[rId] || null,
  focuses: WAY_OF_LIFE_FOCUSES,
  loan: d.loans[realm] || null,
  pilgrim: Boolean(d.pilgrims[rId]),
  patricianFund: num(d.patricianFunds[rId]),
  nomadClan: d.nomadClans[realm] || null,
  secretFaith: d.secretFaiths[rId] || null,
  reformedFaith: d.reformedFaiths[faith] || null,
  easternGrace: num(d.easternGrace[realm]?.grace),
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

 // 4. Patrician Election Campaign Fund (The Republic)
 if (type === 'patrician-fund') {
  const amt = Math.max(50, Math.min(300, Number(extra) || 100));
  if (num(ruler.wealth) < amt && f.treasury < amt) return no(`Insufficient funds (${amt}g required).`);
  if (num(ruler.wealth) >= amt) ruler.wealth -= amt;
  else f.treasury -= amt;
  d.patricianFunds[ruler.id] = num(d.patricianFunds[ruler.id]) + amt;
  return ok(`Contributed ${amt}g to patrician electoral campaign fund.`);
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
  if (state.grace < act.graceCost) return no(`Requires ${act.graceCost} Eastern Grace (have ${state.grace}).`);
  state.grace -= act.graceCost;
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

  // Nomadic clan dynamics (Horse Lords)
  const clan = d.nomadClans[realm];
  if (clan && (g.turn || 0) % 6 === 0) {
   const ownedCount = Object.values(g.provinces || {}).filter(p => p.owner === realm).length;
   clan.hordeManpower = clamp(450 + ownedCount * 120, 400, 8000);
   clan.clanSentiment = clamp(clan.clanSentiment + (f.stability >= 60 ? 2 : -3), 15, 100);
  }
 }
}
