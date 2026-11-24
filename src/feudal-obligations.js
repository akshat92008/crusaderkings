// Financial obligations follow the existing crown/regional/provincial title hierarchy.
import {authorityModifiers} from './realm-authority.js';
import {controller} from './campaign-war.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
export function feudalHierarchy(g,r){const ruler=g.politics?.realms?.[r]?.ruler,people=g.politics?.people||{},regions=Object.values(g.feudal?.titles||{}).filter(t=>t.realm===r&&t.tier==='regional'&&people[t.holder]?.alive&&g.feudal?.prisoners?.[t.holder]?.status!=='held'),regionalLords=new Set(regions.map(t=>t.holder)),byHolding={},byLord={},directCount=0,subCount=0;
 const regionByProvince=new Map();for(const t of regions)for(const id of t.members||[])regionByProvince.set(id,t);
 for(const [id,h] of Object.entries(g.politics?.holdings||{})){if(h.realm!==r||g.provinces?.[id]?.owner!==r)continue;let liege=ruler;if(h.lord===ruler)liege=null;else if(!regionalLords.has(h.lord)){const t=regionByProvince.get(id);if(t?.holder&&t.holder!==h.lord&&t.holder!==ruler)liege=t.holder;}
 const row={id,lord:h.lord,liege,kind:h.lord===ruler?'domain':liege&&liege!==ruler?'indirect':'direct'};byHolding[id]=row;if(row.kind==='indirect')subCount++;else if(row.kind==='direct')directCount++;if(!byLord[h.lord])byLord[h.lord]={liege,holdings:[],subjects:[]};byLord[h.lord].holdings.push(id);if(row.kind==='direct')byLord[h.lord].liege=ruler;
 }
 for(const x of Object.values(byHolding)){if(x.kind==='indirect'&&byLord[x.liege]&&!byLord[x.liege].subjects.includes(x.lord))byLord[x.liege].subjects.push(x.lord);}
 return {ruler,byHolding,byLord,directCount,subCount};}
export function obligationProfile(g,r,hierarchy=feudalHierarchy(g,r)){let weight=0,tax=0,levy=0,domain=0,direct=0,indirect=0;
 for(const [id,x] of Object.entries(hierarchy.byHolding)){const h=g.politics.holdings[id],p=g.provinces[id],w=Math.max(1,2*num(p.development)+Math.sqrt(Math.max(0,num(p.population)))),loyalty=.65+.35*cap(num(h.loyalty),0,100)/100,layer=x.kind==='indirect'?.92:1,t=x.kind==='domain'?1:([.8,1,1.15][h.tax]??1)*loyalty*layer,l=x.kind==='domain'?1:([.75,1,1.2][h.levy]??1)*loyalty*layer;weight+=w;tax+=w*t;levy+=w*l;if(x.kind==='domain')domain+=w*t;else if(x.kind==='direct')direct+=w*t;else indirect+=w*t;}
 const mod=authorityModifiers(g,r);return {tax:weight?tax/weight*mod.tax:1,levy:weight?levy/weight*mod.levy:1,domainShare:tax?domain/tax:0,directShare:tax?direct/tax:0,indirectShare:tax?indirect/tax:0,directCount:hierarchy.directCount,subCount:hierarchy.subCount};}
// Pay the local estate's generated wealth once; a regional liege receives a
// share only from indirect subjects. The sovereign treasury is not charged.
export function creditEstateIncome(g,id,amount,hierarchy){const h=g.politics.holdings[id],row=hierarchy?.byHolding[id];if(!h||!Number.isFinite(amount)||amount<=0)return 0;let tribute=0;if(row?.kind==='indirect'&&controller(g,id)===h.realm){const recipient=(hierarchy.byLord[row.liege]?.holdings||[]).find(key=>g.politics.holdings[key]?.lord===row.liege&&controller(g,key)===h.realm);if(recipient){tribute=Math.floor(amount*(h.tax===2?.25:h.tax===0?.10:.15));g.politics.holdings[recipient].wealth+=tribute;}}h.wealth+=amount-tribute;return tribute;}
