import { Component, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { isVacio } from '../../utils/utilidades';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-editar-lista-productos',
  templateUrl: './editar-lista-productos.component.html',
  styleUrls: ['./editar-lista-productos.component.scss'],
})
export class EditarListaProductosComponent implements OnInit {
  nombre!: string;

  closeToOK!: boolean;
  cargando = false;
  cantCaracteres = 0;
  maxCaracteres = 40;

  public event: EventEmitter<any> = new EventEmitter();

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
