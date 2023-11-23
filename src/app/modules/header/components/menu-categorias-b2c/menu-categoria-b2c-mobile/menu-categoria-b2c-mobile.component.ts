import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryApi } from '../../../../../shared/interfaces/category-api';
import { NavigationLink } from '../../../../../shared/interfaces/navigation-link';
import { CategoryService } from '../../../../../shared/services/category.service';
import { MenuCategoriasB2cService } from '../../../../../shared/services/menu-categorias-b2c.service';
import { RootService } from '../../../../../shared/services/root.service';
import { LogisticsService } from '../../../../../shared/services/logistics.service';
import {
  GeoLocation,
  TiendaLocation,
} from '../../../../../shared/interfaces/geo-location';
import { CartService } from '../../../../../shared/services/cart.service';
import { GeoLocationService } from '../../../../../shared/services/geo-location.service';
import { DropdownDirective } from '../../../../../shared/directives/dropdown.directive';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
@Component({
  selector: 'app-menu-categoria-b2c-mobile',
  templateUrl: './menu-categoria-b2c-mobile.component.html',
  styleUrls: ['./menu-categoria-b2c-mobile.component.scss'],
})
export class MenuCategoriaB2cMobileComponent implements OnInit {
  private destroy$: Subject<any> = new Subject();
  items: NavigationLink[] = [];
  items_oficial: any[] = [];
  isOpen = false;
  templateTiendaModal!: TemplateRef<any>;
  modalRefTienda!: BsModalRef;
  tiendaSeleccionada!: TiendaLocation | undefined;
  private categoriaDetalle: any;
  private arrayCategorias: NavigationLink[] = [];
  private segundoNivel: any;
  private categoriaDetalleOficial: any;
  private arrayCategoriasOficial: NavigationLink[] = [];
  private segundoNivelOficial: any;
  categorias_oficial: any[] = [
    {
      title: 'TIENDAS OFICIALES',
      id: 1000,
      products: 0,
      url: '/tiendas-oficiales/',
      children: [
        {
          title: 'BLACKSMITH',
          products: 0,
          url: '/blacksmith/',
          children: [],
          id: 1001,
        },
        {
          title: 'GOTEK',
          products: 0,
          url: '/gotek/',
          children: [],
          id: 1002,
        },
        {
          title: 'INDIANA',
          products: 0,
          url: '/indiana/',
          children: [],
          id: 1002,
        },
        {
          title: 'MARCOPOLO',
          products: 0,
          url: '/marcopolo/',
          children: [],
          id: 1004,
        },
        {
          title: 'POWERTRUCK',
          products: 0,
          url: '/powertruck/',
          children: [],
          id: 1005,
        },
        {
          title: 'RANDON',
          products: 0,
          url: '/randon/',
          children: [],
          id: 1006,
        },
      ],
    },
  ];
  @ViewChild('menuTienda', { static: false }) menuTienda!: DropdownDirective;
  constructor(
    public menuCategorias: MenuCategoriasB2cService,
    private categoriesService: CategoryService,
    private modalService: BsModalService,
    private router: Router,
    public localS: LocalStorageService,
    private logisticsService: LogisticsService,
    private geoLocationService: GeoLocationService,
    private cartService: CartService,
    private root: RootService
  ) {
    this.obtieneCategorias();
  }

  ngOnInit() {
    this.menuCategorias.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => (this.isOpen = isOpen));
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
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  obtieneCategorias() {
    this.categoriesService.$categoriasHeader.subscribe((r) => {
      const categorias: CategoryApi[] = r.data;
      this.sortCategories(categorias);
      this.formatCategories(categorias);
      this.formatCategories2(this.categorias_oficial);
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

      for (const segundaCategoria of primeraCategoria.children || []) {
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
        for (const terceraCategoria of segundaCategoria.children || []) {
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

        this.segundoNivel.items[0].items = tercerNivel;
        this.categoriaDetalle.menu.push(this.segundoNivel.items[0]);
      }
      this.arrayCategorias.push(this.categoriaDetalle);
    }
    this.items = this.arrayCategorias;
  }

  private sortCategories(items: any) {
    for (const item of items) {
      const segundaCategoria: any[] = item.children;

      segundaCategoria.sort((a, b) => {
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

  // Mostrar client
  abrirModalTiendas() {
    this.modalRefTienda = this.modalService.show(this.templateTiendaModal);
    this.logisticsService.obtenerTiendas().subscribe();
  }

  async validarCuenta() {
    this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
    // // @ts-ignore
    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  estableceModalTienda(template: any) {
    this.templateTiendaModal = template;
  }
  //datos tienda oficial
  formatCategories2(data: CategoryApi[]) {
    for (const primeraCategoria of data) {
      this.categoriaDetalleOficial = {
        url: ['/', 'inicio', 'productos'],
        label: `${primeraCategoria.title}`,
        menu: [],
      };

      for (const segundaCategoria of primeraCategoria.children || []) {
        this.segundoNivelOficial = {
          items: [
            {
              label: `${segundaCategoria.title}`,
              url: [
                '/',
                'inicio',
                'productos',
                this.root.replaceSlash(segundaCategoria.url),
              ],
              items: '',
            },
          ],
        };
        const tercerNivel: any[] = [];
        this.segundoNivelOficial.items[0].items = tercerNivel;
        this.categoriaDetalleOficial.menu.push(
          this.segundoNivelOficial.items[0]
        );
      }
      this.arrayCategoriasOficial.push(this.categoriaDetalleOficial);
    }
    this.items_oficial = this.arrayCategoriasOficial;
    console.log('items', this.items_oficial);
  }
}
