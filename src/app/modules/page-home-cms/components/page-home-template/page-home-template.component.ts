// Angular
import { Component, OnInit, AfterViewInit } from '@angular/core';
// Rxjs
import { Subscription } from 'rxjs';
// Models
import { GeoLocation } from '../../../../shared/interfaces/geo-location';
import { Usuario } from '../../../../shared/interfaces/login';
// Services
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { DirectionService } from '../../../../shared/services/direction.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { PageHomeService } from '../../services/pageHome.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { LoginService } from '../../../../shared/services/login.service';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { CmsService } from '@core/services-v2/cms.service';
import { IPage } from '@core/models-v2/cms/homePage-response.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
@Component({
  selector: 'app-page-home-template',
  templateUrl: './page-home-template.component.html',
  styleUrls: ['./page-home-template.component.scss'],
})
export class PageHomeTemplateComponent implements OnInit, AfterViewInit {
  preferenciasCliente!: PreferenciasCliente;
  user!: ISession;
  despachoCliente!: Subscription;

  //declarando la variable para ver los tipos
  carga = true;
  carga_producto_home = true;
  carga_listo_especial = true;
  pageHome: IPage[] = [];

  constructor(
    private pageHomeService: PageHomeService,
    private root: RootService,
    private productsService: ProductsService,
    private direction: DirectionService,
    private logisticsService: LogisticsService,
    private geoLocationService: GeoLocationService,
    private localStorage: LocalStorageService,
    private loginService: LoginService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly csmService: CmsService,
    private readonly authStateService: AuthStateServiceV2
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    this.cargarPage();

    const geo: GeoLocation = this.localStorage.get('geolocalizacion');
    if (geo) {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarPage();
      });
    }
  }

  ngAfterViewInit(): void {
    this.geoLocationService.localizacionObs$.subscribe(
      async (r: GeoLocation) => {
        this.cargarPage();
      }
    );

    this.authStateService.session$.subscribe((user) => {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarPage();
      });
    });
    /*this.loginService.loginSessionObs$.pipe().subscribe((usuario: Usuario) => {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarPage();
      });
    });*/

    this.logisticsService.direccionCliente$.subscribe((r) => {
      this.preferenciasCliente.direccionDespacho = r;
      this.cargarPage();
    });
  }

  async cargarPage() {
    const rut = this.user.documentId;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo
      ? tiendaSeleccionada?.codigo
      : 'SAN BRNRDO';
    const localidad = this.preferenciasCliente?.direccionDespacho
      ? this.preferenciasCliente.direccionDespacho.comuna
      : '';
    this.csmService.getHomePage(rut, sucursal, localidad).subscribe({
      next: (res) => {
        this.pageHome = res.data[0].page;
        this.carga = false;
        this.scrollToTop();
      },
      error: (err) => {},
    });
  }

  scrollToTop(): void {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
}
