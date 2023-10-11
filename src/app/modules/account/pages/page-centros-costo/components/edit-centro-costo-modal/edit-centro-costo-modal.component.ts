import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { isVacio } from '../../../../../../shared/utils/utilidades';

@Component({
  selector: 'app-edit-centro-costo-modal',
  templateUrl: './edit-centro-costo-modal.component.html',
  styleUrls: ['./edit-centro-costo-modal.component.scss'],
})
export class EditCentroCostoModalComponent implements OnInit {
  codigo!: string;
  nombre!: string;

  closeToOK!: boolean;
  cargando = false;
  cantCaracteres = 0;
  maxCaracteres = 40;

  event: EventEmitter<any> = new EventEmitter();

  constructor(public ModalRef: BsModalRef, private toastr: ToastrService) {}

  async ngOnInit() {
    if (isVacio(this.closeToOK)) {
      this.closeToOK = true;
    }
  }

  guardar() {
    if (!isVacio(this.nombre)) {
      this.event.emit(this.nombre);

      if (this.closeToOK) {
        this.ModalRef.hide();
      } else {
        this.cargando = true;
      }
    } else {
      this.toastr.info('Debe ingresar un nombre.', 'Información');
    }
  }
}
