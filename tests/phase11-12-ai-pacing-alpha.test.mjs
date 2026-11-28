import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame, advanceMonth, snapshot, restoreGame } from '../src/simulation.js';
import { evaluateWarViability } from '../src/strategic-ai.js';
import { EVENTS, SOVEREIGN_CONTENT_EVENTS, classifyEventTier, featuredStartsCatalog } from '../src/expanded-content.js';
import { openHometown } from '../src/hometown.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

test('Phase 11: AI attack cooldown blocks instant war loops and 50-year (600-month) world simulation stays finite & balanced', () => {
  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  g.strategy ??= { version: 1, plans: {}, pacts: {}, history: [], lessons: {}, abandoned: [], lastWarDeclared: {}, lastTick: -1 };
  g.strategy.lastWarDeclared.ming = g.turn;
  const cdCheck = evaluateWarViability(g, world, 'ming', 'joseon');
  assert.equal(cdCheck.viable, false);
  assert.ok(cdCheck.reason.toLowerCase().includes('cooldown'));

  for (let m = 0; m < 600; m++) advanceMonth(g, world);
  assert.equal(g.turn, 600);
  let largestRealm = 0;
  for (const [fid, f] of Object.entries(g.factions)) {
    assert.ok(Number.isFinite(f.treasury), `NaN treasury for ${fid}`);
    assert.ok(Number.isFinite(f.stability), `NaN stability for ${fid}`);
    const owned = Object.values(g.provinces).filter(p => p.owner === fid).length;
    if (fid !== 'independent' && owned > largestRealm) largestRealm = owned;
  }
  assert.ok(largestRealm < 450, `Expected anti-snowball resistance over 50 years, largest realm owns ${largestRealm}`);
});

test('Phase 12: all events map into 3 pacing tiers, curated featured starts exist, and Alpha round-trip passes', () => {
  const all = [...EVENTS, ...SOVEREIGN_CONTENT_EVENTS];
  const counts = { critical: 0, important: 0, chronicle: 0 };
  for (const ev of all) {
    const t = classifyEventTier(ev);
    assert.ok(t === 'critical' || t === 'important' || t === 'chronicle');
    counts[t]++;
  }
  assert.ok(counts.critical > 0 && counts.important > 0 && counts.chronicle > 0, JSON.stringify(counts));

  const starts = featuredStartsCatalog();
  assert.equal(starts.length, 8);
  const fids = new Set(world.factions.map(f => f.id));
  for (const s of starts) assert.ok(fids.has(s.id), `Missing featured start ${s.id} in world.json`);

  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  openHometown(g, world);
  for (let m = 0; m < 12; m++) advanceMonth(g, world);
  const restored = restoreGame(snapshot(g), world);
  assert.equal(restored.turn, 12);
  assert.equal(restored.player, 'vijayanagara');
});
