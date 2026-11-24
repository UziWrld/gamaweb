import { SITE } from '../data/site';

export const waLink = (text: string, number: string = SITE.phones[0].wa) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** Mensaje para cotizar un material concreto (botón de cada tarjeta). */
export function quoteMessage({ material, pickup = false }: { material: string; pickup?: boolean }) {
  return [
    `Hola ${SITE.name}, tengo ${material} para vender y quisiera saber el precio de hoy.`,
    `- Peso aproximado: ___ kg`,
    `- Entrega: ${pickup ? `Necesito recolección (+${SITE.pickup.minKg} kg)` : 'Lo llevo directamente a la bodega'}`,
    `- Barrio o municipio: ___`,
    `A continuación les adjunto fotos del material para que me coticen.`,
  ].join('\n');
}

/** Mensaje directo de venta (reemplaza lista de precios para filtrar competencia y validar intención real). */
export const priceListMessage = () =>
  [
    `Hola ${SITE.name}, tengo el siguiente material para vender y quisiera saber el precio de hoy:`,
    `- Material que tengo: ___`,
    `- Peso estimado: ___ kg`,
    `- Ubicación / barrio: ___`,
    `Ya les comparto fotos para recibir la cotización.`,
  ].join('\n');

export const generalMessage = () =>
  [
    `Hola ${SITE.name}, tengo un material para vender y quisiera saber a cómo lo pagan hoy.`,
    `- Tipo de metal o chatarra: ___`,
    `- Peso aproximado: ___ kg`,
    `- Entrega: Lo llevo a bodega / Necesito recolección`,
    `- Barrio o municipio: ___`,
    `Les envío una foto del lote en el siguiente mensaje.`,
  ].join('\n');


