// Special institutional procedures for centralized crowns and confederations.
// These act on existing offices, local trust and holding loyalty, not ownership.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const type=(g,r)=>g.civic?.realms[r]?.government;
const owns=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
const adult=(g,r,id)=>{const p=g.politics.people[id];return p?.alive&&p.age>=18&&p.realm===r&&!isImprisoned(g,id)&&p.id!==g.politics.realms[r]?.ruler?p:null;};
function state(g,r,create=false){
 const s=g.institutions?.realms[r],k=type(g,r);if(!s||!['centralized','confederation'].includes(k))return null;
 if(s.procedures?.kind===k)return s.procedures;
 return create?(s.procedures={kind:k,report:null,assembly:null,last:-120,history:[]}):null;
}
function note(g,r,s,message){
 s.history.unshift({turn:g.turn,message});s.history=s.history.slice(0,24);
 g.institutions.history.unshift({realm:r,turn:g.turn,message});g.institutions.history=g.institutions.history.slice(0,120);
 if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}
}
function inspector(g,r,id){const office=g.institutions.realms[r]?.offices[id];return owns(g,r,id)&&office?adult(g,r,office.person):null;}
function validReport(g,r,x){return x&&inspector(g,r,x.province)?.id===x.person;}
export function crownInspectionView(g,r){
 if(type(g,r)!=='centralized')return null;const s=state(g,r),f=g.factions[r];
 const wait=Math.max(0,6-g.turn+(s?.last??-120)),report=validReport(g,r,s?.report)?s.report:null;
 const targets=Object.keys(g.institutions.realms[r]?.offices||{}).map(id=>({id,p:inspector(g,r,id)})).filter(x=>x.p).map(({id,p})=>({id,person:p.id,skill:p.skills.stewardship,unrest:g.provinces[id].unrest??0}));
 return {report,targets,wait,canStart:!report&&!wait&&f.treasury>=70&&targets.length>0,canFund:report?.status==='ready'&&f.treasury>=100,last:s?.history[0]||null};
}
function confederates(g,r,land){
 const members=new Map();
 for(const p of land){const h=g.politics.holdings[p.id],lord=adult(g,r,h?.lord);if(h?.realm!==r||!lord)continue;
  let x=members.get(lord.id);if(!x){x={id:lord.id,name:lord.name||lord.id,land:0,loyalty:0,provinces:[]};members.set(lord.id,x);}
  x.land++;x.loyalty+=h.loyalty??50;x.provinces.push(p.id);
 }
 return [...members.values()].map(x=>({...x,loyalty:Math.round(x.loyalty/x.land)})).sort((a,b)=>b.land-a.land||a.id.localeCompare(b.id));
}
export function memberAssemblyView(g,r,land){
 if(type(g,r)!=='confederation')return null;const s=state(g,r),f=g.factions[r];
 const controlled=land||Object.values(g.provinces).filter(p=>owns(g,r,p.id)),members=confederates(g,r,controlled);
 const proposed=s?.assembly,wait=Math.max(0,12-g.turn+(s?.last??-120));
 const support=members.filter(x=>x.loyalty>=55).length,total=members.length;
 return {members,support,total,assembly:proposed,wait,canStart:!proposed&&!wait&&total>=2&&f.treasury>=100,last:s?.history[0]||null};
}
export function procedureAction(g,r,cmd,id){
 const f=g.factions[r];
 if(type(g,r)==='centralized'){
  const v=crownInspectionView(g,r),s=state(g,r,true);
  if(cmd==='crown:inspect'){
   const target=v.targets.find(x=>x.id===id);if(!v.canStart||!target)return no('Requires an appointed free inspector, 70 gold and no outstanding report.');
   f.treasury-=70;s.report={province:id,person:target.person,status:'investigating',ends:g.turn+3};s.last=g.turn;
   note(g,r,s,'A royal inspection began in '+id+'.');return ok('Inspection begun.');
  }
  if(!v.report||v.report.status!=='ready')return no('No completed inspection report.');
  const x=v.report,p=g.provinces[x.province],h=g.politics.holdings[x.province];
  if(cmd==='crown:fund'){
   if(!v.canFund)return no('Implementing the report requires 100 gold.');
   f.treasury-=100;if(Number.isFinite(p.unrest))p.unrest=cap(p.unrest-x.relief,0,100);
   if(h?.realm===r)h.loyalty=cap(h.loyalty+5,0,100);
   note(g,r,s,'Royal inspection recommendations were implemented in '+x.province+'.');
  }else if(cmd==='crown:dismiss'){
   if(h?.realm===r)h.loyalty=cap(h.loyalty-4,0,100);
   note(g,r,s,'The crown declined the inspection recommendations for '+x.province+'.');
  }else return no('Unknown inspection action.');
  s.report=null;return ok('Inspection resolved.');
 }
 if(type(g,r)==='confederation'&&cmd==='confed:assembly'){
  const v=memberAssemblyView(g,r);if(!v.canStart)return no('Requires two free member chiefs, 100 gold and a yearly interval.');
  const s=state(g,r,true);f.treasury-=100;s.assembly={ends:g.turn+3};s.last=g.turn;note(g,r,s,'A member assembly was called to vote on a common relief fund.');return ok('Member assembly convened.');
 }
 return no('This procedure does not belong to the current government.');
}
export function tickInstitutionProcedures(g,r,land){
 const k=type(g,r);if(!['centralized','confederation'].includes(k))return;const s=state(g,r),f=g.factions[r];
 if(k==='centralized'&&s?.report){
  const x=s.report,p=validReport(g,r,x)&&inspector(g,r,x.province);
  if(!p){s.report=null;note(g,r,s,'The royal inspection was cancelled after loss of the office or territory.');}
  else if(x.status==='investigating'&&g.turn>=x.ends){
   x.status='ready';x.relief=5+(p.skills?.stewardship??1)*2;x.expires=g.turn+6;
   note(g,r,s,'A royal inspection report is ready for a funding decision.');
  }else if(x.status==='ready'&&g.turn>=x.expires){procedureAction(g,r,'crown:dismiss');}
  if(r!==g.player&&s.report?.status==='ready')procedureAction(g,r,f.treasury>=500?'crown:fund':'crown:dismiss');
 }
 if(k==='confederation'&&s?.assembly&&g.turn>=s.assembly.ends){
  const v=memberAssemblyView(g,r,land),passed=v.total>=2&&v.support*2>v.total;
  if(passed){for(const m of v.members.filter(m=>m.loyalty>=55))for(const id of m.provinces){
    const h=g.politics.holdings[id],p=g.provinces[id];h.loyalty=cap(h.loyalty+6,0,100);
    if(Number.isFinite(p.unrest))p.unrest=cap(p.unrest-5,0,100);
   }
   if(Number.isFinite(f.stability))f.stability=cap(f.stability+3,0,100);
  }
  note(g,r,s,'Member relief fund '+(passed?'approved':'rejected')+' by '+v.support+' of '+v.total+' member chiefs.');s.assembly=null;
 }
 if(r===g.player||g.turn<12||g.turn%12!==0||f.treasury<800)return;
 if(k==='centralized'){
  const v=crownInspectionView(g,r),target=v.targets.filter(x=>x.unrest>=20).sort((a,b)=>b.unrest-a.unrest||a.id.localeCompare(b.id))[0];
  if(v.canStart&&target)procedureAction(g,r,'crown:inspect',target.id);
 }else{
  const v=memberAssemblyView(g,r,land);if(v.canStart&&v.support*2>v.total&&(f.stability??100)<80)procedureAction(g,r,'confed:assembly');
 }
}
