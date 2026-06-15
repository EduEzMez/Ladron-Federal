// =============================================================================
// EVENTBUS
// Bus de eventos pub/sub que desacopla escenas, sistemas y componentes.
// Es el "nervio central" del juego: cualquier sistema puede emitir o escuchar.
// =============================================================================

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const off = this.on(event, (...args) => {
      off();
      callback(...args);
    });
    return off;
  }

  off(event, callback) {
    const set = this.listeners.get(event);
    if (set) set.delete(callback);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const cb of set) {
      try { cb(payload); }
      catch (e) { console.error(`[EventBus] error en handler de "${event}":`, e); }
    }
  }

  clear() {
    this.listeners.clear();
  }
}

// Instancia singleton compartida
export const bus = new EventBus();

// Constantes de eventos para evitar typos
export const EVENTS = {
  // Ciclo de juego
  GAME_INIT: 'game:init',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',

  // Escenas
  SCENE_CHANGE: 'scene:change',
  SCENE_LOADED: 'scene:loaded',

  // Caso
  CASE_START: 'case:start',
  CASE_WIN: 'case:win',
  CASE_LOSE: 'case:lose',

  // Tiempo
  TIME_TICK: 'time:tick',
  TIME_EXPIRED: 'time:expired',

  // Pistas
  CLUE_DISCOVERED: 'clue:discovered',
  ATTRIBUTE_REVEALED: 'attribute:revealed',

  // Sospechosos
  WARRANT_ISSUED: 'warrant:issued',
  SUSPECT_CAPTURED: 'suspect:captured',
  SUSPECT_MISMATCH: 'suspect:mismatch',

  // Viajes
  TRAVEL_START: 'travel:start',
  TRAVEL_END: 'travel:end',

  // Logros
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',

  // Audio
  PLAY_SFX: 'audio:sfx',
  PLAY_MUSIC: 'audio:music',
  STOP_MUSIC: 'audio:stop',

  // UI
  SHOW_TOAST: 'ui:toast',
  SHOW_DIALOGUE: 'ui:dialogue',
};
