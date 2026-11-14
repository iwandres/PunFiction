// Complete 7v7 Tactical Playbook & Matchup Matrices for Flatball Tactics
// Coordinates use (dx, forwardY) relative to the disc:
//   dx: lateral offset in yards (-20 = left sideline, +20 = right sideline)
//   forwardY: yards in the attacking direction (+ = downfield toward target end zone, - = backfield behind disc)

export const PLAYER_DEFENSES = {
  sideline_trap: {
    id: 'sideline_trap',
    name: 'Sideline Trap',
    badge: 'TRAP',
    icon: 'trap',
    shortDesc: 'Force toward sideline & pinch middle lanes',
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
  pop_swing: {
    id: 'pop_swing',
    name: 'Pop & Swing',
    badge: 'HO POP',
    icon: 'pop',
    shortDesc: 'Dart middle poppers into zone gaps & swing wide'
  },
  break_mark: {
    id: 'break_mark',
    name: 'Inside Break Cut',
    badge: 'IO BREAK',
    icon: 'break',
    shortDesc: 'Jab-step & rip an Inside-Out pass past a trap'
  },
  give_go: {
    id: 'give_go',
    name: 'Give & Go Weave',
    badge: 'SMALL BALL',
    icon: 'weave',
    shortDesc: 'Rapid short handler triangles underneath sags'
  },
  split_flood: {
    id: 'split_flood',
    name: 'Split Zone Flood',
    badge: 'FLOOD',
    icon: 'flood',
    shortDesc: 'Overload one bracket with staggered cuts'
  },
  side_iso_huck: {
    id: 'side_iso_huck',
    name: 'Side ISO Huck',
    badge: 'DEEP BOMB',
    icon: 'huck',
    shortDesc: 'Clear 4 cutters & bomb deep to an isolated star'
  },
  vert_power: {
    id: 'vert_power',
    name: 'Vert Power Cuts',
    badge: '1v1 TIMING',
    icon: 'vert',
    shortDesc: 'Hard under cut + timed open-side continuation'
  }
};

export const BOT_OFFENSES = {
  vert_stack: {
    id: 'vert_stack',
    name: 'Vertical Stack',
    tag: 'CENTER SPINE',
    hint: '5 cutters stacked down the center create wide side lanes — trap them against a sideline to choke their space!',
    scoutShape: 'vert_spine',
    // 7 Offense offsets: [0] has disc, [1] reset handler, [2..6] cutters
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

// Base neutral readiness formation for Player's 7 offensive players right as Bot Defense sets up first
export const PLAYER_BASE_OFFENSE_OFFSETS = [
  { dx: 0, fy: 0, role: 'H1' },
  { dx: -7.5, fy: -4.8, role: 'H2' },
  { dx: -12.5, fy: 13.5, role: '1' },
  { dx: -4.8, fy: 15.5, role: '2' },
  { dx: 0, fy: 19, role: '3' },
  { dx: 5.2, fy: 15.5, role: '4' },
  { dx: 12.5, fy: 13.5, role: '5' }
];

// Target Offensive Formations when Player selects an Offensive Play
export const PLAYER_OFFENSE_SHAPES = {
  pop_swing: [
    { dx: 0, fy: 0, role: 'H1' },
    { dx: -9, fy: -4, role: 'H2' },
    { dx: 9, fy: -4, role: 'H3' },
    { dx: -14, fy: 14, role: '1' },
    { dx: -4, fy: 11, role: '2' },
    { dx: 4, fy: 11, role: '3' },
    { dx: 14, fy: 14, role: '4' }
  ],
  break_mark: [
    { dx: 0, fy: 0, role: 'H1' },
    { dx: -7, fy: -5, role: 'H2' },
    { dx: 0, fy: 9, role: '1' },
    { dx: 0, fy: 14, role: '2' },
    { dx: 0, fy: 19, role: '3' },
    { dx: 0, fy: 24, role: '4' },
    { dx: -11, fy: 16, role: '5' }
  ],
  give_go: [
    { dx: 0, fy: 0, role: 'H1' },
    { dx: -6.5, fy: -3, role: 'H2' },
    { dx: 6.5, fy: -2.5, role: 'H3' },
    { dx: 2, fy: 7, role: '4' },
    { dx: -12, fy: 21, role: '1' },
    { dx: 0, fy: 23, role: '2' },
    { dx: 12, fy: 21, role: '3' }
  ],
  split_flood: [
    { dx: 0, fy: 0, role: 'H1' },
    { dx: -7.5, fy: -4.5, role: 'H2' },
    { dx: -10, fy: 10, role: '1' },
    { dx: -9, fy: 19, role: '2' },
    { dx: -13, fy: 14, role: '3' },
    { dx: 12, fy: 14, role: '4' },
    { dx: 12, fy: 21, role: '5' }
  ],
  side_iso_huck: [
    { dx: 0, fy: 0, role: 'H1' },
    { dx: -7, fy: -4.8, role: 'H2' },
    { dx: -5, fy: 16, role: 'ISO' },
    { dx: 14.5, fy: 10, role: '2' },
    { dx: 14.5, fy: 14, role: '3' },
    { dx: 14.5, fy: 18, role: '4' },
    { dx: 14.5, fy: 22, role: '5' }
  ],
  vert_power: [
    { dx: 0, fy: 0, role: 'H1' },
    { dx: -7.5, fy: -5, role: 'H2' },
    { dx: 0, fy: 9.5, role: '1' },
    { dx: 0, fy: 14, role: '2' },
    { dx: 0, fy: 18.5, role: '3' },
    { dx: 0, fy: 23, role: '4' },
    { dx: 0, fy: 27.5, role: '5' }
  ]
};

export const BOT_DEFENSES = {
  bot_cup_zone: {
    id: 'bot_cup_zone',
    name: '3-Person Cup Zone',
    tag: 'ZONE SHELL',
    hint: '3 Bot defenders have surrounded your handler in a Cup — puncture the middle with Pop & Swing!',
    scoutShape: 'bot_cup',
    forceType: 'cup',
    defenseOffsets: [
      { dx: -3.2, fy: 3.1, role: 'C1' },
      { dx: 0, fy: 4.2, role: 'C2' },
      { dx: 3.2, fy: 3.1, role: 'C3' },
      { dx: -10.5, fy: 11.5, role: 'M1' },
      { dx: 10.5, fy: 11.5, role: 'M2' },
      { dx: -6.5, fy: 22, role: 'D1' },
      { dx: 6.5, fy: 22, role: 'D2' }
    ],
    matchups: {
      pop_swing: 'ideal',
      give_go: 'middle',
      split_flood: 'middle',
      break_mark: 'middle',
      vert_power: 'middle',
      side_iso_huck: 'worst'
    },
    defaultHand: ['pop_swing', 'give_go', 'split_flood', 'side_iso_huck'],
    outcomes: {
      ideal: 'Pop & Swing darted a popper right into the heart of the Cup and swung wide for an unstoppable score!',
      middle: 'Patient ball movement worked around the Cup shell for a solid downfield gain.',
      worst: 'Winding up a slow Side ISO Huck right into a 3-Person Cup got point-blocked at release — Turnover!'
    }
  },

  bot_sideline_trap: {
    id: 'bot_sideline_trap',
    name: 'Sideline Trap Force',
    tag: 'TRAP MARK',
    hint: 'Bot marker is walling off the middle and trapping the sideline — break the mark inside with Inside Break Cut!',
    scoutShape: 'bot_trap',
    forceType: 'trap',
    defenseOffsets: [
      { dx: -2.2, fy: 2.3, role: 'M' },
      { dx: -5.8, fy: -3.5, role: 'D2' },
      { dx: -11, fy: 12, role: 'D3' },
      { dx: -3.5, fy: 14, role: 'D4' },
      { dx: 1.5, fy: 17.5, role: 'D5' },
      { dx: 6.5, fy: 14, role: 'D6' },
      { dx: 13.5, fy: 12, role: 'D7' }
    ],
    matchups: {
      break_mark: 'ideal',
      vert_power: 'middle',
      give_go: 'middle',
      side_iso_huck: 'middle',
      split_flood: 'middle',
      pop_swing: 'worst'
    },
    defaultHand: ['break_mark', 'vert_power', 'give_go', 'pop_swing'],
    outcomes: {
      ideal: 'Inside Break Cut stepped past the trap with a laser IO break throw, unlocking the wide-open field for a score!',
      middle: 'Good discipline protected the disc against the trap and picked up tough yards.',
      worst: 'Swinging wide into a Sideline Trap got jumped in the passing lane for a Bot interception!'
    }
  },

  bot_deep_poach: {
    id: 'bot_deep_poach',
    name: 'Deep Poach Sag',
    tag: 'NO-HUCK SAFETY',
    hint: 'Bot’s 7th defender is sagging 25 yards deep to bait hucks — shred them underneath with Give & Go Weave!',
    scoutShape: 'bot_poach',
    forceType: 'flat',
    defenseOffsets: [
      { dx: 0, fy: 3.1, role: 'M' },
      { dx: -6.2, fy: -3.8, role: 'D2' },
      { dx: -11.5, fy: 12.5, role: 'D3' },
      { dx: -4.2, fy: 14.5, role: 'D4' },
      { dx: 4.8, fy: 14.5, role: 'D5' },
      { dx: 11.5, fy: 12.5, role: 'D6' },
      { dx: 0, fy: 26.5, role: 'SAG', highlight: true }
    ],
    matchups: {
      give_go: 'ideal',
      break_mark: 'middle',
      pop_swing: 'middle',
      split_flood: 'middle',
      vert_power: 'middle',
      side_iso_huck: 'worst'
    },
    defaultHand: ['give_go', 'break_mark', 'pop_swing', 'side_iso_huck'],
    outcomes: {
      ideal: 'Give & Go Weave exploited the unguarded short space with rapid triangles all the way to the end zone!',
      middle: 'Smart underneath throws stayed away from the deep poacher for a clean 24-yard advance.',
      worst: 'Throwing a Side ISO Huck straight at a waiting Deep Poacher got skied cleanly — Turnover!'
    }
  },

  bot_clam_bracket: {
    id: 'bot_clam_bracket',
    name: 'Clam Bracket Zone',
    tag: 'UNDER / DEEP WALLS',
    hint: 'Downfield defenders are sharing fixed under & deep brackets — overload one side with Split Zone Flood!',
    scoutShape: 'bot_clam',
    forceType: 'open',
    defenseOffsets: [
      { dx: -1.8, fy: 2.6, role: 'M' },
      { dx: -6.5, fy: -4, role: 'D2' },
      { dx: -9.5, fy: 11, role: 'U1' },
      { dx: 0, fy: 11, role: 'U2' },
      { dx: 9.5, fy: 11, role: 'U3' },
      { dx: -6.5, fy: 21.5, role: 'B1' },
      { dx: 6.5, fy: 21.5, role: 'B2' }
    ],
    matchups: {
      split_flood: 'ideal',
      give_go: 'middle',
      pop_swing: 'middle',
      break_mark: 'middle',
      side_iso_huck: 'middle',
      vert_power: 'worst'
    },
    defaultHand: ['split_flood', 'give_go', 'pop_swing', 'vert_power'],
    outcomes: {
      ideal: 'Split Zone Flood sent two staggered cutters into one bracket — the deep cutter streaked wide open for the score!',
      middle: 'Lateral swings stretched the Clam brackets enough to find a gap for solid yardage.',
      worst: 'Single Vert Power Cuts ran straight into the waiting Clam bracket for an easy layout block!'
    }
  },

  bot_shutdown_reset: {
    id: 'bot_shutdown_reset',
    name: 'Shutdown Reset Blitz',
    tag: 'DUMP BLITZ',
    hint: 'Bot defenders are blitzing your backfield reset lane with zero deep help — launch a Side ISO Huck!',
    scoutShape: 'bot_blitz',
    forceType: 'tight',
    defenseOffsets: [
      { dx: -1.2, fy: 2.0, role: 'M' },
      { dx: -4.2, fy: -2.4, role: 'BLZ', highlight: true },
      { dx: -12, fy: 12.5, role: 'D3' },
      { dx: -4.5, fy: 14.5, role: 'D4' },
      { dx: 0, fy: 18, role: 'D5' },
      { dx: 5.2, fy: 14.5, role: 'D6' },
      { dx: 12, fy: 12.5, role: 'D7' }
    ],
    matchups: {
      side_iso_huck: 'ideal',
      vert_power: 'middle',
      break_mark: 'middle',
      split_flood: 'middle',
      pop_swing: 'middle',
      give_go: 'worst'
    },
    defaultHand: ['side_iso_huck', 'vert_power', 'break_mark', 'give_go'],
    outcomes: {
      ideal: 'With zero deep help behind the blitz, Side ISO Huck uncorked a majestic bomb caught in stride for the goal!',
      middle: 'Looking downfield bypassed the dump blitz and moved the disc 25 yards closer to scoring.',
      worst: 'Forcing short Give & Go resets directly into a Dump Blitz got layout-blocked in the backfield!'
    }
  },

  bot_force_flick: {
    id: 'bot_force_flick',
    name: 'Open-Side 1v1 Person',
    tag: 'PURE MATCHUP D',
    hint: 'Honest 1-on-1 defense across all 7 players with no zone help — win your matchups with Vert Power Cuts!',
    scoutShape: 'bot_person',
    forceType: 'open',
    defenseOffsets: [
      { dx: -2.1, fy: 2.4, role: 'M' },
      { dx: -6.2, fy: -3.8, role: 'D2' },
      { dx: -11.2, fy: 12.2, role: 'D3' },
      { dx: -3.8, fy: 14.2, role: 'D4' },
      { dx: 1.0, fy: 17.5, role: 'D5' },
      { dx: 6.2, fy: 14.2, role: 'D6' },
      { dx: 11.2, fy: 12.2, role: 'D7' }
    ],
    matchups: {
      vert_power: 'ideal',
      side_iso_huck: 'middle',
      split_flood: 'middle',
      give_go: 'middle',
      pop_swing: 'middle',
      break_mark: 'worst'
    },
    defaultHand: ['vert_power', 'side_iso_huck', 'split_flood', 'break_mark'],
    outcomes: {
      ideal: 'Vert Power Cuts planted hard deep, won the under footrace, and hit a clinical continuation strike for the score!',
      middle: 'Crisp cuts against 1v1 coverage earned a clean 25-yard gain downfield.',
      worst: 'Forcing an Inside Break throw directly into a disciplined 1v1 mark got hand-blocked at the release!'
    }
  }
};

/**
 * Builds the 4-card hand for the current decision.
 * - On fresh read: shuffles the formation's 4 balanced cards (1 ideal, 2 middle, 1 worst) using rng().
 * - On mid-field audible (keepStrategyId provided): Card 0 is KEEP [keepStrategyId], plus 3 switch cards
 *   guaranteed to include the ideal counter (if keepStrategyId isn't already ideal) + varied options.
 */
export function buildDecisionHand(lookObj, strategyCatalog, keepStrategyId = null, rng = Math.random) {
  const allIds = Object.keys(strategyCatalog);
  const idealId = allIds.find((id) => lookObj.matchups[id] === 'ideal');
  const worstId = allIds.find((id) => lookObj.matchups[id] === 'worst');

  if (!keepStrategyId) {
    const handIds = [...lookObj.defaultHand];
    // Fisher-Yates shuffle so Ideal isn't in a predictable slot
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

  // Mid-field decision: Keep current + 3 Audible options
  const switchPool = [];
  if (idealId && idealId !== keepStrategyId) {
    switchPool.push(idealId);
  }
  if (worstId && worstId !== keepStrategyId && switchPool.length < 3) {
    switchPool.push(worstId);
  }
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

  // Shuffle the 3 switch options
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
