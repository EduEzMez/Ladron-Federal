// =============================================================================
// MAP SCENE — Mapa 3D de Argentina
// El jugador selecciona la siguiente provincia a la que viajar. Si elige bien,
// avanza al TravelScene; si elige mal, pierde tiempo (viaje en vano) y vuelve.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { ProvinceMap3D } from '../components/ProvinceMap3D.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import { PROVINCES } from '../data/provinces.js';

export class MapScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');
    this._busy = false;

    const current = ctx.case.currentProvince;
    const visited = [...ctx.case.visitedProvinces];

    body.innerHTML = `
      <section class="map-scene">
        <header class="map-scene__header">
          <button class="menu-btn menu-btn--ghost" data-action="back">← Cancelar viaje</button>
          <div class="map-scene__title">
            <h2>🗺️ Elegí tu próximo destino</h2>
            <p>Tocá una provincia en el mapa. Las pistas que tenés señalan hacia dónde fue el ladrón.</p>
          </div>
        </header>

        <div class="map-scene__canvas-wrap">
          <canvas id="province-map-canvas" aria-label="Mapa interactivo de Argentina"></canvas>
          <div class="map-scene__legend">
            <span><span class="dot dot--current"></span> Estás acá</span>
            <span><span class="dot dot--visited"></span> Ya visitada</span>
            <span><span class="dot dot--available"></span> Disponible</span>
          </div>
        </div>

        <aside class="map-scene__sidebar">
          <h3>📋 Pistas geográficas</h3>
          ${ctx.clues.geographicClues.length === 0
            ? '<p class="map-scene__empty">Recolectá pistas hablando con testigos antes de viajar.</p>'
            : `<ul class="clue-list">
                ${ctx.clues.geographicClues.slice(-6).map(c => `
                  <li class="clue-list__item">
                    <span class="clue-list__from">desde ${c.provinceFrom}:</span>
                    <p>"${c.text}"</p>
                  </li>
                `).join('')}
              </ul>`
          }
          <div class="map-scene__costs">
            <strong>Costo de viaje:</strong>
            <span>· Misma región: 6h</span>
            <span>· Otra región: 12h</span>
          </div>
        </aside>
      </section>
    `;

    body.querySelector('[data-action="back"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('office');
    };

    const canvas = body.querySelector('#province-map-canvas');
    this.map = new ProvinceMap3D(canvas, {
      currentProvinceId: current.id,
      visitedProvinces: visited,
      highlightedProvinces: PROVINCES.filter(p => !visited.includes(p.id)).map(p => p.id),
      onSelect: (provinceId) => this._handleSelect(provinceId),
    });
    this.map.start();
  }

  async _handleSelect(provinceId) {
    if (this._busy) return;
    const ctx = this.ctx;
    const current = ctx.case.currentProvince;
    if (provinceId === current.id) {
      bus.emit(EVENTS.SHOW_TOAST, { icon: 'ℹ️', title: 'Ya estás en esa provincia' });
      return;
    }
    this._busy = true;
    audio.playSFX('confirm');

    const result = ctx.case.travelTo(provinceId);

    if (result.success) {
      // Viaje correcto: ir a la escena de viaje
      const province = result.province;
      const fromRegion = current.region;
      const toRegion = province.region;
      const hours = fromRegion === toRegion ? 6 : 12;
      ctx.game.sceneManager.goTo('travel', {
        from: current,
        to: province,
        hours,
      });
    } else if (result.reason === 'wrong_destination') {
      // Pista falsa: pierde un viaje corto, vuelve a la oficina
      ctx.time.consume(6);
      bus.emit(EVENTS.SHOW_TOAST, {
        icon: '❌',
        title: 'Pista falsa',
        body: `El ladrón no fue a esa provincia. Perdiste 6 horas. Volvé a revisar las pistas.`,
        duration: 4500,
      });
      audio.playSFX('error');
      setTimeout(() => ctx.game.sceneManager.goTo('office'), 1200);
    } else if (result.reason === 'no_next') {
      bus.emit(EVENTS.SHOW_TOAST, { icon: 'ℹ️', title: 'Ya estás en el destino final', body: 'Emití la orden y capturalo.' });
      this._busy = false;
    } else {
      this._busy = false;
    }
  }

  onResize() {
    this.map?.resize();
  }

  async onUnmount() {
    this.map?.destroy();
    this.map = null;
    audio.stopMusic();
  }
}
