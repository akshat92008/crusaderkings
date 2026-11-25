import {stepCardBattle} from './simple-card-battle.js';
// Deterministic open-field regiment tactics, terrain contours, and direct orders.
const cap = (v, a, b) => Math.max(a, Math.min(b, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

export const FIELD_ORDERS = {
  advance: 'Advance',
  hold: 'Hold position',
  charge: 'Charge',
  fallback: 'Fall back',
  move: 'Move and hold'
};

function normalizeTerrainName(terrain) {
  const t = String(terrain || 'plains').toLowerCase();
  if (t === 'highlands') return 'hills';
  if (t === 'mountains') return 'mountain';
  return t;
}

/** Deterministic battlefield elevation at world (x, z) for the given terrain type. */
export function terrainHeight(x, z, terrain = 'plains') {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return 0;
  const t = normalizeTerrainName(terrain);
  if (t === 'hills') {
    const h1 = 2.15 * Math.exp(-(((x - 18) ** 2) / 340 + ((z + 8) ** 2) / 260));
    const h2 = 1.90 * Math.exp(-(((x + 20) ** 2) / 360 + ((z - 6) ** 2) / 280));
    const h3 = 1.40 * Math.exp(-((x ** 2) / 460 + ((z + 20) ** 2) / 220));
    return h1 + h2 + h3 + 0.42 * Math.sin(x * 0.055) * Math.cos(z * 0.055);
  }
  if (t === 'mountain') {
    const m1 = 3.65 * Math.exp(-(((x - 22) ** 2) / 320 + ((z + 6) ** 2) / 260));
    const m2 = 3.45 * Math.exp(-(((x + 22) ** 2) / 320 + ((z - 6) ** 2) / 260));
    const m3 = 2.25 * Math.exp(-((x ** 2) / 380 + ((z + 22) ** 2) / 240));
    return m1 + m2 + m3 + 0.72 * Math.sin(x * 0.07) * Math.cos(z * 0.06);
  }
  if (t === 'forest') {
    const k1 = 0.55 * Math.exp(-(((x + 25) ** 2 + (z - 2) ** 2) / 360));
    const k2 = 0.50 * Math.exp(-(((x - 25) ** 2 + (z + 2) ** 2) / 360));
    return k1 + k2 + 0.48 * Math.sin(x * 0.05) * Math.cos(z * 0.05);
  }
  if (t === 'desert') {
    const dune = 0.85 * Math.sin(x * 0.065 + z * 0.035) + 0.45 * Math.cos(z * 0.055 - x * 0.025);
    const ridge = 0.95 * Math.exp(-(((x - 24) ** 2 + (z + 10) ** 2) / 400));
    return dune + ridge;
  }
  if (t === 'coastal') {
    const bluff = 1.65 * Math.exp(-(((x + 18) ** 2) / 420 + ((z + 8) ** 2) / 420));
    const slope = cap((14 - x) * 0.032, -0.35, 1.4);
    return bluff + slope + 0.24 * Math.sin(x * 0.06) * Math.cos(z * 0.06);
  }
  if (t === 'marsh') {
    return 0.18 * Math.sin(x * 0.08) * Math.cos(z * 0.08) - 0.1;
  }
  return 0.28 * Math.sin(x * 0.045) * Math.cos(z * 0.055) + 0.14 * Math.cos((x - z) * 0.03);
}

/** Deterministic woodland cover zones for each battlefield terrain type. */
export function terrainForestCovers(terrain = 'plains') {
  const t = normalizeTerrainName(terrain);
  if (t === 'forest') {
    return [
      { id: 'west_woods', x: -25, z: 2, radius: 10.5, density: 1.0, label: 'Western Woods' },
      { id: 'east_woods', x: 25, z: -2, radius: 10.5, density: 1.0, label: 'Eastern Woods' },
      { id: 'north_copse', x: -14, z: -16, radius: 8.5, density: 0.9, label: 'Northern Copse' },
      { id: 'south_copse', x: 14, z: 16, radius: 8.5, density: 0.9, label: 'Southern Copse' },
      { id: 'central_thicket', x: 0, z: 0, radius: 7.5, density: 0.85, label: 'Heartwood Thicket' }
    ];
  }
  if (t === 'hills') {
    return [
      { id: 'west_copse', x: -28, z: 8, radius: 8.5, density: 0.8, label: 'Highland Copse' },
      { id: 'east_copse', x: 28, z: -8, radius: 8.5, density: 0.8, label: 'Ridge Wood' },
      { id: 'glen_wood', x: -10, z: -18, radius: 7.0, density: 0.75, label: 'Glen Wood' }
    ];
  }
  if (t === 'mountain') {
    return [
      { id: 'alpine_west', x: -30, z: 10, radius: 7.5, density: 0.7, label: 'Alpine Pines' },
      { id: 'alpine_east', x: 32, z: -10, radius: 7.5, density: 0.7, label: 'Crag Pines' }
    ];
  }
  if (t === 'coastal') {
    return [
      { id: 'dune_pines', x: -26, z: -6, radius: 7.5, density: 0.75, label: 'Coastal Pines' },
      { id: 'cove_wood', x: 22, z: 12, radius: 7.0, density: 0.75, label: 'Cove Wood' }
    ];
  }
  if (t === 'desert') {
    return [
      { id: 'oasis_palms', x: -28, z: 8, radius: 6.8, density: 0.65, label: 'Oasis Grove' }
    ];
  }
  if (t === 'marsh') {
    return [
      { id: 'fen_willows_w', x: -22, z: -4, radius: 8.0, density: 0.8, label: 'Fen Willows' },
      { id: 'fen_willows_e', x: 22, z: 6, radius: 8.0, density: 0.8, label: 'Reed Thicket' },
      { id: 'bog_grove', x: 0, z: 12, radius: 6.5, density: 0.7, label: 'Bog Copse' }
    ];
  }
  return [
    { id: 'flank_west', x: -34, z: 4, radius: 7.5, density: 0.75, label: 'West Copse' },
    { id: 'flank_east', x: 34, z: -4, radius: 7.5, density: 0.75, label: 'East Copse' }
  ];
}

function isInfantryOrSpear(g) {
  const k = g?.kind || g?.type;
  return k === 'infantry' || k === 'pikemen' || k === 'spearmen';
}

function isBracedPosture(g) {
  const o = g?.fieldOrder || g?.order;
  const form = g?.formationId;
  return !g?.moving && (o === 'hold' || form === 'shield_wall' || form === 'pike_square');
}

function liveTroopCount(g) {
  if (g.routed) return 0;
  const base = g.troopCount ?? g.maxTroops ?? g.troops ?? 0;
  const initLife = Math.max(1, g.initialLife || 100);
  return Math.max(0, Math.round(base * cap((g.life || 0) / initLife, 0, 1)));
}

function syncOrderAliases(g, order, mx, mz) {
  g.fieldOrder = order;
  g.order = order;
  if (Number.isFinite(mx)) {
    g.anchorX = mx;
    g.moveX = mx;
  }
  if (Number.isFinite(mz)) {
    g.anchorZ = mz;
    g.moveZ = mz;
  }
}

export function initializeFieldGroup(g) {
  if (g.kind && !g.type) {
    g.type = (g.kind === 'pikemen' || g.kind === 'spearmen') ? 'infantry' : g.kind;
  }
  if (!g.kind) {
    if (g.type === 'pikemen' || g.type === 'spearmen') {
      g.kind = g.type;
      g.type = 'infantry';
    } else {
      g.kind = (g.type === 'infantry' && g.formationId === 'pike_square') ? 'pikemen' : (g.type || 'infantry');
    }
  }
  if (typeof g.order === 'number') g.slot = g.order;
  g.lane ??= Number.isFinite(g.slot) ? Math.min(2, Math.floor(g.slot / 2)) : 1;

  const initialOrder = g.fieldOrder || (typeof g.order === 'string' && Object.hasOwn(FIELD_ORDERS, g.order) ? g.order : 'advance');
  g.homeDirection = Math.sign(g.z) || (g.side === 'attacker' ? 1 : -1);

  const ax = g.anchorX ?? g.moveX ?? g.x;
  const az = g.anchorZ ?? g.moveZ ?? g.z;
  syncOrderAliases(g, initialOrder, ax, az);

  g.focusTargetId = g.focusTargetId ?? g.focusTarget ?? null;
  g.focusTarget = g.focusTargetId;

  g.fatigue = g.fatigue ?? (Number.isFinite(g.stamina) ? cap(100 - g.stamina, 0, 100) : 0);
  g.stamina = cap(100 - g.fatigue, 0, 100);

  g.facingX = g.facingX ?? 0;
  g.facingZ = g.facingZ ?? (g.side === 'attacker' ? -1 : 1);
  g.facing = Math.atan2(g.facingX, g.facingZ);
  g.vx = g.vx ?? 0;
  g.vz = g.vz ?? 0;

  g.troopCount = g.troopCount ?? g.troops ?? g.maxTroops ?? 0;
  g.maxTroops = g.maxTroops ?? g.troopCount;
  g.initialLife = g.initialLife ?? (g.life > 0 ? g.life : 100);
  g.life = g.life ?? (g.troopCount > 0 ? 100 : 0);
  g.troops = liveTroopCount(g);
  g.initialMorale = g.initialMorale ?? g.morale;

  g.attackPulse = 0;
  g.moving = false;
  g.routAge = g.routAge || 0;
  g.cohesion = g.cohesion ?? 100;
  g.chargeMomentum = cap(g.chargeMomentum || 0, 0, 1);
  g.flankedTimer = g.flankedTimer || 0;
  g.flanked = g.flankedTimer > 0;
  g.rallyBuffTimer = g.rallyBuffTimer || 0;
  g.bracedCounterTimer = g.bracedCounterTimer || 0;
  g.statusFlags = g.routed ? ['ROUT'] : [];
  g.status = g.routed ? 'routing' : initialOrder === 'hold' ? 'holding' : 'ready';
  return g;
}

export function issueFieldOrder(g, order, point) {
  if (!g || g.routed || !Object.hasOwn(FIELD_ORDERS, order) || (order === 'move' && (!point || !Number.isFinite(point[0]) || !Number.isFinite(point[1])))) {
    return false;
  }
  let ax = g.x;
  let az = g.z;
  if (order === 'move') {
    ax = cap(point[0], -64, 64);
    az = cap(point[1], -46, 46);
  } else if (order === 'fallback') {
    az = cap(g.z + (g.homeDirection || (g.side === 'attacker' ? 1 : -1)) * 16, -46, 46);
    ax = cap(g.x, -64, 64);
  }
  syncOrderAliases(g, order, ax, az);
  if (order === 'move') {
    g.focusTargetId = null;
    g.focusTarget = null;
  }
  return true;
}

/** Issue a direct battlefield coordinate march order to a regiment. */
export function issueGroupMoveOrder(group, x, z, opts = {}) {
  if (!group || group.routed || group.life <= 0 || !Number.isFinite(x) || !Number.isFinite(z)) return false;
  const mx = cap(x, -64, 64);
  const mz = cap(z, -46, 46);
  syncOrderAliases(group, 'move', mx, mz);
  group.targetX = mx;
  group.targetZ = mz;
  if (!opts.attackMove) {
    group.focusTargetId = null;
    group.focusTarget = null;
  }
  group.manualOrder = true;
  group.status = 'moving';
  return true;
}

/** Issue a direct regiment-vs-regiment attack focus order. */
export function issueGroupTargetOrder(group, targetGroup) {
  if (!group || group.routed || group.life <= 0 || !targetGroup || targetGroup.routed || targetGroup.life <= 0 || targetGroup.side === group.side) {
    return false;
  }
  group.focusTargetId = targetGroup.id;
  group.focusTarget = targetGroup.id;
  const nextOrder = group.fieldOrder === 'charge' || group.type === 'cavalry' ? 'charge' : 'advance';
  syncOrderAliases(group, nextOrder, targetGroup.x, targetGroup.z);
  group.targetX = cap(targetGroup.x, -64, 64);
  group.targetZ = cap(targetGroup.z, -46, 46);
  group.manualOrder = true;
  group.status = nextOrder === 'charge' ? 'charging' : 'engaging';
  return true;
}

/** Sound the commander rally horn on cooldown to restore morale & grant temporary shock resistance. */
export function triggerRallyHorn(battleState, side = 'attacker', opts = {}) {
  if (!battleState?.groups) return { ok: false, rallied: 0, cooldown: 0 };
  const cooldownDuration = Number.isFinite(opts.cooldown) ? Math.max(1, opts.cooldown) : 25;
  const now = Number.isFinite(battleState.elapsed) ? battleState.elapsed : (battleState.fieldTime ?? battleState.time ?? 0);
  battleState.rallyCooldowns ??= {};
  const readyAt = battleState.rallyCooldowns[side] ?? -Infinity;
  if (now < readyAt) {
    const remaining = Math.max(0, +(readyAt - now).toFixed(2));
    return { ok: false, rallied: 0, cooldown: remaining, remaining };
  }

  let rallied = 0;
  let sumX = 0;
  let sumZ = 0;
  for (const g of battleState.groups) {
    if (g.side !== side) continue;
    const maxT = g.troopCount ?? g.maxTroops ?? g.troops ?? 0;
    const destroyed = g.life < 8 || maxT <= 0;
    if (destroyed) continue;
    const wasRouted = !!g.routed;
    if (wasRouted && (g.routAge || 0) >= 3) continue;

    g.morale = cap((g.morale || 0) + 22, 0, 100);
    g.rallyBuffTimer = 8;
    if (wasRouted && g.morale > 14) {
      g.routed = false;
      g.routAge = 0;
      syncOrderAliases(g, 'hold', g.x, g.z);
      g.status = 'holding';
    }
    g.troops = liveTroopCount(g);
    rallied++;
    sumX += g.x || 0;
    sumZ += g.z || 0;
  }

  battleState.rallyCooldowns[side] = now + cooldownDuration;
  if (rallied > 0 && Array.isArray(battleState.effects)) {
    battleState.effects.push({ kind: 'rally', x: sumX / rallied, z: sumZ / rallied, age: 0, duration: 1.1, seed: battleState.fieldSeed ?? 0 });
  }
  return { ok: true, rallied, cooldown: cooldownDuration, remaining: cooldownDuration };
}

export function fieldTarget(g, enemies) {
  let best;
  let lowest = Infinity;
  for (const e of enemies) {
    const score = dist(g, e) + (
      g.type === 'cavalry'
        ? (e.type === 'archers' ? -12 : (e.formationId === 'pike_square' || e.kind === 'pikemen') ? 20 : 0)
        : (g.type === 'archers' && e.type === 'cavalry' ? -4 : 0)
    );
    if (score < lowest || (score === lowest && String(e.id).localeCompare(String(best?.id)) < 0)) {
      best = e;
      lowest = score;
    }
  }
  return best;
}

export function fieldTerrain(g, terrain = 'plains') {
  const t = normalizeTerrainName(terrain);
  const height = terrainHeight(g.x, g.z, t);
  const covers = terrainForestCovers(t);
  const grove = covers.find(c => Math.hypot(g.x - c.x, g.z - c.z) <= c.radius) || null;
  const highGround = height >= 1.15;
  const edge = Math.abs(g.x);

  if (grove) {
    const edgeFactor = edge >= 50 ? 0.85 : 1;
    return {
      name: grove.label,
      speed: (g.type === 'cavalry' ? 0.74 : 0.92) * edgeFactor,
      cover: 1.54,
      rangedMitigation: 0.65,
      inForestCover: true,
      highGround,
      height,
      grove
    };
  }
  if (edge >= 50) {
    return { name: 'Rough ground', speed: g.type === 'cavalry' ? 0.68 : 0.82, cover: 1.22, rangedMitigation: 1 / 1.22, inForestCover: false, highGround, height, grove: null };
  }
  if (edge >= 38) {
    return { name: 'Broken ground', speed: g.type === 'cavalry' ? 0.85 : 0.94, cover: 1.10, rangedMitigation: 1 / 1.10, inForestCover: false, highGround, height, grove: null };
  }
  if (t === 'marsh') {
    return { name: 'Marshland', speed: g.type === 'cavalry' ? 0.72 : 0.86, cover: 1.05, rangedMitigation: 1 / 1.05, inForestCover: false, highGround, height, grove: null };
  }
  return { name: highGround ? 'High ground' : 'Open field', speed: 1, cover: 1, rangedMitigation: 1, inForestCover: false, highGround, height, grove: null };
}

export function attackAspect(g, e) {
  const dx = g.x - e.x;
  const dz = g.z - e.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.01) return 'front';
  const fx = e.facingX || 0;
  const fz = e.facingZ ?? (e.side === 'attacker' ? -1 : 1);
  const f = Math.hypot(fx, fz) || 1;
  const dot = (dx * fx + dz * fz) / (d * f);
  return dot < -0.55 ? 'rear' : Math.abs(dot) < 0.55 ? 'flank' : 'front';
}

export function coordinateFieldAI(state) {
  const live = state.groups.filter(g => !g.routed);
  const ours = live.filter(g => g.side === 'defender');
  const enemy = live.filter(g => g.side === 'attacker');
  if (!ours.length || !enemy.length) return 'ended';

  const strength = fieldStrength(ours, 'defender');
  const opposition = fieldStrength(enemy, 'attacker');
  const archers = ours.filter(g => g.type === 'archers');
  const infantry = ours.filter(g => g.type === 'infantry');
  const cavalry = ours.filter(g => g.type === 'cavalry');
  const danger = enemy.filter(g => g.type === 'cavalry' && archers.some(a => dist(a, g) < 21));
  const exposed = enemy.filter(g => g.type === 'archers' && !enemy.some(a => a.type === 'infantry' && dist(a, g) < 7));

  const posture = danger.length && infantry.length
    ? 'Screen archers'
    : exposed.length && cavalry.length
      ? 'Flank archers'
      : strength < opposition * 0.70
        ? 'Defensive regroup'
        : 'Coordinated advance';
  state.enemyPosture = posture;

  for (const g of ours) {
    delete g.focusTarget;
    g.focusTargetId = null;
    const e = fieldTarget(g, enemy);
    if (!e) continue;
    if (g.fieldOrder === 'fallback') {
      if (g.morale >= 58 && !enemy.some(x => dist(g, x) < 12)) issueFieldOrder(g, 'advance');
      continue;
    }
    if ((g.morale < 32 || (g.morale < 38 && numericalPower(g, e) < 0.8)) && dist(g, e) < 16) {
      if (g.fieldOrder !== 'fallback' && g.fieldOrder !== 'hold') issueFieldOrder(g, 'fallback');
      continue;
    }
    if (g.type === 'infantry' && danger.length && archers.length) {
      const a = archers.slice().sort((x, y) => dist(g, x) - dist(g, y))[0];
      const threat = danger.slice().sort((x, y) => dist(a, x) - dist(a, y))[0];
      const d = dist(a, threat) || 1;
      const point = [a.x + (threat.x - a.x) / d * 4, a.z + (threat.z - a.z) / d * 4];
      if (dist(g, { x: point[0], z: point[1] }) > 3) issueFieldOrder(g, 'move', point);
      else if (g.fieldOrder !== 'hold') issueFieldOrder(g, 'hold');
      continue;
    }
    if (g.type === 'cavalry' && exposed.length && g.fatigue < 70) {
      const tgt = exposed.slice().sort((a, b) => dist(g, a) - dist(g, b))[0];
      g.focusTarget = tgt.id;
      g.focusTargetId = tgt.id;
      if (g.fieldOrder !== 'charge') issueFieldOrder(g, 'charge');
      continue;
    }
    delete g.focusTarget;
    g.focusTargetId = null;
    if (posture === 'Defensive regroup' && g.type === 'infantry' && dist(g, e) > g.range * 2 && dist(g, e) < 20) {
      if (g.fieldOrder !== 'hold') issueFieldOrder(g, 'hold');
    } else if (g.fieldOrder !== 'advance') {
      issueFieldOrder(g, 'advance');
    }
  }
  return posture;
}

function targetPosition(g, e, enemies, simpleField = false) {
  const order = g.fieldOrder || 'advance';
  if (['hold', 'move', 'fallback'].includes(order)) {
    return { point: [g.anchorX ?? g.x, g.anchorZ ?? g.z], skirmishing: false };
  }

  // Card battles advance to weapon range and engage, without automatic kiting.
  if (simpleField) {
    const d = dist(g, e);
    const preferred = g.type === 'archers' ? g.range * 0.80 : Math.min(1.5, g.range * 0.65);
    if (d <= preferred) return {point: [g.x, g.z], skirmishing: false};
    return {point: [e.x - (e.x-g.x)/d*preferred, e.z - (e.z-g.z)/d*preferred], skirmishing: false};
  }
  // Ranged groups automatically kite when enemy melee closes within < 14 units (unless holding).
  if (g.type === 'archers' && order !== 'charge') {
    const meleeThreats = enemies
      .filter(x => x.type !== 'archers' && dist(g, x) < 14)
      .sort((a, b) => dist(g, a) - dist(g, b) || String(a.id).localeCompare(String(b.id)));
    if (meleeThreats.length) {
      const threat = meleeThreats[0];
      let dx = threat.x - g.x;
      let dz = threat.z - g.z;
      let td = Math.hypot(dx, dz);
      if (td < 0.01) {
        dx = 0;
        dz = -(g.homeDirection || (g.side === 'attacker' ? 1 : -1));
        td = 1;
      }
      return { point: [g.x - (dx / td) * 10, g.z - (dz / td) * 10], skirmishing: true };
    }
    const d = dist(g, e);
    const dx = (e.x - g.x) / (d || 1);
    const dz = (e.z - g.z) / (d || 1);
    const preferred = g.range * 0.83;
    if (d < g.range * 0.46) return { point: [g.x - dx * 6, g.z - dz * 6], skirmishing: true };
    if (d <= preferred) return { point: [g.x, g.z], skirmishing: false };
    return { point: [e.x - dx * preferred, e.z - dz * preferred], skirmishing: false };
  }

  const d = dist(g, e);
  const dx = (e.x - g.x) / (d || 1);
  const dz = (e.z - g.z) / (d || 1);
  if (g.type === 'cavalry' && order !== 'charge' && e.type === 'infantry' && d > 10) {
    const slot = g.slot ?? (typeof g.order === 'number' ? g.order : g.lane ?? 0);
    const flank = slot % 2 ? 1 : -1;
    return { point: [e.x + flank * 7, e.z - dz * 2], skirmishing: false };
  }
  return { point: [e.x - dx * Math.min(g.range * 0.55, 1.5), e.z - dz * Math.min(g.range * 0.55, 1.5)], skirmishing: false };
}

export function activeTroops(g) {
  return g.routed ? 0 : Math.max(0, (g.troopCount || 0) * cap(g.life / Math.max(1, g.initialLife || 100), 0, 1));
}

export function numericalPower(g, e) {
  return activeTroops(g) / Math.max(1, activeTroops(e));
}

export function fieldStrength(groups, side) {
  return groups
    .filter(g => g.side === side && !g.routed)
    .reduce((n, g) => n + (g.troopCount || 0) * cap(g.life / Math.max(1, g.initialLife || 100), 0, 1) * (0.5 + cap(g.morale / 100, 0, 1) * 0.5), 0);
}

function random(state) {
  state.fieldSeed = ((state.fieldSeed ?? 145019) * 1664525 + 1013904223) >>> 0;
  return state.fieldSeed / 4294967296;
}

function addEffect(state, kind, x, z, duration) {
  state.effects ??= [];
  state.effects.push({ kind, x, z, age: 0, duration, seed: state.fieldSeed ?? 0 });
  if (state.effects.length > 64) state.effects.splice(0, state.effects.length - 64);
}

function computeStatusFlags(g, terrainInfo) {
  if (g.routed) return ['ROUT'];
  const flags = [];
  if (g.type === 'cavalry' && ((g.chargeMomentum || 0) >= 0.45 || (g.fieldOrder === 'charge' && g.moving))) flags.push('CHARGE');
  if ((isInfantryOrSpear(g) && isBracedPosture(g)) || (g.bracedCounterTimer || 0) > 0) flags.push('BRACED');
  if (g.flanked || (g.flankedTimer || 0) > 0) flags.push('FLANKED');
  if (terrainInfo.inForestCover) flags.push('COVER');
  if (terrainInfo.highGround) flags.push('HIGH_GROUND');
  if ((g.rallyBuffTimer || 0) > 0) flags.push('RALLIED');
  if (g.skirmishing) flags.push('SKIRMISH');
  return flags;
}

export function stepField(state, dt) {
  if (state.simpleField) return stepCardBattle(state, dt, g=>fieldTerrain(g,state.terrainType||'plains'));
  const terrainType = typeof state.terrain === 'string' ? state.terrain : state.terrainType || 'plains';
  state.fieldTime = (state.fieldTime || 0) + dt;
  state.effects ??= [];
  state.projectiles ??= [];
  for (const e of state.effects) e.age += dt;
  state.effects = state.effects.filter(e => e.age < e.duration);

  for (const g of state.groups) {
    g.attackPulse = Math.max(0, (g.attackPulse || 0) - dt);
    g.flankedTimer = Math.max(0, (g.flankedTimer || 0) - dt);
    g.flanked = g.flankedTimer > 0;
    g.rallyBuffTimer = Math.max(0, (g.rallyBuffTimer || 0) - dt);
    g.bracedCounterTimer = Math.max(0, (g.bracedCounterTimer || 0) - dt);
    g.skirmishing = false;
    if (g.routed) {
      g.routAge = (g.routAge || 0) + dt;
      g.chargeMomentum = 0;
      g.status = 'routing';
      g.vx = 0;
      const dir = g.homeDirection || (g.side === 'attacker' ? 1 : -1);
      const edgeZ = dir * 46;
      const dz = edgeZ - g.z;
      const step = Math.sign(dz) * Math.min(Math.abs(dz), dt * Math.max(3, g.speed || 4) * 1.1);
      g.z = cap(g.z + step, -46, 46);
      g.vz = dt > 0 ? step / dt : 0;
      g.facingX = 0;
      g.facingZ = dir;
      g.facing = Math.atan2(g.facingX, g.facingZ);
      g.troops = 0;
      g.statusFlags = ['ROUT'];
    }
  }

  const live = state.groups.filter(g => !g.routed).sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const positions = new Map(live.map(g => [g.id, { x: g.x, z: g.z }]));
  const hits = [];

  for (const g of live) {
    const enemies = live.filter(x => x.side !== g.side);
    const focusId = g.focusTargetId ?? g.focusTarget;
    const e = enemies.find(x => x.id === focusId) || fieldTarget(g, enemies);
    if (!e) {
      const tInfo = fieldTerrain(g, terrainType);
      g.terrainName = tInfo.name;
      g.height = tInfo.height;
      g.vx = 0;
      g.vz = 0;
      g.moving = false;
      g.status = g.fieldOrder === 'hold' ? 'holding' : 'ready';
      g.statusFlags = computeStatusFlags(g, tInfo);
      continue;
    }

    const order = g.fieldOrder || 'advance';
    const plan = targetPosition(g, e, enemies, state.simpleField);
    g.skirmishing = plan.skirmishing;
    const target = [cap(plan.point[0], -64, 64), cap(plan.point[1], -46, 46)];
    const dx = target[0] - g.x;
    const dz = target[1] - g.z;
    const d = Math.hypot(dx, dz);
    const terrain = fieldTerrain(g, terrainType);

    g.terrainName = terrain.name;
    g.height = terrain.height;
    g.phase = (g.phase || 0) + dt * (g.type === 'cavalry' ? 10 : 5);
    g.targetX = target[0];
    g.targetZ = target[1];

    const moving = d > 0.35;
    const aggressive = order === 'charge';
    g.moving = moving;
    if (moving && g.type === 'cavalry' && aggressive) {
      g.dustTimer = (g.dustTimer || 0) - dt;
      if (g.dustTimer <= 0) {
        addEffect(state, 'dust', g.x, g.z, 0.65);
        g.dustTimer = 0.5;
      }
    }

    const shieldWall = g.formationId === 'shield_wall';
    const cohesionDelta = moving ? (aggressive ? -1.7 : (shieldWall ? -0.18 : -0.40)) : (shieldWall ? 2.1 : 1.3);
    g.cohesion = cap((g.cohesion ?? 100) + dt * cohesionDelta, 35, 100);
    g.fatigue = cap((g.fatigue || 0) + dt * (moving ? (aggressive ? 1.2 : 0.30) : -0.65), 0, 100);
    g.stamina = cap(100 - g.fatigue, 0, 100);

    const prevX = g.x;
    const prevZ = g.z;
    if (moving) {
      const step = Math.min(d, dt * g.speed * terrain.speed * (0.65 + 0.35 * g.life / Math.max(1, g.initialLife || 100)) * (1 - g.fatigue * 0.004) * (aggressive ? 1.16 : order === 'fallback' ? 0.92 : 1));
      g.x = cap(g.x + dx / d * step, -64, 64);
      g.z = cap(g.z + dz / d * step, -46, 46);
      g.facingX = dx / d;
      g.facingZ = dz / d;
      g.vx = dt > 0 ? (g.x - prevX) / dt : 0;
      g.vz = dt > 0 ? (g.z - prevZ) / dt : 0;
    } else {
      g.vx = 0;
      g.vz = 0;
      if (order === 'move' || order === 'fallback') {
        syncOrderAliases(g, 'hold', g.x, g.z);
        g.manualOrder = false;
      }
      if (order === 'advance') {
        const distance = dist(g, e) || 1;
        g.facingX = (e.x - g.x) / distance;
        g.facingZ = (e.z - g.z) / distance;
      }
    }
    g.facing = Math.atan2(g.facingX, g.facingZ);

    // Friendly groups repel one another gently, but holding/ordered units stay anchored.
    if (!['hold', 'move', 'fallback'].includes(order)) {
      for (const other of live) {
        if (other === g || other.side !== g.side) continue;
        const p = positions.get(other.id);
        const sx = g.x - p.x;
        const sz = g.z - p.z;
        const sep = Math.hypot(sx, sz);
        if (sep > 0.001 && sep < 3) {
          const push = Math.min(0.45, dt * (3 - sep));
          g.x = cap(g.x + sx / sep * push, -64, 64);
          g.z = cap(g.z + sz / sep * push, -46, 46);
        }
      }
    }

    // Cavalry shock momentum builds while moving fast and decays when stationary.
    if (g.type === 'cavalry' || g.kind === 'cavalry') {
      const speedRatio = dt > 0 ? Math.hypot(g.vx, g.vz) / Math.max(0.1, g.speed || 6) : 0;
      if (moving && (aggressive || speedRatio >= 0.55)) {
        g.chargeMomentum = cap((g.chargeMomentum || 0) + dt * (aggressive ? 0.95 : 0.55) * terrain.speed, 0, 1);
      } else {
        g.chargeMomentum = cap((g.chargeMomentum || 0) - dt * 0.9, 0, 1);
      }
    } else {
      g.chargeMomentum = 0;
    }

    // A regiment can rally passively only while stationary and beyond every enemy's weapon reach.
    const cmdAura = Math.max(0, g.commanderMartial || 0);
    if (!moving && ['hold', 'fallback'].includes(g.fieldOrder) && !enemies.some(other => dist(g, other) <= other.range + 3)) {
      const rallyRate = 1.2 + cmdAura * 0.25;
      g.morale = Math.min(100, g.morale + Math.min(dt * rallyRate, Math.max(0, (g.initialMorale ?? 85) - g.morale)));
    }

    g.cooldown = (g.cooldown || 0) - dt;
    const eTerrain = fieldTerrain(e, terrainType);
    const highGroundAdv = terrain.highGround || (terrain.height - eTerrain.height) >= 0.75;
    const effectiveRange = g.type === 'archers' && highGroundAdv ? g.range * 1.18 : g.range;
    const range = dist(g, e);
    if (range > effectiveRange || g.cooldown > 0 || g.fieldOrder === 'fallback') continue;

    g.cooldown = g.type === 'archers' ? 1.2 : 0.8;
    g.attackPulse = g.type === 'archers' ? 0.45 : 0.30;
    g.attackSerial = (g.attackSerial || 0) + 1;

    const power = numericalPower(g, e);
    const overwhelm = state.simpleField ? 1 : power >= 3 ? Math.min(2.2, 1 + (power - 3) * 0.12) : power <= 0.34 ? Math.max(0.45, power * 1.35) : 1;
    const aspect = attackAspect(g, e);
    const flank = aspect === 'rear' ? 1.40 : aspect === 'flank' ? 1.22 : 1;

    const targetIsSpearOrInf = isInfantryOrSpear(e);
    const targetBracedPosture = isBracedPosture(e);
    const isPikeSpecialist = e.kind === 'pikemen' || e.kind === 'spearmen' || e.formationId === 'pike_square';
    const bracedAgainstCav = (g.type === 'cavalry' || g.kind === 'cavalry') && targetIsSpearOrInf && targetBracedPosture && aspect !== 'rear';

    const chargeMult = (g.type === 'cavalry' || g.kind === 'cavalry') && !bracedAgainstCav
      ? (1 + (g.chargeMomentum || 0) * 0.65) * (aggressive && moving ? 1.24 : 1)
      : 1;
    const braceMitigation = bracedAgainstCav
      ? (isPikeSpecialist ? 1.95 : e.formationId === 'shield_wall' ? 1.60 : 1.38)
      : 1;
    const shieldMitigation = e.formationId === 'shield_wall' && aspect === 'front' && !e.moving ? 0.80 : 1;
    const rangedCoverMult = g.type === 'archers' ? (eTerrain.rangedMitigation ?? (1 / eTerrain.cover)) : 1;
    const highGroundDmgMult = highGroundAdv ? 1.18 : 1;
    const commanderAttack = 1 + cmdAura * 0.035;

    const damage = g.damage * commanderAttack * overwhelm * flank * rangedCoverMult * highGroundDmgMult *
      (0.75 + 0.25 * (g.cohesion ?? 100) / 100) * (0.75 + 0.25 * cap(g.morale / 100, 0, 1)) *
      (1 - g.fatigue * 0.004) * power * chargeMult * (g.type === 'cavalry' && e.type === 'archers' ? 1.35 : 1) *
      shieldMitigation / (Math.max(0.6, e.armor || 1) * braceMitigation * (g.type === 'cavalry' ? Math.max(0.6, e.cavalryCounter || 1) : 1)) *
      (0.88 + random(state) * 0.24);
    const moraleShock = (g.type === 'cavalry' || g.kind === 'cavalry') && !bracedAgainstCav ? (g.chargeMomentum || 0) * 14 : 0;

    hits.push({ g, e, damage, aspect, moraleShock });

    if (bracedAgainstCav) {
      const recoilScale = (isPikeSpecialist ? 0.56 : e.formationId === 'shield_wall' ? 0.38 : 0.28) *
        (1 + (g.chargeMomentum || 0) * 0.65) * (aggressive ? 1.35 : 1);
      const recoil = (e.damage || 10) * recoilScale * numericalPower(e, g) * (state.simpleField ? 0.5 : 1);
      hits.push({
        g: e,
        e: g,
        damage: recoil,
        aspect: 'front',
        moraleShock: (g.chargeMomentum || 0) * 6 + (isPikeSpecialist ? 5 : 2),
        bracedCounter: true
      });
      g.bracedCounter = recoil;
      g.chargeMomentum = 0;
      g.cooldown = Math.max(g.cooldown, 1.15);
      e.bracedCounterTimer = 1.4;
    } else if ((g.type === 'cavalry' || g.kind === 'cavalry') && (g.chargeMomentum || 0) > 0) {
      g.chargeMomentum = cap(g.chargeMomentum * 0.25, 0, 1);
    }

    if (g.type === 'archers') {
      state.projectiles.push({
        sx: g.x,
        sz: g.z,
        sy: terrain.height + 1.2,
        tx: e.x,
        tz: e.z,
        ty: eTerrain.height + 0.7,
        t: 0,
        kind: 'arrow'
      });
    }
  }

  // Resolve all strikes simultaneously against the pre-impact roster.
  const impacts = new Map();
  for (const { g, e, damage, aspect, moraleShock = 0 } of hits) {
    if (g.type !== 'archers') addEffect(state, 'impact', e.x, e.z, 0.32);
    if (aspect === 'flank' || aspect === 'rear') {
      e.flanked = true;
      e.flankedTimer = 1.6;
    }
    const eAura = Math.max(0, e.commanderMartial || 0);
    const rallyGuard = (e.rallyBuffTimer || 0) > 0 ? 0.6 : 1;
    const flankMoraleMult = aspect === 'rear' ? 1.55 : aspect === 'flank' ? 1.28 : 1;
    const loss = impacts.get(e) || { life: 0, cohesion: 0, morale: 0 };
    const lifeLoss = damage * 0.19 * Math.max(1, activeTroops(e)) / Math.max(1, e.troopCount || 0);
    loss.life += lifeLoss;
    loss.cohesion += damage * 0.15 * (aspect === 'rear' ? 1.8 : aspect === 'flank' ? 1.4 : 1) * (e.formationId === 'shield_wall' && aspect === 'front' ? 0.72 : 1);
    loss.morale += (state.simpleField
      ? (lifeLoss * 0.65 * flankMoraleMult + Math.min(lifeLoss, moraleShock * 0.12))
      : (Math.min(45, damage * 0.31) * flankMoraleMult + moraleShock)) * rallyGuard / (1 + eAura * 0.04);
    impacts.set(e, loss);
  }

  for (const [e, loss] of impacts) {
    e.life = cap(e.life - loss.life, 0, 100);
    e.cohesion = cap((e.cohesion ?? 100) - loss.cohesion, 35, 100);
    e.morale = cap(e.morale - loss.morale, 0, 100);
    e.troops = liveTroopCount(e);
  }

  const routed = [];
  for (const g of live) {
    if (state.simpleField ? (g.life <= 0.5 || (g.life <= 45 && g.morale <= 12)) : (g.life < 8 || g.morale <= 14)) {
      g.routed = true;
      g.routAge = 0;
      g.attackPulse = 0;
      g.chargeMomentum = 0;
      g.status = 'routing';
      g.troops = 0;
      g.statusFlags = ['ROUT'];
      addEffect(state, 'rout', g.x, g.z, 0.6);
      routed.push(g);
    } else {
      const tInfo = fieldTerrain(g, terrainType);
      g.troops = liveTroopCount(g);
      g.status = g.fieldOrder === 'charge' ? 'charging' : g.moving ? 'moving' : g.fieldOrder === 'hold' ? 'holding' : 'engaging';
      g.statusFlags = computeStatusFlags(g, tInfo);
    }
  }

  for (const g of routed) {
    for (const ally of live) {
      if (!ally.routed && ally.side === g.side && dist(ally, g) < 14) {
        ally.morale = cap(ally.morale - (state.simpleField ? 2 : 7) * Math.min(1, (g.troopCount || 0) / Math.max(1, ally.troopCount || 0)), 0, 100);
      }
    }
  }

  for (const p of state.projectiles) p.t += dt * 2.3;
  state.projectiles = state.projectiles.filter(p => p.t <= 1);
}
