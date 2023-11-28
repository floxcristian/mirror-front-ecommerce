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
@Component({
  selector: 'app-page-home-template',
  templateUrl: './page-home-template.component.html',
  styleUrls: ['./page-home-template.component.scss'],
})
export class PageHomeTemplateComponent implements OnInit, AfterViewInit {
  // Productos
  lstProductos: any[] = [];
  url: any[] = [];
  // Productos
  lstProductos1: any[] = [];
  url1: any[] = [];
  // Otro...
  preferenciasCliente!: PreferenciasCliente;
  user!: ISession;
  despachoCliente!: Subscription;

  //declarando la variable para ver los tipos
  carga = true;
  carga_producto_home = true;
  carga_listo_especial = true;
  pageHome: any = [];

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
    private readonly sessionService: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    this.cargarPage();

    const geo: GeoLocation = this.localStorage.get('geolocalizacion');
    if (geo) {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarHome();
        this.get_productos();
      });
    }
  }

  ngAfterViewInit(): void {
    this.geoLocationService.localizacionObs$.subscribe(
      async (r: GeoLocation) => {
        this.cargarHome();
        this.get_productos();
      }
    );
    this.loginService.loginSessionObs$.pipe().subscribe((usuario: Usuario) => {
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.preferenciasCliente = preferencias;
        this.cargarHome();
        this.get_productos();
      });
    });

    this.logisticsService.direccionCliente$.subscribe((r) => {
      this.preferenciasCliente.direccionDespacho = r;
      this.cargarHome();
      this.get_productos();
    });
  }

  async cargarHome() {
    this.carga_producto_home = true;
    const rut = this.user.documentId;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    let params: any;
    if (this.preferenciasCliente?.direccionDespacho)
      params = {
        sucursal,
        rut,
        localidad: this.preferenciasCliente.direccionDespacho.comuna,
      };
    else params = { sucursal, rut };

    this.url = [];
    this.lstProductos = [];
    let r: any = await this.pageHomeService.getHomePage(params).toPromise();
    this.url = r.urls;
    this.lstProductos = r.data;
    //match entre los productos;

    this.carga_producto_home = false;
  }

  async get_productos() {
    this.carga_listo_especial = true;
    const rut = this.user.documentId;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;

    // Format params.
    let params: any;
    if (this.preferenciasCliente && this.preferenciasCliente.direccionDespacho)
      params = {
        sucursal,
        rut,
        localidad: this.preferenciasCliente.direccionDespacho.comuna,
      };
    else params = { sucursal, rut };

    this.url1 = [];
    this.lstProductos1 = [];
    // FIXME: eliminar
    const response: any = await this.pageHomeService
      .buscarProductosElactic(params)
      .toPromise();

    this.url1 = response.urls;
    this.lstProductos1 = response.data;

    this.carga_listo_especial = false;
  }

  async cargarPage() {
    const response: any = await this.pageHomeService
      .getPagehomeCms()
      .toPromise();
    this.pageHome = response.data[0].page;

    this.carga = false;
    this.scrollToTop();
  }

  scrollToTop(): void {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
}
