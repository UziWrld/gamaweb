// reviews.ts: copia SOLO reseñas reales de tu perfil de Google (con su autor).
export interface Review {
  author: string;
  text: string;
  rating: number;
  date?: string;
}

export const REVIEWS: Review[] = [
  {
    author: 'Valeria',
    text: 'Muy buena atención y buenos precios.',
    rating: 5,
    date: 'Reseña en Google',
  },
  {
    author: 'Kevin Torres',
    text: 'Buena atención, pesaje correcto.',
    rating: 5,
    date: 'Reseña en Google',
  },
];
