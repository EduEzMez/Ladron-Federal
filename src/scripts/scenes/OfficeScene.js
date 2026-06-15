// =============================================================================
// OFFICE SCENE — La oficina del detective
// Hub principal de acciones: hablar con testigos, archivo, viajar, orden.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';

export class OfficeScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');
    const stop = ctx.case.currentStop;
    const isFinal = stop.isFinal;
    const totalWitnesses = stop.witnesses.length;
    const consulted = stop.witnesses.filter(w => ctx.case.hasConsultedWitness(w.id)).length;

    body.innerHTML = `
      <section class="office">
        <div class="office__location-card">
          <h2>📍 ${stop.province.name}</h2>
          <p>${stop.province.capital} · región ${stop.province.region}</p>
          <p class="office__terrain">Terreno: ${stop.province.terrain} · Clima: ${stop.province.climate}</p>
        </div>

        <div class="office__grid">
          <button class="action-card" data-action="witnesses">
            <span class="action-card__icon">👥</span>
            <span class="action-card__title">Entrevistar testigos</span>
            <span class="action-card__detail">${consulted}/${totalWitnesses} consultados · 2h c/u</span>
          </button>

          <button class="action-card" data-action="archive">
            <span class="action-card__icon">🗂️</span>
            <span class="action-card__title">Sala de expedientes</span>
            <span class="action-card__detail">Revisar sospechosos compatibles · 3h</span>
          </button>

          <button class="action-card" data-action="travel" ${isFinal ? 'disabled' : ''}>
            <span class="action-card__icon">🗺️</span>
            <span class="action-card__title">Viajar</span>
            <span class="action-card__detail">${isFinal ? 'Estás en el destino final' : 'Elegir próxima provincia · 6-12h'}</span>
          </button>

          <button class="action-card" data-action="warrant">
            <span class="action-card__icon">📜</span>
            <span class="action-card__title">Orden de captura</span>
            <span class="action-card__detail">${ctx.case.warrantIssued ? 'Ya emitida' : 'Emitir contra un sospechoso · 1h'}</span>
          </button>

          ${isFinal && ctx.case.warrantIssued ? `
            <button class="action-card action-card--capture" data-action="capture">
              <span class="action-card__icon">🚓</span>
              <span class="action-card__title">¡Realizar la captura!</span>
              <span class="action-card__detail">Arrestar al sospechoso</span>
            </button>
          ` : ''}
        </div>
      </section>
    `;

    body.querySelector('[data-action="witnesses"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('interrogation');
    };
    body.querySelector('[data-action="archive"]').onclick = () => {
      audio.playSFX('document');
      ctx.game.sceneManager.goTo('archive');
    };
    const travelBtn = body.querySelector('[data-action="travel"]');
    if (travelBtn && !isFinal) {
      travelBtn.onclick = () => {
        audio.playSFX('click');
        ctx.game.sceneManager.goTo('map');
      };
    }
    body.querySelector('[data-action="warrant"]').onclick = () => {
      audio.playSFX('click');
      this._openWarrantUI();
    };
    const capBtn = body.querySelector('[data-action="capture"]');
    if (capBtn) {
      capBtn.onclick = () => {
        audio.playSFX('capture');
        ctx.game.sceneManager.goTo('capture');
      };
    }
  }

  _openWarrantUI() {
    const ctx = this.ctx;
    const matches = ctx.clues.matchSuspects(ctx.suspectRoster);
    const knownCount = Object.keys(ctx.clues.knownAttributes).length;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal modal--wide" role="dialog" aria-modal="true">
        <h2>📜 Emitir orden de captura</h2>
        <p class="modal__hint">
          Con ${knownCount} atributo(s) conocido(s), hay ${matches.length} sospechoso(s) compatibles.
          Elegí con cuidado: una orden errónea te hace perder credibilidad pero no termina el caso.
        </p>
        ${matches.length === 0
          ? '<p class="modal__empty">No hay coincidencias. Recolectá más pistas.</p>'
          : `<ul class="suspect-list">
              ${matches.slice(0, 12).map(s => `
                <li>
                  <button class="suspect-card" data-id="${s.id}" style="--hue:${s.avatarHue}deg">
                    <div class="suspect-card__avatar"></div>
                    <div class="suspect-card__info">
                      <strong>${s.name}</strong>
                      <span>alias "${s.alias}"</span>
                      <small>${s.profession.name} · pelo ${s.hair.name}</small>
                    </div>
                  </button>
                </li>
              `).join('')}
            </ul>`
        }
        <div class="modal__actions">
          <button class="menu-btn" data-cancel>Cancelar</button>
        </div>
      </div>
    `;

    overlay.querySelector('[data-cancel]').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.querySelectorAll('[data-id]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const result = ctx.case.issueWarrant(id, ctx.suspectRoster);
        ctx.time.consume(1);
        overlay.remove();
        if (result.success) {
          bus.emit(EVENTS.SHOW_TOAST, {
            icon: '✅',
            title: 'Orden emitida correctamente',
            body: 'Las pruebas coinciden. Atrapalo en su destino final.',
            duration: 4000,
          });
        } else {
          bus.emit(EVENTS.SHOW_TOAST, {
            icon: '⚠️',
            title: 'Orden emitida (revisar)',
            body: 'Si las pistas no son sólidas, podés haber acusado a la persona equivocada.',
            duration: 4000,
          });
        }
        // Refrescar oficina
        this.onMount(this.body, this.ctx);
      };
    });

    document.body.appendChild(overlay);
  }

  async onUnmount() { audio.stopMusic(); }
}
