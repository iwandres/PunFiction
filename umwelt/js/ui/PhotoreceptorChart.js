/**
 * UMWELT: Animal Optics — Collapsible Photoreceptor & Spectral Sensitivity SVG Chart
 * Plots Gaussian cone absorbance curves S(lambda) across 300nm (UV) - 700nm (Red)
 * plus non-visual sensory channels (Thermal IR, Electroreception, Sonar, Magnetoreception).
 */

export function renderPhotoreceptorChart(containerEl, species) {
  if (!containerEl || !species) return;
  const W = 248;
  const H = 94;
  const padL = 18;
  const padR = 8;
  const padT = 14;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const minNm = 300;
  const maxNm = 700;

  const xOf = (nm) => padL + ((nm - minNm) / (maxNm - minNm)) * plotW;

  const curvePaths = (species.photoreceptors || []).map((pr, idx) => {
    const pts = [];
    const fillPts = [`M ${xOf(minNm).toFixed(1)} ${(padT + plotH).toFixed(1)}`];
    for (let nm = minNm; nm <= maxNm; nm += 6) {
      const z = (nm - pr.peakNm) / (pr.width || 35);
      const val = Math.exp(-0.5 * z * z);
      const x = xOf(nm);
      const y = padT + plotH * (1 - val * 0.90);
      pts.push(`${nm === minNm ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      fillPts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    fillPts.push(`L ${xOf(maxNm).toFixed(1)} ${(padT + plotH).toFixed(1)} Z`);
    const peakX = xOf(Math.max(minNm + 12, Math.min(maxNm - 12, pr.peakNm)));
    return `
      <path d="${fillPts.join(' ')}" fill="${pr.color}" fill-opacity="0.16" />
      <path d="${pts.join(' ')}" fill="none" stroke="${pr.color}" stroke-width="1.9" stroke-linecap="round" />
      <text x="${peakX.toFixed(1)}" y="${(padT - 3 + (idx % 2) * 8).toFixed(1)}" fill="${pr.color}" font-size="8" font-family="JetBrains Mono, monospace" text-anchor="middle">${pr.peakNm}nm</text>
    `;
  }).join('');

  const uvEnd = xOf(380);
  const ticks = [300, 400, 500, 600, 700].map((nm) => {
    const x = xOf(nm);
    return `
      <line x1="${x.toFixed(1)}" y1="${padT}" x2="${x.toFixed(1)}" y2="${padT + plotH}" stroke="rgba(255,255,255,0.07)" stroke-dasharray="2 2" />
      <text x="${x.toFixed(1)}" y="${H - 3}" fill="#94a3b8" font-size="8" font-family="JetBrains Mono, monospace" text-anchor="middle">${nm}</text>
    `;
  }).join('');

  const nonVisHtml = species.nonVisualBand
    ? `<div class="nonvisual-band">
         <span class="nv-badge">${species.nonVisualBand.badge || 'OPTICS'}</span>
         <span class="nv-inline">${species.nonVisualBand.label}</span>
       </div>`
    : '';

  containerEl.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="spectral-svg" role="img" aria-label="Spectral sensitivity curve for ${species.name}">
      <defs>
        <linearGradient id="visSpecGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7c3aed" />
          <stop offset="16%" stop-color="#3b82f6" />
          <stop offset="38%" stop-color="#06b6d4" />
          <stop offset="56%" stop-color="#22c55e" />
          <stop offset="74%" stop-color="#eab308" />
          <stop offset="88%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#ef4444" />
        </linearGradient>
      </defs>
      <rect x="${padL}" y="${padT}" width="${(uvEnd - padL).toFixed(1)}" height="${plotH}" fill="rgba(168, 85, 247, 0.08)" />
      <text x="${((padL + uvEnd) / 2).toFixed(1)}" y="${padT + plotH - 4}" fill="rgba(192,132,252,0.75)" font-size="7" font-family="JetBrains Mono, monospace" text-anchor="middle">UV</text>
      ${ticks}
      <rect x="${uvEnd.toFixed(1)}" y="${padT + plotH + 2}" width="${(xOf(700) - uvEnd).toFixed(1)}" height="3" rx="1.5" fill="url(#visSpecGrad)" opacity="0.88" />
      <rect x="${padL}" y="${padT + plotH + 2}" width="${(uvEnd - padL).toFixed(1)}" height="3" rx="1.5" fill="#9333ea" opacity="0.7" />
      ${curvePaths}
      <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="rgba(255,255,255,0.22)" />
    </svg>
    ${nonVisHtml}
  `;
}
