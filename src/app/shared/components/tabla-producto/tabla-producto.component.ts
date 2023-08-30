import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { ProductOrigen } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { GeoLocationService } from '../../services/geo-location.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { CartService } from '../../services/cart.service';
import { Usuario } from '../../interfaces/login';
import { RootService } from '../../services/root.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LogisticsService } from '../../services/logistics.service';
import { PreferenciasCliente } from '../../interfaces/preferenciasCliente';

@Component({
  selector: 'app-tabla-producto',
  templateUrl: './tabla-producto.component.html',
  styleUrls: ['./tabla-producto.component.scss'],
})
export class TablaProductoComponent implements OnInit {
  @Input() products: any = [];
  @Input() paramsCategory: any = [];
  @Input() origen!: string[];

  preferenciaCliente: PreferenciasCliente;
  usuario: any;
  tienda: any;
  addingToCart = false;
  productoId = -1;
  productsData: any = [];
  productModal: any;
  tabla: any = {};
  columns: any = [];
  index: number = 0;
  stockProducto: any = [];
  loadingData = false;
  quantity: FormControl = new FormControl(1);
  modalRef!: BsModalRef;
  constructor(
    private productService: ProductsService,
    private logisticSerivice: LogisticsService,
    private localS: LocalStorageService,
    private geoLocationService: GeoLocationService,
    public cart: CartService,
    public root: RootService,
    public sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    this.preferenciaCliente = this.localS.get('preferenciasCliente');
  }

  ngOnInit() {
    this.logisticSerivice.direccionCliente$.subscribe((r) => {
      this.loadingData = true;
      this.preferenciaCliente = this.localS.get('preferenciasCliente');
      if (this.products !== undefined) {
        this.productsData = this.products;
        this.loadingData = false;
      }
    });
  }
  async ngOnChanges(changes: SimpleChange) {
    this.loadingData = true;

    if (this.products !== undefined) {
      this.productsData = this.products;
      this.loadingData = false;
    }
  }

  async construirJSON() {
    let listaProducto: any = [];
    this.productsData = [];
    const usuario: Usuario = this.localS.get('usuario');
    let rut = '0';

    if (usuario != null) {
      rut = usuario.rut || '';
    }

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    let productos: any = JSON.parse(JSON.stringify(this.products));

    await Promise.all(
      productos.map(async (item: any) => {
        const parametrosPrecios = {
          sku: item.sku,
          sucursal: tiendaSeleccionada?.codigo,
          rut,
        };

        const params = {
          sku: item.sku,
          codigoSucursal: tiendaSeleccionada?.codigo,
          destino: this.preferenciaCliente.direccionDespacho?.comuna,
          tipo: 'DES',
        };

        let json: any = {};

        let consulta: any = await this.cart
          .getPriceProduct(parametrosPrecios)
          .toPromise();
        let consultaFecha: any = await this.logisticSerivice
          .obtieneDespachoProducto(params)
          .toPromise();

        json = item;
        json.fecha = consultaFecha.fecha;
        json.precio = consulta.precio;
        json.precioComun = consulta.precioComun;
        json.precio_escala = consulta.precio_escala;
        //construir datos stock

        let url: string = this.root.product(json.sku, json.nombre, false);
        let gimage: string =
          'https://images.implementos.cl/img/watermarked/' +
          json.sku +
          '-watermarked.jpg';

        json.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        json.gimage = this.sanitizer.bypassSecurityTrustResourceUrl(gimage);

        listaProducto.push(json);
      })
    );
    this.loadingData = false;
    this.productsData = listaProducto;
  }

  //agregar al carros
  addToCart(productData: any): void {
    this.productoId = productData.id;
    if (this.addingToCart) {
      return;
    }

    productData.origen = {} as ProductOrigen;

    if (this.origen) {
      // Seteamos el origen de donde se hizo click a add cart.
      productData.origen.origen = this.origen[0] ? this.origen[0] : '';
      productData.origen.subOrigen = this.origen[1] ? this.origen[1] : '';
      productData.origen.seccion = this.origen[2] ? this.origen[2] : '';
      productData.origen.recomendado = this.origen[3] ? this.origen[3] : '';
      productData.origen.ficha = false;
      productData.origen.cyber = productData.cyber ? productData.cyber : 0;
    }

    this.addingToCart = true;
    this.cart.add(productData, 1).subscribe({
      complete: () => {
        this.addingToCart = false;
      },
    });
  }

  async updateCart(cantidad: any, item: any) {
    const usuario: Usuario = this.localS.get('usuario');
    let rut = '0';

    if (usuario != null) {
      rut = usuario.rut || '';
    }

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    this.comprobarStock(item.sku, tiendaSeleccionada);

    const parametrosPrecios = {
      sku: item.sku,
      sucursal: tiendaSeleccionada?.codigo,
      rut,
      cantidad,
    };

    let datos: any = await this.cart
      .getPriceProduct(parametrosPrecios)
      .toPromise();

    if (datos['precio_escala']) {
      item.precioComun = datos['precio'].precio;
      item.precio.precio = datos['precio'].precio;
    }
  }

  async comprobarStock(sku: any, tienda: any) {
    this.productService.getStockProduct(sku).subscribe((x: any) => {});
  }

  //abrir modal para los stock
  async openModal(template: any, item: any) {
    this.productModal = {};
    this.productModal = item;
    let consultaStock: any = await this.productService
      .getStockProduct(item.sku)
      .toPromise();
    this.stockProducto = consultaStock;
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }
}
