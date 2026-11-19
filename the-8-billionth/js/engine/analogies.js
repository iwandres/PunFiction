/**
 * The 8.3 Billionth — 35-Rung Logarithmic Human Scale Analogy Engine
 * Translates abstract headcounts (8.3B down to 1) into vivid, lightly snarky physical crowd anchors.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthAnalogies = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Ordered high-to-low by minPopulation
  const SCALE_RUNGS = Object.freeze([
    {
      min: 8000000000,
      headline: 'There are over 8,300,000,000 humans on the planet (and a few in space). What makes you unique?',
      sub: ''
    },
    {
      min: 4500000000,
      headline: 'More than half the planet is still nodding right along with you.',
      sub: 'Roughly all of Asia plus South America combined. Bold start.'
    },
    {
      min: 2500000000,
      headline: 'Still enough statistical lookalikes to outnumber China and India combined.',
      sub: 'You narrowed the species, not the continent.'
    },
    {
      min: 1300000000,
      headline: 'Roughly one entire India of people sharing your exact checklist.',
      sub: 'Good news: you are slightly rarer than oxygen.'
    },
    {
      min: 750000000,
      headline: 'Everyone left like you could populate all of Europe with overflow seating.',
      sub: 'About 1 in 10 humans survived that cut.'
    },
    {
      min: 340000000,
      headline: 'Roughly one entire United States of statistical clones remaining.',
      sub: 'Still coast-to-coast gridlock if you all met up for coffee.'
    },
    {
      min: 180000000,
      headline: 'About the population of Brazil or Nigeria still matching every word.',
      sub: 'We are down to low single-digit percentages of humanity.'
    },
    {
      min: 95000000,
      headline: 'Roughly one Japan or Egypt worth of people still standing.',
      sub: 'Try switching categories so correlation dampening doesn’t cushion the blow.'
    },
    {
      min: 50000000,
      headline: 'About the population of South Korea or Spain sharing your exact profile.',
      sub: 'Crossing into midgame territory — time to get more specific.'
    },
    {
      min: 25000000,
      headline: 'One Tokyo metro area of lookalikes still raising their hands.',
      sub: 'You could fill the world’s largest megacity with your twins.'
    },
    {
      min: 10000000,
      headline: 'Roughly one New York City + Los Angeles metro still in the running.',
      sub: 'One solid niche trait will trigger the 10M Metropolis camera zoom.'
    },
    {
      min: 4500000,
      headline: 'Down to the size of Ireland or New Zealand.',
      sub: 'Every dot on screen now represents just 1,000 living humans.'
    },
    {
      min: 1800000,
      headline: 'Roughly the population of Vienna or Montreal.',
      sub: 'You have officially eliminated 99.97% of the human race.'
    },
    {
      min: 800000,
      headline: 'Everyone left like you could live comfortably inside San Francisco.',
      sub: 'Parking would still be terrible, though.'
    },
    {
      min: 350000,
      headline: function (n) {
        const stadiums = Math.max(4, Math.round(n / 70000));
        return 'Still enough of you to sell out ' + stadiums + ' NFL stadiums back-to-back.';
      },
      sub: 'Roughly the population of Iceland. Keep digging.'
    },
    {
      min: 120000,
      headline: 'Everyone matching you could squeeze into two sold-out Rose Bowls.',
      sub: 'A small college town of oddly familiar strangers.'
    },
    {
      min: 65000,
      headline: 'One packed Wembley Stadium chanting your life biography in unison.',
      sub: 'Next milestone: under 10,000 triggers 1-dot-equals-1-actual-human.'
    },
    {
      min: 25000,
      headline: 'Roughly two Madison Square Gardens of your statistical twins.',
      sub: 'Less than 0.0006% of Earth remains.'
    },
    {
      min: 10000,
      headline: 'One sold-out Red Rocks Amphitheatre of clones.',
      sub: 'Just above the 10,000 threshold — almost down to individual pixels.'
    },
    {
      min: 5000,
      headline: 'Every single dot on screen is now 1 actual human — enough for one mega cruise ship.',
      sub: 'Imagine that buffet line.'
    },
    {
      min: 2000,
      headline: 'Roughly one bustling suburban high school of people just like you.',
      sub: 'Check the Omnibox — one hyper-specific quirk could end this.'
    },
    {
      min: 900,
      headline: 'Everyone left fits inside a historic Broadway theater.',
      sub: 'You could make eye contact with all of them before intermission.'
    },
    {
      min: 380,
      headline: function (n) {
        const jets = Math.max(1, Math.round(n / 416));
        return jets === 1
          ? 'All ' + n.toLocaleString('en-US') + ' of you fit onto a single Boeing 747.'
          : 'Everyone left fits onto ' + jets + ' wide-body passenger jets.';
      },
      sub: 'Everyone probably fights for the exact same window seat.'
    },
    {
      min: 150,
      headline: 'Below Dunbar’s number — everyone left could fit in your phone contacts.',
      sub: 'Look closely: every dot has resolved into a distinct human silhouette.'
    },
    {
      min: 75,
      headline: 'One double-decker commuter train car of statistical clones.',
      sub: 'Uncomfortably specific eye contact all around.'
    },
    {
      min: 35,
      headline: 'One public school bus of people sharing your exact fingerprint.',
      sub: 'Drop one last hobby, allergy, or odd habit to clear the aisles.'
    },
    {
      min: 16,
      headline: 'A cramped freight elevator of your remaining lookalikes.',
      sub: 'Nobody is pressing the floor button first.'
    },
    {
      min: 8,
      headline: 'One slightly tense dinner party table of your statistical doubles.',
      sub: 'At least nobody will argue over the menu.'
    },
    {
      min: 4,
      headline: function (n) {
        return 'Just ' + n + ' of you left on Earth — enough to carpool in one sedan.';
      },
      sub: 'One more real fact seals your 1-of-1 Dossier.'
    },
    {
      min: 2,
      headline: function (n) {
        return n === 2
          ? 'Just you and ONE statistical evil twin somewhere on Earth.'
          : 'Down to a 3-person standoff across 8.3 billion humans.';
      },
      sub: 'Finish them with one unmistakable truth.'
    },
    {
      min: 1,
      headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
      sub: 'Verified One-of-One — The 8.3 Billionth.'
    }
  ]);

  function getAnalogy(population, isOneOfOne) {
    if (isOneOfOne || population <= 1) {
      const top = SCALE_RUNGS[SCALE_RUNGS.length - 1];
      return {
        headline: top.headline,
        sub: top.sub
      };
    }

    const pop = Math.max(2, Math.round(Number(population) || 8300000000));
    for (let i = 0; i < SCALE_RUNGS.length - 1; i++) {
      const rung = SCALE_RUNGS[i];
      if (pop >= rung.min) {
        return {
          headline: typeof rung.headline === 'function' ? rung.headline(pop) : rung.headline,
          sub: rung.sub
        };
      }
    }

    const fallback = SCALE_RUNGS[SCALE_RUNGS.length - 2];
    return {
      headline: typeof fallback.headline === 'function' ? fallback.headline(pop) : fallback.headline,
      sub: fallback.sub
    };
  }

  return {
    SCALE_RUNGS,
    getAnalogy
  };
});
