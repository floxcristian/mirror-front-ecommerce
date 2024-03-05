import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component';
import { isVacio } from '../../../../shared/utils/utilidades';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '@core/services-v2/cart.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from '@core/services-v2/session/session.service';
import { ShoppingCartStatusType } from '@core/enums/shopping-cart-status.enum';
import {
  IOrderDetail,
  IOrderDetailResponse,
} from '@core/models-v2/cart/order-details.interface';
import {
  IShoppingCart,
  IShoppingCartProduct,
} from '@core/models-v2/cart/shopping-cart.interface';
import { lastValueFrom } from 'rxjs';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-page-save-cart',
  templateUrl: './page-save-cart.component.html',
  styleUrls: ['./page-save-cart.component.scss'],
})
export class PageSaveCartComponent implements OnInit {
  innerWidth: number;
  lstCart: IOrderDetail[] = [];
  paginaActual = 1;
  totalPaginas!: number;
  carrosPorPagina = 8;
  showLoading = true;
  usuario!: ISession;
  ShoppingCartStatusType = ShoppingCartStatusType;
  constructor(
    public root: RootService,
    private localS: LocalStorageService,
    private toast: ToastrService,
    private modalService: BsModalService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private cartService: CartService,
    private readonly sessionService: SessionService,
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  async ngOnInit() {
    this.usuario = this.sessionService.getSession();
    if (!this.usuario.hasOwnProperty('username')) {
      this.usuario.username = this.usuario.email;
    }
    this.buscarCarrosGuardados();
  }

  async updateCart(id: any, estado: any) {
    switch (estado) {
      case ShoppingCartStatusType.DELETED:
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
            try {
              const respuesta: any = lastValueFrom(
                await this.cartService.setSaveCart(id, estado),
              );

              if (respuesta) {
                this.toast.success('Carro eliminado exitosamente');
                window.scrollTo({ top: 0 });
                // Si es el ultimo carro de la pagina se resta 1 a la pagina actual
                if (this.lstCart.length - 1 === 0) {
                  this.paginaActual--;
                }
                this.buscarCarrosGuardados();
              }
            } catch (e) {
              console.log(e);
              this.toast.error(
                'Ocurrio un error al actualizar el estado del carro.',
              );
            }
          }
        });
        break;
      case ShoppingCartStatusType.OPEN:
        const cartSession: IShoppingCart = this.localS.get('carroCompraB2B');
        try {
          // Si existe un carro con productos actualmente
          if ((cartSession?.products?.length || 0) > 0) {
            const initialState: DataModal = {
              titulo: 'Alerta',
              mensaje: `Actualmente tiene un carro con ${
                cartSession.products?.length || 0
              } artículo(s)<br>¿Que desea hacer con este carro?`,
              tipoIcon: TipoIcon.WARNING,
              tipoModal: TipoModal.QUESTION,
              textoBotonNO: 'Eliminar',
              textoBotonSI: 'Guardar',
            };
            const bsModalRef: BsModalRef = this.modalService.show(
              ModalComponent,
              { initialState },
            );
            bsModalRef.content.event.subscribe(async (res: boolean) => {
              if (res) {
                // se guarda el carro actual
                await lastValueFrom(
                  this.cartService.setSaveCart(
                    cartSession._id,
                    ShoppingCartStatusType.SAVED,
                  ),
                );
              } else {
                // se elimina el carro actual
                await lastValueFrom(
                  this.cartService.setSaveCart(
                    cartSession._id,
                    ShoppingCartStatusType.DELETED,
                  ),
                );
              }

              const respuesta: any = await lastValueFrom(
                this.cartService.setSaveCart(id, estado),
              );

              if (respuesta) {
                this.toast.success('Carro activado exitosamente');
                window.scrollTo({ top: 0 });
                // Si es el ultimo carro de la pagina se resta 1 a la pagina actual
                if (this.lstCart.length - 1 === 0 && !res) {
                  this.paginaActual--;
                }
                this.buscarCarrosGuardados();
              }
            });
          } else {
            const respuesta: any = await lastValueFrom(
              this.cartService.setSaveCart(id, estado),
            );

            if (respuesta) {
              this.toast.success('Carro activado exitosamente');
              window.scrollTo({ top: 0 });
              // Si es el ultimo carro de la pagina se resta 1 a la pagina actual
              if (this.lstCart.length - 1 === 0) {
                this.paginaActual--;
              }
              this.buscarCarrosGuardados();
            }
          }
        } catch (e) {
          console.log(e);
          this.toast.error(
            'Ocurrio un error al actualizar el estado del carro.',
          );
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
    this.cartService
      .getOrderDetails({
        user: this.usuario.username ? this.usuario.username : '',
        statuses: [ShoppingCartStatusType.SAVED],
      })
      .subscribe((resp: IOrderDetailResponse) => {
        if (resp.data && resp.data.length > 0) {
          this.lstCart = resp.data.filter(
            (cart: IOrderDetail) => cart.products.length > 0,
          );

          this.paginaActual = resp.page;
          this.totalPaginas = resp.lastPage;
          this.showLoading = false;
        } else {
          this.showLoading = false;
          this.lstCart = [];
        }
        this.cartService.load();
      });
  }

  getTotalCart(productos: IShoppingCartProduct[]) {
    let total = 0;
    productos.forEach((producto: IShoppingCartProduct) => {
      if (!isVacio(producto.price) && !isVacio(producto.quantity)) {
        total += Number(producto.price) * producto.quantity;
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
