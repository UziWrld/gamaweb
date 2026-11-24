import type { ImageMetadata } from 'astro';
import fachadaGama from '../assets/bodega/fachada-gama.jpg';
import cobreImg from '../assets/materiales/cobre.jpg';
import aluminioImg from '../assets/materiales/aluminio.jpg';
import bronceImg from '../assets/materiales/bronce.jpg';
import bateriasImg from '../assets/materiales/baterias.jpg';
import hierroImg from '../assets/materiales/hierro.jpg';
import electrodomesticosImg from '../assets/materiales/electrodomesticos.jpg';
import plomoImg from '../assets/materiales/plomo.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  alt: string;
  label: string;
}

export const GALLERY: GalleryItem[] = [
  {
    src: fachadaGama,
    alt: 'Fachada exterior de Chatarrería Gama en la Carrera 11 # 23-35 Bucaramanga',
    label: 'Bodega principal',
  },
  {
    src: cobreImg,
    alt: 'Cobre limpio y cable pelado brillante recibido en bodega',
    label: 'Cobre de primera',
  },
  {
    src: aluminioImg,
    alt: 'Perfilería de aluminio estructural limpio para reciclaje',
    label: 'Aluminio estructural',
  },
  {
    src: hierroImg,
    alt: 'Chatarra ferrosa pesada, vigas y perfiles de hierro',
    label: 'Chatarra de hierro',
  },
  {
    src: bronceImg,
    alt: 'Piezas, llaves y accesorios de bronce y latón',
    label: 'Bronce y grifería',
  },
  {
    src: bateriasImg,
    alt: 'Baterías usadas de automotor para reciclaje de plomo',
    label: 'Baterías usadas',
  },
  {
    src: plomoImg,
    alt: 'Tubería y retales de plomo y antimonio para reciclaje',
    label: 'Plomo y antimonio',
  },
  {
    src: electrodomesticosImg,
    alt: 'Aparatos electrodomésticos en desuso para reciclaje',
    label: 'Electrodomésticos',
  },
];


