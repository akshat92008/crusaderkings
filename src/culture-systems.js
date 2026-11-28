import {humanControlsRealm} from './player-career.js';
// Cultural and linguistic gameplay built on existing civic culture and acceptance.
// Regional categories and languages are campaign abstractions, not uniform historical demographics.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
const court=(g,r)=>g.civic?.realms[r],ruler=(g,r)=>g.politics?.people[g.politics?.realms[r]?.ruler];
const profiles={
 English:['Northwestern Europe','English'],Scottish:['Northwestern Europe','Scots','Scottish Gaelic'],Breton:['Northwestern Europe','Breton','French'],
 French:['Western Europe','French'],Burgundian:['Western Europe','French','Dutch'],Castilian:['Iberia','Castilian'],Portuguese:['Iberia','Portuguese'],'Aragonese-Catalan':['Iberia','Catalan','Aragonese'],
 'Central European':['Central Europe','German','Czech'],Scandinavian:['Northern Europe','Scandinavian languages'],Polish:['Central Europe','Polish'],Muscovite:['Eastern Europe','East Slavic languages'],Novgorodian:['Eastern Europe','East Slavic languages'],
 Ligurian:['Italian regions','Ligurian'],Venetian:['Italian regions','Venetian'],Cypriot:['Eastern Mediterranean','Greek'],
 Ottoman:['Anatolia','Ottoman Turkish'], 'Mamluk-Egyptian':['Eastern Mediterranean','Arabic'],Timurid:['Central Asia','Persian','Chagatai'],Turkmen:['Central Asia','Turkic languages'],'Golden Horde':['Eurasian steppe','Turkic languages'],Chagatai:['Central Asia','Chagatai','Persian'],Oirat:['Inner Asia','Mongolic languages'],
 Maghrebi:['North Africa','Arabic','Amazigh languages'],Ethiopian:['Horn of Africa','Ethiopian regional languages'],Mande:['West Africa','Mande languages'],Songhai:['West Africa','Songhay languages'],Kongo:['Central Africa','Kongo languages'],Swahili:['East African coast','Swahili'],
 'South Indian':['South Asia','South Indian regional languages','Telugu','Kannada','Tamil'],Deccani:['South Asia','Deccan regional languages','Persian'],'North Indian':['South Asia','North Indian regional languages','Persian'],Bengali:['South Asia','Bengali'],Gujarati:['South Asia','Gujarati'],
 'Ming Chinese':['East Asia','Chinese languages'],Korean:['East Asia','Korean'],Japanese:['East Asia','Japanese'],Tibetan:['Himalayan regions','Tibetan'],
 Siamese:['Mainland Southeast Asia','Thai'],Lao:['Mainland Southeast Asia','Lao'],Vietnamese:['Mainland Southeast Asia','Vietnamese'],Javanese:['Maritime Southeast Asia','Javanese'],Malay:['Maritime Southeast Asia','Malay'],Sundanese:['Maritime Southeast Asia','Sundanese'],
 Nahua:['Mesoamerica','Nahuatl'],Maya:['Mesoamerica','Mayan languages'],'Pueblo communities':['North America','Pueblo regional languages'],Haudenosaunee:['North America','Iroquoian languages'],Andean:['Andean regions','Andean regional languages','Quechua','Aymara'],Muisca:['Northern Andes','Muysccubun'],'Tupí communities':['South America','Tupian languages'],Mapuche:['Southern Andes','Mapudungun'],Māori:['Polynesia','Māori'],Fijian:['Oceania','Fijian languages'],'Australian First Nations communities':['Australia','Local Australian languages']
};
export const CULTURAL_PROFILES=Object.freeze(profiles);
const languageFamilies={
 English:'Germanic',Scots:'Germanic',German:'Germanic',Dutch:'Germanic','Scandinavian languages':'Germanic','Scottish Gaelic':'Celtic',Breton:'Celtic',
 French:'Romance',Castilian:'Romance',Portuguese:'Romance',Catalan:'Romance',Aragonese:'Romance',Ligurian:'Romance',Venetian:'Romance',
 Polish:'Slavic',Czech:'Slavic','East Slavic languages':'Slavic','Ottoman Turkish':'Turkic','Turkic languages':'Turkic',Chagatai:'Turkic',
 Tamil:'Dravidian',Telugu:'Dravidian',Kannada:'Dravidian',Bengali:'Indo-Aryan',Gujarati:'Indo-Aryan',
 Javanese:'Austronesian',Malay:'Austronesian',Sundanese:'Austronesian',Māori:'Austronesian','Fijian languages':'Austronesian',Thai:'Tai',Lao:'Tai'
};
export function cultureProfile(g,label){
 if(!label)return {label:'Unclassified',group:'Unclassified',languages:['Local languages'],parents:[]};
 const defs=g.identity?.cultureDefinitions,custom=defs&&Object.hasOwn(defs,label)?defs[label]:null;
 if(custom)return {label,group:custom.group,languages:[...custom.languages],parents:[...custom.parents],origin:custom.kind};
 const p=Object.hasOwn(profiles,label)?profiles[label]:null;
 return {label,group:p?.[0]||'Local cultural traditions',languages:p?p.slice(1):[label+' local languages'],parents:[]};
}
export function languageFamily(language){return Object.hasOwn(languageFamilies,language)?languageFamilies[language]:language;}
export function knownLanguages(g,person){
 const c=person?.civic;if(!c)return [];
 return [...new Set(Array.isArray(c.languages)&&c.languages.length?c.languages:[cultureProfile(g,c.culture).languages[0]])];
}
function cultureState(g,r,create=false){
 const i=g.identity?.realms[r];if(!i)return null;
 if(i.culturalCourt)return i.culturalCourt;
 return create?(i.culturalCourt={language:null,study:null,lastLanguage:-120,lastStudy:-120,lastCulture:-120,history:[]}):null;
}
export function courtLanguage(g,r){
 const state=cultureState(g,r),c=court(g,r);
 return state?.language||cultureProfile(g,c?.culture).languages[0];
}
function patron(g,r){
 const id=g.living?.realms[r]?.culturePatron,p=g.politics?.people[id];
 return p?.alive&&p.age>=18&&p.realm===r&&!isImprisoned(g,id)&&(p.skills?.learning??0)>=2&&(g.living?.health?.[id]?.severity??0)<70&&p.id!==ruler(g,r)?.id?p:null;
}
function note(g,r,s,message){
 s.history.unshift({turn:g.turn,message});s.history=s.history.slice(0,24);
 g.identity.history.unshift({realm:r,turn:g.turn,message});g.identity.history=g.identity.history.slice(0,200);
 if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}
}
export function cultureLeadership(g,label){
 const counts={};for(const [r,c] of Object.entries(g.civic?.realms||{}))if(c.culture===label)counts[r]=0;
 for(const p of Object.values(g.provinces||{}))if(Object.hasOwn(counts,p.owner)&&own(g,p.owner,p.id)&&g.civic.provinces[p.id]?.culture===label)counts[p.owner]++;
 const candidates=Object.entries(counts).filter(([r,n])=>n>0||Object.values(g.provinces).some(p=>own(g,r,p.id))).map(([realm,provinces])=>({realm,provinces,prestige:g.factions[realm]?.prestige??0})).sort((a,b)=>b.provinces-a.provinces||b.prestige-a.prestige||a.realm.localeCompare(b.realm));
 return candidates[0]||null;
}
export const CULTURAL_TRADITIONS=Object.freeze({
 'Western Europe':[
  {id:'heavy_lancers',name:'Heavy Cavalry Lancers',desc:'Shock cavalry barding and lance drills.',cost:150,prestige:15,mod:{cavalryBonus:0.15,levyMod:1.05}},
  {id:'cathedral_guilds',name:'Cathedral & Mason Guilds',desc:'Master stonecutters raise tax & prestige.',cost:150,prestige:15,mod:{taxMod:1.08,prestigeMonthly:0.4}},
  {id:'chivalric_courts',name:'Chivalric Tournaments',desc:'Court pageantry steadies vassal loyalty.',cost:140,prestige:12,mod:{diplomacy:2,unrestReduction:2}}
 ],
 'Anatolia / Mediterranean':[
  {id:'janissary_corps',name:'Elite Standing Infantry',desc:'Disciplined gunpowder-era guard regiments.',cost:160,prestige:15,mod:{levyMod:1.10,cavalryBonus:0.06}},
  {id:'caravanserai_web',name:'Caravanserai Networks',desc:'Fortified road inns multiply caravan revenue.',cost:150,prestige:12,mod:{tradeMod:1.15,taxMod:1.05}},
  {id:'madrasa_astronomy',name:'Observatory & Madrasa Chairs',desc:'Endowed academies accelerate tech breakthroughs.',cost:140,prestige:12,mod:{researchBonus:2,diplomacy:1}}
 ],
 'East Asia':[
  {id:'imperial_exams',name:'Imperial Civil Examinations',desc:'Meritocratic officials boost administration.',cost:150,prestige:15,mod:{taxMod:1.10,researchBonus:1}},
  {id:'gunpowder_rockets',name:'Fire-Lance & Rocket Batteries',desc:'Ordnance corps strengthen sieges and levies.',cost:160,prestige:15,mod:{levyMod:1.08,cavalryBonus:0.08}},
  {id:'grand_canal',name:'Grand Canal Logistics',desc:'Barge networks enrich trade and calm provinces.',cost:150,prestige:12,mod:{tradeMod:1.14,unrestReduction:2}}
 ],
 'South Asia':[
  {id:'monsoon_guilds',name:'Monsoon Merchant Guilds',desc:'Maritime syndicates dominate Indian Ocean trade.',cost:150,prestige:15,mod:{tradeMod:1.16,taxMod:1.06}},
  {id:'war_elephants',name:'Royal War Elephant Corps',desc:'Armored vanguard breaks enemy infantry lines.',cost:160,prestige:15,mod:{cavalryBonus:0.16,levyMod:1.06}},
  {id:'temple_banking',name:'Temple Credit & Granaries',desc:'Endowed storehouses steady treasury and trust.',cost:140,prestige:12,mod:{taxMod:1.08,unrestReduction:2}}
 ],
 'Central Asia / Steppe':[
  {id:'composite_bows',name:'Composite Bow Mastery',desc:'Horse archers strike with unmatched mobility.',cost:150,prestige:15,mod:{cavalryBonus:0.20,levyMod:1.05}},
  {id:'yam_postal',name:'Yam Relay Postal Network',desc:'Fast imperial couriers speed diplomacy & tax.',cost:140,prestige:12,mod:{diplomacy:2,taxMod:1.06}},
  {id:'silk_escorts',name:'Steppe Caravan Escorts',desc:'Mounted guards protect trans-Eurasian trade.',cost:150,prestige:12,mod:{tradeMod:1.15}}
 ],
 'Global Regional':[
  {id:'caravan_mastery',name:'Regional Caravan Mastery',desc:'Merchant networks thrive across arid and coastal routes.',cost:140,prestige:12,mod:{tradeMod:1.14,taxMod:1.05}},
  {id:'terrace_agronomy',name:'Terrace & Irrigation Works',desc:'High-yield terraces stabilize local harvests.',cost:140,prestige:12,mod:{taxMod:1.07,unrestReduction:3}},
  {id:'oral_chronicles',name:'Royal Herald & Chronicle Orders',desc:'Preserved lineages bolster diplomacy and prestige.',cost:140,prestige:12,mod:{diplomacy:2,researchBonus:1}}
 ]
});

export function traditionTreeForGroup(group){
 const g=String(group||'');
 if(/Western Europe|Northwestern Europe|Iberia|Central Europe|Northern Europe|Eastern Europe|Italian/i.test(g))return 'Western Europe';
 if(/Anatolia|Eastern Mediterranean|North Africa/i.test(g))return 'Anatolia / Mediterranean';
 if(/East Asia|Himalayan/i.test(g))return 'East Asia';
 if(/South Asia|Southeast Asia/i.test(g))return 'South Asia';
 if(/Central Asia|steppe|Inner Asia/i.test(g))return 'Central Asia / Steppe';
 return 'Global Regional';
}

export function suggestedHybridName(a,b){
 const clean=s=>String(s||'').split(/[ /]/)[0].replace(/communities|traditions/i,'').trim();
 const left=clean(a),right=clean(b);
 if(!left||!right||left===right)return `${a} Fusion`;
 return `${left}-${right}`;
}

export function languagePrestige(g,language){
 if(!language)return 0;
 let score=0;
 for(const [r,c] of Object.entries(g.civic?.realms||{})){
  if(courtLanguage(g,r)===language)score+=15+Math.round((g.factions?.[r]?.prestige||0)*0.15);
 }
 for(const l of Object.values(g.civic?.provinces||{})){
  if(cultureProfile(g,l?.culture).languages.includes(language))score+=4;
 }
 return Math.min(200,score);
}

export function culturalContact(g,r,land){
 const c=court(g,r),local=land||Object.values(g.provinces).filter(p=>own(g,r,p.id)),groups=new Map();
 for(const p of local){const l=g.civic.provinces[p.id];if(!l?.culture||l.culture===c.culture)continue;
  let x=groups.get(l.culture);if(!x){x={culture:l.culture,provinces:0,acceptance:0,trust:0,maxTenure:0};groups.set(l.culture,x);}
  x.provinces++;x.acceptance+=l.acceptance??50;x.trust+=l.localTrust??50;x.maxTenure=Math.max(x.maxTenure,l.ruleTenure||0);
 }
 return [...groups.values()].map(x=>({
  ...x,
  acceptance:Math.round(x.acceptance/x.provinces),
  trust:Math.round(x.trust/x.provinces),
  tenureYears:Math.floor(x.maxTenure/12),
  suggestedName:suggestedHybridName(c.culture,x.culture)
 })).sort((a,b)=>b.provinces-a.provinces||a.culture.localeCompare(b.culture));
}
function languageOptions(g,r,land){
 const result=new Set(cultureProfile(g,court(g,r).culture).languages);
 for(const p of land)for(const l of cultureProfile(g,g.civic.provinces[p.id]?.culture).languages)result.add(l);
 for(const [other,c] of Object.entries(g.civic.realms))if(other!==r&&(g.factions[r].relations?.[other]??0)>=20){for(const l of cultureProfile(g,c.culture).languages)result.add(l);}
 for(const l of knownLanguages(g,ruler(g,r)))result.add(l);
 return [...result].sort();
}
export function cultureView(g,r,providedLand){
 const c=court(g,r),i=g.identity?.realms[r],head=ruler(g,r),f=g.factions[r];if(!c||!i||!head||!f)return null;
 const s=cultureState(g,r),land=providedLand||Object.values(g.provinces).filter(p=>own(g,r,p.id)),p=patron(g,r),language=courtLanguage(g,r),known=knownLanguages(g,head),contact=culturalContact(g,r,land),options=languageOptions(g,r,land);
 const profile=cultureProfile(g,c.culture),eligible=land.length>0&&head.alive&&head.age>=18&&!isImprisoned(g,head.id),wait=Math.max(0,120-g.turn+(s?.lastCulture??-120));
 const canFound=eligible&&!!p&&!wait&&f.treasury>=450&&f.prestige>=30&&c.policy!=='coercion';
 const hybrids=contact.filter(x=>(x.acceptance>=65&&x.trust>=60)||x.tenureYears>=30);
 const treeKey=traditionTreeForGroup(profile.group);
 const unlockedTraditions=s?.traditions||[];
 const traditions=(CULTURAL_TRADITIONS[treeKey]||CULTURAL_TRADITIONS['Global Regional']).map(t=>({
  ...t,unlocked:unlockedTraditions.includes(t.id),
  canUnlock:eligible&&!unlockedTraditions.includes(t.id)&&f.treasury>=t.cost&&(f.prestige||0)>=t.prestige
 }));
 const chancellor=g.politics?.people?.[g.politics?.realms?.[r]?.council?.chancellor];
 const chancellorLangs=chancellor?knownLanguages(g,chancellor):[];
 return {
  profile,language,languagePrestige:languagePrestige(g,language),known,options,study:s?.study||null,contact,hybrids,
  patron:p?.name||p?.id||null,leader:cultureLeadership(g,c.culture),wait,
  traditionTree:treeKey,traditions,unlockedTraditions,
  chancellorPolyglot:chancellorLangs.length>=2,chancellorLanguages:chancellorLangs,
  canStudy:eligible&&!s?.study&&g.turn-(s?.lastStudy??-120)>=6&&f.treasury>=80&&known.length<6,
  canLanguage:eligible&&g.turn-(s?.lastLanguage??-120)>=24&&f.treasury>=100,
  canHybrid:canFound&&hybrids.length>0,canDiverge:canFound&&i.innovations.length>=2,last:s?.history[0]||null
 };
}
export function cultureModifiers(g,r){
 const head=ruler(g,r),s=cultureState(g,r),c=court(g,r);
 const out={diplomacy:0,taxMod:1,levyMod:1,tradeMod:1,cavalryBonus:0,researchBonus:0,unrestReduction:0,prestigeMonthly:0};
 if(!head?.alive)return out;
 const known=knownLanguages(g,head);
 if(known.includes(courtLanguage(g,r)))out.diplomacy+=Math.min(4,Math.max(0,known.length-1)*2);
 // Polyglot Chancellor diplomacy & prestige bonus
 const chancellor=g.politics?.people?.[g.politics?.realms?.[r]?.council?.chancellor];
 if(chancellor?.alive&&knownLanguages(g,chancellor).length>=2)out.diplomacy+=2;
 // Hybrid civilization harmony bonus
 const def=c?.culture?g.identity?.cultureDefinitions?.[c.culture]:null;
 if(def?.kind==='hybrid'){out.taxMod*=1.06;out.unrestReduction+=2;}
 // Cultural Tech Traditions
 const profile=cultureProfile(g,c?.culture);
 const tree=CULTURAL_TRADITIONS[traditionTreeForGroup(profile.group)]||[];
 for(const tid of s?.traditions||[]){
  const tr=tree.find(x=>x.id===tid)||Object.values(CULTURAL_TRADITIONS).flat().find(x=>x.id===tid);
  if(!tr?.mod)continue;
  if(tr.mod.diplomacy)out.diplomacy+=tr.mod.diplomacy;
  if(tr.mod.taxMod)out.taxMod*=tr.mod.taxMod;
  if(tr.mod.levyMod)out.levyMod*=tr.mod.levyMod;
  if(tr.mod.tradeMod)out.tradeMod*=tr.mod.tradeMod;
  if(tr.mod.cavalryBonus)out.cavalryBonus+=tr.mod.cavalryBonus;
  if(tr.mod.researchBonus)out.researchBonus+=tr.mod.researchBonus;
  if(tr.mod.unrestReduction)out.unrestReduction+=tr.mod.unrestReduction;
  if(tr.mod.prestigeMonthly)out.prestigeMonthly+=tr.mod.prestigeMonthly;
 }
 return out;
}
function validName(g,name){return /^[\p{L}\p{N}][\p{L}\p{N} .'-]{2,47}$/u.test(name)&&!Object.hasOwn(profiles,name)&&!Object.hasOwn(g.identity.cultureDefinitions||{},name)&&!Object.values(g.civic.realms).some(c=>c.culture===name)&&!Object.values(g.civic.provinces).some(c=>c.culture===name)&&!['__proto__','constructor','prototype'].includes(name);}
export function cultureAction(g,r,action,id,extra){
 const v=cultureView(g,r),c=court(g,r),f=g.factions[r],head=ruler(g,r);if(!v)return no('Cultural records unavailable.');
 const s=cultureState(g,r,true);
 if(action==='culture-study'){
  if(!v.canStudy||!v.options.includes(id)||v.known.includes(id))return no('Choose an unfamiliar available language, 80 gold and a free study slot.');
  const related=v.known.some(l=>languageFamily(l)===languageFamily(id)),months=Math.max(6,(related?9:15)-Math.floor((head.skills?.learning??1)/2)*3);
  f.treasury-=80;s.lastStudy=g.turn;s.study={person:head.id,language:id,ends:g.turn+months};
  note(g,r,s,'The ruler began studying '+id+'.');return ok('Language studies began.');
 }
 if(action==='culture-language'){
  if(!v.canLanguage||!v.known.includes(id)||id===v.language)return no('Select a learned language, 100 gold and a two-year interval.');
  f.treasury-=100;s.language=id;s.lastLanguage=g.turn;note(g,r,s,'The court adopted '+id+' for its administration.');return ok('Court language changed.');
 }
 if(action==='culture-tradition'){
  const tr=v.traditions.find(t=>t.id===id);
  if(!tr||!tr.canUnlock)return no('Requires an unlocked cultural tradition, sufficient gold and prestige.');
  f.treasury-=tr.cost;f.prestige-=tr.prestige;
  s.traditions??=[];s.traditions.push(tr.id);
  note(g,r,s,'Adopted cultural tradition: '+tr.name+' ('+tr.desc+').');
  return ok('Cultural tradition adopted: '+tr.name+'.');
 }
 if(action==='culture-hybrid'||action==='culture-diverge'){
  const hybrid=action==='culture-hybrid',other=hybrid?v.hybrids.find(x=>x.culture===extra):null;
  const rawName=String(id||'').trim()||(hybrid&&other?other.suggestedName:'');
  if(!validName(g,rawName)||(hybrid?(!v.canHybrid||!other):!v.canDiverge))return no('Requires a unique name, a cultural patron, sufficient resources, eligible local contact (65+ acceptance or 30+ yrs rule) or two innovations, and ten years between changes.');
  const parent=c.culture,source=hybrid?cultureProfile(g,other.culture):null,parents=hybrid?[parent,other.culture]:[parent];
  const group=hybrid&&source.group!==v.profile.group?v.profile.group+' / '+source.group:v.profile.group;
  const languages=[...new Set([v.language,...v.profile.languages,...(source?.languages||[])])];
  (g.identity.cultureDefinitions??={})[rawName]={kind:hybrid?'hybrid':'divergent',parents,group,languages,founded:g.turn,realm:r};
  head.civic.languages=v.known;head.civic.culture=rawName;c.culture=rawName;f.treasury-=450;f.prestige-=30;s.lastCulture=g.turn;
  // Hybrid fusion boosts acceptance in provinces of both parent cultures
  if(hybrid){
   for(const [pid,l] of Object.entries(g.civic?.provinces||{})){
    if(g.provinces[pid]?.owner===r&&parents.includes(l.culture)){l.acceptance=clamp((l.acceptance||50)+15,0,100);l.localTrust=clamp((l.localTrust||50)+10,0,100);}
   }
  }
  note(g,r,s,'The court established the '+rawName+' culture! Harmony and administrative tax improved.');return ok('New court culture established: '+rawName+'.');
 }
 return no('Unknown cultural action.');
}

export function currentAssimilationEvent(g,r=g.player){
 const ev=g.identity?.pendingAssimilationEvent;
 if(!ev||ev.realm!==r)return null;
 if(g.provinces?.[ev.province]?.owner!==r){delete g.identity.pendingAssimilationEvent;return null;}
 return ev;
}

export function resolveAssimilationEvent(g,r,choiceIndex){
 const ev=currentAssimilationEvent(g,r);
 if(!ev)return no('No active cultural assimilation event.');
 const choice=ev.choices[Number(choiceIndex)];
 if(!choice)return no('Invalid assimilation choice.');
 const l=g.civic?.provinces?.[ev.province],c=court(g,r),f=g.factions[r],s=cultureState(g,r,true);
 if(choice.id==='embrace'){
  if(l){l.acceptance=clamp((l.acceptance||50)+15,0,100);l.localTrust=clamp((l.localTrust||50)+12,0,100);}
 }else if(choice.id==='academies'){
  if(f)f.treasury=Math.max(0,(f.treasury||0)-80);
  if(l&&c){l.culture=c.culture;l.acceptance=clamp((l.acceptance||50)+8,0,100);}
 }else{
  if(l){l.acceptance=clamp((l.acceptance||50)+8,0,100);}
  if(g.identity?.realms?.[r]?.research)g.identity.realms[r].research.progress+=14;
  if(f)f.prestige=(f.prestige||0)+8;
 }
 delete g.identity.pendingAssimilationEvent;
 note(g,r,s,`${ev.provinceName}: ${choice.label}.`);
 return ok(`${ev.provinceName}: ${choice.label}.`);
}

export function tickCulture(g,r,land){
 const c=court(g,r),head=ruler(g,r),f=g.factions[r],s=cultureState(g,r);if(!c||!head||!f)return;
 // Track tenure for every controlled province (each tickCulture runs quarterly = +3 months)
 for(const p of land){
  const l=g.civic?.provinces?.[p.id];
  if(!l)continue;
  l.ruleTenure=(l.ruleTenure||0)+3;
 }
 if(s?.study){
  const x=s.study;if(x.person!==head.id||!head.alive||head.age<18||isImprisoned(g,head.id)||!land.length){s.study=null;note(g,r,s,'The court language study was discontinued.');}
  else if(g.turn>=x.ends){head.civic.languages=[...new Set([...knownLanguages(g,head),x.language])];head.memories??=[];head.memories.push('Learned '+x.language+' in '+g.year+'.');s.study=null;note(g,r,s,'The ruler learned '+x.language+'.');}
 }
 const headLangs=knownLanguages(g,head);
 for(const p of land){
  const l=g.civic?.provinces?.[p.id];
  if(!l||l.culture===c.culture||c.policy==='coercion')continue;
  const provLangs=cultureProfile(g,l.culture).languages;
  if(s?.language&&headLangs.includes(s.language)&&provLangs.includes(s.language)){l.acceptance=clamp(l.acceptance+1,0,100);l.localTrust=clamp(l.localTrust+1,0,100);}
 }
 // Pillar 6: Assimilation milestone event for player realm
 if(r===g.player&&g.identity&&!g.identity.pendingAssimilationEvent&&g.turn>0&&g.turn%18===0){
  g.identity.assimilationSeen??={};
  const milestone=land.find(p=>{
   const l=g.civic?.provinces?.[p.id];
   return l&&l.culture!==c.culture&&!g.identity.assimilationSeen[p.id]&&((l.acceptance||0)>=72||(l.ruleTenure||0)>=120);
  });
  if(milestone){
   const l=g.civic.provinces[milestone.id];
   g.identity.assimilationSeen[milestone.id]=g.turn;
   g.identity.pendingAssimilationEvent={
    realm:r,province:milestone.id,provinceName:milestone.name||milestone.id,localCulture:l.culture,courtCulture:c.culture,turn:g.turn,
    title:`Cultural Crossroads in ${milestone.name||milestone.id}`,
    text:`After years under the Crown, ${l.culture} guilds and scholars in ${milestone.name||milestone.id} have grown close to your ${c.culture} court. How shall you guide this milestone?`,
    choices:[
     {id:'embrace',label:'Embrace Local Customs',effect:'+15 acceptance & +12 local trust (opens path to Hybrid Culture)'},
     {id:'academies',label:`Sponsor ${c.culture} Royal Academies (−80g)`,effect:`Province adopts ${c.culture} court culture`},
     {id:'bilingual',label:'Issue Bilingual Court Charters',effect:'+8 acceptance, +14 research progress, +8 prestige'}
    ]
   };
  }
 }
 if(humanControlsRealm(g,r)||!land.length||g.turn<24||g.turn%24!==0||f.treasury<1000||!patron(g,r))return;
 const v=cultureView(g,r,land),target=v.contact.find(x=>x.acceptance<70);
 if(!target)return;const language=cultureProfile(g,target.culture).languages[0];
 if(v.canLanguage&&v.known.includes(language)&&language!==v.language)cultureAction(g,r,'culture-language',language);
 else if(v.canStudy&&!v.known.includes(language))cultureAction(g,r,'culture-study',language);
}

export const culturalTraditionForGroup = group => (CULTURAL_TRADITIONS[traditionTreeForGroup(group)] || CULTURAL_TRADITIONS['Global Regional'])[0];
