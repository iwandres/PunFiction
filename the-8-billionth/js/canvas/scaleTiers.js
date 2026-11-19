/**
 * The 8.3 Billionth — 5-Tier Multi-Scale ("Powers of Ten") Camera & Spatial Layout Math
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthScaleTiers = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~2.399963 rad

  const TIERS = Object.freeze([
    {
      index: 1,
      id: 'planetary',
      name: 'Planetary',
      minPop: 10000000,
      maxPop: 8300000000,
      scaleRatio: 1000000,
      legendText: '1 dot = 1,000,000 people',
      shortScale: '1M / dot',
      renderMode: 'micro_dot'
    },
    {
      index: 2,
      id: 'metropolis',
      name: 'Metropolis',
      minPop: 10000,
      maxPop: 9999999,
      scaleRatio: 1000,
      legendText: '1 dot = 1,000 people',
      shortScale: '1,000 / dot',
      renderMode: 'fine_dot'
    },
    {
      index: 3,
      id: 'stadium',
      name: 'Stadium',
      minPop: 250,
      maxPop: 9999,
      scaleRatio: 1,
      legendText: '1 dot = 1 actual human',
      shortScale: '1 human / dot',
      renderMode: 'person_dot'
    },
    {
      index: 4,
      id: 'the_room',
      name: 'The Room',
      minPop: 2,
      maxPop: 249,
      scaleRatio: 1,
      legendText: '1 silhouette = 1 person',
      shortScale: '1 silhouette = 1 human',
      renderMode: 'silhouette'
    },
    {
      index: 5,
      id: 'singular',
      name: 'Singular',
      minPop: 1,
      maxPop: 1,
      scaleRatio: 1,
      legendText: '1 spotlight = You (1 of 1)',
      shortScale: 'You · 1 of 1',
      renderMode: 'spotlight'
    }
  ]);

  /**
   * Resolves the active tier and exact target canvas particle count for a given display population.
   */
  function resolveTierState(displayPopulation, isOneOfOne) {
    if (isOneOfOne || displayPopulation <= 1) {
      return {
        tier: TIERS[4],
        activeDots: 1
      };
    }

    const pop = Math.max(2, Math.round(Number(displayPopulation) || 8300000000));

    if (pop >= 10000000) {
      return {
        tier: TIERS[0],
        activeDots: Math.min(8300, Math.max(10, Math.round(pop / 1000000)))
      };
    }
    if (pop >= 10000) {
      return {
        tier: TIERS[1],
        activeDots: Math.min(9999, Math.max(10, Math.round(pop / 1000)))
      };
    }
    if (pop >= 250) {
      return {
        tier: TIERS[2],
        activeDots: Math.min(9999, pop)
      };
    }
    return {
      tier: TIERS[3],
      activeDots: Math.max(2, pop)
    };
  }

  /**
   * Returns the normalized (0..1) outer radius of the circular dot/silhouette cluster
   * so perspective outlines can frame the circular crowd proportionally.
   */
  function getClusterRadiusNormalized(count, tierIndex) {
    if (count <= 1 || tierIndex === 5) {
      return 0.36;
    }
    if (tierIndex === 4) {
      if (count === 2) return 0.30;
      let tempPlaced = 1;
      let totalRings = 0;
      while (tempPlaced < count) {
        totalRings += 1;
        tempPlaced += 6 * totalRings;
      }
      return Math.min(0.86, 0.22 + totalRings * 0.11);
    }
    const maxCap = tierIndex === 1 ? 8300 : 9999;
    const fillFraction = Math.max(0.008, Math.min(1, count / maxCap));
    return 0.28 + 0.64 * Math.pow(fillFraction, 0.28);
  }

  /**
   * Computes normalized (-1..+1) target coordinates for `count` surviving entities:
   * - Tiers 1..3 (>= 250): Golden-angle Vogel spiral disk that gently tightens as count shrinks
   * - Tier 4 (2..249): Concentric amphitheater rings with crisp spacing for human silhouettes
   * - Tier 5 (1): Dead-center spotlight (0, 0)
   */
  function computeTargetsNormalized(count, tierIndex, outX, outY) {
    if (count <= 1 || tierIndex === 5) {
      outX[0] = 0;
      outY[0] = 0;
      return;
    }

    if (tierIndex === 4) {
      // Concentric amphitheater rings for 2..249 silhouettes
      if (count === 2) {
        outX[0] = -0.22;
        outY[0] = 0;
        outX[1] = 0.22;
        outY[1] = 0;
        return;
      }

      // Place index 0 ("You") near center, surround with concentric rings
      outX[0] = 0;
      outY[0] = 0;
      let placed = 1;
      let ring = 1;

      // Estimate total rings first so outer radius fits nicely inside [-0.86, +0.86]
      let tempPlaced = 1;
      let totalRings = 0;
      while (tempPlaced < count) {
        totalRings += 1;
        tempPlaced += 6 * totalRings;
      }

      const maxRadius = Math.min(0.86, 0.22 + totalRings * 0.11);

      while (placed < count) {
        const capacity = 6 * ring;
        const inThisRing = Math.min(capacity, count - placed);
        const r = (ring / Math.max(1, totalRings)) * maxRadius;
        const phaseOffset = (ring % 2) * (Math.PI / inThisRing);

        for (let k = 0; k < inThisRing; k++) {
          const angle = phaseOffset + (k / inThisRing) * Math.PI * 2 - Math.PI / 2;
          outX[placed] = Math.cos(angle) * r;
          outY[placed] = Math.sin(angle) * r;
          placed += 1;
        }
        ring += 1;
      }
      return;
    }

    // Tiers 1..3: Golden-angle phyllotaxis spiral
    // Radius scales smoothly with count so culling visibly pulls the surviving cluster inward,
    // while keeping enough breathing room to distinguish individual dots.
    const envelopeRadius = getClusterRadiusNormalized(count, tierIndex);

    for (let i = 0; i < count; i++) {
      // Index 0 sits dead-center ("You"), higher indices spiral outward
      const normIdx = (i + 0.5) / count;
      const r = Math.sqrt(normIdx) * envelopeRadius;
      const theta = i * GOLDEN_ANGLE;
      outX[i] = Math.cos(theta) * r;
      outY[i] = Math.sin(theta) * r;
    }
  }

  return {
    GOLDEN_ANGLE,
    TIERS,
    resolveTierState,
    getClusterRadiusNormalized,
    computeTargetsNormalized
  };
});
