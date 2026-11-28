import {styleFieldSquad, cavalryGait} from './field-visuals.js';
import {terrainHeight} from './field-tactics.js';
import {mixerLodInterval} from './render-performance.js';

// Shared formation geometry and renderer-independent skinned character update.
const cap = (x, a, b) => Math.max(a, Math.min(b, x));

export function formationOffsets(count, id, type = 'infantry') {
  const n = Math.max(0, Math.floor(count));
  const spacing = type === 'cavalry' ? 1.65 : type === 'archers' ? 1.12 : 0.94;
  const points = [];
  const cols = id === 'pike_square' || id === 'square'
    ? Math.ceil(Math.sqrt(n))
    : id === 'shield_wall'
      ? Math.min(7, n)
      : id === 'longbow_line' || id === 'volley_line' || id === 'line'
        ? Math.min(9, n)
        : id === 'column'
          ? Math.min(3, n)
          : id === 'skirmish' || id === 'loose'
            ? Math.min(5, n)
            : Math.min(6, n);
  for (let i = 0; i < n; i++) {
    let x = 0;
    let z = 0;
    if (id === 'cavalry_wedge' || id === 'elephant_push') {
      const row = Math.floor(Math.sqrt(i));
      const start = row * row;
      x = (i - start - row) * spacing;
      z = -row * spacing * 1.15;
    } else if (id === 'encirclement' || id === 'ambush') {
      const a = (i / Math.max(1, n - 1) - 0.5) * Math.PI * 1.15;
      x = Math.sin(a) * spacing * Math.max(2, n / 5);
      z = Math.cos(a) * spacing * 2.1;
    } else if (id === 'flank') {
      const side = i % 2 ? 1 : -1;
      const row = Math.floor(i / 2);
      x = side * spacing * (2 + row % 2);
      z = -Math.floor(row / 2) * spacing;
    } else {
      const row = Math.floor(i / Math.max(1, cols));
      const col = i % Math.max(1, cols);
      const width = Math.min(cols, n - row * cols);
      x = (col - (width - 1) / 2) * spacing * (id === 'skirmish' || id === 'loose' ? 1.5 : 1);
      z = -row * spacing * (id === 'shield_wall' ? 0.76 : id === 'skirmish' || id === 'loose' ? 1.45 : id === 'column' ? 1.25 : 1);
    }
    points.push([x, z]);
  }
  if (!n) return points;
  const center = points.reduce((a, p) => [a[0] + p[0] / n, a[1] + p[1] / n], [0, 0]);
  return points.map(p => [p[0] - center[0], p[1] - center[1]]);
}

export function fieldFacing(g) {
  const x = g.facingX ?? 0;
  const z = g.facingZ ?? (g.side === 'attacker' ? -1 : 1);
  return Math.atan2(x, z);
}

export function soldierWorldPose(g, offset, terrain = null) {
  const angle = fieldFacing(g);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const rout = g.routed ? Math.min(5, g.routAge || 0) * 2.4 : 0;
  const wx = g.x + offset[0] * c + offset[1] * s - (g.homeDirection ? 0 : Math.sin(angle) * rout);
  const wz = g.z - offset[0] * s + offset[1] * c + (g.homeDirection ? g.homeDirection * rout : -Math.cos(angle) * rout);
  const wy = terrain ? terrainHeight(wx, wz, terrain) : 0;
  return {
    x: wx,
    y: wy,
    z: wz,
    yaw: g.routed ? (g.homeDirection ? (g.homeDirection > 0 ? 0 : Math.PI) : angle + Math.PI) : angle
  };
}

export function visualMode(g) {
  return g.routed ? 'walk' : (g.attackPulse || 0) > 0 ? 'attack' : g.moving ? 'walk' : 'idle';
}

/** Full 0 A.D. clip state resolution: idle, walk, run, attack, rally (promotion), death. */
export function animationClipState(g) {
  if (!g) return 'idle';
  if ((g.life ?? 100) <= 0 && !g.routed) return 'death';
  if ((g.rallyBuffTimer || 0) > 6.5 && !g.moving && (g.attackPulse || 0) <= 0) return 'rally';
  if ((g.attackPulse || 0) > 0) return 'attack';
  if (g.routed || g.fieldOrder === 'charge' || g.status === 'charging' || (g.chargeMomentum || 0) >= 0.45) return 'run';
  if (g.moving) return 'walk';
  return 'idle';
}

export function visibleSoldierCount(g, count) {
  if (g.routed && (g.routAge || 0) >= 3) return 0;
  if (g.life <= 0 || g.troopCount === 0) return 0;
  const available = Number.isFinite(g.troopCount) ? Math.min(count, Math.max(0, Math.ceil(g.troopCount))) : count;
  return Math.min(available, Math.max(1, Math.ceil(available * cap(g.life / Math.max(1, g.initialLife || 100), 0, 1))));
}

function turnToward(a, b, t) {
  return a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
}

export function updateFieldCharacters(scene, groups, dt) {
  if (!scene.modelsReady) return;
  const terrain = scene.terrainType || groups?.[0]?.terrainType || null;
  const camPos = scene.camera?.position || null;
  for (const g of groups || []) {
    if (g.troopCount === 0 || (g.routed && (g.routAge || 0) >= 3)) {
      for (const u of scene.groups.get(g.id) || []) u.root.visible = false;
      continue;
    }
    scene.prepareSquad(g);
    styleFieldSquad(scene, g);
    const units = scene.groups.get(g.id);
    if (!units) continue;
    const n = visibleSoldierCount(g, units.length);
    const key = n + ':' + g.formationId + ':' + g.type;
    if (g.visualLayout?.key !== key) g.visualLayout = { key, offsets: formationOffsets(n, g.formationId, g.type) };
    const offsets = g.visualLayout.offsets;
    const mode = visualMode(g);
    const clipState = animationClipState(g);
    const blend = 1 - Math.exp(-Math.max(0, dt) * 14);
    const squadDist = camPos ? Math.hypot((g.x || 0) - camPos.x, (g.z || 0) - camPos.z) : 0;
    const lodStep = mixerLodInterval(squadDist, scene.graphicsQuality || 'medium', !!scene.isSoftwareGl);
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (i >= n) {
        if (u.wasAlive && !g.routed && u.actions?.death && (u.dyingTimer || 0) < 1.15) {
          u.root.visible = true;
          if (!u.dyingStarted) {
            u.dyingStarted = true;
            u.dyingTimer = 0;
            u.actions.death.reset().fadeIn(0.08).play();
            if (u.current && u.current !== u.actions.death) u.current.fadeOut(0.08);
            u.current = u.actions.death;
            u.clipState = 'death';
          }
          u.dyingTimer = (u.dyingTimer || 0) + Math.max(0, dt);
          if (dt > 0) u.mixer.update(dt);
          continue;
        }
        u.root.visible = false;
        continue;
      }
      u.wasAlive = true;
      u.dyingStarted = false;
      u.dyingTimer = 0;
      u.root.visible = true;
      const p = soldierWorldPose(g, offsets[i], terrain);
      if (!u.fieldReady || u.fieldRevision !== g.deploymentRevision) {
        u.root.position.set(p.x, p.y, p.z);
        u.root.rotation.y = p.yaw;
        u.fieldReady = true;
        u.fieldRevision = g.deploymentRevision;
      } else {
        u.root.position.set(
          u.root.position.x + (p.x - u.root.position.x) * blend,
          p.y,
          u.root.position.z + (p.z - u.root.position.z) * blend
        );
        u.root.rotation.y = turnToward(u.root.rotation.y, p.yaw, blend);
      }
      const isRunning = clipState === 'run';
      if (u.mount) {
        const gait = cavalryGait(u.mixer.time, u.phase || 0, isRunning || g.fieldOrder === 'charge');
        for (let j = 0; j < u.mount.legs.length; j++) {
          u.mount.legs[j].rotation.x = (mode === 'walk' || isRunning) ? gait.legs[j % 4] : 0;
        }
        u.root.position.y = p.y + ((mode === 'walk' || isRunning) ? gait.bob : 0);
      }
      if (clipState !== u.clipState || mode !== u.mode || (mode === 'attack' && u.attackSerial !== g.attackSerial)) {
        const action = u.actions[clipState]
          || (clipState === 'run' ? u.actions.walk : null)
          || (clipState === 'rally' ? u.actions.idle : null)
          || u.actions[mode]
          || (u.regionalModel && mode === 'attack' ? u.actions.idle : null)
          || u.actions.walk
          || u.actions.idle;
        if (action && (action !== u.current || mode === 'attack')) {
          action.reset().fadeIn(0.10).play();
          if (u.current !== action) u.current?.fadeOut(0.12);
          u.current = action;
          if (mode === 'attack' && action.getClip) {
            action.time = Math.min(0.08, (u.phase || 0) * 0.02);
          }
        }
        u.mode = mode;
        u.clipState = clipState;
        u.attackSerial = g.attackSerial;
      }
      if (u.current && isRunning) u.current.timeScale = u.actions.run ? 1.15 : 1.38;
      else if (u.current && mode === 'walk') u.current.timeScale = g.fieldOrder === 'charge' ? 1.25 : 1;
      else if (u.current && mode === 'attack' && u.current.getClip) {
        const duration = u.current.getClip().duration;
        u.current.timeScale = Math.max(0.7, Math.min(3, duration / (g.type === 'archers' ? 0.45 : 0.30)));
      } else if (u.current) u.current.timeScale = 1;
      if (dt > 0) {
        if (lodStep <= 0) {
          u.mixer.update(dt);
        } else {
          u.lodAccum = (u.lodAccum || 0) + dt;
          if (u.lodAccum >= lodStep) {
            u.mixer.update(u.lodAccum);
            u.lodAccum = 0;
          }
        }
      }
      if (u.rig && u.restZ !== undefined && u.restYaw !== undefined) {
        const lunge = (u.regionalModel && !u.actions.attack && mode === 'attack') ? Math.sin(Math.PI * cap((g.attackPulse || 0) / 0.30, 0, 1)) : 0;
        const flinch = (g.hitFlash || 0) > 0 ? Math.sin((g.hitFlash / 0.18) * Math.PI) * 0.14 : 0;
        u.rig.position.z = u.restZ + 0.25 * lunge - flinch;
        u.rig.rotation.y = u.restYaw + 0.18 * lunge;
      }
    }
  }
}

// Camera presets preserve the same projection and ground picking used by the renderer.
export const CAMERA_PRESETS = { overview: { distance: 66, yaw: 0.28 }, tactical: { distance: 46, yaw: 0.25 }, regiment: { distance: 26, yaw: 0.22 } };

export function cameraDestination(mode, groups, selected) {
  const preset = CAMERA_PRESETS[mode];
  if (!preset) return null;
  const live = groups.filter(g => !g.routed);
  if (mode === 'regiment') {
    const g = groups[selected];
    if (!g || g.routed) return null;
    return { ...preset, target: [g.x, 0, g.z] };
  }
  if (mode === 'overview' || !live.length) return { ...preset, target: [0, 0, 0] };
  return { ...preset, target: [live.reduce((n, g) => n + g.x, 0) / live.length, 0, live.reduce((n, g) => n + g.z, 0) / live.length] };
}

export function blendCamera(camera, destination, dt) {
  const t = 1 - Math.exp(-Math.max(0, dt) * 6);
  camera.distance += (destination.distance - camera.distance) * t;
  camera.yaw = turnToward(camera.yaw, destination.yaw, t);
  for (let i = 0; i < 3; i++) camera.target[i] += (destination.target[i] - camera.target[i]) * t;
  return Math.abs(camera.distance - destination.distance) + Math.hypot(camera.target[0] - destination.target[0], camera.target[2] - destination.target[2]) < 0.15;
}

export function battleRoster(groups, side, field = true) {
  const byType = { infantry: { initial: 0, surviving: 0, routed: 0 }, archers: { initial: 0, surviving: 0, routed: 0 }, cavalry: { initial: 0, surviving: 0, routed: 0 } };
  let total = 0;
  let surviving = 0;
  let routed = 0;
  for (const g of groups.filter(g => g.side === side)) {
    const initial = Math.max(0, g.troopCount || 0);
    const remaining = initial * cap((g.life || 0) / Math.max(1, g.initialLife || 100), 0, 1) * (g.routed ? (field ? 0.65 : 0) : 1);
    total += initial;
    surviving += remaining;
    if (g.routed) routed += remaining;
    const t = byType[g.type];
    if (t) {
      t.initial += initial;
      t.surviving += remaining;
      if (g.routed) t.routed += remaining;
    }
  }
  return { initial: Math.round(total), surviving: Math.round(surviving), losses: Math.round(total) - Math.round(surviving), routed: Math.round(routed), fraction: cap(surviving / Math.max(1, total), 0, 1), byType };
}

export function battleImpactParticles(effect, terrain = null) {
  const t = cap(effect.age / effect.duration, 0, 1);
  const out = [];
  if (t >= 1) return out;
  const dust = effect.kind === 'dust';
  const breach = effect.kind === 'breach';
  const count = breach ? 12 : dust ? 5 : effect.kind === 'rout' ? 8 : 4;
  const baseY = terrain ? terrainHeight(effect.x, effect.z, terrain) : 0;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (effect.seed || 0) * 0.37;
    const spread = (breach ? 5.2 : dust ? 2.6 : 1.5) * t + 0.15;
    out.push({
      x: effect.x + Math.cos(angle) * spread,
      z: effect.z + Math.sin(angle) * spread,
      y: baseY + (breach ? 0.8 : dust ? 0.15 : 0.55) + Math.sin(t * Math.PI) * (breach ? 3.2 : dust ? 0.7 : 1.2),
      size: (breach ? 0.62 : dust ? 0.48 : 0.21) * (1 - t) + 0.06,
      kind: breach ? 'breach' : dust ? 'dust' : effect.kind
    });
  }
  return out;
}
