// =============================================================================
// CREDITS SCENE — Créditos del equipo
// Roles según especificación AAA: Game Designer, Narrative, Psicopedagogo, etc.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import gsap from 'gsap';

const CREDITS = [
  { role: 'Lead Game Designer', desc: 'Estructura de juego, sistema de tiempo, balance educativo.' },
  { role: 'Narrative Designer', desc: 'Historia de "Los Saqueadores del Patrimonio", testigos, diálogos.' },
  { role: 'Psicopedagogo (10–12 años)', desc: 'Curva de aprendizaje, accesibilidad cognitiva, sin violencia.' },
  { role: 'UX/UI Designer', desc: 'Pantallas, navegación, paleta, tipografía, mobile-first.' },
  { role: 'Frontend Architect', desc: 'Arquitectura modular Vanilla JS ES2025, bus de eventos, escenas.' },
  { role: 'Senior JavaScript Developer', desc: 'Sistemas de juego, generadores procedurales, persistencia.' },
  { role: 'Senior Three.js Developer', desc: 'Mapa 3D interactivo de Argentina, cámara, raycasting, animación.' },
  { role: 'Art Director', desc: 'Estilo cartoon low-poly, paleta amistosa, mascota detective.' },
  { role: 'Sound Designer', desc: 'Música y FX procedurales con Web Audio API (sin copyright).' },
  { role: 'QA Engineer', desc: 'Casos generados deterministas, validación de pistas, accesibilidad.' },
];

const CONTENT_SOURCES = [
  'Geografía y datos culturales: dominio público de uso educativo.',
  'Audio: generación procedural con Web Audio API.',
  'Tipografías: Nunito (Google Fonts).',
  'Three.js (MIT License), GSAP (free for non-commercial).',
];

export class CreditsScene extends BaseScene {
  constructor() { super({ showHud: false }); }

  async onMount(body, ctx) {
    audio.playMusic('menu');

    body.innerHTML = `
      <section class="credits-scene">
        <header class="credits-scene__header">
          <button class="menu-btn menu-btn--ghost" data-action="back">← Volver</button>
          <h1>🎬 Créditos</h1>
        </header>

        <div class="credits-scene__intro">
          <h2>Tras las Huellas del Ladrón Federal</h2>
          <p>Un juego educativo argentino sobre patrimonio cultural, deducción y geografía.</p>
        </div>

        <div class="credits-scene__team">
          <h3>Equipo</h3>
          <ul class="credits-list">
            ${CREDITS.map(c => `
              <li class="credit-item">
                <strong>${c.role}</strong>
                <p>${c.desc}</p>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="credits-scene__sources">
          <h3>Tecnologías y contenido</h3>
          <ul>
            ${CONTENT_SOURCES.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <p class="credits-scene__signature">
          Hecho con ❤️ para que aprender geografía argentina sea una aventura.
        </p>
      </section>
    `;

    body.querySelector('[data-action="back"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('title');
    };

    gsap.from('.credit-item', { y: 20, opacity: 0, duration: 0.4, stagger: 0.05 });
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
