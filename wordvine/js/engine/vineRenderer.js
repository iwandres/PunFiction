/**
 * Word Vine — Gentle Botanical Canvas Renderer
 * Renders a soft, nature-inspired, long and flowy climbing vine at native HiDPI:
 * - 3 Gentle Botanical Themes (Meadow & Sage, Sunlit Conservatory, Willow & Sakura)
 * - Soft Watercolor / Herbarium Atmosphere & Drifting Botanical Spores / Petals
 * - Long, Continuous S-Curve Sinuous Stem with Twining Tendrils & Breeze Sway
 * - Delicate Curling Spiral Tendrils, Midrib Leaves & Wildflower Blooms
 */
(function (root) {
  'use strict';

  const THEMES = [
    {
      id: 0,
      name: 'Bioluminescent Grove',
      subtitle: 'Moonlit Fern Grotto to Starry Canopy',
      cssClass: 'theme-biolum',
      isDark: true,
      bgLow: [14, 29, 31],
      bgMid: [18, 40, 45],
      bgHigh: [12, 25, 34],
      stemZones: {
        1: { main: '#38B29A', secondary: '#68D391', vein: '#B2F5EA', glow: 'rgba(94, 234, 212, 0.34)' },
        2: { main: '#48BB78', secondary: '#D69E2E', vein: '#FEFCBF', glow: 'rgba(246, 224, 94, 0.28)' },
        3: { main: '#4FD1C5', secondary: '#9F7AEA', vein: '#FBB6CE', glow: 'rgba(183, 148, 244, 0.36)' }
      },
      leafColor: '#2C7A7B',
      leafHighlight: '#81E6D9',
      flowerPrimary: '#F687B3',
      flowerSecondary: '#B794F4',
      flowerCenter: '#9DECF9',
      particleColor: '#81E6D9',
      quietGutterColor: 'rgba(14, 30, 32, 0.22)'
    },
    {
      id: 1,
      name: 'Meadow & Sage',
      subtitle: 'Sunlit Garden to Airy Canopy',
      cssClass: 'theme-meadow',
      isDark: false,
      bgLow: [244, 241, 231],
      bgMid: [232, 240, 229],
      bgHigh: [219, 233, 225],
      stemZones: {
        1: { main: '#4A7C59', secondary: '#76A682', vein: '#B5DFC4', glow: 'rgba(74, 124, 89, 0.14)' },
        2: { main: '#587850', secondary: '#8C7A5B', vein: '#C9DCB3', glow: 'rgba(88, 120, 80, 0.15)' },
        3: { main: '#3B6E52', secondary: '#639677', vein: '#BCE3C8', glow: 'rgba(59, 110, 82, 0.18)' }
      },
      leafColor: '#5D8E6B',
      leafHighlight: '#9DC5A6',
      flowerPrimary: '#E5989B',
      flowerSecondary: '#D88286',
      flowerCenter: '#F2C572',
      particleColor: '#8FB996',
      quietGutterColor: 'rgba(250, 248, 242, 0.25)'
    },
    {
      id: 2,
      name: 'Sunlit Conservatory',
      subtitle: 'Warm Parchment to Golden Glasshouse',
      cssClass: 'theme-conservatory',
      isDark: false,
      bgLow: [248, 242, 230],
      bgMid: [241, 231, 212],
      bgHigh: [228, 237, 232],
      stemZones: {
        1: { main: '#456950', secondary: '#8F754F', vein: '#B7D3B0', glow: 'rgba(69, 105, 80, 0.14)' },
        2: { main: '#6E6A44', secondary: '#9C7A4C', vein: '#E2D9A8', glow: 'rgba(110, 106, 68, 0.16)' },
        3: { main: '#3D6B52', secondary: '#699474', vein: '#C2E5CD', glow: 'rgba(61, 107, 82, 0.18)' }
      },
      leafColor: '#588163',
      leafHighlight: '#A3C49E',
      flowerPrimary: '#E8A855',
      flowerSecondary: '#D98A3C',
      flowerCenter: '#7A4E2D',
      particleColor: '#D4B475',
      quietGutterColor: 'rgba(252, 248, 238, 0.24)'
    },
    {
      id: 3,
      name: 'Willow & Sakura',
      subtitle: 'Soft Washi Scroll to Blossom Mist',
      cssClass: 'theme-ukiyoe',
      isDark: false,
      bgLow: [248, 243, 236],
      bgMid: [242, 233, 227],
      bgHigh: [233, 226, 235],
      stemZones: {
        1: { main: '#526656', secondary: '#7B907E', vein: '#C4D6C4', glow: 'rgba(82, 102, 86, 0.14)' },
        2: { main: '#645D53', secondary: '#8E7F71', vein: '#D9C5B2', glow: 'rgba(100, 93, 83, 0.15)' },
        3: { main: '#4D6459', secondary: '#7E8F85', vein: '#E8B8C6', glow: 'rgba(77, 100, 89, 0.16)' }
      },
      leafColor: '#677D6B',
      leafHighlight: '#A5B8A8',
      flowerPrimary: '#F2BAC9',
      flowerSecondary: '#E598AF',
      flowerCenter: '#D96B7E',
      particleColor: '#E8A5B8',
      quietGutterColor: 'rgba(250, 246, 240, 0.25)'
    }
  ];

  class VineRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.themeId = 0;

      // Ambient peripheral pollen/petals & burst particles
      this.ambientParticles = [];
      this.burstParticles = [];
      // Historical world anchors along the climbed vine
      this.stemAnchors = [];
      this.graftCollars = [];

      this.resize();
      this.initAmbientParticles();
      window.addEventListener('resize', () => this.resize());
    }

    setTheme(themeId) {
      this.themeId = ((themeId % THEMES.length) + THEMES.length) % THEMES.length;
      document.body.classList.remove('theme-biolum', 'theme-meadow', 'theme-conservatory', 'theme-ukiyoe');
      document.body.classList.add(THEMES[this.themeId].cssClass);
      return THEMES[this.themeId];
    }

    getTheme() {
      return THEMES[this.themeId];
    }

    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 3);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
    }

    initAmbientParticles() {
      this.ambientParticles = [];
      for (let i = 0; i < 36; i++) {
        const side = i % 2 === 0 ? 0 : 1;
        const xNorm = side === 0 ? Math.random() * 0.34 : 0.66 + Math.random() * 0.34;
        this.ambientParticles.push({
          xNorm,
          yWorld: Math.random() * 2000,
          radius: 2 + Math.random() * 3.2,
          alpha: 0.22 + Math.random() * 0.42,
          phase: Math.random() * Math.PI * 2,
          speedFactor: 0.25 + Math.random() * 0.55
        });
      }
    }

    /**
     * Resets the vine geometry for a new run with a long, graceful S-curve stem
     */
    resetVine(initialYVine = 360, startZone = 1) {
      this.stemAnchors = [];
      this.burstParticles = [];
      this.graftCollars = [];

      // Seed 14 long, flowing S-curve anchors from world Y = -340 up to initialYVine
      const steps = 14;
      for (let i = 0; i <= steps; i++) {
        const y = -340 + ((initialYVine + 340) * i) / steps;
        // Smooth, graceful sinusoidal wave that tapers toward 0 at the active tip
        const taper = i === steps ? 0.25 : 1;
        const sway = Math.sin(i * 0.68) * 28 * taper;
        this.stemAnchors.push({
          yWorld: y,
          xOffset: sway,
          zoneId: startZone,
          hasLeafLeft: i % 2 === 0,
          hasLeafRight: i % 2 === 1,
          hasTendril: i % 3 === 1,
          tendrilSide: i % 2 === 0 ? 1 : -1,
          isBloom: false,
          bloomScale: 1,
          word: i === steps ? 'ROOT' : null
        });
      }
    }

    /**
     * Records a completed node anchor on the stem and triggers soft botanical petal/pollen drift
     */
    recordCompletedNode({
      yWorld,
      zoneId,
      isTripleBloom,
      triggeredGraftCollar,
      word,
      choiceSide
    }) {
      const idx = this.stemAnchors.length;
      const waveOffset = Math.sin(idx * 0.72) * 24 + (choiceSide === 0 ? -9 : 9);
      this.stemAnchors.push({
        yWorld,
        xOffset: waveOffset,
        zoneId,
        hasLeafLeft: true,
        hasLeafRight: true,
        hasTendril: idx % 2 === 0,
        tendrilSide: choiceSide === 0 ? 1 : -1,
        isBloom: Boolean(isTripleBloom),
        bloomTimestamp: performance.now(),
        word
      });

      if (triggeredGraftCollar) {
        this.graftCollars.push({
          yWorld,
          zoneId,
          timestamp: performance.now()
        });
      }

      // Spawn soft floating pollen / blossom petals
      const theme = this.getTheme();
      const count = isTripleBloom ? 18 : 7;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (isTripleBloom ? 95 : 52) * (0.4 + Math.random() * 0.7);
        this.burstParticles.push({
          xOffset: waveOffset,
          yWorld,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isTripleBloom ? 3.2 + Math.random() * 3.2 : 2 + Math.random() * 2,
          color: isTripleBloom ? theme.flowerPrimary : theme.particleColor,
          life: 1.0,
          decay: isTripleBloom ? 0.85 + Math.random() * 0.4 : 1.3 + Math.random() * 0.5
        });
      }
    }

    /**
     * Spawns soft dry-leaf particles when a decoy word snips the stem
     */
    triggerLexicalSnapBurst(yWorld, choiceSide) {
      const dir = choiceSide === 0 ? -1 : 1;
      for (let i = 0; i < 16; i++) {
        const angle = (dir === -1 ? Math.PI * 0.75 : Math.PI * 0.25) + (Math.random() - 0.5) * 1.1;
        const speed = 45 + Math.random() * 95;
        this.burstParticles.push({
          xOffset: dir * 24,
          yWorld: yWorld + 18,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.2 + Math.random() * 3,
          color: i % 2 === 0 ? '#C87D65' : '#8C7A6B',
          life: 1.0,
          decay: 1.1 + Math.random() * 0.4
        });
      }
    }

    /**
     * Converts normalized world Y coordinate into screen Y pixel coordinate
     */
    worldToScreenY(yWorld, yCam) {
      const normY = (yWorld - yCam) / 1000;
      return this.height * (1 - normY);
    }

    /**
     * Main high-definition frame render entry point
     */
    render(simState, dtMs, risingSapNextZone = 0, showGhostThirdNode = false) {
      const ctx = this.ctx;
      const theme = this.getTheme();
      const nowMs = performance.now();

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      const vCam = simState ? simState.vCam : 45;
      const velocityDesat = Math.max(0, Math.min(1, (vCam - 180) / 100));

      // 1. Draw Soft Herbarium / Garden Background
      this.drawBackground(ctx, theme, simState, velocityDesat, nowMs);

      // 2. Draw Peripheral Drifting Pollen / Petals
      this.drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs);

      // 3. Draw the Long, Flowy Climbing Vine, Curling Tendrils, Leaves & Wildflower Blooms
      if (simState) {
        this.drawClimbingVine(ctx, theme, simState, risingSapNextZone, nowMs, showGhostThirdNode);
        this.drawBurstParticles(ctx, simState, dtMs);
        this.drawDangerVignette(ctx, theme, simState, nowMs);
      }

      ctx.restore();
    }

    drawBackground(ctx, theme, simState, velocityDesat, nowMs) {
      const yCam = simState ? simState.yCam : 0;
      const parallaxY = yCam * 0.2;
      const altitudeBlend = Math.max(0, Math.min(1, parallaxY / 900));

      const lerpRgb = (c1, c2, t) => [
        Math.round(c1[0] + (c2[0] - c1[0]) * t),
        Math.round(c1[1] + (c2[1] - c1[1]) * t),
        Math.round(c1[2] + (c2[2] - c1[2]) * t)
      ];

      const topColor =
        altitudeBlend < 0.5
          ? lerpRgb(theme.bgMid, theme.bgHigh, altitudeBlend * 2)
          : theme.bgHigh;
      const bottomColor =
        altitudeBlend < 0.5
          ? lerpRgb(theme.bgLow, theme.bgMid, altitudeBlend * 2)
          : lerpRgb(theme.bgMid, theme.bgHigh, (altitudeBlend - 0.5) * 2);

      const grad = ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(
        0,
        `rgb(${topColor[0]}, ${topColor[1]}, ${topColor[2]})`
      );
      grad.addColorStop(
        1,
        `rgb(${bottomColor[0]}, ${bottomColor[1]}, ${bottomColor[2]})`
      );

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Soft radial glow in the center of the garden (moonlit seafoam in Bioluminescent Grove, sunlit cream in daylight themes)
      const sunGrad = ctx.createRadialGradient(
        this.width * 0.5,
        this.height * 0.38,
        20,
        this.width * 0.5,
        this.height * 0.45,
        Math.max(this.width, this.height) * 0.65
      );
      if (theme.isDark) {
        sunGrad.addColorStop(0, 'rgba(94, 234, 212, 0.11)');
        sunGrad.addColorStop(1, 'rgba(14, 30, 32, 0)');
      } else {
        sunGrad.addColorStop(0, 'rgba(255, 253, 246, 0.52)');
        sunGrad.addColorStop(1, 'rgba(255, 253, 246, 0)');
      }
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Delicate out-of-focus background botanical stems in far periphery (0.15x parallax)
      ctx.save();
      ctx.strokeStyle = theme.isDark ? 'rgba(94, 234, 212, 0.06)' : 'rgba(90, 128, 98, 0.07)';
      ctx.lineWidth = 3;
      const bgOffset = (parallaxY * 0.5) % 320;
      for (let side of [-1, 1]) {
        const baseX = side === -1 ? this.width * 0.12 : this.width * 0.88;
        ctx.beginPath();
        for (let y = -100; y <= this.height + 100; y += 24) {
          const x = baseX + Math.sin((y + bgOffset) * 0.012 + side) * 26;
          if (y === -100) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs) {
      const yCam = simState ? simState.yCam : 0;

      this.ambientParticles.forEach((p, idx) => {
        const px = p.xNorm * this.width + Math.sin(nowMs * 0.0009 + p.phase) * 16;
        const py = ((p.yWorld - yCam * 0.2 * p.speedFactor) % this.height + this.height) % this.height;

        ctx.save();
        ctx.translate(px, py);
        if (theme.isDark) {
          // Softly glowing bioluminescent firefly spores
          const pulse = 0.45 + 0.55 * Math.sin(nowMs * 0.0024 + p.phase);
          ctx.fillStyle = idx % 3 === 0 ? '#F6E05E' : theme.particleColor;
          ctx.shadowColor = idx % 3 === 0 ? '#F6E05E' : theme.particleColor;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = p.alpha * pulse;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 0.95, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.rotate(nowMs * 0.0008 + idx);
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(nowMs * 0.002 + p.phase));
          ctx.beginPath();
          // Soft oval botanical petal / seed spore
          ctx.ellipse(0, 0, p.radius * 1.4, p.radius * 0.85, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    }

    drawClimbingVine(ctx, theme, simState, risingSapNextZone, nowMs, showGhostThirdNode = false) {
      const centerX = this.width * 0.5;
      const yCam = simState.yCam;
      const yVine = simState.yVine;

      // Include anchors well below the bottom of the screen so the vine is always long and unbroken
      const visibleAnchors = this.stemAnchors.filter((a) => a.yWorld >= yCam - 360);

      // Build flowing spline points with gentle living breeze sway
      const points = visibleAnchors.map((a, idx) => {
        const breeze = Math.sin(nowMs * 0.0014 + a.yWorld * 0.007 + idx * 0.3) * 5.5;
        return {
          x: centerX + a.xOffset + breeze,
          y: this.worldToScreenY(a.yWorld, yCam),
          yWorld: a.yWorld,
          zoneId: a.zoneId,
          anchor: a
        };
      });

      // Active growing tip point (gently sways slightly less so the word fork stays steady)
      const tipScreenY = this.worldToScreenY(yVine, yCam);
      const tipBreeze = Math.sin(nowMs * 0.0014 + yVine * 0.007) * 2.5;
      points.push({
        x: centerX + tipBreeze,
        y: tipScreenY,
        yWorld: yVine,
        zoneId: simState.zoneId,
        anchor: null
      });

      if (points.length < 2) return;

      const activePalette = theme.stemZones[simState.zoneId] || theme.stemZones[1];

      // 1. Draw Long, Smoothly Flowing Continuous Vine Stem & Twining Companion Tendril
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = activePalette.glow;
      ctx.shadowBlur = 10;

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const pPrev = points[Math.max(0, i - 1)];
        const pNext = points[Math.min(points.length - 1, i + 2)];
        const segPalette = theme.stemZones[p1.zoneId] || activePalette;

        // Catmull-Rom to Cubic Bezier control points for ultra-smooth, long flowy curves
        const cp1x = p0.x + (p1.x - pPrev.x) * 0.22;
        const cp1y = p0.y + (p1.y - pPrev.y) * 0.22;
        const cp2x = p1.x - (pNext.x - p0.x) * 0.22;
        const cp2y = p1.y - (pNext.y - p0.y) * 0.22;

        // Delicate twining secondary vine tendril that wraps around the main stem
        const twineWave = (i % 2 === 0 ? 1 : -1) * 11;
        ctx.strokeStyle = segPalette.secondary;
        ctx.lineWidth = 3.2;
        ctx.globalAlpha = 0.68;
        ctx.beginPath();
        ctx.moveTo(p0.x + twineWave * 0.3, p0.y);
        ctx.bezierCurveTo(
          cp1x + twineWave,
          cp1y,
          cp2x - twineWave,
          cp2y,
          p1.x - twineWave * 0.3,
          p1.y
        );
        ctx.stroke();

        // Primary supple botanical vine stem
        ctx.globalAlpha = 1;
        ctx.strokeStyle =
          simState.status === 'SNIPPED' && i === points.length - 2
            ? '#9C7A6B'
            : segPalette.main;
        ctx.lineWidth = 7.5;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
        ctx.stroke();

        // Soft inner sunlit sap vein
        const sapPalette =
          risingSapNextZone > 0 && theme.stemZones[risingSapNextZone]
            ? theme.stemZones[risingSapNextZone]
            : null;
        ctx.strokeStyle = sapPalette ? sapPalette.main : segPalette.vein;
        ctx.lineWidth = 2.0;
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // 2. Draw Curling Spiral Tendrils, Botanical Leaves & Wildflower Blooms along the Vine
      points.forEach((pt, idx) => {
        if (!pt.anchor) return;
        const swayAngle = Math.sin(nowMs * 0.0018 + idx * 0.8) * 0.09;
        if (pt.anchor.hasTendril) {
          this.drawCurlingTendril(
            ctx,
            activePalette.secondary,
            pt.x,
            pt.y,
            pt.anchor.tendrilSide || 1,
            swayAngle
          );
        }
        if (pt.anchor.hasLeafLeft) {
          this.drawBotanicalLeaf(ctx, theme, pt.x - 4, pt.y, -1, swayAngle);
        }
        if (pt.anchor.hasLeafRight) {
          this.drawBotanicalLeaf(ctx, theme, pt.x + 4, pt.y, 1, -swayAngle);
        }
        if (pt.anchor.isBloom) {
          const ageMs = nowMs - (pt.anchor.bloomTimestamp || 0);
          const scale = Math.min(1, ageMs / 320);
          this.drawTripleBloomFlower(ctx, theme, pt.x, pt.y, scale, nowMs);
        }
      });

      // 3. Draw Organic Botanical Leaf Rings at Zone Transitions (instead of boxy HUD badges)
      this.graftCollars.forEach((collar) => {
        if (collar.yWorld < yCam - 100 || collar.yWorld > yCam + 1100) return;
        const cy = this.worldToScreenY(collar.yWorld, yCam);
        this.drawBotanicalLeaf(ctx, theme, centerX - 8, cy, -1, -0.2);
        this.drawBotanicalLeaf(ctx, theme, centerX + 8, cy, 1, 0.2);
        this.drawTripleBloomFlower(ctx, theme, centerX, cy, 0.85, nowMs);
      });

      // 4. Draw Long, Sweeping S-Curve Fork Tendrils Cradling the Left & Right Candidate Nodes
      const tipX = points[points.length - 1].x;
      const tipY = tipScreenY;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 4.2;
      ctx.strokeStyle =
        simState.status === 'SNIPPED' ? '#9C7A6B' : activePalette.main;

      // Left sweeping S-curve tendril
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.bezierCurveTo(
        tipX - 18,
        tipY - 28,
        tipX - 68,
        tipY - 22,
        tipX - 96,
        tipY - 56
      );
      ctx.stroke();

      // Right sweeping S-curve tendril
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.bezierCurveTo(
        tipX + 18,
        tipY - 28,
        tipX + 68,
        tipY - 22,
        tipX + 96,
        tipY - 56
      );
      ctx.stroke();

      // Small cradle leaves at the tips of the left & right fork tendrils
      this.drawBotanicalLeaf(ctx, theme, tipX - 92, tipY - 52, -1, 0.15);
      this.drawBotanicalLeaf(ctx, theme, tipX + 92, tipY - 52, 1, -0.15);

      // Subtle 3rd Node Upper Tendril (Drawn ONLY on Step 1 of a 3-Part Compound)
      if (showGhostThirdNode) {
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = activePalette.secondary;
        ctx.globalAlpha = 0.42;

        // Left fork -> Subtle 3rd node bud above
        ctx.beginPath();
        ctx.moveTo(tipX - 72, tipY - 66);
        ctx.bezierCurveTo(tipX - 36, tipY - 94, tipX - 12, tipY - 102, tipX, tipY - 116);
        ctx.stroke();

        // Right fork -> Subtle 3rd node bud above
        ctx.beginPath();
        ctx.moveTo(tipX + 72, tipY - 66);
        ctx.bezierCurveTo(tipX + 36, tipY - 94, tipX + 12, tipY - 102, tipX, tipY - 116);
        ctx.stroke();

        // Subtle unopened botanical bud ring
        ctx.setLineDash([]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(tipX, tipY - 116, 4.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Soft botanical node bud at active stem tip
      ctx.fillStyle = simState.status === 'SNIPPED' ? '#C87D65' : activePalette.secondary;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /**
     * Draws a delicate curling spiral vine tendril extending from a stem node
     */
    drawCurlingTendril(ctx, color, x, y, side, swayAngle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(swayAngle * 1.4);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.58;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        side * 16,
        -8,
        side * 34,
        -18,
        side * 30,
        -4
      );
      ctx.bezierCurveTo(
        side * 26,
        6,
        side * 16,
        -2,
        side * 22,
        -7
      );
      ctx.stroke();
      ctx.restore();
    }

    /**
     * Draws a soft tapered botanical leaf with a central midrib vein
     */
    drawBotanicalLeaf(ctx, theme, x, y, side, swayAngle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(side * 0.52 + swayAngle);

      ctx.fillStyle = theme.leafColor;
      ctx.strokeStyle = theme.leafHighlight;
      ctx.lineWidth = 1.1;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * 15, -11, side * 30, -3);
      ctx.quadraticCurveTo(side * 15, 9, 0, 0);
      ctx.fill();
      ctx.stroke();

      // Central leaf midrib vein
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * 14, -2, side * 24, -2.5);
      ctx.stroke();

      ctx.restore();
    }

    drawTripleBloomFlower(ctx, theme, x, y, scale, nowMs) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.rotate(nowMs * 0.0003);

      const petals = 6;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / petals);
        ctx.fillStyle = i % 2 === 0 ? theme.flowerPrimary : theme.flowerSecondary;
        ctx.beginPath();
        ctx.ellipse(0, -11, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = theme.flowerCenter;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawBurstParticles(ctx, simState, dtMs) {
      const dtSec = Math.max(0.001, dtMs / 1000);
      const centerX = this.width * 0.5;
      const yCam = simState.yCam;

      for (let i = this.burstParticles.length - 1; i >= 0; i--) {
        const p = this.burstParticles[i];
        p.xOffset += p.vx * dtSec;
        p.yWorld += p.vy * dtSec;
        p.life -= p.decay * dtSec;

        if (p.life <= 0) {
          this.burstParticles.splice(i, 1);
          continue;
        }

        const sx = centerX + p.xOffset;
        const sy = this.worldToScreenY(p.yWorld, yCam);

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life * 0.85);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    drawDangerVignette(ctx, theme, simState, nowMs) {
      const leadUnits = simState.yVine - simState.yCam;
      if (leadUnits > 150 && simState.status === 'PLAYING') return;

      const urgency =
        simState.status === 'OUTRUN'
          ? 1.0
          : Math.max(0, Math.min(1, 1 - leadUnits / 150));
      const pulse = 0.65 + 0.35 * Math.sin(nowMs * (0.008 + urgency * 0.01));

      ctx.save();
      const grad = ctx.createRadialGradient(
        this.width * 0.5,
        this.height * 0.45,
        this.height * 0.3,
        this.width * 0.5,
        this.height * 0.5,
        this.height * 0.88
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(180, 82, 62, ${urgency * 0.38 * pulse})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
  }

  root.WordVineThemes = THEMES;
  root.WordVineRenderer = VineRenderer;
})(typeof self !== 'undefined' ? self : this);
