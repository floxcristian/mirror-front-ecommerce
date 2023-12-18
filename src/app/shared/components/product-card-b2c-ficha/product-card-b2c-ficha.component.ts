import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  EventEmitter,
  TemplateRef,
  Output,
} from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { QuickviewService } from '../../services/quickview.service';
import { RootService } from '../../services/root.service';
import { CurrencyService } from '../../services/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isVacio } from '../../utils/utilidades';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { IShoppingCartProductOrigin } from '@core/models-v2/cart/shopping-cart.interface';
import { CartService } from '@core/services-v2/cart.service';

@Component({
  selector: 'app-product-card-b2c-ficha',
  templateUrl: './product-card-b2c-ficha.component.html',
  styleUrls: ['./product-card-b2c-ficha.component.scss'],
})
export class ProductCardB2cFichaComponent implements OnInit {
  IVA = environment.IVA || 0.19;
  private destroy$: Subject<void> = new Subject();
  @Input() isOnProductPage!: boolean;
  @Input() home: boolean = false;
  @Input() cartClass!: boolean;
  @Input() cartpopver: boolean = false;
  preciosEscalas: any[] | undefined = [];
  @Output() precioEscalaEvent: EventEmitter<any> = new EventEmitter();

  @Input() popoverContent!: any;
  isVacio = isVacio;
  @ViewChild('modalEscala', { static: false }) modalEscala!: TemplateRef<any>;
  modalEscalaRef!: BsModalRef;
  @Input() set product(value: any) {
    this.productData = value;
    this.productData.name = this.root.limpiarNombres(this.productData.name);
    //comentado por el momento
    // this.quality = this.root.setQuality(this.productData);
    // this.root.limpiaAtributos(value);
  }
  //*inicio
  // @Input() set product(value: IArticleResponse) {
  //   this.productData = value;
  //   // this.productData.nombre = this.root.limpiarNombres(
  //   //   this.productData.nombre
  //   // );

  //   this.quality = this.root.setQuality(value);
  //   this.root.limpiaAtributos(value);
  // }
  //**fin */

  @Input() layout:
    | 'grid-sm'
    | 'grid-nl'
    | 'grid-lg'
    | 'list'
    | 'horizontal'
    | any
    | null = null;
  @Input() grid!: any;
  @Input() paramsCategory!: any;
  @Input() origen!: string[];
  @Input() tipoOrigen: string = '';
  usuario!: ISession;
  porcentaje = 0;
  addingToCart = false;
  addingToWishlist = false;
  addingToCompare = false;
  showingQuickview = false;
  urlImage = environment.urlFotoOmnichannel;
  productData!: IArticle;
  // productData!: IArticleResponse & { url?: SafeUrl; gimage?: SafeUrl };
  quality: any = 0;
  precioProducto = 0;
  today = Date.now();

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
    // Services V2
    private readonly sessionService: SessionService
  ) {
    if (this.route.url.includes('/especial/')) this.home = true;
  }

  ngOnInit(): void {
    this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cd.markForCheck();
    });
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.cargaPrecio();
    if (this.productData.priceInfo.hasScalePrice)
      this.preciosEscalas = this.productData.priceInfo.scalePrice;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargaPrecio() {
    // if (this.productData.priceInfo.commonPrice === undefined) {
    //   this.productData.priceInfo.commonPrice = this.productData.priceInfo.commonPrice;
    //   this.productData.priceInfo.scalePrice = this.productData.priceInfo.scalePrice;
    // }

    if (this.home) {
      if (
        this.productData.priceInfo.commonPrice ||
        0 > this.productData.priceInfo.price
      ) {
        this.porcentaje_descuento();
      }
      return;
    }

    //calcular porcentaje de descuento
    if (
      (this.productData.priceInfo.commonPrice || 0) >
      this.productData.priceInfo.customerPrice
    ) {
      this.porcentaje_descuento();
    }
    let url: string = this.root.product(
      this.productData.sku,
      this.productData.name,
      false
    );
    let gimage: string =
      'https://images.implementos.cl/img/watermarked/' +
      this.productData.sku +
      '-watermarked.jpg';
    // FIXME: revisar si se utilizan estas variables
    // this.productData.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // this.productData.gimage =
    //   this.sanitizer.bypassSecurityTrustResourceUrl(gimage);
  }

  addToCart(): void {
    if (this.addingToCart) {
      return;
    }

    if (this.origen) {
      // Seteamos el origen de donde se hizo click a add cart.
      const origin: IShoppingCartProductOrigin = {
        origin: this.origen[0] ? this.origen[0] : '',
        subOrigin: this.origen[1] ? this.origen[1] : '',
        section: this.origen[2] ? this.origen[2] : '',
        recommended: this.origen[3],
        sheet: false,
        cyber: this.productData.cyber ? this.productData.cyber : 0,
      };
      this.productData.origin = origin;
    }

    this.addingToCart = true;
    this.cart.add(this.productData, 1).finally(() => {
      this.addingToCart = false;
      this.cd.markForCheck();
    });
  }

  addToWishlist(): void {
    if (this.addingToWishlist) {
      return;
    }

    this.addingToWishlist = true;
    //FIXME: ARREGLAR AGREGAR LISTA

    // this.wishlist.add(this.productData).subscribe({
    //   complete: () => {
    //     this.addingToWishlist = false;
    //     this.cd.markForCheck();
    //   },
    // });
  }

  addToCompare(): void {
    if (this.addingToCompare) {
      return;
    }

    this.addingToCompare = true;
    // FIXME: ARREGLAR AGREGAR COMPARAR
    // this.compare.add(this.productData).subscribe({
    //   complete: () => {
    //     this.addingToCompare = false;
    //     this.cd.markForCheck();
    //   },
    // });
  }

  showQuickview(): void {
    if (this.showingQuickview) {
      return;
    }

    this.showingQuickview = true;
    //FIXME: ARREGLAR VISTA RAPIDA
    // this.quickview.show(this.productData).subscribe({
    //   complete: () => {
    //     this.showingQuickview = false;
    //     this.cd.markForCheck();
    //   },
    // });
  }

  /**
   * @author ignacio zapata  \"2020-09-28\
   * @desc metodo utilizado cuando se hace clic en el card, y antes de redireccionar a la ficha del prod, se guarda el origen en una variable de cart service
   * @params
   * @return
   */
  setOrigenBeforeFicha() {
    // FIXME: falta servicio
    // this.cart.setOrigenHistory(this.origen);
  }

  porcentaje_descuento() {
    let descuento =
      (this.productData.priceInfo.commonPrice || 0) -
      this.productData.priceInfo.customerPrice;
    this.porcentaje = Math.round(
      (descuento / (this.productData.priceInfo.commonPrice || 1)) * 100
    );
  }

  verPreciosEscala(popover: NgbPopover) {
    popover.open();
  }
}
