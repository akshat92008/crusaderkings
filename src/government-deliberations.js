// Government-specific deliberation, using existing characters and holdings.
// A motion changes institutional policy, never title ownership or succession.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fail=msg=>({ok:false,msg}), success=msg=>({ok:true,msg});
export const GOVERNMENT_MOTIONS=Object.freeze({
 feudal:{name:'Estate consent charter',desc:'Concede local autonomy for stronger levy obligations.',skill:'diplomacy',interest:'autonomy',cost:130,tax:.94,levy:1.10,trade:1},
 centralized:{name:'Royal inspection ordinance',desc:'Strengthen royal audits at the expense of local autonomy.',skill:'stewardship',interest:'central',cost:150,tax:1.10,levy:.97,trade:1},
 sultanate:{name:'Scholarly patronage covenant',desc:'Support scholarly and court institutions instead of military expenditure.',skill:'learning',interest:'court',cost:160,tax:.96,levy:1,trade:1.07},
 military:{name:'Service household charter',desc:'Bind elite households to military service with fiscal concessions.',skill:'martial',interest:'service',cost:145,tax:.93,levy:1.12,trade:1},
 imperial:{name:'Merit appointment ordinance',desc:'Reward qualified officeholders; reduce the influence of entrenched landed elites.',skill:'stewardship',interest:'merit',cost:170,tax:1.12,levy:.95,trade:1},
 republic:{name:'Merchant assembly charter',desc:'Give commercial households a stronger voice in return for trade investment.',skill:'stewardship',interest:'wealth',cost:175,tax:.96,levy:.96,trade:1.15},
 steppe:{name:'Seasonal grazing agreement',desc:'Reserve pasture for clan households and prioritize mobilization over tax collection.',skill:'martial',interest:'autonomy',cost:100,tax:.90,levy:1.12,trade:1},
 regional:{name:'Regional land-grant compact',desc:'Secure cooperation from local chiefs through durable land privileges.',skill:'diplomacy',interest:'autonomy',cost:140,tax:.95,levy:1.08,trade:1},
 shogunate:{name:'House service covenant',desc:'Exchange privileges for loyalty and military service from regional houses.',skill:'martial',interest:'service',cost:150,tax:.95,levy:1.12,trade:.98},
 tributary:{name:'Tribute arbitration charter',desc:'Favor negotiated external obligations and trade over direct mobilization.',skill:'diplomacy',interest:'court',cost:120,tax:1.03,levy:.95,trade:1.09},
 confederation:{name:'Member consent compact',desc:'Protect member autonomy in exchange for coordinated defense.',skill:'diplomacy',interest:'autonomy',cost:120,tax:.92,levy:1.10,trade:1},
 city:{name:'Guild representation ordinance',desc:'Give affluent urban households representation to encourage commercial growth.',skill:'stewardship',interest:'wealth',cost:135,tax:.97,levy:.96,trade:1.12},
 kinship:{name:'Communal stewardship pact',desc:'Favor collective reserves and local cooperation over direct revenue.',skill:'diplomacy',interest:'autonomy',cost:90,tax:.94,levy:1.07,trade:1}
});
const land=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
const type=(g,r)=>g.civic?.realms[r]?.government;
const eligible=(g,r,p)=>p?.alive&&p.age>=18&&p.realm===r&&p.id!==g.politics.realms[r]?.ruler&&!isImprisoned(g,p.id);
function state(g,r,create=false){
 const s=g.institutions?.realms[r];if(!s)return null;
 if(s.deliberation?.government===type(g,r))return s.deliberation;
 if(!create)return null;
 return s.deliberation={government:type(g,r),active:false,motion:null,last:-120,history:[]};
}
export function governmentElectors(g,r){
 const holdings={};for(const p of land(g,r)){const h=g.politics.holdings[p.id];if(h?.realm===r&&h.lord)(holdings[h.lord]??=[]).push(h);}
 return Object.values(g.politics.people).filter(p=>eligible(g,r,p)).map(p=>{
  const hs=holdings[p.id]||[],loyalty=hs.length?hs.reduce((n,h)=>n+(h.loyalty??50),0)/hs.length:50;
  const autonomy=hs.length?hs.reduce((n,h)=>n+(h.autonomy??0),0)/hs.length:0;
  return {id:p.id,name:p.name||p.id,loyalty,autonomy,landed:hs.length,weight:1+Math.min(4,hs.length),skills:p.skills||{},wealth:p.wealth||0};
 }).sort((a,b)=>b.weight-a.weight||a.id.localeCompare(b.id));
}
function score(e,d,enact,lobbied){
 const skill=(e.skills[d.skill]??2),interest={
  autonomy:e.landed?12+e.autonomy*5:-8,central:18-e.landed*9-e.autonomy*7,
  court:e.landed?0:12,service:skill*6-10,merit:skill*9-e.landed*8-12,wealth:Math.min(22,e.wealth/25)-8
 }[d.interest];
 const inclination=(skill-2)*5+interest;
 return Math.round(clamp(e.loyalty+(enact?inclination:-inclination)+(lobbied?20:0),0,100));
}
export function governmentMotionView(g,r){
 const d=GOVERNMENT_MOTIONS[type(g,r)],s=state(g,r);if(!d)return null;
 const motion=s?.motion,active=!!s?.active,enact=motion?.enact??!active;
 const electors=governmentElectors(g,r).map(e=>({...e,support:score(e,d,enact,!!motion?.lobbied[e.id]),lobbied:!!motion?.lobbied[e.id]}));
 const weight=electors.reduce((n,e)=>n+e.weight,0),yes=electors.filter(e=>e.support>=55).reduce((n,e)=>n+e.weight,0);
 const blocked=!land(g,r).length?'No controlled land.':!weight?'No eligible adult political participants.':motion?'A motion is already in debate.':g.turn-(s?.last??-120)<12?'Assembly cooldown: '+(12-g.turn+(s?.last??-120))+' months.':(g.factions[r]?.treasury??0)<d.cost?'Insufficient treasury.':'';
 return {definition:d,active,motion,electors,weight,yes,blocked,last:s?.history[0]||null};
}
export function governmentPolicyModifiers(g,r){
 const d=GOVERNMENT_MOTIONS[type(g,r)],s=state(g,r);
 return d&&s?.active&&land(g,r).length?{tax:d.tax,levy:d.levy,trade:d.trade}:{tax:1,levy:1,trade:1};
}
function record(g,r,msg){
 const root=g.institutions;root.history.unshift({realm:r,turn:g.turn,message:msg});root.history=root.history.slice(0,120);
 if(r===g.player&&Array.isArray(g.log)){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}
}
export function governmentMotionAction(g,r,command,id){
 const v=governmentMotionView(g,r),f=g.factions[r];if(!v||!f)return fail('No institutional assembly.');
 if(command==='propose'){
  if(v.blocked)return fail(v.blocked);const s=state(g,r,true);
  f.treasury-=v.definition.cost;s.motion={enact:!s.active,opened:g.turn,ends:g.turn+3,lobbied:{}};
  record(g,r,'Assembly debate opened: '+v.definition.name+'.');return success('Motion opened for three months.');
 }
 const s=state(g,r);if(!s?.motion||g.turn>=s.motion.ends)return fail('No open debate.');
 if(command==='lobby'){
  const e=v.electors.find(e=>e.id===id);if(!e||e.lobbied||f.treasury<35)return fail('Select an eligible participant not yet lobbied; requires 35 gold.');
  f.treasury-=35;const p=g.politics.people[id];p.wealth=(p.wealth||0)+35;s.motion.lobbied[id]=true;
  return success('Political support sought from '+e.name+'.');
 }
 return fail('Unknown assembly action.');
}
export function tickGovernmentMotions(g,r){
 const d=GOVERNMENT_MOTIONS[type(g,r)],f=g.factions[r];if(!d||!f)return;
 let s=state(g,r),v=governmentMotionView(g,r);
 if(s?.motion&&g.turn>=s.motion.ends){
  const passed=v.weight>0&&v.yes*2>v.weight&&land(g,r).length>0;
  if(passed){s.active=s.motion.enact;
   const voters=new Map(v.electors.map(e=>[e.id,e]));
   for(const p of land(g,r)){const h=g.politics.holdings[p.id],e=voters.get(h?.lord);if(h?.realm!==r||!e)continue;
    h.loyalty=clamp((h.loyalty??50)+(e.support>=55?5:-8),0,100);
    if(s.active&&d.interest==='autonomy'&&e.support>=55)h.autonomy=Math.max(h.autonomy??0,1);
   }
  }
  const result={turn:g.turn,passed,enact:s.motion.enact,yes:v.yes,total:v.weight};
  s.history.unshift(result);s.history=s.history.slice(0,24);s.motion=null;s.last=g.turn;
  record(g,r,d.name+(passed?(s.active?' enacted.':' repealed.'):' rejected.')+' Vote '+result.yes+'/'+result.total+'.');
  return;
 }
 if(r===g.player||g.turn<12)return;
 if(s?.motion&&g.turn<s.motion.ends&&f.treasury>500){
  const swing=v.electors.filter(e=>!e.lobbied&&e.support>=35&&e.support<55).sort((a,b)=>b.weight-a.weight||b.support-a.support)[0];
  if(swing&&v.yes*2<=v.weight)governmentMotionAction(g,r,'lobby',swing.id);
 }else if(g.turn%12===0&&!v.blocked&&!v.active&&f.treasury>700&&v.yes*2>=v.weight)governmentMotionAction(g,r,'propose');
}
