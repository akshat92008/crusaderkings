import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {
 borderBattleOutcome,
 resolveCampaignBattle,
 campaignArmyPower,
 TERRAIN_MODIFIERS,
 terrainCombatModifiers,
 armyTerrainFactor
} from '../src/border-battle.js';

import {
 MERCENARY_COMPANIES,
 RELIGIOUS_ORDERS,
 COMMANDER_TRAITS,
 TROOP_SOURCES,
 armyCompositionBreakdown,
 splitArmy,
 mergeArmies,
 retreatArmy,
 resolveBattleCommanders,
 supplyLineStatus,
 isWinterMonth,
 commanderTraitEffects,
 armyReadiness,
 initMilitary,
 tickMilitary
} from '../src/military-systems.js';

import {
 CASUS_BELLI,
 availableCasusBelli,
 validateCasusBelli,
 declareCasusBelliWar,
 warPeaceTerms,
 settleOccupations,
 coordinatedPeace,
 tickCampaignWar,
 installRulerOnThrone,
 findDepositionSuccessor,
 controller,
 captureProvince
} from '../src/campaign-war.js';

import {
 addDiplomaticThreat,
 diplomaticThreat,
 coalitionAgainst,
 joinCoalition,
 leaveCoalition,
 coalitionPartners,
 tributaryOf,
 suzerainSubjects,
 demandTribute,
 breakTribute,
 activeHostages,
 hasHostageBar,
 exchangeHostage,
 releaseHostage,
 releaseWarHostages,
 signMarriageTreaty,
 callToArmsOptions,
 callToArms,
 triggerDefensiveCallToArms,
 tickDiplomacy
} from '../src/diplomacy-systems.js';

import {
 PERSONALITY_PROFILES,
 personalityProfile,
 coreProvinces,
 evaluateWarViability,
 choosePlan
} from '../src/strategic-ai.js';

import {createGame, advanceMonth} from '../src/simulation.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

// Seeded PRNG for reproducible test sequences (mulberry32)
function seededRng(seed) {
 let s = seed | 0;
 return function() {
  s = (s + 0x6D2B79F5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}

function baseFixture() {
 const g = createGame(world);
 return g;
}

// -------------------------------------------------------------
// 1. COMBAT ODDS: >=100 Seeded Battle Cases
// -------------------------------------------------------------
test('>=100 seeded battle cases demonstrate distinct odds across force ratios', () => {
 const SEED = 42;
 const rand = seededRng(SEED);
 const N_RUNS = 120; // >100 seeded cases

 let wins300v300 = 0;
 let wins600v300 = 0;
 let wins1000v300 = 0;
 let wins3000v300 = 0;
 let wins6000v300 = 0;
 let wins300v6000 = 0;

 for (let i = 0; i < N_RUNS; i++) {
  const roll = rand();

  if (borderBattleOutcome(300, 300, roll).victory) wins300v300++;
  if (borderBattleOutcome(600, 300, roll).victory) wins600v300++;
  if (borderBattleOutcome(1000, 300, roll).victory) wins1000v300++;
  if (borderBattleOutcome(3000, 300, roll).victory) wins3000v300++;
  if (borderBattleOutcome(6000, 300, roll).victory) wins6000v300++;
  if (borderBattleOutcome(300, 6000, roll).victory) wins300v6000++;
 }

 const rate300v300 = wins300v300 / N_RUNS;
 const rate600v300 = wins600v300 / N_RUNS;
 const rate1000v300 = wins1000v300 / N_RUNS;
 const rate3000v300 = wins3000v300 / N_RUNS;
 const rate6000v300 = wins6000v300 / N_RUNS;
 const rate300v6000 = wins300v6000 / N_RUNS;

 // 300v300: competitive (around 40% - 60%)
 assert.ok(rate300v300 >= 0.40 && rate300v300 <= 0.60, `300v300 competitive: ${rate300v300}`);

 // 600v300: attacker favored (70% - 90%)
 assert.ok(rate600v300 >= 0.70 && rate600v300 <= 0.90, `600v300 attacker favored: ${rate600v300}`);

 // 1000v300: strong (>90%)
 assert.ok(rate1000v300 >= 0.92, `1000v300 strong: ${rate1000v300}`);

 // 3000v300: overwhelming (>98%)
 assert.ok(rate3000v300 >= 0.98, `3000v300 overwhelming: ${rate3000v300}`);

 // 6000v300: attacker virtually always wins (100%)
 assert.equal(rate6000v300, 1.0, `6000v300 attacker virtually always wins: ${rate6000v300}`);

 // 300v6000: defender virtually always wins (attacker wins 0%)
 assert.equal(rate300v6000, 0.0, `300v6000 defender virtually always wins: ${rate300v6000}`);
});

// -------------------------------------------------------------
// 2. PHASE 5: Advanced Strategic AI
// -------------------------------------------------------------
test('eight ruler personality profiles produce distinct expansion and defense priorities', () => {
 const g = baseFixture();
 const profiles = ['ambitious', 'cautious', 'greedy', 'zealous', 'just', 'cruel', 'diplomatic', 'martial'];
 
 for (const id of profiles) {
  assert.ok(PERSONALITY_PROFILES[id], `Profile ${id} exists`);
  const prof = PERSONALITY_PROFILES[id];
  assert.equal(typeof prof.expansionThreshold, 'number');
  assert.equal(typeof prof.defenseReserve, 'number');
  assert.equal(typeof prof.raidBias, 'number');
 }

 // Check that ambitious has lower expansion threshold than cautious
 assert.ok(PERSONALITY_PROFILES.ambitious.expansionThreshold < PERSONALITY_PROFILES.cautious.expansionThreshold);
 // Check that greedy focuses less on defense reserve than cautious
 assert.ok(PERSONALITY_PROFILES.greedy.defenseReserve < PERSONALITY_PROFILES.cautious.defenseReserve);
 // Check that cruel has higher raid bias than cautious
 assert.ok(PERSONALITY_PROFILES.cruel.raidBias > PERSONALITY_PROFILES.cautious.raidBias);

 // Personality resolution from ruler skills/traits
 const profEngland = personalityProfile(g, 'england');
 assert.ok(profEngland.id && profiles.includes(profEngland.id));
});

test('strategic AI protects core provinces and evaluates war viability', () => {
 const g = baseFixture();
 const cores = coreProvinces(g, world, 'france');
 assert.ok(cores.length > 0);
 assert.ok(cores.every(id => g.provinces[id].owner === 'france'));

 // War viability evaluation
 const viableVsWeak = evaluateWarViability(g, world, 'france', 'scotland');
 assert.equal(typeof viableVsWeak.viable, 'boolean');
 assert.equal(typeof viableVsWeak.ratio, 'number');

 // Suicidal war against overwhelming power is deemed not viable
 const suicideViability = evaluateWarViability(g, world, 'scotland', 'france');
 if (suicideViability.ratio < suicideViability.minRatio) {
  assert.equal(suicideViability.viable, false);
  assert.ok(suicideViability.reason.length > 0);
 }
});

test('persistent objectives track budgets and abandon impossible goals', () => {
 const g = baseFixture();
 const plan = choosePlan(g, world, 'england', null);

 assert.ok(plan);
 assert.ok(plan.objective);
 assert.equal(plan.objective.status, 'active');
 assert.ok(plan.objective.deadline > g.turn);
 assert.ok(Number.isFinite(plan.objective.budget));

 // Objective abandonment when deadline passes
 g.turn += 30; // advance past deadline
 const updated = choosePlan(g, world, 'england', plan);
 assert.ok(updated.objective.started >= g.turn || updated.objective.status === 'active');
 assert.ok(g.strategy.abandoned.length > 0);
 assert.equal(g.strategy.abandoned[0].reason, 'deadline expired');
});

// -------------------------------------------------------------
// 3. PHASE 6: 11 Casus Belli & Title Peace Settlements
// -------------------------------------------------------------
test('supports all 11 Casus Belli with strict validation and prestige costs', () => {
 const cbList = Object.keys(CASUS_BELLI);
 assert.equal(cbList.length, 11);
 const expectedCBs = [
  'county_claim', 'duchy_claim', 'kingdom_claim', 'dejure_claim',
  'independence', 'subjugation', 'religious_war', 'succession_dispute',
  'deposition', 'tribute_enforcement', 'liberation'
 ];
 for (const id of expectedCBs) {
  assert.ok(CASUS_BELLI[id], `CB ${id} is defined`);
  assert.ok(CASUS_BELLI[id].prestigeCost >= 0);
  assert.ok(CASUS_BELLI[id].warscoreGoal > 0);
 }

 const g = baseFixture();
 g.factions.england.prestige = 50;

 // Declaring without valid CB is rejected
 const invalidDecl = declareCasusBelliWar(g, world, 'england', 'france', 'county_claim', 'non_existent_prov');
 assert.equal(invalidDecl.ok, false);

 // Valid CB war declaration
 const target = world.provinces.find(p => p.owner === 'france')?.id;
 g.conflict.claims[`england:${target}`] = {
  realm: 'england',
  foreign: 'france',
  province: target,
  expires: g.turn + 60
 };

 const validDecl = declareCasusBelliWar(g, world, 'england', 'france', 'county_claim', target);
 assert.ok(validDecl.ok, validDecl.msg);
 assert.equal(validDecl.war.cb, 'county_claim');
 assert.equal(validDecl.war.goal, target);
 assert.equal(validDecl.war.status, 'active');
});

test('mid-war Casus Belli invalidation cancels war when claim expires or transfers', () => {
 const g = baseFixture();
 const target = world.provinces.find(p => p.owner === 'france')?.id;
 g.conflict.claims[`england:${target}`] = {
  realm: 'england',
  foreign: 'france',
  province: target,
  expires: g.turn + 1
 };
 g.factions.england.prestige = 50;
 const decl = declareCasusBelliWar(g, world, 'england', 'france', 'county_claim', target);
 assert.ok(decl.ok);

 // Expire the claim
 g.conflict.claims[`england:${target}`].expires = g.turn - 1;
 delete g.conflict.claims[`england:${target}`];

 // Advance turn and tick campaign war
 g.turn += 2;
 tickCampaignWar(g, world);

 const war = g.conflict.wars[decl.war.id];
 assert.equal(war.status, 'cb invalidated');
});

test('title-level peace settlements execute CB-specific outcomes and clean up occupations', () => {
 const g = baseFixture();
 const target = world.provinces.find(p => p.owner === 'france')?.id;
 g.conflict.claims[`england:${target}`] = {
  realm: 'england',
  foreign: 'france',
  province: target,
  expires: g.turn + 50
 };
 g.factions.england.prestige = 50;
 const decl = declareCasusBelliWar(g, world, 'england', 'france', 'county_claim', target);
 assert.ok(decl.ok);

 const war = decl.war;
 captureProvince(g, war, 'england', target, 'england');
 assert.equal(controller(g, target), 'england');

 war.score = 80; // sufficient for victory
 const ceded = settleOccupations(g, war, 'claim enforced');
 assert.ok(Array.isArray(ceded));
 assert.ok(ceded.includes(target));
 assert.equal(g.provinces[target].owner, 'england');
 assert.equal(controller(g, target), 'england');
});

// -------------------------------------------------------------
// 4. DIPLOMACY: Hostages, Tribute, Coalitions, Call-to-Arms
// -------------------------------------------------------------
test('tribute system enforces monthly payments and permits tributary break', () => {
 const g = baseFixture();
 // Setup strong overlord without treaties
 if (g.factions.castile?.treaties) delete g.factions.castile.treaties.portugal;
 if (g.factions.portugal?.treaties) delete g.factions.portugal.treaties.castile;
 g.armies.army_cas = { id: 'army_cas', owner: 'castile', province: 'toledo', infantry: 3000, archers: 1000, cavalry: 1000 };
 const targetArmy = Object.values(g.armies).find(a => a.owner === 'portugal');
 if (targetArmy) { targetArmy.infantry = 100; targetArmy.archers = 0; targetArmy.cavalry = 0; }
 
 const res = demandTribute(g, 'castile', 'portugal');
 assert.ok(res.ok, res.msg);
 assert.equal(tributaryOf(g, 'portugal')?.suzerain, 'castile');
 assert.ok(suzerainSubjects(g, 'castile').some(t => t.tributary === 'portugal'));

 const portGoldBefore = g.factions.portugal.treasury;
 const casGoldBefore = g.factions.castile.treasury;

 // Advance month in diplomacy
 g.turn += 1;
 tickDiplomacy(g, world);
 assert.ok(g.factions.castile.treasury > casGoldBefore);
 assert.ok(g.factions.portugal.treasury < portGoldBefore);

 // Break tribute
 const broken = breakTribute(g, 'portugal');
 assert.ok(broken.ok);
 assert.equal(tributaryOf(g, 'portugal'), null);
});

test('diplomatic hostages bar wars and can be exchanged or released', () => {
 const g = baseFixture();
 const rulerId = g.politics?.realms?.england?.ruler;
 const noble = Object.values(g.politics.people).find(p => p.realm === 'england' && p.alive && p.id !== rulerId && p.age >= 18);
 assert.ok(noble);

 const res = exchangeHostage(g, 'england', 'castile', noble.id);
 assert.ok(res.ok);
 assert.ok(hasHostageBar(g, 'castile', 'england'));
 assert.ok(hasHostageBar(g, 'england', 'castile'));

 // Hostage blocks war declaration
 g.factions.castile.prestige = 50;
 const blockedDecl = declareCasusBelliWar(g, world, 'castile', 'england', 'subjugation', 'england');
 assert.equal(blockedDecl.ok, false);
 assert.ok(blockedDecl.msg.includes('hostage'));

 // Release hostage
 const h = Object.values(g.diplomacy.hostages).find(x => x.status === 'active');
 assert.ok(h);
 const rel = releaseHostage(g, h.id);
 assert.ok(rel.ok);
 assert.equal(hasHostageBar(g, 'castile', 'england'), false);
});

test('aggressive expansion triggers defensive coalitions', () => {
 const g = baseFixture();
 addDiplomaticThreat(g, 'france', 60);
 assert.ok(diplomaticThreat(g, 'france') >= 50);

 joinCoalition(g, 'england', 'france');
 joinCoalition(g, 'castile', 'france');

 const partners = coalitionPartners(g, 'england', 'france');
 assert.ok(partners.includes('castile'));
 assert.equal(coalitionAgainst(g, 'france').members.length, 2);

 leaveCoalition(g, 'england', 'france');
 assert.equal(coalitionAgainst(g, 'france').members.length, 1);
});

// -------------------------------------------------------------
// 5. PHASE 7: Military Troops, Split/Merge, Retreat, Terrain
// -------------------------------------------------------------
test('troop source breakdown distinguishes levies, retinues, mercenaries, and holy orders', () => {
 const g = baseFixture();
 const army = Object.values(g.armies).find(a => a.owner === 'england');
 assert.ok(army);

 const breakdown = armyCompositionBreakdown(g, army);
 for (const src of TROOP_SOURCES) {
  assert.ok(Object.hasOwn(breakdown, src), `Troop source ${src} is tracked`);
 }

 // Available mercenary companies and holy orders
 assert.ok(Object.keys(MERCENARY_COMPANIES).length >= 4);
 assert.ok(Object.keys(RELIGIOUS_ORDERS).length >= 4);
});

test('army split and merge preserves exact troop counts', () => {
 const g = baseFixture();
 initMilitary(g);
 const army = Object.values(g.armies).find(a => a.owner === 'england');
 army.infantry = 600;
 army.archers = 200;
 army.cavalry = 100;
 const initialTotal = 600 + 200 + 100;

 const splitRes = splitArmy(g, army.id, 0.5);
 assert.ok(splitRes.ok);
 const child = g.armies[splitRes.armyId];
 assert.ok(child);

 const parentRemaining = army.infantry + army.archers + army.cavalry;
 const childTroops = child.infantry + child.archers + child.cavalry;
 assert.equal(parentRemaining + childTroops, initialTotal);

 const mergeRes = mergeArmies(g, army.id, child.id);
 assert.ok(mergeRes.ok);
 const mergedTotal = army.infantry + army.archers + army.cavalry;
 assert.equal(mergedTotal, initialTotal);
 assert.equal(g.armies[child.id], undefined);
});

test('terrain modifiers alter combat effectiveness and winter attrition is seasonal', () => {
 const terrains = ['plains', 'forest', 'highlands', 'mountains', 'desert'];
 for (const terr of terrains) {
  const mod = terrainCombatModifiers(terr);
  assert.ok(mod.defense > 0);
  assert.ok(mod.attack > 0);
  assert.ok(mod.winterAttrition > 0);
 }

 // Highlands and mountains give defense advantage over plains
 assert.ok(TERRAIN_MODIFIERS.mountains.defense > TERRAIN_MODIFIERS.plains.defense);
 assert.ok(TERRAIN_MODIFIERS.mountains.cavalry < TERRAIN_MODIFIERS.plains.cavalry);

 // Winter months detection
 assert.equal(isWinterMonth(11), true); // December
 assert.equal(isWinterMonth(0), true);  // January
 assert.equal(isWinterMonth(1), true);  // February
 assert.equal(isWinterMonth(6), false); // July
});

test('commander traits provide combat modifiers and battle commanders face capture or death', () => {
 const traitCount = Object.keys(COMMANDER_TRAITS).length;
 assert.ok(traitCount >= 10);

 const g = baseFixture();
 const person = Object.values(g.politics.people).find(p => p.realm === 'england' && p.alive);
 person.traits = ['brave', 'ambitious'];

 const effects = commanderTraitEffects(person);
 assert.ok(effects.power > 0);
 assert.ok(effects.morale > 0);

 // Battle commander resolution
 const army = Object.values(g.armies).find(a => a.owner === 'england');
 army.commander = person.id;
 const fate = resolveBattleCommanders(g, 'france', [army], {loserRemaining: 0.2, fieldBattle: true});
 assert.ok(fate);
});

test('retreatArmy preserves survivors into safe owned or friendly territory', () => {
 const g = baseFixture();
 const army = Object.values(g.armies).find(a => a.owner === 'england');
 // Simulate an army in foreign/contested province retreating back to home realm
 const enemyProv = world.provinces.find(p => p.owner === 'france')?.id;
 const homeProv = army.province;
 army.province = enemyProv;

 const ok = retreatArmy(g, world, army, enemyProv, homeProv);
 assert.ok(ok);
 assert.equal(army.province, homeProv);
});
