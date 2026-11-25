import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame, advanceMonth, recruit, restoreGame, snapshot } from '../src/simulation.js';
import { splitArmy } from '../src/military-systems.js';
import {
 initDeepSystems, joinSociety, startGreatWork, buildTradePost, declareCrusade, initCardinals
} from '../src/ck2-deep-systems.js';
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
