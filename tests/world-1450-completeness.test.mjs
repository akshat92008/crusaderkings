import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld, worldForSave } from '../src/historical-world.js';
import { populateGlobalKingdoms, GLOBAL_MAP_VERSION, verifyAtlasIntegrity } from '../src/world-kingdoms-1450.js';
import { createGame, advanceMonth, snapshot, restoreGame } from '../src/simulation.js';
import { portraitArt } from '../src/game-art.js';

const legacy = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
const polities = JSON.parse(fs.readFileSync(new URL('../data/historical-polities-1450.json', import.meta.url), 'utf8'));

test('Phase 3 Global 1450 World reaches 900+ districts, 110+ kingdoms, and <15% independents with full integrity', () => {
  const t0 = Date.now();
  const v2 = buildHistoricalWorld(legacy, polities);
  const v3 = expandHistoricalWorld(v2);
  const v4 = densifyHistoricalWorld(v3);
  const v5 = populateGlobalKingdoms(v4);
  const elapsed = Date.now() - t0;

  assert.equal(v5.meta.mapVersion, GLOBAL_MAP_VERSION);
  assert.ok(elapsed < 4000, `World build should stay fast, took ${elapsed}ms`);
  assert.ok(v5.provinces.length >= 900, `Expected >=900 districts, got ${v5.provinces.length}`);
  assert.ok(v5.factions.length >= 110, `Expected >=110 named realms, got ${v5.factions.length}`);

  const indCount = v5.provinces.filter(p => p.owner === 'independent').length;
  const indRatio = indCount / v5.provinces.length;
  assert.ok(indRatio < 0.15, `Independent districts must be <15%, got ${indCount}/${v5.provinces.length} (${(indRatio * 100).toFixed(1)}%)`);

  assert.equal(new Set(v5.provinces.map(p => p.name)).size, v5.provinces.length, 'Every district must have a unique name');
  const integrity = verifyAtlasIntegrity(v5);
  assert.equal(integrity.ok, true, `Atlas integrity failed: ${integrity.errors.slice(0, 5).join('; ')}`);

  // Verify portrait coverage even for child/elder in new kingdoms
  assert.ok(portraitArt({ id: 'c1', realm: 'orissa', sex: 'female', age: 10 }));
  assert.ok(portraitArt({ id: 'c2', realm: 'mutapa', sex: 'male', age: 55 }));

  // Verify simulation boot, advance, save & v5 world selection
  const g = createGame(v5, 'ottomans');
  assert.equal(Object.keys(g.provinces).length, v5.provinces.length);
  for (let i = 0; i < 6; i++) advanceMonth(g, v5);
  const raw = snapshot(g);
  assert.equal(worldForSave(raw, legacy, v2, v3, v4, v5), v5);
  const reloaded = restoreGame(raw, v5);
  assert.equal(reloaded.turn, 6);
  assert.equal(Object.keys(reloaded.politics.realms).length, v5.factions.length);
});
