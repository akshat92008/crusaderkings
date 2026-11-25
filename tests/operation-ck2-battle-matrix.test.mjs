import assert from 'node:assert/strict';
import test from 'node:test';
import {
 borderBattleOutcome,
 automaticDefense,
 campaignArmyPower,
 campaignGarrison,
 terrainCombatModifiers,
 resolveCampaignBattle
} from '../src/border-battle.js';

function seededRolls(count, seed = 14502026) {
 let s = seed >>> 0;
 const out = [];
 for (let i = 0; i < count; i++) {
  s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
  out.push(s / 4294967296);
 }
 return out;
}

test('operation CK2 battle matrix covers all required force ratios deterministically', () => {
 const rolls = seededRolls(120);
 const winRate = (att, def) => rolls.filter(r => borderBattleOutcome(att, def, r).victory).length / rolls.length;

 const r300v300 = winRate(300, 300);
 const r600v300 = winRate(600, 300);
 const r1000v300 = winRate(1000, 300);
 const r3000v300 = winRate(3000, 300);
 const r6000v300 = winRate(6000, 300);
 const r300v6000 = winRate(300, 6000);

 assert.ok(r300v300 >= 0.40 && r300v300 <= 0.60, `300v300 win rate out of band: ${r300v300}`);
 assert.ok(r600v300 >= 0.70 && r600v300 <= 0.90, `600v300 win rate out of band: ${r600v300}`);
 assert.ok(r1000v300 >= 0.92, `1000v300 win rate expected >= 0.92, got ${r1000v300}`);
 assert.ok(r3000v300 >= 0.98, `3000v300 win rate expected >= 0.98, got ${r3000v300}`);
 assert.equal(r6000v300, 1.0, `6000v300 must always win, got ${r6000v300}`);
 assert.equal(r300v6000, 0.0, `300v6000 must always lose, got ${r300v6000}`);

 for (const [att, def] of [[300, 300], [600, 300], [1000, 300], [3000, 300], [6000, 300], [300, 6000]]) {
  const res = borderBattleOutcome(att, def, 0.5);
  assert.ok(res.attackerLoss >= 0.01 && res.attackerLoss <= 0.70);
  assert.ok(res.defenderLoss >= 0.01 && res.defenderLoss <= 0.75);
 }
});

test('automaticDefense matches borderBattleOutcome ratios and preserves defender advantage', () => {
 const d300v300 = automaticDefense(300, 300);
 assert.equal(d300v300.victory, true, 'Defender 1.13x advantage wins equal 300v300 neutral assault');

 const d600v300 = automaticDefense(600, 300);
 assert.equal(d600v300.victory, false, '600 offense overwhelms 300 defense');

 const d1000v300 = automaticDefense(1000, 300);
 assert.equal(d1000v300.victory, false);
 assert.ok(d1000v300.enemyRemaining > 0.70);

 const d3000v300 = automaticDefense(3000, 300);
 assert.equal(d3000v300.victory, false);
 assert.ok(d3000v300.enemyRemaining > 0.90);

 const d6000v300 = automaticDefense(6000, 300);
 assert.equal(d6000v300.victory, false);
 assert.ok(d6000v300.enemyRemaining > 0.95);
 assert.ok(d6000v300.attackerRemaining <= 0.45);

 const d300v6000 = automaticDefense(300, 6000);
 assert.equal(d300v6000.victory, true);
 assert.ok(d300v6000.attackerRemaining >= 0.95);
 assert.ok(d300v6000.enemyRemaining < 0.75);
 assert.equal(d300v6000.fieldBattle, true);
});

test('terrainCombatModifiers and resolveCampaignBattle combine garrison and army power consistently', () => {
 const plains = terrainCombatModifiers('plains');
 const mtns = terrainCombatModifiers('mountains');
 assert.ok(mtns.defense > plains.defense);

 const small = { infantry: 300, archers: 0, cavalry: 0, morale: 80, experience: 0.1 };
 const large = { infantry: 6000, archers: 0, cavalry: 0, morale: 80, experience: 0.1 };
 assert.ok(campaignArmyPower(large) > campaignArmyPower(small) * 10);

 const prov = { terrain: 'hills', development: 4, buildings: { fort: 1 } };
 assert.ok(campaignGarrison(prov) > 100);

 const battle = resolveCampaignBattle({
  attackers: [large],
  defenders: [small],
  province: prov,
  garrison: 'auto',
  roll: 0.5
 });
 assert.equal(battle.victory, true);
 assert.equal(battle.terrain, 'hills');
 assert.ok(battle.ratio > 5);
});
