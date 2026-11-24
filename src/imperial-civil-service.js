import {humanControlsRealm} from './player-career.js';
// Imperial civil service: qualifications and appointments remain distinct from hereditary titles.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const imperial=(g,r)=>g.civic?.realms[r]?.government==='imperial';
const eligible=(g,r,p)=>p?.alive&&p.age>=18&&p.realm===r&&p.id!==g.politics.realms[r]?.ruler&&!isImprisoned(g,p.id);
const controlled=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
function state(g,r,create=false){
 const s=g.institutions?.realms[r];if(!s||!imperial(g,r))return null;
 return s.civilService||(create?(s.civilService={exams:{},history:[],lastExam:-120}):null);
}
function merit(p){return (p.skills?.stewardship??0)*12+(p.skills?.learning??0)*8;}
export function civilServiceView(g,r){
 if(!imperial(g,r))return null;
 const s=state(g,r),offices=g.institutions?.realms[r]?.offices||{};
 const candidates=Object.values(g.politics.people).filter(p=>eligible(g,r,p)).map(p=>{
 const x=s?.exams[p.id],score=merit(p);
 return {id:p.id,name:p.name||p.id,score,rank:x?.rank??0,service:x?.service??0,last:x?.last??null,canSit:(!x||g.turn-x.last>=12&&x.rank<3)&&g.turn-(s?.lastExam??-120)>=3};
 }).sort((a,b)=>b.rank-a.rank||b.score-a.score||a.id.localeCompare(b.id));
 return {candidates,offices:Object.entries(offices).filter(([id,o])=>controlled(g,r,id)&&eligible(g,r,g.politics.people[o.person])).map(([id,o])=>({id,person:o.person,corruption:o.corruption??0})),last:s?.history[0]||null};
}
export function examinationRank(g,r,id){return state(g,r)?.exams[id]?.rank||0;}
export function administratorBonus(g,r,id,o){
 const p=g.politics.people[o.person];if(!imperial(g,r)||!eligible(g,r,p)||!controlled(g,r,id))return 0;
 const rank=examinationRank(g,r,p.id);return rank*.0125-(o.corruption??0)*.0015;
}
function record(g,r,msg){
 const s=state(g,r,true);s.history.unshift({turn:g.turn,message:msg});s.history=s.history.slice(0,32);
 g.institutions.history.unshift({realm:r,turn:g.turn,message:msg});g.institutions.history=g.institutions.history.slice(0,120);
 if(r===g.player&&Array.isArray(g.log)){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}
}
export function civilServiceAction(g,r,command,id){
 if(!imperial(g,r)||!Object.keys(g.provinces).some(id=>controlled(g,r,id)))return no('Requires an imperial government and controlled territory.');
 const f=g.factions[r],s=state(g,r,true);if(command==='exam'){
  const p=g.politics.people[id],old=s.exams[id];if(!eligible(g,r,p)||f.treasury<90||g.turn-s.lastExam<3||(old&&(old.rank>=3||g.turn-old.last<12)))return no('Requires a free adult candidate, 90 gold and examination cooldown.');
  const points=merit(p),rank=points>=80?3:points>=60?2:points>=40?1:0;
  f.treasury-=90;s.lastExam=g.turn;s.exams[id]={rank:Math.max(rank,old?.rank||0),last:g.turn,service:old?.service||0};
  const message=(p.name||id)+(rank?' earned civil-service rank '+rank: ' did not qualify')+' ('+points+'/100 examination score).';record(g,r,message);return ok(message);
 }
 if(command==='audit'){
  const o=g.institutions.realms[r].offices[id],p=g.politics.people[o?.person];if(!controlled(g,r,id)||!o||!eligible(g,r,p)||(o.corruption??0)<10||f.treasury<75||g.turn-(o.lastAudit??-120)<6)return no('Requires an active governor with corruption 10+, 75 gold and six months between audits.');
  f.treasury-=75;o.corruption=cap(o.corruption-25,0,100);o.lastAudit=g.turn;
  const h=g.politics.holdings[id];if(h?.realm===r&&h.lord===p.id)h.loyalty=cap((h.loyalty??50)-8,0,100);
  record(g,r,'An imperial audit reduced administrative corruption in '+id+'.');return ok('Imperial audit completed.');
 }
 return no('Unknown civil-service action.');
}
export function tickCivilService(g,r){
 if(!imperial(g,r))return;const f=g.factions[r],s=state(g,r),offices=g.institutions.realms[r].offices;
 if(g.turn%3===0){for(const [id,o] of Object.entries(offices)){
  const p=g.politics.people[o.person];if(!controlled(g,r,id)||!eligible(g,r,p))continue;
  const rank=examinationRank(g,r,p.id),growth=Math.max(0,5-(p.skills?.stewardship??0)-rank);
  o.corruption=cap((o.corruption??0)+growth,0,100);
  if(s?.exams[p.id]&&rank)s.exams[p.id].service+=3;
 }}
 if(humanControlsRealm(g,r)||g.turn<12||g.turn%6!==0||f.treasury<750)return;
 const v=civilServiceView(g,r),audit=v.offices.filter(o=>o.corruption>=25&&g.turn-(offices[o.id].lastAudit??-120)>=6).sort((a,b)=>b.corruption-a.corruption)[0];
 if(audit){civilServiceAction(g,r,'audit',audit.id);return;}
 const candidate=v.candidates.find(c=>c.canSit&&c.rank===0&&c.score>=40);
 if(candidate)civilServiceAction(g,r,'exam',candidate.id);
}
