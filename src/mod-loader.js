/**
 * Sovereign: 1450 — Safe JSON Scenario & Mod Loader + Complete Mod Studio Runtime
 * Supports:
 * - Start year overrides (400-2000)
 * - New custom kingdoms/realms + province assignments
 * - Custom historical/fictional characters & rulers
 * - Declarative JSON customEvents & customDecisions
 * - Custom traits, bloodlines & religions
 * - Safe key sanitation blocking __proto__ / constructor / prototype
 */
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function sanitizeModObject(val, depth = 0) {
 if (depth > 14) throw new Error('Mod JSON exceeds maximum nesting depth.');
 if (val === null || typeof val !== 'object') return val;
 if (Array.isArray(val)) return val.map(v => sanitizeModObject(v, depth + 1));
 const clean = {};
 for (const [k, v] of Object.entries(val)) {
  if (FORBIDDEN_KEYS.has(k)) throw new Error(`Unsafe mod key "${k}" blocked.`);
  clean[k] = sanitizeModObject(v, depth + 1);
 }
 return clean;
}

export function exportModTemplate() {
 return {
  id: 'angevin_pack',
  name: 'Angevin Crown Scenario',
  version: '1.1.0',
  author: 'Community Modder',
  description: 'Adds a reformed Angevin crown banner, new charter, custom event, trait, and knight.',
  startYear: 1450,
  factions: {
   england: { name: 'Angevin Crown', treasury: 900 }
  },
  kingdoms: [],
  provinceOverrides: {},
  characters: [
   {
    id: 'mod_john_talbot',
    name: 'Sir John Talbot',
    house: 'House of Talbot',
    realm: 'england',
    age: 58,
    sex: 'male',
    skills: { diplomacy: 3, martial: 5, stewardship: 2, intrigue: 3, learning: 2 },
    traits: ['brave', 'diligent']
   }
  ],
  traits: [
   { id: 'angevin_lion', name: 'Lion of Aquitaine', category: 'personal', prestigeMonthly: 0.3, martial: 1 }
  ],
  religions: [],
  customDecisions: [
   {
    id: 'mod_royal_charter',
    category: 'Mod',
    title: 'Grand Mod Charter',
    description: 'Enact custom dynastic charter from installed mod pack.',
    cost: 50,
    effects: { prestige: 10, legitimacy: 4 },
    cooldown: 12
   }
  ],
  customEvents: [
   {
    id: 'mod_angevin_tribute',
    category: 'Mod',
    title: 'Anjou Envoys Arrive',
    description: 'Delegates bearing ancestral charters offer fealty to the Angevin sovereign.',
    trigger: 'land',
    choices: [
     { label: 'Confirm their ancient charter', cost: 40, effects: { legitimacy: 6, prestige: 6 } },
     { label: 'Receive their greetings politely', cost: 0, effects: { gold: 25 } }
    ]
   }
  ],
  bloodlines: []
 };
}

export function validateModPack(raw) {
 const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
 if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
  throw new Error('Mod pack must be a JSON object.');
 }
 if (typeof raw === 'string') {
  for (const fk of FORBIDDEN_KEYS) {
   if (raw.includes(`"${fk}"`)) throw new Error(`Unsafe mod key "${fk}" blocked.`);
  }
 }
 const clean = sanitizeModObject(parsed);
 if (typeof clean.id !== 'string' || !clean.id.trim()) {
  throw new Error('Mod pack requires a non-empty string id.');
 }
 if (typeof clean.name !== 'string' || !clean.name.trim()) {
  throw new Error('Mod pack requires a non-empty string name.');
 }
 if (clean.startYear !== undefined) {
  const sy = Number(clean.startYear);
  if (!Number.isInteger(sy) || sy < 400 || sy > 2000) {
   throw new Error('Mod startYear must be an integer between 400 and 2000.');
  }
 }
 if (Array.isArray(clean.customEvents)) {
  for (const ev of clean.customEvents) {
   if (!ev?.id || !ev?.title || !Array.isArray(ev.choices) || ev.choices.length < 2) {
    throw new Error(`Invalid mod event "${ev?.id || 'unknown'}": requires id, title, and at least 2 choices.`);
   }
  }
 }
 if (Array.isArray(clean.kingdoms)) {
  for (const kd of clean.kingdoms) {
   if (!kd?.id || !kd?.name) throw new Error('Custom kingdom requires id and name.');
  }
 }
 return clean;
}

export function applyModPack(g, world, raw) {
 if (!g || typeof g !== 'object') return { ok: false, msg: 'No active campaign.' };
 const pack = validateModPack(raw);
 g.mods ??= { applied: [], customDecisions: [], customEvents: [], customTraits: {}, customReligions: {}, customKingdoms: {} };
 g.mods.applied ??= [];
 g.mods.customDecisions ??= [];
 g.mods.customEvents ??= [];
 g.mods.customTraits ??= {};
 g.mods.customReligions ??= {};
 g.mods.customKingdoms ??= {};

 let appliedCount = 0;

 if (Number.isInteger(pack.startYear)) {
  g.year = pack.startYear;
  appliedCount++;
 }

 // 1. New Custom Kingdoms / Realms
 if (Array.isArray(pack.kingdoms)) {
  for (const kd of pack.kingdoms) {
   const rid = String(kd.id).trim();
   if (!rid || rid === 'independent') continue;
   const existing = g.factions?.[rid];
   const firstOwned = Array.isArray(kd.provinceIds) && kd.provinceIds.length ? kd.provinceIds[0] : kd.capitalProvinceId;
   const provObj = firstOwned ? world?.provinces?.find(p => p.id === firstOwned) : null;
   const capCoord = kd.capital || provObj?.centroid || existing?.capital || [10, 48];
   g.factions[rid] = {
    ...(existing || {}),
    id: rid,
    name: String(kd.name),
    color: String(kd.color || existing?.color || '#b8860b'),
    government: String(kd.governmentLabel || existing?.government || 'Feudal monarchy'),
    continent: String(kd.continent || provObj?.continent || existing?.continent || 'Europe'),
    capital: capCoord,
    treasury: Number.isFinite(kd.treasury) ? kd.treasury : (existing?.treasury ?? 450),
    prestige: Number.isFinite(kd.prestige) ? kd.prestige : (existing?.prestige ?? 15),
    stability: existing?.stability ?? 75,
    legitimacy: existing?.legitimacy ?? 70,
    food: existing?.food ?? 320,
    policies: existing?.policies || { tax: 1, levy: 1, tolerance: 1 },
    relations: existing?.relations || {},
    treaties: existing?.treaties || {},
    tech: existing?.tech ?? 1
   };
   const govKey = kd.government || 'feudal';
   const culture = kd.culture || kd.name;
   const faith = kd.faith || 'Latin Christianity';
   g.civic ??= { version: 1, realms: {}, provinces: {}, events: {}, situations: {}, history: [], lastTick: -1, seed: 671901 };
   g.civic.realms[rid] = {
    ...(g.civic.realms[rid] || {}),
    government: govKey,
    culture,
    faith,
    authority: 55,
    cohesion: 68,
    patronage: 50,
    policy: 'accommodation',
    lastDecision: {},
    charterUntil: 0,
    lastElection: g.turn || 0
   };
   g.politics ??= { realms: {}, people: {}, holdings: {}, marriages: [] };
   const rulerId = kd.rulerId || `ruler_${rid}`;
   if (!g.politics.people[rulerId]) {
    g.politics.people[rulerId] = {
     id: rulerId,
     name: kd.rulerName || `Sovereign of ${kd.name}`,
     house: kd.house || `House of ${kd.name}`,
     realm: rid,
     age: 29,
     sex: 'male',
     alive: true,
     skills: { diplomacy: 3, martial: 3, stewardship: 3, intrigue: 3, learning: 3 },
     traits: ['just'],
     children: [],
     parents: [],
     wealth: 80,
     prestige: 15,
     piety: 10
    };
   }
   g.politics.realms[rid] = {
    ...(g.politics.realms[rid] || {}),
    ruler: rulerId,
    law: kd.law || 'eldest',
    council: g.politics.realms[rid]?.council || {}
   };
   if (Array.isArray(kd.provinceIds)) {
    for (const pid of kd.provinceIds) {
     if (g.provinces?.[pid]) {
      g.provinces[pid].owner = rid;
      if (g.politics.holdings?.[pid]) {
       g.politics.holdings[pid].realm = rid;
       g.politics.holdings[pid].lord = rulerId;
      }
      if (g.civic.provinces?.[pid]) {
       g.civic.provinces[pid].culture = culture;
       g.civic.provinces[pid].faith = faith;
      }
     }
    }
   }
   g.economy?.realms && (g.economy.realms[rid] ??= { inflation: 0, credit: 60, tariff: 1, tradeNet: 0, history: [] });
   g.identity?.realms && (g.identity.realms[rid] ??= { faithAuthority: 60, research: { id: 'charters', progress: 0 }, culturalCourt: {} });
   g.expanded?.realms && (g.expanded.realms[rid] ??= { active: null, concurrent: [], last: {}, decisions: {}, lastDecision: -12, lastEvent: -12 });
   g.mods.customKingdoms[rid] = kd;
   appliedCount++;
  }
 }

 // 2. Faction Overrides
 if (pack.factions && typeof pack.factions === 'object') {
  for (const [fid, patch] of Object.entries(pack.factions)) {
   const target = g.factions?.[fid];
   if (!target || !patch || typeof patch !== 'object') continue;
   if (typeof patch.name === 'string') target.name = patch.name;
   if (typeof patch.color === 'string') target.color = patch.color;
   if (Number.isFinite(patch.treasury)) target.treasury = patch.treasury;
   if (Number.isFinite(patch.prestige)) target.prestige = patch.prestige;
   appliedCount++;
  }
 }

 // 3. Province Overrides
 if (pack.provinceOverrides && typeof pack.provinceOverrides === 'object') {
  for (const [pid, patch] of Object.entries(pack.provinceOverrides)) {
   const target = g.provinces?.[pid];
   if (!target || !patch || typeof patch !== 'object') continue;
   if (typeof patch.owner === 'string' && g.factions?.[patch.owner]) target.owner = patch.owner;
   if (Number.isFinite(patch.development)) target.development = Math.max(1, Math.min(20, patch.development));
   if (Number.isFinite(patch.population)) target.population = Math.max(1, patch.population);
   if (Number.isFinite(patch.unrest)) target.unrest = Math.max(0, Math.min(100, patch.unrest));
   appliedCount++;
  }
 }

 // 4. Custom Characters
 if (Array.isArray(pack.characters)) {
  g.politics ??= { realms: {}, people: {}, holdings: {}, marriages: [] };
  g.politics.people ??= {};
  for (const ch of pack.characters) {
   if (!ch?.id || !ch?.name || !ch?.realm) continue;
   const targetRealm = g.factions?.[ch.realm] ? ch.realm : g.player;
   const rec = {
    id: ch.id,
    name: String(ch.name),
    house: String(ch.house || `House of ${targetRealm}`),
    realm: targetRealm,
    age: Number.isFinite(ch.age) ? ch.age : 28,
    sex: ch.sex === 'female' ? 'female' : 'male',
    alive: ch.alive !== false,
    skills: {
     diplomacy: Number(ch.skills?.diplomacy ?? 3),
     martial: Number(ch.skills?.martial ?? 3),
     stewardship: Number(ch.skills?.stewardship ?? 3),
     intrigue: Number(ch.skills?.intrigue ?? 3),
     learning: Number(ch.skills?.learning ?? 3)
    },
    traits: Array.isArray(ch.traits) ? [...ch.traits] : ['just'],
    parents: [],
    children: [],
    wealth: Number(ch.wealth ?? 50),
    prestige: Number(ch.prestige ?? 10),
    piety: Number(ch.piety ?? 5)
   };
   g.politics.people[ch.id] = rec;
   if (ch.makeRuler && g.politics.realms?.[targetRealm]) {
    g.politics.realms[targetRealm].ruler = rec.id;
   }
   appliedCount++;
  }
 }

 // 5. Custom Traits
 if (Array.isArray(pack.traits)) {
  for (const tr of pack.traits) {
   if (!tr?.id || !tr?.name) continue;
   g.mods.customTraits[tr.id] = tr;
   appliedCount++;
  }
 }

 // 6. Custom Religions / Faiths
 if (Array.isArray(pack.religions)) {
  g.identity ??= {};
  g.identity.faithDefinitions ??= {};
  for (const rel of pack.religions) {
   if (!rel?.id || !rel?.name) continue;
   g.identity.faithDefinitions[rel.name] = {
    parent: rel.parent || 'Latin Christianity',
    family: rel.family || rel.name,
    modded: true,
    levy: Number(rel.levy ?? 1),
    tax: Number(rel.tax ?? 1)
   };
   g.mods.customReligions[rel.id] = rel;
   if (rel.assignToRealm && g.civic?.realms?.[rel.assignToRealm]) {
    g.civic.realms[rel.assignToRealm].faith = rel.name;
   }
   appliedCount++;
  }
 }

 // 7. Custom Decisions
 if (Array.isArray(pack.customDecisions)) {
  for (const dec of pack.customDecisions) {
   if (!dec?.id || !dec?.title) continue;
   const idx = g.mods.customDecisions.findIndex(x => x.id === dec.id);
   const normalized = {
    id: dec.id,
    category: dec.category || 'Mod',
    title: dec.title,
    description: dec.description || '',
    trigger: dec.trigger || 'land',
    cost: Number(dec.cost) || 0,
    effects: dec.effects && typeof dec.effects === 'object' ? dec.effects : { prestige: 5 },
    cooldown: Number(dec.cooldown) || 12,
    modId: pack.id
   };
   if (idx >= 0) g.mods.customDecisions[idx] = normalized;
   else g.mods.customDecisions.push(normalized);
   appliedCount++;
  }
 }

 // 8. Declarative JSON Custom Events
 if (Array.isArray(pack.customEvents)) {
  for (const ev of pack.customEvents) {
   if (!ev?.id || !ev?.title || !Array.isArray(ev.choices) || ev.choices.length < 2) continue;
   const idx = g.mods.customEvents.findIndex(x => x.id === ev.id);
   const normalized = {
    id: String(ev.id),
    category: String(ev.category || 'Mod'),
    title: String(ev.title),
    description: String(ev.description || ''),
    trigger: String(ev.trigger || 'land'),
    choices: ev.choices.slice(0, 3).map(ch => ({
     label: String(ch.label || 'Decide'),
     cost: Number(ch.cost) || 0,
     effects: ch.effects && typeof ch.effects === 'object' ? ch.effects : {},
     ...(ch.next ? { next: String(ch.next) } : {})
    })),
    modId: pack.id
   };
   if (idx >= 0) g.mods.customEvents[idx] = normalized;
   else g.mods.customEvents.push(normalized);
   appliedCount++;
  }
 }

 // 9. Bloodlines
 if (Array.isArray(pack.bloodlines) && g.deepSystems?.bloodlines) {
  for (const bl of pack.bloodlines) {
   if (!bl?.id || !bl?.name || !bl?.holder) continue;
   g.deepSystems.bloodlines.definitions[bl.id] = bl;
   (g.deepSystems.bloodlines.members[bl.holder] ??= []).push(bl.id);
   appliedCount++;
  }
 }

 const existingMeta = g.mods.applied.find(m => m.id === pack.id);
 if (existingMeta) {
  existingMeta.name = pack.name;
  existingMeta.version = pack.version || '1.0.0';
  existingMeta.appliedTurn = g.turn || 0;
  existingMeta.enabled = true;
 } else {
  g.mods.applied.push({
   id: pack.id,
   name: pack.name,
   version: pack.version || '1.0.0',
   description: pack.description || '',
   appliedTurn: g.turn || 0,
   enabled: true
  });
 }
 return { ok: true, id: pack.id, name: pack.name, appliedCount };
}

export function removeModPack(g, modId) {
 if (!g?.mods) return { ok: false, msg: 'No mods loaded.' };
 g.mods.applied = (g.mods.applied || []).filter(m => m.id !== modId);
 g.mods.customDecisions = (g.mods.customDecisions || []).filter(d => d.modId !== modId);
 g.mods.customEvents = (g.mods.customEvents || []).filter(e => e.modId !== modId);
 return { ok: true, msg: `Removed mod "${modId}" from active campaign.`, modId };
}

export function listAppliedMods(g) {
 return [...(g?.mods?.applied || [])];
}
