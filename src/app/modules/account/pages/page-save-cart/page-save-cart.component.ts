import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../../../shared/interfaces/product';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component';
import { CartData } from '../../../../shared/interfaces/cart-item';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-save-cart',
  templateUrl: './page-save-cart.component.html',
  styleUrls: ['./page-save-cart.component.scss'],
})
export class PageSaveCartComponent implements OnInit {
  innerWidth: number;
  lstCart: any;
  paginaActual = 1;
  totalPaginas!: number;
  carrosPorPagina = 8;
  showLoading = true;
  constructor(
    private cartService: CartService,
    public root: RootService,
    private localS: LocalStorageService,
    private toast: ToastrService,
    private modalService: BsModalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  async ngOnInit() {
    this.buscarCarrosGuardados();
  }

  async updateCart(id: any, estado: any) {
    const objeto: any = {
      id,
      estado,
    };

    switch (estado) {
      case 'eliminado':
        const initialState: DataModal = {
          titulo: 'Confirmación',
          mensaje:
            '¿Esta seguro que desea <strong>eliminar</strong> este carro guardado?',
          tipoIcon: TipoIcon.QUESTION,
          tipoModal: TipoModal.QUESTION,
        };
        const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
          initialState,
        });
        bsModalRef.content.event.subscribe(async (res: any) => {
          if (res) {
            const respuesta: any = await this.cartService
              .setSaveCart(objeto)
              .toPromise();
            if (!respuesta.error) {
              this.toast.success('Carro eliminado exitosamente');
              window.scrollTo({ top: 0 });
              // Si es el ultimo carro de la pagina se resta 1 a la pagina actual
              if (this.lstCart.length - 1 === 0) {
                this.paginaActual--;
              }
              this.buscarCarrosGuardados();
            } else {
              this.toast.error(respuesta.msg);
            }
          }
        });
        break;
      case 'abierto':
        const cartSession: CartData = this.localS.get('carroCompraB2B');
        // Si existe un carro con productos actualmente
        if ((cartSession.productos?.length || 0) > 0) {
          const initialState: DataModal = {
            titulo: 'Alerta',
            mensaje: `Actualmente tiene un carro con ${
              cartSession.productos?.length || 0
            } artículo(s)<br>¿Que desea hacer con este carro?`,
            tipoIcon: TipoIcon.WARNING,
            tipoModal: TipoModal.QUESTION,
            textoBotonNO: 'Eliminar',
            textoBotonSI: 'Guardar',
          };
          const bsModalRef: BsModalRef = this.modalService.show(
            ModalComponent,
            { initialState }
          );
          bsModalRef.content.event.subscribe(async (res: any) => {
            if (res) {
              // se guarda el carro actual
              const resp: any = await this.cartService
                .setSaveCart({ id: cartSession._id, estado: 'guardado' })
                .toPromise();
              if (resp.error) {
                this.toast.error(resp.msg);
                return;
              }
            } else {
              // se elimina el carro actual
              const resp: any = await this.cartService
                .setSaveCart({ id: cartSession._id, estado: 'eliminado' })
                .toPromise();
              if (resp.error) {
                this.toast.error(resp.msg);
                return;
              }
            }

            const respuesta: any = await this.cartService
              .setSaveCart(objeto)
              .toPromise();
            if (!respuesta.error) {
              this.toast.success('Carro activado exitosamente');
              window.scrollTo({ top: 0 });
              // Si es el ultimo carro de la pagina se resta 1 a la pagina actual
              if (this.lstCart.length - 1 === 0 && !res) {
                this.paginaActual--;
              }
              this.buscarCarrosGuardados();
            } else {
              this.toast.error(respuesta.msg);
            }
          });
        } else {
          const respuesta: any = await this.cartService
            .setSaveCart(objeto)
            .toPromise();
          if (!respuesta.error) {
            this.toast.success('Carro activado exitosamente');
            window.scrollTo({ top: 0 });
            // Si es el ultimo carro de la pagina se resta 1 a la pagina actual
            if (this.lstCart.length - 1 === 0) {
              this.paginaActual--;
            }
            this.buscarCarrosGuardados();
          } else {
            this.toast.error(respuesta.msg);
          }
        }
        break;
    }
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  async izquierda() {
    if (this.showLoading) {
      return;
    }
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.buscarCarrosGuardados();
    }
  }

  async derecha() {
    if (this.showLoading) {
      return;
    }
    if (this.paginaActual <= this.totalPaginas) {
      this.paginaActual++;
      this.buscarCarrosGuardados();
    }
  }

  async buscarCarrosGuardados() {
    this.showLoading = true;
    const resp: any = await this.cartService
      .getSaveCart(this.paginaActual, this.carrosPorPagina)
      .toPromise();

    if (resp.data && resp.data.length > 0) {
      this.lstCart = resp.data.filter(
        (cart: any) => cart.productos.length > 0
      );

      this.paginaActual = resp.paginaActual;
      this.totalPaginas = resp.totalPaginas;
      this.cartService.load();
      this.showLoading = false;
    } else {
      this.showLoading = false;
      this.lstCart = [];
    }
  }

  getTotalCart(productos: Product[]) {
    let total = 0;
    productos.forEach((producto: any) => {
      if (!isVacio(producto.precio) && !isVacio(producto.cantidad)) {
        total += Number(producto.precio) * producto.cantidad;
      }
    });
    return total;
  }

  // funcion utilizada para determinar dinamicamente si es necesario aplicar alguna clase a los carros guardados. (pantallas celular)
  MobileView() {
    if (this.innerWidth < 576) {
      return true;
    } else {
      return false;
    }
  }
}
