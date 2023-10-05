import { Component, Input, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'

import { ProductCart } from '../../../../shared/interfaces/cart-item'
import { CartService } from '../../../../shared/services/cart.service'
import { RootService } from '../../../../shared/services/root.service'

@Component({
  selector: 'app-card-product-card',
  templateUrl: './card-product-card.component.html',
  styleUrls: ['./card-product-card.component.scss'],
})
export class CardProductCardComponent implements OnInit {
  @Input() productos!: any
  constructor(
    public root: RootService,
    private cart: CartService,
    private toast: ToastrService,
  ) {}

  ngOnInit() {}

  async updateCart(cantidad: number, item: any) {
    if (cantidad < 1) {
      cantidad = 1
      this.toast.error('No se permiten números negativos en la cantidad')
    }

    item.ProductCart.cantidad = cantidad

    const productos: ProductCart[] = []
    this.productos.map((r: any) => {
      productos.push(r.ProductCart)
    })

    this.cart.saveCart(productos).subscribe((r) => {
      for (const el of r.data.productos) {
        if (el.sku == item.ProductCart.sku) {
          item.ProductCart.conflictoEntrega = el.conflictoEntrega
          item.ProductCart.entregas = el.entregas
          item.ProductCart.precio = el.precio
        }
      }
      this.cart.updateCart(productos)
    })
  }

  remove(item: ProductCart): void {
    this.cart.remove(item).subscribe((r) => {})
  }
}
