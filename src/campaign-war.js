// Formal-war occupation: legal ownership remains unchanged until settlement.
// Unclaimed border raids retain legacy conquest for compatibility.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const own=(g,realm)=>Object.values(g.provinces).filter(p=>p.owner===realm);
export function initCampaignWar(g){return g.campaignWar??={version:1,occupations:{},history:[],lastTick:-1};}
export function controller(g,id){return g.campaignWar?.occupations[id]?.by||g.provinces[id]?.owner;}
export function occupation(g,id){return g.campaignWar?.occupations[id]||null;}
export function occupationTax(g,id){return occupation(g,id)?.by!==undefined?.35:1;}
export function captureProvince(g,war,realm,id,from){const p=g.provinces[id];if(!p)return false;const c=initCampaignWar(g),old=c.occupations[id];
 if(old&&old.by!==realm&&p.owner===realm){delete c.occupations[id];return true;}
 if(old&&old.by!==realm&&p.owner!==realm)return false;
 if(war?.status==='active'&&[war.attacker,war.defender].includes(p.owner)&&p.owner!==realm){c.occupations[id]={province:id,by:realm,owner:p.owner,war:war.id,from,started:g.turn};return true;}
 if(!old)p.owner=realm;return !old;
}
export function occupiedGoal(g,w){return g.provinces[w.goal]?.owner===w.attacker||occupation(g,w.goal)?.war===w.id&&controller(g,w.goal)===w.attacker;}
function retreat(g,realm,id,preferred){const fallback=preferred&&controller(g,preferred)===realm?preferred:own(g,realm).find(p=>controller(g,p.id)===realm)?.id;for(const a of Object.values(g.armies))if(a.owner===realm&&a.province===id){if(fallback)a.province=fallback;else delete g.armies[a.id];}}
export function settleOccupations(g,w,result){const c=initCampaignWar(g),ceded=[];
 for(const [id,o] of Object.entries(c.occupations)){if(o.war!==w.id)continue;const p=g.provinces[id];delete c.occupations[id];if(!p)continue;
 if(result==='claim enforced'&&id===w.goal&&o.by===w.attacker&&p.owner===w.defender){p.owner=w.attacker;p.unrest=cap(p.unrest+10,0,100);ceded.push(id);retreat(g,w.defender,id);}
 else retreat(g,o.by,id,o.from);
 }
 c.history.unshift({war:w.id,turn:g.turn,result,ceded});c.history=c.history.slice(0,100);return ceded;
}
export function tickCampaignWar(g){const c=initCampaignWar(g);if(c.lastTick===g.turn)return;c.lastTick=g.turn;for(const [id,o] of Object.entries(c.occupations)){const p=g.provinces[id],w=g.conflict?.wars[o.war];if(!p||p.owner!==o.owner||w?.status!=='active'){delete c.occupations[id];if(p&&p.owner!==o.by)retreat(g,o.by,id,o.from);continue;}p.unrest=cap(p.unrest+1,0,100);}}
