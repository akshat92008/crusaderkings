import {humanControlsRealm} from './player-career.js';
import {ADDITIONAL_AMBITIONS,ambitionBaseline,additionalAmbitionAvailable,additionalAmbitionProgress} from './ambition-goals.js';
// Original alternate-history decisions; not scripted claims of historical events.
import {controller} from './campaign-war.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
const ruler=(g,realm)=>g.politics.people[g.politics.realms[realm]?.ruler];
const land=(g,realm)=>Object.values(g.provinces).filter(p=>p.owner===realm&&controller(g,p.id)===realm);
const nobles=(g,realm)=>Object.entries(g.politics.holdings).filter(([id,h])=>h.realm===realm&&controller(g,id)===realm);
const pair=(a,b)=>[a,b].sort().join('|');
export const REGIONAL_DECISIONS={
 england:['Reconcile the noble estates','Negotiate a new settlement with competing noble houses.','loyalty'],
 france:['Restore the frontier towns','Invest in rebuilding and administering frontier communities.','develop'],
 castile:['Survey the royal estates','Commission a survey of crown lands and obligations.','authority'],
 portugal:['Sponsor Atlantic merchants','Support commercial expeditions and merchant credit.','trade'],
 aragon:['Convene the territorial estates','Negotiate privileges and cooperation across the crown.','loyalty'],
 burgundy:['Patronize the workshops','Support urban craft production and commercial institutions.','craft'],
 imperial:['Convene an imperial assembly','Seek compromise between regional estates.','loyalty'],
 poland:['Renew noble privileges','Secure cooperation from the landed estates.','loyalty'],
 muscovy:['Consolidate the royal administration','Strengthen central institutions and authority.','authority'],
 novgorod:['Confirm merchant privileges','Support the merchant network and urban markets.','trade'],
 ottomans:['Review the provincial households','Reorganize provincial military and administrative obligations.','military'],
 mamluks:['Review military patronage','Support military households and retainers.','military'],
 timurids:['Endow a scholarly court','Sponsor learning and manuscript preservation.','learning'],
 qara:['Convene the tribal chiefs','Negotiate cooperation among military and local leaders.','loyalty'],
 horde:['Gather the clan leaders','Renew the political compact of the confederation.','loyalty'],
 morocco:['Strengthen caravan markets','Support markets serving inland trade networks.','trade'],
 ethiopia:['Renew regional compacts','Negotiate cooperation among provincial institutions.','loyalty'],
 mali:['Protect the merchant corridors','Support commerce and the security of trading communities.','trade'],
 songhai:['Develop river markets','Invest in riverine trade and settlement infrastructure.','trade'],
 kongo:['Convene provincial leaders','Strengthen cooperation with local authorities.','loyalty'],
 kilwa:['Patronize the port merchants','Fund commercial infrastructure and merchant networks.','trade'],
 vijayanagara:['Develop the irrigation network','Support agricultural water management and settlements.','food'],
 bahmani:['Reconcile the court factions','Mediate competing political and military interests.','loyalty'],
 delhi:['Renew the provincial administration','Invest in supervision of crown institutions.','authority'],
 bengal:['Improve the river settlements','Develop agricultural and commercial communities.','food'],
 gujarat:['Sponsor maritime commerce','Support merchants and the textile economy.','trade'],
 ming:['Commission administrative examinations','Support scholarly training and government capacity.','learning'],
 joseon:['Endow the scholarly institutions','Support education and official scholarship.','learning'],
 ashikaga:['Convene the military houses','Negotiate cooperation with regional military leaders.','loyalty'],
 ayutthaya:['Improve waterways and markets','Support agriculture and commercial infrastructure.','food'],
 'dai-viet':['Review the provincial registers','Invest in administration and scholarship.','authority'],
 majapahit:['Renew regional trading agreements','Support maritime networks and local compacts.','trade'],
 malacca:['Guarantee merchant access','Strengthen the commercial institutions of the port.','trade'],
 mexica:['Renew regional tribute agreements','Negotiate cooperation and regional obligations.','authority'],
 maya:['Convene urban representatives','Support cooperation among distinct urban communities.','loyalty'],
 pueblo:['Improve communal irrigation','Support water management and food security.','food'],
 haudenosaunee:['Hold a council gathering','Support deliberation and cooperation among communities.','loyalty'],
 inca:['Improve the storehouse network','Expand food security and administrative capacity.','food'],
 muisca:['Convene regional representatives','Support community cooperation and settlement stability.','loyalty'],
 tupi:['Support community exchanges','Strengthen local food security and cooperation.','food'],
 mapuche:['Convene community leaders','Negotiate cooperation among local communities.','loyalty'],
 maori:['Support community food stores','Invest in collective food security.','food'],
 fiji:['Renew community compacts','Support cooperation and local institutions.','loyalty'],
 aboriginal:['Support local community gatherings','Support the autonomy and cooperation of diverse local communities.','loyalty'],
 scotland:['Mediate border lordship obligations','Hear the landed households and preserve cooperation along the border.','loyalty'],
 brittany:['Review ducal district accounts','Support accountable administration of the duchy.','authority'],
 kalmar:['Convene the union delegations','Hear competing territorial representatives and negotiate political cooperation.','loyalty'],
 genoa:['Confirm merchant notarial privileges','Support predictable agreements for maritime merchants.','trade'],
 venice:['Provision the lagoon markets','Invest in reserves and reliable provisioning arrangements.','food'],
 cyprus:['Hear island community petitions','Support local cooperation across diverse communities.','loyalty'],
 oirats:['Convene seasonal clan delegates','Negotiate cooperation among confederate households.','loyalty'],
 chagatai:['Support caravan shelters','Invest in exchange networks and commercial confidence.','trade'],
 tibet:['Patronize regional manuscript collections','Support learning in regional institutions without assuming unified rule.','learning'],
 lanxang:['Improve river settlement stores','Support rice provisioning and local reserves.','food'],
 sunda:['Renew regional market agreements','Support trade and customary market institutions.','trade'],
 zayyanid:['Support the Tlemcen caravan markets','Strengthen exchange between the court and inland merchants.','trade']
};
export const AMBITIONS={
 ...ADDITIONAL_AMBITIONS,
 linguist:{name:'Become multilingual',desc:'Learn two additional languages during this ambition.',reward:18},
 specialist:{name:'Master a specialization',desc:'Unlock three specialization ranks in any discipline.',reward:20},
 patron:{name:'Patron of the arts and ceremonies',desc:'Complete three additional royal activities during this ambition.',reward:22},
 sanctuaries:{name:'Support sacred institutions',desc:'Recognize two additional sanctuaries in controlled provinces.',reward:20},
 confidants:{name:'Establish an intelligence network',desc:'Retain three additional active intelligence contacts.',reward:17},
 prosperity:{name:'Prosperous reign',desc:'Accumulate 1500 gold and increase total development by 3.',reward:18},
 unity:{name:'United realm',desc:'Reach 75 stability and 70 average vassal loyalty.',reward:15},
 mastery:{name:'Master a discipline',desc:'Earn three lifestyle perks in one focus.',reward:14},
 legacy:{name:'Build a family legacy',desc:'Complete two royal activities during this reign.',reward:16},
 security:{name:'Secure the borders',desc:'Raise total fortification levels by two.',reward:16},
 friendship:{name:'Build trusted friendships',desc:'Gain two new adult court friendships during this ambition.',reward:18},
 innovation:{name:'Advance scholarship',desc:'Complete two new cultural innovations.',reward:20},
 reconciliation:{name:'Reconcile the realm',desc:'Raise average local acceptance by 10 points (up to 100) and reach 75 average local trust.',reward:18},
 institutions:{name:'Build institutions',desc:'Increase the total level of controlled religious institutions by three.',reward:18},
 resilience:{name:'Recover from hardship',desc:'Reduce ruler stress by at least 25 points and reach 70 stability. Requires at least 35 stress to begin.',reward:15}
};
const CHAINS=[
{"id":"long_estates","name":"The contest for provincial authority","trigger":"protractedFaction","delay":12,"persistent":true,"stages":[{"title":"A league of dissatisfied estates","desc":"A powerful organized faction has exposed divisions over the crown's authority. The court must establish a course of action for the coming years.","choices":[["Begin a provincial consultation",150,"loyalty",10],["Reject a broader consultation",0,"stability",-6]]},{"title":"The year of disputed obligations","desc":"After a year of consultations or resistance, regional leaders return with competing proposals.","choices":[["Establish a review of obligations",170,"loyalty",12],["Keep the obligations unchanged",0,"loyalty",-8]]},{"title":"The second assembly","desc":"The court revisits the question of cooperation after another year of disagreement.","choices":[["Fund an assembly of representatives",180,"stability",12],["End the assembly early",0,"authority",-8]]},{"title":"A lasting constitutional settlement","desc":"The remaining disagreements must be addressed if the court is to establish a durable arrangement.","choices":[["Ratify a witnessed settlement",200,"authority",12],["Leave the dispute unresolved",0,"stability",-10]]}]},
{"id":"long_recovery","name":"The long recovery","trigger":"protractedDebt","delay":12,"persistent":true,"stages":[{"title":"A strained treasury","desc":"Outstanding public borrowing has raised concerns over the realm's ability to sustain its obligations.","choices":[["Review public accounts",120,"trade",10],["Defer the accounts",0,"stability",-5]]},{"title":"The recovery budget","desc":"The year's accounts show a need to restore confidence and maintain essential provisions.","choices":[["Fund essential provisions",140,"food",12],["Postpone the provisions",0,"stability",-6]]},{"title":"Rebuilding the productive estates","desc":"The court considers further investment to improve the realm's productive capacity.","choices":[["Support local reconstruction",180,"develop",10],["Leave reconstruction to local officials",0,"loyalty",-7]]},{"title":"The fiscal settlement","desc":"After years of deliberation, representatives ask for a final set of public accounts.","choices":[["Publish a witnessed fiscal settlement",150,"trade",14],["Close the accounts without agreement",0,"authority",-8]]}]},
{"id":"long_integration","name":"The question of shared rule","trigger":"protractedIntegration","delay":12,"persistent":true,"stages":[{"title":"The divided communities","desc":"Low cohesion has undermined cooperation. Representatives seek a sustained approach to their concerns.","choices":[["Convene community representatives",130,"acceptance",8],["Defer consultation",0,"acceptance",-5]]},{"title":"The provincial hearings","desc":"Local representatives return after a year to discuss how public responsibilities can be administered fairly.","choices":[["Fund impartial hearings",150,"acceptance",10],["Maintain current arrangements",0,"stability",-6]]},{"title":"The shared institutions","desc":"Representatives propose investments in institutions that serve several communities.","choices":[["Support shared institutions",170,"trust",12],["Reject additional support",0,"trust",-8]]},{"title":"An enduring agreement","desc":"The court and local representatives consider a lasting framework for cooperation.","choices":[["Recognize the shared agreement",180,"acceptance",14],["Leave the question open",0,"stability",-10]]}]},

 {id:'succession',name:'A disputed succession',trigger:'succession',stages:[{title:'The new crown',desc:'Influential households demand reassurance after the succession.',choices:[['Confirm existing privileges',120,'loyalty',12],['Assert the authority of the crown',0,'authority',-8]]},{title:'The assembled estates',desc:'The estates gather to assess the new ruler’s promises.',choices:[['Negotiate a lasting compact',150,'loyalty',15],['Demand an oath without concessions',0,'authority',-12]]},{title:'A reign takes shape',desc:'The court must choose how to mark the settlement.',choices:[['Reconcile the rival houses',90,'stability',10],['Close the negotiations',0,'stability',-3]]}]},
 {id:'estates',name:'The uneasy estates',trigger:'loyalty',stages:[{title:'Petition of grievances',desc:'Provincial lords present a collective petition.',choices:[['Hear the petition',80,'loyalty',10],['Dismiss the petition',0,'loyalty',-8]]},{title:'The disputed obligations',desc:'A delegation demands a revision of burdens.',choices:[['Offer temporary concessions',120,'loyalty',12],['Maintain existing obligations',0,'stability',-6]]},{title:'The final compact',desc:'Negotiators request a public commitment.',choices:[['Ratify a compact',100,'stability',10],['End the assembly',0,'loyalty',-4]]}]},
 {id:'relief',name:'A realm in hardship',trigger:'crisis',stages:[{title:'Appeals for relief',desc:'Local communities request help after a disaster.',choices:[['Distribute emergency stores',100,'food',12],['Reserve the treasury',0,'stability',-8]]},{title:'The recovery effort',desc:'The affected settlements need assistance restoring their livelihoods.',choices:[['Finance reconstruction',140,'develop',10],['Leave recovery to local officials',0,'stability',-4]]},{title:'Account of the relief',desc:'The court reviews the cost and outcome of its response.',choices:[['Recognize local organizers',80,'loyalty',10],['Close the relief accounts',0,'stability',-2]]}]},
 {id:'commerce',name:'The merchant charter',trigger:'trade',stages:[{title:'Merchants seek protection',desc:'Merchant delegates request predictable terms for commercial activity.',choices:[['Open negotiations',80,'trade',10],['Decline their proposal',0,'stability',-3]]},{title:'A charter in dispute',desc:'Local authorities question the privileges offered to merchants.',choices:[['Mediate the competing interests',100,'loyalty',10],['Impose the terms',0,'authority',-5]]},{title:'A commercial settlement',desc:'The parties await the final charter.',choices:[['Fund the new institutions',120,'trade',12],['Approve a modest settlement',0,'stability',2]]}]},
 {id:'court',name:'Rival voices at court',trigger:'rival',stages:[{title:'A public disagreement',desc:'An influential courtier challenges the ruler’s position.',choices:[['Seek a private reconciliation',80,'friend',15],['Rebuke the courtier',0,'friend',-12]]},{title:'Competing patronage',desc:'The court has divided over appointments and recognition.',choices:[['Distribute honors fairly',100,'friend',15],['Favor loyal supporters',0,'friend',-10]]},{title:'The court decides',desc:'The dispute must be resolved before it dominates the reign.',choices:[['Offer a public reconciliation',80,'friend',20],['Dismiss the dispute',0,'stability',-5]]}]}
];
export const STORY_CHAINS=CHAINS;
function note(g,realm,msg){const c=g.chronicles;c.history.unshift({realm,turn:g.turn,message:msg});c.history=c.history.slice(0,240);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
function random(c){c.seed=(Math.imul(c.seed,1664525)+1013904223)>>>0;return c.seed/4294967296;}
function record(g,a,b){const c=g.chronicles,key=pair(a,b);return c.relationships[key]??={a,b,opinion:0,kind:'acquaintance',last:-120};}
export function personalOpinion(g,a,b){return g.chronicles?.relationships[pair(a,b)]?.opinion||0;}
export function relationshipList(g,realm){const r=ruler(g,realm);return Object.values(g.chronicles?.relationships||{}).filter(x=>[x.a,x.b].includes(r?.id)).map(x=>({...x,other:x.a===r.id?x.b:x.a}));}
export function changeOpinion(g,a,b,delta){if(!a||!b||a===b||!g.politics.people[a]?.alive||!g.politics.people[b]?.alive)return false;const r=record(g,a,b);r.opinion=cap(r.opinion+delta,-100,100);r.kind=r.opinion>=50?'friend':r.opinion<=-50?'rival':'acquaintance';return true;}
function baseline(g,realm,id){const p=land(g,realm),r=ruler(g,realm),friends=relationshipList(g,realm).filter(x=>x.kind==='friend'&&g.politics.people[x.other]?.alive&&g.politics.people[x.other].realm===realm&&g.politics.people[x.other].age>=18).map(x=>x.other);return {goal:ambitionBaseline(g,realm,id),development:p.reduce((n,x)=>n+x.development,0),forts:p.reduce((n,x)=>n+(x.buildings?.fort||0),0),activities:g.heritage?.realms?.[realm]?.completed||0,friends,innovations:g.identity?.realms?.[realm]?.innovations?.length||0,acceptance:p.reduce((n,x)=>n+(g.civic.provinces[x.id]?.acceptance||0),0)/Math.max(1,p.length),trust:p.reduce((n,x)=>n+(g.civic.provinces[x.id]?.localTrust||0),0)/Math.max(1,p.length),institutions:p.reduce((n,x)=>n+(g.identity?.institutions?.[x.id]?.level||0),0),stress:r?.civic?.stress||0,languages:(r?.civic?.languages||[]).length,branchRanks:Object.values(r?.civic?.roleplay?.branches||{}).reduce((n,b)=>n+b.rank,0),sanctuaries:p.filter(x=>g.identity?.institutions[x.id]?.sanctuary).length,contacts:Object.keys(g.intrigue?.networks?.[realm]||{}).filter(id=>g.politics.people[id]?.alive&&g.politics.people[id].realm===realm).length};}
export function ambitionAvailable(g,realm,id){const r=ruler(g,realm),s=g.chronicles?.realms[realm];return Object.hasOwn(AMBITIONS,id)&&!!r?.alive&&!!s&&land(g,realm).length>0&&!s.ambition&&!Object.hasOwn(r.ambitionAwards||{},id)&&!s.completed.some(x=>x.ambition===id&&x.ruler===r.id)&&(id!=='resilience'||(r.civic?.stress||0)>=35)&&(!Object.hasOwn(ADDITIONAL_AMBITIONS,id)||additionalAmbitionAvailable(g,realm,id));}
export function initChronicles(g,world){if(g.chronicles?.version===1){const c=g.chronicles;if(!c.ambitionAwardsMigrated){for(const s of Object.values(c.realms))for(const x of s.completed||[]){const p=g.politics.people[x.ruler];if(p&&Object.hasOwn(AMBITIONS,x.ambition)){p.ambitionAwards??={};p.ambitionAwards[x.ambition]??=x.turn;}}c.ambitionAwardsMigrated=true;}return c;}const c=g.chronicles={version:1,ambitionAwardsMigrated:true,seed:145211,realms:{},relationships:{},history:[],lastTick:-1};
 for(const f of world.factions){const r=ruler(g,f.id);c.realms[f.id]={ruler:r?.id,decisionAt:-120,chain:null,lastChain:{},ambition:null,completed:[],successionAt:null};if(!r)continue;for(const id of Object.values(g.politics.realms[f.id].council)){const p=g.politics.people[id];if(p?.alive&&p.id!==r.id)changeOpinion(g,r.id,p.id,(hash(r.id+id)%61)-30);}}
 return c;}
export function regionalDecision(g,realm){return REGIONAL_DECISIONS[realm]||['Convene local institutions','Support cooperation and local institutions.','loyalty'];}
function effect(g,realm,kind,value,target){const f=g.factions[realm],r=ruler(g,realm),ps=land(g,realm),s=g.civic.realms[realm];switch(kind){
 case 'loyalty':for(const [,h] of nobles(g,realm))h.loyalty=cap(h.loyalty+value,0,100);break;
 case 'develop':{const p=ps.slice().sort((a,b)=>a.development-b.development)[0];if(p)p.development=cap(p.development+Math.max(1,Math.round(value/10)),1,20);break;}
 case 'authority':s.authority=cap(s.authority+value,0,100);f.legitimacy=cap(f.legitimacy+Math.round(value/2),0,100);break;
 case 'trade':{const e=g.economy.realms[realm];e.credit=cap(e.credit+value,0,100);s.charterUntil=Math.max(s.charterUntil||0,g.turn+18);break;}
 case 'craft':{const p=ps[0];if(p){const stock=g.economy.provinces[p.id].stock;stock.tools+=Math.min(value,Math.max(0,60-stock.tools));stock.cloth+=Math.min(value,Math.max(0,60-stock.cloth));}break;}
 case 'military':for(const a of Object.values(g.armies))if(a.owner===realm){a.morale=cap(a.morale+value,0,100);a.experience=cap(a.experience+value*.003,0,1);}break;
 case 'learning':r.skills.learning=cap(r.skills.learning+1,1,5);f.tech=cap(f.tech+1,1,10);break;
 case 'food':f.food+=value*8;for(const p of ps)g.economy.provinces[p.id].stock.grain+=Math.min(value,Math.max(0,60-g.economy.provinces[p.id].stock.grain));break;
 case 'stability':f.stability=cap(f.stability+value,0,100);break;
 case 'acceptance':case 'trust':for(const p of ps){const l=g.civic.provinces[p.id],k=kind==='trust'?'localTrust':'acceptance';if(l)l[k]=cap(l[k]+value,0,100);}break;
 case 'friend':changeOpinion(g,r.id,target,value);break;
 }}
function decision(g,realm){const c=g.chronicles.realms[realm],f=g.factions[realm],d=regionalDecision(g,realm);if(!land(g,realm).length||f.treasury<180||g.turn-c.decisionAt<36)return no('Requires controlled land, 180 gold and a three-year interval.');f.treasury-=180;c.decisionAt=g.turn;effect(g,realm,d[2],12);note(g,realm,d[0]+' completed.');return ok(d[0]+' completed.');}
export function currentChain(g,realm=g.player){const x=g.chronicles?.realms[realm]?.chain,def=CHAINS.find(c=>c.id===x?.id);if(!def||!x||!def.stages[x.stage])return null;return {...x,name:def.name,stageCount:def.stages.length,interval:def.delay||3,...def.stages[x.stage]};}
function resolve(g,realm,index){const s=g.chronicles.realms[realm],x=currentChain(g,realm),ch=x?.choices[index],f=g.factions[realm];if(!Number.isInteger(index)||!ch||g.turn<x.due||f.treasury<ch[1])return no('No available or affordable choice.');f.treasury-=ch[1];effect(g,realm,ch[2],ch[3],x.target);s.chain.outcomes.push(ch[0]);s.chain.score+=ch[3];note(g,realm,x.title+': '+ch[0]+'.');if(x.stage===x.stageCount-1){f.prestige+=Math.max(0,Math.round(s.chain.score/3));if(x.interval>=12){const outcome=s.chain.score>=25?'settled':s.chain.score>=0?'fragile compromise':'unresolved';f.stability=cap(f.stability+(outcome==='settled'?6:outcome==='unresolved'?-6:0),0,100);s.chain.result=outcome;note(g,realm,x.name+': '+outcome+'.');}s.lastChain[x.id]=g.turn;s.completed.push({id:x.id,turn:g.turn,outcomes:s.chain.outcomes,score:s.chain.score,...(s.chain.result?{result:s.chain.result}: {})});s.completed=s.completed.slice(-20);s.chain=null;}else{s.chain.stage++;s.chain.due=g.turn+x.interval;}return ok('Decision recorded.');}
export function ambitionProgress(g,realm){
 const a=g.chronicles?.realms[realm]?.ambition;if(!a||!Object.hasOwn(AMBITIONS,a.id))return null;
 if(Object.hasOwn(ADDITIONAL_AMBITIONS,a.id))return additionalAmbitionProgress(g,realm,a.id,a.base);
 const f=g.factions[realm],r=ruler(g,realm),now=baseline(g,realm),v=nobles(g,realm),b=a.base||{};
 const result=(value,target,detail='',extra=true,lower=false)=>({value:Math.round(value*10)/10,target:Math.round(target*10)/10,detail,done:extra&&(lower?value<=target:value>=target)});
 const growth=(key,n)=>result(now[key],(b[key]??now[key])+n);
 switch(a.id){
 case 'linguist':return growth('languages',2);
 case 'specialist':return growth('branchRanks',3);
 case 'patron':return growth('activities',3);
 case 'sanctuaries':return growth('sanctuaries',2);
 case 'confidants':return growth('contacts',3);
 case 'prosperity':return result(now.development,(b.development??now.development)+3,'Treasury: '+Math.floor(f.treasury)+'/1500',f.treasury>=1500);
 case 'unity':{const loyalty=v.length?v.reduce((n,[,h])=>n+h.loyalty,0)/v.length:0;return result(loyalty,70,'Stability: '+Math.round(f.stability)+'/75'+(v.length?'':' · No eligible estates'),v.length>0&&f.stability>=75);}
 case 'mastery':return result(r.civic?.perks?.length||0,3,'Current lifestyle: '+(r.civic?.focus||'Unselected'));
 case 'legacy':return growth('activities',2);
 case 'security':return growth('forts',2);
 case 'friendship':return result(now.friends.filter(id=>!(b.friends||[]).includes(id)).length,2);
 case 'innovation':return growth('innovations',2);
 case 'reconciliation':return result(now.acceptance,Math.min(100,(b.acceptance??now.acceptance)+10),'Local trust: '+Math.round(now.trust)+'/75',now.trust>=75);
 case 'institutions':return growth('institutions',3);
 case 'resilience':return result(now.stress,Math.max(0,(b.stress??now.stress)-25),'Stress must fall to target · Stability: '+Math.round(f.stability)+'/70',f.stability>=70,true);
 }
 return null;
}
function ambitionComplete(g,realm,a){return !!ambitionProgress(g,realm)?.done;}
export function chronicleAction(g,world,action,id){initChronicles(g,world);const realm=g.player,s=g.chronicles.realms[realm],f=g.factions[realm],r=ruler(g,realm);
 if(action==='decision')return decision(g,realm);
 if(action==='chain')return resolve(g,realm,Number(id));
 if(action==='ambition'){if(!ambitionAvailable(g,realm,id))return no('Choose an uncompleted ambition; one per reign at a time.');s.ambition={id,ruler:r.id,started:g.turn,base:baseline(g,realm,id)};return ok('Ambition chosen.');}
 if(action==='abandon'){if(!s.ambition)return no('No active ambition.');s.ambition=null;f.prestige=Math.max(0,f.prestige-5);return ok('Ambition abandoned.');}
 if(action==='befriend'||action==='challenge'){const other=g.politics.people[id];if(!other?.alive||other.realm!==realm||other.age<18||r.age<18||other.id===r.id)return no('Select a living adult court member.');const rel=record(g,r.id,id),cost=action==='befriend'?90:0;if(g.turn-rel.last<12||f.treasury<cost)return no('Personal interactions require a yearly interval and sufficient gold.');f.treasury-=cost;rel.last=g.turn;changeOpinion(g,r.id,id,action==='befriend'?25:-30);if(action==='challenge')f.prestige+=2;return ok('Personal relationship updated.');}
 return no('Unknown chronicle action.');}
function schedule(g,realm){const c=g.chronicles,s=c.realms[realm],f=g.factions[realm],r=ruler(g,realm);if(s.chain||!land(g,realm).length)return;const v=nobles(g,realm),rival=relationshipList(g,realm).find(x=>x.kind==='rival'&&g.politics.people[x.other]?.alive);
 const eligible=CHAINS.filter(x=>g.turn-(s.lastChain[x.id]??-120)>=48&&(x.trigger==='protractedFaction'?Object.values(g.conflict?.factions||{}).some(z=>z.realm===realm&&['organizing','ultimatum','civil war'].includes(z.status)&&z.pressure>=65):x.trigger==='protractedDebt'?Object.values(g.economy?.loans||{}).some(z=>z.realm===realm&&['active','defaulted'].includes(z.status))&&f.treasury<500:x.trigger==='protractedIntegration'?g.civic.realms[realm].cohesion<35:x.trigger==='succession'?s.successionAt!==null&&g.turn-s.successionAt<=12:x.trigger==='loyalty'?v.some(([,h])=>h.loyalty<40):x.trigger==='crisis'?Object.values(g.economy.crises).some(z=>g.provinces[z.province]?.owner===realm):x.trigger==='trade'?Object.values(g.kingdom.tradePacts).some(p=>p.partners.includes(realm)):!!rival));
 if(!eligible.length)return;const def=eligible.find(x=>x.id==='succession')||eligible.find(x=>x.persistent)||eligible[Math.floor(random(c)*eligible.length)];s.chain={id:def.id,stage:0,due:g.turn,started:g.turn,ruler:r.id,target:def.id==='court'?rival?.other:null,score:0,outcomes:[]};note(g,realm,'A new story begins: '+def.name+'.');}
export function tickChronicles(g,world){const c=initChronicles(g,world);if(c.lastTick===g.turn)return;c.lastTick=g.turn;
 for(const [realm,s] of Object.entries(c.realms)){const r=ruler(g,realm),f=g.factions[realm];if(!r||!land(g,realm).length)continue;if(s.ruler!==r.id){s.ruler=r.id;s.successionAt=g.civic.realms[realm].government==='republic'?null:g.turn;s.ambition=null;if(s.chain&&CHAINS.find(x=>x.id===s.chain.id)?.persistent){s.chain.ruler=r.id;note(g,realm,'The new ruler inherited the ongoing political situation.');}else{s.chain=null;if(g.civic.realms[realm].government!=='republic')schedule(g,realm);}}
 if(s.ambition&&(s.ambition.ruler!==r.id||!Object.hasOwn(AMBITIONS,s.ambition.id)||Object.hasOwn(r.ambitionAwards||{},s.ambition.id)))s.ambition=null;
 if(s.ambition&&ambitionComplete(g,realm,s.ambition)){const a=s.ambition,d=AMBITIONS[a.id];f.prestige+=d.reward;f.legitimacy=cap(f.legitimacy+6,0,100);const dyn=g.heritage.dynasties[realm+'|'+r.house];if(dyn)dyn.renown+=d.reward;r.ambitionAwards??={};r.ambitionAwards[a.id]=g.turn;s.completed.push({ambition:a.id,ruler:r.id,turn:g.turn});s.completed=s.completed.slice(-20);s.ambition=null;note(g,realm,r.name+' fulfilled '+d.name+'.');}
 const x=currentChain(g,realm);if(x&&g.turn>=x.due&&(!humanControlsRealm(g,realm)||g.turn-x.due>=9)){const cautious=r.traits?.includes('cautious')||r.traits?.includes('just'),reserve=r.traits?.includes('greedy')?450:cautious?100:250;const idx=!humanControlsRealm(g,realm)&&f.treasury>x.choices[0][1]+reserve?0:1;resolve(g,realm,idx);}
 if(g.turn%6===0){schedule(g,realm);if(!humanControlsRealm(g,realm)&&!s.ambition){const choices=Object.keys(AMBITIONS),offset=hash(realm+g.turn)%choices.length;for(let i=0;i<choices.length;i++){const id=choices[(offset+i)%choices.length];if(ambitionAvailable(g,realm,id)){s.ambition={id,ruler:r.id,started:g.turn,base:baseline(g,realm,id)};break;}}}}
 if(g.turn%12===0&&!humanControlsRealm(g,realm)&&f.treasury>500&&g.turn-s.decisionAt>=36)decision(g,realm);
 if(g.turn%12===0){for(const id of Object.values(g.politics.realms[realm].council)){const p=g.politics.people[id];if(!p?.alive||p.id===r.id)continue;const delta=p.traits.some(t=>r.traits.includes(t))?5:-3;changeOpinion(g,r.id,id,delta);}}
 }
 if(g.turn%12===0)for(const [key,x] of Object.entries(c.relationships))if(!g.politics.people[x.a]?.alive||!g.politics.people[x.b]?.alive)delete c.relationships[key];
 tickStoryFlags(g);
}

// Pillar 3: Itemized Vassal Opinion Breakdown (permanent, fading, and ongoing modifiers).
export function vassalOpinionBreakdown(g,realm,personId){
 const s=g.politics?.realms?.[realm],r=s&&g.politics?.people?.[s.ruler],v=g.politics?.people?.[personId],f=g.factions?.[realm];
 if(!r||!v)return {total:0,items:[]};
 const items=[];
 const baseRel=personalOpinion(g,r.id,v.id);
 if(baseRel!==0)items.push({label:baseRel>0?'Personal rapport & past gifts':'Personal rivalry & slights',delta:baseRel,type:'fading'});
 const shared=(v.traits||[]).filter(t=>(r.traits||[]).includes(t));
 if(shared.length)items.push({label:`Shared traits (${shared.slice(0,2).join(', ')})`,delta:shared.length*6,type:'ongoing'});
 const councilRole=Object.entries(s.council||{}).find(([,cid])=>cid===v.id)?.[0];
 if(councilRole)items.push({label:`Seated on Royal Council (${councilRole})`,delta:12,type:'ongoing'});
 const held=Object.values(g.politics?.holdings||{}).filter(h=>h.realm===realm&&h.lord===v.id);
 if(held.some(h=>h.tax===2))items.push({label:'High estate taxation',delta:-15,type:'ongoing'});
 else if(held.some(h=>h.tax===0))items.push({label:'Low estate taxation',delta:10,type:'ongoing'});
 if(held.some(h=>h.levy===2))items.push({label:'Heavy military levy',delta:-10,type:'ongoing'});
 if(held.some(h=>h.autonomy===0))items.push({label:'Crown restricted local autonomy',delta:-12,type:'ongoing'});
 else if(held.some(h=>h.autonomy===2))items.push({label:'Chartered estate autonomy',delta:10,type:'ongoing'});
 for(const gr of (v.grievances||[]).filter(x=>x.against===r.id).slice(0,3)){
  items.push({label:`Grievance: ${gr.reason}`,delta:-Math.round((gr.severity||20)*0.5),type:gr.permanent?'permanent':'fading'});
 }
 const rLangs=new Set(r.civic?.languages||[]);
 const vCulture=v.civic?.culture||g.civic?.realms?.[realm]?.culture;
 if(vCulture&&rLangs.size>1)items.push({label:'Sovereign speaks subject court tongues',delta:6,type:'ongoing'});
 if((v.traits||[]).includes('ambitious'))items.push({label:'Ambitious nature',delta:-10,type:'ongoing'});
 if((v.traits||[]).includes('content'))items.push({label:'Content vassal',delta:10,type:'ongoing'});
 if((f?.legitimacy??50)<40)items.push({label:'Weak crown legitimacy',delta:-12,type:'ongoing'});
 else if((f?.legitimacy??50)>=80)items.push({label:'Respected crown legitimacy',delta:8,type:'ongoing'});
 const total=cap(items.reduce((sum,x)=>sum+x.delta,0),-100,100);
 return {total,items};
}

// Pillar 10: Inter-Generational Story Flags, Illustrated Dynasty Epitaphs & Achievements.
export function recordStoryFlag(g,flag){
 g.storyFlags??=[];
 const entry={id:'sf'+(g.storyFlags.length+1)+'_'+g.turn,turn:g.turn,year:g.year,triggered:false,...flag};
 g.storyFlags.unshift(entry);
 g.storyFlags=g.storyFlags.slice(0,60);
 return entry;
}

export function tickStoryFlags(g){
 if(!Array.isArray(g.storyFlags)||!g.storyFlags.length||g.turn%12!==0)return;
 g.chronicles??={version:1,realms:{},relationships:{},history:[],lastTick:-1};
 g.chronicles.pendingCallbacks??=[];
 for(const fl of g.storyFlags){
  if(fl.triggered)continue;
  const yearsElapsed=Math.floor((g.turn-(fl.turn||0))/12);
  if(yearsElapsed>=(fl.delayYears||20)&&fl.realm===g.player){
   fl.triggered=true;
   const cb={
    id:'cb_'+fl.id,flagId:fl.id,year:g.year,yearsAgo:yearsElapsed,
    title:fl.callbackTitle||'Echoes from the Royal Archive',
    description:fl.callbackText||`An old sealed letter from ${fl.year} (${yearsElapsed} years ago) resurfaces: ${fl.summary||'a past dynastic betrayal'}. The court demands an answer.`,
    targetRealm:fl.targetRealm||null,
    resolved:false
   };
   g.chronicles.pendingCallbacks.unshift(cb);
   g.chronicles.pendingCallbacks=g.chronicles.pendingCallbacks.slice(0,8);
   note(g,g.player,`DYNASTIC ECHO (${yearsElapsed} yrs later): ${cb.title}`);
  }
 }
}

export function deriveRulerEpithet(g,c,realm){
 const t=new Set(c?.traits||[]);
 if(c?.epithet)return c.epithet;
 if(t.has('cruel')||t.has('wrathful'))return 'the Fearsome';
 if(t.has('pillar-of-faith')||t.has('zealous'))return 'the Pious';
 if(t.has('architect')||t.has('diligent'))return 'the Builder';
 if(t.has('strategist')||t.has('battle-hardened'))return 'the Ironhand';
 if(t.has('scholar-king')||t.has('genius'))return 'the Wise';
 if(t.has('just')||t.has('kind'))return 'the Just';
 if(t.has('paranoid')||t.has('master-schemer'))return 'the Watchful';
 if(t.has('drunkard'))return 'the Reveler';
 if(t.has('broken'))return 'the Haunted';
 return (g.factions?.[realm]?.prestige||0)>=80?'the Magnanimous':'the Steadfast';
}

export function recordRulerEpitaph(g,c,realm,successor){
 if(!c)return null;
 g.chronicles??={version:1,realms:{},relationships:{},history:[],lastTick:-1};
 g.chronicles.epitaphs??=[];
 const epithet=deriveRulerEpithet(g,c,realm);
 const childrenFates=(c.children||[]).map(cid=>g.politics?.people?.[cid]).filter(Boolean).map(ch=>({
  id:ch.id,name:ch.name,alive:ch.alive,age:ch.age,
  fate:ch.id===successor?.id?'Ascended the throne':!ch.alive?`Died (${ch.deathReason||'natural causes'})`:`Lives at court (age ${ch.age})`
 }));
 const cause=c.deathReason||(c.age>=65?'died of old age':'passed peacefully at court');
 const lastWords=cause.includes('battle')?'Hold the standard—yield not one league of our ancestors’ earth!'
  :cause.includes('assassin')?'Check the cups... trust no counselor in the shadow...'
  :cause.includes('plague')?'Seal the gates and pray the realm outlives this fever...'
  :cause.includes('execut')?'History will judge whose crown was truly lawful.'
  :'Guard the dynasty, keep the realm united, and remember our house.';
 const memories=(c.memories||[]).slice(-6);
 const greatestAchievement=memories.find(m=>/victory|fulfilled|built|founded|hybrid|sacred/i.test(m))||`Guided ${g.factions?.[realm]?.name||realm} through ${Math.max(1,Math.round((g.turn-(c.reignStartTurn||0))/12))} years of statecraft.`;
 const worstCrisis=memories.find(m=>/break|plague|revolt|civil war|crisis|famine|assassin/i.test(m))||'Weathered the shifting ambitions of vassals and rival crowns.';
 const entry={
  id:'ep_'+c.id+'_'+g.turn,
  rulerId:c.id,name:c.name,epithet,house:c.house,realm,
  age:c.age,deathYear:g.year,deathReason:cause,lastWords,
  successorId:successor?.id||null,successorName:successor?.name||'Interregnum',
  traits:[...(c.traits||[])],
  greatestAchievement,worstCrisis,
  definingMoment:memories[memories.length-1]||greatestAchievement,
  childrenFates
 };
 g.chronicles.epitaphs.unshift(entry);
 g.chronicles.epitaphs=g.chronicles.epitaphs.slice(0,30);
 if(realm===g.player)g.chronicles.pendingObituary=entry;
 return entry;
}

export function playerAchievements(g){
 const r=g.player,f=g.factions?.[r];
 const epitaphs=g.chronicles?.epitaphs?.filter(e=>e.realm===r)||[];
 const thwarted=g.intrigue?.thwarted?.[r]||0;
 const hybrids=Object.values(g.identity?.hybrids||{}).filter(h=>h.realm===r).length;
 const routes=Object.keys(g.tradeRoutes?.investments||{}).filter(k=>k.endsWith(':'+r)).length;
 const provs=Object.values(g.provinces||{}).filter(p=>p.owner===r).length;
 const successions=g.kingdom?.courts?.[r]?.successions||0;
 return [
  {id:'paranoid_physician',name:'The Paranoid Physician',desc:'Thwart 5 hostile schemes against your court.',done:thwarted>=5,progress:`${thwarted}/5`},
  {id:'dynasty_survivor',name:'Through Three Crowns',desc:'Survive 3 royal successions without losing the throne.',done:successions>=3,progress:`${successions}/3`},
  {id:'architect_hybrids',name:'Architect of Civilizations',desc:'Forge a named Hybrid Court Culture.',done:hybrids>=1,progress:`${hybrids}/1`},
  {id:'silk_lord',name:'Lord of the Trade Winds',desc:'Charter caravan investments on 2 macro trade routes.',done:routes>=2,progress:`${routes}/2`},
  {id:'empire_builder',name:'Sovereign of Ten Provinces',desc:'Hold at least 10 provinces under one banner.',done:provs>=10,progress:`${provs}/10`},
  {id:'living_chronicle',name:'Chronicler of Ages',desc:'Record 2 royal epitaphs in the Dynasty Chronicle.',done:epitaphs.length>=2,progress:`${epitaphs.length}/2`},
  {id:'prestigious_house',name:'Glorious Dynasty',desc:'Accumulate 150 dynastic prestige.',done:(f?.prestige||0)>=150,progress:`${Math.round(f?.prestige||0)}/150`}
 ];
}

export function dynastyChronicleSummary(g){
 const r=g.player,f=g.factions?.[r],epitaphs=(g.chronicles?.epitaphs||[]).filter(e=>e.realm===r);
 const yearsRuled=Math.max(1,(g.year||1450)-1450);
 const provs=Object.values(g.provinces||{}).filter(p=>p.owner===r).length;
 const warsWon=Object.values(g.conflict?.wars||{}).filter(w=>(w.attacker===r&&w.status==='claim enforced')||(w.defender===r&&w.status==='attacker defeated')).length;
 const crisesSurvived=g.kingdom?.courts?.[r]?.successions||0;
 const achievements=playerAchievements(g);
 const ruler=g.politics?.people?.[g.politics?.realms?.[r]?.ruler];
 const house=ruler?.house||'Royal House';
 const houseLabel=/^House\b/i.test(house)?house:`House ${house}`;
 const capitalLevel=g.hometown?.realms?.[r]?.level||1;
 const greatestBattle=g.chronicles?.greatestBattle||null;
 const campaignComplete=(g.year||1450)>=1600;
 const unlockedCount=achievements.filter(a=>a.done).length;
 return {
  realmName:f?.name||r,
  house,
  houseName:houseLabel,
  currentRuler:ruler?{id:ruler.id,name:ruler.name,age:ruler.age,epithet:deriveRulerEpithet(g,ruler,r)}:null,
  year:g.year||1450,
  yearsRuled,provs,provinces:provs,warsWon,crisesSurvived,capitalLevel,greatestBattle,campaignComplete,
  epitaphs,achievements,unlockedCount,
  shareCaption:`Sovereign 1450 — ${houseLabel} of ${f?.name||r} (${1450}–${g.year||1450}): ${provs} provinces, Capital Stage ${capitalLevel}/10, ${warsWon} wars won, ${crisesSurvived} successions weathered, ${unlockedCount}/${achievements.length} achievements.`,
  alternateHistory:`From 1450 to ${g.year||1450}, ${houseLabel} of ${f?.name||r} held ${provs} provinces across ${yearsRuled} years, raised their royal capital to Stage ${capitalLevel}/10, endured ${crisesSurvived} royal successions, and reshaped the early-modern world.`
 };
}

export function opinionBreakdown(g, personId) {
 const p = g.politics?.people?.[personId];
 if (!p) return { total: 0, positive: 0, negative: 0, reasons: [] };
 const r = vassalOpinionBreakdown(g, p.realm, personId);
 const reasons = (r.items || []).map(x => ({ label: x.label, value: x.delta, duration: x.type }));
 return { total: r.total, positive: reasons.filter(x => x.value > 0).reduce((s, x) => s + x.value, 0), negative: reasons.filter(x => x.value < 0).reduce((s, x) => s + x.value, 0), reasons };
}
