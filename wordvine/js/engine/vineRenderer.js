/**
 * Word Vine — High-Definition Procedural Botanical Canvas Renderer
 * Renders at native HiDPI (devicePixelRatio up to 3x) with:
 * - 3 Rotating Botanical Themes (Midnight Bioluminescence, Sunlit Conservatory, Ukiyo-e Ink & Sakura)
 * - 0.2x Slow-Scroll Parallax Architecture & Mountain Layers
 * - "Quiet Center" 40% Reading Lane Gutter & >180 u/s Velocity Desaturation
 * - Procedural Catmull-Rom / Cubic Bézier Climbing Stem with Braided Bark & Sumi-e Brushstrokes
 * - Rising Sap Center Vein Bleed (2 nodes before Zone Shift) & Glowing Graft Collars
 * - Blooming Flowers (Neon Orchids, Golden Marigolds, Pink Sakura) & Particle Systems
 * - Danger Vignette Creeping Roots when (Y_vine - Y_cam) <= 150 units
 */
(function (root) {
  'use strict';

  const THEMES = [
    {
      id: 0,
      name: 'Midnight Bioluminescence',
      subtitle: 'Cavern to Starlit Canopy',
      cssClass: 'theme-biolum',
      bgLow: [10, 15, 36],
      bgMid: [7, 19, 48],
      bgHigh: [4, 8, 22],
      stemZones: {
        1: { main: '#00F5D4', secondary: '#0A9396', vein: '#72EFDD', glow: 'rgba(0, 245, 212, 0.48)' },
        2: { main: '#FFB703', secondary: '#CA6702', vein: '#FFE169', glow: 'rgba(255, 183, 3, 0.45)' },
        3: { main: '#E0AAFF', secondary: '#9D4EDD', vein: '#FF9E00', glow: 'rgba(199, 125, 255, 0.55)' }
      },
      leafColor: '#00BBF9',
      leafHighlight: '#90F1EF',
      flowerPrimary: '#F72585',
      flowerSecondary: '#B5179E',
      flowerCenter: '#4CC9F0',
      particleColor: '#72EFDD',
      quietGutterColor: 'rgba(5, 9, 22, 0.52)'
    },
    {
      id: 1,
      name: 'Sunlit Conservatory',
      subtitle: 'Victorian Glasshouse to Open Sky',
      cssClass: 'theme-conservatory',
      bgLow: [42, 58, 49],
      bgMid: [184, 125, 75],
      bgHigh: [48, 96, 130],
      stemZones: {
        1: { main: '#2D6A4F', secondary: '#B87333', vein: '#74C69D', glow: 'rgba(82, 183, 136, 0.35)' },
        2: { main: '#D97706', secondary: '#92400E', vein: '#FDE68A', glow: 'rgba(245, 158, 11, 0.42)' },
        3: { main: '#10B981', secondary: '#047857', vein: '#A7F3D0', glow: 'rgba(16, 185, 129, 0.48)' }
      },
      leafColor: '#40916C',
      leafHighlight: '#95D5B2',
      flowerPrimary: '#FFB703',
      flowerSecondary: '#FB8500',
      flowerCenter: '#7F4F24',
      particleColor: '#FFF3B0',
      quietGutterColor: 'rgba(20, 28, 23, 0.34)'
    },
    {
      id: 2,
      name: 'Ukiyo-e Ink & Sakura',
      subtitle: 'Sumi-e Scroll to Twilight Mountain',
      cssClass: 'theme-ukiyoe',
      bgLow: [242, 234, 221],
      bgMid: [219, 196, 182],
      bgHigh: [56, 36, 68],
      stemZones: {
        1: { main: '#1C1917', secondary: '#44403C', vein: '#E11D48', glow: 'rgba(225, 29, 72, 0.25)' },
        2: { main: '#9A3412', secondary: '#431407', vein: '#F97316', glow: 'rgba(234, 88, 12, 0.32)' },
        3: { main: '#831843', secondary: '#3B0764', vein: '#F472B6', glow: 'rgba(244, 114, 182, 0.45)' }
      },
      leafColor: '#292524',
      leafHighlight: '#78716C',
      flowerPrimary: '#FFCAD4',
      flowerSecondary: '#F472B6',
      flowerCenter: '#D62828',
      particleColor: '#FDA4AF',
      quietGutterColor: 'rgba(245, 239, 230, 0.38)'
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

      // Ambient peripheral particles & burst splatters
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
      document.body.classList.remove('theme-biolum', 'theme-conservatory', 'theme-ukiyoe');
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
      for (let i = 0; i < 48; i++) {
        // Place particles strictly in the outer 30% left/right lanes to respect the "Quiet Center" 40% gutter
        const side = i % 2 === 0 ? 0 : 1;
        const xNorm = side === 0 ? Math.random() * 0.28 : 0.72 + Math.random() * 0.28;
        this.ambientParticles.push({
          xNorm,
          yWorld: Math.random() * 2000,
          radius: 1.8 + Math.random() * 3.5,
          alpha: 0.25 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          speedFactor: 0.3 + Math.random() * 0.7
        });
      }
    }

    /**
     * Resets the vine geometry for a new run
     */
    resetVine(initialYVine = 360, startZone = 1) {
      this.stemAnchors = [];
      this.burstParticles = [];
      this.graftCollars = [];

      // Seed root anchors from world Y = -120 up to initialYVine
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const y = -120 + ((initialYVine + 120) * i) / steps;
        const sway = Math.sin(i * 1.1) * 14;
        this.stemAnchors.push({
          yWorld: y,
          xOffset: sway,
          zoneId: startZone,
          hasLeafLeft: i % 2 === 0,
          hasLeafRight: i % 2 === 1,
          isBloom: false,
          bloomScale: 1,
          word: i === steps ? 'ROOT' : null
        });
      }
    }

    /**
     * Records a completed node anchor on the stem and triggers organic particle bursts
     */
    recordCompletedNode({
      yWorld,
      zoneId,
      isTripleBloom,
      triggeredGraftCollar,
      word,
      choiceSide
    }) {
      const sway = (choiceSide === 0 ? -1 : 1) * (12 + Math.random() * 10);
      this.stemAnchors.push({
        yWorld,
        xOffset: sway,
        zoneId,
        hasLeafLeft: true,
        hasLeafRight: true,
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

      // Spawn celebratory spores / ink splatters / golden pollen
      const theme = this.getTheme();
      const count = isTripleBloom ? 26 : 10;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (isTripleBloom ? 140 : 75) * (0.4 + Math.random() * 0.8);
        this.burstParticles.push({
          xOffset: sway,
          yWorld,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isTripleBloom ? 3.5 + Math.random() * 4 : 2 + Math.random() * 2.5,
          color: isTripleBloom ? theme.flowerPrimary : theme.particleColor,
          life: 1.0,
          decay: isTripleBloom ? 0.9 + Math.random() * 0.5 : 1.6 + Math.random() * 0.6
        });
      }
    }

    /**
     * Spawns charcoal fracture particles when a decoy word snaps the stem
     */
    triggerLexicalSnapBurst(yWorld, choiceSide) {
      const dir = choiceSide === 0 ? -1 : 1;
      for (let i = 0; i < 22; i++) {
        const angle = (dir === -1 ? Math.PI * 0.75 : Math.PI * 0.25) + (Math.random() - 0.5) * 1.2;
        const speed = 60 + Math.random() * 130;
        this.burstParticles.push({
          xOffset: dir * 28,
          yWorld: yWorld + 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 3.5,
          color: i % 2 === 0 ? '#EF4444' : '#52525B',
          life: 1.0,
          decay: 1.2 + Math.random() * 0.5
        });
      }
    }

    /**
     * Converts normalized world Y coordinate into screen Y pixel coordinate
     * (World Y = yCam is at the bottom edge of the screen; yCam + 1000 is at the top edge)
     */
    worldToScreenY(yWorld, yCam) {
      const normY = (yWorld - yCam) / 1000;
      return this.height * (1 - normY);
    }

    /**
     * Main high-definition frame render entry point
     */
    render(simState, dtMs, risingSapNextZone = 0) {
      const ctx = this.ctx;
      const theme = this.getTheme();
      const nowMs = performance.now();

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // 1. Velocity Desaturation factor (> 180 u/s dims & blurs background up to 20%)
      const vCam = simState ? simState.vCam : 45;
      const velocityDesat = Math.max(0, Math.min(1, (vCam - 180) / 100));

      // 2. Draw 0.2x Parallax Background & Theme Atmosphere
      this.drawBackground(ctx, theme, simState, velocityDesat, nowMs);

      // 3. Draw "Quiet Center" 40% Gutter Mask to protect word fork readability
      this.drawQuietCenterGutter(ctx, theme, velocityDesat);

      // 4. Draw Peripheral Reactive Particles (Fireflies / Sunbeams & Dust / Sakura Petals)
      this.drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs);

      // 5. Draw the Procedural Climbing Vine Stem, Leaves, Rising Sap Vein, Graft Collars & Blooms
      if (simState) {
        this.drawClimbingVine(ctx, theme, simState, risingSapNextZone, nowMs);
        this.drawBurstParticles(ctx, simState, dtMs);
        this.drawDangerVignette(ctx, theme, simState, nowMs);
      }

      ctx.restore();
    }

    drawBackground(ctx, theme, simState, velocityDesat, nowMs) {
      const yCam = simState ? simState.yCam : 0;
      // 0.2x Slow-Scroll Parallax altitude factor
      const parallaxY = yCam * 0.2;
      const altitudeBlend = Math.max(0, Math.min(1, parallaxY / 900));

      // Interpolate low -> mid -> high background colors
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

      // Apply 20% dimming at terminal velocity
      const dim = 1 - velocityDesat * 0.22;
      const grad = ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(
        0,
        `rgb(${Math.round(topColor[0] * dim)}, ${Math.round(topColor[1] * dim)}, ${Math.round(topColor[2] * dim)})`
      );
      grad.addColorStop(
        1,
        `rgb(${Math.round(bottomColor[0] * dim)}, ${Math.round(bottomColor[1] * dim)}, ${Math.round(bottomColor[2] * dim)})`
      );

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Theme-specific 0.2x parallax architectural / landscape silhouettes in periphery
      if (theme.id === 0) {
        // Midnight Bioluminescence: Cavern stone pillars on outer edges & distant starfield at high altitude
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + altitudeBlend * 0.45})`;
        for (let i = 0; i < 36; i++) {
          const sx = ((i * 197) % this.width);
          // Keep stars mostly outside center gutter or very faint
          if (sx > this.width * 0.32 && sx < this.width * 0.68) continue;
          const sy = ((i * 131 + parallaxY * 0.35) % this.height);
          const r = (i % 3 === 0 ? 1.6 : 1.0);
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme.id === 1) {
        // Sunlit Conservatory: Wrought-iron Victorian glasshouse arches on left & right margins
        ctx.strokeStyle = `rgba(255, 240, 210, ${0.09 * (1 - velocityDesat * 0.4)})`;
        ctx.lineWidth = 2;
        const archSpacing = 220;
        const offset = (parallaxY * 0.4) % archSpacing;
        for (let y = -archSpacing + offset; y < this.height + archSpacing; y += archSpacing) {
          // Left conservatory rib
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.quadraticCurveTo(this.width * 0.22, y - 60, this.width * 0.28, y + 40);
          ctx.stroke();
          // Right conservatory rib
          ctx.beginPath();
          ctx.moveTo(this.width, y);
          ctx.quadraticCurveTo(this.width * 0.78, y - 60, this.width * 0.72, y + 40);
          ctx.stroke();
        }

        // Diagonal shafts of volumetric sunlight outside the center lane
        const rayAngleShift = Math.sin(altitudeBlend * Math.PI) * 40;
        const rayGrad = ctx.createLinearGradient(0, 0, this.width * 0.35, this.height * 0.7);
        rayGrad.addColorStop(0, `rgba(255, 236, 179, ${0.12 * dim})`);
        rayGrad.addColorStop(1, 'rgba(255, 236, 179, 0)');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width * 0.28 + rayAngleShift, 0);
        ctx.lineTo(this.width * 0.12 + rayAngleShift, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();
      } else if (theme.id === 2) {
        // Ukiyo-e Ink & Sakura: Layered mountain washes & subtle washi grain
        const ridgeOffset = (parallaxY * 0.25) % 360;
        ctx.fillStyle = altitudeBlend > 0.6 ? 'rgba(30, 20, 40, 0.22)' : 'rgba(120, 105, 95, 0.12)';
        // Left mountain silhouette
        ctx.beginPath();
        ctx.moveTo(0, this.height);
        ctx.lineTo(0, this.height * 0.35 + ridgeOffset * 0.2);
        ctx.quadraticCurveTo(this.width * 0.18, this.height * 0.42, this.width * 0.32, this.height);
        ctx.closePath();
        ctx.fill();

        // Right mountain silhouette
        ctx.beginPath();
        ctx.moveTo(this.width, this.height);
        ctx.lineTo(this.width, this.height * 0.28 + ridgeOffset * 0.2);
        ctx.quadraticCurveTo(this.width * 0.82, this.height * 0.38, this.width * 0.68, this.height);
        ctx.closePath();
        ctx.fill();
      }
    }

    drawQuietCenterGutter(ctx, theme, velocityDesat) {
      const centerX = this.width * 0.5;
      const gutterHalfWidth = Math.max(190, this.width * 0.23);
      const grad = ctx.createLinearGradient(centerX - gutterHalfWidth * 1.4, 0, centerX + gutterHalfWidth * 1.4, 0);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.25, theme.quietGutterColor);
      grad.addColorStop(0.75, theme.quietGutterColor);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(centerX - gutterHalfWidth * 1.4, 0, gutterHalfWidth * 2.8, this.height);

      // Subtle vertical warp streaks on outer gutter borders in Zone 3 (>180 u/s)
      if (velocityDesat > 0.05) {
        ctx.strokeStyle =
          theme.id === 2
            ? `rgba(225, 29, 72, ${velocityDesat * 0.16})`
            : `rgba(255, 255, 255, ${velocityDesat * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - gutterHalfWidth, 0);
        ctx.lineTo(centerX - gutterHalfWidth, this.height);
        ctx.moveTo(centerX + gutterHalfWidth, 0);
        ctx.lineTo(centerX + gutterHalfWidth, this.height);
        ctx.stroke();
      }
    }

    drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs) {
      const yCam = simState ? simState.yCam : 0;
      const zoneId = simState ? simState.zoneId : 1;
      const leadUnits = simState ? simState.yVine - simState.yCam : 360;

      this.ambientParticles.forEach((p, idx) => {
        const px = p.xNorm * this.width + Math.sin(nowMs * 0.0012 + p.phase) * 14;
        const py = ((p.yWorld - yCam * 0.25 * p.speedFactor) % this.height + this.height) % this.height;

        ctx.save();
        if (theme.id === 0 && (zoneId === 3 || velocityDesat > 0.2)) {
          // Day 1 Zone 3: Out-of-focus fireflies stretch into vertical warp-speed light streaks!
          const streakLen = 14 + velocityDesat * 42;
          ctx.strokeStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.75;
          ctx.lineWidth = p.radius * 1.1;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + streakLen);
          ctx.stroke();
        } else if (theme.id === 2) {
          // Day 3: Sakura blossom petals drifting in periphery
          ctx.translate(px, py);
          ctx.rotate(nowMs * 0.0015 + idx);
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.6, p.radius * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft bokeh fireflies (Day 1) or golden conservatory dust motes (Day 2)
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(nowMs * 0.003 + p.phase));
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Day 3 Ukiyo-e special reactivity: Swirling cherry blossom petals along bottom bezel when viewport is close!
      if (theme.id === 2 && leadUnits < 220) {
        const dangerIntensity = 1 - Math.max(0, leadUnits / 220);
        const petalCount = Math.floor(12 * dangerIntensity);
        ctx.save();
        for (let i = 0; i < petalCount; i++) {
          const sx = ((nowMs * 0.18 + i * 137) % this.width);
          const sy = this.height - 10 - ((i * 29) % 55) - Math.sin(nowMs * 0.006 + i) * 12;
          ctx.fillStyle = i % 2 === 0 ? '#FDA4AF' : '#FB7185';
          ctx.globalAlpha = 0.55 + dangerIntensity * 0.4;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 6, 3.2, nowMs * 0.004 + i, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    drawClimbingVine(ctx, theme, simState, risingSapNextZone, nowMs) {
      const centerX = this.width * 0.5;
      const yCam = simState.yCam;
      const yVine = simState.yVine;

      // Filter anchors near visible world range plus active tip
      const visibleAnchors = this.stemAnchors.filter((a) => a.yWorld >= yCam - 220);
      const lastAnchor =
        visibleAnchors.length > 0
          ? visibleAnchors[visibleAnchors.length - 1]
          : { yWorld: yCam - 50, xOffset: 0, zoneId: simState.zoneId };

      // Build spline points up to active vine tip (centered at xOffset = 0 for Foveal Choice alignment)
      const points = visibleAnchors.map((a) => ({
        x: centerX + a.xOffset,
        y: this.worldToScreenY(a.yWorld, yCam),
        yWorld: a.yWorld,
        zoneId: a.zoneId,
        anchor: a
      }));

      // Active growing tip point
      const tipScreenY = this.worldToScreenY(yVine, yCam);
      points.push({
        x: centerX,
        y: tipScreenY,
        yWorld: yVine,
        zoneId: simState.zoneId,
        anchor: null
      });

      if (points.length < 2) return;

      const activePalette = theme.stemZones[simState.zoneId] || theme.stemZones[1];

      // 1. Draw Outer Stem Glow / Shadow
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = activePalette.glow;
      ctx.shadowBlur = theme.id === 0 ? 22 : 12;

      // Draw segment by segment so zone colors transition cleanly across Graft Collars
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const segPalette = theme.stemZones[p1.zoneId] || activePalette;
        const midY = (p0.y + p1.y) * 0.5;

        // Secondary braided vine / sumi-e dry brush stroke
        ctx.strokeStyle = segPalette.secondary;
        ctx.lineWidth = theme.id === 2 ? 15 : 13;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(
          p0.x + (i % 2 === 0 ? 10 : -10),
          midY,
          p1.x + (i % 2 === 0 ? -10 : 10),
          midY,
          p1.x,
          p1.y
        );
        ctx.stroke();

        // Primary botanical stem
        ctx.strokeStyle = simState.status === 'SNIPPED' && i === points.length - 2 ? '#4B5563' : segPalette.main;
        ctx.lineWidth = theme.id === 2 ? 10 : 9;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo((p0.x + p1.x) * 0.5, midY, p1.x, p1.y);
        ctx.stroke();

        // Rising Sap Center Vein (bleeds next zone's signature color 2 nodes before a zone shift!)
        const sapPalette =
          risingSapNextZone > 0 && theme.stemZones[risingSapNextZone]
            ? theme.stemZones[risingSapNextZone]
            : null;
        const pulse = 0.55 + 0.45 * Math.sin(nowMs * 0.008 - i * 0.7);
        ctx.strokeStyle = sapPalette ? sapPalette.main : segPalette.vein;
        ctx.lineWidth = sapPalette ? 4.2 : 2.4;
        ctx.globalAlpha = sapPalette ? 0.92 : 0.65 * pulse;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo((p0.x + p1.x) * 0.5, midY, p1.x, p1.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // 2. Draw Serrated Leaves & Triple-Bloom Flowers on Historical Nodes
      points.forEach((pt, idx) => {
        if (!pt.anchor) return;
        const swayAngle = Math.sin(nowMs * 0.0025 + idx) * 0.08;
        if (pt.anchor.hasLeafLeft) {
          this.drawBotanicalLeaf(ctx, theme, pt.x - 6, pt.y, -1, swayAngle);
        }
        if (pt.anchor.hasLeafRight) {
          this.drawBotanicalLeaf(ctx, theme, pt.x + 6, pt.y, 1, -swayAngle);
        }
        if (pt.anchor.isBloom) {
          const ageMs = nowMs - (pt.anchor.bloomTimestamp || 0);
          const scale = Math.min(1, ageMs / 280);
          this.drawTripleBloomFlower(ctx, theme, pt.x, pt.y, scale, nowMs);
        }
      });

      // 3. Draw Glowing Graft Collars at Zone Transitions (Node 13 & Node 29)
      this.graftCollars.forEach((collar) => {
        if (collar.yWorld < yCam - 100 || collar.yWorld > yCam + 1100) return;
        const cy = this.worldToScreenY(collar.yWorld, yCam);
        const colPalette = theme.stemZones[collar.zoneId] || activePalette;

        ctx.save();
        ctx.shadowColor = colPalette.main;
        ctx.shadowBlur = 18;
        ctx.fillStyle = colPalette.secondary;
        ctx.strokeStyle = colPalette.vein;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.roundRect(centerX - 46, cy - 11, 92, 22, 11);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(collar.zoneId === 2 ? '+ ZONE 2 STEM' : '~ ZONE 3 CANOPY', centerX, cy);
        ctx.restore();
      });

      // 4. Draw Active Fork Tip Branch Stubs (Angled at +/- 30 degrees toward the candidate word pills)
      const tipX = centerX;
      const tipY = tipScreenY;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 5;

      // Left fork tendril (-30 deg)
      ctx.strokeStyle =
        simState.status === 'SNIPPED' ? '#4B5563' : activePalette.main;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.quadraticCurveTo(tipX - 38, tipY - 24, tipX - 88, tipY - 54);
      ctx.stroke();

      // Right fork tendril (+30 deg)
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.quadraticCurveTo(tipX + 38, tipY - 24, tipX + 88, tipY - 54);
      ctx.stroke();

      // Glowing apical meristem bud at active tip
      ctx.fillStyle = simState.status === 'SNIPPED' ? '#EF4444' : activePalette.vein;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawBotanicalLeaf(ctx, theme, x, y, side, swayAngle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(side * 0.58 + swayAngle);

      ctx.fillStyle = theme.leafColor;
      ctx.strokeStyle = theme.leafHighlight;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * 14, -10, side * 26, -4);
      ctx.quadraticCurveTo(side * 14, 8, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    drawTripleBloomFlower(ctx, theme, x, y, scale, nowMs) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.rotate(nowMs * 0.0005);

      const petals = 6;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / petals);
        ctx.fillStyle = i % 2 === 0 ? theme.flowerPrimary : theme.flowerSecondary;
        ctx.beginPath();
        ctx.ellipse(0, -12, 6.5, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = theme.flowerCenter;
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
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
        ctx.globalAlpha = Math.max(0, p.life);
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
      const pulse = 0.65 + 0.35 * Math.sin(nowMs * (0.01 + urgency * 0.015));

      ctx.save();
      const grad = ctx.createRadialGradient(
        this.width * 0.5,
        this.height * 0.45,
        this.height * 0.25,
        this.width * 0.5,
        this.height * 0.5,
        this.height * 0.85
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(185, 28, 28, ${urgency * 0.58 * pulse})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Creeping crimson roots in the bottom corners
      ctx.strokeStyle = `rgba(220, 38, 38, ${urgency * 0.75})`;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      const rootReach = urgency * 130;

      // Bottom-left root tendrils
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      ctx.quadraticCurveTo(rootReach * 0.6, this.height - rootReach * 0.8, rootReach, this.height - rootReach);
      ctx.stroke();

      // Bottom-right root tendrils
      ctx.beginPath();
      ctx.moveTo(this.width, this.height);
      ctx.quadraticCurveTo(
        this.width - rootReach * 0.6,
        this.height - rootReach * 0.8,
        this.width - rootReach,
        this.height - rootReach
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  root.WordVineThemes = THEMES;
  root.WordVineRenderer = VineRenderer;
})(typeof self !== 'undefined' ? self : this);
