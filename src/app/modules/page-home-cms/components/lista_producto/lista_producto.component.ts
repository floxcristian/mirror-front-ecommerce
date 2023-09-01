import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Usuario } from '../../../../shared/interfaces/login';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { RootService } from '../../../../shared/services/root.service';
import { DirectionService } from '../../../../shared/services/direction.service';
import { PageHomeService } from '../../services/pageHome.service';
import { GeoLocation } from '../../../../shared/interfaces/geo-location';
import { PreferenciasCliente } from '../../../../shared/interfaces/preferenciasCliente';
import { isVacio } from '../../../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-lista_producto',
  templateUrl: './lista_producto.component.html',
  styleUrls: ['./lista_producto.component.scss'],
})
export class Lista_productoComponent implements OnInit {
  ruta: string = '';
  layout: any = 'grid-lg';
  @Input() url: any[] = [];
  @Input() lstProductos: any[] = [];
  @Input() set elemento(value: any) {
    this.productData = value;

    if (this.productData) {
      if (this.productData.elemento) {
        this.product_list = this.productData.elemento;
      } else this.product_list = this.productData.data;

      this.productList = this.product_list.values;
      this.title = this.product_list.title;
      this.subtitle = this.product_list.subtitle;
    }
  }
  carouselOptions = {
    items: 5,
    nav: true,
    navText: [
      `<div class="m-arrow__container" ><i class="fa-regular fa-chevron-left"></i></div>`,
      `<div class="m-arrow__container"><i class="fa-regular fa-chevron-right"></i></div>`,
    ],
    slideBy: 'page',
    dots: true,
    loop: true,
    responsiveClass: true,
    autoplay: false,
    autoplayTimeout: 4000,
    responsive: {
      1100: { items: 5 },
      920: { items: 5 },
      768: { items: 3 },
      680: { items: 3 },
      500: { items: 3 },
      0: { items: 2 },
    },
  };
  productData: any;
  @Output() elementoEvent: EventEmitter<any> = new EventEmitter();
  @Input() id = '-1';
  product_list: any;
  productList: any;
  preferenciasCliente!: PreferenciasCliente;
  products: any;
  user!: Usuario;
  cargar: boolean = false;
  title = 'Arrastre lista de elemento';
  subtitle!: string;
  screenWidth: any;
  screenHeight: any;
  isVacio = isVacio;
  constructor(
    private pageHomeService: PageHomeService,
    private root: RootService,
    private router: Router,
    private direction: DirectionService,
    private geoLocationService: GeoLocationService,
    private localStorage: LocalStorageService
  ) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnInit(): void {
    this.ruta = this.router.url === '/inicio' ? 'home' : this.router.url;
    this.user = this.root.getDataSesionUsuario();
    this.get_productos();
  }

  async get_productos() {
    this.cargar = true;
    await this.match_listaProducto();
  }
  async match_listaProducto() {
    let filtro_sku: any = this.lstProductos.filter(
      (lstprod) => lstprod.nombre === this.product_list.title
    );
    let filtro_url: any = this.url.filter(
      (link) => link.nombre === this.product_list.title
    );

    if (filtro_sku.length > 0) {
      this.product_list.skus = filtro_sku[0].skus;
      this.product_list.url = filtro_url[0].url;
    }

    this.cargar = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 770) {
      this.layout = 'grid-sm';
    }
  }

  over(event: any) {
    let el: any = event.target.parentNode;
    let clase: any = el.classList;
    while (!clase.contains('owl-item')) {
      el = el.parentNode;
      clase = el.classList;
    }

    el.style['box-shadow'] = '0 4px 4px 0 rgb(0 0 0 / 50%)';
  }

  leave(event: any) {
    let el: any = event.target.parentNode;
    let clase: any = el.classList;
    while (!clase.contains('owl-item')) {
      el = el.parentNode;
      clase = el.classList;
    }

    el.style['box-shadow'] = 'none';
  }
}
