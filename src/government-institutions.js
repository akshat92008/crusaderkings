// Institutional mechanics for alternate-history government profiles.
// State is realm-specific; no historical claims are implied.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
import {governmentPolicyModifiers,governmentMotionAction,tickGovernmentMotions} from './government-deliberations.js';
import {administratorBonus,civilServiceAction,tickCivilService,examinationRank} from './imperial-civil-service.js';
import {merchantChairBonus,merchantCampaign,tickMerchantElections,reservePasture,tickSteppePasture} from './regional-institutions.js';
import {regionalPoliticalAction,regionalPoliticalModifiers,tickRegionalPolitics} from './regional-politics.js';
const cap=(x,a,b)=>Math.max(a,Math.min(b,x)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const own=(g,r)=>Object.values(g.provinces).filter(p=>p.owner===r&&controller(g,p.id)===r);
const ruler=(g,r)=>g.politics.people[g.politics.realms[r]?.ruler];
const adult=(g,id,r)=>{const p=g.politics.people[id];return p?.alive&&p.age>=18&&p.realm===r&&!isImprisoned(g,id)?p:null;};
export const INSTITUTION_TYPES={
 feudal:{name:'Estate assembly',action:'Negotiate estate compact',cost:140,mode:'estates'},
 centralized:{name:'Royal inspectors',action:'Appoint inspector',cost:110,mode:'administration'},
 sultanate:{name:'Household retainers',action:'Fund retainer household',cost:160,mode:'retainers'},
 military:{name:'Military households',action:'Fund military household',cost:160,mode:'retainers'},
 imperial:{name:'Provincial administration',action:'Appoint governor',cost:110,mode:'administration'},
 republic:{name:'Merchant families',action:'Invest in merchant house',cost:180,mode:'merchants'},
 steppe:{name:'Clan assembly and herds',action:'Invest in herds',cost:120,mode:'herds'},
 regional:{name:'Provincial charters',action:'Renew land charter',cost:140,mode:'estates'},
 shogunate:{name:'Retainer houses',action:'Fund retainer house',cost:160,mode:'retainers'},
 tributary:{name:'Tribute compacts',action:'Negotiate tribute agreement',cost:100,mode:'tribute'},
 confederation:{name:'Member assembly',action:'Consult member estates',cost:140,mode:'estates'},
 city:{name:'Urban merchant houses',action:'Invest in merchant house',cost:180,mode:'merchants'},
 kinship:{name:'Community reserves',action:'Expand communal stores',cost:100,mode:'reserves'}
};
function state(g,r){const root=g.institutions??={version:1,realms:{},history:[],lastTick:-1};const type=g.civic.realms[r].government,mode=INSTITUTION_TYPES[type]?.mode||'estates';let s=root.realms[r];if(!s||s.mode!==mode){s=root.realms[r]={mode,last:-120,compacts:{},offices:{},houses:{},retainers:{},herds:0,reserves:0,tributes:{},lastCollection:-1};}if(s.deliberation&&s.deliberation.government!==type)delete s.deliberation;if(type!=='imperial')delete s.civilService;if(!['republic','city'].includes(type))delete s.election;if(type!=='steppe')delete s.pastureUntil;if(s.regionalPolitics&&s.regionalPolitics.type!==type)delete s.regionalPolitics;return s;}
export function initInstitutions(g){g.institutions??={version:1,realms:{},history:[],lastTick:-1};for(const r of Object.keys(g.civic.realms))state(g,r);return g.institutions;}
export function institutionState(g,r){return g.institutions?.realms[r];}
function note(g,r,msg){const h=g.institutions.history;h.unshift({realm:r,turn:g.turn,message:msg});if(h.length>120)h.length=120;if(r===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
function eligibleHouse(g,r,id){const p=adult(g,id,r);return p&&p.id!==ruler(g,r)?.id?p:null;}
export function institutionTargets(g,r){const s=institutionState(g,r);if(!s)return [];if(['administration','estates'].includes(s.mode))return own(g,r).filter(p=>g.politics.holdings[p.id]?.realm===r).map(p=>p.id);if(['merchants','retainers'].includes(s.mode))return [...new Set(Object.values(g.politics.holdings).filter(h=>h.realm===r&&eligibleHouse(g,r,h.lord)).map(h=>h.lord))];if(s.mode==='tribute')return Object.keys(g.politics.realms).filter(id=>id!==r&&own(g,id).length);return [];}
export function institutionModifiers(g,r){const s=institutionState(g,r),out={tax:1,levy:1,trade:1};if(!s)return out;const current=own(g,r);if(!current.length)return out;
 if(s.mode==='administration')out.tax+=Math.min(.15,current.reduce((n,p)=>{const a=adult(g,s.offices[p.id]?.person,r);return n+(a?Math.max(0,a.skills.stewardship-1)*.025+administratorBonus(g,r,p.id,s.offices[p.id]):0);},0)/current.length);
 if(s.mode==='estates')out.levy+=Math.min(.12,current.filter(p=>s.compacts[p.id]?.until>g.turn).length/current.length*.12);
 if(s.mode==='merchants')out.trade+=Math.min(.18,Object.values(s.houses).filter(h=>eligibleHouse(g,r,h.person)).reduce((n,h)=>n+h.level*.03,0));
 if(s.mode==='retainers')out.levy+=Math.min(.18,Object.values(s.retainers).filter(h=>eligibleHouse(g,r,h.person)).reduce((n,h)=>n+h.level*.03,0));
 if(s.mode==='herds')out.levy+=Math.min(.15,s.herds*.0015);
 out.trade+=merchantChairBonus(g,r);const policy=governmentPolicyModifiers(g,r),regional=regionalPoliticalModifiers(g,r,current);for(const k of Object.keys(out))out[k]*=policy[k]*regional[k];
 return out;}
function action(g,r,id,extra){const s=state(g,r),d=INSTITUTION_TYPES[g.civic.realms[r].government],f=g.factions[r];if(!d||!own(g,r).length||f.treasury<d.cost||g.turn-s.last<6)return no('Requires controlled land, sufficient funds and six months between institutional actions.');
 const h=g.politics.holdings[id],valid=institutionTargets(g,r).includes(id);switch(s.mode){
 case 'estates':if(!valid||s.compacts[id]?.until>g.turn)return no('Select an estate without an active compact.');s.compacts[id]={until:g.turn+36};h.loyalty=cap(h.loyalty+18,0,100);h.autonomy=Math.max(1,h.autonomy);break;
 case 'administration':{const p=eligibleHouse(g,r,extra);if(!valid||!p||p.skills.stewardship<2||Object.entries(s.offices).some(([province,o])=>province!==id&&o.person===extra)||s.offices[id]?.person===extra)return no('Select a free adult administrator with stewardship 2+, not already assigned elsewhere.');s.offices[id]={person:p.id,appointed:g.turn};break;}
 case 'merchants':case 'retainers':{if(!valid)return no('Select an eligible landed adult.');const list=s.mode==='merchants'?s.houses:s.retainers,old=list[id];if((old?.level||0)>=3)return no('House already at maximum investment.');list[id]={person:id,level:(old?.level||0)+1};const p=g.politics.people[id];p.wealth+=Math.floor(d.cost*.4);if(s.mode==='retainers')for(const a of Object.values(g.armies))if(a.owner===r)a.morale=cap(a.morale+6,0,100);break;}
 case 'herds':if(s.herds>=100)return no('Herd capacity reached.');s.herds=cap(s.herds+25,0,100);break;
 case 'reserves':if(s.reserves>=120)return no('Community stores are full.');s.reserves=cap(s.reserves+40,0,120);break;
 case 'tribute':{const other=g.factions[id],rev=g.institutions.realms[id]?.tributes[r];if(!valid||s.tributes[id]?.until>g.turn||rev?.until>g.turn||(other.relations[r]||0)<25||Object.values(g.conflict.wars).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(r)&&[w.attacker,w.defender].includes(id)))return no('Requires a willing foreign realm (+25 relations), no reciprocal compact or war.');const amount=Math.min(25,Math.max(5,own(g,id).length*3));s.tributes[id]={until:g.turn+36,amount};break;}
 default:return no('Unknown institutional model.');}
 f.treasury-=d.cost;s.last=g.turn;note(g,r,d.action+' completed.');return ok(d.action+' completed.');}
export function governmentAction(g,world,id,extra){if(id==='motion:propose')return governmentMotionAction(g,g.player,'propose');if(id==='motion:lobby')return governmentMotionAction(g,g.player,'lobby',extra);if(id==='civil:exam')return civilServiceAction(g,g.player,'exam',extra);if(id==='civil:audit')return civilServiceAction(g,g.player,'audit',extra);if(id==='merchant:campaign')return merchantCampaign(g,g.player,extra);if(id==='steppe:pasture')return reservePasture(g,g.player);if(['regional:grant','sultanate:scholar','shogunate:mediate'].includes(id))return regionalPoliticalAction(g,g.player,id,extra);return action(g,g.player,id,extra);}
export function tickInstitutions(g){const root=initInstitutions(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;for(const [r,s] of Object.entries(root.realms)){const f=g.factions[r],land=own(g,r);tickGovernmentMotions(g,r);if(!land.length)continue;tickCivilService(g,r);tickMerchantElections(g,r);tickRegionalPolitics(g,r,land);
 for(const [id,x] of Object.entries(s.compacts))if(x.until<=g.turn||!land.some(p=>p.id===id))delete s.compacts[id];
 for(const [id,x] of Object.entries(s.offices))if(!land.some(p=>p.id===id)||!adult(g,x.person,r))delete s.offices[id];
 for(const list of [s.houses,s.retainers])for(const [id,x] of Object.entries(list))if(!eligibleHouse(g,r,x.person))delete list[id];
 for(const [id,x] of Object.entries(s.tributes)){const other=g.factions[id];if(!other||x.until<=g.turn||!own(g,id).length||(other.relations[r]||0)<0||Object.values(g.conflict.wars).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(r)&&[w.attacker,w.defender].includes(id))){delete s.tributes[id];continue;}const paid=Math.min(x.amount,Math.max(0,other.treasury));other.treasury-=paid;f.treasury+=paid;}
 if(g.turn%3===0){if(s.mode==='estates')for(const id of Object.keys(s.compacts)){const h=g.politics.holdings[id];if(h?.realm===r)h.loyalty=cap(h.loyalty+2,0,100);}
 if(s.mode==='herds'&&s.herds>0)tickSteppePasture(g,r,s);
 if(s.mode==='reserves'&&s.reserves>0){const need=Math.max(0,80-f.food),used=Math.min(s.reserves,need);s.reserves-=used;f.food+=used;if(used)f.stability=cap(f.stability+2,0,100);}
 if(s.mode==='merchants')for(const h of Object.values(s.houses)){const p=eligibleHouse(g,r,h.person);if(p)p.wealth+=h.level*3;}
 if(s.mode==='retainers')for(const h of Object.values(s.retainers)){const p=eligibleHouse(g,r,h.person);if(p)for(const v of Object.values(g.politics.holdings))if(v.realm===r&&v.lord===p.id)v.loyalty=cap(v.loyalty+1,0,100);}
 }
 if(r!==g.player&&g.turn%12===0&&f.treasury>800){const targets=institutionTargets(g,r);let id=targets.find(id=>s.mode==='estates'?!s.compacts[id]:s.mode==='administration'?!s.offices[id]:s.mode==='tribute'?(g.factions[id].relations[r]||0)>=25:((s.houses[id]||s.retainers[id])?.level||0)<3),extra;if(s.mode==='administration')extra=Object.values(g.politics.people).filter(p=>eligibleHouse(g,r,p.id)&&p.skills.stewardship>=2&&!Object.values(s.offices).some(o=>o.person===p.id)).sort((a,b)=>(b.skills.stewardship+examinationRank(g,r,b.id))-(a.skills.stewardship+examinationRank(g,r,a.id)))[0]?.id;if(id||['herds','reserves'].includes(s.mode))action(g,r,id,extra);}
}}
