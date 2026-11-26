// Portable saves use the existing campaign schema, not an incompatible wrapper.
export const SAVE_KEY='crown-of-nations.save';
export const BRAND_SAVE_KEY='sovereign-1450.save';
export const MAX_SAVE_BYTES=20*1024*1024;
const record=x=>!!x&&typeof x==='object'&&!Array.isArray(x),finite=x=>typeof x==='number'&&Number.isFinite(x),safeKey=k=>!['__proto__','constructor','prototype'].includes(k);
export function validatePortableSave(raw){if(typeof raw!=='string'||!raw.length||raw.length>MAX_SAVE_BYTES)throw Error('Save file is empty or too large.');const g=JSON.parse(raw,(key,value)=>{if(!safeKey(key))throw Error('Unsafe save field.');return value;});if(!record(g)||g.version!==1||!record(g.factions)||!record(g.provinces)||!record(g.armies)||typeof g.player!=='string'||!Object.hasOwn(g.factions,g.player)||g.player==='independent')throw Error('Invalid campaign save.');
 if(!Number.isInteger(g.turn)||g.turn<0||!Number.isInteger(g.year)||g.year<400||g.year>2500||!Number.isInteger(g.month)||g.month<0||g.month>11)throw Error('Invalid campaign date.');
 for(const [id,p] of Object.entries(g.provinces)){if(!record(p)||p.id!==id||!Object.hasOwn(g.factions,p.owner)||!finite(p.population)||p.population<0||!finite(p.development)||!finite(p.unrest)||!record(p.buildings))throw Error('Invalid province: '+id);}
 for(const [id,a] of Object.entries(g.armies)){if(!record(a)||a.id!==id||!Object.hasOwn(g.factions,a.owner)||!Object.hasOwn(g.provinces,a.province)||!['infantry','archers','cavalry'].every(t=>Number.isInteger(a[t])&&a[t]>=0))throw Error('Invalid army: '+id);}
 for(const [id,f] of Object.entries(g.factions))if(!record(f)||f.id!==id||!finite(f.treasury)||!finite(f.food)||!finite(f.stability)||!record(f.policies))throw Error('Invalid realm: '+id);
 return g;}
export function saveFilename(g){return 'sovereign-1450-'+String(g.player).replace(/[^a-z0-9_-]/gi,'-')+'-'+g.year+'-'+String(g.month+1).padStart(2,'0')+'.json';}
export function persistCampaign(storage,raw){
 const writeAll=val=>{
  storage.setItem(SAVE_KEY,val);
  if(val.length<1800000){try{storage.setItem(BRAND_SAVE_KEY,val);}catch{}}
  else{try{storage.removeItem?.(BRAND_SAVE_KEY);}catch{}}
 };
 try{writeAll(raw);}
 catch(err){
  try{
   const obj=JSON.parse(raw);
   if(Array.isArray(obj.log))obj.log=obj.log.slice(0,12);
   if(Array.isArray(obj.history))obj.history=obj.history.slice(0,40);
   if(obj.deepSystems?.history)obj.deepSystems.history=obj.deepSystems.history.slice(0,40);
   if(obj.chronicles?.history)obj.chronicles.history=obj.chronicles.history.slice(0,40);
   storage.setItem(SAVE_KEY,JSON.stringify(obj));
  }catch{throw err;}
 }
}
