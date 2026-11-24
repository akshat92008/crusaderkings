// Deterministic AI recruitment budget and land route planning.
export function aiRecruitmentBudget({treasury,food,population,armySize,goal,levy=1}){
 const target=Math.min(850,Math.max(170,Math.round(100+population*.32+(['conquer','defend'].includes(goal)?180:0))));
 const reserve=goal==='recover'?300:180;
 if(!Number.isFinite(treasury)||food<0||treasury<=reserve+35||armySize>=target)return null;
 const desired=Math.max(1,Math.round(35*Math.max(.2,levy)));
 const count=Math.min(target-armySize,desired,Math.floor((treasury-reserve)*35/120));
 if(count<1)return null;
 return {count,cost:Math.ceil(count*120/35),target};
}
export function nearestOwnedRoute(world,start,targets,canEnter){
 const byId=new Map(world.provinces.map(p=>[p.id,p])),goals=new Set(targets),queue=[start],prev=new Map([[start,null]]);
 for(let i=0;i<queue.length;i++){const id=queue[i];if(goals.has(id)){const route=[];for(let n=id;n!==null;n=prev.get(n))route.push(n);return route.reverse();}for(const next of (byId.get(id)?.neighbors||[]).slice().sort()){if(!prev.has(next)&&canEnter(next)){prev.set(next,id);queue.push(next);}}}return null;
}
export function allocateTroops(total,mix){const n=Math.max(0,Math.round(total)||0),sum=mix.reduce((s,v)=>s+Math.max(0,v),0)||1,raw=mix.map(v=>n*Math.max(0,v)/sum),out=raw.map(Math.floor);let left=n-out.reduce((s,v)=>s+v,0);const ranked=raw.map((v,i)=>({i,frac:v-out[i]})).sort((a,b)=>b.frac-a.frac||a.i-b.i);for(let j=0;j<left;j++)out[ranked[j%ranked.length].i]++;return out;}
