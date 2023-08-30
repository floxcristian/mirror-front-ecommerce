import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Esto es una directiva
 */
@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  /**
   * Constructor de la directiva
   * @param control Acceso al 'control' del formulario
   */
  constructor(public control: NgControl) { }

  /**
   * Método que permite el ingreso de números
   * @param $event Evento gatillado por el Usuario.
   */
  @HostListener('keydown', ['$event']) onKeyDown($event: any) {
    const key = $event.which || $event.keyCode;
   
    if ((key >= 48 && key <= 57) || // numbers
        (key >= 96 && key <= 105) || // numbers keypad
        key === 46 || // SUPR
        key === 39 || // ARROW RIGHT
        key === 37 || // ARROW LEFT
        key === 9 || // TAB
        key === 8 // DELETE
    ) {
      return true;
    } else {
      return false;
    }
  }
}
