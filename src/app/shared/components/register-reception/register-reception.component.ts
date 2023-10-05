import { Component, Output, EventEmitter, Input } from '@angular/core'
import { Usuario } from '../../interfaces/login'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { rutValidator } from '../../utils/utilidades'

@Component({
  selector: 'app-register-reception',
  templateUrl: './register-reception.component.html',
  styleUrls: ['./register-reception.component.scss'],
})
export class RegisterReceptionComponent {
  @Output() returnReceptionEvent: EventEmitter<any> = new EventEmitter()
  @Input() entrega!: string

  public formRecibe!: FormGroup
  tipo_fono = '+569'
  slices = 8
  constructor(private fb: FormBuilder) {
    this.formDefault()
  }

  formDefault() {
    this.formRecibe = this.fb.group({
      nombre: [, Validators.required],
      apellido: [, Validators.required],
      telefono: [, [Validators.required]],
      rut: [, [Validators.required, rutValidator]],
    })

    this.Select_fono(this.tipo_fono)
  }

  async enviarReceptor() {
    const dataSave = { ...this.formRecibe.value }
    let usuarioVisita: Usuario
    dataSave.telefono = this.tipo_fono + dataSave.telefono
    usuarioVisita = await this.setUsuario(dataSave)

    this.returnReceptionEvent.emit(usuarioVisita)
  }

  async setUsuario(formulario: any) {
    if (formulario.telefono.slice(0, 4) !== '+569') {
      this.slices = 9
      this.tipo_fono = '+56'
    }

    let usuario = {
      company: formulario.nombre + ' ' + formulario.apellido,
      first_name: formulario.nombre,
      last_name: formulario.apellido,
      phone: formulario.telefono.slice(-this.slices),
      rut: formulario.rut,
    }
    return await usuario
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo

    if (this.tipo_fono === '+569')
      this.formRecibe.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ])
    else
      this.formRecibe.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ])

    this.formRecibe.get('telefono')?.updateValueAndValidity()
  }
}
