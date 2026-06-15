// =============================================================================
// PLANTILLAS DE SOSPECHOSOS
// El generador procedural combina estos pools para producir más de 100
// sospechosos únicos. Cada sospechoso tiene atributos que el jugador deduce
// a partir de las pistas que dan los testigos.
// =============================================================================

export const SUSPECT_FIRST_NAMES_M = [
  'Aníbal','Bartolo','Casimiro','Damián','Eulogio','Faustino','Gualterio',
  'Hipólito','Ignacio','Joaquín','Kristian','Leandro','Manolo','Néstor',
  'Octavio','Pancracio','Quirino','Ramón','Sandalio','Teobaldo','Ulises',
  'Valentín','Wenceslao','Ximeno','Yacobo','Zacarías',
];

export const SUSPECT_FIRST_NAMES_F = [
  'Aurelia','Belén','Casilda','Delfina','Eulalia','Fermina','Gilda',
  'Herminia','Inés','Jacinta','Karenina','Lucrecia','Matilde','Nélida',
  'Otilia','Petrona','Quintina','Ramona','Salustia','Teodora','Ubaldina',
  'Valeria','Walquiria','Ximena','Yolanda','Zulma',
];

export const SUSPECT_LAST_NAMES = [
  'Quirquincho','Ñandúpez','Chinchulín','Choriplán','Caldenero','Salamín',
  'Mate Cocido','Tucupido','Bombilla','Bagualero','Tropero','Saladillo',
  'Rastrojo','Pampero','Carpinchero','Yarará','Macachín','Cardón','Talampaya',
  'Mistolar','Quebrada','Pehuenia','Quillén','Llao Llao','Carancho','Hornero',
];

export const HAIR_COLORS = [
  { id: 'negro', name: 'negro azabache' },
  { id: 'castaño', name: 'castaño claro' },
  { id: 'rubio', name: 'rubio platinado' },
  { id: 'rojo', name: 'rojo fuego' },
  { id: 'gris', name: 'gris ceniza' },
  { id: 'verde', name: 'verde teñido' },
  { id: 'violeta', name: 'violeta teñido' },
  { id: 'blanco', name: 'blanco nevado' },
];

export const PROFESSIONS = [
  { id: 'historiador', name: 'historiador/a' },
  { id: 'arqueologo', name: 'arqueólogo/a' },
  { id: 'chef', name: 'chef especializado' },
  { id: 'guia_turistico', name: 'guía turístico/a' },
  { id: 'periodista', name: 'periodista' },
  { id: 'musicologo', name: 'musicólogo/a' },
  { id: 'pintor', name: 'pintor/a' },
  { id: 'profesor', name: 'profesor/a de geografía' },
  { id: 'coleccionista', name: 'coleccionista de antigüedades' },
  { id: 'bibliotecario', name: 'bibliotecario/a' },
];

export const HOBBIES = [
  { id: 'ajedrez', name: 'jugar al ajedrez' },
  { id: 'fotografia', name: 'la fotografía' },
  { id: 'observar_aves', name: 'observar aves' },
  { id: 'guitarra', name: 'tocar la guitarra' },
  { id: 'pesca', name: 'pescar en ríos' },
  { id: 'trekking', name: 'el trekking de montaña' },
  { id: 'cocinar', name: 'cocinar comidas regionales' },
  { id: 'coleccionar_estampillas', name: 'coleccionar estampillas' },
  { id: 'escribir_poesia', name: 'escribir poesía' },
  { id: 'bailar', name: 'bailar folclore' },
];

export const FAVORITE_FOODS = [
  { id: 'asado', name: 'el asado' },
  { id: 'empanadas', name: 'las empanadas' },
  { id: 'locro', name: 'el locro' },
  { id: 'humita', name: 'la humita' },
  { id: 'pizza', name: 'la pizza' },
  { id: 'pastel_papa', name: 'el pastel de papa' },
  { id: 'milanesas', name: 'las milanesas' },
  { id: 'alfajores', name: 'los alfajores' },
  { id: 'chipa', name: 'la chipa' },
  { id: 'tamales', name: 'los tamales' },
];

export const FAVORITE_PLACES = [
  { id: 'cafe', name: 'los cafés tradicionales' },
  { id: 'biblioteca', name: 'las bibliotecas antiguas' },
  { id: 'museo', name: 'los museos provinciales' },
  { id: 'mercado', name: 'los mercados artesanales' },
  { id: 'plaza', name: 'las plazas principales' },
  { id: 'estacion', name: 'las estaciones de tren' },
  { id: 'mirador', name: 'los miradores naturales' },
  { id: 'parque', name: 'los parques nacionales' },
];

export const FAVORITE_COLORS = [
  { id: 'rojo', name: 'rojo' },
  { id: 'amarillo', name: 'amarillo' },
  { id: 'azul', name: 'azul' },
  { id: 'verde', name: 'verde' },
  { id: 'violeta', name: 'violeta' },
  { id: 'naranja', name: 'naranja' },
  { id: 'celeste', name: 'celeste' },
  { id: 'blanco', name: 'blanco' },
];

export const ALIASES_PREFIX = [
  'El','La','El Capitán','La Doctora','El Profesor','La Comadre',
  'El Doc','La Maestra','El Visionario','La Sombra de',
];

export const ALIASES_NOUN = [
  'Carancho','Ñandú','Quirquincho','Tatú','Yaguareté','Cóndor',
  'Pichi','Pumita','Tero','Suri','Ocelote','Mara','Coatí','Hornero',
];

export const ACCESSORIES = [
  'usa anteojos redondos',
  'lleva siempre un sombrero de ala ancha',
  'tiene un tatuaje de una hoja de yerba mate',
  'carga un bastón con cabeza de ñandú',
  'porta una mochila roja inconfundible',
  'lleva una bufanda larga aún en verano',
  'tiene una cicatriz en forma de "S" en la mano izquierda',
  'siempre usa zapatillas blancas',
  'se mueve con un paraguas negro plegado',
  'lleva un libro bajo el brazo permanentemente',
];

/**
 * Generador determinista de atributos a partir de un seed (índice).
 * Esto permite generar más de 100 sospechosos sin colisiones notorias.
 */
export const SUSPECT_ATTRIBUTE_POOLS = {
  hair: HAIR_COLORS,
  profession: PROFESSIONS,
  hobby: HOBBIES,
  food: FAVORITE_FOODS,
  place: FAVORITE_PLACES,
  color: FAVORITE_COLORS,
};
