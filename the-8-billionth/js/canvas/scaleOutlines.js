/**
 * The 8.3 Billionth — Multi-Scale Architectural & Cartographic Perspective Outlines
 *
 * Provides 81 minimalist blueprint outlines across 27 logarithmic population bands
 * (8.3B down to 1 across all 5 Tiers). Each outline carries its own 1-to-1 matched
 * headline & subline so the words in the console ALWAYS match the graphic on the canvas.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthScaleOutlines = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TAU = Math.PI * 2;

  /**
   * Builds a normalized [-1..+1] blueprint drawing helper bound to `(ctx, cx, cy, S, alpha)`.
   * Coordinates scale by `S` while stroke widths remain crisp in CSS pixels at any zoom.
   */
  function createBlueprintPen(ctx, cx, cy, S, alpha) {
    const a = Math.max(0, Math.min(1, alpha));
    const px = (x) => cx + x * S;
    const py = (y) => cy + y * S;

    function tracePoly(pts, close) {
      if (!pts || pts.length < 2) return;
      ctx.moveTo(px(pts[0][0]), py(pts[0][1]));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(px(pts[i][0]), py(pts[i][1]));
      }
      if (close) ctx.closePath();
    }

    function traceSmooth(pts, close) {
      const n = pts.length;
      if (n < 3) return tracePoly(pts, close);
      if (close) {
        const mx0 = (pts[n - 1][0] + pts[0][0]) * 0.5;
        const my0 = (pts[n - 1][1] + pts[0][1]) * 0.5;
        ctx.moveTo(px(mx0), py(my0));
        for (let i = 0; i < n; i++) {
          const next = pts[(i + 1) % n];
          const mx = (pts[i][0] + next[0]) * 0.5;
          const my = (pts[i][1] + next[1]) * 0.5;
          ctx.quadraticCurveTo(px(pts[i][0]), py(pts[i][1]), px(mx), py(my));
        }
        ctx.closePath();
      } else {
        ctx.moveTo(px(pts[0][0]), py(pts[0][1]));
        for (let i = 1; i < n - 1; i++) {
          const mx = (pts[i][0] + pts[i + 1][0]) * 0.5;
          const my = (pts[i][1] + pts[i + 1][1]) * 0.5;
          ctx.quadraticCurveTo(px(pts[i][0]), py(pts[i][1]), px(mx), py(my));
        }
        ctx.lineTo(px(pts[n - 1][0]), py(pts[n - 1][1]));
      }
    }

    function traceSym(halfPts, smooth) {
      const full = halfPts.slice();
      for (let i = halfPts.length - 1; i >= 0; i--) {
        const pt = halfPts[i];
        if (Math.abs(pt[0]) > 0.001 || (i > 0 && i < halfPts.length - 1)) {
          full.push([-pt[0], pt[1]]);
        }
      }
      if (smooth) traceSmooth(full, true);
      else tracePoly(full, true);
    }

    function traceSuperEllipse(rx, ry, exp, cxOff, cyOff) {
      const ox = cxOff || 0;
      const oy = cyOff || 0;
      const steps = 64;
      const p = 2 / exp;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * TAU;
        const ct = Math.cos(t);
        const st = Math.sin(t);
        const x = ox + Math.sign(ct) * Math.pow(Math.abs(ct), p) * rx;
        const y = oy + Math.sign(st) * Math.pow(Math.abs(st), p) * ry;
        if (i === 0) ctx.moveTo(px(x), py(y));
        else ctx.lineTo(px(x), py(y));
      }
      ctx.closePath();
    }

    function traceRRect(x, y, w, h, r) {
      const hw = w * 0.5;
      const hh = h * 0.5;
      const cr = Math.min(r || 0, hw, hh);
      const x0 = px(x - hw);
      const y0 = py(y - hh);
      const x1 = px(x + hw);
      const y1 = py(y + hh);
      const rc = cr * S;
      ctx.moveTo(x0 + rc, y0);
      ctx.lineTo(x1 - rc, y0);
      ctx.quadraticCurveTo(x1, y0, x1, y0 + rc);
      ctx.lineTo(x1, y1 - rc);
      ctx.quadraticCurveTo(x1, y1, x1 - rc, y1);
      ctx.lineTo(x0 + rc, y1);
      ctx.quadraticCurveTo(x0, y1, x0, y1 - rc);
      ctx.lineTo(x0, y0 + rc);
      ctx.quadraticCurveTo(x0, y0, x0 + rc, y0);
      ctx.closePath();
    }

    return {
      S,
      circle(x, y, r) {
        ctx.moveTo(px(x + r), py(y));
        ctx.arc(px(x), py(y), Math.max(0.5, r * S), 0, TAU);
      },
      ellipse(x, y, rx, ry, rot) {
        ctx.save();
        ctx.translate(px(x), py(y));
        if (rot) ctx.rotate(rot);
        ctx.moveTo(rx * S, 0);
        ctx.ellipse(0, 0, Math.max(0.5, rx * S), Math.max(0.5, ry * S), 0, 0, TAU);
        ctx.restore();
      },
      arc(x, y, r, a0, a1) {
        ctx.moveTo(px(x + Math.cos(a0) * r), py(y + Math.sin(a0) * r));
        ctx.arc(px(x), py(y), Math.max(0.5, r * S), a0, a1);
      },
      line(x0, y0, x1, y1) {
        ctx.moveTo(px(x0), py(y0));
        ctx.lineTo(px(x1), py(y1));
      },
      quad(x0, y0, cx1, cy1, x1, y1) {
        ctx.moveTo(px(x0), py(y0));
        ctx.quadraticCurveTo(px(cx1), py(cy1), px(x1), py(y1));
      },
      poly: tracePoly,
      smooth: traceSmooth,
      sym: traceSym,
      superEllipse: traceSuperEllipse,
      rrect: traceRRect,
      spokes(r0, r1, n, offset, span) {
        const total = span || TAU;
        const start = offset || 0;
        for (let i = 0; i < n; i++) {
          const ang = start + (i / (span ? Math.max(1, n - 1) : n)) * total;
          ctx.moveTo(px(Math.cos(ang) * r0), py(Math.sin(ang) * r0));
          ctx.lineTo(px(Math.cos(ang) * r1), py(Math.sin(ang) * r1));
        }
      },
      chairs(rx, ry, n, chairW, gap) {
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * TAU - Math.PI * 0.5;
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          const tx = -sa * chairW;
          const ty = ca * chairW;
          const bx = ca * (rx + gap);
          const by = sa * (ry + gap);
          ctx.moveTo(px(bx - tx), py(by - ty));
          ctx.quadraticCurveTo(
            px(bx + ca * 0.055),
            py(by + sa * 0.055),
            px(bx + tx),
            py(by + ty)
          );
        }
      },
      wash(fn, warmGold) {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.fillStyle = warmGold
          ? `rgba(194, 120, 3, ${(0.055 * a).toFixed(4)})`
          : `rgba(15, 118, 110, ${(0.042 * a).toFixed(4)})`;
        ctx.fill();
        ctx.lineWidth = 1.7;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = warmGold
          ? `rgba(180, 114, 8, ${(0.38 * a).toFixed(4)})`
          : `rgba(15, 62, 66, ${(0.31 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      contour(fn) {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.lineWidth = 1.55;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(15, 62, 66, ${(0.28 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      inner(fn, dashed) {
        ctx.save();
        ctx.beginPath();
        if (dashed) ctx.setLineDash([3.5, 3.5]);
        fn();
        ctx.lineWidth = 1.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(20, 35, 45, ${(0.13 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      },
      accent(fn) {
        ctx.save();
        ctx.beginPath();
        fn();
        ctx.lineWidth = 1.15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = `rgba(180, 114, 8, ${(0.24 * a).toFixed(4)})`;
        ctx.stroke();
        ctx.restore();
      }
    };
  }

  // =========================================================================
  // 81 MATCHED GRAPHIC + COPY PERSPECTIVE OUTLINES ACROSS 27 SIZE BANDS
  // Every item pairs its blueprint silhouette 1-to-1 with its exact headline & subline.
  // =========================================================================
  const BANDS = [
    // --- TIER 1 · PLANETARY (10M .. 8.3B) ---
    {
      min: 8000000000,
      tier: 1,
      items: [
        {
          id: 'earth_globe',
          label: 'Whole Earth Globe',
          headline: 'There are over 8,300,000,000 humans on the planet (and a few in space). What makes you truly unique?',
          sub: '',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.96));
            g.inner(() => {
              g.line(-0.96, 0, 0.96, 0);
              g.line(0, -0.96, 0, 0.96);
              g.ellipse(0, 0, 0.56, 0.96);
              g.ellipse(0, 0, 0.96, 0.42);
            });
            g.inner(() => {
              g.line(-0.88, -0.38, 0.88, -0.38);
              g.line(-0.88, 0.38, 0.88, 0.38);
            }, true);
            g.accent(() => {
              g.arc(0, 0, 1.03, -0.82, -0.24);
              g.circle(Math.cos(-0.53) * 1.03, Math.sin(-0.53) * 1.03, 0.018);
            });
          }
        }
      ]
    },
    {
      min: 3500000000,
      tier: 1,
      items: [
        {
          id: 'afro_eurasia',
          label: 'Eastern Hemisphere',
          headline: 'More than half the planet is still nodding along — enough to fill the entire Eastern Hemisphere landmass.',
          sub: 'Each dot represents one million living people.',
          draw(g) {
            g.inner(() => g.circle(0, 0, 0.96), true);
            g.wash(() =>
              g.smooth(
                [
                  [-0.78, -0.32], [-0.42, -0.74], [0.18, -0.82], [0.82, -0.52],
                  [0.88, -0.05], [0.56, 0.28], [0.22, 0.14], [0.08, 0.78],
                  [-0.28, 0.82], [-0.46, 0.25], [-0.74, 0.06]
                ],
                true
              )
            );
            g.inner(() => {
              g.line(-0.94, 0, 0.94, 0);
              g.quad(-0.35, -0.2, 0.15, -0.32, 0.68, -0.1);
            });
          }
        },
        {
          id: 'indo_pacific_arc',
          label: 'Indo-Pacific Rim',
          headline: 'Everyone matching you so far could populate the entire Indo-Pacific coastal rim.',
          sub: 'Roughly half of humanity survived your opening cut.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.94));
            g.contour(() =>
              g.smooth(
                [
                  [-0.82, 0.28], [-0.55, -0.45], [0.05, -0.76],
                  [0.68, -0.42], [0.82, 0.25]
                ],
                false
              )
            );
            g.inner(() => {
              g.arc(0, 0.12, 0.68, Math.PI * 1.1, Math.PI * 1.9);
              g.circle(0.32, 0.36, 0.12);
              g.circle(-0.18, 0.42, 0.09);
            });
          }
        },
        {
          id: 'azimuthal_world',
          label: 'Polar World Map',
          headline: 'Half the globe is still raising its hand across every meridian on the map.',
          sub: 'Add an uncorrelated fact to carve away whole continents.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.95));
            g.inner(() => {
              g.circle(0, 0, 0.64);
              g.circle(0, 0, 0.32);
              g.spokes(0.18, 0.95, 12);
            });
          }
        }
      ]
    },
    {
      min: 1300000000,
      tier: 1,
      items: [
        {
          id: 'subcontinent_cape',
          label: 'Subcontinent Peninsula',
          headline: 'Everyone left like you could populate an entire South Asian subcontinent peninsula.',
          sub: 'Down to roughly one-sixth of the human species.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.68, -0.48], [-0.22, -0.82], [0.35, -0.72], [0.72, -0.35],
                  [0.42, 0.15], [0.04, 0.88], [-0.36, 0.18], [-0.62, -0.14]
                ],
                true
              )
            );
            g.inner(() => {
              g.quad(-0.48, -0.45, 0.05, -0.64, 0.52, -0.34);
              g.ellipse(0.24, 0.82, 0.07, 0.1);
            });
          }
        },
        {
          id: 'twin_river_basin',
          label: 'Twin-River Heartland',
          headline: 'Still enough statistical matches to fill an entire East Asian twin-river heartland.',
          sub: 'You narrowed the planet, not the billion-person crowd yet.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.82, -0.34], [-0.32, -0.78], [0.46, -0.74], [0.78, -0.28],
                  [0.84, 0.26], [0.36, 0.74], [-0.38, 0.68], [-0.78, 0.22]
                ],
                true
              )
            );
            g.inner(() => {
              g.quad(-0.56, -0.22, 0.02, -0.38, 0.72, -0.18);
              g.quad(-0.58, 0.18, 0.05, 0.04, 0.76, 0.2);
            });
          }
        },
        {
          id: 'continental_shield',
          label: 'African Continent',
          headline: 'Everyone sharing your checklist so far could populate the entire continent of Africa.',
          sub: 'Over a billion people still match every word.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.64, -0.58], [0.16, -0.84], [0.68, -0.36], [0.82, -0.06],
                  [0.44, 0.42], [0.12, 0.88], [-0.22, 0.64], [-0.32, 0.08], [-0.78, -0.18]
                ],
                true
              )
            );
            g.inner(() => g.line(-0.74, 0, 0.74, 0), true);
          }
        }
      ]
    },
    {
      min: 600000000,
      tier: 1,
      items: [
        {
          id: 'european_peninsula',
          label: 'European Continent',
          headline: 'Everyone left like you could populate the entire European continent from coast to coast.',
          sub: 'About one in ten humans on Earth survived that cut.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.84, 0.34], [-0.72, -0.14], [-0.34, -0.78], [0.48, -0.82],
                  [0.86, -0.28], [0.78, 0.38], [0.26, 0.56], [-0.14, 0.44], [-0.52, 0.62]
                ],
                true
              )
            );
            g.inner(() => g.quad(-0.55, 0.24, 0.05, 0.06, 0.62, 0.24));
          }
        },
        {
          id: 'cordillera_basin',
          label: 'Western Americas',
          headline: 'Everyone matching you could span the Americas from northern tundra down to the southern cape.',
          sub: 'Hundreds of millions of people still share this combination.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.68, -0.76], [0.28, -0.84], [0.66, -0.26], [0.22, 0.16],
                  [0.52, 0.52], [0.06, 0.90], [-0.38, 0.38], [-0.62, -0.18]
                ],
                true
              )
            );
            g.inner(() => g.quad(-0.46, -0.62, -0.26, 0.05, -0.04, 0.76), true);
          }
        },
        {
          id: 'archipelago_basin',
          label: 'Southeast Asian Seas',
          headline: 'Everyone left like you could populate the entire Southeast Asian maritime basin.',
          sub: 'Pick a trait from a fresh category for a sharper cut.',
          draw(g) {
            g.inner(() => g.circle(0, 0, 0.92), true);
            g.wash(() => {
              g.ellipse(-0.34, -0.18, 0.36, 0.2);
              g.ellipse(0.32, -0.24, 0.32, 0.18);
              g.ellipse(0.02, 0.34, 0.54, 0.2);
            });
          }
        }
      ]
    },
    {
      min: 250000000,
      tier: 1,
      items: [
        {
          id: 'coast_to_coast_usa',
          label: 'Continental United States',
          headline: 'Roughly one entire continental United States of statistical lookalikes remaining.',
          sub: 'Coast-to-coast traffic if you all met up at once.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.86, -0.52], [0.36, -0.54], [0.84, -0.34], [0.74, 0.18],
                  [0.56, 0.58], [0.38, 0.36], [-0.08, 0.56], [-0.42, 0.36], [-0.84, 0.14]
                ],
                true
              )
            );
            g.inner(() => {
              g.line(-0.74, -0.08, 0.68, -0.08);
              g.line(0.04, -0.48, 0.04, 0.42);
            }, true);
          }
        },
        {
          id: 'volcanic_archipelago',
          label: 'Indonesian Archipelago',
          headline: 'Everyone matching your stack could populate every island of the Indonesian archipelago.',
          sub: 'Down to a few percent of Earth’s population.',
          draw(g) {
            g.inner(() => g.ellipse(0, 0, 0.95, 0.62), true);
            g.wash(() => {
              g.ellipse(-0.56, -0.06, 0.28, 0.12, 0.35);
              g.ellipse(-0.04, 0.22, 0.32, 0.1);
              g.ellipse(0.12, -0.16, 0.24, 0.18);
              g.ellipse(0.62, 0.04, 0.24, 0.13, -0.2);
            });
          }
        },
        {
          id: 'continental_plains',
          label: 'Continental Heartland',
          headline: 'Everyone left like you fills an entire ocean-to-ocean continental heartland.',
          sub: 'Still hundreds of millions strong — keep stacking.',
          draw(g) {
            g.wash(() => g.superEllipse(0.92, 0.72, 2.6));
            g.inner(() => {
              g.quad(-0.52, -0.62, -0.42, 0, -0.48, 0.62);
              g.quad(0.12, -0.64, 0.04, 0.06, 0.18, 0.64);
            });
          }
        }
      ]
    },
    {
      min: 115000000,
      tier: 1,
      items: [
        {
          id: 'amazon_shield',
          label: 'Brazilian Heartland',
          headline: 'Everyone left matching you could fill all of Brazil from the Amazon basin to the Atlantic.',
          sub: 'Down to low single-digit percentages of humanity.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.74, -0.34], [-0.18, -0.76], [0.58, -0.46], [0.84, -0.04],
                  [0.42, 0.56], [-0.08, 0.84], [-0.52, 0.34], [-0.78, 0.04]
                ],
                true
              )
            );
            g.inner(() => {
              g.quad(-0.62, -0.18, -0.05, -0.26, 0.52, -0.36);
              g.quad(-0.24, -0.22, 0.04, 0.12, 0.22, 0.38);
            });
          }
        },
        {
          id: 'four_island_arc',
          label: 'Japanese Archipelago',
          headline: 'Roughly one entire Japanese four-island archipelago of people still matching your checklist.',
          sub: 'Switch categories so correlation dampening doesn’t soften the cut.',
          draw(g) {
            g.inner(() => g.circle(0, 0, 0.9), true);
            g.wash(() => {
              g.ellipse(0.46, -0.54, 0.18, 0.14, -0.3);
              g.smooth(
                [
                  [0.34, -0.32], [0.44, -0.02], [0.12, 0.32], [-0.32, 0.42],
                  [-0.42, 0.26], [-0.04, 0.1], [0.18, -0.26]
                ],
                true
              );
              g.ellipse(-0.18, 0.48, 0.13, 0.08);
              g.ellipse(-0.5, 0.56, 0.14, 0.18, 0.2);
            });
          }
        },
        {
          id: 'bi_oceanic_isthmus',
          label: 'Mexican Highlands & Gulf',
          headline: 'Everyone left like you matches the scale of Mexico from Pacific coast to Gulf peninsula.',
          sub: 'Over 98% of the planet has already been ruled out.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.78, -0.62], [0.06, -0.64], [0.18, -0.16], [0.74, 0.18],
                  [0.62, 0.52], [0.14, 0.56], [-0.36, 0.18], [-0.68, -0.22]
                ],
                true
              )
            );
          }
        }
      ]
    },
    {
      min: 45000000,
      tier: 1,
      items: [
        {
          id: 'mediterranean_boot',
          label: 'Italian Peninsula',
          headline: 'Everyone matching your profile could populate the entire Italian peninsula and Sicily.',
          sub: 'Entering midgame territory — time to get more specific.',
          draw(g) {
            g.wash(() => {
              g.smooth(
                [
                  [-0.48, -0.78], [0.16, -0.76], [0.22, -0.32], [0.58, 0.28],
                  [0.72, 0.44], [0.48, 0.54], [0.34, 0.4], [0.22, 0.66],
                  [0.02, 0.58], [-0.06, 0.14], [-0.44, -0.38]
                ],
                true
              );
              g.poly([[-0.22, 0.66], [0.06, 0.72], [-0.08, 0.88]], true);
            });
          }
        },
        {
          id: 'iberian_shield',
          label: 'Iberian Peninsula',
          headline: 'Everyone left like you could populate the entire Iberian peninsula.',
          sub: 'Less than 1% of humanity still shares all your facts.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.72, -0.62], [0.58, -0.66], [0.82, -0.18],
                  [0.44, 0.58], [-0.46, 0.68], [-0.78, 0.16]
                ],
                true
              )
            );
            g.inner(() => g.circle(0, 0, 0.44), true);
          }
        },
        {
          id: 'river_delta_fan',
          label: 'Nile River & Delta',
          headline: 'Everyone still matching you could line the entire Nile valley and coastal fan delta.',
          sub: 'One solid niche trait will drop you under 10 million.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.56, 1.56, 0.28));
            g.contour(() => {
              g.poly([[-0.42, -0.78], [0.42, -0.78], [0.02, -0.18]], true);
              g.quad(0.02, -0.18, -0.12, 0.32, 0.06, 0.78);
            });
            g.inner(() => {
              g.line(0.02, -0.18, -0.22, -0.78);
              g.line(0.02, -0.18, 0.22, -0.78);
            });
          }
        }
      ]
    },
    {
      min: 10000000,
      tier: 1,
      items: [
        {
          id: 'tokyo_bay_loops',
          label: 'Tokyo Bay Megacity',
          headline: 'Everyone left like you fits inside Greater Tokyo’s bayfront expressway rings.',
          sub: 'One more cut triggers the 10M Metropolis camera zoom.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.94));
            g.contour(() =>
              g.smooth(
                [
                  [0.24, 0.9], [0.12, 0.32], [0.42, 0.08],
                  [0.54, 0.44], [0.68, 0.74]
                ],
                false
              )
            );
            g.inner(() => {
              g.circle(-0.08, -0.04, 0.34);
              g.circle(-0.08, -0.04, 0.62);
              g.spokes(0.18, 0.92, 8);
            });
          }
        },
        {
          id: 'five_borough_harbor',
          label: 'New York Harbor Metro',
          headline: 'Everyone matching your checklist fits inside the New York Harbor metropolitan region.',
          sub: 'Right on the doorstep of the 10M Metropolis zoom.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.94));
            g.contour(() => {
              g.ellipse(-0.04, -0.08, 0.16, 0.56, 0.35);
              g.smooth([[-0.65, 0.52], [-0.15, 0.48], [0.58, 0.24], [0.85, 0.12]], false);
            });
            g.inner(() => g.spokes(0.24, 0.9, 6, 0.3));
          }
        },
        {
          id: 'river_beltway_metro',
          label: 'Seoul River Beltway',
          headline: 'Everyone remaining fits inside one river-bisected megacity beltway.',
          sub: 'Under 10 million unlocks 1-dot-equals-1,000-people.',
          draw(g) {
            g.wash(() => g.superEllipse(0.94, 0.86, 2.8));
            g.contour(() => {
              g.quad(-0.92, 0.08, -0.08, -0.22, 0.92, 0.14);
              g.quad(-0.92, 0.2, -0.08, -0.1, 0.92, 0.26);
            });
            g.inner(() => {
              g.circle(0, 0, 0.56);
              g.line(-0.32, -0.45, -0.32, 0.45);
              g.line(0.28, -0.45, 0.28, 0.45);
            }, true);
          }
        }
      ]
    },

    // --- TIER 2 · METROPOLIS (10,000 .. 9,999,999) ---
    {
      min: 3500000,
      tier: 2,
      items: [
        {
          id: 'thames_orbital',
          label: 'London Orbital Beltway',
          headline: 'Everyone left like you fits inside London’s orbital beltway along the winding Thames.',
          sub: 'Every dot on screen now represents 1,000 living humans.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.45, -0.86], [0.38, -0.88], [0.88, -0.42], [0.92, 0.28],
                  [0.44, 0.84], [-0.36, 0.86], [-0.88, 0.42], [-0.9, -0.34]
                ],
                true
              )
            );
            g.contour(() =>
              g.smooth([[-0.9, 0.12], [-0.35, -0.08], [0.08, 0.16], [0.48, -0.06], [0.9, 0.08]], false)
            );
            g.inner(() => g.circle(0, 0, 0.48), true);
          }
        },
        {
          id: 'twin_island_strait',
          label: 'New Zealand Twin Islands',
          headline: 'Everyone matching your checklist could populate New Zealand’s North and South Islands.',
          sub: 'More than 99.9% of Earth has been eliminated.',
          draw(g) {
            g.inner(() => g.circle(0, 0, 0.92), true);
            g.wash(() => {
              g.smooth([[0.08, -0.82], [0.54, -0.42], [0.32, -0.04], [0.02, -0.14], [-0.08, -0.52]], true);
              g.smooth([[-0.02, 0.08], [0.16, 0.24], [-0.26, 0.84], [-0.58, 0.68], [-0.24, 0.18]], true);
            });
          }
        },
        {
          id: 'alpine_republic',
          label: 'Swiss Alpine Valleys',
          headline: 'Everyone left like you fits across the mountain valleys and lakes of Switzerland.',
          sub: 'Every dot on screen stands for 1,000 people.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.86, 0.06], [-0.54, -0.56], [0.24, -0.64], [0.88, -0.18],
                  [0.64, 0.48], [-0.14, 0.62], [-0.72, 0.42]
                ],
                true
              )
            );
            g.inner(() => {
              g.ellipse(-0.42, 0.18, 0.18, 0.07, -0.2);
              g.ellipse(0.32, -0.34, 0.16, 0.06, 0.2);
            });
          }
        }
      ]
    },
    {
      min: 1200000,
      tier: 2,
      items: [
        {
          id: 'manhattan_island',
          label: 'Manhattan Island',
          headline: 'Everyone left matching you fits onto the street grid of Manhattan Island.',
          sub: 'Central Park included — 99.97% of humanity is gone.',
          draw(g) {
            g.inner(() => g.circle(0, 0, 0.92), true);
            g.wash(() =>
              g.smooth(
                [
                  [0.34, -0.88], [0.52, -0.74], [0.24, 0.14], [-0.18, 0.88],
                  [-0.46, 0.82], [-0.42, 0.28], [0.08, -0.58]
                ],
                true
              )
            );
            g.inner(() => {
              g.poly([[-0.06, -0.24], [0.1, -0.16], [-0.08, 0.22], [-0.24, 0.14]], true);
              g.line(0.38, -0.78, -0.34, 0.78);
            });
          }
        },
        {
          id: 'paris_boulevard_star',
          label: 'Paris Ring Boulevard',
          headline: 'Everyone remaining fits inside the ringed boulevards of central Paris.',
          sub: 'All twenty arrondissements along the curve of the Seine.',
          draw(g) {
            g.wash(() => g.ellipse(0, 0, 0.94, 0.78));
            g.contour(() => g.quad(-0.88, 0.24, -0.05, -0.34, 0.88, 0.28));
            g.inner(() => {
              g.circle(-0.22, -0.14, 0.09);
              g.spokes(0.18, 0.76, 12);
            });
          }
        },
        {
          id: 'ringstrasse_city',
          label: 'Vienna Ringstrasse',
          headline: 'Everyone left like you fits inside a historic ringed European capital like Vienna.',
          sub: 'You have narrowed 8.3 billion down to a single city.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.9));
            g.contour(() => {
              g.poly(
                [
                  [-0.18, -0.42], [0.18, -0.42], [0.42, -0.18], [0.42, 0.18],
                  [0.18, 0.42], [-0.18, 0.42], [-0.42, 0.18], [-0.42, -0.18]
                ],
                true
              );
              g.line(-0.68, -0.62, 0.68, 0.42);
            });
            g.inner(() => g.spokes(0.42, 0.88, 8));
          }
        }
      ]
    },
    {
      min: 450000,
      tier: 2,
      items: [
        {
          id: 'bay_peninsula_city',
          label: 'San Francisco Peninsula',
          headline: 'Everyone left like you could live inside San Francisco’s 7-by-7-mile bay peninsula.',
          sub: 'Street parking would still be tough, though.',
          draw(g) {
            g.inner(() => g.circle(0, 0, 0.94), true);
            g.wash(() =>
              g.poly(
                [
                  [-0.58, -0.58], [-0.12, -0.68], [0.48, -0.52], [0.62, 0.18],
                  [0.58, 0.78], [-0.52, 0.78], [-0.64, 0.08]
                ],
                true
              )
            );
            g.accent(() => g.line(-0.46, -0.62, -0.46, -0.92));
            g.inner(() => {
              g.line(-0.56, 0.04, 0.56, 0.04);
              g.line(-0.48, 0.52, 0.52, -0.38);
            });
          }
        },
        {
          id: 'canal_rings_city',
          label: 'Amsterdam Canal Rings',
          headline: 'Everyone matching your profile fits along Amsterdam’s concentric horseshoe canals.',
          sub: 'Down to a single compact harbor city.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.92));
            g.contour(() => g.line(-0.86, -0.36, 0.86, -0.36));
            g.inner(() => {
              g.arc(0, -0.32, 0.34, 0.12, Math.PI - 0.12);
              g.arc(0, -0.32, 0.54, 0.1, Math.PI - 0.1);
              g.arc(0, -0.32, 0.74, 0.08, Math.PI - 0.08);
              g.spokes(0.22, 0.82, 7, 0.35, Math.PI - 0.7);
            });
          }
        },
        {
          id: 'grand_canal_lagoon',
          label: 'Venetian Lagoon',
          headline: 'Everyone left like you fits across the islands and Grand Canal of a lagoon city.',
          sub: 'Less than one ten-thousandth of humanity remains.',
          draw(g) {
            g.inner(() => g.ellipse(0, 0, 0.94, 0.78), true);
            g.wash(() =>
              g.smooth(
                [
                  [-0.68, -0.18], [-0.28, -0.54], [0.38, -0.46], [0.74, -0.06],
                  [0.52, 0.42], [-0.12, 0.52], [-0.64, 0.28]
                ],
                true
              )
            );
            g.contour(() => {
              g.smooth([[-0.52, -0.12], [0.18, -0.22], [-0.16, 0.18], [0.46, 0.22]], false);
              g.line(-0.94, -0.18, -0.68, -0.18);
            });
          }
        }
      ]
    },
    {
      min: 160000,
      tier: 2,
      items: [
        {
          id: 'superspeedway_oval',
          label: 'Grand Prix Speedway',
          headline: 'Everyone left like you fits inside the grandstands and infield of one giant superspeedway.',
          sub: 'Roughly one Indy 500 race-day crowd.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.88, 1.24, 0.56));
            g.contour(() => g.rrect(0, 0, 1.56, 0.92, 0.42));
            g.inner(() => {
              g.smooth([[-0.42, -0.18], [0.12, -0.24], [0.28, 0.12], [-0.18, 0.22], [-0.42, 0.02]], true);
              g.line(0, 0.46, 0, 0.62);
            });
          }
        },
        {
          id: 'festival_valley',
          label: 'Music Festival Grounds',
          headline: 'Everyone matching your checklist fits across one Glastonbury-scale music festival valley.',
          sub: 'All camped out in front of the same pyramid main stage.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [0, -0.88], [0.82, -0.18], [0.68, 0.78],
                  [-0.68, 0.78], [-0.82, -0.18]
                ],
                true
              )
            );
            g.contour(() => g.poly([[-0.22, -0.56], [0, -0.82], [0.22, -0.56]], true));
            g.inner(() => {
              g.arc(0, -0.62, 0.52, 0.55, Math.PI - 0.55);
              g.arc(0, -0.62, 0.92, 0.62, Math.PI - 0.62);
            }, true);
          }
        },
        {
          id: 'fjord_island',
          label: 'Icelandic Fjord Island',
          headline: 'Everyone remaining on Earth could live comfortably across the fjords of Iceland.',
          sub: 'A sparse volcanic island’s worth of statistical twins.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [-0.84, -0.34], [-0.46, -0.68], [0.28, -0.64], [0.84, -0.24],
                  [0.74, 0.36], [0.12, 0.64], [-0.56, 0.54], [-0.72, 0.08]
                ],
                true
              )
            );
            g.inner(() => g.ellipse(0.22, 0.18, 0.24, 0.16));
          }
        }
      ]
    },
    {
      min: 60000,
      tier: 2,
      items: [
        {
          id: 'wembley_stadium',
          label: 'Olympic Stadium Bowl',
          headline: 'Everyone left like you fits inside one packed Olympic stadium bowl.',
          sub: 'Under 10,000 triggers 1-dot-equals-1-actual-human.',
          draw(g) {
            g.wash(() => g.superEllipse(0.96, 0.80, 2.5));
            g.contour(() => g.superEllipse(0.68, 0.52, 2.6));
            g.accent(() => g.quad(-0.92, -0.18, 0, -0.98, 0.92, -0.18));
            g.inner(() => {
              g.rrect(0, 0, 0.88, 0.56, 0.02);
              g.line(0, -0.28, 0, 0.28);
              g.circle(0, 0, 0.11);
              g.spokes(0.70, 0.94, 16);
            });
          }
        },
        {
          id: 'rose_bowl_stadium',
          label: 'College Football Bowl',
          headline: 'Everyone matching your checklist fits inside one sold-out college football bowl.',
          sub: 'From endzone to endzone, upper deck included.',
          draw(g) {
            g.wash(() => g.ellipse(0, 0, 0.96, 0.80));
            g.contour(() => g.ellipse(0, 0, 0.62, 0.46));
            g.inner(() => {
              g.rrect(0, 0, 0.84, 0.44, 0.01);
              for (let x = -0.28; x <= 0.29; x += 0.14) g.line(x, -0.22, x, 0.22);
              g.spokes(0.62, 0.94, 20);
            });
          }
        },
        {
          id: 'roman_colosseum',
          label: 'Roman Colosseum',
          headline: 'All of your remaining statistical lookalikes fit inside the Roman Colosseum.',
          sub: 'Every stone tier filled around the arena floor.',
          draw(g) {
            g.wash(() => g.ellipse(0, 0, 0.96, 0.80));
            g.contour(() => {
              g.ellipse(0, 0, 0.84, 0.68);
              g.ellipse(0, 0, 0.50, 0.36);
            });
            g.inner(() => {
              g.spokes(0.50, 0.96, 24);
              for (let y = -0.2; y <= 0.21; y += 0.1) g.line(-0.36, y, 0.36, y);
            });
          }
        }
      ]
    },
    {
      min: 28000,
      tier: 2,
      items: [
        {
          id: 'baseball_ballpark',
          label: 'Baseball Ballpark',
          headline: 'Everyone left like you fits inside the grandstands and bleachers of one baseball ballpark.',
          sub: 'One seventh-inning stretch of your statistical twins.',
          draw(g) {
            g.wash(() =>
              g.smooth(
                [
                  [0, 0.88], [-0.78, 0.32], [-0.88, -0.44], [-0.34, -0.88],
                  [0.38, -0.84], [0.88, -0.34], [0.78, 0.32]
                ],
                true
              )
            );
            g.contour(() => {
              g.poly([[0, 0.52], [-0.58, -0.06], [0, -0.58], [0.58, -0.06]], true);
            });
            g.inner(() => {
              g.poly([[0, 0.46], [-0.24, 0.22], [0, -0.02], [0.24, 0.22]], true);
              g.circle(0, 0.22, 0.045);
            });
          }
        },
        {
          id: 'cricket_oval',
          label: 'Cricket Oval Ground',
          headline: 'Everyone matching your profile fits around the boundary of one classic cricket oval.',
          sub: 'Under 10,000 unlocks individual 1-for-1 human dots.',
          draw(g) {
            g.wash(() => g.ellipse(0, 0, 0.90, 0.94));
            g.contour(() => g.ellipse(0, 0, 0.68, 0.72));
            g.inner(() => {
              g.rrect(0, 0, 0.14, 0.44, 0.02);
              g.ellipse(0, 0, 0.38, 0.42);
              g.spokes(0.68, 0.90, 18);
            });
          }
        },
        {
          id: 'marathon_corral',
          label: 'City Marathon Start',
          headline: 'Everyone left like you equals the starting-corral field of one major city marathon.',
          sub: 'One more sharp trait brings every dot down to 1 actual person.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.12, 1.84, 0.18));
            g.accent(() => g.line(-0.56, -0.62, 0.56, -0.62));
            g.inner(() => {
              for (let y = -0.34; y <= 0.64; y += 0.32) {
                g.line(-0.48, y, 0.48, y);
              }
            }, true);
          }
        }
      ]
    },
    {
      min: 10000,
      tier: 2,
      items: [
        {
          id: 'round_arena',
          label: 'Circular Indoor Arena',
          headline: 'Everyone left like you fits inside one circular indoor arena.',
          sub: 'Right at the edge of the 10,000-person individual dot zoom.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.92));
            g.contour(() => g.circle(0, 0, 0.66));
            g.inner(() => {
              g.rrect(0, 0, 0.72, 0.42, 0.04);
              g.circle(0, 0, 0.1);
              g.spokes(0.66, 0.92, 24);
            });
          }
        },
        {
          id: 'canyon_amphitheater',
          label: 'Canyon Amphitheater',
          headline: 'Everyone matching your checklist fits on the stone benches of one canyon amphitheater.',
          sub: 'Carved between twin rock monoliths — almost under 10,000.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.32, 0.78], [-0.78, -0.68], [0.78, -0.68], [0.32, 0.78]
                ],
                true
              )
            );
            g.contour(() => {
              g.poly([[-0.92, -0.58], [-0.74, -0.72], [-0.34, 0.72], [-0.54, 0.78]], true);
              g.poly([[0.92, -0.58], [0.74, -0.72], [0.34, 0.72], [0.54, 0.78]], true);
              g.rrect(0, 0.68, 0.52, 0.14, 0.03);
            });
            g.inner(() => {
              for (let r = 0.35; r <= 1.25; r += 0.22) {
                g.arc(0, 0.68, r, -Math.PI * 0.68, -Math.PI * 0.32);
              }
            });
          }
        },
        {
          id: 'velodrome_track',
          label: 'Olympic Velodrome',
          headline: 'Everyone remaining fits around the banked timber oval of an indoor velodrome.',
          sub: 'Less than 0.0003% of Earth still matches.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.84, 1.32, 0.62));
            g.contour(() => {
              g.rrect(0, 0, 1.48, 0.96, 0.46);
              g.rrect(0, 0, 1.08, 0.56, 0.26);
            });
            g.inner(() => {
              g.line(0, -0.66, 0, 0.66);
              g.line(-0.92, 0, 0.92, 0);
            }, true);
          }
        }
      ]
    },

    // --- TIER 3 · STADIUM / VENUE (250 .. 9,999) ---
    {
      min: 4000,
      tier: 3,
      items: [
        {
          id: 'cruise_liner',
          label: 'Ocean Cruise Ship',
          headline: 'Every dot is now 1 actual human — and all of you fit aboard one ocean cruise ship.',
          sub: 'Every promenade deck and poolside lounge chair accounted for.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.96], [0.24, -0.68], [0.38, -0.34],
                  [0.40, 0.58], [0.32, 0.88], [0, 0.92]
                ],
                true
              )
            );
            g.contour(() => g.rrect(0, -0.54, 0.94, 0.10, 0.03));
            g.inner(() => {
              g.sym([[0, -0.76], [0.28, -0.28], [0.30, 0.54], [0, 0.78]], false);
              g.rrect(0, -0.12, 0.22, 0.32, 0.05);
              g.rrect(0, 0.32, 0.22, 0.26, 0.05);
              g.line(-0.56, 0.96, -0.34, 0.86);
              g.line(0.56, 0.96, 0.34, 0.86);
            });
          }
        },
        {
          id: 'albert_rotunda',
          label: 'Domed Concert Rotunda',
          headline: 'Every dot is 1 actual human — and everyone left fits inside one domed concert rotunda.',
          sub: 'From the standing arena floor up to the top gallery ring.',
          draw(g) {
            g.wash(() => g.ellipse(0, 0, 0.88, 0.94));
            g.contour(() => {
              g.ellipse(0, 0.04, 0.64, 0.70);
              g.arc(0, -0.62, 0.26, Math.PI, TAU);
            });
            g.inner(() => {
              g.ellipse(0, 0.08, 0.38, 0.42);
              g.spokes(0.64, 0.88, 20);
            });
          }
        },
        {
          id: 'aircraft_carrier',
          label: 'Aircraft Carrier Deck',
          headline: 'Every dot is 1 human — and your entire remaining crowd equals the crew of one aircraft carrier.',
          sub: 'Mustering shoulder-to-shoulder across the angled flight deck.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.18, -0.94], [0.18, -0.94], [0.34, -0.48], [0.38, 0.36],
                  [0.26, 0.90], [-0.24, 0.90], [-0.50, 0.18], [-0.28, -0.52]
                ],
                true
              )
            );
            g.contour(() => g.rrect(0.28, 0.08, 0.14, 0.34, 0.02));
            g.inner(() => {
              g.line(-0.08, 0.82, -0.38, -0.18);
              g.line(0.06, -0.88, 0.06, -0.18);
            }, true);
          }
        },
        {
          id: 'grand_concourse',
          label: 'Grand Train Terminal',
          headline: 'Every dot is 1 actual human — enough to fill the main concourse of a grand train terminal.',
          sub: 'Gathered around the center information clock.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.76, 1.28, 0.08));
            g.contour(() => {
              g.rrect(0, 0, 1.56, 1.08, 0.04);
              g.circle(0, 0, 0.12);
            });
            g.inner(() => {
              for (let x = -0.6; x <= 0.61; x += 0.3) {
                g.line(x, -0.64, x, -0.54);
                g.line(x, 0.54, x, 0.64);
              }
            });
          }
        }
      ]
    },
    {
      min: 1600,
      tier: 3,
      items: [
        {
          id: 'opera_shells',
          label: 'Harbor Opera House',
          headline: 'Everyone left like you fits beneath the vaulted shells of a harbor opera house.',
          sub: 'One evening performance of remarkably similar biographies.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.64, 0.82], [-0.74, -0.18], [-0.18, -0.88],
                  [0.54, -0.74], [0.76, 0.12], [0.58, 0.82]
                ],
                true
              )
            );
            g.contour(() => {
              g.poly([[-0.52, 0.18], [-0.16, -0.78], [0.16, 0.18]], true);
              g.poly([[0.06, 0.24], [0.46, -0.64], [0.64, 0.24]], true);
              g.poly([[-0.44, 0.56], [-0.12, -0.22], [0.18, 0.56]], true);
            });
          }
        },
        {
          id: 'gothic_cathedral',
          label: 'Cathedral Floorplan',
          headline: 'Everyone matching your checklist fits inside the nave and transepts of one Gothic cathedral.',
          sub: 'Every single dot on the blueprint is one living human.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.92], [0.22, -0.86], [0.28, -0.64], [0.28, -0.28],
                  [0.74, -0.28], [0.74, 0.08], [0.28, 0.08], [0.28, 0.88], [0, 0.88]
                ],
                false
              )
            );
            g.inner(() => {
              g.circle(0, -0.1, 0.2);
              for (let y = 0.24; y <= 0.75; y += 0.22) {
                g.line(-0.28, y, 0.28, y);
              }
              g.line(-0.14, -0.64, -0.14, 0.86);
              g.line(0.14, -0.64, 0.14, 0.86);
            });
          }
        },
        {
          id: 'campus_quad',
          label: 'High School Campus Quad',
          headline: 'Everyone remaining on Earth equals one suburban high school quadrangle.',
          sub: 'One hyper-specific hobby or quirk could clear the courtyard.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.72, 1.72, 0.10));
            g.contour(() => g.rrect(0, 0, 1.24, 1.24, 0.06));
            g.inner(() => {
              g.line(-0.60, -0.60, 0.60, 0.60);
              g.line(0.60, -0.60, -0.60, 0.60);
              g.circle(0, 0, 0.14);
            });
          }
        }
      ]
    },
    {
      min: 700,
      tier: 3,
      items: [
        {
          id: 'broadway_theater',
          label: 'Broadway Theater',
          headline: 'Everyone left like you fits inside the orchestra and balcony of a historic Broadway theater.',
          sub: 'You could make eye contact with all of them before intermission.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.86], [0.64, -0.86], [0.64, -0.44], [0.84, -0.06],
                  [0.76, 0.56], [0.38, 0.86], [0, 0.90]
                ],
                true
              )
            );
            g.contour(() => g.quad(-0.62, -0.46, 0, -0.32, 0.62, -0.46));
            g.inner(() => {
              g.arc(0, -0.42, 0.58, 0.35, Math.PI - 0.35);
              g.arc(0, -0.42, 0.96, 0.42, Math.PI - 0.42);
            });
          }
        },
        {
          id: 'vineyard_symphony',
          label: 'Symphony Concert Hall',
          headline: 'Everyone matching your profile fits on the terraced tiers of one symphony concert hall.',
          sub: 'Surrounding the center stage with barely a spare seat.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [0, -0.92], [0.82, -0.42], [0.76, 0.54],
                  [0, 0.92], [-0.76, 0.54], [-0.82, -0.42]
                ],
                true
              )
            );
            g.contour(() => g.rrect(0, -0.14, 0.54, 0.36, 0.06));
            g.inner(() => {
              g.poly([[-0.56, -0.34], [0, -0.74], [0.56, -0.34]], false);
              g.poly([[-0.58, 0.24], [0, 0.72], [0.58, 0.24]], false);
            });
          }
        },
        {
          id: 'three_ring_tent',
          label: 'Three-Ring Big Top',
          headline: 'Everyone left like you fits beneath the canvas canopy of one three-ring circus tent.',
          sub: 'Around a thousand people out of 8.3 billion.',
          draw(g) {
            g.wash(() => g.ellipse(0, 0, 0.94, 0.76));
            g.inner(() => {
              g.circle(-0.44, 0, 0.20);
              g.circle(0, 0, 0.24);
              g.circle(0.44, 0, 0.20);
              g.spokes(0.28, 0.92, 12);
            });
          }
        }
      ]
    },
    {
      min: 250,
      tier: 3,
      items: [
        {
          id: 'boeing_747',
          label: 'Boeing 747 Cabin',
          headline: 'Everyone left like you fits aboard a single wide-body Boeing 747.',
          sub: 'Everyone probably reaches for the exact same window seat.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.96], [0.10, -0.88], [0.13, -0.38], [0.96, 0.16],
                  [0.96, 0.28], [0.13, 0.04], [0.12, 0.62], [0.42, 0.86],
                  [0.42, 0.94], [0.07, 0.82], [0, 0.95]
                ],
                false
              )
            );
            g.contour(() => {
              g.rrect(-0.36, -0.10, 0.08, 0.18, 0.03);
              g.rrect(0.36, -0.10, 0.08, 0.18, 0.03);
              g.rrect(-0.64, 0.06, 0.07, 0.16, 0.03);
              g.rrect(0.64, 0.06, 0.07, 0.16, 0.03);
            });
            g.inner(() => g.line(0, -0.78, 0, 0.72), true);
          }
        },
        {
          id: 'harbor_ferry',
          label: 'Double-Ended Ferry',
          headline: 'Everyone matching your checklist fits onto one double-ended passenger ferry.',
          sub: 'Under 250 unlocks individual human silhouettes.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.92], [0.34, -0.72], [0.46, -0.28],
                  [0.46, 0.28], [0.34, 0.72], [0, 0.92]
                ],
                true
              )
            );
            g.contour(() => g.rrect(0, 0, 0.62, 1.12, 0.14));
            g.inner(() => g.circle(0, 0, 0.14));
          }
        },
        {
          id: 'reading_rotunda',
          label: 'Library Reading Room',
          headline: 'Everyone remaining fits at the radial desks of one domed library reading room.',
          sub: 'Pin-drop silence — and everyone brought the same book.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.92));
            g.contour(() => {
              g.circle(0, 0, 0.76);
              g.circle(0, 0, 0.18);
            });
            g.inner(() => g.spokes(0.22, 0.72, 16));
          }
        },
        {
          id: 'cinema_auditorium',
          label: 'Grand Cinema Hall',
          headline: 'All of your remaining matches fit inside one curved-screen cinema auditorium.',
          sub: 'Not even a second screening room required.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.66, -0.82], [0.66, -0.82], [0.86, 0.78], [-0.86, 0.78]
                ],
                true
              )
            );
            g.accent(() => g.quad(-0.58, -0.68, 0, -0.56, 0.58, -0.68));
            g.inner(() => {
              for (let y = -0.32; y <= 0.62; y += 0.22) {
                g.line(-0.62, y, 0.62, y);
              }
            });
          }
        }
      ]
    },

    // --- TIER 4 · THE ROOM (2 .. 249) ---
    {
      min: 120,
      tier: 4,
      items: [
        {
          id: 'reception_pavilion',
          label: 'Banquet Pavilion',
          headline: 'Everyone left like you fits around the tables of one garden banquet pavilion.',
          sub: 'Every dot on screen has resolved into an individual human silhouette.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.76, 1.56, 0.18));
            g.contour(() => g.rrect(0, 0, 0.64, 0.64, 0.04));
            g.inner(() => {
              for (let i = 0; i < 8; i++) {
                const a = (i / 8) * TAU + 0.39;
                g.circle(Math.cos(a) * 0.62, Math.sin(a) * 0.54, 0.11);
              }
            });
          }
        },
        {
          id: 'lecture_hall',
          label: 'Lecture Amphitheater',
          headline: 'Everyone matching your checklist fits inside one tiered university lecture hall.',
          sub: 'Roughly Dunbar’s number — every silhouette is one person.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.78], [0.58, -0.78], [0.90, 0.12],
                  [0.68, 0.78], [0, 0.84]
                ],
                true
              )
            );
            g.contour(() => g.rrect(0, -0.58, 0.44, 0.12, 0.03));
            g.inner(() => {
              g.arc(0, -0.52, 0.48, 0.3, Math.PI - 0.3);
              g.arc(0, -0.52, 0.78, 0.34, Math.PI - 0.34);
              g.arc(0, -0.52, 1.08, 0.38, Math.PI - 0.38);
            });
          }
        },
        {
          id: 'narrowbody_jet',
          label: 'Twin-Engine Jetliner',
          headline: 'Everyone left on Earth like you fits down the single aisle of one twin-engine jetliner.',
          sub: 'Every silhouette on the cabin blueprint is one actual match.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.94], [0.11, -0.82], [0.12, -0.26], [0.92, 0.16],
                  [0.92, 0.26], [0.12, 0.04], [0.11, 0.64], [0.38, 0.86],
                  [0.38, 0.92], [0.06, 0.82], [0, 0.94]
                ],
                false
              )
            );
            g.contour(() => {
              g.rrect(-0.34, -0.04, 0.09, 0.18, 0.03);
              g.rrect(0.34, -0.04, 0.09, 0.18, 0.03);
            });
          }
        }
      ]
    },
    {
      min: 60,
      tier: 4,
      items: [
        {
          id: 'commuter_railcar',
          label: 'Commuter Train Car',
          headline: 'One commuter train car of people sharing your exact checklist.',
          sub: 'Uncomfortably specific eye contact up and down the center aisle.',
          draw(g) {
            g.inner(() => {
              g.line(-0.36, -0.98, -0.36, 0.98);
              g.line(0.36, -0.98, 0.36, 0.98);
            }, true);
            g.wash(() => g.rrect(0, 0, 0.92, 1.84, 0.16));
            g.contour(() => g.rrect(0, 0, 0.76, 1.56, 0.08));
            g.inner(() => {
              g.line(0, -0.76, 0, 0.76);
              g.line(-0.46, -0.52, 0.46, -0.52);
              g.line(-0.46, 0.52, 0.46, 0.52);
            });
          }
        },
        {
          id: 'planetarium_dome',
          label: 'Planetarium Star Dome',
          headline: 'Everyone left like you fits beneath the reclined ring of a neighborhood planetarium dome.',
          sub: 'Fewer than a hundred statistical matches remain on Earth.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.92));
            g.contour(() => {
              g.circle(0, 0, 0.78);
              g.rrect(0, 0, 0.12, 0.24, 0.04);
              g.rrect(0, 0, 0.24, 0.12, 0.04);
            });
            g.inner(() => g.circle(0, 0, 0.48), true);
          }
        },
        {
          id: 'corner_cafe',
          label: 'Corner Coffeehouse',
          headline: 'Everyone matching your profile fits inside one bustling corner coffeehouse.',
          sub: 'And every barista ticket would have the exact same order.',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.82, -0.82], [0.46, -0.82], [0.82, -0.46],
                  [0.82, 0.82], [-0.82, 0.82]
                ],
                true
              )
            );
            g.contour(() =>
              g.poly([[-0.66, -0.66], [-0.12, -0.66], [-0.12, 0.12], [-0.66, 0.12]], false)
            );
            g.inner(() => {
              g.circle(0.36, -0.22, 0.14);
              g.circle(0.36, 0.36, 0.14);
              g.circle(-0.26, 0.46, 0.14);
            });
          }
        }
      ]
    },
    {
      min: 28,
      tier: 4,
      items: [
        {
          id: 'school_bus',
          label: 'Yellow School Bus',
          headline: 'One yellow school bus of people sharing your exact profile.',
          sub: 'Drop one last hobby, allergy, or odd habit to clear the aisles.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.94], [0.34, -0.90], [0.40, -0.66],
                  [0.46, -0.58], [0.46, 0.84], [0.38, 0.92], [0, 0.92]
                ],
                true
              )
            );
            g.contour(() => {
              g.quad(-0.40, -0.58, 0, -0.68, 0.40, -0.58);
              g.line(-0.44, -0.62, -0.58, -0.56);
              g.line(0.44, -0.62, 0.58, -0.56);
              g.rrect(0, 0.89, 0.28, 0.06, 0.02);
            });
            g.inner(() => g.line(0, -0.52, 0, 0.82), true);
          }
        },
        {
          id: 'homeroom_class',
          label: 'School Classroom',
          headline: 'Everyone left like you fits at the desks of a single school classroom.',
          sub: 'One chalkboard, a few rows of desks, and zero strangers.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.68, 1.48, 0.06));
            g.contour(() => {
              g.rrect(0, -0.56, 0.54, 0.14, 0.03);
              g.arc(-0.84, -0.42, 0.24, 0, Math.PI * 0.5);
            });
            g.inner(() => {
              for (let r = -0.18; r <= 0.48; r += 0.32) {
                for (let c = -0.48; c <= 0.49; c += 0.48) {
                  g.rrect(c, r, 0.24, 0.15, 0.02);
                }
              }
            });
          }
        },
        {
          id: 'sailing_schooner',
          label: 'Two-Masted Yacht',
          headline: 'Everyone matching your checklist fits on the deck of a single two-masted sailing yacht.',
          sub: 'One more specific detail trims the crew down to single digits.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.88], [0.28, -0.48], [0.40, 0.06],
                  [0.34, 0.66], [0.20, 0.88], [0, 0.88]
                ],
                true
              )
            );
            g.contour(() => {
              g.line(0, -0.88, 0, -1.00);
              g.circle(0, -0.28, 0.055);
              g.circle(0, 0.24, 0.055);
              g.quad(0, -0.28, 0.48, -0.14, 0.42, 0.14);
              g.quad(0, 0.24, 0.46, 0.38, 0.38, 0.68);
            });
            g.inner(() => {
              g.rrect(0, 0.56, 0.28, 0.28, 0.08);
              g.quad(-0.34, -0.52, -0.66, 0.12, -0.58, 0.86);
              g.quad(0.34, -0.52, 0.66, 0.12, 0.58, 0.86);
            }, true);
          }
        }
      ]
    },
    {
      min: 13,
      tier: 4,
      items: [
        {
          id: 'freight_elevator',
          label: 'Freight Elevator Cab',
          headline: 'A single freight elevator cab of your remaining statistical lookalikes.',
          sub: 'Nobody is reaching for the floor button first.',
          draw(g) {
            g.inner(() => g.rrect(0, 0, 1.64, 1.64, 0.06), true);
            g.wash(() => g.rrect(0, 0, 1.38, 1.38, 0.06));
            g.contour(() => {
              g.line(-0.44, -0.69, -0.04, -0.69);
              g.line(0.04, -0.69, 0.44, -0.69);
              g.rrect(-0.76, 0, 0.08, 0.36, 0.02);
              g.rrect(0.76, 0, 0.08, 0.36, 0.02);
            });
          }
        },
        {
          id: 'boardroom_table',
          label: 'Conference Boardroom',
          headline: 'Everyone left like you fits around a single oval conference boardroom table.',
          sub: 'Under twenty people out of 8.3 billion — almost 1-of-1.',
          draw(g) {
            g.inner(() => g.rrect(0, 0, 1.76, 1.36, 0.10));
            g.wash(() => g.superEllipse(0.66, 0.38, 2.4));
            g.contour(() => g.chairs(0.66, 0.38, 14, 0.065, 0.07));
          }
        },
        {
          id: 'campfire_ring',
          label: 'Campfire Clearing',
          headline: 'Everyone matching your stack fits on the log benches around a single campfire.',
          sub: 'All telling remarkably identical life stories.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.88));
            g.accent(() => g.circle(0, 0, 0.16));
            g.contour(() => {
              for (let i = 0; i < 6; i++) {
                const a = (i / 6) * TAU;
                g.arc(0, 0, 0.68, a - 0.32, a + 0.32);
              }
            });
          }
        }
      ]
    },
    {
      min: 7,
      tier: 4,
      items: [
        {
          id: 'dinner_party_table',
          label: 'Dinner Party Table',
          headline: 'One round dinner party table of your statistical doubles.',
          sub: 'At least nobody at the table will argue over the menu.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.66));
            g.contour(() => g.chairs(0.66, 0.66, 10, 0.10, 0.09));
            g.inner(() => {
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * TAU - Math.PI * 0.5;
                g.circle(Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0.055);
              }
            });
          }
        },
        {
          id: 'crew_capsule',
          label: 'Spacecraft Capsule',
          headline: 'Everyone left like you could squeeze into a single spacecraft crew capsule.',
          sub: 'Single-digit territory — one more fact should seal it.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.86));
            g.contour(() => {
              g.circle(0, 0, 0.72);
              g.rrect(0, 0, 0.26, 0.26, 0.05);
            });
            g.inner(() => g.spokes(0.24, 0.72, 8, 0.39));
          }
        },
        {
          id: 'living_room_rug',
          label: 'Living Room Sectional',
          headline: 'Everyone matching your checklist fits onto one living room sectional sofa.',
          sub: 'Small enough for one unforgettable game night.',
          draw(g) {
            g.wash(() => g.rrect(0, 0.04, 1.56, 1.36, 0.08));
            g.contour(() => {
              g.poly(
                [
                  [-0.68, 0.24], [-0.68, -0.58], [0.68, -0.58], [0.68, 0.24],
                  [0.44, 0.24], [0.44, -0.34], [-0.44, -0.34], [-0.44, 0.24]
                ],
                true
              );
              g.rrect(0, 0.06, 0.54, 0.30, 0.06);
            });
          }
        }
      ]
    },
    {
      min: 4,
      tier: 4,
      items: [
        {
          id: 'sedan_car',
          label: 'Four-Door Sedan',
          headline(n) {
            return 'Just ' + n + ' of you left on Earth — enough to carpool in one four-door sedan.';
          },
          sub: 'One more real fact seals your 1-of-1 card.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.92], [0.34, -0.86], [0.44, -0.52],
                  [0.46, 0.56], [0.38, 0.88], [0, 0.92]
                ],
                true
              )
            );
            g.contour(() => {
              g.poly([[-0.34, -0.44], [0.34, -0.44], [0.30, -0.18], [-0.30, -0.18]], true);
              g.poly([[-0.30, 0.38], [0.30, 0.38], [0.34, 0.58], [-0.34, 0.58]], true);
              g.line(-0.44, -0.34, -0.56, -0.30);
              g.line(0.44, -0.34, 0.56, -0.30);
            });
          }
        },
        {
          id: 'wooden_rowboat',
          label: 'Wooden Rowboat',
          headline(n) {
            return 'Just ' + n + ' of you left on Earth — everyone fits inside one wooden rowboat.';
          },
          sub: 'Two oars and one final fact between you and 1-of-1.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.92], [0.28, -0.46], [0.38, 0.08],
                  [0.32, 0.72], [0.22, 0.88], [0, 0.88]
                ],
                true
              )
            );
            g.contour(() => {
              g.line(-0.34, -0.06, -0.92, 0.22);
              g.line(0.34, -0.06, 0.92, 0.22);
            });
            g.inner(() => {
              g.line(-0.26, -0.34, 0.26, -0.34);
              g.line(-0.34, 0.08, 0.34, 0.08);
              g.line(-0.28, 0.52, 0.28, 0.52);
            });
          }
        },
        {
          id: 'diner_booth',
          label: 'Corner Diner Booth',
          headline(n) {
            return 'Just ' + n + ' of you left — everyone slides into a single corner diner booth.';
          },
          sub: 'Add one unmistakable truth to claim the whole booth yourself.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.56, 1.32, 0.14));
            g.contour(() => {
              g.rrect(0, -0.44, 1.24, 0.26, 0.08);
              g.rrect(0, 0, 1.12, 0.42, 0.06);
              g.rrect(0, 0.44, 1.24, 0.26, 0.08);
            });
          }
        }
      ]
    },
    {
      min: 2,
      tier: 4,
      items: [
        {
          id: 'park_bench',
          label: 'Park Bench for Two',
          headline(n) {
            return n === 2
              ? 'Just you and ONE statistical twin sharing a single park bench.'
              : 'Down to ' + n + ' of you across 8.3 billion — crowded onto one park bench.';
          },
          sub: 'One final truth makes it unmistakably you.',
          draw(g) {
            g.wash(() => g.rrect(0, 0, 1.54, 0.78, 0.12));
            g.contour(() => {
              g.rrect(0, -0.26, 1.42, 0.16, 0.05);
              g.rrect(-0.74, 0.02, 0.10, 0.64, 0.04);
              g.rrect(0.74, 0.02, 0.10, 0.64, 0.04);
            });
            g.inner(() => {
              g.line(-0.66, 0.02, 0.66, 0.02);
              g.line(-0.66, 0.18, 0.66, 0.18);
            });
          }
        },
        {
          id: 'bistro_for_two',
          label: 'Sidewalk Bistro Table',
          headline(n) {
            return n === 2
              ? 'Just you and one statistical double across a tiny sidewalk bistro table.'
              : 'Down to ' + n + ' of you gathered around a tiny sidewalk bistro table.';
          },
          sub: 'One last fact settles the check.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.52));
            g.contour(() => {
              g.arc(-0.56, 0, 0.24, Math.PI * 0.55, Math.PI * 1.45);
              g.arc(0.56, 0, 0.24, -Math.PI * 0.45, Math.PI * 0.45);
            });
            g.inner(() => {
              g.circle(-0.24, 0, 0.08);
              g.circle(0.24, 0, 0.08);
            });
          }
        },
        {
          id: 'tandem_canoe',
          label: 'Tandem Canoe',
          headline(n) {
            return n === 2
              ? 'Just you and one statistical twin paddling a tandem canoe.'
              : 'Down to ' + n + ' of you balanced inside a single canoe.';
          },
          sub: 'One more truth makes you 1-of-1.',
          draw(g) {
            g.wash(() =>
              g.sym(
                [
                  [0, -0.94], [0.26, -0.44], [0.34, 0],
                  [0.26, 0.44], [0, 0.94]
                ],
                true
              )
            );
            g.contour(() => {
              g.line(-0.22, -0.24, -0.78, 0.04);
              g.ellipse(-0.82, 0.06, 0.10, 0.045, -0.46);
              g.line(0.22, 0.20, 0.78, 0.48);
              g.ellipse(0.82, 0.50, 0.10, 0.045, 0.46);
            });
            g.inner(() => {
              g.line(-0.24, -0.36, 0.24, -0.36);
              g.line(-0.32, 0, 0.32, 0);
              g.line(-0.24, 0.36, 0.24, 0.36);
            });
          }
        }
      ]
    },

    // --- TIER 5 · SINGULAR (1 · One-of-One) ---
    {
      min: 1,
      tier: 5,
      items: [
        {
          id: 'museum_plinth',
          label: 'Specimen Plinth',
          headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
          sub: 'Standing solo on the specimen plinth — verified One-of-One.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.84), true);
            g.inner(() => {
              g.circle(0, 0, 0.68);
              g.spokes(0.68, 0.80, 36);
            });
            g.accent(() => g.spokes(0.62, 0.90, 4));
          }
        },
        {
          id: 'spotlight_iris',
          label: 'Center Stage Spotlight',
          headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
          sub: 'Center stage in a solo spotlight — verified One-of-One.',
          draw(g) {
            g.wash(() => g.circle(0, 0, 0.82), true);
            g.inner(() => {
              g.poly(
                [
                  [0, -0.76], [0.54, -0.54], [0.76, 0], [0.54, 0.54],
                  [0, 0.76], [-0.54, 0.54], [-0.76, 0], [-0.54, -0.54]
                ],
                true
              );
            });
          }
        },
        {
          id: 'zenith_aperture',
          label: 'Observatory Zenith',
          headline: 'Population: 1. Nobody else on Earth shares this exact combination.',
          sub: 'Centered in the observatory zenith — verified One-of-One.',
          draw(g) {
            g.wash(() => g.superEllipse(0.82, 0.82, 3.2), true);
            g.accent(() => {
              g.circle(0, 0, 0.64);
              g.spokes(0.64, 0.88, 8, 0.39);
            });
          }
        }
      ]
    }
  ];

  // Flatten catalog for quick ID lookup & test inspection
  const ALL_OUTLINES = [];
  for (let bIdx = 0; bIdx < BANDS.length; bIdx++) {
    const band = BANDS[bIdx];
    for (let i = 0; i < band.items.length; i++) {
      const item = band.items[i];
      item.bandIndex = bIdx;
      item.bandSize = band.items.length;
      item.minPop = band.min;
      item.tier = band.tier;
      ALL_OUTLINES.push(item);
    }
  }

  function findBand(population, isOneOfOne) {
    if (isOneOfOne || population <= 1) {
      return BANDS[BANDS.length - 1];
    }
    const pop = Math.max(2, Math.round(Number(population) || 8300000000));
    for (let i = 0; i < BANDS.length - 1; i++) {
      if (pop >= BANDS[i].min) {
        return BANDS[i];
      }
    }
    return BANDS[BANDS.length - 2];
  }

  /**
   * Resolves a perspective outline for `(population, isOneOfOne)`, rotating smoothly
   * across sibling outlines in the band so consecutive steps or replays never repeat.
   */
  function resolveOutline(population, isOneOfOne, opts) {
    const o = opts || {};
    const band = findBand(population, isOneOfOne);
    const items = band.items;
    const len = items.length;
    if (len === 1) return items[0];

    const runSeed = Math.max(0, Number(o.runSeed) || 0);
    const stepCount = Math.max(0, Number(o.stepCount) || 0);
    const cycleOffset = Math.max(0, Number(o.cycleOffset) || 0);

    let idx =
      stepCount === 0 && cycleOffset === 0 && band.min >= 8000000000
        ? runSeed % len
        : (runSeed * 3 + stepCount + cycleOffset) % len;

    if (o.avoidId && len > 1 && items[idx].id === o.avoidId) {
      idx = (idx + 1) % len;
    }

    return items[idx];
  }

  /**
   * Returns the 1-to-1 matched `{ headline, sub }` for `outline` at `population`.
   */
  function getCopyForOutline(outline, population) {
    if (!outline) {
      return { headline: '', sub: '' };
    }
    const pop = Math.max(1, Math.round(Number(population) || 1));
    const headline =
      typeof outline.headline === 'function' ? outline.headline(pop) : outline.headline || '';
    const sub = typeof outline.sub === 'function' ? outline.sub(pop) : outline.sub || '';
    return { headline, sub };
  }

  /**
   * Renders an outline centered at `(cx, cy)` with pixel radius `S` and opacity `alpha`.
   */
  function drawOutline(ctx, outline, cx, cy, S, alpha) {
    if (!ctx || !outline || typeof outline.draw !== 'function' || alpha <= 0.005) return;
    const pen = createBlueprintPen(ctx, cx, cy, S, alpha);
    outline.draw(pen);
  }

  return {
    BANDS,
    ALL_OUTLINES,
    findBand,
    resolveOutline,
    getCopyForOutline,
    drawOutline
  };
});
