import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ElementRef,
  Input,
} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from 'ngx-bootstrap/modal'
import { ProductsService } from '../../../../shared/services/products.service'
import { RootService } from '../../../../shared/services/root.service'
import { ToastrService, ToastrModule } from 'ngx-toastr'

import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { CartService } from '../../../../shared/services/cart.service'
import { WishlistService } from '../../../../shared/services/wishlist.service'
import { Subject } from 'rxjs'
import { DropdownDirective } from '../../../../shared/directives/dropdown.directive'
import { LoginService } from '../../../../shared/services/login.service'
//import { LocalStorageService } from 'angular-2-local-storage';
import { MobileMenuService } from '../../../../shared/services/mobile-menu.service'
import { environment } from '../../../../../environments/environment'
import { MobileFiltrosComponent } from './components/mobile-filtros/mobile-filtros.component'
import { MobileBarraBusquedaComponent } from './components/mobile-barra-busqueda/mobile-barra-busqueda.component'
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service'

@Component({
  selector: 'app-mobile-header-b2b',
  templateUrl: './mobile-header-b2b.component.html',
  styleUrls: ['./mobile-header-b2b.component.scss'],
})
export class MobileHeaderB2bComponent implements OnInit, OnDestroy {
  @ViewChild('menuSearch', { static: false }) dropdown!: DropdownDirective
  @ViewChild('modalSearch', { read: TemplateRef, static: false })
  template!: TemplateRef<any>

  destroy$: Subject<boolean> = new Subject<boolean>()
  logoSrc = environment.logoSrcFooter

  modalRef!: BsModalRef
  modalRefVin!: BsModalRef

  public texto = ''
  public numeroVIN = ''
  public textToSearch = ''
  public categorias = []
  public marcas = []
  public productosEncontrados = []
  public mostrarContenido = false
  public mostrarCargando = false
  public linkBusquedaProductos = '#'
  public searchControl!: FormControl
  private debounce = 300
  public buscando = true

  public mostrarResultados = false

  constructor(
    public menu: MobileMenuService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private productsService: ProductsService,
    public root: RootService,
    private toastr: ToastrService,
    public cart: CartService,
    public wishlist: WishlistService,
    public loginService: LoginService,
    public localS: LocalStorageService,
  ) {}

  ngOnInit() {
    this.searchControl = new FormControl('')
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim() !== '') {
          this.textToSearch = query
          this.buscarEnModal()
        } else {
          this.categorias = []
          this.productosEncontrados = []
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  public reset() {
    this.buscando = true
  }

  public buscar() {
    this.router.navigate([`inicio/productos/${this.textToSearch}`])
    this.mostrarContenido = true
    this.mostrarCargando = true
    this.mostrarResultados = false

    setTimeout(() => {
      this.dropdown.close()
    }, 500)
  }

  public buscarEnModal() {
    this.mostrarContenido = true
    this.mostrarCargando = true
    this.linkBusquedaProductos = this.texto
    this.productsService.buscarProductosElactic(this.texto).subscribe(
      (r: any) => {
        this.mostrarCargando = false
        this.categorias = r.categorias
        this.marcas = r.marcas
        this.productosEncontrados = r.articulos

        if (this.productosEncontrados.length === 0) {
          this.buscando = false
        }

        this.categorias.map((item: any) => {
          item.url = [
            '/',
            'inicio',
            'productos',
            this.textToSearch,
            'categoria',
            item.slug,
          ]
          if (typeof item.name === 'undefined') {
            item.name = 'Sin categorias'
          }
        })
      },
      (error) => {
        this.toastr.error('Error de conexión con el servidor de Elastic')
        console.error('Error de conexión con el servidor de Elastic')
      },
    )
  }

  public buscarEnModalVin(event: any) {
    if (this.numeroVIN.trim().length > 0) {
      var textToSearch = this.numeroVIN.trim()
      var data = `VIM__${textToSearch}`

      this.router.navigate([`inicio/productos/${data}`])
    } else {
      this.toastr.info('Debe ingresar un texto para buscar', 'Información')
    }
  }

  public mostraModalBuscador() {
    this.modalRef = this.modalService.show(MobileBarraBusquedaComponent, {
      class: 'modal-100 modal-buscador',
    })
    // this.root.setModalRefBuscador(this.modalRef);
    // document.getElementById('searchMobileModal').focus();
  }

  public mostraModalBuscadorVin() {
    this.modalRefVin = this.modalService.show(MobileFiltrosComponent, {
      class: 'mx-md-auto mt-2',
    })
    this.modalRefVin.content.event.subscribe((res: any) => {
      if (res) {
        this.mostraModalBuscador()
      }
    })
  }

  Hidebar() {
    let url = null
    if (this.router.url.split('?')[0] != undefined) {
      url = '' + this.router.url.split('?')[0]
    }
    if (
      this.router.url === '/carro-compra/metodo-de-envio' ||
      this.router.url === '/carro-compra/forma-de-pago' ||
      url === '/carro-compra/forma-de-pago' ||
      this.router.url === '/carro-compra/resumen' ||
      this.router.url.includes('/carro-compra/omni-forma-de-pago')
    ) {
      return false
    } else {
      return true
    }
  }
}
