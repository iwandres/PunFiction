// Main Game Controller, Two-Way Match State Machine & Responsive UI for Flatball Tactics
import {
  PLAYER_DEFENSES,
  PLAYER_OFFENSES,
  BOT_OFFENSES,
  BOT_DEFENSES,
  BOT_TEAMS,
  getDailyBotTeam,
  rollMatchWeather,
  nextPointWindFromForecast,
  formatWindBadge,
  getEffectiveLook,
  resolveWorstOutcome,
  rollBotDefenseState,
  buildDecisionHand
} from './playbookData.js?v=13';
import { Choreographer } from './choreographer.js?v=13';
import { FieldRenderer } from './fieldRenderer.js?v=13';
import { sound } from './audio.js?v=13';
import {
  POSTER_RIBBON_DISC_SVG,
  getPlayerCrestSvg,
  getBotCrestSvg,
  buildPosterHeroSvg
} from './posterArt.js?v=13';

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

const MINI_WHITE_DISC_SVG = `<svg width="18" height="11" viewBox="0 0 24 14" fill="none" style="vertical-align:-1px;margin-right:3px;" aria-hidden="true"><ellipse cx="12" cy="7.8" rx="10.5" ry="4.8" fill="#CBD5E1"/><ellipse cx="12" cy="6.5" rx="10.5" ry="4.8" fill="#FFFFFF"/><ellipse cx="12" cy="6.4" rx="7.2" ry="3.0" stroke="#0284C7" stroke-width="1.2"/></svg>`;

const PULL_DISC_LOGO_SVG = `<svg class="pull-disc-svg" viewBox="0 0 56 28" fill="none" aria-hidden="true">
  <defs>
    <linearGradient id="pullBtnStreak" x1="2" y1="15" x2="36" y2="14" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0369A1" stop-opacity="0" />
      <stop offset="40%" stop-color="#075985" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#0C4A6E" stop-opacity="0.92" />
    </linearGradient>
    <linearGradient id="pullBtnCore" x1="9" y1="15" x2="35" y2="14" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.92" />
    </linearGradient>
    <linearGradient id="pullBtnDiscTop" x1="28" y1="6" x2="48" y2="21" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
  </defs>
  <path d="M2 17.6 C12 12.4, 22 8.2, 36 7.4 L38 20.6 C24 20.8, 13 19.7, 2 17.6 Z" fill="url(#pullBtnStreak)" />
  <path d="M9 16.4 C17 13.9, 25 11.8, 35 11.2 L36 16.8 C26 17.2, 17 17.2, 9 16.4 Z" fill="url(#pullBtnCore)" />
  <path d="M5 12.1 Q18 9.1 31 8.4" stroke="#F0F9FF" stroke-width="1.6" stroke-linecap="round" opacity="0.92" />
  <path d="M11 21.3 Q22 21.0 33 19.8" stroke="#075985" stroke-width="1.5" stroke-linecap="round" opacity="0.88" />
  <g transform="translate(39, 13.5) rotate(-12)">
    <ellipse cx="0" cy="1.1" rx="14.2" ry="7.3" fill="rgba(3, 21, 33, 0.42)" />
    <ellipse cx="0" cy="1.3" rx="13.4" ry="6.4" fill="#CBD5E1" stroke="#64748B" stroke-width="0.85" />
    <ellipse cx="0" cy="-0.2" rx="13.4" ry="6.3" fill="url(#pullBtnDiscTop)" stroke="#FFFFFF" stroke-width="1.05" />
    <ellipse cx="0" cy="-0.3" rx="9.5" ry="4.1" fill="none" stroke="#0284C7" stroke-width="1.4" opacity="0.9" />
    <ellipse cx="0" cy="-0.3" rx="5.1" ry="2.0" fill="none" stroke="#38BDF8" stroke-width="1.0" opacity="0.85" />
    <path d="M-8 -3.4 A11 4.7 0 0 1 9 -2.7" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" opacity="0.95" />
  </g>
</svg>`;

const SIDELINE_CHEERS = [
  { shout: 'CHILLY! CHILLY! 🧊', msg: '📣 Sideline: “Stay chilly with the disc — patience beats every zone!”' },
  { shout: 'PANCAKE HANDS! 🥞', msg: '📣 Sideline: “Two hands on every catch — stack those pancakes!”' },
  { shout: 'ORANGE SLICES! 🍊', msg: '📣 Sideline: “Halftime orange slices on deck — leave it all on the grass!”' },
  { shout: 'SPIRIT 10/10! 🙌', msg: '📣 Sideline: “High-fives down the line! Best Spirit at the tournament!”' },
  { shout: 'WHEELS!! 💨', msg: '📣 Sideline: “Put on the jets — clear hard so the next cutter eats!”' },
  { shout: 'TOE THE LINE! ✨', msg: '📣 Sideline: “Check your feet on the cone — style points count in our hearts!”' },
  { shout: 'LAYOUT NATION! 🦸', msg: '📣 Sideline: “Grass stains are badges of honor — bid for your crew!”' },
  { shout: 'HYDRATE! 💧', msg: '📣 Sideline: “Quick sip from the sideline cooler — locked in for this point!”' }
];

class FlatballGame {
  constructor() {
    this.canvas = document.getElementById('field-canvas');
    this.choreo = new Choreographer();
    this.renderer = new FieldRenderer(this.canvas);

    this.mode = 'daily';
    this.targetScore = 3;
    this.rng = Math.random;
    this.lastMatchBotId = null;

    this.state = null;
    this.cacheDom();
    this.bindEvents();
    this.startNewMatch('daily');
    this.startLoop();
  }

  cacheDom() {
    this.dom = {
      scorePlayer: document.getElementById('score-player'),
      scoreBot: document.getElementById('score-bot'),
      botTeamLabel: document.getElementById('bot-team-label'),
      targetLabel: document.getElementById('target-score-label'),
      possessionBadge: document.getElementById('possession-badge'),
      yardageBadge: document.getElementById('yardage-badge'),
      lookBanner: document.getElementById('look-banner'),
      lookTitle: document.getElementById('look-title'),
      lookTag: document.getElementById('look-tag'),
      windBadge: document.getElementById('wind-badge'),
      hintBtn: document.getElementById('hint-btn'),
      hypeBtn: document.getElementById('hype-btn'),
      tickerText: document.getElementById('coach-ticker-text'),
      actionContainer: document.getElementById('action-container'),
      feedLog: document.getElementById('play-log-list'),

      welcomeBanner: document.getElementById('welcome-banner'),
      posterHeroArt: document.getElementById('poster-hero-art'),
      posterRibbonTrack: document.getElementById('poster-ribbon-track'),
      posterYouCrest: document.getElementById('poster-you-crest'),
      posterBotCrest: document.getElementById('poster-bot-crest'),
      welcomeModePill: document.getElementById('welcome-mode-pill'),
      welcomeCloseBtn: document.getElementById('welcome-close-btn'),
      welcomeBotPillName: document.getElementById('welcome-bot-pill-name'),
      welcomeHeadline: document.getElementById('welcome-headline'),
      welcomeWeatherLine: document.getElementById('welcome-weather-line'),
      welcomePullLine: document.getElementById('welcome-pull-line'),
      welcomePersonalityNote: document.getElementById('welcome-personality-note'),
      welcomeStartBtn: document.getElementById('welcome-start-btn'),

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
      spiritAwardPill: document.getElementById('spirit-award-pill'),
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
      this.startNewMatch('quick');
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

    if (this.dom.hypeBtn) {
      this.dom.hypeBtn.addEventListener('click', () => {
        sound.unlock();
        sound.sidelineCheer();
        this.triggerSidelineCheer();
      });
    }

    if (this.dom.welcomeStartBtn) {
      this.dom.welcomeStartBtn.addEventListener('click', () => {
        sound.unlock();
        sound.uiClick();
        this.dismissWelcomeBanner();
      });
    }

    if (this.dom.welcomeCloseBtn) {
      this.dom.welcomeCloseBtn.addEventListener('click', () => {
        sound.uiClick();
        this.dismissWelcomeBanner();
      });
    }

    if (this.dom.welcomeBanner) {
      this.dom.welcomeBanner.addEventListener('click', (e) => {
        if (e.target === this.dom.welcomeBanner) {
          sound.uiClick();
          this.dismissWelcomeBanner();
        }
      });
    }

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
      if (e.code === 'Escape' && this.dom.welcomeBanner && !this.dom.welcomeBanner.classList.contains('hidden')) {
        this.dismissWelcomeBanner();
        return;
      }
      if (!this.dom.helpModal.classList.contains('hidden') || !this.dom.matchModal.classList.contains('hidden')) {
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.dom.welcomeBanner && !this.dom.welcomeBanner.classList.contains('hidden')) {
          e.preventDefault();
          this.dismissWelcomeBanner();
          return;
        }
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

  applyBotTeamTheme(botTeam) {
    const root = document.documentElement;
    root.style.setProperty('--bot-coral', botTeam.colorTop);
    root.style.setProperty('--bot-coral-dark', botTeam.colorBot);
    root.style.setProperty('--bot-coral-soft', botTeam.softBg);
    if (this.dom.botTeamLabel) {
      this.dom.botTeamLabel.textContent = botTeam.shortName;
      this.dom.botTeamLabel.title = `${botTeam.emoji} ${botTeam.name} — ${botTeam.archetype}`;
    }
    this.choreo.setBotTheme(botTeam);
  }

  showWelcomeBanner() {
    if (!this.dom.welcomeBanner || !this.state) return;
    const { botTeam, matchWeather } = this.state;

    // 1. Dynamic Action Silhouettes + Team Sports Graphic + Daily Weather Hero SVG
    if (this.dom.posterHeroArt) {
      this.dom.posterHeroArt.innerHTML = buildPosterHeroSvg(botTeam, matchWeather);
    }

    // 2. Repeating UFA-style Broadcast Ticker Ribbon
    if (this.dom.posterRibbonTrack) {
      const label = this.mode === 'daily'
        ? `MATCHUP <span class="ribbon-of-box">OF<br/>THE</span> DAY`
        : `FLATBALL <span class="ribbon-of-box">VS</span> SHOWDOWN`;
      this.dom.posterRibbonTrack.innerHTML =
        `${label} ${POSTER_RIBBON_DISC_SVG} ${label} ${POSTER_RIBBON_DISC_SVG} ${label}`;
    }

    // 3. Twin Pro-Style Club Crest Medallions
    if (this.dom.posterYouCrest) {
      this.dom.posterYouCrest.innerHTML = getPlayerCrestSvg();
    }
    if (this.dom.posterBotCrest) {
      this.dom.posterBotCrest.innerHTML = getBotCrestSvg(botTeam);
    }

    // 4. Split Team Name Lockup & Matchup Copy
    if (this.dom.welcomeModePill) {
      this.dom.welcomeModePill.textContent = this.mode === 'daily'
        ? `DAILY CUP • ${getTodayKey()}`
        : 'FREE PLAY SHOWDOWN';
    }
    if (this.dom.welcomeBotPillName) {
      const words = botTeam.name.toUpperCase().split(' ');
      const line1 = words[0] || botTeam.shortName;
      const line2 = words.slice(1).join(' ') || 'CLUB';
      this.dom.welcomeBotPillName.innerHTML =
        `<span class="poster-side-title">${line1}</span><span class="poster-side-sub">${line2}</span>`;
    }
    if (this.dom.welcomeHeadline) {
      this.dom.welcomeHeadline.textContent = `Welcome to You versus ${botTeam.name}!`;
    }
    if (this.dom.welcomeWeatherLine) {
      this.dom.welcomeWeatherLine.textContent =
        `The weather is ${matchWeather.weatherLabel} and it’s a ${matchWeather.dayAdjective} day to play Ultimate!`;
    }
    if (this.dom.welcomePersonalityNote) {
      this.dom.welcomePersonalityNote.textContent = `${botTeam.archetype.toUpperCase()} • “${botTeam.motto}”`;
    }
    if (this.dom.welcomePullLine) {
      this.dom.welcomePullLine.innerHTML =
        `<span class="pull-footer-highlight">GET READY</span> &bull; YOU’RE PULLING FIRST!`;
    }
    this.dom.welcomeBanner.classList.remove('hidden');
  }

  dismissWelcomeBanner() {
    if (this.dom.welcomeBanner) {
      this.dom.welcomeBanner.classList.add('hidden');
    }
  }

  startNewMatch(mode) {
    this.mode = mode;
    this.dom.modeQuickBtn.classList.toggle('active-mode', mode === 'quick');
    this.dom.modeDailyBtn.classList.toggle('active-mode', mode === 'daily');

    const todayKey = getTodayKey();
    let botTeam;
    let matchWeather;

    if (mode === 'daily') {
      this.rng = createSeededRng(`flatball-${todayKey}`);
      botTeam = getDailyBotTeam(todayKey);
      matchWeather = rollMatchWeather(createSeededRng(`flatball-weather-${todayKey}`));
    } else {
      this.rng = Math.random;
      const pool = BOT_TEAMS.filter((t) => t.id !== this.lastMatchBotId);
      botTeam = pool[Math.floor(this.rng() * pool.length)];
      matchWeather = rollMatchWeather(this.rng);
    }

    this.lastMatchBotId = botTeam.id;
    this.applyBotTeamTheme(botTeam);
    const botClub = `${botTeam.name} ${botTeam.emoji}`;

    this.state = {
      phase: 'PRE_PULL',
      botTeam,
      botClub,
      matchWeather,
      hypeIdx: 0,
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
        ? `📅 Daily Cup (${todayKey}): YOU vs. ${botClub} (${botTeam.archetype})`
        : `🥏 Free Play: YOU vs. ${botClub} (${botTeam.archetype})`,
      'neutral'
    );
    this.addFeedEntry(`🌤️ Forecast: ${matchWeather.weatherLabel}`, 'neutral');

    this.setupNextPoint('player', true);
    this.showWelcomeBanner();
  }

  setupNextPoint(pullingTeam, isOpeningPoint = false) {
    this.state.phase = 'PRE_PULL';
    this.state.pullingTeam = pullingTeam;
    this.state.startedPointOnDefense = pullingTeam === 'player';
    this.state.possession = pullingTeam === 'player' ? 'bot' : 'player';
    this.state.activeStrategyId = null;
    this.state.selectedCard = null;
    this.state.pointSummary = null;

    this.state.pointWind = nextPointWindFromForecast(
      this.state.matchWeather,
      this.rng,
      isOpeningPoint
    );
    this.choreo.setPointWind(this.state.pointWind);
    const wb = formatWindBadge(this.state.pointWind, this.state.possession);
    if (!isOpeningPoint && this.state.pointWind.strength !== 'calm') {
      this.addFeedEntry(`Wind Check: ${wb.text}`, 'neutral');
    }

    const pullerIdx = this.rng() < 0.5 ? 0 : 6; // Always pull from '1' (Home side) or '5' (Away side)
    this.state.pullerIdx = pullerIdx;
    this.choreo.setupPullLineup(pullingTeam, pullerIdx);
    this.updateScoreboard();
    this.updateLookBanner();
    const windNote = this.state.pointWind.strength === 'calm' ? 'Calm air' : wb.text;
    this.setTicker(
      pullingTeam === 'player'
        ? `Welcome to You vs. ${this.state.botTeam.name}! (${windNote}) Get ready — you’re pulling first!`
        : `${this.state.botClub} signals ready (${windNote}). Tap RECEIVE PULL — let’s cook!`
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
    // Personality bias: Bot club favors its signature offensive formations ~52% of the time!
    const botTeam = this.state.botTeam;
    if (botTeam && Array.isArray(botTeam.favOffenses) && this.rng() < 0.52) {
      const favPool = botTeam.favOffenses.filter((id) => id !== this.state.lastBotOffId && BOT_OFFENSES[id]);
      if (favPool.length > 0) {
        const favChosen = favPool[Math.floor(this.rng() * favPool.length)];
        this.state.lastBotOffId = favChosen;
        return favChosen;
      }
    }
    const pool = [
      'vert_stack',
      'ho_stack',
      'side_iso',
      'split_stack',
      'hex_flow',
      'handler_weave',
      'star_playmaker',
      'zone_spread'
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
      botTeam: this.state.botTeam,
      rng: this.rng
    });
    this.state.lastBotDefId = next.defId;
    return next;
  }

  formatForceBadge(forceSide, defId = null) {
    if (defId === 'bot_man_middle') return 'FORCE MIDDLE ▶◀';
    if (defId === 'bot_zone_cup' && this.renderer.scoutEnabled) return 'CUP SHELL ◠';
    return forceSide === 'home' ? 'FORCE HOME ◀' : 'FORCE AWAY ▶';
  }

  handlePullClick() {
    if (this.state.phase !== 'PRE_PULL') return;
    sound.unlock();
    this.dismissWelcomeBanner();
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
              ? `${resolveWorstOutcome(effBotOffObj, card.id)} Clap it up — our O-Line gets the disc next!`
              : `${this.state.botClub} worked patient passes across the line — nice grab! Our O-Line is up!`;
            this.addFeedEntry(`👏 ${this.state.botClub} Goal (${this.state.playerScore}–${this.state.botScore}): vs ${card.name}.`, 'bad');
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
        isBreakOpportunity: this.state.startedPointOnDefense,
        computeBotDefOnAdvance: (newX) => this.rollNextBotDefense(newX, true),
        computeBotOffOnTurn: (turnX, turnY) => this.pickBotOffense(turnY, false),
        onTicker: (msg) => this.setTicker(msg),
        onResult: (res) => {
          this.state.discX = res.newDiscX;
          this.state.discY = res.newDiscY;

          if (res.outcome === 'player_goal') {
            this.state.playerScore += 1;
            this.state.stats.pointHistory.push('W');
            const wasBreak = this.state.startedPointOnDefense;
            if (wasBreak) {
              this.state.stats.breakGoals += 1;
            }
            const baseReason = card.tier === 'ideal'
              ? effBotDefObj.outcomes.ideal
              : `${card.name} powered the remaining yards into the end zone for a pancake catch!`;
            const reason = wasBreak ? `📚 BOOKENDS! ${baseReason}` : baseReason;
            this.addFeedEntry(
              `${wasBreak ? '🔥 BOOKENDS BREAK!' : '🎉 GOAL!'} (${this.state.playerScore}–${this.state.botScore}) ${card.name} beat ${effBotDefObj.name}!`,
              'good'
            );
            this.enterPointOver('player', reason);
          } else if (res.outcome === 'advance') {
            const nextState = res.botDefState;
            const didAudible = nextState.defId !== prevDefState.defId || nextState.forceSide !== prevDefState.forceSide;
            this.state.botDefState = nextState;
            this.state.botLookId = nextState.defId;
            this.addFeedEntry(`⚡ Chilly +${res.yardsGained} yds with ${card.name}!`, 'mid');
            this.enterOffenseRead(true, didAudible);
          } else if (res.outcome === 'turnover_to_bot') {
            this.state.stats.turnsCommitted += 1;
            this.state.botLookId = res.nextBotOffId;
            this.state.activeStrategyId = null;
            this.addFeedEntry(`🥏 Turn vs ${effBotDefObj.name} — Hustle back on D!`, 'bad');
            this.enterDefenseRead(false, false);
            this.setTicker(`${resolveWorstOutcome(effBotDefObj, card.id)} Shake it off — let’s get that disc right back on D!`);
          }
        }
      });
    }
  }

  computeSpiritAward(iqPct, won) {
    if (this.state.stats.breakGoals >= 2) return '📚 SPIRIT AWARD: BOOKENDS LEGEND';
    if (this.state.stats.turnsForced >= 2) return '🦸 SPIRIT AWARD: LAYOUT ROYALTY';
    if (iqPct >= 85) return '🧊 SPIRIT AWARD: CHILLY HANDLER';
    if (won) return '🥞 SPIRIT AWARD: PANCAKE PLAYMAKER';
    return '🌟 SPIRIT AWARD: 10/10 SPIRIT CAPTAIN';
  }

  triggerSidelineCheer() {
    if (!this.state) return;
    const item = SIDELINE_CHEERS[this.state.hypeIdx % SIDELINE_CHEERS.length];
    this.state.hypeIdx += 1;
    this.choreo.triggerSidelineHype(item.shout);
    this.setTicker(item.msg);
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
    const award = this.computeSpiritAward(iqPct, won);

    if (this.dom.spiritAwardPill) {
      this.dom.spiritAwardPill.textContent = award;
    }
    this.dom.matchModalTitle.textContent = won ? '🏆 SPIRIT CIRCLE VICTORY!' : '🙌 GREAT GAME! SPIRIT CIRCLE!';
    this.dom.matchModalScore.textContent = `YOU ${this.state.playerScore}  —  ${this.state.botScore} ${this.state.botTeam.shortName}`;
    this.dom.matchModalSubtitle.textContent = won
      ? `High-fives down the line against ${this.state.botClub} — orange slices on us!`
      : `Awesome hustle against ${this.state.botClub}! High-five the line and run it back!`;

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
    const won = this.state.playerScore > this.state.botScore;
    const award = this.computeSpiritAward(iqPct, won).replace('SPIRIT AWARD: ', '');
    const blocks = this.state.stats.pointHistory.map((r) => (r === 'W' ? '🥏' : '👏')).join('');
    const header = this.mode === 'daily'
      ? `Flatball Tactics Daily (${getTodayKey()}) vs ${this.state.botClub}`
      : `Flatball Tactics vs ${this.state.botClub}`;
    const text = `${header}\nScore: ${this.state.playerScore}-${this.state.botScore} ${blocks}\n${award} | Turns Forced: ${this.state.stats.turnsForced} | IQ: ${iqPct}%\nhttps://punfiction.io/flatball/`;

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
        ? `<span class="pull-disc-icon">${PULL_DISC_LOGO_SVG}</span><span>PULL DISC</span><span class="pull-sub">Kick off &amp; read Bot Offense</span>`
        : `<span class="pull-disc-icon">${PULL_DISC_LOGO_SVG}</span><span>RECEIVE PULL</span><span class="pull-sub">Set your stack &amp; read Bot’s Force/Zone</span>`;
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
        ? (isBreak ? '🔥 BREAK GOAL! BOOKENDS! 📚🙌' : '🥞 PANCAKE SCORE! HOLD GOAL! 🎉')
        : '👏 NICE GRAB! OUR O-LINE IS UP NEXT!';

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'next-point-btn';
      nextBtn.textContent = isMatchDone ? 'Join the Spirit Circle ➔' : 'High-Five & Next Point ➔';
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
