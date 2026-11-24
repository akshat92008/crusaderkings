import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {advanceMonth,createGame,restoreGame,snapshot} from '../src/simulation.js';
import {activeBetrothal,betrothalCandidates,marriageCandidates,politicsAction,removePoliticalCharacter,successionPreview,tickPolitics} from '../src/dynastic-politics.js';
import {crownExcluded,electionView,partitionRepresentatives} from '../src/succession-systems.js';
import {renderCharacter,renderDynasty} from '../src/kingdom-ui.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const ruler=(g,realm)=>g.politics.people[g.politics.realms[realm].ruler];
const children=(g,realm)=>ruler(g,realm).children.map(id=>g.politics.people[id]);
const action=(g,type,id,extra)=>politicsAction(g,world,type,id,extra);
function setupBetrothal(){
 const g=createGame(world,'england');
 const a=children(g,'england').find(p=>p.sex==='male'),b=children(g,'france').find(p=>p.sex==='female');
 a.age=b.age=17;
 g.factions.england.treasury=3000;
 g.factions.england.relations.france=50;
 g.factions.france.relations.england=50;
 return {g,a,b};
}

test('a foreign betrothal survives a save and becomes a marriage only when both are adults',()=>{
 const {g,a,b}=setupBetrothal();
 assert.equal(betrothalCandidates(g,'england',a.id).find(p=>p.id===b.id).accepted,true);
 assert.match(renderCharacter(g,world,a.id,String),/Arrange betrothal/);
 assert.ok(action(g,'betroth',a.id,b.id).ok);
 assert.equal(g.factions.england.treasury,2940);
 assert.equal(action(g,'betroth',a.id,b.id).ok,false);
 assert.notEqual(g.factions.england.treaties.france,'marriage');
 assert.equal(a.spouse,null);
 assert.match(renderCharacter(g,world,a.id,String),/Betrothed to/);

 const copy=restoreGame(snapshot(g),world);
 assert.equal(activeBetrothal(copy,b.id).a,a.id);
 copy.turn=11;
 advanceMonth(copy,world);
 assert.equal(copy.politics.people[a.id].spouse,b.id);
 assert.equal(copy.politics.people[b.id].spouse,a.id);
 assert.equal(activeBetrothal(copy,a.id),undefined);
 assert.equal(copy.factions.england.treaties.france,'marriage');
});

test('betrothals reserve both matches during a diplomatic delay and cancellation affects relations',()=>{
 const {g,a,b}=setupBetrothal();
 assert.ok(action(g,'betroth',a.id,b.id).ok);
 a.age=b.age=18;
 g.factions.france.relations.england=-40;
 g.turn=11;
 advanceMonth(g,world);
 assert.equal(a.spouse,null);
 assert.equal(b.spouse,null);
 assert.ok(activeBetrothal(g,b.id));
 assert.ok(!marriageCandidates(g,'england').some(pair=>pair.a===a.id));
 assert.ok(!marriageCandidates(g,'france').some(pair=>pair.a===b.id));
 const relation=g.factions.france.relations.england;
 assert.ok(action(g,'break-betrothal',a.id).ok);
 assert.equal(g.factions.france.relations.england,relation-15);
 assert.equal(activeBetrothal(g,b.id),undefined);
});

test('crown exclusion persists through a save, filters partition and electors, and can be lifted',()=>{
 const g=createGame(world,'england'),realm=g.politics.realms.england;
 const [eldest,spare]=children(g,'england');
 eldest.age=23;
 spare.age=20;
 const faction=g.factions.england;
 faction.prestige=100;
 faction.legitimacy=80;
 realm.law='elective';
 assert.ok(action(g,'nominate-successor',eldest.id).ok);
 assert.ok(action(g,'disinherit',eldest.id).ok);
 assert.equal(faction.prestige,75);
 assert.equal(faction.legitimacy,70);
 assert.equal(realm.nominee,undefined);
 assert.ok(!electionView(g,'england').candidates.some(c=>c.id===eldest.id));
 assert.ok(!partitionRepresentatives(g,ruler(g,'england')).some(c=>c.id===eldest.id));
 assert.match(renderDynasty(g,String),/Crown rights revoked/);
 assert.equal(action(g,'disinherit',eldest.id).ok,false);
 const copy=restoreGame(snapshot(g),world);
 copy.politics.realms.england.law='eldest';
 assert.equal(successionPreview(copy,'england').id,spare.id);
 assert.ok(crownExcluded(copy.politics.people[eldest.id],'england'));
 assert.ok(action(copy,'restore-inheritance',eldest.id).ok);
 assert.equal(successionPreview(copy,'england').id,eldest.id);
});

test('the legal heir takes the crown even if a disinherited child inherits private wealth',()=>{
 const g=createGame(world,'england'),head=ruler(g,'england'),[eldest,spare]=children(g,'england');
 g.factions.england.prestige=100;
 g.factions.england.legitimacy=80;
 const wealth=eldest.wealth;
 assert.ok(action(g,'disinherit',eldest.id).ok);
 assert.ok(removePoliticalCharacter(g,world,head.id));
 assert.equal(ruler(g,'england').id,spare.id);
 assert.equal(eldest.wealth,wealth+100);
 assert.equal(g.feudal.titles['k:england'].holder,spare.id);
});


test('diplomatic AI courts reserve a willing foreign match for an heir',()=>{
 const g=createGame(world,'ming');
 const he=children(g,'england').find(p=>p.sex==='male'),she=children(g,'france').find(p=>p.sex==='female');
 he.age=16;
 she.age=15;
 g.factions.england.treasury=1000;
 g.factions.england.relations.france=75;
 g.factions.france.relations.england=75;
 g.strategy.plans.england={goal:'diplomacy'};
 g.turn=12;
 tickPolitics(g,world);
 assert.equal(activeBetrothal(g,he.id).b,she.id);
 assert.notEqual(g.factions.england.treaties.france,'marriage');
});
