import test from 'node:test';
import assert from 'node:assert/strict';
import {initMilitary,armyReadiness,commanderCandidates,militaryAction,tickMilitary} from '../src/military-systems.js';

function fixture(){
 const army={id:'a',owner:'england',province:'x',infantry:100,archers:0,cavalry:0,morale:75};
 const g={player:'england',turn:1,armies:{a:army},factions:{england:{id:'england',treasury:1000},france:{id:'france',treasury:1000}},provinces:{x:{owner:'england'}},economy:{provinces:{x:{stock:{grain:20,tools:20,timber:20}}}},politics:{people:{c:{id:'c',realm:'england',alive:true,age:30,name:'General',skills:{martial:5}}},realms:{england:{council:{marshal:'c'}}}},feudal:{prisoners:{}}};
 initMilitary(g);const record=g.military.armies.a;record.commander='c';
 return {g,army,record};
}
for(const [name,change] of [
 ['defection',g=>g.politics.people.c.realm='france'],
 ['death',g=>g.politics.people.c.alive=false],
 ['capture',g=>g.feudal.prisoners.c={status:'held'}],
 ['underage character',g=>g.politics.people.c.age=15]
])test('commander bonuses cease immediately after '+name,()=>{
 const {g,army,record}=fixture();
 const before=armyReadiness(g,army).power;
 assert.equal(armyReadiness(g,army).commander,'General');
 change(g);
 assert.equal(armyReadiness(g,army).commander,null);
 assert.ok(armyReadiness(g,army).power<before);
 assert.equal(commanderCandidates(g,army.id).length,0);
 tickMilitary(g,{});assert.equal(record.commander,null);
});
test('enemy occupation prevents training, resupply and equipment purchases without charging resources',()=>{
 const {g}=fixture();g.campaignWar={occupations:{x:{by:'france'}}};
 const treasury=g.factions.england.treasury,stock={...g.economy.provinces.x.stock};
 for(const [action,extra] of [['specialize','skirmishers'],['engine','ram'],['resupply',null]])assert.equal(militaryAction(g,{},action,'a',extra).ok,false);
 assert.equal(g.factions.england.treasury,treasury);
 assert.deepEqual(g.economy.provinces.x.stock,stock);
});
test('empty armies consume no grain and release their assigned commanders',()=>{
 const {g,army,record}=fixture();army.infantry=0;
 tickMilitary(g,{});
 assert.equal(g.economy.provinces.x.stock.grain,20);
 assert.equal(record.commander,null);
 assert.equal(militaryAction(g,{},'resupply','a').ok,false);
});
