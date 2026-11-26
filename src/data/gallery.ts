import type { ImageMetadata } from 'astro';
import fachadaGama from '../assets/bodega/fachada-gama.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  alt: string;
  label: string;
}

// Única foto real de las instalaciones (sin repetir imágenes de materiales de arriba)
export const GALLERY: GalleryItem[] = [
  {
    src: fachadaGama,
    alt: 'Fachada e ingreso para descargue dentro de bodega en Carrera 11 # 23-35 Bucaramanga',
    label: 'Bodega e ingreso vehicular',
  },
];
