// Models
import { ILocality } from '@core/services-v2/logistic-promise/models/locality.interface';
import { FiltrosMagicos } from '@shared/components/filtro-magico/interfaces/filtro-magico.interface';
// Services
import { LogisticPromiseApiService } from '@core/services-v2/logistic-promise/logistic-promise.service';

export const DeliveryMagicFilter = (
  logisticPromiseApiService: LogisticPromiseApiService
): FiltrosMagicos => {
  return {
    filtros: [
      {
        key: 'localidad',
        nombre: 'Localidad',
        mostrarLabel: false,
        class: 'col-md-12',
        tipo: 'select',
        valoresSelect: logisticPromiseApiService.getLocalities(),
        opcionSelect: (item: ILocality) =>
          `${item.name}, REGIÓN DE ${item.region}`,
      },
    ],
    mostrarBotonFiltrar: false,
  };
};
