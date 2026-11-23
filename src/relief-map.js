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
 constructor(canvas,invalidate,world=null){this.canvas=canvas;this.invalidate=invalidate;this.world=world;this.ready=false;this.enabled=true;this.failReason='';this.gl=null;
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
 createProceduralTexture(heightMode){
  // Self-contained 3D fallback: the campaign never depends on missing ZIP files.
  // This is illustrative terrain, NOT precise survey elevation.
  const W=1024,H=512,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const c=canvas.getContext('2d');
  c.fillStyle=heightMode?'#050505':'#769b94';c.fillRect(0,0,W,H);
  const polygons=this.world?.provinces||[];
  c.save();c.translate(W*.5,H*.5);c.scale(W/360,-H/180);
  for(const p of polygons){
   if(!p.geometry?.coordinates)continue;const polys=p.geometry.type==='Polygon'?[p.geometry.coordinates]:p.geometry.coordinates;
   c.beginPath();for(const poly of polys)for(const ring of poly){if(!ring.length)continue;c.moveTo(...ring[0]);for(let i=1;i<ring.length;i++)c.lineTo(...ring[i]);c.closePath();}
   c.fillStyle=heightMode?(p.terrain==='highlands'?'#707070':p.terrain==='forest'?'#292929':'#1a1a1a'):(p.terrain==='highlands'?'#b4a687':p.terrain==='forest'?'#889b75':p.terrain==='desert'?'#dbb985':'#b8b28d');
   c.fill('evenodd');
  }
  c.restore();
  if(heightMode){ // Additional stylized mountain ridges, no copyrighted texture.
   c.save();c.filter='blur(6px)';c.strokeStyle='#b1b1b1';c.lineWidth=8;
   const chains=[
    [[-78,6],[-77,-8],[-72,-23],[-70,-36],[-73,-51]],
    [[-147,62],[-128,52],[-116,43],[-107,34]],
    [[7,44],[11,46],[16,47]],[[38,42],[48,43]],
    [[68,35],[76,35],[82,31],[89,28],[96,29]],
    [[81,35],[94,33],[105,33]],[[99,22],[104,17]],
    [[26,-2],[33,-8]],[[136,35],[141,42]]
   ];
   for(const pts of chains){c.beginPath();pts.forEach(([lon,lat],i)=>{const x=(lon+180)*W/360,y=(90-lat)*H/180;i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();}
   c.restore();
  }
  return canvas;
 }
 async loadTexture(url){let image;
  try{const response=await fetch(url);if(!response.ok)throw Error(url+': HTTP '+response.status);image=await createImageBitmap(await response.blob());}
  catch(e){console.info('Using generated terrain texture:',url);image=await createImageBitmap(this.createProceduralTexture(url.includes('height')));}

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
