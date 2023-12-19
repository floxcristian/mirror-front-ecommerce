import { map } from 'rxjs/operators';
import { PromesaService } from '../../services/promesa.service';
import { LogisticService } from '@core/services-v2/logistic.service';

export const MpSimuladorHeaderFiltrosMagicos = (
  modo: string,
  promesaService: LogisticService,
  tiendaActual: any
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
            map(stores => stores.map(store => ({
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
              actualizadoEn: store.updatedAt
            })))
          ),
          opcionSelect: (item: any) => item.nombre,
          valorDefecto: async () => {
            const tiendaPorDefecto = await promesaService.getStores().pipe(
              map(stores => stores.find(store => store.code === tiendaActual.code))
            ).toPromise();
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
            map(cities => cities.flatMap(city => city.localities.map(locality => ({
              id: locality.id,
              nombre: locality.location + ', ' + city.city,
              cityId: city.id,
              provinceCode: city.provinceCode,
              regionCode: city.regionCode
            })))
          ),),
          opcionSelect: (item: any) => item.nombre,
        },
      ],
      mostrarBotonFiltrar: false,
    };
  }
};
