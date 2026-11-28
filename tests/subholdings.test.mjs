import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {feudalAction,syncTitles} from '../src/feudal-systems.js';
import {subholdingProfile,subholdingKey,subholdingCandidates,tickSubholdings,renderCountySubholdings} from '../src/subholdings.js';
import {politicalRevenue,politicalLevy} from '../src/dynastic-politics.js';
import {creditEstateIncome,feudalHierarchy} from '../src/feudal-obligations.js';
import {tickIdentity} from '../src/identity-systems.js';
import {renderFeudal} from '../src/kingdom-ui.js';
import {careerAction,renderCareer} from '../src/player-career.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));

function fixture(direct=true,player='ming'){
 const g=createGame(world,player),realm='ming',r=g.politics.people[g.politics.realms[realm].ruler];
 r.age=35;
 const [id,h]=Object.entries(g.politics.holdings).find(([id,h])=>h.realm===realm);
 if(direct)h.lord=r.id;
 const holder=g.politics.people[h.lord];
 holder.age=35;
 g.provinces[id].development=10;
 g.factions[realm].treasury=10000;
 g.factions[realm].legitimacy=90;
 h.wealth=1000;
 syncTitles(g);
 return {g,realm,r,id,h,holder};
}

const key=(id,kind)=>subholdingKey(id,kind);

test('castles, cities and temples use different mechanics and real crown funds',()=>{
 const {g,realm,id}=fixture(),f=g.factions[realm],tax=politicalRevenue(g,realm),levy=politicalLevy(g,realm);
 assert.ok(feudalAction(g,world,'subholding-build',key(id,'city')).ok);
 assert.equal(f.treasury,9820);
 assert.ok(politicalRevenue(g,realm)>tax);
 assert.equal(politicalLevy(g,realm),levy);
 const cityRevenue=politicalRevenue(g,realm);
 assert.ok(feudalAction(g,world,'subholding-build',key(id,'castle')).ok);
 assert.equal(f.treasury,9540);
 assert.ok(politicalLevy(g,realm)>levy);
 assert.equal(politicalRevenue(g,realm),cityRevenue);
 assert.ok(feudalAction(g,world,'subholding-build',key(id,'temple')).ok);
 assert.equal(f.treasury,9380);
 const local=g.civic.provinces[id];
 local.localTrust=55;g.turn=3;tickIdentity(g,world);
 assert.ok(local.localTrust>=56);
 const copy=restoreGame(snapshot(g),world);
 assert.deepEqual(subholdingProfile(copy,id),{castle:2,city:1,temple:1,tax:1.06,levy:1.05});
 for(const kind of ['castle','city','temple'])assert.equal(copy.feudal.titles[key(id,kind)].parent,'c:'+id);
 assert.match(renderFeudal(copy,world,String),/Subordinate holdings/);
 assert.match(renderCountySubholdings(copy,id,String),/Barony/);
});

test('delegated seats pay real personal income without duplicating estate gold and persist',()=>{
 const {g,realm,id,h,r}=fixture();
 assert.ok(feudalAction(g,world,'subholding-build',key(id,'city')).ok);
 const candidate=subholdingCandidates(g,id,'city')[0];
 assert.ok(candidate&&candidate.id!==r.id);
 assert.ok(feudalAction(g,world,'subholding-appoint',key(id,'city'),candidate.id).ok);
 assert.equal(g.feudal.titles[key(id,'city')].holder,candidate.id);
 const total=h.wealth+candidate.wealth,cash=g.factions[realm].treasury,personGold=candidate.wealth;
 creditEstateIncome(g,id,100,feudalHierarchy(g,realm));
 assert.equal(candidate.wealth,personGold+5);
 assert.equal(h.wealth+candidate.wealth,total+100);
 assert.equal(g.factions[realm].treasury,cash);
 const copy=restoreGame(snapshot(g),world);
 assert.equal(copy.feudal.titles[key(id,'city')].holder,candidate.id);
 copy.politics.people[candidate.id].realm='joseon';syncTitles(copy);
 assert.equal(copy.feudal.titles[key(id,'city')].holder,r.id);
});

test('occupied or another lord estates cannot be built by a sovereign and legacy saves gain a county seat',()=>{
 const {g,realm,id,h}=fixture(),cash=g.factions[realm].treasury;
 g.campaignWar.occupations[id]={owner:realm,by:'joseon',war:'fixture'};
 assert.equal(feudalAction(g,world,'subholding-build',key(id,'city')).ok,false);
 assert.equal(g.factions[realm].treasury,cash);
 delete g.campaignWar.occupations[id];
 delete h.subholdings;
 delete g.feudal.titles[key(id,'castle')];
 const copy=restoreGame(snapshot(g),world);
 assert.equal(copy.feudal.titles[key(id,'castle')].level,1);
 assert.equal(copy.feudal.titles[key(id,'castle')].parent,'c:'+id);
});

test('vassals fund their own subordinate buildings rather than spending crown treasury',()=>{
 const {g,realm,id,h,holder}=fixture(false),cash=g.factions[realm].treasury;
 assert.equal(feudalAction(g,world,'subholding-build',key(id,'city')).ok,false);
 assert.ok(careerAction(g,'start',holder.id).ok);
 assert.ok(careerAction(g,'subholding-build',key(id,'city')).ok);
 assert.equal(h.wealth,820);
 assert.equal(g.factions[realm].treasury,cash);
 assert.equal(g.feudal.titles[key(id,'city')].holder,holder.id);
 assert.match(renderCareer(g,world,String),/Subordinate holdings/);
});

test('AI county holders invest annually using their own resources and no crown control is taken',()=>{
 const {g,realm,id,h,holder}=fixture(false,'england');
 for(const e of Object.values(g.politics.holdings))if(e.realm===realm)e.wealth=0;
 g.factions[realm].treasury=0;h.wealth=1000;holder.traits=['greedy'];g.civic.provinces[id].localTrust=80;
 g.turn=12;assert.ok(tickSubholdings(g));syncTitles(g);
 assert.equal(subholdingProfile(g,id).city,1);
 assert.ok(h.wealth<1000);
 assert.equal(g.factions[realm].treasury,0);
 assert.equal(g.feudal.titles[key(id,'city')].parent,'c:'+id);
});

test('baron control supports spawning local barons, setting tax/levy duty charters, and revoking baronies to demesne',()=>{
 const {g,realm,id,r}=fixture();
 assert.ok(feudalAction(g,world,'subholding-build',key(id,'city')).ok);
 assert.ok(feudalAction(g,world,'subholding-spawn',key(id,'city')).ok);
 const baronId=g.politics.holdings[id].subholdings.city.holder;
 assert.ok(baronId&&baronId!==r.id);
 assert.equal(g.feudal.baronies[key(id,'city')].granted,true);
 assert.equal(g.feudal.titles[key(id,'city')].holder,baronId);
 const htmlWithBaron=renderCountySubholdings(g,id,String);
 assert.match(htmlWithBaron,/Revoke to Demesne/);
 assert.match(htmlWithBaron,/subholding-duty/);

 const baseProf=subholdingProfile(g,id);
 assert.ok(feudalAction(g,world,'subholding-duty',key(id,'city'),'tax').ok);
 const taxProf=subholdingProfile(g,id);
 assert.ok(taxProf.tax>baseProf.tax);
 assert.ok(taxProf.levy<baseProf.levy);

 const copy=restoreGame(snapshot(g),world);
 assert.equal(copy.politics.holdings[id].subholdings.city.duty,'tax');
 assert.equal(subholdingProfile(copy,id).tax,taxProf.tax);

 assert.ok(feudalAction(copy,world,'subholding-revoke',key(id,'city')).ok);
 assert.equal(copy.politics.holdings[id].subholdings.city.holder,null);
 assert.equal(copy.feudal.baronies[key(id,'city')].granted,false);
 assert.equal(copy.feudal.titles[key(id,'city')].holder,r.id);
});
