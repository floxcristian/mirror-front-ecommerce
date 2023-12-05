// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
// Services
import { ClientsService } from '../../services/clients.service';
import { SessionService } from '@core/states-v2/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { isVacio } from '../../utils/utilidades';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent implements OnInit {
  @Input() modalEditRef!: BsModalRef;
  @Output() respuesta = new EventEmitter<any>();
  formPerfil: FormGroup;
  user: ISession;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private clientsService: ClientsService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly sessionStorage: SessionStorageService
  ) {
    this.formPerfil = this.fb.group({
      nombre: new FormControl(null, {
        validators: [Validators.required],
      }),
      apellido: new FormControl(null, {
        validators: [Validators.required],
      }),

      correo: new FormControl(null, {
        validators: [Validators.required],
      }),
      telefono: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('[1-9][0-9]{0,9}'),
        ],
      }),
    });
    this.user = this.sessionService.getSession();
    this.cargarDatos();
  }

  ngOnInit() {}

  cargarDatos() {
    this.formPerfil.setValue({
      nombre: !isVacio(this.user.firstName) ? this.user.firstName : '',
      apellido: !isVacio(this.user.lastName) ? this.user.lastName : '',
      telefono: !isVacio(this.user.phone) ? this.user.phone : '',
      correo: !isVacio(this.user.email) ? this.user.email : '',
    });
  }

  actualizaLocalStorage({ nombre, apellido, telefono, correo }: any) {
    const user = this.sessionService.getSession();
    user.firstName = nombre;
    user.lastName = apellido;
    user.phone = telefono;
    user.email = correo;
    this.sessionStorage.set(user);
  }

  async editarPerfil() {
    const { nombre, apellido, telefono, correo } = this.formPerfil.value;
    const parametros = {
      rut: this.user.documentId,
      nombre,
      apellido,
      telefono,
      correo,
    };

    const resultado: any = await this.clientsService.updateProfile(parametros);

    if (resultado.error) {
      this.toastr.error('No se logro actualizar el perfil');
      this.respuesta.emit(false);
    } else {
      this.toastr.success('Se actualizo con exito los datos');
      this.actualizaLocalStorage(parametros);
      this.respuesta.emit(true);
      this.modalEditRef.hide();
    }
  }
}
