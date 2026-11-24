import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,advanceMonth} from '../src/simulation.js';
import {careerCandidates,careerAction,careerView,humanControlsRealm,vassalCareer,renderCareer,renderCareerEntry} from '../src/player-career.js';
import {tickVassalCourts} from '../src/vassal-courts.js';
import {removePoliticalCharacter} from '../src/dynastic-politics.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function fixture(){
 const g=createGame(world,'england'),p=careerCandidates(g)[0];
 assert.ok(p);assert.ok(careerAction(g,'start',p.id).ok);
 const row=careerView(g).rows[0];row.h.wealth=500;p.wealth=500;
 return {g,p,id:row.id,h:row.h,pr:row.province};
}
test('vassal controls personal wealth and estate investment without accessing crown treasury',()=>{
 const {g,p,id,h,pr}=fixture(),gold=g.factions.england.treasury;
 const farm=pr.buildings.farm,development=pr.development;
 assert.equal(humanControlsRealm(g,'england'),false);
 assert.ok(careerAction(g,'invest',id,'farm').ok);
 assert.equal(pr.buildings.farm,farm+1);assert.equal(pr.development,Math.min(20,development+1));assert.equal(h.wealth,400);
 assert.equal(careerAction(g,'invest',id,'market').ok,false);
 assert.ok(careerAction(g,'withdraw',id).ok);assert.equal(p.wealth,540);assert.equal(h.wealth,360);
 assert.equal(careerAction(g,'withdraw',id).ok,false);assert.equal(g.factions.england.treasury,gold);
});
test('vassal cannot spend on a different holder or an occupied estate',()=>{
 const {g,p,id,h}=fixture(),other=Object.keys(g.politics.holdings).find(k=>g.politics.holdings[k].lord!==p.id);
 assert.equal(careerAction(g,'invest',other,'farm').ok,false);
 g.campaignWar.occupations[id]={by:'france',owner:'england'};
 assert.equal(careerAction(g,'withdraw',id).ok,false);assert.equal(h.wealth,500);
});
test('player petitions use the existing vassal court and receive an autonomous crown response',()=>{
 const {g,p,id,h}=fixture();h.tax=2;h.loyalty=20;g.factions.england.treasury=1000;
 assert.ok(careerAction(g,'petition',id,'tax').ok);
 assert.equal(careerAction(g,'petition',id,'tax').ok,false);
 assert.equal(careerView(g).petition.status,'pending');
 g.turn=6;tickVassalCourts(g);
 assert.equal(careerView(g).petition.status,'accept');assert.equal(h.tax,1);
});
test('career and actual estate state persist across save and restore',()=>{
 const {g,p,id}=fixture();assert.ok(careerAction(g,'invest',id,'farm').ok);
 const restored=restoreGame(snapshot(g),world);assert.equal(vassalCareer(restored).person,p.id);
 assert.equal(careerView(restored).rows[0].h.wealth,400);
 assert.match(renderCareer(restored,world,String),/VASSAL CAREER/);
 assert.equal(renderCareerEntry(restored,String),'');
});
test('vassal succession follows a surviving dynast through the actual estate inheritance',()=>{
 const {g,p,id}=fixture(),child=g.politics.people[p.children[0]];assert.ok(child);
 assert.ok(removePoliticalCharacter(g,world,p.id));
 assert.equal(g.politics.holdings[id].lord,child.id);
 assert.equal(vassalCareer(g).person,child.id);
});
test('vassal campaign advances while the liege uses autonomous crown management',()=>{
 const {g}=fixture();g.factions.england.treasury=10000;
 for(let i=0;i<6;i++)advanceMonth(g,world);
 assert.equal(g.turn,6);assert.ok(vassalCareer(g));
 assert.ok(Number.isFinite(g.factions.england.treasury));
 assert.ok(Object.values(g.armies).every(a=>a.infantry>=0&&a.archers>=0&&a.cavalry>=0));
});
