import test from 'node:test';
import assert from 'node:assert/strict';
import {borderBattleOutcome,proportionalLoss,campaignArmyPower,automaticDefense} from '../src/border-battle.js';
const army=n=>({infantry:Math.floor(n*.6),archers:Math.floor(n*.3),cavalry:n-Math.floor(n*.6)-Math.floor(n*.3),morale:75,experience:.2});
const types=['infantry','archers','cavalry'];
const roll=seed=>((Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;
const matrix=[[300,300,30,70],[600,300,90,100],[1000,300,100,100],[3000,300,100,100],[6000,300,100,100],[300,6000,0,0]];
for(const [a,d,min,max] of matrix)test(`${a} vs ${d}: 100 seeded outcomes`,()=>{
 let wins=0;for(let i=0;i<100;i++){
  const attacker=army(a),defender=army(d);
  const beforeA={...attacker},beforeD={...defender};
  const result=borderBattleOutcome(campaignArmyPower(attacker),campaignArmyPower(defender),roll(i*7919+17));
  wins+=Number(result.victory);
  proportionalLoss(attacker,result.attackerLoss);proportionalLoss(defender,result.defenderLoss);
  for(const [after,before] of [[attacker,beforeA],[defender,beforeD]])for(const type of types){assert.ok(Number.isInteger(after[type]));assert.ok(after[type]>=0&&after[type]<=before[type]);}
 }
 console.log(`${a} vs ${d}: ${wins}/100 attacker victories`);assert.ok(wins>=min&&wins<=max);
});
test('automatic defense reports correct side and surviving fraction',()=>{
 const victory=automaticDefense(300,6000),defeat=automaticDefense(6000,300);
 assert.equal(victory.victory,true);assert.equal(defeat.victory,false);
 for(const result of [victory,defeat])for(const k of ['attackerRemaining','enemyRemaining'])assert.ok(result[k]>=0&&result[k]<=1);
});
