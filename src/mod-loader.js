/**
 * Deterministic JSON Mod & Custom Scenario Pack Loader
 * Allows safe user-supplied realm, province, event, decision, and bloodline overrides.
 */
const isRec = x => !!x && typeof x === 'object' && !Array.isArray(x);
const safeKey = k => !['__proto__', 'constructor', 'prototype'].includes(k);

export function exportModTemplate() {
 return {
  id: 'example-custom-scenario',
  name: 'Example Historical Mod Pack',
  version: '1.0.0',
  author: 'Creator',
  startYear: 1450,
  factions: [
   { id: 'england', name: 'Angevin Crown', treasury: 1400, prestige: 30, culture: 'Anglo-French', faith: 'Latin Christianity' }
  ],
  provinces: [],
  decisions: [
   { id: 'mod_royal_charter', title: 'Proclaim Mod Charter', description: 'Grant chartered freedoms across the realm.', category: 'Mod', cost: 100, cooldown: 24, effects: { prestige: 8, stability: 4 } }
  ],
  bloodlines: []
 };
}

export function validateModPack(raw) {
 const obj = typeof raw === 'string'
  ? JSON.parse(raw, (k, v) => { if (!safeKey(k)) throw Error('Unsafe mod key: ' + k); return v; })
  : raw;
 if (!isRec(obj) || typeof obj.id !== 'string' || !obj.id.trim() || typeof obj.name !== 'string' || !obj.name.trim()) {
  throw Error('Mod pack requires non-empty string id and name.');
 }
 if (obj.factions && !Array.isArray(obj.factions)) throw Error('factions must be an array.');
 if (obj.provinces && !Array.isArray(obj.provinces)) throw Error('provinces must be an array.');
 if (obj.decisions && !Array.isArray(obj.decisions)) throw Error('decisions must be an array.');
 if (obj.bloodlines && !Array.isArray(obj.bloodlines)) throw Error('bloodlines must be an array.');
 for (const f of obj.factions || []) {
  if (!isRec(f) || typeof f.id !== 'string') throw Error('Each faction override requires a string id.');
 }
 for (const p of obj.provinces || []) {
  if (!isRec(p) || typeof p.id !== 'string') throw Error('Each province override requires a string id.');
 }
 for (const d of obj.decisions || []) {
  if (!isRec(d) || typeof d.id !== 'string' || typeof d.title !== 'string') throw Error('Each decision requires id and title.');
 }
 return obj;
}

export function applyModPack(g, world, raw) {
 const pack = validateModPack(raw);
 if (!g || typeof g !== 'object') throw Error('Active campaign state required.');
 g.mods ??= { applied: [], customDecisions: [] };
 if (Number.isInteger(pack.startYear) && pack.startYear >= 400 && pack.startYear <= 2000 && g.turn === 0) {
  g.year = pack.startYear;
 }

 let appliedCount = 0;
 for (const fo of pack.factions || []) {
  const f = g.factions?.[fo.id];
  if (!f) continue;
  if (typeof fo.name === 'string' && fo.name.trim()) f.name = fo.name.trim();
  if (Number.isFinite(fo.treasury)) f.treasury = fo.treasury;
  if (Number.isFinite(fo.prestige)) f.prestige = fo.prestige;
  if (typeof fo.culture === 'string' && g.civic?.realms?.[fo.id]) g.civic.realms[fo.id].culture = fo.culture;
  if (typeof fo.faith === 'string' && g.civic?.realms?.[fo.id]) g.civic.realms[fo.id].faith = fo.faith;
  appliedCount++;
 }

 for (const po of pack.provinces || []) {
  const p = g.provinces?.[po.id];
  if (!p) continue;
  if (typeof po.owner === 'string' && g.factions?.[po.owner]) p.owner = po.owner;
  if (Number.isFinite(po.population) && po.population >= 1) p.population = po.population;
  if (Number.isFinite(po.development) && po.development >= 0) p.development = po.development;
  appliedCount++;
 }

 for (const dec of pack.decisions || []) {
  if (!g.mods.customDecisions.some(x => x.id === dec.id)) {
   g.mods.customDecisions.push({
    id: dec.id,
    title: dec.title,
    description: dec.description || 'Custom scenario decision.',
    category: dec.category || 'Mod',
    cost: Math.max(0, Number(dec.cost) || 0),
    cooldown: Math.max(6, Number(dec.cooldown) || 24),
    effects: isRec(dec.effects) ? dec.effects : {}
   });
   appliedCount++;
  }
 }

 for (const bl of pack.bloodlines || []) {
  if (!isRec(bl) || typeof bl.id !== 'string' || !bl.name) continue;
  g.deepSystems ??= { bloodlines: { definitions: {}, members: {} } };
  g.deepSystems.bloodlines ??= { definitions: {}, members: {} };
  g.deepSystems.bloodlines.definitions[bl.id] = {
   id: bl.id,
   name: bl.name,
   vassalOpinion: Number(bl.vassalOpinion) || 5,
   prestigeMonthly: Number(bl.prestigeMonthly) || 0.3,
   kind: 'custom'
  };
  if (typeof bl.holder === 'string' && g.politics?.people?.[bl.holder]) {
   (g.deepSystems.bloodlines.members[bl.holder] ??= []).push(bl.id);
  }
  appliedCount++;
 }

 if (!g.mods.applied.some(m => m.id === pack.id)) {
  g.mods.applied.push({ id: pack.id, name: pack.name, version: pack.version || '1.0.0', appliedTurn: g.turn || 0 });
 }
 return { ok: true, id: pack.id, name: pack.name, appliedCount };
}
