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
  const CrowdRenderer = window.BillionthCrowdRenderer;
  const Sound = window.BillionthSound;
  const OmniboxController = window.BillionthOmnibox;
  const ReceiptModal = window.BillionthReceiptModal;

  // Application State
  const state = {
    stack: [],
    evalResult: Probability.evaluateStack([]),
    lastAddedTrait: null,
    selectedCategory: 'all',
    shuffleSeed: 1,
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
    counterCard: document.querySelector('.counter-card'),
    counterEyebrow: document.getElementById('counter-eyebrow'),
    btnReopenDossier: document.getElementById('btn-reopen-dossier'),
    populationCounter: document.getElementById('population-counter'),
    populationUnit: document.getElementById('population-unit'),
    analogyHeadline: document.getElementById('analogy-headline'),
    snarkSubline: document.getElementById('snark-subline'),
    sniperBanner: document.getElementById('sniper-banner'),
    omniboxForm: document.getElementById('omnibox-form'),
    omniboxInput: document.getElementById('omnibox-input'),
    omniboxDropdown: document.getElementById('omnibox-dropdown'),
    omniboxFeedback: document.getElementById('omnibox-feedback'),
    omniboxSpinner: document.getElementById('omnibox-spinner'),
    phaseBadge: document.getElementById('phase-badge'),
    btnShuffle: document.getElementById('btn-shuffle'),
    categoryTabs: document.getElementById('category-tabs'),
    paramGenSelect: document.getElementById('param-generator-select'),
    paramOptSelect: document.getElementById('param-option-select'),
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
    btnAudio: document.getElementById('btn-audio'),
    btnReset: document.getElementById('btn-reset'),
    dossierModal: document.getElementById('dossier-modal')
  };

  const resolver = new TraitResolver();
  let renderer = null;
  let omnibox = null;
  let receiptModal = null;
  let zoomToastTimeout = null;

  function syncAudioButton() {
    if (!dom.btnAudio) return;
    dom.btnAudio.textContent = Sound.isMuted() ? '🔇 Muted' : '🔊 Audio';
  }

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

    Sound.playHoverTick();
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
    closeInspector();
    if (receiptModal) receiptModal.close();
    recomputeAndRender({ justAdded: false });
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

    // 1. Sound feedback
    if (meta.justAdded) {
      const deltaBits = Math.max(0.5, evalRes.bitsRaw - (meta.prevBits || 0));
      if (evalRes.isOneOfOne && !meta.wasAlreadyOneOfOne) {
        Sound.playOneOfOneFanfare();
      } else {
        Sound.playCullWhoosh(deltaBits);
      }
    }

    // 2. Canvas Crowd Engine update
    if (renderer) {
      renderer.setPopulation(evalRes.displayPopulation, evalRes.isOneOfOne);
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

    // 4. Counter Card, Snark & Human Scale Analogy
    animatePopulationCounter(evalRes.displayPopulation);
    dom.populationUnit.textContent = evalRes.displayPopulation === 1 ? 'human (You!)' : 'humans';
    dom.counterCard.classList.toggle('is-one-of-one', evalRes.isOneOfOne);
    dom.btnReopenDossier.classList.toggle('hidden', !evalRes.isOneOfOne);
    dom.counterEyebrow.textContent = evalRes.isOneOfOne
      ? '1 IN 8.3 BILLION · YOU’RE ONE-OF-ONE'
      : 'REMAINING STATISTICAL MATCHES';

    const analogy = Analogies.getAnalogy(evalRes.displayPopulation, evalRes.isOneOfOne);
    dom.analogyHeadline.textContent = analogy.headline;

    if (state.lastAddedTrait && state.lastAddedTrait.snarkNote && state.stack.length > 0) {
      dom.snarkSubline.textContent =
        (state.lastAddedTrait.emoji || '•') + ' ' + state.lastAddedTrait.snarkNote;
    } else {
      dom.snarkSubline.textContent = analogy.sub;
    }

    // 5. Endgame Sniper Callout (< 5,000 remaining & not yet 1 of 1)
    const showSniper = !evalRes.isOneOfOne && evalRes.displayPopulation < 5000;
    dom.sniperBanner.classList.toggle('hidden', !showSniper);
    if (showSniper) {
      dom.sniperBanner.innerHTML =
        '🎯 <strong>Sniper Range (' +
        evalRes.displayPopulation.toLocaleString('en-US') +
        ' left):</strong> Type a hyper-specific hobby, skill, or quirk into the box below to shake your final statistical clones.';
    }

    // 6. Refresh Suggestions, Parametric Select, and Active Stack Pills
    renderSuggestions();
    renderParametricOptions();
    renderActiveStack();

    // 7. Trigger One-of-One Dossier Reveal after spotlight settles
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
    if (nextTier.index > prevTier.index && nextTier.index < 5) {
      Sound.playTierZoom(nextTier.index);
    }

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
    allTab.textContent = '✨ All';
    allTab.addEventListener('click', () => setCategoryFilter('all'));
    dom.categoryTabs.appendChild(allTab);

    Taxonomy.CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-tab';
      btn.dataset.cat = cat.id;
      btn.textContent = cat.emoji + ' ' + cat.shortLabel;
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
   * Inline Parametric Builder Selectors (Countries, Languages, Blood Type, Sports, Instruments, etc.)
   */
  function initParametricBuilder() {
    dom.paramGenSelect.innerHTML = '';
    resolver.generators.forEach((gen) => {
      const opt = document.createElement('option');
      opt.value = gen.id;
      opt.textContent = gen.emoji + ' ' + gen.title;
      dom.paramGenSelect.appendChild(opt);
    });

    dom.paramGenSelect.addEventListener('change', () => {
      renderParametricOptions();
    });

    dom.paramOptSelect.addEventListener('change', () => {
      const genId = dom.paramGenSelect.value;
      const slug = dom.paramOptSelect.value;
      if (!genId || !slug) return;
      const trait = resolver.getTraitBySlug(slug);
      if (trait) {
        addTraitToStack(trait);
      }
      dom.paramOptSelect.value = '';
    });

    renderParametricOptions();
  }

  function renderParametricOptions() {
    const genId = dom.paramGenSelect.value || (resolver.generators[0] && resolver.generators[0].id);
    const gen = resolver.getGeneratorById(genId);
    dom.paramOptSelect.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = gen
      ? 'Select from ' + gen.expandedOptions.length + ' options…'
      : 'Select option…';
    dom.paramOptSelect.appendChild(placeholder);

    if (!gen) return;
    const activeSet = getActiveSlugSet();

    gen.expandedOptions.forEach((optTrait) => {
      const o = document.createElement('option');
      o.value = optTrait.canonicalSlug;
      o.disabled = activeSet.has(optTrait.canonicalSlug);
      o.textContent =
        optTrait.emoji +
        ' ' +
        optTrait.shortBadge +
        ' (' +
        Probability.formatPrevalencePercent(optTrait.prevalence) +
        ')';
      dom.paramOptSelect.appendChild(o);
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

    const phaseLabels = {
      opening: 'Opening Splitters',
      midgame: 'Uncorrelated Midgame',
      sniper: 'Endgame Snipers',
      complete: '1-of-1 Complete'
    };
    dom.phaseBadge.textContent = phaseLabels[deck.phase] || 'Suggestions';

    dom.suggestionChips.innerHTML = '';

    deck.traits.forEach((trait) => {
      const preview = Probability.previewCandidate(state.stack, trait);
      const pctText = Probability.formatPrevalencePercent(preview ? preview.pEff : trait.prevalence);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'suggestion-chip';

      const left = document.createElement('span');
      left.className = 'chip-left';
      left.innerHTML =
        '<span class="chip-plus">+</span>' +
        '<span>' +
        (trait.emoji || '🔹') +
        '</span>' +
        '<span class="chip-label"></span>';
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
      empty.textContent =
        'No traits stacked yet — click any suggestion chip or type a personal quirk above.';
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
    } else if (item.trait.snarkNote) {
      const snark = document.createElement('div');
      snark.textContent = '"' + item.trait.snarkNote + '"';
      dom.inspBody.appendChild(snark);
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
    syncAudioButton();

    // 1. Initialize 60fps Crowd Canvas right away so 8,300 dots are alive on frame 1
    renderer = new CrowdRenderer(dom.canvas, {
      onTierChange: handleTierTransition
    });
    renderer.start();

    window.addEventListener('resize', () => {
      if (renderer) renderer.resize();
    });

    // 2. Wire Header & Footer Controls
    dom.btnAudio.addEventListener('click', () => {
      Sound.toggleMute();
      syncAudioButton();
    });

    dom.btnReset.addEventListener('click', () => {
      resetAll();
    });

    dom.btnShuffle.addEventListener('click', () => {
      state.shuffleSeed += 1;
      Sound.playHoverTick();
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

    // 4. Load Static Curated + Parametric Seed JSON
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
      onHoverTrait: handleHoverCandidate,
      onRejectSound: () => Sound.playRejectBuzz()
    });

    recomputeAndRender({ justAdded: false });
  }

  bootstrap().catch((err) => {
    console.error('[The 8.3 Billionth] Bootstrap error:', err);
  });
})();
