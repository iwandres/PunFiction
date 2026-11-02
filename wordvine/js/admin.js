/**
 * Word Vine — Admin Vine Studio & Anti-Ambiguity Validator Controller
 * Allows editing daily chains, auto-propagating stemWord from previous correctWord,
 * validating against compound collisions, test-playing from Zone 1/2/3, and syncing to Render/JSON.
 */
(function () {
  'use strict';

  const Data = window.WordVineData;
  const API_BASE =
    window.WORDVINE_API_URL ||
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8000/api/wordvine'
      : 'https://punfiction.onrender.com/api/wordvine');

  class AdminStudio {
    constructor() {
      this.vines = this.loadVines();
      this.selectedIndex = 0;

      this.selectEl = document.getElementById('admin-vine-select');
      this.metaNumber = document.getElementById('meta-number');
      this.metaDate = document.getElementById('meta-date');
      this.metaTitle = document.getElementById('meta-title');
      this.metaTheme = document.getElementById('meta-theme');
      this.validatorBanner = document.getElementById('validator-banner');
      this.zonesContainer = document.getElementById('zones-container');

      this.init();
    }

    loadVines() {
      if (Data.LEXICON_VERSION && localStorage.getItem('wordvine_lexicon_version') !== Data.LEXICON_VERSION) {
        localStorage.removeItem('wordvine_admin_vines');
        localStorage.setItem('wordvine_lexicon_version', Data.LEXICON_VERSION);
      }
      try {
        const saved = localStorage.getItem('wordvine_admin_vines');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(Data.PRODUCTION_DAILY_VINES));
    }

    init() {
      this.renderVineSelector();
      this.bindEvents();
      this.renderActiveVine();
    }

    renderVineSelector() {
      this.selectEl.innerHTML = '';
      this.vines.forEach((v, idx) => {
        const opt = document.createElement('option');
        opt.value = String(idx);
        opt.textContent = `#${v.vineNumber} (${v.dateKey}) — ${v.title}`;
        this.selectEl.appendChild(opt);
      });
      this.selectEl.value = String(this.selectedIndex);
    }

    bindEvents() {
      this.selectEl.addEventListener('change', () => {
        this.selectedIndex = Number(this.selectEl.value) || 0;
        this.renderActiveVine();
      });

      const syncMeta = () => {
        const v = this.vines[this.selectedIndex];
        v.vineNumber = Number(this.metaNumber.value) || v.vineNumber;
        v.dateKey = this.metaDate.value.trim();
        v.title = this.metaTitle.value.trim();
        v.themeId = Number(this.metaTheme.value) || 0;
        this.renderVineSelector();
        this.persistLocal();
      };

      this.metaNumber.addEventListener('input', syncMeta);
      this.metaDate.addEventListener('input', syncMeta);
      this.metaTitle.addEventListener('input', syncMeta);
      this.metaTheme.addEventListener('change', syncMeta);

      // Test-play buttons for Zone 1, Zone 2, Zone 3
      document.getElementById('btn-test-z1').addEventListener('click', () => this.launchTestPlay(1));
      document.getElementById('btn-test-z2').addEventListener('click', () => this.launchTestPlay(2));
      document.getElementById('btn-test-z3').addEventListener('click', () => this.launchTestPlay(3));

      document.getElementById('btn-save-sync').addEventListener('click', () => this.saveAndSyncToServer());
      document.getElementById('btn-export-json').addEventListener('click', () => this.exportJsonFile());
    }

    renderActiveVine() {
      const v = this.vines[this.selectedIndex];
      this.metaNumber.value = v.vineNumber;
      this.metaDate.value = v.dateKey;
      this.metaTitle.value = v.title;
      this.metaTheme.value = String(v.themeId || 0);

      this.zonesContainer.innerHTML = '';

      const zoneDefs = [
        {
          zoneId: 1,
          title: '🌱 Zone 1: The Roots (Nodes 1–12 • 3-Part Compound Triplets)',
          subtitle: '45 → 95 u/s • Primary Decoy: Thematic Nouns • Every 3rd step triggers a 🌸 Triple-Bloom (+185u)'
        },
        {
          zoneId: 2,
          title: '🪵 Zone 2: The Stem (Nodes 13–28 • 2-Part Double-Meaning Pivots)',
          subtitle: '95 → 185 u/s • Graft Collar Bullet-Time at Node 13 • Primary Decoy: Previous-Compound Context Bait'
        },
        {
          zoneId: 3,
          title: '⚡ Zone 3: The Canopy (Nodes 29–40 • 2-Part Particle Sprints)',
          subtitle: '185 → 280 u/s • Graft Collar at Node 29 • Primary Decoy: Reverse Compounds & 1-Letter Neighbors'
        }
      ];

      zoneDefs.forEach((zDef) => {
        const section = document.createElement('section');
        section.className = 'zone-section';
        const zoneNodes = v.nodes.filter((n) => n.zoneId === zDef.zoneId);

        section.innerHTML = `
          <div class="zone-header">
            <div>
              <h2>${zDef.title}</h2>
              <div style="font-size: 12px; color: var(--muted);">${zDef.subtitle}</div>
            </div>
          </div>
          <table class="node-table">
            <thead>
              <tr>
                <th style="width: 55px;">Node</th>
                <th style="width: 140px;">Stem Word</th>
                <th style="width: 140px;">Correct Word</th>
                <th style="width: 140px;">Decoy Trap</th>
                <th style="width: 90px;">Correct Side</th>
                <th style="width: 90px;">Triplet Step</th>
                <th>Death Card Explanation</th>
              </tr>
            </thead>
            <tbody id="tbody-zone-${zDef.zoneId}"></tbody>
          </table>
        `;

        this.zonesContainer.appendChild(section);
        const tbody = section.querySelector(`#tbody-zone-${zDef.zoneId}`);

        zoneNodes.forEach((node) => {
          const tr = document.createElement('tr');
          const idx = node.index;
          tr.innerHTML = `
            <td style="font-family: 'JetBrains Mono', monospace; color: var(--accent);">
              #${idx + 1}
            </td>
            <td>
              <input type="text" data-idx="${idx}" data-field="stemWord" value="${node.stemWord}" />
            </td>
            <td>
              <input type="text" data-idx="${idx}" data-field="correctWord" value="${node.correctWord}" />
            </td>
            <td>
              <input type="text" data-idx="${idx}" data-field="decoyWord" value="${node.decoyWord}" />
            </td>
            <td>
              <select data-idx="${idx}" data-field="leftRightSeed">
                <option value="0" ${node.leftRightSeed === 0 ? 'selected' : ''}>← Left (0)</option>
                <option value="1" ${node.leftRightSeed === 1 ? 'selected' : ''}>Right → (1)</option>
              </select>
            </td>
            <td style="font-family: 'JetBrains Mono', monospace; text-align: center;">
              ${node.zoneId === 1 ? (node.tripletStep === 3 ? '3 🌸' : `${node.tripletStep}/3`) : '2-Part'}
            </td>
            <td>
              <input type="text" data-idx="${idx}" data-field="explanation" value="${node.explanation || ''}" />
            </td>
          `;
          tbody.appendChild(tr);
        });
      });

      // Bind node table inputs
      this.zonesContainer.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('input', (e) => {
          const idx = Number(e.target.getAttribute('data-idx'));
          const field = e.target.getAttribute('data-field');
          const node = v.nodes[idx];
          if (!node) return;

          if (field === 'leftRightSeed') {
            node.leftRightSeed = Number(e.target.value) === 1 ? 1 : 0;
          } else if (field === 'stemWord' || field === 'correctWord' || field === 'decoyWord') {
            node[field] = e.target.value.toUpperCase().trim();
            // Auto-propagate correctWord to next node's stemWord
            if (field === 'correctWord' && v.nodes[idx + 1]) {
              v.nodes[idx + 1].stemWord = node.correctWord;
              const nextInput = this.zonesContainer.querySelector(
                `input[data-idx="${idx + 1}"][data-field="stemWord"]`
              );
              if (nextInput) nextInput.value = node.correctWord;
            }
          } else {
            node[field] = e.target.value;
          }

          this.runValidator();
          this.persistLocal();
        });
      });

      this.runValidator();
    }

    runValidator() {
      const v = this.vines[this.selectedIndex];
      const res = Data.validateVineChain(v);
      if (res.valid) {
        this.validatorBanner.className = 'validator-banner ok';
        this.validatorBanner.textContent = `✅ Anti-Ambiguity Check Passed: All ${v.nodes.length} nodes form continuous forward compounds with zero decoy collisions.`;
      } else {
        this.validatorBanner.className = 'validator-banner err';
        this.validatorBanner.innerHTML =
          `⚠️ <strong>Validation Issues (${res.issues.length}):</strong><br>` +
          res.issues.join('<br>');
      }
      return res;
    }

    persistLocal() {
      localStorage.setItem('wordvine_admin_vines', JSON.stringify(this.vines));
    }

    launchTestPlay(zoneId) {
      this.persistLocal();
      window.location.href = `index.html?vine=${this.selectedIndex}&zone=${zoneId}&autostart=1`;
    }

    async saveAndSyncToServer() {
      this.persistLocal();
      const btn = document.getElementById('btn-save-sync');
      const prev = btn.textContent;
      btn.textContent = '⏳ Syncing...';

      try {
        const res = await fetch(`${API_BASE}/admin/vines`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.vines)
        });
        if (res.ok) {
          btn.textContent = '✅ Synced to API & Local!';
        } else {
          btn.textContent = '✅ Saved Locally (API Offline)';
        }
      } catch (e) {
        btn.textContent = '✅ Saved Locally!';
      }

      setTimeout(() => {
        btn.textContent = prev;
      }, 2200);
    }

    exportJsonFile() {
      const blob = new Blob([JSON.stringify(this.vines, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'production_daily_vines.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.adminStudio = new AdminStudio();
  });
})();
