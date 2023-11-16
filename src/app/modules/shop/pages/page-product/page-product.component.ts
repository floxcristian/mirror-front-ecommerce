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
import { Usuario } from '../../../../shared/interfaces/login';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { SeoService } from '../../../../shared/services/seo.service';
import { CartService } from '../../../../shared/services/cart.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { GeoLocation } from '../../../../shared/interfaces/geo-location';
import { CanonicalService } from '../../../../shared/services/canonical.service';
import { environment } from '@env/environment';
import { BuscadorService } from '../../../../shared/services/buscador.service';
import { Subscription, forkJoin } from 'rxjs';
import { randomElements } from '../../../../shared/utils/utilidades';
import { CatalogoService } from '../../../../shared/services/catalogo.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { LoginService } from '../../../../shared/services/login.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
declare const $: any;
declare let fbq: any;

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss'],
})
export class PageProductComponent implements OnInit, OnDestroy {
  categories = categories;
  product!: Product | undefined;
  recommendedProducts: Product[] = [];
  matrixProducts: Product[] = [];
  relatedProducts: Product[] = [];
  // popularProducts: Product[] = [];
  mixProducts: Product[] = [];
  minItems = 5;
  stock: boolean = true;
  layout: 'standard' | 'columnar' | 'sidebar' = 'standard';
  sidebarPosition: 'start' | 'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
  user: Usuario;
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
  tiendaSeleccionada: any;
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
    private productoService: ProductsService,
    private toastr: ToastrService,
    public root: RootService,
    private capitalize: CapitalizeFirstPipe,
    private seoService: SeoService,
    private cart: CartService,
    private geoLocationService: GeoLocationService,
    private canonicalService: CanonicalService,
    private buscadorService: BuscadorService,
    private catalogoService: CatalogoService,
    private logistic: LogisticsService,
    private loginService: LoginService,
    private localS: LocalStorageService
  ) {
    this.tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    this.preferenciaCliente = this.localS.get('preferenciasCliente');
    // cambio de sucursal
    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      if (this.product) {
        this.tiendaSeleccionada = r.tiendaSelecciona;
        this.cart.cargarPrecioEnProducto(this.product);
        this.getMixProducts(this.product.sku);
        // this.getMatrixProducts(this.product.sku);
      }
    });
    //cambio de dirección
    this.despachoCliente = this.logistic.direccionCliente$.subscribe((r) => {
      if (this.product) {
        this.preferenciaCliente.direccionDespacho = r;
        this.cart.cargarPrecioEnProducto(this.product);
        this.getMixProducts(this.product.sku);
      }
    });

    //Cuando se inicia sesión
    this.loginService.loginSessionObs$.pipe().subscribe((usuario: Usuario) => {
      this.user = this.root.getDataSesionUsuario();
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

    this.user = this.root.getDataSesionUsuario();
    this.isB2B =
      this.user.user_role === 'supervisor' ||
      this.user.user_role === 'comprador';

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
        this.getDetailProduct(sku);
        this.getMixProducts(sku);
        // this.getMatrixProducts(sku);
        this.productoService.getStockProduct(sku).subscribe((r: any) => {
          let stockTienda = 0;
          r.map(async (stock: any) => {
            stockTienda += stock.cantidad;
          });
          stockTienda > 0 ? (this.stock = true) : (this.stock = false);
        });
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

  setBreadcrumbs(product: any) {
    this.breadcrumbs = [];
    this.breadcrumbs.push({ label: 'Inicio', url: ['/', 'inicio'] });
    if (this.paramsCategory.firstCategory !== '') {
      const cat = this.root.replaceAll(
        this.paramsCategory.firstCategory,
        /-/g
      );
      // tslint:disable-next-line: max-line-length
      this.breadcrumbs.push({
        label: this.capitalize.transform(cat),
        url: [
          '/',
          'inicio',
          'productos',
          'todos',
          'categoria',
          this.paramsCategory.firstCategory,
        ],
      });
    }

    if (this.paramsCategory.secondCategory !== '') {
      const cat = this.root.replaceAll(
        this.paramsCategory.secondCategory,
        /-/g
      );
      // tslint:disable-next-line: max-line-length
      this.breadcrumbs.push({
        label: this.capitalize.transform(cat),
        url: [
          '/',
          'inicio',
          'productos',
          'todos',
          'categoria',
          this.paramsCategory.firstCategory,
          this.paramsCategory.secondCategory,
        ],
      });
    }

    if (this.paramsCategory.thirdCategory !== '') {
      const cat = this.root.replaceAll(
        this.paramsCategory.thirdCategory,
        /-/g
      );
      // tslint:disable-next-line: max-line-length
      this.breadcrumbs.push({
        label: this.capitalize.transform(cat),
        url: [
          '/',
          'inicio',
          'productos',
          'todos',
          'categoria',
          this.paramsCategory.firstCategory,
          this.paramsCategory.secondCategory,
          this.paramsCategory.thirdCategory,
        ],
      });
    }

    this.breadcrumbs.push({
      label: this.capitalize.transform(product.nombre),
      url: '',
    });
  }

  getDetailProduct(sku: any) {
    let params = null;
    const usuario = this.root.getDataSesionUsuario();

    if (usuario != null) {
      params = {
        rut: usuario.rut,
      };
    }

    this.productoService.obtieneDetalleProducto(sku, params).subscribe(
      (r: any) => {
        r.data.chassis == null || r.data.chassis == undefined
          ? (r.data.chassis = '')
          : r.data.chassis;
        const producto: any = r.data;
        delete producto?.precio;

        this.product = { ...producto };

        if (this.product) {
          this.cart.cargarPrecioEnProducto(this.product);
          this.setMeta(this.product);
          this.productFacebook(this.product);
          this.setBreadcrumbs(this.product);
        }
      },
      (error) => {
        this.toastr.error('Error de conexión, para obtener los articulos');
      }
    );
  }

  setMeta(product: Product) {
    const slug = this.root.product(product.sku, product.nombre);
    const imagen =
      typeof product.images === 'undefined' || product.images.length == 0
        ? this.root.returnUrlNoImagen()
        : product.images[0]['250'][0];

    const nombre = this.root.limpiarNombres(product.nombre);
    const descripcion = this.root.limpiarNombres(product.descripcion);
    const descripcionFull = `${nombre} - ${descripcion}`;

    const meta = {
      title: this.capitalize.transform(nombre),
      description: this.capitalize.transform(descripcionFull),
      image: imagen,
      imageAlt: 'La imagen contiene nuestro producto: ' + product.descripcion,
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
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const obj = {
      sku,
      rut: '',
      sucursal: tiendaSeleccionada?.codigo,
      localidad: '',
    };
    const obj1 = {
      listaSku: [sku],
      rut: '',
      sucursal: tiendaSeleccionada?.codigo,
      cantidad: 10,
      localidad: '',
    };
    let rut: string = '0';
    if (this.user != null) {
      obj.rut = this.user.rut || '0';
      obj1.rut = this.user.rut || '0';
      rut = this.user.rut || '0';
    }
    if (this.preferenciaCliente && this.preferenciaCliente.direccionDespacho) {
      obj.localidad = this.preferenciaCliente.direccionDespacho.comuna
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      obj1.localidad = this.preferenciaCliente.direccionDespacho.comuna
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
    forkJoin([
      this.productoService.getMatrixProducts(obj),
      this.productoService.getRelatedProducts(obj),
      this.productoService.getRecommendedProductsList(obj1),
      this.catalogoService.getComparacionMatriz(
        sku,
        rut,
        this.tiendaSeleccionada.codigo
      ),
    ]).subscribe((resp: any[]) => {
      this.matriz = [];
      this.comparacion = [];
      this.relatedProducts = resp[1].data;
      this.recommendedProducts = resp[2].data;
      this.matrixProducts = resp[0].data;
      this.matriz = resp[3].data;
      this.matriz.map((p) => (p.cantidad = 1));
      this.formateaComparacion(resp[3].comparacion);
    });
  }
  formateaComparacion(comparacion: any[]) {
    for (const element of comparacion) {
      const key = Object.keys(element);
      const obj = {
        nombre: key[0],
        valores: element[key[0]].map((x: any) => x.valor),
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
      rut = this.user.rut || '0';
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
      producto.precioComun = !isVacio(this.user.iva)
        ? this.user.iva
          ? datos['precioComun']
          : datos['precioComun'] / (1 + this.IVA)
        : datos['precioComun'];
      producto.precio.precio = !isVacio(this.user.iva)
        ? this.user.iva
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
    console.log('producto a agregar: ', producto);
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

        this.addcartPromise = this.cart
          .add(producto, producto.cantidad)
          .subscribe(
            (r) => {},
            (e) => {
              this.toastr.warning(
                'Ha ocurrido un error en el proceso',
                'Información'
              );
              this.addingToCart = false;
            },
            () => {
              this.addingToCart = false;
            }
          );
      }
    }
  }
}
