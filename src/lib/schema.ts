import { SITE } from '../data/site';
import { MATERIALS } from '../data/materials';
import type { Faq } from '../data/faqs';

export const businessSchema = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': ['RecyclingCenter', 'LocalBusiness'],
  '@id': `${siteUrl}/#negocio`,
  name: SITE.name,
  alternateName: ['Chatarrería Gama', `Chatarrería ${SITE.name}`],
  description: SITE.description,
  slogan: SITE.slogan,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/logo.png`,
  image: [`${siteUrl}/og/default.jpg`],
  telephone: SITE.phones[0].e164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
    ...(SITE.address.postalCode ? { postalCode: SITE.address.postalCode } : {}),
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  hasMap: SITE.mapsUrl,
  openingHoursSpecification: SITE.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  areaServed: SITE.pickup.zones.map((z) => ({ '@type': 'City', name: z })),
  contactPoint: SITE.phones.map((p) => ({
    '@type': 'ContactPoint',
    telephone: p.e164,
    contactType: 'customer service',
    areaServed: 'CO',
    availableLanguage: 'Spanish',
  })),
  knowsAbout: ['Compra de chatarra', 'Reciclaje de metales', 'Cobre', 'Aluminio', 'Hierro', 'Bronce', 'Baterías usadas'],
  ...(SITE.sameAs.length > 0 ? { sameAs: SITE.sameAs } : {}),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Compra de chatarra y metales',
    itemListElement: [
      ...MATERIALS.map((m) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `Compra de ${m.name.toLowerCase()}`,
          serviceType: 'Compra de chatarra y reciclaje de metales',
          areaServed: SITE.city,
          url: `${siteUrl}/materiales/${m.slug}/`,
        },
      })),
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `Recolección de chatarra a domicilio desde ${SITE.pickup.minKg} kg`,
          description: `${SITE.pickup.noFreightNote} Cobertura en ${SITE.pickup.zones.join(', ')}.`,
          serviceType: 'Recolección de chatarra y metales a domicilio',
          areaServed: SITE.pickup.zones,
          url: `${siteUrl}/recoleccion-de-chatarra/`,
        },
      },
    ],
  },
});

export const websiteSchema = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#web`,
  url: `${siteUrl}/`,
  name: SITE.name,
  inLanguage: SITE.lang,
  publisher: { '@id': `${siteUrl}/#negocio` },
});

export const breadcrumbSchema = (siteUrl: string, items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Inicio', path: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${siteUrl}${it.path}`,
  })),
});

// Las FAQ deben coincidir 1:1 con el texto visible de la página.
export const faqSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
