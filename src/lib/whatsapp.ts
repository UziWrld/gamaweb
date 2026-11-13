import { SITE } from '../data/site';

export const waLink = (text: string, number: string = SITE.phones[0].wa) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** Mensaje para cotizar un material concreto (botón de cada tarjeta). */
export function quoteMessage({ material, pickup = false }: { material: string; pickup?: boolean }) {
  return [
    `Hola ${SITE.name}, quiero cotizar: *${material}*.`,
    `- Peso aproximado: ___ kg`,
    `- ¿Necesita recolección?: ${pickup ? `Sí (tengo ${SITE.pickup.minKg} kg o más)` : 'No, lo llevo a la bodega'}`,
    `- Ubicación o barrio: ___`,
    `Te envío una foto del material en el siguiente mensaje.`,
  ].join('\n');
}

export const priceListMessage = () =>
  `Hola ${SITE.name}, ¿me comparten la lista de precios de hoy, por favor?`;

export const generalMessage = () =>
  [
    `Hola ${SITE.name}, quiero cotizar mi chatarra.`,
    `- Tipo de metal: ___`,
    `- Peso aproximado: ___ kg`,
    `- ¿Necesita recolección?: ___`,
    `- Ubicación o barrio: ___`,
  ].join('\n');

