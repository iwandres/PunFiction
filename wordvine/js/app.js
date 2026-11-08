/**
 * Word Vine — Main Client Application & Game Loop Controller
 * Coordinates:
 * - 120Hz Deterministic Physics Simulation + Interpolated HiDPI Canvas Rendering
 * - 120ms Input Buffer Queue (Desktop Left/Right Arrows & Mobile Split-Screen Touch)
 * - Foveal Choice Layout tracking Y_vine in real time + Zone 1 Triplet Pip Buds (● ● ○)
 * - Zero-Friction Anonymous Device Token + Player Handle Identity
 * - Official First-Attempt Daily Submission & Practice Replay Mode
 * - Daily / Weekly (Best 5 of 7) / Monthly (Top 20) Leaderboards
 */
(function () {
  'use strict';

  const Physics = window.WordVinePhysics;
  const Data = window.WordVineData;
  const Sound = window.WordVineSound;
  const RendererClass = window.WordVineRenderer;

  // Render API endpoint (uses https://punfiction.onrender.com in production, localhost:8000 locally)
  const API_BASE =
    window.WORDVINE_API_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8000/api/wordvine'
      : 'https://punfiction.onrender.com/api/wordvine');

  const FALLBACK_DAILY_THEMES = [
    {
      themeName: '🧁 Sweet Tooth & Kitchen Table',
      themeSubtitle: 'Peanut butter cups, cupcakes, tabletops, bell peppers, peppermint & punch bowls'
    },
    {
      themeName: '🌊 Ocean Tide & Stormy Skies',
      themeSubtitle: 'Seaweed, bedbugs, rainstorms, snowdrifts, driftwood & woodchucks'
    },
    {
      themeName: '🌲 Campfire & Woodland Trail',
      themeSubtitle: 'Campfires, pinecones, honeybees, beehives, waterfalls & wildcats'
    },
    {
      themeName: '🌻 Sunlit Garden & Greenhouse',
      themeSubtitle: 'Sunflowers, flowerpots, birdhouses, houseplants, blueberries & buttercups'
    },
    {
      themeName: '❄️ Winter Frost & Starlight',
      themeSubtitle: 'Snowflakes, icicles, starlight, lighthouses, moonbeams & nightcaps'
    },
    {
      themeName: '🚂 Workshop, Forge & Iron Rail',
      themeSubtitle: 'Railroads, roadblocks, chainsaws, sawdust, dustpans & windmills'
    },
    {
      themeName: '🏰 Castle Keep & Dragon Lore',
      themeSubtitle: 'Drawbridges, cobblestones, stonewalls, watchtowers, fireballs & swordfish'
    },
    {
      themeName: '🏈 Stadium Lights & Game Day',
      themeSubtitle: 'Touchdowns, basketballs, ballparks, scoreboards, boardwalks & racetracks'
    },
    {
      themeName: '🕵️ Midnight Mystery & Headlines',
      themeSubtitle: 'Footprints, passwords, newspapers, paperbacks, bookworms & timelines'
    },
    {
      themeName: '🎸 Neon Stage & Silver Screen',
      themeSubtitle: 'Spotlights, drumsticks, soundtracks, headphones, stagecoaches & showboats'
    },
    {
      themeName: '⚓ Harbor Watch & High Seas',
      themeSubtitle: 'Shipwrecks, coastlines, lifeboats, seashells, windstorms & thunderclouds'
    },
    {
      themeName: '🏡 Cozy Hearth & Homestead',
      themeSubtitle: 'Fireplaces, candlesticks, armchairs, bedrooms, doorsteps & farmyards'
    }
  ];

  const PALETTE_META = {
    0: { icon: '✨', short: 'Biolum', full: 'Midnight Biolum' },
    1: { icon: '☀️', short: 'Sunlit', full: 'Sunlit Glass' },
    2: { icon: '🌸', short: 'Sakura', full: 'Sakura Ink' },
    3: { icon: '🌿', short: 'Meadow', full: 'Meadow & Sage' }
  };

  const MAX_DAILY_ATTEMPTS = 3;

  // Variety of positive messages displayed once a player completes all 3 daily attempts
  const DAILY_COMPLETE_MESSAGES = [
    'Great attempts! Come back tomorrow for a new theme and new try to top the leaderboard.',
    'Fantastic climbing today! Rest your reflexes and return tomorrow for a fresh theme and 3 new tries at the top spot.',
    'Strong effort on the vine! Come back tomorrow to tackle a brand-new daily theme and chase #1 on the leaderboard.',
    'Way to battle the tricky compounds and Wind Gusts! See you tomorrow for a new theme and a fresh shot at the Daily Top 5.',
    'Three great climbs in the books! Come back tomorrow for a new compound theme and another run at the top of the leaderboard.',
    'Impressive speed on the vine today! Return tomorrow for a brand-new theme and 3 fresh attempts to claim the crown.',
    'Your compound instincts are getting sharper! Come back tomorrow for a new daily theme and a fresh climb up the leaderboard.',
    'Awesome work across all 3 runs! A brand-new theme sprouts tomorrow — come back rested and ready to top the board.'
  ];

  // Variety of encouraging messages between attempts (when 1, 2, or 3 tries remain)
  const DAILY_ACTIVE_MESSAGES = {
    3: [
      'You have 3 attempts today — chain nodes fast to climb high and beat the Daily Top 5!',
      '3 daily tries available! Link compound words quickly to climb higher on every pick.',
      'Ready to climb! Your best run out of 3 attempts today counts toward the Daily Top 5.'
    ],
    2: [
      'Nice first climb! You have 2 attempts left today to push your speed and top the leaderboard.',
      'Solid warm-up run! 2 daily attempts remaining — chain fast in Rapid-Fire to boost your height!',
      'Good read on the vine! You still have 2 tries today to beat the Daily Top 5.'
    ],
    1: [
      'One final attempt left today — make every compound count and go for the top spot!',
      'Final daily try! Stay sharp and sprint for maximum height!',
      "Last climb of the day — give it everything you've got to crack the Daily Top 5!"
    ]
  };

  class WordVineApp {
    constructor() {
      this.canvas = document.getElementById('vine-canvas');
      this.renderer = new RendererClass(this.canvas);

      // Identity (Zero sign-in friction: Anonymous Device Token + Handle)
      this.deviceToken = this.getOrCreateDeviceToken();
      this.playerHandle = this.getOrCreateHandle();

      // Active daily vine & simulation state (rotates across the 12 daily themes by calendar date; same puzzle for all players)
      this.dailyVines = this.loadAvailableVines();
      const rotation =
        typeof Data.getRotationForDate === 'function'
          ? Data.getRotationForDate(undefined, this.dailyVines.length)
          : {
              dateKey: new Date().toISOString().slice(0, 10),
              themeIndex: 0,
              vineNumber: 142
            };
      this.currentVineIndex = rotation.themeIndex % this.dailyVines.length;
      const baseVine = this.dailyVines[this.currentVineIndex] || this.dailyVines[0];
      this.activeVine = {
        ...baseVine,
        dateKey: rotation.dateKey,
        vineNumber: rotation.vineNumber
      };
      this.runAttemptCount = 0;
      this.rebuildActivePuzzle(0);
      this.simState = Physics.createSimulationState(0);

      // Replay telemetry for server-side verification
      this.runChoices = [];
      this.runDeltasMs = [];
      this.lastKeystrokeTimeMs = 0;

      // 120ms Input Buffer during growth spurt
      this.bufferedInput = null;
      this.lastChoiceTimeMs = 0;

      // DOM elements
      this.fovealAnchor = document.getElementById('foveal-anchor');
      this.fovealNode3Wrap = document.getElementById('foveal-node3-wrap');
      this.leftPill = document.getElementById('left-pill');
      this.rightPill = document.getElementById('right-pill');
      this.leftWordEl = document.getElementById('left-word');
      this.rightWordEl = document.getElementById('right-word');
      this.stemCard = document.getElementById('stem-card');
      this.stemReversePrefix = document.getElementById('stem-reverse-prefix');
      this.reverseLoopBanner = document.getElementById('reverse-loop-banner');
      this.reverseLoopBannerText = document.getElementById('reverse-loop-banner-text');
      this.rapidFireBanner = document.getElementById('rapid-fire-banner');
      this.rapidFireBannerText = document.getElementById('rapid-fire-banner-text');
      this.windGustBanner = document.getElementById('wind-gust-banner');
      this.windGustBannerText = document.getElementById('wind-gust-banner-text');
      this.stemWordEl = document.getElementById('stem-word');
      this.stemZoneBadge = document.getElementById('stem-zone-badge');
      this.tripletPipBar = document.getElementById('triplet-pip-bar');
      this.pipBuds = [
        document.getElementById('pip-1'),
        document.getElementById('pip-2'),
        document.getElementById('pip-3')
      ];
      this.pipConn1 = document.getElementById('pip-conn-1');
      this.pipConn2 = document.getElementById('pip-conn-2');
      this.pipLabel = document.getElementById('pip-label');
      this.showGhostThirdNode = true;
      this.isActiveReverseGraft = false;
      this.isActiveRapidFire = false;
      this.isActiveWind = false;
      this.activeWindDirection = 1;
      this.windSettleTimers = [];

      // Top HUD elements
      this.hudNodes = document.getElementById('hud-nodes');
      this.hudAltitude = document.getElementById('hud-altitude');
      this.hudVelocity = document.getElementById('hud-velocity');
      this.hudZone = document.getElementById('hud-zone');
      this.hudModeBadge = document.getElementById('hud-mode-badge');
      this.themeCycleBtn = document.getElementById('btn-theme-cycle');
      this.muteBtn = document.getElementById('btn-mute');
      this.leaderboardBtn = document.getElementById('btn-leaderboard');

      // Modals
      this.startModal = document.getElementById('start-modal');
      this.deathModal = document.getElementById('death-modal');
      this.leaderboardModal = document.getElementById('leaderboard-modal');
      this.tutorialModal = document.getElementById('tutorial-modal');
      this.previousModalBeforeTutorial = null;
      this.handleInput = document.getElementById('player-handle-input');

      this.lastFrameTimeMs = performance.now();
      this.init();
    }

    getOrCreateDeviceToken() {
      let token = localStorage.getItem('wordvine_device_token');
      if (!token) {
        token =
          'wv_' +
          Date.now().toString(36) +
          '_' +
          Math.random().toString(36).substring(2, 11);
        localStorage.setItem('wordvine_device_token', token);
      }
      return token;
    }

    getOrCreateHandle() {
      let handle = localStorage.getItem('wordvine_handle');
      if (!handle) {
        const prefixes = ['Briar', 'Canopy', 'Fern', 'Thorn', 'Orchid', 'Sakura', 'Moss', 'Ivy'];
        const suffixes = ['Sprinter', 'Climber', 'Runner', 'Tendril', 'Viper', 'Hopper', 'Botanist'];
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const s = suffixes[Math.floor(Math.random() * suffixes.length)];
        const num = Math.floor(10 + Math.random() * 89);
        handle = `${p}${s}${num}`;
        localStorage.setItem('wordvine_handle', handle);
      }
      return handle;
    }

    loadAvailableVines() {
      // Clear stale localStorage cache if lexicon version was upgraded
      if (Data.LEXICON_VERSION && localStorage.getItem('wordvine_lexicon_version') !== Data.LEXICON_VERSION) {
        localStorage.removeItem('wordvine_admin_vines');
        localStorage.removeItem('wordvine_official_2026-11-01');
        localStorage.setItem('wordvine_lexicon_version', Data.LEXICON_VERSION);
      }

      // Check if Admin Studio saved custom preview vines in localStorage
      try {
        const customRaw = localStorage.getItem('wordvine_admin_vines');
        if (customRaw) {
          const parsed = JSON.parse(customRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
      return Data.PRODUCTION_DAILY_VINES;
    }

    init() {
      // Pre-warm the Render backend service in the background
      fetch(`${API_BASE}/vine/today`, { mode: 'cors' })
        .then((res) => res.ok && res.json())
        .then((remoteVine) => {
          if (
            remoteVine &&
            remoteVine.lexiconVersion === Data.LEXICON_VERSION &&
            Array.isArray(remoteVine.zone1Triplets) &&
            remoteVine.zone1Triplets.length > 0
          ) {
            const existingIdx = this.dailyVines.findIndex((v) => v.dateKey === remoteVine.dateKey);
            if (existingIdx >= 0) {
              this.dailyVines[existingIdx] = remoteVine;
              if (this.currentVineIndex === existingIdx && this.simState.nodesCompleted === 0) {
                this.activeVine = this.dailyVines[existingIdx];
                this.rebuildActivePuzzle(this.runAttemptCount);
                this.syncFovealDOM();
              }
            }
          }
        })
        .catch(() => {});

      const params = new URLSearchParams(window.location.search);

      // Visual palette is defined exclusively by the active gameplay mode:
      // - Base Zone 1 Roots -> Meadow & Sage (id = 3)
      // - Reverse-Graft Loop (⬅) -> Midnight Bioluminescence (id = 0)
      // - Zone 3 Rapid-Fire Sprint (⚡) -> Sunlit Conservatory (id = 1)
      this.basePaletteId = 3;
      this.positiveMsgCursor = 0;
      this.setVisualPalette(3);
      this.renderer.resetVine(Physics.PHYSICS_CONFIG.INITIAL_Y_VINE, 1);
      this.updateMuteButtonLabel();

      if (this.handleInput) {
        this.handleInput.value = this.playerHandle;
        this.handleInput.addEventListener('change', () => {
          const cleaned = this.handleInput.value.trim().slice(0, 20) || this.playerHandle;
          this.playerHandle = cleaned;
          this.handleInput.value = cleaned;
          localStorage.setItem('wordvine_handle', cleaned);
        });
      }

      this.bindEvents();
      this.syncStartModalMetadata();
      this.syncFovealDOM();

      // If launched from Admin Studio with ?autostart=1, jump straight into the climb
      if (params.get('autostart') === '1') {
        const startZone = Number(params.get('zone')) || 1;
        const startNode = startZone === 3 ? 28 : startZone === 2 ? 12 : 0;
        this.startNewRun(startNode);
      }

      requestAnimationFrame((t) => this.loop(t));
    }

    bindEvents() {
      // Keyboard Controls (Left/Right Arrow or A/D)
      window.addEventListener('keydown', (e) => {
        if (document.activeElement === this.handleInput) return;

        if (e.key === 'Escape') {
          if (this.tutorialModal && !this.tutorialModal.classList.contains('hidden')) {
            e.preventDefault();
            this.closeTutorialModal();
            return;
          }
        }

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          this.handleBinaryInput(0);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          this.handleBinaryInput(1);
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (this.tutorialModal && !this.tutorialModal.classList.contains('hidden')) {
            e.preventDefault();
            this.closeTutorialModal();
          } else if (!this.startModal.classList.contains('hidden')) {
            e.preventDefault();
            this.startNewRun(0);
          }
        }
      });

      // Candidate Pill Direct Click / Touch
      this.leftPill.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.handleBinaryInput(0);
      });
      this.rightPill.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.handleBinaryInput(1);
      });

      // Mobile / Desktop Split-Screen Touch Halves
      const touchLeft = document.getElementById('touch-half-left');
      const touchRight = document.getElementById('touch-half-right');
      if (touchLeft) {
        touchLeft.addEventListener('pointerdown', () => this.handleBinaryInput(0));
      }
      if (touchRight) {
        touchRight.addEventListener('pointerdown', () => this.handleBinaryInput(1));
      }

      // Top HUD Buttons
      this.muteBtn.addEventListener('click', () => {
        Sound.toggleMute();
        this.updateMuteButtonLabel();
      });

      this.leaderboardBtn.addEventListener('click', () => {
        this.openLeaderboardModal('daily');
      });

      // Tutorial Modal Triggers
      const tutorialBtns = [
        document.getElementById('btn-tutorial'),
        document.getElementById('btn-explainer-tutorial'),
        document.getElementById('btn-start-tutorial')
      ];
      tutorialBtns.forEach((btn) => {
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openTutorialModal();
          });
        }
      });

      const closeTutorialBtn = document.getElementById('btn-close-tutorial');
      if (closeTutorialBtn) {
        closeTutorialBtn.addEventListener('click', () => {
          this.closeTutorialModal();
        });
      }

      if (this.tutorialModal) {
        this.tutorialModal.addEventListener('click', (e) => {
          if (e.target === this.tutorialModal) {
            this.closeTutorialModal();
          }
        });
      }

      // Start & Death Modal Buttons
      document.getElementById('btn-start-climb').addEventListener('click', () => {
        if (this.getRemainingAttemptsToday() <= 0) {
          this.positiveMsgCursor = (this.positiveMsgCursor || 0) + 1;
          this.syncDailyAttemptsUI();
          return;
        }
        this.startNewRun(0);
      });

      const startLbBtn = document.getElementById('btn-start-leaderboard');
      if (startLbBtn) {
        startLbBtn.addEventListener('click', () => {
          this.openLeaderboardModal('daily');
        });
      }

      document.getElementById('btn-retry-practice').addEventListener('click', () => {
        if (this.getRemainingAttemptsToday() <= 0) {
          this.deathModal.classList.add('hidden');
          this.syncStartModalMetadata();
          this.startModal.classList.remove('hidden');
          return;
        }
        this.deathModal.classList.add('hidden');
        this.runAttemptCount += 1;
        this.startNewRun(0);
      });

      const copyReceiptBtn = document.getElementById('btn-copy-receipt');
      if (copyReceiptBtn) {
        copyReceiptBtn.addEventListener('click', () => {
          this.copyReceiptToClipboard();
        });
      }

      document.getElementById('btn-death-leaderboard').addEventListener('click', () => {
        this.deathModal.classList.add('hidden');
        this.openLeaderboardModal('daily');
      });

      document.getElementById('btn-close-leaderboard').addEventListener('click', () => {
        this.leaderboardModal.classList.add('hidden');
        if (this.simState.status !== 'PLAYING' && this.runChoices.length > 0) {
          this.deathModal.classList.remove('hidden');
        } else if (this.runChoices.length === 0) {
          this.startModal.classList.remove('hidden');
        }
      });

      // Leaderboard Tier Tabs
      document.querySelectorAll('.lb-tab').forEach((btn) => {
        btn.addEventListener('click', () => {
          const tier = btn.getAttribute('data-tier') || 'daily';
          this.openLeaderboardModal(tier);
        });
      });
    }

    /**
     * Dynamically creates a fresh puzzle node chain for the active vine:
     * - Places correct & decoy words in randomized Left (0) or Right (1) positions on every run
     * - Samples fresh decoys from each compound's validated decoyPool
     * - Rotates across linked 3-part compound chains on second-chance / practice replays
     */
    rebuildActivePuzzle(attemptCount = 0) {
      if (this.activeVine && typeof Data.createDynamicPuzzleNodes === 'function') {
        this.activeVine.nodes = Data.createDynamicPuzzleNodes(this.activeVine, {
          attemptCount
        });
      }
      if (this.activeVine && Array.isArray(this.activeVine.nodes)) {
        this.applyRandomizedWindSchedule(this.activeVine.nodes);
      }
    }

    /**
     * Schedules randomized 2-to-3 node Wind-Ruffled Gusts interspersed with calm stretches
     * across the climb. Each gust lasts 2-3 nodes and then subsides.
     */
    applyRandomizedWindSchedule(nodes) {
      if (!Array.isArray(nodes) || nodes.length === 0) return;
      nodes.forEach((n) => {
        n.isWindy = false;
        n.windStep = 0;
        n.windTotal = 0;
        n.windDirection = 1;
      });

      // Start first Wind Gust after a 2-to-4 node warm-up
      let idx = 2 + Math.floor(Math.random() * 3);
      while (idx < nodes.length) {
        const gustLen = Math.min(2 + Math.floor(Math.random() * 2), nodes.length - idx);
        const windDir = Math.random() < 0.5 ? 1 : -1;
        for (let s = 0; s < gustLen; s++) {
          const target = nodes[idx + s];
          if (target) {
            target.isWindy = true;
            target.windStep = s + 1;
            target.windTotal = gustLen;
            target.windDirection = windDir;
          }
        }
        // Calm air for 3-to-5 nodes before the next 2-to-3 node Wind Gust
        const calmLen = 3 + Math.floor(Math.random() * 3);
        idx += gustLen + calmLen;
      }
    }

    clearWindSettleTimers() {
      if (Array.isArray(this.windSettleTimers) && this.windSettleTimers.length > 0) {
        this.windSettleTimers.forEach((id) => clearTimeout(id));
      }
      this.windSettleTimers = [];
    }

    shuffleCharsNonIdentity(chars) {
      const arr = chars.slice();
      if (arr.length <= 1) return arr;
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      const isSame = arr.every((ch, idx) => ch === chars[idx]);
      const hasDistinct = chars.some((ch) => ch !== chars[0]);
      if (isSame && hasDistinct) {
        const first = arr.shift();
        arr.push(first);
      }
      return arr;
    }

    /**
     * Wind-Ruffled Left-to-Right Settle:
     * Letters spawn shuffled and snap into place from left to right over 1.2 seconds (1200ms),
     * starting with the first letter.
     */
    renderWindRuffledWord(containerEl, wordStr) {
      if (!containerEl) return;
      const chars = Array.from(String(wordStr || ''));
      const L = chars.length;
      if (L <= 1) {
        containerEl.textContent = wordStr;
        return;
      }

      const initialShuffled = this.shuffleCharsNonIdentity(chars);
      containerEl.innerHTML = '';
      const spanEls = initialShuffled.map((ch) => {
        const span = document.createElement('span');
        span.className = 'wind-char unsettled';
        span.textContent = ch;
        containerEl.appendChild(span);
        return span;
      });

      const TOTAL_SETTLE_MS = 1200;
      const FIRST_SNAP_MS = 150;

      for (let i = 0; i < L; i++) {
        const settleDelayMs = Math.round(
          FIRST_SNAP_MS + (i / Math.max(1, L - 1)) * (TOTAL_SETTLE_MS - FIRST_SNAP_MS)
        );
        const timerId = setTimeout(() => {
          if (!spanEls[i] || !spanEls[i].isConnected) return;
          // Snap letter i into its true character
          spanEls[i].textContent = chars[i];
          spanEls[i].className = 'wind-char settled';

          // Keep remaining unsettled letters (i+1 .. L-1) fluttering with a shuffled permutation of remaining chars
          if (i + 1 < L) {
            const remShuffled = this.shuffleCharsNonIdentity(chars.slice(i + 1));
            for (let j = i + 1; j < L; j++) {
              if (spanEls[j] && spanEls[j].classList.contains('unsettled')) {
                spanEls[j].textContent = remShuffled[j - (i + 1)];
              }
            }
          }
        }, settleDelayMs);

        this.windSettleTimers.push(timerId);
      }
    }

    setVisualPalette(paletteId = 3) {
      // Base palette is fixed to Meadow & Sage (id = 3) for Zone 1 Roots;
      // Mode segments automatically switch to Biolum (0) or Sunlit (1).
      this.basePaletteId = 3;
      const targetTheme = this.isActiveReverseGraft
        ? 0
        : this.isActiveRapidFire
          ? 1
          : 3;
      this.renderer.setTheme(targetTheme);
      this.updateThemeButtonLabel();
    }

    updateThemeButtonLabel() {
      // Visual palette is driven automatically by gameplay mode
    }

    updateMuteButtonLabel() {
      this.muteBtn.textContent = Sound.muted ? '🔇 Muted' : '🔊 Audio';
    }

    hasPlayedOfficialToday(dateKey) {
      return Boolean(localStorage.getItem(`wordvine_official_${dateKey}`));
    }

    getAttemptsUsedToday(dateKey = this.activeVine && this.activeVine.dateKey) {
      if (!dateKey) return 0;
      const raw = localStorage.getItem(`wordvine_attempts_${dateKey}`);
      if (raw !== null && !Number.isNaN(Number(raw))) {
        return Math.max(0, Math.min(MAX_DAILY_ATTEMPTS, Number(raw)));
      }
      return this.hasPlayedOfficialToday(dateKey) ? 1 : 0;
    }

    incrementAttemptsUsedToday(dateKey = this.activeVine && this.activeVine.dateKey) {
      if (!dateKey) return 0;
      const used = Math.min(MAX_DAILY_ATTEMPTS, this.getAttemptsUsedToday(dateKey) + 1);
      localStorage.setItem(`wordvine_attempts_${dateKey}`, String(used));
      if (used >= MAX_DAILY_ATTEMPTS) {
        // Ensure the primary positive message displays first upon finishing attempt #3,
        // and rotates through the variety pool on subsequent interactions
        this.positiveMsgCursor = 0;
      }
      return used;
    }

    getRemainingAttemptsToday(dateKey = this.activeVine && this.activeVine.dateKey) {
      return Math.max(0, MAX_DAILY_ATTEMPTS - this.getAttemptsUsedToday(dateKey));
    }

    getDailyStatusMessage() {
      const cursor = Math.max(0, Number(this.positiveMsgCursor) || 0);
      return DAILY_COMPLETE_MESSAGES[cursor % DAILY_COMPLETE_MESSAGES.length];
    }

    syncDailyAttemptsUI() {
      const used = this.getAttemptsUsedToday();
      const remaining = Math.max(0, MAX_DAILY_ATTEMPTS - used);
      const isExhausted = remaining <= 0;
      const msgText = this.getDailyStatusMessage();

      // Sync Start Modal positive message banner (shown only after all 3 attempts are used)
      const startBannerEl = document.getElementById('start-attempts-banner');
      const startMsgEl = document.getElementById('start-attempts-message');
      const startBtnEl = document.getElementById('btn-start-climb');

      if (startBannerEl) {
        startBannerEl.classList.toggle('hidden', !isExhausted);
      }
      if (startMsgEl) {
        startMsgEl.textContent = isExhausted ? msgText : '';
      }
      if (startBtnEl) {
        if (isExhausted) {
          startBtnEl.textContent = '🌟 Come Back Tomorrow!';
        } else if (used > 0) {
          startBtnEl.textContent = '🌿 Climb Again';
        } else {
          startBtnEl.textContent = '🌿 Start Daily Climb';
        }
      }

      // Sync Death / Completion Modal positive message banner (shown only after all 3 attempts are used)
      const deathBannerEl = document.getElementById('death-attempts-banner');
      const deathMsgEl = document.getElementById('death-attempts-message');
      const retryBtnEl = document.getElementById('btn-retry-practice');

      if (deathBannerEl) {
        deathBannerEl.classList.toggle('hidden', !isExhausted);
      }
      if (deathMsgEl) {
        deathMsgEl.textContent = isExhausted ? msgText : '';
      }
      if (retryBtnEl) {
        retryBtnEl.textContent = isExhausted
          ? '🏠 Daily Overview & Top 5'
          : '🌿 Climb Again';
      }
    }

    getPersonalBest() {
      const defaultPB = { maxNodes: 23, maxAltitude: 38.4 };
      try {
        const raw = localStorage.getItem('wordvine_personal_best');
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            maxNodes: Math.max(defaultPB.maxNodes, Number(parsed.maxNodes) || 0),
            maxAltitude: Number(
              Math.max(defaultPB.maxAltitude, Number(parsed.maxAltitude) || 0).toFixed(1)
            )
          };
        }
      } catch (e) {
        // Ignore parse errors
      }
      return defaultPB;
    }

    updatePersonalBest(nodesCompleted, altitudeMeters) {
      const current = this.getPersonalBest();
      const updated = {
        maxNodes: Math.max(current.maxNodes, Number(nodesCompleted) || 0),
        maxAltitude: Number(
          Math.max(current.maxAltitude, Number(altitudeMeters) || 0).toFixed(1)
        )
      };
      localStorage.setItem('wordvine_personal_best', JSON.stringify(updated));
      return updated;
    }

    resolveDailyThemeMeta(vine, index) {
      const themeCatalog =
        (Array.isArray(Data.DAILY_THEMES) && Data.DAILY_THEMES.length > 0
          ? Data.DAILY_THEMES
          : FALLBACK_DAILY_THEMES);
      const catalogEntry = themeCatalog[index % themeCatalog.length] || FALLBACK_DAILY_THEMES[0];
      const oldPaletteNames = new Set([
        'Midnight Bioluminescence',
        'Sunlit Conservatory',
        'Ukiyo-e Ink & Sakura',
        'Meadow & Sage'
      ]);
      const candidateTitle = vine && (vine.themeName || vine.title);
      const themeName =
        candidateTitle && !oldPaletteNames.has(candidateTitle)
          ? candidateTitle
          : catalogEntry.themeName;
      const themeSubtitle =
        (vine && vine.themeSubtitle) || catalogEntry.themeSubtitle || '';
      return { themeName, themeSubtitle };
    }

    syncStartModalMetadata() {
      const vine = this.activeVine;
      const alreadyPlayed = this.hasPlayedOfficialToday(vine.dateKey);
      const totalThemes = this.dailyVines.length || 12;
      const themeNum = (this.currentVineIndex % totalThemes) + 1;
      const { themeName, themeSubtitle } = this.resolveDailyThemeMeta(
        vine,
        this.currentVineIndex
      );

      document.getElementById('start-vine-eyebrow').textContent =
        `DAILY VINE #${vine.vineNumber} • ${vine.dateKey}`;

      const badgeEl = document.getElementById('start-theme-badge');
      if (badgeEl) {
        badgeEl.textContent = `✨ TODAY'S THEME`;
      }

      document.getElementById('start-vine-title').textContent = themeName;

      const subEl = document.getElementById('start-theme-subtitle');
      if (subEl) {
        subEl.textContent = themeSubtitle;
      }

      const pb = this.getPersonalBest();
      const pbEl = document.getElementById('personal-best-banner');
      const totalNodes = (vine.nodes && vine.nodes.length) || 40;
      if (pbEl) {
        pbEl.innerHTML = `🏆 Personal Best: <strong>${pb.maxNodes}/${totalNodes} Nodes • ${Number(pb.maxAltitude).toFixed(1)}m Height</strong>`;
      }

      this.renderHomescreenDailyTop5();

      this.hudModeBadge.textContent = 'DAILY CLIMB';
      this.syncDailyAttemptsUI();
    }

    /**
     * Renders the Daily Top 5 Climbers on the Homescreen (#start-modal)
     * so players immediately see the Nodes Chained & Height targets to beat.
     */
    renderHomescreenDailyTop5() {
      const listEl = document.getElementById('home-top5-list');
      const targetPillEl = document.getElementById('home-top5-target-pill');
      if (!listEl) return;

      const totalNodes = (this.activeVine && this.activeVine.nodes && this.activeVine.nodes.length) || 40;
      const top5 = this.buildLocalFallbackLeaderboard('daily').slice(0, 5);

      if (targetPillEl && top5.length > 0) {
        const leader = top5[0];
        targetPillEl.textContent = `🎯 #1: ${leader.nodesVal}/${totalNodes} • ${Number(leader.altitudeVal).toFixed(1)}m`;
      }

      const rankIcons = ['🥇 1', '🥈 2', '🥉 3', '#4', '#5'];
      listEl.innerHTML = top5
        .map((row, idx) => {
          const isMe = Boolean(row.isMe || row.handle === this.playerHandle);
          return `
            <div class="home-top5-row${isMe ? ' is-me' : ''}">
              <span class="home-top5-rank">${rankIcons[idx] || `#${idx + 1}`}</span>
              <span class="home-top5-handle">${row.handle}${isMe ? ' (You)' : ''}</span>
              <span class="home-top5-nodes">${row.nodesVal}/${totalNodes} nodes</span>
              <span class="home-top5-height">${Number(row.altitudeVal).toFixed(1)}m</span>
            </div>
          `;
        })
        .join('');
    }

    startNewRun(startNodeIndex = 0) {
      if (this.getRemainingAttemptsToday() <= 0) {
        this.positiveMsgCursor = (this.positiveMsgCursor || 0) + 1;
        this.syncDailyAttemptsUI();
        this.startModal.classList.remove('hidden');
        return;
      }

      if (this.handleInput && this.handleInput.value.trim()) {
        this.playerHandle = this.handleInput.value.trim().slice(0, 20);
        localStorage.setItem('wordvine_handle', this.playerHandle);
      }

      Sound.init();
      this.startModal.classList.add('hidden');
      this.deathModal.classList.add('hidden');
      this.leaderboardModal.classList.add('hidden');
      if (this.tutorialModal) {
        this.tutorialModal.classList.add('hidden');
      }

      this.leftPill.classList.remove('snipped-wrong', 'snipped-correct');
      this.rightPill.classList.remove('snipped-wrong', 'snipped-correct');

      this.isOfficialAttempt = true;
      this.hudModeBadge.textContent = 'DAILY CLIMB';

      // Build a fresh puzzle with randomized Left/Right positions & decoys
      this.rebuildActivePuzzle(this.runAttemptCount);

      this.simState = Physics.createSimulationState(startNodeIndex);
      this.runChoices = [];
      this.runDeltasMs = [];
      this.bufferedInput = null;
      this.lastKeystrokeTimeMs = performance.now();
      this.lastFrameTimeMs = performance.now();

      this.renderer.resetVine(this.simState.yVine, this.simState.zoneId);
      this.syncFovealDOM();
      this.syncTelemetryHUD();
    }

    /**
     * Handles binary choice (0 = Left, 1 = Right) with 120ms Input Buffer support
     */
    handleBinaryInput(choiceSide) {
      if (
        !this.startModal.classList.contains('hidden') ||
        !this.deathModal.classList.contains('hidden') ||
        !this.leaderboardModal.classList.contains('hidden') ||
        (this.tutorialModal && !this.tutorialModal.classList.contains('hidden'))
      ) {
        return;
      }
      if (this.simState.status !== 'PLAYING') return;

      const nowMs = performance.now();
      // If player double-taps within 75ms while a spurt animation is mid-flight, queue inside the 120ms Input Buffer
      if (
        this.simState.spurtActive &&
        nowMs - this.lastChoiceTimeMs < 75 &&
        !this.bufferedInput
      ) {
        this.bufferedInput = {
          side: choiceSide,
          queuedAtMs: nowMs
        };
        return;
      }

      this.executeChoice(choiceSide, nowMs);
    }

    executeChoice(choiceSide, nowMs) {
      this.lastChoiceTimeMs = nowMs;
      const dtKeystroke = Math.max(20, Math.round(nowMs - this.lastKeystrokeTimeMs));
      this.lastKeystrokeTimeMs = nowMs;

      const currentNode = this.activeVine.nodes[this.simState.nodeIndex];
      const pickedWord =
        currentNode && choiceSide === currentNode.leftRightSeed
          ? currentNode.correctWord
          : currentNode
            ? currentNode.decoyWord
            : String(choiceSide);

      this.runChoices.push(pickedWord);
      this.runDeltasMs.push(dtKeystroke);

      // Visual pill pop feedback
      const targetPill = choiceSide === 0 ? this.leftPill : this.rightPill;
      targetPill.classList.add('flash-pick');
      setTimeout(() => targetPill.classList.remove('flash-pick'), 110);

      const prevYVine = this.simState.yVine;
      const result = Physics.applyPlayerChoice(
        this.simState,
        this.activeVine.nodes,
        choiceSide
      );

      if (!result.accepted) return;

      if (!result.correct) {
        // Lexical Strike (Wrong Choice) — immediately settle any wind-shuffled letters so both words are clear
        this.clearWindSettleTimers();
        if (result.node) {
          this.leftWordEl.textContent =
            result.node.leftRightSeed === 0 ? result.node.correctWord : result.node.decoyWord;
          this.rightWordEl.textContent =
            result.node.leftRightSeed === 1 ? result.node.correctWord : result.node.decoyWord;
        }
        Sound.playStemSnap();
        this.renderer.triggerLexicalSnapBurst(prevYVine, choiceSide);

        if (choiceSide === 0) {
          this.leftPill.classList.add('snipped-wrong');
          this.rightPill.classList.add('snipped-correct');
        } else {
          this.rightPill.classList.add('snipped-wrong');
          this.leftPill.classList.add('snipped-correct');
        }

        setTimeout(() => this.onRunEnded(result.node), 520);
        return;
      }

      // Correct choice!
      if (result.triggeredGraftCollar) {
        Sound.playGraftCollar(result.nextZone);
      } else if (result.enteredReverseGraft) {
        Sound.playGraftCollar(2);
      } else if (result.enteredRapidFire) {
        Sound.playGraftCollar(3);
      } else if (result.isTripleBloom || result.isReverseGraft) {
        Sound.playTripleBloom();
      } else {
        Sound.playSpurt(this.simState.zoneId, this.simState.nodesCompleted);
      }

      this.renderer.recordCompletedNode({
        yWorld: prevYVine,
        zoneId: result.node.zoneId,
        isTripleBloom: result.isTripleBloom,
        isReverseGraft: result.isReverseGraft,
        isRapidFire: result.isRapidFire,
        enteredRapidFire: result.enteredRapidFire,
        triggeredGraftCollar: result.triggeredGraftCollar,
        word: result.node.correctWord,
        choiceSide
      });

      this.spawnScorePop(this.simState.lastNodeScoreBreakdown, result.enteredRapidFire);

      if (this.simState.status === 'COMPLETED') {
        setTimeout(() => this.onRunEnded(result.node), 420);
        return;
      }

      this.syncFovealDOM();
      this.syncTelemetryHUD();
    }

    spawnScorePop(breakdown, enteredRapidFire = false) {
      if (!breakdown) return;
      const pop = document.createElement('div');
      pop.className = 'score-pop';
      const screenY = this.renderer.worldToScreenY(this.simState.yVine, this.simState.yCam);
      pop.style.top = `${Math.max(80, screenY - 120)}px`;
      const deltaM = breakdown.nodeHeightMeters
        ? `+${Number(breakdown.nodeHeightMeters).toFixed(1)}m`
        : '+1.6m';
      pop.textContent = enteredRapidFire
        ? `⚡ RAPID-FIRE SPRINT! ${deltaM}`
        : breakdown.isReverseGraft
          ? `⬅ WORD IN FRONT! ${deltaM}`
          : breakdown.isRapidFire
            ? `⚡ RAPID FIRE! ${deltaM}`
            : breakdown.isTripleBloom
              ? `🌸 3-WORD CHAIN! ${deltaM}`
              : breakdown.isFastPick
                ? `⚡ FAST! ${deltaM}`
                : `${deltaM}`;
      document.body.appendChild(pop);
      setTimeout(() => pop.remove(), 650);
    }

    /**
     * Synchronizes the Foveal Choice words, Reverse-Graft Loop (⬅) / Zone 3 Rapid-Fire (⚡) state,
     * and subtle 2-Node / 3-Node compound link indicators without revealing any upcoming word choices.
     */
    syncFovealDOM() {
      const node = this.activeVine.nodes[this.simState.nodeIndex];
      if (!node) return;

      document.body.classList.remove('zone-1', 'zone-2', 'zone-3');
      document.body.classList.add(`zone-${node.zoneId}`);

      const isReverseGraft = Boolean(
        node.isReverseGraft || node.gameMode === 'REVERSE_GRAFT'
      );
      const isRapidFire = Boolean(
        node.isRapidFire || node.gameMode === 'RAPID_FIRE'
      );
      this.isActiveReverseGraft = isReverseGraft;
      this.isActiveRapidFire = isRapidFire;

      // Wind-Ruffled Gust (2-3 nodes) state & breeze audio cue
      const isWindy = Boolean(node.isWindy);
      const wasWindy = Boolean(this.isActiveWind);
      this.isActiveWind = isWindy;
      this.activeWindDirection = node.windDirection || 1;
      document.body.classList.toggle('wind-gust-active', isWindy);

      if (
        isWindy &&
        (!wasWindy || node.windStep === 1) &&
        this.simState &&
        this.simState.status === 'PLAYING' &&
        this.startModal &&
        this.startModal.classList.contains('hidden') &&
        typeof Sound.playWindGust === 'function'
      ) {
        Sound.playWindGust();
      }

      // Compute on-vine Speed Gate countdown (1 or 2 nodes before Rapid-Fire Sprint starts)
      const idx = this.simState.nodeIndex;
      const next1 = this.activeVine.nodes[idx + 1];
      const next2 = this.activeVine.nodes[idx + 2];
      const next1Rapid = Boolean(next1 && (next1.isRapidFire || next1.gameMode === 'RAPID_FIRE'));
      const next2Rapid = Boolean(next2 && (next2.isRapidFire || next2.gameMode === 'RAPID_FIRE'));
      this.stepsUntilRapidFire = isRapidFire ? 0 : next1Rapid ? 1 : next2Rapid ? 2 : 0;

      // Switch game atmosphere automatically with each 6-to-10 node mode segment:
      // - Reverse-Graft Loop (⬅) -> Midnight Bioluminescence (id = 0)
      // - Zone 3 Rapid-Fire Sprint (⚡) -> Sunlit Conservatory (id = 1)
      // - Zone 1 Roots (Forward) -> Base palette (Meadow & Sage id = 3 by default)
      if (isReverseGraft) {
        this.renderer.setTheme(0);
        document.body.classList.add('reverse-graft-active');
        document.body.classList.remove('rapid-fire-active');
      } else if (isRapidFire) {
        this.renderer.setTheme(1);
        document.body.classList.add('rapid-fire-active');
        document.body.classList.remove('reverse-graft-active');
      } else {
        this.renderer.setTheme(this.basePaletteId ?? 3);
        document.body.classList.remove('reverse-graft-active', 'rapid-fire-active');
      }
      this.updateThemeButtonLabel();

      // Toggle Reverse-Graft Loop (⬅) & Zone 3 Rapid-Fire (⚡) visual indicators
      if (this.stemCard) {
        this.stemCard.classList.toggle('is-reverse-graft', isReverseGraft);
        this.stemCard.classList.toggle('is-rapid-fire', isRapidFire);
      }
      if (this.stemReversePrefix) {
        this.stemReversePrefix.classList.toggle('hidden', !isReverseGraft);
      }
      if (this.reverseLoopBanner) {
        this.reverseLoopBanner.classList.toggle('hidden', !isReverseGraft);
        if (isReverseGraft && this.reverseLoopBannerText) {
          this.reverseLoopBannerText.textContent = `WORD GOES IN FRONT • ⬅ ___ + ${node.stemWord}`;
        }
      }
      if (this.rapidFireBanner) {
        this.rapidFireBanner.classList.toggle('hidden', !isRapidFire);
        if (isRapidFire && this.rapidFireBannerText) {
          this.rapidFireBannerText.textContent = `RAPID-FIRE SPRINT`;
        }
      }
      if (this.windGustBanner) {
        this.windGustBanner.classList.toggle('hidden', !isWindy);
        if (isWindy && this.windGustBannerText) {
          this.windGustBannerText.textContent = `WIND GUST • LETTERS SETTLING`;
        }
      }
      this.leftPill.classList.toggle('is-reverse-graft', isReverseGraft);
      this.rightPill.classList.toggle('is-reverse-graft', isReverseGraft);
      this.leftPill.classList.toggle('is-rapid-fire', isRapidFire);
      this.rightPill.classList.toggle('is-rapid-fire', isRapidFire);
      this.leftPill.classList.toggle('is-wind-ruffled', isWindy);
      this.rightPill.classList.toggle('is-wind-ruffled', isWindy);

      // Always display only the active stem word (never reveal upcoming words)
      this.stemWordEl.textContent = node.stemWord;

      // Determine left vs right words from node.leftRightSeed
      const leftWord = node.leftRightSeed === 0 ? node.correctWord : node.decoyWord;
      const rightWord = node.leftRightSeed === 1 ? node.correctWord : node.decoyWord;

      // Clear any previous node's letter-settle timers
      this.clearWindSettleTimers();
      if (isWindy) {
        this.renderWindRuffledWord(this.leftWordEl, leftWord);
        this.renderWindRuffledWord(this.rightWordEl, rightWord);
      } else {
        this.leftWordEl.textContent = leftWord;
        this.rightWordEl.textContent = rightWord;
      }

      // Determine whether this step is linking a 3-Part (Triple) or 2-Part (Double) compound
      const isTripleLink =
        node.linkGroupSize === 3 ||
        (node.zoneId === 1 && (node.tripletStep === 2 || node.tripletStep === 3));
      const groupStep =
        node.linkGroupStep || (node.zoneId === 1 && node.tripletStep === 3 ? 2 : 1);

      // Show the subtle, wordless 3rd linked node above the fork ONLY on Step 1 of a 3-Part Compound
      this.showGhostThirdNode = Boolean(isTripleLink && groupStep === 1);
      if (this.fovealNode3Wrap) {
        this.fovealNode3Wrap.classList.toggle('hidden', !this.showGhostThirdNode);
      }

      // Update Subtle Linked-Node Cluster (3 linked nodes vs 2 linked nodes)
      if (this.tripletPipBar) {
        this.tripletPipBar.classList.remove('hidden');
        this.tripletPipBar.classList.toggle('is-triple-link', isTripleLink);
        this.tripletPipBar.classList.toggle('is-double-link', !isTripleLink);
      }

      const [b1, b2, b3] = this.pipBuds;
      if (isTripleLink) {
        if (groupStep === 1) {
          // Step 1 of 3-Part Compound: ● ── ◉ ── ○
          if (b1) b1.className = 'pip-bud filled';
          if (this.pipConn1) this.pipConn1.className = 'pip-connector active';
          if (b2) b2.className = 'pip-bud active-pick';
          if (this.pipConn2) this.pipConn2.className = 'pip-connector upcoming';
          if (b3) b3.className = 'pip-bud upcoming bloom-step';
        } else {
          // Step 2 of 3-Part Compound (Completing the 3rd Node): ● ── ● ── ◉
          if (b1) b1.className = 'pip-bud filled';
          if (this.pipConn1) this.pipConn1.className = 'pip-connector filled';
          if (b2) b2.className = 'pip-bud filled';
          if (this.pipConn2) this.pipConn2.className = 'pip-connector active';
          if (b3) b3.className = 'pip-bud active-pick bloom-step';
        }
      } else {
        // 2-Part Compound (Double Link): ● ── ◉
        if (b1) b1.className = 'pip-bud filled';
        if (this.pipConn1) this.pipConn1.className = 'pip-connector active';
        if (b2) b2.className = 'pip-bud active-pick';
      }
    }

    syncTelemetryHUD() {
      const altitudeMeters = (
        this.simState.maxAltitudeUnits * Physics.PHYSICS_CONFIG.METERS_PER_UNIT
      ).toFixed(1);
      const totalNodes = (this.activeVine && this.activeVine.nodes && this.activeVine.nodes.length) || 40;
      if (this.hudNodes) {
        this.hudNodes.textContent = `${this.simState.nodesCompleted}/${totalNodes}`;
      }
      this.hudAltitude.textContent = `${altitudeMeters}m`;
      this.hudVelocity.textContent = `${Math.round(this.simState.vCam)} u/s`;
      this.hudZone.textContent = this.isActiveReverseGraft
        ? '⬅ WORD IN FRONT'
        : this.isActiveRapidFire
          ? '⚡ RAPID FIRE'
          : '🌿 NORMAL';
      if (this.hudModeBadge) {
        this.hudModeBadge.textContent = this.isActiveReverseGraft
          ? '⬅ WORD IN FRONT'
          : this.isActiveRapidFire
            ? '⚡ RAPID FIRE'
            : '🌿 DAILY CLIMB';
      }
    }

    /**
     * Main 60-120fps requestAnimationFrame loop
     */
    loop(nowMs) {
      const dtMs = Math.min(50, Math.max(0, nowMs - this.lastFrameTimeMs));
      this.lastFrameTimeMs = nowMs;

      if (
        this.startModal.classList.contains('hidden') &&
        this.deathModal.classList.contains('hidden') &&
        this.leaderboardModal.classList.contains('hidden') &&
        (!this.tutorialModal || this.tutorialModal.classList.contains('hidden')) &&
        this.simState.status === 'PLAYING'
      ) {
        Physics.stepSimulation(this.simState, dtMs);

        // Process 120ms Input Buffer if ready
        if (
          this.bufferedInput &&
          nowMs - this.bufferedInput.queuedAtMs <= Physics.PHYSICS_CONFIG.INPUT_BUFFER_MS &&
          nowMs - this.lastChoiceTimeMs >= 75
        ) {
          const nextSide = this.bufferedInput.side;
          this.bufferedInput = null;
          this.executeChoice(nextSide, nowMs);
        } else if (
          this.bufferedInput &&
          nowMs - this.bufferedInput.queuedAtMs > Physics.PHYSICS_CONFIG.INPUT_BUFFER_MS
        ) {
          this.bufferedInput = null;
        }

        // Danger heartbeat audio check
        const leadUnits = this.simState.yVine - this.simState.yCam;
        Sound.updateDangerHeartbeat(leadUnits, nowMs);

        // Check if Viewport Outrun occurred on this frame
        if (this.simState.status === 'OUTRUN') {
          Sound.playStemSnap();
          const currentNode = this.activeVine.nodes[this.simState.nodeIndex];
          this.onRunEnded(currentNode);
        }

        this.syncTelemetryHUD();
      }

      // Render HD Canvas (also steps camera rotation & directional Left/Right vine climb)
      const risingSapZone = Physics.getRisingSapWarningZone(this.simState.nodeIndex);
      this.renderer.render(
        this.simState,
        dtMs,
        risingSapZone,
        this.showGhostThirdNode,
        this.isActiveReverseGraft,
        this.isActiveRapidFire,
        this.stepsUntilRapidFire || 0,
        this.isActiveWind,
        this.activeWindDirection || 1
      );

      // Position #foveal-anchor to track the active vine tip on screen with 3D cylindrical orbital swivel & pitch depth
      const tipScreenY = this.renderer.worldToScreenY(
        this.simState.yVine,
        this.simState.yCam,
        this.simState
      );
      const pitch =
        typeof this.renderer.getCameraPitchProgress === 'function'
          ? this.renderer.getCameraPitchProgress(this.simState)
          : 0;
      const camMotion =
        typeof this.renderer.getCameraMotionState === 'function'
          ? this.renderer.getCameraMotionState()
          : { tipScreenOffsetX: 0, orbitYawDeg: 0 };
      const offsetX = camMotion.tipScreenOffsetX || 0;
      const orbitYawDeg = camMotion.orbitYawDeg || 0;
      const minTopY = this.showGhostThirdNode ? 190 : 155;
      const clampedScreenY = Math.max(minTopY, Math.min(window.innerHeight - 125, tipScreenY - 38));
      this.fovealAnchor.style.top = `${clampedScreenY}px`;
      const has3DMotion =
        pitch > 0.005 || Math.abs(orbitYawDeg) > 0.05 || Math.abs(offsetX) > 0.2;
      this.fovealAnchor.style.transform = has3DMotion
        ? `translateX(calc(-50% + ${offsetX.toFixed(1)}px)) perspective(900px) rotateY(${orbitYawDeg.toFixed(2)}deg) rotateX(${(pitch * 11).toFixed(2)}deg) scale(${(1 + pitch * 0.06).toFixed(3)})`
        : 'translateX(-50%)';

      requestAnimationFrame((t) => this.loop(t));
    }

    /**
     * Extracts the clean, human-readable compound word (e.g. "Boardwalk" or "Peanut butter")
     * from a node without any internal Zone / Rapid-Fire / Loop labels.
     */
    formatCleanCompoundWord(node) {
      if (!node) return '';
      const rawHint = String(node.compoundHint || '');
      const eqIdx = rawHint.indexOf('=');
      if (eqIdx >= 0) {
        const afterEq = rawHint
          .slice(eqIdx + 1)
          .replace(/\s*\(.*$/, '')
          .trim();
        if (afterEq) return afterEq;
      }
      const first = node.isReverseGraft ? String(node.correctWord || '') : String(node.stemWord || '');
      const second = node.isReverseGraft ? String(node.stemWord || '') : String(node.correctWord || '');
      const combined = `${first}${second}`.toLowerCase();
      return combined ? combined.charAt(0).toUpperCase() + combined.slice(1) : '';
    }

    /**
     * Handles End of Run (SNIPPED, OUTRUN, or COMPLETED), records Official Score, and builds Receipt
     */
    async onRunEnded(fatalNode) {
      this.clearWindSettleTimers();
      this.isActiveWind = false;
      document.body.classList.remove('wind-gust-active');
      const altitudeMeters = Number(
        (this.simState.maxAltitudeUnits * Physics.PHYSICS_CONFIG.METERS_PER_UNIT).toFixed(1)
      );
      const cause = this.simState.status; // 'SNIPPED' | 'OUTRUN' | 'COMPLETED'
      const wasReverseGraft = Boolean(
        fatalNode && (fatalNode.isReverseGraft || fatalNode.gameMode === 'REVERSE_GRAFT')
      );

      // Populate Death / Completion Modal
      const titleEl = document.getElementById('death-modal-title');
      const eyebrowEl = document.getElementById('death-modal-eyebrow');
      const explainEl = document.getElementById('death-explanation');

      const prevPB = this.getPersonalBest();
      const isNewPB =
        this.simState.nodesCompleted > prevPB.maxNodes ||
        altitudeMeters > prevPB.maxAltitude;

      eyebrowEl.textContent = isNewPB
        ? `🏆 NEW PERSONAL BEST LOGGED • #${this.activeVine.vineNumber}`
        : `🌿 DAILY CLIMB LOGGED • #${this.activeVine.vineNumber}`;

      const stem = fatalNode ? fatalNode.stemWord : '';
      const right = fatalNode ? fatalNode.correctWord : '';
      const compoundWord = this.formatCleanCompoundWord(fatalNode);

      if (cause === 'COMPLETED') {
        titleEl.textContent = `🌸 40/40 Chained • ${altitudeMeters}m!`;
        explainEl.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        explainEl.style.background = 'rgba(34, 197, 94, 0.14)';
        explainEl.innerHTML = `<strong>Mastery Achieved!</strong> You chained all ${this.activeVine.nodes.length} compounds and reached a height of <strong>${altitudeMeters}m</strong>!`;
      } else if (cause === 'SNIPPED') {
        titleEl.textContent = `${this.simState.nodesCompleted}/${this.activeVine.nodes.length} Nodes • ${altitudeMeters}m`;
        explainEl.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        explainEl.style.background = 'rgba(239, 68, 68, 0.12)';
        if (wasReverseGraft) {
          explainEl.innerHTML = `Correct choice: <strong>${right}</strong><br><strong>${right}</strong> goes in front of <strong>${stem}</strong> to make <strong>${compoundWord}</strong> (<strong>${right} + ${stem}</strong>).`;
        } else {
          explainEl.innerHTML = `Correct choice: <strong>${right}</strong><br><strong>${stem} + ${right}</strong> makes <strong>${compoundWord}</strong>.`;
        }
      } else {
        titleEl.textContent = `${this.simState.nodesCompleted}/${this.activeVine.nodes.length} Nodes • ${altitudeMeters}m`;
        explainEl.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        explainEl.style.background = 'rgba(245, 158, 11, 0.12)';
        if (wasReverseGraft) {
          explainEl.innerHTML = `Correct choice: <strong>${right}</strong><br><strong>${right}</strong> goes in front of <strong>${stem}</strong> to make <strong>${compoundWord}</strong> (<strong>${right} + ${stem}</strong>).`;
        } else {
          explainEl.innerHTML = `Correct choice: <strong>${right}</strong><br><strong>${stem} + ${right}</strong> makes <strong>${compoundWord}</strong>.`;
        }
      }

      const finalNodesEl = document.getElementById('stat-final-nodes');
      if (finalNodesEl) {
        finalNodesEl.textContent = `${this.simState.nodesCompleted}/${this.activeVine.nodes.length}`;
      }
      const finalAltEl = document.getElementById('stat-final-altitude');
      if (finalAltEl) {
        finalAltEl.textContent = `${altitudeMeters}m`;
      }

      // Increment daily attempt counter (up to 3 attempts/day) and update positive status banner
      this.incrementAttemptsUsedToday(this.activeVine.dateKey);
      this.syncDailyAttemptsUI();

      this.deathModal.classList.remove('hidden');

      // Save & submit run
      await this.submitRunScore({
        dateKey: this.activeVine.dateKey,
        vineNumber: this.activeVine.vineNumber,
        score: this.simState.score,
        nodesCompleted: this.simState.nodesCompleted,
        altitudeMeters,
        tripletBlooms: this.simState.tripletBlooms,
        deathCause: cause,
        isOfficial: this.isOfficialAttempt
      });
    }

    async submitRunScore(runSummary) {
      // 1. Track all-time personal best across all climbs (Nodes Chained & Speed Height)
      this.updatePersonalBest(
        runSummary.nodesCompleted,
        runSummary.altitudeMeters
      );

      const submittedAt = new Date().toISOString();
      const { themeName } = this.resolveDailyThemeMeta(
        this.activeVine,
        this.currentVineIndex
      );

      const loggedEntry = {
        ...runSummary,
        themeName,
        handle: this.playerHandle,
        deviceToken: this.deviceToken,
        submittedAt
      };

      // 2. Append every climb to full run history log (wordvine_run_history)
      try {
        const historyRaw = localStorage.getItem('wordvine_run_history');
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        history.push(loggedEntry);
        if (history.length > 200) {
          history.splice(0, history.length - 200);
        }
        localStorage.setItem('wordvine_run_history', JSON.stringify(history));
      } catch (e) {
        // Ignore storage quota errors
      }

      // 3. Keep best daily climb in wordvine_official_${dateKey} & wordvine_local_runs for leaderboards
      // Ranked by Nodes Chained first, then Height (so faster runs with the same nodes beat slower ones!)
      const isBetterClimb = (cand, prev) => {
        if (!prev) return true;
        const cNodes = Number(cand.nodesCompleted) || 0;
        const pNodes = Number(prev.nodesCompleted) || 0;
        if (cNodes !== pNodes) return cNodes > pNodes;
        return (Number(cand.altitudeMeters) || 0) >= (Number(prev.altitudeMeters) || 0);
      };

      try {
        const existingDayRaw = localStorage.getItem(`wordvine_official_${runSummary.dateKey}`);
        const existingDay = existingDayRaw ? JSON.parse(existingDayRaw) : null;

        if (isBetterClimb(runSummary, existingDay)) {
          localStorage.setItem(
            `wordvine_official_${runSummary.dateKey}`,
            JSON.stringify(loggedEntry)
          );
        }

        const localRunsRaw = localStorage.getItem('wordvine_local_runs');
        const localRuns = localRunsRaw ? JSON.parse(localRunsRaw) : [];
        const existingIdx = localRuns.findIndex((r) => r.dateKey === runSummary.dateKey);
        if (existingIdx >= 0) {
          if (isBetterClimb(runSummary, localRuns[existingIdx])) {
            localRuns[existingIdx] = loggedEntry;
          }
        } else {
          localRuns.push(loggedEntry);
        }
        localStorage.setItem('wordvine_local_runs', JSON.stringify(localRuns));
      } catch (e) {
        // Ignore parse errors
      }

      this.syncStartModalMetadata();

      // 4. POST to Render backend API (/api/vine/submit) with keystroke replay deltas
      try {
        await fetch(`${API_BASE}/vine/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceToken: this.deviceToken,
            handle: this.playerHandle,
            dateKey: this.activeVine.dateKey,
            choices: this.runChoices,
            deltasMs: this.runDeltasMs
          })
        });
      } catch (err) {
        // Offline or static GitHub Pages mode — logged seamlessly via local storage
      }
    }

    copyReceiptToClipboard() {
      if (!this.currentReceiptText) return;
      navigator.clipboard.writeText(this.currentReceiptText).then(() => {
        const btn = document.getElementById('btn-copy-receipt');
        const prev = btn.textContent;
        btn.textContent = '✅ Copied Botanical Receipt!';
        setTimeout(() => {
          btn.textContent = prev;
        }, 2000);
      });
    }

    openTutorialModal() {
      if (!this.tutorialModal) return;
      if (!this.tutorialModal.classList.contains('hidden')) return;

      if (!this.startModal.classList.contains('hidden')) {
        this.previousModalBeforeTutorial = this.startModal;
      } else if (!this.deathModal.classList.contains('hidden')) {
        this.previousModalBeforeTutorial = this.deathModal;
      } else if (!this.leaderboardModal.classList.contains('hidden')) {
        this.previousModalBeforeTutorial = this.leaderboardModal;
      } else {
        this.previousModalBeforeTutorial = null;
      }

      this.startModal.classList.add('hidden');
      this.deathModal.classList.add('hidden');
      this.leaderboardModal.classList.add('hidden');
      this.tutorialModal.classList.remove('hidden');
    }

    closeTutorialModal() {
      if (!this.tutorialModal) return;
      this.tutorialModal.classList.add('hidden');
      if (this.previousModalBeforeTutorial) {
        this.previousModalBeforeTutorial.classList.remove('hidden');
        this.previousModalBeforeTutorial = null;
      }
      this.lastFrameTimeMs = performance.now();
    }

    async openLeaderboardModal(tier = 'daily') {
      if (this.tutorialModal) {
        this.tutorialModal.classList.add('hidden');
      }
      this.startModal.classList.add('hidden');
      this.deathModal.classList.add('hidden');
      this.leaderboardModal.classList.remove('hidden');

      document.querySelectorAll('.lb-tab').forEach((t) => {
        t.classList.toggle('active', t.getAttribute('data-tier') === tier);
      });

      const subtitleMap = {
        daily: `Daily Leaderboard (${this.activeVine.dateKey}) • Nodes Chained & Speed Height`,
        weekly: 'Weekly Champions',
        monthly: 'Monthly Mastery (Top 20 Daily Climbs • Nodes & Height)'
      };
      document.getElementById('lb-tier-subtitle').textContent = subtitleMap[tier] || '';

      const thCol1 = document.getElementById('lb-th-col1');
      const thCol2 = document.getElementById('lb-th-col2');
      if (thCol1) {
        thCol1.textContent = tier === 'weekly' ? 'Day & Date' : 'Rank';
      }
      if (thCol2) {
        thCol2.textContent = tier === 'weekly' ? '#1 Climber' : 'Climber';
      }

      const totalNodes = (this.activeVine && this.activeVine.nodes && this.activeVine.nodes.length) || 40;
      const tbody = document.getElementById('lb-table-body');
      tbody.innerHTML = '';

      if (tier === 'weekly') {
        const weeklyDays = this.buildWeeklyChampionsLeaderboard();
        weeklyDays.forEach((row) => {
          const tr = document.createElement('tr');
          if (row.isMe || row.handle === this.playerHandle) {
            tr.className = 'is-me';
          } else if (row.isToday) {
            tr.className = 'is-today-row';
          }
          const nodesDisplay = `${row.nodesVal}/${totalNodes}`;
          const heightDisplay = `${Number(row.altitudeVal).toFixed(1)}m`;
          tr.innerHTML = `
            <td>
              <span class="lb-day-name">${row.dayLabel}</span>
              <span class="lb-day-date">${row.shortDate}</span>${row.isToday ? '<span class="lb-today-pill">TODAY</span>' : ''}
            </td>
            <td>🥇 ${row.handle}${row.isMe ? ' (You)' : ''}</td>
            <td style="font-family: var(--font-mono); font-weight: 700;">${nodesDisplay}</td>
            <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-primary);">
              ${heightDisplay}
            </td>
          `;
          tbody.appendChild(tr);
        });
        return;
      }

      let entries = this.buildLocalFallbackLeaderboard(tier);
      entries.forEach((row, idx) => {
        const tr = document.createElement('tr');
        if (row.isMe || row.handle === this.playerHandle) {
          tr.className = 'is-me';
        }
        const nodesDisplay =
          tier === 'daily' ? `${row.nodesVal}/${totalNodes}` : `${row.nodesVal} nodes`;
        const heightDisplay = `${Number(row.altitudeVal).toFixed(1)}m`;
        tr.innerHTML = `
          <td>#${idx + 1}</td>
          <td>${row.handle} ${row.isMe ? '(You)' : ''}</td>
          <td style="font-family: var(--font-mono); font-weight: 700;">${nodesDisplay}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-primary);">
            ${heightDisplay}
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    /**
     * Builds the Mon–Sun Weekly Leaderboard showing the #1 Climber next to each day of the week
     * (Mon, Tues, Wed, Thu, Fri, Sat, Sun) along with the calendar date.
     */
    buildWeeklyChampionsLeaderboard() {
      const dayLabels = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Baseline #1 daily champions for each day of the week
      const dailyBotChampions = [
        { handle: 'OrchidSprinter', nodesVal: 36, altitudeVal: 64.2 },
        { handle: 'CanopyViper', nodesVal: 39, altitudeVal: 70.8 },
        { handle: 'SumiBrush99', nodesVal: 35, altitudeVal: 61.4 },
        { handle: 'VelocityMoss', nodesVal: 37, altitudeVal: 66.5 },
        { handle: 'CanopyViper', nodesVal: 38, altitudeVal: 68.4 },
        { handle: 'SakuraTendril', nodesVal: 37, altitudeVal: 65.8 },
        { handle: 'GlasshouseFern', nodesVal: 36, altitudeVal: 63.1 }
      ];

      const activeKey = (this.activeVine && this.activeVine.dateKey) || new Date().toISOString().slice(0, 10);
      const parts = activeKey.split('-').map(Number);
      const refDate =
        parts.length === 3 && !parts.some(Number.isNaN)
          ? new Date(parts[0], parts[1] - 1, parts[2])
          : new Date();

      const jsDay = refDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const offsetToMonday = jsDay === 0 ? -6 : 1 - jsDay;
      const mondayDate = new Date(
        refDate.getFullYear(),
        refDate.getMonth(),
        refDate.getDate() + offsetToMonday
      );

      let localRuns = [];
      try {
        const localRunsRaw = localStorage.getItem('wordvine_local_runs');
        localRuns = localRunsRaw ? JSON.parse(localRunsRaw) : [];
      } catch (e) {
        localRuns = [];
      }

      const pad2 = (n) => String(n).padStart(2, '0');

      return dayLabels.map((dayLabel, idx) => {
        const d = new Date(
          mondayDate.getFullYear(),
          mondayDate.getMonth(),
          mondayDate.getDate() + idx
        );
        const dateKey = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
        const shortDate = `${monthShort[d.getMonth()]} ${d.getDate()}`;
        const isToday = dateKey === activeKey;

        // Today's baseline #1 matches the Daily Top 5 #1 target (CanopyViper • 38/40 • 68.4m)
        const baseChamp = isToday
          ? { handle: 'CanopyViper', nodesVal: 38, altitudeVal: 68.4 }
          : dailyBotChampions[idx];

        let topHandle = baseChamp.handle;
        let topNodes = baseChamp.nodesVal;
        let topAltitude = baseChamp.altitudeVal;
        let isMe = false;

        // Check if the player has a logged run on this date that beat the #1 climber
        const myRun = localRuns.find((r) => r.dateKey === dateKey);
        if (myRun) {
          const myNodes = Number(myRun.nodesCompleted) || 0;
          const myAlt = Number(myRun.altitudeMeters) || 0;
          if (myNodes > topNodes || (myNodes === topNodes && myAlt >= topAltitude)) {
            topHandle = this.playerHandle;
            topNodes = myNodes;
            topAltitude = myAlt;
            isMe = true;
          }
        }

        return {
          dayLabel,
          shortDate,
          dateKey,
          isToday,
          handle: topHandle,
          nodesVal: topNodes,
          altitudeVal: topAltitude,
          isMe
        };
      });
    }

    buildLocalFallbackLeaderboard(tier) {
      // Notice OrchidSprinter and SumiBrush99 both chained 34 nodes,
      // but OrchidSprinter climbed faster and reached 59.2m vs 53.6m!
      const baseBots = [
        { handle: 'CanopyViper', nodes: 38, altitude: 68.4 },
        { handle: 'OrchidSprinter', nodes: 34, altitude: 59.2 },
        { handle: 'SumiBrush99', nodes: 34, altitude: 53.6 },
        { handle: 'GlasshouseFern', nodes: 25, altitude: 41.8 },
        { handle: 'BriarRoot42', nodes: 19, altitude: 29.4 }
      ];

      const mult = tier === 'monthly' ? 14 : tier === 'weekly' ? 4 : 1;
      const rows = baseBots.map((b) => ({
        handle: b.handle,
        nodesVal: b.nodes * mult,
        altitudeVal: Number((b.altitude * mult).toFixed(1)),
        isMe: false
      }));

      // Include player's own official runs
      const localRunsRaw = localStorage.getItem('wordvine_local_runs');
      const localRuns = localRunsRaw ? JSON.parse(localRunsRaw) : [];
      if (tier === 'daily') {
        const myToday = localRuns.find((r) => r.dateKey === this.activeVine.dateKey);
        if (myToday) {
          rows.push({
            handle: this.playerHandle,
            nodesVal: Number(myToday.nodesCompleted) || 0,
            altitudeVal: Number(myToday.altitudeMeters) || 0,
            isMe: true
          });
        }
      } else if (localRuns.length > 0) {
        const limit = tier === 'weekly' ? 5 : 20;
        const sortedRuns = localRuns
          .slice()
          .sort((a, b) => {
            const dn = (Number(b.nodesCompleted) || 0) - (Number(a.nodesCompleted) || 0);
            if (dn !== 0) return dn;
            return (Number(b.altitudeMeters) || 0) - (Number(a.altitudeMeters) || 0);
          })
          .slice(0, limit);
        const totalNodes = sortedRuns.reduce((acc, r) => acc + (Number(r.nodesCompleted) || 0), 0);
        const totalAlt = Number(
          sortedRuns.reduce((acc, r) => acc + (Number(r.altitudeMeters) || 0), 0).toFixed(1)
        );
        rows.push({
          handle: this.playerHandle,
          nodesVal: totalNodes,
          altitudeVal: totalAlt,
          isMe: true
        });
      }

      // Sort by Nodes Chained DESC, then by Speed-Driven Height DESC
      rows.sort((a, b) => {
        if (b.nodesVal !== a.nodesVal) return b.nodesVal - a.nodesVal;
        return b.altitudeVal - a.altitudeVal;
      });
      return rows;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.wordVineApp = new WordVineApp();
  });
})();
