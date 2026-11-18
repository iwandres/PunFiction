/**
 * The 8.3 Billionth — 3-Phase Entropy-Aware Adaptive Suggestion Deck
 *
 * Phases:
 *  1. Opening (N_k > 50M): Relatable broad/mid splitters (5%..35%), icebreakers + 1 wildcard + parametric slot
 *  2. Midgame (50M down to 5,000): Uncorrelated categories & zero-overlap clusterTags prioritized
 *  3. Endgame Sniper (< 5,000): High-entropy niche splitters (0.04%..5%) + free-text omnibox callout
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthSuggestions = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function getPhase(displayPopulation, isOneOfOne) {
    if (isOneOfOne || displayPopulation <= 1) return 'complete';
    if (displayPopulation > 50000000) return 'opening';
    if (displayPopulation >= 5000) return 'midgame';
    return 'sniper';
  }

  function deterministicJitter(slug, seed) {
    let h = (seed * 2654435761) >>> 0;
    const s = String(slug || '');
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 1597334677) >>> 0;
    }
    return (h >>> 0) / 4294967296;
  }

  /**
   * Builds a curated hand of suggestion items (traits + optional parametric picker card)
   * tailored to the user's current population phase, category filter, and shuffle seed.
   */
  function buildSuggestionDeck({
    coreTraits,
    generators,
    evalState,
    categoryFilter = 'all',
    shuffleSeed = 1,
    deckSize = 7
  }) {
    const pop = evalState ? evalState.displayPopulation : 8300000000;
    const isOneOfOne = Boolean(evalState && evalState.isOneOfOne);
    const phase = getPhase(pop, isOneOfOne);

    const activeSlugs = new Set();
    const activeExclusiveGroups = new Set();
    if (evalState && Array.isArray(evalState.items)) {
      for (let i = 0; i < evalState.items.length; i++) {
        const t = evalState.items[i].trait;
        if (t.canonicalSlug) activeSlugs.add(t.canonicalSlug);
        if (t.id) activeSlugs.add(t.id);
        if (!evalState.items[i].superseded && t.exclusiveGroup) {
          activeExclusiveGroups.add(t.exclusiveGroup);
        }
        // Also avoid suggesting broader parents already subsumed by an active trait
        if (Array.isArray(t.subsumes)) {
          for (let s = 0; s < t.subsumes.length; s++) {
            activeSlugs.add(t.subsumes[s]);
          }
        }
      }
    }

    const catCounts = (evalState && evalState.activeCategoryCounts) || {};
    const tagCounts = (evalState && evalState.activeTagCounts) || {};
    const activeCount = (evalState && evalState.activeCount) || 0;

    // Pick 1 contextual Parametric Picker card when in 'all' or matching category
    let parametricCard = null;
    if (Array.isArray(generators) && generators.length > 0 && phase !== 'sniper') {
      const eligibleGens = generators.filter((g) => {
        if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
        if (g.exclusiveGroup && activeExclusiveGroups.has(g.exclusiveGroup)) return false;
        return true;
      });
      if (eligibleGens.length > 0) {
        const pickIdx = Math.abs(shuffleSeed) % eligibleGens.length;
        parametricCard = eligibleGens[pickIdx];
      }
    }

    const targetTraitCount = parametricCard ? deckSize - 1 : deckSize;
    const candidates = [];

    for (let i = 0; i < coreTraits.length; i++) {
      const t = coreTraits[i];
      if (activeSlugs.has(t.canonicalSlug)) continue;
      if (t.isVerifiedExtremeRarity) continue; // Keep lightning strikes for search/omnibox rather than routine cards
      if (categoryFilter !== 'all' && t.category !== categoryFilter) continue;
      if (t.exclusiveGroup && activeExclusiveGroups.has(t.exclusiveGroup)) continue;

      const p = t.prevalence;
      const catTapCount = catCounts[t.category] || 0;

      // Count overlapping cluster tags
      let tagOverlap = 0;
      const tags = t.clusterTags || [];
      for (let k = 0; k < tags.length; k++) {
        if (tagCounts[tags[k]]) tagOverlap += 1;
      }

      let score = 0;

      if (phase === 'opening') {
        if (activeCount === 0 && t.icebreaker && shuffleSeed === 1 && categoryFilter === 'all') {
          score += 55;
        }
        // Sweet spot 4%..35% in opening
        if (p >= 0.04 && p <= 0.36) {
          score += 36;
        } else if (p >= 0.008 && p < 0.04) {
          score += 22;
        } else if (p > 0.36) {
          score += 14;
        } else {
          score += 10;
        }
        if (catTapCount >= 1) score -= 14 * catTapCount;
        if (tagOverlap > 0) score -= 12 * tagOverlap;
      } else if (phase === 'midgame') {
        // Hide categories tapped >= 2 times when viewing 'all'
        if (categoryFilter === 'all' && catTapCount >= 2) continue;

        // Sweet spot 0.25%..12% in midgame
        if (p >= 0.0025 && p <= 0.12) {
          score += 42;
        } else if (p >= 0.0005 && p < 0.0025) {
          score += 28;
        } else {
          score += 8;
        }
        if (catTapCount === 0) score += 18;
        if (tagOverlap === 0) score += 24;
        else score -= 18 * tagOverlap;
      } else {
        // Endgame Sniper (< 5,000 left): aim for crisp 0.02%..6% orthogonal splitters
        if (categoryFilter === 'all' && catTapCount >= 2) continue;
        if (p >= 0.0002 && p <= 0.06) {
          score += 48;
        } else if (p > 0.06 && p <= 0.18) {
          score += 24;
        } else {
          score += 10;
        }
        if (tagOverlap === 0) score += 28;
        else score -= 22 * tagOverlap;
      }

      // Add deterministic shuffle variance so clicking "Shuffle" deals a completely fresh hand
      score += deterministicJitter(t.canonicalSlug, shuffleSeed) * 34;

      candidates.push({ trait: t, score });
    }

    candidates.sort((a, b) => b.score - a.score);

    // Enforce category diversity within the dealt hand when viewing 'all'
    const selectedTraits = [];
    const handCatCounts = {};
    for (let i = 0; i < candidates.length && selectedTraits.length < targetTraitCount; i++) {
      const cand = candidates[i].trait;
      if (categoryFilter === 'all') {
        const seenInHand = handCatCounts[cand.category] || 0;
        if (seenInHand >= 2) continue;
        handCatCounts[cand.category] = seenInHand + 1;
      }
      selectedTraits.push(cand);
    }

    // Backfill if strict filter left slots open
    if (selectedTraits.length < targetTraitCount) {
      const pickedSet = new Set(selectedTraits.map((x) => x.canonicalSlug));
      for (let i = 0; i < candidates.length && selectedTraits.length < targetTraitCount; i++) {
        const cand = candidates[i].trait;
        if (!pickedSet.has(cand.canonicalSlug)) {
          selectedTraits.push(cand);
          pickedSet.add(cand.canonicalSlug);
        }
      }
    }

    // In Opening phase, ensure at least 1 spicy sub-1% wildcard in slotLast if all picks were broad
    if (
      phase === 'opening' &&
      selectedTraits.length >= 4 &&
      selectedTraits.every((t) => t.prevalence > 0.03)
    ) {
      const wildcard = candidates.find(
        (c) =>
          c.trait.prevalence <= 0.008 &&
          !selectedTraits.some((s) => s.canonicalSlug === c.trait.canonicalSlug)
      );
      if (wildcard) {
        selectedTraits[selectedTraits.length - 1] = wildcard.trait;
      }
    }

    return {
      phase,
      traits: selectedTraits,
      parametricCard
    };
  }

  return {
    getPhase,
    buildSuggestionDeck
  };
});
