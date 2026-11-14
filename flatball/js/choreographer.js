// 7v7 Procedural Choreography & 2.5D Disc Flight Engine for Flatball Tactics
import {
  BOT_OFFENSES,
  BOT_DEFENSES,
  PLAYER_DEFENSES,
  PLAYER_BASE_OFFENSE_OFFSETS,
  PLAYER_OFFENSE_SHAPES
} from './playbookData.js';
import { sound } from './audio.js';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t) {
  const c1 = 1.45;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export class Choreographer {
  constructor() {
    this.speedMultiplier = 1.0;
    this.playerDots = this.createLineup('player', 20);
    this.botDots = this.createLineup('bot', 90);

    this.disc = {
      x: 0,
      y: 20,
      z: 0,
      inFlight: false,
      dropped: false,
      holderTeam: 'player', // 'player' | 'bot' | null
      holderIdx: 3,
      spinAngle: 0,
      trail: []
    };

    this.stall = {
      active: false,
      value: 0
    };

    this.visualContext = {
      offenseTeam: 'bot', // 'bot' | 'player'
      discAnchorX: 0,
      discAnchorY: 70,
      openSign: 1,
      scoutShape: null,
      forceTeam: 'player',
      forceType: 'open',
      ghostPreview: null // Set when hovering a strategy card
    };

    this.particles = [];
    this.shockwaves = [];
    this.beats = [];
    this.currentBeat = null;
    this.beatElapsed = 0;
    this.idleClock = 0;
  }

  createLineup(team, yLine) {
    const xs = [-15, -10, -5, 0, 5, 10, 15];
    const roles = ['1', '2', 'H2', 'H1', '3', '4', '5'];
    return xs.map((x, idx) => ({
      id: `${team}_${idx}`,
      x,
      y: yLine,
      vx: 0,
      vy: 0,
      role: roles[idx],
      highlight: false,
      lungeTimer: 0,
      lungeAngle: 0
    }));
  }

  clearQueue() {
    this.beats = [];
    this.currentBeat = null;
    this.beatElapsed = 0;
  }

  /**
   * Resets both 7-player lines on opposite goal lines for a Pull.
   * @param {'player' | 'bot'} pullingTeam
   */
  setupPullLineup(pullingTeam = 'player') {
    this.clearQueue();
    const xs = [-15, -10, -5, 0, 5, 10, 15];
    const pRoles = ['1', '2', 'H2', 'H1', '3', '4', '5'];
    xs.forEach((x, i) => {
      this.playerDots[i].x = x;
      this.playerDots[i].y = 20;
      this.playerDots[i].vx = 0;
      this.playerDots[i].vy = 0;
      this.playerDots[i].role = pRoles[i];
      this.playerDots[i].highlight = pullingTeam === 'player' && i === 3;
      this.playerDots[i].lungeTimer = 0;

      this.botDots[i].x = x;
      this.botDots[i].y = 90;
      this.botDots[i].vx = 0;
      this.botDots[i].vy = 0;
      this.botDots[i].role = pRoles[i];
      this.botDots[i].highlight = pullingTeam === 'bot' && i === 3;
      this.botDots[i].lungeTimer = 0;
    });

    this.disc.inFlight = false;
    this.disc.dropped = false;
    this.disc.z = 0;
    this.disc.trail = [];
    this.disc.holderTeam = pullingTeam;
    this.disc.holderIdx = 3;
    this.disc.x = 0;
    this.disc.y = pullingTeam === 'player' ? 20 : 90;

    this.stall.active = false;
    this.stall.value = 0;
    this.visualContext.scoutShape = null;
    this.visualContext.ghostPreview = null;
  }

  /**
   * Computes world coordinates from (dx, fy) relative to (discX, discY) and attackDir (-1 for bot, +1 for player)
   */
  toWorld(discX, discY, attackDir, openSign, dx, fy) {
    const x = clamp(discX + dx * openSign, -17.8, 17.8);
    const y = clamp(discY + fy * attackDir, 3.5, 106.5);
    return { x, y };
  }

  /**
   * Builds 7 world targets for Bot Offense + matching baseline Player Defenders
   */
  computeBotOffenseSetup(discX, discY, botOffenseId, playerDefId = null) {
    const form = BOT_OFFENSES[botOffenseId];
    const openSign = discX > 3.5 ? -1 : 1;
    const attackDir = -1; // Bot attacks downward toward y = 20

    const botTargets = form.offenseOffsets.map((o, idx) => {
      const pos = idx === 0
        ? { x: discX, y: discY }
        : this.toWorld(discX, discY, attackDir, openSign, o.dx, o.fy);
      return {
        x: pos.x,
        y: pos.y,
        role: o.role,
        highlight: Boolean(o.highlight)
      };
    });

    // Position Player's 7 defenders cleanly depending on active defense or neutral matchup readiness
    const playerTargets = this.computePlayerDefensePositions(discX, discY, openSign, botTargets, playerDefId);
    return { botTargets, playerTargets, openSign };
  }

  computePlayerDefensePositions(discX, discY, openSign, botTargets, playerDefId) {
    const attackDir = -1;
    if (playerDefId === 'cup_zone') {
      const cupOffsets = [
        { dx: -3.2, fy: 3.1, role: 'C1' },
        { dx: 0, fy: 4.2, role: 'C2' },
        { dx: 3.2, fy: 3.1, role: 'C3' },
        { dx: -10.5, fy: 11.5, role: 'M1' },
        { dx: 10.5, fy: 11.5, role: 'M2' },
        { dx: -6.5, fy: 21.5, role: 'D1' },
        { dx: 6.5, fy: 21.5, role: 'D2' }
      ];
      return cupOffsets.map((o) => ({
        ...this.toWorld(discX, discY, attackDir, openSign, o.dx, o.fy),
        role: o.role,
        highlight: false
      }));
    }

    if (playerDefId === 'clam_bracket') {
      return botTargets.map((bt, idx) => {
        if (idx === 0) return { x: clamp(discX - 1.8 * openSign, -18, 18), y: clamp(discY - 2.6, 3, 107), role: 'M', highlight: false };
        if (idx === 1) return { x: clamp(bt.x + 1.4 * openSign, -18, 18), y: clamp(bt.y - 1.6, 3, 107), role: 'D2', highlight: false };
        const clamSpots = [
          { dx: -9.5, fy: 11, role: 'U1' },
          { dx: 0, fy: 11, role: 'U2' },
          { dx: 9.5, fy: 11, role: 'U3' },
          { dx: -6.5, fy: 21.5, role: 'B1' },
          { dx: 6.5, fy: 21.5, role: 'B2' }
        ];
        const spot = clamSpots[idx - 2];
        return { ...this.toWorld(discX, discY, attackDir, openSign, spot.dx, spot.fy), role: spot.role, highlight: false };
      });
    }

    if (playerDefId === 'deep_poach') {
      return botTargets.map((bt, idx) => {
        if (idx === 0) return { x: discX, y: clamp(discY - 3.0, 3, 107), role: 'M', highlight: false };
        if (idx === 6) {
          const sag = this.toWorld(discX, discY, attackDir, openSign, 0, 26);
          return { x: sag.x, y: sag.y, role: 'SAG', highlight: true };
        }
        return {
          x: clamp(bt.x - 1.3 * openSign, -18, 18),
          y: clamp(bt.y - 2.0, 3, 107),
          role: `D${idx + 1}`,
          highlight: false
        };
      });
    }

    if (playerDefId === 'shutdown_reset') {
      return botTargets.map((bt, idx) => {
        if (idx === 0) return { x: clamp(discX - 1.2 * openSign, -18, 18), y: clamp(discY - 2.0, 3, 107), role: 'M', highlight: false };
        if (idx === 1) {
          return {
            x: clamp((discX + bt.x) * 0.55, -18, 18),
            y: clamp((discY + bt.y) * 0.5 - 0.6, 3, 107),
            role: 'BLZ',
            highlight: true
          };
        }
        return {
          x: clamp(bt.x - 1.4 * openSign, -18, 18),
          y: clamp(bt.y - 1.8, 3, 107),
          role: `D${idx + 1}`,
          highlight: false
        };
      });
    }

    // Default / Force Flick / Sideline Trap 1-on-1 readiness
    const shadeSign = playerDefId === 'sideline_trap' ? -openSign : openSign;
    return botTargets.map((bt, idx) => {
      if (idx === 0) {
        return {
          x: clamp(discX - 1.9 * shadeSign, -18, 18),
          y: clamp(discY - 2.5, 3, 107),
          role: 'M',
          highlight: false
        };
      }
      return {
        x: clamp(bt.x - 1.6 * shadeSign, -18, 18),
        y: clamp(bt.y - 2.1, 3, 107),
        role: `D${idx + 1}`,
        highlight: false
      };
    });
  }

  /**
   * Computes Player's neutral Offense readiness + Bot's chosen Defensive Setup (Bot D sets up FIRST!)
   */
  computeBotDefenseSetup(discX, discY, botDefId, playerOffId = null) {
    const botDef = BOT_DEFENSES[botDefId];
    const openSign = discX > 3.5 ? -1 : 1;
    const attackDir = 1; // Player attacks upward toward y = 90

    const offSource = playerOffId ? PLAYER_OFFENSE_SHAPES[playerOffId] : PLAYER_BASE_OFFENSE_OFFSETS;
    const playerTargets = offSource.map((o, idx) => {
      const pos = idx === 0
        ? { x: discX, y: discY }
        : this.toWorld(discX, discY, attackDir, openSign, o.dx, o.fy);
      return {
        x: pos.x,
        y: pos.y,
        role: o.role,
        highlight: o.role === 'ISO'
      };
    });

    const botTargets = botDef.defenseOffsets.map((d) => {
      const pos = this.toWorld(discX, discY, attackDir, openSign, d.dx, d.fy);
      return {
        x: pos.x,
        y: pos.y,
        role: d.role,
        highlight: Boolean(d.highlight)
      };
    });

    return { playerTargets, botTargets, openSign };
  }

  /**
   * Launches the 1-Click Pull animation (either Player pulling upfield, or Bot pulling downfield)
   */
  animatePull({ pullingTeam, landingX, landingY, initialBotLookId, onReadyForRead, onTicker }) {
    this.clearQueue();
    const isPlayerPull = pullingTeam === 'player';

    if (isPlayerPull) {
      const { botTargets, playerTargets, openSign } = this.computeBotOffenseSetup(landingX, landingY, initialBotLookId, null);

      // Beat 1: Puller step-up & booming high-arc pull while both teams sprint downfield
      this.enqueueBeat({
        duration: 1.85,
        playerTargets,
        botTargets,
        discAction: {
          type: 'pass',
          releaseT: 0.08,
          catchT: 0.94,
          toX: landingX,
          toY: landingY,
          curveX: landingX >= 0 ? -5.5 : 5.5,
          peakZ: 1.0,
          outcome: 'catch',
          toTeam: 'bot',
          toIdx: 0,
          isPull: true
        },
        onStart: () => {
          sound.pullWhoosh();
          if (onTicker) onTicker('Pull is up! Reading the Bot’s offensive stack...');
        },
        onComplete: () => {
          this.visualContext = {
            offenseTeam: 'bot',
            discAnchorX: landingX,
            discAnchorY: landingY,
            openSign,
            scoutShape: BOT_OFFENSES[initialBotLookId].scoutShape,
            forceTeam: 'player',
            forceType: 'open',
            ghostPreview: null
          };
          this.stall.active = true;
          this.stall.value = 1;
          if (onReadyForRead) onReadyForRead();
        }
      });
    } else {
      // Bot pulls downfield to Player Offense -> THEN Bot Defense visibly sets up first!
      const openSign = landingX > 3.5 ? -1 : 1;
      const basePlayerTargets = PLAYER_BASE_OFFENSE_OFFSETS.map((o, idx) => {
        const pos = idx === 0
          ? { x: landingX, y: landingY }
          : this.toWorld(landingX, landingY, 1, openSign, o.dx, o.fy);
        return { x: pos.x, y: pos.y, role: o.role, highlight: false };
      });
      // During the pull flight, Bot sprints down in loose coverage lanes first
      const sprintBotTargets = basePlayerTargets.map((pt, idx) => ({
        x: clamp(pt.x + (idx - 3) * 1.1, -17, 17),
        y: clamp(pt.y + 8, 25, 95),
        role: `D${idx + 1}`,
        highlight: false
      }));

      const { botTargets: setBotTargets } = this.computeBotDefenseSetup(landingX, landingY, initialBotLookId, null);

      this.enqueueBeat({
        duration: 1.75,
        playerTargets: basePlayerTargets,
        botTargets: sprintBotTargets,
        discAction: {
          type: 'pass',
          releaseT: 0.08,
          catchT: 0.94,
          toX: landingX,
          toY: landingY,
          curveX: landingX >= 0 ? 5.5 : -5.5,
          peakZ: 1.0,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: 0,
          isPull: true
        },
        onStart: () => {
          sound.pullWhoosh();
          if (onTicker) onTicker('Bot pulls! Receiving the disc...');
        }
      });

      // Beat 2: Bot Defense visibly shifts into its Defensive Shell FIRST!
      this.enqueueBeat({
        duration: 0.68,
        playerTargets: basePlayerTargets,
        botTargets: setBotTargets,
        discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 },
        onStart: () => {
          if (onTicker) onTicker('Watch closely — Bot Defense is setting its shell!');
        },
        onComplete: () => {
          this.visualContext = {
            offenseTeam: 'player',
            discAnchorX: landingX,
            discAnchorY: landingY,
            openSign,
            scoutShape: BOT_DEFENSES[initialBotLookId].scoutShape,
            forceTeam: 'bot',
            forceType: BOT_DEFENSES[initialBotLookId].forceType,
            ghostPreview: null
          };
          this.stall.active = true;
          this.stall.value = 1;
          if (onReadyForRead) onReadyForRead();
        }
      });
    }
  }

  /**
   * Choreographs a Defensive Play Resolution (Player = D, Bot = O attacking -y toward y = 20)
   */
  animateDefenseResolution({
    discX,
    discY,
    botOffenseId,
    playerDefId,
    tier,
    nextBotLookAfterTurnOrAdvance,
    onTicker,
    onResult
  }) {
    this.clearQueue();
    this.visualContext.ghostPreview = null;
    this.visualContext.scoutShape = null;

    const openSign = discX > 3.5 ? -1 : 1;
    const defObj = PLAYER_DEFENSES[playerDefId];
    this.visualContext.forceTeam = 'player';
    this.visualContext.forceType = defObj.forceType;

    // Snap Player's 7 defenders into the chosen defense first (0.45s crisp adjustment)
    const { botTargets: initBot, playerTargets: initDef } = this.computeBotOffenseSetup(
      discX,
      discY,
      botOffenseId,
      playerDefId
    );

    this.enqueueBeat({
      duration: 0.45,
      playerTargets: initDef,
      botTargets: initBot,
      stallStart: 1,
      stallEnd: 2,
      discAction: { type: 'hold', holderTeam: 'bot', holderIdx: 0 },
      onStart: () => {
        if (onTicker) onTicker(`Defense called: ${defObj.name}! Matching up...`);
      }
    });

    if (tier === 'ideal') {
      // LOCKDOWN -> TURNOVER!
      const swingX = clamp(discX - 8.5 * openSign, -15, 15);
      const swingY = clamp(discY + 2.5, 24, 88); // Forced slightly backward!
      const s1 = this.computeBotOffenseSetup(swingX, swingY, botOffenseId, playerDefId);

      // Beat 1: Primary lane denied, forced backward dump/swing
      this.enqueueBeat({
        duration: 0.95,
        playerTargets: s1.playerTargets,
        botTargets: s1.botTargets,
        jabTeam: 'bot',
        jabIdx: 2,
        stallStart: 2,
        stallEnd: 5,
        discAction: {
          type: 'pass',
          releaseT: 0.36,
          catchT: 0.9,
          toX: swingX,
          toY: swingY,
          curveX: -2.6 * openSign,
          peakZ: 0.16,
          outcome: 'catch',
          toTeam: 'bot',
          toIdx: 1
        },
        onStart: () => {
          if (onTicker) onTicker(`${defObj.name} shuts down the primary cut — forced backward reset!`);
        }
      });

      // Beat 2: High stall panic + Block / Interception!
      const turnX = clamp(swingX + 6.5 * openSign, -14, 14);
      const turnY = clamp(swingY - 9, 23, 84);
      const isInterception = playerDefId === 'deep_poach' || playerDefId === 'cup_zone' || playerDefId === 'clam_bracket';
      const heroDefIdx = playerDefId === 'deep_poach' ? 6 : playerDefId === 'shutdown_reset' ? 1 : 2;

      const climaxPlayer = s1.playerTargets.map((p, idx) =>
        idx === heroDefIdx
          ? { x: turnX, y: turnY, role: p.role, highlight: true }
          : { x: clamp(p.x + 1.5 * openSign, -17, 17), y: clamp(p.y - 2, 4, 105), role: p.role, highlight: false }
      );
      const climaxBot = s1.botTargets.map((b, idx) =>
        idx === 2
          ? { x: turnX + 1.2 * openSign, y: turnY - 1.0, role: b.role, highlight: false }
          : { x: b.x, y: clamp(b.y - 2, 4, 105), role: b.role, highlight: false }
      );

      this.enqueueBeat({
        duration: 1.05,
        playerTargets: climaxPlayer,
        botTargets: climaxBot,
        stallStart: 6,
        stallEnd: 9.4,
        discAction: {
          type: 'pass',
          releaseT: 0.34,
          catchT: 0.88,
          toX: turnX,
          toY: turnY,
          curveX: 3.4 * openSign,
          peakZ: isInterception ? 0.52 : 0.2,
          outcome: isInterception ? 'intercept' : 'block',
          actorTeam: 'player',
          actorIdx: heroDefIdx
        },
        onStart: () => {
          if (onTicker) onTicker('Stall 8... Stall 9... Forced throw into tight coverage!');
        },
        onComplete: () => {
          this.stall.active = false;
        }
      });

      // Transition after Turn: Player steps up to disc, and BOT DEFENSE SETS UP FIRST!
      const tOpenSign = turnX > 3.5 ? -1 : 1;
      const baseOff = PLAYER_BASE_OFFENSE_OFFSETS.map((o, idx) => {
        const pos = idx === 0
          ? { x: turnX, y: turnY }
          : this.toWorld(turnX, turnY, 1, tOpenSign, o.dx, o.fy);
        return { x: pos.x, y: pos.y, role: o.role, highlight: false };
      });
      const scrambleBot = this.botDots.map((b, idx) => ({
        x: clamp(turnX + (idx - 3) * 3.5, -16, 16),
        y: clamp(turnY + 10 + (idx % 2) * 5, 25, 102),
        role: `D${idx + 1}`,
        highlight: false
      }));

      // Step 1: Player H1 picks up the disc
      this.enqueueBeat({
        duration: 0.58,
        playerTargets: baseOff,
        botTargets: scrambleBot,
        discAction: { type: 'pickup', holderTeam: 'player', holderIdx: 0, x: turnX, y: turnY },
        onStart: () => {
          if (onTicker) onTicker('TURNOVER! Your offense takes the disc — watch Bot Defense set up!');
        }
      });

      // Step 2: Bot Defense visibly snaps into its Defensive Formation FIRST!
      const { botTargets: botDefTargets } = this.computeBotDefenseSetup(
        turnX,
        turnY,
        nextBotLookAfterTurnOrAdvance,
        null
      );

      this.enqueueBeat({
        duration: 0.68,
        playerTargets: baseOff,
        botTargets: botDefTargets,
        discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 },
        onComplete: () => {
          const botDefObj = BOT_DEFENSES[nextBotLookAfterTurnOrAdvance];
          this.visualContext = {
            offenseTeam: 'player',
            discAnchorX: turnX,
            discAnchorY: turnY,
            openSign: tOpenSign,
            scoutShape: botDefObj.scoutShape,
            forceTeam: 'bot',
            forceType: botDefObj.forceType,
            ghostPreview: null
          };
          this.stall.active = true;
          this.stall.value = 1;
          onResult({ outcome: 'turnover', newDiscX: turnX, newDiscY: turnY });
        }
      });
      return;
    }

    if (tier === 'middle') {
      // Bot advances ~23-26 yards in 2 crisp passes; if crossing y <= 20, Bot scores!
      const p1X = clamp(discX + 6.5 * openSign, -15, 15);
      const p1Y = clamp(discY - 11, 14, 85);
      const p2X = clamp(p1X - 8.5 * openSign, -14, 14);
      const rawFinalY = discY - 24;
      const scored = rawFinalY <= 20;
      const p2Y = scored ? 12 : clamp(rawFinalY, 23, 80);

      const midStep = this.computeBotOffenseSetup(p1X, p1Y, botOffenseId, playerDefId);
      this.enqueueBeat({
        duration: 0.92,
        playerTargets: midStep.playerTargets,
        botTargets: midStep.botTargets,
        jabTeam: 'bot',
        jabIdx: 2,
        stallStart: 2,
        stallEnd: 4,
        discAction: {
          type: 'pass',
          releaseT: 0.3,
          catchT: 0.9,
          toX: p1X,
          toY: p1Y,
          curveX: 3.2 * openSign,
          peakZ: 0.18,
          outcome: 'catch',
          toTeam: 'bot',
          toIdx: 2
        }
      });

      const finalLookId = scored ? botOffenseId : nextBotLookAfterTurnOrAdvance;
      const endStep = this.computeBotOffenseSetup(p2X, p2Y, finalLookId, playerDefId);

      this.enqueueBeat({
        duration: 0.98,
        playerTargets: endStep.playerTargets,
        botTargets: endStep.botTargets,
        stallStart: 1,
        stallEnd: 3,
        discAction: {
          type: 'pass',
          releaseT: 0.28,
          catchT: 0.9,
          toX: p2X,
          toY: p2Y,
          curveX: -3.5 * openSign,
          peakZ: 0.24,
          outcome: 'catch',
          toTeam: 'bot',
          toIdx: 0
        },
        onComplete: () => {
          if (scored) {
            this.stall.active = false;
            this.spawnGoalBurst(p2X, p2Y, '#FF5268');
            sound.goalCelebration(false);
            onResult({ outcome: 'bot_goal', newDiscX: p2X, newDiscY: p2Y });
          } else {
            this.visualContext = {
              offenseTeam: 'bot',
              discAnchorX: p2X,
              discAnchorY: p2Y,
              openSign: endStep.openSign,
              scoutShape: BOT_OFFENSES[finalLookId].scoutShape,
              forceTeam: 'player',
              forceType: defObj.forceType,
              ghostPreview: null
            };
            this.stall.active = true;
            this.stall.value = 1;
            onResult({
              outcome: 'advance',
              yardsGained: Math.round(discY - p2Y),
              newDiscX: p2X,
              newDiscY: p2Y
            });
          }
        }
      });
      return;
    }

    // WORST DEFENSE -> Bot exploits opening & SCORES!
    const midX = clamp(discX + 7.5 * openSign, -14, 14);
    const midY = clamp(discY - 16, 26, 75);
    const goalX = clamp(midX - 5 * openSign, -12, 12);
    const goalY = 11;

    const s1 = this.computeBotOffenseSetup(midX, midY, botOffenseId, playerDefId);
    this.enqueueBeat({
      duration: 0.88,
      playerTargets: s1.playerTargets,
      botTargets: s1.botTargets,
      jabTeam: 'bot',
      jabIdx: 2,
      stallStart: 1,
      stallEnd: 3,
      discAction: {
        type: 'pass',
        releaseT: 0.25,
        catchT: 0.88,
        toX: midX,
        toY: midY,
        curveX: 4.0 * openSign,
        peakZ: 0.22,
        outcome: 'catch',
        toTeam: 'bot',
        toIdx: 2
      },
      onStart: () => {
        if (onTicker) onTicker('Uh oh — Bot broke through the primary lane!');
      }
    });

    // Streaking deep receiver into Bottom End Zone while defender trails behind
    const goalBotTargets = s1.botTargets.map((b, idx) =>
      idx === 4
        ? { x: goalX, y: goalY, role: b.role, highlight: true }
        : { x: b.x, y: clamp(b.y - 14, 8, 90), role: b.role, highlight: false }
    );
    const trailingDefTargets = s1.playerTargets.map((p, idx) =>
      idx === 4
        ? { x: goalX + 3.2 * openSign, y: goalY + 6.5, role: p.role, highlight: false }
        : { x: p.x, y: clamp(p.y - 12, 10, 90), role: p.role, highlight: false }
    );

    this.enqueueBeat({
      duration: 1.28,
      playerTargets: trailingDefTargets,
      botTargets: goalBotTargets,
      stallStart: 1,
      stallEnd: 2,
      discAction: {
        type: 'pass',
        releaseT: 0.18,
        catchT: 0.92,
        toX: goalX,
        toY: goalY,
        curveX: -5.2 * openSign,
        peakZ: 0.78,
        outcome: 'catch',
        toTeam: 'bot',
        toIdx: 4,
        isHuck: true
      },
      onStart: () => {
        if (onTicker) onTicker('Deep shot goes up to an uncovered cutter!');
      },
      onComplete: () => {
        this.stall.active = false;
        this.spawnGoalBurst(goalX, goalY, '#FF5268');
        sound.goalCelebration(false);
        onResult({ outcome: 'bot_goal', newDiscX: goalX, newDiscY: goalY });
      }
    });
  }

  /**
   * Choreographs an Offensive Play Resolution (Player = O attacking +y toward y = 90, Bot = D)
   */
  animateOffenseResolution({
    discX,
    discY,
    botDefId,
    playerOffId,
    tier,
    nextBotLookAfterTurnOrAdvance,
    onTicker,
    onResult
  }) {
    this.clearQueue();
    this.visualContext.ghostPreview = null;
    this.visualContext.scoutShape = null;

    const openSign = discX > 3.5 ? -1 : 1;
    const botDef = BOT_DEFENSES[botDefId];

    // Snap Player's 7 dots into the called Offensive Stack (0.45s crisp snap)
    const { playerTargets: snapOff, botTargets: snapDef } = this.computeBotDefenseSetup(
      discX,
      discY,
      botDefId,
      playerOffId
    );

    this.enqueueBeat({
      duration: 0.45,
      playerTargets: snapOff,
      botTargets: snapDef,
      stallStart: 1,
      stallEnd: 2,
      discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 }
    });

    if (tier === 'ideal') {
      // PLAYER CARVES UP BOT DEFENSE -> SCORES IN TOP END ZONE (y = 97)!
      const isHuckPlay = playerOffId === 'side_iso_huck';
      const p1X = isHuckPlay
        ? clamp(discX - 5.5 * openSign, -14, 14)
        : clamp(discX + 6.0 * openSign, -14, 14);
      const p1Y = isHuckPlay
        ? clamp(discY + 5, 25, 82)
        : clamp(discY + 15, 32, 86);

      const s1 = this.computeBotDefenseSetup(p1X, p1Y, botDefId, playerOffId);

      // Beat 1: Break open the initial gap / power reset
      this.enqueueBeat({
        duration: 0.85,
        playerTargets: s1.playerTargets,
        botTargets: s1.botTargets,
        jabTeam: 'player',
        jabIdx: 2,
        stallStart: 1,
        stallEnd: 3,
        discAction: {
          type: 'pass',
          releaseT: 0.26,
          catchT: 0.88,
          toX: p1X,
          toY: p1Y,
          curveX: (playerOffId === 'break_mark' ? -4.5 : 3.2) * openSign,
          peakZ: 0.18,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: isHuckPlay ? 1 : 2
        },
        onStart: () => {
          if (onTicker) onTicker('Clean execution — defense is on its heels!');
        }
      });

      // Beat 2: Strike / Bomb into Top End Zone (y = 97)!
      const goalX = clamp(p1X - 4.5 * openSign, -12, 12);
      const goalY = 97.5;
      const scorerIdx = isHuckPlay ? 2 : 4;

      const goalPlayerTargets = s1.playerTargets.map((p, idx) =>
        idx === scorerIdx
          ? { x: goalX, y: goalY, role: p.role, highlight: true }
          : { x: p.x, y: clamp(p.y + 15, 25, 93), role: p.role, highlight: false }
      );
      const beatenBotTargets = s1.botTargets.map((b, idx) =>
        idx === scorerIdx
          ? { x: goalX + 3.4 * openSign, y: goalY - 6.8, role: b.role, highlight: false }
          : { x: b.x, y: clamp(b.y + 12, 25, 92), role: b.role, highlight: false }
      );

      this.enqueueBeat({
        duration: isHuckPlay ? 1.32 : 1.08,
        playerTargets: goalPlayerTargets,
        botTargets: beatenBotTargets,
        stallStart: 1,
        stallEnd: 2,
        discAction: {
          type: 'pass',
          releaseT: 0.18,
          catchT: 0.92,
          toX: goalX,
          toY: goalY,
          curveX: 5.0 * openSign,
          peakZ: isHuckPlay ? 0.85 : 0.36,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: scorerIdx,
          isHuck: isHuckPlay
        },
        onStart: () => {
          if (onTicker) onTicker(isHuckPlay ? 'Huck is UP to wide-open end zone space!' : 'Continuation strike to the end zone!');
        },
        onComplete: () => {
          this.stall.active = false;
          this.spawnGoalBurst(goalX, goalY, '#00E5FF');
          sound.goalCelebration(true);
          onResult({ outcome: 'player_goal', newDiscX: goalX, newDiscY: goalY });
        }
      });
      return;
    }

    if (tier === 'middle') {
      // Player advances +24-27 yards toward y = 90; if crossing y >= 90, Player SCORES!
      const p1X = clamp(discX + 6.5 * openSign, -15, 15);
      const p1Y = clamp(discY + 12, 26, 94);
      const p2X = clamp(p1X - 8 * openSign, -14, 14);
      const rawFinalY = discY + 25;
      const scored = rawFinalY >= 90;
      const p2Y = scored ? 96.5 : clamp(rawFinalY, 30, 86);

      const s1 = this.computeBotDefenseSetup(p1X, p1Y, botDefId, playerOffId);
      this.enqueueBeat({
        duration: 0.9,
        playerTargets: s1.playerTargets,
        botTargets: s1.botTargets,
        jabTeam: 'player',
        jabIdx: 2,
        stallStart: 1,
        stallEnd: 4,
        discAction: {
          type: 'pass',
          releaseT: 0.28,
          catchT: 0.88,
          toX: p1X,
          toY: p1Y,
          curveX: 3.0 * openSign,
          peakZ: 0.18,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: 2
        }
      });

      // Beat 2: Continuation completion
      const s2Base = this.computeBotDefenseSetup(p2X, p2Y, botDefId, playerOffId);
      this.enqueueBeat({
        duration: 0.92,
        playerTargets: s2Base.playerTargets,
        botTargets: s2Base.botTargets,
        stallStart: 1,
        stallEnd: 3,
        discAction: {
          type: 'pass',
          releaseT: 0.28,
          catchT: 0.9,
          toX: p2X,
          toY: p2Y,
          curveX: -3.2 * openSign,
          peakZ: 0.22,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: 0
        },
        onComplete: () => {
          if (scored) {
            this.stall.active = false;
            this.spawnGoalBurst(p2X, p2Y, '#00E5FF');
            sound.goalCelebration(true);
            onResult({ outcome: 'player_goal', newDiscX: p2X, newDiscY: p2Y });
          }
        }
      });

      if (!scored) {
        // Beat 3: Bot Defense visibly re-sets / audibles FIRST at the new yard line!
        const nextDef = this.computeBotDefenseSetup(p2X, p2Y, nextBotLookAfterTurnOrAdvance, null);
        this.enqueueBeat({
          duration: 0.58,
          playerTargets: nextDef.playerTargets,
          botTargets: nextDef.botTargets,
          discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 },
          onComplete: () => {
            const nextBotDefObj = BOT_DEFENSES[nextBotLookAfterTurnOrAdvance];
            this.visualContext = {
              offenseTeam: 'player',
              discAnchorX: p2X,
              discAnchorY: p2Y,
              openSign: nextDef.openSign,
              scoutShape: nextBotDefObj.scoutShape,
              forceTeam: 'bot',
              forceType: nextBotDefObj.forceType,
              ghostPreview: null
            };
            this.stall.active = true;
            this.stall.value = 1;
            onResult({
              outcome: 'advance',
              yardsGained: Math.round(p2Y - discY),
              newDiscX: p2X,
              newDiscY: p2Y
            });
          }
        });
      }
      return;
    }

    // WORST OFFENSE -> Player throws into Bot Defense's strength -> TURNOVER -> Flip to Defense!
    const isHuckIntoTrap = playerOffId === 'side_iso_huck';
    const turnX = clamp(discX + (isHuckIntoTrap ? -2 : 6.5) * openSign, -14, 14);
    const turnY = clamp(discY + (isHuckIntoTrap ? 24 : 9), 25, 85);
    const botHeroIdx = botDefId === 'bot_deep_poach' ? 6 : botDefId === 'bot_shutdown_reset' ? 1 : 2;
    const isInterception = botDefId === 'bot_deep_poach' || botDefId === 'bot_sideline_trap';

    const turnPlayers = snapOff.map((p, idx) =>
      idx === 2
        ? { x: turnX - 1.2 * openSign, y: turnY - 1, role: p.role, highlight: false }
        : { x: p.x, y: clamp(p.y + 4, 22, 95), role: p.role, highlight: false }
    );
    const turnBots = snapDef.map((b, idx) =>
      idx === botHeroIdx
        ? { x: turnX, y: turnY, role: b.role, highlight: true }
        : { x: b.x, y: clamp(b.y + 3, 22, 95), role: b.role, highlight: false }
    );

    this.enqueueBeat({
      duration: 1.08,
      playerTargets: turnPlayers,
      botTargets: turnBots,
      stallStart: 3,
      stallEnd: 8.8,
      discAction: {
        type: 'pass',
        releaseT: 0.32,
        catchT: 0.88,
        toX: turnX,
        toY: turnY,
        curveX: 3.5 * openSign,
        peakZ: isHuckIntoTrap ? 0.68 : 0.22,
        outcome: isInterception ? 'intercept' : 'block',
        actorTeam: 'bot',
        actorIdx: botHeroIdx
      },
      onStart: () => {
        if (onTicker) onTicker(`Danger — throwing straight into ${botDef.name}!`);
      },
      onComplete: () => {
        this.stall.active = false;
      }
    });

    // Transition back to Defense: Bot Offense sets up FIRST at (turnX, turnY)!
    const nextBotOff = this.computeBotOffenseSetup(turnX, turnY, nextBotLookAfterTurnOrAdvance, null);
    this.enqueueBeat({
      duration: 0.72,
      playerTargets: nextBotOff.playerTargets,
      botTargets: nextBotOff.botTargets,
      discAction: { type: 'pickup', holderTeam: 'bot', holderIdx: 0, x: turnX, y: turnY },
      onStart: () => {
        if (onTicker) onTicker('TURNOVER! Get back on Defense — read the Bot’s stack!');
      },
      onComplete: () => {
        this.visualContext = {
          offenseTeam: 'bot',
          discAnchorX: turnX,
          discAnchorY: turnY,
          openSign: nextBotOff.openSign,
          scoutShape: BOT_OFFENSES[nextBotLookAfterTurnOrAdvance].scoutShape,
          forceTeam: 'player',
          forceType: 'open',
          ghostPreview: null
        };
        this.stall.active = true;
        this.stall.value = 1;
        onResult({ outcome: 'turnover_to_bot', newDiscX: turnX, newDiscY: turnY });
      }
    });
  }

  enqueueBeat(beatConfig) {
    this.beats.push(beatConfig);
    if (!this.currentBeat) {
      this.startNextBeat();
    }
  }

  startNextBeat() {
    if (this.beats.length === 0) {
      this.currentBeat = null;
      return;
    }
    const beat = this.beats.shift();
    this.currentBeat = beat;
    this.beatElapsed = 0;

    // Snapshot starting coordinates for smooth interpolation
    beat._pStart = this.playerDots.map((d) => ({ x: d.x, y: d.y }));
    beat._bStart = this.botDots.map((d) => ({ x: d.x, y: d.y }));
    beat._discTriggered = false;
    beat._discLanded = false;
    beat._fromX = this.disc.x;
    beat._fromY = this.disc.y;

    if (beat.discAction && beat.discAction.type === 'pickup') {
      this.disc.dropped = false;
      this.disc.inFlight = false;
      this.disc.holderTeam = beat.discAction.holderTeam;
      this.disc.holderIdx = beat.discAction.holderIdx;
      this.disc.z = 0;
      this.disc.trail = [];
    } else if (beat.discAction && beat.discAction.type === 'hold') {
      this.disc.dropped = false;
      this.disc.inFlight = false;
      this.disc.holderTeam = beat.discAction.holderTeam;
      this.disc.holderIdx = beat.discAction.holderIdx;
      this.disc.z = 0;
    }

    if (beat.onStart) beat.onStart();
  }

  spawnImpactBurst(x, y, color) {
    this.shockwaves.push({ x, y, r: 0.6, maxR: 7.5, alpha: 0.95, color });
    for (let i = 0; i < 16; i++) {
      const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.25;
      const spd = 6 + Math.random() * 14;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.55 + Math.random() * 0.25,
        maxLife: 0.75,
        size: 2.5 + Math.random() * 2.5,
        color
      });
    }
  }

  spawnGoalBurst(x, y, color) {
    this.shockwaves.push({ x, y, r: 1, maxR: 15, alpha: 1.0, color });
    this.shockwaves.push({ x, y, r: 0.2, maxR: 10, alpha: 0.85, color: '#FFFFFF' });
    for (let i = 0; i < 34; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 8 + Math.random() * 24;
      this.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.7 + Math.random() * 0.45,
        maxLife: 1.1,
        size: 3 + Math.random() * 3,
        color: i % 3 === 0 ? '#FFFFFF' : color
      });
    }
  }

  update(dt) {
    const scaledDt = Math.min(dt, 0.05) * this.speedMultiplier;
    this.idleClock += scaledDt;

    // Update particles & shockwaves
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * scaledDt;
      p.y += p.vy * scaledDt;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= scaledDt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.r += (s.maxR - s.r) * 7.5 * scaledDt;
      s.alpha -= 1.65 * scaledDt;
      if (s.alpha <= 0) this.shockwaves.splice(i, 1);
    }

    // Decay layout lunge stretch
    for (const d of this.playerDots) {
      if (d.lungeTimer > 0) d.lungeTimer = Math.max(0, d.lungeTimer - scaledDt);
    }
    for (const d of this.botDots) {
      if (d.lungeTimer > 0) d.lungeTimer = Math.max(0, d.lungeTimer - scaledDt);
    }

    if (!this.currentBeat) {
      // Keep held disc snapped to holder during idle/read states
      this.syncHeldDisc();
      return;
    }

    const beat = this.currentBeat;
    this.beatElapsed += scaledDt;
    const rawT = clamp(this.beatElapsed / beat.duration, 0, 1);
    const eT = easeInOutCubic(rawT);

    // Update Stall Ring if specified
    if (typeof beat.stallStart === 'number' && typeof beat.stallEnd === 'number') {
      this.stall.active = true;
      this.stall.value = beat.stallStart + (beat.stallEnd - beat.stallStart) * rawT;
    }

    // Interpolate 7 Player Dots & 7 Bot Dots (including subtle jab-step fake!)
    this.interpolateTeam(this.playerDots, beat._pStart, beat.playerTargets, rawT, eT, beat.jabTeam === 'player' ? beat.jabIdx : -1, scaledDt);
    this.interpolateTeam(this.botDots, beat._bStart, beat.botTargets, rawT, eT, beat.jabTeam === 'bot' ? beat.jabIdx : -1, scaledDt);

    // Handle Disc Flight
    const da = beat.discAction;
    if (da && da.type === 'pass') {
      if (rawT < da.releaseT) {
        this.syncHeldDisc();
      } else if (rawT <= da.catchT) {
        if (!beat._discTriggered) {
          beat._discTriggered = true;
          beat._fromX = this.disc.x;
          beat._fromY = this.disc.y;
          this.disc.inFlight = true;
          this.disc.holderTeam = null;
          this.disc.trail = [];
          if (!da.isPull) {
            sound.throwZip(Boolean(da.isHuck));
          }
        }
        const fT = clamp((rawT - da.releaseT) / (da.catchT - da.releaseT), 0, 1);
        // Quadratic Bezier curve for IO / OI bend
        const midX = (beat._fromX + da.toX) * 0.5 + (da.curveX || 0);
        const midY = (beat._fromY + da.toY) * 0.5;
        const inv = 1 - fT;
        this.disc.x = inv * inv * beat._fromX + 2 * inv * fT * midX + fT * fT * da.toX;
        this.disc.y = inv * inv * beat._fromY + 2 * inv * fT * midY + fT * fT * da.toY;
        this.disc.z = Math.sin(fT * Math.PI) * (da.peakZ || 0.2);
        this.disc.spinAngle += 18 * scaledDt;

        this.disc.trail.push({ x: this.disc.x, y: this.disc.y, z: this.disc.z });
        if (this.disc.trail.length > 18) this.disc.trail.shift();
      } else if (!beat._discLanded) {
        beat._discLanded = true;
        this.disc.inFlight = false;
        this.disc.z = 0;
        this.disc.x = da.toX;
        this.disc.y = da.toY;

        if (da.outcome === 'catch') {
          this.disc.holderTeam = da.toTeam;
          this.disc.holderIdx = da.toIdx;
          sound.catchSnap();
        } else if (da.outcome === 'intercept') {
          this.disc.holderTeam = da.actorTeam;
          this.disc.holderIdx = da.actorIdx;
          const color = da.actorTeam === 'player' ? '#00E5FF' : '#FF5268';
          this.spawnImpactBurst(da.toX, da.toY, color);
          sound.turnoverImpact(da.actorTeam === 'player');
        } else if (da.outcome === 'block') {
          this.disc.holderTeam = null;
          this.disc.dropped = true;
          this.disc.x = clamp(da.toX + 1.8, -18, 18);
          this.disc.y = clamp(da.toY + 1.2, 3, 107);
          const actorArr = da.actorTeam === 'player' ? this.playerDots : this.botDots;
          const actor = actorArr[da.actorIdx];
          if (actor) {
            actor.lungeTimer = 0.45;
            actor.lungeAngle = Math.atan2(da.toY - beat._fromY, da.toX - beat._fromX);
          }
          const color = da.actorTeam === 'player' ? '#00E5FF' : '#FF5268';
          this.spawnImpactBurst(da.toX, da.toY, color);
          sound.turnoverImpact(da.actorTeam === 'player');
        }
      } else if (!this.disc.dropped) {
        this.syncHeldDisc();
      }
    } else {
      this.syncHeldDisc();
    }

    if (rawT >= 1) {
      const doneCb = beat.onComplete;
      this.currentBeat = null;
      if (doneCb) doneCb();
      if (!this.currentBeat && this.beats.length > 0) {
        this.startNextBeat();
      }
    }
  }

  interpolateTeam(dots, starts, targets, rawT, eT, jabIdx, dt) {
    if (!targets) return;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const s = starts[i];
      const tgt = targets[i];
      if (!tgt) continue;

      let curX;
      let curY;
      if (i === jabIdx && rawT < 0.26) {
        // Quick realistic 2-yard jab-step fake in opposite direction before planting & cutting!
        const jT = Math.sin((rawT / 0.26) * Math.PI);
        const dirY = tgt.y >= s.y ? -1 : 1;
        curX = s.x + (tgt.x - s.x) * 0.05;
        curY = s.y + dirY * 2.2 * jT;
      } else {
        const adjT = i === jabIdx ? easeOutBack(clamp((rawT - 0.2) / 0.8, 0, 1)) : eT;
        curX = s.x + (tgt.x - s.x) * adjT;
        curY = s.y + (tgt.y - s.y) * adjT;
      }

      if (dt > 0.0001) {
        d.vx = (curX - d.x) / dt;
        d.vy = (curY - d.y) / dt;
      }
      d.x = curX;
      d.y = curY;
      if (tgt.role) d.role = tgt.role;
      d.highlight = Boolean(tgt.highlight);
    }
  }

  syncHeldDisc() {
    if (this.disc.inFlight || this.disc.dropped || !this.disc.holderTeam) return;
    const arr = this.disc.holderTeam === 'player' ? this.playerDots : this.botDots;
    const holder = arr[this.disc.holderIdx];
    if (holder) {
      // Offset disc slightly on the pivot side of the handler
      const pivotOffset = this.disc.holderTeam === 'player' ? 1.05 : -1.05;
      this.disc.x = holder.x + pivotOffset * 0.75;
      this.disc.y = holder.y + (this.disc.holderTeam === 'player' ? 0.55 : -0.55);
      this.disc.z = 0;
    }
  }
}
