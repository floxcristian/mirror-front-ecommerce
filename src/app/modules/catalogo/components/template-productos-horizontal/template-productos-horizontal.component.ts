import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core'
import { CartService } from '../../../../shared/services/cart.service'
import { Product } from '../../../../shared/interfaces/product'

interface IObjetoTemp {
  banner: any
  productos: any[]
  footerA: any
  footerB: any
}

@Component({
  selector: 'app-template-productos-horizontal',
  templateUrl: './template-productos-horizontal.component.html',
  styleUrls: ['./template-productos-horizontal.component.scss'],
})
export class TemplateProductosHorizontalComponent implements OnInit {
  @Input() objeto!: IObjetoTemp
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
