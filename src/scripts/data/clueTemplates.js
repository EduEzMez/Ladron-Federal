// =============================================================================
// PLANTILLAS DE PISTAS Y DIÁLOGOS DE TESTIGOS
// Las pistas nunca revelan directamente la siguiente provincia. Cada testigo
// aporta dos tipos de información:
//   1) Una pista GEOGRÁFICA (apuntando a un atributo del destino)
//   2) Una pista de IDENTIDAD (apuntando a un atributo del sospechoso)
// =============================================================================

/**
 * Diálogos introductorios de testigos.
 * El generador elige aleatoriamente uno por encuentro.
 */
export const WITNESS_INTROS = [
  'Lo vi recién, justo cuando salía corriendo...',
  'Sí, lo recuerdo bien. Tenía algo raro encima.',
  'Me preguntó cosas extrañas antes de irse.',
  'Discutió con el cajero. Hablaba como si tuviera apuro.',
  'Pidió un café y se quedó mirando un mapa.',
  '¡Qué bueno que vengan! Pensé que nadie investigaba esto.',
  'Fue muy raro. Estaba muy contento con su botín.',
  'Me dejó esta servilleta con una nota apurada.',
];

export const WITNESS_OUTROS = [
  'Espero que les sirva. Buena suerte, detective.',
  'No se olvide de capturarlo, por favor.',
  'Es todo lo que recuerdo. Le toca a ustedes.',
  'Si necesita más, vuelva. Yo aquí estoy.',
];

/**
 * Plantillas para pistas geográficas.
 * Reciben datos de la provincia destino y producen una frase.
 */
export const GEOGRAPHIC_CLUE_TEMPLATES = [
  ({ destination }) => `Lo escuché preguntar por una región con ${destination.terrain}.`,
  ({ destination }) => `Compró una guía sobre la región ${destination.region}.`,
  ({ destination }) => `Quería conocer lugares con clima ${destination.climate}.`,
  ({ destination }) =>
    destination.landmarks?.[0]
      ? `Mencionó querer visitar ${destination.landmarks[0]}.`
      : `Buscaba un destino famoso de la zona ${destination.region}.`,
  ({ destination }) =>
    destination.food?.[0]
      ? `Pidió una receta de ${destination.food[0]}.`
      : `Habló de comidas típicas del lugar.`,
  ({ destination }) =>
    destination.music?.[0]
      ? `Tarareaba un ${destination.music[0]} todo el tiempo.`
      : `Cantaba música típica del lugar.`,
  ({ destination }) =>
    destination.clues?.length
      ? destination.clues[Math.floor(Math.random() * destination.clues.length)]
      : `Mencionó una ciudad cercana a ${destination.capital}.`,
];

/**
 * Plantillas para pistas de identidad del sospechoso.
 */
export const IDENTITY_CLUE_TEMPLATES = [
  ({ suspect }) => `Tenía el pelo ${suspect.hair.name}.`,
  ({ suspect }) => `Dijo trabajar como ${suspect.profession.name}.`,
  ({ suspect }) => `Comentó que su hobby es ${suspect.hobby.name}.`,
  ({ suspect }) => `Le encanta ${suspect.food.name}.`,
  ({ suspect }) => `Suele visitar ${suspect.place.name}.`,
  ({ suspect }) => `Vestía completamente de color ${suspect.color.name}.`,
  ({ suspect }) => `${suspect.accessory}.`,
  ({ suspect }) => `Lo apodaban "${suspect.alias}".`,
];

/**
 * Tarjetas de ubicaciones donde aparecen testigos.
 * Aportan ambientación y variedad por provincia.
 */
export const WITNESS_LOCATIONS = [
  { id: 'cafe', name: 'Café del Centro', icon: '☕' },
  { id: 'estacion', name: 'Estación de tren', icon: '🚉' },
  { id: 'museo', name: 'Museo Provincial', icon: '🏛️' },
  { id: 'mercado', name: 'Mercado Artesanal', icon: '🛍️' },
  { id: 'aeropuerto', name: 'Aeropuerto local', icon: '✈️' },
  { id: 'biblioteca', name: 'Biblioteca pública', icon: '📚' },
  { id: 'parque', name: 'Plaza principal', icon: '🌳' },
];

export const WITNESS_FIRST_NAMES = [
  { name: 'Don Roque',       gender: 'm' },
  { name: 'Doña Mirta',      gender: 'f' },
  { name: 'Susanita',        gender: 'f' },
  { name: 'Manolo',          gender: 'm' },
  { name: 'Yamila',          gender: 'f' },
  { name: 'Tincho',          gender: 'm' },
  { name: 'Marisa',          gender: 'f' },
  { name: 'Don Alfredo',     gender: 'm' },
  { name: 'Doña Pepa',       gender: 'f' },
  { name: 'Lautaro',         gender: 'm' },
  { name: 'Camila',          gender: 'f' },
  { name: 'Aldana',          gender: 'f' },
  { name: 'El Negro Pérez',  gender: 'm' },
  { name: 'Doña Toti',       gender: 'f' },
  { name: 'Joselo',          gender: 'm' },
  { name: 'Don Cacho',       gender: 'm' },
  { name: 'Lalo',            gender: 'm' },
  { name: 'Norma',           gender: 'f' },
  { name: 'Beba',            gender: 'f' },
  { name: 'Doña Rosa',       gender: 'f' },
];
