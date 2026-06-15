// =============================================================================
// TRAVEL SCENE — Tránsito animado
// Animación cinemática del viaje. Consume las horas correspondientes y luego
// devuelve al jugador a la oficina, ya en la nueva provincia.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import gsap from 'gsap';

export class TravelScene extends BaseScene {
  async onMount(body, ctx, payload) {
    audio.playMusic('travel');
    audio.playSFX('airplane');

    const { from, to, hours } = payload ?? {};
    if (!from || !to) {
      ctx.game.sceneManager.goTo('office');
      return;
    }

    body.innerHTML = `
      <section class="travel-scene">
        <div class="travel-scene__sky" aria-hidden="true">
          <div class="cloud cloud--1"></div>
          <div class="cloud cloud--2"></div>
          <div class="cloud cloud--3"></div>
          <div class="cloud cloud--4"></div>
        </div>

        <div class="travel-scene__route">
          <div class="travel-scene__pin travel-scene__pin--from">
            <span class="travel-scene__dot"></span>
            <p>${from.name}</p>
          </div>

          <div class="travel-scene__dashes" aria-hidden="true"></div>

          <div class="travel-scene__plane" aria-hidden="true">✈️</div>

          <div class="travel-scene__pin travel-scene__pin--to">
            <span class="travel-scene__dot"></span>
            <p>${to.name}</p>
          </div>
        </div>

        <div class="travel-scene__card">
          <h2>En vuelo hacia ${to.name}</h2>
          <p>${to.capital} · región ${to.region}</p>
          <p class="travel-scene__time">Tiempo de viaje: ${hours} horas</p>
          <div class="travel-scene__progress">
            <div class="travel-scene__bar"></div>
          </div>
          <p class="travel-scene__fact">📖 ${this._fact(to)}</p>
        </div>
      </section>
    `;

    // Animaciones
    const plane = body.querySelector('.travel-scene__plane');
    const bar = body.querySelector('.travel-scene__bar');
    gsap.fromTo(plane,
      { x: '-12rem', y: 0, rotation: 0 },
      { x: '12rem', y: -10, rotation: 5, duration: 3.5, ease: 'power1.inOut', yoyo: false }
    );
    gsap.fromTo('.cloud',
      { x: 0 },
      { x: -200, duration: 4, ease: 'none', stagger: { each: 0.3, from: 'random' } }
    );
    gsap.fromTo(bar, { width: '0%' }, { width: '100%', duration: 3.5, ease: 'power1.inOut' });
    gsap.from('.travel-scene__card', { y: 40, opacity: 0, duration: 0.6 });

    // Esperar la animación y luego consumir el tiempo y volver a la oficina
    await new Promise(r => setTimeout(r, 3700));
    ctx.time.consume(hours);
    ctx.game.saveCurrentGame();
    ctx.game.sceneManager.goTo('office');
  }

  _fact(province) {
    // Selecciona un dato cultural o geográfico para mostrar durante el vuelo
    const culturalSample = province.cultural?.[0];
    const landmarkSample = province.landmarks?.[0];
    const foodSample = province.food?.[0];
    const opts = [
      culturalSample && `Dato cultural: ${culturalSample}`,
      landmarkSample && `Atractivo: ${landmarkSample}`,
      foodSample && `Comida típica: ${foodSample}`,
      `Terreno predominante: ${province.terrain}`,
    ].filter(Boolean);
    return opts[Math.floor(Math.random() * opts.length)];
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
