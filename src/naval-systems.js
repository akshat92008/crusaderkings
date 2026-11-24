// Sea basins are explicitly abstract routes attached to selected starting ports.
// They are not inferred to be real-world coastlines from the synthetic map.
import {controller} from './campaign-war.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const BASINS={
 atlantic:['england','france','burgundy','castile','portugal','morocco'],
 baltic:['imperial','poland','novgorod'],
 mediterranean:['aragon','castile','morocco','ottomans','mamluks'],
 indian:['kilwa','gujarat','bengal','vijayanagara','bahmani','malacca'],
 eastAsian:['ming','joseon','ashikaga','dai-viet','majapahit','malacca','ayutthaya'],
 pacific:['maori','fiji']
};
export const SHIPS={transport:{name:'Transport',cost:120,timber:10,tools:2,capacity:70,power:1,upkeep:3},galley:{name:'War galley',cost:180,timber:14,tools:4,capacity:15,power:16,upkeep:5},warship:{name:'Armed sailing ship',cost:260,timber:20,tools:6,capacity:25,power:26,upkeep:8}};
function war(g,a,b){return Object.values(g.conflict?.wars||{}).find(w=>w.status==='active'&&[w.attacker,w.defender].includes(a)&&[w.attacker,w.defender].includes(b));}
function size(a){return (a.infantry||0)+(a.archers||0)+(a.cavalry||0);}
function note(g,realm,msg){const n=g.naval;n.history.unshift({realm,turn:g.turn,message:msg});n.history=n.history.slice(0,150);if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
export function initNaval(g,world){if(g.naval?.version===1)return g.naval;const n=g.naval={version:1,next:1,ports:{},fleets:{},voyages:{},blockades:{},history:[],lastTick:-1};
 for(const [basin,realms] of Object.entries(BASINS))for(const realm of realms){const f=world.factions.find(x=>x.id===realm);if(!f)continue;const land=world.provinces.filter(p=>p.owner===realm);if(!land.length)continue;const p=land.slice().sort((a,b)=>Math.hypot(a.centroid[0]-f.capital[0],a.centroid[1]-f.capital[1])-Math.hypot(b.centroid[0]-f.capital[0],b.centroid[1]-f.capital[1]))[0];const port=n.ports[p.id]??={province:p.id,basins:[],level:1};port.basins.push(basin);}
 return n;}
export function fleetStats(f){let capacity=0,power=0,upkeep=0,count=0;for(const [id,d] of Object.entries(SHIPS)){const k=f.ships[id]||0;capacity+=d.capacity*k;power+=d.power*k;upkeep+=d.upkeep*k;count+=k;}return {capacity,power,upkeep,count};}
export function navalUpkeep(g,realm){return Object.values(g.naval?.fleets||{}).filter(f=>f.realm===realm).reduce((n,f)=>n+fleetStats(f).upkeep,0);}
export function portBlocked(g,id){const b=g.naval?.blockades[id];if(!b)return false;const f=g.naval.fleets[b.fleet],owner=g.provinces[id]?.owner;return !!(f&&f.status==='blockade'&&f.target===id&&war(g,f.realm,owner));}
export function fleetDestinations(g,f){const n=g.naval,p=n?.ports[f.port];if(!p||f.status!=='docked')return [];return Object.values(n.ports).filter(q=>q.province!==f.port&&q.basins.some(b=>p.basins.includes(b))&&controller(g,q.province)===f.realm&&g.provinces[q.province]?.owner===f.realm&&!portBlocked(g,q.province));}
export function blockadeTargets(g,f){const n=g.naval,p=n?.ports[f.port];if(!p||f.status!=='docked')return [];return Object.values(n.ports).filter(q=>q.province!==f.port&&q.basins.some(b=>p.basins.includes(b))&&war(g,f.realm,g.provinces[q.province]?.owner)&&!portBlocked(g,q.province));}
function dock(g,f){f.status='docked';f.target=null;f.remaining=0;}
function returnPort(g,f){if(g.provinces[f.port]?.owner===f.realm&&controller(g,f.port)===f.realm)return f.port;return Object.values(g.naval.ports).find(p=>g.provinces[p.province]?.owner===f.realm&&controller(g,p.province)===f.realm)?.province;}
function endBlockade(g,f){if(g.naval.blockades[f.target]?.fleet===f.id)delete g.naval.blockades[f.target];const port=returnPort(g,f);if(port){f.port=port;dock(g,f);}else delete g.naval.fleets[f.id];}
export function embarked(g,id){return !!g.naval?.voyages[id];}
function buildShip(g,realm,port,kind){const n=g.naval,p=n.ports[port],d=SHIPS[kind],local=g.economy?.provinces[port],faction=g.factions[realm];if(!p||!d||!local||g.provinces[port]?.owner!==realm||controller(g,port)!==realm||portBlocked(g,port))return no('Select an unblocked friendly port.');
 let f=Object.values(n.fleets).find(x=>x.realm===realm&&x.port===port&&x.status==='docked');
 if(f&&fleetStats(f).count>=p.level*5||faction.treasury<d.cost||local.stock.timber<d.timber||local.stock.tools<d.tools)return no('Insufficient gold or resources, or port fleet capacity reached.');
 if(!f){const id='f'+n.next++;f=n.fleets[id]={id,realm,port,status:'docked',target:null,remaining:0,ships:{transport:0,galley:0,warship:0}};}
 faction.treasury-=d.cost;local.stock.timber-=d.timber;local.stock.tools-=d.tools;f.ships[kind]++;return ok(d.name+' constructed.');}
function startVoyage(g,f,to,armyId){const n=g.naval,a=g.armies[armyId];if(f.status!=='docked'||!fleetDestinations(g,f).some(p=>p.province===to)||!a||a.owner!==f.realm||a.province!==f.port||embarked(g,a.id)||size(a)>fleetStats(f).capacity||portBlocked(g,f.port))return no('Need a docked fleet, sufficient transport capacity, an army at the port and a friendly destination in the same sea basin.');
 f.status='voyage';f.target=to;f.remaining=3;n.voyages[a.id]={army:a.id,fleet:f.id,from:f.port,to,started:g.turn};return ok('Fleet underway; arrival in three months.');}
function startBlockade(g,f,to){if(!blockadeTargets(g,f).some(p=>p.province===to)||fleetStats(f).power<16||portBlocked(g,f.port))return no('A war fleet and enemy port in the same basin are required.');f.status='approach';f.target=to;f.remaining=2;return ok('Fleet sailing to blockade target.');}
export function navalAction(g,world,action,id,extra,third){const n=initNaval(g,world),realm=g.player,f=g.factions[realm],p=n.ports[id],fleet=n.fleets[id];
 if(action==='ship')return buildShip(g,realm,id,extra);
 if(action==='port'){const local=g.economy.provinces[id];if(!p||g.provinces[id]?.owner!==realm||controller(g,id)!==realm||p.level>=3||f.treasury<300*p.level||local.stock.timber<12)return no('Port upgrade requires friendly control, gold and 12 timber.');f.treasury-=300*p.level;local.stock.timber-=12;p.level++;return ok('Port upgraded.');}
 if(!fleet||fleet.realm!==realm)return no('Select your fleet.');
 if(action==='voyage')return startVoyage(g,fleet,extra,third);
 if(action==='blockade')return startBlockade(g,fleet,extra);
 if(action==='recall'&&['blockade','approach'].includes(fleet.status)){endBlockade(g,fleet);return ok('Fleet recalled.');}
 return no('Unknown naval order.');}
function navalFight(g,attacker,defender){const a=fleetStats(attacker).power,d=fleetStats(defender).power;const win=a>d*1.1;const loser=win?defender:attacker,winner=win?attacker:defender;
 for(const k of Object.keys(SHIPS)){loser.ships[k]=Math.floor(loser.ships[k]*.45);winner.ships[k]=Math.ceil(winner.ships[k]*.8);}
 if(!fleetStats(loser).count){delete g.naval.fleets[loser.id];}note(g,attacker.realm,win?'Naval engagement won.':'Naval engagement lost.');note(g,defender.realm,win?'Enemy fleet won the naval engagement.':'Defending fleet repelled the enemy.');return win;}
export function tickNaval(g,world){const n=initNaval(g,world);if(n.lastTick===g.turn)return;n.lastTick=g.turn;
 for(const f of Object.values(n.fleets)){if(!n.fleets[f.id])continue;if(f.status==='voyage'){if(--f.remaining>0)continue;const v=Object.values(n.voyages).find(x=>x.fleet===f.id),a=g.armies[v?.army],dest=g.provinces[f.target]?.owner===f.realm&&controller(g,f.target)===f.realm&&!portBlocked(g,f.target)?f.target:returnPort(g,f);
  if(a&&dest)a.province=dest;else if(a)delete g.armies[a.id];if(v)delete n.voyages[v.army];if(dest){f.port=dest;dock(g,f);note(g,f.realm,'Fleet completed its voyage to '+dest+'.');}else delete n.fleets[f.id];continue;}
 if(f.status==='approach'){if(!war(g,f.realm,g.provinces[f.target]?.owner)){endBlockade(g,f);continue;}if(--f.remaining>0)continue;
 const defender=Object.values(n.fleets).find(x=>x.realm===g.provinces[f.target]?.owner&&x.port===f.target&&x.status==='docked'&&fleetStats(x).power>0);
 if(defender&&!navalFight(g,f,defender)){if(n.fleets[f.id])endBlockade(g,f);continue;}if(portBlocked(g,f.target)){endBlockade(g,f);continue;}f.status='blockade';n.blockades[f.target]={fleet:f.id,realm:f.realm,started:g.turn};note(g,f.realm,'Blockade established at '+f.target+'.');continue;}
 if(f.status==='blockade'){if(!portBlocked(g,f.target)){endBlockade(g,f);continue;}const p=g.provinces[f.target];p.unrest=cap(p.unrest+1,0,100);continue;}
 if(f.status==='docked'&&(g.provinces[f.port]?.owner!==f.realm||controller(g,f.port)!==f.realm)){const dest=returnPort(g,f);if(dest)f.port=dest;else delete n.fleets[f.id];}}
 if(g.turn%12===0)for(const p of Object.values(n.ports)){const realm=g.provinces[p.province]?.owner;if(!realm||realm===g.player||realm==='independent'||g.factions[realm]?.treasury<700)continue;const fleet=Object.values(n.fleets).find(f=>f.realm===realm&&f.port===p.province&&f.status==='docked');if(!fleet||fleetStats(fleet).count<3)buildShip(g,realm,p.province,'galley');else{const target=blockadeTargets(g,fleet)[0];if(target)startBlockade(g,fleet,target.province);}}
}
