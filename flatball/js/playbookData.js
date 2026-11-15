// Expanded 7v7 Tactical Playbook, Wind System & Matchup Engine for Flatball Tactics
// Field Orientation:
//   x in [-20, +20] yards: -20 = HOME Sideline (Left), +20 = AWAY Sideline (Right)
//   y in [0, 110] yards: 0..20 = Player Defended End Zone (Bottom), 90..110 = Player Attacking End Zone (Top)

export const PLAYER_DEFENSES = {
  force_flick: {
    id: 'force_flick',
    name: 'Force Open-Side',
    badge: '1v1 FORCE',
    icon: 'person',
    shortDesc: 'Disciplined 1v1 mark denying breaks & shading one side',
    forceType: 'open'
  },
  sideline_trap: {
    id: 'sideline_trap',
    name: 'Sideline Trap',
    badge: 'TRAP MAN',
    icon: 'trap',
    shortDesc: 'Pin thrower on the sideline & block middle resets',
    forceType: 'trap'
  },
  force_middle: {
    id: 'force_middle',
    name: 'Force Middle',
    badge: 'FORCE MID',
    icon: 'middle',
    shortDesc: 'Shut off sideline hucks & steer throws into middle help',
    forceType: 'middle'
  },
  deep_poach: {
    id: 'deep_poach',
    name: 'Deep Poach',
    badge: 'HELP DEEP',
    icon: 'poach',
    shortDesc: 'Sag 7th defender deep like a safety to sky long hucks',
    forceType: 'flat'
  },
  clam_bracket: {
    id: 'clam_bracket',
    name: 'Clam Bracket',
    badge: 'BRACKET',
    icon: 'clam',
    shortDesc: 'Sandwich cutters with shared under & deep brackets',
    forceType: 'open'
  },
  shutdown_reset: {
    id: 'shutdown_reset',
    name: 'Shutdown Reset',
    badge: 'NO DUMP',
    icon: 'blitz',
    shortDesc: 'Blitz the backup handler to deny easy stall resets',
    forceType: 'tight'
  },
  cup_zone: {
    id: 'cup_zone',
    name: '3-Person Cup',
    badge: '3-3-1 CUP',
    icon: 'cup',
    shortDesc: 'Surround thrower with a 3-defender cup wall',
    forceType: 'cup'
  },
  wall_zone: {
    id: 'wall_zone',
    name: '2-3-2 Wall Zone',
    badge: 'WALL ZONE',
    icon: 'wall',
    shortDesc: '3-across midfield wall clogging medium passing lanes',
    forceType: 'open'
  },
  box_and_one: {
    id: 'box_and_one',
    name: 'Box-and-1 Junk',
    badge: 'BOX + 1',
    icon: 'box1',
    shortDesc: 'Lock 1 chaser onto their star + 4-defender zone box',
    forceType: 'tight'
  }
};

export const PLAYER_OFFENSES = {
  force_cuts: {
    id: 'force_cuts',
    name: 'Force-Side Cuts',
    badge: 'OPEN LANE',
    icon: 'vert',
    shortDesc: 'Timed in-and-out cuts into the open forced lane',
    windRisk: 'low'
  },
  break_swing: {
    id: 'break_swing',
    name: 'Break-Mark Swing',
    badge: 'BREAK SIDE',
    icon: 'break',
    shortDesc: 'Step inside the mark & swing to the open break side',
    windRisk: 'low'
  },
  upline_strike: {
    id: 'upline_strike',
    name: 'Upline Strike Cut',
    badge: 'POWER CUT',
    icon: 'strike',
    shortDesc: 'Handler bursts upline past a blitzing reset defender',
    windRisk: 'low'
  },
  dump_swing: {
    id: 'dump_swing',
    name: 'Dump-Swing Reversal',
    badge: 'SWING WIDE',
    icon: 'swing',
    shortDesc: 'Reset backward & swing across to flip the whole field',
    windRisk: 'low'
  },
  give_go: {
    id: 'give_go',
    name: 'Give-and-Go Weave',
    badge: 'SMALL BALL',
    icon: 'weave',
    shortDesc: 'Quick handler triangles underneath deep coverage',
    windRisk: 'low'
  },
  pop_swing: {
    id: 'pop_swing',
    name: 'Popper & Wing Swing',
    badge: 'CUP BEATER',
    icon: 'pop',
    shortDesc: 'Flash poppers behind a cup & dish wide to wings',
    windRisk: 'low'
  },
  zone_flood: {
    id: 'zone_flood',
    name: 'Flood & Over-Top',
    badge: 'WALL BEATER',
    icon: 'flood',
    shortDesc: 'Overload one wing short + deep & float over the wall',
    windRisk: 'medium'
  },
  overhead_hammer: {
    id: 'overhead_hammer',
    name: 'Overhead Hammer',
    badge: 'OVERHEAD',
    icon: 'hammer',
    shortDesc: 'Upside-down overhead arc over a box, cup, or trap',
    windRisk: 'high'
  },
  deep_huck: {
    id: 'deep_huck',
    name: 'Deep ISO Huck',
    badge: 'LONG BOMB',
    icon: 'huck',
    shortDesc: 'Clear space & launch a 40-yard bomb into 1v1 grass',
    windRisk: 'high'
  }
};

export const BOT_OFFENSES = {
  vert_stack: {
    id: 'vert_stack',
    name: 'Vertical Stack',
    tag: 'CENTER SPINE',
    hint: '5 cutters in a center line open huge deep lanes on both sides — drop a Deep Poach safety to bait & sky the huck!',
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
      deep_poach: 'ideal',
      sideline_trap: 'middle',
      force_flick: 'middle',
      force_middle: 'middle',
      clam_bracket: 'middle',
      cup_zone: 'middle',
      wall_zone: 'middle',
      box_and_one: 'middle',
      shutdown_reset: 'worst'
    },
    defaultHand: ['deep_poach', 'force_flick', 'sideline_trap', 'shutdown_reset'],
    outcomes: {
      ideal: 'Deep Poach patrolled the end-zone lane and skied the Vertical Stack deep shot for a clutch interception!',
      middle: 'Solid containment slowed the Vert Stack, though timed under cuts moved the disc downfield.',
      worst: 'Blitzing the reset handler left the wide-open Vert lane unguarded for a booming deep huck goal!'
    }
  },

  ho_stack: {
    id: 'ho_stack',
    name: 'Horizontal Stack',
    tag: '4-WIDE SPREAD',
    hint: '4 wide cutters want open lanes to churn in-and-out — throw a 3-Person Cup Zone to wall off all four lanes at once!',
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
      cup_zone: 'ideal',
      deep_poach: 'middle',
      force_flick: 'middle',
      force_middle: 'middle',
      clam_bracket: 'middle',
      wall_zone: 'middle',
      shutdown_reset: 'middle',
      box_and_one: 'middle',
      sideline_trap: 'worst'
    },
    defaultHand: ['cup_zone', 'deep_poach', 'force_flick', 'sideline_trap'],
    outcomes: {
      ideal: '3-Person Cup clogged all four Horizontal cutting lanes and forced a floaty Stall-9 pass into an interception!',
      middle: 'Good hustle prevented the big play, though Ho Stack worked patient swings for yardage.',
      worst: '3 spread handlers easily broke the Sideline Trap into wide-open midfield space for a fast score!'
    }
  },

  side_iso: {
    id: 'side_iso',
    name: 'Side Stack ISO',
    tag: 'ISOLATION STAR',
    hint: '4 cutters cleared to one sideline to isolate 1 star cutter (`ISO`) — sandwich them short & deep with Clam Bracket!',
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
      force_middle: 'middle',
      deep_poach: 'middle',
      cup_zone: 'middle',
      wall_zone: 'middle',
      box_and_one: 'middle',
      shutdown_reset: 'middle',
      sideline_trap: 'middle',
      force_flick: 'worst'
    },
    defaultHand: ['clam_bracket', 'deep_poach', 'box_and_one', 'force_flick'],
    outcomes: {
      ideal: 'Clam Bracket walled off both the under & deep ISO lanes, forcing a Stall-9 layout block!',
      middle: 'Help coverage slowed the ISO star, though secondary swings picked up a chunk of yards.',
      worst: 'Pure 1v1 Force Open-Side left one defender on an island — the ISO star sprinted untouched for a goal!'
    }
  },

  split_stack: {
    id: 'split_stack',
    name: 'Split Stack',
    tag: 'TWIN SIDELINES',
    hint: 'Cutters split onto BOTH sidelines leaving the middle open — call Force Middle to shut off sideline hucks and funnel throws into help!',
    scoutShape: 'split_stacks',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -6.5, fy: -4.5, role: 'H2' },
      { dx: -14.5, fy: 10.5, role: '1' },
      { dx: -14.5, fy: 17, role: '2' },
      { dx: 14.5, fy: 9.5, role: '3' },
      { dx: 14.5, fy: 15.5, role: '4' },
      { dx: 14.5, fy: 21.5, role: '5' }
    ],
    matchups: {
      force_middle: 'ideal',
      clam_bracket: 'middle',
      wall_zone: 'middle',
      cup_zone: 'middle',
      force_flick: 'middle',
      sideline_trap: 'middle',
      shutdown_reset: 'middle',
      box_and_one: 'middle',
      deep_poach: 'worst'
    },
    defaultHand: ['force_middle', 'clam_bracket', 'force_flick', 'deep_poach'],
    outcomes: {
      ideal: 'Force Middle took away the sideline continuation lanes and baited a cross-field pass right into your poacher!',
      middle: 'Solid recovery rallied to tackle the gain after Split Stack worked a sideline under cut.',
      worst: 'Sagging a lone Deep Poach in the empty middle left BOTH sideline stacks uncovered for an easy march to the goal!'
    }
  },

  hex_flow: {
    id: 'hex_flow',
    name: 'Hexagon Spread',
    tag: 'CONTINUOUS FLOW',
    hint: 'Triangles spread across the whole field want non-stop medium passes through the hub — park a 2-3-2 Wall Zone across midfield!',
    scoutShape: 'hex_grid',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -8.5, fy: -3.5, role: 'H2' },
      { dx: 0, fy: 10.5, role: 'HUB', highlight: true },
      { dx: -12, fy: 9, role: 'M1' },
      { dx: 12, fy: 9, role: 'M2' },
      { dx: -8, fy: 20.5, role: 'W1' },
      { dx: 8, fy: 20.5, role: 'W2' }
    ],
    matchups: {
      wall_zone: 'ideal',
      cup_zone: 'middle',
      box_and_one: 'middle',
      clam_bracket: 'middle',
      force_flick: 'middle',
      shutdown_reset: 'middle',
      sideline_trap: 'middle',
      deep_poach: 'middle',
      force_middle: 'worst'
    },
    defaultHand: ['wall_zone', 'cup_zone', 'force_flick', 'force_middle'],
    outcomes: {
      ideal: '2-3-2 Wall Zone sat right in Hexagon’s diagonal passing lanes and picked off a dart to the center hub!',
      middle: 'Your defense forced Hex to swing laterally, bending but not breaking for a medium gain.',
      worst: 'Force Middle fed the disc straight into Hexagon’s center HUB, letting them dish triangles all the way to the score!'
    }
  },

  handler_weave: {
    id: 'handler_weave',
    name: 'Handler Weave',
    tag: 'SMALL-BALL DOMINATOR',
    hint: '4 quick handlers are cycling rapid short resets — blitz the dump lane with Shutdown Reset!',
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
      box_and_one: 'middle',
      cup_zone: 'middle',
      wall_zone: 'middle',
      sideline_trap: 'middle',
      force_flick: 'middle',
      force_middle: 'middle',
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

  star_playmaker: {
    id: 'star_playmaker',
    name: 'Star Playmaker Hub',
    tag: 'ALL-STAR QB',
    hint: 'Everything runs through their highlighted `ACE` hybrid playmaker — lock a chaser on ACE with Box-and-1 Junk!',
    scoutShape: 'star_hub',
    offenseOffsets: [
      { dx: 0, fy: 0, role: 'H1' },
      { dx: -7.5, fy: -3.8, role: 'H2' },
      { dx: 4.2, fy: 7.2, role: 'ACE', highlight: true },
      { dx: -13.5, fy: 21, role: '1' },
      { dx: -4.5, fy: 24, role: '2' },
      { dx: 4.5, fy: 24, role: '3' },
      { dx: 13.5, fy: 21, role: '4' }
    ],
    matchups: {
      box_and_one: 'ideal',
      shutdown_reset: 'middle',
      clam_bracket: 'middle',
      force_middle: 'middle',
      cup_zone: 'middle',
      force_flick: 'middle',
      sideline_trap: 'middle',
      deep_poach: 'middle',
      wall_zone: 'worst'
    },
    defaultHand: ['box_and_one', 'shutdown_reset', 'clam_bracket', 'wall_zone'],
    outcomes: {
      ideal: 'Box-and-1 glued a lockdown chaser onto ACE while the 4-player Box swallowed their secondary throw!',
      middle: 'Solid pressure slowed ACE down, forcing secondary role players to work for a medium gain.',
      worst: 'A stationary 2-3-2 Wall let ACE roam freely between the lines and dissect the seams for a score!'
    }
  },

  red_zone: {
    id: 'red_zone',
    name: 'Red Zone Endzone Set',
    tag: 'GOAL LINE THREAT',
    hint: 'Compressed Red Zone inside 20 yards shrinks deep space — pin them on the boundary with Sideline Trap!',
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
      sideline_trap: 'ideal',
      cup_zone: 'middle',
      clam_bracket: 'middle',
      shutdown_reset: 'middle',
      box_and_one: 'middle',
      force_middle: 'middle',
      wall_zone: 'middle',
      force_flick: 'middle',
      deep_poach: 'worst'
    },
    defaultHand: ['sideline_trap', 'cup_zone', 'clam_bracket', 'deep_poach'],
    outcomes: {
      ideal: 'Sideline Trap suffocated the Red Zone space and forced a desperate Stall-9 pass out the back — Turnover!',
      middle: 'Tight Red Zone scramble! They completed a short swing closer to the line — hold the stand!',
      worst: 'Dropping a Deep Poach when they were already on your goal line left an easy unguarded front-cone score!'
    }
  }
};

/**
 * 9 Reactive Bot Defenses when Player is on Offense!
 */
export const BOT_DEFENSES = {
  bot_man_open: {
    id: 'bot_man_open',
    name: 'Man-to-Man',
    coverageType: 'man',
    tag: 'OPEN FORCE LANE',
    hint: 'Bot matched your stack 1v1 and is forcing toward the big open side — attack that wide lane with Force-Side Cuts!',
    scoutShape: 'bot_man_open',
    forceStyle: 'directional',
    matchups: {
      force_cuts: 'ideal',
      upline_strike: 'middle',
      dump_swing: 'middle',
      give_go: 'middle',
      deep_huck: 'middle',
      pop_swing: 'middle',
      overhead_hammer: 'middle',
      zone_flood: 'middle',
      break_swing: 'worst'
    },
    defaultHand: ['force_cuts', 'deep_huck', 'give_go', 'break_swing'],
    outcomes: {
      ideal: 'Force-Side Cuts attacked the wide-open forced lane in stride and powered straight into the end zone!',
      middle: 'Patient execution against 1v1 Man moved the disc 25 yards downfield.',
      worst: 'Forcing a low Break-Mark throw toward the cramped short side got hand-blocked by a disciplined marker!'
    }
  },

  bot_man_trap: {
    id: 'bot_man_trap',
    name: 'Sideline Trap Man',
    coverageType: 'man_trap',
    tag: 'TRAPPED ON LINE',
    hint: 'You’re near the sideline and Bot is forcing you into the boundary! Step inside with Break-Mark Swing to unlock the wide-open field!',
    scoutShape: 'bot_man_trap',
    forceStyle: 'directional',
    matchups: {
      break_swing: 'ideal',
      overhead_hammer: 'middle',
      dump_swing: 'middle',
      upline_strike: 'middle',
      give_go: 'middle',
      deep_huck: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      force_cuts: 'worst'
    },
    defaultHand: ['break_swing', 'dump_swing', 'overhead_hammer', 'force_cuts'],
    outcomes: {
      ideal: 'Break-Mark Swing stepped inside the trap mark and unleashed 30 yards of wide-open break-side grass for a score!',
      middle: 'Smart ball security escaped the sideline pressure for a solid gain.',
      worst: 'Cutting into the narrow trapped sideline lane got jumped along the boundary — Turnover!'
    }
  },

  bot_man_middle: {
    id: 'bot_man_middle',
    name: 'Force Middle Man',
    coverageType: 'man_middle',
    tag: 'FORCE MIDDLE',
    hint: 'Bot is forcing throws back into middle traffic! Use Dump-Swing Reversal to swing all the way to the wide-open far sideline!',
    scoutShape: 'bot_force_mid',
    forceStyle: 'middle',
    matchups: {
      dump_swing: 'ideal',
      break_swing: 'middle',
      give_go: 'middle',
      upline_strike: 'middle',
      overhead_hammer: 'middle',
      deep_huck: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      force_cuts: 'worst'
    },
    defaultHand: ['dump_swing', 'give_go', 'deep_huck', 'force_cuts'],
    outcomes: {
      ideal: 'Dump-Swing Reversal whipped the disc across the backfield to the far sideline before middle help could rotate — Goal!',
      middle: 'Patient resets shifted the Force Middle angle for a clean 24-yard advance.',
      worst: 'Cutting straight into the crowded Force Middle funnel ran right into a poaching defender — Turnover!'
    }
  },

  bot_man_poach: {
    id: 'bot_man_poach',
    name: 'Man + Deep Poach',
    coverageType: 'man_poach',
    tag: 'DEEP SAFETY',
    hint: 'Their 7th defender (`SAG`) dropped deep into the end-zone lane — slice underneath 6-on-5 with Give-and-Go Weave!',
    scoutShape: 'bot_poach',
    forceStyle: 'directional',
    matchups: {
      give_go: 'ideal',
      force_cuts: 'middle',
      dump_swing: 'middle',
      upline_strike: 'middle',
      break_swing: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      overhead_hammer: 'middle',
      deep_huck: 'worst'
    },
    defaultHand: ['give_go', 'force_cuts', 'dump_swing', 'deep_huck'],
    outcomes: {
      ideal: 'Give-and-Go Weave exploited the unguarded player underneath the deep poacher all the way in for the goal!',
      middle: 'Short disciplined passes stayed safely underneath the deep poacher for +25 yards.',
      worst: 'Launching a Deep ISO Huck straight at a waiting Deep Poacher got skied cleanly — Turnover!'
    }
  },

  bot_man_blitz: {
    id: 'bot_man_blitz',
    name: 'Man + Reset Deny',
    coverageType: 'man_blitz',
    tag: 'DUMP BLITZ',
    hint: 'Their `BLZ` defender is face-guarding your reset handler — sprint past their momentum with Upline Strike Cut!',
    scoutShape: 'bot_blitz',
    forceStyle: 'directional',
    matchups: {
      upline_strike: 'ideal',
      deep_huck: 'middle',
      force_cuts: 'middle',
      break_swing: 'middle',
      overhead_hammer: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      dump_swing: 'worst',
      give_go: 'worst'
    },
    defaultHand: ['upline_strike', 'deep_huck', 'force_cuts', 'dump_swing'],
    outcomes: {
      ideal: 'Upline Strike Cut faked back, burned the face-guarding blitzer upline into power position, and launched the goal!',
      middle: 'Attacking downfield bypassed the backfield dump blitz for a 25-yard gain.',
      worst: 'Throwing a backward reset straight into a face-guarding Dump Blitz got layout-blocked!'
    }
  },

  bot_man_press: {
    id: 'bot_man_press',
    name: 'Tight Under Press',
    coverageType: 'man_press',
    tag: 'NO-UNDER PRESS',
    hint: 'All 6 defenders stepped IN FRONT of your cutters to jump short passes with zero deep help — bomb Deep ISO Huck over the top!',
    scoutShape: 'bot_under_press',
    forceStyle: 'directional',
    matchups: {
      deep_huck: 'ideal',
      overhead_hammer: 'middle',
      upline_strike: 'middle',
      break_swing: 'middle',
      dump_swing: 'middle',
      pop_swing: 'middle',
      zone_flood: 'middle',
      give_go: 'worst',
      force_cuts: 'middle'
    },
    defaultHand: ['deep_huck', 'upline_strike', 'dump_swing', 'give_go'],
    outcomes: {
      ideal: 'With every defender gambling underneath, Deep ISO Huck sailed over the press into 35 yards of open green grass — Goal!',
      middle: 'Clever spacing pried open a window against the tight press for solid yardage.',
      worst: 'Throwing short Give-and-Go passes straight into underneath press defenders got jumped for an interception!'
    }
  },

  bot_zone_cup: {
    id: 'bot_zone_cup',
    name: '3-Man Cup Zone',
    coverageType: 'zone_cup',
    tag: 'ZONE CUP SHELL',
    hint: '3 defenders built a curved Cup wall around the disc! Swing around them and flash middle poppers with Popper & Wing Swing!',
    scoutShape: 'bot_cup',
    forceStyle: 'cup',
    matchups: {
      pop_swing: 'ideal',
      overhead_hammer: 'middle',
      dump_swing: 'middle',
      zone_flood: 'middle',
      give_go: 'middle',
      upline_strike: 'middle',
      force_cuts: 'middle',
      break_swing: 'worst',
      deep_huck: 'worst'
    },
    defaultHand: ['pop_swing', 'overhead_hammer', 'dump_swing', 'deep_huck'],
    outcomes: {
      ideal: 'Popper & Wing Swing stretched the 3-Man Cup wide and punctured the soft center pocket for the score!',
      middle: 'Crisp handler swings moved the Cup side-to-side for a 24-yard advance.',
      worst: 'Trying to blast a low throw straight through three Cup defenders got point-blocked at release!'
    }
  },

  bot_zone_wall: {
    id: 'bot_zone_wall',
    name: '2-3-2 Wall Zone',
    coverageType: 'zone_wall',
    tag: 'MIDFIELD WALL',
    hint: 'They peeled off into a 3-across midfield Wall! Overload one wing short + deep with Flood & Over-Top!',
    scoutShape: 'bot_wall',
    forceStyle: 'directional',
    matchups: {
      zone_flood: 'ideal',
      overhead_hammer: 'middle',
      pop_swing: 'middle',
      dump_swing: 'middle',
      give_go: 'middle',
      upline_strike: 'middle',
      break_swing: 'middle',
      deep_huck: 'middle',
      force_cuts: 'worst'
    },
    defaultHand: ['zone_flood', 'pop_swing', 'dump_swing', 'force_cuts'],
    outcomes: {
      ideal: 'Flood & Over-Top overloaded the wing at two depths and floated a pass right over the 3-player Wall for the goal!',
      middle: 'Patient swings stretched the 2-3-2 Wall enough to slip a pass through for solid yards.',
      worst: 'Running standard 1v1 Force-Side Cuts straight into a stationary 3-player Wall led to an easy zone pick!'
    }
  },

  bot_zone_box1: {
    id: 'bot_zone_box1',
    name: 'Box-and-1 Junk',
    coverageType: 'zone_box1',
    tag: 'CHASER + BOX',
    hint: '1 chaser locked onto your reset handler while 4 defenders formed a midfield Box — arc an Overhead Hammer over the Box!',
    scoutShape: 'bot_box1',
    forceStyle: 'directional',
    matchups: {
      overhead_hammer: 'ideal',
      pop_swing: 'middle',
      zone_flood: 'middle',
      upline_strike: 'middle',
      force_cuts: 'middle',
      break_swing: 'middle',
      give_go: 'middle',
      deep_huck: 'middle',
      dump_swing: 'worst'
    },
    defaultHand: ['overhead_hammer', 'pop_swing', 'zone_flood', 'dump_swing'],
    outcomes: {
      ideal: 'Overhead Hammer soared upside-down right over the 4-defender Box into the uncovered weak-side corner — Goal!',
      middle: 'Patient cuts worked around the Box-and-1 chaser for a steady 24-yard gain.',
      worst: 'Throwing a casual Dump-Swing straight toward their `CH1` lockdown chaser got jumped for a turnover!'
    }
  }
};

// ===================== MULTI-LEVEL WIND ENGINE =====================

/**
 * Rolls wind conditions for the upcoming point:
 *   strength: 'calm' (0 mph) | 'breezy' (9-12 mph) | 'stiff' (18-22 mph)
 *   dir: 'north' (+y Upfield ▲) | 'south' (-y Downfield ▼) | 'west' (-x Home ◀) | 'east' (+x Away ▶)
 */
export function rollPointWind(rng = Math.random) {
  const r = rng();
  if (r < 0.34) {
    return {
      strength: 'calm',
      dir: 'north',
      mph: 0,
      dx: 0,
      dy: 0
    };
  }

  const dirs = [
    { dir: 'north', dx: 0, dy: 1 },  // Blowing ▲ toward Top End Zone
    { dir: 'south', dx: 0, dy: -1 }, // Blowing ▼ toward Bottom End Zone
    { dir: 'west', dx: -1, dy: 0 },  // Blowing ◀ toward Home Sideline
    { dir: 'east', dx: 1, dy: 0 }    // Blowing ▶ toward Away Sideline
  ];
  const chosenDir = dirs[Math.floor(rng() * dirs.length)];

  if (r < 0.72) {
    const mph = 9 + Math.floor(rng() * 4); // 9..12 mph
    return {
      strength: 'breezy',
      dir: chosenDir.dir,
      mph,
      dx: chosenDir.dx,
      dy: chosenDir.dy
    };
  }

  const mph = 18 + Math.floor(rng() * 5); // 18..22 mph
  return {
    strength: 'stiff',
    dir: chosenDir.dir,
    mph,
    dx: chosenDir.dx,
    dy: chosenDir.dy
  };
}

/**
 * Formats a crisp, kid/coach-friendly Wind Badge relative to who currently has the disc!
 *   Player attacks +y (north); Bot attacks -y (south).
 */
export function formatWindBadge(wind, possession = 'bot') {
  if (!wind || wind.strength === 'calm') {
    return { text: '🍃 Calm', tone: 'calm', rel: 'calm' };
  }

  const icon = wind.strength === 'stiff' ? '💨' : '🌬️';
  const tierWord = wind.strength === 'stiff' ? 'Stiff' : 'Breezy';

  if (wind.dir === 'west') {
    return {
      text: `${icon} ${tierWord} ${wind.mph}mph ◀ Home`,
      tone: wind.strength,
      rel: 'cross_home'
    };
  }
  if (wind.dir === 'east') {
    return {
      text: `${icon} ${tierWord} ${wind.mph}mph ▶ Away`,
      tone: wind.strength,
      rel: 'cross_away'
    };
  }

  // Upfield ('north') or Downfield ('south'):
  const offenseGoingUpwind =
    (possession === 'player' && wind.dir === 'south') ||
    (possession === 'bot' && wind.dir === 'north');

  const arrow = wind.dir === 'north' ? '▲' : '▼';
  if (possession === 'player') {
    return {
      text: `${icon} ${wind.mph}mph ${arrow} ${offenseGoingUpwind ? 'Headwind' : 'Tailwind'}`,
      tone: wind.strength,
      rel: offenseGoingUpwind ? 'headwind' : 'tailwind'
    };
  }
  return {
    text: `${icon} ${wind.mph}mph ${arrow} ${offenseGoingUpwind ? 'Bot Upwind' : 'Bot Tailwind'}`,
    tone: wind.strength,
    rel: offenseGoingUpwind ? 'bot_upwind' : 'bot_tailwind'
  };
}

/**
 * Computes the effective tactical matchups, hints, and outcomes when Wind is active!
 * Guarantees at least 1 'ideal', >=2 'middle', and >=1 'worst' in every look.
 */
export function getEffectiveLook(baseLookObj, wind, isPlayerOffense = false, discX = 0) {
  const matchups = { ...baseLookObj.matchups };
  const defaultHand = [...baseLookObj.defaultHand];
  let hint = baseLookObj.hint;
  const outcomes = { ...baseLookObj.outcomes };

  if (!wind || wind.strength === 'calm') {
    return { ...baseLookObj, matchups, defaultHand, hint, outcomes };
  }

  const setNewIdeal = (newIdealId, windHint, windIdealOutcome) => {
    for (const k of Object.keys(matchups)) {
      if (matchups[k] === 'ideal') matchups[k] = 'middle';
    }
    matchups[newIdealId] = 'ideal';
    if (!defaultHand.includes(newIdealId)) {
      defaultHand[0] = newIdealId;
    }
    hint = windHint;
    outcomes.ideal = windIdealOutcome;
  };

  if (isPlayerOffense) {
    // Player attacks +y ('north'). 'south' wind = Headwind; 'north' wind = Tailwind!
    const isHeadwind = wind.dir === 'south';
    const isTailwind = wind.dir === 'north';

    if (isHeadwind && wind.strength === 'breezy') {
      // In a breezy headwind, upside-down Overhead Hammers get risky if they weren't already ideal
      if (matchups.overhead_hammer !== 'ideal') {
        matchups.overhead_hammer = 'worst';
        outcomes.worst = `🌬️ The ${wind.mph} mph headwind caught the floaty throw and pushed it off target — Turnover!`;
      }
      hint = `${baseLookObj.hint} (🌬️ ${wind.mph}mph Headwind: avoid floaty hammers!)`;
    } else if (isHeadwind && wind.strength === 'stiff') {
      // Stiff 20mph Headwind! High hucks & overhead hammers pop up and blow backward!
      matchups.deep_huck = 'worst';
      matchups.overhead_hammer = 'worst';
      if (!defaultHand.includes('deep_huck') && !defaultHand.includes('overhead_hammer')) {
        defaultHand[defaultHand.length - 1] = 'deep_huck';
      }
      outcomes.worst = `💨 Stiff ${wind.mph} mph Headwind popped the high pass up in mid-air and blew it backward into an interception!`;

      // If base ideal was deep_huck, overhead_hammer, or zone_flood, shift Ideal to crisp low wind-cutting!
      if (baseLookObj.id === 'bot_man_press') {
        setNewIdeal(
          'upline_strike',
          `💨 STIFF ${wind.mph}mph HEADWIND: Too windy to huck deep! Slice past their tight press with a low Upline Strike Cut!`,
          `💨 Smart wind offense! Upline Strike Cut lasered low under the ${wind.mph} mph headwind to beat the press for a Goal!`
        );
      } else if (baseLookObj.id === 'bot_zone_box1') {
        setNewIdeal(
          'pop_swing',
          `💨 STIFF ${wind.mph}mph HEADWIND: Too windy for an Overhead Hammer! Work low through the Box with Popper & Wing Swing!`,
          `💨 Textbook wind play! Popper & Wing Swing zipped crisp low passes beneath the ${wind.mph} mph gusts to beat Box-and-1!`
        );
      } else {
        hint = `💨 ${wind.mph}mph Headwind (No Hucks/Hammers!) — ${baseLookObj.hint}`;
      }
    } else if (isTailwind && wind.strength === 'stiff') {
      // Stiff Tailwind! Deep shots fly like rockets when there's no Deep Poach!
      if (baseLookObj.id === 'bot_man_open') {
        setNewIdeal(
          'deep_huck',
          `💨 STIFF ${wind.mph}mph TAILWIND: The wind is at your back against single 1v1 Man — unleash a Deep ISO Huck!`,
          `💨 Carried by the ${wind.mph} mph tailwind, Deep ISO Huck rocketed 50 yards in stride for an unstoppable score!`
        );
      } else {
        hint = `💨 ${wind.mph}mph Tailwind at your back — ${baseLookObj.hint}`;
      }
    } else if ((wind.dir === 'west' || wind.dir === 'east') && wind.strength === 'stiff') {
      const dirName = wind.dir === 'west' ? 'Home (◀)' : 'Away (▶)';
      hint = `💨 Stiff ${wind.mph}mph Crosswind pushing toward ${dirName} — ${baseLookObj.hint}`;
    }
  } else {
    // Player on DEFENSE (Bot attacks -y 'south'). 'north' wind = Bot going UPWIND! 'south' wind = Bot has TAILWIND!
    const botGoingUpwind = wind.dir === 'north';
    const botHasTailwind = wind.dir === 'south';

    if (botGoingUpwind && wind.strength === 'stiff') {
      // Classic Ultimate rule: When opponent goes into a Stiff Headwind, ZONE (3-Person Cup) dominates stacks!
      matchups.deep_poach = 'worst';
      outcomes.worst = `💨 Bot couldn’t huck into a ${wind.mph} mph headwind anyway — sagging Deep Poach gave them free short passes for a score!`;

      if (['vert_stack', 'side_iso', 'split_stack'].includes(baseLookObj.id)) {
        setNewIdeal(
          'cup_zone',
          `💨 STIFF ${wind.mph}mph HEADWIND IN BOT’S FACE: They can’t throw over the top — trap them in a 3-Person Cup Zone!`,
          `💨 Classic Wind Zone! Against a ${wind.mph} mph headwind, your 3-Person Cup forced a wobbly upwind pass into an easy block!`
        );
      } else {
        hint = `💨 Bot is going into a ${wind.mph}mph Headwind — ${baseLookObj.hint}`;
      }
    } else if (botHasTailwind && wind.strength === 'stiff') {
      // Bot has a roaring 20mph Tailwind — watch the deep huck!
      matchups.shutdown_reset = 'worst';
      outcomes.worst = `💨 With a ${wind.mph} mph tailwind at their back, blitzing the handler gave up an effortless 50-yard downwind bomb!`;

      if (['ho_stack', 'split_stack'].includes(baseLookObj.id)) {
        setNewIdeal(
          'deep_poach',
          `💨 BOT HAS A ${wind.mph}mph TAILWIND: Their handlers are hunting a downwind bomb — drop a Deep Poach safety!`,
          `💨 Clutch read! Deep Poach tracked down the wind-boosted huck in the end zone for a huge interception!`
        );
      } else if (baseLookObj.id === 'handler_weave') {
        setNewIdeal(
          'clam_bracket',
          `💨 BOT HAS A ${wind.mph}mph TAILWIND: Blitzing Handler Weave risks a downwind bomb — play Clam Bracket to cover short & deep!`,
          `💨 Smart wind discipline! Clam Bracket contained Handler Weave underneath while taking away the tailwind deep shot!`
        );
      } else {
        hint = `💨 Bot has a ${wind.mph}mph Tailwind — ${baseLookObj.hint}`;
      }
    } else if ((wind.dir === 'west' || wind.dir === 'east') && wind.strength === 'stiff') {
      const pinnedDownwind = (wind.dir === 'west' && discX < -4) || (wind.dir === 'east' && discX > 4);
      if (pinnedDownwind && baseLookObj.id !== 'ho_stack') {
        setNewIdeal(
          'sideline_trap',
          `💨 STIFF ${wind.mph}mph CROSSWIND pinning Bot on the downwind sideline — lock on Sideline Trap!`,
          `💨 Crosswind + Sideline Trap! The ${wind.mph} mph gusts pushed their escape pass right out of bounds — Turnover!`
        );
      }
    }
  }

  return { ...baseLookObj, matchups, defaultHand, hint, outcomes };
}

/**
 * Selects a contextually authentic Bot Defense + Force ('home' or 'away') + Player Base Stack ('vert' or 'ho').
 */
export function rollBotDefenseState({ discX, prevDefId = null, prevStack = 'vert', isAdvance = false, wind = null, rng = Math.random }) {
  const baseStack = isAdvance ? prevStack : (rng() < 0.56 ? 'vert' : 'ho');
  const nearSideline = Math.abs(discX) >= 5.5;
  let defId = prevDefId;

  if (!isAdvance || !prevDefId || rng() < 0.55) {
    const candidates = Object.keys(BOT_DEFENSES).filter((id) => {
      if (id === prevDefId) return false;
      if (id === 'bot_man_trap' && !nearSideline) return false;
      return true;
    });

    // If Player is going into a Stiff Headwind ('south'), Bot loves throwing Cup or Wall Zone slightly more often!
    if (wind && wind.strength === 'stiff' && wind.dir === 'south' && rng() < 0.42) {
      const zoneOpts = candidates.filter((id) => id.startsWith('bot_zone_'));
      if (zoneOpts.length > 0) {
        defId = zoneOpts[Math.floor(rng() * zoneOpts.length)];
      }
    }
    if (!defId || defId === prevDefId) {
      defId = candidates[Math.floor(rng() * candidates.length)];
    }
  } else if (defId === 'bot_man_trap' && !nearSideline) {
    defId = 'bot_man_open';
  }

  let forceSide;
  if (defId === 'bot_man_trap') {
    forceSide = discX < 0 ? 'home' : 'away';
  } else if (defId === 'bot_man_middle') {
    // Force toward the center of the field!
    forceSide = discX <= 0 ? 'away' : 'home';
  } else if (defId === 'bot_man_open') {
    if (discX > 3.5) forceSide = 'home';
    else if (discX < -3.5) forceSide = 'away';
    else forceSide = rng() < 0.5 ? 'home' : 'away';
  } else {
    forceSide = rng() < 0.5 ? 'home' : 'away';
  }

  return { defId, forceSide, baseStack };
}

/**
 * Builds a balanced 4-card hand from our 9-card catalog:
 *   - Fresh read: ALWAYS 1 'ideal', 2 'middle' (varied across the 9-card pool!), and 1 'worst'.
 *   - Advance read: Slot 0 is 'Keep' + 3 switch options guaranteed to include 'ideal'.
 */
export function buildDecisionHand(lookObj, strategyCatalog, keepStrategyId = null, rng = Math.random) {
  const allIds = Object.keys(strategyCatalog);
  const idealIds = allIds.filter((id) => lookObj.matchups[id] === 'ideal');
  const worstIds = allIds.filter((id) => lookObj.matchups[id] === 'worst');
  const middleIds = allIds.filter((id) => lookObj.matchups[id] === 'middle');

  const idealId = idealIds[0];
  // Prefer a 'worst' card listed in defaultHand if present, otherwise pick randomly among worstIds
  const preferredWorst = worstIds.filter((id) => lookObj.defaultHand.includes(id));
  const worstPool = preferredWorst.length > 0 ? preferredWorst : worstIds;
  const worstId = worstPool[Math.floor(rng() * worstPool.length)];

  if (!keepStrategyId || !strategyCatalog[keepStrategyId]) {
    // Pick 2 middle cards: 1 from defaultHand (for thematic flavor) + 1 shuffled from the full middle pool for match variety!
    const defMiddles = middleIds.filter((id) => lookObj.defaultHand.includes(id));
    const chosenMiddles = [];

    if (defMiddles.length > 0) {
      chosenMiddles.push(defMiddles[Math.floor(rng() * defMiddles.length)]);
    }
    const remMiddles = middleIds.filter((id) => !chosenMiddles.includes(id));
    while (chosenMiddles.length < 2 && remMiddles.length > 0) {
      const pickIdx = Math.floor(rng() * remMiddles.length);
      chosenMiddles.push(remMiddles.splice(pickIdx, 1)[0]);
    }

    const handIds = [idealId, ...chosenMiddles, worstId];
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

  // Midfield advance hand: Slot 0 is Keep, plus 3 switch options including Ideal and Worst
  const switchPool = [];
  if (idealId && idealId !== keepStrategyId) switchPool.push(idealId);
  if (worstId && worstId !== keepStrategyId && switchPool.length < 3) switchPool.push(worstId);

  const shuffledMiddles = [...middleIds].filter((id) => id !== keepStrategyId && !switchPool.includes(id));
  for (let i = shuffledMiddles.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledMiddles[i], shuffledMiddles[j]] = [shuffledMiddles[j], shuffledMiddles[i]];
  }
  for (const id of shuffledMiddles) {
    if (switchPool.length < 3) switchPool.push(id);
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
