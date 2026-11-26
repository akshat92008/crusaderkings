import {homeMilitaryUnlocked,hometownModifiers,homeEngineQuote,spendHomeEngineMaterials} from './hometown.js';
import {effectiveCharacterSkill} from './character-agency.js';
import {humanControlsRealm} from './player-career.js';
import {fieldContingentSupports,mayEnterWithAccess} from './diplomacy-systems.js';
import {isImprisoned,captureCommander} from './feudal-systems.js';
import {controller} from './campaign-war.js';
import {embarked} from './naval-systems.js';
import {militaryDoctrine,startingTroops} from './military-doctrines.js';
import {terrainCombatModifiers} from './border-battle.js';
import {supplyRoute,allocateTroops} from './campaign-balance.js';
import {invasionReserved} from './invasion-reservations.js';
import {allocateCommanderName} from './name-pools.js';

// Specialization overlays and troop-source breakdowns preserve the three authoritative troop totals in old saves.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const types=['infantry','archers','cavalry'];
export const TROOP_SOURCES=['domainLevies','vassalLevies','retinues','mercenaries','religiousOrders'];
const size=a=>types.reduce((n,k)=>n+(a?.[k]||0),0);

export const REGIMENTS={
 swordsmen:{name:'Swordsmen',type:'infantry',cost:85,damage:1.12,armor:1.02,speed:1.04,range:1,counter:1},
 spearmen:{name:'Spearmen',type:'infantry',cost:85,damage:1.02,armor:1.05,speed:.98,range:1,counter:1.45},
 shieldmen:{name:'Shield infantry',type:'infantry',cost:105,damage:.94,armor:1.32,speed:.88,range:1,counter:1.10},
 bowmen:{name:'Foot bowmen',type:'archers',cost:85,damage:1.08,armor:.95,speed:1,range:1.08,counter:1},
 scouts:{name:'Light cavalry scouts',type:'cavalry',cost:95,damage:1.02,armor:.88,speed:1.25,range:1,counter:1},
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

export const ENGINES={
 ram:{name:'Battering ram',cost:150,tools:4,timber:8,power:12},
 catapult:{name:'Catapult',cost:240,tools:6,timber:12,power:20},
 bombard:{name:'Bombard',cost:360,tools:12,timber:8,power:32}
};

export const MERCENARY_COMPANIES={
 free_company:{id:'free_company',name:'Free Company',cost:220,monthlyCost:18,mix:{infantry:110,archers:50,cavalry:20},morale:82,experience:0.25},
 swiss_pikemen:{id:'swiss_pikemen',name:'Alpine Pike Company',cost:260,monthlyCost:22,mix:{infantry:160,archers:40,cavalry:0},morale:86,experience:0.30},
 genoese_crossbowmen:{id:'genoese_crossbowmen',name:'Maritime Crossbow Guild',cost:240,monthlyCost:20,mix:{infantry:60,archers:130,cavalry:0},morale:82,experience:0.28},
 steppe_riders:{id:'steppe_riders',name:'Steppe Outriders',cost:280,monthlyCost:24,mix:{infantry:20,archers:50,cavalry:120},morale:84,experience:0.30},
 varangian_band:{id:'varangian_band',name:'Northern Guard Band',cost:310,monthlyCost:26,mix:{infantry:150,archers:40,cavalry:30},morale:90,experience:0.35}
};

export const RELIGIOUS_ORDERS={
 knights_hospitaller:{id:'knights_hospitaller',name:'Order of the Hospital',faithGroup:'christian',cost:160,prestigeCost:15,monthlyCost:8,mix:{infantry:100,archers:30,cavalry:70},morale:92,experience:0.40},
 teutonic_order:{id:'teutonic_order',name:'Teutonic Brotherhood',faithGroup:'christian',cost:180,prestigeCost:18,monthlyCost:10,mix:{infantry:120,archers:20,cavalry:80},morale:92,experience:0.42},
 ghazi_brotherhood:{id:'ghazi_brotherhood',name:'Ghazi Vanguard',faithGroup:'islamic',cost:160,prestigeCost:15,monthlyCost:8,mix:{infantry:70,archers:50,cavalry:80},morale:92,experience:0.40},
 saffron_order:{id:'saffron_order',name:'Dharmic Temple Guard',faithGroup:'eastern',cost:150,prestigeCost:12,monthlyCost:7,mix:{infantry:130,archers:40,cavalry:30},morale:90,experience:0.38},
 sacred_wardens:{id:'sacred_wardens',name:'Sacred Wardens',faithGroup:'any',cost:140,prestigeCost:12,monthlyCost:6,mix:{infantry:110,archers:50,cavalry:20},morale:88,experience:0.35}
};

export const RETINUE_COSTS={
 infantry:{cost:170,count:40},
 archers:{cost:200,count:40},
 cavalry:{cost:280,count:25}
};

export const COMMANDER_TRAITS={
 brave:{power:0.08,defense:-0.02,morale:5,supply:0,retreatSave:-0.05,captureRisk:0.08,deathRisk:0.08},
 cautious:{power:0.02,defense:0.08,morale:3,supply:0.08,retreatSave:0.14,captureRisk:-0.10,deathRisk:-0.06},
 diligent:{power:0.06,defense:0.04,morale:4,supply:0.10,retreatSave:0.04,captureRisk:0,deathRisk:0},
 patient:{power:0.02,defense:0.09,morale:5,supply:0.05,retreatSave:0.08,captureRisk:-0.05,deathRisk:-0.03},
 wrathful:{power:0.09,defense:-0.05,morale:2,supply:-0.05,retreatSave:-0.08,captureRisk:0.06,deathRisk:0.07},
 cruel:{power:0.06,defense:0,morale:-2,supply:0,retreatSave:-0.04,captureRisk:0.03,deathRisk:0.03},
 just:{power:0.03,defense:0.04,morale:6,supply:0.06,retreatSave:0.06,captureRisk:-0.03,deathRisk:-0.02},
 ambitious:{power:0.07,defense:0,morale:4,supply:0,retreatSave:0,captureRisk:0.03,deathRisk:0.03},
 zealous:{power:0.06,defense:0.03,morale:8,supply:0,retreatSave:0.02,captureRisk:0.04,deathRisk:0.04},
 gregarious:{power:0.02,defense:0.02,morale:5,supply:0.03,retreatSave:0.03,captureRisk:-0.02,deathRisk:-0.01},
 indolent:{power:-0.05,defense:-0.04,morale:-5,supply:-0.08,retreatSave:-0.04,captureRisk:0.03,deathRisk:0},
 arbitrary:{power:0.02,defense:-0.04,morale:-3,supply:-0.05,retreatSave:-0.03,captureRisk:0.02,deathRisk:0.02},
 greedy:{power:0,defense:0,morale:-2,supply:-0.04,retreatSave:0.02,captureRisk:-0.02,deathRisk:-0.02},
 content:{power:-0.02,defense:0.04,morale:2,supply:0.04,retreatSave:0.05,captureRisk:-0.03,deathRisk:-0.02}
};

const specialties={longbow:['longbow','pikes'],chivalry:['guard','lancers'],pike:['pikes','crossbow'],gunpowder:['handgun','crossbow'],steppe:['horsebow','lancers'],janissary:['guard','handgun'],elephant:['elephants','guard'],samurai:['guard','skirmishers'],archery:['longbow','skirmishers'],river:['skirmishers','crossbow'],highland:['pikes','guard'],woodland:['skirmishers','longbow'],maritime:['crossbow','guard'],warrior:['guard','skirmishers'],generic:['pikes','skirmishers']};

export function regimentOptions(g,realm){return [...new Set(['skirmishers','swordsmen','spearmen','shieldmen','bowmen','scouts',...(specialties[militaryDoctrine(g.factions[realm]).id]||[])])].filter(k=>homeMilitaryUnlocked(g,realm,k));}

function note(g,realm,msg){
 const m=g.military;
 if(m?.history){m.history.unshift({realm,turn:g.turn,message:msg});m.history=m.history.slice(0,150);}
 if(realm===g.player&&Array.isArray(g.log)){g.log.unshift({date:g.year+' · month '+(g.month+1),text:msg});g.log=g.log.slice(0,45);}
}

function rng(m){
 m.seed=(Math.imul(m.seed||51923,1664525)+1013904223)>>>0;
 return m.seed/4294967296;
}

function defaultSources(g,a){
 const total=size(a);
 const rulerId=g.politics?.realms?.[a.owner]?.ruler;
 const hasVassals=rulerId&&Object.values(g.politics?.holdings||{}).some(h=>h.realm===a.owner&&h.lord!==rulerId);
 const vassal=hasVassals?Math.floor(total*0.30):0;
 return {domainLevies:total-vassal,vassalLevies:vassal,retinues:0,mercenaries:0,religiousOrders:0};
}

function reconcileSources(r,targetTotal){
 r.sources??={domainLevies:targetTotal,vassalLevies:0,retinues:0,mercenaries:0,religiousOrders:0};
 for(const k of TROOP_SOURCES)r.sources[k]=Math.max(0,Math.round(r.sources[k]||0));
 const cur=TROOP_SOURCES.reduce((n,k)=>n+r.sources[k],0);
 if(cur===targetTotal)return;
 if(targetTotal<=0){for(const k of TROOP_SOURCES)r.sources[k]=0;return;}
 if(cur===0){r.sources.domainLevies=targetTotal;return;}
 if(targetTotal>cur){
  r.sources.domainLevies+=(targetTotal-cur);
  return;
 }
 // Shrink sources proportionally when casualties occur, preserving integer sum === targetTotal.
 const allocated=allocateTroops(targetTotal,TROOP_SOURCES.map(k=>r.sources[k]));
 TROOP_SOURCES.forEach((k,i)=>{r.sources[k]=allocated[i];});
}

function initArmy(g,a){
 const m=g.military;
 let r=m.armies[a.id];
 if(!r){
  r=m.armies[a.id]={
   supply:85,fatigue:0,regiments:{},
   engines:{ram:0,catapult:0,bombard:0},
   commander:null,lastResupply:-12,
   counts:Object.fromEntries(types.map(t=>[t,a[t]||0])),
   sources:defaultSources(g,a)
  };
  for(const id of (specialties[militaryDoctrine(g.factions[a.owner]).id]||[])){
   const def=REGIMENTS[id];
   r.regiments[id]=Math.floor((a[def.type]||0)*.30);
  }
 }else{
  r.sources??=defaultSources(g,a);
  reconcileSources(r,size(a));
 }
 return r;
}

export function initMilitary(g){
 if(!g.military)g.military={version:1,armies:{},sieges:{},mercenaries:{},orders:{},history:[],seed:51923,lastTick:-1};
 g.military.mercenaries??={};
 g.military.orders??={};
 g.military.history??=[];
 if(!Number.isInteger(g.military.seed))g.military.seed=51923;
 for(const a of Object.values(g.armies))initArmy(g,a);
 return g.military;
}

export function syncRegiments(g,a){
 if(!a)return null;
 const r=initArmy(g,a);
 for(const t of types){
  const before=r.counts[t]||0,after=Math.max(0,Math.round(a[t]||0));
  a[t]=after;
  const ids=Object.keys(r.regiments).filter(id=>REGIMENTS[id]?.type===t);
  if(after<before&&before>0)for(const id of ids)r.regiments[id]=Math.floor(r.regiments[id]*after/before);
  let remain=after;
  for(const id of ids){r.regiments[id]=Math.min(remain,r.regiments[id]);remain-=r.regiments[id];}
  r.counts[t]=after;
 }
 reconcileSources(r,size(a));
 return r;
}

export function armyCompositionBreakdown(g,a){
 if(!a)return {total:0,domainLevies:0,vassalLevies:0,retinues:0,mercenaries:0,religiousOrders:0,infantry:0,archers:0,cavalry:0};
 const r=g.military?.armies?.[a.id];
 const total=size(a);
 const sources=r?.sources||{domainLevies:total,vassalLevies:0,retinues:0,mercenaries:0,religiousOrders:0};
 return {
  total,
  domainLevies:sources.domainLevies||0,
  vassalLevies:sources.vassalLevies||0,
  retinues:sources.retinues||0,
  mercenaries:sources.mercenaries||0,
  religiousOrders:sources.religiousOrders||0,
  infantry:a.infantry||0,
  archers:a.archers||0,
  cavalry:a.cavalry||0
 };
}

// A commander must remain eligible after capture, death or a realm change.
export function eligibleCommander(g,a,id){
 const c=g.politics?.people?.[id];
 return !!a&&!!c&&c.alive&&c.age>=18&&c.realm===a.owner&&!isImprisoned(g,id);
}

export function commanderCandidates(g,armyId){
 const a=g.armies[armyId];if(!a)return [];
 return Object.values(g.politics?.people||{})
  .filter(c=>eligibleCommander(g,a,c.id)&&!Object.entries(g.military?.armies||{}).some(([id,r])=>id!==armyId&&g.armies[id]&&r.commander===c.id))
  .sort((a,b)=>(b.skills?.martial||0)-(a.skills?.martial||0)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}

export function commanderTraitEffects(character){
 const eff={power:0,defense:0,morale:0,supply:0,retreatSave:0,captureRisk:0,deathRisk:0};
 if(!character?.traits?.length)return eff;
 for(const t of character.traits){
  const mod=COMMANDER_TRAITS[t];if(!mod)continue;
  for(const k of Object.keys(eff))eff[k]+=(mod[k]||0);
 }
 return eff;
}

export function armyReadiness(g,a){
 if(!a)return {power:1,speed:1,morale:75,siege:0,commander:null,traits:[],retreatSave:0,supplyEfficiency:1};
 const r=g.military?.armies[a.id];
 if(!r)return {power:1,speed:1,morale:a.morale||75,siege:0,commander:null,traits:[],retreatSave:0,supplyEfficiency:1};
 const c=eligibleCommander(g,a,r.commander)?g.politics.people[r.commander]:null;
 const skill=effectiveCharacterSkill(g,c,'martial');
 const traitEff=commanderTraitEffects(c);
 const total=Math.max(1,size(a));
 const eliteShare=cap(((r.sources?.retinues||0)+(r.sources?.religiousOrders||0))/total,0,1);
 const basePower=(.65+r.supply*.0035)*(1-r.fatigue*.003)*(1+skill*.035)*(1+cap(traitEff.power,-0.12,0.18)+eliteShare*0.08);
 return {
  power:cap(basePower*hometownModifiers(g,a.owner).power,0.35,2.2),
  speed:cap((.72+r.supply*.0028)*(1-r.fatigue*.002)*(1+traitEff.supply*.3),0.4,1.6),
  morale:cap((a.morale||75)-r.fatigue*.25+(skill-1)*3+traitEff.morale,15,100),
  siege:Object.entries(r.engines).reduce((n,[k,v])=>n+ENGINES[k].power*v,0)*hometownModifiers(g,a.owner).siege,
  commander:c?.name??null,
  traits:c?.traits?[...c.traits]:[],
  retreatSave:cap(traitEff.retreatSave,-0.15,0.25),
  supplyEfficiency:cap(1+traitEff.supply,0.75,1.35)
 };
}

export function regimentProfile(g,a,type){
 const r=g.military?.armies[a?.id],n=a?.[type]||0,out={name:type,damage:1,armor:1,speed:1,range:1,counter:1};
 if(!r||n<=0)return out;
 let best=0;
 for(const [id,count] of Object.entries(r.regiments)){
  const d=REGIMENTS[id];
  if(d?.type!==type||!count)continue;
  const share=cap(count/n,0,1);
  for(const k of ['damage','armor','speed','range','counter'])out[k]+=(d[k]-1)*share;
  if(count>best){best=count;out.name=d.name;}
 }
 return out;
}

export function isWinterMonth(g){
 const m=typeof g==='number'?g:g?.month;
 return m===11||m===0||m===1;
}

export function supplyLineStatus(g,world,army){
 if(!army)return {connected:false,distance:Infinity,source:null,supplyLimit:180};
 const owner=army.owner,prov=army.province;
 const friendlyCtrl=id=>controller(g,id)===owner&&g.provinces[id]?.owner===owner;
 const canTraverse=id=>controller(g,id)===owner||fieldContingentSupports(g,army,controller(g,id))||mayEnterWithAccess(g,owner,id);
 const route=supplyRoute(world,prov,friendlyCtrl,canTraverse,4);
 const p=g.provinces[prov];
 const terrainMod=terrainCombatModifiers(world?.provinces?.find(x=>x.id===prov)?.terrain||p?.terrain||'plains');
 const dev=Math.max(1,p?.development||1),fort=Math.max(0,p?.buildings?.fort||0);
 const supplyLimit=Math.round((160+dev*24+fort*45)*terrainMod.supply);
 return {connected:route.connected,distance:route.distance,source:route.source,supplyLimit};
}

export function splitArmy(g,armyId,ratioOrCounts=0.5){
 const m=initMilitary(g),a=g.armies[armyId];
 if(!a||a.contingent||embarked(g,armyId)||invasionReserved(g,armyId))return no('Army cannot be split right now.');
 const total=size(a);
 if(total<40)return no('Army must have at least 40 troops to split.');
 const r=syncRegiments(g,a);
 let splitCounts;
 if(typeof ratioOrCounts==='number'){
  const frac=cap(ratioOrCounts,0.1,0.9);
  splitCounts=Object.fromEntries(types.map(t=>[t,Math.floor((a[t]||0)*frac)]));
 }else if(ratioOrCounts&&typeof ratioOrCounts==='object'){
  splitCounts=Object.fromEntries(types.map(t=>[t,cap(Math.round(ratioOrCounts[t]||0),0,a[t]||0)]));
 }else{
  splitCounts=Object.fromEntries(types.map(t=>[t,Math.floor((a[t]||0)*0.5)]));
 }
 const splitTotal=types.reduce((n,t)=>n+splitCounts[t],0);
 if(splitTotal<15||total-splitTotal<15)return no('Both resulting armies must retain at least 15 troops.');
 const newId='a'+g.nextId++;
 const child={
  id:newId,owner:a.owner,province:a.province,
  infantry:splitCounts.infantry,archers:splitCounts.archers,cavalry:splitCounts.cavalry,
  experience:a.experience||0,morale:a.morale||75,commander:allocateCommanderName(g,a.owner,newId),doctrine:a.doctrine
 };
 for(const t of types)a[t]-=splitCounts[t];
 g.armies[newId]=child;
 const nr=m.armies[newId]={
  supply:r.supply,fatigue:r.fatigue,regiments:{},
  engines:{ram:0,catapult:0,bombard:0},commander:null,lastResupply:r.lastResupply,
  counts:Object.fromEntries(types.map(t=>[t,child[t]])),
  sources:{domainLevies:0,vassalLevies:0,retinues:0,mercenaries:0,religiousOrders:0}
 };
 // Split troop sources cleanly conserving exact integer sums.
 const frac=splitTotal/total;
 for(const k of TROOP_SOURCES){
  const move=Math.floor((r.sources[k]||0)*frac);
  r.sources[k]-=move;
  nr.sources[k]=move;
 }
 reconcileSources(r,size(a));
 reconcileSources(nr,size(child));
 // Split specialist regiments cleanly.
 for(const t of types){
  const ids=Object.keys(r.regiments).filter(id=>REGIMENTS[id]?.type===t);
  let movedBudget=child[t];
  for(const id of ids){
   const cur=r.regiments[id]||0;
   const take=Math.min(movedBudget,Math.floor(cur*(a[t]+child[t]?child[t]/(a[t]+child[t]):0.5)));
   r.regiments[id]-=take;
   if(take>0)nr.regiments[id]=take;
   movedBudget-=take;
  }
 }
 syncRegiments(g,a);
 syncRegiments(g,child);
 return {ok:true,armyId:newId,msg:`Split ${splitTotal} troops into detached army ${newId}.`};
}

export function mergeArmies(g,primaryId,secondaryId){
 const m=initMilitary(g),a=g.armies[primaryId],b=g.armies[secondaryId];
 if(!a||!b||primaryId===secondaryId)return no('Select two distinct armies.');
 if(a.owner!==b.owner||a.province!==b.province)return no('Armies must share the same owner and province to merge.');
 if(a.contingent||b.contingent||embarked(g,primaryId)||embarked(g,secondaryId)||invasionReserved(g,primaryId)||invasionReserved(g,secondaryId))return no('Embarked, allied, or committed invasion armies cannot be merged.');
 const ra=syncRegiments(g,a),rb=syncRegiments(g,b);
 const ta=size(a),tb=size(b),tot=Math.max(1,ta+tb);
 a.morale=cap(Math.round(((a.morale||75)*ta+(b.morale||75)*tb)/tot),10,100);
 a.experience=cap(((a.experience||0)*ta+(b.experience||0)*tb)/tot,0,1);
 ra.supply=cap(Math.round((ra.supply*ta+rb.supply*tb)/tot),0,100);
 ra.fatigue=cap(Math.round((ra.fatigue*ta+rb.fatigue*tb)/tot),0,100);
 for(const t of types)a[t]+=b[t]||0;
 for(const k of TROOP_SOURCES)ra.sources[k]=(ra.sources[k]||0)+(rb.sources[k]||0);
 for(const [id,cnt] of Object.entries(rb.regiments||{}))ra.regiments[id]=(ra.regiments[id]||0)+cnt;
 for(const k of Object.keys(ENGINES))ra.engines[k]=Math.min(3,(ra.engines[k]||0)+(rb.engines[k]||0));
 if(!ra.commander&&rb.commander&&eligibleCommander(g,a,rb.commander))ra.commander=rb.commander;
 // Reassign mercenary/order contracts pointing to secondaryId.
 for(const c of Object.values(m.mercenaries||{}))if(c.armyId===secondaryId)c.armyId=primaryId;
 for(const c of Object.values(m.orders||{}))if(c.armyId===secondaryId)c.armyId=primaryId;
 delete g.armies[secondaryId];
 delete m.armies[secondaryId];
 syncRegiments(g,a);
 return {ok:true,armyId:primaryId,msg:`Merged ${tb} troops into ${primaryId}.`};
}

function faithGroupOf(g,realm){
 const raw=(g.civic?.realms?.[realm]?.faith||g.faith?.realms?.[realm]?.faith||'').toLowerCase();
 if(!raw)return 'any';
 if(raw.includes('catholic')||raw.includes('orthodox')||raw.includes('christian')||raw.includes('latin'))return 'christian';
 if(raw.includes('islam')||raw.includes('sunni')||raw.includes('shia'))return 'islamic';
 if(raw.includes('hindu')||raw.includes('buddh')||raw.includes('dharm'))return 'eastern';
 return 'any';
}

export function resolveBattleCommanders(g,winnerRealm,loserArmies,{loserRemaining=0.5,fieldBattle=true}={}){
 const m=initMilitary(g),events=[];
 const threshold=fieldBattle?0.35:0.45;
 if(loserRemaining>=threshold)return events;
 for(const a of loserArmies||[]){
  if(!a||a.owner===winnerRealm)continue;
  const r=m.armies[a.id];
  const cmdId=r?.commander;
  if(!cmdId||!eligibleCommander(g,a,cmdId))continue;
  const cmd=g.politics?.people?.[cmdId];if(!cmd)continue;
  const eff=commanderTraitEffects(cmd);
  const captureChance=cap(0.32+(threshold-loserRemaining)+eff.captureRisk,0.05,0.85);
  const deathChance=cap((loserRemaining<0.25?0.18:0.05)+eff.deathRisk,0.01,0.45);
  const roll=rng(m);
  const isRuler=g.politics?.realms?.[a.owner]?.ruler===cmdId;
  if(!isRuler&&roll<deathChance){
   cmd.alive=false;
   cmd.deathReason='fallen in battle';
   r.commander=null;
   note(g,a.owner,`${cmd.name} fell in battle against ${g.factions[winnerRealm]?.name||winnerRealm}.`);
   events.push({kind:'death',commander:cmdId,realm:a.owner});
  }else if(roll<deathChance+captureChance&&captureCommander(g,winnerRealm,a)){
   events.push({kind:'captured',commander:cmdId,realm:a.owner});
  }
 }
 return events;
}

export function retreatArmy(g,world,a,fromProvince,preferred=null){
 if(!a||size(a)<=0)return false;
 const realm=a.owner;
 const isSafe=id=>id!==fromProvince&&g.provinces[id]?.owner===realm&&controller(g,id)===realm;
 let dest=preferred&&isSafe(preferred)?preferred:null;
 if(!dest&&world?.provinces?.length){
  const node=world.provinces.find(p=>p.id===fromProvince);
  dest=(node?.neighbors||[]).filter(isSafe).sort()[0]||null;
  if(!dest){
   const route=supplyRoute(world,fromProvince,isSafe,id=>controller(g,id)===realm||mayEnterWithAccess(g,realm,id),6);
   if(route.connected&&route.source)dest=route.source;
  }
 }
 if(!dest)dest=Object.keys(g.provinces||{}).filter(isSafe).sort()[0]||null;
 if(!dest)return false;
 const ready=armyReadiness(g,a);
 const moraleHit=Math.max(8,Math.round(20*(1-(ready.retreatSave||0))));
 a.province=dest;
 a.morale=cap((a.morale||75)-moraleHit,10,100);
 return true;
}

export function militaryAction(g,world,action,id,extra){
 initMilitary(g);
 const f=g.factions[g.player];
 if(action==='merge')return mergeArmies(g,id,extra);
 if(action==='split')return splitArmy(g,id,extra);
 if(action==='hire-mercenary'){
  const comp=MERCENARY_COMPANIES[extra];if(!comp)return no('Unknown mercenary company.');
  let a=g.armies[id],provId=a?a.province:id;
  const p=g.provinces[provId];
  if(!p||p.owner!==g.player||controller(g,provId)!==g.player)return no('Hire mercenaries in a controlled province.');
  if(a&&(a.owner!==g.player||a.contingent||embarked(g,a.id)))return no('Select one of your land armies or controlled provinces.');
  if(g.military.mercenaries[extra]?.status==='active')return no('That mercenary company is already under contract.');
  if(f.treasury<comp.cost)return no(`Need ${comp.cost} gold to retain ${comp.name}.`);
  f.treasury-=comp.cost;
  if(!a){
   a={id:'a'+g.nextId++,owner:g.player,province:provId,infantry:0,archers:0,cavalry:0,experience:comp.experience,morale:comp.morale,commander:allocateCommanderName(g,g.player,`merc:${extra}`),doctrine:militaryDoctrine(f).id};
   g.armies[a.id]=a;
  }
  const added=types.reduce((n,t)=>n+(comp.mix[t]||0),0);
  const prevSize=size(a);
  for(const t of types)a[t]+=(comp.mix[t]||0);
  a.morale=cap(Math.round(((a.morale||75)*prevSize+comp.morale*added)/Math.max(1,prevSize+added)),15,100);
  const r=initArmy(g,a);
  r.sources.mercenaries=(r.sources.mercenaries||0)+added;
  syncRegiments(g,a);
  g.military.mercenaries[extra]={id:extra,realm:g.player,armyId:a.id,troops:added,monthlyCost:comp.monthlyCost,started:g.turn,unpaidMonths:0,status:'active'};
  note(g,g.player,`${comp.name} (${added} troops) entered your service.`);
  return ok(`${comp.name} hired for ${comp.cost} gold (${comp.monthlyCost}g/month).`);
 }
 if(action==='dismiss-mercenary'){
  const contract=g.military.mercenaries[extra];
  if(!contract||contract.realm!==g.player||contract.status!=='active')return no('No active contract for that company.');
  const a=g.armies[contract.armyId];
  if(a){
   const r=syncRegiments(g,a),tot=size(a),drop=Math.min(tot,r.sources.mercenaries||0,contract.troops||0);
   if(drop>0&&tot>0){
    const keepFrac=cap((tot-drop)/tot,0,1);
    for(const t of types)a[t]=Math.max(0,Math.floor(a[t]*keepFrac));
    r.sources.mercenaries=Math.max(0,(r.sources.mercenaries||0)-drop);
    syncRegiments(g,a);
   }
  }
  delete g.military.mercenaries[extra];
  return ok('Mercenary contract terminated.');
 }
 if(action==='hire-order'){
  const ord=RELIGIOUS_ORDERS[extra];if(!ord)return no('Unknown religious order.');
  const group=faithGroupOf(g,g.player);
  if(ord.faithGroup!=='any'&&group!=='any'&&ord.faithGroup!==group)return no('This religious order does not align with your realm faith.');
  let a=g.armies[id],provId=a?a.province:id;
  const p=g.provinces[provId];
  if(!p||p.owner!==g.player||controller(g,provId)!==g.player)return no('Must rally the order in a friendly controlled province.');
  if(g.military.orders[extra]?.status==='active')return no('Order is already mobilized.');
  if(f.treasury<ord.cost||f.prestige<ord.prestigeCost)return no(`Requires ${ord.cost} gold and ${ord.prestigeCost} prestige.`);
  f.treasury-=ord.cost;f.prestige-=ord.prestigeCost;
  if(!a){
   a={id:'a'+g.nextId++,owner:g.player,province:provId,infantry:0,archers:0,cavalry:0,experience:ord.experience,morale:ord.morale,commander:allocateCommanderName(g,g.player,`order:${extra}`),doctrine:militaryDoctrine(f).id};
   g.armies[a.id]=a;
  }
  const added=types.reduce((n,t)=>n+(ord.mix[t]||0),0);
  for(const t of types)a[t]+=(ord.mix[t]||0);
  const r=initArmy(g,a);
  r.sources.religiousOrders=(r.sources.religiousOrders||0)+added;
  syncRegiments(g,a);
  g.military.orders[extra]={id:extra,realm:g.player,armyId:a.id,troops:added,monthlyCost:ord.monthlyCost,started:g.turn,status:'active'};
  note(g,g.player,`${ord.name} (${added} warriors) rallied to your banner.`);
  return ok(`${ord.name} mobilized.`);
 }
 const a=g.armies[id];
 if(!a||a.contingent||a.owner!==g.player||embarked(g,id))return no('Choose one of your armies.');
 const r=syncRegiments(g,a),p=g.provinces[a.province],local=g.economy?.provinces[a.province];
 if(action==='retinue'){
  const spec=RETINUE_COSTS[extra];
  if(!spec||p?.owner!==g.player||controller(g,a.province)!==g.player)return no('Retinues require a valid troop type and friendly controlled holding.');
  if(f.treasury<spec.cost)return no(`Need ${spec.cost} gold to raise standing retinue.`);
  f.treasury-=spec.cost;
  a[extra]=(a[extra]||0)+spec.count;
  a.experience=cap((a.experience||0)+0.05,0,1);
  a.morale=cap((a.morale||75)+3,15,100);
  r.sources.retinues=(r.sources.retinues||0)+spec.count;
  syncRegiments(g,a);
  return ok(`${spec.count} ${extra} added to standing retinue.`);
 }
 if(action==='specialize'){const d=REGIMENTS[extra];if(!d||!regimentOptions(g,g.player).includes(extra))return no('Regiment unavailable to this military tradition.');const used=Object.entries(r.regiments).filter(([k])=>REGIMENTS[k].type===d.type).reduce((n,[,v])=>n+v,0),n=Math.min(30,(a[d.type]||0)-used);if(n<10||f.treasury<d.cost||(p?.owner!==g.player||controller(g,a.province)!==g.player))return no('Need 10 untrained troops, gold and a friendly holding.');f.treasury-=d.cost;r.regiments[extra]=(r.regiments[extra]||0)+n;return ok(n+' troops trained as '+d.name+'.');}
 if(action==='engine'){
  if(!homeMilitaryUnlocked(g,g.player,extra))return no('Research this siege technology in Hometown first.');
  const d=ENGINES[extra];if(!d||r.engines[extra]>=3||p?.owner!==g.player||controller(g,a.province)!==g.player||f.treasury<d.cost)return no('Need a friendly settlement and gold; maximum three of each engine.');
  if(extra==='bombard'&&!['gunpowder','janissary','pike','chivalry'].includes(militaryDoctrine(f).id))return no('Bombards unavailable to this doctrine.');
  const home=homeEngineQuote(g,g.player,d);
  if(home){if(!spendHomeEngineMaterials(g,g.player,d))return no('Need '+home.price.wood+' wood and '+home.price.iron+' iron in Hometown reserves.');}
  else {if(!local||local.stock.tools<d.tools||local.stock.timber<d.timber)return no('Need local tools and timber.');local.stock.tools-=d.tools;local.stock.timber-=d.timber;}
  f.treasury-=d.cost;r.engines[extra]++;return ok(d.name+' constructed.');
 }
 if(action==='dismiss-commander'){r.commander=null;return ok('Commander relieved of duty.');}
 if(action==='commander'){const c=g.politics.people[extra];if(!eligibleCommander(g,a,extra)||Object.entries(g.military.armies).some(([key,v])=>key!==id&&v.commander===extra&&g.armies[key]))return no('Select an available adult character from your court.');r.commander=extra;return ok(c.name+' appointed commander. Martial skill '+c.skills.martial+'.');}
 if(action==='resupply'){if(size(a)<=0||p?.owner!==g.player||controller(g,a.province)!==g.player||!local||f.treasury<65||local.stock.grain<8||g.turn-r.lastResupply<1)return no('Need friendly land, 65 gold and 8 grain; once per month.');f.treasury-=65;local.stock.grain-=8;r.supply=cap(r.supply+35,0,100);r.fatigue=cap(r.fatigue-15,0,100);r.lastResupply=g.turn;return ok('Army resupplied.');}
 return no('Unknown military order.');
}

export function onArmyMarch(g,a){
 initMilitary(g);
 const r=syncRegiments(g,a);
 r.supply=cap(r.supply-9,0,100);
 r.fatigue=cap(r.fatigue+8,0,100);
}

export function tickMilitary(g,world){
 const m=initMilitary(g);
 if(m.lastTick===g.turn)return;
 m.lastTick=g.turn;
 for(const id of Object.keys(m.armies))if(!g.armies[id])delete m.armies[id];

 // Mercenary contract upkeep & desertion check.
 for(const [cid,contract] of Object.entries(m.mercenaries||{})){
  const f=g.factions?.[contract.realm],a=g.armies?.[contract.armyId];
  if(!f||!a||size(a)<=0){delete m.mercenaries[cid];continue;}
  if(f.treasury>=contract.monthlyCost){
   f.treasury-=contract.monthlyCost;
   contract.unpaidMonths=0;
  }else{
   contract.unpaidMonths=(contract.unpaidMonths||0)+1;
   if(contract.unpaidMonths>=2){
    const r=syncRegiments(g,a),tot=size(a),drop=Math.min(tot,r.sources.mercenaries||0,contract.troops||0);
    if(drop>0&&tot>0){
     const keepFrac=cap((tot-drop)/tot,0,1);
     for(const t of types)a[t]=Math.max(0,Math.floor(a[t]*keepFrac));
     r.sources.mercenaries=Math.max(0,(r.sources.mercenaries||0)-drop);
     syncRegiments(g,a);
    }
    note(g,contract.realm,`${MERCENARY_COMPANIES[cid]?.name||cid} deserted after unpaid wages.`);
    delete m.mercenaries[cid];
   }
  }
 }

 // Religious orders upkeep.
 for(const [oid,ord] of Object.entries(m.orders||{})){
  const f=g.factions?.[ord.realm],a=g.armies?.[ord.armyId];
  if(!f||!a||size(a)<=0){delete m.orders[oid];continue;}
  if(f.treasury>=ord.monthlyCost)f.treasury-=ord.monthlyCost;
 }

 const winter=isWinterMonth(g);
 for(const a of Object.values(g.armies)){
  const r=syncRegiments(g,a),p=g.provinces[a.province],l=g.economy?.provinces[a.province];
  const friendly=(controller(g,a.province)===a.owner||fieldContingentSupports(g,a,controller(g,a.province)))&&!embarked(g,a.id);
  if(r.commander&&!eligibleCommander(g,a,r.commander))r.commander=null;
  const total=size(a);
  if(total<=0){r.commander=null;continue;}

  const eff=armyReadiness(g,a).supplyEfficiency||1;
  const line=world?.provinces?.length?supplyLineStatus(g,world,a):{connected:friendly,distance:friendly?0:Infinity,supplyLimit:240};
  const terrain=world?.provinces?.find(x=>x.id===a.province)?.terrain||p?.terrain||'plains';
  const terrMod=terrainCombatModifiers(terrain);
  const demand=Math.max(2,Math.ceil(total/90));
  const winterPenalty=winter?(friendly?0:Math.round(3*terrMod.winterAttrition)):0;

  if(friendly&&l&&l.stock.grain>=demand){
   l.stock.grain-=demand;
   const gain=Math.round((winter?6:8)*eff);
   r.supply=cap(r.supply+gain,0,100);
   const rest=7+((r.sources?.retinues||0)>0?2:0);
   r.fatigue=cap(r.fatigue-rest,0,100);
  }else{
   const baseDrain=friendly?7:(line.connected?9:13);
   const drain=Math.max(3,Math.round((baseDrain+winterPenalty)/eff));
   r.supply=cap(r.supply-drain,0,100);
   r.fatigue=cap(r.fatigue+(friendly?5:6),0,100);
  }

  // Supply collapse or severe winter/over-limit field attrition.
  const overLimit=world?.provinces?.length&&!friendly&&total>line.supplyLimit;
  const winterExposed=winter&&!friendly&&g.turn>2;
  if(r.supply<20||winterExposed||overLimit){
   const attr=r.supply<20?0.97:(winterExposed&&!line.connected?0.96:0.985);
   for(const t of types)a[t]=Math.max(0,Math.floor(a[t]*attr));
   a.morale=cap((a.morale||75)-(r.supply<20?4:2),10,100);
   syncRegiments(g,a);
  }

  if(!a.contingent&&!humanControlsRealm(g,a.owner)&&g.turn%12===0&&g.factions[a.owner]?.treasury>500){
   if(!r.commander){
    const candidates=commanderCandidates(g,a.id),marshal=g.politics.realms[a.owner]?.council?.marshal;
    r.commander=(candidates.find(c=>c.id===marshal)||candidates[0])?.id??null;
   }
   if(friendly&&l&&l.stock.tools>=4&&l.stock.timber>=8&&!r.engines.ram){
    g.factions[a.owner].treasury-=150;
    l.stock.tools-=4;l.stock.timber-=8;
    r.engines.ram=1;
   }
  }
 }
}

// Tactical gate and tower objectives are separate from render assets.
export function createSiegeState(fortLevel,defenseMode=false){
 const level=cap(Number(fortLevel)||0,0,3);
 if(!level)return null;
 const hp=80+level*65;
 return {level,assaultSide:defenseMode?'defender':'attacker',structures:[{id:'gate',name:'Gate',x:0,z:-18,hp,max:hp},{id:'left',name:'West tower',x:-24,z:-18,hp:hp*.65,max:hp*.65},{id:'right',name:'East tower',x:24,z:-18,hp:hp*.65,max:hp*.65}]};
}
export function siegeTarget(siege,g){if(!siege||g.side!==siege.assaultSide)return null;const gate=siege.structures[0];if(gate.hp<=0)return null;const flank=g.x<-15?siege.structures[1]:g.x>15?siege.structures[2]:null;return flank&&flank.hp>0?flank:gate;}
export function siegeDamage(siege,id,damage){const x=siege?.structures.find(x=>x.id===id);if(!x||x.hp<=0)return false;x.hp=Math.max(0,x.hp-Math.max(0,damage));return x.hp===0;}
export function siegeBreached(siege){return !siege||siege.structures[0].hp<=0;}
export function applyFortDamage(g,province,result){const p=g.provinces[province];if(p&&result?.fortBreached&&p.buildings.fort>0)p.buildings.fort--;}
