import {applyFieldLosses} from './field-forces.js';
import {nonAggression,aidStrength,diplomaticSupport} from './diplomacy-systems.js';
import {captureCommander} from './feudal-systems.js';
import {defenseSupport,strategicPlan,raidThreshold} from './strategic-ai.js';
import {controller,captureProvince} from './campaign-war.js';
import {embarked} from './naval-systems.js';
import {armyReadiness,onArmyMarch,syncRegiments,applyFortDamage} from './military-systems.js';
import {hasTruce,recordCampaignBattle,activeWar} from './political-conflict.js';
/**
 * Enemy-initiated wars for the existing Crown of Nations campaign.
 * Bound to real rival treasury, armies, connected provinces and three-month
 * warnings; never spawns an army or spends the human player's resources.
 */
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const troops=a=>Math.max(0,(a?.infantry||0)+(a?.archers||0)+(a?.cavalry||0));
const armiesOf=(g,id)=>Object.values(g.armies).filter(a=>a.owner===id&&!embarked(g,a.id));
const trace=(world,start,goal,owner,g)=>{
  if(start===goal)return [start];
  const byId=new Map(world.provinces.map(p=>[p.id,p])),queue=[[start]],seen=new Set([start]);
  while(queue.length){const path=queue.shift();if(path.length>=7)continue;
    for(const next of byId.get(path.at(-1))?.neighbors||[]){
      if(seen.has(next)||g.provinces[next]?.owner!==owner)continue;
      if(next===goal)return [...path,next];
      seen.add(next);queue.push([...path,next]);
    }
  }return null;
};
export function findInvasionOptions(g,world){
 const player=g.player,byId=new Map(world.provinces.map(p=>[p.id,p])),candidates=[];
 for(const target of world.provinces){
  const province=g.provinces[target.id];if(province?.owner!==player||controller(g,target.id)!==player)continue;
  const garrison=45+province.development*12+(province.buildings.fort||0)*45;
  const stationed=armiesOf(g,player).filter(a=>a.province===target.id);
  const defense=garrison+stationed.reduce((a,v)=>a+troops(v),0);
  for(const neighborId of target.neighbors||[]){
   const rival=g.provinces[neighborId]?.owner;
   if(!rival||rival===player||rival==='independent'||!g.factions[rival])continue;
   if(nonAggression(g,rival,player)||hasTruce(g,rival,player)||['alliance','marriage'].includes(g.factions[rival].treaties?.[player]))continue;
   const warChest=g.factions[rival].treasury;
   if(warChest<90)continue;
   for(const army of armiesOf(g,rival)){
    if(troops(army)<65||embarked(g,army.id))continue;
    const path=trace(world,army.province,neighborId,rival,g);
    if(!path)continue;
    const power=troops(army)*armyReadiness(g,army).power*(0.8+(army.morale||75)/250+(army.experience||0)*.2);
    const advantage=power/Math.max(1,defense+defenseSupport(g,player,rival)),distance=path.length-1;
    candidates.push({
      by:rival,army:army.id,province:target.id,staging:neighborId,
      path:path.slice(1),eta:3+distance,status:'approaching',
      advantage,threatScore:advantage*1.8-distance*.14+Math.min(1,warChest/900)*.25+(activeWar(g,rival,player)?.goal===target.id?2:0)+(strategicPlan(g,rival)?.target===player&&strategicPlan(g,rival)?.goal==='conquer'?1:0)
    });
   }
  }
 }
 return candidates.sort((a,b)=>b.threatScore-a.threatScore||a.by.localeCompare(b.by)||a.province.localeCompare(b.province));
}
export function planEnemyInvasion(g,world){
 if(g.kingdom.threats.length||g.kingdom.difficulty==='peaceful')return null;
 const choices=findInvasionOptions(g,world);
 if(!choices.length)return null;
 const difficulty=g.kingdom.difficulty;
 // Strategic AI can gamble on difficult raids; it is not required to
 // always defeat the player's army in a pre-battle strength check.
 const viable=choices.filter(c=>c.advantage>=Math.max(.35,(difficulty==='hard'?.47:.66)+(raidThreshold(g,c.by,g.player)-.48)*.5));
 if(!viable.length)return null;
 const chosen=viable[0];
 g.kingdom.threats.push(chosen);
 g.factions[chosen.by].treasury-=90; // genuine military mobilization cost
 return chosen;
}
export function progressEnemyInvasions(g,world){
 const remaining=[];
 for(const threat of g.kingdom.threats||[]){
  const enemy=g.armies[threat.army],province=g.provinces[threat.province];
  if(!enemy||enemy.owner!==threat.by||!province||province.owner!==g.player||controller(g,threat.province)!==g.player||embarked(g,enemy.id)||nonAggression(g,threat.by,g.player)||hasTruce(g,threat.by,g.player))continue;
  if(threat.status==='ready'){
   // If the user advances time again instead of defending, allow an
   // automated resolution. Never leave an invisible permanent siege.
   if(g.turn>(threat.readyTurn||g.turn)){autoResolveInvasion(g,world,threat);continue;}
   remaining.push(threat);continue;
  }
  if(threat.path?.length&&enemy.province!==threat.staging){
   const next=threat.path.shift();
   if(g.provinces[next]?.owner!==threat.by)continue;
   onArmyMarch(g,enemy);enemy.province=next;
  }
  threat.eta=Math.max(0,threat.eta-1);
  if(threat.eta===0){
   if(enemy.province!==threat.staging)continue;
   threat.status='ready';threat.readyTurn=g.turn;
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
 const found=g.kingdom?.threats?.find(t=>t.army===threat?.army&&t.province===threat?.province);
 if(!found||found.status!=='ready')return {ok:false,msg:'No active invasion at that province'};
 const province=g.provinces[found.province],attacker=g.armies[found.army];
 if(!attacker||!province||province.owner!==g.player||nonAggression(g,found.by,g.player)||hasTruce(g,found.by,g.player))return {ok:false,msg:'The invasion is no longer valid'};
 const human=armiesOf(g,g.player).filter(a=>a.province===found.province);
 const playerRatio=clamp(result.attackerRemaining??.5,0,1);
 const enemyRatio=clamp(result.enemyRemaining??(result.victory?.45:.78),0,1);
 for(const a of human){if(result.fieldBattle)applyFieldLosses(a,result,'attacker',playerRatio);else trimArmy(a,playerRatio);syncRegiments(g,a);}
 onArmyMarch(g,attacker);if(result.fieldBattle)applyFieldLosses(attacker,result,'defender',enemyRatio);else trimArmy(attacker,enemyRatio);syncRegiments(g,attacker);applyFortDamage(g,found.province,result);
 const defended=Boolean(result.victory);
 const war=activeWar(g,found.by,g.player);
 if(defended){
  if(enemyRatio<.3)captureCommander(g,g.player,attacker);
  g.factions[g.player].prestige+=8;
  g.factions[found.by].prestige=Math.max(0,g.factions[found.by].prestige-4);
 }else{
  captureProvince(g,war,found.by,found.province,attacker.province);province.unrest=clamp(province.unrest+27,0,100);
  if(!result.fieldBattle&&!result.fortBreached&&province.buildings.fort>0)province.buildings.fort--;
  attacker.province=found.province;
  // Surviving defenders retreat to an owned neighboring province if possible.
  const local=world.provinces.find(p=>p.id===found.province);
  const retreat=(local?.neighbors||[]).find(id=>g.provinces[id]?.owner===g.player);
  for(const a of human){
   if(playerRatio<.3)captureCommander(g,found.by,a);
   if(retreat)a.province=retreat;
   else {const fallback=Object.values(g.provinces).find(p=>p.id!==found.province&&p.owner===g.player&&controller(g,p.id)===g.player);if(fallback)a.province=fallback.id;else delete g.armies[a.id];}
  }
  g.factions[found.by].prestige+=8;
 }
 recordCampaignBattle(g,found.by,g.player,found.province,!defended);
 g.kingdom.threats=g.kingdom.threats.filter(t=>t!==found);
 const msg=defended?'Your defenders repelled '+g.factions[found.by].name+' at '+found.province:
  g.factions[found.by].name+' captured '+found.province+' after a successful assault';
 return {ok:true,defended,msg};
}
export function autoResolveInvasion(g,world,threat){
 const target=g.provinces[threat.province],army=g.armies[threat.army];
 if(!target||!army)return {ok:false,msg:'Invasion no longer active'};
 const defense=45+target.development*12+(target.buildings.fort||0)*45+defenseSupport(g,g.player,threat.by)+
  armiesOf(g,g.player).filter(a=>a.province===threat.province).reduce((sum,a)=>sum+troops(a)*(.7+(a.experience||0)*.4),0);
 const offense=troops(army)*armyReadiness(g,army).power*(.8+(army.morale||75)/280+(army.experience||0)*.2);
 const defended=offense<=defense*1.13;
 return resolveInvasion(g,world,threat,{victory:defended,attackerRemaining:defended?.82:.32,enemyRemaining:defended?.36:.75,fieldBattle:true});
}
