// =============================================================================
// CUADERNO DE PISTAS
// Modal accesible que muestra las pistas geográficas y de identidad
// acumuladas y los atributos conocidos del sospechoso.
// =============================================================================

import { bus } from '../core/EventBus.js';

export class Notebook {
  constructor(context) {
    this.ctx = context;
    this.el = null;
    this._unsub = [];
  }

  mount() {
    this._unsub.push(bus.on('ui:open-notebook', () => this.open()));
  }

  open() {
    if (this.el) return; // ya está abierto
    this.el = document.createElement('div');
    this.el.className = 'notebook-overlay';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-labelledby', 'notebook-title');

    const c = this.ctx.case.activeCase;
    const clues = this.ctx.clues;

    this.el.innerHTML = `
      <div class="notebook">
        <div class="notebook__header">
          <h2 id="notebook-title">📓 Cuaderno de pistas</h2>
          <button class="notebook__close" aria-label="Cerrar">✕</button>
        </div>
        <div class="notebook__body">
          <section class="notebook__section">
            <h3>📍 Pistas geográficas (${clues.geographicClues.length})</h3>
            <ul class="notebook__list">
              ${clues.geographicClues.length
                ? clues.geographicClues.map(c => `
                    <li>
                      <span class="notebook__day">Día ${c.day}</span>
                      <span class="notebook__text">${c.text}</span>
                      <span class="notebook__from">— en ${c.provinceFrom}</span>
                    </li>`).join('')
                : '<li class="notebook__empty">Aún no recolectaste pistas geográficas.</li>'}
            </ul>
          </section>
          <section class="notebook__section">
            <h3>🕵️ Pistas de identidad (${clues.identityClues.length})</h3>
            <ul class="notebook__list">
              ${clues.identityClues.length
                ? clues.identityClues.map(c => `
                    <li>
                      <span class="notebook__day">Día ${c.day}</span>
                      <span class="notebook__text">${c.text}</span>
                    </li>`).join('')
                : '<li class="notebook__empty">Aún no recolectaste pistas de identidad.</li>'}
            </ul>
          </section>
          <section class="notebook__section">
            <h3>📋 Perfil del sospechoso</h3>
            <dl class="notebook__profile">
              ${this._renderProfile()}
            </dl>
          </section>
        </div>
      </div>
    `;

    document.body.appendChild(this.el);
    this.el.querySelector('.notebook__close').addEventListener('click', () => this.close());
    this.el.addEventListener('click', (e) => { if (e.target === this.el) this.close(); });
    document.addEventListener('keydown', this._escClose);
  }

  _renderProfile() {
    const a = this.ctx.clues.knownAttributes;
    const labels = {
      hair: 'Cabello',
      profession: 'Profesión',
      hobby: 'Hobby',
      food: 'Comida favorita',
      place: 'Lugar favorito',
      color: 'Color favorito',
      alias: 'Alias',
      accessory: 'Rasgo distintivo',
    };
    const entries = Object.keys(labels).map(k => `
      <div class="notebook__attr ${a[k] ? 'is-known' : ''}">
        <dt>${labels[k]}</dt>
        <dd>${a[k] ? this._attrValueLabel(k, a[k]) : '???'}</dd>
      </div>
    `);
    return entries.join('');
  }

  _attrValueLabel(key, value) {
    // Buscamos el nombre legible en el roster (todos los sospechosos comparten los pools)
    const sample = this.ctx.suspectRoster[0];
    if (typeof sample[key] === 'object' && sample[key]?.id != null) {
      // Buscar coincidencia en cualquier sospechoso
      for (const s of this.ctx.suspectRoster) {
        if (s[key]?.id === value) return s[key].name;
      }
    }
    return value;
  }

  close = () => {
    if (!this.el) return;
    document.removeEventListener('keydown', this._escClose);
    this.el.remove();
    this.el = null;
  };

  _escClose = (e) => { if (e.key === 'Escape') this.close(); };

  unmount() {
    this._unsub.forEach(off => off());
    this._unsub = [];
    this.close();
  }
}
