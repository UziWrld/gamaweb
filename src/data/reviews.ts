// reviews.ts: copia SOLO reseñas reales de tu perfil de Google (con su autor).
export interface Review {
  author: string;
  text: string;
  date?: string;
}

export const REVIEWS: Review[] = [
  // { author: 'Nombre del cliente', text: 'Texto exacto de la reseña…', date: '2026-05' },
];
