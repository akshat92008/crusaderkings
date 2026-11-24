import {partitionRepresentatives} from './succession-systems.js';
// Crown, regional title and provincial title hierarchy, based on prototype geography.
// Provincial holders remain authoritative in g.politics.holdings.
import {controller} from './campaign-war.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const ruler=(g,realm)=>g.politics.people[g.politics.realms[realm]?.ruler];
const live=(g,id)=>g.politics.people[id]?.alive?g.politics.people[id]:null;
const holdings=(g,realm)=>Object.entries(g.politics.holdings).filter(([id,h])=>h.realm===realm&&g.provinces[id]?.owner===realm);
function note(g,realm,message){const f=g.feudal;f.history.unshift({realm,turn:g.turn,message});f.history=f.history.slice(0,150);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
export function isImprisoned(g,id){return !!g.feudal?.prisoners[id]&&g.feudal.prisoners[id].status==='held';}
function districts(world){const by=new Map(world.provinces.map(p=>[p.id,p])),remaining=new Set(by.keys()),out={};for(const p of world.provinces){if(!remaining.delete(p.id))continue;const members=[p.id];for(let i=0;i<members.length&&members.length<4;i++)for(const id of by.get(members[i])?.neighbors||[]){if(members.length>=4)break;if(by.get(id)?.owner===p.owner&&remaining.delete(id))members.push(id);}out['d:'+p.id]={id:'d:'+p.id,name:(p.name||p.id)+' district',deJureRealm:p.owner,members};}return out;}
export function initFeudal(g,world){
 const saved=g.feudal;
 if(saved?.version===2)return saved;
 if(saved?.version===1){
  const atlasOwners=new Map(world.provinces.map(p=>[p.id,p.owner]));
  for(const d of Object.values(saved.districts))d.deJureRealm=atlasOwners.get(d.members[0])??null;
  saved.version=2;
  return saved;
 }
 const f=g.feudal={version:2,districts:districts(world),titles:{},prisoners:{},claimants:{},history:[],lastTick:-1};
 syncTitles(g);
 return f;
}
export function syncTitles(g){const f=g.feudal;if(!f)return;const next={};for(const [realm,s] of Object.entries(g.politics.realms))next['k:'+realm]={id:'k:'+realm,tier:'crown',realm,deJureRealm:realm,holder:s.ruler,parent:null,name:g.factions[realm].name};
 for(const d of Object.values(f.districts)){const realms=new Set(d.members.map(id=>g.politics.holdings[id]?.realm).filter(Boolean));for(const realm of realms){const members=d.members.filter(id=>g.politics.holdings[id]?.realm===realm&&g.provinces[id]?.owner===realm);if(!members.length)continue;const id=d.id+':'+realm,old=f.titles[id],lords=[...new Set(members.map(p=>g.politics.holdings[p].lord))].filter(c=>live(g,c)),holder=lords.includes(old?.holder)?old.holder:lords.sort((a,b)=>members.filter(p=>g.politics.holdings[p].lord===b).length-members.filter(p=>g.politics.holdings[p].lord===a).length||a.localeCompare(b))[0]||g.politics.realms[realm].ruler;
 next[id]={id,tier:'regional',realm,deJureRealm:d.deJureRealm,holder,parent:'k:'+realm,name:d.name,members};for(const p of members)next['c:'+p]={id:'c:'+p,tier:'province',realm,deJureRealm:d.deJureRealm,holder:g.politics.holdings[p].lord,parent:id,name:p,province:p};}}
 f.titles=next;}
export function titleList(g,realm){return Object.values(g.feudal?.titles||{}).filter(t=>t.realm===realm);}
export function characterTitles(g,id){
 return Object.values(g.feudal?.titles||{}).filter(t=>t.holder===id);
}
export function regionalLoyalty(g,province){const c=g.feudal?.titles['c:'+province],d=g.feudal?.titles[c?.parent];if(!d||d.holder===g.politics.realms[d.realm]?.ruler||isImprisoned(g,d.holder))return 0;const v=d.members.map(id=>[id,g.politics.holdings[id]]).filter(([,h])=>h?.lord===d.holder);if(!v.length)return 0;return cap((v.reduce((n,[,h])=>n+h.loyalty,0)/v.length-55)*.18,-8,8);}
export function partitionInheritance(g,realm,deceased,primary){if(!g.feudal)return;const f=g.feudal,p=g.politics,s=p.realms[realm],heirs=partitionRepresentatives(g,deceased).filter(c=>c.id!==primary.id);if(s.law!=='elective')for(const c of heirs){f.claimants[realm+':'+c.id]={realm,person:c.id,from:deceased.id,created:g.turn};}
 const crown=holdings(g,realm).filter(([,h])=>h.lord===deceased.id).sort(([a],[b])=>a.localeCompare(b));const available=heirs.filter(c=>!isImprisoned(g,c.id));if(s.law==='partition'&&available.length){let i=0;for(const [id,h] of crown){h.lord=i===0?primary.id:available[(i-1)%available.length].id;h.loyalty=65;i++;}if(crown.length>1)note(g,realm,'Partition distributed '+crown.length+' crown holdings among the heirs.');}
 else for(const [,h] of crown){h.lord=primary.id;h.loyalty=65;}syncTitles(g);}
export function claimantCandidates(g,realm){const r=ruler(g,realm);return Object.values(g.feudal?.claimants||{}).filter(x=>x.realm===realm&&x.person!==r?.id&&live(g,x.person)?.realm===realm&&!isImprisoned(g,x.person)&&g.turn-x.created<180);}
export function installClaimant(g,realm,id){const c=claimantCandidates(g,realm).find(c=>c.person===id),next=live(g,id),s=g.politics.realms[realm];if(!c||!next||!s)return false;const old=ruler(g,realm);s.ruler=id;delete g.feudal.claimants[realm+':'+id];g.feudal.claimants[realm+':'+old.id]={realm,person:old.id,from:id,created:g.turn};for(const [role,person] of Object.entries(s.council))if(person===id)s.council[role]=old.id;s.regent=next.age<18?(s.council.chancellor||null):null;g.kingdom.courts[realm].successions++;g.kingdom.courts[realm].dynasty=next.house;g.kingdom.courts[realm].ruler={name:next.name,age:next.age,...next.skills};for(const [,h] of holdings(g,realm))if(h.lord===old.id){h.lord=id;h.loyalty=65;}syncTitles(g);note(g,realm,next.name+' took the crown after the claimant settlement.');return true;}
export function capturePrisoner(g,captor,id,reason='battle'){const p=live(g,id);if(!g.feudal||!p||!g.politics.realms[captor]||p.age<18||ruler(g,p.realm)?.id===id||isImprisoned(g,id))return false;g.feudal.prisoners[id]={person:id,captor,realm:p.realm,reason,started:g.turn,status:'held'};for(const a of Object.values(g.military?.armies||{}))if(a.commander===id)a.commander=null;note(g,captor,p.name+' was imprisoned ('+reason+').');return true;}
export function captureCommander(g,captor,army){const id=g.military?.armies[army?.id]?.commander;return id?capturePrisoner(g,captor,id,'war captive'):false;}
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
function ransom(g,x){const p=live(g,x.person),f=g.factions[x.captor];if(!p||!f)return no('Prisoner unavailable.');const estates=holdings(g,x.realm).filter(([,h])=>h.lord===p.id),amount=100,wealth=p.wealth+estates.reduce((n,[,h])=>n+h.wealth,0);if(wealth<amount)return no('Prisoner and estates cannot afford 100 gold.');let due=amount,take=Math.min(due,p.wealth);p.wealth-=take;due-=take;for(const [,h] of estates){take=Math.min(due,h.wealth);h.wealth-=take;due-=take;}f.treasury+=amount;release(g,x);return ok('Prisoner ransomed for 100 gold.');}
export function feudalAction(g,world,action,id,extra){const f=initFeudal(g,world),realm=g.player,nation=g.factions[realm],s=g.politics.realms[realm],r=ruler(g,realm),t=f.titles[id],p=live(g,extra);
 if(action==='grant'||action==='reclaim'){if(t?.tier!=='province'||t.realm!==realm||controller(g,t.province)!==realm)return no('Select a controlled provincial title.');const v=g.politics.holdings[t.province];
 if(action==='grant'){if(v.lord!==r.id||!p||p.realm!==realm||p.age<18||p.id===r.id||isImprisoned(g,p.id))return no('Grant a personally held province to a free adult subject.');v.lord=p.id;v.loyalty=80;v.tax=1;v.levy=1;v.autonomy=1;nation.prestige+=3;}
 else{if(v.lord===r.id||nation.legitimacy<55||!(v.leverageUntil>g.turn||isImprisoned(g,v.lord)))return no('Reclaim requires 55 legitimacy and proven leverage or an imprisoned lord.');nation.legitimacy-=8;v.lord=r.id;v.loyalty=100;v.tax=1;v.levy=1;v.autonomy=1;}
 syncTitles(g);return ok('Provincial title transferred.');}
 if(action==='regional'){if(t?.tier!=='regional'||t.realm!==realm||!p||p.realm!==realm||p.age<18||isImprisoned(g,p.id)||!t.members.some(id=>g.politics.holdings[id]?.lord===p.id)||t.holder===p.id||nation.treasury<120)return no('Choose an eligible provincial lord within the district and pay 120 gold.');nation.treasury-=120;t.holder=p.id;return ok('Regional title granted.');}
 if(action==='arrest'){const target=live(g,id),v=holdings(g,realm).filter(([,h])=>h.lord===id);if(!target||target.realm!==realm||!v.some(([,h])=>h.leverageUntil>g.turn)||nation.legitimacy<55||!capturePrisoner(g,realm,id,'proven misconduct'))return no('Arrest requires a free adult vassal, established evidence and 55 legitimacy.');nation.legitimacy-=3;return ok('Vassal imprisoned.');}
 if(action==='exchange')return exchangePrisoners(g,realm,id,extra);
 if(action==='release'||action==='ransom'){const x=f.prisoners[id];if(!x||x.captor!==realm||x.status!=='held')return no('Select your prisoner.');if(action==='ransom')return ransom(g,x);release(g,x);for(const [,h] of holdings(g,x.realm))if(h.lord===id)h.loyalty=cap(h.loyalty+15,0,100);return ok('Prisoner released.');}
 return no('Unknown title or prisoner action.');}
export function tickFeudal(g,world){const f=initFeudal(g,world);if(f.lastTick===g.turn)return;f.lastTick=g.turn;syncTitles(g);
 for(const [id,x] of Object.entries(f.prisoners)){if(x.status==='held'){if(!live(g,id)||!holdings(g,x.captor).length){release(g,x);continue;}if(x.captor!==g.player&&g.turn-x.started>=12)ransom(g,x);if(x.status==='held'&&g.turn-x.started>=36)release(g,x);}else if(g.turn-x.ended>60)delete f.prisoners[id];}
 for(const [id,x] of Object.entries(f.claimants))if(!live(g,x.person)||g.turn-x.created>=180)delete f.claimants[id];
}
