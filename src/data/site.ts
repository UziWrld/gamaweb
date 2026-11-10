export const SITE = {
  name: 'Gama Metales',
  slogan: 'Nunca pares, nunca te conformes, insiste.',
  description:
    'Chatarrería y recicladora de metales en Bucaramanga con más de 20 años de experiencia. Compramos cobre, bronce, aluminio, hierro, acero, plomo, baterías y electrodomésticos.',
  lang: 'es-CO',
  locale: 'es_CO',
  city: 'Bucaramanga',
  region: 'Santander',
  country: 'CO',

  address: {
    street: 'Carrera 11 # 23-35',
    neighborhood: '', // TODO: barrio/sector exacto
    postalCode: '', // TODO: opcional
    plusCode: '4VF9+J5 Bucaramanga',
  },
  // TODO: verifica en Google Maps (derivadas del plus code 4VF9+J5)
  geo: { lat: 7.1241, lng: -73.132 },
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('4VF9+J5 Bucaramanga')}`,
  gbpUrl: '', // TODO: enlace al perfil de Google Business cuando lo recuperes

  phones: [
    { label: 'WhatsApp principal', display: '316 270 0257', e164: '+573162700257', wa: '573162700257' },
    { label: 'WhatsApp / llamadas', display: '317 645 9772', e164: '+573176459772', wa: '573176459772' },
  ],

  hours: [
    { label: 'Lunes a viernes', display: '7:00 a. m. a 5:30 p. m.', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:30' },
    { label: 'Sábados', display: '7:00 a. m. a 1:30 p. m.', days: ['Saturday'], opens: '07:00', closes: '13:30' },
  ],
  closedNote: 'Domingos y festivos cerrado.', // TODO: confirmar

  pickup: {
    minKg: 300,
    zones: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'], // TODO: confirmar cobertura
  },

  sameAs: [] as string[], // TODO: Facebook, Instagram, GBP, cuando existan
  yearsOfExperience: '20',
} as const;

export const NAV = [
  { href: '/materiales/', label: 'Materiales' },
  { href: '/recoleccion-de-chatarra/', label: 'Recolección' },
  { href: '/empresas/', label: 'Empresas' },
  { href: '/contacto/', label: 'Contacto' },
] as const;
