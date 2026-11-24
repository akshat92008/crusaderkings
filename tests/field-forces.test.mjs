import assert from 'node:assert/strict';
import test from 'node:test';
import {aggregateForce,participatingArmies,regimentTroops,applyFieldForceLosses,applyFieldLosses,combinedFieldStats} from '../src/field-forces.js';
import {armyFormationSlots} from '../src/military-doctrines.js';
test('participating armies include all eligible forces exactly once and exclude embarked troops',()=>{const g={armies:{a:{id:'a',owner:'r',province:'p',infantry:60,archers:1,cavalry:1},b:{id:'b',owner:'r',province:'p',infantry:20,archers:5,cavalry:0},c:{id:'c',owner:'r',province:'p',infantry:100},d:{id:'d',owner:'s',province:'p',infantry:100}},naval:{voyages:{c:{}}}};const list=participatingArmies(g,['a','a','b','c','d'],'r','p');assert.equal(list.length,2);const a=aggregateForce(list,{infantry:10});assert.equal(a.infantry,90);assert.equal(a.archers,6);assert.equal(a.cavalry,1);});
test('integer regiment allocation preserves every troop even in tiny categories',()=>{for(const a of [{infantry:101,archers:1,cavalry:1},{infantry:1,archers:0,cavalry:0},{infantry:0,archers:7,cavalry:8}]){const slots=armyFormationSlots('england',a,6);for(const t of ['infantry','archers','cavalry'])assert.equal(slots.reduce((n,k,i)=>n+(k===t?regimentTroops(a,slots,i):0),0),a[t]);}});
test('field casualties are applied independently to troop types and invalid ratios are bounded',()=>{const a={infantry:100,archers:40,cavalry:20};applyFieldLosses(a,{fieldBattle:true,roster:{attacker:{byType:{infantry:{initial:100,surviving:50},archers:{initial:40,surviving:36},cavalry:{initial:20,surviving:8}}}}},'attacker',.5);assert.deepEqual(a,{infantry:50,archers:36,cavalry:8});});

test('combined field stats weight the actual troops and do not extend commander buffs to garrisons',()=>{const armies=[{infantry:900,power:.5},{infantry:100,power:2}],r=combinedFieldStats(armies,{infantry:1000},a=>({power:a.power,speed:1,morale:80}),a=>({damage:a.power,name:'infantry'}),'infantry');assert.equal(r.readiness.power,.825);assert.equal(r.profile.damage,.825);assert.equal(r.readiness.morale,77.5);});

test('splitting an army does not change total tactical survivors', () => {
 const armies = [5,4,3,2,1].map(i => ({id:'a'+i, infantry:1, archers:0, cavalry:0}));
 const result = {fieldBattle:true, roster:{attacker:{byType:{infantry:{initial:5,surviving:2}}}}};
 applyFieldForceLosses(armies,result,'attacker',0);
 assert.equal(armies.reduce((n,a)=>n+a.infantry,0),2);
 assert.deepEqual(armies.filter(a=>a.infantry).map(a=>a.id),['a2','a1']);
});
