import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartService } from '../../../../shared/services/cart.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import {
  GeoLocation,
  TiendaLocation,
} from '../../../../shared/interfaces/geo-location';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ShippingAddress } from '../../../../shared/interfaces/address';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { isVacio } from '../../../../shared/utils/utilidades';
import { DireccionDespachoComponent } from '../search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';

@Component({
  selector: 'app-header-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modalSearch', { read: TemplateRef, static: false })
  template!: TemplateRef<any>;
  @ViewChild('menuSearch', { static: false }) listSearch!: ElementRef;
  @ViewChild('searchChasis', { static: false }) searchChasis!: ElementRef;
  @ViewChild('menuTienda', { static: false }) menuTienda!: DropdownDirective;
  @ViewChild('modalChasis', { static: false }) modalChasis!: DropdownDirective;
  @ViewChild(DropdownDirective, { static: false })
  dropdown!: DropdownDirective;

  destroy$: Subject<boolean> = new Subject<boolean>();

  modalRef!: BsModalRef;

  // Modal Tienda
  templateTiendaModal!: TemplateRef<any>;
  modalRefTienda!: BsModalRef;

  texto = '';
  textToSearch = '';
  categorias: any[] = [];
  marcas: any[] = [];
  sugerencias: any[] = [];
  productosEncontrados: any[] = [];
  mostrarContenido = false;
  mostrarCargando = false;
  linkBusquedaProductos = '#';
  searchControl!: FormControl;
  private debounce = 400;
  buscando = true;
  back_key = false;
  mostrarResultados = false;

  sessionNotStarted = false;
  loadCart = false;
  tiendaSeleccionada!: TiendaLocation | undefined;
  seleccionado = false;
  isFocusedInput = false;

  direccion!: ShippingAddress | any;
  despachoClienteRef!: Subscription;
  isVacio = isVacio;
  usuario!: ISession;
  usuarioRef!: Subscription;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private productsService: ProductsService,
    public root: RootService,
    private toastr: ToastrService,
    public cart: CartService,
    public menuCategorias: MenuCategoriasB2cService,
    public localS: LocalStorageService,
    private geoLocationService: GeoLocationService,
    private logisticsService: LogisticsService,
    private cartService: CartService,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2
  ) {}

  ngOnInit() {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim() !== '') {
          this.textToSearch = query;
          this.buscarSelect();
        } else {
          this.categorias = [];
          this.productosEncontrados = [];
        }
      });

    // Tienda seleccionada
    this.tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      this.tiendaSeleccionada = r.tiendaSelecciona;
      this.cartService.calc();
      if (r.esNuevaUbicacion) {
        setTimeout(() => {
          if (this.menuTienda) this.menuTienda.open();
        }, 700);
      }
    });
    this.usuario = this.sessionService.getSession();
    if (this.usuario.documentId !== '0')
      this.root.getPreferenciasCliente().then((preferencias) => {
        this.direccion = preferencias.direccionDespacho;
      });

    this.usuarioRef = this.authStateService.session$.subscribe((user) => {
      this.usuario = user;
      if (this.usuario.documentId !== '0')
        this.root.getPreferenciasCliente().then((preferencias) => {
          this.direccion = preferencias.direccionDespacho;
        });
    });

    this.despachoClienteRef =
      this.logisticsService.direccionCliente$.subscribe((r) => {
        this.direccion = r;
      });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.despachoClienteRef.unsubscribe();
    this.usuarioRef.unsubscribe();
  }

  reset() {
    this.buscando = true;
  }

  onKeyPress(params: any) {
    if (params.key === 'Backspace') {
      this.back_key = false;
    } else this.back_key = false;
  }

  buscar() {
    this.gtmService.pushTag({
      event: 'search',
      busqueda: this.textToSearch,
    });

    if (this.textToSearch.trim() === '') {
      this.toastr.info('Debe ingresar un texto para buscar', 'Información');
      return;
    }
    let search = this.textToSearch.replace('/', '%2F');
    this.router.navigateByUrl('inicio/productos/' + search);
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.mostrarResultados = false;

    setTimeout(() => {
      this.dropdown.close();
    }, 500);
  }

  buscarChasis() {
    if (this.searchChasis.nativeElement.value.trim().length > 0) {
      const textToSearch = this.searchChasis.nativeElement.value.trim();
      this.router.navigate([`inicio/productos/todos`], {
        queryParams: { chassis: textToSearch },
      });
    } else {
      this.toastr.info('Debe ingresar un texto para buscar', 'Información');
    }
  }

  buscarSelect() {
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.linkBusquedaProductos = this.textToSearch;
    if (!this.back_key && this.textToSearch.length > 3) {
      this.back_key = false;
      this.productsService
        .buscarProductosElactic(this.textToSearch)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (r: any) => {
            if (!this.seleccionado) {
              this.dropdown.open();
            }

            this.mostrarCargando = false;
            this.categorias = r.categorias;
            this.marcas = r.marcas;
            this.productosEncontrados = r.articulos;
            this.sugerencias = r.sugerencias;

            if (this.productosEncontrados.length === 0) {
              this.buscando = false;
            }

            this.categorias.map((item) => {
              item.url = [
                '/',
                'inicio',
                'productos',
                this.textToSearch,
                'categoria',
                item.slug,
              ];
              if (typeof item.name === 'undefined') {
                item.name = 'Sin categorias';
              }
            });

            this.productosEncontrados.map((item) => {
              item.url = ['/', 'inicio', 'productos', item.sku];
            });
          },
          (error) => {
            this.toastr.error('Error de conexión con el servidor de Elastic');
            console.error('Error de conexión con el servidor de Elastic');
          }
        );
    }
  }

  mostraModalBuscador() {
    this.modalRef = this.modalService.show(this.template, {
      class: 'modal-xl modal-buscador',
    });
    this.root.setModalRefBuscador(this.modalRef);
  }

  // Mostrar client
  abrirModalTiendas() {
    this.modalRefTienda = this.modalService.show(this.templateTiendaModal);
    this.logisticsService.obtenerTiendas().subscribe();
  }

  estableceModalTienda(template: any) {
    this.templateTiendaModal = template;
  }

  clearbusquedaChasis() {
    this.searchChasis.nativeElement.value = '';
  }

  focusSearchChasis() {
    this.searchChasis.nativeElement.focus();
  }

  buscarGtag() {
    this.gtmService.pushTag({
      event: 'search',
      busqueda: this.textToSearch,
    });
  }

  async validarCuenta() {
    this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  verificarCarro(template: any) {
    template.toggle();
  }

  focusInput() {
    this.isFocusedInput = true;
  }

  blurInput() {
    this.isFocusedInput = false;
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
      );
      preferencias.direccionDespacho = direccionDespacho;
      this.localS.set('preferenciasCliente', preferencias);
    });
  }
}
