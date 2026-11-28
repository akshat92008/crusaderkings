import {invasionReserved} from './invasion-reservations.js';
import {campaignArmyPower,campaignGarrison,automaticDefense,terrainCombatModifiers} from './border-battle.js';
import {applyFieldForceLosses} from './field-forces.js';
import {nonAggression,aidStrength,diplomaticSupport,fieldContingentsAt,hasHostageBar} from './diplomacy-systems.js';
import {captureCommander} from './feudal-systems.js';
import {defenseSupport,strategicPlan,raidThreshold,recordStrategicBattle,evaluateWarViability,personalityProfile} from './strategic-ai.js';
import {controller,captureProvince,availableCasusBelli,declareCasusBelliWar} from './campaign-war.js';
import {embarked} from './naval-systems.js';
import {armyReadiness,onArmyMarch,syncRegiments,applyFortDamage,resolveBattleCommanders,retreatArmy} from './military-systems.js';
import {hasTruce,recordCampaignBattle,activeWar} from './political-conflict.js';

/**
 * Enemy-initiated wars for the existing Crown of Nations campaign.
 * Bound to real rival treasury, armies, connected provinces and three-month
 * warnings; never spawns an army or spends the human player's resources.
 */
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const troops=a=>Math.max(0,(a?.infantry||0)+(a?.archers||0)+(a?.cavalry||0));
const armyPower=(g,a)=>campaignArmyPower(a,armyReadiness(g,a));
const armiesOf=(g,id)=>Object.values(g.armies).filter(a=>a.owner===id&&!a.contingent&&!embarked(g,a.id));

export function nativeInvasionArmies(g,threat){
 const primary=g.armies[threat.army];
 if(!primary)return [];
 return [...new Set([threat.army,...(threat.armies||[])])].map(id=>g.armies[id]).filter(a=>a&&a.owner===threat.by&&a.province===primary.province&&!a.contingent&&!embarked(g,a.id)&&troops(a)>0);
}

const trace=(world,start,goal,owner,g)=>{
 if(start===goal)return [start];
 const byId=new Map(world.provinces.map(p=>[p.id,p])),queue=[[start]],seen=new Set([start]);
 while(queue.length){
  const path=queue.shift();if(path.length>=7)continue;
  for(const next of byId.get(path.at(-1))?.neighbors||[]){
   if(seen.has(next)||g.provinces[next]?.owner!==owner||controller(g,next)!==owner)continue;
   if(next===goal)return [...path,next];
   seen.add(next);queue.push([...path,next]);
  }
 }
 return null;
};

function treatyBlocked(g,rival,player){
 return nonAggression(g,rival,player)||hasTruce(g,rival,player)||hasHostageBar(g,rival,player)||['alliance','marriage'].includes(g.factions[rival]?.treaties?.[player]);
}

export function findInvasionOptions(g,world){
 const player=g.player,candidates=[];
 for(const target of world.provinces){
  const province=g.provinces[target.id];
  if(province?.owner!==player||controller(g,target.id)!==player)continue;
  const terrMod=terrainCombatModifiers(target.terrain||province.terrain||'plains');
  const garrison=campaignGarrison(province)*terrMod.defense;
  const stationed=armiesOf(g,player).filter(a=>a.province===target.id);
  const defense=garrison+stationed.reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a))*terrMod.defense,0);
  for(const neighborId of target.neighbors||[]){
   const rival=g.provinces[neighborId]?.owner;
   if(!rival||rival===player||rival==='independent'||!g.factions[rival])continue;
   if(treatyBlocked(g,rival,player))continue;
   const warChest=g.factions[rival].treasury;
   if(warChest<90)continue;
   const local=new Map();
   for(const a of armiesOf(g,rival)){
    if(troops(a)<=0||invasionReserved(g,a.id)||controller(g,a.province)!==rival||g.provinces[a.province]?.owner!==rival)continue;
    if(!local.has(a.province))local.set(a.province,[]);
    local.get(a.province).push(a);
   }
   for(const group of local.values()){
    group.sort((a,b)=>troops(b)-troops(a)||a.id.localeCompare(b.id));
    const army=group[0];
    if(group.reduce((n,a)=>n+troops(a),0)<65)continue;
    const path=trace(world,army.province,neighborId,rival,g);
    if(!path)continue;
    const power=group.reduce((n,a)=>n+armyPower(g,a),0)+aidStrength(g,rival,player)+fieldContingentsAt(g,rival,army.province,player).reduce((n,a)=>n+armyPower(g,a),0);
    const alliedDefense=fieldContingentsAt(g,player,target.id,rival).reduce((n,a)=>n+armyPower(g,a),0);
    const advantage=power/Math.max(1,defense+alliedDefense+defenseSupport(g,player,rival)),distance=path.length-1;
    const cbs=availableCasusBelli(g,world,rival,player);
    const hasSiegeEngines=group.some(a=>{const eng=g.military?.armies?.[a.id]?.engines;return eng&&((eng.ram||0)+(eng.catapult||0)+(eng.bombard||0))>0;});
    const playerDistracted=Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(player)&&![w.attacker,w.defender].includes(rival));
    const opportunism=(!stationed.length?0.45:0)+(hasSiegeEngines&&(province.buildings?.fort||0)>0?0.35:0)+(playerDistracted?0.4:0);
    candidates.push({
     by:rival,army:army.id,armies:group.map(a=>a.id),province:target.id,staging:neighborId,
     path:path.slice(1),eta:3+distance,status:'approaching',
     cb:cbs.find(c=>c.goal===target.id)?.cb||cbs[0]?.cb||null,
     advantage,threatScore:advantage*1.8-distance*.14+Math.min(1,warChest/900)*.25+(activeWar(g,rival,player)?.goal===target.id?2:0)+(strategicPlan(g,rival)?.target===player&&strategicPlan(g,rival)?.goal==='conquer'?1:0)+(cbs.length?0.3:0)+opportunism
    });
   }
  }
 }
 return candidates.sort((a,b)=>b.threatScore-a.threatScore||a.by.localeCompare(b.by)||a.province.localeCompare(b.province));
}

export function planEnemyInvasion(g,world){
 if(g.kingdom.threats.length||g.kingdom.difficulty==='peaceful')return null;
 if((g.kingdom.nextInvasionTurn||0)>g.turn)return null;
 const cooldowns=g.kingdom.rivalInvasionCooldowns||{};
 const choices=findInvasionOptions(g,world);
 if(!choices.length)return null;
 const difficulty=g.kingdom.difficulty;
 // Strategic AI avoids suicidal wars while still allowing bold gambles by aggressive personalities.
 const viable=choices.filter(c=>{
  if((cooldowns[c.by]||0)>g.turn)return false;
  const minAdv=Math.max(.35,(difficulty==='hard'?.47:.66)+(raidThreshold(g,c.by,g.player)-.48)*.5);
  if(c.advantage<minAdv)return false;
  if(difficulty!=='hard'){
   const v=evaluateWarViability(g,world,c.by,g.player);
   if(!v.viable&&!activeWar(g,c.by,g.player)){
    const prof=personalityProfile(g,c.by);
    if(c.advantage<1.1||prof.id==='cautious')return false;
   }
  }
  return true;
 });
 if(!viable.length)return null;
 const chosen=viable[0];
 g.kingdom.threats.push(chosen);
 g.factions[chosen.by].treasury-=90; // genuine military mobilization cost
 return chosen;
}

// Revalidate a pending battle against authoritative campaign state. A saved or
// previously displayed alert is not permission to attack from another province.
export function validReadyInvasion(g,world,threat){
 if(!threat||threat.status!=='ready')return false;
 const enemy=g.armies[threat.army],target=g.provinces[threat.province];
 if(!g.factions[threat.by]||threat.by===g.player||!enemy||enemy.owner!==threat.by||enemy.contingent||troops(enemy)<1||embarked(g,enemy.id))return false;
 if(!target||target.owner!==g.player||controller(g,threat.province)!==g.player)return false;
 const staging=threat.staging??enemy.province;
 if(enemy.province!==staging||g.provinces[staging]?.owner!==threat.by||controller(g,staging)!==threat.by)return false;
 if(!world.provinces.find(p=>p.id===staging)?.neighbors?.includes(threat.province))return false;
 return !treatyBlocked(g,threat.by,g.player);
}

function pendingInvasion(g,threat){
 return g.kingdom?.threats?.find(t=>t.army===threat?.army&&t.province===threat?.province);
}

export function progressEnemyInvasions(g,world){
 const remaining=[];
 for(const threat of g.kingdom.threats||[]){
  const enemy=g.armies[threat.army],province=g.provinces[threat.province];
  if(!enemy||enemy.owner!==threat.by||!province||province.owner!==g.player||controller(g,threat.province)!==g.player||embarked(g,enemy.id)||troops(enemy)<1||treatyBlocked(g,threat.by,g.player))continue;
  if(threat.status==='ready'){
   // If the user advances time again instead of defending, allow an
   // automated resolution. Never leave an invisible permanent siege.
   if(!validReadyInvasion(g,world,threat))continue;
   if(g.turn>(threat.readyTurn??g.turn)){autoResolveInvasion(g,world,threat);continue;}
   remaining.push(threat);continue;
  }
  if(threat.path?.length&&enemy.province!==threat.staging){
   const next=threat.path.shift();
   if(g.provinces[next]?.owner!==threat.by||controller(g,next)!==threat.by||!world.provinces.find(p=>p.id===enemy.province)?.neighbors.includes(next))continue;
   for(const unit of [...nativeInvasionArmies(g,threat),...fieldContingentsAt(g,threat.by,enemy.province,g.player)]){onArmyMarch(g,unit);unit.province=next;}
  }
  threat.eta=Math.max(0,threat.eta-1);
  if(threat.eta===0){
   if(enemy.province!==threat.staging)continue;
   threat.status='ready';threat.readyTurn=g.turn;
   if(!validReadyInvasion(g,world,threat))continue;
  }
  remaining.push(threat);
 }
 g.kingdom.threats=remaining;
 return remaining.find(t=>t.status==='ready')||null;
}

function trimArmy(a,fraction){
 if(!a)return;
 for(const unit of ['infantry','archers','cavalry'])a[unit]=Math.max(0,Math.round(a[unit]*clamp(fraction,0,1)));
}

export function resolveInvasion(g,world,threat,result){
 if(!result||typeof result.victory!=='boolean')return {ok:false,msg:'Invalid invasion battle result.'};
 const found=pendingInvasion(g,threat);
 if(!found||found.status!=='ready')return {ok:false,msg:'No active invasion at that province'};
 const province=g.provinces[found.province],attacker=g.armies[found.army];
 if(!validReadyInvasion(g,world,found))return {ok:false,msg:'The invasion is no longer valid'};
 found.status='resolved';
 const human=[...armiesOf(g,g.player).filter(a=>a.province===found.province),...fieldContingentsAt(g,g.player,found.province,found.by)];
 const invaders=[...nativeInvasionArmies(g,found),...fieldContingentsAt(g,found.by,attacker.province,g.player)];
 const playerRatio=clamp(Number.isFinite(result.attackerRemaining)?result.attackerRemaining:.5,0,1);
 const enemyRatio=clamp(Number.isFinite(result.enemyRemaining)?result.enemyRemaining:(result.victory?.45:.78),0,1);
 if(result.fieldBattle)applyFieldForceLosses(human,result,'attacker',playerRatio);
 for(const a of human){if(!result.fieldBattle)trimArmy(a,playerRatio);syncRegiments(g,a);}
 if(result.fieldBattle)applyFieldForceLosses(invaders,result,'defender',enemyRatio);
 for(const a of invaders){onArmyMarch(g,a);if(!result.fieldBattle)trimArmy(a,enemyRatio);syncRegiments(g,a);}
 applyFortDamage(g,found.province,result);
 const defended=Boolean(result.victory);
 const war=activeWar(g,found.by,g.player);
 if(defended){
  resolveBattleCommanders(g,g.player,invaders,{loserRemaining:enemyRatio,fieldBattle:!!result.fieldBattle});
  if(enemyRatio<.3)for(const a of invaders)captureCommander(g,g.player,a);
  for(const a of invaders)if(troops(a)<=0)delete g.armies[a.id];
  g.factions[g.player].prestige+=8;
  g.factions[found.by].prestige=Math.max(0,g.factions[found.by].prestige-4);
 }else{
  captureProvince(g,war,found.by,found.province,attacker.province);province.unrest=clamp(province.unrest+27,0,100);
  if(!result.fieldBattle&&!result.fortBreached&&province.buildings.fort>0)province.buildings.fort--;
  for(const a of invaders)a.province=found.province;
  resolveBattleCommanders(g,found.by,human,{loserRemaining:playerRatio,fieldBattle:!!result.fieldBattle});
  for(const a of human){
   if(playerRatio<.3)captureCommander(g,found.by,a);
   if(!retreatArmy(g,world,a,found.province)){captureCommander(g,found.by,a);delete g.armies[a.id];}
  }
  g.factions[found.by].prestige+=8;
 }
 recordCampaignBattle(g,found.by,g.player,found.province,!defended);recordStrategicBattle(g,found.by,g.player,!defended,1-enemyRatio);recordStrategicBattle(g,g.player,found.by,defended,1-playerRatio);
 g.kingdom.threats=g.kingdom.threats.filter(t=>t!==found);
 const isHard=g.kingdom.difficulty==='hard';
 g.kingdom.nextInvasionTurn=g.turn+(isHard?4:6);
 g.kingdom.rivalInvasionCooldowns??={};
 g.kingdom.rivalInvasionCooldowns[found.by]=g.turn+(isHard?9:12);
 const msg=defended?'Your defenders repelled '+g.factions[found.by].name+' at '+found.province:
  g.factions[found.by].name+' captured '+found.province+' after a successful assault';
 return {ok:true,defended,msg};
}

export function autoResolveInvasion(g,world,threat){
 threat=pendingInvasion(g,threat);
 if(!validReadyInvasion(g,world,threat))return {ok:false,msg:'Invasion no longer active'};
 const target=g.provinces[threat.province],army=g.armies[threat.army];
 if(!target||!army)return {ok:false,msg:'Invasion no longer active'};
 const terrMod=terrainCombatModifiers(world?.provinces?.find(p=>p.id===threat.province)?.terrain||target.terrain||'plains');
 const defense=campaignGarrison(target)*terrMod.defense+defenseSupport(g,g.player,threat.by)+
  [...armiesOf(g,g.player).filter(a=>a.province===threat.province),...fieldContingentsAt(g,g.player,threat.province,threat.by)].reduce((sum,a)=>sum+armyPower(g,a)*terrMod.defense,0);
 const offense=[...nativeInvasionArmies(g,threat),...fieldContingentsAt(g,threat.by,army.province,g.player)].reduce((sum,a)=>sum+armyPower(g,a),0)+aidStrength(g,threat.by,g.player);
 return resolveInvasion(g,world,threat,automaticDefense(offense,defense));
}
