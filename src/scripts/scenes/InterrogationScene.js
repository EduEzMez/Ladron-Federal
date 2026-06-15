// =============================================================================
// INTERROGATION SCENE — Entrevistas con testigos
// Usa imágenes reales de detective y NPCs. Género del testigo determina qué
// imagen se muestra (npc-m1/2/3 para hombres, npc-f1/2/3 para mujeres).
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import gsap from 'gsap';

// Imágenes de testigos según género (rotación por id para variar)
const NPC_IMAGES = {
  m: ['assets/characters/npc-m1.png', 'assets/characters/npc-m2.png', 'assets/characters/npc-m3.png'],
  f: ['assets/characters/npc-f1.png', 'assets/characters/npc-f2.png', 'assets/characters/npc-f3.png'],
};

function getNpcImage(witness, index) {
  const pool = NPC_IMAGES[witness.gender] ?? NPC_IMAGES.m;
  return pool[index % pool.length];
}

export class InterrogationScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');
    this._render(body, ctx);
  }

  _render(body, ctx) {
    const stop = ctx.case.currentStop;
    const witnesses = stop.witnesses;
    const provinceName = ctx.case.currentProvince.name;

    body.innerHTML = `
      <section class="interrogation">
        <header class="interrogation__header">
          <button class="menu-btn menu-btn--ghost" data-action="back">← Volver</button>
          <div>
            <h2>👥 Testigos en ${provinceName}</h2>
            <p>Cada conversación consume <strong>2 horas</strong>.
               Tomá nota de cada palabra: el ladrón dejó pistas dispersas.</p>
          </div>
        </header>

        <ul class="witness-list">
          ${witnesses.map((w, i) => {
            const consulted = ctx.case.hasConsultedWitness(w.id);
            const img = getNpcImage(w, i);
            return `
              <li class="witness-card ${consulted ? 'is-consulted' : ''}">
                <div class="witness-card__portrait">
                  <img src="${img}" alt="${w.name}" loading="lazy" />
                  ${consulted ? '<span class="witness-card__check">✓</span>' : ''}
                </div>
                <div class="witness-card__info">
                  <strong>${w.name}</strong>
                  <span>${w.locationIcon ?? '📍'} ${w.location}</span>
                  ${consulted ? '<small class="witness-card__done">Ya conversaste</small>' : ''}
                </div>
                <button class="menu-btn ${consulted ? 'menu-btn--ghost' : 'menu-btn--primary'}"
                        data-witness="${w.id}">
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

    body.querySelectorAll('[data-witness]').forEach((btn, i) => {
      btn.onclick = () => {
        const id = btn.dataset.witness;
        const witness = witnesses.find(w => w.id === id);
        const witnessIndex = witnesses.indexOf(witness);
        this._showDialogue(witness, witnessIndex, ctx.case.hasConsultedWitness(id));
      };
    });

    gsap.from('.witness-card', { x: -30, opacity: 0, duration: 0.4, stagger: 0.1 });
  }

  _showDialogue(witness, witnessIndex, alreadyConsulted) {
    const ctx = this.ctx;

    if (!alreadyConsulted) {
      ctx.time.consume(2);
      ctx.case.markWitness(witness.id);
      if (witness.geographicClue) {
        ctx.clues.addGeographicClue(
          ctx.case.currentProvince.name,
          witness.geographicClue,
          ctx.time.snapshot().day
        );
      }
      if (witness.identityClue) {
        ctx.clues.addIdentityClue(
          witness.identityClue,
          witness.revealedAttribute,
          ctx.time.snapshot().day
        );
      }
      audio.playSFX('discover');
      ctx.game.saveCurrentGame();
    }

    const npcImg = getNpcImage(witness, witnessIndex);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay dialogue-overlay';
    overlay.innerHTML = `
      <div class="modal modal--dialogue" role="dialog" aria-modal="true" aria-label="Conversación con ${witness.name}">

        <!-- Cabecera testigo -->
        <header class="dialogue__head">
          <div class="dialogue__npc-portrait">
            <img src="${npcImg}" alt="${witness.name}" />
          </div>
          <div class="dialogue__npc-info">
            <strong>${witness.name}</strong>
            <span>${witness.locationIcon ?? '📍'} ${witness.location}</span>
          </div>
        </header>

        <!-- Intro -->
        <p class="dialogue__line dialogue__line--intro">"${witness.intro}"</p>

        <!-- Pistas -->
        <div class="dialogue__clues">
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
        </div>

        <!-- Outro -->
        <p class="dialogue__line dialogue__line--outro">"${witness.outro}"</p>

        <!-- Detective + botón -->
        <footer class="dialogue__footer">
          <div class="dialogue__detective">
            <img src="assets/characters/detective.png" alt="Tu detective" />
          </div>
          <button class="menu-btn menu-btn--primary dialogue__close">
            Anotar y cerrar 📝
          </button>
        </footer>

      </div>
    `;

    const modal = overlay.querySelector('.modal--dialogue');
    // Clicks dentro del modal NO propagan al overlay de fondo
    modal.addEventListener('click', (e) => e.stopPropagation());

    overlay.querySelector('.dialogue__close').onclick = (e) => {
      e.stopPropagation();
      overlay.remove();
      this._render(this.body, ctx);
    };
    // Solo cierra si el clic fue exactamente en el fondo oscuro
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);

    // Animación de entrada
    gsap.from(overlay.querySelector('.modal--dialogue'), {
      y: 30, opacity: 0, duration: 0.3, ease: 'back.out(1.4)'
    });

    if (!alreadyConsulted) {
      bus.emit(EVENTS.SHOW_TOAST, {
        icon: '📝',
        title: 'Pistas anotadas en el cuaderno',
        body: 'Revisalas arriba a la derecha.',
        duration: 2800,
      });
    }
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
