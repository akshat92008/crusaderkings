/**
 * Deterministic historical-inspired battlefield layout.
 *
 * Layout has a clear field of battle: the centre is deliberately free of
 * static buildings so the existing formation AI remains playable.
 */
import {terrainForestCovers} from './field-tactics.js';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export function seededBattleRandom(seed = 1450) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function planMedievalBattlefield(seed = 1450, biome = 'temperate', fortLevel = 1, terrain = null) {
  const random = seededBattleRandom(seed);
  const desert = biome === 'desert';
  const fort = clamp(Math.floor(fortLevel || 0), 0, 4);
  const resolvedTerrain = terrain || (desert ? 'desert' : 'plains');
  const houses = [], trees = [], tents = [], crates = [], rocks = [];

  // Town lanes remain open around the gate in the fortress's rear.
  const rows = [-51.5, -61, -70];
  for (let row = 0; row < rows.length; row++) {
    for (let column = -4; column <= 4; column++) {
      if (Math.abs(column) < 1 && row < 2) continue;
      if (random() < 0.16) continue;
      const x = column * 8.6 + (random() - 0.5) * 1.6;
      const z = rows[row] + (random() - 0.5) * 1.5;
      houses.push({
        x,
        z,
        w: 4.1 + random() * 1.6,
        d: 4.2 + random() * 1.6,
        h: 3 + random() * 1.6,
        variant: Math.floor(random() * 3),
        roof: desert ? 'flat' : (random() > 0.13 ? 'pitched' : 'flat'),
        chimney: random() > 0.57
      });
    }
  }

  // A populated camp behind the player army: no tents across march lanes.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const x = side * (35 + (i % 2) * 6) + random() * 2;
      const z = 29 + Math.floor(i / 2) * 10 + (random() - 0.5) * 2;
      tents.push({ x, z, r: 1.65 + random() * 0.48, color: Math.floor(random() * 3) });
    }
  }

  // Tree canopy frames the map without obscuring the two starting armies.
  for (let i = 0; i < 90; i++) {
    const side = random() < 0.5 ? -1 : 1;
    const x = side * (50 + random() * 30);
    const z = (random() - 0.5) * 138;
    if (desert && random() < 0.72) continue;
    trees.push({ x, z, size: 2.6 + random() * 4.5, kind: desert ? 'palm' : (random() < 0.55 ? 'pine' : 'oak') });
  }
  for (let i = 0; i < 65; i++) {
    const side = random() < 0.5 ? -1 : 1;
    const x = side * (37 + random() * 41);
    const z = (random() - 0.5) * 130;
    rocks.push({ x, z, r: 0.25 + random() * 0.62 });
  }
  for (let i = 0; i < 22; i++) {
    const side = i % 2 ? -1 : 1;
    const x = side * (33 + random() * 10);
    const z = 25 + random() * 30;
    crates.push({ x, z, size: 0.4 + random() * 0.34 });
  }

  return {
    biome: desert ? 'desert' : 'temperate',
    terrain: resolvedTerrain,
    forestCovers: terrainForestCovers(resolvedTerrain),
    fortLevel: fort,
    houses,
    trees,
    tents,
    rocks,
    crates,
    gate: { x: 0, z: -42, passageWidth: 8 },
    towers: [{ x: -40, z: -42 }, { x: 40, z: -42 }],
    siegeEngines: [{ x: -32, z: 20 }, { x: 32, z: 20 }],
    road: { x: 0, from: 53, to: -68, width: 7 }
  };
}

export function countBattlefieldPieces(layout) {
  return Object.fromEntries(['houses', 'trees', 'tents', 'rocks', 'crates', 'siegeEngines', 'towers'].map(k => [k, layout[k].length]));
}
