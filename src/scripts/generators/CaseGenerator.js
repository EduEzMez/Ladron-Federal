// =============================================================================
// GENERADOR DE CASOS
// Cada caso = robo de un objeto cultural + ruta de escape multi-provincial
// + sospechoso asignado + testigos con pistas geográficas y de identidad.
// =============================================================================

import { createRng, pick, pickN, hashSeed, intBetween, shuffle } from '../utils/random.js';
import { PROVINCES, getProvinceById, distanceBetween } from '../data/provinces.js';
import { CULTURAL_ITEMS } from '../data/culturalItems.js';
import {
  WITNESS_INTROS,
  WITNESS_OUTROS,
  GEOGRAPHIC_CLUE_TEMPLATES,
  IDENTITY_CLUE_TEMPLATES,
  WITNESS_LOCATIONS,
  WITNESS_FIRST_NAMES,
} from '../data/clueTemplates.js';
import { generateSuspect } from './SuspectGenerator.js';

/**
 * Genera la ruta de escape: provincia robada -> N hops -> provincia final.
 * Los hops se eligen variando por distancia para que el viaje tenga sentido.
 */
function generateRoute(rng, origin, length) {
  const route = [origin];
  let current = origin;
  const used = new Set([origin.id]);

  for (let i = 0; i < length; i++) {
    // De los candidatos no visitados, elegir uno con probabilidad inversa a la distancia
    const candidates = PROVINCES.filter(p => !used.has(p.id));
    if (!candidates.length) break;

    // Score por distancia: provincias entre 300 y 1500 km son ideales
    const scored = candidates.map(p => {
      const d = distanceBetween(current, p);
      const score = d < 200 ? 0.3 : d > 2500 ? 0.4 : 1.0;
      return { p, score };
    });

    // Ruleta ponderada
    const total = scored.reduce((s, x) => s + x.score, 0);
    let r = rng() * total;
    let chosen = scored[0].p;
    for (const { p, score } of scored) {
      r -= score;
      if (r <= 0) { chosen = p; break; }
    }

    route.push(chosen);
    used.add(chosen.id);
    current = chosen;
  }

  return route;
}

/**
 * Genera testigos para una provincia, cada uno con pistas que apuntan al
 * siguiente destino y a un atributo del sospechoso.
 */
function generateWitnesses(rng, currentProv, nextProv, suspect) {
  const witnessCount = intBetween(rng, 2, 3);
  const locations = pickN(rng, WITNESS_LOCATIONS, witnessCount);

  const witnesses = locations.map((loc, idx) => {
    const geoTpl = pick(rng, GEOGRAPHIC_CLUE_TEMPLATES);
    const idTpl = pick(rng, IDENTITY_CLUE_TEMPLATES);
    const witnessEntry = pick(rng, WITNESS_FIRST_NAMES);

    return {
      id: `${currentProv.id}_w${idx}`,
      name: witnessEntry.name,
      gender: witnessEntry.gender,
      location: loc.name,          // string directo, no objeto
      locationIcon: loc.icon,
      intro: pick(rng, WITNESS_INTROS),
      outro: pick(rng, WITNESS_OUTROS),
      geographicClue: nextProv ? geoTpl({ destination: nextProv }) : null,
      identityClue: idTpl({ suspect }),
      revealedAttribute: deriveAttributeFromTemplate(idTpl, suspect),
    };
  });

  return witnesses;
}

/** Determina qué atributo revela la plantilla (basado en su retorno). */
function deriveAttributeFromTemplate(tpl, suspect) {
  const text = tpl({ suspect });

  // Para atributos que son objetos {id, name}, guardar el id para comparación exacta
  if (suspect.hair?.name && text.includes(suspect.hair.name))
    return { key: 'hair',       value: suspect.hair.id };
  if (suspect.profession?.name && text.includes(suspect.profession.name))
    return { key: 'profession', value: suspect.profession.id };
  if (suspect.hobby?.name && text.includes(suspect.hobby.name))
    return { key: 'hobby',      value: suspect.hobby.id };
  if (suspect.food?.name && text.includes(suspect.food.name))
    return { key: 'food',       value: suspect.food.id };
  if (suspect.place?.name && text.includes(suspect.place.name))
    return { key: 'place',      value: suspect.place.id };
  if (suspect.color?.name && text.includes(suspect.color.name))
    return { key: 'color',      value: suspect.color.id };

  // Alias y accesorios son strings directos
  if (suspect.alias && text.includes(suspect.alias))
    return { key: 'alias',      value: suspect.alias };

  // Fallback: usar el primer atributo objeto disponible
  if (suspect.profession?.id)
    return { key: 'profession', value: suspect.profession.id };

  return null;
}

/**
 * Genera un caso completo.
 * @param {number|string} seed
 * @param {Array} suspectRoster - roster de sospechosos ya generados (para que el culpable esté en la lista)
 */
export function generateCase(seed, suspectRoster = null) {
  const rng = createRng(typeof seed === 'string' ? hashSeed(seed) : seed);

  // 1. Elegir objeto cultural robado
  const stolen = pick(rng, CULTURAL_ITEMS);
  const origin = getProvinceById(stolen.province);

  // 2. Ruta de escape
  const routeLength = stolen.difficulty + intBetween(rng, 1, 2);
  const route = generateRoute(rng, origin, routeLength);

  // 3. Elegir sospechoso DEL ROSTER (si se pasa) o generar uno nuevo
  //    Esto garantiza que el culpable siempre aparezca en la Sala de Expedientes
  let suspect;
  if (suspectRoster && suspectRoster.length > 0) {
    suspect = pick(rng, suspectRoster);
  } else {
    suspect = generateSuspect(seed + '_suspect');
  }

  // 4. Generar testigos
  const stops = route.map((prov, idx) => ({
    province: prov,
    isOrigin: idx === 0,
    isFinal: idx === route.length - 1,
    witnesses: generateWitnesses(rng, prov, route[idx + 1] ?? null, suspect),
  }));

  const baseDays = 7;

  return {
    id: `case_${seed}`,
    seed: String(seed),
    title: `El robo de ${stolen.name}`,
    stolen,
    origin,
    route,
    stops,
    suspect,
    difficulty: stolen.difficulty,
    daysLimit: baseDays,
    briefing: buildBriefing(stolen, origin),
  };
}

function buildBriefing(stolen, origin) {
  return `Detective, "Los Saqueadores del Patrimonio" han robado ${stolen.name} en ${origin.name}. ` +
    `${stolen.description} Su misión es seguir las pistas en cada provincia, identificar al ladrón, ` +
    `emitir una orden de captura y arrestarlo antes de que escape para siempre. Tiene 7 días.`;
}

/**
 * Genera un dossier de N casos a partir de una semilla base.
 */
export function generateCaseDossier(count = 100, baseSeed = 'huellas-2025-cases') {
  const base = hashSeed(baseSeed);
  const cases = [];
  for (let i = 0; i < count; i++) {
    cases.push(generateCase(base + i * 97));
  }
  return cases;
}
