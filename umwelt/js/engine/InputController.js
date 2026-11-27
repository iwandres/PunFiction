/**
 * UMWELT: Animal Optics — Unified Desktop & Mobile Accessibility InputController
 * Handles mouse/touch pointer look, click-to-discover, scroll polarization wheel,
 * keyboard shortcuts (1-5, Space/Tab, Q/E, M, Esc), haptics, and optional mobile gyroscope.
 */

export class InputController {
  constructor(viewportEl, callbacks = {}) {
    this.viewportEl = viewportEl;
    this.callbacks = callbacks;

    this.keys = new Set();
    this.moveX = 0;
    this.moveY = 0;
    this.stickX = 0;
    this.stickY = 0;
    this.pointerX = 0.5;
    this.pointerY = 0.5;
    this.gyroEnabled = false;
    this.gyroX = 0;
    this.gyroY = 0;
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    this._stickTouchId = null;
    this._stickOrigin = { x: 0, y: 0 };
    this._dragPointerDown = false;
    this._pointerDownPos = { x: 0, y: 0 };
    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        return;
      }
      const code = e.code;
      this.keys.add(code);

      if (code >= 'Digit1' && code <= 'Digit5') {
        const slot = parseInt(code.replace('Digit', ''), 10);
        this.callbacks.onSlotKey?.(slot);
      } else if (code === 'Space') {
        e.preventDefault();
        this.callbacks.onSpaceKey?.();
      } else if (code === 'KeyE') {
        this.callbacks.onKeyE?.();
      } else if (code === 'KeyQ') {
        this.callbacks.onKeyQ?.();
      } else if (code === 'Tab') {
        e.preventDefault();
        this.callbacks.onToggleSplit?.();
      } else if (code === 'KeyM') {
        this.callbacks.onToggleAudio?.();
      } else if (code === 'Escape') {
        this.callbacks.onEscape?.();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
      this.stickX = 0;
      this.stickY = 0;
    });

    this.viewportEl.addEventListener('pointermove', (e) => {
      const rect = this.viewportEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      this.pointerX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.pointerY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      this.callbacks.onPointerMove?.(this.pointerX, this.pointerY, e);
    });

    this.viewportEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      this._dragPointerDown = true;
      this._pointerDownPos = { x: e.clientX, y: e.clientY };
      const rect = this.viewportEl.getBoundingClientRect();
      if (rect.width && rect.height) {
        this.pointerX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.pointerY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
    });

    this.viewportEl.addEventListener('pointerup', (e) => {
      if (!this._dragPointerDown) return;
      this._dragPointerDown = false;
      const dist = Math.hypot(e.clientX - this._pointerDownPos.x, e.clientY - this._pointerDownPos.y);
      if (dist < 14) {
        const rect = this.viewportEl.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        this.callbacks.onViewportClick?.(nx, ny, e);
      }
    });

    this.viewportEl.addEventListener('wheel', (e) => {
      if (this.callbacks.onWheel) {
        const handled = this.callbacks.onWheel(e.deltaY);
        if (handled) e.preventDefault();
      }
    }, { passive: false });
  }

  bindVirtualThumbstick(zoneEl, knobEl) {
    if (!zoneEl || !knobEl) return;
    const maxR = 42;

    const resetKnob = () => {
      this._stickTouchId = null;
      this.stickX = 0;
      this.stickY = 0;
      knobEl.style.transform = 'translate(0px, 0px)';
    };

    zoneEl.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      zoneEl.setPointerCapture?.(e.pointerId);
      this._stickTouchId = e.pointerId;
      const rect = zoneEl.getBoundingClientRect();
      this._stickOrigin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      this._updateStick(e.clientX, e.clientY, maxR, knobEl);
    });

    zoneEl.addEventListener('pointermove', (e) => {
      if (this._stickTouchId !== e.pointerId) return;
      e.stopPropagation();
      this._updateStick(e.clientX, e.clientY, maxR, knobEl);
    });

    zoneEl.addEventListener('pointerup', (e) => {
      if (this._stickTouchId === e.pointerId) {
        e.stopPropagation();
        resetKnob();
      }
    });

    zoneEl.addEventListener('pointercancel', resetKnob);
  }

  _updateStick(clientX, clientY, maxR, knobEl) {
    const dx = clientX - this._stickOrigin.x;
    const dy = clientY - this._stickOrigin.y;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(maxR, dist);
    const ang = Math.atan2(dy, dx);
    const kx = Math.cos(ang) * clamped;
    const ky = Math.sin(ang) * clamped;
    this.stickX = kx / maxR;
    this.stickY = ky / maxR;
    knobEl.style.transform = `translate(${kx.toFixed(1)}px, ${ky.toFixed(1)}px)`;
  }

  async toggleGyroscope() {
    if (this.gyroEnabled) {
      this.gyroEnabled = false;
      this.gyroX = 0;
      this.gyroY = 0;
      return false;
    }
    if (typeof DeviceOrientationEvent === 'undefined') {
      return false;
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const perm = await DeviceOrientationEvent.requestPermission();
        if (perm !== 'granted') return false;
      } catch {
        return false;
      }
    }
    if (!this._gyroBound) {
      this._gyroBound = true;
      window.addEventListener('deviceorientation', (e) => {
        if (!this.gyroEnabled) return;
        const g = Math.max(-35, Math.min(35, e.gamma || 0)) / 35;
        const b = Math.max(-35, Math.min(35, (e.beta || 45) - 45)) / 35;
        this.gyroX = g;
        this.gyroY = b;
      });
    }
    this.gyroEnabled = true;
    return true;
  }

  haptic(pattern = 18) {
    if (navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore unsupported browser restrictions
      }
    }
  }

  sampleMovement() {
    let kx = 0;
    let ky = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) kx -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) kx += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) ky -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) ky += 1;

    if (kx !== 0 && ky !== 0) {
      kx *= 0.7071;
      ky *= 0.7071;
    }

    // Continuous polarization rotation if Q/E held
    const rotPol = (this.keys.has('KeyE') ? 1 : 0) - (this.keys.has('KeyQ') ? 1 : 0);

    const mx = Math.max(-1, Math.min(1, kx + this.stickX));
    const my = Math.max(-1, Math.min(1, ky + this.stickY));
    this.moveX = mx;
    this.moveY = my;

    return {
      moveX: mx,
      moveY: my,
      rotPol,
      pointerX: this.pointerX,
      pointerY: this.pointerY,
      gyroX: this.gyroX,
      gyroY: this.gyroY,
    };
  }
}
