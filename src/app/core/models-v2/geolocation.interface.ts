// Revisar
export interface IGeolocation {
  obtenida: boolean; // *
  esNuevaUbicacion: boolean; // *
  esSeleccionaPorCliente: boolean; // *
  actual: ICoordenadas; // *
  tiendaSelecciona: ITiendaLocation; // | undefined;
}

export interface ICoordenadas {
  lat: number;
  lon: number;
}

// Es lo minimo que se guardar en default.
export interface ITiendaLocation {
  zona: string;
  codigo: string;
  _id?: string;
  lat?: number;
  lon?: number;
  comuna?: string;
}
