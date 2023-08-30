import { Product } from "./product";

export interface ArticuloFavorito {
    _id: string;
    rut: string;
    listas: Lista[];
}

export interface Lista {
    _id: string;
    nombre: string;
    predeterminada: boolean;
    checked?: boolean;
    skus: string[];
    detalleSkus?: any[];
}
