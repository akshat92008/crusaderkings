import assert from 'node:assert/strict';
import test from 'node:test';
import {createTerrainMesh} from '../src/relief-map.js';
test('terrain grid has correct vertex and triangle counts',()=>{const m=createTerrainMesh(24,12);assert.equal(m.vertices.length,25*13*2);assert.equal(m.indices.length,24*12*6);assert.ok(Math.max(...m.indices)<25*13);});
test('terrain grid UVs cover entire world once',()=>{const m=createTerrainMesh(16,8);assert.deepEqual(Array.from(m.vertices.slice(0,2)),[0,0]);assert.deepEqual(Array.from(m.vertices.slice(-2)),[1,1]);});
test('terrain grid rejects oversized meshes that exceed 16-bit index range',()=>assert.throws(()=>createTerrainMesh(400,200),/Invalid terrain grid/));
