// Additional ambitions are measured from authoritative simulation state, not checklist flags.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
import {courtLifeView} from './royal-court.js';
const rows=[
 [
  "granary_network",
  "Economy",
  "Secure the grain stores",
  "Build two additional granary levels in controlled provinces.",
  "granary",
  2,
  18
 ],
 [
  "irrigation_patron",
  "Economy",
  "Patron of irrigation",
  "Build two additional irrigation levels in controlled provinces.",
  "irrigation",
  2,
  18
 ],
 [
  "metalworking",
  "Economy",
  "Develop metalworking",
  "Build two additional smithy levels.",
  "smithy",
  2,
  18
 ],
 [
  "textile_patron",
  "Economy",
  "Patron of weavers",
  "Build two additional weaving workshop levels.",
  "loom",
  2,
  16
 ],
 [
  "medical_endowment",
  "Economy",
  "Improve public care",
  "Build two additional infirmary levels.",
  "infirmary",
  2,
  18
 ],
 [
  "storage_network",
  "Economy",
  "Expand public storage",
  "Build two additional warehouse levels.",
  "warehouse",
  2,
  16
 ],
 [
  "merchant_routes",
  "Economy",
  "Establish merchant routes",
  "Maintain two more active merchant routes than at the start.",
  "routes",
  2,
  18
 ],
 [
  "market_credit",
  "Economy",
  "Restore commercial confidence",
  "Improve credit by 15, up to 100, while holding no outstanding debt.",
  "credit",
  15,
  20
 ],
 [
  "repay_debt",
  "Economy",
  "Free the treasury from debt",
  "Settle all active loans and defaulted arrears while holding 300 gold.",
  "debt",
  0,
  20
 ],
 [
  "new_alliance",
  "Diplomacy",
  "Build an alliance network",
  "Maintain two additional mutual alliances with living realms.",
  "alliances",
  2,
  22
 ],
 [
  "peace_agreements",
  "Diplomacy",
  "Secure written peace",
  "Maintain two additional active non-aggression agreements.",
  "pacts",
  2,
  18
 ],
 [
  "protect_neighbors",
  "Diplomacy",
  "Become a regional guarantor",
  "Maintain two additional active guarantees of other realms.",
  "guarantees",
  2,
  20
 ],
 [
  "commercial_diplomacy",
  "Diplomacy",
  "Cultivate commercial diplomacy",
  "Maintain two additional active bilateral trade pacts.",
  "tradePacts",
  2,
  18
 ],
 [
  "trusted_neighbors",
  "Diplomacy",
  "Earn foreign confidence",
  "Gain two additional foreign courts with mutual relations at least +60.",
  "trusted",
  2,
  20
 ],
 [
  "end_wars",
  "Diplomacy",
  "Restore peace",
  "End all current wars and regain at least 65 stability.",
  "wars",
  0,
  22
 ],
 [
  "royal_audience",
  "Court",
  "Become an attentive sovereign",
  "Improve court reputation by 15, up to 100.",
  "reputation",
  15,
  18
 ],
 [
  "household_staff",
  "Court",
  "Build a capable household",
  "Retain three additional qualified, salaried household officers.",
  "offices",
  3,
  18
 ],
 [
  "court_collection",
  "Court",
  "Become a cultural patron",
  "Complete two new cultural patronage projects.",
  "collection",
  2,
  20
 ],
 [
  "artifact_treasury",
  "Court",
  "Create a royal treasury",
  "Possess two additional intact artifacts.",
  "artifacts",
  2,
  20
 ],
 [
  "court_splendor",
  "Court",
  "Establish a splendid household",
  "Reach 65 court grandeur and increase it by at least 10.",
  "grandeur",
  10,
  20
 ],
 [
  "dynastic_heritage",
  "Family",
  "Strengthen dynastic heritage",
  "Unlock two additional dynasty legacy levels.",
  "legacies",
  2,
  22
 ],
 [
  "mentor_children",
  "Family",
  "Educate the next generation",
  "Improve the combined skills of children who were eligible at the start by four.",
  "childSkills",
  4,
  20
 ],
 [
  "feast_host",
  "Activities",
  "Host a memorable feast",
  "Complete a royal feast during this ambition with quality at least 55.",
  "feast",
  1,
  14
 ],
 [
  "tournament_host",
  "Activities",
  "Host a renowned tournament",
  "Complete a tournament with quality at least 65.",
  "tournament",
  1,
  18
 ],
 [
  "pilgrim_ruler",
  "Activities",
  "Complete a sacred journey",
  "Complete a pilgrimage during this ambition.",
  "pilgrimage",
  1,
  16
 ],
 [
  "provincial_tour",
  "Activities",
  "Visit the provinces",
  "Complete a provincial tour during this ambition.",
  "tour",
  1,
  16
 ],
 [
  "summit_host",
  "Activities",
  "Receive a foreign delegation",
  "Complete a diplomatic summit during this ambition.",
  "summit",
  1,
  18
 ],
 [
  "scholar_gathering",
  "Activities",
  "Gather scholars",
  "Complete a scholarly gathering during this ambition.",
  "symposium",
  1,
  16
 ],
 [
  "religious_host",
  "Activities",
  "Convene religious institutions",
  "Complete a religious assembly during this ambition.",
  "assembly",
  1,
  16
 ],
 [
  "high_legitimacy",
  "Government",
  "Restore confidence in the crown",
  "Increase legitimacy by 15, up to 100, and reach 70 stability.",
  "legitimacy",
  15,
  20
 ],
 [
  "reduce_unrest",
  "Government",
  "Restore provincial order",
  "Reduce average unrest by ten points while preserving controlled land.",
  "unrest",
  10,
  18
 ],
 [
  "local_stewardship",
  "Government",
  "Strengthen local institutions",
  "Raise average local trust by 15 points, up to 100.",
  "trust",
  15,
  18
 ],
 [
  "estate_consent",
  "Government",
  "Reconcile landed estates",
  "Raise average loyalty by 15 points, up to 100, while preserving landed estates.",
  "loyalty",
  15,
  18
 ],
 [
  "regional_settlement",
  "Government",
  "Negotiate a regional settlement",
  "Participate in a newly negotiated settlement of an active regional situation.",
  "settlement",
  1,
  22
 ],
 [
  "counterintelligence",
  "Intrigue",
  "Expose a hostile network",
  "Disrupt two discovered foreign schemes during this ambition.",
  "disruptions",
  2,
  18
 ]
];
export const ADDITIONAL_AMBITIONS=Object.fromEntries(rows.map(([id,category,name,desc,metric,amount,reward])=>[id,{category,name,desc,metric,amount,reward}]));
const active=(g,id)=>!!g.factions[id]&&Object.values(g.provinces).some(p=>p.owner===id);
const sum=(a,fn)=>a.reduce((n,x)=>n+(Number(fn(x))||0),0);
const avg=(a,fn)=>sum(a,fn)/Math.max(1,a.length);
const count=(a,fn)=>a.filter(fn).length;
const activities=new Set(['feast','tournament','pilgrimage','tour','summit','symposium','assembly']);
const capped=new Set(['credit','reputation','legitimacy','trust','loyalty']);
const zero=new Set(['debt','wars']);
const industries=new Set(['granary','irrigation','smithy','loom','infirmary','warehouse']);
function live(g,r,id){const p=g.politics.people[id];return p?.alive&&p.realm===r&&p.age>=18&&!isImprisoned(g,id);}
function snapshot(g,r,metric,base){
 const f=g.factions[r],head=g.politics.people[g.politics.realms[r]?.ruler],land=Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r),holdings=land.map(p=>g.politics.holdings[p.id]).filter(h=>h?.realm===r&&h.lord!==head?.id),court=g.royalCourt?.realms[r],eco=g.economy?.realms[r],other=['alliances','tradePacts','trusted'].includes(metric)?[...new Set(Object.values(g.provinces).map(p=>p.owner))].filter(id=>id!==r&&g.factions[id]):[];
 const started=base?.turn??g.turn;
 let value=0,extra={};
 if(industries.has(metric))value=sum(land,p=>g.economy?.provinces[p.id]?.industries?.[metric]);
 else if(activities.has(metric)){const records=g.heritage?.realms[r]?.activityRecords||[];value=count(records,x=>x.host===head?.id&&x.kind===metric&&x.turn>started&&x.quality>=(metric==='feast'?55:metric==='tournament'?65:0));}
 else switch(metric){
 case 'routes':value=count(Object.values(g.economy?.routes||{}),x=>x.realm===r&&x.status==='active');break;
 case 'credit':value=eco?.credit??0;extra.debt=count(Object.values(g.economy?.loans||{}),x=>x.realm===r&&['active','defaulted'].includes(x.status));break;
 case 'debt':value=count(Object.values(g.economy?.loans||{}),x=>x.realm===r&&['active','defaulted'].includes(x.status));extra.gold=f.treasury;break;
 case 'alliances':value=count(other,id=>f.treaties?.[id]==='alliance'&&g.factions[id].treaties?.[r]==='alliance');break;
 case 'pacts':value=count(Object.values(g.diplomacy?.pacts||{}),x=>x.until>g.turn&&x.members?.includes(r)&&x.members.every(id=>active(g,id)));break;
 case 'guarantees':value=count(Object.values(g.diplomacy?.guarantees||{}),x=>x.guarantor===r&&x.until>g.turn&&active(g,x.protected));break;
 case 'tradePacts':value=count(other,id=>!!g.kingdom?.tradePacts?.[[r,id].sort().join('|')]);break;
 case 'trusted':value=count(other,id=>(f.relations?.[id]??0)>=60&&(g.factions[id].relations?.[r]??0)>=60);break;
 case 'wars':value=count(Object.values(g.conflict?.wars||{}),x=>x.status==='active'&&[x.attacker,x.defender].includes(r));extra.stability=f.stability;break;
 case 'reputation':value=court?.reputation??0;break;
 case 'offices':value=count(Object.values(court?.offices||{}),x=>x.paidUntil>g.turn&&live(g,r,x.person));break;
 case 'collection':value=count(court?.collection||[],x=>x.patron===head?.id&&(x.turn??-1)>started);break;
 case 'artifacts':value=count(Object.values(g.heritage?.artifacts||{}),x=>x.realm===r&&x.durability>0);break;
 case 'grandeur':value=courtLifeView(g,r)?.grandeur??0;break;
 case 'legacies':value=g.heritage?.dynasties?.[r+'|'+head?.house]?.legacies?.length??0;break;
 case 'childSkills':extra.children=base?.children||(head?.children||[]).filter(id=>{const p=g.politics.people[id];return p?.alive&&p.age>=6&&p.age<18&&p.realm===r;});value=sum(extra.children,id=>{const p=g.politics.people[id];return p?.alive&&p.realm===r?sum(Object.values(p.skills||{}),x=>x):0;});break;
 case 'legitimacy':value=f.legitimacy;extra.stability=f.stability;break;
 case 'unrest':value=avg(land,p=>p.unrest);extra.provinces=land.length;break;
 case 'trust':value=avg(land,p=>g.civic.provinces[p.id]?.localTrust);break;
 case 'loyalty':value=avg(holdings,h=>h.loyalty);extra.estates=holdings.length;break;
 case 'settlement':value=count(Object.values(g.heritage?.struggles||{}),x=>x.outcome?.kind==='negotiated'&&x.outcome.turn>started&&Object.hasOwn(x.influence||{},r));break;
 case 'disruptions':value=count(Object.values(g.intrigue?.plots||{}),x=>x.targetRealm===r&&x.disrupted&&x.disruptedAt>started);break;
 }
 return {value,turn:started,...extra};
}
export function ambitionBaseline(g,r,id){const d=Object.hasOwn(ADDITIONAL_AMBITIONS,id)?ADDITIONAL_AMBITIONS[id]:null;return d?snapshot(g,r,d.metric):null;}
export function additionalAmbitionAvailable(g,r,id){const d=ADDITIONAL_AMBITIONS[id];if(!d)return false;const m=d.metric,b=snapshot(g,r,m);if(zero.has(m))return b.value>0;if(capped.has(m)&&b.value>=100)return false;if(m==='unrest')return b.value>=10&&b.provinces>0;if(m==='loyalty')return b.estates>0&&b.value<100;if(m==='childSkills')return b.children.length>0;if(m==='grandeur')return b.value<=90;if(m==='offices')return b.value<=3;if(m==='artifacts')return b.value<=3;if(m==='legacies')return b.value<=10;if(m==='settlement')return Object.values(g.heritage?.struggles||{}).some(x=>x.ended===null&&Object.hasOwn(x.influence||{},r));return true;}
export function additionalAmbitionProgress(g,r,id,base){const d=ADDITIONAL_AMBITIONS[id];if(!d||!base?.goal)return null;const b=base.goal,m=d.metric,x=snapshot(g,r,m,b);let target=b.value+d.amount,done=false,detail='';if(capped.has(m))target=Math.min(100,target);if(m==='grandeur')target=Math.max(65,target);if(zero.has(m))target=0;if(m==='unrest')target=Math.max(0,b.value-d.amount);if(activities.has(m)||['collection','settlement','disruptions'].includes(m))target=d.amount;
 done=m==='unrest'||zero.has(m)?x.value<=target:x.value>=target;
 if(m==='credit'){done&&=x.debt===0;detail='Outstanding loans: '+x.debt;}
 if(m==='debt'){done&&=x.gold>=300;detail='Treasury: '+Math.round(x.gold)+'/300';}
 if(m==='wars'||m==='legitimacy'){const required=m==='wars'?65:70;done&&=x.stability>=required;detail='Stability: '+Math.round(x.stability)+'/'+required;}
 if(m==='unrest'){done&&=x.provinces>=b.provinces;detail='Controlled districts: '+x.provinces+'/'+b.provinces;}
 if(m==='loyalty'){done&&=x.estates>=b.estates;detail='Landed estates: '+x.estates+'/'+b.estates;}
 return {value:Math.round(x.value*10)/10,target:Math.round(target*10)/10,done,detail};
}
