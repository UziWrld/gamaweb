import type { ImageMetadata } from 'astro';
import fachadaGama from '../assets/bodega/fachada-gama.jpg';
import bodegaInterior from '../assets/bodega/bodega-interior.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  alt: string;
  label: string;
}

export const GALLERY: GalleryItem[] = [
  {
    src: fachadaGama,
    alt: 'Fachada e ingreso vehicular a bodega de Chatarrería Gama Metales en Carrera 11 # 23-35 Bucaramanga',
    label: 'Fachada e ingreso vehicular',
  },
  {
    src: bodegaInterior,
    alt: 'Patio interior techado amplio para pesaje y descargue seguro en Chatarrería Gama Metales Bucaramanga',
    label: 'Patio interior y descargue bajo techo',
  },
];
