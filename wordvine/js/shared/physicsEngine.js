/**
 * Word Vine — Isomorphic Viewport Camera & Vine Physics Engine
 * Shared between Browser Client (GitHub Pages) and Node.js Replay Verifier (Render).
 *
 * Coordinate Space:
 * - Normalized vertical viewport height = 1000 units.
 * - Y_cam: Bottom edge of the visible viewport (starts at 0).
 * - Y_vine: Active tip of the climbing vine (starts at 360, giving ~8s initial runway).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WordVinePhysics = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PHYSICS_CONFIG = {
    VIEWPORT_HEIGHT: 1000,
    INITIAL_Y_CAM: 0,
    INITIAL_Y_VINE: 360,          // 360u lead at (45 - 15.75) = 29.25 u/s net loss => ~8.2s initial breathing room
    V_BASE: 45,                   // Steady base camera pan speed (units/sec) — no gradual speed-up!
    ALPHA_TIME_ACCEL: 0,          // Replaced gradual time acceleration with cognitive mode switches
    BETA_NODE_ACCEL: 0,           // Replaced gradual node acceleration with cognitive mode switches
    V_CAM_MAX: 280,               // Terminal camera velocity cap (units/sec)
    CREEP_RATIO: 0.35,            // Passive vine creep V_creep = 0.35 * V_cam
    SPURT_STANDARD: 125,          // Standard correct answer impulse (+125 units)
    SPURT_TRIPLE_BLOOM: 185,      // 1.5x Triple-Bloom spurt on 3rd word of Zone 1 triplet (+185 units)
    SPURT_REVERSE_GRAFT: 155,     // Boosted spurt when uncurling out of a Reverse-Graft Loop (+155 units)
    SPURT_DURATION_MS: 180,       // Impulse duration (180ms cubic ease-out)
    SWEET_SPOT_CEILING: 750,      // Max lead (Y_vine - Y_cam) before camera smoothly lerps up
    CAMERA_CLAMP_LERP: 14.0,      // Lerp speed when clamping camera to keep active fork below 750u
    DANGER_THRESHOLD: 150,        // Danger vignette & heartbeat trigger when (Y_vine - Y_cam) <= 150u
    GRAFT_BULLET_TIME_MS: 600,    // 0.6-second slow-motion breath across Graft Collar
    REVERSE_LOOP_BREATH_MS: 450,  // 0.45-second slow-motion breath when curling into a Reverse-Graft Loop
    GRAFT_TIME_SCALE: 0.25,       // Time dilation multiplier during Graft Collar / Loop entry
    INPUT_BUFFER_MS: 120,         // 120ms input buffer window during growth spurt
    ZONE_1_END_NODE: 12,          // Nodes 1..12 (indices 0..11) are Zone 1
    ZONE_2_END_NODE: 28,          // Nodes 13..28 (indices 12..27) are Zone 2
                                  // Nodes 29+ (indices 28+) are Zone 3
    TRIPLE_BLOOM_BONUS: 250,      // Flat +250 score bonus on completing 3rd step of a Zone 1 triplet
    REVERSE_GRAFT_BONUS: 150,     // Flat +150 score bonus on solving a Reverse-Graft Loop (⬅)
    METERS_PER_UNIT: 0.012        // Conversion from normalized units to display altitude meters (e.g. 3500u = 42.0m)
  };

  /**
   * Cubic ease-out curve f(t) = 1 - (1 - t)^3 for [0, 1]
   */
  function cubicEaseOut(t) {
    const clamped = Math.max(0, Math.min(1, t));
    const inv = 1 - clamped;
    return 1 - inv * inv * inv;
  }

  /**
   * Determines Zone ID (1, 2, or 3) from 0-based node index
   */
  function getZoneForNodeIndex(nodeIndex) {
    const nodeNumber = nodeIndex + 1;
    if (nodeNumber <= PHYSICS_CONFIG.ZONE_1_END_NODE) return 1;
    if (nodeNumber <= PHYSICS_CONFIG.ZONE_2_END_NODE) return 2;
    return 3;
  }

  /**
   * Checks if a 0-based node index is within 2 nodes of a zone transition (Rising Sap Warning)
   * Returns the upcoming zone ID (2 or 3) or 0 if not in warning window.
   */
  function getRisingSapWarningZone(nodeIndex) {
    const nodeNumber = nodeIndex + 1;
    if (nodeNumber === 11 || nodeNumber === 12) return 2;
    if (nodeNumber === 27 || nodeNumber === 28) return 3;
    return 0;
  }

  /**
   * Computes instantaneously target camera velocity V_cam(t, N)
   */
  function computeCameraVelocity(effectiveElapsedSec, nodesCompleted) {
    const raw =
      PHYSICS_CONFIG.V_BASE +
      PHYSICS_CONFIG.ALPHA_TIME_ACCEL * effectiveElapsedSec +
      PHYSICS_CONFIG.BETA_NODE_ACCEL * nodesCompleted;
    return Math.min(PHYSICS_CONFIG.V_CAM_MAX, raw);
  }

  /**
   * Computes single-node score according to canonical specification:
   * Node Score = (100 * Z_mult) + floor((Y_vine - Y_cam) / 10) + B_triplet + B_reverseGraft
   */
  function computeNodeScore(zoneId, yVine, yCam, isTripleBloom, isReverseGraft = false) {
    const zMult = zoneId === 1 ? 1 : zoneId === 2 ? 2 : 3;
    const basePoints = 100 * zMult;
    const leadUnits = Math.max(0, yVine - yCam);
    const leadBonus = Math.floor(leadUnits / 10);
    const tripletBonus = isTripleBloom ? PHYSICS_CONFIG.TRIPLE_BLOOM_BONUS : 0;
    const reverseGraftBonus = isReverseGraft ? PHYSICS_CONFIG.REVERSE_GRAFT_BONUS : 0;
    return {
      totalNodeScore: basePoints + leadBonus + tripletBonus + reverseGraftBonus,
      basePoints,
      leadBonus,
      tripletBonus,
      reverseGraftBonus
    };
  }

  /**
   * Creates a fresh simulation state instance
   */
  function createSimulationState(startNodeIndex = 0) {
    const initialZone = getZoneForNodeIndex(startNodeIndex);
    return {
      status: 'PLAYING', // 'PLAYING' | 'SNIPPED' | 'OUTRUN' | 'COMPLETED'
      nodeIndex: startNodeIndex,
      nodesCompleted: startNodeIndex,
      zoneId: initialZone,
      activeGameMode: 'FORWARD',
      elapsedMs: 0,
      effectiveElapsedSec: startNodeIndex > 0 ? startNodeIndex * 1.45 : 0,
      yCam: PHYSICS_CONFIG.INITIAL_Y_CAM,
      yVine: PHYSICS_CONFIG.INITIAL_Y_VINE,
      vCam: computeCameraVelocity(startNodeIndex > 0 ? startNodeIndex * 1.45 : 0, startNodeIndex),
      vVine: 0,
      // Active spurt state
      spurtActive: false,
      spurtElapsedMs: 0,
      spurtDurationMs: PHYSICS_CONFIG.SPURT_DURATION_MS,
      spurtTotalDelta: 0,
      spurtAppliedDelta: 0,
      // Bullet-time Graft Collar / Mode Switch state
      bulletTimeRemainingMs: 0,
      lastGraftZoneTriggered: initialZone,
      // Scoring & telemetry
      score: 0,
      tripletBlooms: 0,
      reverseGraftsSolved: 0,
      comboMultiplier: 1,
      maxAltitudeUnits: PHYSICS_CONFIG.INITIAL_Y_VINE,
      lastNodeScoreBreakdown: null,
      deathReason: null,
      wrongChoiceWord: null,
      correctChoiceWord: null
    };
  }

  /**
   * Advances simulation state by dtMs milliseconds
   */
  function stepSimulation(state, dtMs) {
    if (state.status !== 'PLAYING' || dtMs <= 0) {
      return state;
    }

    // Apply Graft Collar / Reverse-Graft Loop bullet-time dilation if active
    let timeScale = 1.0;
    if (state.bulletTimeRemainingMs > 0) {
      const btProgress = 1 - state.bulletTimeRemainingMs / PHYSICS_CONFIG.GRAFT_BULLET_TIME_MS;
      // Smoothly ease timeScale from 0.25 back to 1.0
      timeScale =
        PHYSICS_CONFIG.GRAFT_TIME_SCALE +
        (1 - PHYSICS_CONFIG.GRAFT_TIME_SCALE) * (btProgress * btProgress);
      state.bulletTimeRemainingMs = Math.max(0, state.bulletTimeRemainingMs - dtMs);
    }

    const dtSec = (dtMs / 1000) * timeScale;
    state.elapsedMs += dtMs;
    state.effectiveElapsedSec += dtSec;

    // 1. Update camera velocity & position
    state.vCam = computeCameraVelocity(state.effectiveElapsedSec, state.nodesCompleted);
    state.yCam += state.vCam * dtSec;

    // 2. Passive vine creep
    const vCreep = PHYSICS_CONFIG.CREEP_RATIO * state.vCam;
    let dyVine = vCreep * dtSec;

    // 3. Active answer growth spurt (cubic ease-out over 180ms real-time so input feels snappy)
    let vSpurtInst = 0;
    if (state.spurtActive) {
      state.spurtElapsedMs += dtMs;
      const progress = Math.min(1, state.spurtElapsedMs / state.spurtDurationMs);
      const eased = cubicEaseOut(progress);
      const targetDelta = state.spurtTotalDelta * eased;
      const stepDelta = Math.max(0, targetDelta - state.spurtAppliedDelta);
      dyVine += stepDelta;
      state.spurtAppliedDelta = targetDelta;
      vSpurtInst = stepDelta / Math.max(0.001, dtMs / 1000);

      if (progress >= 1) {
        state.spurtActive = false;
      }
    }

    state.yVine += dyVine;
    state.vVine = vCreep + vSpurtInst;
    if (state.yVine > state.maxAltitudeUnits) {
      state.maxAltitudeUnits = state.yVine;
    }

    // 4. Sweet-Spot Camera Clamping: keep active vine fork from clipping above 750u on screen
    const screenY = state.yVine - state.yCam;
    if (screenY > PHYSICS_CONFIG.SWEET_SPOT_CEILING) {
      const excess = screenY - PHYSICS_CONFIG.SWEET_SPOT_CEILING;
      const clampStep = excess * Math.min(1, PHYSICS_CONFIG.CAMERA_CLAMP_LERP * (dtMs / 1000));
      state.yCam += clampStep;
    }

    // 5. Check Viewport Outrun (Starvation) lose condition
    if (state.yVine <= state.yCam) {
      state.yVine = state.yCam;
      state.status = 'OUTRUN';
      state.vCam = 0;
      state.vVine = 0;
      state.deathReason = 'OUTRUN';
    }

    return state;
  }

  /**
   * Processes a player choice (0 = Left, 1 = Right, or chosen word string) on the current node
   */
  function applyPlayerChoice(state, vineNodes, choiceSide) {
    if (state.status !== 'PLAYING') return { accepted: false, state };
    const currentNode = vineNodes[state.nodeIndex];
    if (!currentNode) return { accepted: false, state };

    const isCorrect =
      typeof choiceSide === 'string' && isNaN(Number(choiceSide))
        ? choiceSide.trim().toUpperCase() === String(currentNode.correctWord || '').trim().toUpperCase()
        : Number(choiceSide) === Number(currentNode.leftRightSeed);

    if (!isCorrect) {
      // Lexical Strike (Wrong Choice): instant stem snap
      state.status = 'SNIPPED';
      state.vCam = 0;
      state.vVine = 0;
      state.spurtActive = false;
      state.deathReason = 'SNIPPED';
      state.wrongChoiceWord = currentNode.decoyWord;
      state.correctChoiceWord = currentNode.correctWord;
      return { accepted: true, correct: false, state, node: currentNode };
    }

    // Correct choice! Determine if this completes a 3-part triplet or a Reverse-Graft Loop
    const zoneId = currentNode.zoneId || getZoneForNodeIndex(state.nodeIndex);
    const isTripleBloom = zoneId === 1 && currentNode.tripletStep === 3;
    const isReverseGraft = Boolean(
      currentNode.isReverseGraft || currentNode.gameMode === 'REVERSE_GRAFT'
    );

    // Score calculation
    const scoreBreakdown = computeNodeScore(
      zoneId,
      state.yVine,
      state.yCam,
      isTripleBloom,
      isReverseGraft
    );
    state.score += scoreBreakdown.totalNodeScore;
    state.lastNodeScoreBreakdown = {
      ...scoreBreakdown,
      isTripleBloom,
      isReverseGraft,
      word: currentNode.correctWord,
      stemWord: currentNode.stemWord
    };

    if (isTripleBloom) {
      state.tripletBlooms += 1;
      state.comboMultiplier += 1;
    }
    if (isReverseGraft) {
      state.reverseGraftsSolved = (state.reverseGraftsSolved || 0) + 1;
    }

    // Trigger upward growth spurt
    const spurtImpulse = isTripleBloom
      ? PHYSICS_CONFIG.SPURT_TRIPLE_BLOOM
      : isReverseGraft
        ? PHYSICS_CONFIG.SPURT_REVERSE_GRAFT
        : PHYSICS_CONFIG.SPURT_STANDARD;

    // If a previous spurt had residual unapplied delta, credit it immediately so fast double-taps never lose height
    if (state.spurtActive && state.spurtTotalDelta > state.spurtAppliedDelta) {
      state.yVine += state.spurtTotalDelta - state.spurtAppliedDelta;
    }

    state.spurtActive = true;
    state.spurtElapsedMs = 0;
    state.spurtDurationMs = isTripleBloom ? 210 : PHYSICS_CONFIG.SPURT_DURATION_MS;
    state.spurtTotalDelta = spurtImpulse;
    state.spurtAppliedDelta = 0;

    // Advance node index
    state.nodesCompleted += 1;
    state.nodeIndex += 1;

    // Check if daily chain was completed
    if (state.nodeIndex >= vineNodes.length) {
      // Apply the final spurt height immediately for final altitude tally
      state.yVine += spurtImpulse;
      state.maxAltitudeUnits = Math.max(state.maxAltitudeUnits, state.yVine);
      state.status = 'COMPLETED';
      state.deathReason = 'COMPLETED';
      return {
        accepted: true,
        correct: true,
        isTripleBloom,
        isReverseGraft,
        enteredReverseGraft: false,
        triggeredGraftCollar: false,
        state,
        node: currentNode
      };
    }

    // Check if crossing into a Reverse-Graft Loop or a new Zone
    const nextNode = vineNodes[state.nodeIndex];
    const nextZone = nextNode.zoneId || getZoneForNodeIndex(state.nodeIndex);
    const nextIsReverseGraft = Boolean(
      nextNode.isReverseGraft || nextNode.gameMode === 'REVERSE_GRAFT'
    );
    state.activeGameMode = nextIsReverseGraft ? 'REVERSE_GRAFT' : 'FORWARD';

    let triggeredGraftCollar = false;
    if (nextZone !== state.zoneId) {
      state.zoneId = nextZone;
      state.bulletTimeRemainingMs = PHYSICS_CONFIG.GRAFT_BULLET_TIME_MS;
      state.lastGraftZoneTriggered = nextZone;
      triggeredGraftCollar = true;
    } else if (nextIsReverseGraft) {
      // Brief slow-motion breath as the vine curls into the Reverse-Graft Loop
      state.bulletTimeRemainingMs = Math.max(
        state.bulletTimeRemainingMs,
        PHYSICS_CONFIG.REVERSE_LOOP_BREATH_MS
      );
    }

    return {
      accepted: true,
      correct: true,
      isTripleBloom,
      isReverseGraft,
      enteredReverseGraft: nextIsReverseGraft,
      triggeredGraftCollar,
      nextZone,
      state,
      node: currentNode
    };
  }

  /**
   * Server-Side Deterministic Replay Verification
   * Re-simulates a client run from keystroke delta timestamps [dt_1, dt_2, ...] in 5ms fixed steps
   * to verify that the vine never fell below Y_cam and to compute the canonical score.
   */
  function verifyReplay(vineNodes, choices, deltasMs, finalWaitMs = 0) {
    if (!Array.isArray(vineNodes) || !Array.isArray(choices) || !Array.isArray(deltasMs)) {
      return { valid: false, reason: 'Invalid replay payload arrays' };
    }
    if (choices.length !== deltasMs.length) {
      return { valid: false, reason: 'Mismatch between choices and deltasMs length' };
    }
    if (choices.length > vineNodes.length) {
      return { valid: false, reason: 'More choices submitted than nodes in daily vine' };
    }

    const state = createSimulationState(0);
    const FIXED_STEP_MS = 5;

    for (let i = 0; i < choices.length; i++) {
      const dt = Number(deltasMs[i]);
      if (!Number.isFinite(dt) || dt < 15 || dt > 30000) {
        return { valid: false, reason: `Implausible keystroke delta at step ${i}: ${dt}ms` };
      }

      // Step physics forward by dt in fixed 5ms increments
      let remaining = dt;
      while (remaining > 0 && state.status === 'PLAYING') {
        const step = Math.min(FIXED_STEP_MS, remaining);
        stepSimulation(state, step);
        remaining -= step;
      }

      if (state.status !== 'PLAYING') {
        // Vine was already outrun before this keystroke occurred
        break;
      }

      applyPlayerChoice(state, vineNodes, choices[i]);
      if (state.status !== 'PLAYING') {
        break;
      }
    }

    // If the player died by starvation (OUTRUN) after their last correct keystroke, simulate finalWaitMs
    if (state.status === 'PLAYING' && finalWaitMs > 0) {
      let remaining = Math.min(60000, Number(finalWaitMs) || 0);
      while (remaining > 0 && state.status === 'PLAYING') {
        const step = Math.min(FIXED_STEP_MS, remaining);
        stepSimulation(state, step);
        remaining -= step;
      }
    }

    const altitudeMeters = Number((state.maxAltitudeUnits * PHYSICS_CONFIG.METERS_PER_UNIT).toFixed(1));

    return {
      valid: true,
      score: state.score,
      nodesCompleted: state.nodesCompleted,
      zoneReached: state.zoneId,
      tripletBlooms: state.tripletBlooms,
      reverseGraftsSolved: state.reverseGraftsSolved || 0,
      altitudeMeters,
      deathCause: state.status === 'PLAYING' ? 'OUTRUN' : state.status
    };
  }

  return {
    PHYSICS_CONFIG,
    cubicEaseOut,
    getZoneForNodeIndex,
    getRisingSapWarningZone,
    computeCameraVelocity,
    computeNodeScore,
    createSimulationState,
    stepSimulation,
    applyPlayerChoice,
    verifyReplay
  };
});
