import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { RegistroOkModalComponent } from '../../../pages/components/registro-ok-modal/registro-ok-modal.component';
import { ResponseApi } from '../../../shared/interfaces/response-api';
import { ClientsService } from '../../../shared/services/clients.service';
import { rutValidator } from '../../../shared/utils/utilidades';

@Component({
  selector: 'app-page-ciberday-form',
  templateUrl: './page-ciberday-form.component.html',
  styleUrls: ['./page-ciberday-form.component.scss'],
})
export class PageCiberdayFormComponent implements OnInit {
  formulario!: FormGroup;
  cargando = false;

  datos: any = {
    rut: '',
    nombre: '',
    email: '',
    celular: '',
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
      MundoCamion: [false],
      MundoLiviano: [false],
      MundoAgro: [false],
      aceptar: [null, Validators.required],
    });
  }

  enviar() {
    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.clientsService
      .setCyberday(this.formulario.value)
      .subscribe((resp: ResponseApi | any) => {
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
