import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld, capitalDistrict} from '../src/historical-world.js';
import {populateGlobalKingdoms} from '../src/world-kingdoms-1450.js';
import {createGame, advanceMonth, empireStats, concludeBattle} from '../src/simulation.js';
import {verifyWorldStateIntegrity, repairWorldStateIntegrity} from '../src/world-integrity.js';
import {addStress, currentStressBreak, resolveStressBreak, characterAgeStage} from '../src/character-agency.js';
import {currentPartitionEvent, resolvePartitionEvent, currentSuccessionWarEvent, resolveSuccessionWarEvent, removePoliticalCharacter} from '../src/dynastic-politics.js';
import {openHometown, capitalSiegeReadiness, applyCapitalSiegeDamage, repairCapitalBuilding, homeRealm, capitalNotables} from '../src/hometown.js';
import {ambientTown} from '../src/hometown-scene.js';
import {economicForecast} from '../src/economy-systems.js';
import {dynastyChronicleSummary} from '../src/chronicle-systems.js';

const legacyWorld = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
const histRef = JSON.parse(fs.readFileSync(new URL('../data/historical-polities-1450.json', import.meta.url), 'utf8'));
const world = populateGlobalKingdoms(densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(legacyWorld, histRef))));

test('Phase 2: WorldState integrity verifier detects and repairs corrupted campaign state', () => {
  const g = createGame(world, 'ottomans');
  const clean = verifyWorldStateIntegrity(g, world);
  assert.equal(clean.ok, true, `Fresh game should be clean: ${clean.issues.join('; ')}`);

  // Inject corruptions
  g.factions.ottomans.treasury = Number.NaN;
  const firstArmy = Object.values(g.armies)[0];
  firstArmy.infantry = -50;
  const firstProv = Object.values(g.provinces)[0];
  firstProv.owner = 'ghost_realm';

  const broken = verifyWorldStateIntegrity(g, world);
  assert.equal(broken.ok, false);
  assert.ok(broken.issues.length >= 3);

  const rep = repairWorldStateIntegrity(g, world);
  assert.ok(rep.fixed >= 3, `Expected >= 3 fixes, got ${rep.fixed}`);
  assert.equal(rep.audit.ok, true, `Repaired game should pass: ${rep.audit.issues.join('; ')}`);
  assert.equal(Number.isFinite(g.factions.ottomans.treasury), true);
  assert.ok(firstArmy.infantry >= 0);
});

test('Pillar 1: characterAgeStage & Tier-3 Stress Crisis multi-step Redemption vs. Spiral chain', () => {
  assert.equal(characterAgeStage(12).stage, 'youth');
  assert.equal(characterAgeStage(26).stage, 'prime');
  assert.equal(characterAgeStage(48).stage, 'mature');
  assert.equal(characterAgeStage(67).stage, 'elder');

  const g = createGame(world, 'france');
  const rulerId = g.politics.realms.france.ruler;
  const ruler = g.politics.people[rulerId];
  ruler.stress = 0;

  // Push straight into Tier-3 Stress Crisis (>= 150)
  const triggered = addStress(g, rulerId, 165, 'crushing burden of war');
  assert.equal(triggered?.breakTriggered, 'crisis');
  const stage1 = currentStressBreak(g);
  assert.ok(stage1);
  assert.equal(stage1.tier, 'crisis');
  assert.equal(stage1.stage, 1);
  assert.ok(Array.isArray(stage1.choices) && stage1.choices.length >= 2);

  // Choose Stage 1 Redemption path -> should open Stage 2 Redemption Arc
  const r1 = resolveStressBreak(g, 'crisis_seek_redemption');
  assert.equal(r1.ok, true);
  const stage2 = currentStressBreak(g);
  assert.ok(stage2, 'Stage 2 of Tier-3 Stress Crisis should follow immediately');
  assert.equal(stage2.stage, 2);
  assert.equal(stage2.arc, 'redemption');

  const r2 = resolveStressBreak(g, 'redemption_embrace');
  assert.equal(r2.ok, true);
  assert.equal(currentStressBreak(g), null, 'Crisis should clear after Stage 2');
  assert.ok(ruler.stress < 150, 'Stress should drop after resolving crisis');
});

test('Pillar 4: Dedicated Realm Partition modal & 2-stage Foreign-Backed Contested Succession War chain', () => {
  const g = createGame(world, 'ottomans');
  const s = g.politics.realms.ottomans;
  s.law = 'partition';
  const r = g.politics.people[s.ruler];

  // Ensure ruler directly holds >= 3 domains so Partition splits holdings across heirs
  const ownHoldings = Object.values(g.politics.holdings).filter(h => h.realm === 'ottomans');
  for (const h of ownHoldings.slice(0, 3)) h.lord = r.id;

  const c1 = 'test_heir_1', c2 = 'test_heir_2';
  g.politics.people[c1] = {
    id: c1, name: 'Prince Orhan', house: r.house, realm: 'ottomans', age: 24, alive: true, sex: 'M',
    skills: {martial: 4, diplomacy: 3, stewardship: 3, intrigue: 2, learning: 2},
    traits: ['brave'], parents: [r.id], children: [], spouses: [], concubines: [], spouse: null,
    wealth: 80, prestige: 50, piety: 20, stress: 10
  };
  g.politics.people[c2] = {
    id: c2, name: 'Prince Cem', house: r.house, realm: 'ottomans', age: 21, alive: true, sex: 'M',
    skills: {martial: 4, diplomacy: 3, stewardship: 2, intrigue: 4, learning: 2},
    traits: ['ambitious'], parents: [r.id], children: [], spouses: [], concubines: [], spouse: null,
    wealth: 80, prestige: 50, piety: 20, stress: 10
  };
  r.children = [c1, c2];
  g.factions.ottomans.legitimacy = 42;

  removePoliticalCharacter(g, world, r.id);

  const partEvt = currentPartitionEvent(g);
  assert.ok(partEvt, 'Partition succession should queue a dedicated Realm Partition event');
  assert.ok(partEvt.choices.length >= 2);
  const pRes = resolvePartitionEvent(g, 'honor_partition');
  assert.equal(pRes.ok, true);
  assert.equal(currentPartitionEvent(g), null);

  const warStage1 = currentSuccessionWarEvent(g);
  assert.ok(warStage1, 'Low-legitimacy rival heir should trigger 2-stage Contested Succession War chain');
  assert.equal(warStage1.stage, 1);
  assert.ok(warStage1.foreignBacker, 'Claimant should be backed by a foreign rival court');

  const w1 = resolveSuccessionWarEvent(g, world, 'confront_foreign');
  assert.equal(w1.ok, true);
  const warStage2 = currentSuccessionWarEvent(g);
  assert.ok(warStage2, 'Defying Stage 1 should advance to Stage 2 Civil War / Deterrence');
  assert.equal(warStage2.stage, 2);

  const w2 = resolveSuccessionWarEvent(g, world, 'crush_claimant');
  assert.equal(w2.ok, true);
  assert.equal(currentSuccessionWarEvent(g), null);
});

test('Pillar 7 & 8: Persistent 2D<->3D capital siege damage, Repair action, Citizen defense & Living Settlement ambient states', () => {
  const g = createGame(world, 'vijayanagara');
  const openRes = openHometown(g, world);
  assert.equal(openRes.ok, true);
  const cap = capitalDistrict(world, 'vijayanagara', g.provinces).id;
  const before = capitalSiegeReadiness(g, world, 'vijayanagara');
  assert.equal(before.damagedCount, 0);

  // Simulate a capital battle loss with siege impact
  const dmg = applyCapitalSiegeDamage(g, world, cap, {victory: false, attackerRemaining: 0.25, seconds: 42});
  assert.equal(dmg.ok, true);
  assert.ok(dmg.damaged.length >= 1, 'Siege defeat should damage at least one capital building');

  const afterDmg = capitalSiegeReadiness(g, world, 'vijayanagara');
  assert.ok(afterDmg.damagedCount >= 1);
  assert.ok(afterDmg.effectiveDefenseRating <= afterDmg.wallsLevel);

  // Repair the damaged building
  const targetKey = dmg.damaged[0].key;
  g.factions.vijayanagara.treasury = 1000;
  homeRealm(g).stock.wood = 200;
  homeRealm(g).stock.stone = 200;
  const rep = repairCapitalBuilding(g, world, targetKey);
  assert.equal(rep.ok, true, rep.msg);
  assert.equal(capitalSiegeReadiness(g, world, 'vijayanagara').damagedBuildings[targetKey], undefined);

  // Verify Living Settlement ambient states emit reactive markup
  const siegeHtml = ambientTown(3, false, {besieged: true, damagedCount: 1});
  assert.ok(siegeHtml.includes('ht-ambient-siege'));
  const famineHtml = ambientTown(3, false, {famine: true});
  assert.ok(famineHtml.includes('ht-ambient-famine'));
  const prospHtml = ambientTown(4, true, {prosperous: true});
  assert.ok(prospHtml.includes('ht-ambient-prosperous'));

  // Verify Named Citizens exist in capital
  assert.ok(capitalNotables(g, 'vijayanagara').length >= 1);
});

test('Phase 9.3: Transparent Economic Forecast computes food/gold outlook and actionable diagnostics', () => {
  const g = createGame(world, 'ottomans');
  const stats = empireStats(g, 'ottomans');
  const fc = economicForecast(g, 'ottomans', stats);
  assert.equal(typeof fc.food.net, 'number');
  assert.equal(typeof fc.gold.net, 'number');
  assert.ok(Array.isArray(fc.suggestions) && fc.suggestions.length >= 1);

  // Force deficit and verify monthsUntilShortage / monthsUntilBankruptcy compute finite projections
  g.factions.ottomans.food = 100;
  g.factions.ottomans.treasury = 80;
  const deficitFc = economicForecast(g, 'ottomans', {...stats, foodDelta: -25, balance: -20});
  assert.equal(deficitFc.food.monthsUntilShortage, 4);
  assert.equal(deficitFc.gold.monthsUntilBankruptcy, 4);
  assert.ok(deficitFc.suggestions.some(s => /food|farm/i.test(s.text)));
});

test('Pillar 7 & 10: Greatest Battle tracking, Broken Regiment payload, and Year 1600 Illustrated Dynasty Chronicle summary', () => {
  const g = createGame(world, 'ottomans');
  const myArmyEntry = Object.entries(g.armies).find(([, a]) => a.owner === 'ottomans');
  assert.ok(myArmyEntry);
  const [armyId] = myArmyEntry;
  const rivalProv = world.provinces.find(p => g.provinces[p.id]?.owner && g.provinces[p.id].owner !== 'ottomans');
  assert.ok(rivalProv);

  // Battle defeat -> triggers Broken Regiment event payload + records Greatest Battle
  concludeBattle(g, {
    attacker: armyId,
    enemy: g.provinces[rivalProv.id].owner,
    to: rivalProv.id,
    defenseTroops: 140,
    defenseGarrison: 60
  }, {victory: false, attackerRemaining: 0.2, seconds: 50}, world);

  assert.ok(g.chronicles.greatestBattle, 'Greatest Battle should be recorded');
  assert.ok(g.chronicles.greatestBattle.engaged > 0);
  assert.ok(g.military.pendingBrokenRegiment, 'Severe defeat should queue Broken Regiment recovery dilemma');
  assert.equal(g.military.pendingBrokenRegiment.realm, 'ottomans');
  assert.equal(g.military.pendingBrokenRegiment.armyId, armyId);

  // Advance year to 1600 and check Dynasty Chronicle Finale Summary
  g.year = 1600;
  const summary = dynastyChronicleSummary(g);
  assert.equal(summary.campaignComplete, true);
  assert.equal(summary.yearsRuled, 150);
  assert.ok(summary.greatestBattle);
  assert.ok(summary.shareCaption.includes('1450–1600'));
});

test('Phase 11.5: Multi-month deterministic campaign stability & WorldState integrity audit', () => {
  const g = createGame(world, 'ottomans');
  for (let i = 0; i < 6; i++) {
    advanceMonth(g, world);
  }
  assert.equal(g.month, 6, '6 monthly turns should advance cleanly across seasons');
  const integrity = verifyWorldStateIntegrity(g, world);
  assert.equal(integrity.ok, true, `Campaign integrity issues: ${integrity.issues.slice(0, 5).join('; ')}`);
});
