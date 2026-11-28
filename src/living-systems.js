import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
// Character health, cadet house records, and realm-specific cultural institutions.
// These are abstract fictional game mechanics, not historical or medical advice.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
const ruler=(g,r)=>g.politics.people[g.politics.realms[r]?.ruler];
const live=(g,id)=>g.politics.people[id]?.alive?g.politics.people[id]:null;
const adult=(g,r,id)=>{const p=live(g,id);return p&&p.realm===r&&p.age>=18&&!isImprisoned(g,id)?p:null;};
export const HEALTH_CONDITIONS={
 well:{name:'Well',chronic:false,injury:false,mortality:0},
 illness:{name:'Illness',chronic:false,injury:false,mortality:.18},
 'epidemic illness':{name:'Epidemic illness',chronic:false,injury:false,mortality:.24},
 plague:{name:'Plague',chronic:false,injury:false,mortality:.30},
 fever:{name:'Fever',chronic:false,injury:false,mortality:.16},
 consumption:{name:'Consumption',chronic:true,injury:false,mortality:.20},
 wounded:{name:'Wounded',chronic:false,injury:true,mortality:.14},
 maimed:{name:'Maimed',chronic:true,injury:true,mortality:.12},
 melancholy:{name:'Melancholy',chronic:true,injury:false,mortality:.06},
 infirm:{name:'Infirm',chronic:true,injury:false,mortality:.22},
 bedridden:{name:'Bedridden',chronic:true,injury:false,mortality:.28}
};
export const COMMUNITY_POLICIES={relief:{name:'Community relief',desc:'Institutions prioritize local trust and relief.'},learning:{name:'Scholarly stewardship',desc:'Institutions support learning and research.'},mediation:{name:'Community mediation',desc:'Institutions support acceptance and local stability.'}};
function note(g,r,message){const s=g.living;s.history.unshift({realm:r,turn:g.turn,message});s.history=s.history.slice(0,160);if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:message});g.log=g.log.slice(0,45);}}
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function health(g,p){const h=g.living.health[p.id]??={condition:'well',severity:0,started:g.turn,lastCare:-120,until:0};h.chronic??=!!HEALTH_CONDITIONS[h.condition]?.chronic;h.injury??=!!HEALTH_CONDITIONS[h.condition]?.injury;return h;}
function recordRealm(g,r){return g.living.realms[r]??={physician:null,faithAdvisor:null,culturePatron:null,policy:'relief',policyAt:-120,branchAt:-120};}
export function initLiving(g){g.living??={version:1,seed:145091,health:{},realms:{},branches:{},history:[],lastTick:-1};g.living.health??={};g.living.realms??={};g.living.branches??={};g.living.history??=[];for(const r of Object.keys(g.politics?.realms||{}))recordRealm(g,r);return g.living;}
export function characterHealth(g,id){return g.living?.health?.[id]||{condition:'well',severity:0,until:0,chronic:false,injury:false};}
export function inflictCharacterCondition(g,id,condition='wounded',severity=35){initLiving(g);const p=live(g,id);if(!p||!Object.hasOwn(HEALTH_CONDITIONS,condition)||condition==='well')return false;const h=health(g,p),meta=HEALTH_CONDITIONS[condition];h.condition=condition;h.severity=cap(Math.max(h.severity||0,severity),10,100);h.chronic=meta.chronic;h.injury=meta.injury;h.started=g.turn;p.memories??=[];p.memories.push('Suffered '+meta.name.toLowerCase()+' in '+g.year+'.');p.memories=p.memories.slice(-40);return true;}
export function recoverCharacterCondition(g,id,amount=25){initLiving(g);const p=live(g,id),h=p&&g.living.health[id];if(!h||!h.severity)return false;h.severity=cap(h.severity-amount,0,100);if(!h.severity){h.condition='well';h.chronic=false;h.injury=false;h.immuneUntil=g.turn+24;}return true;}
export function officeOptions(g,r,role){const s=g.living?.realms[r];if(!s)return [];return Object.values(g.politics.people).filter(p=>adult(g,r,p.id)&&p.id!==ruler(g,r)?.id&&(p.skills.learning||0)>=2&&!['physician','faithAdvisor','culturePatron'].some(k=>k!==role&&s[k]===p.id));}
function office(g,r,role){const p=adult(g,r,g.living?.realms[r]?.[role]);return p&&p.id!==ruler(g,r)?.id&&characterHealth(g,p.id).severity<70?p:null;}
export function researchPatronBonus(g,r){const p=office(g,r,'culturePatron'),s=g.living?.realms[r];return p?Math.floor(p.skills.learning/2)+(s.policy==='learning'?2:0):0;}
export function healthPenalty(g,id){return Math.floor((characterHealth(g,id).severity||0)/30);}
function care(g,r,id){const p=live(g,id),f=g.factions[r],h=p&&health(g,p),doc=office(g,r,'physician');if(!p||p.realm!==r||!h.severity||g.turn-h.lastCare<3||f.treasury<70)return no('Requires a sick local character, 70 gold and three months between care.');f.treasury-=70;h.lastCare=g.turn;h.until=g.turn+3;h.severity=cap(h.severity-(doc?8+doc.skills.learning*3:8),0,100);if(!h.severity)h.condition='well';return ok('Care provided.');}
export function livingAction(g,world,action,id,extra){initLiving(g);const r=g.player,s=recordRealm(g,r),f=g.factions[r];if(!own(g,r).length)return no('Requires controlled land.');
 if(action==='appoint'){if(!['physician','faithAdvisor','culturePatron'].includes(id)||!officeOptions(g,r,id).some(p=>p.id===extra)||s[id]===extra||f.treasury<100)return no('Choose an available adult with learning 2+ and 100 gold.');f.treasury-=100;s[id]=extra;return ok('Court appointment made.');}
 if(action==='care')return care(g,r,id);
 if(action==='policy'){if(!COMMUNITY_POLICIES[id]||s.policy===id||g.turn-s.policyAt<36||f.treasury<150)return no('Requires 150 gold and three years between policies.');f.treasury-=150;s.policy=id;s.policyAt=g.turn;return ok('Institutional policy changed.');}
 if(action==='branch'){const p=adult(g,r,id),head=ruler(g,r);if(!p||p.id===head.id||p.house!==head.house||p.cadetBranch||g.living.branches[p.id]||g.turn-s.branchAt<60||f.treasury<200||f.prestige<20||!Object.values(g.politics.holdings).some(h=>h.realm===r&&h.lord===id))return no('Requires a landed adult relative, 200 gold, 20 prestige and five years between charters.');f.treasury-=200;f.prestige-=20;s.branchAt=g.turn;g.living.branches[p.id]={founder:p.id,realm:r,dynasty:p.house,name:p.name+' branch',created:g.turn};p.cadetBranch=p.id;note(g,r,p.name+' founded a cadet branch.');return ok('Cadet house chartered; dynasty and succession claims preserved.');}
 return no('Unknown character or community action.');}
export function tickLiving(g,world,removeCharacter){const s=initLiving(g);if(s.lastTick===g.turn)return;s.lastTick=g.turn;if(g.turn%3!==0)return;
 const affected=new Set(Object.values(g.economy?.crises||{}).filter(x=>x.kind==='epidemic').map(x=>g.provinces[x.province]?.owner));
 const warring=new Set(Object.values(g.conflict?.wars||{}).filter(w=>w.status==='active').flatMap(w=>[w.attacker,w.defender]));
 const commanders=new Set(Object.values(g.military?.armies||{}).map(a=>a.commander).filter(Boolean));
 for(const p of Object.values(g.politics.people)){if(!p.alive){delete s.health[p.id];continue;}if(!g.politics.realms[p.realm])continue;if(!p.cadetBranch){const parent=(p.parents||[]).map(id=>g.politics.people[id]).find(x=>x?.cadetBranch&&x.house===p.house);if(parent)p.cadetBranch=parent.cadetBranch;}
 const h=s.health[p.id],immune=(h?.immuneUntil||0)>g.turn,inEpidemic=affected.has(p.realm)&&!immune,inBattle=warring.has(p.realm)&&commanders.has(p.id);
 const risk=(inEpidemic?.07:p.age>=68?.022:p.age>=60?.012:.004)+(p.civic?.stress>=75?.025:0)+(p.age<6?.008:0)+(inBattle?.018:0);
 if(!h?.severity){if(random(s)<risk){const x=health(g,p);let cond='illness';if(inEpidemic)cond=random(s)<.45?'plague':'epidemic illness';else if(inBattle&&random(s)<.5)cond='wounded';else if(p.age>=68&&random(s)<.45)cond='infirm';else if((p.civic?.stress||0)>=80&&random(s)<.4)cond='melancholy';else if(random(s)<.35)cond='fever';const meta=HEALTH_CONDITIONS[cond];x.condition=cond;x.chronic=meta.chronic;x.injury=meta.injury;x.severity=25+Math.floor(random(s)*25);x.started=g.turn;if(p.id===ruler(g,p.realm)?.id)note(g,p.realm,p.name+' developed '+meta.name.toLowerCase()+'.');}continue;}
 const doc=office(g,p.realm,'physician');if(!humanControlsCharacter(g,p.id)&&p.id!==ruler(g,p.realm)?.id&&p.age>=18&&!isImprisoned(g,p.id)&&h.severity>=40&&p.wealth>=45&&g.turn-h.lastCare>=6){p.wealth-=45;h.lastCare=g.turn;h.until=g.turn+3;h.severity=cap(h.severity-(doc?12:7),0,100);if(!h.severity){h.condition='well';h.chronic=false;h.injury=false;h.immuneUntil=g.turn+18;continue;}}
 const meta=HEALTH_CONDITIONS[h.condition]||HEALTH_CONDITIONS.illness;
 const change=(random(s)<(h.chronic?.48:.64)?-10:9)-(h.until>=g.turn?5:0)-(doc?Math.floor(doc.skills.learning/2):0)+(affected.has(p.realm)?4:0)+(p.civic?.stress>=75?3:0);
 h.severity=cap(h.severity+change,0,100);
 if(!h.severity){h.condition='well';h.chronic=false;h.injury=false;h.immuneUntil=g.turn+18;if(p.id===ruler(g,p.realm)?.id)note(g,p.realm,p.name+' recovered.');}
 else if(h.severity>=85&&random(s)<(meta.mortality||.18)){p.deathReason='died of '+(meta.name||'illness').toLowerCase();if(removeCharacter(g,world,p.id))note(g,p.realm,p.name+' died after '+(meta.name||'illness').toLowerCase()+'.');}
 }
 for(const [r,x] of Object.entries(s.realms)){const f=g.factions[r],land=own(g,r);if(!land.length)continue;for(const role of ['physician','faithAdvisor','culturePatron'])if(x[role]&&(!adult(g,r,x[role])||x[role]===ruler(g,r)?.id))x[role]=null;
 const advisor=office(g,r,'faithAdvisor');if(advisor){const supported=land.filter(p=>g.identity.institutions[p.id]?.level>0);for(const p of supported){const l=g.civic.provinces[p.id];if(x.policy==='relief')l.localTrust=cap(l.localTrust+2,0,100);if(x.policy==='mediation')l.acceptance=cap(l.acceptance+2,0,100);}if(supported.length&&g.identity.realms[r])g.identity.realms[r].faithAuthority=cap(g.identity.realms[r].faithAuthority+Math.floor(advisor.skills.learning/2),0,100);}
 if(!humanControlsRealm(g,r)){const sovereign=ruler(g,r);if(sovereign&&characterHealth(g,sovereign.id).severity>=35&&f.treasury>250)care(g,r,sovereign.id);if(g.turn%12===0&&f.treasury>700){const role=['physician','faithAdvisor','culturePatron'].find(k=>!x[k]),candidate=role&&officeOptions(g,r,role).sort((a,b)=>b.skills.learning-a.skills.learning)[0];if(candidate){f.treasury-=100;x[role]=candidate.id;}}}
 }
}
