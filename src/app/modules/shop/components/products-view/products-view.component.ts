import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  HostListener,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Link } from '../../../../shared/interfaces/link';
import { RootService } from '../../../../shared/services/root.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SessionService } from '@core/services-v2/session/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
export type Layout = 'grid' | 'grid-with-features' | 'list';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent {
  @Input() products!: any[];
  @Input() layout: Layout = 'grid';
  @Input() grid: 'grid-3-sidebar' | 'grid-4-full' | 'grid-5-full' =
    'grid-3-sidebar';
  @Input() limit = 12;
  @Input() cargandoCatalogo = true;
  @Input() cargandoProductos = false;
  @Input() showProductOptions = true;
  @Input() origen!: string[];
  @Input() breadcrumbs: Link[] = [];
  param: any = {};
  @Input() textToSearch: any = null;
  @Input() totalPaginas = 0;
  @Input() desde = 0;
  @Input() hasta = 0;
  @Input() currentPage: number = 1;
  @Input() totalRegistros = 0;
  @Output() cambiaPagina: EventEmitter<any> = new EventEmitter();
  @Output() itemPorPagina: EventEmitter<number> = new EventEmitter();
  @Output() filterState: EventEmitter<number> = new EventEmitter();
  usuario!: ISession;
  isB2B: boolean;
  tipo_orden = null;
  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Input() paramsCategory!: any;

  listItemPage: any[] = [];
  location: String;
  selectedItem = this.limit;
  innerWidth: number;
  url: string;

  constructor(
    @Inject(DOCUMENT) document: any,
    private root: RootService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    this.location = document.location.search;
    this.url = window.location.href;

    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    if (this.innerWidth < 1025) {
      this.selectedItem = 12;
      this.listItemPage = [
        { id: 12, value: 12 },
        { id: 24, value: 24 },
        { id: 36, value: 36 },
        { id: 48, value: 48 },
        { id: 60, value: 60 },
      ];
    } else {
      this.selectedItem = 15;
      this.listItemPage = [
        { id: 15, value: 15 },
        { id: 30, value: 30 },
        { id: 45, value: 45 },
        { id: 60, value: 60 },
        { id: 120, value: 120 },
      ];
    }

    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.isB2B =
      this.usuario.userRole === 'supervisor' ||
      this.usuario.userRole === 'comprador';
  }
  ngOnInit() {
    if (
      this.usuario.userRole !== 'supervisor' &&
      this.usuario.userRole !== 'comprador'
    ) {
      this.gtmService.pushTag({
        event: 'categorie_view',
        pagePath: this.url,
      });
    }
  }
  ngOnChanges() {
    if (this.textToSearch.includes('SKU:'))
      this.textToSearch = this.textToSearch.substring(
        4,
        this.textToSearch.length
      );
    if ((this.textToSearch?.length || 0) > 70)
      this.textToSearch = 'Búsqueda personalizada';
  }

  onPageChange(pageNumber: number): void {
    const page = pageNumber + 1;
    if (page <= this.totalPaginas) {
      this.cambiaPagina.emit({
        page,
        scroll: true,
      });
    }
  }

  obtieneItemPorPagina() {
    this.itemPorPagina.emit(this.selectedItem);
  }

  setVisibleFilter(state: any) {
    this.filterState.emit(state);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < 1025) {
      this.selectedItem = 12;
      this.listItemPage = [
        { id: 12, value: 12 },
        { id: 24, value: 24 },
        { id: 36, value: 36 },
        { id: 48, value: 48 },
        { id: 60, value: 60 },
      ];
    } else {
      this.selectedItem = 15;
      this.listItemPage = [
        { id: 15, value: 15 },
        { id: 30, value: 30 },
        { id: 45, value: 45 },
        { id: 60, value: 60 },
        { id: 120, value: 120 },
      ];
    }
  }

  decodedUrl(cadena: string) {
    return decodeURIComponent(cadena);
  }

  ChangeOrdenar() {
    if (this.tipo_orden != null) this.sort.emit(this.tipo_orden);
  }
}
