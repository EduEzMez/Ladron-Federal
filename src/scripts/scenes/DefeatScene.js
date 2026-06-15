// =============================================================================
// DEFEAT SCENE — Pantalla de Derrota
// Mensaje motivador (sin frustración: este es un juego educativo). Resumen
// del caso fallido para que el jugador entienda qué pasó.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import gsap from 'gsap';

const REASON_COPY = {
  time: {
    icon: '⏰',
    title: 'Se acabó el tiempo',
    body: 'El ladrón aprovechó cada hora que perdiste. La próxima vez planificá mejor: ' +
          'cada testigo cuesta 2h, cada viaje 6h o 12h.',
  },
  default: {
    icon: '😶',
    title: 'El caso quedó sin resolver',
    body: 'A veces los detectives no logran atrapar al criminal a la primera. ' +
          'Reflexioná sobre las pistas y volvé a intentarlo.',
  },
};

export class DefeatScene extends BaseScene {
  constructor() { super({ showHud: false }); }

  async onMount(body, ctx, payload) {
    audio.playMusic('defeat');
    const reason = payload?.reason ?? 'default';
    const copy = REASON_COPY[reason] ?? REASON_COPY.default;

    const c = ctx.case.activeCase;
    const real = c?.suspect;
    const stolen = c?.stolen;

    body.innerHTML = `
      <section class="ending ending--lose">
        <div class="ending__panel">
          <div class="ending__icon">${copy.icon}</div>
          <h1 class="ending__title">${copy.title}</h1>
          <p class="ending__sub">${copy.body}</p>

          ${real ? `
            <article class="ending__reveal">
              <h3>El ladrón era…</h3>
              <div class="ending__suspect-card">
                <div class="ending__suspect-avatar" style="--hue:${real.avatarHue}deg">🕵️</div>
                <div>
                  <strong>${real.name}</strong>
                  <p>alias "${real.alias}"</p>
                  <small>${real.profession.name} · pelo ${real.hair.name} · le gusta ${real.hobby.name}</small>
                </div>
              </div>
              ${stolen ? `<p class="ending__reveal-stolen">Logró escapar con <strong>${stolen.name}</strong>.</p>` : ''}
            </article>
          ` : ''}

          <div class="ending__motivation">
            <h3>💡 Para tu próximo caso</h3>
            <ul>
              <li>Hablá con todos los testigos: cada uno aporta una pista distinta.</li>
              <li>Anotá los atributos del sospechoso (cabello, profesión, hobby): cada uno reduce la lista.</li>
              <li>Releé las pistas geográficas: nombran terrenos, climas y comidas típicas.</li>
              <li>No emitas la orden de captura hasta tener al menos 3 atributos verificados.</li>
            </ul>
          </div>

          <div class="ending__actions">
            <button class="menu-btn menu-btn--primary" data-action="retry">Intentar otro caso</button>
            <button class="menu-btn" data-action="title">Volver al menú</button>
          </div>
        </div>
      </section>
    `;

    body.querySelector('[data-action="retry"]').onclick = () => {
      audio.playSFX('confirm');
      ctx.game.startNewGame();
    };
    body.querySelector('[data-action="title"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('title');
    };

    gsap.from('.ending__panel', { y: 40, opacity: 0, duration: 0.6 });
    gsap.from('.ending__motivation li', { x: -20, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.4 });
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
