/**
 * Crown of Nations — Three.js battle renderer with real KayKit skinned infantry.
 * Bundled locally by scripts/build_3d_battle.mjs. No runtime CDN dependence.
 * Licensed CC0 asset source: KayKit Adventurers 1.0 (characters).
 */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';

const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
const meshes={
 box:()=>new THREE.BoxGeometry(1,1,1),
 cone:()=>new THREE.ConeGeometry(.5,1,8),
 cylinder:()=>new THREE.CylinderGeometry(.5,.5,1,8),
 sphere:()=>new THREE.SphereGeometry(.5,9,7)
};
const walkClip=clips=>clips.find(c=>/^Walking_A$/i.test(c.name))||clips.find(c=>/walk/i.test(c.name))||clips.find(c=>/run/i.test(c.name));
const idleClip=clips=>clips.find(c=>/^Idle_A$/i.test(c.name))||clips.find(c=>/idle/i.test(c.name))||clips[0];
const attackClip=clips=>clips.find(c=>/1H_Melee_Attack_Slice/i.test(c.name))||clips.find(c=>/melee.*attack|attack.*slash/i.test(c.name))||clips.find(c=>/attack/i.test(c.name));
const bowClip=clips=>clips.find(c=>/bow.*(shoot|release)/i.test(c.name))||clips.find(c=>/shoot.*bow|archery/i.test(c.name))||attackClip(clips);

export class ThreeBattleScene {
 constructor(canvas) {
  this.isThreeBattle=true;this.canvas=canvas;this.modelsReady=false;this.loadingStatus='Loading KayKit infantry';
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.45;
  this.gl=this.renderer.getContext();
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x9cafa7);
  this.scene.fog=new THREE.FogExp2(0x9cafa7,.003);
  this.camera=new THREE.PerspectiveCamera(60,1,.5,330);
  this.scene.add(new THREE.HemisphereLight(0xd9e5da,0x51452f,2.15));
  const sunlight=new THREE.DirectionalLight(0xffe9bd,2.3);sunlight.position.set(-35,70,55);this.scene.add(sunlight);
  this.batches={};this.tmp=new THREE.Object3D();this.color=new THREE.Color();
  for(const [kind,make] of Object.entries(meshes)){
   const inst=new THREE.InstancedMesh(make(),new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide}),9000);
   inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);inst.frustumCulled=false;inst.count=0;this.scene.add(inst);this.batches[kind]=inst;
  }
  this.groups=new Map();this.templates={};this.mixers=[];this.disposed=false;this.lastRenderTime=0;
  this.prepareCharacters();
 }
 async prepareCharacters(){
  const loader=new GLTFLoader();
  try{
   const [knight,rogue]=await Promise.all([
    loader.loadAsync('assets/battle/characters/Knight.glb'),
    loader.loadAsync('assets/battle/characters/Rogue_Hooded.glb')
   ]);
   if(this.disposed)return;
   this.templates={infantry:knight,archers:rogue};
   this.modelsReady=true;this.loadingStatus='Animated KayKit infantry ready';
  }catch(err){
   this.modelsReady=false;this.loadingStatus='Using geometric soldiers: '+String(err);
   console.warn('KayKit characters unavailable; keeping procedural soldiers',err);
  }
 }
 prepareSquad(g){
  if(this.groups.has(g.id)||!this.modelsReady||g.type==='cavalry')return;
  const template=this.templates[g.type]||this.templates.infantry;
  const count=g.type==='archers'?8:11;
  const units=[];
  for(let i=0;i<count;i++){
   const rig=cloneSkeleton(template.scene);
   const box=new THREE.Box3().setFromObject(rig);const height=box.max.y-box.min.y||1.7;const scale=1.75/height;
   // A wrapper allows the original skeleton to keep its root animation.
   const root=new THREE.Group();rig.scale.multiplyScalar(scale);rig.position.y=-box.min.y*scale;
   root.add(rig);this.scene.add(root);
   const mixer=new THREE.AnimationMixer(rig);
   const idle=idleClip(template.animations),walk=walkClip(template.animations),attack=g.type==='archers'?bowClip(template.animations):attackClip(template.animations);
   const actions={};
   for(const [name,clip] of [['idle',idle],['walk',walk],['attack',attack]])if(clip){actions[name]=mixer.clipAction(clip);actions[name].loop=THREE.LoopRepeat;}
   const start=actions.idle||actions.walk||actions.attack;if(start)start.play();
   units.push({root,rig,mixer,actions,current:start,mode:'idle',phase:i*.19,previous:null});
   this.mixers.push(mixer);
  }
  this.groups.set(g.id,units);
 }
 updateCharacters(groups,dt){
  if(!this.modelsReady)return;
  for(const g of groups||[]){
   if(g.type==='cavalry')continue;
   this.prepareSquad(g);const units=this.groups.get(g.id);if(!units)continue;
   const n=Math.round(units.length*cap(g.life/100,0,1));const cols=g.type==='archers'?4:5;
   const facing=Math.atan2(g.targetX-g.x,g.targetZ-g.z);
   const moving=Math.hypot(g.targetX-g.x,g.targetZ-g.z)>.7;
   const fighting=g.cooldown>.22&&g.cooldown<.72;
   const mode=fighting?'attack':moving?'walk':'idle';
   for(let i=0;i<units.length;i++){
    const u=units[i];u.root.visible=!g.routed&&i<n;
    if(!u.root.visible)continue;
    const row=Math.floor(i/cols),col=i%cols,spacing=g.type==='archers'?1.08:.92;
    u.root.position.set(g.x+(col-(cols-1)/2)*spacing,0,g.z+(row-1.0)*spacing);
    u.root.rotation.y=facing+(g.side==='defender'?Math.PI:0);
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
 render(objects,camera,groups,elapsed){
  if(this.disposed)return null;
  const w=Math.max(this.canvas.clientWidth,1),h=Math.max(this.canvas.clientHeight,1),dpr=Math.min(window.devicePixelRatio||1,1.5);
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
  this.renderer.render(this.scene,this.camera);
  return null;
 }
 dispose(){
  this.disposed=true;
  for(const units of this.groups.values())for(const u of units){u.mixer.stopAllAction();this.scene.remove(u.root);}
  this.groups.clear();this.mixers.length=0;
  for(const m of Object.values(this.batches)){m.geometry.dispose();m.material.dispose();this.scene.remove(m);}
  this.renderer.dispose();
 }
}