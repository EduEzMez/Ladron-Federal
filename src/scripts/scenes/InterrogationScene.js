// =============================================================================
// INTERROGATION SCENE — Entrevistas con testigos
// Lista los testigos disponibles en la provincia actual. Cada entrevista
// consume 2 horas y aporta una pista geográfica (apuntando al próximo destino)
// y una pista de identidad (atributo del sospechoso).
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import gsap from 'gsap';

export class InterrogationScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');
    this._render(body, ctx);
  }

  _render(body, ctx) {
    const stop = ctx.case.currentStop;
    const witnesses = stop.witnesses;

    body.innerHTML = `
      <section class="interrogation">
        <header class="interrogation__header">
          <button class="menu-btn menu-btn--ghost" data-action="back">← Volver</button>
          <h2>👥 Testigos en ${stop.province.name}</h2>
          <p>Cada conversación consume <strong>2 horas</strong>. Tomá nota de cada palabra:
          el ladrón dejó pistas dispersas que tendrás que armar como un rompecabezas.</p>
        </header>

        <ul class="witness-list">
          ${witnesses.map((w, i) => {
            const consulted = ctx.case.hasConsultedWitness(w.id);
            return `
              <li class="witness-card ${consulted ? 'is-consulted' : ''}">
                <div class="witness-card__avatar" style="--hue:${(i * 87) % 360}deg">👤</div>
                <div class="witness-card__info">
                  <strong>${w.name}</strong>
                  <span>${w.location}</span>
                  ${consulted ? '<small class="witness-card__done">✓ Ya conversaste</small>' : ''}
                </div>
                <button class="menu-btn ${consulted ? 'menu-btn--ghost' : ''}" data-witness="${w.id}">
                  ${consulted ? 'Repasar' : 'Conversar (2h)'}
                </button>
              </li>
            `;
          }).join('')}
        </ul>
      </section>
    `;

    body.querySelector('[data-action="back"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('office');
    };

    body.querySelectorAll('[data-witness]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.witness;
        const witness = witnesses.find(w => w.id === id);
        const alreadyConsulted = ctx.case.hasConsultedWitness(id);
        this._showDialogue(witness, alreadyConsulted);
      };
    });

    gsap.from('.witness-card', { x: -30, opacity: 0, duration: 0.4, stagger: 0.08 });
  }

  _showDialogue(witness, alreadyConsulted) {
    const ctx = this.ctx;
    const day = ctx.time.snapshot().day;

    // Si es nueva consulta, consume tiempo y registra pistas
    if (!alreadyConsulted) {
      ctx.time.consume(2);
      ctx.case.markWitness(witness.id);
      if (witness.geographicClue) {
        ctx.clues.addGeographicClue(ctx.case.currentProvince.name, witness.geographicClue, day);
      }
      if (witness.identityClue) {
        ctx.clues.addIdentityClue(witness.identityClue, witness.revealedAttribute, day);
      }
      audio.playSFX('discover');
      ctx.game.saveCurrentGame();
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal modal--dialogue" role="dialog" aria-modal="true">
        <header class="dialogue__head">
          <div class="dialogue__avatar">👤</div>
          <div>
            <strong>${witness.name}</strong>
            <span>${witness.location}</span>
          </div>
        </header>

        <p class="dialogue__line">"${witness.intro}"</p>

        ${witness.geographicClue ? `
          <div class="dialogue__clue dialogue__clue--geo">
            <span class="dialogue__clue-icon">🧭</span>
            <p>"${witness.geographicClue}"</p>
          </div>
        ` : ''}

        ${witness.identityClue ? `
          <div class="dialogue__clue dialogue__clue--id">
            <span class="dialogue__clue-icon">🔍</span>
            <p>"${witness.identityClue}"</p>
          </div>
        ` : ''}

        <p class="dialogue__line dialogue__line--outro">"${witness.outro}"</p>

        <div class="modal__actions">
          <button class="menu-btn menu-btn--primary">Anotar y cerrar</button>
        </div>
      </div>
    `;
    overlay.querySelector('.menu-btn').onclick = () => {
      overlay.remove();
      // Re-renderizar para mostrar el estado consultado y actualizar HUD
      this._render(this.body, ctx);
    };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);

    if (!alreadyConsulted) {
      bus.emit(EVENTS.SHOW_TOAST, {
        icon: '📝',
        title: 'Nuevas pistas anotadas',
        body: 'Revisalas en tu cuaderno (esquina superior).',
        duration: 3000,
      });
    }
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
