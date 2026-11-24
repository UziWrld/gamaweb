export const SITE = {
  name: 'Gama Metales',
  slogan: 'Pesaje justo y pago inmediato de contado en Bucaramanga.',
  description:
    'Chatarrería Gama Metales en Bucaramanga con más de 20 años de experiencia. Pesaje exacto a la vista, pago de contado inmediato y los mejores precios en cobre, aluminio, hierro y baterías.',
  lang: 'es-CO',
  locale: 'es_CO',
  city: 'Bucaramanga',
  region: 'Santander',
  country: 'CO',

  address: {
    street: 'Carrera 11 # 23-35',
    neighborhood: '',
    postalCode: '',
  },
  geo: { lat: 7.1241, lng: -73.132 },
  mapsUrl: 'https://maps.app.goo.gl/nxWr6wCvxXAxR6mE9',
  gbpUrl: 'https://maps.app.goo.gl/nxWr6wCvxXAxR6mE9',

  phones: [
    { label: 'WhatsApp principal', display: '317 645 9772', e164: '+573176459772', wa: '573176459772' },
    { label: 'WhatsApp / llamadas', display: '316 270 0257', e164: '+573162700257', wa: '573162700257' },
  ],

  hours: [
    { label: 'Lunes a viernes', display: '7:00 a. m. a 5:30 p. m. (jornada continua)', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:30' },
    { label: 'Sábados', display: '7:00 a. m. a 1:30 p. m. (jornada continua)', days: ['Saturday'], opens: '07:00', closes: '13:30' },
  ],
  closedNote: 'Atención en jornada continua (abierto al mediodía). Domingos y festivos cerrado.',

  pickup: {
    minKg: 300,
    zones: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
    noFreightNote: 'Sin costo de flete según tipo y volumen de material.',
  },

  sameAs: ['https://maps.app.goo.gl/nxWr6wCvxXAxR6mE9'],
  yearsOfExperience: '20',
} as const;

export const NAV = [
  { href: '/materiales/', label: 'Materiales' },
  { href: '/recoleccion-de-chatarra/', label: 'Recolección' },
  { href: '/empresas/', label: 'Empresas' },
  { href: '/contacto/', label: 'Contacto' },
] as const;
