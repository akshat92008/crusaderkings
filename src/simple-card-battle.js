// Banner Lines: deterministic, renderer-independent card battles.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const byId=(a,b)=>String(a.id).localeCompare(String(b.id));
export const CARD_BATTLE_LIMIT=100;
export const cardRole=g=>g.specialistId==='horsebow'||g.type==='archers'?'ranged':g.type==='cavalry'?'mounted':'foot';
export function deploymentCells(home){
 const cells=[];for(const z of [14,25,36])for(let x=-54;x<=54;x+=12)cells.push({x,z:z*home});return cells;
}
export function freeDeploymentCell(groups,group,x,z,home){
 if(!Number.isFinite(x)||!Number.isFinite(z)||z*home<9||z*home>43||Math.abs(x)>64)return null;
 const occupied=groups.filter(g=>g!==group&&g.side===group.side&&!g.routed);
 return deploymentCells(home).filter(p=>occupied.every(g=>distance(p,g)>7)).sort((a,b)=>distance(a,{x,z})-distance(b,{x,z}))[0]||null;
}
export function moveCard(g,p){
 g.x=p.x;g.z=p.z;g.lane=p.x<-12?0:p.x>12?2:1;
 for(const k of ['targetX','orderX','anchorX','moveX'])g[k]=p.x;
 for(const k of ['targetZ','orderZ','anchorZ','moveZ'])g[k]=p.z;
 g.homeDirection=Math.sign(p.z);g.facingX=0;g.facingZ=-g.homeDirection;g.facing=Math.atan2(0,g.facingZ);
 g.deploymentRevision=(g.deploymentRevision||0)+1;
}
export function arrangeCardArmy(groups,side,home,preset='balanced'){
 const cards=groups.filter(g=>g.side===side&&!g.routed),placed=[];
 for(const role of ['foot','mounted','ranged']){
  const set=cards.filter(g=>cardRole(g)===role).sort(byId);
  set.forEach((g,i)=>{
   const offset=(i-(set.length-1)/2)*12;
   let x=role==='mounted'?(i%2?1:-1)*(42-Math.floor(i/2)*12):offset,z=role==='foot'?14:role==='mounted'?25:36;
   if(preset==='defensive'){z=role==='foot'?25:36;x=role==='mounted'?(i%2?1:-1)*48:offset;}
   if(preset==='flanks'){x=role==='mounted'?(i%2?1:-1)*(54-Math.floor(i/2)*12):offset;z=role==='mounted'?14:z;}
   const cell=freeDeploymentCell(placed,g,clamp(x,-54,54),z*home,home);
   if(cell){moveCard(g,cell);placed.push(g);}
  });
 }return placed.length===cards.length;
}
const soldiers=g=>g.routed?0:Math.max(0,g.troopCount*clamp(g.life/100,0,1));
export function cardBattleOutcome(groups,elapsed,defenseMode=false){
 const strength=side=>groups.filter(g=>g.side===side).reduce((n,g)=>n+soldiers(g),0);
 const a=strength('attacker'),b=strength('defender');
 if(a>0&&b>0&&elapsed<CARD_BATTLE_LIMIT)return null;
 const tie=Math.abs(a-b)<0.5;
 return {victory:tie?!!defenseMode:a>b,reason:tie?'deadlock':a<=0||b<=0?'field secured':'time limit',attacker:a,defender:b};
}
export function cardCounter(g,e){
 const a=cardRole(g),b=cardRole(e);
 if(a==='mounted'&&b==='ranged')return 1.35;
 if(a==='ranged'&&b==='foot')return 1.12;
 if(a==='foot'&&b==='mounted'&&(g.kind==='pikemen'||g.kind==='spearmen'||g.formationId==='pike_square'))return 1.45;
 return 1;
}
export function stepCardBattle(state,dt){
 if(!Number.isFinite(dt)||dt<=0)return;
 state.fieldTime=(state.fieldTime||0)+dt;
 state.effects=(state.effects||[]).filter(e=>(e.age+=dt)<e.duration);
 state.projectiles=(state.projectiles||[]).filter(p=>(p.t+=dt*2.3)<=1);
 const groups=state.groups.slice().sort(byId),live=groups.filter(g=>!g.routed&&g.life>0&&g.troopCount>0);
 const snapshot=new Map(live.map(g=>[g.id,{x:g.x,z:g.z,life:g.life}])),hits=new Map();
 for(const g of groups){
  g.attackPulse=Math.max(0,(g.attackPulse||0)-dt);g.skirmishing=false;
  if(g.routed){g.routAge=(g.routAge||0)+dt;g.moving=true;g.status='routing';g.statusFlags=['ROUT'];g.troops=0;const home=g.homeDirection||1;g.z=clamp(g.z+home*dt*5,-46,46);continue;}
  const enemies=live.filter(e=>e.side!==g.side),pos=snapshot.get(g.id);
  if(!pos||!enemies.length){g.moving=false;continue;}
  const score=e=>distance(pos,snapshot.get(e.id))+(g.lane!==e.lane?3:0)+(cardRole(g)==='mounted'&&cardRole(e)==='ranged'?-6:0);
  const best=enemies.slice().sort((a,b)=>score(a)-score(b)||byId(a,b))[0],old=enemies.find(e=>e.id===g.cardTargetId);
  const e=old&&score(old)<=score(best)+6?old:best;g.cardTargetId=e.id;
  const target=snapshot.get(e.id),dx=target.x-pos.x,dz=target.z-pos.z,d=Math.hypot(dx,dz),role=cardRole(g);
  const reach=role==='ranged'?clamp(g.range||14,8,24):clamp(g.range||2.5,1.5,4),speed=clamp(g.speed||4,2.5,9);
  const step=Math.min(Math.max(0,d-reach*.88),speed*dt);
  g.moving=step>0.01;g.vx=d?dx/d*step/dt:0;g.vz=d?dz/d*step/dt:0;
  if(d>0.01){g.facingX=dx/d;g.facingZ=dz/d;g.facing=Math.atan2(g.facingX,g.facingZ);}
  if(g.moving){g.x=clamp(pos.x+g.vx*dt,-64,64);g.z=clamp(pos.z+g.vz*dt,-46,46);}
  g.targetX=target.x;g.targetZ=target.z;g.phase=(g.phase||0)+dt*(role==='mounted'?10:5);
  g.cooldown=Math.max(0,(g.cooldown||0)-dt);g.status=g.moving?'moving':'engaging';g.statusFlags=[];
  if(d>reach||g.cooldown>1e-8)continue;
  g.cooldown=role==='ranged'?1.15:.85;g.attackPulse=role==='ranged'?.45:.3;g.attackSerial=(g.attackSerial||0)+1;
  const quality=clamp((g.damage||10)/(g.type==='cavalry'?18:role==='ranged'?9:11),.65,1.65),protection=clamp(e.armor||1,.75,1.65);
  const rate=role==='ranged'?.038:role==='mounted'?.048:.046;
  const loss=soldiers(g)*rate*quality*cardCounter(g,e)/protection;
  hits.set(e,(hits.get(e)||0)+loss);
  if(role==='ranged')state.projectiles.push({sx:pos.x,sz:pos.z,tx:target.x,tz:target.z,t:0,kind:'arrow'});
  else state.effects.push({kind:'impact',x:target.x,z:target.z,age:0,duration:.32});
 }
 for(const [g,loss] of hits){const pct=100*loss/Math.max(1,g.troopCount);g.life=clamp(g.life-pct,0,100);g.morale=clamp((g.morale??75)-pct*.55,0,100);}
 for(const g of live){
  if(g.life<=8||soldiers(g)<.5||(g.life<=35&&g.morale<=10)){g.routed=true;g.routAge=0;g.moving=true;g.attackPulse=0;g.status='routing';g.statusFlags=['ROUT'];g.troops=0;}
  else g.troops=Math.round(soldiers(g));
 }
 if(state.effects.length>64)state.effects.splice(0,state.effects.length-64);
 if(state.projectiles.length>128)state.projectiles.splice(0,state.projectiles.length-128);
}
