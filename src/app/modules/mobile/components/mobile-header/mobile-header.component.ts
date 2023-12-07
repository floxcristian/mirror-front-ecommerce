import {
  Component,
  TemplateRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartService } from '../../../../shared/services/cart.service';
import { Subject } from 'rxjs';
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service';
import { environment } from '@env/environment';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ModalStoresComponent } from 'src/app/modules/header/components/modal-stores/modal-stores.component';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
})
export class MobileHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('menuSearch', { static: false }) dropdown!: DropdownDirective;
  @ViewChild('modalSearch', { read: TemplateRef, static: false })
  template!: TemplateRef<any>;
  @ViewChild('modalsearchVin', { read: TemplateRef, static: false })
  templateVin!: TemplateRef<any>;
  @ViewChild('menuTienda', { static: false }) menuTienda!: DropdownDirective;
  destroy$: Subject<boolean> = new Subject<boolean>();
  logoSrc = environment.logoSrc;
  modalRef!: BsModalRef;
  modalRefVin!: BsModalRef;
  isFocusedInput: boolean = false;
  texto: any = '';
  numeroVIN: any = '';
  textToSearch: any = '';
  categorias: any[] = [];
  marcas: any[] = [];
  sugerencias: any[] = [];
  productosEncontrados: any[] = [];
  mostrarContenido = false;
  mostrarCargando = false;
  linkBusquedaProductos = '#';
  searchControl!: FormControl;
  private debounce = 1000;
  buscando = true;

  mostrarResultados = false;

  constructor(
    public menu: MobileMenuService,
    public menuCategorias: MenuCategoriasB2cService,
    private router: Router,
    private modalService: BsModalService,
    private productsService: ProductsService,
    public root: RootService,
    private logisticsService: LogisticsService,
    private toastr: ToastrService,
    public cart: CartService,
    public localS: LocalStorageService,
    private readonly gtmService: GoogleTagManagerService
  ) {}

  ngOnInit() {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim() !== '') {
          this.textToSearch = query;
          this.buscarEnModal();
        } else {
          this.categorias = [];
          this.productosEncontrados = [];
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  reset() {
    this.buscando = true;
  }

  buscar() {
    this.gtmService.pushTag({
      event: 'search',
      busqueda: this.textToSearch,
    });
    this.router.navigate([`inicio/productos/${this.textToSearch}`]);
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.mostrarResultados = false;

    setTimeout(() => {
      this.dropdown.close();
    }, 500);
  }

  buscarEnModal() {
    this.mostrarContenido = true;
    this.mostrarCargando = true;
    this.linkBusquedaProductos = this.texto;
    if (this.texto.length > 3) {
      this.productsService.buscarProductosElactic(this.texto).subscribe(
        (r: any) => {
          this.mostrarCargando = false;
          this.categorias = r.categorias;
          this.marcas = r.marcas;
          this.productosEncontrados = r.articulos;
          this.sugerencias = r.sugerencias;

          if (this.productosEncontrados.length === 0) {
            this.buscando = false;
          }

          this.categorias.map((item: any) => {
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

          this.productosEncontrados.map((item: any) => {
            item.url = ['/', 'inicio', 'productos', 'ficha', item.sku];
          });
        },
        (error) => {
          this.toastr.error('Error de conexión con el servidor de Elastic');
          console.error('Error de conexión con el servidor de Elastic');
        }
      );
    }
  }

  buscarEnModalVin(event: any) {
    if (this.numeroVIN.trim().length > 0) {
      var textToSearch = this.numeroVIN.trim();
      var data = `VIM__${textToSearch}`;

      this.router.navigate([`inicio/productos/${data}`]);
    } else {
      this.toastr.info('Debe ingresar un texto para buscar', 'Información');
    }
  }

  mostraModalBuscador() {
    this.modalRef = this.modalService.show(this.template, {
      class: 'modal-100 modal-buscador modal-new',
    });
    this.root.setModalRefBuscador(this.modalRef);
    document.getElementById('searchMobileModal')?.focus();
  }

  mostraModalBuscadorVin() {
    this.modalRefVin = this.modalService.show(this.templateVin, {
      class: 'modal-buscadorVin-container modal-buscadorVin',
    });
  }

  Hidebar() {
    let url = null;
    if (this.router.url.split('?')[0] != undefined) {
      url = '' + this.router.url.split('?')[0];
    }
    if (this.router.url.includes('/carro-compra/')) {
      return false;
    } else {
      return true;
    }
  }

  abrirModalTiendas() {
    this.modalService.show(ModalStoresComponent);
    this.logisticsService.obtenerTiendas().subscribe();
  }

  async validarCuenta() {
    this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  focusInput() {
    this.isFocusedInput = true;
  }

  blurInput() {
    this.isFocusedInput = false;
  }
}
