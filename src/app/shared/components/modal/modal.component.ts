import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

export enum TipoIcon {
  OK = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  QUESTION = 5,
}

export enum TipoModal {
  OK = 1,
  QUESTION = 2,
}

export interface DataModal {
  titulo: string;
  mensaje: string;
  tipoIcon: TipoIcon;
  tipoModal: TipoModal;
  textoBotonNO?: string;
  textoBotonSI?: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  titulo!: string;
  mensaje!: string;
  tipoIcon!: TipoIcon;
  tipoModal!: TipoModal;
  textoBotonNO?: string;
  textoBotonSI?: string;

  event: EventEmitter<any> = new EventEmitter();

  constructor(public ModalRef: BsModalRef) {}

  ngOnInit() {
    switch (this.tipoModal) {
      case TipoModal.OK:
        this.textoBotonSI =
          this.textoBotonSI === undefined ? 'Aceptar' : this.textoBotonSI;
        break;
      case TipoModal.QUESTION:
        this.textoBotonNO =
          this.textoBotonNO === undefined ? 'NO' : this.textoBotonNO;
        this.textoBotonSI =
          this.textoBotonSI === undefined ? 'SI' : this.textoBotonSI;
        break;
      default:
        this.textoBotonNO =
          this.textoBotonNO === undefined ? 'NO' : this.textoBotonNO;
        this.textoBotonSI =
          this.textoBotonSI === undefined ? 'SI' : this.textoBotonSI;
        break;
    }
  }

  clickBoton(opcion: string) {
    switch (opcion) {
      case 'NO':
        this.event.emit(false);
        this.ModalRef.hide();
        break;
      case 'SI':
        this.event.emit(true);
        this.ModalRef.hide();
        break;
      default:
        break;
    }
  }
}
