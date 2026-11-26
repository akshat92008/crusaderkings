import {technologyName} from './hometown-technologies.js';
import {controller} from './campaign-war.js';
import {humanControlsRealm} from './player-career.js';
// Realm-level construction reserves are distinct from local merchant stocks.
// Gold and food always use the existing faction treasury and food reserve.
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg}),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const integer=(v,d=0)=>Number.isFinite(v)?Math.max(0,Math.floor(v)):d;
export const TOWN_NAMES=['Settlement','Village','Large village','Township','Fortified town','Trade city','Royal city','Royal capital','Metropolitan capital','Imperial capital'];
export const TOWN_STAGE_NOTES=[
  'Founding timber outpost with hearth & palisade watch',
  'Cleared ploughlands, common well, and woodcutters lane',
  'Granary stores, smithy forge, and weekly market square',
  'Chartered guild street, stone keep foundations, and ward',
  'Curtain wall, gatehouse toll, and garrison parade ground',
  'Caravan caravanserai, wharf warehouses, and mint',
  'Cathedral/temple precinct, royal chancery, and foundry',
  'High court, monumental plazas, and siege arsenal',
  'Metropolitan aqueducts, printing guild, and academy quarter',
  'Imperial seat of civilization — monument spires & treasury'
];
export const WORKFORCE_ROLES=[
  {id:'farmers',label:'Farmers',effect:'Food & granary output'},
  {id:'woodcutters',label:'Woodcutters',effect:'Timber & shipyard stock'},
  {id:'miners',label:'Miners & Smiths',effect:'Stone, iron & weapon forging'},
  {id:'builders',label:'Builders',effect:'Faster construction & repairs'},
  {id:'merchants',label:'Merchants',effect:'Trade income & market yield'},
  {id:'scholars',label:'Scholars',effect:'Knowledge & research speed'},
  {id:'soldiers',label:'Garrison & Levies',effect:'Reserve training & rampart defense'}
];
const defs=[
['farm','Farmstead',1,180,'food','farmhouse_barn'],['house','Housing',1,100,'food','thatched_cottage'],['well','Well',1,80,'food','stone_well'],['lumber','Lumber camp',1,120,'wood','lumber_shed'],
['granary','Granary',2,140,'storage','granary_staddle'],['quarry','Stone quarry',2,150,'stone','lumber_shed'],['market','Market hall',2,260,'tax','market_stall'],['bakery','Bakery',2,140,'food','bakery'],
['barracks','Barracks',3,320,'recruit','barracks'],['iron','Iron mine',3,210,'iron','blacksmith_forge'],['forge','Blacksmith',3,220,'military','blacksmith'],['chapel','Community sanctuary',3,160,'order','stone_chapel'],
['archery','Archery range',4,280,'military','archery_range'],['mill','Windmill',4,210,'food','windmill'],['tavern','Tavern',4,140,'order','tavern_inn'],['warehouse','Warehouse',4,200,'storage','granary_staddle'],
['stable','Stable',5,300,'recruit','stable'],['fort','Fortification',1,440,'defense','castle'],['watchtower','Watchtower',5,220,'defense','watchtower'],['gatehouse','Gatehouse',5,280,'defense','gatehouse'],
['watermill','Watermill',6,280,'food','watermill'],['goldmine','Gold mine',6,360,'tax','blacksmith_forge'],['tradehall','Trade hall',6,340,'tax','market_stall'],['apothecary','Apothecary',6,240,'order','apothecary'],
['workshop','Siege workshop',7,420,'siege','blacksmith_forge'],['school','School',7,280,'research','longhouse'],['library','Library',7,330,'research','timber_frame_house'],['university','University',7,480,'research','longhouse'],
['academy','Military academy',8,500,'recruit','barracks'],['foundry','Foundry',8,480,'iron','blacksmith'],['armory','Armory',8,390,'military','barracks'],['palace','Royal palace',8,650,'tax','castle'],
['bank','Counting house',9,600,'tax','timber_frame_house'],['hospital','Hospital',9,450,'order','apothecary'],['guild','Guild hall',9,430,'tax','longhouse'],['reservoir','Reservoir',9,440,'food','stone_well'],
['arsenal','Royal arsenal',10,720,'siege','barracks'],['mint','Royal mint',10,700,'tax','blacksmith'],['citadel','Citadel',10,850,'defense','castle'],['archives','Royal archives',10,620,'research','longhouse']];
export const HOME_BUILDINGS=Object.fromEntries(defs.map(([id,name,unlock,cost,effect,art])=>[id,{id,name,unlock,cost,effect,art}]));
const LEGACY=new Set(['farm','market','barracks','fort']);
const branches=[
['farming','Agriculture','farm','food'],['irrigation','Irrigation','well','food'],['milling','Food processing','mill','food'],['forestry','Forestry','lumber','wood'],['masonry','Masonry','quarry','stone'],
['mining','Iron extraction','iron','iron'],['metallurgy','Metalworking','forge','military'],['infantry','Infantry doctrine','barracks','recruit'],['archery','Archery training','archery','military'],['cavalry','Mounted warfare','stable','recruit'],
['siege','Siege engineering','workshop','siege'],['gunpowder','Gunpowder engineering','foundry','military'],['trade','Commerce','market','tax'],['finance','Royal finance','tradehall','tax'],['storage','Storage logistics','granary','storage'],
['fortification','Defensive engineering','fort','defense'],['medicine','Medicine','apothecary','order'],['administration','Administration','palace','tax'],['education','Scholarship','school','research'],['engineering','Civil engineering','watermill','research']];
export const HOME_RESEARCH=Object.fromEntries(branches.map(([id,name,building,effect])=>[id,{id,name,building,effect}]));
const materials=['wood','stone','iron'];
export function homeRealm(g,r=g.player){return g.hometown?.realms?.[r]||null;}
export function homeLevel(g,p,k){const pr=g.provinces?.[p];return !pr?0:integer(LEGACY.has(k)?pr.buildings?.[k]:g.hometown?.buildings?.[p]?.[k]);}
function capital(g,world,r){const list=Object.values(g.provinces||{}).filter(p=>p.owner===r&&controller(g,p.id)===r);const seat=g.kingdom?.courts?.[r]?.capital;const center=g.factions?.[r]?.capital;const ids=new Set(list.map(p=>p.id));const statics=new Map((world?.provinces||[]).filter(p=>ids.has(p.id)).map(p=>[p.id,p]));const distance=p=>{const xy=statics.get(p.id)?.centroid;return xy&&Array.isArray(center)?Math.hypot(xy[0]-center[0],xy[1]-center[1]):Infinity;};return list.find(p=>p.id===seat)?.id||list.sort((a,b)=>(distance(a)-distance(b))||(b.development||0)-(a.development||0)||a.id.localeCompare(b.id))[0]?.id||null;}
export function openHometown(g,world){if(!humanControlsRealm(g,g.player))return no('Only the sovereign can manage crown construction.');const r=g.player,p=capital(g,world,r);if(!p)return no('A controlled homeland is required.');
 const root=g.hometown??={version:1,realms:{},buildings:{},lastTick:-1};root.realms??={};root.buildings??={};if(!root.realms[r]){const level=clamp(Math.max(Math.ceil((g.provinces[p].development||1)/3),...Object.values(g.provinces[p].buildings||{}).map(v=>integer(v))),1,10);root.realms[r]={level,capital:p,stock:{wood:250,stone:180,iron:100},research:{},queue:[],positions:{},next:1,workers:null,knowledge:0,founded:[]};}
 const h=root.realms[r];h.stock??={wood:250,stone:180,iron:100};h.research??={};h.positions??={};h.queue??=[];h.next??=1;if(!h.infrastructureMigrated){for(const army of Object.values(g.armies||{})){if(army.owner!==r||!permitted(g,army.province,r))continue;const row=root.buildings[army.province]??={};if(army.archers>0)row.archery=Math.max(1,integer(row.archery));if(army.cavalry>0)row.stable=Math.max(1,integer(row.stable));}h.infrastructureMigrated=true;}return ok('Hometown opened.');}
export function homeCapital(g,world,r=g.player){const h=homeRealm(g,r);return h&&g.provinces[h.capital]?.owner===r&&controller(g,h.capital)===r?h.capital:capital(g,world,r);}
function permitted(g,p,r){return g.provinces?.[p]?.owner===r&&controller(g,p)===r;}
export function homeMax(g,r=g.player){return homeRealm(g,r)?.level||3;}
function active(g,r){return homeRealm(g,r);}
function researchLevel(h,k){return integer(h?.research?.[k]);}
function totals(g,r){const h=active(g,r),out={food:0,wood:0,stone:0,iron:0,tax:0,recruit:0,military:0,siege:0,order:0,storage:0,research:0,defense:0};if(!h)return out;
 for(const d of Object.values(HOME_RESEARCH))out[d.effect]+=researchLevel(h,d.id)*2;
 const capitalId=h.capital;for(const [p,row] of Object.entries(g.hometown?.buildings||{})){if(!permitted(g,p,r))continue;for(const [key,level] of Object.entries(row)){const d=HOME_BUILDINGS[key];if(d&&!LEGACY.has(key)&&d.effect!=='food')out[d.effect]+=integer(level)*(p===capitalId?1:.25);}}
 return out;}
export function workforceProfile(g,r){
  const h=active(g,r);
  const cap=h?.capital&&g?.provinces?.[h.capital];
  const pop=Math.max(10,Number(cap?.population||40));
  const total=Math.max(14,Math.min(180,Math.round(pop*0.35+(Object.values(h?.level||{}).reduce((a,b)=>a+Number(b||0),0)*0.4))));
  const weights={farmers:.26,woodcutters:.14,miners:.12,builders:.14,merchants:.12,scholars:.08,soldiers:.14};
  const auto=Object.fromEntries(WORKFORCE_ROLES.map(role=>[role.id,Math.max(1,Math.round(total*weights[role.id]))]));
  const sumAuto=Object.values(auto).reduce((a,b)=>a+b,0);
  auto.farmers+=total-sumAuto;
  if(!h||!h.workers)return {total,manual:false,assigned:auto,baseline:auto,mult:{food:1,wood:1,iron:1,build:1,trade:1,knowledge:1,recruit:1}};
  const cur={};
  let used=0;
  for(const role of WORKFORCE_ROLES){const v=Math.max(0,Math.floor(Number(h.workers[role.id]??auto[role.id])));cur[role.id]=v;used+=v;}
  if(used!==total&&used>0){
    const diff=total-used;
    cur.farmers=Math.max(0,cur.farmers+diff);
  }
  const ratio=k=>cur[k]/Math.max(1,auto[k]);
  return {
    total,manual:true,assigned:cur,baseline:auto,
    mult:{
      food:Math.max(.6,Math.min(1.65,.7+.3*ratio('farmers'))),
      wood:Math.max(.6,Math.min(1.65,.7+.3*ratio('woodcutters'))),
      iron:Math.max(.6,Math.min(1.65,.7+.3*ratio('miners'))),
      build:Math.max(.65,Math.min(1.75,.75+.25*ratio('builders'))),
      trade:Math.max(.65,Math.min(1.6,.75+.25*ratio('merchants'))),
      knowledge:Math.max(.5,Math.min(2,.6+.4*ratio('scholars'))),
      recruit:Math.max(.7,Math.min(1.5,.75+.25*ratio('soldiers')))
    }
  };
}
export function assignWorker(g,r,role,delta=1){
  const h=active(g,r);if(!h)return false;
  if(role==='auto'){h.workers=null;return true;}
  const wf=workforceProfile(g,r);
  const cur={...wf.assigned};
  if(!(role in cur))return false;
  const d=Math.trunc(Number(delta)||0);
  if(!d)return false;
  if(d>0){
    const donors=WORKFORCE_ROLES.map(x=>x.id).filter(id=>id!==role&&cur[id]>1).sort((a,b)=>cur[b]-cur[a]);
    let rem=d;
    for(const donor of donors){
      if(rem<=0)break;
      const take=Math.min(rem,cur[donor]-1);
      cur[donor]-=take;cur[role]+=take;rem-=take;
    }
    if(rem===d)return false;
  }else{
    const give=Math.min(-d,cur[role]-1);
    if(give<=0)return false;
    cur[role]-=give;
    const recv=role==='farmers'?'builders':'farmers';
    cur[recv]+=give;
  }
  h.workers=cur;
  return true;
}
export function recordCapitalMilestone(g,r,text){
  const h=active(g,r);if(!h||!text)return;
  if(!Array.isArray(h.founded))h.founded=[];
  const year=Number(g?.year||1450);
  h.founded.unshift({year,text:String(text)});
  if(h.founded.length>16)h.founded.length=16;
}
export function hometownModifiers(g,r){const h=active(g,r);if(!h||!h.capital||!permitted(g,h.capital,r))return {tax:1,food:1,recruit:1,cost:1,power:1,siege:1,order:0,defense:1,trade:1,knowledge:1,buildSpeed:1};const t=totals(g,r);const wf=workforceProfile(g,r);return {tax:1+Math.min(.35,t.tax*.006),food:(1+Math.min(.4,t.food*.007))*wf.mult.food,recruit:(1+Math.min(.3,t.recruit*.006))*wf.mult.recruit,cost:1-Math.min(.2,t.research*.004),power:1+Math.min(.2,t.military*.004),siege:1+Math.min(.3,t.siege*.008),order:Math.min(2,t.order*.05),defense:1+Math.min(.25,t.defense*.006),trade:(1+Math.min(.35,(t.tax+t.wood)*.003))*wf.mult.trade,knowledge:Number(((1+t.research*.015)*wf.mult.knowledge).toFixed(2)),buildSpeed:wf.mult.build};}
// Local agricultural infrastructure improves the province that built it.
// Research travels with the realm, while buildings belong to their province.
// Royal reserves and local merchant goods are distinct existing inventories.
export function homeFarmProfile(g,id){
 const p=g.provinces?.[id],h=p&&active(g,p.owner),farm=homeLevel(g,id,'farm');
 const baseline=Math.max(0,(p?.population||0)*.085+farm*8);
 if(!p||!h||!permitted(g,id,p.owner))return {farm,baseline,food:baseline,localFactor:1,researchFactor:1,grainFactor:1};
 const l=k=>homeLevel(g,id,k);
 const localFactor=1+Math.min(.65,l('well')*.015+l('mill')*.035+l('watermill')*.04+l('bakery')*.025+l('reservoir')*.035);
 const researchFactor=1+Math.min(.4,(researchLevel(h,'farming')+researchLevel(h,'irrigation')+researchLevel(h,'milling'))*.014);
 const grainFactor=localFactor*researchFactor;
 const owner=g.provinces?.[id]?.owner,wfFood=owner&&active(g,owner)?workforceProfile(g,owner).mult.food:1;
 return {farm,baseline,food:baseline*grainFactor*wfFood,localFactor,researchFactor,grainFactor};
}
export function homeFoodOutput(g,p){return homeFarmProfile(g,p.id).food;}
export function homeProvinceMaterials(g,id){
 const p=g.provinces?.[id],h=p&&active(g,p.owner);if(!h||!permitted(g,id,p.owner))return {wood:0,stone:0,iron:0};
 const l=k=>homeLevel(g,id,k),eco=g.economy?.provinces?.[id],rich=eco?.resources||[];
 const wood=(l('lumber')*4)*(rich.includes('timber')?1.25:1);
 const stone=l('quarry')*3;
 const iron=(l('iron')*2+l('foundry')*3)*(rich.includes('ore')?1.25:1);
 return {wood,stone,iron};
}
export function homeProduction(g,r=g.player){
 const h=active(g,r),t=totals(g,r),land=Object.values(g.provinces||{}).filter(p=>permitted(g,p.id,r)),n=land.length;
 if(!h||!n)return {wood:0,stone:0,iron:0};
 const wf=workforceProfile(g,r);
 const sum={wood:4+Math.min(25,n),stone:3+Math.min(20,n),iron:2+Math.min(15,n)};
 for(const p of land){const row=homeProvinceMaterials(g,p.id);for(const k of materials)sum[k]+=row[k];}
 return Object.fromEntries(materials.map(k=>[k,Math.floor(sum[k]*(1+t[k]*.025)*(k==='wood'?wf.mult.wood:wf.mult.iron))]));
}
export function homeRecruitmentRequirement(g,id,type){
 const p=g.provinces?.[id],h=p&&active(g,p.owner);if(!h)return '';
 if(type==='cavalry'&&homeLevel(g,id,'stable')<1)return 'Build a stable in this province to recruit cavalry.';
 if(type==='archers'&&homeLevel(g,id,'archery')<1&&homeLevel(g,id,'barracks')<2)return 'Build an archery range or level 2 barracks.';
 return '';
}
export function homeLocalStorageBonus(g,id,good){
 const p=g.provinces?.[id];if(!p||!active(g,p.owner)||!permitted(g,id,p.owner))return 0;
 return homeLevel(g,id,'warehouse')*12+(['grain','provisions'].includes(good)?homeLevel(g,id,'granary')*16:0);
}
export function homeBuildingBenefit(g,id,key){
 const d=HOME_BUILDINGS[key],level=homeLevel(g,id,key);if(!d)return '';
 const farm=homeFarmProfile(g,id),res=homeProvinceMaterials(g,id);
 if(key==='farm')return 'Local gross food: '+farm.food.toFixed(1)+'/month; each farm level adds 8 base food.';
 if(key==='lumber'||key==='quarry'||key==='iron'||key==='foundry'){const k=d.effect;return 'Local '+k+' production: '+res[k].toFixed(1)+'/month before realm research bonuses.';}
 if(key==='granary')return 'Local grain/provision storage bonus: '+(level*16)+' units each; larger royal reserves.';
 if(key==='warehouse')return 'Local goods storage bonus: '+(level*12)+' units per good; larger royal reserves.';
 if(['well','mill','watermill','bakery','reservoir'].includes(key))return 'Local farming efficiency: +'+Math.round((farm.localFactor-1)*100)+'% from agricultural infrastructure.';
 if(key==='stable')return level?'Cavalry recruitment unlocked in this province.':'Unlocks local cavalry recruitment.';
 if(key==='archery')return level?'Archer recruitment unlocked in this province.':'Unlocks local archer recruitment.';
 if(key==='barracks')return 'Recruitment gold cost falls with each level; level 2 also unlocks archers.';
 if(key==='fort')return 'Adds 45 base garrison strength per level, plus existing provincial defenses.';
 return d.effect==='research'?'Supports cheaper construction and faster research; enables related technologies.': 'Contributes to realm '+d.effect+' development and related research requirements.';
}
export function homeQuote(g,world,type,key,p,realm=g.player){const h=active(g,realm);if(!h||!humanControlsRealm(g,realm))return {ok:false,msg:'Open Hometown as sovereign first.'};
 const cap=homeCapital(g,world,realm);if(!cap)return {ok:false,msg:'No controlled capital.'};
 let target,cost,months,name;const f=g.factions[realm],t=totals(g,realm);
 if(type==='town'){if(h.level>=10)return no('Maximum Town Hall level.');p=cap;key='town';target=h.level+1;name='Town Hall';cost=220*target;months=2+Math.floor(target/2);}
 else if(type==='building'){const d=HOME_BUILDINGS[key];if(!d||!permitted(g,p,realm))return no('Select a controlled province and valid building.');target=homeLevel(g,p,key)+1;if(h.level<d.unlock||target>h.level||target>10)return no('Upgrade Town Hall first or maximum level reached.');name=d.name;cost=d.cost*target;months=1+Math.floor(target/3);}
 else if(type==='research'){const d=HOME_RESEARCH[key];if(!d)return no('Unknown research.');p=cap;target=researchLevel(h,key)+1;name=technologyName(key,target);if(target>10)return no('All ten technologies researched.');if(target>h.level||homeLevel(g,cap,d.building)<Math.ceil(target/2))return no('Requires Town Hall level '+target+' and '+HOME_BUILDINGS[d.building].name+' level '+Math.ceil(target/2)+'.');cost=100*target;months=Math.max(1,2+Math.floor(target/3)-Math.floor(t.research/15));}
 else return no('Unknown project.');
 if(h.queue.some(q=>q.type===type&&q.key===key&&q.province===p))return no('Already queued.');
 if(h.queue.length>=500)return no('Construction queue is full.');
 const price={gold:Math.max(1,Math.round(cost*(1-Math.min(.2,t.research*.004)))),wood:Math.ceil(cost*.22),stone:Math.ceil(cost*.14),iron:Math.ceil(cost*.07),food:Math.ceil(cost*.03)};
 const affordable=(f.treasury||0)>=price.gold&&(f.food||0)>=price.food&&materials.every(k=>h.stock[k]>=price[k]);
 return {ok:affordable,msg:affordable?'Available':'Insufficient resources.',type,key,province:p,target,name,price,months};}
function changeFunds(g,r,q,sign){const h=active(g,r),f=g.factions[r];f.treasury+=sign*q.price.gold;f.food+=sign*q.price.food;for(const k of materials)h.stock[k]+=sign*q.price[k];}
export function queueHome(g,world,type,key,p){const r=g.player,h=active(g,r),q=homeQuote(g,world,type,key,p);if(!q.ok)return no(q.msg);changeFunds(g,r,q,-1);h.queue.push({...q,id:h.next++,remaining:q.months,started:false});return ok(q.name+' level '+q.target+' queued.');}
export function bulkHomePreview(g,world,key){const h=active(g,g.player),f=g.factions[g.player],sum={gold:0,food:0,wood:0,stone:0,iron:0};if(!h||!f||!HOME_BUILDINGS[key])return {count:0,skipped:0,sum};let count=0,skipped=0;const funds={gold:f.treasury,food:f.food,...h.stock};for(const p of Object.values(g.provinces).filter(p=>p.owner===g.player).sort((a,b)=>a.id.localeCompare(b.id))){const q=homeQuote(g,world,'building',key,p.id);if(!q.ok||count+h.queue.length>=500||Object.keys(sum).some(k=>sum[k]+q.price[k]>funds[k])){skipped++;continue;}count++;for(const k of Object.keys(sum))sum[k]+=q.price[k];}return {count,skipped,sum};}
export function bulkHome(g,world,key){const h=active(g,g.player);if(!h||!humanControlsRealm(g,g.player)||!HOME_BUILDINGS[key])return no('Invalid bulk construction.');let count=0,skipped=0;for(const p of Object.values(g.provinces).filter(p=>p.owner===g.player).sort((a,b)=>a.id.localeCompare(b.id))){const result=queueHome(g,world,'building',key,p.id);if(result.ok)count++;else skipped++;}return count?ok(count+' provinces queued; '+skipped+' skipped (cost, control, prerequisites or existing project).'):no('No eligible affordable provinces.');}
export function cancelHome(g,id){const h=active(g,g.player);if(!h||!humanControlsRealm(g,g.player))return no('Not authorized.');const i=h.queue.findIndex(q=>q.id===Number(id));if(i<0)return no('Project not found.');const q=h.queue[i];if(q.started)return no('Construction has started; cannot cancel.');changeFunds(g,g.player,q,1);h.queue.splice(i,1);return ok('Queued project cancelled and refunded.');}
export function homePositions(g,p,h){const pending=new Set(h.queue.filter(q=>q.type==='building'&&q.province===p).map(q=>q.key));const built=Object.keys(HOME_BUILDINGS).filter(k=>homeLevel(g,p,k)>0||pending.has(k)),used=new Set([27]),spots={};for(const k of built){const v=h.positions[k];if(Number.isInteger(v)&&v>=0&&v<64&&!used.has(v)){spots[k]=v;used.add(v);}}for(const k of built)if(spots[k]===undefined){const slot=Array.from({length:64},(_,i)=>i).find(i=>!used.has(i));if(slot!==undefined){spots[k]=slot;used.add(slot);}}return spots;}
export function placeHome(g,world,key,slot){const h=active(g,g.player),p=homeCapital(g,world);slot=Number(slot);if(!h||!humanControlsRealm(g,g.player)||!HOME_BUILDINGS[key]||!Number.isInteger(slot)||slot<0||slot>=64||slot===27)return no('Select a valid building and empty plot.');if(Object.entries(homePositions(g,p,h)).some(([k,v])=>k!==key&&v===slot))return no('Plot occupied.');if(!homeLevel(g,p,key)&&!h.queue.some(q=>q.type==='building'&&q.key===key&&q.province===p)){const q=queueHome(g,world,'building',key,p);if(!q.ok)return q;}h.positions[key]=slot;return ok('Building plot reserved.');}
export function moveHome(g,world,key,slot){const h=active(g,g.player),p=homeCapital(g,world);slot=Number(slot);if(!h||!humanControlsRealm(g,g.player)||!HOME_BUILDINGS[key]||!homeLevel(g,p,key)||!Number.isInteger(slot)||slot<0||slot>=64||slot===27)return no('Invalid building placement.');if(Object.entries(homePositions(g,p,h)).some(([k,v])=>k!==key&&v===slot))return no('Plot occupied.');h.positions[key]=slot;return ok('Building moved.');}
const AI_BUILD_PRIORITY=['farm','house','well','lumber','quarry','market','granary','barracks','fort','library'];
const AI_RESEARCH_PRIORITY=['farming','forestry','masonry','trade','infantry'];
function aiPriceFor(cost,t){return {gold:Math.max(1,Math.round(cost*(1-Math.min(.2,(t.research||0)*.004)))),wood:Math.ceil(cost*.22),stone:Math.ceil(cost*.14),iron:Math.ceil(cost*.07),food:Math.ceil(cost*.03)};}
function tickAiHometown(g,world,root){
 if(g.turn<12||g.turn%12!==0)return;
 const keys=Object.keys(g.factions||{}).filter(r=>r!=='independent'&&!humanControlsRealm(g,r)).sort();
 let budgetOps=0;
 for(const r of keys){
  if(budgetOps>=18)break;
  const f=g.factions[r],cap=homeCapital(g,world,r);
  if(!f||!cap||f.treasury<650||(f.food||0)<80)continue;
  let h=root.realms[r];
  if(!h){
   if(Object.keys(root.realms).length>=64)continue;
   const level=clamp(Math.max(Math.ceil((g.provinces[cap].development||1)/3),...Object.values(g.provinces[cap].buildings||{}).map(v=>integer(v))),1,10);
   h=root.realms[r]={level,capital:cap,stock:{wood:250,stone:180,iron:100},research:{},queue:[],positions:{},next:1,infrastructureMigrated:true};
   budgetOps++;
  }
  if((h.queue?.length||0)>=2)continue;
  const t=totals(g,r);
  const queued=new Set((h.queue||[]).map(q=>q.type+':'+q.key));
  const candB=AI_BUILD_PRIORITY.map(k=>({key:k,lv:homeLevel(g,cap,k),d:HOME_BUILDINGS[k]})).filter(x=>x.d&&h.level>=x.d.unlock&&x.lv<h.level&&x.lv<10&&!queued.has('building:'+x.key)).sort((a,b)=>a.lv-b.lv||a.key.localeCompare(b.key))[0];
  if(candB){
   const target=candB.lv+1,price=aiPriceFor(candB.d.cost*target,t);
   if(f.treasury>=price.gold+220&&(f.food||0)>=price.food+40&&materials.every(m=>(h.stock[m]||0)>=price[m])){
    const q={ok:true,type:'building',key:candB.key,province:cap,target,name:candB.d.name,price,months:1+Math.floor(target/3),id:h.next++,started:false};
    q.remaining=q.months;changeFunds(g,r,q,-1);h.queue.push(q);budgetOps++;continue;
   }
  }
  if(h.level<10&&!queued.has('town:town')){
   const target=h.level+1,price=aiPriceFor(220*target,t);
   if(f.treasury>=price.gold+260&&(f.food||0)>=price.food+40&&materials.every(m=>(h.stock[m]||0)>=price[m])){
    const q={ok:true,type:'town',key:'town',province:cap,target,name:'Town Hall',price,months:2+Math.floor(target/2),id:h.next++,started:false};
    q.remaining=q.months;changeFunds(g,r,q,-1);h.queue.push(q);budgetOps++;continue;
   }
  }
  const candR=AI_RESEARCH_PRIORITY.map(k=>({key:k,lv:researchLevel(h,k),d:HOME_RESEARCH[k]})).filter(x=>x.d&&x.lv<10&&x.lv+1<=h.level&&homeLevel(g,cap,x.d.building)>=Math.ceil((x.lv+1)/2)&&!queued.has('research:'+x.key))[0];
  if(candR){
   const target=candR.lv+1,price=aiPriceFor(100*target,t);
   if(f.treasury>=price.gold+220&&(f.food||0)>=price.food+40&&materials.every(m=>(h.stock[m]||0)>=price[m])){
    const q={ok:true,type:'research',key:candR.key,province:cap,target,name:candR.d.name,price,months:Math.max(1,2+Math.floor(target/3)-Math.floor((t.research||0)/15)),id:h.next++,started:false};
    q.remaining=q.months;changeFunds(g,r,q,-1);h.queue.push(q);budgetOps++;
   }
  }
 }
}
 export function tickHometown(g,world){const root=g.hometown;if(!root||root.lastTick===g.turn)return;root.lastTick=g.turn;
 tickAiHometown(g,world,root);
 for(const [r,h] of Object.entries(root.realms)){const f=g.factions[r];if(!f)continue;const cap=homeCapital(g,world,r);if(!cap){for(const q of h.queue)if(!q.started)changeFunds(g,r,q,1);h.queue=[];continue;}if(h.capital!==cap){h.positions={};h.capital=cap;}const prod=homeProduction(g,r),t=totals(g,r),wf=workforceProfile(g,r);for(const k of materials)h.stock[k]=Math.min(1000+h.level*700+t.storage*100,integer(h.stock[k])+prod[k]);
 h.knowledge=Number(((h.knowledge||0)+(2+t.research*.35)*wf.mult.knowledge).toFixed(1));
 const builderBoost=wf.mult.build>=1.25&&g.turn%2===0?1:0;
 let slots=Math.min(4,1+Math.floor(h.level/3)),researchSlot=1;const finished=new Set();
 for(const q of h.queue){if(!permitted(g,q.province,r)||(q.type!=='building'&&q.province!==cap)){if(!q.started)changeFunds(g,r,q,1);finished.add(q.id);continue;}if(q.type==='research'){if(!researchSlot)continue;researchSlot--;}else{if(!slots)continue;slots--;}q.started=true;q.remaining-=(q.type==='research'?(wf.mult.knowledge>=1.35&&g.turn%3===0?2:1):(1+builderBoost));if(q.remaining>0)continue;
  if(q.type==='town'){h.level=Math.max(h.level,q.target);recordCapitalMilestone(g,r,'Chartered '+TOWN_NAMES[h.level-1]+' (Town Hall '+h.level+')');}else if(q.type==='research'){h.research[q.key]=Math.max(researchLevel(h,q.key),q.target);if(q.target>=5)recordCapitalMilestone(g,r,'Scholarly breakthrough: '+q.name+' '+q.target);}else {const p=g.provinces[q.province];if(LEGACY.has(q.key)){p.buildings[q.key]=Math.max(homeLevel(g,q.province,q.key),q.target);p.development=Math.min(20,(p.development||1)+1);if(q.key==='farm')p.unrest=Math.max(0,(p.unrest||0)-3);if(q.key==='fort')p.unrest=Math.max(0,(p.unrest||0)-2);}else{const row=root.buildings[q.province]??={};row[q.key]=Math.max(homeLevel(g,q.province,q.key),q.target);}if(['cathedral','citadel','palace','mint','observatory'].includes(q.key)&&q.target===1)recordCapitalMilestone(g,r,'Raised '+q.name);}
  finished.add(q.id);if(r===g.player&&g.log){g.log.unshift({date:g.year+' · month '+(g.month+1),text:q.name+' level '+q.target+' completed.'});g.log=g.log.slice(0,45);}
 }h.queue=h.queue.filter(q=>!finished.has(q.id));
 }}
const unlocks={pikes:['infantry',2],guard:['infantry',4],longbow:['archery',2],crossbow:['archery',2],handgun:['gunpowder',1],lancers:['cavalry',2],horsebow:['cavalry',2],elephants:['cavalry',3],ram:['siege',1],catapult:['siege',2],bombard:['gunpowder',2]};
export function homeMilitaryUnlocked(g,r,k){const h=active(g,r),d=unlocks[k];return !h||!d||researchLevel(h,d[0])>=d[1];}
export function homeMilitaryRequirement(k){const d=unlocks[k];return d?technologyName(d[0],d[1])+' ('+HOME_RESEARCH[d[0]].name+' '+d[1]+')':'Basic training';}
export function homeEngineQuote(g,r,definition){const h=active(g,r);if(!h||!definition)return null;const price={wood:definition.timber*4,iron:definition.tools*3};return {price,ok:permitted(g,h.capital,r)&&h.stock.wood>=price.wood&&h.stock.iron>=price.iron};}
export function spendHomeEngineMaterials(g,r,definition){const q=homeEngineQuote(g,r,definition);if(!q?.ok)return false;const h=active(g,r);h.stock.wood-=q.price.wood;h.stock.iron-=q.price.iron;return true;}

export function homeBuyMaterial(g,kind,amount=50){const h=active(g,g.player),f=g.factions[g.player];if(!h||!humanControlsRealm(g,g.player)||!materials.includes(kind)||!Number.isInteger(amount)||amount<1||amount>500||!permitted(g,h.capital,g.player))return no('Invalid material purchase.');const cap=1000+h.level*700+totals(g,g.player).storage*100;const qty=Math.min(amount,Math.max(0,cap-h.stock[kind]));const price=qty*({wood:3,stone:4,iron:5}[kind]);if(!qty||f.treasury<price)return no('Insufficient treasury or reserve capacity.');f.treasury-=price;h.stock[kind]+=qty;return ok(qty+' '+kind+' purchased for '+price+' gold.');}
