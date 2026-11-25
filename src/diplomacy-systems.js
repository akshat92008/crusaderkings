import {humanControlsRealm} from './player-career.js';
import {unionPartners} from './personal-unions.js';
import {REGIMENTS,initMilitary,onArmyMarch,syncRegiments} from './military-systems.js';
import {controller} from './campaign-war.js';
import {allianceTerms,nonAggressionTerms} from './ck2-deep-systems.js';
export {allianceTerms,nonAggressionTerms};

// Explicit diplomatic treaties, Alliance Call-to-Arms, Guarantees, Access, Tribute, Hostages, Marriage Treaties & Coalitions.
const pair=(a,b)=>[a,b].sort().join('|'),cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const land=(g,r)=>Object.values(g.provinces).some(p=>p.owner===r&&controller(g,p.id)===r);
const war=(g,a,b)=>Object.values(g.conflict?.wars||{}).find(w=>w.status==='active'&&pair(w.attacker,w.defender)===pair(a,b));
const allied=(g,a,b)=>unionPartners(g,a,b)||['alliance','marriage'].includes(g.factions[a]?.treaties?.[b]);
const relation=(g,a,b)=>g.factions[a]?.relations?.[b]||0;
const troops=a=>(a.infantry||0)+(a.archers||0)+(a.cavalry||0);
const alive=(g,id)=>g.politics?.people?.[id]?.alive?g.politics.people[id]:null;

export function initDiplomacy(g){
 const d=g.diplomacy??={version:1,pacts:{},guarantees:{},aid:{},passage:{},tributes:{},hostages:{},coalitions:{},threat:{},history:[],lastTick:-1};
 d.pacts??={};
 d.guarantees??={};
 d.aid??={};
 d.passage??={};
 d.tributes??={};
 d.hostages??={};
 d.coalitions??={};
 d.threat??={};
 d.history??=[];
 return d;
}

function note(g,r,message){
 const d=initDiplomacy(g);
 d.history.unshift({realm:r,turn:g.turn,message});
 d.history=d.history.slice(0,160);
 if(r===g.player&&Array.isArray(g.log)){
  g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});
  g.log=g.log.slice(0,45);
 }
}

const passageKey=(traveler,host)=>traveler+':'+host;

export function militaryAccess(g,traveler,host){
 if(unionPartners(g,traveler,host))return {traveler,host,union:true,until:Number.MAX_SAFE_INTEGER};
 const trib=g.diplomacy?.tributes?.[traveler];
 if(trib?.suzerain===host&&trib?.until>g.turn)return {traveler,host,tribute:true,until:trib.until};
 const pass=g.diplomacy?.passage?.[passageKey(traveler,host)];
 return pass?.until>g.turn&&!war(g,traveler,host)?pass:null;
}

export function mayEnterWithAccess(g,traveler,province){
 const host=g.provinces[province]?.owner;
 return Boolean(host&&host!==traveler&&controller(g,province)===host&&militaryAccess(g,traveler,host));
}

export function militaryAccessTerms(g,traveler,host){
 if(traveler===host||host==='independent'||!g.factions[traveler]||!g.factions[host]||!land(g,traveler)||!land(g,host))return 'Both courts must control territory.';
 if(war(g,traveler,host))return 'Requires peace with the host.';
 if(militaryAccess(g,traveler,host))return 'Military access is already active.';
 if(relation(g,host,traveler)<25)return 'The host must have at least +25 relations with your realm.';
 if(g.factions[traveler].treasury<90)return 'Requires 90 gold.';
 return '';
}

function requestAccess(g,traveler,host){
 const reason=militaryAccessTerms(g,traveler,host);
 if(reason)return no(reason);
 const d=initDiplomacy(g),fee=90;
 g.factions[traveler].treasury-=fee;
 g.factions[host].treasury+=fee;
 d.passage[passageKey(traveler,host)]={traveler,host,until:g.turn+24};
 note(g,traveler,'Military passage granted by '+g.factions[host].name+' for two years.');
 return ok('Military passage granted for 24 months.');
}

function reconcilePassage(g,d){
 for(const [key,pass] of Object.entries(d.passage||{})){
  if(pass.until<=g.turn||war(g,pass.traveler,pass.host)||!land(g,pass.host))delete d.passage[key];
 }
 for(const army of Object.values(g.armies)){
  if(!army.passage||g.naval?.voyages?.[army.id])continue;
  if(controller(g,army.province)===army.owner){
   delete army.passage;
   continue;
  }
  if(mayEnterWithAccess(g,army.owner,army.province))continue;
  const home=army.passage.home,homeIsSafe=controller(g,home)===army.owner&&g.provinces[home]?.owner===army.owner;
  const recovery=homeIsSafe?home:Object.values(g.provinces).find(p=>p.owner===army.owner&&controller(g,p.id)===army.owner)?.id;
  if(!recovery)continue;
  onArmyMarch(g,army);
  army.province=recovery;
  delete army.passage;
  note(g,army.owner,'An army withdrew to '+recovery+' after its military passage ended.');
 }
}

export function nonAggression(g,a,b){return unionPartners(g,a,b)||(g.diplomacy?.pacts[pair(a,b)]?.until||0)>g.turn;}

export function guaranteePartners(g,realm,enemy){
 return Object.values(g.diplomacy?.guarantees||{}).filter(x=>x.protected===realm&&x.guarantor!==enemy&&x.until>g.turn&&land(g,x.guarantor)&&!war(g,x.guarantor,realm)&&!allied(g,x.guarantor,enemy)&&!nonAggression(g,x.guarantor,enemy)).map(x=>x.guarantor);
}

// --- Aggressive Expansion Threat & Coalitions ---
export function addDiplomaticThreat(g,realm,amount){
 const d=initDiplomacy(g);
 d.threat[realm]=cap((d.threat[realm]||0)+amount,0,100);
 return d.threat[realm];
}

export function diplomaticThreat(g,realm){
 return g.diplomacy?.threat?.[realm]||0;
}

export function coalitionAgainst(g,target){
 const c=g.diplomacy?.coalitions?.[target];
 if(!c||c.expires<=g.turn)return null;
 const members=(c.members||[]).filter(id=>id!==target&&g.factions[id]&&land(g,id)&&!allied(g,id,target)&&!nonAggression(g,id,target));
 return members.length?{...c,members}:null;
}

export function joinCoalition(g,member,target){
 const d=initDiplomacy(g);
 if(!g.factions[member]||!g.factions[target]||member===target||!land(g,member)||!land(g,target))return no('Invalid coalition participant.');
 if(allied(g,member,target)||nonAggression(g,member,target)||war(g,member,target))return no('Existing treaty or war bars joining coalition.');
 const existing=d.coalitions[target]??={target,members:[],formed:g.turn,expires:g.turn+48};
 if(!existing.members.includes(member))existing.members.push(member);
 existing.expires=Math.max(existing.expires,g.turn+48);
 note(g,member,`${g.factions[member].name} joined a defensive coalition against ${g.factions[target].name}.`);
 return ok(`Joined coalition against ${g.factions[target].name}.`);
}

export function leaveCoalition(g,member,target){
 const c=g.diplomacy?.coalitions?.[target];
 if(!c||!c.members.includes(member))return no('Not in this coalition.');
 c.members=c.members.filter(id=>id!==member);
 if(!c.members.length)delete g.diplomacy.coalitions[target];
 return ok('Withdrew from coalition.');
}

export function coalitionPartners(g,realm,aggressor){
 const c=coalitionAgainst(g,aggressor);
 if(!c||!c.members.includes(realm))return [];
 return c.members.filter(id=>id!==realm&&!war(g,id,realm)&&!allied(g,id,aggressor));
}

// --- Tribute System ---
export function tributaryOf(g,realm){
 const t=g.diplomacy?.tributes?.[realm];
 return t&&t.until>g.turn&&g.factions[t.suzerain]&&land(g,t.suzerain)?t:null;
}

export function suzerainSubjects(g,realm){
 return Object.values(g.diplomacy?.tributes||{}).filter(t=>t.suzerain===realm&&t.until>g.turn&&land(g,t.tributary));
}

function realmArmyCount(g,r){
 return Object.values(g.armies||{}).filter(a=>a.owner===r&&!a.contingent&&!g.naval?.voyages?.[a.id]).reduce((n,a)=>n+troops(a),0);
}

export function demandTribute(g,suzerain,target){
 const d=initDiplomacy(g);
 if(!g.factions[suzerain]||!g.factions[target]||suzerain===target||!land(g,suzerain)||!land(g,target))return no('Invalid realms for tribute.');
 if(war(g,suzerain,target)||allied(g,suzerain,target)||nonAggression(g,suzerain,target))return no('Peace without binding treaties is required.');
 if(tributaryOf(g,target))return no('Target already pays tribute.');
 const myStr=realmArmyCount(g,suzerain),theirStr=realmArmyCount(g,target);
 const ruler=alive(g,g.politics?.realms?.[target]?.ruler);
 const traits=ruler?.traits||[];
 const cautious=traits.includes('cautious')||traits.includes('content')||traits.includes('gregarious');
 const defiant=traits.includes('ambitious')||traits.includes('brave')||traits.includes('wrathful');
 const ratio=myStr/Math.max(1,theirStr);
 if(ratio>=(defiant?2.4:cautious?1.5:1.9)){
  d.tributes[target]={suzerain,tributary:target,rate:0.15,minGold:12,started:g.turn,until:g.turn+60,subjugated:false,defaulted:false};
  note(g,suzerain,`${g.factions[target].name} agreed to pay tribute.`);
  note(g,target,`${g.factions[target].name} became a tributary of ${g.factions[suzerain].name}.`);
  return ok(`${g.factions[target].name} submitted and will pay monthly tribute.`);
 }
 if(g.conflict?.claims){
  g.factions[target].relations[suzerain]=cap(relation(g,target,suzerain)-20,-100,100);
 }
 return no(`${g.factions[target].name} refused the tribute demand (use Tribute Enforcement Casus Belli to compel them).`);
}

export function breakTribute(g,tributary){
 const t=tributaryOf(g,tributary);
 if(!t)return no('No active tribute obligation.');
 delete g.diplomacy.tributes[tributary];
 const suz=g.factions[t.suzerain];
 if(suz)suz.relations[tributary]=cap((suz.relations[tributary]||0)-40,-100,100);
 note(g,tributary,`Stopped paying tribute to ${suz?.name||t.suzerain}.`);
 return ok('Tribute repudiated.');
}

// --- Diplomatic Hostages ---
export function activeHostages(g,a,b){
 return Object.values(g.diplomacy?.hostages||{}).filter(h=>h.status==='active'&&h.until>g.turn&&alive(g,h.person)&&((h.from===a&&h.host===b)||(h.from===b&&h.host===a)));
}

export function hasHostageBar(g,a,b){
 return activeHostages(g,a,b).length>0;
}

export function exchangeHostage(g,fromRealm,hostRealm,personId=null){
 const d=initDiplomacy(g);
 if(!g.factions[fromRealm]||!g.factions[hostRealm]||fromRealm===hostRealm||!land(g,fromRealm)||!land(g,hostRealm))return no('Invalid hostage realms.');
 if(war(g,fromRealm,hostRealm))return no('Cannot exchange hostages during active war.');
 const rulerId=g.politics?.realms?.[fromRealm]?.ruler;
 const candidates=Object.values(g.politics?.people||{}).filter(p=>p.alive&&p.realm===fromRealm&&p.id!==rulerId&&p.age>=12&&!g.feudal?.prisoners?.[p.id]?.status&&!Object.values(d.hostages).some(h=>h.status==='active'&&h.person===p.id));
 const person=personId?candidates.find(p=>p.id===personId):candidates.sort((a,b)=>a.id.localeCompare(b.id))[0];
 if(!person)return no('No eligible courtier or noble available as diplomatic hostage.');
 const id='h'+Object.keys(d.hostages).length+'_'+g.turn+'_'+person.id;
 d.hostages[id]={id,person:person.id,from:fromRealm,host:hostRealm,started:g.turn,until:g.turn+36,status:'active'};
 g.factions[fromRealm].relations[hostRealm]=cap(relation(g,fromRealm,hostRealm)+10,-100,100);
 g.factions[hostRealm].relations[fromRealm]=cap(relation(g,hostRealm,fromRealm)+10,-100,100);
 note(g,fromRealm,`${person.name} sent as honorable hostage to ${g.factions[hostRealm].name}.`);
 return ok(`${person.name} placed as diplomatic hostage at ${g.factions[hostRealm].name} for 3 years.`);
}

export function releaseHostage(g,hostageId){
 const h=g.diplomacy?.hostages?.[hostageId];
 if(!h||h.status!=='active')return no('No active hostage record.');
 h.status='released';
 h.ended=g.turn;
 return ok('Diplomatic hostage returned home.');
}

export function releaseWarHostages(g,w){
 if(!w||!g.diplomacy?.hostages)return;
 for(const h of Object.values(g.diplomacy.hostages)){
  if(h.status==='active'&&pair(h.from,h.host)===pair(w.attacker,w.defender)){
   h.status='released';h.ended=g.turn;
  }
 }
}

// --- Marriage Treaties ---
export function signMarriageTreaty(g,a,b){
 if(!g.factions[a]||!g.factions[b]||a===b||!land(g,a)||!land(g,b))return no('Invalid realms.');
 if(war(g,a,b))return no('Requires peace to seal a marriage treaty.');
 if(relation(g,b,a)<15)return no('Foreign court requires at least +15 relations.');
 const d=initDiplomacy(g);
 g.factions[a].treaties[b]='marriage';
 g.factions[b].treaties[a]='marriage';
 d.pacts[pair(a,b)]={members:[a,b],until:g.turn+60};
 g.factions[a].relations[b]=cap(relation(g,a,b)+12,-100,100);
 g.factions[b].relations[a]=cap(relation(g,b,a)+12,-100,100);
 note(g,a,`Marriage treaty sealed with ${g.factions[b].name}.`);
 return ok(`Marriage treaty sealed with ${g.factions[b].name}.`);
}

// --- Field Aid & Allied Call-to-Arms ---
function validAid(g,x){
 return x?.until>g.turn&&g.conflict?.wars[x.war]?.status==='active'
  &&allied(g,x.realm,x.donor)&&allied(g,x.donor,x.realm)&&!war(g,x.donor,x.realm)
  &&!allied(g,x.donor,x.enemy)&&!nonAggression(g,x.donor,x.enemy);
}

export function aidStrength(g,realm,enemy){
 return Object.values(g.diplomacy?.aid||{})
  .filter(x=>!x.army&&x.realm===realm&&x.enemy===enemy&&validAid(g,x)&&land(g,x.donor))
  .reduce((n,x)=>n+x.strength,0);
}

export function fieldContingentSupports(g,army,realm,enemy){
 const x=g.diplomacy?.aid?.[army?.contingent];
 return !!x&&x.army===army.id&&x.realm===realm&&x.donor===army.owner
  &&(!enemy||x.enemy===enemy)&&!x.route.length&&troops(army)>0
  &&!g.naval?.voyages?.[army.id]&&controller(g,army.province)===realm&&validAid(g,x);
}

export function fieldContingentsAt(g,realm,province,enemy){
 return Object.values(g.diplomacy?.aid||{}).flatMap(x=>{
  if(!x.army||x.realm!==realm||enemy&&x.enemy!==enemy)return [];
  const a=g.armies[x.army];
  return a?.province===province&&fieldContingentSupports(g,a,realm,enemy)?[a]:[];
 });
}

function controlledBy(g,id,realm){return g.provinces[id]?.owner===realm&&controller(g,id)===realm;}

function expeditionRoute(g,atlas,source,donor,realm){
 if(!controlledBy(g,source,donor))return [];
 const queue=[source],parent=new Map([[source,null]]);
 for(let i=0;i<queue.length;i++){
  const current=queue[i];
  for(const neighbor of atlas.get(current)?.neighbors||[]){
   if(controlledBy(g,neighbor,realm)){
    const route=[neighbor];
    for(let id=current;id!==source;id=parent.get(id))route.push(id);
    return route.reverse();
   }
   if(!parent.has(neighbor)&&controlledBy(g,neighbor,donor)){
    parent.set(neighbor,current);
    queue.push(neighbor);
   }
  }
 }
 return [];
}

export function fieldAidOptions(g,world,realm,w){
 const donors=aidOptions(g,realm,w);
 if(!donors.length)return [];
 const atlas=new Map((world.provinces||[]).map(p=>[p.id,p]));
 const offers=[];
 for(const donor of donors){
  const candidates=[];
  for(const a of Object.values(g.armies)){
   if(a.owner!==donor||a.contingent||g.naval?.voyages?.[a.id]||g.kingdom?.threats?.some(t=>t.army===a.id))continue;
   const count=Math.min(160,Math.floor(troops(a)*.30));
   if(count<24)continue;
   const route=expeditionRoute(g,atlas,a.province,donor,realm);
   if(route.length&&route.length<18)candidates.push({donor,source:a.id,route,count});
  }
  const offer=candidates.sort((a,b)=>a.route.length-b.route.length||b.count-a.count||a.source.localeCompare(b.source))[0];
  if(offer)offers.push(offer);
 }
 return offers;
}

const fieldTypes=['infantry','archers','cavalry'];

function dispatchFieldAid(g,realm,w,offer){
 const d=initDiplomacy(g),source=g.armies[offer.source],id='a'+g.nextId++;
 const key=w.id+':'+offer.donor,enemy=w.attacker===realm?w.defender:w.attacker;
 const original=troops(source),sourceMilitary=syncRegiments(g,source);
 const army={id,owner:offer.donor,province:source.province,experience:source.experience,morale:source.morale,
  doctrine:source.doctrine,commander:'Allied contingent',contingent:key};
 let seen=0,assigned=0;
 for(const type of fieldTypes){
  seen+=source[type];
  const quota=Math.round(seen*offer.count/original);
  army[type]=quota-assigned;
  assigned=quota;
 }
 const specializations={};
 for(const [special,count] of Object.entries(sourceMilitary.regiments)){
  const type=REGIMENTS[special]?.type;
  if(!type||!source[type])continue;
  const moved=Math.floor(count*army[type]/source[type]);
  sourceMilitary.regiments[special]-=moved;
  if(moved)specializations[special]=moved;
 }
 for(const type of fieldTypes){
  source[type]-=army[type];
  sourceMilitary.counts[type]=source[type];
 }
 g.armies[id]=army;
 const m=initMilitary(g).armies[id];
 m.regiments=specializations;
 m.supply=sourceMilitary.supply;
 m.fatigue=sourceMilitary.fatigue;
 g.factions[offer.donor].treasury-=200;
 g.factions[realm].treasury+=100;
 d.aid[key]={war:w.id,realm,enemy,donor:offer.donor,army:id,origin:source.province,
  route:offer.route,until:g.turn+18,strength:0};
 note(g,realm,g.factions[offer.donor].name+' dispatched '+offer.count+' troops and sent 100 gold.');
 return ok('Allied contingent dispatched. Expected march: '+offer.route.length+(offer.route.length===1?' month.':' months.'));
}

function recallFieldArmy(g,x){
 const a=g.armies[x.army];
 if(!a||!a.contingent)return;
 const home=controlledBy(g,x.origin,x.donor)?x.origin:Object.keys(g.provinces).find(id=>controlledBy(g,id,x.donor));
 if(home&&troops(a)>0){
  a.province=home;
  delete a.contingent;
  a.commander='Returned expedition';
  note(g,x.realm,g.factions[x.donor].name+' recalled its surviving contingent.');
 }else delete g.armies[a.id];
}

export function recallWarContingents(g,warId){
 for(const x of Object.values(g.diplomacy?.aid||{}))if(x.army&&x.war===warId)recallFieldArmy(g,x);
}

function advanceFieldContingents(g,world){
 for(const x of Object.values(g.diplomacy?.aid||{})){
  if(!x.army)continue;
  const army=g.armies[x.army];
  if(!army?.contingent)continue;
  if(!validAid(g,x)||troops(army)<=0){
   recallFieldArmy(g,x);
   continue;
  }
  if(!x.route.length){
   if(controller(g,army.province)!==x.realm)recallFieldArmy(g,x);
   continue;
  }
  let next=x.route[0],last=x.route.length===1;
  if(!controlledBy(g,army.province,x.donor)||!controlledBy(g,next,last?x.realm:x.donor)){
   const atlas=new Map(world.provinces.map(p=>[p.id,p]));
   x.route=expeditionRoute(g,atlas,army.province,x.donor,x.realm);
   next=x.route[0];
   if(!next){
    recallFieldArmy(g,x);
    continue;
   }
   last=x.route.length===1;
  }
  onArmyMarch(g,army);
  army.province=x.route.shift();
  if(last)note(g,x.realm,g.factions[x.donor].name+' arrived at '+army.province+' with '+troops(army)+' troops.');
 }
}

export function diplomaticSupport(g,realm,enemy){
 const guarantors=guaranteePartners(g,realm,enemy);
 const coal=coalitionPartners(g,realm,enemy);
 const all=[...new Set([...guarantors,...coal])];
 return all.reduce((n,id)=>n+Math.min(50,Math.round(Object.values(g.armies).filter(a=>a.owner===id&&!a.contingent&&!g.naval?.voyages[a.id]).reduce((n,a)=>n+troops(a),0)*.1)),0);
}

function sign(g,a,b,world=null){
 const d=initDiplomacy(g);
 if(!g.factions[a]||!g.factions[b]||!land(g,a)||!land(g,b)||a===b||war(g,a,b)||nonAggression(g,a,b))return no('Requires peace, valid realms and no active pact.');
 const terms=nonAggressionTerms(g,a,b,world);
 if(!terms.accepted)return no(terms.reason);
 if(g.factions[a].treasury<80)return no('Requires 80 gold.');
 g.factions[a].treasury-=80;
 d.pacts[pair(a,b)]={members:[a,b],until:g.turn+48};
 note(g,a,'Non-aggression agreement with '+g.factions[b].name+'.');
 note(g,b,'Non-aggression agreement with '+g.factions[a].name+'.');
 return ok('Four-year non-aggression agreement signed.');
}

function guarantee(g,a,b){
 const d=initDiplomacy(g),k=a+':'+b;
 if(a===b||!g.factions[a]||!g.factions[b]||!land(g,a)||!land(g,b)||war(g,a,b)||relation(g,a,b)<10||relation(g,b,a)<10||d.guarantees[k]?.until>g.turn||g.factions[a].treasury<100)return no('Requires peace, mutual +10 relations and 100 gold.');
 g.factions[a].treasury-=100;
 d.guarantees[k]={guarantor:a,protected:b,until:g.turn+60};
 note(g,b,g.factions[a].name+' guaranteed your independence.');
 return ok('Five-year guarantee established.');
}

export function aidOptions(g,r,w){
 if(w?.status!=='active'||![w.attacker,w.defender].includes(r))return [];
 const enemy=w.attacker===r?w.defender:w.attacker;
 return Object.keys(g.politics.realms).filter(id=>id!==r&&id!==enemy&&land(g,id)&&allied(g,r,id)&&allied(g,id,r)&&!allied(g,id,enemy)&&!nonAggression(g,id,enemy)&&!war(g,id,r)&&relation(g,id,r)>=25&&g.factions[id].treasury>=200&&!g.diplomacy?.aid[w.id+':'+id]&&!Object.values(g.diplomacy?.aid||{}).some(x=>x.donor===id&&x.until>g.turn&&g.conflict.wars[x.war]?.status==='active'));
}

function requestAid(g,r,w,id){
 const d=initDiplomacy(g);
 if(!aidOptions(g,r,w).includes(id))return no('Requires a willing allied realm with 200 gold, no conflicting treaties, and no prior aid in this war.');
 const enemy=w.attacker===r?w.defender:w.attacker;
 const available=Object.values(g.armies).filter(a=>a.owner===id&&!a.contingent&&!g.naval?.voyages[a.id]).reduce((n,a)=>n+troops(a),0);
 const strength=Math.min(100,Math.floor(available*.2));
 if(strength<10)return no('Ally has insufficient military reserves.');
 g.factions[id].treasury-=200;
 g.factions[r].treasury+=100;
 d.aid[w.id+':'+id]={war:w.id,realm:r,enemy,donor:id,strength,until:g.turn+18};
 note(g,r,g.factions[id].name+' committed campaign support and 100 gold.');
 return ok('Allied support secured for 18 months.');
}

export function callToArmsOptions(g,realm,w){
 if(w?.status!=='active'||![w.attacker,w.defender].includes(realm))return [];
 const enemy=w.attacker===realm?w.defender:w.attacker;
 const side=w.attacker===realm?'attacker':'defender';
 const already=new Set([w.attacker,w.defender,...(w.allies?.attacker||[]),...(w.allies?.defender||[])]);
 const guarantors=side==='defender'?guaranteePartners(g,realm,enemy):[];
 const coal=side==='defender'?coalitionPartners(g,realm,enemy):[];
 return Object.keys(g.politics?.realms||{}).filter(id=>{
  if(already.has(id)||!land(g,id)||war(g,id,realm)||war(g,id,enemy))return false;
  if(allied(g,id,enemy)||nonAggression(g,id,enemy)||(g.conflict?.truces?.[pair(id,enemy)]||0)>g.turn)return false;
  return (allied(g,realm,id)&&allied(g,id,realm))||guarantors.includes(id)||coal.includes(id);
 });
}

export function callToArms(g,world,realm,w,ally){
 if(!w||w.status!=='active'||![w.attacker,w.defender].includes(realm))return no('No active war for Call-to-Arms.');
 if(!callToArmsOptions(g,realm,w).includes(ally))return no('Ally is ineligible or barred by treaties/truces.');
 const side=w.attacker===realm?'attacker':'defender';
 const enemy=side==='attacker'?w.defender:w.attacker;
 const rel=relation(g,ally,realm);
 const ruler=alive(g,g.politics?.realms?.[ally]?.ruler);
 const traits=ruler?.traits||[];
 const threshold=side==='defender'?-15:15;
 const willing=rel>=threshold&&!(side==='attacker'&&traits.includes('cautious')&&g.factions[ally].treasury<300);
 if(!willing){
  // Refusing a Call-to-Arms breaks alliance and penalizes prestige/relations.
  if(g.factions[ally]?.treaties?.[realm]==='alliance')delete g.factions[ally].treaties[realm];
  if(g.factions[realm]?.treaties?.[ally]==='alliance')delete g.factions[realm].treaties[ally];
  g.factions[ally].prestige=Math.max(0,g.factions[ally].prestige-15);
  g.factions[realm].relations[ally]=cap(relation(g,realm,ally)-35,-100,100);
  note(g,realm,`${g.factions[ally].name} refused our Call-to-Arms.`);
  return no(`${g.factions[ally].name} declined the Call-to-Arms; alliance broken.`);
 }
 w.allies??={attacker:[],defender:[]};
 if(!w.allies[side].includes(ally))w.allies[side].push(ally);
 const d=initDiplomacy(g);
 // Dispatch field contingent if overland route exists and ally has funds, otherwise record logistical aid.
 const offer=world?.provinces?.length?fieldAidOptions(g,world,realm,w).find(o=>o.donor===ally):null;
 if(offer&&g.factions[ally].treasury>=200){
  dispatchFieldAid(g,realm,w,offer);
 }else{
  const key=w.id+':'+ally;
  const available=realmArmyCount(g,ally);
  const strength=Math.min(100,Math.max(15,Math.floor(available*.2)));
  d.aid[key]={war:w.id,realm,enemy,donor:ally,strength,until:g.turn+24};
 }
 note(g,realm,`${g.factions[ally].name} answered our Call-to-Arms against ${g.factions[enemy].name}!`);
 return ok(`${g.factions[ally].name} joined the war on your side.`);
}

export function triggerDefensiveCallToArms(g,world,w){
 if(!w||w.status!=='active')return [];
 const joined=[];
 for(const ally of callToArmsOptions(g,w.defender,w)){
  if(humanControlsRealm(g,ally))continue;
  const res=callToArms(g,world,w.defender,w,ally);
  if(res.ok)joined.push(ally);
 }
 return joined;
}

export function diplomacyAction(g,world,action,id,extra){
 const r=g.player,d=initDiplomacy(g),f=g.factions[r],o=g.factions[id];
 if(action==='access')return requestAccess(g,r,id);
 if(action==='pact')return sign(g,r,id,world);
 if(action==='alliance'){
  if(!o||r===id||id==='independent'||war(g,r,id))return no('Negotiate peace before seeking an alliance.');
  if(f.treaties?.[id]==='alliance')return no('Alliance already active.');
  const terms=allianceTerms(g,r,id,world);
  if(!terms.accepted)return {ok:false,msg:terms.reason,terms};
  f.treaties[id]='alliance';o.treaties[r]='alliance';
  note(g,r,'Alliance sealed with '+o.name+'.');
  return {ok:true,msg:'Alliance signed',terms};
 }
 if(action==='guarantee')return guarantee(g,r,id);
 if(action==='tribute')return demandTribute(g,r,id);
 if(action==='break-tribute')return breakTribute(g,r);
 if(action==='hostage')return exchangeHostage(g,r,id,extra);
 if(action==='release-hostage')return releaseHostage(g,id);
 if(action==='marriage-treaty')return signMarriageTreaty(g,r,id);
 if(action==='coalition-join')return joinCoalition(g,r,id);
 if(action==='coalition-leave')return leaveCoalition(g,r,id);
 if(action==='call-to-arms')return callToArms(g,world,r,g.conflict?.wars?.[id],extra);
 if(action==='field-aid'){
  const w=g.conflict.wars[id],offer=fieldAidOptions(g,world,r,w).find(x=>x.donor===extra);
  return offer?dispatchFieldAid(g,r,w,offer):no('Requires a willing ally with available troops and a controlled land route.');
 }
 if(action==='aid')return requestAid(g,r,g.conflict.wars[id],extra);
 if(action==='break'){
  const p=d.pacts[pair(r,id)];
  if(!p||p.until<=g.turn)return no('No active non-aggression agreement.');
  delete d.pacts[pair(r,id)];
  f.prestige=Math.max(0,f.prestige-15);
  f.legitimacy=cap(f.legitimacy-8,0,100);
  o.relations[r]=cap(relation(g,id,r)-30,-100,100);
  g.conflict.truces[pair(r,id)]=Math.max(g.conflict.truces[pair(r,id)]||0,g.turn+6);
  return ok('Agreement repudiated. Six-month withdrawal period begins.');
 }
 return no('Unknown diplomatic action.');
}

export function tickDiplomacy(g,world){
 const d=initDiplomacy(g);
 if(d.lastTick===g.turn)return;
 d.lastTick=g.turn;
 reconcilePassage(g,d);
 advanceFieldContingents(g,world);
 for(const [k,p] of Object.entries(d.pacts))if(p.until<=g.turn||p.members.some(id=>!land(g,id))||war(g,...p.members))delete d.pacts[k];
 for(const [k,p] of Object.entries(d.guarantees))if(p.until<=g.turn||!land(g,p.guarantor)||!land(g,p.protected)||war(g,p.guarantor,p.protected))delete d.guarantees[k];
 for(const [k,p] of Object.entries(d.aid))if(!g.conflict.wars[p.war]||g.conflict.wars[p.war].status!=='active')delete d.aid[k];

 // Monthly tribute transfers & hostage expiry.
 for(const [tid,t] of Object.entries(d.tributes)){
  if(t.until<=g.turn||!land(g,t.suzerain)||!land(g,t.tributary)||war(g,t.suzerain,t.tributary)){
   delete d.tributes[tid];continue;
  }
  const f=g.factions[t.tributary],suz=g.factions[t.suzerain];
  const due=Math.max(t.minGold||12,Math.min(60,Math.round((f.treasury>0?f.treasury*0.04:12))));
  if(f.treasury>=due){
   f.treasury-=due;suz.treasury+=due;t.defaulted=false;
  }else{
   t.defaulted=true;
  }
 }
 for(const [hid,h] of Object.entries(d.hostages)){
  if(h.status!=='active')continue;
  if(h.until<=g.turn||!alive(g,h.person)||!land(g,h.from)||!land(g,h.host)){
   h.status='released';h.ended=g.turn;
  }
 }
 for(const [target,c] of Object.entries(d.coalitions)){
  if(c.expires<=g.turn||!land(g,target)){delete d.coalitions[target];continue;}
  c.members=c.members.filter(id=>g.factions[id]&&land(g,id)&&!allied(g,id,target)&&!nonAggression(g,id,target));
  if(!c.members.length)delete d.coalitions[target];
 }
 if(g.turn%3===0){
  for(const r of Object.keys(d.threat))if(d.threat[r]>0)d.threat[r]=Math.max(0,d.threat[r]-1);
 }

 if(g.turn%6!==0)return;
 const neighborsByRealm=new Map();
 for(const p of world.provinces||[]){
  const r=controller(g,p.id);
  if(!r||!g.politics?.realms?.[r])continue;
  let set=neighborsByRealm.get(r);
  if(!set){set=new Set();neighborsByRealm.set(r,set);}
  for(const nid of p.neighbors||[]){
   const other=controller(g,nid);
   if(other&&other!==r&&g.politics?.realms?.[other])set.add(other);
  }
 }
 for(const r of Object.keys(g.politics.realms)){
  if(humanControlsRealm(g,r)||!land(g,r))continue;
  const f=g.factions[r];
  const w=Object.values(g.conflict.wars).find(w=>w.status==='active'&&[w.attacker,w.defender].includes(r));
  if(w){
   const expedition=fieldAidOptions(g,world,r,w).find(o=>!humanControlsRealm(g,o.donor));
   if(expedition)dispatchFieldAid(g,r,w,expedition);
   else{
    const id=aidOptions(g,r,w).find(id=>!humanControlsRealm(g,id));
    if(id)requestAid(g,r,w,id);
   }
   continue;
  }
  if(f.treasury<450||g.turn%12!==0)continue;
  const plan=g.strategy?.plans[r];
  const neighbors=[...(neighborsByRealm.get(r)||[])].filter(id=>!humanControlsRealm(g,id)&&!war(g,r,id));
  if(['recover','defend','diplomacy'].includes(plan?.goal)){
   const id=neighbors.find(id=>relation(g,id,r)>=15&&!nonAggression(g,r,id)&&!allied(g,r,id));
   if(id)sign(g,r,id);
  }else if(plan?.goal==='prosper'){
   const id=neighbors.find(id=>relation(g,id,r)>=35&&relation(g,r,id)>=35&&!d.guarantees[r+':'+id]);
   if(id)guarantee(g,r,id);
  }
  // Coalition response against high-threat aggressors.
  for(const n of neighbors){
   if(diplomaticThreat(g,n)>=35&&!allied(g,r,n)&&!nonAggression(g,r,n)&&relation(g,r,n)<10){
    joinCoalition(g,r,n);
   }
  }
 }
}
