/**
 * Word Vine — Procedural Web Audio API Botanical Sound Engine
 * Zero external audio assets required; synthesizes tactile organic clicks,
 * harmonic growth spurts, Golden Triple-Bloom chords, Graft Collar slow-mo breaths,
 * Danger Vignette heartbeat pulses, and Lexical Strike stem snaps.
 */
(function (root) {
  'use strict';

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('wordvine_muted') === 'true';
      this.lastHeartbeatTime = 0;
      this.snapBuffer = null;
      this.windBuffer = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.prebuildNoiseBuffers();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    prebuildNoiseBuffers() {
      if (!this.ctx) return;
      try {
        // 1. Pre-build wood snap noise buffer (0.12s)
        const snapSize = Math.floor(this.ctx.sampleRate * 0.12);
        this.snapBuffer = this.ctx.createBuffer(1, snapSize, this.ctx.sampleRate);
        const snapData = this.snapBuffer.getChannelData(0);
        for (let i = 0; i < snapSize; i++) {
          snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapSize * 0.25));
        }

        // 2. Pre-build wind gust breeze buffer (0.65s)
        const windDuration = 0.65;
        const windSize = Math.floor(this.ctx.sampleRate * windDuration);
        this.windBuffer = this.ctx.createBuffer(1, windSize, this.ctx.sampleRate);
        const windData = this.windBuffer.getChannelData(0);
        for (let i = 0; i < windSize; i++) {
          const t = i / windSize;
          const env = Math.sin(t * Math.PI);
          windData[i] = (Math.random() * 2 - 1) * env;
        }
      } catch (e) {
        // Ignore buffer allocation errors
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('wordvine_muted', String(this.muted));
      return this.muted;
    }

    /**
     * Standard upward node growth pop + pitch scaled by zone & combo
     */
    playSpurt(zoneId = 1, nodeIndex = 0) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic climbing scale
      const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
      const baseFreq = scale[nodeIndex % scale.length] * (zoneId === 3 ? 1.25 : zoneId === 2 ? 1.12 : 1.0);

      osc.type = zoneId === 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.85, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.11);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    /**
     * Golden flower bloom chord on completing step 3 of a Zone 1 Triplet (+185u boost)
     */
    playTripleBloom() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5 Major 9th shimmer

      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.035;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        osc.frequency.exponentialRampToValueAtTime(f * 1.02, start + 0.35);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.42);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.44);
      });
    }

    /**
     * 0.6s Graft Collar slow-motion breath whoosh on crossing into Zone 2 or Zone 3
     */
    playGraftCollar(zoneId) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = zoneId === 3 ? 220 : 165;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, now + 0.58);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.62);
    }

    /**
     * Lexical Strike: crisp dry branch snap + low thud
     */
    playStemSnap() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      if (!this.snapBuffer) {
        this.prebuildNoiseBuffers();
      }

      if (this.snapBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.snapBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
      }

      // Low descending thud
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.28);

      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.31);
    }

    /**
     * Danger Vignette low bass heartbeat pulse when Y_vine - Y_cam <= 150 units
     */
    updateDangerHeartbeat(leadUnits, nowMs) {
      if (this.muted || leadUnits > 150 || leadUnits <= 0) return;
      // Interval speeds up from 650ms at 150u down to 240ms near 0u
      const urgency = 1 - Math.max(0, Math.min(1, leadUnits / 150));
      const intervalMs = 620 - urgency * 370;
      if (nowMs - this.lastHeartbeatTime < intervalMs) return;

      this.lastHeartbeatTime = nowMs;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(62 + urgency * 18, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.16);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14 + urgency * 0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    }

    /**
     * Wind-Ruffled Gust: soft sweeping bandpass breeze whoosh when a 2-3 node Wind Gust rolls in
     */
    playWindGust() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.65;
      if (!this.windBuffer) {
        this.prebuildNoiseBuffers();
      }
      if (!this.windBuffer) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.windBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.4, now);
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(880, now + duration * 0.45);
      filter.frequency.exponentialRampToValueAtTime(380, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }

    /**
     * Rain Shower: soft rain patter + two glass water-droplet plinks when a 2-3 node Rain Shower begins
     */
    playRainShower() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.6;
      if (!this.windBuffer) {
        this.prebuildNoiseBuffers();
      }
      if (this.windBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.windBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(1.8, now);
        filter.frequency.setValueAtTime(1450, now);
        filter.frequency.exponentialRampToValueAtTime(2150, now + duration * 0.5);
        filter.frequency.exponentialRampToValueAtTime(1600, now + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + duration * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
      }

      // Two delicate water-droplet plinks on glass
      const drops = [
        { delay: 0.04, startHz: 780, endHz: 1380 },
        { delay: 0.19, startHz: 960, endHz: 1620 }
      ];
      drops.forEach((d) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(d.startHz, now + d.delay);
        osc.frequency.exponentialRampToValueAtTime(d.endHz, now + d.delay + 0.065);

        g.gain.setValueAtTime(0.001, now + d.delay);
        g.gain.linearRampToValueAtTime(0.11, now + d.delay + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + d.delay + 0.08);

        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + d.delay);
        osc.stop(now + d.delay + 0.085);
      });
    }
  }

  root.WordVineSound = new SoundEngine();
})(typeof self !== 'undefined' ? self : this);
