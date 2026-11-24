import {courtModifiers} from './royal-court.js';
import {healthPenalty} from './living-systems.js';
import {institutionModifiers} from './government-institutions.js';
import {identityModifiers} from './identity-systems.js';
// Original, approximate 1450 gameplay profiles, not verified historical population data.
const cap=(x,a,b)=>Math.max(a,Math.min(b,x)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
export const GOVERNMENTS={
 feudal:{name:'Feudal estates',tax:.94,levy:1.14,build:1,trade:1,law:'eldest',action:'Negotiate estate charter',cost:160,desc:'Lower provincial unrest and improve noble loyalty.'},
 centralized:{name:'Centralized crown',tax:1.12,levy:.96,build:.95,trade:1,law:'eldest',action:'Commission royal inspectors',cost:180,desc:'Improve provincial development and royal legitimacy.'},
 sultanate:{name:'Sultanate',tax:1.04,levy:1.1,build:1,trade:1.05,law:'eldest',action:'Establish household patronage',cost:170,desc:'Improve military readiness and court legitimacy.'},
 military:{name:'Military oligarchy',tax:.95,levy:1.23,build:1.08,trade:.94,law:'elective',action:'Review military households',cost:175,desc:'Train field armies and strengthen military elite loyalty.'},
 imperial:{name:'Imperial bureaucracy',tax:1.19,levy:.95,build:.9,trade:1.08,law:'eldest',action:'Conduct administrative examination',cost:180,desc:'Improve steward learning and administrative capacity.'},
 republic:{name:'Commercial republic',tax:.92,levy:.82,build:.92,trade:1.35,law:'elective',action:'Grant merchant charter',cost:160,desc:'Boost trade income through a temporary commercial charter.'},
 steppe:{name:'Steppe khanate',tax:.75,levy:1.30,build:1.14,trade:.92,law:'elective',action:'Convene clan assembly',cost:150,desc:'Improve clan loyalty, legitimacy and army morale.'},
 regional:{name:'Regional land grants',tax:1,levy:1.12,build:.94,trade:1.05,law:'eldest',action:'Renew provincial land grants',cost:155,desc:'Reduce unrest and strengthen local governance.'},
 shogunate:{name:'Military shogunate',tax:.93,levy:1.2,build:1,trade:.98,law:'eldest',action:'Summon military retainers',cost:165,desc:'Raise morale and reward provincial retainers.'},
 tributary:{name:'Tributary network',tax:1.07,levy:1.03,build:1,trade:1.07,law:'eldest',action:'Negotiate tribute compact',cost:140,desc:'Lower local tensions and increase legitimacy.'},
 confederation:{name:'Confederated communities',tax:.82,levy:1.1,build:1.05,trade:1.06,law:'elective',action:'Convene member council',cost:125,desc:'Restore local loyalty and stability through consultation.'},
 city:{name:'Urban political network',tax:.98,levy:.86,build:.88,trade:1.2,law:'elective',action:'Fund communal works',cost:145,desc:'Develop local settlements and improve public stability.'},
 kinship:{name:'Kinship-based communities',tax:.78,levy:1.08,build:1.02,trade:.95,law:'elective',action:'Convene community gathering',cost:110,desc:'Improve food reserves, stability and local trust.'}
};
// Each starting polity has its own identity. These are gameplay approximations;
// faiths/cultures describe broad traditions, never an assertion of uniform belief.
const PROFILES={
 england:['feudal','English','Latin Christianity'],france:['centralized','French','Latin Christianity'],castile:['centralized','Castilian','Latin Christianity'],portugal:['centralized','Portuguese','Latin Christianity'],aragon:['feudal','Aragonese-Catalan','Latin Christianity'],burgundy:['feudal','Burgundian','Latin Christianity'],imperial:['feudal','Central European','Latin Christianity'],poland:['feudal','Polish','Latin Christianity'],muscovy:['centralized','Muscovite','Eastern Christianity'],novgorod:['republic','Novgorodian','Eastern Christianity'],
 ottomans:['sultanate','Ottoman','Sunni Islam'],mamluks:['military','Mamluk-Egyptian','Sunni Islam'],timurids:['regional','Timurid','Sunni Islam'],qara:['steppe','Turkmen','Islamic traditions'],horde:['steppe','Golden Horde','Islamic traditions'],morocco:['sultanate','Maghrebi','Sunni Islam'],ethiopia:['centralized','Ethiopian','Ethiopian Christianity'],mali:['tributary','Mande','Islamic and local traditions'],songhai:['tributary','Songhai','Islamic and local traditions'],kongo:['regional','Kongo','Kongo spiritual traditions'],kilwa:['sultanate','Swahili','Sunni Islam'],
 vijayanagara:['regional','South Indian','Hindu traditions'],bahmani:['sultanate','Deccani','Islamic traditions'],delhi:['sultanate','North Indian','Islamic traditions'],bengal:['sultanate','Bengali','Islamic traditions'],gujarat:['sultanate','Gujarati','Islamic traditions'],ming:['imperial','Ming Chinese','Chinese ritual traditions'],joseon:['imperial','Korean','Confucian ritual traditions'],ashikaga:['shogunate','Japanese','Buddhist and kami traditions'],ayutthaya:['tributary','Siamese','Theravada Buddhism'], 'dai-viet':['imperial','Vietnamese','Vietnamese ritual traditions'],majapahit:['tributary','Javanese','Hindu-Buddhist traditions'],malacca:['sultanate','Malay','Sunni Islam'],
 mexica:['tributary','Nahua','Nahua spiritual traditions'],maya:['city','Maya','Maya spiritual traditions'],pueblo:['city','Pueblo communities','Pueblo spiritual traditions'],haudenosaunee:['confederation','Haudenosaunee','Haudenosaunee spiritual traditions'],inca:['tributary','Andean','Andean spiritual traditions'],muisca:['confederation','Muisca','Muisca spiritual traditions'],tupi:['kinship','Tupí communities','Tupí spiritual traditions'],mapuche:['confederation','Mapuche','Mapuche spiritual traditions'],maori:['kinship','Māori','Māori spiritual traditions'],fiji:['kinship','Fijian','Fijian spiritual traditions'],aboriginal:['kinship','Australian First Nations communities','Diverse Australian First Nations traditions']
};
export const LIFESTYLES={diplomacy:{name:'Diplomacy',skill:'diplomacy',perks:['Courtly grace','Trusted envoy','Peace broker']},martial:{name:'Warfare',skill:'martial',perks:['Drilled retinue','Logistics master','Veteran commander']},stewardship:{name:'Administration',skill:'stewardship',perks:['Estate accounts','Efficient works','Prosperous realm']},intrigue:{name:'Intrigue',skill:'intrigue',perks:['Careful listener','Network of informants','Master negotiator']},learning:{name:'Scholarship',skill:'learning',perks:['Royal library','Patron of scholars','Learned ruler']}};
function log(g,msg){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}
const profile=f=>PROFILES[f.id]||(Array.isArray(f.civicProfile)&&GOVERNMENTS[f.civicProfile[0]]?f.civicProfile:['regional',f.name,'Local spiritual traditions']);
const person=(g,id)=>g.politics.people[id];
const ruler=(g,realm)=>person(g,g.politics.realms[realm]?.ruler);
function character(g,c){if(c.civic)return c.civic;const origin=g.civic.realms[c.realm];return c.civic={culture:origin?.culture||'Local',faith:origin?.faith||'Local',focus:null,xp:0,perks:[],stress:0,guardian:null,education:0,lastFocus:-60};}
export function initCivic(g,world){
 if(g.civic?.version===1)return g.civic;
 const c=g.civic={version:1,realms:{},provinces:{},events:{},situations:{},history:[],lastTick:-1,seed:671901};
 for(const f of world.factions){const [government,culture,faith]=profile(f);c.realms[f.id]={government,culture,faith,authority:55,cohesion:65,patronage:45,policy:'accommodation',lastDecision:{},charterUntil:0,lastElection:g.turn,lastRuler:g.politics.realms[f.id].ruler};
  if(government==='republic'||g.turn===0&&g.politics.realms[f.id].law==='eldest')g.politics.realms[f.id].law=GOVERNMENTS[government].law;
 }
 for(const p of world.provinces){const s=c.realms[g.provinces[p.id]?.owner];c.provinces[p.id]={culture:s?.culture||'Local traditions',faith:s?.faith||'Local traditions',acceptance:65,devotion:50,localTrust:65};}
 for(const p of Object.values(g.politics.people))character(g,p);
 return c;
}
function random(c){c.seed=(Math.imul(c.seed,1664525)+1013904223)>>>0;return c.seed/4294967296;}
function provinceList(g,realm){return Object.values(g.provinces).filter(p=>p.owner===realm);}
export function civicModifiers(g,realm){const s=g.civic?.realms[realm],gov=GOVERNMENTS[s?.government];if(!s||!gov)return {tax:1,levy:1,trade:1,build:1,scheme:0};const c=ruler(g,realm)?.civic,level=c?.perks.length||0,identity=identityModifiers(g,realm),institution=institutionModifiers(g,realm),health=healthPenalty(g,ruler(g,realm)?.id),court=courtModifiers(g,realm);
 return {tax:court.tax*(1-health*.03)*institution.tax*identity.tax*gov.tax*(.9+s.cohesion/650)*(.95+s.authority/1100)*(c?.focus==='stewardship'?1+level*.025:1),levy:court.levy*(1-health*.03)*institution.levy*identity.levy*gov.levy*(c?.focus==='martial'?1+level*.045:1),trade:court.trade*institution.trade*identity.trade*gov.trade*(s.charterUntil>g.turn?1.20:1),build:court.build*identity.build*gov.build*(c?.focus==='stewardship'?1-level*.035:1),scheme:identity.scheme+(c?.focus==='intrigue'?level*4:0),diplomacy:identity.diplomacy+(c?.focus==='diplomacy'?level*4:0)};}
export function civicProvinceUnrest(g,realm,id){const p=g.civic?.provinces[id],s=g.civic?.realms[realm];if(!p||!s)return 0;const diversity=p.faith!==s.faith||p.culture!==s.culture;return (diversity?(s.policy==='coercion'?2:s.policy==='pluralism'?-1:0):0)+(p.acceptance<35?1:0)+identityModifiers(g,realm).unrest;}
function history(g,realm,message){g.civic.history.unshift({realm,turn:g.turn,message});g.civic.history=g.civic.history.slice(0,200);if(realm===g.player)log(g,message);}
function spend(g,realm,key,cost,cooldown){const s=g.civic.realms[realm],f=g.factions[realm];if(f.treasury<cost||g.turn-(s.lastDecision[key]??-1000)<cooldown)return false;f.treasury-=cost;s.lastDecision[key]=g.turn;return true;}
function liftLords(g,realm,n){for(const [id,h] of Object.entries(g.politics.holdings))if(h.realm===realm&&g.provinces[id]?.owner===realm)h.loyalty=cap(h.loyalty+n,0,100);}
function armyMorale(g,realm,n){for(const a of Object.values(g.armies))if(a.owner===realm)a.morale=cap(a.morale+n,0,100);}
function governmentAction(g,realm){const s=g.civic.realms[realm],gov=GOVERNMENTS[s.government],f=g.factions[realm],land=provinceList(g,realm);if(!land.length||!spend(g,realm,'government',gov.cost,18))return no('Government decision needs '+gov.cost+' gold and an 18-month interval.');
 s.authority=cap(s.authority+4,0,100);const weakest=land.slice().sort((a,b)=>a.development-b.development)[0];
 switch(s.government){
 case 'feudal':liftLords(g,realm,10);for(const p of land)p.unrest=cap(p.unrest-5,0,100);break;
 case 'centralized':weakest.development=cap(weakest.development+1,1,20);f.legitimacy=cap(f.legitimacy+7,0,100);break;
 case 'sultanate':armyMorale(g,realm,10);f.legitimacy=cap(f.legitimacy+6,0,100);break;
 case 'military':for(const a of Object.values(g.armies))if(a.owner===realm)a.experience=cap(a.experience+.10,0,1);liftLords(g,realm,8);break;
 case 'imperial':{const steward=person(g,g.politics.realms[realm].council.steward);if(steward)steward.skills.stewardship=cap(steward.skills.stewardship+1,1,5);s.authority=cap(s.authority+8,0,100);break;}
 case 'republic':s.charterUntil=g.turn+18;break;
 case 'steppe':liftLords(g,realm,8);armyMorale(g,realm,8);f.legitimacy=cap(f.legitimacy+5,0,100);break;
 case 'regional':weakest.development=cap(weakest.development+1,1,20);for(const p of land)p.unrest=cap(p.unrest-4,0,100);break;
 case 'shogunate':armyMorale(g,realm,12);liftLords(g,realm,7);break;
 case 'tributary':s.cohesion=cap(s.cohesion+8,0,100);f.legitimacy=cap(f.legitimacy+5,0,100);break;
 case 'confederation':liftLords(g,realm,12);f.stability=cap(f.stability+6,0,100);break;
 case 'city':weakest.development=cap(weakest.development+2,1,20);f.stability=cap(f.stability+5,0,100);break;
 case 'kinship':f.food+=100;f.stability=cap(f.stability+6,0,100);liftLords(g,realm,7);break;
 }
 history(g,realm,gov.action+' completed.');return ok(gov.action+' completed.');
}
export function civicAction(g,world,action,id,extra){const c=initCivic(g,world),realm=g.player,s=c.realms[realm],f=g.factions[realm],r=ruler(g,realm),rc=character(g,r);
 if(action==='government')return governmentAction(g,realm);
 if(action==='policy'){if(!['accommodation','pluralism','coercion'].includes(id)||s.policy===id||!spend(g,realm,'faith-policy',80,24))return no('Policy change requires 80 gold and two years between changes.');s.policy=id;s.patronage=cap(s.patronage+(id==='coercion'?8:id==='pluralism'?-4:0),0,100);history(g,realm,'The realm adopted '+id+' as its faith policy.');return ok('Faith policy changed.');}
 if(action==='focus'){if(!LIFESTYLES[id]||rc.focus===id||g.turn-rc.lastFocus<24)return no('Choose a different lifestyle; changes are limited to every two years.');rc.progress??={};if(rc.focus)rc.progress[rc.focus]={xp:rc.xp,perks:rc.perks};rc.focus=id;rc.xp=rc.progress[id]?.xp||0;rc.perks=rc.progress[id]?.perks||[];rc.lastFocus=g.turn;return ok('Lifestyle focus changed.');}
 if(action==='guardian'){const child=person(g,id),guardian=person(g,extra);if(!child?.alive||!r.children.includes(id)||child.age<6||child.age>=18||!guardian?.alive||guardian.realm!==realm||guardian.age<18||guardian.id===id)return no('Choose a royal child aged 6–17 and an adult local guardian.');character(g,child).guardian=guardian.id;return ok('Guardian assigned.');}
 if(action==='rest'){if(!spend(g,realm,'rest',70,12))return no('Rest needs 70 gold and a yearly interval.');rc.stress=cap(rc.stress-25,0,100);return ok('Ruler stress reduced.');}
 if(action==='patronage'){if(!spend(g,realm,'patronage',110,12))return no('Patronage needs 110 gold and a yearly interval.');s.patronage=cap(s.patronage+15,0,100);f.legitimacy=cap(f.legitimacy+4,0,100);return ok('Religious and community institutions supported.');}
 if(action==='scholarship'){if(!spend(g,realm,'scholarship',130,18))return no('Scholarship needs 130 gold and an 18-month interval.');f.tech=cap(f.tech+1,1,10);s.cohesion=cap(s.cohesion+5,0,100);return ok('Scholarship funded; technology increased.');}
 if(action==='integrate'){const p=g.provinces[id],local=c.provinces[id];if(!p||p.owner!==realm||!local||!spend(g,realm,'integrate:'+id,100,12))return no('Select an owned province; integration costs 100 gold annually.');local.acceptance=cap(local.acceptance+18,0,100);local.localTrust=cap(local.localTrust+12,0,100);p.unrest=cap(p.unrest-8,0,100);return ok('Local communities consulted; acceptance improved.');}
 if(action==='event')return resolveCivicEvent(g,realm,Number(id));
 return no('Unknown society decision.');
}
const EVENTS=[
 ['local_charter','The local charter','Local representatives request recognition of customary law.','province',[[0,0,0,-6],[100,10,0,10]]],
 ['pilgrim_road','Safe passage','Travelers petition for safer access to sacred and communal sites.','province',[[0,0,-3,-2],[90,4,8,7]]],
 ['cultural_exchange','An exchange of learning','Visiting scholars offer to share their knowledge with the court.','realm',[[0,-2,0,0],[120,8,4,5]]],
 ['language_petition','The language of administration','Local officials petition for records in a familiar language.','province',[[0,-3,0,-8],[80,6,0,14]]],
 ['harvest_custom','A seasonal gathering','Community leaders request support for their seasonal celebrations.','province',[[0,0,-4,-2],[75,4,8,8]]],
 ['disputed_land','The disputed estate','Competing local institutions disagree over customary land rights.','province',[[0,-3,0,-10],[110,6,4,12]]],
 ['foreign_scholars','A visiting scholarly circle','Scholars offer instruction in exchange for court protection.','realm',[[0,-2,0,0],[140,9,3,4]]],
 ['noble_custom','Custom and authority','Nobles demand greater respect for local institutions.','realm',[[0,-7,0,0],[100,10,0,4]]],
 ['ritual_dispute','A public ritual dispute','Community representatives request an equitable resolution.','province',[[0,-3,-5,-8],[100,6,8,10]]],
 ['artisan_school','An artisan school','Local workshops offer to train a new generation of craftspeople.','province',[[0,-2,0,0],[120,8,0,8]]],
 ['court_archive','The court archive','Officials propose recording customary law and scholarly works.','realm',[[0,-2,0,0],[100,8,3,3]]],
 ['market_rights','Market access','Merchants from different communities dispute access to a market.','province',[[0,-3,0,-7],[90,7,0,12]]],
 ['public_relief','Community relief','Local institutions request assistance for vulnerable households.','province',[[0,-4,-4,-4],[110,8,10,10]]],
 ['customary_mediation','Customary mediation','A delegation offers to mediate an unresolved local grievance.','province',[[0,-3,0,-7],[80,7,3,12]]],
 ['patronage_debate','A patronage debate','Competing institutions ask how royal resources will be distributed.','realm',[[0,-3,-4,0],[100,6,9,4]]],
 ['education_petition','A school petition','Families request support for local education.','province',[[0,-2,0,-3],[100,8,3,8]]]
];
const EVENT_ACTIONS={"local_charter":"Recognize customary law","pilgrim_road":"Fund road protection","cultural_exchange":"Invite scholars to exchange knowledge","language_petition":"Authorize bilingual records","harvest_custom":"Sponsor the seasonal gathering","disputed_land":"Appoint a neutral mediator","foreign_scholars":"Offer the scholars patronage","noble_custom":"Negotiate a charter of customs","ritual_dispute":"Convene community representatives","artisan_school":"Endow an artisan school","court_archive":"Fund a public archive","market_rights":"Guarantee fair market access","public_relief":"Provide community relief","customary_mediation":"Accept the mediation","patronage_debate":"Distribute patronage equitably","education_petition":"Endow local schools"};
export function civicEvent(g,realm=g.player){const d=g.civic?.events[realm];if(!d)return null;const e=EVENTS.find(x=>x[0]===d.id);if(!e||d.province&&g.provinces[d.province]?.owner!==realm)return null;return {...d,title:e[1],description:e[2],choices:e[4].map(([cost,cohesion,patronage,acceptance],i)=>({label:i?EVENT_ACTIONS[e[0]]:'Decline public expenditure',cost,cohesion,patronage,acceptance}))};}
function resolveCivicEvent(g,realm,index){const e=civicEvent(g,realm),ch=e?.choices[index],s=g.civic.realms[realm],f=g.factions[realm];if(!Number.isInteger(index)||!ch||f.treasury<ch.cost)return no('No affordable society event choice.');f.treasury-=ch.cost;s.cohesion=cap(s.cohesion+ch.cohesion,0,100);s.patronage=cap(s.patronage+ch.patronage,0,100);if(e.province){const p=g.civic.provinces[e.province];p.acceptance=cap(p.acceptance+ch.acceptance,0,100);g.provinces[e.province].unrest=cap(g.provinces[e.province].unrest-ch.acceptance*.5,0,100);}delete g.civic.events[realm];history(g,realm,e.title+': '+ch.label+'.');return ok('Society decision recorded.');}
export function tickCivic(g,world){const c=initCivic(g,world);if(c.lastTick===g.turn)return;c.lastTick=g.turn;
 for(const p of Object.values(g.politics.people))character(g,p);
 if(g.turn%3!==0)return;
 for(const [realm,s] of Object.entries(c.realms)){const f=g.factions[realm],r=ruler(g,realm),rc=character(g,r),land=provinceList(g,realm);if(!land.length)continue;
  if(!rc.focus){rc.focus=Object.keys(LIFESTYLES)[hash(r.id)%5];rc.lastFocus=g.turn;}
  rc.xp+=6+(r.skills[LIFESTYLES[rc.focus].skill]||1);const lvl=Math.min(3,Math.floor(rc.xp/60));while(rc.perks.length<lvl){rc.perks.push(LIFESTYLES[rc.focus].perks[rc.perks.length]);if(rc.perks.length===1||rc.perks.length===3){const sk=LIFESTYLES[rc.focus].skill;r.skills[sk]=cap(r.skills[sk]+1,1,5);}if(realm===g.player)log(g,r.name+' earned '+rc.perks.at(-1)+'.');}
  rc.stress=cap(rc.stress+(f.stability<40?5:-2)+(f.treasury<0?3:0)+(g.conflict&&Object.values(g.conflict.factions).some(x=>x.realm===realm&&x.status==='civil war')?5:0),0,100);
  if(rc.stress>=75)f.legitimacy=cap(f.legitimacy-1,0,100);
  let acceptance=0;for(const p of land){const l=c.provinces[p.id];if(!l)continue;const different=l.culture!==s.culture||l.faith!==s.faith;const d=different?(s.policy==='pluralism'?3:s.policy==='coercion'?-4:1):1;l.acceptance=cap(l.acceptance+d,0,100);l.localTrust=cap(l.localTrust+(l.acceptance>60?1:l.acceptance<35?-2:0),0,100);acceptance+=l.acceptance;}
  const avg=acceptance/land.length;s.cohesion=cap(s.cohesion+cap((avg-s.cohesion)*.10,-3,3),0,100);s.patronage=cap(s.patronage+(s.policy==='coercion'?1:s.policy==='pluralism'?-1:0),0,100);
  const key='integration:'+realm,old=c.situations[key];if(avg<40){c.situations[key]={realm,type:'integration',phase:avg<25?'crisis':'tension',started:old?.started??g.turn,acceptance:Math.round(avg)};if(!old)history(g,realm,'A regional integration crisis has begun.');if(avg<25)f.stability=cap(f.stability-2,0,100);}else if(old&&avg>55){delete c.situations[key];history(g,realm,'The regional integration crisis has subsided.');}
  if(g.turn%12===0&&rc.focus==='learning'&&rc.perks.length>=2&&f.tech<10&&random(c)<.20)f.tech++;
  if(g.turn%12===0)for(const id of r.children){const child=person(g,id);if(!child?.alive||child.age<6||child.age>18)continue;const cc=character(g,child),guardian=person(g,cc.guardian);if(guardian?.alive){const sk=Object.keys(guardian.skills).sort((a,b)=>guardian.skills[b]-guardian.skills[a])[0];cc.education+=guardian.skills[sk];if(cc.education>=8){child.skills[sk]=cap(child.skills[sk]+1,1,5);cc.education-=8;}}}
  if(c.events[realm]&&(!civicEvent(g,realm)||g.turn-c.events[realm].turn>12))delete c.events[realm];
  if(g.turn%9===0&&!c.events[realm]){const low=land.filter(p=>c.provinces[p.id]?.acceptance<50),eligible=EVENTS.filter(e=>!['language_petition','ritual_dispute','market_rights','customary_mediation'].includes(e[0])||low.length);const e=eligible[Math.floor(random(c)*eligible.length)];c.events[realm]={id:e[0],turn:g.turn,province:e[3]==='province'?(low.length?low:land)[Math.floor(random(c)*(low.length||land.length))].id:null};}
  if(realm!==g.player){if(g.turn%18===0&&f.treasury>650)governmentAction(g,realm);const e=civicEvent(g,realm);if(e&&g.turn%9===0)resolveCivicEvent(g,realm,f.treasury>350?1:0);if(s.cohesion<45&&s.policy!=='pluralism')s.policy='pluralism';}
 }
}
