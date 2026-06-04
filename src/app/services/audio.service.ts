import { Injectable } from '@angular/core';

export type AmbientSound = 'silence' | 'brown-noise' | 'white-noise' | 'rain' | 'ocean';

export const AMBIENT_SOUNDS: { id: AmbientSound; label: string }[] = [
  { id: 'silence', label: 'Silence' },
  { id: 'brown-noise', label: 'Bruit brun' },
  { id: 'white-noise', label: 'Bruit blanc' },
  { id: 'rain', label: 'Pluie' },
  { id: 'ocean', label: 'Océan' },
];

@Injectable({ providedIn: 'root' })
export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];

  currentSound: AmbientSound = 'silence';
  volume = 0.5;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playChimeUp(): void {
    this.playNotes([523.25, 659.25, 783.99, 1046.50]);
  }

  playChimeDown(): void {
    this.playNotes([1046.50, 783.99, 659.25, 523.25]);
  }

  playTick(): void {
    const ctx = this.ensureContext();
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    env.gain.setValueAtTime(0.1, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  private playNotes(notes: number[]): void {
    const ctx = this.ensureContext();
    const t = ctx.currentTime;
    for (let i = 0; i < notes.length; i++) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[i];
      const start = t + i * 0.4;
      env.gain.setValueAtTime(0, start);
      env.gain.linearRampToValueAtTime(0.15, start + 0.08);
      env.gain.exponentialRampToValueAtTime(0.001, start + 1.8);
      osc.connect(env);
      env.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.8);
    }
  }

  play(sound: AmbientSound): void {
    this.stop();
    this.currentSound = sound;
    if (sound === 'silence') return;

    const ctx = this.ensureContext();
    const sr = ctx.sampleRate;
    const seconds = (sound === 'ocean' || sound === 'rain') ? 30 : 10;
    const bufLen = sr * seconds;

    const buffer = ctx.createBuffer(2, bufLen, sr);
    const L = buffer.getChannelData(0);
    const R = buffer.getChannelData(1);

    switch (sound) {
      case 'brown-noise': this.genBrownNoise(L, R, sr); break;
      case 'white-noise': this.genSoftWhiteNoise(L, R, sr); break;
      case 'rain': this.genRain(L, R, sr); break;
      case 'ocean': this.genOcean(L, R, sr); break;
    }

    const fadeSec = (sound === 'ocean' || sound === 'rain') ? 4 : 1.5;
    this.crossfadeLoop(L, sr, fadeSec);
    this.crossfadeLoop(R, sr, fadeSec);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    this.nodes.push(source);

    let output: AudioNode = source;
    output = this.connectFilter(ctx, output, sound);

    const fadeIn = ctx.createGain();
    fadeIn.gain.setValueAtTime(0, ctx.currentTime);
    fadeIn.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
    output.connect(fadeIn);
    fadeIn.connect(this.masterGain!);
    this.nodes.push(fadeIn);

    source.start();
    this.buildLFOs(ctx, sound);
  }

  stop(): void {
    for (const n of this.nodes) {
      try {
        if (n instanceof AudioBufferSourceNode || n instanceof OscillatorNode) n.stop();
        n.disconnect();
      } catch { /* already stopped */ }
    }
    this.nodes = [];
    this.currentSound = 'silence';
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.masterGain) {
      this.masterGain.gain.value = v;
    }
  }

  // --- Filtering ---

  private connectFilter(ctx: AudioContext, input: AudioNode, sound: AmbientSound): AudioNode {
    switch (sound) {
      case 'brown-noise': return this.chain(ctx, input, [
        { type: 'lowpass', freq: 250, q: 0.5 },
      ]);
      case 'white-noise': return this.chain(ctx, input, [
        { type: 'lowpass', freq: 3000, q: 0.3 },
        { type: 'highpass', freq: 200, q: 0.3 },
      ]);
      case 'rain': return this.chain(ctx, input, [
        { type: 'lowpass', freq: 3500, q: 0.3 },
        { type: 'highpass', freq: 150, q: 0.3 },
        { type: 'peaking', freq: 800, q: 0.5 },
      ]);
      case 'ocean': return this.chain(ctx, input, [
        { type: 'lowpass', freq: 600, q: 0.5 },
        { type: 'peaking', freq: 120, q: 0.8 },
      ]);
      default: return input;
    }
  }

  private chain(ctx: AudioContext, input: AudioNode, filters: { type: BiquadFilterType; freq: number; q: number }[]): AudioNode {
    let node = input;
    for (const f of filters) {
      const bq = ctx.createBiquadFilter();
      bq.type = f.type;
      bq.frequency.value = f.freq;
      bq.Q.value = f.q;
      node.connect(bq);
      node = bq;
      this.nodes.push(bq);
    }
    return node;
  }

  // --- LFOs for organic movement ---

  private buildLFOs(ctx: AudioContext, sound: AmbientSound): void {
    if (sound === 'ocean') {
      this.addLFO(ctx, 0.07, 0.4);
      this.addLFO(ctx, 0.03, 0.2);
      this.addLFO(ctx, 0.013, 0.12);
    }
    if (sound === 'rain') {
      this.addLFO(ctx, 0.02, 0.05);
    }
  }

  private addLFO(ctx: AudioContext, freq: number, depth: number): void {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = freq;
    lfoGain.gain.value = depth;
    lfo.connect(lfoGain);
    lfoGain.connect(this.masterGain!.gain);
    lfo.start();
    this.nodes.push(lfo, lfoGain);
  }

  // --- Buffer generators (stereo, 10s) ---

  private genBrownNoise(L: Float32Array, R: Float32Array, sr: number): void {
    let vL = 0, vR = 0;
    const step = 0.015;
    for (let i = 0; i < L.length; i++) {
      vL += (Math.random() * 2 - 1) * step;
      vR += (Math.random() * 2 - 1) * step;
      vL = Math.max(-1, Math.min(1, vL));
      vR = Math.max(-1, Math.min(1, vR));
      L[i] = vL;
      R[i] = vR;
    }
  }

  private genSoftWhiteNoise(L: Float32Array, R: Float32Array, sr: number): void {
    for (let i = 0; i < L.length; i++) {
      L[i] = Math.random() * 2 - 1;
      R[i] = Math.random() * 2 - 1;
    }
    this.smooth(L, 3);
    this.smooth(R, 3);
  }

  private genRain(L: Float32Array, R: Float32Array, sr: number): void {
    const len = L.length;

    // Layer 1 — steady rain bed (constant, no cyclic modulation)
    for (let i = 0; i < len; i++) {
      L[i] = Math.random() * 2 - 1;
      R[i] = Math.random() * 2 - 1;
    }
    this.smooth(L, 6);
    this.smooth(R, 6);
    for (let i = 0; i < len; i++) {
      L[i] *= 0.35;
      R[i] *= 0.35;
    }

    // Layer 2 — droplets (wide variety of sizes, random placement)
    // Tiny drops: very short, sharp ticks
    this.scatterDrops(L, R, sr, len, {
      count: 1500, lenMin: 20, lenMax: 80, ampMin: 0.01, ampMax: 0.04, decay: 8,
    });
    // Small drops: classic raindrop sound
    this.scatterDrops(L, R, sr, len, {
      count: 600, lenMin: 80, lenMax: 250, ampMin: 0.03, ampMax: 0.08, decay: 25,
    });
    // Medium drops: hitting a surface
    this.scatterDrops(L, R, sr, len, {
      count: 150, lenMin: 200, lenMax: 500, ampMin: 0.04, ampMax: 0.1, decay: 60,
    });
    // Large splashes: puddle impacts
    this.scatterDrops(L, R, sr, len, {
      count: 30, lenMin: 500, lenMax: 1200, ampMin: 0.06, ampMax: 0.12, decay: 150,
    });

    // Layer 3 — trickle streams (2-4 short continuous rivulets at random positions)
    const streamCount = 2 + Math.floor(Math.random() * 3);
    for (let s = 0; s < streamCount; s++) {
      const start = Math.floor(Math.random() * (len - sr * 3));
      const duration = Math.floor((1.5 + Math.random() * 3) * sr);
      const amp = 0.015 + Math.random() * 0.02;
      const pan = Math.random();
      for (let j = 0; j < duration && start + j < len; j++) {
        const env = Math.sin((j / duration) * Math.PI);
        const n = (Math.random() * 2 - 1) * amp * env;
        L[start + j] += n * pan;
        R[start + j] += n * (1 - pan);
      }
    }

    // Layer 4 — subtle distant thunder (0-2 occurrences)
    const thunderCount = Math.floor(Math.random() * 3);
    for (let t = 0; t < thunderCount; t++) {
      const pos = Math.floor(Math.random() * (len - sr * 5));
      const duration = Math.floor((2.5 + Math.random() * 2.5) * sr);
      const amp = 0.03 + Math.random() * 0.02;
      for (let j = 0; j < duration && pos + j < len; j++) {
        const env = Math.sin((j / duration) * Math.PI);
        const rumble = (Math.random() * 2 - 1) * amp * env * env;
        L[pos + j] += rumble;
        R[pos + j] += rumble * 0.7;
      }
    }
  }

  private scatterDrops(
    L: Float32Array, R: Float32Array, sr: number, len: number,
    p: { count: number; lenMin: number; lenMax: number; ampMin: number; ampMax: number; decay: number },
  ): void {
    for (let d = 0; d < p.count; d++) {
      const dropLen = p.lenMin + Math.floor(Math.random() * (p.lenMax - p.lenMin));
      const pos = Math.floor(Math.random() * (len - dropLen - 1));
      const amp = p.ampMin + Math.random() * (p.ampMax - p.ampMin);
      const pan = Math.random();
      const decayVar = p.decay * (0.7 + Math.random() * 0.6);
      for (let j = 0; j < dropLen; j++) {
        const env = Math.exp(-j / decayVar);
        const n = (Math.random() * 2 - 1) * amp * env;
        L[pos + j] += n * pan;
        R[pos + j] += n * (1 - pan);
      }
    }
  }

  private genOcean(L: Float32Array, R: Float32Array, sr: number): void {
    const len = L.length;
    const PI2 = 2 * Math.PI;

    // Layer 1 — deep brown noise base (the body of the ocean)
    const baseL = new Float32Array(len);
    const baseR = new Float32Array(len);
    this.genBrownNoise(baseL, baseR, sr);
    this.smooth(baseL, 3);
    this.smooth(baseR, 3);

    // Layer 2 — surf wash (brighter noise for crests)
    const surfL = new Float32Array(len);
    const surfR = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      surfL[i] = Math.random() * 2 - 1;
      surfR[i] = Math.random() * 2 - 1;
    }
    this.smooth(surfL, 2);
    this.smooth(surfR, 2);

    // Layer 3 — hiss (very fine high-freq texture for receding water on sand)
    const hissL = new Float32Array(len);
    const hissR = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      hissL[i] = Math.random() * 2 - 1;
      hissR[i] = Math.random() * 2 - 1;
    }

    // Wave envelopes — 4 overlapping waves, irrational period ratios
    const waves = [
      { period: 7.3, phase: 0, amp: 0.65 },
      { period: 11.7, phase: 2.4, amp: 0.45 },
      { period: 17.9, phase: 6.1, amp: 0.3 },
      { period: 23.3, phase: 11.5, amp: 0.18 },
    ];

    for (let i = 0; i < len; i++) {
      const t = i / sr;

      let waveEnv = 0;
      let recedingEnv = 0;
      for (const w of waves) {
        const cycle = ((t + w.phase) % w.period) / w.period;
        const raw = Math.sin(cycle * PI2);
        // Asymmetric: slow swell, sharp crest, medium fall
        const shaped = raw > 0 ? Math.pow(raw, 0.5) : -Math.pow(-raw, 1.6) * 0.25;
        waveEnv += shaped * w.amp;
        // Receding water: peaks just after the wave crest falls
        const recCycle = ((t + w.phase + w.period * 0.3) % w.period) / w.period;
        const recRaw = Math.sin(recCycle * PI2);
        recedingEnv += Math.max(0, recRaw) * w.amp * 0.5;
      }
      waveEnv = Math.max(0, Math.min(1, waveEnv * 0.45 + 0.3));
      recedingEnv = Math.max(0, Math.min(1, recedingEnv * 0.3));

      const surfAmt = Math.pow(Math.max(0, waveEnv - 0.35) / 0.65, 1.3);

      L[i] = baseL[i] * 0.4 * waveEnv
           + surfL[i] * 0.25 * surfAmt
           + hissL[i] * 0.06 * recedingEnv;
      R[i] = baseR[i] * 0.4 * waveEnv
           + surfR[i] * 0.25 * surfAmt
           + hissR[i] * 0.06 * recedingEnv;
    }

    // Layer 4 — foam bursts at wave peaks (panned across stereo field)
    for (const w of waves) {
      const count = Math.floor(30 / w.period);
      for (let n = 0; n < count; n++) {
        const peakTime = w.phase + w.period * (n + 0.22 + Math.random() * 0.06);
        const peakSample = Math.floor(peakTime * sr);
        if (peakSample < 0 || peakSample >= len - sr * 2) continue;
        const burstLen = Math.floor((0.8 + Math.random() * 1.2) * sr);
        const amp = 0.05 + Math.random() * 0.05;
        const panL = 0.2 + Math.random() * 0.6;
        const panR = 1 - panL;
        for (let j = 0; j < burstLen && peakSample + j < len; j++) {
          // Asymmetric envelope: fast attack, slow release (like foam spreading)
          const p = j / burstLen;
          const env = p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 1.5);
          const noise = (Math.random() * 2 - 1) * amp * env;
          L[peakSample + j] += noise * panL;
          R[peakSample + j] += noise * panR;
        }
      }
    }

    // Layer 5 — small lapping / clapotis (quick little splashes)
    const lapCount = 60 + Math.floor(Math.random() * 30);
    for (let d = 0; d < lapCount; d++) {
      const pos = Math.floor(Math.random() * (len - sr));
      const lapLen = Math.floor((0.05 + Math.random() * 0.12) * sr);
      const amp = 0.02 + Math.random() * 0.03;
      const pan = Math.random();
      for (let j = 0; j < lapLen; j++) {
        const env = Math.exp(-j / (lapLen * 0.25));
        const n = (Math.random() * 2 - 1) * amp * env;
        L[pos + j] += n * pan;
        R[pos + j] += n * (1 - pan);
      }
    }

    // Layer 6 — sub-bass undertow (slow, felt more than heard)
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const rumble = (Math.sin(PI2 * 0.035 * t) + Math.sin(PI2 * 0.057 * t) * 0.5) * 0.03;
      L[i] += rumble;
      R[i] += rumble;
    }
  }

  // --- Utilities ---

  private smooth(data: Float32Array, passes: number): void {
    for (let p = 0; p < passes; p++) {
      for (let i = 1; i < data.length; i++) {
        data[i] = data[i] * 0.4 + data[i - 1] * 0.6;
      }
    }
  }

  private crossfadeLoop(data: Float32Array, sr: number, seconds = 1.5): void {
    const fade = Math.floor(sr * seconds);
    for (let i = 0; i < fade; i++) {
      const t = i / fade;
      data[i] = data[i] * t + data[data.length - fade + i] * (1 - t);
    }
  }
}
