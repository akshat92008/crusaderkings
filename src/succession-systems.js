import {personalUnion} from './personal-unions.js';
import {characterInfluence} from './character-agency.js';
// One succession calculation for preview, actual inheritance and political elections.
const num=n=>Number.isFinite(n)?n:0;
const free=(g,p)=>p?.alive&&g.feudal?.prisoners?.[p.id]?.status!=='held';
const byAge=(a,b)=>b.age-a.age||a.id.localeCompare(b.id);
const children=(g,p)=>[...new Set(p?.children||[])].map(id=>g.politics.people[id]).filter(Boolean);
const opinion=(g,a,b)=>num(g.chronicles?.relationships?.[[a,b].sort().join('|')]?.opinion);
// Representation preserves the senior branch even if its parent died first.
// A living eligible ancestor precedes descendants; dead or ineligible ancestors
// do not extinguish their entire branch. Foreign residents cannot take a crown yet.
export const crownExcluded=(person,realm)=>Boolean(realm&&(person?.crownExclusion===realm||person?.crownExclusions?.includes(realm)));
export function setCrownExclusion(person,realm,exclude){
 const set=new Set([...(person.crownExclusions||[]),person.crownExclusion].filter(Boolean));
 if(exclude)set.add(realm);else set.delete(realm);
 delete person.crownExclusion;delete person.crownExclusions;
 if(set.size===1)person.crownExclusion=[...set][0];
 else if(set.size>1)person.crownExclusions=[...set].sort();
}
export function hereditaryLine(g,head,law='eldest',crownRealm=null,branchRoot=null){
 if(!head)return [];const seen=new Set([head.id]),out=[];
 function visit(p){if(!p||seen.has(p.id))return;seen.add(p.id);if(free(g,p)&&p.realm===head.realm&&p.house===head.house&&!crownExcluded(p,crownRealm))out.push(p);const list=children(g,p).sort(byAge);if(law==='youngest')list.reverse();for(const c of list)visit(c);}
 const list=branchRoot?[branchRoot]:children(g,head).sort(byAge);if(law==='youngest')list.reverse();for(const c of list)visit(c);
 return out;
}
export function partitionRepresentatives(g,head){const seen=new Set(),out=[];for(const child of children(g,head).sort(byAge)){const rep=hereditaryLine(g,head,'eldest',head.realm,child)[0];if(rep&&!seen.has(rep.id)){seen.add(rep.id);out.push(rep);}}return out;}
export function electionView(g,realm){
 const s=g.politics?.realms?.[realm],head=g.politics?.people?.[s?.ruler];if(!head)return {candidates:[],electors:[],winner:null,nominee:null};
 const people=g.politics.people,local=p=>free(g,p)&&p.realm===realm&&p.age>=18,weights=new Map(),candidates=new Map(),council=new Set(Object.values(s.council||{}));
 const add=p=>{if(local(p)&&p.id!==head.id&&!crownExcluded(p,realm))candidates.set(p.id,p);};
 const addVote=(id,weight)=>{if(local(people[id])||id===head.id)weights.set(id,(weights.get(id)||0)+weight);};
 addVote(head.id,3);
 for(const p of hereditaryLine(g,head))add(p);
 for(const [id,h] of Object.entries(g.politics.holdings||{})){if(h.realm!==realm||g.provinces[id]?.owner!==realm)continue;const p=people[h.lord];if(!local(p)||p.id===head.id)continue;add(p);addVote(p.id,1+Math.min(3,Math.floor(num(g.provinces[id].development)/5)));}
 for(const id of council){add(people[id]);if(id!==head.id)addVote(id,1);}
 const nominee=candidates.has(s.nominee)?s.nominee:null,heirs=new Set(hereditaryLine(g,head,'eldest',realm).map(p=>p.id)),electors=[],votes=new Map();
 for(const [id,raw] of weights){const voter=people[id],weight=Math.min(raw,8);if(!voter||!candidates.size)continue;
 const score=p=>num(p.skills?.diplomacy)*3+num(p.skills?.martial)*2+num(p.skills?.stewardship)+characterInfluence(g,p.id)*.12+opinion(g,id,p.id)*.45+(heirs.has(p.id)?6:0)+(voter.house===p.house?8:0)+(p.traits?.includes('just')?4:0)-(p.traits?.includes('deceitful')?3:0)+(p.id===id?5:0)+(p.id===nominee?(id===head.id?100:Math.max(0,opinion(g,id,head.id)*.12+4)):0);
 const ranked=[...candidates.values()].map(p=>({id:p.id,score:score(p)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));const pick=ranked[0];votes.set(pick.id,(votes.get(pick.id)||0)+weight);electors.push({id,weight,vote:pick.id,score:Math.round(pick.score)});}
 const rows=[...candidates.values()].map(p=>({id:p.id,votes:votes.get(p.id)||0,skill:num(p.skills?.diplomacy)+num(p.skills?.martial)})).sort((a,b)=>b.votes-a.votes||b.skill-a.skill||a.id.localeCompare(b.id));
 return {candidates:rows,electors,winner:rows[0]?.id||null,nominee};
}
export function successionCandidates(g,realm){const s=g.politics?.realms?.[realm],head=g.politics?.people?.[s?.ruler];if(!head)return [];const residence=personalUnion(g,realm)?.junior===realm?head.realm:realm;if(s.law==='elective')return electionView(g,realm).candidates.map(x=>g.politics.people[x.id]);
 if(s.law==='seniority'){
  return Object.values(g.politics.people)
   .filter(p=>p.id!==head.id&&p.realm===residence&&p.house===head.house&&free(g,p)&&!crownExcluded(p,realm))
   .sort(byAge);
 }
 const line=hereditaryLine(g,head,s.law,realm),seen=new Set([head.id,...line.map(p=>p.id)]);const relatives=[];
 // If descendants are exhausted, prefer siblings and their descendants before distant dynasts.
 for(const id of head.parents||[]){const parent=g.politics.people[id];for(const p of hereditaryLine(g,parent,s.law,realm))if(p.realm===residence&&p.house===head.house&&!seen.has(p.id)){seen.add(p.id);relatives.push(p);}}
 return [...line,...relatives];}
export function nominateSuccessor(g,realm,id){const s=g.politics?.realms?.[realm];if(s?.law!=='elective')return {ok:false,msg:'Nomination requires elective succession.'};if(!electionView(g,realm).candidates.some(x=>x.id===id))return {ok:false,msg:'Choose an eligible adult candidate.'};s.nominee=id;return {ok:true,msg:'Nomination recorded. Other electors retain their own votes.'};}

// Crown exclusions are personal and realm-specific. Descendants can represent
// their branch, and private estates keep their ordinary rules of inheritance.
export function crownExclusionTerms(g,realm,id){
 const s=g.politics?.realms?.[realm],r=g.politics?.people?.[s?.ruler],p=g.politics?.people?.[id];
 if(!r||!p?.alive||p.realm!==(personalUnion(g,realm)?.junior===realm?r.realm:realm)||p.house!==r.house||r.id===id)return null;
 const excluded=crownExcluded(p,realm);
 if(!excluded&&!successionCandidates(g,realm).some(c=>c.id===id))return null;
 return {excluded,prestige:excluded?15:25,legitimacy:excluded?5:10};
}
