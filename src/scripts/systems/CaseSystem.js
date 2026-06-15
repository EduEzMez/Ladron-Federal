// =============================================================================
// SISTEMA DE CASOS
// Gestiona el caso activo: estado del recorrido, testigos consultados,
// orden de captura, victoria/derrota.
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';
import { generateCase } from '../generators/CaseGenerator.js';

export class CaseSystem {
  constructor() {
    this.activeCase = null;
    this.currentStopIndex = 0;
    this.visitedProvinces = new Set();
    this.consultedWitnesses = new Set();
    this.warrantIssued = false;
    this.warrantAttempts = 0;
    this.warrantSuspect = null;
  }

  startCase(seed) {
    this.activeCase = generateCase(seed);
    this.currentStopIndex = 0;
    this.visitedProvinces = new Set([this.activeCase.origin.id]);
    this.consultedWitnesses = new Set();
    this.warrantIssued = false;
    this.warrantAttempts = 0;
    this.warrantSuspect = null;
    bus.emit(EVENTS.CASE_START, this.activeCase);
    return this.activeCase;
  }

  get currentStop() {
    return this.activeCase?.stops[this.currentStopIndex] ?? null;
  }

  get currentProvince() {
    return this.currentStop?.province ?? null;
  }

  get nextProvince() {
    return this.activeCase?.stops[this.currentStopIndex + 1]?.province ?? null;
  }

  /** Avanza a la siguiente parada si la elección es correcta. */
  travelTo(provinceId) {
    if (!this.activeCase) return { success: false, reason: 'no_case' };
    const next = this.nextProvince;
    if (!next) return { success: false, reason: 'no_next' };

    if (next.id !== provinceId) {
      // Pista falsa: pierde tiempo pero no termina el juego
      return { success: false, reason: 'wrong_destination', expected: next };
    }

    this.currentStopIndex++;
    this.visitedProvinces.add(provinceId);
    bus.emit(EVENTS.TRAVEL_END, { province: next });
    return { success: true, province: next };
  }

  /** Marca un testigo como consultado para no repetir. */
  markWitness(id) {
    this.consultedWitnesses.add(id);
  }

  hasConsultedWitness(id) {
    return this.consultedWitnesses.has(id);
  }

  /** Emite una orden de captura. */
  issueWarrant(suspectId, roster) {
    if (!this.activeCase) return { success: false };
    this.warrantAttempts++;
    const suspect = roster.find(s => s.id === suspectId);
    this.warrantSuspect = suspect;
    this.warrantIssued = true;
    bus.emit(EVENTS.WARRANT_ISSUED, { suspect });

    const isMatch = suspect && suspect.id === this.activeCase.suspect.id;
    return { success: isMatch, suspect };
  }

  /** Intenta capturar: requiere estar en la provincia final con orden correcta. */
  attemptCapture() {
    if (!this.activeCase || !this.warrantIssued) {
      return { success: false, reason: 'no_warrant' };
    }
    const isFinalStop = this.currentStopIndex === this.activeCase.stops.length - 1;
    if (!isFinalStop) {
      return { success: false, reason: 'not_final' };
    }
    const isCorrectSuspect = this.warrantSuspect?.id === this.activeCase.suspect.id;
    if (!isCorrectSuspect) {
      bus.emit(EVENTS.SUSPECT_MISMATCH);
      return { success: false, reason: 'wrong_suspect' };
    }
    bus.emit(EVENTS.SUSPECT_CAPTURED, this.activeCase.suspect);
    return { success: true };
  }

  toJSON() {
    return {
      seed: this.activeCase?.seed,
      currentStopIndex: this.currentStopIndex,
      visitedProvinces: [...this.visitedProvinces],
      consultedWitnesses: [...this.consultedWitnesses],
      warrantIssued: this.warrantIssued,
      warrantAttempts: this.warrantAttempts,
      warrantSuspectId: this.warrantSuspect?.id,
    };
  }

  loadJSON(data, roster) {
    if (!data?.seed) return false;
    this.activeCase = generateCase(data.seed);
    this.currentStopIndex = data.currentStopIndex ?? 0;
    this.visitedProvinces = new Set(data.visitedProvinces ?? []);
    this.consultedWitnesses = new Set(data.consultedWitnesses ?? []);
    this.warrantIssued = !!data.warrantIssued;
    this.warrantAttempts = data.warrantAttempts ?? 0;
    this.warrantSuspect = roster?.find(s => s.id === data.warrantSuspectId) ?? null;
    return true;
  }
}
