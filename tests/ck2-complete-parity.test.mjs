import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame, advanceMonth, recruit, restoreGame, snapshot } from '../src/simulation.js';
import { splitArmy } from '../src/military-systems.js';
import {
 initDeepSystems, joinSociety, startGreatWork, buildTradePost, declareCrusade, initCardinals, spreadEpidemics
} from '../src/ck2-deep-systems.js';
import { recordGrievance, tickAgency } from '../src/character-agency.js';
import { claimantCandidates } from '../src/feudal-systems.js';
import { evaluateWarViability, strategicTargetScore } from '../src/strategic-ai.js';
import {
 EMERGENT_EVENTS, EMERGENT_DECISIONS, EXTENDED_EMERGENT_EVENTS, EXTENDED_REACTIVE_EVENTS,
 EXTENDED_EMERGENT_DECISIONS, allEmergentEventCount, allEmergentDecisionCount,
 reactiveEmergentCandidates, extendedEmergentDecisions
} from '../src/emergent-content.js';
import { expandedAction } from '../src/expanded-content.js';

const world = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('100% CK2 Parity: zero repeated names or ugly placeholder IDs across world & timeline', () => {
 const g = createGame(world, 'ottomans');
 const peopleNames = Object.values(g.politics.people).map(p => p.name);
 assert.equal(new Set(peopleNames).size, peopleNames.length, 'Every starting character in g.politics.people must have a unique full name');

 for (const p of Object.values(g.politics.people)) {
  assert.ok(!/\bc\d+$/i.test(p.name), `Found raw id suffix in name: ${p.name}`);
  assert.ok(!/^House of P\d+$/i.test(p.house), `Found raw province ID house: ${p.house}`);
  assert.ok(!/consorts$/i.test(p.house), `Found ugly consort suffix in house: ${p.house}`);
 }

 for (const c of Object.values(g.kingdom.courts)) {
  assert.ok(c.dynasty.startsWith('House of '), `Court dynasty should retain House of prefix: ${c.dynasty}`);
 }

 const indNames = Object.values(g.independentPolities).map(pol => pol.ruler.name);
 assert.equal(new Set(indNames).size, indNames.length, 'Independent polity rulers must have unique names');

 const curiaNames = (g.deepSystems.curia?.cardinals || g.deepSystems.cardinals?.seats || []).map(s => s.name);
 assert.ok(curiaNames.length >= 9);
 assert.equal(new Set(curiaNames).size, curiaNames.length, 'Cardinals must have unique names');
 for (const cn of curiaNames) {
  assert.ok(!cn.startsWith('Cardinal Prelate'), `Placeholder cardinal name found: ${cn}`);
 }

 const cmdNames = Object.values(g.armies).map(a => a.commander);
 assert.equal(new Set(cmdNames).size, cmdNames.length, 'Starting commanders must have unique names');
 for (const cn of cmdNames) {
  assert.ok(cn && cn !== 'Newly appointed general', `Placeholder commander found: ${cn}`);
 }

 // Advance 36 months (births, new councilors, AI armies, successions)
 for (let i = 0; i < 36; i++) advanceMonth(g, world);

 const livingNamesAfter = Object.values(g.politics.people).filter(p => p.alive).map(p => p.name);
 assert.equal(new Set(livingNamesAfter).size, livingNamesAfter.length, 'Living characters after 3 years must stay uniquely named');

 // Test army recruitment + split allocate unique commanders, even after restoreGame()
 const restored = restoreGame(snapshot(g), world);
 const ownProv = Object.values(restored.provinces).find(p => p.owner === restored.player && !Object.values(restored.armies).some(a => a.province === p.id && a.owner === restored.player));
 if (ownProv) {
  restored.factions[restored.player].treasury += 500;
  const rRes = recruit(restored, ownProv.id, 'infantry', 40);
  assert.ok(rRes.ok);
  const newArmy = Object.values(restored.armies).find(a => a.owner === restored.player && a.province === ownProv.id);
  assert.ok(newArmy?.commander && newArmy.commander !== 'Newly appointed general');
  assert.ok(!cmdNames.includes(newArmy.commander), 'Post-restore commander should remain unique');
 }
 const mainArmy = Object.values(restored.armies).find(a => a.owner === restored.player && (a.infantry + a.archers + a.cavalry) >= 60);
 if (mainArmy) {
  const sRes = splitArmy(restored, mainArmy.id, 0.5);
  assert.ok(sRes.ok);
  const detached = Object.values(restored.armies).find(a => a.owner === restored.player && a.id !== mainArmy.id && a.province === mainArmy.province);
  assert.ok(detached?.commander && detached.commander !== 'Detached commander');
 }
});

test('100% CK2 Parity: extended emergent events, reactive conditions, and decisions preserve baseline invariants', () => {
 assert.equal(allEmergentEventCount(), 90);
 assert.equal(allEmergentDecisionCount(), 10);
 assert.equal(EMERGENT_EVENTS.length, 90);
 assert.equal(EMERGENT_DECISIONS.length, 10);
 assert.equal(EXTENDED_EMERGENT_EVENTS.length, 60);
 assert.equal(EXTENDED_REACTIVE_EVENTS.length, 10);
 assert.equal(EXTENDED_EMERGENT_DECISIONS.length, 6);

 const allIds = new Set();
 for (const ev of [...EMERGENT_EVENTS, ...EXTENDED_EMERGENT_EVENTS, ...EXTENDED_REACTIVE_EVENTS]) {
  assert.ok(!allIds.has(ev.id), `Duplicate emergent event id ${ev.id}`);
  allIds.add(ev.id);
  assert.equal(ev.choices.length, 2, `Event ${ev.id} must have 2 choices`);
  for (const ch of ev.choices) {
   if (ch.next) {
    assert.ok(
     EXTENDED_EMERGENT_EVENTS.some(x => x.id === ch.next) || EMERGENT_EVENTS.some(x => x.id === ch.next),
     `Missing followup ${ch.next} for ${ev.id}`
    );
   }
  }
 }

 const g = createGame(world, 'france');
 g.factions.france.treasury = 3000;
 const frProv = Object.values(g.provinces).find(p => p.owner === 'france').id;
 joinSociety(g, 'hermetic_society', g.politics.realms.france.ruler);
 startGreatWork(g, frProv, 'royal_palace', 'france');
 buildTradePost(g, frProv, 'france');
 g.politics.people[g.politics.realms.france.ruler].civic.stress = 70;
 declareCrusade(g, 'ottomans', 'france');

 const reactiveIds = reactiveEmergentCandidates(g, 'france').map(e => e.id);
 assert.ok(reactiveIds.includes('em_ext_react_society'));
 assert.ok(reactiveIds.includes('em_ext_react_great_work'));
 assert.ok(reactiveIds.includes('em_ext_react_silk_road'));
 assert.ok(reactiveIds.includes('em_ext_react_stressed_ruler'));
 assert.ok(reactiveIds.includes('em_ext_react_crusade'));

 const extDecs = extendedEmergentDecisions(g, world, 'france');
 assert.equal(extDecs.length, 6);
 const res = expandedAction(g, world, 'decision', 'em_ext_dec_hospital_infirmary');
 assert.ok(res.ok, res.msg);
 const afterDecs = extendedEmergentDecisions(g, world, 'france');
 assert.equal(afterDecs.find(d => d.id === 'em_ext_dec_hospital_infirmary').ready, false);
});

test('100% CK2 Parity: AI deep autonomy, Papal Conclave succession, and deterministic simulation', () => {
 const g1 = createGame(world, 'ottomans');
 const g2 = createGame(world, 'ottomans');

 // Wealth injection to exercise Great Works, Trade Posts, Schools, Coronations
 for (const f of Object.values(g1.factions)) {
  if (f.id !== 'independent') f.treasury = Math.max(f.treasury, 1600);
 }
 for (const f of Object.values(g2.factions)) {
  if (f.id !== 'independent') f.treasury = Math.max(f.treasury, 1600);
 }

 for (let i = 0; i < 12; i++) {
  advanceMonth(g1, world);
  advanceMonth(g2, world);
 }
 assert.equal(snapshot(g1), snapshot(g2), 'Simulation across 12 months with deep AI autonomy must remain bit-exact deterministic');

 const ds = g1.deepSystems;
 assert.ok(Object.keys(ds.societies.memberships).length >= 15, 'AI rulers should join societies autonomously');
 assert.ok(Object.keys(ds.coronations).length >= 10, 'AI rulers should hold coronations autonomously');
 assert.ok(Object.keys(ds.religiousSchools).length >= 10, 'AI rulers should adopt religious schools autonomously');
 assert.ok(Object.keys(ds.tradePosts).length >= 3, 'AI realms should construct trade posts');
 assert.ok(Object.keys(ds.greatWorks).length >= 1, 'Wealthy AI realms should begin Great Works');

 // Papal Conclave aging & election
 const col = initCardinals(g1);
 const originalPope = col.pope.name;
 col.pope.age = 75;
 let elected = false;
 for (let m = 0; m < 120; m++) {
  advanceMonth(g1, world);
  if (g1.deepSystems.cardinals.pope.name !== originalPope) {
   elected = true;
   break;
  }
 }
 assert.ok(elected, 'Papal Conclave should elect a successor Pope with a unique name');
});

test('100% CK2 Parity: cross-generational vendettas & ambitious uncle claimant crises', () => {
 const g = createGame(world, 'england');
 const p = g.politics;
 const kingId = p.realms.england.ruler;
 const king = p.people[kingId];

 // 1) Cross-generational blood feud from severe permanent grievance
 const holdingEntry = Object.entries(p.holdings).find(([id, h]) => h.realm === 'england' && h.lord !== kingId);
 assert.ok(holdingEntry, 'England should have a landed vassal holding');
 const [provId, holding] = holdingEntry;
 const duke = p.people[holding.lord];
 duke.age = 95;
 duke.spouse = duke.spouse || Object.values(p.people).find(x => x.alive && x.realm === 'england' && x.sex !== duke.sex && x.id !== kingId)?.id || null;
 const heir = Object.values(p.people).find(x => x.alive && x.realm === 'england' && x.id !== duke.id && x.id !== kingId && (duke.children || []).includes(x.id))
  || Object.assign(p.people[Object.keys(p.people).find(id => id !== kingId && id !== duke.id && p.people[id].realm === 'england' && p.people[id].alive)], { parents: [duke.id], children: [] });
 if (!duke.children.includes(heir.id)) duke.children.push(heir.id);
 heir.house = duke.house;
 heir.age = 24;
 recordGrievance(g, duke.id, kingId, 'executed kin', 60, { permanent: true });
 g.turn = 11; // advanceMonth increments to turn 12 (annual tick)
 advanceMonth(g, world);
 assert.equal(duke.alive, false, 'Aged 95 duke should die on annual mortality tick');
 assert.ok((heir.grievances || []).some(gr => gr.against === kingId && gr.severity >= 35 && gr.permanent), 'Estate heir must inherit permanent blood feud grievance');

 // 2) Ambitious uncle vs minor child heir on succession
 const g2 = createGame(world, 'france');
 const rId = g2.politics.realms.france.ruler;
 const ruler = g2.politics.people[rId];
 ruler.age = 95;
 const minorChild = Object.values(g2.politics.people).find(x => x.alive && x.realm === 'france' && x.id !== rId && !x.parents?.includes(rId));
 assert.ok(minorChild);
 minorChild.age = 9;
 minorChild.sex = 'male';
 minorChild.house = ruler.house;
 minorChild.parents = [rId];
 ruler.children = [minorChild.id];
 g2.politics.realms.france.heir = minorChild.id;
 const uncle = Object.values(g2.politics.people).find(x => x.alive && x.realm === 'france' && x.id !== rId && x.id !== minorChild.id && x.age >= 22);
 assert.ok(uncle);
 uncle.house = ruler.house;
 uncle.traits = [...new Set([...(uncle.traits || []), 'ambitious'])];
 uncle.personality = { ...(uncle.personality || {}), boldness: 85, greed: 75 };
 g2.turn = 11; // advanceMonth increments to turn 12 (annual tick)
 advanceMonth(g2, world);
 assert.equal(g2.politics.realms.france.ruler, minorChild.id, 'Child heir should inherit throne');
 assert.ok(g2.politics.realms.france.claimantCrisis?.active, 'Child succession with ambitious kin should open claimant crisis');
 assert.ok(claimantCandidates(g2, 'france').some(c => c.person === uncle.id), 'Ambitious adult uncle must gain weak claim during child succession');

 // Verify claimant uncle rallies disaffected noble via tickAgency
 const disloyalHolding = Object.values(g2.politics.holdings).find(h => h.realm === 'france' && h.lord !== minorChild.id && h.lord !== uncle.id);
 if (disloyalHolding) disloyalHolding.loyalty = 25;
 g2.turn += 6;
 for (let step = 0; step < 6; step++) {
  g2.turn++;
  tickAgency(g2);
 }
 assert.ok(
  Object.values(g2.conflict?.factions || {}).some(fx => fx.realm === 'france' && fx.kind === 'claimant' && fx.claimant === uncle.id),
  'Ambitious claimant uncle should launch/back a claimant faction in tickAgency'
 );
});

test('100% CK2 Parity: geopolitical AI crisis targeting, civil war guard, and epidemic fallout', () => {
 const g = createGame(world, 'ottomans');
 const attackerArmy = Object.values(g.armies).find(a => a.owner === 'ottomans');
 assert.ok(attackerArmy);
 const targetProv = world.provinces.find(p => g.provinces[p.id]?.owner && g.provinces[p.id].owner !== 'ottomans' && g.politics.realms[g.provinces[p.id].owner]);
 assert.ok(targetProv);
 const targetRealm = g.provinces[targetProv.id].owner;
 const scoreBaseline = strategicTargetScore(g, world, attackerArmy, targetProv);
 g.politics.realms[targetRealm].claimantCrisis = { active: true, started: g.turn, until: g.turn + 12 };
 const scoreCrisis = strategicTargetScore(g, world, attackerArmy, targetProv);
 assert.ok(scoreCrisis > scoreBaseline, 'Strategic AI must score collapsing/crisis neighbors significantly higher');

 // Civil war guard in evaluateWarViability
 g.factions.ottomans.treasury = 2500;
 g.conflict.factions.cwTest = { id: 'cwTest', realm: 'ottomans', kind: 'liberty', status: 'civil war' };
 const cwCheck = evaluateWarViability(g, world, 'ottomans', targetRealm);
 assert.equal(cwCheck.viable, false, 'Realm actively fighting a civil war cannot start opportunistic external offensive wars');
 delete g.conflict.factions.cwTest;

 // Severe non-isolated epidemic creates provincial unrest & health severity
 const frCap = g.politics.realms.france.capital || Object.keys(g.provinces).find(id => g.provinces[id].owner === 'france');
 g.economy ??= { provinces: {}, crises: {} };
 g.economy.crises[frCap] = { province: frCap, kind: 'epidemic', severity: 72, started: g.turn, remaining: 8, reliefTurn: -12 };
 const beforeUnrest = g.provinces[frCap].unrest || 0;
 let totalInfected = 0;
 for (let t = 0; t < 4; t++) {
  g.turn++;
  const res = spreadEpidemics(g, world);
  totalInfected += res.infected.length;
 }
 assert.ok((g.provinces[frCap].unrest || 0) > beforeUnrest, 'Severe non-isolated epidemic should raise provincial unrest');
 assert.ok(totalInfected > 0 || Object.keys(g.living?.health || {}).length > 0, 'Severe non-isolated epidemic should sicken exposed courtiers/rulers');
});
