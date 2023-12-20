// Angular
import {
  Component,
  PLATFORM_ID,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// Libs
import { ToastrService } from 'ngx-toastr';
import { OwlOptions } from 'ngx-owl-carousel-o';
// Rxjs
import { Subscription, forkJoin } from 'rxjs';
// Envs
import { environment } from '@env/environment';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';
import { ICustomerPreference } from '@core/services-v2/customer-preference/models/customer-preference.interface';
import { IBreadcrumbItem } from './models/breadcrumb.interface';
import { ICategoryParams } from './models/category-params.interface';
import { Product, ProductOrigen } from '../../../../shared/interfaces/product';
// Services
import { RootService } from '../../../../shared/services/root.service';
import { SeoService } from '../../../../shared/services/seo.service';
import { CartService } from '../../../../shared/services/cart.service';
import { CanonicalService } from '../../../../shared/services/canonical.service';
import { BuscadorService } from '../../../../shared/services/buscador.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { SessionService } from '@core/states-v2/session.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { ArticleService } from '@core/services-v2/article.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { CustomerPreferencesStorageService } from '@core/storage/customer-preferences-storage.service';
import { CustomerPreferenceService } from '@core/services-v2/customer-preference/customer-preference.service';
// Pipes
import { CapitalizeFirstPipe } from '../../../../shared/pipes/capitalize.pipe';

import {
  CarouselDesktopOptions,
  CarouselMobileOptions,
} from './constants/carousel-config';

import { BreadcrumbUtils } from './services/breadcrumb-utils.service';

import {
  IAttributeCompared,
  IProductCompared,
} from '@core/services-v2/product/models/formatted-product-compare-response.interface';

declare const $: any;
declare let fbq: any;

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss'],
})
export class PageProductComponent implements OnInit, OnDestroy {
  product!: IArticleResponse | undefined | any;
  recommendedProducts: IArticleResponse[] = [];
  matrixProducts: IArticleResponse[] = [];
  relatedProducts: IArticleResponse[] = [];
  minItems = 5;
  stock: boolean = true;
  layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
  sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
  user: ISession;
  isB2B: boolean;
  origen: string[] = [];
  innerWidth: number;
  window = window;

  private paramsCategory!: ICategoryParams;
  breadcrumbs: IBreadcrumbItem[] = [];

  relleno: any[] = [1, 2, 3, 4, 5, 6];
  carouselOptions: OwlOptions;
  carrouselOptionsMobile: OwlOptions;

  acordion = [
    {
      abierto: false,
    },
    {
      abierto: false,
    },
    {
      abierto: false,
    },
  ];

  puntoQuiebre: number = 576;
  showMobile: boolean = false;
  matriz: IProductCompared[] = [];
  comparacion: IAttributeCompared[] = [];
  tiendaSeleccionada!: ISelectedStore;
  IVA = environment.IVA;
  addingToCart: boolean = false;
  addcartPromise!: Subscription;
  despachoCliente!: Subscription;
  preferenciaCliente!: ICustomerPreference;
  preciosNeto: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public root: RootService,
    private capitalize: CapitalizeFirstPipe,
    private seoService: SeoService,
    private cart: CartService,
    private canonicalService: CanonicalService,
    private buscadorService: BuscadorService,
    private logistic: LogisticsService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly articleService: ArticleService,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly customerPreferenceStorage: CustomerPreferencesStorageService,
    private readonly customerPreferenceService: CustomerPreferenceService
  ) {
    this.carouselOptions = CarouselDesktopOptions;
    this.carrouselOptionsMobile = CarouselMobileOptions;
    this.tiendaSeleccionada = this.geolocationService.getSelectedStore();
    this.preferenciaCliente = this.customerPreferenceStorage.get();

    this.onSelectedStoreChange();

    //cambio de dirección
    this.despachoCliente = this.logistic.direccionCliente$.subscribe((r) => {
      if (this.product) {
        this.preferenciaCliente.deliveryAddress = r;
        this.cart.cargarPrecioEnProducto(this.product);
        this.getMixProducts(this.product.sku);
      }
    });

    this.authStateService.session$.subscribe(() => {
      this.user = this.sessionService.getSession();
      this.customerPreferenceService.getCustomerPreferences().subscribe({
        next: (preferences) => {
          if (!this.product) return;

          this.preferenciaCliente = preferences;
          this.cart.cargarPrecioEnProducto(this.product);
          this.getMixProducts(this.product.sku);
        },
      });
    });

    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;

    this.user = this.sessionService.getSession();
    this.isB2B = this.sessionService.isB2B();

    this.route.data.subscribe((data: any) => {
      this.layout = 'layout' in data ? data.layout : this.layout;
      this.sidebarPosition =
        'sidebarPosition' in data
          ? data.sidebarPosition
          : this.sidebarPosition;
    });

    this.onRouteParamsChange();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.isMobile();
  }

  private onSelectedStoreChange(): void {
    this.geolocationService.selectedStore$.subscribe({
      next: (selectedStore) => {
        if (!this.product) return;

        this.tiendaSeleccionada = selectedStore;
        this.cart.cargarPrecioEnProducto(this.product);
        this.getMixProducts(this.product.sku);
      },
    });
  }

  private onRouteParamsChange(): void {
    this.route.params.subscribe((params) => {
      // Seteamos el origen del ingreso a la ficha del producto.
      const origenHistory = this.cart.getOrigenHistory();
      this.origen = origenHistory.length ? origenHistory : ['link', ''];

      this.root.hideModalRefBuscador();
      if (params['id']) {
        this.paramsCategory = {
          firstCategory: params['firstCategory'] || '',
          secondCategory: params['secondCategory'] || '',
          thirdCategory: params['thirdCategory'] || '',
        };
        const sku = params['id'].split('-').reverse()[0];
        this.getProductDetail(sku);
        this.getMixProducts(sku);
      } else {
        this.router.navigate(['/inicio/**']);
      }
    });
  }

  ngOnDestroy(): void {
    /*if (!this.buscadorService.isFiltroSeleccionado()) {
      this.buscadorService.filtrosVisibles(true);
    }*/
    this.buscadorService.filtrosVisibles(true);
    this.despachoCliente.unsubscribe();
  }

  ngOnInit(): void {
    this.isMobile();
    this.buscadorService.filtrosVisibles(false);
  }

  isMobile(): void {
    this.showMobile = window.innerWidth < this.puntoQuiebre;
  }

  /**
   * Obtener detalle del producto.
   */
  private getProductDetail(sku: string): void {
    const { documentId } = this.sessionService.getSession();
    const selectedStore = this.geolocationService.getSelectedStore();

    if (!selectedStore) {
      this.toastr.error(
        `Ha ocurrido un error al obtener información del producto.`
      );
      return;
    }

    this.articleService
      .getArticleDataSheet({
        sku,
        documentId,
        branchCode: selectedStore.code,
        location:
          this.preferenciaCliente?.deliveryAddress?.location ||
          selectedStore.city,
      })
      .subscribe((productDetail) => {
        if (!productDetail) {
          this.toastr.error(
            `Ha ocurrido un error al obtener información del producto.`
          );
          return;
        }
        // FIXME: corregir esto..
        // productDetail.chassis = productDetail.chassis || '';

        this.product = productDetail;
        this.stock = productDetail.stockSummary.companyStock > 0;
        this.setMetaTag(this.product);
        this.breadcrumbs = BreadcrumbUtils.setBreadcrumbs(
          this.paramsCategory,
          productDetail.name
        );
        // this.productFacebook(this.product);
      });
  }

  /**
   * Establecer metatag para funcionalidades de SEO.
   * @param product
   */
  setMetaTag(product: IArticle): void {
    const slug = this.root.product(product.sku, product.name);
    const image = product.images?.['250']?.length
      ? product.images['250'][0]
      : this.root.returnUrlNoImagen();

    const nombre = this.root.limpiarNombres(product.name);
    const descripcion = this.root.limpiarNombres(product.description);
    const descripcionFull = `${nombre} - ${descripcion}`;

    this.seoService.generarMetaTag({
      title: this.capitalize.transform(nombre),
      description: this.capitalize.transform(descripcionFull),
      image,
      imageAlt: 'La imagen contiene nuestro producto: ' + product.description,
      imageType: 'image/jpeg',
      type: 'product',
      keywords: descripcionFull,
      slug,
    });

    if (isPlatformBrowser(this.platformId)) {
      this.canonicalService.setCanonicalURL(location.href);
    }

    if (isPlatformServer(this.platformId)) {
      this.canonicalService.setCanonicalURL(
        environment.canonical + this.router.url
      );
    }
  }

  // activar view content para el producto de facebook
  productFacebook(product: Product): void {
    fbq('track', 'ViewContent', {
      brand: product.marca,
      id: product.sku,
      content_ids: product.sku,
      content_name: this.capitalize.transform(product.nombre),
      content_type: 'product',
      value: product.precioCliente,
      currency: 'CLP',
    });
  }

  getMixProducts(sku: string): void {
    const selectedStore = this.geolocationService.getSelectedStore();

    const params = {
      sku,
      documentId: this.user.documentId,
      branchCode: selectedStore.code,
      location: this.preferenciaCliente?.deliveryAddress?.location || '',
    };

    forkJoin([
      this.articleService.getArticleMatrix(params),
      this.articleService.getRelatedBySku(params),
      this.articleService.getProductCompareMatrix(params),
      this.articleService.getRecommendedProducts({
        ...params,
        quantityToSuggest: 10,
      }),
    ]).subscribe(
      ([
        matrixProducts,
        relatedProducts,
        comparedProducts,
        recommendedProducts,
      ]) => {
        this.matrixProducts = matrixProducts;
        this.relatedProducts = relatedProducts;
        this.recommendedProducts = recommendedProducts;
        this.matriz = comparedProducts.products;
        this.comparacion = comparedProducts.differences;
      }
    );
  }

  abrirTabEvaluacion(): void {
    $('#descripcion-tab').removeClass('active');
    $('#detallesTecnicos-tab').removeClass('active');
    $('#evaluacion-tab').addClass('active');

    $('#descripcion').removeClass('active show');
    $('#detallesTecnicos').removeClass('active show');
    $('#evaluacion').addClass('active show');

    $('#evaluacion').tab('show');
    document.querySelector('#ancla')?.scrollIntoView();
  }

  //Funciones para matriz comparativa
  async obtienePrecioxCantidad(producto: any, tipo: any = null) {
    if (tipo == '+') {
      producto.cantidad = producto.cantidad + 1;
    } else if (tipo == '-') {
      producto.cantidad = producto.cantidad - 1;
    }
    if (producto.cantidad == 0) {
      producto.cantidad = 1;
      return;
    }
    let rut = '0';

    if (this.user != null) {
      rut = this.user.documentId || '0';
    }
    const parametrosPrecios = {
      sku: producto.sku,
      sucursal: this.tiendaSeleccionada.code,
      rut,
      cantidad: producto.cantidad,
    };
    const datos: any = await this.cart
      .getPriceProduct(parametrosPrecios)
      .toPromise();
    if (datos['precio_escala']) {
      producto.precioComun = !isVacio(this.user?.preferences.iva)
        ? this.user?.preferences.iva
          ? datos['precioComun']
          : datos['precioComun'] / (1 + this.IVA)
        : datos['precioComun'];
      producto.precio.precio = !isVacio(this.user?.preferences.iva)
        ? this.user?.preferences.iva
          ? datos['precio'].precio
          : datos['precio'].precio / (1 + this.IVA)
        : datos['precio'].precio;
    }
  }

  agregarProductoMatriz(producto: any) {
    if (!this.user) {
      this.toastr.warning(
        'Debe iniciar sesion para poder comprar',
        'Información'
      );
      return;
    }
    if (!this.addingToCart && producto && producto.cantidad > 0) {
      if (this.product) {
        this.product.origen = {} as ProductOrigen;

        if (this.origen) {
          this.product.origen.origen = this.origen[0] ? this.origen[0] : '';
          this.product.origen.subOrigen = this.origen[1] ? this.origen[1] : '';
          this.product.origen.seccion = this.origen[2] ? this.origen[2] : '';
          this.product.origen.recomendado = this.origen[3]
            ? this.origen[3]
            : '';
          this.product.origen.ficha = true;
          this.product.origen.cyber = this.product?.cyber
            ? this.product.cyber
            : 0;
        }

        this.addingToCart = true;
        //*moment
        // this.addcartPromise = this.cart
        //   .add(producto, producto.cantidad)
        //   .subscribe(
        //     (r) => {},
        //     (e) => {
        //       this.toastr.warning(
        //         'Ha ocurrido un error en el proceso',
        //         'Información'
        //       );
        //       this.addingToCart = false;
        //     },
        //     () => {
        //       this.addingToCart = false;
        //     }
        //   );
      }
    }
  }
}
