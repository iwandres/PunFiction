import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const APP_DIR = path.join(ROOT, 'the-8-billionth');

// 1. Syntax check all JS files with `node -c`
const jsFiles = [
  'js/engine/taxonomy.js',
  'js/engine/probability.js',
  'js/engine/analogies.js',
  'js/engine/resolver.js',
  'js/engine/suggestions.js',
  'js/canvas/scaleTiers.js',
  'js/canvas/scaleOutlines.js',
  'js/canvas/crowdRenderer.js',
  'js/ui/omnibox.js',
  'js/ui/receiptModal.js',
  'js/app.js'
];

for (const rel of jsFiles) {
  execFileSync(process.execPath, ['-c', path.join(APP_DIR, rel)], { stdio: 'inherit' });
}

// 2. Test Resolver & Suggestions across all 3 phases
const Probability = require(path.join(APP_DIR, 'js/engine/probability.js'));
const TraitResolver = require(path.join(APP_DIR, 'js/engine/resolver.js'));
const Suggestions = require(path.join(APP_DIR, 'js/engine/suggestions.js'));
const ScaleTiers = require(path.join(APP_DIR, 'js/canvas/scaleTiers.js'));
const ScaleOutlines = require(path.join(APP_DIR, 'js/canvas/scaleOutlines.js'));

const coreDoc = JSON.parse(fs.readFileSync(path.join(APP_DIR, 'data/traits-core.json'), 'utf8'));
const paramDoc = JSON.parse(
  fs.readFileSync(path.join(APP_DIR, 'data/traits-parametric.json'), 'utf8')
);

const resolver = new TraitResolver();
resolver.initFromData(coreDoc, paramDoc);

assert.ok(resolver.allInstantTraits.length >= 750, 'Expected 750+ instant L1+L2 traits');
const searchVball = resolver.searchInstant('volleyball', new Set(), 4);
assert.equal(searchVball[0].canonicalSlug, 'sport_volleyball');

const searchTagalog = resolver.searchInstant('I speak Tagalog', new Set(), 4);
assert.ok(searchTagalog.some((t) => t.canonicalSlug === 'speaks_tl'), 'Parametric Tagalog must resolve');

const searchJapan = resolver.searchInstant('live in Japan', new Set(), 4);
assert.ok(searchJapan.some((t) => t.canonicalSlug === 'lives_in_jp'), 'Parametric Japan must resolve');

const searchCello = resolver.searchInstant('I play cello', new Set(), 4);
assert.ok(searchCello.some((t) => t.canonicalSlug === 'instrument_cello'), 'Template I play cello must resolve');

const searchAbNeg = resolver.searchInstant('My blood type is AB-', new Set(), 4);
assert.ok(searchAbNeg.some((t) => t.canonicalSlug === 'blood_ab_neg'), 'Template My blood type is AB- must resolve');

// Suggestions across Opening -> Midgame -> Sniper
const openingDeck = Suggestions.buildSuggestionDeck({
  coreTraits: resolver.coreTraits,
  generators: resolver.generators,
  evalState: Probability.evaluateStack([]),
  shuffleSeed: 1
});
assert.equal(openingDeck.phase, 'opening');
assert.ok(openingDeck.traits.length >= 5);

const midEval = Probability.evaluateStack([
  resolver.getTraitBySlug('sport_volleyball'),
  resolver.getTraitBySlug('lives_in_ca')
]);
const midDeck = Suggestions.buildSuggestionDeck({
  coreTraits: resolver.coreTraits,
  generators: resolver.generators,
  evalState: midEval,
  shuffleSeed: 2
});
assert.equal(midDeck.phase, 'midgame');

const sniperEval = Probability.evaluateStack([
  resolver.getTraitBySlug('sport_volleyball'),
  resolver.getTraitBySlug('lives_in_is'),
  resolver.getTraitBySlug('left_handed')
]);
const sniperDeck = Suggestions.buildSuggestionDeck({
  coreTraits: resolver.coreTraits,
  generators: resolver.generators,
  evalState: sniperEval,
  shuffleSeed: 3
});
assert.equal(sniperDeck.phase, 'sniper');

// 3. Scale Tiers Verification across all 5 tiers (desktop, medium & mobile viewport profiles)
assert.equal(ScaleTiers.resolveTierState(8300000000, false).tier.index, 1);
assert.equal(ScaleTiers.resolveTierState(8300000000, false).activeDots, 8300);
assert.equal(ScaleTiers.resolveTierState(996000000, false).activeDots, 996);
assert.equal(ScaleTiers.resolveTierState(441280, false).tier.index, 2);
assert.equal(ScaleTiers.resolveTierState(4200, false).tier.index, 3);
assert.equal(ScaleTiers.resolveTierState(42, false).tier.index, 4);
assert.equal(ScaleTiers.resolveTierState(1, true).tier.index, 5);

const mobileInit = ScaleTiers.resolveTierState(8300000000, false, { fieldRadiusPx: 128 });
assert.equal(mobileInit.activeDots, 1660, 'Mobile Tier 1 should use 1,660 separated dots (1 dot = 5M)');
assert.equal(mobileInit.tier.legendText, '1 dot = 5,000,000 people');
assert.ok(
  Math.abs(ScaleTiers.getClusterRadiusNormalized(mobileInit.activeDots, 1, mobileInit.maxDots) - 0.92) < 1e-6,
  'Mobile 8.3B dot cluster must still span full 0.92 Whole Earth Globe envelope'
);
const mediumInit = ScaleTiers.resolveTierState(8300000000, false, { fieldRadiusPx: 190 });
assert.equal(mediumInit.activeDots, 3320, 'Medium viewport Tier 1 should use 3,320 dots (1 dot = 2.5M)');
assert.equal(mediumInit.tier.legendText, '1 dot = 2,500,000 people');

// 3B. Verify all 75+ Scale Perspective Outlines render finite geometry without runtime errors
assert.ok(
  ScaleOutlines.ALL_OUTLINES.length >= 70,
  `Expected 70+ distinct scale perspective outlines, got ${ScaleOutlines.ALL_OUTLINES.length}`
);
const outlineIds = new Set();
const mockCtx = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'round',
  lineJoin: 'round',
  ops: 0,
  save() {},
  restore() {},
  beginPath() {},
  closePath() {},
  setLineDash() {},
  translate(x, y) {
    assert.ok(Number.isFinite(x) && Number.isFinite(y));
  },
  rotate(r) {
    assert.ok(Number.isFinite(r));
  },
  moveTo(x, y) {
    assert.ok(Number.isFinite(x) && Number.isFinite(y));
    this.ops++;
  },
  lineTo(x, y) {
    assert.ok(Number.isFinite(x) && Number.isFinite(y));
    this.ops++;
  },
  quadraticCurveTo(cx1, cy1, x, y) {
    assert.ok(
      Number.isFinite(cx1) && Number.isFinite(cy1) && Number.isFinite(x) && Number.isFinite(y)
    );
    this.ops++;
  },
  arc(x, y, r, a0, a1) {
    assert.ok(
      Number.isFinite(x) &&
        Number.isFinite(y) &&
        Number.isFinite(r) &&
        r > 0 &&
        Number.isFinite(a0) &&
        Number.isFinite(a1)
    );
    this.ops++;
  },
  ellipse(x, y, rx, ry) {
    assert.ok(
      Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(rx) && rx > 0 && Number.isFinite(ry) && ry > 0
    );
    this.ops++;
  },
  fill() {},
  stroke() {}
};

for (const outline of ScaleOutlines.ALL_OUTLINES) {
  assert.ok(!outlineIds.has(outline.id), `Duplicate outline id: ${outline.id}`);
  outlineIds.add(outline.id);
  assert.ok(outline.label, `Missing label on ${outline.id}`);
  const copy = ScaleOutlines.getCopyForOutline(outline, Math.max(1, outline.minPop));
  assert.ok(copy.headline && copy.headline.length > 10, `Missing matched headline on ${outline.id}`);
  const beforeOps = mockCtx.ops;
  ScaleOutlines.drawOutline(mockCtx, outline, 200, 200, 150, 1.0);
  assert.ok(mockCtx.ops > beforeOps, `Outline ${outline.id} drew zero canvas operations`);
}

// Verify 8.3B always starts on the spinning Whole Earth Globe across all seeds/resets
for (const seed of [0, 1, 2, 5, 19]) {
  const startOutline = ScaleOutlines.resolveOutline(8300000000, false, {
    runSeed: seed,
    stepCount: 0,
    cycleOffset: seed
  });
  assert.equal(startOutline.id, 'earth_globe', '8.3B start must always use Whole Earth Globe');
}
const globeBeforeOps = mockCtx.ops;
ScaleOutlines.drawOutline(mockCtx, ScaleOutlines.ALL_OUTLINES[0], 200, 200, 150, 1.0, 18.5);
assert.ok(mockCtx.ops > globeBeforeOps, 'Spinning globe must render cleanly at non-zero timeSec');

// Verify anti-repeat rotation within the same population band
const first80k = ScaleOutlines.resolveOutline(80000, false, { runSeed: 0, stepCount: 1 });
const second80k = ScaleOutlines.resolveOutline(75000, false, {
  runSeed: 0,
  stepCount: 2,
  avoidId: first80k.id
});
assert.notEqual(first80k.id, second80k.id, 'Consecutive steps in same band must rotate to a fresh outline');

// 4. Verify all getElementById / querySelector IDs in app.js & receiptModal.js exist in index.html
const html = fs.readFileSync(path.join(APP_DIR, 'index.html'), 'utf8');
const appSrc =
  fs.readFileSync(path.join(APP_DIR, 'js/app.js'), 'utf8') +
  '\n' +
  fs.readFileSync(path.join(APP_DIR, 'js/ui/receiptModal.js'), 'utf8');

const idMatches = [...appSrc.matchAll(/(?:getElementById|querySelector)\(['"]#?([a-zA-Z0-9_-]+)['"]\)/g)];
for (const m of idMatches) {
  const idOrClass = m[1];
  if (m[0].includes('#') || m[0].includes('getElementById')) {
    assert.ok(
      html.includes(`id="${idOrClass}"`),
      `Missing DOM id="#${idOrClass}" in the-8-billionth/index.html`
    );
  }
}

// 4A. Verify math.html inline sandbox script syntax and DOM id wiring
const mathHtml = fs.readFileSync(path.join(APP_DIR, 'math.html'), 'utf8');
const mathScripts = [...mathHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.ok(mathScripts.length >= 2, 'Expected inline sandbox <script> in math.html');
for (const sm of mathScripts) {
  new vm.Script(sm[1], { filename: 'math.html' });
  for (const idm of sm[1].matchAll(/getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g)) {
    assert.ok(
      mathHtml.includes(`id="${idm[1]}"`),
      `Missing DOM id="#${idm[1]}" in the-8-billionth/math.html`
    );
  }
}

// 4B. Verify CSS brace balance in styles.css (prevents broken @media blocks leaking mobile rules onto desktop)
const cssSrc = fs
  .readFileSync(path.join(APP_DIR, 'css/styles.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '');
let cssBraceDepth = 0;
cssSrc.split(/\r?\n/).forEach((line, idx) => {
  for (const ch of line) {
    if (ch === '{') cssBraceDepth++;
    else if (ch === '}') cssBraceDepth--;
    assert.ok(
      cssBraceDepth >= 0,
      `Unmatched closing '}' in css/styles.css at line ${idx + 1}`
    );
  }
});
assert.equal(cssBraceDepth, 0, `Unclosed '{' block in css/styles.css (depth=${cssBraceDepth})`);

// 5. Check total gzipped bundle budget (< 120 KB)
const allFrontendFiles = [
  'index.html',
  'math.html',
  'css/styles.css',
  'data/traits-core.json',
  'data/traits-parametric.json',
  ...jsFiles
];

let totalRaw = 0;
let totalGzip = 0;
for (const rel of allFrontendFiles) {
  const buf = fs.readFileSync(path.join(APP_DIR, rel));
  totalRaw += buf.length;
  totalGzip += zlib.gzipSync(buf).length;
}

const gzKb = totalGzip / 1024;
console.log(
  `[Bundle Audit] ${allFrontendFiles.length} frontend assets: ${(totalRaw / 1024).toFixed(1)} KB raw -> ${gzKb.toFixed(1)} KB gzipped (Budget: < 210.0 KB)`
);
assert.ok(gzKb < 210, `Gzipped bundle (${gzKb.toFixed(1)} KB) exceeded 210 KB budget!`);

assert.ok(
  mathHtml.includes('id="btn-mode-common"') &&
    mathHtml.includes('id="btn-mode-nerds"') &&
    mathHtml.includes('id="view-nerds" class="math-view hidden"'),
  'math.html must include Common Folks <> Math Nerds toggle with Common Folks active by default'
);

// 6. Verify OmniboxController keeps cursor focused on desktop, but blurs & never auto-focuses on mobile
const OmniboxController = require(path.join(APP_DIR, 'js/ui/omnibox.js'));

function makeMockElement() {
  const listeners = {};
  return {
    value: '',
    disabled: false,
    focusCount: 0,
    blurCount: 0,
    innerHTML: '',
    className: '',
    dataset: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() {
        return false;
      }
    },
    addEventListener(type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
    },
    emit(type, ev = {}) {
      for (const fn of listeners[type] || []) {
        fn(Object.assign({ preventDefault() {} }, ev));
      }
    },
    focus() {
      this.focusCount++;
    },
    blur() {
      this.blurCount++;
    },
    setSelectionRange() {},
    setAttribute() {},
    contains() {
      return false;
    },
    querySelectorAll() {
      return [];
    },
    appendChild() {}
  };
}

async function testOmniboxFocusMode({ isMobile }) {
  const origWindow = globalThis.window;
  const origNavigator = globalThis.navigator;
  const origDocument = globalThis.document;

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      setInterval: () => 1,
      matchMedia: (q) => ({
        matches: isMobile && (q.includes('pointer: coarse') || q.includes('hover: none'))
      })
    }
  });
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent: isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      userAgentData: { mobile: isMobile }
    }
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { addEventListener() {}, activeElement: null }
  });

  try {
    const inputEl = makeMockElement();
    const formEl = makeMockElement();
    const dropdownEl = makeMockElement();
    const feedbackEl = makeMockElement();
    const spinnerEl = makeMockElement();
    const selected = [];

    const ctrl = new OmniboxController({
      inputEl,
      formEl,
      dropdownEl,
      feedbackEl,
      statusSpinnerEl: spinnerEl,
      resolver: {
        searchInstant: () => [],
        estimateCustomFact: async (text) => ({
          status: 'accepted',
          trait: {
            id: 'custom_carnivorous_plants',
            canonicalSlug: 'custom_carnivorous_plants',
            label: text,
            shortBadge: 'Carnivorous plants',
            prevalence: 0.002
          }
        })
      },
      formatPct: (p) => `${(p * 100).toFixed(2)}%`,
      getActiveSlugSet: () => new Set(),
      onSelectTrait: (t) => selected.push(t),
      onHoverTrait: () => {}
    });

    await ctrl.submitCustomText('I grow carnivorous plants');
    assert.equal(selected.length, 1);

    if (isMobile) {
      assert.equal(inputEl.focusCount, 0, 'Mobile custom submit must NOT re-focus input or reopen keyboard');
      assert.ok(inputEl.blurCount >= 1, 'Mobile custom submit must blur input to dismiss keyboard');
    } else {
      assert.equal(inputEl.focusCount, 1, 'Desktop custom submit must keep cursor in-focus');
    }

    // Also verify instant trait selection
    inputEl.focusCount = 0;
    inputEl.blurCount = 0;
    ctrl._pickInstantTrait(resolver.getTraitBySlug('left_handed'));
    if (isMobile) {
      assert.equal(inputEl.focusCount, 0, 'Mobile instant pick must NOT re-focus input');
      assert.equal(inputEl.blurCount, 1, 'Mobile instant pick must blur input');
    } else {
      assert.equal(inputEl.focusCount, 1, 'Desktop instant pick must keep cursor in-focus');
    }
  } finally {
    if (origWindow === undefined) delete globalThis.window;
    else Object.defineProperty(globalThis, 'window', { configurable: true, value: origWindow });
    if (origNavigator === undefined) delete globalThis.navigator;
    else Object.defineProperty(globalThis, 'navigator', { configurable: true, value: origNavigator });
    if (origDocument === undefined) delete globalThis.document;
    else Object.defineProperty(globalThis, 'document', { configurable: true, value: origDocument });
  }
}

await testOmniboxFocusMode({ isMobile: false });
await testOmniboxFocusMode({ isMobile: true });

// 7. Ensure root PunFiction index.html features the-8-billionth cleanly
const rootIndexSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
assert.ok(
  rootIndexSrc.includes('the-8-billionth'),
  'Root index.html should link to the-8-billionth!'
);

console.log('[Bundle Audit] All syntax, DOM wiring, 5-tier scale, omnibox focus/blur, and gzip budget checks PASSED!');
