// =============================================================================
// SISTEMA DE PISTAS
// Acumula pistas descubiertas y atributos revelados del sospechoso.
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';

export class ClueSystem {
  constructor() {
    this.geographicClues = []; // { provinceFrom, text, hint, day }
    this.identityClues = [];   // { text, attribute: {key, value}, day }
    this.knownAttributes = {}; // { hair: 'negro', profession: 'chef', ... }
  }

  reset() {
    this.geographicClues = [];
    this.identityClues = [];
    this.knownAttributes = {};
  }

  addGeographicClue(provinceFrom, text, day) {
    const entry = { provinceFrom, text, day, id: `geo_${Date.now()}_${Math.random()}` };
    this.geographicClues.push(entry);
    bus.emit(EVENTS.CLUE_DISCOVERED, entry);
  }

  addIdentityClue(text, attribute, day) {
    const entry = { text, attribute, day, id: `id_${Date.now()}_${Math.random()}` };
    this.identityClues.push(entry);
    if (attribute && attribute.key) {
      this.knownAttributes[attribute.key] = attribute.value;
      bus.emit(EVENTS.ATTRIBUTE_REVEALED, attribute);
    }
    bus.emit(EVENTS.CLUE_DISCOVERED, entry);
  }

  get attributeCount() {
    return Object.keys(this.knownAttributes).length;
  }

  /** Filtra un roster de sospechosos por los atributos conocidos. */
  matchSuspects(roster) {
    return roster.filter(s =>
      Object.entries(this.knownAttributes).every(([k, v]) => {
        const target = s[k];
        if (target == null) return false;
        if (typeof target === 'object' && target.id != null) return target.id === v;
        return target === v;
      })
    );
  }

  toJSON() {
    return {
      geographicClues: this.geographicClues,
      identityClues: this.identityClues,
      knownAttributes: this.knownAttributes,
    };
  }

  loadJSON(data) {
    if (!data) return;
    this.geographicClues = data.geographicClues ?? [];
    this.identityClues = data.identityClues ?? [];
    this.knownAttributes = data.knownAttributes ?? {};
  }
}
