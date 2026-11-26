import { SITE } from '../data/site';

export const waLink = (text: string, number: string = SITE.phones[0].wa) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** Mensaje para cotizar un material concreto (botón de cada tarjeta). */
export function quoteMessage({ material, pickup = false }: { material: string; pickup?: boolean }) {
  if (pickup) {
    return `Hola ${SITE.name}, tengo ${material} para vender y quisiera cotizar el precio de hoy con recolección.`;
  }
  return `Hola ${SITE.name}, tengo ${material} para vender y quisiera saber el precio de hoy.`;
}

/** Mensaje directo de venta o cotización de precios. */
export const priceListMessage = () =>
  `Hola ${SITE.name}, tengo material para vender y quisiera saber el precio de hoy.`;

/** Mensaje general de contacto y consulta. */
export const generalMessage = () =>
  `Hola ${SITE.name}, tengo un material para vender y quisiera saber a cómo lo pagan hoy.`;

/** Mensaje para avisar llegada física a la bodega. */
export const arrivalMessage = () =>
  `Hola ${SITE.name}, voy en camino a la bodega con material para vender.`;



