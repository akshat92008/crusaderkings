import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,advanceMonth} from '../src/simulation.js';
import {personalUnionAction,personalUnion,unionPartners,unionTerms,reconcilePersonalUnions,renderPersonalUnions} from '../src/personal-unions.js';
import {removePoliticalCharacter,successionPreview} from '../src/dynastic-politics.js';
import {nonAggression,militaryAccess} from '../src/diplomacy-systems.js';
import {conflictAction} from '../src/political-conflict.js';
import {tickCivic} from '../src/civic-systems.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function fixture(){
 const g=createGame(world,'england'),senior='england',junior='france',p=g.politics.people[g.politics.realms[senior].ruler],q=g.politics.people[g.politics.realms[junior].ruler],id=Object.values(g.provinces).find(x=>x.owner===junior).id;
 g.factions[senior].treasury=1000;g.factions[senior].prestige=120;g.factions[senior].legitimacy=80;g.factions[junior].legitimacy=30;
 g.factions[senior].relations[junior]=80;g.factions[junior].relations[senior]=80;p.claims=[junior];
 g.politics.holdings[id].lord=q.id;
 assert.equal(unionTerms(g,senior,junior),'');
 return {g,senior,junior,p,q,id};
}
test('one legal monarch holds both crowns without annexing land, armies or treasury',()=>{
 const {g,senior,junior,p,q,id}=fixture(),gold=g.factions[junior].treasury,owners=Object.fromEntries(Object.values(g.provinces).map(x=>[x.id,x.owner])),armies=JSON.stringify(g.armies);
 assert.ok(personalUnionAction(g,'union-form',junior).ok);
 assert.equal(g.politics.realms[senior].ruler,p.id);assert.equal(g.politics.realms[junior].ruler,p.id);
 assert.equal(g.feudal.titles['k:'+senior].holder,p.id);assert.equal(g.feudal.titles['k:'+junior].holder,p.id);
 assert.equal(g.politics.holdings[id].lord,p.id);
 assert.equal(g.politics.people[q.id].alive,true);
 assert.deepEqual(Object.fromEntries(Object.values(g.provinces).map(x=>[x.id,x.owner])),owners);
 assert.equal(JSON.stringify(g.armies),armies);assert.equal(g.factions[senior].treasury,700);assert.equal(g.factions[junior].treasury,gold+200);
 assert.ok(unionPartners(g,senior,junior));assert.ok(nonAggression(g,senior,junior));assert.ok(militaryAccess(g,senior,junior)?.union);
 g.conflict.claims[senior+':'+id]={realm:senior,province:id,expires:100};
 assert.equal(conflictAction(g,world,'declare',id).ok,false);
});
test('legal union requires an actual dynastic link, willing crowns and compatible succession',()=>{
 const {g,senior,junior,p}=fixture();p.claims=[];
 assert.equal(personalUnionAction(g,'union-form',junior).ok,false);
 p.claims=[junior];g.politics.realms[junior].law='elective';
 assert.equal(personalUnionAction(g,'union-form',junior).ok,false);
 g.politics.realms[junior].law='eldest';g.factions[junior].relations[senior]=-10;
 assert.equal(personalUnionAction(g,'union-form',junior).ok,false);
 assert.equal(g.factions[senior].treasury,1000);
});
test('same dynastic successor inherits both crowns and junior crown domain follows',()=>{
 const {g,senior,junior,p,id}=fixture();assert.ok(personalUnionAction(g,'union-form',junior).ok);
 const heir=successionPreview(g,senior);assert.ok(heir);assert.equal(successionPreview(g,junior).id,heir.id);
 assert.ok(removePoliticalCharacter(g,world,p.id));
 assert.equal(g.politics.realms[senior].ruler,heir.id);assert.equal(g.politics.realms[junior].ruler,heir.id);
 assert.equal(g.feudal.titles['k:'+junior].holder,heir.id);assert.equal(g.politics.holdings[id].lord,heir.id);
 assert.equal(personalUnion(g,junior).successions,1);
});
test('incompatible succession or voluntary separation restores a local crown and its domain',()=>{
 const {g,senior,junior,q,id}=fixture();assert.ok(personalUnionAction(g,'union-form',junior).ok);
 g.politics.realms[junior].law='youngest';reconcilePersonalUnions(g);
 assert.equal(personalUnion(g,senior),null);assert.equal(g.politics.realms[junior].ruler,q.id);
 assert.equal(g.feudal.titles['k:'+junior].holder,q.id);assert.equal(g.politics.holdings[id].lord,q.id);
 assert.equal(unionPartners(g,senior,junior),false);assert.equal(militaryAccess(g,senior,junior),null);
});
test('union administration can switch crowns, persists on reload and cannot evade an invasion',()=>{
 const {g,senior,junior,p}=fixture();assert.ok(personalUnionAction(g,'union-form',junior).ok);
 g.kingdom.threats=[{army:'pending'}];assert.equal(personalUnionAction(g,'union-switch',junior).ok,false);g.kingdom.threats=[];
 assert.ok(personalUnionAction(g,'union-switch',junior).ok);assert.equal(g.player,junior);
 const copy=restoreGame(snapshot(g),world);assert.equal(copy.player,junior);assert.equal(copy.politics.realms[junior].ruler,p.id);
 assert.match(renderPersonalUnions(copy,String),/PERSONAL UNION/);assert.ok(personalUnionAction(copy,'union-release').ok);assert.equal(personalUnion(copy,senior),null);
});
test('shared sovereign personal progression applies once per quarterly tick and union campaign advances',()=>{
 const {g,senior,junior,p}=fixture();assert.ok(personalUnionAction(g,'union-form',junior).ok);
 p.civic.focus='learning';p.civic.xp=0;const expected=6+p.skills.learning;
 g.turn=3;tickCivic(g,world);assert.equal(p.civic.xp,expected);
 for(let i=0;i<12;i++)advanceMonth(g,world);
 assert.ok(Number.isFinite(g.factions[junior].treasury));assert.ok(g.politics.people[g.politics.realms[junior].ruler]?.alive);
});
