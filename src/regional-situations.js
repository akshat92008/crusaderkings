// Conditional situations describe alternate-history pressures, not predetermined historical events.
import {controller} from './campaign-war.js';
const rows=[
 [
  "french_recovery",
  "French provincial reconstruction",
  [
   "france"
  ],
  "unrest",
  42,
  22,
  150,
  "Reopen local public works",
  "War damage and weak local order can obstruct recovery."
 ],
 [
  "burgundian_credit",
  "Burgundian household credit",
  [
   "burgundy"
  ],
  "credit",
  45,
  70,
  125,
  "Support merchant arbitration",
  "Court obligations depend on the confidence of merchants."
 ],
 [
  "castilian_communities",
  "Castilian community accommodation",
  [
   "castile"
  ],
  "acceptance",
  45,
  70,
  130,
  "Hear community representatives",
  "Local cultural grievances may undermine cooperation."
 ],
 [
  "atlantic_ports",
  "Atlantic port confidence",
  [
   "portugal"
  ],
  "credit",
  50,
  75,
  130,
  "Sponsor port arbitration",
  "Maritime patronage depends on trusted commercial arrangements."
 ],
 [
  "aragonese_estates",
  "Aragonese estate obligations",
  [
   "aragon"
  ],
  "loyalty",
  45,
  68,
  145,
  "Negotiate estate obligations",
  "Landed agreements require continuing political consent."
 ],
 [
  "polish_magnates",
  "Polish magnate cooperation",
  [
   "poland"
  ],
  "loyalty",
  40,
  65,
  155,
  "Hear the landed delegations",
  "Powerful landed households can contest court authority."
 ],
 [
  "moscow_authority",
  "Muscovite provincial authority",
  [
   "muscovy"
  ],
  "pressure",
  65,
  35,
  145,
  "Convene a faction hearing",
  "Competing political networks can obstruct the court."
 ],
 [
  "novgorod_merchants",
  "Novgorodian merchant confidence",
  [
   "novgorod"
  ],
  "credit",
  45,
  72,
  120,
  "Arbitrate merchant petitions",
  "Commercial confidence is important to the urban court."
 ],
 [
  "ottoman_frontiers",
  "Ottoman frontier communities",
  [
   "ottomans"
  ],
  "trust",
  42,
  67,
  155,
  "Review frontier administration",
  "Local trust can deteriorate under strained provincial administration."
 ],
 [
  "mamluk_provisions",
  "Mamluk provisioning networks",
  [
   "mamluks"
  ],
  "grain",
  14,
  32,
  145,
  "Replenish municipal granaries",
  "Urban and provincial supply networks face pressure when stores fall."
 ],
 [
  "timurid_households",
  "Timurid household competition",
  [
   "timurids"
  ],
  "pressure",
  60,
  30,
  150,
  "Hear rival household delegations",
  "Organized court opposition can complicate dynastic politics."
 ],
 [
  "qara_allegiances",
  "Qara Qoyunlu allegiance",
  [
   "qara"
  ],
  "loyalty",
  42,
  68,
  140,
  "Recognize local obligations",
  "Regional loyalty is essential to continuing political cooperation."
 ],
 [
  "horde_provisions",
  "Horde seasonal provisions",
  [
   "horde"
  ],
  "grain",
  14,
  30,
  110,
  "Allocate shared food reserves",
  "Communities face insecurity when food stores are depleted."
 ],
 [
  "maghreb_markets",
  "Maghrebi market confidence",
  [
   "morocco"
  ],
  "credit",
  45,
  70,
  125,
  "Convene commercial representatives",
  "Trade confidence and local political authority interact."
 ],
 [
  "ethiopian_institutions",
  "Ethiopian institutional support",
  [
   "ethiopia"
  ],
  "faith",
  40,
  65,
  150,
  "Support local religious institutions",
  "Weak institutional confidence can reduce court backing."
 ],
 [
  "mali_provisions",
  "Mali provincial provisions",
  [
   "mali"
  ],
  "grain",
  12,
  30,
  120,
  "Provide local grain relief",
  "Low food reserves can undermine community security."
 ],
 [
  "songhai_exchange",
  "Songhai caravan confidence",
  [
   "songhai"
  ],
  "credit",
  50,
  73,
  130,
  "Support caravan arbitration",
  "Trade networks require credible commercial rules."
 ],
 [
  "kongo_communities",
  "Kongo local cooperation",
  [
   "kongo"
  ],
  "trust",
  42,
  68,
  110,
  "Consult regional communities",
  "Provincial cooperation depends on continuing local confidence."
 ],
 [
  "kilwa_ports",
  "Swahili coast merchant networks",
  [
   "kilwa"
  ],
  "credit",
  48,
  75,
  145,
  "Convene coastal merchants",
  "Commercial uncertainty can put pressure on port institutions."
 ],
 [
  "vijayanagara_patronage",
  "Vijayanagara provincial patronage",
  [
   "vijayanagara"
  ],
  "loyalty",
  45,
  70,
  155,
  "Hear provincial chiefs",
  "Regional authority relies on negotiated local cooperation."
 ],
 [
  "bahmani_households",
  "Bahmani court competition",
  [
   "bahmani"
  ],
  "pressure",
  62,
  32,
  145,
  "Arrange a court reconciliation",
  "Competing political households may threaten court cohesion."
 ],
 [
  "delhi_coalitions",
  "Delhi coalition politics",
  [
   "delhi"
  ],
  "pressure",
  58,
  30,
  150,
  "Convene political delegations",
  "Organized factions can strain a vulnerable court."
 ],
 [
  "bengal_provisions",
  "Bengal food and water provision",
  [
   "bengal"
  ],
  "grain",
  15,
  35,
  135,
  "Fund provincial grain distribution",
  "A shortage of stores can affect productive settlements."
 ],
 [
  "gujarat_ports",
  "Gujarat commercial institutions",
  [
   "gujarat"
  ],
  "credit",
  50,
  75,
  145,
  "Negotiate market guarantees",
  "Commercial trust is essential to port and inland networks."
 ],
 [
  "joseon_scholars",
  "Joseon institutional deliberation",
  [
   "joseon"
  ],
  "faith",
  42,
  65,
  140,
  "Receive institutional scholars",
  "Low institutional backing can weaken political confidence."
 ],
 [
  "ayutthaya_grain",
  "Ayutthaya rice provisioning",
  [
   "ayutthaya"
  ],
  "grain",
  15,
  35,
  130,
  "Support communal rice stores",
  "Food supplies sustain local communities and the court."
 ],
 [
  "viet_provinces",
  "Đại Việt provincial cooperation",
  [
   "dai-viet"
  ],
  "unrest",
  40,
  20,
  140,
  "Review provincial petitions",
  "Local unrest can obstruct administrative cooperation."
 ],
 [
  "island_commerce",
  "Island and strait commerce",
  [
   "majapahit",
   "malacca"
  ],
  "credit",
  45,
  70,
  140,
  "Sponsor maritime arbitration",
  "Commercial insecurity can affect more than one regional court."
 ],
 [
  "mexica_local_trust",
  "Basin of Mexico local obligations",
  [
   "mexica"
  ],
  "trust",
  40,
  65,
  125,
  "Hear local community petitions",
  "Local cooperation is strained when obligations lose consent."
 ],
 [
  "maya_communities",
  "Maya community cooperation",
  [
   "maya"
  ],
  "trust",
  42,
  68,
  110,
  "Convene local representatives",
  "Community-level political cooperation can weaken over time."
 ],
 [
  "pueblo_provisions",
  "Pueblo seasonal provisioning",
  [
   "pueblo"
  ],
  "grain",
  12,
  28,
  95,
  "Support communal food storage",
  "Low seasonal stocks can threaten settlement security."
 ],
 [
  "haudenosaunee_councils",
  "Haudenosaunee council cooperation",
  [
   "haudenosaunee"
  ],
  "trust",
  43,
  68,
  100,
  "Consult participating communities",
  "Local confidence matters to representative decision-making."
 ],
 [
  "pacific_communities",
  "Pacific island community confidence",
  [
   "maori",
   "fiji"
  ],
  "trust",
  40,
  65,
  100,
  "Support local gatherings",
  "This campaign abstraction follows local trust, not a shared historical state."
 ],
 [
  "australian_communities",
  "Australian local provisioning",
  [
   "aboriginal"
  ],
  "grain",
  12,
  28,
  90,
  "Support local provisioning",
  "This campaign abstraction models local food security, not a centralized historical state."
 ]
];
export const CONDITIONAL_SITUATIONS=rows.map(([id,name,members,metric,bad,good,cost,action,desc])=>({id,name,members,domestic:members.length===1,conditional:true,desc,model:{title:action,action,cost,metric,bad,good,phases:['competition','rivalry','hostility','conciliation'],desc:'Respond to the measured local pressure. Two consecutive healthy quarterly reviews resolve the situation.'}}));
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),mean=(a,fn)=>a.length?a.reduce((n,x)=>n+fn(x),0)/a.length:null;
const highBad=new Set(['unrest','pressure']);
const name={unrest:'Average unrest',credit:'Commercial credit',acceptance:'Local cultural acceptance',loyalty:'Estate loyalty',pressure:'Organized faction pressure',trust:'Local community trust',grain:'Average local grain stocks',faith:'Institutional backing'};
const owned=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
function targets(g,r,m,land){
 if(m==='loyalty')return land.map(p=>g.politics.holdings[p.id]).filter(h=>h?.realm===r&&h.lord!==g.politics.realms[r]?.ruler);
 if(m==='acceptance'||m==='trust')return land.map(p=>g.civic.provinces[p.id]).filter(Boolean);
 if(m==='grain')return land.map(p=>g.economy?.provinces[p.id]?.stock).filter(x=>Number.isFinite(x?.grain));
 if(m==='pressure')return Object.values(g.conflict?.factions||{}).filter(x=>x.realm===r&&['organizing','ultimatum','civil war'].includes(x.status));
 if(m==='unrest')return land;
 return [];
}
function value(g,r,m,land){
 const t=targets(g,r,m,land);
 if(m==='credit')return g.economy?.realms[r]?.credit??null;
 if(m==='faith')return g.identity?.realms[r]?.faithAuthority??null;
 if(m==='pressure')return Math.max(0,...t.map(x=>x.pressure||0));
 const field={loyalty:'loyalty',acceptance:'acceptance',trust:'localTrust',grain:'grain',unrest:'unrest'}[m];
 return mean(t,x=>Number(x[field])||0);
}
export function situationMeasure(g,def,members,cache){
 const m=def.model.metric,values=members.map(r=>({realm:r,value:value(g,r,m,cache?.get(r)||owned(g,r))})).filter(x=>Number.isFinite(x.value));
 const high=highBad.has(m),worst=values.length?Math[high?'max':'min'](...values.map(x=>x.value)):null,bad=worst!==null&&(high?worst>=def.model.bad:worst<=def.model.bad),healthy=worst!==null&&(high?worst<=def.model.good:worst>=def.model.good);
 const span=Math.abs(def.model.bad-def.model.good)||1,severity=worst===null?0:cap(Math.round((high?worst-def.model.good:def.model.good-worst)/span*55),0,100);
 return {values,bad,healthy,severity,label:name[m],available:worst!==null};
}
export function respondToSituation(g,r,def){
 const m=def.model.metric,land=owned(g,r),v=value(g,r,m,land),f=g.factions[r];if(v===null||!land.length||f.treasury<def.model.cost)return false;
 const high=highBad.has(m);if(high?v<=def.model.good:v>=def.model.good)return false;
 const t=targets(g,r,m,land),field={loyalty:'loyalty',acceptance:'acceptance',trust:'localTrust',grain:'grain',unrest:'unrest'}[m];
 if(m==='credit')g.economy.realms[r].credit=cap(v+9,0,100);
 else if(m==='faith')g.identity.realms[r].faithAuthority=cap(v+8,0,100);
 else if(m==='pressure'){const x=t.filter(x=>x.status!=='civil war').sort((a,b)=>b.pressure-a.pressure)[0];if(!x)return false;x.pressure=cap(x.pressure-12,0,100);}
 else if(field){const limit=Math.max(1,Math.ceil(t.length*.5)),ordered=t.slice().sort((a,b)=>high?b[field]-a[field]:a[field]-b[field]);for(const x of ordered.slice(0,limit))x[field]=cap(x[field]+(m==='unrest'?-10:m==='grain'?14:10),0,100);}
 else return false;
 f.treasury-=def.model.cost;return true;
}
