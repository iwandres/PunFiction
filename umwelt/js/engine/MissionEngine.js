/**
 * UMWELT: Animal Optics — Embodied 2.5D Locomotion & 12 Playable Species Survival Micro-Missions
 * Renders sensory-faithful prey, hazards, stealth shelters, and animal locomotion feedback
 * synchronized directly atop the WebGL2 perception canvas.
 */
import { getMissionForSpecies, getSpecies } from '../data/biomes.js?v=1';

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function randRange(a, b) {
  return a + Math.random() * (b - a);
}

export class MissionEngine {
  constructor(canvas, renderer, audio, input, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.renderer = renderer;
    this.audio = audio;
    this.input = input;
    this.callbacks = callbacks;

    this.active = false;
    this.mission = null;
    this.species = null;
    this.biomeId = null;

    this.player = {
      x: 0.5,
      y: 0.58,
      vx: 0,
      vy: 0,
      energy: 1.0,
      health: 3,
      cooldown: 0,
      dashTimer: 0,
      stealth: false,
      gaitPhase: 0,
      heading: 0,
    };

    this.score = 0;
    this.progress = 0;
    this.timeLeft = 45;
    this.elapsed = 0;
    this.entities = [];
    this.hazards = [];
    this.shelters = [];
    this.fx = [];
    this.radarBlips = [];
    this.sonarFlash = 0;
    this.corridorX = 0.5;
    this.statusBanner = '';
    this.bannerTimer = 0;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width * dpr));
    const h = Math.max(180, Math.floor(rect.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  startMission(biomeId, speciesSlug) {
    const mission = getMissionForSpecies(biomeId, speciesSlug);
    if (!mission) return false;
    const species = getSpecies(biomeId, speciesSlug);

    this.active = true;
    this.biomeId = biomeId;
    this.mission = mission;
    this.species = species;
    this.score = 0;
    this.progress = 0;
    this.timeLeft = mission.timeLimitSec;
    this.elapsed = 0;
    this.fx = [];
    this.radarBlips = [];
    this.sonarFlash = speciesSlug === 'vampire_bat' ? 2.4 : 0;
    this.corridorX = 0.5;

    this.player = {
      x: 0.5,
      y: speciesSlug === 'kestrel' ? 0.48 : 0.60,
      vx: 0,
      vy: 0,
      energy: 1.0,
      health: 3,
      cooldown: 0,
      dashTimer: 0,
      stealth: false,
      gaitPhase: 0,
      heading: 0,
    };

    this._seedMissionEntities();
    this._flashBanner(mission.title, 2.6);
    if (speciesSlug === 'vampire_bat') {
      this.renderer.triggerSonar(0.5, 0.58);
      this.audio.playSonarPing();
    }
    this.callbacks.onStateChange?.(this.getHudSnapshot());
    return true;
  }

  stopMission(silent = false) {
    this.active = false;
    this.mission = null;
    this.entities = [];
    this.hazards = [];
    this.shelters = [];
    this.fx = [];
    this.radarBlips = [];
    // Reset renderer locomotion camera smoothly back to observation mode
    this.renderer.state.camOffsetX = 0;
    this.renderer.state.camOffsetY = 0;
    this.renderer.state.camZoom = 1.0;
    this.renderer.state.gaitBob = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!silent) {
      this.callbacks.onStateChange?.(this.getHudSnapshot());
    }
  }

  _flashBanner(msg, sec = 1.8) {
    this.statusBanner = msg;
    this.bannerTimer = sec;
  }

  _seedMissionEntities() {
    this.entities = [];
    this.hazards = [];
    this.shelters = [];
    const slug = this.species.slug;
    const goal = this.mission.goalCount;

    if (slug === 'kestrel') {
      // Scurrying meadow voles leaving glowing UV urine tracks
      for (let i = 0; i < goal; i++) {
        const vx = randRange(0.22, 0.78);
        const vy = randRange(0.36, 0.76);
        this.entities.push({
          kind: 'uv_vole',
          x: vx,
          y: vy,
          dx: randRange(-0.07, 0.07),
          dy: randRange(-0.04, 0.04),
          r: 0.045,
          trail: [{ x: vx, y: vy }],
          captured: false,
        });
      }
    } else if (slug === 'honeybee') {
      // 5 UV Rudbeckia blossoms + 3 charcoal scarlet poppies (red-blind stealth cover!) + 1 pursuing wasp
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'uv_nectar',
          x: randRange(0.16, 0.84),
          y: randRange(0.28, 0.78),
          r: 0.05,
          phase: Math.random() * 6.28,
          captured: false,
        });
      }
      this.shelters = [
        { kind: 'red_poppy', x: 0.24, y: 0.64, r: 0.085 },
        { kind: 'red_poppy', x: 0.72, y: 0.58, r: 0.085 },
        { kind: 'red_poppy', x: 0.48, y: 0.34, r: 0.078 },
      ];
      this.hazards = [
        { kind: 'paper_wasp', x: 0.14, y: 0.22, vx: 0.12, vy: 0.06, r: 0.042, aggro: 1.0, stunned: 0 },
      ];
    } else if (slug === 'rattlesnake') {
      // 3 warm 38.2C voles, 2 sun-baked 28C granite basking rocks, 1 icy 6C snowmelt creek zone
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'thermal_vole',
          x: randRange(0.22, 0.68),
          y: randRange(0.38, 0.78),
          dx: randRange(-0.06, 0.06),
          dy: randRange(-0.04, 0.04),
          r: 0.048,
          captured: false,
        });
      }
      this.shelters = [
        { kind: 'warm_rock', x: 0.22, y: 0.68, r: 0.11 },
        { kind: 'warm_rock', x: 0.42, y: 0.42, r: 0.095 },
      ];
      this.hazards = [
        { kind: 'cold_creek', x: 0.84, y: 0.58, r: 0.14 },
      ];
    } else if (slug === 'deer') {
      // 3 stalking bobcat motion-shimmer cues along the horizontal visual streak (y ~ 0.46..0.54)
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'stalking_bobcat',
          x: randRange(0.16, 0.84),
          y: randRange(0.45, 0.55),
          r: 0.055,
          stalkTimer: randRange(0, 2.5),
          pounceCharge: 0,
          captured: false,
        });
      }
    } else if (slug === 'mantis_shrimp') {
      // Armored reef crabs (emerald-gold in midband) + rival CPL decoys (magenta flash)
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'armored_crab',
          x: randRange(0.18, 0.82),
          y: randRange(0.38, 0.78),
          dx: randRange(-0.05, 0.05),
          dy: randRange(-0.03, 0.03),
          r: 0.048,
          scanned: 0,
          captured: false,
        });
      }
      for (let i = 0; i < 2; i++) {
        this.hazards.push({
          kind: 'rival_cpl',
          x: randRange(0.22, 0.78),
          y: randRange(0.42, 0.74),
          dx: randRange(-0.04, 0.04),
          dy: randRange(-0.03, 0.03),
          r: 0.05,
        });
      }
    } else if (slug === 'cuttlefish') {
      // Transparent glass shrimp each with a specific polarization angle psi (degrees 0..175)
      const angles = [32, 78, 124, 158];
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'glass_shrimp',
          x: randRange(0.20, 0.80),
          y: randRange(0.34, 0.74),
          dx: randRange(-0.04, 0.04),
          dy: randRange(-0.025, 0.025),
          r: 0.05,
          psiDeg: angles[i % angles.length],
          captured: false,
        });
      }
    } else if (slug === 'hammerhead') {
      // 3 buried stingrays emitting 1.2 Hz bioelectric dipole fields beneath open sand
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'buried_ray',
          x: randRange(0.22, 0.82),
          y: randRange(0.46, 0.78),
          r: 0.058,
          phase: Math.random() * 6.28,
          captured: false,
        });
      }
    } else if (slug === 'sea_turtle') {
      // 5 glowing 515nm emerald sponges + 3 pulsing 585nm crimson venomous scorpionfish
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'fluor_sponge',
          x: randRange(0.16, 0.82),
          y: randRange(0.28, 0.78),
          r: 0.05,
          captured: false,
        });
      }
      for (let i = 0; i < 3; i++) {
        this.hazards.push({
          kind: 'scorpionfish',
          x: randRange(0.20, 0.80),
          y: randRange(0.32, 0.76),
          dx: randRange(-0.045, 0.045),
          dy: randRange(-0.03, 0.03),
          r: 0.052,
        });
      }
    } else if (slug === 'gecko') {
      // 4 iridescent emerald moths + 3 ruby-spotted toxic blister beetles
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'emerald_moth',
          x: randRange(0.18, 0.82),
          y: randRange(0.26, 0.76),
          dx: randRange(-0.06, 0.06),
          dy: randRange(-0.05, 0.05),
          r: 0.046,
          phase: Math.random() * 6.28,
          captured: false,
        });
      }
      for (let i = 0; i < 3; i++) {
        this.hazards.push({
          kind: 'toxic_beetle',
          x: randRange(0.20, 0.80),
          y: randRange(0.30, 0.76),
          dx: randRange(-0.04, 0.04),
          dy: randRange(-0.04, 0.04),
          r: 0.044,
        });
      }
    } else if (slug === 'jumping_spider') {
      // 3 prey spiders requiring defocus range lock + 2 stalking assassin bugs on 360 radar
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'orb_prey',
          x: randRange(0.22, 0.78),
          y: randRange(0.34, 0.72),
          dx: randRange(-0.035, 0.035),
          dy: randRange(-0.02, 0.02),
          r: 0.048,
          lock: 0,
          captured: false,
        });
      }
      this.hazards = [
        { kind: 'assassin_bug', x: 0.12, y: 0.78, speed: 0.075, r: 0.042 },
        { kind: 'assassin_bug', x: 0.88, y: 0.28, speed: 0.065, r: 0.042 },
      ];
    } else if (slug === 'thrush') {
      // 6 migratory waypoints inside the shifting Cryptochrome-4 magnetic corridor + 2 owl shadows
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'mag_waypoint',
          x: clamp(0.5 + Math.sin(i * 1.15) * 0.24, 0.22, 0.78),
          y: randRange(0.22, 0.62),
          r: 0.062,
          activeIdx: i,
          captured: false,
        });
      }
      this.hazards = [
        { kind: 'night_owl', x: 0.18, y: 0.34, dx: 0.13, dy: 0.03, r: 0.055 },
        { kind: 'night_owl', x: 0.82, y: 0.56, dx: -0.12, dy: -0.025, r: 0.055 },
      ];
    } else if (slug === 'vampire_bat') {
      // 3 warm TRPV1 thermal beacons + 4 hanging Ceiba liana vine hazards (only visible via sonar!)
      for (let i = 0; i < goal; i++) {
        this.entities.push({
          kind: 'thermal_beacon',
          x: randRange(0.20, 0.82),
          y: randRange(0.34, 0.76),
          r: 0.052,
          captured: false,
        });
      }
      for (let i = 0; i < 4; i++) {
        this.hazards.push({
          kind: 'dark_liana',
          x: randRange(0.18, 0.82),
          y: randRange(0.28, 0.74),
          dx: randRange(-0.03, 0.03),
          dy: randRange(-0.02, 0.02),
          r: 0.054,
        });
      }
    }
  }

  triggerAction() {
    if (!this.active || !this.species) return;
    const p = this.player;
    const slug = this.species.slug;
    if (p.cooldown > 0) return;

    this.audio.playSpeciesAction(slug);
    this.input.haptic(22);

    // Vampire Bat sonar ping illuminates the canyon for 2.6 seconds + captures beacon if close!
    if (slug === 'vampire_bat') {
      this.sonarFlash = 2.6;
      this.renderer.triggerSonar(p.x, p.y);
      p.cooldown = 0.55;
      this._spawnRingFx(p.x, p.y, '#22d3ee', 0.34);
      this._tryCaptureNear(p.x, p.y, 0.115, 'TRPV1 Thermal Lock!');
      return;
    }

    // Honeybee burst dash
    if (slug === 'honeybee') {
      if (p.energy < 0.25) return;
      p.energy = Math.max(0, p.energy - 0.35);
      p.dashTimer = 0.28;
      p.cooldown = 0.35;
      this._spawnRingFx(p.x, p.y, '#facc15', 0.14);
      return;
    }

    // Thrush magnetic surge burst
    if (slug === 'thrush') {
      p.dashTimer = 0.32;
      p.cooldown = 0.45;
      this._spawnRingFx(p.x, p.y, '#f59e0b', 0.18);
      return;
    }

    // Rattlesnake thermal strike (requires >25% ectothermic body heat!)
    if (slug === 'rattlesnake') {
      if (p.energy < 0.25) {
        this._flashBanner('Too cold! Warm up on amber granite rocks.', 1.4);
        this.audio.playHitWarn();
        return;
      }
      p.energy = Math.max(0.05, p.energy - 0.18);
      p.cooldown = 0.45;
      this._spawnRingFx(p.x, p.y, '#f43f5e', 0.15);
      this._tryCaptureNear(p.x, p.y, 0.115, 'Thermal Strike Hit!');
      return;
    }

    // Cuttlefish Malus polarization tentacle snatch!
    if (slug === 'cuttlefish') {
      p.cooldown = 0.45;
      this._spawnRingFx(p.x, p.y, '#22d3ee', 0.16);
      const polDeg = ((this.renderer.state.polAngleRad * 180) / Math.PI + 180) % 180;
      for (const e of this.entities) {
        if (e.captured) continue;
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < 0.12) {
          const angDiff = Math.abs(((polDeg - e.psiDeg + 90) % 180) - 90);
          if (angDiff <= 38) {
            this._captureEntity(e, 'Polarized Shrimp Snatched!');
            return;
          } else {
            this._flashBanner(`Rotate θ° dial closer to ${e.psiDeg}° to lock shrimp!`, 1.4);
            this.audio.playHitWarn();
            return;
          }
        }
      }
      return;
    }

    // Portia Jumping Spider ballistic leap (requires >65% defocus lock)
    if (slug === 'jumping_spider') {
      p.cooldown = 0.45;
      this._spawnRingFx(p.x, p.y, '#d946ef', 0.16);
      for (const e of this.entities) {
        if (e.captured) continue;
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        if (d < 0.12) {
          if (e.lock >= 0.65) {
            this._captureEntity(e, 'Ballistic Defocus Leap Hit!');
            return;
          } else {
            this._flashBanner('Hold reticle briefly to converge green-magenta focus!', 1.3);
            return;
          }
        }
      }
      return;
    }

    // Mantis Shrimp cavitation strike (must scan prey with midband first!)
    if (slug === 'mantis_shrimp') {
      p.cooldown = 0.38;
      this._spawnRingFx(p.x, p.y, '#ec4899', 0.16);
      // Penalty if striking a CPL decoy
      for (const h of this.hazards) {
        if (Math.hypot(h.x - p.x, h.y - p.y) < 0.095) {
          this._damagePlayer('Hit rival CPL decoy! Watch spectral bands.');
          return;
        }
      }
      this._tryCaptureNear(p.x, p.y, 0.11, 'Cavitation Strike!');
      return;
    }

    // Standard species captures: Kestrel Stoop, Deer Alarm, Hammerhead Pin, Sea Turtle Graze, Gecko Snap
    p.cooldown = 0.40;
    this._spawnRingFx(p.x, p.y, this.species.accentColor, 0.16);
    const verbMap = {
      kestrel: 'UV Stoop Capture!',
      deer: 'Predator Alarm Raised!',
      hammerhead: 'Buried Ray Pinned!',
      sea_turtle: 'Fluorescent Sponge Grazed!',
      gecko: 'Nocturnal Moth Snapped!',
    };
    this._tryCaptureNear(p.x, p.y, 0.115, verbMap[slug] || 'Target Captured!');
  }

  _tryCaptureNear(x, y, radius, message) {
    for (const e of this.entities) {
      if (e.captured) continue;
      if (Math.hypot(e.x - x, e.y - y) <= radius) {
        this._captureEntity(e, message);
        return true;
      }
    }
    return false;
  }

  _captureEntity(entity, message) {
    entity.captured = true;
    this.progress += 1;
    this.score += Math.round(200 + this.timeLeft * 6);
    this.audio.playDiscoveryUnlock();
    this.input.haptic([18, 35, 25]);
    this._spawnRingFx(entity.x, entity.y, '#34d399', 0.22);
    this._flashBanner(`${message} (${this.progress}/${this.mission.goalCount})`, 1.4);

    if (this.progress >= this.mission.goalCount) {
      const timeBonus = Math.round(this.timeLeft * 15);
      this.score += timeBonus;
      const result = {
        won: true,
        mission: this.mission,
        score: this.score,
        elapsedMs: Math.round(this.elapsed * 1000),
      };
      this.stopMission(true);
      this.callbacks.onMissionEnd?.(result);
    } else {
      this.callbacks.onStateChange?.(this.getHudSnapshot());
    }
  }

  _damagePlayer(reason) {
    if (this.player.invuln > 0) return;
    this.player.health -= 1;
    this.player.invuln = 1.3;
    this.audio.playHitWarn();
    this.input.haptic([45, 30, 45]);
    this._flashBanner(reason, 1.5);
    this._spawnRingFx(this.player.x, this.player.y, '#ef4444', 0.18);
    if (this.player.health <= 0) {
      const result = {
        won: false,
        reason,
        mission: this.mission,
        score: this.score,
        elapsedMs: Math.round(this.elapsed * 1000),
      };
      this.stopMission(true);
      this.callbacks.onMissionEnd?.(result);
    } else {
      this.callbacks.onStateChange?.(this.getHudSnapshot());
    }
  }

  _spawnRingFx(x, y, color, maxR) {
    this.fx.push({ x, y, color, r: 0.015, maxR, age: 0, life: 0.55 });
  }

  update(dt, timeSec) {
    if (!this.active || !this.mission) return;

    this.elapsed += dt;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.bannerTimer > 0) this.bannerTimer = Math.max(0, this.bannerTimer - dt);
    if (this.sonarFlash > 0) this.sonarFlash = Math.max(0, this.sonarFlash - dt);

    if (this.timeLeft <= 0) {
      const result = {
        won: false,
        reason: 'Time expired before completing the ecological mission.',
        mission: this.mission,
        score: this.score,
        elapsedMs: Math.round(this.elapsed * 1000),
      };
      this.stopMission(true);
      this.callbacks.onMissionEnd?.(result);
      return;
    }

    const inp = this.input.sampleMovement();
    const p = this.player;
    const slug = this.species.slug;

    p.cooldown = Math.max(0, p.cooldown - dt);
    p.dashTimer = Math.max(0, p.dashTimer - dt);
    p.invuln = Math.max(0, (p.invuln || 0) - dt);

    // Embodied animal locomotion physics & gaits
    const speedBase = slug === 'honeybee' ? 0.42
      : slug === 'kestrel' ? 0.44
      : slug === 'thrush' ? 0.40
      : slug === 'vampire_bat' ? 0.38
      : slug === 'rattlesnake' ? 0.28
      : 0.34;
    const boost = p.dashTimer > 0 ? 1.85 : 1.0;

    // Also allow gentle cursor-follow steering on desktop if no keyboard/stick input? No—keep explicit WASD/stick OR drag-to-move clean,
    // plus let clicking/tapping on canvas aim or move if user clicks!
    const targetVx = inp.moveX * speedBase * boost;
    const targetVy = inp.moveY * speedBase * boost;
    const accel = slug === 'hammerhead' || slug === 'sea_turtle' ? 4.5 : 10.0;
    p.vx += (targetVx - p.vx) * Math.min(1, dt * accel);
    p.vy += (targetVy - p.vy) * Math.min(1, dt * accel);

    // Sinusoidal snake slither or wingbeat gait oscillation
    const speedMag = Math.hypot(p.vx, p.vy);
    p.gaitPhase += dt * (4.0 + speedMag * 20.0);
    let slitherX = 0;
    let slitherY = 0;
    if (slug === 'rattlesnake' && speedMag > 0.03) {
      const perpX = -p.vy / (speedMag + 0.001);
      const perpY = p.vx / (speedMag + 0.001);
      const wave = Math.sin(p.gaitPhase * 1.4) * 0.08 * speedMag;
      slitherX = perpX * wave;
      slitherY = perpY * wave;
    }

    p.x = clamp(p.x + (p.vx + slitherX) * dt, 0.09, 0.91);
    p.y = clamp(p.y + (p.vy + slitherY) * dt, 0.16, 0.86);
    if (speedMag > 0.02) {
      p.heading = Math.atan2(p.vy, p.vx);
    }

    // Drive WebGL2 2.5D navigable camera offset, zoom, cursor, and gait bob!
    const st = this.renderer.state;
    st.cursorX = p.x;
    st.cursorY = p.y;
    st.camOffsetX = (p.x - 0.5) * 0.14;
    st.camOffsetY = -(p.y - 0.5) * 0.12;
    st.camZoom = p.dashTimer > 0 ? 1.18 : 1.12;
    st.gaitBob = Math.sin(p.gaitPhase) * (speedMag > 0.02 ? 1.0 : 0.25);

    // Cuttlefish continuous Q/E polarization rotation
    if (slug === 'cuttlefish' && inp.rotPol !== 0) {
      const next = (st.polAngleRad + inp.rotPol * dt * 1.6 + Math.PI) % Math.PI;
      st.polAngleRad = next;
      this.callbacks.onPolarizationChanged?.(Math.round((next * 180) / Math.PI));
    }

    // --- SPECIES-SPECIFIC SENSORY ECOLOGY SIMULATION ---
    this._updateSpeciesLogic(dt, timeSec);

    // Update FX rings
    for (let i = this.fx.length - 1; i >= 0; i--) {
      const f = this.fx[i];
      f.age += dt;
      f.r = (f.age / f.life) * f.maxR;
      if (f.age >= f.life) this.fx.splice(i, 1);
    }

    this._renderCanvas(timeSec);
    this.callbacks.onHudTick?.(this.getHudSnapshot());
  }

  _updateSpeciesLogic(dt, timeSec) {
    const p = this.player;
    const slug = this.species.slug;

    // Move dynamic prey entities
    for (const e of this.entities) {
      if (e.captured) continue;
      if (e.dx || e.dy) {
        e.x += e.dx * dt;
        e.y += e.dy * dt;
        if (e.x < 0.14 || e.x > 0.86) e.dx = -(e.dx || 0);
        if (e.y < 0.24 || e.y > 0.80) e.dy = -(e.dy || 0);
      }
      if (e.kind === 'uv_vole') {
        if (Math.random() < dt * 7) {
          e.trail.push({ x: e.x, y: e.y });
          if (e.trail.length > 26) e.trail.shift();
        }
      } else if (e.kind === 'orb_prey') {
        const d = Math.hypot(e.x - p.x, e.y - p.y);
        e.lock = d < 0.13 ? Math.min(1, e.lock + dt * 1.15) : Math.max(0, e.lock - dt * 0.7);
      } else if (e.kind === 'stalking_bobcat') {
        e.stalkTimer += dt;
        e.pounceCharge = Math.min(1, e.pounceCharge + dt * 0.085);
        if (e.pounceCharge >= 1.0) {
          e.pounceCharge = 0.2;
          this._damagePlayer('Bobcat ambushed from the timberline!');
        }
      }
    }

    // Honeybee: Harvest UV nectar on touch + red poppy stealth + pursuing wasp!
    if (slug === 'honeybee') {
      p.energy = Math.min(1, p.energy + dt * 0.26);
      p.stealth = this.shelters.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < s.r);
      for (const e of this.entities) {
        if (!e.captured && Math.hypot(e.x - p.x, e.y - p.y) < 0.068) {
          this._captureEntity(e, 'UV Nectar Harvested!');
        }
      }
      for (const w of this.hazards) {
        if (p.stealth) {
          w.aggro = Math.max(0, w.aggro - dt * 0.9);
          // Wander aimlessly while bee hides on red-blind charcoal poppy!
          w.x = clamp(w.x + Math.cos(timeSec * 1.8) * 0.13 * dt, 0.10, 0.90);
          w.y = clamp(w.y + Math.sin(timeSec * 1.4) * 0.11 * dt, 0.18, 0.84);
        } else {
          w.aggro = Math.min(1, w.aggro + dt * 0.6);
          const ang = Math.atan2(p.y - w.y, p.x - w.x);
          const spd = 0.165 + 0.05 * w.aggro;
          w.x += Math.cos(ang) * spd * dt;
          w.y += Math.sin(ang) * spd * dt;
          if (Math.hypot(w.x - p.x, w.y - p.y) < 0.052) {
            w.x = p.x < 0.5 ? 0.86 : 0.14;
            w.y = 0.24;
            this._damagePlayer('Paper wasp struck! Duck onto black scarlet poppies to hide.');
          }
        }
      }
    }

    // Rattlesnake: Ectothermic body heat budget vs 28C rocks & 6C indigo creek
    if (slug === 'rattlesnake') {
      const inCold = this.hazards.some((h) => Math.hypot(h.x - p.x, h.y - p.y) < h.r);
      const onRock = this.shelters.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < s.r);
      if (inCold) {
        p.energy = Math.max(0.05, p.energy - dt * 0.34);
      } else if (onRock) {
        p.energy = Math.min(1.0, p.energy + dt * 0.35);
      } else {
        p.energy = clamp(p.energy - dt * 0.03, 0.15, 1.0);
      }
    }

    // Sea Turtle & Gecko & Vampire Bat & Thrush: dynamic hazards + touch grazing
    if (slug === 'sea_turtle') {
      for (const e of this.entities) {
        if (!e.captured && Math.hypot(e.x - p.x, e.y - p.y) < 0.068) {
          this._captureEntity(e, '515 nm Sponge Grazed!');
        }
      }
      for (const h of this.hazards) {
        h.x += h.dx * dt;
        h.y += h.dy * dt;
        if (h.x < 0.14 || h.x > 0.86) h.dx = -h.dx;
        if (h.y < 0.24 || h.y > 0.80) h.dy = -h.dy;
        if (Math.hypot(h.x - p.x, h.y - p.y) < 0.058) {
          this._damagePlayer('Venomous 585 nm scorpionfish spines!');
        }
      }
    }

    if (slug === 'gecko') {
      for (const h of this.hazards) {
        h.x += h.dx * dt;
        h.y += h.dy * dt;
        if (h.x < 0.14 || h.x > 0.86) h.dx = -h.dx;
        if (h.y < 0.24 || h.y > 0.80) h.dy = -h.dy;
        if (Math.hypot(h.x - p.x, h.y - p.y) < 0.052) {
          this._damagePlayer('Ruby-spotted toxic blister beetle!');
        }
      }
    }

    if (slug === 'jumping_spider') {
      this.radarBlips = [];
      for (const h of this.hazards) {
        const ang = Math.atan2(p.y - h.y, p.x - h.x);
        h.x += Math.cos(ang) * h.speed * dt;
        h.y += Math.sin(ang) * h.speed * dt;
        const dist = Math.hypot(h.x - p.x, h.y - p.y);
        // Report 360-degree peripheral radar angle for top HUD strip
        this.radarBlips.push({ angleRad: Math.atan2(h.y - p.y, h.x - p.x), dist });
        if (dist < 0.055) {
          h.x = h.x < 0.5 ? 0.90 : 0.10;
          h.y = randRange(0.24, 0.78);
          this._damagePlayer('Assassin bug ambush! Watch your 360° peripheral radar.');
        }
      }
    }

    if (slug === 'thrush') {
      const nextWp = this.entities.find((e) => !e.captured);
      if (nextWp) {
        this.corridorX += (nextWp.x - this.corridorX) * Math.min(1, dt * 3.0);
        if (Math.hypot(nextWp.x - p.x, nextWp.y - p.y) < 0.085) {
          this._captureEntity(nextWp, 'Magnetic Waypoint Cleared!');
        }
      }
      for (const h of this.hazards) {
        h.x += h.dx * dt;
        h.y += h.dy * dt;
        if (h.x < 0.10 || h.x > 0.90) h.dx = -h.dx;
        if (h.y < 0.18 || h.y > 0.72) h.dy = -h.dy;
        if (Math.hypot(h.x - p.x, h.y - p.y) < 0.062) {
          this._damagePlayer('Nocturnal owl silhouette struck!');
        }
      }
    }

    if (slug === 'vampire_bat') {
      for (const e of this.entities) {
        if (!e.captured && Math.hypot(e.x - p.x, e.y - p.y) < 0.068) {
          this._captureEntity(e, 'Warm TRPV1 Beacon Reached!');
        }
      }
      for (const h of this.hazards) {
        h.x += h.dx * dt;
        h.y += h.dy * dt;
        if (h.x < 0.14 || h.x > 0.86) h.dx = -h.dx;
        if (h.y < 0.24 || h.y > 0.80) h.dy = -h.dy;
        if (Math.hypot(h.x - p.x, h.y - p.y) < 0.056) {
          this._damagePlayer('Snagged dark liana vine! Pulse SONAR rhythmically.');
        }
      }
    }

    if (slug === 'mantis_shrimp') {
      for (const h of this.hazards) {
        h.x += h.dx * dt;
        h.y += h.dy * dt;
        if (h.x < 0.15 || h.x > 0.85) h.dx = -h.dx;
        if (h.y < 0.34 || h.y > 0.80) h.dy = -h.dy;
      }
    }
  }

  _renderCanvas(t) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    const slug = this.species.slug;
    const p = this.player;
    const minDim = Math.min(w, h);

    // 1. Shelters (Red-blind charcoal poppies / Warm amber granite rocks)
    for (const s of this.shelters) {
      const sx = s.x * w;
      const sy = s.y * h;
      const sr = s.r * minDim;
      ctx.save();
      if (s.kind === 'red_poppy') {
        const grad = ctx.createRadialGradient(sx, sy, sr * 0.1, sx, sy, sr);
        grad.addColorStop(0, 'rgba(10, 12, 18, 0.88)');
        grad.addColorStop(0.75, 'rgba(22, 18, 28, 0.72)');
        grad.addColorStop(1, 'rgba(22, 18, 28, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = p.stealth ? 'rgba(52, 211, 153, 0.85)' : 'rgba(148, 163, 184, 0.45)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
        ctx.font = `700 ${Math.round(minDim * 0.017)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('CHARCOAL POPPY (STEALTH)', sx, sy + sr + 14);
      } else if (s.kind === 'warm_rock') {
        const grad = ctx.createRadialGradient(sx, sy, sr * 0.15, sx, sy, sr);
        grad.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
        grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.fillStyle = '#fde68a';
        ctx.font = `700 ${Math.round(minDim * 0.017)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('28°C BASK ROCK', sx, sy + sr + 14);
      }
      ctx.restore();
    }

    // 2. Thrush Quantum Magnetic Corridor Guide
    if (slug === 'thrush') {
      const cx = this.corridorX * w;
      const bw = w * 0.16;
      const grad = ctx.createLinearGradient(cx - bw, 0, cx + bw, 0);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.22)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - bw, 0, bw * 2, h);
    }

    // 3. Sensory-faithful Prey / Target Entities
    const polDeg = ((this.renderer.state.polAngleRad * 180) / Math.PI + 180) % 180;
    for (const e of this.entities) {
      if (e.captured) continue;
      const ex = e.x * w;
      const ey = e.y * h;
      const er = e.r * minDim;
      ctx.save();

      if (e.kind === 'uv_vole') {
        // Fluorescent violet UV urine trail
        if (e.trail.length > 1) {
          ctx.beginPath();
          e.trail.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x * w, pt.y * h);
            else ctx.lineTo(pt.x * w, pt.y * h);
          });
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.72)';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        const nearLoupe = Math.hypot(e.x - p.x, e.y - p.y) < 0.22;
        ctx.fillStyle = nearLoupe ? 'rgba(216, 180, 254, 0.92)' : 'rgba(168, 85, 247, 0.45)';
        ctx.beginPath();
        ctx.arc(ex, ey, er * 0.6, 0, Math.PI * 2);
        ctx.fill();
        if (nearLoupe) {
          ctx.strokeStyle = '#f5d0fe';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (e.kind === 'uv_nectar') {
        const pulse = 0.85 + 0.15 * Math.sin(t * 4 + e.phase);
        const grad = ctx.createRadialGradient(ex, ey, 2, ex, ey, er * pulse);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.95)');
        grad.addColorStop(0.55, 'rgba(34, 211, 238, 0.72)');
        grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex, ey, er * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (e.kind === 'thermal_vole') {
        const grad = ctx.createRadialGradient(ex, ey, 2, ex, ey, er * 1.2);
        grad.addColorStop(0, '#fff7ed');
        grad.addColorStop(0.4, 'rgba(244, 63, 94, 0.92)');
        grad.addColorStop(0.75, 'rgba(168, 85, 247, 0.45)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex, ey, er * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `700 ${Math.round(minDim * 0.017)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('38.2°C', ex, ey - er - 4);
      } else if (e.kind === 'stalking_bobcat') {
        const shimmer = 0.45 + 0.55 * Math.abs(Math.sin(t * 5.2 + e.stalkTimer));
        ctx.strokeStyle = `rgba(125, 211, 252, ${shimmer.toFixed(2)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ex, ey, er * (0.7 + e.pounceCharge * 0.4), 0, Math.PI * 2);
        ctx.stroke();
        // Danger ring arc
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ex, ey, er * 0.85, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * e.pounceCharge);
        ctx.stroke();
        ctx.fillStyle = '#e0f2fe';
        ctx.font = `700 ${Math.round(minDim * 0.017)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('ΔI MOTION', ex, ey - er - 6);
      } else if (e.kind === 'armored_crab') {
        const inScan = Math.abs((e.y - p.y) - (e.x - p.x) * 0.25) < 0.14;
        ctx.fillStyle = inScan ? 'rgba(52, 211, 153, 0.90)' : 'rgba(148, 163, 184, 0.30)';
        ctx.beginPath();
        ctx.arc(ex, ey, er * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = inScan ? '#fde047' : 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (e.kind === 'glass_shrimp') {
        const angDiff = Math.abs(((polDeg - e.psiDeg + 90) % 180) - 90);
        const vis = clamp(Math.cos((angDiff * Math.PI) / 90), 0.06, 1.0);
        ctx.fillStyle = `rgba(165, 243, 252, ${(vis * 0.88).toFixed(2)})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${(vis * 0.95).toFixed(2)})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(ex, ey, er * 0.9, er * 0.45, (e.psiDeg * Math.PI) / 180, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (vis > 0.65) {
          ctx.fillStyle = '#cffafe';
          ctx.font = `700 ${Math.round(minDim * 0.016)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(`e-VEC LOCK ${e.psiDeg}°`, ex, ey - er * 0.8);
        }
      } else if (e.kind === 'buried_ray') {
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        const sense = clamp(1.0 - dist / 0.34, 0.08, 1.0);
        const pulse = 0.55 + 0.45 * Math.sin(t * 2 * Math.PI * 1.2 + e.phase);
        for (let ring = 1; ring <= 3; ring++) {
          ctx.strokeStyle = `rgba(129, 140, 248, ${(sense * (0.95 - ring * 0.24) * pulse).toFixed(2)})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(ex, ey, er * (0.45 * ring + 0.22 * pulse), 0, Math.PI * 2);
          ctx.stroke();
        }
        if (sense > 0.45) {
          ctx.fillStyle = `rgba(34, 211, 238, ${(sense * 0.9).toFixed(2)})`;
          ctx.font = `700 ${Math.round(minDim * 0.016)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('1.2 Hz DIPOLE', ex, ey - er - 4);
        }
      } else if (e.kind === 'fluor_sponge') {
        const grad = ctx.createRadialGradient(ex, ey, 2, ex, ey, er);
        grad.addColorStop(0, '#6ee7b7');
        grad.addColorStop(0.55, 'rgba(16, 185, 129, 0.78)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex, ey, er, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.kind === 'emerald_moth') {
        const flap = Math.abs(Math.sin(t * 7 + e.phase));
        ctx.fillStyle = '#34d399';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(ex - er * 0.3, ey, er * 0.45 * (0.5 + 0.5 * flap), er * 0.34, -0.3, 0, Math.PI * 2);
        ctx.ellipse(ex + er * 0.3, ey, er * 0.45 * (0.5 + 0.5 * flap), er * 0.34, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (e.kind === 'orb_prey') {
        const blurSpread = (1.0 - e.lock) * 14;
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(ex + blurSpread, ey, er * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(ex - blurSpread, ey, er * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = e.lock > 0.65 ? '#34d399' : '#f0abfc';
        ctx.font = `700 ${Math.round(minDim * 0.016)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`LOCK ${Math.round(e.lock * 100)}%`, ex, ey - er);
      } else if (e.kind === 'mag_waypoint') {
        const isNext = e === this.entities.find((x) => !x.captured);
        if (!isNext) {
          ctx.restore();
          continue;
        }
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(ex, ey, er * (0.9 + 0.12 * Math.sin(t * 5)), 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex, ey, er * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fde68a';
        ctx.font = `700 ${Math.round(minDim * 0.017)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('62° MAG NODE', ex, ey - er - 6);
      } else if (e.kind === 'thermal_beacon') {
        const echoVis = clamp(this.sonarFlash / 2.2, 0.28, 1.0);
        const grad = ctx.createRadialGradient(ex, ey, 2, ex, ey, er * 1.15);
        grad.addColorStop(0, `rgba(255, 220, 180, ${echoVis.toFixed(2)})`);
        grad.addColorStop(0.5, `rgba(244, 63, 94, ${(echoVis * 0.85).toFixed(2)})`);
        grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex, ey, er * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Hazards
    for (const hz of this.hazards) {
      const hx = hz.x * w;
      const hy = hz.y * h;
      const hr = hz.r * minDim;
      ctx.save();
      if (hz.kind === 'paper_wasp') {
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hx, hy, hr * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fecaca';
        ctx.font = `700 ${Math.round(minDim * 0.016)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(p.stealth ? 'WASP (BLIND)' : 'WASP HUNTING!', hx, hy - hr);
      } else if (hz.kind === 'cold_creek') {
        const grad = ctx.createRadialGradient(hx, hy, hr * 0.2, hx, hy, hr);
        grad.addColorStop(0, 'rgba(30, 58, 138, 0.62)');
        grad.addColorStop(1, 'rgba(30, 58, 138, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(hx, hy, hr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#93c5fd';
        ctx.font = `700 ${Math.round(minDim * 0.016)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('6°C SNOWMELT (COLD)', hx, hy);
      } else if (hz.kind === 'dark_liana') {
        const vis = clamp(this.sonarFlash / 2.2, 0.04, 1.0);
        ctx.strokeStyle = `rgba(34, 211, 238, ${vis.toFixed(2)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hx, hy, hr * 0.85, 0, Math.PI * 2);
        ctx.stroke();
        if (vis > 0.3) {
          ctx.fillStyle = `rgba(165, 243, 252, ${vis.toFixed(2)})`;
          ctx.font = `700 ${Math.round(minDim * 0.015)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('VINE ECHO', hx, hy + 4);
        }
      } else if (hz.kind === 'rival_cpl') {
        const inScan = Math.abs((hz.y - p.y) - (hz.x - p.x) * 0.25) < 0.14;
        ctx.fillStyle = inScan ? 'rgba(244, 63, 94, 0.88)' : 'rgba(148, 163, 184, 0.30)';
        ctx.beginPath();
        ctx.arc(hx, hy, hr * 0.72, 0, Math.PI * 2);
        ctx.fill();
        if (inScan) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      } else {
        // Scorpionfish, Toxic Beetle, Assassin Bug, Night Owl
        ctx.fillStyle = 'rgba(239, 68, 68, 0.72)';
        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(hx, hy, hr * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Embodied Player Animal Marker & Reticle
    const px = p.x * w;
    const py = p.y * h;
    ctx.save();
    ctx.strokeStyle = p.stealth ? '#34d399' : this.species.accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px, py, minDim * 0.045, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = `${Math.round(minDim * 0.036)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.species.icon, px, py);
    ctx.restore();

    // 6. Action / Capture Ring FX
    for (const f of this.fx) {
      const alpha = Math.max(0, 1 - f.age / f.life);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(f.x * w, f.y * h, f.r * minDim, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Transient mission callout banner
    if (this.bannerTimer > 0 && this.statusBanner) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.bannerTimer * 1.4);
      const fontSize = Math.round(clamp(minDim * 0.028, 14, 22));
      ctx.font = `700 ${fontSize}px "Inter", sans-serif`;
      const tw = ctx.measureText(this.statusBanner).width + 32;
      const bx = (w - tw) / 2;
      const by = h * 0.16;
      ctx.fillStyle = 'rgba(7, 11, 18, 0.82)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, by, tw, fontSize + 18, 999);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.statusBanner, w / 2, by + (fontSize + 18) / 2);
      ctx.restore();
    }
  }

  getHudSnapshot() {
    if (!this.active || !this.mission) {
      return { active: false };
    }
    const slug = this.species.slug;
    let meterLabel = 'ENERGY';
    let meterValue = this.player.energy;
    if (slug === 'rattlesnake') meterLabel = 'BODY HEAT';
    else if (slug === 'honeybee') meterLabel = this.player.stealth ? 'STEALTH ACTIVE' : 'DASH STAMINA';
    else if (slug === 'vampire_bat') {
      meterLabel = 'SONAR ECHO';
      meterValue = clamp(this.sonarFlash / 2.6, 0, 1);
    }

    return {
      active: true,
      missionId: this.mission.missionId,
      title: this.mission.title,
      actionLabel: this.mission.actionLabel,
      progress: this.progress,
      goalCount: this.mission.goalCount,
      timeLeft: Math.ceil(this.timeLeft),
      score: this.score,
      health: this.player.health,
      meterLabel,
      meterValue,
      stealth: this.player.stealth,
      radarBlips: this.radarBlips,
    };
  }
}
