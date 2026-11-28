// Subordinate landed seats (Castle Barony, City Mayoralty, Temple Bishopric) live
// on the canonical county estate and synchronize two-way with 5-tier feudal baronies.
import {controller} from './campaign-war.js';
import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
import {changeOpinion,personalOpinion} from './chronicle-systems.js';
import {portraitImage} from './game-art.js';
import {characterLink} from './campaign-context.js';
import {allocateCharacterName,allocateHouseName} from './name-pools.js';

export const SUBHOLDING_TYPES={
 castle:{name:'Castle',title:'Barony',role:'Baron',cost:140,skill:'martial',icon:'♜',description:'Each level above the county seat adds 5% to local levy contribution.'},
 city:{name:'City',title:'Mayoralty',role:'Mayor',cost:180,skill:'stewardship',icon:'⚖',description:'Each level adds 6% to local taxable contribution.'},
 temple:{name:'Temple',title:'Bishopric',role:'Bishop',cost:160,skill:'learning',icon:'✦',description:'Each level strengthens community trust and local religious institutions.'}
};
export const BARON_DUTIES={
 standard:{id:'standard',label:'Balanced',levyMod:0,taxMod:0},
 levy:{id:'levy',label:'Levy Focus',levyMod:0.12,taxMod:-0.08},
 tax:{id:'tax',label:'Tax Focus',levyMod:-0.08,taxMod:0.12}
};
const keys=Object.keys(SUBHOLDING_TYPES);
const cap=(v,a,b)=>Math.max(a,Math.min(b,v)),num=v=>Number.isFinite(v)?v:0;
const yes=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const live=(g,id)=>g.politics?.people?.[id]?.alive?g.politics.people[id]:null;
const free=(g,id)=>{const p=live(g,id);return p&&p.age>=18&&g.feudal?.prisoners?.[id]?.status!=='held'?p:null;};
const sovereign=(g,r)=>g.politics?.realms?.[r]?.ruler;
const controlled=(g,id,r)=>g.provinces?.[id]?.owner===r&&controller(g,id)===r;
const estate=(g,id)=>g.politics?.holdings?.[id];
const levelOf=(h,k)=>cap(Math.floor(num(h?.subholdings?.[k]?.level??(k==='castle'?1:0))),k==='castle'?1:0,3);
const dutyOf=(h,k)=>Object.hasOwn(BARON_DUTIES,h?.subholdings?.[k]?.duty)?h.subholdings[k].duty:'standard';
export const subholdingKey=(id,kind)=>'b:'+id+':'+kind;

function decode(key){
 if(typeof key!=='string'||!key.startsWith('b:'))return null;
 const i=key.lastIndexOf(':');
 const kind=key.slice(i+1),id=key.slice(2,i);
 return id&&Object.hasOwn(SUBHOLDING_TYPES,kind)?{id,kind}:null;
}

function validDelegate(g,h,id){
 const p=live(g,id);
 return p&&(p.realm===h.realm||p.id===h.lord)?p:null;
}

export function syncSubholdingSeats(g,id){
 const h=estate(g,id);
 if(!h)return [];
 const root=h.subholdings??={};
 for(const kind of keys){
  const level=levelOf(h,kind);
  const old=root[kind];
  const duty=dutyOf(h,kind);
  const barony=g.feudal?.baronies?.[subholdingKey(id,kind)];
  const holder=level&&validDelegate(g,h,old?.holder)?old.holder:null;
  root[kind]={level,holder,duty};
  if(barony){
   barony.level=level;
   barony.duty=duty;
   if(level&&holder&&validDelegate(g,h,holder))barony.holder=holder;
  }
 }
 return keys.filter(k=>root[k].level>0).map(kind=>({kind,level:root[kind].level,holder:root[kind].holder||h.lord,duty:root[kind].duty}));
}

export function subholdingProfile(g,id){
 const h=estate(g,id),castle=levelOf(h,'castle'),city=levelOf(h,'city'),temple=levelOf(h,'temple');
 let tax=1+city*.06,levy=1+Math.max(0,castle-1)*.05;
 for(const k of keys){
  if(!levelOf(h,k))continue;
  const d=BARON_DUTIES[dutyOf(h,k)];
  tax+=d.taxMod;levy+=d.levyMod;
 }
 return {castle,city,temple,tax:Math.max(0.75,Number(tax.toFixed(4))),levy:Math.max(0.75,Number(levy.toFixed(4)))};
}

function manager(g,id,actor){
 const h=estate(g,id),p=free(g,actor);
 return h&&p&&h.lord===actor&&controlled(g,id,h.realm)&&(p.realm===h.realm||actor===sovereign(g,h.realm))?h:null;
}
function baronManager(g,id,actor){
 const direct=manager(g,id,actor);if(direct)return direct;
 const h=estate(g,id),p=free(g,actor);
 return h&&p&&actor===sovereign(g,h.realm)&&controlled(g,id,h.realm)&&humanControlsRealm(g,h.realm)?h:null;
}
function funds(g,h,actor=null){
 return (h.lord===sovereign(g,h.realm)||(actor&&actor===sovereign(g,h.realm)))?{source:g.factions[h.realm],key:'treasury',label:'treasury gold'}:{source:h,key:'wealth',label:'estate gold'};
}
function isHuman(g,h,actor=null){
 return h.lord===sovereign(g,h.realm)||(actor&&actor===sovereign(g,h.realm))?humanControlsRealm(g,h.realm):humanControlsCharacter(g,h.lord);
}

export function subholdingCandidates(g,id,kind){
 const h=estate(g,id);
 if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||!levelOf(h,kind))return [];
 const current=validDelegate(g,h,h.subholdings?.[kind]?.holder)?.id||h.lord;
 const skill=SUBHOLDING_TYPES[kind].skill;
 return Object.values(g.politics.people)
  .filter(p=>free(g,p.id)&&p.id!==current&&(p.id===h.lord||(p.realm===h.realm&&p.id!==sovereign(g,h.realm))))
  .sort((a,b)=>Number(b.id===h.lord)-Number(a.id===h.lord)||num(b.skills?.[skill])-num(a.skills?.[skill])||a.id.localeCompare(b.id))
  .slice(0,24);
}

export function subholdingTerms(g,id,kind,actor){
 const h=estate(g,id),def=SUBHOLDING_TYPES[kind];
 if(!h||!def)return null;
 const level=levelOf(h,kind),cost=def.cost*(level+1),required=2+level*2;
 const wallet=funds(g,h),p=g.provinces[id];
 const reason=!manager(g,id,actor)?'Only the free county holder can manage controlled seats.':level>=3?'Maximum level.':num(p?.development)<required?'Requires county development '+required+'.':num(wallet.source?.[wallet.key])<cost?'Insufficient '+wallet.label+'.':'';
 return {level,cost,required,reason,funding:wallet.label};
}

function upgrade(g,id,kind,actor){
 const terms=subholdingTerms(g,id,kind,actor);
 if(!terms||terms.reason)return no(terms?.reason||'Unknown holding type.');
 const h=estate(g,id),wallet=funds(g,h);
 syncSubholdingSeats(g,id);
 wallet.source[wallet.key]-=terms.cost;
 h.subholdings[kind].level++;
 const key=subholdingKey(id,kind);
 if(g.feudal?.baronies?.[key])g.feudal.baronies[key].level=h.subholdings[kind].level;
 return yes(SUBHOLDING_TYPES[kind].name+' improved to level '+h.subholdings[kind].level+'.');
}

function appoint(g,id,kind,actor,target){
 const h=baronManager(g,id,actor);
 if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||!subholdingCandidates(g,id,kind).some(p=>p.id===target))return no('Choose a built, controlled seat and an eligible different adult.');
 const wallet=funds(g,h,actor);
 if(num(wallet.source?.[wallet.key])<30)return no('Appointment requires 30 '+wallet.label+'.');
 syncSubholdingSeats(g,id);
 const previous=h.subholdings[kind].holder;
 wallet.source[wallet.key]-=30;
 h.subholdings[kind].holder=target===h.lord?null:target;
 const bRec=g.feudal?.baronies?.[subholdingKey(id,kind)];
 if(bRec){bRec.holder=target;bRec.granted=target!==h.lord;}
 if(previous&&previous!==actor&&live(g,previous))changeOpinion(g,actor,previous,-15);
 if(target!==actor)changeOpinion(g,actor,target,8);
 return yes(SUBHOLDING_TYPES[kind].name+' appointment confirmed.');
}

function spawnBaron(g,id,kind,actor){
 const h=baronManager(g,id,actor);
 if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||levelOf(h,kind)<=0)return no('Build the holding before creating a local vassal.');
 const wallet=funds(g,h,actor);
 if(num(wallet.source?.[wallet.key])<15)return no('Creating a local vassal requires 15 '+wallet.label+'.');
 syncSubholdingSeats(g,id);
 const f=g.factions[h.realm],p=g.politics,pr=g.civic?.provinces?.[id];
 const pid='c'+p.next++;
 const skillKey=SUBHOLDING_TYPES[kind].skill;
 const sex=kind==='temple'||(p.next&1)?'male':'female';
 const name=allocateCharacterName(g,{realm:h.realm,continent:f?.continent,culture:pr?.culture||f?.culture,faith:pr?.faith||f?.religion,sex,seed:`baron:${id}:${kind}:${pid}`});
 const house=allocateHouseName(g,{realm:h.realm,seed:`baronhouse:${id}:${kind}:${pid}`});
 const traitMap={castle:'brave',city:'just',temple:'zealous'};
 const baron={
  id:pid,realm:h.realm,house,name,age:24+(p.next%16),alive:true,sex,
  parents:[],children:[],spouse:null,spouses:[],concubines:[],
  traits:[traitMap[kind]||'diligent'],
  skills:{diplomacy:2,martial:kind==='castle'?4:2,stewardship:kind==='city'?4:2,intrigue:2,learning:kind==='temple'?4:2},
  wealth:45,prestige:12,piety:kind==='temple'?15:5,claims:[],memories:[]
 };
 p.people[pid]=baron;
 p.dynasties??={};
 p.dynasties[house]??={house,realm:h.realm,founded:g.turn,extinct:false,parentHouse:null,cadetBranches:[],prestige:5};
 const previous=h.subholdings[kind].holder;
 wallet.source[wallet.key]-=15;
 h.subholdings[kind].holder=pid;
 const bRec=g.feudal?.baronies?.[subholdingKey(id,kind)];
 if(bRec){bRec.holder=pid;bRec.granted=true;}
 if(previous&&previous!==actor&&live(g,previous))changeOpinion(g,actor,previous,-15);
 changeOpinion(g,actor,pid,12);
 return yes('Installed '+SUBHOLDING_TYPES[kind].role+' '+name+' ('+skillKey+' 4) in '+SUBHOLDING_TYPES[kind].name+'.');
}

function revokeBaron(g,id,kind,actor){
 const h=baronManager(g,id,actor);
 if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind))return no('Only a controlled holding can be reclaimed.');
 syncSubholdingSeats(g,id);
 const previous=h.subholdings[kind].holder;
 if(!previous||previous===h.lord)return no('You already hold this '+SUBHOLDING_TYPES[kind].name.toLowerCase()+' directly.');
 h.subholdings[kind].holder=null;
 const bRec=g.feudal?.baronies?.[subholdingKey(id,kind)];
 if(bRec){bRec.holder=h.lord;bRec.granted=false;}
 const prevPerson=live(g,previous);
 const justified=prevPerson&&(prevPerson.traitorUntil>g.turn||g.feudal?.prisoners?.[previous]?.status==='held');
 if(prevPerson&&!justified)changeOpinion(g,actor,previous,-15);
 return yes('Reclaimed '+SUBHOLDING_TYPES[kind].name+' into direct county control.');
}

function setDuty(g,id,kind,actor,duty){
 const h=baronManager(g,id,actor);
 if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||levelOf(h,kind)<=0)return no('Only built controlled holdings support duty charters.');
 if(!Object.hasOwn(BARON_DUTIES,duty))return no('Unknown baron duty charter.');
 syncSubholdingSeats(g,id);
 h.subholdings[kind].duty=duty;
 const bRec=g.feudal?.baronies?.[subholdingKey(id,kind)];
 if(bRec)bRec.duty=duty;
 return yes(SUBHOLDING_TYPES[kind].name+' duty set to '+BARON_DUTIES[duty].label+'.');
}

export function subholdingAction(g,realm,actor,action,key,target){
 const d=decode(key),h=d&&baronManager(g,d.id,actor);
 if(!h||h.realm!==realm||!isHuman(g,h,actor))return no('Only your own controlled county can be managed.');
 if(action==='subholding-build')return upgrade(g,d.id,d.kind,actor);
 if(action==='subholding-appoint')return appoint(g,d.id,d.kind,actor,target);
 if(action==='subholding-spawn')return spawnBaron(g,d.id,d.kind,actor);
 if(action==='subholding-revoke')return revokeBaron(g,d.id,d.kind,actor);
 if(action==='subholding-duty')return setDuty(g,d.id,d.kind,actor,target);
 return no('Unknown subordinate holding order.');
}

// Pay delegates from existing local income after regional tribute rather
// than minting additional gold. Total delegated share is capped at 25%.
export function paySubholdingIncome(g,id,amount){
 const h=estate(g,id);
 if(!h||!Number.isFinite(amount)||amount<=0||!controlled(g,id,h.realm))return 0;
 const recipients=keys.flatMap(kind=>{
  const row=h.subholdings?.[kind],p=row?.holder&&validDelegate(g,h,row.holder);
  return p&&p.id!==h.lord&&free(g,p.id)&&levelOf(h,kind)>0?[{p,weight:levelOf(h,kind),kind}]:[];
 });
 const weights=recipients.reduce((n,x)=>n+x.weight,0),budget=Math.min(Math.floor(amount*.25),Math.floor(amount*.05*weights));
 if(!weights||!budget)return 0;
 let paid=0;
 for(const {p,weight} of recipients){
  const gold=Math.floor(budget*weight/weights);
  p.wealth=num(p.wealth)+gold;
  paid+=gold;
 }
 return paid;
}

export function tickSubholdings(g){
 if(g.turn%12!==0)return false;
 const built=new Set();
 let changed=false;
 for(const [id,h] of Object.entries(g.politics?.holdings||{})){
  if(built.has(h.realm)||isHuman(g,h)||!manager(g,id,h.lord))continue;
  const wallet=funds(g,h),p=live(g,h.lord);
  if(!p)continue;
  const war=Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&(w.attacker===h.realm||w.defender===h.realm));
  const order=war||p.traits?.includes('ambitious')?['castle','city','temple']:p.traits?.includes('zealous')||num(g.civic?.provinces?.[id]?.localTrust)<45?['temple','city','castle']:['city','temple','castle'];
  for(const kind of order){
   const t=subholdingTerms(g,id,kind,h.lord),reserve=wallet.key==='treasury'?600:100;
   if(!t||t.reason||num(wallet.source?.[wallet.key])<t.cost+reserve)continue;
   if(upgrade(g,id,kind,h.lord).ok){
    built.add(h.realm);changed=true;
    if(kind!=='castle'&&!h.subholdings[kind].holder&&num(wallet.source?.[wallet.key])>=reserve+30){
     const candidate=subholdingCandidates(g,id,kind).find(c=>!humanControlsCharacter(g,c.id));
     if(candidate)appoint(g,id,kind,h.lord,candidate.id);
    }
    break;
   }
  }
 }
 return changed;
}

export function renderSubholdings(g,id,actor,esc,mode='feudal'){
 const h=estate(g,id);
 if(!h)return '';
 const canManage=!!manager(g,id,actor)&&isHuman(g,h);
 let out='<details class="rule"><summary>Subordinate holdings · castle, city and temple</summary>';
 for(const kind of keys){
  const d=SUBHOLDING_TYPES[kind],key=subholdingKey(id,kind),terms=subholdingTerms(g,id,kind,actor),row=h.subholdings?.[kind],holder=validDelegate(g,h,row?.holder)||live(g,h.lord);
  out+='<div class="rule"><b>'+esc(d.icon+' '+d.name)+' ('+esc(d.title)+') · '+(terms.level?'Lv. '+terms.level+'/3':'Not established')+'</b><p class="smallnote">'+esc(d.description)+(terms.level?' Holder: '+characterLink(holder,esc)+' · '+esc(d.skill)+': '+(holder?.skills?.[d.skill]??1)+'/5':'')+'</p>';
  if(canManage&&terms.level<3){
   out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-build" data-id="'+esc(key)+'"'+(terms.reason?' disabled':'')+'>'+esc((terms.level?'Improve':'Establish')+' '+d.name+' ('+terms.cost+' '+terms.funding+')')+'</button>';
   if(terms.reason)out+='<p class="smallnote">'+esc(terms.reason)+'</p>';
  }
  if(canManage&&terms.level){
   const candidates=subholdingCandidates(g,id,kind),field='seat-'+mode+'-'+id+'-'+kind;
   if(candidates.length){
    out+='<label class="smallnote" for="'+esc(field)+'">Appoint '+esc(d.title)+' holder</label><select class="select" id="'+esc(field)+'">'+candidates.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' ('+esc(d.skill)+' '+num(p.skills?.[d.skill])+')</option>').join('')+'</select><button class="rowbtn" data-action="'+mode+'" data-type="subholding-appoint" data-id="'+esc(key)+'" data-extra="'+esc(key)+'" data-input="'+esc(field)+'">Appoint (30 '+esc(terms.funding)+')</button>';
   }
  }
  out+='</div>';
 }
 return out+'</details>';
}

// Granular County-Map Sub-Holdings & Baron Control rendered directly inside the Province Drawer.
export function renderCountySubholdings(g,id,esc,mode='feudal'){
 const h=estate(g,id),pr=g.provinces?.[id];
 if(!pr)return '';
 if(!h)return '<p class="smallnote">Independent frontier settlement — conquer or vassalize to organize formal baronies.</p>';
 const realm=h.realm,careerActor=g.playerCareer?.mode==='vassal'?g.playerCareer.person:null;
 const actor=mode==='career'&&careerActor?careerActor:g.politics?.realms?.[realm]?.ruler;
 const canManage=!!manager(g,id,actor)&&isHuman(g,h,actor);
 const sovereignOverseer=!canManage&&realm===g.player&&humanControlsRealm(g,realm)&&controlled(g,id,realm);
 const canManageBarons=canManage||sovereignOverseer;
 const seats=subholdingProfile(g,id);
 const activeBarons=keys.filter(k=>levelOf(h,k)>0&&validDelegate(g,h,h.subholdings?.[k]?.holder)).length;
 const builtCount=keys.filter(k=>levelOf(h,k)>0).length;
 const levyPct=Math.round((seats.levy-1)*100),taxPct=Math.round((seats.tax-1)*100);
 let out='<div class="subholding-summary smallnote"><b>Baron Control:</b> '+activeBarons+'/'+builtCount+' delegated · <b>'+(levyPct>=0?'+':'')+levyPct+'% levy</b> · <b>'+(taxPct>=0?'+':'')+taxPct+'% tax</b> · <b>Trust Lv.'+seats.temple+'</b></div>';
 for(const kind of keys){
  const d=SUBHOLDING_TYPES[kind],key=subholdingKey(id,kind),terms=subholdingTerms(g,id,kind,actor);
  const row=h.subholdings?.[kind],bRec=g.feudal?.baronies?.[key];
  const delegatedId=validDelegate(g,h,row?.holder||bRec?.holder)?.id;
  const isDelegated=Boolean(delegatedId&&delegatedId!==h.lord);
  const holder=validDelegate(g,h,delegatedId)||live(g,h.lord);
  const duty=dutyOf(h,kind);
  const opinion=holder&&actor&&holder.id!==actor?personalOpinion(g,actor,holder.id):null;
  const baronyGold=Math.floor(num(bRec?.wealth));
  const fundingLabel=canManage?terms.funding:'treasury gold';
  out+='<div class="rule subholding-card" data-holding-kind="'+esc(kind)+'">';
  out+='<div class="subholding-head"><b>'+esc(d.icon+' '+d.name+' · '+d.title)+'</b><span class="holding-pips" aria-label="Level '+terms.level+' of 3">'+[1,2,3].map(n=>'<i class="'+(n<=terms.level?'built':'empty')+'"></i>').join('')+'</span><span class="badge">'+(terms.level?'Lv. '+terms.level+'/3':'Unbuilt')+'</span></div>';
  out+='<p class="smallnote">'+esc(d.description)+(terms.level?' · Duty: <b>'+esc(BARON_DUTIES[duty].label)+'</b>':'')+'</p>';
  if(terms.level&&holder){
   const mark=portraitImage(holder);
   const roleTag=isDelegated?d.role:'Direct Control';
   out+='<div class="subholding-holder"><span class="portrait-mark small">'+mark+'</span><div>'+characterLink(holder,esc)+' <small>('+esc(roleTag)+')</small><div class="smallnote">'+holder.age+'y · '+esc(d.skill.slice(0,3).toUpperCase())+' '+num(holder.skills?.[d.skill])+'/5 · Gold '+Math.floor(num(holder.wealth))+(baronyGold?' (+'+baronyGold+' seat)':'')+(opinion!==null?' · Opinion '+opinion:'')+'</div></div></div>';
  }
  if(canManage&&terms.level<3){
   out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-build" data-id="'+esc(key)+'"'+(terms.reason?' disabled':'')+'>'+esc((terms.level?'Upgrade':'Establish')+' '+d.name+' ('+terms.cost+' '+fundingLabel+')')+'</button>';
   if(terms.reason)out+='<p class="smallnote">'+esc(terms.reason)+'</p>';
  }
  if(canManageBarons&&terms.level){
   out+='<div class="contract-options">';
   for(const [dKey,dVal] of Object.entries(BARON_DUTIES)){
    out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-duty" data-id="'+esc(key)+'" data-extra="'+esc(dKey)+'"'+(duty===dKey?' disabled':'')+'>'+esc(dVal.label)+'</button>';
   }
   out+='</div>';
   const candidates=subholdingCandidates(g,id,kind),field='county-seat-'+mode+'-'+id+'-'+kind;
   if(candidates.length){
    out+='<select class="select" id="'+esc(field)+'">'+candidates.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' · '+esc(d.skill.slice(0,3).toUpperCase())+' '+num(p.skills?.[d.skill])+'</option>').join('')+'</select>';
    out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-appoint" data-id="'+esc(key)+'" data-extra="'+esc(key)+'" data-input="'+esc(field)+'">Appoint '+esc(d.role)+' (30 '+esc(fundingLabel)+')</button>';
   }
   out+='<div class="contract-options">';
   out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-spawn" data-id="'+esc(key)+'">+ Create '+esc(d.role)+' (15 '+esc(fundingLabel)+')</button>';
   if(isDelegated){
    out+='<button class="rowbtn negative" data-action="'+mode+'" data-type="subholding-revoke" data-id="'+esc(key)+'">Revoke to Demesne</button>';
   }
   out+='</div>';
  }
  out+='</div>';
 }
 return out;
}
