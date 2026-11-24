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
export function culturalContact(g,r,land){
 const c=court(g,r),local=land||Object.values(g.provinces).filter(p=>own(g,r,p.id)),groups=new Map();
 for(const p of local){const l=g.civic.provinces[p.id];if(!l?.culture||l.culture===c.culture)continue;
  let x=groups.get(l.culture);if(!x){x={culture:l.culture,provinces:0,acceptance:0,trust:0};groups.set(l.culture,x);}
  x.provinces++;x.acceptance+=l.acceptance??50;x.trust+=l.localTrust??50;
 }
 return [...groups.values()].map(x=>({...x,acceptance:Math.round(x.acceptance/x.provinces),trust:Math.round(x.trust/x.provinces)})).sort((a,b)=>b.provinces-a.provinces||a.culture.localeCompare(b.culture));
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
 const hybrids=contact.filter(x=>x.acceptance>=70&&x.trust>=65);
 return {profile,language,known,options,study:s?.study||null,contact,hybrids,patron:p?.name||p?.id||null,leader:cultureLeadership(g,c.culture),wait,
  canStudy:eligible&&!s?.study&&g.turn-(s?.lastStudy??-120)>=6&&f.treasury>=80&&known.length<6,
  canLanguage:eligible&&g.turn-(s?.lastLanguage??-120)>=24&&f.treasury>=100,
  canHybrid:canFound&&hybrids.length>0,canDiverge:canFound&&i.innovations.length>=2,last:s?.history[0]||null};
}
export function cultureModifiers(g,r){
 const head=ruler(g,r),s=cultureState(g,r),out={diplomacy:0};if(!head?.alive||!s)return out;
 const known=knownLanguages(g,head);if(known.includes(courtLanguage(g,r)))out.diplomacy=Math.min(4,Math.max(0,known.length-1)*2);return out;
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
 if(action==='culture-hybrid'||action==='culture-diverge'){
  const hybrid=action==='culture-hybrid',name=String(id||'').trim(),other=hybrid?v.hybrids.find(x=>x.culture===extra):null;
  if(!validName(g,name)||(hybrid?(!v.canHybrid||!other):!v.canDiverge))return no('Requires a unique name, a cultural patron, sufficient resources, eligible local contact or two innovations, and ten years between changes.');
  const parent=c.culture,source=hybrid?cultureProfile(g,other.culture):null,parents=hybrid?[parent,other.culture]:[parent];
  const group=hybrid&&source.group!==v.profile.group?v.profile.group+' / '+source.group:v.profile.group;
  const languages=[...new Set([v.language,...v.profile.languages,...(source?.languages||[])])];
  (g.identity.cultureDefinitions??={})[name]={kind:hybrid?'hybrid':'divergent',parents,group,languages,founded:g.turn,realm:r};
  head.civic.languages=v.known;head.civic.culture=name;c.culture=name;f.treasury-=450;f.prestige-=30;s.lastCulture=g.turn;
  note(g,r,s,'The court established '+name+'. Existing provincial cultures were preserved.');return ok('New court culture established.');
 }
 return no('Unknown cultural action.');
}
export function tickCulture(g,r,land){
 const c=court(g,r),head=ruler(g,r),f=g.factions[r],s=cultureState(g,r);if(!c||!head||!f)return;
 if(s?.study){
  const x=s.study;if(x.person!==head.id||!head.alive||head.age<18||isImprisoned(g,head.id)||!land.length){s.study=null;note(g,r,s,'The court language study was discontinued.');}
  else if(g.turn>=x.ends){head.civic.languages=[...new Set([...knownLanguages(g,head),x.language])];head.memories??=[];head.memories.push('Learned '+x.language+' in '+g.year+'.');s.study=null;note(g,r,s,'The ruler learned '+x.language+'.');}
 }
 if(s?.language&&knownLanguages(g,head).includes(s.language))for(const p of land){
  const l=g.civic.provinces[p.id];if(l?.culture!==c.culture&&cultureProfile(g,l?.culture).languages.includes(s.language)&&c.policy!=='coercion'){l.acceptance=clamp(l.acceptance+1,0,100);l.localTrust=clamp(l.localTrust+1,0,100);}
 }
 if(humanControlsRealm(g,r)||!land.length||g.turn<24||g.turn%24!==0||f.treasury<1000||!patron(g,r))return;
 const v=cultureView(g,r,land),target=v.contact.find(x=>x.acceptance<70);
 if(!target)return;const language=cultureProfile(g,target.culture).languages[0];
 if(v.canLanguage&&v.known.includes(language)&&language!==v.language)cultureAction(g,r,'culture-language',language);
 else if(v.canStudy&&!v.known.includes(language))cultureAction(g,r,'culture-study',language);
}
