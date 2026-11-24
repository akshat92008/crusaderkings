import assert from 'node:assert/strict';
import test from 'node:test';
import {cultureProfile,languageFamily,knownLanguages,cultureLeadership,culturalContact,cultureView,cultureModifiers,cultureAction,tickCulture,courtLanguage} from '../src/culture-systems.js';
function fixture(){
 const g={player:'a',turn:0,year:1450,month:0,log:[],factions:{a:{treasury:2000,prestige:100,relations:{b:30}},b:{treasury:500,prestige:30,relations:{a:30}}},provinces:{p:{id:'p',owner:'a'},q:{id:'q',owner:'a'},z:{id:'z',owner:'b'}},civic:{realms:{a:{culture:'French',policy:'accommodation'},b:{culture:'French',policy:'accommodation'}},provinces:{p:{culture:'French',acceptance:90,localTrust:80},q:{culture:'Breton',acceptance:80,localTrust:75},z:{culture:'French',acceptance:80,localTrust:80}}},identity:{realms:{a:{innovations:['records','irrigation']},b:{innovations:[]}},history:[]},politics:{realms:{a:{ruler:'r'},b:{ruler:'b'}},people:{r:{id:'r',name:'Ruler',realm:'a',age:35,alive:true,civic:{culture:'French'},skills:{learning:4}},n:{id:'n',name:'Patron',realm:'a',age:30,alive:true,civic:{culture:'French'},skills:{learning:4}},b:{id:'b',name:'Foreign ruler',realm:'b',age:35,alive:true,civic:{culture:'French'},skills:{learning:3}}}},living:{realms:{a:{culturePatron:'n'},b:{}}},feudal:{prisoners:{}}};return g;
}
const tick=(g,t)=>{g.turn=t;tickCulture(g,'a',Object.values(g.provinces).filter(p=>p.owner==='a'));};
test('cultural profiles preserve local labels and do not assume every regional language is spoken',()=>{
 const g=fixture();assert.equal(cultureProfile(g,'Breton').group,'Northwestern Europe');assert.equal(languageFamily('Breton'),'Celtic');assert.deepEqual(knownLanguages(g,g.politics.people.r),['French']);assert.equal(cultureProfile(g,'Unknown').label,'Unknown');
});
test('language learning takes time, persists in the actual character and affects court administration',()=>{
 const g=fixture();assert.ok(cultureAction(g,'a','culture-study','Breton').ok);assert.equal(g.factions.a.treasury,1920);
 const copy=JSON.parse(JSON.stringify(g));tick(copy,3);assert.equal(knownLanguages(copy,copy.politics.people.r).includes('Breton'),false);tick(copy,9);assert.ok(knownLanguages(copy,copy.politics.people.r).includes('Breton'));assert.equal(cultureModifiers(copy,'a').diplomacy,2);
 assert.ok(cultureAction(copy,'a','culture-language','Breton').ok);assert.equal(courtLanguage(copy,'a'),'Breton');tick(copy,12);assert.equal(copy.civic.provinces.q.acceptance,81);assert.equal(copy.civic.provinces.q.localTrust,76);
});
test('hybridization uses actual local acceptance and preserves existing province cultures and character languages',()=>{
 const g=fixture();assert.equal(culturalContact(g,'a')[0].culture,'Breton');assert.equal(cultureLeadership(g,'French').realm,'a');assert.ok(cultureView(g,'a').canHybrid);
 assert.ok(cultureAction(g,'a','culture-hybrid','River Culture','Breton').ok);assert.equal(g.civic.realms.a.culture,'River Culture');assert.equal(g.civic.provinces.q.culture,'Breton');assert.equal(g.politics.people.r.civic.culture,'River Culture');assert.deepEqual(knownLanguages(g,g.politics.people.r),['French']);assert.deepEqual(cultureProfile(g,'River Culture').parents,['French','Breton']);
 assert.equal(g.factions.a.treasury,1550);assert.equal(cultureAction(g,'a','culture-diverge','Another Culture').ok,false);
});
test('low local trust, occupation, insufficient innovation and invalid names block changes',()=>{
 const g=fixture();g.civic.provinces.q.localTrust=40;assert.equal(cultureAction(g,'a','culture-hybrid','River Culture','Breton').ok,false);
 g.identity.realms.a.innovations=[];assert.equal(cultureAction(g,'a','culture-diverge','New Culture').ok,false);
 g.civic.provinces.q.localTrust=80;g.campaignWar={occupations:{q:{by:'b'}}};assert.equal(cultureAction(g,'a','culture-hybrid','River Culture','Breton').ok,false);
 g.identity.realms.a.innovations=['records','irrigation'];assert.equal(cultureAction(g,'a','culture-diverge','French').ok,false);
 assert.ok(cultureAction(g,'a','culture-diverge','New Culture').ok);assert.deepEqual(cultureProfile(g,'New Culture').parents,['French']);
});
test('succession cancels the old ruler study and a new ruler does not inherit learned languages',()=>{
 const g=fixture();cultureAction(g,'a','culture-study','Breton');g.politics.realms.a.ruler='n';tick(g,3);assert.equal(cultureView(g,'a').study,null);assert.equal(knownLanguages(g,g.politics.people.n).includes('Breton'),false);
});
