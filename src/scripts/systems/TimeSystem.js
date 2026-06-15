// =============================================================================
// TIME SYSTEM
// 7 días en horas. Cada acción consume tiempo. Si llega a 0: el ladrón escapa.
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';

export const TIME_COSTS = {
  WITNESS_INTERVIEW: 2,    // Hablar con testigo
  ARCHIVE_RESEARCH: 3,     // Investigar archivo
  SHORT_TRIP: 6,           // Viaje corto (misma región)
  LONG_TRIP: 12,           // Viaje largo (otra región)
  WARRANT_ISSUE: 1,        // Emitir orden de captura
};

export class TimeSystem {
  constructor(days = 7) {
    this.totalHours = days * 24;
    this.remainingHours = this.totalHours;
  }

  reset(days = 7) {
    this.totalHours = days * 24;
    this.remainingHours = this.totalHours;
    bus.emit(EVENTS.TIME_TICK, this.snapshot());
  }

  consume(hours) {
    this.remainingHours = Math.max(0, this.remainingHours - hours);
    bus.emit(EVENTS.TIME_TICK, this.snapshot());
    if (this.remainingHours === 0) {
      bus.emit(EVENTS.TIME_EXPIRED);
    }
  }

  get daysRemaining() {
    return Math.floor(this.remainingHours / 24);
  }

  get hoursRemainingInDay() {
    return this.remainingHours % 24;
  }

  get currentDay() {
    return Math.ceil((this.totalHours - this.remainingHours) / 24) + 1;
  }

  get totalDays() {
    return Math.ceil(this.totalHours / 24);
  }

  get isExpired() {
    return this.remainingHours <= 0;
  }

  snapshot() {
    return {
      total: this.totalHours,
      remaining: this.remainingHours,
      days: this.daysRemaining,
      hours: this.hoursRemainingInDay,
      currentDay: this.currentDay,
      day: this.currentDay,
      percent: this.remainingHours / this.totalHours,
    };
  }

  toJSON() {
    return { total: this.totalHours, remaining: this.remainingHours };
  }

  loadJSON(data) {
    if (!data) return;
    this.totalHours = data.total ?? this.totalHours;
    this.remainingHours = data.remaining ?? this.remainingHours;
  }
}
