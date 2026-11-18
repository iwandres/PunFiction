/**
 * The 8.3 Billionth — Zero-Asset Procedural Web Audio Synthesizer
 * Provides subtle tactile clicks, filtered particle-cull whooshes,
 * Powers-of-Ten scale zoom swells, and a warm One-of-One spotlight chord.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthSound = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'billionth_sound_muted';
  let ctx = null;
  let noiseBuffer = null;
  let muted = false;
  let lastHoverTickMs = 0;

  try {
    if (typeof localStorage !== 'undefined') {
      muted = localStorage.getItem(STORAGE_KEY) === '1';
    }
  } catch (_) {}

  function ensureContext() {
    if (muted || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (!noiseBuffer && ctx) {
      const len = Math.floor(ctx.sampleRate * 0.45);
      noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029;
        b1 = 0.985 * b1 + w * 0.032;
        data[i] = (b0 + b1 + w * 0.18) * 0.65;
      }
    }
    return ctx;
  }

  function isMuted() {
    return muted;
  }

  function setMuted(val) {
    muted = Boolean(val);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
      }
    } catch (_) {}
    return muted;
  }

  function toggleMute() {
    return setMuted(!muted);
  }

  function playHoverTick() {
    if (muted) return;
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - lastHoverTickMs < 55) return;
    lastHoverTickMs = nowMs;

    const ac = ensureContext();
    if (!ac || ac.state !== 'running') return;

    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.022);

    gain.gain.setValueAtTime(0.018, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.028);
  }

  function playCullWhoosh(bitsAdded) {
    if (muted) return;
    const ac = ensureContext();
    if (!ac || !noiseBuffer) return;

    const t = ac.currentTime;
    const intensity = Math.max(0.25, Math.min(1.0, (Number(bitsAdded) || 2) / 10));

    // Soft filtered air scatter
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.6;
    filter.frequency.setValueAtTime(900 + intensity * 700, t);
    filter.frequency.exponentialRampToValueAtTime(220, t + 0.24);

    const nGain = ac.createGain();
    nGain.gain.setValueAtTime(0.001, t);
    nGain.gain.linearRampToValueAtTime(0.055 * intensity, t + 0.03);
    nGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

    src.connect(filter);
    filter.connect(nGain);
    nGain.connect(ac.destination);
    src.start(t);
    src.stop(t + 0.28);

    // Crisp confirmation pop
    const osc = ac.createOscillator();
    const oGain = ac.createGain();
    osc.type = 'triangle';
    const baseFreq = 320 + intensity * 260;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.09);

    oGain.gain.setValueAtTime(0.045, t);
    oGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

    osc.connect(oGain);
    oGain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  function playTierZoom(tierIndex) {
    if (muted) return;
    const ac = ensureContext();
    if (!ac) return;

    const t = ac.currentTime;
    const roots = [196, 246.94, 293.66, 369.99, 440];
    const rootFreq = roots[Math.max(0, Math.min(4, (tierIndex || 1) - 1))];

    [1, 1.5].forEach((mult, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(rootFreq * mult * 0.85, t);
      osc.frequency.exponentialRampToValueAtTime(rootFreq * mult, t + 0.28);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.042 / (idx + 1), t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  function playRejectBuzz() {
    if (muted) return;
    const ac = ensureContext();
    if (!ac) return;

    const t = ac.currentTime;
    [220, 174.61].forEach((freq, idx) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      const start = t + idx * 0.075;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.045, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(start);
      osc.stop(start + 0.085);
    });
  }

  function playOneOfOneFanfare() {
    if (muted) return;
    const ac = ensureContext();
    if (!ac) return;

    const t = ac.currentTime;
    // Warm D-major-9 crystalline arpeggio (D4, F#4, A4, C#5, E5)
    const notes = [293.66, 369.99, 440.0, 554.37, 659.25];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = i < 2 ? 'triangle' : 'sine';
      const start = t + i * 0.065;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.048, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.05);

      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(start);
      osc.stop(start + 1.1);
    });
  }

  return {
    isMuted,
    setMuted,
    toggleMute,
    playHoverTick,
    playCullWhoosh,
    playTierZoom,
    playRejectBuzz,
    playOneOfOneFanfare
  };
});
