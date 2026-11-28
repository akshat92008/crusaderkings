import {SampleBank} from './sample-audio.js';
import {SoundtrackPlayer,soundtrackPaths,campaignMusicKey} from './soundtrack.js';
// Original procedural sound effects, battle music fallback, and unified campaign audio.
const limits = { steel: 0.15, arrow: 0.20, hoof: 0.28, rout: 0.8, horn: 1.1, rally: 1.1, wind: 2.2, order: 0.15, victory: 1, defeat: 1 };
const sfxLimits = { click: 0.05, coin: 0.08, seal: 0.12, horn: 0.5, chime: 0.15, alert: 0.25, march: 0.18, succession: 0.8, rally: 0.6 };

const defaultAudioCtxFactory = () => {
  const C = globalThis.AudioContext || globalThis.webkitAudioContext;
  return C ? new C() : null;
};

function makeNoiseBuffer(ctx, seconds = 2) {
  const n = Math.max(1, Math.ceil((ctx.sampleRate || 44100) * seconds));
  const buf = ctx.createBuffer(1, n, ctx.sampleRate || 44100);
  const data = buf.getChannelData(0);
  let seed = 1450;
  for (let i = 0; i < n; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    data[i] = seed / 2147483648 - 1;
  }
  return buf;
}

export function fieldAudioEvents(groups, seen, elapsed, ambientDue = 0) {
  const events = [];
  for (const g of groups) {
    const old = seen.get(g.id) || { attack: 0, routed: false };
    if ((g.attackSerial || 0) > old.attack) {
      events.push({ kind: g.type === 'archers' || g.specialistId==='horsebow' ? 'arrow' : g.type === 'cavalry' ? 'hoof' : 'steel', x: g.x, z: g.z });
    }
    if (g.routed && !old.routed && g.life > 0) {
      events.push({ kind: 'rout', x: g.x, z: g.z });
    }
    seen.set(g.id, { attack: g.attackSerial || 0, routed: !!g.routed });
  }
  if (elapsed >= ambientDue) {
    events.push({ kind: 'wind', x: 0, z: 0 });
    if (groups.some(g => g.type === 'cavalry' && g.moving && !g.routed)) {
      events.push({ kind: 'hoof', x: 0, z: 0 });
    }
  }
  return events;
}

export class FieldAudio {
  constructor(factory, enabled = true, opts = {}) {
    this.factory = factory;
    this.sampleLoader=opts.sampleLoader;this.samples=null;
    this.enabled = enabled;
    this.seen = new Map();
    this.next = new Map();
    this.voices = new Set();
    this.ambientDue = 0;
    this.closed = false;
  }

  unlock() {
    if (!this.enabled || this.closed) return false;
    try {
      if (!this.ctx) {
        this.ctx = this.factory?.();
        if (!this.ctx) return false;
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.18;
        this.master.connect(this.ctx.destination);
        this.noise = makeNoiseBuffer(this.ctx, 2);
        if(this.sampleLoader&&this.ctx.decodeAudioData){this.samples=new SampleBank(this.ctx,this.sampleLoader===true?undefined:this.sampleLoader);void this.samples.warm(['steel','hoof','order','victory','defeat']);}
      }
      this.ctx.resume?.()?.catch?.(() => {});
      return true;
    } catch {
      return false;
    }
  }

  setEnabled(value) {
    this.enabled = !!value;
    if (this.master) this.master.gain.value = this.enabled ? 0.18 : 0;
    if (this.enabled) this.unlock();
    else this.silence();
  }

  silence() {
    for (const s of this.voices) {
      try { s.stop(); } catch {}
    }
    this.voices.clear();
  }

  play(kind, pan = 0) {
    const c = this.ctx;
    if (!this.enabled || this.closed || !c || c.state !== 'running' || this.voices.size >= 12) return false;
    const now = c.currentTime;
    if (now < (this.next.get(kind) || 0)) return false;
    this.next.set(kind, now + (limits[kind] || 0.2));
    if(this.samples?.play(kind,node=>this.connect(node,pan),(source,nodes)=>this.track(source,nodes)))return true;
    try {
      const tone = (freq, end, dur, volume, type = 'sine', delay = 0) => {
        if (this.voices.size >= 12) return;
        const start = now + delay;
        const s = c.createOscillator();
        const gain = c.createGain();
        s.type = type;
        s.frequency.setValueAtTime(freq, start);
        s.frequency.exponentialRampToValueAtTime(Math.max(20, end), start + dur);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        s.connect(gain);
        const panner = this.connect(gain, pan);
        this.track(s, [gain, panner]);
        s.start(start);
        s.stop(start + dur + 0.02);
      };
      const noise = (freq, dur, volume, type = 'bandpass') => {
        if (this.voices.size >= 12 || !this.noise) return;
        const s = c.createBufferSource();
        const f = c.createBiquadFilter();
        const gain = c.createGain();
        s.buffer = this.noise;
        f.type = type;
        f.frequency.value = freq;
        f.Q.value = 0.7;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        s.connect(f);
        f.connect(gain);
        const panner = this.connect(gain, pan);
        this.track(s, [f, gain, panner]);
        s.start(now, 0, dur);
        s.stop(now + dur + 0.02);
      };
      switch (kind) {
        case 'steel':
          noise(2600, 0.13, 0.23);
          tone(1120, 420, 0.15, 0.085, 'triangle');
          break;
        case 'arrow':
          noise(1150, 0.19, 0.13);
          tone(680, 180, 0.11, 0.065, 'triangle');
          break;
        case 'hoof':
          noise(160, 0.19, 0.24, 'lowpass');
          tone(95, 42, 0.14, 0.22);
          break;
        case 'wind':
          noise(370, 1.65, 0.075, 'lowpass');
          break;
        case 'rout':
          tone(196, 110, 0.45, 0.12, 'triangle');
          break;
        case 'order':
          tone(392, 440, 0.11, 0.075, 'triangle');
          break;
        case 'horn':
          tone(196, 196, 0.48, 0.16, 'triangle');
          tone(294, 294, 0.34, 0.10, 'triangle', 0.18);
          break;
        case 'rally':
          tone(196, 196, 0.40, 0.15, 'triangle');
          tone(294, 294, 0.38, 0.14, 'triangle', 0.14);
          tone(392, 392, 0.55, 0.13, 'triangle', 0.28);
          break;
        case 'victory':
          tone(196, 196, 0.34, 0.15, 'triangle');
          tone(294, 294, 0.38, 0.13, 'triangle', 0.25);
          tone(392, 392, 0.62, 0.11, 'triangle', 0.52);
          break;
        case 'defeat':
          tone(196, 130, 0.58, 0.13, 'triangle');
          break;
        default:
          return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  connect(node, pan) {
    if (this.ctx.createStereoPanner) {
      const p = this.ctx.createStereoPanner();
      p.pan.value = Math.max(-0.8, Math.min(0.8, pan));
      node.connect(p);
      p.connect(this.master);
      return p;
    }
    node.connect(this.master);
    return null;
  }

  track(source, nodes = []) {
    this.voices.add(source);
    source.onended = () => {
      this.voices.delete(source);
      for (const n of [source, ...nodes]) {
        try { n?.disconnect(); } catch {}
      }
    };
  }

  update(groups, elapsed, camera) {
    const events = fieldAudioEvents(groups, this.seen, elapsed, this.ambientDue);
    if (elapsed >= this.ambientDue) this.ambientDue = elapsed + 2.4;
    if (!this.enabled) return;
    for (const e of events) {
      const pan = (e.x - (camera?.target?.[0] || 0)) / 55;
      this.play(e.kind, pan);
    }
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.silence();this.samples?.close();
    try {
      this.master?.disconnect();
      this.ctx?.close?.()?.catch?.(() => {});
    } catch {}
  }
}

// The music element or Web Audio fallback is created only on an explicit start/resume gesture.
export class BattleMusic {
  constructor(factory, enabled = true, fallbackOrOpts = null) {
    this.factory = factory;
    this.enabled = !!enabled;
    this.fallbackFactory = typeof fallbackOrOpts === 'function' ? fallbackOrOpts : (fallbackOrOpts?.fallbackFactory || null);
    this.active = false;
    this.closed = false;
    this.media = null;
    this.mediaFailed = false;
    this._mediaHooked = false;
    this.fallbackCtx = null;
    this.fallbackMaster = null;
    this.fallbackNoise = null;
    this.fallbackTimer = null;
    this.fallbackVoices = new Set();
    this.fallbackStep = 0;
  }

  get usingFallback() {
    return !!this.fallbackTimer;
  }

  _stopFallback() {
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    for (const v of this.fallbackVoices) {
      try { v.stop(); } catch {}
    }
    this.fallbackVoices.clear();
    if (this.fallbackMaster) this.fallbackMaster.gain.value = 0;
  }

  _startFallback() {
    if (this.closed || !this.active || !this.enabled || !this.fallbackFactory) return false;
    try {
      if (!this.fallbackCtx) {
        this.fallbackCtx = this.fallbackFactory();
        if (!this.fallbackCtx) return false;
        this.fallbackMaster = this.fallbackCtx.createGain();
        this.fallbackMaster.gain.value = 0.16;
        this.fallbackMaster.connect(this.fallbackCtx.destination);
        this.fallbackNoise = makeNoiseBuffer(this.fallbackCtx, 1.5);
      }
      this.fallbackMaster.gain.value = 0.16;
      this.fallbackCtx.resume?.()?.catch?.(() => {});
      if (!this.fallbackTimer) {
        const tick = () => {
          if (this.closed || !this.active || !this.enabled || !this.fallbackCtx) return;
          if (this.fallbackCtx.state !== 'running') return;
          this._playFallbackStep();
        };
        this.fallbackTimer = setInterval(tick, 440);
        tick();
      }
      return true;
    } catch {
      return false;
    }
  }

  _playFallbackStep() {
    const c = this.fallbackCtx;
    if (!c || this.fallbackVoices.size >= 10) return;
    const now = c.currentTime || 0;
    const beat = this.fallbackStep++ % 8;
    const track = (s, nodes) => {
      this.fallbackVoices.add(s);
      s.onended = () => {
        this.fallbackVoices.delete(s);
        for (const n of [s, ...nodes]) try { n?.disconnect(); } catch {}
      };
    };

    // War drum pulse on beats 0, 2, 3, 4, 6
    if ([0, 2, 3, 4, 6].includes(beat)) {
      const strong = beat === 0 || beat === 4;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(strong ? 92 : 76, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.22);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(strong ? 0.42 : 0.24, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.connect(gain);
      gain.connect(this.fallbackMaster);
      track(osc, [gain]);
      osc.start(now);
      osc.stop(now + 0.28);

      if (strong && this.fallbackNoise && c.createBiquadFilter) {
        const ns = c.createBufferSource();
        const flt = c.createBiquadFilter();
        const ng = c.createGain();
        ns.buffer = this.fallbackNoise;
        flt.type = 'lowpass';
        flt.frequency.value = 260;
        ng.gain.setValueAtTime(0.001, now);
        ng.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        ns.connect(flt);
        flt.connect(ng);
        ng.connect(this.fallbackMaster);
        track(ns, [flt, ng]);
        ns.start(now, 0, 0.2);
        ns.stop(now + 0.22);
      }
    }

    // Dorian battle brass fifths on bars 0 and 4
    if (beat === 0 || beat === 4) {
      const root = beat === 0 ? 146.83 : 130.81; // D3 / C3
      for (const freq of [root, root * 1.5]) {
        if (this.fallbackVoices.size >= 10) break;
        const osc = c.createOscillator();
        const flt = c.createBiquadFilter();
        const gain = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        flt.type = 'lowpass';
        flt.frequency.value = 560;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.10, now + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);
        osc.connect(flt);
        flt.connect(gain);
        gain.connect(this.fallbackMaster);
        track(osc, [flt, gain]);
        osc.start(now);
        osc.stop(now + 1.5);
      }
    }
  }

  sync(active, enabled = this.enabled) {
    this.active = !!active;
    this.enabled = !!enabled;
    if (this.closed) return false;
    if (!this.active || !this.enabled) {
      try { this.media?.pause(); } catch {}
      this._stopFallback();
      return false;
    }
    try {
      if (!this.media && !this.mediaFailed) {
        this.media = this.factory?.();
        if (this.media) {
          this.media.loop = true;
          this.media.volume = 0.22;
          this.media.preload = 'none';
          if (!this._mediaHooked && typeof this.media.addEventListener === 'function') {
            this._mediaHooked = true;
            this.media.addEventListener('error', () => {
              this.mediaFailed = true;
              if (this.active && this.enabled && !this.closed) this._startFallback();
            });
          }
        }
      }
      if (!this.media || this.mediaFailed) {
        return this._startFallback();
      }
      const result = this.media.play();
      if (result && typeof result.catch === 'function') {
        result.catch(err => {
          if (err?.name !== 'NotAllowedError' && this.fallbackFactory && this.active && this.enabled && !this.closed) {
            this.mediaFailed = true;
            this._startFallback();
          }
        });
      }
      return true;
    } catch {
      return this._startFallback();
    }
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.active = false;
    try {
      this.media?.pause();
      if (this.media) {
        this.media.removeAttribute?.('src');
        this.media.load?.();
      }
    } catch {}
    this.media = null;
    this._stopFallback();
    try {
      this.fallbackMaster?.disconnect();
      this.fallbackCtx?.close?.()?.catch?.(() => {});
    } catch {}
    this.fallbackCtx = null;
  }
}

const VALID_MODES = new Set(['menu', 'peace', 'war', 'crisis', 'silent']);

// Dorian / Aeolian medieval scale frequencies (Hz)
const MODE_SCALES = {
  menu: { root: 146.83, fifth: 220.0, notes: [293.66, 329.63, 349.23, 440.0, 493.88, 523.25, 440.0, 349.23], intervalMs: 650, drum: false },
  peace: { root: 146.83, fifth: 220.0, notes: [293.66, 349.23, 440.0, 523.25, 587.33, 493.88, 440.0, 392.0], intervalMs: 560, drum: false },
  war: { root: 110.0, fifth: 164.81, notes: [220.0, 261.63, 329.63, 293.66, 261.63, 246.94, 220.0, 196.0], intervalMs: 390, drum: true },
  crisis: { root: 146.83, fifth: 207.65, notes: [293.66, 311.13, 349.23, 415.30, 349.23, 311.13, 293.66, 261.63], intervalMs: 440, drum: true }
};

/** Unified Web Audio procedural medieval soundtrack + campaign/battle SFX controller. */
export class CampaignAudio {
  constructor(factory = defaultAudioCtxFactory, opts = {}) {
    this.factory = factory;
    this.muted = !!opts.muted;
    this.mode = VALID_MODES.has(opts.mode) ? opts.mode : 'menu';
    this.prevMode = this.mode === 'silent' ? 'peace' : this.mode;
    this.ctx = null;
    this.master = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.ambienceGain = null;
    this.bus = { master: 1.0, music: 0.65, sfx: 0.95, ambience: 0.55 };
    this.noise = null;
    this.droneNodes = [];
    this.voices = new Set();
    this.nextSfx = new Map();
    this.timer = null;
    this.step = 0;
    this.closed = false;
    this.linked = new Set();
    this.sampleLoader=opts.sampleLoader;this.samples=null;this.onMusicState=opts.onMusicState;
    this.realm=null;this.scoreOverride=null;this.unlocked=false;this.score=opts.mediaFactory?new SoundtrackPlayer(opts.mediaFactory,{volume:.75,reuseMedia:true,onState:opts.onMusicState,onUnavailable:()=>this._startProceduralBgm(),onPlaying:()=>this._stopProceduralBgm()}):null;
  }

  link(...targets) {
    for (const t of targets) {
      if (t) this.linked.add(t);
    }
    return this;
  }

  unlink(target) {
    this.linked.delete(target);
  }

  unlock() {
    if(this.closed)return false;
    this.unlocked=true;
    // HTML media has its own browser playback path. Do not require Web Audio.
    if(!this.muted&&this.mode!=='silent'&&this.score)this._startBgm();
    try {
      if (!this.ctx) {
        this.ctx = this.factory?.();
        if(this.ctx){
          this.master=this.ctx.createGain();this.bgmGain=this.ctx.createGain();this.sfxGain=this.ctx.createGain();this.ambienceGain=this.ctx.createGain();
          this.master.gain.value=this.muted?0:0.24*this.bus.master;this.bgmGain.gain.value=this.mode==='silent'?0:this.bus.music;this.sfxGain.gain.value=this.bus.sfx;this.ambienceGain.gain.value=this.bus.ambience;
          this.bgmGain.connect(this.master);this.sfxGain.connect(this.master);this.ambienceGain.connect(this.master);this.master.connect(this.ctx.destination);
          this.noise=makeNoiseBuffer(this.ctx,1.5);
          if(this.sampleLoader&&this.ctx.decodeAudioData){this.samples=new SampleBank(this.ctx,this.sampleLoader===true?undefined:this.sampleLoader);void this.samples.warm(['click','seal']);}
        }
      }
      this.ctx?.resume?.()?.catch?.(()=>{});
    }catch{}
    if(!this.muted&&this.mode!=='silent'&&(!this.score||this.score.exhausted))this._startProceduralBgm();
    return !!(this.ctx||this.score);
  }

  retryMusic(){if(this.closed||this.muted||this.mode==='silent')return false;this.unlocked=true;if(this.score?.exhausted)this.score.retry();return this.unlock();}

  setContext(mode,realm=null,override=null){
    this.realm=realm;this.scoreOverride=override;return this.setMode(mode);
  }

  isMuted() {
    return this.muted;
  }
  getBusVolumes() {
    return { ...this.bus };
  }
  setBusVolume(name, val) {
    if (!Object.hasOwn(this.bus, name)) return false;
    const v = Math.max(0, Math.min(1, Number(val) || 0));
    this.bus[name] = v;
    if (name === 'master' && this.master) this.master.gain.value = this.muted ? 0 : 0.24 * v;
    if (name === 'music') {
      if (this.bgmGain) this.bgmGain.gain.value = this.mode === 'silent' ? 0 : v;
      if (this.score) this.score.volume = 0.75 * v * this.bus.master;
    }
    if (name === 'sfx' && this.sfxGain) this.sfxGain.gain.value = v;
    if (name === 'ambience' && this.ambienceGain) this.ambienceGain.gain.value = v;
    return true;
  }

  setMuted(muted) {
    this.muted = !!muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.24;
    if (this.muted) {
      this._stopBgm();
    } else if (!this.closed) {
      if ((this.unlocked||this.ctx) && this.mode !== 'silent') {
        this.ctx?.resume?.()?.catch?.(() => {});
        this._startBgm();
      }
    }
    for (const target of this.linked) {
      if (target instanceof FieldAudio) target.setEnabled(!this.muted);
      else if (target instanceof BattleMusic) target.sync(target.active, !this.muted);
      else target?.setMuted?.(this.muted);
    }
    return this.muted;
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }

  setRealm(realm){if(this.realm===realm)return;this.realm=realm;if((this.unlocked||this.ctx)&&!this.muted&&this.mode==='peace')this._startBgm();}
  setScoreOverride(key){if(this.scoreOverride===key)return;this.scoreOverride=key;if((this.unlocked||this.ctx)&&!this.muted&&this.mode!=='silent')this._startBgm();}
  setMode(mode) {
    if (!VALID_MODES.has(mode)) return false;
    if(this.score&&this.mode===mode){if(mode==='silent'||this.muted)this._stopBgm();else if(this.unlocked||this.ctx)this._startBgm();return true;}
    if (mode !== 'silent') this.prevMode = mode;
    this.mode = mode;
    if (this.closed) return false;
    if (mode === 'silent' || this.muted) {
      if (this.bgmGain) this.bgmGain.gain.value = 0;
      this._stopBgm();
      return true;
    }
    if (this.bgmGain) this.bgmGain.gain.value = 0.65;
    if(this.unlocked||this.ctx){this._stopBgm();this._startBgm();}
    return true;
  }

  resumeMode() {
    return this.setMode(this.prevMode || 'peace');
  }

  _stopBgm() {
    this.score?.pause();this._stopProceduralBgm();
  }

  _stopProceduralBgm() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    for (const d of this.droneNodes) {
      try { d.stop?.(); d.disconnect?.(); } catch {}
    }
    this.droneNodes.length = 0;
  }

  _startBgm() {
    if ((!this.unlocked&&!this.ctx) || this.closed || this.muted || this.mode === 'silent') return;
    if(this.score){const key=this.scoreOverride||campaignMusicKey(this.mode,this.realm);if(this.score.select(key,soundtrackPaths(key)))this._stopProceduralBgm();if(this.score.resume())return;}
    this._startProceduralBgm();
  }

  _startProceduralBgm() {
    if (!this.ctx || this.closed || this.muted || this.mode === 'silent') return;
    if (this.timer) return;
    const cfg = MODE_SCALES[this.mode] || MODE_SCALES.peace;
    const c = this.ctx;
    const now = c.currentTime || 0;

    // Low medieval harmonic drone (root + fifth)
    try {
      for (const [idx, freq] of [cfg.root, cfg.fifth].entries()) {
        const osc = c.createOscillator();
        const flt = c.createBiquadFilter?.();
        const gain = c.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * 0.5, now);
        gain.gain.setValueAtTime(idx === 0 ? 0.14 : 0.08, now);
        if (flt) {
          flt.type = 'lowpass';
          flt.frequency.value = 340;
          osc.connect(flt);
          flt.connect(gain);
        } else {
          osc.connect(gain);
        }
        gain.connect(this.bgmGain);
        osc.start(now);
        this.droneNodes.push(osc, gain);
        if (flt) this.droneNodes.push(flt);
      }
    } catch {}

    const tick = () => {
      if (this.closed || this.muted || this.mode === 'silent' || !this.ctx) return;
      if (this.ctx.state !== 'running') return;
      this._pluckStep();
    };
    this.timer = setInterval(tick, cfg.intervalMs);
    tick();
    this.onMusicState?.('playing', '');
  }

  _pluckStep() {
    const c = this.ctx;
    if (!c || this.voices.size >= 14) return;
    const cfg = MODE_SCALES[this.mode] || MODE_SCALES.peace;
    const idx = this.step++ % cfg.notes.length;
    const now = c.currentTime || 0;
    const freq = cfg.notes[(idx * 3 + (idx >> 1)) % cfg.notes.length];

    try {
      const osc = c.createOscillator();
      const flt = c.createBiquadFilter?.();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      if (flt) {
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(1400, now);
        flt.frequency.exponentialRampToValueAtTime(420, now + 0.55);
        osc.connect(flt);
        flt.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(this.bgmGain);
      this._track(osc, [flt, gain]);
      osc.start(now);
      osc.stop(now + 0.68);

      if (cfg.drum && idx % 2 === 0 && this.voices.size < 14) {
        const drum = c.createOscillator();
        const dg = c.createGain();
        drum.type = 'sine';
        drum.frequency.setValueAtTime(idx === 0 ? 84 : 68, now);
        drum.frequency.exponentialRampToValueAtTime(36, now + 0.18);
        dg.gain.setValueAtTime(0.001, now);
        dg.gain.exponentialRampToValueAtTime(idx === 0 ? 0.22 : 0.13, now + 0.01);
        dg.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
        drum.connect(dg);
        dg.connect(this.bgmGain);
        this._track(drum, [dg]);
        drum.start(now);
        drum.stop(now + 0.22);
      }
    } catch {}
  }

  _track(source, nodes = []) {
    this.voices.add(source);
    source.onended = () => {
      this.voices.delete(source);
      for (const n of [source, ...nodes]) {
        try { n?.disconnect?.(); } catch {}
      }
    };
  }

  playSfx(kind) {
    const c = this.ctx;
    if (this.closed || this.muted || !c || c.state !== 'running' || this.voices.size >= 16) return false;
    if (!Object.hasOwn(sfxLimits, kind)) return false;
    const now = c.currentTime || 0;
    if (now < (this.nextSfx.get(kind) || 0)) return false;
    this.nextSfx.set(kind, now + sfxLimits[kind]);
    if(this.samples?.play(kind,node=>{node.connect(this.sfxGain);return null;},(source,nodes)=>this._track(source,nodes)))return true;

    const tone = (freq, end, dur, vol, type = 'sine', delay = 0) => {
      if (this.voices.size >= 16) return;
      const start = now + delay;
      const s = c.createOscillator();
      const g = c.createGain();
      s.type = type;
      s.frequency.setValueAtTime(freq, start);
      s.frequency.exponentialRampToValueAtTime(Math.max(20, end), start + dur);
      g.gain.setValueAtTime(0.001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, start + dur);
      s.connect(g);
      g.connect(this.sfxGain);
      this._track(s, [g]);
      s.start(start);
      s.stop(start + dur + 0.02);
    };
    const noise = (freq, dur, vol, type = 'bandpass', delay = 0) => {
      if (this.voices.size >= 16 || !this.noise) return;
      const start = now + delay;
      const s = c.createBufferSource();
      const f = c.createBiquadFilter();
      const g = c.createGain();
      s.buffer = this.noise;
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = 0.8;
      g.gain.setValueAtTime(0.001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, start + dur);
      s.connect(f);
      f.connect(g);
      g.connect(this.sfxGain);
      this._track(s, [f, g]);
      s.start(start, 0, dur);
      s.stop(start + dur + 0.02);
    };

    try {
      switch (kind) {
        case 'click':
          noise(1400, 0.05, 0.14);
          tone(520, 260, 0.06, 0.12, 'triangle');
          break;
        case 'coin':
          tone(2150, 2080, 0.16, 0.12, 'sine');
          tone(3240, 3180, 0.22, 0.09, 'sine', 0.03);
          break;
        case 'seal':
          tone(160, 70, 0.16, 0.25, 'sine');
          noise(900, 0.11, 0.18, 'lowpass');
          break;
        case 'horn':
          tone(196, 196, 0.48, 0.22, 'triangle');
          tone(294, 294, 0.36, 0.16, 'triangle', 0.16);
          break;
        case 'chime':
          tone(523.25, 523.25, 0.36, 0.14, 'sine');
          tone(659.25, 659.25, 0.40, 0.11, 'sine', 0.07);
          tone(783.99, 783.99, 0.50, 0.10, 'sine', 0.14);
          break;
        case 'alert':
          tone(440, 440, 0.18, 0.18, 'triangle');
          tone(587.33, 587.33, 0.24, 0.18, 'triangle', 0.14);
          break;
        case 'march':
          tone(92, 42, 0.14, 0.24, 'sine');
          tone(92, 42, 0.14, 0.22, 'sine', 0.16);
          noise(1800, 0.08, 0.10, 'bandpass', 0.04);
          break;
        case 'succession':
          tone(146.83, 146.83, 0.50, 0.18, 'triangle');
          tone(220.00, 220.00, 0.50, 0.16, 'triangle', 0.18);
          tone(293.66, 293.66, 0.55, 0.15, 'triangle', 0.36);
          tone(369.99, 369.99, 0.72, 0.14, 'triangle', 0.54);
          break;
        case 'rally':
          tone(196, 196, 0.38, 0.20, 'triangle');
          tone(294, 294, 0.38, 0.18, 'triangle', 0.14);
          tone(392, 392, 0.58, 0.16, 'triangle', 0.28);
          break;
        default:
          return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this._stopBgm();this.score?.close();this.samples?.close();
    for (const v of this.voices) {
      try { v.stop?.(); } catch {}
    }
    this.voices.clear();
    try {
      this.bgmGain?.disconnect();
      this.sfxGain?.disconnect();
      this.master?.disconnect();
      this.ctx?.close?.()?.catch?.(() => {});
    } catch {}
    this.ctx = null;
  }
}

const mediaFactory=src=>{if(typeof Audio!=='function')return null;const media=new Audio(src);media.preload='auto';media.muted=false;return media;};
export const browserCampaignAudio = new CampaignAudio(defaultAudioCtxFactory,{mediaFactory,sampleLoader:true,onMusicState:(state,error)=>{const doc=globalThis.document;if(doc?.documentElement){doc.documentElement.dataset.musicState=state;doc.documentElement.dataset.musicError=error||'';}}});

export function browserFieldAudio(enabled = true) {
  const effective = enabled && !browserCampaignAudio.isMuted();
  const audio = new FieldAudio(defaultAudioCtxFactory, effective,{sampleLoader:true});
  browserCampaignAudio.link(audio);
  return audio;
}

let nextBattleTrack=0;
class ScoreBattleMusic extends BattleMusic {
  constructor(enabled){super(()=>null,enabled,defaultAudioCtxFactory);const tracks=soundtrackPaths('war');if(nextBattleTrack++%2)tracks.reverse();this.score=new SoundtrackPlayer(mediaFactory,{volume:.8,reuseMedia:true,onUnavailable:()=>this._startFallback(),onPlaying:()=>this._stopFallback()});this.score.select('battle',[...tracks,'assets/audio/war%20theme.ogg']);}
  sync(active,enabled=this.enabled){this.active=!!active;this.enabled=!!enabled;if(this.closed)return false;if(!this.active||!this.enabled){this.score.pause();this._stopFallback();return false;}return this.score.resume()||this._startFallback();}
  close(){this.score.close();super.close();}
}
export function browserBattleMusic(enabled = true) {
  const effective = enabled && !browserCampaignAudio.isMuted();
  const music = new ScoreBattleMusic(effective);
  browserCampaignAudio.link(music);
  return music;
}
