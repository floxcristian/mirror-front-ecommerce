import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { rutPersonaValidator, rutValidator } from '../../utils/utilidades';
import { getDomainsToAutocomplete } from './domains-autocomplete';
import { CustomerContactService } from '@core/services-v2/customer-contact.service';
import { IContactPosition } from '@core/models-v2/customer/contact-position.interface';
import { IError } from '@core/models-v2/error/error.interface';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

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
  cargos: IContactPosition[] = [];
  tipo_fono = '+569';
  loadingForm = false;
  usuario!: ISession;

  constructor(
    public ModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    // Storage
    private readonly sessionService: SessionService,
    // Services V2
    private readonly customerContactService: CustomerContactService
  ) {}

  ngOnInit(): void {
    this.usuario = this.sessionService.getSession();
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
    this.customerContactService.getPositions().subscribe((response) => {
      this.cargos = response;
    });
  }

  registrarContacto(email: any) {
    this.loadingForm = true;
    const data: any = { ...this.formContacto.value };
    const emailValidado = email.inputValue;

    const request: any = {
      customerDocumentId: this.usuario.documentId,
      documentId: data.contactRut,
      name: data.nombre,
      lastName: data.apellido,
      email: emailValidado,
      phone: this.tipo_fono + data.telefono,
      position: data.cargo,
    };

    this.customerContactService.createContact(request).subscribe({
      next: (_) => {
        this.toastr.success('Contacto creado correctamente.');
        this.respuesta.emit(true);
        this.modalAddContactRef.hide();
        this.loadingForm = false;
      },
      error: (err: IError) => {
        this.toastr.error(err.message);
        this.respuesta.emit(false);
        this.modalAddContactRef.hide();
        this.loadingForm = false;
      },
    });
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
