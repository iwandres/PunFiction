/**
 * The 8.3 Billionth — Probability, Bayesian Geo/Language Conditioning, Cluster Dampening & Subsumption Engine
 *
 * Enforces:
 * 1. Expected population: E_k = N_0 * Product(p_eff(i))
 * 2. One-of-One threshold: E_k <= 1.49 (prevents premature round-down from 1.50..1.99)
 * 3. Bidirectional Bayes Geographic/Linguistic Conditioning:
 *    - Forward P(B | A) = r from A.cond[B.slug]
 *    - Reverse P(B | A) = min(0.995, P(B) * P(A | B) / P(A)) from B.cond[A.slug]
 * 4. Cluster correlation dampening: p_eff(i) = p_base(i) ^ (gamma ^ m), gamma = 0.65
 * 5. Parent-child subsumption (curated, multi-language polyglot counts & AI custom subsumes[])
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const Taxonomy = require('./taxonomy.js');
    module.exports = factory(Taxonomy);
  } else {
    root.BillionthProbability = factory(root.BillionthTaxonomy);
  }
})(typeof self !== 'undefined' ? self : this, function (Taxonomy) {
  'use strict';

  const WORLD_POPULATION = (Taxonomy && Taxonomy.WORLD_POPULATION) || 8300000000;
  const MAX_BITS = Math.log2(WORLD_POPULATION); // ~32.95017
  const GAMMA = 0.65;
  const GATE_ALPHA = 0.5; // Pay-the-Gate-Once repeat deduction factor
  const ONE_OF_ONE_THRESHOLD = 1.49;
  const DEFAULT_MIN_PREVALENCE = 1e-7; // ~830 humans globally
  const EXTREME_RARITY_MIN_PREVALENCE = 1e-9; // ~8 humans globally (verified rarities only)

  function clampPrevalence(rawP, isVerifiedExtremeRarity) {
    const floor = isVerifiedExtremeRarity ? EXTREME_RARITY_MIN_PREVALENCE : DEFAULT_MIN_PREVALENCE;
    const num = Number(rawP);
    if (!Number.isFinite(num) || num <= 0) return floor;
    if (num >= 0.999) return 0.999;
    return Math.max(floor, num);
  }

  function getTraitKeys(trait) {
    const keys = new Set();
    if (trait && trait.id) keys.add(String(trait.id));
    if (trait && trait.canonicalSlug) keys.add(String(trait.canonicalSlug));
    return keys;
  }

  function isIndividualLanguageTrait(trait) {
    if (!trait) return false;
    if (trait.generatorId === 'speaks_language') return true;
    const slug = String(trait.canonicalSlug || '');
    return slug.startsWith('speaks_') && !slug.includes('plus_languages');
  }

  /**
   * Determines whether trait B strictly subsumes (supersedes) trait A.
   */
  function doesSubsume(traitB, traitA) {
    if (!traitB || !traitA || traitB === traitA) return false;
    const keysA = getTraitKeys(traitA);

    // 1. Explicit subsumes list on narrower trait B (works for curated, parametric & AI custom traits)
    if (Array.isArray(traitB.subsumes)) {
      for (let i = 0; i < traitB.subsumes.length; i++) {
        if (keysA.has(String(traitB.subsumes[i]))) {
          return true;
        }
      }
    }

    // 2. Deterministic 100% geographic implication (e.g. Island nation -> lived_on_island = 1.0)
    if (traitB.cond && typeof traitB.cond === 'object') {
      for (const k of keysA) {
        if (Number(traitB.cond[k]) >= 0.999) {
          return true;
        }
      }
    }

    // 3. Identical canonicalSlug (narrower or earlier duplicate wins)
    if (
      traitB.canonicalSlug &&
      traitA.canonicalSlug &&
      traitB.canonicalSlug === traitA.canonicalSlug &&
      (traitB.prevalence || 1) <= (traitA.prevalence || 1)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Counts how many prior active traits share >= 1 closed clusterTag with candidateTrait.
   */
  function computeClusterOverlap(priorEvaluatedActive, candidateTrait) {
    const candidateTags = new Set(
      Taxonomy ? Taxonomy.sanitizeClusterTags(candidateTrait.clusterTags) : candidateTrait.clusterTags || []
    );
    if (candidateTags.size === 0 || priorEvaluatedActive.length === 0) {
      return { overlapCount: 0, sharedWith: [] };
    }

    let overlapCount = 0;
    const sharedWith = [];

    for (let i = 0; i < priorEvaluatedActive.length; i++) {
      const prev = priorEvaluatedActive[i];
      const prevTags = prev.sanitizedTags || [];
      const matchingTags = [];
      for (let j = 0; j < prevTags.length; j++) {
        if (candidateTags.has(prevTags[j])) {
          matchingTags.push(prevTags[j]);
        }
      }
      if (matchingTags.length > 0) {
        overlapCount += 1;
        sharedWith.push({
          label: prev.trait.shortBadge || prev.trait.label,
          canonicalSlug: prev.trait.canonicalSlug || prev.trait.id,
          tags: matchingTags
        });
      }
    }

    return { overlapCount, sharedWith };
  }

  /**
   * Evaluates exact bidirectional Bayes' Theorem geographic/linguistic/cultural conditioning
   * between prior active traits and candidateTrait:
   * - Forward: P(Candidate | Prior) = r  (from Prior.cond[Candidate.slug])
   * - Reverse: P(Candidate | Prior) = P(Candidate) * P(Prior | Candidate) / P(Prior)  (from Candidate.cond[Prior.slug])
   */
  function computeGeoBayesConditioning(priorEvaluatedActive, candidateTrait, candidatePBase) {
    if (!candidateTrait || priorEvaluatedActive.length === 0) {
      return { geoRate: null, geoSourceLabel: null };
    }

    const candKeys = Array.from(getTraitKeys(candidateTrait));
    const candCond = candidateTrait.cond && typeof candidateTrait.cond === 'object' ? candidateTrait.cond : null;

    let bestRate = null;
    let bestSourceLabel = null;

    for (let i = 0; i < priorEvaluatedActive.length; i++) {
      const prev = priorEvaluatedActive[i];
      const prevTrait = prev.trait;
      const prevPBase = prev.pBase;

      // Forward check: Prior.cond[candSlug] = P(Candidate | Prior)
      if (prevTrait.cond && typeof prevTrait.cond === 'object') {
        for (let k = 0; k < candKeys.length; k++) {
          const r = Number(prevTrait.cond[candKeys[k]]);
          if (Number.isFinite(r) && r > 0 && r < 0.999) {
            if (bestRate === null || r > bestRate) {
              bestRate = r;
              bestSourceLabel = prevTrait.shortBadge || prevTrait.label;
            }
          }
        }
      }

      // Reverse Bayes check: Candidate.cond[prevSlug] = P(Prior | Candidate)
      // => P(Candidate | Prior) = (P(Candidate) * r) / P(Prior)
      if (candCond && prevPBase > 0) {
        const prevKeys = Array.from(getTraitKeys(prevTrait));
        for (let k = 0; k < prevKeys.length; k++) {
          const r = Number(candCond[prevKeys[k]]);
          if (Number.isFinite(r) && r > 0 && r < 0.999) {
            const bayesRate = Math.min(0.995, (candidatePBase * r) / prevPBase);
            if (bestRate === null || bayesRate > bestRate) {
              bestRate = bayesRate;
              bestSourceLabel = prevTrait.shortBadge || prevTrait.label;
            }
          }
        }
      }
    }

    return { geoRate: bestRate, geoSourceLabel: bestSourceLabel };
  }

  function computeEffectivePrevalence(pBase, overlapCount) {
    if (overlapCount <= 0) return pBase;
    const exponent = Math.pow(GAMMA, overlapCount);
    return Math.pow(pBase, exponent);
  }

  function expectedToDisplayPopulation(expectedHumans) {
    if (expectedHumans <= ONE_OF_ONE_THRESHOLD) {
      return 1;
    }
    return Math.max(2, Math.round(expectedHumans));
  }

  /**
   * Evaluates an ordered array of user-selected traits and returns complete population,
   * entropy bits, per-trait overlap/Bayes telemetry, subsumption status, and funnel steps.
   */
  function evaluateStack(traits) {
    const rawList = Array.isArray(traits) ? traits.filter(Boolean) : [];
    const n = rawList.length;

    // Step 1: Mutually exclusive single-value slots (e.g., blood_type, home_country)
    const supersededInfo = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
      const groupA = rawList[i].exclusiveGroup;
      if (groupA) {
        for (let j = i + 1; j < n; j++) {
          if (rawList[j].exclusiveGroup === groupA) {
            supersededInfo[i] = {
              byLabel: rawList[j].shortBadge || rawList[j].label,
              bySlug: rawList[j].canonicalSlug || rawList[j].id,
              reason: 'replaced_exclusive'
            };
            break;
          }
        }
      }
    }

    // Step 1B: Multi-language count subsumption (e.g. picking 2+ specific languages supersedes "Bilingual 2+")
    const spokenLangIndices = [];
    for (let i = 0; i < n; i++) {
      if (!supersededInfo[i] && isIndividualLanguageTrait(rawList[i])) {
        spokenLangIndices.push(i);
      }
    }
    if (spokenLangIndices.length >= 2) {
      const lastLang = rawList[spokenLangIndices[spokenLangIndices.length - 1]];
      const polyThresholds = [
        ['speaks_2plus_languages', 2],
        ['speaks_3plus_languages', 3],
        ['speaks_4plus_languages', 4],
        ['speaks_5plus_languages', 5]
      ];
      for (let i = 0; i < n; i++) {
        if (supersededInfo[i]) continue;
        const slug = rawList[i].canonicalSlug;
        for (let pIdx = 0; pIdx < polyThresholds.length; pIdx++) {
          if (slug === polyThresholds[pIdx][0] && spokenLangIndices.length >= polyThresholds[pIdx][1]) {
            supersededInfo[i] = {
              byLabel: spokenLangIndices.length + ' spoken languages (' + (lastLang.shortBadge || lastLang.label) + ')',
              bySlug: lastLang.canonicalSlug,
              reason: 'subsumed'
            };
          }
        }
      }
    }

    // Step 2: Parent-child & 100%-geo subsumption across all non-replaced traits
    for (let i = 0; i < n; i++) {
      if (supersededInfo[i]) continue;
      for (let j = 0; j < n; j++) {
        if (i === j || supersededInfo[j]) continue;
        if (
          rawList[i].canonicalSlug &&
          rawList[i].canonicalSlug === rawList[j].canonicalSlug &&
          i < j &&
          (rawList[j].prevalence || 1) >= (rawList[i].prevalence || 1)
        ) {
          supersededInfo[j] = {
            byLabel: rawList[i].shortBadge || rawList[i].label,
            bySlug: rawList[i].canonicalSlug || rawList[i].id,
            reason: 'duplicate'
          };
          continue;
        }
        if (doesSubsume(rawList[j], rawList[i])) {
          supersededInfo[i] = {
            byLabel: rawList[j].shortBadge || rawList[j].label,
            bySlug: rawList[j].canonicalSlug || rawList[j].id,
            reason: 'subsumed'
          };
          break;
        }
      }
    }

    // Step 3: Sequential Bayesian Geo/Language + Pay-the-Gate-Once + gamma-dampened evaluation
    let cumulativeProduct = 1.0;
    let currentExpected = WORLD_POPULATION;
    let currentDisplayPop = WORLD_POPULATION;
    const priorActive = [];
    const claimedGates = new Map(); // gateId -> first trait badge that unlocked it
    const items = [];
    const funnelSteps = [
      {
        step: 0,
        label: 'Earth',
        emoji: '🌍',
        expectedHumans: WORLD_POPULATION,
        displayPopulation: WORLD_POPULATION,
        bitsCumulative: 0
      }
    ];

    for (let i = 0; i < n; i++) {
      const trait = rawList[i];
      const sanitizedTags = Taxonomy
        ? Taxonomy.sanitizeClusterTags(trait.clusterTags)
        : (trait.clusterTags || []).slice(0, 4);
      const sanitizedGates = Taxonomy
        ? Taxonomy.sanitizeBaseGates(trait.baseGates)
        : Array.isArray(trait.baseGates)
          ? trait.baseGates.slice()
          : [];
      const pBase = clampPrevalence(trait.prevalence, Boolean(trait.isVerifiedExtremeRarity));

      if (supersededInfo[i]) {
        items.push({
          index: i,
          trait,
          sanitizedTags,
          sanitizedGates,
          superseded: true,
          supersededBy: supersededInfo[i].byLabel,
          supersededReason: supersededInfo[i].reason,
          pBase,
          pEff: 1.0,
          overlapCount: 0,
          sharedWith: [],
          repeatGates: [],
          wasDampened: false,
          dampenMode: null,
          geoSourceLabel: null,
          overlapSnark: null,
          bitsAdded: 0,
          bitsSavedFromInflation: 0,
          populationBefore: currentDisplayPop,
          populationAfter: currentDisplayPop,
          peopleEliminated: 0
        });
        continue;
      }

      const { overlapCount, sharedWith } = computeClusterOverlap(priorActive, {
        clusterTags: sanitizedTags
      });
      const pCluster = computeEffectivePrevalence(pBase, overlapCount);
      const bitsRawTrait = -Math.log2(pBase);
      const bitsCluster = -Math.log2(pCluster);
      const { geoRate, geoSourceLabel } = computeGeoBayesConditioning(priorActive, trait, pBase);

      // Check already-claimed macro baseGates ("Pay-the-Gate-Once")
      const repeatGates = [];
      let gateBitsDeduction = 0;
      for (let g = 0; g < sanitizedGates.length; g++) {
        const gId = sanitizedGates[g];
        if (claimedGates.has(gId)) {
          const meta =
            (Taxonomy && Taxonomy.BASE_GATE_META && Taxonomy.BASE_GATE_META[gId]) || null;
          const gBits = meta ? meta.bits : 1.0;
          gateBitsDeduction += GATE_ALPHA * gBits;
          repeatGates.push({
            id: gId,
            label: meta ? meta.label : gId,
            bits: gBits,
            claimedBy: claimedGates.get(gId)
          });
        }
      }

      let pEff = pCluster;
      let dampenMode = overlapCount > 0 ? 'cluster' : null;
      let activeGeoSource = null;

      if (geoRate !== null && geoRate > pEff) {
        pEff = geoRate;
        dampenMode = 'geo_bayes';
        activeGeoSource = geoSourceLabel;
      } else if (gateBitsDeduction > 0) {
        const minMarginalBits = Math.min(bitsCluster, Math.max(0.45, bitsCluster * 0.36));
        const bitsAfterGates = Math.max(minMarginalBits, bitsCluster - gateBitsDeduction);
        const pGateAdjusted = Math.min(0.985, Math.pow(2, -bitsAfterGates));
        if (pGateAdjusted > pEff) {
          pEff = pGateAdjusted;
          dampenMode = overlapCount > 0 ? 'cluster_and_gate' : 'base_gate';
        }
      }

      // Register newly paid macro baseGates for subsequent traits in stack
      for (let g = 0; g < sanitizedGates.length; g++) {
        const gId = sanitizedGates[g];
        if (!claimedGates.has(gId)) {
          claimedGates.set(gId, trait.shortBadge || trait.label);
        }
      }

      const wasDampened = pEff > pBase * 1.0001;
      const bitsAdded = -Math.log2(pEff);
      const bitsSavedFromInflation = Math.max(0, bitsRawTrait - bitsAdded);

      const popBefore = currentDisplayPop;
      cumulativeProduct *= pEff;
      currentExpected = WORLD_POPULATION * cumulativeProduct;
      const popAfter = expectedToDisplayPopulation(currentExpected);

      const evaluatedItem = {
        index: i,
        trait,
        sanitizedTags,
        sanitizedGates,
        superseded: false,
        supersededBy: null,
        supersededReason: null,
        pBase,
        pEff,
        overlapCount,
        sharedWith,
        repeatGates,
        wasDampened,
        dampenMode,
        geoSourceLabel: activeGeoSource,
        overlapSnark: null,
        bitsAdded,
        bitsSavedFromInflation,
        populationBefore: popBefore,
        populationAfter: popAfter,
        peopleEliminated: Math.max(0, popBefore - popAfter)
      };

      if (wasDampened) {
        evaluatedItem.overlapSnark = buildOverlapSnark(evaluatedItem, trait);
      }

      items.push(evaluatedItem);
      priorActive.push(evaluatedItem);

      funnelSteps.push({
        step: priorActive.length,
        label: trait.shortBadge || trait.label,
        emoji: trait.emoji || '🔹',
        pBase,
        pEff,
        wasDampened,
        dampenMode,
        geoSourceLabel: activeGeoSource,
        bitsAdded,
        expectedHumans: currentExpected,
        displayPopulation: popAfter,
        bitsCumulative: -Math.log2(cumulativeProduct)
      });
    }

    const totalBitsRaw = cumulativeProduct < 1 ? -Math.log2(cumulativeProduct) : 0;
    const totalBitsClamped = Math.min(MAX_BITS, totalBitsRaw);
    const isOneOfOne = currentExpected <= ONE_OF_ONE_THRESHOLD;
    const displayPopulation = expectedToDisplayPopulation(currentExpected);

    let mvpItem = null;
    for (let i = 0; i < priorActive.length; i++) {
      if (!mvpItem || priorActive[i].bitsAdded > mvpItem.bitsAdded) {
        mvpItem = priorActive[i];
      }
    }

    const activeCategoryCounts = {};
    const activeTagCounts = {};
    for (let i = 0; i < priorActive.length; i++) {
      const cat = priorActive[i].trait.category || 'daily_quirks';
      activeCategoryCounts[cat] = (activeCategoryCounts[cat] || 0) + 1;
      for (let t = 0; t < priorActive[i].sanitizedTags.length; t++) {
        const tag = priorActive[i].sanitizedTags[t];
        activeTagCounts[tag] = (activeTagCounts[tag] || 0) + 1;
      }
    }

    const activeGateMap = {};
    claimedGates.forEach((byLabel, gId) => {
      activeGateMap[gId] = byLabel;
    });

    return {
      worldPopulation: WORLD_POPULATION,
      maxBits: MAX_BITS,
      cumulativeMultiplier: cumulativeProduct,
      expectedHumans: currentExpected,
      displayPopulation,
      isOneOfOne,
      bitsRaw: totalBitsRaw,
      bitsDisplay: totalBitsClamped,
      bitsProgressRatio: Math.min(1, totalBitsRaw / MAX_BITS),
      activeCount: priorActive.length,
      totalCount: items.length,
      items,
      funnelSteps,
      mvpItem,
      activeCategoryCounts,
      activeTagCounts,
      activeGateMap,
      archetype: Taxonomy ? Taxonomy.generateArchetype(items) : 'The Outlier'
    };
  }

  /**
   * Ghost-Cull Hover Preview: computes the exact population drop, survival ratio,
   * and bits delta if `candidateTrait` were appended to the current stack right now.
   */
  function previewCandidate(currentStackTraits, candidateTrait) {
    if (!candidateTrait) return null;
    const baseEval = evaluateStack(currentStackTraits || []);
    const nextEval = evaluateStack([...(currentStackTraits || []), candidateTrait]);

    const survivalRatio =
      baseEval.displayPopulation > 0
        ? Math.max(0, Math.min(1, nextEval.displayPopulation / baseEval.displayPopulation))
        : 1;
    const eliminatedRatio = 1 - survivalRatio;
    const deltaPeople = Math.max(0, baseEval.displayPopulation - nextEval.displayPopulation);
    const deltaBits = Math.max(0, nextEval.bitsRaw - baseEval.bitsRaw);

    const lastItem = nextEval.items[nextEval.items.length - 1];

    return {
      beforePopulation: baseEval.displayPopulation,
      afterPopulation: nextEval.displayPopulation,
      deltaPeople,
      deltaBits,
      survivalRatio,
      eliminatedRatio,
      pBase: lastItem ? lastItem.pBase : candidateTrait.prevalence,
      pEff: lastItem ? lastItem.pEff : candidateTrait.prevalence,
      wasDampened: Boolean(lastItem && lastItem.wasDampened),
      dampenMode: lastItem ? lastItem.dampenMode : null,
      geoSourceLabel: lastItem ? lastItem.geoSourceLabel : null,
      sharedWith: lastItem ? lastItem.sharedWith : [],
      repeatGates: lastItem ? lastItem.repeatGates : [],
      overlapSnark: lastItem ? lastItem.overlapSnark : null,
      superseded: Boolean(lastItem && lastItem.superseded),
      overlapCount: lastItem ? lastItem.overlapCount : 0,
      wouldTriggerOneOfOne: !baseEval.isOneOfOne && nextEval.isOneOfOne
    };
  }

  function formatOneIn(p) {
    const prob = Math.max(1e-9, Math.min(0.999, Number(p) || 0.1));
    const oneIn = Math.max(1, Math.round(1 / prob));
    if (oneIn >= 1000000) {
      return '1 in ' + (oneIn / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    return '1 in ' + oneIn.toLocaleString('en-US');
  }

  /**
   * Generates transparent, lightly snarky UI overlap commentary explaining why
   * correlated traits or shared demographic gates yield fewer marginal Shannon bits.
   */
  function buildOverlapSnark(info, trait) {
    if (!info || !info.wasDampened) return null;
    const rawStr = formatOneIn(info.pBase);
    const adjStr = formatOneIn(info.pEff);
    const prefix = 'Raw rarity: ' + rawStr + '. Adjusted impact: ' + adjStr + ' — ';

    if (info.dampenMode === 'geo_bayes' && info.geoSourceLabel) {
      return (
        prefix +
        'conditioned on ' +
        info.geoSourceLabel +
        ', nearly everyone in this slice already clears that bar.'
      );
    }

    if (info.sharedWith && info.sharedWith.length > 0) {
      const prev = info.sharedWith[0];
      const aName = String(prev.label || 'your earlier pick').toLowerCase();
      const bName = String((trait && (trait.shortBadge || trait.label)) || 'this trait').toLowerCase();
      const sharedTags = prev.tags || [];

      if (
        sharedTags.includes('tactile_analog_ritual') ||
        sharedTags.includes('vintage_gear') ||
        sharedTags.includes('collectors')
      ) {
        return prefix + 'turns out "' + aName + '" and "' + bName + '" are basically a single Venn circle.';
      }
      if (sharedTags.includes('quant_systemizer')) {
        return (
          prefix +
          '"' +
          aName +
          '" and "' +
          bName +
          '" run on the exact same spreadsheet-brained operating system.'
        );
      }
      if (sharedTags.includes('gear_optimizer')) {
        return (
          prefix +
          '"' +
          aName +
          '" and "' +
          bName +
          '" shop in the exact same late-night spec-sheet rabbit hole.'
        );
      }
      if (sharedTags.includes('thrill_risk')) {
        return (
          prefix +
          '"' +
          aName +
          '" and "' +
          bName +
          '" are wired to the exact same adrenaline receptor.'
        );
      }
      return prefix + 'turns out "' + aName + '" and "' + bName + '" overlap heavily in the wild.';
    }

    if (info.repeatGates && info.repeatGates.length > 0) {
      const topGate = info.repeatGates.slice().sort((a, b) => b.bits - a.bits)[0];
      const byWho = String(topGate.claimedBy || 'an earlier trait').toLowerCase();
      if (topGate.id === 'yard_homeowner_space') {
        return prefix + '"' + byWho + '" already filtered down to folks with backyard or garage space.';
      }
      if (topGate.id === 'euro_western_skew') {
        return prefix + '"' + byWho + '" already tilted the map into Western demographics.';
      }
      if (topGate.id === 'connected_urban_affluent') {
        return prefix + '"' + byWho + '" already paid the discretionary-time & Wi-Fi gate.';
      }
      return prefix + 'global infants and young kids were already ruled out by "' + byWho + '."';
    }

    return prefix + 'shared lifestyle overlap trimmed the duplicate bits.';
  }

  function formatCompactCount(n) {
    const val = Math.round(Number(n) || 0);
    if (val >= 1e9) {
      const b = val / 1e9;
      return (b >= 10 ? b.toFixed(1) : b.toFixed(2)).replace(/\.00$/, '') + 'B';
    }
    if (val >= 1e6) {
      const m = val / 1e6;
      return (m >= 100 ? m.toFixed(0) : m >= 10 ? m.toFixed(1) : m.toFixed(2)).replace(/\.0+$/, '') + 'M';
    }
    if (val >= 1e4) {
      const k = val / 1e3;
      return (k >= 100 ? k.toFixed(0) : k.toFixed(1)).replace(/\.0$/, '') + 'K';
    }
    return val.toLocaleString('en-US');
  }

  function formatExactCount(n) {
    return Math.max(1, Math.round(Number(n) || 0)).toLocaleString('en-US');
  }

  function formatPrevalencePercent(p) {
    const pct = (Number(p) || 0) * 100;
    if (pct >= 10) return '~' + (pct % 1 < 0.15 ? Math.round(pct) : pct.toFixed(1)) + '%';
    if (pct >= 1) return '~' + pct.toFixed(1).replace(/\.0$/, '') + '%';
    if (pct >= 0.1) return '~' + pct.toFixed(2).replace(/0$/, '') + '%';
    if (pct >= 0.01) return '~' + pct.toFixed(3).replace(/0+$/, '') + '%';
    if (pct >= 0.001) return '~' + pct.toFixed(4).replace(/0+$/, '') + '%';
    return '<0.001%';
  }

  return {
    WORLD_POPULATION,
    MAX_BITS,
    GAMMA,
    GATE_ALPHA,
    ONE_OF_ONE_THRESHOLD,
    DEFAULT_MIN_PREVALENCE,
    EXTREME_RARITY_MIN_PREVALENCE,
    clampPrevalence,
    doesSubsume,
    computeClusterOverlap,
    computeGeoBayesConditioning,
    computeEffectivePrevalence,
    expectedToDisplayPopulation,
    evaluateStack,
    previewCandidate,
    formatOneIn,
    buildOverlapSnark,
    formatCompactCount,
    formatExactCount,
    formatPrevalencePercent
  };
});
