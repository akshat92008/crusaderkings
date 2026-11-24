import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {findInvasionOptions,planEnemyInvasion,progressEnemyInvasions,resolveInvasion,nativeInvasionArmies} from '../src/invasions.js';
import {invasionReserved} from '../src/invasion-reservations.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function fixture(){
 const g=createGame(world,'england');g.kingdom.difficulty='hard';
 const original=findInvasionOptions(g,world)[0];assert.ok(original);
 const a=g.armies[original.army];a.infantry+=1500;
 const b={...a,id:'test-second-invasion-army',infantry:200,archers:0,cavalry:0,commander:null};g.armies[b.id]=b;
 return {g,a,b,original};
}
test('co-located enemy armies count toward one invasion and are reserved together',()=>{
 const {g,a,b,original}=fixture();
 const choices=findInvasionOptions(g,world).filter(t=>t.province===original.province&&t.staging===original.staging&&t.armies.includes(a.id));
 assert.equal(choices.length,1);assert.ok(choices[0].armies.includes(b.id));
 const threat=planEnemyInvasion(g,world);assert.ok(threat.armies.includes(a.id));assert.ok(threat.armies.includes(b.id));
 assert.ok(invasionReserved(g,a.id));assert.ok(invasionReserved(g,b.id));
 const restored=restoreGame(snapshot(g),world);assert.ok(invasionReserved(restored,b.id));
});
test('coordinated invasion moves both real armies and applies casualties to both',()=>{
 const {g,a,b}=fixture();const threat=planEnemyInvasion(g,world);
 for(let i=0;i<12&&threat.status!=='ready';i++){g.turn++;progressEnemyInvasions(g,world);}
 assert.equal(threat.status,'ready');assert.equal(a.province,threat.staging);assert.equal(b.province,threat.staging);
 const beforeA=a.infantry,beforeB=b.infantry;
 assert.ok(resolveInvasion(g,world,threat,{victory:true,attackerRemaining:.9,enemyRemaining:.5}).ok);
 assert.equal(a.infantry,Math.round(beforeA*.5));assert.equal(b.infantry,Math.round(beforeB*.5));assert.equal(invasionReserved(g,b.id),false);
});
test('legacy threat and missing or displaced supporting armies remain safe',()=>{
 const {g,a,b}=fixture();const old={army:a.id,by:a.owner};
 assert.deepEqual(nativeInvasionArmies(g,old).map(x=>x.id),[a.id]);
 const group={...old,armies:[a.id,b.id,b.id,'missing']};
 assert.equal(nativeInvasionArmies(g,group).length,2);
 b.province='not-at-staging';
 assert.deepEqual(nativeInvasionArmies(g,group).map(x=>x.id),[a.id]);
});
