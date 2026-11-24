import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,empireStats} from '../src/simulation.js';
import {merchantTreatyStatus,tradeIncome,royalDiplomacy} from '../src/kingdom-depth.js';
import {transferProvince} from '../src/campaign-war.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
function fixture(){
 const g=createGame(world,'england'),pact={partners:['england','france'],founded:0};
 g.kingdom.tradePacts['england|france']=pact;
 return {g,pact};
}
test('landless realms do not earn or generate merchant treaty income; restoration resumes trade',()=>{
 const {g,pact}=fixture(),domain=Object.values(g.provinces).filter(p=>p.owner==='england').map(p=>p.id);
 assert.ok(tradeIncome(g,'england')>0);
 for(const id of domain)assert.ok(transferProvince(g,id,'france'));
 assert.match(merchantTreatyStatus(g,pact),/Suspended/);
 assert.equal(tradeIncome(g,'england'),0);assert.equal(tradeIncome(g,'france'),0);
 assert.equal(empireStats(g,'england').trade,0);
 const restored=restoreGame(snapshot(g),world);
 assert.equal(tradeIncome(restored,'england'),0);
 assert.ok(transferProvince(restored,domain[0],'england'));
 assert.ok(tradeIncome(restored,'england')>0);
});
test('an occupied market does not increase its legal owner merchant revenue',()=>{
 const {g}=fixture(),p=Object.values(g.provinces).find(p=>p.owner==='england');
 p.buildings.market=3;
 const initial=tradeIncome(g,'england');
 g.campaignWar.occupations[p.id]={province:p.id,by:'france',owner:'england',war:'test'};
 assert.ok(tradeIncome(g,'england')<initial);
});
test('new merchant treaties require a controlled settlement on both sides',()=>{
 const g=createGame(world,'england'),domain=Object.values(g.provinces).filter(p=>p.owner==='france');
 for(const p of domain)assert.ok(transferProvince(g,p.id,'england'));
 g.factions.england.relations.france=60;g.factions.england.treasury=1000;
 assert.equal(royalDiplomacy(g,world,'france','trade').ok,false);
 assert.equal(g.factions.england.treasury,1000);
});
