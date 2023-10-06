import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { Router } from '@angular/router';
import { ChilexpressService } from '../../services/chilexpress.service';

@Component({
  selector: 'app-detalle-carro-productos-oc',
  templateUrl: './detalle-carro-productos-oc.component.html',
  styleUrls: ['./detalle-carro-productos-oc.component.scss'],
})
export class DetalleCarroProductosOcComponent implements OnInit {
  @Input() show = true;
  @Input() productCart!: ProductCart[];
  @Input() CartSession: any;
  @Input() total: any;
  @Input() seeProducts = true;
  @Input() seePrices = true;
  @Output() sinStock: EventEmitter<any> = new EventEmitter();
  @Output() fechas: EventEmitter<any> = new EventEmitter();
  products: ProductCart[] = [];

  shippingNotSupported: ProductCart[] = [];
  itemSubscription!: Subscription;
  shippingTypeSubs!: Subscription;
  shippinGroup: any = {};
  productosCarro: any = [];
  @Output() productosDisponible: EventEmitter<any> = new EventEmitter();
  productosSinCumplir: any = [];
  @Input() shippingType = 'retiro';
  @Input() cart: any;
  shippingTypeTitle = '';
  totals: any = [];

  constructor(public router: Router, private omsService: ChilexpressService) {}

  async ngOnInit() {
    await this.total;
    await this.productCart;

    this.products = this.productCart;
    await this.verificarProducto();
    this.shippingType = this.total.retiro;
  }

  async verificarProducto() {
    let comuna = this.cart.codigoSucursal;
    let tipo = 'domicilio';
    if (this.cart.despacho.tipo === 'TIENDA') {
      tipo = 'retiroTienda';
    }
    let productos = {};
    let array_productos: any[] = [];
    //construir el json de los productos
    this.products.forEach((item) => {
      let json = {
        sku: item.sku,
        nombre: item.nombre,
        peso: item.peso,
        cantidad: item.cantidad,
        esVentaVerde: false,
        proveedor: null,
      };
      array_productos.push(json);
    });
    productos = {
      productos: array_productos,
    };
    let consulta: any = await this.omsService
      .getOmsPromesa(tipo, comuna, productos)
      .toPromise();
    let fecha_flete: any = consulta.data.respuesta[0].subOrdenes;
    let array_flete: any[] = [];
    fecha_flete.forEach((item: any) => {
      array_flete.push(item.fletes);
    });
    this.fechas.emit(array_flete);
    this.productosCarro = consulta.data.productosCarro;
    let cumple: any[] = [];
    //filtro para los productos que cumple
    this.productosCarro.forEach((item: any) => {
      let prod = this.products.filter((resp) => resp.sku === item.sku);
      cumple.push(prod[0]);
    });
    this.products = cumple;
    this.productosDisponible.emit(this.products);
    this.productosSinCumplir = consulta.data.productosSinCumplir;
    //filtrar productos que no pueden cumplir la entrega
    let nocumple: any[] = [];
    this.productosSinCumplir.forEach((item: any) => {
      let prod = this.products.filter((resp) => resp.sku === item.sku);
      nocumple.push(prod[0]);
    });

    this.shippingNotSupported = nocumple;
    if (this.shippingNotSupported.length > 0) {
      this.sinStock.emit(true);
    } else this.sinStock.emit(false);
  }
}
