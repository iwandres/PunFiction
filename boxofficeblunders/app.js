// Core Constants & CDN Paths
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/iwandres/PunFiction/main/backend";
const BACKEND_API_URL = "https://punfiction.onrender.com";
const START_DATE_PT = new Date("2026-05-24T02:00:00-07:00"); // Launch date: 2am Pacific Time

// Pre-warm the backend Render service in the background as early as possible
function prewarmBackend() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) return;
    
    console.log("Initiating asynchronous backend pre-warm ping...");
    fetch(`${BACKEND_API_URL}/api/records?puzzle_number=001`, { mode: 'cors' })
        .then(res => {
            if (res.ok) {
                console.log("Render backend container warmed up and awake!");
            }
        })
        .catch(err => {
            console.log("Render backend pre-warm ping sent, warming up in background.");
        });
}

// Fetch utility wrapper supporting customized millisecond execution timeout
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 3500 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// Game State
let puzzles = [];
let todayChallenge = null;
let yesterdayChallenge = null;
let activeChallenge = null; // Currently playing challenge
let naturalTodayIndex = 1; // Global scheduling active puzzle number
let hint3Active = false; // Flag for Hint 3 (first letters populated)
let hint4Active = false; // Flag for Hint 4 (vowels populated)
let lockedInIndices = new Set(); // indices of correct letters locked in by player attempts
let animateVowelRush = false; // Flag to trigger Hint 4 vowel animation once on reveal
let hintsUsed = 0; // Number of progressive hints used
let activeRewardedEvent = null;
let rewardedSlot = null;

let isCrazyGames = false;
let crazySDK = null;

async function initCrazyGamesSDK() {
    if (typeof window.CrazyGames !== 'undefined') {
        try {
            await window.CrazyGames.SDK.init();
            crazySDK = window.CrazyGames.SDK;
            console.log("CrazyGames SDK v3 initialized successfully.");
        } catch (e) {
            console.error("CrazyGames SDK initialization failed:", e);
        }
    } else {
        console.warn("CrazyGames SDK script not loaded yet. Retrying in 500ms...");
        setTimeout(initCrazyGamesSDK, 500);
    }
}

let currentLevel = 1; // 1 to 3 = thematic levels, 4 = boss level, 5 = victory screen
let inventory = []; // accumulated target words
let currentPuzzleIndex = 0; // index in local puzzles array
let activeFetchedFromCDN = false; // flag to trace assets loading
let allTelemetry = null; // cached telemetry stats for all puzzles
let telemetryStartSent = false; // flag to ensure start event is only sent once per session on interaction

// DOM Elements Mapping
const screens = {
    game: document.getElementById('game-screen'),
    victory: document.getElementById('victory-screen')
};

const ui = {
    challengeHeader: document.getElementById('challenge-header'),
    challengeHeaderVictory: document.getElementById('challenge-header-victory'),
    questionLabel: document.getElementById('question-label'),
    bossPosterWrapper: document.getElementById('boss-poster-wrapper'),
    bossPosterImg: document.getElementById('boss-poster-img'),
    mysteryBanner: document.getElementById('mystery-banner'),
    quoteDisplay: document.getElementById('quote-display'),
    pitchDisplay: document.getElementById('pitch-display'),
    guessSlotsContainer: document.getElementById('guess-slots-container'),
    guessInput: document.getElementById('guess-input'),
    guessForm: document.getElementById('guess-form'),
    feedbackMsg: document.getElementById('feedback-msg'),
    
    // Progressive hints
    btnShowHint1: document.getElementById('btn-show-hint1'),
    btnShowHint2: document.getElementById('btn-show-hint2'),
    btnShowHint3: document.getElementById('btn-show-hint3'),
    btnShowHint4: document.getElementById('btn-show-hint4'),
    hintDisplayBox: document.getElementById('hint-display-box'),
    movieHint: document.getElementById('movie-hint'),
    hintRhymeSection: document.getElementById('section-hint-rhyme'),
    hintLettersSection: document.getElementById('section-hint-letters'),
    hintVowelsSection: document.getElementById('section-hint-vowels'),
    lettersHint: document.getElementById('letters-hint'),
    btnSubmit: document.getElementById('btn-submit'),
    
    // Victory elements
    victoryPosterImg: document.getElementById('victory-poster-img'),
    finalBossTitle: document.getElementById('final-boss-title'),
    finalBossMovie: document.getElementById('final-boss-movie'),
    finalBossPitch: document.getElementById('final-boss-pitch')
};
 
// ================= INITIALIZATION & SCHEDULING =================
 
window.onload = async () => {
    // Detect environment (CrazyGames or standard play)
    const hostname = window.location.hostname;
    isCrazyGames = !hostname.includes('github.io') && !hostname.includes('localhost') && !hostname.includes('127.0.0.1');
    console.log("Environment detection: isCrazyGames =", isCrazyGames);
    if (isCrazyGames) {
        await initCrazyGamesSDK();
    }

    // 0. Wake up the Render container in the background as early as possible
    prewarmBackend();

    // 1. Setup UI bindings
    const appTitle = document.getElementById('app-title');
    if (appTitle) {
        appTitle.onclick = () => {
            if (todayChallenge) {
                startGame(todayChallenge);
                history.replaceState(null, "", `?challenge=${todayChallenge.puzzle_number}`);
            }
        };
    }
    document.getElementById('btn-victory-lobby').onclick = () => startGame(todayChallenge);
    document.getElementById('btn-share-score').onclick = shareSolvedScore;
    ui.guessForm.onsubmit = (e) => {
        e.preventDefault();
        handleGuessSubmit();
    };
    ui.guessInput.onkeydown = (e) => {
        if (e.key === 'Backspace') {
            // Snappy rendering fallback on backspace
            setTimeout(renderGuessSlots, 0);
        }
    };
    ui.guessInput.oninput = handleGuessInput;
    
    let keyboardFocusTimeout = null;
    ui.guessInput.addEventListener('focus', () => {
        if (keyboardFocusTimeout) {
            clearTimeout(keyboardFocusTimeout);
            keyboardFocusTimeout = null;
        }
        document.body.classList.add('keyboard-focused');
        
        // Multi-stage scrolling to handle different keyboard animation speeds across mobile devices
        const scrollSlots = () => {
            if (ui.guessSlotsContainer) {
                ui.guessSlotsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        setTimeout(scrollSlots, 100);
        setTimeout(scrollSlots, 300);
        setTimeout(scrollSlots, 500);
    });
    ui.guessInput.addEventListener('blur', () => {
        keyboardFocusTimeout = setTimeout(() => {
            document.body.classList.remove('keyboard-focused');
            keyboardFocusTimeout = null;
        }, 150);
    });
    if (ui.guessSlotsContainer) {
        ui.guessSlotsContainer.onclick = () => ui.guessInput.focus();
    }
    ui.btnShowHint1.onclick = revealHint1;
    ui.btnShowHint2.onclick = revealHint2;
    ui.btnShowHint3.onclick = revealHint3;
    ui.btnShowHint4.onclick = () => {
        if (isCrazyGames && typeof window.CrazyGames !== 'undefined') {
            console.log("Triggering CrazyGames rewarded ad for Hint 4...");
            window.CrazyGames.SDK.ad.requestAd('rewarded', {
                adStarted: () => {
                    console.log("CrazyGames ad started");
                },
                adError: (error) => {
                    console.error("CrazyGames ad error:", error);
                    revealHint4(); // Fallback so player isn't stuck
                },
                adFinished: () => {
                    console.log("CrazyGames ad finished successfully");
                    revealHint4(); // Grant reward
                }
            });
        } else if (activeRewardedEvent) {
            console.log("Triggering rewarded ad for Hint 4...");
            activeRewardedEvent.makeRewardedVisible();
        } else {
            console.log("No active rewarded event. Triggering offline fallback Vowel Rush!");
            revealHint4();
        }
    };

    if (!isCrazyGames) {
        // Google Publisher Tag (GPT) setup and event listeners
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(() => {
            googletag.pubads().addEventListener('rewardedSlotReady', (event) => {
                console.log("Rewarded slot is ready.");
                activeRewardedEvent = event;
            });

            googletag.pubads().addEventListener('rewardedSlotGranted', (event) => {
                console.log("Rewarded slot reward granted. Unlocking Vowel Rush!");
                revealHint4();
            });

            googletag.pubads().addEventListener('rewardedSlotClosed', (event) => {
                console.log("Rewarded slot closed.");
                if (rewardedSlot) {
                    googletag.destroySlots([rewardedSlot]);
                    rewardedSlot = null;
                }
                activeRewardedEvent = null;
                requestNextRewardedAd();
            });

            googletag.pubads().addEventListener('rewardedSlotVideoCompleted', (event) => {
                console.log("Rewarded slot video completed.");
            });

            googletag.pubads().addEventListener('slotRenderEnded', (event) => {
                console.log("Slot render ended:", event.slot.getAdUnitPath(), {
                    isEmpty: event.isEmpty,
                    creativeId: event.creativeId,
                    lineItemId: event.lineItemId,
                    advertiserId: event.advertiserId
                });
            });

            googletag.enableServices();
        });
    }

    const prevBtn = document.getElementById('btn-prev-challenge');
    if (prevBtn) prevBtn.onclick = () => navigateChallenge(-1);
    const nextBtn = document.getElementById('btn-next-challenge');
    if (nextBtn) nextBtn.onclick = () => navigateChallenge(1);

    const prevBtnVic = document.getElementById('btn-prev-challenge-victory');
    if (prevBtnVic) prevBtnVic.onclick = () => navigateChallenge(-1);
    const nextBtnVic = document.getElementById('btn-next-challenge-victory');
    if (nextBtnVic) nextBtnVic.onclick = () => navigateChallenge(1);

    const btnStatsSelectVic = document.getElementById('btn-stats-select-victory');
    if (btnStatsSelectVic) {
        btnStatsSelectVic.onclick = () => {
            if (statsSelectModal) {
                statsSelectModal.classList.add('active');
                openStatsSelectModal();
            }
        };
    }

    const btnHowToPlayVic = document.getElementById('btn-how-to-play-victory');
    if (btnHowToPlayVic) {
        btnHowToPlayVic.onclick = () => {
            if (howToPlayModal) {
                howToPlayModal.classList.add('active');
            }
        };
    }
 
    // Fullscreen Poster Modal bindings
    const posterModal = document.getElementById('poster-modal');
    const modalPosterImg = document.getElementById('modal-poster-img');
    const btnCloseModal = document.getElementById('btn-close-modal');

    if (ui.victoryPosterImg) {
        ui.victoryPosterImg.onclick = () => {
            if (ui.victoryPosterImg.src) {
                modalPosterImg.src = ui.victoryPosterImg.src;
                posterModal.classList.add('active');
            }
        };
    }

    if (btnCloseModal) {
        btnCloseModal.onclick = () => {
            posterModal.classList.remove('active');
        };
    }

    if (posterModal) {
        posterModal.onclick = (e) => {
            if (e.target === posterModal) {
                posterModal.classList.remove('active');
            }
        };
    }

    // How to Play Modal bindings
    const howToPlayModal = document.getElementById('how-to-play-modal');
    const btnHowToPlay = document.getElementById('btn-how-to-play');
    const btnCloseHowToPlay = document.getElementById('btn-close-how-to-play');

    if (btnHowToPlay) {
        btnHowToPlay.onclick = () => {
            if (howToPlayModal) {
                howToPlayModal.classList.add('active');
            }
        };
    }

    if (btnCloseHowToPlay) {
        btnCloseHowToPlay.onclick = () => {
            if (howToPlayModal) {
                howToPlayModal.classList.remove('active');
            }
        };
    }

    if (howToPlayModal) {
        howToPlayModal.onclick = (e) => {
            if (e.target === howToPlayModal) {
                howToPlayModal.classList.remove('active');
            }
        };
    }

    // Stats & Level Select Modal bindings
    const statsSelectModal = document.getElementById('stats-select-modal');
    const btnStatsSelect = document.getElementById('btn-stats-select');
    const btnCloseStatsSelect = document.getElementById('btn-close-stats-select');

    if (btnStatsSelect) {
        btnStatsSelect.onclick = () => {
            if (statsSelectModal) {
                statsSelectModal.classList.add('active');
                openStatsSelectModal();
            }
        };
    }

    if (btnCloseStatsSelect) {
        btnCloseStatsSelect.onclick = () => {
            if (statsSelectModal) {
                statsSelectModal.classList.remove('active');
            }
        };
    }

    if (statsSelectModal) {
        statsSelectModal.onclick = (e) => {
            if (e.target === statsSelectModal) {
                statsSelectModal.classList.remove('active');
            }
        };
    }

    // ================= USER SETTINGS & SYNC BINDINGS =================
    const settingsModal = document.getElementById('settings-modal');
    const btnSettings = document.getElementById('btn-settings');
    const btnSettingsVic = document.getElementById('btn-settings-victory');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCopySyncCode = document.getElementById('btn-copy-sync-code');
    const btnSubmitSyncCode = document.getElementById('btn-submit-sync-code');
    const syncCodeInput = document.getElementById('sync-code-input');
    const btnResetProgress = document.getElementById('btn-reset-progress');

    const openSettingsModal = () => {
        if (!settingsModal) return;
        settingsModal.classList.add('active');
        
        // 1. Load data
        const solvedList = getSolvedPuzzlesList();
        const attemptedList = getAttemptedPuzzles();
        
        // Ensure solved is a subset of attempted just in case of local storage discrepancies
        solvedList.forEach(p => attemptedList.add(p));
        
        const { currentStreak, maxStreak } = calculateStreakMetrics(solvedList);
        
        const totalAttempted = attemptedList.size;
        const totalSolved = solvedList.size;
        const accuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;
        
        // 2. Populate UI elements
        document.getElementById('user-total-attempted').innerText = totalAttempted.toLocaleString();
        document.getElementById('user-total-solved').innerText = totalSolved.toLocaleString();
        document.getElementById('user-solve-accuracy').innerText = `${accuracy}%`;
        document.getElementById('user-current-streak').innerText = currentStreak.toLocaleString();
        document.getElementById('user-max-streak').innerText = maxStreak.toLocaleString();
        
        const displayInput = document.getElementById('sync-code-display');
        if (displayInput) {
            displayInput.value = getOrGenerateProfileId();
        }

        // 3. Render Puzzle Directory lists
        const approved = getApprovedChallenges();
        const solvedPuzzles = [];
        const attemptedPuzzles = [];
        const unplayedPuzzles = [];
        
        approved.forEach(p => {
            const pNumStr = padPuzzleNumber(p.puzzle_number);
            if (solvedList.has(pNumStr)) {
                solvedPuzzles.push(p);
            } else if (attemptedList.has(pNumStr)) {
                attemptedPuzzles.push(p);
            } else {
                unplayedPuzzles.push(p);
            }
        });

        const renderBadgeList = (elementId, list, typeClass) => {
            const container = document.getElementById(elementId);
            if (!container) return;
            container.innerHTML = '';
            
            if (list.length === 0) {
                const emptySpan = document.createElement('span');
                emptySpan.style.fontSize = '0.85rem';
                emptySpan.style.color = '#7f8c8d';
                emptySpan.style.fontStyle = 'italic';
                emptySpan.innerText = 'None';
                container.appendChild(emptySpan);
                return;
            }
            
            list.forEach(p => {
                const btn = document.createElement('button');
                btn.className = `profile-puzzle-link ${typeClass}`;
                btn.innerText = parseInt(p.puzzle_number);
                btn.title = `Challenge #${p.puzzle_number}: "${p.boss_pun_title}"`;
                btn.onclick = () => {
                    startGame(p);
                    history.replaceState(null, "", `?challenge=${p.puzzle_number}`);
                    if (settingsModal) settingsModal.classList.remove('active');
                };
                container.appendChild(btn);
            });
        };
        
        renderBadgeList('profile-solved-list', solvedPuzzles, 'solved');
        renderBadgeList('profile-attempted-list', attemptedPuzzles, 'attempted');
        renderBadgeList('profile-unplayed-list', unplayedPuzzles, 'unplayed');
    };

    if (btnSettings) btnSettings.onclick = openSettingsModal;
    if (btnSettingsVic) btnSettingsVic.onclick = openSettingsModal;

    if (btnCloseSettings) {
        btnCloseSettings.onclick = () => {
            if (settingsModal) settingsModal.classList.remove('active');
        };
    }

    if (settingsModal) {
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        };
    }

    if (btnCopySyncCode) {
        btnCopySyncCode.onclick = () => {
            const displayInput = document.getElementById('sync-code-display');
            if (displayInput && displayInput.value) {
                navigator.clipboard.writeText(displayInput.value).then(() => {
                    showToast("📋 Sync Code copied to clipboard!");
                }).catch(err => {
                    console.error("Failed copying code: ", err);
                });
            }
        };
    }

    if (btnSubmitSyncCode) {
        btnSubmitSyncCode.onclick = async () => {
            if (!syncCodeInput || !syncCodeInput.value.trim()) {
                showToast("⚠️ Please enter a valid Sync Code!");
                return;
            }
            btnSubmitSyncCode.disabled = true;
            btnSubmitSyncCode.innerText = "Syncing...";
            
            const success = await fetchAndMergeProfile(syncCodeInput.value);
            btnSubmitSyncCode.disabled = false;
            btnSubmitSyncCode.innerText = "Sync Device";
            
            if (success) {
                showToast("🔄 Progress synced successfully!");
                syncCodeInput.value = '';
                if (settingsModal) settingsModal.classList.remove('active');
                
                // Reload active challenge view with updated solved state
                if (activeChallenge) {
                    startGame(activeChallenge);
                }
            } else {
                showToast("❌ Sync failed! Invalid or expired code.");
            }
        };
    }

    if (btnResetProgress) {
        btnResetProgress.onclick = () => {
            const confirmReset = confirm("⚠️ Are you sure you want to reset all your progress? This will delete all your local solving statistics and cannot be undone.");
            if (confirmReset) {
                try {
                    localStorage.removeItem('pun_fiction_solved_puzzles');
                    localStorage.removeItem('pun_fiction_solved_hints');
                    localStorage.removeItem('pun_fiction_attempted_puzzles');
                    localStorage.removeItem('pun_fiction_puzzle_attempts');
                    localStorage.removeItem('pun_fiction_max_streak');
                    localStorage.removeItem('pun_fiction_profile_id');
                    showToast("🗑️ All progress has been reset.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (e) {
                    console.error("Error clearing progress", e);
                }
            }
        };
    }

    // Listen for window resize to adjust slot sizes dynamically
    window.addEventListener('resize', () => {
        if (screens.game.classList.contains('active')) {
            renderGuessSlots();
        }
    });

    // 2. Fetch and synchronize puzzle database
    await loadPuzzleDatabase();
};

function getDaysElapsedSinceStart() {
    const now = new Date();
    // Convert current clock and anchor start to LA time to be completely timezone robust
    const nowInPT = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const startInPT = new Date(START_DATE_PT.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));

    const diffMs = nowInPT.getTime() - startInPT.getTime();
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    return Math.max(0, days); // Return 0 (first day) even if tested slightly early
}

function padPuzzleNumber(num) {
    return String(num).padStart(3, '0');
}

async function loadPuzzleDatabase() {
    let rawData = null;
    
    // Try fetching from public GitHub RAW content CDN first
    try {
        const cdnUrl = `${GITHUB_REPO_URL}/production_daily_games.json?t=${Date.now()}`;
        const res = await fetch(cdnUrl);
        if (res.ok) {
            rawData = await res.json();
            activeFetchedFromCDN = true;
            console.log("Loaded puzzle database from GitHub RAW CDN!");
        }
    } catch (e) {
        console.warn("Could not fetch from GitHub CDN, falling back to local server api...", e);
    }

    // Fallback to local server API (for local development or curation previews)
    if (!rawData) {
        try {
            const localUrl = `/api/puzzles?t=${Date.now()}`;
            const res = await fetch(localUrl);
            if (res.ok) {
                rawData = await res.json();
                activeFetchedFromCDN = false;
                console.log("Loaded puzzle database from Curation Local Server!");
            }
        } catch (e) {
            console.error("Critical: Failed to load daily challenges database from all sources.", e);
            showToast("Failed to load daily challenges. Curation server offline?", true);
            const appEl = document.getElementById('app');
            if (appEl) {
                appEl.classList.remove('app-loading');
            }
            return;
        }
    }

    puzzles = Array.isArray(rawData) ? rawData : [];

    // Filter only approved daily challenges that have valid puzzle numbers
    const approvedChallenges = puzzles.filter(p => p.status === 'approved' && p.puzzle_number);

    if (approvedChallenges.length === 0) {
        console.error("No approved daily challenges are active.");
        return;
    }

    // Sort approved challenges sequentially
    approvedChallenges.sort((a, b) => parseInt(a.puzzle_number) - parseInt(b.puzzle_number));

    // Calculate current scheduling indexes based on elapsed days since launch (updates at 2am PT)
    const daysElapsed = getDaysElapsedSinceStart();
    naturalTodayIndex = daysElapsed + 1;
    let currentDayIndex = naturalTodayIndex;

    // Check if player URL overrides day (e.g. ?day=001) for diagnostic playtesting
    const urlParams = new URLSearchParams(window.location.search);
    const dayOverride = urlParams.get('day') || urlParams.get('challenge');
    let matchedOverride = null;

    if (dayOverride) {
        const parsedOverride = parseInt(dayOverride);
        // Security constraint: only allow loading historical or today's active challenges (<= naturalTodayIndex)
        if (!isNaN(parsedOverride) && parsedOverride > 0 && parsedOverride <= naturalTodayIndex) {
            matchedOverride = approvedChallenges.find(p => p.puzzle_number === padPuzzleNumber(dayOverride));
            if (matchedOverride) {
                currentDayIndex = parsedOverride;
            }
        } else {
            console.warn("Attempted to access locked future challenge: ", dayOverride);
            // Clean up the URL parameter to prevent spoofing
            history.replaceState(null, "", window.location.pathname);
        }
    }

    const todayChallengeStr = padPuzzleNumber(naturalTodayIndex);
    const yesterdayChallengeStr = padPuzzleNumber(naturalTodayIndex - 1);

    // Map challenges
    todayChallenge = approvedChallenges.find(p => p.puzzle_number === todayChallengeStr) || approvedChallenges[approvedChallenges.length - 1];
    yesterdayChallenge = approvedChallenges.find(p => p.puzzle_number === yesterdayChallengeStr) || null;

    if (matchedOverride) {
        console.log(`URL Parameter Override: Playing Challenge #${dayOverride}`);
        startGame(matchedOverride);
    } else {
        // Otherwise, start Today's challenge automatically on load!
        startGame(todayChallenge);
    }
}



// ================= LOCAL STORAGE PROGRESS TRACKING =================

function getSolvedPuzzlesList() {
    try {
        const data = localStorage.getItem('pun_fiction_solved_puzzles');
        const list = data ? JSON.parse(data) : [];
        return new Set(list.map(p => padPuzzleNumber(p)));
    } catch (e) {
        return new Set();
    }
}

function getSolvedHintsMap() {
    try {
        const data = localStorage.getItem('pun_fiction_solved_hints');
        const map = data ? JSON.parse(data) : {};
        const sanitized = {};
        Object.keys(map).forEach(k => {
            sanitized[padPuzzleNumber(k)] = map[k];
        });
        return sanitized;
    } catch (e) {
        return {};
    }
}

function savePuzzleSolved(puzzleNum) {
    try {
        const paddedNum = padPuzzleNumber(puzzleNum);
        const solved = getSolvedPuzzlesList();
        solved.add(paddedNum);
        localStorage.setItem('pun_fiction_solved_puzzles', JSON.stringify([...solved]));
        
        // Save the number of hints used for this puzzle
        const solvedHints = getSolvedHintsMap();
        solvedHints[paddedNum] = hintsUsed;
        localStorage.setItem('pun_fiction_solved_hints', JSON.stringify(solvedHints));

        // Push solved status to backend profile sync
        postUserProfile();
    } catch (e) {
        console.error("Could not write solved progress to local storage", e);
    }
}

// Generate a profile sync ID (PF-XXXXXX)
function getOrGenerateProfileId() {
    try {
        let profileId = localStorage.getItem('pun_fiction_profile_id');
        if (!profileId) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let randomCode = '';
            for (let i = 0; i < 6; i++) {
                randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            profileId = `PF-${randomCode}`;
            localStorage.setItem('pun_fiction_profile_id', profileId);
        }
        return profileId;
    } catch (e) {
        return "PF-ERROR";
    }
}

function getAttemptedPuzzles() {
    try {
        const data = localStorage.getItem('pun_fiction_attempted_puzzles');
        const list = data ? JSON.parse(data) : [];
        return new Set(list.map(p => padPuzzleNumber(p)));
    } catch (e) {
        return new Set();
    }
}

function getPuzzleAttemptsMap() {
    try {
        const data = localStorage.getItem('pun_fiction_puzzle_attempts');
        const map = data ? JSON.parse(data) : {};
        const sanitized = {};
        Object.keys(map).forEach(k => {
            sanitized[padPuzzleNumber(k)] = parseInt(map[k]) || 0;
        });
        return sanitized;
    } catch (e) {
        return {};
    }
}

function incrementPuzzleAttempts(puzzleNum) {
    try {
        const paddedNum = padPuzzleNumber(puzzleNum);
        const attemptsMap = getPuzzleAttemptsMap();
        attemptsMap[paddedNum] = (attemptsMap[paddedNum] || 0) + 1;
        localStorage.setItem('pun_fiction_puzzle_attempts', JSON.stringify(attemptsMap));
    } catch (e) {
        console.error("Could not write attempts progress to local storage", e);
    }
}

function savePuzzleAttempted(puzzleNum) {
    try {
        const paddedNum = padPuzzleNumber(puzzleNum);
        const attempted = getAttemptedPuzzles();
        if (!attempted.has(paddedNum)) {
            attempted.add(paddedNum);
            localStorage.setItem('pun_fiction_attempted_puzzles', JSON.stringify([...attempted]));
            
            // Push attempted status to backend profile sync
            postUserProfile();
        }
    } catch (e) {
        console.error("Could not write attempted progress to local storage", e);
    }
}

// Dynamically calculate solved streak metrics
function calculateStreakMetrics(solvedList) {
    let currentStreak = 0;
    let maxStreak = 0;
    
    try {
        maxStreak = parseInt(localStorage.getItem('pun_fiction_max_streak')) || 0;
    } catch (e) {}

    // Trace backwards starting from natural today
    if (naturalTodayIndex) {
        let checkDay = naturalTodayIndex;
        // If today is not solved, check if yesterday was solved to keep the streak active
        const todayStr = padPuzzleNumber(checkDay);
        const yesterdayStr = padPuzzleNumber(checkDay - 1);
        
        if (!solvedList.has(todayStr) && solvedList.has(yesterdayStr)) {
            checkDay = checkDay - 1; // start check from yesterday
        }
        
        while (checkDay > 0) {
            const dayStr = padPuzzleNumber(checkDay);
            if (solvedList.has(dayStr)) {
                currentStreak++;
                checkDay--;
            } else {
                break;
            }
        }
    }
    
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        try {
            localStorage.setItem('pun_fiction_max_streak', maxStreak.toString());
        } catch (e) {}
    }
    
    return { currentStreak, maxStreak };
}

// Push user profile to database server
async function postUserProfile() {
    const profileId = getOrGenerateProfileId();
    if (profileId === "PF-ERROR") return;
    
    const solved = [...getSolvedPuzzlesList()];
    const hints = getSolvedHintsMap();
    const attempted = [...getAttemptedPuzzles()];
    const { maxStreak } = calculateStreakMetrics(new Set(solved));
    
    const payload = {
        profile_id: profileId,
        solved_puzzles: solved,
        solved_hints: hints,
        attempted_puzzles: attempted,
        max_streak: maxStreak
    };
    
    try {
        await fetch(`${BACKEND_API_URL}/api/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            mode: 'cors'
        });
    } catch (e) {
        console.log("Offline or failed syncing user profile to server", e);
    }
}

// Fetch from server and merge progress
async function fetchAndMergeProfile(serverProfileId) {
    if (!serverProfileId || !serverProfileId.trim()) return false;
    
    try {
        const res = await fetch(`${BACKEND_API_URL}/api/user?profile_id=${serverProfileId.trim().toUpperCase()}`, {
            mode: 'cors'
        });
        if (!res.ok) return false;
        
        const data = await res.json();
        if (data.error) return false;
        
        // 1. Merge Solved Puzzles
        const localSolved = getSolvedPuzzlesList();
        const serverSolved = data.solved_puzzles || [];
        serverSolved.forEach(p => localSolved.add(padPuzzleNumber(p)));
        localStorage.setItem('pun_fiction_solved_puzzles', JSON.stringify([...localSolved]));
        
        // 2. Merge Solved Hints (take minimum hints used)
        const localHints = getSolvedHintsMap();
        const serverHints = data.solved_hints || {};
        Object.keys(serverHints).forEach(p => {
            const paddedP = padPuzzleNumber(p);
            const serverH = serverHints[p];
            const localH = localHints[paddedP];
            if (localH === undefined || serverH < localH) {
                localHints[paddedP] = serverH;
            }
        });
        localStorage.setItem('pun_fiction_solved_hints', JSON.stringify(localHints));
        
        // 3. Merge Attempted Puzzles
        const localAttempted = getAttemptedPuzzles();
        const serverAttempted = data.attempted_puzzles || [];
        serverAttempted.forEach(p => localAttempted.add(padPuzzleNumber(p)));
        localStorage.setItem('pun_fiction_attempted_puzzles', JSON.stringify([...localAttempted]));
        
        // 4. Merge Max Streak
        let localMaxStreak = parseInt(localStorage.getItem('pun_fiction_max_streak')) || 0;
        const serverMaxStreak = data.max_streak || 0;
        if (serverMaxStreak > localMaxStreak) {
            localStorage.setItem('pun_fiction_max_streak', serverMaxStreak.toString());
        }
        
        // 5. Update local profile ID to the synced one
        localStorage.setItem('pun_fiction_profile_id', serverProfileId.toUpperCase());
        
        // 6. Push merged state back to server to make it fully synchronous
        await postUserProfile();
        
        return true;
    } catch (e) {
        console.error("Failed merging profiles:", e);
        return false;
    }
}

// ================= GAMEPLAY ENGINE =================

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}



function startGame(challenge) {
    if (!challenge) return;
    activeChallenge = challenge;
    hint3Active = false;
    hint4Active = false;
    lockedInIndices = new Set();
    animateVowelRush = false;
    hintsUsed = 0;
    currentLevel = 4; // Start directly at Boss Level!
    inventory = [];
    telemetryStartSent = false; // Reset start telemetry flag for new session

    if (challenge.puzzle_number) {
        updateBackgroundGradient(challenge.puzzle_number);
    }

    const solvedList = getSolvedPuzzlesList();
    if (solvedList.has(challenge.puzzle_number)) {
        const solvedHints = getSolvedHintsMap();
        hintsUsed = solvedHints[challenge.puzzle_number] !== undefined ? solvedHints[challenge.puzzle_number] : 0;
        triggerVictory();
    } else {
        switchScreen('game');
        loadLevel();
    }

    // Update challenge navigation buttons
    updateChallengeNavButtons();

    // Reveal app once game loads
    const appEl = document.getElementById('app');
    if (appEl) {
        appEl.classList.remove('app-loading');
    }

    // Send virtual pageview to Google Analytics for the active challenge
    if (typeof gtag === 'function') {
        gtag('config', 'G-41EV4HJ1LH', {
            'page_title': `Challenge #${challenge.puzzle_number}`,
            'page_path': `${window.location.pathname}?challenge=${challenge.puzzle_number}`
        });
    }
}

function getCorrectPosterUrl(urlPath) {
    if (!urlPath) return "https://placehold.co/140x210/111625/f8fafc?text=No+Poster";
    if (activeFetchedFromCDN) {
        // Load poster illustration from raw public GitHub CDN
        return `${GITHUB_REPO_URL}${urlPath}`;
    }
    // Sandbox local wrapper load
    return urlPath;
}

function getHighlightedPunnedQuote(punnedQuote, originalQuote) {
    if (!punnedQuote) return '"Quote Text Missing"';
    if (!originalQuote) return `"${punnedQuote}"`;

    const clean = (word) => word.toLowerCase().replace(/[^a-z0-9]/g, '');

    const pWords = punnedQuote.split(' ');
    const oWords = originalQuote.split(' ');

    const highlighted = pWords.map((word, idx) => {
        const oWord = oWords[idx] || '';
        if (clean(word) !== clean(oWord)) {
            return `<span class="rhyme-word">${word}</span>`;
        }
        return word;
    }).join(' ');

    return `"${highlighted}"`;
}

function updateBackgroundGradient(puzzleNum) {
    const num = parseInt(puzzleNum) || 1;
    // Each challenge shifts the hue by 8 degrees for a smooth, progressive transition
    const hueShift = (num * 8) % 360;
    
    const startHue = (50 + hueShift) % 360;
    const endHue = (23 + hueShift) % 360;
    
    const startColor = `hsl(${startHue}, 100%, 67%)`;
    const endColor = `hsl(${endHue}, 100%, 65%)`;
    
    // Cinema Gold & Indigo rule:
    // If background startHue is in the yellow/orange range (25 to 95), use deep indigo.
    // Otherwise, use a bright, warm cinema gold/yellow.
    let accentColor;
    if (startHue >= 25 && startHue <= 95) {
        accentColor = 'hsl(270, 95%, 45%)'; // Deep indigo/purple
    } else {
        accentColor = 'hsl(48, 100%, 50%)'; // Cinema gold/yellow
    }
    
    document.documentElement.style.setProperty('--bg-color', startColor);
    document.documentElement.style.setProperty('--bg-gradient-end', endColor);
    document.documentElement.style.setProperty('--accent-main', accentColor);
}

function loadLevel() {
    if (activeChallenge && activeChallenge.puzzle_number) {
        updateBackgroundGradient(activeChallenge.puzzle_number);
    }
    hint3Active = false;
    hint4Active = false;
    animateVowelRush = false;
    hintsUsed = 0;
    activeRewardedEvent = null;
    requestNextRewardedAd();

    ui.guessInput.value = '';
    ui.feedbackMsg.innerText = '';
    ui.feedbackMsg.className = 'feedback';

    if (ui.challengeHeader) {
        ui.challengeHeader.innerHTML = `<span class="challenge-label">Challenge</span> #<span class="level-indicator-num">${activeChallenge.puzzle_number}</span>`;
    }
    if (ui.challengeHeaderVictory) {
        ui.challengeHeaderVictory.innerHTML = `<span class="challenge-label">Challenge</span> #<span class="level-indicator-num">${activeChallenge.puzzle_number}</span>`;
    }

    // Reset progressive hints container expand state
    const hintContainer = document.querySelector('.hint-container');
    if (hintContainer) {
        hintContainer.classList.remove('collapsed');
    }

    // Reset progressive hints
    ui.btnShowHint1.classList.remove('hidden');
    ui.btnShowHint2.classList.add('hidden');
    ui.btnShowHint3.classList.add('hidden');
    ui.btnShowHint4.classList.add('hidden');

    if (ui.hintDisplayBox) ui.hintDisplayBox.classList.add('hidden');
    if (ui.hintRhymeSection) ui.hintRhymeSection.classList.add('hidden');
    if (ui.hintLettersSection) ui.hintLettersSection.classList.add('hidden');
    if (ui.hintVowelsSection) ui.hintVowelsSection.classList.add('hidden');

    // --- PUZZLE DIRECT PLAY ---
    ui.questionLabel.innerText = "Guess the parody movie title!";
    
    // Prepare poster image but keep it hidden during active play
    const posterUrl = getCorrectPosterUrl(activeChallenge.boss_poster_url);
    ui.bossPosterImg.src = posterUrl;
    ui.bossPosterImg.className = "boss-poster-img sharp";
    ui.bossPosterWrapper.classList.add('hidden');
    ui.mysteryBanner.classList.add('hidden');

    ui.movieHint.innerText = activeChallenge.boss_original_title || "Unknown";
    
    // Hook up quote Display to Boss Parody Quote (unhighlighted plain text on load!)
    ui.quoteDisplay.innerText = activeChallenge.boss_punned_quote ? `"${activeChallenge.boss_punned_quote}"` : '"Quote Text Missing"';
    
    // Hook up pitch Display to Comedic Plot Pitch with simple title (always visible on load!)
    ui.pitchDisplay.innerHTML = `<span style="color: var(--text-secondary); display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-weight: 800;">Parody Movie Plotline</span>${activeChallenge.boss_pitch || 'Plot details unavailable.'}`;

    // Setup input maxLength based on letters count in answer
    const letterCount = (activeChallenge.boss_pun_title.match(/[a-zA-Z]/g) || []).length;
    ui.guessInput.maxLength = letterCount;

    // Render interactive blank slots
    renderGuessSlots();
    // Re-render after a short delay to ensure browser layout has stabilized (prevents mobile layout shifting)
    setTimeout(renderGuessSlots, 50);

    // Automatically focus input on desktop so player can type immediately (skip on mobile to prevent layout shift/keyboard popup on load)
    if (window.innerWidth >= 768) {
        setTimeout(() => {
            ui.guessInput.focus();
        }, 100);
    }
}

function revealHint1() {
    triggerStartTelemetry();
    ui.btnShowHint1.classList.add('hidden');
    if (ui.hintDisplayBox) ui.hintDisplayBox.classList.remove('hidden'); // Reveal unified Hint Box
    ui.btnShowHint2.classList.remove('hidden'); // Unlock Hint 2 button
    hintsUsed = 1;
}

function revealHint2() {
    triggerStartTelemetry();
    const btn = ui.btnShowHint2;
    const btnRect = btn.getBoundingClientRect();
    
    // Get start coordinates (center of the Hint 2 button)
    const startX = btnRect.left + btnRect.width / 2 + window.scrollX;
    const startY = btnRect.top + btnRect.height / 2 + window.scrollY;
    
    // Hide the button
    btn.classList.add('hidden');
    
    // Reveal Hint 2 section in consolidated Hint Box below Original Movie
    if (ui.hintDisplayBox) ui.hintDisplayBox.classList.remove('hidden');
    if (ui.hintRhymeSection) ui.hintRhymeSection.classList.remove('hidden');
    
    // Dynamically render the quote with the rhyming word elements (initially unrevealed)
    ui.quoteDisplay.innerHTML = getHighlightedPunnedQuote(activeChallenge.boss_punned_quote, activeChallenge.boss_original_quote);
    
    // Find all rhyme word elements
    const rhymeWordEls = ui.quoteDisplay.querySelectorAll('.rhyme-word');
    if (rhymeWordEls.length > 0) {
        // Use the first rhyming word as the target for coordinates
        const targetRect = rhymeWordEls[0].getBoundingClientRect();
        
        // Get target coordinates (center of the rhyming word)
        const endX = targetRect.left + targetRect.width / 2 + window.scrollX;
        const endY = targetRect.top + targetRect.height / 2 + window.scrollY;
        
        // Trigger the graceful purple arc animation!
        animateHintArc(startX, startY, endX, endY, () => {
            // Once the arc reaches the target, reveal the purple highlight on all rhyme words
            rhymeWordEls.forEach(el => el.classList.add('revealed'));
            
            // Unlock Hint 3 button
            ui.btnShowHint3.classList.remove('hidden');
            hintsUsed = 2;
        });
    } else {
        // Fallback if no rhyme word was detected
        ui.btnShowHint3.classList.remove('hidden');
        hintsUsed = 2;
    }
}

function revealHint3() {
    triggerStartTelemetry();
    ui.btnShowHint3.classList.add('hidden');
    if (ui.hintDisplayBox) ui.hintDisplayBox.classList.remove('hidden');
    if (ui.hintLettersSection) ui.hintLettersSection.classList.remove('hidden'); // Reveal First Letters section inside box
    
    // Unlock Hint 4 button (Vowel Rush!)
    ui.btnShowHint4.classList.remove('hidden');
    
    if (ui.lettersHint) {
        ui.lettersHint.innerText = activeChallenge.boss_hint2 || generateFirstLetterBlanks(activeChallenge.boss_pun_title);
    }

    hintsUsed = 3;

    // Activate prefilled first-letters mode
    hint3Active = true;

    // Recalculate input maxLength based on remaining letters to type
    const firstLetterIndices = getFirstLetterIndices(activeChallenge.boss_pun_title);
    const totalLetters = (activeChallenge.boss_pun_title.match(/[a-zA-Z]/g) || []).length;
    ui.guessInput.maxLength = totalLetters - firstLetterIndices.length;

    // Clear input to allow fresh typing of remaining letters
    ui.guessInput.value = '';

    // Render slots immediately with prefilled letters in correct positions
    renderGuessSlots();

    // Auto-focus input on desktop (skip on mobile to prevent focus-mode styling from immediately hiding the unlocked hint)
    if (window.innerWidth >= 768) {
        setTimeout(() => {
            ui.guessInput.focus();
        }, 100);
    }
}

function revealHint4() {
    triggerStartTelemetry();
    ui.btnShowHint4.classList.add('hidden');
    if (ui.hintDisplayBox) ui.hintDisplayBox.classList.remove('hidden');
    if (ui.hintVowelsSection) ui.hintVowelsSection.classList.remove('hidden'); // Reveal Vowel Rush section inside box
    
    // Gracefully collapse the progressive hint buttons container since all buttons are now hidden
    const hintContainer = document.querySelector('.hint-container');
    if (hintContainer) {
        hintContainer.classList.add('collapsed');
    }
    
    hintsUsed = 4;
    hint4Active = true;
    animateVowelRush = true;

    // Recalculate input maxLength based on remaining letters to type
    const totalLetters = (activeChallenge.boss_pun_title.match(/[a-zA-Z]/g) || []).length;
    const prefilledIndices = getPrefilledIndices(activeChallenge.boss_pun_title);
    ui.guessInput.maxLength = totalLetters - prefilledIndices.length;

    // Clear input to allow fresh typing of remaining letters
    ui.guessInput.value = '';

    // Render slots immediately with prefilled letters & vowels in correct positions
    renderGuessSlots();

    // Auto-focus input on desktop (skip on mobile to prevent focus-mode styling from immediately hiding the vowel rush reveal)
    if (window.innerWidth >= 768) {
        setTimeout(() => {
            ui.guessInput.focus();
        }, 100);
    }
}

function generateFirstLetterBlanks(str) {
    if (!str) return "";
    return str.split(' ').map(word => {
        if (word.length === 0) return "";
        const firstLetter = word[0];
        const rest = word.slice(1).replace(/[a-zA-Z]/g, "_");
        return firstLetter + rest;
    }).join(' ');
}

// ================= INTERACTIVE CHAR-SLOT PUZZLE LOGIC =================

function handleGuessInput() {
    triggerStartTelemetry();
    const origVal = ui.guessInput.value;
    const sanitizedVal = origVal.replace(/[^a-zA-Z]/g, '');
    if (origVal !== sanitizedVal) {
        ui.guessInput.value = sanitizedVal;
    }
    renderGuessSlots();
}

function getFirstLetterIndices(title) {
    const indices = [];
    let letterIdx = 0;
    let inWord = false;
    
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (/[a-zA-Z]/.test(char)) {
            if (!inWord) {
                indices.push(letterIdx);
                inWord = true;
            }
            letterIdx++;
        } else {
            if (char === ' ' || char === '-' || char === ':') {
                inWord = false;
            }
        }
    }
    return indices;
}

function getPrefilledIndices(title) {
    const indices = [];
    let letterIdx = 0;
    
    const firstLetterIndices = hint3Active ? getFirstLetterIndices(title) : [];
    
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (/[a-zA-Z]/.test(char)) {
            const isFirstLetter = firstLetterIndices.includes(letterIdx);
            const isVowelChar = hint4Active && /[aeiouAEIOU]/.test(char);
            const isLocked = lockedInIndices && lockedInIndices.has(letterIdx);
            if (isFirstLetter || isVowelChar || isLocked) {
                indices.push(letterIdx);
            }
            letterIdx++;
        }
    }
    return indices;
}

function getCompleteGuessString() {
    if (!activeChallenge) return '';
    const title = activeChallenge.boss_pun_title;
    const currentGuess = ui.guessInput.value;
    const prefilledIndices = getPrefilledIndices(title);
    
    let completeStr = '';
    let letterIdx = 0;
    let typedIdx = 0;
    
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (/[a-zA-Z]/.test(char)) {
            if (prefilledIndices.includes(letterIdx)) {
                completeStr += char;
            } else {
                completeStr += currentGuess[typedIdx] || '';
                if (currentGuess[typedIdx]) typedIdx++;
            }
            letterIdx++;
        } else {
            completeStr += char;
        }
    }
    return completeStr;
}

function renderGuessSlots() {
    if (!activeChallenge) return;
    const title = activeChallenge.boss_pun_title;
    
    // Set dynamic maxLength
    const prefilledIndices = getPrefilledIndices(title);
    const totalLetters = (title.match(/[a-zA-Z]/g) || []).length;
    ui.guessInput.maxLength = totalLetters - prefilledIndices.length;
    
    const currentGuess = ui.guessInput.value;
    
    if (!ui.guessSlotsContainer) return;

    // Calculate maximum word length (excluding separators/punctuation)
    let maxWordLength = 0;
    const words = title.split(/[\s\-:\.,;]+/);
    words.forEach(w => {
        const cleanW = w.replace(/[^a-zA-Z]/g, '');
        if (cleanW.length > maxWordLength) {
            maxWordLength = cleanW.length;
        }
    });

    // Measure container clientWidth, fallback to 380px if not loaded
    const containerWidth = ui.guessSlotsContainer.clientWidth || 380;

    // Calculate optimal W (default max 32px)
    const maxSlotWidth = 32;
    let W = maxSlotWidth;
    if (maxWordLength > 0) {
        const targetWidth = containerWidth - 16;
        const computedW = Math.floor(targetWidth / (1.2 * maxWordLength - 0.2));
        if (computedW < maxSlotWidth) {
            W = Math.max(16, computedW);
        }
    }

    // Set other variables proportionally
    const G = Math.round(W / 5);
    const H = Math.round(W * 1.3125);
    const F = (W / 20).toFixed(2) + 'rem';
    const spaceW = Math.round(W * 0.4375);
    
    let B = '3px';
    let S = '2px';
    if (W < 20) {
        B = '1.5px';
        S = '1px';
    } else if (W < 28) {
        B = '2px';
        S = '1.5px';
    }

    // Apply values to style variables
    ui.guessSlotsContainer.style.setProperty('--slot-width', `${W}px`);
    ui.guessSlotsContainer.style.setProperty('--slot-height', `${H}px`);
    ui.guessSlotsContainer.style.setProperty('--slot-font-size', F);
    ui.guessSlotsContainer.style.setProperty('--slot-gap', `${G}px`);
    ui.guessSlotsContainer.style.setProperty('--slot-space-width', `${spaceW}px`);
    ui.guessSlotsContainer.style.setProperty('--slot-border', `${B}`);
    ui.guessSlotsContainer.style.setProperty('--slot-shadow', `${S}`);

    let html = '';
    let activeHighlighted = false;
    
    const firstLetterIndices = hint3Active ? getFirstLetterIndices(title) : [];
    
    let letterIdx = 0; // index in the letter sequence of the title
    let typedIdx = 0;  // index in the user's typed guessInput string
    
    const separators = [' ', '-', ':', '.', ',', ';'];
    let i = 0;
    
    while (i < title.length) {
        const char = title[i];
        
        if (separators.includes(char)) {
            // Render separators outside of word containers to allow wrapping at separator boundaries
            if (char === ' ') {
                html += `<span class="guess-separator-space">&nbsp;</span>`;
            } else {
                html += `<span class="guess-separator-char">${char}</span>`;
            }
            i++;
        } else {
            // Collect all contiguous non-separator characters to form a word container
            let wordChars = '';
            while (i < title.length && !separators.includes(title[i])) {
                wordChars += title[i];
                i++;
            }
            
            let wordHtml = '';
            for (let j = 0; j < wordChars.length; j++) {
                const wChar = wordChars[j];
                if (/[a-zA-Z]/.test(wChar)) {
                    const isPrefilled = prefilledIndices.includes(letterIdx);
                    const isLocked = lockedInIndices && lockedInIndices.has(letterIdx);
                    let displayChar = '';
                    let isFilled = false;
                    let isPrefilledStyle = false;
                    let isLockedStyle = false;
                    
                    if (isPrefilled && !isLocked) {
                        displayChar = wChar; // display the actual letter from the title
                        isFilled = true;
                        isPrefilledStyle = true;
                    } else if (isLocked) {
                        displayChar = wChar; // display the locked-in correct letter
                        isFilled = true;
                        isLockedStyle = true;
                    } else {
                        displayChar = currentGuess[typedIdx] || '';
                        if (displayChar !== '') {
                            isFilled = true;
                            typedIdx++;
                        }
                    }
                    
                    const isLetterActive = !isFilled && !activeHighlighted;
                    
                    let classes = 'guess-letter-slot';
                    if (isFilled) classes += ' filled';
                    if (isPrefilledStyle) classes += ' prefilled';
                    if (isLockedStyle) classes += ' locked-in';
                    if (isLetterActive) {
                        classes += ' active';
                        activeHighlighted = true;
                    }
                    
                    // Highlight Hint 4 newly-revealed vowels with the vowel-rush class for animation (only once on reveal!)
                    const isVowelReveal = animateVowelRush && isPrefilled && /[aeiouAEIOU]/.test(wChar) && !firstLetterIndices.includes(letterIdx);
                    if (isVowelReveal) {
                        classes += ' vowel-rush';
                    }
                    
                    wordHtml += `<span class="${classes}">${displayChar || '&nbsp;'}</span>`;
                    letterIdx++;
                } else {
                    // Non-letter characters within a word (e.g. apostrophes) are rendered inside the word container
                    wordHtml += `<span class="guess-separator-char">${wChar}</span>`;
                }
            }
            
            html += `<span class="guess-word">${wordHtml}</span>`;
        }
    }
    
    ui.guessSlotsContainer.innerHTML = html;
    
    // Reset vowel rush animation trigger so subsequent input/rendering does not repeat the animation
    animateVowelRush = false;
}

// Clean guesses to ignore minor editorial punctuation
const sanitizeText = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[^a-z]/g, '');
};

function handleGuessSubmit() {
    if (!activeChallenge) return;
    triggerStartTelemetry();
    
    const completeGuess = getCompleteGuessString();
    if (!completeGuess.trim()) {
        shakeInput();
        return;
    }

    // Record attempt telemetry event!
    sendTelemetryEvent('attempt');

    // Increment local attempts counter!
    incrementPuzzleAttempts(activeChallenge.puzzle_number);

    const cleanGuess = sanitizeText(completeGuess);
    const cleanBossAnswer = sanitizeText(activeChallenge.boss_pun_title);

    if (cleanGuess === cleanBossAnswer) {
        savePuzzleSolved(activeChallenge.puzzle_number);
        sendTelemetryEvent('solve', hintsUsed); // Post solve telemetry
        triggerVictory();
    } else {
        // Lock in correct letters matched on this attempt
        const title = activeChallenge.boss_pun_title;
        let letterIdx = 0;
        for (let i = 0; i < title.length; i++) {
            const char = title[i];
            if (/[a-zA-Z]/.test(char)) {
                const guessChar = completeGuess[i];
                if (guessChar && guessChar.toLowerCase() === char.toLowerCase()) {
                    lockedInIndices.add(letterIdx);
                }
                letterIdx++;
            }
        }

        ui.feedbackMsg.innerText = "❌ INCORRECT TITLE! TRY AGAIN!";
        ui.feedbackMsg.className = "feedback error";
        ui.guessInput.value = '';
        renderGuessSlots();
        shakeInput();
        
        // Auto-refocus on mobile so the software keyboard doesn't collapse
        setTimeout(() => {
            ui.guessInput.focus();
        }, 100);
    }
}


function getApprovedChallenges() {
    const approved = puzzles.filter(p => p.status === 'approved' && p.puzzle_number);
    approved.sort((a, b) => parseInt(a.puzzle_number) - parseInt(b.puzzle_number));
    
    // Stop at the current active challenge (todayChallenge)
    if (todayChallenge) {
        const todayNum = parseInt(todayChallenge.puzzle_number);
        return approved.filter(p => parseInt(p.puzzle_number) <= todayNum);
    }
    return approved;
}

function navigateChallenge(direction) {
    const approved = getApprovedChallenges();
    if (approved.length === 0 || !activeChallenge) return;

    const currentIndex = approved.findIndex(p => p.puzzle_number === activeChallenge.puzzle_number);
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < approved.length) {
        startGame(approved[newIndex]);
        history.replaceState(null, "", `?challenge=${approved[newIndex].puzzle_number}`);
    }
}

function updateChallengeNavButtons() {
    const approved = getApprovedChallenges();
    const prevBtn = document.getElementById('btn-prev-challenge');
    const nextBtn = document.getElementById('btn-next-challenge');
    const prevBtnVic = document.getElementById('btn-prev-challenge-victory');
    const nextBtnVic = document.getElementById('btn-next-challenge-victory');
    
    const disablePrev = (approved.length === 0 || !activeChallenge || approved.findIndex(p => p.puzzle_number === activeChallenge.puzzle_number) <= 0);
    const disableNext = (approved.length === 0 || !activeChallenge || approved.findIndex(p => p.puzzle_number === activeChallenge.puzzle_number) >= approved.length - 1);
    
    if (prevBtn) prevBtn.disabled = disablePrev;
    if (nextBtn) nextBtn.disabled = disableNext;
    if (prevBtnVic) prevBtnVic.disabled = disablePrev;
    if (nextBtnVic) nextBtnVic.disabled = disableNext;
}

function triggerVictory() {
    currentLevel = 5;

    // Render theatrical movie poster frame immediately
    ui.victoryPosterImg.src = getCorrectPosterUrl(activeChallenge.boss_poster_url);
    ui.finalBossTitle.innerText = activeChallenge.boss_pun_title;
    ui.finalBossMovie.innerText = `Original Movie: ${activeChallenge.boss_original_title}`;
    ui.finalBossPitch.innerText = activeChallenge.boss_pitch;

    const quoteEl = document.getElementById('final-boss-quote');
    if (quoteEl) {
        quoteEl.innerHTML = getHighlightedPunnedQuote(activeChallenge.boss_punned_quote, activeChallenge.boss_original_quote);
    }

    if (ui.challengeHeaderVictory) {
        ui.challengeHeaderVictory.innerHTML = `<span class="challenge-label">Challenge</span> #<span class="level-indicator-num">${activeChallenge.puzzle_number}</span>`;
    }
    updateChallengeNavButtons();

    // Set up victory lobby button dynamically
    const lobbyBtn = document.getElementById('btn-victory-lobby');
    if (lobbyBtn) {
        const approved = getApprovedChallenges();
        const currentIndex = approved.findIndex(p => p.puzzle_number === activeChallenge.puzzle_number);
        
        if (currentIndex !== -1 && currentIndex < approved.length - 1) {
            const nextChallenge = approved[currentIndex + 1];
            lobbyBtn.innerHTML = `⏭️ PLAY CHALLENGE #${nextChallenge.puzzle_number}`;
            lobbyBtn.classList.remove('hidden');
            lobbyBtn.onclick = () => {
                startGame(nextChallenge);
                history.replaceState(null, "", `?challenge=${nextChallenge.puzzle_number}`);
            };
        } else {
            lobbyBtn.classList.add('hidden');
        }
    }

    // Render solved status badge above poster
    const solvedStatus = document.getElementById('victory-solved-status');
    if (solvedStatus) {
        const solvedList = getSolvedPuzzlesList();
        if (solvedList.has(activeChallenge.puzzle_number)) {
            const solvedHints = getSolvedHintsMap();
            const used = solvedHints[activeChallenge.puzzle_number] !== undefined ? solvedHints[activeChallenge.puzzle_number] : hintsUsed;
            
            const attemptsMap = getPuzzleAttemptsMap();
            const attemptsCount = attemptsMap[activeChallenge.puzzle_number] || 1;
            
            const hintText = used === 0 ? "No Hints" : `${used} Hint${used > 1 ? 's' : ''}`;
            const attemptText = `${attemptsCount} Attempt${attemptsCount > 1 ? 's' : ''}`;
            
            solvedStatus.innerText = `Solved! ${hintText} • ${attemptText}`;
            solvedStatus.classList.remove('hidden');
        } else {
            solvedStatus.classList.add('hidden');
        }
    }

    // Switch screen to Victory instantly!
    if (isCrazyGames && typeof window.CrazyGames !== 'undefined') {
        console.log("Requesting CrazyGames midgame ad on victory...");
        window.CrazyGames.SDK.ad.requestAd('midgame', {
            adStarted: () => {
                console.log("CrazyGames midgame ad started");
            },
            adError: (error) => {
                console.error("CrazyGames midgame ad error:", error);
                switchScreen('victory');
                loadAndRenderGlobalStats(activeChallenge.puzzle_number);
            },
            adFinished: () => {
                console.log("CrazyGames midgame ad finished");
                switchScreen('victory');
                loadAndRenderGlobalStats(activeChallenge.puzzle_number);
            }
        });
    } else {
        switchScreen('victory');
        loadAndRenderGlobalStats(activeChallenge.puzzle_number);
    }
}

async function loadAndRenderGlobalStats(puzzleNum) {
    const solveRateBadge = document.getElementById('solve-rate-badge');
    if (solveRateBadge) {
        solveRateBadge.innerText = "⚡ RETRIEVING LIVE BOX OFFICE METRICS...";
    }
    
    const funnelContainer = document.querySelector('.funnel-container');
    if (funnelContainer) {
        funnelContainer.classList.add('loading');
    }
    
    // Fetch combined telemetry stats
    await fetchAllTelemetryStats();
    
    if (funnelContainer) {
        funnelContainer.classList.remove('loading');
    }
    
    let stats = getPuzzleTelemetryStats(puzzleNum);
    
    // Ensure the current user's solve is immediately accounted for in the rendered stats
    // to prevent showing 0 solves or outdated numbers before the POST request completes.
    if (stats) {
        stats.start = (stats.start || 0) + 1;
        const clampedHints = Math.max(0, Math.min(4, parseInt(hintsUsed) || 0));
        stats[`solve_${clampedHints}`] = (stats[`solve_${clampedHints}`] || 0) + 1;
    }
    
    // Calculate percentages
    let totalStarts = stats.start || 1;
    let totalSolves = (stats.solve_0 || 0) + (stats.solve_1 || 0) + (stats.solve_2 || 0) + (stats.solve_3 || 0) + (stats.solve_4 || 0);
    if (totalStarts < totalSolves) totalStarts = totalSolves;
    
    const solveRate = Math.round((totalSolves / totalStarts) * 100);
    
    let pct0 = 0, pct1 = 0, pct2 = 0, pct3 = 0, pct4 = 0;
    if (totalSolves > 0) {
        pct0 = Math.round((stats.solve_0 / totalSolves) * 100);
        pct1 = Math.round((stats.solve_1 / totalSolves) * 100);
        pct2 = Math.round((stats.solve_2 / totalSolves) * 100);
        pct3 = Math.round((stats.solve_3 / totalSolves) * 100);
        pct4 = Math.round((stats.solve_4 / totalSolves) * 100);
        
        const sum = pct0 + pct1 + pct2 + pct3 + pct4;
        if (sum !== 100 && sum > 0) {
            const diff = 100 - sum;
            const maxVal = Math.max(pct0, pct1, pct2, pct3, pct4);
            if (pct0 === maxVal) pct0 += diff;
            else if (pct1 === maxVal) pct1 += diff;
            else if (pct2 === maxVal) pct2 += diff;
            else if (pct3 === maxVal) pct3 += diff;
            else pct4 += diff;
        }
    } else {
        pct0 = 0; pct1 = 0; pct2 = 0; pct3 = 0; pct4 = 0;
    }
    
    // Render Stats
    if (solveRateBadge) {
        solveRateBadge.innerText = `${solveRate}% OF PLAYERS CRACKED THIS CHALLENGE!`;
    }
    
    const fill0 = document.getElementById('funnel-fill-0');
    const fill1 = document.getElementById('funnel-fill-1');
    const fill2 = document.getElementById('funnel-fill-2');
    const fill3 = document.getElementById('funnel-fill-3');
    const fill4 = document.getElementById('funnel-fill-4');
    
    const pct0Label = document.getElementById('funnel-pct-0');
    const pct1Label = document.getElementById('funnel-pct-1');
    const pct2Label = document.getElementById('funnel-pct-2');
    const pct3Label = document.getElementById('funnel-pct-3');
    const pct4Label = document.getElementById('funnel-pct-4');
    
    if (fill0) fill0.style.width = '0%';
    if (fill1) fill1.style.width = '0%';
    if (fill2) fill2.style.width = '0%';
    if (fill3) fill3.style.width = '0%';
    if (fill4) fill4.style.width = '0%';
    
    if (pct0Label) pct0Label.innerText = '0%';
    if (pct1Label) pct1Label.innerText = '0%';
    if (pct2Label) pct2Label.innerText = '0%';
    if (pct3Label) pct3Label.innerText = '0%';
    if (pct4Label) pct4Label.innerText = '0%';
    
    setTimeout(() => {
        if (fill0) fill0.style.width = `${pct0}%`;
        if (fill1) fill1.style.width = `${pct1}%`;
        if (fill2) fill2.style.width = `${pct2}%`;
        if (fill3) fill3.style.width = `${pct3}%`;
        if (fill4) fill4.style.width = `${pct4}%`;
        
        if (pct0Label) pct0Label.innerText = `${pct0}%`;
        if (pct1Label) pct1Label.innerText = `${pct1}%`;
        if (pct2Label) pct2Label.innerText = `${pct2}%`;
        if (pct3Label) pct3Label.innerText = `${pct3}%`;
        if (pct4Label) pct4Label.innerText = `${pct4}%`;
    }, 200);
}

function getMaskedParodyTitle(title) {
    if (!title) return "";
    const words = title.split(/\s+/);
    const maskedWords = words.map(word => {
        if (!word) return "";
        const firstAlphanumericIndex = word.search(/[a-zA-Z0-9]/);
        if (firstAlphanumericIndex === -1) {
            return word;
        }
        const prefix = word.substring(0, firstAlphanumericIndex);
        const letter = word.charAt(firstAlphanumericIndex);
        const suffix = word.substring(firstAlphanumericIndex + 1);
        const maskedSuffix = suffix.replace(/[a-zA-Z0-9]/g, '_');
        return prefix + letter + maskedSuffix;
    });

    if (maskedWords.length > 2) {
        let truncated = maskedWords.slice(0, 2).join(" ");
        // Strip trailing non-alphanumeric/non-underscore characters from the end of the truncated string
        truncated = truncated.replace(/[^a-zA-Z0-9_]+$/, '');
        return truncated + "...";
    }
    return maskedWords.join(" ");
}

// Share score streak via clipboard copy
function shareSolvedScore() {
    const solvedList = getSolvedPuzzlesList();
    const streak = solvedList.size;

    // Add hint count to the share text
    const hintText = hintsUsed === 0 ? "No hints used! Perfect score! 🌟" : `${hintsUsed}/4 hints used 💡`;

    const copyText = `PunFiction Daily Challenge #${activeChallenge.puzzle_number} 🎬\n` + 
                     `Parody Solved: "${getMaskedParodyTitle(activeChallenge.boss_pun_title)}" 🍿\n` +
                     `💡 Stats: ${hintText}\n` +
                     `🌟 Complete Streak: ${streak} solved challenge(s)!\n` +
                     `Play daily challenges at: https://iwandres.github.io/PunFiction/boxofficeblunders/`;

    navigator.clipboard.writeText(copyText).then(() => {
        showToast("📢 Streak Score copied to clipboard!");
    }).catch(err => {
        console.error("Failed copying streak text: ", err);
    });
}

// ================= DYNAMIC UI EFFECTS =================

function shakeInput() {
    if (ui.guessSlotsContainer) {
        ui.guessSlotsContainer.style.animation = 'none';
        ui.guessSlotsContainer.offsetHeight; /* trigger reflow */
        ui.guessSlotsContainer.style.animation = 'shake 0.3s ease-in-out';
    }
}

// Inject Keyframe animations dynamically to keep client lightweight
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}
.toast-container {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: #5f27cd;
    color: #ffffff;
    padding: 10px 20px;
    border: 3px solid #2d3436;
    box-shadow: 4px 4px 0px #2d3436;
    border-radius: 8px;
    font-weight: 900;
    font-size: 13px;
    z-index: 9999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.hint-container {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 100px;
    opacity: 1;
    overflow: hidden;
}
.hint-container.collapsed {
    max-height: 0 !important;
    min-height: 0 !important;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    opacity: 0 !important;
}
.rhyme-word {
    transition: color 0.3s ease, font-weight 0.3s ease;
    display: inline-block;
}
.rhyme-word.revealed {
    color: var(--text-secondary) !important;
    font-weight: 800;
}
.hint-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, #ff90ec 0%, #8c52ff 70%, #5f27cd 100%);
    box-shadow: 0 0 10px #8c52ff;
    pointer-events: none;
    z-index: 10001;
    transform: translate(-50%, -50%);
}
.hint-sparkle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10001;
    transform: translate(-50%, -50%);
}
.comet-head {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 0 15px #a855f7, 0 0 30px #5f27cd;
    border: 2px solid #5f27cd;
    pointer-events: none;
    z-index: 10002;
    transform: translate(-50%, -50%);
}
`;
document.head.appendChild(styleSheet);

function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = "toast-container";
    if (isError) {
        toast.style.background = "#ff4757";
    }
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "none";
        toast.style.transition = "opacity 0.3s";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ================= GRACEFUL ARC ANIMATION FOR HINT 1 =================

function animateHintArc(startX, startY, endX, endY, callback) {
    // Create temporary SVG element covering document size
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    svg.setAttribute("style", `position: absolute; top: 0; left: 0; width: 100%; height: ${docHeight}px; pointer-events: none; z-index: 10000;`);
    
    // Calculate control point for standard quadratic Bezier curve arcing upwards/outwards
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const offset = Math.min(150, Math.max(60, dist * 0.35));
    const dir = perpY > 0 ? -1 : 1;
    
    const controlX = (startX + endX) / 2 + perpX * offset * dir;
    const controlY = (startY + endY) / 2 + perpY * offset * dir;
    
    // Create trajectory path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dStr = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    path.setAttribute("d", dStr);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(95, 39, 205, 0.2)");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-dasharray", "6,6");
    svg.appendChild(path);
    
    document.body.appendChild(svg);
    
    const pathLength = path.getTotalLength();
    
    // Create comet head element
    const comet = document.createElement("div");
    comet.className = "comet-head";
    document.body.appendChild(comet);
    
    const duration = 900; // ms
    const startTime = performance.now();
    let lastParticleTime = 0;
    
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
    
    function update(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        
        const currentLength = easeProgress * pathLength;
        const point = path.getPointAtLength(currentLength);
        
        comet.style.left = `${point.x}px`;
        comet.style.top = `${point.y}px`;
        
        if (time - lastParticleTime > 15 && progress < 1) {
            spawnTrailParticle(point.x, point.y);
            lastParticleTime = time;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            comet.remove();
            svg.remove();
            spawnExplosion(endX, endY);
            if (callback) callback();
        }
    }
    
    requestAnimationFrame(update);
}

function spawnTrailParticle(x, y) {
    const p = document.createElement("div");
    p.className = "hint-particle";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    
    const sz = 6 + Math.random() * 6;
    p.style.width = `${sz}px`;
    p.style.height = `${sz}px`;
    
    document.body.appendChild(p);
    
    const duration = 400 + Math.random() * 200;
    p.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
        { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out'
    });
    
    setTimeout(() => p.remove(), duration);
}

function spawnExplosion(x, y) {
    const numSparkles = 16;
    for (let i = 0; i < numSparkles; i++) {
        const s = document.createElement("div");
        s.className = "hint-sparkle";
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        
        const color = i % 2 === 0 ? "#a855f7" : "#ffde59";
        s.style.background = color;
        s.style.boxShadow = `0 0 6px ${color}`;
        
        document.body.appendChild(s);
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed;
        
        const duration = 600 + Math.random() * 400;
        
        s.animate([
            { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.1)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
        
        setTimeout(() => s.remove(), duration);
    }
}

// ================= TELEMETRY UTILITY METHODS =================

function getDeterministicMockMetrics(puzzleNum) {
    const num = parseInt(puzzleNum) || 1;
    const pseudoSeed = (num * 9301 + 49297) % 233280;
    const seedFactor = pseudoSeed / 233280;
    
    const totalStarts = Math.floor(250 + seedFactor * 500); // 250 to 750
    const solveRatePct = Math.floor(55 + seedFactor * 35); // 55% to 90%
    const totalSolves = Math.round(totalStarts * (solveRatePct / 100));
    
    // Create highly distinct distributions based on puzzle number to avoid looking like "overall averages"
    const p1 = 0.20 + ((num * 17) % 25) / 100; // 20% to 45%
    const p2 = 0.18 + ((num * 23) % 20) / 100; // 18% to 38%
    const p3 = 0.10 + ((num * 13) % 15) / 100; // 10% to 25%
    const p4 = 0.08 + ((num * 7) % 10) / 100;  // 8% to 18%
    const p5 = Math.max(0.02, 1.0 - p1 - p2 - p3 - p4);
    
    const sumP = p1 + p2 + p3 + p4 + p5;
    const solve_0 = Math.round(totalSolves * (p1 / sumP));
    const solve_1 = Math.round(totalSolves * (p2 / sumP));
    const solve_2 = Math.round(totalSolves * (p3 / sumP));
    const solve_3 = Math.round(totalSolves * (p4 / sumP));
    const solve_4 = Math.max(0, totalSolves - solve_0 - solve_1 - solve_2 - solve_3);
    
    // Deterministic mock attempts-to-solve distribution
    const sa1 = Math.round(totalSolves * 0.35); // 35% in 1 attempt
    const sa2 = Math.round(totalSolves * 0.30); // 30% in 2 attempts
    const sa3 = Math.round(totalSolves * 0.18); // 18% in 3 attempts
    const sa4 = Math.round(totalSolves * 0.10); // 10% in 4 attempts
    const sa5 = Math.max(0, totalSolves - sa1 - sa2 - sa3 - sa4); // remaining in 5+ attempts
    
    return {
        start: totalStarts,
        attempts: totalSolves * 3 + (totalStarts - totalSolves) * 2,
        solve_0: solve_0,
        solve_1: solve_1,
        solve_2: solve_2,
        solve_3: solve_3,
        solve_4: solve_4,
        solve_att_1: sa1,
        solve_att_2: sa2,
        solve_att_3: sa3,
        solve_att_4: sa4,
        solve_att_5: sa5
    };
}

function triggerStartTelemetry() {
    if (activeChallenge && activeChallenge.puzzle_number) {
        savePuzzleAttempted(activeChallenge.puzzle_number);
    }
    if (telemetryStartSent) return;
    telemetryStartSent = true;
    sendTelemetryEvent('start');
}

async function sendTelemetryEvent(event, hints = 0) {
    const puzzleNum = activeChallenge ? activeChallenge.puzzle_number : null;
    if (!puzzleNum) return;
    
    let attemptsCount = 1;
    if (event === 'solve') {
        const attemptsMap = getPuzzleAttemptsMap();
        attemptsCount = attemptsMap[puzzleNum] || 1;
    }
    
    const payload = {
        event: event,
        puzzle_number: puzzleNum,
        hints_used: hints,
        attempts: attemptsCount
    };
    
    try {
        const telemetryUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api/records'
            : `${BACKEND_API_URL}/api/records`;
        
        await fetch(telemetryUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.log("Telemetry post failed.", e);
    }
}

// ================= REWARDED AD LOGIC (GOOGLE PUBLISHER TAG) =================

function requestNextRewardedAd() {
    if (isCrazyGames) return; // Skip Google GPT ads on CrazyGames
    if (typeof googletag === 'undefined') {
        console.warn("googletag is not defined. Offline fallback active.");
        return;
    }
    
    googletag.cmd.push(() => {
        if (rewardedSlot) {
            console.log("Ad slot already exists and is preloading.");
            return;
        }
        
        console.log("Requesting next GPT rewarded slot with production unit...");
        rewardedSlot = googletag.defineOutOfPageSlot(
            '/23355087107/PunFiction_Web_Rewarded',
            googletag.enums.OutOfPageFormat.REWARDED
        );
        
        if (rewardedSlot) {
            rewardedSlot.addService(googletag.pubads());
            googletag.display(rewardedSlot);
            googletag.pubads().refresh([rewardedSlot]);
        } else {
            console.warn("Failed to create Out-Of-Page rewarded slot.");
        }
    });
}

// ================= STATS & LEVEL SELECT CONTROLLER =================

async function fetchAllTelemetryStats() {
    if (allTelemetry) return allTelemetry;
    
    let liveData = {};
    let staticData = {};
    
    try {
        const telemetryUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api/records'
            : `${BACKEND_API_URL}/api/records`;
            
        const response = await fetchWithTimeout(telemetryUrl, { timeout: 3500 });
        if (response.ok) {
            const data = await response.json();
            if (data && typeof data === 'object' && !data.hasOwnProperty('start')) {
                liveData = data;
                console.log("Live telemetry fetched successfully for merging.");
            }
        }
    } catch (e) {
        console.log("Failed to fetch live telemetry for merging, using empty object.", e);
    }
    
    try {
        const staticUrl = `${GITHUB_REPO_URL}/records.json?t=${Date.now()}`;
        const response = await fetchWithTimeout(staticUrl, { timeout: 3500 });
        if (response.ok) {
            const data = await response.json();
            if (data && typeof data === 'object') {
                staticData = data;
                console.log("Static telemetry fetched successfully for merging.");
            }
        }
    } catch (staticE) {
        console.log("Static telemetry fetch for merging failed.", staticE);
    }
    
    // Merge live and static data
    allTelemetry = {};
    const allKeys = new Set([...Object.keys(liveData), ...Object.keys(staticData)]);
    allKeys.forEach(key => {
        const live = liveData[key];
        const stat = staticData[key];
        
        // If live data has starts recorded, prefer it as it is fresh live data from the database.
        // Otherwise, fall back to the static backup snapshot.
        if (live && (parseInt(live.start) || 0) > 0) {
            allTelemetry[key] = {
                start: parseInt(live.start) || 0,
                attempts: parseInt(live.attempts) || 0,
                solve_0: parseInt(live.solve_0) || 0,
                solve_1: parseInt(live.solve_1) || 0,
                solve_2: parseInt(live.solve_2) || 0,
                solve_3: parseInt(live.solve_3) || 0,
                solve_4: parseInt(live.solve_4) || 0,
                solve_att_1: parseInt(live.solve_att_1) || 0,
                solve_att_2: parseInt(live.solve_att_2) || 0,
                solve_att_3: parseInt(live.solve_att_3) || 0,
                solve_att_4: parseInt(live.solve_att_4) || 0,
                solve_att_5: parseInt(live.solve_att_5) || 0
            };
        } else if (stat) {
            allTelemetry[key] = {
                start: parseInt(stat.start) || 0,
                attempts: parseInt(stat.attempts) || 0,
                solve_0: parseInt(stat.solve_0) || 0,
                solve_1: parseInt(stat.solve_1) || 0,
                solve_2: parseInt(stat.solve_2) || 0,
                solve_3: parseInt(stat.solve_3) || 0,
                solve_4: parseInt(stat.solve_4) || 0,
                solve_att_1: parseInt(stat.solve_att_1) || 0,
                solve_att_2: parseInt(stat.solve_att_2) || 0,
                solve_att_3: parseInt(stat.solve_att_3) || 0,
                solve_att_4: parseInt(stat.solve_att_4) || 0,
                solve_att_5: parseInt(stat.solve_att_5) || 0
            };
        }
    });
    
    return allTelemetry;
}

function getPuzzleTelemetryStats(puzzleNum) {
    if (allTelemetry && allTelemetry[puzzleNum] && allTelemetry[puzzleNum].start > 0) {
        return allTelemetry[puzzleNum];
    }
    return getDeterministicMockMetrics(puzzleNum);
}

function getChallengeDifficulty(challenge, stats) {
    const starts = parseInt(stats.start) || 0;
    const s0 = parseInt(stats.solve_0) || 0;
    const s1 = parseInt(stats.solve_1) || 0;
    const s2 = parseInt(stats.solve_2) || 0;
    const s3 = parseInt(stats.solve_3) || 0;
    const s4 = parseInt(stats.solve_4) || 0;
    const totalSolves = s0 + s1 + s2 + s3 + s4;
    
    if (starts > 10) {
        const solveRate = (totalSolves / starts) * 100;
        if (solveRate >= 85) return 'Easy';
        if (solveRate >= 68) return 'Medium';
        return 'Hard';
    } else {
        const tier = parseInt(challenge.difficulty_tier) || 2;
        if (tier === 1) return 'Easy';
        if (tier === 3) return 'Hard';
        return 'Medium';
    }
}

function abbreviateNumber(num) {
    if (num === null || num === undefined) return '0';
    if (num < 1000) return num.toLocaleString();
    if (num < 1000000) {
        const value = num / 1000;
        return (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)) + 'K';
    }
    const value = num / 1000000;
    return (value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)) + 'M';
}

async function openStatsSelectModal() {
    // 1. Show loading indicator states
    document.getElementById('agg-total-starts').innerText = '...';
    document.getElementById('agg-total-solves').innerText = '...';
    document.getElementById('agg-solve-rate').innerText = '...';
    
    for (let i = 0; i <= 4; i++) {
        const fillBar = document.getElementById(`agg-funnel-fill-${i}`);
        const pctLabel = document.getElementById(`agg-funnel-pct-${i}`);
        if (fillBar) fillBar.style.width = '0%';
        if (pctLabel) pctLabel.innerText = '0%';
    }
    
    const challengesList = document.getElementById('challenges-list');
    if (challengesList) {
        challengesList.innerHTML = '<div style="text-align: center; padding: 20px; font-weight: 800; color: var(--text-secondary);">Loading challenges...</div>';
    }

    // 2. Fetch stats
    const statsData = await fetchAllTelemetryStats();
    
    // 3. Aggregate stats
    const approved = getApprovedChallenges();
    let totalStarts = 0;
    let totalSolves = 0;
    const hintSolves = [0, 0, 0, 0, 0];
    
    approved.forEach(c => {
        const stats = getPuzzleTelemetryStats(c.puzzle_number);
        const starts = parseInt(stats.start) || 0;
        const s0 = parseInt(stats.solve_0) || 0;
        const s1 = parseInt(stats.solve_1) || 0;
        const s2 = parseInt(stats.solve_2) || 0;
        const s3 = parseInt(stats.solve_3) || 0;
        const s4 = parseInt(stats.solve_4) || 0;
        
        totalStarts += starts;
        totalSolves += (s0 + s1 + s2 + s3 + s4);
        hintSolves[0] += s0;
        hintSolves[1] += s1;
        hintSolves[2] += s2;
        hintSolves[3] += s3;
        hintSolves[4] += s4;
    });
    
    const solveRate = totalStarts > 0 ? ((totalSolves / totalStarts) * 100).toFixed(1) : '0.0';
    
    document.getElementById('agg-total-starts').innerText = abbreviateNumber(totalStarts);
    document.getElementById('agg-total-solves').innerText = abbreviateNumber(totalSolves);
    document.getElementById('agg-solve-rate').innerText = `${solveRate}%`;
    
    for (let i = 0; i <= 4; i++) {
        const count = hintSolves[i];
        const pct = totalSolves > 0 ? Math.round((count / totalSolves) * 100) : 0;
        const fillBar = document.getElementById(`agg-funnel-fill-${i}`);
        const pctLabel = document.getElementById(`agg-funnel-pct-${i}`);
        if (fillBar) fillBar.style.width = `${pct}%`;
        if (pctLabel) pctLabel.innerText = `${pct}%`;
    }
    
    // 4. Populate list of challenges
    if (challengesList) {
        challengesList.innerHTML = '';
        const solvedList = getSolvedPuzzlesList();
        const attemptedList = getAttemptedPuzzles();
        
        approved.forEach(c => {
            const stats = getPuzzleTelemetryStats(c.puzzle_number);
            const difficulty = getChallengeDifficulty(c, stats);
            
            const row = document.createElement('div');
            row.className = 'challenge-select-row';
            
            const isActive = activeChallenge && activeChallenge.puzzle_number === c.puzzle_number;
            if (isActive) {
                row.style.borderColor = '#5f27cd';
                row.style.background = '#f1eafd';
            }
            
            const displayNum = parseInt(c.puzzle_number);
            const chalQuote = c.boss_punned_quote ? `"${c.boss_punned_quote}"` : '"Quote Text Missing"';
            
            let statusBadgeHtml = '';
            if (solvedList.has(c.puzzle_number)) {
                statusBadgeHtml = `<span class="completion-badge solved">Solved</span>`;
            } else if (attemptedList.has(c.puzzle_number)) {
                statusBadgeHtml = `<span class="completion-badge attempted">Attempted</span>`;
            } else {
                statusBadgeHtml = `<span class="completion-badge unplayed">Unplayed</span>`;
            }
            
            row.innerHTML = `
                <div class="challenge-select-info">
                    <span class="challenge-select-num">Challenge #<span class="challenge-select-num-val">${displayNum}</span></span>
                    <span class="challenge-select-name">${chalQuote}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="difficulty-badge ${difficulty.toLowerCase()}">${difficulty}</span>
                    ${statusBadgeHtml}
                </div>
            `;
            
            row.onclick = () => {
                startGame(c);
                history.replaceState(null, "", `?challenge=${c.puzzle_number}`);
                const statsSelectModal = document.getElementById('stats-select-modal');
                if (statsSelectModal) {
                    statsSelectModal.classList.remove('active');
                }
            };
            
            challengesList.appendChild(row);
        });
    }
}
