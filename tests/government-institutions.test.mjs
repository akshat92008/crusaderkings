import assert from 'node:assert/strict';
import test from 'node:test';
import {initInstitutions,institutionState,institutionModifiers,institutionTargets,governmentAction,tickInstitutions,INSTITUTION_TYPES} from '../src/government-institutions.js';
function fixture(mode){const g={player:'a',turn:0,year:1450,month:0,log:[],factions:{a:{name:'A',treasury:1000,food:100,stability:60,relations:{b:50}},b:{name:'B',treasury:1000,food:100,stability:60,relations:{a:50}}},provinces:{p:{id:'p',owner:'a'},q:{id:'q',owner:'a'},z:{id:'z',owner:'b'}},civic:{realms:{a:{government:mode},b:{government:'feudal'}}},politics:{realms:{a:{ruler:'r'},b:{ruler:'s'}},people:{r:{id:'r',realm:'a',age:40,alive:true,skills:{stewardship:4}},s:{id:'s',realm:'b',age:40,alive:true,skills:{stewardship:3}},n:{id:'n',realm:'a',age:30,alive:true,wealth:100,skills:{stewardship:5}},m:{id:'m',realm:'a',age:30,alive:true,wealth:100,skills:{stewardship:3}}},holdings:{p:{realm:'a',lord:'n',loyalty:30,autonomy:0},q:{realm:'a',lord:'m',loyalty:40,autonomy:1}}},armies:{x:{owner:'a',morale:50}},conflict:{wars:{}},feudal:{prisoners:{}}};initInstitutions(g);return g;}
test('all thirteen government profiles map to seven institution modes',()=>{assert.equal(Object.keys(INSTITUTION_TYPES).length,13);assert.equal(new Set(Object.values(INSTITUTION_TYPES).map(d=>d.mode)).size,7);});
test('estate compacts cost funds and provide loyalty and levy support until expiry',()=>{const g=fixture('feudal');assert.ok(governmentAction(g,{},'p').ok);assert.equal(g.factions.a.treasury,860);assert.equal(g.politics.holdings.p.loyalty,48);assert.ok(institutionModifiers(g,'a').levy>1);assert.equal(governmentAction(g,{},'q').ok,false);g.turn=36;tickInstitutions(g);assert.equal(institutionModifiers(g,'a').levy,1);});
test('administrators increase tax yield and cannot hold duplicate posts or retain captured provinces',()=>{const g=fixture('imperial');assert.ok(governmentAction(g,{},'p','n').ok);assert.ok(institutionModifiers(g,'a').tax>1);g.turn=6;assert.equal(governmentAction(g,{},'q','n').ok,false);g.provinces.p.owner='b';tickInstitutions(g);assert.equal(institutionState(g,'a').offices.p,undefined);assert.equal(institutionModifiers(g,'a').tax,1);});
test('merchant investment grows private wealth and trade; imprisoned households lose bonuses',()=>{const g=fixture('republic');assert.ok(governmentAction(g,{},'n').ok);assert.ok(institutionModifiers(g,'a').trade>1);const wealth=g.politics.people.n.wealth;g.turn=3;tickInstitutions(g);assert.ok(g.politics.people.n.wealth>wealth);g.feudal.prisoners.n={status:'held'};g.turn=4;tickInstitutions(g);assert.equal(institutionModifiers(g,'a').trade,1);});
test('military retainers improve morale and levy capacity',()=>{const g=fixture('shogunate');assert.ok(governmentAction(g,{},'n').ok);assert.equal(g.armies.x.morale,56);assert.ok(institutionModifiers(g,'a').levy>1);});
test('herds generate food and lose stock during shortages',()=>{const g=fixture('steppe');assert.ok(governmentAction(g,{}).ok);assert.equal(institutionState(g,'a').herds,25);g.turn=3;tickInstitutions(g);assert.ok(g.factions.a.food>100);const old=institutionState(g,'a').herds;g.factions.a.food=-20;g.turn=6;tickInstitutions(g);assert.ok(institutionState(g,'a').herds<old);});
test('community reserves respond to shortages without endless food generation',()=>{const g=fixture('kinship');assert.ok(governmentAction(g,{}).ok);g.factions.a.food=50;g.turn=3;tickInstitutions(g);assert.equal(g.factions.a.food,80);assert.equal(institutionState(g,'a').reserves,10);g.factions.a.food=0;g.turn=6;tickInstitutions(g);assert.equal(institutionState(g,'a').reserves,0);assert.equal(g.factions.a.food,10);});
test('tribute transfers gold without creation and stops at war',()=>{const g=fixture('tributary');assert.ok(governmentAction(g,{},'b').ok);const total=g.factions.a.treasury+g.factions.b.treasury;g.turn=1;tickInstitutions(g);assert.equal(g.factions.a.treasury,905);assert.equal(g.factions.b.treasury,995);assert.equal(g.factions.a.treasury+g.factions.b.treasury,total);g.conflict.wars.w={status:'active',attacker:'a',defender:'b'};g.turn=2;tickInstitutions(g);assert.equal(institutionState(g,'a').tributes.b,undefined);assert.equal(g.factions.b.treasury,995);});
test('newly formed realms initialize institutions and saved records persist',()=>{const g=fixture('steppe');assert.ok(governmentAction(g,{}).ok);const copy=JSON.parse(JSON.stringify(g));initInstitutions(copy);assert.equal(institutionState(copy,'a').herds,25);copy.civic.realms.c={government:'city'};initInstitutions(copy);assert.equal(institutionState(copy,'c').mode,'merchants');});

import {GOVERNMENT_MOTIONS,governmentMotionView} from '../src/government-deliberations.js';
test('government-specific motions cover all profiles and preserve the existing institutions',()=>{assert.deepEqual(Object.keys(GOVERNMENT_MOTIONS).sort(),Object.keys(INSTITUTION_TYPES).sort());assert.equal(new Set(Object.values(GOVERNMENT_MOTIONS).map(x=>x.name)).size,13);});
test('assembly votes are delayed, weighted, save-safe and can enact or repeal a policy',()=>{
 const g=fixture('feudal');g.politics.holdings.p.loyalty=80;g.politics.holdings.q.loyalty=80;
 const v=governmentMotionView(g,'a');assert.equal(v.weight,4);assert.equal(v.yes,4);
 assert.ok(governmentAction(g,{},'motion:propose').ok);assert.equal(g.factions.a.treasury,870);
 assert.equal(governmentAction(g,{},'motion:propose').ok,false);
 const copy=JSON.parse(JSON.stringify(g));initInstitutions(copy);copy.turn=2;tickInstitutions(copy);assert.equal(governmentMotionView(copy,'a').active,false);
 copy.turn=3;tickInstitutions(copy);assert.equal(governmentMotionView(copy,'a').active,true);assert.equal(institutionModifiers(copy,'a').levy,1.10);assert.equal(institutionModifiers(copy,'a').tax,.94);
 assert.equal(governmentAction(copy,{},'motion:propose').ok,false);copy.turn=15;assert.ok(governmentAction(copy,{},'motion:propose').ok);
 copy.turn=18;tickInstitutions(copy);assert.equal(governmentMotionView(copy,'a').active,false);assert.equal(institutionModifiers(copy,'a').tax,1);
});
test('failed votes, duplicate lobbying and prisoner exclusion cannot mint money or bypass debate',()=>{
 const g=fixture('imperial');g.politics.holdings.p.loyalty=10;g.politics.holdings.q.loyalty=10;
 assert.ok(governmentAction(g,{},'motion:propose').ok);const total=g.factions.a.treasury+g.politics.people.n.wealth;
 assert.ok(governmentAction(g,{},'motion:lobby','n').ok);assert.equal(g.factions.a.treasury+g.politics.people.n.wealth,total);
 assert.equal(governmentAction(g,{},'motion:lobby','n').ok,false);g.feudal.prisoners.n={status:'held'};
 assert.equal(governmentMotionView(g,'a').electors.some(e=>e.id==='n'),false);
 g.turn=3;tickInstitutions(g);assert.equal(governmentMotionView(g,'a').last.passed,false);assert.equal(institutionModifiers(g,'a').tax,1);
});
test('AI assemblies make and resolve motions through the same rules',()=>{
 const g=fixture('feudal');g.player='b';g.politics.holdings.p.loyalty=80;g.politics.holdings.q.loyalty=80;g.turn=12;tickInstitutions(g);
 assert.ok(governmentMotionView(g,'a').motion);g.turn=15;tickInstitutions(g);assert.equal(governmentMotionView(g,'a').active,true);
});
test('occupation and government changes invalidate old policy benefits',()=>{
 const g=fixture('feudal');g.politics.holdings.p.loyalty=80;g.politics.holdings.q.loyalty=80;governmentAction(g,{},'motion:propose');g.turn=3;tickInstitutions(g);
 assert.equal(governmentMotionView(g,'a').active,true);g.campaignWar={occupations:{p:{by:'b'},q:{by:'b'}}};assert.equal(institutionModifiers(g,'a').tax,1);delete g.campaignWar;
 g.civic.realms.a.government='regional';initInstitutions(g);assert.equal(governmentMotionView(g,'a').active,false);assert.equal(institutionModifiers(g,'a').tax,1);
 g.civic.realms.a.government='feudal';initInstitutions(g);assert.equal(governmentMotionView(g,'a').active,false);
});

import {civilServiceView,examinationRank} from '../src/imperial-civil-service.js';
test('imperial exams qualify existing characters and improve governor administration after save/load',()=>{
 const g=fixture('imperial');g.politics.people.n.skills.learning=4;assert.ok(governmentAction(g,{},'civil:exam','n').ok);assert.equal(examinationRank(g,'a','n'),3);assert.equal(g.factions.a.treasury,910);
 assert.equal(governmentAction(g,{},'civil:exam','m').ok,false);assert.ok(governmentAction(g,{},'p','n').ok);
 const plain=fixture('imperial');assert.ok(governmentAction(plain,{},'p','n').ok);assert.ok(institutionModifiers(g,'a').tax>institutionModifiers(plain,'a').tax);
 const copy=JSON.parse(JSON.stringify(g));initInstitutions(copy);copy.turn=3;tickInstitutions(copy);assert.equal(civilServiceView(copy,'a').candidates.find(c=>c.id==='n').service,3);
});
test('unqualified imperial governors accumulate corruption and audits have a political and financial cost',()=>{
 const g=fixture('imperial');g.politics.people.n.skills.stewardship=2;assert.ok(governmentAction(g,{},'p','n').ok);const initial=institutionModifiers(g,'a').tax;
 for(let turn=3;turn<=12;turn+=3){g.turn=turn;tickInstitutions(g);}
 assert.equal(institutionState(g,'a').offices.p.corruption,12);assert.ok(institutionModifiers(g,'a').tax<initial);
 const treasury=g.factions.a.treasury,loyalty=g.politics.holdings.p.loyalty;
 assert.ok(governmentAction(g,{},'civil:audit','p').ok);assert.equal(g.factions.a.treasury,treasury-75);assert.equal(g.politics.holdings.p.loyalty,loyalty-8);assert.equal(institutionState(g,'a').offices.p.corruption,0);
 assert.equal(governmentAction(g,{},'civil:audit','p').ok,false);
});
test('civil service excludes prisoners and non-imperial governments',()=>{
 const g=fixture('imperial');g.feudal.prisoners.n={status:'held'};assert.equal(governmentAction(g,{},'civil:exam','n').ok,false);
 const f=fixture('centralized');assert.equal(governmentAction(f,{},'civil:exam','n').ok,false);
});
