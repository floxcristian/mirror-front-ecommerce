export interface ProductFeature {
  nombre: string;
  valor: string;
  interno: string;
  recid: string;
}

export interface AtributosEspeciales {
  texto: string;
  icono: string;
  url: string;
}

export interface ProductFeaturesSection {
  name: string;
  features: ProductFeature[];
}

export interface ProductReview {
  avatar: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface ProductPrecio {
  precio: number;
  sucursal?: string;
  precioComun?: number;
  precio_escala: boolean;
  rut?: any; //string;
  desde?: string;
  hasta?: string;
}

export interface ProductOrigen {
  origen: string;
  subOrigen?: string;
  seccion?: string;
  recomendado?: string;
  ficha: boolean;
  cyber: number;
}

export interface Product {
  _id: string;
  sku: string;
  categoria: string;
  marca: string;
  linea: string;
  image_recid: string;
  nombre: string;
  precio: ProductPrecio;
  precioCliente: number;
  precio_escala: boolean;
  atributos: ProductFeature[];
  descripcion: string;
  id: number;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  badges: ('sale' | 'new' | 'hot')[];
  rating: number;
  reviews: number;
  availability: string;
  features: ProductFeature[];
  options: Array<any>;
  fecha?: string;
  certificadoPdf?: string;
  fullText?: string;
  precioComun?: number;
  imagen?: string;
  cyber?: number;
  cyberMonday?: number;
  origen?: ProductOrigen;
  estado?: string;
  fabricante?: string;
  fechaEntrega?: string;
  peso?: string;
  retiro?: boolean;
  stock?: any[];
  escala?: any[];
  numero_parte?: string;
  uen?: string;
}

export interface ProductCategory {
  id: number;
  level: number;
  name: string;
  on_header: boolean;
  parent: number;
  slug: string;
  url: any;
  count: number;
  categories?: ProductCategory[];
}
