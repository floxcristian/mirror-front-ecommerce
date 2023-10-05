import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core'
import { CartService } from '../../services/cart.service'
import { Product, ProductOrigen } from '../../interfaces/product'
import { WishlistService } from '../../services/wishlist.service'
import { CompareService } from '../../services/compare.service'
import { QuickviewService } from '../../services/quickview.service'
import { RootService } from '../../services/root.service'
import { CurrencyService } from '../../services/currency.service'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { GoogleTagManagerService } from 'angular-google-tag-manager'
@Component({
  selector: 'app-product-card-b2c',
  templateUrl: './product-card-b2c.component.html',
  styleUrls: ['./product-card-b2c.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardB2cComponent implements OnInit {
  private destroy$: Subject<void> = new Subject()
  @Input() home: boolean = false
  @Input() cartClass!: boolean
  @Input() set product(value: Product | any) {
    this.productData = value
    this.productData.nombre = this.root.limpiarNombres(this.productData.nombre)

    this.quality = this.root.setQuality(this.productData)
    this.root.limpiaAtributos(value)
  }

  @Input() layout:
    | 'grid-sm'
    | 'grid-nl'
    | 'grid-lg'
    | 'list'
    | 'horizontal'
    | null
    | any = null
  @Input() grid!: any
  @Input() paramsCategory!: any
  @Input() origen!: string[]
  @Input() tipoOrigen: string = ''
  porcentaje = 0
  url: any
  addingToCart = false
  addingToWishlist = false
  addingToCompare = false
  showingQuickview = false
  urlImage = environment.urlFotoOmnichannel
  productData!: Product & { url?: SafeUrl; gimage?: SafeUrl }
  quality: any = 0
  precioProducto = 0
  today = Date.now()

  constructor(
    private cd: ChangeDetectorRef,
    public root: RootService,
    public cart: CartService,
    private route: Router,
    public wishlist: WishlistService,
    public compare: CompareService,
    public quickview: QuickviewService,
    public currency: CurrencyService,
    public sanitizer: DomSanitizer,
    private readonly gtmService: GoogleTagManagerService,
  ) {
    if (this.route.url.includes('/especial/')) this.home = true
    this.url = window.location.href
  }

  ngOnInit(): void {
    this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cd.markForCheck()
    })
    this.cargaPrecio()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  cargaPrecio() {
    if (this.productData.precioComun === undefined) {
      this.productData.precioComun = this.productData.precio.precioComun
      this.productData.precio_escala = this.productData.precio.precio_escala
    }

    if (this.home) {
      if (this.productData.precioComun || 0 > this.productData.precio.precio) {
        this.porcentaje_descuento()
      }
      return
    }

    //calcular porcentaje de descuento
    if (this.productData.precioComun || 0 > this.productData.precio.precio) {
      this.porcentaje_descuento()
    }
    let url: string = this.root.product(
      this.productData.sku,
      this.productData.nombre,
      false,
    )
    let gimage: string =
      'https://images.implementos.cl/img/watermarked/' +
      this.productData.sku +
      '-watermarked.jpg'

    this.productData.url = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    this.productData.gimage =
      this.sanitizer.bypassSecurityTrustResourceUrl(gimage)
  }

  addToCart(): void {
    if (this.addingToCart) {
      return
    }
    this.gtmService.pushTag({
      event: 'addtoCart',
      pagePath: this.url,
    })

    this.productData.origen = {} as ProductOrigen

    if (this.origen) {
      // Seteamos el origen de donde se hizo click a add cart.
      this.productData.origen.origen = this.origen[0] ? this.origen[0] : ''
      this.productData.origen.subOrigen = this.origen[1] ? this.origen[1] : ''
      this.productData.origen.seccion = this.origen[2] ? this.origen[2] : ''
      this.productData.origen.recomendado = this.origen[3]
        ? this.origen[3]
        : ''
      this.productData.origen.ficha = false
      this.productData.origen.cyber = this.productData.cyber
        ? this.productData.cyber
        : 0
    }

    this.addingToCart = true
    this.cart.add(this.productData, 1).subscribe({
      complete: () => {
        this.addingToCart = false
        this.cd.markForCheck()
      },
    })
  }

  addToWishlist(): void {
    if (this.addingToWishlist) {
      return
    }

    this.addingToWishlist = true

    this.wishlist.add(this.productData).subscribe({
      complete: () => {
        this.addingToWishlist = false
        this.cd.markForCheck()
      },
    })
  }

  addToCompare(): void {
    if (this.addingToCompare) {
      return
    }

    this.addingToCompare = true
    this.compare.add(this.productData).subscribe({
      complete: () => {
        this.addingToCompare = false
        this.cd.markForCheck()
      },
    })
  }

  showQuickview(): void {
    if (this.showingQuickview) {
      return
    }

    this.showingQuickview = true
    this.quickview.show(this.productData).subscribe({
      complete: () => {
        this.showingQuickview = false
        this.cd.markForCheck()
      },
    })
  }

  /**
   * @author ignacio zapata  \"2020-09-28\
   * @desc metodo utilizado cuando se hace clic en el card, y antes de redireccionar a la ficha del prod, se guarda el origen en una variable de cart service
   * @params
   * @return
   */
  setOrigenBeforeFicha() {
    this.cart.setOrigenHistory(this.origen)
  }

  porcentaje_descuento() {
    let descuento =
      this.productData.precioComun || 0 - this.productData.precio.precio
    this.porcentaje = Math.round(
      (descuento / (this.productData.precioComun || 0)) * 100,
    )
    //this.porcentaje = 0;
  }
}
