/**
 * Unified Three.js 3D Tabletop Map Scene for Crown of Nations / Sovereign 1450.
 * Combines 4K Natural Earth II terrain, GPU Province ID Lookup + CK3 watercolor borders,
 * diagonal war occupation shading, bathymetric ocean waves, drifting cloud shadows,
 * GPU-instanced 3D forests, CC0 Kenney 3D castles/sieges, KayKit 3D standing armies,
 * and living maritime trade ships — while scaling gracefully down on low-end GPUs.
 */
import * as THREE from 'three';
import {detectMapQualityTier,MapPerformanceGovernor,buildTerrainBuffers} from './map-terrain-data.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hashNum(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
function rng(seed){let s=hashNum(String(seed))||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}

export function hexToRgbArray(str){
 if(str?.startsWith('rgb')){
  const m=str.match(/\d+/g);
  if(m&&m.length>=3)return [Number(m[0]),Number(m[1]),Number(m[2])];
 }
 if(/^#[\da-f]{6}$/i.test(str||''))return [parseInt(str.slice(1,3),16),parseInt(str.slice(3,5),16),parseInt(str.slice(5,7),16)];
 return [168,156,120];
}

const TERRAIN_VS=`
uniform sampler2D heightMap;
uniform float squash;
uniform float reliefDeg;
uniform float paperMix;
varying vec2 vUv;
varying vec3 vNormal;
varying float vElev;
varying vec2 vWorldPos;

void main(){
 vec2 uvPos=uv;
 float h=texture2D(heightMap,uvPos).r;
 float isLand=texture2D(heightMap,uvPos).b;
 float disp=h*isLand*reliefDeg*(1.0-paperMix*0.88);
 vec3 displaced=vec3(position.x,position.y*squash,disp);

 float du=1.0/2048.0;
 float dv=1.0/1024.0;
 float hx=texture2D(heightMap,uvPos+vec2(du,0.0)).r-texture2D(heightMap,uvPos-vec2(du,0.0)).r;
 float hy=texture2D(heightMap,uvPos+vec2(0.0,dv)).r-texture2D(heightMap,uvPos-vec2(0.0,dv)).r;
 vNormal=normalize(vec3(-hx*16.0*(1.0-paperMix*0.7),-hy*16.0*(1.0-paperMix*0.7),1.0));
 vElev=h*isLand;
 vUv=uvPos;
 vWorldPos=vec2(position.x,position.y*squash);
 gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.0);
}`;

const TERRAIN_FS=`
uniform sampler2D earthTex;
uniform sampler2D heightMap;
uniform sampler2D provIdTex;
uniform sampler2D stateTex;
uniform float time;
uniform float zoom;
uniform float paperMix;
uniform float animateWater;
uniform float showPolitical;
uniform float cloudsEnabled;
uniform float showInternalLines;
uniform float hoverProvId;
uniform float selectedProvId;
uniform vec2 idTexSize;
varying vec2 vUv;
varying vec3 vNormal;
varying float vElev;
varying vec2 vWorldPos;

float hash21(vec2 p){
 p=fract(p*vec2(127.1,311.7));
 p+=dot(p,p+34.23);
 return fract(p.x*p.y);
}
float noise2(vec2 p){
 vec2 i=floor(p),f=fract(p);
 f=f*f*(3.0-2.0*f);
 return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
            mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}
float fbm3(vec2 p){
 return noise2(p)*0.58+noise2(p*2.07)*0.29+noise2(p*4.13)*0.13;
}

float decodeId(vec4 tex){
 // Encoded as R + G * 256 (0..65535); alpha==0 means ocean/void.
 if(tex.a<0.5)return 0.0;
 return floor(tex.r*255.0+0.5)+floor(tex.g*255.0+0.5)*256.0;
}

vec4 fetchState(float id,float row){
 float u=(id+0.5)/1024.0;
 return texture2D(stateTex,vec2(u,row));
}

vec3 overlayBlend(vec3 base,vec3 tint){
 vec3 lo=2.0*base*tint;
 vec3 hi=1.0-2.0*(1.0-base)*(1.0-tint);
 return mix(lo,hi,step(0.5,base));
}

void main(){
 vec3 earth=texture2D(earthTex,vUv).rgb;
 vec4 hm=texture2D(heightMap,vUv);
 float elev=hm.r;
 float shelf=hm.g;
 float landMask=hm.b;
 float riverMask=hm.a;

 float grain=(noise2(vUv*vec2(1600.0,800.0))-0.5)*0.055+(noise2(vUv*vec2(320.0,160.0))-0.5)*0.035;

 // 1. Ocean & Inland Sea Water Shader
 if(landMask<0.42){
  vec3 shallow=vec3(0.21,0.41,0.44);
  vec3 deep=vec3(0.08,0.16,0.23);
  vec3 ocean=mix(deep,shallow,clamp(shelf*1.25,0.0,1.0));
  ocean=mix(ocean,earth*vec3(0.75,0.88,0.92),0.26);

  if(animateWater>0.5){
   float w1=sin(vUv.x*1400.0+time*1.35+vUv.y*620.0);
   float w2=cos(vUv.y*1100.0-time*1.05+vUv.x*480.0);
   float spec=pow(clamp((w1*w2)*0.5+0.5,0.0,1.0),4.0)*0.09*smoothstep(1.2,4.5,zoom);
   ocean+=vec3(0.85,0.82,0.72)*spec;
   float foam=smoothstep(0.74,0.97,shelf+sin(time*1.7+shelf*32.0)*0.035)*0.26;
   ocean=mix(ocean,vec3(0.86,0.83,0.73),foam);
  }else{
   float foam=smoothstep(0.78,0.98,shelf)*0.18;
   ocean=mix(ocean,vec3(0.82,0.79,0.69),foam);
  }
  vec3 paperSea=vec3(0.42,0.52,0.51)+grain*0.9;
  ocean=mix(ocean,paperSea,paperMix*0.65);
  gl_FragColor=vec4(ocean,1.0);
  return;
 }

 // 2. Land: Multi-frequency micro normal lighting + Natural Earth II rivers & peaks
 float mFreq=mix(260.0,620.0,clamp((zoom-1.2)/5.0,0.0,1.0));
 float m0=noise2(vUv*vec2(mFreq*2.0,mFreq));
 float mx=noise2((vUv+vec2(0.00025,0.0))*vec2(mFreq*2.0,mFreq));
 float my=noise2((vUv+vec2(0.0,0.00050))*vec2(mFreq*2.0,mFreq));
 vec3 microN=normalize(vec3((m0-mx)*2.6,(m0-my)*2.6,1.0));
 vec3 n=normalize(mix(vNormal,microN,0.34*(1.0-paperMix*0.6)));

 vec3 sunDir=normalize(vec3(-0.62,0.54,0.57));
 float ndl=clamp(dot(n,sunDir),0.0,1.0);
 float ao=clamp(0.74+elev*0.36-shelf*0.18,0.58,1.15);
 vec3 litEarth=earth*(vec3(0.44,0.45,0.48)+vec3(0.76,0.71,0.61)*ndl)*ao;

 // Crisp river tinting from extracted Natural Earth rivers
 if(riverMask>0.18){
  vec3 riverCol=vec3(0.18,0.35,0.40);
  litEarth=mix(litEarth,riverCol,clamp((riverMask-0.18)*1.3,0.0,0.78));
 }

 // Crisp coastal rim shadow
 float coastEdge=smoothstep(0.42,0.78,landMask);
 litEarth*=mix(0.68,1.0,coastEdge);

 // 3. GPU Province ID Lookup & CK3 Political + Inner-Glow Borders
 vec3 finalCol=litEarth;
 if(showPolitical>0.5){
  float pid=decodeId(texture2D(provIdTex,vUv));
  if(pid>0.5){
   // Sub-texel bilinear state-color interpolation over integer IDs (eliminates square texel steps at close zoom!)
   vec2 idCoord=vUv*idTexSize-0.5;
   vec2 idBase=floor(idCoord);
   vec2 idFrac=clamp(idCoord-idBase,0.0,1.0);
   vec2 invId=1.0/idTexSize;

   float id00=decodeId(texture2D(provIdTex,(idBase+vec2(0.5,0.5))*invId));
   float id10=decodeId(texture2D(provIdTex,(idBase+vec2(1.5,0.5))*invId));
   float id01=decodeId(texture2D(provIdTex,(idBase+vec2(0.5,1.5))*invId));
   float id11=decodeId(texture2D(provIdTex,(idBase+vec2(1.5,1.5))*invId));

   vec4 stCenter=fetchState(pid,0.25);
   vec4 c00=id00>0.5?fetchState(id00,0.25):vec4(earth,1.0);
   vec4 c10=id10>0.5?fetchState(id10,0.25):vec4(earth,1.0);
   vec4 c01=id01>0.5?fetchState(id01,0.25):vec4(earth,1.0);
   vec4 c11=id11>0.5?fetchState(id11,0.25):vec4(earth,1.0);
   vec3 smoothRgb=mix(mix(c00.rgb,c10.rgb,idFrac.x),mix(c01.rgb,c11.rgb,idFrac.x),idFrac.y);

   vec4 stMeta=fetchState(pid,0.75);  // Row 1: R,G = realmGroupId, B = occ flag / extra
   float myGroup=floor(stMeta.r*255.0+0.5)+floor(stMeta.g*255.0+0.5)*256.0;
   float occFlag=stCenter.a;

   // Luminance-preserving tint so 4K mountain ridges stay crystal-sharp inside realm colors
   vec3 soft=overlayBlend(clamp(litEarth*1.08,0.0,1.0),smoothRgb);
   float tintMix=mix(0.54,0.70,paperMix);
   finalCol=mix(litEarth,mix(soft,smoothRgb,0.32),tintMix);

   // War occupation diagonal stripes
   if(occFlag>0.25&&occFlag<0.65){
    float stripe=step(0.52,fract((vWorldPos.x+vWorldPos.y)*clamp(zoom*0.85,0.6,2.8)));
    vec3 occTint=vec3(stMeta.b,0.24,0.20);
    finalCol=mix(finalCol,occTint,stripe*0.58);
   }

   // Smooth CK3/Victoria 3 GPU inner-border watercolor ribbon
   float pxU=invId.x;
   float pxV=invId.y;
   float glowRad=clamp(6.5/sqrt(zoom),1.8,8.0);

   float diffRealmGlow=0.0;
   vec2 dirs[8];
   dirs[0]=vec2(1.0,0.0);dirs[1]=vec2(-1.0,0.0);dirs[2]=vec2(0.0,1.0);dirs[3]=vec2(0.0,-1.0);
   dirs[4]=vec2(0.7,0.7);dirs[5]=vec2(-0.7,0.7);dirs[6]=vec2(0.7,-0.7);dirs[7]=vec2(-0.7,-0.7);

   for(int i=0;i<8;i++){
    vec2 uG=vUv+dirs[i]*vec2(pxU,pxV)*glowRad;
    float gid=decodeId(texture2D(provIdTex,uG));
    if(gid<0.5){
     diffRealmGlow+=0.10;
    }else{
     vec4 gMeta=fetchState(gid,0.75);
     float gGroup=floor(gMeta.r*255.0+0.5)+floor(gMeta.g*255.0+0.5)*256.0;
     if(abs(gGroup-myGroup)>0.5)diffRealmGlow+=0.14;
    }
   }

   // Soft watercolor saturation ribbon hugging realm frontier (sharp ink frontier line drawn cleanly as vector on overlay)
   float glowStrength=smoothstep(0.08,0.86,diffRealmGlow);
   vec3 rimCol=mix(smoothRgb*1.32,vec3(0.95,0.85,0.58),0.12);
   finalCol=mix(finalCol,rimCol,glowStrength*0.50);

   // Subtle interior province highlight for selected / hovered province (vector outline drawn cleanly on overlay)
   if(abs(pid-selectedProvId)<0.5||abs(pid-hoverProvId)<0.5){
    float isSel=step(abs(pid-selectedProvId),0.5);
    finalCol=mix(finalCol,vec3(0.98,0.85,0.46),isSel>0.5?0.22:0.13);
   }
  }
 }

 // 4. Subtle moving cloud shadows on high-end desktop zooms
 if(cloudsEnabled>0.5&&zoom>1.4){
  float c=fbm3(vUv*vec2(14.0,7.0)+vec2(time*0.008,-time*0.004));
  float shadow=smoothstep(0.58,0.82,c)*0.22*(1.0-paperMix);
  finalCol*=1.0-shadow;
 }

 // Warm paper vignette when zoomed far out
 finalCol+=grain*(0.3+paperMix*0.7);
 gl_FragColor=vec4(clamp(finalCol,0.0,1.0),1.0);
}`;

const BANNER_COLORS=['#d1a040','#9c3a32','#3b6ea5','#4b8756','#7f5299'];

export class ThreeMapScene{
 constructor(canvas,invalidate,world=null){
  this.canvas=canvas;this.invalidate=invalidate;this.world=world;
  this.ready=false;this.disposed=false;this.gl=null;this.failReason='';
  this.tier=detectMapQualityTier(null);
  this.governor=new MapPerformanceGovernor(this.tier);
  this.sampleHeight=()=>0;
  this.provIdMap=new Map(); // prov.id -> 1..N integer
  this.provList=[null];     // 1-indexed array
  this.bakedKey='';
  this.lastStateSig='';
  this.assetsLoaded=false;
  this.assetModels={};
  this.tradeShips=[];

  try{
   this.renderer=new THREE.WebGLRenderer({
    canvas,
    antialias:false,
    alpha:false,
    depth:true,
    preserveDrawingBuffer:true,
    powerPreference:'default'
   });
   this.gl=this.renderer.getContext();
   if(!this.gl)throw Error('WebGL2 context unavailable');

   this.tier=detectMapQualityTier(this.gl);
   this.governor=new MapPerformanceGovernor(this.tier);

   this.renderer.outputColorSpace=THREE.SRGBColorSpace;
   this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
   this.renderer.toneMappingExposure=1.06;
   if(this.tier.id==='high'){
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
   }

   this.scene=new THREE.Scene();
   this.scene.background=new THREE.Color(0x162932);
   this.camera=new THREE.PerspectiveCamera(38,16/9,0.1,2000);
   this.camera.position.set(0,0,120);
   this.camera.lookAt(0,0,0);

   // Warm CK3 tabletop sun + cool sky bounce
   const hemi=new THREE.HemisphereLight(0xf6ecd2,0x31454a,1.15);
   this.scene.add(hemi);
   this.sun=new THREE.DirectionalLight(0xfff0d0,1.65);
   this.sun.position.set(-80,70,110);
   if(this.tier.id==='high'){
    this.sun.castShadow=true;
    this.sun.shadow.mapSize.set(1024,1024);
   }
   this.scene.add(this.sun);

   // 256x2 State Palette Texture (Row 0 = Fill RGB + OccFlag, Row 1 = GroupID + OccColor)
   this.stateData=new Uint8Array(1024*2*4);
   this.stateTex=new THREE.DataTexture(this.stateData,1024,2,THREE.RGBAFormat);
   this.stateTex.minFilter=THREE.NearestFilter;
   this.stateTex.magFilter=THREE.NearestFilter;
   this.stateTex.needsUpdate=true;

   // Placeholder 2x2 textures until async 4K PNG/WebP load completes
   const mkSolid=(r,g,b,a)=>{
    const t=new THREE.DataTexture(new Uint8Array([r,g,b,a]),1,1,THREE.RGBAFormat);
    t.needsUpdate=true;return t;
   };
   this.earthTex=mkSolid(120,130,104,255);
   this.heightTex=mkSolid(0,0,0,255);
   this.provIdTex=mkSolid(0,0,0,0);

   this.terrainUniforms={
    earthTex:{value:this.earthTex},
    heightMap:{value:this.heightTex},
    provIdTex:{value:this.provIdTex},
    stateTex:{value:this.stateTex},
    squash:{value:0.82},
    reliefDeg:{value:6.2},
    time:{value:0},
    zoom:{value:1.02},
    paperMix:{value:1.0},
    animateWater:{value:0.0},
    showPolitical:{value:1.0},
    cloudsEnabled:{value:0.0},
    showInternalLines:{value:0.0},
    hoverProvId:{value:0.0},
    selectedProvId:{value:0.0},
    idTexSize:{value:new THREE.Vector2(2048,1024)}
   };

   const geo=new THREE.PlaneGeometry(360,180,this.tier.meshNx,this.tier.meshNy);
   const mat=new THREE.ShaderMaterial({
    vertexShader:TERRAIN_VS,
    fragmentShader:TERRAIN_FS,
    uniforms:this.terrainUniforms
   });
   this.terrainMesh=new THREE.Mesh(geo,mat);
   this.terrainMesh.receiveShadow=this.tier.id==='high';
   this.scene.add(this.terrainMesh);

   // Group for dynamic 3D world props (forests, castles, siege fires, armies, ships)
   this.propsGroup=new THREE.Group();
   this.scene.add(this.propsGroup);
   this.dynamicGroup=new THREE.Group();
   this.scene.add(this.dynamicGroup);

   this._initTextures(world);
   this._initPropsAndModels();
  }catch(e){
   this.failReason=String(e);
   console.warn('ThreeMapScene unavailable:',e);
  }
 }

 _initTextures(world){
  // Load pre-baked 4K (or 1K low) Natural Earth + 2K terrain-height.png asynchronously without blocking boot
  const earthUrl=this.tier.id==='low'?'assets/terrain/natural-earth-relief-low.webp':'assets/terrain/natural-earth-relief.webp';
  const heightUrl='assets/terrain/terrain-height.png';

  const loader=new THREE.TextureLoader();
  loader.load(earthUrl,tex=>{
   if(this.disposed){tex.dispose();return;}
   tex.colorSpace=THREE.SRGBColorSpace;
   tex.minFilter=THREE.LinearMipmapLinearFilter;
   tex.magFilter=THREE.LinearFilter;
   tex.anisotropy=this.tier.id==='high'?8:2;
   if(this.earthTex)this.earthTex.dispose();
   this.earthTex=tex;
   this.terrainUniforms.earthTex.value=tex;
   this.ready=true;
   this.invalidate?.();
  },undefined,()=>{
   // Procedural fallback if external terrain images are missing
   const buf=buildTerrainBuffers(world,512,256);
   this.sampleHeight=buf.sampleHeight;
   const t=new THREE.DataTexture(buf.colorData,buf.width,buf.height,THREE.RGBAFormat);
   t.flipY=true;t.needsUpdate=true;
   this.earthTex=t;this.terrainUniforms.earthTex.value=t;
   this.ready=true;this.invalidate?.();
  });

  // Load terrain-height.png into both WebGL texture AND crisp CPU Float32Array for raycasting & 3D prop snapping
  const img=new Image();
  img.onload=()=>{
   if(this.disposed)return;
   const c=document.createElement('canvas');
   c.width=img.width;c.height=img.height;
   const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
   const px=ctx.getImageData(0,0,c.width,c.height).data;
   const W=c.width,H=c.height;
   const heights=new Float32Array(W*H);
   for(let i=0;i<W*H;i++)heights[i]=(px[i*4+2]>100?px[i*4]/255:0);
   this.sampleHeight=(lon,lat)=>{
    const u=clamp((lon+180)/360,0,0.9999),v=clamp((90-lat)/180,0,0.9999);
    const fx=u*(W-1),fy=v*(H-1),x0=Math.floor(fx),y0=Math.floor(fy),x1=Math.min(W-1,x0+1),y1=Math.min(H-1,y0+1);
    const tx=fx-x0,ty=fy-y0;
    const h00=heights[y0*W+x0],h10=heights[y0*W+x1],h01=heights[y1*W+x0],h11=heights[y1*W+x1];
    return (h00*(1-tx)+h10*tx)*(1-ty)+(h01*(1-tx)+h11*tx)*ty;
   };
   const hTex=new THREE.Texture(img);
   hTex.flipY=true;
   hTex.minFilter=THREE.LinearMipmapLinearFilter;
   hTex.magFilter=THREE.LinearFilter;
   hTex.needsUpdate=true;
   if(this.heightTex)this.heightTex.dispose();
   this.heightTex=hTex;
   this.terrainUniforms.heightMap.value=hTex;
   this._rebuildStaticForestsAndShips();
   this.ready=true;
   this.invalidate?.();
  };
  img.onerror=()=>{
   const buf=buildTerrainBuffers(world,512,256);
   this.sampleHeight=buf.sampleHeight;
   const t=new THREE.DataTexture(buf.heightRgba,buf.width,buf.height,THREE.RGBAFormat);
   t.flipY=true;t.needsUpdate=true;
   this.heightTex=t;this.terrainUniforms.heightMap.value=t;
   this.ready=true;this.invalidate?.();
  };
  img.src=heightUrl;

  if(world)this.bakeProvinceLookup(world);
 }

 _initPropsAndModels(){
  // Self-contained procedural 3D stone keeps, forest conifers, and banners avoid external texture 404s.
  this.assetsLoaded=true;
 }

 /**
  * Triangulate organic visual provinces cleanly into an exact NEAREST-filtered
  * WebGLRenderTarget lookup texture (zero anti-aliasing ID corruption!).
  */
 bakeProvinceLookup(world){
  this.world=world;
  if(!this.renderer||!world?.provinces?.length)return;
  const key=(world.meta?.mapVersion||'legacy')+':'+world.provinces.length+':'+this.tier.texW;
  if(this.bakedKey===key)return;
  this.bakedKey=key;

  this.provIdMap.clear();
  this.provList=[null];

  const idScene=new THREE.Scene();
  const idCam=new THREE.OrthographicCamera(-180,180,90,-90,0.1,10);
  idCam.position.set(0,0,5);

  const positions=[];
  const colors=[];
  let idx=1;

  for(const p of world.provinces){
   this.provIdMap.set(p.id,idx);
   this.provList.push(p);
   const r=(idx&255)/255;
   const g=((idx>>8)&255)/255;
   const polys=p.geometry?.type==='Polygon'?[p.geometry.coordinates]:p.geometry?.type==='MultiPolygon'?p.geometry.coordinates:[];
   for(const poly of polys){
    if(!poly?.[0]||poly[0].length<3)continue;
    const outer=poly[0].map(pt=>new THREE.Vector2(pt[0],pt[1]));
    const holes=poly.slice(1).filter(h=>h.length>=3).map(h=>h.map(pt=>new THREE.Vector2(pt[0],pt[1])));
    const tris=THREE.ShapeUtils.triangulateShape(outer,holes);
    const flatPts=[...outer,...holes.flat()];
    for(const [a,b,c] of tris){
     const va=flatPts[a],vb=flatPts[b],vc=flatPts[c];
     if(!va||!vb||!vc)continue;
     positions.push(va.x,va.y,0,vb.x,vb.y,0,vc.x,vc.y,0);
     colors.push(r,g,0,r,g,0,r,g,0);
    }
   }
   idx++;
  }

  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const mat=new THREE.MeshBasicMaterial({vertexColors:true,blending:THREE.NoBlending,side:THREE.DoubleSide});
  idScene.add(new THREE.Mesh(geo,mat));

  const W=this.tier.id==='high'?4096:2048;
  const H=this.tier.id==='high'?2048:1024;
  this.terrainUniforms.idTexSize.value.set(W,H);
  if(this.idTarget)this.idTarget.dispose();
  this.idTarget=new THREE.WebGLRenderTarget(W,H,{
   minFilter:THREE.NearestFilter,
   magFilter:THREE.NearestFilter,
   format:THREE.RGBAFormat,
   type:THREE.UnsignedByteType,
   depthBuffer:false,
   stencilBuffer:false
  });

  const prevTarget=this.renderer.getRenderTarget();
  const prevClear=new THREE.Color();
  this.renderer.getClearColor(prevClear);
  const prevAlpha=this.renderer.getClearAlpha();
  this.renderer.setRenderTarget(this.idTarget);
  this.renderer.setClearColor(0x000000,0.0);
  this.renderer.clear(true,false,false);
  this.renderer.render(idScene,idCam);
  this.renderer.setRenderTarget(prevTarget);
  this.renderer.setClearColor(prevClear,prevAlpha);

  geo.dispose();mat.dispose();
  this.provIdTex=this.idTarget.texture;
  this.terrainUniforms.provIdTex.value=this.provIdTex;
  this.lastStateSig='';
  this._rebuildStaticForestsAndShips();
 }

 updateProvinceStates(provinces,getColorFn,getGroupFn,getOccFn){
  const groupIds=new Map();let nextGrp=1;
  for(let i=1;i<this.provList.length;i++){
   const p=this.provList[i];if(!p)continue;
   const col=hexToRgbArray(getColorFn(p));
   const gk=String(getGroupFn(p.id)||p.owner||'independent');
   let gid=groupIds.get(gk);
   if(!gid){gid=nextGrp++;groupIds.set(gk,gid);}
   const occ=getOccFn(p.id);
   const r0=i*4;
   this.stateData[r0]=col[0];
   this.stateData[r0+1]=col[1];
   this.stateData[r0+2]=col[2];
   this.stateData[r0+3]=occ?110:255;

   const r1=(1024+i)*4;
   this.stateData[r1]=gid&255;
   this.stateData[r1+1]=(gid>>8)&255;
   this.stateData[r1+2]=occ?hexToRgbArray(occ)[0]:0;
   this.stateData[r1+3]=255;
  }
  this.stateTex.needsUpdate=true;
 }

 _rebuildStaticForestsAndShips(){
  while(this.propsGroup.children.length){
   const ch=this.propsGroup.children.pop();
   ch.geometry?.dispose?.();ch.material?.dispose?.();
  }
  if(this.tier.id==='low'||!this.world?.provinces?.length)return;

  // 1. GPU-Instanced 3D Forest Conifers & Deciduous Trees (~1,800 trees in 2 draw calls!)
  const maxTrees=this.tier.id==='high'?1800:700;
  const pinePts=[],leafPts=[];
  const random=rng('forests-3d');
  for(const p of this.world.provinces){
   if(p.terrain!=='forest'&&p.terrain!=='highlands')continue;
   const cnt=p.terrain==='forest'?8:3;
   const [cx,cy]=p.centroid||[0,0];
   for(let i=0;i<cnt&&pinePts.length+leafPts.length<maxTrees;i++){
    const lon=cx+(random()-0.5)*2.1;
    const lat=cy+(random()-0.5)*1.6;
    const h=this.sampleHeight(lon,lat);
    if(h<=0.025||h>0.68)continue;
    const item={lon,lat,h,sc:0.22+random()*0.18};
    if(lat>40||p.terrain==='highlands')pinePts.push(item);
    else leafPts.push(item);
   }
  }

  const dummy=new THREE.Object3D();
  if(pinePts.length){
   const coneGeo=new THREE.ConeGeometry(0.55,1.8,6);
   coneGeo.rotateX(Math.PI*0.5);coneGeo.translate(0,0,0.9);
   const coneMat=new THREE.MeshLambertMaterial({color:0x274c2c});
   const inst=new THREE.InstancedMesh(coneGeo,coneMat,pinePts.length);
   pinePts.forEach((pt,i)=>{
    dummy.position.set(pt.lon,pt.lat*0.82,pt.h*6.2);
    dummy.scale.set(pt.sc*1.5,pt.sc*1.5,pt.sc*1.5);
    dummy.rotation.set(0,0,random()*Math.PI*2);
    dummy.updateMatrix();
    inst.setMatrixAt(i,dummy.matrix);
   });
   inst.instanceMatrix.needsUpdate=true;
   this.propsGroup.add(inst);
  }
  if(leafPts.length){
   const sphereGeo=new THREE.DodecahedronGeometry(0.65,0);
   sphereGeo.translate(0,0,0.58);
   const sphereMat=new THREE.MeshLambertMaterial({color:0x406c32});
   const inst=new THREE.InstancedMesh(sphereGeo,sphereMat,leafPts.length);
   leafPts.forEach((pt,i)=>{
    dummy.position.set(pt.lon,pt.lat*0.82,pt.h*6.2);
    dummy.scale.set(pt.sc*1.5,pt.sc*1.5,pt.sc*1.3);
    dummy.updateMatrix();
    inst.setMatrixAt(i,dummy.matrix);
   });
   inst.instanceMatrix.needsUpdate=true;
   this.propsGroup.add(inst);
  }

  // 2. Living Maritime Trade Ships along major medieval sea lanes (high tier)
  if(this.tier.id==='high'){
   const lanes=[
    [[3,38],[14,38],[24,35]],       // Western -> Eastern Mediterranean
    [[56,22],[65,19],[72,14]],      // Hormuz -> Malabar
    [[78,9],[88,16],[98,10]],       // Coromandel -> Malacca
    [[118,22],[122,29],[130,32]],   // Ming -> Japan
    [[-6,44],[-3,49],[3,53]]        // Biscay -> Channel -> North Sea
   ];
   const shipGeo=new THREE.ConeGeometry(0.32,0.9,4);
   shipGeo.rotateX(Math.PI*0.5);
   const shipMat=new THREE.MeshLambertMaterial({color:0xdcc8a2});
   this.shipsMesh=new THREE.InstancedMesh(shipGeo,shipMat,lanes.length*2);
   this.tradeShips=[];
   lanes.forEach((pts,li)=>{
    for(let k=0;k<2;k++)this.tradeShips.push({pts,phase:(li*0.23+k*0.5)%1});
   });
   this.propsGroup.add(this.shipsMesh);
  }
 }

 syncDynamicUnits(seats,armies,game,provIndex,force=false){
  if(this.tier.id==='low')return;
  const sig=JSON.stringify([
   seats.slice(0,80).map(s=>[s.seatId,game?.provinces?.[s.seatId]?.fort||0,(game?.provinces?.[s.seatId]?.siege?.progress||0)>0]),
   (armies||[]).slice(0,120).map(a=>[a.province,a.owner,a.troops]),
   this.assetsLoaded
  ]);
  if(!force&&this.lastStateSig===sig)return;
  this.lastStateSig=sig;

  while(this.dynamicGroup.children.length){
   const ch=this.dynamicGroup.children.pop();
   if(ch.isInstancedMesh){ch.geometry?.dispose?.();ch.material?.dispose?.();}
  }

  const dummy=new THREE.Object3D();
  // Clean 3D Stone Citadel Keeps + Pointed Crimson Spires on every realm seat
  const wallGeo=new THREE.CylinderGeometry(0.52,0.62,0.75,6);wallGeo.rotateX(Math.PI*0.5);wallGeo.translate(0,0,0.38);
  const wallMat=new THREE.MeshLambertMaterial({color:0xd8ccb0});
  const roofGeo=new THREE.ConeGeometry(0.62,0.85,6);roofGeo.rotateX(Math.PI*0.5);roofGeo.translate(0,0,1.12);
  const roofMat=new THREE.MeshLambertMaterial({color:0x8e3b33});

  const seatLimit=Math.min(seats.length,this.tier.castleBudget||120);
  if(seatLimit>0){
   const wInst=new THREE.InstancedMesh(wallGeo,wallMat,seatLimit);
   const rInst=new THREE.InstancedMesh(roofGeo,roofMat,seatLimit);
   wInst.castShadow=this.tier.id==='high';
   for(let i=0;i<seatLimit;i++){
    const s=seats[i];
    const [lon,lat]=s.point;
    const h=this.sampleHeight(lon,lat);
    const sc=s.f.id===game?.player?1.15:0.85;
    dummy.position.set(lon,lat*0.82,h*6.2);
    dummy.scale.set(sc,sc,sc);
    dummy.rotation.set(0,0,(i%4)*Math.PI*0.5);
    dummy.updateMatrix();
    wInst.setMatrixAt(i,dummy.matrix);
    rInst.setMatrixAt(i,dummy.matrix);
   }
   wInst.instanceMatrix.needsUpdate=true;
   rInst.instanceMatrix.needsUpdate=true;
   this.dynamicGroup.add(wInst);
   this.dynamicGroup.add(rInst);
  }

  // Active 3D Siege Fires
  const sieged=seats.filter(s=>(game?.provinces?.[s.seatId]?.siege?.progress||0)>0);
  if(sieged.length){
   const fireGeo=new THREE.ConeGeometry(0.55,1.6,5);fireGeo.rotateX(Math.PI*0.5);
   const fireMat=new THREE.MeshBasicMaterial({color:0xf06528});
   const fInst=new THREE.InstancedMesh(fireGeo,fireMat,sieged.length);
   sieged.forEach((s,i)=>{
    const [lon,lat]=s.point;
    dummy.position.set(lon,lat*0.82,this.sampleHeight(lon,lat)*6.2+0.8);
    dummy.scale.set(1,1,1);
    dummy.updateMatrix();fInst.setMatrixAt(i,dummy.matrix);
   });
   fInst.instanceMatrix.needsUpdate=true;
   this.dynamicGroup.add(fInst);
  }

  // 3D Standing Army Pawns + Tall Heraldic Flags
  const list=armies||[];
  if(list.length){
   const pawnGeo=new THREE.CylinderGeometry(0.24,0.44,1.35,6);
   pawnGeo.rotateX(Math.PI*0.5);pawnGeo.translate(0,0,0.68);
   const pawnMat=new THREE.MeshLambertMaterial({color:0xffffff});
   const pInst=new THREE.InstancedMesh(pawnGeo,pawnMat,list.length);
   pInst.castShadow=this.tier.id==='high';

   const poleGeo=new THREE.BoxGeometry(0.95,0.10,0.58);
   poleGeo.translate(0.45,0,1.65);
   const poleMat=new THREE.MeshBasicMaterial({color:0xffffff});
   const fInst=new THREE.InstancedMesh(poleGeo,poleMat,list.length);

   const cTmp=new THREE.Color();
   list.forEach((a,i)=>{
    const prov=provIndex.get(a.province);
    const [lon,lat]=prov?.centroid||[0,0];
    const h=this.sampleHeight(lon,lat);
    dummy.position.set(lon+0.3,lat*0.82-0.22,h*6.2);
    dummy.scale.set(1.0,1.0,1.0);
    dummy.rotation.set(0,0,0);
    dummy.updateMatrix();
    pInst.setMatrixAt(i,dummy.matrix);
    fInst.setMatrixAt(i,dummy.matrix);
    const colHex=a.owner===game?.player?BANNER_COLORS[0]:game?.factions?.[game?.player]?.atWarWith?.includes(a.owner)?BANNER_COLORS[1]:(game?.factions?.[a.owner]?.color||'#6d7882');
    cTmp.set(colHex);
    pInst.setColorAt(i,cTmp);
    fInst.setColorAt(i,cTmp);
   });
   pInst.instanceMatrix.needsUpdate=true;
   fInst.instanceMatrix.needsUpdate=true;
   if(pInst.instanceColor)pInst.instanceColor.needsUpdate=true;
   if(fInst.instanceColor)fInst.instanceColor.needsUpdate=true;
   this.dynamicGroup.add(pInst);
   this.dynamicGroup.add(fInst);
  }
 }

 effectiveTier(){return this.governor.tier;}

 syncCamera(w,h,zoom,panX,panY,compression,pitchDeg){
  const scale=Math.min(Math.max(1,w)/355,Math.max(1,h)/150)*zoom;
  const centerLon=-panX/scale;
  const centerLat=panY/(scale*compression);
  const fovRad=38*Math.PI/180;
  const halfHWorld=Math.max(1,h)/(2*scale);
  const camDist=halfHWorld/Math.tan(fovRad*0.5);
  const pitchRad=pitchDeg*Math.PI/180;

  this.camera.aspect=Math.max(1,w)/Math.max(1,h);
  this.camera.fov=38;
  this.camera.near=Math.max(0.05,camDist*0.04);
  this.camera.far=Math.max(250,camDist*14);
  this.camera.position.set(centerLon,centerLat*compression-camDist*Math.sin(pitchRad),camDist*Math.cos(pitchRad));
  this.camera.up.set(0,Math.cos(pitchRad),Math.sin(pitchRad));
  this.camera.lookAt(centerLon,centerLat*compression,0);
  this.camera.updateMatrixWorld();
  this.camera.updateProjectionMatrix();
  return this.camera;
 }

 render(w,h,dpr,zoom,panX,panY,compression,opts={}){
  if(!this.ready||!this.renderer||this.disposed)return false;
  const tier=this.governor.tier;
  const cappedDpr=Math.min(dpr,tier.maxDpr);
  this.renderer.setPixelRatio(cappedDpr);
  this.renderer.setSize(Math.max(1,w),Math.max(1,h),false);

  const pitchDeg=opts.pitchDeg??computeMapPitchDeg(zoom,tier.maxPitchDeg,true);
  const paperMix=opts.paperMix??Math.max(0,Math.min(1,1-(zoom-1.25)/1.4));
  const timeSec=(opts.timeMs||0)*0.001;

  this.syncCamera(w,h,zoom,panX,panY,compression,pitchDeg);

  this.terrainUniforms.squash.value=compression;
  this.terrainUniforms.reliefDeg.value=compression<1?6.2:0.0;
  this.terrainUniforms.time.value=timeSec;
  this.terrainUniforms.zoom.value=zoom;
  this.terrainUniforms.paperMix.value=paperMix;
  this.terrainUniforms.animateWater.value=tier.animateWater?1.0:0.0;
  this.terrainUniforms.showPolitical.value=opts.showPolitical===false?0.0:1.0;
  this.terrainUniforms.cloudsEnabled.value=(tier.id==='high'&&tier.animateWater)?1.0:0.0;
  this.terrainUniforms.showInternalLines.value=zoom>=3.6?1.0:0.0;
  this.terrainUniforms.hoverProvId.value=this.provIdMap.get(opts.hoverId)||0;
  this.terrainUniforms.selectedProvId.value=this.provIdMap.get(opts.selectedId)||0;

  // Hide heavy 3D props on zoomed-out paper mode or low tier
  const showProps=tier.id!=='low'&&zoom>1.35;
  this.propsGroup.visible=showProps;
  this.dynamicGroup.visible=showProps;

  // Animate ships gently
  if(showProps&&this.shipsMesh&&this.tradeShips.length){
   const d=new THREE.Object3D();
   this.tradeShips.forEach((s,i)=>{
    const t=((timeSec*0.025+s.phase)%1);
    const p=t<0.5?t*2:(1-t)*2;
    const pts=s.pts;
    const seg=p*(pts.length-1),idx=Math.min(pts.length-2,Math.floor(seg)),ft=seg-idx;
    const lon=pts[idx][0]+(pts[idx+1][0]-pts[idx][0])*ft;
    const lat=pts[idx][1]+(pts[idx+1][1]-pts[idx][1])*ft;
    const dx=pts[idx+1][0]-pts[idx][0],dy=pts[idx+1][1]-pts[idx][1];
    d.position.set(lon,lat*compression,0.12);
    d.rotation.set(0,0,Math.atan2(dy,dx)-Math.PI*0.5+(t>=0.5?Math.PI:0));
    d.scale.set(0.65,0.65,0.65);
    d.updateMatrix();
    this.shipsMesh.setMatrixAt(i,d.matrix);
   });
   this.shipsMesh.instanceMatrix.needsUpdate=true;
  }

  this.renderer.render(this.scene,this.camera);
  return true;
 }

 dispose(){
  this.disposed=true;this.ready=false;
  this.earthTex?.dispose?.();
  this.heightTex?.dispose?.();
  this.stateTex?.dispose?.();
  this.idTarget?.dispose?.();
  this.terrainMesh?.geometry?.dispose?.();
  this.terrainMesh?.material?.dispose?.();
  this.renderer?.dispose?.();
 }
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
