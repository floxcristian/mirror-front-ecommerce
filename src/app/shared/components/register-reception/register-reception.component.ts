import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { rutValidator } from '../../utils/utilidades';
import { IReceive } from '@core/models-v2/storage/receive.interface';

@Component({
  selector: 'app-register-reception',
  templateUrl: './register-reception.component.html',
  styleUrls: ['./register-reception.component.scss'],
})
export class RegisterReceptionComponent {
  @Output() returnReceptionEvent: EventEmitter<IReceive> = new EventEmitter();
  @Input() entrega!: string;

  public formRecibe!: FormGroup;
  tipo_fono = '+569';
  slices = 8;
  constructor(private fb: FormBuilder) {
    this.formDefault();
  }

  formDefault() {
    this.formRecibe = this.fb.group({
      firstName: [, Validators.required],
      lastName: [, Validators.required],
      phone: [, [Validators.required]],
      documentId: [, [Validators.required, rutValidator]],
    });

    this.Select_fono(this.tipo_fono);
  }

  async enviarReceptor() {
    const dataSave = { ...this.formRecibe.value };
    let usuarioVisita: IReceive;
    dataSave.telefono = this.tipo_fono + dataSave.phone;
    usuarioVisita = await this.setUsuario(dataSave);

    this.returnReceptionEvent.emit(usuarioVisita);
  }

  async setUsuario(formulario: IReceive) {
    if (formulario.phone.slice(0, 4) !== '+569') {
      this.slices = 9;
      this.tipo_fono = '+56';
    }

    let usuario: IReceive = {
      company: formulario.firstName + ' ' + formulario.lastName,
      firstName: formulario.firstName,
      lastName: formulario.lastName,
      phone: formulario.phone.slice(-this.slices),
      documentId: formulario.documentId,
    };
    return await usuario;
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.formRecibe.controls['phone'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]);
    else
      this.formRecibe.controls['phone'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);

    this.formRecibe.get('phone')?.updateValueAndValidity();
  }
}
