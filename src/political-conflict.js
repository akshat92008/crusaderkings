import {humanControlsRealm} from './player-career.js';
import {regencyPermission} from './regency-systems.js';
import {claimDynasticSeat,validDynasticClaim} from './dynastic-ties.js';
import {estatePower,authorityLevel,authorityAction,politicalEstates} from './realm-authority.js';
import {campaignArmyPower,borderBattleOutcome,proportionalLoss} from './border-battle.js';
import {armyReadiness,syncRegiments} from './military-systems.js';
import {embarked} from './naval-systems.js';
import {controller,settleOccupations,occupiedGoal} from './campaign-war.js';
import {nonAggression,aidStrength,diplomaticSupport,recallWarContingents} from './diplomacy-systems.js';
import {hookStrength} from './intrigue-systems.js';
import {independenceMembers,foundBreakaway} from './independence-systems.js';
import {claimantCandidates,installClaimant,isImprisoned,capturePrisoner} from './feudal-systems.js';
import {personalOpinion} from './chronicle-systems.js';
import {strategicPlan,militaryStrength,defenseSupport,evaluateWarViability} from './strategic-ai.js';
import {civicModifiers} from './civic-systems.js';
import {startingTroops,militaryDoctrine} from './military-doctrines.js';
import {hasActiveFavor,oweFavor,callInFavor} from './ck2-deep-systems.js';
export {oweFavor,callInFavor};

// Concurrent 8-type vassal/popular factions, council consent, schemes, claims, and map-level civil wars.
const cap=(x,a,b)=>Math.max(a,Math.min(b,x));
const size=a=>Math.max(0,(a.infantry||0)+(a.archers||0)+(a.cavalry||0));
const ok=(msg,extra={})=>({ok:true,msg,...extra}),no=(msg,extra={})=>({ok:false,msg,...extra});
function note(g,msg){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}

export const FACTION_TYPES=['claimant','independence','liberty','tax','religious','noble','council','popular'];
export const ACTIVE_FACTION_STATUSES=['organizing','ultimatum','civil war'];

function ensureFactionFields(g,x){
 if(!x)return x;
 x.members??=[];
 x.secretMembers??=[];
 x.discontent??=x.pressure??0;
 x.pressure??=x.discontent??0;
 x.memberLords??=[...new Set(x.members.map(id=>g.politics?.holdings?.[id]?.lord).filter(Boolean))];
 if(!x.leader){
  x.leader=x.kind==='popular'?'popular':(x.memberLords[0]||null);
 }
 return x;
}

export function initConflict(g){
 const c=g.conflict??={next:1,seed:987123,lastTick:-1,factions:{},schemes:{},claims:{},wars:{},truces:{},favors:{},council:{},history:[]};
 for(const x of Object.values(c.factions||{}))ensureFactionFields(g,x);
 return c;
}
function rng(c){c.seed=(Math.imul(c.seed,1664525)+1013904223)>>>0;return c.seed/4294967296;}
const holdings=(g,realm)=>Object.entries(g.politics.holdings).filter(([id,v])=>v.realm===realm&&g.provinces[id]?.owner===realm);
const army=(g,realm)=>Object.values(g.armies).filter(a=>a.owner===realm&&!a.contingent);
const pair=(a,b)=>[a,b].sort().join('|');
const councilKey=(realm,id)=>realm+':'+id;
function history(g,entry){const c=initConflict(g);c.history.unshift({turn:g.turn,...entry});c.history=c.history.slice(0,200);}

export function councilVotes(g,realm,proposal='law'){
 const c=initConflict(g),s=g.politics.realms[realm],f=g.factions[realm];if(!s||!f)return [];
 return Object.entries(s.council).filter(([,id])=>g.politics.people[id]?.alive&&!isImprisoned(g,id)).map(([role,id])=>{
  const person=g.politics.people[id],favor=(c.favors[councilKey(realm,id)]||0)>g.turn||Boolean(hasActiveFavor(g,s.ruler,id));
  const hook=hookStrength(g,realm,id),op=personalOpinion(g,s.ruler,id);
  const score=18+(f.legitimacy-50)*.7+(f.stability-50)*.3+(person.traits.includes('ambitious')?-20:0)+(person.traits.includes('content')?15:0)+(person.traits.includes('just')&&proposal==='revoke'?-28:0)+(person.traits.includes('cautious')&&proposal==='war'?-25:0)+(role==='marshal'&&proposal==='war'?22:0)+(favor?55:0)+op*.35+hook*18;
  const reasons=[];
  if(favor)reasons.push('Active favor secured (+55)');
  if(hook>0)reasons.push('Hook leverage (+'+Math.round(hook*18)+')');
  if(person.traits.includes('ambitious'))reasons.push('Ambitious (-20)');
  if(person.traits.includes('content'))reasons.push('Content (+15)');
  if(person.traits.includes('just')&&proposal==='revoke')reasons.push('Just opposes revocation (-28)');
  if(person.traits.includes('cautious')&&proposal==='war')reasons.push('Cautious opposes war (-25)');
  if(role==='marshal'&&proposal==='war')reasons.push('Marshal backs war (+22)');
  if(f.legitimacy<40)reasons.push('Low legitimacy ('+Math.round((f.legitimacy-50)*.7)+')');
  if(op<=-15)reasons.push('Hostile opinion ('+Math.round(op*.35)+')');
  return {role,id,name:person.name||id,yes:favor||score>=25,score:Math.round(score),favor,hook,reasons};
 });
}
export function councilVoteBreakdown(g,realm,proposal='law'){
 const c=initConflict(g),regencyAllowed=regencyPermission(g,realm,proposal);
 const binding=c.council[realm]==='binding';
 const votes=councilVotes(g,realm,proposal);
 const yesCount=votes.filter(x=>x.yes).length;
 const noCount=votes.length-yesCount;
 const needed=votes.length?Math.floor(votes.length/2)+1:0;
 const permitted=regencyAllowed&&(!binding||yesCount>votes.length/2);
 const blockingReasons=[];
 if(!regencyAllowed)blockingReasons.push('Regent withholds consent for '+proposal+'.');
 if(binding&&yesCount<needed){
  blockingReasons.push('Binding council blocked '+proposal+': '+yesCount+'/'+needed+' votes. Buy or call in a favor to win over a councillor.');
  for(const v of votes.filter(x=>!x.yes)){
   blockingReasons.push(v.name+' ('+v.role+', '+v.score+'): '+(v.reasons.join('; ')||'insufficient support'));
  }
 }
 return {permitted,binding,regencyAllowed,yesCount,noCount,needed,votes,blockingReasons};
}
export function councilPermission(g,realm,proposal){
 return councilVoteBreakdown(g,realm,proposal).permitted;
}
function power(g,ids){
 let total=0;
 const lords=new Set();
 for(const id of ids){
  total+=estatePower(g,id);
  const lord=g.politics?.holdings?.[id]?.lord;
  if(lord)lords.add(lord);
  const ret=g.estateConflicts?.retinues?.[id];
  if(ret?.troops)total+=ret.troops*.5;
 }
 return Math.round(total);
}
function claimKey(realm,id){return realm+':'+id;}
export function availableClaims(g,realm){const c=initConflict(g);return Object.values(c.claims).filter(x=>x.realm===realm&&g.provinces[x.province]&&g.provinces[x.province].owner!==realm&&x.expires>g.turn&&validDynasticClaim(g,x));}
export function activeWar(g,a,b){return Object.values(initConflict(g).wars).find(w=>w.status==='active'&&pair(w.attacker,w.defender)===pair(a,b));}
export function hasTruce(g,a,b){
 // Rebel coalition factions are isolated to fighting only their parent realm.
 const fa=g.factions?.[a],fb=g.factions?.[b];
 if(fa?.rebel&&fa.origin!==b)return true;
 if(fb?.rebel&&fb.origin!==a)return true;
 return (initConflict(g).truces[pair(a,b)]||0)>g.turn;
}

export function endWar(g,w,result){
 settleOccupations(g,w,result);
 w.status=result;w.ended=g.turn;
 recallWarContingents(g,w.id);
 initConflict(g).truces[pair(w.attacker,w.defender)]=g.turn+36;
 if(g.kingdom){
  const between=t=>(t.by===w.attacker&&(g.player===w.defender||g.provinces?.[t.province]?.owner===w.defender))||(t.by===w.defender&&(g.player===w.attacker||g.provinces?.[t.province]?.owner===w.attacker));
  if(Array.isArray(g.kingdom.threats))g.kingdom.threats=g.kingdom.threats.filter(t=>!between(t));
  g.kingdom.nextInvasionTurn=Math.max(g.kingdom.nextInvasionTurn||0,g.turn+6);
 }
 history(g,{kind:'war',realm:w.attacker,message:w.attacker+' vs '+w.defender+': '+result});
 if([w.attacker,w.defender].includes(g.player))note(g,'Peace signed: '+result+'. A three-year truce follows.');
}

export function warExhaustion(g,realm,w=null){
 const f=g.factions?.[realm];
 if(!f)return 0;
 const myArmies=Object.values(g.armies||{}).filter(a=>a.owner===realm&&!a.contingent);
 const avgFatigue=myArmies.length?myArmies.reduce((n,a)=>n+(g.military?.armies?.[a.id]?.fatigue||0),0)/myArmies.length:40;
 const owned=Object.values(g.provinces||{}).filter(p=>p.owner===realm);
 const occupiedShare=owned.length?owned.filter(p=>controller(g,p.id)!==realm).length/owned.length:0;
 const duration=w?Math.max(0,(g.turn||0)-(w.started||0)):0;
 return cap(Math.round(avgFatigue*.45+occupiedShare*45+(f.treasury<60?18:0)+(f.stability<35?16:0)+(f.food<0?15:0)+Math.min(25,duration*.6)),0,100);
}

export function aiPeaceAcceptance(g,w,realm){
 if(!w||w.status!=='active'||![w.attacker,w.defender].includes(realm))return {accept:false,result:null,exhaustion:0,reason:'Inactive war'};
 const attacking=w.attacker===realm,score=attacking?w.score:-w.score,duration=Math.max(0,(g.turn||0)-(w.started||0));
 const exh=warExhaustion(g,realm,w),hasGoal=occupiedGoal(g,w);
 if(score<=-45)return {accept:true,result:attacking?'attacker defeated':(hasGoal?'claim enforced':'white peace'),exhaustion:exh,reason:'Defeated in the field'};
 if(duration>=24&&exh>=50)return {accept:true,result:score<=-25?(attacking?'attacker defeated':(hasGoal?'claim enforced':'white peace')):'white peace',exhaustion:exh,reason:'Prolonged war exhaustion'};
 if(duration>=36)return {accept:true,result:'white peace',exhaustion:exh,reason:'Protracted stalemate'};
 return {accept:false,result:null,exhaustion:exh,reason:'Ongoing hostilities'};
}

export function peaceTerms(g,war,realm){
 if(war?.status!=='active'||![war.attacker,war.defender].includes(realm))return [];
 const attacking=war.attacker===realm,opponent=attacking?war.defender:war.attacker;
 const score=attacking?war.score:-war.score,hasGoal=occupiedGoal(g,war);
 const amount=Math.min(300,Math.max(0,g.factions[opponent].treasury));
 const surrender=attacking?'attacker defeated':hasGoal?'claim enforced':'white peace';
 const terms=[
  {id:'reparations',label:'Demand reparations',result:'reparations',amount,reason:score<65?'Requires at least +65 war score.':'',description:'Receive '+amount+' gold and return occupied land.'},
  {id:'surrender',label:'Surrender',result:surrender,reason:'',description:surrender==='claim enforced'?'Cede the disputed district to the attacker.':'End the war and return occupied land.'},
  {id:'white',label:'Offer white peace',result:'white peace',reason:Math.abs(score)>35||g.turn-war.started<6?'Requires six months of war and a score between −35 and +35.':'',description:'Return occupied land and end the war.'},
 ];
 if(attacking)terms.push({id:'enforce',label:'Enforce claim',result:'claim enforced',reason:score<65||!hasGoal?'Requires at least +65 war score and control of the war goal.':'',description:'Annex the disputed district and return other occupations.'});
 return terms;
}

export function recordCampaignBattle(g,attacker,defender,province,victory){
 const w=activeWar(g,attacker,defender);
 if(!w)return;
 const sign=attacker===w.attacker?1:-1;
 w.score=cap(w.score+sign*(victory?30:-18),-100,100);
 if(victory&&province===w.goal&&attacker===w.attacker)w.score=Math.max(65,w.score);
 w.battles++;
 if(w.civilWar){
  const fx=g.conflict?.factions?.[w.factionId];
  if(fx&&fx.status==='civil war'){
   fx.score=cap(-w.score,-100,100);
  }
  return;
 }
 if(w.score<=-100)endWar(g,w,'attacker defeated');
}

function declare(g,realm,id){
 const c=initConflict(g),claim=c.claims[claimKey(realm,id)],pr=g.provinces[id],f=g.factions[realm],other=pr?.owner;
 if(!claim||claim.expires<=g.turn||!validDynasticClaim(g,claim)||!pr||other===realm||!g.politics.realms[other])return no('A valid foreign territorial claim is required.');
 if(['alliance','marriage'].includes(f.treaties[other])||nonAggression(g,realm,other)||hasTruce(g,realm,other)||activeWar(g,realm,other))return no('Alliance, truce or existing war prevents declaration.');
 if(!councilPermission(g,realm,'war'))return no('The council or regent rejected this war.');
 if(f.prestige<5)return no('Need 5 prestige.');
 f.prestige-=5;
 const key='w'+c.next++;
 c.wars[key]={id:key,attacker:realm,defender:other,goal:id,score:0,battles:0,started:g.turn,status:'active'};
 if(realm===g.player||other===g.player)note(g,g.factions[realm].name+' declared a claim war on '+g.factions[other].name+' for '+id+'.');
 return ok('Claim war declared. Capture the contested province and negotiate peace.');
}

const SCHEMES={fabricate:{cost:110,duration:9},sway:{cost:60,duration:6},investigate:{cost:80,duration:6},undermine:{cost:100,duration:9}};
function startScheme(g,realm,kind,target){
 const c=initConflict(g),rule=SCHEMES[kind],f=g.factions[realm],s=g.politics.realms[realm],v=g.politics.holdings[target],pr=g.provinces[target];
 if(!rule||!s||!pr)return no('Select a valid scheme target.');
 if(Object.values(c.schemes).some(x=>x.realm===realm&&x.status==='active'))return no('One active scheme is permitted per realm.');
 if(kind==='fabricate'||kind==='undermine'){
  if(pr.owner===realm||!g.politics.realms[pr.owner])return no('Select a foreign holding.');
  if(kind==='fabricate'&&availableClaims(g,realm).some(x=>x.province===target))return no('Claim already exists.');
 }else if(!v||v.realm!==realm||pr.owner!==realm)return no('Select a holding in your own realm.');
 if(f.treasury<rule.cost)return no('Insufficient treasury for scheme.');
 const role=kind==='fabricate'?'chancellor':'spymaster',agent=g.politics.people[s.council[role]],r=g.politics.people[s.ruler],skill=kind==='fabricate'?'diplomacy':'intrigue';
 f.treasury-=rule.cost;
 const id='s'+c.next++;
 c.schemes[id]={id,realm,kind,target,targetOwner:pr.owner,targetLord:v?.lord,agent:agent?.id,start:g.turn,due:g.turn+rule.duration,chance:cap(25+(agent?.skills[skill]||1)*9+(r.skills[skill]||1)*5+civicModifiers(g,realm).scheme,30,90),status:'active'};
 return ok('Scheme launched. Outcome in '+rule.duration+' months.');
}
function finishScheme(g,s){
 const c=initConflict(g),pr=g.provinces[s.target],v=g.politics.holdings[s.target];
 let success=pr?.owner===s.targetOwner&&(!['sway','investigate'].includes(s.kind)||v?.lord===s.targetLord)&&g.politics.people[s.agent]?.alive&&rng(c)*100<s.chance;
 s.status=success?'succeeded':'failed';s.ended=g.turn;
 if(success){
  if(s.kind==='fabricate')c.claims[claimKey(s.realm,s.target)]={realm:s.realm,province:s.target,source:'chancery',expires:g.turn+120};
  if(s.kind==='sway')v.loyalty=cap(v.loyalty+24,0,100);
  if(s.kind==='investigate'){v.loyalty=cap(v.loyalty+12,0,100);v.leverageUntil=g.turn+36;g.politics.people[v.lord].memories.push('Court investigation settled an estate dispute.');}
  if(s.kind==='undermine'){g.factions[pr.owner].legitimacy=cap(g.factions[pr.owner].legitimacy-7,0,100);pr.unrest=cap(pr.unrest+12,0,100);}
 }else if(['fabricate','undermine'].includes(s.kind)&&g.factions[s.targetOwner]){
  const o=g.factions[s.targetOwner];o.relations[s.realm]=cap((o.relations[s.realm]||0)-12,-100,100);
 }
 history(g,{realm:s.realm,kind:'scheme',message:s.kind+' at '+s.target+': '+s.status});
 if(s.realm===g.player)note(g,'Scheme '+s.kind+' at '+s.target+' '+s.status+'.');
}

function cleanupCivilWarEntities(g,x){
 const c=initConflict(g);
 if(x.warId){
  for(const [pid,o] of Object.entries(g.campaignWar?.occupations||{})){
   if(o.war===x.warId)delete g.campaignWar.occupations[pid];
  }
  const w=c.wars[x.warId];
  if(w&&w.status==='active'){w.status=x.status||'settled';w.ended=g.turn;}
 }
 if(x.rebelFaction){
  for(const [aid,a] of Object.entries(g.armies||{})){
   if(a.owner===x.rebelFaction)delete g.armies[aid];
  }
  delete g.factions[x.rebelFaction];
 }
}

function settleFaction(g,x,result,world){
 const c=initConflict(g),f=g.factions[x.realm],p=g.politics;
 x.status=result;x.ended=g.turn;x.settledTurn=g.turn;
 if(x.kind==='independence'&&['concessions','rebel victory'].includes(result)){
  if(!foundBreakaway(g,world,x)){x.kind='liberty';}
 }
 cleanupCivilWarEntities(g,x);

 if(x.kind==='claimant'&&['concessions','rebel victory'].includes(result))installClaimant(g,x.realm,x.claimant);
 if(x.kind==='claimant'&&result==='royal victory'&&x.claimant)capturePrisoner(g,x.realm,x.claimant,'failed claimant revolt');

 if(['concessions','rebel victory'].includes(result)){
  if(x.kind==='liberty'){
   const lvl=authorityLevel(g,x.realm);
   if(lvl>0)authorityAction(g,x.realm,lvl-1,true);
  }
  if(x.kind==='council')c.council[x.realm]='binding';
  if(x.kind==='religious'&&g.civic?.realms?.[x.realm])g.civic.realms[x.realm].policy='pluralism';
  if(x.kind==='popular'){
   if(f.policies)f.policies.tax=0;
   f.treasury=Math.max(0,f.treasury-Math.min(100,Math.max(0,f.treasury)));
  }
  if(x.kind==='noble'){
   const s=p.realms[x.realm],est=politicalEstates(g,x.realm);
   const lords=[...new Set(x.members.map(id=>p.holdings[id]?.lord).filter(id=>id&&id!==s?.ruler&&!Object.values(s.council).includes(id)))];
   for(const lid of lords.slice(0,2)){
    const slot=Object.entries(s.council).find(([,cid])=>!est.byLord[cid]?.powerful)?.[0];
    if(slot)s.council[slot]=lid;
   }
  }
 }

 const rebelLords=new Set();
 for(const id of x.members){
  const v=p.holdings[id];
  if(!v||v.realm!==x.realm||g.provinces[id]?.owner!==x.realm)continue;
  if(v.lord&&v.lord!==p.realms[x.realm]?.ruler)rebelLords.add(v.lord);
  if(result==='concessions'||result==='rebel victory'){
   if(x.kind==='tax')v.tax=0;
   else if(x.kind==='levy')v.levy=0;
   else if(x.kind==='liberty'||x.kind==='noble')v.autonomy=2;
   v.loyalty=cap(v.loyalty+30,0,100);
   if(x.kind==='popular'||x.kind==='religious')g.provinces[id].unrest=cap(g.provinces[id].unrest-20,0,100);
  }
  if(result==='royal victory'){
   v.loyalty=cap(v.loyalty+20,0,100);
   v.wealth=Math.floor(v.wealth*.65);
   v.leverageUntil=g.turn+36;
  }
  g.provinces[id].unrest=cap(g.provinces[id].unrest-10,0,100);
 }
 if(result==='royal victory'){
  let imprisoned=0;
  for(const lid of rebelLords){
   const person=p.people[lid];
   if(person)person.traitorUntil=g.turn+60;
   if(imprisoned<2&&capturePrisoner(g,x.realm,lid,'civil war rebellion'))imprisoned++;
  }
  f.prestige+=10;
  f.stability=cap(f.stability+6,0,100);
 }
 if(result==='rebel victory'){f.legitimacy=cap(f.legitimacy-18,0,100);f.stability=cap(f.stability-12,0,100);}
 history(g,{realm:x.realm,kind:'faction',message:x.kind+' faction: '+result});
 if(x.realm===g.player)note(g,'The '+x.kind+' faction ended: '+result+'.');
}

function beginCivilWar(g,x,world=null){
 const c=initConflict(g),f=g.factions[x.realm];
 ensureFactionFields(g,x);
 // Reveal secret members on outbreak of civil war!
 for(const sm of x.secretMembers){
  if(sm.province&&!x.members.includes(sm.province))x.members.push(sm.province);
 }
 x.secretMembers=[];
 x.memberLords=[...new Set(x.members.map(id=>g.politics?.holdings?.[id]?.lord).filter(Boolean))];
 x.status='civil war';x.startedWar=g.turn;
 x.rebels=Math.max(40,power(g,x.members));
 x.score=0;x.months=0;

 // Spawn real map-level rebel coalition, active war, occupations, and field armies.
 if(f&&x.members.length){
  const rebelId='rebel-'+x.id,warId='w'+c.next++;
  const parentOwn=Object.keys(g.provinces).filter(id=>g.provinces[id]?.owner===x.realm);
  const warChest=Math.max(120,x.members.length*80);
  g.factions[rebelId]={
   id:rebelId,name:f.name+' Rebels',color:'#9b2c2c',government:f.government||'feudal',
   rebel:true,origin:x.realm,civilWar:x.id,
   treasury:warChest,food:250,stability:55,legitimacy:40,
   policies:{tax:1,levy:1,tolerance:1},relations:{[x.realm]:-100},treaties:{},tech:f.tech||1
  };
  const goalProv=x.members[0];
  c.wars[warId]={id:warId,attacker:rebelId,defender:x.realm,goal:goalProv,score:0,battles:0,started:g.turn,status:'active',civilWar:true,factionId:x.id};
  x.rebelFaction=rebelId;x.warId=warId;

  // Leave at least one crown-controlled province if all realm provinces are in x.members (when realm has >=2 provinces).
  const keepCrown=x.members.length>=parentOwn.length&&parentOwn.length>1?parentOwn.find(id=>g.politics.holdings[id]?.lord===g.politics.realms[x.realm]?.ruler)||parentOwn[0]:null;
  const occupiedProvs=x.members.filter(id=>id!==keepCrown&&g.provinces[id]?.owner===x.realm);
  if(g.campaignWar){
   g.campaignWar.occupations??={};
   for(const pid of occupiedProvs){
    if(!g.campaignWar.occupations[pid]){
     g.campaignWar.occupations[pid]={province:pid,by:rebelId,owner:x.realm,war:warId,from:goalProv,started:g.turn};
    }
   }
  }
  const spawnProvs=(occupiedProvs.length?occupiedProvs:x.members).slice(0,2);
  const totalTroops=Math.max(60,Math.min(600,Math.round(x.rebels*.75)));
  const perArmy=Math.max(30,Math.floor(totalTroops/spawnProvs.length));
  const leaderName=g.politics.people[x.leader]?.name||(x.kind+' Rebel Leader');
  for(const pid of spawnProvs){
   const aid='a'+g.nextId++;
   g.armies[aid]={id:aid,owner:rebelId,province:pid,...startingTroops(f,perArmy),experience:.12,morale:80,commander:leaderName,doctrine:militaryDoctrine(f).id,civilWar:x.id};
  }
 }
 noteIf(g,x.realm,'The '+x.kind+' faction raised rebel armies across '+x.members.length+' provinces against the crown.');
}
function noteIf(g,realm,msg){if(realm===g.player)note(g,msg);}

export function civilWarForces(g,x,world){
 const members=new Set(x.members.filter(id=>g.provinces[id]?.owner===x.realm));
 const theater=new Set(members);
 for(const p of world.provinces)if(members.has(p.id))for(const id of p.neighbors||[])if(controller(g,id)===x.realm&&g.provinces[id]?.owner===x.realm)theater.add(id);
 const forces=army(g,x.realm).filter(a=>size(a)>0&&theater.has(a.province)&&controller(g,a.province)===x.realm&&!embarked(g,a.id));
 return {forces,troops:forces.reduce((n,a)=>n+size(a),0),power:forces.reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0)};
}

function campaignRound(g,x,boost=0,world){
 const f=g.factions[x.realm],{forces,troops:strength,power:ready}=civilWarForces(g,x,world),c=initConflict(g);
 if(x.status!=='civil war'||x.lastRound===g.turn)return;
 x.lastRound=g.turn;
 // Combine remaining mobilized rebel field armies with regional rebel muster.
 const rebelArmies=x.rebelFaction?Object.values(g.armies).filter(a=>a.owner===x.rebelFaction&&size(a)>0):[];
 const mapPower=rebelArmies.reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0);
 const royal=ready*(1+Math.min(.25,boost/Math.max(1,ready))),rebel=Math.max(0,Math.max(x.rebels,mapPower));
 const outcome=borderBattleOutcome(royal,rebel,rng(c)),success=outcome.victory;
 x.score=cap(x.score+(success?25:-20),-100,100);x.months++;
 for(const a of forces){proportionalLoss(a,outcome.attackerLoss);syncRegiments(g,a);}
 if(royal>0){
  for(const ra of rebelArmies){proportionalLoss(ra,outcome.defenderLoss);syncRegiments(g,ra);}
 }
 x.rebels=Math.max(0,Math.round(x.rebels*(1-(royal>0?outcome.defenderLoss:0))));
 for(const id of x.members)if(g.provinces[id]?.owner===x.realm)g.provinces[id].unrest=cap(g.provinces[id].unrest+(success?-2:6),0,100);
 f.treasury-=Math.min(80,Math.max(0,strength*.04));
 if(x.warId&&c.wars[x.warId])c.wars[x.warId].score=cap(-x.score,-100,100);
 if(x.score>=75||(x.rebels<=10&&rebelArmies.every(a=>size(a)<=10)&&x.months>=2))settleFaction(g,x,'royal victory',world);
 else if(x.score<=-60||x.months>=18)settleFaction(g,x,x.score>0?'royal victory':'rebel victory',world);
}

export function triggerTitleRevolt(g,world,realm,leaderId,members,kind='liberty'){
 const c=initConflict(g);
 const valid=members.filter(id=>g.provinces[id]?.owner===realm&&g.politics.holdings[id]?.realm===realm);
 if(!valid.length)return null;
 const key='f'+c.next++;
 const x=c.factions[key]={id:key,realm,kind,leader:leaderId,claimant:null,members:valid,memberLords:[leaderId],secretMembers:[],pressure:100,discontent:100,power:power(g,valid),strengthRatio:100,status:'organizing',started:g.turn};
 beginCivilWar(g,x,world);
 return x;
}

export function createFaction(g,world,realm,kind,members,opts={}){
 const c=initConflict(g);
 if(!FACTION_TYPES.includes(kind)||!g.politics?.realms?.[realm])return null;
 const valid=[...new Set(members)].filter(id=>g.provinces[id]?.owner===realm);
 if(!valid.length&&kind!=='popular')return null;
 const key='f'+c.next++;
 const lords=[...new Set(valid.map(id=>g.politics.holdings[id]?.lord).filter(Boolean))];
 const leader=opts.leader||(kind==='popular'?'popular':lords[0]||null);
 const x=c.factions[key]={
  id:key,realm,kind,leader,claimant:opts.claimant||null,
  members:valid,memberLords:lords,secretMembers:opts.secretMembers||[],
  pressure:opts.pressure??15,discontent:opts.pressure??15,
  power:power(g,valid),status:'organizing',started:g.turn
 };
 return x;
}

export function joinFaction(g,factionId,provinceId,secret=false){
 const c=initConflict(g),x=c.factions[factionId];
 if(!x||!ACTIVE_FACTION_STATUSES.includes(x.status))return no('Faction is not active.');
 const h=g.politics?.holdings?.[provinceId];
 if(!h||h.realm!==x.realm||h.lord===g.politics.realms[x.realm]?.ruler)return no('Select a vassal holding in the realm.');
 if((g.politics?.people?.[h.lord]?.noRebelUntil||0)>g.turn)return no('A strong royal hook prevents this lord from joining factions.');
 ensureFactionFields(g,x);
 if(secret){
  if(!x.secretMembers.some(s=>s.province===provinceId))x.secretMembers.push({person:h.lord,province:provinceId});
 }else{
  if(!x.members.includes(provinceId))x.members.push(provinceId);
  if(!x.memberLords.includes(h.lord))x.memberLords.push(h.lord);
 }
 return ok(secret?'Joined faction secretly.':'Joined faction.');
}

export function conflictAction(g,world,action,id,extra){
 const c=initConflict(g),realm=g.player,f=g.factions[realm],x=c.factions[id];
 if(action==='council'){
  if(!['advisory','binding'].includes(id)||(c.council[realm]||'advisory')===id||f.legitimacy<60||f.treasury<150)return no('Council reform requires 150 gold and 60 legitimacy.');
  if(id==='advisory'&&!councilPermission(g,realm,'law'))return no('The council refuses to surrender its authority.');
  f.treasury-=150;c.council[realm]=id;return ok('Council authority updated.');
 }
 if(action==='favor'){
  const v=councilVotes(g,realm).find(x=>x.id===id);
  if(!v||v.favor||f.treasury<80)return no('Need an unfavored councillor and 80 gold.');
  f.treasury-=80;c.favors[councilKey(realm,id)]=g.turn+24;return ok('Councillor favor secured for two years.');
 }
 if(action==='scheme')return startScheme(g,realm,id,extra);
 if(action==='dynastic-claim')return claimDynasticSeat(g,world,realm,id,extra);
 if(action==='declare')return declare(g,realm,id);
 if(action==='peace'){
  const w=c.wars[id],terms=peaceTerms(g,w,realm);
  if(!terms.length)return no('No such active war.');
  const term=terms.find(t=>t.id===extra);
  if(!term||term.reason)return no(term?.reason||'Unknown peace terms.');
  if(term.id==='reparations'){
   const other=w.attacker===realm?w.defender:w.attacker;
   g.factions[other].treasury-=term.amount;f.treasury+=term.amount;
  }
  endWar(g,w,term.result);
  if(term.id==='reparations')return ok('Peace signed for '+term.amount+' gold in reparations.');
  if(term.id==='enforce')return ok('Claim recognized; peace signed.');
  if(term.id==='surrender')return ok('Surrender accepted; occupation resolved.');
  return ok('White peace signed.');
 }
 if(!x||x.realm!==realm)return no('Select a faction in your realm.');
 ensureFactionFields(g,x);
 if(action==='accept'&&ACTIVE_FACTION_STATUSES.includes(x.status)){settleFaction(g,x,'concessions',world);return ok('Faction demands accepted.');}
 if(action==='refuse'&&x.status==='ultimatum'){beginCivilWar(g,x,world);return ok('Civil war has begun.');}
 if(action==='negotiate'&&['organizing','ultimatum'].includes(x.status)){
  if(f.treasury<150||g.turn-(x.lastNegotiation??-100)<6)return no('Negotiation needs 150 gold and a six-month interval.');
  f.treasury-=150;x.lastNegotiation=g.turn;x.pressure=cap(x.pressure-30,0,100);x.discontent=x.pressure;
  for(const pid of x.members){const v=g.politics.holdings[pid];if(v?.realm===realm)v.loyalty=cap(v.loyalty+12,0,100);}
  x.status='organizing';return ok('Negotiations reduced faction pressure.');
 }
 if(action==='coerce-leave'||action==='favor-leave'){
  if(!['organizing','ultimatum'].includes(x.status))return no('Can only coerce members before civil war.');
  const targetLord=extra;
  const hasHook=hookStrength(g,realm,targetLord)>0||(c.favors[councilKey(realm,targetLord)]||0)>g.turn;
  if(!hasHook&&f.treasury<100)return no('Requires an active favor/hook or 100 gold.');
  if(!hasHook)f.treasury-=100;
  x.members=x.members.filter(pid=>g.politics.holdings[pid]?.lord!==targetLord);
  x.secretMembers=x.secretMembers.filter(sm=>sm.person!==targetLord);
  x.memberLords=x.memberLords.filter(id=>id!==targetLord);
  for(const [pid,h] of holdings(g,realm))if(h.lord===targetLord)h.loyalty=cap(h.loyalty+18,0,100);
  if(!x.members.length)settleFaction(g,x,'dissolved',world);
  return ok('Vassal coerced out of the faction.');
 }
 if(action==='expose-secret'){
  if(!x.secretMembers.length)return no('No secret members to expose.');
  if(f.treasury<50)return no('Requires 50 gold for spymaster investigation.');
  f.treasury-=50;
  for(const sm of x.secretMembers){
   const h=g.politics.holdings[sm.province];
   if(h)h.leverageUntil=g.turn+36;
  }
  const count=x.secretMembers.length;
  x.secretMembers=[];
  return ok('Exposed '+count+' secret faction conspirators.');
 }
 if(action==='mobilize'&&x.status==='civil war'){
  if(f.treasury<150||x.lastMobilize===g.turn||x.lastRound===g.turn)return no('Mobilization costs 150 gold; only one campaign round per month.');
  f.treasury-=150;x.lastMobilize=g.turn;campaignRound(g,x,120,world);
  return ok('Royal troops confronted the rebel army.');
 }
 return no('Action unavailable at this stage.');
}

function candidateFactionTypes(g,world,realm,s,f,local,disloyalIds){
 const out=[];
 const activeKinds=new Set(Object.values(g.conflict.factions).filter(x=>x.realm===realm&&ACTIVE_FACTION_STATUSES.includes(x.status)).map(x=>x.kind));
 const claimant=f.legitimacy<48||s.claimantCrisis?.active?claimantCandidates(g,realm).find(c=>g.politics.people[c.person]?.age>=18):null;
 if(claimant&&disloyalIds.length&&!activeKinds.has('claimant')){
  out.push({kind:'claimant',members:disloyalIds,claimant:claimant.person});
 }
 const separatists=independenceMembers(g,world,realm,disloyalIds);
 if(separatists.length&&!activeKinds.has('independence')){
  out.push({kind:'independence',members:separatists});
 }
 const taxMembers=local.filter(([id,v])=>disloyalIds.includes(id)&&v.tax===2).map(([id])=>id);
 if(taxMembers.length&&!activeKinds.has('tax')){
  out.push({kind:'tax',members:taxMembers});
 }
 const realmFaith=g.civic?.realms?.[realm]?.faith;
 const relMembers=local.filter(([id,v])=>v.loyalty<45&&v.lord!==s.ruler&&!isImprisoned(g,v.lord)&&((realmFaith&&g.civic?.provinces?.[id]?.faith&&g.civic.provinces[id].faith!==realmFaith)||(realmFaith&&g.politics.people[v.lord]?.civic?.faith&&g.politics.people[v.lord].civic.faith!==realmFaith))).map(([id])=>id);
 if(relMembers.length&&!activeKinds.has('religious')){
  out.push({kind:'religious',members:relMembers});
 }
 const est=politicalEstates(g,realm);
 const nobleMembers=local.filter(([,v])=>v.loyalty<52&&v.lord!==s.ruler&&!isImprisoned(g,v.lord)&&(est.byLord[v.lord]?.grievance>0||(g.feudal?.tyranny?.[realm]||0)>=15)).map(([id])=>id);
 if(nobleMembers.length&&!activeKinds.has('noble')){
  out.push({kind:'noble',members:nobleMembers});
 }
 if(g.conflict.council[realm]!=='binding'&&disloyalIds.length&&!activeKinds.has('council')){
  out.push({kind:'council',members:disloyalIds});
 }
 const libertyMembers=local.filter(([id,v])=>disloyalIds.includes(id)&&(v.autonomy<2||v.levy===2||authorityLevel(g,realm)>=2)).map(([id])=>id);
 if((libertyMembers.length||disloyalIds.length)&&!activeKinds.has('liberty')){
  out.push({kind:'liberty',members:libertyMembers.length?libertyMembers:disloyalIds});
 }
 const popularProvs=Object.values(g.provinces).filter(p=>p.owner===realm&&p.unrest>=65).map(p=>p.id);
 if(popularProvs.length>=2&&f.stability<55&&!activeKinds.has('popular')){
  out.push({kind:'popular',members:popularProvs});
 }
 return out;
}

export function tickConflict(g,world){
 const c=initConflict(g);
 if(c.lastTick===g.turn)return;
 c.lastTick=g.turn;

 for(const s of Object.values(c.schemes))if(s.status==='active'&&g.turn>=s.due)finishScheme(g,s);
 for(const w of Object.values(c.wars)){
  if(w.status==='active'&&!w.civilWar){
   if(occupiedGoal(g,w)){w.score=cap(w.score+2,-100,100);if(w.score>=100){endWar(g,w,'claim enforced');continue;}}
   const attAi=!humanControlsRealm(g,w.attacker),defAi=!humanControlsRealm(g,w.defender),duration=Math.max(0,g.turn-(w.started||0));
   if(attAi&&defAi){
    const attP=aiPeaceAcceptance(g,w,w.attacker),defP=aiPeaceAcceptance(g,w,w.defender);
    if(w.score<=-45)endWar(g,w,'attacker defeated');
    else if(w.score>=65&&occupiedGoal(g,w))endWar(g,w,'claim enforced');
    else if(attP.accept||defP.accept){
     const res=w.score>=45&&occupiedGoal(g,w)?'claim enforced':w.score<=-25?'attacker defeated':'white peace';
     endWar(g,w,res);
    }
   }else if(attAi){
    const attP=aiPeaceAcceptance(g,w,w.attacker);
    if(w.score<=-45)endWar(g,w,'attacker defeated');
    else if(duration>=24&&attP.accept&&w.score<=0)endWar(g,w,attP.result);
    else if(duration>=48)endWar(g,w,'white peace');
   }else if(g.turn-w.started>=48){
    endWar(g,w,'white peace');
   }
  }
 }

 if(g.turn%3!==0)return;
 for(const [realm,s] of Object.entries(g.politics.realms)){
  const f=g.factions[realm],local=holdings(g,realm);
  if(!f||!local.length)continue;
  const disloyalIds=local.filter(([,v])=>v.loyalty<42&&v.lord!==s.ruler&&!isImprisoned(g,v.lord)&&!((g.politics?.people?.[v.lord]?.noRebelUntil||0)>g.turn)).map(([id])=>id);

  // Update all active concurrent factions in this realm.
  const activeList=Object.values(c.factions).filter(x=>x.realm===realm&&ACTIVE_FACTION_STATUSES.includes(x.status));
  for(const x of activeList){
   ensureFactionFields(g,x);
   if(x.kind==='claimant'&&!claimantCandidates(g,realm).some(cd=>cd.person===x.claimant)){
    settleFaction(g,x,'dissolved',world);continue;
   }
   if(x.status==='civil war'){
    x.members=x.members.filter(id=>g.provinces[id]?.owner===realm);
    if(!x.members.length){settleFaction(g,x,'dissolved',world);continue;}
    // Check if rebel armies & occupations were completely wiped out on the map.
    if(x.rebelFaction&&x.months>=1){
     const hasArmy=Object.values(g.armies).some(a=>a.owner===x.rebelFaction&&size(a)>0);
     const hasOcc=Object.values(g.campaignWar?.occupations||{}).some(o=>o.war===x.warId);
     if(!hasArmy&&!hasOcc){settleFaction(g,x,'royal victory',world);continue;}
     const w=x.warId?c.wars[x.warId]:null;
     if(w&&w.score>=75){settleFaction(g,x,'rebel victory',world);continue;}
    }
    campaignRound(g,x,0,world);
    continue;
   }

   // Refresh membership for organizing/ultimatum factions.
   if(x.kind==='popular'){
    x.members=Object.values(g.provinces).filter(p=>p.owner===realm&&p.unrest>=55).map(p=>p.id);
   }else if(x.kind==='independence'){
    x.members=independenceMembers(g,world,realm,disloyalIds);
   }else if(x.kind==='tax'){
    x.members=local.filter(([id,v])=>disloyalIds.includes(id)&&v.tax===2).map(([id])=>id);
   }else if(x.kind==='religious'){
    const realmFaith=g.civic?.realms?.[realm]?.faith;
    x.members=local.filter(([id,v])=>v.loyalty<45&&v.lord!==s.ruler&&!isImprisoned(g,v.lord)&&((realmFaith&&g.civic?.provinces?.[id]?.faith!==realmFaith)||(realmFaith&&g.politics.people[v.lord]?.civic?.faith!==realmFaith))).map(([id])=>id);
   }else if(x.kind==='noble'){
    const est=politicalEstates(g,realm);
    x.members=local.filter(([,v])=>v.loyalty<52&&v.lord!==s.ruler&&!isImprisoned(g,v.lord)&&(est.byLord[v.lord]?.grievance>0||(g.feudal?.tyranny?.[realm]||0)>=15)).map(([id])=>id);
   }else{
    x.members=disloyalIds;
   }
   if(!x.members.length){settleFaction(g,x,'dissolved',world);continue;}

   x.memberLords=[...new Set(x.members.map(id=>g.politics.holdings[id]?.lord).filter(Boolean))];
   if(x.kind!=='popular')x.leader=x.memberLords[0]||x.leader;
   x.power=power(g,x.members);
   const royal=civilWarForces(g,x,world).power,ratio=x.power/Math.max(1,royal),lords=Math.max(1,x.memberLords.length);
   x.strengthRatio=Math.round(ratio*100);
   x.pressure=cap(x.pressure+Math.max(5,Math.min(28,Math.round(lords*2+ratio*9))),0,100);
   x.discontent=x.pressure;

   if(!humanControlsRealm(g,realm)&&x.pressure>=55){
    if(f.treasury>200&&x.power>civilWarForces(g,x,world).power*.6)settleFaction(g,x,'concessions',world);
    else beginCivilWar(g,x,world);
    continue;
   }
   if(x.pressure>=70&&x.status==='organizing'){
    x.status='ultimatum';x.deadline=g.turn+6;
    noteIf(g,realm,'The '+x.kind+' faction issued an ultimatum. Respond within six months.');
   }
   if(x.status==='ultimatum'&&g.turn>=x.deadline)beginCivilWar(g,x,world);
  }

  // Concurrent multi-faction formation: form up to 1 new eligible faction per quarterly tick
  // (up to 4 concurrent active factions per realm).
  const activeAfter=Object.values(c.factions).filter(x=>x.realm===realm&&ACTIVE_FACTION_STATUSES.includes(x.status));
  const recentEnded=Object.values(c.factions).some(x=>x.realm===realm&&x.ended!==undefined&&g.turn-x.ended<24);
  if(activeAfter.length<4&&(!recentEnded||activeAfter.length>0)){
   const opts=candidateFactionTypes(g,world,realm,s,f,local,disloyalIds);
   const next=opts[0];
   if(next){
    const key='f'+c.next++;
    const lords=[...new Set(next.members.map(id=>g.politics.holdings[id]?.lord).filter(Boolean))];
    const nx=c.factions[key]={
     id:key,realm,kind:next.kind,
     leader:next.kind==='popular'?'popular':(lords[0]||null),
     claimant:next.claimant||null,
     members:next.members,memberLords:lords,secretMembers:[],
     pressure:15,discontent:15,power:power(g,next.members),
     status:'organizing',started:g.turn
    };
    const royal=civilWarForces(g,nx,world).power;
    nx.strengthRatio=Math.round(nx.power/Math.max(1,royal)*100);
    noteIf(g,realm,'Discontented subjects formed a '+next.kind+' faction.');
   }
  }
 }

 // AI prepares claims on neighboring realms and may declare wars it can afford and sustain.
 if(g.turn%12===0){
  for(const [realm,s] of Object.entries(g.politics.realms)){
   if(humanControlsRealm(g,realm))continue;
   const f=g.factions[realm],r=g.politics.people[s.ruler],plan=strategicPlan(g,realm);
   const alreadyAtWar=Object.values(c.wars).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(realm));
   if(!f||!r||(plan?.goal!=='conquer'&&!r.traits.includes('ambitious'))||f.treasury<420||f.stability<38||alreadyAtWar||plan?.goal==='recover')continue;
   const targets=[...new Set(holdings(g,realm).flatMap(([id])=>world.provinces.find(p=>p.id===id)?.neighbors||[]))].filter(id=>{
    const o=g.provinces[id]?.owner;
    return o&&o!==realm&&g.politics.realms[o]&&!(humanControlsRealm(g,o)&&g.kingdom?.difficulty==='peaceful')&&f.treaties[o]!=='alliance'&&!nonAggression(g,realm,o)&&!hasTruce(g,realm,o);
   });
   targets.sort((a,b)=>Number(g.provinces[b].owner===plan?.target)-Number(g.provinces[a].owner===plan?.target)||a.localeCompare(b));
   const claim=availableClaims(g,realm).find(x=>targets.includes(x.province)&&!activeWar(g,realm,g.provinces[x.province].owner)&&evaluateWarViability(g,world,realm,g.provinces[x.province].owner).viable);
   if(claim){declare(g,realm,claim.province);continue;}
   if(targets.length&&rng(c)<.4)startScheme(g,realm,'fabricate',targets[0]);
  }
 }

 // Defensive cleanup of orphaned rebel factions and bounded history.
 for(const [fid,f] of Object.entries(g.factions)){
  if(f.rebel&&c.factions[f.civilWar]?.status!=='civil war'){
   cleanupCivilWarEntities(g,{warId:c.factions[f.civilWar]?.warId,rebelFaction:fid,status:'settled'});
  }
 }
 for(const map of [c.schemes,c.factions,c.wars])for(const [id,x] of Object.entries(map))if(x.ended!==undefined&&g.turn-x.ended>120)delete map[id];
 for(const [id,x] of Object.entries(c.claims))if(x.expires<=g.turn||!validDynasticClaim(g,x))delete c.claims[id];
}
