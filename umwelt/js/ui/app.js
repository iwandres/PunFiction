/**
 * UMWELT: Animal Optics — Main Interactive Controller
 * Connects WebGL2 Multi-Pass Engine, Field Journal Discovery Loop, Optical Cursor Reticles,
 * Photoreceptor Chart, Synchronized Split-Screen Curtain, Binaural Audio & Render/MongoDB Atlas API.
 */
import {
  BIOMES,
  MYSTERIES,
  getBiome,
  getSpecies,
  getMysteryForSpecies,
} from '../data/biomes.js?v=4';
import { UmweltRenderer } from '../engine/UmweltRenderer.js?v=7';
import { AudioSynthesizer } from '../engine/AudioSynthesizer.js?v=1';
import { InputController } from '../engine/InputController.js?v=1';
import { renderPhotoreceptorChart } from './PhotoreceptorChart.js?v=1';
import { OpticalCursorHUD } from './OpticalCursorHUD.js?v=1';
import { FieldJournalDrawer } from './FieldJournal.js?v=4';

const IS_LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = window.UMWELT_API_URL
  || (IS_LOCAL ? `${window.location.origin}/api/umwelt` : 'https://punfiction.onrender.com/api/umwelt');

const STORAGE_UUID_KEY = 'umwelt_client_uuid_v1';
const STORAGE_JOURNAL_KEY = 'umwelt_journal_v1';

function getOrCreateClientUuid() {
  let id = localStorage.getItem(STORAGE_UUID_KEY);
  if (!id) {
    id = (crypto?.randomUUID?.() || `umw-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
    localStorage.setItem(STORAGE_UUID_KEY, id);
  }
  return id;
}

function loadLocalJournal(clientUuid) {
  try {
    const raw = localStorage.getItem(STORAGE_JOURNAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.solvedMysteries)) return parsed;
    }
  } catch {
    // ignore corrupted storage
  }
  return {
    clientUuid,
    solvedMysteries: [],
    unlockedCodexEntries: [],
    totalPoints: 0,
  };
}

function saveLocalJournal(journal) {
  try {
    localStorage.setItem(STORAGE_JOURNAL_KEY, JSON.stringify(journal));
  } catch {
    // ignore storage quota
  }
}

function mergeJournals(localJ, remoteJ) {
  if (!remoteJ || !Array.isArray(remoteJ.solvedMysteries)) return localJ;
  const solvedMap = new Map();
  for (const item of [...(localJ.solvedMysteries || []), ...(remoteJ.solvedMysteries || [])]) {
    if (item?.mysteryId) solvedMap.set(item.mysteryId, item);
  }
  const codex = Array.from(new Set([...(localJ.unlockedCodexEntries || []), ...(remoteJ.unlockedCodexEntries || [])]));
  return {
    ...localJ,
    ...remoteJ,
    solvedMysteries: Array.from(solvedMap.values()),
    unlockedCodexEntries: codex,
    totalPoints: Math.max(localJ.totalPoints || 0, remoteJ.totalPoints || 0),
  };
}

class UmweltApp {
  constructor() {
    this.clientUuid = getOrCreateClientUuid();
    this.journal = loadLocalJournal(this.clientUuid);
    this.biomeId = 'meadow';
    this.speciesSlug = 'human_meadow';
    this.lightingPreset = 'Alpine Noon';
    this.speciesEnteredAt = performance.now();
    this.sonarPingedForCurrent = false;
    this.photoreceptorCollapsed = window.innerWidth < 860;
    this.draggingSplit = false;
    this.hintPulseTimer = null;

    this._grabDom();
  }

  _grabDom() {
    this.el = {
      viewport: document.getElementById('viewport'),
      glCanvas: document.getElementById('gl-canvas'),
      webglFallback: document.getElementById('webgl-fallback'),
      biomeTabs: document.getElementById('biome-tabs'),
      lightingSelect: document.getElementById('lighting-select'),
      plateStatusPill: document.getElementById('plate-status-pill'),
      btnSplit: document.getElementById('btn-split'),
      btnJournal: document.getElementById('btn-journal'),
      journalCountBadge: document.getElementById('journal-count-badge'),
      btnAudio: document.getElementById('btn-audio'),
      btnReducedMotion: document.getElementById('btn-reduced-motion'),
      btnGyro: document.getElementById('btn-gyro'),
      elevationGauge: document.getElementById('elevation-gauge'),
      specCard: document.getElementById('photoreceptor-card'),
      specToggle: document.getElementById('btn-toggle-spec'),
      specBody: document.getElementById('photoreceptor-body'),
      specTitle: document.getElementById('spec-species-name'),
      specSci: document.getElementById('spec-sci-name'),
      specSummary: document.getElementById('spec-summary'),
      specChart: document.getElementById('spec-chart'),
      speciesDock: document.getElementById('species-dock'),
      journalDrawer: document.getElementById('field-journal-drawer'),
      cursorReticle: document.getElementById('optical-cursor'),
      spiderRadar: document.getElementById('spider-radar'),
      splitHandle: document.getElementById('split-handle'),
      splitLabelLeft: document.getElementById('split-label-left'),
      splitLabelRight: document.getElementById('split-label-right'),
      polControl: document.getElementById('pol-control'),
      polSlider: document.getElementById('pol-slider'),
      polDegLabel: document.getElementById('pol-deg-label'),
      sonarControl: document.getElementById('sonar-control'),
      btnSonarPing: document.getElementById('btn-sonar-ping'),
      objectiveStrip: document.getElementById('objective-strip'),
      hintPulseEl: document.getElementById('hint-pulse'),
      toastHost: document.getElementById('toast-host'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalCard: document.getElementById('modal-card'),
    };
  }

  async init() {
    this.audio = new AudioSynthesizer();
    this.renderer = new UmweltRenderer(this.el.glCanvas, API_BASE);
    const glOk = await this.renderer.init();
    if (!glOk) {
      this.el.webglFallback?.classList.remove('hidden');
      return;
    }

    this.cursorHud = new OpticalCursorHUD(this.el.cursorReticle, this.el.spiderRadar);
    this.journalDrawer = new FieldJournalDrawer(this.el.journalDrawer, {
      onJumpToSpecies: (bId, spSlug) => this.selectBiomeAndSpecies(bId, spSlug),
      onPulseHint: (mysteryId) => this.pulseMysteryHint(mysteryId),
    });

    this.input = new InputController(this.el.viewport, {
      onSlotKey: (slot) => this._onSlotKey(slot),
      onSpaceKey: () => this.toggleSplitCompare(),
      onKeyE: () => this._onKeyE(),
      onToggleSplit: () => this.toggleSplitCompare(),
      onToggleAudio: () => this.toggleAudio(),
      onEscape: () => this._onEscape(),
      onPointerMove: (nx, ny) => this._onPointerMove(nx, ny),
      onViewportClick: (nx, ny) => this._onViewportClick(nx, ny),
      onWheel: (deltaY) => this._onWheel(deltaY),
    });

    this.renderer.onPlateStatus = (info) => this._onPlateStatus(info);
    this.renderer.onFrame = (dt, timeSec) => this._onFrame(dt, timeSec);

    this._bindUIEvents();
    this._syncTopBarHeight();
    this._renderBiomeTabs();
    this._applyPhotoreceptorCollapse();

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.renderer.state.reducedMotion = true;
      this.el.btnReducedMotion?.classList.add('active');
    }

    await this.selectBiomeAndSpecies('meadow', 'human_meadow', 'Alpine Noon', false);
    this.renderer.start();

    window.addEventListener('resize', () => {
      this.renderer.resize();
    });

    this._syncJournalFromBackend();
  }

  _bindUIEvents() {
    this.el.lightingSelect.addEventListener('change', () => {
      this.lightingPreset = this.el.lightingSelect.value;
      this.renderer.setView(this.biomeId, this.speciesSlug, this.lightingPreset, false);
      this._renderSpeciesDock();
    });

    this.el.btnSplit.addEventListener('click', () => this.toggleSplitCompare());
    this.el.btnJournal.addEventListener('click', () => this.journalDrawer.toggle());
    this.el.btnAudio.addEventListener('click', () => this.toggleAudio());
    this.el.btnReducedMotion.addEventListener('click', () => {
      this.renderer.state.reducedMotion = !this.renderer.state.reducedMotion;
      this.el.btnReducedMotion.classList.toggle('active', this.renderer.state.reducedMotion);
      this.showToast(this.renderer.state.reducedMotion ? 'Reduced Motion enabled (vestibular-safe)' : 'Full 2.5D parallax motion active');
    });

    if (this.el.btnGyro) {
      this.el.btnGyro.addEventListener('click', async () => {
        const on = await this.input.toggleGyroscope();
        this.el.btnGyro.classList.toggle('active', on);
        this.showToast(on ? 'Gyroscope tilt look enabled' : 'Gyroscope disabled / unavailable on this device');
      });
    }

    this.el.specToggle.addEventListener('click', () => {
      this.photoreceptorCollapsed = !this.photoreceptorCollapsed;
      this._applyPhotoreceptorCollapse();
    });

    this.el.polSlider.addEventListener('input', () => {
      const deg = Number(this.el.polSlider.value);
      this.renderer.state.polAngleRad = (deg * Math.PI) / 180;
      this.el.polDegLabel.textContent = `${deg}°`;
    });

    this.el.btnSonarPing.addEventListener('click', () => {
      this._triggerBatSonar(this.renderer.state.cursorX, this.renderer.state.cursorY);
    });

    this.el.splitHandle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.draggingSplit = true;
      this.el.splitHandle.setPointerCapture?.(e.pointerId);
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.draggingSplit) return;
      const rect = this.el.viewport.getBoundingClientRect();
      const x = Math.max(0.08, Math.min(0.92, (e.clientX - rect.left) / rect.width));
      this.renderer.state.splitX = x;
      this._positionSplitHandle();
    });
    window.addEventListener('pointerup', () => {
      this.draggingSplit = false;
    });

    this.el.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.el.modalOverlay) this._closeModal();
    });
  }

  _syncTopBarHeight() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar || !this.el.viewport) return;
    const apply = () => {
      const h = Math.ceil(topBar.getBoundingClientRect().height);
      this.el.viewport.style.setProperty('--topbar-h', `${Math.max(46, h)}px`);
    };
    apply();
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(apply).observe(topBar);
    }
    window.addEventListener('resize', apply);
  }

  _applyPhotoreceptorCollapse() {
    this.el.specCard.classList.toggle('collapsed', this.photoreceptorCollapsed);
    this.el.specToggle.textContent = this.photoreceptorCollapsed ? 'Expand ▾' : 'Collapse ▴';
  }

  _renderBiomeTabs() {
    this.el.biomeTabs.innerHTML = BIOMES.map((b) => `
      <button type="button" class="biome-tab ${b.id === this.biomeId ? 'active' : ''}" data-biome="${b.id}">
        ${b.shortName}
      </button>
    `).join('');
    this.el.biomeTabs.querySelectorAll('.biome-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.biome === this.biomeId) return;
        const targetBiome = getBiome(btn.dataset.biome);
        this.selectBiomeAndSpecies(targetBiome.id, targetBiome.species[0].slug, targetBiome.lightingPresets[0].id);
      });
    });
  }

  _renderLightingSelect(biome) {
    this.el.lightingSelect.innerHTML = biome.lightingPresets.map((p) => `
      <option value="${p.id}" ${p.id === this.lightingPreset ? 'selected' : ''}>${p.label}</option>
    `).join('');
  }

  async selectBiomeAndSpecies(biomeId, speciesSlug, lightingPreset = null, triggerSwoop = true) {
    const biome = getBiome(biomeId);
    const species = getSpecies(biome.id, speciesSlug);
    const preset = lightingPreset || (biome.id === this.biomeId ? this.lightingPreset : biome.lightingPresets[0].id);

    this.biomeId = biome.id;
    this.speciesSlug = species.slug;
    this.lightingPreset = preset;
    this.speciesEnteredAt = performance.now();
    this.sonarPingedForCurrent = species.slug === 'vampire_bat';

    this._renderBiomeTabs();
    this._renderLightingSelect(biome);
    this._renderElevationGauge(biome, species);
    this._renderSpeciesDock();
    this._renderPhotoreceptorPanel(species);
    this._renderObjectiveStrip(biome, species);
    this._renderMechanicControls(species);

    this.cursorHud.setSpecies(species);
    this.audio.setSpecies(biome.id, species.slug);
    this.el.splitLabelRight.textContent = `${species.shortName.toUpperCase()} UMWELT`;
    this.el.splitLabelLeft.textContent = biome.id === 'reef' ? 'HUMAN DIVER' : biome.id === 'cloudforest' ? 'HUMAN NIGHT' : 'HUMAN RGB';

    this._refreshJournalUI();

    await this.renderer.setView(biome.id, species.slug, preset, triggerSwoop);
  }

  _renderElevationGauge(biome, species) {
    const sc = biome.scale;
    const val = species.elevationM;
    const pct = Math.max(4, Math.min(96, ((val - sc.min) / (sc.max - sc.min)) * 100));

    let reefExtra = '';
    if (sc.mode === 'depth') {
      const depthM = Math.abs(val);
      const atm = (1 + depthM / 10).toFixed(2);
      const redLoss = Math.min(99, Math.round((1 - Math.exp(-0.38 * depthM)) * 100));
      reefExtra = `
        <div class="gauge-metric"><span>PRESS</span><strong>${atm} atm</strong></div>
        <div class="gauge-metric"><span>RED LOSS</span><strong>${redLoss}%</strong></div>
      `;
    }

    const ticks = biome.species.map((sp) => {
      const tPct = Math.max(4, Math.min(96, ((sp.elevationM - sc.min) / (sc.max - sc.min)) * 100));
      const active = sp.slug === species.slug;
      return `<div class="gauge-tick ${active ? 'active' : ''}" style="bottom:${tPct.toFixed(1)}%" title="${sp.name}: ${sp.elevationM}m">
        <span class="gt-dot"></span>
        ${active ? `<span class="gt-val">${sp.elevationM > 0 && sc.mode === 'elevation' ? '+' : ''}${sp.elevationM.toFixed(2).replace(/\.00$/, '')}m</span>` : ''}
      </div>`;
    }).join('');

    this.el.elevationGauge.innerHTML = `
      <div class="gauge-cap">${sc.maxLabel}</div>
      <div class="gauge-track">
        <div class="gauge-fill" style="height:${pct.toFixed(1)}%"></div>
        ${ticks}
      </div>
      <div class="gauge-cap">${sc.minLabel}</div>
      ${reefExtra}
    `;
  }

  _renderSpeciesDock() {
    const biome = getBiome(this.biomeId);
    const solvedSet = new Set((this.journal.solvedMysteries || []).map((m) => m.mysteryId));

    this.el.speciesDock.innerHTML = biome.species.map((sp) => {
      const active = sp.slug === this.speciesSlug;
      const ready = this.renderer.isPlateReady(biome.id, sp.slug, this.lightingPreset);
      const mystery = getMysteryForSpecies(biome.id, sp.slug);
      const mystSolved = mystery && solvedSet.has(mystery.mysteryId);

      return `
        <button type="button" class="species-btn ${active ? 'active' : ''}" data-species="${sp.slug}" style="--sp-accent:${sp.accentColor}">
          <span class="sb-key">${sp.slot}</span>
          <span class="sb-ready ${ready ? 'ready' : ''}" title="${ready ? 'Plate Ready' : 'Procedural / On-Demand'}"></span>
          <div class="sb-icon">${sp.icon}</div>
          <div class="sb-info">
            <div class="sb-name">${sp.shortName}</div>
            <div class="sb-tag">${sp.sensoryTag}</div>
          </div>
          <div class="sb-meta">
            <span class="sb-elev">${sp.elevationM}m</span>
            ${mystSolved ? '<span class="sb-badge done" title="Field Mystery Logged">✓</span>' : ''}
          </div>
        </button>
      `;
    }).join('');

    this.el.speciesDock.querySelectorAll('.species-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectBiomeAndSpecies(this.biomeId, btn.dataset.species, this.lightingPreset);
      });
    });
  }

  _renderPhotoreceptorPanel(species) {
    this.el.specTitle.textContent = `${species.icon} ${species.name}`;
    this.el.specSci.textContent = `${species.scientificName} · ${species.vantageLabel}`;
    this.el.specSummary.textContent = species.summary;
    renderPhotoreceptorChart(this.el.specChart, species);
  }

  _renderMechanicControls(species) {
    this.el.polControl.classList.toggle('hidden', species.slug !== 'cuttlefish');
    this.el.sonarControl.classList.toggle('hidden', species.slug !== 'vampire_bat');
    this._syncPolarizationUI(Math.round((this.renderer.state.polAngleRad * 180) / Math.PI));
  }

  _syncPolarizationUI(deg) {
    const clean = ((Math.round(deg) % 180) + 180) % 180;
    if (this.el.polSlider) this.el.polSlider.value = String(clean);
    if (this.el.polDegLabel) this.el.polDegLabel.textContent = `${clean}°`;
  }

  _renderObjectiveStrip(biome, species) {
    const mystery = getMysteryForSpecies(biome.id, species.slug);
    const solved = mystery && (this.journal.solvedMysteries || []).some((m) => m.mysteryId === mystery.mysteryId);

    if (!mystery) {
      this.el.objectiveStrip.innerHTML = `
        <span class="obj-tag">BASELINE POV</span>
        <span class="obj-text">Observe how humans perceive ${biome.shortName}, then select species <strong>[2–5]</strong> below to step into their ecological vantage points &amp; uncover hidden phenomena.</span>
      `;
      return;
    }

    if (solved) {
      this.el.objectiveStrip.innerHTML = `
        <span class="obj-tag solved">✓ CODEX LOGGED</span>
        <span class="obj-text"><strong>${mystery.title}</strong> discovered! Toggle <strong>Split Compare (Space)</strong> to see Human vs. ${species.shortName} side-by-side.</span>
      `;
    } else {
      this.el.objectiveStrip.innerHTML = `
        <span class="obj-tag">🔬 FIELD MYSTERY</span>
        <span class="obj-text"><strong>${mystery.title}:</strong> ${species.mechanic?.hint || mystery.cluePrompt} — <em>Click the hidden subject to log it!</em></span>
      `;
    }
  }

  _onPlateStatus({ status, label }) {
    this._renderSpeciesDock();
    if (!this.el.plateStatusPill) return;
    if (status === 'ready') {
      this.el.plateStatusPill.textContent = `● ${label}`;
      this.el.plateStatusPill.dataset.state = 'ready';
    } else if (status === 'synthesizing' || status === 'loading') {
      this.el.plateStatusPill.textContent = `◌ ${label}`;
      this.el.plateStatusPill.dataset.state = 'loading';
    } else if (status === 'procedural') {
      this.el.plateStatusPill.textContent = `◐ ${label}`;
      this.el.plateStatusPill.dataset.state = 'procedural';
    }
  }

  _onFrame(dt) {
    const inp = this.input.sampleMovement();
    if (this.speciesSlug === 'cuttlefish' && inp.rotPol !== 0) {
      const next = (this.renderer.state.polAngleRad + inp.rotPol * dt * 1.45 + Math.PI) % Math.PI;
      this.renderer.state.polAngleRad = next;
      this._syncPolarizationUI(Math.round((next * 180) / Math.PI));
    }
    if (this.input.gyroEnabled) {
      this.renderer.state.targetParallaxX = inp.gyroX;
      this.renderer.state.targetParallaxY = inp.gyroY;
    }

    const st = this.renderer.state;
    const sem = st.semantics || {};
    const primary = sem.primaryTarget || { x: 0.5, y: 0.5 };
    const distToPrimary = Math.hypot(st.cursorX - primary.x, st.cursorY - primary.y);

    this.cursorHud.update(st.cursorX, st.cursorY, {
      hide: this.input.isTouchDevice,
      polAngleRad: st.polAngleRad,
      depthAtCursor: this.renderer.sampleDepthAt(st.cursorX, st.cursorY),
      targetDepth: this.renderer.sampleDepthAt(primary.x, primary.y),
      dipoleStrength: Math.max(4, Math.round(145 * Math.exp(-distToPrimary * 5.2))),
      estimatedTempC: 18.0 + 20.2 * Math.exp(-Math.pow(distToPrimary / 0.16, 2)),
      radarBlips: null,
    });
  }

  _onPointerMove(nx, ny) {
    this.renderer.state.cursorX = nx;
    this.renderer.state.cursorY = ny;
    if (!this.input.gyroEnabled) {
      this.renderer.state.targetParallaxX = (nx - 0.5) * 2.0;
      this.renderer.state.targetParallaxY = (ny - 0.5) * 2.0;
    }
  }

  _onWheel(deltaY) {
    if (this.speciesSlug === 'cuttlefish') {
      const step = (deltaY > 0 ? 7 : -7) * (Math.PI / 180);
      const next = (this.renderer.state.polAngleRad + step + Math.PI) % Math.PI;
      this.renderer.state.polAngleRad = next;
      this._syncPolarizationUI(Math.round((next * 180) / Math.PI));
      return true;
    }
    return false;
  }

  _onSlotKey(slot) {
    const biome = getBiome(this.biomeId);
    const sp = biome.species[slot - 1];
    if (sp) this.selectBiomeAndSpecies(biome.id, sp.slug, this.lightingPreset);
  }

  _onKeyE() {
    if (this.speciesSlug === 'vampire_bat') {
      this._triggerBatSonar(this.renderer.state.cursorX, this.renderer.state.cursorY);
    }
  }

  _onEscape() {
    if (!this.el.modalOverlay.classList.contains('hidden')) {
      this._closeModal();
    } else if (this.journalDrawer.open) {
      this.journalDrawer.toggle(false);
    }
  }

  _triggerBatSonar(nx, ny) {
    this.sonarPingedForCurrent = true;
    this.renderer.triggerSonar(nx, ny);
    this.audio.playSonarPing();
    this.input.haptic(16);
  }

  async _onViewportClick(nx, ny) {
    if (this.speciesSlug === 'vampire_bat') {
      this._triggerBatSonar(nx, ny);
    }

    const mystery = getMysteryForSpecies(this.biomeId, this.speciesSlug);
    if (!mystery) return;
    const alreadySolved = (this.journal.solvedMysteries || []).some((m) => m.mysteryId === mystery.mysteryId);
    if (alreadySolved) return;

    const polDeg = Math.round(((this.renderer.state.polAngleRad * 180) / Math.PI + 180) % 180);
    const payload = {
      clientUuid: this.clientUuid,
      mysteryId: mystery.mysteryId,
      biomeId: this.biomeId,
      speciesSlug: this.speciesSlug,
      lightingPreset: this.lightingPreset,
      clickX: nx,
      clickY: ny,
      semantics: this.renderer.state.semantics,
      mechanicState: {
        polarizationDeg: polDeg,
        sonarPinged: this.sonarPingedForCurrent,
      },
      timeToSolveMs: Math.round(performance.now() - this.speciesEnteredAt),
    };

    const localResult = this._verifyDiscoveryLocally(mystery, payload);

    try {
      const resp = await fetch(`${API_BASE}/journal/verify-discovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const remote = await resp.json();
        this._handleDiscoveryResponse(mystery, remote);
        return;
      }
    } catch {
      // Offline / Render cold start fallback -> use localResult seamlessly
    }
    this._handleDiscoveryResponse(mystery, localResult);
  }

  _verifyDiscoveryLocally(mystery, payload) {
    const sem = payload.semantics || getSpecies(mystery.biomeId, mystery.requiredSpeciesSlug).defaultSemantics;
    const target = sem[mystery.targetSemanticKey] || sem.primaryTarget || { x: 0.5, y: 0.5, rx: 0.12, ry: 0.12 };
    const rx = Math.max(0.135, (target.rx || 0.1) * 1.5);
    const ry = Math.max(0.135, (target.ry || 0.1) * 1.5);
    const dx = (payload.clickX - target.x) / rx;
    const dy = (payload.clickY - target.y) / ry;
    const distEl = Math.hypot(dx, dy);

    if (mystery.requiredMechanic === 'polarization_align') {
      const diff = Math.abs(((payload.mechanicState.polarizationDeg - 42 + 90) % 180) - 90);
      if (diff > 48 && distEl <= 1.25) {
        return {
          solved: false,
          reason: 'mechanic_unaligned',
          hint: 'Almost! Dial your linear polarization analyzer closer to ~42° until the glass shrimp pops in electric contrast!',
        };
      }
    }

    if (distEl <= 1.0) {
      return {
        solved: true,
        mysteryId: mystery.mysteryId,
        title: mystery.title,
        codexEntry: mystery.scientificReveal,
        points: mystery.points,
        globalSolveRate: 0.78,
        target,
      };
    }

    const rawDist = Math.hypot(payload.clickX - target.x, payload.clickY - target.y);
    return {
      solved: false,
      reason: 'missed_target',
      hint: rawDist < 0.22 ? 'Very close! Inspect right beside that spot.' : 'Keep scanning with your optical instrument—or use "Pulse Region" in the Field Journal.',
    };
  }

  _handleDiscoveryResponse(mystery, res) {
    if (!res) return;
    if (!res.solved) {
      if (res.hint) this.showToast(res.hint);
      return;
    }

    this.audio.playDiscoveryUnlock();
    this.input.haptic([20, 40, 28]);

    if (res.journal) {
      this.journal = mergeJournals(this.journal, res.journal);
    } else {
      const already = (this.journal.solvedMysteries || []).some((m) => m.mysteryId === mystery.mysteryId);
      if (!already) {
        this.journal.solvedMysteries.push({
          mysteryId: mystery.mysteryId,
          biomeId: mystery.biomeId,
          speciesSlug: mystery.requiredSpeciesSlug,
          solvedAt: new Date().toISOString(),
        });
        this.journal.unlockedCodexEntries.push(mystery.mysteryId);
        this.journal.totalPoints = (this.journal.totalPoints || 0) + mystery.points;
      }
    }
    saveLocalJournal(this.journal);
    this._refreshJournalUI();
    this._renderSpeciesDock();

    const biome = getBiome(this.biomeId);
    const sp = getSpecies(this.biomeId, this.speciesSlug);
    this._renderObjectiveStrip(biome, sp);

    const ratePct = res.globalSolveRate ? `${Math.round(res.globalSolveRate * 100)}%` : '—';
    this._openModal(`
      <div class="modal-eyebrow">🔬 ECOLOGICAL DISCOVERY LOGGED · +${mystery.points} PTS</div>
      <h3>${sp.icon} ${mystery.title}</h3>
      <p class="modal-desc">${res.codexEntry || mystery.scientificReveal}</p>
      <div class="modal-stats">
        <div><span>DISCOVERIES</span><strong>${this.journal.solvedMysteries.length} / ${MYSTERIES.length}</strong></div>
        <div><span>SPECIES</span><strong>${sp.shortName}</strong></div>
        <div><span>SOLVE RATE</span><strong>${ratePct}</strong></div>
      </div>
      <div class="modal-actions">
        <button type="button" class="m-btn primary" id="modal-close-ok">Continue Exploring</button>
      </div>
    `);
    this.el.modalCard.querySelector('#modal-close-ok')?.addEventListener('click', () => this._closeModal());
  }

  pulseMysteryHint(mysteryId) {
    const mystery = MYSTERIES.find((m) => m.mysteryId === mysteryId);
    if (!mystery) return;
    const sem = this.renderer.state.semantics || getSpecies(mystery.biomeId, mystery.requiredSpeciesSlug).defaultSemantics;
    const target = sem[mystery.targetSemanticKey] || sem.primaryTarget;
    if (!target || !this.el.hintPulseEl) return;

    this.el.hintPulseEl.style.left = `${(target.x * 100).toFixed(2)}%`;
    this.el.hintPulseEl.style.top = `${(target.y * 100).toFixed(2)}%`;
    this.el.hintPulseEl.classList.remove('hidden');
    clearTimeout(this.hintPulseTimer);
    this.hintPulseTimer = setTimeout(() => {
      this.el.hintPulseEl.classList.add('hidden');
    }, 3600);
    this.showToast(`Pulsing sensor region for "${target.label || mystery.title}"...`);
  }

  toggleSplitCompare(forceState) {
    const next = typeof forceState === 'boolean' ? forceState : !this.renderer.state.splitEnabled;
    this.renderer.state.splitEnabled = next;
    this.el.btnSplit.classList.toggle('active', next);
    this.el.splitHandle.classList.toggle('hidden', !next);
    this.el.splitLabelLeft.classList.toggle('hidden', !next);
    this.el.splitLabelRight.classList.toggle('hidden', !next);
    this._positionSplitHandle();
  }

  _positionSplitHandle() {
    const pct = `${(this.renderer.state.splitX * 100).toFixed(2)}%`;
    this.el.splitHandle.style.left = pct;
  }

  toggleAudio() {
    const active = this.audio.toggleMute();
    this.el.btnAudio.classList.toggle('active', active);
    this.el.btnAudio.textContent = active ? '🔊 Sound On' : '🔇 Sound';
    this.showToast(active ? 'Binaural species soundscape enabled' : 'Sound muted');
  }

  _refreshJournalUI() {
    const solved = (this.journal.solvedMysteries || []).length;
    if (this.el.journalCountBadge) {
      this.el.journalCountBadge.textContent = `${solved}/${MYSTERIES.length}`;
    }
    this.journalDrawer.render({
      activeBiomeId: this.biomeId,
      activeSpeciesSlug: this.speciesSlug,
      journal: this.journal,
    });
  }

  async _syncJournalFromBackend() {
    try {
      const resp = await fetch(`${API_BASE}/journal/${encodeURIComponent(this.clientUuid)}`);
      if (!resp.ok) return;
      const remote = await resp.json();
      this.journal = mergeJournals(this.journal, remote);
      saveLocalJournal(this.journal);
      this._refreshJournalUI();
      this._renderSpeciesDock();
    } catch {
      // Offline / Render sleeping — localStorage keeps full progress seamlessly
    }
  }

  _openModal(html) {
    this.el.modalCard.innerHTML = html;
    this.el.modalOverlay.classList.remove('hidden');
  }

  _closeModal() {
    this.el.modalOverlay.classList.add('hidden');
  }

  showToast(message) {
    if (!this.el.toastHost) return;
    const t = document.createElement('div');
    t.className = 'toast-item';
    t.textContent = message;
    this.el.toastHost.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 260);
    }, 3200);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new UmweltApp();
  window.__umweltApp = app;
  app.init();
});
