// Financial obligations follow the persistent 5-tier feudal title hierarchy without double-counting.
import {authorityModifiers} from './realm-authority.js';
import {controller} from './campaign-war.js';

const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;

export function feudalHierarchy(g,r){
 const ruler=g.politics?.realms?.[r]?.ruler,people=g.politics?.people||{};
 const titles=g.feudal?.titles||{};
 const regions=Object.values(titles).filter(t=>t.realm===r&&t.tier==='regional'&&people[t.holder]?.alive&&g.feudal?.prisoners?.[t.holder]?.status!=='held');
 const regionalLords=new Set(regions.map(t=>t.holder));
 const byHolding={},byLord={};
 let directCount=0,subCount=0,baronyCount=0;
 const regionByProvince=new Map();
 for(const t of regions)for(const id of t.members||[])regionByProvince.set(id,t);

 for(const [id,h] of Object.entries(g.politics?.holdings||{})){
  if(h.realm!==r||g.provinces?.[id]?.owner!==r)continue;
  const cTitle=titles['c:'+id];
  const transferred=g.feudal?.vassalTransfers?.['c:'+id];
  let liege=ruler;
  if(h.lord===ruler){
   liege=null;
  }else if(transferred&&people[transferred]?.alive&&transferred!==h.lord&&g.feudal?.prisoners?.[transferred]?.status!=='held'){
   liege=transferred;
  }else if(cTitle?.deFactoLiege&&cTitle.deFactoLiege!==h.lord&&people[cTitle.deFactoLiege]?.alive&&g.feudal?.prisoners?.[cTitle.deFactoLiege]?.status!=='held'){
   liege=cTitle.deFactoLiege;
  }else if(!regionalLords.has(h.lord)){
   const t=regionByProvince.get(id);
   if(t?.holder&&t.holder!==h.lord&&t.holder!==ruler)liege=t.holder;
  }
  const kind=h.lord===ruler?'domain':liege&&liege!==ruler?'indirect':'direct';
  const row={id,lord:h.lord,liege,kind};
  byHolding[id]=row;
  if(row.kind==='indirect')subCount++;
  else if(row.kind==='direct')directCount++;
  if(!byLord[h.lord]){
   const p=people[h.lord];
   byLord[h.lord]={liege,holdings:[],subjects:[],baronies:[],personalWealth:num(p?.wealth),estateWealth:0};
  }
  byLord[h.lord].holdings.push(id);
  byLord[h.lord].estateWealth+=num(h.wealth);
  if(row.kind==='direct')byLord[h.lord].liege=ruler;
 }

 // Include subordinate baronies held by distinct barons without double-counting counties.
 const subBaronsByProv=Object.create(null);
 for(const b of Object.values(g.feudal?.baronies||{})){
  if(b.realm!==r||!byHolding[b.province])continue;
  baronyCount++;
  if(b.holder!==byHolding[b.province].lord&&people[b.holder]?.alive){
   const countyLord=byHolding[b.province].lord;
   (subBaronsByProv[b.province]??=[]).push(b);
   if(!byLord[b.holder]){
    byLord[b.holder]={liege:countyLord,holdings:[],subjects:[],baronies:[],personalWealth:num(people[b.holder]?.wealth),estateWealth:0};
   }
   byLord[b.holder].baronies.push(b.id);
   byLord[b.holder].estateWealth+=num(b.wealth);
   if(byLord[countyLord]&&!byLord[countyLord].subjects.includes(b.holder))byLord[countyLord].subjects.push(b.holder);
  }
 }

 for(const x of Object.values(byHolding)){
  if(x.kind==='indirect'&&byLord[x.liege]&&!byLord[x.liege].subjects.includes(x.lord))byLord[x.liege].subjects.push(x.lord);
 }
 return {ruler,byHolding,byLord,directCount,subCount,baronyCount,subBaronsByProv};
}

export function obligationProfile(g,r,hierarchy=feudalHierarchy(g,r)){
 let weight=0,tax=0,levy=0,domain=0,direct=0,indirect=0;
 for(const [id,x] of Object.entries(hierarchy.byHolding)){
  const h=g.politics.holdings[id],p=g.provinces[id];
  if(!h||!p)continue;
  const w=Math.max(1,2*num(p.development)+Math.sqrt(Math.max(0,num(p.population))));
  const loyalty=.65+.35*cap(num(h.loyalty),0,100)/100;
  const layer=x.kind==='indirect'?.92:1;
  const t=x.kind==='domain'?1:h.exemptions?.tax?0:([.8,1,1.15][h.tax]??1)*loyalty*layer;
  const l=x.kind==='domain'?1:h.exemptions?.levy?0:([.75,1,1.2][h.levy]??1)*loyalty*layer;
  weight+=w;tax+=w*t;levy+=w*l;
  if(x.kind==='domain')domain+=w*t;
  else if(x.kind==='direct')direct+=w*t;
  else indirect+=w*t;
 }
 const mod=authorityModifiers(g,r);
 return {
  tax:weight?tax/weight*mod.tax:1,
  levy:weight?levy/weight*mod.levy:1,
  domainShare:tax?domain/tax:0,
  directShare:tax?direct/tax:0,
  indirectShare:tax?indirect/tax:0,
  directCount:hierarchy.directCount,
  subCount:hierarchy.subCount,
  baronyCount:hierarchy.baronyCount||0
 };
}

// Pay the local estate's generated wealth once; intermediate lieges receive a
// share from indirect subjects without double-counting or draining the crown.
export function creditEstateIncome(g,id,amount,hierarchy){
 const h=g.politics.holdings[id],row=hierarchy?.byHolding[id];
 if(!h||!Number.isFinite(amount)||amount<=0)return 0;
 let tribute=0;
 if(row?.kind==='indirect'&&!h.exemptions?.tax&&controller(g,id)===h.realm){
  // Walk up to immediate liege's primary holding (cycle-safe).
  const recipient=(hierarchy.byLord[row.liege]?.holdings||[]).find(key=>g.politics.holdings[key]?.lord===row.liege&&controller(g,key)===h.realm);
  if(recipient){
   tribute=Math.floor(amount*(h.tax===2?.25:h.tax===0?.10:.15));
   g.politics.holdings[recipient].wealth+=tribute;
  }
 }
 let remainder=amount-tribute;
 // If distinct sub-barons hold city/temple baronies in this county, split a modest share to their purses.
 if(remainder>0&&g.feudal?.baronies){
  const subBarons=(hierarchy?.subBaronsByProv?.[id])||Object.values(g.feudal.baronies).filter(b=>b.province===id&&b.holder!==h.lord&&g.politics.people[b.holder]?.alive);
  if(subBarons.length){
   const share=Math.floor(remainder*0.12/subBarons.length);
   if(share>0){
    for(const b of subBarons){
     b.wealth=(b.wealth||0)+share;
     const baron=g.politics.people[b.holder];
     if(baron)baron.wealth=(baron.wealth||0)+Math.floor(share*.5);
     remainder-=share;
    }
   }
  }
 }
 h.wealth+=remainder;
 return tribute;
}

// Exemptions are chartered to the estate and remain in force across inheritance.
export const EXEMPTION_COOLDOWN=24;
export function estateExemptionAction(g,realm,id,type,grant,consent){
 const holding=g.politics.holdings[id],ruler=g.politics.realms[realm]?.ruler,faction=g.factions[realm];
 if(!holding||holding.realm!==realm||holding.lord===ruler||controller(g,id)!==realm||g.provinces[id]?.owner!==realm)return {ok:false,msg:'Choose a vassal estate under your control.'};
 if(!['tax','levy'].includes(type)||Boolean(holding.exemptions?.[type])===grant)return {ok:false,msg:'Choose an exemption that can be changed.'};
 if(g.turn-(holding.lastCharter??-EXEMPTION_COOLDOWN)<EXEMPTION_COOLDOWN)return {ok:false,msg:'Estate charters can change once every 24 months.'};
 if(!grant&&(!consent||faction.legitimacy<60))return {ok:false,msg:'Revocation requires 60 legitimacy and the consent of any binding council or regent.'};
 holding.lastCharter=g.turn;
 if(grant)(holding.exemptions??={})[type]=true;
 else{
  delete holding.exemptions[type];
  faction.legitimacy-=10;
 }
 holding.loyalty=cap(holding.loyalty+(grant?22:-25),0,100);
 return {ok:true,msg:grant?'Estate '+type+' exemption granted.':'Estate '+type+' exemption revoked.'};
}
