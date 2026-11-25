import {chooseBattleRenderer, freshBattleCanvas, disposeNativeRenderer} from './battle-lifecycle.js';
import {fieldFrameSteps, renderInterval} from './render-performance.js';
import {browserFieldAudio, browserBattleMusic, browserCampaignAudio} from './field-audio.js';
import {regimentPalette, projectileTrail, disposeFieldMaterials, unitBadgeLabel} from './field-visuals.js';
import {fieldScenery, suppressFortScenery, battleContactShadow, terrainVisualProps, terrainGroundGrid} from './field-scenery.js';
import {applyFieldAtmosphere} from './field-atmosphere.js';
import {participatingArmies, aggregateForce, combinedFieldStats, packActiveRegiments, packSpecialistRegiments} from './field-forces.js';
import {formationOffsets, soldierWorldPose, visualMode, visibleSoldierCount, updateFieldCharacters, cameraDestination, blendCamera, battleRoster, battleImpactParticles} from './battle-presentation.js';
import {
  FIELD_ORDERS, initializeFieldGroup, issueFieldOrder, fieldTarget, fieldStrength, stepField, coordinateFieldAI,
  terrainHeight, terrainForestCovers, issueGroupMoveOrder, issueGroupTargetOrder, triggerRallyHorn, fieldTerrain
} from './field-tactics.js';
import {REGIMENTS, armyReadiness, regimentProfile, createSiegeState, siegeTarget, siegeDamage, siegeBreached} from './military-systems.js';
import {BattleModelArt} from './glb-art.js';
import {armyFormationSlots, militaryDoctrine, startingTroops, combatStatistics, chooseCounterFormation, availableFormations} from './military-doctrines.js';
import {ThreeBattleScene as BundledBattleScene} from './three-battle.bundle.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => {
  const d = Math.hypot(...a) || 1;
  return a.map(x => x / d);
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]);
const matMul = (a, b) => {
  const r = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) r[c * 4 + j] += a[k * 4 + j] * b[c * 4 + k];
    }
  }
  return r;
};
const perspective = (fovy, aspect, near, far) => {
  const f = 1 / Math.tan(fovy / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = 2 * far * near / (near - far);
  return m;
};
const lookAt = (eye, target) => {
  const z = norm(sub(eye, target));
  const x = norm(cross([0, 1, 0], z));
  const y = cross(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
};
const mix = (a, b, t) => a + (b - a) * t;
const hexColor = hex => {
  const s = hex.replace('#', '');
  return [parseInt(s.slice(0, 2), 16) / 255, parseInt(s.slice(2, 4), 16) / 255, parseInt(s.slice(4, 6), 16) / 255];
};

// The shipped bundle stays self-hosted; field animation and terrain ground elevation adapt on top.
export class ThreeBattleScene extends BundledBattleScene {
  constructor(canvas, config) {
    super(canvas, config);
    this.terrainType = config?.terrain || (config?.biome === 'desert' ? 'desert' : 'plains');
    if (config?.fieldBattle) {
      applyFieldAtmosphere(this.scene, this.renderer, config.biome);
      suppressFortScenery(this.environment);
      this._alignTerrainGround(this.terrainType, config.biome);
    }
  }

  _alignTerrainGround(terrain, biome) {
    const ground = this.environment?.group?.getObjectByName?.('Illustrated battlefield ground');
    if (!ground?.geometry?.constructor) return;
    const PlaneGeo = ground.geometry.constructor;
    const oldGeo = ground.geometry;
    const geo = new PlaneGeo(190, 175, 48, 44);
    const pos = geo.attributes?.position;
    if (!pos) return;
    const covers = terrainForestCovers(terrain);
    const colors = new Float32Array(pos.count * 3);
    const desert = biome === 'desert' || String(terrain).toLowerCase() === 'desert';
    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i);
      const wz = -pos.getY(i);
      const wy = terrainHeight(wx, wz, terrain);
      pos.setZ(i, wy);
      const inGrove = covers.some(c => Math.hypot(wx - c.x, wz - c.z) <= c.radius);
      const elev = clamp(wy / 4.5, 0, 1);
      if (inGrove) {
        colors[i * 3] = desert ? 0.72 : 0.56;
        colors[i * 3 + 1] = desert ? 0.74 : 0.69;
        colors[i * 3 + 2] = desert ? 0.56 : 0.50;
      } else {
        colors[i * 3] = 0.87 + elev * 0.15;
        colors[i * 3 + 1] = 0.90 + elev * 0.08;
        colors[i * 3 + 2] = 0.83 + elev * 0.04;
      }
    }
    pos.needsUpdate = true;
    const Attr = pos.constructor;
    if (Attr) geo.setAttribute('color', new Attr(colors, 3));
    geo.computeVertexNormals();
    ground.position.y = 0;
    ground.geometry = geo;
    if (ground.material) {
      ground.material.vertexColors = true;
      ground.material.needsUpdate = true;
    }
    oldGeo?.dispose?.();
  }

  updateCharacters(groups, dt) {
    if (groups?.some(g => g.fieldOrder)) return updateFieldCharacters(this, groups, dt);
    return super.updateCharacters(groups, dt);
  }

  dispose() {
    disposeFieldMaterials(this);
    const res = super.dispose();
    try { this.gl?.getExtension?.('WEBGL_lose_context')?.loseContext(); } catch {}
    return res;
  }
}

function boxes() {
  const v = [], ind = [];
  const faces = [
    [[0, 0, 1], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]],
    [[0, 0, -1], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]],
    [[1, 0, 0], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]],
    [[-1, 0, 0], [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]],
    [[0, 1, 0], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]],
    [[0, -1, 0], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5]]
  ];
  for (let f = 0; f < 6; f++) {
    for (let j = 1; j < 5; j++) v.push(...faces[f][j], ...faces[f][0]);
    ind.push(f * 4, f * 4 + 1, f * 4 + 2, f * 4, f * 4 + 2, f * 4 + 3);
  }
  return { v: new Float32Array(v), ind: new Uint16Array(ind) };
}

function curvedMesh(kind, sides = 8) {
  const v = [], idx = [];
  function triangle(a, b, c) {
    const u = sub(b, a), w = sub(c, a), n = norm(cross(u, w)), start = v.length / 6;
    for (const p of [a, b, c]) v.push(...p, ...n);
    idx.push(start, start + 1, start + 2);
  }
  const ring = (r, y, i) => [Math.cos(i * TAU / sides) * r, y, Math.sin(i * TAU / sides) * r];
  if (kind === 'cone') {
    for (let i = 0; i < sides; i++) {
      triangle(ring(0.5, -0.5, i + 1), ring(0.5, -0.5, i), [0, 0.5, 0]);
      triangle([0, -0.5, 0], ring(0.5, -0.5, i), ring(0.5, -0.5, i + 1));
    }
  } else if (kind === 'cylinder') {
    for (let i = 0; i < sides; i++) {
      const a = ring(0.5, -0.5, i), b = ring(0.5, -0.5, i + 1), c = ring(0.5, 0.5, i), d = ring(0.5, 0.5, i + 1);
      triangle(a, c, b);
      triangle(b, c, d);
      triangle([0, 0.5, 0], d, c);
      triangle([0, -0.5, 0], a, b);
    }
  } else if (kind === 'sphere') {
    const bands = 5;
    for (let j = 0; j < bands; j++) {
      const phi0 = Math.PI * j / bands, phi1 = Math.PI * (j + 1) / bands;
      const p = (phi, i) => [Math.sin(phi) * Math.cos(i * TAU / sides) * 0.5, Math.cos(phi) * 0.5, Math.sin(phi) * Math.sin(i * TAU / sides) * 0.5];
      for (let i = 0; i < sides; i++) {
        triangle(p(phi0, i), p(phi1, i), p(phi0, i + 1));
        triangle(p(phi0, i + 1), p(phi1, i), p(phi1, i + 1));
      }
    }
  }
  return { v: new Float32Array(v), ind: new Uint16Array(idx) };
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
  return s;
}

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' });
    if (!gl) throw Error('Your browser requires WebGL2 for the 3D battlefield.');
    this.gl = gl;
    const vs = `#version 300 es
 precision highp float;
 layout(location=0) in vec3 aPos;layout(location=1) in vec3 aNormal;
 layout(location=2) in vec3 iPos;layout(location=3) in vec3 iScale;layout(location=4) in vec3 iColor;
 uniform mat4 uVP;out vec3 vColor;out float vLight;out float vFog;
 void main(){vec3 p=aPos*iScale+iPos;gl_Position=uVP*vec4(p,1.);vColor=iColor;
 vec3 n=normalize(aNormal);vLight=.58+.42*max(dot(n,normalize(vec3(-.4,.85,.48))),0.);
 vFog=clamp((length(p.xz)-15.)/145.,0.,.4);}`;
    const fs = `#version 300 es
 precision mediump float;in vec3 vColor;in float vLight;in float vFog;out vec4 frag;
 void main(){vec3 col=mix(vColor*vLight,vec3(.35,.39,.34),vFog);frag=vec4(pow(col,vec3(.94)),1.);}`;
    const p = gl.createProgram();
    const vert = compile(gl, gl.VERTEX_SHADER, vs);
    const frag = compile(gl, gl.FRAGMENT_SHADER, fs);
    gl.attachShader(p, vert);
    gl.attachShader(p, frag);
    gl.linkProgram(p);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw Error(error);
    }
    gl.useProgram(p);
    this.program = p;
    this.loc = gl.getUniformLocation(p, 'uVP');
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 9 * 4 * 6000, gl.DYNAMIC_DRAW);
    this.meshes = {};
    for (const [kind, geom] of Object.entries({ box: boxes(), cone: curvedMesh('cone'), cylinder: curvedMesh('cylinder'), sphere: curvedMesh('sphere') })) {
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const vb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vb);
      gl.bufferData(gl.ARRAY_BUFFER, geom.v, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
      const ib = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geom.ind, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      for (let j = 0; j < 3; j++) {
        gl.enableVertexAttribArray(2 + j);
        gl.vertexAttribPointer(2 + j, 3, gl.FLOAT, false, 36, j * 12);
        gl.vertexAttribDivisor(2 + j, 1);
      }
      this.meshes[kind] = { vao, ib, vb, count: geom.ind.length };
    }
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.65, 0.70, 0.67, 1);
  }

  render(instances, camera) {
    const gl = this.gl, canvas = this.canvas, dpr = Math.min(globalThis.window?.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, canvas.clientWidth || canvas.width || 900);
    const h = Math.max(1, canvas.clientHeight || canvas.height || 600);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const P = perspective(Math.PI / 3, w / h, 0.5, 300);
    const VP = matMul(P, lookAt(camera.eye, camera.target));
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.loc, false, VP);
    const batches = new Map();
    for (const o of instances) {
      const kind = o.shape || 'box';
      if (!batches.has(kind)) batches.set(kind, []);
      batches.get(kind).push(o);
    }
    for (const [kind, objects] of batches) {
      const mesh = this.meshes[kind] || this.meshes.box;
      gl.bindVertexArray(mesh.vao);
      const arr = new Float32Array(objects.length * 9);
      for (let i = 0; i < objects.length; i++) arr.set(objects[i], i * 9);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);
      gl.drawElementsInstanced(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0, objects.length);
    }
    return VP;
  }

  dispose() {
    disposeNativeRenderer(this);
  }
}

export class CanvasFallback {
  // Perspective 3D projection + terrain heightfield grid for browsers without WebGL2.
  constructor(canvas) {
    this.canvas = canvas;
    this.c = canvas.getContext('2d');
    if (!this.c) throw Error('Neither WebGL2 nor 2D canvas rendering is available.');
  }

  render(objects, camera, groups, elapsed, terrainMeta = null) {
    const canvas = this.canvas, c = this.c;
    const w = canvas.clientWidth || canvas.width || 900;
    const h = canvas.clientHeight || canvas.height || 600;
    const dpr = Math.min(globalThis.window?.devicePixelRatio || 1, 1.5);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    c.setTransform?.(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = '#a4b0a8';
    c.fillRect(0, 0, w, h);

    const forward = norm(sub(camera.target, camera.eye));
    const right = norm(cross(forward, [0, 1, 0]));
    const up = cross(right, forward);
    const scale = h / (2 * Math.tan(Math.PI / 6));
    const project = p => {
      const d = sub(p, camera.eye);
      const depth = dot(d, forward);
      if (depth <= 0.2) return null;
      return [w / 2 + dot(d, right) * scale / depth, h / 2 - dot(d, up) * scale / depth, depth];
    };

    const grid = terrainMeta?.terrainGrid;
    if (Array.isArray(grid) && grid.length) {
      const sortedQuads = grid
        .map(q => ({ q, depth: Math.hypot(q.center[0] - camera.eye[0], q.center[1] - camera.eye[1], q.center[2] - camera.eye[2]) }))
        .sort((a, b) => b.depth - a.depth);
      for (const { q } of sortedQuads) {
        const pts = q.pts.map(project);
        if (pts.some(p => !p)) continue;
        c.beginPath();
        for (let i = 0; i < 4; i++) {
          const [u, v] = pts[i];
          if (i) c.lineTo(u, v);
          else c.moveTo(u, v);
        }
        c.closePath();
        const r = Math.round(clamp(q.color[0] * 255, 0, 255));
        const g = Math.round(clamp(q.color[1] * 255, 0, 255));
        const b = Math.round(clamp(q.color[2] * 255, 0, 255));
        c.fillStyle = `rgb(${r},${g},${b})`;
        c.fill();
      }
    }

    const faces = [
      { i: [4, 5, 6, 7], n: [0, 1, 0], light: 1.05 },
      { i: [0, 1, 5, 4], n: [0, 0, 1], light: 0.88 },
      { i: [1, 2, 6, 5], n: [1, 0, 0], light: 0.70 },
      { i: [2, 3, 7, 6], n: [0, 0, -1], light: 0.68 },
      { i: [3, 0, 4, 7], n: [-1, 0, 0], light: 0.80 }
    ];
    const filtered = Array.isArray(grid) && grid.length
      ? objects.filter((o, idx) => !(idx === 0 && o[0] === 0 && o[2] === 0 && o[3] >= 150 && o[5] >= 150))
      : objects;
    const ordered = filtered
      .map((o, i) => ({ o, i, depth: Math.hypot(o[0] - camera.eye[0], o[1] - camera.eye[1], o[2] - camera.eye[2]) }))
      .sort((a, b) => (a.i === 0 && !grid?.length ? -1 : b.i === 0 && !grid?.length ? 1 : b.depth - a.depth));

    for (const { o } of ordered) {
      const [x, y, z, sx, sy, sz, r, g, b] = o;
      const pts = [[-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]]
        .map(q => [x + q[0] * sx / 2, y + q[1] * sy / 2, z + q[2] * sz / 2]);
      const projected = pts.map(project);
      if (projected.every(p => !p)) continue;
      for (const f of faces) {
        const cv = dot(f.n, [camera.eye[0] - x, camera.eye[1] - y, camera.eye[2] - z]);
        if (cv <= 0 || f.i.some(i => !projected[i])) continue;
        const shade = f.light;
        c.beginPath();
        for (let j = 0; j < 4; j++) {
          const [u, v] = projected[f.i[j]];
          if (j) c.lineTo(u, v);
          else c.moveTo(u, v);
        }
        c.closePath();
        const red = Math.round(clamp(r * shade * 255, 0, 255));
        const green = Math.round(clamp(g * shade * 255, 0, 255));
        const blue = Math.round(clamp(b * shade * 255, 0, 255));
        c.fillStyle = `rgb(${red},${green},${blue})`;
        c.fill();
      }
    }
    c.fillStyle = '#e7d6b5';
    c.font = '11px monospace';
    c.fillText('SOFTWARE 3D MODE · WEBGL2 NOT AVAILABLE', 22, h - 170);
  }
}

const instance = (out, x, y, z, sx, sy, sz, color, shape = 'box') => {
  const item = [x, y, z, sx, sy, sz, ...color];
  item.shape = shape;
  out.push(item);
};
const factionRgb = (hex, light = 1) => hexColor(hex).map(v => clamp(v * light, 0, 1));

function formation(id, side, type, order, start, ratio, color) {
  const count = type === 'cavalry' ? 15 : type === 'archers' ? 24 : 36;
  const x = (order - 2.5) * 10;
  const z = side === 'attacker' ? 24 : -24;
  const speed = type === 'cavalry' ? 6.8 : type === 'archers' ? 3.6 : 4.5;
  const range = type === 'archers' ? 15 : 2.5;
  const damage = type === 'cavalry' ? 18 : type === 'archers' ? 9 : 11;
  return {
    id, side, type, x, z, targetX: x, targetZ: z, orderX: x, orderZ: z, order,
    life: 100, initial: count, units: count, displayUnits: count, morale: 100,
    baseSpeed: speed, baseRange: range, baseDamage: damage, speed, range, damage,
    armor: 1, cavalryCounter: 1, cooldown: 0, color, enabled: ratio > 0, routed: ratio <= 0,
    lossScale: ratio, phase: order * 0.87
  };
}

function attachTactics(group, faction, formationId) {
  const doctrine = militaryDoctrine(faction);
  const selected = doctrine.formations.includes(formationId) ? formationId : doctrine.formations[0];
  const stats = combatStatistics(faction, group.type, selected);
  group.doctrine = doctrine.id;
  group.specialist = doctrine.unique;
  group.formationId = selected;
  const p = group.profile || { speed: 1, range: 1, damage: 1, armor: 1, counter: 1 };
  const r = group.readiness || { speed: 1, power: 1 };
  group.speed = group.baseSpeed * stats.speed * p.speed * r.speed;
  group.range = group.baseRange * stats.range * p.range;
  group.damage = group.baseDamage * stats.damage * p.damage * r.power;
  group.armor = stats.defense * p.armor;
  group.cavalryCounter = stats.cavalryCounter * p.counter;
  return group;
}

export class BattleGame {
  constructor(canvas, descriptor = {}, game = {}, onFinish = () => {}, onStatus = null, opts = {}) {
    const win = globalThis.window;
    const doc = globalThis.document;
    const nowMs = () => globalThis.performance?.now?.() ?? Date.now();

    this.canvas = canvas;
    this.descriptor = descriptor;
    this.simpleField = !!descriptor.simpleField && !!descriptor.fieldBattle;
    this.game = game;
    this.onFinish = onFinish;
    this.onStatus = onStatus;
    this.onSelect = opts?.onSelect || descriptor?.onSelect || null;
    this.overlayCanvas = opts?.overlayCanvas || descriptor?.overlayCanvas || doc?.getElementById?.('battle-overlay') || null;
    this.running = true;
    this.paused = Boolean(descriptor.interactive);
    this.deployment = Boolean(descriptor.interactive);
    this.done = false;
    this.elapsed = 0;
    this.selected = 0;
    this.selectedGroupId = null;
    this.battleSpeed = 1;
    this.rallyCooldowns = {};
    this.fieldSeed = 1450;
    this.effects = [];
    this.camera = { yaw: 0.38, distance: 72, target: [0, 0, -3], eye: [0, 55, 80] };
    this.drag = null;
    this.keys = new Set();
    this.projectiles = [];
    this.audio = browserFieldAudio(descriptor.soundEnabled !== false);
    this.music = browserBattleMusic(descriptor.soundEnabled !== false);
    this.last = nowMs();

    const coarse = win?.matchMedia?.('(pointer: coarse)')?.matches || false;
    const province = game?.provinces?.[descriptor.to];
    const staticProv = game?.world?.provinces?.find?.(p => p.id === descriptor.to);
    const fortLevel = descriptor.fieldBattle ? 0 : province?.buildings?.fort || 0;
    const desertFactions = new Set(['mamluks', 'delhi', 'bahmani', 'gujarat', 'malwa', 'morocco', 'tunis', 'mali', 'songhai', 'arabia', 'timurids', 'persia', 'oman', 'yemen', 'safavids']);
    const biome = desertFactions.has(game?.player) || desertFactions.has(descriptor.enemy) ? 'desert' : 'temperate';
    this.biome = biome;
    this.terrainType = descriptor.terrain || province?.terrain || staticProv?.terrain || (biome === 'desert' ? 'desert' : 'plains');

    const config = {
      fortLevel,
      biome,
      terrain: this.terrainType,
      fieldBattle: !!descriptor.fieldBattle,
      seed: 1450 + Math.round(fortLevel * 23),
      attackerRealm: game?.player,
      defenderRealm: descriptor.enemy
    };

    const chosen = chooseBattleRenderer(canvas, {
      probe: c => c.getContext?.('webgl2'),
      three: c => new ThreeBattleScene(c, config),
      native: c => new Renderer(c),
      software: c => new CanvasFallback(c),
      replace: freshBattleCanvas,
      warn: e => console.warn('Battle renderer fallback:', e)
    });
    canvas = chosen.canvas;
    this.canvas = canvas;
    this.ctx = chosen.renderer;
    if (this.ctx) this.ctx.terrainType = this.terrainType;
    this.rendererMode = chosen.mode;
    this.mobile = coarse;
    this.frameRemainder = 0;

    if (descriptor.fieldBattle) {
      const seed = [...String(descriptor.to || 'practice')].reduce((n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) >>> 0, 1450);
      const compact = coarse || this.ctx instanceof CanvasFallback;
      this.fieldLandscape = fieldScenery(seed, this.biome || 'temperate', compact);
      this.terrainProps = terrainVisualProps(this.terrainType, this.biome || 'temperate', compact);
      this.terrainGrid = terrainGroundGrid(this.terrainType, this.biome || 'temperate', compact);
    } else {
      this.terrainProps = [];
      this.terrainGrid = null;
    }

    this.scenery = null;
    this.sceneryPlacements = [];
    if (this.ctx instanceof Renderer) {
      try {
        this.scenery = new BattleModelArt(this.ctx.gl);
        const load = (id, ...paths) => {
          (async () => {
            for (const path of paths) {
              const result = await this.scenery?.load(id, new URL(path, import.meta.url));
              if (result) break;
            }
          })();
        };
        if (!descriptor.fieldBattle) {
          load('wall', '../assets/battle/kenney/wall.glb', '../source/low-ruined-wall-section-optimized.glb');
          load('gate', '../assets/battle/kenney/gate.glb');
          load('tower', '../assets/battle/kenney/tower-square-base.glb');
          load('catapult', '../assets/battle/kenney/siege-catapult.glb');
          for (let j = -3; j <= 3; j++) if (j !== 0) this.sceneryPlacements.push({ id: 'wall', x: j * 9, y: 0, z: -42, size: 8.5 });
          this.sceneryPlacements.push({ id: 'gate', x: 0, z: -42, size: 6.5 });
          for (const x of [-31, 31]) this.sceneryPlacements.push({ id: 'tower', x, z: -42, size: 10 });
          this.sceneryPlacements.push({ id: 'catapult', x: 29, z: 22, size: 7 });
        }
        const indianFactions = new Set(['vijayanagara', 'delhi', 'bahmani', 'bengal', 'gujarat', 'malwa', 'jaunpur']);
        if (indianFactions.has(game?.player) || indianFactions.has(descriptor.enemy)) {
          load('temple', '../source/south-indian-small-temple-kadamba-style-optimized%20(1).glb');
          this.sceneryPlacements.push({ id: 'temple', x: 43, y: 0, z: -40, size: 11 });
        }
      } catch (e) {
        console.warn('Optional battle scenery disabled:', e);
        this.scenery = null;
      }
    }

    const playerFaction = game?.factions?.[game?.player] || { id: game?.player || 'attacker', name: 'Attacker', color: '#4b98b3' };
    const enemy = game?.factions?.[descriptor.enemy] || { id: descriptor.enemy || 'defender', name: 'Defender', color: '#b86855' };
    const fieldArmy = game?.armies?.[descriptor.attacker];
    const garrison = startingTroops(playerFaction, descriptor.defenseMode ? (descriptor.defenseGarrison || 90) : 0);
    const alliedFieldArmies = participatingArmies(game, descriptor.playerArmies || [descriptor.attacker], game?.player, descriptor.defenseMode ? descriptor.to : descriptor.from, descriptor.showcase ? null : descriptor.enemy);
    const hostileFieldArmies = participatingArmies(game, descriptor.enemyArmies || [descriptor.enemyArmy], descriptor.enemy, descriptor.defenseMode ? descriptor.from : descriptor.to, descriptor.showcase ? null : game?.player);
    const hostileGarrison = startingTroops(enemy, descriptor.defenseMode ? 0 : descriptor.defenseGarrison || 0);
    const fieldStats = (armies, reserve, type) => combinedFieldStats(armies, reserve, a => armyReadiness(game, a), (a, t) => regimentProfile(game, a, t), type);

    const a = descriptor.fieldBattle
      ? aggregateForce(alliedFieldArmies, garrison)
      : fieldArmy
        ? { ...fieldArmy, ...Object.fromEntries(['infantry', 'archers', 'cavalry'].map(t => [t, (fieldArmy[t] || 0) + garrison[t]])) }
        : garrison;
    const enemyArmy = descriptor.enemyArmy && game?.armies?.[descriptor.enemyArmy];
    const enemies = descriptor.fieldBattle && !descriptor.showcase
      ? aggregateForce(hostileFieldArmies, hostileGarrison)
      : enemyArmy
        ? { ...enemyArmy, ...Object.fromEntries(['infantry', 'archers', 'cavalry'].map(t => [t, (enemyArmy[t] || 0) + (descriptor.defenseMode ? 0 : startingTroops(enemy, descriptor.defenseGarrison || 0)[t])])) }
        : startingTroops(enemy, Math.max(95, (descriptor.defenseTroops || 0) + (descriptor.defenseMode ? 0 : descriptor.defenseGarrison || 0)));

    this.siege = descriptor.fieldBattle ? null : createSiegeState(game?.provinces?.[descriptor.to]?.buildings?.fort || 0, !!descriptor.defenseMode);
    this.groups = [];

    const slotCount = force => this.simpleField ? Math.min(12, Math.max(3, Math.ceil((force.infantry + force.archers + force.cavalry) / 100))) : 6;
    const mySlots = armyFormationSlots(playerFaction, a, slotCount(a));
    const enemySlots = armyFormationSlots(enemy, enemies, slotCount(enemies));
    const myDoctrine = militaryDoctrine(playerFaction);
    const enemyDoctrine = militaryDoctrine(enemy);

    const packedAttacker = this.simpleField
      ? packSpecialistRegiments(a, alliedFieldArmies, game.military?.armies, REGIMENTS, slotCount(a))
      : packActiveRegiments(a, mySlots, myDoctrine);
    const packedDefender = this.simpleField
      ? packSpecialistRegiments(enemies, hostileFieldArmies, game.military?.armies, REGIMENTS, slotCount(enemies))
      : packActiveRegiments(enemies, enemySlots, enemyDoctrine);

    for (const entry of packedAttacker) {
      const idx = entry.slotIndex;
      const home = descriptor.defenseMode ? -1 : 1;
      const position = this.simpleField ? home * (entry.type === 'archers' ? 34 : entry.type === 'cavalry' ? 25 : 19) : descriptor.defenseMode ? -26 : 24;
      const startX = this.simpleField ? (idx - (packedAttacker.length - 1) / 2) * Math.min(8,112/Math.max(1,packedAttacker.length-1)) : (idx - (packedAttacker.length - 1) / 2) * 10;
      const g = formation('p' + idx, 'attacker', entry.type, idx, [0, 0], entry.troops, '#4b98b3');
      g.x = startX;
      g.targetX = startX;
      g.orderX = startX;
      g.z = position;
      g.targetZ = position;
      g.orderZ = position;
      g.kind = entry.kind;
      g.lane = entry.lane;
      g.life = 100;
      g.initialLife = 100;
      g.troopCount = entry.troops;
      g.troops = entry.troops;
      g.maxTroops = entry.troops;
      g.routed = false;
      if (descriptor.fieldBattle) Object.assign(g, fieldStats(alliedFieldArmies, garrison, entry.type));
      else {
        g.profile = regimentProfile(game, a, entry.type);
        g.readiness = armyReadiness(game, a);
      }
      if (this.simpleField && entry.profile) {g.profile = entry.profile; g.specialistId = entry.specialistId;}
      g.morale = this.simpleField ? Math.max(50, g.readiness.morale) : g.readiness.morale;
      attachTactics(g, playerFaction, this.simpleField ? chooseCounterFormation(playerFaction, 'infantry', g.type) : myDoctrine.formations[0]);
      if (descriptor.fieldBattle) {
        initializeFieldGroup(g);
        g.terrainType = this.terrainType;
        if (descriptor.defenseMode) {
          g.facingZ *= -1;
          g.facing = Math.atan2(g.facingX, g.facingZ);
        }
      }
      this.groups.push(g);
    }

    for (const entry of packedDefender) {
      const idx = entry.slotIndex;
      const home = descriptor.defenseMode ? 1 : -1;
      const position = this.simpleField ? home * (entry.type === 'archers' ? 34 : entry.type === 'cavalry' ? 25 : 19) : descriptor.defenseMode ? 24 : -24;
      const startX = this.simpleField ? (idx - (packedDefender.length - 1) / 2) * Math.min(8,112/Math.max(1,packedDefender.length-1)) : (idx - (packedDefender.length - 1) / 2) * 10;
      const g = formation('e' + idx, 'defender', entry.type, idx, [0, 0], entry.troops, enemy?.color || '#b86855');
      g.x = startX;
      g.targetX = startX;
      g.orderX = startX;
      g.z = position;
      g.targetZ = position;
      g.orderZ = position;
      g.kind = entry.kind;
      g.lane = entry.lane;
      g.life = 100;
      g.initialLife = 100;
      g.troopCount = entry.troops;
      g.troops = entry.troops;
      g.maxTroops = entry.troops;
      g.routed = false;
      if (descriptor.fieldBattle && !descriptor.showcase) Object.assign(g, fieldStats(hostileFieldArmies, hostileGarrison, entry.type));
      else {
        g.profile = regimentProfile(game, enemyArmy || enemies, entry.type);
        g.readiness = armyReadiness(game, enemyArmy || enemies);
      }
      if (this.simpleField && entry.profile) {g.profile = entry.profile; g.specialistId = entry.specialistId;}
      g.morale = this.simpleField ? Math.max(50, g.readiness.morale) : g.readiness.morale;
      attachTactics(g, enemy, this.simpleField ? chooseCounterFormation(enemy, 'infantry', g.type) : enemyDoctrine.formations[idx % enemyDoctrine.formations.length]);
      if (descriptor.fieldBattle) {
        initializeFieldGroup(g);
        g.terrainType = this.terrainType;
        if (descriptor.defenseMode) {
          g.facingZ *= -1;
          g.facing = Math.atan2(g.facingX, g.facingZ);
        }
      }
      this.groups.push(g);
    }

    this.selected = 0;
    this.selectedGroupId = this.groups[0]?.side === 'attacker' ? this.groups[0].id : null;

    this.terrain = [];
    let randSeed = 1450;
    const rng = () => ((randSeed = (randSeed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 105; i++) {
      const x = (rng() - 0.5) * 125;
      const z = (rng() - 0.5) * 100;
      if (Math.abs(z) < 33 && Math.abs(x) < 44) continue;
      this.terrain.push({ x, z, h: 1.4 + rng() * 5, r: rng(), type: rng() > 0.55 ? 'tree' : 'rock' });
    }

    if (!this.deployment) browserCampaignAudio.setMode('silent');

    this._onKeyDown = e => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(doc?.activeElement?.tagName)) return;
      this.keys.add(e.key.toLowerCase());
      if (/^Digit[1-6]$/.test(e.code)) {
        const idx = Number(e.code.slice(-1)) - 1;
        if (this.groups[idx]?.side === 'attacker') {
          this.selectGroup(idx);
        }
      }
      if (e.code === 'Space') {
        if (!this.deployment && !this.done) this.togglePause();
        e.preventDefault();
      }
    };
    this._onKeyUp = e => this.keys.delete(e.key.toLowerCase());
    this._onWheel = e => {
      e.preventDefault();
      this.cameraGoal = null;
      this.camera.distance = clamp(this.camera.distance + e.deltaY * 0.065, 35, 165);
    };
    this._onContext = e => e.preventDefault();
    this._onDown = e => {
      if (e.button === 2) {
        e.preventDefault();
        const target = this.rayGround(e.offsetX, e.offsetY);
        const group = this.selectedGroup();
        if (target && group?.side === 'attacker' && !group.routed) {
          if (this.simpleField && this.deployment) {
            this.placeRegiment(group, target[0], target[2]);
            return;
          }
          if (this.descriptor.fieldBattle) {
            if (issueGroupMoveOrder(group, target[0], target[2])) {
              this.audio?.play('order');
              this.report();
            }
            return;
          }
          group.targetX = clamp(target[0], -64, 64);
          group.targetZ = clamp(target[2], -46, 46);
          group.manual = true;
        }
        return;
      }
      if (e.button === 0) {
        this.drag = { x: e.clientX, y: e.clientY, moved: 0, pointer: e.pointerId };
        canvas.setPointerCapture?.(e.pointerId);
      }
    };
    this._onMove = e => {
      if (this.drag && this.drag.pointer === e.pointerId) {
        const dx = e.clientX - this.drag.x;
        const dy = e.clientY - this.drag.y;
        this.drag.x = e.clientX;
        this.drag.y = e.clientY;
        this.drag.moved += Math.hypot(dx, dy);
        if (this.drag.moved > 3) {
          this.cameraGoal = null;
          this.camera.target[0] -= dx * 0.08;
          this.camera.target[2] -= dy * 0.08;
        }
      }
    };
    this._onUp = e => {
      if (this.drag?.pointer !== e.pointerId) return;
      if (this.drag.moved < 8) {
        const r = canvas.getBoundingClientRect?.() || { left: 0, top: 0 };
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        this.handleCanvasTap(x, y);
      }
      this.drag = null;
    };
    this._onCancel = () => { this.drag = null; };
    this._onContextLost = e => {
      e.preventDefault();
      this.renderLost = true;
      this.paused = true;
      this.audio?.silence();
      this.music?.sync(false);
      this.report();
    };
    this._onVisibility = () => {
      this.last = nowMs();
      this.frameRemainder = 0;
      if (doc?.hidden) this.audio?.silence();
      this.music?.sync(!doc?.hidden && !this.paused && !this.done && !this.deployment && !this.renderLost);
    };
    this._onRallyBtn = () => { this.rallyHorn('attacker'); };
    this._onSpeedBtn = () => { this.setBattleSpeed(this.battleSpeed >= 2 ? 1 : 2); };

    win?.addEventListener?.('keydown', this._onKeyDown);
    win?.addEventListener?.('keyup', this._onKeyUp);
    canvas?.addEventListener?.('wheel', this._onWheel, { passive: false });
    canvas?.addEventListener?.('contextmenu', this._onContext);
    canvas?.addEventListener?.('pointerdown', this._onDown);
    win?.addEventListener?.('pointermove', this._onMove);
    win?.addEventListener?.('pointerup', this._onUp);
    canvas?.addEventListener?.('pointercancel', this._onCancel);
    canvas?.addEventListener?.('webglcontextlost', this._onContextLost);
    doc?.addEventListener?.('visibilitychange', this._onVisibility);

    this._rallyEl = doc?.getElementById?.('battle-rally') || null;
    this._speedEl = doc?.getElementById?.('battle-speed') || null;
    this._rallyEl?.addEventListener?.('click', this._onRallyBtn);
    this._speedEl?.addEventListener?.('click', this._onSpeedBtn);

    this.report();
    this.loop = this.loop.bind(this);
    if (typeof globalThis.requestAnimationFrame === 'function') {
      this.raf = globalThis.requestAnimationFrame(this.loop);
    }
  }

  selectedGroup() {
    const g = this.groups?.[this.selected];
    if (g) return g;
    if (this.selectedGroupId) return this.groups?.find(x => x.id === this.selectedGroupId) || null;
    return null;
  }

  selectGroup(indexOrId) {
    const idx = typeof indexOrId === 'number'
      ? indexOrId
      : this.groups.findIndex(g => g.id === indexOrId);
    const g = this.groups?.[idx];
    if (!g || g.side !== 'attacker' || g.routed || g.life <= 0) return null;
    this.selected = idx;
    this.selectedGroupId = g.id;
    this.onSelect?.(g);
    this.report();
    return g;
  }

  setBattleSpeed(speed) {
    this.battleSpeed = Number(speed) >= 2 ? 2 : 1;
    const doc = globalThis.document;
    const btn = this._speedEl || doc?.getElementById?.('battle-speed');
    if (btn) {
      btn.textContent = `${this.battleSpeed}×`;
      btn.setAttribute?.('aria-pressed', String(this.battleSpeed === 2));
    }
    this.report();
    return this.battleSpeed;
  }

  rallyHorn(side = 'attacker') {
    const res = triggerRallyHorn(this, side);
    if (res.ok) {
      this.audio?.unlock();
      if (!this.audio?.play('rally')) this.audio?.play('horn');
      this.report();
    }
    return res;
  }

  placeRegiment(group, x, z) {
    if (!this.deployment || !group || group.side !== 'attacker' || group.routed) return false;
    const home = this.descriptor.defenseMode ? -1 : 1;
    if (!Number.isFinite(x) || !Number.isFinite(z) || z * home < 9) return false;
    group.x = clamp(x, -58, 58);
    group.z = home * clamp(z * home, 9, 40);
    group.lane = group.x < -12 ? 0 : group.x > 12 ? 2 : 1;
    issueFieldOrder(group, 'advance');
    group.deploymentRevision = (group.deploymentRevision || 0) + 1;
    this.report();
    return true;
  }
  handleCanvasTap(x, y) {
    if (this.done) return null;

    if (this.tapMove) {
      const p = this.rayGround(x, y);
      this.tapMove = false;
      const sel = this.selectedGroup();
      if (p && sel && sel.side === 'attacker' && !sel.routed) {
        if (this.simpleField && this.deployment) {
          if (!this.placeRegiment(sel, p[0], p[2])) return null;
        } else if (this.descriptor?.fieldBattle) {
          issueGroupMoveOrder(sel, p[0], p[2]);
        } else {
          sel.targetX = clamp(p[0], -64, 64);
          sel.targetZ = clamp(p[2], -46, 46);
          sel.moveX = sel.targetX;
          sel.moveZ = sel.targetZ;
          sel.manual = true;
        }
        this.audio?.play('order');
        this.report();
        return { action: 'move', group: sel, point: [p[0], p[2]] };
      }
      this.report();
      return null;
    }

    // 1. Check allied active regiments first
    let bestAllyIdx = -1;
    let bestAllyDist = 28;
    for (let i = 0; i < this.groups.length; i++) {
      const g = this.groups[i];
      if (!g || g.side !== 'attacker' || g.routed || g.life <= 0) continue;
      const gy = terrainHeight(g.x, g.z, this.terrainType);
      const p = this.project([g.x, gy + 1.4, g.z]);
      if (!p) continue;
      const d = Math.hypot(p[0] - x, p[1] - y);
      if (d < bestAllyDist) {
        bestAllyIdx = i;
        bestAllyDist = d;
      }
    }
    if (bestAllyIdx >= 0) {
      const selected = this.selectGroup(bestAllyIdx);
      return selected ? { action: 'select', group: selected } : null;
    }

    const sel = this.selectedGroup();
    if (!sel || sel.side !== 'attacker' || sel.routed || sel.life <= 0) return null;

    // 2. Check enemy active regiments to issue focus target order
    let bestEnemy = null;
    let bestEnemyDist = 28;
    for (const e of this.groups) {
      if (!e || e.side !== 'defender' || e.routed || e.life <= 0) continue;
      const ey = terrainHeight(e.x, e.z, this.terrainType);
      const p = this.project([e.x, ey + 1.4, e.z]);
      if (!p) continue;
      const d = Math.hypot(p[0] - x, p[1] - y);
      if (d < bestEnemyDist) {
        bestEnemy = e;
        bestEnemyDist = d;
      }
    }
    if (bestEnemy) {
      if (this.simpleField && this.deployment) return null;
      if (this.descriptor?.fieldBattle) {
        issueGroupTargetOrder(sel, bestEnemy);
      } else {
        sel.focusTargetId = bestEnemy.id;
        sel.focusTarget = bestEnemy.id;
        sel.targetX = bestEnemy.x;
        sel.targetZ = bestEnemy.z;
        sel.manual = true;
      }
      this.audio?.play('order');
      this.report();
      return { action: 'target', group: sel, target: bestEnemy };
    }

    // 3. Tap empty battlefield ground -> direct move order
    const groundPt = this.rayGround(x, y);
    if (groundPt) {
      if (this.simpleField && this.deployment) {
        if (!this.placeRegiment(sel, groundPt[0], groundPt[2])) return null;
      } else if (this.descriptor?.fieldBattle) {
        issueGroupMoveOrder(sel, groundPt[0], groundPt[2]);
      } else {
        sel.targetX = clamp(groundPt[0], -64, 64);
        sel.targetZ = clamp(groundPt[2], -46, 46);
        sel.moveX = sel.targetX;
        sel.moveZ = sel.targetZ;
        sel.manual = true;
      }
      this.audio?.play('order');
      this.report();
      return { action: 'move', group: sel, point: [groundPt[0], groundPt[2]] };
    }
    return null;
  }

  focusCamera(mode) {
    const goal = cameraDestination(mode, this.groups, this.selected);
    if (!goal) return false;
    this.cameraGoal = goal;
    return true;
  }

  updateCamera(dt) {
    const c = this.camera, k = this.keys;
    if (['q', 'e', 'w', 'a', 's', 'd'].some(x => k.has(x))) this.cameraGoal = null;
    if (this.cameraGoal && blendCamera(c, this.cameraGoal, dt)) this.cameraGoal = null;
    if (k.has('q')) c.yaw -= dt * 0.9;
    if (k.has('e')) c.yaw += dt * 0.9;
    if (k.has('w')) c.target[2] -= dt * 22;
    if (k.has('s')) c.target[2] += dt * 22;
    if (k.has('a')) c.target[0] -= dt * 22;
    if (k.has('d')) c.target[0] += dt * 22;
    c.target[0] = clamp(c.target[0], -90, 90);
    c.target[2] = clamp(c.target[2], -75, 75);
  }

  getCamera() {
    const c = this.camera, y = c.yaw, d = c.distance;
    const eye = [c.target[0] + Math.sin(y) * d * 0.68, c.target[1] + d * 0.72, c.target[2] + Math.cos(y) * d * 0.68];
    return { eye, target: c.target };
  }

  cameraVectors() {
    const { eye, target } = this.getCamera();
    const forward = norm(sub(target, eye));
    const right = norm(cross(forward, [0, 1, 0]));
    const up = cross(right, forward);
    return { eye, forward, right, up };
  }

  rayGround(px, py) {
    const { eye, forward, right, up } = this.cameraVectors();
    const w = this.canvas?.clientWidth || this.canvas?.width || 900;
    const h = this.canvas?.clientHeight || this.canvas?.height || 600;
    const ratio = w / h, t = Math.tan(Math.PI / 6);
    const u = (2 * px / w - 1) * ratio * t;
    const v = (1 - 2 * py / h) * t;
    const dir = norm([
      forward[0] + right[0] * u + up[0] * v,
      forward[1] + right[1] * u + up[1] * v,
      forward[2] + right[2] * u + up[2] * v
    ]);
    if (dir[1] >= -1e-4) return null;
    let distRay = -eye[1] / dir[1];
    const terrain = this.terrainType || 'plains';
    for (let i = 0; i < 4; i++) {
      const rx = eye[0] + distRay * dir[0];
      const ry = eye[1] + distRay * dir[1];
      const rz = eye[2] + distRay * dir[2];
      const groundY = terrainHeight(rx, rz, terrain);
      distRay += (ry - groundY) / (-dir[1]);
    }
    const hx = eye[0] + distRay * dir[0];
    const hz = eye[2] + distRay * dir[2];
    return [hx, terrainHeight(hx, hz, terrain), hz];
  }

  project(p) {
    const { eye, forward, right, up } = this.cameraVectors();
    const d = sub(p, eye);
    const depth = dot(d, forward);
    if (depth <= 0.5) return null;
    const w = this.canvas?.clientWidth || this.canvas?.width || 900;
    const h = this.canvas?.clientHeight || this.canvas?.height || 600;
    const scale = h / (2 * Math.tan(Math.PI / 6));
    return [w / 2 + dot(d, right) * scale / depth, h / 2 - dot(d, up) * scale / depth];
  }

  report() {
    const sel = this.groups?.[this.selected] ?? null;
    if (sel) this.selectedGroupId = sel.id;
    const rallyCooldown = Math.max(0, (this.rallyCooldowns?.attacker ?? 0) - (this.elapsed || 0));

    const doc = globalThis.document;
    const focusEl = doc?.getElementById?.('battle-focus');
    if (focusEl) {
      if (sel && !sel.routed && sel.life > 0) {
        const badge = unitBadgeLabel(sel);
        const troops = Math.max(0, Math.round(sel.troops ?? (sel.troopCount || 0) * clamp(sel.life / Math.max(1, sel.initialLife || 100), 0, 1)));
        const flags = sel.statusFlags?.length ? ` · ${sel.statusFlags.join(' ')}` : '';
        const tgtName = sel.focusTargetId ? ` → ${sel.focusTargetId}` : '';
        focusEl.hidden = false;
        focusEl.textContent = `${badge} ${troops} · ${(sel.terrainName || this.terrainType || 'plains').toUpperCase()} · ${(sel.fieldOrder || 'advance').toUpperCase()}${tgtName}${flags}`;
      } else {
        focusEl.hidden = true;
        focusEl.textContent = '';
      }
    }
    const speedEl = this._speedEl || doc?.getElementById?.('battle-speed');
    if (speedEl) {
      speedEl.textContent = `${this.battleSpeed || 1}×`;
    }
    const rallyEl = this._rallyEl || doc?.getElementById?.('battle-rally');
    if (rallyEl) {
      rallyEl.disabled = rallyCooldown > 0 || !!this.done || !!this.deployment;
      rallyEl.textContent = rallyCooldown > 0 ? `⚑ RALLY (${Math.ceil(rallyCooldown)}s)` : '⚑ RALLY';
    }

    if (this.onStatus) {
      this.onStatus({
        groups: this.groups,
        selected: this.selected,
        selectedGroupId: this.selectedGroupId,
        selectedGroup: sel,
        battleSpeed: this.battleSpeed || 1,
        speed: this.battleSpeed || 1,
        terrain: this.terrainType,
        rallyCooldown,
        paused: this.paused,
        elapsed: this.elapsed,
        deployment: this.deployment,
        siege: this.siege,
        enemyPosture: this.enemyPosture,
        tapMove: this.tapMove,
        rendererMode: this.rendererMode,
        renderLost: !!this.renderLost,
        roster: {
          attacker: battleRoster(this.groups, 'attacker', !!this.descriptor?.fieldBattle),
          defender: battleRoster(this.groups, 'defender', !!this.descriptor?.fieldBattle)
        }
      });
    }
  }

  setFormation(index, id) {
    const g = this.groups?.[index];
    if (!g || g.side !== 'attacker' || g.routed || !availableFormations(this.game.factions[this.game.player]).some(f => f.id === id)) return false;
    attachTactics(g, this.game.factions[this.game.player], id);
    if (g.type === 'infantry') g.kind = g.specialistId === 'pikes' || id === 'pike_square' ? 'pikemen' : g.specialistId === 'spearmen' ? 'spearmen' : 'infantry';
    if (this.deployment) g.deploymentRevision = (g.deploymentRevision || 0) + 1;
    this.report();
    return true;
  }

  setLane(index, lane) {
    if (!this.deployment || ![0, 1, 2].includes(lane)) return false;
    const g = this.groups?.[index];
    if (!g || g.side !== 'attacker' || g.routed) return false;
    const sameLaneOffset = this.simpleField ? ((g.slot ?? index) % 4 - 1.5) * 4.5 : ((g.slot ?? index) % 2 - 0.5) * 4.5;
    g.lane = lane;
    g.x = (lane - 1) * 24 + sameLaneOffset;
    g.orderX = g.x;
    g.targetX = g.x;
    g.anchorX = g.x;
    g.moveX = g.x;
    g.anchorZ = g.z;
    g.moveZ = g.z;
    g.deploymentRevision = (g.deploymentRevision || 0) + 1;
    this.report();
    return true;
  }

  command(index, order, point, all = false) {
    if (!this.descriptor?.fieldBattle || this.done) return false;
    const groups = all ? this.groups.filter(g => g.side === 'attacker') : [this.groups[index]];
    let changed = false;
    for (const g of groups) {
      if (g?.side === 'attacker' && issueFieldOrder(g, order, point)) changed = true;
    }
    if (changed) {
      this.audio?.play('order');
      this.report();
    }
    return changed;
  }

  startAssault() {
    if (!this.deployment || this.renderLost) return false;
    if (this.simpleField) for (const g of this.groups) if (!g.routed) issueFieldOrder(g, 'advance');
    this.deployment = false;
    this.paused = false;
    this.frameRemainder = 0;
    browserCampaignAudio.setMode('silent');
    this.audio?.unlock();
    this.music?.sync(!globalThis.document?.hidden);
    this.audio?.play('horn');
    this.last = globalThis.performance?.now?.() ?? Date.now();
    this.report();
    return true;
  }

  _siegeRoll() {
    this._siegeSeed = ((this._siegeSeed ?? 145019) * 1664525 + 1013904223) >>> 0;
    return this._siegeSeed / 4294967296;
  }

  update(dt) {
    const speed = Number.isFinite(this.battleSpeed) && this.battleSpeed > 0 ? this.battleSpeed : 1;
    const subSteps = speed > 1 && dt > 0.025 ? Math.ceil(speed) : 1;
    const sdt = (dt * speed) / subSteps;

    for (let step = 0; step < subSteps && !this.done; step++) {
      this.elapsed += sdt;
      if (this.descriptor?.fieldBattle) {
        if (this.nextFieldPlan === undefined || this.elapsed >= this.nextFieldPlan) {
          if (this.simpleField) this.enemyPosture = 'Advancing';
          else coordinateFieldAI(this);
          this.nextFieldPlan = this.elapsed + 4;
        }
        if (!this.simpleField && this.elapsed % 6 < sdt) {
          const enemyFaction = this.game?.factions?.[this.descriptor?.enemy];
          for (const g of this.groups.filter(g => g.side === 'defender' && !g.routed)) {
            const e = fieldTarget(g, this.groups.filter(o => o.side === 'attacker' && !o.routed));
            if (e && enemyFaction) attachTactics(g, enemyFaction, chooseCounterFormation(enemyFaction, e.type, g.type));
          }
        }
        stepField(this, sdt);
        this.audio?.update(this.groups, this.elapsed, this.camera);
        const strength = side => this.simpleField
          ? this.groups.filter(g => g.side === side && !g.routed).reduce((n,g)=>n+g.troopCount*Math.max(0,g.life)/100,0)
          : fieldStrength(this.groups, side);
        const l = strength('attacker');
        const r = strength('defender');
        if (l <= 0 || r <= 0 || this.elapsed >= 220) {
          this.finish(l > 0 && (r <= 0 || l > r), l, r);
          return;
        }
        continue;
      }

      // Siege branch (backward compatible with tactical-siege.test.mjs, deterministic RNG)
      for (const g of this.groups) {
        if (g.routed) continue;
        g.phase += sdt * (g.type === 'cavalry' ? 10 : 5);
        const enemies = this.groups.filter(o => o.side !== g.side && !o.routed);
        const e = enemies.sort((a, b) => dist([a.x, 0, a.z], [g.x, 0, g.z]) - dist([b.x, 0, b.z], [g.x, 0, g.z]))[0];
        const structure = siegeTarget(this.siege, g);
        if (structure) {
          const distance = Math.hypot(g.x - structure.x, g.z - structure.z);
          const range = Math.max(g.range, g.readiness?.siege > 0 ? 14 : 3);
          g.cooldown -= sdt;
          if (distance <= range) {
            if (g.cooldown <= 0) {
              g.cooldown = 1.2;
              siegeDamage(this.siege, structure.id, g.damage * 0.36 + (g.readiness?.siege || 0) * 0.10 / Math.max(1, this.groups.filter(o => o.side === g.side && !o.routed).length));
              if (range > 4) this.projectiles.push({ sx: g.x, sz: g.z, tx: structure.x, tz: structure.z, t: 0, kind: 'arrow' });
            }
            continue;
          }
          if (!g.manual) {
            g.targetX = structure.x;
            g.targetZ = structure.z;
          }
          const d = Math.hypot(g.targetX - g.x, g.targetZ - g.z);
          if (d > 0.3) {
            const moveStep = Math.min(d, sdt * g.speed);
            g.x += (g.targetX - g.x) / d * moveStep;
            g.z += (g.targetZ - g.z) / d * moveStep;
          } else g.manual = false;
          continue;
        }
        if (!e) continue;
        let dd = dist([g.x, 0, g.z], [e.x, 0, e.z]);
        if (g.side === 'defender' && this.elapsed % 6 < sdt) {
          const enemyFaction = this.game?.factions?.[this.descriptor?.enemy];
          if (enemyFaction) attachTactics(g, enemyFaction, chooseCounterFormation(enemyFaction, e.type, g.type));
        }
        if (g.side === 'defender' || (!g.manual && g.side === 'attacker')) {
          if (g.type === 'archers' && dd <= g.range * 0.9) {
            g.targetX = g.x;
            g.targetZ = g.z;
          } else {
            g.targetX = e.x;
            g.targetZ = e.z;
            if (this.siege && !siegeBreached(this.siege) && g.side !== this.siege.assaultSide) {
              g.targetZ = Math.min(-21, g.targetZ);
            }
          }
        }
        const d = Math.hypot(g.targetX - g.x, g.targetZ - g.z);
        if (d > 0.3) {
          const moveStep = Math.min(d, sdt * g.speed * (g.life / 100 * 0.4 + 0.6));
          g.x += (g.targetX - g.x) / d * moveStep;
          g.z += (g.targetZ - g.z) / d * moveStep;
        } else if (g.manual) {
          g.manual = false;
        }
        dd = dist([g.x, 0, g.z], [e.x, 0, e.z]);
        g.cooldown -= sdt;
        if (dd < g.range && g.cooldown <= 0) {
          g.cooldown = g.type === 'archers' ? 1.2 : 0.8;
          const damage = g.damage * (0.75 + 0.25 * g.life / 100) * (g.type === 'cavalry' && e.type === 'archers' ? 1.6 : 1) *
            (g.type === 'cavalry' ? 1 / Math.max(0.6, e.cavalryCounter) : 1) /
            Math.max(0.6, e.armor) * (0.82 + this._siegeRoll() * 0.30);
          e.life = Math.max(0, e.life - damage * 0.18);
          e.morale = Math.max(0, e.morale - damage * 0.29);
          if (g.type === 'archers') this.projectiles.push({ sx: g.x, sz: g.z, tx: e.x, tz: e.z, t: 0, kind: 'arrow' });
          if (e.life < 8 || e.morale < 13) {
            e.routed = true;
            e.life = 0;
          }
        }
      }
      for (const p of this.projectiles) p.t += sdt * 2.3;
      this.projectiles = this.projectiles.filter(p => p.t <= 1);
      const left = this.groups.filter(g => g.side === 'attacker' && !g.routed);
      const right = this.groups.filter(g => g.side === 'defender' && !g.routed);
      if (left.length === 0 || (right.length === 0 && (siegeBreached(this.siege) || this.siege?.assaultSide === 'defender')) || this.elapsed >= 220) {
        const leftPower = left.reduce((s, g) => s + g.life, 0);
        const rightPower = right.reduce((s, g) => s + g.life, 0);
        const win = left.length > 0 && (this.siege?.assaultSide === 'defender' && !siegeBreached(this.siege) || right.length === 0 || leftPower > rightPower) && (this.siege?.assaultSide !== 'attacker' || siegeBreached(this.siege));
        this.finish(win, leftPower, rightPower);
        return;
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const obj = [];
    const C = {
      grass: [0.29, 0.36, 0.29], earth: [0.43, 0.40, 0.31], shadow: [0.25, 0.27, 0.23],
      trunk: [0.36, 0.25, 0.18], leaf: [0.28, 0.37, 0.25], stone: [0.42, 0.43, 0.41],
      gold: [0.91, 0.74, 0.42], steel: [0.63, 0.70, 0.69], arrow: [0.96, 0.66, 0.35]
    };
    const field = !!this.descriptor?.fieldBattle;
    const terrain = field ? this.terrainType : null;

    if (this.fieldLandscape) {
      if (!this.ctx.isThreeBattle) obj.push(this.fieldLandscape.ground);
      obj.push(...this.fieldLandscape.items);
      if (this.terrainProps?.length) obj.push(...this.terrainProps);
    } else if (!this.ctx.isThreeBattle) {
      instance(obj, 0, -0.31, 0, 150, 0.6, 118, C.grass);
      for (let x = -65; x <= 65; x += 13) {
        for (let z = -52; z <= 52; z += 13) {
          const shade = (Math.sin(x * 17 + z * 9) + 1) / 14;
          instance(obj, x, -0.006, z, 12, 0.016, 12, [0.28 + shade, 0.34 + shade, 0.275 + shade]);
        }
      }
      for (const t of this.terrain) {
        if (t.type === 'tree') {
          instance(obj, t.x, 0.8, t.z, 0.8, 1.7, 0.8, C.trunk);
          instance(obj, t.x, t.h * 0.64, t.z, t.h * 0.88, t.h * 0.95, t.h * 0.88, C.leaf, 'cone');
        } else {
          instance(obj, t.x, 0.5, t.z, 1.2 + t.r, 1 + t.r, 1.2 + t.r, C.stone, 'sphere');
        }
      }
      if (!this.descriptor.fieldBattle) {
        for (let i = -3; i <= 3; i++) {
          const x = i * 9;
          instance(obj, x, 1.5, -42, 8, 3, 2.6, C.stone);
          if (i % 2 === 0) {
            instance(obj, x, 3.55, -42, 3, 1.5, 3, C.stone);
            instance(obj, x, 4.4, -42, 3.8, 1.1, 3.8, [0.49, 0.45, 0.38], 'cone');
          }
        }
      }
    }

    if (this.siege) {
      for (const q of this.siege.structures) {
        const height = q.hp > 0 ? 1 + 3 * q.hp / q.max : 0.35;
        instance(obj, q.x, height / 2, q.z, q.id === 'gate' ? 9 : 5, height, 3, q.hp > 0 ? C.stone : C.earth);
      }
    }

    const selGroup = this.selectedGroup();
    for (let k = 0; k < this.groups.length; k++) {
      const g = this.groups[k];
      const gy = terrain ? terrainHeight(g.x, g.z, terrain) : 0;
      if (field) {
        const shadow = battleContactShadow(g, terrain);
        if (shadow) obj.push(shadow);
      }
      if (g.routed && (!field || (g.routAge || 0) >= 3)) continue;
      const n = field
        ? visibleSoldierCount(g, Math.round(g.initial * (this.ctx instanceof CanvasFallback ? 0.65 : 1)))
        : Math.max(3, Math.round(g.initial * g.life / 100 * (this.ctx instanceof CanvasFallback ? 0.65 : 1)));
      const offsets = field ? formationOffsets(n, g.formationId, g.type) : null;
      const cols = g.type === 'cavalry' ? 5 : 6;
      const spacing = g.type === 'cavalry' ? 1.25 : 0.73;
      const palette = regimentPalette(g.side, g.type);
      const base = field ? palette.cloth : g.side === 'attacker' ? [0.34, 0.63, 0.73] : g.color?.startsWith('#') ? factionRgb(g.color) : [0.75, 0.34, 0.31];
      const head = [0.76, 0.64, 0.48];
      const shield = g.side === 'attacker' ? [0.20, 0.34, 0.43] : [0.43, 0.24, 0.19];

      if (!(this.ctx.isThreeBattle && this.ctx.modelsReady)) {
        for (let i = 0; i < n; i++) {
          const col = i % cols, row = Math.floor(i / cols);
          const ox = (col - (cols - 1) / 2) * spacing;
          const oz = (row - Math.floor(n / cols) / 2) * spacing;
          const pose = field ? soldierWorldPose(g, offsets[i], terrain) : null;
          const px = pose?.x ?? g.x + ox;
          const pz = pose?.z ?? g.z + oz;
          const py = pose?.y ?? gy;
          const walk = (!field || visualMode(g) === 'walk') ? Math.sin(this.elapsed * 7 + i * 0.55) * 0.045 : 0;

          if (g.type === 'cavalry') {
            instance(obj, px, py + 0.52 + walk, pz, 0.88, 0.65, 1.5, [0.37, 0.32, 0.27], 'sphere');
            instance(obj, px, py + 1.15 + walk, pz, 0.48, 0.76, 0.43, base, 'cylinder');
            instance(obj, px, py + 1.68 + walk, pz, 0.31, 0.29, 0.31, head, 'sphere');
            instance(obj, px, py + 1.87 + walk, pz, 0.40, 0.28, 0.42, C.steel, 'cone');
          } else {
            instance(obj, px, py + 0.75 + walk, pz, 0.44, 0.80, 0.38, base, 'cylinder');
            instance(obj, px, py + 1.30 + walk, pz, 0.29, 0.29, 0.29, head, 'sphere');
            instance(obj, px, py + 1.52 + walk, pz, 0.36, 0.29, 0.36, C.steel, 'cone');
            instance(obj, px - 0.15, py + 0.18 + walk, pz, 0.13, 0.40, 0.14, [0.28, 0.26, 0.25], 'cylinder');
            instance(obj, px + 0.15, py + 0.18 - walk, pz, 0.13, 0.40, 0.14, [0.28, 0.26, 0.25], 'cylinder');
          }
          if (g.type === 'infantry') {
            instance(obj, px + 0.29, py + 0.85 + walk, pz, 0.16, 0.65, 0.38, shield);
            instance(obj, px - 0.31, py + 1.0 + walk, pz, 0.085, g.kind === 'pikemen' ? 2.2 : 1.5, 0.085, C.steel, 'cylinder');
          }
          if (g.type === 'archers') {
            instance(obj, px + 0.30, py + 0.85 + walk, pz, 0.12, 1.0, 0.1, C.trunk, 'cylinder');
          }
        }
      }

      if (g.routed) continue;
      // Regiment heraldic banner + directional facing pennant + front shield line
      const fx = g.facingX ?? 0;
      const fz = g.facingZ ?? (g.side === 'attacker' ? -1 : 1);
      const fl = Math.hypot(fx, fz) || 1;
      const nfx = fx / fl, nfz = fz / fl;
      const rgtX = nfz, rgtZ = -nfx;
      const banner = field ? palette.banner : g.side === 'attacker' ? [0.91, 0.77, 0.46] : [0.84, 0.49, 0.37];

      instance(obj, g.x, gy + 2.5, g.z, 0.16, 5, 0.16, C.steel, 'cylinder');
      instance(obj, g.x + 0.63, gy + 4.4, g.z, 1.35, 0.74, 0.16, banner);
      // Directional facing vanguard pennant & front-rank shields
      const pxF = g.x + nfx * 2.2, pzF = g.z + nfz * 2.2;
      const pyF = terrain ? terrainHeight(pxF, pzF, terrain) : 0;
      instance(obj, pxF, pyF + 0.9, pzF, 0.09, 1.8, 0.09, C.gold, 'cylinder');
      instance(obj, pxF + nfx * 0.35, pyF + 1.55, pzF + nfz * 0.35, 0.65, 0.32, 0.14, palette.accent);
      if (g.type === 'infantry') {
        for (const sOff of [-1.4, 0, 1.4]) {
          const sx = g.x + nfx * 1.5 + rgtX * sOff;
          const sz = g.z + nfz * 1.5 + rgtZ * sOff;
          const sy = terrain ? terrainHeight(sx, sz, terrain) : 0;
          instance(obj, sx, sy + 0.65, sz, 0.48, 0.72, 0.18, shield);
        }
      }

      if (field) {
        instance(obj, g.x + 0.63, gy + 4.4, g.z, 1.38, 0.15, 0.18, palette.accent);
        instance(obj, g.x, gy + 5.05, g.z, 0.29, 0.32, 0.29, C.gold, 'sphere');
      }

      if (field && k === this.selected && ['move', 'fallback', 'hold'].includes(g.fieldOrder)) {
        const mx = g.moveX ?? g.anchorX;
        const mz = g.moveZ ?? g.anchorZ;
        const my = terrain ? terrainHeight(mx, mz, terrain) : 0;
        instance(obj, mx, my + 0.09, mz, 2.2, 0.12, 2.2, [0.90, 0.76, 0.30]);
        for (let i = 1; i <= 5; i++) {
          const t = i / 6;
          const wx = mix(g.x, mx, t), wz = mix(g.z, mz, t);
          const wy = terrain ? terrainHeight(wx, wz, terrain) : 0;
          instance(obj, wx, wy + 0.06, wz, 0.28, 0.07, 0.28, [0.90, 0.76, 0.30]);
        }
      }

      if (k === this.selected || g === selGroup) {
        instance(obj, g.x, gy + 0.08, g.z, 5.2, 0.14, 5.2, [0.95, 0.79, 0.42]);
        instance(obj, g.x, gy + 0.11, g.z, 4.4, 0.15, 4.4, [0.28, 0.35, 0.32]);
      }
      if (selGroup?.focusTargetId && g.id === selGroup.focusTargetId) {
        instance(obj, g.x, gy + 0.10, g.z, 4.6, 0.14, 4.6, [0.88, 0.28, 0.24]);
      }
    }

    for (const p of this.projectiles) {
      if (this.descriptor.fieldBattle) {
        for (const q of projectileTrail(p, this.ctx instanceof CanvasFallback, terrain)) {
          instance(obj, q.x, q.y, q.z, q.size, q.size, q.size, q.head ? [0.98, 0.83, 0.52] : [0.64, 0.51, 0.29], 'sphere');
        }
      } else {
        const t = p.t;
        instance(obj, mix(p.sx, p.tx, t), 0.8 + Math.sin(t * Math.PI) * 3, mix(p.sz, p.tz, t), 0.1, 0.1, 0.6, C.arrow);
      }
    }

    if (this.descriptor.fieldBattle) {
      for (const effect of this.effects || []) {
        for (const p of battleImpactParticles(effect, terrain)) {
          const color = p.kind === 'dust' ? [0.59, 0.51, 0.36] : p.kind === 'rout' ? [0.80, 0.69, 0.47] : p.kind === 'rally' ? [0.96, 0.84, 0.42] : [1, 0.80, 0.39];
          instance(obj, p.x, p.y, p.z, p.size, p.size, p.size, color, 'sphere');
        }
      }
    }

    const vp = this.ctx.render(obj, this.getCamera(), this.groups, this.elapsed, { terrainType: this.terrainType, terrainGrid: this.terrainGrid });
    if (this.scenery && vp) this.scenery.render(vp, this.sceneryPlacements);
    this.renderOverlay();
  }

  renderOverlay(overlayCanvasArg = null) {
    const doc = globalThis.document;
    const oc = overlayCanvasArg || this.overlayCanvas || doc?.getElementById?.('battle-overlay') || null;
    if (!oc) return false;
    const ctx = oc.getContext?.('2d');
    if (!ctx) return false;

    const w = oc.clientWidth || this.canvas?.clientWidth || oc.width || 900;
    const h = oc.clientHeight || this.canvas?.clientHeight || oc.height || 600;
    const dpr = Math.min(globalThis.window?.devicePixelRatio || 1, 2);
    if (oc.width !== Math.round(w * dpr) || oc.height !== Math.round(h * dpr)) {
      oc.width = Math.round(w * dpr);
      oc.height = Math.round(h * dpr);
    }
    ctx.setTransform?.(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const terrain = this.descriptor?.fieldBattle ? this.terrainType : null;
    const sel = this.selectedGroup();

    // Selected regiment movement vector & focus target crosshair
    if (sel && !sel.routed && sel.life > 0) {
      const sy = terrain ? terrainHeight(sel.x, sel.z, terrain) : 0;
      const startPt = this.project([sel.x, sy + 0.35, sel.z]);
      const mx = sel.moveX ?? sel.anchorX;
      const mz = sel.moveZ ?? sel.anchorZ;
      if (startPt && Number.isFinite(mx) && Number.isFinite(mz) && Math.hypot(mx - sel.x, mz - sel.z) > 0.6) {
        const my = terrain ? terrainHeight(mx, mz, terrain) : 0;
        const endPt = this.project([mx, my + 0.35, mz]);
        if (endPt) {
          ctx.save?.();
          ctx.setLineDash?.([6, 4]);
          ctx.strokeStyle = 'rgba(243, 214, 155, 0.9)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startPt[0], startPt[1]);
          ctx.lineTo(endPt[0], endPt[1]);
          ctx.stroke();
          ctx.setLineDash?.([]);
          ctx.fillStyle = '#f3d69b';
          ctx.beginPath();
          ctx.arc(endPt[0], endPt[1], 4.5, 0, TAU);
          ctx.fill();
          ctx.restore?.();
        }
      }

      if (sel.focusTargetId) {
        const tgt = this.groups.find(g => g.id === sel.focusTargetId && !g.routed && g.life > 0);
        if (tgt) {
          const ty = terrain ? terrainHeight(tgt.x, tgt.z, terrain) : 0;
          const tgtPt = this.project([tgt.x, ty + 1.0, tgt.z]);
          if (startPt && tgtPt) {
            ctx.save?.();
            ctx.setLineDash?.([5, 3]);
            ctx.strokeStyle = 'rgba(232, 92, 76, 0.92)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startPt[0], startPt[1]);
            ctx.lineTo(tgtPt[0], tgtPt[1]);
            ctx.stroke();
            ctx.setLineDash?.([]);
            // Target crosshair
            ctx.beginPath();
            ctx.arc(tgtPt[0], tgtPt[1], 11, 0, TAU);
            ctx.stroke();
            for (const [dx, dy] of [[15, 0], [-15, 0], [0, 15], [0, -15]]) {
              ctx.beginPath();
              ctx.moveTo(tgtPt[0] + dx * 0.55, tgtPt[1] + dy * 0.55);
              ctx.lineTo(tgtPt[0] + dx, tgtPt[1] + dy);
              ctx.stroke();
            }
            ctx.restore?.();
          }
        }
      }
    }

    // Overhead HP, Morale, Badge, Troop Count, and Status Tags
    const tagColors = {
      CHARGE: '#e8a448',
      BRACED: '#7ab3d6',
      FLANKED: '#e36354',
      ROUT: '#c74c4c',
      COVER: '#6bb87b',
      HIGH_GROUND: '#d9c579',
      RALLIED: '#f2da83',
      SKIRMISH: '#89c4b8'
    };

    for (let i = 0; i < this.groups.length; i++) {
      const g = this.groups[i];
      const maxT = g.troopCount ?? g.maxTroops ?? g.troops ?? 0;
      if (maxT <= 0 || g.life <= 0 || (g.routed && (g.routAge || 0) >= 3)) continue;
      const gy = terrain ? terrainHeight(g.x, g.z, terrain) : 0;
      const pt = this.project([g.x, gy + 5.7, g.z]);
      if (!pt || pt[0] < -40 || pt[0] > w + 40 || pt[1] < -30 || pt[1] > h + 30) continue;

      const isSel = g === sel;
      const badge = unitBadgeLabel(g);
      const count = g.routed ? 0 : Math.max(0, Math.round(g.troops ?? maxT * clamp(g.life / Math.max(1, g.initialLife || 100), 0, 1)));
      const hpFrac = clamp((g.life || 0) / Math.max(1, g.initialLife || 100), 0, 1);
      const moraleFrac = clamp((g.morale || 0) / 100, 0, 1);
      const bw = 62;
      const bx = pt[0] - bw / 2;
      const by = pt[1] - 24;

      ctx.save?.();
      ctx.fillStyle = isSel ? 'rgba(30, 38, 32, 0.88)' : 'rgba(11, 22, 24, 0.78)';
      ctx.fillRect(bx - 3, by - 13, bw + 6, 30);
      ctx.strokeStyle = isSel ? '#f3d69b' : (g.side === 'attacker' ? 'rgba(112, 184, 214, 0.65)' : 'rgba(216, 108, 86, 0.65)');
      ctx.lineWidth = isSel ? 1.8 : 1;
      ctx.strokeRect(bx - 3, by - 13, bw + 6, 30);

      // Unit badge + troop count
      ctx.fillStyle = '#f2ead9';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${badge} ${count}`, pt[0], by - 2);

      // HP bar (green for allied, red for hostile)
      ctx.fillStyle = '#1b2626';
      ctx.fillRect(bx, by + 2, bw, 5);
      ctx.fillStyle = g.side === 'attacker' ? '#58c477' : '#d9574b';
      ctx.fillRect(bx, by + 2, bw * hpFrac, 5);

      // Morale bar (gold/amber)
      ctx.fillStyle = '#1b2626';
      ctx.fillRect(bx, by + 9, bw, 4);
      ctx.fillStyle = moraleFrac > 0.35 ? '#ecc365' : '#d98236';
      ctx.fillRect(bx, by + 9, bw * moraleFrac, 4);

      // Status tag pills
      const flags = (g.statusFlags && g.statusFlags.length ? g.statusFlags : (g.routed ? ['ROUT'] : [])).slice(0, 2);
      if (flags.length) {
        const label = flags.map(f => f === 'HIGH_GROUND' ? 'HIGH' : f).join(' · ');
        const primaryColor = tagColors[flags[0]] || '#d6c09a';
        ctx.fillStyle = 'rgba(10, 18, 20, 0.84)';
        ctx.fillRect(bx - 2, by + 18, bw + 4, 11);
        ctx.fillStyle = primaryColor;
        ctx.font = 'bold 8px monospace';
        ctx.fillText(label, pt[0], by + 26);
      }
      ctx.restore?.();
    }
    return true;
  }

  loop(now) {
    if (!this.running) return;
    const dt = clamp((now - this.last) / 1000, 0, 0.2);
    this.last = now;
    if (globalThis.document?.hidden || this.renderLost) {
      this.frameRemainder = 0;
      this.raf = globalThis.requestAnimationFrame?.(this.loop);
      return;
    }
    this.updateCamera(Math.min(dt, 0.05));
    const before = this.elapsed;
    if (this.descriptor.fieldBattle) {
      const next = fieldFrameSteps(this.frameRemainder, dt, !this.paused && !this.done);
      this.frameRemainder = next.remainder;
      for (let i = 0; i < next.steps && !this.done; i++) this.update(1 / 30);
    } else if (!this.paused && !this.done) {
      this.update(Math.min(dt, 0.045));
    }
    const interval = renderInterval(this.ctx instanceof CanvasFallback, this.mobile);
    if (this.lastRenderAt == null || now - this.lastRenderAt >= interval - 2) {
      this.render();
      this.lastRenderAt = now;
    }
    if (Math.floor(this.elapsed * 2) !== Math.floor(before * 2)) this.report();
    this.raf = globalThis.requestAnimationFrame?.(this.loop);
  }

  finish(victory, leftPower, rightPower = null) {
    if (this.done) return;
    this.done = true;
    this.paused = true;
    this.music?.sync(false);
    this.audio?.silence();
    this.audio?.play(victory ? 'victory' : 'defeat');
    const roster = {
      attacker: battleRoster(this.groups, 'attacker', !!this.descriptor?.fieldBattle),
      defender: battleRoster(this.groups, 'defender', !!this.descriptor?.fieldBattle)
    };
    const fraction = roster.attacker.fraction;
    const enemies = roster.defender.fraction;
    this.report();
    this.onFinish({
      victory,
      attackerRemaining: fraction,
      enemyRemaining: enemies,
      roster,
      fieldBattle: !!this.descriptor?.fieldBattle,
      fortBreached: !!this.siege && siegeBreached(this.siege),
      seconds: Math.round(this.elapsed)
    });
  }

  retreat() {
    this.finish(false, this.groups.filter(g => g.side === 'attacker' && !g.routed).reduce((s, g) => s + g.life, 0));
  }

  setSound(enabled) {
    this.audio?.setEnabled(enabled);
    this.music?.sync(!this.paused && !this.done && !this.deployment && !this.renderLost && !globalThis.document?.hidden, enabled);
  }

  togglePause() {
    if (this.deployment || this.done || this.renderLost) return;
    this.paused = !this.paused;
    this.frameRemainder = 0;
    if (this.paused) this.audio?.silence();
    else this.audio?.unlock();
    this.music?.sync(!this.paused && !globalThis.document?.hidden);
    this.report();
  }

  stop() {
    this.running = false;
    this.audio?.close();
    this.music?.close();
    browserCampaignAudio.unlink(this.audio);
    browserCampaignAudio.unlink(this.music);
    browserCampaignAudio.resumeMode();

    const win = globalThis.window;
    const doc = globalThis.document;
    doc?.removeEventListener?.('visibilitychange', this._onVisibility);
    globalThis.cancelAnimationFrame?.(this.raf);
    win?.removeEventListener?.('keydown', this._onKeyDown);
    win?.removeEventListener?.('keyup', this._onKeyUp);
    this.canvas?.removeEventListener?.('wheel', this._onWheel);
    this.canvas?.removeEventListener?.('contextmenu', this._onContext);
    this.canvas?.removeEventListener?.('pointerdown', this._onDown);
    win?.removeEventListener?.('pointermove', this._onMove);
    win?.removeEventListener?.('pointerup', this._onUp);
    this.canvas?.removeEventListener?.('pointercancel', this._onCancel);
    this.canvas?.removeEventListener?.('webglcontextlost', this._onContextLost);
    this._rallyEl?.removeEventListener?.('click', this._onRallyBtn);
    this._speedEl?.removeEventListener?.('click', this._onSpeedBtn);

    if (this.overlayCanvas) {
      const octx = this.overlayCanvas.getContext?.('2d');
      octx?.clearRect?.(0, 0, this.overlayCanvas.width || 0, this.overlayCanvas.height || 0);
    }

    this.scenery?.dispose();
    const gl = this.ctx?.gl;
    this.ctx?.dispose?.();
    try { gl?.getExtension?.('WEBGL_lose_context')?.loseContext(); } catch {}
    this.ctx = null;
    this.scenery = null;
  }
}
