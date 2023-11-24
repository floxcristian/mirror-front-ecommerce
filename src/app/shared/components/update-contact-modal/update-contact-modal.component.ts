import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  CargoContacto,
  CargosContactoResponse,
} from '../../interfaces/cargoContacto';
import { Contacto } from '../../interfaces/cliente';
import { Usuario } from '../../interfaces/login';
import { ResponseApi } from '../../interfaces/response-api';
import { ClientsService } from '../../services/clients.service';
import { RootService } from '../../services/root.service';
import { getDomainsToAutocomplete } from './domains-autocomplete';
import {
  isVacio,
  rutPersonaValidator,
  rutValidator,
} from '../../utils/utilidades';
import { AngularEmailAutocompleteComponent } from '../angular-email-autocomplete/angular-email-autocomplete.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-contact-modal',
  templateUrl: './update-contact-modal.component.html',
  styleUrls: ['./update-contact-modal.component.scss'],
})
export class UpdateContactModalComponent implements OnInit {
  @Input() modalUpdateContactRef!: BsModalRef;
  @Input() contacto!: Contacto;
  @Output() respuesta = new EventEmitter<boolean>();
  @ViewChild('emailValidate', { static: true })
  email!: AngularEmailAutocompleteComponent;

  formContacto!: FormGroup;
  domains: any[] = [];
  cargos: CargoContacto[] = [];
  tipo_fono = '+569';
  loadingForm = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private root: RootService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.domains = getDomainsToAutocomplete();
    this.getCargos();
    this.formDefault();
  }

  formDefault() {
    let largo = 8;
    if (this.contacto.telefono === undefined) {
      this.contacto.telefono = '';
      this.tipo_fono = '+569';
    } else {
      if (this.contacto.telefono.slice(0, 4) === '+569') {
        largo = 8;
        this.tipo_fono = '+569';
      } else {
        largo = 9;
        this.tipo_fono = '+56';
      }
    }

    this.formContacto = this.fb.group({
      contactRut: [
        this.contacto.contactRut,
        [Validators.required, rutValidator, rutPersonaValidator],
      ],
      nombre: [this.contacto.nombre, Validators.required],
      apellido: [this.contacto.apellido, Validators.required],
      telefono: [
        this.contacto.telefono === '0'
          ? ''
          : this.contacto.telefono.slice(-largo),
      ],
      cargo: [, Validators.required],
    });
    this.email.inputValue =
      this.contacto.correo === '0' ? '' : this.contacto.correo || '';
    this.email.correoValido = this.contacto.correo === '0' ? false : true;
    if (this.contacto.contactRut && this.contacto.contactRut !== '') {
      this.formContacto.get('contactRut')?.disable();
    }
    this.Select_fono(this.tipo_fono);
  }

  getCargos() {
    this.clientsService
      .getCargosContacto()
      .subscribe((response: CargosContactoResponse) => {
        if (!response.error) {
          this.cargos = response.data;
          this.formContacto.controls['cargo'].setValue(this.contacto.cargo);
        }
      });
  }

  actualizarContacto(email: any) {
    this.loadingForm = true;
    const data = { ...this.formContacto.value };
    const emailValidado = email.inputValue;
    const usuario: Usuario = this.root.getDataSesionUsuario();

    if (data.telefono !== '' || emailValidado !== '') {
      if (!isVacio(usuario)) {
        const request: any = {
          contactoId: this.contacto.contactoId,
          rut: usuario.rut,

          nombre: data.nombre,
          apellido: data.apellido,
          funcion: 'COM',
          mail: emailValidado,
          telefono: this.tipo_fono + data.telefono,
          cargo: data.cargo,

          codEmpleado: 0,
          codUsuario: 0,
          cuentaUsuario: usuario.username,
          rutUsuario: usuario.rut,
          nombreUsuario: `${usuario.first_name} ${usuario.last_name}`,
        };

        if (this.formContacto.get('contactRut')?.status !== 'DISABLED') {
          request.contactRut = data.contactRut;
        } else {
          request.contactRut = this.contacto.contactRut;
        }

        this.clientsService.actualizaContacto(request).subscribe(
          (response: ResponseApi) => {
            if (!response.error) {
              this.toastr.success('Contacto actualizado correctamente.');
              this.respuesta.emit(true);
              this.modalUpdateContactRef.hide();
            } else {
              this.toastr.error(response.msg);
              this.respuesta.emit(false);
              this.modalUpdateContactRef.hide();
            }
            this.loadingForm = false;
          },
          (error) => {
            this.toastr.error(error.error.msg);
            this.respuesta.emit(false);
            this.modalUpdateContactRef.hide();
            this.loadingForm = false;
          }
        );
      } else {
        this.toastr.error(
          'Ocurrió un error al obtener los datos de su sesión.'
        );
        this.loadingForm = false;
      }
    } else {
      this.toastr.error('Debe ingresar al menos un correo o un celular.');
      this.loadingForm = false;
    }
  }

  Select_fono(tipo: any) {
    this.tipo_fono = tipo;

    if (this.tipo_fono === '+569')
      this.formContacto.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]);
    else
      this.formContacto.controls['telefono'].setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);

    this.formContacto.get('telefono')?.updateValueAndValidity();
  }
}
