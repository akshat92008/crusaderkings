import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PERSONALITY_AXES,
  SOCIAL_ROLES,
  deriveSocialRole,
  defaultPersonality,
  ensureCharacterSchema,
  recordGrievance,
  addRomance,
  roleSets,
  syncCharacterRelationships,
  recordLifeEvent,
  rememberBereavement,
  initAgency,
  tickAgency,
  characterLifeView
} from '../src/character-agency.js';

import {
  HEALTH_CONDITIONS,
  inflictCharacterCondition,
  recoverCharacterCondition,
  initLiving,
  tickLiving
} from '../src/living-systems.js';

import {
  FAITH_SYSTEMS,
  SACRED_SITES,
  faithTraditionSystem,
  faithCharterAction,
  faithCharterView,
  faithCharterModifiers,
  faithSystemModifiers,
  tickFaithCharter
} from '../src/faith-institutions.js';

import {
  governmentMechanics,
  governmentAction,
  institutionModifiers,
  tribalRetinue,
  tribalRaid,
  cityGuildAction
} from '../src/government-institutions.js';

import {
  regionalPoliticalAction,
  regionalPoliticalView,
  regionalPoliticalModifiers
} from '../src/regional-politics.js';

import {
  ALL_14_SCHEMES,
  PLOTS,
  initIntrigue,
  intrigueAction,
  plotOdds,
  tickIntrigue
} from '../src/intrigue-systems.js';

import {
  HOLDING_TYPES,
  HOLDING_BUILDINGS,
  provinceHoldingModifiers,
  economyModifiers,
  holdingBuildingCost,
  economyAction,
  initEconomy
} from '../src/economy-systems.js';

import {
  REGIONAL_TECHS,
  ensureProvinceTech,
  provinceTechView,
  realmTechSummary,
  identityModifiers,
  identityAction,
  tickIdentity,
  initIdentity
} from '../src/identity-systems.js';

import {
  EMERGENT_EVENTS,
  EMERGENT_DECISIONS,
  allEmergentEventCount,
  allEmergentDecisionCount,
  initEmergent,
  tickEmergent,
  currentEmergentEvent,
  emergentAction,
  emergentDecisions
} from '../src/emergent-content.js';

function baseFixture(){
  const g = {
    player: 'a',
    turn: 12,
    year: 1451,
    month: 0,
    log: [],
    factions: {
      a: { treasury: 2000, food: 200, prestige: 100, piety: 80, legitimacy: 80, stability: 70, relations: { b: 20 } },
      b: { treasury: 1500, food: 150, prestige: 60, piety: 50, legitimacy: 65, stability: 60, relations: { a: 20 } }
    },
    provinces: {
      p1: { id: 'p1', name: 'Province 1', owner: 'a', development: 6, unrest: 10 },
      p2: { id: 'p2', name: 'Province 2', owner: 'a', development: 8, unrest: 15 },
      q1: { id: 'q1', name: 'Province 3', owner: 'b', development: 5, unrest: 10 }
    },
    politics: {
      realms: {
        a: { ruler: 'r1', council: { steward: 'c1', spymaster: 'c2' } },
        b: { ruler: 'r2', council: { steward: 'c3' } }
      },
      people: {
        r1: { id: 'r1', name: 'Ruler One', realm: 'a', age: 36, sex: 'male', alive: true, house: 'A', civic: { faith: 'Latin Christianity', culture: 'Frankish', stress: 20 }, skills: { martial: 4, stewardship: 5, diplomacy: 4, intrigue: 3, learning: 5 }, children: ['w1'], spouse: null, memories: [] },
        r2: { id: 'r2', name: 'Ruler Two', realm: 'b', age: 40, sex: 'male', alive: true, house: 'B', civic: { faith: 'Sunni Islam', culture: 'Bedouin', stress: 10 }, skills: { martial: 6, stewardship: 3, diplomacy: 5, intrigue: 4, learning: 4 }, children: [], spouse: null, memories: [] },
        c1: { id: 'c1', name: 'Courtier One', realm: 'a', age: 30, sex: 'female', alive: true, house: 'C', civic: { faith: 'Latin Christianity', culture: 'Frankish', stress: 10 }, skills: { stewardship: 6, diplomacy: 4 }, children: [], memories: [] },
        c2: { id: 'c2', name: 'Courtier Two', realm: 'a', age: 28, sex: 'male', alive: true, house: 'D', civic: { faith: 'Latin Christianity', culture: 'Frankish', stress: 15 }, skills: { intrigue: 6, martial: 3 }, children: [], memories: [] },
        c3: { id: 'c3', name: 'Foreign Courtier', realm: 'b', age: 32, sex: 'male', alive: true, house: 'E', civic: { faith: 'Sunni Islam', culture: 'Bedouin', stress: 5 }, skills: { stewardship: 5 }, children: [], memories: [] },
        w1: { id: 'w1', name: 'Ward Child', realm: 'a', age: 10, sex: 'female', alive: true, house: 'A', civic: { faith: 'Latin Christianity', education: 10 }, children: [], memories: [] }
      },
      holdings: {
        p1: { realm: 'a', lord: 'c1', loyalty: 75 },
        p2: { realm: 'a', lord: 'c2', loyalty: 70 },
        q1: { realm: 'b', lord: 'c3', loyalty: 80 }
      },
      marriages: []
    },
    civic: {
      realms: {
        a: { faith: 'Latin Christianity', culture: 'Frankish', government: 'feudal', policy: 'pluralism' },
        b: { faith: 'Sunni Islam', culture: 'Bedouin', government: 'sultanate', policy: 'accommodation' }
      },
      provinces: {
        p1: { faith: 'Latin Christianity', culture: 'Frankish', localTrust: 70, acceptance: 75, devotion: 60 },
        p2: { faith: 'Latin Christianity', culture: 'Frankish', localTrust: 65, acceptance: 70, devotion: 55 },
        q1: { faith: 'Sunni Islam', culture: 'Bedouin', localTrust: 80, acceptance: 80, devotion: 65 }
      }
    },
    economy: {
      realms: { a: { inflation: 2, credit: 60 }, b: { inflation: 0, credit: 50 } },
      provinces: {
        p1: { stock: { grain: 20, tools: 10 } },
        p2: { stock: { grain: 15, tools: 8 } },
        q1: { stock: { grain: 25, tools: 12 } }
      },
      loans: {},
      crises: {}
    },
    identity: {
      realms: {
        a: { traditions: ['agrarian_stewardship'], innovations: [], research: null, faithAuthority: 70, lastTradition: -100, lastFaith: -100 },
        b: { traditions: ['military_service'], innovations: [], research: null, faithAuthority: 65, lastTradition: -100, lastFaith: -100 }
      },
      institutions: {
        p1: { level: 2, faith: 'Latin Christianity', lastConsultation: -20 },
        p2: { level: 1, faith: 'Latin Christianity', lastConsultation: -20 },
        q1: { level: 2, faith: 'Sunni Islam', lastConsultation: -20 }
      },
      projects: {},
      history: []
    },
    living: {
      health: {},
      realms: { a: { faithAdvisor: 'c1' }, b: { faithAdvisor: 'c3' } }
    },
    feudal: {
      prisoners: {},
      claimants: {}
    },
    chronicles: {
      relationships: {},
      realms: { a: { successionAt: 0 }, b: { successionAt: 0 } }
    },
    institutions: {
      history: [],
      realms: {
        a: { mode: 'estates', compacts: {}, tributes: {} },
        b: { mode: 'household', compacts: {}, tributes: {} }
      }
    },
    armies: {
      a1: { id: 'a1', owner: 'a', province: 'p1', count: 1200, morale: 80, experience: 0.1 }
    },
    military: {
      armies: {
        a1: { supply: 85, fatigue: 10 }
      }
    },
    campaignWar: { occupations: {} },
    conflict: { wars: {}, factions: {} }
  };
  return g;
}

const mockWorld = {
  factions: [{ id: 'a' }, { id: 'b' }],
  provinces: [
    { id: 'p1', neighbors: ['p2', 'q1'] },
    { id: 'p2', neighbors: ['p1'] },
    { id: 'q1', neighbors: ['p1'] }
  ]
};

// =========================================================================
// PHASE 2: LIVING CHARACTER SIMULATION TESTS
// =========================================================================

test('Phase 2: Character schema contains prestige, piety, influence, wealth and 7 personality axes', () => {
  const g = baseFixture();
  const r1 = g.politics.people.r1;
  ensureCharacterSchema(g, r1);

  assert.equal(typeof r1.prestige, 'number');
  assert.equal(typeof r1.piety, 'number');
  assert.equal(typeof r1.influence, 'number');
  assert.equal(typeof r1.wealth, 'number');
  assert.ok(r1.personality);

  for (const axis of PERSONALITY_AXES) {
    assert.equal(typeof r1.personality[axis], 'number', `Missing personality axis: ${axis}`);
    assert.ok(r1.personality[axis] >= -100 && r1.personality[axis] <= 100);
  }

  assert.ok(Array.isArray(r1.friends));
  assert.ok(Array.isArray(r1.rivals));
  assert.ok(Array.isArray(r1.lovers));
  assert.ok(Array.isArray(r1.mentors));
  assert.ok(Array.isArray(r1.wards));
  assert.ok(Array.isArray(r1.grievances));
});

test('Phase 2: Social roles categorize courtier, commander, merchant, clergy and landed properly', () => {
  const g = baseFixture();
  initAgency(g);

  assert.equal(deriveSocialRole(g, 'r1'), 'landed');
  assert.equal(deriveSocialRole(g, 'c1'), 'landed'); // has holding p1
  assert.ok(SOCIAL_ROLES.includes(deriveSocialRole(g, 'c2')));
  const sets = roleSets(g);
  assert.ok(sets.landedSet.has('r1'));
});

test('Phase 2: Grievances, romance, and bereavement update relationships and personal memories', () => {
  const g = baseFixture();
  initAgency(g);
  initLiving(g);

  recordGrievance(g, 'c1', 'r1', 'Denied promotion', 25);
  assert.equal(g.politics.people.c1.grievances.length, 1);
  assert.equal(g.politics.people.c1.grievances[0].severity, 25);

  addRomance(g, 'r1', 'c1');
  assert.ok(g.politics.people.r1.lovers.includes('c1'));
  assert.ok(g.politics.people.c1.lovers.includes('r1'));

  const initialStress = g.politics.people.r1.civic.stress;
  g.politics.people.w1.parents = ['r1'];
  rememberBereavement(g, g.politics.people.w1);
  assert.ok(g.politics.people.r1.civic.stress > initialStress);
  assert.ok(g.politics.people.r1.memories.some(m => m.includes('mourned')));
});

test('Phase 2: Health conditions, injuries, epidemic conditions, and recovery operate deterministically', () => {
  const g = baseFixture();
  initLiving(g);

  const condKeys = Object.keys(HEALTH_CONDITIONS);
  assert.ok(condKeys.includes('wounded'));
  assert.ok(condKeys.includes('epidemic illness'));
  assert.ok(condKeys.includes('melancholy'));

  inflictCharacterCondition(g, 'c2', 'wounded', 40);
  assert.equal(g.living.health.c2.condition, 'wounded');
  assert.equal(g.living.health.c2.severity, 40);

  recoverCharacterCondition(g, 'c2', 20);
  assert.equal(g.living.health.c2.severity, 20);

  recoverCharacterCondition(g, 'c2', 30);
  assert.equal(g.living.health.c2.condition, 'well');
  assert.equal(g.living.health.c2.severity, 0);
});

test('Phase 2: Staggered monthly decision agency runs without crashing across cohorts', () => {
  const g = baseFixture();
  initAgency(g);
  initLiving(g);

  for (let turn = 1; turn <= 12; turn++) {
    g.turn = turn;
    tickAgency(g, mockWorld);
  }
  const view = characterLifeView(g, 'r1');
  assert.ok(view);
  assert.ok(view.personality);
  assert.equal(typeof view.prestige, 'number');
});

// =========================================================================
// PHASE 8: DISTINCT RELIGIOUS MECHANICS TESTS
// =========================================================================

test('Phase 8: FAITH_SYSTEMS and SACRED_SITES distinguish 5 traditions and holy sanctuaries', () => {
  const g = baseFixture();
  assert.deepEqual(FAITH_SYSTEMS, ['catholic', 'orthodox', 'islamic', 'dharmic', 'traditional']);
  assert.ok(SACRED_SITES.latium);
  assert.ok(SACRED_SITES.hejaz);
  assert.ok(SACRED_SITES.thrace);
  assert.ok(SACRED_SITES.benares);

  assert.equal(faithTraditionSystem(g, 'Latin Christianity'), 'catholic');
  assert.equal(faithTraditionSystem(g, 'Eastern Christianity'), 'orthodox');
  assert.equal(faithTraditionSystem(g, 'Sunni Islam'), 'islamic');
  assert.equal(faithTraditionSystem(g, 'Hindu traditions'), 'dharmic');
  assert.equal(faithTraditionSystem(g, 'Andean spiritual traditions'), 'traditional');
});

test('Phase 8: Catholic tradition handles Indulgence, Investiture, Curia, and Excommunication', () => {
  const g = baseFixture();
  // Indulgence purchase
  const initialGold = g.factions.a.treasury;
  const indRes = faithCharterAction(g, 'a', 'faith-indulgence');
  assert.ok(indRes.ok);
  assert.equal(g.factions.a.treasury, initialGold - 120);
  assert.ok(g.politics.people.r1.piety > 0);

  // Royal investiture reform
  const invRes = faithCharterAction(g, 'a', 'faith-investiture', 'royal');
  assert.ok(invRes.ok);
  const sysMod = faithSystemModifiers(g, 'a');
  assert.ok(sysMod.tax > 1);

  // Excommunication impact
  g.identity.realms.a.faithSystem.excommunicated = true;
  const excomMod = faithSystemModifiers(g, 'a');
  assert.ok(excomMod.tax < 1);
  assert.ok(excomMod.levy < 1);
});

test('Phase 8: Islamic tradition handles Jizya, Ulama consultation, and Hajj pilgrimage', () => {
  const g = baseFixture();
  // Jizya toggle
  const jizRes = faithCharterAction(g, 'b', 'faith-jizya');
  assert.ok(jizRes.ok);
  const sysMod = faithSystemModifiers(g, 'b');
  assert.ok(sysMod.tax > 1.05); // Jizya provides tax bonus

  // Ulama consultation
  const ulamaRes = faithCharterAction(g, 'b', 'faith-ulama');
  assert.ok(ulamaRes.ok);

  // Hajj pilgrimage
  const hajjRes = faithCharterAction(g, 'b', 'faith-hajj');
  assert.ok(hajjRes.ok);
  assert.ok(g.politics.people.r2.memories.some(m => m.includes('Hajj')));
});

test('Phase 8: Orthodox Autocephaly and Dharmic monastic patronage execute correctly', () => {
  const g = baseFixture();
  g.civic.realms.a.faith = 'Eastern Christianity';
  g.politics.people.r1.civic.faith = 'Eastern Christianity';
  const autoRes = faithCharterAction(g, 'a', 'faith-autocephaly');
  assert.ok(autoRes.ok);
  assert.ok(g.identity.realms.a.faithSystem.autocephalous);

  g.civic.realms.a.faith = 'Hindu traditions';
  g.politics.people.r1.civic.faith = 'Hindu traditions';
  delete g.identity.realms.a.faithSystem;
  const patronRes = faithCharterAction(g, 'a', 'faith-monastic-patronage', 'p1');
  assert.ok(patronRes.ok);
  assert.ok(g.identity.realms.a.faithSystem.monasticEndowments >= 1);
});

// =========================================================================
// PHASE 9: 10+ DISTINCT GOVERNMENTS TESTS
// =========================================================================

test('Phase 9: Government profiles expose mechanics for all major CK2 polities', () => {
  const g = baseFixture();
  for (const gov of ['feudal', 'imperial', 'republic', 'sultanate', 'steppe', 'kinship', 'military', 'city', 'shogunate', 'confederation', 'regional']) {
    g.civic.realms.a.government = gov;
    const mech = governmentMechanics(g, 'a');
    assert.ok(mech, `Missing mechanics for ${gov}`);
    assert.ok(mech.succession);
    assert.ok(mech.aiPriority);
  }
});

test('Phase 9: Sultanate decadence ticks and responds to royal reform', () => {
  const g = baseFixture();
  const vBefore = regionalPoliticalView(g, 'b');
  assert.ok(vBefore.decadence !== undefined);

  // Sultanate reform
  const act = regionalPoliticalAction(g, 'b', 'sultanate:reform');
  assert.ok(act.ok);
  const vAfter = regionalPoliticalView(g, 'b');
  assert.ok(vAfter.decadence <= vBefore.decadence);
});

test('Phase 9: Tribal retinues, border raids, and City-State guilds execute with real effects', () => {
  const g = baseFixture();
  g.civic.realms.a.government = 'kinship';
  const retRes = tribalRetinue(g, 'a');
  assert.ok(retRes.ok);
  assert.ok(g.institutions.realms.a.retinues >= 1);

  g.armies.a1.infantry = 100;
  g.armies.a1.cavalry = 50;
  g.armies.a1.archers = 50;
  const raidRes = tribalRaid(g, 'a', 'b');
  assert.ok(raidRes.ok);

  g.civic.realms.a.government = 'city';
  const guildRes = cityGuildAction(g, 'a', 'merchants');
  assert.ok(guildRes.ok);
  assert.equal(g.institutions.realms.a.guilds.merchants, 2);
});

// =========================================================================
// PHASE 10: INTRIGUE & 14 SCHEMES TESTS
// =========================================================================

test('Phase 10: ALL_14_SCHEMES contains all required scheme archetypes', () => {
  const expected = [
    'assassinate', 'abduct', 'blackmail', 'fabricate_claim', 'seduce',
    'sabotage', 'discredit', 'recruit_agent', 'support_claimant',
    'gather_info', 'expose_corruption', 'counterespionage', 'protect_ruler', 'break_alliance'
  ];
  for (const s of expected) {
    assert.ok(ALL_14_SCHEMES.includes(s), `Missing scheme: ${s}`);
    assert.ok(PLOTS[s], `Missing plot definition: ${s}`);
  }
});

test('Phase 10: Hostile and defensive schemes launch, calculate odds, and resolve outcomes', () => {
  const g = baseFixture();
  initIntrigue(g);

  // Defensive scheme: protect_ruler
  const protRes = intrigueAction(g, mockWorld, 'start', 'protect_ruler', 'r1');
  assert.ok(protRes.ok);
  const pid = Object.keys(g.intrigue.plots)[0];
  assert.ok(pid);
  assert.equal(g.intrigue.plots[pid].kind, 'protect_ruler');

  const odds = plotOdds(g, g.intrigue.plots[pid]);
  assert.ok(odds.chance > 0);
  assert.ok(odds.exposure > 0);

  // Advance time to resolve scheme
  g.turn += 12;
  tickIntrigue(g, mockWorld, () => true);
  assert.ok(g.intrigue.protected?.r1 || g.intrigue.plots[pid].status === 'failed');
});

// =========================================================================
// PHASE 11: ECONOMY HOLDINGS & REGIONAL TECH TESTS
// =========================================================================

test('Phase 11: Holding building economics for castle, city, and temple function with costs', () => {
  const g = baseFixture();
  initEconomy(g, mockWorld);

  assert.ok(HOLDING_TYPES.includes('castle'));
  assert.ok(HOLDING_TYPES.includes('city'));
  assert.ok(HOLDING_TYPES.includes('temple'));

  const cost = holdingBuildingCost(g, 'a', 'p1', 'keep');
  assert.ok(cost > 0);

  const initialGold = g.factions.a.treasury;
  const buildRes = economyAction(g, mockWorld, 'holding-building', 'p1', 'keep');
  assert.ok(buildRes.ok);
  assert.equal(g.factions.a.treasury, initialGold - cost);
  assert.equal(g.economy.provinces.p1.holdings.castle.buildings.keep, 1);

  const mod = provinceHoldingModifiers(g, 'p1');
  assert.ok(mod.levy > 0);
  assert.ok(mod.tax > 0);
});

test('Phase 11: 7 Regional technologies progress, spread, and grant realm modifiers', () => {
  const g = baseFixture();
  initIdentity(g, mockWorld);

  const techs = Object.keys(REGIONAL_TECHS);
  assert.equal(techs.length, 7);
  assert.ok(techs.includes('military_org'));
  assert.ok(techs.includes('construction'));
  assert.ok(techs.includes('agriculture'));
  assert.ok(techs.includes('trade'));
  assert.ok(techs.includes('legal_admin'));
  assert.ok(techs.includes('cultural_dev'));
  assert.ok(techs.includes('naval_tech'));

  const provTech = ensureProvinceTech(g, 'p1', g.provinces.p1);
  assert.ok(provTech);
  assert.equal(provTech.levels.military_org, 1);

  // Invest in province tech
  const initialGold = g.factions.a.treasury;
  const invRes = identityAction(g, mockWorld, 'province-tech', 'military_org', 'p1');
  assert.ok(invRes.ok);
  assert.ok(g.factions.a.treasury < initialGold);

  // Tick progression and spread
  g.turn = 15;
  tickIdentity(g, mockWorld);
  const view = provinceTechView(g, 'p1');
  assert.ok(Array.isArray(view));
  assert.equal(view.length, 7);
});

// =========================================================================
// PHASE 12: EMERGENT CK2 NARRATIVE EVENT CHAINS TESTS
// =========================================================================

test('Phase 12: Emergent content catalog contains 30 verified multi-stage CK2 event chains', () => {
  assert.equal(allEmergentEventCount(), 90); // 30 chains * 3 stages each
  assert.equal(allEmergentDecisionCount(), 10);

  const roots = EMERGENT_EVENTS.filter(e => e.trigger !== 'followup');
  assert.equal(roots.length, 30);

  for (const root of roots) {
    assert.equal(root.choices.length, 2, `Root ${root.id} must have 2 choices`);
    for (const choice of root.choices) {
      if (choice.next) {
        const follow = EMERGENT_EVENTS.find(e => e.id === choice.next);
        assert.ok(follow, `Follow-up stage ${choice.next} must exist in EMERGENT_EVENTS`);
        assert.equal(follow.trigger, 'followup');
        assert.equal(follow.choices.length, 2);
      }
    }
  }
});

test('Phase 12: Emergent events trigger, resolve choices, and progress through multi-stage followups', () => {
  const g = baseFixture();
  initEmergent(g);

  // Manually open court romance
  g.emergent.realms.a.active = { id: 'emergent_court_romance', started: g.turn, availableAt: g.turn, expires: g.turn + 9 };

  const current = currentEmergentEvent(g, 'a');
  assert.ok(current);
  assert.equal(current.id, 'emergent_court_romance');

  const initialStress = g.politics.people.r1.civic.stress;
  const initialGold = g.factions.a.treasury;

  // Resolve choice 0 (Indulge secret correspondence: cost 60, stress -8)
  const res = emergentAction(g, mockWorld, 'resolve', 0);
  assert.ok(res.ok);
  assert.equal(g.factions.a.treasury, initialGold - 60);
  assert.equal(g.politics.people.r1.civic.stress, initialStress - 8);

  // Situation develops to follow-up stage
  const follow = currentEmergentEvent(g, 'a');
  assert.ok(follow);
  assert.equal(follow.id, 'emergent_court_romance_pursued');

  // Resolve second stage choice 0 (bestow keepsake: cost 80)
  g.turn += 3;
  const res2 = emergentAction(g, mockWorld, 'resolve', 0);
  assert.ok(res2.ok);
  assert.equal(currentEmergentEvent(g, 'a'), null); // Chain completed
});

test('Phase 12: Emergent decisions enforce cooldowns and apply real realm effects', () => {
  const g = baseFixture();
  initEmergent(g);

  const decs = emergentDecisions(g, mockWorld, 'a');
  assert.equal(decs.length, 10);
  const tourney = decs.find(d => d.id === 'emergent_grand_tournament_proclaim');
  assert.ok(tourney);
  assert.ok(tourney.ready);

  const initialPrestige = g.factions.a.prestige;
  const initialGold = g.factions.a.treasury;

  // Enact tournament decision
  const act = emergentAction(g, mockWorld, 'decision', 'emergent_grand_tournament_proclaim');
  assert.ok(act.ok);
  assert.equal(g.factions.a.treasury, initialGold - 180);
  assert.equal(g.factions.a.prestige, initialPrestige + 20);

  // Cooldown is active
  const decsAfter = emergentDecisions(g, mockWorld, 'a');
  const tourneyAfter = decsAfter.find(d => d.id === 'emergent_grand_tournament_proclaim');
  assert.equal(tourneyAfter.ready, false);
  assert.ok(tourneyAfter.remaining > 0);
});
