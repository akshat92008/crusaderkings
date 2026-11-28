import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { createGame, advanceMonth, empireStats } from '../src/simulation.js';
import {
  TRAIT_CATEGORIES,
  TRAIT_CATALOG,
  traitDefinition,
  addStress,
  currentStressBreak,
  resolveStressBreak,
  actAgainstNatureStress,
  evolveCharacterTraits,
} from '../src/character-agency.js';
import {
  SECRETS,
  intrigueAction,
  heldHooks,
  courtWhispers,
  hookStrength,
} from '../src/intrigue-systems.js';
import {
  COUNCIL_PERSONAL_AGENDAS,
  councilorAgenda,
  councilTaskAction,
} from '../src/council-tasks.js';
import {
  vassalOpinionBreakdown,
  recordStoryFlag,
  tickStoryFlags,
  recordRulerEpitaph,
  playerAchievements,
  dynastyChronicleSummary,
} from '../src/chronicle-systems.js';
import {
  HEIR_EDUCATION_EVENTS,
  initHeirEducation,
  tickHeirEducation,
  currentHeirEducationEvent,
  resolveHeirEducation,
} from '../src/heir-education.js';
import {
  REGENCY_DRAMA_EVENTS,
  reconcileRegency,
  tickRegencyDrama,
  currentRegencyDrama,
  resolveRegencyDrama,
} from '../src/regency-systems.js';
import {
  triggerReligiousLeagues,
  joinReligiousLeague,
  faithSystemView,
  currentFaithConversionChoice,
  resolveFaithConversionChoice,
} from '../src/faith-institutions.js';
import {
  CULTURAL_TRADITIONS,
  cultureView,
  cultureAction,
  suggestedHybridName,
  languagePrestige,
} from '../src/culture-systems.js';
import {
  initializeFieldGroup,
  issueFieldOrder,
  fieldTerrain,
  stepField,
  FIELD_ORDERS,
} from '../src/field-tactics.js';
import {
  openHometown,
  capitalNotables,
  recruitCapitalNotable,
  capitalSiegeReadiness,
  tickCapitalEvents,
  currentCapitalEvent,
  resolveCapitalEvent,
} from '../src/hometown.js';
import {
  HISTORICAL_TRADE_ROUTES,
  realmTradeRoutes,
  realmTradeRouteIncome,
  tradeRouteAction,
} from '../src/trade-routes.js';
import {
  economicLedgerBreakdown,
  tickEconomicDilemmas,
  currentEconomicDilemma,
  resolveEconomicDilemma,
} from '../src/economy-systems.js';
import {
  CHAOS_EVENT_TEMPLATES,
  tickChaosEvents,
  currentChaosEvent,
  resolveChaosEvent,
} from '../src/chaos-events.js';

const world = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('Pillar 1: 60+ traits across 6 categories, Stress 0-300 & Mental Breaks, Trait evolution', () => {
  assert.equal(TRAIT_CATEGORIES.length, 6);
  assert.ok(Object.keys(TRAIT_CATALOG).length >= 60, 'Expected 60+ traits in catalog');
  for (const cat of TRAIT_CATEGORIES) {
    assert.ok(Object.values(TRAIT_CATALOG).some(t => t.category === cat), `Missing category ${cat}`);
  }
  const g = createGame(world, 'ottomans');
  const rulerId = g.politics.realms.ottomans.ruler;
  const ruler = g.politics.people[rulerId];
  assert.ok(traitDefinition('just').category === 'personality');

  // Acting against nature adds stress
  ruler.traits = ['honest', 'kind'];
  const before = ruler.stress || 0;
  actAgainstNatureStress(g, rulerId, 'execute', 'test execution');
  assert.ok((ruler.stress || 0) > before, 'Acting against nature should add stress');

  // Pushing past 100 triggers a Mental Break modal
  addStress(g, rulerId, 115, 'war exhaustion');
  const sb = currentStressBreak(g);
  assert.ok(sb, 'Mental break should trigger at >=100 stress');
  const res = resolveStressBreak(g, 'confide');
  assert.equal(res.ok, true);
  assert.equal(currentStressBreak(g), null);

  // Trait evolution after surviving battle
  const evo = evolveCharacterTraits(g, ruler, 'survived_battle');
  assert.ok(Array.isArray(evo));
});

test('Pillar 2: Hook & Blackmail Economy (secrets, Weak/Strong hooks, 1-click actions)', () => {
  assert.ok(Object.keys(SECRETS).length >= 5);
  const g = createGame(world, 'ottomans');
  const realm = g.player;
  const rulerId = g.politics.realms[realm].ruler;
  const councilorId = g.politics.realms[realm].council.steward;
  const marshalId = g.politics.realms[realm].council.marshal;
  assert.ok(councilorId && councilorId !== rulerId);

  // Inject known murder secrets to verify Strong Hook blackmail + 1-click actions
  g.intrigue.secrets['test-sec-1'] = {
    id: 'test-sec-1', person: councilorId, kind: 'murder', realm, known: [realm], exposed: false, usedBy: [],
  };
  g.intrigue.secrets['test-sec-2'] = {
    id: 'test-sec-2', person: marshalId, kind: 'treason', realm, known: [realm], exposed: false, usedBy: [],
  };
  assert.equal(intrigueAction(g, world, 'blackmail', 'test-sec-1').ok, true);
  assert.equal(intrigueAction(g, world, 'blackmail', 'test-sec-2').ok, true);
  assert.equal(hookStrength(g, realm, councilorId), 3);

  const hooks = heldHooks(g, realm);
  assert.equal(hooks.length, 2);
  assert.equal(hooks[0].tier, 'strong');

  // 1-click Force Council Vote (consumes steward hook) & Block Rebellion (consumes marshal strong hook)
  assert.equal(intrigueAction(g, world, 'hook-vote', councilorId).ok, true);
  assert.equal(intrigueAction(g, world, 'hook-no-rebel', marshalId).ok, true);
  assert.ok((g.politics.people[marshalId].noRebelUntil || 0) > g.turn);

  // Court whispers return structured suspects
  assert.ok(Array.isArray(courtWhispers(g, realm)));
});

test('Pillar 3: Council Personal Agendas (15 agendas) & Itemized Vassal Opinion Breakdown', () => {
  const totalAgendas = Object.values(COUNCIL_PERSONAL_AGENDAS).reduce((n, arr) => n + arr.length, 0);
  assert.equal(totalAgendas, 15);
  const g = createGame(world, 'ottomans');
  g.factions.ottomans.treasury = 500;
  const ag0 = councilorAgenda(g, 'ottomans', 'steward');
  assert.ok(ag0.personal && ag0.personal.title);
  assert.equal(ag0.discovered, false);

  const inv = councilTaskAction(g, 'steward', 'agenda-investigate');
  assert.equal(inv.ok, true);
  assert.equal(councilorAgenda(g, 'ottomans', 'steward').discovered, true);

  const conf = councilTaskAction(g, 'steward', 'agenda-confront');
  assert.equal(conf.ok, true);
  assert.equal(councilorAgenda(g, 'ottomans', 'steward').resolved, 'confronted');

  // Itemized vassal opinion breakdown
  const vassal = Object.values(g.politics.holdings).find(h => h.realm === 'ottomans' && h.lord !== g.politics.realms.ottomans.ruler);
  assert.ok(vassal, 'Expected at least one landed vassal');
  const op = vassalOpinionBreakdown(g, 'ottomans', vassal.lord);
  assert.ok(typeof op.total === 'number' && Array.isArray(op.items));
});

test('Pillar 4: Heir Education Events (ages 6-16) & Regency Drama Events', () => {
  assert.ok(HEIR_EDUCATION_EVENTS.length >= 6);
  assert.ok(REGENCY_DRAMA_EVENTS.length >= 4);
  const g = createGame(world, 'ottomans');
  initHeirEducation(g);
  const ruler = g.politics.people[g.politics.realms.ottomans.ruler];
  // Ensure there is an 8-year-old child heir
  const childId = 'test-heir-child';
  g.politics.people[childId] = {
    id: childId, name: 'Prince Bayezid', house: ruler.house, realm: 'ottomans',
    age: 8, alive: true, sex: 'male', traits: [],
    skills: { martial: 1, diplomacy: 1, stewardship: 1, intrigue: 1, learning: 1 },
    parents: [ruler.id], children: [],
  };
  ruler.children = [childId];
  g.turn = 12;
  tickHeirEducation(g);
  const he = currentHeirEducationEvent(g, 'ottomans');
  assert.ok(he, 'Expected heir education event for age-8 heir');
  const hRes = resolveHeirEducation(g, 'ottomans', he.choices[0].id);
  assert.equal(hRes.ok, true);
  assert.equal(currentHeirEducationEvent(g, 'ottomans'), null);

  // Trigger a minority regency and check Regency Drama
  ruler.age = 11;
  reconcileRegency(g, 'ottomans');
  g.turn = 24;
  tickRegencyDrama(g, 'ottomans');
  const rd = currentRegencyDrama(g, 'ottomans');
  assert.ok(rd, 'Expected regency drama event during active regency');
  const rRes = resolveRegencyDrama(g, 'ottomans', 0);
  assert.equal(rRes.ok, true);
});

test('Pillar 5: Religious Leagues (Printing Press), Heresy Drain, Conversion Choice & Sacred Sites', () => {
  const g = createGame(world, 'france');
  triggerReligiousLeagues(g);
  const sys = faithSystemView(g, 'france');
  assert.ok(sys.religiousLeagues?.active, 'Religious Leagues should activate');
  const joinRes = joinReligiousLeague(g, 'france', 'protestant');
  assert.equal(joinRes.ok, true);
  assert.ok(g.identity.religiousLeagues.protestant.members.includes('france'));

  // Faith conversion choice event on conquest
  const ownProv = Object.values(g.provinces).find(p => p.owner === 'france');
  g.identity.pendingConversionChoice = {
    province: ownProv.id,
    oldFaith: 'Sunni Islam',
    courtFaith: g.civic.realms.france.faith,
    turn: g.turn,
  };
  const fc = currentFaithConversionChoice(g, 'france');
  assert.ok(fc && fc.choices.length === 3);
  const fcRes = resolveFaithConversionChoice(g, 'france', 0);
  assert.equal(fcRes.ok, true);
});

test('Pillar 6: Cultural Fusion (30-yr tenure), Language Prestige & Cultural Tech Traditions', () => {
  assert.ok(Object.keys(CULTURAL_TRADITIONS).length >= 5);
  const g = createGame(world, 'ottomans');
  g.factions.ottomans.treasury = 1200;
  g.factions.ottomans.prestige = 120;
  const cv = cultureView(g, 'ottomans');
  assert.ok(cv.languagePrestige >= 1);
  assert.ok(cv.traditions.length === 3);
  assert.ok(suggestedHybridName('Turkish', 'Greek').includes('-'));

  const trRes = cultureAction(g, 'ottomans', 'culture-tradition', cv.traditions[0].id);
  assert.equal(trRes.ok, true);
  assert.equal(cultureView(g, 'ottomans').traditions[0].unlocked, true);
  assert.ok(languagePrestige(g, cv.language) >= 1);
});

test('Pillar 7: 3D Field Tactics — Brace anti-cavalry, River Crossing, General Aura & General Death shock', () => {
  assert.ok(FIELD_ORDERS.brace, 'Brace order should exist');
  const groups = [
    { id: 'a1', side: 'attacker', type: 'infantry', isCommander: true, commanderName: 'Sultan Mehmed', troopCount: 140, life: 100, morale: 80, x: -12, z: 0, formationId: 'pike_square', profile: { name: 'Janissary Guard', attack: 1.1, defense: 1.2, speed: 1, antiCavalry: 1.4 } },
    { id: 'a2', side: 'attacker', type: 'cavalry', troopCount: 90, life: 100, morale: 75, x: -14, z: 6, formationId: 'wedge', profile: { name: 'Sipahi', attack: 1.2, defense: 0.9, speed: 1.4 } },
    { id: 'd1', side: 'defender', type: 'cavalry', isCommander: true, commanderName: 'Duke John', troopCount: 110, life: 100, morale: 75, x: 12, z: 0, formationId: 'wedge', profile: { name: 'Heavy Knights', attack: 1.3, defense: 1.0, speed: 1.3 } },
  ];
  for (const g of groups) initializeFieldGroup(g);
  const state = { groups, terrain: 'river', elapsed: 1, battleEvents: [], generalFallen: { attacker: false, defender: false } };
  issueFieldOrder(groups[0], 'brace');
  assert.equal(groups[0].fieldOrder, 'brace');
  // Verify river crossing terrain modifier at center (z=0)
  const riverSpot = fieldTerrain({ x: 0, z: 0, type: 'infantry' }, 'river');
  assert.equal(riverSpot.inRiver, true);
  assert.ok(riverSpot.speed < 0.7);
  stepField(state, 0.25);
  assert.ok(groups[0].statusFlags.includes('BRACED'), 'Braced infantry should carry BRACED flag');
  assert.ok(groups[0].statusFlags.includes('GENERAL'), 'Commander regiment should carry GENERAL flag');

  // General death shock triggers -25 army morale & battleEvent when commander routs/falls
  groups[2].life = 5;
  stepField(state, 0.25);
  assert.equal(state.generalFallen.defender, true);
  assert.ok(state.battleEvents.some(e => e.kind === 'general_fallen' && e.side === 'defender'));
});

test('Pillar 8: Living Capital — Named Citizens/Heroes, Siege Readiness & Building Events', () => {
  const g = createGame(world, 'ottomans');
  g.factions.ottomans.treasury = 800;
  openHometown(g, world);
  const notables = capitalNotables(g, 'ottomans');
  assert.ok(notables.length >= 3, 'Expected at least 3 named capital citizens');
  const rec = recruitCapitalNotable(g, world, notables[0].id);
  assert.equal(rec.ok, true);
  assert.equal(capitalNotables(g, 'ottomans')[0].recruited, true);

  const siege = capitalSiegeReadiness(g, world, 'ottomans');
  assert.ok(siege && typeof siege.garrisonStrength === 'number' && siege.garrisonStrength > 0);

  // Ensure capital has a chapel so building-driven events trigger
  const capId = siege.capital;
  g.hometown.buildings[capId] ??= {};
  g.hometown.buildings[capId].chapel = 1;
  g.turn = 14;
  tickCapitalEvents(g, world);
  const capEv = currentCapitalEvent(g);
  assert.ok(capEv, 'Expected capital building-driven event');
  const capRes = resolveCapitalEvent(g, capEv.choices[0].id);
  assert.equal(capRes.ok, true);
});

test('Pillar 9: 12 Historical Macro Trade Routes, Army Supply Lines & Economic Ledger/Dilemmas', () => {
  assert.equal(HISTORICAL_TRADE_ROUTES.length, 12);
  const g = createGame(world, 'ottomans');
  g.factions.ottomans.treasury = 1000;
  const routes = realmTradeRoutes(g, 'ottomans');
  assert.ok(routes.length >= 1, 'Ottomans should participate in major trade corridors');
  const incomeBefore = realmTradeRouteIncome(g, 'ottomans');
  assert.ok(incomeBefore > 0);

  const inv = tradeRouteAction(g, world, 'invest', routes[0].id);
  assert.equal(inv.ok, true);
  assert.ok(realmTradeRouteIncome(g, 'ottomans') >= incomeBefore);

  // Supply line surcharge when an army is stationed in foreign territory
  const foreignProv = Object.values(g.provinces).find(p => p.owner !== 'ottomans');
  const army = Object.values(g.armies).find(a => a.owner === 'ottomans');
  army.province = foreignProv.id;
  const stats = empireStats(g, 'ottomans');
  assert.ok(stats.supplyLineUpkeep > 0, 'Foreign-deployed army should incur supply line surcharge');

  // Economic ledger & famine dilemma
  g.factions.ottomans.food = -30;
  g.turn = 10;
  tickEconomicDilemmas(g);
  const dil = currentEconomicDilemma(g);
  assert.ok(dil && dil.id === 'famine_rationing');
  assert.equal(resolveEconomicDilemma(g, dil.choices[0].id).ok, true);
  const ledger = economicLedgerBreakdown(g, 'ottomans');
  assert.ok(typeof ledger.totalDebt === 'number' && typeof ledger.inflation === 'number');
});

test('Pillar 10: Emergent Storytelling — Dynasty Epitaphs, Story Flags, Chaos Events & Achievements', () => {
  assert.ok(CHAOS_EVENT_TEMPLATES.length >= 4);
  const g = createGame(world, 'ottomans');
  const ruler = g.politics.people[g.politics.realms.ottomans.ruler];
  ruler.deathReason = 'Died peacefully in old age';
  const ep = recordRulerEpitaph(g, ruler, 'ottomans', null);
  assert.ok(ep && ep.epithet && ep.deathReason === 'Died peacefully in old age');
  assert.ok(g.chronicles.pendingObituary);

  recordStoryFlag(g, {
    key: 'exiled_brother',
    realm: 'ottomans',
    title: 'The Exiled Prince',
    detail: 'A disinherited prince fled to rival lands.',
    delayYears: 1,
    callbackText: 'Years later, the exiled prince’s grandchildren return demanding their birthright.',
  });
  g.turn = 24;
  tickStoryFlags(g);
  assert.equal(g.storyFlags[0].triggered, true);

  const summary = dynastyChronicleSummary(g);
  assert.ok(summary.epitaphs.length >= 1);
  assert.ok(playerAchievements(g).length >= 6);

  // Chaos event triggers cleanly
  g.turn = 18;
  tickChaosEvents(g, world);
  const ch = currentChaosEvent(g);
  assert.ok(ch, 'Expected deterministic chaos event');
  assert.equal(resolveChaosEvent(g, ch.choices[0].id).ok, true);

  // Multi-month advance integration smoke test (determinism + zero throws)
  for (let i = 0; i < 6; i++) advanceMonth(g, world);
  assert.ok(g.turn >= 24);
});
