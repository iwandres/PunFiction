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
      this.baseDpr = 1;
      this.renderScale = 1.0;
      this.avgFrameMs = 16.0;
      this.slowFrameStreak = 0;
      this.isMobile = false;
      this.themeId = 0;
      this.cachedGutterGrad = null;
      this._cachedBgGrad = null;
      this._cachedRayGrad = null;
      this._lastBgKey = -1;
      this._cachedDangerGrad = null;
      this._spriteAtlases = {};
      this._auraSprites = null;
      this._gateLabelWidthCache = {};
      this._pointsPool = [];
      this._segsPool = [];
      this._visiblePointsView = [];

      // Ambient peripheral particles & burst splatters
      this.ambientParticles = [];
      this.burstParticles = [];
      // Historical world anchors along the climbed vine
      this.stemAnchors = [];
      this.graftCollars = [];
      this.rapidFireCollars = [];
      this.windIntensity = 0;
      this.windDirection = 1;

      this.resize();
      this.initAmbientParticles();
      window.addEventListener('resize', () => {
        this.resize();
        this.initAmbientParticles();
      });
    }

    setTheme(themeId) {
      const nextId = ((themeId % THEMES.length) + THEMES.length) % THEMES.length;
      if (this.themeId !== nextId) {
        this.themeId = nextId;
        this.cachedGutterGrad = null;
        document.body.classList.remove('theme-biolum', 'theme-conservatory', 'theme-ukiyoe', 'theme-meadow');
        document.body.classList.add(THEMES[this.themeId].cssClass);
      } else if (!document.body.classList.contains(THEMES[this.themeId].cssClass)) {
        document.body.classList.remove('theme-biolum', 'theme-conservatory', 'theme-ukiyoe', 'theme-meadow');
        document.body.classList.add(THEMES[this.themeId].cssClass);
      }
      return THEMES[this.themeId];
    }

    getTheme() {
      return THEMES[this.themeId];
    }

    detectMobileViewport() {
      return Boolean(
        (window.matchMedia &&
          window.matchMedia('(max-width: 768px), (pointer: coarse)').matches) ||
          window.innerWidth <= 768
      );
    }

    resize() {
      this.isMobile = this.detectMobileViewport();
      const rawDpr = window.devicePixelRatio || 1;
      // Cap HiDPI on mobile (Pixel 8a / Pixel 10 = 2.625-3.0x) to 1.5x to cut fill-rate by 75% while preserving crisp strokes
      const maxDpr = this.isMobile ? 1.5 : 2.0;
      this.baseDpr = Math.min(rawDpr, maxDpr);
      this.dpr = Math.max(1.0, this.baseDpr * (this.renderScale || 1.0));
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.cachedGutterGrad = null;
      this._cachedBgGrad = null;
      this._cachedRayGrad = null;
      this._lastBgKey = -1;
      this._cachedDangerGrad = null;
    }

    /**
     * Pre-renders crisp 2.5x HiDPI offscreen sprites for the active theme's leaves, 6-petal blooms,
     * and radial glow auras so per-frame rendering uses single hardware-accelerated drawImage blits.
     */
    getThemeSprites(theme) {
      if (this._spriteAtlases[theme.id]) {
        return this._spriteAtlases[theme.id];
      }
      const spDpr = 2.5;
      const createSprite = (w, h, drawFn) => {
        const c = document.createElement('canvas');
        c.width = Math.ceil(w * spDpr);
        c.height = Math.ceil(h * spDpr);
        const sctx = c.getContext('2d');
        sctx.scale(spDpr, spDpr);
        drawFn(sctx, w, h);
        return { canvas: c, w, h };
      };

      const renderLeafSprite = (side) =>
        createSprite(68, 44, (sctx) => {
          sctx.translate(34, 22);
          sctx.fillStyle = theme.leafColor;
          sctx.strokeStyle = theme.leafHighlight;
          sctx.lineWidth = 1.2;
          sctx.beginPath();
          sctx.moveTo(0, 0);
          sctx.quadraticCurveTo(side * 15, -11, side * 28, -4);
          sctx.quadraticCurveTo(side * 15, 8, 0, 0);
          sctx.fill();
          sctx.stroke();

          sctx.beginPath();
          sctx.moveTo(0, 0);
          sctx.quadraticCurveTo(side * 13, -2, side * 22, -3);
          sctx.stroke();
        });

      const flower = createSprite(56, 56, (sctx) => {
        sctx.translate(28, 28);
        const petals = 6;
        for (let i = 0; i < petals; i++) {
          sctx.save();
          sctx.rotate((Math.PI * 2 * i) / petals);
          sctx.fillStyle = i % 2 === 0 ? theme.flowerPrimary : theme.flowerSecondary;
          sctx.beginPath();
          sctx.ellipse(0, -12, 6.5, 11, 0, 0, Math.PI * 2);
          sctx.fill();
          sctx.restore();
        }
        sctx.fillStyle = theme.flowerCenter;
        sctx.beginPath();
        sctx.arc(0, 0, 5.5, 0, Math.PI * 2);
        sctx.fill();
      });

      const atlas = {
        leafLeft: renderLeafSprite(-1),
        leafRight: renderLeafSprite(1),
        flower
      };
      this._spriteAtlases[theme.id] = atlas;
      return atlas;
    }

    getAuraSprites() {
      if (this._auraSprites) return this._auraSprites;
      const makeRadialSprite = (stops) => {
        const size = 128;
        const half = size * 0.5;
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const sctx = c.getContext('2d');
        const g = sctx.createRadialGradient(half, half, half * 0.15, half, half, half);
        for (let i = 0; i < stops.length; i++) {
          g.addColorStop(stops[i][0], stops[i][1]);
        }
        sctx.fillStyle = g;
        sctx.beginPath();
        sctx.arc(half, half, half, 0, Math.PI * 2);
        sctx.fill();
        return c;
      };

      this._auraSprites = {
        reverseGraft: makeRadialSprite([
          [0, 'rgba(245, 158, 11, 0.28)'],
          [0.65, 'rgba(217, 119, 6, 0.13)'],
          [1, 'rgba(245, 158, 11, 0)']
        ]),
        rapidBooster: makeRadialSprite([
          [0, 'rgba(251, 191, 36, 0.34)'],
          [0.65, 'rgba(16, 185, 129, 0.15)'],
          [1, 'rgba(251, 191, 36, 0)']
        ]),
        rapidGate: makeRadialSprite([
          [0, 'rgba(254, 240, 138, 0.40)'],
          [0.6, 'rgba(245, 158, 11, 0.19)'],
          [1, 'rgba(245, 158, 11, 0)']
        ])
      };
      return this._auraSprites;
    }

    /**
     * Dynamically scales internal canvas resolution down if mobile GPU frame times exceed 20ms
     */
    stepAdaptiveResolution(dtMs) {
      if (!dtMs || dtMs <= 0 || dtMs > 120) return;
      this.avgFrameMs = this.avgFrameMs * 0.9 + dtMs * 0.1;
      if (this.avgFrameMs > 20.5 && this.renderScale > 0.76 && this.dpr > 1.05) {
        this.slowFrameStreak += 1;
        if (this.slowFrameStreak >= 22) {
          this.renderScale = Math.max(0.75, Number((this.renderScale - 0.12).toFixed(2)));
          this.slowFrameStreak = 0;
          this.dpr = Math.max(1.0, this.baseDpr * this.renderScale);
          this.canvas.width = Math.floor(this.width * this.dpr);
          this.canvas.height = Math.floor(this.height * this.dpr);
        }
      } else {
        this.slowFrameStreak = Math.max(0, this.slowFrameStreak - 1);
      }
    }

    initAmbientParticles() {
      this.ambientParticles = [];
      const count = this.isMobile ? 20 : 36;
      for (let i = 0; i < count; i++) {
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
      this.rapidFireCollars = [];
      this.windIntensity = 0;
      this.windDirection = 1;

      // 3D Cylindrical Orbital Camera State (spinning clockwise / counter-clockwise around the climbing vine)
      this.cameraOrbitAngle = 0;
      this.targetOrbitAngle = 0;
      this.orbitAngularVel = 0;
      this.lastChoiceSide = null;
      this.lastChoiceTimestampMs = 0;

      // Seed root anchors from world Y = -220 up to initialYVine winding in a 3D helix around the central axis
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        const y = -220 + ((initialYVine + 220) * i) / steps;
        const theta = (i - steps) * 0.95;
        const radius = i === steps ? 0 : 22;
        this.stemAnchors.push({
          yWorld: y,
          xOffset: Math.sin(theta) * radius,
          theta,
          radius,
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
     * Records a completed node anchor on the 3D cylindrical stem and spins the camera
     * clockwise or counter-clockwise around the climbing vine.
     */
    recordCompletedNode({
      yWorld,
      zoneId,
      isTripleBloom,
      isReverseGraft,
      isRapidFire = false,
      enteredRapidFire = false,
      triggeredGraftCollar,
      word,
      choiceSide
    }) {
      const dir = choiceSide === 0 ? -1 : 1;
      const nowMs = performance.now();

      // Anchor the completed node at the current cylindrical azimuth before spinning to the new side
      const nodeTheta = (this.targetOrbitAngle || 0) + dir * 0.35;
      const nodeRadius = 22 + Math.random() * 6;

      this.stemAnchors.push({
        yWorld,
        xOffset: dir * (14 + Math.random() * 8),
        theta: nodeTheta,
        radius: nodeRadius,
        zoneId,
        hasLeafLeft: true,
        hasLeafRight: true,
        hasTendril: true,
        tendrilSide: choiceSide === 0 ? 1 : -1,
        isBloom: Boolean(isTripleBloom),
        isReverseGraft: Boolean(isReverseGraft),
        isRapidFire: Boolean(isRapidFire),
        bloomTimestamp: nowMs,
        word
      });

      // Prune deep historical offscreen anchors so array size remains bounded
      if (this.stemAnchors.length > 18) {
        this.stemAnchors.splice(0, this.stemAnchors.length - 18);
      }

      // Spin the camera clockwise (Right = +1) or counter-clockwise (Left = -1) around the climbing vine (~82° per pick)
      const orbitStepRad = dir * 1.44;
      this.targetOrbitAngle = (this.targetOrbitAngle || 0) + orbitStepRad;
      this.orbitAngularVel = (this.orbitAngularVel || 0) + dir * 4.2;
      this.lastChoiceSide = choiceSide;
      this.lastChoiceTimestampMs = nowMs;

      if (triggeredGraftCollar) {
        this.graftCollars.push({
          yWorld,
          zoneId,
          timestamp: nowMs
        });
      }

      if (enteredRapidFire) {
        this.rapidFireCollars.push({
          yWorld,
          timestamp: nowMs
        });
        // Extra golden-emerald speed-gate ignition burst when crossing into Rapid-Fire Sprint
        const gateBurstCount = this.isMobile ? 14 : 24;
        for (let i = 0; i < gateBurstCount; i++) {
          const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.7;
          const speed = 110 + Math.random() * 150;
          this.burstParticles.push({
            xOffset: (Math.random() - 0.5) * 44,
            yWorld: yWorld + 12,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 3 + Math.random() * 3.8,
            color: i % 3 === 0 ? '#FEF08A' : i % 3 === 1 ? '#F59E0B' : '#10B981',
            life: 1.0,
            decay: 0.95 + Math.random() * 0.45
          });
        }
      }

      // Spawn celebratory spores / ink splatters / golden pollen with orbital tangential velocity
      const theme = this.getTheme();
      const count = isTripleBloom ? (this.isMobile ? 14 : 24) : this.isMobile ? 8 : 12;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (isTripleBloom ? 140 : 75) * (0.4 + Math.random() * 0.8);
        this.burstParticles.push({
          xOffset: dir * 16,
          yWorld,
          vx: Math.cos(angle) * speed - dir * 55,
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
      const snapCount = this.isMobile ? 12 : 20;
      for (let i = 0; i < snapCount; i++) {
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
     * Steps the 3D orbital camera angle (cameraOrbitAngle) around the vertical axis of the climbing vine.
     */
    stepCameraMotion(dtMs) {
      const dtSec = Math.min(0.05, Math.max(0.001, (dtMs || 16) / 1000));
      const springK = 44;
      const damping = 11.2;
      const err = (this.cameraOrbitAngle || 0) - (this.targetOrbitAngle || 0);
      const accel = -springK * err - damping * (this.orbitAngularVel || 0);
      this.orbitAngularVel = (this.orbitAngularVel || 0) + accel * dtSec;
      this.cameraOrbitAngle = (this.cameraOrbitAngle || 0) + this.orbitAngularVel * dtSec;
    }

    /**
     * Returns live 3D cylindrical orbital motion state for the DOM #foveal-anchor
     * so the word fork swivels horizontally in 3D around the vine without tilting the screen.
     */
    getCameraMotionState() {
      const angVel = this.orbitAngularVel || 0;
      // Smooth 3D Y-axis swivel and horizontal orbital lead during the spin
      const orbitYawDeg = Math.max(-22, Math.min(22, angVel * 2.4));
      const tipScreenOffsetX = Math.max(-20, Math.min(20, angVel * 1.8));
      return {
        tipScreenOffsetX,
        orbitYawDeg,
        rollDeg: 0
      };
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
    render(
      simState,
      dtMs,
      risingSapNextZone = 0,
      showGhostThirdNode = false,
      isActiveReverseGraft = false,
      isActiveRapidFire = false,
      stepsUntilRapidFire = 0,
      isActiveWind = false,
      windDirection = 1
    ) {
      if (simState && simState.status === 'PLAYING') {
        this.stepAdaptiveResolution(dtMs);
      }
      const ctx = this.ctx;
      const theme = this.getTheme();
      const nowMs = performance.now();
      this.lastSimState = simState;

      // Smoothly ramp wind intensity in/out over ~300ms when entering/exiting a 2-3 node Wind Gust
      const targetWind = isActiveWind ? 1 : 0;
      const stepFactor = Math.min(1, Math.max(4, dtMs || 16) * 0.0085);
      this.windIntensity = (this.windIntensity || 0) + (targetWind - (this.windIntensity || 0)) * stepFactor;
      if (isActiveWind && windDirection) {
        this.windDirection = windDirection;
      }

      // Advance 3D orbital spin around the central climbing vine
      this.stepCameraMotion(dtMs, nowMs);

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // 1. Velocity Desaturation factor (> 180 u/s dims & blurs background up to 20%)
      const vCam = simState ? simState.vCam : 45;
      const velocityDesat = Math.max(0, Math.min(1, (vCam - 180) / 100));

      // 2. Draw 360° Cylindrical Panorama Background & Theme Atmosphere
      this.drawBackground(ctx, theme, simState, velocityDesat, nowMs, isActiveReverseGraft);

      // 3. Draw Soft Center Gutter Vignette to protect word fork readability
      this.drawQuietCenterGutter(ctx, theme, velocityDesat);

      // 4. Draw Peripheral Reactive Particles & Wind Gust Slipstreams / Tumbling Leaves
      this.drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs, isActiveRapidFire);
      if (this.windIntensity > 0.02) {
        this.drawWindGustAtmosphere(ctx, theme, nowMs, this.windIntensity, this.windDirection || 1);
      }

      // 5. Draw the 3D Cylindrical Climbing Vine Stem, Orbiting Tendrils/Leaves, Rising Sap Vein & Blooms
      if (simState) {
        this.drawClimbingVine(
          ctx,
          theme,
          simState,
          risingSapNextZone,
          nowMs,
          showGhostThirdNode,
          isActiveReverseGraft,
          isActiveRapidFire,
          stepsUntilRapidFire
        );
        this.drawBurstParticles(ctx, simState, dtMs);
        this.drawDangerVignette(ctx, theme, simState, nowMs);
      }

      ctx.restore();
    }

    drawBackground(ctx, theme, simState, velocityDesat, nowMs, isActiveReverseGraft = false) {
      const yCam = simState ? simState.yCam : 0;
      // 0.2x Slow-Scroll Parallax altitude factor + 360° cylindrical panorama shift from cameraOrbitAngle
      const parallaxY = yCam * 0.2;
      const orbitAngle = this.cameraOrbitAngle || 0;
      const panoShiftX = -orbitAngle * 220;
      const altitudeBlend = Math.max(0, Math.min(1, parallaxY / 900));

      // Apply 20% dimming at terminal velocity and reuse cached CanvasGradient when quantized altitude/dim match
      const dim = 1 - velocityDesat * 0.22;
      const bgKey =
        (theme.id << 16) |
        (Math.round(altitudeBlend * 64) << 6) |
        Math.round(velocityDesat * 24);

      if (this._lastBgKey !== bgKey || !this._cachedBgGrad) {
        this._lastBgKey = bgKey;
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
          `rgb(${Math.round(topColor[0] * dim)}, ${Math.round(topColor[1] * dim)}, ${Math.round(topColor[2] * dim)})`
        );
        grad.addColorStop(
          1,
          `rgb(${Math.round(bottomColor[0] * dim)}, ${Math.round(bottomColor[1] * dim)}, ${Math.round(bottomColor[2] * dim)})`
        );
        this._cachedBgGrad = grad;

        if (theme.id === 1 || theme.id === 3) {
          const rayGrad = ctx.createLinearGradient(0, 0, this.width * 0.35, this.height * 0.7);
          rayGrad.addColorStop(
            0,
            theme.id === 1
              ? `rgba(255, 236, 179, ${0.14 * dim})`
              : `rgba(255, 252, 235, ${0.38 * dim})`
          );
          rayGrad.addColorStop(1, 'rgba(255, 236, 179, 0)');
          this._cachedRayGrad = rayGrad;
        }
      }

      ctx.fillStyle = this._cachedBgGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Theme-specific 360° cylindrical panorama silhouettes that revolve around as you spin around the vine
      if (theme.id === 0) {
        // Midnight Bioluminescence: Starlit canopy revolving around the vine cylinder (batched into 1 path)
        ctx.fillStyle = `rgba(255, 255, 255, ${(isActiveReverseGraft ? 0.34 : 0.16) + altitudeBlend * 0.45})`;
        const starCount = this.isMobile ? 22 : 36;
        ctx.beginPath();
        for (let i = 0; i < starCount; i++) {
          const sx = (((i * 197 + panoShiftX * (0.6 + (i % 3) * 0.25)) % this.width) + this.width) % this.width;
          if (sx > this.width * 0.32 && sx < this.width * 0.68) continue;
          const sy = (i * 131 + parallaxY * 0.35) % this.height;
          const r = i % 3 === 0 ? 1.8 : 1.1;
          ctx.moveTo(sx + r, sy);
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
        }
        ctx.fill();

        if (isActiveReverseGraft && !this.isMobile) {
          // Bioluminescent Reverse-Graft Loop atmospheric aura
          const pulse = 0.7 + 0.3 * Math.sin(nowMs * 0.005);
          const bioGlow = ctx.createRadialGradient(
            this.width * 0.5,
            this.height * 0.45,
            40,
            this.width * 0.5,
            this.height * 0.5,
            this.width * 0.7
          );
          bioGlow.addColorStop(0, `rgba(45, 212, 191, ${0.14 * pulse})`);
          bioGlow.addColorStop(0.55, `rgba(192, 132, 252, ${0.08 * pulse})`);
          bioGlow.addColorStop(1, 'rgba(4, 10, 22, 0)');
          ctx.fillStyle = bioGlow;
          ctx.fillRect(0, 0, this.width, this.height);
        }
      } else if (theme.id === 1 || theme.id === 3) {
        // Sunlit Conservatory & Meadow: 360° glasshouse ribs & columns batched into a single path
        ctx.strokeStyle =
          theme.id === 1
            ? `rgba(255, 240, 210, ${0.12 * (1 - velocityDesat * 0.4)})`
            : `rgba(74, 124, 89, ${0.10 * (1 - velocityDesat * 0.4)})`;
        ctx.lineWidth = 2;
        const archSpacing = 220;
        const offset = (parallaxY * 0.4) % archSpacing;
        const ribOrbitWave = Math.sin(orbitAngle) * 34;
        ctx.beginPath();
        for (let y = -archSpacing + offset; y < this.height + archSpacing; y += archSpacing) {
          // Left conservatory rib
          ctx.moveTo(0, y + ribOrbitWave * 0.35);
          ctx.quadraticCurveTo(this.width * 0.22 + ribOrbitWave * 0.5, y - 60, this.width * 0.28 + ribOrbitWave * 0.4, y + 40);
          // Right conservatory rib
          ctx.moveTo(this.width, y - ribOrbitWave * 0.35);
          ctx.quadraticCurveTo(this.width * 0.78 + ribOrbitWave * 0.5, y - 60, this.width * 0.72 + ribOrbitWave * 0.4, y + 40);
        }
        ctx.stroke();

        // Diagonal shafts of volumetric sunlight (reusing cached gradient)
        const rayAngleShift = Math.sin(altitudeBlend * Math.PI) * 40;
        if (this._cachedRayGrad) {
          ctx.fillStyle = this._cachedRayGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(this.width * 0.28 + rayAngleShift, 0);
          ctx.lineTo(this.width * 0.12 + rayAngleShift, this.height);
          ctx.lineTo(0, this.height);
          ctx.closePath();
          ctx.fill();
        }
      } else if (theme.id === 2) {
        // Ukiyo-e Ink & Sakura: Layered mountain washes & subtle washi grain
        const ridgeOffset = (parallaxY * 0.25) % 360;
        ctx.fillStyle = altitudeBlend > 0.6 ? 'rgba(30, 20, 40, 0.22)' : 'rgba(120, 105, 95, 0.12)';
        // Left & Right mountain silhouettes batched
        ctx.beginPath();
        ctx.moveTo(0, this.height);
        ctx.lineTo(0, this.height * 0.35 + ridgeOffset * 0.2);
        ctx.quadraticCurveTo(this.width * 0.18, this.height * 0.42, this.width * 0.32, this.height);
        ctx.closePath();
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

      // 3. Converging Radial Perspective Sightlines toward the Deep Ground Vanishing Point (batched)
      const rayCount = 8;
      ctx.strokeStyle =
        theme.id === 0
          ? `rgba(94, 234, 212, ${0.09 * pitchProgress})`
          : `rgba(74, 124, 89, ${0.08 * pitchProgress})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= rayCount; i++) {
        const frac = i / rayCount;
        if (frac > 0.32 && frac < 0.68) continue; // Keep center word gutter clean
        const startX = frac * this.width;
        const startY = horizonY + Math.abs(frac - 0.5) * curveArch * 1.1;
        ctx.moveTo(startX, startY);
        ctx.lineTo(centerX + (startX - centerX) * 0.18, vanishY);
      }
      ctx.stroke();

      // 4. Receding Elliptical Depth Rings Looking Down the Vine Shaft
      const ringCount = this.isMobile ? 4 : 5;
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
      if (!this.cachedGutterGrad) {
        const grad = ctx.createLinearGradient(
          centerX - gutterHalfWidth * 1.4,
          0,
          centerX + gutterHalfWidth * 1.4,
          0
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.25, theme.quietGutterColor);
        grad.addColorStop(0.75, theme.quietGutterColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.cachedGutterGrad = grad;
      }

      ctx.fillStyle = this.cachedGutterGrad;
      ctx.fillRect(centerX - gutterHalfWidth * 1.4, 0, gutterHalfWidth * 2.8, this.height);
    }

    drawPeripheralReactivity(ctx, theme, simState, velocityDesat, nowMs, isActiveRapidFire = false) {
      const yCam = simState ? simState.yCam : 0;
      const zoneId = simState ? simState.zoneId : 1;
      const leadUnits = simState ? simState.yVine - simState.yCam : 360;

      const wInt = this.windIntensity || 0;
      const wDir = this.windDirection || 1;
      const orbitAngle = this.cameraOrbitAngle || 0;
      const orbitVel = this.orbitAngularVel || 0;

      ctx.save();
      ctx.lineCap = 'round';
      for (let idx = 0; idx < this.ambientParticles.length; idx++) {
        const p = this.ambientParticles[idx];
        const windDriftX = wInt > 0.01 ? nowMs * 0.24 * wDir * p.speedFactor * wInt : 0;
        const orbitalShiftX = -orbitAngle * 230 * (0.45 + p.speedFactor * 0.65);
        const rawPx = p.xNorm * this.width + Math.sin(nowMs * 0.0012 + p.phase) * 14 + windDriftX + orbitalShiftX;
        const px = ((rawPx % this.width) + this.width) % this.width;
        const speedMult = isActiveRapidFire ? 0.55 : 0.25;
        const py = ((p.yWorld - yCam * speedMult * p.speedFactor) % this.height + this.height) % this.height;

        if (Math.abs(orbitVel) > 0.55) {
          // Orbital camera spin: peripheral particles stretch into horizontal orbital spin streaks!
          const spinStreak = Math.max(-36, Math.min(36, orbitVel * 5.2 * p.speedFactor));
          ctx.strokeStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.85;
          ctx.lineWidth = p.radius * 1.1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + spinStreak, py);
          ctx.stroke();
        } else if (wInt > 0.15) {
          // Wind Gust: particles stretch into angled wind-blown streaks!
          const gustLen = (16 + 22 * p.speedFactor) * wInt;
          ctx.strokeStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.85;
          ctx.lineWidth = p.radius * 1.1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - gustLen * wDir, py + gustLen * 0.22);
          ctx.stroke();
        } else if (isActiveRapidFire || (theme.id === 0 && (zoneId === 3 || velocityDesat > 0.2))) {
          // Rapid-Fire Sprint (☀️ Sunlit) or Biolum Zone 3: Out-of-focus dust/fireflies stretch into vertical speed streaks!
          const streakLen = isActiveRapidFire ? 24 : 14 + velocityDesat * 42;
          ctx.strokeStyle = isActiveRapidFire ? '#FDE68A' : theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.82;
          ctx.lineWidth = p.radius * 1.15;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + streakLen);
          ctx.stroke();
        } else if (theme.id === 2) {
          // Sakura blossom petals drifting in periphery
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(nowMs * 0.0015 + idx);
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * 0.8;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.6, p.radius * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Soft bokeh fireflies (Biolum) or golden conservatory dust motes (Conservatory / Meadow)
          ctx.fillStyle = theme.particleColor;
          ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(nowMs * 0.003 + p.phase));
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Ukiyo-e special reactivity: Swirling cherry blossom petals along bottom bezel when viewport is close!
      if (theme.id === 2 && leadUnits < 220) {
        const dangerIntensity = 1 - Math.max(0, leadUnits / 220);
        const petalCount = Math.floor((this.isMobile ? 8 : 12) * dangerIntensity);
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

    /**
     * Draws sweeping curved canopy wind-gust slipstreams and tumbling wind-blown leaves
     * across the environment during a 2-3 node Wind-Ruffled Gust.
     */
    drawWindGustAtmosphere(ctx, theme, nowMs, windIntensity, windDir = 1) {
      ctx.save();
      ctx.lineCap = 'round';

      // 1. Sweeping S-curve translucent wind-gust ribbons across the viewport
      const ribbonCount = this.isMobile ? 4 : 7;
      for (let i = 0; i < ribbonCount; i++) {
        const travel = ((nowMs * 0.00055 * (0.8 + (i % 3) * 0.22) + i * 0.19) % 1 + 1) % 1;
        const progressX = windDir > 0 ? travel : 1 - travel;
        const startX = progressX * (this.width + 260) - 130;
        const baseY = ((i + 0.5) / ribbonCount) * this.height + Math.sin(nowMs * 0.003 + i) * 24;
        const len = (130 + (i % 3) * 55) * windIntensity;
        const wave = Math.sin(nowMs * 0.006 + i * 1.4) * 18;
        const envAlpha = Math.sin(travel * Math.PI) * 0.34 * windIntensity;

        ctx.strokeStyle = theme.id === 0 ? '#5EEAD4' : '#F0FDFA';
        ctx.lineWidth = 2.2 + (i % 2) * 1.1;
        ctx.globalAlpha = envAlpha;
        ctx.beginPath();
        ctx.moveTo(startX, baseY);
        ctx.bezierCurveTo(
          startX + len * 0.35 * windDir,
          baseY - wave,
          startX + len * 0.7 * windDir,
          baseY + wave,
          startX + len * windDir,
          baseY - wave * 0.4
        );
        ctx.stroke();
      }

      // 2. Tumbling wind-blown botanical leaves carried across the canopy
      const leafCount = this.isMobile ? 5 : 9;
      for (let j = 0; j < leafCount; j++) {
        const t = ((nowMs * 0.00042 * (0.75 + (j % 4) * 0.18) + j * 0.13) % 1 + 1) % 1;
        const lx = (windDir > 0 ? t : 1 - t) * (this.width + 120) - 60;
        const ly =
          ((j * 97 + Math.sin(nowMs * 0.004 + j) * 38) % (this.height * 0.88)) +
          this.height * 0.06;
        const spin = nowMs * 0.007 * windDir + j * 1.7;
        const leafAlpha = Math.sin(t * Math.PI) * 0.72 * windIntensity;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(spin);
        ctx.globalAlpha = leafAlpha;
        ctx.fillStyle = j % 2 === 0 ? theme.leafColor : theme.stemZones[1].main;
        ctx.strokeStyle = theme.leafHighlight;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(8, -6, 15, 0);
        ctx.quadraticCurveTo(8, 6, 0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    drawClimbingVine(
      ctx,
      theme,
      simState,
      risingSapNextZone,
      nowMs,
      showGhostThirdNode = false,
      isActiveReverseGraft = false,
      isActiveRapidFire = false,
      stepsUntilRapidFire = 0
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

      // Filter anchors near visible world range plus active tip using zero-allocation index windowing
      const maxVisible = this.isMobile ? 9 : 13;
      const totalAnchors = this.stemAnchors.length;
      let startAnchorIdx = totalAnchors;
      for (let i = 0; i < totalAnchors; i++) {
        if (this.stemAnchors[i].yWorld >= yCam - 220) {
          startAnchorIdx = i;
          break;
        }
      }
      if (totalAnchors - startAnchorIdx > maxVisible) {
        startAnchorIdx = totalAnchors - maxVisible;
      }

      const wInt = this.windIntensity || 0;
      const wDir = this.windDirection || 1;
      const orbitAngle = this.cameraOrbitAngle || 0;
      const orbitVel = this.orbitAngularVel || 0;

      // Populate pre-allocated 3D cylindrical spline points pool (zero per-frame GC allocations)
      const points = this._visiblePointsView;
      points.length = 0;
      let ptCursor = 0;
      const breezeFreq = 0.0018 + wInt * 0.0045;
      const breezeAmp = 4 + wInt * 14;
      const windLean = wInt * wDir * 10;

      for (let i = startAnchorIdx; i < totalAnchors; i++) {
        const a = this.stemAnchors[i];
        const idx = i - startAnchorIdx;
        const sy = this.worldToScreenY(a.yWorld, yCam, simState);
        const dScale = getDepthScale(sy);
        const breeze = Math.sin(nowMs * breezeFreq + idx * 0.55) * breezeAmp + windLean;

        const nodeTheta = a.theta !== undefined ? a.theta : idx * 0.95;
        const nodeRadius = a.radius !== undefined ? a.radius : 22;
        const phi = nodeTheta - orbitAngle;
        const xCyl = Math.sin(phi) * nodeRadius;
        const zCyl = Math.cos(phi);

        let ptObj = this._pointsPool[ptCursor];
        if (!ptObj) {
          ptObj = {};
          this._pointsPool[ptCursor] = ptObj;
        }
        ptObj.x = centerX + (xCyl + breeze) * dScale;
        ptObj.y = sy;
        ptObj.scale = dScale;
        ptObj.phi = phi;
        ptObj.zCyl = zCyl;
        ptObj.yWorld = a.yWorld;
        ptObj.zoneId = a.zoneId;
        ptObj.anchor = a;
        points.push(ptObj);
        ptCursor++;
      }

      // Active growing tip point (stays centered on the vine axis, with subtle orbital lead during spin)
      const tipScale = getDepthScale(tipScreenY);
      const tipWindSway =
        wInt > 0.01
          ? (Math.sin(nowMs * 0.0068) * 11 + wDir * 8) * wInt * tipScale
          : 0;
      const tipOrbitalLead = Math.max(-18, Math.min(18, orbitVel * 1.6)) * tipScale;
      let tipObj = this._pointsPool[ptCursor];
      if (!tipObj) {
        tipObj = {};
        this._pointsPool[ptCursor] = tipObj;
      }
      tipObj.x = centerX + tipOrbitalLead + tipWindSway;
      tipObj.y = tipScreenY;
      tipObj.scale = tipScale;
      tipObj.phi = 0;
      tipObj.zCyl = 1;
      tipObj.yWorld = yVine;
      tipObj.zoneId = simState.zoneId;
      tipObj.anchor = null;
      points.push(tipObj);

      if (points.length < 2) return;

      const activePalette = theme.stemZones[simState.zoneId] || theme.stemZones[1];

      // Helper to render a node's orbiting leaves, tendrils & blooms in either the back pass (z < 0) or front pass (z >= 0)
      const renderNodeAttachments = (isFrontPass) => {
        for (let idx = 0; idx < points.length; idx++) {
          const pt = points[idx];
          if (!pt.anchor) continue;
          const isFront = pt.zCyl >= 0;
          if (isFront !== isFrontPass) continue;

          const swayAngle =
            Math.sin(nowMs * (0.0025 + wInt * 0.011) + idx * 1.2) * (0.09 + wInt * 0.25) +
            wInt * wDir * 0.16;
          // Nodes on the back of the 3D vine cylinder scale down slightly and dim for true 3D occlusion
          const depthFactor = isFront ? 0.92 + 0.14 * pt.zCyl : 0.72 + 0.18 * (1 + pt.zCyl);
          const s = (pt.scale || 1) * depthFactor;
          // Project attachment orientation around the cylinder so leaves swing from left to right as you orbit!
          const orbitSideSin = Math.sin(pt.phi);
          const dynamicSide = Math.abs(orbitSideSin) > 0.18 ? Math.sign(orbitSideSin) : (pt.anchor.tendrilSide || 1);

          ctx.save();
          if (!isFront) {
            ctx.globalAlpha = 0.62;
          }
          if (pt.anchor.hasTendril) {
            this.drawCurlingTendril(
              ctx,
              activePalette.secondary,
              pt.x + orbitSideSin * 5 * s,
              pt.y,
              dynamicSide,
              swayAngle,
              s
            );
          }
          if (pt.anchor.hasLeafLeft) {
            const leafPhiL = pt.phi - 0.85;
            const sideL = Math.sin(leafPhiL) >= 0 ? 1 : -1;
            const reachL = Math.sin(leafPhiL) * 8 * s;
            this.drawBotanicalLeaf(ctx, theme, pt.x + reachL, pt.y, sideL, swayAngle, s);
          }
          if (pt.anchor.hasLeafRight) {
            const leafPhiR = pt.phi + 0.85;
            const sideR = Math.sin(leafPhiR) >= 0 ? 1 : -1;
            const reachR = Math.sin(leafPhiR) * 8 * s;
            this.drawBotanicalLeaf(ctx, theme, pt.x + reachR, pt.y, sideR, -swayAngle, s);
          }
          if (pt.anchor.isReverseGraft) {
            this.drawReverseGraftRing(ctx, theme, activePalette, pt.x, pt.y, s, nowMs, false);
          }
          if (pt.anchor.isRapidFire) {
            this.drawRapidFireActiveBooster(ctx, pt.x, pt.y, s * 0.72, nowMs, true);
          }
          if (pt.anchor.isBloom) {
            const ageMs = nowMs - (pt.anchor.bloomTimestamp || 0);
            const scale = Math.min(1, ageMs / 280) * s;
            this.drawTripleBloomFlower(ctx, theme, pt.x + orbitSideSin * 4 * s, pt.y, scale, nowMs);
          }
          ctx.restore();
        }
      };

      // PASS 0: Back-half of 3D Orbital Spin Slipstream Rings (drawn behind the vine trunk during a spin)
      if (Math.abs(orbitVel) > 0.25) {
        this.drawVineOrbitalSpinArcs(ctx, points, activePalette, orbitAngle, orbitVel, false);
      }

      // PASS 1: Historical Leaves, Tendrils & Blooms currently rotated to the BACK side of the vine cylinder (z < 0)
      renderNodeAttachments(false);

      // PASS 2: Batched 3D Cylindrical Vine Stem Pipeline (Zero expensive shadowBlur shaders!)
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const segCount = points.length - 1;
      const segs = this._segsPool;
      let avgSegScale = 0;

      for (let i = 0; i < segCount; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const segScale = (p0.scale + p1.scale) * 0.5;
        avgSegScale += segScale;
        const midX = (p0.x + p1.x) * 0.5;
        const midY = (p0.y + p1.y) * 0.5;
        const braidAngle0 = p0.yWorld * 0.015 - orbitAngle;
        const braidAngle1 = p1.yWorld * 0.015 - orbitAngle;
        const braidMidAngle = (braidAngle0 + braidAngle1) * 0.5;
        const braidRadius = 15 * segScale;
        const b0x = p0.x + Math.sin(braidAngle0) * braidRadius;
        const b1x = p1.x + Math.sin(braidAngle1) * braidRadius;
        const bMidX = midX + Math.sin(braidMidAngle) * braidRadius * 1.25;
        const braidInFront = Math.cos(braidMidAngle) >= 0;
        const stemW = (theme.id === 2 ? 10 : 9) * segScale;
        const veinShift = Math.sin(braidMidAngle + 1.2) * (stemW * 0.22);

        let segObj = segs[i];
        if (!segObj) {
          segObj = {};
          segs[i] = segObj;
        }
        segObj.p0 = p0;
        segObj.p1 = p1;
        segObj.segScale = segScale;
        segObj.midX = midX;
        segObj.midY = midY;
        segObj.b0x = b0x;
        segObj.b1x = b1x;
        segObj.bMidX = bMidX;
        segObj.braidInFront = braidInFront;
        segObj.stemW = stemW;
        segObj.veinShift = veinShift;
        segObj.isSnippedTip = simState.status === 'SNIPPED' && i === segCount - 1;
      }
      avgSegScale = segCount > 0 ? avgSegScale / segCount : 1;

      // 2A. Batched Back-Side Helical Braided Vine (all segments passing behind the main stem)
      ctx.strokeStyle = activePalette.secondary;
      ctx.lineWidth = (theme.id === 2 ? 10.5 : 9.2) * avgSegScale;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      for (let i = 0; i < segCount; i++) {
        const s = segs[i];
        if (!s.braidInFront) {
          ctx.moveTo(s.b0x, s.p0.y);
          ctx.quadraticCurveTo(s.bMidX, s.midY, s.b1x, s.p1.y);
        }
      }
      ctx.stroke();

      // 2B. Fast Hardware-Accelerated Outer Bioluminescent / Botanical Halo (replaces GPU-stalling shadowBlur)
      ctx.strokeStyle = activePalette.main;
      ctx.lineWidth = ((theme.id === 2 ? 10 : 9) + (theme.id === 0 ? 10 : 5)) * avgSegScale;
      ctx.globalAlpha = theme.id === 0 ? 0.22 : 0.12;
      ctx.beginPath();
      for (let i = 0; i < segCount; i++) {
        const s = segs[i];
        ctx.moveTo(s.p0.x, s.p0.y);
        ctx.quadraticCurveTo(s.midX, s.midY, s.p1.x, s.p1.y);
      }
      ctx.stroke();

      // 2C. Batched Primary 3D Cylindrical Botanical Stem
      ctx.globalAlpha = 1;
      ctx.strokeStyle = activePalette.main;
      ctx.lineWidth = (theme.id === 2 ? 10 : 9) * avgSegScale;
      ctx.beginPath();
      for (let i = 0; i < segCount; i++) {
        const s = segs[i];
        if (!s.isSnippedTip) {
          ctx.moveTo(s.p0.x, s.p0.y);
          ctx.quadraticCurveTo(s.midX, s.midY, s.p1.x, s.p1.y);
        }
      }
      ctx.stroke();

      if (simState.status === 'SNIPPED' && segCount > 0) {
        const lastSeg = segs[segCount - 1];
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = lastSeg.stemW;
        ctx.beginPath();
        ctx.moveTo(lastSeg.p0.x, lastSeg.p0.y);
        ctx.quadraticCurveTo(lastSeg.midX, lastSeg.midY, lastSeg.p1.x, lastSeg.p1.y);
        ctx.stroke();
      }

      // 2D. Batched 3D Revolving Helical Bark / Sap Bands across the cylindrical trunk (1 draw call for all bands!)
      const bandCount = this.isMobile ? 2 : 3;
      const phaseNorm = (((-orbitAngle * 1.4) % (Math.PI * 2)) + Math.PI * 2) / (Math.PI * 2);
      ctx.strokeStyle = activePalette.vein;
      ctx.lineWidth = Math.max(1.2, 2.0 * avgSegScale);
      ctx.globalAlpha = 0.42;
      ctx.beginPath();
      for (let i = 0; i < segCount; i++) {
        const s = segs[i];
        const halfW = s.stemW * 0.48;
        for (let b = 0; b < bandCount; b++) {
          const t = ((b + phaseNorm) / bandCount) % 1;
          const by = s.p0.y + (s.p1.y - s.p0.y) * t;
          const bx = s.p0.x + (s.p1.x - s.p0.x) * t;
          ctx.moveTo(bx - halfW, by + 4 * s.segScale);
          ctx.quadraticCurveTo(bx, by - 3 * s.segScale, bx + halfW, by - 4 * s.segScale);
        }
      }
      ctx.stroke();

      // 2E. Batched Rising Sap Center Vein
      const sapPalette =
        risingSapNextZone > 0 && theme.stemZones[risingSapNextZone]
          ? theme.stemZones[risingSapNextZone]
          : null;
      const rapidSapCharge = isActiveRapidFire || stepsUntilRapidFire > 0;
      const pulseSpeed = rapidSapCharge ? 0.016 : 0.008;
      const pulse = 0.58 + 0.42 * Math.sin(nowMs * pulseSpeed);
      ctx.strokeStyle = rapidSapCharge
        ? '#FEF08A'
        : sapPalette
          ? sapPalette.main
          : activePalette.vein;
      ctx.lineWidth = (rapidSapCharge ? 4.4 : sapPalette ? 4.2 : 2.5) * avgSegScale;
      ctx.globalAlpha = rapidSapCharge ? 0.88 * pulse : sapPalette ? 0.92 : 0.68 * pulse;
      ctx.beginPath();
      for (let i = 0; i < segCount; i++) {
        const s = segs[i];
        ctx.moveTo(s.p0.x + s.veinShift, s.p0.y);
        ctx.quadraticCurveTo(s.midX + s.veinShift, s.midY, s.p1.x + s.veinShift, s.p1.y);
      }
      ctx.stroke();

      // 2F. Batched Front-Side Helical Braided Vine (all segments crossing in front of the main stem)
      ctx.strokeStyle = activePalette.secondary;
      ctx.lineWidth = (theme.id === 2 ? 13 : 11.4) * avgSegScale;
      ctx.globalAlpha = 0.96;
      ctx.beginPath();
      for (let i = 0; i < segCount; i++) {
        const s = segs[i];
        if (s.braidInFront) {
          ctx.moveTo(s.b0x, s.p0.y);
          ctx.quadraticCurveTo(s.bMidX, s.midY, s.b1x, s.p1.y);
        }
      }
      ctx.stroke();
      ctx.restore();

      // 1b. Draw Upward Golden Speed Chevrons (▲ ▲ ▲) racing along the vine stem when Rapid-Fire is approaching or active
      if (isActiveRapidFire || stepsUntilRapidFire > 0) {
        this.drawStemSpeedChevrons(ctx, points, nowMs, isActiveRapidFire, stepsUntilRapidFire);
      }

      // PASS 3: Historical Leaves, Tendrils & Blooms currently on the FRONT side of the vine cylinder (z >= 0)
      renderNodeAttachments(true);

      // PASS 4: Front-half of 3D Orbital Spin Slipstream Rings wrapping across the front of the vine cylinder
      if (Math.abs(orbitVel) > 0.25) {
        this.drawVineOrbitalSpinArcs(ctx, points, activePalette, orbitAngle, orbitVel, true);
      }

      // 3. Draw Botanical Leaf & Blossom Collars at Zone Transitions & Golden Speed Gate Collars at Rapid-Fire Starts
      this.graftCollars.forEach((collar) => {
        if (collar.yWorld < yCam - 100 || collar.yWorld > yCam + 1100) return;
        const cy = this.worldToScreenY(collar.yWorld, yCam, simState);
        const cs = getDepthScale(cy);
        this.drawBotanicalLeaf(ctx, theme, centerX - 10 * cs, cy, -1, -0.2, cs);
        this.drawBotanicalLeaf(ctx, theme, centerX + 10 * cs, cy, 1, 0.2, cs);
        this.drawTripleBloomFlower(ctx, theme, centerX, cy, 0.9 * cs, nowMs);
      });

      this.rapidFireCollars.forEach((collar) => {
        if (collar.yWorld < yCam - 100 || collar.yWorld > yCam + 1100) return;
        const cy = this.worldToScreenY(collar.yWorld, yCam, simState);
        const cs = getDepthScale(cy);
        this.drawRapidFireActiveBooster(ctx, centerX, cy, cs * 1.05, nowMs, false);
      });

      // 4. Draw Sweeping S-Curve Active Fork Tendrils Toward Candidate Word Leaves
      const tipX = centerX + tipOrbitalLead + tipWindSway;
      const tipY = tipScreenY;
      const forkSpread = 1 + pitchProgress * 0.16;
      const forkLift = 1 - pitchProgress * 0.22;

      if (stepsUntilRapidFire > 0 && !isActiveRapidFire) {
        this.drawRapidFireVineGate(
          ctx,
          tipX,
          tipY,
          tipScale,
          forkLift,
          nowMs,
          stepsUntilRapidFire
        );
      }

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
      } else if (isActiveRapidFire) {
        this.drawRapidFireActiveBooster(
          ctx,
          tipX,
          tipY + 18 * tipScale,
          tipScale,
          nowMs,
          false
        );
      }

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 4.8 * tipScale;

      // Left & Right fork tendrils batched into a single path (without GPU-blocking shadowBlur)
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

        // Left & Right fork -> Subtle 3rd node bud above (batched)
        ctx.beginPath();
        ctx.moveTo(tipX - 68 * forkSpread, tipY - 64 * forkLift);
        ctx.quadraticCurveTo(tipX - 32 * forkSpread, tipY - 96 * forkLift, tipX, tipY - 118 * forkLift);
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
      ctx.fillStyle =
        simState.status === 'SNIPPED'
          ? '#EF4444'
          : isActiveReverseGraft
            ? '#F59E0B'
            : isActiveRapidFire
              ? '#FBBF24'
              : activePalette.vein;
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

      // Outer warm amber/gold loop aura when active (uses pre-rendered aura sprite instead of per-frame createRadialGradient)
      if (isActive) {
        const pulse = 0.72 + 0.28 * Math.sin(nowMs * 0.007);
        const auraR = radiusX * 1.45;
        const auras = this.getAuraSprites();
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.drawImage(auras.reverseGraft, -auraR, -auraR, auraR * 2, auraR * 2);
        ctx.restore();
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
     * Draws animated upward Golden Speed Chevrons (▲) racing along the vine stem
     * when a Rapid-Fire Sprint is approaching (stepsUntilRapidFire = 1..2) or active.
     */
    drawStemSpeedChevrons(ctx, points, nowMs, isActiveRapidFire, stepsUntilRapidFire) {
      if (!points || points.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const speed = isActiveRapidFire ? 0.0042 : 0.0028;
      const baseAlpha = isActiveRapidFire ? 0.88 : stepsUntilRapidFire === 1 ? 0.78 : 0.55;

      // Render chevrons on the top 4 visible stem segments leading up to the active fork
      const startSeg = Math.max(0, points.length - 5);
      for (let i = startSeg; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const segScale = (p0.scale + p1.scale) * 0.5;

        for (let c = 0; c < 2; c++) {
          const t = ((nowMs * speed + i * 0.35 + c * 0.5) % 1 + 1) % 1;
          const cx = p0.x + (p1.x - p0.x) * t;
          const cy = p0.y + (p1.y - p0.y) * t;
          const fade = Math.sin(t * Math.PI);
          const w = (isActiveRapidFire ? 11 : 9) * segScale;
          const h = (isActiveRapidFire ? 7 : 5.5) * segScale;

          ctx.strokeStyle = c === 0 ? '#FEF08A' : '#F59E0B';
          ctx.lineWidth = (isActiveRapidFire ? 2.6 : 2.1) * segScale;
          ctx.globalAlpha = baseAlpha * fade;
          ctx.beginPath();
          ctx.moveTo(cx - w, cy + h);
          ctx.lineTo(cx, cy - h * 0.6);
          ctx.lineTo(cx + w, cy + h);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    /**
     * Draws the active Golden Speed Booster Ring & Wing Chevrons straddling the vine stem
     * during the Zone 3 Rapid-Fire Sprint (⚡), or a compact booster marker on completed Rapid-Fire nodes.
     */
    drawRapidFireActiveBooster(ctx, x, y, scale = 1, nowMs = 0, isHistorical = false) {
      ctx.save();
      ctx.translate(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (isHistorical) {
        // Compact golden speed chevron badge on completed Rapid-Fire stem nodes
        const w = 13 * scale;
        const h = 7 * scale;
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.4 * scale;
        ctx.globalAlpha = 0.78;
        ctx.beginPath();
        ctx.moveTo(-w, h * 0.5);
        ctx.lineTo(0, -h * 0.7);
        ctx.lineTo(w, h * 0.5);
        ctx.stroke();
        ctx.restore();
        return;
      }

      const pulse = 0.75 + 0.25 * Math.sin(nowMs * 0.012);
      const ringRx = 38 * scale;
      const ringRy = 13 * scale;

      // Golden speed aura around the stem fork (uses pre-rendered aura sprite)
      const auraR = ringRx * 1.45;
      const auras = this.getAuraSprites();
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.drawImage(auras.rapidBooster, -auraR, -auraR, auraR * 2, auraR * 2);
      ctx.restore();

      // Horizontal golden booster ring straddling the vine stem
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 5.5 * scale;
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2.6 * scale;
      ctx.setLineDash([8 * scale, 6 * scale]);
      ctx.lineDashOffset = -(nowMs * 0.06) % 28;
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx * 0.94, ringRy * 0.94, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dual upward wing-chevrons (▲ ▲) pulsing above the booster ring
      for (let k = 0; k < 2; k++) {
        const lift = ((nowMs * 0.04 + k * 9) % 18) * scale;
        const alpha = (1 - lift / (18 * scale)) * 0.9;
        const cw = (22 - k * 4) * scale;
        const ch = 9 * scale;
        const cy = -6 * scale - lift;

        ctx.strokeStyle = k === 0 ? '#FEF08A' : '#F59E0B';
        ctx.lineWidth = 2.8 * scale;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(-cw, cy + ch);
        ctx.lineTo(0, cy - ch * 0.5);
        ctx.lineTo(cw, cy + ch);
        ctx.stroke();
      }

      ctx.restore();
    }

    /**
     * Draws an approaching Golden Speed Gate / Booster Ring directly on the upper vine path
     * 1 to 2 nodes BEFORE the Rapid-Fire Sprint starts, descending toward the active fork
     * so the player sees the Rapid-Fire Sprint approaching right on the vine!
     */
    drawRapidFireVineGate(ctx, tipX, tipY, tipScale, forkLift, nowMs, stepsUntilRapidFire) {
      // Position directly on the future vine path above the active fork:
      // 2 nodes away -> higher up the vine path; 1 node away -> right above the fork!
      const distAhead = (stepsUntilRapidFire === 1 ? 104 : 158) * forkLift;
      const gateY = Math.max(58, tipY - distAhead);
      const gateScale = tipScale * (stepsUntilRapidFire === 1 ? 1.02 : 0.88);
      const pulse = 0.76 + 0.24 * Math.sin(nowMs * (stepsUntilRapidFire === 1 ? 0.015 : 0.009));

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Future Vine Path Guide Line connecting active fork tip straight through the Speed Gate
      const pathGrad = ctx.createLinearGradient(tipX, tipY, tipX, gateY - 28 * gateScale);
      pathGrad.addColorStop(0, 'rgba(251, 191, 36, 0.65)');
      pathGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.85)');
      pathGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.strokeStyle = pathGrad;
      ctx.lineWidth = 3.4 * gateScale;
      ctx.setLineDash([6 * gateScale, 6 * gateScale]);
      ctx.lineDashOffset = (nowMs * 0.055) % 24;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX, gateY - 26 * gateScale);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Animated Upward Speed Chevrons (▲ ▲ ▲) racing along the future vine path into the gate
      const chevronCount = 3;
      for (let i = 0; i < chevronCount; i++) {
        const prog = ((nowMs * 0.0026 + i / chevronCount) % 1 + 1) % 1;
        const cy = tipY - 16 * gateScale - prog * (tipY - gateY - 10 * gateScale);
        const fade = Math.sin(prog * Math.PI);
        const cw = (11 + (1 - prog) * 4) * gateScale;
        const ch = 6.5 * gateScale;

        ctx.strokeStyle = i % 2 === 0 ? '#FEF08A' : '#F59E0B';
        ctx.lineWidth = 2.5 * gateScale;
        ctx.globalAlpha = fade * (stepsUntilRapidFire === 1 ? 0.92 : 0.72);
        ctx.beginPath();
        ctx.moveTo(tipX - cw, cy + ch);
        ctx.lineTo(tipX, cy - ch * 0.5);
        ctx.lineTo(tipX + cw, cy + ch);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 3. Golden Speed Gate Arch / Booster Ring straddling the vine path at (tipX, gateY)
      const ringRx = 52 * gateScale;
      const ringRy = 16 * gateScale;
      const gateAuraR = ringRx * 1.45;
      const auras = this.getAuraSprites();

      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.drawImage(
        auras.rapidGate,
        tipX - gateAuraR,
        gateY - gateAuraR,
        gateAuraR * 2,
        gateAuraR * 2
      );
      ctx.restore();

      // Outer golden-emerald gate ring
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 6 * gateScale;
      ctx.beginPath();
      ctx.ellipse(tipX, gateY, ringRx, ringRy, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner spinning sunlit track on the gate ring
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2.8 * gateScale;
      ctx.setLineDash([9 * gateScale, 6 * gateScale]);
      ctx.lineDashOffset = -(nowMs * 0.065) % 30;
      ctx.beginPath();
      ctx.ellipse(tipX, gateY, ringRx * 0.92, ringRy * 0.92, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Left & Right Golden Speed Wing Fins on the Gate
      const wingSpan = ringRx + 14 * gateScale;
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 3 * gateScale;
      ctx.beginPath();
      // Left wing chevron
      ctx.moveTo(tipX - ringRx + 2 * gateScale, gateY - 6 * gateScale);
      ctx.lineTo(tipX - wingSpan, gateY);
      ctx.lineTo(tipX - ringRx + 2 * gateScale, gateY + 6 * gateScale);
      // Right wing chevron
      ctx.moveTo(tipX + ringRx - 2 * gateScale, gateY - 6 * gateScale);
      ctx.lineTo(tipX + wingSpan, gateY);
      ctx.lineTo(tipX + ringRx - 2 * gateScale, gateY + 6 * gateScale);
      ctx.stroke();

      // 4. Crisp On-Vine Gate Badge ("⚡ SPEED BOOST NEXT!" or "⚡ SPEED BOOST IN 2")
      const label =
        stepsUntilRapidFire === 1
          ? '⚡ SPEED BOOST NEXT!'
          : '⚡ SPEED BOOST IN 2';
      const fontPx = Math.round(10.5 * gateScale);
      ctx.font = `800 ${fontPx}px "Plus Jakarta Sans", sans-serif`;
      const cacheKey = `${stepsUntilRapidFire}_${fontPx}`;
      let textWidth = this._gateLabelWidthCache[cacheKey];
      if (textWidth === undefined) {
        textWidth = ctx.measureText(label).width;
        this._gateLabelWidthCache[cacheKey] = textWidth;
      }
      const pillW = textWidth + 20 * gateScale;
      const pillH = 21 * gateScale;
      const pillX = tipX - pillW * 0.5;
      const pillY = gateY - ringRy - pillH - 5 * gateScale;

      // Badge pill background
      ctx.fillStyle = stepsUntilRapidFire === 1 ? 'rgba(120, 53, 15, 0.94)' : 'rgba(69, 26, 3, 0.86)';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 1.8 * gateScale;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(pillX, pillY, pillW, pillH, 999);
      } else {
        ctx.rect(pillX, pillY, pillW, pillH);
      }
      ctx.fill();
      ctx.stroke();

      // Badge label text
      ctx.fillStyle = '#FEF08A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, tipX, pillY + pillH * 0.52);

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
     * Draws a tapered botanical leaf with a central midrib vein using the cached 2.5x HiDPI sprite atlas
     */
    drawBotanicalLeaf(ctx, theme, x, y, side, swayAngle, scale = 1) {
      const sprites = this.getThemeSprites(theme);
      const sp = side < 0 ? sprites.leafLeft : sprites.leafRight;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(side * 0.55 + swayAngle);
      ctx.drawImage(sp.canvas, -34 * scale, -22 * scale, sp.w * scale, sp.h * scale);
      ctx.restore();
    }

    drawTripleBloomFlower(ctx, theme, x, y, scale, nowMs) {
      const sprites = this.getThemeSprites(theme);
      const sp = sprites.flower;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(nowMs * 0.0005);
      ctx.drawImage(sp.canvas, -28 * scale, -28 * scale, sp.w * scale, sp.h * scale);
      ctx.restore();
    }

    /**
     * Draws 3D elliptical orbital motion slipstreams wrapping around the climbing vine
     * when the camera spins clockwise or counter-clockwise around the stem.
     */
    drawVineOrbitalSpinArcs(ctx, points, palette, orbitAngle, orbitVel, isFrontHalf = true) {
      if (!points || points.length < 2) return;
      const intensity = Math.min(1, Math.abs(orbitVel) / 4.5);
      if (intensity <= 0.04) return;

      ctx.save();
      ctx.lineCap = 'round';
      const spinDir = orbitVel >= 0 ? 1 : -1;
      const startSeg = Math.max(0, points.length - 6);

      for (let i = startSeg; i < points.length; i++) {
        const pt = points[i];
        const s = pt.scale || 1;
        const rx = (38 + (i % 2) * 10) * s;
        const ry = (11 + (i % 2) * 3) * s;

        ctx.strokeStyle = i % 2 === 0 ? palette.vein : palette.secondary;
        ctx.lineWidth = (isFrontHalf ? 2.6 : 1.8) * s;
        ctx.globalAlpha = intensity * (isFrontHalf ? 0.58 : 0.28);

        ctx.beginPath();
        if (isFrontHalf) {
          // Front half of horizontal 3D orbit ring (0 to PI)
          const a0 = spinDir > 0 ? 0.15 : Math.PI * 0.1;
          const a1 = spinDir > 0 ? Math.PI * 0.9 : Math.PI * 0.85;
          ctx.ellipse(pt.x, pt.y, rx, ry, 0, a0, a1, false);
        } else {
          // Back half of horizontal 3D orbit ring (PI to 2*PI)
          ctx.ellipse(pt.x, pt.y, rx, ry, 0, Math.PI * 1.1, Math.PI * 1.9, false);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    drawBurstParticles(ctx, simState, dtMs) {
      if (this.burstParticles.length === 0) return;
      const dtSec = Math.max(0.001, dtMs / 1000);
      const centerX = this.width * 0.5;
      const yCam = simState.yCam;

      ctx.save();
      for (let i = this.burstParticles.length - 1; i >= 0; i--) {
        const p = this.burstParticles[i];
        p.xOffset += p.vx * dtSec;
        p.yWorld += p.vy * dtSec;
        p.life -= p.decay * dtSec;

        if (p.life <= 0) {
          this.burstParticles[i] = this.burstParticles[this.burstParticles.length - 1];
          this.burstParticles.pop();
          continue;
        }

        const sx = centerX + p.xOffset;
        const sy = this.worldToScreenY(p.yWorld, yCam);

        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    drawDangerVignette(ctx, theme, simState, nowMs) {
      if (!simState || simState.status !== 'PLAYING') return;
      const leadUnits = simState.yVine - simState.yCam;
      if (leadUnits > 150) return;

      const urgency = Math.max(0, Math.min(1, 1 - leadUnits / 150));
      const pulse = 0.65 + 0.35 * Math.sin(nowMs * (0.01 + urgency * 0.015));

      if (!this._cachedDangerGrad) {
        const grad = ctx.createRadialGradient(
          this.width * 0.5,
          this.height * 0.45,
          this.height * 0.25,
          this.width * 0.5,
          this.height * 0.5,
          this.height * 0.85
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(185, 28, 28, 0.58)');
        this._cachedDangerGrad = grad;
      }

      ctx.save();
      ctx.globalAlpha = urgency * pulse;
      ctx.fillStyle = this._cachedDangerGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // Creeping crimson roots in the bottom corners (batched into 1 stroke)
      ctx.globalAlpha = urgency * 0.75;
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      const rootReach = urgency * 130;

      ctx.beginPath();
      ctx.moveTo(0, this.height);
      ctx.quadraticCurveTo(rootReach * 0.6, this.height - rootReach * 0.8, rootReach, this.height - rootReach);
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
