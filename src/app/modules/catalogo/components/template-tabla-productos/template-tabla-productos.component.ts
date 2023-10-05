import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core'
import { CartService } from '../../../../shared/services/cart.service'
import { Product } from '../../../../shared/interfaces/product'

@Component({
  selector: 'app-template-tabla-productos',
  templateUrl: './template-tabla-productos.component.html',
  styleUrls: ['./template-tabla-productos.component.scss'],
})
export class TemplateTablaProductosComponent implements OnInit {
  @Input() objeto: any
  addingToCart = false
  @Input() tipoCatalogo: any
  precios: boolean = true
  carro: boolean = true
  constructor(
    public cart: CartService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    switch (this.tipoCatalogo) {
      case 'Vendedor':
        this.carro = false
        break
      case 'Distribuidor':
        this.precios = false
        this.carro = false
        break
    }
    console.log('tipo catalogo', this.tipoCatalogo)
  }

  async addToCart(producto: Product) {
    producto.imagen = `https://images.implementos.cl/img/250/${producto.sku}-1.jpg`

    if (this.addingToCart) {
      return
    }

    producto = await this.cart.setProductoOrigen_catDinamicos(
      producto,
      'horizontal',
    )

    this.addingToCart = true
    this.cart.add(producto, 1).subscribe({
      complete: () => {
        this.addingToCart = false
        this.cd.markForCheck()
      },
    })
  }
}
