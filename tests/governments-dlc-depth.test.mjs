import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createGame, advanceMonth, restoreGame, snapshot } from '../src/simulation.js';
import { buildHistoricalWorld, expandHistoricalWorld, densifyHistoricalWorld } from '../src/historical-world.js';
import { populateGlobalKingdoms } from '../src/world-kingdoms-1450.js';
import { initDlcSystems, dlcAction, dlcModifiers, dlcView, tickDlcSystems } from '../src/ck2-dlc-systems.js';
import { declareCrusade, pledgeCrusade, setCrusadeBeneficiary, resolveCrusadeIfReady, canonizeAncestor } from '../src/ck2-deep-systems.js';
import { regionalPoliticalView, tickRegionalPolitics } from '../src/regional-politics.js';

const rawWorld = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
const world = populateGlobalKingdoms(densifyHistoricalWorld(expandHistoricalWorld(buildHistoricalWorld(rawWorld))));

test('Phase 5: Merchant Republic 5 Patrician Houses, Palazzo, Trade Zone, and Doge elections', () => {
 const g = createGame(world, 'novgorod');
 const d = initDlcSystems(g, world);
 assert.ok(Array.isArray(d.patricianHouses.novgorod));
 assert.equal(d.patricianHouses.novgorod.length, 5);

 g.factions.novgorod.treasury += 800;
 const beforeTrade = dlcModifiers(g, 'novgorod').trade;
 const pal = dlcAction(g, world, 'patrician-palazzo');
 assert.ok(pal.ok, pal.msg);
 const tz = dlcAction(g, world, 'seize-trade-zone');
 assert.ok(tz.ok, tz.msg);
 const afterTrade = dlcModifiers(g, 'novgorod').trade;
 assert.ok(afterTrade > beforeTrade, `Expected palazzo + trade zone to increase trade modifier (${beforeTrade} -> ${afterTrade})`);

 const v = dlcView(g, 'novgorod');
 assert.equal(v.patricianHouses.length, 5);
 assert.ok(v.republicTradeZone.bonusPct >= 18);

 // Advance to Doge election turn
 g.turn = d.republicDogeElections.novgorod.nextTurn;
 d.lastTick = g.turn - 1;
 tickDlcSystems(g, world);
 assert.ok(d.republicDogeElections.novgorod.nextTurn > g.turn);
});

test('Phase 5: Nomad Multi-Clan Pasture Dispute and Settle-Feudal transition', () => {
 const g = createGame(world, 'horde');
 const d = initDlcSystems(g, world);
 assert.ok(d.nomadClans.horde.clans.length >= 3);

 // Simulate low clan sentiment triggering a grazing dispute
 d.nomadClans.horde.clanSentiment = 30;
 d.nomadClans.horde.clans[1].loyalty = 25;
 g.turn = 6;
 d.lastTick = 5;
 tickDlcSystems(g, world);
 assert.equal(d.nomadClans.horde.grazingDispute, true);
 assert.ok(dlcModifiers(g, 'horde').levy < 1.0);

 g.factions.horde.treasury += 500;
 const split = dlcAction(g, world, 'split-clan');
 assert.ok(split.ok, split.msg);
 assert.equal(d.nomadClans.horde.grazingDispute, false);

 // Settle into feudal realm
 d.nomadClans.horde.hordeManpower = 900;
 const settled = dlcAction(g, world, 'settle-feudal');
 assert.ok(settled.ok, settled.msg);
 assert.equal(g.civic.realms.horde.government, 'feudal');
 assert.equal(d.nomadClans.horde.settled, true);
});

test('Phase 5: Eastern Empire Stance, Imperial Themes, Sultanate Decadence & Dharmic Sects', () => {
 const g = createGame(world, 'ottomans');
 const d = initDlcSystems(g, world);
 assert.ok(d.easternStatus?.stance);
 const oldTurn = g.turn;
 g.turn = 36;
 d.lastTick = 35;
 tickDlcSystems(g, world);
 assert.equal(d.easternStatus.lastShift, 36);
 g.turn = oldTurn;

 // Sultanate decadence crisis threshold triggers stability/unrest fallout
 const rp = regionalPoliticalView(g, 'ottomans');
 assert.equal(rp.kind, 'sultanate');
 const ottoLand = Object.values(g.provinces).filter(p => p.owner === 'ottomans');
 g.turn = 6;
 tickRegionalPolitics(g, 'ottomans', ottoLand);
 assert.ok(g.institutions.realms.ottomans.regionalPolitics, 'tickRegionalPolitics should initialize sultanate regionalPolitics');
 g.institutions.realms.ottomans.regionalPolitics.decadence = 82;
 const prevStab = g.factions.ottomans.stability;
 g.turn = 12;
 tickRegionalPolitics(g, 'ottomans', ottoLand);
 assert.ok(g.factions.ottomans.stability < prevStab, 'High decadence should trigger a revolt crisis');

 // Dharmic patronage sects & temple endowments
 const gInd = createGame(world, 'vijayanagara');
 const dInd = initDlcSystems(gInd, world);
 assert.ok(dInd.dharmicState.vijayanagara);
 gInd.factions.vijayanagara.treasury += 300;
 const targetSect = dInd.dharmicState.vijayanagara.sect === 'guild' ? 'vaishnava' : 'guild';
 assert.ok(dlcAction(gInd, world, 'dharmic-sect', targetSect).ok);
 assert.ok(dlcAction(gInd, world, 'temple-endowment').ok);
 assert.equal(dInd.dharmicState.vijayanagara.templeEndowments, 1);

 // Save/reload preserves all Phase 5 DLC state
 const restored = restoreGame(snapshot(gInd), world);
 assert.equal(restored.dlcSystems.dharmicState.vijayanagara.sect, targetSect);
 assert.equal(restored.dlcSystems.dharmicState.vijayanagara.templeEndowments, 1);
});

test('Phase 5: Crusade Beneficiary Rewards and Saintly Canonization', () => {
 const g = createGame(world, 'france');
 const dec = declareCrusade(g, 'ottomans', 'france');
 assert.ok(dec.ok, dec.msg);
 const benCandidate = Object.values(g.politics.people).find(p => p.alive && p.realm === 'france' && p.age >= 16 && p.id !== g.politics.realms.france.ruler);
 assert.ok(benCandidate);
 const benRes = setCrusadeBeneficiary(g, 'france', benCandidate.id);
 assert.ok(benRes.ok, benRes.msg);

 const prevBenWealth = benCandidate.wealth || 0;
 const res = resolveCrusadeIfReady(g, true);
 assert.equal(res.status, 'victory');
 assert.ok(benCandidate.traits.includes('crusader'));
 assert.ok(benCandidate.wealth > prevBenWealth);

 // Canonize deceased pious ancestor
 benCandidate.alive = false;
 benCandidate.piety = 95;
 g.factions.france.treasury += 300;
 const canon = canonizeAncestor(g, 'france', benCandidate.id);
 assert.ok(canon.ok, canon.msg);
 assert.ok(g.deepSystems.canonized[benCandidate.id]);
});
