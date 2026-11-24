import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
// Character-owned political capital, independent ambitions and real wealth transfers.
import {changeOpinion,personalOpinion} from './chronicle-systems.js';
import {startPersonalScheme} from './intrigue-systems.js';
import {personalMarriage} from './dynastic-politics.js';
import {requestVassalPetition} from './vassal-courts.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
const live=(g,id)=>g.politics?.people?.[id],free=(g,p)=>p?.alive&&p.age>=18&&g.feudal?.prisoners?.[p.id]?.status!=='held';
const pair=(a,b)=>[a,b].sort().join('|'),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
export function initAgency(g){const s=g.agency??={version:2,people:{},lastTick:-1,history:[]};s.version=2;s.people??={};s.history??=[];s.dilemmas??={};s.next??=1;return s;}
function record(g,id){const s=initAgency(g);const x=s.people[id]??={influence:10,agenda:null,lastAction:-120,lastIncome:-120};x.goals??={};x.bonds??={};x.memories??=[];x.lastAction??=-120;x.lastIncome??=-120;x.influence=cap(num(x.influence),0,100);return x;}
export function characterInfluence(g,id){return cap(num(g.agency?.people?.[id]?.influence??10),0,100);}
export function characterAgenda(g,id){return g.agency?.people?.[id]?.agenda||null;}
function note(g,p,text,kind='action',target=null){const s=initAgency(g),x=record(g,p.id);const entry={realm:p.realm,person:p.id,turn:g.turn,text,kind,target};s.history.unshift(entry);s.history=s.history.slice(0,320);x.memories.unshift(entry);x.memories=x.memories.slice(0,20);p.memories??=[];p.memories.push(text);p.memories=p.memories.slice(-40);}
function motive(p){const t=p.traits||[];return t.includes('ambitious')?'seek influence':t.includes('greedy')?'accumulate wealth':t.includes('gregarious')||t.includes('generous')?'build friendships':t.includes('wrathful')||t.includes('deceitful')?'undermine rival':t.includes('diligent')?'develop ability':'secure household';}
function transfer(g,p,q,amount,source){if(source.wealth<amount)return false;source.wealth-=amount;q.wealth=num(q.wealth)+amount;return true;}
export function characterInteraction(g,r,id,action){const s=g.politics?.realms?.[r],p=live(g,s?.ruler),q=live(g,id),f=g.factions[r];if(!free(g,p)||!free(g,q)||q.realm!==r||p.id===id)return no('Choose a free adult subject other than the sovereign.');
 const x=record(g,p.id),target=record(g,id),rel=g.chronicles?.relationships?.[pair(p.id,id)];if(g.turn-(rel?.last??-120)<12)return no('Personal interactions require a yearly interval.');
 if(action==='personal-gift'){if(num(p.wealth)<40)return no('Requires 40 personal gold, not treasury funds.');if(!transfer(g,p,q,40,p))return no('Insufficient personal wealth.');relation(g,p,q,16);target.influence=cap(target.influence+2,0,100);}
 else if(action==='personal-patronage'){if(f.treasury<120)return no('Requires 120 treasury gold.');f.treasury-=120;q.wealth=num(q.wealth)+120;relation(g,p,q,24);target.influence=cap(target.influence+8,0,100);x.influence=cap(x.influence+2,0,100);}
 else if(action==='personal-rebuke'){if(x.influence<5)return no('Requires 5 personal influence.');x.influence-=5;target.influence=cap(target.influence-8,0,100);relation(g,p,q,-20);}
 else return no('Unknown personal interaction.');
 g.chronicles.relationships[pair(p.id,id)].last=g.turn;note(g,p,p.name+' → '+q.name+': '+action.slice(9));return ok('Personal interaction completed.');}

const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const has=(p,t)=>(p.traits||[]).includes(t);
const stress=(p,n)=>{if(p.civic)p.civic.stress=cap(num(p.civic.stress)+n,0,100);};
const controlled=(g,p)=>humanControlsCharacter(g,p.id)||p.id===g.politics.realms[p.realm]?.ruler&&humanControlsRealm(g,p.realm);
const bonds=(g,p,q)=>{const b=record(g,p.id).bonds;return b[q.id]??={trust:0,grievance:0,last:-120};};
function bond(g,p,q,trust,grievance=0){const x=bonds(g,p,q);x.trust=cap(x.trust+trust,-100,100);x.grievance=cap(x.grievance+grievance,0,100);x.last=g.turn;}
function relation(g,p,q,amount){changeOpinion(g,p.id,q.id,amount);bond(g,p,q,amount,amount<0?-amount:0);bond(g,q,p,amount,amount<0?-amount:0);const r=g.chronicles?.relationships?.[pair(p.id,q.id)];if(r)r.last=g.turn;}
function goal(g,p,kind,target=null){const x=record(g,p.id);let q=x.goal;if(!q||q.kind!==kind||q.target!==target||q.status!=='active'){q=x.goal={kind,target,started:g.turn,progress:0,status:'active'};}return q;}
function complete(g,p,kind,target,amount=1,threshold=3){const x=record(g,p.id),q=goal(g,p,kind,target);q.progress+=amount;if(q.progress>=threshold){q.status='completed';q.ended=g.turn;x.goals[kind]=(x.goals[kind]||0)+1;if(x.goals[kind]<=3)x.influence=cap(x.influence+3,0,100);note(g,p,p.name+' achieved a personal ambition: '+kind+'.','goal',target);}}
const localEstate=(g,rows,p)=>rows.get(p.id)||[];
function loyalty(rows,p,delta){for(const [,h] of rows.get(p.id)||[])h.loyalty=cap(h.loyalty+delta,0,100);}
function canInteract(g,p,q){return q&&p.id!==q.id&&free(g,q)&&g.turn-(g.chronicles?.relationships?.[pair(p.id,q.id)]?.last??-120)>=6;}
function pickPeer(g,p,peers,hostile=false){return peers.filter(q=>canInteract(g,p,q)).sort((a,b)=>{const va=personalOpinion(g,p.id,a.id),vb=personalOpinion(g,p.id,b.id);return (hostile?va-vb:vb-va)||a.id.localeCompare(b.id);})[0];}
export function characterLifeView(g,id){const p=live(g,id),x=g.agency?.people?.[id];if(!p)return null;const rel=Object.values(g.chronicles?.relationships||{}).filter(r=>r.a===id||r.b===id).map(r=>({...r,other:r.a===id?r.b:r.a})).filter(r=>live(g,r.other)?.alive).sort((a,b)=>Math.abs(b.opinion)-Math.abs(a.opinion)||a.other.localeCompare(b.other));return {agenda:x?.agenda||null,goal:x?.goal||null,completed:x?.goals||{},memories:x?.memories||[],relations:rel.slice(0,20).map(r=>({...r,trust:x?.bonds?.[r.other]?.trust||0,grievance:x?.bonds?.[r.other]?.grievance||0})),stress:num(p.civic?.stress),health:g.living?.health?.[id]||{condition:'well',severity:0},guardian:p.civic?.guardian||null,education:num(p.civic?.education),educationFocus:p.civic?.educationFocus||null,chosenGoal:personalGoalStatus(g,p)};}
export function personalDilemmas(g,id){return Object.values(g.agency?.dilemmas||{}).filter(x=>x.status==='pending'&&x.recipient===id&&x.deadline>=g.turn&&live(g,x.actor)?.alive&&live(g,x.target)?.alive);}
function dilemma(g,p,q,kind){const root=initAgency(g),recipient=live(g,g.politics.realms[p.realm]?.ruler);if(!recipient?.alive||!free(g,recipient)||!controlled(g,recipient)||personalDilemmas(g,recipient.id).length>=3||Object.values(root.dilemmas).some(x=>x.status==='pending'&&x.actor===p.id))return false;const id='life'+root.next++;root.dilemmas[id]={id,recipient:recipient.id,realm:p.realm,actor:p.id,target:q.id,kind,started:g.turn,deadline:g.turn+9,status:'pending'};note(g,p,p.name+' asked '+recipient.name+' to settle a '+kind+'.','petition',q.id);g.log?.unshift({date:g.year+' · month '+(g.month+1),text:p.name+' requests a personal decision; inspect your character.'});if(g.log)g.log=g.log.slice(0,45);return true;}
export function resolvePersonalDilemma(g,id,choice){const x=initAgency(g).dilemmas[id],p=x&&live(g,x.actor),q=x&&live(g,x.target),r=x&&live(g,x.recipient);if(!x||x.status!=='pending'||x.deadline<g.turn||!free(g,r)||!controlled(g,r)||!free(g,p)||!free(g,q)||p.realm!==x.realm||q.realm!==x.realm||r.realm!==x.realm||r.id!==g.politics.realms[x.realm]?.ruler)return no('Personal decision is no longer available.');if(!['mediate','support','decline'].includes(choice))return no('Unknown decision.');if(choice==='mediate'){if(num(r.wealth)<40)return no('Requires 40 personal gold.');r.wealth-=40;p.wealth=num(p.wealth)+20;q.wealth=num(q.wealth)+20;relation(g,p,q,25);relation(g,r,p,10);relation(g,r,q,10);stress(p,-12);stress(q,-12);}else if(choice==='support'){if(num(r.wealth)<60)return no('Requires 60 personal gold.');r.wealth-=60;p.wealth=num(p.wealth)+60;relation(g,r,p,20);relation(g,r,q,-16);relation(g,p,q,-10);stress(q,10);}else{relation(g,r,p,-12);stress(p,8);}x.status=choice;x.ended=g.turn;note(g,p,r.name+' resolved the '+x.kind+': '+choice+'.','resolution',q.id);return ok('Personal decision resolved.');}
export function recordLifeEvent(g,p,kind,target,text){if(!p?.id)return;note(g,p,text,kind,target?.id||target||null);}
export function rememberBereavement(g,p){const family=new Set([p.spouse,...(p.parents||[]),...(p.children||[])].filter(Boolean));for(const id of family){const q=live(g,id);if(!q?.alive)continue;stress(q,has(q,'reserved')?14:20);note(g,q,q.name+' mourned the death of '+p.name+'.','bereavement',p.id);}}
function advancePersonal(g,p,peers,rows,council,head){
 const x=record(g,p.id),estate=localEstate(g,rows,p),age=p.age,st=num(p.civic?.stress),health=num(g.living?.health?.[p.id]?.severity);
 if(st>=60&&num(p.wealth)>=30){p.wealth-=30;stress(p,-22);note(g,p,p.name+' withdrew from court to recover from stress.','recovery');return true;}
 if(health>=65)return false;
 const r=p.realm,headOpinion=head?.id===p.id?0:personalOpinion(g,p.id,head?.id);
 // Persistent grudges turn into meaningful political opposition rather than cosmetic text.
 if(head&&head.id!==p.id&&estate.length&&headOpinion<=-35&&has(p,'ambitious')){
   const h=estate.find(([,v])=>v.autonomy<2);
   if(h&&requestVassalPetition(g,r,p.id,h[0],'autonomy').ok){complete(g,p,'secure autonomy',head.id,1,2);note(g,p,p.name+' pressed the crown for autonomy.','political',head.id);return true;}
   if(num(p.wealth)>=40){p.wealth-=40;loyalty(rows,p,-8);bond(g,p,head,-10,10);complete(g,p,'organize opposition',head.id,1,3);note(g,p,p.name+' organized estate opposition to '+head.name+'.','political',head.id);return true;}
 }
 if(x.agenda==='accumulate wealth'){
   // Preserve the estate owner's annual accounting; accumulation itself is a goal.
   const q=goal(g,p,'accumulate wealth');q.baseline??=num(p.wealth);q.progress=Math.max(0,num(p.wealth)-q.baseline);if(q.progress>=100)complete(g,p,'accumulate wealth',null,0,100);return false;
 }
 if(x.agenda==='develop ability'&&num(p.wealth)>=60){const skill=Object.keys(p.skills||{}).sort((a,b)=>num(p.skills[a])-num(p.skills[b])||a.localeCompare(b))[0];if(skill&&p.skills[skill]<5){p.wealth-=60;p.skills[skill]++;complete(g,p,'develop ability',skill,1,2);note(g,p,p.name+' invested in '+skill+' training.','training');return true;}}
 // Adults form their own households without commandeering royal diplomatic marriages.
 if(!p.spouse&&age>=20&&age<=45&&num(p.wealth)>=90&&p.id!==head?.id&&p.house!==head?.house&&hash(p.id+':marry:'+g.turn)%3===0){
   const partner=peers.filter(q=>!controlled(g,q)&&q.id!==head?.id&&q.house!==head?.house&&q.sex!==p.sex&&!q.spouse&&q.age>=20&&q.age<=50&&Math.abs(q.age-age)<=18&&personalOpinion(g,p.id,q.id)>=0).sort((a,b)=>personalOpinion(g,p.id,b.id)-personalOpinion(g,p.id,a.id)||a.id.localeCompare(b.id)).find(q=>personalMarriage(g,p.id,q.id).ok);
   if(partner){relation(g,p,partner,20);complete(g,p,'secure household',partner.id,1,1);return true;}
 }
 const hostile=x.agenda==='undermine rival';const target=pickPeer(g,p,peers,hostile);
 if(!target)return false;const opinion=personalOpinion(g,p.id,target.id);
 if(hostile){
   if(opinion<=-45&&dilemma(g,p,target,'rivalry'))return true;
   if(opinion<=-35&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,target.id,localEstate(g,rows,target).length?'undermine':'discredit').ok){complete(g,p,'undermine rival',target.id,1,3);note(g,p,p.name+' began a personal scheme against '+target.name+'.','scheme',target.id);return true;}
   if(opinion>-90){relation(g,p,target,-16);loyalty(rows,target,-2);stress(target,5);complete(g,p,'undermine rival',target.id);note(g,p,p.name+' openly opposed '+target.name+'.','rivalry',target.id);return true;}
 }
 if(x.agenda==='seek influence'&&head&&head.id!==p.id&&estate.length&&!council.has(p.id)&&requestVassalPetition(g,r,p.id,estate[0][0],'council').ok){complete(g,p,'seek council office',head.id,1,2);return true;}
 if(opinion<0&&has(p,'just')&&num(p.wealth)>=25){p.wealth-=25;target.wealth=num(target.wealth)+25;relation(g,p,target,20);stress(p,-5);stress(target,-5);note(g,p,p.name+' reconciled with '+target.name+'.','reconciliation',target.id);return true;}
 if(num(p.wealth)>=35&&opinion<75){transfer(g,p,target,35,p);relation(g,p,target,15);x.influence=cap(x.influence+3,0,100);complete(g,p,x.agenda,target.id);if(opinion<50&&personalOpinion(g,p.id,target.id)>=50)note(g,p,p.name+' became friends with '+target.name+'.','friendship',target.id);else note(g,p,p.name+' cultivated ties with '+target.name+'.','patronage',target.id);if(head?.id===target.id)loyalty(rows,p,5);return true;}
 return false;
}
export function tickAgency(g){const root=initAgency(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;
 const groups=new Map(),rows=new Map(),land=new Set(Object.values(g.provinces||{}).map(p=>p.owner));
 for(const p of Object.values(g.politics.people)){if(!p.alive)continue;const x=record(g,p.id);x.agenda=motive(p);if(!free(g,p))continue;if(!groups.has(p.realm))groups.set(p.realm,[]);groups.get(p.realm).push(p);}
 for(const [id,h] of Object.entries(g.politics.holdings)){if(g.provinces[id]?.owner!==h.realm)continue;if(!rows.has(h.lord))rows.set(h.lord,[]);rows.get(h.lord).push([id,h]);}
 for(const [r,people] of groups){const s=g.politics.realms[r];if(!s||!land.has(r))continue;const head=live(g,s.ruler),council=new Set(Object.values(s.council||{}));people.sort((a,b)=>a.id.localeCompare(b.id));
 for(const p of people){const x=record(g,p.id),estate=localEstate(g,rows,p);if(g.turn%12===0&&x.lastIncome!==g.turn){for(const [,h] of estate){const draw=Math.min(25,Math.floor(Math.max(0,num(h.wealth))*.12));h.wealth-=draw;p.wealth=num(p.wealth)+draw;}x.lastIncome=g.turn;const standing=(council.has(p.id)?3:0)+(estate.length?2:0)+(p.id===s.ruler?2:0);x.influence=cap(x.influence+standing-(standing?0:2),0,100);}
 reviewChosenGoal(g,p);if(g.turn%3===0&&p.id!==head?.id){const pressure=(num(g.factions[r]?.stability)<40?3:0)+(estate.some(([,h])=>h.loyalty<35)?3:0)+(num(g.living?.health?.[p.id]?.severity)>=50?3:0);stress(p,pressure||-2);}
 }
 // Monthly staggered choices, bounded per realm; ordinary courtiers participate.
 const ready=people.filter(p=>!controlled(g,p)&&g.turn-record(g,p.id).lastAction>=6&&hash(p.id)%6===g.turn%6).sort((a,b)=>record(g,a.id).lastAction-record(g,b.id).lastAction||a.id.localeCompare(b.id));
 for(const p of ready.slice(0,6)){const x=record(g,p.id);x.lastAction=g.turn;advancePersonal(g,p,people.filter(q=>q.id!==p.id),rows,council,head);}
 }
 for(const [id,x] of Object.entries(root.dilemmas)){if(x.status==='pending'&&(x.deadline<g.turn||![x.actor,x.target,x.recipient].every(i=>live(g,i)?.alive))){x.status='lapsed';x.ended=g.turn;const p=live(g,x.actor),q=live(g,x.recipient);if(p?.alive&&q?.alive){relation(g,p,q,-8);stress(p,6);note(g,p,'An unanswered personal petition lapsed.','resolution',q.id);}}else if(x.ended!==undefined&&g.turn-x.ended>60)delete root.dilemmas[id];}
 for(const [id,x] of Object.entries(root.people)){if(!live(g,id)?.alive){delete root.people[id];continue;}if(g.turn%12===0){for(const [other,b] of Object.entries(x.bonds))if(!live(g,other)?.alive||g.turn-b.last>120)delete x.bonds[other];}}
}

export const PERSONAL_GOALS={wealth:'Build a personal fortune',friend:'Make a close friend',training:'Master a skill',resilience:'Overcome stress'};
export function personalGoalStatus(g,p){const q=g.agency?.people?.[p.id]?.chosenGoal;if(!q)return null;let progress=0;if(q.kind==='wealth')progress=Math.max(0,num(p.wealth)-q.baseline);else if(q.kind==='friend')progress=live(g,q.target)?.alive?Math.max(0,personalOpinion(g,p.id,q.target)):0;else if(q.kind==='training')progress=num(p.skills?.[q.skill])-q.baseline;else if(q.kind==='resilience')progress=Math.max(0,q.baseline-num(p.civic?.stress));return {...q,label:PERSONAL_GOALS[q.kind],progress:q.status==='completed'?q.required:Math.max(0,Math.min(q.required,progress))};}
export function playerLifeAction(g,actorId,action,target){const p=live(g,actorId);if(!free(g,p)||!controlled(g,p))return no('Only your living free adult character may act.');const x=record(g,p.id),q=live(g,target);
 if(action==='goal'){if(!Object.hasOwn(PERSONAL_GOALS,target)||x.chosenGoal?.status==='active'||x.goals['player:'+target])return no('Choose a new, uncompleted personal goal.');const base={kind:target,status:'active',started:g.turn};if(target==='wealth')Object.assign(base,{baseline:num(p.wealth),required:100});else if(target==='friend'){const peer=Object.values(g.politics.people).filter(q=>free(g,q)&&q.realm===p.realm&&q.id!==p.id&&personalOpinion(g,p.id,q.id)<50).sort((a,b)=>personalOpinion(g,p.id,b.id)-personalOpinion(g,p.id,a.id)||a.id.localeCompare(b.id))[0];if(!peer)return no('No available new friend.');Object.assign(base,{target:peer.id,required:50});}else if(target==='training'){const skill=Object.keys(p.skills||{}).filter(k=>p.skills[k]<5).sort((a,b)=>p.skills[a]-p.skills[b]||a.localeCompare(b))[0];if(!skill)return no('All skills are mastered.');Object.assign(base,{skill,baseline:p.skills[skill],required:1});}else{if(num(p.civic?.stress)<25)return no('Requires at least 25 stress.');Object.assign(base,{baseline:p.civic.stress,required:25});}x.chosenGoal=base;note(g,p,p.name+' chose '+PERSONAL_GOALS[target]+'.','goal');return ok('Personal goal selected.');}
 if(action==='abandon'){if(x.chosenGoal?.status!=='active')return no('No active personal goal.');x.chosenGoal.status='abandoned';return ok('Personal goal abandoned.');}
 if(g.turn-(x.lastPlayerAction??-120)<6)return no('Personal actions require six months between uses.');
 if(action==='train'){if(!Object.hasOwn(p.skills||{},target)||p.skills[target]>=5||p.wealth<60)return no('Choose an unmastered skill and have 60 personal gold.');p.wealth-=60;p.skills[target]++;note(g,p,p.name+' trained in '+target+'.','training');}
 else if(action==='rest'){if(p.wealth<30||num(p.civic?.stress)<10)return no('Requires 30 personal gold and at least 10 stress.');p.wealth-=30;stress(p,-25);note(g,p,p.name+' rested and recovered.','recovery');}
 else if(action==='befriend'||action==='reconcile'){if(!canInteract(g,p,q)||q.realm!==p.realm||p.wealth<35)return no('Requires a free adult local character, 35 personal gold and available contact.');transfer(g,p,q,35,p);relation(g,p,q,action==='reconcile'?25:18);stress(p,-3);note(g,p,p.name+' renewed ties with '+q.name+'.','friendship',q.id);}
 else return no('Unknown personal action.');x.lastPlayerAction=g.turn;return ok('Personal action completed.');}
function reviewChosenGoal(g,p){const x=record(g,p.id),q=personalGoalStatus(g,p);if(!q||q.status!=='active')return;if(q.kind==='friend'&&!live(g,q.target)?.alive){x.chosenGoal.status='failed';return;}if(q.progress>=q.required){x.chosenGoal.status='completed';x.chosenGoal.ended=g.turn;x.goals['player:'+q.kind]=1;x.influence=cap(x.influence+8,0,100);stress(p,-8);note(g,p,p.name+' fulfilled '+q.label+'.','goal',q.target||null);}}
export function personalPoliticalSupport(g,person,liege){const a=g.agency?.people?.[person]?.bonds?.[liege];return a?cap((num(a.trust)-num(a.grievance))*.08,-8,8):0;}

// Health and stress modify performed work, never the underlying trained skill.
export function effectiveCharacterSkill(g,p,skill){if(!p?.alive)return 1;const base=cap(num(p.skills?.[skill])||1,1,5),severity=num(g.living?.health?.[p.id]?.severity),stressValue=num(p.civic?.stress);return Math.max(1,base-Math.floor(severity/35)-(stressValue>=85?1:0));}
