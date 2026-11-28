import {terrainHeight} from './field-tactics.js';

// Renderer-independent visual identity. Material clones are shared by side/type/region,
// leaving the original 0 A.D. & KayKit assets untouched and retaining their textures.
const REGIONAL_TINT = {
  india: { friendly: 0x9bd2dc, enemy: 0xde916a, cavalry: [0.93, 0.66, 0.24], archers: [0.85, 0.71, 0.42], infantry: [0.76, 0.66, 0.52] },
  east_asia: { friendly: 0x8fc3d8, enemy: 0xd67c68, cavalry: [0.88, 0.56, 0.30], archers: [0.78, 0.74, 0.48], infantry: [0.64, 0.72, 0.68] },
  persia: { friendly: 0x86c8be, enemy: 0xdc9a68, cavalry: [0.80, 0.72, 0.36], archers: [0.72, 0.78, 0.60], infantry: [0.58, 0.72, 0.70] },
  europe: { friendly: 0x8cc7d9, enemy: 0xd9977e, cavalry: [0.86, 0.68, 0.34], archers: [0.81, 0.75, 0.57], infantry: [0.68, 0.72, 0.73] }
};

export function regimentPalette(side, type, region = 'europe') {
  const friendly = side === 'attacker';
  const reg = REGIONAL_TINT[region] || REGIONAL_TINT.europe;
  return {
    tint: friendly ? reg.friendly : reg.enemy,
    cloth: friendly ? [0.24, 0.56, 0.70] : [0.65, 0.27, 0.20],
    banner: friendly ? [0.30, 0.65, 0.85] : [0.88, 0.36, 0.24],
    accent: type === 'cavalry' ? reg.cavalry : type === 'archers' ? reg.archers : reg.infantry
  };
}

export function unitBadgeLabel(g) {
  const kind = g?.kind || g?.type;
  if (kind === 'elephants' || g?.specialistId === 'elephants') return 'ELP';
  if (kind === 'pikemen' || kind === 'spearmen' || g?.formationId === 'pike_square') return 'PIK';
  if (g?.type === 'archers' || kind === 'archers') return 'ARC';
  if (g?.type === 'cavalry' || kind === 'cavalry') return 'CAV';
  return 'INF';
}

export function styleFieldSquad(scene, g) {
  const units = scene.groups.get(g.id);
  if (!units) return;
  scene.fieldMaterials ??= new Map();
  const region = g.regionalFamily || 'europe';
  const palette = regimentPalette(g.side, g.type, region);
  const key = g.side + ':' + g.type + ':' + region;
  if (!scene.fieldMaterials.has(key)) scene.fieldMaterials.set(key, new Map());
  const cache = scene.fieldMaterials.get(key);
  const style = m => {
    if (!m?.clone || !m.color) return m;
    if (cache.has(m)) return cache.get(m);
    const clone = m.clone();
    if (clone.color?.clone && clone.color?.lerp) {
      const tint = clone.color.clone().setHex(palette.tint);
      clone.color.lerp(tint, 0.30);
    }
    cache.set(m, clone);
    return clone;
  };
  for (const u of units) {
    if (u.fieldStyled) continue;
    u.fieldStyled = true;
    u.rig?.traverse?.(node => {
      if (node.isMesh && node.material) {
        node.material = Array.isArray(node.material) ? node.material.map(style) : style(node.material);
      }
    });
    if (u.current && Number.isFinite(u.current.time) && u.current.getClip) {
      const d = u.current.getClip().duration;
      if (d > 0) u.current.time = (u.phase || 0) % d;
    }
  }
}

export function disposeFieldMaterials(scene) {
  for (const cache of scene.fieldMaterials?.values() || []) {
    for (const m of cache.values()) m.dispose?.();
  }
  scene.fieldMaterials?.clear();
}

export function cavalryGait(time, phase, charging) {
  const frequency = charging ? 13 : 8;
  const amplitude = charging ? 0.57 : 0.32;
  const t = time * frequency + phase;
  return {
    bob: Math.abs(Math.sin(t)) * (charging ? 0.09 : 0.045),
    legs: [0, Math.PI, Math.PI * 0.7, Math.PI * 1.7].map(p => Math.sin(t + p) * amplitude)
  };
}

export function projectileTrail(p, compact = false, terrain = null) {
  const out = [];
  const t = Math.max(0, Math.min(1, p.t));
  const isShot = p.kind === 'shot';
  const count = compact ? (isShot ? 3 : 2) : (isShot ? 6 : 4);
  const sy = p.sy ?? (terrain ? terrainHeight(p.sx, p.sz, terrain) + (isShot ? 1.8 : 0.9) : 0.9);
  const ty = p.ty ?? (terrain ? terrainHeight(p.tx, p.tz, terrain) + (isShot ? 1.4 : 0.9) : 0.9);
  const dist = Math.hypot((p.tx ?? 0) - (p.sx ?? 0), (p.tz ?? 0) - (p.sz ?? 0));
  const arc = isShot ? Math.max(5.5, Math.min(12.5, dist * 0.36)) : p.kind === 'arrow' ? Math.max(2.6, Math.min(6.2, dist * 0.22)) : 3.0;
  for (let i = 0; i < count; i++) {
    const u = t - i * (isShot ? 0.036 : 0.045);
    if (u < 0) continue;
    const size = isShot ? (i === 0 ? 0.44 : 0.26 * (1 - i / count)) : (i === 0 ? 0.19 : 0.10 * (1 - i / count));
    out.push({
      x: p.sx + (p.tx - p.sx) * u,
      z: p.sz + (p.tz - p.sz) * u,
      y: sy + (ty - sy) * u + Math.sin(u * Math.PI) * arc,
      size,
      head: i === 0,
      kind: p.kind || 'arrow'
    });
  }
  return out;
}
