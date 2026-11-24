import type { ImageMetadata } from 'astro';
import cobreImg from '../assets/materiales/cobre.jpg';
import aluminioImg from '../assets/materiales/aluminio.jpg';
import bronceImg from '../assets/materiales/bronce.jpg';
import bateriasImg from '../assets/materiales/baterias.jpg';
import hierroImg from '../assets/materiales/hierro.jpg';
import electrodomesticosImg from '../assets/materiales/electrodomesticos.jpg';
import plomoImg from '../assets/materiales/plomo.jpg';

export interface Material {
  slug: string;
  name: string;
  shortName?: string;
  h1: string;
  symbol: string;
  number: string;
  priority: 1 | 2 | 3;
  short: string;
  metaTitle: string;
  metaDescription: string;
  items: string[];
  intro: string;
  tips: string[];
  faqs?: { q: string; a: string }[];
  image?: ImageMetadata;
  imageAlt?: string;
}

export const MATERIALS: Material[] = [
  {
    slug: 'cobre',
    name: 'Cobre',
    shortName: 'Cobre',
    h1: 'Compra de cobre en Bucaramanga',
    symbol: 'Cu',
    number: '29',
    priority: 1,
    image: cobreImg,
    imageAlt: 'Bobinas de cable de cobre limpio y brillante recibido en Gama Metales Bucaramanga',
    short: 'Tubería, cable pelado brillante, cable encauchetado y cobre mixto. Pesaje exacto y pago de contado.',
    metaTitle: 'Compra de Cobre en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de cobre en Bucaramanga: cobre brillante, 1B y mixto. Cotiza por WhatsApp con tu peso y fotos y vende hoy en Gama Metales.',
    items: ['Cobre brillante (cable pelado)', 'Cobre 1B (tubería limpia)', 'Cobre mixto', 'Cable encauchetado y alambre de bobinado'],
    intro: 'Compramos cobre en todas sus presentaciones: tubería de fontanería, cable pelado brillante, cable con recubrimiento y cobre mixto. Pesamos frente a ti y liquidamos al instante de contado según el precio del día.',
    tips: [
      'Separa el cobre brillante del mixto o encauchetado: mezclados se pagan a la tarifa más baja.',
      'Retira llaves, soldaduras y uniones de otros metales para que te rinda como cobre de primera.',
      'Escríbenos por WhatsApp con una foto y el peso estimado para darte el valor exacto del kilo hoy.',
    ],
    faqs: [
      { q: '¿A cómo está el kilo de cobre hoy en Bucaramanga?', a: 'El precio cambia todos los días según el mercado y la calidad del cobre. Escríbenos por WhatsApp con el tipo y el peso y te damos el precio del día.' },
      { q: '¿Qué diferencia hay entre cobre brillante, 1B y mixto?', a: 'Es la calidad y limpieza del material: el brillante y el 1B son los más limpios y el mixto trae otros materiales o recubrimientos. Mientras más limpio, mejor se cotiza.' },
    ],
  },
  {
    slug: 'aluminio',
    name: 'Aluminio',
    shortName: 'Aluminio',
    h1: 'Compra de aluminio en Bucaramanga',
    symbol: 'Al',
    number: '13',
    priority: 1,
    image: aluminioImg,
    imageAlt: 'Perfiles de aluminio estructural limpio para reciclaje en Bucaramanga',
    short: 'Perfil de ventana, ollas, rines, culatas y guayas. Limpio paga mucho más que contaminado.',
    metaTitle: 'Compra de Aluminio en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de aluminio en Bucaramanga: perfil, ollas, potes, guaya y rines. Mientras más limpio, mejor se cotiza. Pide el precio del día por WhatsApp.',
    items: ['Perfil de ventanería limpio', 'Aluminio grueso y fundición', 'Ollas y utensilios de aluminio', 'Rines de auto, camión y moto', 'Guaya de aluminio', 'Planchas de litografía', 'Persiana y aluminio con tornillos'],
    intro: 'Compramos todo tipo de aluminio: desde perfiles limpios de ventanas hasta rines, ollas y piezas de motor. Pagamos de contado según la calidad y el estado del material.',
    tips: [
      'El perfil de ventanería sin tornillos, caucho ni vidrio tiene un precio mucho más alto.',
      'Separa las ollas y chatarra delgada del aluminio grueso o fundición.',
      'Si tienes rines o culatas de motor, indícanos si vienen con rodamientos o partes de hierro.',
    ],
    faqs: [
      { q: '¿Compran aluminio revuelto o contaminado?', a: 'Sí, compramos todo tipo de aluminio. El aluminio limpio y separado se cotiza mejor que el revuelto o contaminado.' },
    ],
  },
  {
    slug: 'chatarra-hierro-acero',
    name: 'Chatarra de hierro y acero',
    shortName: 'Hierro y Acero',
    h1: 'Compra de chatarra de hierro y acero en Bucaramanga',
    symbol: 'Fe',
    number: '26',
    priority: 1,
    image: hierroImg,
    imageAlt: 'Lote de chatarra ferrosa, vigas y perfiles de hierro y acero en Bucaramanga',
    short: 'Varilla, vigas, rejas, lámina, chatarra ferrosa y maquinaria pesada. Recolección desde 300 kg.',
    metaTitle: 'Compra de Chatarra de Hierro y Acero en Bucaramanga',
    metaDescription: 'Compra de chatarra de hierro y acero en Bucaramanga. Recibimos grandes volúmenes y recogemos desde 300 kg. Cotiza por WhatsApp hoy mismo.',
    items: ['Varilla de construcción y malla', 'Vigas, perfiles y rejas', 'Hierro gris de fundición', 'Láminas y retales de taller', 'Acero inoxidable', 'Viruta de torno y maquinaria en desuso'],
    intro: 'Recibimos chatarra ferrosa en cualquier cantidad: varilla de obra, rejas, vigas, tubería, maquinaria pesada y lámina. Si tienes más de 300 kg, coordinamos camión y recolección directamente en tu sitio.',
    tips: [
      'Para cantidades grandes en obras o talleres, solicita recolección a domicilio: te ahorras el flete y la logística.',
      'Separa el acero inoxidable del hierro común: el acero inoxidable se cotiza a un valor muy superior.',
    ],
    faqs: [
      { q: '¿Desde cuántos kilos hacen recolección de chatarra?', a: 'Hacemos recolección desde 300 kg. Escríbenos por WhatsApp con tu ubicación y el material para coordinar.' },
    ],
  },
  {
    slug: 'bronce-y-radiadores',
    name: 'Bronce y radiadores',
    shortName: 'Bronce',
    h1: 'Compra de bronce y radiadores en Bucaramanga',
    symbol: 'Cu·Sn',
    number: '29·50',
    priority: 2,
    image: bronceImg,
    imageAlt: 'Piezas, llaves y racores de bronce y latón para reciclaje en Bucaramanga',
    short: 'Grifería, llaves, válvulas, piezas de torno y radiadores de cobre, mixtos o aluminio.',
    metaTitle: 'Compra de Bronce y Radiadores en Bucaramanga',
    metaDescription: 'Compramos bronce y radiadores de cobre, mixtos y de aluminio en Bucaramanga. Envía fotos y peso por WhatsApp y recibe tu cotización del día.',
    items: ['Bronce de piezas mecánicas', 'Grifería, llaves y válvulas', 'Bronce vainilla', 'Viruta de bronce', 'Radiadores de cobre', 'Radiadores mixtos y de aluminio'],
    intro: 'Compramos bronce de piezas mecánicas, grifería, válvulas y viruta, además de radiadores de cobre, mixtos y de aluminio. Pesaje exacto a la vista y liquidación inmediata.',
    tips: [
      'Retira mangueras plásticas y abrazaderas de hierro de los radiadores para recibir la mejor cotización.',
      'No mezcles bronce con cobre: el cobre tiene un precio más alto y te conviene venderlo por separado.',
    ],
  },
  {
    slug: 'baterias',
    name: 'Baterías usadas',
    shortName: 'Baterías',
    h1: 'Compra de baterías usadas en Bucaramanga',
    symbol: 'Pb',
    number: '82',
    priority: 2,
    image: bateriasImg,
    imageAlt: 'Baterías automotrices usadas de plomo-ácido para reciclaje en Bucaramanga',
    short: 'Baterías de auto, camión, moto y plantas eléctricas. Te pagamos según tamaño y referencia.',
    metaTitle: 'Compra de Baterías Usadas en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de baterías usadas en Bucaramanga: de carro, camión, moto y estacionarias. Cotiza por WhatsApp según el tipo de batería y la cantidad.',
    items: ['Baterías de auto (N40, N42, N48, N27)', 'Baterías pesadas de camión (30H, 4D, 8D)', 'Baterías de moto', 'Baterías estacionarias y de plantas eléctricas'],
    intro: 'Compramos baterías de plomo-ácido fuera de uso: de autos, camiones (4D, 8D), motos, maquinaria pesada y bancos de baterías estacionarias. Te las pagamos de contado según tamaño y referencia.',
    tips: [
      'Escríbenos la referencia que aparece en la etiqueta (por ejemplo 4D, 8D, N40) para darte el precio de inmediato.',
      'Mantén las baterías en posición vertical y sin derramar el líquido para transportarlas con seguridad.',
    ],
  },
  {
    slug: 'plomo-y-antimonio',
    name: 'Plomo y antimonio',
    shortName: 'Plomo',
    h1: 'Compra de plomo y antimonio en Bucaramanga',
    symbol: 'Pb',
    number: '82',
    priority: 3,
    image: plomoImg,
    imageAlt: 'Tubería y retales de plomo y antimonio para reciclaje en Bucaramanga',
    short: 'Plomo limpio, tubería antigua de plomo, balancines de llanta y antimonio.',
    metaTitle: 'Compra de Plomo y Antimonio en Bucaramanga',
    metaDescription: 'Compra de plomo y antimonio en Bucaramanga: plomo limpio y balancín. Envía el peso aproximado por WhatsApp y te damos la cotización del día.',
    items: ['Plomo limpio', 'Tubería antigua de plomo', 'Balancines y pesas de llanta', 'Antimonio'],
    intro: 'Compramos plomo limpio, tubería antigua de plomo, balancines de llantas y antimonio. Cotizamos según el peso con la tasa actualizada del mercado.',
    tips: [
      'Indícanos si es plomo limpio en lingotes/bloques o si son balancines con grapas de hierro.',
    ],
  },
  {
    slug: 'electrodomesticos',
    name: 'Neveras, lavadoras y televisores',
    shortName: 'Electrodomésticos',
    h1: 'Compra de neveras, lavadoras y televisores usados en Bucaramanga',
    symbol: 'Cu·Al·Fe',
    number: '',
    priority: 2,
    image: electrodomesticosImg,
    imageAlt: 'Neveras, lavadoras y aparatos electrodomésticos en desuso para reciclaje en Bucaramanga',
    short: 'Neveras, lavadoras, congeladores y calentadores viejos. Despeja espacio y recibe dinero hoy.',
    metaTitle: 'Compra de Neveras, Lavadoras y TV Usados en Bucaramanga',
    metaDescription: 'Compramos neveras, lavadoras y televisores usados en Bucaramanga. Cotiza por WhatsApp con una foto y consulta por recolección desde 300 kg.',
    items: ['Neveras y congeladores', 'Lavadoras y secadoras', 'Calentadores de agua y motores', 'Televisores y chatarra electrónica'],
    intro: 'Compramos neveras, lavadoras, congeladores, calentadores y televisores en desuso. Si vas a remodelar o despejar tu espacio, te compramos tus aparatos viejos por kilo o unidad.',
    tips: [
      'Envíanos una foto por WhatsApp del electrodoméstico para cotizarte de inmediato.',
      'Si completas 300 kg o tienes varios aparatos en tu casa o finca, podemos pasar a recogerlos.',
    ],
  },
];
