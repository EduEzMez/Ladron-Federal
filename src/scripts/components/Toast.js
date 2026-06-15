// =============================================================================
// TOAST — Notificaciones no bloqueantes
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';

export class ToastHost {
  constructor() {
    this.el = null;
    this._unsub = null;
  }

  mount() {
    this.el = document.createElement('div');
    this.el.className = 'toast-host';
    this.el.setAttribute('role', 'status');
    this.el.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.el);
    this._unsub = bus.on(EVENTS.SHOW_TOAST, (t) => this.show(t));
  }

  show({ icon = '✨', title, body, duration = 3000 }) {
    if (!this.el) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast__icon">${icon}</span>
      <div class="toast__content">
        ${title ? `<strong class="toast__title">${title}</strong>` : ''}
        ${body ? `<p class="toast__body">${body}</p>` : ''}
      </div>
    `;
    this.el.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast--enter'));
    setTimeout(() => {
      toast.classList.add('toast--leave');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  unmount() {
    this._unsub?.();
    this.el?.remove();
  }
}
