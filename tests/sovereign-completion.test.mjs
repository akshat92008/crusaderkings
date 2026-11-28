import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readFileSync } from 'node:fs';
import { createGame, concludeBattle, startMarch, snapshot, restoreGame } from '../src/simulation.js';
import { buildFiveGenerationTree } from '../src/ui/lineage.js';
import { saveRealmCoA, getRealmCoA, renderCoASvg, renderCoAStudio } from '../src/ui/coat-of-arms.js';
import { geneticAppearance } from '../src/character-agency.js';
import { portraitImage } from '../src/game-art.js';
import { homeCapitalLayout, openHometown } from '../src/hometown.js';
import { SUPPORTED_LOCALES, t } from '../src/i18n.js';
import { EXTENDED_SFX_FILES, extendedSamplePath, ExtendedSfxBank } from '../src/sample-audio.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));

test('5-generation family tree spans grandparents through grandchildren', () => {
  const people = {
    gp1: { id: 'gp1', name: 'Grandfather', house: 'Plantagenet', age: 74, alive: false, parents: [], children: ['p1'] },
    p1: { id: 'p1', name: 'Father', house: 'Plantagenet', age: 52, alive: true, parents: ['gp1'], children: ['r1', 'sib1'] },
    r1: { id: 'r1', name: 'Sovereign', house: 'Plantagenet', age: 30, alive: true, parents: ['p1'], spouse: 'sp1', children: ['c1'] },
    sp1: { id: 'sp1', name: 'Consort', house: 'Valois', age: 28, alive: true, parents: [], children: ['c1'] },
    sib1: { id: 'sib1', name: 'Brother', house: 'Plantagenet', age: 27, alive: true, parents: ['p1'], children: [] },
    c1: { id: 'c1', name: 'Heir', house: 'Plantagenet', age: 12, alive: true, parents: ['r1', 'sp1'], children: ['gc1'] },
    gc1: { id: 'gc1', name: 'Grandchild', house: 'Plantagenet', age: 1, alive: true, parents: ['c1'], children: [] }
  };
  const tree = buildFiveGenerationTree(people, 'r1');
  assert.deepEqual(tree.grandparents, ['gp1']);
  assert.ok(tree.parents.includes('p1'));
  assert.ok(tree.generation.includes('r1') && tree.generation.includes('sp1') && tree.generation.includes('sib1'));
  assert.deepEqual(tree.children, ['c1']);
  assert.deepEqual(tree.grandchildren, ['gc1']);
});

test('Interactive Coat of Arms Studio persists custom blazon cleanly across saves', () => {
  const g = createGame(world, 'england');
  const saved = saveRealmCoA(g, 'england', {
    pattern: 'saltire',
    primary: 'azure',
    secondary: 'argent',
    charge: 'dragon',
    chargeTincture: 'or',
    motto: 'Ad Victoriam 1450'
  });
  assert.ok(saved.ok);
  const restored = restoreGame(snapshot(g), world);
  const coa = getRealmCoA(restored, 'england');
  assert.equal(coa.pattern, 'saltire');
  assert.equal(coa.charge, 'dragon');
  assert.equal(coa.motto, 'Ad Victoriam 1450');
  assert.ok(renderCoASvg(coa, { showMotto: true }).includes('<svg'));
  assert.ok(renderCoAStudio(restored, s => String(s), 'england').includes('Royal Coat of Arms Studio'));
});

test('Character genetics and age-stage portrait visuals work across generations', () => {
  const g = createGame(world, 'england');
  const rulerId = g.politics.realms.england.ruler;
  const ruler = g.politics.people[rulerId];
  const appearance = geneticAppearance(ruler, g.politics.people);
  assert.ok(appearance.eyes && appearance.hair && appearance.feature);
  assert.ok(portraitImage({ ...ruler, age: 14, alive: true }).includes('age-youth'));
  assert.ok(portraitImage({ ...ruler, age: 68, alive: true }).includes('age-elder'));
  assert.ok(portraitImage({ ...ruler, age: 72, alive: false }).includes('is-deceased'));
});

test('Living Capital 64-plot 1:1 3D siege layout exposes coordinates, damage flags, and up to 64 plots', () => {
  const g = createGame(world, 'england');
  openHometown(g, world);
  const capProv = g.hometown.realms.england.capital;
  g.hometown.realms.england.damaged = { granary: 35 };
  const layout = homeCapitalLayout(g, capProv);
  assert.ok(layout && layout.isCapital);
  assert.equal(layout.plotTotal, 64);
  assert.ok(layout.buildings.length >= 1);
  for (const b of layout.buildings) {
    assert.ok(Number.isFinite(b.x) && Number.isFinite(b.z));
    assert.equal(typeof b.damaged, 'boolean');
  }
});

test('Greatest Battle record captures full 3D replay metadata', () => {
  const g = createGame(world, 'england');
  const armyEntry = Object.entries(g.armies).find(([, a]) => a.owner === 'england');
  const target = world.provinces.find(p => g.provinces[p.id]?.owner !== 'england');
  assert.ok(armyEntry && target);
  const res = concludeBattle(g, {
    type: 'showcase',
    attacker: armyEntry[0],
    enemy: g.provinces[target.id].owner,
    to: target.id,
    defenseTroops: 90,
    siegeMode: true,
    fortLevel: 2
  }, { victory: true, attackerRemaining: 0.72, enemyRemaining: 0.25, siegeMode: true }, world);
  assert.ok(res.ok || res.ok === undefined);
  const gb = g.chronicles.greatestBattle;
  assert.ok(gb);
  assert.equal(gb.provinceId, target.id);
  assert.equal(gb.siegeMode, true);
  assert.ok(gb.playerTroops > 0 && gb.enemyTroops > 0);
});

test('9-language i18n covers all required locales with non-empty strings', () => {
  assert.deepEqual([...SUPPORTED_LOCALES], ['en', 'zh-CN', 'de', 'es', 'pt-BR', 'ru', 'pl', 'fr', 'hi']);
  for (const loc of SUPPORTED_LOCALES) {
    for (const key of ['app.title', 'hud.treasury', 'nav.crown', 'battle.retreat', 'coa.title']) {
      const str = t(key, {}, loc);
      assert.ok(str && str !== key, `${loc} missing translation for ${key}`);
    }
  }
});

test('42 curated Kenney CC0 OGG SFX assets exist on disk and ExtendedSfxBank warms & plays cleanly', async () => {
  const uniquePaths = [...new Set(Object.values(EXTENDED_SFX_FILES).flat().map(extendedSamplePath))];
  assert.equal(uniquePaths.length, 42);
  for (const rel of uniquePaths) {
    const stat = fs.statSync(new URL('../' + rel, import.meta.url));
    assert.ok(stat.size > 100, rel);
  }
  const played = [];
  const ctx = {
    decodeAudioData: async buf => ({ buf }),
    createBufferSource: () => ({ connect() {}, disconnect() {}, start() { played.push(this.buffer); } }),
    createGain: () => ({ gain: { value: 0 }, connect() {}, disconnect() {} })
  };
  const bank = new ExtendedSfxBank(ctx, async () => new Uint8Array([1, 2, 3, 4]).buffer);
  await bank.warm(['click', 'breach', 'horn']);
  assert.ok(bank.play('click', () => null, () => {}));
  assert.ok(bank.play('breach', () => null, () => {}));
  assert.ok(bank.play('horn', () => null, () => {}));
  assert.equal(played.length, 3);
  bank.close();
});
