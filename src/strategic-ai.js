import {invasionReserved} from './invasion-reservations.js';
import {humanControlsRealm} from './player-career.js';
import {campaignArmyPower,campaignGarrison} from './border-battle.js';
import {nearestOwnedRoute} from './campaign-balance.js';
import {
 nonAggression,aidStrength,diplomaticSupport,fieldContingentsAt,
 hasHostageBar,coalitionAgainst,joinCoalition,diplomaticThreat,demandTribute
} from './diplomacy-systems.js';
import {
 controller,availableCasusBelli,declareCasusBelliWar,realmFaith
} from './campaign-war.js';
import {embarked} from './naval-systems.js';
import {armyReadiness,onArmyMarch} from './military-systems.js';

// Deterministic strategic planning with 8 ruler personality profiles, persistent objectives,
// dedicated budgets, multi-front defense, core protection, coalition response, and threat avoidance.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),pair=(a,b)=>[a,b].sort().join('|');
const size=a=>(a.infantry||0)+(a.archers||0)+(a.cavalry||0);
const land=(g,id)=>Object.values(g.provinces).filter(p=>p.owner===id&&controller(g,p.id)===id);
const ruler=(g,id)=>g.politics?.people?.[g.politics?.realms?.[id]?.ruler];
const relation=(g,a,b)=>g.factions[a]?.relations?.[b]||0;
const war=(g,a,b)=>Object.values(g.conflict?.wars||{}).find(w=>w.status==='active'&&((w.attacker===a&&w.defender===b)||(w.attacker===b&&w.defender===a)));
const truce=(g,a,b)=>(g.conflict?.truces?.[pair(a,b)]||0)>g.turn;
const alliance=(g,a,b)=>['alliance','marriage'].includes(g.factions[a]?.treaties?.[b]);
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};

export const PERSONALITY_PROFILES={
 ambitious:{id:'ambitious',label:'Ambitious Expansionist',taxPreference:1,levyPreference:2,expansionThreshold:0.85,defenseReserve:0.20,raidBias:0.08},
 cautious:{id:'cautious',label:'Cautious Guardian',taxPreference:1,levyPreference:1,expansionThreshold:1.30,defenseReserve:0.45,raidBias:-0.14},
 greedy:{id:'greedy',label:'Greedy Magnate',taxPreference:2,levyPreference:0,expansionThreshold:1.10,defenseReserve:0.30,raidBias:-0.05},
 zealous:{id:'zealous',label:'Zealous Crusader',taxPreference:1,levyPreference:2,expansionThreshold:0.88,defenseReserve:0.25,raidBias:0.06},
 just:{id:'just',label:'Just Sovereign',taxPreference:0,levyPreference:1,expansionThreshold:1.12,defenseReserve:0.35,raidBias:-0.10},
 cruel:{id:'cruel',label:'Cruel Warlord',taxPreference:2,levyPreference:2,expansionThreshold:0.78,defenseReserve:0.15,raidBias:0.12},
 diplomatic:{id:'diplomatic',label:'Diplomatic Statesman',taxPreference:0,levyPreference:0,expansionThreshold:1.18,defenseReserve:0.30,raidBias:-0.12},
 martial:{id:'martial',label:'Martial Commander',taxPreference:1,levyPreference:2,expansionThreshold:0.82,defenseReserve:0.20,raidBias:0.09}
};

export function initStrategy(g,world){
 if(g.strategy?.version===1){
  g.strategy.lessons??={};
  g.strategy.abandoned??=[];
  return g.strategy;
 }
 return g.strategy={version:1,plans:{},pacts:{},history:[],lessons:{},abandoned:[],lastTick:-1};
}

function note(g,realm,message){
 const s=g.strategy;
 s.history.unshift({realm,turn:g.turn,message});
 s.history=s.history.slice(0,180);
 if(realm===g.player&&Array.isArray(g.log)){
  g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});
  g.log=g.log.slice(0,45);
 }
}

export function personalityProfile(g,realm){
 const r=ruler(g,realm),t=r?.traits||[],has=x=>t.includes(x)?1:0,k=r?.skills||{};
 const scores={
  ambitious:18+44*has('ambitious')+10*has('proud')+10*has('brave')-30*has('content')+((k.martial||3)-2)*3+((k.intrigue||3)-2)*2,
  cautious:20+46*has('cautious')+22*has('content')+16*has('patient')+12*has('reserved')-20*has('brave')-20*has('wrathful'),
  greedy:16+48*has('greedy')+12*has('avaricious')+10*has('diligent')-25*has('generous')+((k.stewardship||3)-2)*5,
  zealous:14+52*has('zealous')+25*has('pious')+25*has('devout')-25*has('cynical')+((k.learning||3)-2)*4,
  just:16+48*has('just')+22*has('honest')+16*has('fair')-28*has('arbitrary')-20*has('deceitful')+((k.diplomacy||3)-2)*3,
  cruel:14+50*has('cruel')+38*has('wrathful')+24*has('arbitrary')+18*has('deceitful')+18*has('sadistic')-25*has('generous')-20*has('just')+((k.intrigue||3)-2)*3,
  diplomatic:16+46*has('gregarious')+34*has('generous')+34*has('diplomatic')+16*has('kind')-22*has('reserved')-18*has('wrathful')+((k.diplomacy||3)-2)*5,
  martial:18+38*has('brave')+30*has('diligent')+40*has('strategist')+((k.martial||3)>=4?20:0)+((k.martial||3)-2)*6-18*has('indolent')
 };
 const ordered=Object.entries(scores).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 const key=ordered[0][0];
 return {...PERSONALITY_PROFILES[key],scores};
}

export function temperament(g,realm){
 const r=ruler(g,realm),t=r?.traits||[],has=x=>t.includes(x)?1:0,k=r?.skills||{};
 const prof=personalityProfile(g,realm);
 const aggression=cap(45+25*has('ambitious')+18*has('brave')+12*has('wrathful')+14*has('cruel')+10*has('zealous')-25*has('content')-20*has('cautious')+3*((k.martial||3)-3),10,95);
 const prudence=cap(50+25*has('cautious')+15*has('patient')+12*has('just')-20*has('wrathful')-15*has('cruel')-12*has('brave'),10,95);
 const commerce=cap(45+22*has('greedy')+12*has('diligent')+7*((k.stewardship||3)-3),10,95);
 const diplomacy=cap(45+20*has('gregarious')+15*has('generous')+10*has('just')-15*has('reserved')-15*has('cruel')+7*((k.diplomacy||3)-3),10,95);
 const legacyName=aggression>=65?'Expansionist':prudence>=65?'Cautious guardian':commerce>=62?'Commercial ruler':diplomacy>=62?'Diplomatic ruler':'Pragmatist';
 return {
  aggression,prudence,commerce,diplomacy,
  name:legacyName,
  profile:prof.id,
  label:prof.label,
  scores:prof.scores,
  taxPreference:prof.taxPreference,
  levyPreference:prof.levyPreference,
  expansionThreshold:prof.expansionThreshold,
  defenseReserve:prof.defenseReserve
 };
}

const lessonKey=(r,o)=>r+'|'+o;
export function battleLesson(g,r,o){const x=g.strategy?.lessons?.[lessonKey(r,o)];return x&&g.turn-x.last<=36?x:null;}

export function recordStrategicBattle(g,r,o,won,loss=0){
 if(!g.factions[r]||!g.factions[o]||r===o)return;
 const s=initStrategy(g),old=battleLesson(g,r,o);
 s.lessons[lessonKey(r,o)]={wins:(old?.wins||0)+(won?1:0),losses:(old?.losses||0)+(won?0:1),streak:won?0:Math.min(5,(old?.streak||0)+1),last:g.turn,loss:cap(loss,0,1),result:won?'victory':'defeat'};
 if(!won&&s.plans[r])s.plans[r].review=Math.min(s.plans[r].review,g.turn+3);
}

export function localCampaignForces(g,army){
 return Object.values(g.armies).filter(a=>a.owner===army.owner&&!a.contingent&&a.province===army.province&&size(a)>0&&!embarked(g,a.id)&&!invasionReserved(g,a.id)).sort((a,b)=>a.id.localeCompare(b.id));
}

export function localCampaignPower(g,army){
 return localCampaignForces(g,army).reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0);
}

export function militaryStrength(g,realm){
 return Object.values(g.armies).filter(a=>a.owner===realm&&!a.contingent&&!embarked(g,a.id)).reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0);
}

export function borderRealms(g,world,realm){
 const set=new Set();
 for(const p of world.provinces){
  if(controller(g,p.id)!==realm)continue;
  for(const id of p.neighbors||[]){
   const other=controller(g,id);
   if(other&&other!==realm&&other!=='independent'&&g.factions[other])set.add(other);
  }
 }
 return [...set];
}

export function defensivePartners(g,realm,aggressor){
 return Object.values(g.strategy?.pacts||{}).filter(p=>p.target===aggressor&&p.expires>g.turn&&p.members.includes(realm)).flatMap(p=>p.members.filter(id=>id!==realm&&id!==aggressor)).filter((id,i,a)=>a.indexOf(id)===i&&g.factions[id]&&!war(g,id,realm)&&land(g,id).length>0);
}

export function threatAssessment(g,world,realm,other){
 const mine=militaryStrength(g,realm),theirs=militaryStrength(g,other),hostility=Math.max(0,-relation(g,realm,other)),t=temperament(g,other),active=war(g,realm,other),occupied=Object.values(g.campaignWar?.occupations||{}).filter(o=>o.by===other&&o.owner===realm).length;
 const infamy=diplomaticThreat(g,other)*.4;
 return Math.round(cap(12+theirs/Math.max(80,mine)*18+hostility*.36+t.aggression*.20+infamy+(active?28:0)+occupied*12-(alliance(g,realm,other)?50:0)-(truce(g,realm,other)||nonAggression(g,realm,other)?35:0),0,100));
}

export function defenseSupport(g,defender,aggressor){
 const allies=defensivePartners(g,defender,aggressor);
 return allies.reduce((n,id)=>n+Math.min(65,Math.round(militaryStrength(g,id)*.15)),0)+diplomaticSupport(g,defender,aggressor)+aidStrength(g,defender,aggressor);
}

export function evaluateWarViability(g,world,attacker,defender){
 const prof=personalityProfile(g,attacker);
 const f=g.factions?.[attacker];
 if(!f||!g.factions[defender]||attacker===defender)return {viable:false,ratio:0,reason:'Invalid target'};
 if(alliance(g,attacker,defender)||nonAggression(g,attacker,defender)||truce(g,attacker,defender)||hasHostageBar(g,attacker,defender)){
  return {viable:false,ratio:0,reason:'Treaty, truce, or hostage bars war'};
 }
 const alreadyAtWar=Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(attacker)&&![w.attacker,w.defender].includes(defender));
 if(alreadyAtWar)return {viable:false,ratio:0,reason:'Already committed to another war'};
 const minReserve=prof.id==='cautious'?200:100;
 if((f.treasury??500)<minReserve||(f.food??50)<0||(f.stability??60)<30){
  return {viable:false,ratio:0,reason:'Insufficient reserves or domestic instability'};
 }
 const ownPower=militaryStrength(g,attacker)+aidStrength(g,attacker,defender);
 const coal=coalitionAgainst(g,attacker);
 const coalitionMembers=coal?.members||[];
 const coalitionPower=coalitionMembers.includes(defender)
  ?coalitionMembers.reduce((n,id)=>n+militaryStrength(g,id)*.45,0)
  :(diplomaticThreat(g,attacker)>=40&&coalitionMembers.length?coalitionMembers.reduce((n,id)=>n+militaryStrength(g,id)*.20,0):0);
 const defPower=militaryStrength(g,defender)+defenseSupport(g,defender,attacker)+coalitionPower;
 const ratio=ownPower/Math.max(1,defPower);
 const losses=battleLesson(g,attacker,defender)?.streak||0;
 const minRatio=prof.expansionThreshold+losses*0.18;
 const viable=ownPower>=40&&ratio>=minRatio;
 return {viable,ratio,ownPower,defPower,minRatio,reason:viable?'':'Insufficient force advantage'};
}

export function strategicTargetScore(g,world,army,p,combinedPower=null){
 const realm=army.owner,other=controller(g,p.id),t=temperament(g,realm),w=war(g,realm,other);
 const claim=Object.values(g.conflict?.claims||{}).some(c=>c.realm===realm&&c.province===p.id&&c.expires>g.turn);
 const defense=campaignGarrison(p)+Object.values(g.armies).filter(a=>a.owner===other&&!a.contingent&&a.province===p.id&&!embarked(g,a.id)).concat(fieldContingentsAt(g,other,p.id,realm)).reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0)+defenseSupport(g,other,realm);
 const ratio=((combinedPower??campaignArmyPower(army,armyReadiness(g,army)))+aidStrength(g,realm,other)+fieldContingentsAt(g,realm,army.province,other).reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0))/Math.max(1,defense);
 const faithBonus=(t.profile==='zealous'&&realmFaith(g,realm)&&realmFaith(g,other)&&realmFaith(g,realm)!==realmFaith(g,other))?18:0;
 return Math.round((ratio-1)*70+p.development*2+(w?24:0)+(w?.goal===p.id?55:0)+(claim?22:0)+(p.owner===realm?65:0)+faithBonus-relation(g,realm,other)*.30+(t.aggression-50)*.7-(t.prudence-50)*.35-(g.strategy?.plans[realm]?.goal==='recover'?20:0)-(battleLesson(g,realm,other)?.streak||0)*12);
}

export function raidThreshold(g,realm,defender){
 const t=temperament(g,realm),w=war(g,realm,defender),prof=PERSONALITY_PROFILES[t.profile];
 return cap(.48+(t.prudence-50)*.006-(t.aggression-50)*.005-(prof?.raidBias||0)-(w?.attacker===realm?0.10:0)+(battleLesson(g,realm,defender)?.streak||0)*.06,.18,.88);
}

// Rank active wars by actual danger, occupation and strategic pressure, not declaration date.
const warSignature=(g,r)=>Object.values(g.conflict?.wars||{}).filter(w=>w.status==='active'&&[w.attacker,w.defender].includes(r)).map(w=>w.id+':'+w.goal+':'+controller(g,w.goal)).sort().join('|');

export function strategicFronts(g,world,r){
 return Object.values(g.conflict?.wars||{}).filter(w=>w.status==='active'&&[w.attacker,w.defender].includes(r)).map(w=>{
  const defending=w.defender===r,other=defending?w.attacker:w.defender,control=controller(g,w.goal),occupied=defending&&control===other;
  const score=Number.isFinite(w.score)?(defending?-w.score:w.score):0,threat=threatAssessment(g,world,r,other);
  const priority=Math.round((defending?50:15)+(occupied?40:0)+Math.max(0,-score)*.35+threat*.4+(control===other?10:0));
  return {war:w.id,target:other,goal:defending?'defend':'conquer',objective:w.goal,occupied,priority,started:w.started||0};
 }).sort((a,b)=>b.priority-a.priority||a.started-b.started||a.war.localeCompare(b.war));
}

export function coreProvinces(g,world,realm){
 const owned=land(g,realm);
 if(!owned.length)return [];
 const capCoords=world?.factions?.find(f=>f.id===realm)?.capital;
 const byDist=owned.slice().sort((a,b)=>{
  const pa=world?.provinces?.find(x=>x.id===a.id),pb=world?.provinces?.find(x=>x.id===b.id);
  const da=capCoords&&pa?.centroid?Math.hypot(pa.centroid[0]-capCoords[0],pa.centroid[1]-capCoords[1]):999;
  const db=capCoords&&pb?.centroid?Math.hypot(pb.centroid[0]-capCoords[0],pb.centroid[1]-capCoords[1]):999;
  return da-db||b.development-a.development||a.id.localeCompare(b.id);
 });
 return byDist.slice(0,Math.min(3,byDist.length)).map(p=>p.id);
}

function threatenedCoreProvinces(g,world,realm){
 const cores=new Set(coreProvinces(g,world,realm));
 const threatened=[];
 for(const wp of world?.provinces||[]){
  if(!cores.has(wp.id))continue;
  const p=g.provinces[wp.id];
  if(!p||p.owner!==realm)continue;
  if(controller(g,wp.id)!==realm){threatened.push(wp.id);continue;}
  const hostileNeighbor=wp.neighbors?.some(nid=>{
   const other=controller(g,nid);
   return other&&other!==realm&&other!=='independent'&&(war(g,realm,other)||threatAssessment(g,world,realm,other)>=70);
  });
  if(hostileNeighbor)threatened.push(wp.id);
 }
 return threatened;
}

function objectiveBudget(f){
 return Math.max(0,Math.min(450,Math.floor(Math.max(0,f.treasury)*0.35)));
}

function shouldAbandonObjective(g,world,realm,old,fronts){
 const obj=old?.objective;
 if(!obj||obj.status!=='active')return null;
 const f=g.factions[realm];
 if(g.turn>=obj.deadline)return 'deadline expired';
 if(old.ruler!==ruler(g,realm)?.id)return 'succession';
 if(f.food<0||f.treasury<90||f.stability<30)return 'realm crisis';
 if(fronts.length&&fronts[0].goal==='defend'&&['conquer','prosper','diplomacy'].includes(old.goal))return 'defensive emergency';
 if(obj.targetRealm&&['conquer','tribute'].includes(obj.kind)){
  if(!land(g,obj.targetRealm).length)return 'target collapsed';
  if(alliance(g,realm,obj.targetRealm)||nonAggression(g,realm,obj.targetRealm)||truce(g,realm,obj.targetRealm)||hasHostageBar(g,realm,obj.targetRealm))return 'diplomatic bar';
  const v=evaluateWarViability(g,world,realm,obj.targetRealm);
  if(!v.viable&&v.ratio<0.55)return 'suicidal threat';
  if((battleLesson(g,realm,obj.targetRealm)?.streak||0)>=2)return 'repeated defeats';
 }
 return null;
}

export function choosePlan(g,world,realm,old=null){
 const f=g.factions[realm],t=temperament(g,realm),prof=PERSONALITY_PROFILES[t.profile];
 const borders=borderRealms(g,world,realm);
 const rank=borders.map(id=>({id,threat:threatAssessment(g,world,realm,id)})).sort((a,b)=>b.threat-a.threat||a.id.localeCompare(b.id));
 const top=rank[0],fronts=strategicFronts(g,world,realm);
 const owned=land(g,realm);
 const unrest=owned.reduce((n,p)=>n+p.unrest,0)/Math.max(1,owned.length);
 const coalTarget=borders.find(id=>diplomaticThreat(g,id)>=35||coalitionAgainst(g,id));

 // Check if an existing persistent objective is still valid and not abandoned.
 if(old&&old.objective?.status==='active'){
  const abandonReason=shouldAbandonObjective(g,world,realm,old,fronts);
  if(abandonReason){
   old.objective.status='abandoned';
   old.objective.reason=abandonReason;
   old.objective.ended=g.turn;
   g.strategy.abandoned??=[];
   g.strategy.abandoned.unshift({realm,kind:old.objective.kind,target:old.target,reason:abandonReason,turn:g.turn});
   g.strategy.abandoned=g.strategy.abandoned.slice(0,100);
   note(g,realm,`${f.name} abandoned ${old.objective.kind} objective (${abandonReason}).`);
  }else if(old.warSignature===warSignature(g,realm)&&g.turn<old.review){
   return {...old,fronts,threats:rank.slice(0,5),personality:t.name,profile:t.profile,review:g.turn+6};
  }
 }

 let goal='prosper',target=null,objKind='prosper_realm',cbHint=null;
 if(fronts.length){
  goal=fronts[0].goal;target=fronts[0].target;
  objKind=goal==='defend'?'defend_core':'prosecute_war';
 }else if(f.food<0||f.treasury<150||f.stability<35||unrest>65){
  goal='recover';objKind='stabilize_realm';
 }else if(top?.threat>=(t.profile==='cautious'?60:72)||coalTarget){
  goal='defend';target=coalTarget||top?.id||null;objKind=coalTarget?'coalition_response':'fortify_frontier';
 }else if((t.aggression>=57||['ambitious','martial','cruel','zealous'].includes(t.profile))&&f.treasury>(t.profile==='cautious'?600:400)){
  const candidates=borders.filter(id=>{
   if(alliance(g,realm,id)||nonAggression(g,realm,id)||truce(g,realm,id)||hasHostageBar(g,realm,id))return false;
   if(t.profile==='just'&&!availableCasusBelli(g,world,realm,id).some(c=>['county_claim','duchy_claim','kingdom_claim','dejure_claim','liberation'].includes(c.cb)))return false;
   if(relation(g,realm,id)>=35&&t.profile!=='cruel')return false;
   return evaluateWarViability(g,world,realm,id).viable;
  }).sort((a,b)=>{
   const fa=(t.profile==='zealous'&&realmFaith(g,realm)&&realmFaith(g,a)&&realmFaith(g,realm)!==realmFaith(g,a))?-200:0;
   const fb=(t.profile==='zealous'&&realmFaith(g,realm)&&realmFaith(g,b)&&realmFaith(g,realm)!==realmFaith(g,b))?-200:0;
   return (militaryStrength(g,a)+fa+(battleLesson(g,realm,a)?.streak||0)*150)-(militaryStrength(g,b)+fb+(battleLesson(g,realm,b)?.streak||0)*150)||a.localeCompare(b);
  });
  if(candidates.length){
   goal='conquer';target=candidates[0];
   const cbs=availableCasusBelli(g,world,realm,target);
   cbHint=cbs[0]?.cb||null;
   objKind=t.profile==='zealous'&&cbs.some(c=>c.cb==='religious_war')?'religious_campaign':'conquer_target';
  }
 }else if(t.diplomacy>=58||['diplomatic','just'].includes(t.profile)){
  goal='diplomacy';target=top?.id||borders[0]||null;objKind='build_alliances';
 }else if(t.profile==='greedy'&&borders.length){
  goal='prosper';target=borders[0];objKind='commercial_hegemony';
 }

 const objective={
  id:`obj_${realm}_${g.turn}`,
  kind:objKind,
  goal,
  targetRealm:target,
  cb:cbHint,
  budget:objectiveBudget(f),
  spent:0,
  started:g.turn,
  deadline:g.turn+(goal==='recover'?18:goal==='defend'?24:30),
  status:'active',
  coreProvinces:coreProvinces(g,world,realm)
 };

 return {
  goal,target,fronts,warSignature:warSignature(g,realm),
  threats:rank.slice(0,5),personality:t.name,profile:t.profile,
  taxPreference:prof.taxPreference,levyPreference:prof.levyPreference,
  ruler:ruler(g,realm)?.id,review:g.turn+6,since:g.turn,objective
 };
}

export function strategicPlan(g,realm){return g.strategy?.plans[realm]||null;}

export function strategyAction(g,world,action,id,extra){
 initStrategy(g,world);
 const realm=g.player,f=g.factions[realm],o=g.factions[id];
 if(action==='pact'){
  const target=extra;
  if(!o||id===realm||!g.factions[target]||target===realm||target===id||!land(g,id).length||war(g,realm,id)||war(g,id,target)||relation(g,id,realm)<10||threatAssessment(g,world,id,target)<45||f.treasury<100)
   return {ok:false,msg:'Need friendly partner relations (+10), a shared threat, peace between partners and 100 gold.'};
  const key=pair(realm,id)+'|'+target;
  if(g.strategy.pacts[key]?.expires>g.turn)return {ok:false,msg:'Defensive pact already active.'};
  f.treasury-=100;
  g.strategy.pacts[key]={id:key,target,members:[realm,id],expires:g.turn+60};
  note(g,realm,'Defensive pact signed with '+o.name+' against '+g.factions[target].name+'.');
  return {ok:true,msg:'Five-year defensive pact established.'};
 }
 if(action==='leave'){
  const p=g.strategy.pacts[id];
  if(!p?.members.includes(realm))return {ok:false,msg:'No such pact.'};
  delete g.strategy.pacts[id];
  return {ok:true,msg:'Defensive pact dissolved.'};
 }
 return {ok:false,msg:'Unknown strategy order.'};
}

// Reserve a distinct force for each reachable active front before reinforcing the principal front.
function positionMultipleFronts(g,world,realm,armies,fronts){
 const assigned=new Set(),escorted=new Set(),occupied=new Map();
 const move=(a,front)=>{
  const borders=world.provinces.filter(p=>controller(g,p.id)===realm&&p.neighbors.some(id=>controller(g,id)===front.target));
  if(!borders.length)return false;
  const used=occupied.get(front.target)||new Set();
  const ranked=borders.map(p=>({id:p.id,score:Math.max(...p.neighbors.filter(id=>controller(g,id)===front.target).map(id=>strategicTargetScore(g,world,a,g.provinces[id])))+(p.neighbors.includes(front.objective)?50:0)-(front.goal==='defend'&&used.has(p.id)?100:0)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  let route=null;for(const dest of ranked){route=nearestOwnedRoute(world,a.province,[dest.id],id=>controller(g,id)===realm);if(route)break;}
  if(!route)return false;assigned.add(a.id);used.add(route.at(-1));occupied.set(front.target,used);
  if(route.length>1){const origin=a.province;for(const unit of [a,...fieldContingentsAt(g,realm,origin,front.target).filter(u=>!escorted.has(u.id))]){escorted.add(unit.id);onArmyMarch(g,unit);unit.province=route[1];}}
  return true;
 };
 for(const front of fronts){for(const a of armies){if(!assigned.has(a.id)&&move(a,front))break;}}
 for(const a of armies.filter(x=>!assigned.has(x.id)).slice(0,3))for(const front of fronts)if(move(a,front))break;
}

function positionArmy(g,world,realm,plan){
 const armies=Object.values(g.armies).filter(a=>a.owner===realm&&!a.contingent&&!embarked(g,a.id)&&size(a)>45&&!invasionReserved(g,a.id)&&controller(g,a.province)===realm).sort((a,b)=>size(b)-size(a)||a.id.localeCompare(b.id));
 if(!armies.length)return;
 // Core-province protection: hold/move a reserve army to a threatened core province when needed.
 const threatenedCores=threatenedCoreProvinces(g,world,realm);
 let deployable=armies;
 if(threatenedCores.length&&armies.length>1){
  const prof=PERSONALITY_PROFILES[plan.profile]||PERSONALITY_PROFILES.cautious;
  const reserveCount=Math.max(1,Math.min(armies.length-1,Math.floor(armies.length*prof.defenseReserve)));
  const guards=armies.slice(armies.length-reserveCount);
  const guardIds=new Set(guards.map(a=>a.id));
  deployable=armies.filter(a=>!guardIds.has(a.id));
  for(const ga of guards){
   if(threatenedCores.includes(ga.province))continue;
   const route=nearestOwnedRoute(world,ga.province,threatenedCores,id=>controller(g,id)===realm);
   if(route&&route.length>1){onArmyMarch(g,ga);ga.province=route[1];}
  }
 }
 if(!plan.target||!['defend','conquer'].includes(plan.goal))return;
 const fronts=(plan.fronts||[]).filter(x=>war(g,realm,x.target));
 if(fronts.length>1){positionMultipleFronts(g,world,realm,deployable,fronts);return;}
 const borders=world.provinces.filter(p=>controller(g,p.id)===realm&&p.neighbors.some(id=>controller(g,id)===plan.target));
 if(!borders.length)return;
 const principal=deployable[0],objective=war(g,realm,plan.target)?.goal;
 const ranked=borders.map(p=>({id:p.id,score:Math.max(...p.neighbors.filter(id=>controller(g,id)===plan.target).map(id=>strategicTargetScore(g,world,principal,g.provinces[id])))+(p.neighbors.includes(objective)?50:0)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const occupied=new Set(),escorted=new Set(),max=plan.goal==='conquer'?Math.min(deployable.length,3):Math.min(deployable.length,Math.max(1,borders.length));
 for(const a of deployable.slice(0,max)){
  const destinations=plan.goal==='conquer'?ranked.map(x=>x.id):[...ranked.filter(x=>!occupied.has(x.id)).map(x=>x.id),...ranked.filter(x=>occupied.has(x.id)).map(x=>x.id)];
  let route=null;for(const dest of destinations){route=nearestOwnedRoute(world,a.province,[dest],id=>controller(g,id)===realm);if(route)break;}
  if(route){occupied.add(route.at(-1));if(route.length>1){for(const unit of [a,...fieldContingentsAt(g,realm,a.province,plan.target).filter(unit=>!escorted.has(unit.id))]){escorted.add(unit.id);onArmyMarch(g,unit);unit.province=route[1];}}}
 }
}

function applyAiPersonalityDecisions(g,world,realm,plan){
 const f=g.factions[realm],prof=PERSONALITY_PROFILES[plan.profile]||PERSONALITY_PROFILES.cautious;
 const obj=plan.objective;
 const canSpend=cost=>f.treasury>=cost+120&&(!obj||obj.spent+cost<=obj.budget+150);
 const spend=cost=>{f.treasury-=cost;if(obj)obj.spent+=cost;};

 // 1. Taxation and levy decrees aligned with personality (respecting same 80g cost as player).
 if(g.turn%12===0&&(plan.lastPolicyTurn??-100)<=g.turn-24&&f.treasury>=180){
  const desiredTax=plan.goal==='recover'?0:(plan.goal==='conquer'&&prof.id==='ambitious')?2:prof.taxPreference;
  if(f.policies.tax!==desiredTax&&!(desiredTax===2&&f.stability<45)){
   f.treasury-=80;f.policies.tax=desiredTax;
   f.stability=cap(f.stability+(desiredTax===2?-8:3),0,100);
   plan.lastPolicyTurn=g.turn;
  }else if(f.policies.levy!==prof.levyPreference&&!(prof.levyPreference===2&&f.stability<45)){
   f.treasury-=80;f.policies.levy=prof.levyPreference;
   f.stability=cap(f.stability+(prof.levyPreference===2?-6:2),0,100);
   plan.lastPolicyTurn=g.turn;
  }
 }

 // 2. Recovery loyalty spending.
 if(g.turn%6===0&&plan.goal==='recover'&&canSpend(100)){
  const v=Object.entries(g.politics.holdings).filter(([id,h])=>h.realm===realm&&controller(g,id)===realm&&h.loyalty<35).sort((a,b)=>a[1].loyalty-b[1].loyalty)[0];
  if(v){spend(100);v[1].loyalty=cap(v[1].loyalty+15,0,100);}
 }

 // 3. Defensive pacts and reactive coalition alignment against high-threat realms.
 if(g.turn%6===0){
  const threats=borderRealms(g,world,realm).filter(id=>id!==realm&&!humanControlsRealm(g,id)&&!war(g,realm,id)&&!alliance(g,realm,id)&&!nonAggression(g,realm,id)&&(diplomaticThreat(g,id)>=30||(threatAssessment(g,world,realm,id)>=78&&militaryStrength(g,id)>=militaryStrength(g,realm)*1.4)));
  for(const target of threats)joinCoalition(g,realm,target);
 }
 if(g.turn%12===0&&plan.goal==='defend'&&plan.target&&canSpend(100)){
  const partner=borderRealms(g,world,realm).filter(id=>id!==plan.target&&!humanControlsRealm(g,id)&&relation(g,id,realm)>=0&&threatAssessment(g,world,id,plan.target)>=50&&!war(g,id,realm)&&!war(g,id,plan.target)).sort((a,b)=>militaryStrength(g,b)-militaryStrength(g,a))[0];
  if(partner){
   const key=pair(realm,partner)+'|'+plan.target;
   if(!g.strategy.pacts[key]){spend(100);g.strategy.pacts[key]={id:key,target:plan.target,members:[realm,partner],expires:g.turn+60};}
  }
  if(diplomaticThreat(g,plan.target)>=30&&!humanControlsRealm(g,plan.target)){
   joinCoalition(g,realm,plan.target);
  }
 }

 // 4. Diplomatic outreach for diplomatic/just/zealous rulers.
 if(g.turn%12===0&&plan.goal==='diplomacy'&&plan.target&&canSpend(80)&&!war(g,realm,plan.target)){
  const other=g.factions[plan.target];
  if(other){spend(80);other.treasury+=80;f.relations[plan.target]=cap(relation(g,realm,plan.target)+8,-100,100);other.relations[realm]=cap(relation(g,plan.target,realm)+8,-100,100);}
 }

 // 5. Greedy tribute demands on weaker neighbors.
 if(g.turn%12===0&&prof.id==='greedy'&&plan.target&&!war(g,realm,plan.target)&&!humanControlsRealm(g,plan.target)){
  if(evaluateWarViability(g,world,realm,plan.target).ratio>=1.8)demandTribute(g,realm,plan.target);
 }

 // 6. Controlled AI war declaration with reserve coverage, CB, and coalition deterrence check.
 if(g.turn%12===0&&plan.goal==='conquer'&&plan.target&&!humanControlsRealm(g,plan.target)&&!war(g,realm,plan.target)){
  const reserveFloor=prof.id==='cautious'?420:280;
  const activeOther=Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(realm));
  const coal=coalitionAgainst(g,realm);
  const deterredByCoalition=coal&&coal.members.length>=2&&diplomaticThreat(g,realm)>=45;
  if(!activeOther&&!deterredByCoalition&&f.treasury>=reserveFloor&&f.stability>=38&&f.food>=0){
   const v=evaluateWarViability(g,world,realm,plan.target);
   if(v.viable){
    const cbs=availableCasusBelli(g,world,realm,plan.target);
    const preferred=cbs.find(c=>tPreferredCb(prof.id,c.cb))||cbs[0];
    if(preferred&&(f.prestige||0)>=preferred.prestigeCost){
     declareCasusBelliWar(g,world,realm,plan.target,preferred.cb,preferred.target);
    }
   }
  }
 }
}

function tPreferredCb(profId,cb){
 if(profId==='zealous')return cb==='religious_war';
 if(profId==='greedy')return cb==='tribute_enforcement'||cb==='subjugation';
 if(profId==='just')return cb==='dejure_claim'||cb==='liberation'||cb==='county_claim';
 if(profId==='ambitious'||profId==='martial')return cb==='kingdom_claim'||cb==='duchy_claim'||cb==='county_claim';
 return false;
}

export function tickStrategy(g,world){
 const s=initStrategy(g,world);
 if(s.lastTick===g.turn)return;
 s.lastTick=g.turn;
 for(const [id,p] of Object.entries(s.pacts))if(p.expires<=g.turn||p.members.some(id=>!land(g,id))||war(g,...p.members))delete s.pacts[id];
 for(const [key,x] of Object.entries(s.lessons))if(g.turn-x.last>36)delete s.lessons[key];
 if(g.turn%3!==0)return;
 const ownedRealms=new Set(Object.values(g.provinces).map(p=>p.owner));
 for(const realm of Object.keys(g.politics?.realms||{})){
  if(!ownedRealms.has(realm))continue;
  const old=s.plans[realm];
  const fronts=strategicFronts(g,world,realm);
  const needsAbandon=old&&shouldAbandonObjective(g,world,realm,old,fronts);
  if(!old||old.review<=g.turn||old.ruler!==ruler(g,realm)?.id||(old.warSignature??'')!==warSignature(g,realm)||needsAbandon){
   const plan=choosePlan(g,world,realm,old);
   if(old&&old.goal===plan.goal&&old.target===plan.target&&!needsAbandon)plan.since=old.since;
   s.plans[realm]=plan;
  }
  const p=s.plans[realm];
  if(humanControlsRealm(g,realm))continue;
  positionArmy(g,world,realm,p);
  applyAiPersonalityDecisions(g,world,realm,p);
 }
}
