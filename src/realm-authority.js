import {humanControlsRealm} from './player-career.js';
import {
 getObligationLaws,setObligationLaw,obligationLawModifiers,
 grantViceroyalty,oweFavor,callInFavor
} from './ck2-deep-systems.js';
export {
 getObligationLaws,setObligationLaw,obligationLawModifiers,
 grantViceroyalty,oweFavor,callInFavor
};
// Persistent crown authority, domain limits, and estate power, separate from sovereign ownership.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
const TIER_RANK={barony:1,province:2,county:2,regional:3,duchy:3,crown:4,kingdom:4,empire:5};
export const AUTHORITY=[
 {name:'Autonomous estates',tax:.92,levy:.92,loyalty:8,authorityBonus:0},
 {name:'Traditional authority',tax:1,levy:1,loyalty:0,authorityBonus:0},
 {name:'Strong crown',tax:1.08,levy:1.10,loyalty:-8,authorityBonus:1},
 {name:'Centralized crown',tax:1.16,levy:1.20,loyalty:-16,authorityBonus:1}
];
export function initAuthority(g){
 const root=g.authority??={version:1,realms:{},lastTick:-1};
 for(const r of Object.keys(g.politics?.realms||{}))root.realms[r]??={level:1,changed:-120};
 return root;
}
export function authorityLevel(g,r){return cap(Math.floor(g.authority?.realms?.[r]?.level??1),0,3);}
export function estatePower(g,id){
 const p=g.provinces?.[id],h=g.politics?.holdings?.[id];
 return p&&h?Math.round(30+Math.max(0,num(p.development))*9+Math.sqrt(Math.max(0,num(p.population)))*3+Math.min(150,Math.max(0,num(h.wealth))*.08)):0;
}
function rulerRank(g,r,rulerId){
 if(!rulerId)return 4;
 const titles=g.feudal?.titles||{};
 const crown=titles['k:'+r];
 if(crown&&crown.holder===rulerId)return crown.rank||4;
 let best=0;
 for(const t of Object.values(titles)){
  if(!t||t.realm!==r||t.holder!==rulerId||t.tier==='holding')continue;
  const rk=t.rank||TIER_RANK[t.feudalTier||t.tier]||2;
  if(rk>best)best=rk;
 }
 return best||4;
}
export function domainLimit(g,r,personId=g.politics?.realms?.[r]?.ruler){
 const head=g.politics?.people?.[personId];
 let rank=1;
 if(personId===g.politics?.realms?.[r]?.ruler)rank=rulerRank(g,r,personId);
 else{
  for(const t of Object.values(g.feudal?.titles||{})){
   if(t.holder!==personId||t.tier==='holding')continue;
   const rk=t.rank||TIER_RANK[t.feudalTier||t.tier]||1;
   if(rk>rank)rank=rk;
  }
 }
 const rankBase=rank>=5?3:rank===4?2:rank===3?1:0;
 const gov=g.civic?.realms?.[r]?.government;
 const govBonus=gov==='imperial'||gov==='centralized'?1:0;
 const stewardship=Math.max(0,Math.floor(num(head?.skills?.stewardship)/2));
 const authBonus=Math.floor(authorityLevel(g,r)/2);
 return Math.max(1,rankBase+stewardship+authBonus+govBonus);
}
export function vassalLimit(g,r){
 const realm=g.politics?.realms?.[r],head=g.politics?.people?.[realm?.ruler];
 const rank=rulerRank(g,r,realm?.ruler);
 return 6+rank*4+Math.floor(num(head?.skills?.diplomacy)/2)*2;
}
export function politicalEstates(g,r,prefilteredHoldings=null){
 const realm=g.politics?.realms?.[r],council=new Set(Object.values(realm?.council||{})),rows=new Map();
 let domain=0,domainPower=0;
 const entries=prefilteredHoldings||Object.entries(g.politics?.holdings||{});
 for(const [id,h] of entries){
  if(h.realm!==r||g.provinces?.[id]?.owner!==r)continue;
  const p=g.politics.people[h.lord];
  if(!p?.alive)continue;
  const power=estatePower(g,id);
  if(h.lord===realm?.ruler){domain++;domainPower+=power;continue;}
  const x=rows.get(p.id)||{id:p.id,holdings:[],power:0,loyalty:0,onCouncil:council.has(p.id),imprisoned:g.feudal?.prisoners?.[p.id]?.status==='held'};
  x.holdings.push(id);x.power+=power;x.loyalty+=num(h.loyalty)*power;rows.set(p.id,x);
 }
 const ranked=[...rows.values()].sort((a,b)=>b.power-a.power||a.id.localeCompare(b.id));
 const total=ranked.reduce((n,x)=>n+x.power,domainPower);
 const powerful=new Set(ranked.filter(x=>!x.imprisoned&&x.power>=Math.max(45,total*.07)).slice(0,4).map(x=>x.id));
 for(const x of ranked){
  x.loyalty=Math.round(x.loyalty/Math.max(1,x.power));
  x.share=x.power/Math.max(1,total);
  x.powerful=powerful.has(x.id);
  x.grievance=x.powerful&&!x.onCouncil?12:0;
 }
 const limit=domainLimit(g,r,realm?.ruler),excess=Math.max(0,domain-limit);
 const vLimit=vassalLimit(g,r),vassalExcess=Math.max(0,ranked.length-vLimit);
 return {domain,domainPower,limit,excess,vassalLimit:vLimit,vassalExcess,total,rows:ranked,byLord:Object.fromEntries(ranked.map(x=>[x.id,x]))};
}
export function authorityModifiers(g,r,estates=politicalEstates(g,r)){
 const d=AUTHORITY[authorityLevel(g,r)];
 const excess=estates.excess||0;
 const taxPenalty=Math.max(.45,1-excess*.08);
 const levyPenalty=Math.max(.55,1-excess*.05-(estates.vassalExcess||0)*.02);
 const opinionPenalty=Math.min(30,excess*5);
 return {tax:d.tax*taxPenalty,levy:d.levy*levyPenalty,loyalty:d.loyalty-opinionPenalty,opinionPenalty,excess};
}
export function authorityAction(g,r,target,consent=true){
 const f=g.factions?.[r],s=initAuthority(g).realms[r],n=Number(target);
 if(!f||!s||!Number.isInteger(n)||n<0||n>3||Math.abs(n-s.level)!==1)return {ok:false,msg:'Change authority one level at a time.'};
 if(g.turn-s.changed<60)return {ok:false,msg:'Authority can change only once every five years.'};
 if(n>s.level&&(!consent||f.legitimacy<65||f.treasury<200))return {ok:false,msg:'Higher authority requires council consent, 65 legitimacy and 200 gold.'};
 if(n>s.level)f.treasury-=200;
 s.level=n;s.changed=g.turn;
 return {ok:true,msg:'Crown authority: '+AUTHORITY[n].name+'.'};
}
export function tickAuthority(g){
 const root=initAuthority(g);
 if(root.lastTick===g.turn)return;
 root.lastTick=g.turn;
 if(g.turn%12!==0)return;
 const holdingsByRealm=new Map();
 for(const pair of Object.entries(g.politics?.holdings||{})){
  const rId=pair[1]?.realm;if(!rId)continue;
  let arr=holdingsByRealm.get(rId);if(!arr){arr=[];holdingsByRealm.set(rId,arr);}arr.push(pair);
 }
 for(const [r,s] of Object.entries(root.realms)){
  if(humanControlsRealm(g,r))continue;
  const f=g.factions[r],realm=g.politics.realms[r],head=g.politics.people[realm?.ruler],est=politicalEstates(g,r,holdingsByRealm.get(r)||[]);
  if(!f||!head?.alive||!est.total)continue;
  const danger=est.rows.reduce((n,x)=>n+(x.loyalty<40?x.power:0),0)/est.total;
  if(s.level>0&&danger>.40)authorityAction(g,r,s.level-1);
  else if(s.level<3&&danger<.10&&f.legitimacy>=85&&f.treasury>=700&&head.traits?.includes('ambitious')&&g.conflict?.council?.[r]!=='binding')authorityAction(g,r,s.level+1);
  const x=est.rows.find(x=>x.powerful&&!x.onCouncil&&x.loyalty<55),p=g.politics.people[x?.id];
  if(!p||p.age<18||x.imprisoned||f.treasury<380||Object.values(g.royalCourt?.realms?.[r]?.offices||{}).some(o=>o.person===p.id))continue;
  const skills={chancellor:'diplomacy',marshal:'martial',steward:'stewardship',spymaster:'intrigue',scholar:'learning'};
  const slot=Object.entries(realm.council).filter(([role,id])=>!est.byLord[id]?.powerful&&num(p.skills?.[skills[role]])>=num(g.politics.people[id]?.skills?.[skills[role]])-1).sort((a,b)=>num(p.skills?.[skills[b[0]]])-num(p.skills?.[skills[a[0]]])||a[0].localeCompare(b[0]))[0];
  if(slot){f.treasury-=80;realm.council[slot[0]]=p.id;}
 }
}
