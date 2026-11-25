import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
// Intra-realm estate claims: subjects can contest titles without annexing sovereign territory.
import {authorityLevel,estatePower,politicalEstates} from './realm-authority.js';
import {controller} from './campaign-war.js';
import {syncTitles} from './feudal-systems.js';
import {borderBattleOutcome} from './border-battle.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),live=(g,id)=>{const p=g.politics?.people?.[id];return p?.alive?p:null;},free=(g,id)=>live(g,id)&&g.feudal?.prisoners?.[id]?.status!=='held';
const active=x=>['petition','feud'].includes(x.status),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
export function initEstateConflicts(g){const root=g.estateConflicts??={version:1,next:1,claims:{},history:[],lastTick:-1};root.retinues??={};return root;}
export function estateDisputes(g,r){return Object.values(g.estateConflicts?.claims||{}).filter(x=>x.realm===r&&active(x));}
function note(g,x,message){const root=initEstateConflicts(g);root.history.unshift({realm:x.realm,id:x.id,turn:g.turn,message});root.history=root.history.slice(0,160);if(x.realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
function estate(g,r,id,lord){const h=g.politics.holdings[id];return h&&h.realm===r&&h.lord===lord&&g.provinces[id]?.owner===r&&controller(g,id)===r?h:null;}
function valid(g,x){return free(g,x.claimant)&&free(g,x.defender)&&g.politics.people[x.claimant].realm===x.realm&&g.politics.people[x.defender].realm===x.realm&&estate(g,x.realm,x.origin,x.claimant)&&estate(g,x.realm,x.target,x.defender)&&g.politics.realms[x.realm]?.ruler!==x.claimant&&g.politics.realms[x.realm]?.ruler!==x.defender;}
function loyalty(g,r,id,delta){for(const h of Object.values(g.politics.holdings))if(h.realm===r&&h.lord===id)h.loyalty=cap(h.loyalty+delta,0,100);}
export function openEstateClaim(g,world,r,origin,target,byPlayer=false){const root=initEstateConflicts(g),a=g.politics.holdings[origin],b=g.politics.holdings[target],p=live(g,a?.lord),q=live(g,b?.lord);if(!p||!q||p.id===q.id||p.age<18||q.age<18||!(byPlayer?humanControlsCharacter(g,p.id):p.traits?.includes('ambitious'))||a.autonomy<1||a.wealth<180||!world.provinces.find(x=>x.id===origin)?.neighbors.includes(target)||estateDisputes(g,r).length||Object.values(root.claims).some(x=>x.realm===r&&g.turn-(x.ended??x.started)<48))return no('No eligible neighboring estate dispute.');const x={id:'ec'+root.next,realm:r,claimant:p.id,defender:q.id,origin,target,status:'petition',started:g.turn,deadline:g.turn+6};if(!valid(g,x))return no('The neighboring titles are no longer eligible.');root.next++;a.wealth-=60;root.claims[x.id]=x;note(g,x,p.name+' asserted a disputed claim over '+target+'.');return ok('A local estate claim has been opened.');}
// The private force belongs to the named lord, never to the sovereign's field army.
export function estateRetinue(g,r,actor,id){
 const h=estate(g,r,id,actor),p=g.provinces[id],x=g.estateConflicts?.retinues?.[id];
 if(!h||!p||!free(g,actor)||live(g,actor).age<18||actor===g.politics.realms[r]?.ruler)return null;
 const capacity=Math.max(20,Math.min(240,40+10*(p.development||0)+20*(p.buildings?.barracks||0)));
 const troops=x?.lord===actor&&Number.isFinite(x.troops)?Math.min(capacity,Math.max(0,Math.floor(x.troops))):0;
 return {id,troops,capacity,available:Math.min(20,capacity-troops),wealth:h.wealth,lastRecruit:x?.lord===actor?x.lastRecruit:-120};
}
export function estateRetinueAction(g,r,actor,id,action){
 const v=estateRetinue(g,r,actor,id);if(!v)return no('Only a free adult vassal can command a controlled estate retinue.');
 const root=initEstateConflicts(g),h=g.politics.holdings[id];
 if(action==='recruit'){const count=v.available,cost=count*4;if(count<1||h.wealth<cost||g.turn-(v.lastRecruit??-120)<6)return no('Need estate funds, free retinue capacity and six months between recruitment.');
 h.wealth-=cost;root.retinues[id]={lord:actor,realm:r,troops:v.troops+count,lastRecruit:g.turn};return ok(count+' private retainers recruited for '+cost+' estate gold.');}
 if(action==='disband'&&v.troops>0){root.retinues[id]={lord:actor,realm:r,troops:0,lastRecruit:g.turn};return ok('Private retainers disbanded.');}
 return no('No valid retinue order.');
}
export function estateClaimTargets(g,world,r,actor,id){
 const h=estate(g,r,id,actor),p=live(g,actor);
 if(!h||!p||p.age<18||!free(g,actor)||h.autonomy<1||h.wealth<180||actor===g.politics.realms[r]?.ruler||estateDisputes(g,r).length||Object.values(g.estateConflicts?.claims||{}).some(x=>x.realm===r&&g.turn-(x.ended??x.started)<48))return [];
 return (world?.provinces?.find(q=>q.id===id)?.neighbors||[]).filter(target=>{const b=g.politics.holdings[target],q=live(g,b?.lord);return q?.age>=18&&q.id!==actor&&q.id!==g.politics.realms[r]?.ruler&&q.realm===r&&free(g,q.id)&&estate(g,r,target,q.id);});
}
function maintainRetinues(g,root){
 for(const [id,x] of Object.entries(root.retinues)){const v=estateRetinue(g,x.realm,x.lord,id);
  if(!v){delete root.retinues[id];continue;}x.troops=v.troops;
  if(!v.troops)continue;const h=g.politics.holdings[id],cost=Math.ceil(v.troops*.12);
  if(h.wealth>=cost)h.wealth-=cost;else{x.troops=Math.max(0,x.troops-Math.max(1,Math.ceil((cost-Math.max(0,h.wealth))*2)));h.wealth=Math.max(0,h.wealth-cost);}
 }
}
function retinueLoss(g,r,lord,fraction){for(const x of Object.values(g.estateConflicts?.retinues||{}))if(x.realm===r&&x.lord===lord&&x.troops>0)x.troops=Math.max(0,x.troops-Math.max(1,Math.round(x.troops*fraction)));}
function transfer(g,x){const h=g.politics.holdings[x.target];h.lord=x.claimant;delete g.estateConflicts.retinues[x.target];h.loyalty=cap(h.loyalty+8,35,75);loyalty(g,x.realm,x.defender,-18);syncTitles(g);}
function finish(g,x,result){x.status=result;x.ended=g.turn;note(g,x,'Estate claim '+result+' at '+x.target+'.');}
export function estateDisputeAction(g,r,id,choice){const root=initEstateConflicts(g),x=root.claims[id],f=g.factions[r];if(!x||x.realm!==r||!active(x)||!valid(g,x)||!['mediate','recognize','deny'].includes(choice))return no('No valid active estate dispute.');if(choice==='mediate'){if(f.treasury<90)return no('Mediation requires 90 gold.');f.treasury-=90;g.politics.holdings[x.origin].wealth+=45;g.politics.holdings[x.target].wealth+=45;loyalty(g,r,x.claimant,8);loyalty(g,r,x.defender,8);finish(g,x,'mediated');}else if(choice==='recognize'){if(f.legitimacy<55)return no('Recognizing a disputed claim requires 55 legitimacy.');f.legitimacy-=5;transfer(g,x);finish(g,x,'recognized');}else{loyalty(g,r,x.claimant,-12);finish(g,x,'denied');}return ok('Estate dispute resolved.');}
function retinue(g,x,id){const e=politicalEstates(g,x.realm).byLord[id];const troops=(e?.holdings||[]).reduce((n,h)=>n+(estateRetinue(g,x.realm,id,h)?.troops||0),0);return ((e?.power||0)+troops)*(0.8+Math.min(.4,(live(g,id)?.skills?.martial||1)*.07));}
function resolveFeud(g,x){const a=g.politics.holdings[x.origin],b=g.politics.holdings[x.target];const seed=[...x.id].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0),out=borderBattleOutcome(retinue(g,x,x.claimant),retinue(g,x,x.defender),(seed%100)/100);retinueLoss(g,x.realm,x.claimant,out.attackerLoss);retinueLoss(g,x.realm,x.defender,out.defenderLoss);a.wealth=Math.max(0,a.wealth-Math.round(60+out.attackerLoss*80));b.wealth=Math.max(0,b.wealth-Math.round(60+out.defenderLoss*80));for(const id of [x.origin,x.target])g.provinces[id].unrest=cap(g.provinces[id].unrest+6,0,100);g.factions[x.realm].stability=cap(g.factions[x.realm].stability-2,0,100);if(out.victory){transfer(g,x);finish(g,x,'claimant victory');}else{loyalty(g,x.realm,x.claimant,-6);finish(g,x,'defender victory');}}
export function tickEstateConflicts(g,world){const root=initEstateConflicts(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;maintainRetinues(g,root);if(g.turn%6!==0)return;
 for(const [id,x] of Object.entries(root.claims)){if(!active(x)){if(g.turn-x.ended>72)delete root.claims[id];continue;}if(!valid(g,x)){finish(g,x,'lapsed');continue;}if(!humanControlsRealm(g,x.realm)){const f=g.factions[x.realm],risk=politicalEstates(g,x.realm).byLord[x.claimant]?.powerful;if(f.treasury>400&&risk&&estateDisputeAction(g,x.realm,id,'mediate').ok)continue;}if(x.deadline>g.turn)continue;if(x.status==='petition'){if(authorityLevel(g,x.realm)>=2){estateDisputeAction(g,x.realm,id,'deny');continue;}x.status='feud';x.deadline=g.turn+6;note(g,x,'An internal estate feud has begun. Crown armies are not involved.');}else{for(const [lord,id] of [[x.claimant,x.origin],[x.defender,x.target]])if(!humanControlsCharacter(g,lord)&&g.politics.holdings[id]?.wealth>=260)estateRetinueAction(g,x.realm,lord,id,'recruit');resolveFeud(g,x);}}
 if(g.turn%12!==0)return;const provinces=new Map(world.provinces.map(p=>[p.id,p]));for(const r of Object.keys(g.politics.realms)){if(estateDisputes(g,r).length||Object.values(root.claims).some(x=>x.realm===r&&g.turn-(x.ended??x.started)<48))continue;const est=politicalEstates(g,r);let opened=false;for(const row of est.rows){const p=live(g,row.id);if(!p?.traits?.includes('ambitious')||humanControlsCharacter(g,p.id)||p.age<18||row.imprisoned||row.loyalty>=80)continue;for(const origin of row.holdings){for(const target of provinces.get(origin)?.neighbors||[]){if(openEstateClaim(g,world,r,origin,target).ok){opened=true;break;}}if(opened)break;}if(opened)break;}}
}
