// High-DPI 2D Canvas Renderer for Flatball Tactics
// Renders regulation 7v7 Ultimate field, Scout Chalkboard cues, Force Shields, Player Dots, Stall Rings, and 2.5D Disc flight.

export class FieldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.scoutEnabled = true;

    this.metrics = {
      w: 400,
      h: 650,
      fieldX: 20,
      fieldY: 20,
      fieldW: 360,
      fieldH: 610
    };

    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = Math.max(260, Math.floor(rect.width));
    const h = Math.max(320, Math.floor(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    const padY = Math.max(12, Math.floor(h * 0.026));
    const availH = h - padY * 2;
    const idealW = Math.min(w - 24, availH * 0.6);
    const fieldW = Math.max(210, Math.floor(idealW));
    const fieldH = Math.floor(availH);

    this.metrics = {
      w,
      h,
      fieldX: Math.floor((w - fieldW) * 0.5),
      fieldY: padY,
      fieldW,
      fieldH
    };
  }

  // Converts world (x in [-20, 20], y in [0, 110]) to canvas CSS pixels
  worldToPx(wx, wy) {
    const { fieldX, fieldY, fieldW, fieldH } = this.metrics;
    const nx = (wx + 20) / 40; // 0..1 left to right
    const ny = (110 - wy) / 110; // y=110 at top (0), y=0 at bottom (1)
    return {
      x: fieldX + nx * fieldW,
      y: fieldY + ny * fieldH
    };
  }

  yardsToPxX(yds) {
    return (yds / 40) * this.metrics.fieldW;
  }

  yardsToPxY(yds) {
    return (yds / 110) * this.metrics.fieldH;
  }

  render(choreo) {
    const ctx = this.ctx;
    const { w, h } = this.metrics;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, w, h);

    this.drawFieldTurf(ctx);
    this.drawTacticalOverlays(ctx, choreo);
    this.drawGhostPreview(ctx, choreo);
    this.drawShockwavesAndParticles(ctx, choreo);
    this.drawPlayers(ctx, choreo);
    this.drawDisc(ctx, choreo);

    ctx.restore();
  }

  drawFieldTurf(ctx) {
    const { fieldX, fieldY, fieldW, fieldH } = this.metrics;
    const r = 12;

    // Soft stadium drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, r);
    ctx.fillStyle = '#134E38';
    ctx.fill();
    ctx.restore();

    // Clip inside rounded field boundary
    ctx.save();
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, r);
    ctx.clip();

    // Alternating 10-yard turf bands (11 bands total for 110 yards)
    const bandH = fieldH / 11;
    for (let i = 0; i < 11; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#14533B' : '#175E43';
      ctx.fillRect(fieldX, fieldY + i * bandH, fieldW, bandH + 0.5);
    }

    // Top End Zone (y = 90..110 -> top 20 yards): Player Attacking Score Zone
    const ezH = this.yardsToPxY(20);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.fillRect(fieldX, fieldY, fieldW, ezH);

    // Bottom End Zone (y = 0..20 -> bottom 20 yards): Player Defended Zone
    ctx.fillStyle = 'rgba(255, 82, 104, 0.07)';
    ctx.fillRect(fieldX, fieldY + fieldH - ezH, fieldW, ezH);

    // Subtle diagonal end-zone stripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 8;
    for (let sx = -fieldH; sx < fieldW + fieldH; sx += 26) {
      ctx.beginPath();
      ctx.moveTo(fieldX + sx, fieldY);
      ctx.lineTo(fieldX + sx - ezH, fieldY + ezH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(fieldX + sx, fieldY + fieldH - ezH);
      ctx.lineTo(fieldX + sx - ezH, fieldY + fieldH);
      ctx.stroke();
    }

    // End Zone Watermarks
    const fontSize = Math.max(10, Math.min(14, Math.floor(fieldW * 0.042)));
    ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(125, 249, 255, 0.34)';
    ctx.fillText('▲  ATTACK / SCORE ZONE  ▲', fieldX + fieldW * 0.5, fieldY + ezH * 0.5);

    ctx.fillStyle = 'rgba(255, 148, 162, 0.32)';
    ctx.fillText('▼  YOUR DEFEND ZONE  ▼', fieldX + fieldW * 0.5, fieldY + fieldH - ezH * 0.5);

    // Midfield Line (y = 55)
    const midPx = this.worldToPx(0, 55);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fieldX, midPx.y);
    ctx.lineTo(fieldX + fieldW, midPx.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Center Field Frisbee Circle Emblem
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(midPx.x, midPx.y, this.yardsToPxX(4.8), 0, Math.PI * 2);
    ctx.stroke();

    // Goal Lines (y = 90 and y = 20)
    const topGoal = this.worldToPx(0, 90).y;
    const botGoal = this.worldToPx(0, 20).y;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fieldX, topGoal);
    ctx.lineTo(fieldX + fieldW, topGoal);
    ctx.moveTo(fieldX, botGoal);
    ctx.lineTo(fieldX + fieldW, botGoal);
    ctx.stroke();

    // Yardage Hash Ticks & Labels along Sidelines (every 10 yards between goal lines)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.font = '700 9px "JetBrains Mono", monospace';
    const yardMarks = [
      { y: 30, label: '10' },
      { y: 40, label: '20' },
      { y: 55, label: '35' },
      { y: 70, label: '20' },
      { y: 80, label: '10' }
    ];
    for (const ym of yardMarks) {
      const py = this.worldToPx(0, ym.y).y;
      ctx.fillText(ym.label, fieldX + 12, py);
      ctx.fillText(ym.label, fieldX + fieldW - 12, py);
    }

    // Brick Marks (y = 70 and y = 40, x = 0)
    for (const by of [40, 70]) {
      const bp = this.worldToPx(0, by);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.6;
      const s = 4.5;
      ctx.beginPath();
      ctx.moveTo(bp.x - s, bp.y - s);
      ctx.lineTo(bp.x + s, bp.y + s);
      ctx.moveTo(bp.x + s, bp.y - s);
      ctx.lineTo(bp.x - s, bp.y + s);
      ctx.stroke();
    }

    ctx.restore();

    // Crisp outer field perimeter line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.lineWidth = 2.2;
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, r);
    ctx.stroke();

    // Corner Cones / Pylons
    const pylonCoords = [
      this.worldToPx(-20, 110),
      this.worldToPx(20, 110),
      this.worldToPx(-20, 90),
      this.worldToPx(20, 90),
      this.worldToPx(-20, 20),
      this.worldToPx(20, 20),
      this.worldToPx(-20, 0),
      this.worldToPx(20, 0)
    ];
    pylonCoords.forEach((p, idx) => {
      ctx.fillStyle = idx < 4 ? '#00E5FF' : '#FF7A45';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawTacticalOverlays(ctx, choreo) {
    const vc = choreo.visualContext;
    if (!vc) return;

    // 1. Always render physical defensive Force Shield / Cup Zone Wall around the thrower when disc is held
    if (!choreo.disc.inFlight && choreo.disc.holderTeam) {
      const holderArr = choreo.disc.holderTeam === 'player' ? choreo.playerDots : choreo.botDots;
      const defArr = choreo.disc.holderTeam === 'player' ? choreo.botDots : choreo.playerDots;
      const holder = holderArr[choreo.disc.holderIdx];
      if (holder) {
        const hp = this.worldToPx(holder.x, holder.y);
        const shieldColor = choreo.disc.holderTeam === 'player'
          ? 'rgba(255, 82, 104, 0.72)'
          : 'rgba(0, 229, 255, 0.72)';

        if (vc.forceType === 'cup') {
          // Connect the 3 cup defenders (indices 0, 1, 2) with a glowing tactical Cup shell arc!
          const c0 = this.worldToPx(defArr[0].x, defArr[0].y);
          const c1 = this.worldToPx(defArr[1].x, defArr[1].y);
          const c2 = this.worldToPx(defArr[2].x, defArr[2].y);
          ctx.save();
          ctx.strokeStyle = shieldColor;
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(c0.x, c0.y);
          ctx.quadraticCurveTo(c1.x, c1.y, c2.x, c2.y);
          ctx.stroke();
          ctx.restore();
        } else {
          // Draw directional Force Shield arc between marker (defArr[0]) and thrower
          const marker = defArr[0];
          if (marker) {
            const mp = this.worldToPx(marker.x, marker.y);
            const ang = Math.atan2(mp.y - hp.y, mp.x - hp.x);
            const arcR = Math.max(15, this.yardsToPxX(2.6));
            ctx.save();
            ctx.strokeStyle = shieldColor;
            ctx.lineWidth = 3.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(hp.x, hp.y, arcR, ang - 0.65, ang + 0.65);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // 2. Optional Scout Chalkboard Cues (when Scout Lens is ON during Read phase)
    if (!this.scoutEnabled || !vc.scoutShape) return;

    const pulse = 0.5 + 0.5 * Math.sin(choreo.idleClock * 4.2);
    ctx.save();

    if (vc.scoutShape === 'vert_spine') {
      const c1 = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const c5 = this.worldToPx(choreo.botDots[6].x, choreo.botDots[6].y);
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.42 + pulse * 0.2})`;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y - 8);
      ctx.lineTo(c5.x, c5.y + 8);
      ctx.stroke();
    } else if (vc.scoutShape === 'ho_line') {
      const pts = [3, 4, 5, 6].map((i) => this.worldToPx(choreo.botDots[i].x, choreo.botDots[i].y));
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.42 + pulse * 0.2})`;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    } else if (vc.scoutShape === 'iso_spotlight') {
      const iso = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.5 + pulse * 0.35})`;
      ctx.fillStyle = 'rgba(255, 214, 102, 0.08)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(iso.x, iso.y, this.yardsToPxX(4.4) + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (vc.scoutShape === 'handler_triangle') {
      const hPts = [0, 1, 3, 2].map((i) => this.worldToPx(choreo.botDots[i].x, choreo.botDots[i].y));
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.45 + pulse * 0.25})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hPts[0].x, hPts[0].y);
      hPts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();
    } else if (vc.scoutShape === 'redzone_box') {
      const tl = this.worldToPx(-16, 20);
      const br = this.worldToPx(16, 8);
      ctx.strokeStyle = `rgba(255, 120, 120, ${0.45 + pulse * 0.25})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    } else if (vc.scoutShape === 'bot_poach') {
      const sag = this.worldToPx(choreo.botDots[6].x, choreo.botDots[6].y);
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.5 + pulse * 0.3})`;
      ctx.fillStyle = 'rgba(255, 82, 104, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(sag.x, sag.y, this.yardsToPxX(5.2) + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (vc.scoutShape === 'bot_clam') {
      // Show 2 horizontal bracket walls (Under U1-U2-U3 & Deep B1-B2)
      const u1 = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const u3 = this.worldToPx(choreo.botDots[4].x, choreo.botDots[4].y);
      const b1 = this.worldToPx(choreo.botDots[5].x, choreo.botDots[5].y);
      const b2 = this.worldToPx(choreo.botDots[6].x, choreo.botDots[6].y);
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.48 + pulse * 0.25})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(u1.x, u1.y);
      ctx.lineTo(u3.x, u3.y);
      ctx.moveTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.stroke();
    } else if (vc.scoutShape === 'bot_blitz') {
      const m = this.worldToPx(choreo.botDots[0].x, choreo.botDots[0].y);
      const blz = this.worldToPx(choreo.botDots[1].x, choreo.botDots[1].y);
      ctx.strokeStyle = `rgba(255, 180, 80, ${0.6 + pulse * 0.3})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(blz.x, blz.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawGhostPreview(ctx, choreo) {
    const previewId = choreo.visualContext.ghostPreview;
    if (!previewId) return;

    const { discAnchorX, discAnchorY, openSign, offenseTeam } = choreo.visualContext;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
    ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);

    if (offenseTeam === 'bot') {
      // Previewing a Player Defensive Scheme
      const { botTargets } = choreo.computeBotOffenseSetup(discAnchorX, discAnchorY, 'vert_stack', previewId);
      const previewDots = choreo.computePlayerDefensePositions(
        discAnchorX,
        discAnchorY,
        openSign,
        choreo.botDots,
        previewId
      );
      previewDots.forEach((pt) => {
        const p = this.worldToPx(pt.x, pt.y);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      void botTargets;
    } else {
      // Previewing a Player Offensive Play
      const { playerTargets } = choreo.computeBotDefenseSetup(discAnchorX, discAnchorY, 'bot_force_flick', previewId);
      playerTargets.forEach((pt, idx) => {
        if (idx === 0) return;
        const p = this.worldToPx(pt.x, pt.y);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  drawShockwavesAndParticles(ctx, choreo) {
    for (const s of choreo.shockwaves) {
      const p = this.worldToPx(s.x, s.y);
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.yardsToPxX(s.r), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const pt of choreo.particles) {
      const p = this.worldToPx(pt.x, pt.y);
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawPlayers(ctx, choreo) {
    const dotRadius = Math.max(9.5, Math.min(13.5, this.metrics.fieldW * 0.033));

    // Draw Bot Dots (Coral Red)
    choreo.botDots.forEach((d, idx) => {
      const isHolder = !choreo.disc.inFlight && !choreo.disc.dropped && choreo.disc.holderTeam === 'bot' && choreo.disc.holderIdx === idx;
      this.drawSingleDot(ctx, d, dotRadius, '#FF5A6E', '#C81E3A', isHolder, choreo);
    });

    // Draw Player Dots (Electric Cyan)
    choreo.playerDots.forEach((d, idx) => {
      const isHolder = !choreo.disc.inFlight && !choreo.disc.dropped && choreo.disc.holderTeam === 'player' && choreo.disc.holderIdx === idx;
      this.drawSingleDot(ctx, d, dotRadius, '#00E5FF', '#0284C7', isHolder, choreo);
    });
  }

  drawSingleDot(ctx, dot, radius, topColor, botColor, isHolder, choreo) {
    const p = this.worldToPx(dot.x, dot.y);

    // Highlight pulse for ISO / SAG / BLZ key focal players
    if (dot.highlight) {
      const pulse = 0.5 + 0.5 * Math.sin(choreo.idleClock * 6);
      ctx.save();
      ctx.strokeStyle = `rgba(255, 230, 105, ${0.55 + pulse * 0.35})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 5 + pulse * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Active Stall Progress Ring around the thrower
    if (isHolder && choreo.stall.active) {
      const frac = Math.min(1, choreo.stall.value / 10);
      const stallColor = frac < 0.48 ? '#34D399' : frac < 0.75 ? '#FBBF24' : '#FB7185';
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 5.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = stallColor;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius + 5.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(p.x, p.y);

    // Layout dive stretch when making a horizontal layout block!
    if (dot.lungeTimer > 0) {
      ctx.rotate(dot.lungeAngle);
      ctx.scale(1.42, 0.78);
    }

    // Soft turf shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.arc(0, 3, radius, 0, Math.PI * 2);
    ctx.fill();

    // Gradient circle body
    const grad = ctx.createLinearGradient(0, -radius, 0, radius);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Crisp white rim
    ctx.strokeStyle = isHolder ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = isHolder ? 2.6 : 1.9;
    ctx.stroke();

    ctx.restore();

    // Role micro-label
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    const fontPx = dot.role && dot.role.length > 2 ? Math.max(7.5, radius * 0.62) : Math.max(8.5, radius * 0.76);
    ctx.font = `800 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 2;
    ctx.fillText(dot.role || '', p.x, p.y + 0.5);
    ctx.restore();
  }

  drawDisc(ctx, choreo) {
    const disc = choreo.disc;
    const baseR = Math.max(5.5, Math.min(7.5, this.metrics.fieldW * 0.018));

    // Tapered aerodynamic motion trail during flight
    if (disc.inFlight && disc.trail.length > 1) {
      for (let i = 1; i < disc.trail.length; i++) {
        const prev = this.worldToPx(disc.trail[i - 1].x, disc.trail[i - 1].y);
        const cur = this.worldToPx(disc.trail[i].x, disc.trail[i].y);
        const frac = i / disc.trail.length;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${frac * 0.48})`;
        ctx.lineWidth = baseR * 1.45 * frac;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y - disc.trail[i - 1].z * 16);
        ctx.lineTo(cur.x, cur.y - disc.trail[i].z * 16);
        ctx.stroke();
        ctx.restore();
      }
    }

    const pos = this.worldToPx(disc.x, disc.y);
    const zLift = disc.z * 18; // Visual upward lift for 2.5D altitude illusion
    const r = baseR * (1 + disc.z * 0.48);

    // Ground shadow (separates on high pulls & hucks!)
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.38 - disc.z * 0.16})`;
    ctx.beginPath();
    ctx.arc(pos.x + disc.z * 9, pos.y + 3 + disc.z * 6, r * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Main White 175g Frisbee Disc
    const dy = pos.y - zLift;
    ctx.save();
    ctx.fillStyle = disc.dropped ? '#E2E8F0' : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(pos.x, dy, r, 0, Math.PI * 2);
    ctx.fill();

    // Outer Flight Ring & Center Stamp
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(pos.x, dy, r * 0.52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
