import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryApi } from '../../../../shared/interfaces/category-api';
import { NavigationLink } from '../../../../shared/interfaces/navigation-link';
import { CategoryService } from '../../../../shared/services/category.service';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-menu-categorias-b2c',
  templateUrl: './menu-categorias-b2c.component.html',
  styleUrls: ['./menu-categorias-b2c.component.scss'],
})
export class MenuCategoriasB2cComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject();
  items: NavigationLink[] = [];
  isOpen = false;

  private categoriaDetalle: any;
  private arrayCategorias: NavigationLink[] = [];
  private segundoNivel: any;

  constructor(
    public menuCategorias: MenuCategoriasB2cService,
    private categoriesService: CategoryService,
    private root: RootService
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
}
