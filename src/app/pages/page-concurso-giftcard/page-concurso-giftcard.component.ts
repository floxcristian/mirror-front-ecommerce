import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseApi } from '../../shared/interfaces/response-api';
import { ConcursoGiftcardOkModalComponent } from '../components/concurso-giftcard-ok-modal/concurso-giftcard-ok-modal.component';
import { ClientsService } from '../../shared/services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { rutValidator } from '../../shared/utils/utilidades';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-page-concurso-giftcard',
  templateUrl: './page-concurso-giftcard.component.html',
  styleUrls: ['./page-concurso-giftcard.component.scss'],
})
export class PageConcursoGiftcardComponent implements OnInit {
  formulario!: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private modalService: BsModalService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      rut: ['', [Validators.required, Validators.maxLength(10), rutValidator]],
      correo: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/
          ),
        ],
      ],
      celular: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
      boletaFactura: ['', [Validators.required]],
    });
  }

  enviar() {
    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.clientsService
      .setConcursoGiftCard(this.formulario.value)
      .subscribe((resp: any) => {
        if (resp.error) {
          this.toast.error(resp.msg);
          this.cargando = false;
          return;
        }

        this.cargando = false;
        this.formulario.reset();
        this.modalService.show(ConcursoGiftcardOkModalComponent, {
          class: 'mx-auto modal-giftcard',
          ignoreBackdropClick: true,
        });
      });
  }
}
