// =============================================================================
// SISTEMA DE LOGROS
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';
import { saveSystem } from './SaveSystem.js';

export const ACHIEVEMENTS = [
  {
    id: 'first_case',
    name: 'Primer caso resuelto',
    description: 'Capturaste a tu primer Saqueador.',
    icon: '🥇',
  },
  {
    id: 'detective_novato',
    name: 'Detective Novato',
    description: 'Resolviste 3 casos.',
    icon: '🔎',
  },
  {
    id: 'detective_experto',
    name: 'Detective Experto',
    description: 'Resolviste 10 casos.',
    icon: '🕵️',
  },
  {
    id: 'maestro_geografia',
    name: 'Maestro de la Geografía',
    description: 'Visitaste las 24 provincias argentinas.',
    icon: '🗺️',
  },
  {
    id: 'protector_cultural',
    name: 'Protector Cultural',
    description: 'Recuperaste objetos culturales de las 6 regiones del país.',
    icon: '🛡️',
  },
  {
    id: 'sin_pestañear',
    name: 'Sin pestañear',
    description: 'Ganaste un caso usando menos de 3 días.',
    icon: '⚡',
  },
  {
    id: 'sin_pistas_falsas',
    name: 'Memoria de elefante',
    description: 'Emitiste una orden de captura correcta sin errores previos.',
    icon: '🐘',
  },
];

const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));

export class AchievementSystem {
  constructor() {
    this.unlocked = new Set(saveSystem.getAchievements());
    this._listen();
  }

  _listen() {
    bus.on(EVENTS.CASE_WIN, (payload) => this.onCaseWin(payload));
  }

  onCaseWin(payload) {
    const stats = saveSystem.getStats();

    if (stats.casesWon === 1) this.unlock('first_case');
    if (stats.casesWon === 3) this.unlock('detective_novato');
    if (stats.casesWon === 10) this.unlock('detective_experto');

    // Geografía: 24 provincias visitadas
    if (Object.keys(stats.provincesVisited || {}).length >= 24) {
      this.unlock('maestro_geografia');
    }

    // Cultura: cubrir 6 regiones
    const regionsCovered = new Set(payload?.regionsCovered ?? []);
    if (regionsCovered.size >= 6) this.unlock('protector_cultural');

    if (payload?.daysUsed && payload.daysUsed < 3) this.unlock('sin_pestañear');
    if (payload?.warrantAttempts === 1) this.unlock('sin_pistas_falsas');
  }

  unlock(id) {
    if (this.unlocked.has(id)) return false;
    const ach = ACH_BY_ID[id];
    if (!ach) return false;
    saveSystem.unlockAchievement(id);
    this.unlocked.add(id);
    bus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, ach);
    bus.emit(EVENTS.SHOW_TOAST, {
      icon: ach.icon,
      title: '¡Logro desbloqueado!',
      body: `${ach.name} — ${ach.description}`,
      duration: 4500,
    });
    return true;
  }

  isUnlocked(id) {
    return this.unlocked.has(id);
  }

  getAll() {
    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: this.unlocked.has(a.id) }));
  }
}
