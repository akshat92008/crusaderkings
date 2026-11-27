import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stepCardBattle, cardBattleOutcome, arrangeCardArmy } from '../src/simple-card-battle.js';
import { regionalFamilyForRealm } from '../src/three-battle-scene.js';
import { fieldAtmosphere } from '../src/field-atmosphere.js';
import { terrainHeight } from '../src/field-tactics.js';

const manifest0ad = JSON.parse(readFileSync(new URL('../assets/battle/0ad/manifest.json', import.meta.url)));

function makeGroup(id, side, type, troopCount, opts = {}) {
  return {
    id, side, type,
    kind: opts.kind || type,
    troopCount,
    initialLife: 100,
    life: opts.life ?? 100,
    morale: opts.morale ?? 80,
    damage: opts.damage ?? (type === 'cavalry' ? 18 : type === 'archers' ? 10 : 12),
    armor: opts.armor ?? (type === 'infantry' ? 1.15 : 0.9),
    speed: opts.speed ?? (type === 'cavalry' ? 6.8 : 4.2),
    range: opts.range ?? (type === 'archers' ? 18 : 2.6),
    formationId: opts.formationId || (type === 'cavalry' ? 'cavalry_wedge' : type === 'archers' ? 'volley_line' : 'shield_wall'),
    x: opts.x ?? 0,
    z: opts.z ?? (side === 'attacker' ? 14 : -14),
    facingX: 0,
    facingZ: side === 'attacker' ? -1 : 1,
    fatigue: opts.fatigue ?? 0,
    isCommander: !!opts.isCommander,
    commanderMartial: opts.commanderMartial ?? 4
  };
}

function runDuel(groups, dt = 0.25, maxSteps = 400) {
  const state = { groups, fieldTime: 0, effects: [], projectiles: [], terrainType: 'plains' };
  for (let i = 0; i < maxSteps; i++) {
    stepCardBattle(state, dt);
    const out = cardBattleOutcome(groups, state.fieldTime, false, null);
    if (out) return { out, state };
  }
  return { out: cardBattleOutcome(groups, 100, false, null), state };
}

test('Phase 5: 3:1 numerical superiority wins cleanly', () => {
  const groups = [
    makeGroup('a1', 'attacker', 'infantry', 900, { x: 0, z: 12 }),
    makeGroup('d1', 'defender', 'infantry', 300, { x: 0, z: -12 })
  ];
  const { out } = runDuel(groups);
  assert.equal(out.victory, true);
  assert.ok(out.attacker > out.defender);
});

test('Phase 5: braced pike_square inflicts counter-shock on frontal cavalry wedge', () => {
  const pike = makeGroup('d1', 'defender', 'infantry', 240, { kind: 'pikemen', formationId: 'pike_square', armor: 1.35, x: 0, z: -10 });
  const cav = makeGroup('a1', 'attacker', 'cavalry', 160, { kind: 'lancers', formationId: 'cavalry_wedge', x: 0, z: 14 });
  const { out } = runDuel([cav, pike]);
  assert.equal(out.victory, false);
  assert.ok(pike.life > 0 && !pike.routed);
});

test('Phase 5: exposed archers suffer heavily vs cavalry while fresh force beats fatigued equal force', () => {
  const cav = makeGroup('a1', 'attacker', 'cavalry', 150, { kind: 'lancers', formationId: 'cavalry_wedge', x: 0, z: 16 });
  const arc = makeGroup('d1', 'defender', 'archers', 150, { formationId: 'volley_line', x: 0, z: -14 });
  const { out } = runDuel([cav, arc]);
  assert.equal(out.victory, true);

  const fresh = makeGroup('a2', 'attacker', 'infantry', 250, { fatigue: 0, x: 0, z: 10 });
  const tired = makeGroup('d2', 'defender', 'infantry', 250, { fatigue: 0.95, x: 0, z: -10 });
  const { out: fOut } = runDuel([fresh, tired]);
  assert.equal(fOut.victory, true);
});

test('Phase 5: commander rout causes bounded local morale shock without global collapse', () => {
  const cmd = makeGroup('a_cmd', 'attacker', 'infantry', 100, { isCommander: true, life: 0, morale: 0, x: 0, z: 10 });
  cmd.routed = true;
  const nearAlly = makeGroup('a_near', 'attacker', 'infantry', 200, { morale: 80, x: 8, z: 10 });
  const farAlly = makeGroup('a_far', 'attacker', 'infantry', 200, { morale: 80, x: 48, z: 10 });
  const enemy = makeGroup('d1', 'defender', 'infantry', 200, { x: 0, z: -12 });
  stepCardBattle({ groups: [cmd, nearAlly, farAlly, enemy], fieldTime: 0, effects: [], projectiles: [] }, 0.1);
  assert.ok(nearAlly.morale < 75, 'nearby ally should take commander morale shock');
  assert.ok(farAlly.morale >= 75, 'distant ally should not suffer premature shock');
  assert.ok(!nearAlly.routed);
});

test('Phase 6: all 4 launch regional 0 A.D. families & 8 battle biomes resolve cleanly', () => {
  assert.deepEqual(
    ['vijayanagara', 'ming', 'ottomans', 'france'].map(regionalFamilyForRealm),
    ['india', 'east_asia', 'persia', 'europe']
  );
  for (const fam of ['india', 'east_asia', 'persia', 'europe']) {
    const roles = manifest0ad.families[fam]?.roles;
    assert.ok(roles && Object.keys(roles).length >= 6, `missing roles for ${fam}`);
    assert.ok(roles.cavalry, `missing cavalry for ${fam}`);
  }
  const biomes = ['plains', 'desert', 'steppe', 'forest', 'hills', 'mountain', 'coastal', 'marsh'];
  const skies = new Set(biomes.map(b => fieldAtmosphere(b).sky));
  assert.equal(skies.size, 8);
  for (const b of biomes) assert.ok(Number.isFinite(terrainHeight(12, -8, b)));
});
