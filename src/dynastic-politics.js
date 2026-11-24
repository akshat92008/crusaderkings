import {personalUnionAction,reconcilePersonalUnions,unionJuniorDomain} from './personal-unions.js';
import {humanControlsRealm,humanControlsCharacter,reconcileCareer} from './player-career.js';
import {estateLaw,estateSuccession} from './estate-succession.js';
import {characterInteraction,recordLifeEvent,rememberBereavement,personalPoliticalSupport} from './character-agency.js';
import {reconcileRegency,tickRegency,regencyAction} from './regency-systems.js';
import {successionCandidates,nominateSuccessor,hereditaryLine,crownExcluded,crownExclusionTerms,setCrownExclusion,crownPolicy,crownPolicyEligible,GENDER_LAWS,FAITH_LAWS,marriageLineage} from './succession-systems.js';
import {feudalHierarchy,obligationProfile,creditEstateIncome,estateExemptionAction} from './feudal-obligations.js';
import {estateDisputeAction} from './estate-conflicts.js';
import {resolveVassalPetition} from './vassal-courts.js';
import {marriageTerms,reconcileMarriageTreaties,inheritedClaims,WEDDING_CONTRACTS,MARRIAGE_POLICIES,marriagePolicy,marriageContract,divorceTerms,faithPermitsMarriage} from './dynastic-ties.js';
import {authorityAction,authorityModifiers,politicalEstates} from './realm-authority.js';
import {courtAction,initRoyalCourt,tickRoyalCourt} from './royal-court.js';
import {partitionInheritance,isImprisoned,regionalLoyalty,syncTitles} from './feudal-systems.js';
import {personalOpinion,changeOpinion} from './chronicle-systems.js';
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
function person(g,realm,age,opts={}){
 const p=g.politics,id='c'+p.next++,n=hash(realm+id),f=g.factions[realm];
 const c={id,realm,house:opts.house||'House of '+f.name,name:opts.name||pick(pools[f.continent]||pools.Europe,n)+' '+id,age,alive:true,sex:opts.sex||((n&1)?'female':'male'),parents:opts.parents||[],children:[],spouse:null,traits:[pick(traits,n),pick(traits,n>>>8)].filter((x,i,a)=>a.indexOf(x)===i),skills:{diplomacy:1+n%5,martial:1+(n>>>5)%5,stewardship:1+(n>>>10)%5,intrigue:1+(n>>>15)%5,learning:1+(n>>>20)%5},wealth:100,claims:[],memories:[],...opts};
 p.people[id]=c;for(const parent of c.parents)if(p.people[parent])p.people[parent].children.push(id);return c;
}
function link(a,b){a.spouse=b.id;b.spouse=a.id;delete a.marriageLineage;delete b.marriageLineage;}
function ancestors(p,c,depth=3){if(!c||depth<=0)return [];return c.parents.flatMap(id=>[id,...ancestors(p,p.people[id],depth-1)]);}
function eligible(p,a,b){return a&&b&&a.alive&&b.alive&&a.id!==b.id&&!a.spouse&&!b.spouse&&a.sex!==b.sex&&!a.parents.includes(b.id)&&!b.parents.includes(a.id)&&!ancestors(p,a).includes(b.id)&&!ancestors(p,b).includes(a.id)&&!ancestors(p,a).some(x=>ancestors(p,b).includes(x));}
function children(p,r){return r.children.map(id=>live(p,id)).filter(Boolean);}
function heirs(p,r){return children(p,r).filter(c=>c.house===r.house).sort((a,b)=>b.age-a.age||a.id.localeCompare(b.id));}
function successor(p,realm,g){return successionCandidates(g,realm)[0];}
export function successionPreview(g,realm){return g.politics?.realms?.[realm]?successor(g.politics,realm,g)||null:null;}
function sync(g,realm){const p=g.politics,s=p.realms[realm],r=p.people[s.ruler],old=g.kingdom.courts[realm];if(!old||!r)return;const h=successor(p,realm,g);old.dynasty=r.house;old.ruler={name:r.name,age:r.age,...r.skills};old.heir=h?{name:h.name,age:h.age}:{name:'No eligible child',age:0};old.steward=isImprisoned(g,s.council.steward)?1:live(p,s.council.steward)?.skills.stewardship||1;old.marshal=isImprisoned(g,s.council.marshal)?1:live(p,s.council.marshal)?.skills.martial||1;}
function newHolding(g,id){const p=g.politics,pr=g.provinces[id],realm=pr.owner;if(!p.realms[realm]){delete p.holdings[id];return;}const lord=person(g,realm,30+hash(id)%25,{house:'House of '+id.toUpperCase()});const child=person(g,realm,12+hash(id+'child')%12,{house:lord.house,parents:[lord.id]});p.holdings[id]={realm,lord:lord.id,loyalty:65,tax:1,levy:1,autonomy:1,wealth:0,concessionUntil:0};}
// Legal ownership changes can happen between monthly turns, including after a battle.
export function reconcileProvincialHolding(g,id){
 const p=g.politics,province=g.provinces[id];
 if(!p||!province)return false;
 const old=p.holdings[id];
 const shouldHaveHolding=Object.hasOwn(p.realms,province.owner);
 if(shouldHaveHolding?old?.realm===province.owner:!old)return false;
 newHolding(g,id);
 return true;
}
export function reconcilePoliticalHoldings(g){
 for(const id of Object.keys(g.provinces))reconcileProvincialHolding(g,id);
 syncTitles(g);
}
export function initPolitics(g,world){
 if(g.politics?.version===1)return g.politics;
 const p=g.politics={version:1,next:1,seed:145012,people:{},realms:{},holdings:{},situations:{},marriages:[],lastTick:-1};
 for(const f of world.factions){
  const old=g.kingdom.courts[f.id],r=person(g,f.id,old.ruler.age,{name:old.ruler.name,sex:'male',house:old.dynasty,skills:{diplomacy:old.ruler.diplomacy,martial:old.ruler.martial,stewardship:old.ruler.stewardship,intrigue:2,learning:2}}),wife=person(g,f.id,Math.max(18,r.age-4),{sex:'female',house:'Consort house of '+f.name});link(r,wife);
  const parent=person(g,f.id,r.age+23,{house:r.house});r.parents.push(parent.id);parent.children.push(r.id);person(g,f.id,Math.max(18,r.age-8),{house:r.house,sex:'female',parents:[parent.id]});person(g,f.id,Math.max(18,r.age-5),{house:r.house,sex:'male',parents:[parent.id]});
  const h=person(g,f.id,Math.min(old.heir.age,Math.max(1,r.age-18),Math.max(1,wife.age-18)),{name:old.heir.name,house:r.house,parents:[r.id,wife.id],sex:'male'});
  person(g,f.id,Math.max(1,h.age-3),{house:r.house,parents:[r.id,wife.id],sex:'female'});
  const council={};for(const role of ['chancellor','marshal','steward','spymaster','scholar'])council[role]=person(g,f.id,25+hash(f.id+role)%30,{house:'Court of '+f.name}).id;
  p.realms[f.id]={ruler:r.id,law:'eldest',council,lastLaw:-120};
 }
 for(const id of Object.keys(g.provinces))newHolding(g,id);
 for(const realm of Object.keys(p.realms))sync(g,realm);
 return p;
}
export function politicalRevenue(g,realm){return obligationProfile(g,realm).tax;}
export function politicalLevy(g,realm){return obligationProfile(g,realm).levy;}
const adults=(a,b)=>a?.age>=18&&b?.age>=18;
const royalFamily=(p,r)=>{if(!r)return [];const siblings=r.parents.flatMap(id=>p.people[id]?.children||[]).map(id=>live(p,id)).filter(Boolean);return [...new Set([r,...children(p,r),...siblings,...children(p,r).flatMap(c=>children(p,c)),...siblings.flatMap(c=>children(p,c))])].filter(c=>c.realm===r.realm);};
function compatible(g,a,b){
 return eligible(g.politics,a,b)&&!isImprisoned(g,a.id)&&!isImprisoned(g,b.id);
}
export function activeBetrothal(g,id){
 const promises=g.politics?.betrothals;
 return promises&&Object.values(promises).find(promise=>(promise.a===id||promise.b===id)&&validBetrothal(g,promise));
}
function validBetrothal(g,promise){
 const p=g.politics,a=p.people[promise.a],b=p.people[promise.b];
 return promise.expires>g.turn&&a?.realm===promise.sponsor&&b?.realm===promise.partner
  &&eligible(p,a,b);
}
function reservedMatches(g){
 const ids=new Set();
 for(const promise of Object.values(g.politics.betrothals||{})){
  if(validBetrothal(g,promise)){
   ids.add(promise.a);
   ids.add(promise.b);
  }
 }
 return ids;
}
export function marriageCandidates(g,realm){
 const p=g.politics,r=p?.people[p.realms[realm]?.ruler];if(!r)return [];
 const reserved=reservedMatches(g),own=royalFamily(p,r).filter(c=>c.age>=18&&!c.spouse&&!reserved.has(c.id));
 return Object.values(p.realms).flatMap(s=>{
  const other=p.people[s.ruler];
  const pool=other.realm===realm
   ?Object.values(p.people).filter(c=>c.realm===realm&&c.house!==r.house)
   :royalFamily(p,other);
  return own.flatMap(a=>{
   const matches=pool.filter(b=>adults(a,b)&&!reserved.has(b.id)&&compatible(g,a,b));
   return (other.realm===realm?matches.slice(0,12):matches)
    .map(b=>({a:a.id,b:b.id,label:a.name+' × '+b.name+' ('+(realm===b.realm?'domestic':g.factions[b.realm].name)+')',realm:b.realm}));
  });
 });
}
const betrothalAge=p=>p?.age>=12&&p.age<18;
export function betrothalCandidates(g,realm,id){
 const p=g.politics,r=p?.people[p.realms[realm]?.ruler],a=p?.people[id];
 if(!r||!a?.alive||a.realm!==realm||!betrothalAge(a)||!royalFamily(p,r).includes(a)||a.spouse||activeBetrothal(g,id)||isImprisoned(g,id))return [];
 const reserved=reservedMatches(g);
 return Object.values(p.realms).flatMap(s=>royalFamily(p,p.people[s.ruler]))
  .filter(b=>betrothalAge(b)&&!reserved.has(b.id)&&compatible(g,a,b))
  .map(b=>({id:b.id,realm:b.realm,...marriageTerms(g,a,b)}));
}
function betrothalAction(g,action,id,other){
 const p=g.politics,realm=g.player,a=p.people[id];
 if(a?.realm!==realm)return {ok:false,msg:'Choose a member of your own court.'};
 if(action==='break-betrothal'){
  const promise=activeBetrothal(g,id);
  if(!promise)return {ok:false,msg:'No active betrothal.'};
  const foreign=promise.sponsor===realm?promise.partner:promise.sponsor;
  if(foreign!==realm){
   const court=g.factions[foreign];
   court.relations[realm]=clamp((court.relations[realm]||0)-15,-100,100);
  }
  delete p.betrothals[promise.a];
  log(g,'The betrothal of '+a.name+' was broken.');
  return {ok:true,msg:'Betrothal broken.'};
 }
 const candidate=betrothalCandidates(g,realm,id).find(b=>b.id===other);
 if(!candidate?.accepted)return {ok:false,msg:candidate?.reasons.join(' · ')||'Select an eligible royal match.'};
 return arrangeBetrothal(g,realm,a,candidate,action==='betroth-maternal'?'maternal':action==='betroth-settlement'?'paternal_settlement':action==='betroth-maternal-settlement'?'maternal_settlement':'paternal');
}
function arrangeBetrothal(g,realm,a,candidate,contract='paternal'){
 const p=g.politics,f=g.factions[realm];
 if(f.treasury<60)return {ok:false,msg:'Requires 60 gold to arrange the betrothal.'};
 f.treasury-=60;
 (p.betrothals??={})[a.id]={a:a.id,b:candidate.id,sponsor:realm,partner:candidate.realm,expires:g.turn+108,contract};
 if(realm===g.player||candidate.realm===g.player)log(g,a.name+' was betrothed to '+p.people[candidate.id].name+'.');
 return {ok:true,msg:'Betrothal recorded. The wedding costs '+(180+WEDDING_CONTRACTS[contract].settlement)+' gold when both reach adulthood.'};
}
function arrangeAiBetrothals(g){
 const p=g.politics;
 for(const [realm,state] of Object.entries(p.realms)){
  const faction=g.factions[realm],plan=g.strategy?.plans?.[realm];
  if(humanControlsRealm(g,realm)||humanControlsCharacter(g,p.realms[realm]?.ruler)||faction.treasury<550||plan?.goal!=='diplomacy')continue;
  if(Object.values(p.betrothals||{}).some(x=>x.sponsor===realm&&validBetrothal(g,x)))continue;
  const heir=children(p,p.people[state.ruler]).filter(betrothalAge).sort((a,b)=>b.age-a.age||a.id.localeCompare(b.id))[0];
  if(!heir)continue;
  const best=betrothalCandidates(g,realm,heir.id)
   .filter(x=>x.realm!==realm&&!humanControlsRealm(g,x.realm)&&x.accepted&&x.score>=60)
   .sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id))[0];
  if(best)arrangeBetrothal(g,realm,heir,best);
 }
}
function settleBetrothals(g){
 const p=g.politics;
 for(const promise of Object.values(p.betrothals||{})){
  if(!validBetrothal(g,promise)){
   delete p.betrothals[promise.a];
   if([promise.sponsor,promise.partner].includes(g.player))log(g,'A royal betrothal ended without a wedding.');
   continue;
  }
  const a=p.people[promise.a],b=p.people[promise.b];
  if(adults(a,b)&&marry(g,a,b,Object.hasOwn(WEDDING_CONTRACTS,promise.contract)?promise.contract:'paternal').ok)delete p.betrothals[promise.a];
 }
}
function changeCrownExclusion(g,id,exclude){
 const realm=g.player,p=g.politics,s=p.realms[realm],r=p.people[s.ruler],target=p.people[id],f=g.factions[realm];
 const terms=crownExclusionTerms(g,realm,id);
 if(!terms||terms.excluded===exclude)return {ok:false,msg:'Select an eligible dynast for this action.'};
 if(r.age<18||isImprisoned(g,r.id)||!councilPermission(g,realm,'law'))return {ok:false,msg:'Crown succession requires a free adult ruler and approval from a binding council or regent.'};
 if(f.prestige<terms.prestige||f.legitimacy<55)return {ok:false,msg:'Requires '+terms.prestige+' prestige and at least 55 legitimacy.'};
 f.prestige-=terms.prestige;
 f.legitimacy-=terms.legitimacy;
 setCrownExclusion(target,realm,exclude);
 if(exclude&&s.nominee===id)delete s.nominee;
 changeOpinion(g,r.id,id,exclude?-35:20);
 const message=target.name+(exclude?' was excluded from crown succession.':' regained crown succession rights.');
 target.memories=[...target.memories,g.year+': '+message].slice(-30);
 sync(g,realm);
 log(g,message);
 return {ok:true,msg:message};
}
export function personalMarriage(g,aId,bId){const p=g.politics,a=live(p,aId),b=live(p,bId);if(!adults(a,b)||!a||!b||a.realm!==b.realm||!compatible(g,a,b)||!faithPermitsMarriage(g,a,b)||activeBetrothal(g,aId)||activeBetrothal(g,bId)||humanControlsCharacter(g,aId)||humanControlsCharacter(g,bId)||p.realms[a.realm]?.ruler===aId||p.realms[b.realm]?.ruler===bId||a.wealth<90)return {ok:false,msg:'Personal marriage unavailable.'};a.wealth-=90;link(a,b);p.marriages.push({a:a.id,b:b.id,year:g.year,personal:true});recordLifeEvent(g,a,'marriage',b,a.name+' married '+b.name+'.');recordLifeEvent(g,b,'marriage',a,b.name+' married '+a.name+'.');return {ok:true,msg:'Personal marriage celebrated.'};}
function marry(g,a,b,contract='paternal'){const p=g.politics,agreement=WEDDING_CONTRACTS[contract];if(!agreement)return {ok:false,msg:'Unknown marriage contract.'};const {lineage,settlement}=agreement;if(!adults(a,b)||!compatible(g,a,b))return {ok:false,msg:'Marriage candidates are no longer eligible.'};const f=g.factions[a.realm],o=g.factions[b.realm];if(f.treasury<180+settlement)return {ok:false,msg:'Need '+(180+settlement)+' gold for this wedding.'};const terms=marriageTerms(g,a,b);if(!terms.accepted)return {ok:false,msg:terms.reasons.join(' · ')};f.treaties??={};o.treaties??={};f.treasury-=180+settlement;if(settlement)b.wealth=(Number(b.wealth)||0)+settlement;link(a,b);a.marriageLineage=b.marriageLineage=lineage;p.marriages.push({a:a.id,b:b.id,year:g.year,turn:g.turn,lineage,settlement,contract});recordLifeEvent(g,a,'marriage',b,a.name+' married '+b.name+'.');recordLifeEvent(g,b,'marriage',a,b.name+' married '+a.name+'.');if(a.realm!==b.realm){f.relations[b.realm]=clamp((f.relations[b.realm]||0)+20,-100,100);o.relations[a.realm]=clamp((o.relations[a.realm]||0)+20,-100,100);if(!f.treaties[b.realm]&&!o.treaties[a.realm]){f.treaties[b.realm]='marriage';o.treaties[a.realm]='marriage';}}f.legitimacy=clamp(f.legitimacy+6,0,100);f.prestige+=4;log(g,a.name+' married '+b.name+'.');return {ok:true,msg:'Dynastic marriage celebrated.'};}
// Shared wedding entry point for campaign negotiations; no duplicate spouse or treaty logic.
export function negotiatedMarriage(g,realm,a,b){if(!marriageCandidates(g,realm).some(x=>x.a===a&&x.b===b))return {ok:false,msg:'The proposed pair is no longer eligible.'};return marry(g,g.politics.people[a],g.politics.people[b]);}
export function marryRealm(g,other){const option=marriageCandidates(g,g.player).find(x=>x.realm===other);if(!option)return {ok:false,msg:'No eligible adult royal relatives in these houses.'};return marry(g,g.politics.people[option.a],g.politics.people[option.b]);}
export function politicsAction(g,world,action,id,extra){const p=initPolitics(g,world),s=p.realms[g.player],f=g.factions[g.player],v=p.holdings[id],r=p.people[s.ruler];
 if(action.startsWith('union-'))return personalUnionAction(g,action,id);
 if(['personal-gift','personal-patronage','personal-rebuke'].includes(action))return characterInteraction(g,g.player,id,action);
 if(action.startsWith('regency-'))return regencyAction(g,g.player,action,extra||id);
 if(['betroth','betroth-maternal','betroth-settlement','betroth-maternal-settlement','break-betrothal'].includes(action))return betrothalAction(g,action,id,extra);
 if(action==='disinherit'||action==='restore-inheritance')return changeCrownExclusion(g,id,action==='disinherit');
 if(action==='nominate-successor'){const result=nominateSuccessor(g,g.player,id);if(result.ok)sync(g,g.player);return result;}
 if(action==='estate-dispute')return estateDisputeAction(g,g.player,id,extra);
 if(action==='vassal-petition')return resolveVassalPetition(g,g.player,id,extra);
 if(action==='charter-grant'||action==='charter-revoke'){
  const grant=action==='charter-grant';
  const result=estateExemptionAction(g,g.player,id,extra,grant,grant||councilPermission(g,g.player,'revoke'));
  if(result.ok)log(g,result.msg);
  return result;
 }
 if(action==='authority')return authorityAction(g,g.player,id,councilPermission(g,g.player,'law'));
 if(['court-appoint','court-dismiss','court-standard','court-audience','court-audience-answer','court-project'].includes(action))return courtAction(g,g.player,action,id,extra);
 if(action==='dispatch')return resolvePoliticalDispatch(g,g.player,Number(id));
 if(['marry','marry-maternal','marry-settlement','marry-maternal-settlement'].includes(action)){const a=p.people[id],b=p.people[extra];if(a?.realm!==g.player||!marriageCandidates(g,g.player).some(x=>x.a===id&&x.b===extra))return {ok:false,msg:'Select an eligible royal pair.'};return marry(g,a,b,action==='marry-maternal'?'maternal':action==='marry-settlement'?'paternal_settlement':action==='marry-maternal-settlement'?'maternal_settlement':'paternal');}
 if(action==='appoint'){const candidate=live(p,extra);if(!Object.hasOwn(s.council,id)||!candidate||candidate.realm!==g.player||candidate.age<18||isImprisoned(g,candidate.id)||candidate.id===r.id||Object.values(s.council).includes(candidate.id)||Object.values(g.royalCourt?.realms[g.player]?.offices||{}).some(o=>o.person===candidate.id)||f.treasury<80)return {ok:false,msg:'Select an adult unassigned courtier and have 80 gold.'};f.treasury-=80;s.council[id]=candidate.id;sync(g,g.player);log(g,candidate.name+' appointed '+id+'.');return {ok:true,msg:'Council appointment confirmed.'};}
 if(action==='marriage-policy'){
  if(!Object.hasOwn(MARRIAGE_POLICIES,id)||id===marriagePolicy(g,g.player))return {ok:false,msg:'Choose a different marriage charter.'};
  if(!humanControlsRealm(g,g.player)||!r.alive||r.age<18||isImprisoned(g,r.id)||!councilPermission(g,g.player,'law')||f.legitimacy<65||f.treasury<150||g.turn-(s.lastMarriagePolicy??-120)<120)return {ok:false,msg:'Requires a free adult sovereign, council approval, 150 gold, 65 legitimacy and ten years between marriage reforms.'};
  f.treasury-=150;s.marriagePolicy=id;s.lastMarriagePolicy=g.turn;log(g,'Marriage charter reformed: '+MARRIAGE_POLICIES[id]);return {ok:true,msg:MARRIAGE_POLICIES[id]+' enacted.'};
 }
 if(action==='divorce'){
  const a=p.people[id],terms=divorceTerms(g,id),b=p.people[terms?.spouse];
  if(!humanControlsRealm(g,g.player)||a?.realm!==g.player||!royalFamily(p,r).includes(a)||!adults(a,b)||!terms||!r.alive||r.age<18||isImprisoned(g,r.id)||isImprisoned(g,a.id)||isImprisoned(g,b.id))return {ok:false,msg:'Select a married adult royal relative under a free adult sovereign.'};
  if(terms.reason)return {ok:false,msg:terms.reason};
  if(!councilPermission(g,g.player,'law')||f.treasury<terms.cost||f.prestige<terms.prestige||f.legitimacy<55)return {ok:false,msg:'Requires council approval, 120 gold, 15 prestige and 55 legitimacy.'};
  f.treasury-=terms.cost;f.prestige-=terms.prestige;f.legitimacy-=terms.legitimacy;
  const contract=marriageContract(g,a.id);contract.ended='divorce';contract.endedTurn=g.turn;
  if(!p.marriages.includes(contract))p.marriages.push({...contract,year:null});
  a.spouse=b.spouse=null;delete a.marriageLineage;delete b.marriageLineage;
  changeOpinion(g,a.id,b.id,-35);changeOpinion(g,b.id,a.id,-35);
  if(a.realm!==b.realm){const o=g.factions[b.realm];f.relations[b.realm]=clamp((f.relations[b.realm]||0)-25,-100,100);o.relations[a.realm]=clamp((o.relations[a.realm]||0)-25,-100,100);}
  reconcileMarriageTreaties(g);recordLifeEvent(g,a,'divorce',b,a.name+' divorced '+b.name+'.');recordLifeEvent(g,b,'divorce',a,b.name+' divorced '+a.name+'.');log(g,a.name+' divorced '+b.name+'.');return {ok:true,msg:'Marriage dissolved. Children and existing inheritance claims remain.'};
 }
 if(action==='gender-law'||action==='faith-law'){
  const gender=action==='gender-law',choices=gender?GENDER_LAWS:FAITH_LAWS,field=gender?'genderLaw':'faithLaw',current=crownPolicy(g,g.player)[gender?'gender':'faith'];
  if(!Object.hasOwn(choices,id)||id===current)return {ok:false,msg:'Choose a different crown eligibility rule.'};
  if(g.playerCareer?.mode==='vassal'||!r.alive||r.age<18||isImprisoned(g,r.id)||!councilPermission(g,g.player,'law')||f.legitimacy<65||f.treasury<150||g.turn-(s.lastEligibilityLaw??-120)<120)return {ok:false,msg:'Requires a free adult sovereign, council approval, 150 gold, 65 legitimacy and ten years between eligibility reforms.'};
  if(g.civic?.realms[g.player]?.government==='republic')return {ok:false,msg:'Republican offices retain their existing election eligibility.'};
  f.treasury-=150;s[field]=id;s.lastEligibilityLaw=g.turn;delete s.nominee;
  for(const h of Object.values(p.holdings))if(h.realm===g.player)h.loyalty=clamp(h.loyalty-5,0,100);
  sync(g,g.player);log(g,'Crown eligibility reformed: '+choices[id]);return {ok:true,msg:choices[id]+' enacted.'};
 }
 if(action==='law'){if(g.civic?.realms[g.player]?.government==='republic'&&id!=='elective')return {ok:false,msg:'The republic requires elective succession.'};if(!councilPermission(g,g.player,'law'))return {ok:false,msg:'The council or regent rejected the succession reform.'};if(!['eldest','youngest','elective','partition','seniority'].includes(id)||id===s.law||g.turn-s.lastLaw<120||f.legitimacy<65||f.treasury<250)return {ok:false,msg:'Reform needs 250 gold, 65 legitimacy and ten years between changes.'};f.treasury-=250;s.law=id;delete s.nominee;s.lastLaw=g.turn;for(const h of Object.values(p.holdings))if(h.realm===g.player)h.loyalty=clamp(h.loyalty-8,0,100);reconcilePersonalUnions(g);sync(g,g.player);log(g,'The crown reformed succession: '+id);return {ok:true,msg:'Succession law changed.'};}
 if(!v||v.realm!==g.player||g.provinces[id]?.owner!==g.player||v.lord===r.id)return {ok:false,msg:'Select a loyal holding in your realm.'};
 if(action==='gift'){if(f.treasury<100)return {ok:false,msg:'Need 100 gold.'};f.treasury-=100;v.wealth+=100;v.loyalty=clamp(v.loyalty+15,0,100);}
 else if(action==='tax'||action==='levy'||action==='autonomy'){if(v.exemptions?.[action])return {ok:false,msg:'Revoke the estate exemption before changing this rate.'};const value=Number(extra);if(![0,1,2].includes(value)||v[action]===value)return {ok:false,msg:'Select a different contract level.'};const delta=value-v[action];v[action]=value;v.loyalty=clamp(v.loyalty+(action==='autonomy'?12:-12)*delta,0,100);}
 else if(action==='replace'){if(!councilPermission(g,g.player,'revoke')&&!(v.leverageUntil>g.turn))return {ok:false,msg:'Binding council refused revocation; investigate the estate or secure support.'};if(f.legitimacy<50)return {ok:false,msg:'Need 50 legitimacy.'};const previous=p.people[v.lord];v.lord=person(g,g.player,35,{house:'Appointed house of '+id}).id;v.loyalty=60;f.legitimacy-=10;previous.memories.push('Lost the holding of '+id);for(const h of Object.values(p.holdings))if(h.realm===g.player&&h!==v)h.loyalty=clamp(h.loyalty-5,0,100);}
 else if(action==='concede'){if(v.loyalty>=45||g.turn<v.concessionUntil||f.treasury<150)return {ok:false,msg:'No active grievance, recent concession, or insufficient gold.'};f.treasury-=150;v.autonomy=2;v.loyalty=clamp(v.loyalty+30,0,100);v.concessionUntil=g.turn+24;}
 else return {ok:false,msg:'Unknown political action.'};
 syncTitles(g);log(g,'The crown negotiated '+action+' with '+p.people[v.lord].name+'.');return {ok:true,msg:'Vassal agreement updated.'};
}
function death(g,world,c){const p=g.politics;rememberBereavement(g,c);c.alive=false;c.deathYear=g.year;if(c.spouse){const history=(p.marriages||[]).slice().reverse().find(m=>!m.ended&&((m.a===c.id&&m.b===c.spouse)||(m.b===c.id&&m.a===c.spouse)));if(history){history.ended='death';history.endedTurn=g.turn;}const s=p.people[c.spouse];if(s){s.spouse=null;delete s.marriageLineage;}c.spouse=null;delete c.marriageLineage;}const realm=c.realm,s=p.realms[realm];let estateHeir=hereditaryLine(g,c)[0]||null;if(s?.ruler===c.id){let h=successor(p,realm,g);if(!h)h=Object.values(p.people).filter(x=>x.alive&&x.realm===realm&&x.house===c.house&&x.id!==c.id&&!isImprisoned(g,x.id)&&!crownExcluded(x,realm)&&crownPolicyEligible(g,realm,x)).sort((a,b)=>b.age-a.age)[0]||person(g,realm,30,{house:'Successor house of '+g.factions[realm].name,...(crownPolicy(g,realm).gender==='female_only'?{sex:'female'}:crownPolicy(g,realm).gender==='male_only'?{sex:'male'}:{})});estateHeir=estateHeir||h;s.ruler=h.id;delete s.nominee;partitionInheritance(g,realm,c,h);for(const [role,id] of Object.entries(s.council))if(id===h.id)s.council[role]=person(g,realm,35,{house:'Court of '+g.factions[realm].name}).id;g.kingdom.courts[realm].successions++;g.factions[realm].legitimacy=clamp(g.factions[realm].legitimacy-12,0,100);for(const v of Object.values(p.holdings))if(v.realm===realm)v.loyalty=clamp(v.loyalty-12,0,100);if(realm===g.player)log(g,c.name+' died. '+h.name+' inherited the crown.');}
 const inherited=Object.entries(p.holdings).filter(([,h])=>h.lord===c.id&&!unionJuniorDomain(g,h.realm,c.id)).map(([id,h])=>{
  const law=estateLaw(g,id);
  return {id,h,law,heir:law==='customary'?null:estateSuccession(g,id,law).heir};
 });
 for(const {id,h:v,law,heir:chosen} of inherited){
  let heir;
  if(law==='customary'){
   estateHeir??=person(g,v.realm,32,{house:'Successor house of '+id});
   heir=estateHeir;
  }else heir=chosen;
  v.lord=(heir??person(g,v.realm,32,{house:'Successor house of '+id})).id;
  v.loyalty=law!=='customary'&&v.lord===p.realms[v.realm]?.ruler?100:clamp(v.loyalty-8,0,100);
  if(law!=='customary'&&v.realm===g.player)log(g,p.people[v.lord].name+' inherited '+id+' under its estate charter.');
 }
 for(const [role,id] of Object.entries(s?.council||{}))if(id===c.id)s.council[role]=person(g,realm,35,{house:'Court of '+g.factions[realm].name}).id;
 const inheritance=Math.max(0,Number(c.wealth)||0);if(estateHeir){estateHeir.wealth=(Number(estateHeir.wealth)||0)+inheritance;}else if(g.factions[realm])g.factions[realm].treasury+=inheritance;c.wealth=0;
 if(s)reconcileRegency(g,realm);
 reconcilePersonalUnions(g);reconcileMarriageTreaties(g);
}

export function removePoliticalCharacter(g,world,id){const c=g.politics.people[id];if(!c?.alive)return false;death(g,world,c);sync(g,c.realm);syncTitles(g);reconcileCareer(g);return true;}

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

export function tickPolitics(g,world){const p=initPolitics(g,world);if(p.lastTick===g.turn)return;p.lastTick=g.turn;initRoyalCourt(g);
 for(const id of Object.keys(g.provinces))reconcileProvincialHolding(g,id);
 if(g.turn%12===0){
  const living=Object.values(p.people).filter(c=>c.alive);for(const c of living)c.age++;
  for(const c of living){if(!c.alive)continue;const risk=c.age>=90?1:c.age>=60?(c.age-58)*.006:c.age>=45?.008:.002;if(roll(p)<risk)death(g,world,c);}
  for(const a of living){const b=live(p,a.spouse);if(!a.alive||!b||isImprisoned(g,a.id)||isImprisoned(g,b.id)||a.sex!=='female'||a.age<18||a.age>42||b.age<18||b.age>75||a.children.length>=4||b.children.length>=4||roll(p)>.18)continue;const lineage=marriageLineage(a,b);const child=person(g,lineage.realm,0,{house:lineage.house,parents:[a.id,b.id]});child.claims=inheritedClaims(g,a,b,child.realm);recordLifeEvent(g,a,'birth',child,a.name+' welcomed '+child.name+'.');recordLifeEvent(g,b,'birth',child,b.name+' welcomed '+child.name+'.');if(b.realm===g.player||a.realm===g.player)log(g,'A child, '+child.name+', was born to '+a.name+' and '+b.name+'.');}
 }
 settleBetrothals(g);
 if(g.turn%12===0){
  arrangeAiBetrothals(g);
  // Royal AI chooses partners with existing relations; domestic matches keep family lines alive.
  for(const [realm,s] of Object.entries(p.realms)){const r=p.people[s.ruler];if(humanControlsRealm(g,realm)||humanControlsCharacter(g,r.id))continue;for(const a of [r,...children(p,r)]){if(a.realm!==realm||a.age<18||a.spouse||isImprisoned(g,a.id)||activeBetrothal(g,a.id)||roll(p)>.45)continue;const match=marriageCandidates(g,realm).filter(x=>x.a===a.id&&!humanControlsRealm(g,x.realm)&&x.realm!==realm).map(x=>({...x,terms:marriageTerms(g,a,p.people[x.b])})).filter(x=>x.terms.accepted).sort((x,y)=>y.terms.score-x.terms.score||x.b.localeCompare(y.b))[0];if(match&&marry(g,a,p.people[match.b]).ok){}else{const b=person(g,realm,Math.max(18,Math.min(35,a.age)),{sex:a.sex==='male'?'female':'male',house:'House of '+realm+' consorts'});link(a,b);}}}
 }
 reconcileMarriageTreaties(g);
 if(g.turn%3===0){const estates=Object.fromEntries(Object.keys(p.realms).map(r=>[r,politicalEstates(g,r)])),hierarchies=Object.fromEntries(Object.keys(p.realms).map(r=>[r,feudalHierarchy(g,r)]));for(const [id,v] of Object.entries(p.holdings)){const f=g.factions[v.realm],lord=p.people[v.lord];if(!f||!lord)continue;if(v.lord===p.realms[v.realm].ruler){v.loyalty=100;continue;}const target=clamp(55+(f.legitimacy-50)*.4+(f.stability-50)*.25-(v.tax-1)*15-(v.levy-1)*10+(v.autonomy-1)*10+(v.exemptions?.tax?6:0)+(v.exemptions?.levy?6:0)-(lord.traits.includes('ambitious')?12:0)+personalOpinion(g,p.realms[v.realm].ruler,lord.id)*.20+personalPoliticalSupport(g,lord.id,p.realms[v.realm].ruler)+regionalLoyalty(g,id)+authorityModifiers(g,v.realm,estates[v.realm]).loyalty-(estates[v.realm]?.byLord[v.lord]?.grievance||0),0,100);v.loyalty=clamp(v.loyalty+clamp(target-v.loyalty,-4,4),0,100);creditEstateIncome(g,id,Math.max(0,Math.round(g.provinces[id].development*(3-v.tax))),hierarchies[v.realm]);if(!humanControlsRealm(g,v.realm)&&v.loyalty<20&&v.autonomy===2&&f.treasury<150&&!v.exemptions?.levy)estateExemptionAction(g,v.realm,id,'levy',true,true);if(!humanControlsRealm(g,v.realm)&&v.loyalty<35&&f.treasury>=150){f.treasury-=150;v.loyalty+=20;v.autonomy=2;}
  const key='grievance:'+id,old=p.situations[key];if(v.loyalty<35){p.situations[key]={id:key,realm:v.realm,province:id,lord:v.lord,phase:v.loyalty<20?'ultimatum':'grievance',started:old?.started??g.turn};if(!old&&v.realm===g.player)log(g,lord.name+' is organizing opposition to the crown.');if(v.loyalty<15&&g.turn-p.situations[key].started>=12&&roll(p)<.25){g.provinces[id].unrest=clamp(g.provinces[id].unrest+25,0,100);f.stability=clamp(f.stability-8,0,100);v.loyalty=25;log(g,lord.name+' resisted royal authority; provincial unrest increased.');}}else if(old)delete p.situations[key];
 }}
 for(const realm of Object.keys(p.realms)){
  p.dispatches??={};p.dispatchHistory??={};
  if(p.dispatches[realm]&&(!politicalDispatch(g,realm)||g.turn-p.dispatches[realm].turn>12))delete p.dispatches[realm];
  if(g.turn%6===0)scheduleDispatch(g,realm);
  if(!humanControlsRealm(g,realm)&&g.turn%6===0){const d=politicalDispatch(g,realm);if(d){const options=d.choices.map((x,i)=>({x,i})).filter(({x})=>x.cost<=g.factions[realm].treasury-150||x.cost===0);const chosen=options.sort((a,b)=>(b.x.loyalty-b.x.cost*.03)-(a.x.loyalty-a.x.cost*.03))[0];if(chosen)resolvePoliticalDispatch(g,realm,chosen.i);}}
  const s=p.realms[realm],civic=g.civic?.realms[realm];if(civic?.government==='republic'&&g.turn-(civic.lastElection??0)>=60){const h=successor(p,realm,g);civic.lastElection=g.turn;if(h){const previous=p.people[s.ruler];s.ruler=h.id;delete s.nominee;for(const hld of Object.values(p.holdings))if(hld.realm===realm&&hld.lord===previous.id){hld.lord=h.id;hld.loyalty=100;}syncTitles(g);g.kingdom.courts[realm].successions++;g.factions[realm].legitimacy=clamp(g.factions[realm].legitimacy+4,0,100);for(const [role,id] of Object.entries(s.council))if(id===h.id)s.council[role]=person(g,realm,35,{house:'Court of '+g.factions[realm].name}).id;if(realm===g.player)log(g,previous.name+' left office. '+h.name+' won the republic’s election.');}}
  tickRegency(g,realm);
  sync(g,realm);
 }
 tickRoyalCourt(g);
}
