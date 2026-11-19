/**
 * The 8.3 Billionth — Closed Taxonomy, Domain Metadata & Specimen Archetype Minter
 * Shared between Browser Client (GitHub Pages) and Node.js Validation / Test Suites.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthTaxonomy = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WORLD_POPULATION = 8300000000;
  const MAX_UNIQUENESS_BITS = Math.log2(WORLD_POPULATION); // ~32.95017

  // Closed 40-tag clusterTags enum: 36 topical domains + 4 latent psychographic bridges
  const CLUSTER_TAGS = Object.freeze([
    // Movement & Outdoors (8)
    'athletic',
    'team_sport',
    'court_sport',
    'endurance_sport',
    'water_sport',
    'winter_sport',
    'outdoor_mountain',
    'cycling_wheeled',
    // Hobbies & Craft (8)
    'horticulture',
    'indoor_hobby',
    'culinary_diy',
    'craft_maker',
    'coding_tech',
    'automotive_mech',
    'vintage_gear',
    'collectors',
    // Culture & Mind (7)
    'musical',
    'live_music_audio',
    'polyglot',
    'daily_puzzle_games',
    'board_tabletop',
    'book_reader',
    'visual_arts',
    // Body & Diet (8)
    'genetic_quirk',
    'sensory_trait',
    'handedness',
    'medical_history',
    'spicy_palate',
    'dietary_restriction',
    'caffeine_habit',
    'sleep_habit',
    // Life & Context (5)
    'pet_owner',
    'high_altitude',
    'world_traveler',
    'home_energy_diy',
    'family_structure',
    // Latent Psychographic Cross-Topic Bridges (4)
    'quant_systemizer',
    'tactile_analog_ritual',
    'gear_optimizer',
    'thrill_risk'
  ]);

  const CLUSTER_TAG_SET = new Set(CLUSTER_TAGS);

  // Closed 4-gate macro-denominators ("Pay-the-Gate-Once")
  const BASE_GATES = Object.freeze([
    'adult_15plus',
    'connected_urban_affluent',
    'yard_homeowner_space',
    'euro_western_skew'
  ]);

  const BASE_GATE_SET = new Set(BASE_GATES);

  const BASE_GATE_META = Object.freeze({
    adult_15plus: {
      id: 'adult_15plus',
      p: 0.74,
      bits: -Math.log2(0.74), // ~0.4344 bits
      label: 'Adult 15+ Population'
    },
    connected_urban_affluent: {
      id: 'connected_urban_affluent',
      p: 0.22,
      bits: -Math.log2(0.22), // ~2.1844 bits
      label: 'Discretionary Time & Broadband'
    },
    yard_homeowner_space: {
      id: 'yard_homeowner_space',
      p: 0.14,
      bits: -Math.log2(0.14), // ~2.8365 bits
      label: 'Yard / Garage / Home Space'
    },
    euro_western_skew: {
      id: 'euro_western_skew',
      p: 0.16,
      bits: -Math.log2(0.16), // ~2.6439 bits
      label: 'Western Regional Skew'
    }
  });

  const CLUSTER_TAG_LABELS = Object.freeze({
    athletic: 'Active & Athletic',
    team_sport: 'Team Sports',
    court_sport: 'Court & Net Sports',
    endurance_sport: 'Endurance',
    water_sport: 'Aquatic & Ocean',
    winter_sport: 'Snow & Ice',
    outdoor_mountain: 'Trail & Mountain',
    cycling_wheeled: 'Wheels & Pedals',
    horticulture: 'Plant Life',
    indoor_hobby: 'Homebound Pursuits',
    culinary_diy: 'Kitchen Lab',
    craft_maker: 'Hands-On Maker',
    coding_tech: 'Digital & Code',
    automotive_mech: 'Mechanical & Wrench',
    vintage_gear: 'Analog & Vintage',
    collectors: 'Archivist & Collector',
    musical: 'Musicianship',
    live_music_audio: 'Hi-Fi & Live Sound',
    polyglot: 'Languages',
    daily_puzzle_games: 'Word & Logic Puzzles',
    board_tabletop: 'Tabletop & Strategy',
    book_reader: 'Print & Literature',
    visual_arts: 'Design & Visual Art',
    genetic_quirk: 'Genetic Blueprint',
    sensory_trait: 'Sensory Wiring',
    handedness: 'Dexterity',
    medical_history: 'Body Lore',
    spicy_palate: 'Capsaicin Tolerance',
    dietary_restriction: 'Selective Plate',
    caffeine_habit: 'Stimulant Ritual',
    sleep_habit: 'Circadian Rhythm',
    pet_owner: 'Animal Companion',
    high_altitude: 'Thin Air',
    world_traveler: 'Passport Stamps',
    home_energy_diy: 'Homestead Systems',
    family_structure: 'Family Tree',
    quant_systemizer: 'Quant & Systemizer',
    tactile_analog_ritual: 'Tactile Analog Ritual',
    gear_optimizer: 'Gear Optimizer',
    thrill_risk: 'Thrill & Adrenaline'
  });

  const CATEGORIES = Object.freeze([
    { id: 'sports_movement', label: 'Sports & Movement', shortLabel: 'Sports', emoji: '🏃' },
    { id: 'genetics_physiology', label: 'Genetics & Body', shortLabel: 'Biology', emoji: '🧬' },
    { id: 'skills_craft', label: 'Skills & Craft', shortLabel: 'Skills', emoji: '🛠️' },
    { id: 'niche_hobbies', label: 'Niche Hobbies', shortLabel: 'Hobbies', emoji: '🌱' },
    { id: 'daily_quirks', label: 'Daily Quirks', shortLabel: 'Quirks', emoji: '⚡' },
    { id: 'food_palate', label: 'Food & Palate', shortLabel: 'Palate', emoji: '🌶️' },
    { id: 'household_companions', label: 'Home & Pets', shortLabel: 'Home', emoji: '🐕' },
    { id: 'travel_geography', label: 'Geography & Travel', shortLabel: 'Places', emoji: '🧭' },
    { id: 'media_games', label: 'Culture & Games', shortLabel: 'Culture', emoji: '🧩' },
    { id: 'life_randomness', label: 'Life Randomness', shortLabel: 'Lore', emoji: '🎲' }
  ]);

  const CATEGORY_MAP = Object.freeze(
    CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {})
  );

  // Modifier & Noun lookup tables for minting memorable Specimen Archetype titles
  const TAG_ADJECTIVES = Object.freeze({
    athletic: 'Kinetic',
    team_sport: 'Varsity',
    court_sport: 'Hardcourt',
    endurance_sport: 'Long-Distance',
    water_sport: 'Amphibious',
    winter_sport: 'Sub-Zero',
    outdoor_mountain: 'Backcountry',
    cycling_wheeled: 'Two-Wheeled',
    horticulture: 'Botanical',
    indoor_hobby: 'Hermetic',
    culinary_diy: 'Small-Batch',
    craft_maker: 'Artisanal',
    coding_tech: 'Algorithmic',
    automotive_mech: 'Manual-Shift',
    vintage_gear: 'Analog',
    collectors: 'Archival',
    musical: 'Harmonic',
    live_music_audio: 'Decibel-Guarded',
    polyglot: 'Multilingual',
    daily_puzzle_games: 'Cruciverbal',
    board_tabletop: 'Tactical',
    book_reader: 'Hardcover',
    visual_arts: 'Chromatic',
    genetic_quirk: 'Recessive',
    sensory_trait: 'Hyper-Sensory',
    handedness: 'Southpaw',
    medical_history: 'Battle-Tested',
    spicy_palate: 'Scoville-Proof',
    dietary_restriction: 'Plant-Forward',
    caffeine_habit: 'Over-Caffeinated',
    sleep_habit: 'Circadian',
    pet_owner: 'Pack-Leading',
    high_altitude: 'Alpine',
    world_traveler: 'Jet-Lagged',
    home_energy_diy: 'Solar-Powered',
    family_structure: 'Big-Table',
    quant_systemizer: 'Systematic',
    tactile_analog_ritual: 'Small-Batch',
    gear_optimizer: 'Precision-Spec',
    thrill_risk: 'Adrenaline-Wired'
  });

  const TAG_NOUNS = Object.freeze({
    athletic: 'Contender',
    team_sport: 'Playmaker',
    court_sport: 'Rally Specialist',
    endurance_sport: 'Pacer',
    water_sport: 'Deep-Diver',
    winter_sport: 'Powder Hound',
    outdoor_mountain: 'Mountaineer',
    cycling_wheeled: 'Gearhead',
    horticulture: 'Cultivator',
    indoor_hobby: 'Tinkerer',
    culinary_diy: 'Fermenter',
    craft_maker: 'Fabricator',
    coding_tech: 'Compiler',
    automotive_mech: 'Wrench-Turner',
    vintage_gear: 'Purist',
    collectors: 'Curator',
    musical: 'Multi-Instrumentalist',
    live_music_audio: 'Front-Row Regular',
    polyglot: 'Polyglot',
    daily_puzzle_games: 'Puzzler',
    board_tabletop: 'Strategist',
    book_reader: 'Bibliophile',
    visual_arts: 'Aesthete',
    genetic_quirk: 'Outlier',
    sensory_trait: 'Taster',
    handedness: 'Anomaly',
    medical_history: 'Survivor',
    spicy_palate: 'Chili-Head',
    dietary_restriction: 'Grazer',
    caffeine_habit: 'Espresso Fiend',
    sleep_habit: 'Early Bird',
    pet_owner: 'Beastmaster',
    high_altitude: 'Ridge-Dweller',
    world_traveler: 'Nomad',
    home_energy_diy: 'Homesteader',
    family_structure: 'Patriarch',
    quant_systemizer: 'Systemizer',
    tactile_analog_ritual: 'Analogist',
    gear_optimizer: 'Optimizer',
    thrill_risk: 'Daredevil'
  });

  const CATEGORY_FALLBACK_NOUNS = Object.freeze({
    sports_movement: 'Kinetic Outlier',
    genetics_physiology: 'Genetic Original',
    skills_craft: 'Master Tinkerer',
    niche_hobbies: 'Specialist',
    daily_quirks: 'Creature of Habit',
    food_palate: 'Culinary Maverick',
    household_companions: 'Homebody',
    travel_geography: 'Wayfarer',
    media_games: 'Culture Vulture',
    life_randomness: 'Wildcard'
  });

  function isValidClusterTag(tag) {
    return CLUSTER_TAG_SET.has(tag);
  }

  function sanitizeClusterTags(tags) {
    if (!Array.isArray(tags)) return [];
    const seen = new Set();
    const out = [];
    for (let i = 0; i < tags.length; i++) {
      const t = String(tags[i] || '').trim();
      if (CLUSTER_TAG_SET.has(t) && !seen.has(t)) {
        seen.add(t);
        out.push(t);
        if (out.length === 4) break;
      }
    }
    return out;
  }

  function isValidBaseGate(gate) {
    return BASE_GATE_SET.has(gate);
  }

  function sanitizeBaseGates(gates) {
    if (!Array.isArray(gates)) return [];
    const seen = new Set();
    const out = [];
    for (let i = 0; i < gates.length; i++) {
      const g = String(gates[i] || '').trim();
      if (BASE_GATE_SET.has(g) && !seen.has(g)) {
        seen.add(g);
        out.push(g);
      }
    }
    return out;
  }

  /**
   * Mints a witty, personalized Specimen Classification from an evaluated stack.
   */
  function generateArchetype(evaluatedItems) {
    const active = (evaluatedItems || []).filter((item) => !item.superseded);
    if (active.length === 0) {
      return 'The Unfiltered Earthling';
    }

    // Rank active traits by bits contributed descending (rarest / strongest cuts first)
    const byImpact = active.slice().sort((a, b) => (b.bitsAdded || 0) - (a.bitsAdded || 0));
    const mvp = byImpact[0];
    const secondary = byImpact[1] || byImpact[0];

    const primaryTag = (mvp.trait.clusterTags && mvp.trait.clusterTags[0]) || null;
    let modifierTag = null;

    // Pick a distinct tag from secondary or third trait for flavor contrast
    for (let i = 1; i < byImpact.length; i++) {
      const candidateTags = byImpact[i].trait.clusterTags || [];
      for (let j = 0; j < candidateTags.length; j++) {
        if (candidateTags[j] !== primaryTag && TAG_ADJECTIVES[candidateTags[j]]) {
          modifierTag = candidateTags[j];
          break;
        }
      }
      if (modifierTag) break;
    }

    if (!modifierTag && mvp.trait.clusterTags && mvp.trait.clusterTags[1]) {
      modifierTag = mvp.trait.clusterTags[1];
    }

    const noun =
      (primaryTag && TAG_NOUNS[primaryTag]) ||
      CATEGORY_FALLBACK_NOUNS[mvp.trait.category] ||
      'Outlier';

    const adj =
      (modifierTag && TAG_ADJECTIVES[modifierTag]) ||
      (primaryTag && TAG_ADJECTIVES[primaryTag]) ||
      (secondary && TAG_ADJECTIVES[(secondary.trait.clusterTags || [])[0]]) ||
      'Certified';

    // Avoid awkward duplicate roots like "Polyglot Polyglot"
    if (noun.toLowerCase().includes(adj.toLowerCase()) || adj.toLowerCase().includes(noun.toLowerCase())) {
      return 'The One-of-One ' + noun;
    }

    return 'The ' + adj + ' ' + noun;
  }

  /**
   * Computes solo efficiency tier ("Trait Golf") and special run badges.
   */
  function evaluateSoloBadges(evalResult) {
    const activeItems = (evalResult.items || []).filter((it) => !it.superseded);
    const count = activeItems.length;
    const expected = evalResult.expectedHumans;

    let golfLabel = 'Par Run';
    let golfIcon = '⛳';
    if (count <= 3) {
      golfLabel = 'Albatross (' + count + ' traits)';
      golfIcon = '🦅';
    } else if (count === 4) {
      golfLabel = 'Eagle (4 traits)';
      golfIcon = '🦅';
    } else if (count === 5) {
      golfLabel = 'Birdie (5 traits)';
      golfIcon = '🐦';
    } else if (count === 6) {
      golfLabel = 'On Par (6 traits)';
      golfIcon = '⛳';
    } else if (count <= 8) {
      golfLabel = 'Measured Climb (' + count + ' traits)';
      golfIcon = '🧭';
    } else {
      golfLabel = 'Scenic Route (' + count + ' traits)';
      golfIcon = '🚂';
    }

    const badges = [
      {
        id: 'golf_tier',
        icon: golfIcon,
        label: golfLabel,
        detail: 'Reached 1-of-1 using ' + count + ' active trait' + (count === 1 ? '' : 's') + '.'
      }
    ];

    // Everyday Purist: every trait >= 0.1% global prevalence (8.3M+ people each)
    const allEveryday =
      count >= 4 && activeItems.every((it) => (it.trait.prevalence || 0) >= 0.001);
    if (allEveryday) {
      badges.push({
        id: 'everyday_purist',
        icon: '☕',
        label: 'Everyday Purist',
        detail: 'Zero ultra-rare (<0.1%) shortcuts — pure combinatorial magic.'
      });
    }

    // Orthogonal Mind: 4+ active traits with zero cluster or base-gate overlap dampening
    const zeroOverlap =
      count >= 4 &&
      activeItems.every(
        (it) => (it.overlapCount || 0) === 0 && (!it.repeatGates || it.repeatGates.length === 0)
      );
    if (zeroOverlap) {
      badges.push({
        id: 'orthogonal_stack',
        icon: '📐',
        label: '100% Uncorrelated',
        detail: 'Every trait came from an independent corner of human life.'
      });
    }

    // Pinpoint Landing vs Timeline Eraser
    if (expected >= 0.75 && expected <= 1.49) {
      badges.push({
        id: 'pinpoint_landing',
        icon: '🎯',
        label: 'Pinpoint Landing',
        detail: 'Threaded the needle right onto ~1.0 expected human without overkill.'
      });
    } else if (expected < 0.01) {
      badges.push({
        id: 'timeline_eraser',
        icon: '🌌',
        label: 'Timeline Eraser',
        detail: 'Overshot past 39+ bits — unique across multiple parallel Earths.'
      });
    }

    return badges;
  }

  return {
    WORLD_POPULATION,
    MAX_UNIQUENESS_BITS,
    CLUSTER_TAGS,
    CLUSTER_TAG_SET,
    CLUSTER_TAG_LABELS,
    BASE_GATES,
    BASE_GATE_SET,
    BASE_GATE_META,
    CATEGORIES,
    CATEGORY_MAP,
    isValidClusterTag,
    sanitizeClusterTags,
    isValidBaseGate,
    sanitizeBaseGates,
    generateArchetype,
    evaluateSoloBadges
  };
});
