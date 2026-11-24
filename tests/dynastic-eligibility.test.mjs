import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {successionPreview,removePoliticalCharacter,politicsAction,marriageCandidates} from '../src/dynastic-politics.js';
import {crownPolicy,crownPolicyEligible,partitionRepresentatives,electionView,marriageLineage} from '../src/succession-systems.js';
import {renderDynasty} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
test('female-only crown law governs preview, partition and actual succession after a save',()=>{
 const g=createGame(world,'england'),s=g.politics.realms.england,r=g.politics.people[s.ruler];
 const [son,daughter]=r.children.map(id=>g.politics.people[id]);s.genderLaw='female_only';
 assert.equal(successionPreview(g,'england').id,daughter.id);
 assert.ok(!partitionRepresentatives(g,r).some(c=>c.id===son.id));
 const saved=restoreGame(snapshot(g),world);
 assert.equal(crownPolicy(saved,'england').gender,'female_only');
 assert.match(renderDynasty(saved,String),/Female only/);
 assert.ok(removePoliticalCharacter(saved,world,r.id));
 assert.equal(saved.politics.realms.england.ruler,daughter.id);
});
test('faith restriction applies to crown eligibility and not other crowns',()=>{
 const g=createGame(world,'england'),s=g.politics.realms.england,r=g.politics.people[s.ruler];
 const [son,daughter]=r.children.map(id=>g.politics.people[id]);son.civic.faith='Test other faith';s.faithLaw='same_faith';
 assert.equal(crownPolicyEligible(g,'england',son),false);
 assert.equal(crownPolicyEligible(g,'france',son),true);
 assert.equal(successionPreview(g,'england').id,daughter.id);
 s.law='elective';son.age=25;
 assert.ok(!electionView(g,'england').candidates.some(c=>c.id===son.id));
});
test('maternal wedding persists agreement and chooses maternal house for children',()=>{
 const g=createGame(world,'england'),r=g.politics.people[g.politics.realms.england.ruler],f=g.politics.people[g.politics.realms.france.ruler];
 const a=r.children.map(id=>g.politics.people[id]).find(p=>p.sex==='female'),b=f.children.map(id=>g.politics.people[id]).find(p=>p.sex==='male');
 a.age=b.age=22;g.factions.england.treasury=1000;g.factions.england.relations.france=60;g.factions.france.relations.england=60;
 assert.ok(marriageCandidates(g,'england').some(x=>x.a===a.id&&x.b===b.id));
 assert.ok(politicsAction(g,world,'marry-maternal',a.id,b.id).ok);
 const saved=restoreGame(snapshot(g),world),pa=saved.politics.people[a.id],pb=saved.politics.people[b.id];
 assert.equal(marriageLineage(pa,pb).id,a.id);assert.equal(pa.spouse,b.id);
 assert.equal(saved.politics.marriages.at(-1).lineage,'maternal');
});
