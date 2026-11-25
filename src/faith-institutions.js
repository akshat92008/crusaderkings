import {humanControlsRealm} from './player-career.js';
import {civilianAccess,journeyDistrict} from './court-travel.js';
// Religious institutions use existing civic faith labels, actual characters and local institution records.
// Charter options are alternate-history player policies, not assertions about real-world doctrines.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
import {
 getMoralAuthority,adjustMoralAuthority,promoteCardinal,
 appointAntipope,deposeAntipope,antipopeAction,
 declareCrusade,pledgeCrusade,crusadeSummary,
 coronateRuler,canonizeAncestor,selectReligiousSchool,
 selectedReligiousSchool,RELIGIOUS_SCHOOLS
} from './ck2-deep-systems.js';
export {
 getMoralAuthority,adjustMoralAuthority,promoteCardinal,
 appointAntipope,deposeAntipope,antipopeAction,
 declareCrusade,pledgeCrusade,crusadeSummary,
 coronateRuler,canonizeAncestor,selectReligiousSchool,
 selectedReligiousSchool,RELIGIOUS_SCHOOLS
};
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
 'Sunni Islam':'Islam','Islamic traditions':'Islam',
 'Tibetan Buddhism':'Buddhism','Theravada Buddhism':'Buddhism',
 'Hindu traditions':'Hindu traditions','Hindu-Buddhist traditions':'Hindu traditions',
 'Chinese ritual traditions':'East Asian ritual traditions','Confucian ritual traditions':'East Asian ritual traditions','Vietnamese ritual traditions':'East Asian ritual traditions'
};
export const FAITH_SYSTEMS=Object.freeze(['catholic','orthodox','islamic','dharmic','traditional']);
export const SACRED_SITES=Object.freeze({
 latium:{name:'Apostolic See of Rome',faith:'Latin Christianity'},
 jerusalem:{name:'Holy City of Jerusalem',faith:'Latin Christianity'},
 thrace:{name:'Imperial Cathedral of Constantinople',faith:'Eastern Christianity'},
 hejaz:{name:'Sacred Sanctuary of Mecca',faith:'Sunni Islam'},
 benares:{name:'Sacred Ghats of Varanasi',faith:'Hindu traditions'},
 kyoto:{name:'Sacred Shrines of Kyoto',faith:'Buddhist and kami traditions'},
 cusco:{name:'Temple of the Sun at Cusco',faith:'Andean spiritual traditions'},
 lhasa:{name:'Potala Monastic Sanctuary',faith:'Tibetan Buddhism'}
});
export function faithFamily(g,label){
 if(!label)return 'Unclassified';
 const custom=g.identity?.faithDefinitions?.[label];
 if(custom&&Object.hasOwn(g.identity.faithDefinitions,label))return custom.family;
 return Object.hasOwn(exactFamilies,label)?exactFamilies[label]:label;
}
export function faithTraditionSystem(g,label){
 if(!label)return 'traditional';
 const custom=g.identity?.faithDefinitions?.[label];
 const base=custom?.parent||label;
 if(base==='Latin Christianity')return 'catholic';
 if(['Eastern Christianity','Ethiopian Christianity','Christian traditions'].includes(base))return 'orthodox';
 if(['Sunni Islam','Islamic traditions','Islamic and local traditions'].includes(base))return 'islamic';
 if(['Hindu traditions','Hindu-Buddhist traditions','Theravada Buddhism','Tibetan Buddhism','Buddhist and kami traditions'].includes(base))return 'dharmic';
 return 'traditional';
}
function ensureSystemData(g,r,faith){
 const i=g.identity?.realms?.[r];if(!i||!faith)return null;
 const sys=faithTraditionSystem(g,faith);
 if(i.faithSystem?.system===sys&&i.faithSystem?.faith===faith)return i.faithSystem;
 const base={system:sys,faith,history:[]};
 if(sys==='catholic')Object.assign(base,{papalFavor:55,curiaSeats:1,investiture:'papal',excommunicated:false,lastIndulgence:-120,lastDivorce:-120,lastCuria:-120});
 else if(sys==='orthodox')Object.assign(base,{patriarchFavor:60,autocephalous:false,autocephalousPatriarch:null,lastSynod:-120,synodDoctrine:'traditional',lastBlessing:-120});
 else if(sys==='islamic')Object.assign(base,{ulamaFavor:60,caliphFavor:55,jizyaActive:false,hajjRulers:{},lastUlama:-120,lastFatwa:-120,lastJizya:-120});
 else if(sys==='dharmic')Object.assign(base,{dharma:60,merit:20,monasticEndowments:0,sectPatronage:'syncretic',lastRitual:-120});
 else Object.assign(base,{harmony:65,ancestralVeneration:60,sacredGroves:0,lastFestival:-120,lastElders:-120});
 i.faithSystem=base;
 return base;
}
function state(g,r,create=false){
 const i=g.identity?.realms?.[r],faith=court(g,r)?.faith;if(!i||!faith)return null;
 if(create)ensureSystemData(g,r,faith);
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
 const sys=ensureSystemData(g,r,c.faith);
 return {faith:c.faith,family:faithFamily(g,c.faith),system:sys?.system||faithTraditionSystem(g,c.faith),systemState:sys,parent:founded?.parent||null,policies,council,...votes,advisor:a?.name||a?.id||null,sites,candidates,canCouncil,canSite,canFound,conversions,canConvert,last:s?.history[0]||null};
}
export function faithSystemView(g,r){
 const c=court(g,r),i=g.identity?.realms?.[r];if(!c||!i)return null;
 const sys=ensureSystemData(g,r,c.faith);
 const land=Object.values(g.provinces||{}).filter(p=>own(g,r,p.id));
 const heresies=land.map(p=>g.identity?.heresies?.[p.id]).filter(Boolean);
 const clerics=land.map(p=>({province:p.id,...(g.identity?.clergyAppointments?.[p.id]||{})})).filter(x=>x.person);
 const alliances=Object.values(g.identity?.faithAlliances||{}).filter(a=>a.partners.includes(r)&&a.until>g.turn);
 const sites=land.filter(p=>g.identity?.institutions?.[p.id]?.sanctuary||SACRED_SITES[p.id]).map(p=>({id:p.id,name:SACRED_SITES[p.id]?.name||('Sanctuary of '+p.id)}));
 const family=faithFamily(g,c.faith);
 const availableSchools=Object.values(RELIGIOUS_SCHOOLS).filter(sc=>sc.system===sys.system||sc.families.includes(family)||sys.system==='traditional'||(sys.system==='orthodox'&&sc.system==='catholic'));
 return {faith:c.faith,family,system:sys.system,state:sys,heresies,clerics,alliances,sites,crusade:g.identity?.crusade||null,jihad:g.identity?.jihad||null,moralAuthority:getMoralAuthority(g,c.faith),cardinals:g.deepSystems?.cardinals||null,antipope:g.deepSystems?.antipopes?.[r]||null,crusadeSummary:crusadeSummary(g),religiousSchool:selectedReligiousSchool(g,r),availableSchools,coronation:g.deepSystems?.coronations?.[r]||null,canonizedAncestors:Object.values(g.deepSystems?.canonized||{}).filter(x=>x.realm===r)};
}
export function faithCharterModifiers(g,r){
 const s=state(g,r),out={research:0,acceptance:0,unrest:0};if(!s||!advisor(g,r))return out;
 for(const [axis,id] of Object.entries(s.policies)){const d=FAITH_CHARTER[axis]?.options[id];if(!d)continue;if(axis==='endowment'&&id==='education'&&(g.factions[r]?.treasury??0)<10)continue;for(const k of Object.keys(out))out[k]+=d[k]||0;}
 return out;
}
export function faithSystemModifiers(g,r){
 const sys=g.identity?.realms?.[r]?.faithSystem,out={tax:1,levy:1,morale:0};if(!sys)return out;
 if(sys.system==='catholic'){if(sys.investiture==='royal')out.tax+=.05;if(sys.excommunicated){out.tax-=.08;out.levy-=.1;}if(g.identity?.crusade?.caller===r||g.identity?.crusade?.participants?.includes(r)){out.levy+=.1;out.morale+=10;}}
 else if(sys.system==='orthodox'){if(sys.autocephalous)out.tax+=.04;if(sys.synodDoctrine==='monastic')out.morale+=4;}
 else if(sys.system==='islamic'){if(sys.jizyaActive)out.tax+=.08;if(g.identity?.jihad?.caller===r||g.identity?.jihad?.participants?.includes(r)){out.levy+=.12;out.morale+=10;}}
 else if(sys.system==='dharmic'){if(sys.dharma>=70)out.tax+=.04;if(sys.merit>=50)out.levy+=.04;}
 else if(sys.system==='traditional'){if(sys.harmony>=70)out.levy+=.05;}
 const school=selectedReligiousSchool(g,r);
 if(school){out.tax+=school.tax||0;out.levy+=school.levy||0;out.morale+=school.morale||0;}
 return out;
}
function validName(g,name){return /^[\p{L}\p{N}][\p{L}\p{N} .'-]{2,47}$/u.test(name)&&!Object.hasOwn(g.identity.faithDefinitions||{},name)&&!Object.values(g.civic.realms).some(c=>c.faith===name)&&!Object.values(g.civic.provinces).some(c=>c.faith===name)&&!['__proto__','constructor','prototype'].includes(name);}
const addPiety=(head,n)=>{if(head){head.piety=Math.max(0,(head.piety||0)+n);}};
function runSystemAction(g,r,action,id,extra,v,c,i,f,s){
 const sys=ensureSystemData(g,r,c.faith),head=ruler(g,r),land=Object.values(g.provinces||{}).filter(p=>own(g,r,p.id));
 if(!sys||!head?.alive)return no('Requires a living ruler and recognized faith.');
 // Catholic / Latin actions
 if(action==='faith-indulgence'){
  if(sys.system!=='catholic'||f.treasury<120||g.turn-(sys.lastIndulgence??-120)<12)return no('Indulgences require Catholic faith, 120 gold and a yearly interval.');
  f.treasury-=120;sys.lastIndulgence=g.turn;sys.papalFavor=clamp((sys.papalFavor||55)+10,0,100);addPiety(head,12);
  if(head.civic)head.civic.stress=clamp((head.civic.stress||0)-10,0,100);
  if(sys.excommunicated){sys.excommunicated=false;note(g,r,s,'The Papacy lifted the excommunication after a royal indulgence.');}
  else note(g,r,s,'Papal indulgence granted; piety and curial favor improved.');
  return ok('Indulgence granted.');
 }
 if(action==='faith-investiture'){
  if(sys.system!=='catholic'||f.treasury<150||(f.prestige||0)<20)return no('Investiture reform requires Catholic faith, 150 gold and 20 prestige.');
  f.treasury-=150;f.prestige-=20;const royal=sys.investiture!=='royal';sys.investiture=royal?'royal':'papal';
  sys.papalFavor=clamp((sys.papalFavor||55)+(royal?-12:12),0,100);if(!royal)addPiety(head,10);else f.prestige+=8;
  note(g,r,s,'Realm adopted '+(royal?'royal':'papal')+' investiture.');return ok('Investiture policy changed.');
 }
 if(action==='faith-curia'){
  if(sys.system!=='catholic'||sys.curiaSeats>=4||f.treasury<180||g.turn-(sys.lastCuria??-120)<18)return no('Requires Catholic faith, 180 gold, fewer than 4 Curia seats and 18-month interval.');
  f.treasury-=180;sys.lastCuria=g.turn;sys.curiaSeats=(sys.curiaSeats||0)+1;sys.papalFavor=clamp((sys.papalFavor||55)+10,0,100);addPiety(head,8);
  note(g,r,s,'A prelate from the realm entered the Roman Curia.');return ok('Curia seat gained.');
 }
 if(action==='faith-excommunicate'){
  const target=g.factions[id],tr=ruler(g,id),tsys=target&&ensureSystemData(g,id,court(g,id)?.faith);
  const hasAnti=Boolean(g.deepSystems?.antipopes?.[r]?.active);
  if(sys.system!=='catholic'||!target||id===r||tsys?.system!=='catholic'||(!hasAnti&&(sys.papalFavor||0)<55)||(head.piety||0)<20||f.treasury<100||tsys.excommunicated)return no('Requires Catholic target, 55 papal favor (or Antipope), 20 piety and 100 gold.');
  f.treasury-=100;addPiety(head,-15);tsys.excommunicated=true;tsys.excommunicatedUntil=g.turn+36;
  target.legitimacy=clamp((target.legitimacy||50)-15,0,100);
  for(const h of Object.values(g.politics?.holdings||{}))if(h.realm===id)h.loyalty=clamp((h.loyalty||50)-15,0,100);
  f.relations??={};target.relations??={};f.relations[id]=clamp((f.relations[id]||0)-20,-100,100);target.relations[r]=clamp((target.relations[r]||0)-20,-100,100);
  note(g,r,s,(hasAnti?'An Antipope':'The Papacy')+' excommunicated '+tr.name+' of '+target.name+'.');return ok('Target excommunicated.');
 }
 if(action==='faith-divorce'){
  const spouse=head.spouse&&g.politics.people[head.spouse];
  const hasAnti=Boolean(g.deepSystems?.antipopes?.[r]?.active);
  if(sys.system!=='catholic'||!spouse||f.treasury<140||(!hasAnti&&(sys.papalFavor||0)<50)||g.turn-(sys.lastDivorce??-120)<24)return no('Requires Catholic faith, a living spouse, 50 papal favor (or Antipope) and 140 gold.');
  f.treasury-=140;sys.lastDivorce=g.turn;if(!hasAnti)sys.papalFavor=clamp(sys.papalFavor-8,0,100);
  head.spouse=null;spouse.spouse=null;(head.memories??=[]).push('Obtained a papal annulment in '+g.year+'.');
  note(g,r,s,(hasAnti?'An Antipope':'A papal')+' annulment dissolved the royal marriage.');return ok('Marriage annulled.');
 }
 if(action==='faith-crusade'){
  const target=g.factions[id],tf=court(g,id)?.faith;
  if(sys.system!=='catholic'||!target||id===r||faithFamily(g,tf)==='Christianity'||(sys.papalFavor||0)<60||(head.piety||0)<25||f.treasury<200||g.identity?.crusade?.ends>g.turn)return no('Requires Catholic faith, non-Christian target, 60 papal favor, 25 piety and 200 gold.');
  f.treasury-=200;addPiety(head,15);sys.papalFavor=clamp(sys.papalFavor-10,0,100);
  g.identity.crusade={caller:r,target:id,started:g.turn,ends:g.turn+36,participants:[r]};
  for(const a of Object.values(g.armies||{}))if(a.owner===r)a.morale=clamp((a.morale||70)+12,0,100);
  note(g,r,s,'A Crusade was proclaimed against '+target.name+'!');return ok('Crusade proclaimed.');
 }
 // Orthodox actions
 if(action==='faith-autocephaly'){
  if(sys.system!=='orthodox'||sys.autocephalous||f.treasury<220||i.faithAuthority<50||!land.length)return no('Requires Orthodox faith, 50 faith authority, controlled land and 220 gold.');
  f.treasury-=220;sys.autocephalous=true;const cleric=advisor(g,r);sys.autocephalousPatriarch=cleric?.id||null;
  i.faithAuthority=clamp(i.faithAuthority+8,0,100);f.legitimacy=clamp((f.legitimacy||50)+10,0,100);addPiety(head,10);
  note(g,r,s,'An Autocephalous Patriarchate was established for the realm.');return ok('Autocephaly established.');
 }
 if(action==='faith-synod'){
  if(sys.system!=='orthodox'||f.treasury<140||g.turn-(sys.lastSynod??-120)<24)return no('Requires Orthodox faith, 140 gold and a two-year interval.');
  f.treasury-=140;sys.lastSynod=g.turn;if(['traditional','conciliar','monastic'].includes(id))sys.synodDoctrine=id;
  i.faithAuthority=clamp(i.faithAuthority+8,0,100);f.stability=clamp((f.stability||60)+4,0,100);addPiety(head,10);
  for(const p of land)if(g.identity?.heresies?.[p.id]){g.identity.heresies[p.id].severity-=25;if(g.identity.heresies[p.id].severity<=0)delete g.identity.heresies[p.id];}
  note(g,r,s,'A Sacred Synod convened and strengthened ecclesiastical unity.');return ok('Sacred Synod concluded.');
 }
 if(action==='faith-patriarch-blessing'){
  if(sys.system!=='orthodox'||f.treasury<90||g.turn-(sys.lastBlessing??-120)<18)return no('Requires Orthodox faith, 90 gold and 18-month interval.');
  f.treasury-=90;sys.lastBlessing=g.turn;sys.patriarchFavor=clamp((sys.patriarchFavor||60)+8,0,100);
  f.legitimacy=clamp((f.legitimacy||50)+6,0,100);addPiety(head,8);
  for(const h of Object.values(g.politics?.holdings||{}))if(h.realm===r)h.loyalty=clamp((h.loyalty||50)+6,0,100);
  note(g,r,s,'The Patriarch bestowed a solemn blessing on the crown.');return ok('Patriarchal blessing received.');
 }
 // Islamic actions
 if(action==='faith-hajj'){
  if(sys.system!=='islamic'||sys.hajjRulers?.[head.id]||f.treasury<180)return no('Requires Islamic faith, 180 gold and a ruler who has not yet performed Hajj.');
  f.treasury-=180;sys.hajjRulers??={};sys.hajjRulers[head.id]=g.turn;addPiety(head,25);
  f.prestige=(f.prestige||0)+15;f.legitimacy=clamp((f.legitimacy||50)+6,0,100);
  if(head.civic)head.civic.stress=clamp((head.civic.stress||0)-15,0,100);
  (head.memories??=[]).push('Completed the Hajj in '+g.year+'.');
  note(g,r,s,head.name+' completed the Hajj pilgrimage.');return ok('Hajj completed.');
 }
 if(action==='faith-jizya'){
  if(sys.system!=='islamic'||f.treasury<80||g.turn-(sys.lastJizya??-120)<12)return no('Requires Islamic faith, 80 gold and a yearly interval.');
  f.treasury-=80;sys.lastJizya=g.turn;sys.jizyaActive=!sys.jizyaActive;
  if(sys.jizyaActive)for(const p of land){const l=g.civic?.provinces?.[p.id];if(l&&l.faith!==c.faith)l.acceptance=clamp((l.acceptance||50)+6,0,100);}
  note(g,r,s,'The court '+(sys.jizyaActive?'enacted Jizya protected-community taxation.':'shifted to active Dawa outreach.'));return ok('Jizya policy updated.');
 }
 if(action==='faith-ulama'){
  if(sys.system!=='islamic'||f.treasury<120||g.turn-(sys.lastUlama??-120)<18)return no('Requires Islamic faith, 120 gold and 18-month interval.');
  f.treasury-=120;sys.lastUlama=g.turn;sys.ulamaFavor=clamp((sys.ulamaFavor||60)+12,0,100);addPiety(head,10);
  f.legitimacy=clamp((f.legitimacy||50)+4,0,100);if(i.research)i.research.progress+=15;
  note(g,r,s,'The Ulama council was endowed with scholarly stipends.');return ok('Ulama consulted.');
 }
 if(action==='faith-fatwa'){
  const target=g.politics?.people?.[id];
  if(sys.system!=='islamic'||!target?.alive||f.treasury<100||(sys.ulamaFavor||0)<45||(head.piety||0)<15||g.turn-(sys.lastFatwa??-120)<18)return no('Requires Islamic faith, target character, 45 Ulama favor, 15 piety and 100 gold.');
  f.treasury-=100;sys.lastFatwa=g.turn;addPiety(head,-10);
  if(target.realm===r){for(const [pid,h] of Object.entries(g.politics?.holdings||{}))if(h.realm===r&&h.lord===target.id){h.leverageUntil=Math.max(h.leverageUntil||0,g.turn+24);h.loyalty=clamp((h.loyalty||50)-8,0,100);}}
  else{const tf=g.factions[target.realm];if(tf)tf.legitimacy=clamp((tf.legitimacy||50)-10,0,100);}
  note(g,r,s,'A judicial Fatwa was issued concerning '+target.name+'.');return ok('Fatwa issued.');
 }
 if(action==='faith-jihad'){
  const target=g.factions[id],tf=court(g,id)?.faith;
  if(sys.system!=='islamic'||!target||id===r||faithFamily(g,tf)==='Islam'||(sys.ulamaFavor||0)<55||(head.piety||0)<25||f.treasury<180||g.identity?.jihad?.ends>g.turn)return no('Requires Islamic faith, non-Islamic target, 55 Ulama favor, 25 piety and 180 gold.');
  f.treasury-=180;addPiety(head,-15);g.identity.jihad={caller:r,target:id,started:g.turn,ends:g.turn+36,participants:[r]};
  for(const a of Object.values(g.armies||{}))if(a.owner===r)a.morale=clamp((a.morale||70)+12,0,100);
  note(g,r,s,'A defensive and pious Jihad was proclaimed against '+target.name+'.');return ok('Jihad proclaimed.');
 }
 // Dharmic (Hindu/Buddhist) actions
 if(action==='faith-monastic-patronage'){
  if(sys.system!=='dharmic'||!own(g,r,id)||f.treasury<150)return no('Requires Hindu/Buddhist faith, a controlled province and 150 gold.');
  f.treasury-=150;sys.monasticEndowments=(sys.monasticEndowments||0)+1;sys.merit=clamp((sys.merit||20)+15,0,200);sys.dharma=clamp((sys.dharma||60)+8,0,100);addPiety(head,10);
  const l=g.civic?.provinces?.[id];if(l){l.localTrust=clamp((l.localTrust||50)+10,0,100);l.devotion=clamp((l.devotion||50)+10,0,100);}
  if(i.research)i.research.progress+=15;
  note(g,r,s,'A Matha/Sangha monastic community was endowed in '+id+'.');return ok('Monastic patronage granted.');
 }
 if(action==='faith-merit-ritual'){
  if(sys.system!=='dharmic'||f.treasury<100||g.turn-(sys.lastRitual??-120)<12)return no('Requires Hindu/Buddhist faith, 100 gold and a yearly interval.');
  f.treasury-=100;sys.lastRitual=g.turn;sys.merit=clamp((sys.merit||20)+12,0,200);sys.dharma=clamp((sys.dharma||60)+6,0,100);addPiety(head,8);
  f.stability=clamp((f.stability||60)+4,0,100);for(const p of land)if(Number.isFinite(p.unrest))p.unrest=clamp(p.unrest-4,0,100);
  note(g,r,s,'A grand merit-making and dharmic charity rite was performed.');return ok('Merit rite performed.');
 }
 if(action==='faith-patron-sect'){
  if(sys.system!=='dharmic'||!['matha','sangha','syncretic'].includes(id)||f.treasury<120)return no('Requires Hindu/Buddhist faith, valid school (matha/sangha/syncretic) and 120 gold.');
  f.treasury-=120;sys.sectPatronage=id;i.faithAuthority=clamp(i.faithAuthority+6,0,100);addPiety(head,8);
  note(g,r,s,'The crown patronized '+id+' scholarship and monastic discipline.');return ok('Monastic school patronized.');
 }
 // Traditional / Regional actions
 if(action==='faith-ritual-festival'){
  if(sys.system!=='traditional'||f.treasury<100||g.turn-(sys.lastFestival??-120)<12)return no('Requires traditional ritual faith, 100 gold and a yearly interval.');
  f.treasury-=100;sys.lastFestival=g.turn;sys.harmony=clamp((sys.harmony||65)+10,0,100);sys.ancestralVeneration=clamp((sys.ancestralVeneration||60)+8,0,100);addPiety(head,8);
  f.stability=clamp((f.stability||60)+5,0,100);if(Number.isFinite(f.food))f.food+=40;
  for(const p of land){const l=g.civic?.provinces?.[p.id];if(l)l.localTrust=clamp((l.localTrust||50)+5,0,100);}
  note(g,r,s,'Seasonal ancestral and community rites restored harmony.');return ok('Ritual festival held.');
 }
 if(action==='faith-elder-council'){
  if(sys.system!=='traditional'||f.treasury<120||g.turn-(sys.lastElders??-120)<18)return no('Requires traditional faith, 120 gold and 18-month interval.');
  f.treasury-=120;sys.lastElders=g.turn;i.faithAuthority=clamp(i.faithAuthority+8,0,100);f.legitimacy=clamp((f.legitimacy||50)+6,0,100);
  for(const p of land){const l=g.civic?.provinces?.[p.id];if(l)l.acceptance=clamp((l.acceptance||50)+6,0,100);}
  note(g,r,s,'Ritual elders and keepers of tradition affirmed the realm compact.');return ok('Elder council convened.');
 }
 if(action==='faith-sacred-grove'){
  if(sys.system!=='traditional'||!own(g,r,id)||f.treasury<130)return no('Requires traditional faith, a controlled province and 130 gold.');
  f.treasury-=130;sys.sacredGroves=(sys.sacredGroves||0)+1;addPiety(head,10);
  const l=g.civic?.provinces?.[id];if(l){l.devotion=clamp((l.devotion||50)+10,0,100);l.localTrust=clamp((l.localTrust||50)+8,0,100);}
  note(g,r,s,'An ancestral sacred site was consecrated in '+id+'.');return ok('Sacred site consecrated.');
 }
 // Cross-faith clerical appointment, faith alliance, heresy response, quick pilgrimage
 if(action==='faith-appoint-cleric'){
  const cleric=adult(g,r,extra);if(!own(g,r,id)||!cleric||cleric.id===head.id||f.treasury<80)return no('Requires controlled province, free adult courtier and 80 gold.');
  if(sys.system==='catholic'&&sys.investiture==='papal'&&(sys.papalFavor||0)<35)return no('Papal investiture requires at least 35 papal favor to confirm appointment.');
  f.treasury-=80;g.identity.clergy??={};g.identity.clergy[cleric.id]=id;
  g.identity.clergyAppointments??={};g.identity.clergyAppointments[id]={person:cleric.id,faith:c.faith,turn:g.turn};
  cleric.role='clergy';addPiety(cleric,10);addPiety(head,5);
  const l=g.civic?.provinces?.[id];if(l)l.devotion=clamp((l.devotion||50)+6,0,100);
  note(g,r,s,(cleric.name||cleric.id)+' was appointed to serve sacred institutions in '+id+'.');return ok('Cleric appointed.');
 }
 if(action==='faith-alliance'){
  const other=g.factions[id],oc=court(g,id);if(!other||id===r||!oc||faithFamily(g,oc.faith)!==faithFamily(g,c.faith)||atWar(g,r,id)||(f.relations?.[id]??0)<15||f.treasury<100)return no('Requires a peaceful same-family faith realm with +15 relations and 100 gold.');
  g.identity.faithAlliances??={};const akey=[r,id].sort().join('|');if(g.identity.faithAlliances[akey]?.until>g.turn)return no('A faith alliance already exists.');
  f.treasury-=100;g.identity.faithAlliances[akey]={partners:[r,id],family:faithFamily(g,c.faith),until:g.turn+48};
  f.relations??={};other.relations??={};f.relations[id]=clamp((f.relations[id]||0)+10,-100,100);other.relations[r]=clamp((other.relations[r]||0)+10,-100,100);
  if(g.identity.crusade?.caller===r&&!g.identity.crusade.participants.includes(id))g.identity.crusade.participants.push(id);
  if(g.identity.jihad?.caller===r&&!g.identity.jihad.participants.includes(id))g.identity.jihad.participants.push(id);
  note(g,r,s,'A sacred faith alliance was sworn with '+(other.name||id)+'.');return ok('Faith alliance formed.');
 }
 if(action==='faith-respond-heresy'){
  const h=g.identity?.heresies?.[id];if(!h||!own(g,r,id)||!['reconcile','suppress','embrace'].includes(extra))return no('Requires an active local heresy and valid response (reconcile/suppress/embrace).');
  if(extra==='reconcile'){if(f.treasury<110)return no('Requires 110 gold.');f.treasury-=110;h.severity-=40;i.faithAuthority=clamp(i.faithAuthority+4,0,100);adjustMoralAuthority(g,c.faith,1,'heresy reconciled');if(h.severity<=0)delete g.identity.heresies[id];}
  else if(extra==='suppress'){if(f.treasury<90)return no('Requires 90 gold.');f.treasury-=90;delete g.identity.heresies[id];const p=g.provinces[id];if(Number.isFinite(p?.unrest))p.unrest=clamp(p.unrest+8,0,100);i.faithAuthority=clamp(i.faithAuthority+6,0,100);adjustMoralAuthority(g,c.faith,2,'heresy suppressed');}
  else{const name=h.name;if(validName(g,name)){(g.identity.faithDefinitions??={})[name]={parent:c.faith,family:faithFamily(g,c.faith),charter:{...s.policies},founded:g.turn,realm:r};c.faith=name;if(head.civic)head.civic.faith=name;const lc=g.civic?.provinces?.[id];if(lc)lc.faith=name;delete g.identity.heresies[id];f.legitimacy=clamp((f.legitimacy||50)-6,0,100);adjustMoralAuthority(g,c.faith,-3,'schism');note(g,r,s,'Schism! The court embraced '+name+'.');return ok('Schism embraced.');}}
  note(g,r,s,'The court addressed the religious movement in '+id+' ('+extra+').');return ok('Heresy addressed.');
 }
 if(action==='faith-promote-cardinal')return promoteCardinal(g,id,Number(extra)||150,r);
 if(action==='faith-appoint-antipope')return appointAntipope(g,id,r);
 if(action==='faith-depose-antipope')return deposeAntipope(g,id||r,r);
 if(action==='faith-antipope-action')return antipopeAction(g,id,extra,r);
 if(action==='faith-declare-crusade')return declareCrusade(g,id,r);
 if(action==='faith-pledge-crusade')return pledgeCrusade(g,r);
 if(action==='faith-coronate')return coronateRuler(g,r,id||'royal');
 if(action==='faith-canonize')return canonizeAncestor(g,r,id||null);
 if(action==='faith-school')return selectReligiousSchool(g,r,id);
 if(action==='faith-pilgrimage'){
  const site=pilgrimageSanctuary(g,r,id,true);if(!site||f.treasury<100)return no('Requires a recognized sanctuary and 100 gold.');
  f.treasury-=100;addPiety(head,15);f.prestige=(f.prestige||0)+8;if(head.civic)head.civic.stress=clamp((head.civic.stress||0)-12,0,100);
  completeSacredJourney(g,r,{host:head.id,quality:80,sanctuary:site});return ok('Pilgrimage completed.');
 }
 return null;
}
export function faithCharterAction(g,r,action,id,extra){
 if(action==='faith-exchange')return startFaithExchange(g,r,id);
 const v=faithCharterView(g,r),c=court(g,r),i=g.identity?.realms[r],f=g.factions[r];if(!v)return no('Religious institutions unavailable.');
 const s=state(g,r,true);
 const sysRes=runSystemAction(g,r,action,id,extra,v,c,i,f,s);if(sysRes)return sysRes;
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
export const faithInstitutionAction=faithCharterAction;
export function tickFaithCharter(g,r,land){
 const c=court(g,r),i=g.identity.realms[r],f=g.factions[r];if(!c||!i||!f)return;
 if(i.faithCharter&&i.faithCharter.faith!==c.faith)delete i.faithCharter;
 const sys=ensureSystemData(g,r,c.faith);
 const s=state(g,r),a=advisor(g,r);
 tickFaithExchange(g,r);
 // Maintain global Crusade/Jihad/Excommunication/Heresy lifetimes
 if(g.identity.crusade&&g.turn>=g.identity.crusade.ends)delete g.identity.crusade;
 if(g.identity.jihad&&g.turn>=g.identity.jihad.ends)delete g.identity.jihad;
 if(sys?.excommunicated&&sys.excommunicatedUntil<=g.turn)sys.excommunicated=false;
 // Emergent heresy checks when faith authority falls very low
 if(land.length&&i.faithAuthority<38&&g.turn>0&&g.turn%12===0){
  g.identity.heresies??={};
  const target=land.find(p=>!g.identity.heresies[p.id]&&g.civic?.provinces?.[p.id]?.faith===c.faith);
  if(target&&Object.keys(g.identity.heresies).length<8){
   const names={catholic:'Reformed Evangelicals',orthodox:'Old Rite Dissenters',islamic:'Purist Reformers',dharmic:'Heterodox Ascetics',traditional:'Syncretic Revivalists'};
   g.identity.heresies[target.id]={province:target.id,name:(names[sys.system]||'Reform')+' of '+target.id.toUpperCase(),parentFaith:c.faith,severity:50,started:g.turn};
   note(g,r,state(g,r,true),'A heterodox movement emerged in '+target.id+'.');
  }
 }
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
 if(humanControlsRealm(g,r)||!a||!land.length||g.turn<24||g.turn%24!==0||f.treasury<1100)return;
 // AI uses distinct religion mechanics per tradition + standard council/site rules.
 const heresyProv=land.find(p=>g.identity?.heresies?.[p.id]);
 if(heresyProv&&f.treasury>=120){faithCharterAction(g,r,'faith-respond-heresy',heresyProv.id,'reconcile');return;}
 if(sys.system==='catholic'){
  if(sys.excommunicated&&f.treasury>=200){faithCharterAction(g,r,'faith-indulgence');return;}
  if(sys.curiaSeats<2&&f.treasury>=900){faithCharterAction(g,r,'faith-curia');return;}
 }else if(sys.system==='orthodox'){
  if(!sys.autocephalous&&land.length>=3&&i.faithAuthority>=55&&f.treasury>=900){faithCharterAction(g,r,'faith-autocephaly');return;}
  if(g.turn-(sys.lastSynod??-120)>=48){faithCharterAction(g,r,'faith-synod','conciliar');return;}
 }else if(sys.system==='islamic'){
  const head=ruler(g,r);
  if(head&&!sys.hajjRulers?.[head.id]&&f.treasury>=900){faithCharterAction(g,r,'faith-hajj');return;}
  if(g.turn-(sys.lastUlama??-120)>=36){faithCharterAction(g,r,'faith-ulama');return;}
 }else if(sys.system==='dharmic'){
  if(sys.monasticEndowments<2&&land[0]){faithCharterAction(g,r,'faith-monastic-patronage',land[0].id);return;}
  if(g.turn-(sys.lastRitual??-120)>=24){faithCharterAction(g,r,'faith-merit-ritual');return;}
 }else if(sys.system==='traditional'){
  if(g.turn-(sys.lastFestival??-120)>=24){faithCharterAction(g,r,'faith-ritual-festival');return;}
 }
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
 const isSacred=SACRED_SITES[id]&&SACRED_SITES[id].faith===faith;
 return (own(g,r,id)||(allowForeign&&host!==r&&journeyDistrict(g,r,id,true)&&civilianAccess(g,r,host)))&&local?.faith===faith&&((i?.faith===faith&&i.level>=2&&i.sanctuary?.faith===faith)||isSacred)?{province:id,faith,host}:null;
}
export function completeSacredJourney(g,r,activity){
 const x=activity.sanctuary,actual=x&&pilgrimageSanctuary(g,r,x.province,true),head=ruler(g,r);
 if(!actual||actual.faith!==x.faith||(x.host&&actual.host!==x.host)||head?.id!==activity.host)return false;
 const i=g.identity.realms[r],local=g.civic.provinces[x.province],bonus=Math.max(1,Math.round((activity.quality??50)/20));
 i.faithAuthority=clamp(i.faithAuthority+bonus,0,100);local.devotion=clamp((local.devotion??50)+bonus*2,0,100);local.localTrust=clamp(local.localTrust+bonus,0,100);
 addPiety(head,bonus*3);
 if(actual.host!==r){const a=g.factions[r],b=g.factions[actual.host];a.relations??={};b.relations??={};a.relations[actual.host]=clamp((a.relations[actual.host]||0)+5,-100,100);b.relations[r]=clamp((b.relations[r]||0)+5,-100,100);}
 head.memories??=[];head.memories.push('Completed a sacred journey to '+x.province+' in '+g.year+'.');note(g,r,state(g,r,true),'The ruler completed a sacred journey to a recognized sanctuary.');return true;
}
