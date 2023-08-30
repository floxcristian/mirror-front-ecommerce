import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from '../../../../shared/services/products.service';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartService } from '../../../../shared/services/cart.service';
import { WishlistService } from '../../../../shared/services/wishlist.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive';
import { LocalStorageService } from 'angular-2-local-storage';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { GeoLocation, TiendaLocation } from '../../../../shared/interfaces/geo-location';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { MenuCategoriasB2cService } from '../../../../shared/services/menu-categorias-b2c.service';
declare let dataLayer: any;

@Component({
    selector: 'app-mobile-search',
    templateUrl: './mobile-search.component.html',
    styleUrls: ['./mobile-search.component.scss']
})
export class MobileSearchComponent implements OnInit {
    @ViewChild('modalSearch', { read: TemplateRef, static: false }) template: TemplateRef<any>;
    @ViewChild('menuSearch', { static: false }) listSearch: ElementRef;
    @ViewChild('searchChasis', { static: false }) searchChasis: ElementRef;
    @ViewChild('menuTienda', { static: false }) menuTienda: DropdownDirective;
    @ViewChild('modalChasis', { static: false }) modalChasis: DropdownDirective;
    @ViewChild(DropdownDirective, { static: false }) dropdown: DropdownDirective;

    destroy$: Subject<boolean> = new Subject<boolean>();

    modalRef: BsModalRef;

    // Modal Tienda
    templateTiendaModal: TemplateRef<any>;
    modalRefTienda: BsModalRef;

    public texto = '';
    public textToSearch = '';
    public categorias = [];
    public marcas = [];
    public sugerencias = [];
    public productosEncontrados = [];
    public mostrarContenido = false;
    public mostrarCargando = false;
    public linkBusquedaProductos = '#';
    public searchControl: FormControl;
    private debounce = 100;
    public buscando = true;
    back_key = false;
    public mostrarResultados = false;

    public sessionNotStarted = false;
    public loadCart = false;
    public tiendaSeleccionada: TiendaLocation;
    seleccionado = false;
    public isFocusedInput = false;
    constructor(
        private router: Router,
        private modalService: BsModalService,
        private productsService: ProductsService,
        public root: RootService,
        private toastr: ToastrService,
        public cart: CartService,
        public menuCategorias: MenuCategoriasB2cService,
        public wishlist: WishlistService,
        public localS: LocalStorageService,
        private geoLocationService: GeoLocationService,
        private logisticsService: LogisticsService,
        private cartService: CartService
    ) { }

    ngOnInit() {
        this.searchControl = new FormControl('');
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce), distinctUntilChanged()).subscribe(query => {
            if (query.trim() !== '') {
                this.textToSearch = query;
                this.buscarSelect();
            } else {
                this.categorias = [];
                this.productosEncontrados = [];
            }
        });

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

    ngAfterViewInit() { }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public reset() {
        this.buscando = true;
    }

    onKeyPress(params: any) {
        if (params.key === 'Backspace') {
            this.back_key = false;
        } else this.back_key = false;
    }

    public buscar() {
        dataLayer.push({
            event: 'search',
            busqueda: this.textToSearch
        });

        if (this.textToSearch.trim() === '') {
            this.toastr.info('Debe ingresar un texto para buscar', 'Información');
            return;
        }
        let search = this.textToSearch.replace('/', '%2F');
        this.router.navigateByUrl('inicio/productos/' + search);
        this.mostrarContenido = true;
        this.mostrarCargando = true;
        this.mostrarResultados = false;

        setTimeout(() => {
            this.dropdown.close();
        }, 500);
    }

    public buscarChasis() {
        if (this.searchChasis.nativeElement.value.trim().length > 0) {
            const textToSearch = this.searchChasis.nativeElement.value.trim();
            // var data = `VIM__${textToSearch}`;

            this.router.navigate([`inicio/productos/todos`], { queryParams: { chassis: textToSearch } });
        } else {
            this.toastr.info('Debe ingresar un texto para buscar', 'Información');
        }
    }

    public buscarSelect() {
        this.mostrarContenido = true;
        this.mostrarCargando = true;
        this.linkBusquedaProductos = this.textToSearch;
        if (!this.back_key && this.textToSearch.length > 3) {
            this.back_key = false;
            this.productsService
                .buscarProductosElactic(this.textToSearch)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (r: any) => {
                        if (!this.seleccionado) {
                            this.dropdown.open();
                        }

                        this.mostrarCargando = false;
                        this.categorias = r.categorias;
                        this.marcas = r.marcas;
                        this.productosEncontrados = r.articulos;
                        this.sugerencias = r.sugerencias;

                        if (this.productosEncontrados.length === 0) {
                            this.buscando = false;
                        }

                        this.categorias.map(item => {
                            item.url = ['/', 'inicio', 'productos', this.textToSearch, 'categoria', item.slug];
                            if (typeof item.name === 'undefined') {
                                item.name = 'Sin categorias';
                            }
                        });

                        this.productosEncontrados.map(item => {
                            item.url = ['/', 'inicio', 'productos', item.sku];
                        });
                    },
                    error => {
                        this.toastr.error('Error de conexión con el servidor de Elastic');
                        console.error('Error de conexión con el servidor de Elastic');
                    }
                );
        }
    }

    public mostraModalBuscador() {
        this.modalRef = this.modalService.show(this.template, { class: 'modal-xl modal-buscador' });
        this.root.setModalRefBuscador(this.modalRef);
    }

    // Mostrar client
    abrirModalTiendas() {
        this.modalRefTienda = this.modalService.show(this.templateTiendaModal);
        this.logisticsService.obtenerTiendas().subscribe();
    }

    estableceModalTienda(template) {
        this.templateTiendaModal = template;
    }

    clearbusquedaChasis() {
        this.searchChasis.nativeElement.value = '';
    }

    focusSearchChasis() {
        this.searchChasis.nativeElement.focus();
    }

    buscarGtag() {
        dataLayer.push({
            event: 'search',
            busqueda: this.textToSearch
        });
    }

    async validarCuenta() {
        this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
        // let usuario = this.localS.get('usuario');

        // if (!usuario) {
        //     this.router.navigate(['sitio', 'iniciar-sesion']);
        //     return
        // }

        // // @ts-ignore
        // if (usuario.hasOwnProperty('login_temp') && usuario.login_temp === true) {
        //     return this.router.navigate(['sitio', 'iniciar-sesion']);
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
}
