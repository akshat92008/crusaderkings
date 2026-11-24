import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createGame,snapshot,restoreGame,concludeBattle,empireStats,startMarch,armiesAt} from '../src/simulation.js';
import {conflictAction,activeWar,hasTruce,peaceTerms,tickConflict} from '../src/political-conflict.js';
import {controller,occupation,captureProvince} from '../src/campaign-war.js';
import {navalAction,fleetStats,navalUpkeep,fleetDestinations,blockadeTargets,portBlocked,embarked,tickNaval} from '../src/naval-systems.js';
import {tickEconomy} from '../src/economy-systems.js';
import {tradeIncome} from '../src/kingdom-depth.js';
import {renderConflict,renderNaval} from '../src/kingdom-ui.js';
const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));
const start=(id='england')=>{const g=createGame(world,id);g.factions[id].treasury=10000;return g;};
function declare(g,id){g.conflict.claims[g.player+':'+id]={realm:g.player,province:id,expires:120};assert.ok(conflictAction(g,world,'declare',id).ok);return activeWar(g,g.player,g.provinces[id].owner);}
const army=g=>Object.values(g.armies).find(a=>a.owner===g.player);
test('formal victory occupies without transferring title until peace, taxes fall',()=>{const g=start(),p=Object.values(g.provinces).find(p=>p.owner==='france'),w=declare(g,p.id),a=army(g),before=empireStats(g,'france').taxIncome;concludeBattle(g,{attacker:a.id,to:p.id},{victory:true,attackerRemaining:.9});assert.equal(p.owner,'france');assert.equal(controller(g,p.id),'england');assert.ok(empireStats(g,'france').taxIncome<before);assert.ok(occupation(restoreGame(snapshot(g),world),p.id));assert.ok(conflictAction(g,world,'peace',w.id,'enforce').ok);assert.equal(p.owner,'england');assert.equal(occupation(g,p.id),null);assert.ok(hasTruce(g,'england','france'));});
test('white peace restores occupied holdings and relocates occupation armies',()=>{const g=start(),p=Object.values(g.provinces).find(p=>p.owner==='france'),w=declare(g,p.id),a=army(g),from=a.province;captureProvince(g,w,g.player,p.id,from);a.province=p.id;g.turn=6;w.score=20;assert.ok(conflictAction(g,world,'peace',w.id,'white').ok);assert.equal(p.owner,'france');assert.equal(controller(g,p.id),'france');assert.equal(a.province,from);});
test('reparations transfer money but do not cede occupied territory',()=>{const g=start(),p=Object.values(g.provinces).find(p=>p.owner==='france'),w=declare(g,p.id),a=army(g),cash=g.factions.england.treasury;g.factions.france.treasury=1000;captureProvince(g,w,g.player,p.id,a.province);a.province=p.id;w.score=70;assert.ok(conflictAction(g,world,'peace',w.id,'reparations').ok);assert.equal(g.factions.england.treasury,cash+300);assert.equal(p.owner,'france');assert.equal(controller(g,p.id),'france');});
test('port construction consumes resources and creates upkeep, fleets transport armies',()=>{const g=start('ming'),a=army(g),port=g.naval.ports[a.province];assert.ok(port);const l=g.economy.provinces[a.province];l.stock.timber=60;l.stock.tools=30;for(let i=0;i<4;i++)assert.ok(navalAction(g,world,'ship',a.province,'transport').ok);const f=Object.values(g.naval.fleets)[0];assert.equal(fleetStats(f).capacity,280);assert.equal(navalUpkeep(g,g.player),12);const d=fleetDestinations(g,f)[0];assert.ok(d);const from=a.province;assert.ok(navalAction(g,world,'voyage',f.id,d.province,a.id).ok);assert.ok(embarked(g,a.id));assert.equal(armiesAt(g,from,g.player).length,0);for(let i=1;i<=3;i++){g.turn=i;tickNaval(g,world);}assert.equal(a.province,d.province);assert.equal(embarked(g,a.id),false);assert.equal(f.status,'docked');});
test('enemy blockade requires war and ends when peace is signed',()=>{const g=start(),p=Object.values(g.naval.ports).find(p=>g.provinces[p.province].owner==='england'),q=Object.values(g.naval.ports).find(p=>g.provinces[p.province].owner==='france');const l=g.economy.provinces[p.province];l.stock.timber=60;l.stock.tools=30;assert.ok(navalAction(g,world,'ship',p.province,'galley').ok);const f=Object.values(g.naval.fleets)[0];assert.equal(navalAction(g,world,'blockade',f.id,q.province).ok,false);const w=declare(g,q.province);assert.ok(navalAction(g,world,'blockade',f.id,q.province).ok);g.turn=1;tickNaval(g,world);g.turn=2;tickNaval(g,world);assert.ok(portBlocked(g,q.province));assert.ok(conflictAction(g,world,'peace',w.id,'surrender').ok);g.turn=3;tickNaval(g,world);assert.equal(portBlocked(g,q.province),false);assert.equal(f.status,'docked');});
test('old saves migrate naval and occupation records and expose interface',()=>{const g=start();delete g.campaignWar;delete g.naval;const c=restoreGame(snapshot(g),world);assert.ok(c.campaignWar);assert.ok(c.naval);assert.ok(renderNaval(c,world,String).includes('NAVAL COMMAND'));});

test('blockades suppress trade and a stronger defending fleet breaks the blockade',()=>{const g=start(),p=Object.values(g.naval.ports).find(p=>g.provinces[p.province].owner==='england'),q=Object.values(g.naval.ports).find(p=>g.provinces[p.province].owner==='france');g.kingdom.tradePacts['england|france']={partners:['england','france']};const initial=tradeIncome(g,'england');const l=g.economy.provinces[p.province];l.stock.timber=60;l.stock.tools=30;assert.ok(navalAction(g,world,'ship',p.province,'galley').ok);const f=Object.values(g.naval.fleets)[0];declare(g,q.province);assert.ok(navalAction(g,world,'blockade',f.id,q.province).ok);g.turn=1;tickNaval(g,world);g.turn=2;tickNaval(g,world);assert.ok(portBlocked(g,q.province));assert.ok(tradeIncome(g,'england')<initial);g.naval.fleets.defender={id:'defender',realm:'france',port:q.province,status:'docked',target:null,remaining:0,ships:{transport:0,galley:0,warship:3}};g.player='france';assert.ok(navalAction(g,world,'break-blockade','defender').ok);assert.equal(portBlocked(g,q.province),false);assert.equal(g.naval.fleets[f.id],undefined);assert.equal(tradeIncome(g,'england'),initial);});
test('liberating a title clears military occupation without annexation',()=>{const g=start(),p=Object.values(g.provinces).find(p=>p.owner==='france'),w=declare(g,p.id);captureProvince(g,w,'england',p.id,army(g).province);assert.ok(captureProvince(g,w,'france',p.id,null));assert.equal(occupation(g,p.id),null);assert.equal(p.owner,'france');});

test('war panel and peace actions use the same requirements and affordable payout',()=>{
 const g=start(),province=Object.values(g.provinces).find(p=>p.owner==='france');
 const w=declare(g,province.id),terms=()=>peaceTerms(g,w,g.player);
 const reparations=()=>terms().find(t=>t.id==='reparations');
 const enforce=()=>terms().find(t=>t.id==='enforce');
 const html=()=>renderConflict(g,world,String);
 assert.ok(reparations().reason);
 assert.ok(enforce().reason);
 assert.match(html(),/disabled data-action="conflict" data-type="peace"[^>]*data-extra="enforce"/);
 assert.equal(conflictAction(g,world,'peace',w.id,'reparations').msg,reparations().reason);

 w.score=65;
 g.factions.france.treasury=47;
 assert.equal(reparations().amount,47);
 assert.match(html(),/Receive 47 gold/);
 assert.ok(enforce().reason);
 captureProvince(g,w,g.player,province.id,army(g).province);
 assert.equal(enforce().reason,'');
 assert.ok(conflictAction(g,world,'peace',w.id,'enforce').ok);
 assert.deepEqual(terms(),[]);
});
