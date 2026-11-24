import {chooseBattleRenderer,freshBattleCanvas,disposeNativeRenderer} from './battle-lifecycle.js';
import {fieldFrameSteps,renderInterval} from './render-performance.js';
import {browserFieldAudio} from './field-audio.js';
import {regimentPalette,projectileTrail,disposeFieldMaterials} from './field-visuals.js';
import {fieldScenery,suppressFortScenery,battleContactShadow} from './field-scenery.js';
import {applyFieldAtmosphere} from './field-atmosphere.js';
import {participatingArmies,aggregateForce,regimentTroops,combinedFieldStats} from './field-forces.js';
import {formationOffsets,soldierWorldPose,visualMode,visibleSoldierCount,updateFieldCharacters,cameraDestination,blendCamera,battleRoster,battleImpactParticles} from './battle-presentation.js';
import {FIELD_ORDERS,initializeFieldGroup,issueFieldOrder,formationMovePoints,fieldTarget,fieldStrength,stepField,coordinateFieldAI} from './field-tactics.js';
import {armyReadiness,regimentProfile,createSiegeState,siegeTarget,siegeDamage,siegeBreached} from './military-systems.js';
/* Native WebGL2 real-time 3D tactical battle, no CDN dependencies. */
import {BattleModelArt} from './glb-art.js';
import {armyFormationSlots,militaryDoctrine,startingTroops,combatStatistics,chooseCounterFormation,availableFormations} from './military-doctrines.js';
import {ThreeBattleScene as BundledBattleScene} from './three-battle.bundle.js';
// The shipped bundle stays self-hosted; field animation uses the shared runtime adapter.
class ThreeBattleScene extends BundledBattleScene{constructor(canvas,config){super(canvas,config);if(config?.fieldBattle){applyFieldAtmosphere(this.scene,this.renderer,config.biome);suppressFortScenery(this.environment);}}updateCharacters(groups,dt){if(groups?.some(g=>g.fieldOrder))return updateFieldCharacters(this,groups,dt);return super.updateCharacters(groups,dt);}dispose(){disposeFieldMaterials(this);return super.dispose();}}
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const vec=(x=0,y=0,z=0)=>[x,y,z];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const d=Math.hypot(...a)||1;return a.map(x=>x/d);};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
const matMul=(a,b)=>{let r=new Float32Array(16);for(let c=0;c<4;c++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)r[c*4+j]+=a[k*4+j]*b[c*4+k];return r;};
const perspective=(fovy,aspect,near,far)=>{let f=1/Math.tan(fovy/2),m=new Float32Array(16);m[0]=f/aspect;m[5]=f;m[10]=(far+near)/(near-far);m[11]=-1;m[14]=2*far*near/(near-far);return m;};
const lookAt=(eye,target)=>{let z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);};
const mix=(a,b,t)=>a+(b-a)*t;
const hexColor=hex=>{let s=hex.replace('#','');return [parseInt(s.slice(0,2),16)/255,parseInt(s.slice(2,4),16)/255,parseInt(s.slice(4,6),16)/255];};
function boxes(){let v=[],ind=[],faces=[
 [[0,0,1],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],
 [[0,0,-1],[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]],
 [[1,0,0],[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5]],
 [[-1,0,0],[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5]],
 [[0,1,0],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]],
 [[0,-1,0],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]]];
 for(let f=0;f<6;f++){for(let j=1;j<5;j++)v.push(...faces[f][j],...faces[f][0]);ind.push(f*4,f*4+1,f*4+2,f*4,f*4+2,f*4+3);}return {v:new Float32Array(v),ind:new Uint16Array(ind)};}
/** Low-poly geometric primitives; all share the same compact instanced attributes. */
function curvedMesh(kind,sides=8){const v=[],idx=[];
 function triangle(a,b,c){const u=sub(b,a),w=sub(c,a),n=norm(cross(u,w)),start=v.length/6;for(const p of [a,b,c])v.push(...p,...n);idx.push(start,start+1,start+2);}
 const ring=(r,y,i)=>[Math.cos(i*TAU/sides)*r,y,Math.sin(i*TAU/sides)*r];
 if(kind==='cone'){for(let i=0;i<sides;i++){triangle(ring(.5,-.5,i+1),ring(.5,-.5,i),[0,.5,0]);triangle([0,-.5,0],ring(.5,-.5,i),ring(.5,-.5,i+1));}}
 else if(kind==='cylinder'){for(let i=0;i<sides;i++){let a=ring(.5,-.5,i),b=ring(.5,-.5,i+1),c=ring(.5,.5,i),d=ring(.5,.5,i+1);triangle(a,c,b);triangle(b,c,d);triangle([0,.5,0],d,c);triangle([0,-.5,0],a,b);}}
 else if(kind==='sphere'){const bands=5;for(let j=0;j<bands;j++){const phi0=Math.PI*j/bands,phi1=Math.PI*(j+1)/bands;const p=(phi,i)=>[Math.sin(phi)*Math.cos(i*TAU/sides)*.5,Math.cos(phi)*.5,Math.sin(phi)*Math.sin(i*TAU/sides)*.5];for(let i=0;i<sides;i++){triangle(p(phi0,i),p(phi1,i),p(phi0,i+1));triangle(p(phi0,i+1),p(phi1,i),p(phi1,i+1));}}}
 return {v:new Float32Array(v),ind:new Uint16Array(idx)};
}
function compile(gl,type,src){let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
class Renderer{
 constructor(canvas){this.canvas=canvas;const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw Error('Your browser requires WebGL2 for the 3D battlefield.');this.gl=gl;
 const vs=`#version 300 es
 precision highp float;
 layout(location=0) in vec3 aPos;layout(location=1) in vec3 aNormal;
 layout(location=2) in vec3 iPos;layout(location=3) in vec3 iScale;layout(location=4) in vec3 iColor;
 uniform mat4 uVP;out vec3 vColor;out float vLight;out float vFog;
 void main(){vec3 p=aPos*iScale+iPos;gl_Position=uVP*vec4(p,1.);vColor=iColor;
 vec3 n=normalize(aNormal);vLight=.58+.42*max(dot(n,normalize(vec3(-.4,.85,.48))),0.);
 vFog=clamp((length(p.xz)-15.)/145.,0.,.4);}`;
 const fs=`#version 300 es
 precision mediump float;in vec3 vColor;in float vLight;in float vFog;out vec4 frag;
 void main(){vec3 col=mix(vColor*vLight,vec3(.35,.39,.34),vFog);frag=vec4(pow(col,vec3(.94)),1.);}`;
 let p=gl.createProgram();const vert=compile(gl,gl.VERTEX_SHADER,vs),frag=compile(gl,gl.FRAGMENT_SHADER,fs);gl.attachShader(p,vert);gl.attachShader(p,frag);gl.linkProgram(p);gl.deleteShader(vert);gl.deleteShader(frag);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const error=gl.getProgramInfoLog(p);gl.deleteProgram(p);throw Error(error);}gl.useProgram(p);this.program=p;this.loc=gl.getUniformLocation(p,'uVP');
 this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,9*4*6000,gl.DYNAMIC_DRAW);
 this.meshes={};for(const [kind,geom] of Object.entries({box:boxes(),cone:curvedMesh('cone'),cylinder:curvedMesh('cylinder'),sphere:curvedMesh('sphere')})){
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,geom.v,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geom.ind,gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);for(let j=0;j<3;j++){gl.enableVertexAttribArray(2+j);gl.vertexAttribPointer(2+j,3,gl.FLOAT,false,36,j*12);gl.vertexAttribDivisor(2+j,1);}
  this.meshes[kind]={vao,ib,vb,count:geom.ind.length};
 }
 gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(.65,.70,.67,1);
 }
 render(instances,camera){const gl=this.gl,canvas=this.canvas,dpr=Math.min(window.devicePixelRatio||1,1.5);const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 let P=perspective(Math.PI/3,w/h,.5,300),VP=matMul(P,lookAt(camera.eye,camera.target));gl.useProgram(this.program);gl.uniformMatrix4fv(this.loc,false,VP);
 const batches=new Map;for(const o of instances){let kind=o.shape||'box';if(!batches.has(kind))batches.set(kind,[]);batches.get(kind).push(o);}
 for(const [kind,objects] of batches){const mesh=this.meshes[kind]||this.meshes.box;gl.bindVertexArray(mesh.vao);const arr=new Float32Array(objects.length*9);for(let i=0;i<objects.length;i++)arr.set(objects[i],i*9);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,arr,gl.DYNAMIC_DRAW);gl.drawElementsInstanced(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0,objects.length);}
 return VP;}
 dispose(){disposeNativeRenderer(this);}
}
class CanvasFallback{
 // Perspective 3D cuboid projection for browsers/devices where WebGL2 is unavailable.
 constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');if(!this.c)throw Error('Neither WebGL2 nor 2D canvas rendering is available.');}
 render(objects,camera){const canvas=this.canvas,c=this.c,w=canvas.clientWidth||900,h=canvas.clientHeight||600,dpr=Math.min(window.devicePixelRatio||1,1.5);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#a4b0a8';c.fillRect(0,0,w,h);
  const forward=norm(sub(camera.target,camera.eye)),right=norm(cross(forward,[0,1,0])),up=cross(right,forward),scale=h/(2*Math.tan(Math.PI/6));
  const project=p=>{let d=sub(p,camera.eye),depth=dot(d,forward);if(depth<=.2)return null;return [w/2+dot(d,right)*scale/depth,h/2-dot(d,up)*scale/depth,depth];};
  const faces=[{i:[4,5,6,7],n:[0,1,0],light:1.05},{i:[0,1,5,4],n:[0,0,1],light:.88},{i:[1,2,6,5],n:[1,0,0],light:.70},{i:[2,3,7,6],n:[0,0,-1],light:.68},{i:[3,0,4,7],n:[-1,0,0],light:.80}];
  const ordered=objects.map((o,i)=>({o,i,depth:Math.hypot(o[0]-camera.eye[0],o[1]-camera.eye[1],o[2]-camera.eye[2])})).sort((a,b)=>(a.i===0?-1:b.i===0?1:b.depth-a.depth));
  for(const {o} of ordered){const [x,y,z,sx,sy,sz,r,g,b]=o;
   const pts=[[-1,-1,1],[1,-1,1],[1,-1,-1],[-1,-1,-1],[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]].map(q=>[x+q[0]*sx/2,y+q[1]*sy/2,z+q[2]*sz/2]);
   const projected=pts.map(project);if(projected.every(p=>!p))continue;
   for(const f of faces){const cv=dot(f.n,[camera.eye[0]-x,camera.eye[1]-y,camera.eye[2]-z]);if(cv<=0||f.i.some(i=>!projected[i]))continue;
    const shade=f.light;c.beginPath();for(let j=0;j<4;j++){let [u,v]=projected[f.i[j]];j?c.lineTo(u,v):c.moveTo(u,v);}c.closePath();
    const red=Math.round(clamp(r*shade*255,0,255)),green=Math.round(clamp(g*shade*255,0,255)),blue=Math.round(clamp(b*shade*255,0,255));c.fillStyle=`rgb(${red},${green},${blue})`;c.fill();
   }
  }
  c.fillStyle='#e7d6b5';c.font='11px monospace';c.fillText('SOFTWARE 3D MODE · WEBGL2 NOT AVAILABLE',22,h-170);
 }
}
const instance=(out,x,y,z,sx,sy,sz,color,shape='box')=>{const item=[x,y,z,sx,sy,sz,...color];item.shape=shape;out.push(item);};
const factionRgb=(hex,light=1)=>hexColor(hex).map(v=>clamp(v*light,0,1));
function formation(id,side,type,order,start,ratio,color){const count=type==='cavalry'?15:type==='archers'?24:36;let x=(order-2.5)*10,z=side==='attacker'?24:-24;
 const speed=type==='cavalry'?6.8:type==='archers'?3.6:4.5,range=type==='archers'?15:2.5,damage=type==='cavalry'?18:type==='archers'?9:11;
 return {id,side,type,x,z,targetX:x,targetZ:z,orderX:x,orderZ:z,order,life:100,initial:count,units:count,displayUnits:count,morale:100,baseSpeed:speed,baseRange:range,baseDamage:damage,speed,range,damage,armor:1,cavalryCounter:1,cooldown:0,color,enabled:ratio>0,routed:ratio<=0,lossScale:ratio,phase:order*.87};}
function attachTactics(group,faction,formationId){
 const doctrine=militaryDoctrine(faction);
 const selected=doctrine.formations.includes(formationId)?formationId:doctrine.formations[0];
 const stats=combatStatistics(faction,group.type,selected);
 group.doctrine=doctrine.id;group.specialist=doctrine.unique;group.formationId=selected;
 const p=group.profile||{speed:1,range:1,damage:1,armor:1,counter:1},r=group.readiness||{speed:1,power:1};group.speed=group.baseSpeed*stats.speed*p.speed*r.speed;group.range=group.baseRange*stats.range*p.range;
 group.damage=group.baseDamage*stats.damage*p.damage*r.power;group.armor=stats.defense*p.armor;group.cavalryCounter=stats.cavalryCounter*p.counter;
 return group;
}
export class BattleGame{
 constructor(canvas,descriptor,game,onFinish,onStatus){this.canvas=canvas;this.descriptor=descriptor;this.game=game;this.onFinish=onFinish;this.onStatus=onStatus;this.running=true;this.paused=Boolean(descriptor.interactive);this.deployment=Boolean(descriptor.interactive);this.done=false;this.elapsed=0;this.selected=0;this.camera={yaw:.38,distance:72,target:[0,0,-3],eye:[0,55,80]};this.drag=null;this.keys=new Set();this.projectiles=[];this.audio=browserFieldAudio(descriptor.soundEnabled!==false);this.last=performance.now();const coarse=window.matchMedia?.('(pointer: coarse)').matches||false;
 const province=game.provinces?.[descriptor.to],fortLevel=descriptor.fieldBattle?0:province?.buildings?.fort||0;
 const desertFactions=new Set(['mamluks','delhi','bahmani','gujarat','malwa','morocco','tunis','mali','songhai','arabia','timurids','persia','oman','yemen','safavids']);
 const biome=desertFactions.has(game.player)||desertFactions.has(descriptor.enemy)?'desert':'temperate';this.biome=biome;
 const config={fortLevel,biome,fieldBattle:!!descriptor.fieldBattle,seed:1450+Math.round(fortLevel*23),attackerRealm:game.player,defenderRealm:descriptor.enemy};
 const chosen=chooseBattleRenderer(canvas,{probe:c=>c.getContext('webgl2'),three:c=>new ThreeBattleScene(c,config),native:c=>new Renderer(c),software:c=>new CanvasFallback(c),replace:freshBattleCanvas,warn:e=>console.warn('Battle renderer fallback:',e)});
 canvas=chosen.canvas;this.canvas=canvas;this.ctx=chosen.renderer;this.rendererMode=chosen.mode;
 this.mobile=coarse;this.frameRemainder=0;if(descriptor.fieldBattle){const seed=[...String(descriptor.to||'practice')].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,1450);this.fieldLandscape=fieldScenery(seed,this.biome||'temperate',coarse||this.ctx instanceof CanvasFallback);}
 // The existing campaign and combat simulation are retained. The asset art layer
 // loads optional scenery from CC0 Kenney packs or this repository's source library.
 this.scenery=null;this.sceneryPlacements=[];
 if(this.ctx instanceof Renderer){
  try{
   this.scenery=new BattleModelArt(this.ctx.gl);
   const load=(id,...paths)=>{(async()=>{for(const path of paths){const result=await this.scenery?.load(id,new URL(path,import.meta.url));if(result)break;}})();};
   if(!descriptor.fieldBattle){
   load('wall','../assets/battle/kenney/wall.glb','../source/low-ruined-wall-section-optimized.glb');
   load('gate','../assets/battle/kenney/gate.glb');
   load('tower','../assets/battle/kenney/tower-square-base.glb');
   load('catapult','../assets/battle/kenney/siege-catapult.glb');
   for(let j=-3;j<=3;j++)if(j!==0)this.sceneryPlacements.push({id:'wall',x:j*9,y:0,z:-42,size:8.5});
   this.sceneryPlacements.push({id:'gate',x:0,z:-42,size:6.5});
   for(const x of [-31,31])this.sceneryPlacements.push({id:'tower',x,z:-42,size:10});
   this.sceneryPlacements.push({id:'catapult',x:29,z:22,size:7});
   }
   const indianFactions=new Set(['vijayanagara','delhi','bahmani','bengal','gujarat','malwa','jaunpur']);
   if(indianFactions.has(game.player)||indianFactions.has(descriptor.enemy)){
    load('temple','../source/south-indian-small-temple-kadamba-style-optimized%20(1).glb');
    this.sceneryPlacements.push({id:'temple',x:43,y:0,z:-40,size:11});
   }
  }catch(e){console.warn('Optional battle scenery disabled:',e);this.scenery=null;}
 }

 const playerFaction=game.factions[game.player],enemy=game.factions[descriptor.enemy],fieldArmy=game.armies[descriptor.attacker];
 const garrison=startingTroops(playerFaction,descriptor.defenseMode?(descriptor.defenseGarrison??90):0);
 const alliedFieldArmies=participatingArmies(game,descriptor.playerArmies||[descriptor.attacker],game.player,descriptor.defenseMode?descriptor.to:descriptor.from,descriptor.showcase?null:descriptor.enemy),hostileFieldArmies=participatingArmies(game,descriptor.enemyArmies||[descriptor.enemyArmy],descriptor.enemy,descriptor.defenseMode?descriptor.from:descriptor.to,descriptor.showcase?null:game.player),hostileGarrison=startingTroops(enemy,descriptor.defenseMode?0:descriptor.defenseGarrison||0),fieldStats=(armies,reserve,type)=>combinedFieldStats(armies,reserve,a=>armyReadiness(game,a),(a,t)=>regimentProfile(game,a,t),type);
 const a=descriptor.fieldBattle?aggregateForce(alliedFieldArmies,garrison):fieldArmy?{...fieldArmy,...Object.fromEntries(['infantry','archers','cavalry'].map(t=>[t,(fieldArmy[t]||0)+garrison[t]]))}:garrison;
 const enemyArmy=descriptor.enemyArmy&&game.armies[descriptor.enemyArmy];
 const enemies=descriptor.fieldBattle&&!descriptor.showcase?aggregateForce(hostileFieldArmies,hostileGarrison):enemyArmy?{...enemyArmy,...Object.fromEntries(['infantry','archers','cavalry'].map(t=>[t,(enemyArmy[t]||0)+(descriptor.defenseMode?0:startingTroops(enemy,descriptor.defenseGarrison||0)[t])]))}:startingTroops(enemy,Math.max(95,(descriptor.defenseTroops||0)+(descriptor.defenseMode?0:descriptor.defenseGarrison||0)));
 this.siege=descriptor.fieldBattle?null:createSiegeState(game.provinces?.[descriptor.to]?.buildings?.fort||0,!!descriptor.defenseMode);this.groups=[];
 const mySlots=armyFormationSlots(playerFaction,a,6),enemySlots=armyFormationSlots(enemy,enemies,6);
 for(let i=0;i<6;i++){
  const type=mySlots[i],slotCount=mySlots.filter(t=>t===type).length;
  const unitCount=descriptor.fieldBattle?regimentTroops(a,mySlots,i):(a[type]||0)/Math.max(1,slotCount),position=descriptor.defenseMode?-26:24;
  const g=formation('p'+i,'attacker',type,i,[0,0],unitCount,'#4b98b3');
  g.z=position;g.targetZ=position;g.orderZ=position;
  g.life=clamp(unitCount/(type==='infantry'?52:type==='archers'?32:23)*100,10,100);
  g.routed=unitCount<1;if(descriptor.fieldBattle)Object.assign(g,fieldStats(alliedFieldArmies,garrison,type));else{g.profile=regimentProfile(game,a,type);g.readiness=armyReadiness(game,a);}g.morale=g.readiness.morale;g.initialLife=g.life;g.troopCount=unitCount;attachTactics(g,playerFaction,militaryDoctrine(playerFaction).formations[0]);
  if(descriptor.fieldBattle){initializeFieldGroup(g);if(descriptor.defenseMode)g.facingZ*=-1;}this.groups.push(g);
 }
 for(let i=0;i<6;i++){
  const type=enemySlots[i],slotCount=enemySlots.filter(t=>t===type).length;
  const unitCount=descriptor.fieldBattle?regimentTroops(enemies,enemySlots,i):(enemies[type]||0)/Math.max(1,slotCount),position=descriptor.defenseMode?24:-24;
  const g=formation('e'+i,'defender',type,i,[0,0],unitCount,enemy?.color||'#b86855');
  g.z=position;g.targetZ=position;g.orderZ=position;
  g.life=clamp(unitCount/(type==='infantry'?50:type==='archers'?32:22)*100,10,100);
  g.routed=unitCount<1;if(descriptor.fieldBattle&&!descriptor.showcase)Object.assign(g,fieldStats(hostileFieldArmies,hostileGarrison,type));else{g.profile=regimentProfile(game,enemyArmy||enemies,type);g.readiness=armyReadiness(game,enemyArmy||enemies);}g.morale=g.readiness.morale;g.initialLife=g.life;g.troopCount=unitCount;attachTactics(g,enemy,militaryDoctrine(enemy).formations[i%militaryDoctrine(enemy).formations.length]);
  if(descriptor.fieldBattle){initializeFieldGroup(g);if(descriptor.defenseMode)g.facingZ*=-1;}this.groups.push(g);
 }
 this.selected=Math.max(0,this.groups.findIndex(g=>g.side==='attacker'&&!g.routed));
 this.terrain=[];let randSeed=1450;const rng=()=>((randSeed=(randSeed*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<105;i++){let x=(rng()-.5)*125,z=(rng()-.5)*100;if(Math.abs(z)<33&&Math.abs(x)<44)continue;this.terrain.push({x,z,h:1.4+rng()*5,r:rng(),type:rng()>.55?'tree':'rock'});}
 this._onKeyDown=e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;this.keys.add(e.key.toLowerCase());if(/^Digit[1-6]$/.test(e.code)){this.selected=Number(e.code.slice(-1))-1;this.report();}if(e.code==='Space'){if(!this.deployment&&!this.done)this.togglePause();e.preventDefault();}};
 this._onKeyUp=e=>this.keys.delete(e.key.toLowerCase());this._onWheel=e=>{e.preventDefault();this.cameraGoal=null;this.camera.distance=clamp(this.camera.distance+e.deltaY*.065,35,165);};
 this._onContext=e=>e.preventDefault();this._onDown=e=>{if(e.button===2){e.preventDefault();const target=this.rayGround(e.offsetX,e.offsetY);const group=this.groups[this.selected];if(target&&group?.side==='attacker'&&!group.routed){if(this.descriptor.fieldBattle){this.command(this.selected,'move',[target[0],target[2]]);return;}group.targetX=clamp(target[0],-64,64);group.targetZ=clamp(target[2],-46,46);group.manual=true;}return;}if(e.button===0){this.drag={x:e.clientX,y:e.clientY,moved:0,pointer:e.pointerId};canvas.setPointerCapture?.(e.pointerId);}};
 this._onMove=e=>{if(this.drag&&this.drag.pointer===e.pointerId){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;this.drag.x=e.clientX;this.drag.y=e.clientY;this.drag.moved+=Math.hypot(dx,dy);if(this.drag.moved>3){this.cameraGoal=null;this.camera.target[0]-=dx*.08;this.camera.target[2]-=dy*.08;}}};
 this._onUp=e=>{if(this.drag?.pointer!==e.pointerId)return;if(this.drag.moved<8){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(this.tapMove){const p=this.rayGround(x,y);this.tapMove=false;if(p)this.command(this.selected,'move',[p[0],p[2]]);this.report();this.drag=null;return;}let best=-1,d=24;for(let i=0;i<6;i++){if(this.groups[i].routed)continue;const p=this.project([this.groups[i].x,1,this.groups[i].z]);if(!p)continue;let v=Math.hypot(p[0]-x,p[1]-y);if(v<d){best=i;d=v;}}if(best>=0){this.selected=best;this.report();}}this.drag=null;};
 window.addEventListener('keydown',this._onKeyDown);window.addEventListener('keyup',this._onKeyUp);canvas.addEventListener('wheel',this._onWheel,{passive:false});canvas.addEventListener('contextmenu',this._onContext);canvas.addEventListener('pointerdown',this._onDown);window.addEventListener('pointermove',this._onMove);window.addEventListener('pointerup',this._onUp);this._onCancel=()=>{this.drag=null;};canvas.addEventListener('pointercancel',this._onCancel);
 this._onContextLost=e=>{e.preventDefault();this.renderLost=true;this.paused=true;this.audio?.silence();this.report();};canvas.addEventListener('webglcontextlost',this._onContextLost);
 this._onVisibility=()=>{this.last=performance.now();this.frameRemainder=0;if(document.hidden)this.audio?.silence();};document.addEventListener('visibilitychange',this._onVisibility);this.report();this.loop=this.loop.bind(this);this.raf=requestAnimationFrame(this.loop);
 }
 focusCamera(mode){const goal=cameraDestination(mode,this.groups,this.selected);if(!goal)return false;this.cameraGoal=goal;return true;}
 updateCamera(dt){const c=this.camera,k=this.keys;if(['q','e','w','a','s','d'].some(x=>k.has(x)))this.cameraGoal=null;if(this.cameraGoal&&blendCamera(c,this.cameraGoal,dt))this.cameraGoal=null;if(k.has('q'))c.yaw-=dt*.9;if(k.has('e'))c.yaw+=dt*.9;if(k.has('w'))c.target[2]-=dt*22;if(k.has('s'))c.target[2]+=dt*22;if(k.has('a'))c.target[0]-=dt*22;if(k.has('d'))c.target[0]+=dt*22;c.target[0]=clamp(c.target[0],-90,90);c.target[2]=clamp(c.target[2],-75,75);}
 getCamera(){const c=this.camera,y=c.yaw,dist=c.distance;const eye=[c.target[0]+Math.sin(y)*dist*.68,c.target[1]+dist*.72,c.target[2]+Math.cos(y)*dist*.68];return {eye,target:c.target};}
 cameraVectors(){const {eye,target}=this.getCamera(),forward=norm(sub(target,eye)),right=norm(cross(forward,[0,1,0])),up=cross(right,forward);return {eye,forward,right,up};}
 rayGround(px,py){const {eye,forward,right,up}=this.cameraVectors();let w=this.canvas.clientWidth,h=this.canvas.clientHeight,ratio=w/h,t=Math.tan(Math.PI/6);let u=(2*px/w-1)*ratio*t,v=(1-2*py/h)*t;let dir=norm([forward[0]+right[0]*u+up[0]*v,forward[1]+right[1]*u+up[1]*v,forward[2]+right[2]*u+up[2]*v]);if(dir[1]>=0)return null;let d=-eye[1]/dir[1];return [eye[0]+d*dir[0],0,eye[2]+d*dir[2]];}
 project(p){let {eye,forward,right,up}=this.cameraVectors();let d=sub(p,eye),depth=dot(d,forward);if(depth<=.5)return null;let scale=this.canvas.clientHeight/(2*Math.tan(Math.PI/6));return [this.canvas.clientWidth/2+dot(d,right)*scale/depth,this.canvas.clientHeight/2-dot(d,up)*scale/depth];}
 report(){if(this.onStatus)this.onStatus({groups:this.groups,selected:this.selected,paused:this.paused,elapsed:this.elapsed,deployment:this.deployment,siege:this.siege,enemyPosture:this.enemyPosture,tapMove:this.tapMove,rendererMode:this.rendererMode,renderLost:!!this.renderLost,roster:{attacker:battleRoster(this.groups,'attacker',!!this.descriptor?.fieldBattle),defender:battleRoster(this.groups,'defender',!!this.descriptor?.fieldBattle)}});}
 setFormation(index,id){
  const g=this.groups[index];
  if(!g||g.side!=='attacker'||g.routed||!availableFormations(this.game.factions[this.game.player]).some(f=>f.id===id))return false;
  attachTactics(g,this.game.factions[this.game.player],id);if(this.deployment)g.deploymentRevision=(g.deploymentRevision||0)+1;this.report();return true;
 }
 setLane(index,lane){
  if(!this.deployment||![0,1,2].includes(lane))return false;
  const g=this.groups[index];if(!g||g.side!=='attacker'||g.routed)return false;
  g.x=(lane-1)*26+(index-2.5)*3.3;g.orderX=g.x;g.targetX=g.x;g.anchorX=g.x;g.anchorZ=g.z;g.deploymentRevision=(g.deploymentRevision||0)+1;this.report();return true;
 }
 command(index,order,point,all=false){if(!this.descriptor?.fieldBattle||this.done)return false;const groups=all?this.groups.filter(g=>g.side==='attacker'): [this.groups[index]];const points=all&&order==='move'?formationMovePoints(groups,point):null;let changed=false;for(const g of groups)if(g?.side==='attacker'&&issueFieldOrder(g,order,points?points.get(g.id):point))changed=true;if(changed){this.audio?.play('order');this.report();}return changed;}
 startAssault(){if(!this.deployment||this.renderLost)return false;this.deployment=false;this.paused=false;this.frameRemainder=0;this.audio?.unlock();this.audio?.play('horn');this.last=performance.now();this.report();return true;}
 update(dt){this.elapsed+=dt;
 if(this.descriptor?.fieldBattle){if(this.nextFieldPlan===undefined||this.elapsed>=this.nextFieldPlan){coordinateFieldAI(this);this.nextFieldPlan=this.elapsed+4;}if(this.elapsed%6<dt){for(const g of this.groups.filter(g=>g.side==='defender'&&!g.routed)){const e=fieldTarget(g,this.groups.filter(o=>o.side==='attacker'&&!o.routed));if(e)attachTactics(g,this.game.factions[this.descriptor.enemy],chooseCounterFormation(this.game.factions[this.descriptor.enemy],e.type,g.type));}}stepField(this,dt);this.audio?.update(this.groups,this.elapsed,this.camera);const l=fieldStrength(this.groups,'attacker'),r=fieldStrength(this.groups,'defender');if(l<=0||r<=0||this.elapsed>=220)this.finish(l>0&&(r<=0||l>r),l,r);return;}
 for(const g of this.groups){if(g.routed)continue;g.phase+=dt*(g.type==='cavalry'?10:5);
  const enemies=this.groups.filter(o=>o.side!==g.side&&!o.routed);
  const e=enemies.sort((a,b)=>dist([a.x,0,a.z],[g.x,0,g.z])-dist([b.x,0,b.z],[g.x,0,g.z]))[0];
  const structure=siegeTarget(this.siege,g);
  if(structure){const distance=Math.hypot(g.x-structure.x,g.z-structure.z),range=Math.max(g.range, g.readiness?.siege>0?14:3);g.cooldown-=dt;if(distance<=range){if(g.cooldown<=0){g.cooldown=1.2;siegeDamage(this.siege,structure.id,g.damage*.36+(g.readiness?.siege||0)*.10/Math.max(1,this.groups.filter(o=>o.side===g.side&&!o.routed).length));if(range>4)this.projectiles.push({sx:g.x,sz:g.z,tx:structure.x,tz:structure.z,t:0});}continue;}if(!g.manual){g.targetX=structure.x;g.targetZ=structure.z;}const d=Math.hypot(g.targetX-g.x,g.targetZ-g.z);if(d>.3){const step=Math.min(d,dt*g.speed);g.x+=(g.targetX-g.x)/d*step;g.z+=(g.targetZ-g.z)/d*step;}else g.manual=false;continue;}
  if(!e)continue;
  // Manual player movement supersedes AI until arrival.
  let dd=dist([g.x,0,g.z],[e.x,0,e.z]);
  if(g.side==='defender'&&this.elapsed%6<dt){
   attachTactics(g,this.game.factions[this.descriptor.enemy],chooseCounterFormation(this.game.factions[this.descriptor.enemy],e.type,g.type));
  }
  if(g.side==='defender'||(!g.manual&&g.side==='attacker')){if(g.type==='archers'&&dd<=g.range*.9){g.targetX=g.x;g.targetZ=g.z;}else{g.targetX=e.x;g.targetZ=e.z;if(this.siege&&!siegeBreached(this.siege)&&g.side!==this.siege.assaultSide){g.targetZ=Math.min(-21,g.targetZ);}}}
  let d=Math.hypot(g.targetX-g.x,g.targetZ-g.z);
  if(d>.3){let step=Math.min(d,dt*g.speed*(g.life/100*.4+.6));g.x+=(g.targetX-g.x)/d*step;g.z+=(g.targetZ-g.z)/d*step;}else if(g.manual){g.manual=false;}
  dd=dist([g.x,0,g.z],[e.x,0,e.z]);g.cooldown-=dt;
  if(dd<g.range&&g.cooldown<=0){g.cooldown=g.type==='archers'?1.2:.8;
   let damage=g.damage*(.75+.25*g.life/100)*(g.type==='cavalry'&&e.type==='archers'?1.6:1)*
   (g.type==='cavalry'?1/Math.max(.6,e.cavalryCounter):1)/
   Math.max(.6,e.armor)*( .82+Math.random()*.30);
   e.life=Math.max(0,e.life-damage*.18);e.morale=Math.max(0,e.morale-damage*.29);
   if(g.type==='archers')this.projectiles.push({sx:g.x,sz:g.z,tx:e.x,tz:e.z,t:0});
   if(e.life<8||e.morale<13){e.routed=true;e.life=0;}
  }
 }
 for(const p of this.projectiles)p.t+=dt*2.3;this.projectiles=this.projectiles.filter(p=>p.t<=1);
 const left=this.groups.filter(g=>g.side==='attacker'&&!g.routed),right=this.groups.filter(g=>g.side==='defender'&&!g.routed);
 if(left.length===0||(right.length===0&&(siegeBreached(this.siege)||this.siege?.assaultSide==='defender'))||this.elapsed>=220){const leftPower=left.reduce((s,g)=>s+g.life,0),rightPower=right.reduce((s,g)=>s+g.life,0);const win=left.length>0&&(this.siege?.assaultSide==='defender'&&!siegeBreached(this.siege)||right.length===0||leftPower>rightPower)&&(this.siege?.assaultSide!=='attacker'||siegeBreached(this.siege));this.finish(win,leftPower,rightPower);}
 }
 render(){if(!this.ctx)return;const obj=[],C={grass:[.29,.36,.29],earth:[.43,.40,.31],shadow:[.25,.27,.23],trunk:[.36,.25,.18],leaf:[.28,.37,.25],stone:[.42,.43,.41],gold:[.91,.74,.42],steel:[.63,.70,.69],arrow:[.96,.66,.35]};
 if(this.fieldLandscape){if(!this.ctx.isThreeBattle)obj.push(this.fieldLandscape.ground);obj.push(...this.fieldLandscape.items);}
 else if(!this.ctx.isThreeBattle){
 instance(obj,0,-.31,0,150,.6,118,C.grass);
 // Stained ground tiles create variation without textures.
 for(let x=-65;x<=65;x+=13)for(let z=-52;z<=52;z+=13){let shade=(Math.sin(x*17+z*9)+1)/14;instance(obj,x,-.006,z,12,.016,12,[.28+shade,.34+shade,.275+shade]);}
 for(const t of this.terrain){if(t.type==='tree'){instance(obj,t.x,.8,t.z,.8,1.7,.8,C.trunk);instance(obj,t.x,t.h*.64,t.z,t.h*.88,t.h*.95,t.h*.88,C.leaf,'cone');}else{instance(obj,t.x,.5,t.z,1.2+t.r,1+t.r,1.2+t.r,C.stone,'sphere');}}
 // Defensive fort visual near the far side of the field.
 if(!this.descriptor.fieldBattle)for(let i=-3;i<=3;i++){let x=i*9;instance(obj,x,1.5,-42,8,3,2.6,C.stone);if(i%2===0){instance(obj,x,3.55,-42,3,1.5,3,C.stone);instance(obj,x,4.4,-42,3.8,1.1,3.8,[.49,.45,.38],'cone');}}
 }
 if(this.siege)for(const q of this.siege.structures){const height=q.hp>0?1+3*q.hp/q.max:.35;instance(obj,q.x,height/2,q.z,q.id==='gate'?9:5,height,3,q.hp>0?C.stone:C.earth);}
 for(let k=0;k<this.groups.length;k++){const g=this.groups[k],field=!!this.descriptor.fieldBattle;if(field){const shadow=battleContactShadow(g);if(shadow)obj.push(shadow);}if(g.routed&&(!field||(g.routAge||0)>=3))continue;const n=field?visibleSoldierCount(g,Math.round(g.initial*(this.ctx instanceof CanvasFallback?.65:1))):Math.max(3,Math.round(g.initial*g.life/100*(this.ctx instanceof CanvasFallback?.65:1)));const offsets=field?formationOffsets(n,g.formationId,g.type):null;const cols=g.type==='cavalry'?5:6;const spacing=g.type==='cavalry'?1.25:.73;
  const palette=regimentPalette(g.side,g.type),base=field?palette.cloth:g.side==='attacker'?[.34,.63,.73]:g.color?.startsWith('#')?factionRgb(g.color):[.75,.34,.31];const head=[.76,.64,.48],shield=g.side==='attacker'?[.20,.34,.43]:[.43,.24,.19];
  if(!(this.ctx.isThreeBattle&&this.ctx.modelsReady))for(let i=0;i<n;i++){const col=i%cols,row=Math.floor(i/cols);const ox=(col-(cols-1)/2)*spacing,oz=(row-Math.floor(n/cols)/2)*spacing;
   const pose=field?soldierWorldPose(g,offsets[i]):null,px=pose?.x??g.x+ox,pz=pose?.z??g.z+oz,walk=(!field||visualMode(g)==='walk')?Math.sin(this.elapsed*7+i*.55)*.045:0;
   if(g.type==='cavalry'){instance(obj,px,.52+walk,pz,.88,.65,1.5,[.37,.32,.27],'sphere');instance(obj,px,1.15+walk,pz,.48,.76,.43,base,'cylinder');instance(obj,px,1.68+walk,pz,.31,.29,.31,head,'sphere');instance(obj,px,1.87+walk,pz,.40,.28,.42,C.steel,'cone');
   } else {instance(obj,px,.75+walk,pz,.44,.80,.38,base,'cylinder');instance(obj,px,1.30+walk,pz,.29,.29,.29,head,'sphere');instance(obj,px,1.52+walk,pz,.36,.29,.36,C.steel,'cone');instance(obj,px-.15,.18+walk,pz,.13,.40,.14,[.28,.26,.25],'cylinder');instance(obj,px+.15,.18-walk,pz,.13,.40,.14,[.28,.26,.25],'cylinder');}
   if(g.type==='infantry'){instance(obj,px+.29,.85+walk,pz,.16,.65,.38,shield);instance(obj,px-.31,1+walk,pz,.085,1.5,.085,C.steel,'cylinder');}
   if(g.type==='archers'){instance(obj,px+.30,.85+walk,pz,.12,1.0,.1,C.trunk,'cylinder');}
  }
  if(g.routed)continue;const banner=field?palette.banner:g.side==='attacker'?[.91,.77,.46]:[.84,.49,.37];instance(obj,g.x,2.5,g.z,.16,5,.16,C.steel,'cylinder');instance(obj,g.x+.63,4.4,g.z,1.35,.74,.16,banner);if(field){instance(obj,g.x+.63,4.4,g.z,1.38,.15,.18,palette.accent);instance(obj,g.x,5.05,g.z,.29,.32,.29,C.gold,'sphere');}
  if(field&&k===this.selected&&['move','fallback','hold'].includes(g.fieldOrder)){const x=g.anchorX,z=g.anchorZ;instance(obj,x,.09,z,2.2,.12,2.2,[.90,.76,.30]);for(let i=1;i<=5;i++){const t=i/6;instance(obj,mix(g.x,x,t),.06,mix(g.z,z,t),.28,.07,.28,[.90,.76,.30]);}}
  if(k===this.selected){instance(obj,g.x,.08,g.z,5,.14,5,[.95,.79,.42]);instance(obj,g.x,.11,g.z,4.3,.15,4.3,[.28,.35,.32]);}
 }
 for(const p of this.projectiles){if(this.descriptor.fieldBattle){for(const q of projectileTrail(p,this.ctx instanceof CanvasFallback))instance(obj,q.x,q.y,q.z,q.size,q.size,q.size,q.head?[.94,.79,.49]:[.62,.49,.28],'sphere');}else{let t=p.t;instance(obj,mix(p.sx,p.tx,t),.8+Math.sin(t*Math.PI)*3,mix(p.sz,p.tz,t),.1,.1,.6,C.arrow);}}
 if(this.descriptor.fieldBattle)for(const effect of this.effects||[])for(const p of battleImpactParticles(effect)){const color=p.kind==='dust'?[.59,.51,.36]:p.kind==='rout'?[.80,.69,.47]:[1,.80,.39];instance(obj,p.x,p.y,p.z,p.size,p.size,p.size,color,'sphere');}
 const vp=this.ctx.render(obj,this.getCamera(),this.groups,this.elapsed);if(this.scenery&&vp)this.scenery.render(vp,this.sceneryPlacements);
 }
 loop(now){if(!this.running)return;const dt=clamp((now-this.last)/1000,0,.2);this.last=now;if(document.hidden||this.renderLost){this.frameRemainder=0;this.raf=requestAnimationFrame(this.loop);return;}this.updateCamera(Math.min(dt,.05));const before=this.elapsed;if(this.descriptor.fieldBattle){const next=fieldFrameSteps(this.frameRemainder,dt,!this.paused&&!this.done);this.frameRemainder=next.remainder;for(let i=0;i<next.steps&&!this.done;i++)this.update(1/30);}else if(!this.paused&&!this.done)this.update(Math.min(dt,.045));const interval=renderInterval(this.ctx instanceof CanvasFallback,this.mobile);if(this.lastRenderAt==null||now-this.lastRenderAt>=interval-2){this.render();this.lastRenderAt=now;}if(Math.floor(this.elapsed*2)!==Math.floor(before*2))this.report();this.raf=requestAnimationFrame(this.loop);}
 finish(victory,leftPower,rightPower=null){if(this.done)return;this.done=true;this.paused=true;this.audio?.silence();this.audio?.play(victory?'victory':'defeat');
  const roster={attacker:battleRoster(this.groups,'attacker',!!this.descriptor?.fieldBattle),defender:battleRoster(this.groups,'defender',!!this.descriptor?.fieldBattle)},fraction=roster.attacker.fraction,enemies=roster.defender.fraction;
  this.report();this.onFinish({victory,attackerRemaining:fraction,enemyRemaining:enemies,roster,fieldBattle:!!this.descriptor?.fieldBattle,fortBreached:!!this.siege&&siegeBreached(this.siege),seconds:Math.round(this.elapsed)});
 }
 retreat(){this.finish(false,this.groups.filter(g=>g.side==='attacker'&&!g.routed).reduce((s,g)=>s+g.life,0));}
 setSound(enabled){this.audio?.setEnabled(enabled);}
 togglePause(){if(this.deployment||this.done||this.renderLost)return;this.paused=!this.paused;this.frameRemainder=0;if(this.paused)this.audio?.silence();else this.audio?.unlock();this.report();}
 stop(){this.running=false;this.audio?.close();document.removeEventListener('visibilitychange',this._onVisibility);cancelAnimationFrame(this.raf);window.removeEventListener('keydown',this._onKeyDown);window.removeEventListener('keyup',this._onKeyUp);this.canvas.removeEventListener('wheel',this._onWheel);this.canvas.removeEventListener('contextmenu',this._onContext);this.canvas.removeEventListener('pointerdown',this._onDown);window.removeEventListener('pointermove',this._onMove);window.removeEventListener('pointerup',this._onUp);this.canvas.removeEventListener('pointercancel',this._onCancel);this.canvas.removeEventListener('webglcontextlost',this._onContextLost);this.scenery?.dispose();this.ctx?.dispose?.();}
}
