/**
 * The 8.3 Billionth — Probability, Cluster Dampening & Subsumption Math Engine
 *
 * Enforces:
 * 1. Expected population: E_k = N_0 * Product(p_eff(i))
 * 2. One-of-One threshold: E_k <= 1.49 (prevents premature round-down from 1.50..1.99)
 * 3. Cluster correlation dampening: p_eff(i) = p_base(i) ^ (gamma ^ m), gamma = 0.65
 *    where m is the count of prior active non-superseded traits sharing >= 1 closed clusterTag
 * 4. Parent-child subsumption & mutually-exclusive biological/geographic slots
 * 5. Exact Ghost-Cull Hover Preview matching post-click math
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
    if (trait.id) keys.add(String(trait.id));
    if (trait.canonicalSlug) keys.add(String(trait.canonicalSlug));
    return keys;
  }

  /**
   * Determines whether trait B strictly subsumes (supersedes) trait A.
   */
  function doesSubsume(traitB, traitA) {
    if (!traitB || !traitA || traitB === traitA) return false;
    const keysA = getTraitKeys(traitA);

    // 1. Explicit subsumes list on narrower trait B
    if (Array.isArray(traitB.subsumes)) {
      for (let i = 0; i < traitB.subsumes.length; i++) {
        if (keysA.has(String(traitB.subsumes[i]))) {
          return true;
        }
      }
    }

    // 2. Identical canonicalSlug (narrower or later duplicate wins)
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
   * Counts how many prior active traits share >= 1 closed clusterTag with candidateTrait,
   * and returns both overlapCount (m) and the overlapping trait summaries for UI inspection.
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
   * entropy bits, per-trait dampening telemetry, subsumption status, and MVP trait.
   */
  function evaluateStack(traits) {
    const rawList = Array.isArray(traits) ? traits.filter(Boolean) : [];
    const n = rawList.length;

    // Step 1: Resolve mutually exclusive single-value slots (e.g., blood_type, home_country)
    // Later selection supersedes earlier selection in the same exclusiveGroup.
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

    // Step 2: Resolve parent-child subsumption across all non-replaced traits
    for (let i = 0; i < n; i++) {
      if (supersededInfo[i]) continue;
      for (let j = 0; j < n; j++) {
        if (i === j || supersededInfo[j]) continue;
        // Avoid mutual loop if identical slugs: keep earlier unless j is strictly narrower
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

    // Step 3: Sequential Bayesian / gamma-dampened evaluation over non-superseded traits
    let cumulativeProduct = 1.0;
    let currentExpected = WORLD_POPULATION;
    let currentDisplayPop = WORLD_POPULATION;
    const priorActive = [];
    const items = [];
    const funnelSteps = [
      {
        step: 0,
        label: 'All Living Humans',
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
        : (trait.clusterTags || []).slice(0, 3);
      const pBase = clampPrevalence(trait.prevalence, Boolean(trait.isVerifiedExtremeRarity));

      if (supersededInfo[i]) {
        items.push({
          index: i,
          trait,
          sanitizedTags,
          superseded: true,
          supersededBy: supersededInfo[i].byLabel,
          supersededReason: supersededInfo[i].reason,
          pBase,
          pEff: 1.0,
          overlapCount: 0,
          sharedWith: [],
          wasDampened: false,
          bitsAdded: 0,
          populationBefore: currentDisplayPop,
          populationAfter: currentDisplayPop,
          peopleEliminated: 0
        });
        continue;
      }

      const { overlapCount, sharedWith } = computeClusterOverlap(priorActive, {
        clusterTags: sanitizedTags
      });
      const pEff = computeEffectivePrevalence(pBase, overlapCount);
      const bitsAdded = -Math.log2(pEff);

      const popBefore = currentDisplayPop;
      cumulativeProduct *= pEff;
      currentExpected = WORLD_POPULATION * cumulativeProduct;
      const popAfter = expectedToDisplayPopulation(currentExpected);

      const evaluatedItem = {
        index: i,
        trait,
        sanitizedTags,
        superseded: false,
        supersededBy: null,
        supersededReason: null,
        pBase,
        pEff,
        overlapCount,
        sharedWith,
        wasDampened: overlapCount > 0,
        bitsAdded,
        populationBefore: popBefore,
        populationAfter: popAfter,
        peopleEliminated: Math.max(0, popBefore - popAfter)
      };

      items.push(evaluatedItem);
      priorActive.push(evaluatedItem);

      funnelSteps.push({
        step: priorActive.length,
        label: trait.shortBadge || trait.label,
        emoji: trait.emoji || '🔹',
        pBase,
        pEff,
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

    // Identify Fermi MVP trait (single biggest bitsAdded cut)
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
      overlapCount: lastItem ? lastItem.overlapCount : 0,
      wouldTriggerOneOfOne: !baseEval.isOneOfOne && nextEval.isOneOfOne
    };
  }

  /**
   * Human-readable compact formatting utilities for counters, deltas, and prevalence pills.
   */
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
    ONE_OF_ONE_THRESHOLD,
    DEFAULT_MIN_PREVALENCE,
    EXTREME_RARITY_MIN_PREVALENCE,
    clampPrevalence,
    doesSubsume,
    computeClusterOverlap,
    computeEffectivePrevalence,
    expectedToDisplayPopulation,
    evaluateStack,
    previewCandidate,
    formatCompactCount,
    formatExactCount,
    formatPrevalencePercent
  };
});
