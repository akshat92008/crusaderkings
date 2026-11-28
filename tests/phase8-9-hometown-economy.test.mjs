import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame } from '../src/simulation.js';
import { openHometown, TOWN_VISUAL_TIERS, townVisualTier, stewardAdvice } from '../src/hometown.js';
import { landscape, ambientTown } from '../src/hometown-scene.js';
import { renderHometown } from '../src/hometown-ui.js';
import { renderEconomy } from '../src/kingdom-ui.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

test('Phase 8: 5 architectural tiers span all 10 Town Hall levels and update scene & ambient life', () => {
  assert.equal(TOWN_VISUAL_TIERS.length, 5);
  assert.equal(townVisualTier(1).tier, 1);
  assert.equal(townVisualTier(4).tier, 2);
  assert.equal(townVisualTier(6).tier, 3);
  assert.equal(townVisualTier(8).tier, 4);
  assert.equal(townVisualTier(10).tier, 5);

  const l1 = landscape(1, {});
  const l9 = landscape(9, {});
  assert.ok(l1.includes('ht-tier-1'));
  assert.ok(l9.includes('ht-tier-5'));
  assert.ok(ambientTown(9, true).includes('person-d') && ambientTown(9, true).includes('fx_build_puff'));
});

test('Phase 8-9: Steward shortage advice computes exhaustion months & actionable fixes cleanly in Hometown and Economy UI', () => {
  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  openHometown(g, world);
  // Create a genuine military food deficit so Steward warns with months-left forecast
  g.factions.vijayanagara.food = 100;
  const firstArmy = Object.values(g.armies).find(a => a.owner === 'vijayanagara');
  if (firstArmy) firstArmy.infantry += 8000;
  const adv = stewardAdvice(g, world, 'vijayanagara');
  const foodWarn = adv.find(a => a.id === 'food_deficit');
  assert.ok(foodWarn, 'Expected food_deficit advice under heavy army consumption');
  assert.ok(foodWarn.detail.includes('months'), 'Expected months countdown in shortage advice');

  const esc = s => String(s ?? '');
  const ecoHtml = renderEconomy(g, world, esc);
  assert.ok(ecoHtml.includes('STEWARD SHORTAGE &amp; WAR LEDGER') || ecoHtml.includes('STEWARD SHORTAGE & WAR LEDGER'));

  // Mock minimal root node for renderHometown SSR verification
  const mockRoot = {
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => []
  };
  renderHometown(g, world, mockRoot);
  assert.ok(mockRoot.innerHTML.includes('Steward Shortage'));
  assert.ok(mockRoot.innerHTML.includes('Tier I'));
});
