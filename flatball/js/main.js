// Main Game Controller, Two-Way Match State Machine & Responsive UI for Flatball Tactics
import {
  PLAYER_DEFENSES,
  PLAYER_OFFENSES,
  BOT_OFFENSES,
  BOT_DEFENSES,
  rollPointWind,
  formatWindBadge,
  getEffectiveLook,
  rollBotDefenseState,
  buildDecisionHand
} from './playbookData.js?v=7';
import { Choreographer } from './choreographer.js?v=7';
import { FieldRenderer } from './fieldRenderer.js?v=7';
import { sound } from './audio.js?v=7';

function createSeededRng(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const CARD_ICONS = {
  trap: `<svg viewBox="0 0 28 28" fill="none"><path d="M22 4v20" stroke="#FBBF24" stroke-width="2.4" stroke-dasharray="3 2"/><circle cx="12" cy="15" r="3.5" fill="#FF5A6E"/><path d="M8 10a7 7 0 0 0 0 10" stroke="#00E5FF" stroke-width="2.6" stroke-linecap="round"/><path d="M14 14l6-4" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  poach: `<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="9" r="6.5" stroke="#00E5FF" stroke-width="1.8" stroke-dasharray="3 2"/><circle cx="14" cy="9" r="3" fill="#00E5FF"/><circle cx="9" cy="21" r="2.5" fill="#FF5A6E"/><circle cx="19" cy="21" r="2.5" fill="#FF5A6E"/></svg>`,
  clam: `<svg viewBox="0 0 28 28" fill="none"><path d="M5 10h18M5 19h18" stroke="#00E5FF" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 3"/><circle cx="10" cy="10" r="2.8" fill="#00E5FF"/><circle cx="18" cy="10" r="2.8" fill="#00E5FF"/><circle cx="14" cy="19" r="2.8" fill="#00E5FF"/></svg>`,
  blitz: `<svg viewBox="0 0 28 28" fill="none"><circle cx="9" cy="18" r="3" fill="#FF5A6E"/><circle cx="19" cy="14" r="3" fill="#FF5A6E"/><path d="M12 8l2.5 7.5L18 19" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round"/><circle cx="14" cy="15" r="3" fill="#00E5FF"/></svg>`,
  cup: `<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="9" r="3" fill="#FF5A6E"/><path d="M6 12c2 6 14 6 16 0" stroke="#00E5FF" stroke-width="2.6" stroke-linecap="round"/><circle cx="7" cy="13" r="2.6" fill="#00E5FF"/><circle cx="14" cy="17" r="2.6" fill="#00E5FF"/><circle cx="21" cy="13" r="2.6" fill="#00E5FF"/></svg>`,
  person: `<svg viewBox="0 0 28 28" fill="none"><circle cx="11" cy="15" r="3.4" fill="#FF5A6E"/><circle cx="16.5" cy="13" r="3.4" fill="#00E5FF"/><path d="M13 8.5a7.5 7.5 0 0 1 6 9" stroke="#00E5FF" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  pop: `<svg viewBox="0 0 28 28" fill="none"><path d="M8 10c2 5 10 5 12 0" stroke="#FF5A6E" stroke-width="2" stroke-linecap="round"/><path d="M14 22V11l8-5" stroke="#00E5FF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="11" r="2.8" fill="#00E5FF"/></svg>`,
  break: `<svg viewBox="0 0 28 28" fill="none"><path d="M17 17a6 6 0 0 0-4-7" stroke="#FF5A6E" stroke-width="2.5" stroke-linecap="round"/><path d="M18 21C10 19 9 11 15 6" stroke="#00E5FF" stroke-width="2.4" stroke-linecap="round"/><circle cx="15" cy="6" r="2.6" fill="#00E5FF"/></svg>`,
  weave: `<svg viewBox="0 0 28 28" fill="none"><path d="M8 22l12-5-11-5 11-6" stroke="#00E5FF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="22" r="2.5" fill="#00E5FF"/><circle cx="20" cy="17" r="2.5" fill="#00E5FF"/><circle cx="9" cy="12" r="2.5" fill="#00E5FF"/></svg>`,
  flood: `<svg viewBox="0 0 28 28" fill="none"><path d="M6 15h12" stroke="#FF5A6E" stroke-width="2.2" stroke-dasharray="3 2"/><path d="M9 23V13M15 23V6" stroke="#00E5FF" stroke-width="2.4" stroke-linecap="round"/><circle cx="9" cy="13" r="2.5" fill="#00E5FF"/><circle cx="15" cy="6" r="2.5" fill="#00E5FF"/></svg>`,
  huck: `<svg viewBox="0 0 28 28" fill="none"><path d="M9 23C4 15 8 8 19 5" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round"/><circle cx="19" cy="5" r="3" fill="#00E5FF"/><circle cx="22" cy="16" r="2" fill="#64748B"/><circle cx="22" cy="21" r="2" fill="#64748B"/></svg>`,
  vert: `<svg viewBox="0 0 28 28" fill="none"><path d="M14 8v6l6 4M20 18l-6-13" stroke="#00E5FF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="18" r="2.6" fill="#00E5FF"/><circle cx="14" cy="5" r="2.6" fill="#00E5FF"/></svg>`,
  middle: `<svg viewBox="0 0 28 28" fill="none"><path d="M5 8l7 6M23 8l-7 6" stroke="#00E5FF" stroke-width="2.3" stroke-linecap="round"/><circle cx="14" cy="18" r="3.2" fill="#00E5FF"/><circle cx="6" cy="20" r="2.3" fill="#FF5A6E"/><circle cx="22" cy="20" r="2.3" fill="#FF5A6E"/></svg>`,
  wall: `<svg viewBox="0 0 28 28" fill="none"><path d="M4 14h20" stroke="#00E5FF" stroke-width="2.6" stroke-linecap="round"/><circle cx="7" cy="14" r="2.7" fill="#00E5FF"/><circle cx="14" cy="14" r="2.7" fill="#00E5FF"/><circle cx="21" cy="14" r="2.7" fill="#00E5FF"/><circle cx="10" cy="7" r="2.2" fill="#38BDF8"/><circle cx="18" cy="7" r="2.2" fill="#38BDF8"/></svg>`,
  box1: `<svg viewBox="0 0 28 28" fill="none"><rect x="7" y="7" width="14" height="10" rx="2" stroke="#00E5FF" stroke-width="2" stroke-dasharray="3 2"/><circle cx="11" cy="22" r="2.8" fill="#FF5A6E"/><circle cx="16" cy="21" r="2.8" fill="#00E5FF"/></svg>`,
  strike: `<svg viewBox="0 0 28 28" fill="none"><circle cx="9" cy="19" r="2.8" fill="#FF5A6E"/><path d="M7 22l9-14 4 3" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="8" r="2.8" fill="#00E5FF"/></svg>`,
  swing: `<svg viewBox="0 0 28 28" fill="none"><path d="M7 16c3 6 11 6 14-3" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round"/><circle cx="7" cy="16" r="2.6" fill="#94A3B8"/><circle cx="13" cy="21" r="2.6" fill="#00E5FF"/><circle cx="21" cy="12" r="2.8" fill="#00E5FF"/></svg>`,
  hammer: `<svg viewBox="0 0 28 28" fill="none"><path d="M7 22C8 8 16 6 21 11" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 2"/><ellipse cx="21" cy="12" rx="3.4" ry="1.8" transform="rotate(-25 21 12)" fill="#00E5FF"/></svg>`
};

class FlatballGame {
  constructor() {
    this.canvas = document.getElementById('field-canvas');
    this.choreo = new Choreographer();
    this.renderer = new FieldRenderer(this.canvas);

    this.mode = 'quick';
    this.targetScore = 3;
    this.rng = Math.random;

    this.state = null;
    this.cacheDom();
    this.bindEvents();
    this.startNewMatch('quick');
    this.startLoop();
  }

  cacheDom() {
    this.dom = {
      scorePlayer: document.getElementById('score-player'),
      scoreBot: document.getElementById('score-bot'),
      targetLabel: document.getElementById('target-score-label'),
      possessionBadge: document.getElementById('possession-badge'),
      yardageBadge: document.getElementById('yardage-badge'),
      lookBanner: document.getElementById('look-banner'),
      lookTitle: document.getElementById('look-title'),
      lookTag: document.getElementById('look-tag'),
      windBadge: document.getElementById('wind-badge'),
      hintBtn: document.getElementById('hint-btn'),
      tickerText: document.getElementById('coach-ticker-text'),
      actionContainer: document.getElementById('action-container'),
      feedLog: document.getElementById('play-log-list'),

      modeQuickBtn: document.getElementById('mode-quick-btn'),
      modeDailyBtn: document.getElementById('mode-daily-btn'),
      speedBtn: document.getElementById('speed-btn'),
      scoutBtn: document.getElementById('scout-btn'),
      soundBtn: document.getElementById('sound-btn'),
      helpBtn: document.getElementById('help-btn'),

      helpModal: document.getElementById('help-modal'),
      closeHelpBtn: document.getElementById('close-help-btn'),
      guideTabBtns: document.querySelectorAll('[data-guide-tab]'),
      guidePanels: document.querySelectorAll('[data-guide-panel]'),
      footerOffenseLink: document.getElementById('footer-offense-link'),
      footerDefenseLink: document.getElementById('footer-defense-link'),

      matchModal: document.getElementById('match-modal'),
      matchModalTitle: document.getElementById('match-modal-title'),
      matchModalScore: document.getElementById('match-modal-score'),
      matchModalSubtitle: document.getElementById('match-modal-subtitle'),
      statIq: document.getElementById('stat-iq'),
      statTurns: document.getElementById('stat-turns'),
      statBreaks: document.getElementById('stat-breaks'),
      shareBtn: document.getElementById('share-score-btn'),
      playAgainBtn: document.getElementById('play-again-btn')
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.renderer.resize();
    });

    window.addEventListener('pointerdown', () => sound.unlock(), { once: true });

    this.dom.modeQuickBtn.addEventListener('click', () => {
      sound.uiClick();
      if (this.mode !== 'quick') this.startNewMatch('quick');
    });

    this.dom.modeDailyBtn.addEventListener('click', () => {
      sound.uiClick();
      if (this.mode !== 'daily') this.startNewMatch('daily');
    });

    this.dom.speedBtn.addEventListener('click', () => {
      sound.uiClick();
      this.choreo.speedMultiplier = this.choreo.speedMultiplier === 1.0 ? 1.5 : 1.0;
      this.dom.speedBtn.textContent = `${this.choreo.speedMultiplier}x`;
      this.dom.speedBtn.classList.toggle('active-pill', this.choreo.speedMultiplier > 1.0);
    });

    this.dom.scoutBtn.addEventListener('click', () => {
      sound.uiClick();
      this.renderer.scoutEnabled = !this.renderer.scoutEnabled;
      this.dom.scoutBtn.textContent = this.renderer.scoutEnabled ? 'Scout: ON' : 'Scout: PRO';
      this.dom.scoutBtn.classList.toggle('active-pill', this.renderer.scoutEnabled);
      this.updateLookBanner();
    });

    this.dom.soundBtn.addEventListener('click', () => {
      const on = sound.toggle();
      this.dom.soundBtn.textContent = on ? '🔊' : '🔇';
      this.dom.soundBtn.setAttribute('aria-label', on ? 'Mute sound' : 'Unmute sound');
    });
    this.dom.soundBtn.textContent = sound.enabled ? '🔊' : '🔇';

    this.dom.hintBtn.addEventListener('click', () => {
      sound.uiClick();
      this.revealCoachHint();
    });

    this.dom.helpBtn.addEventListener('click', () => {
      sound.uiClick();
      this.openGuideModal('basics');
    });

    this.dom.guideTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.uiClick();
        this.switchGuideTab(btn.dataset.guideTab);
      });
    });

    if (this.dom.footerOffenseLink) {
      this.dom.footerOffenseLink.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        sound.uiClick();
        this.openGuideModal('offense');
      });
    }

    if (this.dom.footerDefenseLink) {
      this.dom.footerDefenseLink.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        sound.uiClick();
        this.openGuideModal('defense');
      });
    }

    this.dom.closeHelpBtn.addEventListener('click', () => {
      sound.uiClick();
      this.dom.helpModal.classList.add('hidden');
    });

    this.dom.helpModal.addEventListener('click', (e) => {
      if (e.target === this.dom.helpModal) this.dom.helpModal.classList.add('hidden');
    });

    this.dom.playAgainBtn.addEventListener('click', () => {
      sound.uiClick();
      this.dom.matchModal.classList.add('hidden');
      this.startNewMatch(this.mode);
    });

    this.dom.shareBtn.addEventListener('click', () => {
      sound.uiClick();
      this.copyShareSummary();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && !this.dom.helpModal.classList.contains('hidden')) {
        this.dom.helpModal.classList.add('hidden');
        return;
      }
      if (!this.dom.helpModal.classList.contains('hidden') || !this.dom.matchModal.classList.contains('hidden')) {
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.state.phase === 'PRE_PULL') {
          e.preventDefault();
          this.handlePullClick();
        } else if (this.state.phase === 'POINT_OVER') {
          e.preventDefault();
          this.advanceToNextPoint();
        } else if (
          (this.state.phase === 'DEFENSE_READ' || this.state.phase === 'OFFENSE_READ') &&
          this.state.selectedCard
        ) {
          e.preventDefault();
          this.confirmSelectedCard();
        }
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        if (this.state.phase === 'DEFENSE_READ' || this.state.phase === 'OFFENSE_READ') {
          const idx = Number(e.code.replace('Digit', '')) - 1;
          if (this.state.currentHand[idx]) {
            this.selectCardForPreview(this.state.currentHand[idx]);
          }
        }
      }
    });
  }

  startNewMatch(mode) {
    this.mode = mode;
    this.dom.modeQuickBtn.classList.toggle('active-mode', mode === 'quick');
    this.dom.modeDailyBtn.classList.toggle('active-mode', mode === 'daily');

    this.rng = mode === 'daily' ? createSeededRng(`flatball-${getTodayKey()}`) : Math.random;

    this.state = {
      phase: 'PRE_PULL',
      playerScore: 0,
      botScore: 0,
      pullingTeam: 'player',
      startedPointOnDefense: true,
      possession: 'bot',
      discX: 0,
      discY: 70,
      pointWind: { strength: 'calm', dir: 'north', mph: 0, dx: 0, dy: 0 },
      botLookId: 'vert_stack',
      botDefState: { defId: 'bot_man_open', forceSide: 'home', baseStack: 'vert' },
      activeStrategyId: null,
      selectedCard: null,
      lastBotOffId: null,
      lastBotDefId: null,
      currentHand: [],
      pointSummary: null,
      stats: {
        decisions: 0,
        idealReads: 0,
        middleReads: 0,
        turnsForced: 0,
        turnsCommitted: 0,
        breakGoals: 0,
        pointHistory: []
      }
    };

    if (this.dom.feedLog) {
      this.dom.feedLog.innerHTML = '';
    }
    this.addFeedEntry(
      mode === 'daily'
        ? `📅 Daily Tactical Cup (${getTodayKey()}) — First to ${this.targetScore}`
        : `🥏 New Match Started — First to ${this.targetScore}`,
      'neutral'
    );

    this.setupNextPoint('player');
  }

  setupNextPoint(pullingTeam) {
    this.state.phase = 'PRE_PULL';
    this.state.pullingTeam = pullingTeam;
    this.state.startedPointOnDefense = pullingTeam === 'player';
    this.state.possession = pullingTeam === 'player' ? 'bot' : 'player';
    this.state.activeStrategyId = null;
    this.state.selectedCard = null;
    this.state.pointSummary = null;

    this.state.pointWind = rollPointWind(this.rng);
    this.choreo.setPointWind(this.state.pointWind);
    const wb = formatWindBadge(this.state.pointWind, this.state.possession);
    if (this.state.pointWind.strength !== 'calm') {
      this.addFeedEntry(`Weather Check: ${wb.text}`, 'neutral');
    }

    this.choreo.setupPullLineup(pullingTeam);
    this.updateScoreboard();
    this.updateLookBanner();
    const windNote = this.state.pointWind.strength === 'calm' ? 'Calm air.' : `Wind: ${wb.text}.`;
    this.setTicker(
      pullingTeam === 'player'
        ? `7v7 lined up (${windNote}) Click PULL DISC to launch the pull!`
        : `Bot is ready on the goal line (${windNote}) Click RECEIVE PULL!`
    );
    this.renderActionTray();
  }

  pickBotOffense(discY, isMidfieldAdvance = false) {
    if (discY <= 38) {
      this.state.lastBotOffId = 'red_zone';
      return 'red_zone';
    }
    if (isMidfieldAdvance && this.state.botLookId && this.state.botLookId !== 'red_zone' && BOT_OFFENSES[this.state.botLookId]) {
      if (this.rng() < 0.52) {
        return this.state.botLookId;
      }
    }
    const pool = [
      'vert_stack',
      'ho_stack',
      'side_iso',
      'split_stack',
      'hex_flow',
      'handler_weave',
      'star_playmaker'
    ].filter((id) => id !== this.state.lastBotOffId);
    const chosen = pool[Math.floor(this.rng() * pool.length)];
    this.state.lastBotOffId = chosen;
    return chosen;
  }

  rollNextBotDefense(discX, isAdvance = false) {
    const next = rollBotDefenseState({
      discX,
      prevDefId: isAdvance ? this.state.botDefState.defId : this.state.lastBotDefId,
      prevStack: this.state.botDefState ? this.state.botDefState.baseStack : 'vert',
      isAdvance,
      wind: this.state.pointWind,
      rng: this.rng
    });
    this.state.lastBotDefId = next.defId;
    return next;
  }

  formatForceBadge(forceSide, defId = null) {
    if (defId === 'bot_man_middle') return 'FORCE MIDDLE ▶◀';
    return forceSide === 'home' ? 'FORCE HOME ◀' : 'FORCE AWAY ▶';
  }

  handlePullClick() {
    if (this.state.phase !== 'PRE_PULL') return;
    sound.unlock();
    this.state.phase = 'ANIMATING';
    this.state.activeStrategyId = null;

    const isPlayerPull = this.state.pullingTeam === 'player';
    const landingX = Math.round((this.rng() * 22 - 11) * 10) / 10;
    const landingY = isPlayerPull
      ? Math.round(68 + this.rng() * 7)
      : Math.round(35 + this.rng() * 7);

    this.state.discX = landingX;
    this.state.discY = landingY;

    let nextOffLook = null;
    let botDefState = null;
    if (isPlayerPull) {
      nextOffLook = this.pickBotOffense(landingY, false);
      this.state.botLookId = nextOffLook;
    } else {
      botDefState = this.rollNextBotDefense(landingX, false);
      this.state.botDefState = botDefState;
      this.state.botLookId = botDefState.defId;
    }

    this.renderActionTray();
    this.updateLookBanner();

    this.choreo.animatePull({
      pullingTeam: this.state.pullingTeam,
      landingX,
      landingY,
      initialBotLookId: nextOffLook,
      botDefState,
      onTicker: (msg) => this.setTicker(msg),
      onReadyForRead: () => {
        if (isPlayerPull) {
          this.enterDefenseRead(false, false);
        } else {
          this.enterOffenseRead(false, false);
        }
      }
    });
  }

  enterDefenseRead(isAdvance = false, audibled = false) {
    this.state.phase = 'DEFENSE_READ';
    this.state.possession = 'bot';
    this.state.selectedCard = null;

    const baseBotOff = BOT_OFFENSES[this.state.botLookId];
    const effBotOff = getEffectiveLook(baseBotOff, this.state.pointWind, false, this.state.discX);
    this.state.currentHand = buildDecisionHand(
      effBotOff,
      PLAYER_DEFENSES,
      isAdvance ? this.state.activeStrategyId : null,
      this.rng
    );

    this.updateScoreboard();
    this.updateLookBanner(audibled);

    if (isAdvance) {
      const audibleNote = audibled ? `⚡ Bot audibled to ${baseBotOff.name}! ` : '';
      this.setTicker(
        this.renderer.scoutEnabled
          ? `${audibleNote}Keep ${PLAYER_DEFENSES[this.state.activeStrategyId].name} or switch D — tap to align, then Confirm!`
          : `${audibleNote}Offense reset downfield — tap a Defense to align, then Confirm!`
      );
    } else {
      this.setTicker(
        this.renderer.scoutEnabled
          ? `Bot lined up in ${baseBotOff.name}. Tap a Defense below to drift into position, then Confirm!`
          : 'Read the 7v7 spacing & wind — tap a Defense to drift into position, then Confirm!'
      );
    }

    this.renderActionTray();
  }

  enterOffenseRead(isAdvance = false, audibled = false) {
    this.state.phase = 'OFFENSE_READ';
    this.state.possession = 'player';
    this.state.selectedCard = null;

    const { defId, forceSide, baseStack } = this.state.botDefState;
    const baseBotDef = BOT_DEFENSES[defId];
    const effBotDef = getEffectiveLook(baseBotDef, this.state.pointWind, true, this.state.discX);
    const forceText = this.formatForceBadge(forceSide, defId);
    const stackText = baseStack === 'ho' ? 'Ho Stack' : 'Vert Stack';

    this.state.currentHand = buildDecisionHand(
      effBotDef,
      PLAYER_OFFENSES,
      isAdvance ? this.state.activeStrategyId : null,
      this.rng
    );

    this.updateScoreboard();
    this.updateLookBanner(audibled);

    if (isAdvance) {
      const audibleNote = audibled ? `⚡ Bot switched D (${forceText})! ` : '';
      this.setTicker(
        this.renderer.scoutEnabled
          ? `${audibleNote}Bot shows ${baseBotDef.name} (${forceText}). Tap Keep or audible to preview, then Confirm!`
          : `${audibleNote}Your ${stackText} is set (${forceText}). Tap a Play to align, then Confirm!`
      );
    } else {
      this.setTicker(
        this.renderer.scoutEnabled
          ? `Your ${stackText} is set vs ${baseBotDef.name} (${forceText}). Tap a Play to drift into alignment, then Confirm!`
          : `Your ${stackText} is set (${forceText}). Read Man vs Zone — tap a Play to align, then Confirm!`
      );
    }

    this.renderActionTray();
  }

  selectCardForPreview(card) {
    if (this.state.phase !== 'DEFENSE_READ' && this.state.phase !== 'OFFENSE_READ') return;
    sound.unlock();
    sound.selectPreview();

    this.state.selectedCard = card;
    const isOffense = this.state.phase === 'OFFENSE_READ';

    if (isOffense) {
      this.choreo.previewOffenseSelection(
        this.state.discX,
        this.state.discY,
        this.state.botDefState,
        card.id
      );
      this.setTicker(
        `Previewing ${card.name} — ${card.shortDesc}. Tap Confirm to run it, or test another play!`
      );
    } else {
      this.choreo.previewDefenseSelection(
        this.state.discX,
        this.state.discY,
        this.state.botLookId,
        card.id
      );
      this.setTicker(
        `Previewing ${card.name} — ${card.shortDesc}. Tap Confirm to lock in D, or test another option!`
      );
    }

    this.syncReadTraySelectionUI();
  }

  confirmSelectedCard() {
    if (this.state.phase !== 'DEFENSE_READ' && this.state.phase !== 'OFFENSE_READ') return;
    if (!this.state.selectedCard) return;
    sound.unlock();
    sound.confirmLock();
    this.executeCardPlay(this.state.selectedCard);
  }

  executeCardPlay(card) {
    if (this.state.phase !== 'DEFENSE_READ' && this.state.phase !== 'OFFENSE_READ') return;

    const wasDefense = this.state.phase === 'DEFENSE_READ';
    this.state.phase = 'ANIMATING';
    this.state.activeStrategyId = card.id;
    this.state.selectedCard = null;
    this.choreo.visualContext.ghostPreview = null;
    this.choreo.visualContext.playerPreviewId = null;

    this.state.stats.decisions += 1;
    if (card.tier === 'ideal') this.state.stats.idealReads += 1;
    else if (card.tier === 'middle') this.state.stats.middleReads += 1;

    this.renderActionTray();
    this.updateLookBanner();

    if (wasDefense) {
      const prevBotOffId = this.state.botLookId;
      const effBotOffObj = getEffectiveLook(
        BOT_OFFENSES[prevBotOffId],
        this.state.pointWind,
        false,
        this.state.discX
      );
      const nextBotOffOnAdvance = card.tier === 'middle'
        ? this.pickBotOffense(this.state.discY - 24, true)
        : prevBotOffId;

      this.choreo.animateDefenseResolution({
        discX: this.state.discX,
        discY: this.state.discY,
        botOffenseId: prevBotOffId,
        playerDefId: card.id,
        tier: card.tier,
        nextBotOffIdOnAdvance: nextBotOffOnAdvance,
        computeBotDefOnTurn: (turnX) => this.rollNextBotDefense(turnX, false),
        onTicker: (msg) => this.setTicker(msg),
        onResult: (res) => {
          this.state.discX = res.newDiscX;
          this.state.discY = res.newDiscY;

          if (res.outcome === 'turnover') {
            this.state.stats.turnsForced += 1;
            this.state.botDefState = res.botDefState;
            this.state.botLookId = res.botDefState.defId;
            this.state.activeStrategyId = null;
            this.addFeedEntry(`🔥 TURNOVER! ${card.name} shut down ${effBotOffObj.name}.`, 'good');
            this.enterOffenseRead(false, false);
            const fTxt = this.formatForceBadge(res.botDefState.forceSide, res.botDefState.defId);
            this.setTicker(
              `${effBotOffObj.outcomes.ideal} Bot D matched your stack (${this.renderer.scoutEnabled ? `${BOT_DEFENSES[res.botDefState.defId].name}, ` : ''}${fTxt})!`
            );
          } else if (res.outcome === 'advance') {
            const didAudible = nextBotOffOnAdvance !== prevBotOffId;
            this.state.botLookId = nextBotOffOnAdvance;
            this.addFeedEntry(`↗️ Bot gained ${res.yardsGained} yds vs ${card.name}.`, 'mid');
            this.enterDefenseRead(true, didAudible);
          } else if (res.outcome === 'bot_goal') {
            this.state.botScore += 1;
            this.state.stats.pointHistory.push('L');
            const reason = card.tier === 'worst'
              ? effBotOffObj.outcomes.worst
              : 'Bot marched the remaining yards across your goal line for the score.';
            this.addFeedEntry(`⚠️ Bot Goal (${this.state.playerScore}–${this.state.botScore}): ${card.name} vs ${effBotOffObj.name}.`, 'bad');
            this.enterPointOver('bot', reason);
          }
        }
      });
    } else {
      // Player on OFFENSE
      const prevDefState = { ...this.state.botDefState };
      const effBotDefObj = getEffectiveLook(
        BOT_DEFENSES[prevDefState.defId],
        this.state.pointWind,
        true,
        this.state.discX
      );

      this.choreo.animateOffenseResolution({
        discX: this.state.discX,
        discY: this.state.discY,
        botDefState: prevDefState,
        playerOffId: card.id,
        tier: card.tier,
        computeBotDefOnAdvance: (newX) => this.rollNextBotDefense(newX, true),
        computeBotOffOnTurn: (turnX, turnY) => this.pickBotOffense(turnY, false),
        onTicker: (msg) => this.setTicker(msg),
        onResult: (res) => {
          this.state.discX = res.newDiscX;
          this.state.discY = res.newDiscY;

          if (res.outcome === 'player_goal') {
            this.state.playerScore += 1;
            this.state.stats.pointHistory.push('W');
            if (this.state.startedPointOnDefense) {
              this.state.stats.breakGoals += 1;
            }
            const reason = card.tier === 'ideal'
              ? effBotDefObj.outcomes.ideal
              : `${card.name} powered the remaining yards into the end zone for the goal!`;
            this.addFeedEntry(
              `🎉 GOAL! (${this.state.playerScore}–${this.state.botScore}) ${card.name} beat ${effBotDefObj.name}!`,
              'good'
            );
            this.enterPointOver('player', reason);
          } else if (res.outcome === 'advance') {
            const nextState = res.botDefState;
            const didAudible = nextState.defId !== prevDefState.defId || nextState.forceSide !== prevDefState.forceSide;
            this.state.botDefState = nextState;
            this.state.botLookId = nextState.defId;
            this.addFeedEntry(`⚡ Offense gained ${res.yardsGained} yds with ${card.name}.`, 'mid');
            this.enterOffenseRead(true, didAudible);
          } else if (res.outcome === 'turnover_to_bot') {
            this.state.stats.turnsCommitted += 1;
            this.state.botLookId = res.nextBotOffId;
            this.state.activeStrategyId = null;
            this.addFeedEntry(`💥 Turnover vs ${effBotDefObj.name}! Back on Defense.`, 'bad');
            this.enterDefenseRead(false, false);
            this.setTicker(`${effBotDefObj.outcomes.worst} Transitioning to Defense — stop them!`);
          }
        }
      });
    }
  }

  enterPointOver(scoringTeam, explanation) {
    this.state.phase = 'POINT_OVER';
    this.state.pointSummary = {
      scoringTeam,
      explanation,
      isBreak: scoringTeam === 'player' && this.state.startedPointOnDefense
    };
    this.updateScoreboard();
    this.updateLookBanner();
    this.setTicker(explanation);
    this.renderActionTray();
  }

  advanceToNextPoint() {
    sound.uiClick();
    if (this.state.playerScore >= this.targetScore || this.state.botScore >= this.targetScore) {
      this.showMatchOverModal();
      return;
    }
    const nextPuller = this.state.pointSummary && this.state.pointSummary.scoringTeam === 'bot' ? 'bot' : 'player';
    this.setupNextPoint(nextPuller);
  }

  showMatchOverModal() {
    this.state.phase = 'MATCH_OVER';
    const won = this.state.playerScore > this.state.botScore;
    const iqPct = this.state.stats.decisions > 0
      ? Math.round(
          ((this.state.stats.idealReads + this.state.stats.middleReads * 0.45) / this.state.stats.decisions) * 100
        )
      : 100;

    this.dom.matchModalTitle.textContent = won ? '🏆 VICTORY ON THE FIELD!' : '🥏 HARD-FOUGHT MATCH';
    this.dom.matchModalScore.textContent = `YOU ${this.state.playerScore}  —  ${this.state.botScore} BOT`;
    this.dom.matchModalSubtitle.textContent = won
      ? 'Clinical field reads and seamless two-way transitions!'
      : 'Study the Bot’s formations and come back stronger next match!';

    this.dom.statIq.textContent = `${iqPct}%`;
    this.dom.statTurns.textContent = String(this.state.stats.turnsForced);
    this.dom.statBreaks.textContent = String(this.state.stats.breakGoals);

    this.dom.shareBtn.textContent = this.mode === 'daily' ? '📋 Share Daily Scorecard' : '📋 Share Match Scorecard';
    this.dom.matchModal.classList.remove('hidden');
  }

  copyShareSummary() {
    const iqPct = this.state.stats.decisions > 0
      ? Math.round(
          ((this.state.stats.idealReads + this.state.stats.middleReads * 0.45) / this.state.stats.decisions) * 100
        )
      : 100;
    const blocks = this.state.stats.pointHistory.map((r) => (r === 'W' ? '🥏' : '🟥')).join('');
    const header = this.mode === 'daily'
      ? `Flatball Tactics Daily (${getTodayKey()})`
      : 'Flatball Tactics Match';
    const text = `${header}\nScore: ${this.state.playerScore}-${this.state.botScore} ${blocks}\nTurns Forced: ${this.state.stats.turnsForced} | Tactical IQ: ${iqPct}%\nhttps://punfiction.io/flatball/`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.dom.shareBtn.textContent = '✅ Copied to Clipboard!';
        setTimeout(() => {
          this.dom.shareBtn.textContent = this.mode === 'daily' ? '📋 Share Daily Scorecard' : '📋 Share Match Scorecard';
        }, 2200);
      });
    }
  }

  revealCoachHint() {
    if (this.state.phase === 'DEFENSE_READ') {
      const look = getEffectiveLook(
        BOT_OFFENSES[this.state.botLookId],
        this.state.pointWind,
        false,
        this.state.discX
      );
      this.setTicker(`💡 Scout Tip: ${look.hint}`);
    } else if (this.state.phase === 'OFFENSE_READ') {
      const look = getEffectiveLook(
        BOT_DEFENSES[this.state.botDefState.defId],
        this.state.pointWind,
        true,
        this.state.discX
      );
      this.setTicker(`💡 Scout Tip: ${look.hint}`);
    }
  }

  openGuideModal(tabName = 'basics') {
    this.switchGuideTab(tabName);
    this.dom.helpModal.classList.remove('hidden');
    const modalCard = this.dom.helpModal.querySelector('.modal-card');
    if (modalCard) modalCard.scrollTop = 0;
  }

  switchGuideTab(tabName) {
    this.dom.guideTabBtns.forEach((btn) => {
      const active = btn.dataset.guideTab === tabName;
      btn.classList.toggle('active-guide-tab', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    this.dom.guidePanels.forEach((panel) => {
      const active = panel.dataset.guidePanel === tabName;
      panel.classList.toggle('hidden', !active);
    });
  }

  formatYardageText() {
    if (this.state.phase === 'PRE_PULL') return 'GOAL LINE';
    const y = Math.round(this.state.discY);
    if (this.state.possession === 'bot') {
      const ydsToScore = Math.max(1, y - 20);
      return ydsToScore <= 18 ? `🚨 RED ZONE (${ydsToScore}y)` : `${ydsToScore} YDS TO DEFEND`;
    }
    const ydsToScore = Math.max(1, 90 - y);
    return ydsToScore <= 18 ? `🔥 RED ZONE (${ydsToScore}y)` : `${ydsToScore} YDS TO SCORE`;
  }

  updateScoreboard() {
    this.dom.scorePlayer.textContent = String(this.state.playerScore);
    this.dom.scoreBot.textContent = String(this.state.botScore);
    this.dom.targetLabel.textContent = `TO ${this.targetScore}`;

    const onOffense = this.state.possession === 'player';
    this.dom.possessionBadge.textContent = this.state.phase === 'PRE_PULL'
      ? (this.state.pullingTeam === 'player' ? '🛡️ PULLING (DEFENSE)' : '⚡ RECEIVING (OFFENSE)')
      : (onOffense ? '⚡ YOU ON OFFENSE' : '🛡️ YOU ON DEFENSE');
    this.dom.possessionBadge.className = `status-pill ${onOffense ? 'pill-offense' : 'pill-defense'}`;

    this.dom.yardageBadge.textContent = this.formatYardageText();
  }

  updateLookBanner(audibled = false) {
    const { phase, botLookId, botDefState } = this.state;

    if (this.dom.windBadge) {
      const wb = formatWindBadge(this.state.pointWind, this.state.possession);
      this.dom.windBadge.textContent = wb.text;
      this.dom.windBadge.className = `wind-pill wind-${wb.tone}`;
    }

    if (phase !== 'DEFENSE_READ' && phase !== 'OFFENSE_READ') {
      this.dom.lookBanner.classList.add('banner-muted');
      this.dom.hintBtn.classList.add('hidden');
      if (phase === 'PRE_PULL') {
        this.dom.lookTitle.textContent = this.state.pullingTeam === 'player' ? 'READY TO PULL' : 'RECEIVING PULL';
        this.dom.lookTag.textContent = '7v7 REGULATION';
      } else if (phase === 'ANIMATING') {
        this.dom.lookTitle.textContent = 'LIVE PLAY IN MOTION';
        this.dom.lookTag.textContent = 'WATCH THE CUTS';
      } else {
        this.dom.lookTitle.textContent = 'POINT COMPLETE';
        this.dom.lookTag.textContent = 'SCOREBOARD';
      }
      return;
    }

    this.dom.lookBanner.classList.remove('banner-muted');
    this.dom.hintBtn.classList.remove('hidden');

    if (phase === 'DEFENSE_READ') {
      if (!this.renderer.scoutEnabled) {
        this.dom.lookTitle.textContent = audibled ? '⚡ BOT AUDIBLE — READ O' : 'READ BOT OFFENSE';
        this.dom.lookTag.textContent = 'PRO MODE';
        return;
      }
      const look = BOT_OFFENSES[botLookId];
      this.dom.lookTitle.textContent = `${audibled ? '⚡ ' : ''}BOT O: ${look.name.toUpperCase()}`;
      this.dom.lookTag.textContent = look.tag;
    } else {
      const { defId, forceSide, baseStack } = botDefState;
      const forceBadge = this.formatForceBadge(forceSide, defId);
      const stackLabel = baseStack === 'ho' ? 'YOUR HO STACK' : 'YOUR VERT STACK';

      if (!this.renderer.scoutEnabled) {
        // In Pro Mode, you hear the Marker's Force call and know your own stack, while diagnosing Man vs Zone yourself!
        this.dom.lookTitle.textContent = `${audibled ? '⚡ ' : ''}${forceBadge} • READ D`;
        this.dom.lookTag.textContent = stackLabel;
        return;
      }

      const look = BOT_DEFENSES[defId];
      this.dom.lookTitle.textContent = `${audibled ? '⚡ ' : ''}${look.name.toUpperCase()} • ${forceBadge}`;
      this.dom.lookTag.textContent = stackLabel;
    }
  }

  setTicker(text) {
    this.dom.tickerText.textContent = text;
  }

  addFeedEntry(text, tone = 'neutral') {
    if (!this.dom.feedLog) return;
    const li = document.createElement('li');
    li.className = `feed-item feed-${tone}`;
    li.textContent = text;
    this.dom.feedLog.prepend(li);
    while (this.dom.feedLog.children.length > 12) {
      this.dom.feedLog.removeChild(this.dom.feedLog.lastChild);
    }
  }

  renderActionTray() {
    const container = this.dom.actionContainer;
    container.innerHTML = '';

    if (this.state.phase === 'PRE_PULL') {
      const isPlayerPull = this.state.pullingTeam === 'player';
      const wrap = document.createElement('div');
      wrap.className = 'cta-center-wrap';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `primary-pull-btn ${isPlayerPull ? '' : 'receive-btn'}`;
      btn.innerHTML = isPlayerPull
        ? `<span class="pull-disc-icon">🥏</span><span>PULL DISC</span><span class="pull-sub">Kick off &amp; read Bot Offense</span>`
        : `<span class="pull-disc-icon">⚡</span><span>RECEIVE PULL</span><span class="pull-sub">Set your stack &amp; read Bot’s Force/Zone</span>`;
      btn.addEventListener('click', () => this.handlePullClick());
      wrap.appendChild(btn);
      container.appendChild(wrap);
      return;
    }

    if (this.state.phase === 'ANIMATING') {
      const wrap = document.createElement('div');
      wrap.className = 'live-play-indicator';
      wrap.innerHTML = `<span class="live-dot"></span><span>Play unfolding on the field...</span>`;
      container.appendChild(wrap);
      return;
    }

    if (this.state.phase === 'POINT_OVER' && this.state.pointSummary) {
      const { scoringTeam, isBreak } = this.state.pointSummary;
      const isMatchDone = this.state.playerScore >= this.targetScore || this.state.botScore >= this.targetScore;
      const wrap = document.createElement('div');
      wrap.className = 'cta-center-wrap';

      const badge = document.createElement('div');
      badge.className = `point-result-banner ${scoringTeam === 'player' ? 'banner-win' : 'banner-loss'}`;
      badge.textContent = scoringTeam === 'player'
        ? (isBreak ? '🔥 BREAK GOAL! YOU SCORE!' : '⚡ HOLD GOAL! YOU SCORE!')
        : '⚠️ BOT SCORES THE POINT';

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'next-point-btn';
      nextBtn.textContent = isMatchDone ? 'View Match Summary ➔' : 'Line Up Next Point ➔';
      nextBtn.addEventListener('click', () => this.advanceToNextPoint());

      wrap.appendChild(badge);
      wrap.appendChild(nextBtn);
      container.appendChild(wrap);
      return;
    }

    if (this.state.phase === 'DEFENSE_READ' || this.state.phase === 'OFFENSE_READ') {
      const isOffense = this.state.phase === 'OFFENSE_READ';
      const wrap = document.createElement('div');
      wrap.className = 'playbook-read-wrap';

      const grid = document.createElement('div');
      grid.className = 'strategy-cards-grid';

      this.state.currentHand.forEach((card, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.cardId = card.id;
        btn.className = `strategy-card ${isOffense ? 'card-offense' : 'card-defense'} ${card.isKeep ? 'card-keep' : ''}`;

        const topBadge = card.isKeep
          ? `<span class="keep-chip">KEEP ACTIVE</span>`
          : `<span class="role-chip">${card.badge}</span>`;

        btn.innerHTML = `
          <div class="card-top-row">
            <div class="card-icon-box">${CARD_ICONS[card.icon] || ''}</div>
            ${topBadge}
          </div>
          <div class="card-title">${card.isKeep ? `Keep: ${card.name}` : card.name}</div>
          <div class="card-desc">${card.shortDesc}</div>
          <span class="card-hotkey">${idx + 1}</span>
        `;

        btn.addEventListener('click', () => this.selectCardForPreview(card));
        grid.appendChild(btn);
      });

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.id = 'confirm-play-btn';
      confirmBtn.className = `confirm-play-btn ${isOffense ? 'confirm-offense' : 'confirm-defense'}`;
      confirmBtn.disabled = true;
      confirmBtn.addEventListener('click', () => this.confirmSelectedCard());

      wrap.appendChild(grid);
      wrap.appendChild(confirmBtn);
      container.appendChild(wrap);

      this.syncReadTraySelectionUI();
    }
  }

  syncReadTraySelectionUI() {
    const container = this.dom.actionContainer;
    if (!container) return;

    const isOffense = this.state.phase === 'OFFENSE_READ';
    const selected = this.state.selectedCard;

    const cardBtns = container.querySelectorAll('.strategy-card');
    cardBtns.forEach((btn) => {
      const isMatch = Boolean(selected && btn.dataset.cardId === selected.id);
      btn.classList.toggle('card-selected', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    const confirmBtn = container.querySelector('#confirm-play-btn');
    if (!confirmBtn) return;

    if (!selected) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = isOffense
        ? '👆 Tap an Offensive Play above to align on field'
        : '👆 Tap a Defense above to align on field';
    } else {
      confirmBtn.disabled = false;
      const labelName = selected.isKeep ? `Keep ${selected.name}` : selected.name;
      confirmBtn.textContent = isOffense
        ? `⚡ CONFIRM PLAY: ${labelName} ➔`
        : `🛡️ CONFIRM DEFENSE: ${labelName} ➔`;
    }
  }

  startLoop() {
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      this.choreo.update(dt);
      this.renderer.render(this.choreo);

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

function bootFlatball() {
  new FlatballGame();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootFlatball, { once: true });
} else {
  bootFlatball();
}
