/** Dependency-free static GLB 2.0 scenery loader for Crown of Nations battles.
 * Supports triangle geometry, nested nodes, simple textures and GLB material colors.
 * No animated skinning or advanced glTF extensions.
 */
const ID=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
const multiply=(a,b)=>{const r=new Float32Array(16);for(let c=0;c<4;c++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)r[c*4+j]+=a[k*4+j]*b[c*4+k];return r;};
const transform=(m,x,y,z,w=1)=>[m[0]*x+m[4]*y+m[8]*z+m[12]*w,m[1]*x+m[5]*y+m[9]*z+m[13]*w,m[2]*x+m[6]*y+m[10]*z+m[14]*w];
function nodeMatrix(n){if(n.matrix)return new Float32Array(n.matrix);const [x,y,z,w]=n.rotation||[0,0,0,1],[sx,sy,sz]=n.scale||[1,1,1],[tx,ty,tz]=n.translation||[0,0,0];return new Float32Array([(1-2*(y*y+z*z))*sx,(2*(x*y+z*w))*sx,(2*(x*z-y*w))*sx,0,(2*(x*y-z*w))*sy,(1-2*(x*x+z*z))*sy,(2*(y*z+x*w))*sy,0,(2*(x*z+y*w))*sz,(2*(y*z-x*w))*sz,(1-2*(x*x+y*y))*sz,0,tx,ty,tz,1]);}
const comp={5120:[Int8Array,1],5121:[Uint8Array,1],5122:[Int16Array,2],5123:[Uint16Array,2],5125:[Uint32Array,4],5126:[Float32Array,4]};
function normalized(v,t){if(t===5120)return Math.max(-1,v/127);if(t===5121)return v/255;if(t===5122)return Math.max(-1,v/32767);if(t===5123)return v/65535;return v;}
export function parseStaticGLB(data){
 const buf=data instanceof ArrayBuffer?data:data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),view=new DataView(buf);
 if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2)throw Error('Expected binary glTF 2.0');
 if(view.getUint32(8,true)>buf.byteLength)throw Error('Truncated GLB');
 let off=12,json=null,binary=null;
 while(off+8<=view.getUint32(8,true)){const size=view.getUint32(off,true),kind=view.getUint32(off+4,true);off+=8;if(off+size>buf.byteLength)throw Error('Bad GLB chunk bounds');if(kind===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,off,size)).trim());if(kind===0x004e4942)binary=off;off+=size;}
 if(!json||binary===null)throw Error('GLB JSON or BIN chunk absent');
 const blocked=(json.extensionsRequired||[]).filter(s=>!['KHR_mesh_quantization','KHR_materials_unlit','EXT_texture_webp','KHR_texture_basisu'].includes(s));
 if(blocked.length)throw Error('Unsupported required glTF extensions: '+blocked.join(', '));
 function accessor(id){const a=json.accessors[id];if(!a)throw Error('Missing accessor');const v=json.bufferViews[a.bufferView];if(!v||a.sparse)throw Error('Missing or sparse accessor');const [ArrayType,bytes]=comp[a.componentType]||[];if(!ArrayType)throw Error('Unsupported glTF component');const width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[a.type];if(!width)throw Error('Unsupported glTF accessor type');const start=binary+(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||width*bytes;if(start+stride*(a.count-1)+width*bytes>buf.byteLength)throw Error('Accessor exceeds GLB');const vals=new Float32Array(a.count*width);for(let i=0;i<a.count;i++)for(let j=0;j<width;j++){const pos=start+i*stride+j*bytes;const val=a.componentType===5126?view.getFloat32(pos,true):bytes===1?(a.componentType===5120?view.getInt8(pos):view.getUint8(pos)):bytes===2?(a.componentType===5122?view.getInt16(pos,true):view.getUint16(pos,true)):view.getUint32(pos,true);vals[i*width+j]=a.normalized?normalized(val,a.componentType):val;}return {vals,width,count:a.count};}
 const primitives=[],root=json.scenes?.[json.scene||0]?.nodes||json.nodes.map((_,i)=>i);
 function walk(id,parent){const n=json.nodes[id];if(!n)return;const mat=multiply(parent,nodeMatrix(n));
  if(Number.isInteger(n.mesh))for(const p of json.meshes[n.mesh]?.primitives||[]){if(p.mode!==undefined&&p.mode!==4)continue;if(p.extensions?.KHR_draco_mesh_compression||p.extensions?.EXT_meshopt_compression)continue;const positions=accessor(p.attributes.POSITION),normals=p.attributes.NORMAL!==undefined?accessor(p.attributes.NORMAL):null,uv=p.attributes.TEXCOORD_0!==undefined?accessor(p.attributes.TEXCOORD_0):null,indices=p.indices!==undefined?Array.from(accessor(p.indices).vals):Array.from({length:positions.count},(_,i)=>i),v=new Float32Array(positions.count*8);
   for(let i=0;i<positions.count;i++){const j=i*3,q=transform(mat,positions.vals[j],positions.vals[j+1],positions.vals[j+2]);v.set(q,i*8);if(normals){const t=transform(mat,normals.vals[j],normals.vals[j+1],normals.vals[j+2],0),d=Math.hypot(...t)||1;v.set(t.map(e=>e/d),i*8+3);}else v.set([0,1,0],i*8+3);if(uv)v.set([uv.vals[i*uv.width],uv.vals[i*uv.width+1]],i*8+6);}
   const material=json.materials?.[p.material||0]||{},rgba=material.pbrMetallicRoughness?.baseColorFactor||[.73,.67,.56,1],texId=material.pbrMetallicRoughness?.baseColorTexture?.index,texture=json.textures?.[texId],imageIdx=texture?.extensions?.EXT_texture_webp?.source??texture?.source??null;
   primitives.push({vertices:v,indices:new Uint32Array(indices),color:rgba.slice(0,3),imageIdx});
  }
  for(const child of n.children||[])walk(child,mat);
 }
 for(const id of root)walk(id,ID());
 if(!primitives.length)throw Error('No supported triangle mesh found');
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(const p of primitives)for(let i=0;i<p.vertices.length;i+=8)for(let k=0;k<3;k++){const x=p.vertices[i+k];lo[k]=Math.min(lo[k],x);hi[k]=Math.max(hi[k],x);}
 const images=(json.images||[]).map(im=>{if(im.bufferView===undefined)return null;const bv=json.bufferViews[im.bufferView];return bv?{mime:im.mimeType||'image/png',bytes:new Uint8Array(buf,binary+(bv.byteOffset||0),bv.byteLength).slice()}:null;});
 return {primitives,images,bounds:{min:lo,max:hi},requires:json.extensionsRequired||[]};
}
function shader(gl,type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
export class BattleModelArt{
 constructor(gl){this.gl=gl;this.models=new Map;this.failed=new Map;this.loading=new Map;
  const v=`#version 300 es\nprecision highp float;layout(location=0) in vec3 p;layout(location=1) in vec3 n;layout(location=2) in vec2 uv;uniform mat4 vp;uniform vec3 pos;uniform float scale;out float shade;out vec2 texUV;void main(){vec3 world=p*scale+pos;gl_Position=vp*vec4(world,1.);shade=.56+.44*max(dot(normalize(n),normalize(vec3(-.45,.9,.42))),0.);texUV=uv;}`;
  const f=`#version 300 es\nprecision mediump float;in float shade;in vec2 texUV;uniform vec3 color;uniform sampler2D albedo;uniform bool textured;out vec4 frag;void main(){vec3 c=color*(textured?texture(albedo,texUV).rgb:vec3(1.));frag=vec4(c*shade,1.);}`;
  const program=gl.createProgram();gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,v));gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,f));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));this.program=program;this.loc={vp:gl.getUniformLocation(program,'vp'),pos:gl.getUniformLocation(program,'pos'),scale:gl.getUniformLocation(program,'scale'),color:gl.getUniformLocation(program,'color'),albedo:gl.getUniformLocation(program,'albedo'),textured:gl.getUniformLocation(program,'textured')};
 }
 async load(id,url){if(this.models.has(id))return this.models.get(id);if(this.loading.has(id))return this.loading.get(id);
  const pending=(async()=>{try{const response=await fetch(url);if(!response.ok)throw Error('HTTP '+response.status);const parsed=parseStaticGLB(await response.arrayBuffer()),gl=this.gl,b=parsed.bounds,span=Math.max(...b.max.map((v,i)=>v-b.min[i]))||1,center=b.max.map((v,i)=>(v+b.min[i])/2),gpu=[];
  for(const p of parsed.primitives){const positions=p.vertices.slice();for(let i=0;i<positions.length;i+=8){positions[i]=(positions[i]-center[0])/span;positions[i+1]=(positions[i+1]-b.min[1])/span;positions[i+2]=(positions[i+2]-center[2])/span;}const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,32,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,2,gl.FLOAT,false,32,24);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,p.indices,gl.STATIC_DRAW);gpu.push({vao,count:p.indices.length,color:p.color,imageIdx:p.imageIdx,vb,ib});}
  const textures=[];for(let i=0;i<parsed.images.length;i++){const im=parsed.images[i];if(!im||!globalThis.createImageBitmap)continue;try{const bmp=await createImageBitmap(new Blob([im.bytes],{type:im.mime}),{imageOrientation:'flipY'}),tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,bmp.width,bmp.height,0,gl.RGBA,gl.UNSIGNED_BYTE,bmp);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.generateMipmap(gl.TEXTURE_2D);bmp.close();textures[i]=tex;}catch(e){}}
  const model={gpu,textures,bounds:b};this.models.set(id,model);return model;
  }catch(err){this.failed.set(id,String(err));return null;}finally{this.loading.delete(id);}})();this.loading.set(id,pending);return pending;
 }
 render(vp,placements){const gl=this.gl;gl.useProgram(this.program);gl.uniformMatrix4fv(this.loc.vp,false,vp);
  for(const e of placements){const m=this.models.get(e.id);if(!m)continue;gl.uniform3f(this.loc.pos,e.x,e.y||0,e.z);gl.uniform1f(this.loc.scale,e.size||5);
   for(const g of m.gpu){gl.uniform3fv(this.loc.color,g.color);const tex=m.textures[g.imageIdx];gl.uniform1i(this.loc.textured,Boolean(tex));if(tex){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(this.loc.albedo,0);}gl.bindVertexArray(g.vao);gl.drawElements(gl.TRIANGLES,g.count,gl.UNSIGNED_INT,0);}
  }gl.bindVertexArray(null);
 }
 dispose(){const gl=this.gl;for(const m of this.models.values())for(const p of m.gpu){gl.deleteVertexArray(p.vao);gl.deleteBuffer(p.vb);gl.deleteBuffer(p.ib);}for(const m of this.models.values())for(const t of m.textures)if(t)gl.deleteTexture(t);gl.deleteProgram(this.program);this.models.clear();}
}