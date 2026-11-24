// Dynastic ties and inherited territorial claims, with no instant annexation.
import {capitalDistrict} from './historical-world.js';
const num=n=>Number.isFinite(n)?n:0,pair=(a,b)=>[a,b].sort().join('|'),alive=(g,id)=>{const p=g.politics?.people?.[id];return p?.alive?p:null;},war=(g,a,b)=>Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&pair(w.attacker,w.defender)===pair(a,b)),land=(g,r)=>Object.values(g.provinces||{}).some(p=>p.owner===r);
export function marriageTerms(g,a,b){if(!a||!b)return {accepted:false,score:0,reasons:['Missing character']};if(a.realm===b.realm)return {accepted:true,score:100,reasons:['Domestic marriage']};const f=g.factions[a.realm],o=g.factions[b.realm];if(!f||!o||!land(g,a.realm)||!land(g,b.realm))return {accepted:false,score:0,reasons:['Both realms must have land']};const forward=num(f.relations?.[b.realm]),reverse=num(o.relations?.[a.realm]),faith=a.civic?.faith&&a.civic.faith===b.civic?.faith,score=Math.round(35+forward*.55+reverse*.30+(faith?8:0)+(a.traits?.includes('generous')?3:0));const reasons=['Relations '+forward+' / '+reverse];if(war(g,a.realm,b.realm))reasons.push('Active war');if(forward<20)reasons.push('Requires at least +20 relations');if(reverse<-30)reasons.push('Foreign court hostile');return {accepted:!war(g,a.realm,b.realm)&&forward>=20&&reverse>=-30&&score>=35,score,reasons};}
export function activeMarriageLinks(g,a,b){return Object.values(g.politics?.people||{}).filter(p=>p.alive&&p.realm===a&&p.spouse&&alive(g,p.spouse)?.realm===b&&alive(g,p.spouse)?.spouse===p.id).map(p=>({a:p.id,b:p.spouse}));}
// A treaty is sustained by a reciprocal living spouse link between the
// current courts. Moving a spouse across realms must not preserve the old
// treaty indefinitely, and a new treaty still requires diplomatic consent.
export function reconcileMarriageTreaties(g){
 const active=new Set();
 for(const p of Object.values(g.politics?.people||{})){
  const q=alive(g,p.spouse);
  if(p.alive&&q&&q.spouse===p.id&&q.realm!==p.realm)active.add(pair(p.realm,q.realm));
 }
 for(const [realm,f] of Object.entries(g.factions)){
  for(const [other,type] of Object.entries(f.treaties||{})){
   if(type==='marriage'&&!active.has(pair(realm,other)))delete f.treaties[other];
  }
 }
}
export function inheritedClaims(g,a,b,realm){return [...new Set([...(a.claims||[]),...(b.claims||[]),a.realm,b.realm])].filter(r=>r!==realm&&g.politics.realms[r]).slice(0,8);}
export function dynasticClaimOptions(g,world,r){const out=[],seats=new Map();for(const p of Object.values(g.politics?.people||{})){if(!p.alive||p.realm!==r||p.age<18||g.feudal?.prisoners?.[p.id]?.status==='held')continue;for(const foreign of new Set(p.claims||[])){if(foreign===r||!g.politics.realms[foreign]||!land(g,foreign))continue;if(!seats.has(foreign)){const owned=world.provinces.filter(q=>g.provinces[q.id]?.owner===foreign);const seat=owned[0]?.geometry&&world.factions.find(f=>f.id===foreign)?.capital?capitalDistrict(world,foreign,g.provinces)?.id:owned[0]?.id;seats.set(foreign,seat);}const province=seats.get(foreign);if(province)out.push({person:p.id,foreign,province,existing:(g.conflict?.claims?.[r+':'+province]?.expires||0)>g.turn});}}return out.sort((a,b)=>a.foreign.localeCompare(b.foreign)||a.person.localeCompare(b.person));}
export function claimDynasticSeat(g,world,r,person,province){const f=g.factions[r],option=dynasticClaimOptions(g,world,r).find(x=>x.person===person&&x.province===province&&!x.existing);if(!option||!f||f.treasury<60||!g.conflict)return {ok:false,msg:'Requires a living adult dynastic claimant, an unclaimed foreign seat and 60 gold.'};f.treasury-=60;g.conflict.claims[r+':'+province]={realm:r,province,source:'dynastic',claimant:person,foreign:option.foreign,expires:g.turn+180};return {ok:true,msg:'Dynastic territorial claim recognized. Enforce it by formal war after any alliance or truce ends.'};}
export function validDynasticClaim(g,c){return c?.source!=='dynastic'||(alive(g,c.claimant)?.realm===c.realm&&g.provinces[c.province]?.owner===c.foreign&&(alive(g,c.claimant)?.claims||[]).includes(c.foreign));}
