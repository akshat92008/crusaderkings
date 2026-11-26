import { SAVE_KEY, persistCampaign, validatePortableSave } from './portable-save.js';

export const BRAND_SAVE_KEY = 'sovereign-1450.save';
export const DB_NAME = 'sovereign1450-db';
export const DB_VERSION = 1;
export const STORE_SAVES = 'saves';
export const STORE_MODS = 'mods';
export const MANUAL_SLOTS = ['slot-1', 'slot-2', 'slot-3'];

function hashSave(str) {
 let h = 2166136261;
 for (let i = 0; i < str.length; i += Math.max(1, Math.floor(str.length / 4096))) {
  h = Math.imul(h ^ str.charCodeAt(i), 16777619);
 }
 return (h >>> 0).toString(16) + ':' + str.length;
}

function inspectSave(raw, expectedHash = null) {
 if (typeof raw !== 'string' || !raw.length) return null;
 if (expectedHash && hashSave(raw) !== expectedHash) return null;
 try {
  const g = validatePortableSave(raw);
  return { raw, turn: g.turn || 0, year: g.year || 1450, month: g.month || 0, player: g.player };
 } catch {
  return null;
 }
}

function openDb(idb = globalThis.indexedDB) {
 if (!idb) return Promise.resolve(null);
 return new Promise(resolve => {
  try {
   const req = idb.open(DB_NAME, DB_VERSION);
   req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains(STORE_SAVES)) db.createObjectStore(STORE_SAVES);
    if (!db.objectStoreNames.contains(STORE_MODS)) db.createObjectStore(STORE_MODS);
   };
   req.onsuccess = () => resolve(req.result);
   req.onerror = () => resolve(null);
  } catch {
   resolve(null);
  }
 });
}

function idbPut(storeName, key, value, idb = globalThis.indexedDB) {
 return openDb(idb).then(db => {
  if (!db) return false;
  return new Promise(resolve => {
   try {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value, key);
    tx.oncomplete = () => { try { db.close?.(); } catch {} resolve(true); };
    tx.onerror = () => { try { db.close?.(); } catch {} resolve(false); };
    tx.onabort = () => { try { db.close?.(); } catch {} resolve(false); };
   } catch {
    resolve(false);
   }
  });
 });
}

function idbGet(storeName, key, idb = globalThis.indexedDB) {
 return openDb(idb).then(db => {
  if (!db) return null;
  return new Promise(resolve => {
   try {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => { try { db.close?.(); } catch {} resolve(req.result ?? null); };
    req.onerror = () => { try { db.close?.(); } catch {} resolve(null); };
   } catch {
    resolve(null);
   }
  });
 });
}

function idbGetAllKeys(storeName, idb = globalThis.indexedDB) {
 return openDb(idb).then(db => {
  if (!db) return [];
  return new Promise(resolve => {
   try {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAllKeys();
    req.onsuccess = () => { try { db.close?.(); } catch {} resolve(req.result || []); };
    req.onerror = () => { try { db.close?.(); } catch {} resolve([]); };
   } catch {
    resolve([]);
   }
  });
 });
}

export function readBestLocalSave(storage = globalThis.localStorage) {
 if (!storage) return null;
 const brand = inspectSave(storage.getItem(BRAND_SAVE_KEY));
 const legacy = inspectSave(storage.getItem(SAVE_KEY));
 if (brand && legacy) return legacy.turn > brand.turn ? legacy.raw : brand.raw;
 return (brand || legacy)?.raw || null;
}

export async function saveCampaignDurable(raw, { slot = 'autosave', storage = globalThis.localStorage, idb = globalThis.indexedDB } = {}) {
 const valid = inspectSave(raw);
 if (!valid) return { ok: false, idb: false, local: false, slot, reason: 'invalid' };
 let idbOk = false;
 let localOk = false;

 if (slot === 'autosave' && idb) {
  const prevPrimary = await idbGet(STORE_SAVES, 'slot:autosave', idb);
  if (prevPrimary?.raw && inspectSave(prevPrimary.raw, prevPrimary.checksum)) {
   const prevBackup = await idbGet(STORE_SAVES, 'slot:autosave-backup', idb);
   if (prevBackup?.raw && inspectSave(prevBackup.raw, prevBackup.checksum)) {
    await idbPut(STORE_SAVES, 'slot:autosave-backup-2', { ...prevBackup, slot: 'autosave-backup-2' }, idb);
   }
   await idbPut(STORE_SAVES, 'slot:autosave-backup', { ...prevPrimary, slot: 'autosave-backup' }, idb);
  }
 }

 const payload = {
  slot,
  raw,
  checksum: hashSave(raw),
  turn: valid.turn,
  year: valid.year,
  month: valid.month,
  player: valid.player,
  updatedAt: Date.now()
 };
 idbOk = await idbPut(STORE_SAVES, 'slot:' + slot, payload, idb);

 if (storage && slot === 'autosave') {
  try {
   persistCampaign(storage, raw);
   if (raw.length < 1800000) storage.setItem(BRAND_SAVE_KEY, raw);
   else storage.removeItem?.(BRAND_SAVE_KEY);
   localOk = true;
  } catch {
   localOk = false;
  }
 }
 return { ok: idbOk || localOk, idb: idbOk, local: localOk, slot, bytes: raw.length };
}

export async function loadCampaignDurable({ slot = 'autosave', storage = globalThis.localStorage, idb = globalThis.indexedDB } = {}) {
 const primaryRec = await idbGet(STORE_SAVES, 'slot:' + slot, idb);
 const primaryIdb = primaryRec?.raw ? inspectSave(primaryRec.raw, primaryRec.checksum) : null;

 if (slot !== 'autosave') {
  return primaryIdb ? { raw: primaryIdb.raw, source: 'indexeddb', slot, turn: primaryIdb.turn } : { raw: null, source: null, slot };
 }

 const candidates = [];
 if (primaryIdb) candidates.push({ ...primaryIdb, source: 'indexeddb', priority: 3 });

 if (storage) {
  const brand = inspectSave(storage.getItem(BRAND_SAVE_KEY));
  if (brand) candidates.push({ ...brand, source: 'sovereign-local', priority: 2 });
  const legacy = inspectSave(storage.getItem(SAVE_KEY));
  if (legacy) candidates.push({ ...legacy, source: 'legacy-migrated', priority: 1 });
 }

 if (!primaryIdb) {
  for (const bk of ['slot:autosave-backup', 'slot:autosave-backup-2']) {
   const bkRec = await idbGet(STORE_SAVES, bk, idb);
   const bkValid = bkRec?.raw ? inspectSave(bkRec.raw, bkRec.checksum) : null;
   if (bkValid) candidates.push({ ...bkValid, source: 'indexeddb-backup', recovered: !!primaryRec?.raw, priority: 0 });
  }
 }

 if (!candidates.length) return { raw: null, source: null, slot };
 candidates.sort((a, b) => b.turn - a.turn || b.priority - a.priority);
 const best = candidates[0];
 if (best.source === 'legacy-migrated' && storage) {
  try {
   storage.setItem(BRAND_SAVE_KEY, best.raw);
   await saveCampaignDurable(best.raw, { slot: 'autosave', storage, idb });
  } catch {}
 }
 return { raw: best.raw, source: best.source, recovered: !!best.recovered, turn: best.turn, slot };
}

export async function listSaveSlots({ idb = globalThis.indexedDB } = {}) {
 const keys = await idbGetAllKeys(STORE_SAVES, idb);
 const slots = [];
 for (const k of keys) {
  if (!String(k).startsWith('slot:')) continue;
  const rec = await idbGet(STORE_SAVES, k, idb);
  const valid = rec?.raw ? inspectSave(rec.raw, rec.checksum) : null;
  if (valid) {
   slots.push({
    slot: String(k).slice(5),
    bytes: rec.raw.length,
    player: valid.player,
    year: valid.year,
    month: valid.month,
    turn: valid.turn
   });
  }
 }
 return slots.sort((a, b) => a.slot.localeCompare(b.slot));
}

export async function saveModPacksDurable(packs, { idb = globalThis.indexedDB, storage = globalThis.localStorage } = {}) {
 const clean = Array.isArray(packs) ? packs : [];
 const ok = await idbPut(STORE_MODS, 'registry', clean, idb);
 if (!ok && storage) {
  try { storage.setItem('sovereign-1450.mods', JSON.stringify(clean)); return true; } catch { return false; }
 }
 return ok;
}

export async function loadModPacksDurable({ idb = globalThis.indexedDB, storage = globalThis.localStorage } = {}) {
 const rec = await idbGet(STORE_MODS, 'registry', idb);
 if (Array.isArray(rec)) return rec;
 if (storage) {
  try {
   const raw = storage.getItem('sovereign-1450.mods');
   if (raw) return JSON.parse(raw);
  } catch {}
 }
 return [];
}
