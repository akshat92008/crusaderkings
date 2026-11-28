import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { BATTLE_PRESETS, REGIMENT_ROLE_GUIDE, arrangeCardArmy, stepCardBattle, cardBattleOutcome, cardCounter, moveCard } from '../src/simple-card-battle.js';
import { stepField, triggerRallyHorn, ensureTacticalStats } from '../src/field-tactics.js';
import { detailedRegionalFamilyForRealm, regionalFamilyForRealm, regionalAliasFallback, GRAPHICS_PRESETS } from '../src/three-battle-scene.js';
import { renderEconomy, renderCharacter, renderDiplomacyFacing, renderCouncilDirectory } from '../src/kingdom-ui.js';
import { renderRoyalEconomy } from '../src/ui/royal-economy.js';
import { createGame } from '../src/simulation.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));
const manifest = JSON.parse(readFileSync(new URL('../assets/battle/0ad/manifest.json', import.meta.url)));
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const EXPECTED_FAMILIES = [
  'western_europe', 'eastern_europe', 'northern_europe', 'byzantine',
  'ottoman', 'persia', 'north_india', 'south_india',
  'china', 'japan', 'southeast_asia', 'steppe',
  'africa', 'mesoamerica', 'andean'
];

test('Phase 3 & 6 V2.0: 15 regional families + environment GLBs exist on disk with valid glTF headers and mounted cavalry', () => {
  const uniquePaths = new Set();
  for (const fam of [...EXPECTED_FAMILIES, 'india', 'east_asia', 'europe', 'environment']) {
    const entry = manifest.families[fam];
    assert.ok(entry && entry.roles && Object.keys(entry.roles).length >= 7, `Missing roles for ${fam}`);
    for (const [role, info] of Object.entries(entry.roles)) {
      const fullPath = path.join(ROOT, info.path);
      assert.ok(fs.existsSync(fullPath), `Missing GLB file: ${info.path}`);
      const hdr = fs.readFileSync(fullPath).subarray(0, 4).toString('utf8');
      assert.equal(hdr, 'glTF', `Corrupt glTF header at ${info.path}`);
      uniquePaths.add(info.path);
    }
    if (fam !== 'environment') {
      assert.ok(entry.roles.cavalry?.mounted, `${fam} cavalry must use mounted GLB (no primitive box horse fallback)`);
    }
  }
  assert.ok(uniquePaths.size >= 70, `Expected >= 70 unique GLBs in expanded V2.0 library, found ${uniquePaths.size}`);
  assert.equal(detailedRegionalFamilyForRealm('vijayanagara'), 'south_india');
  assert.equal(detailedRegionalFamilyForRealm('delhi'), 'north_india');
  assert.equal(detailedRegionalFamilyForRealm('france'), 'western_europe');
  assert.equal(detailedRegionalFamilyForRealm('poland'), 'eastern_europe');
  assert.equal(detailedRegionalFamilyForRealm('denmark'), 'northern_europe');
  assert.equal(detailedRegionalFamilyForRealm('byzantium'), 'byzantine');
  assert.equal(detailedRegionalFamilyForRealm('ottomans'), 'ottoman');
  assert.equal(detailedRegionalFamilyForRealm('ming'), 'china');
  assert.equal(detailedRegionalFamilyForRealm('ashikaga'), 'japan');
  assert.equal(detailedRegionalFamilyForRealm('ayutthaya'), 'southeast_asia');
  assert.equal(detailedRegionalFamilyForRealm('horde'), 'steppe');
  assert.equal(detailedRegionalFamilyForRealm('ethiopia'), 'africa');
  assert.equal(detailedRegionalFamilyForRealm('aztec'), 'mesoamerica');
  assert.equal(detailedRegionalFamilyForRealm('inca'), 'andean');
  assert.equal(regionalFamilyForRealm('vijayanagara'), 'india');
  assert.equal(regionalFamilyForRealm('ming'), 'east_asia');
  assert.equal(regionalFamilyForRealm('ottomans'), 'persia');
  assert.equal(regionalFamilyForRealm('france'), 'europe');
  assert.deepEqual(Object.keys(GRAPHICS_PRESETS).sort(), ['high', 'low', 'medium']);
});

test('Phase 7 V2.0: Tactical siege showcase is hidden from campaign UI and Mod Asset Legal Audit exists', () => {
  assert.match(indexHtml, /id="battle-siege-showcase"[^>]*hidden/);
  assert.match(indexHtml, /id="quick-nav"/);
  assert.match(indexHtml, /id="resource-food"/);
  assert.match(indexHtml, /id="hud-steward-advice"/);
  assert.match(indexHtml, /id="battle-quality"/);
  assert.match(indexHtml, /⚔ BEGIN ATTACK/);
  assert.ok(fs.existsSync(path.join(ROOT, 'docs', 'production', 'MOD_ASSET_LEGAL_AUDIT.md')));
});

test('Phase 4, 5 & 23 V2.0: 5 formation presets, role counters, rally horn, 100 full battles, and 1,000 seeded balance simulations pass', () => {
  assert.equal(BATTLE_PRESETS.length, 5);
  assert.ok(Object.keys(REGIMENT_ROLE_GUIDE).length >= 12);

  // Verify counter matrix relationships cleanly
  const pikes = { side: 'attacker', type: 'infantry', kind: 'pikemen', specialistId: 'pikes', formationId: 'pike_square' };
  const cav = { side: 'defender', type: 'cavalry', kind: 'cavalry', specialistId: 'lancers', formationId: 'cavalry_wedge' };
  const arch = { side: 'defender', type: 'archers', kind: 'archers', specialistId: 'bowmen', formationId: 'volley_line' };
  const hg = { side: 'attacker', type: 'archers', kind: 'archers', specialistId: 'handgun', formationId: 'volley_line' };
  const guard = { side: 'defender', type: 'infantry', kind: 'heavy_infantry', specialistId: 'guard', formationId: 'shield_wall' };
  assert.ok(cardCounter(pikes, cav) >= 1.4);
  assert.ok(cardCounter(cav, arch) >= 1.3);
  assert.ok(cardCounter(hg, guard) >= 1.2);

  const makeRegiment = (id, side, type, specialistId, troops, x, z) => ({
    id, side, type, kind: specialistId === 'pikes' ? 'pikemen' : type, specialistId,
    troopCount: troops, troops, maxTroops: troops, life: 100, initialLife: 100,
    morale: 75, armor: 1, damage: type === 'cavalry' ? 18 : 11, speed: type === 'cavalry' ? 6.5 : 4,
    range: type === 'archers' ? 16 : 2.6, lane: 1, x, z, targetX: x, targetZ: z,
    orderX: x, orderZ: z, anchorX: x, anchorZ: z, moveX: x, moveZ: z,
    formationId: type === 'archers' ? 'volley_line' : type === 'cavalry' ? 'cavalry_wedge' : 'shield_wall',
    routed: false, fatigue: 0, cooldown: 0
  });

  // 1) Rally horn real morale effect check
  const gA = makeRegiment('p0', 'attacker', 'infantry', 'swordsmen', 120, 0, 20);
  gA.morale = 40;
  const gB = makeRegiment('e0', 'defender', 'infantry', 'swordsmen', 120, 0, -20);
  const rallySim = { groups: [gA, gB], effects: [], projectiles: [], elapsed: 10, rallyCooldowns: {}, fieldTime: 10 };
  ensureTacticalStats(rallySim);
  const rRes = triggerRallyHorn(rallySim, 'attacker');
  assert.equal(rRes.ok, true);
  assert.ok(gA.morale > 40);

  // 2) Test all 5 formation presets arrange attacker line cleanly
  for (const preset of BATTLE_PRESETS) {
    const squad = [
      makeRegiment('a1', 'attacker', 'infantry', 'swordsmen', 100, 0, 14),
      makeRegiment('a2', 'attacker', 'archers', 'bowmen', 80, 0, 36),
      makeRegiment('a3', 'attacker', 'cavalry', 'scouts', 60, -24, 25)
    ];
    assert.equal(arrangeCardArmy(squad, 'attacker', 1, preset.id), true, `Preset failed: ${preset.id}`);
  }

  // 3) 1,000 Seeded deterministic balance scenarios + 100 full-length simulations
  let largeArmyWins = 0;
  let balancedWins = 0;
  for (let i = 0; i < 1000; i++) {
    const outnumberedTest = i < 200;
    const atkTroops = outnumberedTest ? 300 : 120;
    const defTroops = outnumberedTest ? 95 : 110;
    const a1 = makeRegiment('p0', 'attacker', 'infantry', i % 2 === 0 ? 'pikes' : 'swordsmen', Math.round(atkTroops * 0.5), -12, 18);
    const a2 = makeRegiment('p1', 'attacker', 'archers', 'bowmen', Math.round(atkTroops * 0.25), 0, 32);
    const a3 = makeRegiment('p2', 'attacker', 'cavalry', 'lancers', Math.round(atkTroops * 0.25), 24, 24);
    const d1 = makeRegiment('e0', 'defender', 'infantry', 'swordsmen', Math.round(defTroops * 0.6), -6, -18);
    const d2 = makeRegiment('e1', 'defender', 'archers', 'bowmen', Math.round(defTroops * 0.4), 6, -32);
    const state = { groups: [a1, a2, a3, d1, d2], effects: [], projectiles: [], fieldTime: 0, elapsed: 0, terrainType: ['plains', 'forest', 'hills', 'desert'][i % 4] };
    arrangeCardArmy(state.groups, 'attacker', 1, BATTLE_PRESETS[i % 5].id);
    arrangeCardArmy(state.groups, 'defender', -1, 'balanced');
    let out = null;
    for (let t = 0; t < 380 && !out; t++) {
      stepCardBattle(state, 0.25, () => ({ name: state.terrainType, height: 0, speed: 1, rangedMitigation: 1, inForestCover: false }));
      state.elapsed += 0.25;
      out = cardBattleOutcome(state.groups, state.elapsed, false, null);
    }
    assert.ok(out && Number.isFinite(out.attacker) && Number.isFinite(out.defender), `Battle ${i} failed to resolve cleanly`);
    if (outnumberedTest && out.victory) largeArmyWins++;
    if (!outnumberedTest && out.victory) balancedWins++;
  }
  assert.equal(largeArmyWins, 200, `Expected 3:1 numerical superiority to win 200/200 times, got ${largeArmyWins}`);
  assert.ok(balancedWins > 300, `Expected balanced 3-arm force to beat 2-arm force reliably, got ${balancedWins}/800`);
});

test('Phase 13 V2.0 UI: Economy forecast card, 2-ruler Diplomacy panel, and Character quickbar render cleanly', () => {
  const g = createGame(world, 'vijayanagara', { difficulty: 'normal' });
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => c);
  const ecoHtml = renderEconomy(g, world, esc);
  assert.match(ecoHtml, /id="v2-economy-forecast"/);
  assert.match(ecoHtml, /STEWARD ECONOMIC FORECAST/);
  assert.match(ecoHtml, /RECOMMENDED ACTIONS/);

  const diploHtml = renderDiplomacyFacing(g, 'bahmani', esc, { accepted: false, score: 10, threshold: 40 }, { accepted: true, score: 30, threshold: 20 });
  assert.match(diploHtml, /v2-diplo-duet/);
  assert.match(diploHtml, /Vijayanagara/);
  assert.match(diploHtml, /Bahmani/);

  const rulerId = g.politics.realms.vijayanagara.ruler;
  const charHtml = renderCharacter(g, world, rulerId, esc);
  assert.match(charHtml, /v2-char-quickbar/);
  assert.match(charHtml, /Council/);

  const councilHtml = renderCouncilDirectory(g, esc, world);
  assert.match(councilHtml, /adviser-rec/);

  const ecoTreeHtml = renderRoyalEconomy(g, world, esc, { taxIncome: 40, trade: 10, tradePosts: 5, upkeep: 20, balance: 35 });
  assert.match(ecoTreeHtml, /Royal economy/);
});
