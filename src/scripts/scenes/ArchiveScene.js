// =============================================================================
// ARCHIVE SCENE — Sala de Expedientes
// El detective revisa el roster de sospechosos. Las pistas acumuladas filtran
// los compatibles. Cuesta 3 horas (una única vez por visita).
// Educativo: enseña deducción por eliminación de atributos.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import gsap from 'gsap';

const ATTRIBUTE_LABELS = {
  hair: 'Cabello',
  profession: 'Profesión',
  hobby: 'Hobby',
  food: 'Comida favorita',
  place: 'Lugar favorito',
  color: 'Color favorito',
  alias: 'Alias',
  accessory: 'Accesorio',
};

export class ArchiveScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');

    // Costo de investigar: 3 horas (solo la primera vez en esta visita)
    if (!this._hasConsumed) {
      ctx.time.consume(3);
      this._hasConsumed = true;
    }

    const known = ctx.clues.knownAttributes;
    const knownEntries = Object.entries(known);
    const matches = ctx.clues.matchSuspects(ctx.suspectRoster);

    body.innerHTML = `
      <section class="archive">
        <header class="archive__header">
          <button class="menu-btn menu-btn--ghost" data-action="back">← Volver</button>
          <h2>🗂️ Sala de Expedientes</h2>
          <p class="archive__subtitle">
            Atributos conocidos: <strong>${knownEntries.length}</strong> ·
            Sospechosos compatibles: <strong>${matches.length}</strong> de ${ctx.suspectRoster.length}
          </p>
        </header>

        <div class="archive__known">
          <h3>Pistas verificadas</h3>
          ${knownEntries.length === 0
            ? '<p class="archive__empty-clues">Todavía no recolectaste pistas de identidad. Entrevistá testigos para descubrir atributos del sospechoso.</p>'
            : `<ul class="known-attrs">
                ${knownEntries.map(([k, v]) => `
                  <li class="known-attr">
                    <span class="known-attr__key">${ATTRIBUTE_LABELS[k] ?? k}</span>
                    <span class="known-attr__val">${this._formatValue(k, v, ctx)}</span>
                  </li>
                `).join('')}
              </ul>`
          }
        </div>

        <div class="archive__list">
          <h3>Expedientes</h3>
          ${matches.length === 0
            ? '<p class="archive__empty">Ninguna ficha encaja con tus pistas actuales. Si esto sucede, probablemente alguna pista fue mal interpretada.</p>'
            : `<ul class="suspect-list suspect-list--grid">
                ${matches.slice(0, 24).map(s => `
                  <li>
                    <article class="suspect-card" style="--hue:${s.avatarHue}deg">
                      <div class="suspect-card__avatar"></div>
                      <div class="suspect-card__info">
                        <strong>${s.name}</strong>
                        <span>alias "${s.alias}"</span>
                        <small>${s.profession.name}</small>
                        <small>pelo ${s.hair.name}</small>
                      </div>
                    </article>
                  </li>
                `).join('')}
              </ul>`
          }
          ${matches.length > 24 ? `<p class="archive__more">+${matches.length - 24} sospechosos más. Recolectá otra pista para reducir la lista.</p>` : ''}
        </div>

        <div class="archive__tip">
          💡 <strong>Consejo del detective:</strong> cada atributo confirmado reduce drásticamente
          la lista. Con 3 atributos suele quedar 1 sospechoso identificable.
        </div>
      </section>
    `;

    body.querySelector('[data-action="back"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('office');
    };

    gsap.from('.suspect-card', { y: 20, opacity: 0, duration: 0.3, stagger: 0.03 });
    gsap.from('.known-attr', { x: -20, opacity: 0, duration: 0.3, stagger: 0.05 });

    bus.emit(EVENTS.SHOW_TOAST, {
      icon: '🗂️',
      title: 'Archivo consultado',
      body: 'Has invertido 3 horas revisando expedientes.',
      duration: 2500,
    });
  }

  _formatValue(key, value, ctx) {
    // Para atributos categóricos, mostrar el nombre legible del primer match
    const sample = ctx.suspectRoster.find(s => {
      const target = s[key];
      if (target && typeof target === 'object') return target.id === value;
      return target === value;
    });
    if (!sample) return String(value);
    const target = sample[key];
    if (target && typeof target === 'object' && target.name) return target.name;
    return String(target);
  }

  async onUnmount() {
    this._hasConsumed = false;
    audio.stopMusic();
  }
}
