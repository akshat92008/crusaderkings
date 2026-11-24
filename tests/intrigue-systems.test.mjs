import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,advanceMonth} from '../src/simulation.js';
import {intrigueAction,tickIntrigue,plotOdds,activePlots,knownSecrets,hookStrength,agentOptions} from '../src/intrigue-systems.js';
import {removePoliticalCharacter} from '../src/dynastic-politics.js';
import {councilVotes} from '../src/political-conflict.js';
import {isImprisoned} from '../src/feudal-systems.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function setup(){const g=createGame(world,'ming');g.factions.ming.treasury=10000;const r=g.politics.people[g.politics.realms.ming.ruler];r.age=40;r.skills.intrigue=5;g.politics.people[g.politics.realms.ming.council.spymaster].skills.intrigue=5;return g;}
function finish(g){const p=activePlots(g,'ming')[0];g.turn=p.due;g.intrigue.seed=1;tickIntrigue(g,world,removePoliticalCharacter);return p;}
test('plots charge funds, reject duplicates and recruit eligible agents',()=>{const g=setup(),id=g.politics.realms.ming.council.chancellor;assert.ok(intrigueAction(g,world,'start','investigate',id).ok);assert.equal(g.factions.ming.treasury,9910);const p=activePlots(g,'ming')[0],before=plotOdds(g,p).chance;assert.equal(intrigueAction(g,world,'start','discredit',id).ok,false);const agent=agentOptions(g,p)[0];assert.ok(agent);assert.ok(intrigueAction(g,world,'agent',p.id,agent.id).ok);assert.ok(plotOdds(g,p).chance>=before);assert.equal(intrigueAction(g,world,'agent',p.id,agent.id).ok,false);});
test('investigation reveals secret and blackmail increases real council support',()=>{const g=setup(),id=g.politics.realms.ming.council.chancellor;assert.ok(intrigueAction(g,world,'start','investigate',id).ok);assert.equal(finish(g).status,'succeeded');const s=knownSecrets(g,'ming')[0],score=councilVotes(g,'ming').find(v=>v.id===id).score;assert.ok(intrigueAction(g,world,'blackmail',s.id).ok);assert.ok(hookStrength(g,'ming',id)>0);assert.ok(councilVotes(g,'ming').find(v=>v.id===id).score>score);assert.ok(intrigueAction(g,world,'expose',s.id).ok);assert.equal(hookStrength(g,'ming',id),0);assert.equal(knownSecrets(g,'ming').length,0);});
test('vassal hooks are consumable and cannot be recreated from the same secret',()=>{const g=setup(),h=Object.values(g.politics.holdings).find(h=>h.realm==='ming'),id=h.lord;h.loyalty=20;assert.ok(intrigueAction(g,world,'start','investigate',id).ok);finish(g);const s=knownSecrets(g,'ming')[0];assert.ok(intrigueAction(g,world,'blackmail',s.id).ok);assert.ok(intrigueAction(g,world,'favor',id).ok);assert.ok(h.loyalty>20);assert.equal(hookStrength(g,'ming',id),0);assert.equal(intrigueAction(g,world,'blackmail',s.id).ok,false);});
test('counterespionage lowers opposing success and increases exposure',()=>{const g=setup(),id=g.politics.realms.joseon.ruler;assert.ok(intrigueAction(g,world,'start','discredit',id).ok);const p=activePlots(g,'ming')[0],before=plotOdds(g,p);g.player='joseon';g.factions.joseon.treasury=1000;assert.ok(intrigueAction(g,world,'security').ok);const after=plotOdds(g,p);assert.ok(after.chance<before.chance);assert.ok(after.exposure>before.exposure);assert.equal(intrigueAction(g,world,'security').ok,false);});
test('successful rival capture uses existing imprisonment system',()=>{const g=setup(),id=g.politics.realms.ming.council.chancellor;assert.ok(intrigueAction(g,world,'start','abduct',id).ok);assert.equal(finish(g).status,'succeeded');assert.ok(isImprisoned(g,id));assert.equal(councilVotes(g,'ming').some(v=>v.id===id),false);});
test('successful fictional removal of foreign ruler triggers actual succession',()=>{const g=setup(),id=g.politics.realms.joseon.ruler;assert.ok(intrigueAction(g,world,'start','assassinate',id).ok);assert.equal(finish(g).status,'succeeded');assert.equal(g.politics.people[id].alive,false);assert.ok(g.politics.realms.joseon.ruler!==id);assert.ok(g.politics.people[g.politics.realms.joseon.ruler].alive);assert.equal(g.feudal.titles['k:joseon'].holder,g.politics.realms.joseon.ruler);});
test('plots cancel when actor loses throne and saves retain state',()=>{const g=setup(),id=g.politics.realms.ming.council.chancellor;assert.ok(intrigueAction(g,world,'start','investigate',id).ok);const c=restoreGame(snapshot(g),world),p=activePlots(c,'ming')[0];assert.ok(p);removePoliticalCharacter(c,world,c.politics.realms.ming.ruler);c.turn=p.due;tickIntrigue(c,world,removePoliticalCharacter);assert.equal(p.status,'cancelled');delete c.intrigue;assert.ok(restoreGame(snapshot(c),world).intrigue);});


test('scheme preparation and counterintelligence change actual plot odds within bounds',()=>{const g={turn:1,politics:{people:{a:{id:'a',alive:true,age:30,realm:'a',skills:{intrigue:3}},b:{id:'b',alive:true,age:40,realm:'b',skills:{intrigue:3}}},realms:{a:{ruler:'a',council:{}},b:{ruler:'b',council:{}}}},intrigue:{security:{}},feudal:{prisoners:{}}};const p={realm:'a',target:'b',agents:[],kind:'discredit'};const baseline=plotOdds(g,p);assert.equal(plotOdds(g,{...p,preparation:18}).chance,baseline.chance+18);assert.equal(plotOdds(g,{...p,preparation:-5}).chance,baseline.chance-5);g.intrigue.security.b={level:2,until:13};assert.equal(plotOdds(g,{...p,preparation:18}).chance,baseline.chance-2);});

import {canStartPlot,networkView,knownThreats,plotCategory} from '../src/intrigue-systems.js';
import {personalOpinion,changeOpinion} from '../src/chronicle-systems.js';
test('distinct personal, political and hostile scheme slots coexist and save their real targets',()=>{
 const g=setup(),id=g.politics.realms.ming.council.chancellor,other=g.politics.realms.ming.council.steward;
 assert.equal(plotCategory('sway'),'personal');assert.ok(intrigueAction(g,world,'start','sway',id).ok);assert.ok(intrigueAction(g,world,'start','influence',other).ok);assert.ok(intrigueAction(g,world,'start','investigate',other).ok);
 assert.equal(activePlots(g,'ming').length,3);assert.equal(canStartPlot(g,'ming','befriend'),false);assert.equal(canStartPlot(g,'ming','discredit'),false);
 const copy=restoreGame(snapshot(g),world);assert.equal(activePlots(copy,'ming').length,3);
});
test('personal schemes resolve against actual relationships and record memories',()=>{
 const g=setup(),r=g.politics.realms.ming.ruler,id=g.politics.realms.ming.council.chancellor;g.politics.people[r].skills.diplomacy=5;
 const before=personalOpinion(g,r,id);assert.ok(intrigueAction(g,world,'start','sway',id).ok);assert.equal(finish(g).status,'succeeded');assert.ok(personalOpinion(g,r,id)>before);assert.ok(g.politics.people[id].memories.some(x=>x.includes('Sway opinion')));
});
test('persistent intelligence contacts can assist plots and cost periodic upkeep',()=>{
 const g=setup(),view=networkView(g,'ming'),contact=view.candidates[0];assert.ok(contact);const cash=g.factions.ming.treasury;
 assert.ok(intrigueAction(g,world,'network-recruit',contact.id).ok);assert.equal(g.factions.ming.treasury,cash-80);
 const copy=restoreGame(snapshot(g),world);assert.equal(networkView(copy,'ming').members.length,1);copy.turn=3;tickIntrigue(copy,world,removePoliticalCharacter);assert.equal(copy.factions.ming.treasury,cash-90);
 assert.ok(intrigueAction(copy,world,'network-dismiss',contact.id).ok);assert.equal(networkView(copy,'ming').members.length,0);
});
test('reviewing and disrupting a discovered foreign plot changes its actual odds and due date',()=>{
 const g=setup(),target=g.politics.realms.joseon.ruler;assert.ok(intrigueAction(g,world,'start','discredit',target).ok);const p=activePlots(g,'ming')[0],old=p.due;
 assert.ok(intrigueAction(g,world,'prepare',p.id).ok);assert.equal(p.preparation,8);assert.equal(intrigueAction(g,world,'prepare',p.id).ok,false);
 p.discoveredAt=0;g.player='joseon';g.factions.joseon.treasury=1000;assert.equal(knownThreats(g,'joseon').length,1);assert.ok(intrigueAction(g,world,'disrupt',p.id).ok);assert.equal(p.preparation,-4);assert.equal(p.due,old+3);assert.equal(intrigueAction(g,world,'disrupt',p.id).ok,false);
});
test('contested allegations are not treated as verified secrets or reusable hooks',()=>{
 const g=setup(),id=g.politics.realms.joseon.ruler;assert.ok(intrigueAction(g,world,'start','fabricate',id).ok);assert.equal(finish(g).status,'succeeded');const secret=knownSecrets(g,'ming').find(x=>x.kind==='contested');assert.ok(secret);assert.equal(intrigueAction(g,world,'blackmail',secret.id).ok,false);
});
