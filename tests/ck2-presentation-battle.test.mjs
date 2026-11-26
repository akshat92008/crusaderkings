import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  buildHistoricalWorld,
  expandHistoricalWorld,
  densifyHistoricalWorld,
  verifyAtlasIntegrity,
  REALM_METADATA_1450,
  REGION_METADATA_1450
} from '../src/historical-world.js';
import {
  successionWarningSummary,
  preWarComparison,
  tooltipData
} from '../src/campaign-hud.js';
import { renderPreWarComparison } from '../src/kingdom-ui.js';
import {
  initializeFieldGroup,
  issueFieldOrder,
  stepField
} from '../src/field-tactics.js';
import { createGame } from '../src/simulation.js';

const legacy = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));
const reference = JSON.parse(readFileSync(new URL('../data/historical-polities-1450.json', import.meta.url)));
const atlasV2 = buildHistoricalWorld(legacy, reference);
const atlasV3 = expandHistoricalWorld(atlasV2);
const world = densifyHistoricalWorld(atlasV3);

function makeGroup(id, side, type, x, z, extra = {}) {
  return initializeFieldGroup({
    id,
    side,
    type,
    x,
    z,
    order: 0,
    troopCount: 40,
    morale: 85,
    damage: 10,
    armor: 1,
    speed: 4,
    range: type === 'archers' ? 14 : 2.5,
    cooldown: 0,
    phase: 0,
    ...extra
  });
}

test('Phase 13: 1450 historical world metadata and atlas integrity', () => {
  assert.equal(world.factions.length, 56);
  assert.ok(world.provinces.length >= 700, `Expected expanded provinces >= 700, got ${world.provinces.length}`);

  // Validate atlas integrity
  const integrity = verifyAtlasIntegrity(world);
  assert.equal(integrity.ok, true, `Integrity errors: ${integrity.errors.join('; ')}`);

  // Check realm metadata
  assert.ok(Object.keys(REALM_METADATA_1450).length >= 50);
  const eng = REALM_METADATA_1450.england;
  assert.equal(eng.dynasty, 'Lancaster');
  assert.equal(eng.culture, 'English');
  assert.equal(eng.faith, 'Latin Christianity');
  assert.equal(eng.kingdom, 'Kingdom of England');

  const ott = REALM_METADATA_1450.ottomans;
  assert.equal(ott.dynasty, 'Osman');
  assert.equal(ott.faith, 'Sunni Islam');

  // Verify all provinces have de jure titles, culture, and faith
  for (const p of world.provinces) {
    assert.ok(p.deJureKingdom, `Province ${p.id} missing deJureKingdom`);
    assert.ok(p.deJureDuchy, `Province ${p.id} missing deJureDuchy`);
    assert.ok(p.culture, `Province ${p.id} missing culture`);
    assert.ok(p.faith, `Province ${p.id} missing faith`);
  }

  // Verify trade centers exist in each region
  const tradeProvs = world.provinces.filter(p => p.tradeCenter);
  assert.ok(tradeProvs.length >= 10);
  for (const tp of tradeProvs) {
    assert.ok(tp.tradeCenterName, `Trade center ${tp.id} missing tradeCenterName`);
  }
});

test('Phase 14: succession warning summary reports heirless and crisis states', () => {
  const game = createGame(world, 'england');

  // Initial fresh England game
  const initialWarning = successionWarningSummary(game);
  if (initialWarning) {
    assert.ok(['urgent', 'attention'].includes(initialWarning.level));
  }

  // Kill the heir and set heir to null -> urgent warning
  const realm = game.politics.realms.england;
  realm.heir = null;
  const noHeirWarning = successionWarningSummary(game);
  assert.ok(noHeirWarning);
  assert.equal(noHeirWarning.level, 'urgent');
  assert.match(noHeirWarning.label, /No living heir/i);

  // Regency active -> attention warning
  realm.heir = 'some_heir';
  game.politics.people.some_heir = { id: 'some_heir', alive: true };
  game.regency = { realms: { england: { active: true } } };
  const regencyWarning = successionWarningSummary(game);
  assert.ok(regencyWarning);
  assert.equal(regencyWarning.level, 'attention');
  assert.match(regencyWarning.label, /Regency active/i);
});

test('Phase 14: pre-war comparison and renderPreWarComparison', () => {
  const game = createGame(world, 'england');

  const comp = preWarComparison(game, world, 'france');
  assert.ok(comp);
  assert.equal(comp.target, 'france');
  assert.ok(typeof comp.ourTotal === 'number');
  assert.ok(typeof comp.theirTotal === 'number');
  assert.ok(comp.verdict);

  const html = renderPreWarComparison(game, world, 'france', s => String(s));
  assert.ok(html.includes('war-compare'));
  assert.ok(html.includes('France') || html.includes('france'));
});

test('Phase 14: rich tooltips for provinces and characters', () => {
  const game = createGame(world, 'england');

  const pTip = tooltipData(game, world, 'province', 'p1');
  assert.ok(pTip.length > 0);
  assert.ok(pTip.includes('Pop'));
  assert.ok(pTip.includes('Dev'));

  const rulerId = game.politics.realms.england.ruler;
  const cTip = tooltipData(game, world, 'character', rulerId);
  assert.ok(cTip.length > 0);
  assert.ok(cTip.includes('M '));
  assert.ok(cTip.includes('D '));
});

test('Phase 15: pike square brace mitigates cavalry damage and inflicts recoil', () => {
  function testPikeBrace(targetFormation) {
    const cav = makeGroup('cav', 'attacker', 'cavalry', 0, 1.5, { troopCount: 50, damage: 15 });
    const inf = makeGroup('inf', 'defender', 'infantry', 0, 0, {
      troopCount: 50,
      damage: 10,
      formationId: targetFormation
    });
    issueFieldOrder(inf, 'hold');
    issueFieldOrder(cav, 'charge');
    const s = { groups: [cav, inf], projectiles: [] };
    stepField(s, 0.1);
    return { cavLife: cav.life, infLife: inf.life };
  }

  const normal = testPikeBrace('line');
  const braced = testPikeBrace('pike_square');

  assert.ok(
    braced.infLife > normal.infLife,
    `Braced pikes infLife (${braced.infLife}) should be higher than normal line (${normal.infLife})`
  );
  assert.ok(
    braced.cavLife < normal.cavLife,
    `Cavalry attacking braced pikes should take recoil (${braced.cavLife} vs ${normal.cavLife})`
  );
});

test('Phase 15: shield wall provides frontal mitigation against attacks', () => {
  function testShieldWall(formation) {
    const atk = makeGroup('atk', 'attacker', 'infantry', 0, 1, { troopCount: 50, damage: 12 });
    const def = makeGroup('def', 'defender', 'infantry', 0, 0, {
      troopCount: 50,
      damage: 10,
      formationId: formation
    });
    issueFieldOrder(atk, 'hold');
    issueFieldOrder(def, 'hold');
    def.cooldown = 99;
    const s = { groups: [atk, def], projectiles: [] };
    stepField(s, 0.1);
    return def.life;
  }

  const lineDefLife = testShieldWall('line');
  const shieldWallLife = testShieldWall('shield_wall');

  assert.ok(
    shieldWallLife > lineDefLife,
    `Shield wall (${shieldWallLife}) should mitigate frontal damage better than line (${lineDefLife})`
  );
});

test('Phase 15: commander martial aura accelerates morale rally and buffs attack', () => {
  const aNoCmd = makeGroup('a', 'attacker', 'infantry', 0, 20, { commanderMartial: 0 });
  const aCmd = makeGroup('b', 'attacker', 'infantry', 0, 20, { commanderMartial: 10 });
  aNoCmd.morale = 30;
  aCmd.morale = 30;
  const enemy = makeGroup('e', 'defender', 'infantry', 0, -20);
  issueFieldOrder(aNoCmd, 'hold');
  issueFieldOrder(aCmd, 'hold');
  issueFieldOrder(enemy, 'hold');

  const s1 = { groups: [aNoCmd, enemy], projectiles: [] };
  const s2 = { groups: [aCmd, enemy], projectiles: [] };
  stepField(s1, 2);
  stepField(s2, 2);

  assert.ok(
    aCmd.morale > aNoCmd.morale,
    `Commander aura should accelerate rally rate (${aCmd.morale} vs ${aNoCmd.morale})`
  );
});
