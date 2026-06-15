// =============================================================================
// CAPTURE SCENE — Captura final
// Anima la captura. Si el sospechoso emitido en la orden coincide con el real
// y estamos en la provincia final, el caso se gana (Game.js escucha y rutea
// a VictoryScene vía SUSPECT_CAPTURED). Si no, vuelve a la oficina.
// =============================================================================

import { BaseScene } from './BaseScene.js';
import { audio } from '../systems/AudioSystem.js';
import { bus, EVENTS } from '../core/EventBus.js';
import gsap from 'gsap';

export class CaptureScene extends BaseScene {
  async onMount(body, ctx) {
    audio.playMusic('investigate');

    const result = ctx.case.attemptCapture();

    body.innerHTML = `
      <section class="capture-scene">
        <div class="capture-scene__stage">
          <div class="capture-scene__beam" aria-hidden="true"></div>
          <div class="capture-scene__suspect">
            <div class="capture-scene__avatar" style="--hue:${ctx.case.warrantSuspect?.avatarHue ?? 0}deg">🕵️</div>
            <p class="capture-scene__name">${ctx.case.warrantSuspect?.name ?? '???'}</p>
            <p class="capture-scene__alias">alias "${ctx.case.warrantSuspect?.alias ?? ''}"</p>
          </div>
        </div>
        <div class="capture-scene__verdict" id="verdict"></div>
      </section>
    `;

    const beam = body.querySelector('.capture-scene__beam');
    const avatar = body.querySelector('.capture-scene__avatar');
    const verdict = body.querySelector('#verdict');

    // Animación de captura
    gsap.from(avatar, { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' });
    gsap.fromTo(beam,
      { opacity: 0, scaleY: 0 },
      { opacity: 1, scaleY: 1, duration: 0.8, delay: 0.4 }
    );

    setTimeout(() => {
      if (result.success) {
        verdict.innerHTML = `
          <h2 class="capture-scene__win">🎉 ¡Captura exitosa!</h2>
          <p>Hiciste justicia. El patrimonio cultural está a salvo.</p>
        `;
        gsap.from('.capture-scene__win', { scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' });
        audio.playSFX('capture');
        // El evento SUSPECT_CAPTURED ya fue emitido desde case.attemptCapture()
        // Game.js está escuchando y enviará a 'victory'.
      } else {
        let title = '❌ Captura fallida';
        let body = '';
        if (result.reason === 'no_warrant') {
          body = 'Primero tenés que emitir una orden de captura contra un sospechoso.';
        } else if (result.reason === 'not_final') {
          body = 'Aún no estás en el destino final del ladrón. Seguí las pistas.';
        } else if (result.reason === 'wrong_suspect') {
          body = 'La persona que detuviste no coincide con el verdadero ladrón. ' +
                 'Revisá tus pistas: alguna fue malinterpretada.';
        }
        verdict.innerHTML = `
          <h2 class="capture-scene__lose">${title}</h2>
          <p>${body}</p>
          <button class="menu-btn menu-btn--primary" data-action="back">Volver a la oficina</button>
        `;
        audio.playSFX('error');
        verdict.querySelector('[data-action="back"]').onclick = () => {
          ctx.game.sceneManager.goTo('office');
        };
        bus.emit(EVENTS.SHOW_TOAST, {
          icon: '⚠️',
          title: 'Algo salió mal',
          body: body,
          duration: 5000,
        });
      }
    }, 1200);
  }

  async onUnmount() {
    audio.stopMusic();
  }
}
