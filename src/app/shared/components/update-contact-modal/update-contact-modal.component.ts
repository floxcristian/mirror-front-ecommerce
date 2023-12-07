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
import { getDomainsToAutocomplete } from './domains-autocomplete';
import {
  isVacio,
  rutPersonaValidator,
  rutValidator,
} from '../../utils/utilidades';
import { AngularEmailAutocompleteComponent } from '../angular-email-autocomplete/angular-email-autocomplete.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SessionService } from '@core/states-v2/session.service';
import { ICustomerContact } from '@core/models-v2/customer/customer.interface';
import { CustomerContactService } from '@core/services-v2/customer-contact.service';
import { IContactPosition } from '@core/models-v2/customer/contact-position.interface';
import { IError } from '@core/models-v2/error/error.interface';

@Component({
  selector: 'app-update-contact-modal',
  templateUrl: './update-contact-modal.component.html',
  styleUrls: ['./update-contact-modal.component.scss'],
})
export class UpdateContactModalComponent implements OnInit {
  @Input() modalUpdateContactRef!: BsModalRef;
  @Input() contacto!: ICustomerContact;
  @Output() respuesta = new EventEmitter<boolean>();
  @ViewChild('emailValidate', { static: true })
  email!: AngularEmailAutocompleteComponent;

  formContacto!: FormGroup;
  domains: any[] = [];
  cargos: IContactPosition[] = [];
  tipo_fono = '+569';
  loadingForm = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly customerContactService: CustomerContactService
  ) {}

  ngOnInit(): void {
    this.domains = getDomainsToAutocomplete();
    this.getCargos();
    this.formDefault();
  }

  formDefault() {
    let largo = 8;
    if (this.contacto.phone === undefined) {
      this.contacto.phone = '';
      this.tipo_fono = '+569';
    } else {
      if (this.contacto.phone.slice(0, 4) === '+569') {
        largo = 8;
        this.tipo_fono = '+569';
      } else {
        largo = 9;
        this.tipo_fono = '+56';
      }
    }

    this.formContacto = this.fb.group({
      contactRut: [
        this.contacto.documentId,
        [Validators.required, rutValidator, rutPersonaValidator],
      ],
      nombre: [this.contacto.name, Validators.required],
      apellido: [this.contacto.lastName, Validators.required],
      telefono: [
        this.contacto.phone === '0' ? '' : this.contacto.phone.slice(-largo),
      ],
      cargo: [, Validators.required],
    });
    this.email.inputValue =
      this.contacto.email === '0' ? '' : this.contacto.email || '';
    this.email.correoValido = this.contacto.email === '0' ? false : true;
    if (this.contacto.documentId && this.contacto.documentId !== '') {
      this.formContacto.get('contactRut')?.disable();
    }
    this.Select_fono(this.tipo_fono);
  }

  getCargos() {
    this.customerContactService.getPositions().subscribe((response) => {
      this.cargos = response;
      this.formContacto.controls['cargo'].setValue(this.contacto.position);
    });
  }

  actualizarContacto(email: any) {
    this.loadingForm = true;
    const data = { ...this.formContacto.value };
    const emailValidado = email.inputValue;
    const usuario = this.sessionService.getSession(); //: Usuario = this.root.getDataSesionUsuario();

    if (data.telefono !== '' || emailValidado !== '') {
      if (!isVacio(usuario)) {
        const request: any = {
          documentId: data.contactRut,
          name: data.nombre,
          lastName: data.apellido,
          email: emailValidado,
          phone: this.tipo_fono + data.telefono,
          position: data.cargo,
        };

        if (this.formContacto.get('contactRut')?.status !== 'DISABLED') {
          request.contactRut = data.contactRut;
        } else {
          request.contactRut = this.contacto.documentId;
        }

        this.customerContactService.updateContact(request).subscribe({
          next: (res) => {
            this.toastr.success('Contacto actualizado correctamente.');
            this.respuesta.emit(true);
            this.modalUpdateContactRef.hide();
            this.loadingForm = false;
          },
          error: (err: IError) => {
            this.toastr.error(err.message);
            this.respuesta.emit(false);
            this.modalUpdateContactRef.hide();
            this.loadingForm = false;
          },
        });
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
