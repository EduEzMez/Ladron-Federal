// =============================================================================
// INTERROGATION SCENE — Entrevistas con testigos
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio }     from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import gsap from 'gsap';

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
    const stop        = ctx.case.currentStop;
    const witnesses   = stop.witnesses;
    const provinceName = ctx.case.currentProvince.name;

    body.innerHTML = `
      <section class="interrogation">
        <header class="interrogation__header">
          <button class="menu-btn menu-btn--ghost" id="btn-back-interrog">← Volver</button>
          <div>
            <h2>👥 Testigos en ${provinceName}</h2>
            <p>Cada conversación consume <strong>2 horas</strong>.
               Tomá nota de cada palabra: el ladrón dejó pistas dispersas.</p>
          </div>
        </header>

        <ul class="witness-list">
          ${witnesses.map((w, i) => {
            const consulted = ctx.case.hasConsultedWitness(w.id);
            const img       = getNpcImage(w, i);
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
                        data-witness-idx="${i}"
                        data-witness-id="${w.id}">
                  ${consulted ? 'Repasar' : 'Conversar (2h)'}
                </button>
              </li>
            `;
          }).join('')}
        </ul>
      </section>
    `;

    body.querySelector('#btn-back-interrog').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('office');
    };

    // ── Cada botón de testigo ──────────────────────────────────────────────
    body.querySelectorAll('[data-witness-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Parar propagación para que no llegue a ningún listener de fondo
        e.stopPropagation();
        e.stopImmediatePropagation();

        const idx     = parseInt(btn.dataset.witnessIdx, 10);
        const witness = witnesses[idx];
        this._openDialogue(witness, idx, ctx.case.hasConsultedWitness(witness.id), ctx);
      });
    });

    gsap.from('.witness-card', { x: -30, opacity: 0, duration: 0.35, stagger: 0.08 });
  }

  // ── Abre el modal de diálogo ─────────────────────────────────────────────
  _openDialogue(witness, idx, alreadyConsulted, ctx) {
    audio.playSFX('document');

    // Registrar pistas (solo si es primera vez)
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

    // ── Crear overlay ─────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.className   = 'modal-overlay dialogue-overlay';
    // pointer-events none hasta que lo habilitamos explícitamente
    overlay.style.pointerEvents = 'none';

    overlay.innerHTML = `
      <div class="modal modal--dialogue" role="dialog" aria-modal="true">
        <header class="dialogue__head">
          <div class="dialogue__npc-portrait">
            <img src="${getNpcImage(witness, idx)}" alt="${witness.name}" />
          </div>
          <div class="dialogue__npc-info">
            <strong>${witness.name}</strong>
            <span>${witness.locationIcon ?? '📍'} ${witness.location}</span>
          </div>
        </header>

        <p class="dialogue__line dialogue__line--intro">"${witness.intro}"</p>

        <div class="dialogue__clues">
          ${witness.geographicClue ? `
            <div class="dialogue__clue dialogue__clue--geo">
              <span class="dialogue__clue-icon">🧭</span>
              <p>"${witness.geographicClue}"</p>
            </div>` : ''}
          ${witness.identityClue ? `
            <div class="dialogue__clue dialogue__clue--id">
              <span class="dialogue__clue-icon">🔍</span>
              <p>"${witness.identityClue}"</p>
            </div>` : ''}
        </div>

        <p class="dialogue__line dialogue__line--outro">"${witness.outro}"</p>

        <footer class="dialogue__footer">
          <div class="dialogue__detective">
            <img src="assets/characters/detective.png" alt="Detective" />
          </div>
          <button class="menu-btn menu-btn--primary" id="btn-close-dialogue">
            Anotar y cerrar 📝
          </button>
        </footer>
      </div>
    `;

    document.body.appendChild(overlay);

    // ── CRÍTICO: habilitar interacción sólo DESPUÉS de que el click
    //    original ya fue completamente procesado por el browser (2 frames)
    let closeEnabled = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.pointerEvents = '';
      closeEnabled = true;

      // Botón cerrar
      document.getElementById('btn-close-dialogue').addEventListener('click', (e) => {
        e.stopPropagation();
        this._closeDialogue(overlay, ctx);
      });

      // Click en fondo oscuro
      overlay.addEventListener('click', (e) => {
        if (closeEnabled && e.target === overlay) {
          this._closeDialogue(overlay, ctx);
        }
      });
    }));

    // Animación entrada
    gsap.fromTo(
      overlay.querySelector('.modal--dialogue'),
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.5)' }
    );

    // Toast con delay para no interferir
    if (!alreadyConsulted) {
      setTimeout(() => bus.emit(EVENTS.SHOW_TOAST, {
        icon: '📝',
        title: 'Pistas anotadas',
        body: 'Revisalas en tu cuaderno (esquina superior).',
        duration: 2500,
      }), 800);
    }
  }

  _closeDialogue(overlay, ctx) {
    gsap.to(overlay.querySelector('.modal--dialogue'), {
      y: 20, opacity: 0, duration: 0.18,
      onComplete: () => {
        overlay.remove();
        this._render(this.body, ctx);
      }
    });
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
