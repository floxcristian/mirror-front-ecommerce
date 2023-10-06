import { FiltroMagico } from './../interfaces/filtro-magico.interface';
/**
 * @author José Espinoza
 * @description Por el momento, la librería ng-select no permite buscar por grupo,
 * esta función arregla eso.
 */
export const searchGroupItemFiltroMagico = (filtroMagico: FiltroMagico) => {
  return (searchTerm: string, item: any) => {
    return (
      item[filtroMagico.groupBy || ''].toLowerCase().indexOf(searchTerm) >
        -1 ||
      (filtroMagico.opcionSelect?.(item) || '')
        .toLowerCase()
        .indexOf(searchTerm) > -1
    );
  };
};
