import {civilianAccess,journeyDistrict} from './court-travel.js';
// Religious institutions use existing civic faith labels, actual characters and local institution records.
// Charter options are alternate-history player policies, not assertions about real-world doctrines.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
const court=(g,r)=>g.civic?.realms[r];
const ruler=(g,r)=>g.politics?.people[g.politics?.realms[r]?.ruler];
const adult=(g,r,id)=>{const p=g.politics?.people[id];return p?.alive&&p.age>=18&&p.realm===r&&!isImprisoned(g,id)?p:null;};
export const FAITH_CHARTER={
 governance:{name:'Institutional authority',options:{
   consultation:{name:'Consultative institutions',desc:'Local institutional representatives have equal weight.',cost:0},
   stewardship:{name:'Scholarly stewardship',desc:'Qualified representatives have more influence; research +1 per quarter.',cost:160,research:1},
   patronage:{name:'Court patronage',desc:'Landed patrons have more influence; supported institutions strengthen religious backing.',cost:160}
 }},
 coexistence:{name:'Civic accommodation',options:{
   customary:{name:'Customary protections',desc:'Existing local protections remain unchanged.',cost:0},
   equalProtection:{name:'Equal public protections',desc:'Reduce unrest by one and improve trust in supported communities of other faiths.',cost:140,unrest:-1},
   localCompacts:{name:'Negotiated local compacts',desc:'Increase acceptance by one in controlled provinces.',cost:140,acceptance:1}
 }},
 endowment:{name:'Institutional endowments',options:{
   balanced:{name:'Balanced stewardship',desc:'Institutions keep their present funding priorities.',cost:0},
   relief:{name:'Community relief',desc:'Quarterly aid costs 10 gold and improves trust in the least-trusting supported community.',cost:140},
   education:{name:'Public education',desc:'Quarterly grants cost 10 gold; research +2 while the treasury can sustain them.',cost:160,research:2}
 }}
};
const defaults=()=>({governance:'consultation',coexistence:'customary',endowment:'balanced'});
const exactFamilies={
 'Latin Christianity':'Christianity','Eastern Christianity':'Christianity','Ethiopian Christianity':'Christianity','Christian traditions':'Christianity',
 'Sunni Islam':'Islam','Islamic traditions':'Islam','Tibetan Buddhism':'Buddhism','Theravada Buddhism':'Buddhism','Hindu traditions':'Hindu traditions',
 'Chinese ritual traditions':'East Asian ritual traditions','Confucian ritual traditions':'East Asian ritual traditions','Vietnamese ritual traditions':'East Asian ritual traditions'
};
export function faithFamily(g,label){
 if(!label)return 'Unclassified';
 const custom=g.identity?.faithDefinitions?.[label];
 if(custom&&Object.hasOwn(g.identity.faithDefinitions,label))return custom.family;
 return Object.hasOwn(exactFamilies,label)?exactFamilies[label]:label;
}
function state(g,r,create=false){
 const i=g.identity?.realms[r],faith=court(g,r)?.faith;if(!i||!faith)return null;
 if(i.faithCharter?.faith===faith)return i.faithCharter;
 if(!create)return null;
 const saved=g.identity.faithDefinitions?.[faith],inherited=saved&&Object.hasOwn(g.identity.faithDefinitions,faith)?saved.charter:null;
 return i.faithCharter={faith,policies:{...defaults(),...inherited},council:null,lastCouncil:-120,lastSite:-120,lastExchange:-120,lastConversion:-120,lastFounding:-120,history:[]};
}
function note(g,r,s,message){
 s.history.unshift({turn:g.turn,message});s.history=s.history.slice(0,24);
 g.identity.history.unshift({realm:r,turn:g.turn,message});g.identity.history=g.identity.history.slice(0,200);
 if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}
}
function advisor(g,r){const p=adult(g,r,g.living?.realms[r]?.faithAdvisor);return p&&p.id!==ruler(g,r)?.id&&p.civic?.faith===court(g,r)?.faith&&(p.skills?.learning??0)>=2&&(g.living?.health?.[p.id]?.severity??0)<70?p:null;}
function centers(g,r,land){
 return land.filter(p=>own(g,r,p.id)).map(p=>({id:p.id,p,l:g.civic.provinces[p.id],i:g.identity.institutions[p.id]})).filter(x=>x.l&&x.i?.level>0&&x.i.faith===x.l.faith);
}
function localFaithCenters(g,r,land){const faith=court(g,r).faith;return centers(g,r,land).filter(x=>x.l.faith===faith);}
function participants(g,r,land,policies){
 const found=new Map(),a=advisor(g,r),faith=court(g,r).faith;
 for(const x of localFaithCenters(g,r,land)){
  const h=g.politics.holdings[x.id],p=adult(g,r,h?.lord);if(!p||p.id===ruler(g,r)?.id||p.civic?.faith!==faith||h.realm!==r)continue;
  let v=found.get(p.id);if(!v){v={id:p.id,name:p.name||p.id,learning:p.skills?.learning??1,diplomacy:p.skills?.diplomacy??1,loyalty:0,land:0,advisor:false};found.set(p.id,v);}
  v.land++;v.loyalty+=h.loyalty??50;
 }
 if(a){let v=found.get(a.id);if(!v){v={id:a.id,name:a.name||a.id,learning:a.skills.learning,diplomacy:a.skills?.diplomacy??1,loyalty:60,land:0,advisor:true};found.set(a.id,v);}v.advisor=true;}
 return [...found.values()].map(v=>({...v,loyalty:v.land?Math.round(v.loyalty/v.land):v.loyalty,weight:policies.governance==='stewardship'?1+Math.floor(v.learning/2):policies.governance==='patronage'?1+Math.min(3,v.land):1})).sort((a,b)=>a.id.localeCompare(b.id));
}
function vote(v,axis,value){
 const score=v.loyalty+(v.advisor?10:0)+(axis==='governance'?(value==='stewardship'?(v.learning-2)*8:value==='patronage'?v.land*7-5:5):axis==='coexistence'?(value==='equalProtection'?(v.diplomacy-2)*8:value==='localCompacts'?8:0):value==='education'?(v.learning-2)*8:value==='relief'?12:0);
 return clamp(Math.round(score),0,100);
}
function voteView(g,r,land,policies,council){
 const voters=participants(g,r,land,policies).map(v=>({...v,support:council?vote(v,council.axis,council.value):null}));
 return {voters,total:voters.reduce((n,v)=>n+v.weight,0),yes:voters.filter(v=>v.support>=55).reduce((n,v)=>n+v.weight,0)};
}
export function faithCharterView(g,r,providedLand){
 const c=court(g,r),i=g.identity?.realms[r],f=g.factions[r];if(!c||!i||!f)return null;
 const s=state(g,r),policies=s?.policies||defaults(),land=providedLand||Object.values(g.provinces).filter(p=>own(g,r,p.id));
 const local=localFaithCenters(g,r,land),a=advisor(g,r),council=s?.council||null,votes=voteView(g,r,land,policies,council);
 const founded=g.identity.faithDefinitions&&Object.hasOwn(g.identity.faithDefinitions,c.faith)?g.identity.faithDefinitions[c.faith]:null;
 const sites=local.filter(x=>x.i.sanctuary?.faith===x.l.faith).map(x=>({id:x.id,level:x.i.level}));
 const candidates=local.filter(x=>x.i.level>=2&&x.i.sanctuary?.faith!==x.l.faith).map(x=>({id:x.id,level:x.i.level}));
 const canCouncil=!!a&&!council&&local.length>0&&g.turn-(s?.lastCouncil??-120)>=24&&i.faithAuthority>=45&&votes.total>0;
 const canSite=!!a&&candidates.length>0&&g.turn-(s?.lastSite??-120)>=24&&i.faithAuthority>=55&&f.treasury>=180;
 const canFound=!!a&&!council&&sites.length>=2&&i.faithAuthority>=70&&g.turn-(s?.lastFounding??-120)>=120&&f.treasury>=500&&f.prestige>=30&&Object.entries(policies).some(([axis,value])=>defaults()[axis]!==value);
 const conversions=Object.values(g.politics.people).filter(p=>adult(g,r,p.id)&&p.id!==ruler(g,r)?.id&&p.civic?.faith&&p.civic.faith!==c.faith).map(p=>{
  const localLords=land.filter(q=>g.politics.holdings[q.id]?.lord===p.id).map(q=>g.politics.holdings[q.id]);
  const loyalty=localLords.length?localLords.reduce((n,h)=>n+h.loyalty,0)/localLords.length:50;
  const score=clamp(Math.round((i.faithAuthority-50)*.6+(loyalty-50)*.5+(faithFamily(g,p.civic.faith)===faithFamily(g,c.faith)?20:0)+(p.traits?.includes('zealous')?-20:0)+50),0,100);
  return {id:p.id,name:p.name||p.id,faith:p.civic.faith,score};
 }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const canConvert=!!a&&g.turn-(s?.lastConversion??-120)>=12&&f.treasury>=60&&c.policy!=='coercion';
 return {faith:c.faith,family:faithFamily(g,c.faith),parent:founded?.parent||null,policies,council,...votes,advisor:a?.name||a?.id||null,sites,candidates,canCouncil,canSite,canFound,conversions,canConvert,last:s?.history[0]||null};
}
export function faithCharterModifiers(g,r){
 const s=state(g,r),out={research:0,acceptance:0,unrest:0};if(!s||!advisor(g,r))return out;
 for(const [axis,id] of Object.entries(s.policies)){const d=FAITH_CHARTER[axis]?.options[id];if(!d)continue;if(axis==='endowment'&&id==='education'&&(g.factions[r]?.treasury??0)<10)continue;for(const k of Object.keys(out))out[k]+=d[k]||0;}
 return out;
}
function validName(g,name){return /^[\p{L}\p{N}][\p{L}\p{N} .'-]{2,47}$/u.test(name)&&!Object.hasOwn(g.identity.faithDefinitions||{},name)&&!Object.values(g.civic.realms).some(c=>c.faith===name)&&!Object.values(g.civic.provinces).some(c=>c.faith===name)&&!['__proto__','constructor','prototype'].includes(name);}
export function faithCharterAction(g,r,action,id,extra){
 if(action==='faith-exchange')return startFaithExchange(g,r,id);
 const v=faithCharterView(g,r),c=court(g,r),i=g.identity?.realms[r],f=g.factions[r];if(!v)return no('Religious institutions unavailable.');
 const s=state(g,r,true);
 if(action==='faith-council'){
  const [axis,value]=String(id).split(':'),options=Object.hasOwn(FAITH_CHARTER,axis)?FAITH_CHARTER[axis].options:null,d=options&&Object.hasOwn(options,value)?options[value]:null;
  if(!d||v.policies[axis]===value||!v.canCouncil||f.treasury<d.cost+60)return no('Requires a qualified same-faith advisor, institutional backing, a new policy, treasury and two years between councils.');
  f.treasury-=d.cost+60;s.council={axis,value,ends:g.turn+6,faith:c.faith};s.lastCouncil=g.turn;note(g,r,s,'An institutional council convened to debate '+d.name+'.');return ok('Council convened.');
 }
 if(action==='faith-site'){
  const x=v.candidates.find(x=>x.id===id);if(!v.canSite||!x)return no('Requires a developed institution of the court faith, an advisor, backing and 180 gold.');
  f.treasury-=180;g.identity.institutions[id].sanctuary={faith:c.faith,established:g.turn};s.lastSite=g.turn;i.faithAuthority=clamp(i.faithAuthority+4,0,100);
  note(g,r,s,'A developed religious institution was recognized as a sanctuary in '+id+'.');return ok('Sanctuary recognized.');
 }
 if(action==='faith-found'){
  const name=String(id||'').trim();if(!v.canFound||!validName(g,name))return no('Requires a unique 3–48 character name, two sanctuaries, backing 70, an advisor, a reformed charter, 500 gold and 30 prestige.');
  const parent=c.faith,head=ruler(g,r);if(!head?.civic)return no('A living ruler with civic records is required.');
  f.treasury-=500;f.prestige-=30;f.legitimacy=clamp(f.legitimacy-8,0,100);
  const definitions=g.identity.faithDefinitions??={};definitions[name]={parent,family:faithFamily(g,parent),charter:{...s.policies},founded:g.turn,realm:r};
  c.faith=name;head.civic.faith=name;i.lastFaith=g.turn;i.faithAuthority=45;
  const next=state(g,r,true);next.lastFounding=g.turn;next.lastCouncil=g.turn;next.lastSite=g.turn;
  note(g,r,next,'The court founded '+name+'. Provincial communities and existing institutions retain their faiths.');return ok('New local rite founded.');
 }
 if(action==='faith-conversion'){
  const p=v.conversions.find(p=>p.id===id);if(!v.canConvert||!p)return no('Requires a different-faith adult, advisor, non-coercive policy, 60 gold and a yearly interval.');
  f.treasury-=60;s.lastConversion=g.turn;
  if(p.score<65){note(g,r,s,p.name+' declined the invitation to adopt the court faith.');return ok('The invitation was declined.');}
  const character=g.politics.people[p.id];character.civic.faith=c.faith;character.memories??=[];character.memories.push('Voluntarily adopted '+c.faith+' in '+g.year+'.');
  note(g,r,s,p.name+' voluntarily adopted the court faith.');return ok('Character accepted the invitation.');
 }
 return no('Unknown religious action.');
}
export function tickFaithCharter(g,r,land){
 const c=court(g,r),i=g.identity.realms[r],f=g.factions[r];if(!c||!i||!f)return;
 if(i.faithCharter&&i.faithCharter.faith!==c.faith)delete i.faithCharter;
 const s=state(g,r),a=advisor(g,r);
 tickFaithExchange(g,r);
 if(s?.council&&g.turn>=s.council.ends){
  const x=s.council,v=voteView(g,r,land,s.policies,x),passed=!!a&&land.length>0&&localFaithCenters(g,r,land).length>0&&v.total>0&&v.yes*2>v.total&&x.faith===c.faith;
  if(passed){s.policies[x.axis]=x.value;i.faithAuthority=clamp(i.faithAuthority+3,0,100);}
  note(g,r,s,'Institutional council '+(passed?'adopted ':'rejected ')+FAITH_CHARTER[x.axis].options[x.value].name+' ('+v.yes+'/'+v.total+' votes).');s.council=null;
 }
 if(s&&a){
  const local=centers(g,r,land),policies=s.policies;
  if(policies.governance==='patronage'&&local.some(x=>x.l.faith===c.faith))i.faithAuthority=clamp(i.faithAuthority+1,0,100);
  if(policies.coexistence==='equalProtection')for(const x of local.filter(x=>x.l.faith!==c.faith))x.l.localTrust=clamp(x.l.localTrust+1,0,100);
  if(policies.endowment==='relief'&&local.length&&f.treasury>=10){const x=local.slice().sort((a,b)=>a.l.localTrust-b.l.localTrust||a.id.localeCompare(b.id))[0];f.treasury-=10;x.l.localTrust=clamp(x.l.localTrust+3,0,100);}
  if(policies.endowment==='education'&&f.treasury>=10)f.treasury-=10;
  const sanctuaryCount=local.filter(x=>x.l.faith===c.faith&&x.i.sanctuary?.faith===c.faith).length;
  if(sanctuaryCount&&g.turn%12===0)i.faithAuthority=clamp(i.faithAuthority+Math.min(3,sanctuaryCount),0,100);
 }
 if(r===g.player||!a||!land.length||g.turn<24||g.turn%24!==0||f.treasury<1100)return;
 // AI uses the same council and recognition rules; no forced conversions or automatic schisms.
 const v=faithCharterView(g,r,land);
 if(v.canSite){faithCharterAction(g,r,'faith-site',v.candidates[0].id);return;}
 if(v.canCouncil){const axis=v.policies.governance==='consultation'?'governance':v.policies.coexistence==='customary'?'coexistence':null;
  if(axis){faithCharterAction(g,r,'faith-council',axis+':'+(axis==='governance'?'stewardship':'localCompacts'));return;}
 }
 const exchange=faithExchangeView(g,r);if(exchange.canStart&&exchange.options.length&&i.faithAuthority<70)startFaithExchange(g,r,exchange.options[0].id);
}

// Shared institutional confidence is calculated from existing realms, not stored as another faith population.
export function faithConfidence(g,label){
 const values=Object.entries(g.identity?.realms||{}).filter(([r,x])=>court(g,r)?.faith===label&&Number.isFinite(x.faithAuthority)&&hasLand(g,r)).map(([,x])=>x.faithAuthority);
 return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):null;
}
const atWar=(g,a,b)=>Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(a)&&[w.attacker,w.defender].includes(b));
const hasLand=(g,r)=>Object.values(g.provinces).some(p=>own(g,r,p.id));
function exchangeEligible(g,r,other){
 if(other===r||!g.factions[other]||!court(g,other)||!g.identity?.realms[other]||!advisor(g,r)||!advisor(g,other)||atWar(g,r,other)||!hasLand(g,r)||!hasLand(g,other))return false;
 const a=g.factions[r].relations?.[other]??0,b=g.factions[other].relations?.[r]??0,similar=faithFamily(g,court(g,r).faith)===faithFamily(g,court(g,other).faith);
 return Math.min(a,b)>=(similar?0:20);
}
export function faithExchangeView(g,r){
 const i=g.identity?.realms[r],f=g.factions[r],a=advisor(g,r);
 if(!i||!f)return {options:[],active:null,canStart:false,wait:0};
 const active=i.faithExchange||null,wait=Math.max(0,36-g.turn+(i.lastFaithExchange??-120));
 const options=a?Object.keys(g.civic.realms).filter(id=>exchangeEligible(g,r,id)).map(id=>({id,name:g.factions[id].name||id,faith:court(g,id).faith,sharedFamily:faithFamily(g,court(g,r).faith)===faithFamily(g,court(g,id).faith),relations:g.factions[r].relations?.[id]??0})).sort((a,b)=>Number(b.sharedFamily)-Number(a.sharedFamily)||b.relations-a.relations||a.id.localeCompare(b.id)):[];
 return {options,active,wait,canStart:!active&&!wait&&f.treasury>=120&&options.length>0};
}
function startFaithExchange(g,r,id){
 const v=faithExchangeView(g,r);if(!v.canStart||!v.options.some(x=>x.id===id))return no('Requires a willing foreign court, qualified advisors, peace, 120 gold and a three-year interval.');
 const i=g.identity.realms[r],s=state(g,r,true);g.factions[r].treasury-=120;i.lastFaithExchange=g.turn;
 i.faithExchange={realm:id,faith:court(g,r).faith,otherFaith:court(g,id).faith,ends:g.turn+6,advisor:advisor(g,r).id,otherAdvisor:advisor(g,id).id};
 note(g,r,s,'A six-month scholarly exchange began with '+(g.factions[id].name||id)+'.');return ok('Religious exchange agreed.');
}
function tickFaithExchange(g,r){
 const i=g.identity.realms[r],x=i.faithExchange;if(!x)return;
 const valid=exchangeEligible(g,r,x.realm)&&court(g,r).faith===x.faith&&court(g,x.realm).faith===x.otherFaith&&advisor(g,r)?.id===x.advisor&&advisor(g,x.realm)?.id===x.otherAdvisor;
 if(!valid){delete i.faithExchange;note(g,r,state(g,r,true),'The religious exchange was cancelled after its conditions changed.');return;}
 if(g.turn<x.ends)return;
 const f=g.factions[r],other=g.factions[x.realm],o=g.identity.realms[x.realm];
 f.relations??={};other.relations??={};f.relations[x.realm]=clamp((f.relations[x.realm]||0)+8,-100,100);other.relations[r]=clamp((other.relations[r]||0)+8,-100,100);
 i.faithAuthority=clamp(i.faithAuthority+3,0,100);o.faithAuthority=clamp(o.faithAuthority+2,0,100);
 delete i.faithExchange;note(g,r,state(g,r,true),'The religious exchange concluded; institutional backing and mutual relations improved.');
}
// The existing activity system owns travel and completion. A recognized destination adds a faith-specific result.
export function pilgrimageSanctuary(g,r,id,allowForeign=false){
 const local=g.civic?.provinces[id],i=g.identity?.institutions[id],faith=court(g,r)?.faith,host=g.provinces[id]?.owner;
 return (own(g,r,id)||(allowForeign&&host!==r&&journeyDistrict(g,r,id,true)&&civilianAccess(g,r,host)))&&local?.faith===faith&&i?.faith===faith&&i.level>=2&&i.sanctuary?.faith===faith?{province:id,faith,host}:null;
}
export function completeSacredJourney(g,r,activity){
 const x=activity.sanctuary,actual=x&&pilgrimageSanctuary(g,r,x.province,true),head=ruler(g,r);
 if(!actual||actual.faith!==x.faith||(x.host&&actual.host!==x.host)||head?.id!==activity.host)return false;
 const i=g.identity.realms[r],local=g.civic.provinces[x.province],bonus=Math.max(1,Math.round((activity.quality??50)/20));
 i.faithAuthority=clamp(i.faithAuthority+bonus,0,100);local.devotion=clamp((local.devotion??50)+bonus*2,0,100);local.localTrust=clamp(local.localTrust+bonus,0,100);
 if(actual.host!==r){const a=g.factions[r],b=g.factions[actual.host];a.relations[actual.host]=clamp((a.relations[actual.host]||0)+5,-100,100);b.relations[r]=clamp((b.relations[r]||0)+5,-100,100);}
 head.memories??=[];head.memories.push('Completed a sacred journey to '+x.province+' in '+g.year+'.');note(g,r,state(g,r,true),'The ruler completed a sacred journey to a recognized sanctuary.');return true;
}
