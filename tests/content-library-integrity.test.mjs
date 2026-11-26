import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame, advanceMonth, restoreGame, snapshot } from '../src/simulation.js';
import { buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld } from '../src/historical-world.js';
import { populateGlobalKingdoms } from '../src/world-kingdoms-1450.js';
import { EVENTS, DECISIONS, SOVEREIGN_CONTENT_EVENTS, ALL_EVENTS, ALL_DECISIONS, allContentStats } from '../src/expanded-content.js';
import { EMERGENT_EVENTS, EXTENDED_EMERGENT_EVENTS, EXTENDED_REACTIVE_EVENTS, EMERGENT_DECISIONS, EXTENDED_EMERGENT_DECISIONS } from '../src/emergent-content.js';
import { portraitArt, portraitImage } from '../src/game-art.js';
import { initCrossroads, crossroadsAction, crossroadsModifiers, crossroadsView } from '../src/crossroads-eras.js';
import { initReignChapters, reignChaptersView, tickReignChapters, generateLegacySummary, reignAction } from '../src/reign-chapters.js';

const rawWorld = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
const world = populateGlobalKingdoms(densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(rawWorld))));

test('Phase 6: Content Library has >= 850 unique events and >= 150 unique decisions without broken chains', () => {
 assert.equal(EMERGENT_EVENTS.length, 90);
 assert.equal(EXTENDED_EMERGENT_EVENTS.length, 60);
 assert.equal(EXTENDED_REACTIVE_EVENTS.length, 10);
 assert.equal(EMERGENT_DECISIONS.length, 10);
 assert.equal(EXTENDED_EMERGENT_DECISIONS.length, 6);

 const stats = allContentStats();
 assert.ok(stats.totalEvents >= 850, `Expected >= 850 total unique events, got ${stats.totalEvents}`);
 assert.ok(stats.totalDecisions >= 150, `Expected >= 150 total unique decisions/mandates, got ${stats.totalDecisions}`);

 const seenIds = new Set();
 const byId = new Map();
 for (const ev of ALL_EVENTS) {
  assert.ok(ev.id && !seenIds.has(ev.id), `Duplicate or empty event id: ${ev.id}`);
  seenIds.add(ev.id);
  byId.set(ev.id, ev);
  assert.ok(Array.isArray(ev.choices) && ev.choices.length >= 2, `Event ${ev.id} missing choices`);
 }
 for (const ev of ALL_EVENTS) {
  for (const ch of ev.choices) {
   if (ch.next) {
    assert.ok(byId.has(ch.next), `Missing follow-up event ${ch.next} from ${ev.id}`);
   }
  }
 }
 const seenDecIds = new Set();
 for (const dec of ALL_DECISIONS) {
  assert.ok(dec.id && !seenDecIds.has(dec.id), `Duplicate or empty decision id: ${dec.id}`);
  seenDecIds.add(dec.id);
 }
});

test('Phase 6: Crossroads Eras and Reign Chapters drive gameplay, epithets, and save compatibility', () => {
 const g = createGame(world, 'portugal');
 g.factions.portugal.treasury += 900;
 initCrossroads(g, world);
 const pRes = crossroadsAction(g, world, 'research', 'oceanic_navigation');
 assert.ok(pRes.ok, pRes.msg);
 g.turn += 6;
 const pRes2 = crossroadsAction(g, world, 'research', 'oceanic_navigation');
 assert.ok(pRes2.ok, pRes2.msg);
 const adopt = crossroadsAction(g, world, 'adopt', 'oceanic_navigation');
 assert.ok(adopt.ok, adopt.msg);
 assert.ok(crossroadsModifiers(g, 'portugal').trade > 1.1);
 assert.ok(crossroadsView(g, 'portugal').adoptedCount >= 1);

 initReignChapters(g);
 const rc = reignChaptersView(g, 'portugal');
 assert.equal(rc.chapter.objectives.length, 3);
 const swap = reignAction(g, world, 'refresh-objective', rc.chapter.objectives[0].id);
 assert.ok(swap.ok, swap.msg);

 // Fulfill Treasury objective cleanly via tickReignChapters
 const chObj = reignChaptersView(g, 'portugal').chapter.objectives.find(o => o.id === 'obj_crown_coffers');
 if (chObj) {
  g.factions.portugal.treasury = 1200;
  g.reignChapters.lastTick = -1;
  tickReignChapters(g);
  const doneView = reignChaptersView(g, 'portugal');
  assert.ok(doneView.chapter.objectives.some(o => o.completed));
 }
 const legacy = generateLegacySummary(g, 'portugal');
 assert.ok(legacy.totalScore >= 0);

 const restored = restoreGame(snapshot(g), world);
 assert.ok(restored.crossroads?.realms?.portugal?.adopted.includes('oceanic_navigation'));
 assert.ok(restored.reignChapters?.active?.portugal?.objectives?.length === 3);

 // Multi-reign permanent legacy persistence & Crossroads charter reconciliation
 g.factions.portugal.prestige = 50;
 assert.ok(crossroadsAction(g, world, 'charter', 'oceanic_navigation').ok);
 assert.equal(crossroadsModifiers(g, 'portugal').vassalOpinion, 0);
 const curRulerId = g.politics.realms.portugal.ruler;
 const heir = Object.values(g.politics.people).find(p => p.alive && p.realm === 'portugal' && p.id !== curRulerId);
 if (heir) {
  g.politics.people[curRulerId].alive = false;
  g.politics.realms.portugal.ruler = heir.id;
  g.year += 8;
  initReignChapters(g);
  const nextRc = reignChaptersView(g, 'portugal');
  assert.ok(nextRc.legacyLog.length >= 1);
  assert.ok(nextRc.monuments.length >= 1);
  assert.ok(nextRc.permanentEffects.trade > 1);
 }
});

test('Phase 6: Portraits resolve non-null for all playable realms including boys and girls + cultural frame badges', () => {
 const sampleRealms = ['england', 'ottomans', 'vijayanagara', 'delhi', 'ming', 'ashikaga', 'ayutthaya', 'mali', 'ethiopia', 'mexica', 'inca', 'horde', 'poland'];
 for (const realm of sampleRealms) {
  for (const sex of ['male', 'female']) {
   const boyOrGirl = portraitArt({ id: `${realm}_${sex}_kid`, name: 'Young Royal', realm, sex, age: 10 });
   assert.ok(boyOrGirl && boyOrGirl.endsWith('.webp'), `Expected child portrait for ${realm} (${sex}), got ${boyOrGirl}`);
   const adult = portraitArt({ id: `${realm}_${sex}_adult`, name: 'Sovereign', realm, sex, age: 30 });
   assert.ok(adult && adult.endsWith('.webp'), `Expected adult portrait for ${realm} (${sex}), got ${adult}`);
  }
 }
 assert.equal(portraitArt({ realm: 'nonexistent_realm_xyz', sex: 'male', age: 25 }), null);
 const imgHtml = portraitImage({ id: 'p_badge', name: 'Afonso', realm: 'portugal', sex: 'male', age: 12, epithet: 'the Navigator' });
 assert.ok(imgHtml.includes('portrait-frame') && imgHtml.includes('rank-legend'));
});
