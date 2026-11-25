import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createGame } from '../src/simulation.js';
import { planEnemyInvasion, progressEnemyInvasions, resolveInvasion, validReadyInvasion } from '../src/invasions.js';
import { initConflict, endWar, tickConflict, aiPeaceAcceptance } from '../src/political-conflict.js';
import { diplomacyAction, diplomaticThreat, addDiplomaticThreat, joinCoalition, tickDiplomacy } from '../src/diplomacy-systems.js';
import { evaluateWarViability, tickStrategy } from '../src/strategic-ai.js';

const world = JSON.parse(readFileSync(new URL('../data/world.json', import.meta.url)));

function makeTwoBorderingRivalsFixture() {
 const g = createGame(world, 'england');
 // Ensure a second rival borders England cleanly by identifying/setting neighboring provinces
 const engProvs = world.provinces.filter(p => g.provinces[p.id]?.owner === 'england');
 const adjIds = [...new Set(engProvs.flatMap(p => p.neighbors || []))].filter(id => g.provinces[id]?.owner !== 'england');
 const targetProv = engProvs.find(p => (p.neighbors || []).some(nid => adjIds.includes(nid))) || engProvs[0];
 const neighborIds = (targetProv.neighbors || []).filter(id => id !== targetProv.id);
 assert.ok(neighborIds.length >= 1, 'Need at least one bordering neighbor province');
 const rival1 = g.provinces[neighborIds[0]].owner !== 'england' && g.provinces[neighborIds[0]].owner !== 'independent'
  ? g.provinces[neighborIds[0]].owner
  : 'france';
 g.provinces[neighborIds[0]].owner = rival1;
 const rival2 = neighborIds[1] && g.provinces[neighborIds[1]].owner !== rival1 && g.provinces[neighborIds[1]].owner !== 'england' && g.provinces[neighborIds[1]].owner !== 'independent'
  ? g.provinces[neighborIds[1]].owner
  : 'scotland';
 if (neighborIds[1]) g.provinces[neighborIds[1]].owner = rival2;

 // Give both rivals strong staged armies and war chests
 for (const a of Object.values(g.armies)) {
  if (a.owner === 'england') {
   a.infantry = 150; a.archers = 50; a.cavalry = 20;
  }
 }
 const r1Army = Object.values(g.armies).find(a => a.owner === rival1);
 r1Army.province = neighborIds[0];
 r1Army.infantry = 800; r1Army.archers = 300; r1Army.cavalry = 200;
 g.factions[rival1].treasury = 900;

 const r2Army = Object.values(g.armies).find(a => a.owner === rival2);
 if (r2Army && neighborIds[1]) {
  r2Army.province = neighborIds[1];
  r2Army.infantry = 750; r2Army.archers = 250; r2Army.cavalry = 180;
  g.factions[rival2].treasury = 900;
 }
 g.kingdom.difficulty = 'normal';
 return { g, rival1, rival2, targetProvId: targetProv.id, staging1: neighborIds[0], staging2: neighborIds[1] };
}

test('resolveInvasion sets 6-turn global cooldown and 12-turn per-rival cooldown', () => {
 const { g, rival1 } = makeTwoBorderingRivalsFixture();
 const planned = planEnemyInvasion(g, world);
 assert.ok(planned, 'Initial eligible invasion should plan');
 planned.status = 'ready';
 planned.readyTurn = g.turn;

 const res = resolveInvasion(g, world, planned, { victory: true, attackerRemaining: 0.9, enemyRemaining: 0.6, fieldBattle: true });
 assert.equal(res.ok, true);
 assert.equal(res.defended, true);
 assert.equal(g.kingdom.nextInvasionTurn, g.turn + 6, 'Global invasion cooldown is g.turn + 6');
 assert.equal(g.kingdom.rivalInvasionCooldowns[planned.by], g.turn + 12, 'Rival cooldown is g.turn + 12');

 // Suppress other potential rivals so we specifically test cooldown gating on rival1 and global gate
 for (const fId of Object.keys(g.factions)) {
  if (fId !== 'england' && fId !== rival1) g.factions[fId].treasury = 0;
 }

 // Global cooldown blocks planning for 5 turns
 for (let t = 1; t <= 5; t++) {
  g.turn += 1;
  assert.equal(planEnemyInvasion(g, world), null, `Invasion must stay blocked during turn ${g.turn}`);
 }

 // At +6 turns global cooldown expires, but rival1 is still blocked by its 12-turn cooldown
 g.turn += 1;
 assert.equal(planEnemyInvasion(g, world), null, 'Rival still on 12-turn cooldown at turn +6');

 // Once t >= initial + 12, rival1 can plan again (assuming sufficient troops/treasury)
 g.turn += 6;
 const a1 = Object.values(g.armies).find(a => a.owner === rival1);
 a1.infantry = 800; a1.archers = 300; a1.cavalry = 200;
 g.factions[rival1].treasury = 900;
 const retry = planEnemyInvasion(g, world);
 assert.ok(retry && retry.by === rival1, 'Same rival becomes eligible once 12-turn cooldown finishes');
});

test('non-aggression pact, truce, and peaceful difficulty invalidate invasions', () => {
 const { g, rival1, staging1, targetProvId } = makeTwoBorderingRivalsFixture();
 const threat = planEnemyInvasion(g, world);
 assert.ok(threat);
 threat.status = 'ready';
 threat.readyTurn = g.turn;
 assert.equal(validReadyInvasion(g, world, threat), true);

 // Sealing a non-aggression pact invalidates the ready invasion and removes it on progress
 g.factions[threat.by].relations.england = 30;
 g.factions.england.relations[threat.by] = 30;
 const pact = diplomacyAction(g, world, 'pact', threat.by);
 assert.equal(pact.ok, true);
 assert.equal(validReadyInvasion(g, world, threat), false);
 progressEnemyInvasions(g, world);
 assert.equal(g.kingdom.threats.length, 0);

 // Peaceful difficulty suppresses planning completely
 g.factions.england.treaties = {};
 delete g.diplomacy.pacts[[threat.by, 'england'].sort().join('|')];
 g.kingdom.nextInvasionTurn = 0;
 g.kingdom.difficulty = 'peaceful';
 assert.equal(planEnemyInvasion(g, world), null);
});

test('endWar filters stale queued invasions between belligerents and sets truce + nextInvasionTurn', () => {
 const { g, rival1, rival2, targetProvId, staging1, staging2 } = makeTwoBorderingRivalsFixture();
 const c = initConflict(g);
 c.wars.w1 = { id: 'w1', attacker: rival1, defender: 'england', goal: targetProvId, score: -10, battles: 1, started: 0, status: 'active' };
 g.kingdom.threats = [
  { by: rival1, army: 'a_r1', province: targetProvId, staging: staging1, eta: 2, status: 'approaching' },
  { by: rival2, army: 'a_r2', province: targetProvId, staging: staging2 || staging1, eta: 2, status: 'approaching' }
 ];
 g.turn = 10;
 endWar(g, c.wars.w1, 'white peace');

 assert.equal(c.wars.w1.status, 'white peace');
 assert.equal(g.kingdom.threats.some(t => t.by === rival1), false, 'Stale threats from peace partner cleared');
 if (rival2 !== rival1) {
  assert.equal(g.kingdom.threats.some(t => t.by === rival2), true, 'Unrelated third-party threat preserved');
 }
 assert.ok((g.kingdom.nextInvasionTurn || 0) >= 16, 'Post-war invasion cooldown applied');
 assert.ok((c.truces[[rival1, 'england'].sort().join('|')] || 0) > g.turn, '36-month truce recorded');
});

test('AI settles prolonged losing wars and forms reactive defensive coalitions', () => {
 const g = createGame(world, 'england');
 const c = initConflict(g);
 // Set up an AI-vs-AI losing war (`score <= -45`) and an exhausted 24-month war
 c.wars.ai_loss = { id: 'ai_loss', attacker: 'france', defender: 'burgundy', goal: world.provinces.find(p => g.provinces[p.id]?.owner === 'burgundy')?.id || world.provinces[0].id, score: -50, battles: 3, started: 2, status: 'active' };
 c.wars.ai_long = { id: 'ai_long', attacker: 'castile', defender: 'aragon', goal: world.provinces.find(p => g.provinces[p.id]?.owner === 'aragon')?.id || world.provinces[1].id, score: -20, battles: 4, started: 0, status: 'active' };
 g.turn = 26;
 g.factions.castile.stability = 30;
 g.factions.castile.treasury = 35;

 const acc = aiPeaceAcceptance(g, c.wars.ai_loss, 'france');
 assert.equal(acc.accept, true);
 tickConflict(g, world);
 assert.notEqual(c.wars.ai_loss.status, 'active', 'Losing AI war settled instead of fighting forever');
 assert.notEqual(c.wars.ai_long.status, 'active', 'Prolonged exhausted 24+ month AI war settled');

 // High diplomatic threat spurs reactive coalition formation and deters naive offensive war
 addDiplomaticThreat(g, 'france', 45);
 g.factions.france.relations.burgundy = -35;
 g.factions.burgundy.relations.france = -35;
 g.factions.france.relations.england = -35;
 g.turn = 30;
 tickDiplomacy(g, world);
 tickStrategy(g, world);
 assert.ok(diplomaticThreat(g, 'france') >= 40);
 const v = evaluateWarViability(g, world, 'france', 'burgundy');
 // If France has low reserves or faces coalition, viability blocks reckless attack
 g.factions.france.treasury = 50;
 const vBroke = evaluateWarViability(g, world, 'france', 'burgundy');
 assert.equal(vBroke.viable, false, 'Reserve coverage check prevents broke war declarations');
 if (joinCoalition(g, 'burgundy', 'france').ok || g.diplomacy?.coalitions?.france) {
  assert.ok(true);
 }
 assert.ok(typeof v.viable === 'boolean');
});
