/**
 * The 8.3 Billionth — One-of-One Specimen Dossier Modal, Text Receipt & 1080x1350 PNG Card Generator
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BillionthReceiptModal = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SHARE_URL = 'https://punfiction.io/the-8-billionth/';

  function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function truncateCanvasText(ctx, text, maxWidth) {
    const str = String(text || '');
    if (ctx.measureText(str).width <= maxWidth) return str;
    let lo = 0;
    let hi = str.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (ctx.measureText(str.slice(0, mid) + '…').width <= maxWidth) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return str.slice(0, lo) + '…';
  }

  class ReceiptModal {
    constructor(options) {
      this.modalEl = options.modalEl;
      this.Taxonomy = options.Taxonomy;
      this.Probability = options.Probability;
      this.onResetRun = options.onResetRun;

      this.currentEval = null;
      this._bindModalControls();
    }

    _bindModalControls() {
      if (!this.modalEl) return;

      const closeBtn = this.modalEl.querySelector('#btn-close-dossier');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.close();
        }
      });

      const copyBtn = this.modalEl.querySelector('#btn-copy-receipt');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copyTextReceipt(copyBtn));
      }

      const pngBtn = this.modalEl.querySelector('#btn-download-png');
      if (pngBtn) {
        pngBtn.addEventListener('click', () => this.downloadPngSpecimen(pngBtn));
      }

      const playAgainBtn = this.modalEl.querySelector('#btn-new-run');
      if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
          this.close();
          if (this.onResetRun) this.onResetRun();
        });
      }
    }

    open(evalResult) {
      if (!this.modalEl || !evalResult) return;
      this.currentEval = evalResult;
      this._populateDOM(evalResult);
      this.modalEl.classList.remove('hidden');
      this.modalEl.setAttribute('aria-hidden', 'false');
    }

    close() {
      if (!this.modalEl) return;
      this.modalEl.classList.add('hidden');
      this.modalEl.setAttribute('aria-hidden', 'true');
    }

    _populateDOM(evalResult) {
      const archetypeEl = this.modalEl.querySelector('#dossier-archetype');
      const bitsEl = this.modalEl.querySelector('#dossier-bits');
      const traitCountEl = this.modalEl.querySelector('#dossier-trait-count');
      const mvpEl = this.modalEl.querySelector('#dossier-mvp');
      const badgesWrap = this.modalEl.querySelector('#dossier-badges');
      const funnelWrap = this.modalEl.querySelector('#dossier-funnel-list');

      if (archetypeEl) archetypeEl.textContent = evalResult.archetype;
      if (bitsEl) bitsEl.textContent = evalResult.bitsRaw.toFixed(2) + ' bits';
      if (traitCountEl) {
        traitCountEl.textContent =
          evalResult.activeCount + ' trait' + (evalResult.activeCount === 1 ? '' : 's');
      }

      if (mvpEl) {
        if (evalResult.mvpItem) {
          const m = evalResult.mvpItem;
          mvpEl.textContent =
            (m.trait.emoji || '⭐') +
            ' ' +
            (m.trait.shortBadge || m.trait.label) +
            ' (+' +
            m.bitsAdded.toFixed(1) +
            ' bits)';
        } else {
          mvpEl.textContent = '—';
        }
      }

      if (badgesWrap && this.Taxonomy) {
        const badges = this.Taxonomy.evaluateSoloBadges(evalResult);
        badgesWrap.innerHTML = '';
        badges.forEach((b) => {
          const pill = document.createElement('div');
          pill.className = 'dossier-badge';
          pill.title = b.detail;
          pill.innerHTML =
            '<span class="dossier-badge-icon">' +
            b.icon +
            '</span><span class="dossier-badge-text">' +
            b.label +
            '</span>';
          badgesWrap.appendChild(pill);
        });
      }

      if (funnelWrap) {
        funnelWrap.innerHTML = '';
        const activeItems = evalResult.items.filter((it) => !it.superseded);
        activeItems.forEach((item, idx) => {
          const isMvp = evalResult.mvpItem === item;
          const row = document.createElement('div');
          row.className = 'dossier-step-row' + (isMvp ? ' is-mvp' : '');

          const left = document.createElement('div');
          left.className = 'dossier-step-name';
          left.textContent =
            idx +
            1 +
            '. ' +
            (item.trait.emoji || '🔹') +
            ' ' +
            (item.trait.shortBadge || item.trait.label) +
            (isMvp ? ' ★ MVP' : '');

          const right = document.createElement('div');
          right.className = 'dossier-step-pop';
          right.textContent =
            this.Probability.formatCompactCount(item.populationBefore) +
            ' ➔ ' +
            this.Probability.formatCompactCount(item.populationAfter);

          row.appendChild(left);
          row.appendChild(right);
          funnelWrap.appendChild(row);
        });
      }
    }

    buildTextReceipt(evalResult) {
      const active = evalResult.items.filter((it) => !it.superseded);
      const chain = active
        .map(
          (it) =>
            (it.trait.emoji || '🔹') + ' ' + this.Probability.formatPrevalencePercent(it.pEff)
        )
        .join(' ➔ ');

      const mvpLine = evalResult.mvpItem
        ? 'MVP Cut: ' +
          (evalResult.mvpItem.trait.shortBadge || evalResult.mvpItem.trait.label) +
          ' (+' +
          evalResult.mvpItem.bitsAdded.toFixed(1) +
          ' bits)'
        : '';

      return [
        'THE 8.3 BILLIONTH — 1 of 1 🌍✨',
        '"what makes you one-of-one?"',
        '8,300,000,000 ➔ 1 in ' +
          evalResult.activeCount +
          ' traits (' +
          evalResult.bitsRaw.toFixed(1) +
          ' bits)',
        chain,
        'Specimen: ' + evalResult.archetype,
        mvpLine,
        SHARE_URL
      ]
        .filter(Boolean)
        .join('\n');
    }

    async copyTextReceipt(btnEl) {
      if (!this.currentEval) return;
      const text = this.buildTextReceipt(this.currentEval);
      try {
        await navigator.clipboard.writeText(text);
        if (btnEl) {
          const orig = btnEl.textContent;
          btnEl.textContent = '✓ Copied Receipt!';
          setTimeout(() => {
            btnEl.textContent = orig;
          }, 2200);
        }
      } catch (_) {
        // Fallback textarea copy
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    }

    /**
     * Renders a crisp 1080x1350 archival census specimen card on an offscreen HTML5 2D Canvas.
     */
    renderSpecimenCanvas(evalResult) {
      const W = 1080;
      const H = 1350;
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d');

      // 1. Warm Archival Paper Outer Mat
      ctx.fillStyle = '#EAE3D1';
      ctx.fillRect(0, 0, W, H);

      // Subtle warm sunlight wash at top
      const glow = ctx.createRadialGradient(W * 0.5, 190, 20, W * 0.5, 220, 560);
      glow.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
      glow.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, 720);

      // 2. Crisp Archival Specimen Card Inner Sheet
      const cardX = 56;
      const cardY = 56;
      const cardW = W - 112;
      const cardH = H - 112;

      roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
      ctx.fillStyle = '#FDFBF7';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(194, 120, 3, 0.36)';
      ctx.stroke();

      // Top Specimen Header Band
      ctx.fillStyle = '#C27803';
      ctx.font = '700 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('GLOBAL HUMAN CENSUS  //  VERIFIED SPECIMEN DOSSIER', cardX + 52, cardY + 64);

      ctx.fillStyle = '#141921';
      ctx.font = '800 66px "Fraunces", Georgia, serif';
      ctx.fillText('The 8.3 Billionth', cardX + 52, cardY + 142);

      ctx.fillStyle = '#435063';
      ctx.font = 'italic 500 30px "Fraunces", Georgia, serif';
      ctx.fillText('what makes you one-of-one?', cardX + 52, cardY + 186);

      // Brass/Gold 1-OF-1 Circular Ink Stamp (Top Right)
      const stampX = cardX + cardW - 135;
      const stampY = cardY + 132;
      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate(-0.11);
      ctx.strokeStyle = '#C27803';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 74, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 64, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#C27803';
      ctx.font = '800 30px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('1 OF 1', 0, 4);
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText('VERIFIED', 0, 28);
      ctx.restore();

      // Divider rule
      ctx.strokeStyle = 'rgba(20, 25, 33, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 52, cardY + 224);
      ctx.lineTo(cardX + cardW - 52, cardY + 224);
      ctx.stroke();

      // 3. Archetype Classification Banner
      roundRectPath(ctx, cardX + 52, cardY + 252, cardW - 104, 132, 18);
      ctx.fillStyle = 'rgba(194, 120, 3, 0.09)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 120, 3, 0.32)';
      ctx.stroke();

      ctx.fillStyle = '#C27803';
      ctx.font = '700 19px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SPECIMEN CLASSIFICATION', cardX + 80, cardY + 292);

      ctx.fillStyle = '#141921';
      ctx.font = '700 42px "Fraunces", Georgia, serif';
      ctx.fillText(
        truncateCanvasText(ctx, evalResult.archetype, cardW - 160),
        cardX + 80,
        cardY + 350
      );

      // 4. Three Telemetry Stat Tiles
      const statsY = cardY + 412;
      const tileGap = 20;
      const tileW = (cardW - 104 - tileGap * 2) / 3;
      const stats = [
        { label: 'STARTING CROWD', value: '8.30B' },
        { label: 'UNIQUENESS ENTROPY', value: evalResult.bitsRaw.toFixed(2) + ' bits' },
        {
          label: 'TRAITS STACKED',
          value: evalResult.activeCount + (evalResult.activeCount === 1 ? ' trait' : ' traits')
        }
      ];

      stats.forEach((st, idx) => {
        const tx = cardX + 52 + idx * (tileW + tileGap);
        roundRectPath(ctx, tx, statsY, tileW, 104, 14);
        ctx.fillStyle = '#F3EFE4';
        ctx.fill();
        ctx.strokeStyle = 'rgba(20, 25, 33, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#6F7C8F';
        ctx.font = '700 16px "JetBrains Mono", monospace';
        ctx.fillText(st.label, tx + 22, statsY + 36);

        ctx.fillStyle = idx === 1 ? '#0F766E' : '#141921';
        ctx.font = '800 32px "JetBrains Mono", monospace';
        ctx.fillText(st.value, tx + 22, statsY + 80);
      });

      // 5. Logarithmic Funnel Sparkline + Trait Stack Rows
      ctx.fillStyle = '#6F7C8F';
      ctx.font = '700 19px "JetBrains Mono", monospace';
      ctx.fillText('POPULATION NARROWING STACK', cardX + 52, cardY + 566);

      const activeItems = evalResult.items.filter((it) => !it.superseded);
      const maxRows = 8;
      const visibleItems = activeItems.slice(0, maxRows);
      const rowStartY = cardY + 590;
      const rowH = Math.min(68, Math.floor(470 / Math.max(1, visibleItems.length)));

      visibleItems.forEach((item, idx) => {
        const ry = rowStartY + idx * (rowH + 8);
        const isMvp = evalResult.mvpItem === item;

        roundRectPath(ctx, cardX + 52, ry, cardW - 104, rowH, 12);
        ctx.fillStyle = isMvp ? 'rgba(15, 118, 110, 0.10)' : '#F5F1E6';
        ctx.fill();
        ctx.strokeStyle = isMvp ? 'rgba(15, 118, 110, 0.42)' : 'rgba(20, 25, 33, 0.10)';
        ctx.lineWidth = isMvp ? 1.5 : 1;
        ctx.stroke();

        // Logarithmic remaining progress bar inside bottom of row
        const logRem =
          item.populationAfter <= 1
            ? 0.015
            : Math.log10(item.populationAfter) / Math.log10(8300000000);
        const barW = Math.max(10, (cardW - 128) * logRem);
        ctx.fillStyle = '#0F766E';
        ctx.globalAlpha = 0.22;
        ctx.fillRect(cardX + 64, ry + rowH - 6, barW, 4);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#141921';
        ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        const titleText =
          idx +
          1 +
          '. ' +
          (item.trait.emoji || '•') +
          '  ' +
          (item.trait.shortBadge || item.trait.label) +
          (isMvp ? '  ★ MVP' : '');
        ctx.fillText(truncateCanvasText(ctx, titleText, cardW - 380), cardX + 72, ry + rowH * 0.62);

        ctx.fillStyle = isMvp ? '#0F766E' : '#435063';
        ctx.font = '700 22px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        const transitionText =
          this.Probability.formatCompactCount(item.populationBefore) +
          ' → ' +
          this.Probability.formatCompactCount(item.populationAfter);
        ctx.fillText(transitionText, cardX + cardW - 72, ry + rowH * 0.62);
      });

      if (activeItems.length > maxRows) {
        ctx.fillStyle = '#6F7C8F';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          '+ ' + (activeItems.length - maxRows) + ' more narrowing traits → Population: 1',
          cardX + 72,
          rowStartY + maxRows * (rowH + 8) + 22
        );
      }

      // 6. Badges & Footer Callout
      if (this.Taxonomy) {
        const badges = this.Taxonomy.evaluateSoloBadges(evalResult).slice(0, 3);
        let bx = cardX + 52;
        const by = cardY + cardH - 134;
        ctx.font = '700 19px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';

        badges.forEach((b) => {
          const txt = b.icon + ' ' + b.label;
          const pw = ctx.measureText(txt).width + 34;
          if (bx + pw < cardX + cardW - 48) {
            roundRectPath(ctx, bx, by, pw, 44, 22);
            ctx.fillStyle = 'rgba(194, 120, 3, 0.12)';
            ctx.fill();
            ctx.fillStyle = '#92400E';
            ctx.fillText(txt, bx + 17, by + 29);
            bx += pw + 14;
          }
        });
      }

      // Footer rule & URL
      ctx.strokeStyle = 'rgba(20, 25, 33, 0.14)';
      ctx.beginPath();
      ctx.moveTo(cardX + 52, cardY + cardH - 68);
      ctx.lineTo(cardX + cardW - 52, cardY + cardH - 68);
      ctx.stroke();

      ctx.fillStyle = '#6F7C8F';
      ctx.font = '700 21px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('punfiction.io/the-8-billionth', cardX + 52, cardY + cardH - 28);

      ctx.fillStyle = '#C27803';
      ctx.textAlign = 'right';
      ctx.fillText('POPULATION REMAINING: 1', cardX + cardW - 52, cardY + cardH - 28);

      return c;
    }

    async downloadPngSpecimen(btnEl) {
      if (!this.currentEval) return;
      const origLabel = btnEl ? btnEl.textContent : '';
      if (btnEl) btnEl.textContent = 'Rendering Card…';

      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (_) {}

      const canvas = this.renderSpecimenCanvas(this.currentEval);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          if (btnEl) btnEl.textContent = origLabel;
          return;
        }

        const fileName = 'the-8-billionth-1of1.png';

        // Try native Web Share sheet on mobile if supported, otherwise trigger crisp file download
        if (
          typeof navigator !== 'undefined' &&
          navigator.canShare &&
          typeof File !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(pointer: coarse)').matches
        ) {
          try {
            const file = new File([blob], fileName, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: 'The 8.3 Billionth — 1 of 1',
                text: 'I narrowed 8.3 billion humans down to 1!',
                files: [file]
              });
              if (btnEl) btnEl.textContent = origLabel;
              return;
            }
          } catch (_) {
            // Fall through to standard anchor download if user cancels share sheet
          }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);

        if (btnEl) {
          btnEl.textContent = '✓ Saved PNG!';
          setTimeout(() => {
            btnEl.textContent = origLabel;
          }, 2200);
        }
      }, 'image/png');
    }
  }

  return ReceiptModal;
});
