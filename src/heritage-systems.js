// Alternate-history regional politics and character activities. Serializable and deterministic.
import {pilgrimageSanctuary,completeSacredJourney} from './faith-institutions.js';
import {personalOpinion,changeOpinion} from './chronicle-systems.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(x,a,b)=>Math.max(a,Math.min(b,x)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const ruler=(g,id)=>g.politics.people[g.politics.realms[id]?.ruler];
const own=(g,id)=>Object.values(g.provinces).filter(p=>p.owner===id);
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
export const ACTIVITIES={
 coronation:{name:'Coronation',cost:180,duration:2,prestige:14,legitimacy:12,stress:-5,renown:12},
 feast:{name:'Royal feast',cost:120,duration:2,prestige:6,legitimacy:2,stress:-20,renown:5},
 tournament:{name:'Tournament',cost:200,duration:3,prestige:18,legitimacy:3,stress:-10,renown:10},
 hunt:{name:'Royal hunt',cost:90,duration:2,prestige:7,legitimacy:0,stress:-18,renown:4},
 pilgrimage:{name:'Sacred journey',cost:150,duration:3,prestige:8,legitimacy:7,stress:-12,renown:8},
 tour:{name:'Grand provincial tour',cost:170,duration:3,prestige:8,legitimacy:5,stress:8,renown:9},
 wedding:{name:'Grand wedding celebration',cost:220,duration:3,prestige:15,legitimacy:8,stress:-8,renown:14},
 summit:{name:'Diplomatic summit',cost:190,duration:3,prestige:10,legitimacy:4,stress:5,renown:8},
 assembly:{name:'Religious assembly',cost:165,duration:3,prestige:9,legitimacy:5,stress:2,renown:7},
 symposium:{name:'Scholarly gathering',cost:150,duration:3,prestige:10,legitimacy:2,stress:-5,renown:8},
 memorial:{name:'Dynastic memorial',cost:130,duration:2,prestige:6,legitimacy:7,stress:-12,renown:10},
 coming_age:{name:'Coming-of-age ceremony',cost:140,duration:2,prestige:8,legitimacy:4,stress:-5,renown:9}
};
export const STRUGGLE_MODELS={
 "western_succession": {
  "title": "Dynastic arbitration",
  "action": "Recognize the frontier delegations",
  "cost": 160,
  "phases": [
   "rivalry",
   "hostility",
   "competition"
  ],
  "effect": "diplomacy",
  "weights": [
   4,
   -2,
   3
  ],
  "desc": "Improves mutual relations and calms dynastic competition."
 },
 "iberian_balance": {
  "title": "Cross-border accommodation",
  "action": "Support frontier communities",
  "cost": 130,
  "phases": [
   "competition",
   "rivalry",
   "conciliation"
  ],
  "effect": "tolerance",
  "weights": [
   3,
   -2,
   2
  ],
  "desc": "Raises trust and acceptance in diverse local communities."
 },
 "eastern_frontier": {
  "title": "Frontier congress",
  "action": "Convene a frontier congress",
  "cost": 160,
  "phases": [
   "rivalry",
   "hostility",
   "competition"
  ],
  "effect": "diplomacy",
  "weights": [
   5,
   -2,
   2
  ],
  "desc": "Improves relations among surviving regional courts."
 },
 "eastern_mediterranean": {
  "title": "Route protection agreement",
  "action": "Fund route protection",
  "cost": 160,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "stability",
  "weights": [
   5,
   -1,
   2
  ],
  "desc": "Reduces local unrest around strategic routes."
 },
 "deccan": {
  "title": "Regional chief compact",
  "action": "Convene regional chiefs",
  "cost": 140,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "estates",
  "weights": [
   4,
   -1,
   3
  ],
  "desc": "Raises loyalty in the ruler's own landed estates."
 },
 "steppe": {
  "title": "Pasture and caravan agreement",
  "action": "Guarantee shared access",
  "cost": 120,
  "phases": [
   "competition",
   "rivalry",
   "conciliation"
  ],
  "effect": "stability",
  "weights": [
   4,
   -1,
   2
  ],
  "desc": "Improves local stability and settlement trust."
 },
 "east_asia": {
  "title": "Court recognition exchange",
  "action": "Receive regional scholars and envoys",
  "cost": 160,
  "phases": [
   "competition",
   "rivalry",
   "conciliation"
  ],
  "effect": "prestige",
  "weights": [
   3,
   -2,
   4
  ],
  "desc": "Improves standing through recognized court institutions."
 },
 "maritime_asia": {
  "title": "Port convention",
  "action": "Sponsor a port convention",
  "cost": 150,
  "phases": [
   "competition",
   "rivalry",
   "conciliation"
  ],
  "effect": "commerce",
  "weights": [
   3,
   -3,
   4
  ],
  "desc": "Strengthens commercial credit and relations."
 },
 "sahel": {
  "title": "Caravan protection compact",
  "action": "Convene caravan representatives",
  "cost": 145,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "commerce",
  "weights": [
   4,
   -2,
   3
  ],
  "desc": "Strengthens credit and regional commercial relations."
 },
 "mesoamerica": {
  "title": "Local council accord",
  "action": "Consult participating councils",
  "cost": 115,
  "phases": [
   "competition",
   "rivalry",
   "conciliation"
  ],
  "effect": "estates",
  "weights": [
   4,
   -1,
   3
  ],
  "desc": "Supports local cooperation without automatic subjugation."
 },
 "andes": {
  "title": "Regional road accord",
  "action": "Support local road councils",
  "cost": 130,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "stability",
  "weights": [
   4,
   -1,
   2
  ],
  "desc": "Improves trust and reduces unrest in local communities."
 },
 "north_india": {
  "title": "Northern court congress",
  "action": "Convene court and provincial delegates",
  "cost": 155,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "estates",
  "weights": [
   5,
   -1,
   3
  ],
  "desc": "Strengthens cooperation among local estates."
 },
 "english_houses": {
  "title": "Dynastic reconciliation",
  "action": "Hear competing household representatives",
  "cost": 150,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "estates",
  "weights": [
   4,
   -1,
   3
  ],
  "desc": "Lowers domestic faction pressure without deciding succession."
 },
 "imperial_princes": {
  "title": "Princely assembly",
  "action": "Convene a representative assembly",
  "cost": 150,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "estates",
  "weights": [
   4,
   -1,
   3
  ],
  "desc": "Negotiates local cooperation without transferring titles."
 },
 "japanese_houses": {
  "title": "Household mediation",
  "action": "Mediate between local houses",
  "cost": 140,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "estates",
  "weights": [
   4,
   -1,
   3
  ],
  "desc": "Improves local cooperation without assigning military command."
 },
 "ming_frontier": {
  "title": "Provincial review",
  "action": "Convene a frontier administration review",
  "cost": 160,
  "phases": [
   "competition",
   "rivalry",
   "hostility"
  ],
  "effect": "stability",
  "weights": [
   4,
   -1,
   3
  ],
  "desc": "Strengthens public confidence in provincial administration."
 }
};
export const STRUGGLES=[
 {id:'western_succession',name:'Western crowns and succession',members:['england','france','burgundy'],desc:'Rival royal houses contest legitimacy, frontier control and negotiated settlement.'},
 {id:'iberian_balance',name:'Iberian balance of power',members:['castile','aragon','portugal','morocco'],desc:'The western Mediterranean and Atlantic-facing crowns compete for influence and access.'},
 {id:'eastern_frontier',name:'Eastern European frontier',members:['poland','muscovy','novgorod','horde','imperial'],desc:'Neighboring crowns negotiate borders, tribute and the security of frontier communities.'},
 {id:'eastern_mediterranean',name:'Eastern Mediterranean rivalry',members:['ottomans','mamluks','qara','timurids'],desc:'Competing imperial ambitions put pressure on strategic routes and provincial loyalties.'},
 {id:'deccan',name:'Deccan rivalry',members:['vijayanagara','bahmani'],desc:'Regional powers compete over strongholds, trade and influence across the subcontinent.'},
 {id:'steppe',name:'Steppe and imperial frontiers',members:['timurids','qara','horde','muscovy'],desc:'Confederations and expanding courts contend for local allegiance and military influence.'},
 {id:'east_asia',name:'East Asian court diplomacy',members:['ming','joseon','ashikaga','dai-viet'],desc:'Courts balance diplomatic recognition, commerce and regional security.'},
 {id:'maritime_asia',name:'Maritime Southeast Asian networks',members:['malacca','majapahit','ayutthaya','dai-viet'],desc:'Ports and inland courts compete for commercial influence.'},
 {id:'sahel',name:'Sahel trade and authority',members:['mali','songhai','morocco'],desc:'Control of trade networks and regional authority shapes political competition.'},
 {id:'mesoamerica',name:'Mesoamerican political networks',members:['mexica','maya'],desc:'Distinct polities balance local autonomy and political influence in an abstract regional scenario.'},
 {id:'andes',name:'Andean consolidation',members:['inca','muisca','mapuche'],desc:'Regional powers contend over local autonomy and expanding networks of authority.'},
{"id":"north_india","name":"Northern Indian court competition","members":["delhi","bengal","gujarat","bahmani"],"desc":"Regional courts balance political recognition, provincial cooperation and commercial access."},
{"id":"english_houses","name":"English dynastic competition","members":["england"],"domestic":true,"desc":"A possible late-medieval succession crisis driven by actual claimants, faction pressure and estate loyalty."},
{"id":"imperial_princes","name":"Imperial authority and princely autonomy","members":["imperial"],"domestic":true,"desc":"Imperial institutions must negotiate with local estates and political factions."},
{"id":"japanese_houses","name":"Japanese military house competition","members":["ashikaga"],"domestic":true,"desc":"Military households and local estates contend for influence in the shogunate."},
{"id":"ming_frontier","name":"Ming provincial and frontier administration","members":["ming"],"domestic":true,"desc":"Court institutions balance provincial administration and the confidence of local communities."}
];
const ARTIFACTS={regalia:{name:'Ceremonial regalia',cost:260,slot:'regalia',tax:0,levy:0,trade:0,prestige:2},standard:{name:'Royal battle standard',cost:230,slot:'standard',tax:0,levy:.06,trade:0,prestige:1},ledger:{name:'Master accounting manuscript',cost:210,slot:'book',tax:.06,levy:0,trade:0,prestige:1},charter:{name:'Illuminated merchant charter',cost:240,slot:'charter',tax:0,levy:0,trade:.12,prestige:1},chronicle:{name:'Dynastic chronicle',cost:250,slot:'book',tax:0,levy:0,trade:0,prestige:3}};
export const RELICS=ARTIFACTS;
export const LEGACIES={statecraft:{name:'Statecraft',cost:45,tax:.04,levy:0,trade:0},warfare:{name:'Military heritage',cost:45,tax:0,levy:.05,trade:0},commerce:{name:'Commercial heritage',cost:45,tax:0,levy:0,trade:.08},scholarship:{name:'Scholarly heritage',cost:45,tax:.02,levy:0,trade:0},
 statecraft_2:{name:'Established administration',requires:'statecraft',cost:90,tax:.05,levy:0,trade:0},warfare_2:{name:'Professional military heritage',requires:'warfare',cost:90,tax:0,levy:.07,trade:0},commerce_2:{name:'Established commercial networks',requires:'commerce',cost:90,tax:0,levy:0,trade:.10},scholarship_2:{name:'Enduring scholarly institutions',requires:'scholarship',cost:90,tax:.04,levy:0,trade:.03},
 statecraft_3:{name:'Administrative tradition',requires:'statecraft_2',cost:150,tax:.07,levy:0,trade:0},warfare_3:{name:'Renowned military tradition',requires:'warfare_2',cost:150,tax:0,levy:.09,trade:0},commerce_3:{name:'Commercial tradition',requires:'commerce_2',cost:150,tax:0,levy:0,trade:.12},scholarship_3:{name:'Scholarly tradition',requires:'scholarship_2',cost:150,tax:.05,levy:0,trade:.04}};
function record(g,realm,message){const a=g.heritage;a.history.unshift({realm,turn:g.turn,message});a.history=a.history.slice(0,200);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
function random(a){a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;return a.seed/4294967296;}
function dynasty(g,realm){const house=ruler(g,realm)?.house||realm,key=realm+'|'+house;return g.heritage.dynasties[key]??={realm,house,renown:0,legacies:[],achievements:[]};}
function newStruggle(s){return {id:s.id,phase:'competition',tension:35,cooperation:30,cycle:1,influence:Object.fromEntries(s.members.map(id=>[id,0])),last:{},ended:null,outcome:null,history:[],catalysts:[]};}
export function initHeritage(g,world){if(g.heritage?.version===1){for(const item of Object.values(g.heritage.artifacts||{})){item.owner??=ruler(g,item.realm)?.id||null;item.origin??=item.realm;item.culture??=g.civic?.realms[item.realm]?.culture||'Local traditions';item.history??=[{turn:0,message:'Treasury artifact recorded'}];}for(const s of Object.values(g.heritage.realms)){s.plans??=null;s.activityRecords??=[];s.honored??=[];s.celebratedAge??=[];}for(const s of STRUGGLES){const x=g.heritage.struggles[s.id]??=newStruggle(s);x.history??=[];x.catalysts??=[];x.outcome??=null;for(const id of s.members)x.influence[id]??=0;}return g.heritage;}const a=g.heritage={version:1,next:1,seed:145067,lastTick:-1,activities:{},realms:{},dynasties:{},struggles:{},artifacts:{},history:[]};
 for(const f of world.factions){a.realms[f.id]={last:{},completed:0,lastCoronation:null,celebrated:[],equipped:{},plans:null,activityRecords:[],honored:[],celebratedAge:[],seenRuler:ruler(g,f.id)?.id};dynasty(g,f.id);}
 for(const s of STRUGGLES)a.struggles[s.id]=newStruggle(s);
 return a;}
export function heritageModifiers(g,realm){const a=g.heritage,s=a?.realms[realm];if(!s)return {tax:1,levy:1,trade:1};const d=a.dynasties[realm+'|'+ruler(g,realm)?.house];let tax=1,levy=1,trade=1;
 for(const id of Object.values(s.equipped)){const item=a.artifacts[id],r=ARTIFACTS[item?.kind];if(r&&item.realm===realm&&item.durability>0){tax+=r.tax;levy+=r.levy;trade+=r.trade;}}
 for(const id of d?.legacies||[]){const l=LEGACIES[id];if(!l)continue;tax+=l.tax;levy+=l.levy;trade+=l.trade;}return {tax,levy,trade};}
function route(g,world,realm,to){const f=world.factions.find(f=>f.id===realm),land=world.provinces.filter(p=>g.provinces[p.id]?.owner===realm&&(!g.campaignWar?.occupations?.[p.id]||g.campaignWar.occupations[p.id].by===realm));if(!f||!land.length||!g.provinces[to]||g.provinces[to].owner!==realm)return null;
 const origin=land.slice().sort((a,b)=>((a.centroid[0]-f.capital[0])**2+(a.centroid[1]-f.capital[1])**2)-((b.centroid[0]-f.capital[0])**2+(b.centroid[1]-f.capital[1])**2))[0].id;
 const by=Object.fromEntries(land.map(p=>[p.id,p])),q=[[origin]],seen=new Set([origin]);while(q.length){const path=q.shift(),last=path.at(-1);if(last===to)return path;for(const n of by[last]?.neighbors||[]){if(!by[n]||seen.has(n))continue;seen.add(n);q.push([...path,n]);}}return null;}
export function activityDestinations(g,world,realm=g.player){return own(g,realm).map(p=>({id:p.id,route:route(g,world,realm,p.id)})).filter(x=>x.route);}
function recentMarriage(g,realm){const s=g.heritage.realms[realm],p=g.politics;return p.marriages.find(m=>g.year-m.year<=3&&!s.celebrated.includes(m.a+'|'+m.b)&&[m.a,m.b].some(id=>p.people[id]?.realm===realm)&&p.people[m.a]?.spouse===m.b);}
export const ACTIVITY_BUDGETS={modest:{name:'Modest',cost:0,quality:-5},standard:{name:'Standard',cost:0,quality:0},lavish:{name:'Lavish',cost:90,quality:15}};
export const ACTIVITY_ESCORTS={small:{name:'Small escort',cost:0,protection:0},guard:{name:'Household guard',cost:45,protection:25},large:{name:'Large escort',cost:90,protection:45}};
const freeAdult=(g,r,id)=>{const p=g.politics.people[id];return p?.alive&&p.realm===r&&p.age>=18&&!isImprisoned(g,id)?p:null;};
function activitySubject(g,r,kind){const s=g.heritage.realms[r],head=ruler(g,r);if(kind==='memorial')return Object.values(g.politics.people).find(p=>!p.alive&&p.house===head?.house&&!s.honored.includes(p.id));if(kind==='coming_age')return Object.values(g.politics.people).find(p=>p.alive&&p.realm===r&&p.house===head?.house&&p.id!==head.id&&p.age>=16&&p.age<=21&&!s.celebratedAge.includes(p.id));return null;}
export function activityGuests(g,r){const head=ruler(g,r);return Object.values(g.politics.people).filter(p=>p.id!==head?.id&&freeAdult(g,r,p.id)).sort((a,b)=>personalOpinion(g,head.id,b.id)-personalOpinion(g,head.id,a.id)||a.id.localeCompare(b.id)).slice(0,40);}
function travelRisk(g,path,protection=0){return cap(Math.round(path.reduce((n,id)=>n+(g.provinces[id]?.unrest||0),0)/Math.max(1,path.length)+Math.max(0,path.length-1)*2-protection),0,100);}
export function activityPlanView(g,world,r=g.player){const p=g.heritage?.realms[r]?.plans;if(!p)return null;const path=route(g,world,r,p.destination);const rule=ACTIVITIES[p.kind],budget=ACTIVITY_BUDGETS[p.budget]||ACTIVITY_BUDGETS.standard,escort=ACTIVITY_ESCORTS[p.escort]||ACTIVITY_ESCORTS.small;return {...p,path,estimatedMonths:path?2*(path.length-1)+rule.duration+1:null,risk:path?travelRisk(g,path,escort.protection):null,total:rule.cost+(path?Math.max(0,path.length-1)*15:0)+budget.cost+escort.cost+(p.invited||[]).length*12};}
function planActivity(g,world,r,kind,to,guest){const s=g.heritage.realms[r],head=ruler(g,r);if(s.plans||g.heritage.activities[r]||!ACTIVITIES[kind]||!head?.alive||head.age<18||!route(g,world,r,to))return no('Choose an eligible ruler, activity and reachable destination with no existing plan.');if(g.turn-(s.last[kind]??-1000)<24)return no('Activity is on cooldown.');if(kind==='coronation'&&s.lastCoronation===head.id)return no('Already crowned.');if(kind==='wedding'&&!recentMarriage(g,r))return no('A recent marriage is required.');if(['memorial','coming_age'].includes(kind)&&!activitySubject(g,r,kind))return no('No eligible dynastic subject.');if(kind==='summit'&&(!g.factions[guest]||guest===r||!own(g,guest).length||(g.factions[r].relations[guest]||0)<-30))return no('Select an eligible foreign guest.');s.plans={kind,destination:to,guest:kind==='summit'?guest:null,host:head.id,budget:'standard',escort:'small',invited:[],created:g.turn};return ok('Activity plan created. Choose preparations and confirm.');}
function planAction(g,world,r,action,id){const s=g.heritage.realms[r],p=s.plans;if(!p)return no('No activity plan.');if(action==='activity-plan-cancel'){s.plans=null;return ok('Plan discarded.');}if(action==='activity-budget'&&Object.hasOwn(ACTIVITY_BUDGETS,id)){p.budget=id;return ok('Budget updated.');}if(action==='activity-escort'&&Object.hasOwn(ACTIVITY_ESCORTS,id)){p.escort=id;return ok('Escort updated.');}if(action==='activity-uninvite'){p.invited=p.invited.filter(x=>x!==id);return ok('Invitation withdrawn.');}if(action==='activity-invite'){if(p.invited.length>=8||p.invited.includes(id)||!activityGuests(g,r).some(x=>x.id===id))return no('Select an eligible guest; maximum eight invitations.');p.invited.push(id);return ok('Guest invited.');}if(action==='activity-confirm'){if(ruler(g,r)?.id!==p.host)return no('The ruler has changed. Discard this plan.');const v=activityPlanView(g,world,r);if(!v?.path)return no('The destination is no longer reachable.');const result=start(g,world,r,p.kind,p.destination,p.guest,p);if(result.ok)s.plans=null;return result;}return no('Unknown planning action.');}
function start(g,world,realm,kind,to,guest,plan=null){const a=g.heritage,s=a.realms[realm],f=g.factions[realm],r=ruler(g,realm),rule=ACTIVITIES[kind],path=route(g,world,realm,to);
 if(!rule||!r?.alive||r.age<18||isImprisoned(g,r.id)||!path)return no('Choose a reachable owned destination and an eligible ruler.');
 if(a.activities[realm]||g.turn-(s.last[kind]??-1000)<24)return no('One activity at a time; each type has a two-year cooldown.');
 if(kind==='coronation'&&s.lastCoronation===r.id)return no('This ruler has already been crowned.');
 if(kind==='wedding'&&!recentMarriage(g,realm))return no('A recent uncelebrated dynastic marriage is required.');
 if(kind==='summit'&&(!g.factions[guest]||guest===realm||!g.politics.realms[guest]||!own(g,guest).length||(f.relations[guest]||0)<-30))return no('Select an eligible foreign guest.');
 const subject=activitySubject(g,realm,kind);if(['memorial','coming_age'].includes(kind)&&!subject)return no('No eligible dynastic subject.');
 const budget=ACTIVITY_BUDGETS[plan?.budget]||ACTIVITY_BUDGETS.standard,escort=ACTIVITY_ESCORTS[plan?.escort]||ACTIVITY_ESCORTS.small,invited=(plan?.invited||[]).filter(id=>freeAdult(g,realm,id)&&id!==r.id),participants=invited.filter(id=>personalOpinion(g,r.id,id)>=-20);const cost=rule.cost+Math.max(0,path.length-1)*15+budget.cost+escort.cost+invited.length*12;if(f.treasury<cost)return no('Need '+cost+' gold.');
 f.treasury-=cost;s.last[kind]=g.turn;a.activities[realm]={id:'a'+a.next++,realm,kind,host:r.id,destination:to,path,index:0,phase:plan?'preparing':path.length>1?'travel':'gathering',remaining:rule.duration,started:g.turn,cost,guest:kind==='summit'?guest:null,event:null,eventUsed:false,quality:cap(50+budget.quality,0,100),budget:plan?.budget||'standard',escort:plan?.escort||'small',risk:travelRisk(g,path,escort.protection),participants,invited,subject:subject?.id||null,marriage:kind==='wedding'?recentMarriage(g,realm).a+'|'+recentMarriage(g,realm).b:null};
 if(kind==='pilgrimage'){const sanctuary=pilgrimageSanctuary(g,realm,to);if(sanctuary)a.activities[realm].sanctuary=sanctuary;}
 record(g,realm,r.name+' began '+rule.name+'.');return ok('Activity started. Advance time to travel and attend.');
}
const INCIDENTS=[
 {id:'road',title:'A damaged road',desc:'The traveling party reaches a badly maintained crossing.',choices:[['Repair the crossing',45,12,0],['Take the slower route',0,-5,1]]},
 {id:'weather',title:'Unseasonable weather',desc:'Bad weather threatens the arrangements.',choices:[['Provide extra shelter',45,12,0],['Proceed cautiously',0,-6,1]]},
 {id:'supplies',title:'A shortage of supplies',desc:'Local suppliers cannot meet the demands of the gathering.',choices:[['Buy emergency supplies',60,15,0],['Reduce the size of the gathering',0,-10,0]]},
 {id:'delegation',title:'Unexpected delegation',desc:'Local representatives request an audience.',choices:[['Receive the delegation',35,10,0],['Keep the original schedule',0,-5,0]]},
 {id:'guest',title:'A dispute among guests',desc:'Two guests disagree over ceremonial precedence.',choices:[['Arrange a formal mediation',40,14,0],['Let the dispute pass',0,-12,0]]},
 {id:'craft',title:'A gift from local artisans',desc:'Artisans offer a ceremonial gift in exchange for royal recognition.',choices:[['Reward the artisans',50,15,0],['Accept only their greetings',0,0,0]]},
 {id:'security',title:'Security concerns',desc:'The escort reports rising tension near the gathering.',choices:[['Hire additional escorts',55,14,0],['Reduce the public procession',0,-8,0]]},
 {id:'scholar',title:'A scholar seeks an audience',desc:'A visiting scholar requests time with the ruler.',choices:[['Sponsor a public discussion',40,10,0],['Decline the meeting',0,-3,0]]},
 {id:'hospitality',title:'Hospitality of the hosts',desc:'Hosts request help covering the costs of welcoming visitors.',choices:[['Share the costs',45,12,0],['Keep to the original budget',0,-7,0]]},
 {id:'ceremony',title:'Ceremonial arrangements',desc:'The organizers propose a more elaborate ceremony.',choices:[['Approve the additions',65,16,0],['Prefer a modest ceremony',0,-4,0]]},
 {id:'music',title:'Traveling performers',desc:'Performers offer to entertain the gathering.',choices:[['Commission a performance',40,10,0],['Continue without them',0,-3,0]]},
 {id:'relief',title:'An appeal for assistance',desc:'Local residents petition for relief during the visit.',choices:[['Provide assistance',60,14,0],['Refer them to local officials',0,-9,0]]}
];
export function activityIncident(g,realm=g.player){const x=g.heritage?.activities[realm];return INCIDENTS.find(e=>e.id===x?.event?.id)||null;}
function incident(g,realm,index){const x=g.heritage.activities[realm],e=activityIncident(g,realm),ch=e?.choices[index],f=g.factions[realm];if(!Number.isInteger(index)||!ch||f.treasury<ch[1])return no('No affordable activity response.');f.treasury-=ch[1];x.quality=cap(x.quality+ch[2],0,100);x.remaining+=ch[3];if(ch[3]&&['travel','return'].includes(x.phase)){x.delay=(x.delay||0)+ch[3];x.remaining-=ch[3];}x.event=null;return ok('Activity decision recorded.');}
function finish(g,realm,x){const a=g.heritage,s=a.realms[realm],f=g.factions[realm],r=ruler(g,realm),rule=ACTIVITIES[x.kind],quality=x.quality/100+.5,d=dynasty(g,realm);f.prestige+=Math.round(rule.prestige*quality);f.legitimacy=cap(f.legitimacy+Math.round(rule.legitimacy*quality),0,100);if(r.civic)r.civic.stress=cap(r.civic.stress+rule.stress,0,100);d.renown+=Math.round(rule.renown*quality);s.completed++;
 if(x.kind==='coronation')s.lastCoronation=r.id;
 if(x.kind==='assembly'){g.identity.realms[realm].faithAuthority=cap(g.identity.realms[realm].faithAuthority+8,0,100);const local=g.civic.provinces[x.destination];if(local)local.devotion=cap(local.devotion+8,0,100);}
 if(x.kind==='symposium'){const research=g.identity.realms[realm].research;if(research)research.progress+=20;else f.prestige+=4;}
 if(x.kind==='memorial'&&x.subject)s.honored.push(x.subject);
 if(x.kind==='coming_age'&&x.subject){const p=g.politics.people[x.subject];if(p?.alive&&p.realm===realm&&p.civic){p.civic.education=cap(p.civic.education+12,0,100);s.celebratedAge.push(p.id);}}
 const attended=(x.participants||[]).filter(id=>freeAdult(g,realm,id));for(const id of attended){const p=g.politics.people[id],delta=x.quality>=55?12:x.quality<30?-8:4;if(g.chronicles)changeOpinion(g,r.id,id,delta);p.memories??=[];p.memories.push('Attended '+rule.name+' in '+g.year+'.');p.memories=p.memories.slice(-40);}
 r.memories??=[];r.memories.push('Hosted '+rule.name+' in '+g.year+' ('+x.quality+'% quality).');r.memories=r.memories.slice(-40);s.activityRecords.unshift({kind:x.kind,host:r.id,destination:x.destination,participants:attended,quality:x.quality,turn:g.turn,cost:x.cost});s.activityRecords=s.activityRecords.slice(0,20);
 if(x.kind==='wedding'&&x.marriage)s.celebrated.push(x.marriage);
 if(x.kind==='feast'||x.kind==='tour')for(const [id,h] of Object.entries(g.politics.holdings))if(h.realm===realm&&g.provinces[id]?.owner===realm)h.loyalty=cap(h.loyalty+(x.kind==='tour'?7:5),0,100);
 if(x.kind==='tournament')for(const a of Object.values(g.armies))if(a.owner===realm)a.experience=cap(a.experience+.05,0,1);
 if(x.kind==='pilgrimage'){g.civic.realms[realm].patronage=cap(g.civic.realms[realm].patronage+10,0,100);completeSacredJourney(g,realm,x);}
 if(x.kind==='summit'&&g.factions[x.guest]){const other=g.factions[x.guest];f.relations[x.guest]=cap((f.relations[x.guest]||0)+15,-100,100);other.relations[realm]=cap((other.relations[realm]||0)+15,-100,100);}
 d.gatherings=(d.gatherings||0)+1;if(d.gatherings>=5&&!d.achievements.includes('Patron of gatherings')){d.achievements.push('Patron of gatherings');d.renown+=10;}
 delete a.activities[realm];record(g,realm,rule.name+' concluded with '+x.quality+'% quality.');}
function stepActivity(g,realm,x){const a=g.heritage;if(ruler(g,realm)?.id!==x.host||!ruler(g,realm)?.alive||isImprisoned(g,x.host)||x.path.some(id=>g.provinces[id]?.owner!==realm||(g.campaignWar?.occupations?.[id]&&g.campaignWar.occupations[id].by!==realm))){delete a.activities[realm];record(g,realm,'The activity was canceled because the ruler or route changed.');return;}
 if(x.event){if(realm===g.player&&g.turn-x.event.turn<2)return;const e=activityIncident(g,realm);incident(g,realm,realm!==g.player&&g.factions[realm].treasury>400?0:e.choices.findIndex(ch=>ch[1]===0));return;}
 if(x.phase==='preparing'){x.phase=x.path.length>1?'travel':'gathering';return;}if(x.delay>0){x.delay--;return;}if(!x.eventUsed&&g.turn>x.started&&random(a)<.25+(x.risk??40)*.005){const pool=['travel','return'].includes(x.phase)?INCIDENTS.slice(0,4):INCIDENTS.slice(4);x.event={id:pool[Math.floor(random(a)*pool.length)].id,turn:g.turn};x.eventUsed=true;return;}
 if(x.phase==='travel'){x.index++;if(x.index>=x.path.length-1)x.phase='gathering';return;}
 if(x.phase==='return'){x.index--;if(x.index<=0)finish(g,realm,x);return;}
 if(--x.remaining<=0){if(x.path.length>1){x.phase='return';x.index=x.path.length-1;}else finish(g,realm,x);}}
const regionalLand=(g,r)=>own(g,r).filter(p=>!g.campaignWar?.occupations?.[p.id]||g.campaignWar.occupations[p.id].by===r);
function regionalHistory(g,x,message){x.history.unshift({turn:g.turn,message});x.history=x.history.slice(0,24);}
function domesticConditions(g,r){const holdings=Object.entries(g.politics.holdings||{}).filter(([id,h])=>h.realm===r&&g.provinces[id]?.owner===r&&h.lord!==ruler(g,r)?.id).map(([,h])=>h);const loyalty=holdings.length?holdings.reduce((n,h)=>n+h.loyalty,0)/holdings.length:65;const factions=Object.values(g.conflict.factions||{}).filter(x=>x.realm===r&&['organizing','ultimatum','civil war'].includes(x.status));const pressure=Math.max(0,...factions.map(x=>x.pressure||0));const claims=Object.values(g.feudal?.claimants||{}).filter(x=>x.realm===r&&g.politics.people[x.person]?.alive&&g.turn-x.created<180).length;return {loyalty,pressure,claims};}
export function struggleView(g,realm=g.player){return STRUGGLES.filter(d=>d.members.includes(realm)).map(d=>({...d,model:STRUGGLE_MODELS[d.id],state:g.heritage.struggles[d.id]}));}
function regionalEffect(g,realm,def,model){const f=g.factions[realm],land=regionalLand(g,realm);if(model.effect==='estates'){for(const p of land){const h=g.politics.holdings[p.id];if(h?.realm===realm)h.loyalty=cap(h.loyalty+5,0,100);}if(def.domestic)for(const x of Object.values(g.conflict.factions||{}))if(x.realm===realm&&['organizing','ultimatum'].includes(x.status))x.pressure=cap(x.pressure-8,0,100);}
 if(model.effect==='tolerance')for(const p of land){const l=g.civic.provinces[p.id];if(l&&(l.culture!==g.civic.realms[realm].culture||l.faith!==g.civic.realms[realm].faith)){l.acceptance=cap(l.acceptance+5,0,100);l.localTrust=cap(l.localTrust+4,0,100);}}
 if(model.effect==='stability'){f.stability=cap(f.stability+3,0,100);for(const p of land){p.unrest=cap(p.unrest-3,0,100);}}
 if(model.effect==='prestige')f.prestige+=8;
 if(model.effect==='commerce'){const eco=g.economy?.realms?.[realm];if(eco)eco.credit=cap(eco.credit+7,0,100);}
 if(['diplomacy','commerce'].includes(model.effect))for(const id of def.members){if(id===realm||!g.factions[id]||!own(g,id).length)continue;const o=g.factions[id];f.relations[id]=cap((f.relations[id]||0)+5,-100,100);o.relations[realm]=cap((o.relations[realm]||0)+5,-100,100);}
}
function struggleAction(g,realm,id,kind){const a=g.heritage,x=a.struggles[id],def=STRUGGLES.find(s=>s.id===id),f=g.factions[realm],model=STRUGGLE_MODELS[id];if(!x||!def?.members.includes(realm)||x.ended!==null||!regionalLand(g,realm).length)return no('No active regional struggle for this realm.');if(g.turn-(x.last[realm]??-1000)<12)return no('Regional initiatives have a yearly cooldown.');
 const rules={mediation:[120,-12,20,10],pressure:[140,18,-8,16],commerce:[150,-5,14,12]};if(kind==='special'){if(!model.phases.includes(x.phase))return no('The regional initiative is unavailable in the current phase.');rules.special=[model.cost,-14,16,15];}const r=rules[kind];if(!r||f.treasury<r[0])return no('Invalid or unaffordable regional initiative.');f.treasury-=r[0];x.last[realm]=g.turn;x.tension=cap(x.tension+r[1],0,100);x.cooperation=cap(x.cooperation+r[2],0,100);x.influence[realm]=(x.influence[realm]||0)+r[3];if(kind==='mediation')f.legitimacy=cap(f.legitimacy+3,0,100);if(kind==='commerce')f.prestige+=4;if(kind==='special')regionalEffect(g,realm,def,model);regionalHistory(g,x,realm+': '+(kind==='special'?model.title:kind));record(g,realm,def.name+': '+kind+' initiative.');return ok('Regional initiative completed.');}
function settleRegional(g,a,def,x,members,kind,leader=null){x.phase=kind==='negotiated'?'settlement':'resolved';x.ended=g.turn;x.outcome={kind,leader,turn:g.turn,cycle:x.cycle};regionalHistory(g,x,'Outcome: '+kind+(leader?' · '+leader:''));for(const id of members){const f=g.factions[id];if(kind==='negotiated'){f.legitimacy=cap(f.legitimacy+6,0,100);dynasty(g,id).renown+=8;}else if(id===leader){f.prestige+=12;dynasty(g,id).renown+=12;}else if(kind==='dominance')f.stability=cap(f.stability-4,0,100);}if(members.includes(g.player))record(g,g.player,def.name+' resolved: '+kind+'.');}
function stepStruggles(g){const a=g.heritage;for(const def of STRUGGLES){const x=a.struggles[def.id],model=STRUGGLE_MODELS[def.id],members=def.members.filter(id=>g.factions[id]&&regionalLand(g,id).length),minimum=def.domestic?1:2;
 if(x.ended!==null){if(g.turn-x.ended>=60&&members.length>=minimum){x.ended=null;x.phase='competition';x.tension=30;x.cooperation=30;x.cycle++;x.influence=Object.fromEntries(def.members.map(id=>[id,0]));x.last={};x.outcome=null;regionalHistory(g,x,'New regional cycle');}continue;}
 if(members.length<minimum){settleRegional(g,a,def,x,members,'participant loss',members[0]||null);continue;}let wars=0,treaties=0;for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){const p=members[i],q=members[j];if(Object.values(g.conflict.wars).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(p)&&[w.attacker,w.defender].includes(q)))wars++;if(g.factions[p].treaties[q]==='alliance'||g.kingdom.tradePacts[[p,q].sort().join('|')])treaties++;}
 const [warWeight,treatyWeight,cooperationWeight]=model.weights;let tension=wars*warWeight+treaties*treatyWeight+(wars?1:0),cooperation=treaties*cooperationWeight-wars*2;x.catalysts=[...(wars?[{name:'Active regional wars',value:wars}]:[]),...(treaties?[{name:'Regional agreements',value:treaties}]:[])];
 if(def.domestic){const d=domesticConditions(g,members[0]);tension+=(d.pressure>=50?4:0)+(d.loyalty<40?4:d.loyalty>=70?-2:0)+(d.claims>=2?2:0);cooperation+=d.loyalty>=65&&d.pressure<30?3:d.pressure>=60?-3:0;x.catalysts.push({name:'Estate loyalty',value:Math.round(d.loyalty)},{name:'Faction pressure',value:Math.round(d.pressure)},{name:'Living claimants',value:d.claims});}
 x.tension=cap(x.tension+tension,0,100);x.cooperation=cap(x.cooperation+cooperation,0,100);
 for(const id of members){x.influence[id]=(x.influence[id]||0)+Math.max(1,Math.round(regionalLand(g,id).length/3));if(id!==g.player&&g.turn%12===0&&g.factions[id].treasury>600&&random(a)<.30)struggleAction(g,id,def.id,model.phases.includes(x.phase)&&random(a)<.5?'special':x.tension>55?'mediation':random(a)<.5?'commerce':'pressure');}
 const previous=x.phase;x.phase=x.tension>=70?'hostility':x.cooperation>=65&&x.tension<45?'conciliation':x.tension>=45?'rivalry':'competition';
 if(previous!==x.phase){regionalHistory(g,x,'Entered '+x.phase);if(members.includes(g.player))record(g,g.player,def.name+' entered '+x.phase+'.');}
 if(x.phase==='conciliation'&&x.cooperation>=90){settleRegional(g,a,def,x,members,'negotiated');continue;}
 if(!def.domestic&&x.phase==='hostility'&&x.tension>=90&&x.cooperation<=15){const ranked=members.slice().sort((a,b)=>x.influence[b]-x.influence[a]||a.localeCompare(b));const leader=ranked[0],total=members.reduce((n,id)=>n+regionalLand(g,id).length,0);if(x.influence[leader]>=150&&x.influence[leader]>=2*Math.max(1,x.influence[ranked[1]])&&regionalLand(g,leader).length>=total*.55)settleRegional(g,a,def,x,members,'dominance',leader);}
 }}
export function unlockLegacy(g,realm,id){const d=dynasty(g,realm),l=LEGACIES[id];if(!l||d.legacies.includes(id)||d.renown<l.cost||l.requires&&!d.legacies.includes(l.requires))return no('Requires an unlearned legacy, its prerequisite and sufficient dynastic renown.');d.renown-=l.cost;d.legacies.push(id);record(g,realm,'Dynastic legacy unlocked: '+l.name+'.');return ok('Dynastic legacy unlocked.');}
export function heritageAction(g,world,action,id,extra,guest){const a=initHeritage(g,world),realm=g.player,s=a.realms[realm],f=g.factions[realm],d=dynasty(g,realm);
 if(action==='activity-plan')return planActivity(g,world,realm,id,extra,guest);
 if(action.startsWith('activity-'))return planAction(g,world,realm,action,id||extra);
 if(action==='activity')return start(g,world,realm,id,extra,guest);
 if(action==='incident')return incident(g,realm,Number(id));
 if(action==='initiative')return struggleAction(g,realm,id,extra);
 if(action==='artifact'){const rule=ARTIFACTS[id];if(!rule||f.treasury<rule.cost||Object.values(a.artifacts).some(x=>x.realm===realm&&x.kind===id&&x.durability>0))return no('Need sufficient gold and no intact duplicate artifact.');f.treasury-=rule.cost;const key='r'+a.next++;a.artifacts[key]={id:key,kind:id,realm,creator:ruler(g,realm).id,owner:ruler(g,realm).id,origin:realm,culture:g.civic.realms[realm].culture,year:g.year,durability:100,history:[{turn:g.turn,message:'Commissioned by '+ruler(g,realm).name}]};s.equipped[rule.slot]=key;d.renown+=5;return ok(rule.name+' commissioned and equipped.');}
 if(action==='equip'){const x=a.artifacts[id],rule=ARTIFACTS[x?.kind];if(!x||x.realm!==realm||x.durability<=0||!rule)return no('Select an intact artifact of your realm.');s.equipped[rule.slot]=id;x.history??=[];x.history.unshift({turn:g.turn,message:'Equipped by '+ruler(g,realm).name});x.history=x.history.slice(0,20);return ok('Artifact equipped.');}
 if(action==='repair'){const x=a.artifacts[id];if(!x||x.realm!==realm||x.durability>=100||f.treasury<80)return no('Artifact repair requires 80 gold and damage.');f.treasury-=80;x.durability=cap(x.durability+35,0,100);x.history??=[];x.history.unshift({turn:g.turn,message:'Restored by '+ruler(g,realm).name});x.history=x.history.slice(0,20);return ok('Artifact restored.');}
 if(action==='legacy')return unlockLegacy(g,realm,id);
 return no('Unknown activity or heritage decision.');}
export function tickHeritage(g,world){const a=initHeritage(g,world);if(a.lastTick===g.turn)return;a.lastTick=g.turn;
 for(const [realm,s] of Object.entries(a.realms)){const r=ruler(g,realm),d=dynasty(g,realm),f=g.factions[realm];if(!r)continue;if(s.seenRuler!==r.id){s.seenRuler=r.id;d.renown+=5;for(const x of Object.values(a.artifacts).filter(x=>x.realm===realm)){x.owner=r.id;x.history??=[];x.history.unshift({turn:g.turn,message:'Entrusted to the new sovereign '+r.name});x.history=x.history.slice(0,20);}}
 if(a.activities[realm])stepActivity(g,realm,a.activities[realm]);
 else if(realm!==g.player&&g.turn%12===0&&f.treasury>600&&own(g,realm).length&&random(a)<.22){const destinations=activityDestinations(g,world,realm);if(destinations.length){const kind=s.lastCoronation!==r.id?'coronation':['feast','hunt','tour','pilgrimage','tournament','assembly','symposium','memorial','coming_age'][hash(realm+g.turn)%9];start(g,world,realm,kind,destinations[hash(realm+g.turn)%destinations.length].id);}}
 if(g.turn%12===0){if(realm!==g.player){const preference={martial:'warfare',stewardship:'statecraft',learning:'scholarship',diplomacy:'commerce',intrigue:'statecraft'}[r.civic?.focus]||'statecraft',options=Object.keys(LEGACIES).filter(id=>!d.legacies.includes(id)&&d.renown>=LEGACIES[id].cost&&(!LEGACIES[id].requires||d.legacies.includes(LEGACIES[id].requires)));const next=options.find(id=>id===preference||id.startsWith(preference+'_'))||options[0];if(next)unlockLegacy(g,realm,next);}for(const id of Object.values(s.equipped)){const x=a.artifacts[id],rule=ARTIFACTS[x?.kind];if(x&&rule&&x.durability>0){x.durability=cap(x.durability-4,0,100);f.prestige+=rule.prestige;}}if(own(g,realm).length>=10&&!d.achievements.includes('Realm builder')){d.achievements.push('Realm builder');d.renown+=15;}}
 }
 if(g.turn%3===0)stepStruggles(g);
}
