// =============================================================================
// SCENE MANAGER
// Coordina las transiciones entre escenas. Cada escena debe implementar:
//   mount(container, gameContext)
//   unmount()
//   onResize() [opcional]
// =============================================================================

import { bus, EVENTS } from './EventBus.js';

export class SceneManager {
  constructor(container, gameContext) {
    this.container = container;
    this.gameContext = gameContext;
    this.scenes = new Map();
    this.activeScene = null;
    this.activeSceneId = null;
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  register(id, scene) {
    this.scenes.set(id, scene);
  }

  async goTo(id, payload) {
    const next = this.scenes.get(id);
    if (!next) {
      console.error(`[SceneManager] escena no registrada: ${id}`);
      return;
    }

    // Desmontar la actual
    if (this.activeScene) {
      try { await this.activeScene.unmount(); }
      catch (e) { console.error('[SceneManager] error al desmontar:', e); }
    }

    // Limpiar contenedor
    this.container.innerHTML = '';

    // Montar la nueva
    this.activeScene = next;
    this.activeSceneId = id;
    try {
      await next.mount(this.container, this.gameContext, payload);
      bus.emit(EVENTS.SCENE_CHANGE, { id, payload });
      bus.emit(EVENTS.SCENE_LOADED, { id, payload });
    } catch (e) {
      console.error(`[SceneManager] error al montar "${id}":`, e);
    }
  }

  _onResize() {
    if (this.activeScene?.onResize) {
      this.activeScene.onResize();
    }
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    if (this.activeScene) this.activeScene.unmount();
  }
}
