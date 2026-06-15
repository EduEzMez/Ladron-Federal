// =============================================================================
// OBJETOS CULTURALES ROBABLES
// Cada objeto representa un elemento simbólico de la cultura argentina.
// Los "Saqueadores del Patrimonio" no roban dinero ni objetos físicos: roban
// la *idea* / el *símbolo*. El juego usa esta lista como inventario de casos.
// =============================================================================

export const CULTURAL_CATEGORIES = {
  MUSICA: 'música',
  COMIDA: 'comida',
  TRADICION: 'tradición',
  FIESTA: 'fiesta',
  PRENDA: 'prenda',
  NATURAL: 'patrimonio natural',
  HISTORICO: 'patrimonio histórico',
  IDIOMA: 'idioma o expresión',
};

/**
 * Cada item incluye:
 *  - id
 *  - name: nombre presentado
 *  - category
 *  - province: provincia de origen
 *  - description: cómo se le explica al jugador
 *  - difficulty: 1 (fácil), 2 (media), 3 (difícil) - influye en cantidad de pistas
 */
export const CULTURAL_ITEMS = [
  // === MÚSICA ===
  { id: 'tango', name: 'El Tango', category: 'música', province: 'caba', description: 'El baile y música rioplatense declarado Patrimonio de la Humanidad por UNESCO.', difficulty: 1 },
  { id: 'chamame', name: 'El Chamamé', category: 'música', province: 'corrientes', description: 'Ritmo del litoral con acordeón y bandoneón.', difficulty: 2 },
  { id: 'cuarteto', name: 'El Cuarteto Cordobés', category: 'música', province: 'cordoba', description: 'Ritmo bailable nacido en Córdoba.', difficulty: 2 },
  { id: 'zamba', name: 'La Zamba Salteña', category: 'música', province: 'salta', description: 'Danza folclórica del noroeste argentino.', difficulty: 2 },
  { id: 'chacarera', name: 'La Chacarera', category: 'música', province: 'santiago_del_estero', description: 'Danza nacida en Santiago del Estero.', difficulty: 2 },
  { id: 'copla', name: 'La Copla con Caja', category: 'música', province: 'jujuy', description: 'Canto ancestral del NOA.', difficulty: 3 },
  { id: 'tonada_cuyana', name: 'La Tonada Cuyana', category: 'música', province: 'mendoza', description: 'Género musical típico de Cuyo.', difficulty: 3 },

  // === COMIDA ===
  { id: 'mate', name: 'El Mate', category: 'comida', province: 'misiones', description: 'Infusión nacional preparada con yerba mate.', difficulty: 1 },
  { id: 'asado', name: 'El Asado Pampeano', category: 'comida', province: 'buenos_aires', description: 'La ceremonia gastronómica más argentina.', difficulty: 1 },
  { id: 'dulce_leche', name: 'El Dulce de Leche', category: 'comida', province: 'buenos_aires', description: 'Postre nacional surgido por accidente en Cañuelas.', difficulty: 1 },
  { id: 'empanada_salteña', name: 'La Empanada Salteña', category: 'comida', province: 'salta', description: 'Empanada jugosa de carne cortada a cuchillo.', difficulty: 2 },
  { id: 'empanada_tucumana', name: 'La Empanada Tucumana', category: 'comida', province: 'tucuman', description: 'Considerada por muchos la mejor empanada del país.', difficulty: 2 },
  { id: 'alfajor_marplatense', name: 'El Alfajor Marplatense', category: 'comida', province: 'buenos_aires', description: 'Galletas con dulce de leche y baño de chocolate.', difficulty: 2 },
  { id: 'alfajor_cordobes', name: 'El Alfajor Cordobés', category: 'comida', province: 'cordoba', description: 'Con dulce de membrillo y baño blanco.', difficulty: 2 },
  { id: 'chocolate_bariloche', name: 'El Chocolate Bariloche', category: 'comida', province: 'rio_negro', description: 'Tradición chocolatera nacida en Bariloche.', difficulty: 2 },
  { id: 'malbec', name: 'El Vino Malbec', category: 'comida', province: 'mendoza', description: 'Cepa insignia de Argentina.', difficulty: 2 },
  { id: 'humita', name: 'La Humita en Chala', category: 'comida', province: 'tucuman', description: 'Plato precolombino con choclo molido.', difficulty: 3 },
  { id: 'locro', name: 'El Locro', category: 'comida', province: 'la_rioja', description: 'Guiso patrio del 25 de mayo y 9 de julio.', difficulty: 2 },

  // === TRADICIONES Y PRENDAS ===
  { id: 'poncho_salteño', name: 'El Poncho Salteño', category: 'prenda', province: 'salta', description: 'Poncho rojo con guarda negra usado por los gauchos salteños.', difficulty: 2 },
  { id: 'poncho_catamarqueño', name: 'El Poncho Catamarqueño', category: 'prenda', province: 'catamarca', description: 'Tejido fino de lana de vicuña.', difficulty: 3 },
  { id: 'gaucho', name: 'La Tradición Gaucha', category: 'tradición', province: 'buenos_aires', description: 'El gaucho como ícono cultural pampeano.', difficulty: 1 },
  { id: 'payada', name: 'La Payada', category: 'tradición', province: 'la_pampa', description: 'Improvisación poética cantada.', difficulty: 3 },
  { id: 'fileteado', name: 'El Fileteado Porteño', category: 'tradición', province: 'caba', description: 'Arte ornamental declarado Patrimonio Cultural Inmaterial.', difficulty: 3 },

  // === FIESTAS ===
  { id: 'vendimia', name: 'La Fiesta Nacional de la Vendimia', category: 'fiesta', province: 'mendoza', description: 'Celebración anual de la cosecha de la uva.', difficulty: 1 },
  { id: 'carnaval_jujeño', name: 'El Carnaval Jujeño', category: 'fiesta', province: 'jujuy', description: 'Carnaval andino con el ritual del desentierro del diablo.', difficulty: 2 },
  { id: 'carnaval_gualeguaychu', name: 'El Carnaval de Gualeguaychú', category: 'fiesta', province: 'entre_rios', description: 'El carnaval más grande del país.', difficulty: 2 },
  { id: 'carnaval_correntino', name: 'El Carnaval Correntino', category: 'fiesta', province: 'corrientes', description: 'Comparsas y batucadas en el litoral.', difficulty: 2 },
  { id: 'fiesta_sol', name: 'La Fiesta Nacional del Sol', category: 'fiesta', province: 'san_juan', description: 'Celebración sanjuanina con elección de soberanas.', difficulty: 3 },
  { id: 'fiesta_poncho', name: 'La Fiesta Nacional del Poncho', category: 'fiesta', province: 'catamarca', description: 'Festival folclórico de Catamarca.', difficulty: 3 },
  { id: 'chaya', name: 'La Chaya Riojana', category: 'fiesta', province: 'la_rioja', description: 'Carnaval con harina, albahaca y vino.', difficulty: 3 },

  // === PATRIMONIO NATURAL ===
  { id: 'cataratas', name: 'Las Cataratas del Iguazú', category: 'patrimonio natural', province: 'misiones', description: 'Una de las siete maravillas naturales del mundo.', difficulty: 1 },
  { id: 'perito_moreno', name: 'El Glaciar Perito Moreno', category: 'patrimonio natural', province: 'santa_cruz', description: 'Glaciar en avance del Parque Nacional Los Glaciares.', difficulty: 1 },
  { id: 'ballena_franca', name: 'La Ballena Franca Austral', category: 'patrimonio natural', province: 'chubut', description: 'Monumento Natural Nacional, visita la Península Valdés.', difficulty: 2 },
  { id: 'aconcagua', name: 'El Cerro Aconcagua', category: 'patrimonio natural', province: 'mendoza', description: 'La montaña más alta de América.', difficulty: 2 },
  { id: 'fitz_roy', name: 'El Cerro Fitz Roy', category: 'patrimonio natural', province: 'santa_cruz', description: 'Ícono patagónico de El Chaltén.', difficulty: 3 },
  { id: 'siete_colores', name: 'El Cerro de los Siete Colores', category: 'patrimonio natural', province: 'jujuy', description: 'Símbolo de Purmamarca.', difficulty: 2 },
  { id: 'esteros_ibera', name: 'Los Esteros del Iberá', category: 'patrimonio natural', province: 'corrientes', description: 'Segundo humedal más grande del mundo.', difficulty: 3 },
  { id: 'talampaya', name: 'El Parque Talampaya', category: 'patrimonio natural', province: 'la_rioja', description: 'Cañones rojos Patrimonio de la Humanidad.', difficulty: 3 },
  { id: 'valle_luna', name: 'El Valle de la Luna', category: 'patrimonio natural', province: 'san_juan', description: 'Ischigualasto, paisaje paleontológico.', difficulty: 3 },

  // === PATRIMONIO HISTÓRICO ===
  { id: 'casa_tucuman', name: 'La Casa Histórica de Tucumán', category: 'patrimonio histórico', province: 'tucuman', description: 'Cuna de la Declaración de la Independencia.', difficulty: 2 },
  { id: 'manzana_jesuitica', name: 'La Manzana Jesuítica', category: 'patrimonio histórico', province: 'cordoba', description: 'Patrimonio de la Humanidad UNESCO.', difficulty: 3 },
  { id: 'cueva_manos', name: 'La Cueva de las Manos', category: 'patrimonio histórico', province: 'santa_cruz', description: 'Pinturas rupestres de hace 9000 años.', difficulty: 3 },
  { id: 'san_ignacio', name: 'Las Ruinas de San Ignacio Miní', category: 'patrimonio histórico', province: 'misiones', description: 'Reducción jesuítica patrimonio UNESCO.', difficulty: 3 },
  { id: 'casa_rosada', name: 'La Casa Rosada', category: 'patrimonio histórico', province: 'caba', description: 'Sede del Poder Ejecutivo Nacional.', difficulty: 1 },
  { id: 'obelisco', name: 'El Obelisco', category: 'patrimonio histórico', province: 'caba', description: 'Símbolo de Buenos Aires.', difficulty: 1 },
  { id: 'tren_nubes', name: 'El Tren a las Nubes', category: 'patrimonio histórico', province: 'salta', description: 'Una de las vías férreas más altas del mundo.', difficulty: 2 },
];

export const CULTURAL_BY_ID = Object.fromEntries(CULTURAL_ITEMS.map(c => [c.id, c]));

export function getCulturalItem(id) {
  return CULTURAL_BY_ID[id] ?? null;
}
