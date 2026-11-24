import assert from 'node:assert/strict';
import test from 'node:test';
import {AMBITIONS,ambitionAvailable,ambitionProgress,chronicleAction,tickChronicles} from '../src/chronicle-systems.js';
function fixture(){const r={id:'r',realm:'a',alive:true,age:40,house:'A',civic:{stress:50,perks:[]}},people={r,one:{id:'one',realm:'a',alive:true,age:30},two:{id:'two',realm:'a',alive:true,age:30}};return {player:'a',turn:1,year:1450,month:1,log:[],factions:{a:{treasury:1000,stability:60,legitimacy:60,prestige:0}},provinces:{p:{id:'p',owner:'a',development:5,buildings:{fort:0}}},politics:{people,realms:{a:{ruler:'r',council:{}}},holdings:{}},civic:{realms:{a:{government:'feudal'}},provinces:{p:{acceptance:50,localTrust:60}}},identity:{realms:{a:{innovations:[]}},institutions:{p:{level:0}}},heritage:{realms:{a:{completed:0}},dynasties:{'a|A':{renown:0}}},chronicles:{version:1,realms:{a:{ruler:'r',ambition:null,completed:[],chain:null,lastChain:{},successionAt:null,decisionAt:-120}},relationships:{},history:[],lastTick:-1}};}
const world={factions:[{id:'a'}],provinces:[{id:'p'}]};
test('new ambitions reward only measurable goals and only once per ruler',()=>{const changes={friendship:g=>{for(const id of ['one','two'])g.chronicles.relationships[[id,'r'].sort().join('|')]={a:'r',b:id,kind:'friend',opinion:60};},innovation:g=>{g.identity.realms.a.innovations=['a','b'];},reconciliation:g=>{g.civic.provinces.p.acceptance=60;g.civic.provinces.p.localTrust=75;},institutions:g=>{g.identity.institutions.p.level=3;},resilience:g=>{g.politics.people.r.civic.stress=25;g.factions.a.stability=70;}};for(const [id,change] of Object.entries(changes)){const g=fixture();assert.ok(ambitionAvailable(g,'a',id));assert.ok(chronicleAction(g,world,'ambition',id).ok);tickChronicles(g,world);assert.equal(g.factions.a.prestige,0);assert.equal(g.chronicles.realms.a.ambition.id,id);change(g);g.turn=2;tickChronicles(g,world);assert.equal(g.factions.a.prestige,AMBITIONS[id].reward);assert.equal(g.heritage.dynasties['a|A'].renown,AMBITIONS[id].reward);assert.equal(g.chronicles.realms.a.ambition,null);assert.equal(ambitionAvailable(g,'a',id),false);g.turn=3;tickChronicles(g,world);assert.equal(g.factions.a.prestige,AMBITIONS[id].reward);}});
test('resilience requires hardship and friendship excludes existing friends',()=>{const g=fixture();g.politics.people.r.civic.stress=20;assert.equal(ambitionAvailable(g,'a','resilience'),false);assert.equal(chronicleAction(g,world,'ambition','resilience').ok,false);g.chronicles.relationships['one|r']={a:'r',b:'one',kind:'friend',opinion:60};assert.ok(chronicleAction(g,world,'ambition','friendship').ok);g.chronicles.relationships['r|two']={a:'r',b:'two',kind:'friend',opinion:60};tickChronicles(g,world);assert.equal(g.chronicles.realms.a.ambition.id,'friendship');assert.equal(g.factions.a.prestige,0);});

test('all original ambitions expose live progress from the same predicate as completion',()=>{
 const changes={
  linguist:g=>{g.politics.people.r.civic.languages=['a','b'];},
  specialist:g=>{g.politics.people.r.civic.roleplay={branches:{'learning:scholarship':{rank:3}}};},
  patron:g=>{g.heritage.realms.a.completed=3;},
  sanctuaries:g=>{g.provinces.q={id:'q',owner:'a',development:5};g.identity.institutions.p.sanctuary={};g.identity.institutions.q={sanctuary:{}};},
  confidants:g=>{g.intrigue={networks:{a:{r:{},one:{},two:{}}}};},
  prosperity:g=>{g.provinces.p.development=8;g.factions.a.treasury=1500;},
  unity:g=>{g.politics.holdings.p={realm:'a',lord:'one',loyalty:70};g.factions.a.stability=75;},
  mastery:g=>{g.politics.people.r.civic.perks=['a','b','c'];},
  legacy:g=>{g.heritage.realms.a.completed=2;},
  security:g=>{g.provinces.p.buildings.fort=2;},
  friendship:g=>{for(const id of ['one','two'])g.chronicles.relationships[[id,'r'].sort().join('|')]={a:'r',b:id,kind:'friend',opinion:60};},
  innovation:g=>{g.identity.realms.a.innovations=['a','b'];},
  reconciliation:g=>{g.civic.provinces.p.acceptance=60;g.civic.provinces.p.localTrust=75;},
  institutions:g=>{g.identity.institutions.p.level=3;},
  resilience:g=>{g.politics.people.r.civic.stress=25;g.factions.a.stability=70;}
 };
 for(const [id,change] of Object.entries(changes)){
  const g=fixture();assert.ok(chronicleAction(g,world,'ambition',id).ok,id);
  const initial=ambitionProgress(g,'a');assert.ok(initial,id);assert.equal(initial.done,false,id);
  change(g);const progress=ambitionProgress(g,'a');assert.equal(progress.done,true,id);
  g.turn=2;tickChronicles(g,world);assert.equal(g.chronicles.realms.a.ambition,null,id);
 }
});
