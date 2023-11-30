import {
  Component,
  OnInit,
  Input,
  HostListener,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { RootService } from 'src/app/shared/services/root.service';
import { Usuario } from 'src/app/shared/interfaces/login';
import { DirectionService } from 'src/app/shared/services/direction.service';
import { GeoLocation } from 'src/app/shared/interfaces/geo-location';
import { GeoLocationService } from 'src/app/shared/services/geo-location.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { PreferenciasCliente } from '@shared/interfaces/preferenciasCliente';
import { LoginService } from '@shared/services/login.service';
import { LogisticsService } from '@shared/services/logistics.service';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';

export type Layout = 'grid' | 'grid-with-features' | 'list';

@Component({
  selector: 'app-product-slideshow-specials',
  templateUrl: './product-slideshow-specials.component.html',
  styleUrls: ['./product-slideshow-specials.component.scss'],
})
export class ProductSlideshowSpecialsComponent implements OnInit {
  @Input() layout: Layout = 'grid';
  @Input() grid: 'grid-3-sidebar' | 'grid-4-full' | 'grid-4-full' =
    'grid-3-sidebar';
  lstProductos: any;
  especial: any;
  banners: any;
  producto_espacial: any = [];
  @Input() nombre: string | undefined = undefined;
  user!: ISession;
  isB2B!: boolean;
  cantItem: number = 4;
  innerWidth: number;
  ruta!: any[];
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      1100: { items: 5 },
      920: { items: 5 },
      680: { items: 3 },
      500: { items: 2 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  };
  config: any;
  collection = { count: 60, data: [] };
  p: number = 1;
  preferenciaCliente!: PreferenciasCliente;
  despachoCliente!: Subscription;

  constructor(
    private root: RootService,
    private productsService: ProductsService,
    public toast: ToastrService,

    private direction: DirectionService,
    private geoLocationService: GeoLocationService,
    private localStorage: LocalStorageService,
    private router: Router,
    private loginService: LoginService,
    private logistic: LogisticsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.onResize(event);
  }

  sidebarPosition: 'start' | 'end' = 'start';

  async ngOnInit() {
    this.user = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    const role = this.user.userRole;
    this.isB2B = role === 'supervisor' || role === 'comprador';

    let url: string = this.router.url;
    this.ruta = url.split('/');
    this.preferenciaCliente = this.localStorage.get('preferenciasCliente');
    const geo: GeoLocation = await this.localStorage.get('geolocalizacion');
    if (geo) {
      this.cargaEspeciales();
    }
    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      this.cargaEspeciales();
    });
    // cuando se inicia sesion
    /*this.loginService.loginSessionObs$.pipe().subscribe((usuario: Usuario) => {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciaCliente = preferencias;
        this.cargaEspeciales();
      });
    });*/

    this.authStateService.session$.subscribe((user) => {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciaCliente = preferencias;
        this.cargaEspeciales();
      });
    });

    //Cuando se cambia de dirección despacho
    this.despachoCliente = this.logistic.direccionCliente$.subscribe((r) => {
      this.preferenciaCliente.direccionDespacho = r;
      this.cargaEspeciales();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;

    if (this.innerWidth < 427) {
      this.cantItem = 4;
    } else if (this.innerWidth > 426) {
      this.cantItem = 10;
    }
  }

  getUrl(id: any) {
    this.producto_espacial = this.lstProductos[id].productos;
    this.nombre = this.lstProductos[id].nombre;
  }

  async cargaEspeciales() {
    let rut = this.user.documentId;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo || '';
    var especials = this.router.url.split('/').pop();
    let localidad = '';

    //clean tracking vars
    var look = especials?.indexOf('?');
    if ((look || 0) > -1) especials = especials?.substr(0, look);

    if (this.preferenciaCliente && this.preferenciaCliente.direccionDespacho)
      localidad = this.preferenciaCliente.direccionDespacho.comuna
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const params = {
      sucursal: sucursal,
      rut: rut,
      especial: especials,
      localidad: localidad,
    };

    let respuesta: any = await this.productsService
      .getEspeciales(params)
      .toPromise();

    const { data, especial, banners } = respuesta;

    this.especial = especial;
    this.banners = banners[0];
    let out = [];
    let i = 0;
    for (const key in data) {
      let seccion = {
        nombre: key,
        productos: data[key],
        p: i,
      };
      out.push(seccion);
      i++;
    }
    this.lstProductos = out;

    if (!this.nombre) {
      this.producto_espacial = this.lstProductos[0].productos;
      this.nombre = this.lstProductos[0].nombre;
    } else {
      let index = this.lstProductos.findIndex((item: any) =>
        item.nombre.toUpperCase().match(this.nombre || ''.toUpperCase())
      );

      if (index != -1) {
        this.producto_espacial = this.lstProductos[index].productos;
        this.nombre = this.lstProductos[index].nombre;
        let division = Math.trunc(index / 3);

        if (division >= this.p) {
          this.p = division + 1;
        }
      }
    }
  }

  pageChanged(event: any) {
    this.p = event;
    let index = (this.p - 1) * 3;

    this.producto_espacial = this.lstProductos[index].productos;
    this.nombre = this.lstProductos[index].nombre;
  }

  setLayout(value: Layout): void {
    this.layout = value;
    if (value === 'grid-with-features') {
      this.grid = 'grid-4-full';
    } else {
      this.grid = 'grid-4-full';
    }
  }
}
