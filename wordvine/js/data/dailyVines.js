/**
 * Word Vine — Curated Daily Vines & Anti-Ambiguity Compound Lexicon
 * Shared between Browser Client, Admin Vine Studio (admin.html), and Node.js Server.
 *
 * All chains strictly follow the playtest-verified Pure Forward-Compound Ramp:
 * - Zone 1 (Nodes 1-12):  3-Part Triplets + Bridges (45 -> 95 u/s) | Thematic Noun Decoys
 * - Zone 2 (Nodes 13-28): 2-Part Double-Meaning Pivots (95 -> 185 u/s) | Synonym/Previous-Sense Decoys
 * - Zone 3 (Nodes 29+):   2-Part Particle Sprints (185 -> 280 u/s) | Reverse-Compound & 1-Letter Traps
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WordVineData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Known forward compounds & two-word lexical phrases used by the Anti-Ambiguity Validator
   * to guarantee that (stemWord + decoyWord) never accidentally forms a valid forward compound.
   */
  const KNOWN_FORWARD_COMPOUNDS = new Set([
    'SUNFLOWER', 'FLOWERPOT', 'POTHOLE', 'HOLEIN', 'INONE', 'ONEDAY', 'DAYDREAM',
    'DREAMCATCHER', 'CATCHERMITT', 'MITTSUN', 'PEANUTBUTTER', 'BUTTERCUP', 'CUPCAKE',
    'CAKEWALK', 'WALKOUT', 'OUTCOLD', 'COLDSHOULDER', 'SHOULDERBLADE', 'BLADERUNNER',
    'RUNNERBEAN', 'BEANSTALK', 'GOLDMINE', 'MINESHAFT', 'SHAFTLIGHT', 'LIGHTHOUSE',
    'HOUSEBOAT', 'BOATLOAD', 'LOADSTONE', 'STONEWALL', 'WALLPAPER', 'PAPERCLIP',
    'CLIPBOARD', 'BOARDWALK', 'WALKWAY', 'WAYOUT', 'OUTBREAK', 'BREAKDOWN',
    'DOWNPOUR', 'POUROVER', 'OVERTURN', 'TURNBACK', 'BACKFIRE', 'FIREWORK',
    'WORKOUT', 'OUTSHINE', 'SHINESUN', 'ICECREAM', 'CREAMCONE', 'CONEPINE',
    'PINEAPPLE', 'APPLEPIE', 'PIECHART', 'CHARTROOM', 'ROOMMATE', 'MATECHECK',
    'MATCHBOX', 'BOXCAR', 'CARPOOL', 'POOLTABLE', 'TABLETOP', 'TOPDOG',
    'DOGHOUSE', 'HOUSEFLY', 'FLYTRAP', 'TRAPDOOR', 'DOORBELL', 'BELLHOP',
    'HOPSCOTCH', 'SCOTCHTAPE', 'TAPEDECK', 'DECKCHAIR', 'CHAIRLIFT', 'LIFTOFF',
    'OFFBEAT', 'BEATDOWN', 'DOWNFALL', 'FALLOUT', 'OUTPOST', 'POSTOFFICE',
    'OFFICEBOX', 'BOXSPRING', 'SPRINGBOARD', 'BOARDGAME', 'GAMEPLAN', 'PLANB',
    'HOTAIR', 'AIRBALLOON', 'BALLOONPOP', 'POPCORN', 'CORNSTALK', 'STALKMARKET',
    'GOLDFISH', 'FISHBOWL', 'BOWLCUT', 'CUTBACK', 'BACKDROP', 'DROPOUT',
    'PICKME', 'MEUP', 'UPBEAT', 'BEATBOX', 'BOXOFFICE', 'OFFICEHOUR',
    'HOURGLASS', 'GLASSJAW', 'JAWBONE', 'BONEDRY', 'DRYDOCK', 'DOCKYARD',
    'YARDSTICK', 'STICKSHIFT', 'SHIFTDOWN', 'DOWNTURN', 'TURNOVER', 'OVERCAST',
    'CASTOFF', 'OFFSHOOT', 'SHOOTOUT', 'OUTRUN', 'RUNAWAY', 'AWAYGAME',
    'DEADPAN', 'PANCAKE', 'FIRETRUCK', 'FIREPLACE', 'CAMPFIRE', 'JELLYBEAN',
    'BUTTERFLY', 'SUNBURN', 'SUNLIGHT', 'MOONLIGHT', 'STARLIGHT', 'FLASHLIGHT',
    'BACKSTAGE', 'BACKYARD', 'BACKBONE', 'BACKPACK', 'OVERTIME', 'OVERLOAD',
    'OVERBOARD', 'UNDERDOG', 'UNDERGROUND', 'UPTOWN', 'UPSTREAM', 'DOWNSTREAM',
    'DOWNLOAD', 'UPLOAD', 'OUTSIDE', 'INSIDE', 'SIDEWALK', 'SIDELINE', 'LINEBACKER'
  ]);

  /**
   * Helper to build a structured VineNode
   */
  function node(
    index,
    stemWord,
    correctWord,
    decoyWord,
    leftRightSeed,
    zoneId,
    edgeType,
    tripletStep,
    compoundHint,
    trapExplanation
  ) {
    return {
      index,
      stemWord: stemWord.toUpperCase(),
      correctWord: correctWord.toUpperCase(),
      decoyWord: decoyWord.toUpperCase(),
      leftRightSeed: leftRightSeed === 1 ? 1 : 0,
      zoneId,
      edgeType,
      tripletStep,
      compoundHint,
      explanation: trapExplanation
    };
  }

  /**
   * 3 Complete, Playtest-Balanced Daily Vines (40 Nodes each)
   * Rotating across the 3 HD Botanical Themes:
   * - Day 1 (themeId: 0): Midnight Bioluminescence
   * - Day 2 (themeId: 1): Sunlit Conservatory
   * - Day 3 (themeId: 2): Ukiyo-e Ink & Sakura
   */
  const PRODUCTION_DAILY_VINES = [
    {
      vineNumber: 142,
      dateKey: '2026-11-01',
      title: 'The Midnight Circuit',
      themeId: 0, // Midnight Bioluminescence
      startWord: 'PEANUT',
      nodes: [
        // ================= ZONE 1: THE ROOTS (Nodes 1-12 | 3-Part Triplets) =================
        // Triplet 1: PEANUT -> BUTTER -> CUP -> CAKE
        node(0, 'PEANUT', 'BUTTER', 'SHELL', 0, 1, 'triplet_1_2', 1, 'Peanut butter', 'PEANUT + BUTTER forms the classic forward compound; SHELL is a thematic nut noun.'),
        node(1, 'BUTTER', 'CUP', 'CHURN', 1, 1, 'triplet_2_3', 2, 'Peanut butter cup', 'BUTTER + CUP completes Peanut Butter Cup; CHURN is a dairy association.'),
        node(2, 'CUP', 'CAKE', 'SAUCER', 0, 1, 'triplet_2_3', 3, 'Buttercup -> Cupcake (Triple-Bloom!)', 'CUP + CAKE forms Cupcake and blooms Triplet #1; SAUCER is a dishware cousin.'),

        // Triplet 2: CAKE -> MIX -> UP -> BEAT
        node(3, 'CAKE', 'MIX', 'OVEN', 1, 1, 'triplet_1_2', 1, 'Cake mix', 'CAKE + MIX is a forward compound noun; OVEN is kitchen equipment.'),
        node(4, 'MIX', 'UP', 'SPOON', 0, 1, 'triplet_2_3', 2, 'Mix-up', 'MIX + UP forms Mix-up; SPOON is a mixing tool decoy.'),
        node(5, 'UP', 'BEAT', 'STAIRS', 1, 1, 'triplet_2_3', 3, 'Pick-me-up / Upbeat (Triple-Bloom!)', 'UP + BEAT forms Upbeat and blooms Triplet #2!'),

        // Triplet 3: BEAT -> BOX -> CAR -> POOL
        node(6, 'BEAT', 'BOX', 'DRUM', 0, 1, 'triplet_1_2', 1, 'Beatbox', 'BEAT + BOX forms Beatbox; DRUM is a musical association trap.'),
        node(7, 'BOX', 'CAR', 'TAPE', 1, 1, 'triplet_2_3', 2, 'Boxcar', 'BOX + CAR forms Boxcar; TAPE is a packing supply noun.'),
        node(8, 'CAR', 'POOL', 'TIRE', 0, 1, 'triplet_2_3', 3, 'Boxcar -> Carpool (Triple-Bloom!)', 'CAR + POOL forms Carpool and blooms Triplet #3; TIRE is an auto part.'),

        // Triplet 4: POOL -> TABLE -> TOP -> DOG
        node(9, 'POOL', 'TABLE', 'TOWEL', 1, 1, 'triplet_1_2', 1, 'Pool table', 'POOL + TABLE forms Pool table; TOWEL is a poolside noun.'),
        node(10, 'TABLE', 'TOP', 'CHAIR', 0, 1, 'triplet_2_3', 2, 'Tabletop', 'TABLE + TOP forms Tabletop (Rising Sap Warning for Zone 2!).'),
        node(11, 'TOP', 'DOG', 'HATTER', 1, 1, 'triplet_2_3', 3, 'Tabletop -> Top dog (Triple-Bloom!)', 'TOP + DOG forms Top dog and launches into the Zone 2 Graft Collar!'),

        // ================= ZONE 2: THE STEM (Nodes 13-28 | 2-Part Double-Meaning Pivots) =================
        node(12, 'DOG', 'HOUSE', 'BARK', 0, 2, 'pivot_2', 0, 'Doghouse', 'DOG + HOUSE = Doghouse; BARK baits the canine meaning from Top dog.'),
        node(13, 'HOUSE', 'FLY', 'ROOF', 1, 2, 'pivot_2', 0, 'Housefly', 'HOUSE + FLY = Housefly; ROOF baits the building sense of Doghouse.'),
        node(14, 'FLY', 'TRAP', 'WINGS', 1, 2, 'pivot_2', 0, 'Flytrap', 'FLY + TRAP = Flytrap; WINGS baits the insect meaning of Housefly.'),
        node(15, 'TRAP', 'DOOR', 'SNARE', 0, 2, 'pivot_2', 0, 'Trapdoor', 'TRAP + DOOR = Trapdoor; SNARE is a synonym for trap.'),
        node(16, 'DOOR', 'BELL', 'HINGE', 1, 2, 'pivot_2', 0, 'Doorbell', 'DOOR + BELL = Doorbell; HINGE is hardware on a physical door.'),
        node(17, 'BELL', 'HOP', 'CHIME', 0, 2, 'pivot_2', 0, 'Bellhop', 'BELL + HOP = Bellhop; CHIME baits the ringing sound of Doorbell.'),
        node(18, 'HOP', 'SCOTCH', 'JUMP', 0, 2, 'pivot_2', 0, 'Hopscotch', 'HOP + SCOTCH = Hopscotch; JUMP is a synonym for hop.'),
        node(19, 'SCOTCH', 'TAPE', 'WHISKY', 1, 2, 'pivot_2', 0, 'Scotch tape', 'SCOTCH + TAPE = Scotch tape; WHISKY is a drink synonym trap.'),
        node(20, 'TAPE', 'DECK', 'GLUE', 0, 2, 'pivot_2', 0, 'Tape deck', 'TAPE + DECK = Tape deck; GLUE baits the sticky sense of Scotch tape.'),
        node(21, 'DECK', 'CHAIR', 'STEREO', 1, 2, 'pivot_2', 0, 'Deck chair', 'DECK + CHAIR = Deck chair; STEREO baits the audio sense of Tape deck.'),
        node(22, 'CHAIR', 'LIFT', 'SOFA', 0, 2, 'pivot_2', 0, 'Chairlift', 'CHAIR + LIFT = Chairlift; SOFA is a furniture synonym trap.'),
        node(23, 'LIFT', 'OFF', 'HEAVY', 1, 2, 'pivot_2', 0, 'Liftoff', 'LIFT + OFF = Liftoff; HEAVY baits the weight-lifting meaning.'),
        node(24, 'OFF', 'SHOOT', 'SWITCH', 0, 2, 'pivot_2', 0, 'Offshoot', 'OFF + SHOOT = Offshoot; SWITCH is an on/off association.'),
        node(25, 'SHOOT', 'OUT', 'LEAF', 1, 2, 'pivot_2', 0, 'Shootout', 'SHOOT + OUT = Shootout; LEAF baits the plant sense of Offshoot.'),
        node(26, 'OUT', 'COLD', 'DUEL', 0, 2, 'pivot_2', 0, 'Out cold', 'OUT + COLD = Out cold; DUEL baits the Western sense of Shootout.'),
        node(27, 'COLD', 'SHOULDER', 'ICE', 1, 2, 'pivot_2', 0, 'Cold shoulder', 'COLD + SHOULDER = Cold shoulder; ICE baits the temperature sense of Out cold!'),

        // ================= ZONE 3: THE CANOPY (Nodes 29-40 | 2-Part Particle Sprints) =================
        node(28, 'SHOULDER', 'BLADE', 'SHRUG', 0, 3, 'particle_2', 0, 'Shoulder blade', 'SHOULDER + BLADE = Shoulder blade; SHRUG baits the gesture of Cold shoulder.'),
        node(29, 'BLADE', 'RUNNER', 'SWORD', 1, 3, 'particle_2', 0, 'Blade runner', 'BLADE + RUNNER = Blade runner; SWORD is a weapon synonym.'),
        node(30, 'RUNNER', 'UP', 'JOG', 0, 3, 'particle_2', 0, 'Runner-up', 'RUNNER + UP = Runner-up; JOG is a slow synonym trap.'),
        node(31, 'UP', 'TURN', 'DOWN', 1, 3, 'particle_2', 0, 'Upturn', 'UP + TURN = Upturn; DOWN is an antonym reflex trap.'),
        node(32, 'TURN', 'OVER', 'SPIN', 0, 3, 'particle_2', 0, 'Turnover', 'TURN + OVER = Turnover; SPIN is a synonym decoy.'),
        node(33, 'OVER', 'CAST', 'ABOVE', 1, 3, 'particle_2', 0, 'Overcast', 'OVER + CAST = Overcast; ABOVE is a preposition synonym.'),
        node(34, 'CAST', 'OFF', 'AWAY', 0, 3, 'particle_2', 0, 'Castoff', 'CAST + OFF = Castoff; Castaway uses AWAY, not plain AWAY at sprint speed.'),
        node(35, 'OFF', 'LINE', 'WIRE', 1, 3, 'particle_2', 0, 'Offline', 'OFF + LINE = Offline; WIRE is a visual distractor.'),
        node(36, 'LINE', 'BACK', 'ROPE', 0, 3, 'particle_2', 0, 'Linebacker / Line back', 'LINE + BACK = Lineback; ROPE baits the cord meaning of Line.'),
        node(37, 'BACK', 'FIRE', 'TIRE', 1, 3, 'particle_2', 0, 'Backfire', 'BACK + FIRE = Backfire; TIRE is a 1-letter phonetic lookalike trap!'),
        node(38, 'FIRE', 'WORK', 'CAMP', 0, 3, 'particle_2', 0, 'Firework', 'FIRE + WORK = Firework; CAMP is a reverse-compound trap (Campfire is backwards!).'),
        node(39, 'WORK', 'OUT', 'JOB', 1, 3, 'particle_2', 0, 'Workout (Daily Canopy Cleared!)', 'WORK + OUT = Workout to conquer the Midnight Canopy!')
      ]
    },
    {
      vineNumber: 143,
      dateKey: '2026-11-02',
      title: 'The Conservatory Loop',
      themeId: 1, // Sunlit Conservatory
      startWord: 'SUN',
      nodes: [
        // ================= ZONE 1: THE ROOTS (Nodes 1-12 | 3-Part Triplets) =================
        // Triplet 1: SUN -> FLOWER -> POT -> HOLE
        node(0, 'SUN', 'FLOWER', 'ORBIT', 1, 1, 'triplet_1_2', 1, 'Sunflower', 'SUN + FLOWER = Sunflower; ORBIT is an astronomy noun.'),
        node(1, 'FLOWER', 'POT', 'PETAL', 0, 1, 'triplet_2_3', 2, 'Flowerpot', 'FLOWER + POT = Flowerpot; PETAL is a botanical part.'),
        node(2, 'POT', 'HOLE', 'PAN', 1, 1, 'triplet_2_3', 3, 'Flowerpot -> Pothole (Triple-Bloom!)', 'POT + HOLE = Pothole and blooms Triplet #1!'),

        // Triplet 2: HOLE -> IN -> ONE -> DAY
        node(3, 'HOLE', 'IN', 'DIG', 0, 1, 'triplet_1_2', 1, 'Hole in...', 'HOLE + IN launches Hole-in-one; DIG is a verb association.'),
        node(4, 'IN', 'ONE', 'TWO', 1, 1, 'triplet_2_3', 2, 'Hole in one', 'IN + ONE completes Hole-in-one!'),
        node(5, 'ONE', 'DAY', 'FIRST', 0, 1, 'triplet_2_3', 3, 'One day (Triple-Bloom!)', 'ONE + DAY forms One day and blooms Triplet #2!'),

        // Triplet 3: DAY -> DREAM -> BOAT -> LOAD
        node(6, 'DAY', 'DREAM', 'NOON', 1, 1, 'triplet_1_2', 1, 'Daydream', 'DAY + DREAM = Daydream; NOON is a time of day noun.'),
        node(7, 'DREAM', 'BOAT', 'SLEEP', 0, 1, 'triplet_2_3', 2, 'Dreamboat', 'DREAM + BOAT = Dreamboat; SLEEP baits the slumber meaning.'),
        node(8, 'BOAT', 'LOAD', 'OAR', 1, 1, 'triplet_2_3', 3, 'Dreamboat -> Boatload (Triple-Bloom!)', 'BOAT + LOAD = Boatload and blooms Triplet #3!'),

        // Triplet 4: LOAD -> STONE -> WALL -> PAPER
        node(9, 'LOAD', 'STONE', 'TRUCK', 0, 1, 'triplet_1_2', 1, 'Loadstone', 'LOAD + STONE = Loadstone; TRUCK baits cargo hauling.'),
        node(10, 'STONE', 'WALL', 'PEBBLE', 1, 1, 'triplet_2_3', 2, 'Stonewall', 'STONE + WALL = Stonewall (Rising Sap Warning for Zone 2!).'),
        node(11, 'WALL', 'PAPER', 'BRICK', 0, 1, 'triplet_2_3', 3, 'Stonewall -> Wallpaper (Triple-Bloom!)', 'WALL + PAPER = Wallpaper and crosses into Zone 2!'),

        // ================= ZONE 2: THE STEM (Nodes 13-28 | 2-Part Pivots) =================
        node(12, 'PAPER', 'CLIP', 'PEN', 1, 2, 'pivot_2', 0, 'Paperclip', 'PAPER + CLIP = Paperclip; PEN is stationery bait.'),
        node(13, 'CLIP', 'BOARD', 'TRIM', 0, 2, 'pivot_2', 0, 'Clipboard', 'CLIP + BOARD = Clipboard; TRIM is a verb synonym for clip.'),
        node(14, 'BOARD', 'WALK', 'CHALK', 1, 2, 'pivot_2', 0, 'Boardwalk', 'BOARD + WALK = Boardwalk; CHALK is a reverse compound (Chalkboard).'),
        node(15, 'WALK', 'OUT', 'STROLL', 0, 2, 'pivot_2', 0, 'Walkout', 'WALK + OUT = Walkout; STROLL is a walking synonym.'),
        node(16, 'OUT', 'POST', 'EXIT', 1, 2, 'pivot_2', 0, 'Outpost', 'OUT + POST = Outpost; EXIT baits the leaving meaning of Walkout.'),
        node(17, 'POST', 'OFFICE', 'FENCE', 0, 2, 'pivot_2', 0, 'Post office', 'POST + OFFICE = Post office; FENCE is a reverse compound (Fencepost).'),
        node(18, 'OFFICE', 'BOX', 'DESK', 1, 2, 'pivot_2', 0, 'Office box / Box office', 'OFFICE + BOX connects to Boxspring; DESK is furniture bait.'),
        node(19, 'BOX', 'SPRING', 'CRATE', 0, 2, 'pivot_2', 0, 'Box spring', 'BOX + SPRING = Box spring; CRATE is a synonym for box.'),
        node(20, 'SPRING', 'TIME', 'COIL', 1, 2, 'pivot_2', 0, 'Springtime', 'SPRING + TIME = Springtime; COIL baits the mattress meaning of Box spring.'),
        node(21, 'TIME', 'LINE', 'CLOCK', 0, 2, 'pivot_2', 0, 'Timeline', 'TIME + LINE = Timeline; CLOCK is a timepiece noun.'),
        node(22, 'LINE', 'UP', 'QUEUE', 1, 2, 'pivot_2', 0, 'Lineup', 'LINE + UP = Lineup; QUEUE is a British synonym.'),
        node(23, 'UP', 'STREAM', 'HIGH', 0, 2, 'pivot_2', 0, 'Upstream', 'UP + STREAM = Upstream; HIGH is a height synonym.'),
        node(24, 'STREAM', 'LINE', 'RIVER', 1, 2, 'pivot_2', 0, 'Streamline', 'STREAM + LINE = Streamline; RIVER baits the water sense of Upstream.'),
        node(25, 'LINE', 'BACK', 'CORD', 0, 2, 'pivot_2', 0, 'Lineback', 'LINE + BACK = Lineback; CORD is a string synonym.'),
        node(26, 'BACK', 'BONE', 'FRONT', 1, 2, 'pivot_2', 0, 'Backbone', 'BACK + BONE = Backbone; FRONT is an antonym reflex trap.'),
        node(27, 'BONE', 'DRY', 'SKULL', 0, 2, 'pivot_2', 0, 'Bone-dry', 'BONE + DRY = Bone-dry; SKULL baits the skeletal sense of Backbone!'),

        // ================= ZONE 3: THE CANOPY (Nodes 29-40 | 2-Part Particle Sprints) =================
        node(28, 'DRY', 'DOCK', 'WET', 1, 3, 'particle_2', 0, 'Drydock', 'DRY + DOCK = Drydock; WET is an antonym trap.'),
        node(29, 'DOCK', 'YARD', 'PIER', 0, 3, 'particle_2', 0, 'Dockyard', 'DOCK + YARD = Dockyard; PIER baits the harbor sense of Drydock.'),
        node(30, 'YARD', 'STICK', 'LAWN', 1, 3, 'particle_2', 0, 'Yardstick', 'YARD + STICK = Yardstick; LAWN baits the grass meaning of Yard.'),
        node(31, 'STICK', 'SHIFT', 'TWIG', 0, 3, 'particle_2', 0, 'Stick shift', 'STICK + SHIFT = Stick shift; TWIG baits the wooden stick meaning.'),
        node(32, 'SHIFT', 'DOWN', 'GEAR', 1, 3, 'particle_2', 0, 'Shift down / Downshift', 'SHIFT + DOWN = Shift down; GEAR baits the car transmission sense.'),
        node(33, 'DOWN', 'POUR', 'DROP', 0, 3, 'particle_2', 0, 'Downpour', 'DOWN + POUR = Downpour; DROP is a reverse trap (Dropdown).'),
        node(34, 'POUR', 'OVER', 'RAIN', 1, 3, 'particle_2', 0, 'Pour-over', 'POUR + OVER = Pour-over; RAIN baits the weather meaning of Downpour.'),
        node(35, 'OVER', 'TURN', 'COAT', 0, 3, 'particle_2', 0, 'Overturn', 'OVER + TURN = Overturn; COAT is a distraction.'),
        node(36, 'TURN', 'OUT', 'TWIST', 1, 3, 'particle_2', 0, 'Turnout', 'TURN + OUT = Turnout; TWIST is a synonym trap.'),
        node(37, 'OUT', 'BREAK', 'BROKE', 0, 3, 'particle_2', 0, 'Outbreak', 'OUT + BREAK = Outbreak; BROKE is a tense mutation trap.'),
        node(38, 'BREAK', 'OUT', 'SMASH', 1, 3, 'particle_2', 0, 'Breakout', 'BREAK + OUT = Breakout; SMASH is a synonym decoy.'),
        node(39, 'OUT', 'SUN', 'MOON', 0, 3, 'particle_2', 0, 'Outsun / Closes the SUN Circuit!', 'Closes the Conservatory thematic loop back to SUN!')
      ]
    },
    {
      vineNumber: 144,
      dateKey: '2026-11-03',
      title: 'Sumi-e Mountain Sprint',
      themeId: 2, // Ukiyo-e Ink & Sakura
      startWord: 'GOLD',
      nodes: [
        // ================= ZONE 1: THE ROOTS (Nodes 1-12 | 3-Part Triplets) =================
        node(0, 'GOLD', 'FISH', 'COIN', 0, 1, 'triplet_1_2', 1, 'Goldfish', 'GOLD + FISH = Goldfish; COIN is a treasure noun.'),
        node(1, 'FISH', 'BOWL', 'HOOK', 1, 1, 'triplet_2_3', 2, 'Goldfish bowl', 'FISH + BOWL completes Goldfish bowl!'),
        node(2, 'BOWL', 'CUT', 'SPOON', 0, 1, 'triplet_2_3', 3, 'Fishbowl -> Bowl cut (Triple-Bloom!)', 'BOWL + CUT = Bowl cut and blooms Sakura Triplet #1!'),

        node(3, 'CUT', 'BACK', 'SCISSOR', 1, 1, 'triplet_1_2', 1, 'Cutback', 'CUT + BACK = Cutback; SCISSOR is a cutting tool decoy.'),
        node(4, 'BACK', 'DROP', 'SPINE', 0, 1, 'triplet_2_3', 2, 'Backdrop', 'BACK + DROP = Backdrop; SPINE baits anatomical back.'),
        node(5, 'DROP', 'OUT', 'TEAR', 1, 1, 'triplet_2_3', 3, 'Backdrop -> Dropout (Triple-Bloom!)', 'DROP + OUT = Dropout and blooms Sakura Triplet #2; TEAR is reverse (Teardrop).'),

        node(6, 'OUT', 'HOUSE', 'YARD', 0, 1, 'triplet_1_2', 1, 'Outhouse', 'OUT + HOUSE = Outhouse.'),
        node(7, 'HOUSE', 'BOAT', 'ROOM', 1, 1, 'triplet_2_3', 2, 'Houseboat', 'HOUSE + BOAT = Houseboat.'),
        node(8, 'BOAT', 'YARD', 'SAIL', 0, 1, 'triplet_2_3', 3, 'Houseboat -> Boatyard (Triple-Bloom!)', 'BOAT + YARD = Boatyard and blooms Sakura Triplet #3!'),

        node(9, 'YARD', 'SALE', 'FENCE', 1, 1, 'triplet_1_2', 1, 'Yard sale', 'YARD + SALE = Yard sale.'),
        node(10, 'SALE', 'PRICE', 'BUY', 0, 1, 'triplet_2_3', 2, 'Sale price', 'SALE + PRICE = Sale price (Rising Sap Warning!).'),
        node(11, 'PRICE', 'TAG', 'COST', 1, 1, 'triplet_2_3', 3, 'Sale price -> Price tag (Triple-Bloom!)', 'PRICE + TAG = Price tag and crosses into Zone 2!'),

        // ================= ZONE 2: THE STEM (Nodes 13-28 | 2-Part Pivots) =================
        node(12, 'TAG', 'TEAM', 'LABEL', 0, 2, 'pivot_2', 0, 'Tag team', 'TAG + TEAM = Tag team; LABEL baits the retail sense of Price tag.'),
        node(13, 'TEAM', 'WORK', 'SQUAD', 1, 2, 'pivot_2', 0, 'Teamwork', 'TEAM + WORK = Teamwork; SQUAD is a synonym.'),
        node(14, 'WORK', 'BENCH', 'LABOR', 0, 2, 'pivot_2', 0, 'Workbench', 'WORK + BENCH = Workbench; LABOR baits the effort sense of Teamwork.'),
        node(15, 'BENCH', 'MARK', 'SEAT', 1, 2, 'pivot_2', 0, 'Benchmark', 'BENCH + MARK = Benchmark; SEAT baits the furniture sense of Workbench.'),
        node(16, 'MARK', 'DOWN', 'GRADE', 0, 2, 'pivot_2', 0, 'Markdown', 'MARK + DOWN = Markdown; GRADE baits school marks.'),
        node(17, 'DOWN', 'TOWN', 'LOW', 1, 2, 'pivot_2', 0, 'Downtown', 'DOWN + TOWN = Downtown; LOW baits the price reduction of Markdown.'),
        node(18, 'TOWN', 'SHIP', 'CITY', 0, 2, 'pivot_2', 0, 'Township', 'TOWN + SHIP = Township; CITY is an urban synonym.'),
        node(19, 'SHIP', 'WRECK', 'ANCHOR', 1, 2, 'pivot_2', 0, 'Shipwreck', 'SHIP + WRECK = Shipwreck; ANCHOR baits naval gear.'),
        node(20, 'WRECK', 'BALL', 'CRASH', 0, 2, 'pivot_2', 0, 'Wrecking ball', 'WRECK + BALL = Wreckball; CRASH baits the collision of Shipwreck.'),
        node(21, 'BALL', 'PARK', 'SPHERE', 1, 2, 'pivot_2', 0, 'Ballpark', 'BALL + PARK = Ballpark; SPHERE baits the geometric shape.'),
        node(22, 'PARK', 'WAY', 'TREES', 0, 2, 'pivot_2', 0, 'Parkway', 'PARK + WAY = Parkway; TREES baits nature parks.'),
        node(23, 'WAY', 'SIDE', 'PATH', 1, 2, 'pivot_2', 0, 'Wayside', 'WAY + SIDE = Wayside; PATH baits the road sense of Parkway.'),
        node(24, 'SIDE', 'STEP', 'EDGE', 0, 2, 'pivot_2', 0, 'Sidestep', 'SIDE + STEP = Sidestep; EDGE is a synonym.'),
        node(25, 'STEP', 'SON', 'STAIR', 1, 2, 'pivot_2', 0, 'Stepson', 'STEP + SON = Stepson; STAIR baits the footstep sense of Sidestep.'),
        node(26, 'SON', 'BIRD', 'BOY', 0, 2, 'pivot_2', 0, 'Songbird / Son', 'SON + BIRD bridges into Birdcage; BOY baits the family sense.'),
        node(27, 'BIRD', 'CAGE', 'NEST', 1, 2, 'pivot_2', 0, 'Birdcage', 'BIRD + CAGE = Birdcage; crosses into Zone 3 Canopy!'),

        // ================= ZONE 3: THE CANOPY (Nodes 29-40 | 2-Part Particle Sprints) =================
        node(28, 'CAGE', 'MATCH', 'LOCK', 0, 3, 'particle_2', 0, 'Cage match', 'CAGE + MATCH = Cage match; LOCK baits the prison bars of Birdcage.'),
        node(29, 'MATCH', 'BOOK', 'FLAME', 1, 3, 'particle_2', 0, 'Matchbook', 'MATCH + BOOK = Matchbook; FLAME baits fire.'),
        node(30, 'BOOK', 'MARK', 'PAGE', 0, 3, 'particle_2', 0, 'Bookmark', 'BOOK + MARK = Bookmark; PAGE is a book part.'),
        node(31, 'MARK', 'UP', 'PEN', 1, 3, 'particle_2', 0, 'Markup', 'MARK + UP = Markup; PEN baits writing.'),
        node(32, 'UP', 'HOLD', 'KEPT', 0, 3, 'particle_2', 0, 'Uphold', 'UP + HOLD = Uphold; KEPT is a past-tense decoy.'),
        node(33, 'HOLD', 'OUT', 'GRIP', 1, 3, 'particle_2', 0, 'Holdout', 'HOLD + OUT = Holdout; GRIP is a synonym decoy.'),
        node(34, 'OUT', 'FALL', 'DROP', 0, 3, 'particle_2', 0, 'Outfall', 'OUT + FALL = Outfall; DROP is reverse (Dropout).'),
        node(35, 'FALL', 'BACK', 'DOWN', 1, 3, 'particle_2', 0, 'Fallback', 'FALL + BACK = Fallback; DOWN is a directional reflex trap.'),
        node(36, 'BACK', 'FIRE', 'WARD', 0, 3, 'particle_2', 0, 'Backfire', 'BACK + FIRE = Backfire.'),
        node(37, 'FIRE', 'SIDE', 'CAMP', 1, 3, 'particle_2', 0, 'Fireside', 'FIRE + SIDE = Fireside; CAMP is a reverse compound trap (Campfire!).'),
        node(38, 'SIDE', 'LINE', 'CURB', 0, 3, 'particle_2', 0, 'Sideline', 'SIDE + LINE = Sideline; CURB is a reverse-compound trap (Curbside is backwards!).'),
        node(39, 'LINE', 'GOLD', 'SILVER', 1, 3, 'particle_2', 0, 'Goldline (Closes the GOLD Circuit!)', 'Closes the Ukiyo-e circuit back to GOLD!')
      ]
    }
  ];

  /**
   * Anti-Ambiguity Validator:
   * Checks a daily vine's nodes for:
   * 1. Continuity (node[i].correctWord === node[i+1].stemWord)
   * 2. Ambiguous Compound Collisions (stemWord + decoyWord forming a known forward compound)
   * 3. Duplicate words on the same fork (correctWord === decoyWord)
   * 4. Zone 1 Triplet step progression
   */
  function validateVineChain(vine) {
    const issues = [];
    if (!vine || !Array.isArray(vine.nodes) || vine.nodes.length === 0) {
      return { valid: false, issues: ['Vine contains no nodes.'] };
    }

    vine.nodes.forEach((n, idx) => {
      const nodeNum = idx + 1;
      const stem = (n.stemWord || '').trim().toUpperCase();
      const correct = (n.correctWord || '').trim().toUpperCase();
      const decoy = (n.decoyWord || '').trim().toUpperCase();

      if (!stem || !correct || !decoy) {
        issues.push(`Node ${nodeNum}: Missing stemWord, correctWord, or decoyWord.`);
      }
      if (correct === decoy) {
        issues.push(`Node ${nodeNum} (${stem}): correctWord and decoyWord are identical (${correct}).`);
      }

      // Continuity check with previous node
      if (idx > 0) {
        const prevCorrect = (vine.nodes[idx - 1].correctWord || '').trim().toUpperCase();
        if (stem !== prevCorrect) {
          issues.push(
            `Node ${nodeNum}: Chain continuity broken — previous correctWord was "${prevCorrect}" but stemWord is "${stem}".`
          );
        }
      }

      // Anti-Ambiguity Compound Check: Does stem + decoy accidentally form a known forward compound?
      const decoyCompound = stem + decoy;
      if (KNOWN_FORWARD_COMPOUNDS.has(decoyCompound)) {
        issues.push(
          `Node ${nodeNum}: AMBIGUITY TRAP — "${stem} + ${decoy}" (${decoyCompound}) is registered as a valid forward compound in the lexicon!`
        );
      }
    });

    return {
      valid: issues.length === 0,
      issues
    };
  }

  return {
    KNOWN_FORWARD_COMPOUNDS,
    PRODUCTION_DAILY_VINES,
    validateVineChain
  };
});
