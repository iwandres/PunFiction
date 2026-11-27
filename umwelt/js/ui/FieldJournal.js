/**
 * UMWELT: Animal Optics — Collapsible Right Ecological Field Journal Drawer
 */
import { BIOMES, MYSTERIES, getSpecies } from '../data/biomes.js?v=10';

export class FieldJournalDrawer {
  constructor(drawerEl, callbacks = {}) {
    this.drawerEl = drawerEl;
    this.callbacks = callbacks;
    this.open = false;
  }

  toggle(forceState) {
    this.open = typeof forceState === 'boolean' ? forceState : !this.open;
    this.drawerEl.classList.toggle('open', this.open);
    if (this.open) {
      this.drawerEl.removeAttribute('inert');
    } else {
      this.drawerEl.setAttribute('inert', '');
      if (document.activeElement && this.drawerEl.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      window.scrollTo(0, 0);
    }
    this.callbacks.onToggle?.(this.open);
  }

  render({ activeBiomeId, activeSpeciesSlug, journal }) {
    const solvedIds = new Set((journal?.solvedMysteries || []).map((m) => m.mysteryId));
    const solvedCount = solvedIds.size;
    const totalPoints = journal?.totalPoints || 0;

    // Sort biomes so the active biome is listed first
    const orderedBiomes = [...BIOMES].sort((a, b) => (a.id === activeBiomeId ? -1 : b.id === activeBiomeId ? 1 : 0));

    const bodyHtml = orderedBiomes.map((biome) => {
      const list = MYSTERIES.filter((m) => m.biomeId === biome.id);
      const biomeSolved = list.filter((m) => solvedIds.has(m.mysteryId)).length;
      return `
        <div class="journal-group ${biome.id === activeBiomeId ? 'is-active-biome' : ''}">
          <div class="jg-head">
            <span>${biome.shortName}</span>
            <span class="jg-count">${biomeSolved}/${list.length}</span>
          </div>
          ${list.map((m) => {
            const solved = solvedIds.has(m.mysteryId);
            const sp = getSpecies(m.biomeId, m.requiredSpeciesSlug);
            const isCurrent = m.biomeId === activeBiomeId && m.requiredSpeciesSlug === activeSpeciesSlug;
            return `
              <article class="mystery-card ${solved ? 'solved' : ''} ${isCurrent ? 'current' : ''}">
                <div class="mc-top">
                  <span class="mc-species">${sp.icon} ${sp.name}</span>
                  <span class="mc-badge">${solved ? '✓ LOGGED' : `+${m.points} PTS`}</span>
                </div>
                <h4>${m.title}</h4>
                <p class="mc-clue">${m.cluePrompt}</p>
                ${solved
                  ? `<div class="mc-codex"><strong>Scientific Codex:</strong> ${m.scientificReveal}</div>`
                  : `<div class="mc-actions">
                       <button type="button" class="mc-btn" data-jump-biome="${m.biomeId}" data-jump-species="${m.requiredSpeciesSlug}">
                         ${isCurrent ? '🎯 Click Target in View' : `Switch to ${sp.shortName} ➔`}
                       </button>
                       ${isCurrent ? `<button type="button" class="mc-btn ghost" data-pulse-hint="${m.mysteryId}">✦ Pulse Region</button>` : ''}
                     </div>`
                }
              </article>
            `;
          }).join('')}
        </div>
      `;
    }).join('');

    this.drawerEl.innerHTML = `
      <div class="drawer-header">
        <div>
          <div class="drawer-eyebrow">ECOLOGICAL FIELD JOURNAL</div>
          <h2 class="drawer-title">Hidden in Plain Sight</h2>
        </div>
        <button type="button" class="icon-close-btn" id="btn-close-journal" aria-label="Close Field Journal">✕</button>
      </div>
      <div class="drawer-stats-bar">
        <div class="ds-pill"><span>DISCOVERIES</span><strong>${solvedCount} / ${MYSTERIES.length}</strong></div>
        <div class="ds-pill"><span>FIELD PTS</span><strong>${totalPoints}</strong></div>
      </div>
      <div class="drawer-body">${bodyHtml}</div>
    `;

    this.drawerEl.querySelector('#btn-close-journal')?.addEventListener('click', () => this.toggle(false));
    this.drawerEl.querySelectorAll('[data-jump-biome]').forEach((btn) => {
      btn.addEventListener('click', () => {
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
