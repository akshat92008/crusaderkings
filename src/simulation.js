import {homeRealm,queueHome,tickHometown,hometownModifiers,homeFoodOutput,homeRecruitmentRequirement} from './hometown.js';
import {invasionReserved} from './invasion-reservations.js';
import {allocateCommanderName} from './name-pools.js';
import {humanControlsRealm,reconcileCareer} from './player-career.js';
import {defaultPersonality,PERSONALITY_AXES} from './character-agency.js';
import {borderBattleOutcome,proportionalLoss,campaignArmyPower,campaignGarrison,terrainCombatModifiers} from './border-battle.js';
import {participatingArmies,applyFieldForceLosses} from './field-forces.js';
import {capitalDistrict} from './historical-world.js';
import {nonAggression,aidStrength,diplomaticSupport,mayEnterWithAccess,fieldContingentsAt,hasHostageBar,addDiplomaticThreat} from './diplomacy-systems.js';
import {campaignWorld} from './independence-systems.js';
import {captureCommander,syncTitles} from './feudal-systems.js';
import {initDlcSystems,tickDlcSystems,dlcModifiers} from './ck2-dlc-systems.js';
import {initCrossroads,tickCrossroads,crossroadsModifiers} from './crossroads-eras.js';
import {initReignChapters,tickReignChapters,reignLegacyModifiers} from './reign-chapters.js';
import {strategicTargetScore,raidThreshold,defenseSupport,localCampaignForces,recordStrategicBattle,evaluateWarViability,personalityProfile} from './strategic-ai.js';
import {controller,occupation,occupationTax,captureProvince,transferProvince,availableCasusBelli,declareCasusBelliWar} from './campaign-war.js';
import {embarked,navalUpkeep,portBlocked} from './naval-systems.js';
import {onArmyMarch,armyReadiness,syncRegiments,applyFortDamage,initMilitary,resolveBattleCommanders,retreatArmy} from './military-systems.js';
import {economyModifiers} from './economy-systems.js';
import {heritageModifiers} from './heritage-systems.js';
import {civicModifiers,civicProvinceUnrest} from './civic-systems.js';
import {hasTruce,recordCampaignBattle,activeWar} from './political-conflict.js';
/* Crown of Nations: deterministic, serializable campaign rules. No browser dependencies. */
import {politicalRevenue,politicalLevy,reconcilePoliticalHoldings} from './dynastic-politics.js';
import {initializeKingdomSystems,advanceKingdomSystems,royalDiplomacy,tradeIncome} from './kingdom-depth.js';
import {militaryDoctrine,startingTroops} from './military-doctrines.js';
import {
 initDeepSystems,tickDeepSystems,allianceTerms,nonAggressionTerms,
 getProvinceProsperity,prosperityModifiers,tradePostIncome,independentPolityTradeIncome,
 greatWorkModifiers,bloodlineModifiers,activeSiegeAt,contributeToCrusade,adjustProvinceProsperity
} from './ck2-deep-systems.js';
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
 initDeepSystems(game,world);
 initDlcSystems(game,world);
 initCrossroads(game,world);
 initReignChapters(game);
 for(const a of Object.values(game.armies))a.commander=allocateCommanderName(game,a.owner,a.id);
 return game;
}
export function makeLog(g,text){g.log.unshift({date:`${MONTHS[g.month]} ${g.year}`,text});g.log=g.log.slice(0,30);}
export const ownerName=(g,id)=>g.factions[id]?.name||id;
export function controlled(g,id){return Object.values(g.provinces).filter(p=>p.owner===id);}
export function armiesAt(g,province,owner){return Object.values(g.armies).filter(a=>a.province===province&&!embarked(g,a.id)&&(owner===undefined||a.owner===owner&&!a.contingent));}
export function armySize(a){return a?Math.max(0,Math.round(a.infantry+a.archers+a.cavalry)):0;}
export function empireStats(g,owner,cache=null){
 const p=cache?.provs||controlled(g,owner); const f=g.factions[owner];
 const ownArmies=cache?.armies||Object.values(g.armies).filter(a=>a.owner===owner);
 const tax=[.65,1,1.5][f?.policies.tax??1];
 const xr=crossroadsModifiers(g,owner),lgMod=reignLegacyModifiers(g,owner);
 const trade=Math.round((tradeIncome(g,owner))*dlcModifiers(g,owner).trade*xr.trade*lgMod.trade*(hometownModifiers(g,owner).trade||1));
 const tradePosts=tradePostIncome(g,owner)+independentPolityTradeIncome(g,owner);
 const gw=greatWorkModifiers(g,owner),bl=bloodlineModifiers(g,owner),dlcMod=dlcModifiers(g,owner);
 const stewardship=g.kingdom?.courts?.[owner]?.steward||0;
 const homeMod=hometownModifiers(g,owner);const taxIncome=Math.round(xr.tax*homeMod.tax*dlcMod.tax*economyModifiers(g,owner).tax*heritageModifiers(g,owner).tax*civicModifiers(g,owner).tax*politicalRevenue(g,owner)*gw.tax*bl.taxMod*p.reduce((sum,pr)=>sum+(pr.population*(1+pr.development*.14)+pr.buildings.market*28)*.35*tax*(1-pr.unrest/170)*occupationTax(g,pr.id)*(portBlocked(g,pr.id)?.75:1)*(1+getProvinceProsperity(g,pr.id)*.10),0)*(1+stewardship*.025+(Math.max(1,f?.tech||1)-1)*.018));
 const income=taxIncome+trade+tradePosts;
 let rawUpkeep=0,rawFoodDrain=0,troops=0;
 for(const a of ownArmies){const sz=armySize(a);rawUpkeep+=sz*.08;rawFoodDrain+=sz*.025;troops+=sz;}
 const upkeep=Math.round(rawUpkeep)+navalUpkeep(g,owner);
 const grossFood=p.reduce((s,pr)=>s+homeFoodOutput(g,pr),0);const food=Math.round(grossFood-rawFoodDrain);
 return {provinces:p.length,income,trade,tradePosts,taxIncome,upkeep,balance:income-upkeep,foodDelta:food,grossFood:Math.round(grossFood),foodUpkeep:Math.round(rawFoodDrain),troops,population:p.reduce((s,a)=>s+a.population,0)};
}
export function setPolicy(g,key,value){
 if(!humanControlsRealm(g,g.player))return {ok:false,msg:'This is a sovereign action, unavailable during a vassal career.'};
 const f=g.factions[g.player];if(!f||!Object.hasOwn(POLICY,key)||!Number.isInteger(value)||value<0||value>2)return {ok:false,msg:'Invalid policy'};
 if(f.policies[key]===value)return {ok:false,msg:'Policy already enacted'};
 if(f.treasury<80)return {ok:false,msg:'Need 80 gold to issue this decree'};
 f.treasury-=80;f.policies[key]=value;
 f.stability=clamp(f.stability+(key==='tax'? (value===2?-8:3):key==='levy'?(value===2?-6:2):value===2?4:-2),0,100);
 makeLog(g,`${f.name} enacted ${POLICY[key][value].toLowerCase()} ${key} reforms.`);
 return {ok:true,msg:'Royal decree enacted'};
}
export function build(g,provinceId,kind){
 if(!humanControlsRealm(g,g.player))return {ok:false,msg:'This is a sovereign action, unavailable during a vassal career.'};
 const p=g.provinces[provinceId],f=g.factions[g.player],b=BUILDINGS[kind];
 if(!p||p.owner!==g.player||controller(g,p.id)!==g.player)return {ok:false,msg:'Select your own province'};
 if(!b)return {ok:false,msg:'Unknown building'};
 if(homeRealm(g))return queueHome(g,null,'building',kind,provinceId);
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
 const prosMod=prosperityModifiers(g,g.player).levy*greatWorkModifiers(g,g.player).levy,reason=homeRecruitmentRequirement(g,provinceId,type);
 return {available:!reason,reason,cost:Math.round(prices[type]*(type===primary?.82:1)*Math.max(.4,1-(p.buildings.barracks*.06))*economyModifiers(g,g.player).cost*hometownModifiers(g,g.player).cost),count:Math.max(1,Math.round((type==='cavalry'?25:50)*politicalLevy(g,g.player)*civicModifiers(g,g.player).levy*heritageModifiers(g,g.player).levy*prosMod*hometownModifiers(g,g.player).recruit)),doctrine};
}
export function recruit(g,provinceId,type='infantry'){
 if(!humanControlsRealm(g,g.player))return {ok:false,msg:'This is a sovereign action, unavailable during a vassal career.'};
 const p=g.provinces[provinceId],f=g.factions[g.player];
 if(!p||p.owner!==g.player||controller(g,p.id)!==g.player)return {ok:false,msg:'Select your own province'};
 const quote=recruitmentQuote(g,provinceId,type);if(!quote)return {ok:false,msg:'Unknown troop type'};const {cost,doctrine,count:recruited}=quote;
 if(!quote.available)return {ok:false,msg:quote.reason};
 if(f.treasury<cost)return {ok:false,msg:`Need ${cost} gold`};
 f.treasury-=cost;p.unrest=clamp(p.unrest+(f.policies.levy===2?7:2),0,100);
 if((p.population||0)>5)p.population=Math.max(5,Number((p.population-recruited/2000).toFixed(2)));
 let a=armiesAt(g,provinceId,g.player)[0];
 if(!a){a={id:'a'+g.nextId++,owner:g.player,province:provinceId,infantry:0,archers:0,cavalry:0,experience:0,morale:75,commander:allocateCommanderName(g,g.player,g.nextId)};g.armies[a.id]=a;}
 a[type]+=recruited;initMilitary(g);syncRegiments(g,a);
 a.doctrine=doctrine.id;
 makeLog(g,`${recruited} ${type} recruited in ${provinceId}.`);
 return {ok:true,msg:doctrine.unique+' tradition: regiment recruited'};
}
export function isAdjacent(world,src,dst){return !!world.provinces.find(p=>p.id===src)?.neighbors?.includes(dst);}
export function startMarch(g,world,fromId,toId){
 if(!humanControlsRealm(g,g.player))return {ok:false,msg:'This is a sovereign action, unavailable during a vassal career.'};
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
 if(nonAggression(g,g.player,opponent)||hasTruce(g,g.player,opponent)||hasHostageBar(g,g.player,opponent))return {ok:false,msg:'A peace treaty or diplomatic hostage bars this attack.'};
 if(['alliance','marriage'].includes(g.factions[g.player].treaties[opponent]))return {ok:false,msg:'Cannot attack an allied realm'};
 const allies=fieldContingentsAt(g,g.player,fromId,opponent),alliedTroops=allies.reduce((n,a)=>n+armySize(a),0);
 const defenders=[...armiesAt(g,toId,opponent),...fieldContingentsAt(g,opponent,toId,g.player)];
 const defenseTroops=defenders.reduce((s,a)=>s+armySize(a),0);
 const garrison=Math.round(campaignGarrison(target)*hometownModifiers(g,opponent).defense)+defenseSupport(g,opponent,g.player);
 return {ok:true,type:'battle',campaignTurn:g.turn,attacker:army.id,playerArmies:[...forces,...allies].map(a=>a.id),attackTroops:total+alliedTroops,alliedTroops,defendingArmy:defenders[0]?.id||null,enemyArmy:defenders[0]?.id||null,enemyArmies:defenders.map(a=>a.id),defenseTroops,defenseGarrison:garrison,from:fromId,to:toId,enemy:opponent};
}
// A live field result is tied to the deployment that created it. Legacy
// non-field callers retain their existing behavior for old campaign fixtures.
export function validateFieldResult(g,battle,result,world=null){
 const no=msg=>({ok:false,msg});
 if(!battle||battle.resolved||battle.campaignTurn!==g.turn)return no('This battle report is expired or already applied.');
 if(typeof result?.victory!=='boolean'||![result.attackerRemaining,result.enemyRemaining].every(n=>Number.isFinite(n)&&n>=0&&n<=1))return no('Invalid field battle result.');
 const army=g.armies[battle.attacker];
 if(!army||army.owner!==g.player||army.contingent||embarked(g,army.id)||armySize(army)<1||army.province!==battle.from)return no('The attacking army is no longer deployed.');
 if(!g.provinces[battle.to]||controller(g,battle.from)!==g.player||controller(g,battle.to)!==battle.enemy||battle.enemy===g.player||mayEnterWithAccess(g,g.player,battle.to))return no('The battlefield is no longer contested.');
 if(nonAggression(g,g.player,battle.enemy)||hasTruce(g,g.player,battle.enemy)||hasHostageBar(g,g.player,battle.enemy)||['alliance','marriage'].includes(g.factions[g.player].treaties[battle.enemy]))return no('A peace agreement now bars this battle.');
 if(world){
  if(!isAdjacent(world,battle.from,battle.to))return no('The battlefield is no longer adjacent.');
  // startMarch cannot move forces here: the hostile controller and absence of
  // military passage were checked above. Recompute the authoritative roster.
  const live=startMarch(g,world,battle.from,battle.to);
  const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every(id=>b.includes(id));
  if(!live.ok||live.type!=='battle'||live.attacker!==battle.attacker||!same(live.playerArmies,battle.playerArmies)||!same(live.enemyArmies,battle.enemyArmies)||live.attackTroops!==battle.attackTroops||live.defenseTroops!==battle.defenseTroops||live.defenseGarrison!==battle.defenseGarrison)return no('The deployed forces changed; issue a fresh march order.');
 }
 return {ok:true};
}
export function concludeBattle(g,battle,result,world=null){
 if(battle?.resolved)return {ok:false,msg:'This battle result has already been applied.'};
 if(!result||typeof result.victory!=='boolean')return {ok:false,msg:'Invalid battle result.'};
 if(result?.fieldBattle&&battle?.type==='battle'){const valid=validateFieldResult(g,battle,result,world);if(!valid.ok)return valid;}
 const src=g.armies[battle?.attacker];if(!src||!g.provinces[battle?.to])return {ok:false,msg:'The battle no longer exists.'};
 battle.resolved=true;
 const dst=g.provinces[battle.to];const was=controller(g,battle.to),war=activeWar(g,g.player,was);

 const ratio=clamp(result.attackerRemaining??0,0,1),forces=result.fieldBattle?participatingArmies(g,battle.playerArmies||[src.id],g.player,battle.from||src.province,was):[src];
 const oldsize=forces.reduce((n,a)=>n+armySize(a),0);applyFortDamage(g,battle.to,result);
 applyFieldForceLosses(forces,result,'attacker',ratio);
 for(const a of forces){onArmyMarch(g,a);syncRegiments(g,a);}
 const field=result.fieldBattle&&Array.isArray(battle.enemyArmies),defenders=field?participatingArmies(g,battle.enemyArmies,was,battle.to,g.player):[];
 applyFieldForceLosses(defenders,result,'defender',clamp(result.enemyRemaining??.5,0,1));
 for(const a of defenders)syncRegiments(g,a);
 if(result.victory){captureProvince(g,war,g.player,battle.to,src.province);dst.unrest=clamp(dst.unrest+25,0,100);for(const a of forces){a.province=battle.to;a.experience=clamp(a.experience+.06,0,1);}
  const activeSiege=activeSiegeAt(g,battle.to);
  if(activeSiege){activeSiege.status='captured';activeSiege.progress=100;}
  adjustProvinceProsperity(g,battle.to,-25);
  if(g.deepSystems?.crusade?.status==='active'&&was===g.deepSystems.crusade.targetFaction)contributeToCrusade(g,g.player,20);
  const enemyRem=clamp(result.enemyRemaining??.5,0,1);
  if(field){
   resolveBattleCommanders(g,g.player,defenders,{loserRemaining:enemyRem,fieldBattle:true,winnerArmies:forces});
   for(const a of defenders){if(armySize(a)>0&&retreatArmy(g,world,a,battle.to))continue;captureCommander(g,g.player,a);delete g.armies[a.id];}
  }else{
   const defending=armiesAt(g,battle.to,was).find(a=>a.id!==src.id);
   if(defending){resolveBattleCommanders(g,g.player,[defending],{loserRemaining:enemyRem,fieldBattle:false});if(!retreatArmy(g,world,defending,battle.to)){captureCommander(g,g.player,defending);delete g.armies[defending.id];}}
  }
  g.factions[g.player].prestige+=8;g.factions[g.player].legitimacy=clamp(g.factions[g.player].legitimacy+2,0,100);
  recordCampaignBattle(g,g.player,was,battle.to,true);
  makeLog(g,`Victory! ${dst.owner===g.player?'Your forces seized':'Your forces occupied'} ${battle.to} from ${ownerName(g,was)}. ${oldsize-forces.reduce((n,a)=>n+armySize(a),0)} casualties.`);
 } else {resolveBattleCommanders(g,was,forces,{loserRemaining:ratio,fieldBattle:!!result.fieldBattle});recordCampaignBattle(g,g.player,was,battle.to,false);for(const a of forces)a.morale=clamp(a.morale-20,10,100);g.factions[g.player].prestige=Math.max(0,g.factions[g.player].prestige-5);makeLog(g,`Defeat at ${battle.to}. Your army fell back with ${forces.reduce((n,a)=>n+armySize(a),0)} survivors.`);}
 return {ok:true,msg:'Battle result applied.'};
}
export function negotiate(g,other,action,world={factions:[]}){
 if(!humanControlsRealm(g,g.player))return {ok:false,msg:'This is a sovereign action, unavailable during a vassal career.'};
 if(other===g.player||other==='independent'||!g.factions[other])return {ok:false,msg:'Invalid diplomatic target'};
 if(action==='trade'||action==='marriage')return royalDiplomacy(g,world,other,action);
 const f=g.factions[g.player],o=g.factions[other];const relation=f.relations[other]||0;
 if(action==='gift'){
  if(f.treasury<250)return {ok:false,msg:'Need 250 gold'};f.treasury-=250;o.treasury+=250;f.relations[other]=clamp(relation+20+(civicModifiers(g,g.player).diplomacy||0),-100,100);o.relations[g.player]=clamp((o.relations[g.player]||0)+20,-100,100);
  makeLog(g,`Envoys delivered a 250-gold gift to ${o.name}.`);return {ok:true,msg:'Relations improved'};
 }
 if(action==='alliance'){if(activeWar(g,g.player,other))return {ok:false,msg:'Negotiate peace before seeking an alliance.'};
  if(f.treaties?.[other]==='alliance')return {ok:false,msg:`An alliance already exists with ${o.name}.`};
  const terms=allianceTerms(g,g.player,other,world);
  if(!terms.accepted)return {ok:false,msg:terms.reason,terms};
  f.treaties[other]='alliance';o.treaties[g.player]='alliance';makeLog(g,`Alliance sealed with ${o.name}.`);return {ok:true,msg:'Alliance signed',terms};
 }
 if(action==='non_aggression'||action==='pact'){if(activeWar(g,g.player,other))return {ok:false,msg:'Negotiate peace before seeking a non-aggression pact.'};
  if((g.diplomacy?.pacts?.[[g.player,other].sort().join('|')]?.until||0)>g.turn)return {ok:false,msg:'A non-aggression pact is already active.'};
  const terms=nonAggressionTerms(g,g.player,other,world);
  if(!terms.accepted)return {ok:false,msg:terms.reason,terms};
  if(f.treasury<80)return {ok:false,msg:'Need 80 gold to seal a non-aggression pact.',terms};
  f.treasury-=80;g.diplomacy??={version:1,pacts:{},guarantees:{},aid:{},passage:{},tributes:{},hostages:{},coalitions:{},threat:{},history:[],lastTick:-1};
  g.diplomacy.pacts[[g.player,other].sort().join('|')]={members:[g.player,other],until:g.turn+48};
  makeLog(g,`Non-aggression pact sealed with ${o.name}.`);return {ok:true,msg:'Non-aggression pact signed',terms};
 }
 if(action==='insult'){f.relations[other]=clamp(relation-30,-100,100);o.relations[g.player]=clamp((o.relations[g.player]||0)-30,-100,100);makeLog(g,`Court relations worsened with ${o.name}.`);return {ok:true,msg:'Insult delivered'};}
 return {ok:false,msg:'Unknown diplomatic action'};
}
// Reproducible pseudo-random outcomes. No Math.random in the simulation core.
function rand(g){g.seed=(1664525*g.seed+1013904223)>>>0;return g.seed/4294967296;}
export function advanceMonth(g,world){
 world=campaignWorld(g,world);
 g.turn++;g.month++;if(g.month===12){g.month=0;g.year++;}
 const provsByOwner=new Map(),armiesByOwner=new Map();
 for(const pr of Object.values(g.provinces)){let arr=provsByOwner.get(pr.owner);if(!arr){arr=[];provsByOwner.set(pr.owner,arr);}arr.push(pr);}
 for(const a of Object.values(g.armies)){let arr=armiesByOwner.get(a.owner);if(!arr){arr=[];armiesByOwner.set(a.owner,arr);}arr.push(a);}
 for(const f of Object.values(g.factions)){
  if(f.id==='independent')continue;
  const land=provsByOwner.get(f.id)||[];
  const s=empireStats(g,f.id,{provs:land,armies:armiesByOwner.get(f.id)||[]});
  f.treasury=Math.round(f.treasury+s.balance);
  f.food=clamp(Math.round(f.food+s.foodDelta),-1000,50000);
  let avgUnrest=0;const homeOrder=hometownModifiers(g,f.id).order;
  for(const p of land){
   p.population=clamp(p.population+(p.buildings.farm>0&&g.turn%4===0?1:0),4,800);
   const adjust= (f.policies.tax===2?2:f.policies.tax===0?-2:0)+(f.policies.levy===2?1:0)-(f.policies.tolerance===2?2:f.policies.tolerance===0?-1:0)-(p.buildings.farm>0?1:0);
   p.unrest=clamp(p.unrest+adjust+civicProvinceUnrest(g,f.id,p.id)-homeOrder+(f.food<0?4:0),0,100);avgUnrest+=p.unrest;
   if(!occupation(g,p.id)&&p.unrest>=93 && rand(g)<.13){transferProvince(g,p.id,'independent');makeLog(g,`Revolt! Province ${p.id} broke from ${f.name}.`);}
  }
  const provinces=Math.max(1,s.provinces);f.stability=clamp(f.stability+Math.sign(52-avgUnrest/provinces)*.6-(f.treasury<0?3:0)-(f.food<0?2:0),0,100);
  if(f.treasury<0&&rand(g)<.14){f.legitimacy=clamp(f.legitimacy-3,0,100);}
  // Court investment is handled once in advanceKingdomSystems.
 }
 // Rival rulers contest border provinces only via valid Casus Belli wars or non-annexing border raids, honoring truces.
 if(g.turn%8===0){
  const byProv=new Map(world.provinces.map(p=>[p.id,p]));
  const challengers=Object.values(g.armies).filter(a=>!humanControlsRealm(g,a.owner)&&a.owner!=='independent'&&!a.contingent&&!embarked(g,a.id)&&!invasionReserved(g,a.id)&&armySize(a)>45);
  const shuffled=challengers.slice().sort((a,b)=>(a.id.length*17+g.turn)%31-(b.id.length*17+g.turn)%31);
  let campaigns=0;const acted=new Set();
  for(const a of shuffled){
   if(campaigns>=3)break;if(acted.has(a.id))continue;
   const origin=byProv.get(a.province);if(!origin||controller(g,origin.id)!==a.owner)continue;
   const potential=origin.neighbors.map(id=>g.provinces[id]).filter(p=>p&&controller(g,p.id)!==a.owner&&!humanControlsRealm(g,controller(g,p.id))&&(!occupation(g,p.id)||p.owner===a.owner)&&!nonAggression(g,a.owner,controller(g,p.id))&&!hasTruce(g,a.owner,controller(g,p.id))&&!hasHostageBar(g,a.owner,controller(g,p.id))&&!['alliance','marriage'].includes(g.factions[a.owner].treaties[controller(g,p.id)]));
   if(!potential.length)continue;
   const native=localCampaignForces(g,a).filter(x=>!acted.has(x.id));if(!native.length)continue;
   const combined=native.reduce((n,v)=>n+campaignArmyPower(v,armyReadiness(g,v)),0);
   const target=potential.slice().sort((x,y)=>strategicTargetScore(g,world,a,y,combined)-strategicTargetScore(g,world,a,x,combined)||x.id.localeCompare(y.id))[0];
   const previous=controller(g,target.id);
   if(rand(g)>1-raidThreshold(g,a.owner,previous)||strategicTargetScore(g,world,a,target,combined)<-15)continue;
   let war=activeWar(g,a.owner,previous);
   let isRaid=false;
   if(!war){
    const cbs=availableCasusBelli(g,world,a.owner,previous);
    const viable=previous==='independent'?{viable:true}:evaluateWarViability(g,world,a.owner,previous);
    const cb=cbs.find(c=>c.goal===target.id)||cbs[0];
    if(cb&&viable.viable&&(g.factions[a.owner].prestige||0)>=cb.prestigeCost&&previous!=='independent'){
     const res=declareCasusBelliWar(g,world,a.owner,previous,cb.cb,cb.target);
     if(res.ok)war=res.war;
    }
    if(!war){
     const prof=personalityProfile(g,a.owner);
     if(!['ambitious','cruel','martial','zealous'].includes(prof.id)||rand(g)>0.35)continue;
     isRaid=true;
    }
   }
   const forces=[...native,...fieldContingentsAt(g,a.owner,a.province,previous).filter(v=>!acted.has(v.id))];
   for(const v of forces)acted.add(v.id);
   const defending=[...armiesAt(g,target.id,previous),...fieldContingentsAt(g,previous,target.id,a.owner)];
   const terrMod=terrainCombatModifiers(byProv.get(target.id)?.terrain||target.terrain||'plains');
   const defense=campaignGarrison(target)*hometownModifiers(g,previous).defense*terrMod.defense+defenseSupport(g,previous,a.owner)+defending.reduce((sum,v)=>sum+campaignArmyPower(v,armyReadiness(g,v))*terrMod.defense,0);
   const attack=forces.reduce((n,v)=>n+campaignArmyPower(v,armyReadiness(g,v)),0)+aidStrength(g,a.owner,previous);
   const outcome=borderBattleOutcome(attack,defense,rand(g));
   for(const v of forces){proportionalLoss(v,outcome.attackerLoss);syncRegiments(g,v);}
   recordStrategicBattle(g,a.owner,previous,outcome.victory,outcome.attackerLoss);
   recordStrategicBattle(g,previous,a.owner,!outcome.victory,outcome.defenderLoss);
   for(const d of defending){proportionalLoss(d,outcome.defenderLoss);syncRegiments(g,d);d.morale=clamp(d.morale-(outcome.victory?18:4),10,100);}
   if(outcome.victory){
    if(isRaid){
     // Border raid loots resources and destabilizes without unjustified territorial annexation.
     const enemyFac=g.factions[previous],attFac=g.factions[a.owner];
     const loot=Math.min(45,Math.max(0,enemyFac?.treasury||0));
     if(enemyFac&&attFac){enemyFac.treasury-=loot;attFac.treasury+=loot;enemyFac.relations[a.owner]=clamp((enemyFac.relations[a.owner]||0)-12,-100,100);}
     target.unrest=clamp(target.unrest+12,0,100);
     addDiplomaticThreat(g,a.owner,4);
     for(const v of forces)onArmyMarch(g,v);
     campaigns++;
    }else{
     captureProvince(g,war,a.owner,target.id,a.province);target.unrest=clamp(target.unrest+25,0,100);
     resolveBattleCommanders(g,a.owner,defending,{loserRemaining:1-outcome.defenderLoss,fieldBattle:true});
     for(const defender of defending){if(armySize(defender)>0&&retreatArmy(g,world,defender,target.id))continue;captureCommander(g,a.owner,defender);delete g.armies[defender.id];}
     for(const v of forces){onArmyMarch(g,v);v.province=target.id;}
     recordCampaignBattle(g,a.owner,previous,target.id,true);g.factions[a.owner].prestige+=3;
     makeLog(g,`${ownerName(g,a.owner)} occupied ${target.id} from ${ownerName(g,previous)} in a formal campaign.`);campaigns++;
    }
   }else{
    resolveBattleCommanders(g,previous,forces,{loserRemaining:1-outcome.attackerLoss,fieldBattle:true});
    for(const v of forces){v.morale=clamp(v.morale-14,10,100);onArmyMarch(g,v);}
    if(!isRaid)recordCampaignBattle(g,a.owner,previous,target.id,false);
    campaigns++;
   }
  }
 }
 // Recruitment is handled once in advanceKingdomSystems.
 if(g.turn%12===0)makeLog(g,`A new year begins: ${g.year}. Courts across the world revise their ambitions.`);
 if(g.turn%8===0){
  const me=g.factions[g.player];if(me){me.prestige+=1;makeLog(g,`The royal council convenes to review the realm's affairs.`);}
 }
 advanceKingdomSystems(g,world);
 tickDeepSystems(g,world);
 tickDlcSystems(g,world);
 tickCrossroads(g,world);
 tickReignChapters(g);
 tickHometown(g,world);
 return g;
}
const SKILL_KEYS=['diplomacy','martial','stewardship','intrigue','learning'];
const PERS_KEYS=['boldness','compassion','greed','honor','zeal','sociability','diligence'];
function compactPersonForSave(p,realmCivic,playerRealm){
 if(!p||typeof p!=='object')return p;
 const out={};
 const isPlayer=p.realm===playerRealm;
 for(const [k,v] of Object.entries(p)){
  if(v===null||v===undefined||v===false)continue;
  if(k==='_congenitalApplied'||k==='_educationApplied'||k==='dna'||k==='role')continue;
  if((k==='wealth'||k==='prestige'||k==='piety'||k==='influence')&&v===0)continue;
  if(!p.alive&&!isPlayer&&(k==='memories'||k==='personality'||k==='civic'||k==='childhoodFocus'))continue;
  if(p.age>=18&&k==='childhoodFocus')continue;
  if(Array.isArray(v)&&v.length===0)continue;
  if(k==='memories'&&Array.isArray(v)){
   const trimmed=isPlayer?v.slice(-12):[];
   if(trimmed.length)out.memories=trimmed;
   continue;
  }
  if(k==='skills'&&v&&typeof v==='object'&&!Array.isArray(v)){
   out.skills=SKILL_KEYS.map(sk=>v[sk]??0);
   continue;
  }
  if(k==='personality'&&v&&typeof v==='object'&&!Array.isArray(v)){
   if(!isPlayer){
    const def=defaultPersonality(p);
    if(PERS_KEYS.every(pk=>(v[pk]??0)===(def[pk]??0)))continue;
   }
   out.personality=PERS_KEYS.map(pk=>v[pk]??0);
   continue;
  }
  if(k==='civic'&&v&&typeof v==='object'){
   const cOut={};
   for(const [ck,cv] of Object.entries(v)){
    if(cv===null||cv===undefined||(Array.isArray(cv)&&cv.length===0)||(ck==='xp'&&cv===0)||(ck==='stress'&&cv===0)||(ck==='education'&&cv===0)||(ck==='lastFocus'&&cv===-60))continue;
    if(ck==='culture'&&realmCivic?.culture===cv)continue;
    if(ck==='faith'&&!isPlayer&&realmCivic?.faith===cv)continue;
    cOut[ck]=cv;
   }
   if(Object.keys(cOut).length||isPlayer)out.civic=cOut;
   continue;
  }
  out[k]=v;
 }
 return out;
}
const DEFAULT_INDUSTRY_KEYS=['granary','sawmill','mine','loom','smithy','saltery','infirmary','caravan','irrigation','warehouse'];
const DEFAULT_HOLDING_KEYS={castle:['curtain_wall','keep','stables'],city:['guild_hall','trade_port','counting_house'],temple:['scriptorium','hospitium','sanctuary_precinct']};
const DEFAULT_STOCK_KEYS={grain:24,timber:8,ore:8,fiber:8,salt:8,tools:8,cloth:8,provisions:8};
const TECH_SAVE_KEYS=['agriculture','commerce','military','fortification','navigation','administration','scholarship'];
function compactEconomyProvince(ep,includeOutput=true){
 if(!ep||typeof ep!=='object')return ep;
 const out={};
 for(const [k,v] of Object.entries(ep)){
  if(v===null||v===undefined||k==='homeStorage')continue;
  if(k==='output'&&(!includeOutput||!v||typeof v!=='object'||!Object.keys(v).length))continue;
  if((k==='shortage'||k==='devastation'||k==='tier')&&v===0)continue;
  if(k==='lastRelief'&&v===-12)continue;
  if(k==='stock'&&v&&typeof v==='object'){
   const snz={};
   for(const [sk,sv] of Object.entries(v))if(sv!==DEFAULT_STOCK_KEYS[sk])snz[sk]=sv;
   if(Object.keys(snz).length)out.stock=snz;
   continue;
  }
  if(k==='industries'&&v&&typeof v==='object'){
   const nz={};
   for(const [ik,iv] of Object.entries(v))if(iv)nz[ik]=iv;
   if(Object.keys(nz).length)out.industries=nz;
   continue;
  }
  if(k==='holdings'&&v&&typeof v==='object'){
   const hc={};
   for(const [ht,hd] of Object.entries(v)){
    if(!hd||typeof hd!=='object')continue;
    const bnz={};
    for(const [bk,bv] of Object.entries(hd.buildings||{}))if(bv)bnz[bk]=bv;
    if((hd.level??1)!==1||Object.keys(bnz).length){
     hc[ht]={...(hd.level!==1?{level:hd.level}:{}),...(Object.keys(bnz).length?{buildings:bnz}:{})};
    }
   }
   if(Object.keys(hc).length)out.holdings=hc;
   continue;
  }
  out[k]=v;
 }
 return out;
}
function rehydrateSaveDefaults(o){
 const realmCiv=o.civic?.realms||{};
 for(const p of Object.values(o.politics?.people||{})){
  if(!p||typeof p!=='object')continue;
  p.spouses??=[];p.concubines??=[];p.claims??=[];p.memories??=[];p.congenital??=[];
  p.friends??=[];p.rivals??=[];p.lovers??=[];p.mentors??=[];p.wards??=[];p.grievances??=[];
  p.parents??=[];p.children??=[];
  p.wealth??=0;p.prestige??=0;p.piety??=0;p.influence??=0;
  p.bastard=Boolean(p.bastard);p.legitimized=Boolean(p.legitimized);
  if(p.guardianId===undefined)p.guardianId=null;
  if(Array.isArray(p.skills)){const sk={};SKILL_KEYS.forEach((k,i)=>{sk[k]=p.skills[i]??0;});p.skills=sk;}
  if(Array.isArray(p.personality)){const pr={};PERS_KEYS.forEach((k,i)=>{pr[k]=p.personality[i]??0;});p.personality=pr;}
  else if(!p.personality&&p.id){p.personality=defaultPersonality(p);}
  const origin=realmCiv[p.realm];
  if(origin){
   p.civic??={};
   p.civic.culture??=origin.culture||'Local';
   p.civic.faith??=origin.faith||'Local';
  }
  if(p.civic){p.civic.focus??=null;p.civic.xp??=0;p.civic.perks??=[];p.civic.stress??=0;p.civic.guardian??=null;p.civic.education??=0;if(p.civic.lastFocus===undefined)p.civic.lastFocus=-60;}
 }
 if(o.politics?.dynasties){
  for(const [houseKey,d] of Object.entries(o.politics.dynasties)){
   if(!d||typeof d!=='object')continue;
   d.house??=houseKey;d.founded??=0;d.extinct=Boolean(d.extinct);
   if(d.parentHouse===undefined)d.parentHouse=null;
   d.cadetBranches??=[];d.prestige??=0;
  }
 }
 if(o.identity?.provinceTech){
  for(const [id,t] of Object.entries(o.identity.provinceTech)){
   if(!t||typeof t!=='object')continue;
   if(Array.isArray(t.l)&&Array.isArray(t.p)){
    const levels={},progress={};
    TECH_SAVE_KEYS.forEach((tk,i)=>{levels[tk]=t.l[i]??1;progress[tk]=t.p[i]??0;});
    o.identity.provinceTech[id]={levels,progress};
   }
  }
 }
 if(o.agency?.people){
  for(const ax of Object.values(o.agency.people)){
   if(!ax||typeof ax!=='object')continue;
   ax.goals??={};ax.bonds??={};ax.memories??=[];ax.lastAction??=-120;ax.lastIncome??=-120;ax.influence??=10;
  }
 }
 if(o.feudal?.baronies){
  for(const [bKey,b] of Object.entries(o.feudal.baronies)){
   if(!b||typeof b!=='object')continue;
   if(!b.id)b.id=bKey;
   if(!b.province||!b.kind){
    const parts=bKey.split(':');
    if(parts[0]==='b'&&parts.length>=3){b.province??=parts[1];b.kind??=parts[2];}
   }
   b.wealth??=0;b.tax??=1;b.levy??=1;b.level??=1;
   if(b.province&&!b.parent)b.parent='c:'+b.province;
   if(b.province&&!b.deFactoLiege)b.deFactoLiege='c:'+b.province;
   if(b.kind&&!b.holdingType)b.holdingType=b.kind;
  }
 }
 if(o.economy?.provinces){
  for(const ep of Object.values(o.economy.provinces)){
   if(!ep||typeof ep!=='object')continue;
   ep.shortage??=0;ep.devastation??=0;ep.tier??=0;ep.lastRelief??=-12;ep.output??={};
   ep.industries??={};
   for(const ik of DEFAULT_INDUSTRY_KEYS)ep.industries[ik]??=0;
   ep.stock??={};
   for(const [sk,dv] of Object.entries(DEFAULT_STOCK_KEYS))ep.stock[sk]??=dv;
   ep.holdings??={};
   for(const [ht,bks] of Object.entries(DEFAULT_HOLDING_KEYS)){
    ep.holdings[ht]??={level:1,buildings:{}};
    ep.holdings[ht].level??=1;
    ep.holdings[ht].buildings??={};
    for(const bk of bks)ep.holdings[ht].buildings[bk]??=0;
   }
  }
 }
}
export function snapshot(g){
 if(!g||typeof g!=='object')return JSON.stringify(g);
 const shallow={...g};
 const realmCiv=g.civic?.realms||{};
 if(g.politics?.people){
  const people={};
  for(const [id,p] of Object.entries(g.politics.people))people[id]=compactPersonForSave(p,realmCiv[p?.realm],g.player);
  const dynasties={};
  for(const [hk,dv] of Object.entries(g.politics.dynasties||{})){
   if(!dv||typeof dv!=='object')continue;
   const dc={};
   if(dv.realm)dc.realm=dv.realm;
   if(dv.founded)dc.founded=dv.founded;
   if(dv.extinct)dc.extinct=true;
   if(dv.extinctTurn!==undefined)dc.extinctTurn=dv.extinctTurn;
   if(dv.parentHouse)dc.parentHouse=dv.parentHouse;
   if(Array.isArray(dv.cadetBranches)&&dv.cadetBranches.length)dc.cadetBranches=dv.cadetBranches;
   if(dv.prestige)dc.prestige=dv.prestige;
   dynasties[hk]=dc;
  }
  shallow.politics={...g.politics,people,dynasties};
 }
 if(g.identity?.provinceTech){
  const pTech={};
  for(const [id,t] of Object.entries(g.identity.provinceTech)){
   if(!t?.levels||!t?.progress){pTech[id]=t;continue;}
   pTech[id]={l:TECH_SAVE_KEYS.map(tk=>t.levels[tk]??1),p:TECH_SAVE_KEYS.map(tk=>t.progress[tk]??0)};
  }
  shallow.identity={...g.identity,provinceTech:pTech};
 }
 if(g.reignChapters?.active){
  const activeCopy={};
  for(const [rk,rv] of Object.entries(g.reignChapters.active)){
   activeCopy[rk]={...rv,objectives:(rv.objectives||[]).map(obj=>({id:obj.id,completed:obj.completed,completedTurn:obj.completedTurn,claimed:obj.claimed}))};
  }
  shallow.reignChapters={...g.reignChapters,active:activeCopy};
 }
 if(g.agency?.people){
  const aPeople={};
  for(const [id,ax] of Object.entries(g.agency.people)){
   const pers=g.politics?.people?.[id];
   if(!pers||!pers.alive)continue;
   const isPlayer=pers.realm===g.player;
   const compacted={};
   if(Number.isFinite(ax.influence)&&ax.influence!==10)compacted.influence=ax.influence;
   if(isPlayer&&ax.agenda)compacted.agenda=ax.agenda;
   if(isPlayer&&Number.isFinite(ax.lastAction)&&ax.lastAction>-120)compacted.lastAction=ax.lastAction;
   if(isPlayer&&Number.isFinite(ax.lastIncome)&&ax.lastIncome>-120)compacted.lastIncome=ax.lastIncome;
   if(ax.goal&&(isPlayer||ax.goal.progress>0))compacted.goal=ax.goal;
   if(ax.conspiracy)compacted.conspiracy=ax.conspiracy;
   if(ax.goals&&Object.keys(ax.goals).length)compacted.goals=ax.goals;
   if(ax.bonds){
    const bEntries=Object.entries(ax.bonds).filter(([,bv])=>bv&&(isPlayer?(bv.trust||bv.grievance):(Math.abs(bv.trust||0)>=10||(bv.grievance||0)>=10)));
    if(bEntries.length)compacted.bonds=Object.fromEntries(isPlayer?bEntries:bEntries.slice(0,2));
   }
   if(isPlayer&&Array.isArray(ax.memories)&&ax.memories.length)compacted.memories=ax.memories.slice(0,8);
   if(Object.keys(compacted).length)aPeople[id]=compacted;
  }
  shallow.agency={...g.agency,people:aPeople,history:(g.agency.history||[]).slice(0,60)};
 }
 if(g.chronicles?.relationships){
  const rels={};
  const ppl=g.politics?.people||{};
  for(const [rk,rv] of Object.entries(g.chronicles.relationships)){
   if(!rv||!ppl[rv.a]?.alive||!ppl[rv.b]?.alive)continue;
   const involvesPlayer=ppl[rv.a].realm===g.player||ppl[rv.b].realm===g.player;
   if(!involvesPlayer&&Math.abs(rv.opinion||0)<15&&rv.kind==='acquaintance')continue;
   if(rv.opinion===0&&rv.kind==='acquaintance')continue;
   rels[rk]=rv;
  }
  shallow.chronicles={...g.chronicles,relationships:rels,history:(g.chronicles.history||[]).slice(0,90)};
 }
 if(g.vassalCourts?.courts){
  const vCourts={};
  for(const [vid,vc] of Object.entries(g.vassalCourts.courts)){
   if(!vc||(vc.realm!==g.player&&vc.lastInvestment===-120&&vc.lastPetition===-120))continue;
   vCourts[vid]=vc;
  }
  shallow.vassalCourts={...g.vassalCourts,courts:vCourts,history:(g.vassalCourts.history||[]).slice(0,60)};
 }
 if(g.feudal){
  const feudalCopy={...g.feudal};
  delete feudalCopy.titles;
  if(g.feudal.baronies){
   const baronies={};
   for(const [id,b] of Object.entries(g.feudal.baronies)){
    if(!b||typeof b!=='object'){baronies[id]=b;continue;}
    const bc={...b};
    if(bc.wealth===0)delete bc.wealth;
    if(bc.tax===1)delete bc.tax;
    if(bc.levy===1)delete bc.levy;
    if(bc.level===1)delete bc.level;
    if(bc.parent==='c:'+bc.province)delete bc.parent;
    if(bc.deFactoLiege==='c:'+bc.province)delete bc.deFactoLiege;
    if(bc.holdingType===bc.kind)delete bc.holdingType;
    delete bc.id;delete bc.province;delete bc.kind;
    baronies[id]=bc;
   }
   feudalCopy.baronies=baronies;
  }
  shallow.feudal=feudalCopy;
 }
 if(g.economy?.provinces){
  const eProvs={};
  for(const [id,ep] of Object.entries(g.economy.provinces))eProvs[id]=compactEconomyProvince(ep,g.provinces?.[id]?.owner===g.player);
  shallow.economy={...g.economy,provinces:eProvs};
 }
 return JSON.stringify(shallow);
}
export function restoreGame(text,world){
 const o=JSON.parse(text);if(o.version!==1||!o.factions?.[o.player]||o.player==='independent'||!o.provinces||!o.armies)throw Error('Invalid or incompatible save file');
 if((o.mapVersion||'legacy')!==(world.meta?.mapVersion||'legacy')||Object.keys(o.provinces).length!==world.provinces.length||world.provinces.some(p=>!o.provinces[p.id]))throw Error('Map version mismatch');
 for(const f of Object.values(o.factions)){if(!f||typeof f!=='object')continue;f.treasury=Number.isFinite(f.treasury)?f.treasury:0;f.food=Number.isFinite(f.food)?clamp(f.food,-1000,50000):0;f.stability=Number.isFinite(f.stability)?clamp(f.stability,0,100):50;f.legitimacy=Number.isFinite(f.legitimacy)?clamp(f.legitimacy,0,100):50;f.prestige=Number.isFinite(f.prestige)?Math.max(0,f.prestige):0;}
 for(const p of Object.values(o.provinces)){if(!p||typeof p!=='object')continue;p.population=Number.isFinite(p.population)?clamp(p.population,1,2000):10;p.development=Number.isFinite(p.development)?clamp(p.development,0,30):1;p.unrest=Number.isFinite(p.unrest)?clamp(p.unrest,0,100):0;p.buildings??={farm:0,market:0,barracks:0,fort:0};}
 for(const a of Object.values(o.armies)){if(!a||typeof a!=='object')continue;for(const k of ['infantry','archers','cavalry'])a[k]=Number.isFinite(a[k])?Math.max(0,Math.round(a[k])):0;a.morale=Number.isFinite(a.morale)?clamp(a.morale,0,100):75;a.experience=Number.isFinite(a.experience)?clamp(a.experience,0,1):0;}
 rehydrateSaveDefaults(o);
 initializeKingdomSystems(o,world);
 syncTitles(o);
 initDeepSystems(o,world);
 initDlcSystems(o,world);
 initCrossroads(o,world);
 initReignChapters(o);
 reconcilePoliticalHoldings(o);reconcileCareer(o);
 return o;
}
