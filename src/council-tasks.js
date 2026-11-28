import {effectiveCharacterSkill,personalPoliticalSupport} from './character-agency.js';
// Council assignments are saved, target-bound, and applied once per month.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),no=msg=>({ok:false,msg}),ok=msg=>({ok:true,msg});
export const COUNCIL_TASKS={
 chancellor:{relations:{name:'Improve foreign relations',skill:'diplomacy',target:'foreign',months:6,cost:30},mediate:{name:'Mediate vassal grievances',skill:'diplomacy',target:'holding',months:4,cost:25}},
 marshal:{control:{name:'Restore provincial order',skill:'martial',target:'holding',months:4,cost:30},train:{name:'Train a field army',skill:'martial',target:'army',months:4,cost:40}},
 steward:{develop:{name:'Develop a province',skill:'stewardship',target:'holding',months:8,cost:80},collect:{name:'Improve tax collection',skill:'stewardship',target:'holding',months:4,cost:25}},
 spymaster:{investigate:{name:'Investigate local misconduct',skill:'intrigue',target:'holding',months:6,cost:45},disrupt:{name:'Disrupt hostile schemes',skill:'intrigue',target:'realm',months:4,cost:30}},
 scholar:{research:{name:'Sponsor scholarship',skill:'learning',target:'realm',months:8,cost:65},reconcile:{name:'Reconcile local communities',skill:'learning',target:'holding',months:6,cost:35}}
};
const control=(g,id)=>g.campaignWar?.occupations?.[id]?.by||g.provinces[id]?.owner;
const landed=(g,r)=>Object.values(g.provinces).some(p=>p.owner===r&&control(g,p.id)===r);
const councilor=(g,r,role)=>{const p=g.politics?.people?.[g.politics?.realms?.[r]?.council?.[role]];return p?.alive&&p.realm===r&&p.age>=18&&g.feudal?.prisoners?.[p.id]?.status!=='held'?p:null;};
const note=(g,r,msg)=>{if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}};
export function initCouncilTasks(g){const s=g.councilTasks??={version:1,realms:{},delegated:{},history:[],lastTick:-1};s.delegated??={};return s;}
export function councilorAgenda(g,r,role){
 const c=councilor(g,r,role),headId=g.politics?.realms?.[r]?.ruler;
 if(!c)return {stance:'vacant',loyaltyNote:'Vacant office',speedBonus:0,siphonPct:0};
 const support=headId?personalPoliticalSupport(g,c.id,headId):0;
 const greed=Number(c.personality?.greed||0),diligence=Number(c.personality?.diligence||0),honor=Number(c.personality?.honor||0);
 const selfServing=(support<=-2||greed>=35||(c.traits||[]).includes('greedy')||(c.traits||[]).includes('deceitful'))&&honor<25;
 if(selfServing)return {stance:'self_serving',loyaltyNote:'Self-serving advisor (may skim or stir unrest)',speedBonus:0,siphonPct:0.22};
 const devoted=support>=2||diligence>=30||(c.traits||[]).includes('diligent')||(c.traits||[]).includes('honest');
 if(devoted)return {stance:'devoted',loyaltyNote:'Devoted counselor (+task pace)',speedBonus:1,siphonPct:0};
 return {stance:'pragmatic',loyaltyNote:'Pragmatic minister (balances duty & ambition)',speedBonus:0,siphonPct:0};
}
export function councilTaskTargets(g,r,role,kind){const d=COUNCIL_TASKS[role]?.[kind];if(!d)return [];if(d.target==='realm')return [r];if(d.target==='foreign')return Object.keys(g.politics.realms).filter(id=>id!==r&&landed(g,id));if(d.target==='army')return Object.values(g.armies).filter(a=>a.owner===r&&!g.naval?.voyages?.[a.id]&&control(g,a.province)===r&&a.infantry+a.archers+a.cavalry>0).map(a=>a.id);return Object.values(g.provinces).filter(p=>p.owner===r&&control(g,p.id)===r&&(kind!=='mediate'||g.politics.holdings[p.id]?.lord!==g.politics.realms[r].ruler)).map(p=>p.id);}
export function assignCouncilTask(g,r,role,kind,target){const d=COUNCIL_TASKS[role]?.[kind],c=councilor(g,r,role),f=g.factions[r],s=initCouncilTasks(g);if(!d||!c||!f||!landed(g,r)||!councilTaskTargets(g,r,role,kind).includes(target))return no('Choose an available councilor and valid target.');const realm=s.realms[r]??={};if(realm[role])return no('Cancel or finish the current assignment first.');if(f.treasury<d.cost)return no('Need '+d.cost+' gold.');f.treasury-=d.cost;realm[role]={role,kind,target,person:c.id,started:g.turn,progress:0,required:d.months*3};note(g,r,c.name+' began '+d.name.toLowerCase()+'.');return ok('Assignment started. Progresses each month.');}
export function delegateCouncilTasks(g,r=g.player){
 const root=initCouncilTasks(g),f=g.factions?.[r];
 if(!f||!landed(g,r))return {assigned:0};
 const s=root.realms[r]??={};
 let assigned=0;
 for(const role of Object.keys(COUNCIL_TASKS)){
  if(s[role])continue;
  const task=aiTask(g,r,role);
  if(task&&assignCouncilTask(g,r,role,...task).ok)assigned++;
 }
 return {assigned};
}
export function councilTaskAction(g,role,kind,target){
 if(role==='delegate'){
  const root=initCouncilTasks(g);
  root.delegated[g.player]=!root.delegated[g.player];
  if(root.delegated[g.player])delegateCouncilTasks(g,g.player);
  return ok(root.delegated[g.player]?'Council auto-delegation enabled: idle ministers act on loyalty & agendas.':'Manual council direction restored.');
 }
 if(kind==='cancel'){const realm=initCouncilTasks(g).realms[g.player];if(!realm?.[role])return no('No assignment to cancel.');delete realm[role];return ok('Assignment cancelled. Paid costs are not refunded.');}
 return assignCouncilTask(g,g.player,role,kind,target);
}
function complete(g,r,t,skill,agenda={stance:'pragmatic',siphonPct:0}){const f=g.factions[r],p=g.provinces[t.target],h=g.politics.holdings[t.target],a=g.armies[t.target],c=g.politics?.people?.[t.person];
 switch(t.kind){
 case 'relations':{const o=g.factions[t.target];f.relations[t.target]=cap((f.relations[t.target]||0)+5+skill*2,-100,100);o.relations[r]=cap((o.relations[r]||0)+3+skill,-100,100);break;}
 case 'mediate':if(h)h.loyalty=cap(h.loyalty+5+skill*2,0,100);break;
 case 'control':p.unrest=cap(p.unrest-8-skill*3,0,100);break;
 case 'train':a.experience=cap(a.experience+.02*skill,0,1);a.morale=cap(a.morale+skill*3,0,100);break;
 case 'develop':p.development=cap(p.development+1+(skill>=5?1:0),1,20);break;
 case 'collect':{
  const gross=Math.round(p.development*(3+skill));
  const skim=agenda.siphonPct>0?Math.round(gross*agenda.siphonPct):0;
  f.treasury+=(gross-skim);
  if(c&&skim>0){c.wealth=(c.wealth||0)+skim;note(g,r,`${c.name} quietly pocketed ${skim}g while collecting taxes in ${t.target}.`);}
  if(h)h.loyalty=cap(h.loyalty-(2+(skim>0?2:0)),0,100);
  break;
 }
 case 'investigate':if(h&&h.lord!==g.politics.realms[r].ruler){h.leverageUntil=Math.max(h.leverageUntil||0,g.turn+12);h.loyalty=cap(h.loyalty-3,0,100);}break;
 case 'disrupt':for(const x of Object.values(g.conflict?.schemes||{}))if(x.status==='active'&&x.targetOwner===r)x.chance=cap(x.chance-skill*3,10,90);break;
 case 'research':f.tech=cap(f.tech+.05*skill,1,10);break;
 case 'reconcile':{const local=g.identity?.provinces?.[t.target]||g.civic?.provinces?.[t.target];if(local&&Number.isFinite(local.acceptance))local.acceptance=cap(local.acceptance+skill*2,0,100);p.unrest=cap(p.unrest-skill*2,0,100);break;}
 }}
function aiTask(g,r,role){const f=g.factions[r],ag=councilorAgenda(g,r,role),plan=g.strategy?.plans?.[r],land=Object.values(g.provinces).filter(p=>p.owner===r&&control(g,p.id)===r),byUnrest=land.slice().sort((a,b)=>b.unrest-a.unrest||a.id.localeCompare(b.id)),weak=land.slice().sort((a,b)=>(g.politics.holdings[a.id]?.loyalty??100)-(g.politics.holdings[b.id]?.loyalty??100));if(role==='chancellor'){if(weak[0]&&(g.politics.holdings[weak[0].id]?.loyalty??100)<45)return ['mediate',weak[0].id];if(plan?.target&&councilTaskTargets(g,r,role,'relations').includes(plan.target))return ['relations',plan.target];const foreign=councilTaskTargets(g,r,role,'relations')[0];if(foreign)return ['relations',foreign];}if(role==='marshal'){if(byUnrest[0]?.unrest>35)return ['control',byUnrest[0].id];const a=councilTaskTargets(g,r,role,'train')[0];if(a)return ['train',a];}if(role==='steward'&&land.length)return (ag.stance==='self_serving'||f.treasury<350)?['collect',land[0].id]:['develop',land.slice().sort((a,b)=>a.development-b.development)[0].id];if(role==='spymaster'&&weak[0]&&(g.politics.holdings[weak[0].id]?.loyalty??100)<45)return ['investigate',weak[0].id];if(role==='scholar'&&(byUnrest[0]?.unrest>35||!land.length))return byUnrest[0]?['reconcile',byUnrest[0].id]:['research',r];return null;}
export function tickCouncilTasks(g){const root=initCouncilTasks(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;for(const [r,s] of Object.entries(root.realms)){for(const [role,t] of Object.entries(s)){const c=councilor(g,r,role),d=COUNCIL_TASKS[role]?.[t.kind];if(!d||!c||c.id!==t.person||!councilTaskTargets(g,r,role,t.kind).includes(t.target)){delete s[role];note(g,r,'Council assignment cancelled: councilor or target no longer eligible.');continue;}const ag=councilorAgenda(g,r,role),skill=effectiveCharacterSkill(g,c,d.skill);t.progress+=skill+ag.speedBonus;if(t.progress>=t.required){complete(g,r,t,skill,ag);delete s[role];root.history.unshift({realm:r,role,kind:t.kind,target:t.target,turn:g.turn});root.history=root.history.slice(0,150);note(g,r,c.name+' completed '+d.name.toLowerCase()+'.');}}}if(g.turn%3===0&&g.player&&root.delegated?.[g.player])delegateCouncilTasks(g,g.player);if(g.turn%3!==0)return;for(const r of Object.keys(g.politics.realms)){if(r===g.player||!landed(g,r)||g.factions[r].treasury<260)continue;const s=root.realms[r]??={};for(const role of Object.keys(COUNCIL_TASKS)){if(s[role]||g.factions[r].treasury<260)continue;const task=aiTask(g,r,role);if(task){assignCouncilTask(g,r,role,...task);break;}}}}
