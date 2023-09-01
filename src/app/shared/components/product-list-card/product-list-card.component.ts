import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EditarListaProductosComponent } from '../editar-lista-productos/editar-lista-productos.component';
import { Lista } from '../../interfaces/articuloFavorito';
import { Usuario } from '../../interfaces/login';
import { Product, ProductOrigen } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';
import { ClientsService } from '../../services/clients.service';
import { RootService } from '../../services/root.service';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../modal/modal.component';
import { ProductListModalComponent } from './components/product-list-modal/product-list-modal.component';
import { AgregarListaProductosMasivaModalComponent } from '../agregar-lista-productos-masiva-modal/agregar-lista-productos-masiva-modal.component';
import { isVacio } from '../../utils/utilidades';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-product-list-card',
  templateUrl: './product-list-card.component.html',
  styleUrls: ['./product-list-card.component.scss'],
})
export class ProductListCardComponent implements OnInit {
  @Input() layout:
    | 'grid-sm'
    | 'grid-nl'
    | 'grid-lg'
    | 'list'
    | 'horizontal'
    | null = null;
  @Input() lista!: Lista;
  @Input() origen!: string[];

  usuario!: Usuario;
  addingToCart = false;

  @Output() getListas = new EventEmitter<any>();

  constructor(
    public rootService: RootService,
    private clientsService: ClientsService,
    private cart: CartService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.usuario = this.rootService.getDataSesionUsuario();
  }

  addToCart(): void {
    if (this.addingToCart) {
      return;
    }

    (this.lista.detalleSkus || []).forEach((p: Product) => {
      const origen = {
        origen: this.origen[0] ? this.origen[0] : '',
        subOrigen: this.origen[1] ? this.origen[1] : '',
        seccion: this.origen[2] ? this.origen[2] : '',
        recomendado: this.origen[3] ? this.origen[3] : '',
        ficha: false,
        cyber: p.cyber ? p.cyber : 0,
      } as ProductOrigen;

      if (this.origen) {
        p.origen = origen;
      }
    });

    this.addingToCart = true;
    this.cart.addLista(this.lista.detalleSkus).subscribe((resp) => {
      this.addingToCart = false;
      if (!resp.error) {
        this.toastr.success(
          `Productos de la lista "${this.lista.nombre}" agregados al carro correctamente.`
        );
      }
    });
  }

  cambiarNombre() {
    const initialState = {
      nombre: this.lista.nombre,
      closeToOk: false,
    };
    const bsModalRef: BsModalRef = this.modalService.show(
      EditarListaProductosComponent,
      { initialState }
    );
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res !== '') {
        const respuesta: any = await this.clientsService
          .updateListaArticulosFavoritos(
            res,
            this.usuario.rut || '',
            this.lista._id
          )
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Lista actualizada exitosamente.');

          this.getListas.emit();
          bsModalRef.hide();
        }
      }
    });
  }

  eliminarLista() {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> la lista "${this.lista.nombre}" de las busquedas recientes?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteListaArticulosFavoritos(this.usuario.rut || '', this.lista._id)
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Lista eliminada exitosamente.');
          this.getListas.emit();
        } else {
          this.toastr.error(respuesta.msg);
        }
      }
    });
  }

  verMas() {
    const initialState = {
      lista: this.lista,
    };
    this.modalService.show(ProductListModalComponent, {
      initialState,
      class: 'modal-lg',
    });
  }

  cargaMasiva() {
    const initialState: any = {
      lista: this.lista,
      modo: 'lista',
    };
    const modal: BsModalRef = this.modalService.show(
      AgregarListaProductosMasivaModalComponent,
      {
        initialState,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modal.content.event.subscribe((res: any) => {
      if (res) {
        this.getListas.emit();
      }
    });
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
