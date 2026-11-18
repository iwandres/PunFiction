/**
 * The 8.3 Billionth — Hybrid Omnibox Controller
 * Combines <1ms fuzzy autocomplete (L1 + L2) with first-class custom Gemini Fermi estimation (L3),
 * Compound-Split quick-add chips, and witty anti-cheat feedback banners.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthOmnibox = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ROTATING_PLACEHOLDERS = [
    'Type ANY fact about yourself… e.g. "I grow carnivorous plants"',
    'Type ANY fact… e.g. "I make homemade jalapeño relish"',
    'Type ANY fact… e.g. "Cilantro tastes like dish soap to me"',
    'Type ANY fact… e.g. "I wear earplugs to live concerts"',
    'Type ANY fact… e.g. "I tune my own bike derailleurs"',
    'Type ANY fact… e.g. "I can solve a Rubik’s cube under 30s"',
    'Type ANY fact… e.g. "I speak Tagalog"'
  ];

  class OmniboxController {
    constructor(options) {
      this.inputEl = options.inputEl;
      this.formEl = options.formEl;
      this.dropdownEl = options.dropdownEl;
      this.feedbackEl = options.feedbackEl;
      this.statusSpinnerEl = options.statusSpinnerEl;
      this.resolver = options.resolver;
      this.formatPct = options.formatPct;
      this.getActiveSlugSet = options.getActiveSlugSet;
      this.getActiveTraitsSummary = options.getActiveTraitsSummary || (() => []);
      this.onSelectTrait = options.onSelectTrait;
      this.onHoverTrait = options.onHoverTrait;

      this.matches = [];
      this.highlightedIndex = -1; // 0..matches.length-1 = instant match, matches.length = custom AI item
      this.isEstimating = false;
      this.placeholderIdx = 0;
      this.placeholderTimer = null;

      this._bindEvents();
      this._startPlaceholderRotation();
    }

    _startPlaceholderRotation() {
      if (!this.inputEl || typeof window === 'undefined') return;
      this.placeholderTimer = window.setInterval(() => {
        if (document.activeElement === this.inputEl || this.inputEl.value.trim().length > 0) {
          return;
        }
        this.placeholderIdx = (this.placeholderIdx + 1) % ROTATING_PLACEHOLDERS.length;
        this.inputEl.setAttribute('placeholder', ROTATING_PLACEHOLDERS[this.placeholderIdx]);
      }, 4500);
    }

    _bindEvents() {
      this.inputEl.addEventListener('input', () => {
        this._clearFeedback();
        this._refreshDropdown();
      });

      this.inputEl.addEventListener('focus', () => {
        if (this.inputEl.value.trim().length >= 2) {
          this._refreshDropdown();
        }
      });

      this.inputEl.addEventListener('keydown', (e) => {
        const totalRows = this._totalDropdownRows();
        if (e.key === 'ArrowDown' && totalRows > 0) {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex + 1) % totalRows;
          this._syncHighlightDOM();
        } else if (e.key === 'ArrowUp' && totalRows > 0) {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex - 1 + totalRows) % totalRows;
          this._syncHighlightDOM();
        } else if (e.key === 'Escape') {
          this.closeDropdown();
          this.inputEl.blur();
        }
      });

      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        this._handleSubmit();
      });

      document.addEventListener('click', (e) => {
        if (
          !this.formEl.contains(e.target) &&
          (!this.dropdownEl || !this.dropdownEl.contains(e.target))
        ) {
          this.closeDropdown();
        }
      });
    }

    _totalDropdownRows() {
      const q = this.inputEl.value.trim();
      const hasCustomRow = q.length >= 3 ? 1 : 0;
      return this.matches.length + hasCustomRow;
    }

    _refreshDropdown() {
      const raw = this.inputEl.value.trim();
      if (raw.length < 2 || this.isEstimating) {
        this.closeDropdown();
        return;
      }

      const activeSet = this.getActiveSlugSet();
      this.matches = this.resolver.searchInstant(raw, activeSet, 4);
      const hasCustomRow = raw.length >= 3;

      // Default highlight: if top match is a very strong match, highlight 0; else highlight custom row if >= 3 chars
      this.highlightedIndex = this.matches.length > 0 ? 0 : hasCustomRow ? 0 : -1;

      this.dropdownEl.innerHTML = '';

      this.matches.forEach((trait, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'omni-option' + (idx === this.highlightedIndex ? ' active' : '');
        btn.dataset.rowIdx = String(idx);

        const left = document.createElement('span');
        left.className = 'omni-opt-left';
        left.textContent = trait.label;

        const right = document.createElement('span');
        right.className = 'omni-opt-right';
        right.innerHTML =
          '<span class="omni-instant-tag">Instant</span>' +
          '<span class="omni-pct">' +
          this.formatPct(trait.prevalence) +
          '</span>';

        btn.appendChild(left);
        btn.appendChild(right);

        btn.addEventListener('mouseenter', () => {
          this.highlightedIndex = idx;
          this._syncHighlightDOM();
          if (this.onHoverTrait) this.onHoverTrait(trait);
        });
        btn.addEventListener('mouseleave', () => {
          if (this.onHoverTrait) this.onHoverTrait(null);
        });
        btn.addEventListener('click', () => {
          this._pickInstantTrait(trait);
        });

        this.dropdownEl.appendChild(btn);
      });

      if (hasCustomRow) {
        const customIdx = this.matches.length;
        const customBtn = document.createElement('button');
        customBtn.type = 'button';
        customBtn.className =
          'omni-option omni-custom-row' +
          (this.highlightedIndex === customIdx ? ' active' : '');
        customBtn.dataset.rowIdx = String(customIdx);

        const left = document.createElement('span');
        left.className = 'omni-opt-left';
        left.textContent = 'Estimate custom fact: "' + raw + '"';

        const right = document.createElement('span');
        right.className = 'omni-opt-right';
        right.innerHTML = '<span class="omni-enter-kbd">Enter ↵</span>';

        customBtn.appendChild(left);
        customBtn.appendChild(right);

        customBtn.addEventListener('mouseenter', () => {
          this.highlightedIndex = customIdx;
          this._syncHighlightDOM();
          if (this.onHoverTrait) this.onHoverTrait(null);
        });
        customBtn.addEventListener('click', () => {
          this.submitCustomText(raw);
        });

        this.dropdownEl.appendChild(customBtn);
      }

      if (this.matches.length > 0 || hasCustomRow) {
        this.dropdownEl.classList.remove('hidden');
        if (this.highlightedIndex >= 0 && this.highlightedIndex < this.matches.length) {
          if (this.onHoverTrait) this.onHoverTrait(this.matches[this.highlightedIndex]);
        }
      } else {
        this.closeDropdown();
      }
    }

    _syncHighlightDOM() {
      const rows = this.dropdownEl.querySelectorAll('.omni-option');
      rows.forEach((row, idx) => {
        row.classList.toggle('active', idx === this.highlightedIndex);
      });
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.matches.length) {
        if (this.onHoverTrait) this.onHoverTrait(this.matches[this.highlightedIndex]);
      } else if (this.onHoverTrait) {
        this.onHoverTrait(null);
      }
    }

    closeDropdown() {
      if (this.dropdownEl) {
        this.dropdownEl.classList.add('hidden');
        this.dropdownEl.innerHTML = '';
      }
      this.matches = [];
      this.highlightedIndex = -1;
      if (this.onHoverTrait) this.onHoverTrait(null);
    }

    _pickInstantTrait(trait) {
      this.closeDropdown();
      this.inputEl.value = '';
      this._maybeConfirmExtremeAndSelect(trait);
    }

    _maybeConfirmExtremeAndSelect(trait) {
      if (trait.isVerifiedExtremeRarity && trait.prevalence < 0.0001) {
        const estHeadcount = Math.max(8, Math.round(trait.prevalence * 8300000000));
        this._renderRarityConfirmation(trait, estHeadcount);
        return;
      }
      this.onSelectTrait(trait);
    }

    _handleSubmit() {
      if (this.isEstimating) return;
      const raw = this.inputEl.value.trim();
      if (!raw) return;

      // If user explicitly navigated onto an instant match (or typed an exact match), pick it
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.matches.length) {
        const candidate = this.matches[this.highlightedIndex];
        // Only auto-pick index 0 if user arrowed onto it OR its label/badge closely matches raw text;
        // if user typed a longer custom variation ("I make homemade jalapeño relish"), prefer custom L3!
        const normRaw = raw.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const normCand = candidate.label.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const normBadge = candidate.shortBadge.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const isExactish =
          normRaw === normCand ||
          normRaw === normBadge ||
          (candidate.aliases || []).some((a) => a.toLowerCase() === normRaw);

        if (isExactish) {
          this._pickInstantTrait(candidate);
          return;
        }
      }

      this.submitCustomText(raw);
    }

    async submitCustomText(rawText) {
      const clean = String(rawText || '').trim();
      if (clean.length < 2 || this.isEstimating) return;

      this.closeDropdown();
      this._clearFeedback();
      this._setLoading(true);

      try {
        const activeSlugs = Array.from(this.getActiveSlugSet());
        const activeTraits = this.getActiveTraitsSummary();
        const res = await this.resolver.estimateCustomFact(clean, activeSlugs, activeTraits);
        this._setLoading(false);

        if (!res) return;

        if (res.status === 'accepted' && res.trait) {
          this.inputEl.value = '';
          const enrichedTrait = Object.assign({}, res.trait, {
            fermi: res.fermi || null,
            wasCachedHit: Boolean(res.cached)
          });
          this._maybeConfirmExtremeAndSelect(enrichedTrait);
          return;
        }

        if (res.status === 'compound_split' && Array.isArray(res.compoundSplit) && res.compoundSplit.length > 0) {
          this.inputEl.value = '';
          this._renderCompoundSplitTray(
            res.rejectionReason || 'Whoa, one flex at a time! Click to add individually:',
            res.compoundSplit
          );
          return;
        }

        // Rejected (PII, ephemeral, implausible)
        this._renderRejection(
          res.rejectionReason ||
            'Could not verify that as a durable human trait — try phrasing a lasting skill, habit, or quirk!'
        );
      } catch (err) {
        this._setLoading(false);
        this._renderRejection(
          err.message ||
            'Custom AI estimator could not be reached right now — pick or search any of the 5,000+ instant traits below!'
        );
      }
    }

    _setLoading(loading) {
      this.isEstimating = loading;
      this.formEl.classList.toggle('is-scanning', loading);
      this.inputEl.disabled = loading;
      if (this.statusSpinnerEl) {
        this.statusSpinnerEl.classList.toggle('hidden', !loading);
      }
      if (!loading) {
        this.inputEl.focus();
      }
    }

    _clearFeedback() {
      if (!this.feedbackEl) return;
      this.feedbackEl.innerHTML = '';
      this.feedbackEl.className = 'omni-feedback hidden';
    }

    _renderRejection(message) {
      if (!this.feedbackEl) return;
      this.feedbackEl.className = 'omni-feedback omni-feedback-warn';
      const span = document.createElement('span');
      span.textContent = '🛡️ ' + message;
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'omni-feedback-dismiss';
      closeBtn.textContent = '×';
      closeBtn.addEventListener('click', () => this._clearFeedback());
      this.feedbackEl.innerHTML = '';
      this.feedbackEl.appendChild(span);
      this.feedbackEl.appendChild(closeBtn);
    }

    _renderCompoundSplitTray(headline, statements) {
      if (!this.feedbackEl) return;
      this.feedbackEl.className = 'omni-feedback omni-feedback-split';
      this.feedbackEl.innerHTML = '';

      const title = document.createElement('div');
      title.className = 'split-tray-title';
      title.textContent = '✂️ ' + headline;
      this.feedbackEl.appendChild(title);

      const chipWrap = document.createElement('div');
      chipWrap.className = 'split-tray-chips';

      statements.forEach((stmt) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'split-chip';
        chip.textContent = '+ ' + stmt;
        chip.addEventListener('click', async () => {
          chip.disabled = true;
          chip.textContent = 'Scanning…';
          // Check instant match first before calling API
          const instant = this.resolver.searchInstant(stmt, this.getActiveSlugSet(), 1);
          if (
            instant.length > 0 &&
            instant[0].label.toLowerCase().replace(/[^a-z0-9]/g, '') ===
              stmt.toLowerCase().replace(/[^a-z0-9]/g, '')
          ) {
            this.onSelectTrait(instant[0]);
            chip.remove();
            if (chipWrap.children.length === 0) this._clearFeedback();
            return;
          }
          try {
            const res = await this.resolver.estimateCustomFact(
              stmt,
              Array.from(this.getActiveSlugSet()),
              this.getActiveTraitsSummary()
            );
            if (res && res.status === 'accepted' && res.trait) {
              this.onSelectTrait(Object.assign({}, res.trait, { fermi: res.fermi || null }));
              chip.remove();
              if (chipWrap.children.length === 0) this._clearFeedback();
            } else {
              chip.textContent = 'Skipped';
            }
          } catch (_) {
            chip.disabled = false;
            chip.textContent = '+ ' + stmt;
          }
        });
        chipWrap.appendChild(chip);
      });

      this.feedbackEl.appendChild(chipWrap);
    }

    _renderRarityConfirmation(trait, estHeadcount) {
      if (!this.feedbackEl) return;
      this.feedbackEl.className = 'omni-feedback omni-feedback-confirm';
      this.feedbackEl.innerHTML = '';

      const msg = document.createElement('div');
      msg.className = 'rarity-confirm-msg';
      msg.textContent =
        '⚡ Hold up — only ~' +
        estHeadcount.toLocaleString('en-US') +
        ' living humans match "' +
        trait.label +
        '". True story?';

      const actions = document.createElement('div');
      actions.className = 'rarity-confirm-actions';

      const yesBtn = document.createElement('button');
      yesBtn.type = 'button';
      yesBtn.className = 'btn-confirm-yes';
      yesBtn.textContent = 'Yes, pinky swear';
      yesBtn.addEventListener('click', () => {
        this._clearFeedback();
        this.onSelectTrait(trait);
      });

      const noBtn = document.createElement('button');
      noBtn.type = 'button';
      noBtn.className = 'btn-confirm-no';
      noBtn.textContent = 'Just kidding';
      noBtn.addEventListener('click', () => this._clearFeedback());

      actions.appendChild(yesBtn);
      actions.appendChild(noBtn);
      this.feedbackEl.appendChild(msg);
      this.feedbackEl.appendChild(actions);
    }
  }

  return OmniboxController;
});
