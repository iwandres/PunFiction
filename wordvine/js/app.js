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

  class WordVineApp {
    constructor() {
      this.canvas = document.getElementById('vine-canvas');
      this.renderer = new RendererClass(this.canvas);

      // Identity (Zero sign-in friction: Anonymous Device Token + Handle)
      this.deviceToken = this.getOrCreateDeviceToken();
      this.playerHandle = this.getOrCreateHandle();

      // Active daily vine & simulation state
      this.dailyVines = this.loadAvailableVines();
      this.currentVineIndex = 0;
      this.activeVine = this.dailyVines[0];
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
      this.fovealNode3Label = document.getElementById('foveal-node3-label');
      this.fovealNode3Word = document.getElementById('foveal-node3-word');
      this.leftPill = document.getElementById('left-pill');
      this.rightPill = document.getElementById('right-pill');
      this.leftWordEl = document.getElementById('left-word');
      this.rightWordEl = document.getElementById('right-word');
      this.stemWordEl = document.getElementById('stem-word');
      this.stemZoneBadge = document.getElementById('stem-zone-badge');
      this.tripletPipBar = document.getElementById('triplet-pip-bar');
      this.tripletSlotEls = [
        document.getElementById('triplet-slot-1'),
        document.getElementById('triplet-slot-2'),
        document.getElementById('triplet-slot-3')
      ];
      this.pipBuds = [
        document.getElementById('pip-1'),
        document.getElementById('pip-2'),
        document.getElementById('pip-3')
      ];
      this.pipLabel = document.getElementById('pip-label');

      // Top HUD elements
      this.hudScore = document.getElementById('hud-score');
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
          if (remoteVine && Array.isArray(remoteVine.zone1Triplets) && remoteVine.zone1Triplets.length > 0) {
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

      // Check URL params for day selection (?vine=0)
      const params = new URLSearchParams(window.location.search);
      const vineIdxParam = Number(params.get('vine'));
      if (Number.isInteger(vineIdxParam) && this.dailyVines[vineIdxParam]) {
        this.currentVineIndex = vineIdxParam;
        this.activeVine = this.dailyVines[vineIdxParam];
        this.rebuildActivePuzzle(0);
      }

      // Apply theme from active vine
      this.renderer.setTheme(this.activeVine.themeId || 0);
      this.renderer.resetVine(Physics.PHYSICS_CONFIG.INITIAL_Y_VINE, 1);
      this.updateThemeButtonLabel();
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

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          this.handleBinaryInput(0);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          this.handleBinaryInput(1);
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (!this.startModal.classList.contains('hidden')) {
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
      this.themeCycleBtn.addEventListener('click', () => {
        const nextTheme = (this.renderer.themeId + 1) % 3;
        this.renderer.setTheme(nextTheme);
        this.updateThemeButtonLabel();
      });

      this.muteBtn.addEventListener('click', () => {
        Sound.toggleMute();
        this.updateMuteButtonLabel();
      });

      this.leaderboardBtn.addEventListener('click', () => {
        this.openLeaderboardModal('daily');
      });

      // Start & Death Modal Buttons
      document.getElementById('btn-start-climb').addEventListener('click', () => {
        this.startNewRun(0);
      });

      document.getElementById('btn-switch-vine').addEventListener('click', () => {
        this.currentVineIndex = (this.currentVineIndex + 1) % this.dailyVines.length;
        this.activeVine = this.dailyVines[this.currentVineIndex];
        this.runAttemptCount = 0;
        this.rebuildActivePuzzle(0);
        this.renderer.setTheme(this.activeVine.themeId || 0);
        this.updateThemeButtonLabel();
        this.syncStartModalMetadata();
        this.syncFovealDOM();
      });

      const startLbBtn = document.getElementById('btn-start-leaderboard');
      if (startLbBtn) {
        startLbBtn.addEventListener('click', () => {
          this.openLeaderboardModal('daily');
        });
      }

      document.getElementById('btn-retry-practice').addEventListener('click', () => {
        this.deathModal.classList.add('hidden');
        this.runAttemptCount += 1;
        this.startNewRun(0);
      });

      document.getElementById('btn-copy-receipt').addEventListener('click', () => {
        this.copyReceiptToClipboard();
      });

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
    }

    updateThemeButtonLabel() {
      const theme = this.renderer.getTheme();
      this.themeCycleBtn.textContent = `🎨 Day ${theme.id + 1}: ${theme.name.split(' ')[0]}`;
    }

    updateMuteButtonLabel() {
      this.muteBtn.textContent = Sound.muted ? '🔇 Muted' : '🔊 Audio';
    }

    hasPlayedOfficialToday(dateKey) {
      return Boolean(localStorage.getItem(`wordvine_official_${dateKey}`));
    }

    syncStartModalMetadata() {
      const vine = this.activeVine;
      const alreadyPlayed = this.hasPlayedOfficialToday(vine.dateKey);
      document.getElementById('start-vine-eyebrow').textContent =
        `DAILY VINE #${vine.vineNumber} • ${vine.dateKey}`;
      document.getElementById('start-vine-title').textContent = vine.title || 'Word Vine';
      this.hudModeBadge.textContent = alreadyPlayed ? 'PRACTICE REPLAY' : 'OFFICIAL DAILY RUN';
      document.getElementById('btn-start-climb').textContent = alreadyPlayed
        ? '🌱 Start Practice Replay'
        : '🌿 Start Official Daily Climb';
    }

    startNewRun(startNodeIndex = 0) {
      if (this.handleInput && this.handleInput.value.trim()) {
        this.playerHandle = this.handleInput.value.trim().slice(0, 20);
        localStorage.setItem('wordvine_handle', this.playerHandle);
      }

      Sound.init();
      this.startModal.classList.add('hidden');
      this.deathModal.classList.add('hidden');
      this.leaderboardModal.classList.add('hidden');

      this.leftPill.classList.remove('snipped-wrong', 'snipped-correct');
      this.rightPill.classList.remove('snipped-wrong', 'snipped-correct');

      const alreadyPlayed = this.hasPlayedOfficialToday(this.activeVine.dateKey);
      this.isOfficialAttempt = !alreadyPlayed && startNodeIndex === 0;
      this.hudModeBadge.textContent = this.isOfficialAttempt ? 'OFFICIAL DAILY' : 'PRACTICE MODE';

      // Build a fresh puzzle with randomized Left/Right positions & decoys (and rotated compound chain on replay)
      const effectiveAttempt = this.isOfficialAttempt ? 0 : Math.max(1, this.runAttemptCount);
      this.rebuildActivePuzzle(effectiveAttempt);

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
        !this.leaderboardModal.classList.contains('hidden')
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
        // Lexical Strike (Wrong Choice)
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
      } else if (result.isTripleBloom) {
        Sound.playTripleBloom();
      } else {
        Sound.playSpurt(this.simState.zoneId, this.simState.nodesCompleted);
      }

      this.renderer.recordCompletedNode({
        yWorld: prevYVine,
        zoneId: result.node.zoneId,
        isTripleBloom: result.isTripleBloom,
        triggeredGraftCollar: result.triggeredGraftCollar,
        word: result.node.correctWord,
        choiceSide
      });

      this.spawnScorePop(this.simState.lastNodeScoreBreakdown);

      if (this.simState.status === 'COMPLETED') {
        setTimeout(() => this.onRunEnded(result.node), 420);
        return;
      }

      this.syncFovealDOM();
      this.syncTelemetryHUD();
    }

    spawnScorePop(breakdown) {
      if (!breakdown) return;
      const pop = document.createElement('div');
      pop.className = 'score-pop';
      const screenY = this.renderer.worldToScreenY(this.simState.yVine, this.simState.yCam);
      pop.style.top = `${Math.max(80, screenY - 120)}px`;
      pop.textContent = breakdown.isTripleBloom
        ? `🌸 TRIPLE BLOOM! +${breakdown.totalNodeScore}`
        : `+${breakdown.totalNodeScore}`;
      document.body.appendChild(pop);
      setTimeout(() => pop.remove(), 650);
    }

    /**
     * Synchronizes the Foveal Choice words, Faint Node 3 Preview above, Zone classes, and 3-Part Linked Compound Chain Bar
     */
    syncFovealDOM() {
      const node = this.activeVine.nodes[this.simState.nodeIndex];
      if (!node) return;

      document.body.classList.remove('zone-1', 'zone-2', 'zone-3');
      document.body.classList.add(`zone-${node.zoneId}`);

      this.stemWordEl.textContent = node.displayStem || node.stemWord;

      // Determine left vs right words from node.leftRightSeed
      const leftWord = node.leftRightSeed === 0 ? node.correctWord : node.decoyWord;
      const rightWord = node.leftRightSeed === 1 ? node.correctWord : node.decoyWord;
      this.leftWordEl.textContent = leftWord;
      this.rightWordEl.textContent = rightWord;

      // Update Stem Zone Badge, Faint Node 3 Above, and 3-Part Linked Slots
      if (node.zoneId === 1) {
        const nextNode = this.activeVine.nodes[this.simState.nodeIndex + 1];
        const step = node.tripletStep || 2;
        this.stemZoneBadge.textContent = node.stemBadge || 'ZONE 1 • 3-PART COMPOUND';
        this.tripletPipBar.classList.remove('hidden');

        // 1. Update Faint Node 3 Preview floating above the Left/Right fork
        if (this.fovealNode3Wrap) {
          this.fovealNode3Wrap.classList.remove('hidden');
          const faint = node.faintAbove || {
            label: step === 2 ? 'NODE 3 AHEAD • 3-PART LINK' : 'NEXT LINKED TRIPLET',
            word: nextNode ? `🌸 ${nextNode.correctWord}` : '🌸 BLOOM',
            isNextTriplet: step !== 2
          };
          this.fovealNode3Wrap.classList.toggle('is-next-triplet', Boolean(faint.isNextTriplet));
          if (this.fovealNode3Label) this.fovealNode3Label.textContent = faint.label;
          if (this.fovealNode3Word) this.fovealNode3Word.textContent = faint.word;
        }

        // 2. Update 3-Part Linked Word Slots beneath the stem card
        const slots = node.tripletSlots || [
          node.stemWord,
          step === 2 ? '[ ? ]' : node.correctWord,
          step === 3 ? '🌸 [ ? ]' : (nextNode ? `🌸 ${nextNode.correctWord}` : '🌸')
        ];
        this.tripletSlotEls.forEach((slotEl, idx) => {
          if (!slotEl) return;
          slotEl.textContent = slots[idx] || '';
          slotEl.classList.remove('filled', 'active-pick', 'faint-preview');
          if (step === 2) {
            // Choosing Part 2 of 3: Slot 0 is filled, Slot 1 is active [ ? ], Slot 2 is faint Node 3 preview
            if (idx === 0) slotEl.classList.add('filled');
            else if (idx === 1) slotEl.classList.add('active-pick');
            else slotEl.classList.add('faint-preview');
          } else if (step === 3) {
            // Choosing Part 3 of 3 (Bloom): Slots 0 & 1 are filled, Slot 2 is active [ ? ]
            if (idx < 2) slotEl.classList.add('filled');
            else slotEl.classList.add('active-pick');
          } else {
            // Step 1 (Thematic Link Bridge between Triplet N's 3rd word and Triplet N+1's 1st word)
            if (idx === 0) slotEl.classList.add('filled');
            else if (idx === 1) slotEl.classList.add('active-pick');
            else slotEl.classList.add('faint-preview');
          }
        });

        // 3. Highlight buds (● ● ○) according to tripletStep
        this.pipBuds.forEach((bud, idx) => {
          bud.classList.toggle('filled', idx < step);
          bud.classList.toggle('bloom-step', idx === 2);
        });
        this.pipLabel.textContent =
          step === 3
            ? '🌸 PART 3 OF 3 (BLOOM)'
            : step === 2
              ? 'PART 2 OF 3'
              : '🔗 LINK TO NEXT TRIPLET';
      } else if (node.zoneId === 2) {
        this.stemZoneBadge.textContent = '+ ZONE 2 • 2-PART PIVOT';
        this.tripletPipBar.classList.add('hidden');
        if (this.fovealNode3Wrap) this.fovealNode3Wrap.classList.add('hidden');
      } else {
        this.stemZoneBadge.textContent = '~ ZONE 3 • PARTICLE SPRINT';
        this.tripletPipBar.classList.add('hidden');
        if (this.fovealNode3Wrap) this.fovealNode3Wrap.classList.add('hidden');
      }
    }

    syncTelemetryHUD() {
      const altitudeMeters = (
        this.simState.maxAltitudeUnits * Physics.PHYSICS_CONFIG.METERS_PER_UNIT
      ).toFixed(1);
      this.hudScore.textContent = this.simState.score.toLocaleString();
      this.hudAltitude.textContent = `${altitudeMeters}m`;
      this.hudVelocity.textContent = `${Math.round(this.simState.vCam)} u/s`;
      this.hudZone.textContent = `Z${this.simState.zoneId} • ${this.simState.nodesCompleted}/${this.activeVine.nodes.length}`;
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

      // Position #foveal-anchor to track the active vine tip on screen
      const tipScreenY = this.renderer.worldToScreenY(
        this.simState.yVine,
        this.simState.yCam
      );
      const minTopY = this.simState.zoneId === 1 ? 195 : 135;
      const clampedScreenY = Math.max(minTopY, Math.min(window.innerHeight - 125, tipScreenY - 38));
      this.fovealAnchor.style.top = `${clampedScreenY}px`;

      // Render HD Canvas
      const risingSapZone = Physics.getRisingSapWarningZone(this.simState.nodeIndex);
      this.renderer.render(this.simState, dtMs, risingSapZone);

      requestAnimationFrame((t) => this.loop(t));
    }

    /**
     * Handles End of Run (SNIPPED, OUTRUN, or COMPLETED), records Official Score, and builds Receipt
     */
    async onRunEnded(fatalNode) {
      const altitudeMeters = Number(
        (this.simState.maxAltitudeUnits * Physics.PHYSICS_CONFIG.METERS_PER_UNIT).toFixed(1)
      );
      const cause = this.simState.status; // 'SNIPPED' | 'OUTRUN' | 'COMPLETED'

      // Populate Death / Completion Modal
      const titleEl = document.getElementById('death-modal-title');
      const eyebrowEl = document.getElementById('death-modal-eyebrow');
      const explainEl = document.getElementById('death-explanation');

      eyebrowEl.textContent = this.isOfficialAttempt
        ? `OFFICIAL DAILY RUN LOCKED • #${this.activeVine.vineNumber}`
        : `PRACTICE REPLAY • #${this.activeVine.vineNumber}`;

      if (cause === 'COMPLETED') {
        titleEl.textContent = '🌸 Canopy Circuit Closed!';
        explainEl.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        explainEl.style.background = 'rgba(34, 197, 94, 0.14)';
        explainEl.innerHTML = `<strong>Mastery Achieved!</strong> You chained all ${this.activeVine.nodes.length} forward compounds at up to ${Math.round(this.simState.vCam)} u/s!`;
      } else if (cause === 'SNIPPED') {
        titleEl.textContent = `✂️ Snipped at ${altitudeMeters}m`;
        explainEl.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        explainEl.style.background = 'rgba(239, 68, 68, 0.12)';
        const stem = fatalNode ? fatalNode.stemWord : '';
        const right = fatalNode ? fatalNode.correctWord : '';
        const wrong = fatalNode ? fatalNode.decoyWord : '';
        const note = fatalNode && fatalNode.explanation ? fatalNode.explanation : '';
        explainEl.innerHTML = `<strong>${stem} → ${right}</strong> (${fatalNode ? fatalNode.compoundHint : ''}) was the forward compound.<br>You picked <strong>${wrong}</strong>. ${note}`;
      } else {
        titleEl.textContent = `🌑 Outrun at ${altitudeMeters}m`;
        explainEl.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        explainEl.style.background = 'rgba(245, 158, 11, 0.12)';
        const stem = fatalNode ? fatalNode.stemWord : '';
        const right = fatalNode ? fatalNode.correctWord : '';
        explainEl.innerHTML = `The rising viewport overtook your vine tip on <strong>${stem} → ${right}</strong>!`;
      }

      document.getElementById('stat-final-score').textContent =
        this.simState.score.toLocaleString();
      document.getElementById('stat-final-nodes').textContent =
        `${this.simState.nodesCompleted}/${this.activeVine.nodes.length}`;
      document.getElementById('stat-final-altitude').textContent = `${altitudeMeters}m`;

      // Build Shareable Botanical Receipt
      const bloomsStr =
        this.simState.tripletBlooms > 0
          ? '🌸'.repeat(this.simState.tripletBlooms)
          : '🌱';
      const zoneLabel =
        this.simState.zoneId === 3
          ? '⚡ Zone 3 (Canopy)'
          : this.simState.zoneId === 2
          ? '🪵 Zone 2 (Stem)'
          : '🌿 Zone 1 (Roots)';
      const deathLine =
        cause === 'COMPLETED'
          ? `👑 Circuit Closed at ${altitudeMeters}m (Node ${this.simState.nodesCompleted})`
          : cause === 'SNIPPED'
          ? `✂️ Snipped at ${altitudeMeters}m (Node ${this.simState.nodesCompleted + 1})`
          : `🌑 Outrun at ${altitudeMeters}m (Node ${this.simState.nodesCompleted + 1})`;

      this.currentReceiptText = [
        `🌿 WORD VINE #${this.activeVine.vineNumber} (${this.activeVine.dateKey})`,
        `${bloomsStr} | ${zoneLabel}`,
        deathLine,
        `🏆 Score: ${this.simState.score.toLocaleString()}${this.isOfficialAttempt ? ' (Official)' : ' (Practice)'}`
      ].join('\n');

      document.getElementById('receipt-preview').textContent = this.currentReceiptText;
      this.deathModal.classList.remove('hidden');

      // Save & submit score
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
      // Lock official first attempt in localStorage
      if (runSummary.isOfficial) {
        localStorage.setItem(
          `wordvine_official_${runSummary.dateKey}`,
          JSON.stringify(runSummary)
        );
      }

      // Store in local leaderboard history for immediate offline/demo leaderboard feedback
      const localRunsRaw = localStorage.getItem('wordvine_local_runs');
      const localRuns = localRunsRaw ? JSON.parse(localRunsRaw) : [];
      if (runSummary.isOfficial) {
        localRuns.push({
          ...runSummary,
          handle: this.playerHandle,
          deviceToken: this.deviceToken,
          submittedAt: new Date().toISOString()
        });
        localStorage.setItem('wordvine_local_runs', JSON.stringify(localRuns));
      }

      // Attempt to POST to Render backend API (/api/vine/submit) with keystroke replay deltas
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
        // Offline or static GitHub Pages preview mode — handled seamlessly via local storage
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

    async openLeaderboardModal(tier = 'daily') {
      this.startModal.classList.add('hidden');
      this.deathModal.classList.add('hidden');
      this.leaderboardModal.classList.remove('hidden');

      document.querySelectorAll('.lb-tab').forEach((t) => {
        t.classList.toggle('active', t.getAttribute('data-tier') === tier);
      });

      const subtitleMap = {
        daily: `Daily Official Board (${this.activeVine.dateKey}) • First Attempt Counts`,
        weekly: 'Weekly Crown (Sum of Best 5 of 7 Official Daily Scores)',
        monthly: 'Monthly Mastery (Sum of Top 20 Official Daily Scores)'
      };
      document.getElementById('lb-tier-subtitle').textContent = subtitleMap[tier] || '';

      let entries = null;
      try {
        const res = await fetch(
          `${API_BASE}/leaderboard/${tier}?dateKey=${encodeURIComponent(this.activeVine.dateKey)}`
        );
        if (res.ok) {
          const data = await res.json();
          entries = data.entries;
        }
      } catch (e) {
        // Fallback to seeded + local official runs
      }

      if (!entries) {
        entries = this.buildLocalFallbackLeaderboard(tier);
      }

      const tbody = document.getElementById('lb-table-body');
      tbody.innerHTML = '';
      entries.forEach((row, idx) => {
        const tr = document.createElement('tr');
        if (row.isMe || row.handle === this.playerHandle) {
          tr.className = 'is-me';
        }
        tr.innerHTML = `
          <td>#${idx + 1}</td>
          <td>${row.handle} ${row.isMe ? '(You)' : ''}</td>
          <td>${row.nodes || '--'}</td>
          <td>${row.altitude ? row.altitude + 'm' : '--'}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-primary);">
            ${Number(row.score).toLocaleString()}
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    buildLocalFallbackLeaderboard(tier) {
      const baseBots = [
        { handle: 'CanopyViper', nodes: 38, altitude: '44.8', score: 9420 },
        { handle: 'OrchidSprinter', nodes: 34, altitude: '39.6', score: 7890 },
        { handle: 'SumiBrush99', nodes: 29, altitude: '33.4', score: 6150 },
        { handle: 'GlasshouseFern', nodes: 24, altitude: '27.2', score: 4480 },
        { handle: 'BriarRoot42', nodes: 18, altitude: '20.5', score: 2910 }
      ];

      const mult = tier === 'monthly' ? 14 : tier === 'weekly' ? 4 : 1;
      const rows = baseBots.map((b) => ({
        handle: b.handle,
        nodes: tier === 'daily' ? b.nodes : `${mult}d`,
        altitude: tier === 'daily' ? b.altitude : '',
        score: b.score * mult,
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
            nodes: myToday.nodesCompleted,
            altitude: String(myToday.altitudeMeters),
            score: myToday.score,
            isMe: true
          });
        }
      } else if (localRuns.length > 0) {
        const limit = tier === 'weekly' ? 5 : 20;
        const sortedScores = localRuns.map((r) => r.score).sort((a, b) => b - a).slice(0, limit);
        const total = sortedScores.reduce((acc, v) => acc + v, 0);
        rows.push({
          handle: this.playerHandle,
          nodes: `${sortedScores.length}d`,
          altitude: '',
          score: total,
          isMe: true
        });
      }

      rows.sort((a, b) => b.score - a.score);
      return rows;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.wordVineApp = new WordVineApp();
  });
})();
