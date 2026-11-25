// Dynastic ties, polygamy/concubinage cultural profiles, and inherited territorial claims.
import {capitalDistrict} from './historical-world.js';

const num=n=>Number.isFinite(n)?n:0,pair=(a,b)=>[a,b].sort().join('|'),alive=(g,id)=>{const p=g.politics?.people?.[id];return p?.alive?p:null;};
const war=(g,a,b)=>Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&pair(w.attacker,w.defender)===pair(a,b));
const land=(g,r)=>Object.values(g.provinces||{}).some(p=>p.owner===r);

export const MARRIAGE_POLICIES={open:'Open marriage',same_faith:'Same-faith marriage',indissoluble:'Marriage cannot be dissolved'};
export const WEDDING_CONTRACTS={
 paternal:{name:'Paternal-house wedding',lineage:'paternal',settlement:0},
 maternal:{name:'Maternal-house wedding',lineage:'maternal',settlement:0},
 paternal_settlement:{name:'Paternal-house wedding with settlement',lineage:'paternal',settlement:100},
 maternal_settlement:{name:'Maternal-house wedding with settlement',lineage:'maternal',settlement:100}
};

export function polygamyProfile(g,realm){
 const civic=g.civic?.realms?.[realm];
 const faith=String(civic?.faith||'').toLowerCase(),gov=String(civic?.government||'').toLowerCase();
 if(faith.includes('islam')||faith.includes('sunni')||gov==='sultanate')return {mode:'polygamy',maxSpouses:4,maxConcubines:0};
 if(gov==='steppe'||gov==='kinship'||faith.includes('hindu')||faith.includes('buddh')||faith.includes('confucian')||faith.includes('ritual')||faith.includes('kami')||faith.includes('spiritual'))return {mode:'concubinage',maxSpouses:1,maxConcubines:3};
 return {mode:'monogamous',maxSpouses:1,maxConcubines:0};
}

export function allSpouses(g,p){
 if(!p)return [];
 const ids=[...new Set([p.spouse,...(p.spouses||[])].filter(Boolean))];
 return ids.map(id=>alive(g,id)).filter(Boolean);
}

export function marriagePolicy(g,realm){const key=g.politics?.realms?.[realm]?.marriagePolicy;return Object.hasOwn(MARRIAGE_POLICIES,key)?key:'open';}
export function faithPermitsMarriage(g,a,b){
 if(!a||!b)return false;
 if(![a.realm,b.realm].some(r=>marriagePolicy(g,r)==='same_faith'))return true;
 const faith=p=>p.civic?.faith??g.civic?.realms?.[p.realm]?.faith;
 return Boolean(faith(a)&&faith(a)===faith(b));
}
export function marriageContract(g,id){
 const p=g.politics?.people?.[id],q=g.politics?.people?.[p?.spouse];
 if(!p?.alive||!q?.alive||q.spouse!==id)return null;
 return (g.politics.marriages||[]).slice().reverse().find(m=>!m.ended&&((m.a===id&&m.b===q.id)||(m.b===id&&m.a===q.id)))??{a:id,b:q.id,lineage:p.marriageLineage||'paternal',settlement:0};
}
export function divorceTerms(g,id){
 const p=g.politics?.people?.[id],q=g.politics?.people?.[p?.spouse],contract=marriageContract(g,id);
 if(!contract)return null;
 const forbidden=[p.realm,q.realm].some(r=>marriagePolicy(g,r)==='indissoluble');
 return {contract,spouse:q.id,cost:120,prestige:15,legitimacy:5,reason:forbidden?'A marriage charter forbids dissolution.':''};
}
export function marriageTerms(g,a,b){
 if(!a||!b)return {accepted:false,score:0,reasons:['Missing character']};
 if(!faithPermitsMarriage(g,a,b))return {accepted:false,score:0,reasons:['A court marriage charter requires the same faith']};
 if(a.realm===b.realm)return {accepted:true,score:100,reasons:['Domestic marriage']};
 const f=g.factions[a.realm],o=g.factions[b.realm];
 if(!f||!o||!land(g,a.realm)||!land(g,b.realm))return {accepted:false,score:0,reasons:['Both realms must have land']};
 const forward=num(f.relations?.[b.realm]),reverse=num(o.relations?.[a.realm]),faith=a.civic?.faith&&a.civic.faith===b.civic?.faith,score=Math.round(35+forward*.55+reverse*.30+(faith?8:0)+(a.traits?.includes('generous')?3:0));
 const reasons=['Relations '+forward+' / '+reverse];
 if(war(g,a.realm,b.realm))reasons.push('Active war');
 if(forward<20)reasons.push('Requires at least +20 relations');
 if(reverse<-30)reasons.push('Foreign court hostile');
 return {accepted:!war(g,a.realm,b.realm)&&forward>=20&&reverse>=-30&&score>=35,score,reasons};
}
export function activeMarriageLinks(g,a,b){
 const out=[];
 for(const p of Object.values(g.politics?.people||{})){
  if(!p.alive||p.realm!==a)continue;
  for(const q of allSpouses(g,p)){
   if(q.realm===b&&(q.spouse===p.id||(q.spouses||[]).includes(p.id)))out.push({a:p.id,b:q.id});
  }
 }
 return out;
}
export function reconcileMarriageTreaties(g){
 const active=new Set();
 for(const p of Object.values(g.politics?.people||{})){
  if(!p.alive)continue;
  for(const q of allSpouses(g,p)){
   if((q.spouse===p.id||(q.spouses||[]).includes(p.id))&&q.realm!==p.realm)active.add(pair(p.realm,q.realm));
  }
 }
 for(const [realm,f] of Object.entries(g.factions)){
  for(const [other,type] of Object.entries(f.treaties||{})){
   if(type==='marriage'&&!active.has(pair(realm,other)))delete f.treaties[other];
  }
 }
}
export function inheritedClaims(g,a,b,realm){
 return [...new Set([...(a.claims||[]),...(b.claims||[]),a.realm,b.realm])].filter(r=>r!==realm&&g.politics.realms[r]).slice(0,8);
}
export function inheritedClaimDetails(g,a,b,realm){
 return inheritedClaims(g,a,b,realm).map(r=>({realm:r,strength:'weak',titleId:'k:'+r}));
}
export function dynasticClaimOptions(g,world,r){
 const out=[],seats=new Map();
 for(const p of Object.values(g.politics?.people||{})){
  if(!p.alive||p.realm!==r||p.age<18||g.feudal?.prisoners?.[p.id]?.status==='held')continue;
  for(const foreign of new Set(p.claims||[])){
   if(foreign===r||!g.politics.realms[foreign]||!land(g,foreign))continue;
   if(!seats.has(foreign)){
    const owned=world.provinces.filter(q=>g.provinces[q.id]?.owner===foreign);
    const seat=owned[0]?.geometry&&world.factions.find(f=>f.id===foreign)?.capital?capitalDistrict(world,foreign,g.provinces)?.id:owned[0]?.id;
    seats.set(foreign,seat);
   }
   const province=seats.get(foreign);
   if(province)out.push({person:p.id,foreign,province,existing:(g.conflict?.claims?.[r+':'+province]?.expires||0)>g.turn});
  }
 }
 return out.sort((a,b)=>a.foreign.localeCompare(b.foreign)||a.person.localeCompare(b.person));
}
export function claimDynasticSeat(g,world,r,person,province){
 const f=g.factions[r],option=dynasticClaimOptions(g,world,r).find(x=>x.person===person&&x.province===province&&!x.existing);
 if(!option||!f||f.treasury<60||!g.conflict)return {ok:false,msg:'Requires a living adult dynastic claimant, an unclaimed foreign seat and 60 gold.'};
 f.treasury-=60;
 g.conflict.claims[r+':'+province]={realm:r,province,source:'dynastic',claimant:person,foreign:option.foreign,expires:g.turn+180};
 return {ok:true,msg:'Dynastic territorial claim recognized. Enforce it by formal war after any alliance or truce ends.'};
}
export function validDynasticClaim(g,c){
 return c?.source!=='dynastic'||(alive(g,c.claimant)?.realm===c.realm&&g.provinces[c.province]?.owner===c.foreign&&(alive(g,c.claimant)?.claims||[]).includes(c.foreign));
}
