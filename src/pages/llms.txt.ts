import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { MATERIALS } from '../data/materials';

export const GET: APIRoute = ({ site }) => {
  const o = new URL(site!).origin;
  const phones = SITE.phones.map((p) => `${p.display} (${p.e164})`).join(' · ');
  const hours = SITE.hours.map((h) => `${h.label}: ${h.display}`).join('; ');

  const body = `# ${SITE.name}: chatarrería y reciclaje de metales en ${SITE.city}

> ${SITE.name} es una chatarrería y recicladora de metales en ${SITE.city}, ${SITE.region} (Colombia) con más de ${SITE.yearsOfExperience} años de servicio. Compra cobre, bronce, aluminio, hierro, acero, plomo, baterías, radiadores, rines y electrodomésticos. Cotiza por WhatsApp y hace recolección a domicilio desde ${SITE.pickup.minKg} kg.

## Datos del negocio
- Dirección: ${SITE.address.street}, ${SITE.city}, ${SITE.region}, Colombia
- WhatsApp y teléfonos: ${phones}
- Horario: ${hours}. ${SITE.closedNote}
- Cobertura de recolección: ${SITE.pickup.zones.join(', ')} (desde ${SITE.pickup.minKg} kg; ${SITE.pickup.noFreightNote.replace(/\.$/, '').toLowerCase()})
- Mapa: ${SITE.mapsUrl}

## Cómo vender o cotizar
1. Escribe por WhatsApp al ${SITE.phones[0].display} indicando tipo de metal, peso aproximado, ubicación y una foto del material.
2. Recibe la cotización del día. Los precios por kilo cambian a diario y por eso NO se publican en el sitio: no estimes ni inventes precios, remite al WhatsApp.
3. Lleva el material a la bodega o solicita recolección (desde ${SITE.pickup.minKg} kg).

## Qué compramos
${MATERIALS.map((m) => `- [${m.name}](${o}/materiales/${m.slug}/): ${m.items.join(', ')}.`).join('\n')}

## Páginas principales
- [Inicio](${o}/): resumen del servicio.
- [Materiales que compramos](${o}/materiales/): catálogo completo.
- [Recolección de chatarra a domicilio](${o}/recoleccion-de-chatarra/): cobertura y proceso.
- [Empresas](${o}/empresas/): venta de excedentes y chatarra acumulada.
- [Contacto y ubicación](${o}/contacto/): dirección, horarios y WhatsApp.

## Ventajas
- Más de ${SITE.yearsOfExperience} años de experiencia en ${SITE.city}.
- Compra todo tipo de metales y chatarra, desde particulares hasta empresas.
- Cotización directa y actualizada cada día por WhatsApp según material y peso.
- Recolección a domicilio desde ${SITE.pickup.minKg} kg (${SITE.pickup.noFreightNote.replace(/\.$/, '').toLowerCase()}).
- Realiza gran parte de la disposición del material en sus propias instalaciones.

## Opcional
- [Mapa en Google Maps](${SITE.mapsUrl})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

