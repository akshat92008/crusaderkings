import assert from 'node:assert/strict';
import test from 'node:test';
import {campaignArmyPower,campaignGarrison,automaticDefense,borderBattleOutcome} from '../src/border-battle.js';
const army=(n,morale=75,experience=0)=>({infantry:n,archers:0,cavalry:0,morale,experience});
test('strategic strength respects numbers, readiness, morale and experience symmetrically',()=>{
 const large=campaignArmyPower(army(6000),{power:.6,morale:35});
 const small=campaignArmyPower(army(300,100,1),{power:2,morale:100});
 assert.ok(large>small*3);
 for(const roll of [0,.5,1]){assert.ok(borderBattleOutcome(large,small,roll).victory);assert.equal(borderBattleOutcome(small,large,roll).victory,false);}
 assert.ok(campaignArmyPower(army(100,0))<campaignArmyPower(army(100,75)));
 assert.ok(campaignArmyPower(army(100,75,1))>campaignArmyPower(army(100)));
 assert.equal(campaignArmyPower(army(0)),0);
});
test('automatic defense maps attacker and defender losses to player-centric results',()=>{
 const strong=automaticDefense(300,6000),even=automaticDefense(5000,6000),weak=automaticDefense(6000,300);
 assert.equal(strong.victory,true);assert.equal(weak.victory,false);
 assert.ok(strong.attackerRemaining>even.attackerRemaining);
 assert.ok(strong.enemyRemaining<weak.enemyRemaining);
 assert.ok(weak.enemyRemaining>.95);
 for(const result of [strong,even,weak])for(const k of ['attackerRemaining','enemyRemaining'])assert.ok(result[k]>=0&&result[k]<=1);
});
test('garrison estimate remains identical across strategic contexts',()=>{assert.equal(campaignGarrison({development:5,buildings:{fort:2}}),195);assert.equal(campaignGarrison({}),45);});
