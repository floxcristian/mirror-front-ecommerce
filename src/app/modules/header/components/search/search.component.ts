// Angular
import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
// Libs
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ToastrService } from 'ngx-toastr';
// Rxjs
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
// Services
import { RootService } from '../../../../shared/services/root.service';
import { CartService } from '../../../../shared/services/cart.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { SessionService } from '@core/states-v2/session.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ArticleService } from '@core/services-v2/article.service';
// Directives
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import {
  IArticleResponse,
  IBrand,
  ICategorySearch,
  ISuggestion,
} from '@core/models-v2/article/article-response.interface';
// Components
import { DireccionDespachoComponent } from '../search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { ModalStoresComponent } from '../modal-stores/modal-stores.component';
import { CustomerPreferencesStorageService } from '@core/storage/customer-preferences-storage.service';
import { CustomerPreferenceService } from '@core/services-v2/customer-preference/customer-preference.service';

@Component({
  selector: 'app-header-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('menuSearch', { static: false }) listSearch!: ElementRef;
  @ViewChild('menuTienda', { static: false }) menuTienda!: DropdownDirective;
  @ViewChild(DropdownDirective, { static: false })
  dropdown!: DropdownDirective;

  destroy$: Subject<boolean> = new Subject<boolean>();

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
  buscando = true;
  mostrarResultados = false;

  sessionNotStarted = false;
  loadCart = false;

  seleccionado = false;
  isFocusedInput = false;

  direccion!: ICustomerAddress | any;
  despachoClienteRef!: Subscription;
  isVacio = isVacio;
  usuarioRef!: Subscription;

  // News
  session!: ISession;
  selectedStore!: ISelectedStore;
  areLoadedStores!: boolean;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    public root: RootService,
    private toastr: ToastrService,
    public cart: CartService,
    public menuCategorias: MenuCategoriasB2cService,
    public localS: LocalStorageService,
    private logisticsService: LogisticsService,
    private cartService: CartService,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly articleService: ArticleService,
    private readonly customerPreferenceStorage: CustomerPreferencesStorageService,
    private readonly customerPreferenceService: CustomerPreferenceService
  ) {}

  ngOnInit(): void {
    this.onChangeSearchInput();

    this.geolocationService.stores$
      .pipe(first((stores) => stores.length > 0))
      .subscribe({
        next: () => {
          //console.log('stores desde el search component: ', stores);
          this.areLoadedStores = true;
          console.log('tiendaSeleccionada 1');
          // Obtengo tienda seleccionada,
          // como aun espera a que acepte... se hace un setdefault
          this.selectedStore = this.geolocationService.getSelectedStore();
          //console.log('tiendaSeleccionada: ', this.tiendaSeleccionada);
          this.onChangeStore();
        },
      });

    this.session = this.sessionService.getSession();
    if (this.session.documentId !== '0') {
      this.customerPreferenceService.getCustomerPreferences().subscribe({
        next: (preferences) => {
          this.direccion = preferences.deliveryAddress;
        },
      });
    }

    this.usuarioRef = this.authStateService.session$.subscribe((user) => {
      this.session = user;
      if (this.session.documentId !== '0') {
        this.customerPreferenceService.getCustomerPreferences().subscribe({
          next: (preferences) => {
            this.direccion = preferences.deliveryAddress;
          },
        });
      }
    });

    this.despachoClienteRef =
      this.logisticsService.direccionCliente$.subscribe((r) => {
        this.direccion = r;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.despachoClienteRef.unsubscribe();
    this.usuarioRef.unsubscribe();
  }

  reset(): void {
    this.buscando = true;
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

  private buscarSelect(): void {
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.linkBusquedaProductos = this.textToSearch;
    if (this.textToSearch.length > 3) {
      this.articleService
        .search({
          word: this.textToSearch,
          documentId: this.session.documentId,
          branchCode: this.selectedStore.code,
          showPrice: 1,
        })
        .subscribe({
          next: (res) => {
            if (!this.seleccionado) {
              this.dropdown.open();
            }
            this.mostrarCargando = false;
            this.categorias = res.categories;
            this.marcas = res.brands;
            this.productosEncontrados = res.articles;
            this.sugerencias = res.suggestions;
            if (!this.productosEncontrados.length) {
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

  async validarCuenta(): Promise<void> {
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
      const preferences = this.customerPreferenceStorage.get();
      preferences.deliveryAddress = direccionDespacho;
      this.customerPreferenceStorage.set(preferences);
    });
  }

  /**
   * Abrir modal con las tiendas.
   */
  showStores(): void {
    this.modalService.show(ModalStoresComponent);
  }

  private onChangeSearchInput(): void {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
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
  private onChangeStore(): void {
    this.geolocationService.selectedStore$.subscribe({
      next: (selectedStore) => {
        console.log('tiendaSeleccionada 2');
        this.selectedStore = selectedStore;
        this.cartService.calc();
        if (selectedStore.isChangeToNearestStore) {
          setTimeout(() => {
            if (this.menuTienda) this.menuTienda.open();
          }, 700);
        }
      },
    });
  }
}
