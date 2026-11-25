import {terrainHeight, terrainForestCovers} from './field-tactics.js';

// Field-battle-only scenery, shared by the shipped bundle and fallback renderer.
// Raised perimeter props remain outside the playable combat rectangle; terrain groves &
// high-ground contours match deterministic terrainHeight & terrainForestCovers.
export function fieldScenery(seed = 1450, biome = 'temperate', compact = false) {
  let st = seed >>> 0 || 1;
  const rand = () => {
    st = (Math.imul(st, 1664525) + 1013904223) >>> 0;
    return st / 4294967296;
  };
  const desert = biome === 'desert';
  const items = [];
  const add = (shape, x, y, z, sx, sy, sz, color) => {
    const o = [x, y, z, sx, sy, sz, ...color];
    o.shape = shape;
    items.push(o);
  };
  const grass = desert ? [0.58, 0.46, 0.31] : [0.31, 0.40, 0.26];
  const earth = desert ? [0.48, 0.36, 0.23] : [0.36, 0.32, 0.22];
  const rock = desert ? [0.48, 0.40, 0.30] : [0.38, 0.39, 0.34];
  const wood = [0.25, 0.18, 0.12];
  const leaf = desert ? [0.32, 0.39, 0.22] : [0.21, 0.33, 0.18];
  const ground = [0, -0.34, 0, 190, 0.62, 175, ...grass];
  ground.shape = 'box';

  // Shallow, irregular color patches define rough ground without obstructing orders.
  for (const side of [-1, 1]) {
    for (let i = 0; i < (compact ? 8 : 18); i++) {
      const x = side * (45 + rand() * 28);
      const z = -57 + rand() * 114;
      const r = 2 + rand() * 5;
      add('sphere', x, 0.018, z, r, 0.045, r * (0.5 + rand() * 0.6), earth);
    }
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < (compact ? 5 : 11); i++) {
      const x = side * (69 + rand() * 15);
      const z = -67 + rand() * 134;
      const h = 2.8 + rand() * 3.9;
      if (desert && i % 3 !== 0) {
        add('sphere', x, h * 0.24, z, h * 1.2, h * 0.55, h * 0.9, rock);
        continue;
      }
      add('cylinder', x, h * 0.25, z, 0.42, h * 0.5, 0.42, wood);
      if (desert) {
        for (let j = 0; j < 3; j++) add('sphere', x + (j - 1) * h * 0.20, h * 0.71, z, h * 0.52, h * 0.24, h * 0.62, leaf);
      } else {
        add('cone', x, h * 0.65, z, h * 0.63, h * 0.82, h * 0.63, leaf);
        add('cone', x, h * 0.89, z, h * 0.42, h * 0.51, h * 0.42, [0.28, 0.40, 0.21]);
      }
    }
    for (let i = 0; i < (compact ? 6 : 12); i++) {
      const x = side * (68 + rand() * 15);
      const z = -60 + rand() * 120;
      const r = 0.35 + rand() * 1.4;
      add('sphere', x, r * 0.24, z, r * 1.8, r * 0.6, r * 1.3, rock);
    }
    for (let i = 0; i < 3; i++) {
      const x = side * (79 + rand() * 7);
      const z = -55 + i * 55;
      const h = 2 + rand() * 4;
      add('sphere', x, h * 0.25, z, 15, h, 22, desert ? [0.48, 0.39, 0.29] : [0.30, 0.36, 0.25]);
    }
    for (let i = 0; i < (compact ? 2 : 3); i++) {
      const x = side * (24 + i * 8);
      const z = side * (56 + rand() * 7);
      const r = 2.3 + rand() * 0.5;
      add('cone', x, 1.35, z, r * 1.6, 2.6, r * 1.6, side === 1 ? [0.38, 0.49, 0.56] : [0.56, 0.32, 0.23]);
      add('cylinder', x, 1.5, z, 0.12, 3, 0.12, wood);
      add('box', x + 3, 0.35, z, 0.8, 0.7, 0.8, wood);
    }
  }
  return { ground, items };
}

/** Generate visible woodland grove trees & highland ridge markers aligned to terrainHeight. */
export function terrainVisualProps(terrain = 'plains', biome = 'temperate', compact = false) {
  const items = [];
  const desert = biome === 'desert' || String(terrain).toLowerCase() === 'desert';
  const coastal = String(terrain).toLowerCase() === 'coastal';
  const norm = String(terrain || 'plains').toLowerCase();
  const add = (shape, x, y, z, sx, sy, sz, color) => {
    const o = [x, y, z, sx, sy, sz, ...color];
    o.shape = shape;
    items.push(o);
  };
  const wood = [0.27, 0.19, 0.13];
  const leafDark = desert ? [0.34, 0.42, 0.22] : [0.19, 0.34, 0.19];
  const leafLight = desert ? [0.43, 0.50, 0.26] : [0.27, 0.43, 0.23];
  const moss = desert ? [0.46, 0.41, 0.26] : [0.23, 0.33, 0.21];
  const stone = desert ? [0.54, 0.45, 0.34] : [0.44, 0.45, 0.41];

  const covers = terrainForestCovers(terrain);
  for (let gi = 0; gi < covers.length; gi++) {
    const g = covers[gi];
    const baseY = terrainHeight(g.x, g.z, terrain);
    // Soft mossy woodland floor footprint
    add('sphere', g.x, baseY + 0.03, g.z, g.radius * 1.95, 0.08, g.radius * 1.95, moss);
    const count = Math.max(4, Math.round((compact ? 5 : 9) * (g.density || 0.8)));
    let st = ((gi + 1) * 977 + norm.length * 131) >>> 0;
    const rng = () => {
      st = (Math.imul(st, 1664525) + 1013904223) >>> 0;
      return st / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2 + rng() * 0.7;
      const rad = g.radius * (0.2 + 0.65 * Math.sqrt((i + 0.5) / count));
      const tx = g.x + Math.cos(ang) * rad;
      const tz = g.z + Math.sin(ang) * rad;
      const ty = terrainHeight(tx, tz, terrain);
      const h = 2.6 + rng() * 1.8;
      add('cylinder', tx, ty + h * 0.28, tz, 0.36, h * 0.56, 0.36, wood);
      if (desert) {
        add('sphere', tx, ty + h * 0.75, tz, h * 0.62, h * 0.34, h * 0.62, leafDark);
      } else {
        add('cone', tx, ty + h * 0.72, tz, h * 0.74, h * 0.85, h * 0.74, leafDark);
        add('cone', tx, ty + h * 0.98, tz, h * 0.50, h * 0.56, h * 0.50, leafLight);
      }
    }
  }

  // Highland crags and ridge markers for elevated tactical hills/mountains
  if (['hills', 'highlands', 'mountain', 'mountains'].includes(norm)) {
    const ridgeSpots = [[-20, 6], [18, -8], [0, -20], [-28, -14], [28, 12], [-14, 18]];
    for (let i = 0; i < ridgeSpots.length; i++) {
      const [rx, rz] = ridgeSpots[i];
      const ry = terrainHeight(rx, rz, terrain);
      if (ry < 1.1) continue;
      add('sphere', rx, ry + 0.25, rz, 2.2, 0.85, 1.7, stone);
      add('cone', rx + 0.9, ry + 0.55, rz - 0.6, 1.1, 1.1, 1.0, stone);
      // Small weathered ridge marker banner stake
      add('cylinder', rx - 0.8, ry + 0.9, rz + 0.7, 0.09, 1.8, 0.09, wood);
      add('box', rx - 0.45, ry + 1.55, rz + 0.7, 0.75, 0.38, 0.08, [0.78, 0.66, 0.35]);
    }
  }

  if (coastal) {
    add('box', 58, -0.30, 0, 56, 0.14, 175, [0.22, 0.43, 0.52]);
  }
  return items;
}

/** Subdivided terrain quad grid for CanvasFallback 3D heightfield rendering. */
export function terrainGroundGrid(terrain = 'plains', biome = 'temperate', compact = false) {
  const cols = compact ? 14 : 18;
  const rows = compact ? 12 : 14;
  const minX = -76, maxX = 76, minZ = -58, maxZ = 58;
  const dx = (maxX - minX) / cols;
  const dz = (maxZ - minZ) / rows;
  const desert = biome === 'desert' || String(terrain).toLowerCase() === 'desert';
  const covers = terrainForestCovers(terrain);
  const sun = [-0.4, 0.85, 0.34];
  const sunLen = Math.hypot(...sun);
  const sdx = sun[0] / sunLen, sdy = sun[1] / sunLen, sdz = sun[2] / sunLen;

  const verts = [];
  for (let r = 0; r <= rows; r++) {
    const z = minZ + r * dz;
    const row = [];
    for (let c = 0; c <= cols; c++) {
      const x = minX + c * dx;
      row.push([x, terrainHeight(x, z, terrain), z]);
    }
    verts.push(row);
  }

  const quads = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p0 = verts[r][c];
      const p1 = verts[r][c + 1];
      const p2 = verts[r + 1][c + 1];
      const p3 = verts[r + 1][c];
      const cx = (p0[0] + p2[0]) * 0.5;
      const cy = (p0[1] + p1[1] + p2[1] + p3[1]) * 0.25;
      const cz = (p0[2] + p2[2]) * 0.5;

      // Cross product of diagonal vectors for surface normal
      const ux = p2[0] - p0[0], uy = p2[1] - p0[1], uz = p2[2] - p0[2];
      const vx = p3[0] - p1[0], vy = p3[1] - p1[1], vz = p3[2] - p1[2];
      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
      const nl = Math.hypot(nx, ny, nz) || 1;
      const shade = 0.68 + 0.36 * Math.max(0, (nx * sdx + ny * sdy + nz * sdz) / nl);

      const inGrove = covers.some(g => Math.hypot(cx - g.x, cz - g.z) <= g.radius);
      const isWater = String(terrain).toLowerCase() === 'coastal' && cx > 28 && cy < -0.05;
      let base;
      if (isWater) base = [0.22, 0.42, 0.51];
      else if (inGrove) base = desert ? [0.43, 0.41, 0.25] : [0.23, 0.33, 0.20];
      else if (cy >= 1.25) base = desert ? [0.62, 0.50, 0.35] : [0.36, 0.42, 0.29];
      else base = desert ? [0.57, 0.45, 0.30] : [0.30, 0.39, 0.26];

      quads.push({
        pts: [p0, p1, p2, p3],
        center: [cx, cy, cz],
        color: [base[0] * shade, base[1] * shade, base[2] * shade]
      });
    }
  }
  return quads;
}

export function suppressFortScenery(environment) {
  const group = environment?.group;
  if (!group) return false;
  for (const child of group.children || []) {
    if (child.name !== 'Illustrated battlefield ground') child.visible = false;
  }
  return true;
}

export function battleContactShadow(g, terrain = null) {
  if (g.routed && (g.routAge || 0) >= 3 || g.life <= 0) return null;
  const scale = Math.max(1, Math.sqrt(Math.min(36, g.troopCount || 1)) * 0.8);
  const gy = terrain ? terrainHeight(g.x, g.z, terrain) : 0;
  const o = [g.x, gy + 0.025, g.z, scale * 1.7, 0.035, scale, [0.18, 0.22, 0.17]].flat();
  o.shape = 'sphere';
  return o;
}
