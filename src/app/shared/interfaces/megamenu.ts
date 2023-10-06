import { MegamenuColumn } from './megamenu-column';

type size = 'xl' | 'lg' | 'nl' | 'sm';
export interface Megamenu {
  type: 'megamenu';
  size: 'xl' | 'lg' | 'nl' | 'sm'; //
  image?: string;
  columns: MegamenuColumn[];
}
