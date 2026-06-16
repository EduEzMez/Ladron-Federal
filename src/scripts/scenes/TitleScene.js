// =============================================================================
// TITLE SCENE — Pantalla inicial
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { saveSystem } from '../systems/SaveSystem.js';
import { audio } from '../systems/AudioSystem.js';
import { generateTutorialPdf } from '../components/PDFGenerator.js';
import { bus, EVENTS } from '../core/EventBus.js';
import gsap from 'gsap';

export class TitleScene extends BaseScene {
  constructor() { super({ showHud: false }); }

  async onMount(body, ctx) {
    audio.init();
    audio.playMusic('menu');

    body.innerHTML = `
      <div class="title-screen">
        <div class="title-screen__bg" aria-hidden="true">
          <div class="bg-shape bg-shape--1"></div>
          <div class="bg-shape bg-shape--2"></div>
          <div class="bg-shape bg-shape--3"></div>
        </div>
        <div class="title-screen__layout">
          <!-- Detective -->
          <div class="title-screen__detective" aria-hidden="true">
            <img src="assets/characters/detective-full.png" alt="Detective" />
          </div>
          <!-- Panel de menú -->
          <div class="title-screen__content">
            <h1 class="title-screen__game-title">
              <span class="title-screen__tag">Tras las Huellas del</span>
              <span class="title-screen__main">Ladrón Federal</span>
            </h1>
            <p class="title-screen__subtitle">
              Agencia Federal de Protección Cultural · Misión: recuperar el patrimonio argentino
            </p>
            <nav class="title-screen__menu" aria-label="Menú principal">
              <button class="menu-btn menu-btn--primary" data-action="new">▶ Nueva partida</button>
              <button class="menu-btn" data-action="continue" ${saveSystem.hasSave() ? '' : 'disabled'}>↻ Continuar</button>
              <button class="menu-btn" data-action="achievements">🏆 Logros</button>
              <button class="menu-btn" data-action="tutorial">📄 Cómo jugar (PDF)</button>
              <button class="menu-btn" data-action="credits">🎬 Créditos</button>
            </nav>
            <p class="title-screen__hint">10–12 años · sin violencia · educativo</p>
          </div>
        </div>
      </div>
    `;

    body.querySelector('[data-action="new"]').onclick = () => {
      audio.playSFX('confirm');
      ctx.game.startNewGame();
    };
    body.querySelector('[data-action="continue"]').onclick = () => {
      audio.playSFX('confirm');
      const ok = ctx.game.continueGame();
      if (!ok) bus.emit(EVENTS.SHOW_TOAST, { icon: '⚠️', title: 'No hay partida guardada' });
    };
    body.querySelector('[data-action="achievements"]').onclick = () => this._showAchievements();
    body.querySelector('[data-action="tutorial"]').onclick = () => generateTutorialPdf();
    body.querySelector('[data-action="credits"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('credits');
    };

    // Animaciones de entrada
    const title = body.querySelector('.title-screen__game-title');
    gsap.from(title, { y: -40, opacity: 0, duration: 0.8, ease: 'back.out(1.4)' });
    gsap.from('.menu-btn', { y: 20, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.3 });
    gsap.from('.title-screen__detective img', {
      x: -60, opacity: 0, duration: 0.9, ease: 'back.out(1.2)', delay: 0.1
    });
    gsap.to('.bg-shape', {
      rotation: '+=360',
      duration: 60,
      ease: 'none',
      repeat: -1,
      stagger: { each: 20, from: 'random' },
    });
  }

  _showAchievements() {
    const ctx = this.ctx;
    const all = ctx.achievements.getAll();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h2>🏆 Logros</h2>
        <ul class="achievement-list">
          ${all.map(a => `
            <li class="achievement ${a.unlocked ? 'is-unlocked' : 'is-locked'}">
              <span class="achievement__icon">${a.unlocked ? a.icon : '🔒'}</span>
              <div>
                <strong>${a.name}</strong>
                <p>${a.description}</p>
              </div>
            </li>
          `).join('')}
        </ul>
        <button class="menu-btn">Cerrar</button>
      </div>
    `;
    overlay.querySelector('button').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
