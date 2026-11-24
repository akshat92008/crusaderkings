// Field roster arithmetic, independent of rendering and campaign mutation.
export const TROOP_TYPES=['infantry','archers','cavalry'];
export function participatingArmies(g,ids,realm,province=null){return [...new Set(ids.filter(Boolean))].map(id=>g.armies[id]).filter(a=>a&&a.owner===realm&&(!province||a.province===province)&&!g.naval?.voyages?.[a.id]);}
export function aggregateForce(armies,garrison={}){const primary=armies[0]||{};return {...primary,...Object.fromEntries(TROOP_TYPES.map(t=>[t,Math.max(0,garrison[t]||0)+armies.reduce((n,a)=>n+Math.max(0,a[t]||0),0)]))};}
export function regimentTroops(army,slots,index){const t=slots[index],count=slots.filter(x=>x===t).length,rank=slots.slice(0,index).filter(x=>x===t).length,n=Math.max(0,Math.round(army[t]||0));return Math.floor(n/count)+(rank<n%count?1:0);}
export function applyFieldLosses(army,result,side,fallback){
 applyFieldForceLosses([army],result,side,fallback);
 return army;
}

// Round once for each troop type across the participating armies, then allocate
// integer survivors proportionally. Splitting a force into small armies cannot
// change how many soldiers survive.
export function applyFieldForceLosses(armies,result,side,fallback){
 const byType=result.fieldBattle&&result.roster?.[side]?.byType;
 for(const type of TROOP_TYPES){
  const units=armies.map((army,index)=>({army,index,count:Math.max(0,army[type]||0)}));
  const total=units.reduce((sum,unit)=>sum+unit.count,0);
  if(!total){
   for(const unit of units)unit.army[type]=0;
   continue;
  }

  const report=byType?.[type];
  const ratio=report?.initial>0&&Number.isFinite(report.surviving)?report.surviving/report.initial:fallback;
  const survivors=Math.round(total*Math.max(0,Math.min(1,Number.isFinite(ratio)?ratio:0)));
  let assigned=0;
  for(const unit of units){
   const share=unit.count*survivors/total;
   unit.army[type]=Math.floor(share);
   unit.remainder=share-unit.army[type];
   assigned+=unit.army[type];
  }
  units.sort((a,b)=>b.remainder-a.remainder||String(a.army.id??'').localeCompare(String(b.army.id??''))||a.index-b.index);
  for(let i=0;i<survivors-assigned;i++)units[i].army[type]++;
 }
}

// Readiness and specialist bonuses are weighted by the soldiers who actually deploy.
export function combinedFieldStats(armies,garrison,readiness,profile,type){const field=armies.map(a=>({n:Math.max(0,a[type]||0),r:readiness(a),p:profile(a,type)})).filter(x=>x.n>0),reserve=Math.max(0,garrison?.[type]||0),total=field.reduce((n,x)=>n+x.n,reserve),baseR={power:1,speed:1,morale:75},baseP={damage:1,armor:1,speed:1,range:1,counter:1};const mix=(key,base,kind)=>total?(reserve*base+field.reduce((n,x)=>n+x.n*(Number.isFinite(x[kind]?.[key])?x[kind][key]:base),0))/total:base;const r=Object.fromEntries(Object.entries(baseR).map(([k,v])=>[k,mix(k,v,'r')])),p=Object.fromEntries(Object.entries(baseP).map(([k,v])=>[k,mix(k,v,'p')]));p.name=field.slice().sort((a,b)=>b.n-a.n)[0]?.p?.name||type;return {readiness:r,profile:p};}
