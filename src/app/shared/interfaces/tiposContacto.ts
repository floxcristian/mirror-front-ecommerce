import { ResponseApi } from './response-api';

export interface TipoContacto {
    codigo: string;
    nombre: string;
}
export interface TiposContactoResponse extends ResponseApi {
    data: TipoContacto[];
}
