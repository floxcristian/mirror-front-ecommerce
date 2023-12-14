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
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { isVacio } from '../../../../shared/utils/utilidades';
import { DireccionDespachoComponent } from '../search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { ModalStoresComponent } from '../modal-stores/modal-stores.component';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import {
  IArticleResponse,
  IBrand,
  ICategorySearch,
  ISuggestion,
} from '@core/models-v2/article/article-response.interface';
import { ArticleService } from '@core/services-v2/article.service';
import { CartService } from '@core/services-v2/cart.service';
import { PathStorageService } from '@core/storage/path-storage.service';
import { CustomerPreferenceStorageService } from '@core/storage/customer-preference-storage.service';
import { IPreference } from '@core/models-v2/customer/customer-preference.interface';

@Component({
  selector: 'app-header-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
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

  /*texto = '';
  textToSearch = '';
  categorias: any[] = [];
  marcas: any[] = [];
  sugerencias: any[] = [];
  productosEncontrados: any[] = [];*/
  // Modal Tienda
  templateTiendaModal!: TemplateRef<any>;

  texto: string = '';
  textToSearch: string = '';
  categorias: ICategorySearch[] = [];
  marcas: IBrand[] = [];
  sugerencias: ISuggestion[] = [];
  productosEncontrados: IArticleResponse[] = [];
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
  tiendaSeleccionada!: ISelectedStore;
  seleccionado = false;
  isFocusedInput = false;

  direccion!: ICustomerAddress | any;
  despachoClienteRef!: Subscription;
  isVacio = isVacio;
  usuario!: ISession;
  usuarioRef!: Subscription;

  areLoadedStores!: boolean;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private productsService: ProductsService,
    public root: RootService,
    private toastr: ToastrService,
    public menuCategorias: MenuCategoriasB2cService,
    private logisticsService: LogisticsService,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly geolocationService: GeolocationServiceV2,
    public readonly shoppingCartService: CartService,
    private readonly pathStorage: PathStorageService,
    private readonly customerPreferenceStorage: CustomerPreferenceStorageService,
    private readonly articleService: ArticleService
  ) {}

  onChangeSearchInput(): void {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim()) {
          this.textToSearch = query;
          this.buscarSelect();
        } else {
          this.categorias = [];
          this.productosEncontrados = [];
        }
      });
  }

  // Analizar esto..
  onChangeStore(): void {
    this.geolocationService.selectedStore$.subscribe({
      next: (selectedStore) => {
        console.log('tiendaSeleccionada 2');
        this.tiendaSeleccionada = selectedStore;
        this.shoppingCartService.calc();
        if (selectedStore.isChangeToNearestStore) {
          setTimeout(() => {
            if (this.menuTienda) this.menuTienda.open();
          }, 700);
        }
      },
    });
  }

  ngOnInit(): void {
    this.onChangeSearchInput();

    this.geolocationService.stores$
      .pipe(first((stores) => stores.length > 0))
      .subscribe({
        next: (stores) => {
          //console.log('stores desde el search component: ', stores);
          this.areLoadedStores = true;
          console.log('tiendaSeleccionada 1');
          // Obtengo tienda seleccionada,
          // como aun espera a que acepte... se hace un setdefault
          this.tiendaSeleccionada = this.geolocationService.getSelectedStore();
          //console.log('tiendaSeleccionada: ', this.tiendaSeleccionada);
          this.onChangeStore();
        },
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
    let search: string = this.textToSearch.replace('/', '%2F');
    this.router.navigateByUrl('inicio/productos/' + search);
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.mostrarResultados = false;

    setTimeout(() => {
      this.dropdown.close();
    }, 500);
  }

  buscarSelect() {
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.linkBusquedaProductos = this.textToSearch;
    if (!this.back_key && this.textToSearch.length > 3) {
      this.back_key = false;
      let params = {
        word: this.textToSearch,
        documentId: this.usuario.documentId || '0',
        branchCode: this.tiendaSeleccionada.code,
        showPrice: 1,
      };
      this.articleService.search(params).subscribe({
        next: (res) => {
          if (!this.seleccionado) {
            this.dropdown.open();
          }
          this.mostrarCargando = false;
          this.categorias = res.categories;
          this.marcas = res.brands;
          this.productosEncontrados = res.articles;
          this.sugerencias = res.suggestions;
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
        error: (err) => {
          this.toastr.error('Error de conexión con el servidor de Elastic');
          console.error('Error de conexión con el servidor de Elastic');
        },
      });
    }
  }

  // Mostrar client
  abrirModalTiendas(): void {
    this.modalService.show(ModalStoresComponent);
    // FIXME:...
    this.logisticsService.obtenerTiendas().subscribe();
  }

  clearbusquedaChasis() {
    this.searchChasis.nativeElement.value = '';
  }

  async validarCuenta() {
    this.pathStorage.set(['/', 'mi-cuenta', 'seguimiento']);
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
      const preferencias: IPreference =
        this.customerPreferenceStorage.get() as IPreference;
      preferencias.deliveryAddress = direccionDespacho;
      this.customerPreferenceStorage.set(preferencias);
    });
  }
}
