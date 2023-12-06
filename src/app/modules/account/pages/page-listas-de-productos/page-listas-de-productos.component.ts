import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '../../../../shared/components/modal/modal.component';
import { Lista } from '../../../../shared/interfaces/articuloFavorito';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { ClientsService } from '../../../../shared/services/clients.service';
import { RootService } from '../../../../shared/services/root.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { EditarListaProductosComponent } from '../../../../shared/components/editar-lista-productos/editar-lista-productos.component';
import { AgregarListaProductosMasivaModalComponent } from '../../../../shared/components/agregar-lista-productos-masiva-modal/agregar-lista-productos-masiva-modal.component';
import { AgregarListaProductosUnitariaModalComponent } from '../../../../shared/components/agregar-lista-productos-unitaria-modal/agregar-lista-productos-unitaria-modal.component';
import { CartService } from '../../../../shared/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ITiendaLocation } from '@core/services-v2/geolocation/models/geolocation.interface';

@Component({
  selector: 'app-page-listas-de-productos',
  templateUrl: './page-listas-de-productos.component.html',
  styleUrls: ['./page-listas-de-productos.component.scss'],
})
export class PageListasDeProductosComponent implements OnInit {
  innerWidth: number;
  usuario!: ISession;
  tiendaSeleccionada!: ITiendaLocation;
  origen!: string[];
  listas: any = [];
  seleccionada = 0;
  addingToCart = false;
  showLoading = true;
  listas_temp: any = [];
  constructor(
    private clientsService: ClientsService,
    public rootService: RootService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private cart: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly geolocationService: GeolocationServiceV2
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit() {
    this.usuario = this.sessionService.getSession();
    this.tiendaSeleccionada = this.geolocationService.getSelectedStore();
    this.getListas();
  }

  getListas() {
    this.listas = [];
    this.listas_temp = [];
    this.showLoading = true;
    this.clientsService
      .getListaArticulosFavoritos(this.usuario.documentId || '0')
      .subscribe((resp: ResponseApi) => {
        if (resp.data.length > 0) {
          if (resp.data[0].listas.length > 0) {
            this.listas = resp.data[0].listas;
            const detalleSkus = resp.data[0].detalleSkus;

            this.listas = this.listas.map((list: any) => {
              const products: any[] = [];
              list.skus.forEach((p: any) => {
                const detalle = detalleSkus.find((dp: any) => dp.sku === p);
                products.push(detalle);
              });
              list.detalleSkus = products;
              return list;
            });
          }
        }
        this.listas_temp = this.listas;
        this.showLoading = false;
      });
  }

  getPrecio(precios: any[]): number {
    let precio = precios.find(
      (p) =>
        p.sucursal === this.tiendaSeleccionada?.codigo &&
        p.rut === this.usuario.documentId
    );

    if (isVacio(precio)) {
      precio = precios.find(
        (p) => p.sucursal === this.tiendaSeleccionada?.codigo && p.rut === '0'
      );
    }

    return precio.precio;
  }

  seleccionarLista(idx: number, href: string) {
    this.seleccionada = idx;
  }

  cambiarNombre(lista: Lista) {
    const initialState = {
      nombre: lista.nombre,
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
            this.usuario.documentId || '0',
            lista._id
          )
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Lista actualizada exitosamente.');

          this.getListas();
          bsModalRef.hide();
        }
      }
    });
  }

  eliminarLista(lista: Lista) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> la lista "${lista.nombre}"?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteListaArticulosFavoritos(
            this.usuario.documentId || '0',
            lista._id
          )
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Lista eliminada exitosamente.');
          this.getListas();
        } else {
          this.toastr.error(respuesta.msg);
        }
      }
    });
  }

  eliminarProducto(lista: Lista, sku: string) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> el producto SKU: ${sku} de la lista "${lista.nombre}"?`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const respuesta: any = await this.clientsService
          .deleteArticulosFavoritos(
            sku,
            this.usuario.documentId || '0',
            lista._id
          )
          .toPromise();
        if (!respuesta.error) {
          this.toastr.success('Producto eliminado exitosamente.');
          this.getListas();
        } else {
          this.toastr.error(respuesta.msg);
        }
      }
    });
  }

  listaPredeterminada(lista: Lista) {
    this.clientsService
      .predeterminadaListaArticulosFavoritos(
        this.usuario.documentId || '0',
        lista._id
      )
      .subscribe((resp: ResponseApi) => {
        if (!resp.error) {
          this.getListas();
        }
      });
  }

  cargaMasiva() {
    const modal: BsModalRef = this.modalService.show(
      AgregarListaProductosMasivaModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modal.content.event.subscribe((res: any) => {
      if (res) {
        this.getListas();
      }
    });
  }

  cargaUnitaria() {
    const modal: BsModalRef = this.modalService.show(
      AgregarListaProductosUnitariaModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modal.content.event.subscribe((res: any) => {
      if (res) {
        this.getListas();
      }
    });
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

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  // funcion utilizada para determinar dinamicamente si es necesario aplicar alguna clase a los carros guardados. (pantallas celular)
  MobileView() {
    if (this.innerWidth < 576) {
      return true;
    } else {
      return false;
    }
  }

  addToCart(lista: any) {
    if (this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cart.addLista(lista.detalleSkus).subscribe((resp) => {
      this.addingToCart = false;
      if (!resp.error) {
        this.toastr.success(
          `Productos de la lista "${lista.nombre}" agregados al carro correctamente.`
        );
      }
    });
  }

  addCart(item: any) {
    if (this.addingToCart) {
      return;
    }

    this.addingToCart = true;
    this.cart.add(item, 1).subscribe((resp) => {
      {
        this.addingToCart = false;
        if (!resp.error) {
          this.toastr.success(
            `Productos "${item.sku}" agregado al carro correctamente.`
          );
        }
      }
    });
  }

  buscar_producto(event: any, index: any) {
    this.listas = JSON.parse(JSON.stringify(this.listas_temp));
    let listaTemp: any = [];

    listaTemp = JSON.parse(JSON.stringify(this.listas[index].detalleSkus));
    listaTemp = listaTemp.filter(
      (item: any) =>
        item.nombre.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.sku.toLowerCase().includes(event.target.value.toLowerCase())
    );

    this.listas[index].detalleSkus = listaTemp;
  }
}
