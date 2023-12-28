// Models
import { FiltrosMagicos } from '@shared/components/filtro-magico/interfaces/filtro-magico.interface';
// Services
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';

export const PickupMagicFilter = (
  selectedStore: ISelectedStore,
  stores: IStore[]
): FiltrosMagicos => {
  return {
    filtros: [
      {
        key: 'tienda',
        nombre: 'Tienda',
        mostrarLabel: false,
        class: 'col-md-12',
        tipo: 'select',
        valoresSelect: stores,
        opcionSelect: (item: IStore) => item.name,
        valorDefecto: async () => ({
          key: 'code',
          params: [selectedStore.code],
        }),
      },
    ],
    mostrarBotonFiltrar: false,
  };
};
