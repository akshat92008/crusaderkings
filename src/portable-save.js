// Portable saves use the existing campaign schema, not an incompatible wrapper.
export const SAVE_KEY='crown-of-nations.save';
export const MAX_SAVE_BYTES=20*1024*1024;
const record=x=>!!x&&typeof x==='object'&&!Array.isArray(x),finite=x=>typeof x==='number'&&Number.isFinite(x),safeKey=k=>!['__proto__','constructor','prototype'].includes(k);
export function validatePortableSave(raw){if(typeof raw!=='string'||!raw.length||raw.length>MAX_SAVE_BYTES)throw Error('Save file is empty or too large.');const g=JSON.parse(raw,(key,value)=>{if(!safeKey(key))throw Error('Unsafe save field.');return value;});if(!record(g)||g.version!==1||!record(g.factions)||!record(g.provinces)||!record(g.armies)||typeof g.player!=='string'||!Object.hasOwn(g.factions,g.player)||g.player==='independent')throw Error('Invalid campaign save.');
 if(!Number.isInteger(g.turn)||g.turn<0||!Number.isInteger(g.year)||g.year<1450||!Number.isInteger(g.month)||g.month<0||g.month>11)throw Error('Invalid campaign date.');
 for(const [id,p] of Object.entries(g.provinces)){if(!record(p)||p.id!==id||!Object.hasOwn(g.factions,p.owner)||!finite(p.population)||p.population<0||!finite(p.development)||!finite(p.unrest)||!record(p.buildings))throw Error('Invalid province: '+id);}
 for(const [id,a] of Object.entries(g.armies)){if(!record(a)||a.id!==id||!Object.hasOwn(g.factions,a.owner)||!Object.hasOwn(g.provinces,a.province)||!['infantry','archers','cavalry'].every(t=>Number.isInteger(a[t])&&a[t]>=0))throw Error('Invalid army: '+id);}
 for(const [id,f] of Object.entries(g.factions))if(!record(f)||f.id!==id||!finite(f.treasury)||!finite(f.food)||!finite(f.stability)||!record(f.policies))throw Error('Invalid realm: '+id);
 return g;}
export function saveFilename(g){return 'crown-of-nations-'+String(g.player).replace(/[^a-z0-9_-]/gi,'-')+'-'+g.year+'-'+String(g.month+1).padStart(2,'0')+'.json';}
export function persistCampaign(storage,raw){storage.setItem(SAVE_KEY,raw);}

/** Browser storage: retain the established localStorage schema when it fits,
 * otherwise use an atomic IndexedDB record (WebKit has a smaller quota).
 * All browser saves are serialized to prevent stale autosaves winning races.
 */
const DB_NAME='crown-of-nations.campaigns',STORE='saves';
function openSaveDB(factory){
 return new Promise((resolve,reject)=>{
  if(!factory){reject(Error('IndexedDB unavailable'));return;}
  const req=factory.open(DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||Error('Cannot open save database'));req.onblocked=()=>reject(Error('Save database blocked'));
 });
}
async function dbSave(factory,raw,remove=false){
 const db=await openSaveDB(factory);
 try{await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);
  if(remove)store.delete(SAVE_KEY);else store.put(raw,SAVE_KEY);
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Save write failed'));tx.onabort=()=>reject(tx.error||Error('Save write aborted'));
 });}finally{db.close();}
}
async function dbRead(factory){
 const db=await openSaveDB(factory);
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(SAVE_KEY);req.onsuccess=()=>resolve(req.result??null);req.onerror=()=>reject(req.error||Error('Save read failed'));});}finally{db.close();}
}
function browserStorage(){try{return globalThis.localStorage;}catch{return null;}}
let saveQueue=Promise.resolve();
export function persistBrowserCampaign(raw,storage=browserStorage(),factory=globalThis.indexedDB){
 const job=saveQueue.catch(()=>{}).then(async()=>{
  // Prefer the database once a large save has used it; a smaller later save
  // must not be shadowed by that record. Keep the old save until the new one commits.
  let existing=null;
  if(factory)try{existing=await dbRead(factory);}catch{}
  if(existing!==null){await dbSave(factory,raw);try{storage?.removeItem(SAVE_KEY);}catch{}return 'indexeddb';}
  if(storage)try{persistCampaign(storage,raw);return 'localStorage';}catch{}
  await dbSave(factory,raw);try{storage?.removeItem(SAVE_KEY);}catch{}return 'indexeddb';
 });
 saveQueue=job;return job;
}
export async function readBrowserCampaign(storage=browserStorage(),factory=globalThis.indexedDB){
 await saveQueue.catch(()=>{});
 if(factory)try{const raw=await dbRead(factory);if(typeof raw==='string')return raw;}catch{}
 try{return storage?.getItem(SAVE_KEY)??null;}catch{return null;}
}
