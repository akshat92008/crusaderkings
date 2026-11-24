// Subordinate landed seats are saved on the canonical county estate. Titles
// are derived from those seats; sovereign ownership never changes here.
import {controller} from './campaign-war.js';
import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
import {changeOpinion} from './chronicle-systems.js';

export const SUBHOLDING_TYPES={
 castle:{name:'Castle',cost:140,skill:'martial',description:'Each level above the county seat adds 5% to local levy contribution.'},
 city:{name:'City',cost:180,skill:'stewardship',description:'Each level adds 6% to local taxable contribution.'},
 temple:{name:'Temple',cost:160,skill:'learning',description:'Each level strengthens community trust and local religious institutions.'}
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
function decode(key){if(typeof key!=='string'||!key.startsWith('b:'))return null;const i=key.lastIndexOf(':');const kind=key.slice(i+1),id=key.slice(2,i);return id&&Object.hasOwn(SUBHOLDING_TYPES,kind)?{id,kind}:null;}
function validDelegate(g,h,id){const p=live(g,id);return p&&(p.realm===h.realm||p.id===h.lord)?p:null;}
export function syncSubholdingSeats(g,id){
 const h=estate(g,id);if(!h)return [];
 const root=h.subholdings??={};
 for(const kind of keys){const level=levelOf(h,kind);const old=root[kind];const holder=level&&validDelegate(g,h,old?.holder)?old.holder:null;
  root[kind]={level,holder};
 }
 return keys.filter(k=>root[k].level>0).map(kind=>({kind,level:root[kind].level,holder:root[kind].holder||h.lord}));
}
export function subholdingProfile(g,id){
 const h=estate(g,id),castle=levelOf(h,'castle'),city=levelOf(h,'city'),temple=levelOf(h,'temple');
 return {castle,city,temple,tax:1+city*.06,levy:1+Math.max(0,castle-1)*.05};
}
function manager(g,id,actor){const h=estate(g,id),p=free(g,actor);return h&&p&&h.lord===actor&&controlled(g,id,h.realm)&&(p.realm===h.realm||actor===sovereign(g,h.realm))?h:null;}
function funds(g,h){return h.lord===sovereign(g,h.realm)?{source:g.factions[h.realm],key:'treasury',label:'treasury gold'}:{source:h,key:'wealth',label:'estate gold'};}
function isHuman(g,h){return h.lord===sovereign(g,h.realm)?humanControlsRealm(g,h.realm):humanControlsCharacter(g,h.lord);}
export function subholdingCandidates(g,id,kind){
 const h=estate(g,id);if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||!levelOf(h,kind))return [];
 const current=validDelegate(g,h,h.subholdings?.[kind]?.holder)?.id||h.lord;
 const skill=SUBHOLDING_TYPES[kind].skill;
 return Object.values(g.politics.people).filter(p=>free(g,p.id)&&p.id!==current&&(p.id===h.lord||p.realm===h.realm&&p.id!==sovereign(g,h.realm)))
  .sort((a,b)=>Number(b.id===h.lord)-Number(a.id===h.lord)||num(b.skills?.[skill])-num(a.skills?.[skill])||a.id.localeCompare(b.id)).slice(0,24);
}
export function subholdingTerms(g,id,kind,actor){
 const h=estate(g,id),def=SUBHOLDING_TYPES[kind];if(!h||!def)return null;
 const level=levelOf(h,kind),cost=def.cost*(level+1),required=2+level*2;
 const wallet=funds(g,h),p=g.provinces[id];
 const reason=!manager(g,id,actor)?'Only the free county holder can manage controlled seats.':level>=3?'Maximum level.':num(p?.development)<required?'Requires county development '+required+'.':num(wallet.source?.[wallet.key])<cost?'Insufficient '+wallet.label+'.':'';
 return {level,cost,required,reason,funding:wallet.label};
}
function upgrade(g,id,kind,actor){
 const terms=subholdingTerms(g,id,kind,actor);if(!terms||terms.reason)return no(terms?.reason||'Unknown holding type.');
 const h=estate(g,id),wallet=funds(g,h);syncSubholdingSeats(g,id);
 wallet.source[wallet.key]-=terms.cost;h.subholdings[kind].level++;
 return yes(SUBHOLDING_TYPES[kind].name+' improved to level '+h.subholdings[kind].level+'.');
}
function appoint(g,id,kind,actor,target){
 const h=manager(g,id,actor);if(!h||!Object.hasOwn(SUBHOLDING_TYPES,kind)||!subholdingCandidates(g,id,kind).some(p=>p.id===target))return no('Choose a built, controlled seat and an eligible different adult.');
 const wallet=funds(g,h);if(num(wallet.source?.[wallet.key])<30)return no('Appointment requires 30 '+wallet.label+'.');
 syncSubholdingSeats(g,id);
 const previous=h.subholdings[kind].holder;
 wallet.source[wallet.key]-=30;
 h.subholdings[kind].holder=target===h.lord?null:target;
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
// Pay delegates from existing local income, after regional tribute, rather
// than minting additional gold. The total delegated share is at most 25%.
export function paySubholdingIncome(g,id,amount){
 const h=estate(g,id);if(!h||!Number.isFinite(amount)||amount<=0||!controlled(g,id,h.realm))return 0;
 const recipients=keys.flatMap(kind=>{const row=h.subholdings?.[kind],p=row?.holder&&validDelegate(g,h,row.holder);return p&&p.id!==h.lord&&free(g,p.id)&&levelOf(h,kind)>0?[{p,weight:levelOf(h,kind)}]:[];});
 const weights=recipients.reduce((n,x)=>n+x.weight,0),budget=Math.min(Math.floor(amount*.25),Math.floor(amount*.05*weights));
 if(!weights||!budget)return 0;let paid=0;
 for(const {p,weight} of recipients){const gold=Math.floor(budget*weight/weights);p.wealth=num(p.wealth)+gold;paid+=gold;}
 return paid;
}
export function tickSubholdings(g){
 if(g.turn%12!==0)return false;
 const built=new Set();let changed=false;
 for(const [id,h] of Object.entries(g.politics.holdings)){
  if(built.has(h.realm)||isHuman(g,h)||!manager(g,id,h.lord))continue;
  const wallet=funds(g,h),p=live(g,h.lord),war=Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&(w.attacker===h.realm||w.defender===h.realm));
  const order=war||p.traits?.includes('ambitious')?['castle','city','temple']:p.traits?.includes('zealous')||num(g.civic?.provinces?.[id]?.localTrust)<45?['temple','city','castle']:['city','temple','castle'];
  for(const kind of order){const t=subholdingTerms(g,id,kind,h.lord),reserve=wallet.key==='treasury'?600:100;
   if(!t||t.reason||num(wallet.source?.[wallet.key])<t.cost+reserve)continue;
   if(upgrade(g,id,kind,h.lord).ok){built.add(h.realm);changed=true;
    if(kind!=='castle'&&!h.subholdings[kind].holder&&num(wallet.source?.[wallet.key])>=reserve+30){const candidate=subholdingCandidates(g,id,kind).find(p=>!humanControlsCharacter(g,p.id));if(candidate)appoint(g,id,kind,h.lord,candidate.id);}
    break;
   }
  }
 }
 return changed;
}
export function renderSubholdings(g,id,actor,esc,mode='feudal'){
 const h=estate(g,id);if(!h)return '';
 const canManage=!!manager(g,id,actor)&&isHuman(g,h);
 let out='<details class="rule"><summary>Subordinate holdings · castle, city and temple</summary>';
 for(const kind of keys){
  const d=SUBHOLDING_TYPES[kind],key=subholdingKey(id,kind),terms=subholdingTerms(g,id,kind,actor),row=h.subholdings?.[kind],holder=validDelegate(g,h,row?.holder)||live(g,h.lord);
  out+='<div class="rule"><b>'+esc(d.name)+' · '+(terms.level?terms.level+'/3':'Not established')+'</b><p class="smallnote">'+esc(d.description)+(terms.level?' Holder: '+esc(holder?.name||'Vacant'):'')+'</p>';
  if(canManage&&terms.level<3){out+='<button class="rowbtn" data-action="'+mode+'" data-type="subholding-build" data-id="'+esc(key)+'"'+(terms.reason?' disabled':'')+'>'+esc((terms.level?'Improve':'Establish')+' '+d.name+' ('+terms.cost+' '+terms.funding+')')+'</button>';
   if(terms.reason)out+='<p class="smallnote">'+esc(terms.reason)+'</p>';
  }
  if(canManage&&terms.level){const candidates=subholdingCandidates(g,id,kind),field='seat-'+id+'-'+kind;
   if(candidates.length){out+='<label class="smallnote" for="'+esc(field)+'">Seat holder</label><select class="select" id="'+esc(field)+'">'+candidates.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('')+'</select><button class="rowbtn" data-action="'+mode+'" data-type="subholding-appoint" data-id="'+esc(key)+'" data-extra="'+esc(key)+'" data-input="'+esc(field)+'">Appoint (30 '+esc(terms.funding)+')</button>';}
  }
  out+='</div>';
 }
 return out+'</details>';
}
