import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame} from '../src/simulation.js';
import {careerCandidates,careerAction} from '../src/player-career.js';
import {campaignTabAllowed,campaignTab,careerPriorities,renderCareerCharacter,renderCareerProvince,renderCareerLinks} from '../src/campaign-access.js';
import {campaignSearch} from '../src/campaign-search.js';
import {WORKSPACES,realmPriorities} from '../src/campaign-navigation.js';
import {renderCampaignHub} from '../src/kingdom-ui.js';
import {characterDirectory} from '../src/campaign-hud.js';
import {transferProvince} from '../src/campaign-war.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
test('all sovereign management pages are linked directly from the realm hub',()=>{
 const g=createGame(world,'england'),html=renderCampaignHub(g,esc);
 for(const tab of WORKSPACES.flatMap(w=>w.tabs).filter(t=>t!=='realm'))assert.ok(html.includes('data-priority-tab="'+tab+'"'),tab);
 assert.ok(campaignSearch(g,world,'personal unions').some(x=>x.id==='dynasty'));
 assert.ok(campaignSearch(g,world,'patron commissions').some(x=>x.id==='realm'));
});
test('vassal mode connects the actual character and estate without crown control links',()=>{
 const g=createGame(world,'england'),p=careerCandidates(g)[0];assert.ok(careerAction(g,'start',p.id).ok);
 const id=Object.keys(g.politics.holdings).find(k=>g.politics.holdings[k].lord===p.id);
 const restored=restoreGame(snapshot(g),world),html=renderCareerLinks(restored,world,esc),profile=renderCareerCharacter(restored,world,p.id,esc),province=renderCareerProvince(restored,world,id,esc);
 assert.ok(html.includes('data-character="'+p.id+'"'));assert.ok(html.includes('data-province-link="'+id+'"'));
 assert.match(profile,/Personal resources/);assert.ok(profile.includes('data-province-link="'+id+'"'));assert.doesNotMatch(profile,/data-action="politics"/);
 assert.match(province,/Your estate/);assert.doesNotMatch(province,/data-action="recruit"/);
 assert.ok(characterDirectory(restored,{scope:'family'}).some(q=>q.id===p.id));
 assert.equal(campaignTab(restored,'military'),'realm');assert.equal(campaignTabAllowed(restored,'characters'),true);
 assert.ok(campaignSearch(restored,world,'landless').some(x=>x.id==='realm'));
 assert.ok(!campaignSearch(restored,world,'military').some(x=>x.kind==='page'&&x.id==='military'));
 restored.campaignWar.occupations[id]={by:'france',owner:'england'};
 assert.ok(careerPriorities(restored).some(x=>x.label==='Occupied estates'));
});
test('loss of all territory creates an actionable exile alert',()=>{
 const g=createGame(world,'england');
 for(const p of Object.values(g.provinces).filter(p=>p.owner===g.player))assert.ok(transferProvince(g,p.id,'france'));
 assert.ok(realmPriorities(g,{balance:0,foodDelta:0}).some(x=>x.tab==='realm'&&x.label==='Court in exile'));
});
