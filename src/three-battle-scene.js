import {disposeFieldMaterials} from './field-visuals.js';
import {suppressFortScenery} from './field-scenery.js';
import {applyFieldAtmosphere} from './field-atmosphere.js';
import {updateFieldCharacters, animationClipState} from './battle-presentation.js';
import {terrainHeight,terrainForestCovers} from './field-tactics.js';
import {sampledSoldierBudget,createFrameBudgetMonitor,disposeThreeObject} from './render-performance.js';
/**
 * Sovereign 1450 — Three.js 3D battle renderer with cleared 0 A.D. (CC BY-SA 3.0),
 * Polyfork (MIT/CC0) and KayKit (CC0) regional armies, mounts, 3D siege fortifications,
 * Hometown capital silhouettes, and 3D flora/rocks.
 * Bundled locally by scripts/build-battle-bundle.mjs. No runtime CDN dependence.
 */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {buildMedievalBattlefield} from './battlefield-art.js';

const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
const meshes={
 box:()=>new THREE.BoxGeometry(1,1,1),
 cone:()=>new THREE.ConeGeometry(.5,1,8),
 cylinder:()=>new THREE.CylinderGeometry(.5,.5,1,8),
 sphere:()=>new THREE.SphereGeometry(.5,9,7)
};
const walkClip=clips=>clips.find(c=>/^(Walking_A|walk)$/i.test(c.name))||clips.find(c=>/walk/i.test(c.name))||clips.find(c=>/run/i.test(c.name));
const runClip=clips=>clips.find(c=>/^(Running_A|run)$/i.test(c.name))||clips.find(c=>/run|charge|gallop/i.test(c.name))||walkClip(clips);
const idleClip=clips=>clips.find(c=>/^(Idle_A|idle)$/i.test(c.name))||clips.find(c=>/idle/i.test(c.name))||clips[0];
const attackClip=clips=>clips.find(c=>/^(attack_melee|1H_Melee_Attack_Slice)$/i.test(c.name))||clips.find(c=>/melee.*attack|attack.*slash|attack_melee/i.test(c.name))||clips.find(c=>/attack/i.test(c.name));
const bowClip=clips=>clips.find(c=>/^attack_ranged$/i.test(c.name))||clips.find(c=>/bow.*(shoot|release)/i.test(c.name))||clips.find(c=>/shoot.*bow|archery|attack_ranged/i.test(c.name))||attackClip(clips);
const deathClip=clips=>clips.find(c=>/^(death|Death_A)$/i.test(c.name))||clips.find(c=>/death|die/i.test(c.name))||null;
const rallyClip=clips=>clips.find(c=>/^(promotion|cheer|rally)$/i.test(c.name))||clips.find(c=>/promot|cheer|victory/i.test(c.name))||null;
const elapsedTime=(phase,t,j)=>(t*10+phase+j*Math.PI*.6);

const SOUTH_INDIA_REALMS=new Set(['vijayanagara','bahmani','mysore','madurai','keladi','ceylon','kandy']);
const NORTH_INDIA_REALMS=new Set(['delhi','bengal','gujarat','malwa','jaunpur','orissa','mewar','sindh','marwar','gondwana','khandesh','ahmednagar','bijapur','golconda','kashmir']);
const CHINA_REALMS=new Set(['ming','manchu','joseon','tibetan','tibet']);
const JAPAN_REALMS=new Set(['ashikaga','hosokawa','uesugi','oda','shimazu','otomo','date','takeda']);
const SOUTHEAST_ASIA_REALMS=new Set(['ayutthaya','dai-viet','dai_viet','lan-xang','prome','ava','pegu','shan','majapahit','malacca','sukhothai','khmer','champa']);
const STEPPE_REALMS=new Set(['horde','golden-horde','uzbek','kazakh','oirat','chagatai','nogai','crimea','timurids','mongol']);
const OTTOMAN_REALMS=new Set(['ottomans','mamluks','karaman','oman','yemen','rasulids','bahrain','arabia','morocco','tunis','tlemcen','granada']);
const PERSIA_REALMS=new Set(['persia','safavids','qara','aq-qoyunlu','shirvan','khorasan']);
const BYZANTINE_REALMS=new Set(['byzantium','byzantine','trebizond','serbia','wallachia','moldavia','georgia','epirus']);
const NORTHERN_EUROPE_REALMS=new Set(['denmark','sweden','norway','kalmar','scotland','teutonic','teutons','livonia','novgorod']);
const EASTERN_EUROPE_REALMS=new Set(['poland','lithuania','muscovy','hungary','bohemia','mazovia','ryazan','tver']);
const AFRICA_REALMS=new Set(['ethiopia','mali','songhai','kilwa','kongo','benin','kanem','bornu','adal','mutapa']);
const MESOAMERICA_REALMS=new Set(['aztec','tarascans','maya','mixtec','zapotec','tlaxcala']);
const ANDEAN_REALMS=new Set(['inca','cusco','chimu','muisca']);

export function detailedRegionalFamilyForRealm(realmId){
 const id=String(realmId||'').toLowerCase();
 if(SOUTH_INDIA_REALMS.has(id))return 'south_india';
 if(NORTH_INDIA_REALMS.has(id))return 'north_india';
 if(CHINA_REALMS.has(id))return 'china';
 if(JAPAN_REALMS.has(id))return 'japan';
 if(SOUTHEAST_ASIA_REALMS.has(id))return 'southeast_asia';
 if(STEPPE_REALMS.has(id))return 'steppe';
 if(OTTOMAN_REALMS.has(id))return 'ottoman';
 if(PERSIA_REALMS.has(id))return 'persia';
 if(BYZANTINE_REALMS.has(id))return 'byzantine';
 if(NORTHERN_EUROPE_REALMS.has(id))return 'northern_europe';
 if(EASTERN_EUROPE_REALMS.has(id))return 'eastern_europe';
 if(AFRICA_REALMS.has(id))return 'africa';
 if(MESOAMERICA_REALMS.has(id))return 'mesoamerica';
 if(ANDEAN_REALMS.has(id))return 'andean';
 return 'western_europe';
}

export const GRAPHICS_PRESETS={
 low:{label:'Low',pixelRatio:1,soldierScale:0.65,propDensity:0.45},
 medium:{label:'Medium',pixelRatio:1.25,soldierScale:1.0,propDensity:0.8},
 high:{label:'High',pixelRatio:1.5,soldierScale:1.25,propDensity:1.0}
};

export function regionalAliasFallback(fam){
 if(fam==='south_india'||fam==='north_india')return 'india';
 if(fam==='china'||fam==='japan'||fam==='southeast_asia')return 'east_asia';
 if(fam==='ottoman'||fam==='steppe'||fam==='persia')return 'persia';
 return 'europe';
}

export function regionalFamilyForRealm(realmId){
 return regionalAliasFallback(detailedRegionalFamilyForRealm(realmId));
}

function createSharedHorseAssets(){
 return {
  geo:{
   body:new THREE.SphereGeometry(.5,9,7),
   neck:new THREE.CylinderGeometry(.22,.31,1,7),
   box:new THREE.BoxGeometry(1,1,1),
   leg:new THREE.CylinderGeometry(.10,.08,.70,6),
   hoof:new THREE.BoxGeometry(.19,.14,.27),
   tail:new THREE.ConeGeometry(.17,.63,6)
  },
  mat:{
   fur:new THREE.MeshLambertMaterial({color:0x775136}),
   mane:new THREE.MeshLambertMaterial({color:0x382d29}),
   saddle:new THREE.MeshLambertMaterial({color:0x594137})
  }
 };
}

/** Shared-geometry procedural mount for any cavalry fallback lacking an embedded horse rig. */
function createHorse(shared){
 const horse=new THREE.Group();
 const {geo,mat}=shared;
 const shape=(geometry,material,x,y,z,sx,sy,sz)=>{
  const item=new THREE.Mesh(geometry,material);item.position.set(x,y,z);item.scale.set(sx,sy,sz);horse.add(item);return item;
 };
 shape(geo.body,mat.fur,0,.88,0,.78,.64,1.30);
 const neck=shape(geo.neck,mat.fur,0,1.20,.52,.9,1,.9);
 neck.rotation.x=-.50;
 shape(geo.box,mat.fur,0,1.52,.80,.34,.42,.61);
 shape(geo.box,mat.mane,0,1.42,.50,.42,.32,.14);
 shape(geo.box,mat.saddle,0,1.23,-.12,.70,.22,.56);
 const legs=[];
 for(const x of [-.30,.30])for(const z of [-.47,.47]){
  const joint=new THREE.Group();joint.position.set(x,.57,z);horse.add(joint);
  const leg=new THREE.Mesh(geo.leg,mat.fur);
  leg.position.y=-.31;joint.add(leg);
  const hoof=new THREE.Mesh(geo.hoof,mat.mane);
  hoof.position.set(0,-.69,.07);joint.add(hoof);legs.push(joint);
 }
 const tail=shape(geo.tail,mat.mane,0,.93,-.83,.85,1,1);
 tail.rotation.x=.46;
 return {horse,legs};
}

// Visibly different regiment silhouettes. These are troop layouts, not just buffs.
export function formationPosition(index,count,id,spacing=1){
 const row=Math.floor(index/5),col=index%5;
 if(id==='cavalry_wedge'||id==='elephant_push'){
  const depth=Math.floor(Math.sqrt(index)),start=depth*depth,within=index-start,number=depth*2+1;
  return [(within-(number-1)/2)*spacing,(depth-1.3)*spacing*1.3];
 }
 if(id==='longbow_line'||id==='volley_line'||id==='line')return [(index-(count-1)/2)*spacing*.84,0];
 if(id==='pike_square'||id==='square'){
  const side=Math.ceil(Math.sqrt(count));
  return [(index%side-(side-1)/2)*spacing,(Math.floor(index/side)-(side-1)/2)*spacing];
 }
 if(id==='encirclement'||id==='ambush'){
  const angle=Math.PI*.15+Math.PI*.7*(index/Math.max(1,count-1));
  return [Math.cos(angle)*spacing*3.4,Math.sin(angle)*spacing*2.7];
 }
 if(id==='flank'){
  const side=index%2===0?-1:1;
  return [side*(spacing*2.3+Math.floor(index/2)*spacing*.25),Math.floor(index/2)*spacing];
 }
 if(id==='shield_wall')return [(index%7-3)*spacing*.85,(Math.floor(index/7)-.5)*spacing*.75];
 return [(col-2)*spacing,(row-1)*spacing];
}

export class ThreeBattleScene {
 constructor(canvas,config={}) {
  this.isThreeBattle=true;this.canvas=canvas;this.modelsReady=false;this.loadingStatus='Loading 3D regional armies';
  let probeSoftware=false;
  try{
   const probe=document.createElement('canvas').getContext('webgl2');
   if(probe){
    const dbg=probe.getExtension('WEBGL_debug_renderer_info');
    const str=String((dbg&&probe.getParameter(dbg.UNMASKED_RENDERER_WEBGL))||probe.getParameter(probe.RENDERER)||'');
    probeSoftware=/SwiftShader|llvmpipe|softpipe|Software|Basic Render|Mesa/i.test(str);
    probe.getExtension('WEBGL_lose_context')?.loseContext();
   }
  }catch{}
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:!probeSoftware,alpha:false,powerPreference:'high-performance'});
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.42;
  this.gl=this.renderer.getContext();
  let rendererStr='';
  try{
   const dbg=this.gl?.getExtension?.('WEBGL_debug_renderer_info');
   rendererStr=String((dbg&&this.gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))||this.gl?.getParameter?.(this.gl.RENDERER)||'');
  }catch{}
  this.isSoftwareGl=probeSoftware||/SwiftShader|llvmpipe|softpipe|Software|Basic Render|Mesa/i.test(rendererStr);
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x9da9a0);
  this.scene.fog=new THREE.FogExp2(0x9da9a0,.0034);
  this.camera=new THREE.PerspectiveCamera(60,1,.5,340);
  this.scene.add(new THREE.HemisphereLight(0xd9e5da,0x51452f,2.05));
  const sunlight=new THREE.DirectionalLight(0xffe8b8,2.25);sunlight.position.set(-35,70,55);this.scene.add(sunlight);
  const rimLight=new THREE.DirectionalLight(0xa7c5d9,0.55);rimLight.position.set(42,30,-52);this.scene.add(rimLight);
  this.batches={};this.tmp=new THREE.Object3D();this.color=new THREE.Color();
  this._sharedHorse=createSharedHorseAssets();
  this._sharedAssets=new Set([...Object.values(this._sharedHorse.geo),...Object.values(this._sharedHorse.mat)]);
  this.frameBudget=createFrameBudgetMonitor(60);
  for(const [kind,make] of Object.entries(meshes)){
   const inst=new THREE.InstancedMesh(make(),new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide}),9000);
   inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);inst.frustumCulled=false;inst.count=0;this.scene.add(inst);this.batches[kind]=inst;
  }
  const reqQuality=GRAPHICS_PRESETS[config.graphicsQuality]?config.graphicsQuality:'medium';
  this.groups=new Map();this.templates={};this.regionalTemplates={};this.siegeTemplates={};this.envGroup=null;this.siegeProps=null;this.siegeReady=false;this.graphicsQuality=this.isSoftwareGl?'low':reqQuality;this.regionalRealms={attacker:config.attackerRealm,defender:config.defenderRealm};this.mixers=[];this.disposed=false;this.lastRenderTime=0;
  this.terrainType=String(config.terrain||'plains').toLowerCase();
  this.environment=buildMedievalBattlefield(this.scene,config);if(config.fieldBattle||config.siegeMode){applyFieldAtmosphere(this.scene,this.renderer,config.biome);suppressFortScenery(this.environment);}
  this.commanderAuras=this._createCommanderAuras();
  this.riverGroup=this.terrainType==='river'?this._createRiverVisual():null;
  this.prepareCharacters();
 }
 _createCommanderAuras(){
  const make=(hex)=>{
   const grp=new THREE.Group();
   const ring=new THREE.Mesh(new THREE.RingGeometry(2.5,3.25,28),new THREE.MeshBasicMaterial({color:hex,side:THREE.DoubleSide,transparent:true,opacity:0.55}));
   ring.rotation.x=-Math.PI/2;ring.position.y=0.18;grp.add(ring);
   const outer=new THREE.Mesh(new THREE.RingGeometry(14.5,15.2,40),new THREE.MeshBasicMaterial({color:hex,side:THREE.DoubleSide,transparent:true,opacity:0.18}));
   outer.rotation.x=-Math.PI/2;outer.position.y=0.14;grp.add(outer);
   const crown=new THREE.Mesh(new THREE.OctahedronGeometry(0.55,0),new THREE.MeshLambertMaterial({color:hex,emissive:hex,emissiveIntensity:0.35}));
   crown.position.y=5.8;grp.add(crown);
   grp.visible=false;
   this.scene.add(grp);
   return {grp,ring,outer,crown};
  };
  return {attacker:make(0xf3d69b),defender:make(0xe36b58)};
 }
 _createRiverVisual(){
  const g=new THREE.Group();g.name='River Crossing';
  const water=new THREE.Mesh(new THREE.PlaneGeometry(340,9.2),new THREE.MeshLambertMaterial({color:0x366982,transparent:true,opacity:0.78,side:THREE.DoubleSide}));
  water.rotation.x=-Math.PI/2;water.position.y=-0.12;g.add(water);
  const fordMat=new THREE.MeshLambertMaterial({color:0x8e836e});
  const fordGeo=new THREE.BoxGeometry(7.5,0.22,9.6);
  for(const fx of [-22,0,22]){
   const slab=new THREE.Mesh(fordGeo,fordMat);
   slab.position.set(fx,-0.16,0);g.add(slab);
  }
  this.scene.add(g);
  return g;
 }
 setGraphicsQuality(level){
  if(!GRAPHICS_PRESETS[level])return this.graphicsQuality;
  this.graphicsQuality=level;
  if(this.envGroup)this.envGroup.visible=level!=='low';
  return level;
 }
 async _loadEnvironmentProps(loader,manifest){
  const roles=manifest?.families?.environment?.roles;
  if(!roles||this.disposed)return;
  const terrain=String(this.terrainType||'plains').toLowerCase();
  const atkFam=detailedRegionalFamilyForRealm(this.regionalRealms.attacker);
  const treeKey=terrain==='desert'||atkFam==='africa'||atkFam==='ottoman'?'tree_palm_date':atkFam==='north_india'||atkFam==='south_india'||atkFam==='southeast_asia'?'tree_banyan':atkFam==='china'||atkFam==='japan'?'tree_bamboo':terrain==='forest'||terrain==='mountain'||terrain==='hills'?'tree_pine':'tree_oak';
  const rockKey=terrain==='desert'?'rock_desert':terrain==='hills'||terrain==='mountain'?'rock_highland':terrain==='coastal'?'rock_shore':'rock_gray';
  const tentKey=atkFam==='persia'||atkFam==='ottoman'||atkFam==='steppe'?'tent_arab':atkFam==='africa'?'tent_kush':'tent_big';
  const picks=[['tree',roles[treeKey]?.path||roles.tree_oak?.path],['bush',roles.bush_scrub?.path],['rock',roles[rockKey]?.path||roles.rock_gray?.path],['tent',roles[tentKey]?.path||roles.tent_big?.path]].filter(([,p])=>p);
  const loaded=await Promise.allSettled(picks.map(([,p])=>loader.loadAsync(p)));
  if(this.disposed)return;
  const templates={};
  picks.forEach(([k],i)=>{if(loaded[i].status==='fulfilled'&&loaded[i].value?.scene)templates[k]=loaded[i].value.scene;});
  if(!Object.keys(templates).length)return;
  this._envTemplates=templates;
  const envGroup=new THREE.Group();envGroup.name='0 A.D. Environment Props';
  const density=GRAPHICS_PRESETS[this.graphicsQuality]?.propDensity??0.8;
  const place=(tpl,x,z,targetH,rotY=0)=>{
   if(!tpl)return;
   const obj=tpl.clone(true);
   const box=new THREE.Box3().setFromObject(obj);
   const h=Math.max(0.2,box.max.y-box.min.y);
   const s=targetH/h;
   obj.scale.setScalar(s);
   const y=terrainHeight(x,z,terrain)-box.min.y*s;
   obj.position.set(x,y,z);obj.rotation.y=rotY;
   envGroup.add(obj);
  };
  const covers=terrainForestCovers(terrain);
  for(const g of covers){
   const nTrees=Math.max(2,Math.round(5*density*(g.density||0.8)));
   for(let i=0;i<nTrees;i++){
    const a=i*Math.PI*2/nTrees+0.3,r=g.radius*(0.28+0.5*(i%2));
    place(templates.tree,g.x+Math.cos(a)*r,g.z+Math.sin(a)*r,5.2+(i%3)*1.1,a);
   }
   if(templates.bush)place(templates.bush,g.x+1.5,g.z-1.2,1.6,0.8);
  }
  const rockSpots=[[-46,-20],[48,18],[-52,22],[50,-26],[0,-48],[-44,44],[44,-44]];
  for(let i=0;i<Math.ceil(rockSpots.length*density);i++){
   const [rx,rz]=rockSpots[i];
   place(templates.rock,rx,rz,1.8+(i%3)*0.6,i*0.9);
  }
  for(const [tx,tz,rot] of [[-48,48,0],[46,48,-0.4],[-48,-48,Math.PI],[46,-48,Math.PI-0.4]]){
   place(templates.tent,tx,tz,3.6,rot);
  }
  this.envGroup=envGroup;
  this.envGroup.visible=this.graphicsQuality!=='low';
  this.scene.add(envGroup);
 }
 async prepareCharacters(){
  const loader=new GLTFLoader();
  try{
   await MeshoptDecoder.ready;
   loader.setMeshoptDecoder(MeshoptDecoder);
  }catch(e){console.warn('MeshoptDecoder init warning:',e);}
  this.regionalTemplates={};
  try{
   const [knight,rogue]=await Promise.all([
    loader.loadAsync('assets/battle/characters/Knight.glb'),
    loader.loadAsync('assets/battle/characters/Rogue_Hooded.glb')
   ]);
   if(this.disposed)return;
   this.templates={infantry:knight,archers:rogue};
   try{
    const mRes=await fetch('assets/battle/0ad/manifest.json');
    if(mRes.ok){
     const manifest=await mRes.json();
     this.manifest=manifest;
     const needed=new Set();
     for(const r of [this.regionalRealms.attacker,this.regionalRealms.defender]){
      const f=detailedRegionalFamilyForRealm(r);
      needed.add(f);
      needed.add(regionalAliasFallback(f));
     }
     for(const fam of needed){
      const roles=manifest?.families?.[fam]?.roles;
      if(!roles)continue;
      this.regionalTemplates[fam]={};
      const uniquePaths=new Map();
      for(const [role,entry] of Object.entries(roles)){
       if(role.startsWith('siege_'))continue;
       if(!uniquePaths.has(entry.path))uniquePaths.set(entry.path,{entry,roles:[role]});
       else uniquePaths.get(entry.path).roles.push(role);
      }
      const loaded=await Promise.allSettled([...uniquePaths.keys()].map(p=>loader.loadAsync(p)));
      if(this.disposed)return;
      let idx=0;
      for(const [,info] of uniquePaths.entries()){
       const r=loaded[idx++];
       if(r.status==='fulfilled'){
        const val={...r.value,_mountedModel:!!info.entry.mounted,_assetId:info.entry.assetId};
        for(const role of info.roles)this.regionalTemplates[fam][role]=val;
       }
      }
     }
     this._loadEnvironmentProps(loader,manifest).catch(()=>{});
     const defFam=regionalFamilyForRealm(this.regionalRealms.defender);
     const atkFam=regionalFamilyForRealm(this.regionalRealms.attacker);
     const siegeKeys=[
      ['gate',[manifest?.families?.[defFam]?.roles?.siege_gate?.path,manifest?.families?.europe?.roles?.siege_gate?.path,'assets/battle/kenney/gate.glb']],
      ['wall',[manifest?.families?.[defFam]?.roles?.siege_wall?.path,manifest?.families?.europe?.roles?.siege_wall?.path,'assets/battle/kenney/wall.glb']],
      ['tower',[manifest?.families?.[defFam]?.roles?.siege_tower?.path,manifest?.families?.europe?.roles?.siege_tower?.path,'assets/battle/kenney/tower-square-base.glb']],
      ['ram',[manifest?.families?.[atkFam]?.roles?.siege_ram?.path,manifest?.families?.europe?.roles?.siege_ram?.path,'assets/battle/kenney/siege-catapult.glb']],
      ['catapult',[manifest?.families?.[atkFam]?.roles?.siege_catapult?.path,manifest?.families?.europe?.roles?.siege_catapult?.path,'assets/battle/kenney/siege-catapult.glb']]
     ];
     await Promise.all(siegeKeys.map(async([key,paths])=>{
      for(const p of paths.filter(Boolean)){
       try{
        const res=await loader.loadAsync(p);
        if(!this.disposed&&res?.scene){this.siegeTemplates[key]=res;break;}
       }catch{}
      }
     }));
     this.siegeReady=Boolean(this.siegeTemplates.gate||this.siegeTemplates.wall||this.siegeTemplates.tower);
    }
   }catch(e){console.warn('0 A.D. manifest load fallback:',e);}
   if(Object.values(this.regionalRealms).includes('ashikaga')){const optional=await Promise.allSettled([loader.loadAsync('assets/characters_3d/ashigaru-foot-soldier-806707.glb'),loader.loadAsync('assets/characters_3d/daimyo-lord-78364a.glb')]);if(this.disposed)return;for(const [i,key] of ['ashigaru','daimyo'].entries())if(optional[i].status==='fulfilled')this.templates[key]=optional[i].value;}
   this.modelsReady=true;this.loadingStatus='Animated 3D armies ready (0 A.D. & KayKit)';
  }catch(err){
   this.modelsReady=false;this.loadingStatus='Using geometric soldiers: '+String(err);
   console.warn('3D character assets unavailable; keeping procedural soldiers',err);
  }
 }
 _resolveTemplate(g,i){
  const realm=this.regionalRealms[g.side];
  const fam=detailedRegionalFamilyForRealm(realm);
  const reg=this.regionalTemplates?.[fam]||this.regionalTemplates?.[regionalAliasFallback(fam)];
  if(fam==='japan'&&g.type==='infantry'&&!(g.specialistId==='pikes'||g.specialistId==='spearmen')){
   const jTpl=(i===0&&g.id.endsWith('0')&&this.templates.daimyo)||this.templates.ashigaru;
   if(jTpl)return jTpl;
  }
  if(reg){
   const spec=g.specialistId||g.kind||g.type;
   if((spec==='elephants'||g.kind==='elephants')&&reg.elephants)return reg.elephants;
   if(i===0&&(g.isCommander||g.id.endsWith('0'))&&reg.commander)return reg.commander;
   if((spec==='horsebow'||g.kind==='horsebow')&&reg.horsebow)return reg.horsebow;
   if(g.type==='cavalry'&&reg.cavalry)return reg.cavalry;
   if((spec==='crossbow'||g.kind==='crossbow'||spec==='handgun')&&(reg[spec]||reg.crossbow))return reg[spec]||reg.crossbow;
   if(g.type==='archers'&&reg.archers)return reg.archers;
   if((spec==='pikes'||spec==='spearmen'||g.kind==='pikemen')&&(reg.pikes||reg.spearmen))return reg.pikes||reg.spearmen;
   if((spec==='guard'||spec==='heavy_infantry')&&(reg[spec]||reg.heavy_infantry||reg.guard))return reg[spec]||reg.heavy_infantry||reg.guard;
   if(reg.infantry)return reg.infantry;
  }
  return this.templates[g.type]||this.templates.infantry;
 }
 prepareSquad(g){
  if(this.groups.has(g.id)||!this.modelsReady)return;
  const spec=g.specialistId||g.kind||g.type;
  const isElephant=spec==='elephants'||g.kind==='elephants';
  const count=sampledSoldierBudget(g.troopCount||g.troops||100,g.type,this.graphicsQuality,this.isSoftwareGl,isElephant);
  g.regionalFamily=regionalFamilyForRealm(this.regionalRealms[g.side]);
  const units=[];
  for(let i=0;i<count;i++){
   const template=this._resolveTemplate(g,i);
   const rig=cloneSkeleton(template.scene);
   const box=new THREE.Box3().setFromObject(rig);const height=box.max.y-box.min.y||1.7;
   const mounted=g.type==='cavalry';
   const embeddedMount=Boolean(template._mountedModel);
   const targetHeight=isElephant?3.15:embeddedMount?2.35:1.75;
   const scale=targetHeight/height;
   // A wrapper allows the original skeleton to keep its root animation.
   const root=new THREE.Group();
   const scaleMul=(mounted&&!embeddedMount)?.74:1;
   rig.scale.multiplyScalar(scale*scaleMul);
   rig.position.y=((mounted&&!embeddedMount)?.91:0)-box.min.y*scale*scaleMul;
   let mount=null;
   if(mounted&&!embeddedMount){mount=createHorse(this._sharedHorse);root.add(mount.horse);}
   root.add(rig);this.scene.add(root);
   const mixer=new THREE.AnimationMixer(rig);
   const clips=template.animations||[];
   const idle=idleClip(clips),walk=walkClip(clips),run=runClip(clips),attack=g.type==='archers'?bowClip(clips):attackClip(clips),death=deathClip(clips),rally=rallyClip(clips);
   const actions={};
   for(const [name,clip] of [['idle',idle],['walk',walk],['run',run],['attack',attack],['rally',rally]]){
    if(clip){actions[name]=mixer.clipAction(clip);actions[name].loop=THREE.LoopRepeat;}
   }
   if(death){
    actions.death=mixer.clipAction(death);
    actions.death.loop=THREE.LoopOnce;
    actions.death.clampWhenFinished=true;
   }
   const start=actions.idle||actions.walk||actions.attack;if(start)start.play();
   units.push({root,rig,mixer,actions,current:start,mode:'idle',clipState:'idle',phase:i*.19,previous:null,mount,regionalModel:!!(this.regionalTemplates?.[g.regionalFamily]||template._assetId),restYaw:rig.rotation.y,restZ:rig.position.z,wasAlive:false,dyingStarted:false,dyingTimer:0,lodAccum:0});
   this.mixers.push(mixer);
  }
  this.groups.set(g.id,units);
 }
 updateCharacters(groups,dt){
  if(groups?.some(g=>g.fieldOrder))return updateFieldCharacters(this,groups,dt);
  if(!this.modelsReady)return;
  for(const g of groups||[]){
   this.prepareSquad(g);const units=this.groups.get(g.id);if(!units)continue;
   const n=Math.round(units.length*cap(g.life/100,0,1));
   const facing=Math.atan2(g.targetX-g.x,g.targetZ-g.z);
   const moving=Math.hypot(g.targetX-g.x,g.targetZ-g.z)>.7;
   const fighting=g.cooldown>.22&&g.cooldown<.72;
   const mode=fighting?'attack':moving?'walk':'idle';
   const clipState=animationClipState({...g,moving,attackPulse:fighting?0.3:0});
   for(let i=0;i<units.length;i++){
    const u=units[i];u.root.visible=!g.routed&&i<n;
    if(!u.root.visible)continue;
    const spacing=g.type==='archers'?1.08:g.type==='cavalry'?1.8:.92;
    const [dx,dz]=formationPosition(i,units.length,g.formationId,spacing);
    const wy=terrainHeight(g.x+dx,g.z+dz,this.terrainType||'plains');
    u.root.position.set(g.x+dx,wy,g.z+dz);
    u.root.rotation.y=facing+(g.side==='defender'?Math.PI:0);
    if(u.mount)for(let j=0;j<u.mount.legs.length;j++)u.mount.legs[j].rotation.x=moving?Math.sin(elapsedTime(u.phase,u.mixer.time,j))*.36:0;
    if(clipState!==u.clipState||mode!==u.mode){
     const action=u.actions[clipState]||u.actions[mode]||u.actions.walk||u.actions.idle;
     if(action&&action!==u.current){
      action.reset().fadeIn(.14).play();
      u.current?.fadeOut(.14);u.current=action;
     }
     u.mode=mode;u.clipState=clipState;
    }
    u.mixer.update(dt);
   }
  }
 }
 render(objects,camera,groups,elapsed,siege=null,capitalLayout=null){
  if(this.disposed)return null;
  const frameStart=globalThis.performance?.now?.()||0;
  const maxDpr=this.isSoftwareGl?1:(GRAPHICS_PRESETS[this.graphicsQuality]?.pixelRatio||1.25);
  const w=Math.max(this.canvas.clientWidth,1),h=Math.max(this.canvas.clientHeight,1),dpr=Math.min(window.devicePixelRatio||1,maxDpr);
  this.renderer.setPixelRatio(dpr);this.renderer.setSize(w,h,false);
  this.camera.aspect=w/h;this.camera.updateProjectionMatrix();
  this.camera.position.set(...camera.eye);this.camera.lookAt(...camera.target);
  const counts={box:0,cone:0,cylinder:0,sphere:0};
  for(const a of objects){
   const kind=this.batches[a.shape]?a.shape:'box',inst=this.batches[kind],i=counts[kind]++;
   if(i>=inst.instanceMatrix.count)continue;
   this.tmp.position.set(a[0],a[1],a[2]);this.tmp.rotation.set(0,0,0);this.tmp.scale.set(a[3],a[4],a[5]);this.tmp.updateMatrix();
   inst.setMatrixAt(i,this.tmp.matrix);this.color.setRGB(a[6],a[7],a[8],THREE.LinearSRGBColorSpace);inst.setColorAt(i,this.color);
  }
  for(const [kind,inst] of Object.entries(this.batches)){
   inst.count=Math.min(counts[kind],inst.instanceMatrix.count);
   inst.instanceMatrix.needsUpdate=true;
   if(inst.instanceColor)inst.instanceColor.needsUpdate=true;
  }
  if(this.commanderAuras){
   for(const side of ['attacker','defender']){
    const aura=this.commanderAuras[side];
    const cmd=(groups||[]).find(g=>g.side===side&&g.isCommander&&!g.routed&&(g.life??100)>0);
    if(aura&&cmd){
     const gy=terrainHeight(cmd.x,cmd.z,this.terrainType||'plains');
     aura.grp.visible=true;
     aura.grp.position.set(cmd.x,gy,cmd.z);
     const pulse=1+Math.sin(elapsed*3.2)*0.08;
     aura.ring.scale.set(pulse,pulse,1);
     aura.crown.rotation.y=elapsed*1.6;
     aura.crown.position.y=5.6+Math.sin(elapsed*2.4)*0.22;
    }else if(aura){
     aura.grp.visible=false;
    }
   }
  }
  let dt=elapsed-this.lastRenderTime;this.lastRenderTime=elapsed;
  this.updateCharacters(groups,cap(dt,0,.05));
  this.updateSiegeVisuals(siege,capitalLayout,groups,elapsed);
  this.environment?.update(elapsed);
  this.renderer.render(this.scene,this.camera);
  if(frameStart)this.frameBudget?.record((globalThis.performance?.now?.()||frameStart)-frameStart);
  return null;
 }
 _buildCapitalCompound(b,x,z,y){
  const grp=new THREE.Group();
  const isFort=b.effect==='defense'||b.key==='citadel'||b.key==='fort'||b.key==='watchtower';
  const isPalace=b.key==='palace'||b.key==='town'||b.key==='cathedral'||b.key==='temple';
  const damaged=Boolean(b.damaged);
  const wallMat=new THREE.MeshLambertMaterial({color:damaged?0x5a4c42:(isPalace?0xd6c7a8:isFort?0x8a877d:0xb6a388)});
  const roofMat=new THREE.MeshLambertMaterial({color:damaged?0x3a261e:(isPalace?0xc49a45:isFort?0x5c5b55:0x8e4a38)});
  const w=isPalace?4.6:isFort?3.6:3.0,h=(isPalace?4.8+Math.min(2.5,b.level*.28):isFort?5.6+Math.min(2.5,b.level*.25):2.6+Math.min(2.0,b.level*.22))*(damaged?0.68:1);
  const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,w*0.86),wallMat);
  body.position.y=h/2;grp.add(body);
  const roof=isPalace
   ?new THREE.Mesh(new THREE.ConeGeometry(w*0.72,2.4,6),roofMat)
   :isFort
    ?new THREE.Mesh(new THREE.BoxGeometry(w+0.35,0.65,w*0.86+0.35),roofMat)
    :new THREE.Mesh(new THREE.ConeGeometry(w*0.76,1.6,4),roofMat);
  roof.position.y=h+(isFort?0.32:isPalace?1.2:0.8);
  if(!isFort&&!isPalace)roof.rotation.y=Math.PI/4;
  if(damaged)roof.rotation.z=0.14;
  grp.add(roof);
  grp.position.set(x,y,z);
  return {node:grp,baseY:y,isDef:isFort,damaged,baseScale:1};
 }
 updateSiegeVisuals(siege,capitalLayout,groups,elapsed){
  if(!siege||!this.siegeReady||this.disposed)return;
  const terrain=this.terrainType||'plains';
  if(!this.siegeProps){
   const g=new THREE.Group();g.name='3D Siege Fortifications';this.scene.add(g);
   const fitMesh=(tpl,targetH,x,z,rotY=0)=>{
    if(!tpl?.scene)return null;
    const node=tpl.scene.clone(true);
    const box=new THREE.Box3().setFromObject(node);
    const h=Math.max(0.1,box.max.y-box.min.y);
    const s=targetH/h;
    const gy=terrainHeight(x,z,terrain);
    node.scale.setScalar(s);
    node.position.set(x,gy-box.min.y*s,z);
    node.rotation.y=rotY;
    g.add(node);
    return {node,baseY:gy-box.min.y*s,baseScale:s};
   };
   const structures=new Map();
   const rubble=new Map();
   const rubbleGeo=new THREE.DodecahedronGeometry(1.15,0);
   const rubbleMat=new THREE.MeshLambertMaterial({color:0x665e53});
   const emberMat=new THREE.MeshBasicMaterial({color:0xe57a35});
   for(const st of siege.structures||[]){
    const tpl=st.id==='gate'?this.siegeTemplates.gate||this.siegeTemplates.wall:this.siegeTemplates.tower||this.siegeTemplates.wall;
    const targetH=st.id==='gate'?9.2:10.8;
    const item=fitMesh(tpl,targetH,st.x,st.z,0);
    if(item)structures.set(st.id,item);
    // Pre-built breach debris cluster hidden until structure collapses
    const rGrp=new THREE.Group();
    const gy=terrainHeight(st.x,st.z,terrain);
    for(let k=0;k<5;k++){
     const rock=new THREE.Mesh(rubbleGeo,rubbleMat);
     const a=k*1.25;
     rock.position.set(Math.cos(a)*2.4,0.4+(k%2)*0.3,Math.sin(a)*1.4);
     rock.scale.set(0.9+(k%3)*0.35,0.55+(k%2)*0.3,0.9);
     rGrp.add(rock);
    }
    const ember=new THREE.Mesh(rubbleGeo,emberMat);
    ember.scale.set(0.55,0.3,0.55);ember.position.set(0.4,0.35,0.2);
    rGrp.add(ember);
    rGrp.position.set(st.x,gy,st.z);
    rGrp.visible=false;
    g.add(rGrp);
    rubble.set(st.id,{grp:rGrp,ember});
   }
   for(const wx of [-36,-13,13,36]){
    fitMesh(this.siegeTemplates.wall||this.siegeTemplates.tower,6.8,wx,-18,0);
   }
   const engines=[];
   const atkEng=siege.assaultSide==='defender'?siege.defenderEngines:siege.attackerEngines;
   const ramCount=Math.min(2,atkEng?.ram||0);
   for(let i=0;i<ramCount;i++){
    const item=fitMesh(this.siegeTemplates.ram,3.2,(i-0.5)*11+(ramCount===1?5.5:0),6,Math.PI);
    if(item)engines.push({kind:'ram',item,baseZ:6});
   }
   const catCount=Math.min(2,(atkEng?.catapult||0)+(atkEng?.bombard||0));
   for(let i=0;i<catCount;i++){
    const item=fitMesh(this.siegeTemplates.catapult,3.4,i===0?-16:16,14,Math.PI);
    if(item)engines.push({kind:'catapult',item,baseZ:14});
   }
   // Represent defender's full Hometown 64-plot capital structures 1:1 behind the rampart.
   const capitalBuildings=[];
   if(capitalLayout?.buildings?.length){
    for(const b of capitalLayout.buildings.slice(0,64)){
     const bx=cap(b.x,-36,36),bz=cap(b.z,-66,-25),by=terrainHeight(bx,bz,terrain);
     const comp=this._buildCapitalCompound(b,bx,bz,by);
     g.add(comp.node);
     capitalBuildings.push(comp);
    }
   }
   this.siegeProps={group:g,structures,rubble,engines,capitalBuildings};
  }
  for(const st of siege.structures||[]){
   const item=this.siegeProps.structures.get(st.id);
   const deb=this.siegeProps.rubble?.get(st.id);
   if(!item)continue;
   const ratio=st.max>0?cap(st.hp/st.max,0,1):0;
   if(ratio<=0){
    // Collapse tower / sink gate leaves so the breach gap is visibly passable.
    item.node.scale.set(item.baseScale,item.baseScale*0.14,item.baseScale);
    item.node.position.y=item.baseY-0.7;
    item.node.rotation.z=st.id==='gate'?0:(st.id==='left'?-0.24:0.24);
    if(deb){
     deb.grp.visible=true;
     deb.ember.scale.setScalar(0.45+Math.abs(Math.sin(elapsed*4.2))*0.28);
    }
   }else{
    item.node.scale.set(item.baseScale,item.baseScale*(0.55+0.45*ratio),item.baseScale);
    item.node.position.y=item.baseY;
    item.node.rotation.z=0;
    if(deb)deb.grp.visible=false;
   }
  }
  const breached=siege.structures?.[0]?.hp<=0;
  for(const eng of this.siegeProps.engines){
   if(eng.kind==='ram'){
    const targetZ=breached?-22:-13.5;
    const front=(groups||[]).filter(u=>u.side===siege.assaultSide&&!u.routed).sort((a,b)=>a.z-b.z)[0];
    const desired=front?cap(front.z-1.5,targetZ,8):-8;
    eng.item.node.position.z+=(desired-eng.item.node.position.z)*0.08;
    // Rhythmic ramming thrust when engaging the gate
    if(!breached&&eng.item.node.position.z<-11.5){
     const thrust=Math.pow(Math.max(0,Math.sin(elapsed*2.6)),4)*1.15;
     eng.item.node.position.z-=thrust*0.18;
    }
   }else{
    // Catapult / bombard recoil cadence
    const cycle=elapsed*1.4;
    const recoil=Math.pow(Math.max(0,Math.sin(cycle)),8);
    eng.item.node.position.y=eng.item.baseY+recoil*0.24;
    eng.item.node.position.z=eng.baseZ+recoil*0.45;
   }
  }
 }
 dispose(){
  this.disposed=true;
  disposeFieldMaterials(this);
  for(const units of this.groups.values()){
   for(const u of units){
    u.mixer?.stopAllAction?.();
    if(u.rig)u.mixer?.uncacheRoot?.(u.rig);
    this.scene.remove(u.root);
    disposeThreeObject(u.root,this._sharedAssets);
   }
  }
  this.groups.clear();this.mixers.length=0;
  if(this._sharedHorse){
   for(const g of Object.values(this._sharedHorse.geo))g.dispose?.();
   for(const m of Object.values(this._sharedHorse.mat))m.dispose?.();
   this._sharedHorse=null;
  }
  this._sharedAssets?.clear?.();
  if(this.envGroup){this.scene.remove(this.envGroup);disposeThreeObject(this.envGroup);this.envGroup=null;}
  if(this.siegeProps?.group){this.scene.remove(this.siegeProps.group);disposeThreeObject(this.siegeProps.group);this.siegeProps=null;}
  if(this.riverGroup){this.scene.remove(this.riverGroup);disposeThreeObject(this.riverGroup);this.riverGroup=null;}
  if(this.commanderAuras){
   for(const a of Object.values(this.commanderAuras)){this.scene.remove(a.grp);disposeThreeObject(a.grp);}
   this.commanderAuras=null;
  }
  if(this._envTemplates){for(const t of Object.values(this._envTemplates))disposeThreeObject(t);this._envTemplates=null;}
  for(const t of Object.values(this.templates||{}))disposeThreeObject(t?.scene);
  for(const fam of Object.values(this.regionalTemplates||{}))for(const t of Object.values(fam||{}))disposeThreeObject(t?.scene);
  for(const t of Object.values(this.siegeTemplates||{}))disposeThreeObject(t?.scene);
  this.templates={};this.regionalTemplates={};this.siegeTemplates={};
  this.environment?.dispose?.();
  for(const m of Object.values(this.batches)){m.geometry?.dispose?.();m.material?.dispose?.();this.scene.remove(m);}
  this.batches={};
  this.renderer.renderLists?.dispose?.();
  this.renderer.dispose?.();
 }
}