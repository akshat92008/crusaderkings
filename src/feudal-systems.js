import {humanControlsRealm} from './player-career.js';
import {amendEstateCharter,tickEstateCharters,estateLaw} from './estate-succession.js';
import {partitionRepresentatives} from './succession-systems.js';
import {councilPermission,triggerTitleRevolt} from './political-conflict.js';
import {regencyView} from './regency-systems.js';
import {removePoliticalCharacter} from './dynastic-politics.js';
import {recordGrievance,rememberBereavement} from './character-agency.js';
import {changeOpinion} from './chronicle-systems.js';
// 5-tier landed title hierarchy (empire, kingdom, duchy, county, barony) with de jure / de facto separation.
// Provincial holders remain authoritative in g.politics.holdings.
import {controller} from './campaign-war.js';

const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=(msg,extra={})=>({ok:true,msg,...extra}),no=(msg,extra={})=>({ok:false,msg,...extra});
const ruler=(g,realm)=>g.politics.people[g.politics.realms[realm]?.ruler];
const live=(g,id)=>g.politics.people[id]?.alive?g.politics.people[id]:null;
const holdings=(g,realm)=>Object.entries(g.politics.holdings).filter(([id,h])=>h.realm===realm&&g.provinces[id]?.owner===realm);

export const TITLE_TIERS=['barony','county','duchy','kingdom','empire'];
export const TIER_RANK={barony:1,province:2,county:2,regional:3,duchy:3,crown:4,kingdom:4,empire:5};
export const BARONY_TYPES=['castle','city','temple'];

export function titleTier(t){
 if(!t)return null;
 if(t.feudalTier)return t.feudalTier;
 if(t.tier==='crown')return 'kingdom';
 if(t.tier==='regional')return 'duchy';
 if(t.tier==='province')return 'county';
 return t.tier;
}
export function titleRank(t){return t?(t.rank||TIER_RANK[t.feudalTier||t.tier]||0):0;}

function note(g,realm,message){
 const f=g.feudal;
 f.history.unshift({realm,turn:g.turn,message});
 f.history=f.history.slice(0,150);
 if(realm===g.player){
  g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});
  g.log=g.log.slice(0,45);
 }
}
export function isImprisoned(g,id){return !!g.feudal?.prisoners?.[id]&&g.feudal.prisoners[id].status==='held';}

function districts(world){
 const by=new Map(world.provinces.map(p=>[p.id,p])),remaining=new Set(by.keys()),out={};
 for(const p of world.provinces){
  if(!remaining.delete(p.id))continue;
  const members=[p.id];
  for(let i=0;i<members.length&&members.length<4;i++){
   for(const id of by.get(members[i])?.neighbors||[]){
    if(members.length>=4)break;
    if(by.get(id)?.owner===p.owner&&remaining.delete(id))members.push(id);
   }
  }
  out['d:'+p.id]={id:'d:'+p.id,name:(p.name||p.id)+' district',deJureRealm:p.owner,members};
 }
 return out;
}

function ensureFeudalFields(f){
 f.titles??={};
 f.prisoners??={};
 f.claimants??={};
 f.history??=[];
 f.baronies??={};
 f.customTitles??={};
 f.destroyedTitles??={};
 f.vassalTransfers??={};
 f.titleLaws??={};
 f.countyDeJure??={};
 f.tyranny??={};
 f.lastTick??=-1;
 return f;
}

export function initFeudal(g,world){
 const saved=g.feudal;
 if(saved?.version===3)return ensureFeudalFields(saved);
 if(saved?.version===2){
  ensureFeudalFields(saved);
  saved.version=3;
  syncTitles(g);
  return saved;
 }
 if(saved?.version===1){
  const atlasOwners=new Map(world.provinces.map(p=>[p.id,p.owner]));
  for(const d of Object.values(saved.districts))d.deJureRealm=atlasOwners.get(d.members[0])??null;
  ensureFeudalFields(saved);
  saved.version=3;
  syncTitles(g);
  return saved;
 }
 const f=g.feudal=ensureFeudalFields({version:3,districts:districts(world),titles:{},prisoners:{},claimants:{},history:[],lastTick:-1});
 syncTitles(g);
 return f;
}

function validTransferLiege(g,realm,vassalId,targetLiegeId,vassalRank,transfers,rankByPerson){
 if(!targetLiegeId||targetLiegeId===vassalId)return null;
 const liege=live(g,targetLiegeId);
 if(!liege||liege.realm!==realm||isImprisoned(g,targetLiegeId))return null;
 if((rankByPerson.get(targetLiegeId)||0)<=vassalRank)return null;
 // Prevent circular liege loops by walking up the candidate chain.
 const seen=new Set([vassalId]);
 let cur=targetLiegeId,steps=0;
 while(cur&&steps<12){
  if(seen.has(cur))return null;
  seen.add(cur);
  cur=transfers['lord:'+cur]||null;
  steps++;
 }
 return targetLiegeId;
}

export function resolveTitle(g,id){
 const f=g.feudal;
 if(!f||!id)return null;
 if(f.titles[id])return f.titles[id];
 if(id.startsWith('d:')&&!id.includes(':',2)){
  const prefix=id+':';
  return Object.values(f.titles).find(t=>t.id.startsWith(prefix))||null;
 }
 return null;
}

export function syncTitles(g){
 const f=g.feudal;
 if(!f)return;
 ensureFeudalFields(f);
 const next={};
 const realms=g.politics?.realms||{};

 // 1. Empires (explicitly created or imperial polities unless destroyed).
 const empireByRealm=new Map();
 for(const [id,ct] of Object.entries(f.customTitles)){
  if(ct.feudalTier!=='empire'||f.destroyedTitles[id])continue;
  const h=live(g,ct.holder);
  const realm=ct.realm&&realms[ct.realm]?ct.realm:h?.realm;
  if(!realm||!realms[realm])continue;
  const holder=h&&h.realm===realm?h.id:realms[realm].ruler;
  ct.holder=holder;ct.realm=realm;
  const laws=f.titleLaws[id]||{};
  next[id]={
   id,tier:'empire',feudalTier:'empire',rank:5,
   realm,deJureRealm:ct.deJureRealm||realm,deJureParent:null,deFactoLiege:null,parent:null,
   holder,name:ct.name||(g.factions[realm]?.name+' Empire'),members:[...(ct.members||['k:'+realm])],
   successionLaw:laws.successionLaw||ct.successionLaw||null,
   genderLaw:laws.genderLaw||ct.genderLaw||null,
   faithLaw:laws.faithLaw||ct.faithLaw||null
  };
  for(const k of next[id].members)empireByRealm.set(k.replace(/^k:/,''),id);
 }
 for(const [realm,s] of Object.entries(realms)){
  const eId='e:'+realm;
  if(!next[eId]&&!f.destroyedTitles[eId]&&g.civic?.realms?.[realm]?.government==='imperial'){
   const laws=f.titleLaws[eId]||{};
   next[eId]={
    id:eId,tier:'empire',feudalTier:'empire',rank:5,
    realm,deJureRealm:realm,deJureParent:null,deFactoLiege:null,parent:null,
    holder:s.ruler,name:(g.factions[realm]?.name||realm)+' Empire',members:['k:'+realm],
    successionLaw:laws.successionLaw||null,genderLaw:laws.genderLaw||null,faithLaw:laws.faithLaw||null
   };
   empireByRealm.set(realm,eId);
  }
 }

 // 2. Kingdoms (canonical k:<realm> + custom/secondary kingdoms).
 for(const [realm,s] of Object.entries(realms)){
  const kId='k:'+realm,eId=empireByRealm.get(realm)||null;
  const eHolder=eId?next[eId]?.holder:null;
  const laws=f.titleLaws[kId]||{};
  next[kId]={
   id:kId,tier:'crown',feudalTier:'kingdom',rank:4,
   realm,deJureRealm:realm,deJureParent:eId,
   deFactoLiege:eHolder&&eHolder!==s.ruler?eHolder:null,
   parent:eId,holder:s.ruler,name:g.factions[realm]?.name||realm,
   successionLaw:laws.successionLaw||null,genderLaw:laws.genderLaw||null,faithLaw:laws.faithLaw||null
  };
 }
 for(const [id,ct] of Object.entries(f.customTitles)){
  if(ct.feudalTier!=='kingdom'||f.destroyedTitles[id]||next[id])continue;
  const realm=ct.realm&&realms[ct.realm]?ct.realm:null;
  if(!realm)continue;
  const h=live(g,ct.holder);
  const holder=h&&h.realm===realm?h.id:realms[realm].ruler;
  ct.holder=holder;
  const eId=empireByRealm.get(realm)||ct.deJureParent||null;
  const eHolder=eId?next[eId]?.holder:null;
  const laws=f.titleLaws[id]||{};
  next[id]={
   id,tier:'crown',feudalTier:'kingdom',rank:4,
   realm,deJureRealm:ct.deJureRealm||realm,deJureParent:eId,
   deFactoLiege:eHolder&&eHolder!==holder?eHolder:(holder!==realms[realm].ruler?realms[realm].ruler:null),
   parent:eId,holder,name:ct.name||id,members:[...(ct.members||[])],
   successionLaw:laws.successionLaw||ct.successionLaw||null,
   genderLaw:laws.genderLaw||ct.genderLaw||null,
   faithLaw:laws.faithLaw||ct.faithLaw||null
  };
 }

 // 3. Duchies (d:<id>:<realm>) and Counties (c:<prov>) and Baronies (b:<prov>:castle|city|temple).
 const rankByPerson=new Map();
 for(const t of Object.values(next))rankByPerson.set(t.holder,Math.max(rankByPerson.get(t.holder)||0,t.rank));

 for(const d of Object.values(f.districts||{})){
  const activeRealms=new Set(d.members.map(id=>g.politics.holdings[id]?.realm).filter(r=>r&&realms[r]));
  for(const realm of activeRealms){
   const members=d.members.filter(id=>g.politics.holdings[id]?.realm===realm&&g.provinces[id]?.owner===realm);
   if(!members.length)continue;
   const id=d.id+':'+realm;
   const destroyed=Boolean(f.destroyedTitles[id]||f.destroyedTitles[d.id]);
   const old=f.titles[id];
   const lords=[...new Set(members.map(p=>g.politics.holdings[p].lord))].filter(c=>live(g,c));
   const holder=lords.includes(old?.holder)?old.holder:(lords.sort((a,b)=>members.filter(p=>g.politics.holdings[p].lord===b).length-members.filter(p=>g.politics.holdings[p].lord===a).length||a.localeCompare(b))[0]||realms[realm].ruler);
   const crownId='k:'+realm;
   if(!destroyed){
    const dLaws=f.titleLaws[id]||f.titleLaws[d.id]||{};
    const transferLiege=f.vassalTransfers[id];
    const deFactoLiege=transferLiege&&live(g,transferLiege)?.realm===realm&&transferLiege!==holder?transferLiege:(holder===realms[realm].ruler?next[crownId].deFactoLiege:realms[realm].ruler);
    next[id]={
     id,tier:'regional',feudalTier:'duchy',rank:3,
     realm,deJureRealm:d.deJureRealm,deJureParent:d.deJureRealm?'k:'+d.deJureRealm:null,
     deFactoLiege,parent:crownId,holder,name:d.name,members,
     successionLaw:dLaws.successionLaw||null,genderLaw:dLaws.genderLaw||null,faithLaw:dLaws.faithLaw||null
    };
    rankByPerson.set(holder,Math.max(rankByPerson.get(holder)||0,3));
   }
   for(const p of members){
    const cId='c:'+p,h=g.politics.holdings[p],cLaws=f.titleLaws[cId]||{};
    const parentId=destroyed?crownId:id;
    const defaultLiege=h.lord===realms[realm].ruler?next[crownId].deFactoLiege:(!destroyed&&next[id].holder!==h.lord&&next[id].holder!==realms[realm].ruler?next[id].holder:realms[realm].ruler);
    const transferred=f.vassalTransfers[cId];
    const validLiege=transferred&&transferred!==h.lord&&live(g,transferred)?.realm===realm&&(rankByPerson.get(transferred)||0)>2?transferred:defaultLiege;
    const countyDeJure=f.countyDeJure?.[p]||g.deepSystems?.deJureOverrides?.[p]||d.deJureRealm;
    next[cId]={
     id:cId,tier:'province',feudalTier:'county',rank:2,
     realm,deJureRealm:countyDeJure,deJureParent:countyDeJure===d.deJureRealm?d.id:'k:'+countyDeJure,
     deFactoLiege:validLiege,holder:h.lord,parent:parentId,name:p,province:p,
     successionLaw:cLaws.successionLaw||null,genderLaw:cLaws.genderLaw||null,faithLaw:cLaws.faithLaw||null
    };
    rankByPerson.set(h.lord,Math.max(rankByPerson.get(h.lord)||0,2));
    // Subordinate barony holdings (b:<prov>:castle|city|temple)
    for(const kind of BARONY_TYPES){
     const bId='b:'+p+':'+kind;
     const bRec=f.baronies[bId]??={id:bId,province:p,kind,realm,holder:h.lord,wealth:0,tax:1,levy:1};
     bRec.realm=realm;
     if(!live(g,bRec.holder)||g.politics.people[bRec.holder].realm!==realm)bRec.holder=h.lord;
     const bLaws=f.titleLaws[bId]||{};
     const bTransfer=f.vassalTransfers[bId];
     const bLiege=bTransfer&&bTransfer!==bRec.holder&&live(g,bTransfer)?.realm===realm&&(rankByPerson.get(bTransfer)||0)>1?bTransfer:(bRec.holder===h.lord?validLiege:h.lord);
     next[bId]={
      id:bId,tier:'barony',feudalTier:'barony',rank:1,baronyType:kind,
      realm,deJureRealm:countyDeJure,deJureParent:cId,
      deFactoLiege:bLiege,holder:bRec.holder,parent:cId,name:p+' '+kind,province:p,
      successionLaw:bLaws.successionLaw||null,genderLaw:bLaws.genderLaw||null,faithLaw:bLaws.faithLaw||null
     };
    }
   }
  }
 }
 // Clean up baronies whose province became independent/unowned.
 for(const bId of Object.keys(f.baronies)){
  if(!next[bId])delete f.baronies[bId];
 }
 f.titles=next;
}

export function titleList(g,realm){return Object.values(g.feudal?.titles||{}).filter(t=>t.realm===realm);}
export function characterTitles(g,id){return Object.values(g.feudal?.titles||{}).filter(t=>t.holder===id);}
export function characterRank(g,id){
 const titles=characterTitles(g,id);
 if(!titles.length)return {rank:0,tier:'landless',label:'Landless',title:null};
 const sorted=titles.slice().sort((a,b)=>titleRank(b)-titleRank(a)||a.id.localeCompare(b.id));
 const top=sorted[0],rank=titleRank(top),tier=titleTier(top);
 const labels={empire:'Emperor',kingdom:'King',duchy:'Duke',county:'Count',barony:'Baron'};
 return {rank,tier,label:labels[tier]||'Lord',title:top};
}

export function regionalLoyalty(g,province){
 const c=g.feudal?.titles['c:'+province],d=g.feudal?.titles[c?.parent];
 if(!d||d.tier!=='regional'||d.holder===g.politics.realms[d.realm]?.ruler||isImprisoned(g,d.holder))return 0;
 const v=d.members.map(id=>[id,g.politics.holdings[id]]).filter(([,h])=>h?.lord===d.holder);
 if(!v.length)return 0;
 return cap((v.reduce((n,[,h])=>n+h.loyalty,0)/v.length-55)*.18,-8,8);
}

// Claim management: Strong vs Weak claims with enforcement rules.
export function addClaim(g,personId,realm,opts={}){
 if(!g.feudal||!personId||!realm)return null;
 ensureFeudalFields(g.feudal);
 const titleId=opts.titleId||('k:'+realm);
 const key=opts.titleId?titleId+':'+personId:realm+':'+personId;
 const strength=opts.strength==='weak'?'weak':'strong';
 const existing=g.feudal.claimants[key];
 if(existing&&existing.strength==='strong'&&strength==='weak')return existing;
 const rec={
  id:key,realm,titleId,person:personId,from:opts.from||null,
  created:g.turn,strength,heritable:opts.heritable??(strength==='strong')
 };
 g.feudal.claimants[key]=rec;
 const p=g.politics?.people?.[personId];
 if(p&&!p.claims?.includes(realm)){p.claims??=[];p.claims.push(realm);}
 return rec;
}

export function canEnforceClaim(g,realm,claim){
 if(!claim)return false;
 const strength=claim.strength||'strong';
 if(strength==='strong')return true;
 // Weak claims may only be pressed if holder is minor, incapacitated, imprisoned, regency, gender-disfavored, or succession crisis is active.
 const s=g.politics?.realms?.[realm];
 const t=claim.titleId?g.feudal?.titles?.[claim.titleId]:g.feudal?.titles?.['k:'+realm];
 const holderId=t?.holder||s?.ruler;
 const holder=live(g,holderId);
 if(!holder)return true;
 if(holder.age<18||holder.incapacitated||isImprisoned(g,holder.id)||regencyView(g,realm))return true;
 if(s?.claimantCrisis?.active)return true;
 const genderLaw=t?.genderLaw||s?.genderLaw||'equal';
 if(genderLaw==='male_preference'&&holder.sex==='female')return true;
 if(genderLaw==='female_preference'&&holder.sex==='male')return true;
 if(Object.values(g.conflict?.factions||{}).some(f=>f.realm===realm&&f.kind==='claimant'&&f.status==='civil war'))return true;
 return false;
}

export function partitionInheritance(g,realm,deceased,primary){
 if(!g.feudal)return;
 ensureFeudalFields(g.feudal);
 const s=g.politics.realms[realm],heirs=partitionRepresentatives(g,deceased).filter(c=>c.id!==primary.id);
 const law=g.feudal.titles['k:'+realm]?.successionLaw||s.law;
 const effectiveLaw=law==='gavelkind'?'partition':law;
 if(effectiveLaw!=='elective'){
  let idx=0;
  for(const c of heirs){
   addClaim(g,c.id,realm,{titleId:'k:'+realm,from:deceased.id,strength:idx===0?'strong':'weak',heritable:idx===0});
   idx++;
  }
 }
 const crown=holdings(g,realm).filter(([id,h])=>h.lord===deceased.id&&estateLaw(g,id)==='customary').sort(([a],[b])=>a.localeCompare(b));
 const available=heirs.filter(c=>!isImprisoned(g,c.id));
 if(effectiveLaw==='partition'&&available.length){
  let i=0;
  for(const [id,h] of crown){
   h.lord=i===0?primary.id:available[(i-1)%available.length].id;
   h.loyalty=65;
   i++;
  }
  // Also distribute secondary duchies held by the deceased under partition/gavelkind.
  const duchies=Object.values(g.feudal.titles).filter(t=>t.realm===realm&&t.tier==='regional'&&t.holder===deceased.id).sort((a,b)=>a.id.localeCompare(b.id));
  let di=0;
  for(const d of duchies){
   const recipient=di===0?primary:available[(di-1)%available.length];
   if(recipient){d.holder=recipient.id;if(di>0)addClaim(g,primary.id,realm,{titleId:d.id,from:deceased.id,strength:'weak'});}
   di++;
  }
  if(crown.length>1)note(g,realm,'Partition distributed '+crown.length+' crown holdings among the heirs.');
 }else{
  for(const [,h] of crown){h.lord=primary.id;h.loyalty=65;}
 }
 // Also transfer baronies held directly by deceased (if not overridden by county lord)
 for(const b of Object.values(g.feudal.baronies)){
  if(b.realm===realm&&b.holder===deceased.id){
   const countyLord=g.politics.holdings[b.province]?.lord;
   b.holder=countyLord||primary.id;
  }
 }
 syncTitles(g);
}

export function claimantCandidates(g,realm){
 const r=ruler(g,realm);
 return Object.values(g.feudal?.claimants||{}).filter(x=>
  x.realm===realm&&x.person!==r?.id&&live(g,x.person)?.realm===realm&&
  !isImprisoned(g,x.person)&&g.turn-x.created<180&&canEnforceClaim(g,realm,x)
 );
}

export function installClaimant(g,realm,id){
 const c=claimantCandidates(g,realm).find(c=>c.person===id),next=live(g,id),s=g.politics.realms[realm];
 if(!c||!next||!s)return false;
 const old=ruler(g,realm);
 s.ruler=id;
 delete g.feudal.claimants[realm+':'+id];
 delete g.feudal.claimants['k:'+realm+':'+id];
 addClaim(g,old.id,realm,{titleId:'k:'+realm,from:id,strength:'strong',heritable:true});
 for(const [role,person] of Object.entries(s.council))if(person===id)s.council[role]=old.id;
 s.regent=next.age<18?(s.council.chancellor||null):null;
 if(g.kingdom?.courts?.[realm]){
  g.kingdom.courts[realm].successions++;
  g.kingdom.courts[realm].dynasty=next.house;
  g.kingdom.courts[realm].ruler={name:next.name,age:next.age,...next.skills};
 }
 for(const [,h] of holdings(g,realm))if(h.lord===old.id){h.lord=id;h.loyalty=65;}
 syncTitles(g);
 note(g,realm,next.name+' took the crown after the claimant settlement.');
 return true;
}

export function capturePrisoner(g,captor,id,reason='battle'){
 const p=live(g,id);
 if(!g.feudal||!p||!g.politics.realms[captor]||p.age<18||ruler(g,p.realm)?.id===id||isImprisoned(g,id))return false;
 g.feudal.prisoners[id]={person:id,captor,realm:p.realm,reason,started:g.turn,status:'held'};
 for(const a of Object.values(g.military?.armies||{}))if(a.commander===id)a.commander=null;
 note(g,captor,p.name+' was imprisoned ('+reason+').');
 return true;
}
export function captureCommander(g,captor,army){
 const id=g.military?.armies[army?.id]?.commander;
 return id&&captor!==army.owner&&live(g,id)?.realm===army.owner?capturePrisoner(g,captor,id,'war captive'):false;
}
function release(g,x){x.status='released';x.ended=g.turn;}
function prisonerValue(g,p){
 const offices=g.politics.realms[p.realm]?.council||{};
 const estateCount=holdings(g,p.realm).filter(([,h])=>h.lord===p.id).length;
 return 100+(Object.values(offices).includes(p.id)?35:0)+15*Math.min(3,estateCount);
}
export function prisonerExchangeOptions(g,realm,offeredId){
 const held=g.feudal?.prisoners||{},offered=held[offeredId],person=live(g,offeredId);
 if(offered?.status!=='held'||offered.captor!==realm||!person||person.realm===realm)return [];
 const partner=person.realm;
 if(!g.factions[partner]||!g.factions[realm])return [];
 const given=prisonerValue(g,person);
 return Object.values(held).filter(x=>x.status==='held'&&x.captor===partner&&live(g,x.person)?.realm===realm)
  .map(x=>{
   const returning=live(g,x.person);
   return {id:x.person,partner,gold:Math.max(0,prisonerValue(g,returning)-given)};
  }).sort((a,b)=>a.gold-b.gold||a.id.localeCompare(b.id));
}
function exchangePrisoners(g,realm,offeredId,requestedId){
 const exchange=prisonerExchangeOptions(g,realm,offeredId).find(x=>x.id===requestedId);
 if(!exchange)return no('An exchange requires a living prisoner from each realm held by the other.');
 const payer=g.factions[realm],foreign=g.factions[exchange.partner];
 if(payer.treasury<exchange.gold)return no('Requires '+exchange.gold+' gold to balance the exchange.');
 payer.treasury-=exchange.gold;
 foreign.treasury+=exchange.gold;
 for(const id of [offeredId,requestedId]){
  release(g,g.feudal.prisoners[id]);
  g.feudal.prisoners[id].resolution='exchange';
 }
 note(g,realm,live(g,requestedId).name+' returned in a prisoner exchange with '+foreign.name+'.');
 return ok('The prisoners were exchanged'+(exchange.gold?' for '+exchange.gold+' gold.':'.'));
}
function ransom(g,x){
 const p=live(g,x.person),f=g.factions[x.captor];
 if(!p||!f)return no('Prisoner unavailable.');
 const estates=holdings(g,x.realm).filter(([,h])=>h.lord===p.id),amount=100,wealth=p.wealth+estates.reduce((n,[,h])=>n+h.wealth,0);
 if(wealth<amount)return no('Prisoner and estates cannot afford 100 gold.');
 let due=amount,take=Math.min(due,p.wealth);
 p.wealth-=take;due-=take;
 for(const [,h] of estates){take=Math.min(due,h.wealth);h.wealth-=take;due-=take;}
 f.treasury+=amount;release(g,x);
 return ok('Prisoner ransomed for 100 gold.');
}

function closeKinIds(g,person){
 if(!person)return [];
 const out=new Set([person.spouse,...(person.spouses||[]),...(person.children||[]),...(person.parents||[]),...(person.siblings||[])].filter(Boolean));
 const parents=new Set(person.parents||[]);
 if(parents.size){
  for(const other of Object.values(g.politics?.people||{})){
   if(other?.id!==person.id&&other?.alive&&(other.parents||[]).some(pid=>parents.has(pid)))out.add(other.id);
  }
 }
 out.delete(person.id);
 return [...out].filter(id=>live(g,id));
}

export function executePrisoner(g,world,realm,prisonerId,opts={}){
 const f=initFeudal(g,world),x=f.prisoners[prisonerId];
 if(!x||x.captor!==realm||x.status!=='held')return no('Select a held prisoner in your dungeon.');
 const victim=g.politics?.people?.[prisonerId];
 if(!victim?.alive){
  x.status='executed';x.ended=g.turn;x.resolution='executed';
  return no('Prisoner is already deceased.');
 }
 const r=ruler(g,realm),nation=g.factions?.[realm];
 const justified=Boolean(opts.justified||victim.traitorUntil>g.turn||x.reason==='civil war rebellion');
 const kinIds=closeKinIds(g,victim).filter(id=>id!==r?.id);
 const adultHeirIds=kinIds.filter(id=>(victim.children||[]).includes(id)&&live(g,id)?.age>=16);

 x.status='executed';x.ended=g.turn;x.resolution='executed';x.executedBy=r?.id||realm;
 victim.deathReason='executed';victim.executedBy=r?.id||realm;
 const remover=opts.removeCharacter||removePoliticalCharacter;
 if(typeof remover==='function')remover(g,world,prisonerId);
 victim.alive=false;victim.deathYear??=g.year;
 rememberBereavement(g,victim,kinIds);

 if(!justified){
  f.tyranny[realm]=(f.tyranny[realm]||0)+15;
  if(nation){
   nation.legitimacy=cap((nation.legitimacy||50)-10,0,100);
   nation.prestige=Math.max(0,(nation.prestige||0)-5);
  }
  for(const [,vh] of holdings(g,realm)){
   if(vh.lord!==r?.id&&!kinIds.includes(vh.lord))vh.loyalty=cap(vh.loyalty-12,0,100);
  }
 }

 const revengeVowed=[];
 for(const kid of kinIds){
  const kp=live(g,kid);
  if(!kp)continue;
  if(r?.id){
   recordGrievance(g,kid,r.id,'executed kin',60,{permanent:true});
   if(g.chronicles)changeOpinion(g,kid,r.id,-55);
  }
  for(const [,vh] of Object.entries(g.politics?.holdings||{})){
   if(vh.lord===kid)vh.loyalty=cap((vh.loyalty||50)-30,0,100);
  }
  kp.memories??=[];kp.memories.push((r?.name||realm)+' executed '+victim.name+' in '+g.year+'.');
  if(adultHeirIds.includes(kid)||kp.realm===realm)revengeVowed.push(kp.name||kid);
 }

 const warn=revengeVowed.length?' Kin vowed vengeance ('+revengeVowed.slice(0,2).join(', ')+').':'';
 note(g,realm,(r?.name||realm)+' executed prisoner '+victim.name+(justified?' (justified).':' (tyrannical).')+warn);
 if(revengeVowed.length&&realm===g.player){
  g.log?.unshift({date:(g.year||1450)+' · month '+((g.month||0)+1),text:'Warning: '+revengeVowed[0]+' vowed vengeance over the execution of '+victim.name+'!'});
  if(g.log?.length>45)g.log.length=45;
 }
 syncTitles(g);
 return ok('Executed '+victim.name+'.'+warn,{executed:victim.id,tyranny:justified?0:15,bereaved:kinIds,revengeVowed});
}

// Title management actions: createTitle, usurpTitle, destroyTitle, revokeTitle, transferVassal.
export function createTitle(g,world,realm,titleId,opts={}){
 const f=initFeudal(g,world),nation=g.factions[realm],r=ruler(g,realm);
 if(!nation||!r?.alive)return no('Invalid realm.');
 const owned=holdings(g,realm).map(([id])=>id);
 if(titleId.startsWith('e:')){
  if(f.titles[titleId]&&!f.destroyedTitles[titleId])return no('Empire title already exists.');
  const kingdoms=Object.values(f.titles).filter(t=>titleTier(t)==='kingdom'&&t.holder===r.id).length;
  if(!opts.force&&owned.length<10&&kingdoms<2)return no('Forming an empire requires at least 10 provinces or 2 kingdom titles.');
  const cost=opts.free?0:500;
  if(nation.treasury<cost||nation.legitimacy<60)return no('Requires 500 gold and 60 legitimacy.');
  nation.treasury-=cost;nation.prestige+=100;
  delete f.destroyedTitles[titleId];
  f.customTitles[titleId]={id:titleId,feudalTier:'empire',realm,deJureRealm:realm,holder:r.id,name:opts.name||(nation.name+' Empire'),members:['k:'+realm]};
  syncTitles(g);
  note(g,realm,'The Empire of '+nation.name+' was proclaimed.');
  return ok('Empire title created.',{titleId});
 }
 if(titleId.startsWith('k:')){
  if(f.titles[titleId]&&!f.destroyedTitles[titleId])return no('Kingdom title already exists.');
  const deJure=titleId.slice(2);
  const deJureProvs=Object.values(f.districts||{}).filter(d=>d.deJureRealm===deJure).flatMap(d=>d.members);
  const controlled=deJureProvs.length?deJureProvs.filter(id=>g.provinces[id]?.owner===realm):owned;
  if(!opts.force&&(deJureProvs.length?controlled.length<=deJureProvs.length/2:owned.length<4))return no('Requires controlling more than half of the kingdom’s de jure provinces.');
  const cost=opts.free?0:300;
  if(nation.treasury<cost)return no('Requires 300 gold.');
  nation.treasury-=cost;nation.prestige+=50;
  delete f.destroyedTitles[titleId];
  f.customTitles[titleId]={id:titleId,feudalTier:'kingdom',realm,deJureRealm:deJure,holder:r.id,name:opts.name||('Kingdom of '+deJure),members:controlled};
  syncTitles(g);
  note(g,realm,'Created kingdom title '+titleId+'.');
  return ok('Kingdom title created.',{titleId});
 }
 if(titleId.startsWith('d:')){
  const baseId=titleId.split(':').slice(0,2).join(':');
  const d=f.districts?.[baseId];
  if(!d)return no('Unknown duchy district.');
  const fullId=baseId+':'+realm;
  if(f.titles[fullId]&&!f.destroyedTitles[fullId]&&!f.destroyedTitles[baseId])return no('Duchy title already exists.');
  const held=d.members.filter(id=>g.provinces[id]?.owner===realm&&controller(g,id)===realm);
  if(!opts.force&&held.length<Math.ceil(d.members.length/2))return no('Requires controlling at least half of the duchy’s provinces.');
  const cost=opts.free?0:150;
  if(nation.treasury<cost)return no('Requires 150 gold.');
  nation.treasury-=cost;nation.prestige+=25;
  delete f.destroyedTitles[fullId];delete f.destroyedTitles[baseId];
  syncTitles(g);
  if(f.titles[fullId])f.titles[fullId].holder=opts.holder||r.id;
  note(g,realm,'Created duchy '+d.name+'.');
  return ok('Duchy title created.',{titleId:fullId});
 }
 return no('Specify an empire (e:), kingdom (k:), or duchy (d:) title.');
}

export function usurpTitle(g,world,realm,titleId,opts={}){
 const f=initFeudal(g,world),nation=g.factions[realm],r=ruler(g,realm),t=resolveTitle(g,titleId);
 if(!nation||!r?.alive||!t||t.realm===realm)return no('Select a foreign title to usurp.');
 const tier=titleTier(t);
 if(!['duchy','kingdom','empire'].includes(tier))return no('Only duchies, kingdoms, and empires can be usurped.');
 if(!opts.force&&Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&((w.attacker===realm&&w.defender===t.realm)||(w.defender===realm&&w.attacker===t.realm))))return no('Cannot usurp titles while at war with the holder.');
 let required=0,controlled=0;
 if(tier==='duchy'){
  const base=t.id.split(':').slice(0,2).join(':'),members=f.districts?.[base]?.members||t.members||[];
  required=Math.floor(members.length/2)+1;
  controlled=members.filter(id=>g.provinces[id]?.owner===realm&&controller(g,id)===realm).length;
 }else{
  const deJure=t.deJureRealm||t.realm;
  const members=Object.values(f.districts||{}).filter(d=>d.deJureRealm===deJure).flatMap(d=>d.members);
  required=Math.floor(members.length/2)+1;
  controlled=members.filter(id=>g.provinces[id]?.owner===realm&&controller(g,id)===realm).length;
 }
 if(!opts.force&&controlled<required)return no('Must control more than 50% of the de jure provinces to usurp.');
 const cost=opts.free?0:tier==='empire'?500:tier==='kingdom'?300:150;
 if(nation.treasury<cost)return no('Requires '+cost+' gold to usurp.');
 nation.treasury-=cost;nation.prestige+=tier==='empire'?80:tier==='kingdom'?40:20;
 const oldHolder=t.holder,oldRealm=t.realm;
 if(oldHolder)addClaim(g,oldHolder,realm,{titleId:t.id,strength:'strong',from:r.id,heritable:true});
 if(tier==='kingdom'||tier==='empire'){
  f.customTitles[t.id]={id:t.id,feudalTier:tier,realm,deJureRealm:t.deJureRealm||oldRealm,holder:r.id,name:t.name,members:t.members||[]};
  t.realm=realm;t.holder=r.id;
 }else{
  const base=t.id.split(':').slice(0,2).join(':'),newId=base+':'+realm;
  delete f.titles[t.id];
  syncTitles(g);
  if(f.titles[newId])f.titles[newId].holder=r.id;
 }
 note(g,realm,r.name+' usurped '+t.name+' from '+oldRealm+'.');
 return ok('Title usurped.');
}

export function destroyTitle(g,world,realm,titleId){
 const f=initFeudal(g,world),nation=g.factions[realm],r=ruler(g,realm),t=resolveTitle(g,titleId);
 if(!nation||!r?.alive||!t||t.realm!==realm||t.holder!==r.id)return no('You must personally hold the title to destroy it.');
 const tier=titleTier(t);
 if(!['duchy','kingdom','empire'].includes(tier)||t.id==='k:'+realm)return no('Cannot destroy your primary kingdom, county, or barony.');
 const cost=tier==='empire'?150:tier==='kingdom'?100:50;
 if(nation.prestige<cost)return no('Requires '+cost+' prestige to destroy this title.');
 nation.prestige-=cost;
 f.destroyedTitles[t.id]=true;
 if(tier==='duchy')f.destroyedTitles[t.id.split(':').slice(0,2).join(':')]=true;
 delete f.customTitles[t.id];
 for(const [,h] of holdings(g,realm)){
  if(tier==='duchy'&&t.members?.includes(h.province||''))h.loyalty=cap(h.loyalty-15,0,100);
 }
 if(tier==='duchy'){
  for(const pid of t.members||[]){
   const h=g.politics.holdings[pid];
   if(h&&h.realm===realm&&h.lord!==r.id)h.loyalty=cap(h.loyalty-15,0,100);
  }
 }
 syncTitles(g);
 note(g,realm,r.name+' destroyed the title '+t.name+'.');
 return ok('Title destroyed.');
}

export function revokeTitle(g,world,realm,titleId,opts={}){
 const f=initFeudal(g,world),nation=g.factions[realm],r=ruler(g,realm),t=resolveTitle(g,titleId);
 if(!nation||!r?.alive||!t||t.realm!==realm)return no('Select a title inside your realm.');
 const tier=titleTier(t);
 if(!['barony','county','duchy'].includes(tier))return no('Only baronies, counties, and duchies can be revoked.');
 if(t.holder===r.id)return no('You already hold this title.');
 const targetId=t.holder,target=live(g,targetId);
 const h=t.province?g.politics.holdings[t.province]:null;
 const imprisoned=isImprisoned(g,targetId);
 const justified=Boolean(opts.justified||imprisoned||(h?.leverageUntil>g.turn)||(target?.traitorUntil>g.turn));
 if(!justified&&!councilPermission(g,realm,'revoke')&&!opts.bypassCouncil)return no('The council or regent refused title revocation.');
 if(!justified){
  f.tyranny[realm]=(f.tyranny[realm]||0)+15;
  nation.legitimacy=cap(nation.legitimacy-12,0,100);
  for(const [,vh] of holdings(g,realm))if(vh.lord!==r.id)vh.loyalty=cap(vh.loyalty-15,0,100);
 }
 // Revolt check: free adult vassal resists unjustified revocation (or very low loyalty).
 const loyalty=h?.loyalty??50;
 const resists=Boolean(target&&!imprisoned&&target.age>=18&&!opts.forceAccept&&(!justified&&(loyalty<55||target.traits?.includes('ambitious')||target.traits?.includes('brave')||opts.triggerRevolt)));
 if(resists){
  target.traitorUntil=g.turn+60;
  const provs=holdings(g,realm).filter(([,vh])=>vh.lord===targetId).map(([pid])=>pid);
  if(provs.length&&typeof triggerTitleRevolt==='function'){
   triggerTitleRevolt(g,world,realm,targetId,provs,'liberty');
  }
  note(g,realm,target.name+' defied the revocation of '+t.name+' and rose in revolt!');
  return no(target.name+' refused revocation and sparked a vassal revolt!',{revolted:true});
 }
 if(tier==='county'&&h){
  if(controller(g,t.province)!==realm)return no('Cannot revoke an occupied county.');
  h.lord=r.id;h.loyalty=100;h.tax=1;h.levy=1;h.autonomy=1;
 }else if(tier==='barony'&&f.baronies[t.id]){
  f.baronies[t.id].holder=h?.lord===r.id?r.id:(h?.lord||r.id);
  if(f.baronies[t.id].holder===targetId)f.baronies[t.id].holder=r.id;
 }else if(tier==='duchy'){
  t.holder=r.id;
 }
 if(target)addClaim(g,targetId,realm,{titleId:t.id,strength:'strong',from:r.id});
 syncTitles(g);
 note(g,realm,'Revoked '+t.name+(justified?' (justified).':' (tyrannical).'));
 return ok('Title revoked.',{tyranny:justified?0:15});
}

export function transferVassal(g,world,realm,vassalTitleId,newLiegeId){
 const f=initFeudal(g,world),r=ruler(g,realm),t=resolveTitle(g,vassalTitleId),liege=live(g,newLiegeId);
 if(!r?.alive||!t||t.realm!==realm||!liege||liege.realm!==realm||isImprisoned(g,newLiegeId))return no('Select a valid vassal title and free liege in your realm.');
 const vRank=titleRank(t);
 if(!['barony','county','duchy'].includes(titleTier(t)))return no('Only barons, counts, and dukes can be transferred.');
 if(t.holder===newLiegeId)return no('A vassal cannot be their own liege.');
 const liegeTitles=characterTitles(g,newLiegeId);
 const liegeRank=Math.max(newLiegeId===r.id?4:0,...liegeTitles.map(titleRank));
 if(liegeRank<=vRank)return no('The new liege must hold a strictly higher title rank.');
 // Cycle detection: walk upward from newLiegeId to top; fail if t.holder appears anywhere.
 const seen=new Set([t.holder]);
 let cur=newLiegeId,steps=0;
 while(cur&&steps<16){
  if(seen.has(cur))return no('Circular vassal transfer is forbidden.');
  seen.add(cur);
  const topTitle=characterTitles(g,cur).sort((a,b)=>titleRank(b)-titleRank(a))[0];
  cur=topTitle?.deFactoLiege||null;
  steps++;
 }
 f.vassalTransfers[t.id]=newLiegeId;
 t.deFactoLiege=newLiegeId;
 syncTitles(g);
 note(g,realm,'Transferred '+t.name+' under '+liege.name+'.');
 return ok('Vassal transferred.');
}

export function feudalAction(g,world,action,id,extra){
 const f=initFeudal(g,world),realm=g.player,nation=g.factions[realm],r=ruler(g,realm),t=resolveTitle(g,id),p=live(g,extra);
 if(action==='create-title')return createTitle(g,world,realm,id,typeof extra==='object'&&extra?extra:{});
 if(action==='usurp')return usurpTitle(g,world,realm,id,typeof extra==='object'&&extra?extra:{});
 if(action==='destroy-title')return destroyTitle(g,world,realm,id);
 if(action==='revoke')return revokeTitle(g,world,realm,id,typeof extra==='object'&&extra?extra:{});
 if(action==='transfer-vassal')return transferVassal(g,world,realm,id,extra);
 if(action==='grant-barony'){
  if(t?.tier!=='barony'||t.realm!==realm||controller(g,t.province)!==realm)return no('Select a controlled barony.');
  if(!p||p.realm!==realm||p.age<18||isImprisoned(g,p.id))return no('Select a free adult subject.');
  f.baronies[t.id].holder=p.id;
  syncTitles(g);
  return ok('Barony granted to '+p.name+'.');
 }
 if(action==='grant'||action==='reclaim'){
  if(t?.tier!=='province'||t.realm!==realm||controller(g,t.province)!==realm)return no('Select a controlled provincial title.');
  const v=g.politics.holdings[t.province];
  if(action==='grant'){
   if(v.lord!==r.id||!p||p.realm!==realm||p.age<18||p.id===r.id||isImprisoned(g,p.id))return no('Grant a personally held province to a free adult subject.');
   v.lord=p.id;v.loyalty=80;v.tax=1;v.levy=1;v.autonomy=1;nation.prestige+=3;
  }else{
   if(v.lord===r.id||nation.legitimacy<55||!(v.leverageUntil>g.turn||isImprisoned(g,v.lord)))return no('Reclaim requires 55 legitimacy and proven leverage or an imprisoned lord.');
   nation.legitimacy-=8;v.lord=r.id;v.loyalty=100;v.tax=1;v.levy=1;v.autonomy=1;
  }
  syncTitles(g);
  return ok('Provincial title transferred.');
 }
 if(action==='regional'){
  if(t?.tier!=='regional'||t.realm!==realm||!p||p.realm!==realm||p.age<18||isImprisoned(g,p.id)||!t.members.some(id=>g.politics.holdings[id]?.lord===p.id)||t.holder===p.id||nation.treasury<120)return no('Choose an eligible provincial lord within the district and pay 120 gold.');
  nation.treasury-=120;t.holder=p.id;syncTitles(g);return ok('Regional title granted.');
 }
 if(action==='arrest'){
  const target=live(g,id),v=holdings(g,realm).filter(([,h])=>h.lord===id);
  if(!target||target.realm!==realm||!v.some(([,h])=>h.leverageUntil>g.turn)||nation.legitimacy<55||!capturePrisoner(g,realm,id,'proven misconduct'))return no('Arrest requires a free adult vassal, established evidence and 55 legitimacy.');
  nation.legitimacy-=3;return ok('Vassal imprisoned.');
 }
 if(action==='estate-law'){
  const result=amendEstateCharter(g,realm,t?.province,extra);
  if(result.ok)note(g,realm,result.msg);
  return result;
 }
 if(action==='execute')return executePrisoner(g,world,realm,id,typeof extra==='object'&&extra?extra:{});
 if(action==='exchange')return exchangePrisoners(g,realm,id,extra);
 if(action==='release'||action==='ransom'){
  const x=f.prisoners[id];
  if(!x||x.captor!==realm||x.status!=='held')return no('Select your prisoner.');
  if(action==='ransom')return ransom(g,x);
  release(g,x);
  for(const [,h] of holdings(g,x.realm))if(h.lord===id)h.loyalty=cap(h.loyalty+15,0,100);
  return ok('Prisoner released.');
 }
 return no('Unknown title or prisoner action.');
}

export function tickFeudal(g,world){
 const f=initFeudal(g,world);
 if(f.lastTick===g.turn)return;
 f.lastTick=g.turn;
 syncTitles(g);
 for(const [id,x] of Object.entries(f.prisoners)){
  if(x.status==='held'){
   if(!live(g,id)||!holdings(g,x.captor).length){release(g,x);continue;}
   if(!humanControlsRealm(g,x.captor)&&g.turn-x.started>=12)ransom(g,x);
   if(x.status==='held'&&g.turn-x.started>=36)release(g,x);
  }else if(g.turn-x.ended>60)delete f.prisoners[id];
 }
 for(const [id,x] of Object.entries(f.claimants))if(!live(g,x.person)||g.turn-x.created>=180)delete f.claimants[id];
 // Decay tyranny slowly over time and let qualified AI create duchies if rich.
 if(g.turn%12===0){
  for(const r of Object.keys(f.tyranny))if(f.tyranny[r]>0)f.tyranny[r]=Math.max(0,f.tyranny[r]-2);
 }
 tickEstateCharters(g);
}
