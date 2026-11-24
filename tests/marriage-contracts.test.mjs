import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {politicsAction,removePoliticalCharacter,activeBetrothal,tickPolitics} from '../src/dynastic-politics.js';
import {marriageContract,marriageTerms,activeMarriageLinks} from '../src/dynastic-ties.js';
import {estateSuccession} from '../src/estate-succession.js';
import {renderCharacter} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const action=(g,type,id,extra)=>politicsAction(g,world,type,id,extra);
function fixture(){
 const g=createGame(world,'england'),r=g.politics.people[g.politics.realms.england.ruler],q=g.politics.people[g.politics.realms.france.ruler];
 const a=r.children.map(id=>g.politics.people[id]).find(x=>x.sex==='female'),b=q.children.map(id=>g.politics.people[id]).find(x=>x.sex==='male');
 a.age=b.age=22;g.factions.england.treasury=1000;g.factions.england.prestige=100;g.factions.england.legitimacy=85;g.factions.england.relations.france=g.factions.france.relations.england=75;
 return {g,a,b,r};
}
test('settlement transfers gold exactly once, survives save and divorce removes the marriage treaty',()=>{
 const {g,a,b}=fixture(),gold=b.wealth;
 assert.ok(action(g,'marry-maternal-settlement',a.id,b.id).ok);
 assert.equal(g.factions.england.treasury,720);assert.equal(b.wealth,gold+100);
 const saved=restoreGame(snapshot(g),world);assert.equal(marriageContract(saved,a.id).settlement,100);
 assert.match(renderCharacter(saved,world,a.id,String),/Marriage contract/);
 saved.politics.realms.england.marriagePolicy='indissoluble';assert.equal(action(saved,'divorce',a.id).ok,false);
 saved.politics.realms.england.marriagePolicy='open';assert.ok(action(saved,'divorce',a.id).ok);
 assert.equal(saved.politics.people[a.id].spouse,null);assert.equal(saved.politics.people[b.id].spouse,null);
 assert.equal(activeMarriageLinks(saved,'england','france').length,0);
 assert.notEqual(saved.factions.england.treaties.france,'marriage');
 assert.equal(saved.politics.marriages.at(-1).ended,'divorce');
 assert.equal(action(saved,'divorce',a.id).ok,false);
});
test('same-faith charter blocks even domestic mismatched marriages; maternal betrothal reserves its contract',()=>{
 const {g,a,b}=fixture();g.politics.realms.england.marriagePolicy='same_faith';b.civic.faith='Other faith';
 assert.equal(marriageTerms(g,a,b).accepted,false);assert.equal(action(g,'marry',a.id,b.id).ok,false);
 b.civic.faith=a.civic.faith;a.age=b.age=17;
 assert.ok(action(g,'betroth-maternal-settlement',a.id,b.id).ok);
 const saved=restoreGame(snapshot(g),world);assert.equal(activeBetrothal(saved,a.id).contract,'maternal_settlement');
 saved.politics.people[a.id].age=saved.politics.people[b.id].age=18;saved.turn=1;tickPolitics(saved,world);
 assert.equal(marriageContract(saved,a.id).lineage,'maternal');assert.equal(marriageContract(saved,a.id).settlement,100);
});
test('a crown holder’s separate youngest-branch estate charter survives crown succession',()=>{
 const {g,r}=fixture(),s=g.politics.realms.england,[oldest,youngest]=r.children.map(id=>g.politics.people[id]);oldest.age=25;youngest.age=20;s.law='eldest';
 const [id,h]=Object.entries(g.politics.holdings).find(([,h])=>h.realm==='england');h.lord=r.id;h.successionLaw='youngest';
 assert.equal(estateSuccession(g,id).heir.id,youngest.id);
 assert.ok(removePoliticalCharacter(g,world,r.id));assert.equal(s.ruler,oldest.id);
 assert.equal(h.lord,youngest.id);assert.equal(g.feudal.titles['c:'+id].holder,youngest.id);
});
