import { IGeolocation } from '@core/models-v2/geolocation.interface';

export const DEFAULT_LOCATION: IGeolocation = {
  esNuevaUbicacion: false,
  obtenida: false,
  esSeleccionaPorCliente: false,
  actual: { lat: 0, lon: 0 },
  tiendaSelecciona: {
    zona: 'San Bernardo',
    codigo: 'SAN BRNRDO',
  },
};
