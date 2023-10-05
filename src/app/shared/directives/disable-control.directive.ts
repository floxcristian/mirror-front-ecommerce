import { Directive, Input } from '@angular/core'
import { NgControl } from '@angular/forms'

/**
 * Directiva que permite habilitar o deshabilitar un cambo de ReactiveForm
 * de acuerdo a una condición
 */
@Directive({
  selector: '[appDisableControl]',
})
export class DisableControlDirective {
  /**
   * Condición con la cual habilita o deshabilita el formulario
   */
  @Input() set appDisableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable'
    if (this.ngControl.control) {
      this.ngControl.control[action]()
    }
  }

  /**
   * Constructor de la directiva
   * @param ngControl Control del campo
   */
  constructor(private ngControl: NgControl) {}
}
