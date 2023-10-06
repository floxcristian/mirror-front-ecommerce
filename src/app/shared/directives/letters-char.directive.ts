import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLettersChar]',
})
export class LettersCharDirective {
  /**
   * Constructor de la directiva
   * @param control Acceso al 'control' del formulario
   */
  constructor(public control: NgControl) {}

  /**
   * Método que permite el ingreso de letras
   * @param $event Evento gatillado por el Usuario.
   */
  @HostListener('keydown', ['$event']) onKeyDown($event: any) {
    const key = $event.which || $event.keyCode;
    if (
      (key >= 65 && key <= 90) || // letters
      key == 192 ||
      key === 46 || // SUPR
      key === 39 || // ARROW RIGHT
      key === 37 || // ARROW LEFT
      key === 9 || // TAB
      key === 8 || // DELETE
      key === 32
    ) {
      return true;
    } else {
      return false;
    }
  }
}
