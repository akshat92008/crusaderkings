// Civilian safe conduct is deliberately separate from military passage.
export function civilianAccess(g,realm,host){
 if(realm===host)return true;
 if(!g.factions[realm]||!g.factions[host])return false;
 const a=g.factions[realm],b=g.factions[host],key=[realm,host].sort().join('|');
 return (g.diplomacy?.pacts?.[key]?.until??0)>g.turn&&(a.relations?.[host]??0)>=20&&(b.relations?.[realm]??0)>=20&&!Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(realm)&&[w.attacker,w.defender].includes(host));
}
export function journeyDistrict(g,realm,id,foreign=false){
 const p=g.provinces[id];if(!p||!g.factions[p.owner])return false;
 const occupation=g.campaignWar?.occupations?.[id];if(occupation&&occupation.by!==p.owner)return false;
 return p.owner===realm||(foreign&&civilianAccess(g,realm,p.owner));
}
export function journeyRoutes(g,world,realm,foreign=false){
 const f=world.factions.find(f=>f.id===realm),land=world.provinces.filter(p=>journeyDistrict(g,realm,p.id,false));
 if(!f||!land.length)return new Map();
 const origin=land.slice().sort((a,b)=>((a.centroid[0]-f.capital[0])**2+(a.centroid[1]-f.capital[1])**2)-((b.centroid[0]-f.capital[0])**2+(b.centroid[1]-f.capital[1])**2)||a.id.localeCompare(b.id))[0].id;
 const access=new Map();for(const id of Object.keys(g.factions))access.set(id,id===realm||(foreign&&civilianAccess(g,realm,id)));
 const by=new Map(world.provinces.filter(p=>{const o=g.provinces[p.id]?.owner,x=g.campaignWar?.occupations?.[p.id];return access.get(o)&&(!x||x.by===o);}).map(p=>[p.id,p]));
 const parents=new Map([[origin,null]]),queue=[origin];
 for(let i=0;i<queue.length;i++){const id=queue[i];for(const n of by.get(id)?.neighbors||[]){if(!by.has(n)||parents.has(n))continue;parents.set(n,id);queue.push(n);}}
 const routes=new Map();for(const id of queue){const path=[];for(let n=id;n!==null;n=parents.get(n))path.push(n);routes.set(id,path.reverse());}return routes;
}
