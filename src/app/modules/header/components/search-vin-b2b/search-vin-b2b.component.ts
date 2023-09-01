import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
//import { LocalStorageService } from 'angular-2-local-storage';
import { isVacio } from '../../../../shared/utils/utilidades';
import { RootService } from '../../../../shared/services/root.service';
import { ClientsService } from '../../../../shared/services/clients.service';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import { ToastrService } from 'ngx-toastr';
import { Flota, MarcaModeloAnio } from '../../../../shared/interfaces/flota';
import { Usuario } from '../../../../shared/interfaces/login';
import { BarraBusquedaComponent } from './components/barra-busqueda/barra-busqueda.component';
import {
  BuscadorService,
  BusquedaData,
} from '../../../../shared/services/buscador.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../../../shared/services/cart.service';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service';
import { DireccionDespachoComponent } from './components/direccion-despacho/direccion-despacho.component';
import { ShippingAddress } from '../../../../shared/interfaces/address';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import {
  GeoLocation,
  TiendaLocation,
} from '../../../../shared/interfaces/geo-location';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-search-vin-b2b',
  templateUrl: './search-vin-b2b.component.html',
  styleUrls: ['./search-vin-b2b.component.scss'],
})
export class SearchVinB2bComponent implements OnInit, OnDestroy {
  @ViewChild('barraBusqueda', { static: false })
  barraBusqueda!: BarraBusquedaComponent;
  @ViewChild('menuTienda', { static: false }) menuTienda!: DropdownDirective;

  filtro!: Flota | undefined;
  marcaModeloAnio!: MarcaModeloAnio | undefined;
  word = '';
  categorias: any[] = [];

  usuario!: Usuario;
  direccion!: ShippingAddress | null | undefined;
  tiendaSeleccionada!: TiendaLocation | undefined;

  // Modal Tienda
  templateTiendaModal!: TemplateRef<any>;
  modalRefTienda!: BsModalRef;

  collapsed!: boolean;
  filtrosVisibles = true;
  isVacio = isVacio;
  encodeURI = encodeURI;
  private buscadorRef: Subscription | null = null;
  private filtrosVisiblesRef: Subscription | null = null;
  private despachoClienteRef: Subscription | null = null;

  constructor(
    private modalService: BsModalService,
    public rootService: RootService,
    public router: Router,
    private clientsService: ClientsService,
    private toastr: ToastrService,
    public localS: LocalStorageService,
    private logisticsService: LogisticsService,
    private geoLocationService: GeoLocationService,
    public cart: CartService,
    private buscadorService: BuscadorService,
    public menu: MobileMenuService
  ) {}

  ngOnInit() {
    this.usuario = this.rootService.getDataSesionUsuario();
    // Tienda seleccionada
    this.tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      this.tiendaSeleccionada = r.tiendaSelecciona;
      this.cart.calc();
      if (r.esNuevaUbicacion) {
        setTimeout(() => {
          this.menuTienda.open();
        }, 700);
      }
    });

    // const preferencias: PreferenciasCliente = this.localS.get('preferenciasCliente');
    this.rootService.getPreferenciasCliente().then((preferencias) => {
      this.direccion = preferencias.direccionDespacho;
    });

    this.buscadorRef = this.buscadorService.buscador$.subscribe(
      (data: BusquedaData) => {
        this.buscarProductos(data);
      }
    );
    this.filtrosVisiblesRef =
      this.buscadorService.buscadorFiltrosVisibles$.subscribe(
        (data: boolean) => {
          this.filtrosVisibles = data;
        }
      );
    this.despachoClienteRef = this.logisticsService.direccionCliente$.subscribe(
      (r) => {
        this.direccion = r;
      }
    );

    /*  Sticky Header */
    const header = document.getElementById('stricky_header');
    if (!isVacio(header)) {
      const sticky = (header?.offsetTop || 0) + 32;
      window.onscroll = () => {
        if (window.pageYOffset > sticky) {
          header?.classList.add('sticky');
          header?.classList.remove('pt-3');
          header?.classList.add('pt-2');
        } else {
          header?.classList.remove('sticky');
          header?.classList.remove('pt-2');
          header?.classList.add('pt-3');
        }
      };
    }
  }

  ngOnDestroy() {
    this.buscadorRef?.unsubscribe();
    this.filtrosVisiblesRef?.unsubscribe();
    this.despachoClienteRef?.unsubscribe();
  }

  async buscarProductos(data: BusquedaData) {
    this.filtro = data.filtro ? data.filtro : undefined;
    this.marcaModeloAnio = data.marcaModeloAnio
      ? data.marcaModeloAnio
      : undefined;
    this.word = data.word ? data.word : '';

    this.filtrosVisibles = false;

    if (!isVacio(this.filtro)) {
      // si vehiculo buscado no existe entre los buscados recientemente, se guarda en las busquedas recientes
      let encontradoBusquedas = this.barraBusqueda.busquedas.find(
        (b) => b.vehiculo?._id === this.filtro?.vehiculo?._id
      );
      if (isVacio(encontradoBusquedas)) {
        const request: any = {
          rutCliente: this.usuario.rut,
          idVehiculo: this.filtro?.vehiculo?._id,
        };
        // se guarda en BD la busqueda
        const resp2: ResponseApi = (await this.clientsService
          .setBusquedaVin(request)
          .toPromise()) as ResponseApi;

        if (!resp2.error) {
          // this.barraBusqueda.filtro = resp2.data;
          await this.barraBusqueda.getDataDropDown();
        } else {
          this.toastr.error(resp2.msg, 'Error!');
        }
      }
      // si existe se carga el vehiculo en el filtro
      const encontradoFlota = this.barraBusqueda.flota.find(
        (b) => b.vehiculo?._id === this.filtro?.vehiculo?._id
      );
      encontradoBusquedas = this.barraBusqueda.busquedas.find(
        (b) => b.vehiculo?._id === this.filtro?.vehiculo?._id
      );
      if (!isVacio(encontradoBusquedas)) {
        this.barraBusqueda.filtro = encontradoBusquedas;
      } else if (!isVacio(encontradoFlota)) {
        this.barraBusqueda.filtro = encontradoFlota;
      }
      this.barraBusqueda.creaTextoFiltro();

      // se arma URL y se redirecciona a componente PageCategory
      const url = `inicio/productos/${this.word !== '' ? this.word : 'todos'}`;
      let queryParams = {};
      queryParams = this.armaQueryParams(queryParams);

      this.router.navigate([url], { queryParams });
    } else if (!isVacio(this.marcaModeloAnio)) {
      this.barraBusqueda.marcaModeloAnio = this.marcaModeloAnio;
      this.barraBusqueda.creaTextoFiltro();

      // se arma URL y se redirecciona a componente PageCategory
      const url = `inicio/productos/${this.word !== '' ? this.word : 'todos'}`;
      let queryParams = {};
      queryParams = this.armaQueryParams(queryParams);

      this.router.navigate([url], { queryParams });
    } else {
      const url = `inicio/productos/${this.word !== '' ? this.word : 'todos'}`;
      this.router.navigate([url]);
    }
  }

  // collapse() {
  //     const buscadorB2B: BuscadorB2B = this.localS.get('buscadorB2B');
  //     buscadorB2B.collapsed = !this.collapsed;
  //     this.localS.set('buscadorB2B', buscadorB2B);
  //     this.collapsed = !this.collapsed;

  //     const contenedor = document.querySelector('.contenedor');
  //     contenedor.classList.toggle('collapsed');
  // }

  // resetBusqueda() {
  //     this.categorias = [];

  //     const url = 'inicio';
  //     this.router.navigate([url]);
  // }

  changeFiltro() {
    if (isVacio(this.barraBusqueda.filtro)) {
      this.filtrosVisibles = true;
    } else {
      this.filtrosVisibles = false;
    }
  }

  armaQueryParams(queryParams: any) {
    if (!isVacio(this.filtro)) {
      queryParams = {
        ...queryParams,
        ...{ chassis: this.filtro?.vehiculo?.chasis },
      };
    }
    if (!isVacio(this.marcaModeloAnio)) {
      if (this.marcaModeloAnio?.marca !== '') {
        queryParams = {
          ...queryParams,
          ...{ marca: this.marcaModeloAnio?.marca },
        };
      }
      if (this.marcaModeloAnio?.modelo !== '') {
        queryParams = {
          ...queryParams,
          ...{ modelo: this.marcaModeloAnio?.modelo },
        };
      }
      if (this.marcaModeloAnio?.anio !== '') {
        queryParams = {
          ...queryParams,
          ...{ anio: this.marcaModeloAnio?.anio },
        };
      }
    }

    return queryParams;
  }

  // Mostrar client
  abrirModalTiendas() {
    this.modalRefTienda = this.modalService.show(this.templateTiendaModal);
    this.logisticsService.obtenerTiendas().subscribe();
  }

  estableceModalTienda(template: any) {
    this.templateTiendaModal = template;
  }

  async validarCuenta() {
    this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
    let usuario = this.localS.get('usuario');

    if (!usuario) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
      return;
    }

    // @ts-ignore
    if (usuario.hasOwnProperty('login_temp') && usuario.login_temp === true) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
      return;
    }

    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  modificarDireccionDespacho() {
    const bsModalRef: BsModalRef = this.modalService.show(
      DireccionDespachoComponent
    );
    bsModalRef.content.event.subscribe(async (res: any) => {
      const direccionDespacho = res;

      this.direccion = direccionDespacho;
      const preferencias: PreferenciasCliente = this.localS.get(
        'preferenciasCliente'
      ) as any;
      preferencias.direccionDespacho = direccionDespacho;
      this.localS.set('preferenciasCliente', preferencias);

      /* GUARDAR EN BD */
    });
  }

  menu_open() {
    this.menu.open();
  }

  Hidebar() {
    let url = this.router.url;

    if (this.router.url.split('?')[0] != undefined) {
      url = '' + this.router.url.split('?')[0];
    }
    if (this.router.url === '/inicio') {
      return false;
    } else {
      return true;
    }
  }

  Hidebar_head() {
    let url = this.router.url;
    if (this.router.url.split('?')[0] != undefined) {
      url = '' + this.router.url.split('?')[0];
    }

    if (this.router.url.includes('/carro-compra')) {
      return true;
    } else {
      return false;
    }
  }
}
