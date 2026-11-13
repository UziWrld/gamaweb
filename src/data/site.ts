export const SITE = {
  name: 'Chatarrería Gama',
  alternateName: 'Gama Metales',
  slogan: 'Compra y venta de materiales reciclables',
  valueProp: 'Compra y venta de materiales reciclables',
  contactPerson: 'Andrea Ramírez',
  email: 'gamametales2@gmail.com',
  description:
    'Chatarrería Gama en Bucaramanga con más de 20 años de experiencia. Compra y venta de materiales reciclables: cobre, aluminio, hierro, bronce y baterías.',
  lang: 'es-CO',
  locale: 'es_CO',
  city: 'Bucaramanga',
  region: 'Santander',
  country: 'CO',

  address: {
    street: 'Carrera 11 No. 23-35',
    neighborhood: '', // TODO: barrio/sector exacto si aplica
    postalCode: '',
    plusCode: '4VF9+J5 Bucaramanga',
  },
  geo: { lat: 7.1241, lng: -73.132 },
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Carrera 11 No. 23-35 Bucaramanga')}`,
  gbpUrl: '',

  phones: [
    { label: 'WhatsApp / Ventas', display: '316 270 0257', e164: '+573162700257', wa: '573162700257' },
    { label: 'WhatsApp / Atención', display: '315 567 9684', e164: '+573155679684', wa: '573155679684' },
  ],

  hours: [
    { label: 'Lunes a viernes', display: '7:00 a. m. a 5:30 p. m.', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:30' },
    { label: 'Sábados', display: '7:00 a. m. a 1:30 p. m.', days: ['Saturday'], opens: '07:00', closes: '13:30' },
  ],
  closedNote: 'Domingos y festivos cerrado.',

  pickup: {
    minKg: 300,
    zones: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  },

  sameAs: [] as string[],
  yearsOfExperience: '20',
} as const;

export const NAV = [
  { href: '/materiales/', label: 'Materiales' },
  { href: '/recoleccion-de-chatarra/', label: 'Recolección' },
  { href: '/empresas/', label: 'Empresas' },
  { href: '/contacto/', label: 'Contacto' },
] as const;
