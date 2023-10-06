import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../../../shared/interfaces/login';
import { ClientsService } from '../../../../shared/services/clients.service';

@Component({
  selector: 'app-form-contacto',
  templateUrl: './form-contacto.component.html',
  styleUrls: ['./form-contacto.component.scss'],
})
export class FormContactoComponent implements OnInit {
  @Input() userSession!: Usuario;
  @Output() newItemEvent = new EventEmitter<any>();
  contactos: any = [];
  id: any = null;
  page = 0;
  search: string = '';
  edit: Boolean = false;
  nombre!: string;
  telefono!: string;
  email!: string;
  confirmar: boolean = false;
  procesarPago: boolean = false;
  formContacto!: FormGroup;

  constructor(
    @Inject(DOCUMENT) document: any,
    private clientsService: ClientsService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.getContactos();
    this.iniciarFormulario();
  }
  iniciarFormulario() {
    this.formContacto = this.fb.group({
      telefono: [
        ,
        [
          Validators.required,
          Validators.pattern('[1-9][0-9]{0,9}'),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],

      email: [
        ,
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
          ),
        ],
      ],
    });
  }

  chageSelected() {
    let contacto: any = this.contactos.filter(
      (item: any) => item.contactoId === this.id
    );

    this.nombre = contacto[0].nombre + ' ' + contacto[0].apellido;
    if (contacto.length > 0) {
      this.formContacto.controls['telefono'].setValue(contacto[0].telefono);
      this.formContacto.controls['email'].setValue(contacto[0].correo);
    } else {
      this.formContacto.controls['telefono'].setValue('');
      this.formContacto.controls['email'].setValue('');
    }
  }

  async getContactos() {
    let json = {
      page: this.page,
      search: this.search,
      rut: this.userSession.rut,
    };

    let consulta: any = await this.clientsService
      .getContactos(json)
      .toPromise();
    consulta.data.forEach((item: any) => {
      let array: any = item.contactos;
      this.contactos.push(array);
    });
  }

  Editar() {
    if (this.edit) {
      document.getElementById('telefono')?.removeAttribute('disabled');
      document.getElementById('email')?.removeAttribute('disabled');
    } else {
      document.getElementById('telefono')?.setAttribute('disabled', 'true');
      document.getElementById('email')?.setAttribute('disabled', 'true');
    }
  }

  ConfirmarContacto() {
    this.telefono = this.formContacto.controls['telefono'].value;
    this.email = this.formContacto.controls['email'].value;
    this.confirmar = true;
  }

  reChoose() {
    this.confirmar = false;
  }

  Confirmar() {
    let json = {
      telefono: this.telefono,
      correo: this.email,
      confirmar: this.formContacto.valid,
    };
    this.procesarPago = true;
    this.newItemEvent.emit(json);
  }
}
