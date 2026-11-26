import {humanControlsRealm} from './player-career.js';
// Regional political institutions. Existing province, lord and civic records remain authoritative.
// These are alternate-history gameplay abstractions, not a uniform account of historical societies.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const type=(g,r)=>g.civic?.realms[r]?.government;
const owned=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
const adult=(g,r,id)=>{const p=g.politics.people[id];return p?.alive&&p.age>=18&&p.realm===r&&p.id!==g.politics.realms[r]?.ruler&&!isImprisoned(g,id)?p:null;};
const supported=['regional','sultanate','shogunate'];
function state(g,r,create=false){
 const s=g.institutions?.realms[r];if(!s||!supported.includes(type(g,r)))return null;
 if(s.regionalPolitics?.type===type(g,r)){if(type(g,r)==='sultanate')s.regionalPolitics.decadence??=20;return s.regionalPolitics;}
 return create?(s.regionalPolitics={type:type(g,r),grants:{},scholar:null,mediation:null,decadence:20,last:-120,history:[]}):null;
}
function holdings(g,r,land){
 return land.map(p=>({id:p.id,h:g.politics.holdings[p.id]})).filter(({h})=>h?.realm===r&&adult(g,r,h.lord));
}
function note(g,r,s,message){
 s.history.unshift({turn:g.turn,message});s.history=s.history.slice(0,24);
 g.institutions.history??=[];
 g.institutions.history.unshift({realm:r,turn:g.turn,message});g.institutions.history=g.institutions.history.slice(0,120);
 if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}
}
function validGrant(g,r,id,x){
 return x&&x.until>g.turn&&owned(g,r,id)&&g.politics.holdings[id]?.realm===r&&g.politics.holdings[id].lord===x.lord&&adult(g,r,x.lord);
}
export function regionalPoliticalView(g,r,providedLand){
 const k=type(g,r);if(!supported.includes(k))return null;
 const s=state(g,r),f=g.factions[r],land=providedLand||Object.values(g.provinces).filter(p=>owned(g,r,p.id)),hs=holdings(g,r,land);
 const wait=Math.max(0,6-g.turn+(s?.last??-120)),last=s?.history[0]||null;
 if(k==='regional'){
  const grants=Object.entries(s?.grants||{}).filter(([id,x])=>validGrant(g,r,id,x)).map(([id,x])=>({id,...x}));
  const occupied=new Set(grants.map(x=>x.id));
  const candidates=hs.filter(({id})=>!occupied.has(id)&&g.civic?.provinces[id]).map(({id,h})=>({id,lord:h.lord,loyalty:h.loyalty,trust:g.civic.provinces[id].localTrust}));
  return {kind:k,grants,candidates,wait,last,cost:130,canAct:!wait&&f.treasury>=130&&candidates.length>0};
 }
 if(k==='sultanate'){
  const sponsor=s?.scholar,faith=g.civic.realms[r].faith,person=sponsor&&adult(g,r,sponsor.person),scholar=sponsor&&sponsor.until>g.turn&&sponsor.faith===faith&&person&&(!person.civic?.faith||person.civic.faith===faith)?person:null;
  const candidates=Object.values(g.politics.people).filter(p=>adult(g,r,p.id)&&(p.skills?.learning??0)>=3&&(!p.civic?.faith||p.civic.faith===faith)).map(p=>({id:p.id,name:p.name||p.id,learning:p.skills.learning})).sort((a,b)=>b.learning-a.learning||a.id.localeCompare(b.id));
  const decadence=s?.decadence??20;
  return {kind:k,decadence,scholar:scholar?{...sponsor,name:scholar.name||scholar.id,learning:scholar.skills.learning}:null,candidates,wait,last,cost:120,canReform:!wait&&f.treasury>=100&&decadence>10,canAct:!wait&&f.treasury>=120&&!scholar&&land.length>0&&candidates.length>0};
 }
 const houses=new Map(),retainers=g.institutions?.realms[r]?.retainers||{};
 for(const {h} of hs){const p=adult(g,r,h.lord),house=p.house||p.id;
  let x=houses.get(house);if(!x){x={house,land:0,power:0,loyalty:0,lords:[]};houses.set(house,x);}
  x.land++;x.loyalty+=h.loyalty??50;if(!x.lords.includes(p.id)){x.lords.push(p.id);x.power+=retainers[p.id]?.level||0;}
 }
 const rivals=[...houses.values()].map(h=>({...h,loyalty:Math.round(h.loyalty/h.land),power:h.power+h.land})).sort((a,b)=>b.power-a.power||a.house.localeCompare(b.house));
 const pair=rivals.slice(0,2),tension=pair.length===2?clamp(Math.round((100-pair[0].loyalty+100-pair[1].loyalty)/2+Math.min(pair[0].power,pair[1].power)*5),0,100):0;
 const mediation=s?.mediation?.until>g.turn?s.mediation:null;
 return {kind:k,rivals,pair,tension,mediation,wait,last,cost:150,canAct:!wait&&f.treasury>=150&&pair.length===2&&!mediation&&tension>=35};
}
export function regionalPoliticalModifiers(g,r,land){
 const s=state(g,r),out={tax:1,levy:1,trade:1};if(!s)return out;
 if(s.type==='regional'&&land.length){const n=Object.entries(s.grants).filter(([id,x])=>validGrant(g,r,id,x)).length;out.tax-=.12*n/land.length;out.levy+=.08*n/land.length;}
 if(s.type==='sultanate'){const d=s.decadence??20;if(d>=50){out.tax-=Math.min(.25,(d-45)*.004);out.levy-=Math.min(.20,(d-45)*.003);}else if(d<=12){out.tax+=.04;out.levy+=.04;}}
 return out;
}
export function regionalPoliticalAction(g,r,cmd,id){
 const v=regionalPoliticalView(g,r);if(!v)return no('Political action is unavailable.');
 const f=g.factions[r],s=state(g,r,true);
 if(cmd==='sultanate:reform'&&v.kind==='sultanate'){
  if(!v.canReform)return no('Requires 100 gold, decadence above 10 and cooldown elapsed.');
  f.treasury-=100;s.decadence=clamp((s.decadence??20)-20,0,100);s.last=g.turn;
  const head=g.politics.people[g.politics.realms[r]?.ruler];if(head)head.piety=(head.piety||0)+8;
  for(const a of Object.values(g.armies||{}))if(a.owner===r)a.morale=clamp(a.morale+5,0,100);
  note(g,r,s,'Dynastic household austerity reduced sultanate decadence.');return ok('Sultanate decadence reformed.');
 }
 if(!v.canAct)return no('Political action is unavailable: check the treasury, eligible participants, cooldown and active arrangements.');
 if(cmd==='regional:grant'&&v.kind==='regional'){
  const p=v.candidates.find(p=>p.id===id);if(!p)return no('Choose a controlled chiefdom with no current grant.');
  s.grants[id]={lord:p.lord,until:g.turn+48};const h=g.politics.holdings[id];h.loyalty=clamp(h.loyalty+12,0,100);
  const local=g.civic.provinces[id];local.localTrust=clamp(local.localTrust+8,0,100);
  note(g,r,s,'A four-year institutional land grant was negotiated with '+(g.politics.people[p.lord].name||p.lord)+'.');
 }else if(cmd==='sultanate:scholar'&&v.kind==='sultanate'){
  const p=v.candidates.find(p=>p.id===id);if(!p)return no('Choose a qualified free scholar of the court faith.');
  s.scholar={person:p.id,until:g.turn+24,faith:g.civic.realms[r].faith};
  const scholar=g.politics.people[p.id];scholar.wealth=(scholar.wealth||0)+60;
  note(g,r,s,'The court commissioned '+p.name+' to advise on scholarly patronage and public legitimacy.');
 }else if(cmd==='shogunate:mediate'&&v.kind==='shogunate'){
  s.mediation={houses:v.pair.map(h=>h.house),until:g.turn+18};
  for(const [id,h] of Object.entries(g.politics.holdings)){const p=adult(g,r,h.lord);if(h.realm===r&&owned(g,r,id)&&p&&v.pair.some(x=>x.house===(p.house||p.id)))h.loyalty=clamp(h.loyalty+10,0,100);}
  note(g,r,s,'The shogunal court negotiated an eighteen-month accord between '+v.pair.map(h=>h.house).join(' and ')+'.');
 }else return no('This action does not belong to the current government.');
 f.treasury-=v.cost;s.last=g.turn;return ok('Institutional agreement concluded.');
}
export function tickRegionalPolitics(g,r,land){
 const k=type(g,r);if(!supported.includes(k))return;
 const f=g.factions[r],s=state(g,r,true);
 if(s&&k==='regional'){
  for(const [id,x] of Object.entries(s.grants)){
   if(!validGrant(g,r,id,x)){delete s.grants[id];continue;}
   if(g.turn%3===0){const l=g.civic.provinces[id];if(l)l.localTrust=clamp(l.localTrust+2,0,100);const p=g.provinces[id];if(Number.isFinite(p.unrest))p.unrest=clamp(p.unrest-2,0,100);}
  }
 }
 if(s?.scholar&&k==='sultanate'){
  const x=s.scholar,p=adult(g,r,x.person);
  if(!p||x.until<=g.turn||x.faith!==g.civic.realms[r].faith||(p.civic?.faith&&p.civic.faith!==x.faith)){s.scholar=null;}
  else if(g.turn%3===0){
   if(f.treasury<12){s.scholar=null;note(g,r,s,'The scholarly commission ended because the treasury could not pay its stipend.');}
   else{f.treasury-=12;p.wealth=(p.wealth||0)+12;
    const c=g.civic.realms[r],i=g.identity?.realms[r];if(Number.isFinite(c.patronage))c.patronage=clamp(c.patronage+2,0,100);
    if(i&&Number.isFinite(i.faithAuthority))i.faithAuthority=clamp(i.faithAuthority+1,0,100);
    if(Number.isFinite(f.legitimacy))f.legitimacy=clamp(f.legitimacy+1,0,100);
   }
  }
 }
 if(s&&k==='sultanate'&&g.turn>0&&g.turn%6===0){
  const head=g.politics.people[g.politics.realms[r]?.ruler],piety=head?.piety??30;
  const delta=(s.scholar||piety>=45?-2:0)+(piety<25?2:1);
  s.decadence=clamp((s.decadence??20)+delta,0,100);
  if(s.decadence>=75&&(g.turn-(s.lastDecadenceCrisis??-120))>=24){
   s.lastDecadenceCrisis=g.turn;
   s.decadence=clamp(s.decadence-12,0,100);
   f.stability=clamp((f.stability??50)-12,0,100);
   for(const h of Object.values(g.politics?.holdings||{}))if(h.realm===r)h.loyalty=clamp((h.loyalty??50)-8,0,100);
   for(const p of land.slice(0,2))if(Number.isFinite(p.unrest))p.unrest=clamp(p.unrest+12,0,100);
   note(g,r,s,'Dynastic decadence sparked a frontier zealot revolt (-12 stability, +12 unrest).');
  }
 }
 if(k==='shogunate'&&g.turn>0&&g.turn%6===0){
  const v=regionalPoliticalView(g,r,land);
  const protectedPair=v.mediation&&v.pair.every(h=>v.mediation.houses.includes(h.house));
  if(v.tension>=75&&!protectedPair){
   const c=g.civic.realms[r];if(Number.isFinite(c.authority))c.authority=clamp(c.authority-2,0,100);
   for(const {id,h} of holdings(g,r,land)){const p=adult(g,r,h.lord);if(v.pair.some(x=>x.house===(p.house||p.id))&&Number.isFinite(g.provinces[id].unrest))g.provinces[id].unrest=clamp(g.provinces[id].unrest+3,0,100);}
   note(g,r,state(g,r,true),'Competing military houses challenged the shogunal court; local unrest increased.');
  }
 }
 if(humanControlsRealm(g,r)||g.turn<12||g.turn%12!==0||f.treasury<800)return;
 const v=regionalPoliticalView(g,r,land);
 if(k==='sultanate'&&v?.canReform&&v.decadence>=45){regionalPoliticalAction(g,r,'sultanate:reform');return;}
 if(!v.canAct)return;
 if(k==='regional'){const p=v.candidates.slice().sort((a,b)=>a.loyalty-b.loyalty||a.id.localeCompare(b.id))[0];if(p&&p.loyalty<65)regionalPoliticalAction(g,r,'regional:grant',p.id);}
 if(k==='sultanate'&&(g.civic.realms[r].patronage??50)<75)regionalPoliticalAction(g,r,'sultanate:scholar',v.candidates[0].id);
 if(k==='shogunate'&&v.tension>=60)regionalPoliticalAction(g,r,'shogunate:mediate');
}
