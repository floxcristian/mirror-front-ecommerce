import { ShippingAddress } from './address';

export interface PreferenciasCliente {
  direccionDespacho?: ShippingAddress | null;
  centroCosto?: string | null;
  numeroSolicitud?: string | null;
}
