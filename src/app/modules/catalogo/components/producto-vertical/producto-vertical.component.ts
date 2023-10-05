import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { CartService } from '../../../../shared/services/cart.service'
import { Product } from 'src/app/shared/interfaces/product'

interface IProductTemp {
  preciosScal: any[]
  precioEscala: any
  precio: any
  sku: any
  rut: any
  precioEsp: any
  cyber: any
  atributos: any[]
}

@Component({
  selector: 'app-producto-vertical',
  templateUrl: './producto-vertical.component.html',
  styleUrls: ['./producto-vertical.component.scss'],
})
export class ProductoVerticalComponent implements OnInit {
  @Input() producto!: IProductTemp
  @Output() agregarCarro: EventEmitter<any> = new EventEmitter()
  @Input() innerWidth!: number
  @Input() tipoCatalogo: any
  precios: boolean = true
  carro: boolean = true
  constructor(private _cartService: CartService) {}

  ngOnInit() {
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
  async addToCart(producto: any) {
    producto = await this._cartService.setProductoOrigen_catDinamicos(
      producto,
      'vertical',
    )
    this.agregarCarro.emit(producto)
  }
}
