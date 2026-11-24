import {borderBattleOutcome,proportionalLoss,campaignArmyPower,campaignGarrison} from './border-battle.js';
import {participatingArmies,applyFieldForceLosses} from './field-forces.js';
import {capitalDistrict} from './historical-world.js';
import {nonAggression,aidStrength,diplomaticSupport,mayEnterWithAccess,fieldContingentsAt} from './diplomacy-systems.js';
import {campaignWorld} from './independence-systems.js';
import {captureCommander} from './feudal-systems.js';
import {strategicTargetScore,raidThreshold,defenseSupport,localCampaignForces,recordStrategicBattle} from './strategic-ai.js';
import {controller,occupation,occupationTax,captureProvince,transferProvince} from './campaign-war.js';
import {embarked,navalUpkeep,portBlocked} from './naval-systems.js';
import {onArmyMarch,armyReadiness,syncRegiments,applyFortDamage,initMilitary} from './military-systems.js';
import {economyModifiers} from './economy-systems.js';
import {heritageModifiers} from './heritage-systems.js';
import {civicModifiers,civicProvinceUnrest} from './civic-systems.js';
import {hasTruce,recordCampaignBattle,activeWar} from './political-conflict.js';
/* Crown of Nations: deterministic, serializable campaign rules. No browser dependencies. */
import {politicalRevenue,politicalLevy,reconcilePoliticalHoldings} from './dynastic-politics.js';
import {initializeKingdomSystems,advanceKingdomSystems,royalDiplomacy,tradeIncome} from './kingdom-depth.js';
import {militaryDoctrine,startingTroops} from './military-doctrines.js';
export const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
export const BUILDINGS={farm:{name:'Farmstead',cost:180,icon:'🌾',desc:'+food and population growth'},market:{name:'Market Hall',cost:260,icon:'⚖',desc:'+tax and trade income'},barracks:{name:'Barracks',cost:320,icon:'⚔',desc:'stronger army recruitment'},fort:{name:'Fortification',cost:440,icon:'▣',desc:'larger defending army and advantage'}};
export const POLICY={tax:['Lenient','Moderate','Heavy'],levy:['Voluntary','Standard','Mass levy'],tolerance:['Restrictive','Pragmatic','Pluralist']};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createGame(world,player='ottomans'){
 const factions=Object.fromEntries(world.factions.map(f=>[f.id,{...f,treasury:f.initialTreasury,prestige:f.initialPrestige,stability:75,legitimacy:65,food:350,policies:{tax:1,levy:1,tolerance:1},relations:{},treaties:{},tech:1}]));
 factions.independent={id:'independent',name:'Independent Polities',color:'#646c68',government:'Regional polities',treasury:0,prestige:0,stability:65,legitimacy:60,food:0,policies:{tax:1,levy:1,tolerance:1},relations:{},treaties:{},tech:1};
 const provinces=Object.fromEntries(world.provinces.map(p=>[p.id,{id:p.id,owner:p.owner,population:p.population,development:p.development,unrest:p.unrest,buildings:{farm:0,market:0,barracks:0,fort:Number(p.fort)},recruits:0}]));
 const armies={};let nextId=1;
 for(const faction of world.factions){
  let owned=world.provinces.filter(p=>p.owner===faction.id);if(!owned.length)continue;
  owned.sort((a,b)=>Math.hypot(a.centroid[0]-faction.capital[0],a.centroid[1]-faction.capital[1])-Math.hypot(b.centroid[0]-faction.capital[0],b.centroid[1]-faction.capital[1]));
  const seat=world.meta?.mapVersion?.startsWith('atlas-1450-')?capitalDistrict(world,faction.id):null,prov=owned.find(p=>p.id===seat?.id)||owned[0];const qty=155+(faction.id.length*13)%60;
  const troopMix=startingTroops(faction,qty);
  armies['a'+nextId]={id:'a'+nextId++,owner:faction.id,province:prov.id,...troopMix,experience:0.08,morale:78,commander:`Commander of ${faction.name}`,doctrine:militaryDoctrine(faction).id};
 }
 const game={version:1,mapVersion:world.meta?.mapVersion||'legacy',seed:1450,year:1450,month:0,player,paused:true,speed:1,factions,provinces,armies,nextId,log:[{date:'January 1450',text:'The world stands at a crossroads. Your reign begins.'}],wars:{},history:[],turn:0};
 initializeKingdomSystems(game,world);
 return game;
}
export function makeLog(g,text){g.log.unshift({date:`${MONTHS[g.month]} ${g.year}`,text});g.log=g.log.slice(0,30);}
export const ownerName=(g,id)=>g.factions[id]?.name||id;
export function controlled(g,id){return Object.values(g.provinces).filter(p=>p.owner===id);}
export function armiesAt(g,province,owner){return Object.values(g.armies).filter(a=>a.province===province&&!embarked(g,a.id)&&(owner===undefined||a.owner===owner&&!a.contingent));}
export function armySize(a){return a?Math.max(0,Math.round(a.infantry+a.archers+a.cavalry)):0;}
export function empireStats(g,owner){
 const p=controlled(g,owner); const f=g.factions[owner];
 const tax=[.65,1,1.5][f?.policies.tax??1];
 const trade=tradeIncome(g,owner);
 const stewardship=g.kingdom?.courts?.[owner]?.steward||0;
 const taxIncome=Math.round(economyModifiers(g,owner).tax*heritageModifiers(g,owner).tax*civicModifiers(g,owner).tax*politicalRevenue(g,owner)*p.reduce((sum,pr)=>sum+(pr.population*(1+pr.development*.14)+pr.buildings.market*28)*.35*tax*(1-pr.unrest/170)*occupationTax(g,pr.id)*(portBlocked(g,pr.id)?.75:1),0)*(1+stewardship*.025+(Math.max(1,f?.tech||1)-1)*.018));
 const income=taxIncome+trade;
 const upkeep=Math.round(Object.values(g.armies).filter(a=>a.owner===owner).reduce((s,a)=>s+armySize(a)*.08,0))+navalUpkeep(g,owner);
 const food=Math.round(p.reduce((s,pr)=>s+pr.population*.085+pr.buildings.farm*8,0)-Object.values(g.armies).filter(a=>a.owner===owner).reduce((s,a)=>s+armySize(a)*.025,0));
 return {provinces:p.length,income,trade,taxIncome,upkeep,balance:income-upkeep,foodDelta:food,troops:Object.values(g.armies).filter(a=>a.owner===owner).reduce((s,a)=>s+armySize(a),0),population:p.reduce((s,a)=>s+a.population,0)};
}
export function setPolicy(g,key,value){
 const f=g.factions[g.player];if(!f||!Object.hasOwn(POLICY,key)||!Number.isInteger(value)||value<0||value>2)return {ok:false,msg:'Invalid policy'};
 if(f.policies[key]===value)return {ok:false,msg:'Policy already enacted'};
 if(f.treasury<80)return {ok:false,msg:'Need 80 gold to issue this decree'};
 f.treasury-=80;f.policies[key]=value;
 f.stability=clamp(f.stability+(key==='tax'? (value===2?-8:3):key==='levy'?(value===2?-6:2):value===2?4:-2),0,100);
 makeLog(g,`${f.name} enacted ${POLICY[key][value].toLowerCase()} ${key} reforms.`);
 return {ok:true,msg:'Royal decree enacted'};
}
export function build(g,provinceId,kind){
 const p=g.provinces[provinceId],f=g.factions[g.player],b=BUILDINGS[kind];
 if(!p||p.owner!==g.player||controller(g,p.id)!==g.player)return {ok:false,msg:'Select your own province'};
 if(!b)return {ok:false,msg:'Unknown building'};
 const level=p.buildings[kind]||0;
 if(level>=3)return {ok:false,msg:'Maximum building level reached'};
 const price=Math.round(b.cost*(level+1)*civicModifiers(g,g.player).build*economyModifiers(g,g.player).cost);
 if(f.treasury<price)return {ok:false,msg:`Need ${price} gold`};
 f.treasury-=price;p.buildings[kind]++;p.development=clamp(p.development+1,1,20);
 if(kind==='farm')p.unrest=clamp(p.unrest-3,0,100);
 if(kind==='fort')p.unrest=clamp(p.unrest-2,0,100);
 makeLog(g,`${b.name} level ${p.buildings[kind]} completed in province ${provinceId}.`);
 return {ok:true,msg:`Built ${b.name}`};
}
export function recruitmentQuote(g,provinceId,type='infantry'){
 const p=g.provinces[provinceId],f=g.factions[g.player],prices={infantry:110,archers:150,cavalry:240};if(!p||!f||!Object.hasOwn(prices,type))return null;
 const doctrine=militaryDoctrine(f),primary=['infantry','archers','cavalry'].reduce((best,t,i,a)=>doctrine.mix[i]>doctrine.mix[a.indexOf(best)]?t:best,'infantry');
 return {cost:Math.round(prices[type]*(type===primary?.82:1)*(1-(p.buildings.barracks*.06))*economyModifiers(g,g.player).cost),count:Math.max(1,Math.round((type==='cavalry'?25:50)*politicalLevy(g,g.player)*civicModifiers(g,g.player).levy*heritageModifiers(g,g.player).levy)),doctrine};
}
export function recruit(g,provinceId,type='infantry'){
 const p=g.provinces[provinceId],f=g.factions[g.player];
 if(!p||p.owner!==g.player||controller(g,p.id)!==g.player)return {ok:false,msg:'Select your own province'};
 const quote=recruitmentQuote(g,provinceId,type);if(!quote)return {ok:false,msg:'Unknown troop type'};const {cost,doctrine,count:recruited}=quote;
 if(f.treasury<cost)return {ok:false,msg:`Need ${cost} gold`};
 f.treasury-=cost;p.unrest=clamp(p.unrest+(f.policies.levy===2?7:2),0,100);
 let a=armiesAt(g,provinceId,g.player)[0];
 if(!a){a={id:'a'+g.nextId++,owner:g.player,province:provinceId,infantry:0,archers:0,cavalry:0,experience:0,morale:75,commander:'Newly appointed general'};g.armies[a.id]=a;}
 a[type]+=recruited;initMilitary(g);syncRegiments(g,a);
 a.doctrine=doctrine.id;
 makeLog(g,`${recruited} ${type} recruited in ${provinceId}.`);
 return {ok:true,msg:doctrine.unique+' tradition: regiment recruited'};
}
export function isAdjacent(world,src,dst){return !!world.provinces.find(p=>p.id===src)?.neighbors?.includes(dst);}
export function startMarch(g,world,fromId,toId){
 const src=g.provinces[fromId],target=g.provinces[toId];
 if(!src||!target)return {ok:false,msg:'Select two valid provinces.'};
 if(fromId===toId)return {ok:false,msg:'Choose another province'};
 if(!isAdjacent(world,fromId,toId))return {ok:false,msg:'Armies can currently move only to connected provinces'};
 const forces=armiesAt(g,fromId,g.player).filter(a=>armySize(a)>0).sort((a,b)=>armySize(b)-armySize(a)||a.id.localeCompare(b.id)),army=forces[0],total=forces.reduce((n,a)=>n+armySize(a),0);
 if(!army||total<20)return {ok:false,msg:'No field army here. Recruit soldiers first.'};
 const home=controller(g,fromId)===g.player,fromAccess=mayEnterWithAccess(g,g.player,fromId);
 if(!home&&!fromAccess)return {ok:false,msg:'Movement requires controlled territory or active military passage.'};
 const opponent=controller(g,toId),access=mayEnterWithAccess(g,g.player,toId);
 if(opponent===g.player||access){
  const marching=opponent===g.player&&home?[...forces,...fieldContingentsAt(g,g.player,fromId)]:forces;
  for(const a of marching){
   onArmyMarch(g,a);
   if(access)a.passage??={home:fromId};
   else delete a.passage;
   a.province=toId;
  }
  const marched=marching.reduce((n,a)=>n+armySize(a),0);
  makeLog(g,`${marched} troops marched to ${toId}.`);
  return {ok:true,type:'move',msg:marched+' troops moved'};
 }
 if(fromAccess)return {ok:false,msg:'Military passage permits transit. Launch attacks from your own controlled territory.'};
 if(occupation(g,toId)&&opponent!==target.owner&&target.owner!==g.player)return {ok:false,msg:'Cannot attack a third-party occupation without formal war.'};
 if(nonAggression(g,g.player,opponent)||hasTruce(g,g.player,opponent))return {ok:false,msg:'A peace treaty bars this attack.'};
 if(['alliance','marriage'].includes(g.factions[g.player].treaties[opponent]))return {ok:false,msg:'Cannot attack an allied realm'};
 const allies=fieldContingentsAt(g,g.player,fromId,opponent),alliedTroops=allies.reduce((n,a)=>n+armySize(a),0);
 const defenders=[...armiesAt(g,toId,opponent),...fieldContingentsAt(g,opponent,toId,g.player)];
 const defenseTroops=defenders.reduce((s,a)=>s+armySize(a),0);
 const garrison=campaignGarrison(target)+defenseSupport(g,opponent,g.player);
 return {ok:true,type:'battle',attacker:army.id,playerArmies:[...forces,...allies].map(a=>a.id),attackTroops:total+alliedTroops,alliedTroops,defendingArmy:defenders[0]?.id||null,enemyArmy:defenders[0]?.id||null,enemyArmies:defenders.map(a=>a.id),defenseTroops,defenseGarrison:garrison,from:fromId,to:toId,enemy:opponent};
}
export function concludeBattle(g,battle,result,world=null){
 const src=g.armies[battle.attacker];if(!src)return;
 const dst=g.provinces[battle.to];const was=controller(g,battle.to),war=activeWar(g,g.player,was);

 const ratio=clamp(result.attackerRemaining??0,0,1),forces=result.fieldBattle?participatingArmies(g,battle.playerArmies||[src.id],g.player,battle.from||src.province,was):[src];
 const oldsize=forces.reduce((n,a)=>n+armySize(a),0);applyFortDamage(g,battle.to,result);
 applyFieldForceLosses(forces,result,'attacker',ratio);
 for(const a of forces){onArmyMarch(g,a);syncRegiments(g,a);}
 const field=result.fieldBattle&&Array.isArray(battle.enemyArmies),defenders=field?participatingArmies(g,battle.enemyArmies,was,battle.to,g.player):[];
 applyFieldForceLosses(defenders,result,'defender',clamp(result.enemyRemaining??.5,0,1));
 for(const a of defenders)syncRegiments(g,a);
 if(result.victory){captureProvince(g,war,g.player,battle.to,src.province);dst.unrest=clamp(dst.unrest+25,0,100);for(const a of forces){a.province=battle.to;a.experience=clamp(a.experience+.06,0,1);}
  if(field){const retreat=world?.provinces.find(p=>p.id===battle.to)?.neighbors.find(id=>controller(g,id)===was&&g.provinces[id]?.owner===was);for(const a of defenders){if(retreat&&armySize(a)>0){a.province=retreat;a.morale=clamp((a.morale||75)-20,10,100);}else{captureCommander(g,g.player,a);delete g.armies[a.id];}}}else{const defending=armiesAt(g,battle.to,was).find(a=>a.id!==src.id);if(defending){captureCommander(g,g.player,defending);delete g.armies[defending.id];}}
  g.factions[g.player].prestige+=8;g.factions[g.player].legitimacy=clamp(g.factions[g.player].legitimacy+2,0,100);
  recordCampaignBattle(g,g.player,was,battle.to,true);
  makeLog(g,`Victory! ${dst.owner===g.player?'Your forces seized':'Your forces occupied'} ${battle.to} from ${ownerName(g,was)}. ${oldsize-forces.reduce((n,a)=>n+armySize(a),0)} casualties.`);
 } else {recordCampaignBattle(g,g.player,was,battle.to,false);for(const a of forces)a.morale=clamp(a.morale-20,10,100);g.factions[g.player].prestige=Math.max(0,g.factions[g.player].prestige-5);makeLog(g,`Defeat at ${battle.to}. Your army fell back with ${forces.reduce((n,a)=>n+armySize(a),0)} survivors.`);}
}
export function negotiate(g,other,action,world={factions:[]}){
 if(other===g.player||other==='independent'||!g.factions[other])return {ok:false,msg:'Invalid diplomatic target'};
 if(action==='trade'||action==='marriage')return royalDiplomacy(g,world,other,action);
 const f=g.factions[g.player],o=g.factions[other];const relation=f.relations[other]||0;
 if(action==='gift'){
  if(f.treasury<250)return {ok:false,msg:'Need 250 gold'};f.treasury-=250;o.treasury+=250;f.relations[other]=clamp(relation+20+(civicModifiers(g,g.player).diplomacy||0),-100,100);o.relations[g.player]=clamp((o.relations[g.player]||0)+20,-100,100);
  makeLog(g,`Envoys delivered a 250-gold gift to ${o.name}.`);return {ok:true,msg:'Relations improved'};
 }
 if(action==='alliance'){if(activeWar(g,g.player,other))return {ok:false,msg:'Negotiate peace before seeking an alliance.'};
  if(relation<35)return {ok:false,msg:'Relations must reach +35 for an alliance'};
  f.treaties[other]='alliance';o.treaties[g.player]='alliance';makeLog(g,`Alliance sealed with ${o.name}.`);return {ok:true,msg:'Alliance signed'};
 }
 if(action==='insult'){f.relations[other]=clamp(relation-30,-100,100);o.relations[g.player]=clamp((o.relations[g.player]||0)-30,-100,100);makeLog(g,`Court relations worsened with ${o.name}.`);return {ok:true,msg:'Insult delivered'};}
 return {ok:false,msg:'Unknown diplomatic action'};
}
// Reproducible pseudo-random outcomes. No Math.random in the simulation core.
function rand(g){g.seed=(1664525*g.seed+1013904223)>>>0;return g.seed/4294967296;}
export function advanceMonth(g,world){
 world=campaignWorld(g,world);
 g.turn++;g.month++;if(g.month===12){g.month=0;g.year++;}
 for(const f of Object.values(g.factions)){
  if(f.id==='independent')continue;
  const s=empireStats(g,f.id);
  f.treasury=Math.round(f.treasury+s.balance);
  f.food=clamp(Math.round(f.food+s.foodDelta),-1000,50000);
  let avgUnrest=0;
  for(const p of controlled(g,f.id)){
   p.population=clamp(p.population+(p.buildings.farm>0&&g.turn%4===0?1:0),4,800);
   const adjust= (f.policies.tax===2?2:f.policies.tax===0?-2:0)+(f.policies.levy===2?1:0)-(f.policies.tolerance===2?2:f.policies.tolerance===0?-1:0)-(p.buildings.farm>0?1:0);
   p.unrest=clamp(p.unrest+adjust+civicProvinceUnrest(g,f.id,p.id)+(f.food<0?4:0),0,100);avgUnrest+=p.unrest;
   if(!occupation(g,p.id)&&p.unrest>=93 && rand(g)<.13){transferProvince(g,p.id,'independent');makeLog(g,`Revolt! Province ${p.id} broke from ${f.name}.`);}
  }
  const provinces=Math.max(1,s.provinces);f.stability=clamp(f.stability+Math.sign(52-avgUnrest/provinces)*.6-(f.treasury<0?3:0)-(f.food<0?2:0),0,100);
  if(f.treasury<0&&rand(g)<.14){f.legitimacy=clamp(f.legitimacy-3,0,100);}
  // Court investment is handled once in advanceKingdomSystems.
 }
 // Rival rulers periodically recruit and contest border provinces. Player wars remain manual.
 if(g.turn%8===0){
  const challengers=Object.values(g.armies).filter(a=>a.owner!==g.player && a.owner!=='independent'&&!a.contingent&&!embarked(g,a.id)&&!g.kingdom.threats.some(t=>t.army===a.id)&&armySize(a)>45);
  const shuffled=challengers.slice().sort((a,b)=>(a.id.length*17+g.turn)%31-(b.id.length*17+g.turn)%31);
  let campaigns=0;const acted=new Set();
  for(const a of shuffled){
   if(campaigns>=3)break;if(acted.has(a.id))continue;
   const origin=world.provinces.find(p=>p.id===a.province);if(!origin||controller(g,origin.id)!==a.owner)continue;
   const potential=origin.neighbors.map(id=>g.provinces[id]).filter(p=>p&&controller(g,p.id)!==a.owner&&controller(g,p.id)!==g.player&&(!occupation(g,p.id)||p.owner===a.owner)&&!nonAggression(g,a.owner,controller(g,p.id))&&!hasTruce(g,a.owner,controller(g,p.id))&&!['alliance','marriage'].includes(g.factions[a.owner].treaties[controller(g,p.id)]));
   if(!potential.length)continue;
   const native=localCampaignForces(g,a).filter(x=>!acted.has(x.id));if(!native.length)continue;
   const combined=native.reduce((n,v)=>n+campaignArmyPower(v,armyReadiness(g,v)),0);
   const target=potential.slice().sort((x,y)=>strategicTargetScore(g,world,a,y,combined)-strategicTargetScore(g,world,a,x,combined)||x.id.localeCompare(y.id))[0];
   const previous=controller(g,target.id);
   if(rand(g)>1-raidThreshold(g,a.owner,previous)||strategicTargetScore(g,world,a,target,combined)<-15)continue;
   const forces=[...native,...fieldContingentsAt(g,a.owner,a.province,previous).filter(v=>!acted.has(v.id))];
   for(const v of forces)acted.add(v.id);
   const defending=[...armiesAt(g,target.id,previous),...fieldContingentsAt(g,previous,target.id,a.owner)];
   const defense=campaignGarrison(target)+defenseSupport(g,previous,a.owner)+defending.reduce((sum,v)=>sum+campaignArmyPower(v,armyReadiness(g,v)),0);
   const attack=forces.reduce((n,v)=>n+campaignArmyPower(v,armyReadiness(g,v)),0)+aidStrength(g,a.owner,previous);
   const outcome=borderBattleOutcome(attack,defense,rand(g));
   for(const v of forces){proportionalLoss(v,outcome.attackerLoss);syncRegiments(g,v);}recordStrategicBattle(g,a.owner,previous,outcome.victory,outcome.attackerLoss);recordStrategicBattle(g,previous,a.owner,!outcome.victory,outcome.defenderLoss);for(const d of defending){proportionalLoss(d,outcome.defenderLoss);syncRegiments(g,d);d.morale=clamp(d.morale-(outcome.victory?18:4),10,100);}
   if(outcome.victory){
    const previous=controller(g,target.id),war=activeWar(g,a.owner,previous);captureProvince(g,war,a.owner,target.id,a.province);target.unrest=clamp(target.unrest+25,0,100);
    const retreat=world.provinces.find(p=>p.id===target.id)?.neighbors.find(id=>controller(g,id)===previous&&g.provinces[id]?.owner===previous);for(const defender of defending){if(retreat&&armySize(defender)>0){defender.province=retreat;}else{captureCommander(g,a.owner,defender);delete g.armies[defender.id];}}
    for(const v of forces){onArmyMarch(g,v);v.province=target.id;}recordCampaignBattle(g,a.owner,previous,target.id,true);g.factions[a.owner].prestige+=3;
    makeLog(g,`${ownerName(g,a.owner)} seized ${target.id} from ${ownerName(g,previous)} after a border conflict.`);campaigns++;
   }else{for(const v of forces){v.morale=clamp(v.morale-14,10,100);onArmyMarch(g,v);}recordCampaignBattle(g,a.owner,previous,target.id,false);campaigns++;}
  }
 }
 // Recruitment is handled once in advanceKingdomSystems.
 if(g.turn%12===0)makeLog(g,`A new year begins: ${g.year}. Courts across the world revise their ambitions.`);
 if(g.turn%8===0){
  const me=g.factions[g.player];if(me){me.prestige+=1;makeLog(g,`The royal council convenes to review the realm's affairs.`);}
 }
 advanceKingdomSystems(g,world);
 return g;
}
export function snapshot(g){return JSON.stringify(g);}
export function restoreGame(text,world){
 const o=JSON.parse(text);if(o.version!==1||!o.factions?.[o.player]||o.player==='independent'||!o.provinces||!o.armies)throw Error('Invalid or incompatible save file');
 if((o.mapVersion||'legacy')!==(world.meta?.mapVersion||'legacy')||Object.keys(o.provinces).length!==world.provinces.length||world.provinces.some(p=>!o.provinces[p.id]))throw Error('Map version mismatch');
 initializeKingdomSystems(o,world);
 reconcilePoliticalHoldings(o);
 return o;
}
