import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { CartService } from '../../../../shared/services/cart.service'
import { Product } from '../../../../../app/shared/interfaces/product'

@Component({
  selector: 'app-template-productos-vertical',
  templateUrl: './template-productos-vertical.component.html',
  styleUrls: ['./template-productos-vertical.component.scss'],
})
export class TemplateProductosVerticalComponent implements OnChanges {
  @Input() objeto: any
  @Input() innerWidth!: number
  @Input() page: number = 0
  @Input() tipoCatalogo: any
  cambiarImg: boolean = true
  addingToCart = false
  ght = `height:${window.innerHeight - 60}px !important`

  constructor(
    public cart: CartService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    console.log('tipoCatalogo', this.tipoCatalogo)
  }

  ngOnChanges(changes: SimpleChanges): void {
    let resto = this.page % 2
    this.cambiarImg = resto == 0 ? false : true
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
      'vertical',
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
