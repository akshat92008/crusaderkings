/**
 * Wrapper around bundled Three.js 3D Campaign Map Scene (`src/three-map.bundle.js`),
 * preserving createTerrainMesh / computeMapPitchDeg exports cleanly for Node tests.
 */
import {ThreeMapScene,createTerrainMesh,computeMapPitchDeg} from './three-map.bundle.js';
export {createTerrainMesh,computeMapPitchDeg};

export class ReliefMap{
 constructor(canvas,invalidate,world=null){
  this.canvas=canvas;
  this.scene=new ThreeMapScene(canvas,invalidate,world);
  this.gl=this.scene.gl;
  this.failReason=this.scene.failReason;
  this.governor=this.scene.governor;
 }
 get ready(){return this.scene.ready;}
 get world(){return this.scene.world;}
 set world(w){this.scene.world=w;}
 get sampleHeight(){return this.scene.sampleHeight;}
 effectiveTier(){return this.scene.effectiveTier();}
 rebuildTextures(world){return this.scene.bakeProvinceLookup(world);}
 updateProvinceStates(provinces,getColorFn,getGroupFn,getOccFn){return this.scene.updateProvinceStates(provinces,getColorFn,getGroupFn,getOccFn);}
 syncDynamicUnits(seats,armies,game,provIndex,force=false){return this.scene.syncDynamicUnits(seats,armies,game,provIndex,force);}
 render(w,h,dpr,zoom,panX,panY,compression,opts={}){return this.scene.render(w,h,dpr,zoom,panX,panY,compression,opts);}
 dispose(){return this.scene.dispose();}
}
