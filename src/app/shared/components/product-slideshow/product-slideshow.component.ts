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
// import { WINDOW } from '@ng-toolkit/universal';
import { GeoLocationService } from '../../services/geo-location.service';
import { GeoLocation } from '../../interfaces/geo-location';
//import { LocalStorageService } from 'angular-2-local-storage';
import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../services/root.service';
import { DirectionService } from '../../services/direction.service';
// import { OwlOptions } from 'ngx-owl-carousel-o';
import { Usuario } from '../../interfaces/login';
import { ClientsService } from '../../services/clients.service';
import { ResponseApi } from '../../interfaces/response-api';
import { Lista } from '../../interfaces/articuloFavorito';
import { AgregarListaProductosMasivaModalComponent } from '../agregar-lista-productos-masiva-modal/agregar-lista-productos-masiva-modal.component';
import { PreferenciasCliente } from '../../interfaces/preferenciasCliente';
import { Subscription } from 'rxjs';
import { LogisticsService } from '../../services/logistics.service';
import { isVacio } from '../../utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isPlatformBrowser } from '@angular/common';
import { LoginService } from '@shared/services/login.service';

@Component({
  selector: 'app-product-slideshow',
  templateUrl: './product-slideshow.component.html',
  styleUrls: ['./product-slideshow.component.scss'],
})
export class ProductSlideshowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  user!: Usuario;
  isB2B!: boolean;
  cargando = true;

  lstProductos: any[] = [];
  listas: Lista[] = [];
  relleno: any[] = [1, 2, 3, 4, 5];
  url: any[] = [];
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

  carouselOptionsB2B = {
    items: 5,
    nav: true,
    navText: [
      `<div class="m-arrow__container" ><i class="fa-regular fa-chevron-left"></i></div>`,
      `<div class="m-arrow__container"><i class="fa-regular fa-chevron-right"></i></div>`,
    ],
    dots: true,
    slideBy: 'page',
    responsiveClass: true,
    responsive: {
      1100: { items: 5 },
      920: { items: 5 },
      768: { items: 3 },
      680: { items: 3 },
      500: { items: 3 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  };

  carouselOptionsB2BLista = {
    items: 5,
    nav: true,
    navText: [
      `<i class="fas fa-angle-left fa-1x" style="color: #000;"></i>`,
      `<i class="fas fa-angle-right fa-1x" style="color: #000;"></i>`,
    ],
    dots: true,
    slideBy: 'page',
    // loop: true,
    responsive: {
      1366: { items: 5 },
      1100: { items: 4 },
      920: { items: 4 },
      680: { items: 2 },
      500: { items: 1 },
      0: { items: 1 },
    },
    rtl: this.direction.isRTL(),
  };

  constructor(
    private root: RootService,
    private productsService: ProductsService,
    // @Inject(WINDOW) private window: Window,
    public toast: ToastrService,
    private direction: DirectionService,
    private geoLocationService: GeoLocationService,
    private localStorage: LocalStorageService,
    private router: Router,
    private clientsService: ClientsService,
    private modalService: BsModalService,
    private logisticsService: LogisticsService,
    private loginService: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  sidebarPosition: 'start' | 'end' = 'start';

  ngOnInit() {
    this.ruta = this.router.url === '/inicio' ? 'home' : this.router.url;
    this.user = this.root.getDataSesionUsuario();
    const role = this.user.user_role;
    this.isB2B = role === 'supervisor' || role === 'comprador';
  }

  ngAfterViewInit() {
    const geo: GeoLocation = this.localStorage.get('geolocalizacion');
    if (geo != null && this.preferenciasCliente === undefined) {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarHome();
      });
    }

    this.geoLocationService.localizacionObs$.subscribe(
      async (r: GeoLocation) => {
        this.root.getPreferenciasCliente().then((preferencias) => {
          this.preferenciasCliente = preferencias;
          this.cargarHome();
        });
      }
    );

    this.despachoCliente = this.logisticsService.direccionCliente$.subscribe(
      async (r) => {
        this.root.getPreferenciasCliente().then((preferencias) => {
          this.preferenciasCliente = preferencias;
          this.cargarHome();
        });
      }
    );

    // cuando se inicia sesion
    this.loginService.loginSessionObs$.pipe().subscribe((usuario: Usuario) => {
      console.log('hola inicieß');
      this.user = usuario;
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

  getCantSlides(tipo: string = '') {
    if (this.innerWidth > 1366) {
      return 5;
    }
    if (this.innerWidth > 1100) {
      return tipo === 'lista' ? 4 : 5;
    }
    if (this.innerWidth > 920) {
      return tipo === 'lista' ? 2 : 3;
    }
    if (this.innerWidth > 680) {
      return tipo === 'lista' ? 1 : 2;
    }
    if (this.innerWidth > 500) {
      return tipo === 'lista' ? 1 : 2;
    }
    return 1;
  }

  cargarHome() {
    this.cargando = true;
    const rut = this.user.rut;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const localidad = !isVacio(this.preferenciasCliente.direccionDespacho)
      ? this.preferenciasCliente.direccionDespacho?.comuna
      : '';
    let localidad_limpia = localidad
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let params: any = { sucursal, rut, localidad: localidad_limpia };
    if (this.user.rut !== '0' && !this.isB2B) {
      this.url = [];
      this.lstProductos = [];
      this.productsService.getHomePageB2c(params).subscribe((r: any) => {
        this.url = r.urls;
        this.lstProductos = r.data;
        this.cargando = false;
      });
    } else if (this.user.rut !== '0' && this.isB2B) {
      this.url = [];
      this.lstProductos = [];
      this.productsService.getHomePageB2b(params).subscribe((r: any) => {
        this.lstProductos = this.quitarElementos(r.data);
        this.url = r.urls;
        this.cargando = false;
      });
    } else {
      this.cargando = false;
    }
  }

  quitarElementos(data: any) {
    let lst_limpios: any[] = [];
    let valores = ['mis productos recurrentes', 'últimos productos vistos'];
    data.forEach((element: any) => {
      if (!valores.includes(element.nombre)) lst_limpios.push(element);
    });
    return lst_limpios;
  }

  cargarListas() {
    this.listas = [];
    this.clientsService
      .getListaArticulosFavoritos(this.user.rut || '')
      .subscribe((resp: ResponseApi) => {
        if (resp.data.length > 0) {
          if (resp.data[0].listas.length > 0) {
            this.listas = resp.data[0].listas;
            const detalleSkus = resp.data[0].detalleSkus;
            this.listas = this.listas.map((list) => {
              const products: any[] = [];
              list.skus.forEach((p) => {
                const detalle = detalleSkus.find((dp: any) => dp.sku === p);
                products.push(detalle);
              });
              list.detalleSkus = products;
              return list;
            });
          }
        }
      });
  }

  delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getLink(texto: any) {
    return texto.trim().replace(/ /g, '-');
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
}
