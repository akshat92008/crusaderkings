import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseStaticGLB} from '../src/glb-art.js';
function makeTriangle(){
 const positions=new Float32Array([0,0,0,1,0,0,0,1,0]),indices=new Uint16Array([0,1,2]),bin=new Uint8Array(44);bin.set(new Uint8Array(positions.buffer));bin.set(new Uint8Array(indices.buffer),36);
 const doc={asset:{version:'2.0'},scenes:[{nodes:[0]}],nodes:[{mesh:0,translation:[2,0,3]}],meshes:[{primitives:[{attributes:{POSITION:0},indices:1}]}],buffers:[{byteLength:44}],bufferViews:[{buffer:0,byteOffset:0,byteLength:36},{buffer:0,byteOffset:36,byteLength:6}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3'},{bufferView:1,componentType:5123,count:3,type:'SCALAR'}]};
 const encoded=new TextEncoder().encode(JSON.stringify(doc)),len=Math.ceil(encoded.length/4)*4,full=new ArrayBuffer(12+8+len+8+44),view=new DataView(full),u=new Uint8Array(full);
 view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,full.byteLength,true);view.setUint32(12,len,true);view.setUint32(16,0x4e4f534a,true);u.fill(32,20,20+len);u.set(encoded,20);view.setUint32(20+len,44,true);view.setUint32(24+len,0x004e4942,true);u.set(bin,28+len);return full;
}
test('GLB parser handles indexed meshes and node transforms',()=>{const result=parseStaticGLB(makeTriangle());assert.equal(result.primitives.length,1);assert.deepEqual(result.primitives[0].indices,Uint32Array.from([0,1,2]));assert.deepEqual(result.bounds.min,[2,0,3]);assert.deepEqual(result.bounds.max,[3,1,3]);});
test('GLB parser rejects invalid headers',()=>assert.throws(()=>parseStaticGLB(new ArrayBuffer(40)),/Expected binary/));
