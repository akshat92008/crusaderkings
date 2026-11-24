import assert from 'node:assert/strict';
import test from 'node:test';
import {fieldAtmosphere,applyFieldAtmosphere} from '../src/field-atmosphere.js';
test('biome grading updates existing lights and fog without creating render resources',()=>{const color=()=>({setHex(v){this.hex=v;}}),sun={isDirectionalLight:true,color:color()},hemi={isHemisphereLight:true,color:color(),groundColor:color()},scene={background:color(),fog:{color:color()},children:[sun,hemi]},renderer={};const g=applyFieldAtmosphere(scene,renderer,'desert');assert.equal(scene.background.hex,g.sky);assert.equal(sun.intensity,g.sunIntensity);assert.equal(renderer.toneMappingExposure,g.exposure);assert.notEqual(g.sky,fieldAtmosphere('temperate').sky);assert.equal(scene.children.length,2);});
