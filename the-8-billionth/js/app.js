/**
 * The 8.3 Billionth — Main Client Application Controller
 * Coordinates:
 * - 3-Layer Trait Resolution (Curated JSON + Parametric Generators + Render Gemini API)
 * - Probability, Correlation Dampening (gamma = 0.65) & Subsumption Math
 * - 5-Tier 60fps HTML5 Crowd Canvas + Ghost-Cull Hover Previews
 * - Adaptive 3-Phase Suggestion Deck + Fermi & Correlation Inspector Popover
 * - One-of-One Specimen Dossier Reveal, Text Receipt & 1080x1350 PNG Specimen Card
 */
(function () {
  'use strict';

  const Taxonomy = window.BillionthTaxonomy;
  const Probability = window.BillionthProbability;
  const Analogies = window.BillionthAnalogies;
  const TraitResolver = window.BillionthResolver;
  const Suggestions = window.BillionthSuggestions;
  const ScaleTiers = window.BillionthScaleTiers;
  const ScaleOutlines = window.BillionthScaleOutlines;
  const CrowdRenderer = window.BillionthCrowdRenderer;
  const OmniboxController = window.BillionthOmnibox;
  const ReceiptModal = window.BillionthReceiptModal;

  // Application State
  const state = {
    stack: [],
    evalResult: Probability.evaluateStack([]),
    lastAddedTrait: null,
    selectedCategory: 'all',
    shuffleSeed: 1,
    outlineRunSeed: 0,
    inspectedIndex: null,
    displayedCounterPop: 8300000000,
    counterRafId: null,
    dossierTimer: null
  };

  // DOM Elements
  const dom = {
    canvas: document.getElementById('crowd-canvas'),
    bitsReadout: document.getElementById('bits-readout'),
    bitsFill: document.getElementById('bits-fill'),
    tierLabel: document.getElementById('tier-label'),
    hoverDeltaPill: document.getElementById('hover-delta-pill'),
    hoverDeltaText: document.getElementById('hover-delta-text'),
    zoomToast: document.getElementById('zoom-toast'),
    zoomToastTitle: document.getElementById('zoom-toast-title'),
    zoomToastSub: document.getElementById('zoom-toast-sub'),
    scaleLegendPill: document.getElementById('scale-legend-pill'),
    scaleLegendText: document.getElementById('scale-legend-text'),
    outlinePill: document.getElementById('outline-pill'),
    outlineLabel: document.getElementById('outline-label'),
    counterRow: document.getElementById('counter-row'),
    counterCard: document.querySelector('.counter-card'),
    funfactCard: document.getElementById('funfact-card'),
    funfactCount: document.getElementById('funfact-count'),
    funfactTrait: document.getElementById('funfact-trait'),
    funfactBody: document.getElementById('funfact-body'),
    counterEyebrow: document.getElementById('counter-eyebrow'),
    btnReopenDossier: document.getElementById('btn-reopen-dossier'),
    populationCounter: document.getElementById('population-counter'),
    populationUnit: document.getElementById('population-unit'),
    analogyHeadline: document.getElementById('analogy-headline'),
    snarkSubline: document.getElementById('snark-subline'),
    omniboxForm: document.getElementById('omnibox-form'),
    omniboxInput: document.getElementById('omnibox-input'),
    omniboxDropdown: document.getElementById('omnibox-dropdown'),
    omniboxFeedback: document.getElementById('omnibox-feedback'),
    omniboxSpinner: document.getElementById('omnibox-spinner'),
    btnShuffle: document.getElementById('btn-shuffle'),
    categoryTabs: document.getElementById('category-tabs'),
    paramGenSelect: document.getElementById('param-generator-select'),
    suggestionChips: document.getElementById('suggestion-chips'),
    stackCountBadge: document.getElementById('stack-count-badge'),
    activeStackList: document.getElementById('active-stack-list'),
    inspector: document.getElementById('trait-inspector'),
    inspEmoji: document.getElementById('insp-emoji'),
    inspTitle: document.getElementById('insp-title'),
    inspTags: document.getElementById('insp-tags'),
    inspBody: document.getElementById('insp-body'),
    btnCloseInspector: document.getElementById('btn-close-inspector'),
    btnRemoveInspected: document.getElementById('btn-remove-inspected'),
    btnReset: document.getElementById('btn-reset'),
    dossierModal: document.getElementById('dossier-modal')
  };

  const resolver = new TraitResolver();
  let renderer = null;
  let omnibox = null;
  let receiptModal = null;
  let zoomToastTimeout = null;

  function getActiveSlugSet() {
    const s = new Set();
    for (let i = 0; i < state.stack.length; i++) {
      const t = state.stack[i];
      if (t.canonicalSlug) s.add(t.canonicalSlug);
      if (t.id) s.add(t.id);
    }
    return s;
  }

  /**
   * Smoothly rolls the main population counter logarithmically from old value to new value.
   */
  function animatePopulationCounter(targetPop) {
    if (state.counterRafId) {
      cancelAnimationFrame(state.counterRafId);
      state.counterRafId = null;
    }

    const startPop = Math.max(1, state.displayedCounterPop);
    const endPop = Math.max(1, targetPop);
    if (startPop === endPop) {
      dom.populationCounter.textContent = Probability.formatExactCount(endPop);
      return;
    }

    const logStart = Math.log(startPop);
    const logEnd = Math.log(endPop);
    const durationMs = 420;
    const t0 = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(Math.exp(logStart + (logEnd - logStart) * eased));
      state.displayedCounterPop = current;
      dom.populationCounter.textContent = Probability.formatExactCount(current);

      if (t < 1) {
        state.counterRafId = requestAnimationFrame(step);
      } else {
        state.displayedCounterPop = endPop;
        dom.populationCounter.textContent = Probability.formatExactCount(endPop);
        state.counterRafId = null;
      }
    };

    state.counterRafId = requestAnimationFrame(step);
  }

  /**
   * Handles Ghost-Cull Hover Preview across chips and omnibox options.
   */
  function handleHoverCandidate(candidateTrait) {
    if (!candidateTrait || state.evalResult.isOneOfOne) {
      if (renderer) renderer.setHoverPreview(null);
      dom.hoverDeltaPill.classList.add('hidden');
      return;
    }

    const preview = Probability.previewCandidate(state.stack, candidateTrait);
    if (!preview) return;

    if (renderer) {
      renderer.setHoverPreview(preview.survivalRatio);
    }

    const dropLabel = Probability.formatCompactCount(preview.deltaPeople);
    dom.hoverDeltaText.textContent =
      '−' + dropLabel + ' people · +' + preview.deltaBits.toFixed(1) + ' bits';
    dom.hoverDeltaPill.classList.remove('hidden');
  }

  /**
   * Adds a validated trait (L1, L2, or L3) to the active stack and triggers full UI + Canvas update.
   */
  function addTraitToStack(trait) {
    if (!trait) return;

    // Prevent exact duplicate slug
    const slug = trait.canonicalSlug || trait.id;
    if (state.stack.some((t) => (t.canonicalSlug || t.id) === slug)) {
      return;
    }

    const wasAlreadyOneOfOne = state.evalResult.isOneOfOne;
    const prevBits = state.evalResult.bitsRaw;

    state.stack.push(trait);
    state.lastAddedTrait = trait;
    state.inspectedIndex = null;
    closeInspector();

    recomputeAndRender({
      justAdded: true,
      wasAlreadyOneOfOne,
      prevBits
    });
  }

  function removeTraitAt(index) {
    if (index < 0 || index >= state.stack.length) return;
    state.stack.splice(index, 1);
    state.lastAddedTrait = state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;
    closeInspector();
    recomputeAndRender({ justAdded: false });
  }

  function resetAll() {
    if (state.dossierTimer) {
      clearTimeout(state.dossierTimer);
      state.dossierTimer = null;
    }
    state.stack = [];
    state.lastAddedTrait = null;
    state.shuffleSeed += 1;
    state.outlineRunSeed += 1;
    closeInspector();
    if (receiptModal) receiptModal.close();
    recomputeAndRender({ justAdded: false });
  }

  function formatSpokenHumans(n) {
    if (n >= 1000000000) {
      return (n / 1000000000).toFixed(2).replace(/\.?0+$/, '') + ' billion';
    }
    if (n >= 10000000) {
      return Math.round(n / 1000000).toLocaleString('en-US') + ' million';
    }
    if (n >= 1000000) {
      return (n / 1000000).toFixed(1).replace(/\.0$/, '') + ' million';
    }
    return Math.round(n).toLocaleString('en-US');
  }

  /**
   * Builds isolated worldwide headcount + fun-fact copy for the right-hand Fun Fact box
   * so global base stats never collide with the narrowing funnel on the left.
   */
  function buildGlobalFunFact(trait) {
    if (!trait) return null;
    const rawCount =
      (trait.fermi && Number(trait.fermi.estimatedGlobalHumans)) ||
      Math.max(8, Math.round((Number(trait.prevalence) || 0) * Taxonomy.WORLD_POPULATION));
    const spoken = formatSpokenHumans(rawCount);
    const compact = Probability.formatCompactCount(rawCount);
    const pctStr = Probability.formatPrevalencePercent(trait.prevalence);
    const slug = String(trait.canonicalSlug || trait.id || '');
    const label = String(trait.label || '');
    const snark = String(trait.snarkNote || '').trim();

    let body = '';
    if (slug === 'exercises_weekly') {
      body = 'Roughly ' + spoken + ' people in the world get in at least one workout every week.';
    } else if (slug.startsWith('lives_in_')) {
      const place = label.replace(/^I live in\s+/i, '').trim();
      body = 'There are roughly ' + spoken + ' people living in ' + place + ' worldwide.';
    } else if (slug.startsWith('speaks_') && !/^speaks_\d/.test(slug)) {
      const lang = label.replace(/^I speak\s+/i, '').trim();
      body = 'There are roughly ' + spoken + ' ' + lang + ' speakers across the globe.';
    } else if (/^I play or practice\s+/i.test(label)) {
      const sport = label.replace(/^I play or practice\s+/i, '').trim();
      body = 'There are roughly ' + spoken + ' regular ' + sport + ' participants in the world.';
    } else if (slug.startsWith('instrument_') && (!snark || /^Distinctive instrument/i.test(snark))) {
      const inst = label.replace(/^I play (?:the\s+)?/i, '').trim();
      body = 'There are roughly ' + spoken + ' ' + inst + ' players in the world.';
    } else if (snark) {
      body = snark;
    } else {
      body =
        'Roughly ' +
        spoken +
        ' people in the world share "' +
        (trait.shortBadge || label) +
        '."';
    }

    return {
      countHeader: '~' + compact + ' worldwide',
      topicLine: (trait.shortBadge || label) + ' · ' + pctStr + ' of Earth',
      body
    };
  }

  function renderFunFactCard(focusTrait) {
    if (!dom.funfactCard || !dom.counterRow) return;
    const trait =
      focusTrait ||
      state.lastAddedTrait ||
      (state.stack.length > 0 ? state.stack[state.stack.length - 1] : null);

    if (!trait || state.stack.length === 0) {
      dom.funfactCard.classList.add('hidden');
      dom.counterRow.classList.remove('has-funfact');
      return;
    }

    const fact = buildGlobalFunFact(trait);
    if (!fact) return;

    dom.funfactCount.textContent = fact.countHeader;
    dom.funfactTrait.textContent = fact.topicLine;
    dom.funfactBody.textContent = fact.body;
    dom.funfactCard.classList.remove('hidden');
    dom.counterRow.classList.add('has-funfact');
  }

  /**
   * Synchronizes the bottom-right canvas outline pill AND the Counter Card headline/subline
   * directly from the active canvas outline so the words ALWAYS match the graphic on screen.
   */
  function syncOutlineAndCopy(outline) {
    const pop = state.evalResult ? state.evalResult.displayPopulation : 8300000000;
    const isOneOfOne = Boolean(state.evalResult && state.evalResult.isOneOfOne);

    if (outline && dom.outlineLabel) {
      dom.outlineLabel.textContent = outline.label;
    }

    if (outline && ScaleOutlines && typeof ScaleOutlines.getCopyForOutline === 'function') {
      const copy = ScaleOutlines.getCopyForOutline(outline, pop);
      dom.analogyHeadline.textContent = copy.headline;
      dom.snarkSubline.textContent = copy.sub || '';
      dom.snarkSubline.classList.toggle('hidden', !copy.sub);
    } else {
      const analogy = Analogies.getAnalogy(pop, isOneOfOne);
      dom.analogyHeadline.textContent = analogy.headline;
      dom.snarkSubline.textContent = analogy.sub || '';
      dom.snarkSubline.classList.toggle('hidden', !analogy.sub);
    }
  }

  const SESSION_STACK_KEY = 'billionth_session_stack_v1';

  function saveStackToSession() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(SESSION_STACK_KEY, JSON.stringify(state.stack));
      }
    } catch (_) {}
  }

  function restoreStackFromSession() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const raw = sessionStorage.getItem(SESSION_STACK_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            state.stack = parsed.filter((t) => t && (t.canonicalSlug || t.id) && t.label);
            state.lastAddedTrait = state.stack[state.stack.length - 1] || null;
          }
        }
      }
    } catch (_) {}
  }

  function recomputeAndRender(meta = {}) {
    saveStackToSession();
    const evalRes = Probability.evaluateStack(state.stack);
    state.evalResult = evalRes;

    // 1. Canvas Crowd Engine update
    if (renderer) {
      renderer.setPopulation(evalRes.displayPopulation, evalRes.isOneOfOne, {
        runSeed: state.outlineRunSeed,
        stepCount: state.stack.length
      });
      const tierInfo = ScaleTiers.resolveTierState(evalRes.displayPopulation, evalRes.isOneOfOne).tier;
      dom.tierLabel.textContent =
        'TIER ' + tierInfo.index + ' · ' + tierInfo.name.toUpperCase();
      dom.scaleLegendText.textContent = tierInfo.legendText;
    }
    dom.hoverDeltaPill.classList.add('hidden');

    // 3. Bits of Uniqueness Meter
    dom.bitsReadout.textContent =
      evalRes.bitsDisplay.toFixed(2) + ' / ' + evalRes.maxBits.toFixed(2) + ' bits';
    dom.bitsFill.style.width = (evalRes.bitsProgressRatio * 100).toFixed(2) + '%';

    // 4. Counter Card & 1-to-1 Matched Outline Perspective Copy
    animatePopulationCounter(evalRes.displayPopulation);
    dom.populationUnit.textContent = evalRes.displayPopulation === 1 ? 'human (You!)' : 'humans';
    dom.counterCard.classList.toggle('is-one-of-one', evalRes.isOneOfOne);
    dom.btnReopenDossier.classList.toggle('hidden', !evalRes.isOneOfOne);
    dom.counterEyebrow.textContent = evalRes.isOneOfOne
      ? '1 IN 8.3 BILLION · YOU’RE ONE-OF-ONE'
      : 'REMAINING STATISTICAL MATCHES';

    syncOutlineAndCopy(renderer ? renderer.getActiveOutline() : null);
    renderFunFactCard();

    // 5. Refresh Suggestions and Active Stack Pills
    renderSuggestions();
    renderActiveStack();

    // 6. Trigger One-of-One Dossier Reveal after spotlight settles
    if (meta.justAdded && evalRes.isOneOfOne && !meta.wasAlreadyOneOfOne) {
      if (state.dossierTimer) clearTimeout(state.dossierTimer);
      state.dossierTimer = setTimeout(() => {
        if (state.evalResult.isOneOfOne && receiptModal) {
          receiptModal.open(state.evalResult);
        }
      }, 900);
    }
  }

  function handleTierTransition(nextTier, prevTier) {
    if (!prevTier || nextTier.index === prevTier.index) return;

    dom.scaleLegendPill.classList.add('pulse-zoom');
    setTimeout(() => dom.scaleLegendPill.classList.remove('pulse-zoom'), 900);

    // Show center scale-zoom toast
    if (zoomToastTimeout) clearTimeout(zoomToastTimeout);
    dom.zoomToast.classList.add('hidden');
    void dom.zoomToast.offsetWidth; // Reflow to restart keyframe

    if (nextTier.index === 2) {
      dom.zoomToastTitle.textContent = 'METROPOLIS SCALE ZOOM';
    } else if (nextTier.index === 3) {
      dom.zoomToastTitle.textContent = 'STADIUM SCALE · 1 DOT = 1 HUMAN';
    } else if (nextTier.index === 4) {
      dom.zoomToastTitle.textContent = 'THE ROOM · INDIVIDUAL SILHOUETTES';
    } else if (nextTier.index === 5) {
      dom.zoomToastTitle.textContent = 'POPULATION: 1 · ONE OF ONE';
    } else {
      dom.zoomToastTitle.textContent = 'PLANETARY SCALE';
    }
    dom.zoomToastSub.textContent = nextTier.legendText;
    dom.zoomToast.classList.remove('hidden');

    zoomToastTimeout = setTimeout(() => {
      dom.zoomToast.classList.add('hidden');
    }, 2150);
  }

  /**
   * Category Filter Tabs
   */
  function initCategoryTabs() {
    dom.categoryTabs.innerHTML = '';

    const allTab = document.createElement('button');
    allTab.type = 'button';
    allTab.className = 'cat-tab active';
    allTab.dataset.cat = 'all';
    allTab.textContent = 'All';
    allTab.addEventListener('click', () => setCategoryFilter('all'));
    dom.categoryTabs.appendChild(allTab);

    Taxonomy.CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-tab';
      btn.dataset.cat = cat.id;
      btn.textContent = cat.shortLabel;
      btn.addEventListener('click', () => setCategoryFilter(cat.id));
      dom.categoryTabs.appendChild(btn);
    });
  }

  function setCategoryFilter(catId) {
    state.selectedCategory = catId;
    const tabs = dom.categoryTabs.querySelectorAll('.cat-tab');
    tabs.forEach((t) => {
      t.classList.toggle('active', t.dataset.cat === catId);
    });
    renderSuggestions();
  }

  /**
   * Inline Parametric Template Picker: places selected `I play [Musical Instrument]` prompt
   * into the search box with an active cursor ready to replace the `[...]` placeholder.
   */
  function initParametricBuilder() {
    dom.paramGenSelect.innerHTML = '';

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Use a fill-in template (I live in…, I speak…, I play…)…';
    dom.paramGenSelect.appendChild(defaultOpt);

    resolver.generators.forEach((gen) => {
      const opt = document.createElement('option');
      opt.value = gen.id;
      opt.textContent = gen.title;
      dom.paramGenSelect.appendChild(opt);
    });

    dom.paramGenSelect.addEventListener('change', () => {
      const genId = dom.paramGenSelect.value;
      if (!genId) return;
      const gen = resolver.getGeneratorById(genId);
      dom.paramGenSelect.value = '';
      if (gen && omnibox) {
        omnibox.insertTemplatePrompt(gen.title);
      }
    });
  }

  /**
   * Renders the 3-Phase Adaptive Suggestion Deck
   */
  function renderSuggestions() {
    if (!resolver.loaded) return;

    const deck = Suggestions.buildSuggestionDeck({
      coreTraits: resolver.coreTraits,
      generators: [],
      evalState: state.evalResult,
      categoryFilter: state.selectedCategory,
      shuffleSeed: state.shuffleSeed,
      deckSize: 6
    });

    dom.suggestionChips.innerHTML = '';

    deck.traits.forEach((trait) => {
      const preview = Probability.previewCandidate(state.stack, trait);
      const pctText = Probability.formatPrevalencePercent(preview ? preview.pEff : trait.prevalence);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'suggestion-chip';

      const left = document.createElement('span');
      left.className = 'chip-left';
      left.innerHTML = '<span class="chip-plus">+</span><span class="chip-label"></span>';
      left.querySelector('.chip-label').textContent = trait.label;

      const right = document.createElement('span');
      right.className = 'chip-right';
      if (preview && preview.wasDampened) {
        right.title = 'Dampened slightly due to shared category/cluster overlap';
        right.innerHTML = '<span class="chip-dampen-dot">≈</span><span>' + pctText + '</span>';
      } else {
        right.textContent = pctText;
      }

      chip.appendChild(left);
      chip.appendChild(right);

      chip.addEventListener('mouseenter', () => handleHoverCandidate(trait));
      chip.addEventListener('mouseleave', () => handleHoverCandidate(null));
      chip.addEventListener('click', () => addTraitToStack(trait));

      dom.suggestionChips.appendChild(chip);
    });
  }

  /**
   * Renders Active Stack Pills & Fermi / Dampening Inspector Popover
   */
  function renderActiveStack() {
    const items = state.evalResult.items;
    dom.stackCountBadge.textContent = String(state.evalResult.activeCount);
    dom.activeStackList.innerHTML = '';

    if (items.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'stack-empty-hint';
      empty.textContent = 'one of 8.3 billion — pick a suggestion or type any fact above.';
      dom.activeStackList.appendChild(empty);
      return;
    }

    items.forEach((item, idx) => {
      const pill = document.createElement('div');
      pill.className =
        'stack-pill' +
        (item.trait.isCustom ? ' is-custom' : '') +
        (item.superseded ? ' is-superseded' : '');
      pill.title = 'Click to inspect statistical & Fermi math';

      const textSpan = document.createElement('span');
      textSpan.textContent =
        (item.trait.emoji || '🔹') + ' ' + (item.trait.shortBadge || item.trait.label);

      const pctSpan = document.createElement('span');
      pctSpan.className = 'stack-pill-pct';
      pctSpan.textContent = item.superseded
        ? 'incl.'
        : Probability.formatPrevalencePercent(item.pEff);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'stack-pill-remove';
      removeBtn.title = 'Remove trait';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTraitAt(idx);
      });

      pill.appendChild(textSpan);
      pill.appendChild(pctSpan);
      pill.appendChild(removeBtn);

      pill.addEventListener('click', () => {
        if (state.inspectedIndex === idx && !dom.inspector.classList.contains('hidden')) {
          closeInspector();
        } else {
          openInspector(idx);
        }
      });

      dom.activeStackList.appendChild(pill);
    });
  }

  function openInspector(index) {
    const item = state.evalResult.items[index];
    if (!item) return;
    state.inspectedIndex = index;
    renderFunFactCard(item.trait);

    dom.inspEmoji.textContent = item.trait.emoji || '🔹';
    dom.inspTitle.textContent = item.trait.label;
    dom.inspTags.textContent = (item.sanitizedTags || [])
      .map((t) => '#' + t)
      .join('  ');

    dom.inspBody.innerHTML = '';

    // 1. Base vs Effective Grid
    const globalEst = Math.max(8, Math.round(item.pBase * Taxonomy.WORLD_POPULATION));
    const grid = document.createElement('div');
    grid.className = 'insp-stat-grid';
    grid.innerHTML =
      '<div class="insp-stat-box">' +
      '<span class="insp-stat-label">GLOBAL PREVALENCE</span>' +
      '<span class="insp-stat-val">' +
      Probability.formatPrevalencePercent(item.pBase) +
      ' (~' +
      Probability.formatCompactCount(globalEst) +
      ')</span>' +
      '</div>' +
      '<div class="insp-stat-box">' +
      '<span class="insp-stat-label">STACK STEP CUT</span>' +
      '<span class="insp-stat-val">' +
      (item.superseded
        ? 'Superseded'
        : Probability.formatCompactCount(item.populationBefore) +
          ' ➔ ' +
          Probability.formatCompactCount(item.populationAfter) +
          ' (+' +
          item.bitsAdded.toFixed(1) +
          'b)') +
      '</span>' +
      '</div>';
    dom.inspBody.appendChild(grid);

    // 2. Custom AI Fermi Breakdown (when available)
    if (item.trait.fermi) {
      const fBox = document.createElement('div');
      fBox.className = 'insp-fermi-box';
      fBox.innerHTML =
        '<strong>🤖 Fermi Estimate Breakdown:</strong><br/>' +
        'Base pool: <em>' +
        escapeHtml(item.trait.fermi.baseGroup) +
        '</em><br/>' +
        'Conditional share: <em>' +
        escapeHtml(item.trait.fermi.conditionalRate) +
        '</em><br/>' +
        'Estimated humans: <strong>~' +
        Number(item.trait.fermi.estimatedGlobalHumans || globalEst).toLocaleString('en-US') +
        ' / 8.3B</strong>';
      dom.inspBody.appendChild(fBox);
    }

    // 3. Correlation Dampening or Subsumption Note
    if (item.superseded) {
      const sNote = document.createElement('div');
      sNote.className = 'insp-dampen-note';
      sNote.textContent =
        'ℹ️ Included automatically inside "' +
        item.supersededBy +
        '" — no double-counting applied.';
      dom.inspBody.appendChild(sNote);
    } else if (item.wasDampened) {
      const dNote = document.createElement('div');
      dNote.className = 'insp-dampen-note';
      if (item.dampenMode === 'geo_bayes' && item.geoSourceLabel) {
        dNote.textContent =
          '🌍 Geographic / Language Overlap: Adjusted from ' +
          Probability.formatPrevalencePercent(item.pBase) +
          ' global to ' +
          Probability.formatPrevalencePercent(item.pEff) +
          ' conditioned on ' +
          item.geoSourceLabel +
          '.';
      } else {
        const overlapNames = item.sharedWith.map((s) => s.label).join(', ');
        dNote.textContent =
          '📐 Correlation Dampening (γ = 0.65): Adjusted from ' +
          Probability.formatPrevalencePercent(item.pBase) +
          ' to ' +
          Probability.formatPrevalencePercent(item.pEff) +
          ' due to cluster overlap with ' +
          overlapNames +
          '.';
      }
      dom.inspBody.appendChild(dNote);
    }

    dom.inspector.classList.remove('hidden');
  }

  function closeInspector() {
    state.inspectedIndex = null;
    if (dom.inspector) dom.inspector.classList.add('hidden');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function bootstrap() {
    // 1. Initialize 60fps Crowd Canvas right away so 8,300 dots are alive on frame 1
    renderer = new CrowdRenderer(dom.canvas, {
      onTierChange: handleTierTransition,
      onOutlineChange: syncOutlineAndCopy
    });
    syncOutlineAndCopy(renderer.getActiveOutline());
    renderer.start();

    if (dom.outlinePill) {
      dom.outlinePill.addEventListener('click', () => {
        if (renderer) renderer.cycleOutline();
      });
    }

    window.addEventListener('resize', () => {
      if (renderer) renderer.resize();
    });

    // 2. Wire Header & Footer Controls
    dom.btnReset.addEventListener('click', () => {
      resetAll();
    });

    dom.btnShuffle.addEventListener('click', () => {
      state.shuffleSeed += 1;
      renderSuggestions();
    });

    dom.btnReopenDossier.addEventListener('click', () => {
      if (receiptModal && state.evalResult.isOneOfOne) {
        receiptModal.open(state.evalResult);
      }
    });

    dom.btnCloseInspector.addEventListener('click', () => closeInspector());
    dom.btnRemoveInspected.addEventListener('click', () => {
      if (state.inspectedIndex !== null) {
        removeTraitAt(state.inspectedIndex);
      }
    });

    document.addEventListener('click', (e) => {
      if (
        !dom.inspector.classList.contains('hidden') &&
        !dom.inspector.contains(e.target) &&
        !dom.activeStackList.contains(e.target)
      ) {
        closeInspector();
      }
    });

    // 3. Initialize Specimen Dossier Modal
    receiptModal = new ReceiptModal({
      modalEl: dom.dossierModal,
      Taxonomy,
      Probability,
      onResetRun: resetAll
    });

    // 4. Load Static Curated + Parametric Seed JSON & pre-warm Render custom estimator
    resolver.prewarmApi();
    initCategoryTabs();
    await resolver.loadSeedFiles('data/');
    initParametricBuilder();
    restoreStackFromSession();

    // 5. Wire Hybrid Omnibox
    omnibox = new OmniboxController({
      inputEl: dom.omniboxInput,
      formEl: dom.omniboxForm,
      dropdownEl: dom.omniboxDropdown,
      feedbackEl: dom.omniboxFeedback,
      statusSpinnerEl: dom.omniboxSpinner,
      resolver,
      formatPct: Probability.formatPrevalencePercent,
      getActiveSlugSet,
      getActiveTraitsSummary: () =>
        state.stack.map((t) => ({ slug: t.canonicalSlug || t.id, label: t.label })),
      onSelectTrait: addTraitToStack,
      onHoverTrait: handleHoverCandidate
    });

    recomputeAndRender({ justAdded: false });
  }

  bootstrap().catch((err) => {
    console.error('[The 8.3 Billionth] Bootstrap error:', err);
  });
})();
