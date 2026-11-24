import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
import {roleplayModifiers} from './roleplay-systems.js';
import {courtModifiers} from './royal-court.js';
// Fictional character-level political schemes. All resolution is abstract and probabilistic.
import {isImprisoned,capturePrisoner} from './feudal-systems.js';
import {personalOpinion,changeOpinion} from './chronicle-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg}),key=(r,id)=>r+':'+id;
const live=(g,id)=>g.politics.people[id]?.alive?g.politics.people[id]:null;
const ruler=(g,r)=>live(g,g.politics.realms[r]?.ruler);
const free=(g,id)=>{const p=live(g,id);return p&&p.age>=18&&!isImprisoned(g,id)?p:null;};
const land=(g,r)=>Object.values(g.provinces).some(p=>p.owner===r);
export const PLOTS={
 investigate:{name:'Discover secrets',category:'hostile',cost:90,months:6},
 discredit:{name:'Discredit character',category:'hostile',cost:120,months:9},
 abduct:{name:'Capture rival',category:'hostile',cost:180,months:12},
 assassinate:{name:'Remove rival',category:'hostile',cost:240,months:15},
 fabricate:{name:'Create contested evidence',category:'hostile',cost:150,months:9},
 sabotage:{name:'Obstruct rival court',category:'hostile',cost:170,months:12},
 sway:{name:'Sway opinion',category:'personal',cost:60,months:6},
 befriend:{name:'Build a friendship',category:'personal',cost:90,months:9},
 reconcile:{name:'Reconcile a rival',category:'personal',cost:80,months:6},
 patronage:{name:'Cultivate patronage',category:'personal',cost:130,months:9},
 courtship:{name:'Courtship',category:'personal',cost:80,months:9},
 influence:{name:'Influence councillor',category:'political',cost:100,months:6},
 undermine:{name:'Undermine political standing',category:'political',cost:130,months:9},
 claimant:{name:'Negotiate claimant support',category:'political',cost:160,months:9},
 faction:{name:'Win over faction member',category:'political',cost:140,months:9}
};
export const SCHEME_APPROACHES={discreet:{name:'Discreet preparation',cost:45,chance:0,exposure:-12,months:2,discovery:-5},focused:{name:'Focused preparation',cost:80,chance:10,exposure:4,months:1,discovery:2},rapid:{name:'Accelerated timetable',cost:60,chance:-8,exposure:10,months:-2,discovery:4}};
export const SECRETS={embezzlement:{name:'Misuse of estate funds',severity:2},conspiracy:{name:'Undisclosed political conspiracy',severity:3},patronage:{name:'Undisclosed patronage arrangement',severity:1},contested:{name:'Contested political allegation',severity:1}};
function note(g,r,msg){const s=g.intrigue;s.history.unshift({realm:r,turn:g.turn,message:msg});s.history=s.history.slice(0,200);if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function initIntrigue(g){const s=g.intrigue??={version:1,next:1,seed:145063,plots:{},secrets:{},hooks:{},security:{},history:[],lastTick:-1};s.outcomes??={};return s;}
export function hookStrength(g,r,id){const h=g.intrigue?.hooks[key(r,id)];return h&&h.expires>g.turn&&live(g,id)?h.strength:0;}
export function knownSecrets(g,r){return Object.values(g.intrigue?.secrets||{}).filter(s=>s.known.includes(r)&&!s.exposed&&live(g,s.person));}
export function activePlots(g,r){return Object.values(g.intrigue?.plots||{}).filter(p=>p.realm===r&&p.status==='active'&&!p.autonomous);}
export function plotCategory(kind){return PLOTS[kind]?.category||'hostile';}
export function canStartPlot(g,r,kind){return Object.hasOwn(PLOTS,kind)&&!activePlots(g,r).some(p=>plotCategory(p.kind)===plotCategory(kind));}
const localHoldings=(g,r,id)=>Object.entries(g.politics.holdings||{}).filter(([p,h])=>h.realm===r&&h.lord===id&&g.provinces[p]?.owner===r);
const activeFactions=(g,r,id)=>Object.values(g.conflict?.factions||{}).filter(x=>x.realm===r&&['organizing','ultimatum'].includes(x.status)&&x.members.some(p=>g.politics.holdings[p]?.lord===id&&g.provinces[p]?.owner===r));
const closeKin=(a,b)=>(a.parents||[]).includes(b.id)||(b.parents||[]).includes(a.id)||(a.parents||[]).some(id=>(b.parents||[]).includes(id));
function eligibleTarget(g,r,actor,p,kind){
 if(!p||!free(g,p.id)||p.id===actor.id)return false;
 const local=p.realm===r,opinion=personalOpinion(g,actor.id,p.id),landed=local&&localHoldings(g,r,p.id).length>0;
 if(kind==='investigate')return !knownSecrets(g,r).some(s=>s.person===p.id&&s.kind!=='contested');
 if(kind==='abduct')return local;
 if(kind==='assassinate')return !local||!!g.feudal?.claimants?.[key(r,p.id)];
 if(kind==='sway')return local&&opinion<75;
 if(kind==='befriend')return local&&opinion>=-20&&opinion<50;
 if(kind==='reconcile')return local&&opinion<0;
 if(kind==='patronage')return local&&opinion<80;
 if(kind==='courtship')return local&&!actor.spouse&&!p.spouse&&!closeKin(actor,p)&&opinion>=-10;
 if(kind==='influence')return local&&Object.values(g.politics.realms[r]?.council||{}).includes(p.id);
 if(kind==='undermine')return landed||!local;
 if(kind==='claimant')return local&&Object.values(g.feudal?.claimants||{}).some(x=>x.realm===r&&x.person===p.id);
 if(kind==='faction')return local&&activeFactions(g,r,p.id).length>0;
 if(kind==='sabotage')return !local;
 if(kind==='fabricate')return !knownSecrets(g,r).some(s=>s.person===p.id&&s.kind==='contested');
 return kind==='discredit';
}
export function plotTargets(g,r,kind){
 const me=ruler(g,r);if(!me||!Object.hasOwn(PLOTS,kind))return [];
 const local=Object.values(g.politics.people).filter(p=>p.realm===r&&p.id!==me.id&&free(g,p.id));
 const foreign=Object.entries(g.politics.realms).filter(([id])=>id!==r).map(([,x])=>free(g,x.ruler)).filter(p=>p&&land(g,p.realm));
 return [...local,...foreign].filter(p=>eligibleTarget(g,r,me,p,kind));
}
function security(g,r){return g.intrigue?.security[r]||{level:0,until:0};}
function defense(g,r){const v=security(g,r),sp=free(g,g.politics.realms[r]?.council?.spymaster);return roleplayModifiers(g,r).defense+courtModifiers(g,r).defense+(v.until>g.turn?v.level*10:0)+(sp?.skills.intrigue||1)*3;}
export function plotOdds(g,p){
 const r=p.actor?free(g,p.actor):ruler(g,p.realm),target=live(g,p.target),sp=free(g,g.politics.realms[p.realm]?.council?.spymaster);if(!r||!target)return {chance:0,exposure:100};
 const agents=(p.agents||[]).filter(id=>free(g,id)&&g.politics.people[id].realm===p.realm),power=agents.reduce((n,id)=>n+(g.politics.people[id].skills?.intrigue||1)*3,0),security=defense(g,target.realm),category=plotCategory(p.kind),preparation=cap(p.preparation||0,-20,25);
 const chance=category==='personal'?45+(r.skills?.diplomacy||1)*6+personalOpinion(g,r.id,target.id)*.25+power*.5+preparation:35+(r.skills?.intrigue||1)*5+(sp?.skills.intrigue||1)*3+power-security+courtModifiers(g,p.realm).scheme+roleplayModifiers(g,p.realm).scheme+preparation+(p.kind==='investigate'?18:p.kind==='assassinate'?-12:0);
 const approach=SCHEME_APPROACHES[p.approach];
 return {chance:Math.round(cap(chance+(approach?.chance||0),8,90)),exposure:Math.round(cap((category==='personal'?10+Math.max(0,-personalOpinion(g,r.id,target.id))*.3:20+security+agents.length*5-(sp?.skills.intrigue||1)*4)+(p.discoveredAt!==undefined?15:0)+(approach?.exposure||0),8,85))};
}
function start(g,r,kind,id){const s=initIntrigue(g),f=g.factions[r],d=PLOTS[kind],me=ruler(g,r);if(!d||!me||isImprisoned(g,me.id)||me.age<18||!land(g,r)||!canStartPlot(g,r,kind)||!plotTargets(g,r,kind).some(p=>p.id===id)||f.treasury<d.cost)return no('Requires an eligible target, adult ruler, funds and an available scheme category.');f.treasury-=d.cost;const pid='p'+s.next++;s.plots[pid]={id:pid,realm:r,actor:me.id,target:id,targetRealm:live(g,id).realm,kind,category:d.category,agents:[],started:g.turn,due:g.turn+d.months,status:'active',spent:d.cost,history:[{turn:g.turn,label:'Scheme begun',cost:d.cost}]};return ok(d.name+' plot begun.');}
function network(g,r,create=false){
 const s=g.intrigue;if(!s)return {};
 if(create){s.networks??={};return s.networks[r]??={};}
 return s.networks?.[r]||{};
}
export function agentMotive(g,r,id){
 const actor=ruler(g,r),p=free(g,id);if(!actor||!p)return 'Unavailable';
 if(hookStrength(g,r,id))return 'Political leverage';
 const op=personalOpinion(g,actor.id,id);if(op>=40)return 'Personal loyalty';
 if(p.traits?.includes('greedy')||p.wealth<60)return 'Financial interest';
 if(p.traits?.includes('ambitious'))return 'Political ambition';
 return 'Court service';
}
export function networkView(g,r){
 const me=ruler(g,r),members=Object.entries(network(g,r)).filter(([id])=>free(g,id)?.realm===r).map(([id,x])=>({id,name:live(g,id).name,motive:agentMotive(g,r,id),joined:x.joined}));
 const candidates=me?Object.values(g.politics.people).filter(p=>p.id!==me.id&&free(g,p.id)?.realm===r&&!network(g,r)[p.id]&&((p.skills?.intrigue??0)>=2||hookStrength(g,r,p.id))&&(personalOpinion(g,me.id,p.id)>=-10||hookStrength(g,r,p.id))).sort((a,b)=>(b.skills?.intrigue??0)-(a.skills?.intrigue??0)||a.id.localeCompare(b.id)):[];
 return {members,candidates,canRecruit:members.length<6&&(g.factions[r]?.treasury??0)>=80};
}
function addNetworkAgent(g,r,id){
 const view=networkView(g,r);if(!view.canRecruit||!view.candidates.some(p=>p.id===id))return no('Requires an eligible local adult, 80 gold and a free network slot.');
 g.factions[r].treasury-=80;network(g,r,true)[id]={joined:g.turn};note(g,r,'An intelligence contact was retained: '+(live(g,id).name||id)+'.');return ok('Intelligence contact retained.');
}
export function agentOptions(g,p){
 const r=ruler(g,p.realm);if(!r)return [];
 const ids=new Set([...Object.values(g.politics.realms[p.realm].council||{}),...Object.keys(network(g,p.realm))]);
 return [...ids].map(id=>free(g,id)).filter(c=>c&&c.realm===p.realm&&c.id!==p.target&&c.id!==r.id&&!(p.agents||[]).includes(c.id)&&!Object.values(g.intrigue?.plots||{}).some(other=>other.id!==p.id&&other.status==='active'&&(other.agents||[]).includes(c.id))&&(personalOpinion(g,r.id,c.id)>=-20||hookStrength(g,p.realm,c.id)));
}
export function knownThreats(g,r){return Object.values(g.intrigue?.plots||{}).filter(p=>p.status==='active'&&p.targetRealm===r&&p.discoveredAt!==undefined&&p.realm!==r);}
function plotExpense(g,p,cost,label){p.spent=(p.spent??PLOTS[p.kind].cost)+cost;p.history??=[];p.history.push({turn:g.turn,label,cost});p.history=p.history.slice(-20);}
export function schemeApproachView(g,p){const f=g.factions[p.realm],options=Object.entries(SCHEME_APPROACHES).map(([id,d])=>({id,...d,ready:!p.approach&&!p.autonomous&&p.status==='active'&&p.due-g.turn>=3&&f.treasury>=d.cost}));return {selected:p.approach||null,options};}
function setApproach(g,p,id){const v=schemeApproachView(g,p).options.find(x=>x.id===id);if(!v?.ready)return no('Choose an affordable approach before the final three months; one approach per scheme.');g.factions[p.realm].treasury-=v.cost;p.approach=id;p.due=Math.max(g.turn+1,p.due+v.months);plotExpense(g,p,v.cost,v.name);return ok('Scheme approach established.');}
function saveSchemeOutcome(g,p){if(p.autonomous)return;const s=initIntrigue(g),list=s.outcomes[p.realm]??=[];if(list.some(x=>x.id===p.id))return;list.unshift({id:p.id,kind:p.kind,actor:p.actor,target:p.target,status:p.status,exposed:!!p.exposed,turn:g.turn,spent:p.spent??PLOTS[p.kind].cost,approach:p.approach||null,history:[...(p.history||[])]});s.outcomes[p.realm]=list.slice(0,40);}
export function schemeOutcomes(g,r){return g.intrigue?.outcomes?.[r]||[];}
function prepare(g,p){
 const f=g.factions[p.realm];if(f.treasury<80||g.turn-(p.lastPreparation??-120)<3||(p.preparation||0)>=25||p.due<=g.turn)return no('Preparation needs 80 gold, three months between reviews and an active unresolved scheme.');
 f.treasury-=80;plotExpense(g,p,80,'Preparation reviewed');p.preparation=cap((p.preparation||0)+8,-20,25);p.lastPreparation=g.turn;return ok('Scheme preparation improved.');
}
function disrupt(g,r,p){
 if(!knownThreats(g,r).includes(p)||p.disrupted||g.factions[r].treasury<90)return no('Requires a discovered foreign plot, 90 gold and no prior disruption.');
 g.factions[r].treasury-=90;p.preparation=cap((p.preparation||0)-12,-20,25);p.due+=3;p.disrupted=true;p.disruptedAt=g.turn;note(g,r,'Counterintelligence disrupted a discovered political scheme.');return ok('Disruption completed.');
}
function recruit(g,p,id){const f=g.factions[p.realm];if(p.agents.length>=3||!agentOptions(g,p).some(c=>c.id===id)||f.treasury<60)return no('Requires an available court agent, 60 gold and a free agent slot.');f.treasury-=60;plotExpense(g,p,60,'Agent recruited: '+(g.politics.people[id]?.name||id));p.agents.push(id);return ok('Agent recruited.');}
function generateSecret(g,r,target){const s=g.intrigue;let secret=Object.values(s.secrets).find(x=>x.person===target.id&&!x.exposed&&x.kind!=='contested');if(!secret){const kinds=Object.keys(SECRETS).filter(k=>k!=='contested'),kind=kinds[Math.floor(random(s)*kinds.length)],id='s'+s.next++;secret=s.secrets[id]={id,person:target.id,kind,known:[],created:g.turn,exposed:false};}if(!secret.known.includes(r))secret.known.push(r);return secret;}
function expose(g,r,s){const p=live(g,s.person);if(!p||s.exposed||!s.known.includes(r))return no('No known unexposed secret.');if(s.kind==='contested'){s.exposed=true;s.exposedTurn=g.turn;const accuser=g.factions[r];if(defense(g,p.realm)>=30){accuser.legitimacy=cap(accuser.legitimacy-8,0,100);note(g,r,'The contested allegation was publicly rejected.');return ok('Allegation rejected.');}const target=g.factions[p.realm];target.legitimacy=cap(target.legitimacy-5,0,100);note(g,r,'The contested allegation damaged the rival court’s standing.');return ok('Contested allegation publicized.');}s.exposed=true;s.exposedTurn=g.turn;for(const [id,h] of Object.entries(g.intrigue.hooks))if(h.secret===s.id)delete g.intrigue.hooks[id];p.memories.push('Secret exposed in '+g.year);const f=g.factions[p.realm];if(ruler(g,p.realm)?.id===p.id){f.legitimacy=cap(f.legitimacy-8*SECRETS[s.kind].severity,0,100);}else for(const v of Object.values(g.politics.holdings))if(v.lord===p.id){v.leverageUntil=Math.max(v.leverageUntil||0,g.turn+36);v.loyalty=cap(v.loyalty-8,0,100);}note(g,r,'A secret concerning '+p.name+' was exposed.');return ok('Secret revealed.');}
function blackmail(g,r,s){const p=free(g,s.person);if(!p||s.kind==='contested'||s.exposed||!s.known.includes(r)||s.usedBy?.includes(r)||hookStrength(g,r,p.id))return no('Requires a known secret and no active hook.');(s.usedBy??=[]).push(r);g.intrigue.hooks[key(r,p.id)]={realm:r,person:p.id,secret:s.id,strength:SECRETS[s.kind].severity,expires:g.turn+36};return ok('Political leverage obtained for three years.');}
export function intrigueAction(g,world,action,id,extra){const s=initIntrigue(g),r=g.player,f=g.factions[r],p=s.plots[id],secret=s.secrets[id];
 if(action==='start')return start(g,r,id,extra);
 if(action==='network-recruit')return addNetworkAgent(g,r,extra||id);
 if(action==='network-dismiss'){if(!network(g,r)[id])return no('No retained contact.');delete network(g,r)[id];return ok('Contact released.');}
 if(action==='approach'){if(p?.realm!==r||p.status!=='active'||p.autonomous)return no('No active controlled scheme.');return setApproach(g,p,extra);}
 if(action==='release-agent'){if(p?.realm!==r||p.status!=='active'||p.autonomous||!p.agents.includes(extra))return no('No recruited agent on this scheme.');p.agents=p.agents.filter(id=>id!==extra);plotExpense(g,p,0,'Agent released');return ok('Agent released without a refund.');}
 if(action==='prepare'){if(p?.realm!==r||p.status!=='active'||p.autonomous)return no('No active controlled scheme.');return prepare(g,p);}
 if(action==='disrupt')return disrupt(g,r,p);
 if(action==='agent'){if(p?.realm!==r||p.status!=='active'||p.autonomous)return no('No active plot.');return recruit(g,p,extra);}
 if(action==='cancel'){if(p?.realm!==r||p.status!=='active'||p.autonomous)return no('No active plot.');p.status='cancelled';p.ended=g.turn;saveSchemeOutcome(g,p);return ok('Plot abandoned.');}
 if(action==='expose')return secret?expose(g,r,secret):no('Unknown secret.');
 if(action==='blackmail')return secret?blackmail(g,r,secret):no('Unknown secret.');
 if(action==='favor'){const h=s.hooks[key(r,id)],v=Object.values(g.politics.holdings).filter(v=>v.realm===r&&v.lord===id);if(!hookStrength(g,r,id)||!v.length)return no('Requires leverage over a local vassal.');for(const x of v)x.loyalty=cap(x.loyalty+15*h.strength,0,100);delete s.hooks[key(r,id)];return ok('Hook spent on vassal compliance.');}
 if(action==='security'){if(f.treasury<120||security(g,r).until>g.turn)return no('Counterespionage costs 120 gold and lasts one year.');f.treasury-=120;s.security[r]={level:2,until:g.turn+12};return ok('Counterespionage activated.');}
 return no('Unknown intrigue action.');}
function finish(g,world,p,removeCharacter){const s=g.intrigue,target=free(g,p.target),actor=free(g,p.actor);if(!target||target.realm!==p.targetRealm||!actor||actor.realm!==p.realm||(!p.autonomous&&ruler(g,p.realm)?.id!==actor.id)||(p.kind==='courtship'&&(actor.spouse||target.spouse||closeKin(actor,target)))){p.status='cancelled';p.ended=g.turn;saveSchemeOutcome(g,p);return;}
 const odds=plotOdds(g,p),success=random(s)*100<odds.chance,exposed=random(s)*100<odds.exposure||p.discoveredAt!==undefined;p.status=success?'succeeded':'failed';p.ended=g.turn;p.exposed=exposed;
 if(success){if(p.kind==='investigate'){generateSecret(g,p.realm,target);}else if(p.kind==='discredit'){const f=g.factions[target.realm];if(ruler(g,target.realm)?.id===target.id)f.legitimacy=cap(f.legitimacy-15,0,100);else for(const v of Object.values(g.politics.holdings))if(v.lord===target.id)v.loyalty=cap(v.loyalty-15,0,100);target.memories.push('Public scandal in '+g.year);}else if(p.kind==='abduct'){if(!capturePrisoner(g,p.realm,target.id,'political plot'))p.status='failed';}else if(p.kind==='assassinate'){if(!removeCharacter(g,world,target.id))p.status='failed';}else applyNewOutcome(g,p,actor,target);}
 if(exposed&&p.autonomous&&plotCategory(p.kind)!=='personal'){actor.wealth=Math.max(0,(actor.wealth||0)-10);if(g.chronicles)changeOpinion(g,actor.id,target.id,-10);}else if(exposed&&plotCategory(p.kind)!=='personal'){const f=g.factions[p.realm];f.legitimacy=cap(f.legitimacy-7,0,100);if(target.realm!==p.realm){f.relations[target.realm]=cap((f.relations[target.realm]||0)-25,-100,100);const other=g.factions[target.realm];other.relations[p.realm]=cap((other.relations[p.realm]||0)-25,-100,100);}note(g,target.realm,'A political plot from '+f.name+' was exposed.');}
 if(!success&&plotCategory(p.kind)==='personal'&&g.chronicles)changeOpinion(g,actor.id,target.id,-5);
 saveSchemeOutcome(g,p);note(g,p.realm,PLOTS[p.kind].name+' against '+target.name+': '+p.status+(exposed?' (exposed).':'.'));}
function applyNewOutcome(g,p,actor,target){
 const kind=p.kind,relationship={sway:22,befriend:35,reconcile:30,patronage:28,courtship:25,influence:24,claimant:20,faction:18,undermine:-18}[kind];
 if(relationship&&g.chronicles)changeOpinion(g,actor.id,target.id,relationship);
 target.memories??=[];target.memories.push(PLOTS[kind].name+' involving '+(actor.name||actor.id)+' in '+g.year+'.');
 if(kind==='patronage')target.wealth=(target.wealth||0)+60;
 if(['sway','influence','claimant','faction','patronage'].includes(kind))for(const [,h] of localHoldings(g,p.realm,target.id))h.loyalty=cap(h.loyalty+(kind==='faction'?12:8),0,100);
 if(kind==='claimant')for(const x of Object.values(g.conflict?.factions||{}))if(x.realm===p.realm&&x.claimant===target.id&&['organizing','ultimatum'].includes(x.status))x.pressure=cap(x.pressure-12,0,100);
 if(kind==='faction')for(const x of activeFactions(g,p.realm,target.id))x.pressure=cap(x.pressure-15,0,100);
 if(kind==='undermine'){for(const [,h] of localHoldings(g,target.realm,target.id))h.loyalty=cap(h.loyalty-10,0,100);}
 if(kind==='sabotage'){const c=g.civic?.realms[target.realm];if(c&&Number.isFinite(c.authority))c.authority=cap(c.authority-8,0,100);const f=g.factions[target.realm];f.prestige=Math.max(0,(f.prestige||0)-4);}
 if(kind==='fabricate'){
  const s=g.intrigue,id='s'+s.next++;s.secrets[id]={id,person:target.id,kind:'contested',known:[p.realm],created:g.turn,exposed:false,fabricator:actor.id};
 }
}
function checkDiscovery(g,p,s){
 if(p.discoveredAt!==undefined||p.realm===p.targetRealm||plotCategory(p.kind)==='personal'||g.turn%3!==0||g.turn<=p.started)return;
 const chance=cap(defense(g,p.targetRealm)*.25+(p.agents||[]).length*3+(SCHEME_APPROACHES[p.approach]?.discovery||0),4,35);
 if(random(s)*100<chance){p.discoveredAt=g.turn;note(g,p.targetRealm,'Counterintelligence detected an active foreign political scheme.');}
}
function maintainNetwork(g,r){
 const contacts=network(g,r);for(const id of Object.keys(contacts)){
  if(free(g,id)?.realm!==r||g.factions[r].treasury<10){delete contacts[id];continue;}
  g.factions[r].treasury-=10;
 }
}
export function startPersonalScheme(g,actorId,targetId,kind){const s=initIntrigue(g),actor=free(g,actorId),target=free(g,targetId),d=PLOTS[kind];if(!actor||!target||!d||!['undermine','discredit','befriend','reconcile'].includes(kind)||actor.realm!==target.realm||!eligibleTarget(g,actor.realm,actor,target,kind)||humanControlsCharacter(g,actorId)||Object.values(s.plots).some(p=>p.status==='active'&&p.actor===actorId)||Object.values(s.plots).filter(p=>p.autonomous&&p.realm===actor.realm&&p.status==='active').length>=4)return no('Personal scheme unavailable.');const cost=kind==='undermine'||kind==='discredit'?70:50;if((actor.wealth||0)<cost)return no('Insufficient personal wealth.');actor.wealth-=cost;const id='p'+s.next++;s.plots[id]={id,realm:actor.realm,actor:actor.id,target:target.id,targetRealm:target.realm,kind,category:plotCategory(kind),agents:[],started:g.turn,due:g.turn+d.months,status:'active',autonomous:true,spent:cost,history:[{turn:g.turn,label:'Personal scheme begun',cost}]};return ok('Personal scheme begun.');}
function autonomousScheme(g,r){
 const s=g.intrigue;if(Object.values(s.plots).some(p=>p.autonomous&&p.realm===r&&p.status==='active'))return;
 const me=ruler(g,r),people=Object.values(g.politics.people).filter(p=>p.id!==me?.id&&free(g,p.id)?.realm===r);
 const actor=people.filter(p=>!humanControlsCharacter(g,p.id)&&p.wealth>=80&&(p.traits||[]).some(t=>['ambitious','deceitful','gregarious','wrathful'].includes(t))).sort((a,b)=>(b.skills?.intrigue||0)-(a.skills?.intrigue||0)||a.id.localeCompare(b.id))[0];
 if(!actor)return;const peers=people.filter(p=>p.id!==actor.id),rival=peers.filter(p=>personalOpinion(g,actor.id,p.id)<=-25&&localHoldings(g,r,p.id).length).sort((a,b)=>personalOpinion(g,actor.id,a.id)-personalOpinion(g,actor.id,b.id)||a.id.localeCompare(b.id))[0];
 const target=rival||peers.filter(p=>eligibleTarget(g,r,actor,p,'befriend')).sort((a,b)=>personalOpinion(g,actor.id,b.id)-personalOpinion(g,actor.id,a.id)||a.id.localeCompare(b.id))[0];
 if(!target)return;const kind=rival?'undermine':'befriend',cost=kind==='undermine'?70:50;actor.wealth-=cost;
 const id='p'+s.next++;s.plots[id]={id,realm:r,actor:actor.id,target:target.id,targetRealm:r,kind,category:plotCategory(kind),agents:[],started:g.turn,due:g.turn+PLOTS[kind].months,status:'active',autonomous:true};
}
export function tickIntrigue(g,world,removeCharacter){const s=initIntrigue(g);if(s.lastTick===g.turn)return;s.lastTick=g.turn;for(const p of Object.values(s.plots)){if(p.status==='active'&&g.turn>=p.due)finish(g,world,p,removeCharacter);else if(p.status==='active')checkDiscovery(g,p,s);else if(p.ended!==undefined&&g.turn-p.ended>60)delete s.plots[p.id];}
 for(const [id,h] of Object.entries(s.hooks))if(h.expires<=g.turn||!live(g,h.person))delete s.hooks[id];
 for(const [id,x] of Object.entries(s.secrets))if(!live(g,x.person)||x.exposed&&g.turn-x.exposedTurn>60){delete s.secrets[id];for(const [k,h] of Object.entries(s.hooks))if(h.secret===id)delete s.hooks[k];}
 if(g.turn%3===0)for(const r of Object.keys(s.networks||{}))if(g.factions[r])maintainNetwork(g,r);
 if(g.turn%12!==0)return;for(const [r,realm] of Object.entries(g.politics.realms)){if(!land(g,r))continue;if(random(s)<.2)autonomousScheme(g,r);if(humanControlsRealm(g,r))continue;const f=g.factions[r],known=knownSecrets(g,r).find(x=>!x.usedBy?.includes(r)&&!hookStrength(g,r,x.person));if(known&&random(s)<.5){if(live(g,known.person)?.realm===r&&known.kind!=='contested')blackmail(g,r,known);else expose(g,r,known);}if(f.treasury>850&&security(g,r).until<=g.turn&&s.history.some(x=>x.realm===r&&g.turn-x.turn<=12&&x.message.includes('was exposed'))){f.treasury-=120;s.security[r]={level:2,until:g.turn+12};}if(f.treasury>1100){const active=activePlots(g,r).find(p=>p.due-g.turn>=3);if(active){const contact=agentOptions(g,active)[0];if(contact&&active.agents.length<3)recruit(g,active,contact.id);}}
 if(f.treasury<850||!canStartPlot(g,r,'investigate')||random(s)>.25)continue;const me=ruler(g,r);if(!me)continue;const local=Object.values(g.politics.holdings).filter(v=>v.realm===r&&v.loyalty<35).map(v=>v.lord);const kind=me.traits?.includes('ambitious')&&random(s)<.25?'discredit':'investigate';const targets=plotTargets(g,r,kind),target=targets.find(p=>local.includes(p.id))||targets.find(p=>p.realm!==r&&(g.factions[r].relations[p.realm]||0)<-30);if(target)start(g,r,kind,target.id);}}
