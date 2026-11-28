import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame, advanceMonth } from '../src/simulation.js';
import { councilorAgenda, delegateCouncilTasks, councilTaskAction, tickCouncilTasks } from '../src/council-tasks.js';
import { successionCandidates } from '../src/succession-systems.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

test('Phase 10: councilor agendas distinguish devoted vs self-serving ministers and siphon tax cleanly', () => {
  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  const stewardId = g.politics.realms.vijayanagara.council.steward;
  const steward = g.politics.people[stewardId];
  assert.ok(steward);
  steward.traits = ['greedy', 'deceitful'];
  steward.personality = { ...(steward.personality || {}), greed: 65, honor: -30, diligence: 0 };
  steward.wealth = 50;

  const ag = councilorAgenda(g, 'vijayanagara', 'steward');
  assert.equal(ag.stance, 'self_serving');
  assert.ok(ag.siphonPct > 0);

  const capProv = Object.keys(g.provinces).find(id => g.provinces[id].owner === 'vijayanagara');
  const startRes = councilTaskAction(g, 'steward', 'collect', capProv);
  assert.equal(startRes.ok, true);
  g.councilTasks.realms.vijayanagara.steward.progress = 100;
  tickCouncilTasks(g);
  assert.ok(steward.wealth > 50, 'Self-serving steward should skim gold into personal wealth');
});

test('Phase 10: council auto-delegation assigns idle ministers and succession laws skip imprisoned candidates', () => {
  const g = createGame(world, 'france', { difficulty: 'normal' });
  g.factions.france.treasury = 900;
  const tog = councilTaskAction(g, 'delegate', 'toggle');
  assert.equal(tog.ok, true);
  assert.equal(g.councilTasks.delegated.france, true);
  const activeCount = Object.keys(g.councilTasks.realms.france || {}).length;
  assert.ok(activeCount >= 1, 'Council auto-delegation should dispatch idle ministers');

  const candsBefore = successionCandidates(g, 'france');
  if (candsBefore.length >= 2) {
    const firstId = candsBefore[0].id;
    g.feudal ??= {};
    g.feudal.prisoners ??= {};
    g.feudal.prisoners[firstId] = { status: 'held' };
    const candsAfter = successionCandidates(g, 'france');
    assert.ok(!candsAfter.some(c => c.id === firstId), 'Imprisoned candidate must be excluded from succession order');
  }
  for (let i = 0; i < 6; i++) advanceMonth(g, world);
  assert.ok(g.politics.people[g.politics.realms.france.ruler]?.alive);
});
