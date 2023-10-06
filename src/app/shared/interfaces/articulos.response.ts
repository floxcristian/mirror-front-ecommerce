export interface ArticuloResponse {
  error: boolean;
  msg: string;
  data: Articulo[];
}

export interface Articulo {
  _id: string;
  sku: string;
  nombre: string;
  peso: number;
  image: string;
  images: any[];
}
