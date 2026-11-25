import test from 'node:test';
import assert from 'node:assert/strict';
import {
  terrainHeight,
  terrainForestCovers,
  fieldTerrain,
  fieldStrength,
  coordinateFieldAI,
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

test('6,000 soldiers vs 300 soldiers yields overwhelming victory in both stepField and BattleGame', () => {
  // 1. stepField simulation
  const groups = [];
  for (let i = 0; i < 6; i++) {
    const type = ['infantry', 'infantry', 'infantry', 'archers', 'archers', 'cavalry'][i];
    groups.push(makeUnit('a' + i, 'attacker', type, (i - 2.5) * 7, 24, { order: i, troopCount: 1000 }));
    groups.push(makeUnit('d' + i, 'defender', type, (i - 2.5) * 7, -24, { order: i, troopCount: 50 }));
  }
  const simState = { groups, projectiles: [], fieldSeed: 1450 };
  for (let i = 0; i < 4000 && !simState.combatEnded; i++) {
    if (i % 120 === 0) coordinateFieldAI(simState);
    stepField(simState, 1 / 30);
  }
  assert.equal(simState.combatEnded, true);
  assert.ok(fieldStrength(groups, 'attacker') > 4500);
  assert.equal(fieldStrength(groups, 'defender'), 0);

  // 2. Full BattleGame simulation
  const canvas = makeMock2dCanvas(900, 600);
  const overlay = makeMock2dCanvas(900, 600);
  const mockGame = {
    player: 'england',
    factions: {
      england: { id: 'england', name: 'England', color: '#4b98b3', doctrineProfile: 'longbow' },
      france: { id: 'france', name: 'France', color: '#b86855', doctrineProfile: 'chivalry' }
    },
    provinces: { normandy: { id: 'normandy', terrain: 'plains', buildings: { fort: 0 } } },
    world: { provinces: [{ id: 'normandy', terrain: 'plains' }] },
    armies: {
      big: { id: 'big', owner: 'england', province: 'calais', infantry: 3600, archers: 1600, cavalry: 800, morale: 90 },
      small: { id: 'small', owner: 'france', province: 'normandy', infantry: 180, archers: 80, cavalry: 40, morale: 80 }
    }
  };

  let finishCalls = 0;
  let finishResult = null;
  const battle = new BattleGame(
    canvas,
    {
      attacker: 'big',
      playerArmies: ['big'],
      enemyArmy: 'small',
      enemyArmies: ['small'],
      enemy: 'france',
      to: 'normandy',
      from: 'calais',
      fieldBattle: true,
      interactive: true,
      soundEnabled: false
    },
    mockGame,
    r => { finishCalls++; finishResult = r; },
    null,
    { overlayCanvas: overlay }
  );

  battle.startAssault();
  for (let i = 0; i < 3600 && !battle.done; i++) {
    battle.update(0.05);
  }
  assert.equal(battle.done, true, 'BattleGame 6000 vs 300 should conclude cleanly');
  assert.equal(finishCalls, 1);
  assert.equal(finishResult.victory, true);
  assert.ok(finishResult.attackerRemaining > 0.85, `Expected overwhelming survivors, got ${finishResult.attackerRemaining}`);
  assert.ok(Array.isArray(finishResult.summaryReasons) && finishResult.summaryReasons.length >= 1 && finishResult.summaryReasons.length <= 4);
  assert.ok(finishResult.summaryReasons.some(r => /overwhelming/i.test(r)), `Expected overwhelming numbers reason in ${JSON.stringify(finishResult.summaryReasons)}`);
  battle.stop();
});

test('cavalry charge vs braced spearmen yields strong spear defensive counter-shock and telemetry', () => {
  const cav = makeUnit('cav', 'attacker', 'cavalry', 0, 2.2, {
    troopCount: 60, damage: 18, speed: 8.5, chargeMomentum: 0.95
  });
  const spears = makeUnit('sp', 'defender', 'infantry', 0, 0, {
    kind: 'spearmen', formationId: 'pike_square', troopCount: 60, damage: 13, cavalryCounter: 1.55
  });
  issueFieldOrder(cav, 'charge');
  issueFieldOrder(spears, 'hold');

  const state = { groups: [cav, spears], projectiles: [], fieldSeed: 202 };
  for (let i = 0; i < 20; i++) stepField(state, 0.1);

  assert.equal(cav.chargeMomentum, 0, 'Braced spearmen must strip cavalry charge momentum');
  assert.ok(cav.bracedCounter > 0, 'Braced spearmen must inflict defensive counter-shock');
  assert.ok(spears.life > cav.life, `Braced spearmen (${spears.life}) should suffer far fewer losses than charging cavalry (${cav.life})`);
  assert.ok(spears.statusFlags.includes('BRACED'));
  assert.ok(state.tacticalStats.bracedCounters >= 1, 'bracedCounters telemetry must be recorded');
});

test('archers vs unshielded advancing infantry inflict significant pre-melee casualties and high-ground telemetry', () => {
  const archers = makeUnit('arc', 'attacker', 'archers', 18, -8, {
    troopCount: 100, damage: 13, range: 15, speed: 3.8
  });
  const infantry = makeUnit('inf', 'defender', 'infantry', 18, 13, {
    troopCount: 100, damage: 11, armor: 1, speed: 3.2, formationId: 'line'
  });
  issueFieldOrder(archers, 'hold');
  issueFieldOrder(infantry, 'advance');

  const state = { groups: [archers, infantry], projectiles: [], terrain: 'hills', fieldSeed: 303 };
  // Step until infantry is about to enter melee range (< 3 units)
  for (let i = 0; i < 80; i++) {
    const d = Math.hypot(archers.x - infantry.x, archers.z - infantry.z);
    if (d <= 2.8) break;
    stepField(state, 0.1);
  }

  assert.ok(infantry.life < 86, `Expected significant pre-melee archer casualties (life=${infantry.life})`);
  assert.equal(archers.life, 100, 'Archers should remain untouched before melee closes');
  assert.ok(state.tacticalStats.volleyHits >= 3, 'volleyHits telemetry must record ranged hits');
  assert.ok(state.tacticalStats.highGroundShots >= 3, 'highGroundShots telemetry must record elevated volleys');
});

test('flank attack inflicts extra morale damage, FLANKED status, and flankStrikes telemetry', () => {
  // Defender is pinned by a distant frontal enemy so it faces +Z while cavalry charges its flank
  const pinA = makeUnit('pinA', 'attacker', 'infantry', 0, 20, { troopCount: 40 });
  pinA.cooldown = 99;
  issueFieldOrder(pinA, 'hold');
  const flanker = makeUnit('flk', 'attacker', 'cavalry', 2.0, 0, {
    troopCount: 50, damage: 15, speed: 7.5, chargeMomentum: 0.7
  });
  const defender = makeUnit('def', 'defender', 'infantry', 0, 0, {
    troopCount: 50, morale: 85
  });
  defender.cooldown = 99;
  issueFieldOrder(flanker, 'charge');
  issueGroupTargetOrder(defender, pinA);
  issueGroupTargetOrder(flanker, defender);

  const pinB = makeUnit('pinB', 'attacker', 'infantry', 0, 20, { troopCount: 40 });
  pinB.cooldown = 99;
  issueFieldOrder(pinB, 'hold');
  const frontalAtk = makeUnit('frt', 'attacker', 'cavalry', 0, 2.0, {
    troopCount: 50, damage: 15, speed: 7.5, chargeMomentum: 0.7
  });
  const frontalDef = makeUnit('fdef', 'defender', 'infantry', 0, 0, {
    troopCount: 50, morale: 85
  });
  frontalDef.cooldown = 99;
  issueFieldOrder(frontalAtk, 'charge');
  issueGroupTargetOrder(frontalDef, pinB);
  issueGroupTargetOrder(frontalAtk, frontalDef);

  const flankState = { groups: [pinA, flanker, defender], projectiles: [], fieldSeed: 404 };
  const frontState = { groups: [pinB, frontalAtk, frontalDef], projectiles: [], fieldSeed: 404 };
  stepField(flankState, 0.1);
  stepField(frontState, 0.1);

  assert.equal(defender.flanked, true);
  assert.ok(defender.statusFlags.includes('FLANKED'));
  assert.ok(defender.morale < frontalDef.morale, `Flank morale (${defender.morale}) must be lower than frontal morale (${frontalDef.morale})`);
  assert.ok(flankState.tacticalStats.flankStrikes >= 1);
  assert.ok(flankState.tacticalStats.cavalryCharges >= 1);
});

test('surrounded / encircled regiment triggers ENCIRCLED, extra morale/defense penalty, morale collapse, and overlay pill', () => {
  // 1. Out-of-range enemies (> 14u) do NOT trigger encirclement
  const farTarget = makeUnit('ft', 'defender', 'infantry', 0, 0, { troopCount: 60, morale: 85 });
  const farFront = makeUnit('ff', 'attacker', 'infantry', 0, 2, { troopCount: 30 });
  const farRear = makeUnit('fr', 'attacker', 'infantry', 0, -16, { troopCount: 30 });
  issueFieldOrder(farTarget, 'hold');
  issueFieldOrder(farFront, 'hold');
  issueFieldOrder(farRear, 'hold');
  stepField({ groups: [farTarget, farFront, farRear], projectiles: [], fieldSeed: 505 }, 0.1);
  assert.equal(farTarget.encircled, false);
  assert.ok(!farTarget.statusFlags.includes('ENCIRCLED'));

  // 2. Single-sector enemies (both in front) do NOT trigger encirclement
  const frontOnlyDef = makeUnit('fod', 'defender', 'infantry', 0, 0, { troopCount: 60, morale: 85 });
  const frontA = makeUnit('fa', 'attacker', 'infantry', -0.8, 2, { troopCount: 30, damage: 12 });
  const frontB = makeUnit('fb', 'attacker', 'infantry', 0.8, 2, { troopCount: 30, damage: 12 });
  frontOnlyDef.cooldown = 99;
  issueFieldOrder(frontOnlyDef, 'hold');
  issueFieldOrder(frontA, 'hold');
  issueFieldOrder(frontB, 'hold');
  const singleSectorState = { groups: [frontOnlyDef, frontA, frontB], projectiles: [], fieldSeed: 505 };
  stepField(singleSectorState, 0.1);
  assert.equal(frontOnlyDef.encircled, false);

  // 3. Two distinct sectors within <= 14u triggers ENCIRCLED, extra defense & morale loss, and collapses morale
  const encircledDef = makeUnit('ed', 'defender', 'infantry', 0, 0, { troopCount: 60, morale: 85 });
  const encFront = makeUnit('ef', 'attacker', 'infantry', 0, 2, { troopCount: 30, damage: 12 });
  const encRear = makeUnit('er', 'attacker', 'infantry', 0, -2, { troopCount: 30, damage: 12 });
  encircledDef.cooldown = 99;
  issueFieldOrder(encircledDef, 'hold');
  issueFieldOrder(encFront, 'hold');
  issueFieldOrder(encRear, 'hold');
  const encState = { groups: [encircledDef, encFront, encRear], projectiles: [], fieldSeed: 505 };
  stepField(encState, 0.1);

  assert.equal(encircledDef.encircled, true);
  assert.ok(encircledDef.statusFlags.includes('ENCIRCLED'));
  assert.equal(encState.tacticalStats.encirclements, 1);
  assert.ok(encircledDef.life < frontOnlyDef.life, `Encircled defense penalty should cause heavier losses (${encircledDef.life} vs ${frontOnlyDef.life})`);
  assert.ok(encircledDef.morale < frontOnlyDef.morale, `Encircled morale (${encircledDef.morale}) must drop faster than single-sector (${frontOnlyDef.morale})`);

  // Continuing engagement collapses morale into rout
  for (let i = 0; i < 120 && !encircledDef.routed; i++) stepField(encState, 0.1);
  assert.equal(encircledDef.routed, true, 'Encircled regiment must suffer morale collapse and rout');

  // 4. Verify 2D #battle-overlay renders ENCIRCLED status pill
  const canvas = makeMock2dCanvas(900, 600);
  const overlay = makeMock2dCanvas(900, 600);
  const battle = new BattleGame(
    canvas,
    {
      attacker: 'a1',
      playerArmies: ['a1'],
      enemyArmy: 'e1',
      enemyArmies: ['e1'],
      fieldBattle: true,
      interactive: false,
      soundEnabled: false,
      enemy: 'france',
      to: 'normandy',
      from: 'calais'
    },
    {
      player: 'england',
      factions: {
        england: { id: 'england', name: 'England', color: '#4b98b3' },
        france: { id: 'france', name: 'France', color: '#b86855' }
      },
      provinces: { normandy: { id: 'normandy', terrain: 'plains', buildings: { fort: 0 } } },
      armies: {
        a1: { id: 'a1', owner: 'england', province: 'calais', infantry: 40, archers: 0, cavalry: 0, morale: 85 },
        e1: { id: 'e1', owner: 'france', province: 'normandy', infantry: 40, archers: 0, cavalry: 0, morale: 85 }
      }
    },
    () => {},
    null,
    { overlayCanvas: overlay }
  );
  const targetGroup = battle.groups.find(g => g.side === 'defender');
  targetGroup.encircled = true;
  targetGroup.statusFlags = ['ENCIRCLED', 'FLANKED'];
  battle.renderOverlay(overlay);
  assert.ok(
    overlay.ops.some(op => op[0] === 'fillText' && String(op[1]).includes('ENCIRCLED')),
    '2D battle overlay must render ENCIRCLED pill when a regiment is surrounded'
  );
  battle.stop();
});

test('exhausted vs fresh army duel gives clear victory and lower losses to fresh army, plus speed and charge scaling', () => {
  // 1. Exhausted cavalry moves slower and loses charge retention vs fresh cavalry
  const freshCav = makeUnit('fc', 'attacker', 'cavalry', -5, 25, { speed: 8, fatigue: 0, stamina: 100 });
  const tiredCav = makeUnit('tc', 'attacker', 'cavalry', 5, 25, { speed: 8, stamina: 20 });
  const dummy = makeUnit('dm', 'defender', 'infantry', 0, -30, { troopCount: 40 });
  issueFieldOrder(freshCav, 'charge');
  issueFieldOrder(tiredCav, 'charge');
  issueFieldOrder(dummy, 'hold');
  const cavState = { groups: [freshCav, tiredCav, dummy], projectiles: [], fieldSeed: 606 };
  for (let i = 0; i < 20; i++) stepField(cavState, 0.1);
  assert.ok(freshCav.z < tiredCav.z, `Fresh cavalry (${freshCav.z}) must advance faster than exhausted cavalry (${tiredCav.z})`);
  assert.ok(freshCav.chargeMomentum > tiredCav.chargeMomentum, `Fresh cavalry charge (${freshCav.chargeMomentum}) must exceed exhausted charge (${tiredCav.chargeMomentum})`);
  assert.equal(tiredCav.exhausted, true);
  assert.equal(freshCav.exhausted, false);

  // 2. Equal-numbers infantry duel: fresh vs exhausted (fatigue >= 65)
  const freshInf = makeUnit('fi', 'attacker', 'infantry', 0, 1.5, { troopCount: 100, damage: 12, morale: 85, fatigue: 0, stamina: 100 });
  const tiredInf = makeUnit('ti', 'defender', 'infantry', 0, -1.5, { troopCount: 100, damage: 12, morale: 85, fatigue: 80, stamina: 20 });
  issueFieldOrder(freshInf, 'advance');
  issueFieldOrder(tiredInf, 'advance');
  const duelState = { groups: [freshInf, tiredInf], projectiles: [], fieldSeed: 707 };
  for (let i = 0; i < 500 && !duelState.combatEnded; i++) stepField(duelState, 0.1);

  assert.equal(duelState.combatEnded, true);
  assert.equal(tiredInf.routed, true, 'Exhausted army should break in an equal-numbers duel');
  assert.equal(freshInf.routed, false, 'Fresh army should hold the field');
  assert.ok(freshInf.life > 45, `Fresh army should finish with solid remaining strength (life=${freshInf.life})`);
});

test('routed troops withdraw cohesively toward their deployment baseline without spinning or attacking, and combat ends cleanly', () => {
  // Two co-located routing attackers starting deep across the centerline + one routing defender
  const rAtk1 = makeUnit('ra1', 'attacker', 'infantry', 0, -15, { routed: true, morale: 5, speed: 5 });
  const rAtk2 = makeUnit('ra2', 'attacker', 'infantry', 0.2, -15, { routed: true, morale: 5, speed: 5 });
  const rDef = makeUnit('rd1', 'defender', 'infantry', 10, 15, { routed: true, morale: 5, speed: 5 });
  const liveDef = makeUnit('ld', 'defender', 'infantry', 0, -14, { troopCount: 50, morale: 90, life: 100 });
  issueFieldOrder(liveDef, 'hold');

  const state = { groups: [rAtk1, rAtk2, rDef, liveDef], projectiles: [], fieldSeed: 808 };
  for (let i = 0; i < 40; i++) {
    const prevZ1 = rAtk1.z;
    const prevZDef = rDef.z;
    stepField(state, 0.1);
    assert.ok(rAtk1.z >= prevZ1, 'Routed attacker must monotonically move toward +46 without random reversal');
    assert.ok(rDef.z <= prevZDef, 'Routed defender must monotonically move toward -46 without random reversal');
    assert.equal(rAtk1.facingX, 0);
    assert.equal(rAtk1.facingZ, 1);
    assert.equal(rDef.facingX, 0);
    assert.equal(rDef.facingZ, -1);
    assert.equal(rAtk1.status, 'routing');
  }
  assert.ok(Math.abs(rAtk1.x - rAtk2.x) >= 1.5, `Co-located routed allies should maintain lateral spacing (${rAtk1.x} vs ${rAtk2.x})`);
  assert.equal(liveDef.life, 100, 'Routed troops must never deal attack damage while fleeing');
  assert.equal(state.combatEnded, true, 'Combat must be marked ended when all attackers are routed');

  // Verify BattleGame stops cleanly without deadlock when all enemies are destroyed or routed
  const b = Object.create(BattleGame.prototype);
  let finishes = 0;
  let result = null;
  Object.assign(b, {
    descriptor: { fieldBattle: true },
    groups: [
      makeUnit('att', 'attacker', 'infantry', 0, 10, { troopCount: 50, life: 100, morale: 90 }),
      makeUnit('defDead', 'defender', 'infantry', 0, -10, { troopCount: 50, life: 0, morale: 50, routed: false }),
      makeUnit('defRout', 'defender', 'archers', 5, -15, { troopCount: 50, life: 60, morale: 10, routed: true })
    ],
    keys: new Set(),
    camera: { target: [0, 0, 0] },
    projectiles: [],
    effects: [],
    elapsed: 0,
    battleSpeed: 1,
    report: () => {},
    onFinish: r => { finishes++; result = r; },
    done: false
  });
  b.update(0.05);
  assert.equal(b.done, true);
  assert.equal(finishes, 1);
  assert.equal(result.victory, true);
});

test('BattleGame.finish() is strictly idempotent and populates summaryReasons and tacticalStats', () => {
  const canvas = makeMock2dCanvas(900, 600);
  let calls = 0;
  const results = [];
  const battle = new BattleGame(
    canvas,
    { fieldBattle: true, interactive: false, soundEnabled: false, enemy: 'france', to: 'normandy' },
    {
      player: 'england',
      factions: {
        england: { id: 'england', name: 'England', color: '#4b98b3', doctrineProfile: 'longbow' },
        france: { id: 'france', name: 'France', color: '#b86855', doctrineProfile: 'chivalry' }
      },
      provinces: { normandy: { id: 'normandy', terrain: 'hills', buildings: { fort: 0 } } }
    },
    r => { calls++; results.push(r); }
  );

  // Seed deterministic tactical events
  battle.tacticalStats = {
    cavalryCharges: 3,
    bracedCounters: 0,
    flankStrikes: 4,
    encirclements: 1,
    volleyHits: 8,
    highGroundShots: 5,
    ralliesUsed: 1
  };
  battle.tacticalBySide = {
    attacker: { ...battle.tacticalStats },
    defender: { cavalryCharges: 0, bracedCounters: 0, flankStrikes: 0, encirclements: 0, volleyHits: 0, highGroundShots: 0, ralliesUsed: 0 }
  };

  battle.finish(true, 100, 0);
  battle.finish(false, 0, 100);
  battle.retreat();
  battle.update(0.1);

  assert.equal(battle.done, true);
  assert.equal(calls, 1, 'BattleGame.finish() must invoke onFinish exactly once');
  const res = results[0];
  assert.equal(res.victory, true);
  assert.ok(Array.isArray(res.summaryReasons) && res.summaryReasons.length >= 1 && res.summaryReasons.length <= 4);
  assert.ok(res.summaryReasons.some(s => /encirclement/i.test(s)));
  assert.deepEqual(res.tacticalStats, {
    cavalryCharges: 3,
    bracedCounters: 0,
    flankStrikes: 4,
    encirclements: 1,
    volleyHits: 8,
    highGroundShots: 5,
    ralliesUsed: 1
  });
  battle.stop();
});
