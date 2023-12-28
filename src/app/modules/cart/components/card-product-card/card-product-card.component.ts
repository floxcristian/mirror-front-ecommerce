// Angular
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// Models
import { IShoppingCartProduct } from '@core/models-v2/cart/shopping-cart.interface';
// Libs
import { ToastrService } from 'ngx-toastr';
// Services
import { RootService } from '../../../../shared/services/root.service';
import { CartService } from '@core/services-v2/cart.service';

interface Item {
  ProductCart: IShoppingCartProduct;
  quantity: number;
  quantityControl: FormControl;
}
@Component({
  selector: 'app-card-product-card',
  templateUrl: './card-product-card.component.html',
  styleUrls: ['./card-product-card.component.scss'],
})
export class CardProductCardComponent implements OnInit {
  @Input() productos!: Item[];
  constructor(
    public root: RootService,
    private cart: CartService,
    private toast: ToastrService
  ) {}

  ngOnInit() {}

  async updateCart(quantity: number, item: Item) {
    if (quantity < 1) {
      quantity = 1;
      this.toast.error('No se permiten números negativos en la cantidad');
    }

    item.ProductCart.quantity = quantity;

    const productos: IShoppingCartProduct[] = [];
    this.productos.map((r: Item) => {
      productos.push(r.ProductCart);
    });

    this.cart.saveCart(productos).subscribe((r) => {
      for (const el of r.data.productos) {
        if (el.sku == item.ProductCart.sku) {
          item.ProductCart.deliveryConflict = el.conflictoEntrega;
          item.ProductCart.delivery = el.entregas;
          item.ProductCart.price = el.precio;
        }
      }
      this.cart.updateCart(productos);
    });
  }

  remove(item: IShoppingCartProduct): void {
    this.cart.remove(item);
  }
}
