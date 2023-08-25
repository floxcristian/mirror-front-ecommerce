import { ShippingAddress } from "./address";

export interface PreferenciasCliente {
    direccionDespacho?: ShippingAddress;
    centroCosto?: string;
    numeroSolicitud?: string;
}
