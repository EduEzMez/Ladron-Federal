// =============================================================================
// SAVE SYSTEM
// Persistencia en localStorage. Guarda caso en curso, tiempo, pistas,
// estadísticas y logros desbloqueados.
// =============================================================================

const STORAGE_KEY = 'tras-las-huellas:save:v1';
const STATS_KEY = 'tras-las-huellas:stats:v1';
const ACH_KEY = 'tras-las-huellas:achievements:v1';
const SETTINGS_KEY = 'tras-las-huellas:settings:v1';

function safeRead(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('[SaveSystem] no se pudo escribir:', e);
    return false;
  }
}

export class SaveSystem {
  saveGame(state) {
    return safeWrite(STORAGE_KEY, {
      version: 1,
      timestamp: Date.now(),
      caseSeed: state.caseSeed,
      time: state.time,
      cluesGathered: state.cluesGathered,
      visitedProvinces: state.visitedProvinces,
      currentProvinceId: state.currentProvinceId,
      knownAttributes: state.knownAttributes,
      warrantIssued: state.warrantIssued,
      stopIndex: state.stopIndex,
    });
  }

  loadGame() {
    return safeRead(STORAGE_KEY);
  }

  hasSave() {
    return safeRead(STORAGE_KEY) !== null;
  }

  clearGame() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // === Estadísticas ===
  getStats() {
    return safeRead(STATS_KEY, {
      casesPlayed: 0,
      casesWon: 0,
      casesLost: 0,
      provincesVisited: {},
      cluesGathered: 0,
      totalPlayTimeMinutes: 0,
    });
  }

  updateStats(updater) {
    const current = this.getStats();
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    safeWrite(STATS_KEY, next);
    return next;
  }

  // === Logros ===
  getAchievements() {
    return safeRead(ACH_KEY, []);
  }

  unlockAchievement(id) {
    const current = this.getAchievements();
    if (!current.includes(id)) {
      current.push(id);
      safeWrite(ACH_KEY, current);
      return true;
    }
    return false;
  }

  // === Configuración (accesibilidad, audio, etc.) ===
  getSettings() {
    return safeRead(SETTINGS_KEY, {
      audioVolume: 0.7,
      musicVolume: 0.5,
      highContrast: false,
      fontSize: 1,
      reduceMotion: false,
    });
  }

  saveSettings(settings) {
    safeWrite(SETTINGS_KEY, settings);
  }
}

export const saveSystem = new SaveSystem();
