import { Component, OnInit } from '@angular/core';
import { Lista } from '../../../../interfaces/articuloFavorito';
import { RootService } from '../../../../services/root.service';
import { isVacio } from '../../../../../shared/utils/utilidades';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';

@Component({
  selector: 'app-product-list-modal',
  templateUrl: './product-list-modal.component.html',
  styleUrls: ['./product-list-modal.component.scss'],
})
export class ProductListModalComponent implements OnInit {
  lista!: Lista;
  usuario!: ISession;

  constructor(
    public ModalRef: BsModalRef,
    public rootService: RootService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  ngOnInit() {
    this.usuario = this.sessionService.getSession(); //this.rootService.getDataSesionUsuario();
  }

  getCodigoCliente(prod: any) {
    let resp = '';
    if (!isVacio(prod.codigos)) {
      const codigo = prod.codigos.find(
        (c: any) => c.rutCliente === this.usuario.documentId
      );
      if (!isVacio(codigo)) {
        resp = codigo.codigoCliente;
      }
    }
    return resp;
  }
}
