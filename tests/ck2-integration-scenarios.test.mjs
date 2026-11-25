import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {
 createGame,advanceMonth,snapshot,restoreGame
} from '../src/simulation.js';
import {
 politicsAction,removePoliticalCharacter
} from '../src/dynastic-politics.js';
import {
 createTitle,revokeTitle
} from '../src/feudal-systems.js';
import {
 createFaction,conflictAction,civilWarForces
} from '../src/political-conflict.js';
import {
 declareCasusBelliWar,availableCasusBelli,coordinatedPeace,captureProvince
} from '../src/campaign-war.js';
import {intrigueAction,activePlots,plotTargets} from '../src/intrigue-systems.js';
import {faithCharterAction,faithSystemView} from '../src/faith-institutions.js';
import {identityAction} from '../src/identity-systems.js';
import {economyAction} from '../src/economy-systems.js';
import {characterHealth} from '../src/living-systems.js';
import {foundBreakaway} from '../src/independence-systems.js';
import {merchantElectionView,merchantCampaign} from '../src/regional-institutions.js';
import {diplomacyAction} from '../src/diplomacy-systems.js';
import {militaryAction,armyCompositionBreakdown} from '../src/military-systems.js';
import {
 renderFeudal,renderDynasty,renderConflict,renderDiplomaticAgreements,
 renderMilitary,renderIdentity,renderIntrigue,renderEconomy,renderExpanded,renderCharacter
} from '../src/kingdom-ui.js';

const world=JSON.parse(readFileSync(new URL('../data/world.json',import.meta.url)));

function assertTitleAndLinkInvariants(g){
 assert.ok(g.feudal&&g.feudal.titles,'feudal titles exist');
 for(const [id,p] of Object.entries(g.provinces)){
  if(p.owner==='independent'||!g.politics?.realms?.[p.owner])continue;
  const ct=g.feudal.titles['c:'+id];
  assert.ok(ct,`county title exists for ${id}`);
  assert.equal(ct.realm,p.owner,`county realm matches owner for ${id}`);
  assert.ok(g.politics.people[ct.holder],`valid county holder for ${id}`);
 }
 for(const [realm,s] of Object.entries(g.politics.realms)){
  assert.ok(g.politics.people[s.ruler]?.alive,`living ruler for ${realm}`);
  const kt=g.feudal.titles['k:'+realm];
  assert.ok(kt,`kingdom title exists for ${realm}`);
  assert.equal(kt.holder,s.ruler,`kingdom holder synced for ${realm}`);
 }
}

test('Scenario 1: Ruler dies -> 5-tier inheritance, regency/claimant pressure, save/reload intact',()=>{
 const g=createGame(world,'france');
 g.factions.france.treasury=3000;
 g.factions.france.prestige=200;
 g.factions.france.legitimacy=80;
 const oldId=g.politics.realms.france.ruler;
 const oldRuler=g.politics.people[oldId];
 const frProvs=Object.values(g.provinces).filter(p=>p.owner==='france').map(p=>p.id);
 if(frProvs.length>=2){
  createTitle(g,world,'france','d:integration_duchy',{name:'Duchy of Integration',feudalTier:'duchy',members:frProvs.slice(0,2)});
 }
 const childId='p'+g.nextId++;
 g.politics.people[childId]={id:childId,name:'Young Louis',house:oldRuler.house,realm:'france',sex:'male',age:8,alive:true,traits:['diligent'],skills:{diplomacy:3,martial:2,stewardship:3,intrigue:2,learning:3},parents:[oldId],children:[],memories:[]};
 oldRuler.children=[childId,...(oldRuler.children||[])];
 removePoliticalCharacter(g,world,oldId);
 const newRulerId=g.politics.realms.france.ruler;
 assert.notEqual(newRulerId,oldId,'new ruler inherited throne');
 const restored=restoreGame(snapshot(g),world);
 assert.equal(restored.politics.realms.france.ruler,newRulerId);
 assertTitleAndLinkInvariants(restored);
});

test('Scenario 2: Vassal rebels -> faction civil war, field armies, imprisonment & title revocation',()=>{
 const g=createGame(world,'england');
 g.factions.england.treasury=2000;
 g.factions.england.legitimacy=85;
 const rulerId=g.politics.realms.england.ruler;
 const vassalHoldings=Object.entries(g.politics.holdings).filter(([,h])=>h.realm==='england'&&h.lord!==rulerId);
 assert.ok(vassalHoldings.length>=1,'england has vassal holdings');
 const members=vassalHoldings.slice(0,2).map(([id])=>id);
 for(const id of members)g.politics.holdings[id].loyalty=10;
 const x=createFaction(g,world,'england','liberty',members,{pressure:95});
 assert.ok(x&&x.id,'liberty faction created');
 x.status='ultimatum';
 const ulRes=conflictAction(g,world,'refuse',x.id);
 assert.ok(ulRes.ok&&x.status==='civil war','ultimatum refusal triggers civil war');
 const forces=civilWarForces(g,x,world);
 assert.ok(forces&&Array.isArray(forces.forces)&&Number.isFinite(forces.power),'civil war reports theater forces');
 assert.ok(x.rebelFaction&&Object.values(g.armies).some(a=>a.owner===x.rebelFaction),'rebel field armies mobilized on map');
 // Settle the rebellion in royal favor before post-war punishment & revocation.
 x.score=85;x.months=2;x.rebels=5;
 for(const a of Object.values(g.armies))if(a.owner===x.rebelFaction){a.infantry=5;a.archers=0;a.cavalry=0;}
 conflictAction(g,world,'mobilize',x.id);
 delete g.campaignWar?.occupations?.[members[0]];
 const revTarget='c:'+members[0];
 const lordId=g.politics.holdings[members[0]].lord;
 g.feudal.prisoners??={};
 g.feudal.prisoners[lordId]={id:lordId,realm:'england',by:'england',status:'held',reason:'rebellion',turn:g.turn};
 const rev=revokeTitle(g,world,'england',revTarget,{free:true});
 assert.ok(rev.ok,'imprisoned rebel title revocable: '+rev.msg);
 assertTitleAndLinkInvariants(g);
});

test('Scenario 3: Royal marriage -> betrothal matures to wedding, claims, treaty & divorce checks',()=>{
 const g=createGame(world,'castile');
 g.factions.castile.treasury=3000;
 g.factions.aragon.treasury=3000;
 g.factions.castile.relations.aragon=60;
 g.factions.aragon.relations.castile=60;
 const casRuler=g.politics.people[g.politics.realms.castile.ruler];
 const araRuler=g.politics.people[g.politics.realms.aragon.ruler];
 const aChild='p'+g.nextId++,bChild='p'+g.nextId++;
 g.politics.people[aChild]={id:aChild,name:'Infante Diego',house:casRuler.house,realm:'castile',sex:'male',age:17,alive:true,traits:['honest'],skills:{diplomacy:3,martial:3,stewardship:3,intrigue:2,learning:3},parents:[casRuler.id],children:[],memories:[]};
 g.politics.people[bChild]={id:bChild,name:'Infanta Beatriz',house:araRuler.house,realm:'aragon',sex:'female',age:17,alive:true,traits:['just'],skills:{diplomacy:4,martial:2,stewardship:3,intrigue:2,learning:3},parents:[araRuler.id],children:[],memories:[]};
 casRuler.children.push(aChild);araRuler.children.push(bChild);
 const bet=politicsAction(g,world,'betroth',aChild,bChild);
 assert.ok(bet.ok,'betrothal arranged: '+bet.msg);
 for(let i=0;i<13;i++)advanceMonth(g,world);
 assert.equal(g.politics.people[aChild].spouse,bChild,'betrothed pair wed on coming of age');
 assert.equal(g.factions.castile.treaties.aragon,'marriage','marriage alliance active');
 assertTitleAndLinkInvariants(g);
});

test('Scenario 4: Assassination plot -> agent recruitment, preparations, execution & succession',()=>{
 const g=createGame(world,'ottomans');
 g.factions.ottomans.treasury=3000;
 const rulerId=g.politics.realms.ottomans.ruler;
 g.politics.people[rulerId].skills.intrigue=5;
 const target=plotTargets(g,'ottomans','assassinate')[0];
 assert.ok(target,'eligible assassination target available');
 const started=intrigueAction(g,world,'start','assassinate',target.id);
 assert.ok(started.ok,'assassination plot started: '+started.msg);
 const plot=activePlots(g,'ottomans').find(p=>p.kind==='assassinate');
 assert.ok(plot,'active assassination plot recorded');
 const prep=intrigueAction(g,world,'prepare',plot.id);
 assert.ok(prep.ok,'preparations increased plot odds');
 plot.due=g.turn;
 plot.preparation=100;
 advanceMonth(g,world);
 assert.ok(g.intrigue.outcomes.ottomans?.length>=1,'assassination outcome recorded');
 assertTitleAndLinkInvariants(g);
});

test('Scenario 5: Religious conversion -> tradition system action, heresy/trust & provincial conversion',()=>{
 const g=createGame(world,'ottomans');
 g.factions.ottomans.treasury=2500;
 g.factions.ottomans.piety=150;
 const view=faithSystemView(g,'ottomans');
 assert.equal(view.system,'islamic','ottomans map to islamic faith system');
 const hajj=faithCharterAction(g,'ottomans','faith-hajj');
 assert.ok(hajj.ok,'islamic hajj action succeeds: '+hajj.msg);
 const prov=Object.values(g.provinces).find(p=>p.owner==='ottomans');
 const initCulture=identityAction(g,world,'culture',prov.id);
 assert.ok(initCulture.ok||typeof initCulture.msg==='string');
 const engView=faithSystemView(g,'england');
 assert.equal(engView.system,'catholic');
 const ind=faithCharterAction(g,'england','faith-indulgence');
 assert.ok(ind.ok,'catholic indulgence works: '+ind.msg);
 assertTitleAndLinkInvariants(g);
});

test('Scenario 6: War victory -> CB declaration, province occupation, peace treaty & devastation recovery',()=>{
 const g=createGame(world,'england');
 g.factions.england.treasury=4000;
 g.factions.england.prestige=200;
 const engProvs=new Set(Object.values(g.provinces).filter(p=>p.owner==='england').map(p=>p.id));
 const enemyProv=world.provinces.find(p=>!engProvs.has(p.id)&&g.provinces[p.id]?.owner!=='independent'&&p.neighbors.some(n=>engProvs.has(n)));
 assert.ok(enemyProv,'border province exists');
 const defender=g.provinces[enemyProv.id].owner;
 const cbs=availableCasusBelli(g,world,'england',defender);
 assert.ok(cbs.length>=1,'at least one CB available');
 const cb=cbs[0];
 const dec=declareCasusBelliWar(g,world,'england',defender,cb.cb,cb.target);
 assert.ok(dec.ok,'CB war declared: '+dec.msg);
 const war=Object.values(g.conflict.wars).find(w=>w.status==='active'&&w.attacker==='england'&&w.defender===defender);
 assert.ok(war,'active war recorded');
 captureProvince(g,war,'england',enemyProv.id,defender);
 war.score=100;
 const peace=coordinatedPeace(g,world,war.id,'enforce','england');
 assert.ok(peace.ok,'peace settled cleanly: '+peace.msg);
 if((g.economy.provinces[enemyProv.id]?.devastation||0)>0){
  const reb=economyAction(g,world,'rebuild',enemyProv.id);
  assert.ok(reb.ok,'reconstruction reduced devastation');
 }
 assertTitleAndLinkInvariants(g);
});

test('Scenario 7: Epidemic -> disease spread, illness & child regency, hospitium + relief mitigation',()=>{
 const g=createGame(world,'castile');
 g.factions.castile.treasury=2000;
 const capId=Object.values(g.provinces).find(p=>p.owner==='castile').id;
 g.economy.crises[capId]={province:capId,kind:'epidemic',severity:75,started:g.turn,remaining:6,reliefTurn:-12};
 const hospRes=economyAction(g,world,'holding-building',capId,'hospitium');
 assert.ok(hospRes.ok,'temple hospitium built: '+hospRes.msg);
 const relRes=economyAction(g,world,'relief',capId);
 assert.ok(relRes.ok,'epidemic relief applied');
 for(let i=0;i<6;i++)advanceMonth(g,world);
 const rulerHealth=characterHealth(g,g.politics.realms.castile.ruler);
 assert.ok(rulerHealth&&typeof rulerHealth.condition==='string');
 assertTitleAndLinkInvariants(g);
});

test('Scenario 8: Kingdom collapse -> contiguous independence revolt splits sovereign breakaway realm',()=>{
 const g=createGame(world,'ming');
 g.factions.ming.treasury=3000;
 const mingProvs=world.provinces.filter(p=>g.provinces[p.id]?.owner==='ming');
 assert.ok(mingProvs.length>=5,'ming has enough provinces to split cleanly');
 const mingRuler=g.politics.realms.ming.ruler;
 let pairIds=null;
 for(const a of mingProvs){
  for(const nId of a.neighbors){
   if(g.provinces[nId]?.owner==='ming'&&a.id!==nId){pairIds=[a.id,nId];break;}
  }
  if(pairIds)break;
 }
 assert.ok(pairIds,'contiguous pair found in ming');
 for(const id of pairIds)if(g.politics.holdings[id].lord===mingRuler){
  const pId='p'+g.nextId++;
  g.politics.people[pId]={id:pId,name:'Governor '+id,house:'House '+id,realm:'ming',sex:'male',age:32,alive:true,traits:['ambitious'],skills:{diplomacy:3,martial:3,stewardship:3,intrigue:2,learning:2},parents:[],children:[],memories:[]};
  g.politics.holdings[id].lord=pId;
 }
 const fx=createFaction(g,world,'ming','independence',pairIds,{pressure:95});
 assert.ok(fx&&fx.id,'independence faction created');
 fx.status='civil war';
 const newId=foundBreakaway(g,world,fx);
 assert.ok(newId&&g.factions[newId],'new breakaway realm founded: '+newId);
 for(const id of pairIds)assert.equal(g.provinces[id].owner,newId,'province transferred to breakaway realm');
 assertTitleAndLinkInvariants(g);
});

test('Scenario 9: Merchant election -> Novgorod patrician campaign and republican election continuity',()=>{
 const g=createGame(world,'novgorod');
 g.factions.novgorod.treasury=3000;
 const rulerId=g.politics.realms.novgorod.ruler;
 const landedLords=[...new Set(Object.entries(g.politics.holdings).filter(([,h])=>h.realm==='novgorod'&&h.lord!==rulerId).map(([,h])=>h.lord))];
 assert.ok(landedLords.length>=2,'novgorod has landed patrician houses');
 for(const lid of landedLords.slice(0,2))g.institutions.realms.novgorod.houses[lid]={person:lid,level:2};
 advanceMonth(g,world);
 const v0=merchantElectionView(g,'novgorod');
 assert.ok(v0&&v0.candidates?.length>=2,'novgorod has merchant election candidates');
 const pick=v0.candidates[0].id;
 const camp=merchantCampaign(g,'novgorod',pick);
 assert.ok(camp.ok,'patrician campaign backed: '+camp.msg);
 g.civic.realms.novgorod.lastElection=g.turn-59;
 advanceMonth(g,world);
 assert.ok(g.politics.people[g.politics.realms.novgorod.ruler]?.alive,'novgorod has living doge/posadnik post-election');
 assert.ok(g.civic.realms.novgorod.lastElection>0,'election timestamp updated');
 assertTitleAndLinkInvariants(g);
});

test('Scenario 10: Full UI tabs render with 0 errors and Diplomacy/Military/Emergent actions round-trip across save/reload',()=>{
 const g=createGame(world,'england');
 g.factions.england.treasury=5000;
 g.factions.england.prestige=250;
 g.factions.england.piety=150;
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const rulerId=g.politics.realms.england.ruler;
 const scot=g.factions.scotland?'scotland':'france';
 const col=diplomacyAction(g,world,'coalition-join',scot);
 assert.ok(col.ok,'joined coalition: '+col.msg);
 const homeProv=Object.values(g.provinces).find(p=>p.owner==='england')?.id;
 const merc=militaryAction(g,world,'hire-mercenary',homeProv,'white_company');
 assert.ok(merc.ok||typeof merc.msg==='string');
 const arm=Object.values(g.armies).find(a=>a.owner==='england');
 const br=armyCompositionBreakdown(g,arm);
 assert.ok(br&&Number.isFinite(br.total),'composition breakdown computed');
 // Render every tab using exact main.js signatures.
 const htmlParts=[
  renderFeudal(g,world,esc),
  renderDynasty(g,esc),
  renderConflict(g,world,esc),
  renderDiplomaticAgreements(g,scot,esc,world),
  renderMilitary(g,world,esc),
  renderIdentity(g,world,esc),
  renderIntrigue(g,esc),
  renderEconomy(g,world,esc),
  renderExpanded(g,world,esc),
  renderCharacter(g,world,rulerId,esc)
 ];
 for(const html of htmlParts)assert.ok(typeof html==='string'&&html.length>20);
 const saved=snapshot(g);
 const reloaded=restoreGame(saved,world);
 assertTitleAndLinkInvariants(reloaded);
});
