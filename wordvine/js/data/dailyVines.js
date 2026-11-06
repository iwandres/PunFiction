/**
 * Word Vine — Strict Forward-Flow Mega Compound Lexicon & 12 Rotating Daily Themes
 * - 12 Curated Daily Themes rotating automatically across calendar days (40 nodes per puzzle • 480 total forward steps)
 * - 100% Strictly Forward Compound Flow: Every step (Part1 + Part2, Part2 + Part3, Bridge Part3 + NextPart1,
 *   Zone 2 Stem + Target, Zone 3 Stem + Target) is verified in strictly forward order (FirstWord + SecondWord).
 * - 4-Layer Anti-Compound Decoy Guardrail (1,920 cross-domain rhyme/lookalike decoys + 7,190 ENABLE compounds + open compound filter)
 * - Dynamic Left/Right placement + fresh decoy sampling on every replay while preserving the active Daily Theme
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WordVineData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LEXICON_VERSION = 'v10_reverse_graft_loops';

  const DAILY_THEMES = [
  {
    "themeIndex": 0,
    "themeKey": "sweet_tooth_kitchen",
    "themeIcon": "🧁",
    "themeName": "Sweet Tooth & Kitchen Table",
    "themeSubtitle": "Peanut butter cups, cupcakes, tabletops, bell peppers, peppermint & punch bowls",
    "themeId": 0
  },
  {
    "themeIndex": 1,
    "themeKey": "center_stage_showbiz",
    "themeIcon": "🎭",
    "themeName": "Center Stage & Spotlight",
    "themeSubtitle": "Stagecoaches, ballpoints, checkpoints, roadblocks & high-speed showdowns",
    "themeId": 1
  },
  {
    "themeIndex": 2,
    "themeKey": "game_day_arena",
    "themeIcon": "🏟️",
    "themeName": "Ballpark & Backcountry",
    "themeSubtitle": "Snowballs, ballparks, houseboats, horseshoes, beanbags, bagpipes & dreamlands",
    "themeId": 2
  },
  {
    "themeIndex": 3,
    "themeKey": "home_sweet_home",
    "themeIcon": "🏠",
    "themeName": "Home Sweet Home",
    "themeSubtitle": "Fireplaces, placemats, timetables, doghouses, showrooms, roommates & workshops",
    "themeId": 0
  },
  {
    "themeIndex": 4,
    "themeKey": "the_workshop_craft",
    "themeIcon": "🛠️",
    "themeName": "Clockwork & Craft",
    "themeSubtitle": "Time clocks, workshops, backwaters, doormats, boardrooms & workhorses",
    "themeId": 1
  },
  {
    "themeIndex": 5,
    "themeKey": "greenhouse_harvest",
    "themeIcon": "🌻",
    "themeName": "Greenhouse & Harvest",
    "themeSubtitle": "Watermelon seeds, seedbeds, workbenches, fieldwork, daylight & lighthouses",
    "themeId": 2
  },
  {
    "themeIndex": 6,
    "themeKey": "cloak_and_dagger",
    "themeIcon": "🕵️",
    "themeName": "Goldmine & Wiretap",
    "themeSubtitle": "Minefields, tripwires, wiretaps, dance floors, portholes, game plans & outposts",
    "themeId": 0
  },
  {
    "themeIndex": 7,
    "themeKey": "high_seas_boardwalk",
    "themeIcon": "🌊",
    "themeName": "High Seas & Windmill",
    "themeSubtitle": "Seashells, shockwaves, wavelengths, windmills, flowerpots & shark tanks",
    "themeId": 1
  },
  {
    "themeIndex": 8,
    "themeKey": "storm_front_sky",
    "themeIcon": "⛈️",
    "themeName": "Windfall & Stonewall",
    "themeSubtitle": "Windfalls, stepping stones, flowerbeds, shift keys, bookworms & wormholes",
    "themeId": 2
  },
  {
    "themeIndex": 9,
    "themeKey": "corner_office_hustle",
    "themeIcon": "💼",
    "themeName": "Corner Office & Hustle",
    "themeSubtitle": "Notepads, padlocks, carpools, post offices, spaceships, beatboxes & box offices",
    "themeId": 0
  },
  {
    "themeIndex": 10,
    "themeKey": "sandcastle_outback",
    "themeIcon": "🏰",
    "themeName": "Sandcastle & Outback",
    "themeSubtitle": "Sandcastles, paperbacks, landslides, outbacks, townhouses, flyovers & coatracks",
    "themeId": 1
  },
  {
    "themeIndex": 11,
    "themeKey": "critter_crawl_wild",
    "themeIcon": "🐾",
    "themeName": "Critter Crawl & Wild",
    "themeSubtitle": "Gamebirds, birdbaths, bookworms, card sharks, top dogs, doghouses & flytraps",
    "themeId": 2
  }
];

  const ZONE1_TRIPLET_CHAINS = [
  [
    {
      "id": "peanut_butter_cup",
      "parts": [
        "PEANUT",
        "BUTTER",
        "CUP"
      ],
      "part2Hint": "PEANUT + BUTTER = Peanut butter",
      "part3Hint": "BUTTER + CUP = Buttercup (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SHUTTER",
        "CLUTTER",
        "FLUTTER",
        "MUTTER"
      ],
      "part3Decoys": [
        "PUP",
        "HICCUP",
        "STIRRUP",
        "GALLOP"
      ],
      "thematicLink": {
        "nextPart1": "CAKE",
        "connection": "2-Node Link",
        "hint": "CUP + CAKE = Cupcake",
        "decoys": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ]
      }
    },
    {
      "id": "cake_walk_way",
      "parts": [
        "CAKE",
        "WALK",
        "WAY"
      ],
      "part2Hint": "CAKE + WALK = Cakewalk",
      "part3Hint": "WALK + WAY = Walkway (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CHALK",
        "HAWK",
        "STALK",
        "SQUAWK"
      ],
      "part3Decoys": [
        "CLAY",
        "TRAY",
        "SLEIGH",
        "SPRAY"
      ],
      "thematicLink": {
        "nextPart1": "SIDE",
        "connection": "2-Node Link",
        "hint": "WAY + SIDE = Wayside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      }
    },
    {
      "id": "side_show_case",
      "parts": [
        "SIDE",
        "SHOW",
        "CASE"
      ],
      "part2Hint": "SIDE + SHOW = Sideshow",
      "part3Hint": "SHOW + CASE = Showcase (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CROW",
        "GLOW",
        "DOUGH",
        "TOE"
      ],
      "part3Decoys": [
        "VASE",
        "LACE",
        "MACE",
        "BRACE"
      ],
      "thematicLink": {
        "nextPart1": "WORK",
        "connection": "2-Node Link",
        "hint": "CASE + WORK = Casework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      }
    },
    {
      "id": "work_table_top",
      "parts": [
        "WORK",
        "TABLE",
        "TOP"
      ],
      "part2Hint": "WORK + TABLE = Worktable",
      "part3Hint": "TABLE + TOP = Tabletop (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "FABLE",
        "CABLE",
        "GABLE",
        "SABLE"
      ],
      "part3Decoys": [
        "MOP",
        "CHOP",
        "CROP",
        "PLOP"
      ],
      "thematicLink": {
        "nextPart1": "DOG",
        "connection": "2-Node Link",
        "hint": "TOP + DOG = Top dog",
        "decoys": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ]
      }
    }
  ],
  [
    {
      "id": "sun_flower_pot",
      "parts": [
        "SUN",
        "FLOWER",
        "POT"
      ],
      "part2Hint": "SUN + FLOWER = Sunflower",
      "part3Hint": "FLOWER + POT = Flowerpot (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "TOWER",
        "COWARD",
        "CHOWDER",
        "POWDER"
      ],
      "part3Decoys": [
        "BLOT",
        "KNOT",
        "TROT",
        "YACHT"
      ],
      "thematicLink": {
        "nextPart1": "BELLY",
        "connection": "2-Node Link",
        "hint": "POT + BELLY = Potbelly",
        "decoys": [
          "JELLY",
          "CELLO",
          "FELLOW",
          "TRELLIS"
        ]
      }
    },
    {
      "id": "belly_button_hole",
      "parts": [
        "BELLY",
        "BUTTON",
        "HOLE"
      ],
      "part2Hint": "BELLY + BUTTON = Belly button",
      "part3Hint": "BUTTON + HOLE = Buttonhole (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "MUTTON",
        "GLUTTON",
        "CARTON",
        "PISTON"
      ],
      "part3Decoys": [
        "MOLE",
        "FOAL",
        "SHOAL",
        "STOLE"
      ],
      "thematicLink": {
        "nextPart1": "PUNCH",
        "connection": "2-Node Link",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      }
    },
    {
      "id": "punch_bowl_cut",
      "parts": [
        "PUNCH",
        "BOWL",
        "CUT"
      ],
      "part2Hint": "PUNCH + BOWL = Punch bowl",
      "part3Hint": "BOWL + CUT = Bowl cut (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "OWL",
        "HOWL",
        "SCOWL",
        "PROWL"
      ],
      "part3Decoys": [
        "HUT",
        "STRUT",
        "GLUT",
        "SMUT"
      ],
      "thematicLink": {
        "nextPart1": "BACK",
        "connection": "2-Node Link",
        "hint": "CUT + BACK = Cutback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      }
    },
    {
      "id": "back_stage_coach",
      "parts": [
        "BACK",
        "STAGE",
        "COACH"
      ],
      "part2Hint": "BACK + STAGE = Backstage",
      "part3Hint": "STAGE + COACH = Stagecoach (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CAGE",
        "SAGE",
        "WAGE",
        "GAUGE"
      ],
      "part3Decoys": [
        "ROACH",
        "POACH",
        "BROOCH",
        "LOACH"
      ],
      "thematicLink": {
        "nextPart1": "CLASS",
        "connection": "2-Node Link",
        "hint": "COACH + CLASS = Coach class",
        "decoys": [
          "BRASS",
          "LASS",
          "CRASS",
          "MORASS"
        ]
      }
    }
  ],
  [
    {
      "id": "snow_ball_park",
      "parts": [
        "SNOW",
        "BALL",
        "PARK"
      ],
      "part2Hint": "SNOW + BALL = Snowball",
      "part3Hint": "BALL + PARK = Ballpark (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SHAWL",
        "BRAWL",
        "SCRAWL",
        "DRAWL"
      ],
      "part3Decoys": [
        "SHARK",
        "LARK",
        "SPARK",
        "BARK"
      ],
      "thematicLink": {
        "nextPart1": "BENCH",
        "connection": "2-Node Link",
        "hint": "PARK + BENCH = Park bench",
        "decoys": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ]
      }
    },
    {
      "id": "bench_mark_down",
      "parts": [
        "BENCH",
        "MARK",
        "DOWN"
      ],
      "part2Hint": "BENCH + MARK = Benchmark",
      "part3Hint": "MARK + DOWN = Markdown (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SHARK",
        "LARK",
        "SPARK",
        "BARK"
      ],
      "part3Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "thematicLink": {
        "nextPart1": "TOWN",
        "connection": "2-Node Link",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      }
    },
    {
      "id": "town_house_boat",
      "parts": [
        "TOWN",
        "HOUSE",
        "BOAT"
      ],
      "part2Hint": "TOWN + HOUSE = Townhouse",
      "part3Hint": "HOUSE + BOAT = Houseboat (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "BLOUSE",
        "GROUSE",
        "SPOUSE",
        "MOUSE"
      ],
      "part3Decoys": [
        "GOAT",
        "MOAT",
        "THROAT",
        "GLOAT"
      ],
      "thematicLink": {
        "nextPart1": "SHOW",
        "connection": "2-Node Link",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      }
    },
    {
      "id": "show_case_work",
      "parts": [
        "SHOW",
        "CASE",
        "WORK"
      ],
      "part2Hint": "SHOW + CASE = Showcase",
      "part3Hint": "CASE + WORK = Casework (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "VASE",
        "LACE",
        "MACE",
        "BRACE"
      ],
      "part3Decoys": [
        "SMIRK",
        "QUIRK",
        "CLERK",
        "PERK"
      ],
      "thematicLink": {
        "nextPart1": "HORSE",
        "connection": "2-Node Link",
        "hint": "WORK + HORSE = Workhorse",
        "decoys": [
          "MORSE",
          "CORPSE",
          "REMORSE",
          "GORSE"
        ]
      }
    }
  ],
  [
    {
      "id": "fire_place_mat",
      "parts": [
        "FIRE",
        "PLACE",
        "MAT"
      ],
      "part2Hint": "FIRE + PLACE = Fireplace",
      "part3Hint": "PLACE + MAT = Placemat (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "LACE",
        "MACE",
        "BRACE",
        "GRACE"
      ],
      "part3Decoys": [
        "BAT",
        "GNAT",
        "BRAT",
        "SPAT"
      ],
      "thematicLink": {
        "nextPart1": "BOARD",
        "connection": "2-Node Link",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      }
    },
    {
      "id": "board_walk_out",
      "parts": [
        "BOARD",
        "WALK",
        "OUT"
      ],
      "part2Hint": "BOARD + WALK = Boardwalk",
      "part3Hint": "WALK + OUT = Walkout (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "HAWK",
        "STALK",
        "SQUAWK",
        "CAULK"
      ],
      "part3Decoys": [
        "TROUT",
        "SPROUT",
        "SNOUT",
        "GROUT"
      ],
      "thematicLink": {
        "nextPart1": "POST",
        "connection": "2-Node Link",
        "hint": "OUT + POST = Outpost",
        "decoys": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ]
      }
    },
    {
      "id": "post_mark_down",
      "parts": [
        "POST",
        "MARK",
        "DOWN"
      ],
      "part2Hint": "POST + MARK = Postmark",
      "part3Hint": "MARK + DOWN = Markdown (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SHARK",
        "LARK",
        "SPARK",
        "BARK"
      ],
      "part3Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "thematicLink": {
        "nextPart1": "TIME",
        "connection": "2-Node Link",
        "hint": "DOWN + TIME = Downtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      }
    },
    {
      "id": "time_table_top",
      "parts": [
        "TIME",
        "TABLE",
        "TOP"
      ],
      "part2Hint": "TIME + TABLE = Timetable",
      "part3Hint": "TABLE + TOP = Tabletop (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "FABLE",
        "CABLE",
        "GABLE",
        "SABLE"
      ],
      "part3Decoys": [
        "MOP",
        "CHOP",
        "CROP",
        "PLOP"
      ],
      "thematicLink": {
        "nextPart1": "DOG",
        "connection": "2-Node Link",
        "hint": "TOP + DOG = Top dog",
        "decoys": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ]
      }
    }
  ],
  [
    {
      "id": "hand_shake_down",
      "parts": [
        "HAND",
        "SHAKE",
        "DOWN"
      ],
      "part2Hint": "HAND + SHAKE = Handshake",
      "part3Hint": "SHAKE + DOWN = Shakedown (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SNAKE",
        "DRAKE",
        "FLAKE",
        "STEAK"
      ],
      "part3Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "thematicLink": {
        "nextPart1": "TIME",
        "connection": "2-Node Link",
        "hint": "DOWN + TIME = Downtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      }
    },
    {
      "id": "time_clock_work",
      "parts": [
        "TIME",
        "CLOCK",
        "WORK"
      ],
      "part2Hint": "TIME + CLOCK = Time clock",
      "part3Hint": "CLOCK + WORK = Clockwork (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "FLOCK",
        "SMOCK",
        "CROCK",
        "SHOCK"
      ],
      "part3Decoys": [
        "SMIRK",
        "QUIRK",
        "CLERK",
        "PERK"
      ],
      "thematicLink": {
        "nextPart1": "SHOP",
        "connection": "2-Node Link",
        "hint": "WORK + SHOP = Workshop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      }
    },
    {
      "id": "shop_lift_off",
      "parts": [
        "SHOP",
        "LIFT",
        "OFF"
      ],
      "part2Hint": "SHOP + LIFT = Shoplift",
      "part3Hint": "LIFT + OFF = Liftoff (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "DRIFT",
        "SWIFT",
        "THRIFT",
        "GIFT"
      ],
      "part3Decoys": [
        "COUGH",
        "TROUGH",
        "SCOFF",
        "GOLF"
      ],
      "thematicLink": {
        "nextPart1": "SET",
        "connection": "2-Node Link",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      }
    },
    {
      "id": "set_back_water",
      "parts": [
        "SET",
        "BACK",
        "WATER"
      ],
      "part2Hint": "SET + BACK = Setback",
      "part3Hint": "BACK + WATER = Backwater (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "QUACK",
        "SNACK",
        "SHACK",
        "PLAQUE"
      ],
      "part3Decoys": [
        "OTTER",
        "POTTER",
        "TROTTER",
        "BLOTTER"
      ],
      "thematicLink": {
        "nextPart1": "FALL",
        "connection": "2-Node Link",
        "hint": "WATER + FALL = Waterfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      }
    }
  ],
  [
    {
      "id": "water_melon_seed",
      "parts": [
        "WATER",
        "MELON",
        "SEED"
      ],
      "part2Hint": "WATER + MELON = Watermelon",
      "part3Hint": "MELON + SEED = Melon seed (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "FELON",
        "LEMON",
        "HERON",
        "TALON"
      ],
      "part3Decoys": [
        "STEED",
        "TWEED",
        "GREED",
        "CREED"
      ],
      "thematicLink": {
        "nextPart1": "BED",
        "connection": "2-Node Link",
        "hint": "SEED + BED = Seedbed",
        "decoys": [
          "SLED",
          "SHRED",
          "THREAD",
          "DREAD"
        ]
      }
    },
    {
      "id": "bed_spread_sheet",
      "parts": [
        "BED",
        "SPREAD",
        "SHEET"
      ],
      "part2Hint": "BED + SPREAD = Bedspread",
      "part3Hint": "SPREAD + SHEET = Spreadsheet (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SHRED",
        "THREAD",
        "DREAD",
        "TREAD"
      ],
      "part3Decoys": [
        "SLEET",
        "FLEET",
        "GREET",
        "PLEAT"
      ],
      "thematicLink": {
        "nextPart1": "METAL",
        "connection": "2-Node Link",
        "hint": "SHEET + METAL = Sheet metal",
        "decoys": [
          "PETAL",
          "KETTLE",
          "NETTLE",
          "SETTLE"
        ]
      }
    },
    {
      "id": "metal_work_bench",
      "parts": [
        "METAL",
        "WORK",
        "BENCH"
      ],
      "part2Hint": "METAL + WORK = Metalwork",
      "part3Hint": "WORK + BENCH = Workbench (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SMIRK",
        "QUIRK",
        "CLERK",
        "PERK"
      ],
      "part3Decoys": [
        "WRENCH",
        "TRENCH",
        "STENCH",
        "QUENCH"
      ],
      "thematicLink": {
        "nextPart1": "MARK",
        "connection": "2-Node Link",
        "hint": "BENCH + MARK = Benchmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      }
    },
    {
      "id": "mark_down_town",
      "parts": [
        "MARK",
        "DOWN",
        "TOWN"
      ],
      "part2Hint": "MARK + DOWN = Markdown",
      "part3Hint": "DOWN + TOWN = Downtown (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "part3Decoys": [
        "CLOWN",
        "CROWN",
        "GOWN",
        "FROWN"
      ],
      "thematicLink": {
        "nextPart1": "HOUSE",
        "connection": "2-Node Link",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      }
    }
  ],
  [
    {
      "id": "gold_mine_field",
      "parts": [
        "GOLD",
        "MINE",
        "FIELD"
      ],
      "part2Hint": "GOLD + MINE = Goldmine",
      "part3Hint": "MINE + FIELD = Minefield (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "PINE",
        "VINE",
        "SWINE",
        "TWINE"
      ],
      "part3Decoys": [
        "SHIELD",
        "YIELD",
        "WIELD",
        "PEELED"
      ],
      "thematicLink": {
        "nextPart1": "TRIP",
        "connection": "2-Node Link",
        "hint": "FIELD + TRIP = Field trip",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      }
    },
    {
      "id": "trip_wire_tap",
      "parts": [
        "TRIP",
        "WIRE",
        "TAP"
      ],
      "part2Hint": "TRIP + WIRE = Tripwire",
      "part3Hint": "WIRE + TAP = Wiretap (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CHOIR",
        "BRIAR",
        "FRIAR",
        "SPIRE"
      ],
      "part3Decoys": [
        "CLAP",
        "SLAP",
        "SCRAP",
        "CHAP"
      ],
      "thematicLink": {
        "nextPart1": "DANCE",
        "connection": "2-Node Link",
        "hint": "TAP + DANCE = Tap dance",
        "decoys": [
          "LANCE",
          "TRANCE",
          "GLANCE",
          "PRANCE"
        ]
      }
    },
    {
      "id": "dance_floor_board",
      "parts": [
        "DANCE",
        "FLOOR",
        "BOARD"
      ],
      "part2Hint": "DANCE + FLOOR = Dance floor",
      "part3Hint": "FLOOR + BOARD = Floorboard (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SNORE",
        "CHORE",
        "SPORE",
        "ROAR"
      ],
      "part3Decoys": [
        "CHORD",
        "SWORD",
        "GOURD",
        "FJORD"
      ],
      "thematicLink": {
        "nextPart1": "WALK",
        "connection": "2-Node Link",
        "hint": "BOARD + WALK = Boardwalk",
        "decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ]
      }
    },
    {
      "id": "walk_over_sea",
      "parts": [
        "WALK",
        "OVER",
        "SEA"
      ],
      "part2Hint": "WALK + OVER = Walkover",
      "part3Hint": "OVER + SEA = Oversea (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CLOVER",
        "PLOVER",
        "ROVER",
        "DROVER"
      ],
      "part3Decoys": [
        "SKI",
        "FLEA",
        "PEA",
        "TEA"
      ],
      "thematicLink": {
        "nextPart1": "PORT",
        "connection": "2-Node Link",
        "hint": "SEA + PORT = Seaport",
        "decoys": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ]
      }
    }
  ],
  [
    {
      "id": "sea_shell_shock",
      "parts": [
        "SEA",
        "SHELL",
        "SHOCK"
      ],
      "part2Hint": "SEA + SHELL = Seashell",
      "part3Hint": "SHELL + SHOCK = Shell shock (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SPELL",
        "YELL",
        "SMELL",
        "DWELL"
      ],
      "part3Decoys": [
        "FLOCK",
        "SMOCK",
        "CROCK",
        "CLOCK"
      ],
      "thematicLink": {
        "nextPart1": "WAVE",
        "connection": "2-Node Link",
        "hint": "SHOCK + WAVE = Shockwave",
        "decoys": [
          "CAVE",
          "BRAVE",
          "GRAVE",
          "SHAVE"
        ]
      }
    },
    {
      "id": "wave_length_way",
      "parts": [
        "WAVE",
        "LENGTH",
        "WAY"
      ],
      "part2Hint": "WAVE + LENGTH = Wavelength",
      "part3Hint": "LENGTH + WAY = Lengthway (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "STRENGTH",
        "TENTH",
        "PLINTH",
        "LABYRINTH"
      ],
      "part3Decoys": [
        "CLAY",
        "TRAY",
        "JAY",
        "SLEIGH"
      ],
      "thematicLink": {
        "nextPart1": "SIDE",
        "connection": "2-Node Link",
        "hint": "WAY + SIDE = Wayside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      }
    },
    {
      "id": "side_show_down",
      "parts": [
        "SIDE",
        "SHOW",
        "DOWN"
      ],
      "part2Hint": "SIDE + SHOW = Sideshow",
      "part3Hint": "SHOW + DOWN = Showdown (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CROW",
        "GLOW",
        "DOUGH",
        "TOE"
      ],
      "part3Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "thematicLink": {
        "nextPart1": "WIND",
        "connection": "2-Node Link",
        "hint": "DOWN + WIND = Downwind",
        "decoys": [
          "RIND",
          "BLIND",
          "GRIND",
          "MIND"
        ]
      }
    },
    {
      "id": "wind_mill_stone",
      "parts": [
        "WIND",
        "MILL",
        "STONE"
      ],
      "part2Hint": "WIND + MILL = Windmill",
      "part3Hint": "MILL + STONE = Millstone (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "QUILL",
        "GRILL",
        "FRILL",
        "DRILL"
      ],
      "part3Decoys": [
        "CONE",
        "DRONE",
        "THRONE",
        "SCONE"
      ],
      "thematicLink": {
        "nextPart1": "WALL",
        "connection": "2-Node Link",
        "hint": "STONE + WALL = Stonewall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      }
    }
  ],
  [
    {
      "id": "wind_fall_out",
      "parts": [
        "WIND",
        "FALL",
        "OUT"
      ],
      "part2Hint": "WIND + FALL = Windfall",
      "part3Hint": "FALL + OUT = Fallout (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SHAWL",
        "BRAWL",
        "SCRAWL",
        "DRAWL"
      ],
      "part3Decoys": [
        "TROUT",
        "SPROUT",
        "SNOUT",
        "GROUT"
      ],
      "thematicLink": {
        "nextPart1": "DOOR",
        "connection": "2-Node Link",
        "hint": "OUT + DOOR = Outdoor",
        "decoys": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ]
      }
    },
    {
      "id": "door_step_stone",
      "parts": [
        "DOOR",
        "STEP",
        "STONE"
      ],
      "part2Hint": "DOOR + STEP = Doorstep",
      "part3Hint": "STEP + STONE = Stepping stone (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "PREP",
        "REP",
        "PEP",
        "SCHLEP"
      ],
      "part3Decoys": [
        "CONE",
        "DRONE",
        "THRONE",
        "SCONE"
      ],
      "thematicLink": {
        "nextPart1": "WALL",
        "connection": "2-Node Link",
        "hint": "STONE + WALL = Stonewall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      }
    },
    {
      "id": "wall_flower_bed",
      "parts": [
        "WALL",
        "FLOWER",
        "BED"
      ],
      "part2Hint": "WALL + FLOWER = Wallflower",
      "part3Hint": "FLOWER + BED = Flowerbed (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "TOWER",
        "COWARD",
        "CHOWDER",
        "POWDER"
      ],
      "part3Decoys": [
        "SLED",
        "SHRED",
        "THREAD",
        "DREAD"
      ],
      "thematicLink": {
        "nextPart1": "TIME",
        "connection": "2-Node Link",
        "hint": "BED + TIME = Bedtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      }
    },
    {
      "id": "time_shift_key",
      "parts": [
        "TIME",
        "SHIFT",
        "KEY"
      ],
      "part2Hint": "TIME + SHIFT = Timeshift",
      "part3Hint": "SHIFT + KEY = Shift key (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "DRIFT",
        "SWIFT",
        "THRIFT",
        "GIFT"
      ],
      "part3Decoys": [
        "SKI",
        "FLEA",
        "PEA",
        "TEA"
      ],
      "thematicLink": {
        "nextPart1": "NOTE",
        "connection": "2-Node Link",
        "hint": "KEY + NOTE = Keynote",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      }
    }
  ],
  [
    {
      "id": "note_pad_lock",
      "parts": [
        "NOTE",
        "PAD",
        "LOCK"
      ],
      "part2Hint": "NOTE + PAD = Notepad",
      "part3Hint": "PAD + LOCK = Padlock (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "PLAID",
        "GLAD",
        "CLAD",
        "BRAD"
      ],
      "part3Decoys": [
        "FLOCK",
        "SMOCK",
        "CROCK",
        "SHOCK"
      ],
      "thematicLink": {
        "nextPart1": "BOX",
        "connection": "2-Node Link",
        "hint": "LOCK + BOX = Lockbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      }
    },
    {
      "id": "box_car_pool",
      "parts": [
        "BOX",
        "CAR",
        "POOL"
      ],
      "part2Hint": "BOX + CAR = Boxcar",
      "part3Hint": "CAR + POOL = Carpool (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SCAR",
        "CZAR",
        "GUITAR",
        "RADAR"
      ],
      "part3Decoys": [
        "SPOOL",
        "DROOL",
        "FOOL",
        "GHOUL"
      ],
      "thematicLink": {
        "nextPart1": "SIDE",
        "connection": "2-Node Link",
        "hint": "POOL + SIDE = Poolside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      }
    },
    {
      "id": "side_board_walk",
      "parts": [
        "SIDE",
        "BOARD",
        "WALK"
      ],
      "part2Hint": "SIDE + BOARD = Sideboard",
      "part3Hint": "BOARD + WALK = Boardwalk (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CHORD",
        "SWORD",
        "GOURD",
        "FJORD"
      ],
      "part3Decoys": [
        "HAWK",
        "STALK",
        "SQUAWK",
        "CAULK"
      ],
      "thematicLink": {
        "nextPart1": "OUT",
        "connection": "2-Node Link",
        "hint": "WALK + OUT = Walkout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      }
    },
    {
      "id": "out_post_office",
      "parts": [
        "OUT",
        "POST",
        "OFFICE"
      ],
      "part2Hint": "OUT + POST = Outpost",
      "part3Hint": "POST + OFFICE = Post office (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "GHOST",
        "TOAST",
        "ROAST",
        "COAST"
      ],
      "part3Decoys": [
        "NOVICE",
        "CHALICE",
        "PALACE",
        "MALICE"
      ],
      "thematicLink": {
        "nextPart1": "SPACE",
        "connection": "2-Node Link",
        "hint": "OFFICE + SPACE = Office space",
        "decoys": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ]
      }
    }
  ],
  [
    {
      "id": "sand_castle_wall",
      "parts": [
        "SAND",
        "CASTLE",
        "WALL"
      ],
      "part2Hint": "SAND + CASTLE = Sandcastle",
      "part3Hint": "CASTLE + WALL = Castle wall (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "TASSEL",
        "HASSLE",
        "WRESTLE",
        "NESTLE"
      ],
      "part3Decoys": [
        "SHAWL",
        "BRAWL",
        "SCRAWL",
        "DRAWL"
      ],
      "thematicLink": {
        "nextPart1": "PAPER",
        "connection": "2-Node Link",
        "hint": "WALL + PAPER = Wallpaper",
        "decoys": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ]
      }
    },
    {
      "id": "paper_back_bone",
      "parts": [
        "PAPER",
        "BACK",
        "BONE"
      ],
      "part2Hint": "PAPER + BACK = Paperback",
      "part3Hint": "BACK + BONE = Backbone (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "QUACK",
        "SNACK",
        "SHACK",
        "PLAQUE"
      ],
      "part3Decoys": [
        "CONE",
        "DRONE",
        "THRONE",
        "SCONE"
      ],
      "thematicLink": {
        "nextPart1": "DRY",
        "connection": "2-Node Link",
        "hint": "BONE + DRY = Bone-dry",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      }
    },
    {
      "id": "dry_land_slide",
      "parts": [
        "DRY",
        "LAND",
        "SLIDE"
      ],
      "part2Hint": "DRY + LAND = Dryland",
      "part3Hint": "LAND + SLIDE = Landslide (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "STRAND",
        "BRAND",
        "GLAND",
        "BLAND"
      ],
      "part3Decoys": [
        "BRIDE",
        "PRIDE",
        "GLIDE",
        "STRIDE"
      ],
      "thematicLink": {
        "nextPart1": "SHOW",
        "connection": "2-Node Link",
        "hint": "SLIDE + SHOW = Slideshow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      }
    },
    {
      "id": "show_down_time",
      "parts": [
        "SHOW",
        "DOWN",
        "TIME"
      ],
      "part2Hint": "SHOW + DOWN = Showdown",
      "part3Hint": "DOWN + TIME = Downtime (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "part3Decoys": [
        "LIME",
        "CHIME",
        "SLIME",
        "GRIME"
      ],
      "thematicLink": {
        "nextPart1": "OUT",
        "connection": "2-Node Link",
        "hint": "TIME + OUT = Timeout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      }
    }
  ],
  [
    {
      "id": "hair_cut_back",
      "parts": [
        "HAIR",
        "CUT",
        "BACK"
      ],
      "part2Hint": "HAIR + CUT = Haircut",
      "part3Hint": "CUT + BACK = Cutback (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "HUT",
        "STRUT",
        "GLUT",
        "SMUT"
      ],
      "part3Decoys": [
        "QUACK",
        "SNACK",
        "SHACK",
        "PLAQUE"
      ],
      "thematicLink": {
        "nextPart1": "DROP",
        "connection": "2-Node Link",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      }
    },
    {
      "id": "drop_down_town",
      "parts": [
        "DROP",
        "DOWN",
        "TOWN"
      ],
      "part2Hint": "DROP + DOWN = Dropdown",
      "part3Hint": "DOWN + TOWN = Downtown (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CLOWN",
        "FROWN",
        "CROWN",
        "GOWN"
      ],
      "part3Decoys": [
        "CLOWN",
        "CROWN",
        "GOWN",
        "FROWN"
      ],
      "thematicLink": {
        "nextPart1": "SHIP",
        "connection": "2-Node Link",
        "hint": "TOWN + SHIP = Township",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      }
    },
    {
      "id": "ship_wreck_ball",
      "parts": [
        "SHIP",
        "WRECK",
        "BALL"
      ],
      "part2Hint": "SHIP + WRECK = Shipwreck",
      "part3Hint": "WRECK + BALL = Wrecking ball (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "SPECK",
        "FLECK",
        "PECK",
        "NECK"
      ],
      "part3Decoys": [
        "SHAWL",
        "BRAWL",
        "SCRAWL",
        "DRAWL"
      ],
      "thematicLink": {
        "nextPart1": "PARK",
        "connection": "2-Node Link",
        "hint": "BALL + PARK = Ballpark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      }
    },
    {
      "id": "park_board_game",
      "parts": [
        "PARK",
        "BOARD",
        "GAME"
      ],
      "part2Hint": "PARK + BOARD = Park board",
      "part3Hint": "BOARD + GAME = Board game (🌸 3-Part Compound Complete!)",
      "part2Decoys": [
        "CHORD",
        "SWORD",
        "GOURD",
        "FJORD"
      ],
      "part3Decoys": [
        "FLAME",
        "SHAME",
        "BLAME",
        "FRAME"
      ],
      "thematicLink": {
        "nextPart1": "BIRD",
        "connection": "2-Node Link",
        "hint": "GAME + BIRD = Gamebird",
        "decoys": [
          "HERD",
          "CURD",
          "NERD",
          "WORD"
        ]
      }
    }
  ]
];

  const ZONE2_AND_3_CHAINS = [
  {
    "zone2": [
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "FLY",
        "hint": "HOUSE + FLY = Housefly",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "FLY",
        "target": "TRAP",
        "hint": "FLY + TRAP = Flytrap",
        "decoys": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ]
      },
      {
        "stem": "TRAP",
        "target": "DOOR",
        "hint": "TRAP + DOOR = Trapdoor",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "DOOR",
        "target": "BELL",
        "hint": "DOOR + BELL = Doorbell",
        "decoys": [
          "SPELL",
          "YELL",
          "SMELL",
          "DWELL"
        ]
      },
      {
        "stem": "BELL",
        "target": "PEPPER",
        "hint": "BELL + PEPPER = Bell pepper",
        "decoys": [
          "LEPER",
          "STEPPER",
          "ZIPPER",
          "SLIPPER"
        ]
      },
      {
        "stem": "PEPPER",
        "target": "MINT",
        "hint": "PEPPER + MINT = Peppermint",
        "decoys": [
          "LINT",
          "FLINT",
          "SQUINT",
          "SPRINT"
        ]
      },
      {
        "stem": "MINT",
        "target": "GREEN",
        "hint": "MINT + GREEN = Mint green",
        "decoys": [
          "QUEEN",
          "SCREEN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "GREEN",
        "target": "LIGHT",
        "hint": "GREEN + LIGHT = Greenlight",
        "decoys": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ]
      },
      {
        "stem": "LIGHT",
        "target": "YEAR",
        "hint": "LIGHT + YEAR = Lightyear",
        "decoys": [
          "SPEAR",
          "SMEAR",
          "SHEAR",
          "TEAR"
        ]
      },
      {
        "stem": "YEAR",
        "target": "BOOK",
        "hint": "YEAR + BOOK = Yearbook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "WORM",
        "hint": "BOOK + WORM = Bookworm",
        "decoys": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ]
      },
      {
        "stem": "WORM",
        "target": "HOLE",
        "hint": "WORM + HOLE = Wormhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "PUNCH",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      },
      {
        "stem": "PUNCH",
        "target": "BOWL",
        "hint": "PUNCH + BOWL = Punch bowl",
        "decoys": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ]
      },
      {
        "stem": "BOWL",
        "target": "CUT",
        "hint": "BOWL + CUT = Bowl cut",
        "decoys": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "CUT",
        "target": "OUT",
        "hint": "CUT + OUT = Cutout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BACK",
        "hint": "OUT + BACK = Outback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "DOWN",
        "hint": "DROP + DOWN = Dropdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "POUR",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "POUR",
        "target": "OVER",
        "hint": "POUR + OVER = Pour-over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "SLEEP",
        "hint": "OVER + SLEEP = Oversleep",
        "decoys": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ]
      },
      {
        "stem": "SLEEP",
        "target": "WALK",
        "hint": "SLEEP + WALK = Sleepwalk",
        "decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ]
      },
      {
        "stem": "WALK",
        "target": "OUT",
        "hint": "WALK + OUT = Walkout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "DOWN",
        "hint": "BREAK + DOWN = Breakdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TURN",
        "hint": "DOWN + TURN = Downturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "CLASS",
        "target": "WORK",
        "hint": "CLASS + WORK = Classwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "SPACE",
        "hint": "WORK + SPACE = Workspace",
        "decoys": [
          "MACE",
          "BRACE",
          "GRACE",
          "VASE"
        ]
      },
      {
        "stem": "SPACE",
        "target": "SHIP",
        "hint": "SPACE + SHIP = Spaceship",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      },
      {
        "stem": "SHIP",
        "target": "WRECK",
        "hint": "SHIP + WRECK = Shipwreck",
        "decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ]
      },
      {
        "stem": "WRECK",
        "target": "BALL",
        "hint": "WRECK + BALL = Wrecking ball",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "BALL",
        "target": "POINT",
        "hint": "BALL + POINT = Ballpoint",
        "decoys": [
          "JOINT",
          "ANOINT",
          "CONJOINT",
          "DISJOINT"
        ]
      },
      {
        "stem": "POINT",
        "target": "BLANK",
        "hint": "POINT + BLANK = Point-blank",
        "decoys": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ]
      },
      {
        "stem": "BLANK",
        "target": "CHECK",
        "hint": "BLANK + CHECK = Blank check",
        "decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ]
      },
      {
        "stem": "CHECK",
        "target": "POINT",
        "hint": "CHECK + POINT = Checkpoint",
        "decoys": [
          "JOINT",
          "ANOINT",
          "CONJOINT",
          "DISJOINT"
        ]
      },
      {
        "stem": "POINT",
        "target": "GUARD",
        "hint": "POINT + GUARD = Point guard",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "CHARD"
        ]
      },
      {
        "stem": "GUARD",
        "target": "RAIL",
        "hint": "GUARD + RAIL = Guardrail",
        "decoys": [
          "SNAIL",
          "QUAIL",
          "FLAIL",
          "GRAIL"
        ]
      },
      {
        "stem": "RAIL",
        "target": "ROAD",
        "hint": "RAIL + ROAD = Railroad",
        "decoys": [
          "TOAD",
          "GOAD",
          "ABODE",
          "EPISODE"
        ]
      },
      {
        "stem": "ROAD",
        "target": "BLOCK",
        "hint": "ROAD + BLOCK = Roadblock",
        "decoys": [
          "FLOCK",
          "CLOCK",
          "SMOCK",
          "CROCK"
        ]
      },
      {
        "stem": "BLOCK",
        "target": "HEAD",
        "hint": "BLOCK + HEAD = Blockhead",
        "decoys": [
          "BREAD",
          "THREAD",
          "DREAD",
          "TREAD"
        ]
      },
      {
        "stem": "HEAD",
        "target": "START",
        "hint": "HEAD + START = Head start",
        "decoys": [
          "TART",
          "DART",
          "CART",
          "CHART"
        ]
      },
      {
        "stem": "START",
        "target": "UP",
        "hint": "START + UP = Startup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OVER",
        "hint": "TURN + OVER = Turnover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "LOOK",
        "hint": "OVER + LOOK = Overlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "OUT",
        "hint": "LOOK + OUT = Lookout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LINE",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "HOLD",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "BACK",
        "hint": "HOLD + BACK = Holdback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "FIRE",
        "hint": "BACK + FIRE = Backfire",
        "decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ]
      },
      {
        "stem": "FIRE",
        "target": "WORK",
        "hint": "FIRE + WORK = Firework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "OUT",
        "hint": "WORK + OUT = Workout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "RUN",
        "hint": "OUT + RUN = Outrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "HORSE",
        "target": "SHOE",
        "hint": "HORSE + SHOE = Horseshoe",
        "decoys": [
          "CANOE",
          "IGLOO",
          "BAMBOO",
          "KAZOO"
        ]
      },
      {
        "stem": "SHOE",
        "target": "STRING",
        "hint": "SHOE + STRING = Shoestring",
        "decoys": [
          "SPRING",
          "SWING",
          "FLING",
          "CLING"
        ]
      },
      {
        "stem": "STRING",
        "target": "BEAN",
        "hint": "STRING + BEAN = String bean",
        "decoys": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "BEAN",
        "target": "BAG",
        "hint": "BEAN + BAG = Beanbag",
        "decoys": [
          "STAG",
          "CRAG",
          "BRAG",
          "SNAG"
        ]
      },
      {
        "stem": "BAG",
        "target": "PIPE",
        "hint": "BAG + PIPE = Bagpipe",
        "decoys": [
          "SNIPE",
          "STRIPE",
          "GRIPE",
          "SWIPE"
        ]
      },
      {
        "stem": "PIPE",
        "target": "DREAM",
        "hint": "PIPE + DREAM = Pipe dream",
        "decoys": [
          "CREAM",
          "STEAM",
          "GLEAM",
          "SEAM"
        ]
      },
      {
        "stem": "DREAM",
        "target": "LAND",
        "hint": "DREAM + LAND = Dreamland",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ]
      },
      {
        "stem": "LAND",
        "target": "SLIDE",
        "hint": "LAND + SLIDE = Landslide",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SLIDE",
        "target": "SHOW",
        "hint": "SLIDE + SHOW = Slideshow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "SHOW",
        "target": "DOWN",
        "hint": "SHOW + DOWN = Showdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "FALL",
        "hint": "DOWN + FALL = Downfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "BACK",
        "hint": "FALL + BACK = Fallback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "BONE",
        "hint": "BACK + BONE = Backbone",
        "decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ]
      },
      {
        "stem": "BONE",
        "target": "DRY",
        "hint": "BONE + DRY = Bone-dry",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "DRY",
        "target": "CLEAN",
        "hint": "DRY + CLEAN = Dry-clean",
        "decoys": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "CLEAN",
        "target": "UP",
        "hint": "CLEAN + UP = Cleanup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "UP",
        "target": "LIFT",
        "hint": "UP + LIFT = Uplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "BACK",
        "hint": "SET + BACK = Setback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "OUT",
        "hint": "DROP + OUT = Dropout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "DOWN",
        "hint": "BREAK + DOWN = Breakdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "SHIFT",
        "hint": "DOWN + SHIFT = Downshift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "SHIFT",
        "target": "WORK",
        "hint": "SHIFT + WORK = Shiftwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "FLOW",
        "hint": "WORK + FLOW = Workflow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "FLOW",
        "target": "CHART",
        "hint": "FLOW + CHART = Flowchart",
        "decoys": [
          "TART",
          "DART",
          "CART",
          "SMART"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "BOAT",
        "hint": "HOUSE + BOAT = Houseboat",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      },
      {
        "stem": "BOAT",
        "target": "SHOW",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "SHOW",
        "target": "ROOM",
        "hint": "SHOW + ROOM = Showroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      },
      {
        "stem": "ROOM",
        "target": "MATE",
        "hint": "ROOM + MATE = Roommate",
        "decoys": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ]
      },
      {
        "stem": "MATE",
        "target": "WORK",
        "hint": "MATE + WORK = Matework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "SHOP",
        "hint": "WORK + SHOP = Workshop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "SHOP",
        "target": "LIFT",
        "hint": "SHOP + LIFT = Shoplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "STAGE",
        "hint": "OFF + STAGE = Offstage",
        "decoys": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ]
      },
      {
        "stem": "STAGE",
        "target": "COACH",
        "hint": "STAGE + COACH = Stagecoach",
        "decoys": [
          "ROACH",
          "POACH",
          "BROOCH",
          "LOACH"
        ]
      },
      {
        "stem": "COACH",
        "target": "WORK",
        "hint": "COACH + WORK = Coachwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BENCH",
        "hint": "WORK + BENCH = Workbench",
        "decoys": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ]
      },
      {
        "stem": "BENCH",
        "target": "MARK",
        "hint": "BENCH + MARK = Benchmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "DOWN",
        "hint": "MARK + DOWN = Markdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TIME",
        "hint": "DOWN + TIME = Downtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "TIME",
        "target": "OUT",
        "hint": "TIME + OUT = Timeout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LOOK",
        "hint": "OUT + LOOK = Outlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "UP",
        "hint": "LOOK + UP = Lookup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "START",
        "hint": "UP + START = Upstart",
        "decoys": [
          "CART",
          "CHART",
          "SMART",
          "PART"
        ]
      },
      {
        "stem": "START",
        "target": "OVER",
        "hint": "START + OVER = Start over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "RUN",
        "hint": "OVER + RUN = Overrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "AWAY",
        "hint": "RUN + AWAY = Runaway",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      },
      {
        "stem": "AWAY",
        "target": "GAME",
        "hint": "AWAY + GAME = Away game",
        "decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ]
      },
      {
        "stem": "GAME",
        "target": "OVER",
        "hint": "GAME + OVER = Game over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "TURN",
        "hint": "OVER + TURN = Overturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OUT",
        "hint": "TURN + OUT = Turnout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BURST",
        "hint": "OUT + BURST = Outburst",
        "decoys": [
          "THIRST",
          "FIRST",
          "WORST",
          "HEARSE"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "FALL",
        "target": "OUT",
        "hint": "FALL + OUT = Fallout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "DOOR",
        "hint": "OUT + DOOR = Outdoor",
        "decoys": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ]
      },
      {
        "stem": "DOOR",
        "target": "MAT",
        "hint": "DOOR + MAT = Doormat",
        "decoys": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ]
      },
      {
        "stem": "MAT",
        "target": "BOARD",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "ROOM",
        "hint": "BOARD + ROOM = Boardroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      },
      {
        "stem": "ROOM",
        "target": "MATE",
        "hint": "ROOM + MATE = Roommate",
        "decoys": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ]
      },
      {
        "stem": "MATE",
        "target": "WORK",
        "hint": "MATE + WORK = Matework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "HORSE",
        "hint": "WORK + HORSE = Workhorse",
        "decoys": [
          "MORSE",
          "CORPSE",
          "REMORSE",
          "GORSE"
        ]
      },
      {
        "stem": "HORSE",
        "target": "BACK",
        "hint": "HORSE + BACK = Horseback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "FIRE",
        "hint": "BACK + FIRE = Backfire",
        "decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ]
      },
      {
        "stem": "FIRE",
        "target": "PLACE",
        "hint": "FIRE + PLACE = Fireplace",
        "decoys": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ]
      },
      {
        "stem": "PLACE",
        "target": "MAT",
        "hint": "PLACE + MAT = Placemat",
        "decoys": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ]
      },
      {
        "stem": "MAT",
        "target": "BOARD",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "WALK",
        "hint": "BOARD + WALK = Boardwalk",
        "decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ]
      },
      {
        "stem": "WALK",
        "target": "WAY",
        "hint": "WALK + WAY = Walkway",
        "decoys": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ]
      },
      {
        "stem": "WAY",
        "target": "SIDE",
        "hint": "WAY + SIDE = Wayside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "SIDE",
        "target": "LINE",
        "hint": "SIDE + LINE = Sideline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "HOLD",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "OUT",
        "hint": "HOLD + OUT = Holdout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LINE",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "DOWN",
        "hint": "LINE + DOWN = Linedown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TURN",
        "hint": "DOWN + TURN = Downturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OFF",
        "hint": "TURN + OFF = Turnoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "BEAT",
        "hint": "OFF + BEAT = Offbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "UP",
        "hint": "BEAT + UP = Beat up",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "SIDE",
        "hint": "UP + SIDE = Upside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "STEP",
        "hint": "SIDE + STEP = Sidestep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "HOUSE",
        "target": "HOLD",
        "hint": "HOUSE + HOLD = Household",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "OUT",
        "hint": "HOLD + OUT = Holdout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "FIELD",
        "hint": "OUT + FIELD = Outfield",
        "decoys": [
          "SHIELD",
          "WIELD",
          "PEELED",
          "SEALED"
        ]
      },
      {
        "stem": "FIELD",
        "target": "WORK",
        "hint": "FIELD + WORK = Fieldwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "DAY",
        "hint": "WORK + DAY = Workday",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      },
      {
        "stem": "DAY",
        "target": "LIGHT",
        "hint": "DAY + LIGHT = Daylight",
        "decoys": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ]
      },
      {
        "stem": "LIGHT",
        "target": "HOUSE",
        "hint": "LIGHT + HOUSE = Lighthouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "BOAT",
        "hint": "HOUSE + BOAT = Houseboat",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      },
      {
        "stem": "BOAT",
        "target": "SHOW",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "SHOW",
        "target": "CASE",
        "hint": "SHOW + CASE = Showcase",
        "decoys": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ]
      },
      {
        "stem": "CASE",
        "target": "BOOK",
        "hint": "CASE + BOOK = Casebook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "MARK",
        "hint": "BOOK + MARK = Bookmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "DOWN",
        "hint": "MARK + DOWN = Markdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "FALL",
        "hint": "DOWN + FALL = Downfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "BACK",
        "hint": "FALL + BACK = Fallback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "BONE",
        "hint": "BACK + BONE = Backbone",
        "decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "BONE",
        "target": "DRY",
        "hint": "BONE + DRY = Bone-dry",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "DRY",
        "target": "CLEAN",
        "hint": "DRY + CLEAN = Dry-clean",
        "decoys": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "CLEAN",
        "target": "UP",
        "hint": "CLEAN + UP = Cleanup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OVER",
        "hint": "TURN + OVER = Turnover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "TIME",
        "hint": "OVER + TIME = Overtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      },
      {
        "stem": "TIME",
        "target": "LINE",
        "hint": "TIME + LINE = Timeline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "OUT",
        "hint": "LINE + OUT = Lineout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "FALL",
        "hint": "OUT + FALL = Outfall",
        "decoys": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "OFF",
        "hint": "FALL + OFF = Falloff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SIDE",
        "hint": "OFF + SIDE = Offside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "WALK",
        "hint": "SIDE + WALK = Sidewalk",
        "decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "PORT",
        "target": "HOLE",
        "hint": "PORT + HOLE = Porthole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "PUNCH",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      },
      {
        "stem": "PUNCH",
        "target": "LINE",
        "hint": "PUNCH + LINE = Punchline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "TOWN",
        "hint": "UP + TOWN = Uptown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      },
      {
        "stem": "TOWN",
        "target": "SHIP",
        "hint": "TOWN + SHIP = Township",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      },
      {
        "stem": "SHIP",
        "target": "BOARD",
        "hint": "SHIP + BOARD = Shipboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "GAME",
        "hint": "BOARD + GAME = Board game",
        "decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ]
      },
      {
        "stem": "GAME",
        "target": "PLAN",
        "hint": "GAME + PLAN = Game plan",
        "decoys": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ]
      },
      {
        "stem": "PLAN",
        "target": "OUT",
        "hint": "PLAN + OUT = Plan out",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "POST",
        "hint": "OUT + POST = Outpost",
        "decoys": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ]
      },
      {
        "stem": "POST",
        "target": "CARD",
        "hint": "POST + CARD = Postcard",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      },
      {
        "stem": "CARD",
        "target": "BOARD",
        "hint": "CARD + BOARD = Cardboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "ROOM",
        "hint": "BOARD + ROOM = Boardroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      },
      {
        "stem": "ROOM",
        "target": "WORK",
        "hint": "ROOM + WORK = Roomwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "SHOP",
        "hint": "WORK + SHOP = Workshop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "SHOP",
        "target": "LIFT",
        "hint": "SHOP + LIFT = Shoplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "UP",
        "hint": "SET + UP = Setup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "LAND",
        "hint": "UP + LAND = Upland",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ]
      },
      {
        "stem": "LAND",
        "target": "MARK",
        "hint": "LAND + MARK = Landmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "DOWN",
        "hint": "MARK + DOWN = Markdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TOWN",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      },
      {
        "stem": "TOWN",
        "target": "HOUSE",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "TOP",
        "hint": "HOUSE + TOP = Housetop",
        "decoys": [
          "MOP",
          "CROP",
          "PLOP",
          "SLOP"
        ]
      },
      {
        "stem": "TOP",
        "target": "SIDE",
        "hint": "TOP + SIDE = Topside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "SHOW",
        "hint": "SIDE + SHOW = Sideshow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "WALL",
        "target": "FLOWER",
        "hint": "WALL + FLOWER = Wallflower",
        "decoys": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ]
      },
      {
        "stem": "FLOWER",
        "target": "POT",
        "hint": "FLOWER + POT = Flowerpot",
        "decoys": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ]
      },
      {
        "stem": "POT",
        "target": "HOLE",
        "hint": "POT + HOLE = Pothole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "CARD",
        "hint": "HOLE + CARD = Hole card",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      },
      {
        "stem": "CARD",
        "target": "SHARK",
        "hint": "CARD + SHARK = Card shark",
        "decoys": [
          "LARK",
          "SPARK",
          "BARK",
          "DARK"
        ]
      },
      {
        "stem": "SHARK",
        "target": "TANK",
        "hint": "SHARK + TANK = Shark tank",
        "decoys": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ]
      },
      {
        "stem": "TANK",
        "target": "TOP",
        "hint": "TANK + TOP = Tank top",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "TOP",
        "target": "DOG",
        "hint": "TOP + DOG = Top dog",
        "decoys": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ]
      },
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "WORK",
        "hint": "HOUSE + WORK = Housework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BOOK",
        "hint": "WORK + BOOK = Workbook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "CASE",
        "hint": "BOOK + CASE = Bookcase",
        "decoys": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ]
      },
      {
        "stem": "CASE",
        "target": "WORK",
        "hint": "CASE + WORK = Casework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "OUT",
        "hint": "WORK + OUT = Workout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "DOOR",
        "hint": "OUT + DOOR = Outdoor",
        "decoys": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ]
      },
      {
        "stem": "DOOR",
        "target": "STEP",
        "hint": "DOOR + STEP = Doorstep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "STEP",
        "target": "DOWN",
        "hint": "STEP + DOWN = Stepdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "FALL",
        "hint": "DOWN + FALL = Downfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "BACK",
        "hint": "FALL + BACK = Fallback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "HAND",
        "hint": "BACK + HAND = Backhand",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ]
      },
      {
        "stem": "HAND",
        "target": "BAG",
        "hint": "HAND + BAG = Handbag",
        "decoys": [
          "STAG",
          "CRAG",
          "BRAG",
          "SNAG"
        ]
      },
      {
        "stem": "BAG",
        "target": "PIPE",
        "hint": "BAG + PIPE = Bagpipe",
        "decoys": [
          "SNIPE",
          "STRIPE",
          "GRIPE",
          "SWIPE"
        ]
      },
      {
        "stem": "PIPE",
        "target": "LINE",
        "hint": "PIPE + LINE = Pipeline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "HOLD",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "OVER",
        "hint": "HOLD + OVER = Holdover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "FLOW",
        "hint": "OVER + FLOW = Overflow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "FLOW",
        "target": "CHART",
        "hint": "FLOW + CHART = Flowchart",
        "decoys": [
          "TART",
          "DART",
          "CART",
          "SMART"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "NOTE",
        "target": "BOOK",
        "hint": "NOTE + BOOK = Notebook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "WORM",
        "hint": "BOOK + WORM = Bookworm",
        "decoys": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ]
      },
      {
        "stem": "WORM",
        "target": "HOLE",
        "hint": "WORM + HOLE = Wormhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "PUNCH",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      },
      {
        "stem": "PUNCH",
        "target": "BOWL",
        "hint": "PUNCH + BOWL = Punch bowl",
        "decoys": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ]
      },
      {
        "stem": "BOWL",
        "target": "CUT",
        "hint": "BOWL + CUT = Bowl cut",
        "decoys": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ]
      },
      {
        "stem": "CUT",
        "target": "OUT",
        "hint": "CUT + OUT = Cutout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BACK",
        "hint": "OUT + BACK = Outback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "BOARD",
        "hint": "BACK + BOARD = Backboard",
        "decoys": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "WALK",
        "hint": "BOARD + WALK = Boardwalk",
        "decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ]
      },
      {
        "stem": "WALK",
        "target": "OUT",
        "hint": "WALK + OUT = Walkout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BURST",
        "hint": "OUT + BURST = Outburst",
        "decoys": [
          "THIRST",
          "FIRST",
          "WORST",
          "HEARSE"
        ]
      },
      {
        "stem": "BURST",
        "target": "IN",
        "hint": "BURST + IN = Burst in",
        "decoys": [
          "FIN",
          "CHIN",
          "SHIN",
          "GRIN"
        ]
      },
      {
        "stem": "IN",
        "target": "SIDE",
        "hint": "IN + SIDE = Inside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "STEP",
        "hint": "SIDE + STEP = Sidestep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      },
      {
        "stem": "STEP",
        "target": "STONE",
        "hint": "STEP + STONE = Stepping stone",
        "decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "STONE",
        "target": "WALL",
        "hint": "STONE + WALL = Stonewall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "WALL",
        "target": "PAPER",
        "hint": "WALL + PAPER = Wallpaper",
        "decoys": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ]
      },
      {
        "stem": "PAPER",
        "target": "BACK",
        "hint": "PAPER + BACK = Paperback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "OUT",
        "hint": "DROP + OUT = Dropout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "UP",
        "hint": "BREAK + UP = Breakup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "LIFT",
        "hint": "UP + LIFT = Uplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "BEAT",
        "hint": "OFF + BEAT = Offbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "DOWN",
        "hint": "BEAT + DOWN = Beatdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "POUR",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "SPACE",
        "target": "SHIP",
        "hint": "SPACE + SHIP = Spaceship",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      },
      {
        "stem": "SHIP",
        "target": "WRECK",
        "hint": "SHIP + WRECK = Shipwreck",
        "decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ]
      },
      {
        "stem": "WRECK",
        "target": "BALL",
        "hint": "WRECK + BALL = Wrecking ball",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "BALL",
        "target": "PARK",
        "hint": "BALL + PARK = Ballpark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "PARK",
        "target": "WAY",
        "hint": "PARK + WAY = Parkway",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      },
      {
        "stem": "WAY",
        "target": "SIDE",
        "hint": "WAY + SIDE = Wayside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "LINE",
        "hint": "SIDE + LINE = Sideline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "BEAT",
        "hint": "UP + BEAT = Upbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "BOX",
        "hint": "BEAT + BOX = Beatbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      },
      {
        "stem": "BOX",
        "target": "OFFICE",
        "hint": "BOX + OFFICE = Box office",
        "decoys": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ]
      },
      {
        "stem": "OFFICE",
        "target": "WORK",
        "hint": "OFFICE + WORK = Office work",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BENCH",
        "hint": "WORK + BENCH = Workbench",
        "decoys": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ]
      },
      {
        "stem": "BENCH",
        "target": "MARK",
        "hint": "BENCH + MARK = Benchmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "UP",
        "hint": "MARK + UP = Markup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "TURN",
        "target": "OUT",
        "hint": "TURN + OUT = Turnout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "FALL",
        "hint": "OUT + FALL = Outfall",
        "decoys": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "DOWN",
        "hint": "FALL + DOWN = Fall down",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TIME",
        "hint": "DOWN + TIME = Downtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      },
      {
        "stem": "TIME",
        "target": "OVER",
        "hint": "TIME + OVER = Time over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "LOOK",
        "hint": "OVER + LOOK = Overlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "OUT",
        "hint": "LOOK + OUT = Lookout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "RUN",
        "hint": "OUT + RUN = Outrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "OFF",
        "hint": "RUN + OFF = Runoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "BACK",
        "hint": "SET + BACK = Setback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "FIRE",
        "hint": "BACK + FIRE = Backfire",
        "decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "OUT",
        "target": "BACK",
        "hint": "OUT + BACK = Outback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "DOWN",
        "hint": "DROP + DOWN = Dropdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TOWN",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      },
      {
        "stem": "TOWN",
        "target": "HOUSE",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "FLY",
        "hint": "HOUSE + FLY = Housefly",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "FLY",
        "target": "OVER",
        "hint": "FLY + OVER = Flyover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "COAT",
        "hint": "OVER + COAT = Overcoat",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      },
      {
        "stem": "COAT",
        "target": "RACK",
        "hint": "COAT + RACK = Coatrack",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "RACK",
        "target": "UP",
        "hint": "RACK + UP = Rack up",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "LIFT",
        "hint": "UP + LIFT = Uplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "OUT",
        "hint": "SET + OUT = Set out",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LINE",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OVER",
        "hint": "TURN + OVER = Turnover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "SLEEP",
        "hint": "OVER + SLEEP = Oversleep",
        "decoys": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ]
      },
      {
        "stem": "SLEEP",
        "target": "WALK",
        "hint": "SLEEP + WALK = Sleepwalk",
        "decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ]
      },
      {
        "stem": "WALK",
        "target": "AWAY",
        "hint": "WALK + AWAY = Walkaway",
        "decoys": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ]
      },
      {
        "stem": "AWAY",
        "target": "GAME",
        "hint": "AWAY + GAME = Away game",
        "decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ]
      },
      {
        "stem": "GAME",
        "target": "PLAN",
        "hint": "GAME + PLAN = Game plan",
        "decoys": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ]
      },
      {
        "stem": "PLAN",
        "target": "OUT",
        "hint": "PLAN + OUT = Plan out",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LOOK",
        "hint": "OUT + LOOK = Outlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "OVER",
        "hint": "LOOK + OVER = Look over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "RUN",
        "hint": "OVER + RUN = Overrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "OUT",
        "hint": "RUN + OUT = Runout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "BIRD",
        "target": "BATH",
        "hint": "BIRD + BATH = Birdbath",
        "decoys": [
          "WRATH",
          "MATH",
          "MOTH",
          "BROTH"
        ]
      },
      {
        "stem": "BATH",
        "target": "ROBE",
        "hint": "BATH + ROBE = Bathrobe",
        "decoys": [
          "GLOBE",
          "PROBE",
          "LOBE",
          "STROBE"
        ]
      },
      {
        "stem": "ROBE",
        "target": "HOOK",
        "hint": "ROBE + HOOK = Robe hook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "HOOK",
        "target": "UP",
        "hint": "HOOK + UP = Hookup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "BEAT",
        "hint": "UP + BEAT = Upbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "BOX",
        "hint": "BEAT + BOX = Beatbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      },
      {
        "stem": "BOX",
        "target": "OFFICE",
        "hint": "BOX + OFFICE = Box office",
        "decoys": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ]
      },
      {
        "stem": "OFFICE",
        "target": "WORK",
        "hint": "OFFICE + WORK = Office work",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BOOK",
        "hint": "WORK + BOOK = Workbook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "WORM",
        "hint": "BOOK + WORM = Bookworm",
        "decoys": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ]
      },
      {
        "stem": "WORM",
        "target": "HOLE",
        "hint": "WORM + HOLE = Wormhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "CARD",
        "hint": "HOLE + CARD = Hole card",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      },
      {
        "stem": "CARD",
        "target": "SHARK",
        "hint": "CARD + SHARK = Card shark",
        "decoys": [
          "LARK",
          "SPARK",
          "BARK",
          "DARK"
        ]
      },
      {
        "stem": "SHARK",
        "target": "TANK",
        "hint": "SHARK + TANK = Shark tank",
        "decoys": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ]
      },
      {
        "stem": "TANK",
        "target": "TOP",
        "hint": "TANK + TOP = Tank top",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "TOP",
        "target": "DOG",
        "hint": "TOP + DOG = Top dog",
        "decoys": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ]
      }
    ],
    "zone3": [
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "FLY",
        "hint": "HOUSE + FLY = Housefly",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "FLY",
        "target": "TRAP",
        "hint": "FLY + TRAP = Flytrap",
        "decoys": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ]
      },
      {
        "stem": "TRAP",
        "target": "DOOR",
        "hint": "TRAP + DOOR = Trapdoor",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "DOOR",
        "target": "STEP",
        "hint": "DOOR + STEP = Doorstep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      },
      {
        "stem": "STEP",
        "target": "DOWN",
        "hint": "STEP + DOWN = Stepdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "POUR",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "POUR",
        "target": "OVER",
        "hint": "POUR + OVER = Pour-over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "RUN",
        "hint": "OVER + RUN = Overrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "OUT",
        "hint": "RUN + OUT = Runout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "UP",
        "hint": "BREAK + UP = Breakup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ]
  }
];

  const PRODUCTION_DAILY_VINES = [
  {
    "vineNumber": 142,
    "dateKey": "2026-11-01",
    "title": "🧁 Sweet Tooth & Kitchen Table",
    "themeIndex": 0,
    "themeKey": "sweet_tooth_kitchen",
    "themeIcon": "🧁",
    "themeName": "🧁 Sweet Tooth & Kitchen Table",
    "themeSubtitle": "Peanut butter cups, cupcakes, tabletops, bell peppers, peppermint & punch bowls",
    "themeId": 0,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 0,
    "zone1Triplets": [
      {
        "id": "peanut_butter_cup",
        "parts": [
          "PEANUT",
          "BUTTER",
          "CUP"
        ],
        "part2Hint": "PEANUT + BUTTER = Peanut butter",
        "part3Hint": "BUTTER + CUP = Buttercup (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SHUTTER",
          "CLUTTER",
          "FLUTTER",
          "MUTTER"
        ],
        "part3Decoys": [
          "PUP",
          "HICCUP",
          "STIRRUP",
          "GALLOP"
        ],
        "thematicLink": {
          "nextPart1": "CAKE",
          "connection": "2-Node Link",
          "hint": "CUP + CAKE = Cupcake",
          "decoys": [
            "SNAKE",
            "DRAKE",
            "FLAKE",
            "STEAK"
          ]
        }
      },
      {
        "id": "cake_walk_way",
        "parts": [
          "CAKE",
          "WALK",
          "WAY"
        ],
        "part2Hint": "CAKE + WALK = Cakewalk",
        "part3Hint": "WALK + WAY = Walkway (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "part3Decoys": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "thematicLink": {
          "nextPart1": "SIDE",
          "connection": "2-Node Link",
          "hint": "WAY + SIDE = Wayside",
          "decoys": [
            "BRIDE",
            "PRIDE",
            "GLIDE",
            "STRIDE"
          ]
        }
      },
      {
        "id": "side_show_case",
        "parts": [
          "SIDE",
          "SHOW",
          "CASE"
        ],
        "part2Hint": "SIDE + SHOW = Sideshow",
        "part3Hint": "SHOW + CASE = Showcase (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "part3Decoys": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "thematicLink": {
          "nextPart1": "WORK",
          "connection": "2-Node Link",
          "hint": "CASE + WORK = Casework",
          "decoys": [
            "SMIRK",
            "QUIRK",
            "CLERK",
            "PERK"
          ]
        }
      },
      {
        "id": "work_table_top",
        "parts": [
          "WORK",
          "TABLE",
          "TOP"
        ],
        "part2Hint": "WORK + TABLE = Worktable",
        "part3Hint": "TABLE + TOP = Tabletop (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "part3Decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "thematicLink": {
          "nextPart1": "DOG",
          "connection": "2-Node Link",
          "hint": "TOP + DOG = Top dog",
          "decoys": [
            "FOG",
            "BOG",
            "CLOG",
            "FROG"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "FLY",
        "hint": "HOUSE + FLY = Housefly",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "FLY",
        "target": "TRAP",
        "hint": "FLY + TRAP = Flytrap",
        "decoys": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ]
      },
      {
        "stem": "TRAP",
        "target": "DOOR",
        "hint": "TRAP + DOOR = Trapdoor",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "DOOR",
        "target": "BELL",
        "hint": "DOOR + BELL = Doorbell",
        "decoys": [
          "SPELL",
          "YELL",
          "SMELL",
          "DWELL"
        ]
      },
      {
        "stem": "BELL",
        "target": "PEPPER",
        "hint": "BELL + PEPPER = Bell pepper",
        "decoys": [
          "LEPER",
          "STEPPER",
          "ZIPPER",
          "SLIPPER"
        ]
      },
      {
        "stem": "PEPPER",
        "target": "MINT",
        "hint": "PEPPER + MINT = Peppermint",
        "decoys": [
          "LINT",
          "FLINT",
          "SQUINT",
          "SPRINT"
        ]
      },
      {
        "stem": "MINT",
        "target": "GREEN",
        "hint": "MINT + GREEN = Mint green",
        "decoys": [
          "QUEEN",
          "SCREEN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "GREEN",
        "target": "LIGHT",
        "hint": "GREEN + LIGHT = Greenlight",
        "decoys": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ]
      },
      {
        "stem": "LIGHT",
        "target": "YEAR",
        "hint": "LIGHT + YEAR = Lightyear",
        "decoys": [
          "SPEAR",
          "SMEAR",
          "SHEAR",
          "TEAR"
        ]
      },
      {
        "stem": "YEAR",
        "target": "BOOK",
        "hint": "YEAR + BOOK = Yearbook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "WORM",
        "hint": "BOOK + WORM = Bookworm",
        "decoys": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ]
      },
      {
        "stem": "WORM",
        "target": "HOLE",
        "hint": "WORM + HOLE = Wormhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "PUNCH",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      },
      {
        "stem": "PUNCH",
        "target": "BOWL",
        "hint": "PUNCH + BOWL = Punch bowl",
        "decoys": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ]
      },
      {
        "stem": "BOWL",
        "target": "CUT",
        "hint": "BOWL + CUT = Bowl cut",
        "decoys": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "CUT",
        "target": "OUT",
        "hint": "CUT + OUT = Cutout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BACK",
        "hint": "OUT + BACK = Outback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "DOWN",
        "hint": "DROP + DOWN = Dropdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "POUR",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "POUR",
        "target": "OVER",
        "hint": "POUR + OVER = Pour-over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "SLEEP",
        "hint": "OVER + SLEEP = Oversleep",
        "decoys": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ]
      },
      {
        "stem": "SLEEP",
        "target": "WALK",
        "hint": "SLEEP + WALK = Sleepwalk",
        "decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ]
      },
      {
        "stem": "WALK",
        "target": "OUT",
        "hint": "WALK + OUT = Walkout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "DOWN",
        "hint": "BREAK + DOWN = Breakdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TURN",
        "hint": "DOWN + TURN = Downturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "PEANUT",
        "displayStem": "PEANUT",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BUTTER",
        "decoyPool": [
          "SHUTTER",
          "CLUTTER",
          "FLUTTER",
          "MUTTER"
        ],
        "decoyWord": "SHUTTER",
        "leftRightSeed": 0,
        "compoundHint": "PEANUT + BUTTER = Peanut butter"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "BUTTER",
        "displayStem": "BUTTER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "CUP",
        "decoyPool": [
          "PUP",
          "HICCUP",
          "STIRRUP",
          "GALLOP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 1,
        "compoundHint": "BUTTER + CUP = Buttercup (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CUP",
        "displayStem": "CUP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CAKE",
        "decoyPool": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ],
        "decoyWord": "SNAKE",
        "leftRightSeed": 0,
        "compoundHint": "CUP + CAKE = Cupcake"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CAKE",
        "displayStem": "⬅ CAKE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "PAN",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "CAKE + WALK = Cakewalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ PAN + CAKE = Pancake (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of CAKE: PAN + CAKE = Pancake. You have to resist the forward trap WALK (CAKE + WALK = Cakewalk)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "PAN",
        "displayStem": "PAN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "HANDLE",
        "decoyPool": [
          "CANDLE",
          "SANDAL",
          "BUNDLE",
          "SPINDLE"
        ],
        "decoyWord": "CANDLE",
        "leftRightSeed": 0,
        "compoundHint": "PAN + HANDLE = Panhandle"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "HANDLE",
        "displayStem": "HANDLE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BAR",
        "decoyPool": [
          "JAR",
          "SCAR",
          "STAR",
          "TAR"
        ],
        "decoyWord": "JAR",
        "leftRightSeed": 1,
        "compoundHint": "HANDLE + BAR = Handlebar (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BAR",
        "displayStem": "BAR",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BELL",
        "decoyPool": [
          "SHELL",
          "SPELL",
          "WELL",
          "YELL"
        ],
        "decoyWord": "SHELL",
        "leftRightSeed": 0,
        "compoundHint": "BAR + BELL = Barbell"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BELL",
        "displayStem": "⬅ BELL",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "DOOR",
        "decoyPool": [
          "PEPPER"
        ],
        "decoyWord": "PEPPER",
        "trapCompoundHint": "BELL + PEPPER = Bell pepper",
        "leftRightSeed": 1,
        "compoundHint": "⬅ DOOR + BELL = Doorbell (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BELL: DOOR + BELL = Doorbell. You have to resist the forward trap PEPPER (BELL + PEPPER = Bell pepper)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "DOOR",
        "displayStem": "DOOR",
        "stemBadge": "3-NODE LINK",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "leftRightSeed": 0,
        "compoundHint": "DOOR + STEP = Doorstep"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "stemBadge": "3-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 1,
        "compoundHint": "STEP + DOWN = Stepdown (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 0,
        "compoundHint": "DOWN + TIME = Downtime"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "⬅ TIME",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OVER",
        "decoyPool": [
          "TABLE"
        ],
        "decoyWord": "TABLE",
        "trapCompoundHint": "TIME + TABLE = Timetable",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OVER + TIME = Overtime (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TIME: OVER + TIME = Overtime. You have to resist the forward trap TABLE (TIME + TABLE = Timetable)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "OVER + LOOK = Overlook"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 1,
        "compoundHint": "LOOK + OUT = Lookout (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "OUT + BACK = Outback"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "⬅ BACK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FALL",
        "decoyPool": [
          "DROP"
        ],
        "decoyWord": "DROP",
        "trapCompoundHint": "BACK + DROP = Backdrop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FALL + BACK = Fallback (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BACK: FALL + BACK = Fallback. You have to resist the forward trap DROP (BACK + DROP = Backdrop)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "FALL + OFF = Falloff"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 1,
        "compoundHint": "OFF + SIDE = Offside (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + BOARD = Sideboard"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "PARK",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ PARK + BOARD = Park board (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: PARK + BOARD = Park board. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PARK",
        "displayStem": "PARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "leftRightSeed": 0,
        "compoundHint": "PARK + BENCH = Park bench"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BENCH",
        "displayStem": "BENCH",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 1,
        "compoundHint": "BENCH + MARK = Benchmark (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "MARK + UP = Markup"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "⬅ UP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "LINE",
        "decoyPool": [
          "TURN"
        ],
        "decoyWord": "TURN",
        "trapCompoundHint": "UP + TURN = Upturn",
        "leftRightSeed": 1,
        "compoundHint": "⬅ LINE + UP = Lineup (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of UP: LINE + UP = Lineup. You have to resist the forward trap TURN (UP + TURN = Upturn)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "LINE + OUT = Lineout"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "OUT + FALL = Outfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "FALL + DOWN = Fall down"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "⬅ DOWN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SHOW",
        "decoyPool": [
          "POUR"
        ],
        "decoyWord": "POUR",
        "trapCompoundHint": "DOWN + POUR = Downpour",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SHOW + DOWN = Showdown (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOWN: SHOW + DOWN = Showdown. You have to resist the forward trap POUR (DOWN + POUR = Downpour)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CASE",
        "decoyPool": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "decoyWord": "VASE",
        "leftRightSeed": 0,
        "compoundHint": "SHOW + CASE = Showcase"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "CASE + WORK = Casework (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "WORK + BOOK = Workbook"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOOK",
        "displayStem": "⬅ BOOK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "NOTE",
        "decoyPool": [
          "WORM"
        ],
        "decoyWord": "WORM",
        "trapCompoundHint": "BOOK + WORM = Bookworm",
        "leftRightSeed": 1,
        "compoundHint": "⬅ NOTE + BOOK = Notebook (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOOK: NOTE + BOOK = Notebook. You have to resist the forward trap WORM (BOOK + WORM = Bookworm)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "NOTE",
        "displayStem": "NOTE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "PAD",
        "decoyPool": [
          "PLAID",
          "GLAD",
          "CLAD",
          "BRAD"
        ],
        "decoyWord": "PLAID",
        "leftRightSeed": 0,
        "compoundHint": "NOTE + PAD = Notepad"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PAD",
        "displayStem": "PAD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "decoyWord": "FLOCK",
        "leftRightSeed": 1,
        "compoundHint": "PAD + LOCK = Padlock (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOCK",
        "displayStem": "LOCK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOX",
        "decoyPool": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "decoyWord": "FOX",
        "leftRightSeed": 0,
        "compoundHint": "LOCK + BOX = Lockbox"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOX",
        "displayStem": "⬅ BOX",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BEAT",
        "decoyPool": [
          "CAR"
        ],
        "decoyWord": "CAR",
        "trapCompoundHint": "BOX + CAR = Boxcar",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BEAT + BOX = Beatbox (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOX: BEAT + BOX = Beatbox. You have to resist the forward trap CAR (BOX + CAR = Boxcar)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BEAT",
        "displayStem": "BEAT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "BEAT + UP = Beat up"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 1,
        "compoundHint": "UP + SIDE = Upside (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "⬅ SIDE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TOP",
        "decoyPool": [
          "SHOW"
        ],
        "decoyWord": "SHOW",
        "trapCompoundHint": "SIDE + SHOW = Sideshow",
        "leftRightSeed": 0,
        "compoundHint": "⬅ TOP + SIDE = Topside (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of SIDE: TOP + SIDE = Topside. You have to resist the forward trap SHOW (SIDE + SHOW = Sideshow)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TOP",
        "displayStem": "TOP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOG",
        "decoyPool": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ],
        "decoyWord": "FOG",
        "leftRightSeed": 1,
        "compoundHint": "TOP + DOG = Top dog"
      }
    ]
  },
  {
    "vineNumber": 143,
    "dateKey": "2026-11-02",
    "title": "🎭 Center Stage & Spotlight",
    "themeIndex": 1,
    "themeKey": "center_stage_showbiz",
    "themeIcon": "🎭",
    "themeName": "🎭 Center Stage & Spotlight",
    "themeSubtitle": "Stagecoaches, ballpoints, checkpoints, roadblocks & high-speed showdowns",
    "themeId": 1,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 1,
    "zone1Triplets": [
      {
        "id": "sun_flower_pot",
        "parts": [
          "SUN",
          "FLOWER",
          "POT"
        ],
        "part2Hint": "SUN + FLOWER = Sunflower",
        "part3Hint": "FLOWER + POT = Flowerpot (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ],
        "part3Decoys": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ],
        "thematicLink": {
          "nextPart1": "BELLY",
          "connection": "2-Node Link",
          "hint": "POT + BELLY = Potbelly",
          "decoys": [
            "JELLY",
            "CELLO",
            "FELLOW",
            "TRELLIS"
          ]
        }
      },
      {
        "id": "belly_button_hole",
        "parts": [
          "BELLY",
          "BUTTON",
          "HOLE"
        ],
        "part2Hint": "BELLY + BUTTON = Belly button",
        "part3Hint": "BUTTON + HOLE = Buttonhole (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "MUTTON",
          "GLUTTON",
          "CARTON",
          "PISTON"
        ],
        "part3Decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "thematicLink": {
          "nextPart1": "PUNCH",
          "connection": "2-Node Link",
          "hint": "HOLE + PUNCH = Hole punch",
          "decoys": [
            "LUNCH",
            "HUNCH",
            "CRUNCH",
            "BRUNCH"
          ]
        }
      },
      {
        "id": "punch_bowl_cut",
        "parts": [
          "PUNCH",
          "BOWL",
          "CUT"
        ],
        "part2Hint": "PUNCH + BOWL = Punch bowl",
        "part3Hint": "BOWL + CUT = Bowl cut (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ],
        "part3Decoys": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "thematicLink": {
          "nextPart1": "BACK",
          "connection": "2-Node Link",
          "hint": "CUT + BACK = Cutback",
          "decoys": [
            "QUACK",
            "SNACK",
            "SHACK",
            "PLAQUE"
          ]
        }
      },
      {
        "id": "back_stage_coach",
        "parts": [
          "BACK",
          "STAGE",
          "COACH"
        ],
        "part2Hint": "BACK + STAGE = Backstage",
        "part3Hint": "STAGE + COACH = Stagecoach (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ],
        "part3Decoys": [
          "ROACH",
          "POACH",
          "BROOCH",
          "LOACH"
        ],
        "thematicLink": {
          "nextPart1": "CLASS",
          "connection": "2-Node Link",
          "hint": "COACH + CLASS = Coach class",
          "decoys": [
            "BRASS",
            "LASS",
            "CRASS",
            "MORASS"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "CLASS",
        "target": "WORK",
        "hint": "CLASS + WORK = Classwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "SPACE",
        "hint": "WORK + SPACE = Workspace",
        "decoys": [
          "MACE",
          "BRACE",
          "GRACE",
          "VASE"
        ]
      },
      {
        "stem": "SPACE",
        "target": "SHIP",
        "hint": "SPACE + SHIP = Spaceship",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      },
      {
        "stem": "SHIP",
        "target": "WRECK",
        "hint": "SHIP + WRECK = Shipwreck",
        "decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ]
      },
      {
        "stem": "WRECK",
        "target": "BALL",
        "hint": "WRECK + BALL = Wrecking ball",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "BALL",
        "target": "POINT",
        "hint": "BALL + POINT = Ballpoint",
        "decoys": [
          "JOINT",
          "ANOINT",
          "CONJOINT",
          "DISJOINT"
        ]
      },
      {
        "stem": "POINT",
        "target": "BLANK",
        "hint": "POINT + BLANK = Point-blank",
        "decoys": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ]
      },
      {
        "stem": "BLANK",
        "target": "CHECK",
        "hint": "BLANK + CHECK = Blank check",
        "decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ]
      },
      {
        "stem": "CHECK",
        "target": "POINT",
        "hint": "CHECK + POINT = Checkpoint",
        "decoys": [
          "JOINT",
          "ANOINT",
          "CONJOINT",
          "DISJOINT"
        ]
      },
      {
        "stem": "POINT",
        "target": "GUARD",
        "hint": "POINT + GUARD = Point guard",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "CHARD"
        ]
      },
      {
        "stem": "GUARD",
        "target": "RAIL",
        "hint": "GUARD + RAIL = Guardrail",
        "decoys": [
          "SNAIL",
          "QUAIL",
          "FLAIL",
          "GRAIL"
        ]
      },
      {
        "stem": "RAIL",
        "target": "ROAD",
        "hint": "RAIL + ROAD = Railroad",
        "decoys": [
          "TOAD",
          "GOAD",
          "ABODE",
          "EPISODE"
        ]
      },
      {
        "stem": "ROAD",
        "target": "BLOCK",
        "hint": "ROAD + BLOCK = Roadblock",
        "decoys": [
          "FLOCK",
          "CLOCK",
          "SMOCK",
          "CROCK"
        ]
      },
      {
        "stem": "BLOCK",
        "target": "HEAD",
        "hint": "BLOCK + HEAD = Blockhead",
        "decoys": [
          "BREAD",
          "THREAD",
          "DREAD",
          "TREAD"
        ]
      },
      {
        "stem": "HEAD",
        "target": "START",
        "hint": "HEAD + START = Head start",
        "decoys": [
          "TART",
          "DART",
          "CART",
          "CHART"
        ]
      },
      {
        "stem": "START",
        "target": "UP",
        "hint": "START + UP = Startup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OVER",
        "hint": "TURN + OVER = Turnover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "LOOK",
        "hint": "OVER + LOOK = Overlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "OUT",
        "hint": "LOOK + OUT = Lookout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LINE",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "HOLD",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "BACK",
        "hint": "HOLD + BACK = Holdback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "FIRE",
        "hint": "BACK + FIRE = Backfire",
        "decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ]
      },
      {
        "stem": "FIRE",
        "target": "WORK",
        "hint": "FIRE + WORK = Firework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "OUT",
        "hint": "WORK + OUT = Workout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "RUN",
        "hint": "OUT + RUN = Outrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "SUN",
        "displayStem": "SUN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "FLOWER",
        "decoyPool": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ],
        "decoyWord": "TOWER",
        "leftRightSeed": 0,
        "compoundHint": "SUN + FLOWER = Sunflower"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "FLOWER",
        "displayStem": "FLOWER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "POT",
        "decoyPool": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ],
        "decoyWord": "BLOT",
        "leftRightSeed": 1,
        "compoundHint": "FLOWER + POT = Flowerpot (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "POT",
        "displayStem": "POT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "leftRightSeed": 0,
        "compoundHint": "POT + HOLE = Pothole"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLE",
        "displayStem": "⬅ HOLE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "KEY",
        "decoyPool": [
          "PUNCH"
        ],
        "decoyWord": "PUNCH",
        "trapCompoundHint": "HOLE + PUNCH = Hole punch",
        "leftRightSeed": 1,
        "compoundHint": "⬅ KEY + HOLE = Keyhole (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of HOLE: KEY + HOLE = Keyhole. You have to resist the forward trap PUNCH (HOLE + PUNCH = Hole punch)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "KEY",
        "displayStem": "KEY",
        "stemBadge": "3-NODE LINK",
        "correctWord": "NOTE",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "leftRightSeed": 0,
        "compoundHint": "KEY + NOTE = Keynote"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "NOTE",
        "displayStem": "NOTE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 1,
        "compoundHint": "NOTE + BOOK = Notebook (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 0,
        "compoundHint": "BOOK + MARK = Bookmark"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "⬅ MARK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "POST",
        "decoyPool": [
          "DOWN"
        ],
        "decoyWord": "DOWN",
        "trapCompoundHint": "MARK + DOWN = Markdown",
        "leftRightSeed": 1,
        "compoundHint": "⬅ POST + MARK = Postmark (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of MARK: POST + MARK = Postmark. You have to resist the forward trap DOWN (MARK + DOWN = Markdown)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "3-NODE LINK",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "leftRightSeed": 0,
        "compoundHint": "POST + CARD = Postcard"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 1,
        "compoundHint": "CARD + BOARD = Cardboard (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "leftRightSeed": 0,
        "compoundHint": "BOARD + WALK = Boardwalk"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "⬅ WALK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "WAY"
        ],
        "decoyWord": "WAY",
        "trapCompoundHint": "WALK + WAY = Walkway",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SIDE + WALK = Sidewalk (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WALK: SIDE + WALK = Sidewalk. You have to resist the forward trap WAY (WALK + WAY = Walkway)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + SHOW = Sideshow"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "leftRightSeed": 1,
        "compoundHint": "SHOW + ROOM = Showroom (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "ROOM + WORK = Roomwork"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FIRE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FIRE + WORK = Firework (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: FIRE + WORK = Firework. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "PLACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "leftRightSeed": 0,
        "compoundHint": "FIRE + PLACE = Fireplace"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PLACE",
        "displayStem": "PLACE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "leftRightSeed": 1,
        "compoundHint": "PLACE + MAT = Placemat (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MAT",
        "displayStem": "MAT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "MAT + BOARD = Matboard"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BACK",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BACK + BOARD = Backboard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: BACK + BOARD = Backboard. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TROTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "leftRightSeed": 0,
        "compoundHint": "BACK + WATER = Backwater"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "WATER + FALL = Waterfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "FALL + OUT = Fallout"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TIME + OVER = Time over"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "leftRightSeed": 1,
        "compoundHint": "OVER + RUN = Overrun (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "AWAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "leftRightSeed": 0,
        "compoundHint": "RUN + AWAY = Runaway"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "AWAY",
        "displayStem": "⬅ AWAY",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WALK",
        "decoyPool": [
          "GAME"
        ],
        "decoyWord": "GAME",
        "trapCompoundHint": "AWAY + GAME = Away game",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WALK + AWAY = Walkaway (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of AWAY: WALK + AWAY = Walkaway. You have to resist the forward trap GAME (AWAY + GAME = Away game)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "decoyWord": "CLAY",
        "leftRightSeed": 0,
        "compoundHint": "WALK + WAY = Walkway"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 1,
        "compoundHint": "WAY + SIDE = Wayside (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + LINE = Sideline"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "⬅ LINE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OUT",
        "decoyPool": [
          "UP"
        ],
        "decoyWord": "UP",
        "trapCompoundHint": "LINE + UP = Lineup",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OUT + LINE = Outline (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of LINE: OUT + LINE = Outline. You have to resist the forward trap UP (LINE + UP = Lineup)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "POST",
        "decoyPool": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ],
        "decoyWord": "GHOST",
        "leftRightSeed": 0,
        "compoundHint": "OUT + POST = Outpost"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFFICE",
        "decoyPool": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ],
        "decoyWord": "NOVICE",
        "leftRightSeed": 1,
        "compoundHint": "POST + OFFICE = Post office (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFFICE",
        "displayStem": "OFFICE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SPACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "leftRightSeed": 0,
        "compoundHint": "OFFICE + SPACE = Office space"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SPACE",
        "displayStem": "⬅ SPACE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WORK",
        "decoyPool": [
          "SHIP"
        ],
        "decoyWord": "SHIP",
        "trapCompoundHint": "SPACE + SHIP = Spaceship",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WORK + SPACE = Workspace (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of SPACE: WORK + SPACE = Workspace. You have to resist the forward trap SHIP (SPACE + SHIP = Spaceship)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TABLE",
        "decoyPool": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "decoyWord": "FABLE",
        "leftRightSeed": 0,
        "compoundHint": "WORK + TABLE = Worktable"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TABLE",
        "displayStem": "TABLE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "leftRightSeed": 1,
        "compoundHint": "TABLE + TOP = Tabletop (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TOP",
        "displayStem": "⬅ TOP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "HOUSE",
        "decoyPool": [
          "DOG"
        ],
        "decoyWord": "DOG",
        "trapCompoundHint": "TOP + DOG = Top dog",
        "leftRightSeed": 0,
        "compoundHint": "⬅ HOUSE + TOP = Housetop (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TOP: HOUSE + TOP = Housetop. You have to resist the forward trap DOG (TOP + DOG = Top dog)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOLD",
        "decoyPool": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ],
        "decoyWord": "MOLD",
        "leftRightSeed": 1,
        "compoundHint": "HOUSE + HOLD = Household"
      }
    ]
  },
  {
    "vineNumber": 144,
    "dateKey": "2026-11-03",
    "title": "🏟️ Ballpark & Backcountry",
    "themeIndex": 2,
    "themeKey": "game_day_arena",
    "themeIcon": "🏟️",
    "themeName": "🏟️ Ballpark & Backcountry",
    "themeSubtitle": "Snowballs, ballparks, houseboats, horseshoes, beanbags, bagpipes & dreamlands",
    "themeId": 2,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 2,
    "zone1Triplets": [
      {
        "id": "snow_ball_park",
        "parts": [
          "SNOW",
          "BALL",
          "PARK"
        ],
        "part2Hint": "SNOW + BALL = Snowball",
        "part3Hint": "BALL + PARK = Ballpark (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "part3Decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "thematicLink": {
          "nextPart1": "BENCH",
          "connection": "2-Node Link",
          "hint": "PARK + BENCH = Park bench",
          "decoys": [
            "WRENCH",
            "TRENCH",
            "STENCH",
            "QUENCH"
          ]
        }
      },
      {
        "id": "bench_mark_down",
        "parts": [
          "BENCH",
          "MARK",
          "DOWN"
        ],
        "part2Hint": "BENCH + MARK = Benchmark",
        "part3Hint": "MARK + DOWN = Markdown (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "part3Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "thematicLink": {
          "nextPart1": "TOWN",
          "connection": "2-Node Link",
          "hint": "DOWN + TOWN = Downtown",
          "decoys": [
            "CLOWN",
            "CROWN",
            "GOWN",
            "FROWN"
          ]
        }
      },
      {
        "id": "town_house_boat",
        "parts": [
          "TOWN",
          "HOUSE",
          "BOAT"
        ],
        "part2Hint": "TOWN + HOUSE = Townhouse",
        "part3Hint": "HOUSE + BOAT = Houseboat (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "part3Decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "thematicLink": {
          "nextPart1": "SHOW",
          "connection": "2-Node Link",
          "hint": "BOAT + SHOW = Boat show",
          "decoys": [
            "CROW",
            "GLOW",
            "DOUGH",
            "TOE"
          ]
        }
      },
      {
        "id": "show_case_work",
        "parts": [
          "SHOW",
          "CASE",
          "WORK"
        ],
        "part2Hint": "SHOW + CASE = Showcase",
        "part3Hint": "CASE + WORK = Casework (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "part3Decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "thematicLink": {
          "nextPart1": "HORSE",
          "connection": "2-Node Link",
          "hint": "WORK + HORSE = Workhorse",
          "decoys": [
            "MORSE",
            "CORPSE",
            "REMORSE",
            "GORSE"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "HORSE",
        "target": "SHOE",
        "hint": "HORSE + SHOE = Horseshoe",
        "decoys": [
          "CANOE",
          "IGLOO",
          "BAMBOO",
          "KAZOO"
        ]
      },
      {
        "stem": "SHOE",
        "target": "STRING",
        "hint": "SHOE + STRING = Shoestring",
        "decoys": [
          "SPRING",
          "SWING",
          "FLING",
          "CLING"
        ]
      },
      {
        "stem": "STRING",
        "target": "BEAN",
        "hint": "STRING + BEAN = String bean",
        "decoys": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "BEAN",
        "target": "BAG",
        "hint": "BEAN + BAG = Beanbag",
        "decoys": [
          "STAG",
          "CRAG",
          "BRAG",
          "SNAG"
        ]
      },
      {
        "stem": "BAG",
        "target": "PIPE",
        "hint": "BAG + PIPE = Bagpipe",
        "decoys": [
          "SNIPE",
          "STRIPE",
          "GRIPE",
          "SWIPE"
        ]
      },
      {
        "stem": "PIPE",
        "target": "DREAM",
        "hint": "PIPE + DREAM = Pipe dream",
        "decoys": [
          "CREAM",
          "STEAM",
          "GLEAM",
          "SEAM"
        ]
      },
      {
        "stem": "DREAM",
        "target": "LAND",
        "hint": "DREAM + LAND = Dreamland",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ]
      },
      {
        "stem": "LAND",
        "target": "SLIDE",
        "hint": "LAND + SLIDE = Landslide",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SLIDE",
        "target": "SHOW",
        "hint": "SLIDE + SHOW = Slideshow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "SHOW",
        "target": "DOWN",
        "hint": "SHOW + DOWN = Showdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "FALL",
        "hint": "DOWN + FALL = Downfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "BACK",
        "hint": "FALL + BACK = Fallback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "BONE",
        "hint": "BACK + BONE = Backbone",
        "decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ]
      },
      {
        "stem": "BONE",
        "target": "DRY",
        "hint": "BONE + DRY = Bone-dry",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "DRY",
        "target": "CLEAN",
        "hint": "DRY + CLEAN = Dry-clean",
        "decoys": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "CLEAN",
        "target": "UP",
        "hint": "CLEAN + UP = Cleanup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "UP",
        "target": "LIFT",
        "hint": "UP + LIFT = Uplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "BACK",
        "hint": "SET + BACK = Setback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "OUT",
        "hint": "DROP + OUT = Dropout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "DOWN",
        "hint": "BREAK + DOWN = Breakdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "SHIFT",
        "hint": "DOWN + SHIFT = Downshift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "SHIFT",
        "target": "WORK",
        "hint": "SHIFT + WORK = Shiftwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "FLOW",
        "hint": "WORK + FLOW = Workflow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "FLOW",
        "target": "CHART",
        "hint": "FLOW + CHART = Flowchart",
        "decoys": [
          "TART",
          "DART",
          "CART",
          "SMART"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "SNOW",
        "displayStem": "SNOW",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 0,
        "compoundHint": "SNOW + BALL = Snowball"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "BALL",
        "displayStem": "BALL",
        "stemBadge": "3-NODE LINK",
        "correctWord": "PARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 1,
        "compoundHint": "BALL + PARK = Ballpark (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PARK",
        "displayStem": "PARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "leftRightSeed": 0,
        "compoundHint": "PARK + BENCH = Park bench"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BENCH",
        "displayStem": "⬅ BENCH",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WORK",
        "decoyPool": [
          "MARK"
        ],
        "decoyWord": "MARK",
        "trapCompoundHint": "BENCH + MARK = Benchmark",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WORK + BENCH = Workbench (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BENCH: WORK + BENCH = Workbench. You have to resist the forward trap MARK (BENCH + MARK = Benchmark)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "3-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "3-NODE LINK",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "leftRightSeed": 1,
        "compoundHint": "OUT + RUN = Outrun (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "RUN + OFF = Runoff"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "⬅ OFF",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TURN",
        "decoyPool": [
          "SET"
        ],
        "decoyWord": "SET",
        "trapCompoundHint": "OFF + SET = Offset",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TURN + OFF = Turnoff (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OFF: TURN + OFF = Turnoff. You have to resist the forward trap SET (OFF + SET = Offset)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TURN + OVER = Turnover"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SLEEP",
        "decoyPool": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ],
        "decoyWord": "SHEEP",
        "leftRightSeed": 1,
        "compoundHint": "OVER + SLEEP = Oversleep (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SLEEP",
        "displayStem": "SLEEP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 0,
        "compoundHint": "SLEEP + WALK = Sleepwalk"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "⬅ WALK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "WAY"
        ],
        "decoyWord": "WAY",
        "trapCompoundHint": "WALK + WAY = Walkway",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SIDE + WALK = Sidewalk (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WALK: SIDE + WALK = Sidewalk. You have to resist the forward trap WAY (WALK + WAY = Walkway)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + STEP = Sidestep"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 1,
        "compoundHint": "STEP + DOWN = Stepdown (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 0,
        "compoundHint": "DOWN + FALL = Downfall"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "⬅ FALL",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WATER",
        "decoyPool": [
          "BACK"
        ],
        "decoyWord": "BACK",
        "trapCompoundHint": "FALL + BACK = Fallback",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WATER + FALL = Waterfall (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of FALL: WATER + FALL = Waterfall. You have to resist the forward trap BACK (FALL + BACK = Fallback)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BED",
        "decoyPool": [
          "SLED",
          "SHED",
          "THREAD",
          "BREAD"
        ],
        "decoyWord": "SLED",
        "leftRightSeed": 0,
        "compoundHint": "WATER + BED = Waterbed"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BED",
        "displayStem": "BED",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "BED + TIME = Bedtime (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "leftRightSeed": 0,
        "compoundHint": "TIME + LINE = Timeline"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "⬅ LINE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "PUNCH",
        "decoyPool": [
          "UP"
        ],
        "decoyWord": "UP",
        "trapCompoundHint": "LINE + UP = Lineup",
        "leftRightSeed": 1,
        "compoundHint": "⬅ PUNCH + LINE = Punchline (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of LINE: PUNCH + LINE = Punchline. You have to resist the forward trap UP (LINE + UP = Lineup)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PUNCH",
        "displayStem": "PUNCH",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOWL",
        "decoyPool": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ],
        "decoyWord": "OWL",
        "leftRightSeed": 0,
        "compoundHint": "PUNCH + BOWL = Punch bowl"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOWL",
        "displayStem": "BOWL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CUT",
        "decoyPool": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "decoyWord": "HUT",
        "leftRightSeed": 1,
        "compoundHint": "BOWL + CUT = Bowl cut (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CUT",
        "displayStem": "CUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "CUT + OUT = Cutout"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "HOLD",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ HOLD + OUT = Holdout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: HOLD + OUT = Holdout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "HOLD + OVER = Holdover"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "OVER + TIME = Overtime (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TABLE",
        "decoyPool": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "decoyWord": "FABLE",
        "leftRightSeed": 0,
        "compoundHint": "TIME + TABLE = Timetable"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TABLE",
        "displayStem": "⬅ TABLE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WORK",
        "decoyPool": [
          "TOP"
        ],
        "decoyWord": "TOP",
        "trapCompoundHint": "TABLE + TOP = Tabletop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WORK + TABLE = Worktable (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TABLE: WORK + TABLE = Worktable. You have to resist the forward trap TOP (TABLE + TOP = Tabletop)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HORSE",
        "decoyPool": [
          "MORSE",
          "CORPSE",
          "REMORSE",
          "GORSE"
        ],
        "decoyWord": "MORSE",
        "leftRightSeed": 0,
        "compoundHint": "WORK + HORSE = Workhorse"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HORSE",
        "displayStem": "HORSE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 1,
        "compoundHint": "HORSE + BACK = Horseback (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DROP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "leftRightSeed": 0,
        "compoundHint": "BACK + DROP = Backdrop"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DROP",
        "displayStem": "⬅ DROP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "RAIN",
        "decoyPool": [
          "DOWN"
        ],
        "decoyWord": "DOWN",
        "trapCompoundHint": "DROP + DOWN = Dropdown",
        "leftRightSeed": 1,
        "compoundHint": "⬅ RAIN + DROP = Raindrop (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DROP: RAIN + DROP = Raindrop. You have to resist the forward trap DOWN (DROP + DOWN = Dropdown)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RAIN",
        "displayStem": "RAIN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TOTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "leftRightSeed": 0,
        "compoundHint": "RAIN + WATER = Rainwater"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MELON",
        "decoyPool": [
          "FELON",
          "LEMON",
          "HERON",
          "TALON"
        ],
        "decoyWord": "FELON",
        "leftRightSeed": 1,
        "compoundHint": "WATER + MELON = Watermelon (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MELON",
        "displayStem": "MELON",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SEED",
        "decoyPool": [
          "STEED",
          "TWEED",
          "GREED",
          "CREED"
        ],
        "decoyWord": "STEED",
        "leftRightSeed": 0,
        "compoundHint": "MELON + SEED = Melon seed"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SEED",
        "displayStem": "⬅ SEED",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BIRD",
        "decoyPool": [
          "BED"
        ],
        "decoyWord": "BED",
        "trapCompoundHint": "SEED + BED = Seedbed",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BIRD + SEED = Birdseed (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of SEED: BIRD + SEED = Birdseed. You have to resist the forward trap BED (SEED + BED = Seedbed)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BIRD",
        "displayStem": "BIRD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOUSE",
        "decoyPool": [
          "MOUSE",
          "BLOUSE",
          "GROUSE",
          "SPOUSE"
        ],
        "decoyWord": "MOUSE",
        "leftRightSeed": 0,
        "compoundHint": "BIRD + HOUSE = Birdhouse"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "HOUSE + WORK = Housework (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SHIFT",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 0,
        "compoundHint": "⬅ SHIFT + WORK = Shiftwork (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: SHIFT + WORK = Shiftwork. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHIFT",
        "displayStem": "SHIFT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "KEY",
        "decoyPool": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "decoyWord": "SKI",
        "leftRightSeed": 1,
        "compoundHint": "SHIFT + KEY = Shift key"
      }
    ]
  },
  {
    "vineNumber": 145,
    "dateKey": "2026-11-04",
    "title": "🏠 Home Sweet Home",
    "themeIndex": 3,
    "themeKey": "home_sweet_home",
    "themeIcon": "🏠",
    "themeName": "🏠 Home Sweet Home",
    "themeSubtitle": "Fireplaces, placemats, timetables, doghouses, showrooms, roommates & workshops",
    "themeId": 0,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 3,
    "zone1Triplets": [
      {
        "id": "fire_place_mat",
        "parts": [
          "FIRE",
          "PLACE",
          "MAT"
        ],
        "part2Hint": "FIRE + PLACE = Fireplace",
        "part3Hint": "PLACE + MAT = Placemat (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "part3Decoys": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "thematicLink": {
          "nextPart1": "BOARD",
          "connection": "2-Node Link",
          "hint": "MAT + BOARD = Matboard",
          "decoys": [
            "CHORD",
            "SWORD",
            "GOURD",
            "FJORD"
          ]
        }
      },
      {
        "id": "board_walk_out",
        "parts": [
          "BOARD",
          "WALK",
          "OUT"
        ],
        "part2Hint": "BOARD + WALK = Boardwalk",
        "part3Hint": "WALK + OUT = Walkout (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "part3Decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "thematicLink": {
          "nextPart1": "POST",
          "connection": "2-Node Link",
          "hint": "OUT + POST = Outpost",
          "decoys": [
            "GHOST",
            "TOAST",
            "ROAST",
            "COAST"
          ]
        }
      },
      {
        "id": "post_mark_down",
        "parts": [
          "POST",
          "MARK",
          "DOWN"
        ],
        "part2Hint": "POST + MARK = Postmark",
        "part3Hint": "MARK + DOWN = Markdown (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "part3Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "thematicLink": {
          "nextPart1": "TIME",
          "connection": "2-Node Link",
          "hint": "DOWN + TIME = Downtime",
          "decoys": [
            "LIME",
            "CHIME",
            "SLIME",
            "GRIME"
          ]
        }
      },
      {
        "id": "time_table_top",
        "parts": [
          "TIME",
          "TABLE",
          "TOP"
        ],
        "part2Hint": "TIME + TABLE = Timetable",
        "part3Hint": "TABLE + TOP = Tabletop (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "part3Decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "thematicLink": {
          "nextPart1": "DOG",
          "connection": "2-Node Link",
          "hint": "TOP + DOG = Top dog",
          "decoys": [
            "FOG",
            "BOG",
            "CLOG",
            "FROG"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "BOAT",
        "hint": "HOUSE + BOAT = Houseboat",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      },
      {
        "stem": "BOAT",
        "target": "SHOW",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "SHOW",
        "target": "ROOM",
        "hint": "SHOW + ROOM = Showroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      },
      {
        "stem": "ROOM",
        "target": "MATE",
        "hint": "ROOM + MATE = Roommate",
        "decoys": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ]
      },
      {
        "stem": "MATE",
        "target": "WORK",
        "hint": "MATE + WORK = Matework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "SHOP",
        "hint": "WORK + SHOP = Workshop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "SHOP",
        "target": "LIFT",
        "hint": "SHOP + LIFT = Shoplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "STAGE",
        "hint": "OFF + STAGE = Offstage",
        "decoys": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ]
      },
      {
        "stem": "STAGE",
        "target": "COACH",
        "hint": "STAGE + COACH = Stagecoach",
        "decoys": [
          "ROACH",
          "POACH",
          "BROOCH",
          "LOACH"
        ]
      },
      {
        "stem": "COACH",
        "target": "WORK",
        "hint": "COACH + WORK = Coachwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BENCH",
        "hint": "WORK + BENCH = Workbench",
        "decoys": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ]
      },
      {
        "stem": "BENCH",
        "target": "MARK",
        "hint": "BENCH + MARK = Benchmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "DOWN",
        "hint": "MARK + DOWN = Markdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TIME",
        "hint": "DOWN + TIME = Downtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "TIME",
        "target": "OUT",
        "hint": "TIME + OUT = Timeout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LOOK",
        "hint": "OUT + LOOK = Outlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "UP",
        "hint": "LOOK + UP = Lookup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "START",
        "hint": "UP + START = Upstart",
        "decoys": [
          "CART",
          "CHART",
          "SMART",
          "PART"
        ]
      },
      {
        "stem": "START",
        "target": "OVER",
        "hint": "START + OVER = Start over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "RUN",
        "hint": "OVER + RUN = Overrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "AWAY",
        "hint": "RUN + AWAY = Runaway",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      },
      {
        "stem": "AWAY",
        "target": "GAME",
        "hint": "AWAY + GAME = Away game",
        "decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ]
      },
      {
        "stem": "GAME",
        "target": "OVER",
        "hint": "GAME + OVER = Game over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "TURN",
        "hint": "OVER + TURN = Overturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OUT",
        "hint": "TURN + OUT = Turnout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BURST",
        "hint": "OUT + BURST = Outburst",
        "decoys": [
          "THIRST",
          "FIRST",
          "WORST",
          "HEARSE"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "PLACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "leftRightSeed": 0,
        "compoundHint": "FIRE + PLACE = Fireplace"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "PLACE",
        "displayStem": "PLACE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "leftRightSeed": 1,
        "compoundHint": "PLACE + MAT = Placemat (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MAT",
        "displayStem": "MAT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "MAT + BOARD = Matboard"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "CUP",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ CUP + BOARD = Cupboard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: CUP + BOARD = Cupboard. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "CUP",
        "displayStem": "CUP",
        "stemBadge": "3-NODE LINK",
        "correctWord": "CAKE",
        "decoyPool": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ],
        "decoyWord": "SNAKE",
        "leftRightSeed": 0,
        "compoundHint": "CUP + CAKE = Cupcake"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "CAKE",
        "displayStem": "CAKE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 1,
        "compoundHint": "CAKE + WALK = Cakewalk (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "WALK + OUT = Walkout"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SHIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "leftRightSeed": 0,
        "compoundHint": "TIME + SHIFT = Timeshift"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "SHIFT",
        "displayStem": "SHIFT",
        "stemBadge": "3-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "SHIFT + WORK = Shiftwork (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FLOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "leftRightSeed": 0,
        "compoundHint": "WORK + FLOW = Workflow"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FLOW",
        "displayStem": "⬅ FLOW",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OVER",
        "decoyPool": [
          "CHART"
        ],
        "decoyWord": "CHART",
        "trapCompoundHint": "FLOW + CHART = Flowchart",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OVER + FLOW = Overflow (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of FLOW: OVER + FLOW = Overflow. You have to resist the forward trap CHART (FLOW + CHART = Flowchart)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "leftRightSeed": 0,
        "compoundHint": "OVER + TURN = Overturn"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 1,
        "compoundHint": "TURN + OFF = Turnoff (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BEAT",
        "decoyPool": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ],
        "decoyWord": "WHEAT",
        "leftRightSeed": 0,
        "compoundHint": "OFF + BEAT = Offbeat"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BEAT",
        "displayStem": "⬅ BEAT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "UP",
        "decoyPool": [
          "BOX"
        ],
        "decoyWord": "BOX",
        "trapCompoundHint": "BEAT + BOX = Beatbox",
        "leftRightSeed": 1,
        "compoundHint": "⬅ UP + BEAT = Upbeat (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BEAT: UP + BEAT = Upbeat. You have to resist the forward trap BOX (BEAT + BOX = Beatbox)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOLD",
        "decoyPool": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ],
        "decoyWord": "MOLD",
        "leftRightSeed": 0,
        "compoundHint": "UP + HOLD = Uphold"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 1,
        "compoundHint": "HOLD + BACK = Holdback (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "BACK + BOARD = Backboard"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SIDE + BOARD = Sideboard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: SIDE + BOARD = Sideboard. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + WALK = Sidewalk"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 1,
        "compoundHint": "WALK + OVER = Walkover (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "COAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "leftRightSeed": 0,
        "compoundHint": "OVER + COAT = Overcoat"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "COAT",
        "displayStem": "⬅ COAT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "RAIN",
        "decoyPool": [
          "RACK"
        ],
        "decoyWord": "RACK",
        "trapCompoundHint": "COAT + RACK = Coatrack",
        "leftRightSeed": 1,
        "compoundHint": "⬅ RAIN + COAT = Raincoat (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of COAT: RAIN + COAT = Raincoat. You have to resist the forward trap RACK (COAT + RACK = Coatrack)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RAIN",
        "displayStem": "RAIN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TOTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "leftRightSeed": 0,
        "compoundHint": "RAIN + WATER = Rainwater"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "WATER + FALL = Waterfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "FALL + OUT = Fallout"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "CUT",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ CUT + OUT = Cutout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: CUT + OUT = Cutout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CUT",
        "displayStem": "CUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "CUT + BACK = Cutback"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FIRE",
        "decoyPool": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ],
        "decoyWord": "CHOIR",
        "leftRightSeed": 1,
        "compoundHint": "BACK + FIRE = Backfire (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "FIRE + WORK = Firework"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OFFICE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OFFICE + WORK = Office work (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: OFFICE + WORK = Office work. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFFICE",
        "displayStem": "OFFICE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SPACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "leftRightSeed": 0,
        "compoundHint": "OFFICE + SPACE = Office space"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SPACE",
        "displayStem": "SPACE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "leftRightSeed": 1,
        "compoundHint": "SPACE + SHIP = Spaceship (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHIP",
        "displayStem": "SHIP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "SHIP + BOARD = Shipboard"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "PARK",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ PARK + BOARD = Park board (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: PARK + BOARD = Park board. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PARK",
        "displayStem": "PARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "leftRightSeed": 0,
        "compoundHint": "PARK + WAY = Parkway"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 1,
        "compoundHint": "WAY + SIDE = Wayside (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "⬅ SIDE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "IN",
        "decoyPool": [
          "SHOW"
        ],
        "decoyWord": "SHOW",
        "trapCompoundHint": "SIDE + SHOW = Sideshow",
        "leftRightSeed": 0,
        "compoundHint": "⬅ IN + SIDE = Inside (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of SIDE: IN + SIDE = Inside. You have to resist the forward trap SHOW (SIDE + SHOW = Sideshow)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "IN",
        "displayStem": "IN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOOR",
        "decoyPool": [
          "FLOOR",
          "MOOR",
          "SPORE",
          "SHORE"
        ],
        "decoyWord": "FLOOR",
        "leftRightSeed": 1,
        "compoundHint": "IN + DOOR = Indoor"
      }
    ]
  },
  {
    "vineNumber": 146,
    "dateKey": "2026-11-05",
    "title": "🛠️ Clockwork & Craft",
    "themeIndex": 4,
    "themeKey": "the_workshop_craft",
    "themeIcon": "🛠️",
    "themeName": "🛠️ Clockwork & Craft",
    "themeSubtitle": "Time clocks, workshops, backwaters, doormats, boardrooms & workhorses",
    "themeId": 1,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 4,
    "zone1Triplets": [
      {
        "id": "hand_shake_down",
        "parts": [
          "HAND",
          "SHAKE",
          "DOWN"
        ],
        "part2Hint": "HAND + SHAKE = Handshake",
        "part3Hint": "SHAKE + DOWN = Shakedown (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ],
        "part3Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "thematicLink": {
          "nextPart1": "TIME",
          "connection": "2-Node Link",
          "hint": "DOWN + TIME = Downtime",
          "decoys": [
            "LIME",
            "CHIME",
            "SLIME",
            "GRIME"
          ]
        }
      },
      {
        "id": "time_clock_work",
        "parts": [
          "TIME",
          "CLOCK",
          "WORK"
        ],
        "part2Hint": "TIME + CLOCK = Time clock",
        "part3Hint": "CLOCK + WORK = Clockwork (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "part3Decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "thematicLink": {
          "nextPart1": "SHOP",
          "connection": "2-Node Link",
          "hint": "WORK + SHOP = Workshop",
          "decoys": [
            "MOP",
            "CHOP",
            "CROP",
            "PLOP"
          ]
        }
      },
      {
        "id": "shop_lift_off",
        "parts": [
          "SHOP",
          "LIFT",
          "OFF"
        ],
        "part2Hint": "SHOP + LIFT = Shoplift",
        "part3Hint": "LIFT + OFF = Liftoff (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "part3Decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "thematicLink": {
          "nextPart1": "SET",
          "connection": "2-Node Link",
          "hint": "OFF + SET = Offset",
          "decoys": [
            "JET",
            "PET",
            "VET",
            "FRET"
          ]
        }
      },
      {
        "id": "set_back_water",
        "parts": [
          "SET",
          "BACK",
          "WATER"
        ],
        "part2Hint": "SET + BACK = Setback",
        "part3Hint": "BACK + WATER = Backwater (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "part3Decoys": [
          "OTTER",
          "POTTER",
          "TROTTER",
          "BLOTTER"
        ],
        "thematicLink": {
          "nextPart1": "FALL",
          "connection": "2-Node Link",
          "hint": "WATER + FALL = Waterfall",
          "decoys": [
            "SHAWL",
            "BRAWL",
            "SCRAWL",
            "DRAWL"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "FALL",
        "target": "OUT",
        "hint": "FALL + OUT = Fallout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "DOOR",
        "hint": "OUT + DOOR = Outdoor",
        "decoys": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ]
      },
      {
        "stem": "DOOR",
        "target": "MAT",
        "hint": "DOOR + MAT = Doormat",
        "decoys": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ]
      },
      {
        "stem": "MAT",
        "target": "BOARD",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "ROOM",
        "hint": "BOARD + ROOM = Boardroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      },
      {
        "stem": "ROOM",
        "target": "MATE",
        "hint": "ROOM + MATE = Roommate",
        "decoys": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ]
      },
      {
        "stem": "MATE",
        "target": "WORK",
        "hint": "MATE + WORK = Matework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "HORSE",
        "hint": "WORK + HORSE = Workhorse",
        "decoys": [
          "MORSE",
          "CORPSE",
          "REMORSE",
          "GORSE"
        ]
      },
      {
        "stem": "HORSE",
        "target": "BACK",
        "hint": "HORSE + BACK = Horseback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "FIRE",
        "hint": "BACK + FIRE = Backfire",
        "decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ]
      },
      {
        "stem": "FIRE",
        "target": "PLACE",
        "hint": "FIRE + PLACE = Fireplace",
        "decoys": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ]
      },
      {
        "stem": "PLACE",
        "target": "MAT",
        "hint": "PLACE + MAT = Placemat",
        "decoys": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ]
      },
      {
        "stem": "MAT",
        "target": "BOARD",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "WALK",
        "hint": "BOARD + WALK = Boardwalk",
        "decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ]
      },
      {
        "stem": "WALK",
        "target": "WAY",
        "hint": "WALK + WAY = Walkway",
        "decoys": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ]
      },
      {
        "stem": "WAY",
        "target": "SIDE",
        "hint": "WAY + SIDE = Wayside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "SIDE",
        "target": "LINE",
        "hint": "SIDE + LINE = Sideline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "HOLD",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "OUT",
        "hint": "HOLD + OUT = Holdout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LINE",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "DOWN",
        "hint": "LINE + DOWN = Linedown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TURN",
        "hint": "DOWN + TURN = Downturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OFF",
        "hint": "TURN + OFF = Turnoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "BEAT",
        "hint": "OFF + BEAT = Offbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "UP",
        "hint": "BEAT + UP = Beat up",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "SIDE",
        "hint": "UP + SIDE = Upside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "STEP",
        "hint": "SIDE + STEP = Sidestep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "HAND",
        "displayStem": "HAND",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SHAKE",
        "decoyPool": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ],
        "decoyWord": "SNAKE",
        "leftRightSeed": 0,
        "compoundHint": "HAND + SHAKE = Handshake"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "SHAKE",
        "displayStem": "SHAKE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 1,
        "compoundHint": "SHAKE + DOWN = Shakedown (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 0,
        "compoundHint": "DOWN + TIME = Downtime"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "⬅ TIME",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OVER",
        "decoyPool": [
          "TABLE"
        ],
        "decoyWord": "TABLE",
        "trapCompoundHint": "TIME + TABLE = Timetable",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OVER + TIME = Overtime (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TIME: OVER + TIME = Overtime. You have to resist the forward trap TABLE (TIME + TABLE = Timetable)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SEA",
        "decoyPool": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "decoyWord": "SKI",
        "leftRightSeed": 0,
        "compoundHint": "OVER + SEA = Oversea"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "SEA",
        "displayStem": "SEA",
        "stemBadge": "3-NODE LINK",
        "correctWord": "PORT",
        "decoyPool": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ],
        "decoyWord": "FORT",
        "leftRightSeed": 1,
        "compoundHint": "SEA + PORT = Seaport (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PORT",
        "displayStem": "PORT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "leftRightSeed": 0,
        "compoundHint": "PORT + HOLE = Porthole"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLE",
        "displayStem": "⬅ HOLE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "KEY",
        "decoyPool": [
          "PUNCH"
        ],
        "decoyWord": "PUNCH",
        "trapCompoundHint": "HOLE + PUNCH = Hole punch",
        "leftRightSeed": 1,
        "compoundHint": "⬅ KEY + HOLE = Keyhole (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of HOLE: KEY + HOLE = Keyhole. You have to resist the forward trap PUNCH (HOLE + PUNCH = Hole punch)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "KEY",
        "displayStem": "KEY",
        "stemBadge": "3-NODE LINK",
        "correctWord": "NOTE",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "leftRightSeed": 0,
        "compoundHint": "KEY + NOTE = Keynote"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "NOTE",
        "displayStem": "NOTE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 1,
        "compoundHint": "NOTE + BOOK = Notebook (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CASE",
        "decoyPool": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "decoyWord": "VASE",
        "leftRightSeed": 0,
        "compoundHint": "BOOK + CASE = Bookcase"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CASE",
        "displayStem": "⬅ CASE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SHOW",
        "decoyPool": [
          "WORK"
        ],
        "decoyWord": "WORK",
        "trapCompoundHint": "CASE + WORK = Casework",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SHOW + CASE = Showcase (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of CASE: SHOW + CASE = Showcase. You have to resist the forward trap WORK (CASE + WORK = Casework)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "SHOW + DOWN = Showdown"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "leftRightSeed": 1,
        "compoundHint": "DOWN + TURN = Downturn (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "TURN + OUT = Turnout"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CLOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "decoyWord": "FLOCK",
        "leftRightSeed": 0,
        "compoundHint": "TIME + CLOCK = Time clock"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CLOCK",
        "displayStem": "CLOCK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "CLOCK + WORK = Clockwork (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FLOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "leftRightSeed": 0,
        "compoundHint": "WORK + FLOW = Workflow"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FLOW",
        "displayStem": "⬅ FLOW",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OVER",
        "decoyPool": [
          "CHART"
        ],
        "decoyWord": "CHART",
        "trapCompoundHint": "FLOW + CHART = Flowchart",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OVER + FLOW = Overflow (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of FLOW: OVER + FLOW = Overflow. You have to resist the forward trap CHART (FLOW + CHART = Flowchart)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "OVER + LOOK = Overlook"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 1,
        "compoundHint": "LOOK + UP = Lookup (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TOWN",
        "decoyPool": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "UP + TOWN = Uptown"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TOWN",
        "displayStem": "⬅ TOWN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "DOWN",
        "decoyPool": [
          "HOUSE"
        ],
        "decoyWord": "HOUSE",
        "trapCompoundHint": "TOWN + HOUSE = Townhouse",
        "leftRightSeed": 1,
        "compoundHint": "⬅ DOWN + TOWN = Downtown (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TOWN: DOWN + TOWN = Downtown. You have to resist the forward trap HOUSE (TOWN + HOUSE = Townhouse)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "leftRightSeed": 0,
        "compoundHint": "DOWN + SHIFT = Downshift"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHIFT",
        "displayStem": "SHIFT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "SHIFT + WORK = Shiftwork (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "HOLD",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ HOLD + OUT = Holdout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: HOLD + OUT = Holdout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "HOLD + OVER = Holdover"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "leftRightSeed": 1,
        "compoundHint": "OVER + RUN = Overrun (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "RUN + OFF = Runoff"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "⬅ OFF",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FALL",
        "decoyPool": [
          "SET"
        ],
        "decoyWord": "SET",
        "trapCompoundHint": "OFF + SET = Offset",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FALL + OFF = Falloff (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OFF: FALL + OFF = Falloff. You have to resist the forward trap SET (OFF + SET = Offset)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "FALL + BACK = Fallback"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 1,
        "compoundHint": "BACK + BOARD = Backboard (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "leftRightSeed": 0,
        "compoundHint": "BOARD + WALK = Boardwalk"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "⬅ WALK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "WAY"
        ],
        "decoyWord": "WAY",
        "trapCompoundHint": "WALK + WAY = Walkway",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SIDE + WALK = Sidewalk (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WALK: SIDE + WALK = Sidewalk. You have to resist the forward trap WAY (WALK + WAY = Walkway)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + SHOW = Sideshow"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "leftRightSeed": 1,
        "compoundHint": "SHOW + ROOM = Showroom (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "ROOM",
        "displayStem": "⬅ ROOM",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "NEWS",
        "decoyPool": [
          "MATE"
        ],
        "decoyWord": "MATE",
        "trapCompoundHint": "ROOM + MATE = Roommate",
        "leftRightSeed": 0,
        "compoundHint": "⬅ NEWS + ROOM = Newsroom (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of ROOM: NEWS + ROOM = Newsroom. You have to resist the forward trap MATE (ROOM + MATE = Roommate)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "NEWS",
        "displayStem": "NEWS",
        "stemBadge": "2-NODE LINK",
        "correctWord": "PAPER",
        "decoyPool": [
          "TAPER",
          "CAPER",
          "VAPOR",
          "SCRAPER"
        ],
        "decoyWord": "TAPER",
        "leftRightSeed": 1,
        "compoundHint": "NEWS + PAPER = Newspaper"
      }
    ]
  },
  {
    "vineNumber": 147,
    "dateKey": "2026-11-06",
    "title": "🌻 Greenhouse & Harvest",
    "themeIndex": 5,
    "themeKey": "greenhouse_harvest",
    "themeIcon": "🌻",
    "themeName": "🌻 Greenhouse & Harvest",
    "themeSubtitle": "Watermelon seeds, seedbeds, workbenches, fieldwork, daylight & lighthouses",
    "themeId": 2,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 5,
    "zone1Triplets": [
      {
        "id": "water_melon_seed",
        "parts": [
          "WATER",
          "MELON",
          "SEED"
        ],
        "part2Hint": "WATER + MELON = Watermelon",
        "part3Hint": "MELON + SEED = Melon seed (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "FELON",
          "LEMON",
          "HERON",
          "TALON"
        ],
        "part3Decoys": [
          "STEED",
          "TWEED",
          "GREED",
          "CREED"
        ],
        "thematicLink": {
          "nextPart1": "BED",
          "connection": "2-Node Link",
          "hint": "SEED + BED = Seedbed",
          "decoys": [
            "SLED",
            "SHRED",
            "THREAD",
            "DREAD"
          ]
        }
      },
      {
        "id": "bed_spread_sheet",
        "parts": [
          "BED",
          "SPREAD",
          "SHEET"
        ],
        "part2Hint": "BED + SPREAD = Bedspread",
        "part3Hint": "SPREAD + SHEET = Spreadsheet (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SHRED",
          "THREAD",
          "DREAD",
          "TREAD"
        ],
        "part3Decoys": [
          "SLEET",
          "FLEET",
          "GREET",
          "PLEAT"
        ],
        "thematicLink": {
          "nextPart1": "METAL",
          "connection": "2-Node Link",
          "hint": "SHEET + METAL = Sheet metal",
          "decoys": [
            "PETAL",
            "KETTLE",
            "NETTLE",
            "SETTLE"
          ]
        }
      },
      {
        "id": "metal_work_bench",
        "parts": [
          "METAL",
          "WORK",
          "BENCH"
        ],
        "part2Hint": "METAL + WORK = Metalwork",
        "part3Hint": "WORK + BENCH = Workbench (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "part3Decoys": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "thematicLink": {
          "nextPart1": "MARK",
          "connection": "2-Node Link",
          "hint": "BENCH + MARK = Benchmark",
          "decoys": [
            "SHARK",
            "LARK",
            "SPARK",
            "BARK"
          ]
        }
      },
      {
        "id": "mark_down_town",
        "parts": [
          "MARK",
          "DOWN",
          "TOWN"
        ],
        "part2Hint": "MARK + DOWN = Markdown",
        "part3Hint": "DOWN + TOWN = Downtown (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "part3Decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "thematicLink": {
          "nextPart1": "HOUSE",
          "connection": "2-Node Link",
          "hint": "TOWN + HOUSE = Townhouse",
          "decoys": [
            "BLOUSE",
            "GROUSE",
            "SPOUSE",
            "MOUSE"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "HOUSE",
        "target": "HOLD",
        "hint": "HOUSE + HOLD = Household",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "OUT",
        "hint": "HOLD + OUT = Holdout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "FIELD",
        "hint": "OUT + FIELD = Outfield",
        "decoys": [
          "SHIELD",
          "WIELD",
          "PEELED",
          "SEALED"
        ]
      },
      {
        "stem": "FIELD",
        "target": "WORK",
        "hint": "FIELD + WORK = Fieldwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "DAY",
        "hint": "WORK + DAY = Workday",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      },
      {
        "stem": "DAY",
        "target": "LIGHT",
        "hint": "DAY + LIGHT = Daylight",
        "decoys": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ]
      },
      {
        "stem": "LIGHT",
        "target": "HOUSE",
        "hint": "LIGHT + HOUSE = Lighthouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "BOAT",
        "hint": "HOUSE + BOAT = Houseboat",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      },
      {
        "stem": "BOAT",
        "target": "SHOW",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "SHOW",
        "target": "CASE",
        "hint": "SHOW + CASE = Showcase",
        "decoys": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ]
      },
      {
        "stem": "CASE",
        "target": "BOOK",
        "hint": "CASE + BOOK = Casebook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "MARK",
        "hint": "BOOK + MARK = Bookmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "DOWN",
        "hint": "MARK + DOWN = Markdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "FALL",
        "hint": "DOWN + FALL = Downfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "BACK",
        "hint": "FALL + BACK = Fallback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "BONE",
        "hint": "BACK + BONE = Backbone",
        "decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "BONE",
        "target": "DRY",
        "hint": "BONE + DRY = Bone-dry",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "DRY",
        "target": "CLEAN",
        "hint": "DRY + CLEAN = Dry-clean",
        "decoys": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ]
      },
      {
        "stem": "CLEAN",
        "target": "UP",
        "hint": "CLEAN + UP = Cleanup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OVER",
        "hint": "TURN + OVER = Turnover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "TIME",
        "hint": "OVER + TIME = Overtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      },
      {
        "stem": "TIME",
        "target": "LINE",
        "hint": "TIME + LINE = Timeline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "OUT",
        "hint": "LINE + OUT = Lineout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "FALL",
        "hint": "OUT + FALL = Outfall",
        "decoys": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "OFF",
        "hint": "FALL + OFF = Falloff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SIDE",
        "hint": "OFF + SIDE = Offside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "WALK",
        "hint": "SIDE + WALK = Sidewalk",
        "decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MELON",
        "decoyPool": [
          "FELON",
          "LEMON",
          "HERON",
          "TALON"
        ],
        "decoyWord": "FELON",
        "leftRightSeed": 0,
        "compoundHint": "WATER + MELON = Watermelon"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "MELON",
        "displayStem": "MELON",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SEED",
        "decoyPool": [
          "STEED",
          "TWEED",
          "GREED",
          "CREED"
        ],
        "decoyWord": "STEED",
        "leftRightSeed": 1,
        "compoundHint": "MELON + SEED = Melon seed (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SEED",
        "displayStem": "SEED",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BED",
        "decoyPool": [
          "SLED",
          "SHRED",
          "THREAD",
          "DREAD"
        ],
        "decoyWord": "SLED",
        "leftRightSeed": 0,
        "compoundHint": "SEED + BED = Seedbed"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BED",
        "displayStem": "⬅ BED",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FLOWER",
        "decoyPool": [
          "SPREAD"
        ],
        "decoyWord": "SPREAD",
        "trapCompoundHint": "BED + SPREAD = Bedspread",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FLOWER + BED = Flowerbed (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BED: FLOWER + BED = Flowerbed. You have to resist the forward trap SPREAD (BED + SPREAD = Bedspread)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "FLOWER",
        "displayStem": "FLOWER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "POT",
        "decoyPool": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ],
        "decoyWord": "BLOT",
        "leftRightSeed": 0,
        "compoundHint": "FLOWER + POT = Flowerpot"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "POT",
        "displayStem": "POT",
        "stemBadge": "3-NODE LINK",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "leftRightSeed": 1,
        "compoundHint": "POT + HOLE = Pothole (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "leftRightSeed": 0,
        "compoundHint": "HOLE + CARD = Hole card"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CARD",
        "displayStem": "⬅ CARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "POST",
        "decoyPool": [
          "BOARD"
        ],
        "decoyWord": "BOARD",
        "trapCompoundHint": "CARD + BOARD = Cardboard",
        "leftRightSeed": 1,
        "compoundHint": "⬅ POST + CARD = Postcard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of CARD: POST + CARD = Postcard. You have to resist the forward trap BOARD (CARD + BOARD = Cardboard)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 0,
        "compoundHint": "POST + MARK = Postmark"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "3-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 1,
        "compoundHint": "MARK + DOWN = Markdown (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 0,
        "compoundHint": "DOWN + TIME = Downtime"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "⬅ TIME",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OVER",
        "decoyPool": [
          "TABLE"
        ],
        "decoyWord": "TABLE",
        "trapCompoundHint": "TIME + TABLE = Timetable",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OVER + TIME = Overtime (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TIME: OVER + TIME = Overtime. You have to resist the forward trap TABLE (TIME + TABLE = Timetable)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "OVER + LOOK = Overlook"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 1,
        "compoundHint": "LOOK + OUT = Lookout (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOOR",
        "decoyPool": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ],
        "decoyWord": "CHORE",
        "leftRightSeed": 0,
        "compoundHint": "OUT + DOOR = Outdoor"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOOR",
        "displayStem": "⬅ DOOR",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "IN",
        "decoyPool": [
          "STEP"
        ],
        "decoyWord": "STEP",
        "trapCompoundHint": "DOOR + STEP = Doorstep",
        "leftRightSeed": 1,
        "compoundHint": "⬅ IN + DOOR = Indoor (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOOR: IN + DOOR = Indoor. You have to resist the forward trap STEP (DOOR + STEP = Doorstep)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "IN",
        "displayStem": "IN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 0,
        "compoundHint": "IN + SIDE = Inside"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 1,
        "compoundHint": "SIDE + WALK = Sidewalk (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "AWAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "decoyWord": "CLAY",
        "leftRightSeed": 0,
        "compoundHint": "WALK + AWAY = Walkaway"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "AWAY",
        "displayStem": "⬅ AWAY",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "RUN",
        "decoyPool": [
          "GAME"
        ],
        "decoyWord": "GAME",
        "trapCompoundHint": "AWAY + GAME = Away game",
        "leftRightSeed": 1,
        "compoundHint": "⬅ RUN + AWAY = Runaway (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of AWAY: RUN + AWAY = Runaway. You have to resist the forward trap GAME (AWAY + GAME = Away game)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "RUN + OFF = Runoff"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "leftRightSeed": 1,
        "compoundHint": "OFF + SET = Offset (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SET",
        "displayStem": "SET",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "SET + OUT = Set out"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TIME + OVER = Time over"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SLEEP",
        "decoyPool": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ],
        "decoyWord": "SHEEP",
        "leftRightSeed": 1,
        "compoundHint": "OVER + SLEEP = Oversleep (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SLEEP",
        "displayStem": "SLEEP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 0,
        "compoundHint": "SLEEP + WALK = Sleepwalk"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "⬅ WALK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BOARD",
        "decoyPool": [
          "WAY"
        ],
        "decoyWord": "WAY",
        "trapCompoundHint": "WALK + WAY = Walkway",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BOARD + WALK = Boardwalk (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WALK: BOARD + WALK = Boardwalk. You have to resist the forward trap WAY (WALK + WAY = Walkway)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "GAME",
        "decoyPool": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ],
        "decoyWord": "FLAME",
        "leftRightSeed": 0,
        "compoundHint": "BOARD + GAME = Board game"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "GAME",
        "displayStem": "GAME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BIRD",
        "decoyPool": [
          "HERD",
          "CURD",
          "NERD",
          "WORD"
        ],
        "decoyWord": "HERD",
        "leftRightSeed": 1,
        "compoundHint": "GAME + BIRD = Gamebird (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BIRD",
        "displayStem": "BIRD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOUSE",
        "decoyPool": [
          "MOUSE",
          "BLOUSE",
          "GROUSE",
          "SPOUSE"
        ],
        "decoyWord": "MOUSE",
        "leftRightSeed": 0,
        "compoundHint": "BIRD + HOUSE = Birdhouse"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOUSE",
        "displayStem": "⬅ HOUSE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "GREEN",
        "decoyPool": [
          "BOAT"
        ],
        "decoyWord": "BOAT",
        "trapCompoundHint": "HOUSE + BOAT = Houseboat",
        "leftRightSeed": 1,
        "compoundHint": "⬅ GREEN + HOUSE = Greenhouse (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of HOUSE: GREEN + HOUSE = Greenhouse. You have to resist the forward trap BOAT (HOUSE + BOAT = Houseboat)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "GREEN",
        "displayStem": "GREEN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "RACK",
          "SACK",
          "TRACK",
          "SHACK"
        ],
        "decoyWord": "RACK",
        "leftRightSeed": 0,
        "compoundHint": "GREEN + BACK = Greenback"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TROTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "leftRightSeed": 1,
        "compoundHint": "BACK + WATER = Backwater (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 0,
        "compoundHint": "WATER + FALL = Waterfall"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "⬅ FALL",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WIND",
        "decoyPool": [
          "BACK"
        ],
        "decoyWord": "BACK",
        "trapCompoundHint": "FALL + BACK = Fallback",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WIND + FALL = Windfall (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of FALL: WIND + FALL = Windfall. You have to resist the forward trap BACK (FALL + BACK = Fallback)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WIND",
        "displayStem": "WIND",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MILL",
        "decoyPool": [
          "QUILL",
          "GRILL",
          "FRILL",
          "DRILL"
        ],
        "decoyWord": "QUILL",
        "leftRightSeed": 0,
        "compoundHint": "WIND + MILL = Windmill"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MILL",
        "displayStem": "MILL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "STONE",
        "decoyPool": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "decoyWord": "CONE",
        "leftRightSeed": 1,
        "compoundHint": "MILL + STONE = Millstone (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "STONE",
        "displayStem": "⬅ STONE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "STEP",
        "decoyPool": [
          "WALL"
        ],
        "decoyWord": "WALL",
        "trapCompoundHint": "STONE + WALL = Stonewall",
        "leftRightSeed": 0,
        "compoundHint": "⬅ STEP + STONE = Stepping stone (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of STONE: STEP + STONE = Stepping stone. You have to resist the forward trap WALL (STONE + WALL = Stonewall)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 1,
        "compoundHint": "STEP + DOWN = Stepdown"
      }
    ]
  },
  {
    "vineNumber": 148,
    "dateKey": "2026-11-07",
    "title": "🕵️ Goldmine & Wiretap",
    "themeIndex": 6,
    "themeKey": "cloak_and_dagger",
    "themeIcon": "🕵️",
    "themeName": "🕵️ Goldmine & Wiretap",
    "themeSubtitle": "Minefields, tripwires, wiretaps, dance floors, portholes, game plans & outposts",
    "themeId": 0,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 6,
    "zone1Triplets": [
      {
        "id": "gold_mine_field",
        "parts": [
          "GOLD",
          "MINE",
          "FIELD"
        ],
        "part2Hint": "GOLD + MINE = Goldmine",
        "part3Hint": "MINE + FIELD = Minefield (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "part3Decoys": [
          "SHIELD",
          "YIELD",
          "WIELD",
          "PEELED"
        ],
        "thematicLink": {
          "nextPart1": "TRIP",
          "connection": "2-Node Link",
          "hint": "FIELD + TRIP = Field trip",
          "decoys": [
            "CHIP",
            "WHIP",
            "DRIP",
            "BLIP"
          ]
        }
      },
      {
        "id": "trip_wire_tap",
        "parts": [
          "TRIP",
          "WIRE",
          "TAP"
        ],
        "part2Hint": "TRIP + WIRE = Tripwire",
        "part3Hint": "WIRE + TAP = Wiretap (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ],
        "part3Decoys": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ],
        "thematicLink": {
          "nextPart1": "DANCE",
          "connection": "2-Node Link",
          "hint": "TAP + DANCE = Tap dance",
          "decoys": [
            "LANCE",
            "TRANCE",
            "GLANCE",
            "PRANCE"
          ]
        }
      },
      {
        "id": "dance_floor_board",
        "parts": [
          "DANCE",
          "FLOOR",
          "BOARD"
        ],
        "part2Hint": "DANCE + FLOOR = Dance floor",
        "part3Hint": "FLOOR + BOARD = Floorboard (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "part3Decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "thematicLink": {
          "nextPart1": "WALK",
          "connection": "2-Node Link",
          "hint": "BOARD + WALK = Boardwalk",
          "decoys": [
            "HAWK",
            "STALK",
            "SQUAWK",
            "CAULK"
          ]
        }
      },
      {
        "id": "walk_over_sea",
        "parts": [
          "WALK",
          "OVER",
          "SEA"
        ],
        "part2Hint": "WALK + OVER = Walkover",
        "part3Hint": "OVER + SEA = Oversea (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "part3Decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "thematicLink": {
          "nextPart1": "PORT",
          "connection": "2-Node Link",
          "hint": "SEA + PORT = Seaport",
          "decoys": [
            "FORT",
            "SPORT",
            "SNORT",
            "SHORT"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "PORT",
        "target": "HOLE",
        "hint": "PORT + HOLE = Porthole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "PUNCH",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      },
      {
        "stem": "PUNCH",
        "target": "LINE",
        "hint": "PUNCH + LINE = Punchline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "TOWN",
        "hint": "UP + TOWN = Uptown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      },
      {
        "stem": "TOWN",
        "target": "SHIP",
        "hint": "TOWN + SHIP = Township",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      },
      {
        "stem": "SHIP",
        "target": "BOARD",
        "hint": "SHIP + BOARD = Shipboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "GAME",
        "hint": "BOARD + GAME = Board game",
        "decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ]
      },
      {
        "stem": "GAME",
        "target": "PLAN",
        "hint": "GAME + PLAN = Game plan",
        "decoys": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ]
      },
      {
        "stem": "PLAN",
        "target": "OUT",
        "hint": "PLAN + OUT = Plan out",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "POST",
        "hint": "OUT + POST = Outpost",
        "decoys": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ]
      },
      {
        "stem": "POST",
        "target": "CARD",
        "hint": "POST + CARD = Postcard",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      },
      {
        "stem": "CARD",
        "target": "BOARD",
        "hint": "CARD + BOARD = Cardboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "ROOM",
        "hint": "BOARD + ROOM = Boardroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      },
      {
        "stem": "ROOM",
        "target": "WORK",
        "hint": "ROOM + WORK = Roomwork",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "SHOP",
        "hint": "WORK + SHOP = Workshop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "SHOP",
        "target": "LIFT",
        "hint": "SHOP + LIFT = Shoplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "UP",
        "hint": "SET + UP = Setup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "LAND",
        "hint": "UP + LAND = Upland",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ]
      },
      {
        "stem": "LAND",
        "target": "MARK",
        "hint": "LAND + MARK = Landmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "DOWN",
        "hint": "MARK + DOWN = Markdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TOWN",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      },
      {
        "stem": "TOWN",
        "target": "HOUSE",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "TOP",
        "hint": "HOUSE + TOP = Housetop",
        "decoys": [
          "MOP",
          "CROP",
          "PLOP",
          "SLOP"
        ]
      },
      {
        "stem": "TOP",
        "target": "SIDE",
        "hint": "TOP + SIDE = Topside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "SHOW",
        "hint": "SIDE + SHOW = Sideshow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "GOLD",
        "displayStem": "GOLD",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "leftRightSeed": 0,
        "compoundHint": "GOLD + MINE = Goldmine"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "MINE",
        "displayStem": "MINE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "FIELD",
        "decoyPool": [
          "SHIELD",
          "YIELD",
          "WIELD",
          "PEELED"
        ],
        "decoyWord": "SHIELD",
        "leftRightSeed": 1,
        "compoundHint": "MINE + FIELD = Minefield (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FIELD",
        "displayStem": "FIELD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TRIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "leftRightSeed": 0,
        "compoundHint": "FIELD + TRIP = Field trip"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TRIP",
        "displayStem": "⬅ TRIP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "ROAD",
        "decoyPool": [
          "WIRE"
        ],
        "decoyWord": "WIRE",
        "trapCompoundHint": "TRIP + WIRE = Tripwire",
        "leftRightSeed": 1,
        "compoundHint": "⬅ ROAD + TRIP = Road trip (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TRIP: ROAD + TRIP = Road trip. You have to resist the forward trap WIRE (TRIP + WIRE = Tripwire)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "ROAD",
        "displayStem": "ROAD",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BLOCK",
        "decoyPool": [
          "FLOCK",
          "CLOCK",
          "SMOCK",
          "CROCK"
        ],
        "decoyWord": "FLOCK",
        "leftRightSeed": 0,
        "compoundHint": "ROAD + BLOCK = Roadblock"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "BLOCK",
        "displayStem": "BLOCK",
        "stemBadge": "3-NODE LINK",
        "correctWord": "HEAD",
        "decoyPool": [
          "BREAD",
          "THREAD",
          "DREAD",
          "TREAD"
        ],
        "decoyWord": "BREAD",
        "leftRightSeed": 1,
        "compoundHint": "BLOCK + HEAD = Blockhead (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HEAD",
        "displayStem": "HEAD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "START",
        "decoyPool": [
          "TART",
          "DART",
          "CART",
          "CHART"
        ],
        "decoyWord": "TART",
        "leftRightSeed": 0,
        "compoundHint": "HEAD + START = Head start"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "START",
        "displayStem": "⬅ START",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "UP",
        "decoyPool": [
          "OVER"
        ],
        "decoyWord": "OVER",
        "trapCompoundHint": "START + OVER = Start over",
        "leftRightSeed": 1,
        "compoundHint": "⬅ UP + START = Upstart (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of START: UP + START = Upstart. You have to resist the forward trap OVER (START + OVER = Start over)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "3-NODE LINK",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "leftRightSeed": 0,
        "compoundHint": "UP + TURN = Upturn"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 1,
        "compoundHint": "TURN + OUT = Turnout (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "OUT + LOOK = Outlook"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "⬅ LOOK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OVER",
        "decoyPool": [
          "UP"
        ],
        "decoyWord": "UP",
        "trapCompoundHint": "LOOK + UP = Lookup",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OVER + LOOK = Overlook (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of LOOK: OVER + LOOK = Overlook. You have to resist the forward trap UP (LOOK + UP = Lookup)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 0,
        "compoundHint": "OVER + TIME = Overtime"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "leftRightSeed": 1,
        "compoundHint": "TIME + LINE = Timeline (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "LINE + DOWN = Linedown"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "⬅ DOWN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BREAK",
        "decoyPool": [
          "POUR"
        ],
        "decoyWord": "POUR",
        "trapCompoundHint": "DOWN + POUR = Downpour",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BREAK + DOWN = Breakdown (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOWN: BREAK + DOWN = Breakdown. You have to resist the forward trap POUR (DOWN + POUR = Downpour)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BREAK",
        "displayStem": "BREAK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "BREAK + UP = Breakup"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "leftRightSeed": 1,
        "compoundHint": "UP + LAND = Upland (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LAND",
        "displayStem": "LAND",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 0,
        "compoundHint": "LAND + MARK = Landmark"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "⬅ MARK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "POST",
        "decoyPool": [
          "DOWN"
        ],
        "decoyWord": "DOWN",
        "trapCompoundHint": "MARK + DOWN = Markdown",
        "leftRightSeed": 1,
        "compoundHint": "⬅ POST + MARK = Postmark (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of MARK: POST + MARK = Postmark. You have to resist the forward trap DOWN (MARK + DOWN = Markdown)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "leftRightSeed": 0,
        "compoundHint": "POST + CARD = Postcard"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 1,
        "compoundHint": "CARD + BOARD = Cardboard (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "leftRightSeed": 0,
        "compoundHint": "BOARD + ROOM = Boardroom"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "ROOM",
        "displayStem": "⬅ ROOM",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SHOW",
        "decoyPool": [
          "MATE"
        ],
        "decoyWord": "MATE",
        "trapCompoundHint": "ROOM + MATE = Roommate",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SHOW + ROOM = Showroom (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of ROOM: SHOW + ROOM = Showroom. You have to resist the forward trap MATE (ROOM + MATE = Roommate)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "SHOW + DOWN = Showdown"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WIND",
        "decoyPool": [
          "RIND",
          "BLIND",
          "GRIND",
          "MIND"
        ],
        "decoyWord": "RIND",
        "leftRightSeed": 1,
        "compoundHint": "DOWN + WIND = Downwind (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WIND",
        "displayStem": "WIND",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 0,
        "compoundHint": "WIND + FALL = Windfall"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "⬅ FALL",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WATER",
        "decoyPool": [
          "BACK"
        ],
        "decoyWord": "BACK",
        "trapCompoundHint": "FALL + BACK = Fallback",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WATER + FALL = Waterfall (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of FALL: WATER + FALL = Waterfall. You have to resist the forward trap BACK (FALL + BACK = Fallback)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BED",
        "decoyPool": [
          "SLED",
          "SHED",
          "THREAD",
          "BREAD"
        ],
        "decoyWord": "SLED",
        "leftRightSeed": 0,
        "compoundHint": "WATER + BED = Waterbed"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BED",
        "displayStem": "BED",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "BED + TIME = Bedtime (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "TIME + OUT = Timeout"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "HOLD",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ HOLD + OUT = Holdout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: HOLD + OUT = Holdout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "HOLD + OVER = Holdover"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "leftRightSeed": 1,
        "compoundHint": "OVER + RUN = Overrun (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "RUN + OFF = Runoff"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "⬅ OFF",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FALL",
        "decoyPool": [
          "SET"
        ],
        "decoyWord": "SET",
        "trapCompoundHint": "OFF + SET = Offset",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FALL + OFF = Falloff (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OFF: FALL + OFF = Falloff. You have to resist the forward trap SET (OFF + SET = Offset)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "FALL + BACK = Fallback"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 1,
        "compoundHint": "BACK + BOARD = Backboard (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 0,
        "compoundHint": "⬅ SIDE + BOARD = Sideboard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: SIDE + BOARD = Sideboard. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 1,
        "compoundHint": "SIDE + WALK = Sidewalk"
      }
    ]
  },
  {
    "vineNumber": 149,
    "dateKey": "2026-11-08",
    "title": "🌊 High Seas & Windmill",
    "themeIndex": 7,
    "themeKey": "high_seas_boardwalk",
    "themeIcon": "🌊",
    "themeName": "🌊 High Seas & Windmill",
    "themeSubtitle": "Seashells, shockwaves, wavelengths, windmills, flowerpots & shark tanks",
    "themeId": 1,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 7,
    "zone1Triplets": [
      {
        "id": "sea_shell_shock",
        "parts": [
          "SEA",
          "SHELL",
          "SHOCK"
        ],
        "part2Hint": "SEA + SHELL = Seashell",
        "part3Hint": "SHELL + SHOCK = Shell shock (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SPELL",
          "YELL",
          "SMELL",
          "DWELL"
        ],
        "part3Decoys": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "CLOCK"
        ],
        "thematicLink": {
          "nextPart1": "WAVE",
          "connection": "2-Node Link",
          "hint": "SHOCK + WAVE = Shockwave",
          "decoys": [
            "CAVE",
            "BRAVE",
            "GRAVE",
            "SHAVE"
          ]
        }
      },
      {
        "id": "wave_length_way",
        "parts": [
          "WAVE",
          "LENGTH",
          "WAY"
        ],
        "part2Hint": "WAVE + LENGTH = Wavelength",
        "part3Hint": "LENGTH + WAY = Lengthway (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "STRENGTH",
          "TENTH",
          "PLINTH",
          "LABYRINTH"
        ],
        "part3Decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "thematicLink": {
          "nextPart1": "SIDE",
          "connection": "2-Node Link",
          "hint": "WAY + SIDE = Wayside",
          "decoys": [
            "BRIDE",
            "PRIDE",
            "GLIDE",
            "STRIDE"
          ]
        }
      },
      {
        "id": "side_show_down",
        "parts": [
          "SIDE",
          "SHOW",
          "DOWN"
        ],
        "part2Hint": "SIDE + SHOW = Sideshow",
        "part3Hint": "SHOW + DOWN = Showdown (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "part3Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "thematicLink": {
          "nextPart1": "WIND",
          "connection": "2-Node Link",
          "hint": "DOWN + WIND = Downwind",
          "decoys": [
            "RIND",
            "BLIND",
            "GRIND",
            "MIND"
          ]
        }
      },
      {
        "id": "wind_mill_stone",
        "parts": [
          "WIND",
          "MILL",
          "STONE"
        ],
        "part2Hint": "WIND + MILL = Windmill",
        "part3Hint": "MILL + STONE = Millstone (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "QUILL",
          "GRILL",
          "FRILL",
          "DRILL"
        ],
        "part3Decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "thematicLink": {
          "nextPart1": "WALL",
          "connection": "2-Node Link",
          "hint": "STONE + WALL = Stonewall",
          "decoys": [
            "SHAWL",
            "BRAWL",
            "SCRAWL",
            "DRAWL"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "WALL",
        "target": "FLOWER",
        "hint": "WALL + FLOWER = Wallflower",
        "decoys": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ]
      },
      {
        "stem": "FLOWER",
        "target": "POT",
        "hint": "FLOWER + POT = Flowerpot",
        "decoys": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ]
      },
      {
        "stem": "POT",
        "target": "HOLE",
        "hint": "POT + HOLE = Pothole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "CARD",
        "hint": "HOLE + CARD = Hole card",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      },
      {
        "stem": "CARD",
        "target": "SHARK",
        "hint": "CARD + SHARK = Card shark",
        "decoys": [
          "LARK",
          "SPARK",
          "BARK",
          "DARK"
        ]
      },
      {
        "stem": "SHARK",
        "target": "TANK",
        "hint": "SHARK + TANK = Shark tank",
        "decoys": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ]
      },
      {
        "stem": "TANK",
        "target": "TOP",
        "hint": "TANK + TOP = Tank top",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "TOP",
        "target": "DOG",
        "hint": "TOP + DOG = Top dog",
        "decoys": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ]
      },
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "WORK",
        "hint": "HOUSE + WORK = Housework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BOOK",
        "hint": "WORK + BOOK = Workbook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "CASE",
        "hint": "BOOK + CASE = Bookcase",
        "decoys": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ]
      },
      {
        "stem": "CASE",
        "target": "WORK",
        "hint": "CASE + WORK = Casework",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "OUT",
        "hint": "WORK + OUT = Workout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "DOOR",
        "hint": "OUT + DOOR = Outdoor",
        "decoys": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ]
      },
      {
        "stem": "DOOR",
        "target": "STEP",
        "hint": "DOOR + STEP = Doorstep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "STEP",
        "target": "DOWN",
        "hint": "STEP + DOWN = Stepdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "FALL",
        "hint": "DOWN + FALL = Downfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "BACK",
        "hint": "FALL + BACK = Fallback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "HAND",
        "hint": "BACK + HAND = Backhand",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ]
      },
      {
        "stem": "HAND",
        "target": "BAG",
        "hint": "HAND + BAG = Handbag",
        "decoys": [
          "STAG",
          "CRAG",
          "BRAG",
          "SNAG"
        ]
      },
      {
        "stem": "BAG",
        "target": "PIPE",
        "hint": "BAG + PIPE = Bagpipe",
        "decoys": [
          "SNIPE",
          "STRIPE",
          "GRIPE",
          "SWIPE"
        ]
      },
      {
        "stem": "PIPE",
        "target": "LINE",
        "hint": "PIPE + LINE = Pipeline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "HOLD",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ]
      },
      {
        "stem": "HOLD",
        "target": "OVER",
        "hint": "HOLD + OVER = Holdover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "FLOW",
        "hint": "OVER + FLOW = Overflow",
        "decoys": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ]
      },
      {
        "stem": "FLOW",
        "target": "CHART",
        "hint": "FLOW + CHART = Flowchart",
        "decoys": [
          "TART",
          "DART",
          "CART",
          "SMART"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "SEA",
        "displayStem": "SEA",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SHELL",
        "decoyPool": [
          "SPELL",
          "YELL",
          "SMELL",
          "DWELL"
        ],
        "decoyWord": "SPELL",
        "leftRightSeed": 0,
        "compoundHint": "SEA + SHELL = Seashell"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "SHELL",
        "displayStem": "SHELL",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SHOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "CLOCK"
        ],
        "decoyWord": "FLOCK",
        "leftRightSeed": 1,
        "compoundHint": "SHELL + SHOCK = Shell shock (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOCK",
        "displayStem": "SHOCK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WAVE",
        "decoyPool": [
          "CAVE",
          "BRAVE",
          "GRAVE",
          "SHAVE"
        ],
        "decoyWord": "CAVE",
        "leftRightSeed": 0,
        "compoundHint": "SHOCK + WAVE = Shockwave"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WAVE",
        "displayStem": "⬅ WAVE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "AIR",
        "decoyPool": [
          "LENGTH"
        ],
        "decoyWord": "LENGTH",
        "trapCompoundHint": "WAVE + LENGTH = Wavelength",
        "leftRightSeed": 1,
        "compoundHint": "⬅ AIR + WAVE = Airwave (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WAVE: AIR + WAVE = Airwave. You have to resist the forward trap LENGTH (WAVE + LENGTH = Wavelength)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "AIR",
        "displayStem": "AIR",
        "stemBadge": "3-NODE LINK",
        "correctWord": "PORT",
        "decoyPool": [
          "FORT",
          "SPORT",
          "COURT",
          "SHORT"
        ],
        "decoyWord": "FORT",
        "leftRightSeed": 0,
        "compoundHint": "AIR + PORT = Airport"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "PORT",
        "displayStem": "PORT",
        "stemBadge": "3-NODE LINK",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "leftRightSeed": 1,
        "compoundHint": "PORT + HOLE = Porthole (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "leftRightSeed": 0,
        "compoundHint": "HOLE + CARD = Hole card"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CARD",
        "displayStem": "⬅ CARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "POST",
        "decoyPool": [
          "BOARD"
        ],
        "decoyWord": "BOARD",
        "trapCompoundHint": "CARD + BOARD = Cardboard",
        "leftRightSeed": 1,
        "compoundHint": "⬅ POST + CARD = Postcard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of CARD: POST + CARD = Postcard. You have to resist the forward trap BOARD (CARD + BOARD = Cardboard)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 0,
        "compoundHint": "POST + MARK = Postmark"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "3-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 1,
        "compoundHint": "MARK + UP = Markup (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 0,
        "compoundHint": "UP + SIDE = Upside"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "⬅ SIDE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OFF",
        "decoyPool": [
          "SHOW"
        ],
        "decoyWord": "SHOW",
        "trapCompoundHint": "SIDE + SHOW = Sideshow",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OFF + SIDE = Offside (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of SIDE: OFF + SIDE = Offside. You have to resist the forward trap SHOW (SIDE + SHOW = Sideshow)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "stemBadge": "2-NODE LINK",
        "correctWord": "STAGE",
        "decoyPool": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ],
        "decoyWord": "CAGE",
        "leftRightSeed": 0,
        "compoundHint": "OFF + STAGE = Offstage"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "STAGE",
        "displayStem": "STAGE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "COACH",
        "decoyPool": [
          "ROACH",
          "POACH",
          "BROOCH",
          "LOACH"
        ],
        "decoyWord": "ROACH",
        "leftRightSeed": 1,
        "compoundHint": "STAGE + COACH = Stagecoach (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "COACH",
        "displayStem": "COACH",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "COACH + WORK = Coachwork"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "CASE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ CASE + WORK = Casework (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: CASE + WORK = Casework. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "CASE + BOOK = Casebook"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 1,
        "compoundHint": "BOOK + MARK = Bookmark (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "MARK + DOWN = Markdown"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "⬅ DOWN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "DROP",
        "decoyPool": [
          "POUR"
        ],
        "decoyWord": "POUR",
        "trapCompoundHint": "DOWN + POUR = Downpour",
        "leftRightSeed": 1,
        "compoundHint": "⬅ DROP + DOWN = Dropdown (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOWN: DROP + DOWN = Dropdown. You have to resist the forward trap POUR (DOWN + POUR = Downpour)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DROP",
        "displayStem": "DROP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "DROP + OUT = Dropout"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BREAK",
        "decoyPool": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ],
        "decoyWord": "STEAK",
        "leftRightSeed": 1,
        "compoundHint": "OUT + BREAK = Outbreak (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BREAK",
        "displayStem": "BREAK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "BREAK + UP = Breakup"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "⬅ UP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "LOOK",
        "decoyPool": [
          "TURN"
        ],
        "decoyWord": "TURN",
        "trapCompoundHint": "UP + TURN = Upturn",
        "leftRightSeed": 1,
        "compoundHint": "⬅ LOOK + UP = Lookup (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of UP: LOOK + UP = Lookup. You have to resist the forward trap TURN (UP + TURN = Upturn)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "LOOK + OVER = Look over"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "OVER + TIME = Overtime (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "leftRightSeed": 0,
        "compoundHint": "TIME + LINE = Timeline"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "⬅ LINE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "UP"
        ],
        "decoyWord": "UP",
        "trapCompoundHint": "LINE + UP = Lineup",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SIDE + LINE = Sideline (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of LINE: SIDE + LINE = Sideline. You have to resist the forward trap UP (LINE + UP = Lineup)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + WALK = Sidewalk"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 1,
        "compoundHint": "WALK + OUT = Walkout (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "OUT + BACK = Outback"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "⬅ BACK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FLASH",
        "decoyPool": [
          "DROP"
        ],
        "decoyWord": "DROP",
        "trapCompoundHint": "BACK + DROP = Backdrop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FLASH + BACK = Flashback (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BACK: FLASH + BACK = Flashback. You have to resist the forward trap DROP (BACK + DROP = Backdrop)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FLASH",
        "displayStem": "FLASH",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LIGHT",
        "decoyPool": [
          "KITE",
          "FLIGHT",
          "KNIGHT",
          "FRIGHT"
        ],
        "decoyWord": "KITE",
        "leftRightSeed": 0,
        "compoundHint": "FLASH + LIGHT = Flashlight"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LIGHT",
        "displayStem": "LIGHT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOUSE",
        "decoyPool": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "decoyWord": "BLOUSE",
        "leftRightSeed": 1,
        "compoundHint": "LIGHT + HOUSE = Lighthouse (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "HOUSE + WORK = Housework"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FIRE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FIRE + WORK = Firework (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: FIRE + WORK = Firework. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "PLACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "leftRightSeed": 0,
        "compoundHint": "FIRE + PLACE = Fireplace"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PLACE",
        "displayStem": "PLACE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "leftRightSeed": 1,
        "compoundHint": "PLACE + MAT = Placemat (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MAT",
        "displayStem": "⬅ MAT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "DOOR",
        "decoyPool": [
          "BOARD"
        ],
        "decoyWord": "BOARD",
        "trapCompoundHint": "MAT + BOARD = Matboard",
        "leftRightSeed": 0,
        "compoundHint": "⬅ DOOR + MAT = Doormat (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of MAT: DOOR + MAT = Doormat. You have to resist the forward trap BOARD (MAT + BOARD = Matboard)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOOR",
        "displayStem": "DOOR",
        "stemBadge": "2-NODE LINK",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "leftRightSeed": 1,
        "compoundHint": "DOOR + STEP = Doorstep"
      }
    ]
  },
  {
    "vineNumber": 150,
    "dateKey": "2026-11-09",
    "title": "⛈️ Windfall & Stonewall",
    "themeIndex": 8,
    "themeKey": "storm_front_sky",
    "themeIcon": "⛈️",
    "themeName": "⛈️ Windfall & Stonewall",
    "themeSubtitle": "Windfalls, stepping stones, flowerbeds, shift keys, bookworms & wormholes",
    "themeId": 2,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 8,
    "zone1Triplets": [
      {
        "id": "wind_fall_out",
        "parts": [
          "WIND",
          "FALL",
          "OUT"
        ],
        "part2Hint": "WIND + FALL = Windfall",
        "part3Hint": "FALL + OUT = Fallout (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "part3Decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "thematicLink": {
          "nextPart1": "DOOR",
          "connection": "2-Node Link",
          "hint": "OUT + DOOR = Outdoor",
          "decoys": [
            "CHORE",
            "SPORE",
            "BOAR",
            "BLOUSE"
          ]
        }
      },
      {
        "id": "door_step_stone",
        "parts": [
          "DOOR",
          "STEP",
          "STONE"
        ],
        "part2Hint": "DOOR + STEP = Doorstep",
        "part3Hint": "STEP + STONE = Stepping stone (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "part3Decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "thematicLink": {
          "nextPart1": "WALL",
          "connection": "2-Node Link",
          "hint": "STONE + WALL = Stonewall",
          "decoys": [
            "SHAWL",
            "BRAWL",
            "SCRAWL",
            "DRAWL"
          ]
        }
      },
      {
        "id": "wall_flower_bed",
        "parts": [
          "WALL",
          "FLOWER",
          "BED"
        ],
        "part2Hint": "WALL + FLOWER = Wallflower",
        "part3Hint": "FLOWER + BED = Flowerbed (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ],
        "part3Decoys": [
          "SLED",
          "SHRED",
          "THREAD",
          "DREAD"
        ],
        "thematicLink": {
          "nextPart1": "TIME",
          "connection": "2-Node Link",
          "hint": "BED + TIME = Bedtime",
          "decoys": [
            "LIME",
            "CHIME",
            "SLIME",
            "GRIME"
          ]
        }
      },
      {
        "id": "time_shift_key",
        "parts": [
          "TIME",
          "SHIFT",
          "KEY"
        ],
        "part2Hint": "TIME + SHIFT = Timeshift",
        "part3Hint": "SHIFT + KEY = Shift key (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "part3Decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "thematicLink": {
          "nextPart1": "NOTE",
          "connection": "2-Node Link",
          "hint": "KEY + NOTE = Keynote",
          "decoys": [
            "GOAT",
            "MOAT",
            "THROAT",
            "GLOAT"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "NOTE",
        "target": "BOOK",
        "hint": "NOTE + BOOK = Notebook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "WORM",
        "hint": "BOOK + WORM = Bookworm",
        "decoys": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ]
      },
      {
        "stem": "WORM",
        "target": "HOLE",
        "hint": "WORM + HOLE = Wormhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "PUNCH",
        "hint": "HOLE + PUNCH = Hole punch",
        "decoys": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ]
      },
      {
        "stem": "PUNCH",
        "target": "BOWL",
        "hint": "PUNCH + BOWL = Punch bowl",
        "decoys": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ]
      },
      {
        "stem": "BOWL",
        "target": "CUT",
        "hint": "BOWL + CUT = Bowl cut",
        "decoys": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ]
      },
      {
        "stem": "CUT",
        "target": "OUT",
        "hint": "CUT + OUT = Cutout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BACK",
        "hint": "OUT + BACK = Outback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "BOARD",
        "hint": "BACK + BOARD = Backboard",
        "decoys": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ]
      },
      {
        "stem": "BOARD",
        "target": "WALK",
        "hint": "BOARD + WALK = Boardwalk",
        "decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ]
      },
      {
        "stem": "WALK",
        "target": "OUT",
        "hint": "WALK + OUT = Walkout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BURST",
        "hint": "OUT + BURST = Outburst",
        "decoys": [
          "THIRST",
          "FIRST",
          "WORST",
          "HEARSE"
        ]
      },
      {
        "stem": "BURST",
        "target": "IN",
        "hint": "BURST + IN = Burst in",
        "decoys": [
          "FIN",
          "CHIN",
          "SHIN",
          "GRIN"
        ]
      },
      {
        "stem": "IN",
        "target": "SIDE",
        "hint": "IN + SIDE = Inside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "STEP",
        "hint": "SIDE + STEP = Sidestep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      },
      {
        "stem": "STEP",
        "target": "STONE",
        "hint": "STEP + STONE = Stepping stone",
        "decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "STONE",
        "target": "WALL",
        "hint": "STONE + WALL = Stonewall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "WALL",
        "target": "PAPER",
        "hint": "WALL + PAPER = Wallpaper",
        "decoys": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ]
      },
      {
        "stem": "PAPER",
        "target": "BACK",
        "hint": "PAPER + BACK = Paperback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "OUT",
        "hint": "DROP + OUT = Dropout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "UP",
        "hint": "BREAK + UP = Breakup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "LIFT",
        "hint": "UP + LIFT = Uplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "BEAT",
        "hint": "OFF + BEAT = Offbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "DOWN",
        "hint": "BEAT + DOWN = Beatdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "POUR",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "WIND",
        "displayStem": "WIND",
        "stemBadge": "3-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 0,
        "compoundHint": "WIND + FALL = Windfall"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "3-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 1,
        "compoundHint": "FALL + OUT = Fallout (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOOR",
        "decoyPool": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ],
        "decoyWord": "CHORE",
        "leftRightSeed": 0,
        "compoundHint": "OUT + DOOR = Outdoor"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOOR",
        "displayStem": "⬅ DOOR",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "IN",
        "decoyPool": [
          "STEP"
        ],
        "decoyWord": "STEP",
        "trapCompoundHint": "DOOR + STEP = Doorstep",
        "leftRightSeed": 1,
        "compoundHint": "⬅ IN + DOOR = Indoor (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOOR: IN + DOOR = Indoor. You have to resist the forward trap STEP (DOOR + STEP = Doorstep)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "IN",
        "displayStem": "IN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 0,
        "compoundHint": "IN + SIDE = Inside"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 1,
        "compoundHint": "SIDE + WALK = Sidewalk (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "WALK + OVER = Walkover"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "⬅ OVER",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "GAME",
        "decoyPool": [
          "SEA"
        ],
        "decoyWord": "SEA",
        "trapCompoundHint": "OVER + SEA = Oversea",
        "leftRightSeed": 1,
        "compoundHint": "⬅ GAME + OVER = Game over (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OVER: GAME + OVER = Game over. You have to resist the forward trap SEA (OVER + SEA = Oversea)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "GAME",
        "displayStem": "GAME",
        "stemBadge": "3-NODE LINK",
        "correctWord": "PLAN",
        "decoyPool": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ],
        "decoyWord": "CLAN",
        "leftRightSeed": 0,
        "compoundHint": "GAME + PLAN = Game plan"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "PLAN",
        "displayStem": "PLAN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 1,
        "compoundHint": "PLAN + OUT = Plan out (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "OUT + BACK = Outback"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "⬅ BACK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FALL",
        "decoyPool": [
          "DROP"
        ],
        "decoyWord": "DROP",
        "trapCompoundHint": "BACK + DROP = Backdrop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FALL + BACK = Fallback (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BACK: FALL + BACK = Fallback. You have to resist the forward trap DROP (BACK + DROP = Backdrop)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "FALL + DOWN = Fall down"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "POUR",
        "decoyPool": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "decoyWord": "SNORE",
        "leftRightSeed": 1,
        "compoundHint": "DOWN + POUR = Downpour (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "POUR",
        "displayStem": "POUR",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "POUR + OVER = Pour-over"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "⬅ OVER",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "START",
        "decoyPool": [
          "SEA"
        ],
        "decoyWord": "SEA",
        "trapCompoundHint": "OVER + SEA = Oversea",
        "leftRightSeed": 1,
        "compoundHint": "⬅ START + OVER = Start over (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OVER: START + OVER = Start over. You have to resist the forward trap SEA (OVER + SEA = Oversea)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "START",
        "displayStem": "START",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "START + UP = Startup"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "leftRightSeed": 1,
        "compoundHint": "UP + LIFT = Uplift (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LIFT",
        "displayStem": "LIFT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "LIFT + OFF = Liftoff"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "⬅ OFF",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TURN",
        "decoyPool": [
          "SET"
        ],
        "decoyWord": "SET",
        "trapCompoundHint": "OFF + SET = Offset",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TURN + OFF = Turnoff (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OFF: TURN + OFF = Turnoff. You have to resist the forward trap SET (OFF + SET = Offset)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "TURN + OUT = Turnout"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FIELD",
        "decoyPool": [
          "SHIELD",
          "WIELD",
          "PEELED",
          "SEALED"
        ],
        "decoyWord": "SHIELD",
        "leftRightSeed": 1,
        "compoundHint": "OUT + FIELD = Outfield (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FIELD",
        "displayStem": "FIELD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "FIELD + WORK = Fieldwork"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "CASE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ CASE + WORK = Casework (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: CASE + WORK = Casework. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "CASE + BOOK = Casebook"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 1,
        "compoundHint": "BOOK + MARK = Bookmark (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "MARK + UP = Markup"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "⬅ UP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "LINE",
        "decoyPool": [
          "TURN"
        ],
        "decoyWord": "TURN",
        "trapCompoundHint": "UP + TURN = Upturn",
        "leftRightSeed": 1,
        "compoundHint": "⬅ LINE + UP = Lineup (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of UP: LINE + UP = Lineup. You have to resist the forward trap TURN (UP + TURN = Upturn)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "LINE + OUT = Lineout"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "leftRightSeed": 1,
        "compoundHint": "OUT + RUN = Outrun (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "AWAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "leftRightSeed": 0,
        "compoundHint": "RUN + AWAY = Runaway"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "AWAY",
        "displayStem": "⬅ AWAY",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WALK",
        "decoyPool": [
          "GAME"
        ],
        "decoyWord": "GAME",
        "trapCompoundHint": "AWAY + GAME = Away game",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WALK + AWAY = Walkaway (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of AWAY: WALK + AWAY = Walkaway. You have to resist the forward trap GAME (AWAY + GAME = Away game)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "decoyWord": "CLAY",
        "leftRightSeed": 0,
        "compoundHint": "WALK + WAY = Walkway"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 1,
        "compoundHint": "WAY + SIDE = Wayside (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + BOARD = Sideboard"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BACK",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BACK + BOARD = Backboard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: BACK + BOARD = Backboard. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TROTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "leftRightSeed": 0,
        "compoundHint": "BACK + WATER = Backwater"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "WATER + FALL = Waterfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "⬅ FALL",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "DOWN",
        "decoyPool": [
          "BACK"
        ],
        "decoyWord": "BACK",
        "trapCompoundHint": "FALL + BACK = Fallback",
        "leftRightSeed": 0,
        "compoundHint": "⬅ DOWN + FALL = Downfall (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of FALL: DOWN + FALL = Downfall. You have to resist the forward trap BACK (FALL + BACK = Fallback)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "DOWN + TIME = Downtime"
      }
    ]
  },
  {
    "vineNumber": 151,
    "dateKey": "2026-11-10",
    "title": "💼 Corner Office & Hustle",
    "themeIndex": 9,
    "themeKey": "corner_office_hustle",
    "themeIcon": "💼",
    "themeName": "💼 Corner Office & Hustle",
    "themeSubtitle": "Notepads, padlocks, carpools, post offices, spaceships, beatboxes & box offices",
    "themeId": 0,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 9,
    "zone1Triplets": [
      {
        "id": "note_pad_lock",
        "parts": [
          "NOTE",
          "PAD",
          "LOCK"
        ],
        "part2Hint": "NOTE + PAD = Notepad",
        "part3Hint": "PAD + LOCK = Padlock (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "PLAID",
          "GLAD",
          "CLAD",
          "BRAD"
        ],
        "part3Decoys": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "thematicLink": {
          "nextPart1": "BOX",
          "connection": "2-Node Link",
          "hint": "LOCK + BOX = Lockbox",
          "decoys": [
            "FOX",
            "OX",
            "PHLOX",
            "PARADOX"
          ]
        }
      },
      {
        "id": "box_car_pool",
        "parts": [
          "BOX",
          "CAR",
          "POOL"
        ],
        "part2Hint": "BOX + CAR = Boxcar",
        "part3Hint": "CAR + POOL = Carpool (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ],
        "part3Decoys": [
          "SPOOL",
          "DROOL",
          "FOOL",
          "GHOUL"
        ],
        "thematicLink": {
          "nextPart1": "SIDE",
          "connection": "2-Node Link",
          "hint": "POOL + SIDE = Poolside",
          "decoys": [
            "BRIDE",
            "PRIDE",
            "GLIDE",
            "STRIDE"
          ]
        }
      },
      {
        "id": "side_board_walk",
        "parts": [
          "SIDE",
          "BOARD",
          "WALK"
        ],
        "part2Hint": "SIDE + BOARD = Sideboard",
        "part3Hint": "BOARD + WALK = Boardwalk (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "part3Decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "thematicLink": {
          "nextPart1": "OUT",
          "connection": "2-Node Link",
          "hint": "WALK + OUT = Walkout",
          "decoys": [
            "TROUT",
            "SPROUT",
            "SNOUT",
            "GROUT"
          ]
        }
      },
      {
        "id": "out_post_office",
        "parts": [
          "OUT",
          "POST",
          "OFFICE"
        ],
        "part2Hint": "OUT + POST = Outpost",
        "part3Hint": "POST + OFFICE = Post office (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ],
        "part3Decoys": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ],
        "thematicLink": {
          "nextPart1": "SPACE",
          "connection": "2-Node Link",
          "hint": "OFFICE + SPACE = Office space",
          "decoys": [
            "LACE",
            "MACE",
            "BRACE",
            "GRACE"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "SPACE",
        "target": "SHIP",
        "hint": "SPACE + SHIP = Spaceship",
        "decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ]
      },
      {
        "stem": "SHIP",
        "target": "WRECK",
        "hint": "SHIP + WRECK = Shipwreck",
        "decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ]
      },
      {
        "stem": "WRECK",
        "target": "BALL",
        "hint": "WRECK + BALL = Wrecking ball",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
      {
        "stem": "BALL",
        "target": "PARK",
        "hint": "BALL + PARK = Ballpark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "PARK",
        "target": "WAY",
        "hint": "PARK + WAY = Parkway",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      },
      {
        "stem": "WAY",
        "target": "SIDE",
        "hint": "WAY + SIDE = Wayside",
        "decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ]
      },
      {
        "stem": "SIDE",
        "target": "LINE",
        "hint": "SIDE + LINE = Sideline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "BEAT",
        "hint": "UP + BEAT = Upbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "BOX",
        "hint": "BEAT + BOX = Beatbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      },
      {
        "stem": "BOX",
        "target": "OFFICE",
        "hint": "BOX + OFFICE = Box office",
        "decoys": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ]
      },
      {
        "stem": "OFFICE",
        "target": "WORK",
        "hint": "OFFICE + WORK = Office work",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BENCH",
        "hint": "WORK + BENCH = Workbench",
        "decoys": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ]
      },
      {
        "stem": "BENCH",
        "target": "MARK",
        "hint": "BENCH + MARK = Benchmark",
        "decoys": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ]
      },
      {
        "stem": "MARK",
        "target": "UP",
        "hint": "MARK + UP = Markup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "TURN",
        "target": "OUT",
        "hint": "TURN + OUT = Turnout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "FALL",
        "hint": "OUT + FALL = Outfall",
        "decoys": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ]
      },
      {
        "stem": "FALL",
        "target": "DOWN",
        "hint": "FALL + DOWN = Fall down",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TIME",
        "hint": "DOWN + TIME = Downtime",
        "decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ]
      },
      {
        "stem": "TIME",
        "target": "OVER",
        "hint": "TIME + OVER = Time over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "LOOK",
        "hint": "OVER + LOOK = Overlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "OUT",
        "hint": "LOOK + OUT = Lookout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "RUN",
        "hint": "OUT + RUN = Outrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "OFF",
        "hint": "RUN + OFF = Runoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "BACK",
        "hint": "SET + BACK = Setback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "FIRE",
        "hint": "BACK + FIRE = Backfire",
        "decoys": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "NOTE",
        "displayStem": "NOTE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "PAD",
        "decoyPool": [
          "PLAID",
          "GLAD",
          "CLAD",
          "BRAD"
        ],
        "decoyWord": "PLAID",
        "leftRightSeed": 0,
        "compoundHint": "NOTE + PAD = Notepad"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "PAD",
        "displayStem": "PAD",
        "stemBadge": "3-NODE LINK",
        "correctWord": "LOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "decoyWord": "FLOCK",
        "leftRightSeed": 1,
        "compoundHint": "PAD + LOCK = Padlock (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOCK",
        "displayStem": "LOCK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOX",
        "decoyPool": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "decoyWord": "FOX",
        "leftRightSeed": 0,
        "compoundHint": "LOCK + BOX = Lockbox"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOX",
        "displayStem": "⬅ BOX",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "MAIL",
        "decoyPool": [
          "CAR"
        ],
        "decoyWord": "CAR",
        "trapCompoundHint": "BOX + CAR = Boxcar",
        "leftRightSeed": 1,
        "compoundHint": "⬅ MAIL + BOX = Mailbox (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOX: MAIL + BOX = Mailbox. You have to resist the forward trap CAR (BOX + CAR = Boxcar)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "MAIL",
        "displayStem": "MAIL",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MAN",
        "decoyPool": [
          "PAN",
          "VAN",
          "CLAN",
          "SWAN"
        ],
        "decoyWord": "PAN",
        "leftRightSeed": 0,
        "compoundHint": "MAIL + MAN = Mailman"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "MAN",
        "displayStem": "MAN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "POLE",
          "SOLE",
          "FOAL"
        ],
        "decoyWord": "MOLE",
        "leftRightSeed": 1,
        "compoundHint": "MAN + HOLE = Manhole (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "leftRightSeed": 0,
        "compoundHint": "HOLE + CARD = Hole card"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CARD",
        "displayStem": "⬅ CARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "POST",
        "decoyPool": [
          "BOARD"
        ],
        "decoyWord": "BOARD",
        "trapCompoundHint": "CARD + BOARD = Cardboard",
        "leftRightSeed": 1,
        "compoundHint": "⬅ POST + CARD = Postcard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of CARD: POST + CARD = Postcard. You have to resist the forward trap BOARD (CARD + BOARD = Cardboard)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 0,
        "compoundHint": "POST + MARK = Postmark"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "3-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 1,
        "compoundHint": "MARK + UP = Markup (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 0,
        "compoundHint": "UP + SIDE = Upside"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "⬅ SIDE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OFF",
        "decoyPool": [
          "SHOW"
        ],
        "decoyWord": "SHOW",
        "trapCompoundHint": "SIDE + SHOW = Sideshow",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OFF + SIDE = Offside (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of SIDE: OFF + SIDE = Offside. You have to resist the forward trap SHOW (SIDE + SHOW = Sideshow)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "leftRightSeed": 0,
        "compoundHint": "OFF + SET = Offset"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SET",
        "displayStem": "SET",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 1,
        "compoundHint": "SET + BACK = Setback (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "BACK + BOARD = Backboard"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "PARK",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ PARK + BOARD = Park board (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: PARK + BOARD = Park board. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PARK",
        "displayStem": "PARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "leftRightSeed": 0,
        "compoundHint": "PARK + BENCH = Park bench"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BENCH",
        "displayStem": "BENCH",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 1,
        "compoundHint": "BENCH + MARK = Benchmark (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "MARK + DOWN = Markdown"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "⬅ DOWN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SHOW",
        "decoyPool": [
          "POUR"
        ],
        "decoyWord": "POUR",
        "trapCompoundHint": "DOWN + POUR = Downpour",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SHOW + DOWN = Showdown (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOWN: SHOW + DOWN = Showdown. You have to resist the forward trap POUR (DOWN + POUR = Downpour)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CASE",
        "decoyPool": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "decoyWord": "VASE",
        "leftRightSeed": 0,
        "compoundHint": "SHOW + CASE = Showcase"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "CASE + WORK = Casework (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TIME + OVER = Time over"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 1,
        "compoundHint": "OVER + LOOK = Overlook (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "LOOK + UP = Lookup"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "⬅ UP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "LINE",
        "decoyPool": [
          "TURN"
        ],
        "decoyWord": "TURN",
        "trapCompoundHint": "UP + TURN = Upturn",
        "leftRightSeed": 1,
        "compoundHint": "⬅ LINE + UP = Lineup (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of UP: LINE + UP = Lineup. You have to resist the forward trap TURN (UP + TURN = Upturn)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "LINE + DOWN = Linedown"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "DOWN + FALL = Downfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "FALL + OUT = Fallout"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "HOLD",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ HOLD + OUT = Holdout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: HOLD + OUT = Holdout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "HOLD + OVER = Holdover"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "OVER + TIME = Overtime (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TABLE",
        "decoyPool": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "decoyWord": "FABLE",
        "leftRightSeed": 0,
        "compoundHint": "TIME + TABLE = Timetable"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TABLE",
        "displayStem": "⬅ TABLE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "WORK",
        "decoyPool": [
          "TOP"
        ],
        "decoyWord": "TOP",
        "trapCompoundHint": "TABLE + TOP = Tabletop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ WORK + TABLE = Worktable (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TABLE: WORK + TABLE = Worktable. You have to resist the forward trap TOP (TABLE + TOP = Tabletop)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "leftRightSeed": 0,
        "compoundHint": "WORK + SHOP = Workshop"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOP",
        "displayStem": "SHOP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "leftRightSeed": 1,
        "compoundHint": "SHOP + LIFT = Shoplift (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LIFT",
        "displayStem": "⬅ LIFT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "UP",
        "decoyPool": [
          "OFF"
        ],
        "decoyWord": "OFF",
        "trapCompoundHint": "LIFT + OFF = Liftoff",
        "leftRightSeed": 0,
        "compoundHint": "⬅ UP + LIFT = Uplift (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of LIFT: UP + LIFT = Uplift. You have to resist the forward trap OFF (LIFT + OFF = Liftoff)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "leftRightSeed": 1,
        "compoundHint": "UP + TURN = Upturn"
      }
    ]
  },
  {
    "vineNumber": 152,
    "dateKey": "2026-11-11",
    "title": "🏰 Sandcastle & Outback",
    "themeIndex": 10,
    "themeKey": "sandcastle_outback",
    "themeIcon": "🏰",
    "themeName": "🏰 Sandcastle & Outback",
    "themeSubtitle": "Sandcastles, paperbacks, landslides, outbacks, townhouses, flyovers & coatracks",
    "themeId": 1,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 10,
    "zone1Triplets": [
      {
        "id": "sand_castle_wall",
        "parts": [
          "SAND",
          "CASTLE",
          "WALL"
        ],
        "part2Hint": "SAND + CASTLE = Sandcastle",
        "part3Hint": "CASTLE + WALL = Castle wall (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "TASSEL",
          "HASSLE",
          "WRESTLE",
          "NESTLE"
        ],
        "part3Decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "thematicLink": {
          "nextPart1": "PAPER",
          "connection": "2-Node Link",
          "hint": "WALL + PAPER = Wallpaper",
          "decoys": [
            "CAPER",
            "TAPER",
            "VAPOR",
            "SCRAPER"
          ]
        }
      },
      {
        "id": "paper_back_bone",
        "parts": [
          "PAPER",
          "BACK",
          "BONE"
        ],
        "part2Hint": "PAPER + BACK = Paperback",
        "part3Hint": "BACK + BONE = Backbone (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "part3Decoys": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "thematicLink": {
          "nextPart1": "DRY",
          "connection": "2-Node Link",
          "hint": "BONE + DRY = Bone-dry",
          "decoys": [
            "SHY",
            "SLY",
            "PRY",
            "WRY"
          ]
        }
      },
      {
        "id": "dry_land_slide",
        "parts": [
          "DRY",
          "LAND",
          "SLIDE"
        ],
        "part2Hint": "DRY + LAND = Dryland",
        "part3Hint": "LAND + SLIDE = Landslide (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "part3Decoys": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "thematicLink": {
          "nextPart1": "SHOW",
          "connection": "2-Node Link",
          "hint": "SLIDE + SHOW = Slideshow",
          "decoys": [
            "CROW",
            "GLOW",
            "DOUGH",
            "TOE"
          ]
        }
      },
      {
        "id": "show_down_time",
        "parts": [
          "SHOW",
          "DOWN",
          "TIME"
        ],
        "part2Hint": "SHOW + DOWN = Showdown",
        "part3Hint": "DOWN + TIME = Downtime (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "part3Decoys": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "thematicLink": {
          "nextPart1": "OUT",
          "connection": "2-Node Link",
          "hint": "TIME + OUT = Timeout",
          "decoys": [
            "TROUT",
            "SPROUT",
            "SNOUT",
            "GROUT"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "OUT",
        "target": "BACK",
        "hint": "OUT + BACK = Outback",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "DROP",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "DROP",
        "target": "DOWN",
        "hint": "DROP + DOWN = Dropdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "TOWN",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ]
      },
      {
        "stem": "TOWN",
        "target": "HOUSE",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "FLY",
        "hint": "HOUSE + FLY = Housefly",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "FLY",
        "target": "OVER",
        "hint": "FLY + OVER = Flyover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "COAT",
        "hint": "OVER + COAT = Overcoat",
        "decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ]
      },
      {
        "stem": "COAT",
        "target": "RACK",
        "hint": "COAT + RACK = Coatrack",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "RACK",
        "target": "UP",
        "hint": "RACK + UP = Rack up",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "LIFT",
        "hint": "UP + LIFT = Uplift",
        "decoys": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ]
      },
      {
        "stem": "LIFT",
        "target": "OFF",
        "hint": "LIFT + OFF = Liftoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "SET",
        "hint": "OFF + SET = Offset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "OUT",
        "hint": "SET + OUT = Set out",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LINE",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ]
      },
      {
        "stem": "LINE",
        "target": "UP",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "UP",
        "target": "TURN",
        "hint": "UP + TURN = Upturn",
        "decoys": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ]
      },
      {
        "stem": "TURN",
        "target": "OVER",
        "hint": "TURN + OVER = Turnover",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "SLEEP",
        "hint": "OVER + SLEEP = Oversleep",
        "decoys": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ]
      },
      {
        "stem": "SLEEP",
        "target": "WALK",
        "hint": "SLEEP + WALK = Sleepwalk",
        "decoys": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ]
      },
      {
        "stem": "WALK",
        "target": "AWAY",
        "hint": "WALK + AWAY = Walkaway",
        "decoys": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ]
      },
      {
        "stem": "AWAY",
        "target": "GAME",
        "hint": "AWAY + GAME = Away game",
        "decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ]
      },
      {
        "stem": "GAME",
        "target": "PLAN",
        "hint": "GAME + PLAN = Game plan",
        "decoys": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ]
      },
      {
        "stem": "PLAN",
        "target": "OUT",
        "hint": "PLAN + OUT = Plan out",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "LOOK",
        "hint": "OUT + LOOK = Outlook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "LOOK",
        "target": "OVER",
        "hint": "LOOK + OVER = Look over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "RUN",
        "hint": "OVER + RUN = Overrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "OUT",
        "hint": "RUN + OUT = Runout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "SAND",
        "displayStem": "SAND",
        "stemBadge": "3-NODE LINK",
        "correctWord": "CASTLE",
        "decoyPool": [
          "TASSEL",
          "HASSLE",
          "WRESTLE",
          "NESTLE"
        ],
        "decoyWord": "TASSEL",
        "leftRightSeed": 0,
        "compoundHint": "SAND + CASTLE = Sandcastle"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "CASTLE",
        "displayStem": "CASTLE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "WALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "CASTLE + WALL = Castle wall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALL",
        "displayStem": "WALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "PAPER",
        "decoyPool": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ],
        "decoyWord": "CAPER",
        "leftRightSeed": 0,
        "compoundHint": "WALL + PAPER = Wallpaper"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PAPER",
        "displayStem": "⬅ PAPER",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "NEWS",
        "decoyPool": [
          "BACK"
        ],
        "decoyWord": "BACK",
        "trapCompoundHint": "PAPER + BACK = Paperback",
        "leftRightSeed": 1,
        "compoundHint": "⬅ NEWS + PAPER = Newspaper (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of PAPER: NEWS + PAPER = Newspaper. You have to resist the forward trap BACK (PAPER + BACK = Paperback)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "NEWS",
        "displayStem": "NEWS",
        "stemBadge": "3-NODE LINK",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GLOOM",
          "BLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "leftRightSeed": 0,
        "compoundHint": "NEWS + ROOM = Newsroom"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MATE",
        "decoyPool": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "decoyWord": "CRATE",
        "leftRightSeed": 1,
        "compoundHint": "ROOM + MATE = Roommate (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MATE",
        "displayStem": "MATE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "MATE + WORK = Matework"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "CASE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ CASE + WORK = Casework (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: CASE + WORK = Casework. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 0,
        "compoundHint": "CASE + BOOK = Casebook"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "stemBadge": "3-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 1,
        "compoundHint": "BOOK + MARK = Bookmark (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "MARK + UP = Markup"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "⬅ UP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "LINE",
        "decoyPool": [
          "TURN"
        ],
        "decoyWord": "TURN",
        "trapCompoundHint": "UP + TURN = Upturn",
        "leftRightSeed": 1,
        "compoundHint": "⬅ LINE + UP = Lineup (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of UP: LINE + UP = Lineup. You have to resist the forward trap TURN (UP + TURN = Upturn)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "LINE + OUT = Lineout"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 1,
        "compoundHint": "OUT + BACK = Outback (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "STAGE",
        "decoyPool": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ],
        "decoyWord": "CAGE",
        "leftRightSeed": 0,
        "compoundHint": "BACK + STAGE = Backstage"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "STAGE",
        "displayStem": "⬅ STAGE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "OFF",
        "decoyPool": [
          "COACH"
        ],
        "decoyWord": "COACH",
        "trapCompoundHint": "STAGE + COACH = Stagecoach",
        "leftRightSeed": 1,
        "compoundHint": "⬅ OFF + STAGE = Offstage (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of STAGE: OFF + STAGE = Offstage. You have to resist the forward trap COACH (STAGE + COACH = Stagecoach)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 0,
        "compoundHint": "OFF + SIDE = Offside"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "leftRightSeed": 1,
        "compoundHint": "SIDE + WALK = Sidewalk (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "WALK + OVER = Walkover"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "⬅ OVER",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "GAME",
        "decoyPool": [
          "SEA"
        ],
        "decoyWord": "SEA",
        "trapCompoundHint": "OVER + SEA = Oversea",
        "leftRightSeed": 1,
        "compoundHint": "⬅ GAME + OVER = Game over (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OVER: GAME + OVER = Game over. You have to resist the forward trap SEA (OVER + SEA = Oversea)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "GAME",
        "displayStem": "GAME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BIRD",
        "decoyPool": [
          "HERD",
          "CURD",
          "NERD",
          "WORD"
        ],
        "decoyWord": "HERD",
        "leftRightSeed": 0,
        "compoundHint": "GAME + BIRD = Gamebird"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BIRD",
        "displayStem": "BIRD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOUSE",
        "decoyPool": [
          "MOUSE",
          "BLOUSE",
          "GROUSE",
          "SPOUSE"
        ],
        "decoyWord": "MOUSE",
        "leftRightSeed": 1,
        "compoundHint": "BIRD + HOUSE = Birdhouse (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 0,
        "compoundHint": "HOUSE + WORK = Housework"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "⬅ WORK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "FIRE",
        "decoyPool": [
          "SHOP"
        ],
        "decoyWord": "SHOP",
        "trapCompoundHint": "WORK + SHOP = Workshop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ FIRE + WORK = Firework (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WORK: FIRE + WORK = Firework. You have to resist the forward trap SHOP (WORK + SHOP = Workshop)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "PLACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "leftRightSeed": 0,
        "compoundHint": "FIRE + PLACE = Fireplace"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PLACE",
        "displayStem": "PLACE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "leftRightSeed": 1,
        "compoundHint": "PLACE + MAT = Placemat (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MAT",
        "displayStem": "MAT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 0,
        "compoundHint": "MAT + BOARD = Matboard"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "⬅ BOARD",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "BACK",
        "decoyPool": [
          "WALK"
        ],
        "decoyWord": "WALK",
        "trapCompoundHint": "BOARD + WALK = Boardwalk",
        "leftRightSeed": 1,
        "compoundHint": "⬅ BACK + BOARD = Backboard (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BOARD: BACK + BOARD = Backboard. You have to resist the forward trap WALK (BOARD + WALK = Boardwalk)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "leftRightSeed": 0,
        "compoundHint": "BACK + HAND = Backhand"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HAND",
        "displayStem": "HAND",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHAKE",
        "decoyPool": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ],
        "decoyWord": "SNAKE",
        "leftRightSeed": 1,
        "compoundHint": "HAND + SHAKE = Handshake (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHAKE",
        "displayStem": "SHAKE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "SHAKE + DOWN = Shakedown"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "⬅ DOWN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SHOW",
        "decoyPool": [
          "POUR"
        ],
        "decoyWord": "POUR",
        "trapCompoundHint": "DOWN + POUR = Downpour",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SHOW + DOWN = Showdown (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DOWN: SHOW + DOWN = Showdown. You have to resist the forward trap POUR (DOWN + POUR = Downpour)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "leftRightSeed": 0,
        "compoundHint": "SHOW + ROOM = Showroom"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "leftRightSeed": 1,
        "compoundHint": "ROOM + WORK = Roomwork (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TIME + OVER = Time over"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "leftRightSeed": 1,
        "compoundHint": "OVER + TURN = Overturn (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "⬅ TURN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "UP",
        "decoyPool": [
          "OFF"
        ],
        "decoyWord": "OFF",
        "trapCompoundHint": "TURN + OFF = Turnoff",
        "leftRightSeed": 0,
        "compoundHint": "⬅ UP + TURN = Upturn (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TURN: UP + TURN = Upturn. You have to resist the forward trap OFF (TURN + OFF = Turnoff)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "leftRightSeed": 1,
        "compoundHint": "UP + SIDE = Upside"
      }
    ]
  },
  {
    "vineNumber": 153,
    "dateKey": "2026-11-12",
    "title": "🐾 Critter Crawl & Wild",
    "themeIndex": 11,
    "themeKey": "critter_crawl_wild",
    "themeIcon": "🐾",
    "themeName": "🐾 Critter Crawl & Wild",
    "themeSubtitle": "Gamebirds, birdbaths, bookworms, card sharks, top dogs, doghouses & flytraps",
    "themeId": 2,
    "lexiconVersion": "v10_reverse_graft_loops",
    "chainSetIndex": 11,
    "zone1Triplets": [
      {
        "id": "hair_cut_back",
        "parts": [
          "HAIR",
          "CUT",
          "BACK"
        ],
        "part2Hint": "HAIR + CUT = Haircut",
        "part3Hint": "CUT + BACK = Cutback (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "part3Decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "thematicLink": {
          "nextPart1": "DROP",
          "connection": "2-Node Link",
          "hint": "BACK + DROP = Backdrop",
          "decoys": [
            "MOP",
            "CHOP",
            "CROP",
            "PLOP"
          ]
        }
      },
      {
        "id": "drop_down_town",
        "parts": [
          "DROP",
          "DOWN",
          "TOWN"
        ],
        "part2Hint": "DROP + DOWN = Dropdown",
        "part3Hint": "DOWN + TOWN = Downtown (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "part3Decoys": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "thematicLink": {
          "nextPart1": "SHIP",
          "connection": "2-Node Link",
          "hint": "TOWN + SHIP = Township",
          "decoys": [
            "CHIP",
            "WHIP",
            "DRIP",
            "BLIP"
          ]
        }
      },
      {
        "id": "ship_wreck_ball",
        "parts": [
          "SHIP",
          "WRECK",
          "BALL"
        ],
        "part2Hint": "SHIP + WRECK = Shipwreck",
        "part3Hint": "WRECK + BALL = Wrecking ball (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ],
        "part3Decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "thematicLink": {
          "nextPart1": "PARK",
          "connection": "2-Node Link",
          "hint": "BALL + PARK = Ballpark",
          "decoys": [
            "SHARK",
            "LARK",
            "SPARK",
            "BARK"
          ]
        }
      },
      {
        "id": "park_board_game",
        "parts": [
          "PARK",
          "BOARD",
          "GAME"
        ],
        "part2Hint": "PARK + BOARD = Park board",
        "part3Hint": "BOARD + GAME = Board game (🌸 3-Part Compound Complete!)",
        "part2Decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "part3Decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ],
        "thematicLink": {
          "nextPart1": "BIRD",
          "connection": "2-Node Link",
          "hint": "GAME + BIRD = Gamebird",
          "decoys": [
            "HERD",
            "CURD",
            "NERD",
            "WORD"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "BIRD",
        "target": "BATH",
        "hint": "BIRD + BATH = Birdbath",
        "decoys": [
          "WRATH",
          "MATH",
          "MOTH",
          "BROTH"
        ]
      },
      {
        "stem": "BATH",
        "target": "ROBE",
        "hint": "BATH + ROBE = Bathrobe",
        "decoys": [
          "GLOBE",
          "PROBE",
          "LOBE",
          "STROBE"
        ]
      },
      {
        "stem": "ROBE",
        "target": "HOOK",
        "hint": "ROBE + HOOK = Robe hook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "HOOK",
        "target": "UP",
        "hint": "HOOK + UP = Hookup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "BEAT",
        "hint": "UP + BEAT = Upbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      },
      {
        "stem": "BEAT",
        "target": "BOX",
        "hint": "BEAT + BOX = Beatbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      },
      {
        "stem": "BOX",
        "target": "OFFICE",
        "hint": "BOX + OFFICE = Box office",
        "decoys": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ]
      },
      {
        "stem": "OFFICE",
        "target": "WORK",
        "hint": "OFFICE + WORK = Office work",
        "decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ]
      },
      {
        "stem": "WORK",
        "target": "BOOK",
        "hint": "WORK + BOOK = Workbook",
        "decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ]
      },
      {
        "stem": "BOOK",
        "target": "WORM",
        "hint": "BOOK + WORM = Bookworm",
        "decoys": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ]
      },
      {
        "stem": "WORM",
        "target": "HOLE",
        "hint": "WORM + HOLE = Wormhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "CARD",
        "hint": "HOLE + CARD = Hole card",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      },
      {
        "stem": "CARD",
        "target": "SHARK",
        "hint": "CARD + SHARK = Card shark",
        "decoys": [
          "LARK",
          "SPARK",
          "BARK",
          "DARK"
        ]
      },
      {
        "stem": "SHARK",
        "target": "TANK",
        "hint": "SHARK + TANK = Shark tank",
        "decoys": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ]
      },
      {
        "stem": "TANK",
        "target": "TOP",
        "hint": "TANK + TOP = Tank top",
        "decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ]
      },
      {
        "stem": "TOP",
        "target": "DOG",
        "hint": "TOP + DOG = Top dog",
        "decoys": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ]
      }
    ],
    "zone3Compounds": [
      {
        "stem": "DOG",
        "target": "HOUSE",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ]
      },
      {
        "stem": "HOUSE",
        "target": "FLY",
        "hint": "HOUSE + FLY = Housefly",
        "decoys": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ]
      },
      {
        "stem": "FLY",
        "target": "TRAP",
        "hint": "FLY + TRAP = Flytrap",
        "decoys": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ]
      },
      {
        "stem": "TRAP",
        "target": "DOOR",
        "hint": "TRAP + DOOR = Trapdoor",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "DOOR",
        "target": "STEP",
        "hint": "DOOR + STEP = Doorstep",
        "decoys": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ]
      },
      {
        "stem": "STEP",
        "target": "DOWN",
        "hint": "STEP + DOWN = Stepdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "POUR",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ]
      },
      {
        "stem": "POUR",
        "target": "OVER",
        "hint": "POUR + OVER = Pour-over",
        "decoys": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ]
      },
      {
        "stem": "OVER",
        "target": "RUN",
        "hint": "OVER + RUN = Overrun",
        "decoys": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ]
      },
      {
        "stem": "RUN",
        "target": "OUT",
        "hint": "RUN + OUT = Runout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "BREAK",
        "hint": "OUT + BREAK = Outbreak",
        "decoys": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ]
      },
      {
        "stem": "BREAK",
        "target": "UP",
        "hint": "BREAK + UP = Breakup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "HAIR",
        "displayStem": "HAIR",
        "stemBadge": "3-NODE LINK",
        "correctWord": "CUT",
        "decoyPool": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "decoyWord": "HUT",
        "leftRightSeed": 0,
        "compoundHint": "HAIR + CUT = Haircut"
      },
      {
        "index": 1,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "CUT",
        "displayStem": "CUT",
        "stemBadge": "3-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 1,
        "compoundHint": "CUT + BACK = Cutback (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DROP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "leftRightSeed": 0,
        "compoundHint": "BACK + DROP = Backdrop"
      },
      {
        "index": 3,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DROP",
        "displayStem": "⬅ DROP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "RAIN",
        "decoyPool": [
          "DOWN"
        ],
        "decoyWord": "DOWN",
        "trapCompoundHint": "DROP + DOWN = Dropdown",
        "leftRightSeed": 1,
        "compoundHint": "⬅ RAIN + DROP = Raindrop (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of DROP: RAIN + DROP = Raindrop. You have to resist the forward trap DOWN (DROP + DOWN = Dropdown)!"
      },
      {
        "index": 4,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "RAIN",
        "displayStem": "RAIN",
        "stemBadge": "3-NODE LINK",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TOTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "leftRightSeed": 0,
        "compoundHint": "RAIN + WATER = Rainwater"
      },
      {
        "index": 5,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "WATER + FALL = Waterfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 6,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "FALL + OUT = Fallout"
      },
      {
        "index": 7,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "⬅ OUT",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TIME",
        "decoyPool": [
          "POST"
        ],
        "decoyWord": "POST",
        "trapCompoundHint": "OUT + POST = Outpost",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TIME + OUT = Timeout (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OUT: TIME + OUT = Timeout. You have to resist the forward trap POST (OUT + POST = Outpost)!"
      },
      {
        "index": 8,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 2,
        "linkGroupSize": 3,
        "linkGroupStep": 1,
        "showGhostThirdNode": true,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "3-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TIME + OVER = Time over"
      },
      {
        "index": 9,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 3,
        "linkGroupSize": 3,
        "linkGroupStep": 2,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "3-NODE LINK",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "leftRightSeed": 1,
        "compoundHint": "OVER + LOOK = Overlook (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 10,
        "zoneId": 1,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 1,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "stemBadge": "2-NODE LINK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "leftRightSeed": 0,
        "compoundHint": "LOOK + UP = Lookup"
      },
      {
        "index": 11,
        "zoneId": 1,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "⬅ UP",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "LINE",
        "decoyPool": [
          "TURN"
        ],
        "decoyWord": "TURN",
        "trapCompoundHint": "UP + TURN = Upturn",
        "leftRightSeed": 1,
        "compoundHint": "⬅ LINE + UP = Lineup (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of UP: LINE + UP = Lineup. You have to resist the forward trap TURN (UP + TURN = Upturn)!"
      },
      {
        "index": 12,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 0,
        "compoundHint": "LINE + DOWN = Linedown"
      },
      {
        "index": 13,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "leftRightSeed": 1,
        "compoundHint": "DOWN + FALL = Downfall (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 14,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "leftRightSeed": 0,
        "compoundHint": "FALL + BACK = Fallback"
      },
      {
        "index": 15,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BACK",
        "displayStem": "⬅ BACK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "HOLD",
        "decoyPool": [
          "DROP"
        ],
        "decoyWord": "DROP",
        "trapCompoundHint": "BACK + DROP = Backdrop",
        "leftRightSeed": 1,
        "compoundHint": "⬅ HOLD + BACK = Holdback (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of BACK: HOLD + BACK = Holdback. You have to resist the forward trap DROP (BACK + DROP = Backdrop)!"
      },
      {
        "index": 16,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "leftRightSeed": 0,
        "compoundHint": "HOLD + OUT = Holdout"
      },
      {
        "index": 17,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "2-NODE LINK",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "leftRightSeed": 1,
        "compoundHint": "OUT + RUN = Outrun (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 18,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "leftRightSeed": 0,
        "compoundHint": "RUN + OFF = Runoff"
      },
      {
        "index": 19,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OFF",
        "displayStem": "⬅ OFF",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "TURN",
        "decoyPool": [
          "SET"
        ],
        "decoyWord": "SET",
        "trapCompoundHint": "OFF + SET = Offset",
        "leftRightSeed": 1,
        "compoundHint": "⬅ TURN + OFF = Turnoff (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OFF: TURN + OFF = Turnoff. You have to resist the forward trap SET (OFF + SET = Offset)!"
      },
      {
        "index": 20,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 0,
        "compoundHint": "TURN + OVER = Turnover"
      },
      {
        "index": 21,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "leftRightSeed": 1,
        "compoundHint": "OVER + TIME = Overtime (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 22,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "leftRightSeed": 0,
        "compoundHint": "TIME + LINE = Timeline"
      },
      {
        "index": 23,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LINE",
        "displayStem": "⬅ LINE",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "PIPE",
        "decoyPool": [
          "UP"
        ],
        "decoyWord": "UP",
        "trapCompoundHint": "LINE + UP = Lineup",
        "leftRightSeed": 1,
        "compoundHint": "⬅ PIPE + LINE = Pipeline (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of LINE: PIPE + LINE = Pipeline. You have to resist the forward trap UP (LINE + UP = Lineup)!"
      },
      {
        "index": 24,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "PIPE",
        "displayStem": "PIPE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DREAM",
        "decoyPool": [
          "CREAM",
          "STEAM",
          "GLEAM",
          "SEAM"
        ],
        "decoyWord": "CREAM",
        "leftRightSeed": 0,
        "compoundHint": "PIPE + DREAM = Pipe dream"
      },
      {
        "index": 25,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DREAM",
        "displayStem": "DREAM",
        "stemBadge": "2-NODE LINK",
        "correctWord": "LAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "leftRightSeed": 1,
        "compoundHint": "DREAM + LAND = Dreamland (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 26,
        "zoneId": 2,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "LAND",
        "displayStem": "LAND",
        "stemBadge": "2-NODE LINK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "leftRightSeed": 0,
        "compoundHint": "LAND + MARK = Landmark"
      },
      {
        "index": 27,
        "zoneId": 2,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "MARK",
        "displayStem": "⬅ MARK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "POST",
        "decoyPool": [
          "DOWN"
        ],
        "decoyWord": "DOWN",
        "trapCompoundHint": "MARK + DOWN = Markdown",
        "leftRightSeed": 1,
        "compoundHint": "⬅ POST + MARK = Postmark (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of MARK: POST + MARK = Postmark. You have to resist the forward trap DOWN (MARK + DOWN = Markdown)!"
      },
      {
        "index": 28,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "POST",
        "displayStem": "POST",
        "stemBadge": "2-NODE LINK",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "leftRightSeed": 0,
        "compoundHint": "POST + CARD = Postcard"
      },
      {
        "index": 29,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "leftRightSeed": 1,
        "compoundHint": "CARD + BOARD = Cardboard (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 30,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "leftRightSeed": 0,
        "compoundHint": "BOARD + WALK = Boardwalk"
      },
      {
        "index": 31,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "WALK",
        "displayStem": "⬅ WALK",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "WAY"
        ],
        "decoyWord": "WAY",
        "trapCompoundHint": "WALK + WAY = Walkway",
        "leftRightSeed": 1,
        "compoundHint": "⬅ SIDE + WALK = Sidewalk (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of WALK: SIDE + WALK = Sidewalk. You have to resist the forward trap WAY (WALK + WAY = Walkway)!"
      },
      {
        "index": 32,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "2-NODE LINK",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "leftRightSeed": 0,
        "compoundHint": "SIDE + SHOW = Sideshow"
      },
      {
        "index": 33,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "2-NODE LINK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "leftRightSeed": 1,
        "compoundHint": "SHOW + DOWN = Showdown (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 34,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "2-NODE LINK",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "leftRightSeed": 0,
        "compoundHint": "DOWN + TURN = Downturn"
      },
      {
        "index": 35,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "TURN",
        "displayStem": "⬅ TURN",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "UP",
        "decoyPool": [
          "OFF"
        ],
        "decoyWord": "OFF",
        "trapCompoundHint": "TURN + OFF = Turnoff",
        "leftRightSeed": 1,
        "compoundHint": "⬅ UP + TURN = Upturn (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of TURN: UP + TURN = Upturn. You have to resist the forward trap OFF (TURN + OFF = Turnoff)!"
      },
      {
        "index": 36,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "UP",
        "displayStem": "UP",
        "stemBadge": "2-NODE LINK",
        "correctWord": "HOLD",
        "decoyPool": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ],
        "decoyWord": "MOLD",
        "leftRightSeed": 0,
        "compoundHint": "UP + HOLD = Uphold"
      },
      {
        "index": 37,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "stemBadge": "2-NODE LINK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "leftRightSeed": 1,
        "compoundHint": "HOLD + OVER = Holdover (🌸 3-Part Compound Complete!)"
      },
      {
        "index": 38,
        "zoneId": 3,
        "isReverseGraft": true,
        "gameMode": "REVERSE_GRAFT",
        "direction": "REVERSE",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "OVER",
        "displayStem": "⬅ OVER",
        "stemBadge": "⬅ REVERSE-GRAFT LOOP",
        "correctWord": "CROSS",
        "decoyPool": [
          "SEA"
        ],
        "decoyWord": "SEA",
        "trapCompoundHint": "OVER + SEA = Oversea",
        "leftRightSeed": 0,
        "compoundHint": "⬅ CROSS + OVER = Crossover (Reverse-Graft Loop!)",
        "explanation": "In a Reverse-Graft Loop (⬅), the word goes IN FRONT of OVER: CROSS + OVER = Crossover. You have to resist the forward trap SEA (OVER + SEA = Oversea)!"
      },
      {
        "index": 39,
        "zoneId": 3,
        "isReverseGraft": false,
        "gameMode": "FORWARD",
        "direction": "FORWARD",
        "tripletStep": 0,
        "linkGroupSize": 2,
        "linkGroupStep": 1,
        "showGhostThirdNode": false,
        "stemWord": "CROSS",
        "displayStem": "CROSS",
        "stemBadge": "2-NODE LINK",
        "correctWord": "WORD",
        "decoyPool": [
          "SWORD",
          "CHORD",
          "HERD",
          "BIRD"
        ],
        "decoyWord": "SWORD",
        "leftRightSeed": 1,
        "compoundHint": "CROSS + WORD = Crossword"
      }
    ]
  }
];

  const KNOWN_FORWARD_COMPOUNDS = new Set(["APPLECART","APPLECARTS","APPLEJACK","APPLEJACKS","APPLESAUCE","APPLESAUCES","BACKACHE","BACKACHES","BACKBEAT","BACKBEATS","BACKBENCH","BACKBENCHER","BACKBENCHERS","BACKBENCHES","BACKBEND","BACKBENDS","BACKBIT","BACKBITE","BACKBITER","BACKBITERS","BACKBITES","BACKBITING","BACKBITTEN","BACKBLOCK","BACKBLOCKS","BACKBOARD","BACKBOARDS","BACKBONE","BACKBONES","BACKBREAKER","BACKBREAKERS","BACKBREAKING","BACKCAST","BACKCASTS","BACKCHAT","BACKCHATS","BACKCLOTH","BACKCLOTHS","BACKCOUNTRIES","BACKCOUNTRY","BACKCOURT","BACKCOURTS","BACKCROSS","BACKCROSSED","BACKCROSSES","BACKCROSSING","BACKDATE","BACKDATED","BACKDATES","BACKDATING","BACKDOOR","BACKDROP","BACKDROPPED","BACKDROPPING","BACKDROPS","BACKDROPT","BACKERS","BACKFIELD","BACKFIELDS","BACKFILL","BACKFILLED","BACKFILLING","BACKFILLS","BACKFIRE","BACKFIRED","BACKFIRES","BACKFIRING","BACKFIT","BACKFITS","BACKFITTED","BACKFITTING","BACKFLOW","BACKFLOWS","BACKGAMMON","BACKGAMMONS","BACKGROUND","BACKGROUNDED","BACKGROUNDER","BACKGROUNDERS","BACKGROUNDING","BACKGROUNDS","BACKHAND","BACKHANDED","BACKHANDING","BACKHANDS","BACKHAUL","BACKHAULED","BACKHAULING","BACKHAULS","BACKHOE","BACKHOES","BACKHOUSE","BACKHOUSES","BACKLAND","BACKLANDS","BACKLASH","BACKLASHED","BACKLASHER","BACKLASHERS","BACKLASHES","BACKLASHING","BACKLESS","BACKLIGHT","BACKLIGHTED","BACKLIGHTING","BACKLIGHTS","BACKLIST","BACKLISTED","BACKLISTING","BACKLISTS","BACKLIT","BACKLOG","BACKLOGGED","BACKLOGGING","BACKLOGS","BACKMOST","BACKOUT","BACKOUTS","BACKPACK","BACKPACKED","BACKPACKER","BACKPACKERS","BACKPACKING","BACKPACKS","BACKPEDAL","BACKPEDALED","BACKPEDALING","BACKPEDALLED","BACKPEDALLING","BACKPEDALS","BACKREST","BACKRESTS","BACKROOM","BACKROOMS","BACKRUSH","BACKRUSHES","BACKSAW","BACKSAWS","BACKSCATTER","BACKSCATTERED","BACKSCATTERING","BACKSCATTERINGS","BACKSCATTERS","BACKSEAT","BACKSEATS","BACKSET","BACKSETS","BACKSIDE","BACKSIDES","BACKSLAP","BACKSLAPPED","BACKSLAPPER","BACKSLAPPERS","BACKSLAPPING","BACKSLAPS","BACKSLASH","BACKSLASHES","BACKSLID","BACKSLIDDEN","BACKSLIDE","BACKSLIDER","BACKSLIDERS","BACKSLIDES","BACKSLIDING","BACKSPACE","BACKSPACED","BACKSPACES","BACKSPACING","BACKSPIN","BACKSPINS","BACKSPLASH","BACKSPLASHES","BACKSTAB","BACKSTABBED","BACKSTABBER","BACKSTABBERS","BACKSTABBING","BACKSTABBINGS","BACKSTABS","BACKSTAGE","BACKSTAIRS","BACKSTAY","BACKSTAYS","BACKSTITCH","BACKSTITCHED","BACKSTITCHES","BACKSTITCHING","BACKSTOP","BACKSTOPPED","BACKSTOPPING","BACKSTOPS","BACKSTREET","BACKSTREETS","BACKSTRETCH","BACKSTRETCHES","BACKSTROKE","BACKSTROKES","BACKSWEPT","BACKSWING","BACKSWINGS","BACKSWORD","BACKSWORDS","BACKTRACK","BACKTRACKED","BACKTRACKING","BACKTRACKS","BACKUPS","BACKWARD","BACKWARDS","BACKWASH","BACKWASHED","BACKWASHES","BACKWASHING","BACKWATER","BACKWATERS","BACKWOOD","BACKWOODS","BACKWOODSMAN","BACKWOODSMEN","BACKWOODSY","BACKWRAP","BACKWRAPS","BACKYARD","BACKYARDS","BELLBIRD","BELLBIRDS","BELLBOY","BELLBOYS","BELLFLOWER","BELLFLOWERS","BELLHOP","BELLHOPS","BELLMAN","BELLMEN","BELLOWED","BELLOWING","BELLPULL","BELLPULLS","BELLWETHER","BELLWETHERS","BELLWORT","BELLWORTS","BENCHERS","BENCHLAND","BENCHLANDS","BENCHMARK","BENCHMARKS","BENCHWARMER","BENCHWARMERS","BLADELIKE","BOARDERS","BOARDLIKE","BOARDMAN","BOARDMEN","BOARDROOM","BOARDROOMS","BOARDSAILING","BOARDSAILINGS","BOARDSAILOR","BOARDSAILORS","BOARDWALK","BOARDWALKS","BONEFISH","BONEFISHES","BONEFISHING","BONEFISHINGS","BONEHEAD","BONEHEADED","BONEHEADS","BONELESS","BONEMEAL","BONEMEALS","BONESET","BONESETS","BONESETTER","BONESETTERS","BONEYARD","BONEYARDS","BOOKABLE","BOOKBINDER","BOOKBINDERIES","BOOKBINDERS","BOOKBINDERY","BOOKBINDING","BOOKBINDINGS","BOOKCASE","BOOKCASES","BOOKEND","BOOKENDS","BOOKERS","BOOKKEEPER","BOOKKEEPERS","BOOKKEEPING","BOOKKEEPINGS","BOOKLET","BOOKLETS","BOOKLICE","BOOKLORE","BOOKLORES","BOOKLOUSE","BOOKMAKER","BOOKMAKERS","BOOKMAKING","BOOKMAKINGS","BOOKMAN","BOOKMARK","BOOKMARKER","BOOKMARKERS","BOOKMARKS","BOOKMEN","BOOKMOBILE","BOOKMOBILES","BOOKPLATE","BOOKPLATES","BOOKRACK","BOOKRACKS","BOOKREST","BOOKRESTS","BOOKSELLER","BOOKSELLERS","BOOKSELLING","BOOKSHELF","BOOKSHELVES","BOOKSHOP","BOOKSHOPS","BOOKSTALL","BOOKSTALLS","BOOKSTORE","BOOKSTORES","BOOKWORM","BOOKWORMS","BOWLEGGED","BOWLERS","BOWLESS","BOWLLIKE","BOXBERRIES","BOXBERRY","BOXBOARD","BOXBOARDS","BOXCAR","BOXCARS","BOXERS","BOXFISH","BOXFISHES","BOXHAUL","BOXHAULED","BOXHAULING","BOXHAULS","BOXLIKE","BOXTHORN","BOXTHORNS","BOXWOOD","BOXWOODS","BREADBASKET","BREADBASKETS","BREADBOARD","BREADBOARDED","BREADBOARDING","BREADBOARDS","BREADBOX","BREADBOXES","BREADFRUIT","BREADFRUITS","BREADLINE","BREADLINES","BREADNUT","BREADNUTS","BREADSTUFF","BREADSTUFFS","BREADWINNER","BREADWINNERS","BREADWINNING","BREADWINNINGS","BREAKABLE","BREAKABLES","BREAKAGE","BREAKAGES","BREAKAWAY","BREAKDOWN","BREAKDOWNS","BREAKERS","BREAKEVEN","BREAKEVENS","BREAKFAST","BREAKFASTED","BREAKFASTER","BREAKFASTING","BREAKFASTS","BREAKFRONT","BREAKFRONTS","BREAKNECK","BREAKOUT","BREAKOUTS","BREAKTHROUGH","BREAKUPS","BREAKWATER","BREAKWATERS","BUTTERBALL","BUTTERBALLS","BUTTERCUP","BUTTERCUPS","BUTTERFAT","BUTTERFATS","BUTTERFINGERED","BUTTERFINGERS","BUTTERFISH","BUTTERFISHES","BUTTERFLIED","BUTTERFLIES","BUTTERFLY","BUTTERFLYER","BUTTERFLYERS","BUTTERFLYING","BUTTERLESS","BUTTERMILK","BUTTERMILKS","BUTTERNUT","BUTTERNUTS","BUTTERSCOTCH","BUTTERSCOTCHES","BUTTERWEED","BUTTERWEEDS","BUTTERWORT","BUTTERWORTS","CARAPACE","CARATE","CARATES","CARAWAY","CARBARN","CARBARNS","CARBIDE","CARBIDES","CARBINE","CARBINES","CARBORA","CARBORAS","CARBOS","CARBOY","CARBOYS","CARBURET","CARBURETS","CARCASE","CARCASES","CARCEL","CARCELS","CARDING","CARDINGS","CARERS","CARESS","CARESSES","CARFARE","CARFARES","CARGOES","CARHOP","CARHOPS","CARICES","CARJACKER","CARJACKERS","CARJACKING","CARKING","CARLESS","CARLIN","CARLINE","CARLINES","CARLING","CARLINGS","CARLINS","CARLOAD","CARLOADS","CARMAKER","CARMAKERS","CARMAN","CARMEN","CARMINE","CARMINES","CARNATION","CARNATIONS","CARNET","CARNETS","CARNIVAL","CAROMS","CAROUSEL","CAROUSELS","CARPAL","CARPALE","CARPALS","CARPED","CARPER","CARPET","CARPETS","CARPING","CARPINGS","CARPOGONIA","CARPOOL","CARPOOLED","CARPOOLING","CARPOOLS","CARPORT","CARPORTS","CARPUS","CARRACK","CARRACKS","CARROM","CARROMS","CARROT","CARROTS","CARSICK","CARSICKNESS","CARSICKNESSES","CARTABLE","CARTED","CARTEL","CARTELS","CARTING","CARTON","CARTONED","CARTONING","CARTONS","CARTOON","CARTOONS","CARTOP","CARTOPPER","CARTOPPERS","CARTOUCH","CARTOUCHE","CARTOUCHES","CARUNCLE","CARUNCLES","CARWASH","CARWASHES","CASTABILITIES","CASTABILITY","CASTABLE","CASTAWAY","CASTERS","CASTLED","CASTLING","CASTOFF","CASTOFFS","CASTORS","CASTRATE","CASTRATED","CASTRATES","CASTRATING","CASTRATION","CASTRATIONS","CASTRATO","CASTRATOS","CHAIRLIFT","CHAIRLIFTS","CHAIRMAN","CHAIRMANED","CHAIRMANNED","CHAIRMANNING","CHAIRMANS","CHAIRMEN","CHAIRPERSON","CHAIRPERSONS","CHAIRWOMAN","CHAIRWOMEN","COFFEECAKE","COFFEECAKES","COFFEEHOUSE","COFFEEHOUSES","COFFEEMAKER","COFFEEMAKERS","COFFEEPOT","COFFEEPOTS","COLDBLOOD","COLDCOCK","COLDCOCKED","COLDCOCKING","COLDCOCKS","COLDHEARTED","COLDNESS","COLDNESSES","CONEFLOWER","CONEFLOWERS","CONENOSE","CONENOSES","CONEPATE","CONEPATES","CREAMCUPS","CREAMERS","CREAMPUFF","CREAMPUFFS","CREAMWARE","CREAMWARES","CUPBEARER","CUPBEARERS","CUPBOARD","CUPBOARDS","CUPCAKE","CUPCAKES","CUPELS","CUPIDS","CUPLIKE","CUPPAS","CUPPED","CUPPER","CUPPIER","CUPPING","CUPPINGS","CUPRITE","CUPRITES","CUPRUM","CUPRUMS","DECKELS","DECKERS","DECKHAND","DECKHANDS","DECKHOUSE","DECKHOUSES","DOCKAGE","DOCKAGES","DOCKERS","DOCKHAND","DOCKHANDS","DOCKLAND","DOCKLANDS","DOCKMASTER","DOCKMASTERS","DOCKSIDE","DOCKSIDES","DOCKWORKER","DOCKWORKERS","DOCKYARD","DOCKYARDS","DOGBANE","DOGBANES","DOGBERRIES","DOGBERRY","DOGCART","DOGCARTS","DOGCATCHER","DOGCATCHERS","DOGDOM","DOGDOMS","DOGEAR","DOGEARED","DOGEARING","DOGEARS","DOGFACE","DOGFACES","DOGFIGHT","DOGFIGHTING","DOGFIGHTS","DOGFISH","DOGFISHES","DOGFOUGHT","DOGGED","DOGGIE","DOGGIES","DOGGONE","DOGGONER","DOGHOUSE","DOGHOUSES","DOGLEG","DOGLEGGED","DOGLEGGING","DOGLEGS","DOGLIKE","DOGMAS","DOGNAP","DOGNAPPED","DOGNAPPER","DOGNAPPERS","DOGNAPPING","DOGNAPS","DOGSLED","DOGSLEDDED","DOGSLEDDER","DOGSLEDDERS","DOGSLEDDING","DOGSLEDS","DOGTEETH","DOGTOOTH","DOGTROT","DOGTROTS","DOGTROTTED","DOGTROTTING","DOGVANE","DOGVANES","DOGWATCH","DOGWATCHES","DOGWOOD","DOGWOODS","DOORBELL","DOORBELLS","DOORJAMB","DOORJAMBS","DOORKEEPER","DOORKEEPERS","DOORKNOB","DOORKNOBS","DOORLESS","DOORMAN","DOORMAT","DOORMATS","DOORMEN","DOORNAIL","DOORNAILS","DOORPLATE","DOORPLATES","DOORPOST","DOORPOSTS","DOORSILL","DOORSILLS","DOORSTEP","DOORSTEPS","DOORSTOP","DOORSTOPS","DOORWAY","DOORWAYS","DOORYARD","DOORYARDS","DOWNBEAT","DOWNBEATS","DOWNBURST","DOWNBURSTS","DOWNCAST","DOWNCASTS","DOWNCOME","DOWNCOMES","DOWNCOURT","DOWNDRAFT","DOWNDRAFTS","DOWNERS","DOWNFALL","DOWNFALLEN","DOWNFALLS","DOWNFIELD","DOWNGRADE","DOWNGRADED","DOWNGRADES","DOWNGRADING","DOWNHAUL","DOWNHAULS","DOWNHEARTED","DOWNHILL","DOWNHILLER","DOWNHILLERS","DOWNHILLS","DOWNLAND","DOWNLANDS","DOWNLINK","DOWNLINKS","DOWNLOAD","DOWNLOADED","DOWNLOADING","DOWNLOADS","DOWNPIPE","DOWNPIPES","DOWNPLAY","DOWNPLAYED","DOWNPLAYING","DOWNPLAYS","DOWNPOUR","DOWNPOURS","DOWNRANGE","DOWNRIGHT","DOWNRIGHTLY","DOWNRIGHTNESS","DOWNRIGHTNESSES","DOWNRIVER","DOWNSCALE","DOWNSCALED","DOWNSCALES","DOWNSCALING","DOWNSHIFT","DOWNSHIFTED","DOWNSHIFTING","DOWNSHIFTS","DOWNSIDE","DOWNSIDES","DOWNSIZE","DOWNSIZED","DOWNSIZES","DOWNSIZING","DOWNSLIDE","DOWNSLIDES","DOWNSLOPE","DOWNSPOUT","DOWNSPOUTS","DOWNSTAGE","DOWNSTAGES","DOWNSTAIRS","DOWNSTATE","DOWNSTATER","DOWNSTATERS","DOWNSTATES","DOWNSTREAM","DOWNSTROKE","DOWNSTROKES","DOWNSWING","DOWNSWINGS","DOWNTICK","DOWNTICKS","DOWNTIME","DOWNTIMES","DOWNTOWN","DOWNTOWNS","DOWNTREND","DOWNTRENDS","DOWNTROD","DOWNTRODDEN","DOWNTURN","DOWNTURNS","DOWNWARD","DOWNWARDS","DOWNWASH","DOWNWASHES","DOWNWIND","DRYABLE","DRYADS","DRYERS","DRYLAND","DRYLOT","DRYLOTS","DRYNESS","DRYNESSES","DRYPOINT","DRYPOINTS","DRYSALTER","DRYSALTERS","DRYSTONE","DRYWALL","DRYWALLS","FALLALS","FALLAWAY","FALLBACK","FALLBACKS","FALLERS","FALLFISH","FALLFISHES","FALLOFF","FALLOFFS","FALLOUT","FALLOUTS","FALLOWED","FALLOWING","FIREABLE","FIREARM","FIREARMS","FIREBACK","FIREBACKS","FIREBALL","FIREBALLER","FIREBALLERS","FIREBALLING","FIREBALLS","FIREBASE","FIREBASES","FIREBIRD","FIREBIRDS","FIREBOAT","FIREBOATS","FIREBOMB","FIREBOMBED","FIREBOMBING","FIREBOMBS","FIREBOX","FIREBOXES","FIREBRAND","FIREBRANDS","FIREBRAT","FIREBRATS","FIREBREAK","FIREBREAKS","FIREBRICK","FIREBRICKS","FIREBUG","FIREBUGS","FIRECLAY","FIRECLAYS","FIRECRACKER","FIRECRACKERS","FIREDAMP","FIREDAMPS","FIREDOG","FIREDOGS","FIREDRAKE","FIREDRAKES","FIREFANG","FIREFANGED","FIREFANGS","FIREFIGHT","FIREFIGHTER","FIREFIGHTERS","FIREFIGHTS","FIREFLIES","FIREFLY","FIREGUARD","FIREGUARDS","FIREHALL","FIREHALLS","FIREHOUSE","FIREHOUSES","FIRELESS","FIRELIGHT","FIRELIGHTS","FIRELIT","FIRELOCK","FIRELOCKS","FIREMAN","FIREMANIC","FIREMEN","FIREPAN","FIREPANS","FIREPINK","FIREPINKS","FIREPLACE","FIREPLACED","FIREPLACES","FIREPLUG","FIREPLUGS","FIREPOT","FIREPOTS","FIREPOWER","FIREPOWERS","FIREPROOF","FIREPROOFED","FIREPROOFING","FIREPROOFS","FIREROOM","FIREROOMS","FIRESIDE","FIRESIDES","FIRESTONE","FIRESTONES","FIRESTORM","FIRESTORMS","FIRETHORN","FIRETHORNS","FIRETRAP","FIRETRAPS","FIREWATER","FIREWATERS","FIREWEED","FIREWEEDS","FIREWOOD","FIREWOODS","FIREWORK","FIREWORKS","FIREWORM","FIREWORMS","FISHABILITIES","FISHABILITY","FISHABLE","FISHBOLT","FISHBOLTS","FISHBONE","FISHBONES","FISHBOWL","FISHBOWLS","FISHERS","FISHEYE","FISHEYES","FISHGIG","FISHGIGS","FISHHOOK","FISHHOOKS","FISHLESS","FISHLIKE","FISHLINE","FISHLINES","FISHMEAL","FISHMEALS","FISHMONGER","FISHMONGERS","FISHNET","FISHNETS","FISHPLATE","FISHPLATES","FISHPOLE","FISHPOLES","FISHPOND","FISHPONDS","FISHTAIL","FISHTAILED","FISHTAILING","FISHTAILS","FISHWAY","FISHWAYS","FISHWIFE","FISHWIVES","FISHWORM","FISHWORMS","FLYABLE","FLYAWAY","FLYBELT","FLYBELTS","FLYBLEW","FLYBLOW","FLYBLOWING","FLYBLOWN","FLYBLOWS","FLYBOAT","FLYBOATS","FLYBOY","FLYBOYS","FLYBRIDGE","FLYBRIDGES","FLYBYS","FLYCATCHER","FLYCATCHERS","FLYERS","FLYLEAF","FLYLEAVES","FLYLESS","FLYMAN","FLYMEN","FLYOFF","FLYOFFS","FLYOVER","FLYOVERS","FLYPAPER","FLYPAPERS","FLYPAST","FLYPASTS","FLYSPECK","FLYSPECKED","FLYSPECKING","FLYSPECKS","FLYSWATTER","FLYSWATTERS","FLYTED","FLYTIER","FLYTIERS","FLYTING","FLYTINGS","FLYTRAP","FLYTRAPS","FLYWAY","FLYWAYS","FLYWEIGHT","FLYWEIGHTS","FLYWHEEL","FLYWHEELS","FRONTAGE","FRONTAGES","FRONTALLY","FRONTALS","FRONTCOURT","FRONTCOURTS","FRONTLESS","FRONTLET","FRONTLETS","FRONTLINE","FRONTONS","FRONTRUNNER","FRONTRUNNERS","FRONTWARD","FRONTWARDS","FRUITAGE","FRUITAGES","FRUITCAKE","FRUITCAKES","FRUITERS","FRUITFULLER","FRUITFULLEST","FRUITFULLY","FRUITFULNESS","FRUITFULNESSES","FRUITION","FRUITIONS","FRUITLESS","FRUITLET","FRUITLETS","FRUITWOOD","FRUITWOODS","GAMECOCK","GAMECOCKS","GAMEKEEPER","GAMEKEEPERS","GAMELIKE","GAMENESS","GAMENESSES","GAMESOME","GAMETIC","GINGERBREAD","GINGERBREADED","GINGERBREADS","GINGERBREADY","GINGERROOT","GINGERROOTS","GINGERSNAP","GINGERSNAPS","GOLDBRICK","GOLDBRICKED","GOLDBRICKING","GOLDBRICKS","GOLDBUG","GOLDBUGS","GOLDEYE","GOLDEYES","GOLDFIELD","GOLDFIELDS","GOLDFINCH","GOLDFINCHES","GOLDFISH","GOLDFISHES","GOLDSMITH","GOLDSMITHS","GOLDSTONE","GOLDSTONES","GOLDURN","GOLDURNS","HOLELESS","HOPERS","HOPHEAD","HOPHEADS","HOPLITE","HOPPED","HOPPER","HOPPIER","HOPPING","HOPPINGS","HOPPLED","HOPSACK","HOPSACKING","HOPSACKINGS","HOPSACKS","HOPSCOTCH","HOPSCOTCHED","HOPSCOTCHES","HOPSCOTCHING","HOPTOAD","HOPTOADS","HOUSEBOAT","HOUSEBOATER","HOUSEBOATERS","HOUSEBOATS","HOUSEBOUND","HOUSEBOY","HOUSEBOYS","HOUSEBREAK","HOUSEBREAKER","HOUSEBREAKERS","HOUSEBREAKING","HOUSEBREAKINGS","HOUSEBREAKS","HOUSEBROKE","HOUSEBROKEN","HOUSECARL","HOUSECARLS","HOUSECLEAN","HOUSECLEANED","HOUSECLEANING","HOUSECLEANS","HOUSECOAT","HOUSECOATS","HOUSEDRESS","HOUSEDRESSES","HOUSEFATHER","HOUSEFATHERS","HOUSEFLIES","HOUSEFLY","HOUSEFRONT","HOUSEFRONTS","HOUSEGUEST","HOUSEGUESTS","HOUSEHOLD","HOUSEHOLDER","HOUSEHOLDERS","HOUSEHOLDS","HOUSEHUSBAND","HOUSEHUSBANDS","HOUSEKEEP","HOUSEKEEPER","HOUSEKEEPERS","HOUSEKEEPING","HOUSEKEEPINGS","HOUSEKEEPS","HOUSEKEPT","HOUSELED","HOUSELEEK","HOUSELEEKS","HOUSELESS","HOUSELIGHTS","HOUSELING","HOUSEMAID","HOUSEMAIDS","HOUSEMAN","HOUSEMASTER","HOUSEMASTERS","HOUSEMATE","HOUSEMATES","HOUSEMEN","HOUSEMOTHER","HOUSEMOTHERS","HOUSEPAINTER","HOUSEPAINTERS","HOUSEPARENT","HOUSEPARENTS","HOUSEPERSON","HOUSEPERSONS","HOUSEPLANT","HOUSEPLANTS","HOUSEROOM","HOUSEROOMS","HOUSESAT","HOUSESIT","HOUSESITS","HOUSESITTING","HOUSETOP","HOUSETOPS","HOUSEWARES","HOUSEWARMING","HOUSEWIFE","HOUSEWIFELINESS","HOUSEWIFELINESSES","HOUSEWIFELY","HOUSEWIVES","HOUSEWORK","HOUSEWORKS","ICEBERG","ICEBERGS","ICEBLINK","ICEBLINKS","ICEBOAT","ICEBOATER","ICEBOATERS","ICEBOATING","ICEBOATINGS","ICEBOATS","ICEBOUND","ICEBOX","ICEBOXES","ICEBREAKER","ICEBREAKERS","ICECAP","ICECAPS","ICEFALL","ICEFALLS","ICEHOUSE","ICEHOUSES","ICELESS","ICELIKE","ICEMAN","ICEMEN","INABILITIES","INABILITY","INACCESSIBILITIES","INACCESSIBILITY","INACCESSIBLE","INACCESSIBLY","INACCURACIES","INACCURACY","INACCURATE","INACCURATELY","INACTION","INACTIONS","INACTIVATE","INACTIVATED","INACTIVATES","INACTIVATING","INACTIVATION","INACTIVATIONS","INACTIVE","INACTIVELY","INACTIVITIES","INACTIVITY","INADEQUACIES","INADEQUACY","INADEQUATE","INADEQUATELY","INADEQUATENESS","INADEQUATENESSES","INADMISSIBILITIES","INADMISSIBILITY","INADMISSIBLE","INADVERTENCE","INADVERTENCES","INADVERTENCIES","INADVERTENCY","INADVERTENT","INADVERTENTLY","INADVISABILITIES","INADVISABILITY","INADVISABLE","INALIENABILITIES","INALIENABILITY","INALIENABLE","INALTERABILITIES","INALTERABILITY","INALTERABLE","INALTERABLY","INANE","INANES","INANIMATE","INANIMATELY","INANIMATENESS","INANIMATENESSES","INAPPARENT","INAPPARENTLY","INAPPEASABLE","INAPPETENCE","INAPPETENCES","INAPPLICABILITIES","INAPPLICABILITY","INAPPLICABLE","INAPPOSITE","INAPPOSITELY","INAPPOSITENESS","INAPPOSITENESSES","INAPPRECIABLE","INAPPRECIABLY","INAPPRECIATIVE","INAPPRECIATIVELY","INAPPRECIATIVENESS","INAPPRECIATIVENESSES","INAPPROACHABLE","INAPPROPRIATE","INAPPROPRIATELY","INAPPROPRIATENESS","INAPPROPRIATENESSES","INAPT","INAPTITUDE","INAPTITUDES","INAPTLY","INAPTNESS","INAPTNESSES","INARABLE","INARCH","INARCHED","INARCHES","INARCHING","INARGUABLE","INARGUABLY","INARM","INARMED","INARMING","INARMS","INARTICULACIES","INARTICULACY","INARTICULATE","INARTICULATELY","INARTICULATENESS","INARTICULATENESSES","INARTICULATES","INARTISTIC","INARTISTICALLY","INATTENTION","INATTENTIONS","INATTENTIVE","INATTENTIVELY","INATTENTIVENESS","INATTENTIVENESSES","INAUDIBILITIES","INAUDIBILITY","INAUDIBLE","INAUDIBLY","INAUGURAL","INAUSPICIOUS","INAUSPICIOUSLY","INAUSPICIOUSNESS","INAUSPICIOUSNESSES","INAUTHENTIC","INAUTHENTICITIES","INAUTHENTICITY","INBEING","INBEINGS","INBOARD","INBOARDS","INBORN","INBOUND","INBOUNDED","INBOUNDING","INBOUNDS","INBREATHE","INBREATHED","INBREATHES","INBREATHING","INBRED","INBREED","INBREEDING","INBREEDINGS","INBREEDS","INBUILT","INBURST","INBURSTS","INBYE","INCAGE","INCAGED","INCAGES","INCAGING","INCALCULABLE","INCANDESCENCE","INCANDESCENCES","INCANDESCENT","INCANT","INCANTED","INCANTING","INCANTS","INCAPABILITIES","INCAPABILITY","INCAPABLE","INCAPABLENESS","INCAPABLENESSES","INCAPABLY","INCAPACITATE","INCAPACITATED","INCAPACITATES","INCAPACITATING","INCAPACITATION","INCAPACITATIONS","INCAPACITIES","INCAPACITY","INCARNATION","INCARNATIONS","INCASE","INCASED","INCASES","INCASING","INCAUTION","INCAUTIONS","INCAUTIOUS","INCAUTIOUSLY","INCAUTIOUSNESS","INCAUTIOUSNESSES","INCENSE","INCENSED","INCENSES","INCENSING","INCENTER","INCENTERS","INCERTITUDE","INCERTITUDES","INCITATION","INCITATIONS","INCITE","INCITED","INCITER","INCITERS","INCITES","INCITING","INCIVIL","INCIVILITIES","INCIVILITY","INCLASP","INCLASPED","INCLASPING","INCLASPS","INCLEMENCIES","INCLEMENCY","INCLEMENT","INCLEMENTLY","INCLINE","INCLINES","INCLINOMETER","INCLINOMETERS","INCLIP","INCLIPPED","INCLIPPING","INCLIPS","INCLOSE","INCLOSED","INCLOSER","INCLOSERS","INCLOSES","INCLOSING","INCLOSURE","INCLOSURES","INCOERCIBLE","INCOG","INCOGNIZANCE","INCOGNIZANCES","INCOGNIZANT","INCOGS","INCOHERENCE","INCOHERENCES","INCOHERENT","INCOHERENTLY","INCOMBUSTIBILITIES","INCOMBUSTIBILITY","INCOMBUSTIBLE","INCOMBUSTIBLES","INCOME","INCOMER","INCOMERS","INCOMES","INCOMING","INCOMINGS","INCOMMENSURABILITIES","INCOMMENSURABILITY","INCOMMENSURABLE","INCOMMENSURABLY","INCOMMENSURATE","INCOMMODE","INCOMMODES","INCOMMODIOUS","INCOMMODIOUSLY","INCOMMODIOUSNESS","INCOMMODIOUSNESSES","INCOMMODITIES","INCOMMODITY","INCOMMUNICABILITIES","INCOMMUNICABILITY","INCOMMUNICABLE","INCOMMUNICABLY","INCOMMUNICATIVE","INCOMMUTABLE","INCOMPARABILITIES","INCOMPARABILITY","INCOMPARABLE","INCOMPARABLY","INCOMPATIBILITIES","INCOMPATIBILITY","INCOMPATIBLE","INCOMPATIBLES","INCOMPATIBLY","INCOMPETENCE","INCOMPETENCES","INCOMPETENCIES","INCOMPETENCY","INCOMPETENT","INCOMPETENTLY","INCOMPLETE","INCOMPLETELY","INCOMPLETENESS","INCOMPLETENESSES","INCOMPLIANT","INCOMPREHENSIBILITIES","INCOMPREHENSIBILITY","INCOMPREHENSIBLE","INCOMPREHENSIBLENESS","INCOMPREHENSIBLENESSES","INCOMPREHENSIBLY","INCOMPREHENSION","INCOMPREHENSIONS","INCOMPRESSIBLE","INCOMPUTABLE","INCONCEIVABILITIES","INCONCEIVABILITY","INCONCEIVABLE","INCONCEIVABLENESS","INCONCEIVABLENESSES","INCONCEIVABLY","INCONCINNITIES","INCONCINNITY","INCONCLUSIVE","INCONCLUSIVELY","INCONCLUSIVENESS","INCONCLUSIVENESSES","INCONFORMITIES","INCONFORMITY","INCONGRUENCE","INCONGRUENCES","INCONGRUENT","INCONGRUENTLY","INCONGRUITIES","INCONGRUITY","INCONGRUOUS","INCONGRUOUSLY","INCONGRUOUSNESS","INCONGRUOUSNESSES","INCONSECUTIVE","INCONSEQUENCE","INCONSEQUENCES","INCONSEQUENT","INCONSEQUENTIAL","INCONSEQUENTIALITIES","INCONSEQUENTIALITY","INCONSEQUENTIALLY","INCONSEQUENTLY","INCONSIDERABLE","INCONSIDERABLY","INCONSIDERATE","INCONSIDERATELY","INCONSIDERATENESS","INCONSIDERATENESSES","INCONSIDERATION","INCONSIDERATIONS","INCONSISTENCE","INCONSISTENCES","INCONSISTENCIES","INCONSISTENCY","INCONSISTENT","INCONSISTENTLY","INCONSONANCE","INCONSONANCES","INCONSONANT","INCONSPICUOUS","INCONSPICUOUSLY","INCONSPICUOUSNESS","INCONSPICUOUSNESSES","INCONSTANCIES","INCONSTANCY","INCONSTANT","INCONSTANTLY","INCONSUMABLE","INCONTESTABLE","INCONTINENCE","INCONTINENCES","INCONTINENT","INCONTINENTLY","INCONTROLLABLE","INCONTROVERTIBLE","INCONVENIENCE","INCONVENIENCES","INCONVENIENCIES","INCONVENIENCY","INCONVENIENT","INCONVENIENTLY","INCONVERTIBILITIES","INCONVERTIBILITY","INCONVERTIBLE","INCONVERTIBLY","INCONY","INCOORDINATION","INCOORDINATIONS","INCORPORATE","INCORPORATION","INCORPORATIONS","INCORPORATIVE","INCORPORATOR","INCORPORATORS","INCORPOREAL","INCORPOREALLY","INCORPOREITIES","INCORPOREITY","INCORPSE","INCORPSES","INCORRECT","INCORRECTLY","INCORRECTNESS","INCORRECTNESSES","INCORRIGIBILITIES","INCORRIGIBILITY","INCORRIGIBLE","INCORRUPT","INCORRUPTED","INCORRUPTIBILITIES","INCORRUPTIBILITY","INCORRUPTIBLE","INCORRUPTIBLY","INCORRUPTION","INCORRUPTIONS","INCORRUPTLY","INCORRUPTNESS","INCORRUPTNESSES","INCREASE","INCREASED","INCREASER","INCREASERS","INCREASES","INCREASING","INCREATE","INCREDIBILITIES","INCREDIBILITY","INCREDIBLE","INCREDIBLY","INCREDULITIES","INCREDULITY","INCREDULOUS","INCREDULOUSLY","INCRESCENT","INCRIMINATE","INCRIMINATED","INCRIMINATES","INCRIMINATING","INCRIMINATION","INCRIMINATIONS","INCROSS","INCROSSED","INCROSSES","INCROSSING","INCRUST","INCRUSTED","INCRUSTING","INCRUSTS","INCULPABLE","INCULT","INCUMBER","INCUMBERED","INCUMBERING","INCUMBERS","INCUR","INCURABLE","INCURABLY","INCURIOSITIES","INCURIOSITY","INCURIOUS","INCURIOUSLY","INCURIOUSNESS","INCURIOUSNESSES","INCURRED","INCURRENT","INCURRING","INCURS","INCURVATURE","INCURVATURES","INCURVE","INCURVED","INCURVES","INCURVING","INDECENCIES","INDECENCY","INDECENT","INDECENTER","INDECENTEST","INDECENTLY","INDECIPHERABLE","INDECISION","INDECISIONS","INDECISIVE","INDECISIVELY","INDECISIVENESS","INDECISIVENESSES","INDECLINABLE","INDECOMPOSABLE","INDECOROUS","INDECOROUSLY","INDECOROUSNESS","INDECOROUSNESSES","INDECORUM","INDECORUMS","INDEED","INDEFEASIBILITIES","INDEFEASIBILITY","INDEFEASIBLE","INDEFENSIBILITIES","INDEFENSIBILITY","INDEFENSIBLE","INDEFENSIBLY","INDEFINABLE","INDEFINABLY","INDEFINITE","INDEFINITELY","INDEFINITENESS","INDEFINITENESSES","INDEHISCENCE","INDEHISCENCES","INDEHISCENT","INDELICACIES","INDELICACY","INDELICATE","INDELICATELY","INDEMONSTRABLE","INDEMONSTRABLY","INDENE","INDENES","INDENT","INDENTED","INDENTING","INDENTS","INDENTURE","INDENTURES","INDEPENDENCE","INDEPENDENCES","INDEPENDENCIES","INDEPENDENCY","INDEPENDENT","INDEPENDENTLY","INDEPENDENTS","INDESCRIBABLE","INDESTRUCTIBILITIES","INDESTRUCTIBILITY","INDESTRUCTIBLE","INDETERMINABLE","INDETERMINABLY","INDETERMINACIES","INDETERMINACY","INDETERMINATE","INDETERMINATELY","INDETERMINATENESS","INDETERMINATENESSES","INDETERMINATION","INDETERMINATIONS","INDETERMINISM","INDETERMINISMS","INDETERMINIST","INDETERMINISTIC","INDETERMINISTS","INDEVOUT","INDEX","INDEXES","INDICES","INDICTION","INDICTIONS","INDIE","INDIES","INDIFFERENCE","INDIFFERENCES","INDIFFERENT","INDIFFERENTLY","INDIGESTED","INDIGESTIBILITIES","INDIGESTIBILITY","INDIGESTIBLE","INDIGESTION","INDIGESTIONS","INDIGNITIES","INDIGNITY","INDIRECT","INDIRECTION","INDIRECTIONS","INDIRECTLY","INDIRECTNESS","INDIRECTNESSES","INDISCERNIBLE","INDISCIPLINABLE","INDISCIPLINE","INDISCIPLINED","INDISCIPLINES","INDISCOVERABLE","INDISCREET","INDISCREETLY","INDISCREETNESS","INDISCREETNESSES","INDISCRETION","INDISCRETIONS","INDISCRIMINATE","INDISCRIMINATING","INDISCRIMINATINGLY","INDISCRIMINATION","INDISCRIMINATIONS","INDISPENSABILITIES","INDISPENSABILITY","INDISPENSABLE","INDISPOSE","INDISPOSED","INDISPOSES","INDISPOSING","INDISPOSITION","INDISPOSITIONS","INDISPUTABLE","INDISPUTABLY","INDISSOCIABLE","INDISSOLUBLE","INDISTINCT","INDISTINCTIVE","INDISTINCTLY","INDISTINCTNESS","INDISTINCTNESSES","INDISTINGUISHABILITIES","INDISTINGUISHABILITY","INDISTINGUISHABLE","INDISTINGUISHABLY","INDITE","INDITES","INDIVIDUAL","INDIVISIBILITIES","INDIVISIBILITY","INDIVISIBLE","INDOCILE","INDOCILITIES","INDOCILITY","INDOL","INDOLE","INDOLES","INDOLS","INDOOR","INDOORS","INDORSER","INDORSERS","INDOW","INDOWED","INDOWING","INDOWS","INDRAFT","INDRAFTS","INDRAWN","INDUBITABLE","INDUCE","INDUCES","INDUCT","INDUCTED","INDUCTING","INDUCTS","INDUE","INDUES","INDURATION","INDURATIONS","INDURATIVE","INDWELL","INDWELLER","INDWELLERS","INDWELLING","INDWELLS","INDWELT","INEARTH","INEARTHED","INEARTHING","INEARTHS","INEDIBLE","INEDITED","INEDUCABILITIES","INEDUCABILITY","INEDUCABLE","INEFFABLE","INEFFACEABLE","INEFFECTIVE","INEFFECTIVELY","INEFFECTIVENESS","INEFFECTIVENESSES","INEFFECTUAL","INEFFECTUALITIES","INEFFECTUALITY","INEFFECTUALLY","INEFFECTUALNESS","INEFFECTUALNESSES","INEFFICACIES","INEFFICACIOUS","INEFFICACIOUSLY","INEFFICACIOUSNESS","INEFFICACIOUSNESSES","INEFFICACY","INEFFICIENCIES","INEFFICIENCY","INEFFICIENT","INEFFICIENTLY","INEGALITARIAN","INELASTIC","INELASTICITIES","INELASTICITY","INELEGANCE","INELEGANCES","INELEGANT","INELEGANTLY","INELIGIBILITIES","INELIGIBILITY","INELIGIBLE","INELIGIBLES","INELOQUENT","INELOQUENTLY","INEQUALITIES","INEQUALITY","INEQUITABLE","INEQUITABLY","INEQUITIES","INEQUITY","INERADICABLE","INERRANCIES","INERRANCY","INERRANT","INESSENTIAL","INESSENTIALS","INESTIMABLE","INESTIMABLY","INEVITABLE","INEXACT","INEXACTITUDE","INEXACTITUDES","INEXACTLY","INEXACTNESS","INEXACTNESSES","INEXCUSABLE","INEXCUSABLENESS","INEXCUSABLENESSES","INEXCUSABLY","INEXHAUSTIBILITIES","INEXHAUSTIBILITY","INEXHAUSTIBLE","INEXISTENCE","INEXISTENCES","INEXISTENT","INEXORABLE","INEXPEDIENCE","INEXPEDIENCES","INEXPEDIENCIES","INEXPEDIENCY","INEXPEDIENT","INEXPEDIENTLY","INEXPENSIVE","INEXPENSIVELY","INEXPENSIVENESS","INEXPENSIVENESSES","INEXPERIENCE","INEXPERIENCED","INEXPERIENCES","INEXPERT","INEXPERTLY","INEXPERTNESS","INEXPERTNESSES","INEXPERTS","INEXPIABLE","INEXPLAINABLE","INEXPLICABLE","INEXPLICABLY","INEXPLICIT","INEXPRESSIBLE","INEXPRESSIVE","INEXPRESSIVELY","INEXPRESSIVENESS","INEXPRESSIVENESSES","INEXTINGUISHABLE","INEXTRICABLE","INFALL","INFALLIBILITIES","INFALLIBILITY","INFALLIBLE","INFALLIBLY","INFALLING","INFALLS","INFAMOUS","INFAMOUSLY","INFANCIES","INFANCY","INFARE","INFARES","INFAUNA","INFAUNAE","INFAUNAL","INFAUNAS","INFEASIBILITIES","INFEASIBILITY","INFEASIBLE","INFECUND","INFELICITIES","INFELICITOUS","INFELICITOUSLY","INFELICITY","INFEOFF","INFEOFFED","INFEOFFING","INFEOFFS","INFER","INFERTILE","INFERTILITIES","INFERTILITY","INFESTER","INFESTERS","INFIDELITIES","INFIDELITY","INFIELD","INFIELDER","INFIELDERS","INFIELDS","INFIGHT","INFIGHTER","INFIGHTERS","INFIGHTING","INFIGHTINGS","INFIGHTS","INFILTRATE","INFILTRATED","INFILTRATES","INFILTRATING","INFILTRATION","INFILTRATIONS","INFINITE","INFINITELY","INFINITENESS","INFINITENESSES","INFINITES","INFINITUDE","INFINITUDES","INFIRM","INFIRMED","INFIRMING","INFIRMLY","INFIRMS","INFIX","INFIXATION","INFIXATIONS","INFIXED","INFIXES","INFIXING","INFLAME","INFLAMED","INFLAMER","INFLAMERS","INFLAMES","INFLAMING","INFLAMMABILITIES","INFLAMMABILITY","INFLAMMABLE","INFLAMMABLES","INFLECTION","INFLECTIONS","INFLEXED","INFLEXIBILITIES","INFLEXIBILITY","INFLEXIBLE","INFLEXIBLY","INFLEXION","INFLEXIONS","INFLIGHT","INFLORESCENCE","INFLORESCENCES","INFLOW","INFLOWS","INFLUENT","INFLUX","INFLUXES","INFOLD","INFOLDED","INFOLDER","INFOLDERS","INFOLDING","INFOLDS","INFORM","INFORMAL","INFORMALITIES","INFORMALITY","INFORMALLY","INFORMANT","INFORMANTS","INFORMATION","INFORMATIONS","INFORMATIVE","INFORMATIVELY","INFORMED","INFORMER","INFORMERS","INFORMING","INFORMS","INFOUGHT","INFRACTED","INFRACTION","INFRACTIONS","INFRANGIBILITIES","INFRANGIBILITY","INFRANGIBLE","INFREQUENCE","INFREQUENCES","INFREQUENCIES","INFREQUENCY","INFREQUENT","INFREQUENTLY","INFRINGE","INFRINGED","INFRINGES","INFRINGING","INFRUGAL","INFUSE","INFUSED","INFUSES","INFUSIBILITIES","INFUSIBILITY","INFUSIBLE","INFUSING","INFUSION","INFUSIONS","INGATE","INGATES","INGATHER","INGATHERED","INGATHERING","INGATHERINGS","INGATHERS","INGEST","INGESTS","INGLORIOUS","INGLORIOUSLY","INGLORIOUSNESS","INGLORIOUSNESSES","INGOING","INGOT","INGRAFT","INGRAFTED","INGRAFTING","INGRAFTS","INGRAIN","INGRAINED","INGRAINING","INGRAINS","INGRATE","INGRATES","INGRATITUDE","INGRATITUDES","INGROUP","INGROUPS","INGROWING","INGROWN","INGROWTH","INGROWTHS","INGULF","INGULFED","INGULFING","INGULFS","INHABIT","INHABITABLE","INHABITANT","INHABITANTS","INHABITATION","INHABITATIONS","INHABITED","INHABITING","INHABITS","INHALATION","INHALATIONS","INHALE","INHALED","INHALER","INHALERS","INHALES","INHALING","INHARMONIC","INHARMONIES","INHARMONIOUS","INHARMONIOUSLY","INHARMONIOUSNESS","INHARMONIOUSNESSES","INHARMONY","INHAUL","INHAULER","INHAULERS","INHAULS","INHERE","INHERES","INHERITABILITIES","INHERITABILITY","INHERITABLE","INHERITOR","INHERITORS","INHERITRICES","INHERITRIX","INHERITRIXES","INHOLDING","INHOLDINGS","INHOMOGENEITIES","INHOMOGENEITY","INHOMOGENEOUS","INHOSPITABLE","INHOSPITABLY","INHOSPITALITIES","INHOSPITALITY","INHUMAN","INHUMANE","INHUMANELY","INHUMANITIES","INHUMANITY","INHUMANLY","INHUMANNESS","INHUMANNESSES","INIMITABLE","INION","INJUDICIOUS","INJUDICIOUSLY","INJUDICIOUSNESS","INJUDICIOUSNESSES","INJUNCTION","INJUNCTIONS","INJURIES","INJURY","INJUSTICE","INJUSTICES","INKIER","INKING","INLACE","INLACED","INLACES","INLACING","INLAID","INLAND","INLANDER","INLANDERS","INLANDS","INLAY","INLAYER","INLAYERS","INLAYING","INLAYS","INLET","INLETS","INLETTING","INLIER","INLIERS","INMATE","INMATES","INMESH","INMESHED","INMESHES","INMESHING","INMOST","INNARDS","INNERVATE","INNERVATION","INNERVATIONS","INNERVE","INNERVED","INNERVES","INNERVING","INNOCENT","INNOCUOUS","INNOCUOUSLY","INNOMINATE","INNOVATION","INNOVATIONS","INNUMERABLE","INNUMERACIES","INNUMERACY","INNUMERATE","INNUMERATES","INNUMEROUS","INOBSERVANCE","INOBSERVANCES","INOBSERVANT","INOFFENSIVE","INOFFENSIVELY","INOFFENSIVENESS","INOFFENSIVENESSES","INOPERABLE","INOPERATIVE","INOPERATIVENESS","INOPERATIVENESSES","INOPERCULATE","INOPPORTUNE","INOPPORTUNELY","INOPPORTUNENESS","INOPPORTUNENESSES","INORDINATE","INORGANIC","INORGANICALLY","INOSCULATE","INOSCULATED","INOSCULATES","INOSCULATING","INOSCULATION","INOSCULATIONS","INPATIENT","INPATIENTS","INPHASE","INPOUR","INPOURED","INPOURING","INPOURS","INPUT","INPUTS","INPUTTED","INPUTTING","INQUEST","INQUESTS","INQUIET","INQUIETED","INQUIETING","INQUIETS","INQUIETUDE","INQUIETUDES","INQUIRE","INQUIRED","INQUIRES","INQUIRING","INROAD","INROADS","INRUSH","INRUSHES","INSALUBRIOUS","INSALUBRITIES","INSALUBRITY","INSANE","INSANELY","INSANENESS","INSANENESSES","INSANER","INSANEST","INSANITARY","INSANITATION","INSANITATIONS","INSANITIES","INSANITY","INSATIABLE","INSATIABLY","INSATIATE","INSCAPE","INSCAPES","INSCRIBE","INSCRIBED","INSCRIBER","INSCRIBERS","INSCRIBES","INSCRIBING","INSCROLL","INSCROLLED","INSCROLLING","INSCROLLS","INSCRUTABLE","INSCULP","INSCULPED","INSCULPING","INSCULPS","INSEAM","INSEAMS","INSECT","INSECTARIES","INSECTARY","INSECTILE","INSECTS","INSECURE","INSECURELY","INSECURENESS","INSECURENESSES","INSECURITIES","INSECURITY","INSENSATE","INSENSATELY","INSENSIBILITIES","INSENSIBILITY","INSENSIBLE","INSENSIBLENESS","INSENSIBLENESSES","INSENSIBLY","INSENSITIVE","INSENSITIVELY","INSENSITIVENESS","INSENSITIVENESSES","INSENSITIVITIES","INSENSITIVITY","INSENTIENCE","INSENTIENCES","INSENTIENT","INSEPARABILITIES","INSEPARABILITY","INSEPARABLE","INSEPARABLENESS","INSEPARABLENESSES","INSET","INSETS","INSETTER","INSETTERS","INSETTING","INSHEATH","INSHEATHED","INSHEATHING","INSHEATHS","INSHORE","INSHRINE","INSHRINED","INSHRINES","INSHRINING","INSIDE","INSIDES","INSIGHT","INSIGHTS","INSIGNIFICANCE","INSIGNIFICANCES","INSIGNIFICANCIES","INSIGNIFICANCY","INSIGNIFICANT","INSIGNIFICANTLY","INSINCERE","INSINCERELY","INSINCERITIES","INSINCERITY","INSINUATE","INSINUATED","INSINUATES","INSINUATING","INSISTER","INSISTERS","INSNARE","INSNARED","INSNARER","INSNARERS","INSNARES","INSNARING","INSOBRIETIES","INSOBRIETY","INSOCIABILITIES","INSOCIABILITY","INSOCIABLE","INSOCIABLY","INSOFAR","INSOLATE","INSOLATED","INSOLATES","INSOLATING","INSOLATION","INSOLATIONS","INSOLE","INSOLES","INSOLUBILITIES","INSOLUBILITY","INSOLUBILIZATION","INSOLUBILIZATIONS","INSOLUBILIZE","INSOLUBILIZED","INSOLUBILIZES","INSOLUBILIZING","INSOLUBLE","INSOLUBLES","INSOLUBLY","INSOLVABLE","INSOLVENCIES","INSOLVENCY","INSOLVENT","INSOLVENTS","INSOUL","INSOULED","INSOULS","INSPAN","INSPANNED","INSPANNING","INSPANS","INSPHERE","INSPHERED","INSPHERES","INSPHERING","INSPIRE","INSPIRED","INSPIRES","INSPIRING","INSPIRIT","INSPIRITED","INSPIRITING","INSPIRITS","INSTABILITIES","INSTABILITY","INSTABLE","INSTALL","INSTALLED","INSTALLING","INSTALLS","INSTANCE","INSTANCES","INSTAR","INSTARRED","INSTARRING","INSTARS","INSTATE","INSTATED","INSTATES","INSTATING","INSTEAD","INSTEP","INSTEPS","INSTILL","INSTILLED","INSTILLER","INSTILLING","INSTILLS","INSTROKE","INSTROKES","INSUBORDINATE","INSUBORDINATELY","INSUBORDINATES","INSUBORDINATION","INSUBORDINATIONS","INSUBSTANTIAL","INSUBSTANTIALITIES","INSUBSTANTIALITY","INSUFFERABLE","INSUFFERABLENESS","INSUFFERABLENESSES","INSUFFERABLY","INSUFFICIENCIES","INSUFFICIENCY","INSUFFICIENT","INSUFFICIENTLY","INSUFFLATE","INSUFFLATED","INSUFFLATES","INSUFFLATING","INSUPERABLE","INSUPERABLY","INSUPPORTABLE","INSUPPRESSIBLE","INSURE","INSURER","INSURMOUNTABLE","INSUSCEPTIBILITIES","INSUSCEPTIBILITY","INSUSCEPTIBLE","INSUSCEPTIBLY","INSWATHE","INSWATHED","INSWATHES","INSWATHING","INSWEPT","INTACT","INTAKE","INTAKES","INTANGIBILITIES","INTANGIBILITY","INTANGIBLE","INTANGIBLENESS","INTANGIBLENESSES","INTANGIBLES","INTANGIBLY","INTARSIA","INTARSIAS","INTEGUMENT","INTEGUMENTS","INTEMPERANCE","INTEMPERANCES","INTEMPERATE","INTEMPERATELY","INTEMPERATENESS","INTEMPERATENESSES","INTEND","INTENDANCE","INTENDANCES","INTENDED","INTENDER","INTENDERS","INTENDING","INTENDS","INTENSE","INTENSELY","INTENSENESS","INTENSENESSES","INTENSER","INTENSEST","INTENSION","INTENSIONAL","INTENSIONS","INTENSITIES","INTENSITY","INTENSIVE","INTENT","INTENTS","INTERMINABLE","INTERMINABLENESS","INTERMINABLENESSES","INTERMINABLY","INTERN","INTERNE","INTERNES","INTERNS","INTESTACIES","INTESTACY","INTESTATE","INTESTATES","INTHRALL","INTHRALLED","INTHRALLING","INTHRALLS","INTHRONE","INTHRONED","INTHRONES","INTHRONING","INTIME","INTINE","INTINES","INTIS","INTITLE","INTITLED","INTITLES","INTITLING","INTOLERABILITIES","INTOLERABILITY","INTOLERABLE","INTOLERABLY","INTOLERANCE","INTOLERANCES","INTOLERANT","INTOLERANTLY","INTOMB","INTOMBED","INTOMBING","INTOMBS","INTONE","INTONED","INTONER","INTONERS","INTONES","INTONING","INTORT","INTORTS","INTOWN","INTOXICANT","INTOXICANTS","INTRACTABILITIES","INTRACTABILITY","INTRACTABLE","INTRACTABLY","INTRANSITIVE","INTRANSITIVELY","INTRANSITIVENESS","INTRANSITIVENESSES","INTRANSITIVITIES","INTRANSITIVITY","INTREAT","INTREATED","INTREATING","INTREATS","INTRENCH","INTRENCHED","INTRENCHES","INTRENCHING","INTREPID","INTRUST","INTRUSTED","INTRUSTING","INTRUSTS","INTUBATE","INTUITION","INTUITIONAL","INTUITIONS","INTUMESCENCE","INTUMESCENCES","INTUMESCENT","INTURN","INTURNED","INTURNS","INTWINE","INTWINED","INTWINES","INTWINING","INTWIST","INTWISTED","INTWISTING","INTWISTS","INUNCTION","INUNCTIONS","INUNDATED","INURBANE","INURN","INURNS","INUTILE","INUTILITIES","INUTILITY","INVAGINATE","INVALID","INVALIDATE","INVALIDATED","INVALIDATES","INVALIDATING","INVALIDATION","INVALIDATIONS","INVALIDITIES","INVALIDITY","INVALIDLY","INVALUABLE","INVALUABLENESS","INVALUABLENESSES","INVALUABLY","INVAR","INVARIABILITIES","INVARIABILITY","INVARIABLE","INVARIABLES","INVARIABLY","INVARIANCE","INVARIANCES","INVARIANT","INVARIANTS","INVARS","INVENT","INVENTED","INVENTER","INVENTERS","INVENTING","INVENTS","INVERITIES","INVERITY","INVERSE","INVERSES","INVERSION","INVERSIONS","INVERT","INVERTEBRATE","INVERTEBRATES","INVERTS","INVEST","INVESTED","INVESTING","INVESTMENT","INVESTMENTS","INVESTS","INVIABILITIES","INVIABILITY","INVIABLE","INVIABLY","INVINCIBLE","INVINCIBLY","INVIOLABILITIES","INVIOLABILITY","INVIOLABLE","INVIOLABLENESS","INVIOLABLENESSES","INVIOLABLY","INVIOLATE","INVIRILE","INVISCID","INVISIBILITIES","INVISIBILITY","INVISIBLE","INVISIBLENESS","INVISIBLENESSES","INVISIBLY","INVITAL","INVOCATION","INVOCATIONAL","INVOCATIONS","INVOICE","INVOICED","INVOICES","INVOICING","INVOLUNTARILY","INVOLUNTARINESS","INVOLUNTARINESSES","INVOLUNTARY","INVOLUTE","INVOLUTED","INVOLUTES","INVOLUTION","INVOLUTIONS","INVULNERABILITIES","INVULNERABILITY","INVULNERABLE","INVULNERABLENESS","INVULNERABLENESSES","INVULNERABLY","INWALL","INWALLED","INWALLING","INWALLS","INWARD","INWARDS","INWEAVE","INWEAVED","INWEAVES","INWEAVING","INWIND","INWINDING","INWINDS","INWOUND","INWOVE","INWOVEN","INWRAP","INWRAPPED","INWRAPPING","INWRAPS","KEYBOARD","KEYBOARDED","KEYBOARDER","KEYBOARDERS","KEYBOARDING","KEYBOARDS","KEYBUTTON","KEYBUTTONS","KEYCARD","KEYCARDS","KEYHOLE","KEYHOLES","KEYLESS","KEYNOTE","KEYNOTED","KEYNOTER","KEYNOTERS","KEYNOTES","KEYNOTING","KEYPAD","KEYPADS","KEYPUNCH","KEYPUNCHED","KEYPUNCHER","KEYPUNCHERS","KEYPUNCHES","KEYPUNCHING","KEYSET","KEYSETS","KEYSTONE","KEYSTONES","KEYSTROKE","KEYSTROKED","KEYSTROKES","KEYSTROKING","KEYWAY","KEYWAYS","KEYWORD","KEYWORDS","LADDERLIKE","LIFTABLE","LIFTERS","LIFTGATE","LIFTGATES","LIFTMAN","LIFTMEN","LIFTOFF","LIFTOFFS","LIGHTBULB","LIGHTBULBS","LIGHTENS","LIGHTERS","LIGHTFACE","LIGHTFACED","LIGHTFACES","LIGHTFAST","LIGHTFASTNESS","LIGHTFASTNESSES","LIGHTHEADED","LIGHTHEARTED","LIGHTHOUSE","LIGHTHOUSES","LIGHTLESS","LIGHTNESS","LIGHTNESSES","LIGHTPLANE","LIGHTPLANES","LIGHTPROOF","LIGHTSHIP","LIGHTSHIPS","LIGHTSOME","LIGHTTIGHT","LIGHTWEIGHT","LIGHTWEIGHTS","LIGHTWOOD","LIGHTWOODS","LINEABLE","LINEAGE","LINEAGES","LINEALLY","LINEAMENT","LINEAMENTS","LINEARISE","LINEARISES","LINEARISING","LINEATE","LINEBACKER","LINEBACKERS","LINEBACKING","LINEBACKINGS","LINEBRED","LINEBREEDING","LINEBREEDINGS","LINECASTER","LINECASTERS","LINECASTING","LINECASTINGS","LINECUT","LINECUTS","LINELESS","LINELIKE","LINEMAN","LINEMEN","LINEUPS","LOOKALIKE","LOOKDOWN","LOOKDOWNS","LOOKERS","LOOKOUT","LOOKOUTS","LOOKUPS","MARKDOWN","MARKDOWNS","MARKERS","MARKKAS","MARKUPS","MATCHABLE","MATCHBOARD","MATCHBOARDS","MATCHBOOK","MATCHBOOKS","MATCHBOX","MATCHBOXES","MATCHERS","MATCHLESS","MATCHLOCK","MATCHLOCKS","MATCHMAKER","MATCHMAKERS","MATCHMAKING","MATCHMAKINGS","MATCHSTICK","MATCHSTICKS","MATCHUPS","MATCHWOOD","MATCHWOODS","MATERS","MATHEMATIC","MATHEMATICS","MATINS","MATLESS","MATRES","MATRICES","MATTED","MATTIN","MATTING","MATTINGS","MATTINS","MATTRASS","MATTRASSES","MATTRESS","MATTRESSES","MATURATE","MATURATES","MATZOON","MATZOONS","OFFALS","OFFBEAT","OFFBEATS","OFFCAST","OFFCASTS","OFFCUT","OFFCUTS","OFFEND","OFFENDED","OFFENDER","OFFENDERS","OFFENDING","OFFENDS","OFFERS","OFFHAND","OFFHANDED","OFFHANDEDNESS","OFFHANDEDNESSES","OFFICE","OFFICEHOLDER","OFFICEHOLDERS","OFFICERED","OFFICERING","OFFICES","OFFKEY","OFFLOAD","OFFLOADED","OFFLOADING","OFFLOADS","OFFPRINT","OFFPRINTED","OFFPRINTING","OFFPRINTS","OFFRAMP","OFFRAMPS","OFFSCOURING","OFFSCOURINGS","OFFSCREEN","OFFSET","OFFSETS","OFFSETTING","OFFSHOOT","OFFSHOOTS","OFFSHORE","OFFSIDE","OFFSIDES","OFFSPRING","OFFSPRINGS","OFFSTAGE","OFFSTAGES","OFFTRACK","OUTACHIEVE","OUTACHIEVED","OUTACHIEVES","OUTACHIEVING","OUTACT","OUTACTED","OUTACTING","OUTACTS","OUTADD","OUTADDED","OUTADDING","OUTADDS","OUTAGE","OUTAGES","OUTARGUE","OUTARGUED","OUTARGUES","OUTARGUING","OUTASK","OUTASKED","OUTASKING","OUTASKS","OUTATE","OUTBACK","OUTBACKS","OUTBAKE","OUTBAKED","OUTBAKES","OUTBAKING","OUTBALANCE","OUTBALANCED","OUTBALANCES","OUTBALANCING","OUTBARGAIN","OUTBARGAINED","OUTBARGAINING","OUTBARGAINS","OUTBARK","OUTBARKED","OUTBARKING","OUTBARKS","OUTBAWL","OUTBAWLED","OUTBAWLING","OUTBAWLS","OUTBEAM","OUTBEAMED","OUTBEAMING","OUTBEAMS","OUTBEG","OUTBEGGED","OUTBEGGING","OUTBEGS","OUTBID","OUTBIDDEN","OUTBIDDING","OUTBIDS","OUTBITCH","OUTBITCHED","OUTBITCHES","OUTBITCHING","OUTBLAZE","OUTBLAZED","OUTBLAZES","OUTBLAZING","OUTBLEAT","OUTBLEATED","OUTBLEATING","OUTBLEATS","OUTBLESS","OUTBLESSED","OUTBLESSES","OUTBLESSING","OUTBLOOM","OUTBLOOMED","OUTBLOOMING","OUTBLOOMS","OUTBLUFF","OUTBLUFFED","OUTBLUFFING","OUTBLUFFS","OUTBLUSH","OUTBLUSHED","OUTBLUSHES","OUTBLUSHING","OUTBOARD","OUTBOARDS","OUTBOAST","OUTBOASTED","OUTBOASTING","OUTBOASTS","OUTBOUGHT","OUTBOUND","OUTBOX","OUTBOXED","OUTBOXES","OUTBOXING","OUTBRAG","OUTBRAGGED","OUTBRAGGING","OUTBRAGS","OUTBRAVE","OUTBRAVED","OUTBRAVES","OUTBRAVING","OUTBRAWL","OUTBRAWLED","OUTBRAWLING","OUTBRAWLS","OUTBREAK","OUTBREAKS","OUTBRED","OUTBREED","OUTBREEDING","OUTBREEDINGS","OUTBREEDS","OUTBRIBE","OUTBRIBED","OUTBRIBES","OUTBRIBING","OUTBUILD","OUTBUILDING","OUTBUILDINGS","OUTBUILDS","OUTBUILT","OUTBULK","OUTBULKED","OUTBULKING","OUTBULKS","OUTBULLIED","OUTBULLIES","OUTBULLY","OUTBULLYING","OUTBURN","OUTBURNED","OUTBURNING","OUTBURNS","OUTBURNT","OUTBURST","OUTBURSTS","OUTBUY","OUTBUYING","OUTBUYS","OUTBYE","OUTCAPER","OUTCAPERED","OUTCAPERING","OUTCAPERS","OUTCAST","OUTCASTE","OUTCASTES","OUTCASTS","OUTCATCH","OUTCATCHES","OUTCATCHING","OUTCAUGHT","OUTCAVIL","OUTCAVILED","OUTCAVILING","OUTCAVILLED","OUTCAVILLING","OUTCAVILS","OUTCHARGE","OUTCHARGED","OUTCHARGES","OUTCHARGING","OUTCHARM","OUTCHARMED","OUTCHARMING","OUTCHARMS","OUTCHEAT","OUTCHEATED","OUTCHEATING","OUTCHEATS","OUTCHID","OUTCHIDDEN","OUTCHIDE","OUTCHIDED","OUTCHIDES","OUTCHIDING","OUTCLASS","OUTCLASSED","OUTCLASSES","OUTCLASSING","OUTCLIMB","OUTCLIMBED","OUTCLIMBING","OUTCLIMBS","OUTCLOMB","OUTCOACH","OUTCOACHED","OUTCOACHES","OUTCOACHING","OUTCOME","OUTCOMES","OUTCOMPETE","OUTCOMPETED","OUTCOMPETES","OUTCOMPETING","OUTCOOK","OUTCOOKED","OUTCOOKING","OUTCOOKS","OUTCOUNT","OUTCOUNTED","OUTCOUNTING","OUTCOUNTS","OUTCRAWL","OUTCRAWLED","OUTCRAWLING","OUTCRAWLS","OUTCRIED","OUTCRIES","OUTCROP","OUTCROPPED","OUTCROPPING","OUTCROPS","OUTCROSS","OUTCROSSED","OUTCROSSES","OUTCROSSING","OUTCROW","OUTCROWED","OUTCROWING","OUTCROWS","OUTCRY","OUTCRYING","OUTCURSE","OUTCURSED","OUTCURSES","OUTCURSING","OUTCURVE","OUTCURVES","OUTDANCE","OUTDANCED","OUTDANCES","OUTDANCING","OUTDARE","OUTDARED","OUTDARES","OUTDARING","OUTDATE","OUTDATED","OUTDATEDLY","OUTDATEDNESS","OUTDATEDNESSES","OUTDATES","OUTDATING","OUTDAZZLE","OUTDAZZLED","OUTDAZZLES","OUTDAZZLING","OUTDEBATE","OUTDEBATED","OUTDEBATES","OUTDEBATING","OUTDELIVER","OUTDELIVERED","OUTDELIVERING","OUTDELIVERS","OUTDESIGN","OUTDESIGNED","OUTDESIGNING","OUTDESIGNS","OUTDID","OUTDISTANCE","OUTDISTANCED","OUTDISTANCES","OUTDISTANCING","OUTDODGE","OUTDODGED","OUTDODGES","OUTDODGING","OUTDOER","OUTDOERS","OUTDOES","OUTDOING","OUTDONE","OUTDOOR","OUTDOORS","OUTDRAG","OUTDRAGGED","OUTDRAGGING","OUTDRAGS","OUTDRANK","OUTDRAW","OUTDRAWING","OUTDRAWN","OUTDRAWS","OUTDREAM","OUTDREAMED","OUTDREAMING","OUTDREAMS","OUTDREAMT","OUTDRESS","OUTDRESSED","OUTDRESSES","OUTDRESSING","OUTDREW","OUTDRINK","OUTDRINKING","OUTDRINKS","OUTDRIVE","OUTDRIVEN","OUTDRIVES","OUTDRIVING","OUTDROP","OUTDROPPED","OUTDROPPING","OUTDROPS","OUTDROVE","OUTDRUNK","OUTDUEL","OUTDUELED","OUTDUELING","OUTDUELLED","OUTDUELLING","OUTDUELS","OUTEARN","OUTEARNED","OUTEARNING","OUTEARNS","OUTEAT","OUTEATEN","OUTEATING","OUTEATS","OUTECHO","OUTECHOED","OUTECHOES","OUTECHOING","OUTERS","OUTFABLE","OUTFABLED","OUTFABLES","OUTFABLING","OUTFACE","OUTFACED","OUTFACES","OUTFACING","OUTFALL","OUTFALLS","OUTFAST","OUTFASTED","OUTFASTING","OUTFASTS","OUTFAWN","OUTFAWNED","OUTFAWNING","OUTFAWNS","OUTFEAST","OUTFEASTED","OUTFEASTING","OUTFEASTS","OUTFEEL","OUTFEELING","OUTFEELS","OUTFELT","OUTFIELD","OUTFIELDER","OUTFIELDERS","OUTFIELDS","OUTFIGHT","OUTFIGHTING","OUTFIGHTS","OUTFIGURE","OUTFIGURED","OUTFIGURES","OUTFIGURING","OUTFIND","OUTFINDING","OUTFINDS","OUTFIRE","OUTFIRED","OUTFIRES","OUTFIRING","OUTFISH","OUTFISHED","OUTFISHES","OUTFISHING","OUTFIT","OUTFITS","OUTFITTED","OUTFITTER","OUTFITTERS","OUTFITTING","OUTFLANK","OUTFLANKED","OUTFLANKING","OUTFLANKS","OUTFLEW","OUTFLIES","OUTFLOW","OUTFLOWED","OUTFLOWING","OUTFLOWN","OUTFLOWS","OUTFLY","OUTFLYING","OUTFOOL","OUTFOOLED","OUTFOOLING","OUTFOOLS","OUTFOOT","OUTFOOTED","OUTFOOTING","OUTFOOTS","OUTFOUGHT","OUTFOUND","OUTFOX","OUTFOXED","OUTFOXES","OUTFOXING","OUTFROWN","OUTFROWNED","OUTFROWNING","OUTFROWNS","OUTFUMBLE","OUTFUMBLED","OUTFUMBLES","OUTFUMBLING","OUTGAIN","OUTGAINED","OUTGAINING","OUTGAINS","OUTGAS","OUTGASSED","OUTGASSES","OUTGASSING","OUTGAVE","OUTGENERAL","OUTGENERALS","OUTGIVE","OUTGIVEN","OUTGIVES","OUTGIVING","OUTGLARE","OUTGLARED","OUTGLARES","OUTGLARING","OUTGLITTER","OUTGLITTERED","OUTGLITTERING","OUTGLITTERS","OUTGLOW","OUTGLOWED","OUTGLOWING","OUTGLOWS","OUTGNAW","OUTGNAWED","OUTGNAWING","OUTGNAWN","OUTGNAWS","OUTGOES","OUTGOING","OUTGOINGS","OUTGONE","OUTGREW","OUTGRIN","OUTGRINNED","OUTGRINNING","OUTGRINS","OUTGROSS","OUTGROSSED","OUTGROSSES","OUTGROSSING","OUTGROUP","OUTGROUPS","OUTGROW","OUTGROWING","OUTGROWN","OUTGROWS","OUTGROWTH","OUTGROWTHS","OUTGUESS","OUTGUESSED","OUTGUESSES","OUTGUESSING","OUTGUIDE","OUTGUIDED","OUTGUIDES","OUTGUIDING","OUTGUN","OUTGUNNED","OUTGUNNING","OUTGUNS","OUTGUSH","OUTGUSHES","OUTHAUL","OUTHAULS","OUTHEAR","OUTHEARD","OUTHEARING","OUTHEARS","OUTHIT","OUTHITS","OUTHITTING","OUTHOMER","OUTHOMERED","OUTHOMERING","OUTHOMERS","OUTHOUSE","OUTHOUSES","OUTHOWL","OUTHOWLED","OUTHOWLING","OUTHOWLS","OUTHUMOR","OUTHUMORED","OUTHUMORING","OUTHUMORS","OUTHUNT","OUTHUNTED","OUTHUNTING","OUTHUNTS","OUTHUSTLE","OUTHUSTLED","OUTHUSTLES","OUTHUSTLING","OUTINTRIGUE","OUTINTRIGUED","OUTINTRIGUES","OUTINTRIGUING","OUTJINX","OUTJINXED","OUTJINXES","OUTJINXING","OUTJUMP","OUTJUMPED","OUTJUMPING","OUTJUMPS","OUTJUT","OUTJUTS","OUTJUTTED","OUTJUTTING","OUTKEEP","OUTKEEPING","OUTKEEPS","OUTKEPT","OUTKICK","OUTKICKED","OUTKICKING","OUTKICKS","OUTKILL","OUTKILLED","OUTKILLING","OUTKILLS","OUTKISS","OUTKISSED","OUTKISSES","OUTKISSING","OUTLAID","OUTLAIN","OUTLAND","OUTLANDER","OUTLANDERS","OUTLANDS","OUTLAST","OUTLASTED","OUTLASTING","OUTLASTS","OUTLAUGH","OUTLAUGHED","OUTLAUGHING","OUTLAUGHS","OUTLAW","OUTLAWED","OUTLAWING","OUTLAWS","OUTLAY","OUTLAYING","OUTLAYS","OUTLEAP","OUTLEAPED","OUTLEAPING","OUTLEAPS","OUTLEAPT","OUTLEARN","OUTLEARNED","OUTLEARNING","OUTLEARNS","OUTLEARNT","OUTLET","OUTLETS","OUTLIE","OUTLIER","OUTLIERS","OUTLIES","OUTLINE","OUTLINED","OUTLINER","OUTLINERS","OUTLINES","OUTLINING","OUTLIVE","OUTLIVED","OUTLIVER","OUTLIVERS","OUTLIVES","OUTLIVING","OUTLOOK","OUTLOOKS","OUTLOVE","OUTLOVED","OUTLOVES","OUTLOVING","OUTLYING","OUTMAN","OUTMANEUVER","OUTMANEUVERED","OUTMANEUVERING","OUTMANEUVERS","OUTMANIPULATE","OUTMANIPULATED","OUTMANIPULATES","OUTMANIPULATING","OUTMANNED","OUTMANNING","OUTMANS","OUTMARCH","OUTMARCHED","OUTMARCHES","OUTMARCHING","OUTMATCH","OUTMATCHED","OUTMATCHES","OUTMATCHING","OUTMODE","OUTMODES","OUTMOST","OUTMOVE","OUTMOVED","OUTMOVES","OUTMOVING","OUTMUSCLE","OUTMUSCLED","OUTMUSCLES","OUTMUSCLING","OUTNUMBER","OUTNUMBERED","OUTNUMBERING","OUTNUMBERS","OUTORGANIZE","OUTORGANIZED","OUTORGANIZES","OUTORGANIZING","OUTPACE","OUTPACED","OUTPACES","OUTPACING","OUTPAINT","OUTPAINTED","OUTPAINTING","OUTPAINTS","OUTPASS","OUTPASSED","OUTPASSES","OUTPASSING","OUTPATIENT","OUTPATIENTS","OUTPERFORM","OUTPERFORMED","OUTPERFORMING","OUTPERFORMS","OUTPITCH","OUTPITCHED","OUTPITCHES","OUTPITCHING","OUTPITIED","OUTPITIES","OUTPITY","OUTPITYING","OUTPLACEMENT","OUTPLACEMENTS","OUTPLAN","OUTPLANNED","OUTPLANNING","OUTPLANS","OUTPLAY","OUTPLAYED","OUTPLAYING","OUTPLAYS","OUTPLOD","OUTPLODDED","OUTPLODDING","OUTPLODS","OUTPLOT","OUTPLOTS","OUTPLOTTED","OUTPLOTTING","OUTPOINT","OUTPOINTED","OUTPOINTING","OUTPOINTS","OUTPOLITICK","OUTPOLITICKED","OUTPOLITICKING","OUTPOLITICKS","OUTPOLL","OUTPOLLED","OUTPOLLING","OUTPOLLS","OUTPOPULATE","OUTPOPULATED","OUTPOPULATES","OUTPOPULATING","OUTPORT","OUTPORTS","OUTPOST","OUTPOSTS","OUTPOUR","OUTPOURED","OUTPOURING","OUTPOURS","OUTPOWER","OUTPOWERED","OUTPOWERING","OUTPOWERS","OUTPRAY","OUTPRAYED","OUTPRAYING","OUTPRAYS","OUTPREACH","OUTPREACHED","OUTPREACHES","OUTPREACHING","OUTPREEN","OUTPREENED","OUTPREENING","OUTPREENS","OUTPRESS","OUTPRESSED","OUTPRESSES","OUTPRESSING","OUTPRICE","OUTPRICED","OUTPRICES","OUTPRICING","OUTPRODUCE","OUTPRODUCED","OUTPRODUCES","OUTPRODUCING","OUTPROMISE","OUTPROMISED","OUTPROMISES","OUTPROMISING","OUTPULL","OUTPULLED","OUTPULLING","OUTPULLS","OUTPUNCH","OUTPUNCHED","OUTPUNCHES","OUTPUNCHING","OUTPUSH","OUTPUSHED","OUTPUSHES","OUTPUSHING","OUTPUT","OUTPUTS","OUTPUTTED","OUTPUTTING","OUTQUOTE","OUTQUOTED","OUTQUOTES","OUTQUOTING","OUTRACE","OUTRACED","OUTRACES","OUTRACING","OUTRAGE","OUTRAGED","OUTRAGES","OUTRAGING","OUTRAISE","OUTRAISED","OUTRAISES","OUTRAISING","OUTRAN","OUTRANCE","OUTRANCES","OUTRANG","OUTRANGE","OUTRANGED","OUTRANGES","OUTRANGING","OUTRANK","OUTRANKED","OUTRANKING","OUTRANKS","OUTRATE","OUTRATED","OUTRATES","OUTRATING","OUTRAVE","OUTRAVED","OUTRAVES","OUTRAVING","OUTREACH","OUTREACHED","OUTREACHES","OUTREACHING","OUTREAD","OUTREADING","OUTREADS","OUTREBOUND","OUTREBOUNDED","OUTREBOUNDING","OUTREBOUNDS","OUTREPRODUCE","OUTREPRODUCED","OUTREPRODUCES","OUTREPRODUCING","OUTRIDDEN","OUTRIDE","OUTRIDER","OUTRIDERS","OUTRIDES","OUTRIDING","OUTRIGGER","OUTRIGGERS","OUTRIGHT","OUTRIGHTLY","OUTRING","OUTRINGING","OUTRINGS","OUTRIVAL","OUTRIVALED","OUTRIVALING","OUTRIVALLED","OUTRIVALLING","OUTRIVALS","OUTROAR","OUTROARED","OUTROARING","OUTROARS","OUTROCK","OUTROCKED","OUTROCKING","OUTROCKS","OUTRODE","OUTROLL","OUTROLLED","OUTROLLING","OUTROLLS","OUTROOT","OUTROOTED","OUTROOTING","OUTROOTS","OUTROW","OUTROWED","OUTROWING","OUTROWS","OUTRUN","OUTRUNG","OUTRUNNING","OUTRUNS","OUTRUSH","OUTRUSHED","OUTRUSHES","OUTRUSHING","OUTSAIL","OUTSAILED","OUTSAILING","OUTSAILS","OUTSANG","OUTSAT","OUTSAVOR","OUTSAVORED","OUTSAVORING","OUTSAVORS","OUTSAW","OUTSCHEME","OUTSCHEMED","OUTSCHEMES","OUTSCHEMING","OUTSCOLD","OUTSCOLDED","OUTSCOLDING","OUTSCOLDS","OUTSCOOP","OUTSCOOPED","OUTSCOOPING","OUTSCOOPS","OUTSCORE","OUTSCORED","OUTSCORES","OUTSCORING","OUTSCORN","OUTSCORNED","OUTSCORNING","OUTSCORNS","OUTSEE","OUTSEEING","OUTSEEN","OUTSEES","OUTSELL","OUTSELLING","OUTSELLS","OUTSERVE","OUTSERVED","OUTSERVES","OUTSERVING","OUTSET","OUTSETS","OUTSHAME","OUTSHAMED","OUTSHAMES","OUTSHAMING","OUTSHINE","OUTSHINED","OUTSHINES","OUTSHINING","OUTSHONE","OUTSHOOT","OUTSHOOTING","OUTSHOOTS","OUTSHOT","OUTSHOUT","OUTSHOUTED","OUTSHOUTING","OUTSHOUTS","OUTSIDE","OUTSIDES","OUTSIGHT","OUTSIGHTS","OUTSIN","OUTSING","OUTSINGING","OUTSINGS","OUTSINNED","OUTSINNING","OUTSINS","OUTSIT","OUTSITS","OUTSITTING","OUTSIZE","OUTSIZED","OUTSIZES","OUTSKATE","OUTSKATED","OUTSKATES","OUTSKATING","OUTSKIRT","OUTSKIRTS","OUTSLEEP","OUTSLEEPING","OUTSLEEPS","OUTSLEPT","OUTSLICK","OUTSLICKED","OUTSLICKING","OUTSLICKS","OUTSMART","OUTSMARTED","OUTSMARTING","OUTSMARTS","OUTSMILE","OUTSMILED","OUTSMILES","OUTSMILING","OUTSMOKE","OUTSMOKED","OUTSMOKES","OUTSMOKING","OUTSNORE","OUTSNORED","OUTSNORES","OUTSNORING","OUTSOAR","OUTSOARED","OUTSOARING","OUTSOARS","OUTSOLD","OUTSOLE","OUTSOLES","OUTSOURCING","OUTSPAN","OUTSPANNED","OUTSPANNING","OUTSPANS","OUTSPARKLE","OUTSPARKLED","OUTSPARKLES","OUTSPARKLING","OUTSPEAK","OUTSPEAKING","OUTSPEAKS","OUTSPED","OUTSPEED","OUTSPEEDED","OUTSPEEDING","OUTSPEEDS","OUTSPELL","OUTSPELLED","OUTSPELLING","OUTSPELLS","OUTSPELT","OUTSPEND","OUTSPENDING","OUTSPENDS","OUTSPENT","OUTSPOKE","OUTSPOKEN","OUTSPREAD","OUTSPREADING","OUTSPREADS","OUTSPRINT","OUTSPRINTED","OUTSPRINTING","OUTSPRINTS","OUTSTAND","OUTSTANDING","OUTSTANDS","OUTSTARE","OUTSTARED","OUTSTARES","OUTSTARING","OUTSTART","OUTSTARTED","OUTSTARTING","OUTSTARTS","OUTSTATE","OUTSTATED","OUTSTATES","OUTSTATING","OUTSTATION","OUTSTATIONS","OUTSTAY","OUTSTAYED","OUTSTAYING","OUTSTAYS","OUTSTEER","OUTSTEERED","OUTSTEERING","OUTSTEERS","OUTSTOOD","OUTSTRETCH","OUTSTRETCHED","OUTSTRETCHES","OUTSTRETCHING","OUTSTRIDDEN","OUTSTRIDE","OUTSTRIDES","OUTSTRIDING","OUTSTRIP","OUTSTRIPPED","OUTSTRIPPING","OUTSTRIPS","OUTSTRODE","OUTSTUDIED","OUTSTUDIES","OUTSTUDY","OUTSTUDYING","OUTSTUNT","OUTSTUNTED","OUTSTUNTING","OUTSTUNTS","OUTSULK","OUTSULKED","OUTSULKING","OUTSULKS","OUTSUNG","OUTSWAM","OUTSWARE","OUTSWEAR","OUTSWEARING","OUTSWEARS","OUTSWIM","OUTSWIMMING","OUTSWIMS","OUTSWORE","OUTSWORN","OUTSWUM","OUTTAKE","OUTTAKES","OUTTALK","OUTTALKED","OUTTALKING","OUTTALKS","OUTTASK","OUTTASKED","OUTTASKING","OUTTASKS","OUTTELL","OUTTELLING","OUTTELLS","OUTTHANK","OUTTHANKED","OUTTHANKING","OUTTHANKS","OUTTHINK","OUTTHINKING","OUTTHINKS","OUTTHOUGHT","OUTTHREW","OUTTHROB","OUTTHROBBED","OUTTHROBBING","OUTTHROBS","OUTTHROW","OUTTHROWING","OUTTHROWN","OUTTHROWS","OUTTHRUST","OUTTHRUSTING","OUTTHRUSTS","OUTTOLD","OUTTOWER","OUTTOWERED","OUTTOWERING","OUTTOWERS","OUTTRADE","OUTTRADED","OUTTRADES","OUTTRADING","OUTTRICK","OUTTRICKED","OUTTRICKING","OUTTRICKS","OUTTROT","OUTTROTS","OUTTROTTED","OUTTROTTING","OUTTRUMP","OUTTRUMPED","OUTTRUMPING","OUTTRUMPS","OUTTURN","OUTTURNS","OUTVALUE","OUTVALUED","OUTVALUES","OUTVALUING","OUTVAUNT","OUTVAUNTED","OUTVAUNTING","OUTVAUNTS","OUTVIE","OUTVIED","OUTVIES","OUTVOICE","OUTVOICED","OUTVOICES","OUTVOICING","OUTVOTE","OUTVOTED","OUTVOTES","OUTVOTING","OUTVYING","OUTWAIT","OUTWAITED","OUTWAITING","OUTWAITS","OUTWALK","OUTWALKED","OUTWALKING","OUTWALKS","OUTWAR","OUTWARD","OUTWARDS","OUTWARRED","OUTWARRING","OUTWARS","OUTWASH","OUTWASHES","OUTWASTE","OUTWASTED","OUTWASTES","OUTWASTING","OUTWATCH","OUTWATCHED","OUTWATCHES","OUTWATCHING","OUTWEAR","OUTWEARIED","OUTWEARIES","OUTWEARING","OUTWEARS","OUTWEARY","OUTWEARYING","OUTWEEP","OUTWEEPING","OUTWEEPS","OUTWEIGH","OUTWEIGHED","OUTWEIGHING","OUTWEIGHS","OUTWENT","OUTWEPT","OUTWHIRL","OUTWHIRLED","OUTWHIRLING","OUTWHIRLS","OUTWILE","OUTWILED","OUTWILES","OUTWILING","OUTWILL","OUTWILLED","OUTWILLING","OUTWILLS","OUTWIND","OUTWINDED","OUTWINDING","OUTWINDS","OUTWISH","OUTWISHED","OUTWISHES","OUTWISHING","OUTWIT","OUTWITS","OUTWITTED","OUTWITTING","OUTWORE","OUTWORK","OUTWORKED","OUTWORKER","OUTWORKERS","OUTWORKING","OUTWORKS","OUTWORN","OUTWRESTLE","OUTWRESTLED","OUTWRESTLES","OUTWRESTLING","OUTWRIT","OUTWRITE","OUTWRITES","OUTWRITING","OUTWRITTEN","OUTWROTE","OUTWROUGHT","OUTYELL","OUTYELLED","OUTYELLING","OUTYELLS","OUTYELP","OUTYELPED","OUTYELPING","OUTYELPS","OUTYIELD","OUTYIELDED","OUTYIELDING","OUTYIELDS","OVERABLE","OVERABSTRACT","OVERABSTRACTED","OVERABSTRACTING","OVERABSTRACTS","OVERABUNDANCE","OVERABUNDANCES","OVERABUNDANT","OVERACCENTUATE","OVERACCENTUATED","OVERACCENTUATES","OVERACCENTUATING","OVERACHIEVE","OVERACHIEVED","OVERACHIEVEMENT","OVERACHIEVEMENTS","OVERACHIEVER","OVERACHIEVERS","OVERACHIEVES","OVERACHIEVING","OVERACT","OVERACTED","OVERACTING","OVERACTION","OVERACTIONS","OVERACTIVE","OVERACTIVITIES","OVERACTIVITY","OVERACTS","OVERADJUSTMENT","OVERADJUSTMENTS","OVERADVERTISE","OVERADVERTISED","OVERADVERTISES","OVERADVERTISING","OVERAGE","OVERAGED","OVERAGES","OVERAGGRESSIVE","OVERALERT","OVERALL","OVERALLS","OVERAMBITIOUS","OVERAMBITIOUSNESS","OVERAMBITIOUSNESSES","OVERAMPLIFIED","OVERANALYSES","OVERANALYSIS","OVERANALYTICAL","OVERANALYZE","OVERANALYZED","OVERANALYZES","OVERANALYZING","OVERANXIETIES","OVERANXIETY","OVERANXIOUS","OVERAPPLICATION","OVERAPPLICATIONS","OVERAPT","OVERARCH","OVERARCHED","OVERARCHES","OVERARCHING","OVERARM","OVERAROUSAL","OVERAROUSALS","OVERARRANGE","OVERARRANGED","OVERARRANGES","OVERARRANGING","OVERARTICULATE","OVERARTICULATED","OVERARTICULATES","OVERARTICULATING","OVERASSERT","OVERASSERTED","OVERASSERTING","OVERASSERTION","OVERASSERTIONS","OVERASSERTIVE","OVERASSERTS","OVERASSESSMENT","OVERASSESSMENTS","OVERATE","OVERATTENTION","OVERATTENTIONS","OVERAWE","OVERAWED","OVERAWES","OVERAWING","OVERBAKE","OVERBAKED","OVERBAKES","OVERBAKING","OVERBALANCE","OVERBALANCED","OVERBALANCES","OVERBALANCING","OVERBEAR","OVERBEARING","OVERBEARS","OVERBEAT","OVERBEATEN","OVERBEATING","OVERBEATS","OVERBED","OVERBEJEWELED","OVERBET","OVERBETS","OVERBETTED","OVERBETTING","OVERBID","OVERBIDDEN","OVERBIDDING","OVERBIDS","OVERBIG","OVERBILL","OVERBILLED","OVERBILLING","OVERBILLS","OVERBITE","OVERBITES","OVERBLEACH","OVERBLEACHED","OVERBLEACHES","OVERBLEACHING","OVERBLEW","OVERBLOUSE","OVERBLOUSES","OVERBLOW","OVERBLOWING","OVERBLOWN","OVERBLOWS","OVERBOARD","OVERBOIL","OVERBOILED","OVERBOILING","OVERBOILS","OVERBOLD","OVERBOOK","OVERBOOKED","OVERBOOKING","OVERBOOKS","OVERBORE","OVERBORN","OVERBORNE","OVERBORROW","OVERBORROWED","OVERBORROWING","OVERBORROWS","OVERBOUGHT","OVERBREATHING","OVERBRED","OVERBRIEF","OVERBRIGHT","OVERBROAD","OVERBROWSE","OVERBROWSED","OVERBROWSES","OVERBROWSING","OVERBRUTAL","OVERBUILD","OVERBUILDING","OVERBUILDS","OVERBUILT","OVERBURDEN","OVERBURDENED","OVERBURDENING","OVERBURDENS","OVERBURN","OVERBURNED","OVERBURNING","OVERBURNS","OVERBURNT","OVERBUSY","OVERBUY","OVERBUYING","OVERBUYS","OVERCALL","OVERCALLED","OVERCALLING","OVERCALLS","OVERCAME","OVERCAPACITIES","OVERCAPACITY","OVERCAPITALIZATION","OVERCAPITALIZATIONS","OVERCAPITALIZE","OVERCAPITALIZED","OVERCAPITALIZES","OVERCAPITALIZING","OVERCAREFUL","OVERCAST","OVERCASTING","OVERCASTINGS","OVERCASTS","OVERCAUTION","OVERCAUTIONED","OVERCAUTIONING","OVERCAUTIONS","OVERCAUTIOUS","OVERCENTRALIZATION","OVERCENTRALIZATIONS","OVERCENTRALIZE","OVERCENTRALIZED","OVERCENTRALIZES","OVERCENTRALIZING","OVERCHARGE","OVERCHARGED","OVERCHARGES","OVERCHARGING","OVERCHILL","OVERCHILLED","OVERCHILLING","OVERCHILLS","OVERCIVILIZED","OVERCLAIM","OVERCLAIMED","OVERCLAIMING","OVERCLAIMS","OVERCLASSIFICATION","OVERCLASSIFICATIONS","OVERCLASSIFIED","OVERCLASSIFIES","OVERCLASSIFY","OVERCLASSIFYING","OVERCLEAN","OVERCLEANED","OVERCLEANING","OVERCLEANS","OVERCLEAR","OVERCLEARED","OVERCLEARING","OVERCLEARS","OVERCLOUD","OVERCLOUDED","OVERCLOUDING","OVERCLOUDS","OVERCOACH","OVERCOACHED","OVERCOACHES","OVERCOACHING","OVERCOAT","OVERCOATS","OVERCOLD","OVERCOME","OVERCOMER","OVERCOMERS","OVERCOMES","OVERCOMING","OVERCOMMERCIALIZATION","OVERCOMMERCIALIZATIONS","OVERCOMMERCIALIZE","OVERCOMMERCIALIZED","OVERCOMMERCIALIZES","OVERCOMMERCIALIZING","OVERCOMMIT","OVERCOMMITMENT","OVERCOMMITMENTS","OVERCOMMITS","OVERCOMMITTED","OVERCOMMITTING","OVERCOMMUNICATE","OVERCOMMUNICATED","OVERCOMMUNICATES","OVERCOMMUNICATING","OVERCOMMUNICATION","OVERCOMMUNICATIONS","OVERCOMPENSATE","OVERCOMPENSATED","OVERCOMPENSATES","OVERCOMPENSATING","OVERCOMPENSATION","OVERCOMPENSATIONS","OVERCOMPENSATORY","OVERCOMPLEX","OVERCOMPLIANCE","OVERCOMPLIANCES","OVERCOMPLICATE","OVERCOMPLICATED","OVERCOMPLICATES","OVERCOMPLICATING","OVERCOMPRESS","OVERCOMPRESSED","OVERCOMPRESSES","OVERCOMPRESSING","OVERCONCENTRATION","OVERCONCENTRATIONS","OVERCONCERN","OVERCONCERNED","OVERCONCERNING","OVERCONCERNS","OVERCONFIDENCE","OVERCONFIDENCES","OVERCONFIDENT","OVERCONFIDENTLY","OVERCONSCIENTIOUS","OVERCONSCIOUS","OVERCONSERVATIVE","OVERCONSTRUCT","OVERCONSTRUCTED","OVERCONSTRUCTING","OVERCONSTRUCTS","OVERCONSUME","OVERCONSUMED","OVERCONSUMES","OVERCONSUMING","OVERCONSUMPTION","OVERCONSUMPTIONS","OVERCONTROL","OVERCONTROLLED","OVERCONTROLLING","OVERCONTROLS","OVERCOOK","OVERCOOKED","OVERCOOKING","OVERCOOKS","OVERCOOL","OVERCOOLED","OVERCOOLING","OVERCOOLS","OVERCORRECT","OVERCORRECTED","OVERCORRECTING","OVERCORRECTION","OVERCORRECTIONS","OVERCORRECTS","OVERCOUNT","OVERCOUNTED","OVERCOUNTING","OVERCOUNTS","OVERCOY","OVERCRAM","OVERCRAMMED","OVERCRAMMING","OVERCRAMS","OVERCREDULOUS","OVERCRITICAL","OVERCROP","OVERCROPPED","OVERCROPPING","OVERCROPS","OVERCROWD","OVERCROWDED","OVERCROWDING","OVERCROWDS","OVERCULTIVATION","OVERCULTIVATIONS","OVERCURE","OVERCURED","OVERCURES","OVERCURING","OVERCUT","OVERCUTS","OVERCUTTING","OVERDARE","OVERDARED","OVERDARES","OVERDARING","OVERDEAR","OVERDECK","OVERDECKED","OVERDECKING","OVERDECKS","OVERDECORATE","OVERDECORATED","OVERDECORATES","OVERDECORATING","OVERDECORATION","OVERDECORATIONS","OVERDEMANDING","OVERDEPENDENCE","OVERDEPENDENCES","OVERDEPENDENT","OVERDESIGN","OVERDESIGNED","OVERDESIGNING","OVERDESIGNS","OVERDETERMINED","OVERDEVELOP","OVERDEVELOPED","OVERDEVELOPING","OVERDEVELOPMENT","OVERDEVELOPMENTS","OVERDEVELOPS","OVERDID","OVERDIFFERENTIATION","OVERDIFFERENTIATIONS","OVERDIRECT","OVERDIRECTED","OVERDIRECTING","OVERDIRECTS","OVERDISCOUNT","OVERDISCOUNTED","OVERDISCOUNTING","OVERDISCOUNTS","OVERDIVERSITIES","OVERDIVERSITY","OVERDOCUMENT","OVERDOCUMENTED","OVERDOCUMENTING","OVERDOCUMENTS","OVERDOER","OVERDOERS","OVERDOES","OVERDOG","OVERDOGS","OVERDOING","OVERDOMINANCE","OVERDOMINANCES","OVERDOMINANT","OVERDONE","OVERDOSAGE","OVERDOSAGES","OVERDOSE","OVERDOSED","OVERDOSES","OVERDOSING","OVERDRAFT","OVERDRAFTS","OVERDRAMATIC","OVERDRAMATIZE","OVERDRAMATIZED","OVERDRAMATIZES","OVERDRAMATIZING","OVERDRANK","OVERDRAW","OVERDRAWING","OVERDRAWN","OVERDRAWS","OVERDRESS","OVERDRESSED","OVERDRESSES","OVERDRESSING","OVERDREW","OVERDRIED","OVERDRIES","OVERDRINK","OVERDRINKING","OVERDRINKS","OVERDRIVE","OVERDRIVEN","OVERDRIVES","OVERDRIVING","OVERDROVE","OVERDRUNK","OVERDRY","OVERDRYING","OVERDUB","OVERDUBBED","OVERDUBBING","OVERDUBS","OVERDUE","OVERDYE","OVERDYED","OVERDYEING","OVERDYES","OVEREAGER","OVEREAGERNESS","OVEREAGERNESSES","OVEREARNEST","OVEREASY","OVEREAT","OVEREATEN","OVEREATER","OVEREATERS","OVEREATING","OVEREATS","OVEREDIT","OVEREDITED","OVEREDITING","OVEREDITS","OVEREDUCATE","OVEREDUCATED","OVEREDUCATES","OVEREDUCATING","OVEREDUCATION","OVEREDUCATIONS","OVERELABORATE","OVERELABORATED","OVERELABORATES","OVERELABORATING","OVERELABORATION","OVERELABORATIONS","OVEREMBELLISH","OVEREMBELLISHED","OVEREMBELLISHES","OVEREMBELLISHING","OVEREMBELLISHMENT","OVEREMBELLISHMENTS","OVEREMOTE","OVEREMOTED","OVEREMOTES","OVEREMOTING","OVEREMOTIONAL","OVEREMPHASES","OVEREMPHASIS","OVEREMPHASIZE","OVEREMPHASIZED","OVEREMPHASIZES","OVEREMPHASIZING","OVEREMPHATIC","OVERENAMORED","OVERENCOURAGE","OVERENCOURAGED","OVERENCOURAGES","OVERENCOURAGING","OVERENERGETIC","OVERENGINEER","OVERENGINEERED","OVERENGINEERING","OVERENGINEERS","OVERENROLLED","OVERENTERTAINED","OVERENTHUSIASM","OVERENTHUSIASMS","OVERENTHUSIASTIC","OVERENTHUSIASTICALLY","OVEREQUIPPED","OVERESTIMATE","OVERESTIMATED","OVERESTIMATES","OVERESTIMATING","OVERESTIMATION","OVERESTIMATIONS","OVEREVALUATION","OVEREVALUATIONS","OVEREXAGGERATE","OVEREXAGGERATED","OVEREXAGGERATES","OVEREXAGGERATING","OVEREXAGGERATION","OVEREXAGGERATIONS","OVEREXCITE","OVEREXCITED","OVEREXCITES","OVEREXCITING","OVEREXERCISE","OVEREXERCISED","OVEREXERCISES","OVEREXERCISING","OVEREXERT","OVEREXERTED","OVEREXERTING","OVEREXERTION","OVEREXERTIONS","OVEREXERTS","OVEREXPAND","OVEREXPANDED","OVEREXPANDING","OVEREXPANDS","OVEREXPANSION","OVEREXPANSIONS","OVEREXPECTATION","OVEREXPECTATIONS","OVEREXPLAIN","OVEREXPLAINED","OVEREXPLAINING","OVEREXPLAINS","OVEREXPLICIT","OVEREXPLOIT","OVEREXPLOITATION","OVEREXPLOITATIONS","OVEREXPLOITED","OVEREXPLOITING","OVEREXPLOITS","OVEREXPOSE","OVEREXPOSED","OVEREXPOSES","OVEREXPOSING","OVEREXPOSURE","OVEREXPOSURES","OVEREXTEND","OVEREXTENDED","OVEREXTENDING","OVEREXTENDS","OVEREXTENSION","OVEREXTENSIONS","OVEREXTRACTION","OVEREXTRACTIONS","OVEREXTRAPOLATION","OVEREXTRAPOLATIONS","OVEREXTRAVAGANT","OVEREXUBERANT","OVERFACILE","OVERFAMILIAR","OVERFAMILIARITIES","OVERFAMILIARITY","OVERFAR","OVERFAST","OVERFASTIDIOUS","OVERFAT","OVERFATIGUE","OVERFATIGUED","OVERFATIGUES","OVERFAVOR","OVERFAVORED","OVERFAVORING","OVERFAVORS","OVERFEAR","OVERFEARED","OVERFEARING","OVERFEARS","OVERFED","OVERFEED","OVERFEEDING","OVERFEEDS","OVERFERTILIZATION","OVERFERTILIZATIONS","OVERFERTILIZE","OVERFERTILIZED","OVERFERTILIZES","OVERFERTILIZING","OVERFILL","OVERFILLED","OVERFILLING","OVERFILLS","OVERFISH","OVERFISHED","OVERFISHES","OVERFISHING","OVERFLEW","OVERFLIES","OVERFLIGHT","OVERFLIGHTS","OVERFLOW","OVERFLOWED","OVERFLOWING","OVERFLOWN","OVERFLOWS","OVERFLY","OVERFLYING","OVERFOCUS","OVERFOCUSED","OVERFOCUSES","OVERFOCUSING","OVERFOCUSSED","OVERFOCUSSES","OVERFOCUSSING","OVERFOND","OVERFOUL","OVERFREE","OVERFULFILL","OVERFULFILLED","OVERFULFILLING","OVERFULFILLS","OVERFULL","OVERFUND","OVERFUNDED","OVERFUNDING","OVERFUNDS","OVERFUSSY","OVERGARMENT","OVERGARMENTS","OVERGENERALIZATION","OVERGENERALIZATIONS","OVERGENERALIZE","OVERGENERALIZED","OVERGENERALIZES","OVERGENERALIZING","OVERGENEROSITIES","OVERGENEROSITY","OVERGENEROUS","OVERGENEROUSLY","OVERGILD","OVERGILDED","OVERGILDING","OVERGILDS","OVERGILT","OVERGIRD","OVERGIRDED","OVERGIRDING","OVERGIRDS","OVERGIRT","OVERGLAD","OVERGLAMORIZE","OVERGLAMORIZED","OVERGLAMORIZES","OVERGLAMORIZING","OVERGLAZE","OVERGLAZES","OVERGOAD","OVERGOADED","OVERGOADING","OVERGOADS","OVERGOVERN","OVERGOVERNED","OVERGOVERNING","OVERGOVERNS","OVERGRAZE","OVERGRAZED","OVERGRAZES","OVERGRAZING","OVERGREW","OVERGROW","OVERGROWING","OVERGROWN","OVERGROWS","OVERGROWTH","OVERGROWTHS","OVERHAND","OVERHANDED","OVERHANDING","OVERHANDLE","OVERHANDLED","OVERHANDLES","OVERHANDLING","OVERHANDS","OVERHANG","OVERHANGING","OVERHANGS","OVERHARD","OVERHARVEST","OVERHARVESTED","OVERHARVESTING","OVERHARVESTS","OVERHASTY","OVERHATE","OVERHATED","OVERHATES","OVERHATING","OVERHAUL","OVERHAULED","OVERHAULING","OVERHAULS","OVERHEAD","OVERHEADS","OVERHEAP","OVERHEAPED","OVERHEAPING","OVERHEAPS","OVERHEAR","OVERHEARD","OVERHEARING","OVERHEARS","OVERHEAT","OVERHEATED","OVERHEATING","OVERHEATS","OVERHELD","OVERHIGH","OVERHOLD","OVERHOLDING","OVERHOLDS","OVERHOLY","OVERHOMOGENIZE","OVERHOMOGENIZED","OVERHOMOGENIZES","OVERHOMOGENIZING","OVERHOPE","OVERHOPED","OVERHOPES","OVERHOPING","OVERHOT","OVERHUNG","OVERHUNT","OVERHUNTED","OVERHUNTING","OVERHUNTINGS","OVERHUNTS","OVERHYPE","OVERHYPED","OVERHYPES","OVERHYPING","OVERIDEALIZE","OVERIDEALIZED","OVERIDEALIZES","OVERIDEALIZING","OVERIDENTIFICATION","OVERIDENTIFICATIONS","OVERIDENTIFIED","OVERIDENTIFIES","OVERIDENTIFY","OVERIDENTIFYING","OVERIDLE","OVERIMAGINATIVE","OVERIMPRESS","OVERIMPRESSED","OVERIMPRESSES","OVERIMPRESSING","OVERINDEBTEDNESS","OVERINDEBTEDNESSES","OVERINDULGE","OVERINDULGED","OVERINDULGENCE","OVERINDULGENCES","OVERINDULGENT","OVERINDULGES","OVERINDULGING","OVERINDUSTRIALIZE","OVERINDUSTRIALIZED","OVERINDUSTRIALIZES","OVERINDUSTRIALIZING","OVERINFLATE","OVERINFLATED","OVERINFLATES","OVERINFLATING","OVERINFLATION","OVERINFLATIONS","OVERINFORM","OVERINFORMED","OVERINFORMING","OVERINFORMS","OVERINGENIOUS","OVERINGENUITIES","OVERINGENUITY","OVERINSISTENT","OVERINSURE","OVERINSURED","OVERINSURES","OVERINSURING","OVERINTELLECTUALIZATION","OVERINTELLECTUALIZATIONS","OVERINTELLECTUALIZE","OVERINTELLECTUALIZED","OVERINTELLECTUALIZES","OVERINTELLECTUALIZING","OVERINTENSE","OVERINTENSITIES","OVERINTENSITY","OVERINTERPRETATION","OVERINTERPRETATIONS","OVERINVESTMENT","OVERINVESTMENTS","OVERISSUANCE","OVERISSUANCES","OVERISSUE","OVERISSUED","OVERISSUES","OVERISSUING","OVERJOY","OVERJOYED","OVERJOYING","OVERJOYS","OVERJUST","OVERKEEN","OVERKILL","OVERKILLED","OVERKILLING","OVERKILLS","OVERKIND","OVERLABOR","OVERLABORED","OVERLABORING","OVERLABORS","OVERLADE","OVERLADED","OVERLADEN","OVERLADES","OVERLADING","OVERLAID","OVERLAIN","OVERLAND","OVERLANDS","OVERLAP","OVERLAPPED","OVERLAPPING","OVERLAPS","OVERLARGE","OVERLATE","OVERLAVISH","OVERLAX","OVERLAY","OVERLAYING","OVERLAYS","OVERLEAF","OVERLEAP","OVERLEAPED","OVERLEAPING","OVERLEAPS","OVERLEAPT","OVERLEARN","OVERLEARNED","OVERLEARNING","OVERLEARNS","OVERLEND","OVERLENDING","OVERLENDS","OVERLENGTH","OVERLENGTHEN","OVERLENGTHENED","OVERLENGTHENING","OVERLENGTHENS","OVERLENT","OVERLET","OVERLETS","OVERLETTING","OVERLEWD","OVERLIE","OVERLIES","OVERLIGHT","OVERLIGHTED","OVERLIGHTING","OVERLIGHTS","OVERLIT","OVERLITERAL","OVERLITERARY","OVERLIVE","OVERLIVED","OVERLIVES","OVERLIVING","OVERLOAD","OVERLOADED","OVERLOADING","OVERLOADS","OVERLONG","OVERLOOK","OVERLOOKED","OVERLOOKING","OVERLOOKS","OVERLORD","OVERLORDED","OVERLORDING","OVERLORDS","OVERLORDSHIP","OVERLORDSHIPS","OVERLOUD","OVERLOVE","OVERLOVED","OVERLOVES","OVERLOVING","OVERLUSH","OVERLYING","OVERMAN","OVERMANAGE","OVERMANAGED","OVERMANAGES","OVERMANAGING","OVERMANNED","OVERMANNERED","OVERMANNING","OVERMANS","OVERMANTEL","OVERMANTELS","OVERMANY","OVERMASTER","OVERMASTERED","OVERMASTERING","OVERMASTERS","OVERMATCH","OVERMATCHED","OVERMATCHES","OVERMATCHING","OVERMATURE","OVERMATURITIES","OVERMATURITY","OVERMEDICATE","OVERMEDICATED","OVERMEDICATES","OVERMEDICATING","OVERMEDICATION","OVERMEDICATIONS","OVERMEEK","OVERMELT","OVERMELTED","OVERMELTING","OVERMELTS","OVERMEN","OVERMIGHTY","OVERMILD","OVERMILK","OVERMILKED","OVERMILKING","OVERMILKS","OVERMINE","OVERMINED","OVERMINES","OVERMINING","OVERMIX","OVERMIXED","OVERMIXES","OVERMIXING","OVERMODEST","OVERMODESTLY","OVERMODULATED","OVERMUCH","OVERMUCHES","OVERMUSCLED","OVERNEAR","OVERNEAT","OVERNEW","OVERNICE","OVERNIGHT","OVERNIGHTS","OVERNOURISH","OVERNOURISHED","OVERNOURISHES","OVERNOURISHING","OVERNUTRITION","OVERNUTRITIONS","OVEROBVIOUS","OVEROPERATE","OVEROPERATED","OVEROPERATES","OVEROPERATING","OVEROPINIONATED","OVEROPTIMISM","OVEROPTIMISMS","OVEROPTIMIST","OVEROPTIMISTIC","OVEROPTIMISTICALLY","OVEROPTIMISTS","OVERORCHESTRATE","OVERORCHESTRATED","OVERORCHESTRATES","OVERORCHESTRATING","OVERORGANIZE","OVERORGANIZED","OVERORGANIZES","OVERORGANIZING","OVERORNAMENT","OVERORNAMENTED","OVERORNAMENTING","OVERORNAMENTS","OVERPACKAGE","OVERPACKAGED","OVERPACKAGES","OVERPACKAGING","OVERPAID","OVERPARTICULAR","OVERPASS","OVERPASSED","OVERPASSES","OVERPASSING","OVERPAST","OVERPAY","OVERPAYING","OVERPAYMENT","OVERPAYMENTS","OVERPAYS","OVERPEDAL","OVERPEDALED","OVERPEDALING","OVERPEDALLED","OVERPEDALLING","OVERPEDALS","OVERPEOPLE","OVERPEOPLED","OVERPEOPLES","OVERPEOPLING","OVERPERSUADE","OVERPERSUADED","OVERPERSUADES","OVERPERSUADING","OVERPERSUASION","OVERPERSUASIONS","OVERPERT","OVERPLAID","OVERPLAIDED","OVERPLAIDS","OVERPLAN","OVERPLANNED","OVERPLANNING","OVERPLANS","OVERPLANT","OVERPLANTED","OVERPLANTING","OVERPLANTS","OVERPLAY","OVERPLAYED","OVERPLAYING","OVERPLAYS","OVERPLIED","OVERPLIES","OVERPLOT","OVERPLOTS","OVERPLOTTED","OVERPLOTTING","OVERPLUS","OVERPLUSES","OVERPLY","OVERPLYING","OVERPOPULATE","OVERPOPULATED","OVERPOPULATES","OVERPOPULATING","OVERPOPULATION","OVERPOPULATIONS","OVERPOTENT","OVERPOWER","OVERPOWERED","OVERPOWERING","OVERPOWERS","OVERPRAISE","OVERPRAISED","OVERPRAISES","OVERPRAISING","OVERPRECISE","OVERPRESCRIBE","OVERPRESCRIBED","OVERPRESCRIBES","OVERPRESCRIBING","OVERPRESCRIPTION","OVERPRESCRIPTIONS","OVERPRESSURE","OVERPRESSURES","OVERPRICE","OVERPRICED","OVERPRICES","OVERPRICING","OVERPRINT","OVERPRINTED","OVERPRINTING","OVERPRINTS","OVERPRIVILEGED","OVERPRIZE","OVERPRIZED","OVERPRIZES","OVERPRIZING","OVERPROCESS","OVERPROCESSED","OVERPROCESSES","OVERPROCESSING","OVERPRODUCE","OVERPRODUCED","OVERPRODUCES","OVERPRODUCING","OVERPRODUCTION","OVERPRODUCTIONS","OVERPROGRAM","OVERPROGRAMED","OVERPROGRAMING","OVERPROGRAMMED","OVERPROGRAMMING","OVERPROGRAMS","OVERPROMISE","OVERPROMISED","OVERPROMISES","OVERPROMISING","OVERPROMOTE","OVERPROMOTED","OVERPROMOTES","OVERPROMOTING","OVERPROOF","OVERPROPORTION","OVERPROPORTIONATE","OVERPROPORTIONATELY","OVERPROPORTIONED","OVERPROPORTIONING","OVERPROPORTIONS","OVERPROTECT","OVERPROTECTED","OVERPROTECTING","OVERPROTECTION","OVERPROTECTIONS","OVERPROTECTIVE","OVERPROTECTIVENESS","OVERPROTECTIVENESSES","OVERPROTECTS","OVERPUMP","OVERPUMPED","OVERPUMPING","OVERPUMPS","OVERQUALIFIED","OVERRAN","OVERRANK","OVERRASH","OVERRATE","OVERRATED","OVERRATES","OVERRATING","OVERREACH","OVERREACHED","OVERREACHER","OVERREACHERS","OVERREACHES","OVERREACHING","OVERREACT","OVERREACTED","OVERREACTING","OVERREACTION","OVERREACTIONS","OVERREACTS","OVERREFINED","OVERREFINEMENT","OVERREFINEMENTS","OVERREGULATE","OVERREGULATED","OVERREGULATES","OVERREGULATING","OVERREGULATION","OVERREGULATIONS","OVERRELIANCE","OVERRELIANCES","OVERREPORT","OVERREPORTED","OVERREPORTING","OVERREPORTS","OVERREPRESENTATION","OVERREPRESENTATIONS","OVERREPRESENTED","OVERRESPOND","OVERRESPONDED","OVERRESPONDING","OVERRESPONDS","OVERRICH","OVERRIDDEN","OVERRIDE","OVERRIDES","OVERRIDING","OVERRIFE","OVERRIGID","OVERRIPE","OVERRODE","OVERRUDE","OVERRUFF","OVERRUFFED","OVERRUFFING","OVERRUFFS","OVERRULE","OVERRULED","OVERRULES","OVERRULING","OVERRUN","OVERRUNNING","OVERRUNS","OVERSAD","OVERSALE","OVERSALES","OVERSALT","OVERSALTED","OVERSALTING","OVERSALTS","OVERSANGUINE","OVERSATURATE","OVERSATURATED","OVERSATURATES","OVERSATURATING","OVERSATURATION","OVERSATURATIONS","OVERSAUCE","OVERSAUCED","OVERSAUCES","OVERSAUCING","OVERSAVE","OVERSAVED","OVERSAVES","OVERSAVING","OVERSAW","OVERSCALE","OVERSCALED","OVERSCRUPULOUS","OVERSEA","OVERSEAS","OVERSECRETION","OVERSECRETIONS","OVERSEE","OVERSEED","OVERSEEDED","OVERSEEDING","OVERSEEDS","OVERSEEING","OVERSEEN","OVERSEER","OVERSEERS","OVERSEES","OVERSELL","OVERSELLING","OVERSELLS","OVERSENSITIVE","OVERSENSITIVENESS","OVERSENSITIVENESSES","OVERSENSITIVITIES","OVERSENSITIVITY","OVERSERIOUS","OVERSERIOUSLY","OVERSERVICE","OVERSERVICED","OVERSERVICES","OVERSERVICING","OVERSET","OVERSETS","OVERSETTING","OVERSEW","OVERSEWED","OVERSEWING","OVERSEWN","OVERSEWS","OVERSEXED","OVERSHADOW","OVERSHADOWED","OVERSHADOWING","OVERSHADOWS","OVERSHIRT","OVERSHIRTS","OVERSHOE","OVERSHOES","OVERSHOOT","OVERSHOOTING","OVERSHOOTS","OVERSHOT","OVERSHOTS","OVERSICK","OVERSIDE","OVERSIDES","OVERSIGHT","OVERSIGHTS","OVERSIMPLE","OVERSIMPLIFICATION","OVERSIMPLIFICATIONS","OVERSIMPLIFIED","OVERSIMPLIFIES","OVERSIMPLIFY","OVERSIMPLIFYING","OVERSIMPLISTIC","OVERSIMPLY","OVERSIZE","OVERSIZED","OVERSIZES","OVERSKIRT","OVERSKIRTS","OVERSLEEP","OVERSLEEPING","OVERSLEEPS","OVERSLEPT","OVERSLIP","OVERSLIPPED","OVERSLIPPING","OVERSLIPS","OVERSLIPT","OVERSLOW","OVERSMOKE","OVERSMOKED","OVERSMOKES","OVERSMOKING","OVERSOAK","OVERSOAKED","OVERSOAKING","OVERSOAKS","OVERSOFT","OVERSOLD","OVERSOLICITOUS","OVERSOON","OVERSOPHISTICATED","OVERSOUL","OVERSOULS","OVERSPECIALIZATION","OVERSPECIALIZATIONS","OVERSPECIALIZE","OVERSPECIALIZED","OVERSPECIALIZES","OVERSPECIALIZING","OVERSPECULATE","OVERSPECULATED","OVERSPECULATES","OVERSPECULATING","OVERSPECULATION","OVERSPECULATIONS","OVERSPEND","OVERSPENDER","OVERSPENDERS","OVERSPENDING","OVERSPENDS","OVERSPENT","OVERSPILL","OVERSPILLS","OVERSPIN","OVERSPINS","OVERSPREAD","OVERSPREADING","OVERSPREADS","OVERSTABILITIES","OVERSTABILITY","OVERSTAFF","OVERSTAFFED","OVERSTAFFING","OVERSTAFFS","OVERSTATE","OVERSTATED","OVERSTATEMENT","OVERSTATEMENTS","OVERSTATES","OVERSTATING","OVERSTAY","OVERSTAYED","OVERSTAYING","OVERSTAYS","OVERSTEER","OVERSTEERS","OVERSTEP","OVERSTEPPED","OVERSTEPPING","OVERSTEPS","OVERSTIMULATE","OVERSTIMULATED","OVERSTIMULATES","OVERSTIMULATING","OVERSTIMULATION","OVERSTIMULATIONS","OVERSTIR","OVERSTIRRED","OVERSTIRRING","OVERSTIRS","OVERSTOCK","OVERSTOCKED","OVERSTOCKING","OVERSTOCKS","OVERSTORIES","OVERSTORY","OVERSTRAIN","OVERSTRAINED","OVERSTRAINING","OVERSTRAINS","OVERSTRESS","OVERSTRESSED","OVERSTRESSES","OVERSTRESSING","OVERSTRETCH","OVERSTRETCHED","OVERSTRETCHES","OVERSTRETCHING","OVERSTREW","OVERSTREWED","OVERSTREWING","OVERSTREWN","OVERSTREWS","OVERSTRIDDEN","OVERSTRIDE","OVERSTRIDES","OVERSTRIDING","OVERSTRIKE","OVERSTRIKES","OVERSTRIKING","OVERSTRODE","OVERSTRUCK","OVERSTRUCTURED","OVERSTRUNG","OVERSTUFF","OVERSTUFFED","OVERSTUFFING","OVERSTUFFS","OVERSUBSCRIBE","OVERSUBSCRIBED","OVERSUBSCRIBES","OVERSUBSCRIBING","OVERSUBSCRIPTION","OVERSUBSCRIPTIONS","OVERSUBTLE","OVERSUDS","OVERSUDSED","OVERSUDSES","OVERSUDSING","OVERSUP","OVERSUPPED","OVERSUPPING","OVERSUPPLIED","OVERSUPPLIES","OVERSUPPLY","OVERSUPPLYING","OVERSUPS","OVERSURE","OVERSUSPICIOUS","OVERSWEET","OVERSWEETEN","OVERSWEETENED","OVERSWEETENING","OVERSWEETENS","OVERSWEETNESS","OVERSWEETNESSES","OVERSWING","OVERSWINGING","OVERSWINGS","OVERSWUNG","OVERTAKE","OVERTAKEN","OVERTAKES","OVERTAKING","OVERTALK","OVERTALKATIVE","OVERTALKED","OVERTALKING","OVERTALKS","OVERTAME","OVERTART","OVERTASK","OVERTASKED","OVERTASKING","OVERTASKS","OVERTAX","OVERTAXATION","OVERTAXATIONS","OVERTAXED","OVERTAXES","OVERTAXING","OVERTHIN","OVERTHINK","OVERTHINKING","OVERTHINKS","OVERTHOUGHT","OVERTHREW","OVERTHROW","OVERTHROWING","OVERTHROWN","OVERTHROWS","OVERTIGHTEN","OVERTIGHTENED","OVERTIGHTENING","OVERTIGHTENS","OVERTIME","OVERTIMED","OVERTIMES","OVERTIMING","OVERTIP","OVERTIPPED","OVERTIPPING","OVERTIPS","OVERTIRE","OVERTIRED","OVERTIRES","OVERTIRING","OVERTOIL","OVERTOILED","OVERTOILING","OVERTOILS","OVERTONE","OVERTONES","OVERTOOK","OVERTOP","OVERTOPPED","OVERTOPPING","OVERTOPS","OVERTRADE","OVERTRADED","OVERTRADES","OVERTRADING","OVERTRAIN","OVERTRAINED","OVERTRAINING","OVERTRAINS","OVERTREAT","OVERTREATED","OVERTREATING","OVERTREATMENT","OVERTREATMENTS","OVERTREATS","OVERTRICK","OVERTRICKS","OVERTRIM","OVERTRIMMED","OVERTRIMMING","OVERTRIMS","OVERTRUMP","OVERTRUMPED","OVERTRUMPING","OVERTRUMPS","OVERTURN","OVERTURNED","OVERTURNING","OVERTURNS","OVERURGE","OVERURGED","OVERURGES","OVERURGING","OVERUSE","OVERUSED","OVERUSES","OVERUSING","OVERUTILIZATION","OVERUTILIZATIONS","OVERUTILIZE","OVERUTILIZED","OVERUTILIZES","OVERUTILIZING","OVERVALUATION","OVERVALUATIONS","OVERVALUE","OVERVALUED","OVERVALUES","OVERVALUING","OVERVIEW","OVERVIEWS","OVERVIOLENT","OVERVIVID","OVERVOLTAGE","OVERVOLTAGES","OVERVOTE","OVERVOTED","OVERVOTES","OVERVOTING","OVERWARM","OVERWARMED","OVERWARMING","OVERWARMS","OVERWARY","OVERWATER","OVERWATERED","OVERWATERING","OVERWATERS","OVERWEAK","OVERWEAR","OVERWEARING","OVERWEARS","OVERWEARY","OVERWEEN","OVERWEENED","OVERWEENING","OVERWEENS","OVERWEIGH","OVERWEIGHED","OVERWEIGHING","OVERWEIGHS","OVERWEIGHT","OVERWEIGHTED","OVERWEIGHTING","OVERWEIGHTS","OVERWET","OVERWETS","OVERWETTED","OVERWETTING","OVERWHELM","OVERWHELMED","OVERWHELMING","OVERWHELMS","OVERWIDE","OVERWILY","OVERWIND","OVERWINDING","OVERWINDS","OVERWINTER","OVERWINTERED","OVERWINTERING","OVERWINTERS","OVERWISE","OVERWITHHELD","OVERWITHHOLD","OVERWITHHOLDING","OVERWITHHOLDS","OVERWORD","OVERWORDS","OVERWORE","OVERWORK","OVERWORKED","OVERWORKING","OVERWORKS","OVERWORN","OVERWOUND","OVERWRITE","OVERWRITES","OVERWRITING","OVERWRITTEN","OVERWROTE","OVERWROUGHT","OVERZEAL","OVERZEALOUS","OVERZEALOUSLY","OVERZEALOUSNESS","OVERZEALOUSNESSES","OVERZEALS","PIEBALD","PIEBALDS","PIECRUST","PIECRUSTS","PIEFORT","PIEFORTS","PIEPLANT","PIEPLANTS","PIETAS","PIETIES","PINEALS","PINEAPPLE","PINEAPPLES","PINECONE","PINECONES","PINEDROPS","PINELAND","PINELANDS","PINELIKE","PINESAP","PINESAPS","PINEWOOD","PINEWOODS","PLANARIA","PLANARIAS","PLANATE","PLANERS","PLANFORM","PLANFORMS","PLANGENT","PLANGENTLY","PLANKING","PLANKINGS","PLANLESS","PLANTABLE","PLANTAIN","PLANTAINS","PLANTAR","PLANTED","PLANTING","PLANTINGS","POOLHALL","POOLHALLS","POOLROOM","POOLROOMS","POOLSIDE","POOLSIDES","POSTABORTION","POSTACCIDENT","POSTADOLESCENT","POSTADOLESCENTS","POSTAGE","POSTAGES","POSTALLY","POSTALS","POSTAMPUTATION","POSTANAL","POSTAPOCALYPTIC","POSTARREST","POSTATOMIC","POSTATTACK","POSTAXIAL","POSTBACCALAUREATE","POSTBAG","POSTBAGS","POSTBASE","POSTBIBLICAL","POSTBOURGEOIS","POSTBOX","POSTBOXES","POSTBOY","POSTBOYS","POSTBURN","POSTCAPITALIST","POSTCARD","POSTCARDS","POSTCLASSIC","POSTCLASSICAL","POSTCODE","POSTCODES","POSTCOITAL","POSTCOLLEGE","POSTCOLLEGES","POSTCOLLEGIATE","POSTCOLONIAL","POSTCONCEPTION","POSTCONCERT","POSTCONQUEST","POSTCONSONANTAL","POSTCONVENTION","POSTCOPULATORY","POSTCORONARY","POSTCOUP","POSTCRANIAL","POSTCRANIALLY","POSTCRASH","POSTCRISES","POSTCRISIS","POSTDATE","POSTDATED","POSTDATES","POSTDATING","POSTDEADLINE","POSTDEBATE","POSTDEBUTANTE","POSTDEBUTANTES","POSTDELIVERY","POSTDEPOSITIONAL","POSTDEPRESSION","POSTDEVALUATION","POSTDILUVIAN","POSTDIVE","POSTDIVESTITURE","POSTDIVORCE","POSTDOC","POSTDOCS","POSTDOCTORAL","POSTDOCTORATE","POSTDRUG","POSTEDITING","POSTELECTION","POSTEMBRYONAL","POSTEMBRYONIC","POSTEMERGENCE","POSTEMERGENCY","POSTENCEPHALITIC","POSTEPILEPTIC","POSTERN","POSTERNS","POSTERS","POSTERUPTIVE","POSTEXERCISE","POSTEXILIC","POSTEXPERIENCE","POSTEXPERIMENTAL","POSTEXPOSURE","POSTFACE","POSTFACES","POSTFAULT","POSTFEMINIST","POSTFIRE","POSTFIX","POSTFIXED","POSTFIXES","POSTFIXING","POSTFLIGHT","POSTFORM","POSTFORMED","POSTFORMING","POSTFORMS","POSTFRACTURE","POSTFRACTURES","POSTFREEZE","POSTGAME","POSTGANGLIONIC","POSTGLACIAL","POSTGRADUATE","POSTGRADUATES","POSTGRADUATION","POSTHARVEST","POSTHASTE","POSTHASTES","POSTHEAT","POSTHEATS","POSTHEMORRHAGIC","POSTHOLE","POSTHOLES","POSTHOLIDAY","POSTHOLOCAUST","POSTHOSPITAL","POSTHYPNOTIC","POSTIMPACT","POSTIMPERIAL","POSTINAUGURAL","POSTINDEPENDENCE","POSTINDUSTRIAL","POSTINFECTION","POSTINJECTION","POSTINOCULATION","POSTINS","POSTIRRADIATION","POSTISCHEMIC","POSTISOLATION","POSTLANDING","POSTLAUNCH","POSTLIBERATION","POSTLITERATE","POSTLUDE","POSTLUDES","POSTMAN","POSTMARITAL","POSTMARK","POSTMARKED","POSTMARKING","POSTMARKS","POSTMASTECTOMY","POSTMASTER","POSTMASTERS","POSTMASTERSHIP","POSTMASTERSHIPS","POSTMATING","POSTMEDIEVAL","POSTMEN","POSTMENOPAUSAL","POSTMIDNIGHT","POSTMILLENARIAN","POSTMILLENARIANISM","POSTMILLENARIANISMS","POSTMILLENARIANS","POSTMILLENNIAL","POSTMILLENNIALISM","POSTMILLENNIALISMS","POSTMILLENNIALIST","POSTMILLENNIALISTS","POSTMISTRESS","POSTMISTRESSES","POSTMODERN","POSTMODERNISM","POSTMODERNISMS","POSTMODERNIST","POSTMODERNISTS","POSTNATAL","POSTNEONATAL","POSTNUPTIAL","POSTOPERATIVE","POSTOPERATIVELY","POSTORAL","POSTORBITAL","POSTORGASMIC","POSTPAID","POSTPOLLINATION","POSTPONE","POSTPONES","POSTPOSITION","POSTPOSITIONAL","POSTPOSITIONALLY","POSTPOSITIONS","POSTPOSITIVE","POSTPOSITIVELY","POSTPRANDIAL","POSTPRESIDENTIAL","POSTPRIMARY","POSTPRISON","POSTPRODUCTION","POSTPRODUCTIONS","POSTPSYCHOANALYTIC","POSTPUBERTY","POSTPUBESCENT","POSTRACE","POSTRECESSION","POSTRESURRECTION","POSTRESURRECTIONS","POSTRETIREMENT","POSTREVOLUTIONARY","POSTRIOT","POSTROMANTIC","POSTSCRIPT","POSTSCRIPTS","POSTSEASON","POSTSEASONS","POSTSECONDARY","POSTSHOW","POSTSTIMULATION","POSTSTIMULATORY","POSTSTIMULUS","POSTSTRIKE","POSTSURGICAL","POSTSYNAPTIC","POSTSYNAPTICALLY","POSTSYNC","POSTSYNCED","POSTSYNCING","POSTSYNCS","POSTTAX","POSTTEEN","POSTTENSION","POSTTENSIONED","POSTTENSIONING","POSTTENSIONS","POSTTEST","POSTTESTS","POSTTRANSCRIPTIONAL","POSTTRANSFUSION","POSTTRANSLATIONAL","POSTTRAUMATIC","POSTTREATMENT","POSTTRIAL","POSTVACCINAL","POSTVACCINATION","POSTVAGOTOMY","POSTVASECTOMY","POSTVOCALIC","POSTWAR","POSTWEANING","POSTWORKSHOP","POURABLE","POURERS","POURPOINT","POURPOINTS","PRICELESS","RUNABOUT","RUNAGATE","RUNAGATES","RUNAROUND","RUNAWAY","RUNBACK","RUNBACKS","RUNDOWN","RUNDOWNS","RUNLESS","RUNLET","RUNLETS","RUNOFF","RUNOFFS","RUNOUT","RUNOUTS","RUNOVER","RUNOVERS","RUNROUND","RUNROUNDS","RUNTIER","RUNWAY","RUNWAYS","SALEABLE","SALEABLY","SALEROOM","SALEROOMS","SANDALS","SANDBAG","SANDBAGGED","SANDBAGGER","SANDBAGGERS","SANDBAGGING","SANDBAGS","SANDBANK","SANDBANKS","SANDBAR","SANDBARS","SANDBLAST","SANDBLASTED","SANDBLASTER","SANDBLASTERS","SANDBLASTING","SANDBLASTS","SANDBOX","SANDBOXES","SANDBUR","SANDBURR","SANDBURRS","SANDBURS","SANDDAB","SANDDABS","SANDERS","SANDFISH","SANDFISHES","SANDFLIES","SANDFLY","SANDGLASS","SANDGLASSES","SANDGROUSE","SANDGROUSES","SANDHIS","SANDHOG","SANDHOGS","SANDLIKE","SANDLING","SANDLINGS","SANDLOT","SANDLOTS","SANDMAN","SANDMEN","SANDPAINTING","SANDPAINTINGS","SANDPAPER","SANDPAPERED","SANDPAPERING","SANDPAPERS","SANDPAPERY","SANDPEEP","SANDPEEPS","SANDPILE","SANDPILES","SANDPIPER","SANDPIPERS","SANDPIT","SANDPITS","SANDSHOE","SANDSHOES","SANDSOAP","SANDSOAPS","SANDSPUR","SANDSPURS","SANDSTONE","SANDSTONES","SANDSTORM","SANDSTORMS","SANDWICH","SANDWICHES","SANDWORM","SANDWORMS","SANDWORT","SANDWORTS","SHIFTABLE","SHIFTERS","SHIFTLESS","SHIPBOARD","SHIPBOARDS","SHIPBORNE","SHIPBUILDER","SHIPBUILDERS","SHIPBUILDING","SHIPBUILDINGS","SHIPFITTER","SHIPFITTERS","SHIPLAP","SHIPLAPS","SHIPLOAD","SHIPLOADS","SHIPMAN","SHIPMASTER","SHIPMASTERS","SHIPMATE","SHIPMATES","SHIPMEN","SHIPOWNER","SHIPOWNERS","SHIPPED","SHIPPEN","SHIPPENS","SHIPPER","SHIPPING","SHIPPINGS","SHIPPONS","SHIPSHAPE","SHIPSIDE","SHIPSIDES","SHIPWAY","SHIPWAYS","SHIPWORM","SHIPWORMS","SHIPWRECK","SHIPWRECKED","SHIPWRECKING","SHIPWRECKS","SHIPWRIGHT","SHIPWRIGHTS","SHIPYARD","SHIPYARDS","SHOOTERS","SHOOTOUT","SHOOTOUTS","SIDEARM","SIDEBAND","SIDEBANDS","SIDEBAR","SIDEBARS","SIDEBOARD","SIDEBOARDS","SIDEBURNED","SIDEBURNS","SIDECAR","SIDECARS","SIDEDRESS","SIDEDRESSES","SIDEHILL","SIDEHILLS","SIDEKICK","SIDEKICKS","SIDELIGHT","SIDELIGHTS","SIDELINE","SIDELINED","SIDELINER","SIDELINERS","SIDELINES","SIDELING","SIDELINING","SIDELONG","SIDEMAN","SIDEMEN","SIDEPIECE","SIDEPIECES","SIDEREAL","SIDERITE","SIDERITES","SIDESADDLE","SIDESADDLES","SIDESHOW","SIDESHOWS","SIDESLIP","SIDESLIPPED","SIDESLIPPING","SIDESLIPS","SIDESPIN","SIDESPINS","SIDESPLITTING","SIDESTEP","SIDESTEPPED","SIDESTEPPER","SIDESTEPPERS","SIDESTEPPING","SIDESTEPS","SIDESTREAM","SIDESTROKE","SIDESTROKES","SIDESWIPE","SIDESWIPED","SIDESWIPES","SIDESWIPING","SIDETRACK","SIDETRACKED","SIDETRACKING","SIDETRACKS","SIDEWALK","SIDEWALKS","SIDEWALL","SIDEWALLS","SIDEWARD","SIDEWARDS","SIDEWAY","SIDEWAYS","SIDEWINDER","SIDEWINDERS","SIDEWISE","SPRINGALS","SPRINGBOARD","SPRINGBOARDS","SPRINGERS","SPRINGHEAD","SPRINGHEADS","SPRINGHOUSE","SPRINGHOUSES","SPRINGLIKE","SPRINGTAIL","SPRINGTAILS","SPRINGTIDE","SPRINGTIDES","SPRINGTIME","SPRINGTIMES","SPRINGWATER","SPRINGWATERS","SPRINGWOOD","SPRINGWOODS","STEPBROTHER","STEPBROTHERS","STEPCHILD","STEPCHILDREN","STEPDAME","STEPDAMES","STEPDAUGHTER","STEPDAUGHTERS","STEPFAMILIES","STEPFAMILY","STEPFATHER","STEPFATHERS","STEPLADDER","STEPLADDERS","STEPLIKE","STEPMOTHER","STEPMOTHERS","STEPPARENT","STEPPARENTING","STEPPARENTINGS","STEPPARENTS","STEPPED","STEPPER","STEPPES","STEPPING","STEPSISTER","STEPSISTERS","STEPSON","STEPSONS","STEPWISE","STICKBALL","STICKBALLS","STICKERS","STICKHANDLE","STICKHANDLED","STICKHANDLER","STICKHANDLERS","STICKHANDLES","STICKHANDLING","STICKLED","STICKLIKE","STICKLING","STICKMAN","STICKMEN","STICKOUT","STICKOUTS","STICKPIN","STICKPINS","STICKSEED","STICKSEEDS","STICKTIGHT","STICKTIGHTS","STICKUPS","STICKWEED","STICKWEEDS","STICKWORK","STICKWORKS","STOPBANK","STOPBANKS","STOPCOCK","STOPCOCKS","STOPERS","STOPGAP","STOPGAPS","STOPLIGHT","STOPLIGHTS","STOPOVER","STOPOVERS","STOPPAGE","STOPPAGES","STOPPED","STOPPER","STOPPING","STOPPLED","STOPWATCH","STOPWATCHES","TABLECLOTH","TABLECLOTHS","TABLELAND","TABLELANDS","TABLEMATE","TABLEMATES","TABLESPOON","TABLESPOONFUL","TABLESPOONFULS","TABLESPOONS","TABLESPOONSFUL","TABLETED","TABLETING","TABLETOP","TABLETOPS","TABLEWARE","TABLEWARES","TAGALONG","TAGBOARD","TAGBOARDS","TAGGED","TAGLIKE","TAGRAG","TAGRAGS","TAPELESS","TAPELIKE","TAPELINE","TAPELINES","TAPERED","TAPERING","TAPEWORM","TAPEWORMS","TEAMMATE","TEAMMATES","TEAMWORK","TEAMWORKS","TOPAZINE","TOPCOAT","TOPCOATS","TOPCROSS","TOPCROSSES","TOPDRESSING","TOPDRESSINGS","TOPERS","TOPFLIGHT","TOPFULL","TOPGALLANT","TOPGALLANTS","TOPHES","TOPKICK","TOPKICKS","TOPKNOT","TOPKNOTS","TOPLESS","TOPLINE","TOPLINES","TOPLOFTIER","TOPLOFTIEST","TOPLOFTILY","TOPLOFTINESS","TOPLOFTINESSES","TOPLOFTY","TOPMAST","TOPMASTS","TOPMINNOW","TOPMINNOWS","TOPMOST","TOPNOTCH","TOPNOTCHER","TOPNOTCHERS","TOPOLOGIES","TOPOLOGIST","TOPOLOGISTS","TOPOLOGY","TOPPED","TOPPER","TOPPING","TOPPINGS","TOPPLED","TOPSAIL","TOPSAILS","TOPSIDE","TOPSIDES","TOPSOIL","TOPSOILED","TOPSOILING","TOPSOILS","TOPSPIN","TOPSPINS","TOPSTITCH","TOPSTITCHED","TOPSTITCHES","TOPSTITCHING","TOPSTONE","TOPSTONES","TOPWORK","TOPWORKED","TOPWORKING","TOPWORKS","TOWNFOLK","TOWNHOME","TOWNHOMES","TOWNHOUSE","TOWNHOUSES","TOWNLESS","TOWNLET","TOWNLETS","TOWNSCAPE","TOWNSCAPES","TOWNSHIP","TOWNSHIPS","TOWNWEAR","TRAPBALL","TRAPBALLS","TRAPDOOR","TRAPDOORS","TRAPESES","TRAPLIKE","TRAPLINE","TRAPLINES","TRAPNEST","TRAPNESTED","TRAPNESTING","TRAPNESTS","TRAPPEAN","TRAPPED","TRAPPER","TRAPPING","TRAPPINGS","TRAPPOSE","TRAPROCK","TRAPROCKS","TRAPSHOOTER","TRAPSHOOTERS","TRAPSHOOTING","TRAPSHOOTINGS","TRAPUNTO","TURNABLE","TURNABOUT","TURNAROUND","TURNBUCKLE","TURNBUCKLES","TURNCOAT","TURNCOATS","TURNDOWN","TURNDOWNS","TURNERS","TURNHALL","TURNHALLS","TURNKEY","TURNKEYS","TURNOFF","TURNOFFS","TURNOUT","TURNOUTS","TURNOVER","TURNOVERS","TURNPIKE","TURNPIKES","TURNSOLE","TURNSOLES","TURNSPIT","TURNSPITS","TURNSTILE","TURNSTILES","TURNSTONE","TURNSTONES","TURNTABLE","TURNTABLES","TURNUPS","UPBEAR","UPBEARER","UPBEARERS","UPBEARING","UPBEARS","UPBEAT","UPBEATS","UPBIND","UPBINDING","UPBINDS","UPBOIL","UPBOILED","UPBOILING","UPBOILS","UPBORE","UPBORNE","UPBOUND","UPBOW","UPBOWS","UPBRAID","UPBRAIDED","UPBRAIDER","UPBRAIDERS","UPBRAIDING","UPBRAIDS","UPBRINGING","UPBUILD","UPBUILDING","UPBUILDS","UPBUILT","UPBYE","UPCAST","UPCASTING","UPCASTS","UPCHUCK","UPCHUCKED","UPCHUCKING","UPCHUCKS","UPCLIMB","UPCLIMBED","UPCLIMBING","UPCLIMBS","UPCOAST","UPCOIL","UPCOILED","UPCOILING","UPCOILS","UPCOMING","UPCOUNTRY","UPCURL","UPCURLED","UPCURLING","UPCURLS","UPCURVE","UPCURVED","UPCURVES","UPCURVING","UPDART","UPDARTED","UPDARTING","UPDARTS","UPDATE","UPDATED","UPDATER","UPDATERS","UPDATES","UPDATING","UPDIVE","UPDIVED","UPDIVES","UPDIVING","UPDOS","UPDOVE","UPDRAFT","UPDRAFTS","UPDRIED","UPDRIES","UPDRY","UPDRYING","UPEND","UPENDED","UPENDING","UPENDS","UPFIELD","UPFLING","UPFLINGING","UPFLINGS","UPFLOW","UPFLOWED","UPFLOWING","UPFLOWS","UPFLUNG","UPFOLD","UPFOLDED","UPFOLDING","UPFOLDS","UPFRONT","UPGATHER","UPGATHERED","UPGATHERING","UPGATHERS","UPGAZE","UPGAZED","UPGAZES","UPGAZING","UPGIRD","UPGIRDED","UPGIRDING","UPGIRDS","UPGIRT","UPGOING","UPGRADABLE","UPGRADE","UPGRADED","UPGRADES","UPGRADING","UPGREW","UPGROW","UPGROWING","UPGROWN","UPGROWS","UPGROWTH","UPGROWTHS","UPHEAP","UPHEAPED","UPHEAPING","UPHEAPS","UPHEAVE","UPHEAVED","UPHEAVER","UPHEAVERS","UPHEAVES","UPHEAVING","UPHELD","UPHILL","UPHILLS","UPHOARD","UPHOARDED","UPHOARDING","UPHOARDS","UPHOLD","UPHOLDER","UPHOLDERS","UPHOLDING","UPHOLDS","UPHOLSTER","UPHOLSTERED","UPHOLSTERING","UPHOLSTERS","UPHOVE","UPKEEP","UPKEEPS","UPLAND","UPLANDER","UPLANDERS","UPLANDS","UPLEAP","UPLEAPED","UPLEAPING","UPLEAPS","UPLEAPT","UPLIFT","UPLIFTED","UPLIFTER","UPLIFTERS","UPLIFTING","UPLIFTS","UPLIGHT","UPLIGHTED","UPLIGHTING","UPLIGHTS","UPLINK","UPLINKS","UPLIT","UPLOAD","UPLOADED","UPLOADING","UPLOADS","UPMARKET","UPMOST","UPPED","UPPER","UPPILE","UPPILED","UPPILES","UPPILING","UPPING","UPPINGS","UPPISH","UPPITY","UPPROP","UPPROPPED","UPPROPPING","UPPROPS","UPRAISE","UPRAISED","UPRAISER","UPRAISERS","UPRAISES","UPRAISING","UPRATE","UPRATED","UPRATES","UPRATING","UPREACH","UPREACHED","UPREACHES","UPREACHING","UPREAR","UPREARED","UPREARING","UPREARS","UPRIGHT","UPRIGHTED","UPRIGHTING","UPRIGHTLY","UPRIGHTNESS","UPRIGHTNESSES","UPRIGHTS","UPRISE","UPRISEN","UPRISER","UPRISERS","UPRISES","UPRISING","UPRISINGS","UPRIVER","UPRIVERS","UPROAR","UPROARS","UPROOT","UPROOTED","UPROOTEDNESS","UPROOTEDNESSES","UPROOTER","UPROOTERS","UPROOTING","UPROOTS","UPROSE","UPROUSE","UPROUSED","UPROUSES","UPROUSING","UPRUSH","UPRUSHED","UPRUSHES","UPRUSHING","UPSCALE","UPSCALED","UPSCALES","UPSCALING","UPSEND","UPSENDING","UPSENDS","UPSENT","UPSET","UPSETS","UPSETTER","UPSETTERS","UPSETTING","UPSHIFT","UPSHIFTED","UPSHIFTING","UPSHIFTS","UPSHOOT","UPSHOOTING","UPSHOOTS","UPSHOT","UPSHOTS","UPSIDE","UPSIDES","UPSOAR","UPSOARED","UPSOARING","UPSOARS","UPSPRANG","UPSPRING","UPSPRINGING","UPSPRINGS","UPSPRUNG","UPSTAGE","UPSTAGED","UPSTAGES","UPSTAGING","UPSTAIR","UPSTAIRS","UPSTAND","UPSTANDING","UPSTANDS","UPSTARE","UPSTARED","UPSTARES","UPSTARING","UPSTART","UPSTARTED","UPSTARTING","UPSTARTS","UPSTATE","UPSTATER","UPSTATERS","UPSTATES","UPSTEP","UPSTEPPED","UPSTEPPING","UPSTEPS","UPSTIR","UPSTIRRED","UPSTIRRING","UPSTIRS","UPSTOOD","UPSTREAM","UPSTROKE","UPSTROKES","UPSURGE","UPSURGED","UPSURGES","UPSURGING","UPSWEEP","UPSWEEPING","UPSWEEPS","UPSWELL","UPSWELLED","UPSWELLING","UPSWELLS","UPSWEPT","UPSWING","UPSWINGING","UPSWINGS","UPSWOLLEN","UPSWUNG","UPTAKE","UPTAKES","UPTEAR","UPTEARING","UPTEARS","UPTHREW","UPTHROW","UPTHROWING","UPTHROWN","UPTHROWS","UPTHRUST","UPTHRUSTING","UPTHRUSTS","UPTICK","UPTICKS","UPTIGHT","UPTIGHTNESS","UPTIGHTNESSES","UPTILT","UPTILTED","UPTILTING","UPTILTS","UPTIME","UPTIMES","UPTORE","UPTORN","UPTOSS","UPTOSSED","UPTOSSES","UPTOSSING","UPTOWN","UPTOWNS","UPTREND","UPTRENDS","UPTURN","UPTURNED","UPTURNING","UPTURNS","UPWAFT","UPWAFTED","UPWAFTING","UPWAFTS","UPWARD","UPWARDS","UPWELL","UPWELLED","UPWELLING","UPWELLS","UPWIND","UPWINDS","WALKABLE","WALKABOUT","WALKAWAY","WALKERS","WALKOUT","WALKOUTS","WALKOVER","WALKOVERS","WALKUPS","WALKWAY","WALKWAYS","WALLABY","WALLBOARD","WALLBOARDS","WALLEYE","WALLEYED","WALLEYES","WALLFLOWER","WALLFLOWERS","WALLOPED","WALLOPING","WALLOPS","WALLOWED","WALLOWING","WALLPAPER","WALLPAPERED","WALLPAPERING","WALLPAPERS","WORKABILITIES","WORKABILITY","WORKABLE","WORKBAG","WORKBAGS","WORKBASKET","WORKBASKETS","WORKBENCH","WORKBENCHES","WORKBOAT","WORKBOATS","WORKBOOK","WORKBOOKS","WORKBOX","WORKBOXES","WORKDAY","WORKDAYS","WORKERS","WORKFARE","WORKFARES","WORKFOLK","WORKFOLKS","WORKFORCE","WORKFORCES","WORKHORSE","WORKHORSES","WORKHOUSE","WORKHOUSES","WORKLESS","WORKLOAD","WORKLOADS","WORKMAN","WORKMANLIKE","WORKMANLY","WORKMATE","WORKMATES","WORKMEN","WORKOUT","WORKOUTS","WORKPEOPLE","WORKPIECE","WORKPIECES","WORKPLACE","WORKPLACES","WORKROOM","WORKROOMS","WORKSHEET","WORKSHEETS","WORKSHOP","WORKSHOPS","WORKSTATION","WORKSTATIONS","WORKTABLE","WORKTABLES","WORKUPS","WORKWEEK","WORKWEEKS","WORKWOMAN","WORKWOMEN","YARDAGE","YARDAGES","YARDARM","YARDARMS","YARDBIRD","YARDBIRDS","YARDLAND","YARDLANDS","YARDMAN","YARDMASTER","YARDMASTERS","YARDMEN","YARDSTICK","YARDSTICKS","YARDWAND","YARDWANDS","YARDWORK","YARDWORKS"]);

  const OPEN_COMPOUND_COLLOCATIONS = new Set(["BOX+TRUCK","BUTTER+FORK","BUTTER+KNIFE","BUTTER+PLATE","COFFEE+BEAN","COFFEE+MUG","COFFEE+SHOP","DOG+BONE","DOG+BOWL","DOG+COLLAR","DOG+KENNEL","DOG+LEASH","DOG+PARK","DOOR+FRAME","DOOR+KNOB","DOOR+LOCK","JUICE+CUP","LIGHT+HOUR","LIGHT+SECOND","PARK+BENCH","PEANUT+OIL","PEANUT+SAUCE","PEANUT+SHELL","POOL+BENCH","POOL+CHAIR","SCOTCH+WHISKEY","SHARK+CAGE","SHARK+FIN","SHARK+POOL","TABLE+CLOCK","TABLE+EDGE","TABLE+LAMP","TABLE+VASE","WATER+CUP","WHISKEY+SCOTCH"]);

  function normalizeToken(word) {
    return String(word || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
  }

  function validateDecoyPair(stemWord, correctWord, decoyWord) {
    const s = normalizeToken(stemWord);
    const c = normalizeToken(correctWord);
    const d = normalizeToken(decoyWord);

    if (!s || !c || !d) {
      return { valid: false, reason: 'Missing stem, correct, or decoy word.' };
    }
    if (c === d) {
      return { valid: false, reason: 'Decoy word cannot match the correct word.' };
    }
    if (d === s) {
      return { valid: false, reason: 'Decoy word cannot match the stem word.' };
    }

    const candidates = [
      `${s}${d}`,
      `${d}${s}`,
      `${s}${d}S`,
      `${d}${s}S`,
      `${s}S${d}`,
      `${s}ING${d}`
    ];

    for (let i = 0; i < candidates.length; i++) {
      if (KNOWN_FORWARD_COMPOUNDS.has(candidates[i])) {
        return {
          valid: false,
          reason: `Closed/Inflected Compound Collision: "${s} + ${d}" forms "${candidates[i]}"`
        };
      }
    }

    if (OPEN_COMPOUND_COLLOCATIONS.has(`${s}+${d}`) || OPEN_COMPOUND_COLLOCATIONS.has(`${d}+${s}`)) {
      return {
        valid: false,
        reason: `Open Compound Collocation Collision: "${s} ${d}" is a common 2-word open compound!`
      };
    }

    return { valid: true, reason: 'Clean cross-domain decoy — zero compound ambiguity.' };
  }

  function pickSafeDecoyFromPool(stemWord, correctWord, pool, fallback) {
    if (Array.isArray(pool) && pool.length > 0) {
      const validCandidates = pool.filter((cand) => validateDecoyPair(stemWord, correctWord, cand).valid);
      const source = validCandidates.length > 0 ? validCandidates : pool;
      return source[Math.floor(Math.random() * source.length)];
    }
    return fallback || 'BLOUSE';
  }

  function createDynamicPuzzleNodes(vineBlueprint, options = {}) {
    if (!vineBlueprint) return [];
    let lastSide = -1;
    let sameSideStreak = 0;

    function pickDynamicSide() {
      let side = Math.random() < 0.5 ? 0 : 1;
      if (side === lastSide) {
        sameSideStreak += 1;
        if (sameSideStreak >= 3) {
          side = 1 - side;
          sameSideStreak = 1;
        }
      } else {
        sameSideStreak = 1;
      }
      lastSide = side;
      return side;
    }

    const baseSetIdx = Number.isInteger(vineBlueprint.themeIndex)
      ? vineBlueprint.themeIndex
      : Number.isInteger(vineBlueprint.chainSetIndex)
        ? vineBlueprint.chainSetIndex
        : 0;
    const canonicalVine =
      PRODUCTION_DAILY_VINES[
        ((baseSetIdx % PRODUCTION_DAILY_VINES.length) + PRODUCTION_DAILY_VINES.length) %
          PRODUCTION_DAILY_VINES.length
      ] || PRODUCTION_DAILY_VINES[0];

    const sourceNodes =
      Array.isArray(vineBlueprint.nodes) &&
      vineBlueprint.nodes.length > 0 &&
      vineBlueprint.nodes.some((n) => n && n.isReverseGraft)
        ? vineBlueprint.nodes
        : canonicalVine.nodes;

    return sourceNodes.map((node, idx) => {
      const side = pickDynamicSide();
      if (node.isReverseGraft) {
        const trapPool =
          Array.isArray(node.decoyPool) && node.decoyPool.length > 0
            ? node.decoyPool
            : [node.decoyWord];
        const chosenTrap =
          attemptCount === 0
            ? node.decoyWord || trapPool[0]
            : trapPool[attemptCount % trapPool.length] || node.decoyWord;
        return {
          ...node,
          index: idx,
          decoyWord: chosenTrap,
          explanation: `Reverse-Graft Loop (⬅): ${node.correctWord} goes IN FRONT of ${node.stemWord} (${node.correctWord} + ${node.stemWord}). Resist the forward trap ${node.stemWord} + ${chosenTrap}!`,
          leftRightSeed: side
        };
      }
      const chosenDecoy = pickSafeDecoyFromPool(
        node.stemWord,
        node.correctWord,
        node.decoyPool || [node.decoyWord]
      );
      return {
        ...node,
        index: idx,
        decoyWord: chosenDecoy,
        leftRightSeed: side
      };
    });
  }

  /**
   * Computes the rotating 0..11 theme index and daily vine number for any YYYY-MM-DD dateKey
   * Epoch: 2026-11-06 = Theme Index 0 (Sweet Tooth & Kitchen Table)
   */
  function getRotationForDate(dateKey, totalThemes = 12) {
    const epochMs = Date.UTC(2026, 10, 6); // 2026-11-06T00:00:00Z -> Theme 0 today!
    let targetMs = Date.now();
    let normDate = new Date().toISOString().slice(0, 10);
    if (dateKey && /^\d{4}-\d{2}-\d{2}/.test(String(dateKey))) {
      normDate = String(dateKey).slice(0, 10);
      const parsed = Date.parse(`${normDate}T00:00:00Z`);
      if (!Number.isNaN(parsed)) targetMs = parsed;
    } else {
      const parsed = Date.parse(`${normDate}T00:00:00Z`);
      if (!Number.isNaN(parsed)) targetMs = parsed;
    }
    const dayOffset = Math.round((targetMs - epochMs) / 86400000);
    const themeIndex = ((dayOffset % totalThemes) + totalThemes) % totalThemes;
    const vineNumber = 147 + dayOffset;
    return { dateKey: normDate, dayOffset, themeIndex, vineNumber };
  }

  function getDailyVineForDate(dateKey, vinesArray = PRODUCTION_DAILY_VINES) {
    const list = Array.isArray(vinesArray) && vinesArray.length > 0 ? vinesArray : PRODUCTION_DAILY_VINES;
    const rot = getRotationForDate(dateKey, list.length);
    const template = list[rot.themeIndex] || list[0];
    return {
      ...template,
      vineNumber: rot.vineNumber,
      dateKey: rot.dateKey
    };
  }

  function validateEntireVine(vine) {
    if (!vine || !Array.isArray(vine.nodes)) return [];
    const results = [];
    for (let i = 0; i < vine.nodes.length; i++) {
      const node = vine.nodes[i];
      const check = validateDecoyPair(node.stemWord, node.correctWord, node.decoyWord);
      let chainContinuityOk = true;
      let continuityWarning = '';
      if (i > 0) {
        const prev = vine.nodes[i - 1];
        if (normalizeToken(prev.correctWord) !== normalizeToken(node.stemWord)) {
          chainContinuityOk = false;
          continuityWarning = `Chain break: Node ${i} correctWord (${prev.correctWord}) != Node ${i + 1} stemWord (${node.stemWord})`;
        }
      }
      results.push({
        nodeIndex: i,
        valid: check.valid && chainContinuityOk,
        decoyValid: check.valid,
        chainContinuityOk,
        reason: !check.valid ? check.reason : continuityWarning || check.reason
      });
    }
    return results;
  }

  return {
    LEXICON_VERSION,
    DAILY_THEMES,
    ZONE1_TRIPLET_CHAINS,
    ZONE2_AND_3_CHAINS,
    PRODUCTION_DAILY_VINES,
    KNOWN_FORWARD_COMPOUNDS,
    OPEN_COMPOUND_COLLOCATIONS,
    createDynamicPuzzleNodes,
    getRotationForDate,
    getDailyVineForDate,
    pickSafeDecoyFromPool,
    validateDecoyPair,
    validateEntireVine,
    validateVineChain: validateEntireVine
  };
});
