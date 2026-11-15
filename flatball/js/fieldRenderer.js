// High-DPI 2D Canvas Renderer for Flatball Tactics
// Renders regulation 7v7 Ultimate field with HOME / AWAY sidelines, Force Shields & Arrows, Scout Cues, Player Dots, and 2.5D Disc.

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
    if (typeof ResizeObserver !== 'undefined' && this.canvas.parentElement) {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(this.canvas.parentElement);
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: 380, height: 520 };
    const w = Math.max(220, Math.floor(rect.width || 380));
    const h = Math.max(180, Math.floor(rect.height || 520));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);

    const padY = Math.max(8, Math.floor(h * 0.025));
    const availH = Math.max(160, h - padY * 2);
    const idealW = Math.min(w - 34, availH * 0.6);
    const fieldW = Math.max(165, Math.floor(idealW));
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

  worldToPx(wx, wy) {
    const { fieldX, fieldY, fieldW, fieldH } = this.metrics;
    const nx = (wx + 20) / 40;
    const ny = (110 - wy) / 110;
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
    this.drawWindStreaks(ctx, choreo);
    this.drawSidelineLabels(ctx, choreo);
    this.drawTacticalOverlays(ctx, choreo);
    this.drawLiveStrategyPreview(ctx, choreo);
    this.drawShockwavesAndParticles(ctx, choreo);
    this.drawPlayers(ctx, choreo);
    this.drawDisc(ctx, choreo);

    ctx.restore();
  }

  /**
   * Renders live animated wind streaks drifting across the field turf when Wind is Breezy or Stiff!
   */
  drawWindStreaks(ctx, choreo) {
    if (!choreo.wind || choreo.wind.strength === 'calm' || !choreo.windWisps || choreo.windWisps.length === 0) {
      return;
    }

    const { fieldX, fieldY, fieldW, fieldH } = this.metrics;
    const isStiff = choreo.wind.strength === 'stiff';
    const dx = choreo.wind.dx;
    const dy = choreo.wind.dy;

    ctx.save();
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, 12);
    ctx.clip();
    ctx.lineCap = 'round';

    for (const w of choreo.windWisps) {
      const head = this.worldToPx(w.x + dx * w.len * 0.5, w.y + dy * w.len * 0.5);
      const tail = this.worldToPx(w.x - dx * w.len * 0.5, w.y - dy * w.len * 0.5);

      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      const rgb = isStiff ? '186, 230, 253' : '226, 232, 240';
      grad.addColorStop(0, `rgba(${rgb}, 0)`);
      grad.addColorStop(0.65, `rgba(${rgb}, ${w.alpha * 0.85})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${Math.min(0.62, w.alpha * 1.35)})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = isStiff ? 2.1 : 1.4;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.stroke();

      if (isStiff) {
        const ang = Math.atan2(head.y - tail.y, head.x - tail.x);
        ctx.fillStyle = `rgba(224, 242, 254, ${w.alpha * 1.1})`;
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        ctx.lineTo(head.x - 4.2 * Math.cos(ang - 0.52), head.y - 4.2 * Math.sin(ang - 0.52));
        ctx.lineTo(head.x - 4.2 * Math.cos(ang + 0.52), head.y - 4.2 * Math.sin(ang + 0.52));
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawFieldTurf(ctx) {
    const { fieldX, fieldY, fieldW, fieldH } = this.metrics;
    const r = 12;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, r);
    ctx.fillStyle = '#134E38';
    ctx.fill();
    ctx.restore();

    ctx.save();
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, r);
    ctx.clip();

    const bandH = fieldH / 11;
    for (let i = 0; i < 11; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#14533B' : '#175E43';
      ctx.fillRect(fieldX, fieldY + i * bandH, fieldW, bandH + 0.5);
    }

    const ezH = this.yardsToPxY(20);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.fillRect(fieldX, fieldY, fieldW, ezH);

    ctx.fillStyle = 'rgba(255, 82, 104, 0.07)';
    ctx.fillRect(fieldX, fieldY + fieldH - ezH, fieldW, ezH);

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

    const fontSize = Math.max(10, Math.min(14, Math.floor(fieldW * 0.042)));
    ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(125, 249, 255, 0.34)';
    ctx.fillText('▲  ATTACK / SCORE ZONE  ▲', fieldX + fieldW * 0.5, fieldY + ezH * 0.5);

    ctx.fillStyle = 'rgba(255, 148, 162, 0.32)';
    ctx.fillText('▼  YOUR DEFEND ZONE  ▼', fieldX + fieldW * 0.5, fieldY + fieldH - ezH * 0.5);

    const midPx = this.worldToPx(0, 55);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(fieldX, midPx.y);
    ctx.lineTo(fieldX + fieldW, midPx.y);
    ctx.stroke();
    ctx.setLineDash([]);

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

    ctx.fillStyle = 'rgba(255, 255, 255, 0.26)';
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

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.lineWidth = 2.2;
    this.roundRect(ctx, fieldX, fieldY, fieldW, fieldH, r);
    ctx.stroke();

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

  /**
   * Renders crisp HOME (Left Sideline) & AWAY (Right Sideline) markers, highlighting whichever side is currently Forced!
   */
  drawSidelineLabels(ctx, choreo) {
    const { fieldX, fieldY, fieldW, fieldH } = this.metrics;
    const vc = choreo.visualContext;
    const onOffenseRead =
      vc &&
      vc.offenseTeam === 'player' &&
      vc.scoutShape &&
      vc.scoutShape !== 'bot_force_mid' &&
      vc.forceType !== 'cup';
    const homeForced = onOffenseRead && vc.forceSide === 'home';
    const awayForced = onOffenseRead && vc.forceSide === 'away';

    ctx.save();
    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Left Sideline: HOME
    ctx.save();
    ctx.translate(fieldX - 9, fieldY + fieldH * 0.5);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = homeForced ? '#FBBF24' : 'rgba(148, 163, 184, 0.58)';
    ctx.fillText(homeForced ? '◀ FORCE HOME ◀' : 'HOME SIDELINE', 0, 0);
    ctx.restore();

    // Right Sideline: AWAY
    ctx.save();
    ctx.translate(fieldX + fieldW + 9, fieldY + fieldH * 0.5);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = awayForced ? '#FBBF24' : 'rgba(148, 163, 184, 0.58)';
    ctx.fillText(awayForced ? '▶ FORCE AWAY ▶' : 'AWAY SIDELINE', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  drawTacticalOverlays(ctx, choreo) {
    const vc = choreo.visualContext;
    if (!vc) return;

    // 1. Physical Force Shield / Cup Wall + Force Home/Away Arrow around the thrower
    if (!choreo.disc.inFlight && choreo.disc.holderTeam) {
      const holderArr = choreo.disc.holderTeam === 'player' ? choreo.playerDots : choreo.botDots;
      const defArr = choreo.disc.holderTeam === 'player' ? choreo.botDots : choreo.playerDots;
      const holder = holderArr[choreo.disc.holderIdx];
      if (holder) {
        const hp = this.worldToPx(holder.x, holder.y);
        const shieldColor = choreo.disc.holderTeam === 'player'
          ? 'rgba(255, 82, 104, 0.8)'
          : 'rgba(0, 229, 255, 0.75)';

        if (vc.forceType === 'cup') {
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
            ctx.arc(hp.x, hp.y, arcR, ang - 0.68, ang + 0.68);
            ctx.stroke();
            ctx.restore();
          }
        }

        // When Player is on Offense (non-Cup), draw a Force Vector Arrow showing Force HOME (◀), AWAY (▶), or MIDDLE!
        if (choreo.disc.holderTeam === 'player' && vc.scoutShape && vc.forceType !== 'cup') {
          const fDir = vc.scoutShape === 'bot_force_mid'
            ? (holder.x <= 0 ? 1 : -1)
            : (vc.forceSide === 'home' ? -1 : 1);
          const targetWorldX = vc.scoutShape === 'bot_force_mid'
            ? holder.x * 0.25 + fDir * 4.2
            : holder.x + fDir * 6.2;
          const arrowEnd = this.worldToPx(
            Math.max(-18.5, Math.min(18.5, targetWorldX)),
            Math.min(106, holder.y + 3.4)
          );
          ctx.save();
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.78)';
          ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(hp.x + fDir * 10, hp.y - 3);
          ctx.lineTo(arrowEnd.x, arrowEnd.y);
          ctx.stroke();

          const aAng = Math.atan2(arrowEnd.y - (hp.y - 3), arrowEnd.x - (hp.x + fDir * 10));
          ctx.beginPath();
          ctx.moveTo(arrowEnd.x, arrowEnd.y);
          ctx.lineTo(arrowEnd.x - 7 * Math.cos(aAng - 0.5), arrowEnd.y - 7 * Math.sin(aAng - 0.5));
          ctx.lineTo(arrowEnd.x - 7 * Math.cos(aAng + 0.5), arrowEnd.y - 7 * Math.sin(aAng + 0.5));
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // 2. Optional Scout Chalkboard Cues (when Scout: ON)
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
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.55 + pulse * 0.3})`;
      ctx.fillStyle = 'rgba(255, 82, 104, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(sag.x, sag.y, this.yardsToPxX(5.2) + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (vc.scoutShape === 'bot_wall') {
      // Connect the 3-across midfield Wall (W1-W2-W3 at indices 2, 3, 4) + 2 deep safeties (5, 6)
      const w1 = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const w3 = this.worldToPx(choreo.botDots[4].x, choreo.botDots[4].y);
      const d1 = this.worldToPx(choreo.botDots[5].x, choreo.botDots[5].y);
      const d2 = this.worldToPx(choreo.botDots[6].x, choreo.botDots[6].y);
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.52 + pulse * 0.25})`;
      ctx.lineWidth = 2.6;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(w1.x, w1.y);
      ctx.lineTo(w3.x, w3.y);
      ctx.moveTo(d1.x, d1.y);
      ctx.lineTo(d2.x, d2.y);
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
    } else if (vc.scoutShape === 'split_stacks') {
      const s1a = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const s1b = this.worldToPx(choreo.botDots[3].x, choreo.botDots[3].y);
      const s2a = this.worldToPx(choreo.botDots[4].x, choreo.botDots[4].y);
      const s2b = this.worldToPx(choreo.botDots[6].x, choreo.botDots[6].y);
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.46 + pulse * 0.24})`;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(s1a.x, s1a.y - 6);
      ctx.lineTo(s1b.x, s1b.y + 6);
      ctx.moveTo(s2a.x, s2a.y - 6);
      ctx.lineTo(s2b.x, s2b.y + 6);
      ctx.stroke();
    } else if (vc.scoutShape === 'hex_grid') {
      const hub = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const ring = [0, 3, 5, 6, 4].map((i) => this.worldToPx(choreo.botDots[i].x, choreo.botDots[i].y));
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.4 + pulse * 0.22})`;
      ctx.lineWidth = 1.9;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(ring[0].x, ring[0].y);
      for (let i = 1; i < ring.length; i++) ctx.lineTo(ring[i].x, ring[i].y);
      ctx.closePath();
      for (const p of ring) {
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    } else if (vc.scoutShape === 'star_hub') {
      const ace = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const h1 = this.worldToPx(choreo.botDots[0].x, choreo.botDots[0].y);
      const h2 = this.worldToPx(choreo.botDots[1].x, choreo.botDots[1].y);
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.52 + pulse * 0.3})`;
      ctx.fillStyle = 'rgba(255, 214, 102, 0.09)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(ace.x, ace.y, this.yardsToPxX(4.2) + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(h1.x, h1.y);
      ctx.lineTo(ace.x, ace.y);
      ctx.lineTo(h2.x, h2.y);
      ctx.stroke();
    } else if (vc.scoutShape === 'spread_322') {
      const h1 = this.worldToPx(choreo.botDots[0].x, choreo.botDots[0].y);
      const h2 = this.worldToPx(choreo.botDots[1].x, choreo.botDots[1].y);
      const h3 = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const p1 = this.worldToPx(choreo.botDots[3].x, choreo.botDots[3].y);
      const p2 = this.worldToPx(choreo.botDots[4].x, choreo.botDots[4].y);
      const w1 = this.worldToPx(choreo.botDots[5].x, choreo.botDots[5].y);
      const w2 = this.worldToPx(choreo.botDots[6].x, choreo.botDots[6].y);
      ctx.strokeStyle = `rgba(255, 214, 102, ${0.46 + pulse * 0.24})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(h2.x, h2.y);
      ctx.lineTo(h1.x, h1.y);
      ctx.lineTo(h3.x, h3.y);
      ctx.moveTo(w1.x, w1.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(w2.x, w2.y);
      ctx.stroke();
    } else if (vc.scoutShape === 'bot_man_trap') {
      // Highlight the narrow trapped sideline danger zone in subtle coral
      const sideX = vc.forceSide === 'home' ? -19.5 : 13.5;
      const tl = this.worldToPx(sideX, Math.min(104, vc.discAnchorY + 24));
      const br = this.worldToPx(sideX + 6, Math.max(20, vc.discAnchorY - 2));
      ctx.fillStyle = `rgba(255, 82, 104, ${0.08 + pulse * 0.06})`;
      ctx.strokeStyle = `rgba(255, 82, 104, ${0.42 + pulse * 0.2})`;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 4]);
      ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
      ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    } else if (vc.scoutShape === 'bot_force_mid') {
      const mid = this.worldToPx(choreo.botDots[4].x, choreo.botDots[4].y);
      const lWing = this.worldToPx(-14, Math.min(104, vc.discAnchorY + 8));
      const rWing = this.worldToPx(14, Math.min(104, vc.discAnchorY + 8));
      const cTgt = this.worldToPx(0, Math.min(105, vc.discAnchorY + 18));
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.5 + pulse * 0.25})`;
      ctx.fillStyle = 'rgba(255, 82, 104, 0.09)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(mid.x, mid.y, this.yardsToPxX(4.0) + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lWing.x, lWing.y);
      ctx.lineTo(cTgt.x, cTgt.y);
      ctx.lineTo(rWing.x, rWing.y);
      ctx.stroke();
    } else if (vc.scoutShape === 'bot_under_press') {
      const pressPts = [2, 3, 4, 5, 6]
        .map((i) => this.worldToPx(choreo.botDots[i].x, choreo.botDots[i].y))
        .sort((a, b) => a.x - b.x);
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.54 + pulse * 0.26})`;
      ctx.lineWidth = 2.4;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(pressPts[0].x, pressPts[0].y);
      for (let i = 1; i < pressPts.length; i++) ctx.lineTo(pressPts[i].x, pressPts[i].y);
      ctx.stroke();
    } else if (vc.scoutShape === 'bot_box1') {
      const b1 = this.worldToPx(choreo.botDots[2].x, choreo.botDots[2].y);
      const b2 = this.worldToPx(choreo.botDots[3].x, choreo.botDots[3].y);
      const b3 = this.worldToPx(choreo.botDots[4].x, choreo.botDots[4].y);
      const b4 = this.worldToPx(choreo.botDots[5].x, choreo.botDots[5].y);
      const ch1 = this.worldToPx(choreo.botDots[1].x, choreo.botDots[1].y);
      ctx.strokeStyle = `rgba(255, 92, 114, ${0.52 + pulse * 0.25})`;
      ctx.fillStyle = 'rgba(255, 82, 104, 0.06)';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(b4.x, b4.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ch1.x, ch1.y, this.yardsToPxX(3.0) + pulse * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws smooth glide vectors as circles drift into a selected strategy + tactical structure cues for the chosen setup!
   */
  drawLiveStrategyPreview(ctx, choreo) {
    const vc = choreo.visualContext;
    if (!vc || !vc.playerPreviewId) return;

    const previewId = vc.playerPreviewId;
    const isOffense = vc.offenseTeam === 'player';
    const accentRgb = isOffense ? '52, 211, 153' : '0, 229, 255';
    const pulse = 0.5 + 0.5 * Math.sin(choreo.idleClock * 5.2);

    ctx.save();

    // 1. Subtle glide trails & destination rings that smoothly fade out as each circle settles onto its spot
    if (choreo.driftState && choreo.driftState.active && choreo.driftState.playerTargets) {
      choreo.driftState.playerTargets.forEach((tgt, idx) => {
        const dot = choreo.playerDots[idx];
        if (!dot || !tgt) return;
        const dist = Math.hypot(tgt.x - dot.x, tgt.y - dot.y);
        if (dist > 0.22) {
          const alpha = Math.min(0.62, dist * 0.08);
          const fromPx = this.worldToPx(dot.x, dot.y);
          const toPx = this.worldToPx(tgt.x, tgt.y);

          ctx.strokeStyle = `rgba(${accentRgb}, ${alpha * 0.85})`;
          ctx.lineWidth = 1.6;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(fromPx.x, fromPx.y);
          ctx.lineTo(toPx.x, toPx.y);
          ctx.stroke();

          ctx.setLineDash([]);
          ctx.fillStyle = `rgba(${accentRgb}, ${alpha * 0.22})`;
          ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(toPx.x, toPx.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });
    }

    // 2. Tactical shape overlay for the player's selected Defensive or Offensive setup
    if (!isOffense) {
      if (previewId === 'clam_bracket') {
        const u1 = this.worldToPx(choreo.playerDots[2].x, choreo.playerDots[2].y);
        const u2 = this.worldToPx(choreo.playerDots[3].x, choreo.playerDots[3].y);
        const u3 = this.worldToPx(choreo.playerDots[4].x, choreo.playerDots[4].y);
        const b1 = this.worldToPx(choreo.playerDots[5].x, choreo.playerDots[5].y);
        const b2 = this.worldToPx(choreo.playerDots[6].x, choreo.playerDots[6].y);

        ctx.strokeStyle = `rgba(0, 229, 255, ${0.42 + pulse * 0.22})`;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(u1.x, u1.y);
        ctx.lineTo(u2.x, u2.y);
        ctx.lineTo(u3.x, u3.y);
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.stroke();
      } else if (previewId === 'deep_poach') {
        const sag = this.worldToPx(choreo.playerDots[6].x, choreo.playerDots[6].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.48 + pulse * 0.28})`;
        ctx.fillStyle = 'rgba(0, 229, 255, 0.09)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(sag.x, sag.y, this.yardsToPxX(4.8) + pulse * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (previewId === 'shutdown_reset') {
        const m = this.worldToPx(choreo.playerDots[0].x, choreo.playerDots[0].y);
        const blz = this.worldToPx(choreo.playerDots[1].x, choreo.playerDots[1].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.55 + pulse * 0.28})`;
        ctx.lineWidth = 2.6;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(blz.x, blz.y);
        ctx.stroke();
      } else if (previewId === 'sideline_trap') {
        const trapLeft = vc.openSign === 1;
        const sideX = trapLeft ? -19.5 : 13.8;
        const tl = this.worldToPx(sideX, Math.min(104, vc.discAnchorY + 3));
        const br = this.worldToPx(sideX + 5.7, Math.max(20, vc.discAnchorY - 22));
        ctx.fillStyle = `rgba(0, 229, 255, ${0.07 + pulse * 0.05})`;
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.38 + pulse * 0.2})`;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5, 4]);
        ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
      } else if (previewId === 'wall_zone') {
        const w1 = this.worldToPx(choreo.playerDots[2].x, choreo.playerDots[2].y);
        const w3 = this.worldToPx(choreo.playerDots[4].x, choreo.playerDots[4].y);
        const d1 = this.worldToPx(choreo.playerDots[5].x, choreo.playerDots[5].y);
        const d2 = this.worldToPx(choreo.playerDots[6].x, choreo.playerDots[6].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.46 + pulse * 0.24})`;
        ctx.lineWidth = 2.4;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(w1.x, w1.y);
        ctx.lineTo(w3.x, w3.y);
        ctx.moveTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.stroke();
      } else if (previewId === 'box_and_one') {
        const b1 = this.worldToPx(choreo.playerDots[2].x, choreo.playerDots[2].y);
        const b2 = this.worldToPx(choreo.playerDots[3].x, choreo.playerDots[3].y);
        const b3 = this.worldToPx(choreo.playerDots[4].x, choreo.playerDots[4].y);
        const b4 = this.worldToPx(choreo.playerDots[5].x, choreo.playerDots[5].y);
        const ch1 = this.worldToPx(choreo.playerDots[1].x, choreo.playerDots[1].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.48 + pulse * 0.24})`;
        ctx.fillStyle = 'rgba(0, 229, 255, 0.06)';
        ctx.lineWidth = 2.1;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b4.x, b4.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ch1.x, ch1.y, this.yardsToPxX(3.0) + pulse * 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (previewId === 'force_middle') {
        const mid = this.worldToPx(choreo.playerDots[4].x, choreo.playerDots[4].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.46 + pulse * 0.25})`;
        ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(mid.x, mid.y, this.yardsToPxX(4.2) + pulse * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // On Offense: draw a clean, subtle tactical link from handler H1 to the primary active target(s)
      const h1 = this.worldToPx(choreo.playerDots[0].x, choreo.playerDots[0].y);
      ctx.strokeStyle = `rgba(52, 211, 153, ${0.36 + pulse * 0.2})`;
      ctx.lineWidth = 1.9;
      ctx.setLineDash([5, 5]);
      choreo.playerDots.forEach((d, idx) => {
        if (idx > 0 && d.highlight) {
          const tp = this.worldToPx(d.x, d.y);
          ctx.beginPath();
          ctx.moveTo(h1.x, h1.y);
          ctx.lineTo(tp.x, tp.y);
          ctx.stroke();
        }
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

    choreo.botDots.forEach((d, idx) => {
      const isHolder = !choreo.disc.inFlight && !choreo.disc.dropped && choreo.disc.holderTeam === 'bot' && choreo.disc.holderIdx === idx;
      this.drawSingleDot(ctx, d, dotRadius, '#FF5A6E', '#C81E3A', isHolder, choreo);
    });

    choreo.playerDots.forEach((d, idx) => {
      const isHolder = !choreo.disc.inFlight && !choreo.disc.dropped && choreo.disc.holderTeam === 'player' && choreo.disc.holderIdx === idx;
      this.drawSingleDot(ctx, d, dotRadius, '#00E5FF', '#0284C7', isHolder, choreo);
    });
  }

  drawSingleDot(ctx, dot, radius, topColor, botColor, isHolder, choreo) {
    const p = this.worldToPx(dot.x, dot.y);

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

    if (dot.lungeTimer > 0) {
      ctx.rotate(dot.lungeAngle);
      ctx.scale(1.42, 0.78);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.arc(0, 3, radius, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createLinearGradient(0, -radius, 0, radius);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isHolder ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = isHolder ? 2.6 : 1.9;
    ctx.stroke();

    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    const fontPx = dot.role && dot.role.length > 2 ? Math.max(7.2, radius * 0.6) : Math.max(8.2, radius * 0.74);
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
    const zLift = disc.z * 18;
    const r = baseR * (1 + disc.z * 0.48);

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${0.38 - disc.z * 0.16})`;
    ctx.beginPath();
    ctx.arc(pos.x + disc.z * 9, pos.y + 3 + disc.z * 6, r * 0.92, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const dy = pos.y - zLift;
    ctx.save();
    ctx.fillStyle = disc.dropped ? '#E2E8F0' : '#FFFFFF';
    ctx.beginPath();
    ctx.arc(pos.x, dy, r, 0, Math.PI * 2);
    ctx.fill();

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
