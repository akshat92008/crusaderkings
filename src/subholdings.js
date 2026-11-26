// Subordinate landed seats (Castle Barony, City Mayoralty, Temple Bishopric) live
// on the canonical county estate and synchronize two-way with 5-tier feudal baronies.
import {controller} from './campaign-war.js';
import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
import {changeOpinion,personalOpinion} from './chronicle-systems.js';
import {portraitImage} from './game-art.js';
import {characterLink} from './campaign-context.js';

export const SUBHOLDING_TYPES={
 castle:{name:'Castle',title:'Barony',cost:140,skill:'martial',icon:'♜',description:'Each level above the county seat adds 5% to local levy contribution.'},
 city:{name:'City',title:'Mayoralty',cost:180,skill:'stewardship',icon:'⚖',description:'Each level adds 6% to local taxable contribution.'},
 temple:{name:'Temple',title:'Bishopric',cost:160,skill:'learning',icon:'✦',description:'Each level strengthens community trust and local religious institutions.'}
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
  const barony=g.feudal?.baronies?.[subholdingKey(id,kind)];
  const holder=level&&validDelegate(g,h,old?.holder)?old.holder:null;
  root[kind]={level,holder};
  if(barony){
   barony.level=level;
   if(level&&holder&&validDelegate(g,h,holder))barony.holder=holder;
  }
 }
 return keys.filter(k=>root[k].level>0).map(kind=>({kind,level:root[kind].level,holder:root[kind].holder||h.lord}));
}

export function subholdingProfile(g,id){
 const h=estate(g,id),castle=levelOf(h,'castle'),city=levelOf(h,'city'),temple=levelOf(h,'temple');
 return {castle,city,temple,tax:1+city*.06,levy:1+Math.max(0,castle-1)*.05};
}

function manager(g,id,actor){
 const h=estate(g,id),p=free(g,actor);
 return h&&p&&h.lord===actor&&controlled(g,id,h.realm)&&(p.realm===h.realm||actor===sovereign(g,h.realm))?h:null;
}
function funds(g,h){
 return h.lord===sovereign(g,h.realm)?{source:g.factions[h.realm],key:'treasury',label:'treasury gold'}:{source:h,key:'wealth',label:'estate gold'};
}
function isHuman(g,h){
 return h.lord===sovereign(g,h.realm)?humanControlsRealm(g,h.realm):humanControlsCharacter(g,h.lord);
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
 const h=manager(g,id,actor);
 if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||!subholdingCandidates(g,id,kind).some(p=>p.id===target))return no('Choose a built, controlled seat and an eligible different adult.');
 const wallet=funds(g,h);
 if(num(wallet.source?.[wallet.key])<30)return no('Appointment requires 30 '+wallet.label+'.');
 syncSubholdingSeats(g,id);
 const previous=h.subholdings[kind].holder;
 wallet.source[wallet.key]-=30;
 h.subholdings[kind].holder=target===h.lord?null:target;
 const bRec=g.feudal?.baronies?.[subholdingKey(id,kind)];
 if(bRec)bRec.holder=target;
 if(previous&&previous!==actor&&live(g,previous))changeOpinion(g,actor,previous,-15);
 if(target!==actor)changeOpinion(g,actor,target,8);
 return yes(SUBHOLDING_TYPES[kind].name+' appointment confirmed.');
}

export function subholdingAction(g,realm,actor,action,key,target){
 const d=decode(key),h=d&&manager(g,d.id,actor);
 if(!h||h.realm!==realm||!isHuman(g,h))return no('Only your own controlled county can be managed.');
 if(action==='subholding-build')return upgrade(g,d.id,d.kind,actor);
 if(action==='subholding-appoint')return appoint(g,d.id,d.kind,actor,target);
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

// Granular County-Map Sub-Holdings UI rendered directly inside the Province Drawer.
export function renderCountySubholdings(g,id,esc,mode='feudal'){
 const h=estate(g,id),pr=g.provinces?.[id];
 if(!pr)return '';
 if(!h)return '<p class="smallnote">Independent frontier settlement — no formal crown estate sub-holdings established yet.</p>';
 const realm=h.realm,careerActor=g.playerCareer?.mode==='vassal'?g.playerCareer.person:null;
 const actor=mode==='career'&&careerActor?careerActor:g.politics?.realms?.[realm]?.ruler;
 const canManage=!!manager(g,id,actor)&&isHuman(g,h);
 const seats=subholdingProfile(g,id);
 let out='<div class="subholding-summary smallnote">County yield bonus: <b>+'+Math.round((seats.levy-1)*100)+'% levy</b> · <b>+'+Math.round((seats.tax-1)*100)+'% tax</b> · <b>Temple trust Lv.'+seats.temple+'</b></div>';
 for(const kind of keys){
  const d=SUBHOLDING_TYPES[kind],key=subholdingKey(id,kind),terms=subholdingTerms(g,id,kind,actor);
  const row=h.subholdings?.[kind],bRec=g.feudal?.baronies?.[key];
  const holder=validDelegate(g,h,row?.holder||bRec?.holder)||live(g,h.lord);
  const opinion=holder&&actor&&holder.id!==actor?personalOpinion(g,actor,holder.id):null;
  const baronyGold=Math.floor(num(bRec?.wealth));
  out+='<div class="rule subholding-card">';
  out+='<div class="subholding-head"><b>'+esc(d.icon+' '+d.name+' · '+d.title)+'</b><span class="badge">'+(terms.level?'Lv. '+terms.level+'/3':'Unbuilt')+'</span></div>';
  out+='<p class="smallnote">'+esc(d.description)+'</p>';
  if(terms.level&&holder){
   const mark=portraitImage(holder);
   out+='<div class="subholding-holder"><span class="portrait-mark small">'+mark+'</span><div>'+characterLink(holder,esc)+'<div class="smallnote">'+holder.age+'y · '+esc(d.skill.slice(0,3).toUpperCase())+' '+num(holder.skills?.[d.skill])+'/5 · Gold '+Math.floor(num(holder.wealth))+(baronyGold?' (+'+baronyGold+' seat)':'')+(opinion!==null?' · Opinion '+opinion:'')+'</div></div></div>';
  }
  if(canManage&&terms.level<3){
   out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-build" data-id="'+esc(key)+'"'+(terms.reason?' disabled':'')+'>'+esc((terms.level?'Upgrade':'Establish')+' '+d.name+' ('+terms.cost+' '+terms.funding+')')+'</button>';
   if(terms.reason)out+='<p class="smallnote">'+esc(terms.reason)+'</p>';
  }
  if(canManage&&terms.level){
   const candidates=subholdingCandidates(g,id,kind),field='county-seat-'+mode+'-'+id+'-'+kind;
   if(candidates.length){
    out+='<select class="select" id="'+esc(field)+'">'+candidates.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+' · '+esc(d.skill.slice(0,3).toUpperCase())+' '+num(p.skills?.[d.skill])+'</option>').join('')+'</select>';
    out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-appoint" data-id="'+esc(key)+'" data-extra="'+esc(key)+'" data-input="'+esc(field)+'">Appoint '+esc(d.title)+' (30 '+esc(terms.funding)+')</button>';
   }
  }
  out+='</div>';
 }
 return out;
}
