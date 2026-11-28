import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  openHometown,
  homeRealm,
  homeCapital,
  homeProduction,
  productionBreakdown,
  assignWorker,
  workforceProfile,
  queueHome,
  tickHometown,
  hometownModifiers,
  homeLevel
} from '../src/hometown.js';
import {createGame, empireStats} from '../src/simulation.js';
import {renderHometown, bindHometown} from '../src/hometown-ui.js';

const world = {
  provinces: [
    {id: 'a', name: 'Capitalia', centroid: [0, 0]},
    {id: 'b', name: 'Timbervale', centroid: [10, 0]}
  ]
};

function fixture() {
  return {
    player: 'r',
    turn: 0,
    year: 1450,
    month: 0,
    factions: {
      r: {name: 'Kingdom of Test', treasury: 100000, food: 5000, policies: {tax: 1, levy: 1, trade: 1}},
      s: {name: 'Rival', treasury: 1000, food: 500, policies: {tax: 1, levy: 1, trade: 1}}
    },
    provinces: {
      a: {id: 'a', owner: 'r', population: 120, development: 9, unrest: 0, buildings: {farm: 2, market: 1, barracks: 1, fort: 1}},
      b: {id: 'b', owner: 'r', population: 80, development: 4, unrest: 0, buildings: {farm: 1, market: 0, barracks: 0, fort: 0}},
      c: {id: 'c', owner: 's', population: 60, development: 5, unrest: 0, buildings: {farm: 1}}
    },
    armies: {
      arm1: {id: 'arm1', owner: 'r', province: 'a', infantry: 400, archers: 200, cavalry: 200}
    },
    economy: {
      realms: {r: {inflation: 0}, s: {inflation: 0}},
      provinces: {
        a: {resources: ['timber']},
        b: {resources: ['ore']}
      }
    },
    log: []
  };
}

function makeMockRoot() {
  const listeners = {};
  return {
    hidden: false,
    clientWidth: 1280,
    innerHTML: '',
    listeners,
    querySelector(sel) {
      if (sel === '.ht-scene-scroll') return null;
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener(type, fn) {
      (listeners[type] ??= []).push(fn);
    }
  };
}

test('productionBreakdown matches homeProduction and empireStats exactly without mutating state', () => {
  const g = fixture();
  const preOpen = productionBreakdown(g, world);
  const preStats = empireStats(g, 'r');
  assert.equal(preOpen.food.gross, preStats.grossFood);
  assert.equal(preOpen.food.consumption, preStats.foodUpkeep);
  assert.equal(preOpen.food.net, preStats.foodDelta);
  assert.deepEqual({wood: preOpen.wood.total, stone: preOpen.stone.total, iron: preOpen.iron.total}, homeProduction(g, 'r'));

  openHometown(g, world);
  const h = homeRealm(g);
  g.hometown.buildings.a = {well: 2, mill: 1, bakery: 1, lumber: 3, quarry: 2, iron: 2, foundry: 1, school: 2, library: 1, workshop: 1};
  h.level = 8;
  h.research = {farming: 3, forestry: 2, masonry: 2, mining: 2, education: 3, siege: 2};

  const snapBefore = JSON.stringify({treasury: g.factions.r.treasury, food: g.factions.r.food, stock: h.stock, knowledge: h.knowledge});
  const bd = productionBreakdown(g, world);
  const stats = empireStats(g, 'r');
  const prod = homeProduction(g, 'r');
  const snapAfter = JSON.stringify({treasury: g.factions.r.treasury, food: g.factions.r.food, stock: h.stock, knowledge: h.knowledge});

  assert.equal(snapBefore, snapAfter, 'productionBreakdown must be pure and never mint resources');
  assert.equal(bd.food.gross, stats.grossFood);
  assert.equal(bd.food.consumption, stats.foodUpkeep);
  assert.equal(bd.food.net, stats.foodDelta);
  assert.equal(bd.wood.total, prod.wood);
  assert.equal(bd.stone.total, prod.stone);
  assert.equal(bd.iron.total, prod.iron);

  // Verify additive food chain sum matches grossExact
  const foodChainSum = bd.food.populationBase + bd.food.farms + bd.food.localBuildings + bd.food.research + bd.food.workforce;
  assert.ok(Math.abs(foodChainSum - bd.food.grossExact) <= 0.3, `expected ${foodChainSum} ~= ${bd.food.grossExact}`);
  assert.ok(bd.food.localBuildings > 0);
  assert.ok(bd.food.localByBuilding.well > 0 && bd.food.localByBuilding.mill > 0 && bd.food.localByBuilding.bakery > 0);

  // Verify material building + deposit sources
  assert.equal(bd.wood.byBuilding.lumber, 12);
  assert.equal(bd.wood.depositBonus, 3);
  assert.equal(bd.stone.byBuilding.quarry, 6);
  assert.equal(bd.iron.byBuilding.iron, 4);
  assert.equal(bd.iron.byBuilding.foundry, 3);

  // Verify knowledge chain matches tickHometown monthly increment
  const kBefore = h.knowledge || 0;
  g.turn++;
  tickHometown(g, world);
  assert.equal(Number((h.knowledge - kBefore).toFixed(1)), bd.knowledge.monthly);
  assert.equal(bd.military.siegeWorkshopReady, true);
  assert.ok(bd.military.unlockedEngines.includes('catapult'));
});

test('productionBreakdown reflects worker shifts and building upgrades deterministically', () => {
  const g = fixture();
  openHometown(g, world);
  const base = productionBreakdown(g, world);

  assert.ok(assignWorker(g, 'r', 'farmers', 6));
  const afterFarmers = productionBreakdown(g, world);
  assert.ok(afterFarmers.food.workforceMult > 1);
  assert.ok(afterFarmers.food.gross > base.food.gross);
  assert.equal(afterFarmers.food.gross, empireStats(g, 'r').grossFood);

  assert.ok(assignWorker(g, 'r', 'auto', 0));
  assert.ok(assignWorker(g, 'r', 'woodcutters', 4));
  const afterWood = productionBreakdown(g, world);
  assert.ok(afterWood.wood.workforceMult > 1);
  assert.equal(afterWood.wood.total, homeProduction(g, 'r').wood);

  assert.ok(assignWorker(g, 'r', 'auto', 0));
  assert.ok(assignWorker(g, 'r', 'scholars', 4));
  const afterScholars = productionBreakdown(g, world);
  assert.ok(afterScholars.knowledge.workforceMult > 1);
  assert.ok(afterScholars.knowledge.monthly > base.knowledge.monthly);

  assert.ok(assignWorker(g, 'r', 'auto', 0));
  const reset = productionBreakdown(g, world);
  assert.equal(reset.food.gross, base.food.gross);
  assert.equal(reset.wood.total, base.wood.total);
  assert.equal(reset.knowledge.monthly, base.knowledge.monthly);

  // Building upgrade on real campaign data
  const w = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
  const camp = createGame(w, 'england');
  assert.ok(openHometown(camp, w).ok);
  const cap = homeCapital(camp, w);
  const campRealm = homeRealm(camp);
  campRealm.stock = {wood: 10000, stone: 10000, iron: 10000};
  camp.factions.england.treasury = 100000;
  camp.factions.england.food = 10000;
  const beforeUpgrade = productionBreakdown(camp, w);
  assert.ok(queueHome(camp, w, 'building', 'lumber', cap).ok);
  camp.turn++;
  tickHometown(camp, w);
  const afterUpgrade = productionBreakdown(camp, w);
  assert.equal(homeLevel(camp, cap, 'lumber'), 1);
  assert.ok(afterUpgrade.wood.total > beforeUpgrade.wood.total);
  assert.equal(afterUpgrade.wood.total, homeProduction(camp, 'england').wood);
});

test('renderHometown renders ledger, stage badges, worker pills, and Siege/Arsenal highlights cleanly', () => {
  const g = fixture();
  openHometown(g, world);
  const h = homeRealm(g);
  h.level = 7;
  g.hometown.buildings.a = {workshop: 1, stable: 1, archery: 1};
  h.research = {siege: 2};

  const root = makeMockRoot();
  let curG = g;
  renderHometown(curG, world, root);

  const html = root.innerHTML;
  // Exact structural hooks
  assert.ok(html.includes('<div class="ht-food-summary">'), 'food summary present');
  assert.ok(html.indexOf('ht-food-summary') < html.indexOf('ht-ledger'), 'ledger appears right after food summary');
  assert.ok(html.includes('Monthly Production Ledger &amp; Chains'));
  assert.ok(html.includes('Stage 7/10'));
  assert.ok(html.includes('ht-work-pill'));
  assert.ok(html.includes('Workforce Allocation'));
  assert.ok(html.includes('Siege workshop'));
  assert.ok(html.includes('Royal arsenal'));
  assert.ok(html.includes('ht-ledger-body" hidden'), 'ledger body initially collapsed');

  // Verify 6 resource cards and 5 nav tabs
  const resSection = html.split('<div class="ht-resources">')[1].split('</div><nav class="ht-tabs"')[0];
  assert.equal((resSection.match(/<div><small>/g) || []).length, 6);
  const tabSection = html.split('<nav class="ht-tabs" aria-label="Capital management">')[1].split('</nav>')[0];
  assert.equal((tabSection.match(/data-ht="tab"/g) || []).length, 5);

  // Bind and toggle ledger + switch to military tab
  bindHometown(root, () => curG, () => world, () => {}, () => {}, () => renderHometown(curG, world, root), () => {}, () => {});
  const clickHandler = root.listeners.click[0];
  assert.ok(clickHandler);

  clickHandler({target: {closest: () => ({disabled: false, dataset: {ht: 'ledger', key: '', id: ''}})}});
  assert.ok(!root.innerHTML.includes('ht-ledger-body" hidden'), 'ledger body expands on click');
  assert.ok(root.innerHTML.includes('Food Chain'));
  assert.ok(root.innerHTML.includes('Timber Chain'));
  assert.ok(root.innerHTML.includes('Stone Chain'));
  assert.ok(root.innerHTML.includes('Iron Chain'));
  assert.ok(root.innerHTML.includes('Knowledge Chain'));

  clickHandler({target: {closest: () => ({disabled: false, dataset: {ht: 'tab', key: 'military', id: ''}})}});
  assert.ok(root.innerHTML.includes('<h3>Raise troops at the capital</h3>'));
  assert.ok(root.innerHTML.includes('Siege Workshop, Arsenal &amp; Garrisons'));
  assert.ok(root.innerHTML.includes('Engine Unlocked'));

  for (const tab of ['provinces', 'buildings', 'research', 'town']) {
    clickHandler({target: {closest: () => ({disabled: false, dataset: {ht: 'tab', key: tab, id: ''}})}});
    assert.ok(root.innerHTML.length > 200);
  }
});
