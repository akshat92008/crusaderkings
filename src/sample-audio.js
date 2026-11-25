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
