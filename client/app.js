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
    start: document.getElementById('start-screen'),
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
    debugAnswer: document.getElementById('debug-answer'),
    
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
    ui.guessInput.onkeypress = (e) => { if (e.key === 'Enter') handleGuessSubmit(); };
    ui.guessInput.oninput = handleGuessInput;
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
    const todayIssueStr = padPuzzleNumber(daysElapsed + 1);
    const yesterdayIssueStr = padPuzzleNumber(daysElapsed);

    // Map challenges
    todayChallenge = approvedChallenges.find(p => p.puzzle_number === todayIssueStr) || approvedChallenges[approvedChallenges.length - 1];
    yesterdayChallenge = approvedChallenges.find(p => p.puzzle_number === yesterdayIssueStr) || null;

    // Check if player URL overrides day (e.g. ?day=001) for diagnostic playtesting
    const urlParams = new URLSearchParams(window.location.search);
    const dayOverride = urlParams.get('day') || urlParams.get('challenge');
    if (dayOverride) {
        const matchedOverride = approvedChallenges.find(p => p.puzzle_number === padPuzzleNumber(dayOverride));
        if (matchedOverride) {
            console.log(`URL Parameter Override: Playing Issue #${dayOverride}`);
            startGame(matchedOverride);
            return;
        }
    }

    // Otherwise, start Today's challenge automatically on load!
    startGame(todayChallenge);
}

function renderLobbyCovers() {
    const solvedPuzzles = getSolvedPuzzlesList();

    // 1. Populate Today's Card
    if (todayChallenge) {
        const isSolved = solvedPuzzles.has(todayChallenge.puzzle_number);
        document.getElementById('today-issue-title').innerText = `Issue #${todayChallenge.puzzle_number}: ${todayChallenge.boss_pun_title}`;
        document.getElementById('today-issue-meta').innerText = `Original Movie: ${todayChallenge.boss_original_title}`;
        document.getElementById('today-solved-badge').className = isSolved ? "issue-badge-solved" : "issue-badge-solved hidden";
        if (isSolved) {
            document.getElementById('btn-play-today').innerText = "⭐ REPLAY ISSUE";
        } else {
            document.getElementById('btn-play-today').innerText = "🎯 PLAY NOW";
        }
    }

    // 2. Populate Yesterday's Link
    const yesterdayLinkContainer = document.getElementById('yesterday-link-container');
    const btnPlayYesterdayLink = document.getElementById('btn-play-yesterday-link');

    if (yesterdayChallenge) {
        if (yesterdayLinkContainer && btnPlayYesterdayLink) {
            yesterdayLinkContainer.classList.remove('hidden');
            const isYesterdaySolved = solvedPuzzles.has(yesterdayChallenge.puzzle_number);
            btnPlayYesterdayLink.innerText = isYesterdaySolved 
                ? `⏮️ REPLAY YESTERDAY'S ISSUE (#${yesterdayChallenge.puzzle_number})` 
                : `⏮️ PLAY YESTERDAY'S CHALLENGE (#${yesterdayChallenge.puzzle_number})`;
            btnPlayYesterdayLink.onclick = () => startGame(yesterdayChallenge);
        }
    } else {
        if (yesterdayLinkContainer) {
            yesterdayLinkContainer.classList.add('hidden');
        }
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

function showLobby() {
    // Clear URL day parameters if active so it doesn't loop
    const url = new URL(window.location);
    url.searchParams.delete('day');
    url.searchParams.delete('challenge');
    window.history.pushState({}, '', url);

    renderLobbyCovers();
    switchScreen('start');
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
            return `<span style="color: var(--text-secondary); font-weight: 800;">${word}</span>`;
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

    // Debug fallback
    ui.debugAnswer.innerText = `(Debug Answer: ${activeChallenge.boss_pun_title})`;

    // Automatically focus input so player can type immediately
    setTimeout(() => {
        ui.guessInput.focus();
    }, 100);
}

function revealHint1() {
    ui.btnShowHint1.classList.add('hidden');
    // Dynamically highlight the rhyming word inside the boss quote!
    ui.quoteDisplay.innerHTML = getHighlightedPunnedQuote(activeChallenge.boss_punned_quote, activeChallenge.boss_original_quote);
    ui.btnShowHint2.classList.remove('hidden'); // Unlock Hint 2 button
    hintsUsed = 1;
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
        triggerVictory();
    } else {
        ui.feedbackMsg.innerText = "❌ INCORRECT TITLE! TRY AGAIN!";
        ui.feedbackMsg.className = "feedback error";
        ui.guessInput.value = '';
        renderGuessSlots();
        shakeInput();
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

function triggerVictory() {
    currentLevel = 5;

    // Render theatrical movie poster frame
    ui.victoryPosterImg.src = getCorrectPosterUrl(activeChallenge.boss_poster_url);
    ui.finalBossTitle.innerText = activeChallenge.boss_pun_title;
    ui.finalBossMovie.innerText = `Original Movie: ${activeChallenge.boss_original_title}`;
    ui.finalBossPitch.innerText = activeChallenge.boss_pitch;

    // Display how many hints were used dynamically with theme-tailored styled colors
    const subtitleEl = document.getElementById('victory-subtitle');
    if (subtitleEl) {
        if (hintsUsed === 0) {
            subtitleEl.innerHTML = `Solved with <span style="color: #10ac84; font-weight: 800;">NO HINTS</span> used! 🌟`;
        } else if (hintsUsed === 1) {
            subtitleEl.innerHTML = `Solved using <span style="color: #ff914d; font-weight: 800;">1 Hint</span>!`;
        } else {
            subtitleEl.innerHTML = `Solved using <span style="color: var(--accent-main); font-weight: 800;">${hintsUsed} Hints</span>!`;
        }
    }

    switchScreen('victory');
}

// Share score streak via clipboard copy
function shareSolvedScore() {
    const solvedList = getSolvedPuzzlesList();
    const streak = solvedList.size;

    // Add hint count to the share text
    const hintText = hintsUsed === 0 ? "No hints used! Perfect score! 🌟" : `${hintsUsed}/3 hints used 💡`;

    const copyText = `PunFiction Daily Issue #${activeChallenge.puzzle_number} 🎬\n` + 
                     `Parody Solved: "${activeChallenge.boss_pun_title}" 🍿\n` +
                     `💡 Stats: ${hintText}\n` +
                     `🌟 Complete Streak: ${streak} solved issue(s)!\n` +
                     `Play daily challenges at: https://iwandres.github.io/PunFiction`;

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
