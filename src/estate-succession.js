import {humanControlsRealm} from './player-career.js';
// Provincial charters govern the estate. Personal wealth and crown succession
// keep their own inheritance rules.
import {controller} from './campaign-war.js';
import {hereditaryLine} from './succession-systems.js';
import {councilPermission} from './political-conflict.js';
import {authorityLevel} from './realm-authority.js';
import {personalOpinion} from './chronicle-systems.js';

export const ESTATE_LAWS={
 customary:{name:'Customary inheritance',description:'The closest eligible descendant by senior branch inherits.'},
 seniority:{name:'House seniority',description:'The oldest free adult of the holder’s house in this realm inherits.'},
 elective:{name:'District election',description:'The crown and landed lords in the district vote for an eligible adult.'},
 reversion:{name:'Crown reversion',description:'The estate returns to the crown when its current holder dies.'}
};
const TERMS={cost:75,interval:36,legitimacy:55};
const no=msg=>({ok:false,msg}),ok=msg=>({ok:true,msg});
const active=(g,id)=>g.feudal?.prisoners?.[id]?.status==='held';
const sovereign=(g,realm)=>g.politics.people[g.politics.realms[realm]?.ruler];

export function estateLaw(g,id){
 const law=g.politics.holdings[id]?.successionLaw;
 return Object.hasOwn(ESTATE_LAWS,law)?law:'customary';
}

function localAdult(g,p,realm){
 return p?.alive&&p.age>=18&&p.realm===realm&&!active(g,p.id);
}

function districtElection(g,id,realm,holder,crown){
 const title=g.feudal?.titles?.['c:'+id],district=g.feudal?.titles?.[title?.parent];
 const people=g.politics.people,weights=new Map(),candidates=new Map();
 if(localAdult(g,crown,realm))weights.set(crown.id,2);
 for(const province of district?.members??[id]){
  const lord=people[g.politics.holdings[province]?.lord];
  if(g.provinces[province]?.owner!==realm||controller(g,province)!==realm||!localAdult(g,lord,realm)||lord.id===holder.id)continue;
  if(lord.id===crown?.id)continue;
  candidates.set(lord.id,lord);
  weights.set(lord.id,Math.min(4,(weights.get(lord.id)||0)+1));
 }
 for(const p of hereditaryLine(g,holder))if(localAdult(g,p,realm)&&p.id!==crown?.id)candidates.set(p.id,p);
 const rows=[...candidates.values()].map(p=>({person:p,weight:0,ability:(p.skills?.stewardship||0)*3+(p.skills?.diplomacy||0)*2}));
 const ballots=[];
 for(const [id,weight] of weights){
  if(!rows.length)break;
  const voter=people[id];
  const score=row=>row.ability+personalOpinion(g,voter.id,row.person.id)*.30+
   (voter.house===row.person.house?8:0)+(voter.id===row.person.id?4:0);
  const choice=rows.slice().sort((a,b)=>score(b)-score(a)||a.person.id.localeCompare(b.person.id))[0];
  choice.weight+=weight;
  ballots.push({voter:id,candidate:choice.person.id,weight});
 }
 rows.sort((a,b)=>b.weight-a.weight||b.ability-a.ability||a.person.id.localeCompare(b.person.id));
 return {heir:ballots.length?rows[0].person:crown,ballots};
}

// Evaluate the same existing characters before or after the holder dies.
export function estateSuccession(g,id,law=estateLaw(g,id)){
 const h=g.politics.holdings[id],holder=g.politics.people[h?.lord];
 if(!holder)return {heir:null,ballots:[]};
 const crown=sovereign(g,h.realm);
 if(law==='reversion')return {heir:crown,ballots:[]};
 if(law==='seniority'){
  const kin=Object.values(g.politics.people).filter(p=>p.id!==holder.id&&p.house===holder.house&&localAdult(g,p,h.realm));
  kin.sort((a,b)=>b.age-a.age||a.id.localeCompare(b.id));
  return {heir:kin[0]??crown,ballots:[]};
 }
 if(law==='elective')return districtElection(g,id,h.realm,holder,crown);
 return {heir:hereditaryLine(g,holder).find(p=>p.realm===h.realm)??null,ballots:[]};
}

export function estateCharterTerms(g,realm,id){
 const h=g.politics.holdings[id],r=sovereign(g,realm),f=g.factions[realm];
 if(!h||!r||!f||h.realm!==realm||g.provinces[id]?.owner!==realm||controller(g,id)!==realm||h.lord===r.id)return null;
 const cooldown=Math.max(0,(h.lastSuccessionLaw??-TERMS.interval)+TERMS.interval-g.turn);
 const reason=cooldown?'The charter can be amended in '+cooldown+' months.'
  :!localAdult(g,r,realm)?'Requires a free adult sovereign.'
  :f.treasury<TERMS.cost||f.legitimacy<TERMS.legitimacy?'Requires 75 gold and 55 legitimacy.'
  :!councilPermission(g,realm,'law')?'The council or regent rejects this charter.'
  :h.loyalty<60&&!(h.leverageUntil>g.turn)?'Requires estate loyalty of 60 or a proven claim against the holder.':'';
 return {cost:TERMS.cost,reason};
}

export function amendEstateCharter(g,realm,id,law){
 const terms=estateCharterTerms(g,realm,id);
 if(!terms)return no('Choose a controlled vassal estate.');
 if(!Object.hasOwn(ESTATE_LAWS,law)||law===estateLaw(g,id))return no('Choose a different inheritance rule.');
 if(terms.reason)return no(terms.reason);
 const h=g.politics.holdings[id];
 g.factions[realm].treasury-=terms.cost;
 h.lastSuccessionLaw=g.turn;
 h.successionLaw=law;
 h.loyalty=Math.max(0,h.loyalty-(law==='reversion'?15:8));
 return ok(ESTATE_LAWS[law].name+' recorded for '+id+'.');
}

export function tickEstateCharters(g){
 if(g.turn%12!==0)return;
 for(const [realm,f] of Object.entries(g.factions)){
  if(humanControlsRealm(g,realm)||f.treasury<600||f.legitimacy<75||authorityLevel(g,realm)<2)continue;
  if(!sovereign(g,realm)?.traits?.includes('ambitious'))continue;
  for(const [id,h] of Object.entries(g.politics.holdings)){
   if(h.realm!==realm||!(h.leverageUntil>g.turn)||h.loyalty>55||estateLaw(g,id)!=='customary')continue;
   if(amendEstateCharter(g,realm,id,'reversion').ok)break;
  }
 }
}
