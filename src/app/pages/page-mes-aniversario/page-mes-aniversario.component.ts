import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { rutValidator } from '../../shared/utils/utilidades';
import { ClientsService } from '../../shared/services/clients.service';
import { ResponseApi } from '../../shared/interfaces/response-api';
import { RegistroOkModalComponent } from '../components/registro-ok-modal/registro-ok-modal.component';

@Component({
  selector: 'app-page-mes-aniversario',
  templateUrl: './page-mes-aniversario.component.html',
  styleUrls: ['./page-mes-aniversario.component.scss'],
})
export class PageMesAniversarioComponent implements OnInit {
  formulario!: FormGroup;
  cargando = false;

  datos = {
    rut: '',
    nombre: '',
    email: '',
    celular: '',
    documento: '',
  };

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private clientsService: ClientsService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      rut: [
        this.datos.rut,
        [Validators.required, Validators.maxLength(10), rutValidator],
      ],
      nombre: [
        this.datos.nombre,
        [Validators.required, Validators.maxLength(100)],
      ],
      email: [
        this.datos.email,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/
          ),
        ],
      ],
      celular: [
        this.datos.celular,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]{8}$/),
        ],
      ],
      documento: [this.datos.documento, Validators.required],
      nombre_concurso: ['BICI-ANIVERSARIO'],
    });
  }

  enviar() {
    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.clientsService
      .setConcurso(this.formulario.value)
      .subscribe((resp: any) => {
        if (resp.error) {
          this.toast.error(resp.msg);
          this.cargando = false;
          return;
        }

        this.cargando = false;
        const initialState = {
          nombre: this.datos.nombre.split(' ')[0],
        };
        this.formulario.reset();
        this.modalService.show(RegistroOkModalComponent, {
          initialState,
          class: 'mx-auto',
        });
      });
  }
}
