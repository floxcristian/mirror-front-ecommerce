import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeoLocation } from '../../../../shared/interfaces/geo-location';
import { Usuario } from '../../../../shared/interfaces/login';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { DirectionService } from '../../../../shared/services/direction.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { PageHomeService } from '../../services/pageHome.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
@Component({
  selector: 'app-page-home-template',
  templateUrl: './page-home-template.component.html',
  styleUrls: ['./page-home-template.component.scss'],
})
export class PageHomeTemplateComponent implements OnInit, AfterViewInit {
  lstProductos: any[] = [];
  url: any[] = [];
  lstProductos1: any[] = [];
  url1: any[] = [];
  preferenciasCliente!: PreferenciasCliente;
  user!: Usuario;
  despachoCliente!: Subscription;
  constructor(
    private pageHomeService: PageHomeService,
    private root: RootService,
    private productsService: ProductsService,
    private router: Router,
    private modalService: BsModalService,
    private direction: DirectionService,
    private logisticsService: LogisticsService,
    private geoLocationService: GeoLocationService,
    private localStorage: LocalStorageService
  ) {}
  //declarando la variable para ver los tipos
  carga = true;
  carga_producto_home = true;
  carga_listo_especial = true;
  pageHome: any = [];
  async ngOnInit() {
    this.user = this.root.getDataSesionUsuario();
    this.cargarPage();
    const geo: GeoLocation = this.localStorage.get('geolocalizacion');

    if (geo != null && this.preferenciasCliente === undefined) {
      await this.cargarHome();
      await this.get_productos();
    }
  }

  ngAfterViewInit() {
    this.geoLocationService.localizacionObs$.subscribe(
      async (r: GeoLocation) => {
        this.cargarHome();
        this.get_productos();
      }
    );
  }

  async cargarHome() {
    this.carga_producto_home = true;
    const rut = this.user.rut;

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    let params: any = { sucursal, rut };

    this.url = [];
    this.lstProductos = [];
    let r: any = await this.productsService.getHomePage(params).toPromise();
    this.url = r.urls;
    this.lstProductos = r.data;
    //match entre los productos;

    this.carga_producto_home = false;
  }

  async get_productos() {
    this.carga_listo_especial = true;
    const rut = this.user.rut;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    let params: any = { sucursal, rut };
    this.url1 = [];
    this.lstProductos1 = [];
    let r: any = await this.pageHomeService
      .buscarProductosElactic(params)
      .toPromise();
    this.url1 = r.urls;
    this.lstProductos1 = r.data;
    this.carga_listo_especial = false;
  }

  async cargarPage() {
    let consulta: any = await this.pageHomeService
      .get_pagehome_cms()
      .toPromise();
    this.pageHome = consulta.data[0].page;
    this.carga = false;
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Othe
  }
}
