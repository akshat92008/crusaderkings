import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createGame, snapshot, restoreGame, recruit, startMarch, concludeBattle, advanceMonth, armySize, empireStats
} from '../src/simulation.js';
import { openHometown, queueHome, homeRealm, hometownModifiers } from '../src/hometown.js';
import { validatePortableSave } from '../src/portable-save.js';
import { applyFortDamage } from '../src/military-systems.js';
import { controller } from '../src/campaign-war.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

test('Phase 2 transaction integrity: recruit updates treasury, population, and regiments without NaN', () => {
  const g = createGame(world, 'england');
  const capitalId = Object.values(g.provinces).find(p => p.owner === 'england').id;
  g.factions.england.treasury = 5000;
  const startPop = g.provinces[capitalId].population;
  const beforeTroops = Object.values(g.armies).filter(a => a.owner === 'england').reduce((n, a) => n + armySize(a), 0);

  const res = recruit(g, capitalId, 'infantry');
  assert.equal(res.ok, true);
  assert.ok(g.factions.england.treasury < 5000);
  assert.ok(g.provinces[capitalId].population <= startPop);
  const afterTroops = Object.values(g.armies).filter(a => a.owner === 'england').reduce((n, a) => n + armySize(a), 0);
  assert.ok(afterTroops > beforeTroops);
  assert.ok(Number.isFinite(empireStats(g, 'england').income));
});

test('Phase 2 battle single-apply guard: concludeBattle cannot apply twice or leave invalid state', () => {
  const g = createGame(world, 'england');
  g.factions.england.treasury = 5000;
  const border = world.provinces.find(p =>
    g.provinces[p.id].owner === 'england' && p.neighbors.some(n => g.provinces[n]?.owner === 'france')
  );
  const enemyProv = border.neighbors.find(n => g.provinces[n]?.owner === 'france');
  assert.ok(border && enemyProv);
  const engArmy = Object.values(g.armies).find(a => a.owner === 'england');
  engArmy.province = border.id;
  engArmy.infantry = 400;

  const battle = startMarch(g, world, border.id, enemyProv);
  assert.equal(battle.ok, true);
  assert.equal(battle.type, 'battle');

  const first = concludeBattle(g, battle, { victory: true, attackerRemaining: 0.85, enemyRemaining: 0.4, fieldBattle: true }, world);
  assert.equal(first.ok, true);
  assert.equal(controller(g, enemyProv), 'england');
  const prestigeAfterWin = g.factions.england.prestige;

  const duplicate = concludeBattle(g, battle, { victory: true, attackerRemaining: 0.85, enemyRemaining: 0.4, fieldBattle: true }, world);
  assert.equal(duplicate.ok, false);
  assert.equal(g.factions.england.prestige, prestigeAfterWin);
});

test('Phase 2 capital fort damage, Hometown construction & portable save round-trip preserve exact state', () => {
  const g = createGame(world, 'england');
  assert.equal(openHometown(g, world).ok, true);
  const h = homeRealm(g);
  const capId = h.capital;
  g.factions.england.treasury = 8000;
  h.stock.wood = 800;
  h.stock.stone = 800;
  h.stock.iron = 800;
  h.level = 5;

  const built = queueHome(g, world, 'building', 'forge', capId);
  assert.equal(built.ok, true);
  for (let i = 0; i < 6; i++) advanceMonth(g, world);
  assert.ok(hometownModifiers(g, 'england').power >= 1);

  g.provinces[capId].buildings.fort = 3;
  applyFortDamage(g, capId, { fortBreached: true });
  assert.equal(g.provinces[capId].buildings.fort, 2);

  const raw = snapshot(g);
  const parsed = validatePortableSave(raw);
  assert.equal(parsed.player, 'england');
  const restored = restoreGame(raw, world);
  assert.equal(restored.provinces[capId].buildings.fort, 2);
  assert.ok(Object.values(restored.armies).every(a =>
    a.infantry >= 0 && a.archers >= 0 && a.cavalry >= 0 && Number.isFinite(a.morale) && Number.isFinite(a.experience)
  ));
});
