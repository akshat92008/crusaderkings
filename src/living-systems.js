// Character health, cadet house records, and realm-specific cultural institutions.
// These are abstract fictional game mechanics, not historical or medical advice.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
const ruler=(g,r)=>g.politics.people[g.politics.realms[r]?.ruler];
const live=(g,id)=>g.politics.people[id]?.alive?g.politics.people[id]:null;
const adult=(g,r,id)=>{const p=live(g,id);return p&&p.realm===r&&p.age>=18&&!isImprisoned(g,id)?p:null;};
export const COMMUNITY_POLICIES={relief:{name:'Community relief',desc:'Institutions prioritize local trust and relief.'},learning:{name:'Scholarly stewardship',desc:'Institutions support learning and research.'},mediation:{name:'Community mediation',desc:'Institutions support acceptance and local stability.'}};
function note(g,r,message){const s=g.living;s.history.unshift({realm:r,turn:g.turn,message});s.history=s.history.slice(0,160);if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function health(g,p){return g.living.health[p.id]??={condition:'well',severity:0,started:g.turn,lastCare:-120,until:0};}
function recordRealm(g,r){return g.living.realms[r]??={physician:null,faithAdvisor:null,culturePatron:null,policy:'relief',policyAt:-120,branchAt:-120};}
export function initLiving(g){g.living??={version:1,seed:145091,health:{},realms:{},branches:{},history:[],lastTick:-1};for(const r of Object.keys(g.politics.realms))recordRealm(g,r);return g.living;}
export function characterHealth(g,id){return g.living?.health[id]||{condition:'well',severity:0,until:0};}
export function officeOptions(g,r,role){const s=g.living?.realms[r];if(!s)return [];return Object.values(g.politics.people).filter(p=>adult(g,r,p.id)&&p.id!==ruler(g,r)?.id&&(p.skills.learning||0)>=2&&!['physician','faithAdvisor','culturePatron'].some(k=>k!==role&&s[k]===p.id));}
function office(g,r,role){return adult(g,r,g.living?.realms[r]?.[role]);}
export function researchPatronBonus(g,r){const p=office(g,r,'culturePatron'),s=g.living?.realms[r];return p?Math.floor(p.skills.learning/2)+(s.policy==='learning'?2:0):0;}
export function healthPenalty(g,id){return Math.floor((characterHealth(g,id).severity||0)/30);}
function care(g,r,id){const p=live(g,id),f=g.factions[r],h=p&&health(g,p),doc=office(g,r,'physician');if(!p||p.realm!==r||!h.severity||g.turn-h.lastCare<3||f.treasury<70)return no('Requires a sick local character, 70 gold and three months between care.');f.treasury-=70;h.lastCare=g.turn;h.until=g.turn+3;h.severity=cap(h.severity-(doc?8+doc.skills.learning*3:8),0,100);if(!h.severity)h.condition='well';return ok('Care provided.');}
export function livingAction(g,world,action,id,extra){initLiving(g);const r=g.player,s=recordRealm(g,r),f=g.factions[r];if(!own(g,r).length)return no('Requires controlled land.');
 if(action==='appoint'){if(!['physician','faithAdvisor','culturePatron'].includes(id)||!officeOptions(g,r,id).some(p=>p.id===extra)||s[id]===extra||f.treasury<100)return no('Choose an available adult with learning 2+ and 100 gold.');f.treasury-=100;s[id]=extra;return ok('Court appointment made.');}
 if(action==='care')return care(g,r,id);
 if(action==='policy'){if(!COMMUNITY_POLICIES[id]||s.policy===id||g.turn-s.policyAt<36||f.treasury<150)return no('Requires 150 gold and three years between policies.');f.treasury-=150;s.policy=id;s.policyAt=g.turn;return ok('Institutional policy changed.');}
 if(action==='branch'){const p=adult(g,r,id),head=ruler(g,r);if(!p||p.id===head.id||p.house!==head.house||g.living.branches[p.id]||g.turn-s.branchAt<60||f.treasury<200||f.prestige<20||!Object.values(g.politics.holdings).some(h=>h.realm===r&&h.lord===id))return no('Requires a landed adult relative, 200 gold, 20 prestige and five years between charters.');f.treasury-=200;f.prestige-=20;s.branchAt=g.turn;g.living.branches[p.id]={founder:p.id,realm:r,dynasty:p.house,name:p.name+' branch',created:g.turn};p.cadetBranch=p.id;note(g,r,p.name+' founded a cadet branch.');return ok('Cadet house chartered; dynasty and succession claims preserved.');}
 return no('Unknown character or community action.');}
export function tickLiving(g,world,removeCharacter){const s=initLiving(g);if(s.lastTick===g.turn)return;s.lastTick=g.turn;if(g.turn%3!==0)return;
 const affected=new Set(Object.values(g.economy?.crises||{}).filter(x=>x.kind==='epidemic').map(x=>g.provinces[x.province]?.owner));
 for(const p of Object.values(g.politics.people)){if(!p.alive){delete s.health[p.id];continue;}if(!p.cadetBranch){const parent=p.parents.map(id=>g.politics.people[id]).find(x=>x?.cadetBranch&&x.house===p.house);if(parent)p.cadetBranch=parent.cadetBranch;}
 const h=s.health[p.id],risk=affected.has(p.realm)?.07:p.age>=65?.018:.004;
 if(!h?.severity){if(random(s)<risk){const x=health(g,p);x.condition=affected.has(p.realm)?'epidemic illness':'illness';x.severity=25+Math.floor(random(s)*25);x.started=g.turn;if(p.id===ruler(g,p.realm)?.id)note(g,p.realm,p.name+' became ill.');}continue;}
 const doc=office(g,p.realm,'physician'),change=(random(s)<.64?-10:9)-(h.until>=g.turn?5:0)-(doc?Math.floor(doc.skills.learning/2):0)+(affected.has(p.realm)?4:0);h.severity=cap(h.severity+change,0,100);if(!h.severity){h.condition='well';if(p.id===ruler(g,p.realm)?.id)note(g,p.realm,p.name+' recovered.');}else if(h.severity>=85&&random(s)<.18){if(removeCharacter(g,world,p.id))note(g,p.realm,p.name+' died after illness.');}
 }
 for(const [r,x] of Object.entries(s.realms)){const f=g.factions[r],land=own(g,r);if(!land.length)continue;for(const role of ['physician','faithAdvisor','culturePatron'])if(x[role]&&!office(g,r,role))x[role]=null;
 const advisor=office(g,r,'faithAdvisor');if(advisor){const supported=land.filter(p=>g.identity.institutions[p.id]?.level>0);for(const p of supported){const l=g.civic.provinces[p.id];if(x.policy==='relief')l.localTrust=cap(l.localTrust+2,0,100);if(x.policy==='mediation')l.acceptance=cap(l.acceptance+2,0,100);}if(supported.length&&g.identity.realms[r])g.identity.realms[r].faithAuthority=cap(g.identity.realms[r].faithAuthority+Math.floor(advisor.skills.learning/2),0,100);}
 if(r!==g.player){const sovereign=ruler(g,r);if(sovereign&&characterHealth(g,sovereign.id).severity>=35&&f.treasury>250)care(g,r,sovereign.id);if(g.turn%12===0&&f.treasury>700){const role=['physician','faithAdvisor','culturePatron'].find(k=>!x[k]),candidate=role&&officeOptions(g,r,role).sort((a,b)=>b.skills.learning-a.skills.learning)[0];if(candidate){f.treasury-=100;x[role]=candidate.id;}}}
 }
}
