// Complete 7v7 Tactical Playbook & Matchup Matrices for Flatball Tactics
// Field Orientation:
//   x in [-20, +20] yards: -20 = HOME Sideline (Left), +20 = AWAY Sideline (Right)
//   y in [0, 110] yards: 0..20 = Player Defended End Zone (Bottom), 90..110 = Player Attacking End Zone (Top)

export const PLAYER_DEFENSES = {
  sideline_trap: {
    id: 'sideline_trap',
    name: 'Sideline Trap',
    badge: 'TRAP',
    icon: 'trap',
    shortDesc: 'Force toward nearest sideline & pinch middle space',
    forceType: 'trap'
  },
  deep_poach: {
    id: 'deep_poach',
    name: 'Deep Poach',
    badge: 'POACH',
    icon: 'poach',
    shortDesc: 'Sag 7th defender deep to bait & sky hucks',
    forceType: 'flat'
  },
  clam_bracket: {
    id: 'clam_bracket',
    name: 'Clam Bracket',
    badge: 'CLAM',
    icon: 'clam',
    shortDesc: 'Bracket under & deep lanes as shared zones',
    forceType: 'open'
  },
  shutdown_reset: {
    id: 'shutdown_reset',
    name: 'Shutdown Reset',
    badge: 'BLITZ',
    icon: 'blitz',
    shortDesc: 'Jump backfield dump resets for high-stall blocks',
    forceType: 'tight'
  },
  cup_zone: {
    id: 'cup_zone',
    name: '3-Person Cup',
    badge: 'ZONE',
    icon: 'cup',
    shortDesc: 'Wall off thrower with 3-defender cup shell',
    forceType: 'cup'
  },
  force_flick: {
    id: 'force_flick',
    name: 'Force Open-Side',
    badge: '1v1',
    icon: 'person',
    shortDesc: 'Disciplined 1v1 mark denying inside breaks',
    forceType: 'open'
  }
};

export const PLAYER_OFFENSES = {
  force_cuts: {
    id: 'force_cuts',
    name: 'Force-Side Cuts',
    badge: 'OPEN LANE',
    icon: 'vert',
    shortDesc: 'Timed under & continuation cuts into the forced side'
  },
  break_swing: {
    id: 'break_swing',
    name: 'Break-Mark Swing',
    badge: 'IO BREAK',
    icon: 'break',
    shortDesc: 'Step inside the mark & swing to the wide break side'
  },
  give_go: {
    id: 'give_go',
    name: 'Under Give & Go',
    badge: 'SMALL BALL',
    icon: 'weave',
    shortDesc: 'Quick short handler triangles underneath deep help'
  },
  deep_huck: {
    id: 'deep_huck',
    name: 'Deep ISO Huck',
    badge: 'DEEP BOMB',
    icon: 'huck',
    shortDesc: 'Clear space & bomb deep into 1-on-1 coverage'
  },
  pop_swing: {
    id: 'pop_swing',
    name: 'Popper Crash & Swing',
    badge: 'CUP BEATER',
    icon: 'pop',
    shortDesc: 'Crash poppers into a cup & swing to the weak side'
  },
  zone_flood: {
    id: 'zone_flood',
    name: 'Flood & Over-Top',
    badge: 'WALL BEATER',
    icon: 'flood',
    shortDesc: 'Overload one zone wing & arc a pass over the wall'
  }
};

export const BOT_OFFENSES = {
  vert_stack: {
    id: 'vert_stack',
    name: 'Vertical Stack',
    tag: 'CENTER SPINE',
    hint: '5 cutters stacked down the center create wide side lanes — trap them against a sideline to choke their space!',
    scoutShape: 'vert_spine',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -7.5, fy: -5, role: 'H2' },
      { dx: 0, fy: 9.5, role: '1' },
      { dx: 0, fy: 14, role: '2' },
      { dx: 0, fy: 18.5, role: '3' },
      { dx: 0, fy: 23, role: '4' },
      { dx: 0, fy: 27.5, role: '5' }
    ],
    matchups: {
      sideline_trap: 'ideal',
      force_flick: 'middle',
      clam_bracket: 'middle',
      cup_zone: 'middle',
      deep_poach: 'middle',
      shutdown_reset: 'worst'
    },
    defaultHand: ['sideline_trap', 'force_flick', 'clam_bracket', 'shutdown_reset'],
    outcomes: {
      ideal: 'Sideline Trap pinched the Vertical Stack against the line and forced a desperate high-stall turnover!',
      middle: 'Solid containment slowed the Vert Stack, but timed under cuts moved the disc downfield.',
      worst: 'Blitzing the reset handler left the wide-open Vert lane unguarded for a booming deep huck goal!'
    }
  },

  ho_stack: {
    id: 'ho_stack',
    name: 'Horizontal Stack',
    tag: '4-WIDE SPREAD',
    hint: '3 handlers & 4 wide cutters love deep wing shots while middle poppers shred cups — sag a Deep Poach!',
    scoutShape: 'ho_line',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -9.5, fy: -4.2, role: 'H2' },
      { dx: 9.5, fy: -4.2, role: 'H3' },
      { dx: -14, fy: 15.5, role: '1' },
      { dx: -4.8, fy: 13.5, role: '2' },
      { dx: 4.8, fy: 13.5, role: '3' },
      { dx: 14, fy: 15.5, role: '4' }
    ],
    matchups: {
      deep_poach: 'ideal',
      force_flick: 'middle',
      sideline_trap: 'middle',
      clam_bracket: 'middle',
      shutdown_reset: 'middle',
      cup_zone: 'worst'
    },
    defaultHand: ['deep_poach', 'force_flick', 'sideline_trap', 'cup_zone'],
    outcomes: {
      ideal: 'Deep Poach baited the Horizontal wing huck and skied the receiver for a clutch interception!',
      middle: 'Your defense prevented the deep bomb, though Ho Stack worked patient under-swings for yardage.',
      worst: 'Ho Stack’s middle poppers & 3 handlers sliced right through the 3-Person Cup for an easy goal!'
    }
  },

  side_iso: {
    id: 'side_iso',
    name: 'Side Stack ISO',
    tag: 'ISOLATION STAR',
    hint: '4 cutters cleared to one sideline to isolate 1 star cutter in open space — double-bracket with a Clam!',
    scoutShape: 'iso_spotlight',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -7, fy: -4.8, role: 'H2' },
      { dx: -5.5, fy: 15.5, role: 'ISO', highlight: true },
      { dx: 14.5, fy: 10, role: '2' },
      { dx: 14.5, fy: 14, role: '3' },
      { dx: 14.5, fy: 18, role: '4' },
      { dx: 14.5, fy: 22, role: '5' }
    ],
    matchups: {
      clam_bracket: 'ideal',
      force_flick: 'middle',
      deep_poach: 'middle',
      cup_zone: 'middle',
      shutdown_reset: 'middle',
      sideline_trap: 'worst'
    },
    defaultHand: ['clam_bracket', 'force_flick', 'deep_poach', 'sideline_trap'],
    outcomes: {
      ideal: 'Clam Bracket walled off both the under & deep ISO lanes, forcing a Stall-9 layout block!',
      middle: 'Good hustle slowed the ISO star, but secondary swings picked up a solid chunk of yards.',
      worst: 'Sideline Trap left the middle wide open — the isolated star sprinted untouched for a breakaway goal!'
    }
  },

  handler_weave: {
    id: 'handler_weave',
    name: 'Handler Weave',
    tag: 'SMALL-BALL DOMINATOR',
    hint: '4 quick handlers are cycling relentless short resets — jump the dump lane with Shutdown Reset!',
    scoutShape: 'handler_triangle',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -7, fy: -3.2, role: 'H2' },
      { dx: 7, fy: -2.5, role: 'H3' },
      { dx: 1.5, fy: 6.8, role: 'H4' },
      { dx: -12.5, fy: 24, role: '1' },
      { dx: 0, fy: 26, role: '2' },
      { dx: 12.5, fy: 24, role: '3' }
    ],
    matchups: {
      shutdown_reset: 'ideal',
      cup_zone: 'middle',
      sideline_trap: 'middle',
      force_flick: 'middle',
      clam_bracket: 'middle',
      deep_poach: 'worst'
    },
    defaultHand: ['shutdown_reset', 'cup_zone', 'force_flick', 'deep_poach'],
    outcomes: {
      ideal: 'Shutdown Reset jumped the dump pass in the backfield for an explosive layout D-block!',
      middle: 'Your mark forced extra throws, though quick handler give-and-gos chipped forward.',
      worst: 'Deep Poach left the handlers 4-on-3 underneath — they played effortless give-and-go all the way in!'
    }
  },

  red_zone: {
    id: 'red_zone',
    name: 'Red Zone Endzone Set',
    tag: 'GOAL LINE THREAT',
    hint: 'Compressed Red Zone eliminates deep space — throw a 3-Person Cup around the disc to seal the front cones!',
    scoutShape: 'redzone_box',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -8, fy: -4, role: 'H2' },
      { dx: 8, fy: -4, role: 'H3' },
      { dx: 0, fy: 7.5, role: '1' },
      { dx: 0, fy: 12, role: '2' },
      { dx: -11.5, fy: 11.5, role: '3' },
      { dx: 11.5, fy: 11.5, role: '4' }
    ],
    matchups: {
      cup_zone: 'ideal',
      clam_bracket: 'middle',
      sideline_trap: 'middle',
      shutdown_reset: 'middle',
      deep_poach: 'middle',
      force_flick: 'worst'
    },
    defaultHand: ['cup_zone', 'clam_bracket', 'sideline_trap', 'force_flick'],
    outcomes: {
      ideal: '3-Person Cup walled off the front cone and forced a floaty Stall-9 pass straight into an interception!',
      middle: 'Tight Red Zone scramble! They completed a short swing closer to the line — hold the stand!',
      worst: 'Pure 1v1 in the Red Zone got beaten by a quick front-cone dart for the score!'
    }
  }
};

/**
 * Reactive Bot Defenses when Player is on Offense!
 * Notice how Man schemes dynamically follow whatever Base Stack ('vert' or 'ho') the Player's offense sets up in,
 * while Zone schemes ('cup', 'wall') peel off into spaces — all paired with an explicit Force ('home' ◀ or 'away' ▶).
 */
export const BOT_DEFENSES = {
  bot_man_open: {
    id: 'bot_man_open',
    name: 'Man-to-Man',
    coverageType: 'man',
    tag: 'OPEN FORCE LANE',
    hint: 'Bot matched your stack 1v1 and is forcing toward the big open side of the field — attack that lane with Force-Side Cuts!',
    scoutShape: 'bot_man_open',
    forceStyle: 'directional',
    matchups: {
      force_cuts: 'ideal',
      deep_huck: 'middle',
      give_go: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      break_swing: 'worst'
    },
    defaultHand: ['force_cuts', 'deep_huck', 'give_go', 'break_swing'],
    outcomes: {
      ideal: 'Force-Side Cuts attacked the wide-open forced side in stride and powered straight into the end zone!',
      middle: 'Patient execution against 1v1 Man moved the disc 25 yards downfield.',
      worst: 'Forcing an Inside Break throw toward the cramped short side got hand-blocked by a disciplined mark!'
    }
  },

  bot_man_trap: {
    id: 'bot_man_trap',
    name: 'Man-to-Man (Trap)',
    coverageType: 'man_trap',
    tag: 'TRAPPED ON LINE',
    hint: 'You’re near the sideline and Bot is forcing you straight into the line! Step inside with Break-Mark Swing to hit the wide-open break side!',
    scoutShape: 'bot_man_trap',
    forceStyle: 'directional',
    matchups: {
      break_swing: 'ideal',
      give_go: 'middle',
      deep_huck: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      force_cuts: 'worst'
    },
    defaultHand: ['break_swing', 'give_go', 'deep_huck', 'force_cuts'],
    outcomes: {
      ideal: 'Break-Mark Swing stepped inside the trap mark and swung to the wide-open break side for a score!',
      middle: 'Smart ball security escaped the sideline pressure for a solid gain.',
      worst: 'Cutting into the narrow trapped sideline lane got jumped by a poaching defender — Turnover!'
    }
  },

  bot_man_poach: {
    id: 'bot_man_poach',
    name: 'Man + Deep Poach',
    coverageType: 'man_poach',
    tag: 'DEEP SAG',
    hint: 'Bot matched your stack in Man, except their deepest defender sagged way off to bait hucks — slice underneath with Under Give & Go!',
    scoutShape: 'bot_poach',
    forceStyle: 'directional',
    matchups: {
      give_go: 'ideal',
      force_cuts: 'middle',
      break_swing: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      deep_huck: 'worst'
    },
    defaultHand: ['give_go', 'force_cuts', 'break_swing', 'deep_huck'],
    outcomes: {
      ideal: 'Under Give & Go exploited the unguarded cutter underneath the deep poacher all the way in for the goal!',
      middle: 'Short disciplined passes stayed safely away from the deep poacher for +25 yards.',
      worst: 'Uncorking a Deep ISO Huck right at a waiting Deep Poacher got skied cleanly — Turnover!'
    }
  },

  bot_man_blitz: {
    id: 'bot_man_blitz',
    name: 'Man + Reset Deny',
    coverageType: 'man_blitz',
    tag: 'DUMP BLITZ',
    hint: 'Tight Man across your stack with a face-guarding Reset Blitz and zero deep help — punish them with Deep ISO Huck!',
    scoutShape: 'bot_blitz',
    forceStyle: 'directional',
    matchups: {
      deep_huck: 'ideal',
      force_cuts: 'middle',
      break_swing: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      give_go: 'worst'
    },
    defaultHand: ['deep_huck', 'force_cuts', 'break_swing', 'give_go'],
    outcomes: {
      ideal: 'With zero deep safety behind the blitz, Deep ISO Huck bombed to the open Force lane for an electric score!',
      middle: 'Looking downfield bypassed the backfield blitz for a clean 25-yard gain.',
      worst: 'Throwing short Give & Go resets straight into a face-guarding Dump Blitz got layout-blocked!'
    }
  },

  bot_zone_cup: {
    id: 'bot_zone_cup',
    name: '3-Man Cup Zone',
    coverageType: 'zone_cup',
    tag: 'ZONE CUP SHELL',
    hint: 'Notice how they didn’t follow your stack — 3 defenders formed a Cup around the disc! Crash the middle with Popper Crash & Swing!',
    scoutShape: 'bot_cup',
    forceStyle: 'cup',
    matchups: {
      pop_swing: 'ideal',
      zone_flood: 'middle',
      give_go: 'middle',
      break_swing: 'middle',
      force_cuts: 'middle',
      deep_huck: 'worst'
    },
    defaultHand: ['pop_swing', 'zone_flood', 'give_go', 'deep_huck'],
    outcomes: {
      ideal: 'Popper Crash & Swing punctured the soft center of the Cup and swung to the weak side for the goal!',
      middle: 'Crisp swings moved the Cup side-to-side for a 24-yard advance.',
      worst: 'Winding up a slow Deep ISO Huck through a 3-Man Cup got point-blocked right at release!'
    }
  },

  bot_zone_wall: {
    id: 'bot_zone_wall',
    name: '2-3-2 Wall Zone',
    coverageType: 'zone_wall',
    tag: 'MIDFIELD WALL',
    hint: 'They peeled off your stack into a 3-across midfield Wall Zone! Overload one wing & go over the top with Flood & Over-Top!',
    scoutShape: 'bot_wall',
    forceStyle: 'directional',
    matchups: {
      zone_flood: 'ideal',
      pop_swing: 'middle',
      give_go: 'middle',
      break_swing: 'middle',
      deep_huck: 'middle',
      force_cuts: 'worst'
    },
    defaultHand: ['zone_flood', 'pop_swing', 'give_go', 'force_cuts'],
    outcomes: {
      ideal: 'Flood & Over-Top overloaded the wing and floated a pinpoint blade over the 3-man Wall for the score!',
      middle: 'Patient swings stretched the 2-3-2 Wall enough to slip a pass through for solid yards.',
      worst: 'Running standard 1v1 Force-Side Cuts straight into a stationary 3-man Wall led to an easy zone pick!'
    }
  }
};

/**
 * Selects a contextually authentic Bot Defense + Force ('home' or 'away') + Player Base Stack ('vert' or 'ho')
 * given the current disc coordinates (discX, discY).
 */
export function rollBotDefenseState({ discX, prevDefId = null, prevStack = 'vert', isAdvance = false, rng = Math.random }) {
  // Keep same base stack on a mid-field advance, or alternate between Vert & Ho on fresh possessions!
  const baseStack = isAdvance ? prevStack : (rng() < 0.58 ? 'vert' : 'ho');

  const nearSideline = Math.abs(discX) >= 5.5;
  let defId = prevDefId;

  if (!isAdvance || !prevDefId || rng() < 0.5) {
    const candidates = Object.keys(BOT_DEFENSES).filter((id) => {
      if (id === prevDefId) return false;
      if (id === 'bot_man_trap' && !nearSideline) return false;
      return true;
    });
    defId = candidates[Math.floor(rng() * candidates.length)];
  } else if (defId === 'bot_man_trap' && !nearSideline) {
    // Escaped the sideline on the previous advance -> trap naturally becomes open-side Man!
    defId = 'bot_man_open';
  }

  // Choose Force ('home' = Left -x, 'away' = Right +x) authentically:
  let forceSide;
  if (defId === 'bot_man_trap') {
    // Force toward the NEAR sideline to trap the offense!
    forceSide = discX < 0 ? 'home' : 'away';
  } else if (defId === 'bot_man_open') {
    // Force toward the BIG open side of the field!
    if (discX > 3.5) forceSide = 'home';
    else if (discX < -3.5) forceSide = 'away';
    else forceSide = rng() < 0.5 ? 'home' : 'away';
  } else {
    forceSide = rng() < 0.5 ? 'home' : 'away';
  }

  return { defId, forceSide, baseStack };
}

/**
 * Builds the 4-card hand for the current decision.
 */
export function buildDecisionHand(lookObj, strategyCatalog, keepStrategyId = null, rng = Math.random) {
  const allIds = Object.keys(strategyCatalog);
  const idealId = allIds.find((id) => lookObj.matchups[id] === 'ideal');
  const worstId = allIds.find((id) => lookObj.matchups[id] === 'worst');

  if (!keepStrategyId || !strategyCatalog[keepStrategyId]) {
    const handIds = [...lookObj.defaultHand];
    for (let i = handIds.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [handIds[i], handIds[j]] = [handIds[j], handIds[i]];
    }
    return handIds.map((id) => ({
      ...strategyCatalog[id],
      isKeep: false,
      tier: lookObj.matchups[id]
    }));
  }

  const switchPool = [];
  if (idealId && idealId !== keepStrategyId) switchPool.push(idealId);
  if (worstId && worstId !== keepStrategyId && switchPool.length < 3) switchPool.push(worstId);

  for (const id of lookObj.defaultHand) {
    if (id !== keepStrategyId && !switchPool.includes(id) && switchPool.length < 3) {
      switchPool.push(id);
    }
  }
  for (const id of allIds) {
    if (id !== keepStrategyId && !switchPool.includes(id) && switchPool.length < 3) {
      switchPool.push(id);
    }
  }

  for (let i = switchPool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [switchPool[i], switchPool[j]] = [switchPool[j], switchPool[i]];
  }

  return [
    {
      ...strategyCatalog[keepStrategyId],
      isKeep: true,
      tier: lookObj.matchups[keepStrategyId]
    },
    ...switchPool.map((id) => ({
      ...strategyCatalog[id],
      isKeep: false,
      tier: lookObj.matchups[id]
    }))
  ];
}
