// Core Constants & CDN Paths
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/iwandres/PunFiction/main/backend";
const START_DATE_PT = new Date("2026-05-24T02:00:00-07:00"); // Launch date: 2am Pacific Time

// Game State
let puzzles = [];
let todayChallenge = null;
let yesterdayChallenge = null;
let activeChallenge = null; // Currently playing challenge

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
    currentLevel: document.getElementById('current-level'),
    inventorySlots: [
        document.getElementById('slot-1'),
        document.getElementById('slot-2'),
        document.getElementById('slot-3')
    ],
    questionLabel: document.getElementById('question-label'),
    bossPosterWrapper: document.getElementById('boss-poster-wrapper'),
    bossPosterImg: document.getElementById('boss-poster-img'),
    mysteryBanner: document.getElementById('mystery-banner'),
    quoteDisplay: document.getElementById('quote-display'),
    pitchDisplay: document.getElementById('pitch-display'),
    parodyTitleHint: document.getElementById('parody-title-hint'),
    guessInput: document.getElementById('guess-input'),
    feedbackMsg: document.getElementById('feedback-msg'),
    debugAnswer: document.getElementById('debug-answer'),
    btnShowHint1: document.getElementById('btn-show-hint1'),
    hint1Reveal: document.getElementById('hint1-reveal'),
    movieHint: document.getElementById('movie-hint'),
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
    document.getElementById('btn-play-today').onclick = () => startGame(todayChallenge);
    document.getElementById('btn-play-yesterday').onclick = () => startGame(yesterdayChallenge);
    document.getElementById('btn-back-lobby').onclick = showLobby;
    document.getElementById('btn-victory-lobby').onclick = showLobby;
    document.getElementById('btn-share-score').onclick = shareSolvedScore;
    ui.btnSubmit.onclick = handleGuessSubmit;
    ui.guessInput.onkeypress = (e) => { if (e.key === 'Enter') handleGuessSubmit(); };
    ui.btnShowHint1.onclick = revealHint1;

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

    // Render Start Screen Issue Covers
    renderLobbyCovers();
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

    // 2. Populate Yesterday's Card
    const yesterdayCard = document.getElementById('yesterday-issue-card');
    if (yesterdayChallenge) {
        const isSolved = solvedPuzzles.has(yesterdayChallenge.puzzle_number);
        yesterdayCard.classList.remove('hidden');
        document.getElementById('yesterday-issue-title').innerText = `Issue #${yesterdayChallenge.puzzle_number}: ${yesterdayChallenge.boss_pun_title}`;
        document.getElementById('yesterday-issue-meta').innerText = `Original Movie: ${yesterdayChallenge.boss_original_title}`;
        document.getElementById('yesterday-solved-badge').className = isSolved ? "issue-badge-solved" : "issue-badge-solved hidden";
    } else {
        yesterdayCard.classList.add('hidden');
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
    currentLevel = 1;
    inventory = [];

    // Reset slot styling
    ui.inventorySlots.forEach(slot => {
        slot.innerText = '';
        slot.className = 'inventory-slot';
    });

    switchScreen('game');
    loadLevel();
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

function loadLevel() {
    ui.guessInput.value = '';
    ui.feedbackMsg.innerText = '';
    ui.feedbackMsg.className = 'feedback';
    ui.currentLevel.innerText = currentLevel;

    // Reset hints
    ui.btnShowHint1.classList.remove('hidden');
    ui.hint1Reveal.classList.add('hidden');

    if (currentLevel <= 3) {
        // --- LEVEL 1-3: THEMATIC PUZZLES ---
        ui.questionLabel.innerText = "What fictional movie is this quote from?";
        ui.bossPosterWrapper.classList.add('hidden');

        const puzzle = activeChallenge.puzzles[currentLevel - 1];

        ui.movieHint.innerText = puzzle.base_movie || "Unknown";
        ui.quoteDisplay.innerText = puzzle.punned_quote ? `"${puzzle.punned_quote}"` : '"Quote Text Missing"';
        ui.pitchDisplay.innerText = puzzle.parody_pitch || 'Plot details unavailable.';

        // Generate blank slots matching clean letters/spacing
        const titleHint = (puzzle.parody_title || '').replace(/[a-zA-Z]/g, '_');
        ui.parodyTitleHint.innerText = titleHint.split('').join(' ');

        // Debug fallback
        ui.debugAnswer.innerText = `(Debug Answer: ${puzzle.parody_title})`;
    } else if (currentLevel === 4) {
        // --- LEVEL 4: FINAL BOSS COMBINATION ---
        ui.questionLabel.innerText = "Construct the final parody movie title!";
        
        // Render mystery poster silhouette with Neobrutalist bold blurred overlay
        const posterUrl = getCorrectPosterUrl(activeChallenge.boss_poster_url);
        ui.bossPosterImg.src = posterUrl;
        ui.bossPosterImg.className = "boss-poster-img blurred";
        ui.bossPosterWrapper.classList.remove('hidden');
        ui.mysteryBanner.classList.remove('hidden');

        ui.movieHint.innerText = activeChallenge.boss_original_title || "Unknown";
        ui.quoteDisplay.innerText = activeChallenge.boss_pitch ? `"${activeChallenge.boss_pitch}"` : 'Description missing.';
        ui.pitchDisplay.innerText = "Use your accumulated inventory words to construct the final parody movie title!";

        // Generate blanks where earned inventory words are blanked out in the title
        let bossBlanks = activeChallenge.boss_pun_title;
        inventory.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'ig');
            bossBlanks = bossBlanks.replace(regex, word.split('').map(() => '_').join(''));
        });
        ui.parodyTitleHint.innerText = bossBlanks.split('').join(' ');

        // Debug fallback
        ui.debugAnswer.innerText = `(Debug Answer: ${activeChallenge.boss_pun_title})`;
    }
}

function revealHint1() {
    ui.btnShowHint1.classList.add('hidden');
    ui.hint1Reveal.classList.remove('hidden');

    if (currentLevel === 4) {
        // Incrementally de-blur the poster illustration (part-blurred)
        ui.bossPosterImg.className = "boss-poster-img part-blurred";
        showToast("Visual clue partially de-blurred!");
    }
}

// Clean guesses to ignore minor editorial punctuation
const sanitizeText = (str) => {
    if (!str) return "";
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?!'"]/g,"").replace(/\s{2,}/g," ").trim().toLowerCase();
};

function handleGuessSubmit() {
    const guess = ui.guessInput.value.trim();
    if (!guess) return;

    const cleanGuess = sanitizeText(guess);

    if (currentLevel <= 3) {
        // Verify Thematic Guess
        const puzzle = activeChallenge.puzzles[currentLevel - 1];
        const cleanAnswer = sanitizeText(puzzle.parody_title);

        if (cleanGuess === cleanAnswer) {
            // Earn word for inventory
            const targetWord = puzzle.target_word || "word";
            inventory.push(targetWord);

            // Pop active inventory slot
            const slotIndex = currentLevel - 1;
            ui.inventorySlots[slotIndex].innerText = targetWord;
            ui.inventorySlots[slotIndex].classList.add('filled');

            ui.feedbackMsg.innerText = "⭐ CORRECT! WORD EXTRACTED TO INVENTORY!";
            ui.feedbackMsg.className = "feedback success";

            setTimeout(() => {
                currentLevel++;
                loadLevel();
            }, 1800);
        } else {
            ui.feedbackMsg.innerText = "❌ INCORRECT! TRY AGAIN!";
            ui.feedbackMsg.className = "feedback error";
            shakeInput();
        }
    } else if (currentLevel === 4) {
        // Verify Boss Guess
        const cleanBossAnswer = sanitizeText(activeChallenge.boss_pun_title);

        if (cleanGuess === cleanBossAnswer) {
            // Defeat boss! Fully un-blur poster illustration
            ui.bossPosterImg.className = "boss-poster-img sharp";
            ui.mysteryBanner.classList.add('hidden');

            ui.feedbackMsg.innerText = "🎉 CHAMPION! THE BOSS HAS BEEN DEFEATED!";
            ui.feedbackMsg.className = "feedback success";

            savePuzzleSolved(activeChallenge.puzzle_number);

            setTimeout(() => {
                triggerVictory();
            }, 1800);
        } else {
            // Incorrect guess, but let's give a visual reward: fully sharpen poster if guess gets close or as feedback!
            ui.feedbackMsg.innerText = "❌ INCORRECT TITLE! THE BOSS STANDS DEFEATED!";
            ui.feedbackMsg.className = "feedback error";
            shakeInput();
        }
    }
}

function triggerVictory() {
    currentLevel = 5;

    // Render theatrical movie poster frame
    ui.victoryPosterImg.src = getCorrectPosterUrl(activeChallenge.boss_poster_url);
    ui.finalBossTitle.innerText = activeChallenge.boss_pun_title;
    ui.finalBossMovie.innerText = `Original Movie: ${activeChallenge.boss_original_title}`;
    ui.finalBossPitch.innerText = activeChallenge.boss_pitch;

    switchScreen('victory');
}

// Share score streak via clipboard copy
function shareSolvedScore() {
    const solvedList = getSolvedPuzzlesList();
    const streak = solvedList.size;

    const copyText = `PunFiction Daily Issue #${activeChallenge.puzzle_number} 🎬\n` + 
                     `Parody Solved: "${activeChallenge.boss_pun_title}" 🍿\n` +
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
    ui.guessInput.style.animation = 'none';
    ui.guessInput.offsetHeight; /* trigger reflow */
    ui.guessInput.style.animation = 'shake 0.3s ease-in-out';
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
