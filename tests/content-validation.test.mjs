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
import { warDiplomacyEvents } from '../src/content/events-war-diplomacy.js';
import { economyTradeEvents } from '../src/content/events-economy-trade.js';
import { faithSocietyEvents } from '../src/content/events-faith-society.js';
import { culturesWorldEvents } from '../src/content/events-cultures-world.js';
import { ck2DlcEpicEvents } from '../src/content/events-ck2-dlc-epics.js';
import { ck2WorldCourtEvents } from '../src/content/events-ck2-world-court.js';
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

const PROVINCE_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'development', 'unrest', 'trust', 'acceptance', 'grain', 'tools', 'loyalty', 'leverage']);
const DISASTER_EFFECTS = new Set([...PROVINCE_EFFECTS, 'crisis']);
const PERSON_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'stress']);
const DYNASTIC_PERSON_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'opinion', 'stress']);
const CHILD_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'education', 'stress']);
const HEIR_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'opinion', 'education', 'stress']);
const NEIGHBOR_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'relation']);
const ARMY_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'morale', 'experience', 'supply', 'fatigue']);
const WAR_EFFECTS = new Set([...REALM_WIDE_EFFECTS, 'relation', 'morale', 'experience', 'supply', 'fatigue']);

const EXPANSION_TRIGGER_EFFECTS = new Map([
 ...TRIGGER_TARGET_EFFECTS,
 ['army_supply', ARMY_EFFECTS],
 ['army_fatigue', ARMY_EFFECTS],
 ['neighbor', NEIGHBOR_EFFECTS],
 ['hostile', NEIGHBOR_EFFECTS],
 ['friendly', NEIGHBOR_EFFECTS],
 ['tributeDebt', NEIGHBOR_EFFECTS],
 ['vassal', PROVINCE_EFFECTS],
 ['loyal', PROVINCE_EFFECTS],
 ['lowlegitimacy', PROVINCE_EFFECTS],
 ['unrest', PROVINCE_EFFECTS],
 ['lowstability', PROVINCE_EFFECTS],
 ['lowtrust', PROVINCE_EFFECTS],
 ['difference', PROVINCE_EFFECTS],
 ['food', PROVINCE_EFFECTS],
 ['debt', PROVINCE_EFFECTS],
 ['inflation', PROVINCE_EFFECTS],
 ['research', PROVINCE_EFFECTS],
 ['institution', PROVINCE_EFFECTS],
 ['institutionUpgrade', new Set([...PROVINCE_EFFECTS, 'institutionLevel'])],
 ['sanctuary', PROVINCE_EFFECTS],
 ['culturalDistrict', PROVINCE_EFFECTS],
 ['faithTension', PROVINCE_EFFECTS],
 ['lowFaithAuthority', PROVINCE_EFFECTS],
 ['crisis', DISASTER_EFFECTS],
 ['flood', DISASTER_EFFECTS],
 ['epidemic', DISASTER_EFFECTS],
 ['drought', DISASTER_EFFECTS],
 ['famine', DISASTER_EFFECTS],
 ['fire', DISASTER_EFFECTS],
 ['crossroads_contact', PROVINCE_EFFECTS],
 ['faith_dharmic', PROVINCE_EFFECTS],
 ['faith_islamic', PROVINCE_EFFECTS],
 ['faith_christian', PROVINCE_EFFECTS],
 ['faith_traditions', PROVINCE_EFFECTS],
 ['cont_europe', PROVINCE_EFFECTS],
 ['cont_asia', PROVINCE_EFFECTS],
 ['cont_africa', PROVINCE_EFFECTS],
 ['cont_americas', PROVINCE_EFFECTS],
 ['cont_oceania', PROVINCE_EFFECTS],
 ['gov_feudal', PROVINCE_EFFECTS],
 ['gov_republic', PROVINCE_EFFECTS],
 ['gov_imperial', PROVINCE_EFFECTS],
 ['gov_regional', PROVINCE_EFFECTS],
 ['gov_sultanate', PROVINCE_EFFECTS],
 ['gov_shogunate', PROVINCE_EFFECTS],
 ['gov_steppe', PROVINCE_EFFECTS],
 ['gov_centralized', PROVINCE_EFFECTS],
 ['gov_confederation', PROVINCE_EFFECTS],
 ['gov_military', PROVINCE_EFFECTS],
 ['gov_city', PROVINCE_EFFECTS],
 ['gov_kinship', PROVINCE_EFFECTS],
 ['gov_tributary', PROVINCE_EFFECTS],
 ...REGIONAL_REALMS.map(r => [`region_${r}`, PROVINCE_EFFECTS]),
 ['activePlot', new Set([...REALM_WIDE_EFFECTS, 'plotPreparation', 'stress'])],
 ['detectedPlot', PERSON_EFFECTS],
 ['knownSecret', PERSON_EFFECTS],
 ['newReign', PERSON_EFFECTS],
 ['faithDebate', PERSON_EFFECTS],
 ['governmentDebate', PERSON_EFFECTS],
 ['languageStudent', PERSON_EFFECTS],
 ['stress', PERSON_EFFECTS],
 ['highStress', PERSON_EFFECTS],
 ['illness', new Set([...REALM_WIDE_EFFECTS, 'health', 'stress'])],
 ['child', CHILD_EFFECTS],
 ['wardGuardian', HEIR_EFFECTS],
 ['married', DYNASTIC_PERSON_EFFECTS],
 ['courtRival', DYNASTIC_PERSON_EFFECTS],
 ['courtFriend', DYNASTIC_PERSON_EFFECTS],
 ['councillor', DYNASTIC_PERSON_EFFECTS],
 ['livingClaimant', DYNASTIC_PERSON_EFFECTS],
 ['childless', PERSON_EFFECTS],
 ['reign_chapter', PERSON_EFFECTS],
 ['focus_diplomacy', new Set([...PERSON_EFFECTS, 'focusXP'])],
 ['focus_intrigue', new Set([...PERSON_EFFECTS, 'focusXP'])],
 ['focus_learning', new Set([...PERSON_EFFECTS, 'focusXP'])],
 ['focus_martial', new Set([...PERSON_EFFECTS, 'focusXP'])],
 ['focus_stewardship', new Set([...PERSON_EFFECTS, 'focusXP'])],
 ['taxFaction', new Set([...REALM_WIDE_EFFECTS, 'factionPressure', 'factionLoyalty'])],
 ['levyFaction', new Set([...REALM_WIDE_EFFECTS, 'factionPressure', 'factionLoyalty'])],
 ['libertyFaction', new Set([...REALM_WIDE_EFFECTS, 'factionPressure', 'factionLoyalty'])],
 ['claimantFaction', new Set([...REALM_WIDE_EFFECTS, 'factionPressure', 'factionLoyalty'])],
 ['independenceFaction', new Set([...REALM_WIDE_EFFECTS, 'factionPressure', 'factionLoyalty'])]
]);

test('Full expanded & emergent catalog has exact verified deduplicated counts and unique IDs', () => {
 const stats = allContentStats();
 assert.equal(EVENTS.length, 512);
 assert.equal(SOVEREIGN_CONTENT_EVENTS.length, 2379);
 assert.equal(ALL_EVENTS.length, 2891);
 assert.equal(DECISIONS.length, 174);
 assert.equal(SOVEREIGN_MANDATES.length, 247);
 assert.equal(ALL_DECISIONS.length, 421);

 const emergentAll = [
  ...EMERGENT_EVENTS,
  ...EXTENDED_EMERGENT_EVENTS,
  ...EXTENDED_REACTIVE_EVENTS
 ];
 assert.equal(emergentAll.length, 160);
 assert.equal(stats.expandedEvents, 2891);
 assert.equal(stats.emergentEvents, 160);
 assert.equal(stats.totalEvents, 3051);
 assert.ok(stats.totalEvents >= 3000, `Expected >= 3000 total events, got ${stats.totalEvents}`);
 assert.ok(stats.totalDecisions >= 420, `Expected >= 420 total decisions, got ${stats.totalDecisions}`);

 const seenExpandedIds = new Set();
 for (const ev of ALL_EVENTS) {
  assert.ok(typeof ev.id === 'string' && ev.id.trim().length > 0, 'Event missing non-empty id');
  assert.ok(!seenExpandedIds.has(ev.id), `Duplicate event id in ALL_EVENTS: ${ev.id}`);
  seenExpandedIds.add(ev.id);
 }
 assert.equal(seenExpandedIds.size, 2891);

 const seenAllEventIds = new Set(seenExpandedIds);
 for (const ev of emergentAll) {
  assert.ok(typeof ev.id === 'string' && ev.id.trim().length > 0, 'Emergent event missing non-empty id');
  assert.ok(!seenAllEventIds.has(ev.id), `Duplicate event id across ALL_EVENTS and emergent events: ${ev.id}`);
  seenAllEventIds.add(ev.id);
 }
 assert.equal(seenAllEventIds.size, 3051);

 const seenDecisionIds = new Set();
 for (const dec of [...ALL_DECISIONS, ...EMERGENT_DECISIONS, ...EXTENDED_EMERGENT_DECISIONS]) {
  assert.ok(typeof dec.id === 'string' && dec.id.trim().length > 0, 'Decision missing id');
  assert.ok(!seenDecisionIds.has(dec.id), `Duplicate decision id: ${dec.id}`);
  seenDecisionIds.add(dec.id);
 }
 assert.equal(seenDecisionIds.size, 437);
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

 assert.equal(roots.length, 875);
 assert.equal(followups.length, 1966);

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

 assert.equal(deepChains, 559, 'Expected 559 multi-stage chains with depth >= 3');
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

test('Four major expansion packs validate strict trigger-target effects, depth>=3 chains, and zero silent no-ops', () => {
 const stubE = (id, category, title, description, trigger, choices) => ({ id, category, title, description, trigger, choices });
 const stubC = (label, cost, effects, next = null) => ({ label, cost, effects, ...(next ? { next } : {}) });
 const packs = [
  ['warDiplomacy', warDiplomacyEvents(stubE, stubC), 336],
  ['economyTrade', economyTradeEvents(stubE, stubC), 384],
  ['faithSociety', faithSocietyEvents(stubE, stubC), 300],
  ['culturesWorld', culturesWorldEvents(stubE, stubC), 288],
  ['ck2DlcEpic', ck2DlcEpicEvents(stubE, stubC), 338],
  ['ck2WorldCourt', ck2WorldCourtEvents(stubE, stubC), 334]
 ];

 for (const [name, pack, expectedLen] of packs) {
  assert.equal(pack.length, expectedLen, `Expected ${expectedLen} stages in ${name}`);
  const packById = new Map(pack.map(e => [e.id, e]));
  const roots = pack.filter(e => e.trigger !== 'followup');
  assert.ok(roots.length >= 60, `Expected >= 60 roots in ${name}, got ${roots.length}`);

  for (const root of roots) {
   const allowed = EXPANSION_TRIGGER_EFFECTS.get(root.trigger);
   assert.ok(allowed, `Missing EXPANSION_TRIGGER_EFFECTS entry for trigger "${root.trigger}" on ${root.id} (${name})`);

   let maxDepth = 1;
   const walk = (node, depth, stack) => {
    if (depth > maxDepth) maxDepth = depth;
    assert.ok(node.choices.length >= 2 && node.choices.length <= 4, `${node.id} should have 2-4 choices`);
    assert.equal(node.choices[node.choices.length - 1].cost, 0, `${node.id} must offer a free fallback option`);
    for (const ch of node.choices) {
     assert.ok(Object.keys(ch.effects).length > 0, `${node.id} choice "${ch.label}" must not have empty effects`);
     for (const k of Object.keys(ch.effects)) {
      assert.ok(allowed.has(k), `Effect "${k}" on ${node.id} does not execute on trigger "${root.trigger}"`);
     }
     if (ch.next) {
      assert.ok(!stack.has(ch.next), `Cycle in ${node.id} -> ${ch.next}`);
      const nextNode = packById.get(ch.next);
      assert.ok(nextNode, `Missing followup ${ch.next} in ${name}`);
      stack.add(ch.next);
      walk(nextNode, depth + 1, stack);
      stack.delete(ch.next);
     }
    }
   };
   walk(root, 1, new Set([root.id]));
   assert.ok(maxDepth >= 3, `Expected chain ${root.id} in ${name} to reach depth >= 3, got ${maxDepth}`);
  }
 }

 // Verify all 80 new mnd_c_* mandates have valid triggers and supported effect keys
 const newMandates = SOVEREIGN_MANDATES.filter(d => d.id.startsWith('mnd_c_'));
 assert.equal(newMandates.length, 80);
 for (const m of newMandates) {
  assert.ok(VALID_TRIGGERS.has(m.trigger), `Invalid mandate trigger ${m.trigger} on ${m.id}`);
  const allowed = EXPANSION_TRIGGER_EFFECTS.get(m.trigger);
  assert.ok(allowed, `Missing target-effect mapping for mandate trigger ${m.trigger}`);
  for (const [k, v] of Object.entries(m.effects)) {
   assert.ok(SUPPORTED_EFFECT_KEYS.has(k) && allowed.has(k), `Unsupported/no-op mandate effect ${k} on ${m.id}`);
   assert.ok(Number.isFinite(v));
  }
 }
});

test('Sample multi-stage chains across all 4 new packs resolve end-to-end and enforce regional locks', () => {
 const runs = [
  ['wd_log_oxen_1', 'a', { army: 'x' }, [0, 0, 0, 0]],
  ['wd_nav_harbor_chain_1', 'a', { other: 'b', army: 'x' }, [1, 1, 0]],
  ['et_guild_wool_staple_1', 'a', { province: 'p' }, [0, 0, 0]],
  ['et_plag_harbor_lazaretto_1', 'a', { province: 'p' }, [1, 0, 0]],
  ['fs_mon_relic_shrine_1', 'a', { province: 'p' }, [0, 0, 0]],
  ['fs_suc_coronation_oath_1', 'a', { actor: 'r', person: 'r', succession: 0 }, [0, 0, 0]],
  ['cw_reg_vijaya_anicut_1', 'vijayanagara', { province: 'p', region: 'vijayanagara' }, [0, 0, 0, 0]],
  ['cw_reg_ottoman_timar_1', 'ottomans', { province: 'p', region: 'ottomans' }, [0, 0, 0, 0]],
  ['cw_reg_ming_canal_1', 'ming', { province: 'p', region: 'ming' }, [0, 0, 0, 0]],
  ['cw_gov_republic_1', 'a', { province: 'p' }, [0, 0, 0, 0]],
  ['cw_xr_finance_annuities_1', 'a', { province: 'p' }, [0, 0, 0, 0]],
  ['epc_coronation_summons', 'a', { actor: 'r', person: 'r', succession: 0 }, [1, 0, 0]],
  ['ckw_council_favor', 'a', { actor: 'r', person: 'v' }, [0, 0, 0]],
  ['ckw_conclave_strike', 'a', { faction: 'f1' }, [0, 0, 0]]
 ];

 for (const [rootId, realm, target, choices] of runs) {
  const g = makeChainFixture(realm);
  g.chronicles.realms = { [realm]: { successionAt: 0 } };
  g.economy.crises.p = { kind: 'epidemic', severity: 40 };
  g.conflict.factions = { f1: { id: 'f1', realm, kind: 'liberty', status: 'organizing', pressure: 45, members: ['p'] } };
  g.expanded.realms[realm].active = { id: rootId, target, started: 0, expires: 9 };
  for (let step = 0; step < choices.length; step++) {
   const cur = currentExpandedEvent(g, realm);
   assert.ok(cur, `Expected active event at step ${step} of ${rootId}`);
   const res = expandedAction(g, TEST_WORLD, 'resolve', choices[step]);
   assert.ok(res.ok, `Failed resolving ${cur.id}: ${res.msg}`);
   const nextEv = g.expanded.realms[realm].active;
   if (step < choices.length - 1) {
    assert.ok(nextEv, `Expected followup after step ${step} of ${rootId}`);
    g.turn = nextEv.availableAt;
   } else {
    assert.equal(nextEv, null, `Expected ${rootId} to conclude cleanly`);
   }
  }
 }
});
