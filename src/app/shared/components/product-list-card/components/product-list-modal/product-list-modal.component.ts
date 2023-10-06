import { Component, OnInit } from '@angular/core';
import { Lista } from '../../../../interfaces/articuloFavorito';
import { RootService } from '../../../../services/root.service';
import { Usuario } from '../../../../interfaces/login';
import { isVacio } from '../../../../../shared/utils/utilidades';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-list-modal',
  templateUrl: './product-list-modal.component.html',
  styleUrls: ['./product-list-modal.component.scss'],
})
export class ProductListModalComponent implements OnInit {
  lista!: Lista;

  usuario!: Usuario;

  constructor(public ModalRef: BsModalRef, public rootService: RootService) {}

  ngOnInit() {
    this.usuario = this.rootService.getDataSesionUsuario();
  }

  getCodigoCliente(prod: any) {
    let resp = '';
    if (!isVacio(prod.codigos)) {
      const codigo = prod.codigos.find(
        (c: any) => c.rutCliente === this.usuario.rut
      );
      if (!isVacio(codigo)) {
        resp = codigo.codigoCliente;
      }
    }
    return resp;
  }
}
