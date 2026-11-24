import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,startMarch,concludeBattle,validateFieldResult,snapshot} from '../src/simulation.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function fixture(){
 const g=createGame(world,'ottomans');
 const army=Object.values(g.armies).find(a=>a.owner===g.player);
 const from=world.provinces.find(p=>p.owner===g.player&&p.neighbors.some(id=>g.provinces[id]?.owner!==g.player&&g.provinces[id]?.owner!=='independent'));
 const to=from.neighbors.find(id=>g.provinces[id]?.owner!==g.player&&g.provinces[id]?.owner!=='independent');
 army.province=from.id;
 const battle=startMarch(g,world,from.id,to);assert.equal(battle.type,'battle');
 const result={fieldBattle:true,victory:false,attackerRemaining:.8,enemyRemaining:.9};
 return {g,army,battle,result};
}
for(const [name,change] of [
 ['different campaign month',({g})=>g.turn++],
 ['army moved',({army,battle})=>army.province=battle.to],
 ['army defeated',({army})=>Object.assign(army,{infantry:0,archers:0,cavalry:0})],
 ['army reinforcement',({army})=>army.infantry+=10],
 ['target transferred',({g,battle})=>g.provinces[battle.to].owner=g.player],
 ['peace treaty',({g,battle})=>g.factions[g.player].treaties[battle.enemy]='alliance'],
 ['invalid casualty ratio',({result})=>result.attackerRemaining=NaN]
])test('stale field battle is rejected: '+name,()=>{
 const f=fixture();change(f);const before=snapshot(f.g);
 assert.equal(validateFieldResult(f.g,f.battle,f.result,world).ok,false);
 assert.equal(concludeBattle(f.g,f.battle,f.result,world).ok,false);
 assert.equal(snapshot(f.g),before);
});
test('valid defeat is applied only once; a fresh deployment remains possible',()=>{
 const {g,battle,result}=fixture();
 assert.equal(validateFieldResult(g,battle,result,world).ok,true);
 assert.equal(concludeBattle(g,battle,result,world).ok,true);
 const before=snapshot(g);
 assert.equal(concludeBattle(g,battle,result,world).ok,false);
 assert.equal(snapshot(g),before);
 const next=startMarch(g,world,battle.from,battle.to);
 assert.equal(next.type,'battle');
 assert.equal(validateFieldResult(g,next,result,world).ok,true);
});
