import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {
  CargoContacto,
  CargosContactoResponse,
} from '../../interfaces/cargoContacto';
import { ResponseApi } from '../../interfaces/response-api';
import { ClientsService } from '../../services/clients.service';
import {
  isVacio,
  rutPersonaValidator,
  rutValidator,
} from '../../utils/utilidades';
import { getDomainsToAutocomplete } from './domains-autocomplete';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-add-contact-modal',
  templateUrl: './add-contact-modal.component.html',
  styleUrls: ['./add-contact-modal.component.scss'],
})
export class AddContactModalComponent implements OnInit {
  @Input() modalAddContactRef!: BsModalRef;
  @Output() respuesta = new EventEmitter<boolean>();

  formContacto!: FormGroup;
  domains: any[] = [];
  cargos: CargoContacto[] = [];
  tipo_fono = '+569';
  loadingForm = false;

  constructor(
    public ModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private clientsService: ClientsService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.domains = getDomainsToAutocomplete();
    this.getCargos();
    this.formDefault();
  }

  formDefault() {
    this.formContacto = this.fb.group({
      contactRut: [, [Validators.required, rutValidator, rutPersonaValidator]],
      nombre: [, Validators.required],
      apellido: [, Validators.required],
      telefono: [, [Validators.required]],
      cargo: [, Validators.required],
    });
    this.Select_fono(this.tipo_fono);
  }

  getCargos() {
    this.clientsService
      .getCargosContacto()
      .subscribe((response: CargosContactoResponse) => {
        if (!response.error) {
          this.cargos = response.data;
        }
      });
  }

  registrarContacto(email: any) {
    this.loadingForm = true;
    const data: any = { ...this.formContacto.value };
    const emailValidado = email.inputValue;
    const usuario = this.sessionService.getSession(); //: Usuario = this.root.getDataSesionUsuario();

    if (!isVacio(usuario)) {
      const request: any = {
        rut: usuario.documentId,
        contactRut: data.contactRut,
        nombre: data.nombre,
        apellido: data.apellido,
        funcion: 'COM',
        mail: emailValidado,
        telefono: this.tipo_fono + data.telefono,
        cargo: data.cargo,
        codEmpleado: 0,
        codUsuario: 0,
        cuentaUsuario: usuario.username,
        rutUsuario: usuario.documentId,
        nombreUsuario: `${usuario.firstName} ${usuario.lastName}`,
      };

      this.clientsService.nuevoContacto(request).subscribe(
        (response: ResponseApi) => {
          if (!response.error) {
            this.toastr.success('Contacto creado correctamente.');
            this.respuesta.emit(true);
            this.modalAddContactRef.hide();
          } else {
            this.toastr.error(response.msg);
            this.respuesta.emit(false);
            this.modalAddContactRef.hide();
          }
          this.loadingForm = false;
        },
        (error) => {
          this.toastr.error(error.error.msg);
          this.respuesta.emit(false);
          this.ModalRef.hide();
          this.loadingForm = false;
        }
      );
    } else {
      this.toastr.error('Ocurrió un error al obtener los datos de su sesión.');
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
