import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { isVacio } from '../../../../shared/utils/utilidades';

@Component({
  selector: 'app-agregar-centro-costo',
  templateUrl: './agregar-centro-costo.component.html',
  styleUrls: ['./agregar-centro-costo.component.scss']
})
export class AgregarCentroCostoComponent implements OnInit {
  codigo!: string;
  nombre = '';

  closeToOK!: boolean;
  cargando = false;
  cantCaracteres = 0;
  maxCaracteres = 30;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public ModalRef: BsModalRef, private toastr: ToastrService) {}

  async ngOnInit() {
    if (isVacio(this.closeToOK)) {
      this.closeToOK = true;
    }
  }

  guardar() {
    if (!isVacio(this.codigo) && !isVacio(this.nombre)) {
      const obj = {
        codigo: this.codigo,
        nombre: this.nombre
      };
      this.event.emit(obj);

      if (this.closeToOK) {
        this.ModalRef.hide();
      } else {
        this.cargando = true;
      }
    } else {
      this.toastr.info('Debe completar todos los campos.', 'Información');
    }
  }
}
