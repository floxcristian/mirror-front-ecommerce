// Rxjs
import { map } from 'rxjs/operators';
// Models
import { ICity } from '@core/services-v2/geolocation/models/city.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
// Services
import { PromesaService } from '../../../services/promesa.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';

export const MpSimuladorHeaderFiltrosMagicos = (
  modo: string,
  promesaService: GeolocationApiService,
  tiendaActual: ISelectedStore
): any => {
  if (modo === 'pickup') {
    return {
      filtros: [
        {
          key: 'tienda',
          nombre: 'Tienda',
          mostrarLabel: false,
          class: 'col-md-12',
          tipo: 'select',
          valoresSelect: promesaService.getStores().pipe(
            map((stores) =>
              stores.map((store) => ({
                id: store.id,
                nombre: store.name,
                direccion: store.address,
                telefono: store.phone,
                email: store.email,
                urlMapa: store.mapUrl,
                horario: store.schedule,
                ciudad: store.city,
                codigoRegion: store.regionCode,
                creadoEn: store.createdAt,
                actualizadoEn: store.updatedAt,
              }))
            )
          ),
          opcionSelect: (item: any) => item.nombre,
          valorDefecto: async () => {
            const tiendaPorDefecto = await promesaService
              .getStores()
              .pipe(
                map((stores) =>
                  stores.find((store) => store.code === tiendaActual.code)
                )
              )
              .toPromise();
            return tiendaPorDefecto ? tiendaPorDefecto.id : null;
          },
        },
      ],
      mostrarBotonFiltrar: false,
    };
  } else {
    return {
      filtros: [
        {
          key: 'localidad',
          nombre: 'Localidad',
          mostrarLabel: false,
          class: 'col-md-12',
          tipo: 'select',
          valoresSelect: promesaService.getCities().pipe(
            map((cities) =>
              cities.flatMap((city) =>
                city.localities.map((locality) => ({
                  id: locality.id,
                  cityId: city.id,
                  provinceCode: city.provinceCode,
                  regionCode: city.regionCode,
                  region: '-',
                }))
              )
            )
          ),
          opcionSelect: (item: ICity) => `${item.city}`,
        },
      ],
      mostrarBotonFiltrar: false,
    };
  }
};
