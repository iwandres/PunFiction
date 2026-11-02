/**
 * Word Vine — Mega Compound Lexicon (480 Playable Steps • 1,920 Cross-Domain Foil Decoys • 7,225 Blocked Collisions)
 * - 12 Full Linked 3-Part Compound Chains (48 3-Part Compound Words = 144 Zone 1 Steps)
 * - 12 Full Zone 2 + Zone 3 Chains (192 Zone 2 Pivot Compounds + 144 Zone 3 Particle Sprint Compounds)
 * - 4-Layer Anti-Compound Decoy Guardrail (1,920 cross-domain rhyme/lookalike decoys + 7,190 ENABLE compounds + open compound filter)
 * - Dynamic Left/Right placement + fresh decoy sampling + chain rotation on every replay
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WordVineData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const LEXICON_VERSION = 'v6_mega_compound_graph';

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
      "part3Hint": "BUTTER + CUP = Buttercup (\ud83c\udf38 3-Part Compound Complete!)",
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
        "nextPart1": "COFFEE",
        "connection": "Drinkware Link (Cup -> Coffee)",
        "hint": "CUP \u2194 COFFEE = Coffee cup",
        "decoys": [
          "TOFFEE",
          "TROPHY",
          "DOLPHIN",
          "COFFIN"
        ]
      }
    },
    {
      "id": "coffee_table_book",
      "parts": [
        "COFFEE",
        "TABLE",
        "BOOK"
      ],
      "part2Hint": "COFFEE + TABLE = Coffee table",
      "part3Hint": "TABLE + BOOK = Table book (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "FABLE",
        "CABLE",
        "GABLE",
        "SABLE"
      ],
      "part3Decoys": [
        "BROOK",
        "CROOK",
        "ROOK",
        "SHOOK"
      ],
      "thematicLink": {
        "nextPart1": "MATCH",
        "connection": "Matchbook Link (Book -> Match)",
        "hint": "BOOK \u2194 MATCH = Matchbook",
        "decoys": [
          "HATCH",
          "LATCH",
          "THATCH",
          "SNATCH"
        ]
      }
    },
    {
      "id": "match_box_car",
      "parts": [
        "MATCH",
        "BOX",
        "CAR"
      ],
      "part2Hint": "MATCH + BOX = Matchbox",
      "part3Hint": "BOX + CAR = Boxcar (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "FOX",
        "OX",
        "PHLOX",
        "PARADOX"
      ],
      "part3Decoys": [
        "SCAR",
        "CZAR",
        "GUITAR",
        "RADAR"
      ],
      "thematicLink": {
        "nextPart1": "POOL",
        "connection": "Carpool Link (Car -> Pool)",
        "hint": "CAR + POOL = Carpool",
        "decoys": [
          "SPOOL",
          "DROOL",
          "FOOL",
          "GHOUL"
        ]
      }
    },
    {
      "id": "pool_table_top",
      "parts": [
        "POOL",
        "TABLE",
        "TOP"
      ],
      "part2Hint": "POOL + TABLE = Pool table",
      "part3Hint": "TABLE + TOP = Tabletop (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Zone 2 Bridge (Top -> Dog)",
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
      "part3Hint": "FLOWER + POT = Flowerpot (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Pot -> Belly)",
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
      "part3Hint": "BUTTON + HOLE = Buttonhole (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Tool Link (Hole -> Punch)",
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
      "part3Hint": "BOWL + CUT = Bowl cut (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Cut -> Back)",
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
      "part3Hint": "STAGE + COACH = Stagecoach (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Zone 2 Bridge (Coach -> Class)",
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
      "part3Hint": "BALL + PARK = Ballpark (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Setting Link (Park -> Bench)",
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
      "part3Hint": "MARK + DOWN = Markdown (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Down -> Town)",
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
      "part3Hint": "HOUSE + BOAT = Houseboat (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Boat -> Show)",
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
      "part3Hint": "CASE + WORK = Casework (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Zone 2 Bridge (Work -> Horse)",
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
      "part3Hint": "PLACE + MAT = Placemat (\ud83c\udf38 3-Part Compound Complete!)",
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
        "nextPart1": "BATH",
        "connection": "Household Link (Mat -> Bath)",
        "hint": "MAT \u2194 BATH = Bathmat",
        "decoys": [
          "WRATH",
          "MATH",
          "MOTH",
          "BROTH"
        ]
      }
    },
    {
      "id": "bath_robe_hook",
      "parts": [
        "BATH",
        "ROBE",
        "HOOK"
      ],
      "part2Hint": "BATH + ROBE = Bathrobe",
      "part3Hint": "ROBE + HOOK = Robe hook (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "GLOBE",
        "PROBE",
        "LOBE",
        "STROBE"
      ],
      "part3Decoys": [
        "BROOK",
        "CROOK",
        "ROOK",
        "SHOOK"
      ],
      "thematicLink": {
        "nextPart1": "FISH",
        "connection": "Angling Link (Hook -> Fish)",
        "hint": "HOOK \u2194 FISH = Fishhook",
        "decoys": [
          "DISH",
          "WISH",
          "SWISH",
          "QUICHE"
        ]
      }
    },
    {
      "id": "fish_net_work",
      "parts": [
        "FISH",
        "NET",
        "WORK"
      ],
      "part2Hint": "FISH + NET = Fishnet",
      "part3Hint": "NET + WORK = Network (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "JET",
        "PET",
        "VET",
        "FRET"
      ],
      "part3Decoys": [
        "SMIRK",
        "QUIRK",
        "CLERK",
        "PERK"
      ],
      "thematicLink": {
        "nextPart1": "DAY",
        "connection": "Compound Link (Work -> Day)",
        "hint": "WORK + DAY = Workday",
        "decoys": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ]
      }
    },
    {
      "id": "day_dream_boat",
      "parts": [
        "DAY",
        "DREAM",
        "BOAT"
      ],
      "part2Hint": "DAY + DREAM = Daydream",
      "part3Hint": "DREAM + BOAT = Dreamboat (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "CREAM",
        "STEAM",
        "GLEAM",
        "SEAM"
      ],
      "part3Decoys": [
        "GOAT",
        "MOAT",
        "THROAT",
        "GLOAT"
      ],
      "thematicLink": {
        "nextPart1": "DOG",
        "connection": "Zone 2 Bridge (Boat -> Dog)",
        "hint": "BOAT \u2194 DOG = Sea dog",
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
      "part3Hint": "SHAKE + DOWN = Shakedown (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Down -> Time)",
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
      "id": "time_clock_tower",
      "parts": [
        "TIME",
        "CLOCK",
        "TOWER"
      ],
      "part2Hint": "TIME + CLOCK = Time clock",
      "part3Hint": "CLOCK + TOWER = Clock tower (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "FLOCK",
        "SMOCK",
        "CROCK",
        "SHOCK"
      ],
      "part3Decoys": [
        "FLOWER",
        "CHOWDER",
        "POWDER",
        "COWARD"
      ],
      "thematicLink": {
        "nextPart1": "BRIDGE",
        "connection": "Landmark Link (Tower -> Bridge)",
        "hint": "TOWER + BRIDGE = Tower Bridge",
        "decoys": [
          "FRIDGE",
          "RIDGE",
          "MIDGE",
          "PORRIDGE"
        ]
      }
    },
    {
      "id": "bridge_work_shop",
      "parts": [
        "BRIDGE",
        "WORK",
        "SHOP"
      ],
      "part2Hint": "BRIDGE + WORK = Bridgework",
      "part3Hint": "WORK + SHOP = Workshop (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "SMIRK",
        "QUIRK",
        "CLERK",
        "PERK"
      ],
      "part3Decoys": [
        "MOP",
        "CHOP",
        "CROP",
        "PLOP"
      ],
      "thematicLink": {
        "nextPart1": "KEEPER",
        "connection": "Compound Link (Shop -> Keeper)",
        "hint": "SHOP + KEEPER = Shopkeeper",
        "decoys": [
          "LEPER",
          "STEPPER",
          "ZIPPER",
          "SLIPPER"
        ]
      }
    },
    {
      "id": "keeper_bee_hive",
      "parts": [
        "KEEPER",
        "BEE",
        "HIVE"
      ],
      "part2Hint": "KEEPER \u2194 BEE = Beekeeper",
      "part3Hint": "BEE + HIVE = Beehive (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "SKI",
        "FLEA",
        "PEA",
        "TEA"
      ],
      "part3Decoys": [
        "DIVE",
        "CHIVE",
        "FIVE",
        "DRIVE"
      ],
      "thematicLink": {
        "nextPart1": "WATER",
        "connection": "Zone 2 Bridge (Hive -> Water)",
        "hint": "HIVE \u2194 WATER = Honeywater",
        "decoys": [
          "OTTER",
          "POTTER",
          "TROTTER",
          "BLOTTER"
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
      "part3Hint": "MELON + SEED = Melon seed (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Garden Link (Seed -> Bed)",
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
      "part3Hint": "SPREAD + SHEET = Spreadsheet (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Material Link (Sheet -> Metal)",
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
      "part3Hint": "WORK + BENCH = Workbench (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Bench -> Mark)",
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
      "part3Hint": "DOWN + TOWN = Downtown (\ud83c\udf38 3-Part Compound Complete!)",
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
        "nextPart1": "GOLD",
        "connection": "Zone 2 Bridge (Town -> Gold)",
        "hint": "TOWN \u2194 GOLD = Boomtown gold",
        "decoys": [
          "MOLD",
          "SCOLD",
          "SCALD",
          "BALD"
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
      "part3Hint": "MINE + FIELD = Minefield (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "School Link (Field -> Trip)",
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
      "part3Hint": "WIRE + TAP = Wiretap (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Stage Link (Tap -> Dance)",
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
      "id": "dance_floor_plan",
      "parts": [
        "DANCE",
        "FLOOR",
        "PLAN"
      ],
      "part2Hint": "DANCE + FLOOR = Dance floor",
      "part3Hint": "FLOOR + PLAN = Floor plan (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "SNORE",
        "CHORE",
        "SPORE",
        "ROAR"
      ],
      "part3Decoys": [
        "CLAN",
        "SWAN",
        "BRAN",
        "FLAN"
      ],
      "thematicLink": {
        "nextPart1": "BOARD",
        "connection": "Compound Link (Plan -> Board)",
        "hint": "PLAN \u2194 BOARD = Planning board",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      }
    },
    {
      "id": "board_walk_way",
      "parts": [
        "BOARD",
        "WALK",
        "WAY"
      ],
      "part2Hint": "BOARD + WALK = Boardwalk",
      "part3Hint": "WALK + WAY = Walkway (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "HAWK",
        "STALK",
        "SQUAWK",
        "CAULK"
      ],
      "part3Decoys": [
        "CLAY",
        "TRAY",
        "SLEIGH",
        "SPRAY"
      ],
      "thematicLink": {
        "nextPart1": "SEA",
        "connection": "Zone 2 Bridge (Way -> Sea)",
        "hint": "WAY \u2194 SEA = Seaway",
        "decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
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
      "part3Hint": "SHELL + SHOCK = Shell shock (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Physics Link (Shock -> Wave)",
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
      "part3Hint": "LENGTH + WAY = Lengthway (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Way -> Side)",
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
      "id": "side_step_stone",
      "parts": [
        "SIDE",
        "STEP",
        "STONE"
      ],
      "part2Hint": "SIDE + STEP = Sidestep",
      "part3Hint": "STEP + STONE = Stepping stone (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Masonry Link (Stone -> Wall)",
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
      "id": "wall_paper_clip",
      "parts": [
        "WALL",
        "PAPER",
        "CLIP"
      ],
      "part2Hint": "WALL + PAPER = Wallpaper",
      "part3Hint": "PAPER + CLIP = Paperclip (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "CAPER",
        "TAPER",
        "VAPOR",
        "SCRAPER"
      ],
      "part3Decoys": [
        "CHIP",
        "WHIP",
        "DRIP",
        "BLIP"
      ],
      "thematicLink": {
        "nextPart1": "WIND",
        "connection": "Zone 2 Bridge (Clip -> Wind)",
        "hint": "CLIP \u2194 WIND = Clipper wind",
        "decoys": [
          "RIND",
          "BLIND",
          "GRIND",
          "MIND"
        ]
      }
    }
  ],
  [
    {
      "id": "wind_mill_stone",
      "parts": [
        "WIND",
        "MILL",
        "STONE"
      ],
      "part2Hint": "WIND + MILL = Windmill",
      "part3Hint": "MILL + STONE = Millstone (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Masonry Link (Stone -> Wall)",
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
      "part3Hint": "FLOWER + BED = Flowerbed (\ud83c\udf38 3-Part Compound Complete!)",
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
        "nextPart1": "ROOM",
        "connection": "Home Link (Bed -> Room)",
        "hint": "BED + ROOM = Bedroom",
        "decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ]
      }
    },
    {
      "id": "room_mate_ship",
      "parts": [
        "ROOM",
        "MATE",
        "SHIP"
      ],
      "part2Hint": "ROOM + MATE = Roommate",
      "part3Hint": "MATE + SHIP = Shipmate (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "CRATE",
        "SKATE",
        "SLATE",
        "GRATE"
      ],
      "part3Decoys": [
        "CHIP",
        "WHIP",
        "DRIP",
        "BLIP"
      ],
      "thematicLink": {
        "nextPart1": "BOARD",
        "connection": "Nautical Link (Ship -> Board)",
        "hint": "SHIP + BOARD = Shipboard",
        "decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ]
      }
    },
    {
      "id": "board_game_plan",
      "parts": [
        "BOARD",
        "GAME",
        "PLAN"
      ],
      "part2Hint": "BOARD + GAME = Board game",
      "part3Hint": "GAME + PLAN = Game plan (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "FLAME",
        "SHAME",
        "BLAME",
        "FRAME"
      ],
      "part3Decoys": [
        "CLAN",
        "SWAN",
        "BRAN",
        "FLAN"
      ],
      "thematicLink": {
        "nextPart1": "NOTE",
        "connection": "Zone 2 Bridge (Plan -> Note)",
        "hint": "PLAN \u2194 NOTE = Keynote plan",
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
      "part3Hint": "PAD + LOCK = Padlock (\ud83c\udf38 3-Part Compound Complete!)",
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
        "nextPart1": "KEY",
        "connection": "Hardware Link (Lock -> Key)",
        "hint": "LOCK \u2194 KEY = Keylock",
        "decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ]
      }
    },
    {
      "id": "key_board_walk",
      "parts": [
        "KEY",
        "BOARD",
        "WALK"
      ],
      "part2Hint": "KEY + BOARD = Keyboard",
      "part3Hint": "BOARD + WALK = Boardwalk (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Compound Link (Walk -> Out)",
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
      "part3Hint": "POST + OFFICE = Post office (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Workplace Link (Office -> Space)",
        "hint": "OFFICE + SPACE = Office space",
        "decoys": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ]
      }
    },
    {
      "id": "space_ship_wreck",
      "parts": [
        "SPACE",
        "SHIP",
        "WRECK"
      ],
      "part2Hint": "SPACE + SHIP = Spaceship",
      "part3Hint": "SHIP + WRECK = Shipwreck (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "CHIP",
        "WHIP",
        "DRIP",
        "BLIP"
      ],
      "part3Decoys": [
        "SPECK",
        "FLECK",
        "PECK",
        "NECK"
      ],
      "thematicLink": {
        "nextPart1": "SAND",
        "connection": "Zone 2 Bridge (Wreck -> Sand)",
        "hint": "WRECK \u2194 SAND = Sandbar",
        "decoys": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
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
      "part3Hint": "CASTLE + WALL = Castle wall (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Decor Link (Wall -> Paper)",
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
      "part3Hint": "BACK + BONE = Backbone (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Idiom Link (Bone -> Dry)",
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
      "part3Hint": "LAND + SLIDE = Landslide (\ud83c\udf38 3-Part Compound Complete!)",
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
        "connection": "Media Link (Slide -> Show)",
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
      "id": "show_stop_light",
      "parts": [
        "SHOW",
        "STOP",
        "LIGHT"
      ],
      "part2Hint": "SHOW + STOP = Showstopper",
      "part3Hint": "STOP + LIGHT = Stoplight (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "MOP",
        "CHOP",
        "CROP",
        "PLOP"
      ],
      "part3Decoys": [
        "FRIGHT",
        "KNIGHT",
        "PLIGHT",
        "FLIGHT"
      ],
      "thematicLink": {
        "nextPart1": "HAIR",
        "connection": "Zone 2 Bridge (Light -> Hair)",
        "hint": "LIGHT \u2194 HAIR = Highlight",
        "decoys": [
          "CHAIR",
          "STAIR",
          "FLAIR",
          "GLARE"
        ]
      }
    }
  ],
  [
    {
      "id": "hair_pin_cushion",
      "parts": [
        "HAIR",
        "PIN",
        "CUSHION"
      ],
      "part2Hint": "HAIR + PIN = Hairpin",
      "part3Hint": "PIN + CUSHION = Pincushion (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "FIN",
        "CHIN",
        "SHIN",
        "GRIN"
      ],
      "part3Decoys": [
        "FASHION",
        "PASSION",
        "RATION",
        "MANSION"
      ],
      "thematicLink": {
        "nextPart1": "AIR",
        "connection": "Physics Link (Cushion -> Air)",
        "hint": "CUSHION \u2194 AIR = Air cushion",
        "decoys": [
          "CHAIR",
          "STAIR",
          "FLAIR",
          "GLARE"
        ]
      }
    },
    {
      "id": "air_port_hole",
      "parts": [
        "AIR",
        "PORT",
        "HOLE"
      ],
      "part2Hint": "AIR + PORT = Airport",
      "part3Hint": "PORT + HOLE = Porthole (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "FORT",
        "SPORT",
        "SNORT",
        "SHORT"
      ],
      "part3Decoys": [
        "MOLE",
        "FOAL",
        "SHOAL",
        "STOLE"
      ],
      "thematicLink": {
        "nextPart1": "CARD",
        "connection": "Poker Link (Hole -> Card)",
        "hint": "HOLE + CARD = Hole card",
        "decoys": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ]
      }
    },
    {
      "id": "card_board_box",
      "parts": [
        "CARD",
        "BOARD",
        "BOX"
      ],
      "part2Hint": "CARD + BOARD = Cardboard",
      "part3Hint": "BOARD + BOX = Boxboard (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "CHORD",
        "SWORD",
        "GOURD",
        "FJORD"
      ],
      "part3Decoys": [
        "FOX",
        "OX",
        "PHLOX",
        "PARADOX"
      ],
      "thematicLink": {
        "nextPart1": "CAR",
        "connection": "Rail Link (Box -> Car)",
        "hint": "BOX + CAR = Boxcar",
        "decoys": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ]
      }
    },
    {
      "id": "car_wash_room",
      "parts": [
        "CAR",
        "WASH",
        "ROOM"
      ],
      "part2Hint": "CAR + WASH = Car wash",
      "part3Hint": "WASH + ROOM = Washroom (\ud83c\udf38 3-Part Compound Complete!)",
      "part2Decoys": [
        "SQUASH",
        "GOSH",
        "POSH",
        "SLOSH"
      ],
      "part3Decoys": [
        "BROOM",
        "GROOM",
        "GLOOM",
        "LOOM"
      ],
      "thematicLink": {
        "nextPart1": "BIRD",
        "connection": "Zone 2 Bridge (Room -> Bird)",
        "hint": "ROOM \u2194 BIRD = Bowerbird",
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
      }
    ],
    "zone3": [
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
        "target": "COAT",
        "hint": "TOP + COAT = Topcoat",
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
        "stem": "CLASS",
        "target": "ROOM",
        "hint": "CLASS + ROOM = Classroom",
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
        "target": "SHIP",
        "hint": "MATE + SHIP = Shipmate",
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
        "stem": "WATER",
        "target": "FALL",
        "hint": "WATER + FALL = Waterfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
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
        "target": "SHIP",
        "hint": "MATE + SHIP = Shipmate",
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
        "target": "BACK",
        "hint": "LINE + BACK = Linebacker",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "STAGE",
        "hint": "BACK + STAGE = Backstage",
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
      }
    ],
    "zone3": [
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
      },
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
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "GOLD",
        "target": "FISH",
        "hint": "GOLD + FISH = Goldfish",
        "decoys": [
          "DISH",
          "WISH",
          "SWISH",
          "QUICHE"
        ]
      },
      {
        "stem": "FISH",
        "target": "BOWL",
        "hint": "FISH + BOWL = Fishbowl",
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
        "target": "BACK",
        "hint": "CUT + BACK = Cutback",
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
        "target": "LOAD",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3": [
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
        "target": "KEEP",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "CAST",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "BLOUSE",
          "SHUTTER",
          "GROUSE",
          "CHURN"
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
        "target": "SHOOT",
        "hint": "OFF + BEAT = Offbeat",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "SEA",
        "target": "PORT",
        "hint": "SEA + PORT = Seaport",
        "decoys": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ]
      },
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
        "target": "MATE",
        "hint": "SHIP + MATE = Shipmate",
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
        "hint": "MATE + WORK = Team/Mate work",
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
        "target": "ADOR",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3": [
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
      },
      {
        "stem": "WALK",
        "target": "UP",
        "hint": "WALK + UP = Walkup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "SET",
        "hint": "UP + SET = Upset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "DOWN",
        "hint": "SET + DOWN = Setdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "LOAD",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "WIND",
        "target": "FALL",
        "hint": "WIND + FALL = Windfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
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
        "target": "HILL",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ]
      }
    ],
    "zone3": [
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
      },
      {
        "stem": "SHOW",
        "target": "OFF",
        "hint": "SHOW + OFF = Showoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "LINE",
        "hint": "OFF + LINE = Offline",
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
        "target": "DOWN",
        "hint": "RUN + DOWN = Rundown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "BEAT",
        "hint": "DOWN + BEAT = Downbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
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
        "target": "LOAD",
        "hint": "WORK + OUT = Workout",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      },
      {
        "stem": "STEP",
        "target": "SON",
        "hint": "STEP + DOWN = Stepdown",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "MAN",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3": [
      {
        "stem": "OVER",
        "target": "PASS",
        "hint": "OVER + FLOW = Overflow",
        "decoys": [
          "FABLE",
          "SHUTTER",
          "SNORE",
          "GROUSE"
        ]
      },
      {
        "stem": "FLOW",
        "target": "OUT",
        "hint": "FLOW + OUT = Outflow",
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
      },
      {
        "stem": "POUR",
        "target": "OUT",
        "hint": "POUR + OUT = Pourout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "SET",
        "hint": "OUT + SET = Outset",
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
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "SAND",
        "target": "BOX",
        "hint": "SAND + BOX = Sandbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      },
      {
        "stem": "BOX",
        "target": "CAR",
        "hint": "BOX + CAR = Boxcar",
        "decoys": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ]
      },
      {
        "stem": "CAR",
        "target": "POOL",
        "hint": "CAR + POOL = Carpool",
        "decoys": [
          "SPOOL",
          "DROOL",
          "FOOL",
          "GHOUL"
        ]
      },
      {
        "stem": "POOL",
        "target": "SIDE",
        "hint": "POOL + SIDE = Poolside",
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
      },
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
        "hint": "HOLE -> CARD + SHARK = Card shark",
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
      }
    ],
    "zone3": [
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
        "target": "DOWN",
        "hint": "TURN + DOWN = Turndown",
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
        "target": "KEY",
        "hint": "SHIFT + KEY = Shift key",
        "decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ]
      },
      {
        "stem": "KEY",
        "target": "HOLE",
        "hint": "KEY + HOLE = Keyhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "UP",
        "hint": "HOLE + UP = Hole up",
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
        "target": "OFF",
        "hint": "START + OFF = Start off",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "HAIR",
        "target": "CUT",
        "hint": "HAIR + CUT = Haircut",
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
      }
    ],
    "zone3": [
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
        "target": "PACK",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "HALL",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3": [
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
      }
    ]
  },
  {
    "zone2": [
      {
        "stem": "DOG",
        "target": "WOOD",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "SHIP",
        "hint": "MATE + SHIP = Shipmate",
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
        "target": "OUT",
        "hint": "WAY + OUT = Way out",
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
        "target": "MARK",
        "hint": "POST + MARK = Postmark",
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
      }
    ],
    "zone3": [
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
      },
      {
        "stem": "TURN",
        "target": "UP",
        "hint": "TURN + UP = Turnup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "SET",
        "hint": "UP + SET = Upset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "OFF",
        "hint": "SET + OFF = Setoff",
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
        "target": "UP",
        "hint": "STEP + UP = Step up",
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
      }
    ]
  }
];

  const PRODUCTION_DAILY_VINES = [
  {
    "vineNumber": 142,
    "dateKey": "2026-11-01",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 0,
    "title": "Midnight Bioluminescence",
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
        "part3Hint": "BUTTER + CUP = Buttercup (\ud83c\udf38 3-Part Compound Complete!)",
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
          "nextPart1": "COFFEE",
          "connection": "Drinkware Link (Cup -> Coffee)",
          "hint": "CUP \u2194 COFFEE = Coffee cup",
          "decoys": [
            "TOFFEE",
            "TROPHY",
            "DOLPHIN",
            "COFFIN"
          ]
        }
      },
      {
        "id": "coffee_table_book",
        "parts": [
          "COFFEE",
          "TABLE",
          "BOOK"
        ],
        "part2Hint": "COFFEE + TABLE = Coffee table",
        "part3Hint": "TABLE + BOOK = Table book (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "part3Decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "thematicLink": {
          "nextPart1": "MATCH",
          "connection": "Matchbook Link (Book -> Match)",
          "hint": "BOOK \u2194 MATCH = Matchbook",
          "decoys": [
            "HATCH",
            "LATCH",
            "THATCH",
            "SNATCH"
          ]
        }
      },
      {
        "id": "match_box_car",
        "parts": [
          "MATCH",
          "BOX",
          "CAR"
        ],
        "part2Hint": "MATCH + BOX = Matchbox",
        "part3Hint": "BOX + CAR = Boxcar (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "part3Decoys": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ],
        "thematicLink": {
          "nextPart1": "POOL",
          "connection": "Carpool Link (Car -> Pool)",
          "hint": "CAR + POOL = Carpool",
          "decoys": [
            "SPOOL",
            "DROOL",
            "FOOL",
            "GHOUL"
          ]
        }
      },
      {
        "id": "pool_table_top",
        "parts": [
          "POOL",
          "TABLE",
          "TOP"
        ],
        "part2Hint": "POOL + TABLE = Pool table",
        "part3Hint": "TABLE + TOP = Tabletop (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Zone 2 Bridge (Top -> Dog)",
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
      }
    ],
    "zone3Compounds": [
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
        "target": "COAT",
        "hint": "TOP + COAT = Topcoat",
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
        "tripletStep": 2,
        "stemWord": "PEANUT",
        "displayStem": "PEANUT",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "BUTTER",
        "decoyPool": [
          "SHUTTER",
          "CLUTTER",
          "FLUTTER",
          "MUTTER"
        ],
        "decoyWord": "SHUTTER",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 CUP",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "PEANUT",
          "[ ? ]",
          "\ud83c\udf38 CUP"
        ],
        "compoundHint": "PEANUT + BUTTER = Peanut butter"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BUTTER",
        "displayStem": "PEANUT \u2192 BUTTER",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "CUP",
        "decoyPool": [
          "PUP",
          "HICCUP",
          "STIRRUP",
          "GALLOP"
        ],
        "decoyWord": "PUP",
        "faintAbove": {
          "label": "THEMATIC LINK VIA CUP",
          "word": "\ud83d\udd17 COFFEE \u2192 TABLE \u2192 BOOK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "PEANUT",
          "BUTTER",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BUTTER + CUP = Buttercup (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "CUP",
        "displayStem": "CUP",
        "stemBadge": "\ud83d\udd17 DRINKWARE LINK (CUP -> COFFEE)",
        "correctWord": "COFFEE",
        "decoyPool": [
          "TOFFEE",
          "TROPHY",
          "DOLPHIN",
          "COFFIN"
        ],
        "decoyWord": "TOFFEE",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 TABLE \u2192 BOOK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 CUP",
          "[ ? (1/3) ]",
          "TABLE \u2192 BOOK"
        ],
        "compoundHint": "CUP \u2194 COFFEE = Coffee cup"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "COFFEE",
        "displayStem": "COFFEE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "TABLE",
        "decoyPool": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "decoyWord": "FABLE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BOOK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "COFFEE",
          "[ ? ]",
          "\ud83c\udf38 BOOK"
        ],
        "compoundHint": "COFFEE + TABLE = Coffee table"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "TABLE",
        "displayStem": "COFFEE \u2192 TABLE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BOOK",
          "word": "\ud83d\udd17 MATCH \u2192 BOX \u2192 CAR",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "COFFEE",
          "TABLE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "TABLE + BOOK = Table book (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "stemBadge": "\ud83d\udd17 MATCHBOOK LINK (BOOK -> MATCH)",
        "correctWord": "MATCH",
        "decoyPool": [
          "HATCH",
          "LATCH",
          "THATCH",
          "SNATCH"
        ],
        "decoyWord": "HATCH",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 BOX \u2192 CAR",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BOOK",
          "[ ? (1/3) ]",
          "BOX \u2192 CAR"
        ],
        "compoundHint": "BOOK \u2194 MATCH = Matchbook"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "MATCH",
        "displayStem": "MATCH",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "BOX",
        "decoyPool": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "decoyWord": "FOX",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 CAR",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "MATCH",
          "[ ? ]",
          "\ud83c\udf38 CAR"
        ],
        "compoundHint": "MATCH + BOX = Matchbox"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BOX",
        "displayStem": "MATCH \u2192 BOX",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "CAR",
        "decoyPool": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ],
        "decoyWord": "SCAR",
        "faintAbove": {
          "label": "THEMATIC LINK VIA CAR",
          "word": "\ud83d\udd17 POOL \u2192 TABLE \u2192 TOP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "MATCH",
          "BOX",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BOX + CAR = Boxcar (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "CAR",
        "displayStem": "CAR",
        "stemBadge": "\ud83d\udd17 CARPOOL LINK (CAR -> POOL)",
        "correctWord": "POOL",
        "decoyPool": [
          "SPOOL",
          "DROOL",
          "FOOL",
          "GHOUL"
        ],
        "decoyWord": "SPOOL",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 TABLE \u2192 TOP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 CAR",
          "[ ? (1/3) ]",
          "TABLE \u2192 TOP"
        ],
        "compoundHint": "CAR + POOL = Carpool"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "POOL",
        "displayStem": "POOL",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "TABLE",
        "decoyPool": [
          "FABLE",
          "CABLE",
          "GABLE",
          "SABLE"
        ],
        "decoyWord": "FABLE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 TOP",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "POOL",
          "[ ? ]",
          "\ud83c\udf38 TOP"
        ],
        "compoundHint": "POOL + TABLE = Pool table"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "TABLE",
        "displayStem": "POOL \u2192 TABLE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "TOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "faintAbove": {
          "label": "THEMATIC LINK VIA TOP",
          "word": "\ud83d\udd17 + ZONE 2: DOG",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "POOL",
          "TABLE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "TABLE + TOP = Tabletop (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "TOP",
        "displayStem": "TOP",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (TOP -> DOG)",
        "correctWord": "DOG",
        "decoyPool": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ],
        "decoyWord": "FOG",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "DOG \u2192 HOUSE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 TOP",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "TOP + DOG = Top dog"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOG",
        "displayStem": "DOG",
        "correctWord": "HOUSE",
        "decoyPool": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "DOG + HOUSE = Doghouse"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "correctWord": "FLY",
        "decoyPool": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ],
        "decoyWord": "SHY",
        "compoundHint": "HOUSE + FLY = Housefly"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FLY",
        "displayStem": "FLY",
        "correctWord": "TRAP",
        "decoyPool": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ],
        "decoyWord": "CLAP",
        "compoundHint": "FLY + TRAP = Flytrap"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "TRAP",
        "displayStem": "TRAP",
        "correctWord": "DOOR",
        "decoyPool": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "decoyWord": "SNORE",
        "compoundHint": "TRAP + DOOR = Trapdoor"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOOR",
        "displayStem": "DOOR",
        "correctWord": "BELL",
        "decoyPool": [
          "SPELL",
          "YELL",
          "SMELL",
          "DWELL"
        ],
        "decoyWord": "SPELL",
        "compoundHint": "DOOR + BELL = Doorbell"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BELL",
        "displayStem": "BELL",
        "correctWord": "PEPPER",
        "decoyPool": [
          "LEPER",
          "STEPPER",
          "ZIPPER",
          "SLIPPER"
        ],
        "decoyWord": "LEPER",
        "compoundHint": "BELL + PEPPER = Bell pepper"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PEPPER",
        "displayStem": "PEPPER",
        "correctWord": "MINT",
        "decoyPool": [
          "LINT",
          "FLINT",
          "SQUINT",
          "SPRINT"
        ],
        "decoyWord": "LINT",
        "compoundHint": "PEPPER + MINT = Peppermint"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MINT",
        "displayStem": "MINT",
        "correctWord": "GREEN",
        "decoyPool": [
          "QUEEN",
          "SCREEN",
          "SPLEEN",
          "PREEN"
        ],
        "decoyWord": "QUEEN",
        "compoundHint": "MINT + GREEN = Mint green"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "GREEN",
        "displayStem": "GREEN",
        "correctWord": "LIGHT",
        "decoyPool": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ],
        "decoyWord": "FRIGHT",
        "compoundHint": "GREEN + LIGHT = Greenlight"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LIGHT",
        "displayStem": "LIGHT",
        "correctWord": "YEAR",
        "decoyPool": [
          "SPEAR",
          "SMEAR",
          "SHEAR",
          "TEAR"
        ],
        "decoyWord": "SPEAR",
        "compoundHint": "LIGHT + YEAR = Lightyear"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "YEAR",
        "displayStem": "YEAR",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "YEAR + BOOK = Yearbook"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "correctWord": "WORM",
        "decoyPool": [
          "STORM",
          "GERM",
          "TERM",
          "FIRM"
        ],
        "decoyWord": "STORM",
        "compoundHint": "BOOK + WORM = Bookworm"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WORM",
        "displayStem": "WORM",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "compoundHint": "WORM + HOLE = Wormhole"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "compoundHint": "HOLE + CARD = Hole card"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "correctWord": "SHARK",
        "decoyPool": [
          "LARK",
          "SPARK",
          "BARK",
          "DARK"
        ],
        "decoyWord": "LARK",
        "compoundHint": "CARD + SHARK = Card shark"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHARK",
        "displayStem": "SHARK",
        "correctWord": "TANK",
        "decoyPool": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ],
        "decoyWord": "PRANK",
        "compoundHint": "SHARK + TANK = Shark tank"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TANK",
        "displayStem": "TANK",
        "correctWord": "TOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "compoundHint": "TANK + TOP = Tank top"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TOP",
        "displayStem": "TOP",
        "correctWord": "COAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "compoundHint": "TOP + COAT = Topcoat"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "COAT",
        "displayStem": "COAT",
        "correctWord": "RACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "COAT + RACK = Coatrack"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "RACK",
        "displayStem": "RACK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "RACK + UP = Rack up"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "BEAT",
        "decoyPool": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ],
        "decoyWord": "WHEAT",
        "compoundHint": "UP + BEAT = Upbeat"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BEAT",
        "displayStem": "BEAT",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "BEAT + DOWN = Beatdown"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "POUR",
        "decoyPool": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "decoyWord": "SNORE",
        "compoundHint": "DOWN + POUR = Downpour"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "POUR",
        "displayStem": "POUR",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "POUR + OVER = Pour-over"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "SLEEP",
        "decoyPool": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ],
        "decoyWord": "SHEEP",
        "compoundHint": "OVER + SLEEP = Oversleep"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SLEEP",
        "displayStem": "SLEEP",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "compoundHint": "SLEEP + WALK = Sleepwalk"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "WALK + OUT = Walkout"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "BURST",
        "decoyPool": [
          "THIRST",
          "FIRST",
          "WORST",
          "HEARSE"
        ],
        "decoyWord": "THIRST",
        "compoundHint": "OUT + BURST = Outburst"
      }
    ]
  },
  {
    "vineNumber": 143,
    "dateKey": "2026-11-02",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 1,
    "title": "Sunlit Conservatory",
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
        "part3Hint": "FLOWER + POT = Flowerpot (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Pot -> Belly)",
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
        "part3Hint": "BUTTON + HOLE = Buttonhole (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Tool Link (Hole -> Punch)",
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
        "part3Hint": "BOWL + CUT = Bowl cut (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Cut -> Back)",
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
        "part3Hint": "STAGE + COACH = Stagecoach (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Zone 2 Bridge (Coach -> Class)",
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
        "target": "ROOM",
        "hint": "CLASS + ROOM = Classroom",
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
        "target": "SHIP",
        "hint": "MATE + SHIP = Shipmate",
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
        "tripletStep": 2,
        "stemWord": "SUN",
        "displayStem": "SUN",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "FLOWER",
        "decoyPool": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ],
        "decoyWord": "TOWER",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 POT",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SUN",
          "[ ? ]",
          "\ud83c\udf38 POT"
        ],
        "compoundHint": "SUN + FLOWER = Sunflower"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "FLOWER",
        "displayStem": "SUN \u2192 FLOWER",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "POT",
        "decoyPool": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ],
        "decoyWord": "BLOT",
        "faintAbove": {
          "label": "THEMATIC LINK VIA POT",
          "word": "\ud83d\udd17 BELLY \u2192 BUTTON \u2192 HOLE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SUN",
          "FLOWER",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "FLOWER + POT = Flowerpot (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "POT",
        "displayStem": "POT",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (POT -> BELLY)",
        "correctWord": "BELLY",
        "decoyPool": [
          "JELLY",
          "CELLO",
          "FELLOW",
          "TRELLIS"
        ],
        "decoyWord": "JELLY",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 BUTTON \u2192 HOLE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 POT",
          "[ ? (1/3) ]",
          "BUTTON \u2192 HOLE"
        ],
        "compoundHint": "POT + BELLY = Potbelly"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BELLY",
        "displayStem": "BELLY",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "BUTTON",
        "decoyPool": [
          "MUTTON",
          "GLUTTON",
          "CARTON",
          "PISTON"
        ],
        "decoyWord": "MUTTON",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 HOLE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BELLY",
          "[ ? ]",
          "\ud83c\udf38 HOLE"
        ],
        "compoundHint": "BELLY + BUTTON = Belly button"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BUTTON",
        "displayStem": "BELLY \u2192 BUTTON",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA HOLE",
          "word": "\ud83d\udd17 PUNCH \u2192 BOWL \u2192 CUT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BELLY",
          "BUTTON",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BUTTON + HOLE = Buttonhole (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "stemBadge": "\ud83d\udd17 TOOL LINK (HOLE -> PUNCH)",
        "correctWord": "PUNCH",
        "decoyPool": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ],
        "decoyWord": "LUNCH",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 BOWL \u2192 CUT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 HOLE",
          "[ ? (1/3) ]",
          "BOWL \u2192 CUT"
        ],
        "compoundHint": "HOLE + PUNCH = Hole punch"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "PUNCH",
        "displayStem": "PUNCH",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "BOWL",
        "decoyPool": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ],
        "decoyWord": "OWL",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 CUT",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "PUNCH",
          "[ ? ]",
          "\ud83c\udf38 CUT"
        ],
        "compoundHint": "PUNCH + BOWL = Punch bowl"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BOWL",
        "displayStem": "PUNCH \u2192 BOWL",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "CUT",
        "decoyPool": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "decoyWord": "HUT",
        "faintAbove": {
          "label": "THEMATIC LINK VIA CUT",
          "word": "\ud83d\udd17 BACK \u2192 STAGE \u2192 COACH",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "PUNCH",
          "BOWL",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BOWL + CUT = Bowl cut (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "CUT",
        "displayStem": "CUT",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (CUT -> BACK)",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 STAGE \u2192 COACH",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 CUT",
          "[ ? (1/3) ]",
          "STAGE \u2192 COACH"
        ],
        "compoundHint": "CUT + BACK = Cutback"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "STAGE",
        "decoyPool": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ],
        "decoyWord": "CAGE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 COACH",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BACK",
          "[ ? ]",
          "\ud83c\udf38 COACH"
        ],
        "compoundHint": "BACK + STAGE = Backstage"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "STAGE",
        "displayStem": "BACK \u2192 STAGE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "COACH",
        "decoyPool": [
          "ROACH",
          "POACH",
          "BROOCH",
          "LOACH"
        ],
        "decoyWord": "ROACH",
        "faintAbove": {
          "label": "THEMATIC LINK VIA COACH",
          "word": "\ud83d\udd17 + ZONE 2: CLASS",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BACK",
          "STAGE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "STAGE + COACH = Stagecoach (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "COACH",
        "displayStem": "COACH",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (COACH -> CLASS)",
        "correctWord": "CLASS",
        "decoyPool": [
          "BRASS",
          "LASS",
          "CRASS",
          "MORASS"
        ],
        "decoyWord": "BRASS",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "CLASS \u2192 ROOM",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 COACH",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "COACH + CLASS = Coach class"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CLASS",
        "displayStem": "CLASS",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "compoundHint": "CLASS + ROOM = Classroom"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "correctWord": "MATE",
        "decoyPool": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "decoyWord": "CRATE",
        "compoundHint": "ROOM + MATE = Roommate"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MATE",
        "displayStem": "MATE",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "compoundHint": "MATE + SHIP = Shipmate"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHIP",
        "displayStem": "SHIP",
        "correctWord": "WRECK",
        "decoyPool": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ],
        "decoyWord": "SPECK",
        "compoundHint": "SHIP + WRECK = Shipwreck"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WRECK",
        "displayStem": "WRECK",
        "correctWord": "BALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "WRECK + BALL = Wrecking ball"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BALL",
        "displayStem": "BALL",
        "correctWord": "POINT",
        "decoyPool": [
          "JOINT",
          "ANOINT",
          "CONJOINT",
          "DISJOINT"
        ],
        "decoyWord": "JOINT",
        "compoundHint": "BALL + POINT = Ballpoint"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POINT",
        "displayStem": "POINT",
        "correctWord": "BLANK",
        "decoyPool": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ],
        "decoyWord": "PRANK",
        "compoundHint": "POINT + BLANK = Point-blank"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BLANK",
        "displayStem": "BLANK",
        "correctWord": "CHECK",
        "decoyPool": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ],
        "decoyWord": "SPECK",
        "compoundHint": "BLANK + CHECK = Blank check"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CHECK",
        "displayStem": "CHECK",
        "correctWord": "POINT",
        "decoyPool": [
          "JOINT",
          "ANOINT",
          "CONJOINT",
          "DISJOINT"
        ],
        "decoyWord": "JOINT",
        "compoundHint": "CHECK + POINT = Checkpoint"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POINT",
        "displayStem": "POINT",
        "correctWord": "GUARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "CHARD"
        ],
        "decoyWord": "LARD",
        "compoundHint": "POINT + GUARD = Point guard"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "GUARD",
        "displayStem": "GUARD",
        "correctWord": "RAIL",
        "decoyPool": [
          "SNAIL",
          "QUAIL",
          "FLAIL",
          "GRAIL"
        ],
        "decoyWord": "SNAIL",
        "compoundHint": "GUARD + RAIL = Guardrail"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "RAIL",
        "displayStem": "RAIL",
        "correctWord": "ROAD",
        "decoyPool": [
          "TOAD",
          "GOAD",
          "ABODE",
          "EPISODE"
        ],
        "decoyWord": "TOAD",
        "compoundHint": "RAIL + ROAD = Railroad"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "ROAD",
        "displayStem": "ROAD",
        "correctWord": "BLOCK",
        "decoyPool": [
          "FLOCK",
          "CLOCK",
          "SMOCK",
          "CROCK"
        ],
        "decoyWord": "FLOCK",
        "compoundHint": "ROAD + BLOCK = Roadblock"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BLOCK",
        "displayStem": "BLOCK",
        "correctWord": "HEAD",
        "decoyPool": [
          "BREAD",
          "THREAD",
          "DREAD",
          "TREAD"
        ],
        "decoyWord": "BREAD",
        "compoundHint": "BLOCK + HEAD = Blockhead"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HEAD",
        "displayStem": "HEAD",
        "correctWord": "START",
        "decoyPool": [
          "TART",
          "DART",
          "CART",
          "CHART"
        ],
        "decoyWord": "TART",
        "compoundHint": "HEAD + START = Head start"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "START",
        "displayStem": "START",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "START + UP = Startup"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "UP + TURN = Upturn"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "TURN + OVER = Turnover"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "OVER + LOOK = Overlook"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "LOOK + OUT = Lookout"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "OUT + LINE = Outline"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "LINE + UP = Lineup"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "HOLD",
        "decoyPool": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ],
        "decoyWord": "MOLD",
        "compoundHint": "UP + HOLD = Uphold"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "HOLD + BACK = Holdback"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "FIRE",
        "decoyPool": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ],
        "decoyWord": "CHOIR",
        "compoundHint": "BACK + FIRE = Backfire"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "FIRE + WORK = Firework"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "compoundHint": "OUT + RUN = Outrun"
      }
    ]
  },
  {
    "vineNumber": 144,
    "dateKey": "2026-11-03",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 2,
    "title": "Crimson Canopy (Ukiyo-e)",
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
        "part3Hint": "BALL + PARK = Ballpark (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Setting Link (Park -> Bench)",
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
        "part3Hint": "MARK + DOWN = Markdown (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Down -> Town)",
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
        "part3Hint": "HOUSE + BOAT = Houseboat (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Boat -> Show)",
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
        "part3Hint": "CASE + WORK = Casework (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Zone 2 Bridge (Work -> Horse)",
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
        "tripletStep": 2,
        "stemWord": "SNOW",
        "displayStem": "SNOW",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "BALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 PARK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SNOW",
          "[ ? ]",
          "\ud83c\udf38 PARK"
        ],
        "compoundHint": "SNOW + BALL = Snowball"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BALL",
        "displayStem": "SNOW \u2192 BALL",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "PARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA PARK",
          "word": "\ud83d\udd17 BENCH \u2192 MARK \u2192 DOWN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SNOW",
          "BALL",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BALL + PARK = Ballpark (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "PARK",
        "displayStem": "PARK",
        "stemBadge": "\ud83d\udd17 SETTING LINK (PARK -> BENCH)",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 MARK \u2192 DOWN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 PARK",
          "[ ? (1/3) ]",
          "MARK \u2192 DOWN"
        ],
        "compoundHint": "PARK + BENCH = Park bench"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BENCH",
        "displayStem": "BENCH",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 DOWN",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BENCH",
          "[ ? ]",
          "\ud83c\udf38 DOWN"
        ],
        "compoundHint": "BENCH + MARK = Benchmark"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "MARK",
        "displayStem": "BENCH \u2192 MARK",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "faintAbove": {
          "label": "THEMATIC LINK VIA DOWN",
          "word": "\ud83d\udd17 TOWN \u2192 HOUSE \u2192 BOAT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BENCH",
          "MARK",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "MARK + DOWN = Markdown (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (DOWN -> TOWN)",
        "correctWord": "TOWN",
        "decoyPool": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "decoyWord": "CLOWN",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 HOUSE \u2192 BOAT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 DOWN",
          "[ ? (1/3) ]",
          "HOUSE \u2192 BOAT"
        ],
        "compoundHint": "DOWN + TOWN = Downtown"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "TOWN",
        "displayStem": "TOWN",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "HOUSE",
        "decoyPool": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "decoyWord": "BLOUSE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BOAT",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "TOWN",
          "[ ? ]",
          "\ud83c\udf38 BOAT"
        ],
        "compoundHint": "TOWN + HOUSE = Townhouse"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "HOUSE",
        "displayStem": "TOWN \u2192 HOUSE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "BOAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BOAT",
          "word": "\ud83d\udd17 SHOW \u2192 CASE \u2192 WORK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "TOWN",
          "HOUSE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "HOUSE + BOAT = Houseboat (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BOAT",
        "displayStem": "BOAT",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (BOAT -> SHOW)",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 CASE \u2192 WORK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BOAT",
          "[ ? (1/3) ]",
          "CASE \u2192 WORK"
        ],
        "compoundHint": "BOAT + SHOW = Boat show"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "CASE",
        "decoyPool": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "decoyWord": "VASE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WORK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SHOW",
          "[ ? ]",
          "\ud83c\udf38 WORK"
        ],
        "compoundHint": "SHOW + CASE = Showcase"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "CASE",
        "displayStem": "SHOW \u2192 CASE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WORK",
          "word": "\ud83d\udd17 + ZONE 2: HORSE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SHOW",
          "CASE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "CASE + WORK = Casework (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (WORK -> HORSE)",
        "correctWord": "HORSE",
        "decoyPool": [
          "MORSE",
          "CORPSE",
          "REMORSE",
          "GORSE"
        ],
        "decoyWord": "MORSE",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "HORSE \u2192 SHOE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WORK",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "WORK + HORSE = Workhorse"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HORSE",
        "displayStem": "HORSE",
        "correctWord": "SHOE",
        "decoyPool": [
          "CANOE",
          "IGLOO",
          "BAMBOO",
          "KAZOO"
        ],
        "decoyWord": "CANOE",
        "compoundHint": "HORSE + SHOE = Horseshoe"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHOE",
        "displayStem": "SHOE",
        "correctWord": "STRING",
        "decoyPool": [
          "SPRING",
          "SWING",
          "FLING",
          "CLING"
        ],
        "decoyWord": "SPRING",
        "compoundHint": "SHOE + STRING = Shoestring"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "STRING",
        "displayStem": "STRING",
        "correctWord": "BEAN",
        "decoyPool": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ],
        "decoyWord": "QUEEN",
        "compoundHint": "STRING + BEAN = String bean"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BEAN",
        "displayStem": "BEAN",
        "correctWord": "BAG",
        "decoyPool": [
          "STAG",
          "CRAG",
          "BRAG",
          "SNAG"
        ],
        "decoyWord": "STAG",
        "compoundHint": "BEAN + BAG = Beanbag"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BAG",
        "displayStem": "BAG",
        "correctWord": "PIPE",
        "decoyPool": [
          "SNIPE",
          "STRIPE",
          "GRIPE",
          "SWIPE"
        ],
        "decoyWord": "SNIPE",
        "compoundHint": "BAG + PIPE = Bagpipe"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PIPE",
        "displayStem": "PIPE",
        "correctWord": "DREAM",
        "decoyPool": [
          "CREAM",
          "STEAM",
          "GLEAM",
          "SEAM"
        ],
        "decoyWord": "CREAM",
        "compoundHint": "PIPE + DREAM = Pipe dream"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DREAM",
        "displayStem": "DREAM",
        "correctWord": "LAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "compoundHint": "DREAM + LAND = Dreamland"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LAND",
        "displayStem": "LAND",
        "correctWord": "SLIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "LAND + SLIDE = Landslide"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SLIDE",
        "displayStem": "SLIDE",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "compoundHint": "SLIDE + SHOW = Slideshow"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "SHOW + DOWN = Showdown"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "DOWN + FALL = Downfall"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "FALL + BACK = Fallback"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "BONE",
        "decoyPool": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "decoyWord": "CONE",
        "compoundHint": "BACK + BONE = Backbone"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BONE",
        "displayStem": "BONE",
        "correctWord": "DRY",
        "decoyPool": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ],
        "decoyWord": "SHY",
        "compoundHint": "BONE + DRY = Bone-dry"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DRY",
        "displayStem": "DRY",
        "correctWord": "CLEAN",
        "decoyPool": [
          "QUEEN",
          "DEAN",
          "SPLEEN",
          "PREEN"
        ],
        "decoyWord": "QUEEN",
        "compoundHint": "DRY + CLEAN = Dry-clean"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CLEAN",
        "displayStem": "CLEAN",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "CLEAN + UP = Cleanup"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "LIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "compoundHint": "UP + LIFT = Uplift"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LIFT",
        "displayStem": "LIFT",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "LIFT + OFF = Liftoff"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "compoundHint": "OFF + SET = Offset"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SET",
        "displayStem": "SET",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "SET + BACK = Setback"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "DROP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "compoundHint": "BACK + DROP = Backdrop"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DROP",
        "displayStem": "DROP",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "DROP + OUT = Dropout"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "BREAK",
        "decoyPool": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ],
        "decoyWord": "STEAK",
        "compoundHint": "OUT + BREAK = Outbreak"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BREAK",
        "displayStem": "BREAK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "BREAK + DOWN = Breakdown"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "SHIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "compoundHint": "DOWN + SHIFT = Downshift"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SHIFT",
        "displayStem": "SHIFT",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "SHIFT + WORK = Shiftwork"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "FLOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "compoundHint": "WORK + FLOW = Workflow"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "FLOW",
        "displayStem": "FLOW",
        "correctWord": "CHART",
        "decoyPool": [
          "TART",
          "DART",
          "CART",
          "SMART"
        ],
        "decoyWord": "TART",
        "compoundHint": "FLOW + CHART = Flowchart"
      }
    ]
  },
  {
    "vineNumber": 145,
    "dateKey": "2026-11-04",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 0,
    "title": "Midnight Bioluminescence",
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
        "part3Hint": "PLACE + MAT = Placemat (\ud83c\udf38 3-Part Compound Complete!)",
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
          "nextPart1": "BATH",
          "connection": "Household Link (Mat -> Bath)",
          "hint": "MAT \u2194 BATH = Bathmat",
          "decoys": [
            "WRATH",
            "MATH",
            "MOTH",
            "BROTH"
          ]
        }
      },
      {
        "id": "bath_robe_hook",
        "parts": [
          "BATH",
          "ROBE",
          "HOOK"
        ],
        "part2Hint": "BATH + ROBE = Bathrobe",
        "part3Hint": "ROBE + HOOK = Robe hook (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "GLOBE",
          "PROBE",
          "LOBE",
          "STROBE"
        ],
        "part3Decoys": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "thematicLink": {
          "nextPart1": "FISH",
          "connection": "Angling Link (Hook -> Fish)",
          "hint": "HOOK \u2194 FISH = Fishhook",
          "decoys": [
            "DISH",
            "WISH",
            "SWISH",
            "QUICHE"
          ]
        }
      },
      {
        "id": "fish_net_work",
        "parts": [
          "FISH",
          "NET",
          "WORK"
        ],
        "part2Hint": "FISH + NET = Fishnet",
        "part3Hint": "NET + WORK = Network (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "part3Decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "thematicLink": {
          "nextPart1": "DAY",
          "connection": "Compound Link (Work -> Day)",
          "hint": "WORK + DAY = Workday",
          "decoys": [
            "CLAY",
            "TRAY",
            "JAY",
            "SLEIGH"
          ]
        }
      },
      {
        "id": "day_dream_boat",
        "parts": [
          "DAY",
          "DREAM",
          "BOAT"
        ],
        "part2Hint": "DAY + DREAM = Daydream",
        "part3Hint": "DREAM + BOAT = Dreamboat (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "CREAM",
          "STEAM",
          "GLEAM",
          "SEAM"
        ],
        "part3Decoys": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "thematicLink": {
          "nextPart1": "DOG",
          "connection": "Zone 2 Bridge (Boat -> Dog)",
          "hint": "BOAT \u2194 DOG = Sea dog",
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
        "stem": "WATER",
        "target": "FALL",
        "hint": "WATER + FALL = Waterfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
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
        "target": "SHIP",
        "hint": "MATE + SHIP = Shipmate",
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
        "target": "BACK",
        "hint": "LINE + BACK = Linebacker",
        "decoys": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ]
      },
      {
        "stem": "BACK",
        "target": "STAGE",
        "hint": "BACK + STAGE = Backstage",
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
      }
    ],
    "zone3Compounds": [
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
      },
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
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "PLACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 MAT",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "FIRE",
          "[ ? ]",
          "\ud83c\udf38 MAT"
        ],
        "compoundHint": "FIRE + PLACE = Fireplace"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "PLACE",
        "displayStem": "FIRE \u2192 PLACE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "faintAbove": {
          "label": "THEMATIC LINK VIA MAT",
          "word": "\ud83d\udd17 BATH \u2192 ROBE \u2192 HOOK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "FIRE",
          "PLACE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "PLACE + MAT = Placemat (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "MAT",
        "displayStem": "MAT",
        "stemBadge": "\ud83d\udd17 HOUSEHOLD LINK (MAT -> BATH)",
        "correctWord": "BATH",
        "decoyPool": [
          "WRATH",
          "MATH",
          "MOTH",
          "BROTH"
        ],
        "decoyWord": "WRATH",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 ROBE \u2192 HOOK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 MAT",
          "[ ? (1/3) ]",
          "ROBE \u2192 HOOK"
        ],
        "compoundHint": "MAT \u2194 BATH = Bathmat"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BATH",
        "displayStem": "BATH",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "ROBE",
        "decoyPool": [
          "GLOBE",
          "PROBE",
          "LOBE",
          "STROBE"
        ],
        "decoyWord": "GLOBE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 HOOK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BATH",
          "[ ? ]",
          "\ud83c\udf38 HOOK"
        ],
        "compoundHint": "BATH + ROBE = Bathrobe"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "ROBE",
        "displayStem": "BATH \u2192 ROBE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "HOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA HOOK",
          "word": "\ud83d\udd17 FISH \u2192 NET \u2192 WORK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BATH",
          "ROBE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "ROBE + HOOK = Robe hook (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "HOOK",
        "displayStem": "HOOK",
        "stemBadge": "\ud83d\udd17 ANGLING LINK (HOOK -> FISH)",
        "correctWord": "FISH",
        "decoyPool": [
          "DISH",
          "WISH",
          "SWISH",
          "QUICHE"
        ],
        "decoyWord": "DISH",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 NET \u2192 WORK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 HOOK",
          "[ ? (1/3) ]",
          "NET \u2192 WORK"
        ],
        "compoundHint": "HOOK \u2194 FISH = Fishhook"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "FISH",
        "displayStem": "FISH",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "NET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WORK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "FISH",
          "[ ? ]",
          "\ud83c\udf38 WORK"
        ],
        "compoundHint": "FISH + NET = Fishnet"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "NET",
        "displayStem": "FISH \u2192 NET",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WORK",
          "word": "\ud83d\udd17 DAY \u2192 DREAM \u2192 BOAT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "FISH",
          "NET",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "NET + WORK = Network (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (WORK -> DAY)",
        "correctWord": "DAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 DREAM \u2192 BOAT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WORK",
          "[ ? (1/3) ]",
          "DREAM \u2192 BOAT"
        ],
        "compoundHint": "WORK + DAY = Workday"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "DAY",
        "displayStem": "DAY",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "DREAM",
        "decoyPool": [
          "CREAM",
          "STEAM",
          "GLEAM",
          "SEAM"
        ],
        "decoyWord": "CREAM",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BOAT",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "DAY",
          "[ ? ]",
          "\ud83c\udf38 BOAT"
        ],
        "compoundHint": "DAY + DREAM = Daydream"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "DREAM",
        "displayStem": "DAY \u2192 DREAM",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "BOAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BOAT",
          "word": "\ud83d\udd17 + ZONE 2: DOG",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "DAY",
          "DREAM",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "DREAM + BOAT = Dreamboat (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BOAT",
        "displayStem": "BOAT",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (BOAT -> DOG)",
        "correctWord": "DOG",
        "decoyPool": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ],
        "decoyWord": "FOG",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "DOG \u2192 FALL",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BOAT",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "BOAT \u2194 DOG = Sea dog"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "WATER + FALL = Waterfall"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "FALL + OUT = Fallout"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "DOOR",
        "decoyPool": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ],
        "decoyWord": "CHORE",
        "compoundHint": "OUT + DOOR = Outdoor"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOOR",
        "displayStem": "DOOR",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "compoundHint": "DOOR + MAT = Doormat"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MAT",
        "displayStem": "MAT",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "compoundHint": "MAT + BOARD = Matboard"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "compoundHint": "BOARD + ROOM = Boardroom"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "correctWord": "MATE",
        "decoyPool": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "decoyWord": "CRATE",
        "compoundHint": "ROOM + MATE = Roommate"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MATE",
        "displayStem": "MATE",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "compoundHint": "MATE + SHIP = Shipmate"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHIP",
        "displayStem": "SHIP",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "compoundHint": "SHIP + BOARD = Shipboard"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "compoundHint": "BOARD + WALK = Boardwalk"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "decoyWord": "CLAY",
        "compoundHint": "WALK + WAY = Walkway"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "WAY + SIDE = Wayside"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "SIDE + LINE = Sideline"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "LINE + BACK = Linebacker"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "STAGE",
        "decoyPool": [
          "CAGE",
          "SAGE",
          "WAGE",
          "GAUGE"
        ],
        "decoyWord": "CAGE",
        "compoundHint": "BACK + STAGE = Backstage"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "STAGE",
        "displayStem": "STAGE",
        "correctWord": "COACH",
        "decoyPool": [
          "ROACH",
          "POACH",
          "BROOCH",
          "LOACH"
        ],
        "decoyWord": "ROACH",
        "compoundHint": "STAGE + COACH = Stagecoach"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "COACH",
        "displayStem": "COACH",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "COACH + WORK = Coachwork"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "compoundHint": "WORK + BENCH = Workbench"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BENCH",
        "displayStem": "BENCH",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "compoundHint": "BENCH + MARK = Benchmark"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "MARK + DOWN = Markdown"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "compoundHint": "DOWN + TIME = Downtime"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "TIME + OUT = Timeout"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "OUT + LOOK = Outlook"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "LOOK + UP = Lookup"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "START",
        "decoyPool": [
          "CART",
          "CHART",
          "SMART",
          "PART"
        ],
        "decoyWord": "CART",
        "compoundHint": "UP + START = Upstart"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "START",
        "displayStem": "START",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "START + OVER = Start over"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "compoundHint": "OVER + RUN = Overrun"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "correctWord": "AWAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "compoundHint": "RUN + AWAY = Runaway"
      }
    ]
  },
  {
    "vineNumber": 146,
    "dateKey": "2026-11-05",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 1,
    "title": "Sunlit Conservatory",
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
        "part3Hint": "SHAKE + DOWN = Shakedown (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Down -> Time)",
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
        "id": "time_clock_tower",
        "parts": [
          "TIME",
          "CLOCK",
          "TOWER"
        ],
        "part2Hint": "TIME + CLOCK = Time clock",
        "part3Hint": "CLOCK + TOWER = Clock tower (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "part3Decoys": [
          "FLOWER",
          "CHOWDER",
          "POWDER",
          "COWARD"
        ],
        "thematicLink": {
          "nextPart1": "BRIDGE",
          "connection": "Landmark Link (Tower -> Bridge)",
          "hint": "TOWER + BRIDGE = Tower Bridge",
          "decoys": [
            "FRIDGE",
            "RIDGE",
            "MIDGE",
            "PORRIDGE"
          ]
        }
      },
      {
        "id": "bridge_work_shop",
        "parts": [
          "BRIDGE",
          "WORK",
          "SHOP"
        ],
        "part2Hint": "BRIDGE + WORK = Bridgework",
        "part3Hint": "WORK + SHOP = Workshop (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "part3Decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "thematicLink": {
          "nextPart1": "KEEPER",
          "connection": "Compound Link (Shop -> Keeper)",
          "hint": "SHOP + KEEPER = Shopkeeper",
          "decoys": [
            "LEPER",
            "STEPPER",
            "ZIPPER",
            "SLIPPER"
          ]
        }
      },
      {
        "id": "keeper_bee_hive",
        "parts": [
          "KEEPER",
          "BEE",
          "HIVE"
        ],
        "part2Hint": "KEEPER \u2194 BEE = Beekeeper",
        "part3Hint": "BEE + HIVE = Beehive (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "part3Decoys": [
          "DIVE",
          "CHIVE",
          "FIVE",
          "DRIVE"
        ],
        "thematicLink": {
          "nextPart1": "WATER",
          "connection": "Zone 2 Bridge (Hive -> Water)",
          "hint": "HIVE \u2194 WATER = Honeywater",
          "decoys": [
            "OTTER",
            "POTTER",
            "TROTTER",
            "BLOTTER"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "GOLD",
        "target": "FISH",
        "hint": "GOLD + FISH = Goldfish",
        "decoys": [
          "DISH",
          "WISH",
          "SWISH",
          "QUICHE"
        ]
      },
      {
        "stem": "FISH",
        "target": "BOWL",
        "hint": "FISH + BOWL = Fishbowl",
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
        "target": "BACK",
        "hint": "CUT + BACK = Cutback",
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
        "target": "LOAD",
        "hint": "BOAT + SHOW = Boat show",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3Compounds": [
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
        "target": "KEEP",
        "hint": "UP + HOLD = Uphold",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "CAST",
        "hint": "OUT + LINE = Outline",
        "decoys": [
          "BLOUSE",
          "SHUTTER",
          "GROUSE",
          "CHURN"
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
        "target": "SHOOT",
        "hint": "OFF + BEAT = Offbeat",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "HAND",
        "displayStem": "HAND",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "SHAKE",
        "decoyPool": [
          "SNAKE",
          "DRAKE",
          "FLAKE",
          "STEAK"
        ],
        "decoyWord": "SNAKE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 DOWN",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "HAND",
          "[ ? ]",
          "\ud83c\udf38 DOWN"
        ],
        "compoundHint": "HAND + SHAKE = Handshake"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "SHAKE",
        "displayStem": "HAND \u2192 SHAKE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "faintAbove": {
          "label": "THEMATIC LINK VIA DOWN",
          "word": "\ud83d\udd17 TIME \u2192 CLOCK \u2192 TOWER",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "HAND",
          "SHAKE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "SHAKE + DOWN = Shakedown (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (DOWN -> TIME)",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 CLOCK \u2192 TOWER",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 DOWN",
          "[ ? (1/3) ]",
          "CLOCK \u2192 TOWER"
        ],
        "compoundHint": "DOWN + TIME = Downtime"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "CLOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "decoyWord": "FLOCK",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 TOWER",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "TIME",
          "[ ? ]",
          "\ud83c\udf38 TOWER"
        ],
        "compoundHint": "TIME + CLOCK = Time clock"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "CLOCK",
        "displayStem": "TIME \u2192 CLOCK",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "TOWER",
        "decoyPool": [
          "FLOWER",
          "CHOWDER",
          "POWDER",
          "COWARD"
        ],
        "decoyWord": "FLOWER",
        "faintAbove": {
          "label": "THEMATIC LINK VIA TOWER",
          "word": "\ud83d\udd17 BRIDGE \u2192 WORK \u2192 SHOP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "TIME",
          "CLOCK",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "CLOCK + TOWER = Clock tower (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "TOWER",
        "displayStem": "TOWER",
        "stemBadge": "\ud83d\udd17 LANDMARK LINK (TOWER -> BRIDGE)",
        "correctWord": "BRIDGE",
        "decoyPool": [
          "FRIDGE",
          "RIDGE",
          "MIDGE",
          "PORRIDGE"
        ],
        "decoyWord": "FRIDGE",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 WORK \u2192 SHOP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 TOWER",
          "[ ? (1/3) ]",
          "WORK \u2192 SHOP"
        ],
        "compoundHint": "TOWER + BRIDGE = Tower Bridge"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BRIDGE",
        "displayStem": "BRIDGE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 SHOP",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BRIDGE",
          "[ ? ]",
          "\ud83c\udf38 SHOP"
        ],
        "compoundHint": "BRIDGE + WORK = Bridgework"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "WORK",
        "displayStem": "BRIDGE \u2192 WORK",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "SHOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "faintAbove": {
          "label": "THEMATIC LINK VIA SHOP",
          "word": "\ud83d\udd17 KEEPER \u2192 BEE \u2192 HIVE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BRIDGE",
          "WORK",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "WORK + SHOP = Workshop (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "SHOP",
        "displayStem": "SHOP",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (SHOP -> KEEPER)",
        "correctWord": "KEEPER",
        "decoyPool": [
          "LEPER",
          "STEPPER",
          "ZIPPER",
          "SLIPPER"
        ],
        "decoyWord": "LEPER",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 BEE \u2192 HIVE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 SHOP",
          "[ ? (1/3) ]",
          "BEE \u2192 HIVE"
        ],
        "compoundHint": "SHOP + KEEPER = Shopkeeper"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "KEEPER",
        "displayStem": "KEEPER",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "BEE",
        "decoyPool": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "decoyWord": "SKI",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 HIVE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "KEEPER",
          "[ ? ]",
          "\ud83c\udf38 HIVE"
        ],
        "compoundHint": "KEEPER \u2194 BEE = Beekeeper"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BEE",
        "displayStem": "KEEPER \u2192 BEE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "HIVE",
        "decoyPool": [
          "DIVE",
          "CHIVE",
          "FIVE",
          "DRIVE"
        ],
        "decoyWord": "DIVE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA HIVE",
          "word": "\ud83d\udd17 + ZONE 2: WATER",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "KEEPER",
          "BEE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BEE + HIVE = Beehive (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "HIVE",
        "displayStem": "HIVE",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (HIVE -> WATER)",
        "correctWord": "WATER",
        "decoyPool": [
          "OTTER",
          "POTTER",
          "TROTTER",
          "BLOTTER"
        ],
        "decoyWord": "OTTER",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "WATER \u2192 FISH",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 HIVE",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "HIVE \u2194 WATER = Honeywater"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "GOLD",
        "displayStem": "GOLD",
        "correctWord": "FISH",
        "decoyPool": [
          "DISH",
          "WISH",
          "SWISH",
          "QUICHE"
        ],
        "decoyWord": "DISH",
        "compoundHint": "GOLD + FISH = Goldfish"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FISH",
        "displayStem": "FISH",
        "correctWord": "BOWL",
        "decoyPool": [
          "OWL",
          "HOWL",
          "SCOWL",
          "PROWL"
        ],
        "decoyWord": "OWL",
        "compoundHint": "FISH + BOWL = Fishbowl"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOWL",
        "displayStem": "BOWL",
        "correctWord": "CUT",
        "decoyPool": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "decoyWord": "HUT",
        "compoundHint": "BOWL + CUT = Bowl cut"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CUT",
        "displayStem": "CUT",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "CUT + BACK = Cutback"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "DROP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "compoundHint": "BACK + DROP = Backdrop"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DROP",
        "displayStem": "DROP",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "DROP + OUT = Dropout"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "FIELD",
        "decoyPool": [
          "SHIELD",
          "WIELD",
          "PEELED",
          "SEALED"
        ],
        "decoyWord": "SHIELD",
        "compoundHint": "OUT + FIELD = Outfield"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FIELD",
        "displayStem": "FIELD",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "FIELD + WORK = Fieldwork"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "DAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "compoundHint": "WORK + DAY = Workday"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DAY",
        "displayStem": "DAY",
        "correctWord": "LIGHT",
        "decoyPool": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ],
        "decoyWord": "FRIGHT",
        "compoundHint": "DAY + LIGHT = Daylight"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LIGHT",
        "displayStem": "LIGHT",
        "correctWord": "HOUSE",
        "decoyPool": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "LIGHT + HOUSE = Lighthouse"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "correctWord": "BOAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "compoundHint": "HOUSE + BOAT = Houseboat"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOAT",
        "displayStem": "BOAT",
        "correctWord": "LOAD",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "BOAT + SHOW = Boat show"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "correctWord": "CASE",
        "decoyPool": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "decoyWord": "VASE",
        "compoundHint": "SHOW + CASE = Showcase"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "CASE + BOOK = Casebook"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "compoundHint": "BOOK + MARK = Bookmark"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "MARK + UP = Markup"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "KEEP",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "UP + HOLD = Uphold"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "HOLD + OUT = Holdout"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "CAST",
        "decoyPool": [
          "BLOUSE",
          "SHUTTER",
          "GROUSE",
          "CHURN"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "OUT + LINE = Outline"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "LINE + DOWN = Linedown"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "DOWN + TURN = Downturn"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "TURN + OFF = Turnoff"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "SHOOT",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "OFF + BEAT = Offbeat"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BEAT",
        "displayStem": "BEAT",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "BEAT + UP = Beat up"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "UP + SIDE = Upside"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "compoundHint": "SIDE + STEP = Sidestep"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "STEP + DOWN = Stepdown"
      }
    ]
  },
  {
    "vineNumber": 147,
    "dateKey": "2026-11-06",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 2,
    "title": "Crimson Canopy (Ukiyo-e)",
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
        "part3Hint": "MELON + SEED = Melon seed (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Garden Link (Seed -> Bed)",
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
        "part3Hint": "SPREAD + SHEET = Spreadsheet (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Material Link (Sheet -> Metal)",
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
        "part3Hint": "WORK + BENCH = Workbench (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Bench -> Mark)",
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
        "part3Hint": "DOWN + TOWN = Downtown (\ud83c\udf38 3-Part Compound Complete!)",
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
          "nextPart1": "GOLD",
          "connection": "Zone 2 Bridge (Town -> Gold)",
          "hint": "TOWN \u2194 GOLD = Boomtown gold",
          "decoys": [
            "MOLD",
            "SCOLD",
            "SCALD",
            "BALD"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "SEA",
        "target": "PORT",
        "hint": "SEA + PORT = Seaport",
        "decoys": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ]
      },
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
        "target": "MATE",
        "hint": "SHIP + MATE = Shipmate",
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
        "hint": "MATE + WORK = Team/Mate work",
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
        "target": "ADOR",
        "hint": "MAT + BOARD = Matboard",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3Compounds": [
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
      },
      {
        "stem": "WALK",
        "target": "UP",
        "hint": "WALK + UP = Walkup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "SET",
        "hint": "UP + SET = Upset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "DOWN",
        "hint": "SET + DOWN = Setdown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "LOAD",
        "hint": "DOWN + POUR = Downpour",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "WATER",
        "displayStem": "WATER",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "MELON",
        "decoyPool": [
          "FELON",
          "LEMON",
          "HERON",
          "TALON"
        ],
        "decoyWord": "FELON",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 SEED",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "WATER",
          "[ ? ]",
          "\ud83c\udf38 SEED"
        ],
        "compoundHint": "WATER + MELON = Watermelon"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "MELON",
        "displayStem": "WATER \u2192 MELON",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "SEED",
        "decoyPool": [
          "STEED",
          "TWEED",
          "GREED",
          "CREED"
        ],
        "decoyWord": "STEED",
        "faintAbove": {
          "label": "THEMATIC LINK VIA SEED",
          "word": "\ud83d\udd17 BED \u2192 SPREAD \u2192 SHEET",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "WATER",
          "MELON",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "MELON + SEED = Melon seed (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "SEED",
        "displayStem": "SEED",
        "stemBadge": "\ud83d\udd17 GARDEN LINK (SEED -> BED)",
        "correctWord": "BED",
        "decoyPool": [
          "SLED",
          "SHRED",
          "THREAD",
          "DREAD"
        ],
        "decoyWord": "SLED",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 SPREAD \u2192 SHEET",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 SEED",
          "[ ? (1/3) ]",
          "SPREAD \u2192 SHEET"
        ],
        "compoundHint": "SEED + BED = Seedbed"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BED",
        "displayStem": "BED",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "SPREAD",
        "decoyPool": [
          "SHRED",
          "THREAD",
          "DREAD",
          "TREAD"
        ],
        "decoyWord": "SHRED",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 SHEET",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BED",
          "[ ? ]",
          "\ud83c\udf38 SHEET"
        ],
        "compoundHint": "BED + SPREAD = Bedspread"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "SPREAD",
        "displayStem": "BED \u2192 SPREAD",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "SHEET",
        "decoyPool": [
          "SLEET",
          "FLEET",
          "GREET",
          "PLEAT"
        ],
        "decoyWord": "SLEET",
        "faintAbove": {
          "label": "THEMATIC LINK VIA SHEET",
          "word": "\ud83d\udd17 METAL \u2192 WORK \u2192 BENCH",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BED",
          "SPREAD",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "SPREAD + SHEET = Spreadsheet (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "SHEET",
        "displayStem": "SHEET",
        "stemBadge": "\ud83d\udd17 MATERIAL LINK (SHEET -> METAL)",
        "correctWord": "METAL",
        "decoyPool": [
          "PETAL",
          "KETTLE",
          "NETTLE",
          "SETTLE"
        ],
        "decoyWord": "PETAL",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 WORK \u2192 BENCH",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 SHEET",
          "[ ? (1/3) ]",
          "WORK \u2192 BENCH"
        ],
        "compoundHint": "SHEET + METAL = Sheet metal"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "METAL",
        "displayStem": "METAL",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BENCH",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "METAL",
          "[ ? ]",
          "\ud83c\udf38 BENCH"
        ],
        "compoundHint": "METAL + WORK = Metalwork"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "WORK",
        "displayStem": "METAL \u2192 WORK",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BENCH",
          "word": "\ud83d\udd17 MARK \u2192 DOWN \u2192 TOWN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "METAL",
          "WORK",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "WORK + BENCH = Workbench (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BENCH",
        "displayStem": "BENCH",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (BENCH -> MARK)",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 DOWN \u2192 TOWN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BENCH",
          "[ ? (1/3) ]",
          "DOWN \u2192 TOWN"
        ],
        "compoundHint": "BENCH + MARK = Benchmark"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 TOWN",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "MARK",
          "[ ? ]",
          "\ud83c\udf38 TOWN"
        ],
        "compoundHint": "MARK + DOWN = Markdown"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "DOWN",
        "displayStem": "MARK \u2192 DOWN",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "TOWN",
        "decoyPool": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "decoyWord": "CLOWN",
        "faintAbove": {
          "label": "THEMATIC LINK VIA TOWN",
          "word": "\ud83d\udd17 + ZONE 2: GOLD",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "MARK",
          "DOWN",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "DOWN + TOWN = Downtown (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "TOWN",
        "displayStem": "TOWN",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (TOWN -> GOLD)",
        "correctWord": "GOLD",
        "decoyPool": [
          "MOLD",
          "SCOLD",
          "SCALD",
          "BALD"
        ],
        "decoyWord": "MOLD",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "GOLD \u2192 PORT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 TOWN",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "TOWN \u2194 GOLD = Boomtown gold"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SEA",
        "displayStem": "SEA",
        "correctWord": "PORT",
        "decoyPool": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ],
        "decoyWord": "FORT",
        "compoundHint": "SEA + PORT = Seaport"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PORT",
        "displayStem": "PORT",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "compoundHint": "PORT + HOLE = Porthole"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "correctWord": "PUNCH",
        "decoyPool": [
          "LUNCH",
          "HUNCH",
          "CRUNCH",
          "BRUNCH"
        ],
        "decoyWord": "LUNCH",
        "compoundHint": "HOLE + PUNCH = Hole punch"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PUNCH",
        "displayStem": "PUNCH",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "PUNCH + LINE = Punchline"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "LINE + UP = Lineup"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "TOWN",
        "decoyPool": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "UP + TOWN = Uptown"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "TOWN",
        "displayStem": "TOWN",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "compoundHint": "TOWN + SHIP = Township"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHIP",
        "displayStem": "SHIP",
        "correctWord": "MATE",
        "decoyPool": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "decoyWord": "CRATE",
        "compoundHint": "SHIP + MATE = Shipmate"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MATE",
        "displayStem": "MATE",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "MATE + WORK = Team/Mate work"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "HORSE",
        "decoyPool": [
          "MORSE",
          "CORPSE",
          "REMORSE",
          "GORSE"
        ],
        "decoyWord": "MORSE",
        "compoundHint": "WORK + HORSE = Workhorse"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HORSE",
        "displayStem": "HORSE",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "HORSE + BACK = Horseback"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "FIRE",
        "decoyPool": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ],
        "decoyWord": "CHOIR",
        "compoundHint": "BACK + FIRE = Backfire"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FIRE",
        "displayStem": "FIRE",
        "correctWord": "PLACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "compoundHint": "FIRE + PLACE = Fireplace"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PLACE",
        "displayStem": "PLACE",
        "correctWord": "MAT",
        "decoyPool": [
          "BAT",
          "GNAT",
          "BRAT",
          "SPAT"
        ],
        "decoyWord": "BAT",
        "compoundHint": "PLACE + MAT = Placemat"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MAT",
        "displayStem": "MAT",
        "correctWord": "ADOR",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "MAT + BOARD = Matboard"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "correctWord": "GAME",
        "decoyPool": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ],
        "decoyWord": "FLAME",
        "compoundHint": "BOARD + GAME = Board game"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "GAME",
        "displayStem": "GAME",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "GAME + OVER = Game over"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "compoundHint": "OVER + TIME = Overtime"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "TIME + LINE = Timeline"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "LINE + OUT = Lineout"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "OUT + FALL = Outfall"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "FALL + OFF = Falloff"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "OFF + SIDE = Offside"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "compoundHint": "SIDE + WALK = Sidewalk"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "WALK + UP = Walkup"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "compoundHint": "UP + SET = Upset"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SET",
        "displayStem": "SET",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "SET + DOWN = Setdown"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "LOAD",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "DOWN + POUR = Downpour"
      }
    ]
  },
  {
    "vineNumber": 148,
    "dateKey": "2026-11-07",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 0,
    "title": "Midnight Bioluminescence",
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
        "part3Hint": "MINE + FIELD = Minefield (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "School Link (Field -> Trip)",
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
        "part3Hint": "WIRE + TAP = Wiretap (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Stage Link (Tap -> Dance)",
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
        "id": "dance_floor_plan",
        "parts": [
          "DANCE",
          "FLOOR",
          "PLAN"
        ],
        "part2Hint": "DANCE + FLOOR = Dance floor",
        "part3Hint": "FLOOR + PLAN = Floor plan (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "part3Decoys": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ],
        "thematicLink": {
          "nextPart1": "BOARD",
          "connection": "Compound Link (Plan -> Board)",
          "hint": "PLAN \u2194 BOARD = Planning board",
          "decoys": [
            "CHORD",
            "SWORD",
            "GOURD",
            "FJORD"
          ]
        }
      },
      {
        "id": "board_walk_way",
        "parts": [
          "BOARD",
          "WALK",
          "WAY"
        ],
        "part2Hint": "BOARD + WALK = Boardwalk",
        "part3Hint": "WALK + WAY = Walkway (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "part3Decoys": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "thematicLink": {
          "nextPart1": "SEA",
          "connection": "Zone 2 Bridge (Way -> Sea)",
          "hint": "WAY \u2194 SEA = Seaway",
          "decoys": [
            "SKI",
            "FLEA",
            "PEA",
            "TEA"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "WIND",
        "target": "FALL",
        "hint": "WIND + FALL = Windfall",
        "decoys": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ]
      },
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
        "target": "HILL",
        "hint": "DOWN + TOWN = Downtown",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ]
      }
    ],
    "zone3Compounds": [
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
      },
      {
        "stem": "SHOW",
        "target": "OFF",
        "hint": "SHOW + OFF = Showoff",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      },
      {
        "stem": "OFF",
        "target": "LINE",
        "hint": "OFF + LINE = Offline",
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
        "target": "DOWN",
        "hint": "RUN + DOWN = Rundown",
        "decoys": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ]
      },
      {
        "stem": "DOWN",
        "target": "BEAT",
        "hint": "DOWN + BEAT = Downbeat",
        "decoys": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "GOLD",
        "displayStem": "GOLD",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "MINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 FIELD",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "GOLD",
          "[ ? ]",
          "\ud83c\udf38 FIELD"
        ],
        "compoundHint": "GOLD + MINE = Goldmine"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "MINE",
        "displayStem": "GOLD \u2192 MINE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "FIELD",
        "decoyPool": [
          "SHIELD",
          "YIELD",
          "WIELD",
          "PEELED"
        ],
        "decoyWord": "SHIELD",
        "faintAbove": {
          "label": "THEMATIC LINK VIA FIELD",
          "word": "\ud83d\udd17 TRIP \u2192 WIRE \u2192 TAP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "GOLD",
          "MINE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "MINE + FIELD = Minefield (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "FIELD",
        "displayStem": "FIELD",
        "stemBadge": "\ud83d\udd17 SCHOOL LINK (FIELD -> TRIP)",
        "correctWord": "TRIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 WIRE \u2192 TAP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 FIELD",
          "[ ? (1/3) ]",
          "WIRE \u2192 TAP"
        ],
        "compoundHint": "FIELD + TRIP = Field trip"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "TRIP",
        "displayStem": "TRIP",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "WIRE",
        "decoyPool": [
          "CHOIR",
          "BRIAR",
          "FRIAR",
          "SPIRE"
        ],
        "decoyWord": "CHOIR",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 TAP",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "TRIP",
          "[ ? ]",
          "\ud83c\udf38 TAP"
        ],
        "compoundHint": "TRIP + WIRE = Tripwire"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "WIRE",
        "displayStem": "TRIP \u2192 WIRE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "TAP",
        "decoyPool": [
          "CLAP",
          "SLAP",
          "SCRAP",
          "CHAP"
        ],
        "decoyWord": "CLAP",
        "faintAbove": {
          "label": "THEMATIC LINK VIA TAP",
          "word": "\ud83d\udd17 DANCE \u2192 FLOOR \u2192 PLAN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "TRIP",
          "WIRE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "WIRE + TAP = Wiretap (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "TAP",
        "displayStem": "TAP",
        "stemBadge": "\ud83d\udd17 STAGE LINK (TAP -> DANCE)",
        "correctWord": "DANCE",
        "decoyPool": [
          "LANCE",
          "TRANCE",
          "GLANCE",
          "PRANCE"
        ],
        "decoyWord": "LANCE",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 FLOOR \u2192 PLAN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 TAP",
          "[ ? (1/3) ]",
          "FLOOR \u2192 PLAN"
        ],
        "compoundHint": "TAP + DANCE = Tap dance"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "DANCE",
        "displayStem": "DANCE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "FLOOR",
        "decoyPool": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "decoyWord": "SNORE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 PLAN",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "DANCE",
          "[ ? ]",
          "\ud83c\udf38 PLAN"
        ],
        "compoundHint": "DANCE + FLOOR = Dance floor"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "FLOOR",
        "displayStem": "DANCE \u2192 FLOOR",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "PLAN",
        "decoyPool": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ],
        "decoyWord": "CLAN",
        "faintAbove": {
          "label": "THEMATIC LINK VIA PLAN",
          "word": "\ud83d\udd17 BOARD \u2192 WALK \u2192 WAY",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "DANCE",
          "FLOOR",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "FLOOR + PLAN = Floor plan (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "PLAN",
        "displayStem": "PLAN",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (PLAN -> BOARD)",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 WALK \u2192 WAY",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 PLAN",
          "[ ? (1/3) ]",
          "WALK \u2192 WAY"
        ],
        "compoundHint": "PLAN \u2194 BOARD = Planning board"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WAY",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BOARD",
          "[ ? ]",
          "\ud83c\udf38 WAY"
        ],
        "compoundHint": "BOARD + WALK = Boardwalk"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "WALK",
        "displayStem": "BOARD \u2192 WALK",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "decoyWord": "CLAY",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WAY",
          "word": "\ud83d\udd17 + ZONE 2: SEA",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BOARD",
          "WALK",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "WALK + WAY = Walkway (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (WAY -> SEA)",
        "correctWord": "SEA",
        "decoyPool": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "decoyWord": "SKI",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "SEA \u2192 FALL",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WAY",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "WAY \u2194 SEA = Seaway"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WIND",
        "displayStem": "WIND",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "WIND + FALL = Windfall"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "FALL + OUT = Fallout"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "POST",
        "decoyPool": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ],
        "decoyWord": "GHOST",
        "compoundHint": "OUT + POST = Outpost"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POST",
        "displayStem": "POST",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "compoundHint": "POST + CARD = Postcard"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "compoundHint": "CARD + BOARD = Cardboard"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "compoundHint": "BOARD + ROOM = Boardroom"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "ROOM + WORK = Roomwork"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "SHOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "compoundHint": "WORK + SHOP = Workshop"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHOP",
        "displayStem": "SHOP",
        "correctWord": "LIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "compoundHint": "SHOP + LIFT = Shoplift"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LIFT",
        "displayStem": "LIFT",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "LIFT + OFF = Liftoff"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "compoundHint": "OFF + SET = Offset"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SET",
        "displayStem": "SET",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "SET + UP = Setup"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "LAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "compoundHint": "UP + LAND = Upland"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LAND",
        "displayStem": "LAND",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "compoundHint": "LAND + MARK = Landmark"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "MARK + DOWN = Markdown"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "HILL",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "DOWN + TOWN = Downtown"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TOWN",
        "displayStem": "TOWN",
        "correctWord": "HOUSE",
        "decoyPool": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "TOWN + HOUSE = Townhouse"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "correctWord": "TOP",
        "decoyPool": [
          "MOP",
          "CROP",
          "PLOP",
          "SLOP"
        ],
        "decoyWord": "MOP",
        "compoundHint": "HOUSE + TOP = Housetop"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TOP",
        "displayStem": "TOP",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "TOP + SIDE = Topside"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "compoundHint": "SIDE + SHOW = Sideshow"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "SHOW + OFF = Showoff"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "OFF + LINE = Offline"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "LINE + UP = Lineup"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "UP + TURN = Upturn"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "TURN + OUT = Turnout"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "compoundHint": "OUT + RUN = Outrun"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "RUN + DOWN = Rundown"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "BEAT",
        "decoyPool": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ],
        "decoyWord": "WHEAT",
        "compoundHint": "DOWN + BEAT = Downbeat"
      }
    ]
  },
  {
    "vineNumber": 149,
    "dateKey": "2026-11-08",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 1,
    "title": "Sunlit Conservatory",
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
        "part3Hint": "SHELL + SHOCK = Shell shock (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Physics Link (Shock -> Wave)",
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
        "part3Hint": "LENGTH + WAY = Lengthway (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Way -> Side)",
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
        "id": "side_step_stone",
        "parts": [
          "SIDE",
          "STEP",
          "STONE"
        ],
        "part2Hint": "SIDE + STEP = Sidestep",
        "part3Hint": "STEP + STONE = Stepping stone (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Masonry Link (Stone -> Wall)",
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
        "id": "wall_paper_clip",
        "parts": [
          "WALL",
          "PAPER",
          "CLIP"
        ],
        "part2Hint": "WALL + PAPER = Wallpaper",
        "part3Hint": "PAPER + CLIP = Paperclip (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ],
        "part3Decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "thematicLink": {
          "nextPart1": "WIND",
          "connection": "Zone 2 Bridge (Clip -> Wind)",
          "hint": "CLIP \u2194 WIND = Clipper wind",
          "decoys": [
            "RIND",
            "BLIND",
            "GRIND",
            "MIND"
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
        "target": "LOAD",
        "hint": "WORK + OUT = Workout",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      },
      {
        "stem": "STEP",
        "target": "SON",
        "hint": "STEP + DOWN = Stepdown",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "MAN",
        "hint": "LINE + UP = Lineup",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3Compounds": [
      {
        "stem": "OVER",
        "target": "PASS",
        "hint": "OVER + FLOW = Overflow",
        "decoys": [
          "FABLE",
          "SHUTTER",
          "SNORE",
          "GROUSE"
        ]
      },
      {
        "stem": "FLOW",
        "target": "OUT",
        "hint": "FLOW + OUT = Outflow",
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
      },
      {
        "stem": "POUR",
        "target": "OUT",
        "hint": "POUR + OUT = Pourout",
        "decoys": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ]
      },
      {
        "stem": "OUT",
        "target": "SET",
        "hint": "OUT + SET = Outset",
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
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "SEA",
        "displayStem": "SEA",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "SHELL",
        "decoyPool": [
          "SPELL",
          "YELL",
          "SMELL",
          "DWELL"
        ],
        "decoyWord": "SPELL",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 SHOCK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SEA",
          "[ ? ]",
          "\ud83c\udf38 SHOCK"
        ],
        "compoundHint": "SEA + SHELL = Seashell"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "SHELL",
        "displayStem": "SEA \u2192 SHELL",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "SHOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "CLOCK"
        ],
        "decoyWord": "FLOCK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA SHOCK",
          "word": "\ud83d\udd17 WAVE \u2192 LENGTH \u2192 WAY",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SEA",
          "SHELL",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "SHELL + SHOCK = Shell shock (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "SHOCK",
        "displayStem": "SHOCK",
        "stemBadge": "\ud83d\udd17 PHYSICS LINK (SHOCK -> WAVE)",
        "correctWord": "WAVE",
        "decoyPool": [
          "CAVE",
          "BRAVE",
          "GRAVE",
          "SHAVE"
        ],
        "decoyWord": "CAVE",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 LENGTH \u2192 WAY",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 SHOCK",
          "[ ? (1/3) ]",
          "LENGTH \u2192 WAY"
        ],
        "compoundHint": "SHOCK + WAVE = Shockwave"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "WAVE",
        "displayStem": "WAVE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "LENGTH",
        "decoyPool": [
          "STRENGTH",
          "TENTH",
          "PLINTH",
          "LABYRINTH"
        ],
        "decoyWord": "STRENGTH",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WAY",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "WAVE",
          "[ ? ]",
          "\ud83c\udf38 WAY"
        ],
        "compoundHint": "WAVE + LENGTH = Wavelength"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "LENGTH",
        "displayStem": "WAVE \u2192 LENGTH",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WAY",
          "word": "\ud83d\udd17 SIDE \u2192 STEP \u2192 STONE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "WAVE",
          "LENGTH",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "LENGTH + WAY = Lengthway (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (WAY -> SIDE)",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 STEP \u2192 STONE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WAY",
          "[ ? (1/3) ]",
          "STEP \u2192 STONE"
        ],
        "compoundHint": "WAY + SIDE = Wayside"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 STONE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SIDE",
          "[ ? ]",
          "\ud83c\udf38 STONE"
        ],
        "compoundHint": "SIDE + STEP = Sidestep"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "STEP",
        "displayStem": "SIDE \u2192 STEP",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "STONE",
        "decoyPool": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "decoyWord": "CONE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA STONE",
          "word": "\ud83d\udd17 WALL \u2192 PAPER \u2192 CLIP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SIDE",
          "STEP",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "STEP + STONE = Stepping stone (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "STONE",
        "displayStem": "STONE",
        "stemBadge": "\ud83d\udd17 MASONRY LINK (STONE -> WALL)",
        "correctWord": "WALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 PAPER \u2192 CLIP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 STONE",
          "[ ? (1/3) ]",
          "PAPER \u2192 CLIP"
        ],
        "compoundHint": "STONE + WALL = Stonewall"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "WALL",
        "displayStem": "WALL",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "PAPER",
        "decoyPool": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ],
        "decoyWord": "CAPER",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 CLIP",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "WALL",
          "[ ? ]",
          "\ud83c\udf38 CLIP"
        ],
        "compoundHint": "WALL + PAPER = Wallpaper"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "PAPER",
        "displayStem": "WALL \u2192 PAPER",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "CLIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "faintAbove": {
          "label": "THEMATIC LINK VIA CLIP",
          "word": "\ud83d\udd17 + ZONE 2: WIND",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "WALL",
          "PAPER",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "PAPER + CLIP = Paperclip (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "CLIP",
        "displayStem": "CLIP",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (CLIP -> WIND)",
        "correctWord": "WIND",
        "decoyPool": [
          "RIND",
          "BLIND",
          "GRIND",
          "MIND"
        ],
        "decoyWord": "RIND",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "WIND \u2192 BOOK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 CLIP",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "CLIP \u2194 WIND = Clipper wind"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "NOTE",
        "displayStem": "NOTE",
        "correctWord": "BOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "NOTE + BOOK = Notebook"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOOK",
        "displayStem": "BOOK",
        "correctWord": "CASE",
        "decoyPool": [
          "VASE",
          "LACE",
          "MACE",
          "BRACE"
        ],
        "decoyWord": "VASE",
        "compoundHint": "BOOK + CASE = Bookcase"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CASE",
        "displayStem": "CASE",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "CASE + WORK = Casework"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "LOAD",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "DOOR",
        "decoyPool": [
          "CHORE",
          "SPORE",
          "BOAR",
          "BLOUSE"
        ],
        "decoyWord": "CHORE",
        "compoundHint": "OUT + DOOR = Outdoor"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOOR",
        "displayStem": "DOOR",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "compoundHint": "DOOR + STEP = Doorstep"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "correctWord": "SON",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "STEP + DOWN = Stepdown"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "DOWN + FALL = Downfall"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "FALL + BACK = Fallback"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "HAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "compoundHint": "BACK + HAND = Backhand"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HAND",
        "displayStem": "HAND",
        "correctWord": "BAG",
        "decoyPool": [
          "STAG",
          "CRAG",
          "BRAG",
          "SNAG"
        ],
        "decoyWord": "STAG",
        "compoundHint": "HAND + BAG = Handbag"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BAG",
        "displayStem": "BAG",
        "correctWord": "PIPE",
        "decoyPool": [
          "SNIPE",
          "STRIPE",
          "GRIPE",
          "SWIPE"
        ],
        "decoyWord": "SNIPE",
        "compoundHint": "BAG + PIPE = Bagpipe"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PIPE",
        "displayStem": "PIPE",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "PIPE + LINE = Pipeline"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "MAN",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "LINE + UP = Lineup"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "HOLD",
        "decoyPool": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ],
        "decoyWord": "MOLD",
        "compoundHint": "UP + HOLD = Uphold"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "HOLD + OVER = Holdover"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "PASS",
        "decoyPool": [
          "FABLE",
          "SHUTTER",
          "SNORE",
          "GROUSE"
        ],
        "decoyWord": "FABLE",
        "compoundHint": "OVER + FLOW = Overflow"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "FLOW",
        "displayStem": "FLOW",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "FLOW + OUT = Outflow"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "BREAK",
        "decoyPool": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ],
        "decoyWord": "STEAK",
        "compoundHint": "OUT + BREAK = Outbreak"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BREAK",
        "displayStem": "BREAK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "BREAK + UP = Breakup"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "LIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "compoundHint": "UP + LIFT = Uplift"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LIFT",
        "displayStem": "LIFT",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "LIFT + OFF = Liftoff"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "BEAT",
        "decoyPool": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ],
        "decoyWord": "WHEAT",
        "compoundHint": "OFF + BEAT = Offbeat"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BEAT",
        "displayStem": "BEAT",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "BEAT + DOWN = Beatdown"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "POUR",
        "decoyPool": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "decoyWord": "SNORE",
        "compoundHint": "DOWN + POUR = Downpour"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "POUR",
        "displayStem": "POUR",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "POUR + OUT = Pourout"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "compoundHint": "OUT + SET = Outset"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SET",
        "displayStem": "SET",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "SET + BACK = Setback"
      }
    ]
  },
  {
    "vineNumber": 150,
    "dateKey": "2026-11-09",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 2,
    "title": "Crimson Canopy (Ukiyo-e)",
    "chainSetIndex": 8,
    "zone1Triplets": [
      {
        "id": "wind_mill_stone",
        "parts": [
          "WIND",
          "MILL",
          "STONE"
        ],
        "part2Hint": "WIND + MILL = Windmill",
        "part3Hint": "MILL + STONE = Millstone (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Masonry Link (Stone -> Wall)",
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
        "part3Hint": "FLOWER + BED = Flowerbed (\ud83c\udf38 3-Part Compound Complete!)",
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
          "nextPart1": "ROOM",
          "connection": "Home Link (Bed -> Room)",
          "hint": "BED + ROOM = Bedroom",
          "decoys": [
            "BROOM",
            "GROOM",
            "GLOOM",
            "LOOM"
          ]
        }
      },
      {
        "id": "room_mate_ship",
        "parts": [
          "ROOM",
          "MATE",
          "SHIP"
        ],
        "part2Hint": "ROOM + MATE = Roommate",
        "part3Hint": "MATE + SHIP = Shipmate (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "part3Decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "thematicLink": {
          "nextPart1": "BOARD",
          "connection": "Nautical Link (Ship -> Board)",
          "hint": "SHIP + BOARD = Shipboard",
          "decoys": [
            "CHORD",
            "SWORD",
            "GOURD",
            "FJORD"
          ]
        }
      },
      {
        "id": "board_game_plan",
        "parts": [
          "BOARD",
          "GAME",
          "PLAN"
        ],
        "part2Hint": "BOARD + GAME = Board game",
        "part3Hint": "GAME + PLAN = Game plan (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ],
        "part3Decoys": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ],
        "thematicLink": {
          "nextPart1": "NOTE",
          "connection": "Zone 2 Bridge (Plan -> Note)",
          "hint": "PLAN \u2194 NOTE = Keynote plan",
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
        "stem": "SAND",
        "target": "BOX",
        "hint": "SAND + BOX = Sandbox",
        "decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ]
      },
      {
        "stem": "BOX",
        "target": "CAR",
        "hint": "BOX + CAR = Boxcar",
        "decoys": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ]
      },
      {
        "stem": "CAR",
        "target": "POOL",
        "hint": "CAR + POOL = Carpool",
        "decoys": [
          "SPOOL",
          "DROOL",
          "FOOL",
          "GHOUL"
        ]
      },
      {
        "stem": "POOL",
        "target": "SIDE",
        "hint": "POOL + SIDE = Poolside",
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
      },
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
        "hint": "HOLE -> CARD + SHARK = Card shark",
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
      }
    ],
    "zone3Compounds": [
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
        "target": "DOWN",
        "hint": "TURN + DOWN = Turndown",
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
        "target": "KEY",
        "hint": "SHIFT + KEY = Shift key",
        "decoys": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ]
      },
      {
        "stem": "KEY",
        "target": "HOLE",
        "hint": "KEY + HOLE = Keyhole",
        "decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ]
      },
      {
        "stem": "HOLE",
        "target": "UP",
        "hint": "HOLE + UP = Hole up",
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
        "target": "OFF",
        "hint": "START + OFF = Start off",
        "decoys": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ]
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "WIND",
        "displayStem": "WIND",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "MILL",
        "decoyPool": [
          "QUILL",
          "GRILL",
          "FRILL",
          "DRILL"
        ],
        "decoyWord": "QUILL",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 STONE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "WIND",
          "[ ? ]",
          "\ud83c\udf38 STONE"
        ],
        "compoundHint": "WIND + MILL = Windmill"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "MILL",
        "displayStem": "WIND \u2192 MILL",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "STONE",
        "decoyPool": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "decoyWord": "CONE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA STONE",
          "word": "\ud83d\udd17 WALL \u2192 FLOWER \u2192 BED",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "WIND",
          "MILL",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "MILL + STONE = Millstone (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "STONE",
        "displayStem": "STONE",
        "stemBadge": "\ud83d\udd17 MASONRY LINK (STONE -> WALL)",
        "correctWord": "WALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 FLOWER \u2192 BED",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 STONE",
          "[ ? (1/3) ]",
          "FLOWER \u2192 BED"
        ],
        "compoundHint": "STONE + WALL = Stonewall"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "WALL",
        "displayStem": "WALL",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "FLOWER",
        "decoyPool": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ],
        "decoyWord": "TOWER",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BED",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "WALL",
          "[ ? ]",
          "\ud83c\udf38 BED"
        ],
        "compoundHint": "WALL + FLOWER = Wallflower"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "FLOWER",
        "displayStem": "WALL \u2192 FLOWER",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "BED",
        "decoyPool": [
          "SLED",
          "SHRED",
          "THREAD",
          "DREAD"
        ],
        "decoyWord": "SLED",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BED",
          "word": "\ud83d\udd17 ROOM \u2192 MATE \u2192 SHIP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "WALL",
          "FLOWER",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "FLOWER + BED = Flowerbed (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BED",
        "displayStem": "BED",
        "stemBadge": "\ud83d\udd17 HOME LINK (BED -> ROOM)",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 MATE \u2192 SHIP",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BED",
          "[ ? (1/3) ]",
          "MATE \u2192 SHIP"
        ],
        "compoundHint": "BED + ROOM = Bedroom"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "MATE",
        "decoyPool": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "decoyWord": "CRATE",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 SHIP",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "ROOM",
          "[ ? ]",
          "\ud83c\udf38 SHIP"
        ],
        "compoundHint": "ROOM + MATE = Roommate"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "MATE",
        "displayStem": "ROOM \u2192 MATE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "faintAbove": {
          "label": "THEMATIC LINK VIA SHIP",
          "word": "\ud83d\udd17 BOARD \u2192 GAME \u2192 PLAN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "ROOM",
          "MATE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "MATE + SHIP = Shipmate (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "SHIP",
        "displayStem": "SHIP",
        "stemBadge": "\ud83d\udd17 NAUTICAL LINK (SHIP -> BOARD)",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 GAME \u2192 PLAN",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 SHIP",
          "[ ? (1/3) ]",
          "GAME \u2192 PLAN"
        ],
        "compoundHint": "SHIP + BOARD = Shipboard"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "GAME",
        "decoyPool": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ],
        "decoyWord": "FLAME",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 PLAN",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "BOARD",
          "[ ? ]",
          "\ud83c\udf38 PLAN"
        ],
        "compoundHint": "BOARD + GAME = Board game"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "GAME",
        "displayStem": "BOARD \u2192 GAME",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "PLAN",
        "decoyPool": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ],
        "decoyWord": "CLAN",
        "faintAbove": {
          "label": "THEMATIC LINK VIA PLAN",
          "word": "\ud83d\udd17 + ZONE 2: NOTE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "BOARD",
          "GAME",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "GAME + PLAN = Game plan (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "PLAN",
        "displayStem": "PLAN",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (PLAN -> NOTE)",
        "correctWord": "NOTE",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "NOTE \u2192 BOX",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 PLAN",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "PLAN \u2194 NOTE = Keynote plan"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SAND",
        "displayStem": "SAND",
        "correctWord": "BOX",
        "decoyPool": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "decoyWord": "FOX",
        "compoundHint": "SAND + BOX = Sandbox"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOX",
        "displayStem": "BOX",
        "correctWord": "CAR",
        "decoyPool": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ],
        "decoyWord": "SCAR",
        "compoundHint": "BOX + CAR = Boxcar"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CAR",
        "displayStem": "CAR",
        "correctWord": "POOL",
        "decoyPool": [
          "SPOOL",
          "DROOL",
          "FOOL",
          "GHOUL"
        ],
        "decoyWord": "SPOOL",
        "compoundHint": "CAR + POOL = Carpool"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POOL",
        "displayStem": "POOL",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "POOL + SIDE = Poolside"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "compoundHint": "SIDE + STEP = Sidestep"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "correctWord": "STONE",
        "decoyPool": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "decoyWord": "CONE",
        "compoundHint": "STEP + STONE = Stepping stone"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "STONE",
        "displayStem": "STONE",
        "correctWord": "WALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "STONE + WALL = Stonewall"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WALL",
        "displayStem": "WALL",
        "correctWord": "FLOWER",
        "decoyPool": [
          "TOWER",
          "COWARD",
          "CHOWDER",
          "POWDER"
        ],
        "decoyWord": "TOWER",
        "compoundHint": "WALL + FLOWER = Wallflower"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FLOWER",
        "displayStem": "FLOWER",
        "correctWord": "POT",
        "decoyPool": [
          "BLOT",
          "KNOT",
          "TROT",
          "YACHT"
        ],
        "decoyWord": "BLOT",
        "compoundHint": "FLOWER + POT = Flowerpot"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POT",
        "displayStem": "POT",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "compoundHint": "POT + HOLE = Pothole"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "compoundHint": "HOLE + CARD = Hole card"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "correctWord": "SHARK",
        "decoyPool": [
          "LARK",
          "SPARK",
          "BARK",
          "DARK"
        ],
        "decoyWord": "LARK",
        "compoundHint": "HOLE -> CARD + SHARK = Card shark"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHARK",
        "displayStem": "SHARK",
        "correctWord": "TANK",
        "decoyPool": [
          "PRANK",
          "CRANK",
          "PLANK",
          "FLANK"
        ],
        "decoyWord": "PRANK",
        "compoundHint": "SHARK + TANK = Shark tank"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "TANK",
        "displayStem": "TANK",
        "correctWord": "TOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "compoundHint": "TANK + TOP = Tank top"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "TOP",
        "displayStem": "TOP",
        "correctWord": "DOG",
        "decoyPool": [
          "FOG",
          "BOG",
          "CLOG",
          "FROG"
        ],
        "decoyWord": "FOG",
        "compoundHint": "TOP + DOG = Top dog"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOG",
        "displayStem": "DOG",
        "correctWord": "HOUSE",
        "decoyPool": [
          "BLOUSE",
          "GROUSE",
          "SPOUSE",
          "MOUSE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "DOG + HOUSE = Doghouse"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "HOUSE + WORK = Housework"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "WORK + OUT = Workout"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "OUT + LOOK = Outlook"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "LOOK + OVER = Look over"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "OVER + TURN = Overturn"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "TURN + DOWN = Turndown"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "SHIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "compoundHint": "DOWN + SHIFT = Downshift"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SHIFT",
        "displayStem": "SHIFT",
        "correctWord": "KEY",
        "decoyPool": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "decoyWord": "SKI",
        "compoundHint": "SHIFT + KEY = Shift key"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "KEY",
        "displayStem": "KEY",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "compoundHint": "KEY + HOLE = Keyhole"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "HOLE + UP = Hole up"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "START",
        "decoyPool": [
          "CART",
          "CHART",
          "SMART",
          "PART"
        ],
        "decoyWord": "CART",
        "compoundHint": "UP + START = Upstart"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "START",
        "displayStem": "START",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "START + OFF = Start off"
      }
    ]
  },
  {
    "vineNumber": 151,
    "dateKey": "2026-11-10",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 0,
    "title": "Midnight Bioluminescence",
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
        "part3Hint": "PAD + LOCK = Padlock (\ud83c\udf38 3-Part Compound Complete!)",
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
          "nextPart1": "KEY",
          "connection": "Hardware Link (Lock -> Key)",
          "hint": "LOCK \u2194 KEY = Keylock",
          "decoys": [
            "SKI",
            "FLEA",
            "PEA",
            "TEA"
          ]
        }
      },
      {
        "id": "key_board_walk",
        "parts": [
          "KEY",
          "BOARD",
          "WALK"
        ],
        "part2Hint": "KEY + BOARD = Keyboard",
        "part3Hint": "BOARD + WALK = Boardwalk (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Compound Link (Walk -> Out)",
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
        "part3Hint": "POST + OFFICE = Post office (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Workplace Link (Office -> Space)",
          "hint": "OFFICE + SPACE = Office space",
          "decoys": [
            "LACE",
            "MACE",
            "BRACE",
            "GRACE"
          ]
        }
      },
      {
        "id": "space_ship_wreck",
        "parts": [
          "SPACE",
          "SHIP",
          "WRECK"
        ],
        "part2Hint": "SPACE + SHIP = Spaceship",
        "part3Hint": "SHIP + WRECK = Shipwreck (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "part3Decoys": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ],
        "thematicLink": {
          "nextPart1": "SAND",
          "connection": "Zone 2 Bridge (Wreck -> Sand)",
          "hint": "WRECK \u2194 SAND = Sandbar",
          "decoys": [
            "STRAND",
            "BRAND",
            "GLAND",
            "BLAND"
          ]
        }
      }
    ],
    "zone2Compounds": [
      {
        "stem": "HAIR",
        "target": "CUT",
        "hint": "HAIR + CUT = Haircut",
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
      }
    ],
    "zone3Compounds": [
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
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "NOTE",
        "displayStem": "NOTE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "PAD",
        "decoyPool": [
          "PLAID",
          "GLAD",
          "CLAD",
          "BRAD"
        ],
        "decoyWord": "PLAID",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 LOCK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "NOTE",
          "[ ? ]",
          "\ud83c\udf38 LOCK"
        ],
        "compoundHint": "NOTE + PAD = Notepad"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "PAD",
        "displayStem": "NOTE \u2192 PAD",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "LOCK",
        "decoyPool": [
          "FLOCK",
          "SMOCK",
          "CROCK",
          "SHOCK"
        ],
        "decoyWord": "FLOCK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA LOCK",
          "word": "\ud83d\udd17 KEY \u2192 BOARD \u2192 WALK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "NOTE",
          "PAD",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "PAD + LOCK = Padlock (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "LOCK",
        "displayStem": "LOCK",
        "stemBadge": "\ud83d\udd17 HARDWARE LINK (LOCK -> KEY)",
        "correctWord": "KEY",
        "decoyPool": [
          "SKI",
          "FLEA",
          "PEA",
          "TEA"
        ],
        "decoyWord": "SKI",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 BOARD \u2192 WALK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 LOCK",
          "[ ? (1/3) ]",
          "BOARD \u2192 WALK"
        ],
        "compoundHint": "LOCK \u2194 KEY = Keylock"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "KEY",
        "displayStem": "KEY",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WALK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "KEY",
          "[ ? ]",
          "\ud83c\udf38 WALK"
        ],
        "compoundHint": "KEY + BOARD = Keyboard"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BOARD",
        "displayStem": "KEY \u2192 BOARD",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WALK",
          "word": "\ud83d\udd17 OUT \u2192 POST \u2192 OFFICE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "KEY",
          "BOARD",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BOARD + WALK = Boardwalk (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "stemBadge": "\ud83d\udd17 COMPOUND LINK (WALK -> OUT)",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 POST \u2192 OFFICE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WALK",
          "[ ? (1/3) ]",
          "POST \u2192 OFFICE"
        ],
        "compoundHint": "WALK + OUT = Walkout"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "POST",
        "decoyPool": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ],
        "decoyWord": "GHOST",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 OFFICE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "OUT",
          "[ ? ]",
          "\ud83c\udf38 OFFICE"
        ],
        "compoundHint": "OUT + POST = Outpost"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "POST",
        "displayStem": "OUT \u2192 POST",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "OFFICE",
        "decoyPool": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ],
        "decoyWord": "NOVICE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA OFFICE",
          "word": "\ud83d\udd17 SPACE \u2192 SHIP \u2192 WRECK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "OUT",
          "POST",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "POST + OFFICE = Post office (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "OFFICE",
        "displayStem": "OFFICE",
        "stemBadge": "\ud83d\udd17 WORKPLACE LINK (OFFICE -> SPACE)",
        "correctWord": "SPACE",
        "decoyPool": [
          "LACE",
          "MACE",
          "BRACE",
          "GRACE"
        ],
        "decoyWord": "LACE",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 SHIP \u2192 WRECK",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 OFFICE",
          "[ ? (1/3) ]",
          "SHIP \u2192 WRECK"
        ],
        "compoundHint": "OFFICE + SPACE = Office space"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "SPACE",
        "displayStem": "SPACE",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WRECK",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SPACE",
          "[ ? ]",
          "\ud83c\udf38 WRECK"
        ],
        "compoundHint": "SPACE + SHIP = Spaceship"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "SHIP",
        "displayStem": "SPACE \u2192 SHIP",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "WRECK",
        "decoyPool": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ],
        "decoyWord": "SPECK",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WRECK",
          "word": "\ud83d\udd17 + ZONE 2: SAND",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SPACE",
          "SHIP",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "SHIP + WRECK = Shipwreck (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WRECK",
        "displayStem": "WRECK",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (WRECK -> SAND)",
        "correctWord": "SAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "SAND \u2192 CUT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WRECK",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "WRECK \u2194 SAND = Sandbar"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HAIR",
        "displayStem": "HAIR",
        "correctWord": "CUT",
        "decoyPool": [
          "HUT",
          "STRUT",
          "GLUT",
          "SMUT"
        ],
        "decoyWord": "HUT",
        "compoundHint": "HAIR + CUT = Haircut"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "CUT",
        "displayStem": "CUT",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "CUT + OUT = Cutout"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "OUT + BACK = Outback"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "GOURD",
          "FJORD",
          "HOARD"
        ],
        "decoyWord": "CHORD",
        "compoundHint": "BACK + BOARD = Backboard"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOARD",
        "displayStem": "BOARD",
        "correctWord": "WALK",
        "decoyPool": [
          "HAWK",
          "STALK",
          "SQUAWK",
          "CAULK"
        ],
        "decoyWord": "HAWK",
        "compoundHint": "BOARD + WALK = Boardwalk"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "WALK + OUT = Walkout"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "BURST",
        "decoyPool": [
          "THIRST",
          "FIRST",
          "WORST",
          "HEARSE"
        ],
        "decoyWord": "THIRST",
        "compoundHint": "OUT + BURST = Outburst"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BURST",
        "displayStem": "BURST",
        "correctWord": "IN",
        "decoyPool": [
          "FIN",
          "CHIN",
          "SHIN",
          "GRIN"
        ],
        "decoyWord": "FIN",
        "compoundHint": "BURST + IN = Burst in"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "IN",
        "displayStem": "IN",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "IN + SIDE = Inside"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "SIDE + LINE = Sideline"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "LINE + UP = Lineup"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "BEAT",
        "decoyPool": [
          "WHEAT",
          "CHEAT",
          "TREAT",
          "PLEAT"
        ],
        "decoyWord": "WHEAT",
        "compoundHint": "UP + BEAT = Upbeat"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BEAT",
        "displayStem": "BEAT",
        "correctWord": "BOX",
        "decoyPool": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "decoyWord": "FOX",
        "compoundHint": "BEAT + BOX = Beatbox"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOX",
        "displayStem": "BOX",
        "correctWord": "OFFICE",
        "decoyPool": [
          "NOVICE",
          "CHALICE",
          "PALACE",
          "MALICE"
        ],
        "decoyWord": "NOVICE",
        "compoundHint": "BOX + OFFICE = Box office"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OFFICE",
        "displayStem": "OFFICE",
        "correctWord": "WORK",
        "decoyPool": [
          "SMIRK",
          "QUIRK",
          "CLERK",
          "PERK"
        ],
        "decoyWord": "SMIRK",
        "compoundHint": "OFFICE + WORK = Office work"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WORK",
        "displayStem": "WORK",
        "correctWord": "BENCH",
        "decoyPool": [
          "WRENCH",
          "TRENCH",
          "STENCH",
          "QUENCH"
        ],
        "decoyWord": "WRENCH",
        "compoundHint": "WORK + BENCH = Workbench"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BENCH",
        "displayStem": "BENCH",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "compoundHint": "BENCH + MARK = Benchmark"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "MARK + UP = Markup"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "UP + TURN = Upturn"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "TURN + OUT = Turnout"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "FALL",
        "decoyPool": [
          "SHAWL",
          "SCRAWL",
          "DRAWL",
          "TRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "OUT + FALL = Outfall"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "FALL",
        "displayStem": "FALL",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "FALL + DOWN = Fall down"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "TIME",
        "decoyPool": [
          "LIME",
          "CHIME",
          "SLIME",
          "GRIME"
        ],
        "decoyWord": "LIME",
        "compoundHint": "DOWN + TIME = Downtime"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TIME",
        "displayStem": "TIME",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "TIME + OVER = Time over"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "LOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "OVER + LOOK = Overlook"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LOOK",
        "displayStem": "LOOK",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "LOOK + OUT = Lookout"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "compoundHint": "OUT + RUN = Outrun"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "RUN + OFF = Runoff"
      }
    ]
  },
  {
    "vineNumber": 152,
    "dateKey": "2026-11-11",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 1,
    "title": "Sunlit Conservatory",
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
        "part3Hint": "CASTLE + WALL = Castle wall (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Decor Link (Wall -> Paper)",
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
        "part3Hint": "BACK + BONE = Backbone (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Idiom Link (Bone -> Dry)",
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
        "part3Hint": "LAND + SLIDE = Landslide (\ud83c\udf38 3-Part Compound Complete!)",
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
          "connection": "Media Link (Slide -> Show)",
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
        "id": "show_stop_light",
        "parts": [
          "SHOW",
          "STOP",
          "LIGHT"
        ],
        "part2Hint": "SHOW + STOP = Showstopper",
        "part3Hint": "STOP + LIGHT = Stoplight (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "part3Decoys": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ],
        "thematicLink": {
          "nextPart1": "HAIR",
          "connection": "Zone 2 Bridge (Light -> Hair)",
          "hint": "LIGHT \u2194 HAIR = Highlight",
          "decoys": [
            "CHAIR",
            "STAIR",
            "FLAIR",
            "GLARE"
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
        "target": "PACK",
        "hint": "BACK + DROP = Backdrop",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "HALL",
        "hint": "TOWN + HOUSE = Townhouse",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
      }
    ],
    "zone3Compounds": [
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
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "SAND",
        "displayStem": "SAND",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "CASTLE",
        "decoyPool": [
          "TASSEL",
          "HASSLE",
          "WRESTLE",
          "NESTLE"
        ],
        "decoyWord": "TASSEL",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 WALL",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SAND",
          "[ ? ]",
          "\ud83c\udf38 WALL"
        ],
        "compoundHint": "SAND + CASTLE = Sandcastle"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "CASTLE",
        "displayStem": "SAND \u2192 CASTLE",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "WALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "faintAbove": {
          "label": "THEMATIC LINK VIA WALL",
          "word": "\ud83d\udd17 PAPER \u2192 BACK \u2192 BONE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SAND",
          "CASTLE",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "CASTLE + WALL = Castle wall (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "WALL",
        "displayStem": "WALL",
        "stemBadge": "\ud83d\udd17 DECOR LINK (WALL -> PAPER)",
        "correctWord": "PAPER",
        "decoyPool": [
          "CAPER",
          "TAPER",
          "VAPOR",
          "SCRAPER"
        ],
        "decoyWord": "CAPER",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 BACK \u2192 BONE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 WALL",
          "[ ? (1/3) ]",
          "BACK \u2192 BONE"
        ],
        "compoundHint": "WALL + PAPER = Wallpaper"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "PAPER",
        "displayStem": "PAPER",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BONE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "PAPER",
          "[ ? ]",
          "\ud83c\udf38 BONE"
        ],
        "compoundHint": "PAPER + BACK = Paperback"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BACK",
        "displayStem": "PAPER \u2192 BACK",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "BONE",
        "decoyPool": [
          "CONE",
          "DRONE",
          "THRONE",
          "SCONE"
        ],
        "decoyWord": "CONE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BONE",
          "word": "\ud83d\udd17 DRY \u2192 LAND \u2192 SLIDE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "PAPER",
          "BACK",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BACK + BONE = Backbone (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BONE",
        "displayStem": "BONE",
        "stemBadge": "\ud83d\udd17 IDIOM LINK (BONE -> DRY)",
        "correctWord": "DRY",
        "decoyPool": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ],
        "decoyWord": "SHY",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 LAND \u2192 SLIDE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BONE",
          "[ ? (1/3) ]",
          "LAND \u2192 SLIDE"
        ],
        "compoundHint": "BONE + DRY = Bone-dry"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "DRY",
        "displayStem": "DRY",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "LAND",
        "decoyPool": [
          "STRAND",
          "BRAND",
          "GLAND",
          "BLAND"
        ],
        "decoyWord": "STRAND",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 SLIDE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "DRY",
          "[ ? ]",
          "\ud83c\udf38 SLIDE"
        ],
        "compoundHint": "DRY + LAND = Dryland"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "LAND",
        "displayStem": "DRY \u2192 LAND",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "SLIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA SLIDE",
          "word": "\ud83d\udd17 SHOW \u2192 STOP \u2192 LIGHT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "DRY",
          "LAND",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "LAND + SLIDE = Landslide (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "SLIDE",
        "displayStem": "SLIDE",
        "stemBadge": "\ud83d\udd17 MEDIA LINK (SLIDE -> SHOW)",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 STOP \u2192 LIGHT",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 SLIDE",
          "[ ? (1/3) ]",
          "STOP \u2192 LIGHT"
        ],
        "compoundHint": "SLIDE + SHOW = Slideshow"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "STOP",
        "decoyPool": [
          "MOP",
          "CHOP",
          "CROP",
          "PLOP"
        ],
        "decoyWord": "MOP",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 LIGHT",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "SHOW",
          "[ ? ]",
          "\ud83c\udf38 LIGHT"
        ],
        "compoundHint": "SHOW + STOP = Showstopper"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "STOP",
        "displayStem": "SHOW \u2192 STOP",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "LIGHT",
        "decoyPool": [
          "FRIGHT",
          "KNIGHT",
          "PLIGHT",
          "FLIGHT"
        ],
        "decoyWord": "FRIGHT",
        "faintAbove": {
          "label": "THEMATIC LINK VIA LIGHT",
          "word": "\ud83d\udd17 + ZONE 2: HAIR",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "SHOW",
          "STOP",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "STOP + LIGHT = Stoplight (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "LIGHT",
        "displayStem": "LIGHT",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (LIGHT -> HAIR)",
        "correctWord": "HAIR",
        "decoyPool": [
          "CHAIR",
          "STAIR",
          "FLAIR",
          "GLARE"
        ],
        "decoyWord": "CHAIR",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "HAIR \u2192 BATH",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 LIGHT",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "LIGHT \u2194 HAIR = Highlight"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BIRD",
        "displayStem": "BIRD",
        "correctWord": "BATH",
        "decoyPool": [
          "WRATH",
          "MATH",
          "MOTH",
          "BROTH"
        ],
        "decoyWord": "WRATH",
        "compoundHint": "BIRD + BATH = Birdbath"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BATH",
        "displayStem": "BATH",
        "correctWord": "ROBE",
        "decoyPool": [
          "GLOBE",
          "PROBE",
          "LOBE",
          "STROBE"
        ],
        "decoyWord": "GLOBE",
        "compoundHint": "BATH + ROBE = Bathrobe"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "ROBE",
        "displayStem": "ROBE",
        "correctWord": "HOOK",
        "decoyPool": [
          "BROOK",
          "CROOK",
          "ROOK",
          "SHOOK"
        ],
        "decoyWord": "BROOK",
        "compoundHint": "ROBE + HOOK = Robe hook"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOOK",
        "displayStem": "HOOK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "HOOK + UP = Hookup"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "HOLD",
        "decoyPool": [
          "MOLD",
          "GOLD",
          "SCOLD",
          "SCALD"
        ],
        "decoyWord": "MOLD",
        "compoundHint": "UP + HOLD = Uphold"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOLD",
        "displayStem": "HOLD",
        "correctWord": "BACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "HOLD + BACK = Holdback"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BACK",
        "displayStem": "BACK",
        "correctWord": "PACK",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "BACK + DROP = Backdrop"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DROP",
        "displayStem": "DROP",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "DROP + DOWN = Dropdown"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "TOWN",
        "decoyPool": [
          "CLOWN",
          "CROWN",
          "GOWN",
          "FROWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "DOWN + TOWN = Downtown"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "TOWN",
        "displayStem": "TOWN",
        "correctWord": "HALL",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "TOWN + HOUSE = Townhouse"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "correctWord": "FLY",
        "decoyPool": [
          "SHY",
          "SLY",
          "PRY",
          "WRY"
        ],
        "decoyWord": "SHY",
        "compoundHint": "HOUSE + FLY = Housefly"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "FLY",
        "displayStem": "FLY",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "FLY + OVER = Flyover"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "COAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "compoundHint": "OVER + COAT = Overcoat"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "COAT",
        "displayStem": "COAT",
        "correctWord": "RACK",
        "decoyPool": [
          "QUACK",
          "SNACK",
          "SHACK",
          "PLAQUE"
        ],
        "decoyWord": "QUACK",
        "compoundHint": "COAT + RACK = Coatrack"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "RACK",
        "displayStem": "RACK",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "RACK + UP = Rack up"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "LIFT",
        "decoyPool": [
          "DRIFT",
          "SWIFT",
          "THRIFT",
          "GIFT"
        ],
        "decoyWord": "DRIFT",
        "compoundHint": "UP + LIFT = Uplift"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LIFT",
        "displayStem": "LIFT",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "LIFT + OFF = Liftoff"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "compoundHint": "OFF + SET = Offset"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SET",
        "displayStem": "SET",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "SET + OUT = Set out"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "LINE",
        "decoyPool": [
          "PINE",
          "VINE",
          "SWINE",
          "TWINE"
        ],
        "decoyWord": "PINE",
        "compoundHint": "OUT + LINE = Outline"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "LINE",
        "displayStem": "LINE",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "LINE + UP = Lineup"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "UP + TURN = Upturn"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "TURN + OVER = Turnover"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "SLEEP",
        "decoyPool": [
          "SHEEP",
          "SWEEP",
          "CREEP",
          "STEEP"
        ],
        "decoyWord": "SHEEP",
        "compoundHint": "OVER + SLEEP = Oversleep"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SLEEP",
        "displayStem": "SLEEP",
        "correctWord": "WALK",
        "decoyPool": [
          "CHALK",
          "HAWK",
          "STALK",
          "SQUAWK"
        ],
        "decoyWord": "CHALK",
        "compoundHint": "SLEEP + WALK = Sleepwalk"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "WALK",
        "displayStem": "WALK",
        "correctWord": "AWAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "SLEIGH",
          "SPRAY"
        ],
        "decoyWord": "CLAY",
        "compoundHint": "WALK + AWAY = Walkaway"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "AWAY",
        "displayStem": "AWAY",
        "correctWord": "GAME",
        "decoyPool": [
          "FLAME",
          "SHAME",
          "BLAME",
          "FRAME"
        ],
        "decoyWord": "FLAME",
        "compoundHint": "AWAY + GAME = Away game"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "GAME",
        "displayStem": "GAME",
        "correctWord": "PLAN",
        "decoyPool": [
          "CLAN",
          "SWAN",
          "BRAN",
          "FLAN"
        ],
        "decoyWord": "CLAN",
        "compoundHint": "GAME + PLAN = Game plan"
      }
    ]
  },
  {
    "vineNumber": 153,
    "dateKey": "2026-11-12",
    "lexiconVersion": "v6_mega_compound_graph",
    "themeId": 2,
    "title": "Crimson Canopy (Ukiyo-e)",
    "chainSetIndex": 11,
    "zone1Triplets": [
      {
        "id": "hair_pin_cushion",
        "parts": [
          "HAIR",
          "PIN",
          "CUSHION"
        ],
        "part2Hint": "HAIR + PIN = Hairpin",
        "part3Hint": "PIN + CUSHION = Pincushion (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "FIN",
          "CHIN",
          "SHIN",
          "GRIN"
        ],
        "part3Decoys": [
          "FASHION",
          "PASSION",
          "RATION",
          "MANSION"
        ],
        "thematicLink": {
          "nextPart1": "AIR",
          "connection": "Physics Link (Cushion -> Air)",
          "hint": "CUSHION \u2194 AIR = Air cushion",
          "decoys": [
            "CHAIR",
            "STAIR",
            "FLAIR",
            "GLARE"
          ]
        }
      },
      {
        "id": "air_port_hole",
        "parts": [
          "AIR",
          "PORT",
          "HOLE"
        ],
        "part2Hint": "AIR + PORT = Airport",
        "part3Hint": "PORT + HOLE = Porthole (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ],
        "part3Decoys": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "thematicLink": {
          "nextPart1": "CARD",
          "connection": "Poker Link (Hole -> Card)",
          "hint": "HOLE + CARD = Hole card",
          "decoys": [
            "LARD",
            "BARD",
            "SHARD",
            "GUARD"
          ]
        }
      },
      {
        "id": "card_board_box",
        "parts": [
          "CARD",
          "BOARD",
          "BOX"
        ],
        "part2Hint": "CARD + BOARD = Cardboard",
        "part3Hint": "BOARD + BOX = Boxboard (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "part3Decoys": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "thematicLink": {
          "nextPart1": "CAR",
          "connection": "Rail Link (Box -> Car)",
          "hint": "BOX + CAR = Boxcar",
          "decoys": [
            "SCAR",
            "CZAR",
            "GUITAR",
            "RADAR"
          ]
        }
      },
      {
        "id": "car_wash_room",
        "parts": [
          "CAR",
          "WASH",
          "ROOM"
        ],
        "part2Hint": "CAR + WASH = Car wash",
        "part3Hint": "WASH + ROOM = Washroom (\ud83c\udf38 3-Part Compound Complete!)",
        "part2Decoys": [
          "SQUASH",
          "GOSH",
          "POSH",
          "SLOSH"
        ],
        "part3Decoys": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "thematicLink": {
          "nextPart1": "BIRD",
          "connection": "Zone 2 Bridge (Room -> Bird)",
          "hint": "ROOM \u2194 BIRD = Bowerbird",
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
        "stem": "DOG",
        "target": "WOOD",
        "hint": "DOG + HOUSE = Doghouse",
        "decoys": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
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
        "target": "SHIP",
        "hint": "MATE + SHIP = Shipmate",
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
        "target": "OUT",
        "hint": "WAY + OUT = Way out",
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
        "target": "MARK",
        "hint": "POST + MARK = Postmark",
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
      }
    ],
    "zone3Compounds": [
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
      },
      {
        "stem": "TURN",
        "target": "UP",
        "hint": "TURN + UP = Turnup",
        "decoys": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ]
      },
      {
        "stem": "UP",
        "target": "SET",
        "hint": "UP + SET = Upset",
        "decoys": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ]
      },
      {
        "stem": "SET",
        "target": "OFF",
        "hint": "SET + OFF = Setoff",
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
        "target": "UP",
        "hint": "STEP + UP = Step up",
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
      }
    ],
    "nodes": [
      {
        "index": 0,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "HAIR",
        "displayStem": "HAIR",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (1/4)",
        "correctWord": "PIN",
        "decoyPool": [
          "FIN",
          "CHIN",
          "SHIN",
          "GRIN"
        ],
        "decoyWord": "FIN",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 CUSHION",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "HAIR",
          "[ ? ]",
          "\ud83c\udf38 CUSHION"
        ],
        "compoundHint": "HAIR + PIN = Hairpin"
      },
      {
        "index": 1,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "PIN",
        "displayStem": "HAIR \u2192 PIN",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (1/4)",
        "correctWord": "CUSHION",
        "decoyPool": [
          "FASHION",
          "PASSION",
          "RATION",
          "MANSION"
        ],
        "decoyWord": "FASHION",
        "faintAbove": {
          "label": "THEMATIC LINK VIA CUSHION",
          "word": "\ud83d\udd17 AIR \u2192 PORT \u2192 HOLE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "HAIR",
          "PIN",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "PIN + CUSHION = Pincushion (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 2,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "CUSHION",
        "displayStem": "CUSHION",
        "stemBadge": "\ud83d\udd17 PHYSICS LINK (CUSHION -> AIR)",
        "correctWord": "AIR",
        "decoyPool": [
          "CHAIR",
          "STAIR",
          "FLAIR",
          "GLARE"
        ],
        "decoyWord": "CHAIR",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 2/4",
          "word": "[ ? ] \u2192 PORT \u2192 HOLE",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 CUSHION",
          "[ ? (1/3) ]",
          "PORT \u2192 HOLE"
        ],
        "compoundHint": "CUSHION \u2194 AIR = Air cushion"
      },
      {
        "index": 3,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "AIR",
        "displayStem": "AIR",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (2/4)",
        "correctWord": "PORT",
        "decoyPool": [
          "FORT",
          "SPORT",
          "SNORT",
          "SHORT"
        ],
        "decoyWord": "FORT",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 HOLE",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "AIR",
          "[ ? ]",
          "\ud83c\udf38 HOLE"
        ],
        "compoundHint": "AIR + PORT = Airport"
      },
      {
        "index": 4,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "PORT",
        "displayStem": "AIR \u2192 PORT",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (2/4)",
        "correctWord": "HOLE",
        "decoyPool": [
          "MOLE",
          "FOAL",
          "SHOAL",
          "STOLE"
        ],
        "decoyWord": "MOLE",
        "faintAbove": {
          "label": "THEMATIC LINK VIA HOLE",
          "word": "\ud83d\udd17 CARD \u2192 BOARD \u2192 BOX",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "AIR",
          "PORT",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "PORT + HOLE = Porthole (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 5,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "HOLE",
        "displayStem": "HOLE",
        "stemBadge": "\ud83d\udd17 POKER LINK (HOLE -> CARD)",
        "correctWord": "CARD",
        "decoyPool": [
          "LARD",
          "BARD",
          "SHARD",
          "GUARD"
        ],
        "decoyWord": "LARD",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 3/4",
          "word": "[ ? ] \u2192 BOARD \u2192 BOX",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 HOLE",
          "[ ? (1/3) ]",
          "BOARD \u2192 BOX"
        ],
        "compoundHint": "HOLE + CARD = Hole card"
      },
      {
        "index": 6,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "CARD",
        "displayStem": "CARD",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (3/4)",
        "correctWord": "BOARD",
        "decoyPool": [
          "CHORD",
          "SWORD",
          "GOURD",
          "FJORD"
        ],
        "decoyWord": "CHORD",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 BOX",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "CARD",
          "[ ? ]",
          "\ud83c\udf38 BOX"
        ],
        "compoundHint": "CARD + BOARD = Cardboard"
      },
      {
        "index": 7,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "BOARD",
        "displayStem": "CARD \u2192 BOARD",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (3/4)",
        "correctWord": "BOX",
        "decoyPool": [
          "FOX",
          "OX",
          "PHLOX",
          "PARADOX"
        ],
        "decoyWord": "FOX",
        "faintAbove": {
          "label": "THEMATIC LINK VIA BOX",
          "word": "\ud83d\udd17 CAR \u2192 WASH \u2192 ROOM",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "CARD",
          "BOARD",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "BOARD + BOX = Boxboard (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 8,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "BOX",
        "displayStem": "BOX",
        "stemBadge": "\ud83d\udd17 RAIL LINK (BOX -> CAR)",
        "correctWord": "CAR",
        "decoyPool": [
          "SCAR",
          "CZAR",
          "GUITAR",
          "RADAR"
        ],
        "decoyWord": "SCAR",
        "faintAbove": {
          "label": "LINKING TO TRIPLET 4/4",
          "word": "[ ? ] \u2192 WASH \u2192 ROOM",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 BOX",
          "[ ? (1/3) ]",
          "WASH \u2192 ROOM"
        ],
        "compoundHint": "BOX + CAR = Boxcar"
      },
      {
        "index": 9,
        "zoneId": 1,
        "tripletStep": 2,
        "stemWord": "CAR",
        "displayStem": "CAR",
        "stemBadge": "ZONE 1 \u2022 3-PART COMPOUND (4/4)",
        "correctWord": "WASH",
        "decoyPool": [
          "SQUASH",
          "GOSH",
          "POSH",
          "SLOSH"
        ],
        "decoyWord": "SQUASH",
        "faintAbove": {
          "label": "NODE 3 AHEAD \u2022 3-PART LINK",
          "word": "\ud83c\udf38 ROOM",
          "isNextTriplet": false
        },
        "tripletSlots": [
          "CAR",
          "[ ? ]",
          "\ud83c\udf38 ROOM"
        ],
        "compoundHint": "CAR + WASH = Car wash"
      },
      {
        "index": 10,
        "zoneId": 1,
        "tripletStep": 3,
        "stemWord": "WASH",
        "displayStem": "CAR \u2192 WASH",
        "stemBadge": "\ud83c\udf38 COMPLETE 3-PART WORD (4/4)",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "faintAbove": {
          "label": "THEMATIC LINK VIA ROOM",
          "word": "\ud83d\udd17 + ZONE 2: BIRD",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "CAR",
          "WASH",
          "\ud83c\udf38 [ ? ]"
        ],
        "compoundHint": "WASH + ROOM = Washroom (\ud83c\udf38 3-Part Compound Complete!)"
      },
      {
        "index": 11,
        "zoneId": 1,
        "tripletStep": 1,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "stemBadge": "\ud83d\udd17 ZONE 2 BRIDGE (ROOM -> BIRD)",
        "correctWord": "BIRD",
        "decoyPool": [
          "HERD",
          "CURD",
          "NERD",
          "WORD"
        ],
        "decoyWord": "HERD",
        "faintAbove": {
          "label": "BRIDGING TO ZONE 2 STEM",
          "word": "BIRD \u2192 WOOD",
          "isNextTriplet": true
        },
        "tripletSlots": [
          "\ud83d\udd17 ROOM",
          "[ ? (1/3) ]",
          "ZONE 2"
        ],
        "compoundHint": "ROOM \u2194 BIRD = Bowerbird"
      },
      {
        "index": 12,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOG",
        "displayStem": "DOG",
        "correctWord": "WOOD",
        "decoyPool": [
          "BLOUSE",
          "FABLE",
          "SHUTTER",
          "SNORE"
        ],
        "decoyWord": "BLOUSE",
        "compoundHint": "DOG + HOUSE = Doghouse"
      },
      {
        "index": 13,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "HOUSE",
        "displayStem": "HOUSE",
        "correctWord": "BOAT",
        "decoyPool": [
          "GOAT",
          "MOAT",
          "THROAT",
          "GLOAT"
        ],
        "decoyWord": "GOAT",
        "compoundHint": "HOUSE + BOAT = Houseboat"
      },
      {
        "index": 14,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BOAT",
        "displayStem": "BOAT",
        "correctWord": "SHOW",
        "decoyPool": [
          "CROW",
          "GLOW",
          "DOUGH",
          "TOE"
        ],
        "decoyWord": "CROW",
        "compoundHint": "BOAT + SHOW = Boat show"
      },
      {
        "index": 15,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHOW",
        "displayStem": "SHOW",
        "correctWord": "ROOM",
        "decoyPool": [
          "BROOM",
          "GROOM",
          "GLOOM",
          "LOOM"
        ],
        "decoyWord": "BROOM",
        "compoundHint": "SHOW + ROOM = Showroom"
      },
      {
        "index": 16,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "ROOM",
        "displayStem": "ROOM",
        "correctWord": "MATE",
        "decoyPool": [
          "CRATE",
          "SKATE",
          "SLATE",
          "GRATE"
        ],
        "decoyWord": "CRATE",
        "compoundHint": "ROOM + MATE = Roommate"
      },
      {
        "index": 17,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MATE",
        "displayStem": "MATE",
        "correctWord": "SHIP",
        "decoyPool": [
          "CHIP",
          "WHIP",
          "DRIP",
          "BLIP"
        ],
        "decoyWord": "CHIP",
        "compoundHint": "MATE + SHIP = Shipmate"
      },
      {
        "index": 18,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "SHIP",
        "displayStem": "SHIP",
        "correctWord": "WRECK",
        "decoyPool": [
          "SPECK",
          "FLECK",
          "PECK",
          "NECK"
        ],
        "decoyWord": "SPECK",
        "compoundHint": "SHIP + WRECK = Shipwreck"
      },
      {
        "index": 19,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WRECK",
        "displayStem": "WRECK",
        "correctWord": "BALL",
        "decoyPool": [
          "SHAWL",
          "BRAWL",
          "SCRAWL",
          "DRAWL"
        ],
        "decoyWord": "SHAWL",
        "compoundHint": "WRECK + BALL = Wrecking ball"
      },
      {
        "index": 20,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "BALL",
        "displayStem": "BALL",
        "correctWord": "PARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "compoundHint": "BALL + PARK = Ballpark"
      },
      {
        "index": 21,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "PARK",
        "displayStem": "PARK",
        "correctWord": "WAY",
        "decoyPool": [
          "CLAY",
          "TRAY",
          "JAY",
          "SLEIGH"
        ],
        "decoyWord": "CLAY",
        "compoundHint": "PARK + WAY = Parkway"
      },
      {
        "index": 22,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "WAY",
        "displayStem": "WAY",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "WAY + OUT = Way out"
      },
      {
        "index": 23,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "POST",
        "decoyPool": [
          "GHOST",
          "TOAST",
          "ROAST",
          "COAST"
        ],
        "decoyWord": "GHOST",
        "compoundHint": "OUT + POST = Outpost"
      },
      {
        "index": 24,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POST",
        "displayStem": "POST",
        "correctWord": "MARK",
        "decoyPool": [
          "SHARK",
          "LARK",
          "SPARK",
          "BARK"
        ],
        "decoyWord": "SHARK",
        "compoundHint": "POST + MARK = Postmark"
      },
      {
        "index": 25,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "MARK",
        "displayStem": "MARK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "MARK + DOWN = Markdown"
      },
      {
        "index": 26,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "POUR",
        "decoyPool": [
          "SNORE",
          "CHORE",
          "SPORE",
          "ROAR"
        ],
        "decoyWord": "SNORE",
        "compoundHint": "DOWN + POUR = Downpour"
      },
      {
        "index": 27,
        "zoneId": 2,
        "tripletStep": 0,
        "stemWord": "POUR",
        "displayStem": "POUR",
        "correctWord": "OVER",
        "decoyPool": [
          "CLOVER",
          "PLOVER",
          "ROVER",
          "DROVER"
        ],
        "decoyWord": "CLOVER",
        "compoundHint": "POUR + OVER = Pour-over"
      },
      {
        "index": 28,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OVER",
        "displayStem": "OVER",
        "correctWord": "RUN",
        "decoyPool": [
          "BUN",
          "NUN",
          "PUN",
          "STUN"
        ],
        "decoyWord": "BUN",
        "compoundHint": "OVER + RUN = Overrun"
      },
      {
        "index": 29,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "RUN",
        "displayStem": "RUN",
        "correctWord": "OUT",
        "decoyPool": [
          "TROUT",
          "SPROUT",
          "SNOUT",
          "GROUT"
        ],
        "decoyWord": "TROUT",
        "compoundHint": "RUN + OUT = Runout"
      },
      {
        "index": 30,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OUT",
        "displayStem": "OUT",
        "correctWord": "BREAK",
        "decoyPool": [
          "STEAK",
          "DRAKE",
          "SNAKE",
          "FLAKE"
        ],
        "decoyWord": "STEAK",
        "compoundHint": "OUT + BREAK = Outbreak"
      },
      {
        "index": 31,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "BREAK",
        "displayStem": "BREAK",
        "correctWord": "DOWN",
        "decoyPool": [
          "CLOWN",
          "FROWN",
          "CROWN",
          "GOWN"
        ],
        "decoyWord": "CLOWN",
        "compoundHint": "BREAK + DOWN = Breakdown"
      },
      {
        "index": 32,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "DOWN",
        "displayStem": "DOWN",
        "correctWord": "TURN",
        "decoyPool": [
          "CHURN",
          "FERN",
          "STERN",
          "YEARN"
        ],
        "decoyWord": "CHURN",
        "compoundHint": "DOWN + TURN = Downturn"
      },
      {
        "index": 33,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "TURN",
        "displayStem": "TURN",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "TURN + UP = Turnup"
      },
      {
        "index": 34,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "SET",
        "decoyPool": [
          "JET",
          "PET",
          "VET",
          "FRET"
        ],
        "decoyWord": "JET",
        "compoundHint": "UP + SET = Upset"
      },
      {
        "index": 35,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SET",
        "displayStem": "SET",
        "correctWord": "OFF",
        "decoyPool": [
          "COUGH",
          "TROUGH",
          "SCOFF",
          "GOLF"
        ],
        "decoyWord": "COUGH",
        "compoundHint": "SET + OFF = Setoff"
      },
      {
        "index": 36,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "OFF",
        "displayStem": "OFF",
        "correctWord": "SIDE",
        "decoyPool": [
          "BRIDE",
          "PRIDE",
          "GLIDE",
          "STRIDE"
        ],
        "decoyWord": "BRIDE",
        "compoundHint": "OFF + SIDE = Offside"
      },
      {
        "index": 37,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "SIDE",
        "displayStem": "SIDE",
        "correctWord": "STEP",
        "decoyPool": [
          "PREP",
          "REP",
          "PEP",
          "SCHLEP"
        ],
        "decoyWord": "PREP",
        "compoundHint": "SIDE + STEP = Sidestep"
      },
      {
        "index": 38,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "STEP",
        "displayStem": "STEP",
        "correctWord": "UP",
        "decoyPool": [
          "PUP",
          "SUP",
          "HICCUP",
          "SYRUP"
        ],
        "decoyWord": "PUP",
        "compoundHint": "STEP + UP = Step up"
      },
      {
        "index": 39,
        "zoneId": 3,
        "tripletStep": 0,
        "stemWord": "UP",
        "displayStem": "UP",
        "correctWord": "START",
        "decoyPool": [
          "CART",
          "CHART",
          "SMART",
          "PART"
        ],
        "decoyWord": "CART",
        "compoundHint": "UP + START = Upstart"
      }
    ]
  }
];

  const KNOWN_FORWARD_COMPOUNDS = new Set(["APPLECART", "APPLECARTS", "APPLEJACK", "APPLEJACKS", "APPLESAUCE", "APPLESAUCES", "BACKACHE", "BACKACHES", "BACKBEAT", "BACKBEATS", "BACKBENCH", "BACKBENCHER", "BACKBENCHERS", "BACKBENCHES", "BACKBEND", "BACKBENDS", "BACKBIT", "BACKBITE", "BACKBITER", "BACKBITERS", "BACKBITES", "BACKBITING", "BACKBITTEN", "BACKBLOCK", "BACKBLOCKS", "BACKBOARD", "BACKBOARDS", "BACKBONE", "BACKBONES", "BACKBREAKER", "BACKBREAKERS", "BACKBREAKING", "BACKCAST", "BACKCASTS", "BACKCHAT", "BACKCHATS", "BACKCLOTH", "BACKCLOTHS", "BACKCOUNTRIES", "BACKCOUNTRY", "BACKCOURT", "BACKCOURTS", "BACKCROSS", "BACKCROSSED", "BACKCROSSES", "BACKCROSSING", "BACKDATE", "BACKDATED", "BACKDATES", "BACKDATING", "BACKDOOR", "BACKDROP", "BACKDROPPED", "BACKDROPPING", "BACKDROPS", "BACKDROPT", "BACKERS", "BACKFIELD", "BACKFIELDS", "BACKFILL", "BACKFILLED", "BACKFILLING", "BACKFILLS", "BACKFIRE", "BACKFIRED", "BACKFIRES", "BACKFIRING", "BACKFIT", "BACKFITS", "BACKFITTED", "BACKFITTING", "BACKFLOW", "BACKFLOWS", "BACKGAMMON", "BACKGAMMONS", "BACKGROUND", "BACKGROUNDED", "BACKGROUNDER", "BACKGROUNDERS", "BACKGROUNDING", "BACKGROUNDS", "BACKHAND", "BACKHANDED", "BACKHANDING", "BACKHANDS", "BACKHAUL", "BACKHAULED", "BACKHAULING", "BACKHAULS", "BACKHOE", "BACKHOES", "BACKHOUSE", "BACKHOUSES", "BACKLAND", "BACKLANDS", "BACKLASH", "BACKLASHED", "BACKLASHER", "BACKLASHERS", "BACKLASHES", "BACKLASHING", "BACKLESS", "BACKLIGHT", "BACKLIGHTED", "BACKLIGHTING", "BACKLIGHTS", "BACKLIST", "BACKLISTED", "BACKLISTING", "BACKLISTS", "BACKLIT", "BACKLOG", "BACKLOGGED", "BACKLOGGING", "BACKLOGS", "BACKMOST", "BACKOUT", "BACKOUTS", "BACKPACK", "BACKPACKED", "BACKPACKER", "BACKPACKERS", "BACKPACKING", "BACKPACKS", "BACKPEDAL", "BACKPEDALED", "BACKPEDALING", "BACKPEDALLED", "BACKPEDALLING", "BACKPEDALS", "BACKREST", "BACKRESTS", "BACKROOM", "BACKROOMS", "BACKRUSH", "BACKRUSHES", "BACKSAW", "BACKSAWS", "BACKSCATTER", "BACKSCATTERED", "BACKSCATTERING", "BACKSCATTERINGS", "BACKSCATTERS", "BACKSEAT", "BACKSEATS", "BACKSET", "BACKSETS", "BACKSIDE", "BACKSIDES", "BACKSLAP", "BACKSLAPPED", "BACKSLAPPER", "BACKSLAPPERS", "BACKSLAPPING", "BACKSLAPS", "BACKSLASH", "BACKSLASHES", "BACKSLID", "BACKSLIDDEN", "BACKSLIDE", "BACKSLIDER", "BACKSLIDERS", "BACKSLIDES", "BACKSLIDING", "BACKSPACE", "BACKSPACED", "BACKSPACES", "BACKSPACING", "BACKSPIN", "BACKSPINS", "BACKSPLASH", "BACKSPLASHES", "BACKSTAB", "BACKSTABBED", "BACKSTABBER", "BACKSTABBERS", "BACKSTABBING", "BACKSTABBINGS", "BACKSTABS", "BACKSTAGE", "BACKSTAIRS", "BACKSTAY", "BACKSTAYS", "BACKSTITCH", "BACKSTITCHED", "BACKSTITCHES", "BACKSTITCHING", "BACKSTOP", "BACKSTOPPED", "BACKSTOPPING", "BACKSTOPS", "BACKSTREET", "BACKSTREETS", "BACKSTRETCH", "BACKSTRETCHES", "BACKSTROKE", "BACKSTROKES", "BACKSWEPT", "BACKSWING", "BACKSWINGS", "BACKSWORD", "BACKSWORDS", "BACKTRACK", "BACKTRACKED", "BACKTRACKING", "BACKTRACKS", "BACKUPS", "BACKWARD", "BACKWARDS", "BACKWASH", "BACKWASHED", "BACKWASHES", "BACKWASHING", "BACKWATER", "BACKWATERS", "BACKWOOD", "BACKWOODS", "BACKWOODSMAN", "BACKWOODSMEN", "BACKWOODSY", "BACKWRAP", "BACKWRAPS", "BACKYARD", "BACKYARDS", "BELLBIRD", "BELLBIRDS", "BELLBOY", "BELLBOYS", "BELLFLOWER", "BELLFLOWERS", "BELLHOP", "BELLHOPS", "BELLMAN", "BELLMEN", "BELLOWED", "BELLOWING", "BELLPULL", "BELLPULLS", "BELLWETHER", "BELLWETHERS", "BELLWORT", "BELLWORTS", "BENCHERS", "BENCHLAND", "BENCHLANDS", "BENCHMARK", "BENCHMARKS", "BENCHWARMER", "BENCHWARMERS", "BLADELIKE", "BOARDERS", "BOARDLIKE", "BOARDMAN", "BOARDMEN", "BOARDROOM", "BOARDROOMS", "BOARDSAILING", "BOARDSAILINGS", "BOARDSAILOR", "BOARDSAILORS", "BOARDWALK", "BOARDWALKS", "BONEFISH", "BONEFISHES", "BONEFISHING", "BONEFISHINGS", "BONEHEAD", "BONEHEADED", "BONEHEADS", "BONELESS", "BONEMEAL", "BONEMEALS", "BONESET", "BONESETS", "BONESETTER", "BONESETTERS", "BONEYARD", "BONEYARDS", "BOOKABLE", "BOOKBINDER", "BOOKBINDERIES", "BOOKBINDERS", "BOOKBINDERY", "BOOKBINDING", "BOOKBINDINGS", "BOOKCASE", "BOOKCASES", "BOOKEND", "BOOKENDS", "BOOKERS", "BOOKKEEPER", "BOOKKEEPERS", "BOOKKEEPING", "BOOKKEEPINGS", "BOOKLET", "BOOKLETS", "BOOKLICE", "BOOKLORE", "BOOKLORES", "BOOKLOUSE", "BOOKMAKER", "BOOKMAKERS", "BOOKMAKING", "BOOKMAKINGS", "BOOKMAN", "BOOKMARK", "BOOKMARKER", "BOOKMARKERS", "BOOKMARKS", "BOOKMEN", "BOOKMOBILE", "BOOKMOBILES", "BOOKPLATE", "BOOKPLATES", "BOOKRACK", "BOOKRACKS", "BOOKREST", "BOOKRESTS", "BOOKSELLER", "BOOKSELLERS", "BOOKSELLING", "BOOKSHELF", "BOOKSHELVES", "BOOKSHOP", "BOOKSHOPS", "BOOKSTALL", "BOOKSTALLS", "BOOKSTORE", "BOOKSTORES", "BOOKWORM", "BOOKWORMS", "BOWLEGGED", "BOWLERS", "BOWLESS", "BOWLLIKE", "BOXBERRIES", "BOXBERRY", "BOXBOARD", "BOXBOARDS", "BOXCAR", "BOXCARS", "BOXERS", "BOXFISH", "BOXFISHES", "BOXHAUL", "BOXHAULED", "BOXHAULING", "BOXHAULS", "BOXLIKE", "BOXTHORN", "BOXTHORNS", "BOXWOOD", "BOXWOODS", "BREADBASKET", "BREADBASKETS", "BREADBOARD", "BREADBOARDED", "BREADBOARDING", "BREADBOARDS", "BREADBOX", "BREADBOXES", "BREADFRUIT", "BREADFRUITS", "BREADLINE", "BREADLINES", "BREADNUT", "BREADNUTS", "BREADSTUFF", "BREADSTUFFS", "BREADWINNER", "BREADWINNERS", "BREADWINNING", "BREADWINNINGS", "BREAKABLE", "BREAKABLES", "BREAKAGE", "BREAKAGES", "BREAKAWAY", "BREAKDOWN", "BREAKDOWNS", "BREAKERS", "BREAKEVEN", "BREAKEVENS", "BREAKFAST", "BREAKFASTED", "BREAKFASTER", "BREAKFASTING", "BREAKFASTS", "BREAKFRONT", "BREAKFRONTS", "BREAKNECK", "BREAKOUT", "BREAKOUTS", "BREAKTHROUGH", "BREAKUPS", "BREAKWATER", "BREAKWATERS", "BUTTERBALL", "BUTTERBALLS", "BUTTERCUP", "BUTTERCUPS", "BUTTERFAT", "BUTTERFATS", "BUTTERFINGERED", "BUTTERFINGERS", "BUTTERFISH", "BUTTERFISHES", "BUTTERFLIED", "BUTTERFLIES", "BUTTERFLY", "BUTTERFLYER", "BUTTERFLYERS", "BUTTERFLYING", "BUTTERLESS", "BUTTERMILK", "BUTTERMILKS", "BUTTERNUT", "BUTTERNUTS", "BUTTERSCOTCH", "BUTTERSCOTCHES", "BUTTERWEED", "BUTTERWEEDS", "BUTTERWORT", "BUTTERWORTS", "CARAPACE", "CARATE", "CARATES", "CARAWAY", "CARBARN", "CARBARNS", "CARBIDE", "CARBIDES", "CARBINE", "CARBINES", "CARBORA", "CARBORAS", "CARBOS", "CARBOY", "CARBOYS", "CARBURET", "CARBURETS", "CARCASE", "CARCASES", "CARCEL", "CARCELS", "CARDING", "CARDINGS", "CARERS", "CARESS", "CARESSES", "CARFARE", "CARFARES", "CARGOES", "CARHOP", "CARHOPS", "CARICES", "CARJACKER", "CARJACKERS", "CARJACKING", "CARKING", "CARLESS", "CARLIN", "CARLINE", "CARLINES", "CARLING", "CARLINGS", "CARLINS", "CARLOAD", "CARLOADS", "CARMAKER", "CARMAKERS", "CARMAN", "CARMEN", "CARMINE", "CARMINES", "CARNATION", "CARNATIONS", "CARNET", "CARNETS", "CARNIVAL", "CAROMS", "CAROUSEL", "CAROUSELS", "CARPAL", "CARPALE", "CARPALS", "CARPED", "CARPER", "CARPET", "CARPETS", "CARPING", "CARPINGS", "CARPOGONIA", "CARPOOL", "CARPOOLED", "CARPOOLING", "CARPOOLS", "CARPORT", "CARPORTS", "CARPUS", "CARRACK", "CARRACKS", "CARROM", "CARROMS", "CARROT", "CARROTS", "CARSICK", "CARSICKNESS", "CARSICKNESSES", "CARTABLE", "CARTED", "CARTEL", "CARTELS", "CARTING", "CARTON", "CARTONED", "CARTONING", "CARTONS", "CARTOON", "CARTOONS", "CARTOP", "CARTOPPER", "CARTOPPERS", "CARTOUCH", "CARTOUCHE", "CARTOUCHES", "CARUNCLE", "CARUNCLES", "CARWASH", "CARWASHES", "CASTABILITIES", "CASTABILITY", "CASTABLE", "CASTAWAY", "CASTERS", "CASTLED", "CASTLING", "CASTOFF", "CASTOFFS", "CASTORS", "CASTRATE", "CASTRATED", "CASTRATES", "CASTRATING", "CASTRATION", "CASTRATIONS", "CASTRATO", "CASTRATOS", "CHAIRLIFT", "CHAIRLIFTS", "CHAIRMAN", "CHAIRMANED", "CHAIRMANNED", "CHAIRMANNING", "CHAIRMANS", "CHAIRMEN", "CHAIRPERSON", "CHAIRPERSONS", "CHAIRWOMAN", "CHAIRWOMEN", "COFFEECAKE", "COFFEECAKES", "COFFEEHOUSE", "COFFEEHOUSES", "COFFEEMAKER", "COFFEEMAKERS", "COFFEEPOT", "COFFEEPOTS", "COLDBLOOD", "COLDCOCK", "COLDCOCKED", "COLDCOCKING", "COLDCOCKS", "COLDHEARTED", "COLDNESS", "COLDNESSES", "CONEFLOWER", "CONEFLOWERS", "CONENOSE", "CONENOSES", "CONEPATE", "CONEPATES", "CREAMCUPS", "CREAMERS", "CREAMPUFF", "CREAMPUFFS", "CREAMWARE", "CREAMWARES", "CUPBEARER", "CUPBEARERS", "CUPBOARD", "CUPBOARDS", "CUPCAKE", "CUPCAKES", "CUPELS", "CUPIDS", "CUPLIKE", "CUPPAS", "CUPPED", "CUPPER", "CUPPIER", "CUPPING", "CUPPINGS", "CUPRITE", "CUPRITES", "CUPRUM", "CUPRUMS", "DECKELS", "DECKERS", "DECKHAND", "DECKHANDS", "DECKHOUSE", "DECKHOUSES", "DOCKAGE", "DOCKAGES", "DOCKERS", "DOCKHAND", "DOCKHANDS", "DOCKLAND", "DOCKLANDS", "DOCKMASTER", "DOCKMASTERS", "DOCKSIDE", "DOCKSIDES", "DOCKWORKER", "DOCKWORKERS", "DOCKYARD", "DOCKYARDS", "DOGBANE", "DOGBANES", "DOGBERRIES", "DOGBERRY", "DOGCART", "DOGCARTS", "DOGCATCHER", "DOGCATCHERS", "DOGDOM", "DOGDOMS", "DOGEAR", "DOGEARED", "DOGEARING", "DOGEARS", "DOGFACE", "DOGFACES", "DOGFIGHT", "DOGFIGHTING", "DOGFIGHTS", "DOGFISH", "DOGFISHES", "DOGFOUGHT", "DOGGED", "DOGGIE", "DOGGIES", "DOGGONE", "DOGGONER", "DOGHOUSE", "DOGHOUSES", "DOGLEG", "DOGLEGGED", "DOGLEGGING", "DOGLEGS", "DOGLIKE", "DOGMAS", "DOGNAP", "DOGNAPPED", "DOGNAPPER", "DOGNAPPERS", "DOGNAPPING", "DOGNAPS", "DOGSLED", "DOGSLEDDED", "DOGSLEDDER", "DOGSLEDDERS", "DOGSLEDDING", "DOGSLEDS", "DOGTEETH", "DOGTOOTH", "DOGTROT", "DOGTROTS", "DOGTROTTED", "DOGTROTTING", "DOGVANE", "DOGVANES", "DOGWATCH", "DOGWATCHES", "DOGWOOD", "DOGWOODS", "DOORBELL", "DOORBELLS", "DOORJAMB", "DOORJAMBS", "DOORKEEPER", "DOORKEEPERS", "DOORKNOB", "DOORKNOBS", "DOORLESS", "DOORMAN", "DOORMAT", "DOORMATS", "DOORMEN", "DOORNAIL", "DOORNAILS", "DOORPLATE", "DOORPLATES", "DOORPOST", "DOORPOSTS", "DOORSILL", "DOORSILLS", "DOORSTEP", "DOORSTEPS", "DOORSTOP", "DOORSTOPS", "DOORWAY", "DOORWAYS", "DOORYARD", "DOORYARDS", "DOWNBEAT", "DOWNBEATS", "DOWNBURST", "DOWNBURSTS", "DOWNCAST", "DOWNCASTS", "DOWNCOME", "DOWNCOMES", "DOWNCOURT", "DOWNDRAFT", "DOWNDRAFTS", "DOWNERS", "DOWNFALL", "DOWNFALLEN", "DOWNFALLS", "DOWNFIELD", "DOWNGRADE", "DOWNGRADED", "DOWNGRADES", "DOWNGRADING", "DOWNHAUL", "DOWNHAULS", "DOWNHEARTED", "DOWNHILL", "DOWNHILLER", "DOWNHILLERS", "DOWNHILLS", "DOWNLAND", "DOWNLANDS", "DOWNLINK", "DOWNLINKS", "DOWNLOAD", "DOWNLOADED", "DOWNLOADING", "DOWNLOADS", "DOWNPIPE", "DOWNPIPES", "DOWNPLAY", "DOWNPLAYED", "DOWNPLAYING", "DOWNPLAYS", "DOWNPOUR", "DOWNPOURS", "DOWNRANGE", "DOWNRIGHT", "DOWNRIGHTLY", "DOWNRIGHTNESS", "DOWNRIGHTNESSES", "DOWNRIVER", "DOWNSCALE", "DOWNSCALED", "DOWNSCALES", "DOWNSCALING", "DOWNSHIFT", "DOWNSHIFTED", "DOWNSHIFTING", "DOWNSHIFTS", "DOWNSIDE", "DOWNSIDES", "DOWNSIZE", "DOWNSIZED", "DOWNSIZES", "DOWNSIZING", "DOWNSLIDE", "DOWNSLIDES", "DOWNSLOPE", "DOWNSPOUT", "DOWNSPOUTS", "DOWNSTAGE", "DOWNSTAGES", "DOWNSTAIRS", "DOWNSTATE", "DOWNSTATER", "DOWNSTATERS", "DOWNSTATES", "DOWNSTREAM", "DOWNSTROKE", "DOWNSTROKES", "DOWNSWING", "DOWNSWINGS", "DOWNTICK", "DOWNTICKS", "DOWNTIME", "DOWNTIMES", "DOWNTOWN", "DOWNTOWNS", "DOWNTREND", "DOWNTRENDS", "DOWNTROD", "DOWNTRODDEN", "DOWNTURN", "DOWNTURNS", "DOWNWARD", "DOWNWARDS", "DOWNWASH", "DOWNWASHES", "DOWNWIND", "DRYABLE", "DRYADS", "DRYERS", "DRYLAND", "DRYLOT", "DRYLOTS", "DRYNESS", "DRYNESSES", "DRYPOINT", "DRYPOINTS", "DRYSALTER", "DRYSALTERS", "DRYSTONE", "DRYWALL", "DRYWALLS", "FALLALS", "FALLAWAY", "FALLBACK", "FALLBACKS", "FALLERS", "FALLFISH", "FALLFISHES", "FALLOFF", "FALLOFFS", "FALLOUT", "FALLOUTS", "FALLOWED", "FALLOWING", "FIREABLE", "FIREARM", "FIREARMS", "FIREBACK", "FIREBACKS", "FIREBALL", "FIREBALLER", "FIREBALLERS", "FIREBALLING", "FIREBALLS", "FIREBASE", "FIREBASES", "FIREBIRD", "FIREBIRDS", "FIREBOAT", "FIREBOATS", "FIREBOMB", "FIREBOMBED", "FIREBOMBING", "FIREBOMBS", "FIREBOX", "FIREBOXES", "FIREBRAND", "FIREBRANDS", "FIREBRAT", "FIREBRATS", "FIREBREAK", "FIREBREAKS", "FIREBRICK", "FIREBRICKS", "FIREBUG", "FIREBUGS", "FIRECLAY", "FIRECLAYS", "FIRECRACKER", "FIRECRACKERS", "FIREDAMP", "FIREDAMPS", "FIREDOG", "FIREDOGS", "FIREDRAKE", "FIREDRAKES", "FIREFANG", "FIREFANGED", "FIREFANGS", "FIREFIGHT", "FIREFIGHTER", "FIREFIGHTERS", "FIREFIGHTS", "FIREFLIES", "FIREFLY", "FIREGUARD", "FIREGUARDS", "FIREHALL", "FIREHALLS", "FIREHOUSE", "FIREHOUSES", "FIRELESS", "FIRELIGHT", "FIRELIGHTS", "FIRELIT", "FIRELOCK", "FIRELOCKS", "FIREMAN", "FIREMANIC", "FIREMEN", "FIREPAN", "FIREPANS", "FIREPINK", "FIREPINKS", "FIREPLACE", "FIREPLACED", "FIREPLACES", "FIREPLUG", "FIREPLUGS", "FIREPOT", "FIREPOTS", "FIREPOWER", "FIREPOWERS", "FIREPROOF", "FIREPROOFED", "FIREPROOFING", "FIREPROOFS", "FIREROOM", "FIREROOMS", "FIRESIDE", "FIRESIDES", "FIRESTONE", "FIRESTONES", "FIRESTORM", "FIRESTORMS", "FIRETHORN", "FIRETHORNS", "FIRETRAP", "FIRETRAPS", "FIREWATER", "FIREWATERS", "FIREWEED", "FIREWEEDS", "FIREWOOD", "FIREWOODS", "FIREWORK", "FIREWORKS", "FIREWORM", "FIREWORMS", "FISHABILITIES", "FISHABILITY", "FISHABLE", "FISHBOLT", "FISHBOLTS", "FISHBONE", "FISHBONES", "FISHBOWL", "FISHBOWLS", "FISHERS", "FISHEYE", "FISHEYES", "FISHGIG", "FISHGIGS", "FISHHOOK", "FISHHOOKS", "FISHLESS", "FISHLIKE", "FISHLINE", "FISHLINES", "FISHMEAL", "FISHMEALS", "FISHMONGER", "FISHMONGERS", "FISHNET", "FISHNETS", "FISHPLATE", "FISHPLATES", "FISHPOLE", "FISHPOLES", "FISHPOND", "FISHPONDS", "FISHTAIL", "FISHTAILED", "FISHTAILING", "FISHTAILS", "FISHWAY", "FISHWAYS", "FISHWIFE", "FISHWIVES", "FISHWORM", "FISHWORMS", "FLYABLE", "FLYAWAY", "FLYBELT", "FLYBELTS", "FLYBLEW", "FLYBLOW", "FLYBLOWING", "FLYBLOWN", "FLYBLOWS", "FLYBOAT", "FLYBOATS", "FLYBOY", "FLYBOYS", "FLYBRIDGE", "FLYBRIDGES", "FLYBYS", "FLYCATCHER", "FLYCATCHERS", "FLYERS", "FLYLEAF", "FLYLEAVES", "FLYLESS", "FLYMAN", "FLYMEN", "FLYOFF", "FLYOFFS", "FLYOVER", "FLYOVERS", "FLYPAPER", "FLYPAPERS", "FLYPAST", "FLYPASTS", "FLYSPECK", "FLYSPECKED", "FLYSPECKING", "FLYSPECKS", "FLYSWATTER", "FLYSWATTERS", "FLYTED", "FLYTIER", "FLYTIERS", "FLYTING", "FLYTINGS", "FLYTRAP", "FLYTRAPS", "FLYWAY", "FLYWAYS", "FLYWEIGHT", "FLYWEIGHTS", "FLYWHEEL", "FLYWHEELS", "FRONTAGE", "FRONTAGES", "FRONTALLY", "FRONTALS", "FRONTCOURT", "FRONTCOURTS", "FRONTLESS", "FRONTLET", "FRONTLETS", "FRONTLINE", "FRONTONS", "FRONTRUNNER", "FRONTRUNNERS", "FRONTWARD", "FRONTWARDS", "FRUITAGE", "FRUITAGES", "FRUITCAKE", "FRUITCAKES", "FRUITERS", "FRUITFULLER", "FRUITFULLEST", "FRUITFULLY", "FRUITFULNESS", "FRUITFULNESSES", "FRUITION", "FRUITIONS", "FRUITLESS", "FRUITLET", "FRUITLETS", "FRUITWOOD", "FRUITWOODS", "GAMECOCK", "GAMECOCKS", "GAMEKEEPER", "GAMEKEEPERS", "GAMELIKE", "GAMENESS", "GAMENESSES", "GAMESOME", "GAMETIC", "GINGERBREAD", "GINGERBREADED", "GINGERBREADS", "GINGERBREADY", "GINGERROOT", "GINGERROOTS", "GINGERSNAP", "GINGERSNAPS", "GOLDBRICK", "GOLDBRICKED", "GOLDBRICKING", "GOLDBRICKS", "GOLDBUG", "GOLDBUGS", "GOLDEYE", "GOLDEYES", "GOLDFIELD", "GOLDFIELDS", "GOLDFINCH", "GOLDFINCHES", "GOLDFISH", "GOLDFISHES", "GOLDSMITH", "GOLDSMITHS", "GOLDSTONE", "GOLDSTONES", "GOLDURN", "GOLDURNS", "HOLELESS", "HOPERS", "HOPHEAD", "HOPHEADS", "HOPLITE", "HOPPED", "HOPPER", "HOPPIER", "HOPPING", "HOPPINGS", "HOPPLED", "HOPSACK", "HOPSACKING", "HOPSACKINGS", "HOPSACKS", "HOPSCOTCH", "HOPSCOTCHED", "HOPSCOTCHES", "HOPSCOTCHING", "HOPTOAD", "HOPTOADS", "HOUSEBOAT", "HOUSEBOATER", "HOUSEBOATERS", "HOUSEBOATS", "HOUSEBOUND", "HOUSEBOY", "HOUSEBOYS", "HOUSEBREAK", "HOUSEBREAKER", "HOUSEBREAKERS", "HOUSEBREAKING", "HOUSEBREAKINGS", "HOUSEBREAKS", "HOUSEBROKE", "HOUSEBROKEN", "HOUSECARL", "HOUSECARLS", "HOUSECLEAN", "HOUSECLEANED", "HOUSECLEANING", "HOUSECLEANS", "HOUSECOAT", "HOUSECOATS", "HOUSEDRESS", "HOUSEDRESSES", "HOUSEFATHER", "HOUSEFATHERS", "HOUSEFLIES", "HOUSEFLY", "HOUSEFRONT", "HOUSEFRONTS", "HOUSEGUEST", "HOUSEGUESTS", "HOUSEHOLD", "HOUSEHOLDER", "HOUSEHOLDERS", "HOUSEHOLDS", "HOUSEHUSBAND", "HOUSEHUSBANDS", "HOUSEKEEP", "HOUSEKEEPER", "HOUSEKEEPERS", "HOUSEKEEPING", "HOUSEKEEPINGS", "HOUSEKEEPS", "HOUSEKEPT", "HOUSELED", "HOUSELEEK", "HOUSELEEKS", "HOUSELESS", "HOUSELIGHTS", "HOUSELING", "HOUSEMAID", "HOUSEMAIDS", "HOUSEMAN", "HOUSEMASTER", "HOUSEMASTERS", "HOUSEMATE", "HOUSEMATES", "HOUSEMEN", "HOUSEMOTHER", "HOUSEMOTHERS", "HOUSEPAINTER", "HOUSEPAINTERS", "HOUSEPARENT", "HOUSEPARENTS", "HOUSEPERSON", "HOUSEPERSONS", "HOUSEPLANT", "HOUSEPLANTS", "HOUSEROOM", "HOUSEROOMS", "HOUSESAT", "HOUSESIT", "HOUSESITS", "HOUSESITTING", "HOUSETOP", "HOUSETOPS", "HOUSEWARES", "HOUSEWARMING", "HOUSEWIFE", "HOUSEWIFELINESS", "HOUSEWIFELINESSES", "HOUSEWIFELY", "HOUSEWIVES", "HOUSEWORK", "HOUSEWORKS", "ICEBERG", "ICEBERGS", "ICEBLINK", "ICEBLINKS", "ICEBOAT", "ICEBOATER", "ICEBOATERS", "ICEBOATING", "ICEBOATINGS", "ICEBOATS", "ICEBOUND", "ICEBOX", "ICEBOXES", "ICEBREAKER", "ICEBREAKERS", "ICECAP", "ICECAPS", "ICEFALL", "ICEFALLS", "ICEHOUSE", "ICEHOUSES", "ICELESS", "ICELIKE", "ICEMAN", "ICEMEN", "INABILITIES", "INABILITY", "INACCESSIBILITIES", "INACCESSIBILITY", "INACCESSIBLE", "INACCESSIBLY", "INACCURACIES", "INACCURACY", "INACCURATE", "INACCURATELY", "INACTION", "INACTIONS", "INACTIVATE", "INACTIVATED", "INACTIVATES", "INACTIVATING", "INACTIVATION", "INACTIVATIONS", "INACTIVE", "INACTIVELY", "INACTIVITIES", "INACTIVITY", "INADEQUACIES", "INADEQUACY", "INADEQUATE", "INADEQUATELY", "INADEQUATENESS", "INADEQUATENESSES", "INADMISSIBILITIES", "INADMISSIBILITY", "INADMISSIBLE", "INADVERTENCE", "INADVERTENCES", "INADVERTENCIES", "INADVERTENCY", "INADVERTENT", "INADVERTENTLY", "INADVISABILITIES", "INADVISABILITY", "INADVISABLE", "INALIENABILITIES", "INALIENABILITY", "INALIENABLE", "INALTERABILITIES", "INALTERABILITY", "INALTERABLE", "INALTERABLY", "INANE", "INANES", "INANIMATE", "INANIMATELY", "INANIMATENESS", "INANIMATENESSES", "INAPPARENT", "INAPPARENTLY", "INAPPEASABLE", "INAPPETENCE", "INAPPETENCES", "INAPPLICABILITIES", "INAPPLICABILITY", "INAPPLICABLE", "INAPPOSITE", "INAPPOSITELY", "INAPPOSITENESS", "INAPPOSITENESSES", "INAPPRECIABLE", "INAPPRECIABLY", "INAPPRECIATIVE", "INAPPRECIATIVELY", "INAPPRECIATIVENESS", "INAPPRECIATIVENESSES", "INAPPROACHABLE", "INAPPROPRIATE", "INAPPROPRIATELY", "INAPPROPRIATENESS", "INAPPROPRIATENESSES", "INAPT", "INAPTITUDE", "INAPTITUDES", "INAPTLY", "INAPTNESS", "INAPTNESSES", "INARABLE", "INARCH", "INARCHED", "INARCHES", "INARCHING", "INARGUABLE", "INARGUABLY", "INARM", "INARMED", "INARMING", "INARMS", "INARTICULACIES", "INARTICULACY", "INARTICULATE", "INARTICULATELY", "INARTICULATENESS", "INARTICULATENESSES", "INARTICULATES", "INARTISTIC", "INARTISTICALLY", "INATTENTION", "INATTENTIONS", "INATTENTIVE", "INATTENTIVELY", "INATTENTIVENESS", "INATTENTIVENESSES", "INAUDIBILITIES", "INAUDIBILITY", "INAUDIBLE", "INAUDIBLY", "INAUGURAL", "INAUSPICIOUS", "INAUSPICIOUSLY", "INAUSPICIOUSNESS", "INAUSPICIOUSNESSES", "INAUTHENTIC", "INAUTHENTICITIES", "INAUTHENTICITY", "INBEING", "INBEINGS", "INBOARD", "INBOARDS", "INBORN", "INBOUND", "INBOUNDED", "INBOUNDING", "INBOUNDS", "INBREATHE", "INBREATHED", "INBREATHES", "INBREATHING", "INBRED", "INBREED", "INBREEDING", "INBREEDINGS", "INBREEDS", "INBUILT", "INBURST", "INBURSTS", "INBYE", "INCAGE", "INCAGED", "INCAGES", "INCAGING", "INCALCULABLE", "INCANDESCENCE", "INCANDESCENCES", "INCANDESCENT", "INCANT", "INCANTED", "INCANTING", "INCANTS", "INCAPABILITIES", "INCAPABILITY", "INCAPABLE", "INCAPABLENESS", "INCAPABLENESSES", "INCAPABLY", "INCAPACITATE", "INCAPACITATED", "INCAPACITATES", "INCAPACITATING", "INCAPACITATION", "INCAPACITATIONS", "INCAPACITIES", "INCAPACITY", "INCARNATION", "INCARNATIONS", "INCASE", "INCASED", "INCASES", "INCASING", "INCAUTION", "INCAUTIONS", "INCAUTIOUS", "INCAUTIOUSLY", "INCAUTIOUSNESS", "INCAUTIOUSNESSES", "INCENSE", "INCENSED", "INCENSES", "INCENSING", "INCENTER", "INCENTERS", "INCERTITUDE", "INCERTITUDES", "INCITATION", "INCITATIONS", "INCITE", "INCITED", "INCITER", "INCITERS", "INCITES", "INCITING", "INCIVIL", "INCIVILITIES", "INCIVILITY", "INCLASP", "INCLASPED", "INCLASPING", "INCLASPS", "INCLEMENCIES", "INCLEMENCY", "INCLEMENT", "INCLEMENTLY", "INCLINE", "INCLINES", "INCLINOMETER", "INCLINOMETERS", "INCLIP", "INCLIPPED", "INCLIPPING", "INCLIPS", "INCLOSE", "INCLOSED", "INCLOSER", "INCLOSERS", "INCLOSES", "INCLOSING", "INCLOSURE", "INCLOSURES", "INCOERCIBLE", "INCOG", "INCOGNIZANCE", "INCOGNIZANCES", "INCOGNIZANT", "INCOGS", "INCOHERENCE", "INCOHERENCES", "INCOHERENT", "INCOHERENTLY", "INCOMBUSTIBILITIES", "INCOMBUSTIBILITY", "INCOMBUSTIBLE", "INCOMBUSTIBLES", "INCOME", "INCOMER", "INCOMERS", "INCOMES", "INCOMING", "INCOMINGS", "INCOMMENSURABILITIES", "INCOMMENSURABILITY", "INCOMMENSURABLE", "INCOMMENSURABLY", "INCOMMENSURATE", "INCOMMODE", "INCOMMODES", "INCOMMODIOUS", "INCOMMODIOUSLY", "INCOMMODIOUSNESS", "INCOMMODIOUSNESSES", "INCOMMODITIES", "INCOMMODITY", "INCOMMUNICABILITIES", "INCOMMUNICABILITY", "INCOMMUNICABLE", "INCOMMUNICABLY", "INCOMMUNICATIVE", "INCOMMUTABLE", "INCOMPARABILITIES", "INCOMPARABILITY", "INCOMPARABLE", "INCOMPARABLY", "INCOMPATIBILITIES", "INCOMPATIBILITY", "INCOMPATIBLE", "INCOMPATIBLES", "INCOMPATIBLY", "INCOMPETENCE", "INCOMPETENCES", "INCOMPETENCIES", "INCOMPETENCY", "INCOMPETENT", "INCOMPETENTLY", "INCOMPLETE", "INCOMPLETELY", "INCOMPLETENESS", "INCOMPLETENESSES", "INCOMPLIANT", "INCOMPREHENSIBILITIES", "INCOMPREHENSIBILITY", "INCOMPREHENSIBLE", "INCOMPREHENSIBLENESS", "INCOMPREHENSIBLENESSES", "INCOMPREHENSIBLY", "INCOMPREHENSION", "INCOMPREHENSIONS", "INCOMPRESSIBLE", "INCOMPUTABLE", "INCONCEIVABILITIES", "INCONCEIVABILITY", "INCONCEIVABLE", "INCONCEIVABLENESS", "INCONCEIVABLENESSES", "INCONCEIVABLY", "INCONCINNITIES", "INCONCINNITY", "INCONCLUSIVE", "INCONCLUSIVELY", "INCONCLUSIVENESS", "INCONCLUSIVENESSES", "INCONFORMITIES", "INCONFORMITY", "INCONGRUENCE", "INCONGRUENCES", "INCONGRUENT", "INCONGRUENTLY", "INCONGRUITIES", "INCONGRUITY", "INCONGRUOUS", "INCONGRUOUSLY", "INCONGRUOUSNESS", "INCONGRUOUSNESSES", "INCONSECUTIVE", "INCONSEQUENCE", "INCONSEQUENCES", "INCONSEQUENT", "INCONSEQUENTIAL", "INCONSEQUENTIALITIES", "INCONSEQUENTIALITY", "INCONSEQUENTIALLY", "INCONSEQUENTLY", "INCONSIDERABLE", "INCONSIDERABLY", "INCONSIDERATE", "INCONSIDERATELY", "INCONSIDERATENESS", "INCONSIDERATENESSES", "INCONSIDERATION", "INCONSIDERATIONS", "INCONSISTENCE", "INCONSISTENCES", "INCONSISTENCIES", "INCONSISTENCY", "INCONSISTENT", "INCONSISTENTLY", "INCONSONANCE", "INCONSONANCES", "INCONSONANT", "INCONSPICUOUS", "INCONSPICUOUSLY", "INCONSPICUOUSNESS", "INCONSPICUOUSNESSES", "INCONSTANCIES", "INCONSTANCY", "INCONSTANT", "INCONSTANTLY", "INCONSUMABLE", "INCONTESTABLE", "INCONTINENCE", "INCONTINENCES", "INCONTINENT", "INCONTINENTLY", "INCONTROLLABLE", "INCONTROVERTIBLE", "INCONVENIENCE", "INCONVENIENCES", "INCONVENIENCIES", "INCONVENIENCY", "INCONVENIENT", "INCONVENIENTLY", "INCONVERTIBILITIES", "INCONVERTIBILITY", "INCONVERTIBLE", "INCONVERTIBLY", "INCONY", "INCOORDINATION", "INCOORDINATIONS", "INCORPORATE", "INCORPORATION", "INCORPORATIONS", "INCORPORATIVE", "INCORPORATOR", "INCORPORATORS", "INCORPOREAL", "INCORPOREALLY", "INCORPOREITIES", "INCORPOREITY", "INCORPSE", "INCORPSES", "INCORRECT", "INCORRECTLY", "INCORRECTNESS", "INCORRECTNESSES", "INCORRIGIBILITIES", "INCORRIGIBILITY", "INCORRIGIBLE", "INCORRUPT", "INCORRUPTED", "INCORRUPTIBILITIES", "INCORRUPTIBILITY", "INCORRUPTIBLE", "INCORRUPTIBLY", "INCORRUPTION", "INCORRUPTIONS", "INCORRUPTLY", "INCORRUPTNESS", "INCORRUPTNESSES", "INCREASE", "INCREASED", "INCREASER", "INCREASERS", "INCREASES", "INCREASING", "INCREATE", "INCREDIBILITIES", "INCREDIBILITY", "INCREDIBLE", "INCREDIBLY", "INCREDULITIES", "INCREDULITY", "INCREDULOUS", "INCREDULOUSLY", "INCRESCENT", "INCRIMINATE", "INCRIMINATED", "INCRIMINATES", "INCRIMINATING", "INCRIMINATION", "INCRIMINATIONS", "INCROSS", "INCROSSED", "INCROSSES", "INCROSSING", "INCRUST", "INCRUSTED", "INCRUSTING", "INCRUSTS", "INCULPABLE", "INCULT", "INCUMBER", "INCUMBERED", "INCUMBERING", "INCUMBERS", "INCUR", "INCURABLE", "INCURABLY", "INCURIOSITIES", "INCURIOSITY", "INCURIOUS", "INCURIOUSLY", "INCURIOUSNESS", "INCURIOUSNESSES", "INCURRED", "INCURRENT", "INCURRING", "INCURS", "INCURVATURE", "INCURVATURES", "INCURVE", "INCURVED", "INCURVES", "INCURVING", "INDECENCIES", "INDECENCY", "INDECENT", "INDECENTER", "INDECENTEST", "INDECENTLY", "INDECIPHERABLE", "INDECISION", "INDECISIONS", "INDECISIVE", "INDECISIVELY", "INDECISIVENESS", "INDECISIVENESSES", "INDECLINABLE", "INDECOMPOSABLE", "INDECOROUS", "INDECOROUSLY", "INDECOROUSNESS", "INDECOROUSNESSES", "INDECORUM", "INDECORUMS", "INDEED", "INDEFEASIBILITIES", "INDEFEASIBILITY", "INDEFEASIBLE", "INDEFENSIBILITIES", "INDEFENSIBILITY", "INDEFENSIBLE", "INDEFENSIBLY", "INDEFINABLE", "INDEFINABLY", "INDEFINITE", "INDEFINITELY", "INDEFINITENESS", "INDEFINITENESSES", "INDEHISCENCE", "INDEHISCENCES", "INDEHISCENT", "INDELICACIES", "INDELICACY", "INDELICATE", "INDELICATELY", "INDEMONSTRABLE", "INDEMONSTRABLY", "INDENE", "INDENES", "INDENT", "INDENTED", "INDENTING", "INDENTS", "INDENTURE", "INDENTURES", "INDEPENDENCE", "INDEPENDENCES", "INDEPENDENCIES", "INDEPENDENCY", "INDEPENDENT", "INDEPENDENTLY", "INDEPENDENTS", "INDESCRIBABLE", "INDESTRUCTIBILITIES", "INDESTRUCTIBILITY", "INDESTRUCTIBLE", "INDETERMINABLE", "INDETERMINABLY", "INDETERMINACIES", "INDETERMINACY", "INDETERMINATE", "INDETERMINATELY", "INDETERMINATENESS", "INDETERMINATENESSES", "INDETERMINATION", "INDETERMINATIONS", "INDETERMINISM", "INDETERMINISMS", "INDETERMINIST", "INDETERMINISTIC", "INDETERMINISTS", "INDEVOUT", "INDEX", "INDEXES", "INDICES", "INDICTION", "INDICTIONS", "INDIE", "INDIES", "INDIFFERENCE", "INDIFFERENCES", "INDIFFERENT", "INDIFFERENTLY", "INDIGESTED", "INDIGESTIBILITIES", "INDIGESTIBILITY", "INDIGESTIBLE", "INDIGESTION", "INDIGESTIONS", "INDIGNITIES", "INDIGNITY", "INDIRECT", "INDIRECTION", "INDIRECTIONS", "INDIRECTLY", "INDIRECTNESS", "INDIRECTNESSES", "INDISCERNIBLE", "INDISCIPLINABLE", "INDISCIPLINE", "INDISCIPLINED", "INDISCIPLINES", "INDISCOVERABLE", "INDISCREET", "INDISCREETLY", "INDISCREETNESS", "INDISCREETNESSES", "INDISCRETION", "INDISCRETIONS", "INDISCRIMINATE", "INDISCRIMINATING", "INDISCRIMINATINGLY", "INDISCRIMINATION", "INDISCRIMINATIONS", "INDISPENSABILITIES", "INDISPENSABILITY", "INDISPENSABLE", "INDISPOSE", "INDISPOSED", "INDISPOSES", "INDISPOSING", "INDISPOSITION", "INDISPOSITIONS", "INDISPUTABLE", "INDISPUTABLY", "INDISSOCIABLE", "INDISSOLUBLE", "INDISTINCT", "INDISTINCTIVE", "INDISTINCTLY", "INDISTINCTNESS", "INDISTINCTNESSES", "INDISTINGUISHABILITIES", "INDISTINGUISHABILITY", "INDISTINGUISHABLE", "INDISTINGUISHABLY", "INDITE", "INDITES", "INDIVIDUAL", "INDIVISIBILITIES", "INDIVISIBILITY", "INDIVISIBLE", "INDOCILE", "INDOCILITIES", "INDOCILITY", "INDOL", "INDOLE", "INDOLES", "INDOLS", "INDOOR", "INDOORS", "INDORSER", "INDORSERS", "INDOW", "INDOWED", "INDOWING", "INDOWS", "INDRAFT", "INDRAFTS", "INDRAWN", "INDUBITABLE", "INDUCE", "INDUCES", "INDUCT", "INDUCTED", "INDUCTING", "INDUCTS", "INDUE", "INDUES", "INDURATION", "INDURATIONS", "INDURATIVE", "INDWELL", "INDWELLER", "INDWELLERS", "INDWELLING", "INDWELLS", "INDWELT", "INEARTH", "INEARTHED", "INEARTHING", "INEARTHS", "INEDIBLE", "INEDITED", "INEDUCABILITIES", "INEDUCABILITY", "INEDUCABLE", "INEFFABLE", "INEFFACEABLE", "INEFFECTIVE", "INEFFECTIVELY", "INEFFECTIVENESS", "INEFFECTIVENESSES", "INEFFECTUAL", "INEFFECTUALITIES", "INEFFECTUALITY", "INEFFECTUALLY", "INEFFECTUALNESS", "INEFFECTUALNESSES", "INEFFICACIES", "INEFFICACIOUS", "INEFFICACIOUSLY", "INEFFICACIOUSNESS", "INEFFICACIOUSNESSES", "INEFFICACY", "INEFFICIENCIES", "INEFFICIENCY", "INEFFICIENT", "INEFFICIENTLY", "INEGALITARIAN", "INELASTIC", "INELASTICITIES", "INELASTICITY", "INELEGANCE", "INELEGANCES", "INELEGANT", "INELEGANTLY", "INELIGIBILITIES", "INELIGIBILITY", "INELIGIBLE", "INELIGIBLES", "INELOQUENT", "INELOQUENTLY", "INEQUALITIES", "INEQUALITY", "INEQUITABLE", "INEQUITABLY", "INEQUITIES", "INEQUITY", "INERADICABLE", "INERRANCIES", "INERRANCY", "INERRANT", "INESSENTIAL", "INESSENTIALS", "INESTIMABLE", "INESTIMABLY", "INEVITABLE", "INEXACT", "INEXACTITUDE", "INEXACTITUDES", "INEXACTLY", "INEXACTNESS", "INEXACTNESSES", "INEXCUSABLE", "INEXCUSABLENESS", "INEXCUSABLENESSES", "INEXCUSABLY", "INEXHAUSTIBILITIES", "INEXHAUSTIBILITY", "INEXHAUSTIBLE", "INEXISTENCE", "INEXISTENCES", "INEXISTENT", "INEXORABLE", "INEXPEDIENCE", "INEXPEDIENCES", "INEXPEDIENCIES", "INEXPEDIENCY", "INEXPEDIENT", "INEXPEDIENTLY", "INEXPENSIVE", "INEXPENSIVELY", "INEXPENSIVENESS", "INEXPENSIVENESSES", "INEXPERIENCE", "INEXPERIENCED", "INEXPERIENCES", "INEXPERT", "INEXPERTLY", "INEXPERTNESS", "INEXPERTNESSES", "INEXPERTS", "INEXPIABLE", "INEXPLAINABLE", "INEXPLICABLE", "INEXPLICABLY", "INEXPLICIT", "INEXPRESSIBLE", "INEXPRESSIVE", "INEXPRESSIVELY", "INEXPRESSIVENESS", "INEXPRESSIVENESSES", "INEXTINGUISHABLE", "INEXTRICABLE", "INFALL", "INFALLIBILITIES", "INFALLIBILITY", "INFALLIBLE", "INFALLIBLY", "INFALLING", "INFALLS", "INFAMOUS", "INFAMOUSLY", "INFANCIES", "INFANCY", "INFARE", "INFARES", "INFAUNA", "INFAUNAE", "INFAUNAL", "INFAUNAS", "INFEASIBILITIES", "INFEASIBILITY", "INFEASIBLE", "INFECUND", "INFELICITIES", "INFELICITOUS", "INFELICITOUSLY", "INFELICITY", "INFEOFF", "INFEOFFED", "INFEOFFING", "INFEOFFS", "INFER", "INFERTILE", "INFERTILITIES", "INFERTILITY", "INFESTER", "INFESTERS", "INFIDELITIES", "INFIDELITY", "INFIELD", "INFIELDER", "INFIELDERS", "INFIELDS", "INFIGHT", "INFIGHTER", "INFIGHTERS", "INFIGHTING", "INFIGHTINGS", "INFIGHTS", "INFILTRATE", "INFILTRATED", "INFILTRATES", "INFILTRATING", "INFILTRATION", "INFILTRATIONS", "INFINITE", "INFINITELY", "INFINITENESS", "INFINITENESSES", "INFINITES", "INFINITUDE", "INFINITUDES", "INFIRM", "INFIRMED", "INFIRMING", "INFIRMLY", "INFIRMS", "INFIX", "INFIXATION", "INFIXATIONS", "INFIXED", "INFIXES", "INFIXING", "INFLAME", "INFLAMED", "INFLAMER", "INFLAMERS", "INFLAMES", "INFLAMING", "INFLAMMABILITIES", "INFLAMMABILITY", "INFLAMMABLE", "INFLAMMABLES", "INFLECTION", "INFLECTIONS", "INFLEXED", "INFLEXIBILITIES", "INFLEXIBILITY", "INFLEXIBLE", "INFLEXIBLY", "INFLEXION", "INFLEXIONS", "INFLIGHT", "INFLORESCENCE", "INFLORESCENCES", "INFLOW", "INFLOWS", "INFLUENT", "INFLUX", "INFLUXES", "INFOLD", "INFOLDED", "INFOLDER", "INFOLDERS", "INFOLDING", "INFOLDS", "INFORM", "INFORMAL", "INFORMALITIES", "INFORMALITY", "INFORMALLY", "INFORMANT", "INFORMANTS", "INFORMATION", "INFORMATIONS", "INFORMATIVE", "INFORMATIVELY", "INFORMED", "INFORMER", "INFORMERS", "INFORMING", "INFORMS", "INFOUGHT", "INFRACTED", "INFRACTION", "INFRACTIONS", "INFRANGIBILITIES", "INFRANGIBILITY", "INFRANGIBLE", "INFREQUENCE", "INFREQUENCES", "INFREQUENCIES", "INFREQUENCY", "INFREQUENT", "INFREQUENTLY", "INFRINGE", "INFRINGED", "INFRINGES", "INFRINGING", "INFRUGAL", "INFUSE", "INFUSED", "INFUSES", "INFUSIBILITIES", "INFUSIBILITY", "INFUSIBLE", "INFUSING", "INFUSION", "INFUSIONS", "INGATE", "INGATES", "INGATHER", "INGATHERED", "INGATHERING", "INGATHERINGS", "INGATHERS", "INGEST", "INGESTS", "INGLORIOUS", "INGLORIOUSLY", "INGLORIOUSNESS", "INGLORIOUSNESSES", "INGOING", "INGOT", "INGRAFT", "INGRAFTED", "INGRAFTING", "INGRAFTS", "INGRAIN", "INGRAINED", "INGRAINING", "INGRAINS", "INGRATE", "INGRATES", "INGRATITUDE", "INGRATITUDES", "INGROUP", "INGROUPS", "INGROWING", "INGROWN", "INGROWTH", "INGROWTHS", "INGULF", "INGULFED", "INGULFING", "INGULFS", "INHABIT", "INHABITABLE", "INHABITANT", "INHABITANTS", "INHABITATION", "INHABITATIONS", "INHABITED", "INHABITING", "INHABITS", "INHALATION", "INHALATIONS", "INHALE", "INHALED", "INHALER", "INHALERS", "INHALES", "INHALING", "INHARMONIC", "INHARMONIES", "INHARMONIOUS", "INHARMONIOUSLY", "INHARMONIOUSNESS", "INHARMONIOUSNESSES", "INHARMONY", "INHAUL", "INHAULER", "INHAULERS", "INHAULS", "INHERE", "INHERES", "INHERITABILITIES", "INHERITABILITY", "INHERITABLE", "INHERITOR", "INHERITORS", "INHERITRICES", "INHERITRIX", "INHERITRIXES", "INHOLDING", "INHOLDINGS", "INHOMOGENEITIES", "INHOMOGENEITY", "INHOMOGENEOUS", "INHOSPITABLE", "INHOSPITABLY", "INHOSPITALITIES", "INHOSPITALITY", "INHUMAN", "INHUMANE", "INHUMANELY", "INHUMANITIES", "INHUMANITY", "INHUMANLY", "INHUMANNESS", "INHUMANNESSES", "INIMITABLE", "INION", "INJUDICIOUS", "INJUDICIOUSLY", "INJUDICIOUSNESS", "INJUDICIOUSNESSES", "INJUNCTION", "INJUNCTIONS", "INJURIES", "INJURY", "INJUSTICE", "INJUSTICES", "INKIER", "INKING", "INLACE", "INLACED", "INLACES", "INLACING", "INLAID", "INLAND", "INLANDER", "INLANDERS", "INLANDS", "INLAY", "INLAYER", "INLAYERS", "INLAYING", "INLAYS", "INLET", "INLETS", "INLETTING", "INLIER", "INLIERS", "INMATE", "INMATES", "INMESH", "INMESHED", "INMESHES", "INMESHING", "INMOST", "INNARDS", "INNERVATE", "INNERVATION", "INNERVATIONS", "INNERVE", "INNERVED", "INNERVES", "INNERVING", "INNOCENT", "INNOCUOUS", "INNOCUOUSLY", "INNOMINATE", "INNOVATION", "INNOVATIONS", "INNUMERABLE", "INNUMERACIES", "INNUMERACY", "INNUMERATE", "INNUMERATES", "INNUMEROUS", "INOBSERVANCE", "INOBSERVANCES", "INOBSERVANT", "INOFFENSIVE", "INOFFENSIVELY", "INOFFENSIVENESS", "INOFFENSIVENESSES", "INOPERABLE", "INOPERATIVE", "INOPERATIVENESS", "INOPERATIVENESSES", "INOPERCULATE", "INOPPORTUNE", "INOPPORTUNELY", "INOPPORTUNENESS", "INOPPORTUNENESSES", "INORDINATE", "INORGANIC", "INORGANICALLY", "INOSCULATE", "INOSCULATED", "INOSCULATES", "INOSCULATING", "INOSCULATION", "INOSCULATIONS", "INPATIENT", "INPATIENTS", "INPHASE", "INPOUR", "INPOURED", "INPOURING", "INPOURS", "INPUT", "INPUTS", "INPUTTED", "INPUTTING", "INQUEST", "INQUESTS", "INQUIET", "INQUIETED", "INQUIETING", "INQUIETS", "INQUIETUDE", "INQUIETUDES", "INQUIRE", "INQUIRED", "INQUIRES", "INQUIRING", "INROAD", "INROADS", "INRUSH", "INRUSHES", "INSALUBRIOUS", "INSALUBRITIES", "INSALUBRITY", "INSANE", "INSANELY", "INSANENESS", "INSANENESSES", "INSANER", "INSANEST", "INSANITARY", "INSANITATION", "INSANITATIONS", "INSANITIES", "INSANITY", "INSATIABLE", "INSATIABLY", "INSATIATE", "INSCAPE", "INSCAPES", "INSCRIBE", "INSCRIBED", "INSCRIBER", "INSCRIBERS", "INSCRIBES", "INSCRIBING", "INSCROLL", "INSCROLLED", "INSCROLLING", "INSCROLLS", "INSCRUTABLE", "INSCULP", "INSCULPED", "INSCULPING", "INSCULPS", "INSEAM", "INSEAMS", "INSECT", "INSECTARIES", "INSECTARY", "INSECTILE", "INSECTS", "INSECURE", "INSECURELY", "INSECURENESS", "INSECURENESSES", "INSECURITIES", "INSECURITY", "INSENSATE", "INSENSATELY", "INSENSIBILITIES", "INSENSIBILITY", "INSENSIBLE", "INSENSIBLENESS", "INSENSIBLENESSES", "INSENSIBLY", "INSENSITIVE", "INSENSITIVELY", "INSENSITIVENESS", "INSENSITIVENESSES", "INSENSITIVITIES", "INSENSITIVITY", "INSENTIENCE", "INSENTIENCES", "INSENTIENT", "INSEPARABILITIES", "INSEPARABILITY", "INSEPARABLE", "INSEPARABLENESS", "INSEPARABLENESSES", "INSET", "INSETS", "INSETTER", "INSETTERS", "INSETTING", "INSHEATH", "INSHEATHED", "INSHEATHING", "INSHEATHS", "INSHORE", "INSHRINE", "INSHRINED", "INSHRINES", "INSHRINING", "INSIDE", "INSIDES", "INSIGHT", "INSIGHTS", "INSIGNIFICANCE", "INSIGNIFICANCES", "INSIGNIFICANCIES", "INSIGNIFICANCY", "INSIGNIFICANT", "INSIGNIFICANTLY", "INSINCERE", "INSINCERELY", "INSINCERITIES", "INSINCERITY", "INSINUATE", "INSINUATED", "INSINUATES", "INSINUATING", "INSISTER", "INSISTERS", "INSNARE", "INSNARED", "INSNARER", "INSNARERS", "INSNARES", "INSNARING", "INSOBRIETIES", "INSOBRIETY", "INSOCIABILITIES", "INSOCIABILITY", "INSOCIABLE", "INSOCIABLY", "INSOFAR", "INSOLATE", "INSOLATED", "INSOLATES", "INSOLATING", "INSOLATION", "INSOLATIONS", "INSOLE", "INSOLES", "INSOLUBILITIES", "INSOLUBILITY", "INSOLUBILIZATION", "INSOLUBILIZATIONS", "INSOLUBILIZE", "INSOLUBILIZED", "INSOLUBILIZES", "INSOLUBILIZING", "INSOLUBLE", "INSOLUBLES", "INSOLUBLY", "INSOLVABLE", "INSOLVENCIES", "INSOLVENCY", "INSOLVENT", "INSOLVENTS", "INSOUL", "INSOULED", "INSOULS", "INSPAN", "INSPANNED", "INSPANNING", "INSPANS", "INSPHERE", "INSPHERED", "INSPHERES", "INSPHERING", "INSPIRE", "INSPIRED", "INSPIRES", "INSPIRING", "INSPIRIT", "INSPIRITED", "INSPIRITING", "INSPIRITS", "INSTABILITIES", "INSTABILITY", "INSTABLE", "INSTALL", "INSTALLED", "INSTALLING", "INSTALLS", "INSTANCE", "INSTANCES", "INSTAR", "INSTARRED", "INSTARRING", "INSTARS", "INSTATE", "INSTATED", "INSTATES", "INSTATING", "INSTEAD", "INSTEP", "INSTEPS", "INSTILL", "INSTILLED", "INSTILLER", "INSTILLING", "INSTILLS", "INSTROKE", "INSTROKES", "INSUBORDINATE", "INSUBORDINATELY", "INSUBORDINATES", "INSUBORDINATION", "INSUBORDINATIONS", "INSUBSTANTIAL", "INSUBSTANTIALITIES", "INSUBSTANTIALITY", "INSUFFERABLE", "INSUFFERABLENESS", "INSUFFERABLENESSES", "INSUFFERABLY", "INSUFFICIENCIES", "INSUFFICIENCY", "INSUFFICIENT", "INSUFFICIENTLY", "INSUFFLATE", "INSUFFLATED", "INSUFFLATES", "INSUFFLATING", "INSUPERABLE", "INSUPERABLY", "INSUPPORTABLE", "INSUPPRESSIBLE", "INSURE", "INSURER", "INSURMOUNTABLE", "INSUSCEPTIBILITIES", "INSUSCEPTIBILITY", "INSUSCEPTIBLE", "INSUSCEPTIBLY", "INSWATHE", "INSWATHED", "INSWATHES", "INSWATHING", "INSWEPT", "INTACT", "INTAKE", "INTAKES", "INTANGIBILITIES", "INTANGIBILITY", "INTANGIBLE", "INTANGIBLENESS", "INTANGIBLENESSES", "INTANGIBLES", "INTANGIBLY", "INTARSIA", "INTARSIAS", "INTEGUMENT", "INTEGUMENTS", "INTEMPERANCE", "INTEMPERANCES", "INTEMPERATE", "INTEMPERATELY", "INTEMPERATENESS", "INTEMPERATENESSES", "INTEND", "INTENDANCE", "INTENDANCES", "INTENDED", "INTENDER", "INTENDERS", "INTENDING", "INTENDS", "INTENSE", "INTENSELY", "INTENSENESS", "INTENSENESSES", "INTENSER", "INTENSEST", "INTENSION", "INTENSIONAL", "INTENSIONS", "INTENSITIES", "INTENSITY", "INTENSIVE", "INTENT", "INTENTS", "INTERMINABLE", "INTERMINABLENESS", "INTERMINABLENESSES", "INTERMINABLY", "INTERN", "INTERNE", "INTERNES", "INTERNS", "INTESTACIES", "INTESTACY", "INTESTATE", "INTESTATES", "INTHRALL", "INTHRALLED", "INTHRALLING", "INTHRALLS", "INTHRONE", "INTHRONED", "INTHRONES", "INTHRONING", "INTIME", "INTINE", "INTINES", "INTIS", "INTITLE", "INTITLED", "INTITLES", "INTITLING", "INTOLERABILITIES", "INTOLERABILITY", "INTOLERABLE", "INTOLERABLY", "INTOLERANCE", "INTOLERANCES", "INTOLERANT", "INTOLERANTLY", "INTOMB", "INTOMBED", "INTOMBING", "INTOMBS", "INTONE", "INTONED", "INTONER", "INTONERS", "INTONES", "INTONING", "INTORT", "INTORTS", "INTOWN", "INTOXICANT", "INTOXICANTS", "INTRACTABILITIES", "INTRACTABILITY", "INTRACTABLE", "INTRACTABLY", "INTRANSITIVE", "INTRANSITIVELY", "INTRANSITIVENESS", "INTRANSITIVENESSES", "INTRANSITIVITIES", "INTRANSITIVITY", "INTREAT", "INTREATED", "INTREATING", "INTREATS", "INTRENCH", "INTRENCHED", "INTRENCHES", "INTRENCHING", "INTREPID", "INTRUST", "INTRUSTED", "INTRUSTING", "INTRUSTS", "INTUBATE", "INTUITION", "INTUITIONAL", "INTUITIONS", "INTUMESCENCE", "INTUMESCENCES", "INTUMESCENT", "INTURN", "INTURNED", "INTURNS", "INTWINE", "INTWINED", "INTWINES", "INTWINING", "INTWIST", "INTWISTED", "INTWISTING", "INTWISTS", "INUNCTION", "INUNCTIONS", "INUNDATED", "INURBANE", "INURN", "INURNS", "INUTILE", "INUTILITIES", "INUTILITY", "INVAGINATE", "INVALID", "INVALIDATE", "INVALIDATED", "INVALIDATES", "INVALIDATING", "INVALIDATION", "INVALIDATIONS", "INVALIDITIES", "INVALIDITY", "INVALIDLY", "INVALUABLE", "INVALUABLENESS", "INVALUABLENESSES", "INVALUABLY", "INVAR", "INVARIABILITIES", "INVARIABILITY", "INVARIABLE", "INVARIABLES", "INVARIABLY", "INVARIANCE", "INVARIANCES", "INVARIANT", "INVARIANTS", "INVARS", "INVENT", "INVENTED", "INVENTER", "INVENTERS", "INVENTING", "INVENTS", "INVERITIES", "INVERITY", "INVERSE", "INVERSES", "INVERSION", "INVERSIONS", "INVERT", "INVERTEBRATE", "INVERTEBRATES", "INVERTS", "INVEST", "INVESTED", "INVESTING", "INVESTMENT", "INVESTMENTS", "INVESTS", "INVIABILITIES", "INVIABILITY", "INVIABLE", "INVIABLY", "INVINCIBLE", "INVINCIBLY", "INVIOLABILITIES", "INVIOLABILITY", "INVIOLABLE", "INVIOLABLENESS", "INVIOLABLENESSES", "INVIOLABLY", "INVIOLATE", "INVIRILE", "INVISCID", "INVISIBILITIES", "INVISIBILITY", "INVISIBLE", "INVISIBLENESS", "INVISIBLENESSES", "INVISIBLY", "INVITAL", "INVOCATION", "INVOCATIONAL", "INVOCATIONS", "INVOICE", "INVOICED", "INVOICES", "INVOICING", "INVOLUNTARILY", "INVOLUNTARINESS", "INVOLUNTARINESSES", "INVOLUNTARY", "INVOLUTE", "INVOLUTED", "INVOLUTES", "INVOLUTION", "INVOLUTIONS", "INVULNERABILITIES", "INVULNERABILITY", "INVULNERABLE", "INVULNERABLENESS", "INVULNERABLENESSES", "INVULNERABLY", "INWALL", "INWALLED", "INWALLING", "INWALLS", "INWARD", "INWARDS", "INWEAVE", "INWEAVED", "INWEAVES", "INWEAVING", "INWIND", "INWINDING", "INWINDS", "INWOUND", "INWOVE", "INWOVEN", "INWRAP", "INWRAPPED", "INWRAPPING", "INWRAPS", "KEYBOARD", "KEYBOARDED", "KEYBOARDER", "KEYBOARDERS", "KEYBOARDING", "KEYBOARDS", "KEYBUTTON", "KEYBUTTONS", "KEYCARD", "KEYCARDS", "KEYHOLE", "KEYHOLES", "KEYLESS", "KEYNOTE", "KEYNOTED", "KEYNOTER", "KEYNOTERS", "KEYNOTES", "KEYNOTING", "KEYPAD", "KEYPADS", "KEYPUNCH", "KEYPUNCHED", "KEYPUNCHER", "KEYPUNCHERS", "KEYPUNCHES", "KEYPUNCHING", "KEYSET", "KEYSETS", "KEYSTONE", "KEYSTONES", "KEYSTROKE", "KEYSTROKED", "KEYSTROKES", "KEYSTROKING", "KEYWAY", "KEYWAYS", "KEYWORD", "KEYWORDS", "LADDERLIKE", "LIFTABLE", "LIFTERS", "LIFTGATE", "LIFTGATES", "LIFTMAN", "LIFTMEN", "LIFTOFF", "LIFTOFFS", "LIGHTBULB", "LIGHTBULBS", "LIGHTENS", "LIGHTERS", "LIGHTFACE", "LIGHTFACED", "LIGHTFACES", "LIGHTFAST", "LIGHTFASTNESS", "LIGHTFASTNESSES", "LIGHTHEADED", "LIGHTHEARTED", "LIGHTHOUSE", "LIGHTHOUSES", "LIGHTLESS", "LIGHTNESS", "LIGHTNESSES", "LIGHTPLANE", "LIGHTPLANES", "LIGHTPROOF", "LIGHTSHIP", "LIGHTSHIPS", "LIGHTSOME", "LIGHTTIGHT", "LIGHTWEIGHT", "LIGHTWEIGHTS", "LIGHTWOOD", "LIGHTWOODS", "LINEABLE", "LINEAGE", "LINEAGES", "LINEALLY", "LINEAMENT", "LINEAMENTS", "LINEARISE", "LINEARISES", "LINEARISING", "LINEATE", "LINEBACKER", "LINEBACKERS", "LINEBACKING", "LINEBACKINGS", "LINEBRED", "LINEBREEDING", "LINEBREEDINGS", "LINECASTER", "LINECASTERS", "LINECASTING", "LINECASTINGS", "LINECUT", "LINECUTS", "LINELESS", "LINELIKE", "LINEMAN", "LINEMEN", "LINEUPS", "LOOKALIKE", "LOOKDOWN", "LOOKDOWNS", "LOOKERS", "LOOKOUT", "LOOKOUTS", "LOOKUPS", "MARKDOWN", "MARKDOWNS", "MARKERS", "MARKKAS", "MARKUPS", "MATCHABLE", "MATCHBOARD", "MATCHBOARDS", "MATCHBOOK", "MATCHBOOKS", "MATCHBOX", "MATCHBOXES", "MATCHERS", "MATCHLESS", "MATCHLOCK", "MATCHLOCKS", "MATCHMAKER", "MATCHMAKERS", "MATCHMAKING", "MATCHMAKINGS", "MATCHSTICK", "MATCHSTICKS", "MATCHUPS", "MATCHWOOD", "MATCHWOODS", "MATERS", "MATHEMATIC", "MATHEMATICS", "MATINS", "MATLESS", "MATRES", "MATRICES", "MATTED", "MATTIN", "MATTING", "MATTINGS", "MATTINS", "MATTRASS", "MATTRASSES", "MATTRESS", "MATTRESSES", "MATURATE", "MATURATES", "MATZOON", "MATZOONS", "OFFALS", "OFFBEAT", "OFFBEATS", "OFFCAST", "OFFCASTS", "OFFCUT", "OFFCUTS", "OFFEND", "OFFENDED", "OFFENDER", "OFFENDERS", "OFFENDING", "OFFENDS", "OFFERS", "OFFHAND", "OFFHANDED", "OFFHANDEDNESS", "OFFHANDEDNESSES", "OFFICE", "OFFICEHOLDER", "OFFICEHOLDERS", "OFFICERED", "OFFICERING", "OFFICES", "OFFKEY", "OFFLOAD", "OFFLOADED", "OFFLOADING", "OFFLOADS", "OFFPRINT", "OFFPRINTED", "OFFPRINTING", "OFFPRINTS", "OFFRAMP", "OFFRAMPS", "OFFSCOURING", "OFFSCOURINGS", "OFFSCREEN", "OFFSET", "OFFSETS", "OFFSETTING", "OFFSHOOT", "OFFSHOOTS", "OFFSHORE", "OFFSIDE", "OFFSIDES", "OFFSPRING", "OFFSPRINGS", "OFFSTAGE", "OFFSTAGES", "OFFTRACK", "OUTACHIEVE", "OUTACHIEVED", "OUTACHIEVES", "OUTACHIEVING", "OUTACT", "OUTACTED", "OUTACTING", "OUTACTS", "OUTADD", "OUTADDED", "OUTADDING", "OUTADDS", "OUTAGE", "OUTAGES", "OUTARGUE", "OUTARGUED", "OUTARGUES", "OUTARGUING", "OUTASK", "OUTASKED", "OUTASKING", "OUTASKS", "OUTATE", "OUTBACK", "OUTBACKS", "OUTBAKE", "OUTBAKED", "OUTBAKES", "OUTBAKING", "OUTBALANCE", "OUTBALANCED", "OUTBALANCES", "OUTBALANCING", "OUTBARGAIN", "OUTBARGAINED", "OUTBARGAINING", "OUTBARGAINS", "OUTBARK", "OUTBARKED", "OUTBARKING", "OUTBARKS", "OUTBAWL", "OUTBAWLED", "OUTBAWLING", "OUTBAWLS", "OUTBEAM", "OUTBEAMED", "OUTBEAMING", "OUTBEAMS", "OUTBEG", "OUTBEGGED", "OUTBEGGING", "OUTBEGS", "OUTBID", "OUTBIDDEN", "OUTBIDDING", "OUTBIDS", "OUTBITCH", "OUTBITCHED", "OUTBITCHES", "OUTBITCHING", "OUTBLAZE", "OUTBLAZED", "OUTBLAZES", "OUTBLAZING", "OUTBLEAT", "OUTBLEATED", "OUTBLEATING", "OUTBLEATS", "OUTBLESS", "OUTBLESSED", "OUTBLESSES", "OUTBLESSING", "OUTBLOOM", "OUTBLOOMED", "OUTBLOOMING", "OUTBLOOMS", "OUTBLUFF", "OUTBLUFFED", "OUTBLUFFING", "OUTBLUFFS", "OUTBLUSH", "OUTBLUSHED", "OUTBLUSHES", "OUTBLUSHING", "OUTBOARD", "OUTBOARDS", "OUTBOAST", "OUTBOASTED", "OUTBOASTING", "OUTBOASTS", "OUTBOUGHT", "OUTBOUND", "OUTBOX", "OUTBOXED", "OUTBOXES", "OUTBOXING", "OUTBRAG", "OUTBRAGGED", "OUTBRAGGING", "OUTBRAGS", "OUTBRAVE", "OUTBRAVED", "OUTBRAVES", "OUTBRAVING", "OUTBRAWL", "OUTBRAWLED", "OUTBRAWLING", "OUTBRAWLS", "OUTBREAK", "OUTBREAKS", "OUTBRED", "OUTBREED", "OUTBREEDING", "OUTBREEDINGS", "OUTBREEDS", "OUTBRIBE", "OUTBRIBED", "OUTBRIBES", "OUTBRIBING", "OUTBUILD", "OUTBUILDING", "OUTBUILDINGS", "OUTBUILDS", "OUTBUILT", "OUTBULK", "OUTBULKED", "OUTBULKING", "OUTBULKS", "OUTBULLIED", "OUTBULLIES", "OUTBULLY", "OUTBULLYING", "OUTBURN", "OUTBURNED", "OUTBURNING", "OUTBURNS", "OUTBURNT", "OUTBURST", "OUTBURSTS", "OUTBUY", "OUTBUYING", "OUTBUYS", "OUTBYE", "OUTCAPER", "OUTCAPERED", "OUTCAPERING", "OUTCAPERS", "OUTCAST", "OUTCASTE", "OUTCASTES", "OUTCASTS", "OUTCATCH", "OUTCATCHES", "OUTCATCHING", "OUTCAUGHT", "OUTCAVIL", "OUTCAVILED", "OUTCAVILING", "OUTCAVILLED", "OUTCAVILLING", "OUTCAVILS", "OUTCHARGE", "OUTCHARGED", "OUTCHARGES", "OUTCHARGING", "OUTCHARM", "OUTCHARMED", "OUTCHARMING", "OUTCHARMS", "OUTCHEAT", "OUTCHEATED", "OUTCHEATING", "OUTCHEATS", "OUTCHID", "OUTCHIDDEN", "OUTCHIDE", "OUTCHIDED", "OUTCHIDES", "OUTCHIDING", "OUTCLASS", "OUTCLASSED", "OUTCLASSES", "OUTCLASSING", "OUTCLIMB", "OUTCLIMBED", "OUTCLIMBING", "OUTCLIMBS", "OUTCLOMB", "OUTCOACH", "OUTCOACHED", "OUTCOACHES", "OUTCOACHING", "OUTCOME", "OUTCOMES", "OUTCOMPETE", "OUTCOMPETED", "OUTCOMPETES", "OUTCOMPETING", "OUTCOOK", "OUTCOOKED", "OUTCOOKING", "OUTCOOKS", "OUTCOUNT", "OUTCOUNTED", "OUTCOUNTING", "OUTCOUNTS", "OUTCRAWL", "OUTCRAWLED", "OUTCRAWLING", "OUTCRAWLS", "OUTCRIED", "OUTCRIES", "OUTCROP", "OUTCROPPED", "OUTCROPPING", "OUTCROPS", "OUTCROSS", "OUTCROSSED", "OUTCROSSES", "OUTCROSSING", "OUTCROW", "OUTCROWED", "OUTCROWING", "OUTCROWS", "OUTCRY", "OUTCRYING", "OUTCURSE", "OUTCURSED", "OUTCURSES", "OUTCURSING", "OUTCURVE", "OUTCURVES", "OUTDANCE", "OUTDANCED", "OUTDANCES", "OUTDANCING", "OUTDARE", "OUTDARED", "OUTDARES", "OUTDARING", "OUTDATE", "OUTDATED", "OUTDATEDLY", "OUTDATEDNESS", "OUTDATEDNESSES", "OUTDATES", "OUTDATING", "OUTDAZZLE", "OUTDAZZLED", "OUTDAZZLES", "OUTDAZZLING", "OUTDEBATE", "OUTDEBATED", "OUTDEBATES", "OUTDEBATING", "OUTDELIVER", "OUTDELIVERED", "OUTDELIVERING", "OUTDELIVERS", "OUTDESIGN", "OUTDESIGNED", "OUTDESIGNING", "OUTDESIGNS", "OUTDID", "OUTDISTANCE", "OUTDISTANCED", "OUTDISTANCES", "OUTDISTANCING", "OUTDODGE", "OUTDODGED", "OUTDODGES", "OUTDODGING", "OUTDOER", "OUTDOERS", "OUTDOES", "OUTDOING", "OUTDONE", "OUTDOOR", "OUTDOORS", "OUTDRAG", "OUTDRAGGED", "OUTDRAGGING", "OUTDRAGS", "OUTDRANK", "OUTDRAW", "OUTDRAWING", "OUTDRAWN", "OUTDRAWS", "OUTDREAM", "OUTDREAMED", "OUTDREAMING", "OUTDREAMS", "OUTDREAMT", "OUTDRESS", "OUTDRESSED", "OUTDRESSES", "OUTDRESSING", "OUTDREW", "OUTDRINK", "OUTDRINKING", "OUTDRINKS", "OUTDRIVE", "OUTDRIVEN", "OUTDRIVES", "OUTDRIVING", "OUTDROP", "OUTDROPPED", "OUTDROPPING", "OUTDROPS", "OUTDROVE", "OUTDRUNK", "OUTDUEL", "OUTDUELED", "OUTDUELING", "OUTDUELLED", "OUTDUELLING", "OUTDUELS", "OUTEARN", "OUTEARNED", "OUTEARNING", "OUTEARNS", "OUTEAT", "OUTEATEN", "OUTEATING", "OUTEATS", "OUTECHO", "OUTECHOED", "OUTECHOES", "OUTECHOING", "OUTERS", "OUTFABLE", "OUTFABLED", "OUTFABLES", "OUTFABLING", "OUTFACE", "OUTFACED", "OUTFACES", "OUTFACING", "OUTFALL", "OUTFALLS", "OUTFAST", "OUTFASTED", "OUTFASTING", "OUTFASTS", "OUTFAWN", "OUTFAWNED", "OUTFAWNING", "OUTFAWNS", "OUTFEAST", "OUTFEASTED", "OUTFEASTING", "OUTFEASTS", "OUTFEEL", "OUTFEELING", "OUTFEELS", "OUTFELT", "OUTFIELD", "OUTFIELDER", "OUTFIELDERS", "OUTFIELDS", "OUTFIGHT", "OUTFIGHTING", "OUTFIGHTS", "OUTFIGURE", "OUTFIGURED", "OUTFIGURES", "OUTFIGURING", "OUTFIND", "OUTFINDING", "OUTFINDS", "OUTFIRE", "OUTFIRED", "OUTFIRES", "OUTFIRING", "OUTFISH", "OUTFISHED", "OUTFISHES", "OUTFISHING", "OUTFIT", "OUTFITS", "OUTFITTED", "OUTFITTER", "OUTFITTERS", "OUTFITTING", "OUTFLANK", "OUTFLANKED", "OUTFLANKING", "OUTFLANKS", "OUTFLEW", "OUTFLIES", "OUTFLOW", "OUTFLOWED", "OUTFLOWING", "OUTFLOWN", "OUTFLOWS", "OUTFLY", "OUTFLYING", "OUTFOOL", "OUTFOOLED", "OUTFOOLING", "OUTFOOLS", "OUTFOOT", "OUTFOOTED", "OUTFOOTING", "OUTFOOTS", "OUTFOUGHT", "OUTFOUND", "OUTFOX", "OUTFOXED", "OUTFOXES", "OUTFOXING", "OUTFROWN", "OUTFROWNED", "OUTFROWNING", "OUTFROWNS", "OUTFUMBLE", "OUTFUMBLED", "OUTFUMBLES", "OUTFUMBLING", "OUTGAIN", "OUTGAINED", "OUTGAINING", "OUTGAINS", "OUTGAS", "OUTGASSED", "OUTGASSES", "OUTGASSING", "OUTGAVE", "OUTGENERAL", "OUTGENERALS", "OUTGIVE", "OUTGIVEN", "OUTGIVES", "OUTGIVING", "OUTGLARE", "OUTGLARED", "OUTGLARES", "OUTGLARING", "OUTGLITTER", "OUTGLITTERED", "OUTGLITTERING", "OUTGLITTERS", "OUTGLOW", "OUTGLOWED", "OUTGLOWING", "OUTGLOWS", "OUTGNAW", "OUTGNAWED", "OUTGNAWING", "OUTGNAWN", "OUTGNAWS", "OUTGOES", "OUTGOING", "OUTGOINGS", "OUTGONE", "OUTGREW", "OUTGRIN", "OUTGRINNED", "OUTGRINNING", "OUTGRINS", "OUTGROSS", "OUTGROSSED", "OUTGROSSES", "OUTGROSSING", "OUTGROUP", "OUTGROUPS", "OUTGROW", "OUTGROWING", "OUTGROWN", "OUTGROWS", "OUTGROWTH", "OUTGROWTHS", "OUTGUESS", "OUTGUESSED", "OUTGUESSES", "OUTGUESSING", "OUTGUIDE", "OUTGUIDED", "OUTGUIDES", "OUTGUIDING", "OUTGUN", "OUTGUNNED", "OUTGUNNING", "OUTGUNS", "OUTGUSH", "OUTGUSHES", "OUTHAUL", "OUTHAULS", "OUTHEAR", "OUTHEARD", "OUTHEARING", "OUTHEARS", "OUTHIT", "OUTHITS", "OUTHITTING", "OUTHOMER", "OUTHOMERED", "OUTHOMERING", "OUTHOMERS", "OUTHOUSE", "OUTHOUSES", "OUTHOWL", "OUTHOWLED", "OUTHOWLING", "OUTHOWLS", "OUTHUMOR", "OUTHUMORED", "OUTHUMORING", "OUTHUMORS", "OUTHUNT", "OUTHUNTED", "OUTHUNTING", "OUTHUNTS", "OUTHUSTLE", "OUTHUSTLED", "OUTHUSTLES", "OUTHUSTLING", "OUTINTRIGUE", "OUTINTRIGUED", "OUTINTRIGUES", "OUTINTRIGUING", "OUTJINX", "OUTJINXED", "OUTJINXES", "OUTJINXING", "OUTJUMP", "OUTJUMPED", "OUTJUMPING", "OUTJUMPS", "OUTJUT", "OUTJUTS", "OUTJUTTED", "OUTJUTTING", "OUTKEEP", "OUTKEEPING", "OUTKEEPS", "OUTKEPT", "OUTKICK", "OUTKICKED", "OUTKICKING", "OUTKICKS", "OUTKILL", "OUTKILLED", "OUTKILLING", "OUTKILLS", "OUTKISS", "OUTKISSED", "OUTKISSES", "OUTKISSING", "OUTLAID", "OUTLAIN", "OUTLAND", "OUTLANDER", "OUTLANDERS", "OUTLANDS", "OUTLAST", "OUTLASTED", "OUTLASTING", "OUTLASTS", "OUTLAUGH", "OUTLAUGHED", "OUTLAUGHING", "OUTLAUGHS", "OUTLAW", "OUTLAWED", "OUTLAWING", "OUTLAWS", "OUTLAY", "OUTLAYING", "OUTLAYS", "OUTLEAP", "OUTLEAPED", "OUTLEAPING", "OUTLEAPS", "OUTLEAPT", "OUTLEARN", "OUTLEARNED", "OUTLEARNING", "OUTLEARNS", "OUTLEARNT", "OUTLET", "OUTLETS", "OUTLIE", "OUTLIER", "OUTLIERS", "OUTLIES", "OUTLINE", "OUTLINED", "OUTLINER", "OUTLINERS", "OUTLINES", "OUTLINING", "OUTLIVE", "OUTLIVED", "OUTLIVER", "OUTLIVERS", "OUTLIVES", "OUTLIVING", "OUTLOOK", "OUTLOOKS", "OUTLOVE", "OUTLOVED", "OUTLOVES", "OUTLOVING", "OUTLYING", "OUTMAN", "OUTMANEUVER", "OUTMANEUVERED", "OUTMANEUVERING", "OUTMANEUVERS", "OUTMANIPULATE", "OUTMANIPULATED", "OUTMANIPULATES", "OUTMANIPULATING", "OUTMANNED", "OUTMANNING", "OUTMANS", "OUTMARCH", "OUTMARCHED", "OUTMARCHES", "OUTMARCHING", "OUTMATCH", "OUTMATCHED", "OUTMATCHES", "OUTMATCHING", "OUTMODE", "OUTMODES", "OUTMOST", "OUTMOVE", "OUTMOVED", "OUTMOVES", "OUTMOVING", "OUTMUSCLE", "OUTMUSCLED", "OUTMUSCLES", "OUTMUSCLING", "OUTNUMBER", "OUTNUMBERED", "OUTNUMBERING", "OUTNUMBERS", "OUTORGANIZE", "OUTORGANIZED", "OUTORGANIZES", "OUTORGANIZING", "OUTPACE", "OUTPACED", "OUTPACES", "OUTPACING", "OUTPAINT", "OUTPAINTED", "OUTPAINTING", "OUTPAINTS", "OUTPASS", "OUTPASSED", "OUTPASSES", "OUTPASSING", "OUTPATIENT", "OUTPATIENTS", "OUTPERFORM", "OUTPERFORMED", "OUTPERFORMING", "OUTPERFORMS", "OUTPITCH", "OUTPITCHED", "OUTPITCHES", "OUTPITCHING", "OUTPITIED", "OUTPITIES", "OUTPITY", "OUTPITYING", "OUTPLACEMENT", "OUTPLACEMENTS", "OUTPLAN", "OUTPLANNED", "OUTPLANNING", "OUTPLANS", "OUTPLAY", "OUTPLAYED", "OUTPLAYING", "OUTPLAYS", "OUTPLOD", "OUTPLODDED", "OUTPLODDING", "OUTPLODS", "OUTPLOT", "OUTPLOTS", "OUTPLOTTED", "OUTPLOTTING", "OUTPOINT", "OUTPOINTED", "OUTPOINTING", "OUTPOINTS", "OUTPOLITICK", "OUTPOLITICKED", "OUTPOLITICKING", "OUTPOLITICKS", "OUTPOLL", "OUTPOLLED", "OUTPOLLING", "OUTPOLLS", "OUTPOPULATE", "OUTPOPULATED", "OUTPOPULATES", "OUTPOPULATING", "OUTPORT", "OUTPORTS", "OUTPOST", "OUTPOSTS", "OUTPOUR", "OUTPOURED", "OUTPOURING", "OUTPOURS", "OUTPOWER", "OUTPOWERED", "OUTPOWERING", "OUTPOWERS", "OUTPRAY", "OUTPRAYED", "OUTPRAYING", "OUTPRAYS", "OUTPREACH", "OUTPREACHED", "OUTPREACHES", "OUTPREACHING", "OUTPREEN", "OUTPREENED", "OUTPREENING", "OUTPREENS", "OUTPRESS", "OUTPRESSED", "OUTPRESSES", "OUTPRESSING", "OUTPRICE", "OUTPRICED", "OUTPRICES", "OUTPRICING", "OUTPRODUCE", "OUTPRODUCED", "OUTPRODUCES", "OUTPRODUCING", "OUTPROMISE", "OUTPROMISED", "OUTPROMISES", "OUTPROMISING", "OUTPULL", "OUTPULLED", "OUTPULLING", "OUTPULLS", "OUTPUNCH", "OUTPUNCHED", "OUTPUNCHES", "OUTPUNCHING", "OUTPUSH", "OUTPUSHED", "OUTPUSHES", "OUTPUSHING", "OUTPUT", "OUTPUTS", "OUTPUTTED", "OUTPUTTING", "OUTQUOTE", "OUTQUOTED", "OUTQUOTES", "OUTQUOTING", "OUTRACE", "OUTRACED", "OUTRACES", "OUTRACING", "OUTRAGE", "OUTRAGED", "OUTRAGES", "OUTRAGING", "OUTRAISE", "OUTRAISED", "OUTRAISES", "OUTRAISING", "OUTRAN", "OUTRANCE", "OUTRANCES", "OUTRANG", "OUTRANGE", "OUTRANGED", "OUTRANGES", "OUTRANGING", "OUTRANK", "OUTRANKED", "OUTRANKING", "OUTRANKS", "OUTRATE", "OUTRATED", "OUTRATES", "OUTRATING", "OUTRAVE", "OUTRAVED", "OUTRAVES", "OUTRAVING", "OUTREACH", "OUTREACHED", "OUTREACHES", "OUTREACHING", "OUTREAD", "OUTREADING", "OUTREADS", "OUTREBOUND", "OUTREBOUNDED", "OUTREBOUNDING", "OUTREBOUNDS", "OUTREPRODUCE", "OUTREPRODUCED", "OUTREPRODUCES", "OUTREPRODUCING", "OUTRIDDEN", "OUTRIDE", "OUTRIDER", "OUTRIDERS", "OUTRIDES", "OUTRIDING", "OUTRIGGER", "OUTRIGGERS", "OUTRIGHT", "OUTRIGHTLY", "OUTRING", "OUTRINGING", "OUTRINGS", "OUTRIVAL", "OUTRIVALED", "OUTRIVALING", "OUTRIVALLED", "OUTRIVALLING", "OUTRIVALS", "OUTROAR", "OUTROARED", "OUTROARING", "OUTROARS", "OUTROCK", "OUTROCKED", "OUTROCKING", "OUTROCKS", "OUTRODE", "OUTROLL", "OUTROLLED", "OUTROLLING", "OUTROLLS", "OUTROOT", "OUTROOTED", "OUTROOTING", "OUTROOTS", "OUTROW", "OUTROWED", "OUTROWING", "OUTROWS", "OUTRUN", "OUTRUNG", "OUTRUNNING", "OUTRUNS", "OUTRUSH", "OUTRUSHED", "OUTRUSHES", "OUTRUSHING", "OUTSAIL", "OUTSAILED", "OUTSAILING", "OUTSAILS", "OUTSANG", "OUTSAT", "OUTSAVOR", "OUTSAVORED", "OUTSAVORING", "OUTSAVORS", "OUTSAW", "OUTSCHEME", "OUTSCHEMED", "OUTSCHEMES", "OUTSCHEMING", "OUTSCOLD", "OUTSCOLDED", "OUTSCOLDING", "OUTSCOLDS", "OUTSCOOP", "OUTSCOOPED", "OUTSCOOPING", "OUTSCOOPS", "OUTSCORE", "OUTSCORED", "OUTSCORES", "OUTSCORING", "OUTSCORN", "OUTSCORNED", "OUTSCORNING", "OUTSCORNS", "OUTSEE", "OUTSEEING", "OUTSEEN", "OUTSEES", "OUTSELL", "OUTSELLING", "OUTSELLS", "OUTSERVE", "OUTSERVED", "OUTSERVES", "OUTSERVING", "OUTSET", "OUTSETS", "OUTSHAME", "OUTSHAMED", "OUTSHAMES", "OUTSHAMING", "OUTSHINE", "OUTSHINED", "OUTSHINES", "OUTSHINING", "OUTSHONE", "OUTSHOOT", "OUTSHOOTING", "OUTSHOOTS", "OUTSHOT", "OUTSHOUT", "OUTSHOUTED", "OUTSHOUTING", "OUTSHOUTS", "OUTSIDE", "OUTSIDES", "OUTSIGHT", "OUTSIGHTS", "OUTSIN", "OUTSING", "OUTSINGING", "OUTSINGS", "OUTSINNED", "OUTSINNING", "OUTSINS", "OUTSIT", "OUTSITS", "OUTSITTING", "OUTSIZE", "OUTSIZED", "OUTSIZES", "OUTSKATE", "OUTSKATED", "OUTSKATES", "OUTSKATING", "OUTSKIRT", "OUTSKIRTS", "OUTSLEEP", "OUTSLEEPING", "OUTSLEEPS", "OUTSLEPT", "OUTSLICK", "OUTSLICKED", "OUTSLICKING", "OUTSLICKS", "OUTSMART", "OUTSMARTED", "OUTSMARTING", "OUTSMARTS", "OUTSMILE", "OUTSMILED", "OUTSMILES", "OUTSMILING", "OUTSMOKE", "OUTSMOKED", "OUTSMOKES", "OUTSMOKING", "OUTSNORE", "OUTSNORED", "OUTSNORES", "OUTSNORING", "OUTSOAR", "OUTSOARED", "OUTSOARING", "OUTSOARS", "OUTSOLD", "OUTSOLE", "OUTSOLES", "OUTSOURCING", "OUTSPAN", "OUTSPANNED", "OUTSPANNING", "OUTSPANS", "OUTSPARKLE", "OUTSPARKLED", "OUTSPARKLES", "OUTSPARKLING", "OUTSPEAK", "OUTSPEAKING", "OUTSPEAKS", "OUTSPED", "OUTSPEED", "OUTSPEEDED", "OUTSPEEDING", "OUTSPEEDS", "OUTSPELL", "OUTSPELLED", "OUTSPELLING", "OUTSPELLS", "OUTSPELT", "OUTSPEND", "OUTSPENDING", "OUTSPENDS", "OUTSPENT", "OUTSPOKE", "OUTSPOKEN", "OUTSPREAD", "OUTSPREADING", "OUTSPREADS", "OUTSPRINT", "OUTSPRINTED", "OUTSPRINTING", "OUTSPRINTS", "OUTSTAND", "OUTSTANDING", "OUTSTANDS", "OUTSTARE", "OUTSTARED", "OUTSTARES", "OUTSTARING", "OUTSTART", "OUTSTARTED", "OUTSTARTING", "OUTSTARTS", "OUTSTATE", "OUTSTATED", "OUTSTATES", "OUTSTATING", "OUTSTATION", "OUTSTATIONS", "OUTSTAY", "OUTSTAYED", "OUTSTAYING", "OUTSTAYS", "OUTSTEER", "OUTSTEERED", "OUTSTEERING", "OUTSTEERS", "OUTSTOOD", "OUTSTRETCH", "OUTSTRETCHED", "OUTSTRETCHES", "OUTSTRETCHING", "OUTSTRIDDEN", "OUTSTRIDE", "OUTSTRIDES", "OUTSTRIDING", "OUTSTRIP", "OUTSTRIPPED", "OUTSTRIPPING", "OUTSTRIPS", "OUTSTRODE", "OUTSTUDIED", "OUTSTUDIES", "OUTSTUDY", "OUTSTUDYING", "OUTSTUNT", "OUTSTUNTED", "OUTSTUNTING", "OUTSTUNTS", "OUTSULK", "OUTSULKED", "OUTSULKING", "OUTSULKS", "OUTSUNG", "OUTSWAM", "OUTSWARE", "OUTSWEAR", "OUTSWEARING", "OUTSWEARS", "OUTSWIM", "OUTSWIMMING", "OUTSWIMS", "OUTSWORE", "OUTSWORN", "OUTSWUM", "OUTTAKE", "OUTTAKES", "OUTTALK", "OUTTALKED", "OUTTALKING", "OUTTALKS", "OUTTASK", "OUTTASKED", "OUTTASKING", "OUTTASKS", "OUTTELL", "OUTTELLING", "OUTTELLS", "OUTTHANK", "OUTTHANKED", "OUTTHANKING", "OUTTHANKS", "OUTTHINK", "OUTTHINKING", "OUTTHINKS", "OUTTHOUGHT", "OUTTHREW", "OUTTHROB", "OUTTHROBBED", "OUTTHROBBING", "OUTTHROBS", "OUTTHROW", "OUTTHROWING", "OUTTHROWN", "OUTTHROWS", "OUTTHRUST", "OUTTHRUSTING", "OUTTHRUSTS", "OUTTOLD", "OUTTOWER", "OUTTOWERED", "OUTTOWERING", "OUTTOWERS", "OUTTRADE", "OUTTRADED", "OUTTRADES", "OUTTRADING", "OUTTRICK", "OUTTRICKED", "OUTTRICKING", "OUTTRICKS", "OUTTROT", "OUTTROTS", "OUTTROTTED", "OUTTROTTING", "OUTTRUMP", "OUTTRUMPED", "OUTTRUMPING", "OUTTRUMPS", "OUTTURN", "OUTTURNS", "OUTVALUE", "OUTVALUED", "OUTVALUES", "OUTVALUING", "OUTVAUNT", "OUTVAUNTED", "OUTVAUNTING", "OUTVAUNTS", "OUTVIE", "OUTVIED", "OUTVIES", "OUTVOICE", "OUTVOICED", "OUTVOICES", "OUTVOICING", "OUTVOTE", "OUTVOTED", "OUTVOTES", "OUTVOTING", "OUTVYING", "OUTWAIT", "OUTWAITED", "OUTWAITING", "OUTWAITS", "OUTWALK", "OUTWALKED", "OUTWALKING", "OUTWALKS", "OUTWAR", "OUTWARD", "OUTWARDS", "OUTWARRED", "OUTWARRING", "OUTWARS", "OUTWASH", "OUTWASHES", "OUTWASTE", "OUTWASTED", "OUTWASTES", "OUTWASTING", "OUTWATCH", "OUTWATCHED", "OUTWATCHES", "OUTWATCHING", "OUTWEAR", "OUTWEARIED", "OUTWEARIES", "OUTWEARING", "OUTWEARS", "OUTWEARY", "OUTWEARYING", "OUTWEEP", "OUTWEEPING", "OUTWEEPS", "OUTWEIGH", "OUTWEIGHED", "OUTWEIGHING", "OUTWEIGHS", "OUTWENT", "OUTWEPT", "OUTWHIRL", "OUTWHIRLED", "OUTWHIRLING", "OUTWHIRLS", "OUTWILE", "OUTWILED", "OUTWILES", "OUTWILING", "OUTWILL", "OUTWILLED", "OUTWILLING", "OUTWILLS", "OUTWIND", "OUTWINDED", "OUTWINDING", "OUTWINDS", "OUTWISH", "OUTWISHED", "OUTWISHES", "OUTWISHING", "OUTWIT", "OUTWITS", "OUTWITTED", "OUTWITTING", "OUTWORE", "OUTWORK", "OUTWORKED", "OUTWORKER", "OUTWORKERS", "OUTWORKING", "OUTWORKS", "OUTWORN", "OUTWRESTLE", "OUTWRESTLED", "OUTWRESTLES", "OUTWRESTLING", "OUTWRIT", "OUTWRITE", "OUTWRITES", "OUTWRITING", "OUTWRITTEN", "OUTWROTE", "OUTWROUGHT", "OUTYELL", "OUTYELLED", "OUTYELLING", "OUTYELLS", "OUTYELP", "OUTYELPED", "OUTYELPING", "OUTYELPS", "OUTYIELD", "OUTYIELDED", "OUTYIELDING", "OUTYIELDS", "OVERABLE", "OVERABSTRACT", "OVERABSTRACTED", "OVERABSTRACTING", "OVERABSTRACTS", "OVERABUNDANCE", "OVERABUNDANCES", "OVERABUNDANT", "OVERACCENTUATE", "OVERACCENTUATED", "OVERACCENTUATES", "OVERACCENTUATING", "OVERACHIEVE", "OVERACHIEVED", "OVERACHIEVEMENT", "OVERACHIEVEMENTS", "OVERACHIEVER", "OVERACHIEVERS", "OVERACHIEVES", "OVERACHIEVING", "OVERACT", "OVERACTED", "OVERACTING", "OVERACTION", "OVERACTIONS", "OVERACTIVE", "OVERACTIVITIES", "OVERACTIVITY", "OVERACTS", "OVERADJUSTMENT", "OVERADJUSTMENTS", "OVERADVERTISE", "OVERADVERTISED", "OVERADVERTISES", "OVERADVERTISING", "OVERAGE", "OVERAGED", "OVERAGES", "OVERAGGRESSIVE", "OVERALERT", "OVERALL", "OVERALLS", "OVERAMBITIOUS", "OVERAMBITIOUSNESS", "OVERAMBITIOUSNESSES", "OVERAMPLIFIED", "OVERANALYSES", "OVERANALYSIS", "OVERANALYTICAL", "OVERANALYZE", "OVERANALYZED", "OVERANALYZES", "OVERANALYZING", "OVERANXIETIES", "OVERANXIETY", "OVERANXIOUS", "OVERAPPLICATION", "OVERAPPLICATIONS", "OVERAPT", "OVERARCH", "OVERARCHED", "OVERARCHES", "OVERARCHING", "OVERARM", "OVERAROUSAL", "OVERAROUSALS", "OVERARRANGE", "OVERARRANGED", "OVERARRANGES", "OVERARRANGING", "OVERARTICULATE", "OVERARTICULATED", "OVERARTICULATES", "OVERARTICULATING", "OVERASSERT", "OVERASSERTED", "OVERASSERTING", "OVERASSERTION", "OVERASSERTIONS", "OVERASSERTIVE", "OVERASSERTS", "OVERASSESSMENT", "OVERASSESSMENTS", "OVERATE", "OVERATTENTION", "OVERATTENTIONS", "OVERAWE", "OVERAWED", "OVERAWES", "OVERAWING", "OVERBAKE", "OVERBAKED", "OVERBAKES", "OVERBAKING", "OVERBALANCE", "OVERBALANCED", "OVERBALANCES", "OVERBALANCING", "OVERBEAR", "OVERBEARING", "OVERBEARS", "OVERBEAT", "OVERBEATEN", "OVERBEATING", "OVERBEATS", "OVERBED", "OVERBEJEWELED", "OVERBET", "OVERBETS", "OVERBETTED", "OVERBETTING", "OVERBID", "OVERBIDDEN", "OVERBIDDING", "OVERBIDS", "OVERBIG", "OVERBILL", "OVERBILLED", "OVERBILLING", "OVERBILLS", "OVERBITE", "OVERBITES", "OVERBLEACH", "OVERBLEACHED", "OVERBLEACHES", "OVERBLEACHING", "OVERBLEW", "OVERBLOUSE", "OVERBLOUSES", "OVERBLOW", "OVERBLOWING", "OVERBLOWN", "OVERBLOWS", "OVERBOARD", "OVERBOIL", "OVERBOILED", "OVERBOILING", "OVERBOILS", "OVERBOLD", "OVERBOOK", "OVERBOOKED", "OVERBOOKING", "OVERBOOKS", "OVERBORE", "OVERBORN", "OVERBORNE", "OVERBORROW", "OVERBORROWED", "OVERBORROWING", "OVERBORROWS", "OVERBOUGHT", "OVERBREATHING", "OVERBRED", "OVERBRIEF", "OVERBRIGHT", "OVERBROAD", "OVERBROWSE", "OVERBROWSED", "OVERBROWSES", "OVERBROWSING", "OVERBRUTAL", "OVERBUILD", "OVERBUILDING", "OVERBUILDS", "OVERBUILT", "OVERBURDEN", "OVERBURDENED", "OVERBURDENING", "OVERBURDENS", "OVERBURN", "OVERBURNED", "OVERBURNING", "OVERBURNS", "OVERBURNT", "OVERBUSY", "OVERBUY", "OVERBUYING", "OVERBUYS", "OVERCALL", "OVERCALLED", "OVERCALLING", "OVERCALLS", "OVERCAME", "OVERCAPACITIES", "OVERCAPACITY", "OVERCAPITALIZATION", "OVERCAPITALIZATIONS", "OVERCAPITALIZE", "OVERCAPITALIZED", "OVERCAPITALIZES", "OVERCAPITALIZING", "OVERCAREFUL", "OVERCAST", "OVERCASTING", "OVERCASTINGS", "OVERCASTS", "OVERCAUTION", "OVERCAUTIONED", "OVERCAUTIONING", "OVERCAUTIONS", "OVERCAUTIOUS", "OVERCENTRALIZATION", "OVERCENTRALIZATIONS", "OVERCENTRALIZE", "OVERCENTRALIZED", "OVERCENTRALIZES", "OVERCENTRALIZING", "OVERCHARGE", "OVERCHARGED", "OVERCHARGES", "OVERCHARGING", "OVERCHILL", "OVERCHILLED", "OVERCHILLING", "OVERCHILLS", "OVERCIVILIZED", "OVERCLAIM", "OVERCLAIMED", "OVERCLAIMING", "OVERCLAIMS", "OVERCLASSIFICATION", "OVERCLASSIFICATIONS", "OVERCLASSIFIED", "OVERCLASSIFIES", "OVERCLASSIFY", "OVERCLASSIFYING", "OVERCLEAN", "OVERCLEANED", "OVERCLEANING", "OVERCLEANS", "OVERCLEAR", "OVERCLEARED", "OVERCLEARING", "OVERCLEARS", "OVERCLOUD", "OVERCLOUDED", "OVERCLOUDING", "OVERCLOUDS", "OVERCOACH", "OVERCOACHED", "OVERCOACHES", "OVERCOACHING", "OVERCOAT", "OVERCOATS", "OVERCOLD", "OVERCOME", "OVERCOMER", "OVERCOMERS", "OVERCOMES", "OVERCOMING", "OVERCOMMERCIALIZATION", "OVERCOMMERCIALIZATIONS", "OVERCOMMERCIALIZE", "OVERCOMMERCIALIZED", "OVERCOMMERCIALIZES", "OVERCOMMERCIALIZING", "OVERCOMMIT", "OVERCOMMITMENT", "OVERCOMMITMENTS", "OVERCOMMITS", "OVERCOMMITTED", "OVERCOMMITTING", "OVERCOMMUNICATE", "OVERCOMMUNICATED", "OVERCOMMUNICATES", "OVERCOMMUNICATING", "OVERCOMMUNICATION", "OVERCOMMUNICATIONS", "OVERCOMPENSATE", "OVERCOMPENSATED", "OVERCOMPENSATES", "OVERCOMPENSATING", "OVERCOMPENSATION", "OVERCOMPENSATIONS", "OVERCOMPENSATORY", "OVERCOMPLEX", "OVERCOMPLIANCE", "OVERCOMPLIANCES", "OVERCOMPLICATE", "OVERCOMPLICATED", "OVERCOMPLICATES", "OVERCOMPLICATING", "OVERCOMPRESS", "OVERCOMPRESSED", "OVERCOMPRESSES", "OVERCOMPRESSING", "OVERCONCENTRATION", "OVERCONCENTRATIONS", "OVERCONCERN", "OVERCONCERNED", "OVERCONCERNING", "OVERCONCERNS", "OVERCONFIDENCE", "OVERCONFIDENCES", "OVERCONFIDENT", "OVERCONFIDENTLY", "OVERCONSCIENTIOUS", "OVERCONSCIOUS", "OVERCONSERVATIVE", "OVERCONSTRUCT", "OVERCONSTRUCTED", "OVERCONSTRUCTING", "OVERCONSTRUCTS", "OVERCONSUME", "OVERCONSUMED", "OVERCONSUMES", "OVERCONSUMING", "OVERCONSUMPTION", "OVERCONSUMPTIONS", "OVERCONTROL", "OVERCONTROLLED", "OVERCONTROLLING", "OVERCONTROLS", "OVERCOOK", "OVERCOOKED", "OVERCOOKING", "OVERCOOKS", "OVERCOOL", "OVERCOOLED", "OVERCOOLING", "OVERCOOLS", "OVERCORRECT", "OVERCORRECTED", "OVERCORRECTING", "OVERCORRECTION", "OVERCORRECTIONS", "OVERCORRECTS", "OVERCOUNT", "OVERCOUNTED", "OVERCOUNTING", "OVERCOUNTS", "OVERCOY", "OVERCRAM", "OVERCRAMMED", "OVERCRAMMING", "OVERCRAMS", "OVERCREDULOUS", "OVERCRITICAL", "OVERCROP", "OVERCROPPED", "OVERCROPPING", "OVERCROPS", "OVERCROWD", "OVERCROWDED", "OVERCROWDING", "OVERCROWDS", "OVERCULTIVATION", "OVERCULTIVATIONS", "OVERCURE", "OVERCURED", "OVERCURES", "OVERCURING", "OVERCUT", "OVERCUTS", "OVERCUTTING", "OVERDARE", "OVERDARED", "OVERDARES", "OVERDARING", "OVERDEAR", "OVERDECK", "OVERDECKED", "OVERDECKING", "OVERDECKS", "OVERDECORATE", "OVERDECORATED", "OVERDECORATES", "OVERDECORATING", "OVERDECORATION", "OVERDECORATIONS", "OVERDEMANDING", "OVERDEPENDENCE", "OVERDEPENDENCES", "OVERDEPENDENT", "OVERDESIGN", "OVERDESIGNED", "OVERDESIGNING", "OVERDESIGNS", "OVERDETERMINED", "OVERDEVELOP", "OVERDEVELOPED", "OVERDEVELOPING", "OVERDEVELOPMENT", "OVERDEVELOPMENTS", "OVERDEVELOPS", "OVERDID", "OVERDIFFERENTIATION", "OVERDIFFERENTIATIONS", "OVERDIRECT", "OVERDIRECTED", "OVERDIRECTING", "OVERDIRECTS", "OVERDISCOUNT", "OVERDISCOUNTED", "OVERDISCOUNTING", "OVERDISCOUNTS", "OVERDIVERSITIES", "OVERDIVERSITY", "OVERDOCUMENT", "OVERDOCUMENTED", "OVERDOCUMENTING", "OVERDOCUMENTS", "OVERDOER", "OVERDOERS", "OVERDOES", "OVERDOG", "OVERDOGS", "OVERDOING", "OVERDOMINANCE", "OVERDOMINANCES", "OVERDOMINANT", "OVERDONE", "OVERDOSAGE", "OVERDOSAGES", "OVERDOSE", "OVERDOSED", "OVERDOSES", "OVERDOSING", "OVERDRAFT", "OVERDRAFTS", "OVERDRAMATIC", "OVERDRAMATIZE", "OVERDRAMATIZED", "OVERDRAMATIZES", "OVERDRAMATIZING", "OVERDRANK", "OVERDRAW", "OVERDRAWING", "OVERDRAWN", "OVERDRAWS", "OVERDRESS", "OVERDRESSED", "OVERDRESSES", "OVERDRESSING", "OVERDREW", "OVERDRIED", "OVERDRIES", "OVERDRINK", "OVERDRINKING", "OVERDRINKS", "OVERDRIVE", "OVERDRIVEN", "OVERDRIVES", "OVERDRIVING", "OVERDROVE", "OVERDRUNK", "OVERDRY", "OVERDRYING", "OVERDUB", "OVERDUBBED", "OVERDUBBING", "OVERDUBS", "OVERDUE", "OVERDYE", "OVERDYED", "OVERDYEING", "OVERDYES", "OVEREAGER", "OVEREAGERNESS", "OVEREAGERNESSES", "OVEREARNEST", "OVEREASY", "OVEREAT", "OVEREATEN", "OVEREATER", "OVEREATERS", "OVEREATING", "OVEREATS", "OVEREDIT", "OVEREDITED", "OVEREDITING", "OVEREDITS", "OVEREDUCATE", "OVEREDUCATED", "OVEREDUCATES", "OVEREDUCATING", "OVEREDUCATION", "OVEREDUCATIONS", "OVERELABORATE", "OVERELABORATED", "OVERELABORATES", "OVERELABORATING", "OVERELABORATION", "OVERELABORATIONS", "OVEREMBELLISH", "OVEREMBELLISHED", "OVEREMBELLISHES", "OVEREMBELLISHING", "OVEREMBELLISHMENT", "OVEREMBELLISHMENTS", "OVEREMOTE", "OVEREMOTED", "OVEREMOTES", "OVEREMOTING", "OVEREMOTIONAL", "OVEREMPHASES", "OVEREMPHASIS", "OVEREMPHASIZE", "OVEREMPHASIZED", "OVEREMPHASIZES", "OVEREMPHASIZING", "OVEREMPHATIC", "OVERENAMORED", "OVERENCOURAGE", "OVERENCOURAGED", "OVERENCOURAGES", "OVERENCOURAGING", "OVERENERGETIC", "OVERENGINEER", "OVERENGINEERED", "OVERENGINEERING", "OVERENGINEERS", "OVERENROLLED", "OVERENTERTAINED", "OVERENTHUSIASM", "OVERENTHUSIASMS", "OVERENTHUSIASTIC", "OVERENTHUSIASTICALLY", "OVEREQUIPPED", "OVERESTIMATE", "OVERESTIMATED", "OVERESTIMATES", "OVERESTIMATING", "OVERESTIMATION", "OVERESTIMATIONS", "OVEREVALUATION", "OVEREVALUATIONS", "OVEREXAGGERATE", "OVEREXAGGERATED", "OVEREXAGGERATES", "OVEREXAGGERATING", "OVEREXAGGERATION", "OVEREXAGGERATIONS", "OVEREXCITE", "OVEREXCITED", "OVEREXCITES", "OVEREXCITING", "OVEREXERCISE", "OVEREXERCISED", "OVEREXERCISES", "OVEREXERCISING", "OVEREXERT", "OVEREXERTED", "OVEREXERTING", "OVEREXERTION", "OVEREXERTIONS", "OVEREXERTS", "OVEREXPAND", "OVEREXPANDED", "OVEREXPANDING", "OVEREXPANDS", "OVEREXPANSION", "OVEREXPANSIONS", "OVEREXPECTATION", "OVEREXPECTATIONS", "OVEREXPLAIN", "OVEREXPLAINED", "OVEREXPLAINING", "OVEREXPLAINS", "OVEREXPLICIT", "OVEREXPLOIT", "OVEREXPLOITATION", "OVEREXPLOITATIONS", "OVEREXPLOITED", "OVEREXPLOITING", "OVEREXPLOITS", "OVEREXPOSE", "OVEREXPOSED", "OVEREXPOSES", "OVEREXPOSING", "OVEREXPOSURE", "OVEREXPOSURES", "OVEREXTEND", "OVEREXTENDED", "OVEREXTENDING", "OVEREXTENDS", "OVEREXTENSION", "OVEREXTENSIONS", "OVEREXTRACTION", "OVEREXTRACTIONS", "OVEREXTRAPOLATION", "OVEREXTRAPOLATIONS", "OVEREXTRAVAGANT", "OVEREXUBERANT", "OVERFACILE", "OVERFAMILIAR", "OVERFAMILIARITIES", "OVERFAMILIARITY", "OVERFAR", "OVERFAST", "OVERFASTIDIOUS", "OVERFAT", "OVERFATIGUE", "OVERFATIGUED", "OVERFATIGUES", "OVERFAVOR", "OVERFAVORED", "OVERFAVORING", "OVERFAVORS", "OVERFEAR", "OVERFEARED", "OVERFEARING", "OVERFEARS", "OVERFED", "OVERFEED", "OVERFEEDING", "OVERFEEDS", "OVERFERTILIZATION", "OVERFERTILIZATIONS", "OVERFERTILIZE", "OVERFERTILIZED", "OVERFERTILIZES", "OVERFERTILIZING", "OVERFILL", "OVERFILLED", "OVERFILLING", "OVERFILLS", "OVERFISH", "OVERFISHED", "OVERFISHES", "OVERFISHING", "OVERFLEW", "OVERFLIES", "OVERFLIGHT", "OVERFLIGHTS", "OVERFLOW", "OVERFLOWED", "OVERFLOWING", "OVERFLOWN", "OVERFLOWS", "OVERFLY", "OVERFLYING", "OVERFOCUS", "OVERFOCUSED", "OVERFOCUSES", "OVERFOCUSING", "OVERFOCUSSED", "OVERFOCUSSES", "OVERFOCUSSING", "OVERFOND", "OVERFOUL", "OVERFREE", "OVERFULFILL", "OVERFULFILLED", "OVERFULFILLING", "OVERFULFILLS", "OVERFULL", "OVERFUND", "OVERFUNDED", "OVERFUNDING", "OVERFUNDS", "OVERFUSSY", "OVERGARMENT", "OVERGARMENTS", "OVERGENERALIZATION", "OVERGENERALIZATIONS", "OVERGENERALIZE", "OVERGENERALIZED", "OVERGENERALIZES", "OVERGENERALIZING", "OVERGENEROSITIES", "OVERGENEROSITY", "OVERGENEROUS", "OVERGENEROUSLY", "OVERGILD", "OVERGILDED", "OVERGILDING", "OVERGILDS", "OVERGILT", "OVERGIRD", "OVERGIRDED", "OVERGIRDING", "OVERGIRDS", "OVERGIRT", "OVERGLAD", "OVERGLAMORIZE", "OVERGLAMORIZED", "OVERGLAMORIZES", "OVERGLAMORIZING", "OVERGLAZE", "OVERGLAZES", "OVERGOAD", "OVERGOADED", "OVERGOADING", "OVERGOADS", "OVERGOVERN", "OVERGOVERNED", "OVERGOVERNING", "OVERGOVERNS", "OVERGRAZE", "OVERGRAZED", "OVERGRAZES", "OVERGRAZING", "OVERGREW", "OVERGROW", "OVERGROWING", "OVERGROWN", "OVERGROWS", "OVERGROWTH", "OVERGROWTHS", "OVERHAND", "OVERHANDED", "OVERHANDING", "OVERHANDLE", "OVERHANDLED", "OVERHANDLES", "OVERHANDLING", "OVERHANDS", "OVERHANG", "OVERHANGING", "OVERHANGS", "OVERHARD", "OVERHARVEST", "OVERHARVESTED", "OVERHARVESTING", "OVERHARVESTS", "OVERHASTY", "OVERHATE", "OVERHATED", "OVERHATES", "OVERHATING", "OVERHAUL", "OVERHAULED", "OVERHAULING", "OVERHAULS", "OVERHEAD", "OVERHEADS", "OVERHEAP", "OVERHEAPED", "OVERHEAPING", "OVERHEAPS", "OVERHEAR", "OVERHEARD", "OVERHEARING", "OVERHEARS", "OVERHEAT", "OVERHEATED", "OVERHEATING", "OVERHEATS", "OVERHELD", "OVERHIGH", "OVERHOLD", "OVERHOLDING", "OVERHOLDS", "OVERHOLY", "OVERHOMOGENIZE", "OVERHOMOGENIZED", "OVERHOMOGENIZES", "OVERHOMOGENIZING", "OVERHOPE", "OVERHOPED", "OVERHOPES", "OVERHOPING", "OVERHOT", "OVERHUNG", "OVERHUNT", "OVERHUNTED", "OVERHUNTING", "OVERHUNTINGS", "OVERHUNTS", "OVERHYPE", "OVERHYPED", "OVERHYPES", "OVERHYPING", "OVERIDEALIZE", "OVERIDEALIZED", "OVERIDEALIZES", "OVERIDEALIZING", "OVERIDENTIFICATION", "OVERIDENTIFICATIONS", "OVERIDENTIFIED", "OVERIDENTIFIES", "OVERIDENTIFY", "OVERIDENTIFYING", "OVERIDLE", "OVERIMAGINATIVE", "OVERIMPRESS", "OVERIMPRESSED", "OVERIMPRESSES", "OVERIMPRESSING", "OVERINDEBTEDNESS", "OVERINDEBTEDNESSES", "OVERINDULGE", "OVERINDULGED", "OVERINDULGENCE", "OVERINDULGENCES", "OVERINDULGENT", "OVERINDULGES", "OVERINDULGING", "OVERINDUSTRIALIZE", "OVERINDUSTRIALIZED", "OVERINDUSTRIALIZES", "OVERINDUSTRIALIZING", "OVERINFLATE", "OVERINFLATED", "OVERINFLATES", "OVERINFLATING", "OVERINFLATION", "OVERINFLATIONS", "OVERINFORM", "OVERINFORMED", "OVERINFORMING", "OVERINFORMS", "OVERINGENIOUS", "OVERINGENUITIES", "OVERINGENUITY", "OVERINSISTENT", "OVERINSURE", "OVERINSURED", "OVERINSURES", "OVERINSURING", "OVERINTELLECTUALIZATION", "OVERINTELLECTUALIZATIONS", "OVERINTELLECTUALIZE", "OVERINTELLECTUALIZED", "OVERINTELLECTUALIZES", "OVERINTELLECTUALIZING", "OVERINTENSE", "OVERINTENSITIES", "OVERINTENSITY", "OVERINTERPRETATION", "OVERINTERPRETATIONS", "OVERINVESTMENT", "OVERINVESTMENTS", "OVERISSUANCE", "OVERISSUANCES", "OVERISSUE", "OVERISSUED", "OVERISSUES", "OVERISSUING", "OVERJOY", "OVERJOYED", "OVERJOYING", "OVERJOYS", "OVERJUST", "OVERKEEN", "OVERKILL", "OVERKILLED", "OVERKILLING", "OVERKILLS", "OVERKIND", "OVERLABOR", "OVERLABORED", "OVERLABORING", "OVERLABORS", "OVERLADE", "OVERLADED", "OVERLADEN", "OVERLADES", "OVERLADING", "OVERLAID", "OVERLAIN", "OVERLAND", "OVERLANDS", "OVERLAP", "OVERLAPPED", "OVERLAPPING", "OVERLAPS", "OVERLARGE", "OVERLATE", "OVERLAVISH", "OVERLAX", "OVERLAY", "OVERLAYING", "OVERLAYS", "OVERLEAF", "OVERLEAP", "OVERLEAPED", "OVERLEAPING", "OVERLEAPS", "OVERLEAPT", "OVERLEARN", "OVERLEARNED", "OVERLEARNING", "OVERLEARNS", "OVERLEND", "OVERLENDING", "OVERLENDS", "OVERLENGTH", "OVERLENGTHEN", "OVERLENGTHENED", "OVERLENGTHENING", "OVERLENGTHENS", "OVERLENT", "OVERLET", "OVERLETS", "OVERLETTING", "OVERLEWD", "OVERLIE", "OVERLIES", "OVERLIGHT", "OVERLIGHTED", "OVERLIGHTING", "OVERLIGHTS", "OVERLIT", "OVERLITERAL", "OVERLITERARY", "OVERLIVE", "OVERLIVED", "OVERLIVES", "OVERLIVING", "OVERLOAD", "OVERLOADED", "OVERLOADING", "OVERLOADS", "OVERLONG", "OVERLOOK", "OVERLOOKED", "OVERLOOKING", "OVERLOOKS", "OVERLORD", "OVERLORDED", "OVERLORDING", "OVERLORDS", "OVERLORDSHIP", "OVERLORDSHIPS", "OVERLOUD", "OVERLOVE", "OVERLOVED", "OVERLOVES", "OVERLOVING", "OVERLUSH", "OVERLYING", "OVERMAN", "OVERMANAGE", "OVERMANAGED", "OVERMANAGES", "OVERMANAGING", "OVERMANNED", "OVERMANNERED", "OVERMANNING", "OVERMANS", "OVERMANTEL", "OVERMANTELS", "OVERMANY", "OVERMASTER", "OVERMASTERED", "OVERMASTERING", "OVERMASTERS", "OVERMATCH", "OVERMATCHED", "OVERMATCHES", "OVERMATCHING", "OVERMATURE", "OVERMATURITIES", "OVERMATURITY", "OVERMEDICATE", "OVERMEDICATED", "OVERMEDICATES", "OVERMEDICATING", "OVERMEDICATION", "OVERMEDICATIONS", "OVERMEEK", "OVERMELT", "OVERMELTED", "OVERMELTING", "OVERMELTS", "OVERMEN", "OVERMIGHTY", "OVERMILD", "OVERMILK", "OVERMILKED", "OVERMILKING", "OVERMILKS", "OVERMINE", "OVERMINED", "OVERMINES", "OVERMINING", "OVERMIX", "OVERMIXED", "OVERMIXES", "OVERMIXING", "OVERMODEST", "OVERMODESTLY", "OVERMODULATED", "OVERMUCH", "OVERMUCHES", "OVERMUSCLED", "OVERNEAR", "OVERNEAT", "OVERNEW", "OVERNICE", "OVERNIGHT", "OVERNIGHTS", "OVERNOURISH", "OVERNOURISHED", "OVERNOURISHES", "OVERNOURISHING", "OVERNUTRITION", "OVERNUTRITIONS", "OVEROBVIOUS", "OVEROPERATE", "OVEROPERATED", "OVEROPERATES", "OVEROPERATING", "OVEROPINIONATED", "OVEROPTIMISM", "OVEROPTIMISMS", "OVEROPTIMIST", "OVEROPTIMISTIC", "OVEROPTIMISTICALLY", "OVEROPTIMISTS", "OVERORCHESTRATE", "OVERORCHESTRATED", "OVERORCHESTRATES", "OVERORCHESTRATING", "OVERORGANIZE", "OVERORGANIZED", "OVERORGANIZES", "OVERORGANIZING", "OVERORNAMENT", "OVERORNAMENTED", "OVERORNAMENTING", "OVERORNAMENTS", "OVERPACKAGE", "OVERPACKAGED", "OVERPACKAGES", "OVERPACKAGING", "OVERPAID", "OVERPARTICULAR", "OVERPASS", "OVERPASSED", "OVERPASSES", "OVERPASSING", "OVERPAST", "OVERPAY", "OVERPAYING", "OVERPAYMENT", "OVERPAYMENTS", "OVERPAYS", "OVERPEDAL", "OVERPEDALED", "OVERPEDALING", "OVERPEDALLED", "OVERPEDALLING", "OVERPEDALS", "OVERPEOPLE", "OVERPEOPLED", "OVERPEOPLES", "OVERPEOPLING", "OVERPERSUADE", "OVERPERSUADED", "OVERPERSUADES", "OVERPERSUADING", "OVERPERSUASION", "OVERPERSUASIONS", "OVERPERT", "OVERPLAID", "OVERPLAIDED", "OVERPLAIDS", "OVERPLAN", "OVERPLANNED", "OVERPLANNING", "OVERPLANS", "OVERPLANT", "OVERPLANTED", "OVERPLANTING", "OVERPLANTS", "OVERPLAY", "OVERPLAYED", "OVERPLAYING", "OVERPLAYS", "OVERPLIED", "OVERPLIES", "OVERPLOT", "OVERPLOTS", "OVERPLOTTED", "OVERPLOTTING", "OVERPLUS", "OVERPLUSES", "OVERPLY", "OVERPLYING", "OVERPOPULATE", "OVERPOPULATED", "OVERPOPULATES", "OVERPOPULATING", "OVERPOPULATION", "OVERPOPULATIONS", "OVERPOTENT", "OVERPOWER", "OVERPOWERED", "OVERPOWERING", "OVERPOWERS", "OVERPRAISE", "OVERPRAISED", "OVERPRAISES", "OVERPRAISING", "OVERPRECISE", "OVERPRESCRIBE", "OVERPRESCRIBED", "OVERPRESCRIBES", "OVERPRESCRIBING", "OVERPRESCRIPTION", "OVERPRESCRIPTIONS", "OVERPRESSURE", "OVERPRESSURES", "OVERPRICE", "OVERPRICED", "OVERPRICES", "OVERPRICING", "OVERPRINT", "OVERPRINTED", "OVERPRINTING", "OVERPRINTS", "OVERPRIVILEGED", "OVERPRIZE", "OVERPRIZED", "OVERPRIZES", "OVERPRIZING", "OVERPROCESS", "OVERPROCESSED", "OVERPROCESSES", "OVERPROCESSING", "OVERPRODUCE", "OVERPRODUCED", "OVERPRODUCES", "OVERPRODUCING", "OVERPRODUCTION", "OVERPRODUCTIONS", "OVERPROGRAM", "OVERPROGRAMED", "OVERPROGRAMING", "OVERPROGRAMMED", "OVERPROGRAMMING", "OVERPROGRAMS", "OVERPROMISE", "OVERPROMISED", "OVERPROMISES", "OVERPROMISING", "OVERPROMOTE", "OVERPROMOTED", "OVERPROMOTES", "OVERPROMOTING", "OVERPROOF", "OVERPROPORTION", "OVERPROPORTIONATE", "OVERPROPORTIONATELY", "OVERPROPORTIONED", "OVERPROPORTIONING", "OVERPROPORTIONS", "OVERPROTECT", "OVERPROTECTED", "OVERPROTECTING", "OVERPROTECTION", "OVERPROTECTIONS", "OVERPROTECTIVE", "OVERPROTECTIVENESS", "OVERPROTECTIVENESSES", "OVERPROTECTS", "OVERPUMP", "OVERPUMPED", "OVERPUMPING", "OVERPUMPS", "OVERQUALIFIED", "OVERRAN", "OVERRANK", "OVERRASH", "OVERRATE", "OVERRATED", "OVERRATES", "OVERRATING", "OVERREACH", "OVERREACHED", "OVERREACHER", "OVERREACHERS", "OVERREACHES", "OVERREACHING", "OVERREACT", "OVERREACTED", "OVERREACTING", "OVERREACTION", "OVERREACTIONS", "OVERREACTS", "OVERREFINED", "OVERREFINEMENT", "OVERREFINEMENTS", "OVERREGULATE", "OVERREGULATED", "OVERREGULATES", "OVERREGULATING", "OVERREGULATION", "OVERREGULATIONS", "OVERRELIANCE", "OVERRELIANCES", "OVERREPORT", "OVERREPORTED", "OVERREPORTING", "OVERREPORTS", "OVERREPRESENTATION", "OVERREPRESENTATIONS", "OVERREPRESENTED", "OVERRESPOND", "OVERRESPONDED", "OVERRESPONDING", "OVERRESPONDS", "OVERRICH", "OVERRIDDEN", "OVERRIDE", "OVERRIDES", "OVERRIDING", "OVERRIFE", "OVERRIGID", "OVERRIPE", "OVERRODE", "OVERRUDE", "OVERRUFF", "OVERRUFFED", "OVERRUFFING", "OVERRUFFS", "OVERRULE", "OVERRULED", "OVERRULES", "OVERRULING", "OVERRUN", "OVERRUNNING", "OVERRUNS", "OVERSAD", "OVERSALE", "OVERSALES", "OVERSALT", "OVERSALTED", "OVERSALTING", "OVERSALTS", "OVERSANGUINE", "OVERSATURATE", "OVERSATURATED", "OVERSATURATES", "OVERSATURATING", "OVERSATURATION", "OVERSATURATIONS", "OVERSAUCE", "OVERSAUCED", "OVERSAUCES", "OVERSAUCING", "OVERSAVE", "OVERSAVED", "OVERSAVES", "OVERSAVING", "OVERSAW", "OVERSCALE", "OVERSCALED", "OVERSCRUPULOUS", "OVERSEA", "OVERSEAS", "OVERSECRETION", "OVERSECRETIONS", "OVERSEE", "OVERSEED", "OVERSEEDED", "OVERSEEDING", "OVERSEEDS", "OVERSEEING", "OVERSEEN", "OVERSEER", "OVERSEERS", "OVERSEES", "OVERSELL", "OVERSELLING", "OVERSELLS", "OVERSENSITIVE", "OVERSENSITIVENESS", "OVERSENSITIVENESSES", "OVERSENSITIVITIES", "OVERSENSITIVITY", "OVERSERIOUS", "OVERSERIOUSLY", "OVERSERVICE", "OVERSERVICED", "OVERSERVICES", "OVERSERVICING", "OVERSET", "OVERSETS", "OVERSETTING", "OVERSEW", "OVERSEWED", "OVERSEWING", "OVERSEWN", "OVERSEWS", "OVERSEXED", "OVERSHADOW", "OVERSHADOWED", "OVERSHADOWING", "OVERSHADOWS", "OVERSHIRT", "OVERSHIRTS", "OVERSHOE", "OVERSHOES", "OVERSHOOT", "OVERSHOOTING", "OVERSHOOTS", "OVERSHOT", "OVERSHOTS", "OVERSICK", "OVERSIDE", "OVERSIDES", "OVERSIGHT", "OVERSIGHTS", "OVERSIMPLE", "OVERSIMPLIFICATION", "OVERSIMPLIFICATIONS", "OVERSIMPLIFIED", "OVERSIMPLIFIES", "OVERSIMPLIFY", "OVERSIMPLIFYING", "OVERSIMPLISTIC", "OVERSIMPLY", "OVERSIZE", "OVERSIZED", "OVERSIZES", "OVERSKIRT", "OVERSKIRTS", "OVERSLEEP", "OVERSLEEPING", "OVERSLEEPS", "OVERSLEPT", "OVERSLIP", "OVERSLIPPED", "OVERSLIPPING", "OVERSLIPS", "OVERSLIPT", "OVERSLOW", "OVERSMOKE", "OVERSMOKED", "OVERSMOKES", "OVERSMOKING", "OVERSOAK", "OVERSOAKED", "OVERSOAKING", "OVERSOAKS", "OVERSOFT", "OVERSOLD", "OVERSOLICITOUS", "OVERSOON", "OVERSOPHISTICATED", "OVERSOUL", "OVERSOULS", "OVERSPECIALIZATION", "OVERSPECIALIZATIONS", "OVERSPECIALIZE", "OVERSPECIALIZED", "OVERSPECIALIZES", "OVERSPECIALIZING", "OVERSPECULATE", "OVERSPECULATED", "OVERSPECULATES", "OVERSPECULATING", "OVERSPECULATION", "OVERSPECULATIONS", "OVERSPEND", "OVERSPENDER", "OVERSPENDERS", "OVERSPENDING", "OVERSPENDS", "OVERSPENT", "OVERSPILL", "OVERSPILLS", "OVERSPIN", "OVERSPINS", "OVERSPREAD", "OVERSPREADING", "OVERSPREADS", "OVERSTABILITIES", "OVERSTABILITY", "OVERSTAFF", "OVERSTAFFED", "OVERSTAFFING", "OVERSTAFFS", "OVERSTATE", "OVERSTATED", "OVERSTATEMENT", "OVERSTATEMENTS", "OVERSTATES", "OVERSTATING", "OVERSTAY", "OVERSTAYED", "OVERSTAYING", "OVERSTAYS", "OVERSTEER", "OVERSTEERS", "OVERSTEP", "OVERSTEPPED", "OVERSTEPPING", "OVERSTEPS", "OVERSTIMULATE", "OVERSTIMULATED", "OVERSTIMULATES", "OVERSTIMULATING", "OVERSTIMULATION", "OVERSTIMULATIONS", "OVERSTIR", "OVERSTIRRED", "OVERSTIRRING", "OVERSTIRS", "OVERSTOCK", "OVERSTOCKED", "OVERSTOCKING", "OVERSTOCKS", "OVERSTORIES", "OVERSTORY", "OVERSTRAIN", "OVERSTRAINED", "OVERSTRAINING", "OVERSTRAINS", "OVERSTRESS", "OVERSTRESSED", "OVERSTRESSES", "OVERSTRESSING", "OVERSTRETCH", "OVERSTRETCHED", "OVERSTRETCHES", "OVERSTRETCHING", "OVERSTREW", "OVERSTREWED", "OVERSTREWING", "OVERSTREWN", "OVERSTREWS", "OVERSTRIDDEN", "OVERSTRIDE", "OVERSTRIDES", "OVERSTRIDING", "OVERSTRIKE", "OVERSTRIKES", "OVERSTRIKING", "OVERSTRODE", "OVERSTRUCK", "OVERSTRUCTURED", "OVERSTRUNG", "OVERSTUFF", "OVERSTUFFED", "OVERSTUFFING", "OVERSTUFFS", "OVERSUBSCRIBE", "OVERSUBSCRIBED", "OVERSUBSCRIBES", "OVERSUBSCRIBING", "OVERSUBSCRIPTION", "OVERSUBSCRIPTIONS", "OVERSUBTLE", "OVERSUDS", "OVERSUDSED", "OVERSUDSES", "OVERSUDSING", "OVERSUP", "OVERSUPPED", "OVERSUPPING", "OVERSUPPLIED", "OVERSUPPLIES", "OVERSUPPLY", "OVERSUPPLYING", "OVERSUPS", "OVERSURE", "OVERSUSPICIOUS", "OVERSWEET", "OVERSWEETEN", "OVERSWEETENED", "OVERSWEETENING", "OVERSWEETENS", "OVERSWEETNESS", "OVERSWEETNESSES", "OVERSWING", "OVERSWINGING", "OVERSWINGS", "OVERSWUNG", "OVERTAKE", "OVERTAKEN", "OVERTAKES", "OVERTAKING", "OVERTALK", "OVERTALKATIVE", "OVERTALKED", "OVERTALKING", "OVERTALKS", "OVERTAME", "OVERTART", "OVERTASK", "OVERTASKED", "OVERTASKING", "OVERTASKS", "OVERTAX", "OVERTAXATION", "OVERTAXATIONS", "OVERTAXED", "OVERTAXES", "OVERTAXING", "OVERTHIN", "OVERTHINK", "OVERTHINKING", "OVERTHINKS", "OVERTHOUGHT", "OVERTHREW", "OVERTHROW", "OVERTHROWING", "OVERTHROWN", "OVERTHROWS", "OVERTIGHTEN", "OVERTIGHTENED", "OVERTIGHTENING", "OVERTIGHTENS", "OVERTIME", "OVERTIMED", "OVERTIMES", "OVERTIMING", "OVERTIP", "OVERTIPPED", "OVERTIPPING", "OVERTIPS", "OVERTIRE", "OVERTIRED", "OVERTIRES", "OVERTIRING", "OVERTOIL", "OVERTOILED", "OVERTOILING", "OVERTOILS", "OVERTONE", "OVERTONES", "OVERTOOK", "OVERTOP", "OVERTOPPED", "OVERTOPPING", "OVERTOPS", "OVERTRADE", "OVERTRADED", "OVERTRADES", "OVERTRADING", "OVERTRAIN", "OVERTRAINED", "OVERTRAINING", "OVERTRAINS", "OVERTREAT", "OVERTREATED", "OVERTREATING", "OVERTREATMENT", "OVERTREATMENTS", "OVERTREATS", "OVERTRICK", "OVERTRICKS", "OVERTRIM", "OVERTRIMMED", "OVERTRIMMING", "OVERTRIMS", "OVERTRUMP", "OVERTRUMPED", "OVERTRUMPING", "OVERTRUMPS", "OVERTURN", "OVERTURNED", "OVERTURNING", "OVERTURNS", "OVERURGE", "OVERURGED", "OVERURGES", "OVERURGING", "OVERUSE", "OVERUSED", "OVERUSES", "OVERUSING", "OVERUTILIZATION", "OVERUTILIZATIONS", "OVERUTILIZE", "OVERUTILIZED", "OVERUTILIZES", "OVERUTILIZING", "OVERVALUATION", "OVERVALUATIONS", "OVERVALUE", "OVERVALUED", "OVERVALUES", "OVERVALUING", "OVERVIEW", "OVERVIEWS", "OVERVIOLENT", "OVERVIVID", "OVERVOLTAGE", "OVERVOLTAGES", "OVERVOTE", "OVERVOTED", "OVERVOTES", "OVERVOTING", "OVERWARM", "OVERWARMED", "OVERWARMING", "OVERWARMS", "OVERWARY", "OVERWATER", "OVERWATERED", "OVERWATERING", "OVERWATERS", "OVERWEAK", "OVERWEAR", "OVERWEARING", "OVERWEARS", "OVERWEARY", "OVERWEEN", "OVERWEENED", "OVERWEENING", "OVERWEENS", "OVERWEIGH", "OVERWEIGHED", "OVERWEIGHING", "OVERWEIGHS", "OVERWEIGHT", "OVERWEIGHTED", "OVERWEIGHTING", "OVERWEIGHTS", "OVERWET", "OVERWETS", "OVERWETTED", "OVERWETTING", "OVERWHELM", "OVERWHELMED", "OVERWHELMING", "OVERWHELMS", "OVERWIDE", "OVERWILY", "OVERWIND", "OVERWINDING", "OVERWINDS", "OVERWINTER", "OVERWINTERED", "OVERWINTERING", "OVERWINTERS", "OVERWISE", "OVERWITHHELD", "OVERWITHHOLD", "OVERWITHHOLDING", "OVERWITHHOLDS", "OVERWORD", "OVERWORDS", "OVERWORE", "OVERWORK", "OVERWORKED", "OVERWORKING", "OVERWORKS", "OVERWORN", "OVERWOUND", "OVERWRITE", "OVERWRITES", "OVERWRITING", "OVERWRITTEN", "OVERWROTE", "OVERWROUGHT", "OVERZEAL", "OVERZEALOUS", "OVERZEALOUSLY", "OVERZEALOUSNESS", "OVERZEALOUSNESSES", "OVERZEALS", "PIEBALD", "PIEBALDS", "PIECRUST", "PIECRUSTS", "PIEFORT", "PIEFORTS", "PIEPLANT", "PIEPLANTS", "PIETAS", "PIETIES", "PINEALS", "PINEAPPLE", "PINEAPPLES", "PINECONE", "PINECONES", "PINEDROPS", "PINELAND", "PINELANDS", "PINELIKE", "PINESAP", "PINESAPS", "PINEWOOD", "PINEWOODS", "PLANARIA", "PLANARIAS", "PLANATE", "PLANERS", "PLANFORM", "PLANFORMS", "PLANGENT", "PLANGENTLY", "PLANKING", "PLANKINGS", "PLANLESS", "PLANTABLE", "PLANTAIN", "PLANTAINS", "PLANTAR", "PLANTED", "PLANTING", "PLANTINGS", "POOLHALL", "POOLHALLS", "POOLROOM", "POOLROOMS", "POOLSIDE", "POOLSIDES", "POSTABORTION", "POSTACCIDENT", "POSTADOLESCENT", "POSTADOLESCENTS", "POSTAGE", "POSTAGES", "POSTALLY", "POSTALS", "POSTAMPUTATION", "POSTANAL", "POSTAPOCALYPTIC", "POSTARREST", "POSTATOMIC", "POSTATTACK", "POSTAXIAL", "POSTBACCALAUREATE", "POSTBAG", "POSTBAGS", "POSTBASE", "POSTBIBLICAL", "POSTBOURGEOIS", "POSTBOX", "POSTBOXES", "POSTBOY", "POSTBOYS", "POSTBURN", "POSTCAPITALIST", "POSTCARD", "POSTCARDS", "POSTCLASSIC", "POSTCLASSICAL", "POSTCODE", "POSTCODES", "POSTCOITAL", "POSTCOLLEGE", "POSTCOLLEGES", "POSTCOLLEGIATE", "POSTCOLONIAL", "POSTCONCEPTION", "POSTCONCERT", "POSTCONQUEST", "POSTCONSONANTAL", "POSTCONVENTION", "POSTCOPULATORY", "POSTCORONARY", "POSTCOUP", "POSTCRANIAL", "POSTCRANIALLY", "POSTCRASH", "POSTCRISES", "POSTCRISIS", "POSTDATE", "POSTDATED", "POSTDATES", "POSTDATING", "POSTDEADLINE", "POSTDEBATE", "POSTDEBUTANTE", "POSTDEBUTANTES", "POSTDELIVERY", "POSTDEPOSITIONAL", "POSTDEPRESSION", "POSTDEVALUATION", "POSTDILUVIAN", "POSTDIVE", "POSTDIVESTITURE", "POSTDIVORCE", "POSTDOC", "POSTDOCS", "POSTDOCTORAL", "POSTDOCTORATE", "POSTDRUG", "POSTEDITING", "POSTELECTION", "POSTEMBRYONAL", "POSTEMBRYONIC", "POSTEMERGENCE", "POSTEMERGENCY", "POSTENCEPHALITIC", "POSTEPILEPTIC", "POSTERN", "POSTERNS", "POSTERS", "POSTERUPTIVE", "POSTEXERCISE", "POSTEXILIC", "POSTEXPERIENCE", "POSTEXPERIMENTAL", "POSTEXPOSURE", "POSTFACE", "POSTFACES", "POSTFAULT", "POSTFEMINIST", "POSTFIRE", "POSTFIX", "POSTFIXED", "POSTFIXES", "POSTFIXING", "POSTFLIGHT", "POSTFORM", "POSTFORMED", "POSTFORMING", "POSTFORMS", "POSTFRACTURE", "POSTFRACTURES", "POSTFREEZE", "POSTGAME", "POSTGANGLIONIC", "POSTGLACIAL", "POSTGRADUATE", "POSTGRADUATES", "POSTGRADUATION", "POSTHARVEST", "POSTHASTE", "POSTHASTES", "POSTHEAT", "POSTHEATS", "POSTHEMORRHAGIC", "POSTHOLE", "POSTHOLES", "POSTHOLIDAY", "POSTHOLOCAUST", "POSTHOSPITAL", "POSTHYPNOTIC", "POSTIMPACT", "POSTIMPERIAL", "POSTINAUGURAL", "POSTINDEPENDENCE", "POSTINDUSTRIAL", "POSTINFECTION", "POSTINJECTION", "POSTINOCULATION", "POSTINS", "POSTIRRADIATION", "POSTISCHEMIC", "POSTISOLATION", "POSTLANDING", "POSTLAUNCH", "POSTLIBERATION", "POSTLITERATE", "POSTLUDE", "POSTLUDES", "POSTMAN", "POSTMARITAL", "POSTMARK", "POSTMARKED", "POSTMARKING", "POSTMARKS", "POSTMASTECTOMY", "POSTMASTER", "POSTMASTERS", "POSTMASTERSHIP", "POSTMASTERSHIPS", "POSTMATING", "POSTMEDIEVAL", "POSTMEN", "POSTMENOPAUSAL", "POSTMIDNIGHT", "POSTMILLENARIAN", "POSTMILLENARIANISM", "POSTMILLENARIANISMS", "POSTMILLENARIANS", "POSTMILLENNIAL", "POSTMILLENNIALISM", "POSTMILLENNIALISMS", "POSTMILLENNIALIST", "POSTMILLENNIALISTS", "POSTMISTRESS", "POSTMISTRESSES", "POSTMODERN", "POSTMODERNISM", "POSTMODERNISMS", "POSTMODERNIST", "POSTMODERNISTS", "POSTNATAL", "POSTNEONATAL", "POSTNUPTIAL", "POSTOPERATIVE", "POSTOPERATIVELY", "POSTORAL", "POSTORBITAL", "POSTORGASMIC", "POSTPAID", "POSTPOLLINATION", "POSTPONE", "POSTPONES", "POSTPOSITION", "POSTPOSITIONAL", "POSTPOSITIONALLY", "POSTPOSITIONS", "POSTPOSITIVE", "POSTPOSITIVELY", "POSTPRANDIAL", "POSTPRESIDENTIAL", "POSTPRIMARY", "POSTPRISON", "POSTPRODUCTION", "POSTPRODUCTIONS", "POSTPSYCHOANALYTIC", "POSTPUBERTY", "POSTPUBESCENT", "POSTRACE", "POSTRECESSION", "POSTRESURRECTION", "POSTRESURRECTIONS", "POSTRETIREMENT", "POSTREVOLUTIONARY", "POSTRIOT", "POSTROMANTIC", "POSTSCRIPT", "POSTSCRIPTS", "POSTSEASON", "POSTSEASONS", "POSTSECONDARY", "POSTSHOW", "POSTSTIMULATION", "POSTSTIMULATORY", "POSTSTIMULUS", "POSTSTRIKE", "POSTSURGICAL", "POSTSYNAPTIC", "POSTSYNAPTICALLY", "POSTSYNC", "POSTSYNCED", "POSTSYNCING", "POSTSYNCS", "POSTTAX", "POSTTEEN", "POSTTENSION", "POSTTENSIONED", "POSTTENSIONING", "POSTTENSIONS", "POSTTEST", "POSTTESTS", "POSTTRANSCRIPTIONAL", "POSTTRANSFUSION", "POSTTRANSLATIONAL", "POSTTRAUMATIC", "POSTTREATMENT", "POSTTRIAL", "POSTVACCINAL", "POSTVACCINATION", "POSTVAGOTOMY", "POSTVASECTOMY", "POSTVOCALIC", "POSTWAR", "POSTWEANING", "POSTWORKSHOP", "POURABLE", "POURERS", "POURPOINT", "POURPOINTS", "PRICELESS", "RUNABOUT", "RUNAGATE", "RUNAGATES", "RUNAROUND", "RUNAWAY", "RUNBACK", "RUNBACKS", "RUNDOWN", "RUNDOWNS", "RUNLESS", "RUNLET", "RUNLETS", "RUNOFF", "RUNOFFS", "RUNOUT", "RUNOUTS", "RUNOVER", "RUNOVERS", "RUNROUND", "RUNROUNDS", "RUNTIER", "RUNWAY", "RUNWAYS", "SALEABLE", "SALEABLY", "SALEROOM", "SALEROOMS", "SANDALS", "SANDBAG", "SANDBAGGED", "SANDBAGGER", "SANDBAGGERS", "SANDBAGGING", "SANDBAGS", "SANDBANK", "SANDBANKS", "SANDBAR", "SANDBARS", "SANDBLAST", "SANDBLASTED", "SANDBLASTER", "SANDBLASTERS", "SANDBLASTING", "SANDBLASTS", "SANDBOX", "SANDBOXES", "SANDBUR", "SANDBURR", "SANDBURRS", "SANDBURS", "SANDDAB", "SANDDABS", "SANDERS", "SANDFISH", "SANDFISHES", "SANDFLIES", "SANDFLY", "SANDGLASS", "SANDGLASSES", "SANDGROUSE", "SANDGROUSES", "SANDHIS", "SANDHOG", "SANDHOGS", "SANDLIKE", "SANDLING", "SANDLINGS", "SANDLOT", "SANDLOTS", "SANDMAN", "SANDMEN", "SANDPAINTING", "SANDPAINTINGS", "SANDPAPER", "SANDPAPERED", "SANDPAPERING", "SANDPAPERS", "SANDPAPERY", "SANDPEEP", "SANDPEEPS", "SANDPILE", "SANDPILES", "SANDPIPER", "SANDPIPERS", "SANDPIT", "SANDPITS", "SANDSHOE", "SANDSHOES", "SANDSOAP", "SANDSOAPS", "SANDSPUR", "SANDSPURS", "SANDSTONE", "SANDSTONES", "SANDSTORM", "SANDSTORMS", "SANDWICH", "SANDWICHES", "SANDWORM", "SANDWORMS", "SANDWORT", "SANDWORTS", "SHIFTABLE", "SHIFTERS", "SHIFTLESS", "SHIPBOARD", "SHIPBOARDS", "SHIPBORNE", "SHIPBUILDER", "SHIPBUILDERS", "SHIPBUILDING", "SHIPBUILDINGS", "SHIPFITTER", "SHIPFITTERS", "SHIPLAP", "SHIPLAPS", "SHIPLOAD", "SHIPLOADS", "SHIPMAN", "SHIPMASTER", "SHIPMASTERS", "SHIPMATE", "SHIPMATES", "SHIPMEN", "SHIPOWNER", "SHIPOWNERS", "SHIPPED", "SHIPPEN", "SHIPPENS", "SHIPPER", "SHIPPING", "SHIPPINGS", "SHIPPONS", "SHIPSHAPE", "SHIPSIDE", "SHIPSIDES", "SHIPWAY", "SHIPWAYS", "SHIPWORM", "SHIPWORMS", "SHIPWRECK", "SHIPWRECKED", "SHIPWRECKING", "SHIPWRECKS", "SHIPWRIGHT", "SHIPWRIGHTS", "SHIPYARD", "SHIPYARDS", "SHOOTERS", "SHOOTOUT", "SHOOTOUTS", "SIDEARM", "SIDEBAND", "SIDEBANDS", "SIDEBAR", "SIDEBARS", "SIDEBOARD", "SIDEBOARDS", "SIDEBURNED", "SIDEBURNS", "SIDECAR", "SIDECARS", "SIDEDRESS", "SIDEDRESSES", "SIDEHILL", "SIDEHILLS", "SIDEKICK", "SIDEKICKS", "SIDELIGHT", "SIDELIGHTS", "SIDELINE", "SIDELINED", "SIDELINER", "SIDELINERS", "SIDELINES", "SIDELING", "SIDELINING", "SIDELONG", "SIDEMAN", "SIDEMEN", "SIDEPIECE", "SIDEPIECES", "SIDEREAL", "SIDERITE", "SIDERITES", "SIDESADDLE", "SIDESADDLES", "SIDESHOW", "SIDESHOWS", "SIDESLIP", "SIDESLIPPED", "SIDESLIPPING", "SIDESLIPS", "SIDESPIN", "SIDESPINS", "SIDESPLITTING", "SIDESTEP", "SIDESTEPPED", "SIDESTEPPER", "SIDESTEPPERS", "SIDESTEPPING", "SIDESTEPS", "SIDESTREAM", "SIDESTROKE", "SIDESTROKES", "SIDESWIPE", "SIDESWIPED", "SIDESWIPES", "SIDESWIPING", "SIDETRACK", "SIDETRACKED", "SIDETRACKING", "SIDETRACKS", "SIDEWALK", "SIDEWALKS", "SIDEWALL", "SIDEWALLS", "SIDEWARD", "SIDEWARDS", "SIDEWAY", "SIDEWAYS", "SIDEWINDER", "SIDEWINDERS", "SIDEWISE", "SPRINGALS", "SPRINGBOARD", "SPRINGBOARDS", "SPRINGERS", "SPRINGHEAD", "SPRINGHEADS", "SPRINGHOUSE", "SPRINGHOUSES", "SPRINGLIKE", "SPRINGTAIL", "SPRINGTAILS", "SPRINGTIDE", "SPRINGTIDES", "SPRINGTIME", "SPRINGTIMES", "SPRINGWATER", "SPRINGWATERS", "SPRINGWOOD", "SPRINGWOODS", "STEPBROTHER", "STEPBROTHERS", "STEPCHILD", "STEPCHILDREN", "STEPDAME", "STEPDAMES", "STEPDAUGHTER", "STEPDAUGHTERS", "STEPFAMILIES", "STEPFAMILY", "STEPFATHER", "STEPFATHERS", "STEPLADDER", "STEPLADDERS", "STEPLIKE", "STEPMOTHER", "STEPMOTHERS", "STEPPARENT", "STEPPARENTING", "STEPPARENTINGS", "STEPPARENTS", "STEPPED", "STEPPER", "STEPPES", "STEPPING", "STEPSISTER", "STEPSISTERS", "STEPSON", "STEPSONS", "STEPWISE", "STICKBALL", "STICKBALLS", "STICKERS", "STICKHANDLE", "STICKHANDLED", "STICKHANDLER", "STICKHANDLERS", "STICKHANDLES", "STICKHANDLING", "STICKLED", "STICKLIKE", "STICKLING", "STICKMAN", "STICKMEN", "STICKOUT", "STICKOUTS", "STICKPIN", "STICKPINS", "STICKSEED", "STICKSEEDS", "STICKTIGHT", "STICKTIGHTS", "STICKUPS", "STICKWEED", "STICKWEEDS", "STICKWORK", "STICKWORKS", "STOPBANK", "STOPBANKS", "STOPCOCK", "STOPCOCKS", "STOPERS", "STOPGAP", "STOPGAPS", "STOPLIGHT", "STOPLIGHTS", "STOPOVER", "STOPOVERS", "STOPPAGE", "STOPPAGES", "STOPPED", "STOPPER", "STOPPING", "STOPPLED", "STOPWATCH", "STOPWATCHES", "TABLECLOTH", "TABLECLOTHS", "TABLELAND", "TABLELANDS", "TABLEMATE", "TABLEMATES", "TABLESPOON", "TABLESPOONFUL", "TABLESPOONFULS", "TABLESPOONS", "TABLESPOONSFUL", "TABLETED", "TABLETING", "TABLETOP", "TABLETOPS", "TABLEWARE", "TABLEWARES", "TAGALONG", "TAGBOARD", "TAGBOARDS", "TAGGED", "TAGLIKE", "TAGRAG", "TAGRAGS", "TAPELESS", "TAPELIKE", "TAPELINE", "TAPELINES", "TAPERED", "TAPERING", "TAPEWORM", "TAPEWORMS", "TEAMMATE", "TEAMMATES", "TEAMWORK", "TEAMWORKS", "TOPAZINE", "TOPCOAT", "TOPCOATS", "TOPCROSS", "TOPCROSSES", "TOPDRESSING", "TOPDRESSINGS", "TOPERS", "TOPFLIGHT", "TOPFULL", "TOPGALLANT", "TOPGALLANTS", "TOPHES", "TOPKICK", "TOPKICKS", "TOPKNOT", "TOPKNOTS", "TOPLESS", "TOPLINE", "TOPLINES", "TOPLOFTIER", "TOPLOFTIEST", "TOPLOFTILY", "TOPLOFTINESS", "TOPLOFTINESSES", "TOPLOFTY", "TOPMAST", "TOPMASTS", "TOPMINNOW", "TOPMINNOWS", "TOPMOST", "TOPNOTCH", "TOPNOTCHER", "TOPNOTCHERS", "TOPOLOGIES", "TOPOLOGIST", "TOPOLOGISTS", "TOPOLOGY", "TOPPED", "TOPPER", "TOPPING", "TOPPINGS", "TOPPLED", "TOPSAIL", "TOPSAILS", "TOPSIDE", "TOPSIDES", "TOPSOIL", "TOPSOILED", "TOPSOILING", "TOPSOILS", "TOPSPIN", "TOPSPINS", "TOPSTITCH", "TOPSTITCHED", "TOPSTITCHES", "TOPSTITCHING", "TOPSTONE", "TOPSTONES", "TOPWORK", "TOPWORKED", "TOPWORKING", "TOPWORKS", "TOWNFOLK", "TOWNHOME", "TOWNHOMES", "TOWNHOUSE", "TOWNHOUSES", "TOWNLESS", "TOWNLET", "TOWNLETS", "TOWNSCAPE", "TOWNSCAPES", "TOWNSHIP", "TOWNSHIPS", "TOWNWEAR", "TRAPBALL", "TRAPBALLS", "TRAPDOOR", "TRAPDOORS", "TRAPESES", "TRAPLIKE", "TRAPLINE", "TRAPLINES", "TRAPNEST", "TRAPNESTED", "TRAPNESTING", "TRAPNESTS", "TRAPPEAN", "TRAPPED", "TRAPPER", "TRAPPING", "TRAPPINGS", "TRAPPOSE", "TRAPROCK", "TRAPROCKS", "TRAPSHOOTER", "TRAPSHOOTERS", "TRAPSHOOTING", "TRAPSHOOTINGS", "TRAPUNTO", "TURNABLE", "TURNABOUT", "TURNAROUND", "TURNBUCKLE", "TURNBUCKLES", "TURNCOAT", "TURNCOATS", "TURNDOWN", "TURNDOWNS", "TURNERS", "TURNHALL", "TURNHALLS", "TURNKEY", "TURNKEYS", "TURNOFF", "TURNOFFS", "TURNOUT", "TURNOUTS", "TURNOVER", "TURNOVERS", "TURNPIKE", "TURNPIKES", "TURNSOLE", "TURNSOLES", "TURNSPIT", "TURNSPITS", "TURNSTILE", "TURNSTILES", "TURNSTONE", "TURNSTONES", "TURNTABLE", "TURNTABLES", "TURNUPS", "UPBEAR", "UPBEARER", "UPBEARERS", "UPBEARING", "UPBEARS", "UPBEAT", "UPBEATS", "UPBIND", "UPBINDING", "UPBINDS", "UPBOIL", "UPBOILED", "UPBOILING", "UPBOILS", "UPBORE", "UPBORNE", "UPBOUND", "UPBOW", "UPBOWS", "UPBRAID", "UPBRAIDED", "UPBRAIDER", "UPBRAIDERS", "UPBRAIDING", "UPBRAIDS", "UPBRINGING", "UPBUILD", "UPBUILDING", "UPBUILDS", "UPBUILT", "UPBYE", "UPCAST", "UPCASTING", "UPCASTS", "UPCHUCK", "UPCHUCKED", "UPCHUCKING", "UPCHUCKS", "UPCLIMB", "UPCLIMBED", "UPCLIMBING", "UPCLIMBS", "UPCOAST", "UPCOIL", "UPCOILED", "UPCOILING", "UPCOILS", "UPCOMING", "UPCOUNTRY", "UPCURL", "UPCURLED", "UPCURLING", "UPCURLS", "UPCURVE", "UPCURVED", "UPCURVES", "UPCURVING", "UPDART", "UPDARTED", "UPDARTING", "UPDARTS", "UPDATE", "UPDATED", "UPDATER", "UPDATERS", "UPDATES", "UPDATING", "UPDIVE", "UPDIVED", "UPDIVES", "UPDIVING", "UPDOS", "UPDOVE", "UPDRAFT", "UPDRAFTS", "UPDRIED", "UPDRIES", "UPDRY", "UPDRYING", "UPEND", "UPENDED", "UPENDING", "UPENDS", "UPFIELD", "UPFLING", "UPFLINGING", "UPFLINGS", "UPFLOW", "UPFLOWED", "UPFLOWING", "UPFLOWS", "UPFLUNG", "UPFOLD", "UPFOLDED", "UPFOLDING", "UPFOLDS", "UPFRONT", "UPGATHER", "UPGATHERED", "UPGATHERING", "UPGATHERS", "UPGAZE", "UPGAZED", "UPGAZES", "UPGAZING", "UPGIRD", "UPGIRDED", "UPGIRDING", "UPGIRDS", "UPGIRT", "UPGOING", "UPGRADABLE", "UPGRADE", "UPGRADED", "UPGRADES", "UPGRADING", "UPGREW", "UPGROW", "UPGROWING", "UPGROWN", "UPGROWS", "UPGROWTH", "UPGROWTHS", "UPHEAP", "UPHEAPED", "UPHEAPING", "UPHEAPS", "UPHEAVE", "UPHEAVED", "UPHEAVER", "UPHEAVERS", "UPHEAVES", "UPHEAVING", "UPHELD", "UPHILL", "UPHILLS", "UPHOARD", "UPHOARDED", "UPHOARDING", "UPHOARDS", "UPHOLD", "UPHOLDER", "UPHOLDERS", "UPHOLDING", "UPHOLDS", "UPHOLSTER", "UPHOLSTERED", "UPHOLSTERING", "UPHOLSTERS", "UPHOVE", "UPKEEP", "UPKEEPS", "UPLAND", "UPLANDER", "UPLANDERS", "UPLANDS", "UPLEAP", "UPLEAPED", "UPLEAPING", "UPLEAPS", "UPLEAPT", "UPLIFT", "UPLIFTED", "UPLIFTER", "UPLIFTERS", "UPLIFTING", "UPLIFTS", "UPLIGHT", "UPLIGHTED", "UPLIGHTING", "UPLIGHTS", "UPLINK", "UPLINKS", "UPLIT", "UPLOAD", "UPLOADED", "UPLOADING", "UPLOADS", "UPMARKET", "UPMOST", "UPPED", "UPPER", "UPPILE", "UPPILED", "UPPILES", "UPPILING", "UPPING", "UPPINGS", "UPPISH", "UPPITY", "UPPROP", "UPPROPPED", "UPPROPPING", "UPPROPS", "UPRAISE", "UPRAISED", "UPRAISER", "UPRAISERS", "UPRAISES", "UPRAISING", "UPRATE", "UPRATED", "UPRATES", "UPRATING", "UPREACH", "UPREACHED", "UPREACHES", "UPREACHING", "UPREAR", "UPREARED", "UPREARING", "UPREARS", "UPRIGHT", "UPRIGHTED", "UPRIGHTING", "UPRIGHTLY", "UPRIGHTNESS", "UPRIGHTNESSES", "UPRIGHTS", "UPRISE", "UPRISEN", "UPRISER", "UPRISERS", "UPRISES", "UPRISING", "UPRISINGS", "UPRIVER", "UPRIVERS", "UPROAR", "UPROARS", "UPROOT", "UPROOTED", "UPROOTEDNESS", "UPROOTEDNESSES", "UPROOTER", "UPROOTERS", "UPROOTING", "UPROOTS", "UPROSE", "UPROUSE", "UPROUSED", "UPROUSES", "UPROUSING", "UPRUSH", "UPRUSHED", "UPRUSHES", "UPRUSHING", "UPSCALE", "UPSCALED", "UPSCALES", "UPSCALING", "UPSEND", "UPSENDING", "UPSENDS", "UPSENT", "UPSET", "UPSETS", "UPSETTER", "UPSETTERS", "UPSETTING", "UPSHIFT", "UPSHIFTED", "UPSHIFTING", "UPSHIFTS", "UPSHOOT", "UPSHOOTING", "UPSHOOTS", "UPSHOT", "UPSHOTS", "UPSIDE", "UPSIDES", "UPSOAR", "UPSOARED", "UPSOARING", "UPSOARS", "UPSPRANG", "UPSPRING", "UPSPRINGING", "UPSPRINGS", "UPSPRUNG", "UPSTAGE", "UPSTAGED", "UPSTAGES", "UPSTAGING", "UPSTAIR", "UPSTAIRS", "UPSTAND", "UPSTANDING", "UPSTANDS", "UPSTARE", "UPSTARED", "UPSTARES", "UPSTARING", "UPSTART", "UPSTARTED", "UPSTARTING", "UPSTARTS", "UPSTATE", "UPSTATER", "UPSTATERS", "UPSTATES", "UPSTEP", "UPSTEPPED", "UPSTEPPING", "UPSTEPS", "UPSTIR", "UPSTIRRED", "UPSTIRRING", "UPSTIRS", "UPSTOOD", "UPSTREAM", "UPSTROKE", "UPSTROKES", "UPSURGE", "UPSURGED", "UPSURGES", "UPSURGING", "UPSWEEP", "UPSWEEPING", "UPSWEEPS", "UPSWELL", "UPSWELLED", "UPSWELLING", "UPSWELLS", "UPSWEPT", "UPSWING", "UPSWINGING", "UPSWINGS", "UPSWOLLEN", "UPSWUNG", "UPTAKE", "UPTAKES", "UPTEAR", "UPTEARING", "UPTEARS", "UPTHREW", "UPTHROW", "UPTHROWING", "UPTHROWN", "UPTHROWS", "UPTHRUST", "UPTHRUSTING", "UPTHRUSTS", "UPTICK", "UPTICKS", "UPTIGHT", "UPTIGHTNESS", "UPTIGHTNESSES", "UPTILT", "UPTILTED", "UPTILTING", "UPTILTS", "UPTIME", "UPTIMES", "UPTORE", "UPTORN", "UPTOSS", "UPTOSSED", "UPTOSSES", "UPTOSSING", "UPTOWN", "UPTOWNS", "UPTREND", "UPTRENDS", "UPTURN", "UPTURNED", "UPTURNING", "UPTURNS", "UPWAFT", "UPWAFTED", "UPWAFTING", "UPWAFTS", "UPWARD", "UPWARDS", "UPWELL", "UPWELLED", "UPWELLING", "UPWELLS", "UPWIND", "UPWINDS", "WALKABLE", "WALKABOUT", "WALKAWAY", "WALKERS", "WALKOUT", "WALKOUTS", "WALKOVER", "WALKOVERS", "WALKUPS", "WALKWAY", "WALKWAYS", "WALLABY", "WALLBOARD", "WALLBOARDS", "WALLEYE", "WALLEYED", "WALLEYES", "WALLFLOWER", "WALLFLOWERS", "WALLOPED", "WALLOPING", "WALLOPS", "WALLOWED", "WALLOWING", "WALLPAPER", "WALLPAPERED", "WALLPAPERING", "WALLPAPERS", "WORKABILITIES", "WORKABILITY", "WORKABLE", "WORKBAG", "WORKBAGS", "WORKBASKET", "WORKBASKETS", "WORKBENCH", "WORKBENCHES", "WORKBOAT", "WORKBOATS", "WORKBOOK", "WORKBOOKS", "WORKBOX", "WORKBOXES", "WORKDAY", "WORKDAYS", "WORKERS", "WORKFARE", "WORKFARES", "WORKFOLK", "WORKFOLKS", "WORKFORCE", "WORKFORCES", "WORKHORSE", "WORKHORSES", "WORKHOUSE", "WORKHOUSES", "WORKLESS", "WORKLOAD", "WORKLOADS", "WORKMAN", "WORKMANLIKE", "WORKMANLY", "WORKMATE", "WORKMATES", "WORKMEN", "WORKOUT", "WORKOUTS", "WORKPEOPLE", "WORKPIECE", "WORKPIECES", "WORKPLACE", "WORKPLACES", "WORKROOM", "WORKROOMS", "WORKSHEET", "WORKSHEETS", "WORKSHOP", "WORKSHOPS", "WORKSTATION", "WORKSTATIONS", "WORKTABLE", "WORKTABLES", "WORKUPS", "WORKWEEK", "WORKWEEKS", "WORKWOMAN", "WORKWOMEN", "YARDAGE", "YARDAGES", "YARDARM", "YARDARMS", "YARDBIRD", "YARDBIRDS", "YARDLAND", "YARDLANDS", "YARDMAN", "YARDMASTER", "YARDMASTERS", "YARDMEN", "YARDSTICK", "YARDSTICKS", "YARDWAND", "YARDWANDS", "YARDWORK", "YARDWORKS"]);

  const OPEN_COMPOUND_COLLOCATIONS = new Set(["BOX+TRUCK", "BUTTER+FORK", "BUTTER+KNIFE", "BUTTER+PLATE", "COFFEE+BEAN", "COFFEE+MUG", "COFFEE+SHOP", "DOG+BONE", "DOG+BOWL", "DOG+COLLAR", "DOG+KENNEL", "DOG+LEASH", "DOG+PARK", "DOOR+FRAME", "DOOR+KNOB", "DOOR+LOCK", "JUICE+CUP", "LIGHT+HOUR", "LIGHT+SECOND", "PARK+BENCH", "PEANUT+OIL", "PEANUT+SAUCE", "PEANUT+SHELL", "POOL+BENCH", "POOL+CHAIR", "SCOTCH+WHISKEY", "SHARK+CAGE", "SHARK+FIN", "SHARK+POOL", "TABLE+CLOCK", "TABLE+EDGE", "TABLE+LAMP", "TABLE+VASE", "WATER+CUP", "WHISKEY+SCOTCH"]);

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
    const attemptCount = Number(options.attemptCount || 0);
    const baseSetIdx = Number.isInteger(vineBlueprint.chainSetIndex) ? vineBlueprint.chainSetIndex : 0;

    const z1ChainIdx = attemptCount > 0
      ? (baseSetIdx + attemptCount) % ZONE1_TRIPLET_CHAINS.length
      : baseSetIdx;
    const z23ChainIdx = attemptCount > 0
      ? (baseSetIdx + attemptCount) % ZONE2_AND_3_CHAINS.length
      : (baseSetIdx % ZONE2_AND_3_CHAINS.length);

    const z1Triplets = (attemptCount === 0 && Array.isArray(vineBlueprint.zone1Triplets))
      ? vineBlueprint.zone1Triplets
      : ZONE1_TRIPLET_CHAINS[z1ChainIdx];
    const z2Compounds = (attemptCount === 0 && Array.isArray(vineBlueprint.zone2Compounds))
      ? vineBlueprint.zone2Compounds
      : ZONE2_AND_3_CHAINS[z23ChainIdx].zone2;
    const z3Compounds = (attemptCount === 0 && Array.isArray(vineBlueprint.zone3Compounds))
      ? vineBlueprint.zone3Compounds
      : ZONE2_AND_3_CHAINS[z23ChainIdx].zone3;

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

    const nodes = [];
    let idx = 0;

    for (let tIdx = 0; tIdx < z1Triplets.length; tIdx++) {
      const t = z1Triplets[tIdx];
      const [p1, p2, p3] = t.parts;
      const nextT = tIdx + 1 < z1Triplets.length ? z1Triplets[tIdx + 1] : null;
      const z2FirstStem = z2Compounds[0] ? z2Compounds[0].stem : t.thematicLink.nextPart1;
      const z2FirstTarget = z2Compounds[0] ? z2Compounds[0].target : '';
      const linkTargetWord = nextT ? nextT.parts[0] : z2FirstStem;
      const nextTripletStr = nextT
        ? `${nextT.parts[0]} → ${nextT.parts[1]} → ${nextT.parts[2]}`
        : `+ ZONE 2: ${linkTargetWord}`;

      nodes.push({
        index: idx++,
        zoneId: 1,
        tripletStep: 2,
        stemWord: p1,
        displayStem: p1,
        stemBadge: `ZONE 1 • 3-PART COMPOUND (${tIdx + 1}/4)`,
        correctWord: p2,
        decoyPool: t.part2Decoys,
        decoyWord: pickSafeDecoyFromPool(p1, p2, t.part2Decoys),
        leftRightSeed: pickDynamicSide(),
        faintAbove: {
          label: 'NODE 3 AHEAD • 3-PART LINK',
          word: `🌸 ${p3}`,
          isNextTriplet: false
        },
        tripletSlots: [p1, '[ ? ]', `🌸 ${p3}`],
        compoundHint: t.part2Hint
      });

      nodes.push({
        index: idx++,
        zoneId: 1,
        tripletStep: 3,
        stemWord: p2,
        displayStem: `${p1} → ${p2}`,
        stemBadge: `🌸 COMPLETE 3-PART WORD (${tIdx + 1}/4)`,
        correctWord: p3,
        decoyPool: t.part3Decoys,
        decoyWord: pickSafeDecoyFromPool(p2, p3, t.part3Decoys),
        leftRightSeed: pickDynamicSide(),
        faintAbove: {
          label: `THEMATIC LINK VIA ${p3}`,
          word: `🔗 ${nextTripletStr}`,
          isNextTriplet: true
        },
        tripletSlots: [p1, p2, '🌸 [ ? ]'],
        compoundHint: t.part3Hint
      });

      const link = t.thematicLink;
      const faintPreview = nextT
        ? `[ ? ] → ${nextT.parts[1]} → ${nextT.parts[2]}`
        : `${linkTargetWord} → ${z2FirstTarget}`;

      nodes.push({
        index: idx++,
        zoneId: 1,
        tripletStep: 1,
        stemWord: p3,
        displayStem: p3,
        stemBadge: `🔗 ${link.connection.toUpperCase()}`,
        correctWord: linkTargetWord,
        decoyPool: link.decoys,
        decoyWord: pickSafeDecoyFromPool(p3, linkTargetWord, link.decoys),
        leftRightSeed: pickDynamicSide(),
        faintAbove: {
          label: nextT ? `LINKING TO TRIPLET ${tIdx + 2}/4` : 'BRIDGING TO ZONE 2 STEM',
          word: faintPreview,
          isNextTriplet: true
        },
        tripletSlots: [
          `🔗 ${p3}`,
          '[ ? (1/3) ]',
          nextT ? `${nextT.parts[1]} → ${nextT.parts[2]}` : 'ZONE 2'
        ],
        compoundHint: link.hint
      });
    }

    for (let i = 0; i < z2Compounds.length; i++) {
      const item = z2Compounds[i];
      nodes.push({
        index: idx++,
        zoneId: 2,
        tripletStep: 0,
        stemWord: item.stem,
        displayStem: item.stem,
        correctWord: item.target,
        decoyPool: item.decoys,
        decoyWord: pickSafeDecoyFromPool(item.stem, item.target, item.decoys),
        leftRightSeed: pickDynamicSide(),
        compoundHint: item.hint
      });
    }

    for (let i = 0; i < z3Compounds.length; i++) {
      const item = z3Compounds[i];
      nodes.push({
        index: idx++,
        zoneId: 3,
        tripletStep: 0,
        stemWord: item.stem,
        displayStem: item.stem,
        correctWord: item.target,
        decoyPool: item.decoys,
        decoyWord: pickSafeDecoyFromPool(item.stem, item.target, item.decoys),
        leftRightSeed: pickDynamicSide(),
        compoundHint: item.hint
      });
    }

    return nodes;
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
    ZONE1_TRIPLET_CHAINS,
    ZONE2_AND_3_CHAINS,
    PRODUCTION_DAILY_VINES,
    KNOWN_FORWARD_COMPOUNDS,
    OPEN_COMPOUND_COLLOCATIONS,
    createDynamicPuzzleNodes,
    pickSafeDecoyFromPool,
    validateDecoyPair,
    validateEntireVine,
    validateVineChain: validateEntireVine
  };
});
