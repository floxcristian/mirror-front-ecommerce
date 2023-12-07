import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service';
import { mobileMenu } from '../../../../../data/mobile-menu';
import { MobileMenuItem } from '../../../../shared/interfaces/mobile-menu-item';
import { environment } from '@env/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NavigationLink } from '../../../../shared/interfaces/navigation-link';
import { CategoryApi } from '../../../../shared/interfaces/category-api';
import { CategoryService } from '../../../../shared/services/category.service';
import { RootService } from '../../../../shared/services/root.service';
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
import { DireccionDespachoComponent } from '../../../header/components/search-vin-b2b/components/direccion-despacho/direccion-despacho.component';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { ShippingAddress } from '../../../../shared/interfaces/address';

import { LogisticsService } from '../../../../shared/services/logistics.service';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { SessionService } from '@core/states-v2/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { MenuService } from '@core/services-v2/menu/menu.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ITiendaLocation } from '@core/services-v2/geolocation/models/geolocation.interface';
import { ModalStoresComponent } from 'src/app/modules/header/components/modal-stores/modal-stores.component';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnDestroy, OnInit {
  private destroy$: Subject<any> = new Subject();
  @ViewChild('modalLogin', { static: false })
  modalLoginTemp!: TemplateRef<any>;
  @ViewChild('menuTienda', { static: false }) menuTienda!: DropdownDirective;
  @ViewChild(DropdownDirective, { static: false })
  dropdown!: DropdownDirective;
  modalLoginRef!: BsModalRef;

  isOpen = false;
  // accountLinks: MobileMenuItem[] = [];
  accountLinks: any[] = [];
  links: MobileMenuItem[] = mobileMenu;
  logoSrc = environment.logoSrcWhite;
  usuario!: ISession | null;
  isB2B: boolean;
  direccion!: ShippingAddress | undefined | null;
  isVacio = isVacio;
  innerWidth: number;
  despachoCliente!: Subscription;

  items: NavigationLink[] = [];
  private categoriaDetalle: any;
  private arrayCategorias: NavigationLink[] = [];
  private segundoNivel: any;
  tiendaSeleccionada!: ITiendaLocation;
  constructor(
    public mobilemenu: MobileMenuService,
    private localS: LocalStorageService,
    private modalService: BsModalService,
    private categoriesService: CategoryService,
    private root: RootService,
    private logisticsService: LogisticsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly sessionStorage: SessionStorageService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly menuService: MenuService,
    private readonly geolocationService: GeolocationServiceV2
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.obtieneCategorias();
    this.isB2B = this.sessionService.isB2B();
  }

  ngOnInit() {
    this.mobilemenu.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => (this.isOpen = isOpen));
    this.subscribeLogin();
    this.updateLink();
    this.tiendaSeleccionada = this.geolocationService.getSelectedStore();

    this.geolocationService.location$.subscribe({
      next: (res) => {
        this.tiendaSeleccionada = res.tiendaSelecciona;
        if (res.esNuevaUbicacion) {
          setTimeout(() => {
            if (this.menuTienda) this.menuTienda.open();
          }, 700);
        }
      },
    });

    this.root.getPreferenciasCliente().then((preferencias) => {
      this.direccion = preferencias.direccionDespacho;
    });

    this.despachoCliente = this.logisticsService.direccionCliente$.subscribe(
      (r) => {
        this.direccion = r;
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
    this.despachoCliente.unsubscribe();
  }

  onItemClick(event: MobileMenuItem): void {
    if (event.type === 'link') {
      this.mobilemenu.close();
    }

    if (event.cod) {
      if (event.cod === 'iniciaSesion') {
        this.showModalLogin();
      }
    }
  }

  showModalLogin() {
    this.modalLoginRef = this.modalService.show(this.modalLoginTemp, {
      class: 'modal-100',
    });
  }

  verifySession(isLogin: any) {
    if (isLogin) {
      this.modalLoginRef.hide();
    }
  }

  close_movilMenu() {
    this.mobilemenu.close();
  }

  subscribeLogin() {
    this.authStateService.session$.subscribe(() => {
      this.updateLink();
    });
  }

  updateLink() {
    const isLogin = this.sessionService.isLoggedIn();
    this.usuario = this.sessionStorage.get();

    if (isLogin) {
      const nameUser = this.usuario?.firstName + ' ' + this.usuario?.lastName;
      const myAccount = this.menuService.get(this.usuario?.userRole || 'temp');
      this.accountLinks = [
        { type: 'button', label: nameUser },
        { type: 'button', label: 'Mi Cuenta', children: myAccount },
      ];
      this.links = [
        {
          type: 'link',
          label: 'Acerca de nosotros',
          url: '/sitio/acerca-de-nosotros',
        },
        {
          type: 'link',
          label: 'Términos y condiciones',
          url: '/sitio/termino-y-condiciones',
        },
        { type: 'link', label: 'Contacto', url: '/sitio/contacto' },
      ];
    } else {
      this.accountLinks = this.links = [
        {
          type: 'button',
          label: 'Ingresar',
          cod: 'iniciaSesion',
          icon: 'fas fa-user',
        },
      ];
      this.links = [
        {
          type: 'link',
          label: 'Acerca de nosotros',
          url: '/sitio/acerca-de-nosotros',
        },
        {
          type: 'link',
          label: 'Términos y condiciones',
          url: '/sitio/termino-y-condiciones',
        },
        { type: 'link', label: 'Contacto', url: '/sitio/contacto' },
        { type: 'link', label: 'Ver Catálogo', url: '/sitio/catalogos-zonas' },
      ];
    }
  }

  obtieneCategorias() {
    this.categoriesService.$categoriasHeader.subscribe((r) => {
      const categorias: CategoryApi[] = r.data;
      this.sortCategories(categorias);
      this.formatCategories(categorias);
    });
  }

  formatCategories(data: CategoryApi[]) {
    for (const primeraCategoria of data) {
      this.categoriaDetalle = {
        url: [
          '/',
          'inicio',
          'productos',
          'todos',
          'categoria',
          this.root.replaceSlash(primeraCategoria.url),
        ],
        label: `${primeraCategoria.title}`,
        menu: [],
      };
      if (primeraCategoria.children) {
        for (const segundaCategoria of primeraCategoria.children) {
          this.segundoNivel = {
            items: [
              {
                label: `${segundaCategoria.title}`,
                url: [
                  '/',
                  'inicio',
                  'productos',
                  'todos',
                  'categoria',
                  this.root.replaceSlash(primeraCategoria.url),
                  this.root.replaceSlash(segundaCategoria.url),
                ],
                items: '',
              },
            ],
          };
          const tercerNivel = [];
          if (segundaCategoria.children) {
            for (const terceraCategoria of segundaCategoria.children) {
              const dataLineas = {
                label: `${terceraCategoria.title}`,
                url: [
                  '/',
                  'inicio',
                  'productos',
                  'todos',
                  'categoria',
                  this.root.replaceSlash(primeraCategoria.url),
                  this.root.replaceSlash(segundaCategoria.url),
                  this.root.replaceSlash(terceraCategoria.url),
                ],
              };
              tercerNivel.push(dataLineas);
            }
          }
          this.segundoNivel.items[0].items = tercerNivel;
          this.categoriaDetalle.menu.push(this.segundoNivel.items[0]);
        }
      }
      this.arrayCategorias.push(this.categoriaDetalle);
    }
    this.items = this.arrayCategorias;
  }

  private sortCategories(items: any) {
    for (const item of items) {
      const segundaCategoria = item.children;

      segundaCategoria.sort((a: any, b: any) => {
        if (a.children.length < b.children.length) {
          return 1;
        }
        if (a.children.length > b.children.length) {
          return -1;
        }
        return 0;
      });
    }
  }

  abrirModalTiendas() {
    this.modalService.show(ModalStoresComponent);
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
}
