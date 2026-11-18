/**
 * The 8.3 Billionth — "You're One-of-One" Celebration Modal, Narrowing Trail, Friend Sharing & 1080x1350 Card
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
          this._copyToClipboard(
            this.buildFriendShareMessage(this.currentEval),
            copyInviteBtn,
            '✓ Copied!'
          )
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
      const trailWrap = this.modalEl.querySelector('#dossier-trail');
      const factorsWrap = this.modalEl.querySelector('#dossier-factors-list');

      if (summaryEl) summaryEl.textContent = this._buildHumanSummary(evalResult);
      if (archetypeEl) archetypeEl.textContent = evalResult.archetype;
      if (traitCountEl) {
        traitCountEl.textContent =
          evalResult.activeCount + ' unique factor' + (evalResult.activeCount === 1 ? '' : 's');
      }

      if (badgesWrap && this.Taxonomy) {
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

      const activeItems = evalResult.items.filter((it) => !it.superseded);

      // Populate Compact Visual Narrowing Trail (🌍 8.30B → 🏐 996M → ... → ✨ 1 (You))
      if (trailWrap) {
        trailWrap.innerHTML = '';
        const startNode = document.createElement('span');
        startNode.className = 'trail-node';
        startNode.textContent = '🌍 8.30B';
        trailWrap.appendChild(startNode);

        activeItems.forEach((item, idx) => {
          const arrow = document.createElement('span');
          arrow.className = 'trail-arrow';
          arrow.textContent = '→';
          trailWrap.appendChild(arrow);

          const isFinal = idx === activeItems.length - 1 && item.populationAfter === 1;
          const node = document.createElement('span');
          node.className = 'trail-node' + (isFinal ? ' is-you' : '');
          node.title = item.trait.shortBadge || item.trait.label;
          node.textContent = isFinal
            ? '✨ 1 (You)'
            : (item.trait.emoji || '•') +
              ' ' +
              this.Probability.formatCompactCount(item.populationAfter);
          trailWrap.appendChild(node);
        });
      }

      // Populate Unique Personal Factors + Overlap & Step Cut Indicators
      if (factorsWrap) {
        factorsWrap.innerHTML = '';
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

          if (item.wasDampened) {
            const overSpan = document.createElement('span');
            overSpan.className = 'factor-overlap-tag';
            if (item.dampenMode === 'geo_bayes' && item.geoSourceLabel) {
              overSpan.textContent =
                '🌍 Geo-matched: ' +
                this.Probability.formatPrevalencePercent(item.pEff) +
                ' given ' +
                item.geoSourceLabel;
            } else {
              overSpan.textContent =
                '📐 Overlap-adjusted to ' +
                this.Probability.formatPrevalencePercent(item.pEff);
            }
            copyWrap.appendChild(overSpan);
          }

          left.appendChild(emojiSpan);
          left.appendChild(copyWrap);

          const rightCol = document.createElement('div');
          rightCol.className = 'factor-right-col';

          const rightPill = document.createElement('span');
          rightPill.className = 'factor-rarity-pill';
          rightPill.textContent = this.Probability.formatPrevalencePercent(item.pBase);

          const stepCut = document.createElement('span');
          stepCut.className = 'factor-step-cut';
          stepCut.textContent =
            this.Probability.formatCompactCount(item.populationBefore) +
            ' → ' +
            (item.populationAfter === 1
              ? '1'
              : this.Probability.formatCompactCount(item.populationAfter));

          rightCol.appendChild(rightPill);
          rightCol.appendChild(stepCut);

          card.appendChild(left);
          card.appendChild(rightCol);
          factorsWrap.appendChild(card);
        });
      }

      this._populateShareLinks(evalResult);
    }

    buildFriendShareMessage(evalResult) {
      if (!evalResult) {
        return 'Find out what makes you 1-of-1 out of 8.3 billion people: ' + SHARE_URL;
      }
      const active = evalResult.items.filter((it) => !it.superseded);
      const trailLine =
        '🌍 8.3B ➔ ' +
        active
          .map((it, idx) =>
            idx === active.length - 1 && it.populationAfter === 1
              ? '✨ 1 (Me!)'
              : (it.trait.emoji || '•') +
                ' ' +
                this.Probability.formatCompactCount(it.populationAfter)
          )
          .join(' ➔ ');

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
        trailLine,
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

      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: 'The 8.3 Billionth — What makes you one-of-one?',
            text: message
          });
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') {
            if (shareTray) shareTray.classList.remove('hidden');
            return;
          }
        }
      }

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
     * Renders a crisp 1080x1350 warm archival "You're One-of-One" personal card on HTML5 2D Canvas,
     * including the compact narrowing trail ribbon + personal unique factor cards.
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
      ctx.fillText('THE 8.3 BILLIONTH  ·  1 IN 8,300,000,000', cardX + 52, cardY + 62);

      ctx.fillStyle = '#141921';
      ctx.font = '800 70px "Fraunces", Georgia, serif';
      ctx.fillText('You’re one-of-one.', cardX + 52, cardY + 142);

      ctx.fillStyle = '#435063';
      ctx.font = 'italic 500 28px "Fraunces", Georgia, serif';
      ctx.fillText(
        'Nobody else on Earth shares this exact combination:',
        cardX + 52,
        cardY + 186
      );

      // Gold 1-OF-1 Circular Ink Stamp (Top Right)
      const stampX = cardX + cardW - 130;
      const stampY = cardY + 124;
      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate(-0.11);
      ctx.strokeStyle = '#C27803';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#C27803';
      ctx.font = '800 28px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('1 OF 1', 0, 4);
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText('ONE OF A KIND', 0, 26);
      ctx.restore();

      // Divider rule
      ctx.strokeStyle = 'rgba(20, 25, 33, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 52, cardY + 218);
      ctx.lineTo(cardX + cardW - 52, cardY + 218);
      ctx.stroke();

      // 3. Personal Signature Banner
      roundRectPath(ctx, cardX + 52, cardY + 240, cardW - 104, 114, 18);
      ctx.fillStyle = 'rgba(194, 120, 3, 0.09)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(194, 120, 3, 0.32)';
      ctx.stroke();

      ctx.fillStyle = '#C27803';
      ctx.font = '700 17px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('MY ONE-OF-ONE SIGNATURE', cardX + 76, cardY + 275);

      ctx.fillStyle = '#141921';
      ctx.font = '800 40px "Fraunces", Georgia, serif';
      ctx.fillText(
        truncateCanvasText(ctx, evalResult.archetype, cardW - 152),
        cardX + 76,
        cardY + 328
      );

      // 4. Compact Narrowing Trail Ribbon (8.30B -> ... -> 1)
      const activeItems = evalResult.items.filter((it) => !it.superseded);
      roundRectPath(ctx, cardX + 52, cardY + 372, cardW - 104, 62, 14);
      ctx.fillStyle = '#F3EFE4';
      ctx.fill();
      ctx.strokeStyle = 'rgba(20, 25, 33, 0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const trailSteps = [
        '8.30B',
        ...activeItems.map((it, idx) =>
          idx === activeItems.length - 1 && it.populationAfter === 1
            ? '1 (Me!)'
            : this.Probability.formatCompactCount(it.populationAfter)
        )
      ];
      const trailStr = trailSteps.join('  →  ');
      ctx.fillStyle = '#0F766E';
      ctx.font = '800 21px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        truncateCanvasText(ctx, 'NARROWING TRAIL:  ' + trailStr, cardW - 148),
        cardX + 74,
        cardY + 410
      );

      // 5. Unique Factors List ("WHAT MAKES ME SPECIAL")
      ctx.fillStyle = '#6F7C8F';
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillText('WHAT MAKES ME SPECIAL', cardX + 52, cardY + 474);

      let rarestItem = null;
      for (let i = 0; i < activeItems.length; i++) {
        if (!rarestItem || activeItems[i].pBase < rarestItem.pBase) {
          rarestItem = activeItems[i];
        }
      }

      const maxRows = 7;
      const visibleItems = activeItems.slice(0, maxRows);
      const rowStartY = cardY + 494;
      const rowH = Math.min(82, Math.floor(560 / Math.max(1, visibleItems.length)) - 9);

      visibleItems.forEach((item, idx) => {
        const ry = rowStartY + idx * (rowH + 9);
        const isRarest = activeItems.length > 1 && item === rarestItem;

        roundRectPath(ctx, cardX + 52, ry, cardW - 104, rowH, 14);
        ctx.fillStyle = isRarest ? 'rgba(15, 118, 110, 0.10)' : '#F5F1E6';
        ctx.fill();
        ctx.strokeStyle = isRarest ? 'rgba(15, 118, 110, 0.42)' : 'rgba(20, 25, 33, 0.10)';
        ctx.lineWidth = isRarest ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = '#141921';
        ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left';
        const factorText =
          (item.trait.emoji || '✨') + '  ' + item.trait.label + (isRarest ? '  ★' : '');
        ctx.fillText(
          truncateCanvasText(ctx, factorText, cardW - 340),
          cardX + 72,
          ry + (rowH >= 70 ? 36 : rowH * 0.62)
        );

        if (rowH >= 70) {
          const estHumans = Math.max(8, Math.round(item.pBase * WORLD_POP));
          ctx.fillStyle = '#6F7C8F';
          ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
          const overlapSuffix = item.wasDampened
            ? item.dampenMode === 'geo_bayes'
              ? ' · geo-adjusted'
              : ' · overlap-adjusted'
            : '';
          ctx.fillText(
            'Shared by ~' +
              this.Probability.formatCompactCount(estHumans) +
              ' (' +
              formatOneInX(item.pBase) +
              ')' +
              overlapSuffix,
            cardX + 110,
            ry + 62
          );
        }

        // Right rarity + step transition
        const pctStr = this.Probability.formatPrevalencePercent(item.pBase);
        ctx.fillStyle = isRarest ? '#0F766E' : '#141921';
        ctx.font = '800 21px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(pctStr, cardX + cardW - 74, ry + (rowH >= 70 ? 35 : rowH * 0.6));

        if (rowH >= 70) {
          ctx.fillStyle = '#6F7C8F';
          ctx.font = '700 16px "JetBrains Mono", monospace';
          ctx.fillText(
            this.Probability.formatCompactCount(item.populationBefore) +
              ' → ' +
              (item.populationAfter === 1
                ? '1'
                : this.Probability.formatCompactCount(item.populationAfter)),
            cardX + cardW - 74,
            ry + 61
          );
        }
      });

      if (activeItems.length > maxRows) {
        ctx.fillStyle = '#6F7C8F';
        ctx.font = '600 19px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          '+ ' + (activeItems.length - maxRows) + ' more unique truths',
          cardX + 74,
          rowStartY + maxRows * (rowH + 9) + 20
        );
      }

      // 6. Inviting Friend Prompt & Footer URL
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
          } catch (_) {}
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
