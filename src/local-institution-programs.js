import {humanControlsRealm} from './player-career.js';
// Additional institutional choices; no independent economy, army or title records.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const kind=(g,r)=>g.civic?.realms[r]?.government;
const own=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
const adult=(g,r,id)=>{const p=g.politics.people[id];return p?.alive&&p.age>=18&&p.realm===r&&p.id!==g.politics.realms[r]?.ruler&&!isImprisoned(g,id)?p:null;};
const supported=['military','city','kinship'];
function state(g,r,create=false){
 const s=g.institutions?.realms[r],k=kind(g,r);if(!s||!supported.includes(k))return null;
 if(s.localPrograms?.kind===k)return s.localPrograms;
 return create?(s.localPrograms={kind:k,active:null,last:-120,history:[]}):null;
}
function note(g,r,s,message){
 s.history.unshift({turn:g.turn,message});s.history=s.history.slice(0,20);
 g.institutions.history.unshift({realm:r,turn:g.turn,message});g.institutions.history=g.institutions.history.slice(0,120);
 if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}
}
function valid(g,r,x){
 if(!x||!own(g,r,x.province))return false;
 if(x.person){const h=g.politics.holdings[x.province];return h?.realm===r&&h.lord===x.person&&!!adult(g,r,x.person);}
 return true;
}
export function localProgramView(g,r,land){
 const k=kind(g,r);if(!supported.includes(k))return null;
 const i=g.institutions?.realms[r],s=state(g,r),f=g.factions[r];
 const controlled=land||Object.values(g.provinces).filter(p=>own(g,r,p.id));
 const active=valid(g,r,s?.active)?s.active:null,wait=Math.max(0,12-g.turn+(s?.last??-120));
 const targets=controlled.map(p=>{const h=g.politics.holdings[p.id],l=g.civic?.provinces?.[p.id],lord=adult(g,r,h?.lord);
  if(k==='military')return lord&&h.realm===r&&i.retainers[lord.id]?.level?{id:p.id,person:lord.id,loyalty:h.loyalty,level:i.retainers[lord.id].level}:null;
  if(!l)return null;
  return {id:p.id,trust:l.localTrust??50,unrest:p.unrest??0};
 }).filter(Boolean);
 const cost=k==='military'?100:k==='city'?160:0;
 return {kind:k,active,targets,cost,wait,last:s?.history[0]||null,canStart:!active&&!wait&&targets.length>0&&f.treasury>=cost&&(k!=='kinship'||i.reserves>=30)};
}
export function localProgramAction(g,r,cmd,id){
 const v=localProgramView(g,r);if(!v?.canStart)return no('Requires an eligible province, sufficient resources and no active program.');
 const expected={military:'military:commission',city:'city:works',kinship:'kinship:relief'}[v.kind];if(cmd!==expected)return no('Program does not belong to this government.');
 const target=v.targets.find(t=>t.id===id);if(!target)return no('Choose a valid controlled province.');
 const s=state(g,r,true),i=g.institutions.realms[r],f=g.factions[r];f.treasury-=v.cost;
 const x={province:id,ends:g.turn+(v.kind==='city'?6:3)};
 if(v.kind==='military')x.person=target.person;
 if(v.kind==='kinship'){i.reserves-=30;x.food=30;}
 s.active=x;s.last=g.turn;note(g,r,s,({military:'Service commission',city:'Urban public works',kinship:'Community food allocation'}[v.kind])+' began in '+id+'.');return ok('Program started.');
}
export function tickLocalPrograms(g,r,land){
 const k=kind(g,r);if(!supported.includes(k))return;
 const s=state(g,r),f=g.factions[r],i=g.institutions.realms[r];
 if(s?.active){
  const x=s.active;if(!valid(g,r,x)){if(x.food)i.reserves=cap(i.reserves+x.food,0,120);s.active=null;note(g,r,s,'The institutional program was cancelled after loss of its eligible target.');}
  else if(g.turn>=x.ends){
   const p=g.provinces[x.province],l=g.civic?.provinces?.[x.province];
   if(k==='military'){const h=g.politics.holdings[x.province];h.loyalty=cap(h.loyalty+15,0,100);const person=adult(g,r,x.person);person.wealth=(person.wealth||0)+40;}
   if(k==='city'){if(l)l.localTrust=cap(l.localTrust+10,0,100);if(Number.isFinite(p.unrest))p.unrest=cap(p.unrest-8,0,100);}
   if(k==='kinship'){f.food+=x.food;if(l)l.localTrust=cap(l.localTrust+12,0,100);if(Number.isFinite(p.unrest))p.unrest=cap(p.unrest-6,0,100);}
   s.active=null;note(g,r,s,'The institutional program in '+x.province+' was completed.');
  }
 }
 if(humanControlsRealm(g,r)||g.turn<12||g.turn%12!==0||f.treasury<800)return;
 const v=localProgramView(g,r,land);if(!v.canStart)return;
 if(k==='military'){const target=v.targets.slice().sort((a,b)=>a.loyalty-b.loyalty||a.id.localeCompare(b.id))[0];if(target.loyalty<65)localProgramAction(g,r,'military:commission',target.id);}
 if(k==='city'){const target=v.targets.slice().sort((a,b)=>b.unrest-a.unrest||a.id.localeCompare(b.id))[0];if(target.unrest>=15||target.trust<55)localProgramAction(g,r,'city:works',target.id);}
 if(k==='kinship'){const target=v.targets.slice().sort((a,b)=>a.trust-b.trust||a.id.localeCompare(b.id))[0];if(f.food<80||target.trust<50)localProgramAction(g,r,'kinship:relief',target.id);}
}
