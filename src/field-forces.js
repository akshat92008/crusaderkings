// Field roster arithmetic, independent of rendering and campaign mutation.
export const TROOP_TYPES=['infantry','archers','cavalry'];
export function participatingArmies(g,ids,realm,province=null){return [...new Set(ids.filter(Boolean))].map(id=>g.armies[id]).filter(a=>a&&a.owner===realm&&(!province||a.province===province)&&!g.naval?.voyages?.[a.id]);}
export function aggregateForce(armies,garrison={}){const primary=armies[0]||{};return {...primary,...Object.fromEntries(TROOP_TYPES.map(t=>[t,Math.max(0,garrison[t]||0)+armies.reduce((n,a)=>n+Math.max(0,a[t]||0),0)]))};}
export function regimentTroops(army,slots,index){const t=slots[index],count=slots.filter(x=>x===t).length,rank=slots.slice(0,index).filter(x=>x===t).length,n=Math.max(0,Math.round(army[t]||0));return Math.floor(n/count)+(rank<n%count?1:0);}
export function applyFieldLosses(army,result,side,fallback){const by=result.fieldBattle&&result.roster?.[side]?.byType;for(const t of TROOP_TYPES){const b=by?.[t],r=b&&b.initial>0&&Number.isFinite(b.surviving)?b.surviving/b.initial:fallback;army[t]=Math.max(0,Math.round((army[t]||0)*Math.max(0,Math.min(1,Number.isFinite(r)?r:0))));}return army;}
