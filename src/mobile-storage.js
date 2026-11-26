import { SAVE_KEY, persistCampaign, validatePortableSave } from './portable-save.js';

export const BRAND_SAVE_KEY = 'sovereign-1450.save';
export const DB_NAME = 'sovereign1450-db';
export const DB_VERSION = 1;
export const STORE_SAVES = 'saves';
export const STORE_MODS = 'mods';

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
 const brand = storage.getItem(BRAND_SAVE_KEY);
 const legacy = storage.getItem(SAVE_KEY);
 if (brand && legacy && brand !== legacy) {
  try {
   const bt = JSON.parse(brand)?.turn ?? -1;
   const lt = JSON.parse(legacy)?.turn ?? -1;
   return lt >= bt ? legacy : brand;
  } catch {}
 }
 return brand || legacy || null;
}

export async function saveCampaignDurable(raw, { slot = 'autosave', storage = globalThis.localStorage, idb = globalThis.indexedDB } = {}) {
 if (typeof raw !== 'string' || !raw.length) return { ok: false, idb: false, local: false };
 let idbOk = false;
 let localOk = false;
 const payload = { slot, raw, updatedAt: slot === 'autosave' ? 'autosave' : slot };
 idbOk = await idbPut(STORE_SAVES, 'slot:' + slot, payload, idb);
 if (storage) {
  try {
   if (slot === 'autosave') {
    persistCampaign(storage, raw);
    if (raw.length < 1800000) storage.setItem(BRAND_SAVE_KEY, raw);
    else storage.removeItem?.(BRAND_SAVE_KEY);
    localOk = true;
   }
  } catch {
   localOk = false;
  }
 }
 return { ok: idbOk || localOk, idb: idbOk, local: localOk };
}

export async function loadCampaignDurable({ slot = 'autosave', storage = globalThis.localStorage, idb = globalThis.indexedDB } = {}) {
 const rec = await idbGet(STORE_SAVES, 'slot:' + slot, idb);
 if (rec?.raw) return { raw: rec.raw, source: 'indexeddb' };
 if (slot === 'autosave' && storage) {
  const brand = storage.getItem(BRAND_SAVE_KEY);
  if (brand) return { raw: brand, source: 'sovereign-local' };
  const legacy = storage.getItem(SAVE_KEY);
  if (legacy) {
   // Seamless migration from Crown of Nations save key
   try { validatePortableSave(legacy); await saveCampaignDurable(legacy, { slot: 'autosave', storage, idb }); } catch {}
   return { raw: legacy, source: 'legacy-migrated' };
  }
 }
 return { raw: null, source: null };
}

export async function listSaveSlots({ idb = globalThis.indexedDB } = {}) {
 const keys = await idbGetAllKeys(STORE_SAVES, idb);
 const slots = [];
 for (const k of keys) {
  if (!String(k).startsWith('slot:')) continue;
  const rec = await idbGet(STORE_SAVES, k, idb);
  if (rec?.raw) {
   let summary = { slot: String(k).slice(5), bytes: rec.raw.length };
   try {
    const parsed = JSON.parse(rec.raw);
    summary.player = parsed.player;
    summary.year = parsed.year;
    summary.month = parsed.month;
   } catch {}
   slots.push(summary);
  }
 }
 return slots;
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
