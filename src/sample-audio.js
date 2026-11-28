// Runtime MP3 samples extracted from the supplied audio pack.
// Only the small decoded samples are loaded; original archives are not streamed.
export const SAMPLE_FILES=Object.freeze({
 steel:['steel','steel_alt'],hoof:['hoof'],order:['order'],victory:['victory'],defeat:['defeat'],
 click:['order'],seal:['order']
});
export const samplePath=id=>'assets/audio/sfx/'+id+'.mp3';
const LEVEL={steel:.63,hoof:.48,order:.55,victory:.8,defeat:.8,click:.35,seal:.45};
const sharedBytes=new Map();
async function loadBytes(url){
 if(!sharedBytes.has(url)){
  const job=fetch(url).then(r=>{if(!r.ok)throw Error('Sample HTTP '+r.status);return r.arrayBuffer();}).catch(e=>{sharedBytes.delete(url);throw e;});
  sharedBytes.set(url,job);
 }
 return sharedBytes.get(url);
}
export class SampleBank{
 constructor(context,loader=loadBytes){this.ctx=context;this.loader=loader;this.buffers=new Map();this.pending=new Map();this.cursor=new Map();this.closed=false;}
 async warm(kinds=Object.keys(SAMPLE_FILES)){
  const ids=[...new Set(kinds.flatMap(k=>SAMPLE_FILES[k]||[]))];
  return Promise.all(ids.map(id=>this.load(id)));
 }
 load(id){
  if(this.closed)return Promise.resolve(null);
  if(this.buffers.has(id))return Promise.resolve(this.buffers.get(id));
  if(this.pending.has(id))return this.pending.get(id);
  const p=Promise.resolve().then(()=>this.loader(samplePath(id))).then(raw=>this.ctx.decodeAudioData(raw.slice(0))).then(buffer=>{if(!this.closed&&buffer)this.buffers.set(id,buffer);return buffer;}).catch(()=>null).finally(()=>this.pending.delete(id));
  this.pending.set(id,p);return p;
 }
 play(kind,connect,track){
  if(this.closed)return false;
  const ids=SAMPLE_FILES[kind];if(!ids?.length)return false;
  const available=ids.filter(id=>this.buffers.has(id));if(!available.length)return false;
  const i=this.cursor.get(kind)||0,id=available[i%available.length];this.cursor.set(kind,i+1);
  let source,gain;
  try{source=this.ctx.createBufferSource();gain=this.ctx.createGain();source.buffer=this.buffers.get(id);gain.gain.value=LEVEL[kind]??.5;source.connect(gain);const extra=connect(gain);track(source,[gain,extra]);source.start();return true;}
  catch{try{source?.disconnect();gain?.disconnect();}catch{}return false;}
 }
 close(){this.closed=true;this.buffers.clear();this.pending.clear();}
}

// Curated Kenney CC0 OGG sound effects library (42 extracted SFX files in assets/audio/sfx/kenney/).
export const EXTENDED_SFX_FILES=Object.freeze({
 click:['click_001','click_002','click_003'],
 toggle:['toggle_001','switch_001'],
 seal:['confirmation_001','confirmation_002','select_004'],
 coin:['drop_001','drop_002'],
 build:['impactWood_heavy_000','impactWood_heavy_001','impactPlank_medium_000'],
 upgrade:['impactMining_000','impactMining_001','confirmation_002'],
 chime:['select_001','select_004','tick_001'],
 alert:['bong_001','impactBell_heavy_000'],
 error:['error_001'],
 open:['open_001','scroll_001'],
 close:['close_001','scroll_002'],
 march:['footstep_grass_000','footstep_grass_001','footstep_concrete_000'],
 footsteps:['footstep_wood_000','footstep_grass_000'],
 succession:['impactBell_heavy_000','impactBell_heavy_001'],
 horn:['impactBell_heavy_001','bong_001'],
 rally:['impactPlate_heavy_000','impactBell_heavy_000'],
 impact:['impactMetal_heavy_000','impactMetal_heavy_001','impactPunch_heavy_000'],
 breach:['impactMining_000','impactWood_heavy_000','impactSoft_heavy_000'],
 catapult:['impactWood_medium_000','impactWood_light_000','impactPunch_medium_000'],
 arrow:['impactWood_light_000','switch_001'],
 sword:['impactMetal_light_000','impactMetal_medium_000','impactPlate_light_000','impactPlate_medium_000','impactPlate_heavy_001']
});
export const extendedSamplePath=id=>'assets/audio/sfx/kenney/'+id+'.ogg';
const EXTENDED_LEVEL=Object.freeze({
 click:0.32,toggle:0.34,seal:0.48,coin:0.46,build:0.55,upgrade:0.55,chime:0.38,alert:0.65,error:0.45,
 open:0.35,close:0.35,march:0.42,footsteps:0.34,succession:0.72,horn:0.70,rally:0.74,
 impact:0.62,breach:0.78,catapult:0.68,arrow:0.40,sword:0.54
});

export class ExtendedSfxBank{
 constructor(ctx,loader=url=>fetch(url).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer();})){
  this.ctx=ctx;this.loader=loader;this.buffers=new Map();this.pending=new Map();this.cursor=new Map();this.closed=false;
 }
 warm(kinds=Object.keys(EXTENDED_SFX_FILES)){
  if(this.closed||!this.ctx?.decodeAudioData)return Promise.resolve([]);
  const ids=[...new Set(kinds.flatMap(k=>EXTENDED_SFX_FILES[k]||[]))];
  return Promise.all(ids.map(id=>this.load(id)));
 }
 load(id){
  if(this.buffers.has(id))return Promise.resolve(this.buffers.get(id));
  if(this.pending.has(id))return this.pending.get(id);
  const p=Promise.resolve().then(()=>this.loader(extendedSamplePath(id))).then(raw=>this.ctx.decodeAudioData(raw.slice(0))).then(buffer=>{if(!this.closed&&buffer)this.buffers.set(id,buffer);return buffer;}).catch(()=>null).finally(()=>this.pending.delete(id));
  this.pending.set(id,p);return p;
 }
 play(kind,connect,track){
  if(this.closed)return false;
  const ids=EXTENDED_SFX_FILES[kind];if(!ids?.length)return false;
  const available=ids.filter(id=>this.buffers.has(id));if(!available.length)return false;
  const i=this.cursor.get(kind)||0,id=available[i%available.length];this.cursor.set(kind,i+1);
  let source,gain;
  try{source=this.ctx.createBufferSource();gain=this.ctx.createGain();source.buffer=this.buffers.get(id);gain.gain.value=EXTENDED_LEVEL[kind]??0.48;source.connect(gain);const extra=connect(gain);track(source,[gain,extra]);source.start();return true;}
  catch{try{source?.disconnect();gain?.disconnect();}catch{}return false;}
 }
 close(){this.closed=true;this.buffers.clear();this.pending.clear();}
}
