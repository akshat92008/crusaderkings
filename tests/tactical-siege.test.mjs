import assert from 'node:assert/strict';
import test from 'node:test';
import {BattleGame} from '../src/battle.js';
import {createSiegeState} from '../src/military-systems.js';
test('tactical update breaches a gate before granting victory',()=>{
 const b=Object.create(BattleGame.prototype);
 const unit={side:'attacker',x:0,z:-17,life:100,initialLife:100,troopCount:30,damage:20,range:3,speed:4,readiness:{siege:32},cooldown:0,phase:0,manual:false,routed:false,type:'infantry',morale:100,targetX:0,targetZ:-18};
 Object.assign(b,{groups:[unit],keys:new Set(),camera:{target:[0,0,0]},siege:createSiegeState(1),projectiles:[],elapsed:0,report:()=>{},onFinish:r=>b.result=r,done:false});
 b.update(.05);assert.equal(b.done,false);
 for(let i=0;i<2000&&!b.done;i++)b.update(.05);
 assert.ok(b.result?.victory);assert.equal(b.result.fieldBattle,false);assert.ok(b.result.fortBreached);assert.equal(b.result.attackerRemaining,1);
});
test('failed assault cannot claim victory while a gate remains intact',()=>{
 const b=Object.create(BattleGame.prototype);
 const unit={side:'attacker',x:0,z:24,life:100,initialLife:100,troopCount:30,damage:1,range:1,speed:0,readiness:{siege:0},cooldown:0,phase:0,manual:false,routed:false,type:'infantry',morale:100,targetX:0,targetZ:24};
 Object.assign(b,{groups:[unit],keys:new Set(),camera:{target:[0,0,0]},siege:createSiegeState(3),projectiles:[],elapsed:219.99,report:()=>{},onFinish:r=>b.result=r,done:false});
 b.update(.05);assert.equal(b.result.victory,false);assert.equal(b.result.fieldBattle,false);assert.equal(b.result.fortBreached,false);
});
