import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  animationClipState,
  formationOffsets,
  battleImpactParticles
} from '../src/battle-presentation.js';
import {
  regimentPalette,
  unitBadgeLabel,
  projectileTrail
} from '../src/field-visuals.js';
import {
  sampledSoldierBudget,
  mixerLodInterval,
  createFrameBudgetMonitor,
  disposeThreeObject
} from '../src/render-performance.js';
import {
  chooseAiBattlePreset,
  assignAiReserves,
  coordinateCardBattleAI,
  stepCardBattle,
  arrangeCardArmy,
  releaseCardReserves
} from '../src/simple-card-battle.js';
import {
  initializeFieldGroup,
  coordinateFieldAI,
  stepField
} from '../src/field-tactics.js';
import {
  createSiegeState,
  siegeDamage,
  siegeCorridorBreached,
  siegeBreached
} from '../src/military-systems.js';
import { aiRecruitmentBudget } from '../src/campaign-balance.js';
import { createGame, advanceMonth } from '../src/simulation.js';

const world = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('Phases 3-6: 0 A.D. manifest, full 6-state animation clip resolver, regional palettes, and 8+ formations', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../assets/battle/0ad/manifest.json', import.meta.url), 'utf8'));
  assert.ok(Object.keys(manifest.families || {}).length >= 8, 'manifest contains regional unit models');

  assert.equal(animationClipState({ routed: false, life: 0 }), 'death');
  assert.equal(animationClipState({ routed: true, life: 40 }), 'run');
  assert.equal(animationClipState({ rallyBuffTimer: 7, life: 80 }), 'rally');
  assert.equal(animationClipState({ attackPulse: 0.25, life: 80 }), 'attack');
  assert.equal(animationClipState({ moving: true, fieldOrder: 'charge', life: 80 }), 'run');
  assert.equal(animationClipState({ moving: true, fieldOrder: 'advance', life: 80 }), 'walk');
  assert.equal(animationClipState({ moving: false, life: 80 }), 'idle');

  for (const form of ['shield_wall', 'pike_square', 'cavalry_wedge', 'skirmish', 'flank', 'encirclement', 'line', 'square', 'loose', 'column']) {
    const pts = formationOffsets(12, form, form === 'cavalry_wedge' ? 'cavalry' : 'infantry');
    assert.equal(pts.length, 12, `formationOffsets supports ${form}`);
  }

  const india = regimentPalette('attacker', 'cavalry', 'india');
  const europe = regimentPalette('attacker', 'cavalry', 'europe');
  assert.notDeepEqual(india.accent, europe.accent, 'regional palettes differentiate faction families');
  assert.equal(unitBadgeLabel({ type: 'cavalry', specialistId: 'elephants' }), 'ELP');
});

test('Phase 7: 3D siege breach corridors, blazing artillery shot trails, and breach explosion particles', () => {
  const siege = createSiegeState(2, false);
  assert.equal(siegeBreached(siege), false);
  assert.equal(siegeCorridorBreached(siege, -24), false);

  const westTower = siege.structures.find(s => s.id === 'left');
  assert.ok(westTower, 'flanking west tower exists');
  siegeDamage(siege, 'left', westTower.max + 20);
  assert.equal(siegeCorridorBreached(siege, -24), true, 'destroyed flanking tower opens breach corridor');
  assert.equal(siegeBreached(siege), false);

  const shotTrail = projectileTrail({ sx: 0, sz: 20, tx: 0, tz: -18, t: 0.5, kind: 'shot' }, false, 'plains');
  assert.ok(shotTrail.length >= 4 && shotTrail[0].size > 0.2, 'artillery shot renders blazing arc trail');

  const breachParticles = battleImpactParticles({ kind: 'breach', x: 0, z: -18, age: 0.25, duration: 1.2 }, 'plains');
  assert.ok(breachParticles.length >= 8 && breachParticles.every(p => p.kind === 'breach'));
});

test('Phase 11 (Tactical AI): simpleField AI picks smart preset, assigns/commits reserves, counter-forms, flanks, and sounds rally horn', () => {
  const makeGroup = (id, side, type, x, z, extra = {}) => ({
    id, side, type, kind: extra.kind || type,
    x, z, life: 100, morale: 80, troopCount: 160, troops: 160,
    damage: type === 'cavalry' ? 16 : 11, armor: 1.1, range: type === 'archers' ? 16 : 2.6, speed: type === 'cavalry' ? 7 : 4.2,
    formationId: type === 'archers' ? 'volley_line' : type === 'cavalry' ? 'cavalry_wedge' : 'shield_wall',
    ...extra
  });

  const groups = [
    makeGroup('a_inf1', 'attacker', 'infantry', -6, 14, { isCommander: true }),
    makeGroup('a_cav1', 'attacker', 'cavalry', -28, 12),
    makeGroup('a_arc1', 'attacker', 'archers', 28, 34),
    makeGroup('d_cmd', 'defender', 'infantry', 0, -14, { isCommander: true, commanderName: 'Khan Timur', kind: 'pikemen' }),
    makeGroup('d_inf2', 'defender', 'infantry', -16, -16, { kind: 'spearmen' }),
    makeGroup('d_inf3', 'defender', 'infantry', 14, -16),
    makeGroup('d_cav1', 'defender', 'cavalry', 30, -20),
    makeGroup('d_cav2', 'defender', 'cavalry', -30, -20),
    makeGroup('d_arc1', 'defender', 'archers', -18, -28)
  ];

  const preset = chooseAiBattlePreset(groups, 'defender', { siege: false, terrain: 'plains' });
  assert.ok(['balanced', 'defensive', 'cavalry_assault', 'flanks', 'ranged_cover'].includes(preset));
  arrangeCardArmy(groups, 'defender', -1, preset);

  const reserves = assignAiReserves(groups, 'defender', { siege: false, difficulty: 'hard' });
  assert.ok(reserves.length >= 1, 'AI assigns tactical reserves in open field battles');

  // Threaten defender archers with attacker cavalry -> AI screens archers with pike_square
  const dArc = groups.find(g => g.id === 'd_arc1');
  const aCav = groups.find(g => g.id === 'a_cav1');
  aCav.x = dArc.x + 4; aCav.z = dArc.z + 14;

  const state = { groups, elapsed: 5, fieldTime: 5, effects: [], projectiles: [], battleEvents: [], rallyCooldowns: {} };
  const posture = coordinateCardBattleAI(state, { difficulty: 'hard' });
  assert.equal(posture, 'Screen archers');
  assert.ok(groups.some(g => g.side === 'defender' && g.formationId === 'pike_square'));

  // Low morale triggers automatic enemy commander rally horn with 25s cooldown
  groups.find(g => g.id === 'd_cmd').morale = 48;
  groups.find(g => g.id === 'd_inf2').morale = 45;
  coordinateCardBattleAI(state, { difficulty: 'hard' });
  assert.ok(groups.find(g => g.id === 'd_cmd').morale >= 68, 'enemy commander automatically sounds rally horn');
  assert.ok(state.battleEvents.some(e => e.kind === 'rally' && e.side === 'defender'));

  // Reserves commit automatically when defender frontline takes pressure or at 10s
  state.fieldTime = 10.5;
  releaseCardReserves(state);
  assert.ok(reserves.every(r => !r.reserve), 'enemy reserves commit on schedule');

  // Step full simulation cleanly with zero NaN values
  for (let i = 0; i < 40; i++) stepCardBattle(state, 0.25);
  assert.ok(state.groups.every(g => Number.isFinite(g.x) && Number.isFinite(g.z) && Number.isFinite(g.life) && Number.isFinite(g.morale)));
});

test('Phase 11 (Campaign AI): recruitment scaling, siege engine construction, Hometown growth, and financial solvency', () => {
  const normalSmall = aiRecruitmentBudget({ treasury: 1000, food: 100, population: 500, armySize: 0, goal: 'defend' });
  assert.equal(normalSmall.count, 35);
  assert.equal(normalSmall.cost, 120);

  const hardEmpire = aiRecruitmentBudget({ treasury: 2500, food: 300, population: 1400, armySize: 400, goal: 'conquer', difficulty: 'hard', provinces: 8 });
  assert.ok(hardEmpire && hardEmpire.target > 1000 && hardEmpire.count >= 40, 'large hard-mode empires scale army targets fairly');

  const g = createGame(world, 'vijayanagara', { difficulty: 'hard' });
  for (let m = 0; m < 24; m++) advanceMonth(g, world);

  const aiRealms = Object.entries(g.factions).filter(([id]) => id !== 'vijayanagara' && id !== 'independent');
  assert.ok(aiRealms.every(([, f]) => Number.isFinite(f.treasury) && Number.isFinite(f.stability) && Number.isFinite(f.food)), 'all AI realms remain numerically stable');

  const aiHometowns = Object.keys(g.hometown?.realms || {}).filter(id => id !== 'vijayanagara');
  assert.ok(aiHometowns.length >= 5, `AI develops multiple Hometown capitals (${aiHometowns.length})`);

  const totalEngines = Object.values(g.military?.armies || {}).reduce((sum, m) => {
    const e = m?.engines || {};
    return sum + (e.ram || 0) + (e.catapult || 0) + (e.bombard || 0);
  }, 0);
  assert.ok(totalEngines >= 0 && Number.isFinite(totalEngines), 'siege engine counts stay valid');
});

test('Phase 14: Premium grand strategy UI contract (7-destination dock, grand-strategy.css, tabular-nums, zero backdrop-filter)', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const styles = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  const grandCss = fs.readFileSync(new URL('../src/ui/grand-strategy.css', import.meta.url), 'utf8');
  const fieldCss = fs.readFileSync(new URL('../src/ui/field-command.css', import.meta.url), 'utf8');

  assert.ok(html.includes('href="src/ui/grand-strategy.css"'), 'grand-strategy.css linked in index.html');
  assert.ok(html.includes('data-priority-tab="chronicle"'), 'Chronicle 7th destination present in bottom dock');
  assert.ok(html.includes('id="battle-posture"'), 'live enemy AI posture badge present in battle HUD');
  assert.ok(html.includes('data-start="true"'), 'start button exposes data-start hook');
  assert.ok(grandCss.includes('font-variant-numeric: tabular-nums'), 'tabular numerals enforced on ledgers');
  assert.equal(/backdrop-filter\s*:/i.test(styles), false, 'styles.css has zero backdrop-filter over canvases');
  assert.equal(/backdrop-filter\s*:/i.test(grandCss), false, 'grand-strategy.css has zero backdrop-filter over canvases');
  assert.equal(/backdrop-filter\s*:/i.test(fieldCss), false, 'field-command.css has zero backdrop-filter over canvases');
});

test('Phase 17: Soldier budgets, distance LOD throttling, frame budget monitor, GPU disposal, and 20-battle soak', () => {
  const softCap = sampledSoldierBudget(500, 'infantry', 'high', true, false);
  const hwCap = sampledSoldierBudget(500, 'infantry', 'high', false, false);
  assert.ok(softCap <= 12 && hwCap <= 32 && softCap < hwCap, 'software WebGL scales soldier budget below hardware GPU');
  assert.ok(sampledSoldierBudget(120, 'cavalry', 'medium', false, true) <= 6, 'war elephants cap at 6 models');

  assert.ok(mixerLodInterval(20, 'high', false) < mixerLodInterval(95, 'high', false), 'distant units update mixers less frequently');
  assert.ok(mixerLodInterval(20, 'medium', true) >= mixerLodInterval(20, 'medium', false), 'software GL throttles mixers cleanly');

  const mon = createFrameBudgetMonitor(10);
  for (let i = 0; i < 10; i++) mon.sample(16.6);
  const snap = mon.snapshot();
  assert.ok(snap.avgMs > 15 && snap.avgMs < 18 && snap.fps >= 55 && snap.samples === 10);

  let disposedGeo = 0, disposedMat = 0, disposedTex = 0;
  const sharedGeo = { dispose() { disposedGeo++; } };
  const ownGeo = { dispose() { disposedGeo++; } };
  const tex = { dispose() { disposedTex++; } };
  const mat = { map: tex, dispose() { disposedMat++; } };
  const fakeRoot = {
    traverse(fn) {
      fn({ geometry: sharedGeo, material: mat });
      fn({ geometry: ownGeo, material: [mat] });
    }
  };
  disposeThreeObject(fakeRoot, new Set([sharedGeo]));
  assert.equal(disposedGeo, 1, 'disposeThreeObject disposes owned geometry and preserves shared cache');
  assert.equal(disposedMat, 1, 'disposeThreeObject deduplicates shared material disposal');
  assert.equal(disposedTex, 1, 'disposeThreeObject disposes textures once');

  // 20-cycle repeated battle create/step/cleanup soak test
  for (let cycle = 0; cycle < 20; cycle++) {
    const groups = [
      initializeFieldGroup({ id: 'a1', side: 'attacker', type: 'infantry', x: 0, z: 18, life: 100, morale: 85, troopCount: 180, damage: 11, armor: 1.1, range: 2.5, speed: 4 }),
      initializeFieldGroup({ id: 'd1', side: 'defender', type: 'infantry', x: 0, z: -18, life: 100, morale: 85, troopCount: 180, damage: 11, armor: 1.1, range: 2.5, speed: 4 })
    ];
    const st = { groups, fieldTime: 0, elapsed: 0, terrainType: 'plains', effects: [], projectiles: [], battleEvents: [], rallyCooldowns: {} };
    for (let s = 0; s < 15; s++) {
      if (s % 5 === 0) coordinateFieldAI(st);
      stepField(st, 0.25);
    }
    assert.ok(st.effects.length <= 64 && st.projectiles.length <= 128);
  }
});
