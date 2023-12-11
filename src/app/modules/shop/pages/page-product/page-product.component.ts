import {
  Component,
  PLATFORM_ID,
  Inject,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Product,
  ProductOrigen,
  ProductPrecio,
} from '../../../../shared/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { categories } from '../../../../../data/shop-widget-categories';
import { ProductsService } from '../../../../shared/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../../../shared/services/root.service';
import { CapitalizeFirstPipe } from '../../../../shared/pipes/capitalize.pipe';

import { SeoService } from '../../../../shared/services/seo.service';
import { CartService } from '../../../../shared/services/cart.service';
import { CanonicalService } from '../../../../shared/services/canonical.service';
import { environment } from '@env/environment';
import { BuscadorService } from '../../../../shared/services/buscador.service';
import { Subscription, forkJoin } from 'rxjs';
import { randomElements } from '../../../../shared/utils/utilidades';
import { CatalogoService } from '../../../../shared/services/catalogo.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from '@core/states-v2/session.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { ArticleService } from '@core/services-v2/article.service';
import { IArticleResponse } from '@core/models-v2/article/article-response.interface';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ITiendaLocation } from '@core/services-v2/geolocation/models/geolocation.interface';
import { IArticle } from '@core/models-v2/cms/special-reponse.interface';
declare const $: any;
declare let fbq: any;

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss'],
})
export class PageProductComponent implements OnInit, OnDestroy {
  //TODO: FINAL
  categories = categories;
  product!: IArticleResponse | undefined | any;
  recommendedProducts: IArticleResponse[] = [];
  matrixProducts: IArticleResponse[] = [];
  relatedProducts: IArticleResponse[] = [];
  // popularProducts: Product[] = [];
  //mixProducts: IArticleResponse[] = [];
  minItems = 5;
  stock: boolean = true;
  layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
  sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
  user: ISession;
  isB2B: boolean;
  origen: string[] = [];
  innerWidth: number;
  window = window;

  paramsCategory = {
    firstCategory: '',
    secondCategory: '',
    thirdCategory: '',
  };
  breadcrumbs: any[] = [];

  relleno: any[] = [1, 2, 3, 4, 5, 6];
  carouselOptions = {
    items: 6,
    nav: true,
    navText: [
      `<i class="fas fa-chevron-left"></i>`,
      `<i class="fas fa-chevron-right"></i>`,
    ],
    dots: true,
    slideBy: 'page',
    responsive: {
      1366: { items: 6 },
      1100: { items: 6 },
      920: { items: 6 },
      680: { items: 3 },
      500: { items: 3 },
      0: { items: 2 },
    },
  };

  carrouselOptionsMobile = {
    items: 6,
    nav: false,
    dots: true,
    slideBy: 'page',
    //loop: true,
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
  matriz: any[] = [];
  comparacion: any[] = [];
  tiendaSeleccionada!: ITiendaLocation;
  IVA = environment.IVA || 0.19;
  addingToCart: boolean = false;
  addcartPromise!: Subscription;
  despachoCliente!: Subscription;
  preferenciaCliente: any;
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
    private catalogoService: CatalogoService,
    private logistic: LogisticsService,
    private localS: LocalStorageService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly articleService: ArticleService,
    private readonly geolocationService: GeolocationServiceV2
  ) {
    this.tiendaSeleccionada = this.geolocationService.getSelectedStore();
    this.preferenciaCliente = this.localS.get('preferenciasCliente');
    // cambio de sucursal
    this.geolocationService.location$.subscribe({
      next: (res) => {
        if (this.product) {
          this.tiendaSeleccionada = res.tiendaSelecciona;
          this.cart.cargarPrecioEnProducto(this.product);
          this.getMixProducts(this.product.sku);
          // this.getMatrixProducts(this.product.sku);
        }
      },
    });

    //cambio de dirección
    this.despachoCliente = this.logistic.direccionCliente$.subscribe((r) => {
      if (this.product) {
        this.preferenciaCliente.direccionDespacho = r;
        this.cart.cargarPrecioEnProducto(this.product);
        this.getMixProducts(this.product.sku);
      }
    });

    this.authStateService.session$.subscribe((user) => {
      this.user = this.sessionService.getSession();
      this.root.getPreferenciasCliente().then((preferencias) => {
        if (this.product) {
          this.preferenciaCliente = preferencias;
          this.cart.cargarPrecioEnProducto(this.product);
          this.getMixProducts(this.product.sku);
        }
      });
    });

    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;

    //this.user = this.root.getDataSesionUsuario();
    this.user = this.sessionService.getSession();
    this.isB2B = ['supervisor', 'comprador'].includes(
      this.user?.userRole || ''
    );

    this.route.data.subscribe((data: any) => {
      this.layout = 'layout' in data ? data.layout : this.layout;
      this.sidebarPosition =
        'sidebarPosition' in data
          ? data.sidebarPosition
          : this.sidebarPosition;
    });

    this.route.params.subscribe((params: any) => {
      // Seteamos el origen del ingreso a la ficha del producto.
      let origenHistory: string[] = this.cart.getOrigenHistory();
      this.origen = origenHistory.length > 0 ? origenHistory : ['link', ''];

      this.root.hideModalRefBuscador();
      if (params.id && params.id !== 'undefined') {
        if (params.firstCategory) {
          this.paramsCategory.firstCategory = params.firstCategory;
        }

        if (params.secondCategory) {
          this.paramsCategory.secondCategory = params.secondCategory;
        }

        if (params.thirdCategory) {
          this.paramsCategory.thirdCategory = params.thirdCategory;
        }

        const sku = params.id.split('-').reverse()[0];
        // this.getDetailProduct(sku);
        this.getDetailArticle(sku);
        this.getMixProducts(sku);
        // this.getMatrixProducts(sku);
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

  @HostListener('window:resize', ['$event'])
  cambiaDimension(event: any) {
    this.isMobile();
  }

  isMobile() {
    this.showMobile = window.innerWidth < this.puntoQuiebre;
  }



  setBreadcrumbs(product: IArticle) {
    this.breadcrumbs = [];
    this.breadcrumbs.push({ label: 'Inicio', url: ['/', 'inicio'] });

    // Funcion auxiliar para agregar categorias al breadcrumb
    const addCategory = (category: string, path: string[]) => {
      if (category !== '') {
        const cat = this.root.replaceAll(category, /-/g);
        this.breadcrumbs.push({
          label: this.capitalize.transform(cat),
          url: ['/', 'inicio', 'productos', 'todos', 'categoria', ...path],
        });
      }
    };
    addCategory(this.paramsCategory.firstCategory, [this.paramsCategory.firstCategory]);
    addCategory(this.paramsCategory.secondCategory, [this.paramsCategory.firstCategory, this.paramsCategory.secondCategory]);
    addCategory(this.paramsCategory.thirdCategory, [this.paramsCategory.firstCategory, this.paramsCategory.secondCategory, this.paramsCategory.thirdCategory]);
    this.breadcrumbs.push({
      label: this.capitalize.transform(product.name),
      url: ''
    });
  }



  // TODO: confirmar nombre de la función

  getDetailArticle(sku: string): void {
    const user = this.sessionService.getSession();
    const selectedStore = this.geolocationService.getSelectedStore();

    if (user && selectedStore) {
      const params = {
        sku,
        documentId: user.documentId,
        branchCode: selectedStore.codigo,
        location: selectedStore.comuna,
      };

      if (this.preferenciaCliente.direccionDespacho !== null)
        params.location = this.preferenciaCliente.direccionDespacho.location
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

      this.articleService
        .getArticleDataSheet(params)
        .subscribe((response: any) => {
          if (response) {
            response.chassis = response.chassis || '';
            const product = response;
            this.product = { ...product };
            response.stockSummary.companyStock > 0
              ? (this.stock = true)
              : (this.stock = false);
            // TODO: probar funcion por funcion para ver si funciona
            this.setMeta(this.product);
            console.log('llego');

            this.setBreadcrumbs(this.product);
            // this.productFacebook(this.product);
          } else {
            this.toastr.error(
              'Connection error, unable to fetch the articles'
            );
          }
        });
    } else {
      console.error('User or store information is missing');
    }
  }



  setMeta(product: IArticle) {
    const slug = this.root.product(product.sku, product.name);
     const imagen = product.images && product.images['250'] && product.images['250'].length > 0
    ? product.images['250'][0]
    : this.root.returnUrlNoImagen();



    const nombre = this.root.limpiarNombres(product.name);
    const descripcion = this.root.limpiarNombres(product.description);
    const descripcionFull = `${nombre} - ${descripcion}`;

    const meta = {
      title: this.capitalize.transform(nombre),
      description: this.capitalize.transform(descripcionFull),
      image: imagen,
      imageAlt: 'La imagen contiene nuestro producto: ' + product.description,
      imageType: 'image/jpeg',
      type: 'product',
      keywords: descripcionFull,
      slug,
    };
    this.seoService.generarMetaTag(meta);

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
  productFacebook(product: Product) {
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

  getMixProducts(sku: any) {
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    let rut: string = '0';
    if (this.user) {
      rut = this.user.documentId || '0';
    }
    const obj4 = {
      sku: sku,
      documentId: this.user.documentId || '0',
      branchCode: tiendaSeleccionada?.codigo || 'SAN BRNRDO',
      location: this.preferenciaCliente.direccionDespacho?.comuna
        ? this.preferenciaCliente.direccionDespacho.comuna
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        : '',
    };
    forkJoin([
      this.articleService.getArticleMatrix(obj4),
      this.articleService.getRelatedBySku(obj4),
      this.articleService.getArticleSuggestionsBySku({
        ...obj4,
        quantityToSuggest: 10,
      }),

      this.articleService.getComparacionMatriz(obj4),
      // this.catalogoService.getComparacionMatriz(
      //   sku,
      //   rut,
      //   this.tiendaSeleccionada.codigo
      // ),
    ]).subscribe((resp: any[]) => {
      this.matriz = [];
      this.comparacion = [];
      this.relatedProducts = resp[1];
      this.recommendedProducts = resp[2];
      this.matrixProducts = resp[0];
      this.matriz = resp[3].articles;
      this.matriz.map((p) => (p.cantidad = 1));
      this.formateaComparacion(resp[3].comparison);
    });
  }
  formateaComparacion(comparacion: any[]) {
    for (const element of comparacion) {
      const key = Object.keys(element);
      const obj = {
        name: key[0],
        value: element[key[0]].map((x: any) => x.value),
      };
      this.comparacion.push(obj);
    }
  }

  abrirTabEvaluacion() {
    $('#descripcion-tab').removeClass('active');
    $('#detallesTecnicos-tab').removeClass('active');
    $('#evaluacion-tab').addClass('active');

    $('#descripcion').removeClass('active show');
    $('#detallesTecnicos').removeClass('active show');
    $('#evaluacion').addClass('active show');

    $('#evaluacion').tab('show');
    document.querySelector('#ancla')?.scrollIntoView();
  }
  over(event: any) {
    let el: any = event.target.parentNode;
    let clase: any = el.classList;
    while (!clase.contains('owl-item')) {
      el = el.parentNode;
      clase = el.classList;
    }

    el.style['box-shadow'] = '0 4px 4px 0 rgb(0 0 0 / 50%)';
  }

  leave(event: any) {
    let el: any = event.target.parentNode;
    let clase: any = el.classList;
    while (!clase.contains('owl-item')) {
      el = el.parentNode;
      clase = el.classList;
    }

    el.style['box-shadow'] = 'none';
  }

  controlaChevron(indice: number) {
    const control = this.acordion[indice].abierto;
    this.acordion.forEach((a) => (a.abierto = false));
    if (control) {
      this.acordion[indice].abierto = false;
    } else {
      this.acordion[indice].abierto = true;
    }
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
      sucursal: this.tiendaSeleccionada.codigo,
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
    if (this.user == null) {
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
