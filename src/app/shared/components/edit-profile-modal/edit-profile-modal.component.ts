import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../services/clients.service';
import { Usuario } from '../../interfaces/login';
import { isVacio } from '../../utils/utilidades';
import { RootService } from '../../services/root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent implements OnInit {
  @Input() modalEditRef!: BsModalRef;
  @Output() public respuesta = new EventEmitter<any>();
  formPerfil: FormGroup;
  user: Usuario;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localS: LocalStorageService,
    private clientsService: ClientsService,
    private rootService: RootService
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
    this.user = this.rootService.getDataSesionUsuario();
    this.cargarDatos();
  }

  ngOnInit() {}

  cargarDatos() {
    this.formPerfil.setValue({
      nombre: !isVacio(this.user.first_name) ? this.user.first_name : '',
      apellido: !isVacio(this.user.last_name) ? this.user.last_name : '',
      telefono: !isVacio(this.user.phone) ? this.user.phone : '',
      correo: !isVacio(this.user.email) ? this.user.email : '',
    });
  }

  actualizaLocalStorage({ nombre, apellido, telefono, correo }: any) {
    const user = this.rootService.getDataSesionUsuario();

    user.first_name = nombre;
    user.last_name = apellido;
    user.phone = telefono;
    user.email = correo;

    this.localS.set('usuario', user);
  }

  async editarPerfil() {
    const { nombre, apellido, telefono, correo } = this.formPerfil.value;
    const parametros = {
      rut: this.user.rut,
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
