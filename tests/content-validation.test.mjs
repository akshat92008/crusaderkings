import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
 EVENTS,
 DECISIONS,
 SOVEREIGN_CONTENT_EVENTS,
 SOVEREIGN_MANDATES,
 ALL_EVENTS,
 ALL_DECISIONS,
 allContentStats,
 initExpanded,
 currentExpandedEvent,
 expandedAction
} from '../src/expanded-content.js';
import {
 EMERGENT_EVENTS,
 EXTENDED_EMERGENT_EVENTS,
 EXTENDED_REACTIVE_EVENTS,
 EMERGENT_DECISIONS,
 EXTENDED_EMERGENT_DECISIONS
} from '../src/emergent-content.js';
import { siegeCapitalDynastyEvents } from '../src/content/events-siege-capital-dynasty.js';
import { eventArt } from '../src/game-art.js';

const REGIONAL_REALMS = [
 'england', 'france', 'portugal', 'ottomans', 'mamluks', 'vijayanagara', 'bahmani',
 'bengal', 'ming', 'joseon', 'malacca', 'inca', 'castile', 'aragon', 'burgundy',
 'imperial', 'poland', 'muscovy', 'novgorod', 'timurids', 'qara', 'horde', 'morocco',
 'ethiopia', 'mali', 'songhai', 'kongo', 'kilwa', 'delhi', 'gujarat', 'ashikaga',
 'ayutthaya', 'dai-viet', 'majapahit', 'mexica', 'maya', 'pueblo', 'haudenosaunee',
 'muisca', 'tupi', 'mapuche', 'maori', 'fiji', 'aboriginal', 'scotland', 'brittany',
 'kalmar', 'genoa', 'venice', 'cyprus', 'oirats', 'chagatai', 'tibet', 'lanxang',
 'sunda', 'zayyanid'
];

const VALID_TRIGGERS = new Set([
 'followup',
 // Government triggers (['gov_' + gov])
 'gov_feudal', 'gov_republic', 'gov_imperial', 'gov_regional', 'gov_sultanate',
 'gov_shogunate', 'gov_steppe', 'gov_centralized', 'gov_confederation',
 'gov_military', 'gov_city', 'gov_kinship', 'gov_tributary',
 // Faith & Continent & Crossroads triggers
 'faith_dharmic', 'faith_islamic', 'faith_christian', 'faith_traditions',
 'cont_europe', 'cont_asia', 'cont_africa', 'cont_americas', 'cont_oceania',
 'crossroads_gunpowder', 'crossroads_oceanic', 'crossroads_press',
 'crossroads_finance', 'crossroads_contact', 'reign_chapter',
 // Institution story triggers
 'recentMotionPassed', 'recentMotionRejected', 'recentMerchantWinner',
 'recentMerchantRunnerUp', 'recentImperialExam', 'corruptImperialOffice',
 'activeRegionalGrant', 'activeSultanateScholar', 'activeHouseMediation',
 'activePastureReserve', 'recentCrownInspection', 'recentConfederateVote',
 'recentMilitaryProgram', 'recentCityProgram', 'recentKinshipProgram',
 // Depth content triggers
 'recentCoronation', 'recentHunt', 'recentWedding', 'recentFeast',
 'recentTournament', 'recentPilgrimage', 'recentTour', 'recentSummit',
 'recentAssembly', 'recentSymposium', 'recentMemorial', 'recentComingAge',
 'completedArts', 'completedArchives', 'completedCeremony', 'completedScholarship',
 'lowCourtReputation', 'highCourtReputation', 'activeSpecialization',
 'advancedSpecialization', 'activeLanguageStudy', 'activeFaithExchange',
 'activeMerchantRoute', 'idleMerchantRoute', 'liveSituation',
 'recentSettlement', 'charteredEstate',
 // New system triggers
 'sanctuary', 'culturalDistrict', 'languageStudent', 'networkContact',
 'detectedPlot', 'compactExpiry', 'tributeDebt', 'governmentDebate', 'faithDebate',
 // Dynastic triggers
 'married', 'foreignMarriage', 'competingHeirs', 'adultHeir',
 'courtRival', 'courtFriend', 'councillor', 'childless',
 // Institutional triggers
 'taxFaction', 'levyFaction', 'libertyFaction', 'claimantFaction',
 'independenceFaction', 'institutionUpgrade', 'faithTension', 'lowFaithAuthority',
 // Marriage & progression & urgent crisis triggers
 'foreignMatch', 'domesticMatch',
 'focus_diplomacy', 'focus_martial', 'focus_stewardship', 'focus_intrigue', 'focus_learning',
 'wardGuardian', 'highStress',
 'activePlot', 'knownSecret', 'newReign', 'livingClaimant',
 // Base context triggers
 'land', 'food', 'debt', 'inflation', 'trade', 'vassal', 'disloyal', 'loyal',
 'lowlegitimacy', 'unrest', 'lowstability', 'army', 'army_supply', 'army_fatigue',
 'war', 'child', 'stress', 'illness', 'regency', 'lowtrust', 'difference',
 'research', 'institution', 'crisis', 'flood', 'epidemic', 'drought', 'famine',
 'fire', 'neighbor', 'hostile', 'friendly',
 // All 56 regional profile triggers
 ...REGIONAL_REALMS.map(r => `region_${r}`)
]);

// Every effect key actually executed in src/expanded-content.js apply(),
// src/depth-content.js applyDepthEffect(), and src/institution-stories.js applyInstitutionEffect().
const SUPPORTED_EFFECT_KEYS = new Set([
 'gold', 'food', 'prestige', 'piety', 'stability', 'legitimacy', 'credit',
 'inflation', 'development', 'unrest', 'loyalty', 'leverage', 'trust',
 'acceptance', 'grain', 'tools', 'morale', 'experience', 'supply', 'fatigue',
 'factionPressure', 'factionLoyalty', 'institutionLevel', 'devotion',
 'plotPreparation', 'securityMonths', 'focusXP', 'opinion', 'education',
 'stress', 'health', 'research', 'faithAuthority', 'crisis', 'relation',
 'wedding', 'officeCorruption',
 'courtReputation', 'branchXP', 'languageMonths', 'situationCooperation'
]);

const REALM_WIDE_EFFECTS = new Set([
 'gold', 'food', 'prestige', 'piety', 'stability', 'legitimacy', 'credit',
 'inflation', 'securityMonths', 'research', 'faithAuthority'
]);

const TRIGGER_TARGET_EFFECTS = new Map([
 ['army', new Set([...REALM_WIDE_EFFECTS, 'morale', 'experience', 'supply', 'fatigue'])],
 ['war', new Set([...REALM_WIDE_EFFECTS, 'relation', 'morale', 'experience', 'supply', 'fatigue'])],
 ['land', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage'])],
 ['trade', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage'])],
 ['disloyal', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage'])],
 ['crossroads_press', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools'])],
 ['crossroads_oceanic', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools'])],
 ['crossroads_finance', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools'])],
 ['crossroads_gunpowder', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools'])],
 ['region_vijayanagara', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage'])],
 ['region_ottomans', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage'])],
 ['region_ming', new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage'])],
 ['regency', new Set([...REALM_WIDE_EFFECTS, 'stress', 'education'])],
 ['competingHeirs', new Set([...REALM_WIDE_EFFECTS, 'opinion', 'education', 'stress'])],
 ['adultHeir', new Set([...REALM_WIDE_EFFECTS, 'opinion', 'education', 'stress'])],
 ['foreignMarriage', new Set([...REALM_WIDE_EFFECTS, 'opinion', 'relation', 'stress'])]
]);

test('Full expanded & emergent catalog has exact verified deduplicated counts and unique IDs', () => {
 const stats = allContentStats();
 assert.equal(EVENTS.length, 512);
 assert.equal(SOVEREIGN_CONTENT_EVENTS.length, 399);
 assert.equal(ALL_EVENTS.length, 911);
 assert.equal(DECISIONS.length, 174);
 assert.equal(SOVEREIGN_MANDATES.length, 167);
 assert.equal(ALL_DECISIONS.length, 341);

 const emergentAll = [
  ...EMERGENT_EVENTS,
  ...EXTENDED_EMERGENT_EVENTS,
  ...EXTENDED_REACTIVE_EVENTS
 ];
 assert.equal(emergentAll.length, 160);
 assert.equal(stats.expandedEvents, 911);
 assert.equal(stats.emergentEvents, 160);
 assert.equal(stats.totalEvents, 1071);

 const seenExpandedIds = new Set();
 for (const ev of ALL_EVENTS) {
  assert.ok(typeof ev.id === 'string' && ev.id.trim().length > 0, 'Event missing non-empty id');
  assert.ok(!seenExpandedIds.has(ev.id), `Duplicate event id in ALL_EVENTS: ${ev.id}`);
  seenExpandedIds.add(ev.id);
 }
 assert.equal(seenExpandedIds.size, 911);

 const seenAllEventIds = new Set(seenExpandedIds);
 for (const ev of emergentAll) {
  assert.ok(typeof ev.id === 'string' && ev.id.trim().length > 0, 'Emergent event missing non-empty id');
  assert.ok(!seenAllEventIds.has(ev.id), `Duplicate event id across ALL_EVENTS and emergent events: ${ev.id}`);
  seenAllEventIds.add(ev.id);
 }
 assert.equal(seenAllEventIds.size, 1071);

 const seenDecisionIds = new Set();
 for (const dec of [...ALL_DECISIONS, ...EMERGENT_DECISIONS, ...EXTENDED_EMERGENT_DECISIONS]) {
  assert.ok(typeof dec.id === 'string' && dec.id.trim().length > 0, 'Decision missing id');
  assert.ok(!seenDecisionIds.has(dec.id), `Duplicate decision id: ${dec.id}`);
  seenDecisionIds.add(dec.id);
 }
 assert.equal(seenDecisionIds.size, 357);
});

test('Every event in ALL_EVENTS has valid metadata, choices, trigger, supported effect keys, and eventArt mapping', () => {
 const byId = new Map(ALL_EVENTS.map(e => [e.id, e]));

 for (const ev of ALL_EVENTS) {
  assert.ok(typeof ev.title === 'string' && ev.title.trim().length > 0, `Empty title on ${ev.id}`);
  assert.ok(typeof ev.description === 'string' && ev.description.trim().length > 0, `Empty description on ${ev.id}`);
  assert.ok(typeof ev.category === 'string' && ev.category.trim().length > 0, `Empty category on ${ev.id}`);
  assert.ok(VALID_TRIGGERS.has(ev.trigger), `Unsupported trigger "${ev.trigger}" on ${ev.id}`);
  assert.ok(Array.isArray(ev.choices) && ev.choices.length >= 2, `Event ${ev.id} must have >= 2 choices`);

  for (let i = 0; i < ev.choices.length; i++) {
   const ch = ev.choices[i];
   assert.ok(typeof ch.label === 'string' && ch.label.trim().length > 0, `Empty choice label on ${ev.id}[${i}]`);
   assert.ok(Number.isFinite(ch.cost) && ch.cost >= 0, `Invalid choice cost on ${ev.id}[${i}]`);
   assert.ok(ch.effects && typeof ch.effects === 'object' && !Array.isArray(ch.effects), `Invalid effects on ${ev.id}[${i}]`);

   for (const [k, v] of Object.entries(ch.effects)) {
    assert.ok(SUPPORTED_EFFECT_KEYS.has(k), `Unsupported no-op effect key "${k}" on ${ev.id}[${i}]`);
    assert.ok(Number.isFinite(v), `Non-numeric effect value for "${k}" on ${ev.id}[${i}]`);
   }

   if (ch.next !== undefined && ch.next !== null) {
    const target = byId.get(ch.next);
    assert.ok(target, `Dangling follow-up "${ch.next}" referenced by ${ev.id}[${i}]`);
    assert.equal(target.trigger, 'followup', `Follow-up target "${ch.next}" from ${ev.id}[${i}] must have trigger "followup"`);
    assert.notEqual(ch.next, ev.id, `Self-referencing loop on ${ev.id}`);
   }
  }

  const artPath = eventArt(ev, 'england');
  assert.ok(typeof artPath === 'string' && artPath.endsWith('.webp'), `Invalid eventArt path for ${ev.id}: ${artPath}`);
  assert.ok(fs.existsSync(new URL(`../${artPath}`, import.meta.url)), `Missing eventArt asset on disk for ${ev.id}: ${artPath}`);
 }
});

test('Multi-stage chains have zero dangling follow-ups, zero unreachable follow-ups, and zero cycles', () => {
 const byId = new Map(ALL_EVENTS.map(e => [e.id, e]));
 const roots = ALL_EVENTS.filter(e => e.trigger !== 'followup' && e.choices.some(c => c.next));
 const followups = ALL_EVENTS.filter(e => e.trigger === 'followup');

 assert.equal(roots.length, 333);
 assert.equal(followups.length, 528);

 const reachable = new Set();
 let deepChains = 0;

 for (const root of roots) {
  let maxDepth = 1;
  const dfs = (node, depth, stack) => {
   if (depth > maxDepth) maxDepth = depth;
   for (const ch of node.choices) {
    if (!ch.next) continue;
    assert.ok(!stack.has(ch.next), `Cycle detected in chain ${root.id} -> ${ch.next}`);
    const nextNode = byId.get(ch.next);
    assert.ok(nextNode, `Missing follow-up ${ch.next}`);
    reachable.add(nextNode.id);
    stack.add(nextNode.id);
    dfs(nextNode, depth + 1, stack);
    stack.delete(nextNode.id);
   }
  };
  dfs(root, 1, new Set([root.id]));
  if (maxDepth >= 3) deepChains++;
 }

 assert.equal(deepChains, 17, 'Expected 17 multi-stage chains with depth >= 3');
 for (const f of followups) {
  assert.ok(reachable.has(f.id), `Unreachable orphan followup stage: ${f.id}`);
 }

 // Also verify emergent multi-stage chains have zero dangling next links
 const emergentAll = [...EMERGENT_EVENTS, ...EXTENDED_EMERGENT_EVENTS, ...EXTENDED_REACTIVE_EVENTS];
 const emById = new Map(emergentAll.map(e => [e.id, e]));
 let emRoots = 0;
 for (const ev of emergentAll) {
  if (ev.trigger !== 'followup' && ev.choices.some(c => c.next)) emRoots++;
  for (const ch of ev.choices) {
   if (ch.next) assert.ok(emById.has(ch.next), `Dangling emergent followup ${ch.next} on ${ev.id}`);
  }
 }
 assert.equal(emRoots, 50);
});

test('Siege, Capital & Dynasty pack has 69 stages across 16 depth>=3 chains with strict target-compatible effects', () => {
 const stubE = (id, category, title, description, trigger, choices) => ({ id, category, title, description, trigger, choices });
 const stubC = (label, cost, effects, next = null) => ({ label, cost, effects, ...(next ? { next } : {}) });
 const pack = siegeCapitalDynastyEvents(stubE, stubC);
 assert.equal(pack.length, 69);

 const packById = new Map(pack.map(e => [e.id, e]));
 const roots = pack.filter(e => e.trigger !== 'followup');
 assert.equal(roots.length, 16);

 for (const root of roots) {
  const allowedForTrigger = TRIGGER_TARGET_EFFECTS.get(root.trigger);
  assert.ok(allowedForTrigger, `Unexpected trigger ${root.trigger} on ${root.id}`);

  let maxDepth = 1;
  const walk = (node, depth) => {
   if (depth > maxDepth) maxDepth = depth;
   assert.equal(node.choices[node.choices.length - 1].cost, 0, `${node.id} should offer a free fallback option`);
   for (const ch of node.choices) {
    assert.ok(Object.keys(ch.effects).length > 0, `${node.id} choice "${ch.label}" should not have empty effects`);
    for (const k of Object.keys(ch.effects)) {
     assert.ok(allowedForTrigger.has(k), `Effect "${k}" on ${node.id} does not execute on trigger "${root.trigger}"`);
    }
    if (ch.next) {
     const next = packById.get(ch.next);
     assert.ok(next, `Missing follow-up ${ch.next} in pack`);
     walk(next, depth + 1);
    }
   }
  };
  walk(root, 1);
  assert.ok(maxDepth >= 3, `Expected chain ${root.id} to have at least 3 stages, got ${maxDepth}`);
 }
});

function makeChainFixture(realm = 'a') {
 const g = {
  player: realm,
  turn: 0,
  year: 1475,
  month: 0,
  log: [],
  factions: {
   [realm]: { name: 'Realm', treasury: 2500, food: 200, stability: 55, legitimacy: 55, prestige: 30, piety: 20, relations: { b: 10 } },
   b: { name: 'Neighbor', treasury: 1000, food: 150, stability: 60, legitimacy: 60, prestige: 25, piety: 15, relations: { [realm]: 10 } }
  },
  provinces: {
   p: { id: 'p', owner: realm, development: 5, unrest: 30 },
   q: { id: 'q', owner: 'b', development: 5, unrest: 20 }
  },
  politics: {
   realms: { [realm]: { ruler: 'r', regent: 'v', council: { steward: 'v' } }, b: { ruler: 's' } },
   people: {
    r: { id: 'r', realm, alive: true, age: 44, house: 'H', spouse: 'wife', children: ['h', 'j'], civic: { education: 20, stress: 35 } },
    h: { id: 'h', realm, alive: true, age: 24, house: 'H', civic: { education: 25, stress: 10 } },
    j: { id: 'j', realm, alive: true, age: 21, house: 'H', civic: { education: 18, stress: 10 } },
    wife: { id: 'wife', realm: 'b', alive: true, age: 38, spouse: 'r' },
    v: { id: 'v', realm, alive: true, age: 46 },
    s: { id: 's', realm: 'b', alive: true, age: 40 }
   },
   holdings: { p: { realm, lord: 'v', loyalty: 30 }, q: { realm: 'b', lord: 's', loyalty: 60 } }
  },
  civic: {
   realms: { [realm]: { culture: 'C', faith: 'F' }, b: { culture: 'B', faith: 'F' } },
   provinces: { p: { culture: 'C', faith: 'F', localTrust: 50, acceptance: 55 }, q: { culture: 'B', faith: 'F', localTrust: 70, acceptance: 70 } }
  },
  economy: {
   realms: { [realm]: { inflation: 6, credit: 50 }, b: { inflation: 2, credit: 50 } },
   provinces: { p: { stock: { grain: 20, tools: 10 } }, q: { stock: { grain: 20, tools: 10 } } },
   loans: {},
   crises: {}
  },
  identity: {
   realms: { [realm]: { research: { id: 'gunpowder', progress: 10 }, faithAuthority: 55 }, b: { research: null, faithAuthority: 55 } },
   institutions: { p: { level: 1, faith: 'F' }, q: { level: 1, faith: 'F' } }
  },
  living: { health: {} },
  kingdom: { tradePacts: {} },
  conflict: { wars: { w1: { id: 'w1', attacker: realm, defender: 'b', status: 'active' } } },
  intrigue: { security: {} },
  chronicles: {
   relationships: {
    'r|h': { a: 'r', b: 'h', opinion: 25, kind: 'acquaintance', last: 0 },
    'r|j': { a: 'r', b: 'j', opinion: 10, kind: 'acquaintance', last: 0 },
    'r|wife': { a: 'r', b: 'wife', opinion: 20, kind: 'acquaintance', last: 0 }
   }
  },
  armies: { x: { id: 'x', owner: realm, province: 'p', morale: 55, experience: 0.1 } },
  military: { armies: { x: { supply: 50, fatigue: 30 } } }
 };
 initExpanded(g);
 return g;
}

const TEST_WORLD = { provinces: [{ id: 'p', neighbors: ['q'] }, { id: 'q', neighbors: ['p'] }] };

test('All 16 new multi-stage narrative chains resolve end-to-end across branches and enforce regional locks', () => {
 const scenarios = [
  ['scd_victorious_general', 'a', { army: 'x' }, [0, 0, 0, 0]],
  ['scd_victorious_general', 'a', { army: 'x' }, [1, 1, 0, 1]],
  ['scd_border_citadel', 'a', { other: 'b', army: 'x' }, [0, 0, 0, 0]],
  ['scd_border_citadel', 'a', { other: 'b', army: 'x' }, [1, 1, 0, 2]],
  ['scd_aqueduct_charter', 'a', { province: 'p' }, [0, 0, 0, 0]],
  ['scd_aqueduct_charter', 'a', { province: 'p' }, [1, 0, 0, 1]],
  ['scd_vijayanagara_mahanavami', 'vijayanagara', { province: 'p', region: 'vijayanagara' }, [0, 0, 0]],
  ['scd_ottoman_foundry', 'ottomans', { province: 'p', region: 'ottomans' }, [0, 0, 0]],
  ['scd_ming_grand_exam', 'ming', { province: 'p', region: 'ming' }, [0, 0, 0]],
  ['scd_renaissance_printing', 'a', { province: 'p' }, [0, 0, 0]],
  ['scd_guild_coinage', 'a', { province: 'p' }, [0, 0, 0]],
  ['scd_regent_citadel', 'a', { person: 'r' }, [0, 0, 0]],
  ['scd_heirs_command', 'a', { actor: 'r', person: 'j', sibling: 'h', bond: 'child' }, [0, 0, 0]],
  ['scd_oceanic_arsenal', 'a', { province: 'p' }, [0, 0, 0]],
  ['scd_chartered_bourse', 'a', { province: 'p' }, [0, 0, 0]],
  ['scd_star_fort_survey', 'a', { province: 'p' }, [0, 0, 0]],
  ['scd_consort_artisan_guild', 'a', { actor: 'r', person: 'r', partner: 'wife', bond: 'spouse', other: 'b' }, [0, 0, 0]],
  ['scd_castellan_saltpeter', 'a', { province: 'p' }, [0, 0, 0]],
  ['scd_heir_capital_works', 'a', { actor: 'r', person: 'h', bond: 'child' }, [0, 0, 0]]
 ];

 for (const [rootId, realm, target, choices] of scenarios) {
  const g = makeChainFixture(realm);
  g.expanded.realms[realm].active = { id: rootId, target, started: 0, expires: 9 };
  for (let step = 0; step < choices.length; step++) {
   const cur = currentExpandedEvent(g, realm);
   assert.ok(cur, `Expected active event at step ${step} of ${rootId}`);
   const res = expandedAction(g, TEST_WORLD, 'resolve', choices[step]);
   assert.ok(res.ok, `Failed resolving ${cur.id} (choice ${choices[step]}): ${res.msg}`);
   const nextEv = g.expanded.realms[realm].active;
   if (step < choices.length - 1) {
    assert.ok(nextEv, `Expected follow-up after step ${step} of ${rootId}`);
    g.turn = nextEv.availableAt;
   } else {
    assert.equal(nextEv, null, `Expected chain ${rootId} to finish after ${choices.length} stages`);
   }
  }
 }

 // Verify regional follow-up lock: a forged region target for a non-matching realm cannot resolve.
 for (const [id, forgedRealm] of [
  ['scd_vijayanagara_mahanavami', 'ottomans'],
  ['scd_mahanavami_cavalry', 'ottomans'],
  ['scd_ottoman_foundry', 'ming'],
  ['scd_ottoman_bronze_cast', 'ming'],
  ['scd_ming_grand_exam', 'vijayanagara'],
  ['scd_ming_tribute_fleet', 'vijayanagara']
 ]) {
  const g = makeChainFixture(forgedRealm);
  g.expanded.realms[forgedRealm].active = {
   id,
   target: { province: 'p', region: forgedRealm },
   started: 0,
   expires: 9
  };
  assert.equal(currentExpandedEvent(g, forgedRealm), null, `Foreign realm ${forgedRealm} must not see ${id}`);
  assert.equal(expandedAction(g, TEST_WORLD, 'resolve', 0).ok, false);
 }
});
