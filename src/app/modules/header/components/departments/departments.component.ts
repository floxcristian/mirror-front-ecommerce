import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { departments } from '../../../../../data/header-departments';
import { DepartmentsService } from '../../../../shared/services/departments.service';
import { NavigationLink } from '../../../../shared/interfaces/navigation-link';
import { isPlatformBrowser } from '@angular/common';
import { CategoryService } from '../../../../shared/services/category.service';
import { categories } from '../../../../../data/shop-widget-categories';
import { CategoryApi } from '../../../../shared/interfaces/category-api';
import { SlugifyPipe } from '../../../../shared/pipes/slugify.pipe';
import { ToastrService } from 'ngx-toastr';
import { RootService } from '../../../../shared/services/root.service';

@Component({
  selector: 'app-header-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  private destroy$: Subject<any> = new Subject();

  items: NavigationLink[] = [];
  private categoriaDetalle: NavigationLink;
  private arrayCategorias: NavigationLink[] = [];
  private segundoNivel: any;
  private sizeColumn: number;

  isOpen = true;
  fixed = false;

  private get element(): HTMLElement {
    return this.el.nativeElement;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private renderer: Renderer2,
    private el: ElementRef,
    private service: DepartmentsService,
    private categoriesService: CategoryService,
    private slugify: SlugifyPipe,
    private toastr: ToastrService,
    private root: RootService
  ) {
    this.obtieneCategorias();
  }

  ngOnInit(): void {}

  obtieneCategorias() {
    this.categoriesService.obtieneCategoriasHeader().subscribe(
      (r: any) => {
        const categorias: CategoryApi[] = r.data;
        this.sortCategories(categorias);

        this.formatCategories(categorias);
      },
      (e) => {
        this.toastr.error('Error de conexión con el servidor');
      }
    );
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
        menu: {
          type: 'megamenu',
          size: 'xl',
          image: 'assets/images/megamenu/megamenu-1.jpg',
          columns: [],
        },
      };

      // // agregamos los item internet
      for (const segundaCategoria of primeraCategoria.children) {
        // tamaño de la columna de bootstrap por defecto
        const rColumns = this.getSizeColumns(primeraCategoria.children.length);

        this.sizeColumn = rColumns.columnas;
        this.categoriaDetalle.menu['size'] = rColumns.estilo;

        this.segundoNivel = {
          size: this.sizeColumn,
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

        // Creamos tercer nivel -> Lineas
        const tercerNivel = [];
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

        this.segundoNivel.items[0].items = tercerNivel;
        this.categoriaDetalle.menu['columns'].push(this.segundoNivel);
      }
      this.arrayCategorias.push(this.categoriaDetalle);
    }

    this.items = this.arrayCategorias;

    this.updateCategories();
  }

  private sortCategories(items) {
    for (const item of items) {
      const segundaCategoria = item.children;

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

  getSizeColumns(columnas) {
    let sizeColumn = 3;
    let estilo = 'xxl';

    // modificamos el tamaño de las columnas
    if (columnas === 2 || columnas === 4) {
      estilo = 'lg';
      sizeColumn = 6;
    }

    if (columnas === 3 || columnas === 6 || columnas === 9) {
      estilo = 'xxl';
      sizeColumn = 4;
    }

    return { columnas: sizeColumn, estilo: estilo };
  }

  addChild(items: CategoryApi[], arrCategoria) {
    if (items.length > 0) {
      let cont = 0;
      for (const item of items) {
        const obj: NavigationLink = {
          label: item.title,
          url: [
            '/',
            'inicio',
            'productos',
            'todos',
            'categoria',
            this.root.replaceSlash(item.url),
          ],
        };
        arrCategoria.push(obj);
        if (item.children.length > 0) {
          arrCategoria[cont].items = [];
          this.addChild(item.children, arrCategoria[cont].items);
        }
        cont++;
      }
    }
  }

  updateCategories() {
    const root = this.element.querySelector('.departments') as HTMLElement;
    const content = this.element.querySelector(
      '.departments__links-wrapper'
    ) as HTMLElement;

    this.service.areaElement$
      .pipe(takeUntil(this.destroy$))
      .subscribe((areaElement) => {
        if (areaElement) {
          this.fixed = true;
          this.isOpen = true;

          if (isPlatformBrowser(this.platformId)) {
            const areaRect = areaElement.getBoundingClientRect();
            const areaBottom = areaRect.top + areaRect.height + window.scrollY;

            root.classList.remove('departments--transition');
            root.classList.add('departments--fixed', 'departments--opened');

            const height =
              areaBottom -
              (content.getBoundingClientRect().top + window.scrollY);

            content.style.height = `${height}px`;
            content.getBoundingClientRect(); // force reflow
          } else {
            this.renderer.addClass(root, 'departments--fixed');
            this.renderer.addClass(root, 'departments--opened');
          }
        } else {
          this.fixed = false;
          this.isOpen = false;

          if (isPlatformBrowser(this.platformId)) {
            root.classList.remove('departments--opened', 'departments--fixed');
            content.style.height = '';
          } else {
            this.renderer.removeClass(root, 'departments--fixed');
            this.renderer.removeClass(root, 'departments--opened');
          }
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      fromEvent<MouseEvent>(document, 'mousedown')
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (
            event.target instanceof HTMLElement &&
            !this.element.contains(event.target)
          ) {
            this.close();
          }
        });
      fromEvent<TransitionEvent>(content, 'transitionend')
        .pipe(takeUntil(this.destroy$))
        .subscribe((event) => {
          if (event.propertyName === 'height') {
            root.classList.remove('departments--transition');
          }
        });
    }
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen = true;

    const root = this.element.querySelector('.departments') as HTMLElement;
    const content = root.querySelector(
      '.departments__links-wrapper'
    ) as HTMLElement;
    const startHeight = content.getBoundingClientRect().height;

    root.classList.add('departments--transition', 'departments--opened');

    const endHeight = content.getBoundingClientRect().height;

    content.style.height = startHeight + 'px';
    content.getBoundingClientRect(); // force reflow
    content.style.height = endHeight + 'px';
  }

  public close(): void {
    if (this.fixed || !this.isOpen) {
      return;
    }

    this.isOpen = false;

    const root = this.element.querySelector('.departments') as HTMLElement;
    const content = root.querySelector(
      '.departments__links-wrapper'
    ) as HTMLElement;
    const startHeight = content.getBoundingClientRect().height;

    content.style.height = startHeight + 'px';

    root.classList.add('departments--transition');
    root.classList.remove('departments--opened');

    content.getBoundingClientRect(); // force reflow
    content.style.height = '';
  }
}
