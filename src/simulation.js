import {onArmyMarch,armyReadiness,syncRegiments,applyFortDamage,initMilitary} from './military-systems.js';
import {economyModifiers} from './economy-systems.js';
import {heritageModifiers} from './heritage-systems.js';
import {civicModifiers,civicProvinceUnrest} from './civic-systems.js';
import {hasTruce,recordCampaignBattle,activeWar} from './political-conflict.js';
/* Crown of Nations: deterministic, serializable campaign rules. No browser dependencies. */
import {politicalRevenue,politicalLevy} from './dynastic-politics.js';
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
  const prov=owned[0];const qty=155+(faction.id.length*13)%60;
  const troopMix=startingTroops(faction,qty);
  armies['a'+nextId]={id:'a'+nextId++,owner:faction.id,province:prov.id,...troopMix,experience:0.08,morale:78,commander:`Commander of ${faction.name}`,doctrine:militaryDoctrine(faction).id};
 }
 const game={version:1,seed:1450,year:1450,month:0,player,paused:true,speed:1,factions,provinces,armies,nextId,log:[{date:'January 1450',text:'The world stands at a crossroads. Your reign begins.'}],wars:{},history:[],turn:0};
 initializeKingdomSystems(game,world);
 return game;
}
export function makeLog(g,text){g.log.unshift({date:`${MONTHS[g.month]} ${g.year}`,text});g.log=g.log.slice(0,30);}
export const ownerName=(g,id)=>g.factions[id]?.name||id;
export function controlled(g,id){return Object.values(g.provinces).filter(p=>p.owner===id);}
export function armiesAt(g,province,owner){return Object.values(g.armies).filter(a=>a.province===province&&(owner===undefined||a.owner===owner));}
export function armySize(a){return a?Math.max(0,Math.round(a.infantry+a.archers+a.cavalry)):0;}
export function empireStats(g,owner){
 const p=controlled(g,owner); const f=g.factions[owner];
 const tax=[.65,1,1.5][f?.policies.tax??1];
 const trade=tradeIncome(g,owner);
 const stewardship=g.kingdom?.courts?.[owner]?.steward||0;
 const taxIncome=Math.round(economyModifiers(g,owner).tax*heritageModifiers(g,owner).tax*civicModifiers(g,owner).tax*politicalRevenue(g,owner)*p.reduce((sum,pr)=>sum+(pr.population*(1+pr.development*.14)+pr.buildings.market*28)*.35*tax*(1-pr.unrest/170),0)*(1+stewardship*.025+(Math.max(1,f?.tech||1)-1)*.018));
 const income=taxIncome+trade;
 const upkeep=Math.round(Object.values(g.armies).filter(a=>a.owner===owner).reduce((s,a)=>s+armySize(a)*.08,0));
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
 if(!p||p.owner!==g.player)return {ok:false,msg:'Select your own province'};
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
export function recruit(g,provinceId,type='infantry'){
 const p=g.provinces[provinceId],f=g.factions[g.player];
 if(!p||p.owner!==g.player)return {ok:false,msg:'Select your own province'};
 const prices={infantry:110,archers:150,cavalry:240};if(!Object.hasOwn(prices,type))return {ok:false,msg:'Unknown troop type'};
 const doctrine=militaryDoctrine(g.player);
 const primary=['infantry','archers','cavalry'].reduce((best,t,i,a)=>doctrine.mix[i]>doctrine.mix[a.indexOf(best)]?t:best,'infantry');
 const discount=type===primary?0.82:1;
 const cost=Math.round(prices[type]*discount*(1-(p.buildings.barracks*.06))*economyModifiers(g,g.player).cost);
 if(f.treasury<cost)return {ok:false,msg:`Need ${cost} gold`};
 f.treasury-=cost;p.unrest=clamp(p.unrest+(f.policies.levy===2?7:2),0,100);
 let a=armiesAt(g,provinceId,g.player)[0];
 if(!a){a={id:'a'+g.nextId++,owner:g.player,province:provinceId,infantry:0,archers:0,cavalry:0,experience:0,morale:75,commander:'Newly appointed general'};g.armies[a.id]=a;}
 const recruited=Math.max(1,Math.round((type==='cavalry'?25:50)*politicalLevy(g,g.player)*civicModifiers(g,g.player).levy*heritageModifiers(g,g.player).levy));a[type]+=recruited;initMilitary(g);syncRegiments(g,a);
 a.doctrine=doctrine.id;
 makeLog(g,`${recruited} ${type} recruited in ${provinceId}.`);
 return {ok:true,msg:doctrine.unique+' tradition: regiment recruited'};
}
export function isAdjacent(world,src,dst){return !!world.provinces.find(p=>p.id===src)?.neighbors?.includes(dst);}
export function startMarch(g,world,fromId,toId){
 const src=g.provinces[fromId],target=g.provinces[toId];
 if(!src||!target||src.owner!==g.player)return {ok:false,msg:'Select an owned province to march from'};
 if(fromId===toId)return {ok:false,msg:'Choose another province'};
 if(!isAdjacent(world,fromId,toId))return {ok:false,msg:'Armies can currently move only to connected provinces'};
 const army=armiesAt(g,fromId,g.player)[0];
 if(!army||armySize(army)<20)return {ok:false,msg:'No field army here. Recruit soldiers first.'};
 if(target.owner===g.player){onArmyMarch(g,army);army.province=toId;makeLog(g,`${army.commander} marched to ${toId}.`);return {ok:true,type:'move',msg:'Army moved'};}
 if(hasTruce(g,g.player,target.owner))return {ok:false,msg:'A peace treaty bars this attack.'};
 if(g.factions[g.player].treaties[target.owner]==='alliance')return {ok:false,msg:'Cannot attack an ally'};
 const defenders=armiesAt(g,toId,target.owner);
 const defenseTroops=defenders.reduce((s,a)=>s+armySize(a),0);
 const garrison=45+target.development*12+target.buildings.fort*45;
 return {ok:true,type:'battle',attacker:army.id,defendingArmy:defenders[0]?.id||null,enemyArmy:defenders[0]?.id||null,defenseTroops,defenseGarrison:garrison,from:fromId,to:toId,enemy:target.owner};
}
export function concludeBattle(g,battle,result){
 const src=g.armies[battle.attacker];if(!src)return;
 const dst=g.provinces[battle.to];const was=dst.owner;
 recordCampaignBattle(g,g.player,was,battle.to,!!result.victory);
 const ratio=clamp(result.attackerRemaining??0,0,1);
 const oldsize=armySize(src);onArmyMarch(g,src);applyFortDamage(g,battle.to,result);
 src.infantry=Math.round(src.infantry*ratio);src.archers=Math.round(src.archers*ratio);src.cavalry=Math.round(src.cavalry*ratio);syncRegiments(g,src);
 if(result.victory){dst.owner=g.player;dst.unrest=clamp(dst.unrest+25,0,100);src.province=battle.to;src.experience=clamp(src.experience+.06,0,1);
  const defending=armiesAt(g,battle.to,was).find(a=>a.id!==src.id);if(defending)delete g.armies[defending.id];
  g.factions[g.player].prestige+=8;g.factions[g.player].legitimacy=clamp(g.factions[g.player].legitimacy+2,0,100);
  makeLog(g,`Victory! ${dst.owner===g.player?'Your forces seized':'Won'} ${battle.to} from ${ownerName(g,was)}. ${oldsize-armySize(src)} casualties.`);
 } else {src.morale=clamp(src.morale-20,10,100);g.factions[g.player].prestige=Math.max(0,g.factions[g.player].prestige-5);makeLog(g,`Defeat at ${battle.to}. Your army fell back with ${armySize(src)} survivors.`);}
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
   if(p.unrest>=93 && rand(g)<.13){p.owner='independent';makeLog(g,`Revolt! Province ${p.id} broke from ${f.name}.`);}
  }
  const provinces=Math.max(1,s.provinces);f.stability=clamp(f.stability+Math.sign(52-avgUnrest/provinces)*.6-(f.treasury<0?3:0)-(f.food<0?2:0),0,100);
  if(f.treasury<0&&rand(g)<.14){f.legitimacy=clamp(f.legitimacy-3,0,100);}
  // Court AI: invest reserves. No fake historical scripting.
  if(f.id!==g.player&&g.turn%4===0&&f.treasury>700&&s.provinces){
   const own=controlled(g,f.id);const p=own[Math.floor(rand(g)*own.length)];
   if(p){const cost=Math.round(240*civicModifiers(g,f.id).build*economyModifiers(g,f.id).cost);if(f.treasury>cost&&p.buildings.market<3){f.treasury-=cost;p.buildings.market=clamp(p.buildings.market+1,0,3);p.development=clamp(p.development+1,1,20);}}
  }
 }
 // Rival rulers periodically recruit and contest border provinces. Player wars remain manual.
 if(g.turn%8===0){
  const challengers=Object.values(g.armies).filter(a=>a.owner!==g.player && a.owner!=='independent' && armySize(a)>45);
  const shuffled=challengers.slice().sort((a,b)=>(a.id.length*17+g.turn)%31-(b.id.length*17+g.turn)%31);
  let campaigns=0;
  for(const a of shuffled){
   if(campaigns>=3)break;
   const origin=world.provinces.find(p=>p.id===a.province);if(!origin||g.provinces[origin.id].owner!==a.owner)continue;
   const potential=origin.neighbors.map(id=>g.provinces[id]).filter(p=>p&&p.owner!==a.owner&&p.owner!==g.player&&!hasTruce(g,a.owner,p.owner)&&g.factions[a.owner].treaties[p.owner]!=='alliance');
   if(!potential.length||rand(g)>.48)continue;
   const target=potential.find(p=>activeWar(g,a.owner,p.owner)?.goal===p.id)||potential[Math.floor(rand(g)*potential.length)];
   const defense=45+target.development*13+target.buildings.fort*48+armiesAt(g,target.id,target.owner).reduce((sum,v)=>sum+armySize(v),0);
   const attack=armySize(a)*armyReadiness(g,a).power*(0.75+rand(g)*.7);
   if(attack>defense*.88){
    const previous=target.owner;recordCampaignBattle(g,a.owner,previous,target.id,true);target.owner=a.owner;target.unrest=clamp(target.unrest+25,0,100);
    const losses=clamp(defense/Math.max(1,attack)*.29,.07,.44);
    a.infantry=Math.round(a.infantry*(1-losses));a.archers=Math.round(a.archers*(1-losses));a.cavalry=Math.round(a.cavalry*(1-losses));
    for(const defender of armiesAt(g,target.id,previous))delete g.armies[defender.id];
    onArmyMarch(g,a);a.province=target.id;g.factions[a.owner].prestige+=3;
    makeLog(g,`${ownerName(g,a.owner)} seized ${target.id} from ${ownerName(g,previous)} after a border conflict.`);campaigns++;
   }
  }
 }
 if(g.turn%6===0){
  for(const f of world.factions){
   if(f.id===g.player)continue;
   let troops=Object.values(g.armies).filter(a=>a.owner===f.id);const a=troops[0];
   if(a&&f.id!=='independent'&&g.factions[f.id].treasury>600&&armySize(a)<190){g.factions[f.id].treasury-=120;const count=Math.max(1,Math.round(35*politicalLevy(g,f.id)*civicModifiers(g,f.id).levy*heritageModifiers(g,f.id).levy)),mix=startingTroops(f,count);for(const k of ['infantry','archers','cavalry'])a[k]+=mix[k];}
  }
 }
 if(g.turn%12===0)makeLog(g,`A new year begins: ${g.year}. Courts across the world revise their ambitions.`);
 if(g.turn%8===0){
  const me=g.factions[g.player];if(me){me.prestige+=1;makeLog(g,`The royal council convenes to review the realm's affairs.`);}
 }
 advanceKingdomSystems(g,world);
 return g;
}
export function snapshot(g){return JSON.stringify(g);}
export function restoreGame(text,world){
 const o=JSON.parse(text);if(o.version!==1||!world.factions.some(f=>f.id===o.player)||!o.provinces||!o.armies)throw Error('Invalid or incompatible save file');
 if(Object.keys(o.provinces).length!==world.provinces.length)throw Error('Map version mismatch');
 initializeKingdomSystems(o,world);
 return o;
}
