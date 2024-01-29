import { ActivatedRouteSnapshot, Params, UrlSegment } from '@angular/router';

/**
 * Obtiene origen.
 * @param routeSnapshot
 * @returns
 */
export const getOriginUrl = (
  routeSnapshot: ActivatedRouteSnapshot
): string[] => {
  const { nombre: category, busqueda } = routeSnapshot.params;
  const firstUrlSegment = routeSnapshot.url[0];

  if (category && busqueda !== 'todos') {
    return ['buscador', '', category, ''];
  } else {
    const splittedUrlSegment = firstUrlSegment.path.split('-');
    if (splittedUrlSegment[0] === 'HOME') {
      splittedUrlSegment.splice(0, 1);
      return ['home', 'ver-mas', splittedUrlSegment.join(' '), ''];
    } else if (splittedUrlSegment[0] === 'todos') {
      splittedUrlSegment.splice(0, 1);
      return ['home', 'banner', category || '', ''];
    } else {
      return ['buscador', '', 'sinCategoria', ''];
    }
  }
};
