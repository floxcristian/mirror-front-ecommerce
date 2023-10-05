import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core'
import { CartService } from '../../../../shared/services/cart.service'

interface IAttributeTemp {
  valor: string
  nombre: any
}

interface IObjectTemp {
  header: any
  tituloEditable: any
  productos: {
    sku: any
    url: string
    tipo: any
    precio: any
    cantidad: any
    cyber: any
    producto: any
    rut: any
    precioEsp: any
    imagenes: any[]
    precioEscala: any[]
    preciosScal: any
    atributos: IAttributeTemp[]
  }
  footer: any
}

@Component({
  selector: 'app-template-un-producto',
  templateUrl: './template-un-producto.component.html',
  styleUrls: ['./template-un-producto.component.scss'],
})
export class TemplateUnProductoComponent implements OnInit {
  @Input() objeto!: IObjectTemp
  @Input() innerWidth!: number
  @Input() tipoCatalogo: any
  addingToCart = false
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

  async addToCart(producto: any) {
    producto.images = {
      '150': [`https://images.implementos.cl/img/250/${producto.sku}-1.jpg`],
    }

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
