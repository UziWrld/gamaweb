export interface Material {
  slug: string;
  name: string; // nombre corto (tarjetas, schema)
  h1: string;
  symbol: string; // ficha estilo tabla periódica
  number: string;
  priority: 1 | 2 | 3; // 1 = destacado en portada
  short: string; // texto de tarjeta
  metaTitle: string;
  metaDescription: string;
  items: string[]; // variantes que se compran
  intro: string;
  tips: string[]; // cómo cotizan mejor
  faqs?: { q: string; a: string }[];
}

export const MATERIALS: Material[] = [
  {
    slug: 'cobre',
    name: 'Cobre',
    h1: 'Compra de cobre en Bucaramanga',
    symbol: 'Cu',
    number: '29',
    priority: 1,
    short: 'Cobre brillante, 1B y mixto. El metal que mejor se paga: llévalo limpio y separado.',
    metaTitle: 'Compra de Cobre en Bucaramanga | Chatarrería Gama',
    metaDescription: 'Compra de cobre en Bucaramanga: cobre brillante, 1B y mixto. Cotiza por WhatsApp con tu peso y fotos y vende hoy en Chatarrería Gama.',
    items: ['Cobre brillante', 'Cobre 1B (primera)', 'Cobre mixto', 'Cable y alambre de cobre (consulta por WhatsApp)'],
    intro: 'En Chatarrería Gama compramos cobre en todas sus calidades. El precio depende del tipo y de la limpieza del material, y cambia cada día, por eso lo cotizamos por WhatsApp con el peso aproximado y una foto.',
    tips: [
      'Separa el cobre brillante del mixto: mezclados se cotizan al precio más bajo.',
      'Quita plásticos, soldaduras y partes de otros metales cuando sea posible.',
      'Envía una foto clara y el peso aproximado para una cotización rápida.',
    ],
    faqs: [
      { q: '¿A cómo está el kilo de cobre hoy en Bucaramanga?', a: 'El precio cambia todos los días según el mercado y la calidad del cobre. Escríbenos por WhatsApp con el tipo y el peso y te damos el precio del día.' },
      { q: '¿Qué diferencia hay entre cobre brillante, 1B y mixto?', a: 'Es la calidad y limpieza del material: el brillante y el 1B son los más limpios y el mixto trae otros materiales o recubrimientos. Mientras más limpio, mejor se cotiza.' },
    ],
  },
  {
    slug: 'aluminio',
    name: 'Aluminio',
    h1: 'Compra de aluminio en Bucaramanga',
    symbol: 'Al',
    number: '13',
    priority: 1,
    short: 'Perfil, ollas, potes, guaya, rines y más. Limpio paga mucho más que contaminado.',
    metaTitle: 'Compra de Aluminio en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de aluminio en Bucaramanga: perfil, ollas, potes, guaya y rines. Mientras más limpio, mejor se cotiza. Pide el precio del día por WhatsApp.',
    items: ['Aluminio perfil limpio', 'Aluminio grueso y blando', 'Ollas y potes de aluminio', 'Guaya de aluminio', 'Planchas de litografía', 'Rines de auto, camión y bicicleta', 'Cilindros de moto', 'Persiana y aluminio contaminado'],
    intro: 'El aluminio es uno de los materiales que más se mueve en nuestra bodega. Compramos desde perfil limpio hasta aluminio revuelto o contaminado; el precio por kilo varía según el tipo y la limpieza.',
    tips: [
      'El perfil limpio (sin tornillos, caucho ni vidrio) se paga muy por encima del contaminado.',
      'Separa ollas y potes del aluminio grueso.',
      'Si son rines, indica si son de auto, camión o bicicleta.',
    ],
    faqs: [
      { q: '¿Compran aluminio revuelto o contaminado?', a: 'Sí, compramos todo tipo de aluminio. El aluminio limpio y separado se cotiza mejor que el revuelto o contaminado.' },
    ],
  },
  {
    slug: 'chatarra-hierro-acero',
    name: 'Chatarra de hierro y acero',
    h1: 'Compra de chatarra de hierro y acero en Bucaramanga',
    symbol: 'Fe',
    number: '26',
    priority: 1,
    short: 'Hierro, acero y chatarra ferrosa en grandes volúmenes, con recolección desde 300 kg.',
    metaTitle: 'Compra de Chatarra de Hierro y Acero en Bucaramanga',
    metaDescription: 'Compra de chatarra de hierro y acero en Bucaramanga. Recibimos grandes volúmenes y recogemos desde 300 kg. Cotiza por WhatsApp hoy mismo.',
    items: ['Hierro gris (fundición)', 'Chatarra de hierro', 'Acero', 'Acero papelillo', 'Acero voluminoso', 'Viruta de acero'],
    intro: 'La chatarra ferrosa es el material de mayor volumen. Si acumulas hierro o acero en tu casa, taller, obra o empresa, lo recibimos en bodega o lo recogemos desde 300 kg.',
    tips: [
      'Para volúmenes grandes, pide recolección: ahorras flete y tiempo.',
      'Indica si es hierro gris, acero o material voluminoso: se cotizan distinto.',
    ],
    faqs: [
      { q: '¿Desde cuántos kilos hacen recolección de chatarra?', a: 'Hacemos recolección desde 300 kg. Escríbenos por WhatsApp con tu ubicación y el material para coordinar.' },
    ],
  },
  {
    slug: 'bronce-y-radiadores',
    name: 'Bronce y radiadores',
    h1: 'Compra de bronce y radiadores en Bucaramanga',
    symbol: 'Cu·Sn',
    number: '29·50',
    priority: 2,
    short: 'Bronce, bronce pintado, radiadores de cobre, mixtos y de aluminio.',
    metaTitle: 'Compra de Bronce y Radiadores en Bucaramanga',
    metaDescription: 'Compramos bronce y radiadores de cobre, mixtos y de aluminio en Bucaramanga. Envía fotos y peso por WhatsApp y recibe tu cotización del día.',
    items: ['Bronce', 'Bronce pintado', 'Bronce vainilla', 'Viruta de bronce', 'Radiador de cobre', 'Radiador mixto', 'Radiador de aluminio'],
    intro: 'Compramos bronce en sus variantes y radiadores de distintos materiales. Cada tipo tiene un precio diferente, así que una foto del material acelera la cotización.',
    tips: ['Indica si el radiador es de cobre, mixto o aluminio.', 'No mezcles bronce con otros metales.'],
  },
  {
    slug: 'baterias',
    name: 'Baterías usadas',
    h1: 'Compra de baterías usadas en Bucaramanga',
    symbol: 'Pb',
    number: '82',
    priority: 2,
    short: 'Baterías de carro, camión, moto y estacionarias. Cotiza por tipo y cantidad.',
    metaTitle: 'Compra de Baterías Usadas en Bucaramanga | Gama',
    metaDescription: 'Compra de baterías usadas en Bucaramanga: de carro, camión, moto y estacionarias. Cotiza por WhatsApp según el tipo de batería y la cantidad.',
    items: ['Baterías de carro (N40, N42, N48, N27)', 'Baterías 30H, 4D y 8D (camión y maquinaria)', 'Baterías de moto', 'Baterías estacionarias'],
    intro: 'Compramos baterías usadas de todos los tamaños. El valor depende del tipo (referencia) y de la cantidad, por eso pedimos que nos escribas la referencia que aparece en la batería.',
    tips: ['Envía la referencia (por ejemplo N40, 4D, 8D) y cuántas tienes.', 'Transpórtalas en posición vertical y sin abrirlas.'],
  },
  {
    slug: 'plomo-y-antimonio',
    name: 'Plomo y antimonio',
    h1: 'Compra de plomo y antimonio en Bucaramanga',
    symbol: 'Pb',
    number: '82',
    priority: 3,
    short: 'Plomo limpio, balancín y antimonio.',
    metaTitle: 'Compra de Plomo y Antimonio en Bucaramanga',
    metaDescription: 'Compra de plomo y antimonio en Bucaramanga: plomo limpio y balancín. Envía el peso aproximado por WhatsApp y te damos la cotización del día.',
    items: ['Plomo limpio', 'Balancín', 'Antimonio'],
    intro: 'Compramos plomo y antimonio. Cotizamos según el tipo y el peso, con el precio del día.',
    tips: ['Indica si es plomo limpio o balancín.'],
  },
  {
    slug: 'electrodomesticos',
    name: 'Neveras, lavadoras y televisores',
    h1: 'Compra de neveras, lavadoras y televisores usados en Bucaramanga',
    symbol: 'Cu·Al·Fe',
    number: '',
    priority: 2,
    short: 'Electrodomésticos y equipos electrónicos en desuso. Consulta por recolección.',
    metaTitle: 'Compra de Neveras, Lavadoras y TV Usados en Bucaramanga',
    metaDescription: 'Compramos neveras, lavadoras y televisores usados en Bucaramanga. Cotiza por WhatsApp con una foto y consulta por recolección desde 300 kg.',
    items: ['Neveras', 'Lavadoras', 'Televisores', 'Otros electrodomésticos y chatarra electrónica (consulta)'],
    intro: 'Si tienes electrodomésticos en desuso, te los compramos. Escríbenos con una foto y la cantidad; si son varios, coordinamos la recolección.',
    tips: ['Envía foto y cantidad.', 'Si completas 300 kg o más, podemos recogerlos.'],
  },
];

