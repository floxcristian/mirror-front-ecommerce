import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-carro-productos',
  templateUrl: './detalle-carro-productos.component.html',
  styleUrls: ['./detalle-carro-productos.component.scss'],
})
export class DetalleCarroProductosComponent implements OnInit, OnDestroy {
  @Input() show = true;
  @Input() productCart!: ProductCart[];
  @Input() seeProducts = true;
  @Input() seePrices = true;
  fullProducts: ProductCart[] = [];
  products: ProductCart[] = [];
  shippingNotSupported: ProductCart[] = [];
  itemSubscription!: Subscription;
  shippingTypeSubs!: Subscription;
  shippinGroup: any = {};

  @Input() shippingType:any = 'retiro';
  shippingTypeTitle = '';
  totals: any = [];

  constructor(public cart: CartService, public router: Router) {}

  ngOnInit() {
    if (this.shippingType == 'retiro' || this.shippingType == 'TIENDA') {
      this.shippingTypeTitle = 'Retiro en Tienda';
    } else if (this.shippingType == 'despacho' || this.shippingType == 'STD') {
      this.shippingTypeTitle = 'Despacho a domicilio';
    } else this.shippingTypeTitle = 'Despacho a domicilio';

    this.cart.totals$.subscribe();

    this.shippingTypeSubs = this.cart.shippingType$.subscribe((resp) => {
      this.shippingType = resp;
      console.log(resp);
      if (this.shippingType == 'retiro' || this.shippingType == 'TIENDA') {
        this.shippingTypeTitle = 'Retiro en Tienda';
      } else if (
        this.shippingType == 'despacho' ||
        this.shippingType == 'STD'
      ) {
        this.shippingTypeTitle = 'Despacho a domicilio';
      } else this.shippingTypeTitle = 'Despacho a domicilio';
    });

    this.itemSubscription = (
      this.cart.items$ as Observable<ProductCart[]>
    ).subscribe((products: ProductCart[]) => {
      this.fullProducts = products;
      if (products.length > 0) {
        this.validateItemCart(products);
      }
    });
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }

  resetVariables() {
    this.products = [];
    this.shippingNotSupported = [];
  }

  validateItemCart(products: any[]) {
    this.resetVariables();

    if (products.length === 0) {
      return;
    }

    products.map((item) => {
      if (this.shippingType === 'retiro' || this.shippingType === 'TIENDA') {
        if (!item.conflictoRetiro) {
          this.products.push(item);
        } else {
          this.shippingNotSupported.push(item);
        }
      } else {
        if (!item.conflictoEntrega) {
          this.products.push(item);
        } else {
          this.shippingNotSupported.push(item);
        }
      }
    });

    this.cart.emitValidateProducts(this.products);
  }

  changeRetiro(event: any) {
    this.validateItemCart(this.fullProducts);
  }
}
