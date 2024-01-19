// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Services
import { SessionService } from '@core/services-v2/session/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { isVacio } from '../../utils/utilidades';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '@core/services-v2/customer.service';
import { IConfig } from '@core/config/config.interface';
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent {
  @Input() modalEditRef!: BsModalRef;
  @Output() respuesta = new EventEmitter<any>();
  formPerfil!: FormGroup;
  user: ISession;
  config: IConfig;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly sessionStorage: SessionStorageService,
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
    this.buildForm();
    this.user = this.sessionService.getSession();
    this.cargarDatos();
  }

  private buildForm(): void {
    this.formPerfil = this.fb.group({
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
      correo: [null, [Validators.required]],
      telefono: [
        null,
        [Validators.required, Validators.pattern('[1-9][0-9]{0,9}')],
      ],
    });
  }

  cargarDatos(): void {
    this.formPerfil.setValue({
      nombre: this.user.firstName || '',
      apellido: !isVacio(this.user.lastName) ? this.user.lastName : '',
      telefono: !isVacio(this.user.phone) ? this.user.phone : '',
      correo: !isVacio(this.user.email) ? this.user.email : '',
    });
  }

  actualizaLocalStorage(params: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) {
    const user = this.sessionService.getSession();
    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.phone = params.phone;
    user.email = params.email;
    this.sessionStorage.set(user);
  }

  async editarPerfil() {
    const { nombre, apellido, telefono, correo } = this.formPerfil.value;
    const parametros = {
      documentId: this.user.documentId,
      firstName: nombre,
      lastName: apellido,
      phone: telefono,
      email: correo,
    };

    this.customerService.updateProfile(parametros).subscribe({
      next: (_) => {
        this.toastr.success('Se actualizo con exito los datos');
        this.actualizaLocalStorage(parametros);
        this.respuesta.emit(true);
        this.modalEditRef.hide();
      },
      error: (_) => {
        this.toastr.error('No se logro actualizar el perfil');
        this.respuesta.emit(false);
      },
    });
  }
}
