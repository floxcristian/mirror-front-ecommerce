import {
  Component,
  PLATFORM_ID,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Product, ProductPrecio } from '../../../../shared/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';
import { categories } from '../../../../../data/shop-widget-categories';
// import { map } from 'rxjs/operators';
import { ProductsService } from '../../../../shared/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../../../shared/services/root.service';
import { RouterExtService } from '../../../../shared/services/router.service';
import { CapitalizeFirstPipe } from '../../../../shared/pipes/capitalize.pipe';
import { Usuario } from '../../../../shared/interfaces/login';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { SeoService } from '../../../../shared/services/seo.service';
import { CartService } from '../../../../shared/services/cart.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { GeoLocation } from '../../../../shared/interfaces/geo-location';
import { CanonicalService } from '../../../../shared/services/canonical.service';
import { environment } from '../../../../../environments/environment';
import { BuscadorService } from '../../../../shared/services/buscador.service';
import { DirectionService } from '../../../../shared/services/direction.service';
import { forkJoin } from 'rxjs';
import { randomElements } from '../../../../shared/utils/utilidades';
declare const $: any;
declare let fbq: any;

@Component({
  selector: 'app-page-product',
  templateUrl: './page-product.component.html',
  styleUrls: ['./page-product.component.scss'],
})
export class PageProductComponent implements OnInit, OnDestroy {
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  // FIXME: START
  /*categories = categories;
  product!: Product;
  recommendedProducts: Product[] = [];
  matrixProducts: Product[] = [];
  relatedProducts: Product[] = [];
  popularProducts: Product[] = [];
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

  public paramsCategory = {
    firstCategory: '',
    secondCategory: '',
    thirdCategory: '',
  };
  breadcrumbs = [];

  relleno: any[] = [1, 2, 3, 4];
  carouselOptions = {
    items: 4,
    nav: true,
    navText: [
      `<i class="fas fa-chevron-left"></i>`,
      `<i class="fas fa-chevron-right"></i>`,
    ],
    dots: true,
    slideBy: 'page',
    // loop: true,
    responsive: {
      1366: { items: 4 },
      1100: { items: 4 },
      920: { items: 4 },
      680: { items: 3 },
      500: { items: 3 },
      0: { items: 2 },
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductsService,
    private toastr: ToastrService,
    private root: RootService,
    private capitalize: CapitalizeFirstPipe,
    private seoService: SeoService,
    private cart: CartService,
    private geoLocationService: GeoLocationService,
    private canonicalService: CanonicalService,
    private buscadorService: BuscadorService,
    private direction: DirectionService
  ) {
    // cambio de sucursal
    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      this.cart.cargarPrecioEnProducto(this.product);
      this.getMixProducts(this.product.sku);
      this.getMatrixProducts(this.product.sku);
    });

    this.innerWidth = window.innerWidth;

    this.user = this.root.getDataSesionUsuario();
    this.isB2B =
      this.user.user_role === 'supervisor' ||
      this.user.user_role === 'comprador';

    this.route.data.subscribe((data) => {
      this.layout = 'layout' in data ? data.layout : this.layout;
      this.sidebarPosition =
        'sidebarPosition' in data ? data.sidebarPosition : this.sidebarPosition;
    });

    this.route.params.subscribe((params) => {
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
        console.log(sku);
        this.getDetailProduct(sku);
        //this.getRecommendedProducts(sku);
        this.getMixProducts(sku);
        // this.getSuggestedProductos(sku);
        this.getMatrixProducts(sku);
        // this.getRelatedProducts(sku);
        // this.getPopularProducts(sku);
        this.productoService.getStockProduct(sku).subscribe((r: any) => {
          let stockTienda = 0;
          r.map(async (stock) => {
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
    if (!this.buscadorService.isFiltroSeleccionado()) {
      this.buscadorService.filtrosVisibles(true);
    }
  }

  ngOnInit(): void {
    this.buscadorService.filtrosVisibles(false);
  }

  setBreadcrumbs(product) {
    this.breadcrumbs = [];
    this.breadcrumbs.push({ label: 'Inicio', url: ['/', 'inicio'] });
    if (this.paramsCategory.firstCategory !== '') {
      const cat = this.root.replaceAll(this.paramsCategory.firstCategory, /-/g);
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
      const cat = this.root.replaceAll(this.paramsCategory.thirdCategory, /-/g);
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

  getDetailProduct(sku) {
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
        const producto: Product = r.data;
        delete producto.precio;

        this.product = { ...producto };

        this.cart.cargarPrecioEnProducto(this.product);

        this.setMeta(this.product);
        console.log(this.product);
        this.productFacebook(this.product);
        this.setBreadcrumbs(this.product);
        // this.root.limpiaAtributos(this.product);
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

    // console.log(product);

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

  getSuggestedProductos(sku) {
    let obj = {
      listaSku: [sku],
      rut: '',
      cantidad: 10,
    };
    if (this.user != null) {
      obj.rut = this.user.rut;
    }
  }

  getMatrixProducts(sku) {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    let obj = {
      sku,
      rut: '',
      sucursal: tiendaSeleccionada.codigo,
    };

    if (this.user != null) {
      obj.rut = this.user.rut;
    }

    this.productoService.getMatrixProducts(obj).subscribe(
      (r: ResponseApi) => {
        this.matrixProducts = r.data;
      },
      (error) => {
        this.toastr.error(
          'Error de conexión, para obtener los productos recomendados '
        );
      }
    );
  }

  getRelatedProducts(sku) {
    let obj = {
      sku,
      rut: '',
    };

    if (this.user != null) {
      obj.rut = this.user.rut;
    }

    this.productoService.getRelatedProducts(obj).subscribe(
      (r: ResponseApi) => {
        this.relatedProducts = r.data;
      },
      (error) => {
        this.toastr.error(
          'Error de conexión, para obtener los productos recomendados '
        );
      }
    );
  }

  getPopularProducts(sku) {
    this.productoService.getPropularProducts({ sku }).subscribe(
      (r: ResponseApi) => {
        //console.log(r);
        this.popularProducts = r.data;
      },
      (e) => {
        this.toastr.error(
          'Error en la conexion para obtener productos populares: ' + e
        );
      }
    );
  }

  getMixProducts(sku) {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    const obj = {
      sku,
      rut: '',
      sucursal: tiendaSeleccionada.codigo,
    };

    const obj1 = {
      listaSku: [sku],
      rut: '',
      sucursal: tiendaSeleccionada.codigo,
      cantidad: 10,
    };

    if (this.user != null) {
      obj.rut = this.user.rut;
      obj1.rut = this.user.rut;
    }

    forkJoin([
      this.productoService.getMatrixProducts(obj),
      this.productoService.getRelatedProducts(obj),
      this.productoService.getRecommendedProductsList(obj1),
    ]).subscribe((resp: any[]) => {
      this.mixProducts = [];
      if (!this.isB2B) {
        resp[0].data.forEach((e: Product) => this.mixProducts.push(e));
      }
      randomElements(resp[1].data, 5).forEach((e: Product) =>
        this.mixProducts.push(e)
      );
      randomElements(resp[2].data, 5).forEach((e: Product) =>
        this.mixProducts.push(e)
      );
    });
  }

  abrirTabEvaluacion() {
    $('#descripcion-tab').removeClass('active');
    $('#detallesTecnicos-tab').removeClass('active');
    $('#evaluacion-tab').addClass('active');

    $('#descripcion').removeClass('active show');
    $('#detallesTecnicos').removeClass('active show');
    $('#evaluacion').addClass('active show');

    $('#evaluacion').tab('show');
    document.querySelector('#ancla').scrollIntoView();
  }
  over(event) {
    let el: any = event.target.parentNode;
    let clase: any = el.classList;
    while (!clase.contains('owl-item')) {
      el = el.parentNode;
      clase = el.classList;
    }

    el.style['box-shadow'] = '0 4px 4px 0 rgb(0 0 0 / 50%)';
  }

  leave(event) {
    let el: any = event.target.parentNode;
    let clase: any = el.classList;
    while (!clase.contains('owl-item')) {
      el = el.parentNode;
      clase = el.classList;
    }

    el.style['box-shadow'] = 'none';
  }
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
  }

  controlaChevron(indice: number) {
    const control = this.acordion[indice].abierto;
    this.acordion.forEach((a) => (a.abierto = false));
    if (control) {
      this.acordion[indice].abierto = false;
    } else {
      this.acordion[indice].abierto = true;
    }
  }*/
  // FIXME: END
}
