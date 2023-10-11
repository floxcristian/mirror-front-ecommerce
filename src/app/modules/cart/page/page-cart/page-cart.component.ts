import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { FormControl, Validators } from '@angular/forms';
import { ProductCart } from '../../../../shared/interfaces/cart-item';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../../shared/interfaces/login';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { Router } from '@angular/router';
import { Banner } from '../../../../shared/interfaces/banner';
import { CmsService } from '../../../../shared/services/cms.service';
import { HostListener } from '@angular/core';
import { Product } from '../../../../shared/interfaces/product';
import { ProductsService } from '../../../../shared/services/products.service';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { DirectionService } from '../../../../shared/services/direction.service';
import { environment } from '@env/environment';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

interface Item {
  ProductCart: ProductCart;
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

  removedItems: ProductCart[] = [];
  items: any[] = []; //Item[] = [];
  updating = false;
  saveTimer: any;
  innerWidth: number;
  banners: Banner[] = [];
  paso1!: boolean;
  showresumen = false;
  IVA = environment.IVA || 0.19;
  isVacio = isVacio;

  recommendedProducts: Product[] = [];
  user!: Usuario;
  isB2B!: boolean;
  SumaTotal = 0;
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    responsive: {
      1100: { items: 5 },
      920: { items: 5 },
      680: { items: 3 },
      500: { items: 2 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  };

  constructor(
    private router: Router,
    public root: RootService,
    public cart: CartService,
    private toast: ToastrService,
    private localS: LocalStorageService,
    private geoLocationService: GeoLocationService,
    private cmsService: CmsService,
    private productoService: ProductsService,
    private direction: DirectionService, // @Inject(WINDOW) private window: Window
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly gtmService: GoogleTagManagerService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  ngOnInit(): void {
    const _this = this;
    this.user = this.root.getDataSesionUsuario();
    this.cart.items$
      .pipe(
        takeUntil(this.destroy$),
        map((ProductCarts) =>
          (ProductCarts || []).map((item) => {
            return {
              ProductCart: item,
              quantity: item.cantidad,
              quantityControl: new FormControl(
                item.cantidad,
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

    _this.cart.calc(true);
    setTimeout(() => {
      this.cart.dropCartActive$.next(false);
    });
    if (['supervisor', 'comprador'].includes(this.user.user_role || '')) {
      this.gtmService.pushTag({
        event: 'cart',
        pagePath: window.location.href,
      });
    }
    this.isB2B = ['supervisor', 'comprador'].includes(
      this.user.user_role || ''
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    setTimeout(() => {
      this.cart.dropCartActive$.next(true);
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

    const productos: ProductCart[] = [];
    this.items.map((r) => {
      productos.push(r.ProductCart);
    });

    this.cart.saveCart(productos).subscribe((r) => {
      for (const el of r.data.productos) {
        if (el.sku == item.ProductCart.sku) {
          item.ProductCart.conflictoEntrega = el.conflictoEntrega;
          item.ProductCart.entregas = el.entregas;
          item.ProductCart.precio = el.precio;
        }
      }
      this.cart.updateCart(productos);
    });
  }

  remove(item: ProductCart): void {
    this.cart.remove(item).subscribe((r) => {});
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
      this.cart.saveCart(productos).subscribe((r) => {});
    }, 1000);
  }

  limpiarInvitado() {
    this.localS.remove('invitado');
  }

  async setSaveCart() {
    let cartSession: any = this.localS.get('carroCompraB2B');

    let objeto = {
      id: cartSession._id,
      estado: 'guardado',
    };

    let respuesta: any = await this.cart.setSaveCart(objeto).toPromise();
    this.cart.load();
    if (!respuesta.error) {
      this.toast.success('Carro guardado exitosamente');
      this.router.navigate(['/', 'inicio']);
    }
  }

  getRecommendedProductsList() {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    let obj: any = {
      listaSku: [],
      rut: '',
      cantidad: 6,
      sucursal: tiendaSeleccionada?.codigo,
    };

    for (let i in this.items) {
      let item = this.items[i];
      obj.listaSku.push(item.ProductCart.sku);
    }

    if (this.user != null) {
      obj.rut = this.user.rut;
    }
    this.productoService.getRecommendedProductsList(obj).subscribe(
      (r: ResponseApi) => {
        this.recommendedProducts = r.data;
      },
      (error) => {
        this.toast.error(
          'Error de conexión, para obtener los productos recomendados '
        );
      }
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }
}
