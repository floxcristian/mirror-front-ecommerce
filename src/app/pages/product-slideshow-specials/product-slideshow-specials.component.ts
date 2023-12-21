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
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { CmsService } from '@core/services-v2/cms.service';
import {
  IArticle,
  IBanner,
  IData,
  ISpecial,
} from '@core/models-v2/cms/special-reponse.interface';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';
import { ICustomerPreference } from '@core/services-v2/customer-preference/models/customer-preference.interface';
import { CustomerPreferencesStorageService } from '@core/storage/customer-preferences-storage.service';
import { CustomerPreferenceService } from '@core/services-v2/customer-preference/customer-preference.service';
import { CustomerAddressService } from '@core/services-v2/customer-address/customer-address.service';

export type Layout = 'grid' | 'grid-with-features' | 'list';
export interface ISection {
  nombre: string;
  productos: IArticle[];
  p: number;
}

@Component({
  selector: 'app-product-slideshow-specials',
  templateUrl: './product-slideshow-specials.component.html',
  styleUrls: ['./product-slideshow-specials.component.scss'],
})
export class ProductSlideshowSpecialsComponent implements OnInit {
  @Input() layout: Layout = 'grid';
  @Input() grid: 'grid-3-sidebar' | 'grid-4-full' | 'grid-4-full' =
    'grid-3-sidebar';
  lstProductos!: ISection[];
  especial!: ISpecial[];
  banners!: IBanner;
  producto_espacial: IArticle[] = [];
  @Input() nombre: string | undefined = undefined;
  user!: ISession;
  isB2B!: boolean;
  cantItem: number = 4;
  innerWidth: number;
  ruta!: any[];
  config: any;
  p: number = 1;
  preferenciaCliente!: ICustomerPreference;
  despachoCliente!: Subscription;

  constructor(
    public toast: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly cmsService: CmsService,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly geolocationStorage: GeolocationStorageService,
    private readonly customerPreferenceStorage: CustomerPreferencesStorageService,
    private readonly customerPreferenceService: CustomerPreferenceService,
    private readonly customerAddressService: CustomerAddressService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.onResize(event);
  }

  sidebarPosition: 'start' | 'end' = 'start';

  async ngOnInit() {
    this.user = this.sessionService.getSession();
    const role = this.user.userRole;
    this.isB2B = role === 'supervisor' || role === 'comprador';

    let url: string = this.router.url;
    this.ruta = url.split('/');
    this.preferenciaCliente = this.customerPreferenceStorage.get();
    const geo = this.geolocationStorage.get();
    if (geo) {
      this.cargaEspeciales();
    }

    this.geolocationService.selectedStore$.subscribe({
      next: (res) => {
        this.cargaEspeciales();
      },
    });

    // cuando se inicia sesion
    this.authStateService.session$.subscribe(() => {
      this.customerPreferenceService.getCustomerPreferences().subscribe({
        next: (preferences) => {
          this.preferenciaCliente = preferences;
          this.cargaEspeciales();
        },
      });
    });

    //Cuando se cambia de dirección despacho
    this.despachoCliente =
      this.customerAddressService.customerAddress$.subscribe(
        (customerAddress) => {
          this.preferenciaCliente.deliveryAddress = customerAddress;
          this.cargaEspeciales();
        }
      );
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
    let documentId = this.user.documentId;
    console.log('getSelectedStore desde ProductSlideshowSpecialsComponent');
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    const sucursal = tiendaSeleccionada.code;
    var especials = this.router.url.split('/').pop() || '';
    let location = '';

    //clean tracking vars
    var look = especials?.indexOf('?');
    if ((look || 0) > -1) especials = especials?.substr(0, look);

    if (this.preferenciaCliente && this.preferenciaCliente.deliveryAddress)
      location = this.preferenciaCliente.deliveryAddress.city
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    this.cmsService
      .getSpecial(especials, documentId, sucursal, location)
      .subscribe({
        next: (res) => {
          this.especial = res.specials;
          this.banners = res.banners[0];
          let data: IData[] = res.data;
          let out: any = [];
          let i = 0;
          data.forEach((x: IData) => {
            let seccion: ISection = {
              nombre: x.title,
              productos: x.articles,
              p: i,
            };
            out.push(seccion);
            i++;
          });
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
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  pageChanged(event: any) {
    this.p = event;
    let index = (this.p - 1) * 3;

    this.producto_espacial = this.lstProductos[index].productos;
    this.nombre = this.lstProductos[index].nombre;
  }
}
