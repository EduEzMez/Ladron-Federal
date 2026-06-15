// =============================================================================
// MAP SCENE — Mapa SVG 2D de Argentina
// El jugador selecciona la siguiente provincia. Si elige bien avanza;
// si elige mal pierde tiempo y vuelve a la oficina.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { ProvinceMapSVG } from '../components/ProvinceMapSVG.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import { PROVINCES } from '../data/provinces.js';

export class MapScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');
    this._busy = false;

    const current  = ctx.case.currentProvince;
    const visited  = [...ctx.case.visitedProvinces];
    // Provincias disponibles = todas excepto la actual y las ya visitadas
    const available = PROVINCES
      .filter(p => !visited.includes(p.id) && p.id !== current.id)
      .map(p => p.id);

    body.innerHTML = `
      <section class="map-scene">
        <header class="map-scene__header">
          <button class="menu-btn menu-btn--ghost" data-action="back">← Cancelar</button>
          <div class="map-scene__title">
            <h2>🗺️ ¿A dónde vas?</h2>
            <p>Tocá una provincia coloreada. Las pistas te señalan el camino.</p>
          </div>
        </header>

        <div class="map-scene__body">
          <div class="map-scene__map-wrap" id="svg-map-container"></div>

          <aside class="map-scene__sidebar">
            <div class="map-scene__legend">
              <h3>Referencias</h3>
              <ul>
                <li><span class="legend-dot" style="background:#E63946"></span> Estás acá</li>
                <li><span class="legend-dot" style="background:#06D6A0"></span> Ya visitada</li>
                <li><span class="legend-dot" style="background:#118AB2"></span> Disponible</li>
                <li><span class="legend-dot" style="background:#CBD5E1"></span> No disponible</li>
              </ul>
            </div>

            <div class="map-scene__clues">
              <h3>📋 Pistas geográficas</h3>
              ${ctx.clues.geographicClues.length === 0
                ? '<p class="map-scene__empty">Entrevistá testigos antes de viajar para conseguir pistas.</p>'
                : `<ul class="clue-list">
                    ${ctx.clues.geographicClues.slice(-5).map(c => `
                      <li class="clue-list__item">
                        <span class="clue-list__from">desde ${c.provinceFrom}:</span>
                        <p>"${c.text}"</p>
                      </li>
                    `).join('')}
                  </ul>`
              }
            </div>

            <div class="map-scene__costs">
              <strong>⏱ Costo de viaje</strong>
              <p>Misma región: <strong>6h</strong></p>
              <p>Otra región: <strong>12h</strong></p>
              <p class="map-scene__cost-warn">Un viaje incorrecto cuesta 6h.</p>
            </div>
          </aside>
        </div>
      </section>
    `;

    body.querySelector('[data-action="back"]').onclick = () => {
      audio.playSFX('click');
      ctx.game.sceneManager.goTo('office');
    };

    const mapContainer = body.querySelector('#svg-map-container');
    this._map = new ProvinceMapSVG(mapContainer, {
      currentProvinceId:  current.id,
      visitedProvinces:   visited,
      availableProvinces: available,
      onSelect: (id) => this._handleSelect(id),
    });
    this._map.render();
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
      const province = result.province;
      const hours = current.region === province.region ? 6 : 12;
      ctx.game.sceneManager.goTo('travel', { from: current, to: province, hours });
    } else if (result.reason === 'wrong_destination') {
      ctx.time.consume(6);
      audio.playSFX('error');
      bus.emit(EVENTS.SHOW_TOAST, {
        icon: '❌',
        title: 'Pista falsa',
        body: 'El ladrón no fue a esa provincia. Perdiste 6 horas.',
        duration: 4000,
      });
      setTimeout(() => ctx.game.sceneManager.goTo('office'), 1400);
    } else if (result.reason === 'no_next') {
      bus.emit(EVENTS.SHOW_TOAST, {
        icon: 'ℹ️',
        title: 'Ya estás en el destino final',
        body: 'Emití la orden de captura y atrapalo.',
      });
      this._busy = false;
    } else {
      this._busy = false;
    }
  }

  async onUnmount() {
    this._map?.destroy();
    this._map = null;
    audio.stopMusic();
  }
}
