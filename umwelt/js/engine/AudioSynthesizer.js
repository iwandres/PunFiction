/**
 * UMWELT: Animal Optics — Procedural Binaural Web Audio Soundscape & Species SFX Engine
 * Dynamically shifts frequency bands and textures as you step into each species' acoustic Umwelt.
 */

export class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.filter = null;
    this.droneOsc = null;
    this.droneGain = null;
    this.muted = true; // Starts muted until user enables sound (polite browser autoplay compliance)
    this.biomeId = 'meadow';
    this.speciesSlug = 'human_meadow';
  }

  _ensureContext() {
    if (this.ctx) return true;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    try {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0;
      this.masterGain.connect(this.ctx.destination);

      // Filtered noise bed (wind / underwater hydrophone / nocturnal rain mist)
      const bufSize = this.ctx.sampleRate * 3;
      const noiseBuf = this.ctx.createBuffer(2, bufSize, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const out = noiseBuf.getChannelData(ch);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.029;
          b1 = 0.985 * b1 + white * 0.032;
          b2 = 0.950 * b2 + white * 0.048;
          out[i] = (b0 + b1 + b2 + white * 0.018) * 0.42;
        }
      }

      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      noiseSrc.loop = true;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'bandpass';
      this.filter.frequency.value = 650;
      this.filter.Q.value = 0.8;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.28;

      noiseSrc.connect(this.filter);
      this.filter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);
      noiseSrc.start();

      // Subtle species harmonic drone (bee wing buzz / hammerhead electro hum / thrush quantum shimmer)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.value = 180;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0.0;
      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start();

      this._applySpeciesProfile();
      return true;
    } catch {
      return false;
    }
  }

  toggleMute() {
    if (this.muted) {
      if (!this._ensureContext()) return false;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.muted = false;
      this.masterGain.gain.setTargetAtTime(0.45, this.ctx.currentTime, 0.15);
      this._applySpeciesProfile();
      return true; // now unmuted (active)
    } else {
      this.muted = true;
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.12);
      }
      return false;
    }
  }

  setSpecies(biomeId, speciesSlug) {
    this.biomeId = biomeId;
    this.speciesSlug = speciesSlug;
    if (this.ctx) {
      this._applySpeciesProfile();
    }
  }

  _applySpeciesProfile() {
    if (!this.ctx || !this.filter || !this.droneOsc || !this.droneGain) return;
    const now = this.ctx.currentTime;
    const sp = this.speciesSlug;

    // Default biome acoustic profile
    let filterType = 'bandpass';
    let freq = 620;
    let q = 0.7;
    let ambLevel = 0.25;
    let droneFreq = 120;
    let droneVol = 0.0;
    let droneWave = 'sine';

    if (this.biomeId === 'reef') {
      filterType = 'lowpass';
      freq = 280;
      q = 1.1;
      ambLevel = 0.34;
    } else if (this.biomeId === 'cloudforest') {
      filterType = 'bandpass';
      freq = 920;
      q = 0.6;
      ambLevel = 0.26;
    }

    // Species-specific acoustic Umwelt shifts
    if (sp === 'kestrel') {
      filterType = 'highpass';
      freq = 950;
      q = 1.4;
      ambLevel = 0.22;
    } else if (sp === 'honeybee') {
      filterType = 'bandpass';
      freq = 1200;
      q = 1.6;
      droneWave = 'triangle';
      droneFreq = 228; // Honeybee ~230 Hz wingbeat fundamental
      droneVol = 0.035;
    } else if (sp === 'rattlesnake') {
      filterType = 'lowpass';
      freq = 190; // Ground-conducted seismic rumble
      q = 1.8;
      ambLevel = 0.36;
      droneFreq = 64;
      droneVol = 0.03;
    } else if (sp === 'deer') {
      filterType = 'highpass';
      freq = 1400; // Hyper-acute predator twig-snap band
      q = 0.9;
      ambLevel = 0.20;
    } else if (sp === 'cuttlefish' || sp === 'sea_turtle') {
      filterType = 'lowpass';
      freq = 210;
      q = 0.9;
      ambLevel = 0.36;
    } else if (sp === 'hammerhead') {
      filterType = 'lowpass';
      freq = 175;
      q = 1.4;
      droneFreq = 72;
      droneVol = 0.04;
    } else if (sp === 'thrush') {
      filterType = 'bandpass';
      freq = 780;
      droneFreq = 432;
      droneVol = 0.022;
    } else if (sp === 'vampire_bat') {
      filterType = 'highpass';
      freq = 1850;
      q = 1.8;
      ambLevel = 0.16;
    }

    this.filter.type = filterType;
    this.filter.frequency.setTargetAtTime(freq, now, 0.25);
    this.filter.Q.setTargetAtTime(q, now, 0.25);
    this.ambientGain.gain.setTargetAtTime(ambLevel, now, 0.25);
    this.droneOsc.type = droneWave;
    this.droneOsc.frequency.setTargetAtTime(droneFreq, now, 0.25);
    this.droneGain.gain.setTargetAtTime(droneVol, now, 0.25);
  }

  playSonarPing() {
    if (this.muted || !this._ensureContext()) return;
    const now = this.ctx.currentTime;
    // Time-expanded 60-90 kHz descending FM chirp + delayed cave echo
    [0, 0.18].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 4400 : 3200, now + delay);
      osc.frequency.exponentialRampToValueAtTime(idx === 0 ? 1550 : 1200, now + delay + 0.11);
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.linearRampToValueAtTime(idx === 0 ? 0.22 : 0.08, now + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.14);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + delay);
      osc.stop(now + delay + 0.16);
    });
  }

  playSpeciesAction(speciesSlug) {
    if (this.muted || !this._ensureContext()) return;
    if (speciesSlug === 'vampire_bat') return this.playSonarPing();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    if (speciesSlug === 'mantis_shrimp') {
      // Cavitation snap pop
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);
      g.gain.setValueAtTime(0.32, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    } else if (speciesSlug === 'rattlesnake') {
      // Strike hiss-thud
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.12);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
      g.gain.setValueAtTime(0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    }
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playDiscoveryUnlock() {
    if (this.muted || !this._ensureContext()) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5-E5-G5-C6 field chime
    notes.forEach((hz, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(hz, now + i * 0.08);
      g.gain.setValueAtTime(0.0001, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.14, now + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.45);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.48);
    });
  }

  playHitWarn() {
    if (this.muted || !this._ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.16);
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}
