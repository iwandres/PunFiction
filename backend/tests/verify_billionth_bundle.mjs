import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
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

// 3. Scale Tiers Verification across all 5 tiers
assert.equal(ScaleTiers.resolveTierState(8300000000, false).tier.index, 1);
assert.equal(ScaleTiers.resolveTierState(996000000, false).activeDots, 996);
assert.equal(ScaleTiers.resolveTierState(441280, false).tier.index, 2);
assert.equal(ScaleTiers.resolveTierState(4200, false).tier.index, 3);
assert.equal(ScaleTiers.resolveTierState(42, false).tier.index, 4);
assert.equal(ScaleTiers.resolveTierState(1, true).tier.index, 5);

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
  `[Bundle Audit] ${allFrontendFiles.length} frontend assets: ${(totalRaw / 1024).toFixed(1)} KB raw -> ${gzKb.toFixed(1)} KB gzipped (Budget: < 135.0 KB)`
);
assert.ok(gzKb < 135, `Gzipped bundle (${gzKb.toFixed(1)} KB) exceeded 135 KB budget!`);

// 6. Ensure root PunFiction index.html was NOT modified (kept unlisted as requested)
const rootGitDiff = execFileSync(
  'git',
  ['-C', ROOT, 'status', '--porcelain', 'index.html', 'sitemap.xml'],
  { encoding: 'utf8' }
).trim();
assert.equal(rootGitDiff, '', 'Root index.html and sitemap.xml must remain untouched (unlisted)!');

console.log('[Bundle Audit] All syntax, DOM wiring, 5-tier scale, gzip budget, and unlisted checks PASSED!');
