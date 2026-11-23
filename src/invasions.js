/**
 * Enemy-initiated wars for the existing Crown of Nations campaign.
 * Bound to real rival treasury, armies, connected provinces and three-month
 * warnings; never spawns an army or spends the human player's resources.
 */
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const troops=a=>Math.max(0,(a?.infantry||0)+(a?.archers||0)+(a?.cavalry||0));
const armiesOf=(g,id)=>Object.values(g.armies).filter(a=>a.owner===id);
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
  const province=g.provinces[target.id];if(province?.owner!==player)continue;
  const garrison=45+province.development*12+(province.buildings.fort||0)*45;
  const stationed=armiesOf(g,player).filter(a=>a.province===target.id);
  const defense=garrison+stationed.reduce((a,v)=>a+troops(v),0);
  for(const neighborId of target.neighbors||[]){
   const rival=g.provinces[neighborId]?.owner;
   if(!rival||rival===player||rival==='independent'||!g.factions[rival])continue;
   if(['alliance','marriage'].includes(g.factions[rival].treaties?.[player]))continue;
   const warChest=g.factions[rival].treasury;
   if(warChest<90)continue;
   for(const army of armiesOf(g,rival)){
    if(troops(army)<65)continue;
    const path=trace(world,army.province,neighborId,rival,g);
    if(!path)continue;
    const power=troops(army)*(0.8+(army.morale||75)/250+(army.experience||0)*.2);
    const advantage=power/Math.max(1,defense),distance=path.length-1;
    candidates.push({
      by:rival,army:army.id,province:target.id,staging:neighborId,
      path:path.slice(1),eta:3+distance,status:'approaching',
      advantage,threatScore:advantage*1.8-distance*.14+Math.min(1,warChest/900)*.25
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
 const viable=choices.filter(c=>c.advantage>=(difficulty==='hard'?.47:.66));
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
  if(!enemy||enemy.owner!==threat.by||!province||province.owner!==g.player)continue;
  if(threat.status==='ready'){
   // If the user advances time again instead of defending, allow an
   // automated resolution. Never leave an invisible permanent siege.
   if(g.turn>(threat.readyTurn||g.turn)){autoResolveInvasion(g,world,threat);continue;}
   remaining.push(threat);continue;
  }
  if(threat.path?.length&&enemy.province!==threat.staging){
   const next=threat.path.shift();
   if(g.provinces[next]?.owner!==threat.by)continue;
   enemy.province=next;
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
 if(!found||found.status!=='ready')return {ok:false,msg:'No active siege at that province'};
 const province=g.provinces[found.province],attacker=g.armies[found.army];
 if(!attacker||!province||province.owner!==g.player)return {ok:false,msg:'The invasion is no longer valid'};
 const human=armiesOf(g,g.player).filter(a=>a.province===found.province);
 const playerRatio=clamp(result.attackerRemaining??.5,0,1);
 const enemyRatio=clamp(result.enemyRemaining??(result.victory?.45:.78),0,1);
 for(const a of human)trimArmy(a,playerRatio);
 trimArmy(attacker,enemyRatio);
 const defended=Boolean(result.victory);
 if(defended){
  g.factions[g.player].prestige+=8;
  g.factions[found.by].prestige=Math.max(0,g.factions[found.by].prestige-4);
 }else{
  province.owner=found.by;province.unrest=clamp(province.unrest+27,0,100);
  if(province.buildings.fort>0)province.buildings.fort--;
  attacker.province=found.province;
  // Surviving defenders retreat to an owned neighboring province if possible.
  const local=world.provinces.find(p=>p.id===found.province);
  const retreat=(local?.neighbors||[]).find(id=>g.provinces[id]?.owner===g.player);
  for(const a of human){
   if(retreat)a.province=retreat;
   else if((a.infantry+a.archers+a.cavalry)<20)delete g.armies[a.id];
  }
  g.factions[found.by].prestige+=8;
 }
 g.kingdom.threats=g.kingdom.threats.filter(t=>t!==found);
 const msg=defended?'Your defenders repelled '+g.factions[found.by].name+' at '+found.province:
  g.factions[found.by].name+' captured '+found.province+' after a successful assault';
 return {ok:true,defended,msg};
}
export function autoResolveInvasion(g,world,threat){
 const target=g.provinces[threat.province],army=g.armies[threat.army];
 if(!target||!army)return {ok:false,msg:'Siege no longer active'};
 const defense=45+target.development*12+(target.buildings.fort||0)*45+
  armiesOf(g,g.player).filter(a=>a.province===threat.province).reduce((sum,a)=>sum+troops(a)*(.7+(a.experience||0)*.4),0);
 const offense=troops(army)*(.8+(army.morale||75)/280+(army.experience||0)*.2);
 const defended=offense<=defense*1.13;
 return resolveInvasion(g,world,threat,{victory:defended,attackerRemaining:defended?.82:.32,enemyRemaining:defended?.36:.75});
}
