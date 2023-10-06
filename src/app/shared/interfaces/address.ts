export interface Address {
  default: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  postcode: string;
  address: string;
}

export interface ShippingAddress {
  codRegion?: string;
  calle: string;
  comuna: string;
  numero: string;
  recid: number;
  lat: string;
  lng: string;
  localidad: string;
  validada: boolean;
  deptocasa?: string;
  direccionCompleta?: string;
  default?: boolean;
}

export interface ShippingService {
  index: number;
  id: number;
  diasdemora: number;
  fecha: any;
  fechaPicking: any;
  fechaObj?: any[];
  origen: string;
  precio: number;
  proveedor: string;
  tipoenvio: string;
  tipopedido: string;
  isSabado?: boolean;
}

export interface ShippingDateItem {
  grupo?: number;
  productodespacho?: any[];
  fechas?: any[];
}
export interface ShippingStore {
  nombre: string;
  recid: string;
  direccion: string;
  codigo: string;
  comuna: string;
  lat: string;
  lng: string;
  direccionCompleta?: string;
}
