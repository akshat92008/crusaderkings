import {controller} from './campaign-war.js';
import {embarked} from './naval-systems.js';
// Specialization overlays preserve the three authoritative troop totals in old saves.
import {militaryDoctrine} from './military-doctrines.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const types=['infantry','archers','cavalry'],size=a=>types.reduce((n,k)=>n+(a[k]||0),0);
export const REGIMENTS={
 pikes:{name:'Pike infantry',type:'infantry',cost:90,damage:1.04,armor:1.18,speed:.91,range:1,counter:1.8},
 guard:{name:'Armored household guard',type:'infantry',cost:120,damage:1.16,armor:1.25,speed:.88,range:1,counter:1.05},
 skirmishers:{name:'Light infantry',type:'infantry',cost:75,damage:1.10,armor:.90,speed:1.23,range:1,counter:1},
 longbow:{name:'Longbow regiment',type:'archers',cost:120,damage:1.18,armor:.92,speed:.94,range:1.25,counter:1},
 crossbow:{name:'Crossbow regiment',type:'archers',cost:110,damage:1.24,armor:1.05,speed:.92,range:1.05,counter:1},
 handgun:{name:'Handgun regiment',type:'archers',cost:145,damage:1.40,armor:.98,speed:.90,range:.83,counter:1},
 lancers:{name:'Heavy lancers',type:'cavalry',cost:150,damage:1.32,armor:1.15,speed:.94,range:1,counter:1},
 horsebow:{name:'Mounted archers',type:'cavalry',cost:135,damage:1.13,armor:.89,speed:1.19,range:3.2,counter:1},
 elephants:{name:'War elephant corps',type:'cavalry',cost:190,damage:1.42,armor:1.25,speed:.72,range:1.15,counter:1}
};
export const ENGINES={ram:{name:'Battering ram',cost:150,tools:4,timber:8,power:12},catapult:{name:'Catapult',cost:240,tools:6,timber:12,power:20},bombard:{name:'Bombard',cost:360,tools:12,timber:8,power:32}};
const specialties={longbow:['longbow','pikes'],chivalry:['guard','lancers'],pike:['pikes','crossbow'],gunpowder:['handgun','crossbow'],steppe:['horsebow','lancers'],janissary:['guard','handgun'],elephant:['elephants','guard'],samurai:['guard','skirmishers'],archery:['longbow','skirmishers'],river:['skirmishers','crossbow'],highland:['pikes','guard'],woodland:['skirmishers','longbow'],maritime:['crossbow','guard'],warrior:['guard','skirmishers'],generic:['pikes','skirmishers']};
export function regimentOptions(g,realm){return [...new Set(['skirmishers',...(specialties[militaryDoctrine(g.factions[realm]).id]||[])])];}
function note(g,realm,msg){if(realm===g.player){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}}
function initArmy(g,a){const m=g.military;let r=m.armies[a.id];if(!r){r=m.armies[a.id]={supply:85,fatigue:0,regiments:{},engines:{ram:0,catapult:0,bombard:0},commander:null,lastResupply:-12,counts:Object.fromEntries(types.map(t=>[t,a[t]||0]))};for(const id of regimentOptions(g,a.owner).slice(1)){const def=REGIMENTS[id];r.regiments[id]=Math.floor((a[def.type]||0)*.30);}}return r;}
export function initMilitary(g){if(!g.military)g.military={version:1,armies:{},sieges:{},lastTick:-1};for(const a of Object.values(g.armies))initArmy(g,a);return g.military;}
export function syncRegiments(g,a){if(!a)return null;const r=initArmy(g,a);for(const t of types){const before=r.counts[t]||0,after=a[t]||0,ids=Object.keys(r.regiments).filter(id=>REGIMENTS[id]?.type===t);if(after<before&&before>0)for(const id of ids)r.regiments[id]=Math.floor(r.regiments[id]*after/before);let remain=after;for(const id of ids){r.regiments[id]=Math.min(remain,r.regiments[id]);remain-=r.regiments[id];}r.counts[t]=after;}return r;}
export function armyReadiness(g,a){if(!a)return {power:1,speed:1,morale:75,siege:0,commander:null};const r=g.military?.armies[a.id];if(!r)return {power:1,speed:1,morale:a.morale||75,siege:0,commander:null};
 const c=g.politics?.people[r.commander],skill=c?.alive?c.skills.martial:1;return {power:(.65+r.supply*.0035)*(1-r.fatigue*.003)*(1+skill*.035),speed:(.72+r.supply*.0028)*(1-r.fatigue*.002),morale:cap((a.morale||75)-r.fatigue*.25+(skill-1)*3,15,100),siege:Object.entries(r.engines).reduce((n,[k,v])=>n+ENGINES[k].power*v,0),commander:c?.alive?c.name:null};}
export function regimentProfile(g,a,type){const r=g.military?.armies[a?.id],n=a?.[type]||0,out={name:type,damage:1,armor:1,speed:1,range:1,counter:1};if(!r||n<=0)return out;let best=0;for(const [id,count] of Object.entries(r.regiments)){const d=REGIMENTS[id];if(d?.type!==type||!count)continue;const share=cap(count/n,0,1);for(const k of ['damage','armor','speed','range','counter'])out[k]+=(d[k]-1)*share;if(count>best){best=count;out.name=d.name;}}return out;}
export function militaryAction(g,world,action,id,extra){initMilitary(g);const a=g.armies[id],f=g.factions[g.player];if(!a||a.owner!==g.player||embarked(g,id))return no('Choose one of your armies.');const r=syncRegiments(g,a),p=g.provinces[a.province],local=g.economy?.provinces[a.province];
 if(action==='specialize'){const d=REGIMENTS[extra];if(!d||!regimentOptions(g,g.player).includes(extra))return no('Regiment unavailable to this military tradition.');const used=Object.entries(r.regiments).filter(([k])=>REGIMENTS[k].type===d.type).reduce((n,[,v])=>n+v,0),n=Math.min(30,(a[d.type]||0)-used);if(n<10||f.treasury<d.cost||p?.owner!==g.player)return no('Need 10 untrained troops, gold and a friendly holding.');f.treasury-=d.cost;r.regiments[extra]=(r.regiments[extra]||0)+n;return ok(n+' troops trained as '+d.name+'.');}
 if(action==='engine'){const d=ENGINES[extra];if(!d||r.engines[extra]>=3||p?.owner!==g.player||!local||f.treasury<d.cost||local.stock.tools<d.tools||local.stock.timber<d.timber)return no('Need a friendly settlement, gold, tools and timber; maximum three of each engine.');if(extra==='bombard'&&!['gunpowder','janissary','pike','chivalry'].includes(militaryDoctrine(f).id))return no('Bombards unavailable to this doctrine.');f.treasury-=d.cost;local.stock.tools-=d.tools;local.stock.timber-=d.timber;r.engines[extra]++;return ok(d.name+' constructed.');}
 if(action==='commander'){const c=g.politics.people[extra];if(!c?.alive||c.age<18||c.realm!==g.player||Object.entries(g.military.armies).some(([key,v])=>key!==id&&v.commander===extra&&g.armies[key]))return no('Select an available adult character from your court.');r.commander=extra;return ok(c.name+' appointed commander.');}
 if(action==='resupply'){if(p?.owner!==g.player||!local||f.treasury<65||local.stock.grain<8||g.turn-r.lastResupply<1)return no('Need friendly land, 65 gold and 8 grain; once per month.');f.treasury-=65;local.stock.grain-=8;r.supply=cap(r.supply+35,0,100);r.fatigue=cap(r.fatigue-15,0,100);r.lastResupply=g.turn;return ok('Army resupplied.');}
 return no('Unknown military order.');}
export function onArmyMarch(g,a){initMilitary(g);const r=syncRegiments(g,a);r.supply=cap(r.supply-9,0,100);r.fatigue=cap(r.fatigue+8,0,100);}
export function tickMilitary(g,world){const m=initMilitary(g);if(m.lastTick===g.turn)return;m.lastTick=g.turn;for(const id of Object.keys(m.armies))if(!g.armies[id])delete m.armies[id];
 for(const a of Object.values(g.armies)){const r=syncRegiments(g,a),p=g.provinces[a.province],l=g.economy?.provinces[a.province],friendly=controller(g,a.province)===a.owner&&!embarked(g,a.id);
 if(r.commander&&!g.politics.people[r.commander]?.alive)r.commander=null;
 const demand=Math.max(2,Math.ceil(size(a)/90));if(friendly&&l&&l.stock.grain>=demand){l.stock.grain-=demand;r.supply=cap(r.supply+8,0,100);r.fatigue=cap(r.fatigue-7,0,100);}else{r.supply=cap(r.supply-(friendly?7:13),0,100);r.fatigue=cap(r.fatigue+6,0,100);}
 if(r.supply<20){for(const t of types)a[t]=Math.floor(a[t]*.97);a.morale=cap(a.morale-4,10,100);syncRegiments(g,a);}
 if(a.owner!==g.player&&g.turn%12===0&&g.factions[a.owner].treasury>500){const c=g.politics.realms[a.owner]?.council.marshal;if(!r.commander&&c&&!Object.values(m.armies).some(x=>x.commander===c))r.commander=c;if(friendly&&l&&l.stock.tools>=4&&l.stock.timber>=8&&!r.engines.ram){g.factions[a.owner].treasury-=150;l.stock.tools-=4;l.stock.timber-=8;r.engines.ram=1;}}
 }}
// Tactical gate and tower objectives are separate from render assets.
export function createSiegeState(fortLevel,defenseMode=false){const level=cap(Number(fortLevel)||0,0,3);if(!level)return null;const hp=80+level*65;return {level,assaultSide:defenseMode?'defender':'attacker',structures:[{id:'gate',name:'Gate',x:0,z:-18,hp,max:hp},{id:'left',name:'West tower',x:-24,z:-18,hp:hp*.65,max:hp*.65},{id:'right',name:'East tower',x:24,z:-18,hp:hp*.65,max:hp*.65}]};}
export function siegeTarget(siege,g){if(!siege||g.side!==siege.assaultSide)return null;const gate=siege.structures[0];if(gate.hp<=0)return null;const flank=g.x<-15?siege.structures[1]:g.x>15?siege.structures[2]:null;return flank&&flank.hp>0?flank:gate;}
export function siegeDamage(siege,id,damage){const x=siege?.structures.find(x=>x.id===id);if(!x||x.hp<=0)return false;x.hp=Math.max(0,x.hp-Math.max(0,damage));return x.hp===0;}
export function siegeBreached(siege){return !siege||siege.structures[0].hp<=0;}
export function applyFortDamage(g,province,result){const p=g.provinces[province];if(p&&result?.fortBreached&&p.buildings.fort>0)p.buildings.fort--;}
