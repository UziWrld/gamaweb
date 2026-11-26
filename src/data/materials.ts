import type { ImageMetadata } from 'astro';
import cobreImg from '../assets/materiales/cobre.jpg';
import aluminioImg from '../assets/materiales/aluminio.jpg';
import bronceImg from '../assets/materiales/bronce.jpg';
import bateriasImg from '../assets/materiales/baterias.jpg';
import hierroImg from '../assets/materiales/hierro.jpg';
import electrodomesticosImg from '../assets/materiales/electrodomesticos.jpg';
import plomoImg from '../assets/materiales/plomo.jpg';

export interface MaterialGalleryItem {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export interface MaterialPrepStep {
  title: string;
  detail: string;
}

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
  priceDrivers: string[];
  prepSteps: MaterialPrepStep[];
  tips: string[];
  faqs: { q: string; a: string }[];
  image?: ImageMetadata;
  imageAlt?: string;
  gallery?: MaterialGalleryItem[];
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
    short: 'Tubería, cable pelado brillante, cable encauchetado y cobre mixto. Cotización del día según calidad.',
    metaTitle: 'Compra de Cobre en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de cobre en Bucaramanga: cobre brillante, 1B y mixto. Cotiza por WhatsApp con tu peso y fotos y vende hoy en Gama Metales.',
    items: [
      'Cobre brillante (cable eléctrico pelado, limpio y sin barniz)',
      'Cobre 1B o primera (tubería de agua o gas libre de soldaduras)',
      'Cobre mixto o segunda (piezas con restos de estaño, pintura o pátina)',
      'Cable encauchetado y alambre de bobinado de motores o transformadores',
    ],
    intro: 'Compramos cobre en todas sus presentaciones: cable pelado brillante, tubería de plomería y refrigeración, alambre esmaltado de bobinado y cable encauchetado. En nuestra bodega clasificamos cada lote contigo para pagarte según su pureza real y la tarifa vigente del día.',
    priceDrivers: [
      'Clasificación y pureza: el cobre brillante (cable grueso pelado y sin oxidación) encabeza la tabla, seguido del cobre 1B y finalmente el mixto.',
      'Porcentaje de aislamiento en cable: cuando el cable viene encauchetado, el precio depende de cuánto cobre útil queda frente al peso del PVC o caucho.',
      'Presencia de impurezas: soldadura de estaño, niples de bronce, pintura o humedad reducen el rendimiento de fundición y bajan la categoría.',
      'Mercado diario y dólar: la cotización internacional del cobre y la tasa de cambio ajustan el valor por kilo cada jornada.',
    ],
    prepSteps: [
      {
        title: 'Separa por categoría antes de traerlo',
        detail: 'No juntes cable pelado brillante con tubería soldada ni con alambre fino quemado. Si llega mezclado en un solo costal, tiende a liquidarse en la tarifa inferior.',
      },
      {
        title: 'Retira llaves, acoples y soldaduras',
        detail: 'En tubería de plomería o aire acondicionado, corta las uniones de bronce, válvulas o tramos con mucho estaño para que el tramo limpio clasifique como primera.',
      },
      {
        title: 'Evalúa si conviene pelar el cable grueso',
        detail: 'El cable de calibre grueso suele compensar el tiempo de pelado al pasar de encauchetado a cobre brillante; en cable muy delgado o trenzado, muchas veces es más práctico venderlo con forro.',
      },
      {
        title: 'Envía foto clara antes de salir',
        detail: 'Mándanos por WhatsApp una imagen con buena luz donde se vea el grosor del hilo o el estado del tubo y el peso aproximado para darte una referencia previa.',
      },
    ],
    tips: [
      'Nunca quemes el cable para quitar el plástico: además de ser contaminante, el hollín oxida el cobre y lo baja de brillante a mixto.',
      'Si trabajas en obras eléctricas o de plomería, acumula los retales por tipo en canecas separadas para mejorar el promedio de venta.',
      'Para lotes grandes de obra o desmontaje, consulta por recolección a domicilio desde 300 kg.',
    ],
    faqs: [
      {
        q: '¿A cómo está el kilo de cobre hoy en Bucaramanga?',
        a: 'El valor del kilo cambia todos los días según el mercado internacional del metal y la categoría del material. Escríbenos por WhatsApp con el tipo de cobre, una foto y el peso estimado para darte el precio vigente hoy.',
      },
      {
        q: '¿Qué diferencia hay entre cobre brillante, 1B y mixto?',
        a: 'El cobre brillante es cable eléctrico grueso pelado, limpio y sin barniz ni oxidación. El 1B corresponde a tubería o lámina limpia sin soldaduras ni pintura. El mixto incluye piezas con restos de estaño, óxido, barniz o aleaciones adheridas.',
      },
      {
        q: '¿Compran cable encauchetado sin pelar?',
        a: 'Sí. Recibimos cable encauchetado de distintos calibres. En bodega evaluamos el grosor del conductor y la proporción de recubrimiento para cotizarlo de forma justa sin que tengas que pelarlo.',
      },
      {
        q: '¿Conviene quemar el cable de cobre antes de venderlo?',
        a: 'No. Quemar el recubrimiento daña la superficie del cobre, lo vuelve quebradizo y lo convierte en cobre quemado o mixto, que se paga por debajo del cobre brillante.',
      },
      {
        q: '¿Reciben cantidades pequeñas de cobre de un arreglo en casa?',
        a: 'Sí. En nuestra bodega de la Carrera 11 # 23-35 recibimos desde pocos kilos de un arreglo de plomería o electricidad hasta lotes grandes de contratistas y empresas.',
      },
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
    short: 'Perfil de ventana, ollas, rines, culatas y guayas. Limpio se cotiza mejor que contaminado.',
    metaTitle: 'Compra de Aluminio en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de aluminio en Bucaramanga: perfil, ollas, potes, guaya y rines. Mientras más limpio, mejor se cotiza. Pide el precio del día por WhatsApp.',
    items: [
      'Perfil de ventanería limpio (sin vidrio, caucho ni tornillos)',
      'Aluminio grueso, bloques y piezas de fundición (culatas, cárteres)',
      'Ollas, sartenes y utensilios domésticos de aluminio',
      'Rines de auto, camión, moto y bicicleta',
      'Guaya eléctrica de aluminio (con o sin alma de acero)',
      'Planchas de litografía y lámina limpia',
      'Persiana, envases y aluminio contaminado con hierro o plástico',
    ],
    intro: 'Compramos aluminio en todas sus líneas: desde perfiles arquitectónicos de ventanería hasta rines, ollas, láminas de litografía y piezas automotrices. Separar las piezas limpias de las que traen tornillos o hierro marca una diferencia directa en el valor por kilo.',
    priceDrivers: [
      'Ausencia de contaminantes: tornillos de hierro, remaches, empaques de caucho, vidrio o silicona bajan el aluminio de categoría limpia a contaminada.',
      'Tipo de aleación: el perfil limpio, la guaya pura y las planchas de litografía suelen cotizar por encima de la chatarra delgada o la fundición sucia.',
      'Alma de acero en guayas y motores: las guayas ACSR con núcleo de acero o las carcasas con rodamientos se clasifican distinto a la pieza 100 % aluminio.',
      'Volumen y presentación: lotes clasificados por familia facilitan el pesaje ágil en bodega.',
    ],
    prepSteps: [
      {
        title: 'Limpia el perfil de ventanería',
        detail: 'Retira vidrios, felpas, empaques de caucho, chapas y tornillos de acero. El perfil limpio tiene una tarifa superior al aluminio contaminado.',
      },
      {
        title: 'Separa ollas y lámina de la fundición',
        detail: 'Agrupa utensilios de cocina y láminas delgadas aparte de bloques gruesos, culatas o carcasas de motor.',
      },
      {
        title: 'Retira llantas y contrapesos en rines',
        detail: 'Si llevas rines de carro o moto, retira la llanta y, de ser posible, las válvulas o balancines de plomo.',
      },
      {
        title: 'Verifica con imán si tienes duda',
        detail: 'El aluminio puro no se pega al imán; si una pieza atrae el imán, tiene partes de hierro o acero que conviene separar.',
      },
    ],
    tips: [
      'En talleres de ornamentación y vidrierías, guardar el retal limpio de perfil en bolsas aparte evita que se mezcle con limalla o tornillería.',
      'Las planchas de litografía limpias tienen buena salida: evita doblarlas con otros residuos encima.',
      'Para lotes desde 300 kg en talleres u obras, solicita programación de recogida por WhatsApp.',
    ],
    faqs: [
      {
        q: '¿Compran aluminio revuelto o con tornillos?',
        a: 'Sí, recibimos aluminio contaminado o con accesorios de hierro o plástico. Sin embargo, si retiras tornillos, cauchos y vidrios antes de traerlo, se paga como aluminio limpio a una tarifa más alta.',
      },
      {
        q: '¿Qué diferencia hay entre aluminio perfil, blando y grueso?',
        a: 'El perfil corresponde a marcos y rieles de ventanería o puertas; el blando agrupa ollas, láminas delgadas y utensilios; el grueso o fundición incluye rines, culatas, bloques y piezas fundidas.',
      },
      {
        q: '¿Compran rines de aluminio dañados o partidos?',
        a: 'Sí, compramos rines de carro, camión, moto y bicicleta aunque estén fisurados o doblados, siempre que vengan sin llanta.',
      },
      {
        q: '¿Cómo se cotizan las guayas eléctricas de aluminio?',
        a: 'Depende de si es guaya de aluminio puro o guaya con alma de acero en el centro. Envíanos una foto de la punta del cable por WhatsApp para darte el valor exacto.',
      },
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
    items: [
      'Varilla de construcción, malla electrosoldada y estribos',
      'Vigas, perfiles estructurales, tubería y rejas',
      'Hierro gris de fundición (discos de freno, bloques, tapas pesadas)',
      'Láminas, latonería y retales de taller (acero papelillo)',
      'Acero inoxidable (304, 316, mesones, tanques y tubería)',
      'Viruta de torno y maquinaria industrial en desuso',
    ],
    intro: 'Recibimos chatarra ferrosa en cualquier volumen: sobrantes de obra, varilla, estructuras metálicas, lámina, discos de freno y maquinaria en desuso. Si acumulas 300 kg o más en Bucaramanga o el área metropolitana, coordinamos camión y cargue directo en tu sitio.',
    priceDrivers: [
      'Espesor y densidad: el hierro pesado o estructural (vigas, varilla gruesa, fundición) rinde más que la lámina delgada o papelillo.',
      'Acero inoxidable vs. hierro común: el acero inoxidable contiene níquel y cromo, por lo que se cotiza en una categoría muy superior al hierro corriente.',
      'Tamaño de las piezas: material ya cortado o manejable facilita el cargue y la clasificación frente a estructuras sobredimensionadas.',
      'Peso libre de escombro: concreto pegado a varillas, madera, llantas o tierra descuentan rendimiento si no se limpian.',
    ],
    prepSteps: [
      {
        title: 'Separa el acero inoxidable del hierro común',
        detail: 'Usa un imán: el hierro y el acero al carbono se pegan fuerte; el acero inoxidable austenítico (como el de mesones y cocinas) normalmente no se adhiere o lo hace muy poco.',
      },
      {
        title: 'Retira madera, concreto y plásticos',
        detail: 'Limpia restos de cemento adheridos a varillas o tablas atornilladas a estanterías para evitar descuentos por material no metálico.',
      },
      {
        title: 'Agrupa la viruta en lonas o canecas',
        detail: 'Si generas viruta de torno o fresadora, guárdala en costales o tambores libres de trapos, basuras o exceso de taladrina.',
      },
      {
        title: 'Calcula si llegas a 300 kg para recogida',
        detail: 'Si tienes rejas, vigas, maquinaria o varios bultos de obra que superan los 300 kg, envíanos fotos y dirección para agendar recolección.',
      },
    ],
    tips: [
      'En obras civiles, destinar una esquina seca para retales de varilla y lámina evita que se entierren en escombro y se pierda valor.',
      'Si vas a desarmar estanterías, portones o maquinaria pesada, consúltanos antes por WhatsApp para evaluar logística de transporte.',
    ],
    faqs: [
      {
        q: '¿Desde cuántos kilos hacen recolección de chatarra a domicilio?',
        a: 'Realizamos recolección a domicilio a partir de 300 kg en Bucaramanga, Floridablanca, Girón y Piedecuesta, sin costo de flete según el tipo y volumen de material.',
      },
      {
        q: '¿Qué diferencia hay entre hierro pesado, papelillo y fundición?',
        a: 'El hierro pesado incluye vigas, varilla y perfil estructural de buen espesor; el papelillo es lámina delgada como latonería o estantería liviana; la fundición son piezas macizas como discos de freno o bloques de motor.',
      },
      {
        q: '¿Compran acero inoxidable aparte del hierro normal?',
        a: 'Sí. El acero inoxidable de cocinas industriales, tanques, barandas o tuberías se pesa y se paga por separado a un valor superior al del hierro común.',
      },
      {
        q: '¿Reciben maquinaria vieja o estructuras completas?',
        a: 'Sí. Envíanos fotos de la maquinaria o estructura por WhatsApp indicando el acceso del lugar para confirmar si requiere desarme previo o cómo coordinamos el cargue.',
      },
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
    items: [
      'Bronce sólido de piezas mecánicas, bujes y acoples',
      'Grifería, llaves de paso, medidores y válvulas',
      'Bronce vainilla y bronce pintado o cromado',
      'Viruta limpia de bronce de torno o mecanizado',
      'Radiadores de cobre puro',
      'Radiadores mixtos (cobre-aluminio) y radiadores de aluminio',
    ],
    intro: 'Compramos bronce de grifería, válvulas, bujes y mecanizado, así como radiadores automotrices e industriales de cobre, mixtos o aluminio. Una foto rápida por WhatsApp nos permite identificar el tipo exacto de radiador o aleación antes de que vengas.',
    priceDrivers: [
      'Limpieza de la pieza: llaves o válvulas con manijas plásticas, empaques o ejes de hierro dentro rinden menos que el bronce limpio.',
      'Tipo de radiador: un radiador de cobre-bronce tiene mayor valor por kilo que uno mixto (panal de aluminio con cabezales de cobre) o uno 100 % aluminio con tapas plásticas.',
      'Separación del bronce vs. cobre: aunque son de la misma familia, el cobre puro vale más que el bronce y conviene pesarlos aparte.',
      'Viruta seca y sin hierro: la viruta de bronce libre de mezcla con acero o aluminio se cotiza mucho mejor.',
    ],
    prepSteps: [
      {
        title: 'Quita mangueras, tapas y abrazaderas de los radiadores',
        detail: 'Desmonta las mangueras de caucho, soportes de hierro y motoventiladores para que el radiador no se penalice como sucio.',
      },
      {
        title: 'Retira tornillos y tubos de hierro de la grifería',
        detail: 'En llaves, mezcladores y registros viejos, saca acoples galvanizados, manijas plásticas o resortes de acero si salen fácil.',
      },
      {
        title: 'No mezcles viruta de bronce con viruta de acero',
        detail: 'En talleres de torno, barre o recoge en recipientes distintos cada metal para no contaminar el bronce.',
      },
    ],
    tips: [
      'Si no sabes si una llave es bronce o antimonio cromado, ráspala ligeramente en un borde: el bronce revela color amarillo dorado y el cobre tono rojizo.',
      'En radiadores de aire acondicionado (serpentines), revisa si los codos son de cobre y las aletas de aluminio (mixto).',
    ],
    faqs: [
      {
        q: '¿Cómo sé si mi radiador es de cobre, mixto o de aluminio?',
        a: 'Los de cobre tienen tubos y tanques metálicos pesados de tono cobrizo o amarillo; los mixtos combinan tubería de cobre con aletas de aluminio (muy comunes en aires acondicionados); los de aluminio modernos son livianos y suelen traer tanques plásticos negros.',
      },
      {
        q: '¿Compran grifería usada con cromo o pintura?',
        a: 'Sí, compramos grifería cromada, pintada y llaves antiguas. Si retiras manijas plásticas y partes de hierro visibles, se clasifica mejor.',
      },
      {
        q: '¿Reciben viruta de bronce de talleres de torno?',
        a: 'Sí, compramos viruta de bronce limpia y separada de virutas de hierro o aluminio.',
      },
      {
        q: '¿Vale lo mismo el bronce que el cobre?',
        a: 'No, el cobre puro tiene una cotización superior por kilo porque el bronce es una aleación. Por eso siempre recomendamos llevarlos separados.',
      },
    ],
  },
  {
    slug: 'baterias',
    name: 'Baterías usadas',
    shortName: 'Baterías',
    h1: 'Compra de baterías usadas en Bucaramanga',
    symbol: 'Pb·Ac',
    number: '12V',
    priority: 2,
    image: bateriasImg,
    imageAlt: 'Baterías automotrices usadas de plomo-ácido para reciclaje en Bucaramanga',
    short: 'Baterías de auto, camión, moto y plantas eléctricas. Cotización según tamaño y referencia.',
    metaTitle: 'Compra de Baterías Usadas en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de baterías usadas en Bucaramanga: de carro, camión, moto y estacionarias. Cotiza por WhatsApp según el tipo de batería y la cantidad.',
    items: [
      'Baterías de automóvil y camioneta (referencias N40, N42, N48, N27, etc.)',
      'Baterías pesadas de camión, bus y maquinaria (30H, 4D, 8D)',
      'Baterías de motocicleta y motocarro',
      'Baterías estacionarias, UPS y bancos de plantas eléctricas',
    ],
    intro: 'Compramos baterías usadas de plomo-ácido fuera de servicio: de carros particulares, camionetas, tractomulas, motos, maquinaria amarilla y sistemas de respaldo (UPS/plantas). Indícanos la referencia y cuántas tienes para darte el valor exacto por WhatsApp.',
    priceDrivers: [
      'Referencia y peso de plomo interno: una batería 4D u 8D de camión contiene mucho más plomo recuperable que una batería N40 de automóvil o una de moto.',
      'Integridad de la carcasa: las baterías cerradas y completas conservan su peso estándar; no es necesario ni seguro abrirlas.',
      'Cantidad disponible: en talleres, servitecas y empresas de transporte cotizamos lotes completos con programación de recogida.',
    ],
    prepSteps: [
      {
        title: 'Identifica la referencia en la etiqueta',
        detail: 'Busca códigos como N40, N42, 30H, 4D u 8D, o tómale una foto de frente para darte el valor sin adivinar el tamaño.',
      },
      {
        title: 'Transpórtalas siempre de pie',
        detail: 'Coloca las baterías en posición vertical sobre una superficie firme para evitar derrames de electrolito ácido en el vehículo.',
      },
      {
        title: 'No las destapes ni vacíes el líquido',
        detail: 'El ácido interno es corrosivo y peligroso. Entrégalas selladas tal como salen del vehículo o equipo.',
      },
    ],
    tips: [
      'Evita que los bornes hagan contacto con herramientas u otras piezas metálicas durante el traslado.',
      'Si tu serviteca o taller acumula varias baterías al mes, coordina con nosotros entregas periódicas o recolección desde 300 kg.',
    ],
    faqs: [
      {
        q: '¿Las baterías se pagan por unidad, referencia o por kilo?',
        a: 'Trabajamos con referencia estándar y peso equivalente según el tipo de batería (carro, moto, 30H, 4D, 8D o estacionaria). Con una foto o la referencia te damos el precio al instante.',
      },
      {
        q: '¿Debo vaciarles el ácido antes de llevarlas?',
        a: 'No. Por seguridad y cuidado ambiental debes traerlas cerradas y en posición vertical sin derramar ni manipular el líquido.',
      },
      {
        q: '¿Compran baterías de UPS o plantas eléctricas?',
        a: 'Sí, compramos baterías estacionarias de plomo-ácido usadas en UPS, inversores y plantas eléctricas. Envíanos foto y peso aproximado de cada unidad.',
      },
      {
        q: '¿Recogen baterías a domicilio en talleres o flotas?',
        a: 'Sí, cuando el lote supera los 300 kg o se combina con otros metales (radiadores, rines, chatarra), podemos programar recolección en Bucaramanga y el área metropolitana.',
      },
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
    items: [
      'Plomo limpio en lingotes, láminas o retales',
      'Tubería antigua de plomo y sellos de plomería',
      'Balancines y contrapesos de llantas (plomo con grapa)',
      'Antimonio y aleaciones duras de plomo',
    ],
    intro: 'Compramos plomo limpio, tubería antigua de plomería, láminas de blindaje, balancines de montallantas y antimonio. Clasificamos entre plomo suave limpio y material con grapas o aleaciones para liquidar según la tarifa del día.',
    priceDrivers: [
      'Pureza del plomo: el plomo blando y limpio (sin ganchos de acero ni zinc) se paga mejor que el balancín mezclado.',
      'Tipo de balancín: en montallantas suelen mezclarse contrapesos de plomo, zinc y acero; separarlos mejora el rendimiento del lote.',
      'Humedad y suciedad en tubería: tubos antiguos con restos de barro, cemento o estaño requieren limpieza previa.',
    ],
    prepSteps: [
      {
        title: 'Separa el plomo limpio de los balancines',
        detail: 'Las láminas o tubos puros se cotizan distinto a los balancines usados que traen grapa metálica.',
      },
      {
        title: 'En montallantas, aparta los contrapesos plásticos o de acero',
        detail: 'Muchos balancines modernos ya no son de plomo; revisar el lote evita mermas al momento de clasificar en bodega.',
      },
      {
        title: 'Manipula con guantes y lávate las manos',
        detail: 'El plomo es un metal pesado: usa guantes al recogerlo o pesarlo y guárdalo en recipientes resistentes por su alto peso en poco volumen.',
      },
    ],
    tips: [
      'Por su alta densidad, una bolsa pequeña de plomo puede pesar mucho más de lo que parece: usa baldes o lonas reforzadas para transportarlo.',
      'Si tienes dudas de si una pieza es plomo o zinc/antimonio, envíanos una foto cercana por WhatsApp.',
    ],
    faqs: [
      {
        q: '¿Qué diferencia hay entre plomo limpio y balancín?',
        a: 'El plomo limpio son láminas, lingotes o tubería pura sin incrustaciones de otros metales. El balancín corresponde a contrapesos de llanta que normalmente incluyen grapas de acero o mezclas de aleación.',
      },
      {
        q: '¿Compran tubería vieja de plomo de demoliciones?',
        a: 'Sí, recibimos tubería antigua de plomo de remodelaciones o demoliciones, preferiblemente libre de escombro o cemento pegado.',
      },
      {
        q: '¿Reciben cantidades pequeñas de plomo?',
        a: 'Sí, en nuestra bodega de la Carrera 11 # 23-35 puedes vender desde pocos kilos hasta lotes acumulados de talleres y montallantas.',
      },
      {
        q: '¿Cómo sé si tengo antimonio o plomo?',
        a: 'El plomo limpio es muy blando y se raya fácil con una punta o uña; el antimonio o las aleaciones duras son más rígidas y suenan distinto al golpearse. En bodega lo revisamos contigo al instante.',
      },
    ],
  },
  {
    slug: 'electrodomesticos',
    name: 'Neveras, lavadoras y televisores',
    shortName: 'Electrodomésticos',
    h1: 'Compra de neveras, lavadoras y televisores usados en Bucaramanga',
    symbol: 'Cu·Al·Fe',
    number: 'Hogar',
    priority: 2,
    image: electrodomesticosImg,
    imageAlt: 'Neveras, lavadoras y aparatos electrodomésticos en desuso para reciclaje en Bucaramanga',
    short: 'Neveras, lavadoras, congeladores y calentadores viejos. Despeja espacio y recibe pago por tus equipos.',
    metaTitle: 'Compra de Neveras, Lavadoras y TV Usados en Bucaramanga',
    metaDescription: 'Compramos neveras, lavadoras y televisores usados en Bucaramanga. Cotiza por WhatsApp con una foto y consulta por recolección desde 300 kg.',
    items: [
      'Neveras, nevecón y congeladores dañados o en desuso',
      'Lavadoras y secadoras (con motor y transmisión)',
      'Calentadores de agua, estufas metálicas y hornos',
      'Televisores, motores eléctricos y chatarra electrónica (consulta por WhatsApp)',
    ],
    intro: 'Compramos neveras, lavadoras, congeladores, calentadores y televisores fuera de servicio para aprovechamiento responsable de sus componentes metálicos. Escríbenos con una foto del equipo para confirmar si lo recibimos en bodega o si aplica para recogida.',
    priceDrivers: [
      'Equipo completo vs. desvalijado: una nevera o lavadora con su compresor o motor original tiene mayor valor que una carcasa vacía sin componentes internos.',
      'Contenido de cobre y aluminio: motores, compresores y serpentines aportan el mayor valor recuperable frente a la lámina y el plástico.',
      'Tipo de aparato y cantidad: en televisores antiguos o pantallas planas conviene consultar previamente por WhatsApp antes de trasladarlos.',
    ],
    prepSteps: [
      {
        title: 'Vacía y descongela los equipos antes de entregarlos',
        detail: 'Retira alimentos, bandejas de vidrio sueltas, agua residual de lavadoras y restos de basura para facilitar el manejo.',
      },
      {
        title: 'No rompas los tubos del compresor de neveras',
        detail: 'Mantén cerrado el circuito trasero de la nevera para evitar fugas y manipulación innecesaria antes de llegar a bodega.',
      },
      {
        title: 'Envía foto frontal y trasera por WhatsApp',
        detail: 'Así confirmamos en minutos el estado del aparato, su cotización aproximada y si vale la pena combinarlo con otros metales.',
      },
    ],
    tips: [
      'Si estás remodelando o desocupando una casa o local, junta los electrodomésticos con rejas, ollas o tubería para completar 300 kg y pedir recolección.',
      'Consúltanos primero por televisores o equipos electrónicos específicos para confirmarte recepción ese día.',
    ],
    faqs: [
      {
        q: '¿Compran neveras y lavadoras dañadas que ya no tienen arreglo?',
        a: 'Sí, precisamente compramos equipos dañados o en desuso para reciclar sus metales y motores. Envíanos una foto por WhatsApp para cotizarlo.',
      },
      {
        q: '¿Vienen a recoger una sola nevera o lavadora a domicilio?',
        a: 'Nuestro servicio de recolección a domicilio aplica a partir de 300 kg en total. Si solo tienes un electrodoméstico, puedes traerlo directamente a nuestra bodega en la Carrera 11 # 23-35 o juntarlo con más chatarra hasta completar el mínimo.',
      },
      {
        q: '¿Pagan diferente si a la nevera le falta el motor o compresor?',
        a: 'Sí. El compresor concentra gran parte del cobre y acero útil de la nevera; si viene completo se cotiza mejor que una carcasa vacía.',
      },
      {
        q: '¿Qué tipos de televisores o chatarra electrónica reciben?',
        a: 'La recepción de televisores y equipos electrónicos varía según modelo y estado. Mándanos una foto por WhatsApp antes de traerlos y te confirmamos al instante.',
      },
    ],
  },
];
