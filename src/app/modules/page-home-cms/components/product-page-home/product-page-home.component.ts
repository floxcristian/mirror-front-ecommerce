import {
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
import { RootService } from '../../../../shared/services/root.service'
import { Usuario } from '../../../../shared/interfaces/login'
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente'
import { Subscription } from 'rxjs'
import { isVacio } from '../../../../shared/utils/utilidades'
import { Router } from '@angular/router'
import { DirectionService } from '../../../../shared/services/direction.service'
import { VerMasProductoComponent } from '../ver-mas-producto/ver-mas-producto.component'
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { isPlatformBrowser } from '@angular/common'

interface ITempProduct {
  _id: any
  skus: any[]
  url: any
  title: any
  image: any
}

@Component({
  selector: 'app-product-page-home',
  templateUrl: './product-page-home.component.html',
  styleUrls: ['./product-page-home.component.scss'],
})
export class ProductPageHomeComponent implements OnInit, OnDestroy {
  @Input() set producto(value: any) {
    this.id = value.id
    this.tipo_producto = value.elemento
  }
  @Input() lstProductos: any[] = []
  @Input() url: any[] = []
  @ViewChild('popoverContent', { static: false }) myPopover!: NgbPopover
  // Variables no existentes.
  isB2B!: boolean
  popoverContent!: any

  tipo_producto!: ITempProduct[]
  user!: Usuario
  id!: string
  layout = 'grid-lg'
  preferenciasCliente!: PreferenciasCliente
  despachoCliente!: Subscription

  ruta: string = ''
  refresh = false
  refresh2 = false
  cargando = true
  bsModalRef?: BsModalRef
  producto_selecionado: any
  index_seleccionado = 0
  sPosition = 0
  screenWidth: any
  screenHeight: any
  constructor(
    private root: RootService,
    private router: Router,
    private modalService: BsModalService,
    private direction: DirectionService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900
    this.tamanho_layout()
  }
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: false,

    responsiveClass: true,
    autoplayTimeout: 4000,
    responsive: {
      920: { items: 4 },
      800: { items: 4 },
      768: { items: 3 },
      500: { items: 3 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  }
  carouselOptions3 = {
    nav: true,
    autowidth: true,
    responsiveClass: true,
    startPosition: 0,
    loop: true,
    items: 1,
    autoplay: false,
  }

  carouselOptions2 = {
    nav: true,
    autowidth: true,
    responsiveClass: true,
    loop: true,
    startPosition: 0,
    items: 1.4,
    autoplay: false,
  }
  ngOnInit() {
    this.index_seleccionado = this.sPosition
    this.ruta = this.router.url === '/inicio' ? 'home' : this.router.url
    this.user = this.root.getDataSesionUsuario()
    this.cargarHome()
  }

  ngOnDestroy(): void {
    if (!isVacio(this.despachoCliente)) {
      this.despachoCliente.unsubscribe()
    }
  }

  //cargahome
  async cargarHome() {
    this.cargando = true

    //match entre los productos;
    this.match_listaProducto()
    this.cargando = false
  }

  async match_listaProducto() {
    this.tipo_producto.map((item) => {
      let filtro_sku: any = this.lstProductos.filter(
        (lstprod) => lstprod.nombre === item.title,
      )
      let filtro_url: any = this.url.filter(
        (link) => link.nombre === item.title,
      )

      if (filtro_sku.length > 0) {
        item.skus = filtro_sku[0].skus
        item.url = filtro_url[0].url
      }
    })
    this.producto_selecionado = this.tipo_producto[0]

    this.index_seleccionado = 0
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900
    this.tamanho_layout()
  }

  tamanho_layout() {
    if (this.screenWidth <= 768) {
      this.layout = 'grid-sm'
    } else this.layout = 'grid-lg'
  }

  over(event: any) {
    let el: any = event.target.parentNode
    let clase: any = el.classList
    while (!clase.contains('owl-item')) {
      el = el.parentNode
      clase = el.classList
    }

    el.style['box-shadow'] = '0 4px 4px 0 rgb(0 0 0 / 50%)'
  }

  leave(event: any) {
    let el: any = event.target.parentNode
    let clase: any = el.classList
    while (!clase.contains('owl-item')) {
      el = el.parentNode
      clase = el.classList
    }

    el.style['box-shadow'] = 'none'
  }

  get_precioEscala(event: any) {
    event.popover.open()
  }

  seleccionar(index: any) {
    this.producto_selecionado = this.tipo_producto[index]
    this.index_seleccionado = index
  }

  openModal(item: any) {
    this.bsModalRef = this.modalService.show(VerMasProductoComponent, {
      backdrop: 'static',
      keyboard: false,
      initialState: {
        data: item,
      },
    })
    this.bsModalRef.content.closeBtnName = 'Close'
  }
  async getData(event: any) {
    let index = event.startPosition
    if (index >= this.tipo_producto.length) index = 0
    this.refresh = true

    this.carouselOptions2 = { ...this.carouselOptions2, startPosition: index }
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('listo')
      }, 10)
    })
    this.refresh = false
    this.producto_selecionado = this.tipo_producto[index]
    this.index_seleccionado = index
  }
  async getData2(event: any) {
    let index = event.startPosition
    if (index >= this.tipo_producto.length) index = 0
    this.refresh2 = true
    this.carouselOptions3 = { ...this.carouselOptions3, startPosition: index }
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('listo')
      }, 10)
    })
    this.refresh2 = false
    this.producto_selecionado = this.tipo_producto[index]
    this.index_seleccionado = index
  }
}
