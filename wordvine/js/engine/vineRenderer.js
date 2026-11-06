/**
 * Word Vine — High-Definition Procedural Botanical Canvas Renderer
 * Renders at native HiDPI (devicePixelRatio up to 3x) with:
 * - 4 Botanical Themes (Midnight Bioluminescence, Sunlit Conservatory, Ukiyo-e Ink & Sakura, Meadow & Sage)
 * - 0.2x Slow-Scroll Parallax Architecture, Glasshouse Arches, Volumetric Sunbeams & Mountain Layers
 * - Procedural Braided Climbing Vine with Curling Spiral Tendrils, Midrib Leaves & Pulsing Sap Vein
 * - Blooming Flowers (Luminous Orchids, Golden Marigolds, Pink Sakura, Wildflower Rosehips) & Particle Bursts
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
      bgLow: [10, 18, 34],
      bgMid: [8, 24, 46],
      bgHigh: [4, 10, 22],
      stemZones: {
        1: { main: '#2DD4BF', secondary: '#0D9488', vein: '#99F6E4', glow: 'rgba(45, 212, 191, 0.48)' },
        2: { main: '#F59E0B', secondary: '#B45309', vein: '#FDE68A', glow: 'rgba(245, 158, 11, 0.45)' },
        3: { main: '#C084FC', secondary: '#7E22CE', vein: '#F472B6', glow: 'rgba(192, 132, 252, 0.52)' }
      },
      leafColor: '#14B8A6',
      leafHighlight: '#99F6E4',
      flowerPrimary: '#F472B6',
      flowerSecondary: '#C084FC',
      flowerCenter: '#67E8F9',
      particleColor: '#72EFDD',
      quietGutterColor: 'rgba(5, 11, 22, 0.36)'
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
      quietGutterColor: 'rgba(20, 28, 23, 0.24)'
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
        1: { main: '#292524', secondary: '#57534E', vein: '#E11D48', glow: 'rgba(225, 29, 72, 0.25)' },
        2: { main: '#9A3412', secondary: '#431407', vein: '#F97316', glow: 'rgba(234, 88, 12, 0.32)' },
        3: { main: '#831843', secondary: '#3B0764', vein: '#F472B6', glow: 'rgba(244, 114, 182, 0.45)' }
      },
      leafColor: '#3F3B37',
      leafHighlight: '#A8A29E',
      flowerPrimary: '#FFCAD4',
      flowerSecondary: '#F472B6',
      flowerCenter: '#D62828',
      particleColor: '#FDA4AF',
      quietGutterColor: 'rgba(245, 239, 230, 0.26)'
    },
    {
      id: 3,
      name: 'Meadow & Sage',
      subtitle: 'Sunlit Herbarium to Airy Canopy',
      cssClass: 'theme-meadow',
      bgLow: [242, 239, 228],
      bgMid: [224, 236, 221],
      bgHigh: [196, 221, 212],
      stemZones: {
        1: { main: '#4A7C59', secondary: '#76A682', vein: '#B5DFC4', glow: 'rgba(74, 124, 89, 0.25)' },
        2: { main: '#587850', secondary: '#8C7A5B', vein: '#C9DCB3', glow: 'rgba(88, 120, 80, 0.25)' },
        3: { main: '#3B6E52', secondary: '#639677', vein: '#BCE3C8', glow: 'rgba(59, 110, 82, 0.28)' }
      },
      leafColor: '#5D8E6B',
      leafHighlight: '#9DC5A6',
      flowerPrimary: '#E5989B',
      flowerSecondary: '#D88286',
      flowerCenter: '#F2C572',
      particleColor: '#8FB996',
      quietGutterColor: 'rgba(250, 248, 242, 0.22)'
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
      document.body.classList.remove('theme-biolum', 'theme-conservatory', 'theme-ukiyoe', 'theme-meadow');
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
        const side = i % 2 === 0 ? 0 : 1;
        const xNorm = side === 0 ? Math.random() * 0.30 : 0.70 + Math.random() * 0.30;
        this.ambientParticles.push({
          xNorm,
          yWorld: Math.random() * 2000,
          radius: 1.8 + Math.random() * 3.5,
          alpha: 0.28 + Math.random() * 0.62,
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

      // Seed root anchors from world Y = -220 up to initialYVine with graceful S-curve sway
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        const y = -220 + ((initialYVine + 220) * i) / steps;
        const sway = Math.sin(i * 0.95) * 18;
        this.stemAnchors.push({
          yWorld: y,
          xOffset: sway,
          zoneId: startZone,
          hasLeafLeft: i % 2 === 0,
          hasLeafRight: i % 2 === 1,
          hasTendril: i % 2 === 1,
          tendrilSide: i % 2 === 0 ? 1 : -1,
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
      isReverseGraft,
      triggeredGraftCollar,
      word,
      choiceSide
    }) {
      const sway = (choiceSide === 0 ? -1 : 1) * (14 + Math.random() * 10);
      this.stemAnchors.push({
        yWorld,
        xOffset: sway,
        zoneId,
        hasLeafLeft: true,
        hasLeafRight: true,
        hasTendril: true,
        tendrilSide: choiceSide === 0 ? 1 : -1,
        isBloom: Boolean(isTripleBloom),
        isReverseGraft: Boolean(isReverseGraft),
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
      const count = isTripleBloom ? 26 : 12;
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
          decay: isTripleBloom ? 0.9 + Math.random() * 0.5 : 1.5 + Math.random() * 0.6
        });
      }
    }

    /**
     * Spawns fracture particles when a decoy word snips the stem
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
          color: i % 2 === 0 ? '#EF4444' : '#78716C',
          life: 1.0,
          decay: 1.2 + Math.random() * 0.5
        });
      }
    }

    /**
     * Computes 0..1 downward camera pitch progress ("coming over the top of the vine")
     * as the player climbs from Node 0 toward Node 40.
     */
    getCameraPitchProgress(simState) {
      const s = simState || this.lastSimState;
      if (!s) return 0;
      const nodeProg = Math.max(0, Math.min(1, (s.nodesCompleted || 0) / 36));
      const altProg = Math.max(0, Math.min(1, (s.yCam || 0) / 4200));
      const raw = nodeProg * 0.72 + altProg * 0.28;
      // Smoothstep easing so the downward pan builds naturally as you climb
      return raw * raw * (3 - 2 * raw);
    }

    /**
     * Converts normalized world Y coordinate into screen Y pixel coordinate
     * with top-down perspective foreshortening as the camera pans down over the vine crown.
     */
    worldToScreenY(yWorld, yCam, simState) {
      const normY = (yWorld - yCam) / 1000;
      const pitch = this.getCameraPitchProgress(simState);
      if (pitch <= 0.001) {
        return this.height * (1 - normY);
      }
      // As camera pitches down over the top of the vine:
      // - Points below the tip compress non-linearly toward the lower vanishing point
      // - The cresting tip shifts slightly downward from the upper sky horizon
      const clampedNorm = Math.max(-0.3, Math.min(1.2, normY));
      const foreshortenedNorm =
        clampedNorm >= 0
          ? Math.pow(clampedNorm, 1 - pitch * 0.28)
          : clampedNorm * (1 + pitch * 0.25);
      const linearY = this.height * (1 - normY);
      const perspectiveY =
        this.height * (0.11 * pitch + (1 - 0.14 * pitch) * (1 - foreshortenedNorm));
      return linearY * (1 - pitch) + perspectiveY * pitch;
    }

    /**
     * Main high-definition frame render entry point
     */
    render(simState, dtMs, risingSapNextZone = 0, showGhostThirdNode = false, isActiveReverseGraft = false) {
      const ctx = this.ctx;
      const theme = this.getTheme();
      const nowMs = performance.now();
      this.lastSimState = simState;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // 1. Velocity Desaturation factor (> 180 u/s dims & blurs background up to 20%)
      const vCam = simState ? simState.vCam : 45;
      const velocityDesat = Math.max(0, Math.min(1, (vCam - 180) / 100));

      // 2. Draw 0.2x Parallax Background & Theme Atmosphere
      this.drawBackground(ctx, theme, simState, velocityDesat, nowMs);

      // 3. Draw Soft Center Gutter Vignette to protect word fork readability
      this.drawQuietCenterGutter(ctx, theme, velocityDesat);

      // 4. Draw Peripheral Reactive Particles (Fireflies / Sunbeams & Dust / Sakura Petals)
      this.drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs);

      // 5. Draw the Procedural Climbing Vine Stem, Tendrils, Leaves, Rising Sap Vein & Blooms
      if (simState) {
        this.drawClimbingVine(
          ctx,
          theme,
          simState,
          risingSapNextZone,
          nowMs,
          showGhostThirdNode,
          isActiveReverseGraft
        );
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
        // Midnight Bioluminescence: Starlit canopy & distant glowing botanical silhouettes
        ctx.fillStyle = `rgba(255, 255, 255, ${0.16 + altitudeBlend * 0.45})`;
        for (let i = 0; i < 36; i++) {
          const sx = (i * 197) % this.width;
          if (sx > this.width * 0.32 && sx < this.width * 0.68) continue;
          const sy = (i * 131 + parallaxY * 0.35) % this.height;
          const r = i % 3 === 0 ? 1.6 : 1.0;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (theme.id === 1 || theme.id === 3) {
        // Sunlit Conservatory & Meadow: Wrought-iron Victorian glasshouse arches & diagonal sunbeams
        ctx.strokeStyle =
          theme.id === 1
            ? `rgba(255, 240, 210, ${0.11 * (1 - velocityDesat * 0.4)})`
            : `rgba(74, 124, 89, ${0.09 * (1 - velocityDesat * 0.4)})`;
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

        // Diagonal shafts of volumetric sunlight
        const rayAngleShift = Math.sin(altitudeBlend * Math.PI) * 40;
        const rayGrad = ctx.createLinearGradient(0, 0, this.width * 0.35, this.height * 0.7);
        rayGrad.addColorStop(
          0,
          theme.id === 1 ? `rgba(255, 236, 179, ${0.14 * dim})` : `rgba(255, 252, 235, ${0.38 * dim})`
        );
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

      // Camera Downward Pan / Cresting Over the Top of the Vine (Horizon & Receding Depth Rings)
      const pitchProgress = this.getCameraPitchProgress(simState);
      if (pitchProgress > 0.02) {
        this.drawTopDownCanopyHorizon(ctx, theme, pitchProgress, parallaxY, dim);
      }
    }

    /**
     * Renders the curved canopy horizon and receding 3D depth rings / converging sightlines
     * as the camera pans downward to look over the top of the climbing vine.
     */
    drawTopDownCanopyHorizon(ctx, theme, pitchProgress, parallaxY, dim) {
      const centerX = this.width * 0.5;
      // Curved horizon sweeps down from above the top bezel into the upper third of the viewport
      const horizonY = -70 + pitchProgress * (this.height * 0.31 + 70);
      const curveArch = 36 + pitchProgress * 58;
      const vanishY = this.height * (0.86 + pitchProgress * 0.18);

      ctx.save();

      // 1. Upper open sky / starlit dome glow above the curved canopy horizon
      const skyGlow = ctx.createLinearGradient(0, 0, 0, Math.max(20, horizonY + curveArch));
      if (theme.id === 0) {
        skyGlow.addColorStop(0, `rgba(94, 234, 212, ${0.18 * pitchProgress})`);
        skyGlow.addColorStop(1, 'rgba(10, 24, 46, 0)');
      } else if (theme.id === 2) {
        skyGlow.addColorStop(0, `rgba(255, 202, 212, ${0.24 * pitchProgress})`);
        skyGlow.addColorStop(1, 'rgba(242, 234, 221, 0)');
      } else {
        skyGlow.addColorStop(0, `rgba(255, 250, 225, ${0.34 * pitchProgress * dim})`);
        skyGlow.addColorStop(1, 'rgba(196, 221, 212, 0)');
      }
      ctx.fillStyle = skyGlow;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.width, 0);
      ctx.lineTo(this.width, horizonY + curveArch * 0.65);
      ctx.quadraticCurveTo(centerX, horizonY - curveArch * 0.55, 0, horizonY + curveArch * 0.65);
      ctx.closePath();
      ctx.fill();

      // 2. Curved Canopy Rim / Crown Horizon Line
      ctx.strokeStyle =
        theme.id === 0
          ? `rgba(153, 246, 228, ${0.28 * pitchProgress})`
          : theme.id === 2
            ? `rgba(131, 24, 67, ${0.18 * pitchProgress})`
            : `rgba(74, 124, 89, ${0.24 * pitchProgress})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, horizonY + curveArch * 0.65);
      ctx.quadraticCurveTo(centerX, horizonY - curveArch * 0.55, this.width, horizonY + curveArch * 0.65);
      ctx.stroke();

      // 3. Converging Radial Perspective Sightlines toward the Deep Ground Vanishing Point
      const rayCount = 8;
      ctx.strokeStyle =
        theme.id === 0
          ? `rgba(94, 234, 212, ${0.09 * pitchProgress})`
          : `rgba(74, 124, 89, ${0.08 * pitchProgress})`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= rayCount; i++) {
        const frac = i / rayCount;
        if (frac > 0.32 && frac < 0.68) continue; // Keep center word gutter clean
        const startX = frac * this.width;
        const startY = horizonY + Math.abs(frac - 0.5) * curveArch * 1.1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(centerX + (startX - centerX) * 0.18, vanishY);
        ctx.stroke();
      }

      // 4. Receding Elliptical Depth Rings Looking Down the Vine Shaft
      const ringCount = 5;
      const scrollPhase = ((parallaxY * 0.012) % 1 + 1) % 1;
      for (let r = 0; r < ringCount; r++) {
        const t = ((r + scrollPhase) / ringCount); // 0 = near top, 1 = deep below
        const depthT = t * t; // Perspective bunching near vanishing point
        const ringY = horizonY + 50 + depthT * (vanishY - horizonY - 40);
        const radiusX = (1 - depthT * 0.72) * (this.width * 0.46);
        const radiusY = radiusX * (0.14 + pitchProgress * 0.22);
        const alpha = (1 - t) * t * 0.42 * pitchProgress;

        ctx.strokeStyle =
          theme.id === 0
            ? `rgba(45, 212, 191, ${alpha})`
            : theme.id === 2
              ? `rgba(225, 29, 72, ${alpha * 0.75})`
              : `rgba(74, 124, 89, ${alpha})`;
        ctx.lineWidth = 1.5 * (1 - depthT * 0.5);
        ctx.beginPath();
        ctx.ellipse(centerX, ringY, Math.max(20, radiusX), Math.max(8, radiusY), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
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
          // Bioluminescence Zone 3: Out-of-focus fireflies stretch into vertical light streaks
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
          // Sakura blossom petals drifting in periphery
          ctx.translate(px, py);
          ctx.rotate(nowMs * 0.0015 + idx);
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.6, p.radius * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft bokeh fireflies (Biolum) or golden conservatory dust motes (Conservatory / Meadow)
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(nowMs * 0.003 + p.phase));
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Ukiyo-e special reactivity: Swirling cherry blossom petals along bottom bezel when viewport is close!
      if (theme.id === 2 && leadUnits < 220) {
        const dangerIntensity = 1 - Math.max(0, leadUnits / 220);
        const petalCount = Math.floor(12 * dangerIntensity);
        ctx.save();
        for (let i = 0; i < petalCount; i++) {
          const sx = (nowMs * 0.18 + i * 137) % this.width;
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

    drawClimbingVine(
      ctx,
      theme,
      simState,
      risingSapNextZone,
      nowMs,
      showGhostThirdNode = false,
      isActiveReverseGraft = false
    ) {
      const centerX = this.width * 0.5;
      const yCam = simState.yCam;
      const yVine = simState.yVine;
      const pitchProgress = this.getCameraPitchProgress(simState);
      const tipScreenY = this.worldToScreenY(yVine, yCam, simState);

      // Helper: computes 3D perspective scale for any screenY along the vine
      // At pitchProgress = 0 -> uniform 1.0
      // As pitchProgress -> 1 -> cresting tip scales up (~1.26x) while lower stem tapers into the depths (~0.38x)
      const getDepthScale = (screenY) => {
        if (pitchProgress <= 0.001) return 1.0;
        const distBelowTip = Math.max(0, (screenY - tipScreenY) / Math.max(220, this.height - tipScreenY));
        const tipMagnify = 1 + pitchProgress * 0.26;
        const depthTaper = Math.max(0.32, 1 - distBelowTip * pitchProgress * 0.68);
        return tipMagnify * depthTaper;
      };

      // Filter anchors near visible world range plus active tip
      const visibleAnchors = this.stemAnchors.filter((a) => a.yWorld >= yCam - 260);

      // Build spline points up to active vine tip with gentle living breeze sway & 3D perspective convergence
      const points = visibleAnchors.map((a, idx) => {
        const sy = this.worldToScreenY(a.yWorld, yCam, simState);
        const dScale = getDepthScale(sy);
        const breeze = Math.sin(nowMs * 0.0018 + idx * 0.5) * 4;
        return {
          x: centerX + (a.xOffset + breeze) * dScale,
          y: sy,
          scale: dScale,
          yWorld: a.yWorld,
          zoneId: a.zoneId,
          anchor: a
        };
      });

      // Active growing tip point
      const tipScale = getDepthScale(tipScreenY);
      points.push({
        x: centerX,
        y: tipScreenY,
        scale: tipScale,
        yWorld: yVine,
        zoneId: simState.zoneId,
        anchor: null
      });

      if (points.length < 2) return;

      const activePalette = theme.stemZones[simState.zoneId] || theme.stemZones[1];

      // 1. Draw Outer Stem Glow, Braided Secondary Vine, Primary Stem & Pulsing Sap Vein (Tapered by 3D Depth)
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = activePalette.glow;
      ctx.shadowBlur = theme.id === 0 ? 22 : 12;

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const segScale = (p0.scale + p1.scale) * 0.5;
        const segPalette = theme.stemZones[p1.zoneId] || activePalette;
        const midY = (p0.y + p1.y) * 0.5;
        const braidOffset = (i % 2 === 0 ? 12 : -12) * segScale;

        // Secondary braided vine / twining botanical stroke
        ctx.strokeStyle = segPalette.secondary;
        ctx.lineWidth = (theme.id === 2 ? 13 : 11.5) * segScale;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(
          p0.x + braidOffset,
          midY,
          p1.x - braidOffset,
          midY,
          p1.x,
          p1.y
        );
        ctx.stroke();

        // Primary botanical stem
        ctx.strokeStyle =
          simState.status === 'SNIPPED' && i === points.length - 2
            ? '#4B5563'
            : segPalette.main;
        ctx.lineWidth = (theme.id === 2 ? 9.5 : 8.5) * segScale;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo((p0.x + p1.x) * 0.5, midY, p1.x, p1.y);
        ctx.stroke();

        // Rising Sap Center Vein (pulses along the growing vine & bleeds next zone color before shift)
        const sapPalette =
          risingSapNextZone > 0 && theme.stemZones[risingSapNextZone]
            ? theme.stemZones[risingSapNextZone]
            : null;
        const pulse = 0.55 + 0.45 * Math.sin(nowMs * 0.008 - i * 0.7);
        ctx.strokeStyle = sapPalette ? sapPalette.main : segPalette.vein;
        ctx.lineWidth = (sapPalette ? 4.2 : 2.5) * segScale;
        ctx.globalAlpha = sapPalette ? 0.92 : 0.68 * pulse;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo((p0.x + p1.x) * 0.5, midY, p1.x, p1.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // 2. Draw Curling Spiral Tendrils, Botanical Leaves & Triple-Bloom Flowers on Historical Nodes (Scaled by Depth)
      points.forEach((pt, idx) => {
        if (!pt.anchor) return;
        const swayAngle = Math.sin(nowMs * 0.0025 + idx) * 0.09;
        const s = pt.scale || 1;
        if (pt.anchor.hasTendril) {
          this.drawCurlingTendril(
            ctx,
            activePalette.secondary,
            pt.x,
            pt.y,
            pt.anchor.tendrilSide || 1,
            swayAngle,
            s
          );
        }
        if (pt.anchor.hasLeafLeft) {
          this.drawBotanicalLeaf(ctx, theme, pt.x - 6 * s, pt.y, -1, swayAngle, s);
        }
        if (pt.anchor.hasLeafRight) {
          this.drawBotanicalLeaf(ctx, theme, pt.x + 6 * s, pt.y, 1, -swayAngle, s);
        }
        if (pt.anchor.isReverseGraft) {
          this.drawReverseGraftRing(ctx, theme, activePalette, pt.x, pt.y, s, nowMs, false);
        }
        if (pt.anchor.isBloom) {
          const ageMs = nowMs - (pt.anchor.bloomTimestamp || 0);
          const scale = Math.min(1, ageMs / 280) * s;
          this.drawTripleBloomFlower(ctx, theme, pt.x, pt.y, scale, nowMs);
        }
      });

      // 3. Draw Botanical Leaf & Blossom Collars at Zone Transitions
      this.graftCollars.forEach((collar) => {
        if (collar.yWorld < yCam - 100 || collar.yWorld > yCam + 1100) return;
        const cy = this.worldToScreenY(collar.yWorld, yCam, simState);
        const cs = getDepthScale(cy);
        this.drawBotanicalLeaf(ctx, theme, centerX - 10 * cs, cy, -1, -0.2, cs);
        this.drawBotanicalLeaf(ctx, theme, centerX + 10 * cs, cy, 1, 0.2, cs);
        this.drawTripleBloomFlower(ctx, theme, centerX, cy, 0.9 * cs, nowMs);
      });

      // 4. Draw Sweeping S-Curve Active Fork Tendrils Toward Candidate Word Leaves
      // When in a Reverse-Graft Loop (⬅), the vine curls into a 360° ringed loop before forking!
      const tipX = centerX;
      const tipY = tipScreenY;
      const forkSpread = 1 + pitchProgress * 0.16;
      const forkLift = 1 - pitchProgress * 0.22;

      if (isActiveReverseGraft) {
        this.drawReverseGraftRing(
          ctx,
          theme,
          activePalette,
          tipX,
          tipY + 18 * tipScale,
          tipScale,
          nowMs,
          true
        );
      }

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 4.8 * tipScale;
      ctx.shadowColor = activePalette.glow;
      ctx.shadowBlur = 10;

      // Left fork tendril
      ctx.strokeStyle =
        simState.status === 'SNIPPED' ? '#4B5563' : activePalette.main;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.bezierCurveTo(
        tipX - 20 * forkSpread,
        tipY - 26 * forkLift,
        tipX - 64 * forkSpread,
        tipY - 24 * forkLift,
        tipX - 92 * forkSpread,
        tipY - 56 * forkLift
      );
      ctx.stroke();

      // Right fork tendril
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.bezierCurveTo(
        tipX + 20 * forkSpread,
        tipY - 26 * forkLift,
        tipX + 64 * forkSpread,
        tipY - 24 * forkLift,
        tipX + 92 * forkSpread,
        tipY - 56 * forkLift
      );
      ctx.stroke();

      // Subtle 3rd Node Upper Tendril (Drawn ONLY on Step 1 of a 3-Part Compound)
      if (showGhostThirdNode) {
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = activePalette.vein;
        ctx.globalAlpha = 0.42;

        // Left fork -> Subtle 3rd node bud above
        ctx.beginPath();
        ctx.moveTo(tipX - 68 * forkSpread, tipY - 64 * forkLift);
        ctx.quadraticCurveTo(tipX - 32 * forkSpread, tipY - 96 * forkLift, tipX, tipY - 118 * forkLift);
        ctx.stroke();

        // Right fork -> Subtle 3rd node bud above
        ctx.beginPath();
        ctx.moveTo(tipX + 68 * forkSpread, tipY - 64 * forkLift);
        ctx.quadraticCurveTo(tipX + 32 * forkSpread, tipY - 96 * forkLift, tipX, tipY - 118 * forkLift);
        ctx.stroke();

        // Subtle 3rd node meristem bud
        ctx.setLineDash([]);
        ctx.fillStyle = activePalette.vein;
        ctx.beginPath();
        ctx.arc(tipX, tipY - 118 * forkLift, 4.5 * tipScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Top-Down Crown Cross-Section Halo when coming over the top of the vine
      if (pitchProgress > 0.08) {
        ctx.save();
        ctx.strokeStyle = activePalette.vein;
        ctx.globalAlpha = 0.35 * pitchProgress;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(
          tipX,
          tipY + 4,
          (10 + pitchProgress * 10) * tipScale,
          (4 + pitchProgress * 6) * tipScale,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }

      // Glowing apical meristem bud at active tip
      ctx.fillStyle = simState.status === 'SNIPPED' ? '#EF4444' : isActiveReverseGraft ? '#F59E0B' : activePalette.vein;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 6.5 * tipScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /**
     * Draws a 360° Curling Ringed Vine Loop for the Reverse-Graft Loop (⬅) game mode.
     * When isActive = true, renders a larger luminous amber-and-emerald braided loop with
     * counter-clockwise orbiting sap particles at the active stem fork.
     */
    drawReverseGraftRing(ctx, theme, palette, x, y, scale = 1, nowMs = 0, isActive = false) {
      const radiusX = (isActive ? 46 : 22) * scale;
      const radiusY = (isActive ? 34 : 16) * scale;

      ctx.save();
      ctx.translate(x, y);

      // Outer warm amber/gold loop aura when active
      if (isActive) {
        const pulse = 0.72 + 0.28 * Math.sin(nowMs * 0.007);
        const aura = ctx.createRadialGradient(0, 0, radiusY * 0.3, 0, 0, radiusX * 1.45);
        aura.addColorStop(0, `rgba(245, 158, 11, ${0.26 * pulse})`);
        aura.addColorStop(0.65, `rgba(217, 119, 6, ${0.12 * pulse})`);
        aura.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, 0, radiusX * 1.45, 0, Math.PI * 2);
        ctx.fill();
      }

      // Secondary braided vine loop ring
      ctx.lineCap = 'round';
      ctx.strokeStyle = isActive ? '#D97706' : palette.secondary;
      ctx.lineWidth = (isActive ? 11.5 : 6.5) * scale;
      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX, radiusY, -0.12, 0, Math.PI * 2);
      ctx.stroke();

      // Primary botanical vine loop ring
      ctx.strokeStyle = palette.main;
      ctx.lineWidth = (isActive ? 7.5 : 4.5) * scale;
      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX * 0.92, radiusY * 0.92, 0.1, 0, Math.PI * 2);
      ctx.stroke();

      // Counter-clockwise animated sap vein inside the ringed loop
      ctx.strokeStyle = isActive ? '#FDE68A' : palette.vein;
      ctx.lineWidth = (isActive ? 3.2 : 1.8) * scale;
      ctx.setLineDash([10 * scale, 8 * scale]);
      ctx.lineDashOffset = (nowMs * 0.045) % 36;
      ctx.beginPath();
      ctx.ellipse(0, 0, radiusX * 0.92, radiusY * 0.92, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting sap droplets traveling counter-clockwise (⬅ at the top of the loop)
      if (isActive) {
        const dropletCount = 3;
        for (let i = 0; i < dropletCount; i++) {
          const angle = -nowMs * 0.0045 + (i * Math.PI * 2) / dropletCount;
          const dx = Math.cos(angle) * radiusX * 0.92;
          const dy = Math.sin(angle) * radiusY * 0.92;
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(dx, dy, 3.6 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    /**
     * Draws a delicate curling spiral vine tendril extending from a stem node
     */
    drawCurlingTendril(ctx, color, x, y, side, swayAngle, scale = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.rotate(swayAngle * 1.4);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.65 * Math.min(1, scale + 0.15);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(side * 16, -8, side * 34, -18, side * 30, -4);
      ctx.bezierCurveTo(side * 26, 6, side * 16, -2, side * 22, -7);
      ctx.stroke();
      ctx.restore();
    }

    /**
     * Draws a tapered botanical leaf with a central midrib vein
     */
    drawBotanicalLeaf(ctx, theme, x, y, side, swayAngle, scale = 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.rotate(side * 0.55 + swayAngle);

      ctx.fillStyle = theme.leafColor;
      ctx.strokeStyle = theme.leafHighlight;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * 15, -11, side * 28, -4);
      ctx.quadraticCurveTo(side * 15, 8, 0, 0);
      ctx.fill();
      ctx.stroke();

      // Central leaf midrib vein
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(side * 13, -2, side * 22, -3);
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
      if (!simState || simState.status !== 'PLAYING') return;
      const leadUnits = simState.yVine - simState.yCam;
      if (leadUnits > 150) return;

      const urgency = Math.max(0, Math.min(1, 1 - leadUnits / 150));
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
