/**
 * UMWELT: Animal Optics — Minimal Collapsible Ecological Field Journal Drawer
 * Shows one biome at a time via clean filter tabs, compact clickable rows,
 * and expandable Scientific Codex entries for logged discoveries.
 */
import { BIOMES, MYSTERIES, getSpecies } from '../data/biomes.js?v=10';

export class FieldJournalDrawer {
  constructor(drawerEl, callbacks = {}) {
    this.drawerEl = drawerEl;
    this.callbacks = callbacks;
    this.open = false;
    this.selectedBiomeId = null;
    this._lastState = null;
  }

  toggle(forceState) {
    this.open = typeof forceState === 'boolean' ? forceState : !this.open;
    this.drawerEl.classList.toggle('open', this.open);
    if (this.open) {
      this.drawerEl.removeAttribute('inert');
      if (this._lastState) {
        this.selectedBiomeId = this._lastState.activeBiomeId;
        this.render(this._lastState);
      }
    } else {
      this.drawerEl.setAttribute('inert', '');
      if (document.activeElement && this.drawerEl.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      window.scrollTo(0, 0);
    }
    this.callbacks.onToggle?.(this.open);
  }

  render(state) {
    this._lastState = state;
    const { activeBiomeId, activeSpeciesSlug, journal } = state;
    const solvedIds = new Set((journal?.solvedMysteries || []).map((m) => m.mysteryId));
    const solvedCount = solvedIds.size;

    const viewBiomeId = this.selectedBiomeId || activeBiomeId;
    const biomeTabsHtml = BIOMES.map((b) => {
      const list = MYSTERIES.filter((m) => m.biomeId === b.id);
      const bSolved = list.filter((m) => solvedIds.has(m.mysteryId)).length;
      return `
        <button type="button" class="j-tab ${b.id === viewBiomeId ? 'active' : ''}" data-j-biome="${b.id}">
          ${b.shortName} <span class="j-tab-count">${bSolved}/${list.length}</span>
        </button>
      `;
    }).join('');

    const biomeMysteries = MYSTERIES.filter((m) => m.biomeId === viewBiomeId);
    const itemsHtml = biomeMysteries.map((m) => {
      const solved = solvedIds.has(m.mysteryId);
      const sp = getSpecies(m.biomeId, m.requiredSpeciesSlug);
      const isCurrent = m.biomeId === activeBiomeId && m.requiredSpeciesSlug === activeSpeciesSlug;

      if (solved) {
        return `
          <details class="j-item solved ${isCurrent ? 'current' : ''}" ${isCurrent ? 'open' : ''}>
            <summary class="j-summary">
              <span class="j-icon">${sp.icon}</span>
              <span class="j-main">
                <strong>${m.title}</strong>
                <small>${sp.shortName}</small>
              </span>
              <span class="j-check" aria-label="Logged">✓</span>
            </summary>
            <div class="j-detail">
              <p class="j-codex">${m.scientificReveal}</p>
              ${!isCurrent ? `<button type="button" class="j-link" data-jump-biome="${m.biomeId}" data-jump-species="${m.requiredSpeciesSlug}">View ${sp.shortName} →</button>` : ''}
            </div>
          </details>
        `;
      }

      if (isCurrent) {
        return `
          <article class="j-item active-mystery">
            <div class="j-row">
              <span class="j-icon">${sp.icon}</span>
              <span class="j-main">
                <strong>${m.title}</strong>
                <small>${sp.shortName} · Active</small>
              </span>
            </div>
            <p class="j-clue">${m.cluePrompt}</p>
            <div class="j-actions">
              <button type="button" class="j-link accent" data-pulse-hint="${m.mysteryId}">✦ Show Hint Ring</button>
            </div>
          </article>
        `;
      }

      return `
        <button type="button" class="j-item j-jump" data-jump-biome="${m.biomeId}" data-jump-species="${m.requiredSpeciesSlug}">
          <span class="j-icon">${sp.icon}</span>
          <span class="j-main">
            <strong>${m.title}</strong>
            <small>${sp.shortName}</small>
          </span>
          <span class="j-arrow">→</span>
        </button>
      `;
    }).join('');

    this.drawerEl.innerHTML = `
      <div class="drawer-header">
        <div class="drawer-head-left">
          <h2 class="drawer-title">Field Journal</h2>
          <span class="drawer-progress">${solvedCount} / ${MYSTERIES.length}</span>
        </div>
        <button type="button" class="icon-close-btn" id="btn-close-journal" aria-label="Close Field Journal">✕</button>
      </div>
      <div class="j-tabs" role="tablist">${biomeTabsHtml}</div>
      <div class="drawer-body">${itemsHtml}</div>
    `;

    this.drawerEl.querySelector('#btn-close-journal')?.addEventListener('click', () => this.toggle(false));
    this.drawerEl.querySelectorAll('[data-j-biome]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedBiomeId = btn.dataset.jBiome;
        this.render(this._lastState);
      });
    });
    this.drawerEl.querySelectorAll('[data-jump-biome]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedBiomeId = btn.dataset.jumpBiome;
        this.callbacks.onJumpToSpecies?.(btn.dataset.jumpBiome, btn.dataset.jumpSpecies);
        if (window.innerWidth < 900) this.toggle(false);
      });
    });
    this.drawerEl.querySelectorAll('[data-pulse-hint]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.callbacks.onPulseHint?.(btn.dataset.pulseHint);
        if (window.innerWidth < 900) this.toggle(false);
      });
    });
  }
}
