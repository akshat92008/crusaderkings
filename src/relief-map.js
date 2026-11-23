/** Native WebGL2 shaded 3D relief layer under the selectable campaign provinces.
 * Natural Earth II public-domain world relief imagery; supplementary stylized height
 * is procedurally approximated, NOT a scientific elevation dataset.
 */
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec2 uv;
uniform sampler2D heightMap;
uniform vec2 size;
uniform vec2 pan;
uniform float scale;
uniform float squash;
uniform float relief;
out vec2 texCoord;
out float sun;
void main(){
 vec2 geo=vec2(uv.x*360.0-180.0,uv.y*180.0-90.0);
 float h=texture(heightMap,uv).r;
 float hx=texture(heightMap,uv+vec2(.00098,0.0)).r-texture(heightMap,uv-vec2(.00098,0.0)).r;
 float hy=texture(heightMap,uv+vec2(0.0,.00195)).r-texture(heightMap,uv-vec2(0.0,.00195)).r;
 sun=clamp(.89+(hy-hx)*2.0,.71,1.16);
 vec2 pixel=vec2(size.x*.5+pan.x+geo.x*scale,size.y*.5+pan.y-geo.y*scale*squash-h*scale*relief);
 gl_Position=vec4(pixel.x/size.x*2.0-1.0,1.0-pixel.y/size.y*2.0,0.0,1.0);
 texCoord=uv;
}`;
const FS=`#version 300 es
precision mediump float;
uniform sampler2D worldColor;
uniform sampler2D heightMap;
in vec2 texCoord;
in float sun;
out vec4 frag;
void main(){
 vec3 base=texture(worldColor,texCoord).rgb;
 float h=texture(heightMap,texCoord).r;
 // Natural Earth is already shaded. Enhance mountainous relief subtly.
 float d=clamp(h*1.5,0.0,1.0);
 base*=mix(1.0,sun,d*.72);
 base=mix(base,vec3(.88,.85,.78),smoothstep(.60,.97,h)*.14);
 frag=vec4(base,1.0);
}`;
function makeShader(gl,type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const msg=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(msg);}return s;}
export function createTerrainMesh(nx=256,ny=128){
 if(!Number.isInteger(nx)||!Number.isInteger(ny)||nx<2||ny<2||nx*ny>64000)throw Error('Invalid terrain grid');
 const vertices=new Float32Array((nx+1)*(ny+1)*2);
 let k=0;for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){vertices[k++]=x/nx;vertices[k++]=y/ny;}
 const indices=new Uint16Array(nx*ny*6);k=0;for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*(nx+1)+x;indices[k++]=i;indices[k++]=i+nx+1;indices[k++]=i+1;indices[k++]=i+1;indices[k++]=i+nx+1;indices[k++]=i+nx+2;}
 return {vertices,indices};
}
export class ReliefMap{
 constructor(canvas,invalidate){this.canvas=canvas;this.invalidate=invalidate;this.ready=false;this.enabled=true;this.failReason='';this.gl=null;
  try{
   const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:true});
   if(!gl)throw Error('WebGL2 unavailable');this.gl=gl;
   const program=gl.createProgram();gl.attachShader(program,makeShader(gl,gl.VERTEX_SHADER,VS));gl.attachShader(program,makeShader(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));this.program=program;
   this.loc={size:gl.getUniformLocation(program,'size'),pan:gl.getUniformLocation(program,'pan'),scale:gl.getUniformLocation(program,'scale'),squash:gl.getUniformLocation(program,'squash'),relief:gl.getUniformLocation(program,'relief'),color:gl.getUniformLocation(program,'worldColor'),height:gl.getUniformLocation(program,'heightMap')};
   const geo=createTerrainMesh();this.indexCount=geo.indices.length;
   this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);
   const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,geo.vertices,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
   const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geo.indices,gl.STATIC_DRAW);
   gl.bindVertexArray(null);
   Promise.all([this.loadTexture('assets/terrain/natural-earth-relief.webp'),this.loadTexture('assets/terrain/terrain-height.png')]).then(([color,height])=>{this.colorTexture=color;this.heightTexture=height;this.ready=true;this.invalidate?.();}).catch(e=>{this.failReason=String(e);console.warn('Campaign relief disabled:',e);this.invalidate?.();});
  }catch(e){this.failReason=String(e);console.warn('Campaign 3D relief unavailable:',e);}
 }
 async loadTexture(url){const response=await fetch(url);if(!response.ok)throw Error(url+': HTTP '+response.status);const blob=await response.blob();const image=await createImageBitmap(blob);
  const gl=this.gl,tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,image.width,image.height,0,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.generateMipmap(gl.TEXTURE_2D);image.close();return tex;
 }
 render(w,h,dpr,zoom,panX,panY,compression){if(!this.ready||!this.gl)return false;
  const gl=this.gl,W=Math.max(1,Math.round(w*dpr)),H=Math.max(1,Math.round(h*dpr));if(this.canvas.width!==W||this.canvas.height!==H){this.canvas.width=W;this.canvas.height=H;}
  gl.viewport(0,0,W,H);gl.clearColor(.06,.15,.19,1);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(this.program);gl.uniform2f(this.loc.size,w,h);gl.uniform2f(this.loc.pan,panX,panY);gl.uniform1f(this.loc.scale,Math.min(w/355,h/150)*zoom);gl.uniform1f(this.loc.squash,compression);gl.uniform1f(this.loc.relief,compression<1?2.7:0);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.colorTexture);gl.uniform1i(this.loc.color,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.heightTexture);gl.uniform1i(this.loc.height,1);
  gl.bindVertexArray(this.vao);gl.drawElements(gl.TRIANGLES,this.indexCount,gl.UNSIGNED_SHORT,0);gl.bindVertexArray(null);return true;
 }
}
