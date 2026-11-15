// Main Game Controller, Two-Way Match State Machine & Responsive UI for Flatball Tactics
import {
  PLAYER_DEFENSES,
  PLAYER_OFFENSES,
  BOT_OFFENSES,
  BOT_DEFENSES,
  rollBotDefenseState,
  buildDecisionHand
} from './playbookData.js?v=3';
import { Choreographer } from './choreographer.js?v=3';
import { FieldRenderer } from './fieldRenderer.js?v=3';
import { sound } from './audio.js?v=3';

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
  vert: `<svg viewBox="0 0 28 28" fill="none"><path d="M14 8v6l6 4M20 18l-6-13" stroke="#00E5FF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="18" r="2.6" fill="#00E5FF"/><circle cx="14" cy="5" r="2.6" fill="#00E5FF"/></svg>`
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
      this.dom.helpModal.classList.remove('hidden');
    });

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
        }
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        if (this.state.phase === 'DEFENSE_READ' || this.state.phase === 'OFFENSE_READ') {
          const idx = Number(e.code.replace('Digit', '')) - 1;
          if (this.state.currentHand[idx]) {
            this.handleCardSelection(this.state.currentHand[idx]);
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
      botLookId: 'vert_stack',
      botDefState: { defId: 'bot_man_open', forceSide: 'home', baseStack: 'vert' },
      activeStrategyId: null,
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
    this.state.pointSummary = null;

    this.choreo.setupPullLineup(pullingTeam);
    this.updateScoreboard();
    this.updateLookBanner();
    this.setTicker(
      pullingTeam === 'player'
        ? '7v7 lined up on the goal lines. Click PULL DISC to launch the opening pull!'
        : 'Bot is ready on the goal line to pull to your Offense!'
    );
    this.renderActionTray();
  }

  pickBotOffense(discY, isMidfieldAdvance = false) {
    if (discY <= 38) {
      this.state.lastBotOffId = 'red_zone';
      return 'red_zone';
    }
    if (isMidfieldAdvance && this.state.botLookId && this.state.botLookId !== 'red_zone' && BOT_OFFENSES[this.state.botLookId]) {
      if (this.rng() < 0.55) {
        return this.state.botLookId;
      }
    }
    const pool = ['vert_stack', 'ho_stack', 'side_iso', 'handler_weave'].filter(
      (id) => id !== this.state.lastBotOffId
    );
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
      rng: this.rng
    });
    this.state.lastBotDefId = next.defId;
    return next;
  }

  formatForceBadge(forceSide) {
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

    const botOff = BOT_OFFENSES[this.state.botLookId];
    this.state.currentHand = buildDecisionHand(
      botOff,
      PLAYER_DEFENSES,
      isAdvance ? this.state.activeStrategyId : null,
      this.rng
    );

    this.updateScoreboard();
    this.updateLookBanner(audibled);

    if (isAdvance) {
      const audibleNote = audibled ? `⚡ Bot audibled to ${botOff.name}! ` : '';
      this.setTicker(
        this.renderer.scoutEnabled
          ? `${audibleNote}Keep ${PLAYER_DEFENSES[this.state.activeStrategyId].name} or switch your Defense!`
          : `${audibleNote}Offense reset downfield — Keep your Defense or switch!`
      );
    } else {
      this.setTicker(
        this.renderer.scoutEnabled
          ? `Bot lined up in ${botOff.name}. Select the Ideal defensive counter!`
          : 'Read the 7v7 spacing and select your Defensive counter!'
      );
    }

    this.renderActionTray();
  }

  enterOffenseRead(isAdvance = false, audibled = false) {
    this.state.phase = 'OFFENSE_READ';
    this.state.possession = 'player';

    const { defId, forceSide, baseStack } = this.state.botDefState;
    const botDef = BOT_DEFENSES[defId];
    const forceText = this.formatForceBadge(forceSide);
    const stackText = baseStack === 'ho' ? 'Ho Stack' : 'Vert Stack';

    this.state.currentHand = buildDecisionHand(
      botDef,
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
          ? `${audibleNote}Bot shows ${botDef.name} (${forceText}) vs your ${stackText}. Keep ${PLAYER_OFFENSES[this.state.activeStrategyId].name} or audible!`
          : `${audibleNote}Your ${stackText} is set (${forceText}). Keep your Offense or audible!`
      );
    } else {
      this.setTicker(
        this.renderer.scoutEnabled
          ? `Your ${stackText} is set — Bot matched in ${botDef.name} (${forceText}). Call the Ideal attack!`
          : `Your ${stackText} is set (${forceText}). Read Man vs Zone and call your Offense!`
      );
    }

    this.renderActionTray();
  }

  handleCardSelection(card) {
    if (this.state.phase !== 'DEFENSE_READ' && this.state.phase !== 'OFFENSE_READ') return;
    sound.unlock();
    sound.uiClick();

    const wasDefense = this.state.phase === 'DEFENSE_READ';
    this.state.phase = 'ANIMATING';
    this.state.activeStrategyId = card.id;
    this.choreo.visualContext.ghostPreview = null;

    this.state.stats.decisions += 1;
    if (card.tier === 'ideal') this.state.stats.idealReads += 1;
    else if (card.tier === 'middle') this.state.stats.middleReads += 1;

    this.renderActionTray();
    this.updateLookBanner();

    if (wasDefense) {
      const prevBotOffId = this.state.botLookId;
      const botOffObj = BOT_OFFENSES[prevBotOffId];
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
            this.addFeedEntry(`🔥 TURNOVER! ${card.name} shut down ${botOffObj.name}.`, 'good');
            this.enterOffenseRead(false, false);
            const fTxt = this.formatForceBadge(res.botDefState.forceSide);
            this.setTicker(
              `${botOffObj.outcomes.ideal} Bot D matched your stack (${this.renderer.scoutEnabled ? `${BOT_DEFENSES[res.botDefState.defId].name}, ` : ''}${fTxt})!`
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
              ? botOffObj.outcomes.worst
              : 'Bot marched the remaining yards across your goal line for the score.';
            this.addFeedEntry(`⚠️ Bot Goal (${this.state.playerScore}–${this.state.botScore}): ${card.name} vs ${botOffObj.name}.`, 'bad');
            this.enterPointOver('bot', reason);
          }
        }
      });
    } else {
      // Player on OFFENSE
      const prevDefState = { ...this.state.botDefState };
      const botDefObj = BOT_DEFENSES[prevDefState.defId];

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
              ? botDefObj.outcomes.ideal
              : `${card.name} powered the remaining yards into the end zone for the goal!`;
            this.addFeedEntry(
              `🎉 GOAL! (${this.state.playerScore}–${this.state.botScore}) ${card.name} beat ${botDefObj.name}!`,
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
            this.addFeedEntry(`💥 Turnover vs ${botDefObj.name}! Back on Defense.`, 'bad');
            this.enterDefenseRead(false, false);
            this.setTicker(`${botDefObj.outcomes.worst} Transitioning to Defense — stop them!`);
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
      const look = BOT_OFFENSES[this.state.botLookId];
      this.setTicker(`💡 Scout Tip: ${look.hint}`);
    } else if (this.state.phase === 'OFFENSE_READ') {
      const look = BOT_DEFENSES[this.state.botDefState.defId];
      this.setTicker(`💡 Scout Tip: ${look.hint}`);
    }
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
      const forceBadge = this.formatForceBadge(forceSide);
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
      const grid = document.createElement('div');
      grid.className = 'strategy-cards-grid';

      this.state.currentHand.forEach((card, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
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

        btn.addEventListener('mouseenter', () => {
          this.choreo.visualContext.ghostPreview = card.id;
        });
        btn.addEventListener('mouseleave', () => {
          if (this.choreo.visualContext.ghostPreview === card.id) {
            this.choreo.visualContext.ghostPreview = null;
          }
        });
        btn.addEventListener('click', () => this.handleCardSelection(card));

        grid.appendChild(btn);
      });

      container.appendChild(grid);
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
