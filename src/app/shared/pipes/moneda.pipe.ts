import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
})
export class MonedaPipe implements PipeTransform {
  /**
   *Funcion que separa en miles los valores enviados
   * @param {*} value
   * @returns {*}
   * @memberof FormatoMonedaPipe
   */
  transform(value: any): any {
    if (!value) {
      return '$0';
    }
    value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    value = '$' + value;
    return value;
  }
}
