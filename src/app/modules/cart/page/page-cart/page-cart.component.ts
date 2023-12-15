import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Banner } from '../../../../shared/interfaces/banner';
import { HostListener } from '@angular/core';
import { DirectionService } from '../../../../shared/services/direction.service';
import { environment } from '@env/environment';
import { isVacio } from '../../../../shared/utils/utilidades';
import { isPlatformBrowser } from '@angular/common';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from '@core/states-v2/session.service';
import { InvitadoStorageService } from '@core/storage/invitado-storage.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { CartService } from '@core/services-v2/cart.service';
import { CustomerPreferenceStorageService } from '@core/storage/customer-preference-storage.service';
import { IPreference } from '@core/models-v2/customer/customer-preference.interface';
import { ShoppingCartStorageService } from '@core/storage/shopping-cart-storage.service';
import {
  IShoppingCart,
  IShoppingCartProduct,
} from '@core/models-v2/cart/shopping-cart.interface';
import { ArticleService } from '@core/services-v2/article.service';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';

interface Item {
  ProductCart: IShoppingCartProduct;
  quantity: number;
  quantityControl: FormControl;
}

@Component({
  selector: 'app-cart',
  templateUrl: './page-cart.component.html',
  styleUrls: ['./page-cart.component.scss'],
})
export class PageCartComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  removedItems: IShoppingCart[] = [];
  items: Item[] = [];
  updating = false;
  saveTimer: any;
  innerWidth: number;
  banners: Banner[] = [];
  paso1!: boolean;
  showresumen = false;
  IVA = environment.IVA || 0.19;
  isVacio = isVacio;

  recommendedProducts: IArticle[] = [];
  user!: ISession;
  isB2B!: boolean;
  SumaTotal = 0;
  carouselOptions = {
    items: 6,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    responsive: {
      1366: { items: 6 },
      1100: { items: 6 },
      920: { items: 6 },
      680: { items: 3 },
      500: { items: 3 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  };
  carrouselOptionsMobile = {
    items: 6,
    nav: false,
    dots: true,
    slideBy: 'page',
    merge: true,
    responsive: {
      1366: { items: 6 },
      1100: { items: 6 },
      920: { items: 6 },
      680: { items: 3 },
      500: { items: 3 },
      0: { items: 5, nav: false, mergeFit: true },
    },
  };
  preferenciaCliente!: IPreference;

  constructor(
    private router: Router,
    public root: RootService,
    private toast: ToastrService,

    // private productoService: ProductsService,
    private direction: DirectionService, // @Inject(WINDOW) private window: Window
    private readonly gtmService: GoogleTagManagerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly articleService: ArticleService,
    private readonly invitadoStorage: InvitadoStorageService,
    public readonly shoppingCartService: CartService,
    private readonly customerPreferenceStorage: CustomerPreferenceStorageService,
    private readonly shoppingCartStorage: ShoppingCartStorageService,
    private readonly geolocationService: GeolocationServiceV2
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.preferenciaCliente =
      this.customerPreferenceStorage.get() as IPreference;
  }

  ngOnInit(): void {
    const _this = this;
    //this.user = this.root.getDataSesionUsuario();
    this.user = this.sessionService.getSession();
    this.shoppingCartService.items$
      .pipe(
        takeUntil(this.destroy$),
        map((ProductCarts) =>
          (ProductCarts || []).map((item): Item => {
            return {
              ProductCart: item,
              quantity: item.quantity,
              quantityControl: new FormControl(
                item.quantity,
                Validators.required
              ),
            };
          })
        )
      )
      .subscribe((items) => {
        this.items = items;

        //se obtienen los productos recomendados segun el contenido del carro
        this.getRecommendedProductsList();
      });

    _this.shoppingCartService.calc(true);
    setTimeout(() => {
      this.shoppingCartService.dropCartActive$.next(false);
    });
    if (['supervisor', 'comprador'].includes(this.user?.userRole || '')) {
      this.gtmService.pushTag({
        event: 'cart',
        pagePath: window.location.href,
      });
    }
    this.isB2B = ['supervisor', 'comprador'].includes(
      this.user?.userRole || ''
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    setTimeout(() => {
      this.shoppingCartService.dropCartActive$.next(true);
    });
  }

  needUpdate(): boolean {
    let needUpdate = false;
    return needUpdate;
  }

  async updateCart(cantidad: number, item: any) {
    if (cantidad < 1) {
      cantidad = 1;
      this.toast.error('No se permiten números negativos en la cantidad');
    }

    item.ProductCart.cantidad = cantidad;

    const productos: IShoppingCartProduct[] = [];
    this.items.map((r) => {
      productos.push(r.ProductCart);
    });

    this.shoppingCartService.saveCart(productos).subscribe((r) => {
      for (const el of r.data.productos) {
        if (el.sku == item.ProductCart.sku) {
          item.ProductCart.conflictoEntrega = el.conflictoEntrega;
          item.ProductCart.entregas = el.entregas;
          item.ProductCart.precio = el.precio;
        }
      }
      this.shoppingCartService.updateCart(productos);
    });
  }

  remove(item: IShoppingCartProduct): void {
    this.shoppingCartService.remove(item);
  }

  saveCart() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      const productos = this.items.map((item) => {
        return {
          sku: item.ProductCart.sku,
          cantidad: item.quantity,
        };
      });
      this.shoppingCartService.saveCart(productos).subscribe((r) => {});
    }, 1000);
  }

  limpiarInvitado() {
    // this.localS.remove('invitado');
    this.invitadoStorage.remove();
  }

  async setSaveCart() {
    let cartSession: IShoppingCart =
      this.shoppingCartStorage.get() as IShoppingCart;

    let respuesta: any = await this.shoppingCartService
      .setSaveCart(cartSession._id, 'saved')
      .toPromise();
    console.log('cart load desde PageCartComponent');
    this.shoppingCartService.load();
    if (!respuesta.error) {
      this.toast.success('Carro guardado exitosamente');
      this.router.navigate(['/', 'inicio']);
    }
  }

  getRecommendedProductsList() {
    if (this.items.length > 0) {
      console.log('getSelectedStore desde getRecommendedProductsList');
      const tiendaSeleccionada = this.geolocationService.getSelectedStore();
      this.preferenciaCliente =
        this.customerPreferenceStorage.get() as IPreference;

      let listaSku: string[] = [];
      let rut = '';
      let localidad = '';
      console.log(this.items);
      this.items.forEach((item) => {
        console.log(item);
        listaSku.push(item.ProductCart.sku);
      });
      console.log(listaSku);
      if (this.user) {
        rut = this.user.documentId;
      }
      if (this.preferenciaCliente && this.preferenciaCliente.deliveryAddress)
        localidad = this.preferenciaCliente.deliveryAddress.city
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      this.articleService
        .getArticleSuggestions({
          skus: listaSku,
          documentId: rut,
          branchCode: tiendaSeleccionada.code,
          quantityToSuggest: 6,
        })
        .subscribe(
          (r: IArticleResponse[]) => {
            this.recommendedProducts = r;
          },
          (error) => {
            this.toast.error(
              'Error de conexión, para obtener los productos recomendados '
            );
          }
        );
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
}
