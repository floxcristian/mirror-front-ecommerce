import { map } from 'rxjs/operators';
import { PromesaService } from '../../services/promesa.service';

export const MpSimuladorHeaderFiltrosMagicos = (
  modo: string,
  promesaService: PromesaService,
  tiendaActual: any
): any => {
  if (modo === 'retiroTienda') {
    return {
      filtros: [
        {
          key: 'tienda',
          nombre: 'Tienda',
          mostrarLabel: false,
          class: 'col-md-12',
          tipo: 'select',
          valoresSelect: promesaService.tiendas().pipe(map((r) => r.data)),
          opcionSelect: (item: any) => item.nombre,
          valorDefecto: async () => {
            return { key: 'codigo', params: [tiendaActual.codigo] };
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
          valoresSelect: promesaService.localidades().pipe(map((r) => r.data)),
          opcionSelect: (item: any) =>
            item.nombre +
            ', ' +
            (item.region.startsWith('REGION')
              ? item.region.replace('REGION', 'REGIÓN')
              : 'REGIÓN DE ' + item.region),
        },
      ],
      mostrarBotonFiltrar: false,
    };
  }
};
