export interface CategoryApi {
  id?: string;
  title: string;
  url: string;
  products?: number;
  image?: string;
  children?: CategoryApi[];
}
