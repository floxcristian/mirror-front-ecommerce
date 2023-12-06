import { IGeolocation } from '@core/services-v2/geolocation/models/geolocation.interface';

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
