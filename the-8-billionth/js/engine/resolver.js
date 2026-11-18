/**
 * The 8.3 Billionth — 3-Layer Hybrid Attribute Resolver
 * Layer 1: Curated static traits (`traits-core.json`)
 * Layer 2: Parametric generators (`traits-parametric.json`)
 * Layer 3: Serverless Gemini Fermi Estimator (`POST /api/billionth/estimate-trait`) + Session Cache
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthResolver = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const API_ENDPOINT =
    (typeof window !== 'undefined' && window.BILLIONTH_API_URL) ||
    (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8000/api/billionth/estimate-trait'
      : 'https://punfiction.onrender.com/api/billionth/estimate-trait');

  const HEALTH_ENDPOINT = API_ENDPOINT.replace(/\/estimate-trait$/, '/health');

  function normalizeSearch(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[\u2212\u2013\u2014]/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9+#\-\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  class TraitResolver {
    constructor() {
      this.coreTraits = [];
      this.generators = [];
      this.parametricTraits = [];
      this.allInstantTraits = [];
      this.bySlug = new Map();
      this.customSessionCache = new Map();
      this.loaded = false;
    }

    initFromData(coreDoc, paramDoc) {
      this.coreTraits = ((coreDoc && coreDoc.traits) || []).map((t) => {
        const searchBlob = normalizeSearch(
          [t.label, t.shortBadge, ...(t.aliases || [])].join(' | ')
        );
        return Object.assign({}, t, {
          sourceLayer: 1,
          _normLabel: normalizeSearch(t.label),
          _normBadge: normalizeSearch(t.shortBadge),
          _normAliases: (t.aliases || []).map(normalizeSearch),
          _searchBlob: searchBlob
        });
      });

      this.generators = ((paramDoc && paramDoc.generators) || []).map((gen) => {
        const expandedOptions = (gen.options || []).map((opt) => {
          const fullTrait = {
            id: opt.canonicalSlug,
            canonicalSlug: opt.canonicalSlug,
            label: opt.label,
            shortBadge: opt.shortBadge,
            emoji: opt.emoji || gen.emoji || '🔹',
            category: gen.category,
            prevalence: opt.prevalence,
            clusterTags: opt.clusterTags || gen.clusterTags || ['indoor_hobby'],
            snarkNote: opt.snarkNote || '',
            subsumes: opt.subsumes || [],
            cond: opt.cond || null,
            exclusiveGroup: gen.exclusiveGroup || opt.exclusiveGroup || null,
            generatorId: gen.id,
            optionKey: opt.key,
            sourceLayer: 2,
            _normLabel: normalizeSearch(opt.label),
            _normBadge: normalizeSearch(opt.shortBadge),
            _normAliases: (gen.searchTriggers || []).map(normalizeSearch),
            _searchBlob: normalizeSearch(
              [opt.label, opt.shortBadge, gen.title, ...(gen.searchTriggers || [])].join(' | ')
            )
          };
          return fullTrait;
        });
        return Object.assign({}, gen, { expandedOptions });
      });

      this.parametricTraits = [];
      for (let i = 0; i < this.generators.length; i++) {
        const opts = this.generators[i].expandedOptions;
        for (let j = 0; j < opts.length; j++) {
          this.parametricTraits.push(opts[j]);
        }
      }

      this.allInstantTraits = [...this.coreTraits, ...this.parametricTraits];
      this.bySlug.clear();
      for (let i = 0; i < this.allInstantTraits.length; i++) {
        const t = this.allInstantTraits[i];
        this.bySlug.set(t.canonicalSlug, t);
      }
      this.loaded = true;
    }

    async loadSeedFiles(baseUrl = 'data/') {
      const [coreResp, paramResp] = await Promise.all([
        fetch(baseUrl + 'traits-core.json'),
        fetch(baseUrl + 'traits-parametric.json')
      ]);
      if (!coreResp.ok || !paramResp.ok) {
        throw new Error('Failed to load static trait taxonomy JSON.');
      }
      const [coreDoc, paramDoc] = await Promise.all([coreResp.json(), paramResp.json()]);
      this.initFromData(coreDoc, paramDoc);
      return this;
    }

    getTraitBySlug(slug) {
      return this.bySlug.get(slug) || null;
    }

    getGeneratorById(genId) {
      return this.generators.find((g) => g.id === genId) || null;
    }

    /**
     * Instant (<1ms) ranked fuzzy search across all curated + parametric traits.
     */
    searchInstant(rawQuery, activeSlugSet, limit = 5) {
      const q = normalizeSearch(rawQuery);
      if (!q || q.length < 2) return [];

      // Strip leading filler ("i ", "i am ", "i have ", "my ") for cleaner keyword scoring
      const stripped = q
        .replace(/^(?:i\s+am\s+a\s+|i\s+am\s+an\s+|i\s+am\s+|im\s+|i\s+have\s+a\s+|i\s+have\s+|ive\s+|i\s+|my\s+)/, '')
        .trim();
      const needle = stripped.length >= 2 ? stripped : q;
      const tokens = needle.split(' ').filter((w) => w.length >= 2);

      const scored = [];
      const blocked = activeSlugSet || new Set();

      for (let i = 0; i < this.allInstantTraits.length; i++) {
        const t = this.allInstantTraits[i];
        if (blocked.has(t.canonicalSlug)) continue;

        let score = 0;

        if (t._normLabel === q || t._normBadge === needle) {
          score = 120;
        } else if (t._normAliases.some((a) => a === needle || a === q)) {
          score = 110;
        } else if (t._normBadge.startsWith(needle) || t._normLabel.includes(' ' + needle)) {
          score = 88;
        } else if (t._normAliases.some((a) => a.startsWith(needle))) {
          score = 82;
        } else if (tokens.length > 0 && tokens.every((tok) => t._searchBlob.includes(tok))) {
          score = 62 + Math.min(18, tokens.length * 5);
        } else if (needle.length >= 3 && t._searchBlob.includes(needle)) {
          score = 48;
        }

        if (score > 0) {
          // Slight tie-breaker preference for Layer 1 curated traits with handcrafted snark
          if (t.sourceLayer === 1) score += 3;
          scored.push({ trait: t, score });
        }
      }

      scored.sort((a, b) => b.score - a.score || a.trait.prevalence - b.trait.prevalence);
      return scored.slice(0, limit).map((s) => s.trait);
    }

    /**
     * Silently wakes the Render Python backend on initial page load so custom lookups are warm.
     */
    prewarmApi() {
      if (typeof fetch !== 'function' || typeof window === 'undefined') return;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
      }
      fetch(HEALTH_ENDPOINT, { method: 'GET', mode: 'cors' }).catch(() => {});
    }

    /**
     * Layer 3: Calls the PunFiction Render Gemini Estimator (passing activeTraits for custom subsumption).
     */
    async estimateCustomFact(rawInput, activeSlugs = [], activeTraits = []) {
      const cleanText = String(rawInput || '').trim();
      const cacheKey =
        normalizeSearch(cleanText) + '::' + (activeSlugs || []).slice().sort().join(',');
      if (cacheKey && this.customSessionCache.has(cacheKey)) {
        return this.customSessionCache.get(cacheKey);
      }

      const payloadStr = JSON.stringify({
        rawInput: cleanText,
        activeSlugs,
        activeTraits
      });

      let resp = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadStr
      });

      // Automatic 1-shot retry if Render container is mid-wakeup / rolling deploy (502/503/504)
      if (resp.status === 502 || resp.status === 503 || resp.status === 504) {
        await new Promise((r) => setTimeout(r, 1800));
        resp = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payloadStr
        });
      }

      const rawBody = await resp.text();
      let data = null;
      try {
        data = JSON.parse(rawBody);
      } catch (_) {
        if (resp.status === 404 || resp.status >= 500) {
          throw new Error(
            'Custom trait server is finishing a live update (HTTP ' +
              resp.status +
              ') — give it ~30 seconds and press Enter again!'
          );
        }
        throw new Error('Unexpected response from custom trait estimator — please try again in a moment.');
      }

      if (!resp.ok && data && data.error) {
        throw new Error(data.error);
      }

      if (data && data.status === 'accepted' && data.trait) {
        this.bySlug.set(data.trait.canonicalSlug, Object.assign({ fermi: data.fermi }, data.trait));
        if (cacheKey) {
          this.customSessionCache.set(cacheKey, data);
        }
      }

      return data;
    }
  }

  return TraitResolver;
});
