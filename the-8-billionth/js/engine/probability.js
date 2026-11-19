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

  // Descriptive archetype tags & pure demographic partitions that do NOT imply lifestyle covariance
  const NON_OVERLAP_CLUSTER_TAGS = new Set(['genetic_quirk']);
  const ORTHOGONAL_PARTITION_GENERATORS = new Set([
    'home_country',
    'birth_month',
    'birth_decade',
    'blood_type',
    'height_bracket'
  ]);

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

  function isOrthogonalPartitionTrait(trait) {
    if (!trait) return false;
    if (trait.noClusterOverlap) return true;
    if (trait.generatorId && ORTHOGONAL_PARTITION_GENERATORS.has(trait.generatorId)) return true;
    const slug = String(trait.canonicalSlug || '');
    return (
      slug.startsWith('lives_in_') ||
      slug.startsWith('born_month_') ||
      slug.startsWith('born_decade_') ||
      slug.startsWith('blood_') ||
      slug.startsWith('height_')
    );
  }

  function isIndividualLanguageTrait(trait) {
    if (!trait) return false;
    if (trait.generatorId === 'speaks_language') return true;
    const slug = String(trait.canonicalSlug || '');
    return slug.startsWith('speaks_') && !slug.includes('plus_languages');
  }

  /**
   * Determines whether two traits are logically contradictory (mutually exclusive).
   */
  function doesConflict(traitA, traitB) {
    if (!traitA || !traitB || traitA === traitB) return false;
    if (traitA.exclusiveGroup && traitA.exclusiveGroup === traitB.exclusiveGroup) {
      return true;
    }
    const keysA = getTraitKeys(traitA);
    const keysB = getTraitKeys(traitB);
    if (Array.isArray(traitA.conflictsWith)) {
      for (let i = 0; i < traitA.conflictsWith.length; i++) {
        if (keysB.has(String(traitA.conflictsWith[i]))) return true;
      }
    }
    if (Array.isArray(traitB.conflictsWith)) {
      for (let i = 0; i < traitB.conflictsWith.length; i++) {
        if (keysA.has(String(traitB.conflictsWith[i]))) return true;
      }
    }
    return false;
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
   * Counts how many prior active traits share >= 1 lifestyle/psychographic clusterTag with candidateTrait,
   * returning prior base bits so mutual-information overlap obeys Bayes symmetry & Frechet bounds.
   */
  function computeClusterOverlap(priorEvaluatedActive, candidateTrait) {
    if (!candidateTrait || isOrthogonalPartitionTrait(candidateTrait) || priorEvaluatedActive.length === 0) {
      return { overlapCount: 0, sharedWith: [], priorOverlapBits: [] };
    }

    const rawTags = Taxonomy
      ? Taxonomy.sanitizeClusterTags(candidateTrait.clusterTags)
      : candidateTrait.clusterTags || [];
    const candidateTags = new Set(rawTags.filter((t) => !NON_OVERLAP_CLUSTER_TAGS.has(t)));

    if (candidateTags.size === 0) {
      return { overlapCount: 0, sharedWith: [], priorOverlapBits: [] };
    }

    let overlapCount = 0;
    const sharedWith = [];
    const priorOverlapBits = [];

    for (let i = 0; i < priorEvaluatedActive.length; i++) {
      const prev = priorEvaluatedActive[i];
      if (isOrthogonalPartitionTrait(prev.trait)) continue;
      const prevTags = prev.sanitizedTags || [];
      const matchingTags = [];
      for (let j = 0; j < prevTags.length; j++) {
        const tag = prevTags[j];
        if (!NON_OVERLAP_CLUSTER_TAGS.has(tag) && candidateTags.has(tag)) {
          matchingTags.push(tag);
        }
      }
      if (matchingTags.length > 0) {
        overlapCount += 1;
        priorOverlapBits.push(-Math.log2(prev.pBase));
        sharedWith.push({
          label: prev.trait.shortBadge || prev.trait.label,
          canonicalSlug: prev.trait.canonicalSlug || prev.trait.id,
          tags: matchingTags
        });
      }
    }

    priorOverlapBits.sort((a, b) => b - a);
    return { overlapCount, sharedWith, priorOverlapBits };
  }

  /**
   * Bayes-symmetric power-law cluster dampening (gamma = 0.65):
   *   Delta I = b_cand - sum_{r=1..m} gamma^{r-1} * (1 - gamma) * min(b_cand, b_prior_(r))
   * Reduces identically to p_base^(gamma^m) when candidate is at least as broad as priors,
   * while enforcing exact k!-permutation symmetry and Frechet validity P(A n B) <= min(P(A), P(B))
   * when a rarer trait follows a broader trait.
   */
  function computeEffectivePrevalence(pBase, overlapCount, priorOverlapBits) {
    if (overlapCount <= 0) return pBase;
    if (!Array.isArray(priorOverlapBits) || priorOverlapBits.length === 0) {
      return Math.pow(pBase, Math.pow(GAMMA, overlapCount));
    }
    const bCand = -Math.log2(pBase);
    let bitDeduction = 0;
    for (let r = 0; r < priorOverlapBits.length; r++) {
      const sharedCap = Math.min(bCand, priorOverlapBits[r]);
      bitDeduction += Math.pow(GAMMA, r) * (1 - GAMMA) * sharedCap;
    }
    const bEff = Math.max(bCand * Math.pow(GAMMA, overlapCount), bCand - bitDeduction);
    return Math.min(0.999, Math.pow(2, -bEff));
  }

  /**
   * Standalone joint product of a small subset of traits (used when reverse-conditioning
   * a country on 2+ already-selected languages/geo traits for exact Naive Bayes symmetry).
   */
  function computeStandaloneSubsetProduct(matchedItems) {
    if (matchedItems.length === 0) return 1.0;
    if (matchedItems.length === 1) return matchedItems[0].pBase;
    let prod = 1.0;
    const seen = [];
    for (let i = 0; i < matchedItems.length; i++) {
      const cur = matchedItems[i];
      const ov = computeClusterOverlap(seen, cur.trait);
      const pStep = computeEffectivePrevalence(cur.pBase, ov.overlapCount, ov.priorOverlapBits);
      prod *= pStep;
      seen.push(cur);
    }
    return prod;
  }

  /**
   * Evaluates exact bidirectional Bayes' Theorem geographic/linguistic/cultural conditioning
   * between prior active traits and candidateTrait (for both positive r > pBase and negative r < pBase):
   * - Forward: P(Candidate | Country) = r  (from Prior.cond[Candidate.slug])
   * - Reverse: P(Country | Targets) = P(Country) * prod(r_j) / P(Targets)  (from Candidate.cond[Prior.slug])
   */
  function computeGeoBayesConditioning(priorEvaluatedActive, candidateTrait, candidatePBase) {
    if (!candidateTrait || priorEvaluatedActive.length === 0) {
      return {
        geoRate: null,
        geoSourceLabel: null,
        geoSourceSlug: null,
        geoSourceGates: new Set(),
        geoMatchedItems: []
      };
    }

    const candKeys = Array.from(getTraitKeys(candidateTrait));
    const candCond = candidateTrait.cond && typeof candidateTrait.cond === 'object' ? candidateTrait.cond : null;

    // 1. Forward check: Prior.cond[candSlug] = P(Candidate | Prior)
    let forwardRate = null;
    let forwardLabel = null;
    let forwardSlug = null;
    let forwardGates = new Set();
    let forwardMatched = [];

    for (let i = 0; i < priorEvaluatedActive.length; i++) {
      const prev = priorEvaluatedActive[i];
      const prevTrait = prev.trait;
      if (prevTrait.cond && typeof prevTrait.cond === 'object') {
        for (let k = 0; k < candKeys.length; k++) {
          const r = Number(prevTrait.cond[candKeys[k]]);
          if (Number.isFinite(r) && r > 0 && r < 0.999) {
            forwardRate = r;
            forwardLabel = prevTrait.shortBadge || prevTrait.label;
            forwardSlug = prevTrait.canonicalSlug || prevTrait.id;
            forwardGates = new Set(prev.sanitizedGates || []);
            forwardMatched = [prev];
            break;
          }
        }
      }
    }

    if (forwardRate !== null) {
      return {
        geoRate: forwardRate,
        geoSourceLabel: forwardLabel,
        geoSourceSlug: forwardSlug,
        geoSourceGates: forwardGates,
        geoMatchedItems: forwardMatched
      };
    }

    // 2. Reverse Bayes check: Candidate.cond[prevSlug] = P(Prior_j | Candidate)
    if (candCond) {
      const matchedItems = [];
      let jointGivenCand = candidatePBase;
      const sourceLabels = [];
      const unionGates = new Set();

      for (let i = 0; i < priorEvaluatedActive.length; i++) {
        const prev = priorEvaluatedActive[i];
        const prevKeys = Array.from(getTraitKeys(prev.trait));
        for (let k = 0; k < prevKeys.length; k++) {
          const r = Number(candCond[prevKeys[k]]);
          if (Number.isFinite(r) && r > 0 && r < 0.999) {
            matchedItems.push(prev);
            jointGivenCand *= r;
            sourceLabels.push(prev.trait.shortBadge || prev.trait.label);
            (prev.sanitizedGates || []).forEach((g) => unionGates.add(g));
            break;
          }
        }
      }

      if (matchedItems.length > 0) {
        const denomProduct = computeStandaloneSubsetProduct(matchedItems);
        if (denomProduct > 0) {
          const bayesRate = Math.min(0.995, Math.max(1e-9, jointGivenCand / denomProduct));
          return {
            geoRate: bayesRate,
            geoSourceLabel: sourceLabels.join(' + '),
            geoSourceSlug: candidateTrait.canonicalSlug || candidateTrait.id,
            geoSourceGates: unionGates,
            geoMatchedItems: matchedItems
          };
        }
      }
    }

    return {
      geoRate: null,
      geoSourceLabel: null,
      geoSourceSlug: null,
      geoSourceGates: new Set(),
      geoMatchedItems: []
    };
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

    // Step 1: Mutually exclusive single-value slots & logical contradictions (later selection wins)
    const supersededInfo = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (doesConflict(rawList[i], rawList[j])) {
          supersededInfo[i] = {
            byLabel: rawList[j].shortBadge || rawList[j].label,
            bySlug: rawList[j].canonicalSlug || rawList[j].id,
            reason: 'replaced_exclusive'
          };
          break;
        }
      }
    }

    // Step 1B: Exact canonicalSlug deduplication across non-replaced traits
    for (let i = 0; i < n; i++) {
      if (supersededInfo[i]) continue;
      for (let j = i + 1; j < n; j++) {
        if (supersededInfo[j]) continue;
        if (rawList[i].canonicalSlug && rawList[i].canonicalSlug === rawList[j].canonicalSlug) {
          if ((rawList[j].prevalence || 1) < (rawList[i].prevalence || 1)) {
            supersededInfo[i] = {
              byLabel: rawList[j].shortBadge || rawList[j].label,
              bySlug: rawList[j].canonicalSlug || rawList[j].id,
              reason: 'duplicate'
            };
            break;
          } else {
            supersededInfo[j] = {
              byLabel: rawList[i].shortBadge || rawList[i].label,
              bySlug: rawList[i].canonicalSlug || rawList[i].id,
              reason: 'duplicate'
            };
          }
        }
      }
    }

    // Step 1C: Multi-language count subsumption (e.g. picking 2+ specific languages supersedes "Bilingual 2+")
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

    // Step 2: Parent-child & 100%-geo subsumption across all valid (non-conflict, non-duplicate) traits
    for (let i = 0; i < n; i++) {
      if (supersededInfo[i]) continue;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        if (
          supersededInfo[j] &&
          (supersededInfo[j].reason === 'replaced_exclusive' || supersededInfo[j].reason === 'duplicate')
        ) {
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

    // Step 3: Sequential Bayesian Geo/Language + Symmetric Pay-the-Gate-Once + Bayes-Symmetric gamma=0.65
    let cumulativeProduct = 1.0;
    let currentExpected = WORLD_POPULATION;
    let currentDisplayPop = WORLD_POPULATION;
    const priorActive = [];
    const claimedGates = new Map(); // gateId -> { label, maxCredit }
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

      const { overlapCount, sharedWith, priorOverlapBits } = computeClusterOverlap(
        priorActive,
        trait
      );
      const pCluster = computeEffectivePrevalence(pBase, overlapCount, priorOverlapBits);
      const bitsRawTrait = -Math.log2(pBase);
      const bitsCluster = -Math.log2(pCluster);
      const {
        geoRate,
        geoSourceLabel,
        geoSourceSlug,
        geoSourceGates,
        geoMatchedItems
      } = computeGeoBayesConditioning(priorActive, trait, pBase);

      // Compute symmetric Pay-the-Gate-Once repeat gate deductions
      // Cap total gate credit at max(0, 0.65*b - max(0.45, 0.22*b)) so cluster + gate never asymmetrically clips
      const traitTotalGateCap = Math.max(
        0,
        GAMMA * bitsRawTrait - Math.max(0.45, 0.22 * bitsRawTrait)
      );
      let nominalGateSum = 0;
      for (let g = 0; g < sanitizedGates.length; g++) {
        const meta =
          (Taxonomy && Taxonomy.BASE_GATE_META && Taxonomy.BASE_GATE_META[sanitizedGates[g]]) ||
          null;
        nominalGateSum += GATE_ALPHA * (meta ? meta.bits : 1.0);
      }
      const gateScale =
        nominalGateSum > traitTotalGateCap && nominalGateSum > 0
          ? traitTotalGateCap / nominalGateSum
          : 1.0;

      const repeatGates = [];
      let gateBitsDeduction = 0;

      for (let g = 0; g < sanitizedGates.length; g++) {
        const gId = sanitizedGates[g];
        if (claimedGates.has(gId)) {
          // If geo_bayes is active and the geoSource trait ALREADY carried this gate, do not double-deduct it
          if (geoRate !== null && geoSourceGates && geoSourceGates.has(gId)) {
            continue;
          }
          const priorGate = claimedGates.get(gId);
          const meta =
            (Taxonomy && Taxonomy.BASE_GATE_META && Taxonomy.BASE_GATE_META[gId]) || null;
          const gBits = meta ? meta.bits : 1.0;
          const myGateCredit = GATE_ALPHA * gBits * gateScale;
          const pairDeduction = Math.min(myGateCredit, priorGate.maxCredit);
          if (pairDeduction > 0) {
            gateBitsDeduction += pairDeduction;
            repeatGates.push({
              id: gId,
              label: meta ? meta.label : gId,
              bits: gBits,
              claimedBy: priorGate.label
            });
          }
        }
      }

      let pEff = pCluster;
      let dampenMode = overlapCount > 0 ? 'cluster' : null;
      let activeGeoSource = null;
      let activeGeoSourceSlug = null;

      if (geoRate !== null) {
        // Account for any cluster overlap with prior traits NOT governed by the same country/geo conditional table
        let nonGeoClusterDeduction = 0;
        if (overlapCount > 0) {
          const matchedSet = new Set(geoMatchedItems || []);
          const anchorItem = priorActive.find(
            (pr) => (pr.trait.canonicalSlug || pr.trait.id) === geoSourceSlug
          );
          const anchorCond =
            (anchorItem && anchorItem.trait && anchorItem.trait.cond) ||
            (trait && trait.cond) ||
            null;
          const unconditionedPriors = priorActive.filter((pr) => {
            if (matchedSet.has(pr)) return false;
            const prSlug = pr.trait.canonicalSlug || pr.trait.id;
            if (anchorCond && anchorCond[prSlug] !== undefined) return false;
            return true;
          });
          if (unconditionedPriors.length > 0) {
            const nonGeoOv = computeClusterOverlap(unconditionedPriors, trait);
            for (let r = 0; r < nonGeoOv.priorOverlapBits.length; r++) {
              const sharedCap = Math.min(bitsRawTrait, nonGeoOv.priorOverlapBits[r]);
              nonGeoClusterDeduction += Math.pow(GAMMA, r) * (1 - GAMMA) * sharedCap;
            }
          }
        }

        // Exact empirical geo/linguistic Bayes rate (supports both positive coupling & minority-language rarity)
        const geoBitsRaw = -Math.log2(geoRate);
        const minGeoBits = Math.min(geoBitsRaw, Math.max(0.05, geoBitsRaw * 0.22));
        const totalGeoDeduction = gateBitsDeduction + nonGeoClusterDeduction;
        const geoBitsAdjusted =
          totalGeoDeduction > 0
            ? Math.max(minGeoBits, geoBitsRaw - totalGeoDeduction)
            : geoBitsRaw;
        pEff = Math.min(0.995, Math.max(1e-9, Math.pow(2, -geoBitsAdjusted)));
        dampenMode = 'geo_bayes';
        activeGeoSource = geoSourceLabel;
        activeGeoSourceSlug = geoSourceSlug;
      } else if (gateBitsDeduction > 0) {
        const minMarginalBits = Math.min(bitsCluster, Math.max(0.35, bitsCluster * 0.22));
        const bitsAfterGates = Math.max(minMarginalBits, bitsCluster - gateBitsDeduction);
        const pGateAdjusted = Math.min(0.985, Math.pow(2, -bitsAfterGates));
        if (pGateAdjusted > pEff) {
          pEff = pGateAdjusted;
          dampenMode = overlapCount > 0 ? 'cluster_and_gate' : 'base_gate';
        }
      }

      // Register / upgrade unlocked macro baseGates for subsequent traits in stack
      for (let g = 0; g < sanitizedGates.length; g++) {
        const gId = sanitizedGates[g];
        const meta =
          (Taxonomy && Taxonomy.BASE_GATE_META && Taxonomy.BASE_GATE_META[gId]) || null;
        const gBits = meta ? meta.bits : 1.0;
        const myGateCredit = GATE_ALPHA * gBits * gateScale;
        const badgeLabel = trait.shortBadge || trait.label;
        if (!claimedGates.has(gId)) {
          claimedGates.set(gId, { label: badgeLabel, maxCredit: myGateCredit });
        } else {
          const existing = claimedGates.get(gId);
          if (myGateCredit > existing.maxCredit) {
            claimedGates.set(gId, { label: badgeLabel, maxCredit: myGateCredit });
          }
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
        geoSourceSlug: activeGeoSourceSlug,
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
    claimedGates.forEach((entry, gId) => {
      activeGateMap[gId] = entry && entry.label ? entry.label : String(entry || '');
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
      if (info.pEff >= 0.55) {
        return (
          prefix +
          'conditioned on ' +
          info.geoSourceLabel +
          ', most people in this slice already clear that bar.'
        );
      }
      return (
        prefix +
        'conditioned on ' +
        info.geoSourceLabel +
        ', this trait is far more concentrated here than globally.'
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
    doesConflict,
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
