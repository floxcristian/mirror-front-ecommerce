import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directiva
 */
@Directive({
  selector: '[appRutChars]',
})
export class RutCharsDirective {
  /**
   * Constructor de la directiva
   * @param control Acceso al 'control' del formulario
   */
  constructor(public control: NgControl) {}

  /**
   * Método que permite el ingreso de números, puntos y la letra K
   * @param $event Evento gatillado por el Usuario.
   */
  @HostListener('keydown', ['$event']) onKeyDown($event: any) {
    const key = $event.which || $event.keyCode;

    if (
      (key >= 48 && key <= 57) || // numbers
      (key >= 96 && key <= 105) || // numbers keypad
      key === 110 || // . keypad
      key === 190 || // .
      key === 75 || // K
      key === 189 || // -
      key === 109 || // - keypad
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
