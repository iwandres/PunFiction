/**
 * UMWELT: Animal Optics — Custom Species-Specific Optical Cursor Reticles & Portia 360 Radar
 */

export class OpticalCursorHUD {
  constructor(reticleEl, radarEl) {
    this.reticleEl = reticleEl;
    this.radarEl = radarEl;
    this.speciesSlug = 'human_meadow';
    this.visible = false;
  }

  setSpecies(species) {
    this.speciesSlug = species.slug;
    this.reticleEl.dataset.species = species.slug;
    if (this.radarEl) {
      this.radarEl.classList.toggle('hidden', species.slug !== 'jumping_spider');
    }
    this._buildReticleSvg(species);
  }

  _buildReticleSvg(species) {
    const slug = species.slug;
    const accent = species.accentColor || '#34d399';
    let svg = '';
    if (slug === 'kestrel') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="52" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.85"/>
        <circle cx="60" cy="60" r="18" fill="none" stroke="#e9d5ff" stroke-width="1.2" opacity="0.9"/>
        <line x1="60" y1="2" x2="60" y2="20" stroke="${accent}" stroke-width="1.5"/>
        <line x1="60" y1="100" x2="60" y2="118" stroke="${accent}" stroke-width="1.5"/>
        <line x1="2" y1="60" x2="20" y2="60" stroke="${accent}" stroke-width="1.5"/>
        <line x1="100" y1="60" x2="118" y2="60" stroke="${accent}" stroke-width="1.5"/>
      </svg><span class="reticle-tag">2.2× FOVEA · UV 370nm</span>`;
    } else if (slug === 'cuttlefish') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="44" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
        <g class="pol-axis-group" transform="rotate(42 60 60)">
          <line x1="16" y1="60" x2="104" y2="60" stroke="#cffafe" stroke-width="2" stroke-dasharray="4 3"/>
          <polygon points="104,60 95,55 95,65" fill="#22d3ee"/>
          <polygon points="16,60 25,55 25,65" fill="#22d3ee"/>
        </g>
        <path d="M 46 56 Q 53 68 60 56 Q 67 68 74 56" fill="none" stroke="#22d3ee" stroke-width="1.8"/>
      </svg><span class="reticle-tag" id="reticle-readout">e-VEC θ = 42°</span>`;
    } else if (slug === 'hammerhead') {
      svg = `<svg viewBox="0 0 150 90" class="reticle-svg wide">
        <path d="M 14 45 L 40 30 L 110 30 L 136 45 L 110 60 L 40 60 Z" fill="none" stroke="${accent}" stroke-width="1.6" opacity="0.85"/>
        <circle cx="24" cy="45" r="4" fill="#38bdf8"/>
        <circle cx="126" cy="45" r="4" fill="#38bdf8"/>
        <circle cx="75" cy="45" r="14" fill="none" stroke="#22d3ee" stroke-width="1.2" stroke-dasharray="3 3"/>
      </svg><span class="reticle-tag" id="reticle-readout">AMPULLAE · nV/cm</span>`;
    } else if (slug === 'jumping_spider') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle class="defocus-g" cx="56" cy="60" r="32" fill="none" stroke="#34d399" stroke-width="2" opacity="0.9"/>
        <circle class="defocus-m" cx="64" cy="60" r="32" fill="none" stroke="#e879f9" stroke-width="2" opacity="0.9"/>
        <circle cx="60" cy="60" r="3" fill="#fff"/>
      </svg><span class="reticle-tag" id="reticle-readout">DEFOCUS RANGE</span>`;
    } else if (slug === 'vampire_bat') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="24" fill="none" stroke="#22d3ee" stroke-width="1.5" opacity="0.85"/>
        <circle cx="60" cy="60" r="42" fill="none" stroke="#22d3ee" stroke-width="1" stroke-dasharray="4 6" opacity="0.65"/>
        <circle cx="60" cy="60" r="4" fill="#f43f5e"/>
      </svg><span class="reticle-tag" id="reticle-readout">60–90 kHz · TRPV1</span>`;
    } else if (slug === 'mantis_shrimp') {
      svg = `<svg viewBox="0 0 140 90" class="reticle-svg wide">
        <g transform="rotate(-15 70 45)">
          <rect x="10" y="31" width="120" height="28" rx="6" fill="none" stroke="#ec4899" stroke-width="1.6"/>
          <line x1="16" y1="45" x2="124" y2="45" stroke="#fde047" stroke-width="1" stroke-dasharray="4 4"/>
        </g>
      </svg><span class="reticle-tag">12-CH MIDBAND · CPL</span>`;
    } else if (slug === 'rattlesnake') {
      svg = `<svg viewBox="0 0 110 110" class="reticle-svg">
        <circle cx="55" cy="55" r="30" fill="none" stroke="#f43f5e" stroke-width="1.6" stroke-dasharray="5 3"/>
        <circle cx="55" cy="55" r="3" fill="#fde047"/>
      </svg><span class="reticle-tag" id="reticle-readout">IR 8–12 μm</span>`;
    } else if (slug === 'dragonfly') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <path d="M 18 60 A 42 42 0 0 1 102 60" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
        <path d="M 18 60 A 42 42 0 0 0 102 60" fill="none" stroke="#4ade80" stroke-width="1.4" stroke-dasharray="4 3"/>
        <line x1="12" y1="60" x2="108" y2="60" stroke="#7dd3fc" stroke-width="1" opacity="0.8"/>
        <circle cx="60" cy="60" r="3" fill="#22d3ee"/>
      </svg><span class="reticle-tag" id="reticle-readout">200 Hz · STMD</span>`;
    } else if (slug === 'cutthroat_trout') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="44" fill="none" stroke="#2dd4bf" stroke-width="1.6"/>
        <circle cx="60" cy="60" r="38" fill="none" stroke="#f97316" stroke-width="1" stroke-dasharray="6 4" opacity="0.8"/>
        <circle cx="60" cy="60" r="3" fill="#a7f3d0"/>
      </svg><span class="reticle-tag" id="reticle-readout">SNELL 97.2° · TIR</span>`;
    } else if (slug === 'hummingbird') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="34" fill="none" stroke="#f472b6" stroke-width="1.6"/>
        <circle cx="60" cy="60" r="24" fill="none" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="4 3"/>
        <circle cx="60" cy="60" r="3" fill="#fde047"/>
      </svg><span class="reticle-tag" id="reticle-readout">UV+RED TETRA</span>`;
    } else if (slug === 'nautilus') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="46" fill="none" stroke="#94a3b8" stroke-width="1.4" opacity="0.75"/>
        <circle class="pinhole-iris" cx="60" cy="60" r="20" fill="none" stroke="#7dd3fc" stroke-width="2"/>
        <circle cx="60" cy="60" r="2.5" fill="#e2e8f0"/>
      </svg><span class="reticle-tag" id="reticle-readout">PINHOLE 1.30 mm</span>`;
    } else if (slug === 'archerfish') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#38bdf8" stroke-width="1.6"/>
        <line x1="60" y1="8" x2="60" y2="26" stroke="#34d399" stroke-width="1.6"/>
        <line x1="60" y1="94" x2="60" y2="112" stroke="#34d399" stroke-width="1.6"/>
        <line x1="8" y1="60" x2="26" y2="60" stroke="#34d399" stroke-width="1.6"/>
        <line x1="94" y1="60" x2="112" y2="60" stroke="#34d399" stroke-width="1.6"/>
        <circle cx="60" cy="60" r="4" fill="none" stroke="#fde047" stroke-width="1.5"/>
      </svg><span class="reticle-tag" id="reticle-readout">n=1.333 · LOCK</span>`;
    } else if (slug === 'scallop') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="36" fill="none" stroke="#e2e8f0" stroke-width="1.4" stroke-dasharray="3 4"/>
        <circle cx="44" cy="52" r="9" fill="none" stroke="#38bdf8" stroke-width="1.2"/>
        <circle cx="76" cy="52" r="9" fill="none" stroke="#38bdf8" stroke-width="1.2"/>
        <circle cx="60" cy="74" r="9" fill="none" stroke="#38bdf8" stroke-width="1.2"/>
      </svg><span class="reticle-tag" id="reticle-readout">200 MIRRORS · OFF</span>`;
    } else if (slug === 'spectacled_owl') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="40" fill="none" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="8 4"/>
        <path d="M 24 44 A 38 38 0 0 0 24 76" fill="none" stroke="#22d3ee" stroke-width="1.8"/>
        <path d="M 96 44 A 38 38 0 0 1 96 76" fill="none" stroke="#fbbf24" stroke-width="1.8"/>
        <circle cx="60" cy="60" r="3" fill="#fde68a"/>
      </svg><span class="reticle-tag" id="reticle-readout">ITD·ILD SILENT</span>`;
    } else if (slug === 'treefrog') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="36" fill="none" stroke="#84cc16" stroke-width="1.6"/>
        <circle cx="60" cy="60" r="24" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4 4"/>
        <circle cx="60" cy="60" r="3" fill="#bef264"/>
      </svg><span class="reticle-tag" id="reticle-readout">435+502nm · BUG DET</span>`;
    } else if (slug === 'ogre_spider') {
      svg = `<svg viewBox="0 0 120 120" class="reticle-svg">
        <circle cx="60" cy="60" r="46" fill="none" stroke="#f59e0b" stroke-width="1.8"/>
        <circle cx="60" cy="60" r="14" fill="none" stroke="#fef3c7" stroke-width="1.3" stroke-dasharray="3 3"/>
        <circle cx="60" cy="60" r="2.5" fill="#fde68a"/>
      </svg><span class="reticle-tag" id="reticle-readout">f/0.58 · 2000×</span>`;
    } else {
      svg = `<svg viewBox="0 0 90 90" class="reticle-svg small">
        <circle cx="45" cy="45" r="20" fill="none" stroke="${accent}" stroke-width="1.4" opacity="0.75"/>
        <circle cx="45" cy="45" r="2.5" fill="${accent}"/>
      </svg><span class="reticle-tag" id="reticle-readout">${species.sensoryTag}</span>`;
    }
    this.reticleEl.innerHTML = svg;
  }

  update(normX, normY, state = {}) {
    if (!this.reticleEl) return;
    if (state.hide) {
      this.reticleEl.classList.add('hidden');
      return;
    }
    this.reticleEl.classList.remove('hidden');
    this.reticleEl.style.left = `${(normX * 100).toFixed(2)}%`;
    this.reticleEl.style.top = `${(normY * 100).toFixed(2)}%`;

    const readout = this.reticleEl.querySelector('#reticle-readout');
    if (this.speciesSlug === 'cuttlefish') {
      const deg = Math.round(((state.polAngleRad || 0) * 180) / Math.PI);
      const grp = this.reticleEl.querySelector('.pol-axis-group');
      if (grp) grp.setAttribute('transform', `rotate(${deg} 60 60)`);
      if (readout) readout.textContent = `e-VEC θ = ${deg}°`;
    } else if (this.speciesSlug === 'jumping_spider') {
      const depth = state.depthAtCursor ?? 0.5;
      const distCm = Math.round((1.05 - depth) * 32 + 4);
      const spread = Math.round(Math.abs(depth - (state.targetDepth ?? 0.55)) * 18);
      const gCirc = this.reticleEl.querySelector('.defocus-g');
      const mCirc = this.reticleEl.querySelector('.defocus-m');
      if (gCirc) gCirc.setAttribute('cx', String(60 - spread));
      if (mCirc) mCirc.setAttribute('cx', String(60 + spread));
      if (readout) readout.textContent = `RANGE ${distCm} cm`;
    } else if (this.speciesSlug === 'hammerhead' && readout) {
      const nV = Math.round(state.dipoleStrength ?? 12);
      readout.textContent = `${nV} nV/cm · 1.2 Hz`;
    } else if (this.speciesSlug === 'rattlesnake' && readout) {
      const tempC = (state.estimatedTempC ?? 24.5).toFixed(1);
      readout.textContent = `${tempC}°C · IR`;
    } else if (this.speciesSlug === 'nautilus') {
      const ap = state.apertureMm ?? 1.3;
      const iris = this.reticleEl.querySelector('.pinhole-iris');
      if (iris) {
        const r = 7 + ((ap - 0.4) / 2.4) * 32;
        iris.setAttribute('r', r.toFixed(1));
      }
      if (readout) {
        const note = ap < 0.72 ? 'DIM·SHARP' : ap > 2.05 ? 'BRIGHT·BLUR' : 'BALANCED';
        readout.textContent = `Ø ${ap.toFixed(2)} mm · ${note}`;
      }
    } else if (this.speciesSlug === 'spectacled_owl' && readout) {
      const db = Math.round(state.binauralDb ?? 18);
      readout.textContent = `ITD LOCK · ${db} dB`;
    } else if (this.speciesSlug === 'ogre_spider' && readout) {
      const depth = state.depthAtCursor ?? 0.5;
      const cm = Math.round((1.05 - depth) * 48 + 18);
      readout.textContent = `f/0.58 · ${cm} cm`;
    }

    // Update Portia 360-degree peripheral motion radar strip
    if (this.speciesSlug === 'jumping_spider' && this.radarEl) {
      const track = this.radarEl.querySelector('.radar-blips');
      if (track) {
        const blips = state.radarBlips && state.radarBlips.length
          ? state.radarBlips
          : [{ angleRad: Math.sin(performance.now() * 0.0007) * 2.4, dist: 0.45 }];
        track.innerHTML = blips.map((b) => {
          const pct = (((b.angleRad / Math.PI) * 50) + 50 + 100) % 100;
          const urgency = b.dist < 0.25 ? 'danger' : 'warn';
          return `<span class="radar-blip ${urgency}" style="left:${pct.toFixed(1)}%"></span>`;
        }).join('');
      }
    }
  }
}
