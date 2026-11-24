import {regencyPermission} from './regency-systems.js';
import {claimDynasticSeat,validDynasticClaim} from './dynastic-ties.js';
import {estatePower} from './realm-authority.js';
import {campaignArmyPower,borderBattleOutcome,proportionalLoss} from './border-battle.js';
import {armyReadiness,syncRegiments} from './military-systems.js';
import {embarked} from './naval-systems.js';
import {controller} from './campaign-war.js';
import {nonAggression,aidStrength,diplomaticSupport} from './diplomacy-systems.js';
import {hookStrength} from './intrigue-systems.js';
import {independenceMembers,foundBreakaway} from './independence-systems.js';
import {claimantCandidates,installClaimant,isImprisoned,capturePrisoner} from './feudal-systems.js';
import {personalOpinion} from './chronicle-systems.js';
import {strategicPlan,temperament,militaryStrength,defenseSupport} from './strategic-ai.js';
import {settleOccupations,occupiedGoal} from './campaign-war.js';
import {civicModifiers} from './civic-systems.js';
// Political opposition, council consent, claims and intrigue. Deterministic, JSON-safe.
const cap=(x,a,b)=>Math.max(a,Math.min(b,x));
const size=a=>Math.max(0,(a.infantry||0)+(a.archers||0)+(a.cavalry||0));
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
function note(g,msg){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}
export function initConflict(g){return g.conflict??={next:1,seed:987123,lastTick:-1,factions:{},schemes:{},claims:{},wars:{},truces:{},favors:{},council:{},history:[]};}
function rng(c){c.seed=(Math.imul(c.seed,1664525)+1013904223)>>>0;return c.seed/4294967296;}
const holdings=(g,realm)=>Object.entries(g.politics.holdings).filter(([id,v])=>v.realm===realm&&g.provinces[id]?.owner===realm);
const army=(g,realm)=>Object.values(g.armies).filter(a=>a.owner===realm);
const pair=(a,b)=>[a,b].sort().join('|');
const councilKey=(realm,id)=>realm+':'+id;
function history(g,entry){const c=initConflict(g);c.history.unshift({turn:g.turn,...entry});c.history=c.history.slice(0,200);}
export function councilVotes(g,realm,proposal='law'){
 const c=initConflict(g),s=g.politics.realms[realm],f=g.factions[realm];if(!s||!f)return [];
 return Object.entries(s.council).filter(([,id])=>g.politics.people[id]?.alive&&!isImprisoned(g,id)).map(([role,id])=>{const person=g.politics.people[id],favor=(c.favors[councilKey(realm,id)]||0)>g.turn;
 const score=18+(f.legitimacy-50)*.7+(f.stability-50)*.3+(person.traits.includes('ambitious')?-20:0)+(person.traits.includes('content')?15:0)+(person.traits.includes('just')&&proposal==='revoke'?-28:0)+(person.traits.includes('cautious')&&proposal==='war'?-25:0)+(role==='marshal'&&proposal==='war'?22:0)+(favor?55:0)+personalOpinion(g,s.ruler,id)*.35+hookStrength(g,realm,id)*18;
 return {role,id,yes:score>=25,score:Math.round(score),favor};});
}
export function councilPermission(g,realm,proposal){const c=initConflict(g);if(!regencyPermission(g,realm,proposal))return false;if(c.council[realm]!=='binding')return true;const v=councilVotes(g,realm,proposal);return v.filter(x=>x.yes).length>v.length/2;}
function power(g,ids){return ids.reduce((n,id)=>n+estatePower(g,id),0);}
function claimKey(realm,id){return realm+':'+id;}
export function availableClaims(g,realm){const c=initConflict(g);return Object.values(c.claims).filter(x=>x.realm===realm&&g.provinces[x.province]&&g.provinces[x.province].owner!==realm&&x.expires>g.turn&&validDynasticClaim(g,x));}
export function activeWar(g,a,b){return Object.values(initConflict(g).wars).find(w=>w.status==='active'&&pair(w.attacker,w.defender)===pair(a,b));}
export function hasTruce(g,a,b){return (initConflict(g).truces[pair(a,b)]||0)>g.turn;}
function endWar(g,w,result){settleOccupations(g,w,result);w.status=result;w.ended=g.turn;initConflict(g).truces[pair(w.attacker,w.defender)]=g.turn+36;history(g,{kind:'war',realm:w.attacker,message:w.attacker+' vs '+w.defender+': '+result});if([w.attacker,w.defender].includes(g.player))note(g,'Peace signed: '+result+'. A three-year truce follows.');}
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
export function recordCampaignBattle(g,attacker,defender,province,victory){const w=activeWar(g,attacker,defender);if(!w)return;const sign=attacker===w.attacker?1:-1;w.score=cap(w.score+sign*(victory?30:-18),-100,100);if(victory&&province===w.goal&&attacker===w.attacker)w.score=Math.max(65,w.score);w.battles++;if(w.score<=-100)endWar(g,w,'attacker defeated');}
function declare(g,realm,id){
 const c=initConflict(g),claim=c.claims[claimKey(realm,id)],pr=g.provinces[id],f=g.factions[realm],other=pr?.owner;
 if(!claim||claim.expires<=g.turn||!validDynasticClaim(g,claim)||!pr||other===realm||!g.politics.realms[other])return no('A valid foreign territorial claim is required.');
 if(['alliance','marriage'].includes(f.treaties[other])||nonAggression(g,realm,other)||hasTruce(g,realm,other)||activeWar(g,realm,other))return no('Alliance, truce or existing war prevents declaration.');
 if(!councilPermission(g,realm,'war'))return no('The council or regent rejected this war.');
 if(f.prestige<5)return no('Need 5 prestige.');f.prestige-=5;
 const key='w'+c.next++;c.wars[key]={id:key,attacker:realm,defender:other,goal:id,score:0,battles:0,started:g.turn,status:'active'};
 if(realm===g.player||other===g.player)note(g,g.factions[realm].name+' declared a claim war on '+g.factions[other].name+' for '+id+'.');
 return ok('Claim war declared. Capture the contested province and negotiate peace.');
}
const SCHEMES={fabricate:{cost:110,duration:9},sway:{cost:60,duration:6},investigate:{cost:80,duration:6},undermine:{cost:100,duration:9}};
function startScheme(g,realm,kind,target){
 const c=initConflict(g),rule=SCHEMES[kind],f=g.factions[realm],s=g.politics.realms[realm],v=g.politics.holdings[target],pr=g.provinces[target];
 if(!rule||!s||!pr)return no('Select a valid scheme target.');
 if(Object.values(c.schemes).some(x=>x.realm===realm&&x.status==='active'))return no('One active scheme is permitted per realm.');
 if(kind==='fabricate'||kind==='undermine'){if(pr.owner===realm||!g.politics.realms[pr.owner])return no('Select a foreign holding.');if(kind==='fabricate'&&availableClaims(g,realm).some(x=>x.province===target))return no('Claim already exists.');}
 else if(!v||v.realm!==realm||pr.owner!==realm)return no('Select a holding in your own realm.');
 if(f.treasury<rule.cost)return no('Insufficient treasury for scheme.');
 const role=kind==='fabricate'?'chancellor':'spymaster',agent=g.politics.people[s.council[role]],r=g.politics.people[s.ruler],skill=kind==='fabricate'?'diplomacy':'intrigue';
 f.treasury-=rule.cost;const id='s'+c.next++;c.schemes[id]={id,realm,kind,target,targetOwner:pr.owner,targetLord:v?.lord,agent:agent?.id,start:g.turn,due:g.turn+rule.duration,chance:cap(25+(agent?.skills[skill]||1)*9+(r.skills[skill]||1)*5+civicModifiers(g,realm).scheme,30,90),status:'active'};
 return ok('Scheme launched. Outcome in '+rule.duration+' months.');
}
function finishScheme(g,s){const c=initConflict(g),pr=g.provinces[s.target],v=g.politics.holdings[s.target],f=g.factions[s.realm];let success=pr?.owner===s.targetOwner&&(!['sway','investigate'].includes(s.kind)||v?.lord===s.targetLord)&&g.politics.people[s.agent]?.alive&&rng(c)*100<s.chance;
 s.status=success?'succeeded':'failed';s.ended=g.turn;
 if(success){if(s.kind==='fabricate')c.claims[claimKey(s.realm,s.target)]={realm:s.realm,province:s.target,source:'chancery',expires:g.turn+120};
 if(s.kind==='sway')v.loyalty=cap(v.loyalty+24,0,100);
 if(s.kind==='investigate'){v.loyalty=cap(v.loyalty+12,0,100);v.leverageUntil=g.turn+36;g.politics.people[v.lord].memories.push('Court investigation settled an estate dispute.');}
 if(s.kind==='undermine'){g.factions[pr.owner].legitimacy=cap(g.factions[pr.owner].legitimacy-7,0,100);pr.unrest=cap(pr.unrest+12,0,100);}
 }else if(['fabricate','undermine'].includes(s.kind)&&g.factions[s.targetOwner]){const o=g.factions[s.targetOwner];o.relations[s.realm]=cap((o.relations[s.realm]||0)-12,-100,100);}
 history(g,{realm:s.realm,kind:'scheme',message:s.kind+' at '+s.target+': '+s.status});if(s.realm===g.player)note(g,'Scheme '+s.kind+' at '+s.target+' '+s.status+'.');
}
function settleFaction(g,x,result,world){
 const f=g.factions[x.realm],p=g.politics;x.status=result;x.ended=g.turn;
 if(x.kind==='independence'&&['concessions','rebel victory'].includes(result)){if(!foundBreakaway(g,world,x)){x.kind='liberty';}}

 if(x.kind==='claimant'&&['concessions','rebel victory'].includes(result))installClaimant(g,x.realm,x.claimant);
 if(x.kind==='claimant'&&result==='royal victory')capturePrisoner(g,x.realm,x.claimant,'failed claimant revolt');
 for(const id of x.members){const v=p.holdings[id];if(!v||v.realm!==x.realm||g.provinces[id]?.owner!==x.realm)continue;
  if(result==='concessions'||result==='rebel victory'){if(x.kind==='tax')v.tax=0;else if(x.kind==='levy')v.levy=0;else if(x.kind==='liberty')v.autonomy=2;v.loyalty=cap(v.loyalty+30,0,100);}
  if(result==='royal victory'){v.loyalty=cap(v.loyalty+20,0,100);v.wealth=Math.floor(v.wealth*.65);}
  g.provinces[id].unrest=cap(g.provinces[id].unrest-10,0,100);
 }
 if(result==='rebel victory'){f.legitimacy=cap(f.legitimacy-18,0,100);f.stability=cap(f.stability-12,0,100);}
 if(result==='royal victory')f.prestige+=10;
 history(g,{realm:x.realm,kind:'faction',message:x.kind+' faction: '+result});if(x.realm===g.player)note(g,'The '+x.kind+' faction ended: '+result+'.');
}
function beginCivilWar(g,x){x.status='civil war';x.startedWar=g.turn;x.rebels=power(g,x.members);x.score=0;x.months=0;noteIf(g,x.realm,'The '+x.kind+' faction raised an army against the crown.');}
function noteIf(g,realm,msg){if(realm===g.player)note(g,msg);}
// Only armies in contested provinces or their immediately adjacent home provinces
// can participate. Ships and armies on foreign campaigns do not teleport home.
export function civilWarForces(g,x,world){
 const members=new Set(x.members.filter(id=>g.provinces[id]?.owner===x.realm));
 const theater=new Set(members);
 for(const p of world.provinces)if(members.has(p.id))for(const id of p.neighbors||[])if(controller(g,id)===x.realm&&g.provinces[id]?.owner===x.realm)theater.add(id);
 const forces=army(g,x.realm).filter(a=>size(a)>0&&theater.has(a.province)&&controller(g,a.province)===x.realm&&!embarked(g,a.id));
 return {forces,troops:forces.reduce((n,a)=>n+size(a),0),power:forces.reduce((n,a)=>n+campaignArmyPower(a,armyReadiness(g,a)),0)};
}
function campaignRound(g,x,boost=0,world){const f=g.factions[x.realm],{forces,troops:strength,power:ready}=civilWarForces(g,x,world),c=initConflict(g);
 if(x.status!=='civil war'||x.lastRound===g.turn)return;
 x.lastRound=g.turn;
 // Mobilization represents better logistics, not soldiers appearing from nowhere.
 const royal=ready*(1+Math.min(.25,boost/Math.max(1,ready))),rebel=Math.max(0,x.rebels);
 const outcome=borderBattleOutcome(royal,rebel,rng(c)),success=outcome.victory;
 x.score=cap(x.score+(success?25:-20),-100,100);x.months++;
 for(const a of forces){proportionalLoss(a,outcome.attackerLoss);syncRegiments(g,a);}
 x.rebels=Math.max(0,Math.round(x.rebels*(1-(royal>0?outcome.defenderLoss:0))));
 for(const id of x.members)if(g.provinces[id]?.owner===x.realm)g.provinces[id].unrest=cap(g.provinces[id].unrest+(success?-2:6),0,100);
 f.treasury-=Math.min(80,Math.max(0,strength*.04));
 if(x.score>=75||x.rebels<=10)settleFaction(g,x,'royal victory',world);else if(x.score<=-60||x.months>=18)settleFaction(g,x,x.score>0?'royal victory':'rebel victory',world);
}
export function conflictAction(g,world,action,id,extra){const c=initConflict(g),realm=g.player,f=g.factions[realm],x=c.factions[id];
 if(action==='council'){if(!['advisory','binding'].includes(id)||(c.council[realm]||'advisory')===id||f.legitimacy<60||f.treasury<150)return no('Council reform requires 150 gold and 60 legitimacy.');if(id==='advisory'&&!councilPermission(g,realm,'law'))return no('The council refuses to surrender its authority.');f.treasury-=150;c.council[realm]=id;return ok('Council authority updated.');}
 if(action==='favor'){const v=councilVotes(g,realm).find(x=>x.id===id);if(!v||v.favor||f.treasury<80)return no('Need an unfavored councillor and 80 gold.');f.treasury-=80;c.favors[councilKey(realm,id)]=g.turn+24;return ok('Councillor favor secured for two years.');}
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
   g.factions[other].treasury-=term.amount;
   f.treasury+=term.amount;
  }
  endWar(g,w,term.result);
  if(term.id==='reparations')return ok('Peace signed for '+term.amount+' gold in reparations.');
  if(term.id==='enforce')return ok('Claim recognized; peace signed.');
  if(term.id==='surrender')return ok('Surrender accepted; occupation resolved.');
  return ok('White peace signed.');
 }
 if(!x||x.realm!==realm)return no('Select a faction in your realm.');
 if(action==='accept'&&['organizing','ultimatum','civil war'].includes(x.status)){settleFaction(g,x,'concessions',world);return ok('Faction demands accepted.');}
 if(action==='refuse'&&x.status==='ultimatum'){beginCivilWar(g,x);return ok('Civil war has begun.');}
 if(action==='negotiate'&&['organizing','ultimatum'].includes(x.status)){if(f.treasury<150||g.turn-(x.lastNegotiation??-100)<6)return no('Negotiation needs 150 gold and a six-month interval.');f.treasury-=150;x.lastNegotiation=g.turn;x.pressure=cap(x.pressure-30,0,100);for(const id of x.members){const v=g.politics.holdings[id];if(v?.realm===realm)v.loyalty=cap(v.loyalty+12,0,100);}x.status='organizing';return ok('Negotiations reduced faction pressure.');}
 if(action==='mobilize'&&x.status==='civil war'){if(f.treasury<150||x.lastMobilize===g.turn||x.lastRound===g.turn)return no('Mobilization costs 150 gold; only one campaign round per month.');f.treasury-=150;x.lastMobilize=g.turn;campaignRound(g,x,120,world);return ok('Royal troops confronted the rebel army.');}
 return no('Action unavailable at this stage.');
}
export function tickConflict(g,world){const c=initConflict(g);if(c.lastTick===g.turn)return;c.lastTick=g.turn;
 for(const s of Object.values(c.schemes))if(s.status==='active'&&g.turn>=s.due)finishScheme(g,s);
 for(const w of Object.values(c.wars))if(w.status==='active'){if(occupiedGoal(g,w)){w.score=cap(w.score+2,-100,100);if(w.score>=100)endWar(g,w,'claim enforced');}else if(g.turn-w.started>=48)endWar(g,w,'white peace');}
 if(g.turn%3!==0)return;
 for(const [realm,s] of Object.entries(g.politics.realms)){
 const f=g.factions[realm],local=holdings(g,realm),members=local.filter(([,v])=>v.loyalty<42&&v.lord!==s.ruler&&!isImprisoned(g,v.lord)).map(([id])=>id);let x=Object.values(c.factions).find(x=>x.realm===realm&&['organizing','ultimatum','civil war'].includes(x.status));
 if(x?.kind==='claimant'&&!claimantCandidates(g,realm).some(c=>c.person===x.claimant)){settleFaction(g,x,'dissolved',world);continue;}
 if(x?.status==='civil war'){x.members=x.members.filter(id=>g.provinces[id]?.owner===realm);if(!x.members.length)settleFaction(g,x,'dissolved',world);else campaignRound(g,x,0,world);continue;}
 if(!members.length){if(x)settleFaction(g,x,'dissolved',world);continue;}
 if(!x){const recent=Object.values(c.factions).some(x=>x.realm===realm&&x.ended!==undefined&&g.turn-x.ended<24);if(recent)continue;const key='f'+c.next++;const claimant=f.legitimacy<48?claimantCandidates(g,realm).find(c=>g.politics.people[c.person].age>=18):null;const separatists=claimant?[]:independenceMembers(g,world,realm,members);const kind=claimant?'claimant':separatists.length?'independence':local.filter(([id,v])=>members.includes(id)&&v.tax===2).length?'tax':local.filter(([id,v])=>members.includes(id)&&v.levy===2).length?'levy':'liberty';x=c.factions[key]={id:key,realm,kind,claimant:claimant?.person||null,members,pressure:15,status:'organizing',started:g.turn};noteIf(g,realm,'Discontented vassals formed a '+kind+' faction.');}
 x.members=x.kind==='independence'?independenceMembers(g,world,realm,members):members;if(!x.members.length){settleFaction(g,x,'dissolved',world);continue;}x.power=power(g,x.members);const royal=civilWarForces(g,x,world).power,ratio=x.power/Math.max(1,royal),lords=new Set(x.members.map(id=>g.politics.holdings[id]?.lord)).size;x.strengthRatio=Math.round(ratio*100);x.pressure=cap(x.pressure+Math.max(5,Math.min(28,Math.round(lords*2+ratio*9))),0,100);
 if(realm!==g.player&&x.pressure>=55){if(f.treasury>200&&x.power>civilWarForces(g,x,world).power*.6)settleFaction(g,x,'concessions',world);else beginCivilWar(g,x);continue;}
 if(x.pressure>=70&&x.status==='organizing'){x.status='ultimatum';x.deadline=g.turn+6;noteIf(g,realm,'A faction issued an ultimatum. Respond within six months.');}
 if(x.status==='ultimatum'&&g.turn>=x.deadline)beginCivilWar(g,x);
 }
 // AI prepares claims on neighboring realms and may declare wars it can afford.
 if(g.turn%12===0)for(const [realm,s] of Object.entries(g.politics.realms)){if(realm===g.player)continue;const f=g.factions[realm],r=g.politics.people[s.ruler];const plan=strategicPlan(g,realm);if((plan?.goal!=='conquer'&&!r.traits.includes('ambitious'))||f.treasury<400||plan?.goal==='recover')continue;
 const targets=[...new Set(holdings(g,realm).flatMap(([id])=>world.provinces.find(p=>p.id===id)?.neighbors||[]))].filter(id=>{const o=g.provinces[id]?.owner;return o&&o!==realm&&g.politics.realms[o]&&f.treaties[o]!=='alliance'&&!nonAggression(g,realm,o)&&!hasTruce(g,realm,o);});
 targets.sort((a,b)=>Number(g.provinces[b].owner===plan?.target)-Number(g.provinces[a].owner===plan?.target)||a.localeCompare(b));const claim=availableClaims(g,realm).find(x=>targets.includes(x.province)&&!activeWar(g,realm,g.provinces[x.province].owner)&&militaryStrength(g,realm)>=.65*(militaryStrength(g,g.provinces[x.province].owner)+defenseSupport(g,g.provinces[x.province].owner,realm)));if(claim){declare(g,realm,claim.province);continue;}
 if(targets.length&&rng(c)<.4)startScheme(g,realm,'fabricate',targets[0]);
 }
 // Keep historical records bounded; active objects are never dropped.
 for(const map of [c.schemes,c.factions,c.wars])for(const [id,x] of Object.entries(map))if(x.ended!==undefined&&g.turn-x.ended>120)delete map[id];
 for(const [id,x] of Object.entries(c.claims))if(x.expires<=g.turn||!validDynasticClaim(g,x))delete c.claims[id];
}
