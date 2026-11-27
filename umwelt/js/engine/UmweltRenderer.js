/**
 * UMWELT: Animal Optics — Multi-Pass WebGL2 Renderer & IndexedDB L1 Plate Cache
 * Runs at 60 fps with:
 *   Pass 0+1 -> fboLiving (Procedural Zero-Wait Biome + 2.5D Relief Parallax + Living Animations)
 *   Pass 2   -> Screen    (15 Species Biological Perception Shaders + Synchronized Split Curtain)
 *   Pass 3   -> fboPrev   (Half-Res Ping-Pong History for Rod Motion Differencing)
 */
import { FULLSCREEN_VS, LIVING_SCENE_FS, UMWELT_PERCEPTION_FS, COPY_FS } from './shaders.js?v=5';
import { getBiome, getSpecies, sanitizePlateKey } from '../data/biomes.js?v=4';

const IDB_NAME = 'umwelt_plates_l1';
const IDB_STORE = 'plates';

function openPlateDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) return resolve(null);
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) {
          req.result.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet(key) {
  const db = await openPlateDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key, value) {
  const db = await openPlateDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function loadImageFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export class UmweltRenderer {
  constructor(canvas, apiBase) {
    this.canvas = canvas;
    this.apiBase = apiBase;
    this.gl = null;
    this.supported = false;

    this.state = {
      biomeId: 'meadow',
      speciesSlug: 'human_meadow',
      lightingPreset: 'Alpine Noon',
      lightIndex: 0,
      biomeIndex: 0,
      speciesShaderId: 0,
      cursorX: 0.5,        // screen normalized [0..1] left->right
      cursorY: 0.5,        // screen normalized [0..1] top->bottom
      parallaxX: 0,
      parallaxY: 0,
      targetParallaxX: 0,
      targetParallaxY: 0,
      camOffsetX: 0,
      camOffsetY: 0,
      camZoom: 1.0,
      gaitBob: 0,
      polAngleRad: (42 * Math.PI) / 180,
      sonarTriggerTime: -10,
      sonarOriginX: 0.5,
      sonarOriginY: 0.5,
      splitEnabled: false,
      splitX: 0.5,
      reducedMotion: false,
      plateMix: 0,
      plateTargetMix: 0,
      transitionPulse: 0,
      semantics: null,
    };

    this.staticManifest = {};
    this.memoryPlates = new Map(); // plateKey -> { rgbTex, bioTex, semantics, bioPixels, bioW, bioH }
    this.readyKeys = new Set();
    this.activePlateKey = null;
    this.loadSeq = 0;
    this.pingPong = 0;
    this.startTime = performance.now();
    this.rafId = null;
    this.onPlateStatus = null;
    this.onFrame = null;
  }

  async init() {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.warn('[UmweltRenderer] WebGL2 unavailable.');
      return false;
    }
    this.gl = gl;
    this.supported = true;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.progLiving = this._buildProgram(FULLSCREEN_VS, LIVING_SCENE_FS, 'LivingScene');
    this.progPercept = this._buildProgram(FULLSCREEN_VS, UMWELT_PERCEPTION_FS, 'UmweltPerception');
    this.progCopy = this._buildProgram(FULLSCREEN_VS, COPY_FS, 'TemporalCopy');

    this.uLiving = this._cacheUniforms(this.progLiving, [
      'uPlateRGB', 'uPlateBio', 'uTime', 'uPlateMix', 'uBiomeId', 'uSpeciesId', 'uLightIndex',
      'uParallax', 'uCamOffset', 'uCamZoom', 'uGaitBob', 'uReducedMotion', 'uResolution',
    ]);
    this.uPercept = this._cacheUniforms(this.progPercept, [
      'uLivingTex', 'uPrevTex', 'uBioTex', 'uBiomeId', 'uSpeciesId', 'uTime',
      'uResolution', 'uCursor', 'uPolAngle', 'uSonarAge', 'uSonarOrigin',
      'uSplitEnabled', 'uSplitX', 'uTransition', 'uReducedMotion',
      'uTargetPrimary', 'uTargetSecondary', 'uEnvFeature',
    ]);
    this.uCopy = this._cacheUniforms(this.progCopy, ['uSourceTex']);

    // Create 1x1 neutral fallback textures
    this.fallbackRgbTex = this._createSolidTexture([32, 48, 56, 255]);
    this.fallbackBioTex = this._createSolidTexture([128, 30, 80, 40]);
    this.currentRgbTex = this.fallbackRgbTex;
    this.currentBioTex = this.fallbackBioTex;
    this.currentBioSample = null;

    this._setupFBOs();
    this.resize();

    // Load pre-baked static launch plate manifest (15 default-lighting plates on GitHub Pages CDN)
    try {
      const resp = await fetch('assets/plates/manifest.json?v=3');
      if (resp.ok) {
        this.staticManifest = await resp.json();
        for (const pk of Object.keys(this.staticManifest)) {
          this.readyKeys.add(pk);
        }
      }
    } catch (err) {
      console.warn('[UmweltRenderer] Static manifest not found, will use procedural/API.', err);
    }

    return true;
  }

  _compileShader(type, source, label) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`GLSL compile error (${label}): ${info}`);
    }
    return shader;
  }

  _buildProgram(vsSrc, fsSrc, label) {
    const gl = this.gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, vsSrc, `${label}:VS`);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSrc, `${label}:FS`);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`GLSL link error (${label}): ${gl.getProgramInfoLog(prog)}`);
    }
    return prog;
  }

  _cacheUniforms(prog, names) {
    const gl = this.gl;
    const map = {};
    for (const n of names) {
      map[n] = gl.getUniformLocation(prog, n);
    }
    return map;
  }

  _createSolidTexture(rgba) {
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  _uploadImageTexture(bitmap) {
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    return tex;
  }

  _extractBioSampler(bitmap) {
    try {
      const w = 120;
      const h = 68;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(bitmap, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      return { data, w, h };
    } catch {
      return null;
    }
  }

  _createFBO(width, height) {
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fb, tex, width, height };
  }

  _disposeFBO(fbo) {
    if (!fbo || !this.gl) return;
    this.gl.deleteFramebuffer(fbo.fb);
    this.gl.deleteTexture(fbo.tex);
  }

  _setupFBOs() {
    const w = Math.max(320, this.canvas.width || 1280);
    const h = Math.max(180, this.canvas.height || 720);
    const halfW = Math.max(160, Math.floor(w * 0.5));
    const halfH = Math.max(90, Math.floor(h * 0.5));

    this._disposeFBO(this.fboLiving);
    this._disposeFBO(this.fboPrevA);
    this._disposeFBO(this.fboPrevB);

    this.fboLiving = this._createFBO(w, h);
    this.fboPrevA = this._createFBO(halfW, halfH);
    this.fboPrevB = this._createFBO(halfW, halfH);
  }

  resize() {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width * dpr));
    const h = Math.max(180, Math.floor(rect.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this._setupFBOs();
      this._render(0.016, (performance.now() - this.startTime) / 1000);
    }
  }

  isPlateReady(biomeId, speciesSlug, lightingPreset) {
    const pk = sanitizePlateKey(biomeId, speciesSlug, lightingPreset, 1);
    return this.memoryPlates.has(pk) || this.readyKeys.has(pk);
  }

  sampleDepthAt(normX, normYTop) {
    if (!this.currentBioSample) return 0.5;
    const { data, w, h } = this.currentBioSample;
    const x = Math.max(0, Math.min(w - 1, Math.floor(normX * w)));
    const y = Math.max(0, Math.min(h - 1, Math.floor(normYTop * h)));
    return data[(y * w + x) * 4] / 255.0;
  }

  triggerSonar(normX, normYTop) {
    const nowSec = (performance.now() - this.startTime) / 1000;
    this.state.sonarTriggerTime = nowSec;
    this.state.sonarOriginX = Math.max(0.05, Math.min(0.95, normX));
    this.state.sonarOriginY = Math.max(0.05, Math.min(0.95, 1.0 - normYTop));
  }

  async setView(biomeId, speciesSlug, lightingPreset, triggerSwoop = true) {
    const biome = getBiome(biomeId);
    const species = getSpecies(biomeId, speciesSlug);
    const presetObj = biome.lightingPresets.find((p) => p.id === lightingPreset) || biome.lightingPresets[0];

    this.state.biomeId = biome.id;
    this.state.biomeIndex = biome.biomeIndex;
    this.state.speciesSlug = species.slug;
    this.state.speciesShaderId = species.shaderId;
    this.state.lightingPreset = presetObj.id;
    this.state.lightIndex = presetObj.lightIndex;
    this.state.semantics = species.defaultSemantics;
    if (triggerSwoop) {
      this.state.transitionPulse = this.state.reducedMotion ? 0.25 : 1.0;
    }
    if (species.slug === 'vampire_bat') {
      this.triggerSonar(0.5, 0.55);
    }

    const seq = ++this.loadSeq;
    const plateKey = sanitizePlateKey(biome.id, species.slug, presetObj.id, 1);
    this.activePlateKey = plateKey;

    // 1. In-memory GPU texture cache hit (0ms!)
    if (this.memoryPlates.has(plateKey)) {
      this._activateCachedPlate(this.memoryPlates.get(plateKey), plateKey);
      this._notifyStatus('ready', plateKey, 'GPU Cache');
      return;
    }

    // 2. If switching lighting preset while default plate for same species is already loaded,
    // keep showing that plate with real-time shader lighting grade while alternate plate loads!
    const defaultKey = sanitizePlateKey(biome.id, species.slug, biome.lightingPresets[0].id, 1);
    if (!presetObj.isDefault && this.memoryPlates.has(defaultKey)) {
      this._activateCachedPlate(this.memoryPlates.get(defaultKey), defaultKey);
      this._notifyStatus('synthesizing', plateKey, `${presetObj.label} (grading live)`);
    } else if (!presetObj.isDefault && this.staticManifest[defaultKey]) {
      // Load default static plate right away as crisp base while Render resolves alternate preset
      this._loadStaticPlate(defaultKey, this.staticManifest[defaultKey]).then((entry) => {
        if (entry && this.loadSeq === seq && this.activePlateKey === plateKey && !this.memoryPlates.has(plateKey)) {
          this._activateCachedPlate(entry, defaultKey);
        }
      });
      this._notifyStatus('synthesizing', plateKey, `Synthesizing ${presetObj.label}...`);
    } else {
      this.state.plateMix = 0;
      this.state.plateTargetMix = 0;
      this._notifyStatus('loading', plateKey, 'Loading plate...');
    }

    // 3. Static CDN launch plate fast-path (default lighting presets!)
    if (this.staticManifest[plateKey]) {
      const entry = await this._loadStaticPlate(plateKey, this.staticManifest[plateKey]);
      if (entry && this.loadSeq === seq) {
        this._activateCachedPlate(entry, plateKey);
        this._notifyStatus('ready', plateKey, 'HD Plate');
        this._prewarmSiblings(biome, presetObj.id, species.slug);
        return;
      }
    }

    // 4. IndexedDB L1 cache hit (for previously generated alternate lighting presets!)
    const idbEntry = await idbGet(plateKey);
    if (idbEntry && idbEntry.rgbBlob && idbEntry.bioBlob) {
      const gpuEntry = await this._blobsToGpuPlate(idbEntry.rgbBlob, idbEntry.bioBlob, idbEntry.semantics);
      this.memoryPlates.set(plateKey, gpuEntry);
      this.readyKeys.add(plateKey);
      if (this.loadSeq === seq) {
        this._activateCachedPlate(gpuEntry, plateKey);
        this._notifyStatus('ready', plateKey, 'L1 Cached Plate');
      }
      return;
    }

    // 5. Render API + MongoDB Atlas GridFS resolve/synthesis
    if (this.apiBase) {
      try {
        const res = await fetch(`${this.apiBase}/plates/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            biomeId: biome.id,
            speciesSlug: species.slug,
            lightingPreset: presetObj.id,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.rgbUrl && data.bioUrl) {
            const origin = this.apiBase.replace(/\/api\/umwelt\/?$/, '');
            const [rgbResp, bioResp] = await Promise.all([
              fetch(`${origin}${data.rgbUrl}`),
              fetch(`${origin}${data.bioUrl}`),
            ]);
            if (rgbResp.ok && bioResp.ok) {
              const [rgbBlob, bioBlob] = await Promise.all([rgbResp.blob(), bioResp.blob()]);
              const semantics = data.semantics || species.defaultSemantics;
              await idbSet(plateKey, { rgbBlob, bioBlob, semantics });
              const gpuEntry = await this._blobsToGpuPlate(rgbBlob, bioBlob, semantics);
              this.memoryPlates.set(plateKey, gpuEntry);
              this.readyKeys.add(plateKey);
              if (this.loadSeq === seq) {
                this._activateCachedPlate(gpuEntry, plateKey);
                this._notifyStatus('ready', plateKey, data.cacheHit ? 'Atlas GridFS' : 'Gemini Synthesized');
              }
              return;
            }
          }
        }
      } catch (err) {
        console.warn('[UmweltRenderer] Render API plate resolve fallback:', err);
      }
    }

    // Graceful fallback: live lighting-graded static plate or procedural biome shader
    if (this.loadSeq === seq) {
      this._notifyStatus('procedural', plateKey, presetObj.isDefault ? 'Procedural Shader' : `${presetObj.label} Live Grade`);
    }
  }

  async _loadStaticPlate(plateKey, manifestEntry) {
    if (this.memoryPlates.has(plateKey)) return this.memoryPlates.get(plateKey);
    try {
      const [rgbResp, bioResp] = await Promise.all([
        fetch(`${manifestEntry.rgbPath}?v=3`),
        fetch(`${manifestEntry.bioPath}?v=3`),
      ]);
      if (!rgbResp.ok || !bioResp.ok) return null;
      const [rgbBlob, bioBlob] = await Promise.all([rgbResp.blob(), bioResp.blob()]);
      const gpuEntry = await this._blobsToGpuPlate(rgbBlob, bioBlob, manifestEntry.semantics);
      this.memoryPlates.set(plateKey, gpuEntry);
      this.readyKeys.add(plateKey);
      return gpuEntry;
    } catch (err) {
      console.warn('[UmweltRenderer] Static plate fetch failed:', plateKey, err);
      return null;
    }
  }

  async _blobsToGpuPlate(rgbBlob, bioBlob, semantics) {
    const [rgbImg, bioImg] = await Promise.all([
      loadImageFromBlob(rgbBlob),
      loadImageFromBlob(bioBlob),
    ]);
    const rgbTex = this._uploadImageTexture(rgbImg);
    const bioTex = this._uploadImageTexture(bioImg);
    const bioSample = this._extractBioSampler(bioImg);
    return { rgbTex, bioTex, semantics, bioSample };
  }

  _activateCachedPlate(entry, plateKey) {
    this.currentRgbTex = entry.rgbTex;
    this.currentBioTex = entry.bioTex;
    this.currentBioSample = entry.bioSample;
    if (entry.semantics) {
      this.state.semantics = entry.semantics;
    }
    this.state.plateTargetMix = 1.0;
    this.readyKeys.add(plateKey);
  }

  _prewarmSiblings(biome, lightingPreset, activeSlug) {
    // Background-cache the remaining 4 POVs of the active biome so switching species is instantaneous!
    const siblings = biome.species.filter((s) => s.slug !== activeSlug);
    siblings.forEach((sp, i) => {
      const pk = sanitizePlateKey(biome.id, sp.slug, lightingPreset, 1);
      if (this.memoryPlates.has(pk) || !this.staticManifest[pk]) return;
      setTimeout(() => {
        if (!this.memoryPlates.has(pk) && this.staticManifest[pk]) {
          this._loadStaticPlate(pk, this.staticManifest[pk]).then(() => {
            this._notifyStatus('prewarmed', pk, '');
          });
        }
      }, 350 + i * 280);
    });
  }

  _notifyStatus(status, plateKey, label) {
    if (typeof this.onPlateStatus === 'function') {
      this.onPlateStatus({ status, plateKey, label, semantics: this.state.semantics });
    }
  }

  _toGlEllipse(obj, fallback) {
    const src = obj || fallback || { x: 0.5, y: 0.5, rx: 0.1, ry: 0.1 };
    return [src.x, 1.0 - src.y, src.rx || 0.1, src.ry || 0.1];
  }

  start() {
    if (!this.supported || this.rafId) return;
    let lastTs = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      if (typeof this.onFrame === 'function') {
        this.onFrame(dt, (now - this.startTime) / 1000);
      }
      this._render(dt, (now - this.startTime) / 1000);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  _render(dt, timeSec) {
    const gl = this.gl;
    if (!gl) return;

    const st = this.state;
    // Smooth interpolation for parallax, plate dissolve, and camera swoop transition
    const lerp = Math.min(1, dt * 8.5);
    st.parallaxX += (st.targetParallaxX - st.parallaxX) * lerp;
    st.parallaxY += (st.targetParallaxY - st.parallaxY) * lerp;
    st.plateMix += (st.plateTargetMix - st.plateMix) * Math.min(1, dt * 4.5);
    st.transitionPulse = Math.max(0, st.transitionPulse - dt * 2.2);

    const prevRead = this.pingPong === 0 ? this.fboPrevA : this.fboPrevB;
    const prevWrite = this.pingPong === 0 ? this.fboPrevB : this.fboPrevA;
    const w = this.canvas.width;
    const h = this.canvas.height;

    gl.bindVertexArray(this.vao);

    // ---- PASS 0 + PASS 1: Living 2.5D Ecosystem -> fboLiving ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboLiving.fb);
    gl.viewport(0, 0, this.fboLiving.width, this.fboLiving.height);
    gl.useProgram(this.progLiving);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.currentRgbTex);
    gl.uniform1i(this.uLiving.uPlateRGB, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.currentBioTex);
    gl.uniform1i(this.uLiving.uPlateBio, 1);

    gl.uniform1f(this.uLiving.uTime, timeSec);
    gl.uniform1f(this.uLiving.uPlateMix, st.plateMix);
    gl.uniform1i(this.uLiving.uBiomeId, st.biomeIndex);
    gl.uniform1i(this.uLiving.uSpeciesId, st.speciesShaderId);
    gl.uniform1i(this.uLiving.uLightIndex, st.lightIndex);
    gl.uniform2f(this.uLiving.uParallax, st.parallaxX, st.parallaxY);
    gl.uniform2f(this.uLiving.uCamOffset, st.camOffsetX, st.camOffsetY);
    gl.uniform1f(this.uLiving.uCamZoom, st.camZoom);
    gl.uniform1f(this.uLiving.uGaitBob, st.gaitBob);
    gl.uniform1f(this.uLiving.uReducedMotion, st.reducedMotion ? 1.0 : 0.0);
    gl.uniform2f(this.uLiving.uResolution, w, h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---- PASS 2: Biological Perception & Optical Physics -> Screen ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.useProgram(this.progPercept);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboLiving.tex);
    gl.uniform1i(this.uPercept.uLivingTex, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, prevRead.tex);
    gl.uniform1i(this.uPercept.uPrevTex, 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.currentBioTex);
    gl.uniform1i(this.uPercept.uBioTex, 2);

    const sem = st.semantics || {};
    const pT = this._toGlEllipse(sem.primaryTarget);
    const sT = this._toGlEllipse(sem.secondaryTarget);
    const eF = this._toGlEllipse(sem.environmentFeature);

    gl.uniform1i(this.uPercept.uBiomeId, st.biomeIndex);
    gl.uniform1i(this.uPercept.uSpeciesId, st.speciesShaderId);
    gl.uniform1f(this.uPercept.uTime, timeSec);
    gl.uniform2f(this.uPercept.uResolution, w, h);
    gl.uniform2f(this.uPercept.uCursor, st.cursorX, 1.0 - st.cursorY);
    gl.uniform1f(this.uPercept.uPolAngle, st.polAngleRad);
    gl.uniform1f(this.uPercept.uSonarAge, Math.max(0, timeSec - st.sonarTriggerTime));
    gl.uniform2f(this.uPercept.uSonarOrigin, st.sonarOriginX, st.sonarOriginY);
    gl.uniform1f(this.uPercept.uSplitEnabled, st.splitEnabled ? 1.0 : 0.0);
    gl.uniform1f(this.uPercept.uSplitX, st.splitX);
    gl.uniform1f(this.uPercept.uTransition, st.transitionPulse);
    gl.uniform1f(this.uPercept.uReducedMotion, st.reducedMotion ? 1.0 : 0.0);
    gl.uniform4f(this.uPercept.uTargetPrimary, pT[0], pT[1], pT[2], pT[3]);
    gl.uniform4f(this.uPercept.uTargetSecondary, sT[0], sT[1], sT[2], sT[3]);
    gl.uniform4f(this.uPercept.uEnvFeature, eF[0], eF[1], eF[2], eF[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ---- PASS 3: Temporal History Copy -> fboPrevWrite ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevWrite.fb);
    gl.viewport(0, 0, prevWrite.width, prevWrite.height);
    gl.useProgram(this.progCopy);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboLiving.tex);
    gl.uniform1i(this.uCopy.uSourceTex, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.pingPong = 1 - this.pingPong;
  }
}
