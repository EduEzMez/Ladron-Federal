// =============================================================================
// GENERADOR DE SOSPECHOSOS
// Produce un roster de N sospechosos únicos combinando los pools de atributos.
// Cada sospechoso tiene atributos verificables que las pistas referirán.
// =============================================================================

import { createRng, pick, hashSeed } from '../utils/random.js';
import {
  SUSPECT_FIRST_NAMES_M,
  SUSPECT_FIRST_NAMES_F,
  SUSPECT_LAST_NAMES,
  HAIR_COLORS,
  PROFESSIONS,
  HOBBIES,
  FAVORITE_FOODS,
  FAVORITE_PLACES,
  FAVORITE_COLORS,
  ALIASES_PREFIX,
  ALIASES_NOUN,
  ACCESSORIES,
} from '../data/suspectTemplates.js';

/**
 * Genera un único sospechoso a partir de un seed.
 */
export function generateSuspect(seed) {
  const rng = createRng(typeof seed === 'string' ? hashSeed(seed) : seed);
  const isFemale = rng() < 0.5;
  const firstNamePool = isFemale ? SUSPECT_FIRST_NAMES_F : SUSPECT_FIRST_NAMES_M;
  const first = pick(rng, firstNamePool);
  const last = pick(rng, SUSPECT_LAST_NAMES);

  return {
    id: `suspect_${seed}`,
    name: `${first} ${last}`,
    gender: isFemale ? 'F' : 'M',
    alias: `${pick(rng, ALIASES_PREFIX)} ${pick(rng, ALIASES_NOUN)}`,
    hair: pick(rng, HAIR_COLORS),
    profession: pick(rng, PROFESSIONS),
    hobby: pick(rng, HOBBIES),
    food: pick(rng, FAVORITE_FOODS),
    place: pick(rng, FAVORITE_PLACES),
    color: pick(rng, FAVORITE_COLORS),
    accessory: pick(rng, ACCESSORIES),
    // Color visual asignado para el avatar 3D
    avatarHue: Math.floor(rng() * 360),
  };
}

/**
 * Genera un roster completo de N sospechosos.
 * Por defecto 120 (más que los 100 requeridos para variedad).
 */
export function generateSuspectRoster(count = 120, baseSeed = 'huellas-2025') {
  const baseHash = hashSeed(baseSeed);
  const roster = [];
  for (let i = 0; i < count; i++) {
    roster.push(generateSuspect(baseHash + i * 31));
  }
  return roster;
}

/**
 * Dada una serie de pistas (atributos), filtra el roster a los compatibles.
 * Útil para el sistema de "orden de captura": el jugador acumula atributos y
 * el juego deduce si su orden es correcta.
 */
export function filterByClues(roster, knownAttributes) {
  return roster.filter(suspect =>
    Object.entries(knownAttributes).every(([attr, value]) => {
      if (!value) return true;
      const target = suspect[attr];
      if (!target) return false;
      // Comparar por id de objeto si es atributo categórico
      if (typeof target === 'object' && target?.id) {
        return target.id === value;
      }
      return target === value;
    })
  );
}
