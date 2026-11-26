import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SAVE_KEY } from '../src/portable-save.js';
import {
  BRAND_SAVE_KEY,
  saveCampaignDurable,
  loadCampaignDurable,
  readBestLocalSave,
  listSaveSlots,
  saveModPacksDurable,
  loadModPacksDurable
} from '../src/mobile-storage.js';
import { buildMonthlyDispatch, renderCrownDispatch } from '../src/dispatch-ui.js';
import { createGame } from '../src/simulation.js';

function fakeIndexedDb() {
  const stores = new Map([['saves', new Map()], ['mods', new Map()]]);
  return {
    open() {
      const req = {
        result: {
          objectStoreNames: { contains: name => stores.has(name) },
          createObjectStore: name => stores.set(name, new Map()),
          transaction(storeName) {
            const st = stores.get(storeName);
            let txDone = null;
            const tx = {
              objectStore() {
                return {
                  put(val, key) { st.set(key, val); queueMicrotask(() => tx.oncomplete?.()); },
                  get(key) {
                    const gReq = {};
                    queueMicrotask(() => { gReq.result = st.get(key); gReq.onsuccess?.(); });
                    return gReq;
                  },
                  getAllKeys() {
                    const kReq = {};
                    queueMicrotask(() => { kReq.result = [...st.keys()]; kReq.onsuccess?.(); });
                    return kReq;
                  }
                };
              },
              set oncomplete(fn) { txDone = fn; },
              get oncomplete() { return txDone; }
            };
            return tx;
          },
          close() {}
        }
      };
      queueMicrotask(() => { req.onupgradeneeded?.(); req.onsuccess?.(); });
      return req;
    }
  };
}

function fakeStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: k => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, String(v))
  };
}

test('Mobile storage handles >4MB payloads via IndexedDB and migrates legacy Crown of Nations saves', async () => {
  const idb = fakeIndexedDb();
  const storage = fakeStorage();
  const hugePayload = JSON.stringify({
    version: 1, turn: 12, year: 1451, month: 0, player: 'england',
    factions: { england: { id: 'england', treasury: 500, food: 50, stability: 80, policies: {} } },
    provinces: {}, armies: {}, pad: 'x'.repeat(4200000)
  });

  const saved = await saveCampaignDurable(hugePayload, { slot: 'autosave', storage, idb });
  assert.equal(saved.idb, true);
  const loaded = await loadCampaignDurable({ slot: 'autosave', storage, idb });
  assert.equal(loaded.source, 'indexeddb');
  assert.equal(loaded.raw.length, hugePayload.length);

  const slots = await listSaveSlots({ idb });
  assert.equal(slots.length, 1);
  assert.equal(slots[0].player, 'england');

  // Legacy migration
  const idb2 = fakeIndexedDb();
  const validLegacy = JSON.stringify({
    version: 1, turn: 2, year: 1450, month: 2, player: 'france',
    factions: { france: { id: 'france', treasury: 200, food: 40, stability: 70, policies: {} } },
    provinces: {}, armies: {}
  });
  const legacyStore = fakeStorage({ [SAVE_KEY]: validLegacy });
  assert.equal(readBestLocalSave(legacyStore), validLegacy);
  const migrated = await loadCampaignDurable({ slot: 'autosave', storage: legacyStore, idb: idb2 });
  assert.equal(migrated.source, 'legacy-migrated');
  assert.equal(legacyStore.getItem(BRAND_SAVE_KEY), validLegacy);

  // Mods durable registry
  const modOk = await saveModPacksDurable([{ id: 'custom1', name: 'Test Mod' }], { idb, storage });
  assert.equal(modOk, true);
  const mods = await loadModPacksDurable({ idb, storage });
  assert.equal(mods.length, 1);
  assert.equal(mods[0].id, 'custom1');
});

test('Crown Dispatch prioritizes invasions, heir warnings, and famine deterministically', () => {
  const world = JSON.parse(fs.readFileSync(new URL('../data/world.json', import.meta.url), 'utf8'));
  const g = createGame(world, 'england');
  g.politics.realms.england.heir = null;
  g.factions.england.food = 10;
  g.kingdom.threats.push({ by: 'france', province: 'p0', eta: 1, status: 'ready' });
  const cards = buildMonthlyDispatch(g, world, { pendingEvents: 2 });
  assert.ok(cards.length >= 4);
  assert.equal(cards[0].id, 'dispatch-invasion');
  assert.ok(cards.some(c => c.id === 'dispatch-heir'));
  assert.ok(cards.some(c => c.id === 'dispatch-famine'));
  const html = renderCrownDispatch(g, world, s => String(s));
  assert.match(html, /THE CROWN DISPATCH/);
  assert.match(html, /data-priority-tab="/);
});
