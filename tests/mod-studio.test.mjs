import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame, restoreGame, snapshot } from '../src/simulation.js';
import { buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld } from '../src/historical-world.js';
import { populateGlobalKingdoms } from '../src/world-kingdoms-1450.js';
import { validateModPack, applyModPack, removeModPack, listAppliedMods, exportModTemplate } from '../src/mod-loader.js';
import { expandedDecisions, initExpanded, tickExpanded, currentExpandedEvent, expandedAction } from '../src/expanded-content.js';
import { saveModPacksDurable, loadModPacksDurable } from '../src/mobile-storage.js';

const rawWorld = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
const world = populateGlobalKingdoms(densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(rawWorld))));

test('Phase 7 Mod Studio: creates brand-new kingdoms, characters, traits, religions, and start year 400-2000', () => {
 const g = createGame(world, 'england');
 const sampleProv = world.provinces.find(p => g.provinces[p.id]?.owner && g.provinces[p.id].owner !== 'england')?.id;
 assert.ok(sampleProv);

 const customPack = {
  id: 'custom_valois_atlantis',
  name: 'Neo-Avalon Expansion',
  version: '2.0.0',
  startYear: 1848,
  kingdoms: [{
   id: 'avalon',
   name: 'Commonwealth of Avalon',
   color: '#2266aa',
   government: 'republic',
   culture: 'Avalonian',
   faith: 'Solar Humanism',
   provinceIds: [sampleProv],
   rulerName: 'Consul Arthur Pendragon'
  }],
  characters: [{
   id: 'mod_merlin',
   name: 'Magister Myrddin',
   house: 'House of Caer',
   realm: 'avalon',
   age: 44,
   sex: 'male',
   skills: { diplomacy: 4, martial: 2, stewardship: 4, intrigue: 4, learning: 5 },
   traits: ['diligent']
  }],
  traits: [{ id: 'mod_sage', name: 'Sage of the Tower', category: 'education', prestigeMonthly: 0.4 }],
  religions: [{ id: 'solar_humanism', name: 'Solar Humanism', family: 'Humanism', levy: 1.05, tax: 1.1 }],
  customDecisions: [{
   id: 'mod_avalon_charter',
   category: 'Mod',
   title: 'Charter the Obsidian Council',
   description: 'Custom decision from mod pack.',
   cost: 50,
   effects: { prestige: 12 },
   cooldown: 6
  }],
  customEvents: [{
   id: 'mod_obsidian_comet',
   category: 'Mod',
   title: 'Silver Comet Over Avalon',
   description: 'Astrologers debate the portent.',
   trigger: 'land',
   choices: [
    { label: 'Record good omen', cost: 25, effects: { stability: 6, prestige: 8 } },
    { label: 'Ignore rumors', cost: 0, effects: { gold: 15 } }
   ]
  }]
 };

 const validated = validateModPack(customPack);
 assert.equal(validated.startYear, 1848);
 const res = applyModPack(g, world, customPack);
 assert.equal(res.ok, true);
 assert.equal(g.year, 1848);
 assert.equal(g.factions.avalon.name, 'Commonwealth of Avalon');
 assert.equal(g.provinces[sampleProv].owner, 'avalon');
 assert.equal(g.politics.people.mod_merlin.name, 'Magister Myrddin');
 assert.ok(g.mods.customTraits.mod_sage);
 assert.ok(g.identity.faithDefinitions['Solar Humanism']);
 assert.ok(expandedDecisions(g, world, 'england').some(d => d.id === 'mod_avalon_charter'));

 // Verify declarative JSON custom event actually loads and resolves cleanly in gameplay loop!
 initExpanded(g);
 g.expanded.realms.england.active = { id: 'mod_obsidian_comet', target: { province: Object.keys(g.provinces).find(id => g.provinces[id].owner === 'england') }, started: g.turn, expires: g.turn + 9 };
 assert.equal(currentExpandedEvent(g, 'england').title, 'Silver Comet Over Avalon');
 assert.ok(expandedAction(g, world, 'resolve', 0).ok);

 // Verify save/restore + removal
 const restored = restoreGame(snapshot(g), world);
 assert.equal(restored.factions.avalon.name, 'Commonwealth of Avalon');
 assert.equal(listAppliedMods(restored).length, 1);

 const rm = removeModPack(restored, 'custom_valois_atlantis');
 assert.equal(rm.ok, true);
 assert.equal(listAppliedMods(restored).length, 0);
 assert.ok(!restored.mods.customEvents.some(e => e.id === 'mod_obsidian_comet'));
});

test('Phase 7 Mod Studio: rejects out-of-range years and persists packs via mobile-storage fallback', async () => {
 assert.throws(() => validateModPack({ id: 'too_old', name: 'Ancient', startYear: 100 }), /400 and 2000/);
 assert.throws(() => validateModPack({ id: 'too_new', name: 'Future', startYear: 2500 }), /400 and 2000/);

 const memStore = {};
 const storage = {
  getItem: k => (k in memStore ? memStore[k] : null),
  setItem: (k, v) => { memStore[k] = String(v); }
 };
 const packs = [exportModTemplate()];
 await saveModPacksDurable(packs, { idb: null, storage });
 const loaded = await loadModPacksDurable({ idb: null, storage });
 assert.equal(loaded.length, 1);
 assert.equal(loaded[0].id, 'angevin_pack');
});
