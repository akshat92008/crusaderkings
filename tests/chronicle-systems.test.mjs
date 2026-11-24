import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {chronicleAction,tickChronicles,currentChain,personalOpinion,relationshipList,regionalDecision,REGIONAL_DECISIONS,AMBITIONS,STORY_CHAINS,ambitionAvailable} from '../src/chronicle-systems.js';
import {councilVotes} from '../src/political-conflict.js';
import {renderStories} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const start=(realm='england')=>{const g=createGame(world,realm);g.factions[realm].treasury=10000;g.politics.people[g.politics.realms[realm].ruler].age=35;return g;};
const ruler=g=>g.politics.people[g.politics.realms[g.player].ruler];
test('all existing civilizations have distinct named regional decisions',()=>{const g=start();assert.equal(Object.keys(REGIONAL_DECISIONS).length,44);assert.equal(new Set(world.factions.map(f=>regionalDecision(g,f.id)[0])).size,44);assert.equal(STORY_CHAINS.length,8);assert.equal(Object.keys(AMBITIONS).length,50);});
test('regional decisions pay gold, change actual institutions and respect cooldown',()=>{const g=start('ming'),f=g.factions.ming;f.tech=3;assert.ok(chronicleAction(g,world,'decision').ok);assert.equal(f.treasury,9820);assert.equal(f.tech,4);assert.equal(chronicleAction(g,world,'decision').ok,false);g.turn=36;assert.ok(chronicleAction(g,world,'decision').ok);});
test('friendship and rivalry influence council votes and persist in saves',()=>{const g=start(),r=ruler(g),id=g.politics.realms.england.council.chancellor;const score=councilVotes(g,'england').find(v=>v.id===id).score,before=personalOpinion(g,r.id,id);assert.ok(chronicleAction(g,world,'befriend',id).ok);assert.ok(personalOpinion(g,r.id,id)>before);assert.ok(councilVotes(g,'england').find(v=>v.id===id).score>score);assert.equal(chronicleAction(g,world,'befriend',id).ok,false);g.turn=12;assert.ok(chronicleAction(g,world,'challenge',id).ok);assert.equal(personalOpinion(restoreGame(snapshot(g),world),r.id,id),personalOpinion(g,r.id,id));});
test('story chains have timed stages, paid choices and lasting records',()=>{const g=start();for(const h of Object.values(g.politics.holdings))if(h.realm==='england')h.loyalty=10;g.turn=6;tickChronicles(g,world);assert.equal(currentChain(g).id,'estates');assert.ok(chronicleAction(g,world,'chain','0').ok);assert.equal(currentChain(g).stage,1);assert.equal(chronicleAction(g,world,'chain','0').ok,false);g.turn=9;tickChronicles(g,world);assert.ok(chronicleAction(g,world,'chain','0').ok);g.turn=12;tickChronicles(g,world);assert.ok(chronicleAction(g,world,'chain','0').ok);assert.equal(currentChain(g),null);assert.equal(g.chronicles.realms.england.completed[0].outcomes.length,3);});
test('ambitions reward measurable achievements once per ruler',()=>{const g=start(),f=g.factions.england,before=f.prestige;assert.ok(chronicleAction(g,world,'ambition','security').ok);const p=Object.values(g.provinces).find(p=>p.owner==='england');p.buildings.fort+=2;g.turn=1;tickChronicles(g,world);assert.equal(g.chronicles.realms.england.ambition,null);assert.equal(f.prestige,before+16);assert.equal(chronicleAction(g,world,'ambition','security').ok,false);});
test('succession cancels personal ambition and triggers succession storyline',()=>{const g=start();assert.ok(chronicleAction(g,world,'ambition','mastery').ok);const s=g.politics.realms.england,old=s.ruler;s.ruler=Object.values(g.politics.people).find(c=>c.realm==='england'&&c.alive&&c.age>=18&&c.id!==old).id;g.turn=1;tickChronicles(g,world);assert.equal(g.chronicles.realms.england.ambition,null);assert.equal(currentChain(g).id,'succession');});
test('older saves initialize story records and interface renders actual controls',()=>{const g=start();delete g.chronicles;const copy=restoreGame(snapshot(g),world);assert.ok(copy.chronicles);assert.ok(renderStories(copy,world,String).includes('PERSONAL AMBITIONS'));assert.ok(renderStories(copy,world,String).includes('data-action="story"'));});

test('new specialization ambition tracks actual character branch ranks',()=>{const g=start(),r=g.politics.people[g.politics.realms.england.ruler];assert.ok(chronicleAction(g,world,'ambition','specialist').ok);r.civic.roleplay={branches:{'learning:scholarship':{rank:3,xp:0}}};g.turn=1;tickChronicles(g,world);assert.equal(g.chronicles.realms.england.ambition,null);});

test('new ambitions measure actual industry construction and cannot complete from existing buildings',()=>{const g=start(),p=Object.values(g.provinces).find(p=>p.owner==='england'),stock=g.economy.provinces[p.id].industries;stock.granary=1;assert.ok(chronicleAction(g,world,'ambition','granary_network').ok);g.turn=1;tickChronicles(g,world);assert.ok(g.chronicles.realms.england.ambition);stock.granary=3;const copy=restoreGame(snapshot(g),world);copy.turn=2;tickChronicles(copy,world);assert.equal(copy.chronicles.realms.england.ambition,null);});
test('debt ambition is only available when debt exists and requires payment and a treasury buffer',()=>{const g=start();assert.equal(chronicleAction(g,world,'ambition','repay_debt').ok,false);g.economy.loans.a={id:'a',realm:'england',status:'active',remaining:100};assert.ok(chronicleAction(g,world,'ambition','repay_debt').ok);g.economy.loans.a.status='repaid';g.factions.england.treasury=200;g.turn=1;tickChronicles(g,world);assert.ok(g.chronicles.realms.england.ambition);g.factions.england.treasury=400;g.turn=2;tickChronicles(g,world);assert.equal(g.chronicles.realms.england.ambition,null);});

test('completed ambitions remain unavailable after the rolling story archive drops the record',()=>{
 const g=start(),s=g.chronicles.realms.england,p=Object.values(g.provinces).find(p=>p.owner==='england');
 assert.ok(chronicleAction(g,world,'ambition','security').ok);p.buildings.fort+=2;g.turn=1;tickChronicles(g,world);
 const key=ruler(g).id+'|security';assert.equal(s.fulfilledAmbitions[key],1);
 for(let i=0;i<25;i++)s.completed.push({id:'court',turn:i+2,outcomes:[],score:0});s.completed=s.completed.slice(-20);
 const copy=restoreGame(snapshot(g),world);assert.equal(copy.chronicles.realms.england.fulfilledAmbitions[key],1);assert.equal(ambitionAvailable(copy,'england','security'),false);
 assert.equal(chronicleAction(copy,world,'ambition','security').ok,false);
});
test('legacy completed ambitions migrate, but a new ruler can pursue the same goal',()=>{
 const g=start(),s=g.chronicles.realms.england,old=ruler(g).id;delete s.fulfilledAmbitions;s.completed.push({ambition:'security',ruler:old,turn:0});
 const copy=restoreGame(snapshot(g),world);assert.equal(ambitionAvailable(copy,'england','security'),false);
 const next=Object.values(copy.politics.people).find(p=>p.realm==='england'&&p.alive&&p.age>=18&&p.id!==old);assert.ok(next);copy.politics.realms.england.ruler=next.id;copy.turn=1;tickChronicles(copy,world);
 assert.equal(ambitionAvailable(copy,'england','security'),true);
});
test('a stale duplicate active ambition is discarded without another reward',()=>{
 const g=start(),s=g.chronicles.realms.england,p=Object.values(g.provinces).find(p=>p.owner==='england');
 assert.ok(chronicleAction(g,world,'ambition','security').ok);const duplicate=JSON.parse(JSON.stringify(s.ambition));p.buildings.fort+=2;g.turn=1;tickChronicles(g,world);
 const prestige=g.factions.england.prestige;s.ambition=duplicate;g.turn=2;tickChronicles(g,world);
 assert.equal(s.ambition,null);assert.equal(g.factions.england.prestige,prestige);
});
