// =============================================================================
// HUD — Cabecera persistente con tiempo, caso y atajos
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';

export class HUD {
  constructor(context) {
    this.ctx = context;
    this.el = null;
    this._unsub = [];
  }

  mount(container) {
    this.el = document.createElement('header');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud__brand">
        <span class="hud__logo">🛡️</span>
        <span class="hud__title">Agencia Federal de Protección Cultural</span>
      </div>
      <div class="hud__case">
        <span class="hud__label">Caso:</span>
        <span class="hud__case-name"></span>
      </div>
      <div class="hud__time" aria-live="polite">
        <span class="hud__day-label">Día</span>
        <span class="hud__day"></span>
        <div class="hud__time-bar"><div class="hud__time-fill"></div></div>
      </div>
      <div class="hud__actions">
        <button class="hud__btn" data-action="notebook" aria-label="Cuaderno de pistas">📓</button>
        <button class="hud__btn" data-action="save" aria-label="Guardar">💾</button>
        <button class="hud__btn" data-action="menu" aria-label="Menú">☰</button>
      </div>
    `;
    container.appendChild(this.el);

    this.el.querySelector('[data-action="notebook"]').addEventListener('click', () => {
      bus.emit('ui:open-notebook');
    });
    this.el.querySelector('[data-action="save"]').addEventListener('click', () => {
      this.ctx.game.saveCurrentGame();
      bus.emit(EVENTS.SHOW_TOAST, { icon: '💾', title: 'Partida guardada', duration: 2000 });
    });
    this.el.querySelector('[data-action="menu"]').addEventListener('click', () => {
      bus.emit('ui:open-menu');
    });

    this.refresh();
    this._unsub.push(bus.on(EVENTS.TIME_TICK, () => this.refresh()));
    this._unsub.push(bus.on(EVENTS.CASE_START, () => this.refresh()));
  }

  refresh() {
    if (!this.el) return;
    const c = this.ctx.case.activeCase;
    const t = this.ctx.time.snapshot();
    this.el.querySelector('.hud__case-name').textContent = c?.title ?? '—';
    this.el.querySelector('.hud__day').textContent =
      `${t.currentDay} / 7 (${t.hours}h restantes hoy)`;
    const fill = this.el.querySelector('.hud__time-fill');
    fill.style.width = `${(t.percent * 100).toFixed(1)}%`;
    fill.style.background =
      t.percent > 0.5 ? 'var(--c-green)' :
      t.percent > 0.25 ? 'var(--c-yellow)' :
      'var(--c-red)';
  }

  unmount() {
    this._unsub.forEach(off => off());
    this._unsub = [];
    this.el?.remove();
    this.el = null;
  }
}
