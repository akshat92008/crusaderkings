import {personalUnion} from './personal-unions.js';
import {characterInfluence,personalPoliticalSupport} from './character-agency.js';

// One succession calculation for preview, actual inheritance, per-title laws, and political elections.
const num=n=>Number.isFinite(n)?n:0;
const free=(g,p)=>p?.alive&&g.feudal?.prisoners?.[p.id]?.status!=='held';
const byAge=(a,b)=>b.age-a.age||a.id.localeCompare(b.id);
const children=(g,p)=>[...new Set(p?.children||[])].map(id=>g.politics.people[id]).filter(Boolean);
const opinion=(g,a,b)=>num(g.chronicles?.relationships?.[[a,b].sort().join('|')]?.opinion);

export const GENDER_LAWS={
 equal:'Equal inheritance',
 male_preference:'Male preference',
 female_preference:'Female preference',
 male_only:'Male only',
 female_only:'Female only'
};
export const FAITH_LAWS={any:'Any faith',same_faith:'Crown faith required'};
export const SUCCESSION_LAWS={
 eldest:'Primogeniture (eldest)',
 primogeniture:'Primogeniture',
 turkish_open:'Open (strongest landed child)',
 youngest:'Ultimogeniture (youngest)',
 ultimogeniture:'Ultimogeniture',
 partition:'Gavelkind / Partition',
 gavelkind:'Gavelkind / Partition',
 seniority:'House seniority',
 elective:'Elective succession',
 tanistry:'Tanistry (senior house electors)',
 patrician_elective:'Patrician Elective (merchant houses)'
};

export function normalizeSuccessionLaw(law){
 if(law==='primogeniture')return 'eldest';
 if(law==='ultimogeniture')return 'youngest';
 if(law==='gavelkind')return 'partition';
 return Object.hasOwn(SUCCESSION_LAWS,law)?law:'eldest';
}

export function normalizeGenderLaw(law){
 const aliases={absolute_cognatic:'equal',agnatic_cognatic:'male_preference',enatic_cognatic:'female_preference',agnatic:'male_only',enatic:'female_only'};
 const mapped=aliases[law]||law;
 return Object.hasOwn(GENDER_LAWS,mapped)?mapped:'equal';
}

export function governmentSuccessionProfile(g,realm){
 const gov=g.civic?.realms?.[realm]?.government||'feudal';
 if(gov==='republic'||gov==='city')return {defaultLaw:'patrician_elective',allowed:['patrician_elective','elective']};
 if(['steppe','confederation','kinship'].includes(gov))return {defaultLaw:'tanistry',allowed:['tanistry','elective','seniority','partition','gavelkind','eldest','primogeniture']};
 if(gov==='sultanate')return {defaultLaw:'turkish_open',allowed:['turkish_open','eldest','primogeniture','seniority','elective','partition','gavelkind']};
 return {defaultLaw:'eldest',allowed:['eldest','primogeniture','youngest','ultimogeniture','partition','gavelkind','seniority','elective','tanistry']};
}

export function crownPolicy(g,realm){
 const s=g.politics?.realms?.[realm];
 return {
  gender:normalizeGenderLaw(s?.genderLaw),
  faith:Object.hasOwn(FAITH_LAWS,s?.faithLaw)?s.faithLaw:'any'
 };
}

export function titlePolicy(g,titleId){
 const t=g.feudal?.titles?.[titleId],laws=g.feudal?.titleLaws?.[titleId];
 const realm=t?.realm;
 const base=crownPolicy(g,realm);
 return {
  gender:laws?.genderLaw||t?.genderLaw?normalizeGenderLaw(laws?.genderLaw||t?.genderLaw):base.gender,
  faith:Object.hasOwn(FAITH_LAWS,laws?.faithLaw||t?.faithLaw)?(laws?.faithLaw||t?.faithLaw):base.faith
 };
}

export function crownPolicyEligible(g,realm,p,policyOverride=null){
 if(!p)return false;
 if(p.bastard&&!p.legitimized)return false;
 const {gender,faith}=policyOverride||crownPolicy(g,realm);
 if((gender==='male_only'&&p.sex!=='male')||(gender==='female_only'&&p.sex!=='female'))return false;
 const official=g.civic?.realms?.[realm]?.faith,personal=p.civic?.faith??g.civic?.realms?.[p.realm]?.faith;
 return faith!=='same_faith'||!official||personal===official;
}

function branchOrder(g,realm,law,policyOverride=null){
 const {gender}=policyOverride||(realm?crownPolicy(g,realm):{gender:'equal'});
 const preferred=gender==='male_preference'?'male':gender==='female_preference'?'female':null;
 const norm=normalizeSuccessionLaw(law);
 return (a,b)=>(preferred?Number(b.sex===preferred)-Number(a.sex===preferred):0)||(norm==='youngest'?a.age-b.age||b.id.localeCompare(a.id):byAge(a,b));
}

export function marriageLineage(a,b){
 const mother=a.sex==='female'?a:b,father=a.sex==='male'?a:b;
 return mother.marriageLineage==='maternal'&&father.marriageLineage==='maternal'?mother:father;
}

export const crownExcluded=(person,realm)=>Boolean(realm&&(person?.crownExclusion===realm||person?.crownExclusions?.includes(realm)));

export function setCrownExclusion(person,realm,exclude){
 const set=new Set([...(person.crownExclusions||[]),person.crownExclusion].filter(Boolean));
 if(exclude)set.add(realm);else set.delete(realm);
 delete person.crownExclusion;delete person.crownExclusions;
 if(set.size===1)person.crownExclusion=[...set][0];
 else if(set.size>1)person.crownExclusions=[...set].sort();
}

export function hereditaryLine(g,head,law='eldest',crownRealm=null,branchRoot=null,policyOverride=null){
 if(!head)return [];
 const seen=new Set([head.id]),out=[];
 const order=branchOrder(g,crownRealm,law,policyOverride);
 function visit(p){
  if(!p||seen.has(p.id))return;
  seen.add(p.id);
  const eligible=!p.bastard||p.legitimized;
  if(eligible&&free(g,p)&&p.realm===head.realm&&p.house===head.house&&!crownExcluded(p,crownRealm)&&(!crownRealm||crownPolicyEligible(g,crownRealm,p,policyOverride)))out.push(p);
  const list=children(g,p).sort(order);
  for(const c of list)visit(c);
 }
 const list=branchRoot?[branchRoot]:children(g,head).sort(order);
 for(const c of list)visit(c);
 return out;
}

export function partitionRepresentatives(g,head){
 const seen=new Set(),out=[];
 for(const child of children(g,head).sort(branchOrder(g,head.realm,'eldest'))){
  const rep=hereditaryLine(g,head,'eldest',head.realm,child)[0];
  if(rep&&!seen.has(rep.id)){seen.add(rep.id);out.push(rep);}
 }
 return out;
}

export function electionView(g,realm,titleId=null){
 const s=g.politics?.realms?.[realm];
 const t=titleId?g.feudal?.titles?.[titleId]:null;
 const head=g.politics?.people?.[t?.holder||s?.ruler];
 if(!head||!s)return {candidates:[],electors:[],winner:null,nominee:null};
 const people=g.politics.people,local=p=>free(g,p)&&p.realm===realm&&p.age>=18,weights=new Map(),candidates=new Map(),council=new Set(Object.values(s.council||{}));
 const policy=titleId?titlePolicy(g,titleId):crownPolicy(g,realm);
 const add=p=>{if(local(p)&&p.id!==head.id&&!crownExcluded(p,realm)&&crownPolicyEligible(g,realm,p,policy))candidates.set(p.id,p);};
 const addVote=(id,weight)=>{if(local(people[id])||id===head.id)weights.set(id,(weights.get(id)||0)+weight);};
 addVote(head.id,3);
 for(const p of hereditaryLine(g,head,'eldest',realm,null,policy))add(p);
 const scopeProvinces=t?.members?.length?t.members:Object.keys(g.politics.holdings||{});
 for(const id of scopeProvinces){
  const h=g.politics.holdings[id];
  if(!h||h.realm!==realm||g.provinces[id]?.owner!==realm)continue;
  const p=people[h.lord];
  if(!local(p)||p.id===head.id)continue;
  add(p);addVote(p.id,1+Math.min(3,Math.floor(num(g.provinces[id].development)/5)));
 }
 if(!titleId||t?.tier==='crown'||t?.tier==='empire'){
  for(const id of council){add(people[id]);if(id!==head.id)addVote(id,1);}
 }
 const rawLaw=(titleId?(g.feudal?.titleLaws?.[titleId]?.successionLaw||g.feudal?.titles?.[titleId]?.successionLaw):null)||g.politics?.realms?.[realm]?.law||'eldest';
 if(rawLaw==='tanistry'){
  for(const x of Object.values(people))if(x.house===head.house)add(x);
 }
 const directChildIds=new Set(children(g,head).map(c=>c.id));
 const nominee=candidates.has(s.nominee)?s.nominee:null;
 const heirs=new Set(hereditaryLine(g,head,'eldest',realm,null,policy).map(p=>p.id));
 const electors=[],votes=new Map();
 for(const [id,raw] of weights){
  const voter=people[id],weight=Math.min(raw,8);
  if(!voter||!candidates.size)continue;
  const tanistryMod=p=>rawLaw==='tanistry'?((!directChildIds.has(p.id)&&p.age>=28?28:p.age<22?-10:0)+(p.house===head.house?12:0)+num(p.age)*.35):0;
  const patricianMod=p=>rawLaw==='patrician_elective'?(Math.min(40,Math.floor(num(p.wealth)/15))+num(p.prestige)*.6+num(p.skills?.stewardship)*4+num(p.age)*.8+num(g.dlcSystems?.patricianFunds?.[p.id])/12):0;
  const score=p=>num(p.skills?.diplomacy)*3+num(p.skills?.martial)*2+num(p.skills?.stewardship)+characterInfluence(g,p.id)*.12+opinion(g,id,p.id)*.45+personalPoliticalSupport(g,id,p.id)+(heirs.has(p.id)?6:0)+(voter.house===p.house?8:0)+(p.traits?.includes('just')?4:0)-(p.traits?.includes('deceitful')?3:0)+(p.id===id?5:0)+tanistryMod(p)+patricianMod(p)+(p.id===nominee?(id===head.id?100:Math.max(0,opinion(g,id,head.id)*.12+4)):0);
  const ranked=[...candidates.values()].map(p=>({id:p.id,score:score(p)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const pick=ranked[0];
  votes.set(pick.id,(votes.get(pick.id)||0)+weight);
  electors.push({id,weight,vote:pick.id,score:Math.round(pick.score)});
 }
 const rows=[...candidates.values()].map(p=>({id:p.id,votes:votes.get(p.id)||0,skill:num(p.skills?.diplomacy)+num(p.skills?.martial)})).sort((a,b)=>b.votes-a.votes||b.skill-a.skill||a.id.localeCompare(b.id));
 return {candidates:rows,electors,winner:rows[0]?.id||null,nominee};
}

export function titleSuccessionLaw(g,titleId){
 const t=g.feudal?.titles?.[titleId];
 const stored=g.feudal?.titleLaws?.[titleId]?.successionLaw||t?.successionLaw;
 if(stored)return normalizeSuccessionLaw(stored);
 const realm=t?.realm;
 return normalizeSuccessionLaw(g.politics?.realms?.[realm]?.law||'eldest');
}

export function setTitleSuccessionLaw(g,realm,titleId,law,opts={}){
 const t=g.feudal?.titles?.[titleId];
 if(!t||t.realm!==realm)return {ok:false,msg:'Select a title in your realm.'};
 const profile=governmentSuccessionProfile(g,realm);
 if(!profile.allowed.includes(law))return {ok:false,msg:'Government rules forbid '+law+' succession.'};
 const norm=normalizeSuccessionLaw(law);
 const f=g.factions?.[realm];
 const cost=opts.free?0:150;
 if(!opts.free&&(!f||f.treasury<cost||f.legitimacy<55))return {ok:false,msg:'Changing title succession requires 150 gold and 55 legitimacy.'};
 if(f&&cost)f.treasury-=cost;
 g.feudal.titleLaws??={};
 g.feudal.titleLaws[titleId]={...(g.feudal.titleLaws[titleId]||{}),successionLaw:norm};
 t.successionLaw=norm;
 if(titleId==='k:'+realm&&g.politics?.realms?.[realm])g.politics.realms[realm].law=norm;
 return {ok:true,msg:t.name+' succession law set to '+norm+'.'};
}

export function titleSuccessionCandidates(g,titleId){
 const t=g.feudal?.titles?.[titleId];
 if(!t)return [];
 const realm=t.realm,head=g.politics?.people?.[t.holder];
 if(!head)return [];
 const law=titleSuccessionLaw(g,titleId);
 const policy=titlePolicy(g,titleId);
 const residence=personalUnion(g,realm)?.junior===realm?head.realm:realm;
 if(['elective','tanistry','patrician_elective'].includes(law))return electionView(g,realm,titleId).candidates.map(x=>g.politics.people[x.id]).filter(Boolean);
 if(law==='turkish_open'){
  const openScore=p=>{
   const held=Object.values(g.politics?.holdings||{}).filter(h=>h.realm===realm&&h.lord===p.id).length;
   return held*40+num(p.prestige)*1.2+num(p.skills?.martial)*6+num(p.skills?.stewardship)*4+(p.age>=18?20:0)+(children(g,head).some(c=>c.id===p.id)?15:0);
  };
  return Object.values(g.politics.people)
   .filter(p=>p.id!==head.id&&p.realm===residence&&p.house===head.house&&free(g,p)&&!crownExcluded(p,realm)&&crownPolicyEligible(g,realm,p,policy))
   .sort((a,b)=>openScore(b)-openScore(a)||byAge(a,b));
 }
 if(law==='seniority'){
  return Object.values(g.politics.people)
   .filter(p=>p.id!==head.id&&p.realm===residence&&p.house===head.house&&free(g,p)&&!crownExcluded(p,realm)&&crownPolicyEligible(g,realm,p,policy))
   .sort(branchOrder(g,realm,'eldest',policy));
 }
 const line=hereditaryLine(g,head,law,realm,null,policy),seen=new Set([head.id,...line.map(p=>p.id)]),relatives=[];
 for(const id of head.parents||[]){
  const parent=g.politics.people[id];
  for(const p of hereditaryLine(g,parent,law,realm,null,policy))if(p.realm===residence&&p.house===head.house&&!seen.has(p.id)){seen.add(p.id);relatives.push(p);}
 }
 return [...line,...relatives];
}

export function successionCandidates(g,realm){
 const s=g.politics?.realms?.[realm],head=g.politics?.people?.[s?.ruler];
 if(!head)return [];
 const kId='k:'+realm;
 if(g.feudal?.titleLaws?.[kId]?.successionLaw)return titleSuccessionCandidates(g,kId);
 const law=normalizeSuccessionLaw(s.law);
 const residence=personalUnion(g,realm)?.junior===realm?head.realm:realm;
 if(['elective','tanistry','patrician_elective'].includes(law))return electionView(g,realm).candidates.map(x=>g.politics.people[x.id]);
 if(law==='turkish_open'){
  const openScore=p=>{
   const held=Object.values(g.politics?.holdings||{}).filter(h=>h.realm===realm&&h.lord===p.id).length;
   return held*40+num(p.prestige)*1.2+num(p.skills?.martial)*6+num(p.skills?.stewardship)*4+(p.age>=18?20:0)+(children(g,head).some(c=>c.id===p.id)?15:0);
  };
  return Object.values(g.politics.people)
   .filter(p=>p.id!==head.id&&p.realm===residence&&p.house===head.house&&free(g,p)&&!crownExcluded(p,realm)&&crownPolicyEligible(g,realm,p))
   .sort((a,b)=>openScore(b)-openScore(a)||byAge(a,b));
 }
 if(law==='seniority'){
  return Object.values(g.politics.people)
   .filter(p=>p.id!==head.id&&p.realm===residence&&p.house===head.house&&free(g,p)&&!crownExcluded(p,realm)&&crownPolicyEligible(g,realm,p))
   .sort(branchOrder(g,realm,'eldest'));
 }
 const line=hereditaryLine(g,head,law,realm),seen=new Set([head.id,...line.map(p=>p.id)]);
 const relatives=[];
 for(const id of head.parents||[]){
  const parent=g.politics.people[id];
  for(const p of hereditaryLine(g,parent,law,realm))if(p.realm===residence&&p.house===head.house&&!seen.has(p.id)){seen.add(p.id);relatives.push(p);}
 }
 return [...line,...relatives];
}

export function nominateSuccessor(g,realm,id){
 const s=g.politics?.realms?.[realm];
 if(!['elective','tanistry','patrician_elective'].includes(normalizeSuccessionLaw(s?.law)))return {ok:false,msg:'Nomination requires an elective succession law.'};
 if(!electionView(g,realm).candidates.some(x=>x.id===id))return {ok:false,msg:'Choose an eligible adult candidate.'};
 s.nominee=id;
 return {ok:true,msg:'Nomination recorded. Other electors retain their own votes.'};
}

export function dynasticPrestige(g,house){
 if(!house||!g.politics?.people)return 0;
 const members=Object.values(g.politics.people).filter(p=>p.house===house);
 const living=members.filter(p=>p.alive);
 const titles=Object.values(g.feudal?.titles||{}).filter(t=>g.politics.people[t.holder]?.house===house);
 const titleScore=titles.reduce((n,t)=>{
  const r=t.rank||(t.tier==='empire'?5:t.tier==='crown'?4:t.tier==='regional'?3:t.tier==='province'?2:1);
  return n+(r===5?60:r===4?35:r===3?16:r===2?5:2);
 },0);
 const memberPrestige=living.reduce((n,p)=>n+Math.max(0,num(p.prestige)),0);
 const renown=Object.values(g.heritage?.dynasties||{}).filter(d=>d.house===house).reduce((n,d)=>n+num(d.renown),0);
 return Math.round(titleScore+memberPrestige*.4+living.length*4+renown*.5);
}

export function allDynasticPrestige(g){
 const out=Object.create(null);
 if(!g.politics?.people)return out;
 const people=g.politics.people;
 const livingCount=Object.create(null),memberPre=Object.create(null),titleScore=Object.create(null),renownSum=Object.create(null);
 const seenHouses=new Set(Object.keys(g.politics.dynasties||{}));
 for(const p of Object.values(people)){
  if(!p?.alive||!p.house)continue;
  seenHouses.add(p.house);
  livingCount[p.house]=(livingCount[p.house]||0)+1;
  memberPre[p.house]=(memberPre[p.house]||0)+Math.max(0,num(p.prestige));
 }
 for(const t of Object.values(g.feudal?.titles||{})){
  const h=people[t.holder]?.house;
  if(!h)continue;
  seenHouses.add(h);
  const r=t.rank||(t.tier==='empire'?5:t.tier==='crown'?4:t.tier==='regional'?3:t.tier==='province'?2:1);
  titleScore[h]=(titleScore[h]||0)+(r===5?60:r===4?35:r===3?16:r===2?5:2);
 }
 for(const d of Object.values(g.heritage?.dynasties||{})){
  if(!d?.house)continue;
  seenHouses.add(d.house);
  renownSum[d.house]=(renownSum[d.house]||0)+num(d.renown);
 }
 for(const house of seenHouses){
  out[house]=Math.round((titleScore[house]||0)+(memberPre[house]||0)*.4+(livingCount[house]||0)*4+(renownSum[house]||0)*.5);
 }
 return out;
}

// Crown exclusions are personal and realm-specific. Descendants can represent
// their branch, and private estates keep their ordinary rules of inheritance.
export function crownExclusionTerms(g,realm,id){
 const s=g.politics?.realms?.[realm],r=g.politics?.people?.[s?.ruler],p=g.politics?.people?.[id];
 if(!r||!p?.alive||p.realm!==(personalUnion(g,realm)?.junior===realm?r.realm:realm)||p.house!==r.house||r.id===id)return null;
 const excluded=crownExcluded(p,realm);
 if(!excluded&&!successionCandidates(g,realm).some(c=>c.id===id))return null;
 return {excluded,prestige:excluded?15:25,legitimacy:excluded?5:10};
}
