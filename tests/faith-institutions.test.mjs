import assert from 'node:assert/strict';
import test from 'node:test';
import {faithFamily,faithCharterView,faithCharterAction,faithCharterModifiers,tickFaithCharter,faithConfidence,faithExchangeView,pilgrimageSanctuary,completeSacredJourney} from '../src/faith-institutions.js';
function fixture(){
 const g={player:'a',turn:0,year:1450,month:0,log:[],factions:{a:{treasury:2000,prestige:100,legitimacy:70}},provinces:{p:{id:'p',owner:'a'},q:{id:'q',owner:'a'},z:{id:'z',owner:'a'}},civic:{realms:{a:{faith:'Latin Christianity',policy:'accommodation'}},provinces:{p:{faith:'Latin Christianity',localTrust:70},q:{faith:'Latin Christianity',localTrust:65},z:{faith:'Eastern Christianity',localTrust:40}}},identity:{realms:{a:{faithAuthority:80}},institutions:{p:{level:2,faith:'Latin Christianity'},q:{level:2,faith:'Latin Christianity'},z:{level:1,faith:'Eastern Christianity'}},history:[]},politics:{realms:{a:{ruler:'r'}},people:{r:{id:'r',name:'Ruler',realm:'a',age:40,alive:true,civic:{faith:'Latin Christianity'}},n:{id:'n',name:'Advisor',realm:'a',age:30,alive:true,civic:{faith:'Latin Christianity'},skills:{learning:5,diplomacy:4}},m:{id:'m',name:'Lord',realm:'a',age:31,alive:true,civic:{faith:'Latin Christianity'},skills:{learning:4,diplomacy:4}},x:{id:'x',name:'Guest',realm:'a',age:28,alive:true,civic:{faith:'Eastern Christianity'},skills:{learning:2},memories:[]}},holdings:{p:{realm:'a',lord:'n',loyalty:80},q:{realm:'a',lord:'m',loyalty:80},z:{realm:'a',lord:'x',loyalty:80}}},living:{realms:{a:{faithAdvisor:'n'}}},feudal:{prisoners:{}}};return g;
}
const tick=(g,turn)=>{g.turn=turn;tickFaithCharter(g,'a',Object.values(g.provinces).filter(p=>p.owner==='a'));};
test('religious family lookup preserves mixed or unclassified traditions rather than forcing a classification',()=>{
 const g=fixture();assert.equal(faithFamily(g,'Latin Christianity'),'Christianity');assert.equal(faithFamily(g,'Eastern Christianity'),'Christianity');assert.equal(faithFamily(g,'Islamic and local traditions'),'Islamic and local traditions');assert.equal(faithFamily(g,'Unknown tradition'),'Unknown tradition');
});
test('council uses live participants, delays decisions and preserves charter across save/load',()=>{
 const g=fixture();assert.ok(faithCharterAction(g,'a','faith-council','governance:stewardship').ok);
 assert.equal(g.factions.a.treasury,1780);assert.equal(faithCharterModifiers(g,'a').research,0);assert.equal(faithCharterView(g,'a').yes,2);
 const copy=JSON.parse(JSON.stringify(g));tick(copy,3);assert.equal(faithCharterView(copy,'a').council.ends,6);tick(copy,6);assert.equal(faithCharterView(copy,'a').policies.governance,'stewardship');assert.equal(faithCharterModifiers(copy,'a').research,1);assert.equal(faithCharterAction(copy,'a','faith-council','coexistence:equalProtection').ok,false);
});
test('imprisoning advisor prevents pending council and suspends active policy modifiers',()=>{
 const g=fixture();faithCharterAction(g,'a','faith-council','governance:stewardship');g.feudal.prisoners.n={status:'held'};tick(g,6);assert.equal(faithCharterView(g,'a').policies.governance,'consultation');assert.equal(faithCharterModifiers(g,'a').research,0);
});
test('sanctuaries require matching developed institutions, preserve identity and permit qualified local rite founding',()=>{
 const g=fixture();assert.equal(faithCharterAction(g,'a','faith-site','z').ok,false);assert.ok(faithCharterAction(g,'a','faith-site','p').ok);
 assert.equal(faithCharterAction(g,'a','faith-site','q').ok,false);faithCharterAction(g,'a','faith-council','governance:stewardship');tick(g,6);tick(g,24);assert.ok(faithCharterAction(g,'a','faith-site','q').ok);
 assert.ok(faithCharterView(g,'a').canFound);assert.equal(faithCharterAction(g,'a','faith-found','Latin Christianity').ok,false);
 assert.ok(faithCharterAction(g,'a','faith-found','River Rite').ok);assert.equal(g.civic.realms.a.faith,'River Rite');assert.equal(g.politics.people.r.civic.faith,'River Rite');assert.equal(g.civic.provinces.p.faith,'Latin Christianity');assert.equal(g.identity.institutions.p.sanctuary.faith,'Latin Christianity');assert.equal(faithFamily(g,'River Rite'),'Christianity');assert.equal(faithCharterView(g,'a').parent,'Latin Christianity');assert.equal(faithCharterView(g,'a').policies.governance,'stewardship');
});
test('personal conversion is voluntary, respects advisor and cooldown and records a memory',()=>{
 const g=fixture();assert.ok(faithCharterView(g,'a').conversions.find(x=>x.id==='x').score>=65);assert.ok(faithCharterAction(g,'a','faith-conversion','x').ok);assert.equal(g.politics.people.x.civic.faith,'Latin Christianity');assert.equal(g.politics.people.x.memories.length,1);assert.equal(g.civic.provinces.z.faith,'Eastern Christianity');assert.equal(faithCharterAction(g,'a','faith-conversion','x').ok,false);
 const h=fixture();h.civic.realms.a.policy='coercion';assert.equal(faithCharterAction(h,'a','faith-conversion','x').ok,false);
});
test('recognition and council representatives cannot use occupied provinces',()=>{
 const g=fixture();g.campaignWar={occupations:{p:{by:'b'},q:{by:'b'}}};assert.equal(faithCharterAction(g,'a','faith-site','p').ok,false);assert.equal(faithCharterAction(g,'a','faith-council','governance:stewardship').ok,false);
});

function exchangeFixture(){
 const g=fixture();g.factions.a.relations={b:25};g.factions.b={name:'B',treasury:500,relations:{a:25}};g.civic.realms.b={faith:'Eastern Christianity'};g.identity.realms.b={faithAuthority:60};g.provinces.b={id:'b',owner:'b'};g.civic.provinces.b={faith:'Eastern Christianity'};g.politics.realms.b={ruler:'br'};g.politics.people.br={id:'br',realm:'b',age:40,alive:true};g.politics.people.ba={id:'ba',realm:'b',age:30,alive:true,civic:{faith:'Eastern Christianity'},skills:{learning:3}};g.living.realms.b={faithAdvisor:'ba'};g.conflict={wars:{}};return g;
}
test('scholarly exchanges are delayed, reciprocal and preserve underlying faiths',()=>{
 const g=exchangeFixture();assert.equal(faithConfidence(g,'Latin Christianity'),80);assert.ok(faithExchangeView(g,'a').canStart);assert.ok(faithCharterAction(g,'a','faith-exchange','b').ok);assert.equal(g.factions.a.treasury,1880);assert.equal(g.factions.a.relations.b,25);
 tick(g,3);assert.equal(g.factions.a.relations.b,25);tick(g,6);assert.equal(g.factions.a.relations.b,33);assert.equal(g.factions.b.relations.a,33);assert.equal(g.identity.realms.a.faithAuthority,83);assert.equal(g.identity.realms.b.faithAuthority,62);assert.equal(g.civic.realms.b.faith,'Eastern Christianity');assert.equal(faithCharterAction(g,'a','faith-exchange','b').ok,false);
});
test('religious exchanges cancel if war or adviser replacement invalidates an agreement',()=>{
 const g=exchangeFixture();faithCharterAction(g,'a','faith-exchange','b');g.conflict.wars.x={status:'active',attacker:'a',defender:'b'};tick(g,3);assert.equal(faithExchangeView(g,'a').active,null);assert.equal(g.factions.a.relations.b,25);
});
test('recognized pilgrimage adds backing and a ruler memory only when the site remains valid',()=>{
 const g=fixture();assert.ok(faithCharterAction(g,'a','faith-site','p').ok);const site=pilgrimageSanctuary(g,'a','p');assert.ok(site);const x={host:'r',quality:80,sanctuary:site};const before=g.identity.realms.a.faithAuthority;
 assert.equal(completeSacredJourney(g,'a',x),true);assert.equal(g.identity.realms.a.faithAuthority,before+4);assert.equal(g.politics.people.r.memories.length,1);g.provinces.p.owner='b';assert.equal(completeSacredJourney(g,'a',x),false);
});

test('losing all controlled institutional centers prevents a council from enacting its reform',()=>{
 const g=fixture();faithCharterAction(g,'a','faith-council','governance:stewardship');g.provinces.p.owner='b';g.provinces.q.owner='b';tick(g,6);assert.equal(faithCharterView(g,'a').policies.governance,'consultation');
});
