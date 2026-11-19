/**
 * The 8.3 Billionth — Multi-Scale Architectural & Cartographic Perspective Outlines
 *
 * Provides 79 minimalist blueprint outlines across 26 logarithmic population bands
 * (8.3B down to 1 across all 5 Tiers). Rendered directly beneath the circular Vogel
 * population dots so users keep the clean circular dot pattern while gaining immediate
 * physical scale perspective — with multiple outlines per band so runs never feel repetitive.
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
  // 79 CURATED ARCHITECTURAL, CARTOGRAPHIC & VESSEL PERSPECTIVE OUTLINES
  // Ordered high-to-low across 26 logarithmic size bands (Tiers 1..5)
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
          capacity: '8.3B Planet',
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
            // Subtle orbital arc ("and a few in space")
            g.accent(() => {
              g.arc(0, 0, 1.03, -0.82, -0.24);
              g.circle(Math.cos(-0.53) * 1.03, Math.sin(-0.53) * 1.03, 0.018);
            });
          }
        },
        {
          id: 'twin_hemispheres',
          label: 'Twin World Hemispheres',
          capacity: '8.3B Map Plate',
          draw(g) {
            g.wash(() => {
              g.circle(-0.46, 0, 0.52);
              g.circle(0.46, 0, 0.52);
            });
            g.inner(() => {
              g.line(-0.98, 0, 0.98, 0);
              g.ellipse(-0.46, 0, 0.27, 0.52);
              g.ellipse(0.46, 0, 0.27, 0.52);
              g.ellipse(0, 0, 0.96, 0.86);
            }, true);
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
          capacity: '~5.5B Landmass',
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
          capacity: '~4.6B Basin',
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
          label: 'Polar World Projection',
          capacity: 'Half Humanity',
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
          capacity: '~1.45B Region',
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
          capacity: '~1.4B Basin',
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
          label: 'Continental Shield',
          capacity: '~1.5B Continent',
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
          label: 'Continental Peninsula',
          capacity: '~750M Continent',
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
          label: 'Continental Cordillera',
          capacity: '~900M Hemisphere',
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
          label: 'Maritime Sea Basin',
          capacity: '~700M Region',
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
          label: 'Coast-to-Coast Nation',
          capacity: '~340M Nation',
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
          label: '17,000-Island Chain',
          capacity: '~280M Islands',
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
          label: 'Great Plains & Coasts',
          capacity: '~360M Heartland',
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
          label: 'Atlantic River Shield',
          capacity: '~215M Nation',
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
          label: 'Four-Island Archipelago',
          capacity: '~125M Islands',
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
          label: 'Bi-Oceanic Highlands',
          capacity: '~130M Nation',
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
          label: 'Mediterranean Peninsula',
          capacity: '~60M Nation',
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
          label: 'Coastal Peninsula',
          capacity: '~58M Peninsula',
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
          label: 'Nile Valley & Fan Delta',
          capacity: '~105M Corridor',
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
          label: 'Megacity Bay & Ringways',
          capacity: '~37M Metro',
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
          label: 'Harbor Estuary Metro',
          capacity: '~20M Metro',
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
          label: 'River-Bisected Megacity',
          capacity: '~25M Metro',
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
          label: 'Orbital Beltway City',
          capacity: '~9M Metropolis',
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
          label: 'North & South Islands',
          capacity: '~5.2M Nation',
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
          label: 'Alpine Valley Nation',
          capacity: '~8.8M Country',
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
          label: 'Manhattan Island Grid',
          capacity: '~1.6M Island',
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
          label: 'Ringed Boulevard City',
          capacity: '~2.1M City',
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
          label: 'Historic Ringed City',
          capacity: '~1.9M City',
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
          label: '7×7 Bay Peninsula',
          capacity: '~810K City',
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
          label: 'Concentric Canal Rings',
          capacity: '~880K City',
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
          label: 'Grand Canal Lagoon',
          capacity: '~550K Lagoon',
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
          capacity: '~300K Crowd',
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
          capacity: '~210K Crowd',
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
          label: 'Sub-Arctic Fjord Island',
          capacity: '~380K Island',
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
          capacity: '~90K Seats',
          draw(g) {
            g.wash(() => g.superEllipse(0.96, 0.80, 2.5));
            g.contour(() => g.superEllipse(0.68, 0.52, 2.6));
            // Signature stadium arch & pitch markings
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
          capacity: '~100K Bowl',
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
          capacity: '~75K Arena',
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
      min: 10000,
      tier: 2,
      items: [
        {
          id: 'baseball_ballpark',
          label: 'Baseball Ballpark',
          capacity: '~42K Seats',
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
          id: 'round_arena',
          label: 'Circular Indoor Arena',
          capacity: '~20K Arena',
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
          capacity: '~10K Rocks',
          draw(g) {
            g.wash(() =>
              g.poly(
                [
                  [-0.32, 0.78], [-0.78, -0.68], [0.78, -0.68], [0.32, 0.78]
                ],
                true
              )
            );
            // Twin flanking monolith rocks
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
          capacity: '~6,000 Guests',
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
            g.contour(() => g.rrect(0, -0.54, 0.94, 0.10, 0.03)); // Bridge wings
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
          capacity: '~5,300 Seats',
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
          label: 'Carrier Flight Deck',
          capacity: '~5,000 Crew',
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
          capacity: '~7,000 Hall',
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
          capacity: '~2,700 Seats',
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
          capacity: '~2,400 Nave',
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
          label: 'Campus Quadrangle',
          capacity: '~2,000 Students',
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
          capacity: '~1,100 Seats',
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
            // Stage apron + balcony arcs
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
          capacity: '~1,400 Seats',
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
          capacity: '~1,000 Tent',
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
          capacity: '~416 Seats',
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
            // 4 underwing jet nacelles
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
          capacity: '~500 Deck',
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
          capacity: '~380 Desks',
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
          capacity: '~320 Seats',
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
          capacity: '~180 Guests',
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
          capacity: '~160 Seats',
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
          capacity: '~175 Seats',
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
          capacity: '~85 Riders',
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
          capacity: '~90 Seats',
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
          capacity: '~65 Patrons',
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
          capacity: '~48 Seats',
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
            // West-coast side mirrors + windshield
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
          capacity: '~32 Desks',
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
          capacity: '~40 On Deck',
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
              // Mainsail & foresail boom arcs
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
          capacity: '~18 Riders',
          draw(g) {
            g.inner(() => g.rrect(0, 0, 1.64, 1.64, 0.06), true);
            g.wash(() => g.rrect(0, 0, 1.38, 1.38, 0.06));
            // Sliding double doors + side guide rails
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
          capacity: '~18 Chairs',
          draw(g) {
            g.inner(() => g.rrect(0, 0, 1.76, 1.36, 0.10));
            g.wash(() => g.superEllipse(0.66, 0.38, 2.4));
            g.contour(() => g.chairs(0.66, 0.38, 14, 0.065, 0.07));
          }
        },
        {
          id: 'campfire_ring',
          label: 'Campfire Clearing',
          capacity: '~16 Campers',
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
          capacity: '~10 Guests',
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
          capacity: '~8 Crew',
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
          capacity: '~9 Friends',
          draw(g) {
            g.wash(() => g.rrect(0, 0.04, 1.56, 1.36, 0.08));
            g.contour(() => {
              // U-shaped sofa around rug
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
          capacity: '4–5 Riders',
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
            // Windshields + side mirrors
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
          capacity: '4–5 Crew',
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
            // Oars & thwarts
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
          capacity: '4–6 Booth',
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
          capacity: '2–3 Seats',
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
          capacity: '2–3 Seats',
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
          capacity: '2–3 Paddlers',
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
            // Twin canoe paddles + thwarts
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
          capacity: '1 of 1',
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
          capacity: '1 of 1',
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
          capacity: '1 of 1',
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

    // At 8.3B initial state (stepCount === 0, cycleOffset === 0), open on Earth Globe
    let idx =
      stepCount === 0 && cycleOffset === 0 && band.min >= 8000000000
        ? runSeed % len
        : (runSeed * 3 + stepCount + cycleOffset) % len;

    // Anti-repeat: if a trait was added/removed and we stayed in the same band, advance to sibling
    if (o.avoidId && len > 1 && items[idx].id === o.avoidId) {
      idx = (idx + 1) % len;
    }

    return items[idx];
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
    drawOutline
  };
});
