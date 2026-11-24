import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,advanceMonth,startMarch} from '../src/simulation.js';
import {temperament,strategicPlan,threatAssessment,strategicTargetScore,raidThreshold,defenseSupport,defensivePartners,strategyAction,tickStrategy,militaryStrength,borderRealms,strategicFronts} from '../src/strategic-ai.js';
import {renderStrategy} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const start=(realm='england')=>{const g=createGame(world,realm);g.factions[realm].treasury=10000;return g;};
const ruler=(g,id)=>g.politics.people[g.politics.realms[id].ruler];
test('personality changes aggression and raid threshold',()=>{const g=start(),r=ruler(g,'france');r.traits=['ambitious','brave'];const first=temperament(g,'france'),risk=raidThreshold(g,'france','england');r.traits=['content','cautious'];assert.ok(temperament(g,'france').aggression<first.aggression);assert.ok(raidThreshold(g,'france','england')>risk);});
test('plans react to succession, crises and actual wars',()=>{const g=start(),f=g.factions.england;f.food=-50;g.turn=3;tickStrategy(g,world);assert.equal(strategicPlan(g,'england').goal,'recover');f.food=500;g.conflict.wars.test={id:'test',attacker:'france',defender:'england',status:'active',goal:Object.values(g.provinces).find(p=>p.owner==='england').id,started:3};g.turn=9;tickStrategy(g,world);assert.equal(strategicPlan(g,'england').goal,'defend');assert.equal(strategicPlan(g,'england').target,'france');});
test('formal war objective and relative defenses affect target priority',()=>{const g=start(),a=Object.values(g.armies).find(a=>a.owner==='england'),p=Object.values(g.provinces).find(p=>p.owner==='france'),before=strategicTargetScore(g,world,a,p);g.conflict.wars.test={id:'test',attacker:'england',defender:'france',status:'active',goal:p.id,started:0};assert.ok(strategicTargetScore(g,world,a,p)>before);const score=strategicTargetScore(g,world,a,p);p.buildings.fort+=3;assert.ok(strategicTargetScore(g,world,a,p)<score);});
test('defensive pacts require willing partners and supply real defense strength',()=>{const g=start();g.factions.france.relations.england=25;g.factions.france.relations.ottomans=-100;assert.ok(threatAssessment(g,world,'france','ottomans')>=45);assert.equal(defenseSupport(g,'england','ottomans'),0);assert.ok(strategyAction(g,world,'pact','france','ottomans').ok);assert.ok(defensivePartners(g,'england','ottomans').includes('france'));assert.ok(defenseSupport(g,'england','ottomans')>0);assert.equal(defenseSupport(g,'england','ming'),0);assert.equal(strategyAction(g,world,'pact','france','ottomans').ok,false);const copy=restoreGame(snapshot(g),world);assert.ok(defenseSupport(copy,'england','ottomans')>0);g.turn=60;tickStrategy(g,world);assert.equal(defenseSupport(g,'england','ottomans'),0);});
test('AI plans persist across save/load and do not autonomously march the player army',()=>{const g=start(),a=Object.values(g.armies).find(a=>a.owner==='england'),from=a.province;g.turn=3;tickStrategy(g,world);assert.equal(a.province,from);assert.ok(Object.keys(g.strategy.plans).length>30);const copy=restoreGame(snapshot(g),world);assert.equal(strategicPlan(copy,'france').goal,strategicPlan(g,'france').goal);assert.ok(renderStrategy(copy,world,String).includes('DEFENSIVE PACTS'));delete g.strategy;assert.ok(restoreGame(snapshot(g),world).strategy);});
test('AI advances on owned roads toward a designated hostile frontier',()=>{const g=start('england');let candidate;for(const a of Object.values(g.armies)){if(a.owner===g.player)continue;const origin=world.provinces.find(p=>p.id===a.province);if(!origin)continue;const same=origin.neighbors.map(id=>world.provinces.find(p=>p.id===id)).filter(p=>p&&g.provinces[p.id].owner===a.owner);for(const p of same){const enemy=p.neighbors.map(id=>g.provinces[id]?.owner).find(id=>id&&id!==a.owner&&id!=='independent'&&g.factions[id]&&!origin.neighbors.some(n=>g.provinces[n]?.owner===id));if(enemy){candidate={a,p,enemy};break;}}if(candidate)break;}assert.ok(candidate);const {a,p,enemy}=candidate,from=a.province;g.strategy.plans[a.owner]={goal:'conquer',target:enemy,review:99,ruler:ruler(g,a.owner).id,since:0};g.turn=3;tickStrategy(g,world);assert.ok(a.province!==from);assert.equal(g.provinces[a.province].owner,a.owner);});

test('new and ended wars invalidate plans before the scheduled quarterly review, including after reload',()=>{
 const g=start(),f=g.factions.england;f.food=-50;
 g.turn=3;tickStrategy(g,world);assert.equal(strategicPlan(g,'england').goal,'recover');
 assert.equal(strategicPlan(g,'england').review,9);
 const province=Object.values(g.provinces).find(p=>p.owner==='england').id;
 g.conflict.wars.urgent={id:'urgent',attacker:'france',defender:'england',status:'active',goal:province,started:4};
 g.turn=6;tickStrategy(g,world);
 assert.equal(strategicPlan(g,'england').goal,'defend');
 assert.equal(strategicPlan(g,'england').target,'france');
 assert.equal(strategicPlan(g,'england').review,12);
 const copy=restoreGame(snapshot(g),world);
 // Restoration can reconcile synthetic wars; explicitly settle the fixture here.
 if(copy.conflict.wars.urgent)copy.conflict.wars.urgent.status='ended';
 copy.factions.england.food=-50;copy.turn=9;tickStrategy(copy,world);
 assert.equal(strategicPlan(copy,'england').goal,'recover');
 assert.equal(strategicPlan(copy,'england').target,null);
});

test('new defensive front interrupts the previous offensive plan before its scheduled review',()=>{const g=start(),mine=Object.values(g.provinces).find(p=>p.owner==='england'),theirs=Object.values(g.provinces).find(p=>p.owner==='france');g.conflict.wars.old={id:'old',attacker:'england',defender:'france',status:'active',goal:theirs.id,started:0,score:10};g.turn=3;tickStrategy(g,world);assert.equal(strategicPlan(g,'england').target,'france');g.conflict.wars.new={id:'new',attacker:'burgundy',defender:'england',status:'active',goal:mine.id,started:4,score:70};g.campaignWar.occupations[mine.id]={by:'burgundy',owner:'england',war:'new'};g.turn=6;tickStrategy(g,world);const fronts=strategicFronts(g,world,'england');assert.equal(fronts[0].target,'burgundy');assert.equal(fronts[0].occupied,true);assert.equal(strategicPlan(g,'england').goal,'defend');assert.equal(strategicPlan(g,'england').fronts.length,2);assert.match(renderStrategy(g,world,String),/ACTIVE FRONTS/);g.conflict.wars.new.status='white peace';delete g.campaignWar.occupations[mine.id];g.turn=9;tickStrategy(g,world);assert.equal(strategicPlan(g,'england').target,'france');});
