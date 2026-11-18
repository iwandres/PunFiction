/**
 * The 8.3 Billionth — "You're One-of-One" Celebration Modal, Friend Sharing & 1080x1350 Card Generator
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
  const WORLD_POP = 8300000000;

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

  function formatOneInX(prevalence) {
    const p = Math.max(1e-9, Number(prevalence) || 0.1);
    const oneIn = Math.max(2, Math.round(1 / p));
    if (oneIn >= 1000000) {
      return '1 in ' + (oneIn / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (oneIn >= 10000) {
      return '1 in ' + Math.round(oneIn / 1000).toLocaleString('en-US') + 'K';
    }
    return '1 in ' + oneIn.toLocaleString('en-US');
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

      const shareBtn = this.modalEl.querySelector('#btn-share-friends');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => this.shareWithFriends(shareBtn));
      }

      const copyInviteBtn = this.modalEl.querySelector('#btn-copy-invite');
      if (copyInviteBtn) {
        copyInviteBtn.addEventListener('click', () =>
          this._copyToClipboard(this.buildFriendShareMessage(this.currentEval), copyInviteBtn, '✓ Copied!')
        );
      }

      const copyBtn = this.modalEl.querySelector('#btn-copy-receipt');
      if (copyBtn) {
        copyBtn.addEventListener('click', () =>
          this._copyToClipboard(this.buildTextReceipt(this.currentEval), copyBtn, '✓ Copied!')
        );
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
      const shareTray = this.modalEl.querySelector('#dossier-share-tray');
      if (shareTray) shareTray.classList.add('hidden');
      this._populateDOM(evalResult);
      this.modalEl.classList.remove('hidden');
      this.modalEl.setAttribute('aria-hidden', 'false');
    }

    close() {
      if (!this.modalEl) return;
      this.modalEl.classList.add('hidden');
      this.modalEl.setAttribute('aria-hidden', 'true');
    }

    _buildHumanSummary(evalResult) {
      const active = evalResult.items.filter((it) => !it.superseded);
      const count = active.length;
      if (count === 0) {
        return 'Out of 8.3 billion people on Earth, nobody else shares this exact combination of what makes you, you.';
      }

      const rarest = active.slice().sort((a, b) => a.pBase - b.pBase)[0];
      const rareBadge = (rarest.trait.shortBadge || rarest.trait.label).toLowerCase();
      const oneIn = formatOneInX(rarest.pBase);

      if (count === 1) {
        return (
          'Out of 8.3 billion living humans, this extraordinary single factor (' +
          oneIn +
          ' people) already puts you in truly rare company.'
        );
      }

      return (
        'Out of 8,300,000,000 people on Earth, nobody else blends these ' +
        count +
        ' unique truths—anchored by ' +
        rareBadge +
        ' (' +
        oneIn +
        ' humans).'
      );
    }

    _populateDOM(evalResult) {
      const summaryEl = this.modalEl.querySelector('#dossier-summary');
      const archetypeEl = this.modalEl.querySelector('#dossier-archetype');
      const traitCountEl = this.modalEl.querySelector('#dossier-trait-count');
      const badgesWrap = this.modalEl.querySelector('#dossier-badges');
      const factorsWrap = this.modalEl.querySelector('#dossier-factors-list');

      if (summaryEl) summaryEl.textContent = this._buildHumanSummary(evalResult);
      if (archetypeEl) archetypeEl.textContent = evalResult.archetype;
      if (traitCountEl) {
        traitCountEl.textContent =
          evalResult.activeCount + ' unique factor' + (evalResult.activeCount === 1 ? '' : 's');
      }

      if (badgesWrap && this.Taxonomy) {
        // Surface celebratory human badges (skip clinical golf labels)
        const badges = this.Taxonomy.evaluateSoloBadges(evalResult).filter(
          (b) => b.id !== 'golf_tier'
        );
        badgesWrap.innerHTML = '';
        if (badges.length === 0) {
          const defaultPill = document.createElement('div');
          defaultPill.className = 'dossier-badge';
          defaultPill.innerHTML = '<span>✨</span><span>Verified 1-of-1 Combination</span>';
          badgesWrap.appendChild(defaultPill);
        } else {
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
      }

      if (factorsWrap) {
        factorsWrap.innerHTML = '';
        const activeItems = evalResult.items.filter((it) => !it.superseded);
        // Identify rarest individual factor by base prevalence
        let rarestItem = null;
        for (let i = 0; i < activeItems.length; i++) {
          if (!rarestItem || activeItems[i].pBase < rarestItem.pBase) {
            rarestItem = activeItems[i];
          }
        }

        activeItems.forEach((item) => {
          const isRarest = activeItems.length > 1 && item === rarestItem;
          const card = document.createElement('div');
          card.className = 'factor-card' + (isRarest ? ' is-rarest' : '');

          const left = document.createElement('div');
          left.className = 'factor-left';

          const emojiSpan = document.createElement('span');
          emojiSpan.className = 'factor-emoji';
          emojiSpan.textContent = item.trait.emoji || '✨';

          const copyWrap = document.createElement('div');
          copyWrap.className = 'factor-copy';

          const titleLine = document.createElement('div');
          titleLine.className = 'factor-title-line';

          const titleSpan = document.createElement('span');
          titleSpan.className = 'factor-title';
          titleSpan.textContent = item.trait.label;
          titleLine.appendChild(titleSpan);

          if (isRarest) {
            const tag = document.createElement('span');
            tag.className = 'factor-rarest-tag';
            tag.textContent = '★ Rarest Factor';
            titleLine.appendChild(tag);
          }

          const estHumans = Math.max(8, Math.round(item.pBase * WORLD_POP));
          const subSpan = document.createElement('span');
          subSpan.className = 'factor-sub';
          subSpan.textContent =
            'Shared by ~' +
            this.Probability.formatCompactCount(estHumans) +
            ' people globally (' +
            formatOneInX(item.pBase) +
            ')';

          copyWrap.appendChild(titleLine);
          copyWrap.appendChild(subSpan);

          left.appendChild(emojiSpan);
          left.appendChild(copyWrap);

          const rightPill = document.createElement('span');
          rightPill.className = 'factor-rarity-pill';
          rightPill.textContent = this.Probability.formatPrevalencePercent(item.pBase);

          card.appendChild(left);
          card.appendChild(rightPill);
          factorsWrap.appendChild(card);
        });
      }

      this._populateShareLinks(evalResult);
    }

    buildFriendShareMessage(evalResult) {
      if (!evalResult) return 'Find out what makes you 1-of-1 out of 8.3 billion people: ' + SHARE_URL;
      const active = evalResult.items.filter((it) => !it.superseded);
      const bulletLines = active
        .slice(0, 6)
        .map(
          (it) =>
            '• ' +
            (it.trait.emoji || '✨') +
            ' ' +
            (it.trait.shortBadge || it.trait.label) +
            ' (' +
            this.Probability.formatPrevalencePercent(it.pBase) +
            ')'
        )
        .join('\n');

      return [
        'I’m officially 1-of-1 out of 8.3 billion people on Earth! ✨',
        'My signature: ' + evalResult.archetype,
        bulletLines,
        '',
        'What makes YOU one-of-one? 👉 ' + SHARE_URL
      ].join('\n');
    }

    buildTextReceipt(evalResult) {
      return this.buildFriendShareMessage(evalResult);
    }

    _populateShareLinks(evalResult) {
      const msg = this.buildFriendShareMessage(evalResult);
      const encodedMsg = encodeURIComponent(msg);
      const shortTweet = encodeURIComponent(
        'Out of 8.3 billion people on Earth, it only took ' +
          evalResult.activeCount +
          ' truths to find what makes me 1-of-1 (' +
          evalResult.archetype +
          ') ✨\n\nWhat makes YOU one-of-one?'
      );
      const encodedUrl = encodeURIComponent(SHARE_URL);

      const smsEl = this.modalEl.querySelector('#share-link-sms');
      const waEl = this.modalEl.querySelector('#share-link-whatsapp');
      const emailEl = this.modalEl.querySelector('#share-link-email');
      const xEl = this.modalEl.querySelector('#share-link-x');

      if (smsEl) smsEl.href = 'sms:?&body=' + encodedMsg;
      if (waEl) waEl.href = 'https://wa.me/?text=' + encodedMsg;
      if (emailEl) {
        emailEl.href =
          'mailto:?subject=' +
          encodeURIComponent('What makes you one-of-one? (The 8.3 Billionth)') +
          '&body=' +
          encodedMsg;
      }
      if (xEl) {
        xEl.href = 'https://twitter.com/intent/tweet?text=' + shortTweet + '&url=' + encodedUrl;
      }
    }

    async shareWithFriends(btnEl) {
      if (!this.currentEval) return;
      const shareTray = this.modalEl.querySelector('#dossier-share-tray');
      const message = this.buildFriendShareMessage(this.currentEval);

      // Prefer native OS Share Sheet on mobile / macOS / Windows when available
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: 'The 8.3 Billionth — What makes you one-of-one?',
            text: message
          });
          return;
        } catch (err) {
          // If user simply dismissed the OS share sheet on mobile, no error needed;
          // still reveal quick-share options below for convenience.
          if (err && err.name === 'AbortError') {
            if (shareTray) shareTray.classList.remove('hidden');
            return;
          }
        }
      }

      // Desktop / fallback: toggle quick-share channel tray AND copy invite message cleanly
      if (shareTray) {
        shareTray.classList.toggle('hidden');
      }
      await this._copyToClipboard(message, btnEl, '✓ Invite Copied — Pick how to share!');
    }

    async _copyToClipboard(text, btnEl, confirmText) {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      if (btnEl) {
        const orig = btnEl.textContent;
        btnEl.textContent = confirmText || '✓ Copied!';
        setTimeout(() => {
          btnEl.textContent = orig;
        }, 2300);
      }
    }

    /**
     * Renders a crisp 1080x1350 warm archival "You're One-of-One" personal card on HTML5 2D Canvas.
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

      const glow = ctx.createRadialGradient(W * 0.5, 190, 20, W * 0.5, 220, 560);
      glow.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
      glow.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, 720);

      // 2. Crisp Inner Card Sheet
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

      // Top Kicker & Hero Title ("You're one-of-one.")
      ctx.fillStyle = '#C27803';
      ctx.font = '700 21px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('THE 8.3 BILLIONTH  ·  1 IN 8,300,000,000', cardX + 52, cardY + 64);

      ctx.fillStyle = '#141921';
      ctx.font = '800 72px "Fraunces", Georgia, serif';
      ctx.fillText('You’re one-of-one.', cardX + 52, cardY + 148);

      ctx.fillStyle = '#435063';
      ctx.font = 'italic 500 29px "Fraunces", Georgia, serif';
      ctx.fillText(
        'Nobody else on Earth shares this exact combination:',
        cardX + 52,
        cardY + 194
      );

      // Gold 1-OF-1 Circular Ink Stamp (Top Right)
      const stampX = cardX + cardW - 132;
      const stampY = cardY + 128;
      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate(-0.11);
      ctx.strokeStyle = '#C27803';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#C27803';
      ctx.font = '800 29px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('1 OF 1', 0, 4);
      ctx.font = '700 14px "JetBrains Mono", monospace';
      ctx.fillText('ONE OF A KIND', 0, 27);
      ctx.restore();

      // Divider rule
      ctx.strokeStyle = 'rgba(20, 25, 33, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 52, cardY + 230);
      ctx.lineTo(cardX + cardW - 52, cardY + 230);
      ctx.stroke();

      // 3. Personal Signature Banner
      roundRectPath(ctx, cardX + 52, cardY + 256, cardW - 104, 126, 18);
      ctx.fillStyle = 'rgba(194, 120, 3, 0.09)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 120, 3, 0.32)';
      ctx.stroke();

      ctx.fillStyle = '#C27803';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('MY ONE-OF-ONE SIGNATURE', cardX + 78, cardY + 294);

      ctx.fillStyle = '#141921';
      ctx.font = '800 42px "Fraunces", Georgia, serif';
      ctx.fillText(
        truncateCanvasText(ctx, evalResult.archetype, cardW - 156),
        cardX + 78,
        cardY + 350
      );

      // 4. Unique Factors List ("WHAT MAKES ME SPECIAL")
      ctx.fillStyle = '#6F7C8F';
      ctx.font = '700 19px "JetBrains Mono", monospace';
      ctx.fillText('WHAT MAKES ME SPECIAL', cardX + 52, cardY + 428);

      const activeItems = evalResult.items.filter((it) => !it.superseded);
      let rarestItem = null;
      for (let i = 0; i < activeItems.length; i++) {
        if (!rarestItem || activeItems[i].pBase < rarestItem.pBase) {
          rarestItem = activeItems[i];
        }
      }

      const maxRows = 7;
      const visibleItems = activeItems.slice(0, maxRows);
      const rowStartY = cardY + 452;
      const rowH = Math.min(86, Math.floor(600 / Math.max(1, visibleItems.length)) - 10);

      visibleItems.forEach((item, idx) => {
        const ry = rowStartY + idx * (rowH + 10);
        const isRarest = activeItems.length > 1 && item === rarestItem;

        roundRectPath(ctx, cardX + 52, ry, cardW - 104, rowH, 14);
        ctx.fillStyle = isRarest ? 'rgba(15, 118, 110, 0.10)' : '#F5F1E6';
        ctx.fill();
        ctx.strokeStyle = isRarest ? 'rgba(15, 118, 110, 0.42)' : 'rgba(20, 25, 33, 0.10)';
        ctx.lineWidth = isRarest ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = '#141921';
        ctx.font = '700 25px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        const factorText =
          (item.trait.emoji || '✨') +
          '  ' +
          item.trait.label +
          (isRarest ? '  ★' : '');
        ctx.fillText(
          truncateCanvasText(ctx, factorText, cardW - 320),
          cardX + 74,
          ry + (rowH >= 74 ? 38 : rowH * 0.62)
        );

        if (rowH >= 74) {
          const estHumans = Math.max(8, Math.round(item.pBase * WORLD_POP));
          ctx.fillStyle = '#6F7C8F';
          ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(
            'Shared with ~' +
              this.Probability.formatCompactCount(estHumans) +
              ' people (' +
              formatOneInX(item.pBase) +
              ')',
            cardX + 114,
            ry + 66
          );
        }

        // Right rarity badge
        const pctStr = this.Probability.formatPrevalencePercent(item.pBase);
        ctx.fillStyle = isRarest ? '#0F766E' : '#435063';
        ctx.font = '800 23px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(pctStr, cardX + cardW - 76, ry + rowH * 0.58);
      });

      if (activeItems.length > maxRows) {
        ctx.fillStyle = '#6F7C8F';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          '+ ' + (activeItems.length - maxRows) + ' more unique truths',
          cardX + 74,
          rowStartY + maxRows * (rowH + 10) + 22
        );
      }

      // 5. Inviting Friend Prompt & Footer URL
      ctx.strokeStyle = 'rgba(20, 25, 33, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 52, cardY + cardH - 96);
      ctx.lineTo(cardX + cardW - 52, cardY + cardH - 96);
      ctx.stroke();

      ctx.fillStyle = '#141921';
      ctx.font = 'italic 700 26px "Fraunces", Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText('What makes you one-of-one?', cardX + 52, cardY + cardH - 54);

      ctx.fillStyle = '#0F766E';
      ctx.font = '700 21px "JetBrains Mono", monospace';
      ctx.fillText('punfiction.io/the-8-billionth', cardX + 52, cardY + cardH - 22);

      ctx.fillStyle = '#C27803';
      ctx.font = '800 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText('8.3B → JUST ME', cardX + cardW - 52, cardY + cardH - 36);

      return c;
    }

    async downloadPngSpecimen(btnEl) {
      if (!this.currentEval) return;
      const origLabel = btnEl ? btnEl.textContent : '';
      if (btnEl) btnEl.textContent = 'Creating Card…';

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
                title: 'You’re one-of-one — The 8.3 Billionth',
                text: 'Out of 8.3 billion people on Earth, here’s what makes me 1-of-1!',
                files: [file]
              });
              if (btnEl) btnEl.textContent = origLabel;
              return;
            }
          } catch (_) {
            // Fall through to standard download if user cancels share sheet
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
          btnEl.textContent = '✓ Card Saved!';
          setTimeout(() => {
            btnEl.textContent = origLabel;
          }, 2200);
        }
      }, 'image/png');
    }
  }

  return ReceiptModal;
});
