// Core Constants & CDN Paths
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/iwandres/PunFiction/main/backend";
const START_DATE_PT = new Date("2026-05-24T02:00:00-07:00"); // Launch date: 2am Pacific Time

// Game State
let puzzles = [];
let todayChallenge = null;
let yesterdayChallenge = null;
let activeChallenge = null; // Currently playing challenge
let hint3Active = false; // Flag for Hint 3 (first letters populated)
let hintsUsed = 0; // Number of progressive hints used

let currentLevel = 1; // 1 to 3 = thematic levels, 4 = boss level, 5 = victory screen
let inventory = []; // accumulated target words
let currentPuzzleIndex = 0; // index in local puzzles array
let activeFetchedFromCDN = false; // flag to trace assets loading

// DOM Elements Mapping
const screens = {
    game: document.getElementById('game-screen'),
    victory: document.getElementById('victory-screen')
};

const ui = {
    challengeHeader: document.getElementById('challenge-header'),
    questionLabel: document.getElementById('question-label'),
    bossPosterWrapper: document.getElementById('boss-poster-wrapper'),
    bossPosterImg: document.getElementById('boss-poster-img'),
    mysteryBanner: document.getElementById('mystery-banner'),
    quoteDisplay: document.getElementById('quote-display'),
    pitchDisplay: document.getElementById('pitch-display'),
    guessSlotsContainer: document.getElementById('guess-slots-container'),
    guessInput: document.getElementById('guess-input'),
    feedbackMsg: document.getElementById('feedback-msg'),
    
    // Progressive hints
    btnShowHint1: document.getElementById('btn-show-hint1'),
    btnShowHint2: document.getElementById('btn-show-hint2'),
    btnShowHint3: document.getElementById('btn-show-hint3'),
    hint2Reveal: document.getElementById('hint2-reveal'),
    movieHint: document.getElementById('movie-hint'),
    hint3Reveal: document.getElementById('hint3-reveal'),
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
    // 1. Setup UI bindings
    document.getElementById('btn-toggle-challenge').onclick = handleToggleChallenge;
    document.getElementById('btn-victory-lobby').onclick = () => startGame(todayChallenge);
    document.getElementById('btn-share-score').onclick = shareSolvedScore;
    ui.btnSubmit.onclick = handleGuessSubmit;
    ui.guessInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            handleGuessSubmit();
        } else if (e.key === 'Backspace') {
            // Snappy rendering fallback on backspace
            setTimeout(renderGuessSlots, 0);
        }
    };
    ui.guessInput.oninput = handleGuessInput;
    ui.guessInput.addEventListener('focus', () => {
        document.body.classList.add('keyboard-focused');
        setTimeout(() => {
            if (ui.guessSlotsContainer) {
                ui.guessSlotsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
    });
    ui.guessInput.addEventListener('blur', () => {
        document.body.classList.remove('keyboard-focused');
    });
    if (ui.guessSlotsContainer) {
        ui.guessSlotsContainer.onclick = () => ui.guessInput.focus();
    }
    ui.btnShowHint1.onclick = revealHint1;
    ui.btnShowHint2.onclick = revealHint2;
    ui.btnShowHint3.onclick = revealHint3;
 
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
    let currentDayIndex = daysElapsed + 1;

    // Check if player URL overrides day (e.g. ?day=001) for diagnostic playtesting
    const urlParams = new URLSearchParams(window.location.search);
    const dayOverride = urlParams.get('day') || urlParams.get('challenge');
    let matchedOverride = null;

    if (dayOverride) {
        matchedOverride = approvedChallenges.find(p => p.puzzle_number === padPuzzleNumber(dayOverride));
        if (matchedOverride) {
            const parsedOverride = parseInt(dayOverride);
            if (!isNaN(parsedOverride) && parsedOverride > 0) {
                currentDayIndex = parsedOverride;
            }
        }
    }

    const todayChallengeStr = padPuzzleNumber(currentDayIndex);
    const yesterdayChallengeStr = padPuzzleNumber(currentDayIndex - 1);

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
        return new Set(data ? JSON.parse(data) : []);
    } catch (e) {
        return new Set();
    }
}

function savePuzzleSolved(puzzleNum) {
    try {
        const solved = getSolvedPuzzlesList();
        solved.add(puzzleNum);
        localStorage.setItem('pun_fiction_solved_puzzles', JSON.stringify([...solved]));
    } catch (e) {
        console.error("Could not write solved progress to local storage", e);
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
    hintsUsed = 0;
    currentLevel = 4; // Start directly at Boss Level!
    inventory = [];

    switchScreen('game');
    loadLevel();

    // Set up toggle button text dynamically
    const toggleBtn = document.getElementById('btn-toggle-challenge');
    if (toggleBtn) {
        if (challenge === todayChallenge) {
            if (yesterdayChallenge) {
                toggleBtn.innerText = "⏮️ PLAY YESTERDAY'S CHALLENGE";
                toggleBtn.classList.remove('hidden');
            } else {
                toggleBtn.classList.add('hidden');
            }
        } else {
            toggleBtn.innerText = "🎯 PLAY TODAY'S CHALLENGE";
            toggleBtn.classList.remove('hidden');
        }
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

function loadLevel() {
    hint3Active = false;
    hintsUsed = 0;
    ui.guessInput.value = '';
    ui.feedbackMsg.innerText = '';
    ui.feedbackMsg.className = 'feedback';

    if (ui.challengeHeader) {
        ui.challengeHeader.innerText = `Challenge #${activeChallenge.puzzle_number}`;
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

    ui.hint2Reveal.classList.add('hidden');
    ui.hint3Reveal.classList.add('hidden');

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

    // Automatically focus input so player can type immediately
    setTimeout(() => {
        ui.guessInput.focus();
    }, 100);

    // Trigger puzzle engagement start event
    sendTelemetryEvent('start');
}

function revealHint1() {
    const btn = ui.btnShowHint1;
    const btnRect = btn.getBoundingClientRect();
    
    // Get start coordinates (center of the Hint 1 button)
    const startX = btnRect.left + btnRect.width / 2 + window.scrollX;
    const startY = btnRect.top + btnRect.height / 2 + window.scrollY;
    
    // Hide the button
    btn.classList.add('hidden');
    
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
            
            // Unlock Hint 2 button
            ui.btnShowHint2.classList.remove('hidden');
            hintsUsed = 1;
        });
    } else {
        // Fallback if no rhyme word was detected
        ui.btnShowHint2.classList.remove('hidden');
        hintsUsed = 1;
    }
}

function revealHint2() {
    ui.btnShowHint2.classList.add('hidden');
    ui.hint2Reveal.classList.remove('hidden'); // Reveal Original Movie Title Pill
    ui.btnShowHint3.classList.remove('hidden'); // Unlock Hint 3 button
    hintsUsed = 2;
}

function revealHint3() {
    ui.btnShowHint3.classList.add('hidden');
    ui.hint3Reveal.classList.remove('hidden'); // Reveal First Letters blanks Pill
    
    // Gracefully collapse the progressive hint buttons container since all buttons are now hidden
    const hintContainer = document.querySelector('.hint-container');
    if (hintContainer) {
        hintContainer.classList.add('collapsed');
    }
    
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

    // Auto-focus input
    setTimeout(() => {
        ui.guessInput.focus();
    }, 100);
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

function getCompleteGuessString() {
    if (!activeChallenge) return '';
    const title = activeChallenge.boss_pun_title;
    const currentGuess = ui.guessInput.value;
    const firstLetterIndices = hint3Active ? getFirstLetterIndices(title) : [];
    
    let completeStr = '';
    let letterIdx = 0;
    let typedIdx = 0;
    
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (/[a-zA-Z]/.test(char)) {
            if (firstLetterIndices.includes(letterIdx)) {
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
    const currentGuess = ui.guessInput.value;
    
    if (!ui.guessSlotsContainer) return;
    
    let html = '';
    let activeHighlighted = false;
    
    // Get first letter indices if Hint 3 is active
    const firstLetterIndices = hint3Active ? getFirstLetterIndices(title) : [];
    
    let letterIdx = 0; // index in the letter sequence of the title
    let typedIdx = 0;  // index in the user's typed guessInput string
    
    for (let i = 0; i < title.length; i++) {
        const char = title[i];
        if (/[a-zA-Z]/.test(char)) {
            // Check if this letter is a prefilled first letter
            const isPrefilled = firstLetterIndices.includes(letterIdx);
            
            let displayChar = '';
            let isFilled = false;
            let isPrefilledStyle = false;
            
            if (isPrefilled) {
                displayChar = char; // display the actual letter from the title
                isFilled = true;
                isPrefilledStyle = true;
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
            if (isLetterActive) {
                classes += ' active';
                activeHighlighted = true;
            }
            
            html += `<span class="${classes}">${displayChar || '&nbsp;'}</span>`;
            letterIdx++;
        } else {
            if (char === ' ') {
                html += `<span class="guess-separator-space">&nbsp;</span>`;
            } else {
                html += `<span class="guess-separator-char">${char}</span>`;
            }
        }
    }
    
    ui.guessSlotsContainer.innerHTML = html;
}

// Clean guesses to ignore minor editorial punctuation
const sanitizeText = (str) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[^a-z]/g, '');
};

function handleGuessSubmit() {
    if (!activeChallenge) return;
    
    const completeGuess = getCompleteGuessString();
    if (!completeGuess.trim()) return;

    const cleanGuess = sanitizeText(completeGuess);
    const cleanBossAnswer = sanitizeText(activeChallenge.boss_pun_title);

    if (cleanGuess === cleanBossAnswer) {
        savePuzzleSolved(activeChallenge.puzzle_number);
        sendTelemetryEvent('solve', hintsUsed); // Post solve telemetry
        triggerVictory();
    } else {
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

function handleToggleChallenge() {
    if (activeChallenge === todayChallenge) {
        if (yesterdayChallenge) {
            startGame(yesterdayChallenge);
        } else {
            showToast("No yesterday's challenge available.");
        }
    } else {
        startGame(todayChallenge);
    }
}

async function triggerVictory() {
    currentLevel = 5;

    // Render theatrical movie poster frame
    ui.victoryPosterImg.src = getCorrectPosterUrl(activeChallenge.boss_poster_url);
    ui.finalBossTitle.innerText = activeChallenge.boss_pun_title;
    ui.finalBossMovie.innerText = `Original Movie: ${activeChallenge.boss_original_title}`;
    ui.finalBossPitch.innerText = activeChallenge.boss_pitch;

    // Set up dynamic Congratulatory Messages (4 levels!)
    const bannerEl = document.getElementById('victory-banner');
    const subtitleEl = document.getElementById('victory-subtitle');
    
    if (bannerEl) {
        bannerEl.className = "victory-banner";
        bannerEl.style.animation = "none";
        bannerEl.offsetHeight; /* trigger reflow */
        
        if (hintsUsed === 0) {
            bannerEl.innerText = "HOLY MOVIE GODS! 🏆";
            bannerEl.classList.add('exuberant-perfect');
        } else if (hintsUsed === 1) {
            bannerEl.innerText = "BRILLIANT DIRECTING! 🎬";
        } else if (hintsUsed === 2) {
            bannerEl.innerText = "GREAT SOLVE! 🎟️";
        } else {
            bannerEl.innerText = "PHEW! YOU SURVIVED! 🎭";
        }
    }
    
    if (subtitleEl) {
        if (hintsUsed === 0) {
            subtitleEl.innerHTML = `YOU ARE AN ABSOLUTE CINEMATIC LEGEND! SOLVED WITH ZERO HINTS! MIND = BLOWN! 🍿🎬🔥`;
            subtitleEl.style.color = "#10ac84";
        } else if (hintsUsed === 1) {
            subtitleEl.innerHTML = `Only <span style="color: #ff914d; font-weight: 800;">1 Hint</span> used! You're a certified Box Office Pro! Outstanding solve! 🍿🌟`;
            subtitleEl.style.color = "";
        } else if (hintsUsed === 2) {
            subtitleEl.innerHTML = `Solved with <span style="color: var(--text-secondary); font-weight: 800;">2 Hints</span>. You cracked the code and saved the production! Solid work! ⭐`;
            subtitleEl.style.color = "";
        } else {
            subtitleEl.innerHTML = `Solved with <span style="color: var(--accent-main); font-weight: 800;">3 Hints</span>. The director's cut is safe and the show must go on! Keep practicing! 🎬`;
            subtitleEl.style.color = "";
        }
    }

    // Fetch and render global metrics stats funnel
    const puzzleNum = activeChallenge.puzzle_number;
    let stats = null;
    
    try {
        let telemetryUrl;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            telemetryUrl = `/api/telemetry?puzzle_number=${puzzleNum}`;
        } else {
            telemetryUrl = `${GITHUB_REPO_URL}/telemetry.json?t=${Date.now()}`;
        }
            
        const response = await fetch(telemetryUrl);
        if (response.ok) {
            const rawStats = await response.json();
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                if (rawStats.start > 0) {
                    stats = rawStats;
                }
            } else {
                const puzzleStats = rawStats[puzzleNum];
                if (puzzleStats && puzzleStats.start > 0) {
                    stats = puzzleStats;
                }
            }
        }
    } catch (e) {
        console.log("Telemetry fetch failed: using deterministic mock metrics fallback.", e);
    }
    
    if (!stats) {
        stats = getDeterministicMockMetrics(puzzleNum);
    }
    
    // Calculate percentages
    let totalStarts = stats.start || 1;
    let totalSolves = (stats.solve_0 || 0) + (stats.solve_1 || 0) + (stats.solve_2 || 0) + (stats.solve_3 || 0);
    if (totalStarts < totalSolves) totalStarts = totalSolves;
    
    const solveRate = Math.round((totalSolves / totalStarts) * 100);
    
    let pct0 = 0, pct1 = 0, pct2 = 0, pct3 = 0;
    if (totalSolves > 0) {
        if (stats.isMock) {
            pct0 = stats.solve_0;
            pct1 = stats.solve_1;
            pct2 = stats.solve_2;
            pct3 = stats.solve_3;
        } else {
            pct0 = Math.round((stats.solve_0 / totalSolves) * 100);
            pct1 = Math.round((stats.solve_1 / totalSolves) * 100);
            pct2 = Math.round((stats.solve_2 / totalSolves) * 100);
            pct3 = Math.round((stats.solve_3 / totalSolves) * 100);
            
            const sum = pct0 + pct1 + pct2 + pct3;
            if (sum !== 100 && sum > 0) {
                const diff = 100 - sum;
                const maxVal = Math.max(pct0, pct1, pct2, pct3);
                if (pct0 === maxVal) pct0 += diff;
                else if (pct1 === maxVal) pct1 += diff;
                else if (pct2 === maxVal) pct2 += diff;
                else pct3 += diff;
            }
        }
    } else {
        pct0 = 40; pct1 = 30; pct2 = 20; pct3 = 10;
    }
    
    // Render Stats
    const solveRateBadge = document.getElementById('solve-rate-badge');
    if (solveRateBadge) {
        solveRateBadge.innerText = `${solveRate}% OF PLAYERS CRACKED THIS CHALLENGE!`;
    }
    
    const fill0 = document.getElementById('funnel-fill-0');
    const fill1 = document.getElementById('funnel-fill-1');
    const fill2 = document.getElementById('funnel-fill-2');
    const fill3 = document.getElementById('funnel-fill-3');
    
    const pct0Label = document.getElementById('funnel-pct-0');
    const pct1Label = document.getElementById('funnel-pct-1');
    const pct2Label = document.getElementById('funnel-pct-2');
    const pct3Label = document.getElementById('funnel-pct-3');
    
    if (fill0) fill0.style.width = '0%';
    if (fill1) fill1.style.width = '0%';
    if (fill2) fill2.style.width = '0%';
    if (fill3) fill3.style.width = '0%';
    
    if (pct0Label) pct0Label.innerText = '0%';
    if (pct1Label) pct1Label.innerText = '0%';
    if (pct2Label) pct2Label.innerText = '0%';
    if (pct3Label) pct3Label.innerText = '0%';
    
    setTimeout(() => {
        if (fill0) fill0.style.width = `${pct0}%`;
        if (fill1) fill1.style.width = `${pct1}%`;
        if (fill2) fill2.style.width = `${pct2}%`;
        if (fill3) fill3.style.width = `${pct3}%`;
        
        if (pct0Label) pct0Label.innerText = `${pct0}%`;
        if (pct1Label) pct1Label.innerText = `${pct1}%`;
        if (pct2Label) pct2Label.innerText = `${pct2}%`;
        if (pct3Label) pct3Label.innerText = `${pct3}%`;
    }, 200);

    switchScreen('victory');
}

// Share score streak via clipboard copy
function shareSolvedScore() {
    const solvedList = getSolvedPuzzlesList();
    const streak = solvedList.size;

    // Add hint count to the share text
    const hintText = hintsUsed === 0 ? "No hints used! Perfect score! 🌟" : `${hintsUsed}/3 hints used 💡`;

    const copyText = `PunFiction Daily Challenge #${activeChallenge.puzzle_number} 🎬\n` + 
                     `Parody Solved: "${activeChallenge.boss_pun_title}" 🍿\n` +
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
    
    const solveRate = Math.floor(75 + seedFactor * 20); // 75% to 95%
    
    const noHints = Math.floor(30 + seedFactor * 20); // 30% to 50%
    const oneHint = Math.floor(20 + seedFactor * 15); // 20% to 35%
    const twoHints = Math.floor(10 + seedFactor * 10); // 10% to 20%
    const threeHints = 100 - noHints - oneHint - twoHints;
    
    return {
        start: Math.floor(250 + seedFactor * 500),
        solve_0: noHints,
        solve_1: oneHint,
        solve_2: twoHints,
        solve_3: threeHints,
        isMock: true
    };
}

async function sendTelemetryEvent(event, hints = 0) {
    const puzzleNum = activeChallenge ? activeChallenge.puzzle_number : null;
    if (!puzzleNum) return;
    
    // Only post telemetry if running locally (localhost / 127.0.0.1)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return; // Silent bypass in production Pages
    }
    
    const payload = {
        event: event,
        puzzle_number: puzzleNum,
        hints_used: hints
    };
    
    try {
        const telemetryUrl = '/api/telemetry';
        
        await fetch(telemetryUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.log("Telemetry post failed locally.", e);
    }
}
