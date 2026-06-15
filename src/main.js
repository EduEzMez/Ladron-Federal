// =============================================================================
// MAIN — Punto de entrada
// =============================================================================

import { Game } from './scripts/core/Game.js';
import { ToastHost } from './scripts/components/Toast.js';
import { saveSystem } from './scripts/systems/SaveSystem.js';
import { bus, EVENTS } from './scripts/core/EventBus.js';

// Aplicar preferencias de accesibilidad guardadas
const settings = saveSystem.getSettings();
if (settings.highContrast) document.documentElement.setAttribute('data-contrast', 'high');
if (settings.fontScale) document.documentElement.style.setProperty('--font-scale', settings.fontScale);

// Toast host global
const toast = new ToastHost();
toast.mount(document.body);

// Iniciar juego
const root = document.getElementById('app');
const game = new Game(root);
window.__game = game; // útil para debugging en consola
game.boot();

// Guardar al cerrar la pestaña
window.addEventListener('beforeunload', () => {
  if (game.case.activeCase) game.saveCurrentGame();
});

// Pausar audio al perder foco (consideración móvil)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) game.context.audio.stopMusic();
});

// Menú in-game (HUD lo emite vía 'ui:open-menu')
bus.on('ui:open-menu', () => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h2>⏸️ Menú</h2>
      <p class="modal__hint">Tu progreso se guarda automáticamente.</p>
      <div class="modal__actions" style="flex-direction: column; align-items: stretch;">
        <button class="menu-btn menu-btn--primary" data-action="resume">Seguir jugando</button>
        <button class="menu-btn" data-action="save">Guardar ahora</button>
        <button class="menu-btn" data-action="title">Volver al menú principal</button>
      </div>
    </div>
  `;
  overlay.querySelector('[data-action="resume"]').onclick = () => overlay.remove();
  overlay.querySelector('[data-action="save"]').onclick = () => {
    game.saveCurrentGame();
    bus.emit(EVENTS.SHOW_TOAST, { icon: '💾', title: 'Partida guardada', duration: 2000 });
    overlay.remove();
  };
  overlay.querySelector('[data-action="title"]').onclick = () => {
    game.saveCurrentGame();
    overlay.remove();
    game.sceneManager.goTo('title');
  };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
});
