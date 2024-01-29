import { Params, UrlSegment } from '@angular/router';

export const getOriginUrl = (
  firstUrlSegment: UrlSegment,
  urlParams: Params
): string[] => {
  const { nombre, busqueda } = urlParams;
  if (nombre && busqueda !== 'todos') {
    return ['buscador', '', nombre, ''];
  } else {
    const splittedUrlSegment = firstUrlSegment.path.split('-');
    if (splittedUrlSegment[0] === 'HOME') {
      splittedUrlSegment.splice(0, 1);
      return ['home', 'ver-mas', splittedUrlSegment.join(' '), ''];
    } else if (splittedUrlSegment[0] == 'todos') {
      splittedUrlSegment.splice(0, 1);
      /*categoria = this.route.snapshot.paramMap.get('nombre') || '';
      this.origen = ['home', 'banner', categoria, ''];*/
    }
  }
  return [];
};
