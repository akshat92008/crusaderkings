import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame } from '../src/simulation.js';
import { CampaignAudio } from '../src/field-audio.js';
import { campaignGuide } from '../src/interface-experience.js';
import { buildMonthlyDispatch } from '../src/dispatch-ui.js';
import { featuredStartsCatalog } from '../src/expanded-content.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

test('Phase 15: CampaignAudio supports 4 independent volume buses (master, music, sfx, ambience)', () => {
  const audio = new CampaignAudio(() => null, { muted: false, mode: 'peace' });
  const initial = audio.getBusVolumes();
  assert.deepEqual(Object.keys(initial).sort(), ['ambience', 'master', 'music', 'sfx']);
  assert.equal(audio.setBusVolume('music', 0.4), true);
  assert.equal(audio.setBusVolume('sfx', 0.8), true);
  assert.equal(audio.setBusVolume('ambience', 0.25), true);
  assert.equal(audio.setBusVolume('master', 0.7), true);
  assert.equal(audio.setBusVolume('unknown', 0.5), false);
  assert.deepEqual(audio.getBusVolumes(), { master: 0.7, music: 0.4, sfx: 0.8, ambience: 0.25 });
  audio.close();
});

test('Phase 16: Vijayanagara flagship onboarding guide & Dispatch cards stay capped at <= 4 priorities', () => {
  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  const stats = { balance: 15, foodDelta: 4, upkeep: 40, provinces: 5 };
  const guide = campaignGuide(g, stats);
  assert.ok(guide.length >= 6);
  assert.ok(guide.some(s => s.label.includes('Karnata Flagship')));

  // Simulate multiple overlapping alerts to verify hard Dispatch cap
  g.factions.vijayanagara.treasury = -50;
  g.factions.vijayanagara.food = 10;
  g.factions.vijayanagara.stability = 30;
  g.kingdom.threats = [{ by: 'bahmani', province: 'raichur', eta: 1, status: 'ready' }];
  const cards = buildMonthlyDispatch(g, world, { pendingEvents: 2 });
  assert.ok(cards.length <= 4, `Dispatch exceeded 4 card limit: ${cards.length}`);
  assert.ok(featuredStartsCatalog()[0].id === 'vijayanagara');
});
