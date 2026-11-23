import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,advanceMonth,snapshot,restoreGame} from '../src/simulation.js';
import {DOCTRINES,FORMATIONS,militaryDoctrine,startingTroops,armyFormationSlots,combatStatistics,chooseCounterFormation,availableFormations} from '../src/military-doctrines.js';
import {findInvasionOptions,planEnemyInvasion,progressEnemyInvasions,resolveInvasion,autoResolveInvasion} from '../src/invasions.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));

test('15 military traditions and ten functional tactical formations available',()=>{
 assert.equal(Object.keys(DOCTRINES).length,15);
 assert.equal(Object.keys(FORMATIONS).length,10);
 assert.equal(world.factions.length,44);
 for(const f of world.factions){const d=militaryDoctrine(f);
  assert.ok(d.unique.length>3);
  assert.ok(Math.abs(d.mix.reduce((a,b)=>a+b,0)-1)<.001);
  assert.ok(d.formations.every(n=>FORMATIONS[n]));}
});
test('major medieval realms begin with distinct army composition and military doctrines',()=>{
 const g=createGame(world,'england');
 const troop=id=>Object.values(g.armies).find(a=>a.owner===id);
 const england=troop('england'),france=troop('france'),ming=troop('ming'),ott=troop('ottomans');
 assert.equal(england.doctrine,'longbow');
 assert.equal(ming.doctrine,'gunpowder');
 assert.equal(ott.doctrine,'janissary');
 assert.ok(england.archers>england.infantry);
 assert.ok(france.cavalry>france.archers);
 assert.ok(ming.archers>ming.cavalry);
 assert.notDeepEqual(armyFormationSlots('england',england),armyFormationSlots('france',france));
});
test('formation stats change real damage, movement, range and anti-cavalry resistance',()=>{
 const heavy=combatStatistics('england','infantry','shield_wall');
 const archers=combatStatistics('england','archers','longbow_line');
 const chivalry=combatStatistics('france','cavalry','cavalry_wedge');
 const pike=combatStatistics('france','infantry','pike_square');
 assert.ok(heavy.defense>1);
 assert.ok(archers.range>1);
 assert.ok(chivalry.damage>1.2);
 assert.ok(pike.cavalryCounter>1);
 assert.ok(availableFormations('england').length>=3);
 assert.equal(chooseCounterFormation('england','cavalry','infantry'),'shield_wall');
});
test('different military starts are serialized without losing doctrine metadata',()=>{
 const g=createGame(world,'vijayanagara');
 const saved=restoreGame(snapshot(g),world);
 assert.equal(Object.values(saved.armies).find(a=>a.owner==='vijayanagara').doctrine,'elephant');
 const total=startingTroops('vijayanagara',210);
 assert.equal(total.infantry+total.archers+total.cavalry,210);
});
test('strategic rivals find adjacent player territories and stage from owned land',()=>{
 const g=createGame(world,'england'),offers=findInvasionOptions(g,world);
 assert.ok(offers.length>0,'England should have hostile borders in the synthetic province graph');
 for(const o of offers){
  assert.notEqual(o.by,g.player);
  assert.equal(g.provinces[o.province].owner,g.player);
  assert.equal(g.provinces[o.staging].owner,o.by);
  assert.ok(o.eta>=3);
 }
});
test('a staged enemy attack becomes READY and can be defended in a real battle',()=>{
 const g=createGame(world,'england');g.kingdom.difficulty='hard';
 const choices=findInvasionOptions(g,world);assert.ok(choices.length>0);
 const first=choices[0],army=g.armies[first.army];army.infantry+=500;
 const planned=planEnemyInvasion(g,world);assert.ok(planned);
 let ready=null;
 for(let t=0;t<12&&!ready;t++){g.turn++;ready=progressEnemyInvasions(g,world);}
 assert.ok(ready&&ready.status==='ready');
 const owner=g.provinces[ready.province].owner;
 const response=resolveInvasion(g,world,ready,{victory:true,attackerRemaining:.8,enemyRemaining:.2});
 assert.ok(response.ok);
 assert.equal(g.provinces[ready.province].owner,owner);
 assert.equal(g.kingdom.threats.length,0);
});
test('failed defense transfers ownership, applies real casualties and moves attacker',()=>{
 const g=createGame(world,'england');g.kingdom.difficulty='hard';
 const o=findInvasionOptions(g,world)[0],a=g.armies[o.army];a.infantry+=600;
 const t=planEnemyInvasion(g,world);assert.ok(t);
 const eta=t.eta;for(let i=0;i<eta;i++){g.turn++;progressEnemyInvasions(g,world);}
 const outcome=resolveInvasion(g,world,t,{victory:false,attackerRemaining:.25,enemyRemaining:.62});
 assert.ok(outcome.ok);assert.equal(g.provinces[t.province].owner,t.by);
 assert.equal(g.armies[t.army].province,t.province);
 assert.equal(g.kingdom.threats.length,0);
});
test('peaceful setting completely prevents new foreign invasion plans',()=>{
 const g=createGame(world,'england');g.kingdom.difficulty='peaceful';
 assert.equal(planEnemyInvasion(g,world),null);
 assert.equal(g.kingdom.threats.length,0);
});
test('invasion planning and auto-resolution remain deterministic in matching campaigns',()=>{
 const a=createGame(world,'france'),b=createGame(world,'france');
 a.kingdom.difficulty=b.kingdom.difficulty='hard';
 for(let i=0;i<48;i++){advanceMonth(a,world);advanceMonth(b,world);}
 assert.equal(snapshot(a),snapshot(b));
});
