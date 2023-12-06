/**
 * Interfaz utilizada en la respuesta de dos endpoints.
 */
export interface IStore {
  id: string;
  code: string;
  zone: string;
  lat: number;
  lng: number;
  city: string;
  // Me puede servir...
  default: boolean;
  /* IMPROV: estos otros parámetros no los usamos en el nuevo ecommerce */
  name: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  schedule: string;
  order: number;
  regionCode: string;
  createdAt: Date;
  updatedAt: Date;
}
