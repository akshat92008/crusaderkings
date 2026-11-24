import {councilPermission} from './political-conflict.js';
// Persistent fictional characters and provincial political institutions.
// No external services; all state is plain JSON. Province ownership stays sovereign-level.
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
const traits=['ambitious','content','just','arbitrary','generous','greedy','brave','cautious','diligent','indolent','honest','deceitful','patient','wrathful','gregarious','reserved'];
const pools={Europe:['Ada','Hugh','Eleanor','Robert','Isabel','Edmund','Margaret','Henry'],Asia:['Anika','Farid','Meera','Yusuf','Kamala','Arslan','Soraya','Jahan'],Africa:['Amina','Idris','Zahra','Kofi','Dalia','Mekonnen'],'North America':['Itzel','Tecuani','Citlali','Aketzali'],'South America':['Killa','Amaru','Chaska','Tupaq'],Oceania:['Moana','Tama','Rangi','Aroha']};
const pick=(xs,n)=>xs[n%xs.length];
const live=(p,id)=>p.people[id]?.alive?p.people[id]:null;
const roll=p=>{p.seed=(Math.imul(p.seed,1664525)+1013904223)>>>0;return p.seed/4294967296;};
function log(g,s){g.log.unshift({date:g.year+' · month '+(g.month+1),text:s});g.log=g.log.slice(0,45);}
function person(g,world,realm,age,opts={}){
 const p=g.politics,id='c'+p.next++,n=hash(realm+id),f=world.factions.find(x=>x.id===realm);
 const c={id,realm,house:opts.house||'House of '+f.name,name:opts.name||pick(pools[f.continent]||pools.Europe,n)+' '+id,age,alive:true,sex:opts.sex||((n&1)?'female':'male'),parents:opts.parents||[],children:[],spouse:null,traits:[pick(traits,n),pick(traits,n>>>8)].filter((x,i,a)=>a.indexOf(x)===i),skills:{diplomacy:1+n%5,martial:1+(n>>>5)%5,stewardship:1+(n>>>10)%5,intrigue:1+(n>>>15)%5,learning:1+(n>>>20)%5},wealth:100,claims:[],memories:[],...opts};
 p.people[id]=c;for(const parent of c.parents)if(p.people[parent])p.people[parent].children.push(id);return c;
}
function link(a,b){a.spouse=b.id;b.spouse=a.id;}
function ancestors(p,c,depth=3){if(!c||depth<=0)return [];return c.parents.flatMap(id=>[id,...ancestors(p,p.people[id],depth-1)]);}
function eligible(p,a,b){return a&&b&&a.alive&&b.alive&&a.id!==b.id&&a.age>=18&&b.age>=18&&!a.spouse&&!b.spouse&&a.sex!==b.sex&&!a.parents.includes(b.id)&&!b.parents.includes(a.id)&&!ancestors(p,a).includes(b.id)&&!ancestors(p,b).includes(a.id)&&!ancestors(p,a).some(x=>ancestors(p,b).includes(x));}
function children(p,r){return r.children.map(id=>live(p,id)).filter(Boolean);}
function heirs(p,r){return children(p,r).filter(c=>c.house===r.house).sort((a,b)=>b.age-a.age||a.id.localeCompare(b.id));}
function successor(p,realm){const s=p.realms[realm],r=p.people[s.ruler],kids=heirs(p,r);if(s.law==='youngest')return kids.at(-1);if(s.law==='elective'){const options=[...kids,...Object.values(p.holdings).filter(v=>v.realm===realm).map(v=>live(p,v.lord)).filter(Boolean)];return options.sort((a,b)=>b.skills.diplomacy+b.skills.martial-a.skills.diplomacy-a.skills.martial)[0];}return kids[0];}
function sync(g,realm){const p=g.politics,s=p.realms[realm],r=p.people[s.ruler],old=g.kingdom.courts[realm];if(!old||!r)return;const h=successor(p,realm);old.dynasty=r.house;old.ruler={name:r.name,age:r.age,...r.skills};old.heir=h?{name:h.name,age:h.age}:{name:'No eligible child',age:0};old.steward=live(p,s.council.steward)?.skills.stewardship||1;old.marshal=live(p,s.council.marshal)?.skills.martial||1;}
function newHolding(g,world,id){const p=g.politics,pr=g.provinces[id],realm=pr.owner;if(!p.realms[realm]){delete p.holdings[id];return;}const lord=person(g,world,realm,30+hash(id)%25,{house:'House of '+id.toUpperCase()});const child=person(g,world,realm,12+hash(id+'child')%12,{house:lord.house,parents:[lord.id]});p.holdings[id]={realm,lord:lord.id,loyalty:65,tax:1,levy:1,autonomy:1,wealth:0,concessionUntil:0};}
export function initPolitics(g,world){
 if(g.politics?.version===1)return g.politics;
 const p=g.politics={version:1,next:1,seed:145012,people:{},realms:{},holdings:{},situations:{},marriages:[],lastTick:-1};
 for(const f of world.factions){
  const old=g.kingdom.courts[f.id],r=person(g,world,f.id,old.ruler.age,{name:old.ruler.name,sex:'male',house:old.dynasty,skills:{diplomacy:old.ruler.diplomacy,martial:old.ruler.martial,stewardship:old.ruler.stewardship,intrigue:2,learning:2}}),wife=person(g,world,f.id,Math.max(18,r.age-4),{sex:'female',house:'Consort house of '+f.name});link(r,wife);
  const parent=person(g,world,f.id,r.age+23,{house:r.house});r.parents.push(parent.id);parent.children.push(r.id);person(g,world,f.id,Math.max(18,r.age-8),{house:r.house,sex:'female',parents:[parent.id]});person(g,world,f.id,Math.max(18,r.age-5),{house:r.house,sex:'male',parents:[parent.id]});
  const h=person(g,world,f.id,Math.min(old.heir.age,Math.max(1,r.age-18),Math.max(1,wife.age-18)),{name:old.heir.name,house:r.house,parents:[r.id,wife.id],sex:'male'});
  person(g,world,f.id,Math.max(1,h.age-3),{house:r.house,parents:[r.id,wife.id],sex:'female'});
  const council={};for(const role of ['chancellor','marshal','steward','spymaster','scholar'])council[role]=person(g,world,f.id,25+hash(f.id+role)%30,{house:'Court of '+f.name}).id;
  p.realms[f.id]={ruler:r.id,law:'eldest',council,lastLaw:-120};
 }
 for(const id of Object.keys(g.provinces))newHolding(g,world,id);
 for(const realm of Object.keys(p.realms))sync(g,realm);
 return p;
}
export function politicalRevenue(g,realm){const v=Object.values(g.politics?.holdings||{}).filter(h=>h.realm===realm);if(!v.length)return 1;return v.reduce((n,h)=>n+([.80,1,1.15][h.tax])*(.65+.35*h.loyalty/100),0)/v.length;}
export function politicalLevy(g,realm){const v=Object.values(g.politics?.holdings||{}).filter(h=>h.realm===realm);if(!v.length)return 1;return v.reduce((n,h)=>n+[.75,1,1.2][h.levy]*(.65+.35*h.loyalty/100),0)/v.length;}
export function marriageCandidates(g,realm){const p=g.politics;if(!p)return [];const r=p.people[p.realms[realm]?.ruler];if(!r)return [];const own=[r,...children(p,r),...r.parents.flatMap(id=>p.people[id]?.children||[]).map(id=>live(p,id)).filter(c=>c&&c.id!==r.id)].filter(c=>c.age>=18&&!c.spouse);
 return Object.values(p.realms).flatMap(s=>{const other=p.people[s.ruler];if(other.realm===realm){const local=Object.values(p.people).filter(c=>c.alive&&c.realm===realm&&c.age>=18&&!c.spouse&&c.house!==r.house);return own.flatMap(a=>local.filter(b=>eligible(p,a,b)).slice(0,12).map(b=>({a:a.id,b:b.id,label:a.name+' × '+b.name+' (domestic)',realm})));}const family=[other,...children(p,other),...other.parents.flatMap(id=>p.people[id]?.children||[]).map(id=>live(p,id)).filter(c=>c&&c.id!==other.id)];return own.flatMap(a=>family.filter(b=>eligible(p,a,b)).map(b=>({a:a.id,b:b.id,label:a.name+' × '+b.name+' ('+g.factions[b.realm].name+')',realm:b.realm})));});}
function marry(g,a,b){const p=g.politics;if(!eligible(p,a,b))return {ok:false,msg:'Marriage candidates are no longer eligible.'};const f=g.factions[a.realm],o=g.factions[b.realm];f.treaties??={};o.treaties??={};if(f.treasury<180)return {ok:false,msg:'Need 180 gold for a wedding.'};if(a.realm!==b.realm&&(f.relations[b.realm]||0)<20)return {ok:false,msg:'Relations must reach +20.'};f.treasury-=180;link(a,b);p.marriages.push({a:a.id,b:b.id,year:g.year});if(a.realm!==b.realm){f.relations[b.realm]=clamp((f.relations[b.realm]||0)+20,-100,100);o.relations[a.realm]=clamp((o.relations[a.realm]||0)+20,-100,100);if(!f.treaties[b.realm]&&!o.treaties[a.realm]){f.treaties[b.realm]='marriage';o.treaties[a.realm]='marriage';}}f.legitimacy=clamp(f.legitimacy+6,0,100);f.prestige+=4;log(g,a.name+' married '+b.name+'.');return {ok:true,msg:'Dynastic marriage celebrated.'};}
export function marryRealm(g,other){const option=marriageCandidates(g,g.player).find(x=>x.realm===other);if(!option)return {ok:false,msg:'No eligible adult royal relatives in these houses.'};return marry(g,g.politics.people[option.a],g.politics.people[option.b]);}
export function politicsAction(g,world,action,id,extra){const p=initPolitics(g,world),s=p.realms[g.player],f=g.factions[g.player],v=p.holdings[id],r=p.people[s.ruler];
 if(action==='dispatch')return resolvePoliticalDispatch(g,g.player,Number(id));
 if(action==='marry'){const a=p.people[id],b=p.people[extra];if(a?.realm!==g.player||!marriageCandidates(g,g.player).some(x=>x.a===id&&x.b===extra))return {ok:false,msg:'Select an eligible royal pair.'};return marry(g,a,b);}
 if(action==='appoint'){const candidate=live(p,extra);if(!Object.hasOwn(s.council,id)||!candidate||candidate.realm!==g.player||candidate.age<18||candidate.id===r.id||Object.values(s.council).includes(candidate.id)||f.treasury<80)return {ok:false,msg:'Select an adult unassigned courtier and have 80 gold.'};f.treasury-=80;s.council[id]=candidate.id;sync(g,g.player);log(g,candidate.name+' appointed '+id+'.');return {ok:true,msg:'Council appointment confirmed.'};}
 if(action==='law'){if(!councilPermission(g,g.player,'law'))return {ok:false,msg:'Binding council rejected the succession reform.'};if(!['eldest','youngest','elective'].includes(id)||id===s.law||g.turn-s.lastLaw<120||f.legitimacy<65||f.treasury<250)return {ok:false,msg:'Reform needs 250 gold, 65 legitimacy and ten years between changes.'};f.treasury-=250;s.law=id;s.lastLaw=g.turn;for(const h of Object.values(p.holdings))if(h.realm===g.player)h.loyalty=clamp(h.loyalty-8,0,100);sync(g,g.player);log(g,'The crown reformed succession: '+id);return {ok:true,msg:'Succession law changed.'};}
 if(!v||v.realm!==g.player||g.provinces[id]?.owner!==g.player)return {ok:false,msg:'Select a loyal holding in your realm.'};
 if(action==='gift'){if(f.treasury<100)return {ok:false,msg:'Need 100 gold.'};f.treasury-=100;v.wealth+=100;v.loyalty=clamp(v.loyalty+15,0,100);}
 else if(action==='tax'||action==='levy'||action==='autonomy'){const value=Number(extra);if(![0,1,2].includes(value)||v[action]===value)return {ok:false,msg:'Select a different contract level.'};const delta=value-v[action];v[action]=value;v.loyalty=clamp(v.loyalty+(action==='autonomy'?12:-12)*delta,0,100);}
 else if(action==='replace'){if(!councilPermission(g,g.player,'revoke')&&!(v.leverageUntil>g.turn))return {ok:false,msg:'Binding council refused revocation; investigate the estate or secure support.'};if(f.legitimacy<50)return {ok:false,msg:'Need 50 legitimacy.'};const previous=p.people[v.lord];v.lord=person(g,world,g.player,35,{house:'Appointed house of '+id}).id;v.loyalty=60;f.legitimacy-=10;previous.memories.push('Lost the holding of '+id);for(const h of Object.values(p.holdings))if(h.realm===g.player&&h!==v)h.loyalty=clamp(h.loyalty-5,0,100);}
 else if(action==='concede'){if(v.loyalty>=45||g.turn<v.concessionUntil||f.treasury<150)return {ok:false,msg:'No active grievance, recent concession, or insufficient gold.'};f.treasury-=150;v.autonomy=2;v.loyalty=clamp(v.loyalty+30,0,100);v.concessionUntil=g.turn+24;}
 else return {ok:false,msg:'Unknown political action.'};
 log(g,'The crown negotiated '+action+' with '+p.people[v.lord].name+'.');return {ok:true,msg:'Vassal agreement updated.'};
}
function death(g,world,c){const p=g.politics;c.alive=false;c.deathYear=g.year;if(c.spouse){const s=p.people[c.spouse];if(s)s.spouse=null;c.spouse=null;}const realm=c.realm,s=p.realms[realm];if(s?.ruler===c.id){let h=successor(p,realm);if(!h)h=Object.values(p.people).filter(x=>x.alive&&x.realm===realm&&x.house===c.house&&x.id!==c.id).sort((a,b)=>b.age-a.age)[0]||person(g,world,realm,30,{house:'Successor house of '+g.factions[realm].name});s.ruler=h.id;g.kingdom.courts[realm].successions++;g.factions[realm].legitimacy=clamp(g.factions[realm].legitimacy-12,0,100);for(const v of Object.values(p.holdings))if(v.realm===realm)v.loyalty=clamp(v.loyalty-12,0,100);if(realm===g.player)log(g,c.name+' died. '+h.name+' inherited the crown.');}
 for(const [id,v] of Object.entries(p.holdings))if(v.lord===c.id){const h=heirs(p,c)[0]||person(g,world,v.realm,32,{house:'Successor house of '+id});v.lord=h.id;v.loyalty=clamp(v.loyalty-8,0,100);}
 for(const [role,id] of Object.entries(s?.council||{}))if(id===c.id)s.council[role]=person(g,world,realm,35,{house:'Court of '+g.factions[realm].name}).id;
}

// Original, contextual event templates. Effects operate on the actual target character/holding.
const DISPATCHES=[
 {id:'levy_petition',title:'The levy petition',target:'vassal',test:(g,v)=>v.levy===2,desc:n=>n+' petitions for relief from compulsory military service.',choices:[['Reduce levy obligations',0,18,'levy',0],['Pay for local supplies',100,10],['Reject the petition',0,-13]]},
 {id:'tax_protest',title:'The unpaid tithe',target:'vassal',test:(g,v)=>v.tax===2,desc:n=>n+' argues that royal taxation is exhausting the estate.',choices:[['Lower the contract tax',0,16,'tax',0],['Fund emergency relief',120,14],['Demand payment',0,-15]]},
 {id:'autonomy_dispute',title:'The rights of the estate',target:'vassal',test:(g,v)=>v.autonomy===0,desc:n=>n+' asks the crown to restore local legal privileges.',choices:[['Restore autonomy',0,16,'autonomy',2],['Offer a negotiated gift',100,8],['Maintain royal authority',0,-12]]},
 {id:'border_feud',title:'A dispute between estates',target:'vassal',test:(g,v)=>v.loyalty<65,desc:n=>n+' asks the monarch to resolve a bitter dispute over provincial authority.',choices:[['Hear the case personally',80,14],['Appoint an independent mediator',50,8],['Dismiss the petition',0,-10]]},
 {id:'loyal_service',title:'A faithful servant',target:'vassal',test:(g,v)=>v.loyalty>=70,desc:n=>n+' has offered exceptional service to the realm and expects recognition.',choices:[['Grant an honorary award',100,12],['Praise their service publicly',0,5],['Keep the royal gold',0,-7]]},
 {id:'wealthy_house',title:'An increasingly wealthy house',target:'vassal',test:(g,v)=>v.wealth>=60,desc:n=>n+' has accumulated substantial resources and proposes greater local privileges.',choices:[['Recognize local privileges',0,12,'autonomy',2],['Finance joint improvements',150,16],['Reject the proposal',0,-12]]},
 {id:'court_training',title:'A promising courtier',target:'court',test:(g,v,c)=>c.skills.learning<=3,desc:n=>n+' requests funding to study with renowned scholars.',choices:[['Sponsor instruction',100,0,'learning',1],['Recommend independent study',0,0],['Refuse',0,0]]},
 {id:'military_instruction',title:'An officer seeks instruction',target:'court',test:(g,v,c)=>c.skills.martial<5,desc:n=>n+' wants to undertake further military instruction.',choices:[['Fund instruction',120,0,'martial',1],['Decline the expense',0,0]]},
 {id:'diplomatic_apprentice',title:'Lessons in diplomacy',target:'court',test:(g,v,c)=>c.skills.diplomacy<5,desc:n=>n+' seeks experience in formal negotiations.',choices:[['Sponsor diplomatic training',100,0,'diplomacy',1],['Keep the courtier at home',0,0]]},
 {id:'estate_reform',title:'The books of account',target:'court',test:(g,v,c)=>c.skills.stewardship<5,desc:n=>n+' proposes training in provincial accounting and estate management.',choices:[['Pay for practical instruction',100,0,'stewardship',1],['Reject the proposal',0,0]]},
 {id:'heir_education',title:'The next generation',target:'child',test:(g,v,c)=>c.age>=6&&c.age<=17,desc:n=>n+' has reached an important stage of their education.',choices:[['Study statecraft',80,0,'diplomacy',1],['Study military command',80,0,'martial',1],['Study philosophy',80,0,'learning',1]]},
 {id:'heir_finances',title:'Lessons in responsibility',target:'child',test:(g,v,c)=>c.age>=8&&c.age<=17,desc:n=>n+' is old enough to learn how the royal household operates.',choices:[['Learn estate management',80,0,'stewardship',1],['Learn the court’s secrets',80,0,'intrigue',1],['Continue ordinary lessons',0,0]]}
];
function dispatchTarget(g,realm,e){
 const p=g.politics,s=p.realms[realm],r=p.people[s.ruler];
 if(e.target==='vassal')return Object.entries(p.holdings).filter(([id,v])=>v.realm===realm&&g.provinces[id]?.owner===realm&&e.test(g,v,p.people[v.lord])).map(([id,v])=>({id:v.lord,province:id}));
 const people=e.target==='child'?children(p,r):Object.values(s.council).map(id=>live(p,id)).filter(Boolean);
 return people.filter(c=>e.test(g,null,c)).map(c=>({id:c.id,province:null}));
}
function scheduleDispatch(g,realm){
 const p=g.politics;p.dispatches??={};p.dispatchHistory??={};
 if(p.dispatches[realm])return;
 const candidates=DISPATCHES.flatMap(e=>g.turn-(p.dispatchHistory[realm+':'+e.id]??-120)>=60?dispatchTarget(g,realm,e).map(target=>({event:e.id,...target,turn:g.turn})):[]);
 if(candidates.length)p.dispatches[realm]=candidates[Math.floor(roll(p)*candidates.length)];
}
export function politicalDispatch(g,realm=g.player){
 const p=g.politics,d=p?.dispatches?.[realm],e=DISPATCHES.find(x=>x.id===d?.event),c=p?.people[d?.id];
 if(!e||!c?.alive||(d.province&&(p.holdings[d.province]?.lord!==c.id||g.provinces[d.province]?.owner!==realm)))return null;
 return {...d,title:e.title,description:e.desc(c.name),choices:e.choices.map(([label,cost,loyalty,field,value])=>({label,cost,loyalty,field,value}))};
}
export function resolvePoliticalDispatch(g,realm,index){
 const p=g.politics,d=politicalDispatch(g,realm),choice=d?.choices[index],f=g.factions[realm];
 if(!d||!Number.isInteger(index)||!choice)return {ok:false,msg:'No current political dispatch.'};
 if(f.treasury<choice.cost)return {ok:false,msg:'Insufficient funds.'};
 f.treasury-=choice.cost;const c=p.people[d.id],v=d.province?p.holdings[d.province]:null;
 if(v){v.loyalty=clamp(v.loyalty+choice.loyalty,0,100);if(choice.field)v[choice.field]=choice.value;}
 else if(choice.field)c.skills[choice.field]=clamp(c.skills[choice.field]+choice.value,1,5);
 c.memories.push(g.year+': '+d.title+' — '+choice.label);c.memories=c.memories.slice(-30);
 p.dispatchHistory[realm+':'+d.event]=g.turn;delete p.dispatches[realm];
 if(realm===g.player)log(g,d.title+': '+choice.label+'.');sync(g,realm);
 return {ok:true,msg:'Political decision recorded.'};
}

export function tickPolitics(g,world){const p=initPolitics(g,world);if(p.lastTick===g.turn)return;p.lastTick=g.turn;
 for(const [id,pr] of Object.entries(g.provinces))if(p.realms[pr.owner]?p.holdings[id]?.realm!==pr.owner:!!p.holdings[id])newHolding(g,world,id);
 if(g.turn%12===0){
  const living=Object.values(p.people).filter(c=>c.alive);for(const c of living)c.age++;
  for(const c of living){if(!c.alive)continue;const risk=c.age>=90?1:c.age>=60?(c.age-58)*.006:c.age>=45?.008:.002;if(roll(p)<risk)death(g,world,c);}
  for(const a of living){const b=live(p,a.spouse);if(!a.alive||!b||a.sex!=='female'||a.age<18||a.age>42||b.age<18||b.age>75||a.children.length>=4||b.children.length>=4||roll(p)>.18)continue;const child=person(g,world,b.realm,0,{house:b.house,parents:[a.id,b.id]});if(a.realm!==b.realm)child.claims.push(a.realm);if(b.realm===g.player||a.realm===g.player)log(g,'A child, '+child.name+', was born to '+a.name+' and '+b.name+'.');}
  // Royal AI chooses partners with existing relations; domestic matches keep family lines alive.
  for(const [realm,s] of Object.entries(p.realms)){const r=p.people[s.ruler];if(realm===g.player)continue;for(const a of [r,...children(p,r)]){if(a.age<18||a.spouse||roll(p)>.45)continue;const match=marriageCandidates(g,realm).find(x=>x.a===a.id&&x.realm!==g.player&&(g.factions[realm].relations[x.realm]||0)>=20);if(match)marry(g,a,p.people[match.b]);else{const b=person(g,world,realm,Math.max(18,Math.min(35,a.age)),{sex:a.sex==='male'?'female':'male',house:'House of '+realm+' consorts'});link(a,b);}}}
 }
 if(g.turn%3===0){for(const [id,v] of Object.entries(p.holdings)){const f=g.factions[v.realm],lord=p.people[v.lord];if(!f||!lord)continue;const target=clamp(55+(f.legitimacy-50)*.4+(f.stability-50)*.25-(v.tax-1)*15-(v.levy-1)*10+(v.autonomy-1)*10-(lord.traits.includes('ambitious')?12:0),0,100);v.loyalty=clamp(v.loyalty+clamp(target-v.loyalty,-4,4),0,100);v.wealth+=Math.max(0,Math.round(g.provinces[id].development*(3-v.tax)));if(v.realm!==g.player&&v.loyalty<35&&f.treasury>=150){f.treasury-=150;v.loyalty+=20;v.autonomy=2;}
  const key='grievance:'+id,old=p.situations[key];if(v.loyalty<35){p.situations[key]={id:key,realm:v.realm,province:id,lord:v.lord,phase:v.loyalty<20?'ultimatum':'grievance',started:old?.started??g.turn};if(!old&&v.realm===g.player)log(g,lord.name+' is organizing opposition to the crown.');if(v.loyalty<15&&g.turn-p.situations[key].started>=12&&roll(p)<.25){g.provinces[id].unrest=clamp(g.provinces[id].unrest+25,0,100);f.stability=clamp(f.stability-8,0,100);v.loyalty=25;log(g,lord.name+' resisted royal authority; provincial unrest increased.');}}else if(old)delete p.situations[key];
 }}
 for(const realm of Object.keys(p.realms)){
  p.dispatches??={};p.dispatchHistory??={};
  if(p.dispatches[realm]&&(!politicalDispatch(g,realm)||g.turn-p.dispatches[realm].turn>12))delete p.dispatches[realm];
  if(g.turn%6===0)scheduleDispatch(g,realm);
  if(realm!==g.player&&g.turn%6===0){const d=politicalDispatch(g,realm);if(d){const options=d.choices.map((x,i)=>({x,i})).filter(({x})=>x.cost<=g.factions[realm].treasury-150||x.cost===0);const chosen=options.sort((a,b)=>(b.x.loyalty-b.x.cost*.03)-(a.x.loyalty-a.x.cost*.03))[0];if(chosen)resolvePoliticalDispatch(g,realm,chosen.i);}}
  const s=p.realms[realm],r=p.people[s.ruler],old=s.regent;
  s.regent=r.age<18?(live(p,s.council.chancellor)?.id||null):null;
  if(s.regent&&g.turn%12===0)g.factions[realm].legitimacy=clamp(g.factions[realm].legitimacy-1,0,100);
  if(realm===g.player&&old!==s.regent)log(g,s.regent?'A regency begins for '+r.name+'.':'The regency ends.');
  sync(g,realm);
 }
}
