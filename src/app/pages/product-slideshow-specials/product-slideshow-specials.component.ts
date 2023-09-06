import { Component, OnInit, Inject, Input, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { RootService } from 'src/app/shared/services/root.service';
import { Usuario } from 'src/app/shared/interfaces/login';
import { DirectionService } from 'src/app/shared/services/direction.service';
import { GeoLocation } from 'src/app/shared/interfaces/geo-location';
import { GeoLocationService } from 'src/app/shared/services/geo-location.service';
import { ProductsService } from 'src/app/shared/services/products.service';

export type Layout = 'grid' | 'grid-with-features' | 'list';

@Component({
  selector: 'app-product-slideshow-specials',
  templateUrl: './product-slideshow-specials.component.html',
  styleUrls: ['./product-slideshow-specials.component.scss'],
})
export class ProductSlideshowSpecialsComponent implements OnInit {
  @Input() layout: Layout = 'grid';
  @Input() grid: 'grid-3-sidebar' | 'grid-4-full' | 'grid-4-full' =
    'grid-3-sidebar';
  lstProductos: any;
  especial: any;
  banners: any;
  producto_espacial: any = [];
  @Input() nombre: string | undefined = undefined;
  user!: Usuario;
  isB2B!: boolean;
  cantItem: number = 4;
  innerWidth: number;
  ruta!: any[];
  carouselOptions = {
    items: 5,
    nav: false,
    dots: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      1100: { items: 5 },
      920: { items: 5 },
      680: { items: 3 },
      500: { items: 2 },
      0: { items: 2 },
    },
    rtl: this.direction.isRTL(),
  };
  config: any;
  collection = { count: 60, data: [] };
  p: number = 1;
  constructor(
    private root: RootService,
    private productsService: ProductsService,
    public toast: ToastrService,

    private direction: DirectionService,
    private geoLocationService: GeoLocationService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
    this.innerWidth = window.innerWidth;
    this.onResize(event);
  }

  sidebarPosition: 'start' | 'end' = 'start';

  async ngOnInit() {
    this.user = this.root.getDataSesionUsuario();
    const role = this.user.user_role;
    this.isB2B = role === 'supervisor' || role === 'comprador';

    let url: string = this.router.url;
    this.ruta = url.split('/');

    const geo: GeoLocation = await this.localStorage.get('geolocalizacion');
    if (geo != null) {
      this.cargaEspeciales();
    }
    this.geoLocationService.localizacionObs$.subscribe((r: GeoLocation) => {
      this.cargaEspeciales();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 427) {
      this.cantItem = 4;
    } else if (this.innerWidth > 426) {
      this.cantItem = 10;
    }
  }

  getUrl(id: any) {
    this.producto_espacial = this.lstProductos[id].productos;
    this.nombre = this.lstProductos[id].nombre;
  }

  async cargaEspeciales() {
    let rut = this.user.rut;
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo || '';
    var especials = this.router.url.split('/').pop();

    //clean tracking vars
    var look = especials?.indexOf('?');
    if ((look || 0) > -1) especials = especials?.substr(0, look);

    const params = { sucursal: sucursal, rut: rut, especial: especials };

    let respuesta: any = await this.productsService
      .getEspeciales(params)
      .toPromise();

    const { data, especial, banners } = respuesta;

    this.especial = especial;
    this.banners = banners[0];
    let out = [];
    let i = 0;
    for (const key in data) {
      let seccion = {
        nombre: key,
        productos: data[key],
        p: i,
      };
      out.push(seccion);
      i++;
    }
    this.lstProductos = out;

    if (!this.nombre) {
      this.producto_espacial = this.lstProductos[0].productos;
      this.nombre = this.lstProductos[0].nombre;
    } else {
      let index = this.lstProductos.findIndex((item: any) =>
        item.nombre.toUpperCase().match(this.nombre || ''.toUpperCase())
      );

      if (index != -1) {
        this.producto_espacial = this.lstProductos[index].productos;
        this.nombre = this.lstProductos[index].nombre;
        let division = Math.trunc(index / 3);

        if (division >= this.p) {
          this.p = division + 1;
        }
      }
    }
  }

  pageChanged(event: any) {
    this.p = event;
    let index = (this.p - 1) * 3;

    this.producto_espacial = this.lstProductos[index].productos;
    this.nombre = this.lstProductos[index].nombre;
  }

  setLayout(value: Layout): void {
    this.layout = value;
    if (value === 'grid-with-features') {
      this.grid = 'grid-4-full';
    } else {
      this.grid = 'grid-4-full';
    }
  }
}
