import {disposeFieldMaterials} from './field-visuals.js';
import {suppressFortScenery} from './field-scenery.js';
import {applyFieldAtmosphere} from './field-atmosphere.js';
import {updateFieldCharacters} from './battle-presentation.js';
import {terrainHeight,terrainForestCovers} from './field-tactics.js';
/**
 * Sovereign 1450 — Three.js 3D battle renderer with cleared 0 A.D. (CC BY-SA 3.0),
 * Polyfork (MIT/CC0) and KayKit (CC0) regional armies, mounts, and 3D flora/rocks.
 * Bundled locally by scripts/build_3d_battle.mjs. No runtime CDN dependence.
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
const idleClip=clips=>clips.find(c=>/^(Idle_A|idle)$/i.test(c.name))||clips.find(c=>/idle/i.test(c.name))||clips[0];
const attackClip=clips=>clips.find(c=>/^(attack_melee|1H_Melee_Attack_Slice)$/i.test(c.name))||clips.find(c=>/melee.*attack|attack.*slash|attack_melee/i.test(c.name))||clips.find(c=>/attack/i.test(c.name));
const bowClip=clips=>clips.find(c=>/^attack_ranged$/i.test(c.name))||clips.find(c=>/bow.*(shoot|release)/i.test(c.name))||clips.find(c=>/shoot.*bow|archery|attack_ranged/i.test(c.name))||attackClip(clips);
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


/** Simple authored procedural mount until a properly rigged horse is integrated. */
function createHorse(){
 const horse=new THREE.Group();
 const fur=new THREE.MeshLambertMaterial({color:0x775136});
 const mane=new THREE.MeshLambertMaterial({color:0x382d29});
 const saddle=new THREE.MeshLambertMaterial({color:0x594137});
 const shape=(geometry,material,x,y,z,sx,sy,sz)=>{
  const item=new THREE.Mesh(geometry,material);item.position.set(x,y,z);item.scale.set(sx,sy,sz);horse.add(item);return item;
 };
 shape(new THREE.SphereGeometry(.5,9,7),fur,0,.88,0,.78,.64,1.30);
 const neck=shape(new THREE.CylinderGeometry(.22,.31,1,7),fur,0,1.20,.52,.9,1,.9);
 neck.rotation.x=-.50;
 shape(new THREE.BoxGeometry(1,1,1),fur,0,1.52,.80,.34,.42,.61);
 shape(new THREE.BoxGeometry(1,1,1),mane,0,1.42,.50,.42,.32,.14);
 shape(new THREE.BoxGeometry(1,1,1),saddle,0,1.23,-.12,.70,.22,.56);
 const legs=[];
 for(const x of [-.30,.30])for(const z of [-.47,.47]){
  const joint=new THREE.Group();joint.position.set(x,.57,z);horse.add(joint);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.10,.08,.70,6),fur);
  leg.position.y=-.31;joint.add(leg);
  const hoof=new THREE.Mesh(new THREE.BoxGeometry(.19,.14,.27),mane);
  hoof.position.set(0,-.69,.07);joint.add(hoof);legs.push(joint);
 }
 const tail=shape(new THREE.ConeGeometry(.17,.63,6),mane,0,.93,-.83,.85,1,1);
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
 if(id==='longbow_line'||id==='volley_line')return [(index-(count-1)/2)*spacing*.84,0];
 if(id==='pike_square'){
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
  this.isThreeBattle=true;this.canvas=canvas;this.modelsReady=false;this.loadingStatus='Loading KayKit infantry';
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.45;
  this.gl=this.renderer.getContext();
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x9da9a0);
  this.scene.fog=new THREE.FogExp2(0x9da9a0,.0035);
  this.camera=new THREE.PerspectiveCamera(60,1,.5,330);
  this.scene.add(new THREE.HemisphereLight(0xd9e5da,0x51452f,2.15));
  const sunlight=new THREE.DirectionalLight(0xffe9bd,2.3);sunlight.position.set(-35,70,55);this.scene.add(sunlight);
  this.batches={};this.tmp=new THREE.Object3D();this.color=new THREE.Color();
  for(const [kind,make] of Object.entries(meshes)){
   const inst=new THREE.InstancedMesh(make(),new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide}),9000);
   inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);inst.frustumCulled=false;inst.count=0;this.scene.add(inst);this.batches[kind]=inst;
  }
  this.groups=new Map();this.templates={};this.siegeTemplates={};this.envGroup=null;this.siegeProps=null;this.siegeReady=false;this.graphicsQuality=GRAPHICS_PRESETS[config.graphicsQuality]?config.graphicsQuality:'medium';this.regionalRealms={attacker:config.attackerRealm,defender:config.defenderRealm};this.mixers=[];this.disposed=false;this.lastRenderTime=0;
  this.environment=buildMedievalBattlefield(this.scene,config);if(config.fieldBattle||config.siegeMode){applyFieldAtmosphere(this.scene,this.renderer,config.biome);suppressFortScenery(this.environment);}
  this.prepareCharacters();
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
   if(i===0&&g.id.endsWith('0')&&reg.commander)return reg.commander;
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
  const sMul=GRAPHICS_PRESETS[this.graphicsQuality]?.soldierScale??1;
  const baseCount=isElephant?3:g.type==='archers'?8:g.type==='cavalry'?6:11;
  const count=Math.max(isElephant?2:4,Math.round(baseCount*sMul));
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
   if(mounted&&!embeddedMount){mount=createHorse();root.add(mount.horse);}
   root.add(rig);this.scene.add(root);
   const mixer=new THREE.AnimationMixer(rig);
   const idle=idleClip(template.animations),walk=walkClip(template.animations),attack=g.type==='archers'?bowClip(template.animations):attackClip(template.animations);
   const actions={};
   for(const [name,clip] of [['idle',idle],['walk',walk],['attack',attack]])if(clip){actions[name]=mixer.clipAction(clip);actions[name].loop=THREE.LoopRepeat;}
   const start=actions.idle||actions.walk||actions.attack;if(start)start.play();
   units.push({root,rig,mixer,actions,current:start,mode:'idle',phase:i*.19,previous:null,mount,regionalModel:!!(this.regionalTemplates?.[regionalFamilyForRealm(this.regionalRealms[g.side])]||template._assetId),restYaw:rig.rotation.y,restZ:rig.position.z});
   this.mixers.push(mixer);
  }
  this.groups.set(g.id,units);
 }
 updateCharacters(groups,dt){
  if(groups?.some(g=>g.fieldOrder))return updateFieldCharacters(this,groups,dt);
  if(!this.modelsReady)return;
  for(const g of groups||[]){
   this.prepareSquad(g);const units=this.groups.get(g.id);if(!units)continue;
   const n=Math.round(units.length*cap(g.life/100,0,1));const cols=g.type==='archers'?4:g.type==='cavalry'?3:5;
   const facing=Math.atan2(g.targetX-g.x,g.targetZ-g.z);
   const moving=Math.hypot(g.targetX-g.x,g.targetZ-g.z)>.7;
   const fighting=g.cooldown>.22&&g.cooldown<.72;
   const mode=fighting?'attack':moving?'walk':'idle';
   for(let i=0;i<units.length;i++){
    const u=units[i];u.root.visible=!g.routed&&i<n;
    if(!u.root.visible)continue;
    const spacing=g.type==='archers'?1.08:g.type==='cavalry'?1.8:.92;
    const [dx,dz]=formationPosition(i,units.length,g.formationId,spacing);
    u.root.position.set(g.x+dx,0,g.z+dz);
    u.root.rotation.y=facing+(g.side==='defender'?Math.PI:0);
    if(u.mount)for(let j=0;j<u.mount.legs.length;j++)u.mount.legs[j].rotation.x=moving?Math.sin(elapsedTime(u.phase,u.mixer.time,j))*.36:0;
    if(mode!==u.mode){
     const action=u.actions[mode]||u.actions.walk||u.actions.idle;
     if(action&&action!==u.current){
      action.reset().fadeIn(.14).play();
      u.current?.fadeOut(.14);u.current=action;
     }
     u.mode=mode;
    }
    u.mixer.update(dt);
   }
  }
 }
 render(objects,camera,groups,elapsed,siege=null,capitalLayout=null){
  if(this.disposed)return null;
  const maxDpr=GRAPHICS_PRESETS[this.graphicsQuality]?.pixelRatio||1.25;
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
  let dt=elapsed-this.lastRenderTime;this.lastRenderTime=elapsed;
  this.updateCharacters(groups,cap(dt,0,.05));
  this.updateSiegeVisuals(siege,capitalLayout,groups,elapsed);
  this.environment?.update(elapsed);
  this.renderer.render(this.scene,this.camera);
  return null;
 }
 updateSiegeVisuals(siege,capitalLayout,groups,elapsed){
  if(!siege||!this.siegeReady||this.disposed)return;
  if(!this.siegeProps){
   const g=new THREE.Group();g.name='3D Siege Fortifications';this.scene.add(g);
   const fitMesh=(tpl,targetH,x,z,rotY=0)=>{
    if(!tpl?.scene)return null;
    const node=tpl.scene.clone(true);
    const box=new THREE.Box3().setFromObject(node);
    const h=Math.max(0.1,box.max.y-box.min.y);
    const s=targetH/h;
    node.scale.setScalar(s);
    node.position.set(x,-box.min.y*s,z);
    node.rotation.y=rotY;
    g.add(node);
    return {node,baseY:-box.min.y*s,baseScale:s};
   };
   const structures=new Map();
   for(const st of siege.structures||[]){
    const tpl=st.id==='gate'?this.siegeTemplates.gate||this.siegeTemplates.wall:this.siegeTemplates.tower||this.siegeTemplates.wall;
    const targetH=st.id==='gate'?9.2:10.8;
    const item=fitMesh(tpl,targetH,st.x,st.z,0);
    if(item)structures.set(st.id,item);
   }
   for(const wx of [-36,-13,13,36]){
    fitMesh(this.siegeTemplates.wall||this.siegeTemplates.tower,6.8,wx,-18,0);
   }
   const engines=[];
   const atkEng=siege.assaultSide==='defender'?siege.defenderEngines:siege.attackerEngines;
   const ramCount=Math.min(2,atkEng?.ram||0);
   for(let i=0;i<ramCount;i++){
    const item=fitMesh(this.siegeTemplates.ram,3.2,(i-0.5)*11+(ramCount===1?5.5:0),6,Math.PI);
    if(item)engines.push({kind:'ram',item});
   }
   const catCount=Math.min(2,(atkEng?.catapult||0)+(atkEng?.bombard||0));
   for(let i=0;i<catCount;i++){
    const item=fitMesh(this.siegeTemplates.catapult,3.4,i===0?-16:16,14,Math.PI);
    if(item)engines.push({kind:'catapult',item});
   }
   // Represent defender's real Hometown buildings behind the rampart.
   if(capitalLayout?.buildings?.length){
    for(const b of capitalLayout.buildings.slice(0,18)){
     const isDef=b.effect==='defense'||b.key==='citadel'||b.key==='fort';
     const tpl=isDef?(this.siegeTemplates.tower||this.siegeTemplates.wall):this.siegeTemplates.wall;
     const h=isDef?7.5:4.2+Math.min(3,b.level*.3);
     fitMesh(tpl,h,cap(b.x,-34,34),cap(b.z,-62,-27),0);
    }
   }
   this.siegeProps={group:g,structures,engines};
  }
  for(const st of siege.structures||[]){
   const item=this.siegeProps.structures.get(st.id);
   if(!item)continue;
   const ratio=st.max>0?cap(st.hp/st.max,0,1):0;
   if(ratio<=0){
    // Collapse tower / sink gate leaves so the breach gap is visibly passable.
    item.node.scale.set(item.baseScale,item.baseScale*0.18,item.baseScale);
    item.node.position.y=item.baseY-0.55;
    item.node.rotation.z=st.id==='gate'?0:(st.id==='left'?-0.22:0.22);
   }else{
    item.node.scale.set(item.baseScale,item.baseScale*(0.55+0.45*ratio),item.baseScale);
    item.node.position.y=item.baseY;
    item.node.rotation.z=0;
   }
  }
  const breached=siege.structures?.[0]?.hp<=0;
  for(const eng of this.siegeProps.engines){
   if(eng.kind==='ram'){
    const targetZ=breached?-22:-13.5;
    const front=(groups||[]).filter(u=>u.side===siege.assaultSide&&!u.routed).sort((a,b)=>a.z-b.z)[0];
    const desired=front?cap(front.z-1.5,targetZ,8):-8;
    eng.item.node.position.z+=(desired-eng.item.node.position.z)*0.08;
   }else{
    eng.item.node.position.y=eng.item.baseY+Math.abs(Math.sin(elapsed*1.8))*0.08;
   }
  }
 }
 dispose(){
  this.disposed=true;disposeFieldMaterials(this);
  for(const units of this.groups.values())for(const u of units){u.mixer.stopAllAction();this.scene.remove(u.root);}
  this.groups.clear();this.mixers.length=0;
  if(this.envGroup){this.scene.remove(this.envGroup);this.envGroup=null;}
  if(this.siegeProps?.group){this.scene.remove(this.siegeProps.group);this.siegeProps=null;}
  this.environment?.dispose();
  for(const m of Object.values(this.batches)){m.geometry.dispose();m.material.dispose();this.scene.remove(m);}
  this.renderer.dispose();
 }
}