// Alternate-history regional politics and character activities. Serializable and deterministic.
import {pilgrimageSanctuary,completeSacredJourney} from './faith-institutions.js';
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
 summit:{name:'Diplomatic summit',cost:190,duration:3,prestige:10,legitimacy:4,stress:5,renown:8}
};
export const STRUGGLES=[
 {id:'western_succession',name:'Western crowns and succession',members:['england','france','burgundy'],desc:'Rival royal houses contest legitimacy, frontier control and negotiated settlement.'},
 {id:'iberian_balance',name:'Iberian balance of power',members:['castile','aragon','portugal','morocco'],desc:'The western Mediterranean and Atlantic-facing crowns compete for influence and access.'},
 {id:'eastern_frontier',name:'Eastern European frontier',members:['poland','muscovy','novgorod','horde','imperial'],desc:'Neighboring crowns negotiate borders, tribute and the security of frontier communities.'},
 {id:'eastern_mediterranean',name:'Eastern Mediterranean rivalry',members:['ottomans','mamluks','qara','timurids'],desc:'Competing imperial ambitions put pressure on strategic routes and provincial loyalties.'},
 {id:'deccan',name:'Deccan rivalry',members:['vijayanagara','bahmani','delhi','gujarat','bengal'],desc:'Regional powers compete over strongholds, trade and influence across the subcontinent.'},
 {id:'steppe',name:'Steppe and imperial frontiers',members:['timurids','qara','horde','muscovy'],desc:'Confederations and expanding courts contend for local allegiance and military influence.'},
 {id:'east_asia',name:'East Asian court diplomacy',members:['ming','joseon','ashikaga','dai-viet'],desc:'Courts balance diplomatic recognition, commerce and regional security.'},
 {id:'maritime_asia',name:'Maritime Southeast Asian networks',members:['malacca','majapahit','ayutthaya','dai-viet'],desc:'Ports and inland courts compete for commercial influence.'},
 {id:'sahel',name:'Sahel trade and authority',members:['mali','songhai','morocco'],desc:'Control of trade networks and regional authority shapes political competition.'},
 {id:'mesoamerica',name:'Mesoamerican political networks',members:['mexica','maya','pueblo'],desc:'Distinct polities balance local autonomy and political influence in an abstract regional scenario.'},
 {id:'andes',name:'Andean consolidation',members:['inca','muisca','mapuche'],desc:'Regional powers contend over local autonomy and expanding networks of authority.'}
];
const ARTIFACTS={regalia:{name:'Ceremonial regalia',cost:260,slot:'regalia',tax:0,levy:0,trade:0,prestige:2},standard:{name:'Royal battle standard',cost:230,slot:'standard',tax:0,levy:.06,trade:0,prestige:1},ledger:{name:'Master accounting manuscript',cost:210,slot:'book',tax:.06,levy:0,trade:0,prestige:1},charter:{name:'Illuminated merchant charter',cost:240,slot:'charter',tax:0,levy:0,trade:.12,prestige:1},chronicle:{name:'Dynastic chronicle',cost:250,slot:'book',tax:0,levy:0,trade:0,prestige:3}};
export const RELICS=ARTIFACTS;
export const LEGACIES={statecraft:{name:'Statecraft',cost:45,tax:.04,levy:0,trade:0},warfare:{name:'Military heritage',cost:45,tax:0,levy:.05,trade:0},commerce:{name:'Commercial heritage',cost:45,tax:0,levy:0,trade:.08},scholarship:{name:'Scholarly heritage',cost:45,tax:.02,levy:0,trade:0},
 statecraft_2:{name:'Established administration',requires:'statecraft',cost:90,tax:.05,levy:0,trade:0},warfare_2:{name:'Professional military heritage',requires:'warfare',cost:90,tax:0,levy:.07,trade:0},commerce_2:{name:'Established commercial networks',requires:'commerce',cost:90,tax:0,levy:0,trade:.10},scholarship_2:{name:'Enduring scholarly institutions',requires:'scholarship',cost:90,tax:.04,levy:0,trade:.03},
 statecraft_3:{name:'Administrative tradition',requires:'statecraft_2',cost:150,tax:.07,levy:0,trade:0},warfare_3:{name:'Renowned military tradition',requires:'warfare_2',cost:150,tax:0,levy:.09,trade:0},commerce_3:{name:'Commercial tradition',requires:'commerce_2',cost:150,tax:0,levy:0,trade:.12},scholarship_3:{name:'Scholarly tradition',requires:'scholarship_2',cost:150,tax:.05,levy:0,trade:.04}};
function record(g,realm,message){const a=g.heritage;a.history.unshift({realm,turn:g.turn,message});a.history=a.history.slice(0,200);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
function random(a){a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;return a.seed/4294967296;}
function dynasty(g,realm){const house=ruler(g,realm)?.house||realm,key=realm+'|'+house;return g.heritage.dynasties[key]??={realm,house,renown:0,legacies:[],achievements:[]};}
export function initHeritage(g,world){if(g.heritage?.version===1)return g.heritage;const a=g.heritage={version:1,next:1,seed:145067,lastTick:-1,activities:{},realms:{},dynasties:{},struggles:{},artifacts:{},history:[]};
 for(const f of world.factions){a.realms[f.id]={last:{},completed:0,lastCoronation:null,celebrated:[],equipped:{},seenRuler:ruler(g,f.id)?.id};dynasty(g,f.id);}
 for(const s of STRUGGLES)a.struggles[s.id]={id:s.id,phase:'competition',tension:35,cooperation:30,cycle:1,influence:Object.fromEntries(s.members.map(id=>[id,0])),last:{},ended:null};
 return a;}
export function heritageModifiers(g,realm){const a=g.heritage,s=a?.realms[realm];if(!s)return {tax:1,levy:1,trade:1};const d=a.dynasties[realm+'|'+ruler(g,realm)?.house];let tax=1,levy=1,trade=1;
 for(const id of Object.values(s.equipped)){const item=a.artifacts[id],r=ARTIFACTS[item?.kind];if(r&&item.realm===realm&&item.durability>0){tax+=r.tax;levy+=r.levy;trade+=r.trade;}}
 for(const id of d?.legacies||[]){const l=LEGACIES[id];if(!l)continue;tax+=l.tax;levy+=l.levy;trade+=l.trade;}return {tax,levy,trade};}
function route(g,world,realm,to){const f=world.factions.find(f=>f.id===realm),land=world.provinces.filter(p=>g.provinces[p.id]?.owner===realm);if(!land.length||!g.provinces[to]||g.provinces[to].owner!==realm)return null;
 const origin=land.slice().sort((a,b)=>((a.centroid[0]-f.capital[0])**2+(a.centroid[1]-f.capital[1])**2)-((b.centroid[0]-f.capital[0])**2+(b.centroid[1]-f.capital[1])**2))[0].id;
 const by=Object.fromEntries(land.map(p=>[p.id,p])),q=[[origin]],seen=new Set([origin]);while(q.length){const path=q.shift(),last=path.at(-1);if(last===to)return path;for(const n of by[last]?.neighbors||[]){if(!by[n]||seen.has(n))continue;seen.add(n);q.push([...path,n]);}}return null;}
export function activityDestinations(g,world,realm=g.player){return own(g,realm).map(p=>({id:p.id,route:route(g,world,realm,p.id)})).filter(x=>x.route);}
function recentMarriage(g,realm){const s=g.heritage.realms[realm],p=g.politics;return p.marriages.find(m=>g.year-m.year<=3&&!s.celebrated.includes(m.a+'|'+m.b)&&[m.a,m.b].some(id=>p.people[id]?.realm===realm)&&p.people[m.a]?.spouse===m.b);}
function start(g,world,realm,kind,to,guest){const a=g.heritage,s=a.realms[realm],f=g.factions[realm],r=ruler(g,realm),rule=ACTIVITIES[kind],path=route(g,world,realm,to);
 if(!rule||!r?.alive||r.age<18||!path)return no('Choose a reachable owned destination and an eligible ruler.');
 if(a.activities[realm]||g.turn-(s.last[kind]??-1000)<24)return no('One activity at a time; each type has a two-year cooldown.');
 if(kind==='coronation'&&s.lastCoronation===r.id)return no('This ruler has already been crowned.');
 if(kind==='wedding'&&!recentMarriage(g,realm))return no('A recent uncelebrated dynastic marriage is required.');
 if(kind==='summit'&&(!g.factions[guest]||guest===realm||!g.politics.realms[guest]||!own(g,guest).length||(f.relations[guest]||0)<-30))return no('Select an eligible foreign guest.');
 const cost=rule.cost+Math.max(0,path.length-1)*15;if(f.treasury<cost)return no('Need '+cost+' gold.');
 f.treasury-=cost;s.last[kind]=g.turn;a.activities[realm]={id:'a'+a.next++,realm,kind,host:r.id,destination:to,path,index:0,phase:path.length>1?'travel':'gathering',remaining:rule.duration,started:g.turn,cost,guest:kind==='summit'?guest:null,event:null,eventUsed:false,quality:50,marriage:kind==='wedding'?recentMarriage(g,realm).a+'|'+recentMarriage(g,realm).b:null};
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
function incident(g,realm,index){const x=g.heritage.activities[realm],e=activityIncident(g,realm),ch=e?.choices[index],f=g.factions[realm];if(!Number.isInteger(index)||!ch||f.treasury<ch[1])return no('No affordable activity response.');f.treasury-=ch[1];x.quality=cap(x.quality+ch[2],0,100);x.remaining+=ch[3];if(ch[3]&&x.phase==='travel'){x.delay=(x.delay||0)+ch[3];x.remaining-=ch[3];}x.event=null;return ok('Activity decision recorded.');}
function finish(g,realm,x){const a=g.heritage,s=a.realms[realm],f=g.factions[realm],r=ruler(g,realm),rule=ACTIVITIES[x.kind],quality=x.quality/100+.5,d=dynasty(g,realm);f.prestige+=Math.round(rule.prestige*quality);f.legitimacy=cap(f.legitimacy+Math.round(rule.legitimacy*quality),0,100);if(r.civic)r.civic.stress=cap(r.civic.stress+rule.stress,0,100);d.renown+=Math.round(rule.renown*quality);s.completed++;
 if(x.kind==='coronation')s.lastCoronation=r.id;if(x.kind==='wedding'&&x.marriage)s.celebrated.push(x.marriage);
 if(x.kind==='feast'||x.kind==='tour')for(const [id,h] of Object.entries(g.politics.holdings))if(h.realm===realm&&g.provinces[id]?.owner===realm)h.loyalty=cap(h.loyalty+(x.kind==='tour'?7:5),0,100);
 if(x.kind==='tournament')for(const a of Object.values(g.armies))if(a.owner===realm)a.experience=cap(a.experience+.05,0,1);
 if(x.kind==='pilgrimage'){g.civic.realms[realm].patronage=cap(g.civic.realms[realm].patronage+10,0,100);completeSacredJourney(g,realm,x);}
 if(x.kind==='summit'&&g.factions[x.guest]){const other=g.factions[x.guest];f.relations[x.guest]=cap((f.relations[x.guest]||0)+15,-100,100);other.relations[realm]=cap((other.relations[realm]||0)+15,-100,100);}
 d.gatherings=(d.gatherings||0)+1;if(d.gatherings>=5&&!d.achievements.includes('Patron of gatherings')){d.achievements.push('Patron of gatherings');d.renown+=10;}
 delete a.activities[realm];record(g,realm,rule.name+' concluded with '+x.quality+'% quality.');}
function stepActivity(g,realm,x){const a=g.heritage;if(ruler(g,realm)?.id!==x.host||x.path.some(id=>g.provinces[id]?.owner!==realm)){delete a.activities[realm];record(g,realm,'The activity was canceled because the ruler or route changed.');return;}
 if(x.event){if(realm===g.player&&g.turn-x.event.turn<2)return;const e=activityIncident(g,realm);incident(g,realm,realm!==g.player&&g.factions[realm].treasury>400?0:e.choices.findIndex(ch=>ch[1]===0));return;}
 if(x.delay>0){x.delay--;return;}if(!x.eventUsed&&g.turn>x.started&&random(a)<.45){const pool=x.phase==='travel'?INCIDENTS.slice(0,4):INCIDENTS.slice(4);x.event={id:pool[Math.floor(random(a)*pool.length)].id,turn:g.turn};x.eventUsed=true;return;}
 if(x.phase==='travel'){x.index++;if(x.index>=x.path.length-1)x.phase='gathering';return;}
 if(--x.remaining<=0)finish(g,realm,x);}
export function struggleView(g,realm=g.player){return STRUGGLES.filter(d=>d.members.includes(realm)).map(d=>({...d,state:g.heritage.struggles[d.id]}));}
function struggleAction(g,realm,id,kind){const a=g.heritage,x=a.struggles[id],def=STRUGGLES.find(s=>s.id===id),f=g.factions[realm];if(!x||!def?.members.includes(realm)||x.ended!==null||!own(g,realm).length)return no('No active regional struggle for this realm.');if(g.turn-(x.last[realm]??-1000)<12)return no('Regional initiatives have a yearly cooldown.');
 const rules={mediation:[120,-12,20,10],pressure:[140,18,-8,16],commerce:[150,-5,14,12]};const r=rules[kind];if(!r||f.treasury<r[0])return no('Invalid or unaffordable regional initiative.');f.treasury-=r[0];x.last[realm]=g.turn;x.tension=cap(x.tension+r[1],0,100);x.cooperation=cap(x.cooperation+r[2],0,100);x.influence[realm]+=r[3];if(kind==='mediation')f.legitimacy=cap(f.legitimacy+3,0,100);if(kind==='commerce')f.prestige+=4;record(g,realm,def.name+': '+kind+' initiative.');return ok('Regional initiative completed.');}
function stepStruggles(g){const a=g.heritage;for(const def of STRUGGLES){const x=a.struggles[def.id],members=def.members.filter(id=>g.factions[id]&&own(g,id).length);
 if(x.ended!==null){if(g.turn-x.ended>=60&&members.length>=2){x.ended=null;x.phase='competition';x.tension=30;x.cooperation=30;x.cycle++;x.influence=Object.fromEntries(def.members.map(id=>[id,0]));}continue;}
 if(members.length<2){x.phase='resolved';x.ended=g.turn;continue;}let wars=0,treaties=0;for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){const p=members[i],q=members[j];if(Object.values(g.conflict.wars).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(p)&&[w.attacker,w.defender].includes(q)))wars++;if(g.factions[p].treaties[q]==='alliance'||g.kingdom.tradePacts[[p,q].sort().join('|')])treaties++;}
 x.tension=cap(x.tension+wars*4-treaties*2+(wars?1:0),0,100);x.cooperation=cap(x.cooperation+treaties*3-wars*2,0,100);
 for(const id of members){x.influence[id]+=Math.max(1,Math.round(own(g,id).length/3));if(id!==g.player&&g.turn%12===0&&g.factions[id].treasury>600&&random(a)<.30)struggleAction(g,id,def.id,x.tension>55?'mediation':random(a)<.5?'commerce':'pressure');}
 const previous=x.phase;x.phase=x.tension>=70?'hostility':x.cooperation>=65&&x.tension<45?'conciliation':x.tension>=45?'rivalry':'competition';
 if(previous!==x.phase&&members.includes(g.player))record(g,g.player,def.name+' entered '+x.phase+'.');
 if(x.phase==='conciliation'&&x.cooperation>=90){x.phase='settlement';x.ended=g.turn;for(const id of members){g.factions[id].legitimacy=cap(g.factions[id].legitimacy+6,0,100);dynasty(g,id).renown+=8;}if(members.includes(g.player))record(g,g.player,def.name+' reached a negotiated settlement.');}
 }}
export function unlockLegacy(g,realm,id){const d=dynasty(g,realm),l=LEGACIES[id];if(!l||d.legacies.includes(id)||d.renown<l.cost||l.requires&&!d.legacies.includes(l.requires))return no('Requires an unlearned legacy, its prerequisite and sufficient dynastic renown.');d.renown-=l.cost;d.legacies.push(id);record(g,realm,'Dynastic legacy unlocked: '+l.name+'.');return ok('Dynastic legacy unlocked.');}
export function heritageAction(g,world,action,id,extra,guest){const a=initHeritage(g,world),realm=g.player,s=a.realms[realm],f=g.factions[realm],d=dynasty(g,realm);
 if(action==='activity')return start(g,world,realm,id,extra,guest);
 if(action==='incident')return incident(g,realm,Number(id));
 if(action==='initiative')return struggleAction(g,realm,id,extra);
 if(action==='artifact'){const rule=ARTIFACTS[id];if(!rule||f.treasury<rule.cost||Object.values(a.artifacts).some(x=>x.realm===realm&&x.kind===id&&x.durability>0))return no('Need sufficient gold and no intact duplicate artifact.');f.treasury-=rule.cost;const key='r'+a.next++;a.artifacts[key]={id:key,kind:id,realm,creator:ruler(g,realm).id,year:g.year,durability:100};s.equipped[rule.slot]=key;d.renown+=5;return ok(rule.name+' commissioned and equipped.');}
 if(action==='equip'){const x=a.artifacts[id],rule=ARTIFACTS[x?.kind];if(!x||x.realm!==realm||x.durability<=0||!rule)return no('Select an intact artifact of your realm.');s.equipped[rule.slot]=id;return ok('Artifact equipped.');}
 if(action==='repair'){const x=a.artifacts[id];if(!x||x.realm!==realm||x.durability>=100||f.treasury<80)return no('Artifact repair requires 80 gold and damage.');f.treasury-=80;x.durability=cap(x.durability+35,0,100);return ok('Artifact restored.');}
 if(action==='legacy')return unlockLegacy(g,realm,id);
 return no('Unknown activity or heritage decision.');}
export function tickHeritage(g,world){const a=initHeritage(g,world);if(a.lastTick===g.turn)return;a.lastTick=g.turn;
 for(const [realm,s] of Object.entries(a.realms)){const r=ruler(g,realm),d=dynasty(g,realm),f=g.factions[realm];if(!r)continue;if(s.seenRuler!==r.id){s.seenRuler=r.id;d.renown+=5;}
 if(a.activities[realm])stepActivity(g,realm,a.activities[realm]);
 else if(realm!==g.player&&g.turn%12===0&&f.treasury>600&&own(g,realm).length&&random(a)<.22){const destinations=activityDestinations(g,world,realm);if(destinations.length){const kind=s.lastCoronation!==r.id?'coronation':['feast','hunt','tour','pilgrimage','tournament'][hash(realm+g.turn)%5];start(g,world,realm,kind,destinations[hash(realm+g.turn)%destinations.length].id);}}
 if(g.turn%12===0){if(realm!==g.player){const preference={martial:'warfare',stewardship:'statecraft',learning:'scholarship',diplomacy:'commerce',intrigue:'statecraft'}[r.civic?.focus]||'statecraft',options=Object.keys(LEGACIES).filter(id=>!d.legacies.includes(id)&&d.renown>=LEGACIES[id].cost&&(!LEGACIES[id].requires||d.legacies.includes(LEGACIES[id].requires)));const next=options.find(id=>id===preference||id.startsWith(preference+'_'))||options[0];if(next)unlockLegacy(g,realm,next);}for(const id of Object.values(s.equipped)){const x=a.artifacts[id],rule=ARTIFACTS[x?.kind];if(x&&rule&&x.durability>0){x.durability=cap(x.durability-4,0,100);f.prestige+=rule.prestige;}}if(own(g,realm).length>=10&&!d.achievements.includes('Realm builder')){d.achievements.push('Realm builder');d.renown+=15;}}
 }
 if(g.turn%3===0)stepStruggles(g);
}
