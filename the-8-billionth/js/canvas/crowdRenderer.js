/**
 * The 8.3 Billionth — 60fps Multi-Scale HTML5 Canvas 2D Crowd Renderer
 *
 * Uses contiguous Float32Array SoA buffers + pre-rendered HiDPI sprite stamps
 * to render up to 9,999 particles, Ghost-Cull hover previews, Powers-of-Ten
 * subdivision zooms, Tier-4 human silhouettes, and the Tier-5 Singular Spotlight
 * cleanly at 60fps on both desktop and mobile viewports.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./scaleTiers.js'));
  } else {
    root.BillionthCrowdRenderer = factory(root.BillionthScaleTiers);
  }
})(typeof self !== 'undefined' ? self : this, function (ScaleTiers) {
  'use strict';

  const MAX_PARTICLES = 10000;
  const MAX_DYING_EMBERS = 2400;

  const PALETTE = Object.freeze({
    ringStroke: 'rgba(30, 41, 59, 0.08)',
    crosshairStroke: 'rgba(30, 41, 59, 0.05)',
    dotAlive: '#0f766e',
    dotAliveCore: '#99f6e4',
    dotGhost: '#e11d48',
    dotEmber: '#f43f5e',
    youGold: '#d97706',
    youGoldCore: '#92400e',
    youHalo: 'rgba(217, 119, 6, 0.20)',
    zoomFlash: 'rgba(15, 118, 110, 0.16)'
  });

  class CrowdRenderer {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.onTierChange = options.onTierChange || null;

      this.palette = PALETTE;

      this.dpr = 1;
      this.width = 300;
      this.height = 300;
      this.centerX = 150;
      this.centerY = 150;
      this.fieldRadius = 120;

      this.reducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Active particle SoA buffers (normalized space -1..+1)
      this.px = new Float32Array(MAX_PARTICLES);
      this.py = new Float32Array(MAX_PARTICLES);
      this.vx = new Float32Array(MAX_PARTICLES);
      this.vy = new Float32Array(MAX_PARTICLES);
      this.tx = new Float32Array(MAX_PARTICLES);
      this.ty = new Float32Array(MAX_PARTICLES);
      this.seed = new Float32Array(MAX_PARTICLES);
      this.ghostMix = new Float32Array(MAX_PARTICLES);

      for (let i = 0; i < MAX_PARTICLES; i++) {
        this.seed[i] = ((i * 2654435761) >>> 0) / 4294967296;
      }

      // Eliminated flying embers buffer
      this.ex = new Float32Array(MAX_DYING_EMBERS);
      this.ey = new Float32Array(MAX_DYING_EMBERS);
      this.evx = new Float32Array(MAX_DYING_EMBERS);
      this.evy = new Float32Array(MAX_DYING_EMBERS);
      this.elife = new Float32Array(MAX_DYING_EMBERS);
      this.emberCount = 0;

      // Current logical state
      this.population = 8300000000;
      this.isOneOfOne = false;
      const initial = ScaleTiers.resolveTierState(this.population, false);
      this.currentTier = initial.tier;
      this.activeCount = initial.activeDots;

      // Hover ghost preview ratio (null = inactive, 0..1 = fraction surviving)
      this.hoverSurvivalRatio = null;

      // Camera & zoom pulse state
      this.zoomPulse = 0;
      this.spotlightAge = 0;
      this.timeSec = 0;
      this.rafId = null;
      this.lastFrameMs = 0;

      this.sprites = {};
      this.resize();

      // Seed initial positions cleanly on target spiral
      ScaleTiers.computeTargetsNormalized(
        this.activeCount,
        this.currentTier.index,
        this.tx,
        this.ty
      );
      for (let i = 0; i < this.activeCount; i++) {
        this.px[i] = this.tx[i] * 1.04;
        this.py[i] = this.ty[i] * 1.04;
      }
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const cssW = Math.max(180, Math.floor(rect.width || 400));
      const cssH = Math.max(180, Math.floor(rect.height || 400));
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

      if (this.width !== cssW || this.height !== cssH || this.dpr !== dpr) {
        this.width = cssW;
        this.height = cssH;
        this.dpr = dpr;
        this.canvas.width = Math.round(cssW * dpr);
        this.canvas.height = Math.round(cssH * dpr);
        this.centerX = cssW * 0.5;
        this.centerY = cssH * 0.5;
        this.fieldRadius = Math.min(cssW, cssH) * 0.455;
        this._bakeSprites();
      }
    }

    _makeOffscreen(sizeCss) {
      const c = document.createElement('canvas');
      const px = Math.max(4, Math.ceil(sizeCss * this.dpr));
      c.width = px;
      c.height = px;
      const ctx = c.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
      return { canvas: c, ctx, sizeCss };
    }

    _bakeSprites() {
      if (typeof document === 'undefined') return;
      const p = this.palette;

      // 1. Micro dot (Tier 1 & 2)
      const micro = this._makeOffscreen(8);
      micro.ctx.fillStyle = p.dotAlive;
      micro.ctx.beginPath();
      micro.ctx.arc(4, 4, 1.85, 0, Math.PI * 2);
      micro.ctx.fill();

      // 2. Ghost culled dot (Hover preview)
      const microGhost = this._makeOffscreen(8);
      microGhost.ctx.fillStyle = p.dotGhost;
      microGhost.ctx.globalAlpha = 0.34;
      microGhost.ctx.beginPath();
      microGhost.ctx.arc(4, 4, 1.65, 0, Math.PI * 2);
      microGhost.ctx.fill();

      // 3. Person dot (Tier 3: 1 dot = 1 human)
      const personDot = this._makeOffscreen(12);
      personDot.ctx.fillStyle = p.dotAlive;
      personDot.ctx.beginPath();
      personDot.ctx.arc(6, 6, 2.7, 0, Math.PI * 2);
      personDot.ctx.fill();
      personDot.ctx.fillStyle = p.dotAliveCore;
      personDot.ctx.beginPath();
      personDot.ctx.arc(6, 6, 1.1, 0, Math.PI * 2);
      personDot.ctx.fill();

      // 4. Ember dot (Flying eliminated dots)
      const ember = this._makeOffscreen(8);
      ember.ctx.fillStyle = p.dotEmber;
      ember.ctx.beginPath();
      ember.ctx.arc(4, 4, 1.6, 0, Math.PI * 2);
      ember.ctx.fill();

      // 5. Human Silhouette Pip (Tier 4: < 250 people)
      const pip = this._makeOffscreen(24);
      this._drawHumanSilhouette(pip.ctx, 12, 12, 1.0, p.dotAlive);

      const pipGhost = this._makeOffscreen(24);
      pipGhost.ctx.globalAlpha = 0.25;
      this._drawHumanSilhouette(pipGhost.ctx, 12, 12, 1.0, p.dotGhost);

      const pipYou = this._makeOffscreen(28);
      this._drawHumanSilhouette(pipYou.ctx, 14, 14, 1.15, p.youGold);

      this.sprites = {
        micro,
        microGhost,
        personDot,
        ember,
        pip,
        pipGhost,
        pipYou
      };
    }

    _drawHumanSilhouette(ctx, cx, cy, scale, color) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;

      // Head
      ctx.beginPath();
      ctx.arc(0, -4.6, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Minimalist rounded shoulders + torso pill
      ctx.beginPath();
      ctx.moveTo(-4.1, 4.8);
      ctx.quadraticCurveTo(-4.2, -1.2, 0, -1.2);
      ctx.quadraticCurveTo(4.2, -1.2, 4.1, 4.8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    /**
     * Updates Ghost-Cull Hover Preview: `survivalRatio` in [0, 1] or `null` to clear.
     */
    setHoverPreview(survivalRatio) {
      if (survivalRatio === null || survivalRatio === undefined || this.isOneOfOne) {
        this.hoverSurvivalRatio = null;
      } else {
        this.hoverSurvivalRatio = Math.max(0, Math.min(1, Number(survivalRatio)));
      }
    }

    /**
     * Transitions the crowd visualization to a new population & One-of-One state.
     */
    setPopulation(displayPopulation, isOneOfOne = false) {
      const prevTier = this.currentTier;
      const prevCount = this.activeCount;

      this.population = displayPopulation;
      this.isOneOfOne = Boolean(isOneOfOne || displayPopulation <= 1);
      this.hoverSurvivalRatio = null;

      const resolved = ScaleTiers.resolveTierState(this.population, this.isOneOfOne);
      const nextTier = resolved.tier;
      const nextCount = resolved.activeDots;

      this.currentTier = nextTier;
      this.activeCount = nextCount;

      ScaleTiers.computeTargetsNormalized(nextCount, nextTier.index, this.tx, this.ty);

      if (nextTier.index !== prevTier.index) {
        // Powers-of-Ten Scale Zoom transition!
        const zoomingIn = nextTier.index > prevTier.index;
        this.zoomPulse = 1.0;

        if (!this.reducedMotion) {
          if (zoomingIn) {
            // Spawn surviving embers flying outward from previous periphery while inner cluster bursts outward
            this._spawnEmbersFromRange(Math.min(prevCount, 600), 0, Math.min(prevCount, 600), 1.3);
            for (let i = 0; i < nextCount; i++) {
              // Subdivide outward from tight center core
              const parentIdx = prevCount > 0 ? i % prevCount : 0;
              const startX = i < prevCount ? this.px[parentIdx] * 0.25 : (this.seed[i] - 0.5) * 0.08;
              const startY = i < prevCount ? this.py[parentIdx] * 0.25 : (this.seed[(i + 97) % MAX_PARTICLES] - 0.5) * 0.08;
              this.px[i] = startX;
              this.py[i] = startY;
              this.vx[i] = (this.tx[i] - startX) * 2.4;
              this.vy[i] = (this.ty[i] - startY) * 2.4;
              this.ghostMix[i] = 0;
            }
          } else {
            // Zooming back out (user removed a trait)
            for (let i = prevCount; i < nextCount; i++) {
              const angle = i * ScaleTiers.GOLDEN_ANGLE;
              this.px[i] = Math.cos(angle) * 1.25;
              this.py[i] = Math.sin(angle) * 1.25;
              this.vx[i] = 0;
              this.vy[i] = 0;
              this.ghostMix[i] = 0;
            }
          }
        } else {
          for (let i = 0; i < nextCount; i++) {
            this.px[i] = this.tx[i];
            this.py[i] = this.ty[i];
            this.vx[i] = 0;
            this.vy[i] = 0;
          }
        }

        if (nextTier.index === 5) {
          this.spotlightAge = 0;
        }

        if (typeof this.onTierChange === 'function') {
          this.onTierChange(nextTier, prevTier);
        }
      } else {
        // Same-tier cull or restoration
        if (nextCount < prevCount && !this.reducedMotion) {
          const culled = prevCount - nextCount;
          this._spawnEmbersFromRange(culled, nextCount, prevCount, 1.0);
        } else if (nextCount > prevCount) {
          for (let i = prevCount; i < nextCount; i++) {
            if (this.reducedMotion) {
              this.px[i] = this.tx[i];
              this.py[i] = this.ty[i];
            } else {
              const angle = i * ScaleTiers.GOLDEN_ANGLE;
              this.px[i] = Math.cos(angle) * 1.15;
              this.py[i] = Math.sin(angle) * 1.15;
              this.vx[i] = 0;
              this.vy[i] = 0;
            }
            this.ghostMix[i] = 0;
          }
        }
      }
    }

    _spawnEmbersFromRange(countToSpawn, startIdx, endIdx, speedBoost) {
      const span = Math.max(1, endIdx - startIdx);
      const sampleCount = Math.min(MAX_DYING_EMBERS, countToSpawn, 1500);
      const stride = span / sampleCount;

      this.emberCount = sampleCount;
      for (let k = 0; k < sampleCount; k++) {
        const src = Math.min(MAX_PARTICLES - 1, Math.floor(startIdx + k * stride));
        const x = this.px[src];
        const y = this.py[src];
        const dist = Math.hypot(x, y) || 0.05;
        const nx = x / dist;
        const ny = y / dist;
        const jitter = 0.55 + this.seed[src] * 0.9;
        // Outward scatter + slight orbital tangent curl
        this.ex[k] = x;
        this.ey[k] = y;
        this.evx[k] = (nx * 0.85 - ny * 0.25) * jitter * speedBoost;
        this.evy[k] = (ny * 0.85 + nx * 0.25) * jitter * speedBoost;
        this.elife[k] = 0.65 + this.seed[(src + 31) % MAX_PARTICLES] * 0.35;
      }
    }

    start() {
      if (this.rafId !== null) return;
      this.lastFrameMs = performance.now();
      const tick = (now) => {
        const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameMs) / 1000));
        this.lastFrameMs = now;
        this.update(dt);
        this.render();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    stop() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    update(dt) {
      this.timeSec += dt;

      if (this.zoomPulse > 0) {
        this.zoomPulse = Math.max(0, this.zoomPulse - dt * 1.6);
      }
      if (this.currentTier.index === 5) {
        this.spotlightAge += dt;
      }

      // Critically damped spring integration toward target layout
      const stiffness = this.reducedMotion ? 28 : 14.0;
      const damping = Math.exp(-7.5 * dt);
      const count = this.activeCount;

      const survivorCutoff =
        this.hoverSurvivalRatio !== null
          ? Math.max(1, Math.round(count * this.hoverSurvivalRatio))
          : count;

      const ghostLerp = Math.min(1, dt * 14);

      for (let i = 0; i < count; i++) {
        const ax = (this.tx[i] - this.px[i]) * stiffness;
        const ay = (this.ty[i] - this.py[i]) * stiffness;
        this.vx[i] = (this.vx[i] + ax * dt) * damping;
        this.vy[i] = (this.vy[i] + ay * dt) * damping;
        this.px[i] += this.vx[i] * dt;
        this.py[i] += this.vy[i] * dt;

        const targetGhost = i >= survivorCutoff ? 1 : 0;
        this.ghostMix[i] += (targetGhost - this.ghostMix[i]) * ghostLerp;
      }

      // Update dying embers
      if (this.emberCount > 0) {
        let aliveAny = false;
        for (let k = 0; k < this.emberCount; k++) {
          if (this.elife[k] > 0) {
            this.ex[k] += this.evx[k] * dt;
            this.ey[k] += this.evy[k] * dt;
            this.elife[k] -= dt * 1.45;
            if (this.elife[k] > 0) aliveAny = true;
          }
        }
        if (!aliveAny) this.emberCount = 0;
      }
    }

    render() {
      const ctx = this.ctx;
      if (!ctx) return;

      ctx.save();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);

      const cx = this.centerX;
      const cy = this.centerY;
      const R = this.fieldRadius;
      const p = this.palette;

      // 1. Observatory polar reticle rings
      ctx.strokeStyle = p.ringStroke;
      ctx.lineWidth = 1;
      const ringRadii = [0.33, 0.66, 0.96];
      for (let rIdx = 0; rIdx < ringRadii.length; rIdx++) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * ringRadii[rIdx], 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = p.crosshairStroke;
      ctx.beginPath();
      ctx.moveTo(cx - R * 1.02, cy);
      ctx.lineTo(cx + R * 1.02, cy);
      ctx.moveTo(cx, cy - R * 1.02);
      ctx.lineTo(cx, cy + R * 1.02);
      ctx.stroke();

      // 2. Powers-of-Ten Scale Zoom shockwave ring
      if (this.zoomPulse > 0.01 && !this.reducedMotion) {
        const waveR = R * (1.08 - this.zoomPulse * 0.85);
        ctx.save();
        ctx.strokeStyle = p.zoomFlash;
        ctx.lineWidth = 2 + this.zoomPulse * 6;
        ctx.beginPath();
        ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Eliminated flying embers
      if (this.emberCount > 0 && this.sprites.ember) {
        const emberCanvas = this.sprites.ember.canvas;
        const half = this.sprites.ember.sizeCss * 0.5;
        for (let k = 0; k < this.emberCount; k++) {
          const life = this.elife[k];
          if (life <= 0) continue;
          const sx = cx + this.ex[k] * R - half;
          const sy = cy + this.ey[k] * R - half;
          ctx.globalAlpha = Math.min(0.85, life);
          ctx.drawImage(emberCanvas, sx, sy, this.sprites.ember.sizeCss, this.sprites.ember.sizeCss);
        }
        ctx.globalAlpha = 1;
      }

      const mode = this.currentTier.renderMode;
      const count = this.activeCount;

      // 4. Tier 5: Singular Spotlight ("You · 1 of 1")
      if (mode === 'spotlight') {
        const pulse = this.reducedMotion ? 0 : Math.sin(this.timeSec * 2.6) * 0.5 + 0.5;
        const haloOuter = 54 + pulse * 16;

        const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, haloOuter);
        grad.addColorStop(0, p.youHalo);
        grad.addColorStop(0.55, 'rgba(251, 191, 36, 0.08)');
        grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, haloOuter, 0, Math.PI * 2);
        ctx.fill();

        // Crisp concentric specimen rings
        ctx.strokeStyle = p.youGold;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 26 + pulse * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        this._drawHumanSilhouette(ctx, cx, cy, 1.85, p.youGold);

        ctx.fillStyle = p.youGold;
        ctx.font = '700 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('YOU · ONE OF ONE', cx, cy + 40);

        ctx.restore();
        return;
      }

      // 5. Tier 4: Minimalist Human Silhouettes (< 250 people)
      if (mode === 'silhouette' && this.sprites.pip) {
        const pipSize = count <= 25 ? 24 : count <= 90 ? 20 : 16;
        const scaleRatio = pipSize / 24;
        const half = pipSize * 0.5;

        for (let i = count - 1; i >= 0; i--) {
          const breathe = this.reducedMotion
            ? 0
            : Math.sin(this.timeSec * 2.1 + this.seed[i] * Math.PI * 2) * 1.4;
          const sx = cx + this.px[i] * R;
          const sy = cy + this.py[i] * R + breathe;

          if (i === 0) {
            // Highlight "You" subtly at the center of the remaining room
            const youSize = Math.round(pipSize * 1.18);
            ctx.drawImage(
              this.sprites.pipYou.canvas,
              sx - youSize * 0.5,
              sy - youSize * 0.5,
              youSize,
              youSize
            );
          } else if (this.ghostMix[i] > 0.5) {
            ctx.drawImage(this.sprites.pipGhost.canvas, sx - half, sy - half, pipSize, pipSize);
          } else {
            ctx.globalAlpha = 1 - this.ghostMix[i] * 0.72;
            ctx.drawImage(
              this.sprites.pip.canvas,
              sx - half,
              sy - half,
              24 * scaleRatio,
              24 * scaleRatio
            );
            ctx.globalAlpha = 1;
          }
        }

        ctx.restore();
        return;
      }

      // 6. Tiers 1..3: High-density particle field (up to 9,999 dots)
      const aliveSprite = mode === 'person_dot' ? this.sprites.personDot : this.sprites.micro;
      const ghostSprite = this.sprites.microGhost;

      if (aliveSprite && ghostSprite) {
        const aliveSize = aliveSprite.sizeCss;
        const aliveHalf = aliveSize * 0.5;
        const ghostSize = ghostSprite.sizeCss;
        const ghostHalf = ghostSize * 0.5;
        const driftAmp = this.reducedMotion ? 0 : mode === 'person_dot' ? 0.9 : 0.45;

        for (let i = count - 1; i >= 1; i--) {
          const drift = driftAmp
            ? Math.sin(this.timeSec * 1.5 + this.seed[i] * 6.283) * driftAmp
            : 0;
          const sx = cx + this.px[i] * R;
          const sy = cy + this.py[i] * R + drift;

          if (this.ghostMix[i] > 0.45) {
            ctx.drawImage(ghostSprite.canvas, sx - ghostHalf, sy - ghostHalf, ghostSize, ghostSize);
          } else {
            ctx.drawImage(aliveSprite.canvas, sx - aliveHalf, sy - aliveHalf, aliveSize, aliveSize);
          }
        }

        // Draw index 0 ("You") as a subtle warm golden anchor at center
        const ux = cx + this.px[0] * R;
        const uy = cy + this.py[0] * R;
        ctx.fillStyle = p.youGold;
        ctx.beginPath();
        ctx.arc(ux, uy, mode === 'person_dot' ? 3.5 : 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  return CrowdRenderer;
});
