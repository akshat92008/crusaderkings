import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiegeState, siegeDamage, siegeBreached, siegeCorridorBreached, applyFortDamage } from '../src/military-systems.js';
import { stepCardBattle } from '../src/simple-card-battle.js';
import { openHometown, homeCapitalLayout } from '../src/hometown.js';
import { createGame } from '../src/simulation.js';
import { readFileSync } from 'node:fs';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

test('Phase 7: breached flanking tower opens traversable assault corridor into courtyard', () => {
  const siege = createSiegeState(2, false);
  assert.equal(siegeCorridorBreached(siege, -24), false);
  siegeDamage(siege, 'left', 999);
  assert.equal(siege.structures[1].hp, 0);
  assert.equal(siegeBreached(siege), false);
  assert.equal(siegeCorridorBreached(siege, -24), true);

  const flanker = {
    id: 'a_flank', side: 'attacker', type: 'infantry', kind: 'infantry',
    troopCount: 180, life: 100, initialLife: 100, morale: 90,
    damage: 14, armor: 1.1, speed: 6, range: 2.5,
    x: -24, z: -15, targetX: -24, targetZ: -28, facingX: 0, facingZ: -1
  };
  const guard = {
    id: 'd_guard', side: 'defender', type: 'infantry', kind: 'infantry',
    troopCount: 80, life: 100, initialLife: 100, morale: 75,
    damage: 10, armor: 1.0, speed: 4, range: 2.5,
    x: -24, z: -28, targetX: -24, targetZ: -28, facingX: 0, facingZ: 1
  };
  const state = { groups: [flanker, guard], siege, fieldTime: 0, effects: [], projectiles: [] };
  for (let i = 0; i < 16; i++) stepCardBattle(state, 0.25);
  assert.ok(flanker.z < -18, `Expected flanker to push through breached west tower past z=-18, got z=${flanker.z}`);
});

test('Phase 7: Hometown capital layout feeds 3D siege fortifications and writes back post-siege damage', () => {
  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  openHometown(g, world);
  const cap = g.hometown.realms.vijayanagara.capital;
  g.provinces[cap].buildings.fort = 2;
  g.hometown.buildings[cap] ??= {};
  g.hometown.buildings[cap].gatehouse = 2;
  g.hometown.buildings[cap].watchtower = 1;
  g.hometown.realms.vijayanagara.positions.gatehouse = 12;
  g.hometown.realms.vijayanagara.positions.watchtower = 19;

  const layout = homeCapitalLayout(g, cap);
  assert.equal(layout.isCapital, true);
  assert.equal(layout.gatehouse, 2);
  assert.ok(layout.buildings.some(b => b.key === 'gatehouse' && b.slot === 12));

  const baseSiege = createSiegeState(2, false, null);
  const capSiege = createSiegeState(2, false, layout);
  assert.ok(capSiege.structures[0].max > baseSiege.structures[0].max);
  assert.equal(capSiege.capitalDefense, true);

  applyFortDamage(g, cap, { fortBreached: true });
  assert.equal(g.provinces[cap].buildings.fort, 1);
  assert.equal(g.hometown.buildings[cap].gatehouse, 1);
  assert.ok(g.hometown.realms.vijayanagara.founded.some(e => e.text.includes('Ramparts breached')));
});
