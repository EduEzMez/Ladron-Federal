// =============================================================================
// INTRO SCENE — Introducción animada del caso
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import gsap from 'gsap';

export class IntroScene extends BaseScene {
  constructor() { super({ showHud: false }); }

  async onMount(body, ctx) {
    audio.playMusic('investigate');
    const c = ctx.case.activeCase;

    body.innerHTML = `
      <section class="intro-scene">
        <div class="intro-scene__panel">
          <header class="intro-scene__header">
            <span class="intro-scene__stamp">EXPEDIENTE</span>
            <h2 class="intro-scene__title">${c.title}</h2>
          </header>
          <div class="intro-scene__body">
            <div class="intro-scene__object">
              <span class="intro-scene__category">${c.stolen.category.toUpperCase()}</span>
              <p class="intro-scene__obj-name">${c.stolen.name}</p>
              <p class="intro-scene__obj-desc">${c.stolen.description}</p>
              <p class="intro-scene__location">📍 Robado en ${c.origin.name} (${c.origin.region})</p>
            </div>
            <div class="intro-scene__briefing">
              <h3>Informe inicial</h3>
              <p class="typewriter">${c.briefing}</p>
            </div>
          </div>
          <footer class="intro-scene__footer">
            <button class="menu-btn menu-btn--primary" data-action="start">Aceptar misión →</button>
          </footer>
        </div>
      </section>
    `;

    gsap.from('.intro-scene__panel', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' });
    gsap.from('.intro-scene__obj-name', { scale: 0.7, opacity: 0, duration: 0.5, delay: 0.3 });

    body.querySelector('[data-action="start"]').onclick = () => {
      audio.playSFX('confirm');
      ctx.game.sceneManager.goTo('office');
    };
  }

  async onUnmount() { audio.stopMusic(); }
}
