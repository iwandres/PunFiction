import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const Taxonomy = require(path.join(ROOT, 'the-8-billionth', 'js', 'engine', 'taxonomy.js'));
const Probability = require(path.join(ROOT, 'the-8-billionth', 'js', 'engine', 'probability.js'));
const Analogies = require(path.join(ROOT, 'the-8-billionth', 'js', 'engine', 'analogies.js'));

const coreData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'the-8-billionth', 'data', 'traits-core.json'), 'utf8')
);

function findTrait(slug) {
  const t = coreData.traits.find((x) => x.canonicalSlug === slug);
  assert.ok(t, 'Expected trait in traits-core.json: ' + slug);
  return t;
}

// 1. Closed 40-tag & 4-baseGate enum check
assert.equal(Taxonomy.CLUSTER_TAGS.length, 40, 'Must have 40 closed clusterTags (36 topical + 4 psychographic bridges)');
assert.equal(Taxonomy.BASE_GATES.length, 4, 'Must have 4 closed Pay-the-Gate-Once baseGates');
assert.equal(Taxonomy.CATEGORIES.length, 10, 'Must have 10 balanced domains');

// 2. Acceptance Criterion 1: Volleyball baseline (8.3B -> 996,000,000, +3.06 bits)
const vball = findTrait('sport_volleyball');
const resVball = Probability.evaluateStack([vball]);
assert.equal(resVball.displayPopulation, 996000000);
assert.equal(resVball.bitsDisplay.toFixed(2), '3.06');
assert.equal(resVball.isOneOfOne, false);

// 3. Acceptance Criterion 3: Cross-layer correlation dampening (gamma = 0.65)
const spicyDaily = findTrait('eats_spicy_daily'); // p = 0.24, ['spicy_palate']
const customRelish = {
  canonicalSlug: 'custom_jalapeno_relish',
  label: 'I make homemade jalapeño relish',
  shortBadge: 'Jalapeño relish',
  emoji: '🌶️',
  category: 'food_palate',
  prevalence: 0.0015,
  clusterTags: ['culinary_diy', 'spicy_palate'],
  snarkNote: 'Test custom LLM trait'
};

const resDampened = Probability.evaluateStack([spicyDaily, customRelish]);
const relishEval = resDampened.items[1];
assert.equal(relishEval.wasDampened, true);
assert.equal(relishEval.overlapCount, 1);
const expectedPEff = Math.pow(0.0015, 0.65);
assert.ok(Math.abs(relishEval.pEff - expectedPEff) < 1e-12, 'Custom LLM trait must dampen with gamma=0.65');

// 4. Ghost-cull preview must match post-click state identically
const preview = Probability.previewCandidate([spicyDaily], customRelish);
assert.equal(preview.afterPopulation, resDampened.displayPopulation);
assert.equal(preview.wasDampened, true);

// 5. Parent-child subsumption: plays_team_sport (0.25) + sport_volleyball (0.12) => 996,000,000
const teamSport = findTrait('plays_team_sport');
const resSubsumed = Probability.evaluateStack([teamSport, vball]);
assert.equal(resSubsumed.items[0].superseded, true);
assert.equal(resSubsumed.displayPopulation, 996000000);
assert.equal(resSubsumed.activeCount, 1);

// 6. One-of-One threshold check (E_k <= 1.49 vs 1.50..1.99)
// 8.3e9 * 2e-10 = 1.66 expected humans => must stay at 2 (not round down prematurely!)
const almostThere = Probability.evaluateStack([
  {
    canonicalSlug: 't1',
    label: 'Trait 1',
    prevalence: 0.0002,
    clusterTags: ['athletic']
  },
  {
    canonicalSlug: 't2',
    label: 'Trait 2',
    prevalence: 0.001,
    clusterTags: ['polyglot']
  }
]);
// 8.3e9 * 2e-4 * 1e-3 = 1660
assert.equal(almostThere.displayPopulation, 1660);

const at166 = Probability.evaluateStack([
  ...almostThere.items.map((x) => x.trait),
  {
    canonicalSlug: 't3',
    label: 'Trait 3',
    prevalence: 0.001,
    clusterTags: ['horticulture']
  }
]);
// 1660 * 0.001 = 1.66 > 1.49 -> must be 2, not 1!
assert.equal(at166.isOneOfOne, false);
assert.equal(at166.displayPopulation, 2);

const crossThreshold = Probability.evaluateStack([
  ...at166.items.map((x) => x.trait),
  {
    canonicalSlug: 't4',
    label: 'Trait 4',
    prevalence: 0.65,
    clusterTags: ['book_reader']
  }
]);
// 1.66 * 0.65 = 1.079 <= 1.49 -> One-of-One!
assert.equal(crossThreshold.isOneOfOne, true);
assert.equal(crossThreshold.displayPopulation, 1);

const badges = Taxonomy.evaluateSoloBadges(crossThreshold);
assert.ok(badges.some((b) => b.id === 'pinpoint_landing'), 'Expected Pinpoint Landing badge at E=1.08');
assert.ok(badges.some((b) => b.id === 'orthogonal_stack'), 'Expected 100% Uncorrelated badge');

// 7. Analogy ladder coverage
assert.ok(Analogies.getAnalogy(8300000000, false).headline.includes('8,300,000,000'));
assert.ok(Analogies.getAnalogy(441280, false).headline.includes('NFL stadiums'));
assert.ok(Analogies.getAnalogy(1, true).headline.includes('Population: 1'));

// 8. Bidirectional Country <-> Language Bayes Symmetry & Island Geo Subsumption
const TraitResolver = require(path.join(ROOT, 'the-8-billionth', 'js', 'engine', 'resolver.js'));
const paramData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'the-8-billionth', 'data', 'traits-parametric.json'), 'utf8')
);
const resolver = new TraitResolver();
resolver.initFromData(coreData, paramData);

const livesInJp = resolver.getTraitBySlug('lives_in_jp');
const speaksJa = resolver.getTraitBySlug('speaks_ja');
const livedOnIsland = resolver.getTraitBySlug('lived_on_island');

const jpThenJa = Probability.evaluateStack([livesInJp, speaksJa]);
const jaThenJp = Probability.evaluateStack([speaksJa, livesInJp]);
assert.equal(jpThenJa.items[1].dampenMode, 'geo_bayes');
assert.equal(jaThenJp.items[1].dampenMode, 'geo_bayes');
assert.equal(
  jpThenJa.displayPopulation,
  jaThenJp.displayPopulation,
  'Country->Language and Language->Country must converge to the exact same joint population via Bayes theorem!'
);
assert.ok(jpThenJa.displayPopulation > 115000000, 'Expected ~121M Japanese speakers in Japan, not 1.8M');

// Island nation subsumes lived_on_island
const islandAndJp = Probability.evaluateStack([livedOnIsland, livesInJp]);
assert.equal(islandAndJp.items[0].superseded, true, 'Lives in Japan must subsume Island resident');
assert.equal(islandAndJp.displayPopulation, Math.round(8300000000 * livesInJp.prevalence));

// 9. Multi-language polyglot count subsumption
const speaksEn = resolver.getTraitBySlug('speaks_en');
const speaksEs = resolver.getTraitBySlug('speaks_es');
const bilingual = resolver.getTraitBySlug('speaks_2plus_languages');
const multiLang = Probability.evaluateStack([bilingual, speaksEn, speaksEs]);
assert.equal(multiLang.items[0].superseded, true, '2 specific languages must subsume Bilingual (2+ langs)');

// 10. AI Custom Trait Subsumption
const exercisesWeekly = findTrait('exercises_weekly');
const customSpinInstructor = {
  canonicalSlug: 'teaches_indoor_spin',
  label: 'I teach indoor spin cycling classes',
  shortBadge: 'Spin instructor',
  emoji: '🚴',
  category: 'sports_movement',
  prevalence: 0.00018,
  clusterTags: ['cycling_wheeled', 'athletic'],
  subsumes: ['exercises_weekly'],
  isCustom: true
};
const spinStack = Probability.evaluateStack([exercisesWeekly, customSpinInstructor]);
assert.equal(spinStack.items[0].superseded, true, 'Custom AI subsumes[] must supersede broader parent');
assert.equal(spinStack.activeCount, 1);

// 11. Pay-the-Gate-Once + Psychographic Bridge De-Correlation & Visible UI Snark
const sourdough = findTrait('sourdough_starter_keeper');
const vinyl = findTrait('collects_vinyl_records');
const chess = findTrait('rated_chess_player');
const weather = findTrait('keeps_weather_station');
const blueEyes = findTrait('blue_eyes');

const hipsterStack = Probability.evaluateStack([sourdough, vinyl, chess, weather, blueEyes]);
assert.equal(
  hipsterStack.isOneOfOne,
  false,
  'Stacking 5 correlated Western/hipster traits must NOT falsely declare 1-of-1!'
);
assert.ok(
  hipsterStack.displayPopulation > 500,
  `Expected >500 remaining lookalikes after correlated hipster stack, got ${hipsterStack.displayPopulation}`
);

// Verify Vinyl after Sourdough hits BOTH tactile_analog_ritual AND repeat baseGates, with Venn-circle snark
const vinylItem = hipsterStack.items[1];
assert.equal(vinylItem.wasDampened, true);
assert.equal(vinylItem.dampenMode, 'cluster_and_gate');
assert.ok(vinylItem.repeatGates.length >= 2, 'Vinyl should detect already-paid demographic gates from Sourdough');
assert.ok(
  vinylItem.overlapSnark && vinylItem.overlapSnark.includes('Venn circle'),
  `Expected Venn circle snark on Sourdough+Vinyl, got: ${vinylItem.overlapSnark}`
);

// Verify Blue Eyes after Western traits deducts euro_western_skew gate even with 0 clusterTag overlap
const blueItem = hipsterStack.items[4];
assert.equal(blueItem.overlapCount, 0);
assert.equal(blueItem.wasDampened, true);
assert.equal(blueItem.dampenMode, 'base_gate');
assert.ok(blueItem.pEff > blueItem.pBase * 2.0, 'Blue eyes prevalence should roughly double inside Western gate');

console.log('[Math Test Suite] All 11 test groups (Bayes Geo, Psychographic Tags, BaseGates & Venn Snark) passed cleanly!');
