import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
// Character-owned political capital, independent ambitions and real wealth transfers.
import {changeOpinion,personalOpinion} from './chronicle-systems.js';
import {startPersonalScheme} from './intrigue-systems.js';
import {personalMarriage} from './dynastic-politics.js';
import {requestVassalPetition} from './vassal-courts.js';
import {characterHealth} from './living-systems.js';
import {ACTIVE_FACTION_STATUSES,createFaction,joinFaction} from './political-conflict.js';
import {claimantCandidates,addClaim} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
const live=(g,id)=>g.politics?.people?.[id],free=(g,p)=>p?.alive&&p.age>=18&&g.feudal?.prisoners?.[p.id]?.status!=='held';
const pair=(a,b)=>[a,b].sort().join('|'),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export const PERSONALITY_AXES=Object.freeze(['boldness','compassion','greed','honor','zeal','sociability','diligence']);
export const SOCIAL_ROLES=Object.freeze(['landed','commander','merchant','clergy','courtier']);
export function deriveSocialRole(g,p,landedSet=null,commanderSet=null){
 if(!p)return 'courtier';
 const char=typeof p==='string'?g.politics?.people?.[p]:p;
 if(!char)return 'courtier';
 const r=char.realm,s=g.politics?.realms?.[r];
 const isLanded=landedSet?landedSet.has(char.id):(s?.ruler===char.id||Object.values(g.politics?.holdings||{}).some(h=>h.realm===r&&h.lord===char.id));
 if(isLanded)return 'landed';
 const isCmd=commanderSet?commanderSet.has(char.id):(s?.council?.marshal===char.id||Object.values(g.military?.armies||{}).some(a=>a.commander===char.id));
 if(isCmd)return 'commander';
 if(g.institutions?.realms?.[r]?.houses?.[char.id]||(['republic','city'].includes(g.civic?.realms?.[r]?.government)&&s?.council?.steward===char.id))return 'merchant';
 if(g.living?.realms?.[r]?.faithAdvisor===char.id||s?.council?.scholar===char.id||g.identity?.clergy?.[char.id])return 'clergy';
 return 'courtier';
}
export function defaultPersonality(p){
 const t=new Set(p.traits||[]),n=hash(p.id||'char'),jit=shift=>((n>>>shift)%41)-20;
 return {
  boldness:cap((t.has('brave')?55:0)-(t.has('cautious')?55:0)+jit(0),-100,100),
  compassion:cap((t.has('generous')?45:0)+(t.has('just')?25:0)-(t.has('wrathful')?55:0)+jit(4),-100,100),
  greed:cap((t.has('greedy')?60:0)-(t.has('generous')?50:0)+jit(8),-100,100),
  honor:cap((t.has('just')?40:0)+(t.has('honest')?40:0)-(t.has('deceitful')?55:0)-(t.has('arbitrary')?40:0)+jit(12),-100,100),
  zeal:cap((t.has('zealous')?60:0)-(t.has('cynical')?55:0)+jit(16),-100,100),
  sociability:cap((t.has('gregarious')?55:0)-(t.has('reserved')?55:0)+jit(20),-100,100),
  diligence:cap((t.has('diligent')?55:0)-(t.has('indolent')?55:0)+jit(24),-100,100)
 };
}
export function ensureCharacterSchema(g,p,landedSet=null,commanderSet=null){
 let game=g, char=p;
 if(g&&!p&&typeof g==='object'&&g.id){char=g;game=null;}
 if(!char||typeof char!=='object')return char;
 p=char;
 const r=p.realm,s=game?.politics?.realms?.[r];
 const landed=landedSet?landedSet.has(p.id):(s?.ruler===p.id||Object.values(game?.politics?.holdings||{}).some(h=>h.realm===r&&h.lord===p.id));
 if(!Number.isFinite(p.wealth))p.wealth=100;
 if(!Number.isFinite(p.prestige))p.prestige=(s?.ruler===p.id?60:landed?25:10)+(hash(p.id+'pr')%15);
 if(!Number.isFinite(p.piety))p.piety=(p.skills?.learning||1)*8+(p.traits?.includes('zealous')?25:10);
 if(!p.personality||typeof p.personality!=='object'){p.personality=defaultPersonality(p);}
 else{const def=defaultPersonality(p);for(const ax of PERSONALITY_AXES)if(!Number.isFinite(p.personality[ax]))p.personality[ax]=def[ax];}
 p.friends??=[];p.rivals??=[];p.lovers??=[];p.mentors??=[];p.wards??=[];
 p.grievances??=[];p.memories??=[];
 const ax=g.agency?.people?.[p.id];
 if(ax){if(!Number.isFinite(p.influence))p.influence=ax.influence;else ax.influence=cap(num(ax.influence),0,100);}
 else if(!Number.isFinite(p.influence))p.influence=landed?20:10;
 p.role=deriveSocialRole(g,p,landedSet,commanderSet);
 return p;
}
export function recordGrievance(g,personId,againstId,reason,severity=25,opts={}){
 const p=live(g,personId),q=live(g,againstId);if(!p||!q||p.id===q.id)return false;
 ensureCharacterSchema(g,p);
 const permanent=Boolean(opts.permanent||severity>=55||['executed kin','assassinated kin','revoked title'].includes(reason));
 const existing=p.grievances.find(x=>x.against===againstId&&x.reason===reason);
 if(existing){existing.severity=cap(existing.severity+severity,0,100);existing.turn=g.turn;if(permanent)existing.permanent=true;}
 else{p.grievances.unshift({against:againstId,reason,severity:cap(severity,0,100),turn:g.turn,permanent});p.grievances=p.grievances.slice(0,20);}
 bond(g,p,q,-Math.round(severity/2),severity);
 return true;
}
export function addRomance(g,aId,bId){
 const a=live(g,aId),b=live(g,bId);if(!a||!b||a.id===b.id||a.age<18||b.age<18)return false;
 ensureCharacterSchema(g,a);ensureCharacterSchema(g,b);
 if(!a.lovers.includes(b.id))a.lovers.push(b.id);
 if(!b.lovers.includes(a.id))b.lovers.push(a.id);
 relation(g,a,b,15);
 note(g,a,a.name+' and '+b.name+' became romantically involved.','romance',b.id);
 note(g,b,b.name+' and '+a.name+' became romantically involved.','romance',a.id);
 return true;
}
export function roleSets(g){
 const landedSet=new Set(),commanderSet=new Set();
 for(const s of Object.values(g.politics?.realms||{})){if(s?.ruler)landedSet.add(s.ruler);if(s?.council?.marshal)commanderSet.add(s.council.marshal);}
 for(const h of Object.values(g.politics?.holdings||{}))if(h?.lord)landedSet.add(h.lord);
 for(const a of Object.values(g.military?.armies||{}))if(a?.commander)commanderSet.add(a.commander);
 return {landedSet,commanderSet};
}
export function syncCharacterRelationships(g){
 const people=g.politics?.people||{},{landedSet,commanderSet}=roleSets(g);
 for(const p of Object.values(people)){
  if(!p?.alive)continue;
  ensureCharacterSchema(g,p,landedSet,commanderSet);
  p.friends=[];p.rivals=[];p.mentors=[];p.wards=[];
  p.lovers=(p.lovers||[]).filter(id=>live(g,id)?.alive);
  p.grievances=(p.grievances||[]).filter(x=>live(g,x.against)?.alive&&(x.permanent||g.turn-x.turn<=120));
 }
 for(const rel of Object.values(g.chronicles?.relationships||{})){
  const a=live(g,rel.a),b=live(g,rel.b);if(!a?.alive||!b?.alive)continue;
  if(rel.kind==='friend'||rel.opinion>=50){if(!a.friends.includes(b.id))a.friends.push(b.id);if(!b.friends.includes(a.id))b.friends.push(a.id);}
  if(rel.kind==='rival'||rel.opinion<=-50){if(!a.rivals.includes(b.id))a.rivals.push(b.id);if(!b.rivals.includes(a.id))b.rivals.push(a.id);}
 }
 for(const p of Object.values(people)){
  if(!p?.alive)continue;
  const gid=p.civic?.guardian,guardian=gid&&live(g,gid);
  if(guardian?.alive&&p.age<18){
   if(!p.mentors.includes(guardian.id))p.mentors.push(guardian.id);
   if(!guardian.wards.includes(p.id))guardian.wards.push(p.id);
  }
 }
}
export function initAgency(g){const existed=!!g.agency;const s=g.agency??={version:2,people:{},lastTick:-1,history:[]};s.version=2;s.people??={};s.history??=[];s.dilemmas??={};s.next??=1;if(!existed||!s._schemaInit){s._schemaInit=true;const {landedSet,commanderSet}=roleSets(g);for(const p of Object.values(g.politics?.people||{}))if(p?.alive)ensureCharacterSchema(g,p,landedSet,commanderSet);}return s;}
function record(g,id){const s=initAgency(g);const x=s.people[id]??={influence:10,agenda:null,lastAction:-120,lastIncome:-120};x.goals??={};x.bonds??={};x.memories??=[];x.lastAction??=-120;x.lastIncome??=-120;x.influence=cap(num(x.influence),0,100);const p=live(g,id);if(p)p.influence=x.influence;return x;}
export function characterInfluence(g,id){return cap(num(g.agency?.people?.[id]?.influence??g.politics?.people?.[id]?.influence??10),0,100);}
export function characterAgenda(g,id){return g.agency?.people?.[id]?.agenda||null;}
function note(g,p,text,kind='action',target=null){const s=initAgency(g),x=record(g,p.id);const entry={realm:p.realm,person:p.id,turn:g.turn,text,kind,target};s.history.unshift(entry);s.history=s.history.slice(0,320);x.memories.unshift(entry);x.memories=x.memories.slice(0,20);p.memories??=[];p.memories.push(text);p.memories=p.memories.slice(-40);}
function motive(p){const t=p.traits||[],ax=p.personality||{};if(t.includes('ambitious')||(ax.boldness||0)>=45)return 'seek influence';if(t.includes('greedy')||(ax.greed||0)>=45)return 'accumulate wealth';if(t.includes('gregarious')||t.includes('generous')||(ax.sociability||0)>=45)return 'build friendships';if(t.includes('wrathful')||t.includes('deceitful')||(ax.compassion||0)<=-45)return 'undermine rival';if(t.includes('diligent')||(ax.diligence||0)>=45)return 'develop ability';return 'secure household';}
function transfer(g,p,q,amount,source){if(source.wealth<amount)return false;source.wealth-=amount;q.wealth=num(q.wealth)+amount;return true;}
export function characterInteraction(g,r,id,action){return characterInteractionAs(g,r,g.politics?.realms?.[r]?.ruler,id,action);}
export function characterInteractionAs(g,r,actor,id,action){const s=g.politics?.realms?.[r],p=live(g,actor),q=live(g,id),f=g.factions[r];if(!free(g,p)||!free(g,q)||q.realm!==r||p.id===id||(p.realm!==r&&p.id!==s?.ruler))return no('Choose a different free adult in your court.');if(action==='personal-patronage'&&p.id!==s?.ruler)return no('Only the sovereign can spend treasury funds on patronage.');
 const x=record(g,p.id),target=record(g,id),rel=g.chronicles?.relationships?.[pair(p.id,id)];if(g.turn-(rel?.last??-120)<12)return no('Personal interactions require a yearly interval.');
 if(action==='personal-gift'){if(num(p.wealth)<40)return no('Requires 40 personal gold, not treasury funds.');if(!transfer(g,p,q,40,p))return no('Insufficient personal wealth.');relation(g,p,q,16);target.influence=cap(target.influence+2,0,100);q.influence=target.influence;}
 else if(action==='personal-patronage'){if(f.treasury<120)return no('Requires 120 treasury gold.');f.treasury-=120;q.wealth=num(q.wealth)+120;relation(g,p,q,24);target.influence=cap(target.influence+8,0,100);q.influence=target.influence;x.influence=cap(x.influence+2,0,100);p.influence=x.influence;}
 else if(action==='personal-rebuke'){if(x.influence<5)return no('Requires 5 personal influence.');x.influence-=5;p.influence=x.influence;target.influence=cap(target.influence-8,0,100);q.influence=target.influence;relation(g,p,q,-20);recordGrievance(g,q.id,p.id,'public rebuke',15);}
 else return no('Unknown personal interaction.');
 g.chronicles.relationships[pair(p.id,id)].last=g.turn;note(g,p,p.name+' → '+q.name+': '+action.slice(9));return ok('Personal interaction completed.');}

const has=(p,t)=>(p.traits||[]).includes(t);
const stress=(p,n)=>{if(p.civic)p.civic.stress=cap(num(p.civic.stress)+n,0,100);};
const controlled=(g,p)=>humanControlsCharacter(g,p.id)||p.id===g.politics.realms[p.realm]?.ruler&&humanControlsRealm(g,p.realm);
const bonds=(g,p,q)=>{const b=record(g,p.id).bonds;return b[q.id]??={trust:0,grievance:0,last:-120};};
function bond(g,p,q,trust,grievance=0){const x=bonds(g,p,q);x.trust=cap(x.trust+trust,-100,100);x.grievance=cap(x.grievance+grievance,0,100);x.last=g.turn;}
function relation(g,p,q,amount){changeOpinion(g,p.id,q.id,amount);bond(g,p,q,amount,amount<0?-amount:0);bond(g,q,p,amount,amount<0?-amount:0);const r=g.chronicles?.relationships?.[pair(p.id,q.id)];if(r)r.last=g.turn;}
function goal(g,p,kind,target=null){const x=record(g,p.id);let q=x.goal;if(!q||q.kind!==kind||q.target!==target||q.status!=='active'){q=x.goal={kind,target,started:g.turn,progress:0,status:'active'};}return q;}
function complete(g,p,kind,target,amount=1,threshold=3){const x=record(g,p.id),q=goal(g,p,kind,target);q.progress+=amount;if(q.progress>=threshold){q.status='completed';q.ended=g.turn;x.goals[kind]=(x.goals[kind]||0)+1;if(x.goals[kind]<=3){x.influence=cap(x.influence+3,0,100);p.influence=x.influence;}p.prestige=num(p.prestige)+4;note(g,p,p.name+' achieved a personal ambition: '+kind+'.','goal',target);}}
const localEstate=(g,rows,p)=>rows.get(p.id)||[];
function loyalty(rows,p,delta){for(const [,h] of rows.get(p.id)||[])h.loyalty=cap(h.loyalty+delta,0,100);}
function canInteract(g,p,q){return q&&p.id!==q.id&&free(g,q)&&g.turn-(g.chronicles?.relationships?.[pair(p.id,q.id)]?.last??-120)>=6;}
function pickPeer(g,p,peers,hostile=false){return peers.filter(q=>canInteract(g,p,q)).sort((a,b)=>{const va=personalOpinion(g,p.id,a.id),vb=personalOpinion(g,p.id,b.id);return (hostile?va-vb:vb-va)||a.id.localeCompare(b.id);})[0];}
export function characterLifeView(g,id){const p=live(g,id),x=g.agency?.people?.[id];if(!p)return null;ensureCharacterSchema(g,p);const rel=Object.values(g.chronicles?.relationships||{}).filter(r=>r.a===id||r.b===id).map(r=>({...r,other:r.a===id?r.b:r.a})).filter(r=>live(g,r.other)?.alive).sort((a,b)=>Math.abs(b.opinion)-Math.abs(a.opinion)||a.other.localeCompare(b.other));return {agenda:x?.agenda||null,goal:x?.goal||null,completed:x?.goals||{},memories:x?.memories||[],relations:rel.slice(0,20).map(r=>({...r,trust:x?.bonds?.[r.other]?.trust||0,grievance:x?.bonds?.[r.other]?.grievance||0})),stress:num(p.civic?.stress),health:characterHealth(g,id),guardian:p.civic?.guardian||null,education:num(p.civic?.education),educationFocus:p.civic?.educationFocus||null,chosenGoal:personalGoalStatus(g,p),prestige:num(p.prestige),piety:num(p.piety),influence:characterInfluence(g,id),wealth:num(p.wealth),role:p.role||deriveSocialRole(g,p),personality:p.personality,friends:p.friends||[],rivals:p.rivals||[],lovers:p.lovers||[],mentors:p.mentors||[],wards:p.wards||[],grievances:p.grievances||[]};}
export function personalDilemmas(g,id){return Object.values(g.agency?.dilemmas||{}).filter(x=>x.status==='pending'&&x.recipient===id&&x.deadline>=g.turn&&live(g,x.actor)?.alive&&live(g,x.target)?.alive);}
function dilemma(g,p,q,kind){const root=initAgency(g),recipient=live(g,g.politics.realms[p.realm]?.ruler);if(!recipient?.alive||!free(g,recipient)||!controlled(g,recipient)||personalDilemmas(g,recipient.id).length>=3||Object.values(root.dilemmas).some(x=>x.status==='pending'&&x.actor===p.id))return false;const id='life'+root.next++;root.dilemmas[id]={id,recipient:recipient.id,realm:p.realm,actor:p.id,target:q.id,kind,started:g.turn,deadline:g.turn+9,status:'pending'};note(g,p,p.name+' asked '+recipient.name+' to settle a '+kind+'.','petition',q.id);g.log?.unshift({date:g.year+' · month '+(g.month+1),text:p.name+' requests a personal decision; inspect your character.'});if(g.log)g.log=g.log.slice(0,45);return true;}
export function resolvePersonalDilemma(g,id,choice){const x=initAgency(g).dilemmas[id],p=x&&live(g,x.actor),q=x&&live(g,x.target),r=x&&live(g,x.recipient);if(!x||x.status!=='pending'||x.deadline<g.turn||!free(g,r)||!controlled(g,r)||!free(g,p)||!free(g,q)||p.realm!==x.realm||q.realm!==x.realm||r.realm!==x.realm||r.id!==g.politics.realms[x.realm]?.ruler)return no('Personal decision is no longer available.');if(!['mediate','support','decline'].includes(choice))return no('Unknown decision.');if(choice==='mediate'){if(num(r.wealth)<40)return no('Requires 40 personal gold.');r.wealth-=40;p.wealth=num(p.wealth)+20;q.wealth=num(q.wealth)+20;relation(g,p,q,25);relation(g,r,p,10);relation(g,r,q,10);stress(p,-12);stress(q,-12);}else if(choice==='support'){if(num(r.wealth)<60)return no('Requires 60 personal gold.');r.wealth-=60;p.wealth=num(p.wealth)+60;relation(g,r,p,20);relation(g,r,q,-16);relation(g,p,q,-10);stress(q,10);}else{relation(g,r,p,-12);stress(p,8);}x.status=choice;x.ended=g.turn;note(g,p,r.name+' resolved the '+x.kind+': '+choice+'.','resolution',q.id);return ok('Personal decision resolved.');}
export function recordLifeEvent(g,p,kind,target,text){if(!p?.id)return;note(g,p,text,kind,target?.id||target||null);}
export function rememberBereavement(g,p,extraIds=[]){
 if(!p?.id||p._bereavedTurn===g.turn)return;
 p._bereavedTurn=g.turn;
 const parents=new Set(p.parents||[]);
 const siblings=parents.size?Object.values(g.politics?.people||{}).filter(x=>x?.alive&&x.id!==p.id&&(x.parents||[]).some(pid=>parents.has(pid))).map(x=>x.id):[];
 const family=new Set([p.spouse,...(p.spouses||[]),...(p.parents||[]),...(p.children||[]),...siblings,...(extraIds||[])].filter(Boolean));
 family.delete(p.id);
 for(const id of family){const q=live(g,id);if(!q?.alive)continue;stress(q,has(q,'reserved')?14:20);note(g,q,q.name+' mourned the death of '+p.name+'.','bereavement',p.id);}
}

const OPPOSITE_TRAITS={brave:'cautious',cautious:'brave',ambitious:'content',content:'ambitious',just:'arbitrary',arbitrary:'just',zealous:'cynical',cynical:'zealous',diligent:'indolent',indolent:'diligent',generous:'greedy',greedy:'generous',gregarious:'reserved',reserved:'gregarious',honest:'deceitful',deceitful:'honest',patient:'wrathful',wrathful:'patient'};
export function evolveCharacterTraits(g,p,milestone=null){
 if(!p?.alive)return [];
 p.traits??=[];
 const added=[];
 const grant=trait=>{
  if(p.traits.includes(trait))return false;
  const opp=OPPOSITE_TRAITS[trait];
  if(opp&&p.traits.includes(opp))p.traits=p.traits.filter(t=>t!==opp);
  else if(p.traits.length>=5)return false;
  p.traits.push(trait);
  added.push(trait);
  p.memories??=[];p.memories.push(p.name+' developed the '+trait+' trait in '+g.year+'.');
  return true;
 };
 if(milestone==='victory'){if(!grant('brave'))grant('strategist');}
 else if(milestone==='schism')grant('zealous');
 else if(milestone==='petition')grant('just');
 else if(milestone==='vendetta'){if(!grant('wrathful'))grant('ambitious');}
 else if(milestone==='stewardship')grant('diligent');
 else{
  if((p.grievances||[]).some(gr=>gr.severity>=55))grant(hash(p.id+g.turn)%2===0?'wrathful':'ambitious');
  else if((p.civic?.stress||0)>=80)grant('cynical');
 }
 return added;
}

export function factionCandidates(g,realm){
 const s=g.politics?.realms?.[realm],headId=s?.ruler;
 const people=Object.values(g.politics?.people||{}).filter(p=>free(g,p)&&p.realm===realm&&p.id!==headId);
 const out=[];
 for(const p of people){
  const est=Object.entries(g.politics?.holdings||{}).filter(([,h])=>h.realm===realm&&h.lord===p.id);
  const severe=(p.grievances||[]).filter(gr=>gr.severity>=45&&gr.against===headId);
  const op=headId?personalOpinion(g,p.id,headId):0;
  if(!severe.length&&(op>-35||!est.length))continue;
  const minLoy=est.length?Math.min(...est.map(([,h])=>h.loyalty??50)):50;
  if(severe.length||minLoy<45){
   const score=(severe[0]?.severity||0)+(100-minLoy)*0.6+Math.max(0,-op)*0.5;
   out.push({person:p.id,name:p.name||p.id,holdings:est.map(([id])=>id),severeGrievance:severe[0]||null,minLoyalty:minLoy,opinion:op,score:Math.round(score),preferredKind:claimantCandidates(g,realm).length?'claimant':'liberty'});
  }
 }
 return out.sort((a,b)=>b.score-a.score||a.person.localeCompare(b.person));
}
function reactToImprisonment(g,p){
 const pris=g.feudal?.prisoners?.[p.id];
 if(!pris||pris.status!=='held'||controlled(g,p))return;
 if(hash(p.id)%6!==g.turn%6)return;
 stress(p,8);
 const captorRuler=live(g,g.politics?.realms?.[pris.captor]?.ruler);
 if(captorRuler?.alive){
  recordGrievance(g,p.id,captorRuler.id,'imprisonment',20);
  relation(g,p,captorRuler,-12);
 }
}
function advancePersonal(g,p,peers,rows,council,head){
 const x=record(g,p.id),estate=localEstate(g,rows,p),age=p.age,st=num(p.civic?.stress),health=num(g.living?.health?.[p.id]?.severity);
 if(st>=60&&num(p.wealth)>=30){p.wealth-=30;stress(p,-22);note(g,p,p.name+' withdrew from court to recover from stress.','recovery');return true;}
 if(health>=65)return false;
 const r=p.realm,headOpinion=head?.id===p.id?0:personalOpinion(g,p.id,head?.id);
 // Persistent grudges and severe grievances escalate from saving wealth and court solidarity to faction conspiracy.
 const severeGrievance=(p.grievances||[]).find(gr=>gr.severity>=45&&live(g,gr.against)?.alive&&live(g,gr.against)?.realm===r);
 if(severeGrievance){
  const targetEnemy=live(g,severeGrievance.against);
  evolveCharacterTraits(g,p,'vendetta');
  // Forge solidarity with other dissatisfied nobles across the court/realm.
  const allies=peers.filter(q=>q.id!==severeGrievance.against&&canInteract(g,p,q)&&((q.grievances||[]).some(gr=>gr.against===severeGrievance.against)||personalOpinion(g,q.id,severeGrievance.against)<=-15||localEstate(g,rows,q).some(([,h])=>h.loyalty<55)));
  const ally=allies[0];
  if(ally){
   relation(g,p,ally,18);
   if(!p.spouse&&!ally.spouse&&p.sex!==ally.sex&&p.age>=20&&ally.age>=20&&p.house!==ally.house&&hash(p.id+ally.id)%2===0){
    personalMarriage(g,p.id,ally.id);
   }
  }
  // If the crown itself is the target of a severe grievance, push or join a claimant/liberty faction!
  if(head&&severeGrievance.against===head.id&&estate.length){
   loyalty(rows,p,-14);
   const realmStab=num(g.factions?.[r]?.stability??60);
   if(realmStab<75||g.turn-(severeGrievance.turn??g.turn)>=3||severeGrievance.severity>=55){
    const existing=Object.values(g.conflict?.factions||{}).find(fx=>fx.realm===r&&ACTIVE_FACTION_STATUSES.includes(fx.status)&&['claimant','liberty','noble'].includes(fx.kind));
    if(existing){
     for(const [pid] of estate)joinFaction(g,existing.id,pid);
     existing.pressure=cap((existing.pressure||15)+15,0,100);
     existing.discontent=existing.pressure;
     note(g,p,p.name+' joined the '+existing.kind+' faction over '+severeGrievance.reason+'.','faction',head.id);
     return true;
    }
    let claimants=claimantCandidates(g,r);
    if(!claimants.length&&severeGrievance.severity>=55&&targetEnemy){
     const pretender=peers.find(q=>q.id!==head.id&&q.age>=18&&q.house===head.house&&!controlled(g,q))||p;
     if(pretender&&pretender.id!==head.id){
      addClaim(g,pretender.id,r,{titleId:'k:'+r,strength:'weak',from:head.id,heritable:false});
      claimants=claimantCandidates(g,r);
     }
    }
    const claimantId=claimants[0]?.person||null;
    const kind=claimantId?'claimant':'liberty';
    const members=[...estate.map(([pid])=>pid),...(ally?localEstate(g,rows,ally).map(([pid])=>pid):[])];
    const fx=createFaction(g,null,r,kind,members,{leader:p.id,claimant:claimantId,pressure:35});
    if(fx){
     note(g,p,p.name+' launched a '+kind+' faction against '+head.name+' ('+severeGrievance.reason+').','faction',head.id);
     return true;
    }
   }
  }
  // Save personal wealth rather than spending frivolously while nursing a vendetta; undermine when flush.
  if(num(p.wealth)>=90&&startPersonalScheme(g,p.id,severeGrievance.against,'undermine').ok){
   note(g,p,p.name+' plotted against '+targetEnemy.name+' over '+severeGrievance.reason+'.','grievance',severeGrievance.against);
   return true;
  }
  return false;
 }
 const deepGrievance=(p.grievances||[]).find(gr=>gr.severity>=30&&live(g,gr.against)?.alive&&live(g,gr.against)?.realm===r);
 if(deepGrievance&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,deepGrievance.against,'undermine').ok){
  note(g,p,p.name+' plotted against '+live(g,deepGrievance.against).name+' over '+deepGrievance.reason+'.','grievance',deepGrievance.against);
  return true;
 }
 if(head&&head.id!==p.id&&estate.length&&headOpinion<=-35&&(has(p,'ambitious')||(p.personality?.boldness||0)>=30)){
   const h=estate.find(([,v])=>v.autonomy<2);
   if(h&&requestVassalPetition(g,r,p.id,h[0],'autonomy').ok){complete(g,p,'secure autonomy',head.id,1,2);note(g,p,p.name+' pressed the crown for autonomy.','political',head.id);return true;}
   if(num(p.wealth)>=40){p.wealth-=40;loyalty(rows,p,-8);bond(g,p,head,-10,10);complete(g,p,'organize opposition',head.id,1,3);note(g,p,p.name+' organized estate opposition to '+head.name+'.','political',head.id);return true;}
 }
 // Ambitious adult claimants exploit child regencies or weak legitimacy by rallying disaffected lords.
 const hasClaim=claimantCandidates(g,r).some(cl=>cl.person===p.id);
 if(head&&head.id!==p.id&&hasClaim&&(head.age<18||num(g.factions?.[r]?.legitimacy)<55)&&(has(p,'ambitious')||(p.personality?.boldness||0)>=50)&&(personalOpinion(g,p.id,head.id)<15)){
  const allyLord=peers.find(q=>q.id!==head.id&&q.id!==p.id&&canInteract(g,p,q)&&localEstate(g,rows,q).some(([,v])=>v.loyalty<55));
  if(allyLord){
   relation(g,p,allyLord,15);
   const allyEst=localEstate(g,rows,allyLord).map(([pid])=>pid);
   const existingClaimFx=Object.values(g.conflict?.factions||{}).find(fx=>fx.realm===r&&ACTIVE_FACTION_STATUSES.includes(fx.status)&&fx.kind==='claimant');
   if(existingClaimFx){
    for(const pid of allyEst)joinFaction(g,existingClaimFx.id,pid);
    existingClaimFx.claimant=existingClaimFx.claimant||p.id;
    existingClaimFx.pressure=cap((existingClaimFx.pressure||15)+14,0,100);
    existingClaimFx.discontent=existingClaimFx.pressure;
   }else if(allyEst.length){
    createFaction(g,null,r,'claimant',allyEst,{leader:allyLord.id,claimant:p.id,pressure:40});
   }
   note(g,p,p.name+' rallied disaffected nobles around a claim to the throne of '+r+'.','claimant',head.id);
   return true;
  }
 }
 if(x.agenda==='accumulate wealth'){
   const q=goal(g,p,'accumulate wealth');q.baseline??=num(p.wealth);q.progress=Math.max(0,num(p.wealth)-q.baseline);if(q.progress>=100)complete(g,p,'accumulate wealth',null,0,100);return false;
 }
 if(x.agenda==='develop ability'&&num(p.wealth)>=60){const skill=Object.keys(p.skills||{}).sort((a,b)=>num(p.skills[a])-num(p.skills[b])||a.localeCompare(b))[0];if(skill&&p.skills[skill]<5){p.wealth-=60;p.skills[skill]++;p.prestige=num(p.prestige)+2;complete(g,p,'develop ability',skill,1,2);note(g,p,p.name+' invested in '+skill+' training.','training');return true;}}
 // Educate children / take wards when unguarded royal/noble youths need mentorship.
 if((p.skills?.learning||0)>=3||(p.skills?.martial||0)>=3){
  const child=(p.children||[]).map(id=>live(g,id)).find(c=>c?.alive&&c.realm===r&&c.age>=6&&c.age<18&&c.civic&&!c.civic.guardian);
  if(child){child.civic.guardian=p.id;note(g,p,p.name+' took responsibility for educating '+child.name+'.','education',child.id);return true;}
 }
 // Adults form their own households without commandeering royal diplomatic marriages.
 if(!p.spouse&&age>=20&&age<=45&&num(p.wealth)>=90&&p.id!==head?.id&&p.house!==head?.house&&hash(p.id+':marry:'+g.turn)%3===0){
   const partner=peers.filter(q=>!controlled(g,q)&&q.id!==head?.id&&q.house!==head?.house&&q.sex!==p.sex&&!q.spouse&&q.age>=20&&q.age<=50&&Math.abs(q.age-age)<=18&&personalOpinion(g,p.id,q.id)>=0).sort((a,b)=>personalOpinion(g,p.id,b.id)-personalOpinion(g,p.id,a.id)||a.id.localeCompare(b.id)).find(q=>personalMarriage(g,p.id,q.id).ok);
   if(partner){relation(g,p,partner,20);p.prestige=num(p.prestige)+4;complete(g,p,'secure household',partner.id,1,1);return true;}
 }
 // Landed estate owners periodically reinvest personal wealth into estate prosperity.
 if(estate.length&&num(p.wealth)>=150&&hash(p.id+':estate:'+g.turn)%4===0){
   const [,h]=estate[0];p.wealth-=60;h.wealth=num(h.wealth)+45;p.prestige=num(p.prestige)+3;h.loyalty=cap(h.loyalty+2,0,100);
   note(g,p,p.name+' invested personal gold in estate improvements.','estate');return true;
 }
 const hostile=x.agenda==='undermine rival';const target=pickPeer(g,p,peers,hostile);
 if(!target)return false;const opinion=personalOpinion(g,p.id,target.id);
 if(hostile){
   if(opinion<=-45&&dilemma(g,p,target,'rivalry'))return true;
   if(opinion<=-35&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,target.id,localEstate(g,rows,target).length?'undermine':'discredit').ok){complete(g,p,'undermine rival',target.id,1,3);note(g,p,p.name+' began a personal scheme against '+target.name+'.','scheme',target.id);return true;}
   if(opinion>-90){relation(g,p,target,-16);loyalty(rows,target,-2);stress(target,5);complete(g,p,'undermine rival',target.id);note(g,p,p.name+' openly opposed '+target.name+'.','rivalry',target.id);return true;}
 }
 if(x.agenda==='seek influence'&&head&&head.id!==p.id&&estate.length&&!council.has(p.id)&&requestVassalPetition(g,r,p.id,estate[0][0],'council').ok){complete(g,p,'seek council office',head.id,1,2);return true;}
 if(x.agenda==='seek influence'&&head&&head.id!==p.id&&!council.has(p.id)&&g.royalCourt?.realms?.[r]&&!humanControlsRealm(g,r)){
  const rc=g.royalCourt.realms[r],f=g.factions[r],busy=new Set(Object.values(rc.offices||{}).map(o=>o.person));
  if(!busy.has(p.id)&&f?.treasury>=160){
   const role=['treasurer','quartermaster','envoy','archivist','intelligence','physician'].find(k=>!rc.offices?.[k]&&g.turn-(rc.last?.[k]??-120)>=6);
   if(role){rc.offices[role]={person:p.id,appointed:g.turn,paidUntil:g.turn+3};rc.last[role]=g.turn;f.treasury-=55;p.wealth=num(p.wealth)+15;p.prestige=num(p.prestige)+4;complete(g,p,'seek court office',head.id,1,1);note(g,p,p.name+' secured appointment as '+role+'.','office');return true;}
  }
 }
 if(head&&head.id!==p.id&&g.feudal?.claimants?.[r+':'+p.id]&&(p.personality?.boldness||0)>=10&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,head.id,'undermine').ok){
  complete(g,p,'press claim',head.id,1,2);note(g,p,p.name+' pressed a dynastic claim at court.','claim',head.id);return true;
 }
 // Romantic attraction for high-sociability compatible peers
 if(opinion>=35&&target.sex!==p.sex&&!(p.lovers||[]).includes(target.id)&&(p.personality?.sociability||0)>=15&&hash(p.id+target.id+g.turn)%5===0){
   addRomance(g,p.id,target.id);return true;
 }
 if(opinion<0&&has(p,'just')&&num(p.wealth)>=25){p.wealth-=25;target.wealth=num(target.wealth)+25;relation(g,p,target,20);stress(p,-5);stress(target,-5);note(g,p,p.name+' reconciled with '+target.name+'.','reconciliation',target.id);return true;}
 if(num(p.wealth)>=35&&opinion<75){transfer(g,p,target,35,p);relation(g,p,target,15);x.influence=cap(x.influence+3,0,100);p.influence=x.influence;complete(g,p,x.agenda,target.id);if(opinion<50&&personalOpinion(g,p.id,target.id)>=50)note(g,p,p.name+' became friends with '+target.name+'.','friendship',target.id);else note(g,p,p.name+' cultivated ties with '+target.name+'.','patronage',target.id);if(head?.id===target.id)loyalty(rows,p,5);return true;}
 return false;
}
export function tickAgency(g){const root=initAgency(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;
 const groups=new Map(),rows=new Map(),land=new Set(Object.values(g.provinces||{}).map(p=>p.owner)),{landedSet,commanderSet}=roleSets(g);
 for(const p of Object.values(g.politics.people)){if(!p.alive)continue;ensureCharacterSchema(g,p,landedSet,commanderSet);const x=record(g,p.id);x.agenda=motive(p);if(!free(g,p)){reactToImprisonment(g,p);continue;}if(!groups.has(p.realm))groups.set(p.realm,[]);groups.get(p.realm).push(p);}
 for(const [id,h] of Object.entries(g.politics.holdings)){if(g.provinces[id]?.owner!==h.realm)continue;if(!rows.has(h.lord))rows.set(h.lord,[]);rows.get(h.lord).push([id,h]);}
 for(const [r,people] of groups){const s=g.politics.realms[r];if(!s||!land.has(r))continue;const head=live(g,s.ruler),council=new Set(Object.values(s.council||{}));people.sort((a,b)=>a.id.localeCompare(b.id));
 for(const p of people){const x=record(g,p.id),estate=localEstate(g,rows,p);if(g.turn%12===0&&x.lastIncome!==g.turn){for(const [,h] of estate){const draw=Math.min(25,Math.floor(Math.max(0,num(h.wealth))*.12));h.wealth-=draw;p.wealth=num(p.wealth)+draw;}x.lastIncome=g.turn;const standing=(council.has(p.id)?3:0)+(estate.length?2:0)+(p.id===s.ruler?2:0);x.influence=cap(x.influence+standing-(standing?0:2),0,100);p.influence=x.influence;p.prestige=num(p.prestige)+(council.has(p.id)?2:0)+(estate.length?2:0)+(p.id===s.ruler?4:0);p.piety=num(p.piety)+(p.role==='clergy'?3:p.traits?.includes('zealous')?2:0);}
 reviewChosenGoal(g,p);if(g.turn%12===0)evolveCharacterTraits(g,p);if(g.turn%3===0&&p.id!==head?.id){const pressure=(num(g.factions[r]?.stability)<40?3:0)+(estate.some(([,h])=>h.loyalty<35)?3:0)+(num(g.living?.health?.[p.id]?.severity)>=50?3:0);stress(p,pressure||-2);}
 }
 // Staggered monthly modulo cohorts without artificial 6-character realm bottleneck.
 const ready=people.filter(p=>!controlled(g,p)&&g.turn-record(g,p.id).lastAction>=6&&hash(p.id)%6===g.turn%6).sort((a,b)=>record(g,a.id).lastAction-record(g,b.id).lastAction||a.id.localeCompare(b.id));
 for(const p of ready){const x=record(g,p.id);x.lastAction=g.turn;advancePersonal(g,p,people.filter(q=>q.id!==p.id),rows,council,head);}
 }
 syncCharacterRelationships(g);
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
