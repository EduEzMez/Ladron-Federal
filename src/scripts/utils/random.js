// =============================================================================
// RANDOM.js — PRNG con semilla
// Permite generar 100 casos reproducibles desde una semilla.
// Implementación basada en mulberry32, rápida y determinista.
// =============================================================================

/**
 * Crea un generador determinista a partir de una semilla numérica.
 * @param {number} seed
 */
export function createRng(seed) {
  let state = seed >>> 0;
  return function rng() {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convierte string a semilla numérica de 32 bits. */
export function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Elige un elemento aleatorio de un array. */
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/** Elige n elementos únicos. */
export function pickN(rng, arr, n) {
  const copy = arr.slice();
  const result = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/** Entero entre min (inclusive) y max (inclusive). */
export function intBetween(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Mezcla un array en lugar (Fisher-Yates determinista). */
export function shuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
