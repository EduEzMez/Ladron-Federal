// =============================================================================
// VICTORY SCENE — Pantalla de Victoria
// Resumen del caso: tiempo usado, provincias visitadas, atributos descubiertos,
// objeto recuperado. Botones para jugar otro caso o volver al menú.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import gsap from 'gsap';

export class VictoryScene extends BaseScene {
  constructor() { super({ showHud: false }); }

  async onMount(body, ctx) {
    audio.playMusic('victory');
    audio.playSFX('capture');

    const c = ctx.case.activeCase;
    if (!c) {
      ctx.game.sceneManager.goTo('title');
      return;
    }

    const time = ctx.time.snapshot();
    const daysUsed = Math.max(1, ctx.time.totalDays - time.day + 1);
    const provincesCount = ctx.case.visitedProvinces.size;
    const attrCount = Object.keys(ctx.clues.knownAttributes).length;

    body.innerHTML = `
      <section class="ending ending--win">
        <div class="ending__confetti" aria-hidden="true">
          ${[...Array(28)].map((_, i) => `<span class="confetti" style="--i:${i};--hue:${(i * 47) % 360}"></span>`).join('')}
        </div>

        <div class="ending__panel">
          <h1 class="ending__title">🎉 ¡Caso resuelto!</h1>
          <p class="ending__sub">Recuperaste <strong>${c.stolen.name}</strong> y capturaste a <strong>${c.suspect.name}</strong>.</p>

          <article class="ending__stolen-card">
            <h3>Objeto recuperado</h3>
            <p>${c.stolen.name}</p>
            <small>${c.stolen.description}</small>
            <p class="ending__stolen-origin">Volverá a ${c.origin.name} 🛡️</p>
          </article>

          <ul class="ending__stats">
            <li><strong>${daysUsed}</strong><span>días usados</span></li>
            <li><strong>${provincesCount}</strong><span>provincias visitadas</span></li>
            <li><strong>${attrCount}</strong><span>atributos descubiertos</span></li>
            <li><strong>${ctx.case.warrantAttempts}</strong><span>órdenes emitidas</span></li>
          </ul>

          <article class="ending__suspect-card">
            <div class="ending__suspect-avatar" style="--hue:${c.suspect.avatarHue}deg">🕵️</div>
            <div>
              <h3>${c.suspect.name}</h3>
              <p>alias "${c.suspect.alias}"</p>
              <small>${c.suspect.profession.name} · pelo ${c.suspect.hair.name} · ${c.suspect.hobby.name}</small>
            </div>
          </article>

          <div class="ending__actions">
            <button class="menu-btn menu-btn--primary" data-action="new">Resolver otro caso</button>
            <button class="menu-btn" data-action="title">Volver al menú</button>
          </div>
        </div>
      </section>
    `;

    body.querySelector('[data-action="new"]').onclick = () => {
      audio.playSFX('confirm');
      ctx.game.startNewGame();
    };
    body.querySelector('[data-action="title"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('title');
    };

    gsap.from('.ending__title', { y: -30, scale: 0.7, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' });
    gsap.from('.ending__stolen-card, .ending__stats > li, .ending__suspect-card', {
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.3
    });
    gsap.from('.confetti', {
      y: -300, rotation: 'random(-360, 360)', duration: 'random(2, 4)',
      ease: 'power1.in', stagger: { each: 0.04, from: 'random' }, repeat: -1, repeatDelay: 1
    });
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
