/*************************************************
 * V2
 *************************************************/
export interface ISelectedStore {
  latitude: number;
  longitude: number;
}

/*************************************************
 * V1
 *************************************************/

export interface IGeolocation {
  obtenida: boolean; // *
  esNuevaUbicacion: boolean; // *
  esSeleccionaPorCliente: boolean; // *
  actual: ICoordinates; // *
  tiendaSelecciona: ITiendaLocation; // | undefined;
}

export interface ICoordinates {
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
