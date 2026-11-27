/**
 * Native WebGL2 3D Perspective Shaded Relief & Bathymetric Water Renderer.
 * Matches CampaignMap's exact perspective projection & elevation heightfield
 * so raised mountains, coastal shelves, rivers, and zoom-to-paper transitions
 * stay pixel-locked with selectable campaign borders on both high-end & low-end PCs.
 */
import {detectMapQualityTier,MapPerformanceGovernor,buildTerrainBuffers} from './map-terrain-data.js';

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec2 uv;
uniform sampler2D heightMap;
uniform vec2 size;
uniform vec2 centerGeo;
uniform float scale;
uniform float squash;
uniform float relief;
uniform float pitchSin;
uniform float pitchCos;
uniform float camDist;
uniform float texStepU;
uniform float texStepV;
out vec2 texCoord;
out vec3 worldNorm;
out float elev;
out float clipDepth;

void main(){
 vec2 geo=vec2(uv.x*360.0-180.0,uv.y*180.0-90.0);
 vec4 hm=texture(heightMap,uv);
 float h=hm.r;
 float isLand=hm.b;
 float hx=texture(heightMap,uv+vec2(texStepU,0.0)).r-texture(heightMap,uv-vec2(texStepU,0.0)).r;
 float hy=texture(heightMap,uv+vec2(0.0,texStepV)).r-texture(heightMap,uv-vec2(0.0,texStepV)).r;
 worldNorm=normalize(vec3(-hx*11.5,-hy*11.5,1.0));
 elev=h*isLand;

 float dx=(geo.x-centerGeo.x)*scale;
 float dy=(geo.y-centerGeo.y)*scale*squash;
 float dz=elev*scale*relief;

 float cy=dy*pitchCos+dz*pitchSin;
 float depth=camDist+dy*pitchSin-dz*pitchCos;
 float safeDepth=max(camDist*0.18,depth);
 float clipW=safeDepth;
 float ndcX=(dx*camDist)/(size.x*0.5);
 float ndcY=(cy*camDist)/(size.y*0.5);
 // Map linear camera depth cleanly into clip Z [-0.95..0.95] so nearer peaks occlude valleys.
 float ndcZ=clamp((safeDepth-camDist)/(camDist*1.8),-0.95,0.95)*clipW;
 gl_Position=vec4(ndcX,ndcY,ndcZ,clipW);
 texCoord=uv;
 clipDepth=safeDepth/camDist;
}`;

const FS=`#version 300 es
precision highp float;
uniform sampler2D worldColor;
uniform sampler2D heightMap;
uniform float time;
uniform float paperMix;
uniform float animateWater;
uniform float zoom;
in vec2 texCoord;
in vec3 worldNorm;
in float elev;
in float clipDepth;
out vec4 frag;

float hash21(vec2 p){
 p=fract(p*vec2(234.34,435.345));
 p+=dot(p,p+34.23);
 return fract(p.x*p.y);
}
float noise2(vec2 p){
 vec2 i=floor(p),f=fract(p);
 f=f*f*(3.0-2.0*f);
 return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
            mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}

void main(){
 vec3 base=texture(worldColor,texCoord).rgb;
 vec4 hm=texture(heightMap,texCoord);
 float isLand=hm.b;
 float shelf=hm.g;

 // Paper grain shared smoothly across zoomed-out cartography & relief terrain.
 float paperNoise=noise2(texCoord*vec2(520.0,260.0))*0.06+noise2(texCoord*vec2(140.0,70.0))*0.04-0.05;

 if(isLand<0.5){
  // Ocean bathymetry + subtle illuminated waves + coastal foam.
  vec3 shallowCol=vec3(0.28,0.44,0.45);
  vec3 deepCol=vec3(0.11,0.22,0.28);
  vec3 water=mix(deepCol,shallowCol,clamp(shelf*1.15,0.0,1.0));
  if(animateWater>0.5){
   float w1=sin(texCoord.x*920.0+time*1.3+texCoord.y*410.0)*0.5+0.5;
   float w2=cos(texCoord.y*760.0-time*0.95+texCoord.x*310.0)*0.5+0.5;
   float ripple=(w1*w2-0.25)*0.045;
   water+=vec3(0.08,0.10,0.09)*ripple*smoothstep(1.2,4.0,zoom);
   float foam=smoothstep(0.76,0.98,shelf+sin(time*1.8+shelf*28.0)*0.04)*0.22;
   water=mix(water,vec3(0.84,0.82,0.74),foam);
  }else{
   float foam=smoothstep(0.80,0.98,shelf)*0.16;
   water=mix(water,vec3(0.80,0.78,0.70),foam);
  }
  vec3 paperSea=vec3(0.49,0.58,0.56)+paperNoise*0.8;
  water=mix(water,paperSea,paperMix*0.78);
  frag=vec4(water,1.0);
  return;
 }

 // Land: fragment micro-normal fBm keeps mountain ridges sharp at close zoom.
 float microFreq=mix(140.0,320.0,clamp((zoom-1.2)/5.0,0.0,1.0));
 float m0=noise2(texCoord*vec2(microFreq*2.0,microFreq));
 float mx=noise2((texCoord+vec2(0.0004,0.0))*vec2(microFreq*2.0,microFreq));
 float my=noise2((texCoord+vec2(0.0,0.0008))*vec2(microFreq*2.0,microFreq));
 vec3 microN=normalize(vec3((m0-mx)*2.2,(m0-my)*2.2,1.0));
 float detailWeight=clamp(elev*1.4+0.18,0.18,0.75)*(1.0-paperMix*0.65);
 vec3 n=normalize(mix(worldNorm,microN,detailWeight*0.42));

 // Classic CK3 upper-left warm sunlight + cool valley ambient light.
 vec3 sunDir=normalize(vec3(-0.62,0.54,0.56));
 float ndl=clamp(dot(n,sunDir),0.0,1.0);
 float ao=clamp(0.74+elev*0.36-shelf*0.20,0.58,1.14);
 vec3 lit=base*(vec3(0.36,0.39,0.44)+vec3(0.84,0.78,0.66)*ndl)*ao;

 // Soft shoreline shadow / cliff rim hugging coasts.
 lit*=mix(1.0,0.82,smoothstep(0.55,1.0,shelf)*0.45);
 // High-altitude sunlit ridge highlight.
 lit=mix(lit,vec3(0.89,0.85,0.77),smoothstep(0.68,0.98,elev)*0.18);

 // Zoom-out CK3 parchment cross-fade + subtle atmospheric horizon haze.
 vec3 paperLand=mix(vec3(0.74,0.69,0.55),base,0.38)+paperNoise;
 vec3 col=mix(lit,paperLand,paperMix*0.72);
 float haze=clamp((clipDepth-1.15)*0.45,0.0,0.22)*(1.0-paperMix);
 col=mix(col,vec3(0.76,0.74,0.67),haze);
 frag=vec4(col,1.0);
}`;

function makeShader(gl,type,code){
 const s=gl.createShader(type);
 gl.shaderSource(s,code);
 gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
  const msg=gl.getShaderInfoLog(s);
  gl.deleteShader(s);
  throw new Error(msg);
 }
 return s;
}

export function createTerrainMesh(nx=256,ny=128){
 if(!Number.isInteger(nx)||!Number.isInteger(ny)||nx<2||ny<2||nx*ny>64000)throw Error('Invalid terrain grid');
 const vertices=new Float32Array((nx+1)*(ny+1)*2);
 let k=0;for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){vertices[k++]=x/nx;vertices[k++]=y/ny;}
 const indices=new Uint16Array(nx*ny*6);k=0;for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*(nx+1)+x;indices[k++]=i;indices[k++]=i+nx+1;indices[k++]=i+1;indices[k++]=i+1;indices[k++]=i+nx+1;indices[k++]=i+nx+2;}
 return {vertices,indices};
}

export function computeMapPitchDeg(zoom,maxPitchDeg=28,useRelief=true){
 if(!useRelief||maxPitchDeg<=0||zoom<=1.35)return 0;
 const t=Math.max(0,Math.min(1,(zoom-1.35)/2.2));
 const eased=t*t*(3-2*t);
 return eased*maxPitchDeg;
}

export class ReliefMap{
 constructor(canvas,invalidate,world=null){
  this.canvas=canvas;this.invalidate=invalidate;this.world=world;
  this.ready=false;this.enabled=true;this.failReason='';this.gl=null;
  this.tier=detectMapQualityTier(null);
  this.governor=new MapPerformanceGovernor(this.tier);
  this.sampleHeight=()=>0;
  this.terrainKey='';
  try{
   const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:true,preserveDrawingBuffer:true,powerPreference:'default'});
   if(!gl)throw Error('WebGL2 unavailable');
   this.gl=gl;
   this.tier=detectMapQualityTier(gl);
   this.governor=new MapPerformanceGovernor(this.tier);

   const program=gl.createProgram();
   gl.attachShader(program,makeShader(gl,gl.VERTEX_SHADER,VS));
   gl.attachShader(program,makeShader(gl,gl.FRAGMENT_SHADER,FS));
   gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
   this.program=program;
   this.loc={
    size:gl.getUniformLocation(program,'size'),
    centerGeo:gl.getUniformLocation(program,'centerGeo'),
    scale:gl.getUniformLocation(program,'scale'),
    squash:gl.getUniformLocation(program,'squash'),
    relief:gl.getUniformLocation(program,'relief'),
    pitchSin:gl.getUniformLocation(program,'pitchSin'),
    pitchCos:gl.getUniformLocation(program,'pitchCos'),
    camDist:gl.getUniformLocation(program,'camDist'),
    texStepU:gl.getUniformLocation(program,'texStepU'),
    texStepV:gl.getUniformLocation(program,'texStepV'),
    color:gl.getUniformLocation(program,'worldColor'),
    height:gl.getUniformLocation(program,'heightMap'),
    time:gl.getUniformLocation(program,'time'),
    paperMix:gl.getUniformLocation(program,'paperMix'),
    animateWater:gl.getUniformLocation(program,'animateWater'),
    zoom:gl.getUniformLocation(program,'zoom')
   };
   const geo=createTerrainMesh(this.tier.meshNx,this.tier.meshNy);
   this.indexCount=geo.indices.length;
   this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);
   const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,geo.vertices,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
   const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geo.indices,gl.STATIC_DRAW);
   this.vb=vb;this.ib=ib;
   gl.bindVertexArray(null);
   this.rebuildTextures(world);
  }catch(e){
   this.failReason=String(e);
   console.warn('Campaign 3D relief unavailable:',e);
  }
 }

 rebuildTextures(world){
  this.world=world;
  if(!this.gl)return;
  const key=(world?.meta?.mapVersion||'legacy')+':'+(world?.provinces?.length||0)+':'+this.tier.texW+'x'+this.tier.texH;
  if(this.terrainKey===key&&this.ready)return;
  this.terrainKey=key;
  const buffers=buildTerrainBuffers(world,this.tier.texW,this.tier.texH);
  this.sampleHeight=buffers.sampleHeight;
  this.texW=buffers.width;this.texH=buffers.height;
  const upload=(oldTex,data)=>{
   const gl=this.gl;if(!gl)return null;
   if(oldTex)gl.deleteTexture(oldTex);
   const tex=gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D,tex);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,buffers.width,buffers.height,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   gl.generateMipmap(gl.TEXTURE_2D);
   return tex;
  };
  this.colorTexture=upload(this.colorTexture,buffers.colorData);
  this.heightTexture=upload(this.heightTexture,buffers.heightRgba);
  this.ready=true;
  this.invalidate?.();
 }

 effectiveTier(){return this.governor.tier;}

 dispose(){
  this.ready=false;const gl=this.gl;if(!gl)return;this.gl=null;
  if(this.colorTexture)gl.deleteTexture(this.colorTexture);
  if(this.heightTexture)gl.deleteTexture(this.heightTexture);
  if(this.vb)gl.deleteBuffer(this.vb);
  if(this.ib)gl.deleteBuffer(this.ib);
  if(this.vao)gl.deleteVertexArray(this.vao);
  if(this.program)gl.deleteProgram(this.program);
  try{gl.getExtension('WEBGL_lose_context')?.loseContext();}catch{}
 }

 render(w,h,dpr,zoom,panX,panY,compression,opts={}){
  if(!this.ready||!this.gl)return false;
  const gl=this.gl;
  const tier=this.governor.tier;
  const cappedDpr=Math.min(dpr,tier.maxDpr);
  const W=Math.max(1,Math.round(w*cappedDpr)),H=Math.max(1,Math.round(h*cappedDpr));
  if(this.canvas.width!==W||this.canvas.height!==H){this.canvas.width=W;this.canvas.height=H;}

  const scale=Math.min(w/355,h/150)*zoom;
  const centerLon=-panX/scale;
  const centerLat=panY/(scale*compression);
  const pitchDeg=opts.pitchDeg??computeMapPitchDeg(zoom,tier.maxPitchDeg,true);
  const pitchRad=pitchDeg*Math.PI/180;
  const camDist=opts.camDist??Math.max(w,h)*1.35;
  const reliefAmp=opts.reliefAmp??(compression<1?5.6:0);
  const paperMix=opts.paperMix??Math.max(0,Math.min(1,1-(zoom-1.25)/1.4));
  const timeSec=(opts.timeMs||0)*0.001;

  gl.viewport(0,0,W,H);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(.11,.22,.28,1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  gl.useProgram(this.program);
  gl.uniform2f(this.loc.size,w,h);
  gl.uniform2f(this.loc.centerGeo,centerLon,centerLat);
  gl.uniform1f(this.loc.scale,scale);
  gl.uniform1f(this.loc.squash,compression);
  gl.uniform1f(this.loc.relief,reliefAmp);
  gl.uniform1f(this.loc.pitchSin,Math.sin(pitchRad));
  gl.uniform1f(this.loc.pitchCos,Math.cos(pitchRad));
  gl.uniform1f(this.loc.camDist,camDist);
  gl.uniform1f(this.loc.texStepU,1/Math.max(256,this.texW||1024));
  gl.uniform1f(this.loc.texStepV,1/Math.max(128,this.texH||512));
  gl.uniform1f(this.loc.time,timeSec);
  gl.uniform1f(this.loc.paperMix,paperMix);
  gl.uniform1f(this.loc.animateWater,tier.animateWater?1.0:0.0);
  gl.uniform1f(this.loc.zoom,zoom);

  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.colorTexture);gl.uniform1i(this.loc.color,0);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.heightTexture);gl.uniform1i(this.loc.height,1);
  gl.bindVertexArray(this.vao);
  gl.drawElements(gl.TRIANGLES,this.indexCount,gl.UNSIGNED_SHORT,0);
  gl.bindVertexArray(null);
  return true;
 }
}
