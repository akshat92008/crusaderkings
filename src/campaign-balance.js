// Deterministic AI recruitment budget and land route planning.
export function aiRecruitmentBudget({treasury,food,population,armySize,goal,levy=1,personality=null,budget=null,difficulty='normal',provinces=0}){
 const goalBonus=['conquer','defend'].includes(goal)?180:0;
 const persTargetMod=personality==='martial'?90:personality==='ambitious'?60:personality==='cautious'?30:personality==='greedy'?-40:0;
 const empireBonus=provinces>=4?Math.min(260,(provinces-3)*35):0;
 const maxCap=difficulty==='hard'?1650:provinces>=4?1350:950;
 const popRate=difficulty==='hard'?0.42:0.32;
 const target=Math.min(maxCap,Math.max(170,Math.round(100+population*popRate+goalBonus+persTargetMod+empireBonus)));
 const reserve=goal==='recover'?300:personality==='greedy'?260:personality==='cautious'?240:personality==='martial'?140:180;
 if(!Number.isFinite(treasury)||food<0||treasury<=reserve+35||armySize>=target)return null;
 const baseBatch=difficulty==='hard'?45:35;
 const desired=Math.max(1,Math.round(baseBatch*Math.max(.2,levy)));
 const availGold=Number.isFinite(budget)?Math.min(treasury-reserve,Math.max(0,budget)):treasury-reserve;
 if(availGold<35)return null;
 const count=Math.min(target-armySize,desired,Math.floor(availGold*35/120));
 if(count<1)return null;
 return {count,cost:Math.ceil(count*120/35),target};
}

export function nearestOwnedRoute(world,start,targets,canEnter){
 const byId=new Map((world?.provinces||[]).map(p=>[p.id,p]));
 const goals=new Set(targets),queue=[start],prev=new Map([[start,null]]);
 for(let i=0;i<queue.length;i++){
  const id=queue[i];
  if(goals.has(id)){
   const route=[];
   for(let n=id;n!==null;n=prev.get(n))route.push(n);
   return route.reverse();
  }
  for(const next of (byId.get(id)?.neighbors||[]).slice().sort()){
   if(!prev.has(next)&&canEnter(next)){prev.set(next,id);queue.push(next);}
  }
 }
 return null;
}

export function supplyRoute(world,start,isSource,canTraverse,maxSteps=4){
 if(!world?.provinces?.length)return {connected:isSource(start),distance:isSource(start)?0:Infinity,source:isSource(start)?start:null};
 if(isSource(start))return {connected:true,distance:0,source:start};
 const byId=new Map(world.provinces.map(p=>[p.id,p]));
 const queue=[[start,0]],seen=new Set([start]);
 for(let i=0;i<queue.length;i++){
  const [id,dist]=queue[i];
  if(dist>=maxSteps)continue;
  for(const next of (byId.get(id)?.neighbors||[]).slice().sort()){
   if(seen.has(next))continue;
   if(isSource(next))return {connected:true,distance:dist+1,source:next};
   if(canTraverse(next)){seen.add(next);queue.push([next,dist+1]);}
  }
 }
 return {connected:false,distance:Infinity,source:null};
}

export function allocateTroops(total,mix){
 const n=Math.max(0,Math.round(total)||0);
 const sum=mix.reduce((s,v)=>s+Math.max(0,v),0)||1;
 const raw=mix.map(v=>n*Math.max(0,v)/sum),out=raw.map(Math.floor);
 let left=n-out.reduce((s,v)=>s+v,0);
 const ranked=raw.map((v,i)=>({i,frac:v-out[i]})).sort((a,b)=>b.frac-a.frac||a.i-b.i);
 for(let j=0;j<left;j++)out[ranked[j%ranked.length].i]++;
 return out;
}
