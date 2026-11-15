// 7v7 Procedural Choreography, Reactive Man/Zone Matchups & 2.5D Disc Flight Engine for Flatball Tactics
import {
  BOT_OFFENSES,
  BOT_DEFENSES,
  PLAYER_DEFENSES
} from './playbookData.js?v=6';
import { sound } from './audio.js?v=6';

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
      holderTeam: 'player',
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
      baseStack: 'vert',
      forceSide: 'home', // 'home' (-x Left) | 'away' (+x Right)
      scoutShape: null,
      forceTeam: 'player',
      forceType: 'open',
      playerPreviewId: null,
      ghostPreview: null
    };

    this.driftState = {
      active: false,
      playerTargets: null,
      botTargets: null
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
    this.driftState.active = false;
    for (const d of this.playerDots) {
      d.vx = 0;
      d.vy = 0;
    }
    for (const d of this.botDots) {
      d.vx = 0;
      d.vy = 0;
    }
  }

  /**
   * Smoothly drifts Player's 7 defenders into the selected Defensive Strategy on the field before confirming!
   */
  previewDefenseSelection(discX, discY, botOffenseId, playerDefId) {
    const defObj = PLAYER_DEFENSES[playerDefId];
    if (!defObj) return;
    const { botTargets, playerTargets } = this.computeBotOffenseSetup(discX, discY, botOffenseId, playerDefId);
    this.visualContext.forceTeam = 'player';
    this.visualContext.forceType = defObj.forceType;
    this.visualContext.playerPreviewId = playerDefId;
    this.driftState = {
      active: true,
      playerTargets,
      botTargets
    };
  }

  /**
   * Smoothly drifts Player's 7 offensive dots into the selected Offensive Play setup on the field,
   * while Bot defenders reactively shadow them in Man or hold spaces in Zone!
   */
  previewOffenseSelection(discX, discY, botDefState, playerOffId) {
    const { defId: botDefId, forceSide } = botDefState;
    const playerTargets = this.computePlayerPlayExecutionTargets(discX, discY, playerOffId, forceSide);
    const botTargets = this.computeReactiveBotDefense(discX, discY, playerTargets, botDefId, forceSide);
    this.visualContext.playerPreviewId = playerOffId;
    this.driftState = {
      active: true,
      playerTargets,
      botTargets
    };
  }

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
    this.visualContext.playerPreviewId = null;
    this.visualContext.ghostPreview = null;
  }

  toWorld(discX, discY, attackDir, openSign, dx, fy) {
    const x = clamp(discX + dx * openSign, -17.8, 17.8);
    const y = clamp(discY + fy * attackDir, 3.5, 106.5);
    return { x, y };
  }

  // ===================== BOT OFFENSE vs PLAYER DEFENSE =====================

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

  // ===================== PLAYER OFFENSE vs REACTIVE BOT DEFENSE =====================

  /**
   * Computes Player's 7-dot Base Stack ('vert' or 'ho') at (discX, discY)
   */
  computePlayerBaseStack(discX, discY, baseStack = 'vert', forceSide = 'home') {
    const forceDir = forceSide === 'home' ? -1 : 1;
    const resetDir = discX > 5 ? -1 : discX < -5 ? 1 : -forceDir;

    if (baseStack === 'ho') {
      return [
        { x: discX, y: discY, role: 'H1', highlight: false },
        { x: clamp(discX - 8.2, -16.5, 16.5), y: clamp(discY - 4.2, 4, 104), role: 'H2', highlight: false },
        { x: clamp(discX + 8.2, -16.5, 16.5), y: clamp(discY - 4.2, 4, 104), role: 'H3', highlight: false },
        { x: -13.8, y: clamp(discY + 15.2, 8, 105), role: '1', highlight: false },
        { x: -4.6, y: clamp(discY + 13.5, 8, 105), role: '2', highlight: false },
        { x: 4.6, y: clamp(discY + 13.5, 8, 105), role: '3', highlight: false },
        { x: 13.8, y: clamp(discY + 15.2, 8, 105), role: '4', highlight: false }
      ];
    }

    // Vertical Stack down the central spine
    const stackX = clamp(discX * 0.25, -4, 4);
    return [
      { x: discX, y: discY, role: 'H1', highlight: false },
      { x: clamp(discX + 7.2 * resetDir, -16.5, 16.5), y: clamp(discY - 4.6, 4, 104), role: 'H2', highlight: false },
      { x: stackX, y: clamp(discY + 9.5, 8, 104), role: '1', highlight: false },
      { x: stackX, y: clamp(discY + 13.8, 8, 105), role: '2', highlight: false },
      { x: stackX, y: clamp(discY + 18.1, 8, 105.5), role: '3', highlight: false },
      { x: stackX, y: clamp(discY + 22.4, 8, 106), role: '4', highlight: false },
      { x: stackX, y: clamp(discY + 26.5, 8, 106.5), role: '5', highlight: false }
    ];
  }

  /**
   * Computes Player's active execution cut shape when running a selected Offensive Play
   */
  computePlayerPlayExecutionTargets(discX, discY, playerOffId, forceSide = 'home') {
    const forceDir = forceSide === 'home' ? -1 : 1; // -1 = Home (Left), +1 = Away (Right)
    const breakDir = -forceDir;

    if (playerOffId === 'force_cuts') {
      return [
        { x: discX, y: discY, role: 'H1', highlight: false },
        { x: clamp(discX + 6.5 * breakDir, -16.5, 16.5), y: clamp(discY - 4.5, 4, 104), role: 'H2', highlight: false },
        { x: clamp(discX + 8.5 * forceDir, -16.5, 16.5), y: clamp(discY + 10.5, 8, 105), role: '1', highlight: true },
        { x: clamp(discX + 10.5 * forceDir, -16.5, 16.5), y: clamp(discY + 20, 8, 106), role: '2', highlight: false },
        { x: clamp(discX * 0.2, -5, 5), y: clamp(discY + 15, 8, 105), role: '3', highlight: false },
        { x: clamp(discX * 0.2, -5, 5), y: clamp(discY + 20, 8, 105.5), role: '4', highlight: false },
        { x: clamp(discX * 0.2, -5, 5), y: clamp(discY + 25, 8, 106), role: '5', highlight: false }
      ];
    }

    if (playerOffId === 'break_swing') {
      return [
        { x: discX, y: discY, role: 'H1', highlight: false },
        { x: clamp(discX + 8.5 * breakDir, -16, 16), y: clamp(discY + 2.5, 5, 104), role: 'H2', highlight: true },
        { x: clamp(discX + 12.5 * breakDir, -16, 16), y: clamp(discY + 13.5, 8, 105), role: '1', highlight: true },
        { x: clamp(discX + 4 * forceDir, -16.5, 16.5), y: clamp(discY + 11, 8, 105), role: '2', highlight: false },
        { x: clamp(discX + 6 * breakDir, -16, 16), y: clamp(discY + 19, 8, 105.5), role: '3', highlight: false },
        { x: clamp(discX + 13 * breakDir, -16, 16), y: clamp(discY + 23, 8, 106), role: '4', highlight: false },
        { x: clamp(discX + 3 * forceDir, -16.5, 16.5), y: clamp(discY + 22, 8, 106), role: '5', highlight: false }
      ];
    }

    if (playerOffId === 'give_go') {
      const midDir = discX > 6 ? -1 : discX < -6 ? 1 : forceDir;
      return [
        { x: discX, y: discY, role: 'H1', highlight: false },
        { x: clamp(discX + 6.5 * midDir, -16, 16), y: clamp(discY + 4.5, 6, 104), role: 'H2', highlight: true },
        { x: clamp(discX - 5.5 * midDir, -16, 16), y: clamp(discY + 7.5, 6, 104.5), role: '1', highlight: true },
        { x: clamp(discX + 4.5 * midDir, -16, 16), y: clamp(discY + 12, 8, 105), role: '2', highlight: false },
        { x: -12, y: clamp(discY + 22, 10, 106), role: '3', highlight: false },
        { x: 0, y: clamp(discY + 24, 10, 106), role: '4', highlight: false },
        { x: 12, y: clamp(discY + 22, 10, 106), role: '5', highlight: false }
      ];
    }

    if (playerOffId === 'deep_huck') {
      const huckLaneX = clamp(discX + 7.5 * forceDir, -14, 14);
      const clearX = clamp(breakDir * 14.5, -16.5, 16.5);
      return [
        { x: discX, y: discY, role: 'H1', highlight: false },
        { x: clamp(discX + 6 * breakDir, -16, 16), y: clamp(discY - 4.5, 4, 104), role: 'H2', highlight: false },
        { x: huckLaneX, y: clamp(discY + 23, 12, 106), role: 'ISO', highlight: true },
        { x: clearX, y: clamp(discY + 10, 8, 105), role: '2', highlight: false },
        { x: clearX, y: clamp(discY + 14, 8, 105), role: '3', highlight: false },
        { x: clearX, y: clamp(discY + 18, 8, 105.5), role: '4', highlight: false },
        { x: clearX, y: clamp(discY + 22, 8, 106), role: '5', highlight: false }
      ];
    }

    if (playerOffId === 'pop_swing') {
      return [
        { x: discX, y: discY, role: 'H1', highlight: false },
        { x: clamp(discX - 9, -16, 16), y: clamp(discY - 3, 4, 104), role: 'H2', highlight: false },
        { x: clamp(discX + 9, -16, 16), y: clamp(discY - 3, 4, 104), role: 'H3', highlight: false },
        { x: clamp(discX + 1.5 * forceDir, -12, 12), y: clamp(discY + 8.5, 8, 105), role: 'P1', highlight: true },
        { x: clamp(discX + 9.5 * breakDir, -15.5, 15.5), y: clamp(discY + 13.5, 8, 105), role: 'W1', highlight: true },
        { x: clamp(discX + 11 * forceDir, -15.5, 15.5), y: clamp(discY + 14, 8, 105.5), role: 'W2', highlight: false },
        { x: 0, y: clamp(discY + 22, 10, 106), role: 'D', highlight: false }
      ];
    }

    // zone_flood: Overload one wing at staggered depths + over-the-top seam!
    const floodX = clamp(discX + 9.5 * forceDir, -15, 15);
    return [
      { x: discX, y: discY, role: 'H1', highlight: false },
      { x: clamp(discX + 7 * breakDir, -16, 16), y: clamp(discY - 4, 4, 104), role: 'H2', highlight: false },
      { x: floodX, y: clamp(discY + 9.5, 8, 105), role: 'F1', highlight: true },
      { x: clamp(floodX - 2 * forceDir, -15, 15), y: clamp(discY + 19.5, 10, 106), role: 'F2', highlight: true },
      { x: clamp(floodX + 2.5 * forceDir, -16.5, 16.5), y: clamp(discY + 14.5, 8, 105), role: '3', highlight: false },
      { x: clamp(breakDir * 11, -16, 16), y: clamp(discY + 14, 8, 105), role: '4', highlight: false },
      { x: clamp(breakDir * 9, -16, 16), y: clamp(discY + 21, 10, 106), role: '5', highlight: false }
    ];
  }

  /**
   * Computes Bot's 7-defender positions REACTING to Player's offensive positions + Force ('home' or 'away')!
   */
  computeReactiveBotDefense(discX, discY, playerTargets, botDefId, forceSide = 'home') {
    const forceDir = forceSide === 'home' ? -1 : 1; // -1 = Force Home (Left), +1 = Force Away (Right)
    const markerLabel = forceSide === 'home' ? 'F◀' : 'F▶';

    if (botDefId === 'bot_zone_cup') {
      // 3-Man Cup ignores player stack and forms a curved Cup around (discX, discY) tilted toward forceDir!
      return [
        { x: clamp(discX - 2.9 * forceDir, -17.5, 17.5), y: clamp(discY + 2.2, 4, 106), role: markerLabel, highlight: false },
        { x: clamp(discX - 0.3 * forceDir, -17.5, 17.5), y: clamp(discY + 4.1, 4, 106), role: 'C2', highlight: false },
        { x: clamp(discX + 2.9 * forceDir, -17.5, 17.5), y: clamp(discY + 3.0, 4, 106), role: 'C3', highlight: false },
        { x: -12.5, y: clamp(discY + 11.5, 8, 106), role: 'W1', highlight: false },
        { x: 12.5, y: clamp(discY + 11.5, 8, 106), role: 'W2', highlight: false },
        { x: clamp(forceDir * 2, -10, 10), y: clamp(discY + 16, 10, 106), role: 'SD', highlight: false },
        { x: 0, y: clamp(discY + 25.5, 12, 106.5), role: 'DD', highlight: false }
      ];
    }

    if (botDefId === 'bot_zone_wall') {
      // 2-3-2 Wall Zone ignores player stack: 2 front chasers + 3-across flat midfield Wall + 2 deep safeties!
      return [
        { x: clamp(discX - 2.1 * forceDir, -17.5, 17.5), y: clamp(discY + 2.3, 4, 106), role: markerLabel, highlight: false },
        { x: clamp(discX + 4.6 * forceDir, -17.5, 17.5), y: clamp(discY + 4.0, 4, 106), role: 'CH', highlight: false },
        { x: -12, y: clamp(discY + 11.8, 8, 106), role: 'W1', highlight: false },
        { x: 0, y: clamp(discY + 11.8, 8, 106), role: 'W2', highlight: false },
        { x: 12, y: clamp(discY + 11.8, 8, 106), role: 'W3', highlight: false },
        { x: -7, y: clamp(discY + 23.5, 12, 106.5), role: 'D1', highlight: false },
        { x: 7, y: clamp(discY + 23.5, 12, 106.5), role: 'D2', highlight: false }
      ];
    }

    // MAN-TO-MAN FAMILY: Defenders physically match up to playerTargets[0..6]!
    return playerTargets.map((pt, idx) => {
      if (idx === 0) {
        // Marker stands on the break shoulder (-forceDir), forcing throws toward forceDir!
        return {
          x: clamp(discX - 2.2 * forceDir, -18, 18),
          y: clamp(discY + 2.0, 4, 106),
          role: markerLabel,
          highlight: false
        };
      }

      if (botDefId === 'bot_man_blitz' && idx === 1) {
        // Face-guarding dump blitz right in the reset lane between H1 and H2!
        return {
          x: clamp((discX + pt.x) * 0.52, -18, 18),
          y: clamp((discY + pt.y) * 0.52 + 0.6, 4, 106),
          role: 'BLZ',
          highlight: true
        };
      }

      if (botDefId === 'bot_man_poach' && idx === 6) {
        // Last defender abandons their cutter to sag deep in the end-zone lane!
        return {
          x: clamp(forceDir * 3.2, -12, 12),
          y: clamp(discY + 28.5, 14, 106.5),
          role: 'SAG',
          highlight: true
        };
      }

      if (botDefId === 'bot_man_trap') {
        // Jump aggressively into the trapped sideline lane!
        return {
          x: clamp(pt.x + 2.2 * forceDir, -18, 18),
          y: clamp(pt.y - 0.4, 4, 106),
          role: `D${idx + 1}`,
          highlight: false
        };
      }

      // Honest 1v1 Man shading the forced side (forceDir)
      return {
        x: clamp(pt.x + 1.65 * forceDir, -18, 18),
        y: clamp(pt.y + 1.8, 4, 106),
        role: `D${idx + 1}`,
        highlight: false
      };
    });
  }

  applyOffenseVisualContext(discX, discY, botDefState) {
    const botDefObj = BOT_DEFENSES[botDefState.defId];
    this.visualContext = {
      offenseTeam: 'player',
      discAnchorX: discX,
      discAnchorY: discY,
      openSign: discX > 3.5 ? -1 : 1,
      baseStack: botDefState.baseStack,
      forceSide: botDefState.forceSide,
      scoutShape: botDefObj.scoutShape,
      forceTeam: 'bot',
      forceType: botDefObj.forceStyle === 'cup' ? 'cup' : 'directional',
      playerPreviewId: null,
      ghostPreview: null
    };
  }

  // ===================== ANIMATION SEQUENCES =====================

  animatePull({ pullingTeam, landingX, landingY, initialBotLookId, botDefState, onReadyForRead, onTicker }) {
    this.clearQueue();
    const isPlayerPull = pullingTeam === 'player';

    if (isPlayerPull) {
      const { botTargets, playerTargets, openSign } = this.computeBotOffenseSetup(landingX, landingY, initialBotLookId, null);

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
            baseStack: 'vert',
            forceSide: 'home',
            scoutShape: BOT_OFFENSES[initialBotLookId].scoutShape,
            forceTeam: 'player',
            forceType: 'open',
            playerPreviewId: null,
            ghostPreview: null
          };
          this.stall.active = true;
          this.stall.value = 1;
          if (onReadyForRead) onReadyForRead();
        }
      });
    } else {
      // Bot pulls to Player -> Player sets Base Stack -> Bot Defense matches up (Man vs Zone + Force Home/Away)!
      const stackTargets = this.computePlayerBaseStack(landingX, landingY, botDefState.baseStack, botDefState.forceSide);
      const sprintBotTargets = stackTargets.map((pt, idx) => ({
        x: clamp(pt.x + (idx - 3) * 1.4, -17, 17),
        y: clamp(pt.y + 8, 25, 96),
        role: `D${idx + 1}`,
        highlight: false
      }));
      const matchedBotTargets = this.computeReactiveBotDefense(
        landingX,
        landingY,
        stackTargets,
        botDefState.defId,
        botDefState.forceSide
      );

      this.enqueueBeat({
        duration: 1.72,
        playerTargets: stackTargets,
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
          const stackLabel = botDefState.baseStack === 'ho' ? 'Horizontal Stack' : 'Vertical Stack';
          if (onTicker) onTicker(`Bot pulls! Your offense sets ${stackLabel} — watch how Bot D matches up...`);
        }
      });

      this.enqueueBeat({
        duration: 0.65,
        playerTargets: stackTargets,
        botTargets: matchedBotTargets,
        discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 },
        onComplete: () => {
          this.applyOffenseVisualContext(landingX, landingY, botDefState);
          this.stall.active = true;
          this.stall.value = 1;
          if (onReadyForRead) onReadyForRead();
        }
      });
    }
  }

  animateDefenseResolution({
    discX,
    discY,
    botOffenseId,
    playerDefId,
    tier,
    nextBotOffIdOnAdvance,
    computeBotDefOnTurn,
    onTicker,
    onResult
  }) {
    this.clearQueue();
    this.visualContext.ghostPreview = null;
    this.visualContext.playerPreviewId = null;
    this.visualContext.scoutShape = null;

    const openSign = discX > 3.5 ? -1 : 1;
    const defObj = PLAYER_DEFENSES[playerDefId];
    this.visualContext.forceTeam = 'player';
    this.visualContext.forceType = defObj.forceType;

    const { botTargets: initBot, playerTargets: initDef } = this.computeBotOffenseSetup(
      discX,
      discY,
      botOffenseId,
      playerDefId
    );

    this.enqueueBeat({
      duration: 0.22,
      playerTargets: initDef,
      botTargets: initBot,
      stallStart: 1,
      stallEnd: 2,
      discAction: { type: 'hold', holderTeam: 'bot', holderIdx: 0 },
      onStart: () => {
        if (onTicker) onTicker(`Locked in ${defObj.name} — disc is live!`);
      }
    });

    if (tier === 'ideal') {
      const swingX = clamp(discX - 8.5 * openSign, -15, 15);
      const swingY = clamp(discY + 2.5, 24, 88);
      const s1 = this.computeBotOffenseSetup(swingX, swingY, botOffenseId, playerDefId);

      this.enqueueBeat({
        duration: 0.92,
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

      const turnX = clamp(swingX + 7.5 * openSign, -13.5, 13.5);
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

      const botDefState = computeBotDefOnTurn(turnX, turnY);
      const stackTargets = this.computePlayerBaseStack(turnX, turnY, botDefState.baseStack, botDefState.forceSide);
      const matchedBotTargets = this.computeReactiveBotDefense(
        turnX,
        turnY,
        stackTargets,
        botDefState.defId,
        botDefState.forceSide
      );

      this.enqueueBeat({
        duration: 1.02,
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

      // Step 1: Offense jogs into its Base Stack (Vert or Ho) as H1 picks up the disc
      const JogBackBots = this.botDots.map((b, idx) => ({
        x: clamp(turnX + (idx - 3) * 3.8, -16, 16),
        y: clamp(turnY + 11 + (idx % 2) * 5, 25, 103),
        role: `D${idx + 1}`,
        highlight: false
      }));

      this.enqueueBeat({
        duration: 0.54,
        playerTargets: stackTargets,
        botTargets: JogBackBots,
        discAction: { type: 'pickup', holderTeam: 'player', holderIdx: 0, x: turnX, y: turnY },
        onStart: () => {
          const stackLabel = botDefState.baseStack === 'ho' ? 'Ho Stack' : 'Vert Stack';
          if (onTicker) onTicker(`TURNOVER! Your offense sets ${stackLabel} — watch Bot Defense match up!`);
        }
      });

      // Step 2: Bot Defense matches up to your stack (revealing Man vs Zone + Force Home/Away)!
      this.enqueueBeat({
        duration: 0.62,
        playerTargets: stackTargets,
        botTargets: matchedBotTargets,
        discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 },
        onComplete: () => {
          this.applyOffenseVisualContext(turnX, turnY, botDefState);
          this.stall.active = true;
          this.stall.value = 1;
          onResult({ outcome: 'turnover', newDiscX: turnX, newDiscY: turnY, botDefState });
        }
      });
      return;
    }

    if (tier === 'middle') {
      const p1X = clamp(discX + 6.5 * openSign, -15, 15);
      const p1Y = clamp(discY - 11, 14, 85);
      const p2X = clamp(p1X - 8.5 * openSign, -14, 14);
      const rawFinalY = discY - 24;
      const scored = rawFinalY <= 20;
      const p2Y = scored ? 12 : clamp(rawFinalY, 23, 80);

      const midStep = this.computeBotOffenseSetup(p1X, p1Y, botOffenseId, playerDefId);
      this.enqueueBeat({
        duration: 0.9,
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

      const finalLookId = scored ? botOffenseId : nextBotOffIdOnAdvance;
      const endStep = this.computeBotOffenseSetup(p2X, p2Y, finalLookId, playerDefId);

      this.enqueueBeat({
        duration: 0.96,
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
              baseStack: 'vert',
              forceSide: 'home',
              scoutShape: BOT_OFFENSES[finalLookId].scoutShape,
              forceTeam: 'player',
              forceType: defObj.forceType,
              playerPreviewId: playerDefId,
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
      duration: 1.26,
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
   * Choreographs Player Offense Execution respecting Force Home (-1) / Force Away (+1) and Man vs Zone!
   */
  animateOffenseResolution({
    discX,
    discY,
    botDefState,
    playerOffId,
    tier,
    computeBotDefOnAdvance,
    computeBotOffOnTurn,
    onTicker,
    onResult
  }) {
    this.clearQueue();
    this.visualContext.ghostPreview = null;
    this.visualContext.playerPreviewId = null;
    this.visualContext.scoutShape = null;

    const { defId: botDefId, forceSide } = botDefState;
    const forceDir = forceSide === 'home' ? -1 : 1; // -1 = Home (Left), +1 = Away (Right)
    const breakDir = -forceDir;
    const botDefObj = BOT_DEFENSES[botDefId];

    // Beat 0: Quick settle into play launch!
    const snapOff = this.computePlayerPlayExecutionTargets(discX, discY, playerOffId, forceSide);
    const snapDef = this.computeReactiveBotDefense(discX, discY, snapOff, botDefId, forceSide);

    this.enqueueBeat({
      duration: 0.22,
      playerTargets: snapOff,
      botTargets: snapDef,
      stallStart: 1,
      stallEnd: 2,
      discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 }
    });

    if (tier === 'ideal') {
      const isHuck = playerOffId === 'deep_huck';
      const isOverTop = playerOffId === 'zone_flood';
      const isBreak = playerOffId === 'break_swing';

      // Beat 1: Initial attack pass tailored to Force Home/Away & play call!
      const attackSign = isBreak ? breakDir : forceDir;
      const p1X = playerOffId === 'pop_swing'
        ? clamp(discX + 1.5 * forceDir, -12, 12)
        : clamp(discX + (isHuck ? 4.5 * breakDir : 8.5 * attackSign), -15, 15);
      const p1Y = clamp(discY + (isHuck ? 4 : 13.5), 25, 86);

      const s1Off = this.computePlayerPlayExecutionTargets(p1X, p1Y, playerOffId, forceSide);
      const s1Def = this.computeReactiveBotDefense(p1X, p1Y, s1Off, botDefId, forceSide);

      this.enqueueBeat({
        duration: 0.84,
        playerTargets: s1Off,
        botTargets: s1Def,
        jabTeam: 'player',
        jabIdx: 2,
        stallStart: 1,
        stallEnd: 3,
        discAction: {
          type: 'pass',
          releaseT: 0.25,
          catchT: 0.88,
          toX: p1X,
          toY: p1Y,
          curveX: (isBreak ? 4.2 * breakDir : -3.2 * attackSign),
          peakZ: 0.18,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: isHuck ? 1 : 2
        },
        onStart: () => {
          if (onTicker) {
            onTicker(
              isBreak
                ? `Stepped inside the Force ${forceSide.toUpperCase()} mark — break side is wide open!`
                : 'Clean cut into open space — defense is scrambling!'
            );
          }
        }
      });

      // Beat 2: Scoring strike / bomb into Top End Zone (y = 97.5)!
      const goalLaneSign = playerOffId === 'pop_swing' || isBreak ? breakDir : forceDir;
      const goalX = clamp(p1X + 5.5 * goalLaneSign, -13, 13);
      const goalY = 97.5;
      const scorerIdx = isHuck ? 2 : 3;

      const goalPlayers = s1Off.map((p, idx) =>
        idx === scorerIdx
          ? { x: goalX, y: goalY, role: p.role, highlight: true }
          : { x: p.x, y: clamp(p.y + 14, 25, 93), role: p.role, highlight: false }
      );
      const beatenBots = s1Def.map((b, idx) =>
        idx === scorerIdx
          ? { x: clamp(goalX - 3.6 * goalLaneSign, -17, 17), y: goalY - 7, role: b.role, highlight: false }
          : { x: b.x, y: clamp(b.y + 11, 25, 92), role: b.role, highlight: false }
      );

      this.enqueueBeat({
        duration: isHuck ? 1.3 : 1.05,
        playerTargets: goalPlayers,
        botTargets: beatenBots,
        stallStart: 1,
        stallEnd: 2,
        discAction: {
          type: 'pass',
          releaseT: 0.18,
          catchT: 0.92,
          toX: goalX,
          toY: goalY,
          curveX: 4.8 * goalLaneSign,
          peakZ: isHuck ? 0.86 : isOverTop ? 0.56 : 0.34,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: scorerIdx,
          isHuck: isHuck || isOverTop
        },
        onStart: () => {
          if (onTicker) {
            onTicker(
              isHuck
                ? 'Deep bomb is UP to the open Force lane!'
                : isOverTop
                  ? 'Floating an over-the-top blade past the Wall!'
                  : 'Continuation throw to the end zone!'
            );
          }
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
      // Advance ~25 yards; if crossing y >= 90 -> Player Scores! Otherwise re-align stack & Bot Defense!
      const moveSign = playerOffId === 'break_swing' ? breakDir : forceDir;
      const p1X = clamp(discX + 7.5 * moveSign, -14.5, 14.5);
      const p1Y = clamp(discY + 12, 26, 94);
      const p2X = clamp(p1X - 9.5 * moveSign, -13.5, 13.5);
      const rawFinalY = discY + 25;
      const scored = rawFinalY >= 90;
      const p2Y = scored ? 96.5 : clamp(rawFinalY, 30, 86);

      const s1Off = this.computePlayerPlayExecutionTargets(p1X, p1Y, playerOffId, forceSide);
      const s1Def = this.computeReactiveBotDefense(p1X, p1Y, s1Off, botDefId, forceSide);

      this.enqueueBeat({
        duration: 0.88,
        playerTargets: s1Off,
        botTargets: s1Def,
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
          curveX: 3.0 * moveSign,
          peakZ: 0.18,
          outcome: 'catch',
          toTeam: 'player',
          toIdx: 2
        }
      });

      const s2Off = this.computePlayerPlayExecutionTargets(p2X, p2Y, playerOffId, forceSide);
      const s2Def = this.computeReactiveBotDefense(p2X, p2Y, s2Off, botDefId, forceSide);

      this.enqueueBeat({
        duration: 0.9,
        playerTargets: s2Off,
        botTargets: s2Def,
        stallStart: 1,
        stallEnd: 3,
        discAction: {
          type: 'pass',
          releaseT: 0.28,
          catchT: 0.9,
          toX: p2X,
          toY: p2Y,
          curveX: -3.2 * moveSign,
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
        // Re-form Player Base Stack at (p2X, p2Y) & let Bot Defense match up (or audible)!
        const nextBotDefState = computeBotDefOnAdvance(p2X, p2Y);
        const resetStack = this.computePlayerBaseStack(p2X, p2Y, nextBotDefState.baseStack, nextBotDefState.forceSide);
        const resetBotDef = this.computeReactiveBotDefense(
          p2X,
          p2Y,
          resetStack,
          nextBotDefState.defId,
          nextBotDefState.forceSide
        );

        this.enqueueBeat({
          duration: 0.6,
          playerTargets: resetStack,
          botTargets: resetBotDef,
          discAction: { type: 'hold', holderTeam: 'player', holderIdx: 0 },
          onComplete: () => {
            this.applyOffenseVisualContext(p2X, p2Y, nextBotDefState);
            this.stall.active = true;
            this.stall.value = 1;
            onResult({
              outcome: 'advance',
              yardsGained: Math.round(p2Y - discY),
              newDiscX: p2X,
              newDiscY: p2Y,
              botDefState: nextBotDefState
            });
          }
        });
      }
      return;
    }

    // WORST OFFENSE -> Runs straight into Bot Defense's trap/poach/cup -> TURNOVER!
    const isHuckMistake = playerOffId === 'deep_huck';
    const errDir = playerOffId === 'break_swing' ? breakDir : forceDir;
    const turnX = clamp(discX + (isHuckMistake ? 2.5 : 7.5) * errDir, -15, 15);
    const turnY = clamp(discY + (isHuckMistake && botDefId === 'bot_man_poach' ? 25 : 9.5), 25, 85);

    const botHeroIdx = botDefId === 'bot_man_poach'
      ? 6
      : botDefId === 'bot_man_blitz'
        ? 1
        : botDefId === 'bot_zone_wall'
          ? 3
          : 0;
    const isInterception = botDefId === 'bot_man_poach' || botDefId === 'bot_zone_wall' || botDefId === 'bot_man_trap';

    const turnPlayers = snapOff.map((p, idx) =>
      idx === 2
        ? { x: clamp(turnX - 1.2 * errDir, -17, 17), y: turnY - 1, role: p.role, highlight: false }
        : { x: p.x, y: clamp(p.y + 3, 22, 95), role: p.role, highlight: false }
    );
    const turnBots = snapDef.map((b, idx) =>
      idx === botHeroIdx
        ? { x: turnX, y: turnY, role: b.role, highlight: true }
        : { x: b.x, y: clamp(b.y + 2, 22, 95), role: b.role, highlight: false }
    );

    const nextBotOffId = computeBotOffOnTurn(turnX, turnY);
    const nextBotOff = this.computeBotOffenseSetup(turnX, turnY, nextBotOffId, null);

    this.enqueueBeat({
      duration: 1.05,
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
        curveX: 3.2 * errDir,
        peakZ: isHuckMistake && botDefId === 'bot_man_poach' ? 0.72 : 0.2,
        outcome: isInterception ? 'intercept' : 'block',
        actorTeam: 'bot',
        actorIdx: botHeroIdx
      },
      onStart: () => {
        if (onTicker) onTicker(`Danger — attacking straight into ${botDefObj.name}!`);
      },
      onComplete: () => {
        this.stall.active = false;
      }
    });

    this.enqueueBeat({
      duration: 0.7,
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
          baseStack: 'vert',
          forceSide: 'home',
          scoutShape: BOT_OFFENSES[nextBotOffId].scoutShape,
          forceTeam: 'player',
          forceType: 'open',
          playerPreviewId: null,
          ghostPreview: null
        };
        this.stall.active = true;
        this.stall.value = 1;
        onResult({ outcome: 'turnover_to_bot', newDiscX: turnX, newDiscY: turnY, nextBotOffId });
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

    for (const d of this.playerDots) {
      if (d.lungeTimer > 0) d.lungeTimer = Math.max(0, d.lungeTimer - scaledDt);
    }
    for (const d of this.botDots) {
      if (d.lungeTimer > 0) d.lungeTimer = Math.max(0, d.lungeTimer - scaledDt);
    }

    if (!this.currentBeat) {
      if (this.driftState.active) {
        const springDt = Math.min(scaledDt, 0.033);
        this.springDriftTeam(this.playerDots, this.driftState.playerTargets, springDt);
        this.springDriftTeam(this.botDots, this.driftState.botTargets, springDt);
      }
      this.syncHeldDisc();
      return;
    }

    const beat = this.currentBeat;
    this.beatElapsed += scaledDt;
    const rawT = clamp(this.beatElapsed / beat.duration, 0, 1);
    const eT = easeInOutCubic(rawT);

    if (typeof beat.stallStart === 'number' && typeof beat.stallEnd === 'number') {
      this.stall.active = true;
      this.stall.value = beat.stallStart + (beat.stallEnd - beat.stallStart) * rawT;
    }

    this.interpolateTeam(
      this.playerDots,
      beat._pStart,
      beat.playerTargets,
      rawT,
      eT,
      beat.jabTeam === 'player' ? beat.jabIdx : -1,
      scaledDt
    );
    this.interpolateTeam(
      this.botDots,
      beat._bStart,
      beat.botTargets,
      rawT,
      eT,
      beat.jabTeam === 'bot' ? beat.jabIdx : -1,
      scaledDt
    );

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

  /**
   * Critically-damped spring drift so circles smoothly glide into any selected strategy,
   * and fluidly redirect mid-motion when the player clicks a different option!
   */
  springDriftTeam(dots, targets, dt) {
    if (!targets) return;
    const stiffness = 76;
    const damping = 17.4;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const tgt = targets[i];
      if (!tgt) continue;

      const ax = (tgt.x - d.x) * stiffness - d.vx * damping;
      const ay = (tgt.y - d.y) * stiffness - d.vy * damping;
      d.vx += ax * dt;
      d.vy += ay * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;

      if (Math.abs(tgt.x - d.x) < 0.01 && Math.abs(d.vx) < 0.02) {
        d.x = tgt.x;
        d.vx = 0;
      }
      if (Math.abs(tgt.y - d.y) < 0.01 && Math.abs(d.vy) < 0.02) {
        d.y = tgt.y;
        d.vy = 0;
      }

      if (tgt.role) d.role = tgt.role;
      d.highlight = Boolean(tgt.highlight);
    }
  }

  syncHeldDisc() {
    if (this.disc.inFlight || this.disc.dropped || !this.disc.holderTeam) return;
    const arr = this.disc.holderTeam === 'player' ? this.playerDots : this.botDots;
    const holder = arr[this.disc.holderIdx];
    if (holder) {
      const pivotOffset = this.disc.holderTeam === 'player' ? 1.05 : -1.05;
      this.disc.x = holder.x + pivotOffset * 0.75;
      this.disc.y = holder.y + (this.disc.holderTeam === 'player' ? 0.55 : -0.55);
      this.disc.z = 0;
    }
  }
}
