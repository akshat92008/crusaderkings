// Character-owned political capital, independent ambitions and real wealth transfers.
import {changeOpinion,personalOpinion} from './chronicle-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
const live=(g,id)=>g.politics?.people?.[id],free=(g,p)=>p?.alive&&p.age>=18&&g.feudal?.prisoners?.[p.id]?.status!=='held';
const pair=(a,b)=>[a,b].sort().join('|'),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
export function initAgency(g){return g.agency??={version:1,people:{},lastTick:-1,history:[]};}
function record(g,id){const s=initAgency(g);return s.people[id]??={influence:10,agenda:null,lastAction:-120,lastIncome:-120};}
export function characterInfluence(g,id){return cap(num(g.agency?.people?.[id]?.influence??10),0,100);}
export function characterAgenda(g,id){return g.agency?.people?.[id]?.agenda||null;}
function note(g,p,text){const s=initAgency(g);s.history.unshift({realm:p.realm,person:p.id,turn:g.turn,text});s.history=s.history.slice(0,160);}
function motive(p){const t=p.traits||[];return t.includes('ambitious')?'seek influence':t.includes('greedy')?'accumulate wealth':t.includes('gregarious')||t.includes('generous')?'build friendships':t.includes('wrathful')||t.includes('deceitful')?'undermine rival':t.includes('diligent')?'develop ability':'secure household';}
function transfer(g,p,q,amount,source){if(source.wealth<amount)return false;source.wealth-=amount;q.wealth=num(q.wealth)+amount;return true;}
export function characterInteraction(g,r,id,action){const s=g.politics?.realms?.[r],p=live(g,s?.ruler),q=live(g,id),f=g.factions[r];if(!free(g,p)||!free(g,q)||q.realm!==r||p.id===id)return no('Choose a free adult subject other than the sovereign.');
 const x=record(g,p.id),target=record(g,id),rel=g.chronicles?.relationships?.[pair(p.id,id)];if(g.turn-(rel?.last??-120)<12)return no('Personal interactions require a yearly interval.');
 if(action==='personal-gift'){if(num(p.wealth)<40)return no('Requires 40 personal gold, not treasury funds.');if(!transfer(g,p,q,40,p))return no('Insufficient personal wealth.');changeOpinion(g,p.id,q.id,16);target.influence=cap(target.influence+2,0,100);}
 else if(action==='personal-patronage'){if(f.treasury<120)return no('Requires 120 treasury gold.');f.treasury-=120;q.wealth=num(q.wealth)+120;changeOpinion(g,p.id,q.id,24);target.influence=cap(target.influence+8,0,100);x.influence=cap(x.influence+2,0,100);}
 else if(action==='personal-rebuke'){if(x.influence<5)return no('Requires 5 personal influence.');x.influence-=5;target.influence=cap(target.influence-8,0,100);changeOpinion(g,p.id,q.id,-20);}
 else return no('Unknown personal interaction.');
 g.chronicles.relationships[pair(p.id,id)].last=g.turn;note(g,p,p.name+' → '+q.name+': '+action.slice(9));return ok('Personal interaction completed.');}
export function tickAgency(g){const root=initAgency(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;if(g.turn%12!==0)return;
 const groups=new Map(),holdings=new Map();for(const p of Object.values(g.politics.people)){if(!free(g,p))continue;if(!groups.has(p.realm))groups.set(p.realm,[]);groups.get(p.realm).push(p);}
 for(const [id,h] of Object.entries(g.politics.holdings)){if(g.provinces[id]?.owner!==h.realm)continue;if(!holdings.has(h.lord))holdings.set(h.lord,[]);holdings.get(h.lord).push(h);}
 for(const [r,people] of groups){const s=g.politics.realms[r];if(!s||!Object.values(g.provinces).some(p=>p.owner===r))continue;const ruler=live(g,s.ruler),council=new Set(Object.values(s.council||{})),important=people.filter(p=>p.id===s.ruler||council.has(p.id)||holdings.has(p.id)||p.house===ruler?.house).sort((a,b)=>a.id.localeCompare(b.id));
 for(const p of important){const x=record(g,p.id),estate=holdings.get(p.id)||[];x.agenda=motive(p);
 // Estate income is transferred, not created: personal accounts and estate reserves remain separate.
 if(x.lastIncome!==g.turn){for(const h of estate){const draw=Math.min(25,Math.floor(Math.max(0,num(h.wealth))*.12));h.wealth-=draw;p.wealth=num(p.wealth)+draw;}x.lastIncome=g.turn;}
 const standing=(council.has(p.id)?3:0)+(estate.length?2:0)+(p.id===s.ruler?2:0);x.influence=cap(x.influence+standing-(standing?0:2),0,100);
 if(p.id===s.ruler&&r===g.player||g.turn-x.lastAction<12)continue;
 if(x.agenda==='develop ability'&&p.wealth>=60){const skill=Object.keys(p.skills||{}).sort((a,b)=>num(p.skills[a])-num(p.skills[b])||a.localeCompare(b))[0];if(skill&&p.skills[skill]<5){p.wealth-=60;p.skills[skill]++;x.lastAction=g.turn;note(g,p,p.name+' invested in '+skill+' training.');continue;}}
 if(x.agenda==='accumulate wealth'||x.agenda==='secure household')continue;
 const peers=important.filter(q=>q.id!==p.id&&q.id!==s.ruler&&q.age>=18),hostile=x.agenda==='undermine rival';const target=peers.sort((a,b)=>hostile?personalOpinion(g,p.id,a.id)-personalOpinion(g,p.id,b.id)||a.id.localeCompare(b.id):personalOpinion(g,p.id,b.id)-personalOpinion(g,p.id,a.id)||characterInfluence(g,b.id)-characterInfluence(g,a.id)||a.id.localeCompare(b.id))[0];
 if(!target)continue;const rel=g.chronicles.relationships[pair(p.id,target.id)];if(g.turn-(rel?.last??-120)<12)continue;
 if(hostile&&personalOpinion(g,p.id,target.id)>-80){changeOpinion(g,p.id,target.id,-12);record(g,target.id).influence=cap(characterInfluence(g,target.id)-2,0,100);}
 else if(!hostile&&p.wealth>=35&&personalOpinion(g,p.id,target.id)<80){transfer(g,p,target,35,p);changeOpinion(g,p.id,target.id,15);x.influence=cap(x.influence+3,0,100);}
 else continue;g.chronicles.relationships[pair(p.id,target.id)].last=g.turn;x.lastAction=g.turn;note(g,p,p.name+(hostile?' opposed ':' cultivated ties with ')+target.name+'.');
 }}for(const id of Object.keys(root.people))if(!live(g,id)?.alive)delete root.people[id];}
