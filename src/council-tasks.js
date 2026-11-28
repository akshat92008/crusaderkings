import {effectiveCharacterSkill,personalPoliticalSupport,recordGrievance} from './character-agency.js';
import {changeOpinion} from './chronicle-systems.js';
// Council assignments are saved, target-bound, and applied once per month.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),no=msg=>({ok:false,msg}),ok=msg=>({ok:true,msg});
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export const COUNCIL_TASKS={
 chancellor:{relations:{name:'Improve foreign relations',skill:'diplomacy',target:'foreign',months:6,cost:30},mediate:{name:'Mediate vassal grievances',skill:'diplomacy',target:'holding',months:4,cost:25}},
 marshal:{control:{name:'Restore provincial order',skill:'martial',target:'holding',months:4,cost:30},train:{name:'Train a field army',skill:'martial',target:'army',months:4,cost:40}},
 steward:{develop:{name:'Develop a province',skill:'stewardship',target:'holding',months:8,cost:80},collect:{name:'Improve tax collection',skill:'stewardship',target:'holding',months:4,cost:25}},
 spymaster:{investigate:{name:'Investigate local misconduct',skill:'intrigue',target:'holding',months:6,cost:45},disrupt:{name:'Disrupt hostile schemes',skill:'intrigue',target:'realm',months:4,cost:30}},
 scholar:{research:{name:'Sponsor scholarship',skill:'learning',target:'realm',months:8,cost:65},reconcile:{name:'Reconcile local communities',skill:'learning',target:'holding',months:6,cost:35}}
};
export const COUNCIL_PERSONAL_AGENDAS=Object.freeze({
 chancellor:[
  {id:'heir_marriage',title:'Dynastic Matchmaking',detail:'Pushing a marriage alliance between your heir and their own noble house.',corrupt:false,secretKind:'patronage'},
  {id:'peace_patronage',title:'Merchant Peace Broker',detail:'Quietly sabotaging war hawks to protect their family’s trade holdings.',corrupt:false,secretKind:'patronage'},
  {id:'foreign_bribe',title:'Foreign Envoy’s Stipend',detail:'Accepting discreet gifts from a neighboring ambassador for soft treaties.',corrupt:true,secretKind:'treason'}
 ],
 steward:[
  {id:'embezzle_15g',title:'Treasury Skimming',detail:'Quietly embezzling 15 gold per month from royal customs tallies.',corrupt:true,monthlySkim:15,secretKind:'embezzlement'},
  {id:'merchant_monopoly',title:'Guild Monopoly Favor',detail:'Granting lucrative guild privileges to allied merchant syndicates.',corrupt:true,monthlySkim:8,secretKind:'embezzlement'},
  {id:'tax_kickback',title:'Estate Tax Shelter',detail:'Shielding allied vassals from full royal taxation in exchange for influence.',corrupt:true,monthlySkim:6,secretKind:'embezzlement'}
 ],
 marshal:[
  {id:'warmonger_glory',title:'Agitating for Border War',detail:'Pressing the crown toward war to win battlefield glory and new fiefs.',corrupt:false,secretKind:'conspiracy'},
  {id:'mercenary_cut',title:'Quartermaster Kickbacks',detail:'Skimming silver from garrison supply and mercenary levy contracts.',corrupt:true,monthlySkim:10,secretKind:'embezzlement'},
  {id:'retinue_patron',title:'Private Retinue Buildup',detail:'Diverting royal arms toward their own household retainers.',corrupt:true,secretKind:'conspiracy'}
 ],
 spymaster:[
  {id:'rival_loyalty',title:'Whispering to a Rival',detail:'Secretly sharing privy council deliberations with a rival faction.',corrupt:true,secretKind:'treason'},
  {id:'shadow_blackmail',title:'Private Hook Ledger',detail:'Using crown informants to collect personal blackmail on rival lords.',corrupt:true,secretKind:'conspiracy'},
  {id:'court_whispers',title:'Information Monopoly',detail:'Filtering intelligence reports to elevate their own standing at court.',corrupt:false,secretKind:'patronage'}
 ],
 scholar:[
  {id:'religious_charter',title:'Clerical Autonomy Charter',detail:'Pushing a sweeping charter granting sanctuaries independence from crown tax.',corrupt:false,secretKind:'patronage'},
  {id:'inquisition_zeal',title:'Purge of Heterodoxy',detail:'Pressing the court to launch harsh crackdowns on minority faiths.',corrupt:false,secretKind:'heresy'},
  {id:'monastic_grants',title:'Abbey Stipend Diversion',detail:'Channeling crown scholarship stipends to favored monastic houses.',corrupt:true,monthlySkim:8,secretKind:'embezzlement'}
 ]
});
const control=(g,id)=>g.campaignWar?.occupations?.[id]?.by||g.provinces[id]?.owner;
const landed=(g,r)=>Object.values(g.provinces).some(p=>p.owner===r&&control(g,p.id)===r);
const councilor=(g,r,role)=>{const p=g.politics?.people?.[g.politics?.realms?.[r]?.council?.[role]];return p?.alive&&p.realm===r&&p.age>=18&&g.feudal?.prisoners?.[p.id]?.status!=='held'?p:null;};
const note=(g,r,msg)=>{if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}};
export function initCouncilTasks(g){const s=g.councilTasks??={version:1,realms:{},delegated:{},agendas:{},history:[],lastTick:-1};s.delegated??={};s.agendas??={};return s;}
export function councilorAgenda(g,r,role){
 const c=councilor(g,r,role),headId=g.politics?.realms?.[r]?.ruler;
 if(!c)return {stance:'vacant',loyaltyNote:'Vacant office',speedBonus:0,siphonPct:0,personal:null,discovered:false,resolved:null};
 const support=headId?personalPoliticalSupport(g,c.id,headId):0;
 const greed=Number(c.personality?.greed||0),diligence=Number(c.personality?.diligence||0),honor=Number(c.personality?.honor||0);
 const selfServing=(support<=-2||greed>=35||(c.traits||[]).includes('greedy')||(c.traits||[]).includes('deceitful'))&&honor<25;
 const devoted=!selfServing&&(support>=2||diligence>=30||(c.traits||[]).includes('diligent')||(c.traits||[]).includes('honest'));
 const pool=COUNCIL_PERSONAL_AGENDAS[role]||[];
 const idx=selfServing?0:(hash(`${c.id}:${role}`)%Math.max(1,pool.length));
 const personal=pool[idx]||null;
 const stateKey=`${r}:${role}:${c.id}`;
 const rec=g.councilTasks?.agendas?.[stateKey]||{discovered:false,resolved:null};
 const base=selfServing
  ?{stance:'self_serving',loyaltyNote:'Self-serving advisor (may skim or stir unrest)',speedBonus:0,siphonPct:0.22}
  :devoted
   ?{stance:'devoted',loyaltyNote:'Devoted counselor (+task pace)',speedBonus:1,siphonPct:0}
   :{stance:'pragmatic',loyaltyNote:'Pragmatic minister (balances duty & ambition)',speedBonus:0,siphonPct:0};
 return {
  ...base,
  personId:c.id,
  personal,
  discovered:Boolean(rec.discovered),
  resolved:rec.resolved||null,
  monthlySkim:(rec.resolved==='confronted'||!personal?.monthlySkim||!selfServing)?0:personal.monthlySkim
 };
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
 if(kind==='agenda-investigate'){
  const root=initCouncilTasks(g),r=g.player,f=g.factions?.[r],c=councilor(g,r,role);
  if(!c||!f)return no('No active councilor in that office.');
  const ag=councilorAgenda(g,r,role);
  if(ag.discovered)return no('Agenda already uncovered.');
  if(f.treasury<40)return no('Need 40 gold to audit this councilor.');
  f.treasury-=40;
  const stateKey=`${r}:${role}:${c.id}`;
  root.agendas[stateKey]={discovered:true,resolved:null,turn:g.turn};
  note(g,r,`Audit uncovered ${c.name}’s agenda: ${ag.personal?.title||'Hidden motive'} — ${ag.personal?.detail||''}`);
  return ok(`Uncovered ${c.name}’s agenda: ${ag.personal?.title||'Personal motive'}.`);
 }
 if(['agenda-confront','agenda-tolerate','agenda-exploit'].includes(kind)){
  const root=initCouncilTasks(g),r=g.player,c=councilor(g,r,role),headId=g.politics?.realms?.[r]?.ruler;
  if(!c)return no('No active councilor in that office.');
  const ag=councilorAgenda(g,r,role),stateKey=`${r}:${role}:${c.id}`;
  if(!ag.discovered)return no('Investigate this councilor’s agenda first.');
  if(ag.resolved)return no('This councilor’s agenda has already been handled.');
  if(kind==='agenda-confront'){
   root.agendas[stateKey]={discovered:true,resolved:'confronted',turn:g.turn};
   if(headId){changeOpinion(g,c.id,headId,-22);recordGrievance(g,c.id,headId,'confronted council agenda',25);}
   if(ag.personal?.monthlySkim&&g.factions?.[r]){const recovered=Math.min(c.wealth||0,60);c.wealth=Math.max(0,(c.wealth||0)-recovered);g.factions[r].treasury+=recovered;}
   note(g,r,`Confronted ${c.name} over "${ag.personal?.title}": skimming halted.`);
   return ok(`Confronted ${c.name}. Corrupt skimming halted (−22 opinion).`);
  }
  if(kind==='agenda-tolerate'){
   root.agendas[stateKey]={discovered:true,resolved:'tolerated',turn:g.turn};
   if(headId)changeOpinion(g,c.id,headId,16);
   for(const h of Object.values(g.politics?.holdings||{}))if(h.realm===r&&h.lord===c.id)h.loyalty=cap(h.loyalty+12,0,100);
   note(g,r,`Quietly tolerated ${c.name}’s agenda (${ag.personal?.title}) to secure their loyalty.`);
   return ok(`Tolerated ${c.name}’s agenda (+16 opinion, +12 estate loyalty).`);
  }
  if(kind==='agenda-exploit'){
   root.agendas[stateKey]={discovered:true,resolved:'exploited',turn:g.turn};
   g.intrigue??={version:1,next:1,seed:145063,plots:{},secrets:{},hooks:{},security:{},history:[],lastTick:-1};
   const sk=ag.personal?.secretKind||'embezzlement';
   const sev=['treason','conspiracy','heresy','murder'].includes(sk)?3:2;
   g.intrigue.hooks[r+':'+c.id]={realm:r,person:c.id,secret:'agenda:'+c.id,kind:sk,strength:sev,tier:sev>=3?'strong':'weak',expires:g.turn+36};
   note(g,r,`Exploited ${c.name}’s hidden agenda (${ag.personal?.title}) into a ${sev>=3?'Strong':'Weak'} Hook!`);
   return ok(`Gained a ${sev>=3?'Strong':'Weak'} Hook on ${c.name} from their hidden agenda!`);
  }
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
export function tickCouncilTasks(g){const root=initCouncilTasks(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;
 // Monthly personal agenda effects (e.g. corrupt Steward skimming 15g/month if unconfronted)
 for(const r of Object.keys(g.politics?.realms||{})){
  const f=g.factions?.[r];if(!f||!landed(g,r))continue;
  for(const role of Object.keys(COUNCIL_TASKS)){
   const ag=councilorAgenda(g,r,role);
   if(ag.stance==='self_serving'&&ag.monthlySkim>0&&f.treasury>ag.monthlySkim+250){
    const c=councilor(g,r,role);
    if(c){f.treasury-=ag.monthlySkim;c.wealth=(c.wealth||0)+ag.monthlySkim;}
   }
  }
 }
 for(const [r,s] of Object.entries(root.realms)){for(const [role,t] of Object.entries(s)){const c=councilor(g,r,role),d=COUNCIL_TASKS[role]?.[t.kind];if(!d||!c||c.id!==t.person||!councilTaskTargets(g,r,role,t.kind).includes(t.target)){delete s[role];note(g,r,'Council assignment cancelled: councilor or target no longer eligible.');continue;}const ag=councilorAgenda(g,r,role),skill=effectiveCharacterSkill(g,c,d.skill);t.progress+=skill+ag.speedBonus;if(t.progress>=t.required){complete(g,r,t,skill,ag);delete s[role];root.history.unshift({realm:r,role,kind:t.kind,target:t.target,turn:g.turn});root.history=root.history.slice(0,150);note(g,r,c.name+' completed '+d.name.toLowerCase()+'.');}}}if(g.turn%3===0&&g.player&&root.delegated?.[g.player])delegateCouncilTasks(g,g.player);if(g.turn%3!==0)return;for(const r of Object.keys(g.politics.realms)){if(r===g.player||!landed(g,r)||g.factions[r].treasury<260)continue;const s=root.realms[r]??={};for(const role of Object.keys(COUNCIL_TASKS)){if(s[role]||g.factions[r].treasury<260)continue;const task=aiTask(g,r,role);if(task){assignCouncilTask(g,r,role,...task);break;}}}}

export function councilorAgendaAction(g, role, action = 'investigate') {
 return councilTaskAction(g, role, action.startsWith('agenda-') ? action : 'agenda-' + action);
}
