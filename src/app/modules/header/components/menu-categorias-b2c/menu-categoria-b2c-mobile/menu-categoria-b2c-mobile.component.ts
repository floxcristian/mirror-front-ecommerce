import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationLink } from '../../../../../shared/interfaces/navigation-link';
import { MenuCategoriasB2cService } from '../../../../../shared/services/menu-categorias-b2c.service';
import { RootService } from '../../../../../shared/services/root.service';
import { CartService } from '../../../../../shared/services/cart.service';
import { DropdownDirective } from '../../../../../shared/directives/dropdown.directive';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { ModalStoresComponent } from '../../modal-stores/modal-stores.component';
import {
  ICategoryDetail,
  IChildren,
  ISecondLvl,
  IThirdLvl,
} from '@core/models-v2/cms/categories-response.interface';
import { CmsService } from '@core/services-v2/cms.service';
import { StorageKey } from '@core/storage/storage-keys.enum';
@Component({
  selector: 'app-menu-categoria-b2c-mobile',
  templateUrl: './menu-categoria-b2c-mobile.component.html',
  styleUrls: ['./menu-categoria-b2c-mobile.component.scss'],
})
export class MenuCategoriaB2cMobileComponent implements OnInit {
  private destroy$: Subject<any> = new Subject();
  items: NavigationLink[] = [];
  items_oficial: NavigationLink[] = [];
  isOpen = false;
  tiendaSeleccionada!: ISelectedStore;
  private categoriaDetalle!: ICategoryDetail;
  private arrayCategorias: NavigationLink[] = [];
  private segundoNivel!: ISecondLvl;
  private categoriaDetalleOficial!: ICategoryDetail;
  private arrayCategoriasOficial: NavigationLink[] = [];
  private segundoNivelOficial!: ISecondLvl;
  categorias_oficial: IChildren[] = [
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
    private modalService: BsModalService,
    private router: Router,
    public localS: LocalStorageService,
    private cartService: CartService,
    private root: RootService,
    // Services V2
    private readonly geolocationService: GeolocationServiceV2,
    private readonly cmsService: CmsService
  ) {
    this.obtieneCategorias();
  }

  ngOnInit() {
    this.menuCategorias.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => (this.isOpen = isOpen));

    console.log('getSelectedStore desde MenuCategoriaB2cMobileComponent');
    this.tiendaSeleccionada = this.geolocationService.getSelectedStore();

    this.geolocationService.selectedStore$.subscribe({
      next: (res) => {
        console.log(
          'selectedStore$ desde [MenuCategoriaB2cMobileComponent]===================='
        );
        this.tiendaSeleccionada = res;
        this.cartService.calc();
        if (res.isChangeToNearestStore) {
          setTimeout(() => {
            if (this.menuTienda) this.menuTienda.open();
          }, 700);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  obtieneCategorias() {
    this.cmsService.getCategories().subscribe({
      next: (res) => {
        const categorias: IChildren[] = res.data;
        this.sortCategories(categorias);
        this.formatCategories(categorias);
        this.formatCategories2(this.categorias_oficial);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  formatCategories(data: IChildren[]) {
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
              items: [],
            },
          ],
        };

        const tercerNivel: IThirdLvl[] = [];
        for (const terceraCategoria of segundaCategoria.children || []) {
          const dataLineas: IThirdLvl = {
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

  private sortCategories(items: IChildren[]) {
    for (const item of items) {
      const segundaCategoria: IChildren[] = item.children;

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

  showStores(): void {
    this.modalService.show(ModalStoresComponent);
  }

  async validarCuenta() {
    this.localS.set(StorageKey.ruta, ['/', 'mi-cuenta', 'seguimiento']);
    // // @ts-ignore
    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  //datos tienda oficial
  formatCategories2(data: IChildren[]) {
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
              items: [],
            },
          ],
        };
        const tercerNivel: IThirdLvl[] = [];
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
