import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createGame, advanceMonth } from '../src/simulation.js';
import { buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld } from '../src/historical-world.js';
import { removePoliticalCharacter } from '../src/dynastic-politics.js';
import {
 initFeudal, syncTitles, titleList, createTitle, transferVassal,
 capturePrisoner, executePrisoner, feudalAction, TITLE_TIERS
} from '../src/feudal-systems.js';
import {
 initConflict, councilVoteBreakdown, councilPermission, conflictAction,
 ACTIVE_FACTION_STATUSES, tickConflict
} from '../src/political-conflict.js';
import {
 tickAgency, factionCandidates, evolveCharacterTraits
} from '../src/character-agency.js';
import { initIntrigue, intrigueAction, tickIntrigue } from '../src/intrigue-systems.js';
import {
 tickDeJureDrift, governanceStrain, spreadEpidemics, toggleCourtIsolation,
 isCourtIsolated, coronateRuler, canonizeAncestor, selectReligiousSchool,
 deepSystemsView
} from '../src/ck2-deep-systems.js';
import { governmentAction, governmentMechanics, institutionModifiers } from '../src/government-institutions.js';
import { faithSystemView, faithSystemModifiers, faithCharterAction } from '../src/faith-institutions.js';
import {
 allEmergentEventCount, allEmergentDecisionCount, reactiveEmergentCandidates, tickEmergent
} from '../src/emergent-content.js';

const readJson = name => JSON.parse(readFileSync(new URL('../data/' + name, import.meta.url)));
const baseWorld = readJson('world.json');
const polities1450 = readJson('historical-polities-1450.json');
const denseWorld = densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(baseWorld, polities1450)));

function assertNoCircularLieges(g, realm) {
 const titles = g.feudal?.titles || {};
 for (const t of Object.values(titles)) {
  if (t.realm !== realm) continue;
  const seen = new Set([t.holder]);
  let cur = t.deFactoLiege;
  let steps = 0;
  while (cur && steps < 20) {
   assert.equal(seen.has(cur), false, `Circular liege detected on ${t.id} involving ${cur}`);
   seen.add(cur);
   const parentTitle = Object.values(titles).find(pt => pt.realm === realm && pt.holder === cur && pt.rank > t.rank);
   cur = parentTitle?.deFactoLiege || null;
   steps++;
  }
 }
}

test('1. Multi-generation inheritance integrity for England across >= 180 years', () => {
 const g = createGame(baseWorld, 'england');
 g.kingdom.difficulty = 'peaceful';
 initFeudal(g, baseWorld);
 // Ensure empire tier also exists so all 5 tiers participate across successions
 createTitle(g, baseWorld, 'england', 'e:england', { force: true, free: true, name: 'Angevin Empire' });

 const initialIndependent = Object.keys(g.independentPolities || {}).length;
 assert.equal(Object.hasOwn(g.politics.realms, 'independent'), false);

 // Simulate 10 generational ruler deaths spanning >= 190 years with live monthly ticks between reigns
 const generations = 10;
 for (let gen = 0; gen < generations; gen++) {
  for (let m = 0; m < 3; m++) {
   advanceMonth(g, baseWorld);
  }
  // Advance remaining ~19 years of reign to span >= 190 years across 10 generations
  for (let y = 0; y < 19; y++) {
   g.year += 1;
   g.turn += 12;
   for (const p of Object.values(g.politics.people)) {
    if (p.alive) p.age += 1;
   }
  }
  const rulerId = g.politics.realms.england.ruler;
  const removed = removePoliticalCharacter(g, baseWorld, rulerId);
  assert.equal(removed, true, `Ruler ${rulerId} succession ${gen + 1} must succeed`);

  // Ensure every holding in England has a living lord in the realm (no orphaned holdings)
  for (const [pid, h] of Object.entries(g.politics.holdings)) {
   if (h.realm !== 'england') continue;
   const lord = g.politics.people[h.lord];
   assert.ok(lord?.alive, `Holding ${pid} orphaned after generation ${gen + 1}`);
   assert.equal(lord.realm, 'england');
  }
  assertNoCircularLieges(g, 'england');
 }

 assert.ok(g.year - 1450 >= 180, `Expected >= 180 years elapsed, got ${g.year - 1450}`);
 assert.ok(g.kingdom.courts.england.successions >= generations);

 // Verify 5-tier title hierarchy remains valid
 const titles = titleList(g, 'england');
 const tiers = new Set(titles.map(t => t.feudalTier || t.tier));
 for (const tier of TITLE_TIERS) {
  assert.ok(tiers.has(tier), `Missing 5-tier title level '${tier}' after multi-generation inheritance`);
 }
 assert.equal(Object.hasOwn(g.politics.realms, 'independent'), false);
 assert.equal(Object.keys(g.independentPolities || {}).length, initialIndependent);
});

test('2. Multi-government divergence across Venice, England, Vijayanagara, Horde, and Ming', () => {
 const g = createGame(denseWorld, 'venice');
 for (const id of ['venice', 'england', 'vijayanagara', 'horde', 'ming']) {
  assert.ok(g.factions[id], `Missing realm ${id} in denseWorld`);
  g.factions[id].treasury = 2500;
  g.factions[id].prestige = 200;
 }

 const profiles = Object.fromEntries(
  ['venice', 'england', 'vijayanagara', 'horde', 'ming'].map(id => [id, governmentMechanics(g, id)])
 );
 assert.equal(profiles.venice.type, 'republic');
 assert.equal(profiles.england.type, 'feudal');
 assert.equal(profiles.horde.type, 'steppe');
 assert.equal(profiles.ming.type, 'imperial');
 assert.notEqual(profiles.venice.officeRule, profiles.horde.officeRule);
 assert.notEqual(profiles.ming.succession, profiles.venice.succession);

 // Venice republic trade monopoly
 const venRes = governmentAction(g, denseWorld, 'republic:monopoly');
 assert.equal(venRes.ok, true);
 assert.ok(institutionModifiers(g, 'venice').trade >= 1.15);

 // Horde steppe cavalry surge
 g.player = 'horde';
 const armyBefore = Object.values(g.armies).find(a => a.owner === 'horde').cavalry;
 const hordeRes = governmentAction(g, denseWorld, 'steppe:cavalry');
 assert.equal(hordeRes.ok, true);
 assert.ok(Object.values(g.armies).find(a => a.owner === 'horde').cavalry > armyBefore);
 assert.ok(institutionModifiers(g, 'horde').levy >= 1.14);

 // Ming imperial anti-corruption purge
 g.player = 'ming';
 const mingRes = governmentAction(g, denseWorld, 'imperial:purge');
 assert.equal(mingRes.ok, true);
 assert.ok(institutionModifiers(g, 'ming').tax >= 1.12);

 // England feudal compact + Vijayanagara regional/samanta mechanics
 g.player = 'england';
 const engTarget = Object.entries(g.politics.holdings).find(([, h]) => h.realm === 'england')?.[0];
 if (engTarget) {
  assert.equal(governmentAction(g, denseWorld, engTarget).ok, true);
  assert.ok(institutionModifiers(g, 'england').levy > 1.0);
 }
 const vijMech = governmentMechanics(g, 'vijayanagara');
 assert.ok(vijMech.type && vijMech.mode);
});

test('3. Execution -> son/heir grudge -> claimant faction revolt cascade', () => {
 const g = createGame(baseWorld, 'england');
 initFeudal(g, baseWorld);
 const rulerId = g.politics.realms.england.ruler;
 const fatherEntry = Object.entries(g.politics.holdings).find(([, h]) => h.realm === 'england' && h.lord !== rulerId);
 assert.ok(fatherEntry, 'England must have a landed vassal holding');
 const [provId, holding] = fatherEntry;
 const father = g.politics.people[holding.lord];
 father.age = 48;

 // Ensure adult living son who stands to inherit father's holding
 const sonId = 'heir_of_' + father.id;
 const son = {
  id: sonId, name: 'Edmund Fitz' + father.name.split(' ')[0], realm: 'england', house: father.house,
  sex: 'male', age: 24, alive: true, wealth: 180, prestige: 45, piety: 10,
  traits: ['ambitious', 'brave'], parents: [father.id], children: [],
  skills: { diplomacy: 3, martial: 4, stewardship: 3, intrigue: 3, learning: 2 },
  civic: { culture: g.civic.realms.england.culture, faith: g.civic.realms.england.faith, stress: 10 },
  grievances: [], memories: []
 };
 g.politics.people[sonId] = son;
 father.children = [sonId];

 assert.equal(capturePrisoner(g, 'england', father.id, 'suspected treason'), true);
 const execRes = feudalAction(g, baseWorld, 'execute', father.id);
 assert.equal(execRes.ok, true, execRes.msg);
 assert.equal(father.alive, false);
 assert.ok((g.feudal.tyranny.england || 0) >= 15);
 assert.equal(g.politics.holdings[provId].lord, sonId, 'Son inherited executed father’s county');
 assert.ok(son.grievances.some(gr => gr.reason === 'executed kin' && gr.severity >= 60 && gr.permanent), 'Permanent executed kin grievance assigned');

 // Son appears in factionCandidates and launches a claimant faction that escalates to revolt
 g.factions.england.stability = 50;
 const cands = factionCandidates(g, 'england');
 assert.ok(cands.some(c => c.person === sonId && c.severeGrievance?.reason === 'executed kin'));

 // Advance monthly ticks across agency cohorts and quarterly conflict checks
 for (let t = 0; t < 24; t++) {
  g.turn++;
  tickAgency(g);
  tickConflict(g, baseWorld);
 }
 const factions = Object.values(g.conflict.factions).filter(fx => fx.realm === 'england');
 const claimantOrLiberty = factions.find(fx => fx.kind === 'claimant' || fx.kind === 'liberty');
 assert.ok(claimantOrLiberty, 'Aggrieved heir must trigger a claimant or liberty faction');
 assert.ok([...ACTIVE_FACTION_STATUSES, 'concessions', 'rebel victory', 'royal victory'].includes(claimantOrLiberty.status));
 const traitGains = evolveCharacterTraits(g, son, 'victory');
 assert.ok(Array.isArray(traitGains));
});

test('4. Assassination exposure applies kin bereavement, grievance, and sovereign ripple', () => {
 const g = createGame(baseWorld, 'france');
 initIntrigue(g);
 const targetRulerId = g.politics.realms.england.ruler;
 const targetRuler = g.politics.people[targetRulerId];
 const kinId = Object.values(g.politics.people).find(p => p.alive && p.realm === 'england' && p.id !== targetRulerId)?.id;
 assert.ok(kinId);
 const kin = g.politics.people[kinId];
 kin.parents = [...new Set([...(kin.parents || []), targetRulerId])];
 targetRuler.children = [...new Set([...(targetRuler.children || []), kinId])];

 g.factions.france.treaties.england = 'alliance';
 g.factions.england.treaties.france = 'alliance';
 // Force guaranteed success & exposed assassination via rigged odds/seed
 g.factions.france.treasury = 500;
 g.factions.england.legitimacy = 80;
 targetRuler.skills.intrigue = 0;
 g.politics.people[g.politics.realms.france.ruler].skills.intrigue = 5;

 // Verify exposed assassination directly triggers bereavement + grievance on kin & sovereign legitimacy drop
 for (let seed = 1; seed < 50; seed++) {
  if (!targetRuler.alive) break;
  g.intrigue.plots.p_find = {
   id: 'p_find', realm: 'france', actor: g.politics.realms.france.ruler,
   target: targetRulerId, targetRealm: 'england', kind: 'assassinate',
   category: 'hostile', agents: [kinId], started: g.turn, due: g.turn, status: 'active',
   autonomous: false, approach: 'focused', preparation: 25, discoveredAt: g.turn
  };
  g.intrigue.seed = seed;
  g.intrigue.lastTick = g.turn - 1;
  tickIntrigue(g, baseWorld, removePoliticalCharacter);
 }
 assert.equal(targetRuler.alive, false, 'Target ruler assassinated');
 assert.ok(kin.grievances.some(gr => gr.reason === 'assassinated kin' && gr.severity >= 60), 'Close kin receives assassinated kin grievance');
 assert.ok(g.factions.england.legitimacy < 80, 'Sovereign assassination drops realm legitimacy');
 assert.notEqual(g.factions.england.treaties.france, 'alliance', 'Exposed regicide breaks alliance treaty');
});

test('5. Epidemic geographic spread & court isolation mitigation', () => {
 const g = createGame(baseWorld, 'england');
 const engProvs = baseWorld.provinces.filter(p => g.provinces[p.id]?.owner === 'england' && (p.neighbors || []).length > 0);
 const origin = engProvs[0];
 g.economy ??= { provinces: {}, crises: {} };
 g.economy.crises = {
  [origin.id]: { province: origin.id, kind: 'epidemic', severity: 85, started: 0, remaining: 10, reliefTurn: -12 }
 };

 // Isolated court protects courtiers from epidemic illness
 const isoRes = toggleCourtIsolation(g, 'england');
 assert.equal(isoRes.ok, true);
 assert.equal(isCourtIsolated(g, 'england'), true);
 g.turn = 1;
 const isoStep = spreadEpidemics(g, baseWorld);
 assert.equal(isoStep.infected.length, 0, 'Court isolation shields courtiers from epidemic infection');

 // Reopening court exposes courtiers & propagates epidemic across turns cleanly
 toggleCourtIsolation(g, 'england');
 assert.equal(isCourtIsolated(g, 'england'), false);
 let totalInfected = 0;
 let totalSpread = 0;
 for (let t = 2; t <= 14; t++) {
  g.turn = t;
  const step = spreadEpidemics(g, baseWorld);
  totalInfected += step.infected.length;
  totalSpread += step.spread.length;
 }
 assert.ok(totalInfected > 0, 'Unisolated epidemic infects court characters deterministically');
 assert.ok(totalSpread > 0, 'High-severity epidemic spreads to neighboring provinces');
 assert.ok(Object.keys(g.heritage.epidemics || {}).length >= 1, 'Map epidemic overlay stays synchronized');
});

test('6. Council binding veto breakdown & favor concession bypass', () => {
 const g = createGame(baseWorld, 'england');
 const c = initConflict(g);
 c.council.england = 'binding';
 g.factions.england.legitimacy = 25;
 g.factions.england.stability = 30;
 g.factions.england.treasury = 1200;

 // Force dissenting traits across council seats
 for (const [, cid] of Object.entries(g.politics.realms.england.council)) {
  const person = g.politics.people[cid];
  if (person) {
   person.traits = ['ambitious', 'cautious', 'just'];
   g.chronicles ??= { version: 1, seed: 1, realms: {}, relationships: {}, history: [], lastTick: -1 };
   const pair = [g.politics.realms.england.ruler, cid].sort().join('|');
   g.chronicles.relationships[pair] = { a: g.politics.realms.england.ruler, b: cid, opinion: -45, kind: 'rival', last: 0 };
  }
 }

 const blocked = councilVoteBreakdown(g, 'england', 'revoke');
 assert.equal(blocked.permitted, false);
 assert.equal(blocked.binding, true);
 assert.ok(blocked.yesCount < blocked.needed);
 assert.ok(blocked.blockingReasons.length >= 2);
 assert.equal(councilPermission(g, 'england', 'revoke'), false);

 // Buy favors for enough councillors to reach majority
 for (const v of blocked.votes.slice(0, blocked.needed)) {
  const fav = conflictAction(g, baseWorld, 'favor', v.id);
  assert.equal(fav.ok, true, fav.msg);
 }

 const bypassed = councilVoteBreakdown(g, 'england', 'revoke');
 assert.equal(bypassed.permitted, true, 'Favors must override binding council veto');
 assert.ok(bypassed.yesCount >= bypassed.needed);
 assert.equal(councilPermission(g, 'england', 'revoke'), true);
});

test('7. Coronation, religious school, canonization, de jure drift, 50-vassal strain & emergent stories', () => {
 const g = createGame(denseWorld, 'england');
 initFeudal(g, denseWorld);
 g.factions.england.treasury = 5000;
 g.factions.england.legitimacy = 55;
 g.factions.england.piety = 90;

 // Coronation
 const cor = faithCharterAction(g, 'england', 'faith-coronate', 'papal');
 assert.equal(cor.ok, true);
 assert.ok(g.factions.england.legitimacy >= 70);
 assert.equal(coronateRuler(g, 'england', 'royal').ok, false, 'Cannot double-coronate the same ruler');

 // Religious school selection
 const sch = faithCharterAction(g, 'england', 'faith-school', 'thomistic');
 assert.equal(sch.ok, true);
 assert.equal(faithSystemView(g, 'england').religiousSchool?.id, 'thomistic');
 assert.ok(faithSystemModifiers(g, 'england').tax > 1.0);

 g.factions.ottomans.treasury = 500;
 assert.equal(selectReligiousSchool(g, 'ottomans', 'ashari').ok, true);
 g.factions.vijayanagara.treasury = 500;
 assert.equal(selectReligiousSchool(g, 'vijayanagara', 'advaita').ok, true);

 // Canonization of deceased pious ancestor
 const r = g.politics.people[g.politics.realms.england.ruler];
 const anc = {
  id: 'saint_anc_1', name: 'Saintly King Edward', realm: 'england', house: r.house,
  sex: 'male', age: 62, alive: false, piety: 120, wealth: 0, traits: ['just', 'zealous'],
  children: [r.id], parents: [], skills: { diplomacy: 4, martial: 3, stewardship: 3, intrigue: 2, learning: 5 }
 };
 g.politics.people[anc.id] = anc;
 const can = faithCharterAction(g, 'england', 'faith-canonize', anc.id);
 assert.equal(can.ok, true, can.msg);
 assert.ok(deepSystemsView(g, 'england').bloodlines.some(b => b.kind === 'saint'), 'Saintly bloodline granted to ruler');

 // De Jure Drift: conquer/assign a Scottish province and hold continuously for 120 months
 const scotProv = denseWorld.provinces.find(p => p.owner === 'scotland');
 assert.ok(scotProv);
 assert.equal(g.feudal.titles['c:' + scotProv.id].deJureRealm, 'scotland');
 g.provinces[scotProv.id].owner = 'england';
 g.politics.holdings[scotProv.id].realm = 'england';
 g.politics.holdings[scotProv.id].lord = r.id;
 syncTitles(g);

 for (let m = 1; m <= 119; m++) {
  g.turn++;
  tickDeJureDrift(g, denseWorld);
 }
 assert.equal(g.feudal.titles['c:' + scotProv.id].deJureRealm, 'scotland', 'Must not drift before 120 months');

 g.turn++;
 const drifted = tickDeJureDrift(g, denseWorld);
 assert.ok(drifted.some(x => x.province === scotProv.id && x.to === 'england'));
 assert.equal(g.feudal.titles['c:' + scotProv.id].deJureRealm, 'england');
 syncTitles(g);
 assert.equal(g.feudal.titles['c:' + scotProv.id].deJureRealm, 'england', 'De jure drift survives syncTitles');

 // 50-Vassal Empire Scale Friction (50 direct counts under the crown)
 const extraProvs = denseWorld.provinces.filter(p => p.owner !== 'independent').slice(0, 50);
 for (let i = 0; i < extraProvs.length; i++) {
  const pid = extraProvs[i].id;
  const vid = 'vassal_50_' + i;
  g.politics.people[vid] = {
   id: vid, name: 'Baron ' + i, realm: 'england', house: 'VassalHouse' + i,
   sex: 'male', age: 30, alive: true, wealth: 50, traits: ['content'],
   skills: { diplomacy: 2, martial: 2, stewardship: 2, intrigue: 2, learning: 2 },
   children: [], parents: [], grievances: [], memories: []
  };
  g.provinces[pid].owner = 'england';
  g.politics.holdings[pid] = { realm: 'england', lord: vid, loyalty: 75, tax: 1, levy: 1, autonomy: 1, wealth: 20 };
  g.feudal.vassalTransfers['c:' + pid] = r.id;
 }
 syncTitles(g);
 const strained = governanceStrain(g, 'england');
 assert.equal(strained.active, true, '50+ direct vassals triggers empire governance strain');
 assert.ok(strained.vassalCount >= 45 && strained.excess > 0 && strained.taxPenalty > 0);

 // Delegate vassals under regional dukes to relieve direct vassal limit friction
 const dukeProvs = extraProvs.slice(0, 3);
 const dukes = dukeProvs.map((_, idx) => 'vassal_50_' + idx);
 for (const [tid, t] of Object.entries(g.feudal.titles)) {
  if (t.realm === 'england' && (t.feudalTier === 'duchy' || t.tier === 'regional') && t.holder !== r.id && !dukes.includes(t.holder)) {
   delete g.feudal.titles[tid];
  }
 }
 for (let i = 0; i < dukeProvs.length; i++) {
  const pid = dukeProvs[i].id;
  const distId = 'd:synthetic_duke_' + i + ':england';
  g.feudal.titles[distId] = {
   id: distId, tier: 'regional', feudalTier: 'duchy', rank: 3,
   realm: 'england', deJureRealm: 'england', holder: dukes[i], deFactoLiege: r.id, members: [pid]
  };
 }
 for (let i = 3; i < extraProvs.length; i++) {
  const pid = extraProvs[i].id;
  const duke = dukes[i % dukes.length];
  g.feudal.vassalTransfers['c:' + pid] = duke;
  if (g.feudal.titles['c:' + pid]) g.feudal.titles['c:' + pid].deFactoLiege = duke;
 }
 const relieved = governanceStrain(g, 'england');
 assert.equal(relieved.active, false, 'Delegating counties under dukes relieves direct vassal governance strain');
 assert.ok(relieved.delegatedCount >= 45);

 // Reactive emergent storylines preserve baseline 90/10 counts while reacting to simulation state
 assert.equal(allEmergentEventCount(), 90);
 assert.equal(allEmergentDecisionCount(), 10);
 g.politics.people['vassal_50_0'].grievances = [{ against: r.id, reason: 'executed kin', severity: 60, turn: g.turn, permanent: true }];
 g.economy.crises[extraProvs[0].id] = { province: extraProvs[0].id, kind: 'epidemic', severity: 65, started: g.turn, remaining: 8, reliefTurn: -12 };
 const reactive = reactiveEmergentCandidates(g, 'england').map(e => e.id);
 assert.ok(reactive.includes('em_kin_vendetta'));
 assert.ok(reactive.includes('em_plague_gates'));

 g.turn += 15;
 tickEmergent(g, denseWorld);
 assert.ok(g.emergent.realms.england.active?.id?.startsWith('em_'));
});
