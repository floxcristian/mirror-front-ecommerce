import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryApi } from '../../../../shared/interfaces/category-api';
import { NavigationLink } from '../../../../shared/interfaces/navigation-link';
import { CategoryService } from '../../../../shared/services/category.service';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
import { RootService } from '../../../../shared/services/root.service';
import { CmsService } from '@core/services-v2/cms.service';
import { IChildren } from '@core/models-v2/cms/categories-response.interface';

@Component({
  selector: 'app-menu-categorias-b2c',
  templateUrl: './menu-categorias-b2c.component.html',
  styleUrls: ['./menu-categorias-b2c.component.scss'],
})
export class MenuCategoriasB2cComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject();
  items: NavigationLink[] = [];
  items_oficial: any[] = [];
  isOpen = false;

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

  constructor(
    public menuCategorias: MenuCategoriasB2cService,
    private categoriesService: CategoryService,
    private root: RootService,
    //Services V2
    private readonly cmsService: CmsService
  ) {
    this.obtieneCategorias();
  }

  ngOnInit() {
    this.menuCategorias.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => (this.isOpen = isOpen));
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  obtieneCategorias() {
    // this.cmsService.getCategories().subscribe({
    //   next:(res)=>{
    //     const categorias: IChildren[] = res.data;
    //     this.sortCategories(categorias);
    //     this.formatCategories(categorias);
    //     this.formatCategories2(this.categorias_oficial);
    //   },
    //   error:(err)=>{
    //     console.log(err)
    //   }
    // })
    this.categoriesService.$categoriasHeader.subscribe((r) => {
      console.log('categorias', r);
      const categorias: CategoryApi[] = r.data;
      this.sortCategories(categorias);
      this.formatCategories(categorias);
      this.formatCategories2(this.categorias_oficial);
    });
  }

  formatCategories(data: any[]) {
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

  private sortCategories(items: any[]) {
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
