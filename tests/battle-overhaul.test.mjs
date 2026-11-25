import test from 'node:test';
import assert from 'node:assert/strict';
import {
  terrainHeight,
  terrainForestCovers,
  fieldTerrain,
  initializeFieldGroup,
  issueFieldOrder,
  issueGroupMoveOrder,
  issueGroupTargetOrder,
  triggerRallyHorn,
  attackAspect,
  stepField
} from '../src/field-tactics.js';
import {packActiveRegiments} from '../src/field-forces.js';
import {terrainVisualProps, terrainGroundGrid} from '../src/field-scenery.js';
import {projectileTrail, unitBadgeLabel} from '../src/field-visuals.js';
import {BattleGame, CanvasFallback} from '../src/battle.js';
import {BattleMusic, CampaignAudio, FieldAudio, browserCampaignAudio} from '../src/field-audio.js';

function makeUnit(id, side, type, x, z, extra = {}) {
  return initializeFieldGroup({
    id,
    side,
    type,
    x,
    z,
    order: 0,
    troopCount: 40,
    morale: 85,
    damage: type === 'cavalry' ? 18 : type === 'archers' ? 10 : 12,
    armor: 1,
    speed: type === 'cavalry' ? 7.0 : type === 'archers' ? 3.8 : 4.5,
    range: type === 'archers' ? 15 : 2.5,
    cooldown: 0,
    phase: 0,
    ...extra
  });
}

function makeMockAudioContext() {
  let closed = 0;
  let resumed = 0;
  const stops = [];
  const param = () => ({
    value: 0,
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
    setTargetAtTime() {}
  });
  const makeNode = () => {
    const n = {
      gain: param(),
      frequency: param(),
      Q: param(),
      type: 'sine',
      connect() { return this; },
      disconnect() {},
      start() {},
      stop() { stops.push(n); n.onended?.(); },
      onended: null
    };
    return n;
  };
  const ctx = {
    state: 'running',
    currentTime: 1,
    sampleRate: 8000,
    destination: {},
    createGain: makeNode,
    createOscillator: makeNode,
    createBiquadFilter: makeNode,
    createBufferSource: makeNode,
    createStereoPanner: () => ({ pan: { value: 0 }, connect() {}, disconnect() {} }),
    createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; },
    resume() { resumed++; return Promise.resolve(); },
    close() { closed++; return Promise.resolve(); }
  };
  return { ctx, stats: () => ({ closed, resumed, stops: stops.length }) };
}

function makeMock2dCanvas(w = 900, h = 600) {
  const ops = [];
  const ctx2d = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left',
    setTransform(...args) { ops.push(['setTransform', ...args]); },
    clearRect(...args) { ops.push(['clearRect', ...args]); },
    fillRect(...args) { ops.push(['fillRect', ...args]); },
    strokeRect(...args) { ops.push(['strokeRect', ...args]); },
    fillText(...args) { ops.push(['fillText', ...args]); },
    beginPath() { ops.push(['beginPath']); },
    closePath() { ops.push(['closePath']); },
    moveTo(...args) { ops.push(['moveTo', ...args]); },
    lineTo(...args) { ops.push(['lineTo', ...args]); },
    arc(...args) { ops.push(['arc', ...args]); },
    fill() { ops.push(['fill']); },
    stroke() { ops.push(['stroke']); },
    setLineDash(d) { ops.push(['setLineDash', d]); },
    save() {},
    restore() {}
  };
  return {
    width: w,
    height: h,
    clientWidth: w,
    clientHeight: h,
    ops,
    getContext(kind) {
      if (kind === '2d') return ctx2d;
      return null;
    },
    getBoundingClientRect() { return { left: 0, top: 0, width: w, height: h }; },
    addEventListener() {},
    removeEventListener() {},
    setPointerCapture() {}
  };
}

test('terrain height contours, woodland cover zones, and high-ground ranged bonus are deterministic', () => {
  const plainsH = terrainHeight(18, -8, 'plains');
  const hillsH = terrainHeight(18, -8, 'hills');
  const mountainH = terrainHeight(22, -6, 'mountain');
  assert.equal(hillsH, terrainHeight(18, -8, 'hills'));
  assert.ok(hillsH > plainsH + 1.0, `Expected hills (${hillsH}) > plains (${plainsH})`);
  assert.ok(mountainH > hillsH, `Expected mountain (${mountainH}) > hills (${hillsH})`);

  for (const t of ['hills', 'mountain', 'forest', 'desert', 'coastal', 'plains']) {
    const covers = terrainForestCovers(t);
    assert.ok(Array.isArray(covers) && covers.length >= 1, `Missing covers for ${t}`);
    for (const c of covers) {
      assert.ok(Number.isFinite(c.x) && Number.isFinite(c.z) && c.radius > 0);
    }
    const props = terrainVisualProps(t);
    const grid = terrainGroundGrid(t);
    assert.ok(props.length > 0 && grid.length > 50);
  }

  // High ground grants +18% range & damage for archers firing downhill vs flat ground
  const highArch = makeUnit('ha', 'attacker', 'archers', 18, -8, { range: 15, damage: 10 });
  const highTarget = makeUnit('ht', 'defender', 'infantry', 18, 9, { troopCount: 60 });
  highArch.cooldown = 0;
  highTarget.cooldown = 99;
  issueFieldOrder(highArch, 'hold');
  issueFieldOrder(highTarget, 'hold');
  // Distance is 17 > base 15, but <= 15 * 1.18 = 17.7 because archer is on hills ridge!
  const hillState = { groups: [highArch, highTarget], projectiles: [], terrain: 'hills' };
  stepField(hillState, 0.1);
  assert.equal(highArch.attackSerial, 1, 'Archer on high ground should reach target at 17u via +18% range');
  assert.ok(highTarget.life < 100, 'Archer on high ground should deal damage at extended range');
  assert.ok(highArch.statusFlags.includes('HIGH_GROUND'));
});

test('cavalry charge momentum amplifies shock vs unbraced targets but braced pikes inflict recoil & halt charge', () => {
  // 1. Charge buildup vs unbraced archers
  const cavUnbraced = makeUnit('cu', 'attacker', 'cavalry', 0, 16, { speed: 8, troopCount: 40, damage: 18 });
  const arcTarget = makeUnit('at', 'defender', 'archers', 0, -10, { troopCount: 40 });
  arcTarget.cooldown = 99;
  issueFieldOrder(cavUnbraced, 'charge');
  issueFieldOrder(arcTarget, 'hold');
  const s1 = { groups: [cavUnbraced, arcTarget], projectiles: [] };
  for (let i = 0; i < 15; i++) stepField(s1, 0.1);
  assert.ok(cavUnbraced.chargeMomentum > 0.35, `Cavalry should build chargeMomentum (${cavUnbraced.chargeMomentum})`);
  assert.ok(cavUnbraced.statusFlags.includes('CHARGE'));

  // 2. Charging cavalry hitting braced pikemen in front gets stopped and takes bracedCounter recoil
  const cavVsPike = makeUnit('cp', 'attacker', 'cavalry', 0, 2.0, {
    speed: 8, troopCount: 40, damage: 18, chargeMomentum: 0.95
  });
  const bracedPike = makeUnit('pk', 'defender', 'infantry', 0, 0, {
    kind: 'pikemen', formationId: 'pike_square', troopCount: 40, damage: 12, cavalryCounter: 1.55
  });
  issueFieldOrder(cavVsPike, 'charge');
  issueFieldOrder(bracedPike, 'hold');

  const cavVsShield = makeUnit('cs', 'attacker', 'cavalry', 0, 2.0, {
    speed: 8, troopCount: 40, damage: 18, chargeMomentum: 0.95
  });
  const shieldInf = makeUnit('sw', 'defender', 'infantry', 0, 0, {
    kind: 'spearmen', formationId: 'shield_wall', troopCount: 40, damage: 12
  });
  issueFieldOrder(cavVsShield, 'charge');
  issueFieldOrder(shieldInf, 'hold');

  const cavVsOpen = makeUnit('co', 'attacker', 'cavalry', 0, 2.0, {
    speed: 8, troopCount: 40, damage: 18, chargeMomentum: 0.95
  });
  const openArc = makeUnit('oa', 'defender', 'archers', 0, 0, { troopCount: 40, damage: 8 });
  openArc.cooldown = 99;
  issueFieldOrder(cavVsOpen, 'charge');
  issueFieldOrder(openArc, 'advance');

  stepField({ groups: [cavVsPike, bracedPike], projectiles: [] }, 0.1);
  stepField({ groups: [cavVsShield, shieldInf], projectiles: [] }, 0.1);
  stepField({ groups: [cavVsOpen, openArc], projectiles: [] }, 0.1);

  assert.equal(cavVsPike.chargeMomentum, 0, 'Braced pikes must stop cavalry chargeMomentum');
  assert.ok(cavVsPike.bracedCounter > 0, 'Braced pikes must inflict bracedCounter recoil');
  assert.ok(bracedPike.statusFlags.includes('BRACED'));
  assert.equal(cavVsShield.chargeMomentum, 0, 'Shield wall spearmen in hold must stop cavalry chargeMomentum');
  assert.ok(cavVsShield.bracedCounter > 0, 'Shield wall spearmen must inflict bracedCounter recoil');
  assert.ok(cavVsPike.life < cavVsOpen.life, 'Cavalry attacking braced pikes should take heavier losses than unbraced targets');
  assert.ok(openArc.morale < bracedPike.morale, 'Unbraced target should suffer heavier shock morale loss than braced pikes');
});

test('archers auto-kite melee threats within < 14 units unless holding, and woodland cover reduces ranged damage by ~35%', () => {
  const arcKite = makeUnit('ak', 'attacker', 'archers', 0, 0, { range: 15 });
  const meleeClose = makeUnit('mc', 'defender', 'infantry', 0, 12); // < 14 units
  issueFieldOrder(meleeClose, 'hold');
  stepField({ groups: [arcKite, meleeClose], projectiles: [] }, 0.25);
  assert.ok(arcKite.z < 0, `Archer should kite away from melee threat at 12u (z=${arcKite.z})`);
  assert.ok(arcKite.statusFlags.includes('SKIRMISH'));

  // Holding archer stands ground even when melee is < 14u
  const arcHold = makeUnit('ah', 'attacker', 'archers', 0, 0, { range: 15 });
  const meleeClose2 = makeUnit('mc2', 'defender', 'infantry', 0, 12);
  issueFieldOrder(arcHold, 'hold');
  issueFieldOrder(meleeClose2, 'hold');
  stepField({ groups: [arcHold, meleeClose2], projectiles: [] }, 0.25);
  assert.equal(arcHold.z, 0, 'Holding archer must not kite');

  // Woodland cover reduces incoming ranged hit damage by ~35%
  const forestCovers = terrainForestCovers('forest');
  const grove = forestCovers[0];
  const shooterCover = makeUnit('sc', 'attacker', 'archers', grove.x, grove.z - 10, { damage: 15, troopCount: 60 });
  const targetInCover = makeUnit('tc', 'defender', 'infantry', grove.x, grove.z, { troopCount: 60 });
  targetInCover.cooldown = 99;
  issueFieldOrder(shooterCover, 'hold');
  issueFieldOrder(targetInCover, 'hold');

  const shooterOpen = makeUnit('so', 'attacker', 'archers', 0, 20, { damage: 15, troopCount: 60 });
  const targetOpen = makeUnit('to', 'defender', 'infantry', 0, 30, { troopCount: 60 });
  targetOpen.cooldown = 99;
  issueFieldOrder(shooterOpen, 'hold');
  issueFieldOrder(targetOpen, 'hold');

  stepField({ groups: [shooterCover, targetInCover], projectiles: [], terrain: 'forest', fieldSeed: 77 }, 0.1);
  stepField({ groups: [shooterOpen, targetOpen], projectiles: [], terrain: 'plains', fieldSeed: 77 }, 0.1);

  assert.ok(fieldTerrain(targetInCover, 'forest').inForestCover);
  assert.ok(targetInCover.statusFlags.includes('COVER'));
  const coverLoss = 100 - targetInCover.life;
  const openLoss = 100 - targetOpen.life;
  assert.ok(coverLoss < openLoss * 0.72 && coverLoss > openLoss * 0.58,
    `Expected ~35% ranged reduction in forest cover (coverLoss=${coverLoss.toFixed(3)}, openLoss=${openLoss.toFixed(3)})`);

  // Projectile arc coordinates reflect terrain elevation
  const trail = projectileTrail({ sx: 0, sz: 0, tx: 12, tz: 0, t: 0.5, kind: 'arrow' }, false, 'hills');
  assert.ok(trail.length === 4 && trail[0].y > 2.0);
});

test('flanking adds FLANKED status & extra morale loss, and low morale routs toward deployment edge', () => {
  function runAspect(x, z) {
    const atk = makeUnit('a', 'attacker', 'infantry', x, z, { troopCount: 50, damage: 12 });
    const def = makeUnit('d', 'defender', 'infantry', 0, 0, { troopCount: 50, morale: 80 });
    def.cooldown = 99;
    issueFieldOrder(atk, 'hold');
    issueFieldOrder(def, 'hold');
    const aspect = attackAspect(atk, def);
    stepField({ groups: [atk, def], projectiles: [], fieldSeed: 55 }, 0.1);
    return { aspect, def };
  }

  const front = runAspect(0, 1.5);
  const flank = runAspect(1.5, 0);
  const rear = runAspect(0, -1.5);
  assert.equal(front.aspect, 'front');
  assert.equal(flank.aspect, 'flank');
  assert.equal(rear.aspect, 'rear');
  assert.ok(flank.def.flanked && flank.def.statusFlags.includes('FLANKED'));
  assert.ok(rear.def.flanked && rear.def.statusFlags.includes('FLANKED'));
  assert.ok(rear.def.morale < flank.def.morale && flank.def.morale < front.def.morale);

  // Morale <= 14 triggers routing toward deployment edge
  const router = makeUnit('r', 'attacker', 'infantry', 0, 15, { morale: 14 });
  const enemy = makeUnit('e', 'defender', 'infantry', 0, -25);
  issueFieldOrder(enemy, 'hold');
  const rState = { groups: [router, enemy], projectiles: [] };
  stepField(rState, 0.2);
  assert.equal(router.routed, true);
  assert.equal(router.status, 'routing');
  assert.ok(router.statusFlags.includes('ROUT'));
  const zAtRout = router.z;
  stepField(rState, 0.5);
  assert.ok(router.z > zAtRout, `Routed attacker should flee toward deployment edge (+z), got ${router.z} <= ${zAtRout}`);
});

test('direct group move/target orders and triggerRallyHorn cooldown & recovery', () => {
  const ally1 = makeUnit('p0', 'attacker', 'infantry', 0, 20, { morale: 32 });
  const ally2 = makeUnit('p1', 'attacker', 'archers', -10, 20, { morale: 12, routed: true, routAge: 0.5, life: 60 });
  const destroyed = makeUnit('p2', 'attacker', 'cavalry', 10, 20, { morale: 0, life: 0, routed: true });
  const enemy = makeUnit('e0', 'defender', 'infantry', 5, -10);
  ally1.focusTargetId = 'e0';
  ally1.focusTarget = 'e0';

  // issueGroupMoveOrder sets moveX/moveZ & clears stale target unless attackMove
  assert.ok(issueGroupMoveOrder(ally1, 18, 4));
  assert.equal(ally1.moveX, 18);
  assert.equal(ally1.moveZ, 4);
  assert.equal(ally1.order, 'move');
  assert.equal(ally1.focusTargetId, null);

  assert.ok(issueGroupTargetOrder(ally1, enemy));
  assert.equal(ally1.focusTargetId, 'e0');

  // Attack-move preserves existing target
  assert.ok(issueGroupMoveOrder(ally1, 12, -2, { attackMove: true }));
  assert.equal(ally1.focusTargetId, 'e0');

  const state = { groups: [ally1, ally2, destroyed, enemy], projectiles: [], effects: [], elapsed: 10 };
  const first = triggerRallyHorn(state, 'attacker', { cooldown: 20 });
  assert.equal(first.ok, true);
  assert.equal(first.rallied, 2);
  assert.equal(first.cooldown, 20);
  assert.equal(ally1.morale, 54);
  assert.ok(ally1.rallyBuffTimer > 0);
  assert.equal(ally2.routed, false, 'Recoverable routing regiment should rally when morale rises above 14');
  assert.equal(destroyed.routed, true, 'Destroyed regiment with 0 life must not revive');

  // Cooldown blocks immediate second horn
  state.elapsed = 18;
  const blocked = triggerRallyHorn(state, 'attacker', { cooldown: 20 });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.rallied, 0);
  assert.ok(blocked.cooldown > 0);

  // Ready again after cooldown expires
  state.elapsed = 31;
  const second = triggerRallyHorn(state, 'attacker', { cooldown: 20 });
  assert.equal(second.ok, true);
});

test('BattleGame packs zero-troop regiments cleanly, handles click-select/target/move, 1x/2x speed, rallyHorn, and renderOverlay', () => {
  // Verify packActiveRegiments omits 0-troop slots
  const packed = packActiveRegiments({ infantry: 3, archers: 0, cavalry: 0 }, ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry']);
  assert.equal(packed.length, 3);
  assert.equal(packed.reduce((s, p) => s + p.troops, 0), 3);

  const canvas = makeMock2dCanvas(900, 600);
  const overlay = makeMock2dCanvas(900, 600);
  const mockGame = {
    player: 'england',
    factions: {
      england: { id: 'england', name: 'England', color: '#4b98b3', doctrineProfile: 'longbow' },
      france: { id: 'france', name: 'France', color: '#b86855', doctrineProfile: 'chivalry' }
    },
    provinces: {
      normandy: { id: 'normandy', terrain: 'hills', buildings: { fort: 0 } }
    },
    world: {
      provinces: [{ id: 'normandy', terrain: 'hills' }]
    },
    armies: {
      a1: { id: 'a1', owner: 'england', province: 'calais', infantry: 3, archers: 0, cavalry: 0, morale: 85 },
      e1: { id: 'e1', owner: 'france', province: 'normandy', infantry: 40, archers: 20, cavalry: 0, morale: 82 }
    }
  };

  let lastStatus = null;
  let selectedCbGroup = null;
  const battle = new BattleGame(
    canvas,
    {
      attacker: 'a1',
      playerArmies: ['a1'],
      enemyArmy: 'e1',
      enemyArmies: ['e1'],
      enemy: 'france',
      to: 'normandy',
      from: 'calais',
      fieldBattle: true,
      interactive: true,
      soundEnabled: false
    },
    mockGame,
    () => {},
    s => { lastStatus = s; },
    {
      overlayCanvas: overlay,
      onSelect: g => { selectedCbGroup = g; }
    }
  );

  assert.equal(battle.rendererMode, 'software');
  assert.ok(battle.ctx instanceof CanvasFallback);

  const attackers = battle.groups.filter(g => g.side === 'attacker');
  const defenders = battle.groups.filter(g => g.side === 'defender');
  // England had only 3 infantry (0 archers/cavalry) -> 3 packed non-zero regiments, zero phantom rows!
  assert.equal(attackers.length, 3);
  assert.ok(attackers.every(g => g.troops > 0 && !g.routed));
  assert.ok(defenders.length > 0 && defenders.every(g => g.troops > 0));
  assert.ok(lastStatus?.selectedGroupId === attackers[0].id);

  // Start assault
  assert.ok(battle.startAssault());
  assert.equal(battle.paused, false);

  // Tap allied regiment #2 on projected screen coords -> selects it and fires onSelect
  const p2 = attackers[1];
  const screenP2 = battle.project([p2.x, terrainHeight(p2.x, p2.z, 'hills') + 1.4, p2.z]);
  assert.ok(screenP2);
  const tapAlly = battle.handleCanvasTap(screenP2[0], screenP2[1]);
  assert.equal(tapAlly?.action, 'select');
  assert.equal(selectedCbGroup?.id, p2.id);
  assert.equal(lastStatus?.selectedGroupId, p2.id);

  // Tap enemy regiment -> sets focusTargetId
  const enemy0 = defenders[0];
  const screenE0 = battle.project([enemy0.x, terrainHeight(enemy0.x, enemy0.z, 'hills') + 1.4, enemy0.z]);
  assert.ok(screenE0);
  const tapEnemy = battle.handleCanvasTap(screenE0[0], screenE0[1]);
  assert.equal(tapEnemy?.action, 'target');
  assert.equal(p2.focusTargetId, enemy0.id);

  // Tap empty ground -> issues direct move order & clears stale focusTargetId
  const emptyGround = battle.project([15, terrainHeight(15, 8, 'hills'), 8]);
  assert.ok(emptyGround);
  const tapGround = battle.handleCanvasTap(emptyGround[0], emptyGround[1]);
  assert.equal(tapGround?.action, 'move');
  assert.equal(p2.order, 'move');
  assert.equal(p2.focusTargetId, null);
  assert.ok(Math.abs(p2.moveX - 15) < 4 && Math.abs(p2.moveZ - 8) < 4);

  // 1x vs 2x simulation speed
  const before1 = battle.elapsed;
  battle.setBattleSpeed(1);
  battle.update(0.1);
  const after1 = battle.elapsed;
  assert.ok(Math.abs((after1 - before1) - 0.1) < 1e-6);

  battle.setBattleSpeed(2);
  battle.update(0.1);
  const after2 = battle.elapsed;
  assert.ok(Math.abs((after2 - after1) - 0.2) < 1e-6);
  assert.equal(lastStatus?.battleSpeed, 2);

  // Rally horn on BattleGame
  p2.morale = 40;
  const rallyRes = battle.rallyHorn('attacker');
  assert.equal(rallyRes.ok, true);
  assert.ok(p2.morale > 40);
  assert.equal(battle.rallyHorn('attacker').ok, false);

  // Render 3D CanvasFallback + 2D Tactical Overlay safely
  battle.render();
  assert.ok(canvas.ops.length > 10);
  assert.ok(overlay.ops.some(op => op[0] === 'fillText' && String(op[1]).startsWith(unitBadgeLabel(p2))));

  battle.stop();
});

test('CampaignAudio headless safety, mute coordination, modes, SFX, and BattleMusic Web Audio fallback', async () => {
  // 1. Safe no-op in headless Node without AudioContext
  const headless = new CampaignAudio(() => null);
  assert.equal(headless.unlock(), false);
  assert.equal(headless.setMode('peace'), true);
  assert.equal(headless.isMuted(), false);
  assert.equal(headless.toggleMute(), true);
  assert.equal(headless.isMuted(), true);
  assert.equal(headless.playSfx('coin'), false);
  headless.close();
  assert.equal(browserCampaignAudio.playSfx('click'), false);

  // 2. Full mock AudioContext coordination
  const mock = makeMockAudioContext();
  const fieldMock = makeMockAudioContext();
  const fallbackMock = makeMockAudioContext();

  const fieldAudio = new FieldAudio(() => fieldMock.ctx, true);
  const battleMusic = new BattleMusic(() => null, true, () => fallbackMock.ctx);
  const campaignAudio = new CampaignAudio(() => mock.ctx, { mode: 'menu' });
  campaignAudio.link(fieldAudio, battleMusic);

  assert.equal(campaignAudio.unlock(), true);
  assert.equal(fieldAudio.unlock(), true);
  assert.ok(campaignAudio.timer !== null, 'Campaign BGM scheduler should start on unlock');

  for (const kind of ['click', 'coin', 'seal', 'horn', 'chime', 'alert', 'march', 'succession', 'rally']) {
    assert.equal(campaignAudio.playSfx(kind), true, `Expected SFX '${kind}' to play`);
  }
  assert.equal(campaignAudio.playSfx('unknown_kind'), false);

  // Switching to silent stops campaign BGM cleanly; resumeMode restores prior mode
  assert.equal(campaignAudio.setMode('war'), true);
  assert.equal(campaignAudio.setMode('silent'), true);
  assert.equal(campaignAudio.timer, null);
  assert.equal(campaignAudio.resumeMode(), true);
  assert.equal(campaignAudio.mode, 'war');
  assert.ok(campaignAudio.timer !== null);

  // BattleMusic Web Audio drums/brass fallback when HTMLAudio is unavailable
  assert.equal(battleMusic.sync(false), false);
  assert.equal(battleMusic.usingFallback, false);
  assert.equal(battleMusic.sync(true), true);
  assert.equal(battleMusic.usingFallback, true);

  // Mute coordination turns off CampaignAudio, FieldAudio, and BattleMusic together
  assert.equal(campaignAudio.setMuted(true), true);
  assert.equal(campaignAudio.isMuted(), true);
  assert.equal(fieldAudio.enabled, false);
  assert.equal(battleMusic.enabled, false);
  assert.equal(battleMusic.usingFallback, false);
  assert.equal(campaignAudio.playSfx('click'), false);

  assert.equal(campaignAudio.toggleMute(), false);
  assert.equal(fieldAudio.enabled, true);
  assert.equal(battleMusic.enabled, true);

  campaignAudio.close();
  battleMusic.close();
  fieldAudio.close();
  assert.equal(mock.stats().closed, 1);
  assert.equal(fallbackMock.stats().closed, 1);
});
