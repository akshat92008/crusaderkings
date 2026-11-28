// Phase 2: Authoritative WorldState Integrity Audit & Recovery
export function verifyWorldStateIntegrity(g, world = null) {
  const issues = [];
  if (!g || typeof g !== 'object') {
    return { ok: false, issues: ['Missing game state object'], stats: {} };
  }
  const factions = g.factions || {};
  const provinces = g.provinces || {};
  const armies = g.armies || {};
  const people = g.politics?.people || {};
  const realms = g.politics?.realms || {};
  const holdings = g.politics?.holdings || {};

  // 1. Numeric finiteness across all factions
  for (const [id, f] of Object.entries(factions)) {
    for (const field of ['treasury', 'food', 'stability', 'legitimacy', 'prestige']) {
      if (f[field] !== undefined && !Number.isFinite(f[field])) {
        issues.push(`Faction ${id}.${field} is non-finite (${f[field]})`);
      }
    }
    const econ = g.economy?.realms?.[id];
    if (econ) {
      for (const field of ['inflation', 'credit']) {
        if (econ[field] !== undefined && !Number.isFinite(econ[field])) {
          issues.push(`Economy ${id}.${field} is non-finite (${econ[field]})`);
        }
      }
    }
  }

  // 2. Zero negative or non-finite army counts and valid province placement
  for (const [id, a] of Object.entries(armies)) {
    for (const k of ['infantry', 'archers', 'cavalry']) {
      const v = a[k];
      if (!Number.isFinite(v) || v < 0) {
        issues.push(`Army ${id}.${k} is invalid (${v})`);
      }
    }
    if (a.province && !provinces[a.province]) {
      issues.push(`Army ${id} references unknown province ${a.province}`);
    }
    if (a.owner && a.owner !== 'independent' && !factions[a.owner]) {
      issues.push(`Army ${id} references unknown owner ${a.owner}`);
    }
  }

  // 3. Valid province owners and numeric development/population/unrest
  for (const [pid, p] of Object.entries(provinces)) {
    if (p.owner && p.owner !== 'independent' && !factions[p.owner]) {
      issues.push(`Province ${pid} has invalid owner ${p.owner}`);
    }
    for (const field of ['population', 'development', 'unrest']) {
      if (p[field] !== undefined && (!Number.isFinite(p[field]) || p[field] < 0)) {
        issues.push(`Province ${pid}.${field} is invalid (${p[field]})`);
      }
    }
  }

  // 4. Valid ruler and holding references
  for (const [rId, rs] of Object.entries(realms)) {
    if (rs?.ruler && !people[rs.ruler]) {
      issues.push(`Realm ${rId} ruler ${rs.ruler} missing from politics.people`);
    }
  }
  for (const [hid, h] of Object.entries(holdings)) {
    if (h?.lord && !people[h.lord]) {
      issues.push(`Holding ${hid} lord ${h.lord} missing from politics.people`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    stats: {
      turn: g.turn || 0,
      year: g.year || 1450,
      factions: Object.keys(factions).length,
      provinces: Object.keys(provinces).length,
      armies: Object.keys(armies).length,
      people: Object.keys(people).length,
      worldProvinces: world?.provinces?.length || Object.keys(provinces).length,
    },
  };
}

export function repairWorldStateIntegrity(g, world = null) {
  let fixed = 0;
  if (!g || typeof g !== 'object') return { fixed: 0, audit: verifyWorldStateIntegrity(g, world) };

  for (const f of Object.values(g.factions || {})) {
    for (const [field, def] of [['treasury', 0], ['food', 0], ['stability', 50], ['legitimacy', 50], ['prestige', 0]]) {
      if (!Number.isFinite(f[field])) {
        f[field] = def;
        fixed++;
      }
    }
  }
  for (const a of Object.values(g.armies || {})) {
    for (const k of ['infantry', 'archers', 'cavalry']) {
      if (!Number.isFinite(a[k]) || a[k] < 0) {
        a[k] = 0;
        fixed++;
      }
    }
  }
  for (const p of Object.values(g.provinces || {})) {
    if (p.owner && p.owner !== 'independent' && !g.factions?.[p.owner]) { p.owner = 'independent'; fixed++; }
    if (!Number.isFinite(p.population) || p.population < 1) { p.population = 10; fixed++; }
    if (!Number.isFinite(p.development) || p.development < 1) { p.development = 1; fixed++; }
    if (!Number.isFinite(p.unrest) || p.unrest < 0) { p.unrest = 0; fixed++; }
  }
  return { fixed, audit: verifyWorldStateIntegrity(g, world) };
}
