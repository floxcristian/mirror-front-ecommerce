export interface GeoLocation {
  obtenida: boolean;
  esNuevaUbicacion: boolean;
  esSeleccionaPorCliente?: boolean;
  actual: Coordenadas;
  tiendaSelecciona?: TiendaLocation | undefined;
}

export interface Coordenadas {
  lat: number;
  lon: number;
}

export interface TiendaLocation {
  _id?: string;
  zona: string;
  lat?: number;
  lon?: number;
  codigo: string;
}
