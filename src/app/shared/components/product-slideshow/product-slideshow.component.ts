import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../services/root.service';
import { DirectionService } from '../../services/direction.service';
// import { OwlOptions } from 'ngx-owl-carousel-o';
import { ClientsService } from '../../services/clients.service';

import { Lista } from '../../interfaces/articuloFavorito';
import { AgregarListaProductosMasivaModalComponent } from '../agregar-lista-productos-masiva-modal/agregar-lista-productos-masiva-modal.component';
import { PreferenciasCliente } from '../../interfaces/preferenciasCliente';
import { Subscription } from 'rxjs';
import { LogisticsService } from '../../services/logistics.service';
import { isVacio } from '../../utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { CmsService } from '@core/services-v2/cms.service';
import { IData } from '@core/models-v2/cms/customHomePage-response.interface';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { IGeolocation } from '@core/services-v2/geolocation/models/geolocation.interface';
import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';

@Component({
  selector: 'app-product-slideshow',
  templateUrl: './product-slideshow.component.html',
  styleUrls: ['./product-slideshow.component.scss'],
})
export class ProductSlideshowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  user!: ISession | null;
  isB2B!: boolean;
  cargando: boolean = true;
  lstProductos: IData[] = [];
  relleno: any[] = [1, 2, 3, 4, 5];
  ruta: string = '';
  preferenciasCliente!: PreferenciasCliente;
  despachoCliente!: Subscription;
  layout = 'grid-lg';
  window = window;
  innerWidth: number;
  carouselOptions = {
    items: 5,
    nav: true,
    navText: [
      `<div class="m-arrow__container" ><i class="fa-regular fa-chevron-left"></i></div>`,
      `<div class="m-arrow__container"><i class="fa-regular fa-chevron-right"></i></div>`,
    ],
    slideBy: 'page',
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

  // carouselOptionsB2B = {
  //   items: 5,
  //   nav: true,
  //   navText: [
  //     `<div class="m-arrow__container" ><i class="fa-regular fa-chevron-left"></i></div>`,
  //     `<div class="m-arrow__container"><i class="fa-regular fa-chevron-right"></i></div>`,
  //   ],
  //   dots: true,
  //   slideBy: 'page',
  //   responsiveClass: true,
  //   responsive: {
  //     1100: { items: 5 },
  //     920: { items: 5 },
  //     768: { items: 3 },
  //     680: { items: 3 },
  //     500: { items: 3 },
  //     0: { items: 2 },
  //   },
  //   rtl: this.direction.isRTL(),
  // };

  // carouselOptionsB2BLista = {
  //   items: 5,
  //   nav: true,
  //   navText: [
  //     `<i class="fas fa-angle-left fa-1x" style="color: #000;"></i>`,
  //     `<i class="fas fa-angle-right fa-1x" style="color: #000;"></i>`,
  //   ],
  //   dots: true,
  //   slideBy: 'page',
  //   // loop: true,
  //   responsive: {
  //     1366: { items: 5 },
  //     1100: { items: 4 },
  //     920: { items: 4 },
  //     680: { items: 2 },
  //     500: { items: 1 },
  //     0: { items: 1 },
  //   },
  //   rtl: this.direction.isRTL(),
  // };

  constructor(
    private root: RootService,
    private productsService: ProductsService,
    // @Inject(WINDOW) private window: Window,
    public toast: ToastrService,
    private direction: DirectionService,
    private localStorage: LocalStorageService,
    private router: Router,
    private clientsService: ClientsService,
    private logisticsService: LogisticsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly cmsService: CmsService,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly geolocationStorage: GeolocationStorageService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  sidebarPosition: 'start' | 'end' = 'start';

  ngOnInit() {
    this.ruta = this.router.url === '/inicio' ? 'home' : this.router.url;
    this.user = this.sessionService.getSession();
    this.isB2B = this.sessionService.isB2B();
  }

  ngAfterViewInit() {
    const geo = this.geolocationStorage.get();
    if (geo && this.preferenciasCliente === undefined) {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarHome();
      });
    }

    this.geolocationService.location$.subscribe({
      next: (res) => {
        this.root.getPreferenciasCliente().then((preferencias) => {
          this.preferenciasCliente = preferencias;
          this.cargarHome();
        });
      },
    });

    this.despachoCliente = this.logisticsService.direccionCliente$.subscribe(
      async (r) => {
        this.root.getPreferenciasCliente().then((preferencias) => {
          this.preferenciasCliente = preferencias;
          this.cargarHome();
        });
      }
    );

    // cuando se inicia sesion
    this.authStateService.session$.subscribe((user) => {
      this.user = user;
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarHome();
      });
    });
  }

  ngOnDestroy(): void {
    if (!isVacio(this.despachoCliente)) {
      this.despachoCliente.unsubscribe();
    }
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  // getCantSlides(tipo: string = '') {
  //   if (this.innerWidth > 1366) {
  //     return 5;
  //   }
  //   if (this.innerWidth > 1100) {
  //     return tipo === 'lista' ? 4 : 5;
  //   }
  //   if (this.innerWidth > 920) {
  //     return tipo === 'lista' ? 2 : 3;
  //   }
  //   if (this.innerWidth > 680) {
  //     return tipo === 'lista' ? 1 : 2;
  //   }
  //   if (this.innerWidth > 500) {
  //     return tipo === 'lista' ? 1 : 2;
  //   }
  //   return 1;
  // }

  cargarHome() {
    this.cargando = true;
    const rut = this.user?.documentId || '0';
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    const sucursal = tiendaSeleccionada.codigo;
    const localidad = !isVacio(this.preferenciasCliente.direccionDespacho)
      ? this.preferenciasCliente.direccionDespacho?.city
      : '';
    let localidad_limpia =
      localidad?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
    if (this.user?.documentId !== '0') {
      this.lstProductos = [];
      this.cmsService
        .getCustomHomePage(rut, sucursal, localidad_limpia)
        .subscribe({
          next: (res) => {
            // this.lstProductos = res.data;
            this.lstProductos = this.quitarElementos(res.data);
            this.cargando = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
      // this.productsService.getHomePageB2c(params).subscribe((r: any) => {
      //   this.url = r.urls;
      //   this.lstProductos = r.data;
      //   this.cargando = false;
      // });
    } else {
      this.cargando = false;
    }
    // if (this.user?.documentId !== '0' && !this.isB2B) {
    //   this.url = [];
    //   this.lstProductos = [];
    //   this.productsService.getHomePageB2c(params).subscribe((r: any) => {
    //     this.url = r.urls;
    //     this.lstProductos = r.data;
    //     this.cargando = false;
    //   });
    // } else if (this.user?.documentId !== '0' && this.isB2B) {
    //   this.url = [];
    //   this.lstProductos = [];
    //   this.productsService.getHomePageB2b(params).subscribe((r: any) => {
    //     this.lstProductos = this.quitarElementos(r.data);
    //     this.url = r.urls;
    //     this.cargando = false;
    //   });
    // } else {
    //   this.cargando = false;
    // }
  }

  quitarElementos(data: any) {
    let lst_limpios: any[] = [];
    let valores = ['Mis productos recurrentes', 'últimos productos vistos'];
    data.forEach((element: any) => {
      if (!valores.includes(element.title)) lst_limpios.push(element);
    });
    return lst_limpios;
  }

  // cargarListas() {
  //   this.listas = [];
  //   this.clientsService
  //     .getListaArticulosFavoritos(this.user?.documentId || '')
  //     .subscribe((resp: ResponseApi) => {
  //       if (resp.data.length > 0) {
  //         if (resp.data[0].listas.length > 0) {
  //           this.listas = resp.data[0].listas;
  //           const detalleSkus = resp.data[0].detalleSkus;
  //           this.listas = this.listas.map((list) => {
  //             const products: any[] = [];
  //             list.skus.forEach((p) => {
  //               const detalle = detalleSkus.find((dp: any) => dp.sku === p);
  //               products.push(detalle);
  //             });
  //             list.detalleSkus = products;
  //             return list;
  //           });
  //         }
  //       }
  //     });
  // }

  delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // getLink(texto: any) {
  //   return texto.trim().replace(/ /g, '-');
  // }
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
}
