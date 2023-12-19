import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { Router } from '@angular/router';
import { CartService } from '@core/services-v2/cart.service';
import { IShoppingCartProduct } from '@core/models-v2/cart/shopping-cart.interface';

@Component({
  selector: 'app-detalle-carro-productos',
  templateUrl: './detalle-carro-productos.component.html',
  styleUrls: ['./detalle-carro-productos.component.scss'],
})
export class DetalleCarroProductosComponent implements OnInit, OnDestroy {
  @Input() show = true;
  @Input() productCart!: IShoppingCartProduct[];
  @Input() seeProducts = true;
  @Input() seePrices = true;
  fullProducts: IShoppingCartProduct[] = [];
  products: IShoppingCartProduct[] = [];
  shippingNotSupported: IShoppingCartProduct[] = [];
  itemSubscription!: Subscription;
  shippingTypeSubs!: Subscription;
  shippinGroup: any = {};

  @Input() shippingType: any = 'retiro';
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
      this.cart.items$ as Observable<IShoppingCartProduct[]>
    ).subscribe((products: IShoppingCartProduct[]) => {
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
