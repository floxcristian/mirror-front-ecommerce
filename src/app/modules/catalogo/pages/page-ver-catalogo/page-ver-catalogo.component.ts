import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CatalogoService } from '../../../../shared/services/catalogo.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { RootService } from '../../../../shared/services/root.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionService } from '@core/states-v2/session.service';

@Component({
  selector: 'app-page-ver-catalogo',
  templateUrl: './page-ver-catalogo.component.html',
  styleUrls: ['./page-ver-catalogo.component.scss'],
})
export class PageVerCatalogoComponent implements OnInit {
  isBrowser = false;
  catalogo: any = [];
  catalogoMovil: any = [];
  skus!: Array<any>;
  objeto: any;
  objetoL: any;
  auxObjeto: any;
  page: number;
  longitud!: number;
  hidden = true;
  innerWidth!: number;
  cargandoCat = true;
  tipoCatalogo: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private localS: LocalStorageService,
    private catalogoService: CatalogoService,
    private geoLocationService: GeoLocationService,
    public root: RootService,
    private router: Router,
    public cart: CartService,
    private toast: ToastrService,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    this.page = 0;
    this.onResize();

    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }
  }

  async ngOnInit() {
    await this.validarParametros();
  }
  async validarParametros() {
    let objeto = null;
    let id = null;
    let url = this.router.parseUrl(this.router.url);

    id = url.queryParams['id'];

    if (id) {
      //llamada servicio para obtener catalogo por id
      objeto = await this.catalogoService.obtenerCatalogoId(id);
    } else {
      objeto = this.localS.get('catalogo');
    }

    // si es catalogo dinamico reemplazando al antiguo
    if (objeto.dinamico && id) {
      this.router.navigate(['/', 'catalogos', 'ver-catalogo-flip'], {
        queryParams: { id: id },
      });
    }

    if (!objeto) {
      this.toast.error('Error, el catalogo no se encuentra disponible');
      this.router.navigate(['/', 'catalogos']);
      return;
    }

    this.tipoCatalogo = objeto.tipoCatalogo;
    this.skus = objeto.skus;
    this.catalogo = objeto.cuerpo;
    //// console.log('this.catalogo', objeto);
    // !objeto.estructura ? await this.establecerPrecio() : await this.establecerPrecioDinamico();
    await this.establecerPrecio();
    // this.objetoMovil();

    // this.objeto = this.innerWidth > 426 ? this.catalogo[this.page] : this.catalogoMovil[this.page];
    // this.longitud = this.innerWidth > 426 ? this.catalogo.length : this.catalogoMovil.length;
    this.objeto = this.catalogo[this.page];
    this.longitud = this.catalogo.length;
  }

  cambiarPagina(valor: any) {
    valor ? (this.page += 1) : (this.page -= 1);
    this.objeto = this.catalogo[this.page];
  }

  Reset(valor: any) {
    valor ? (this.page = 0) : (this.page = this.catalogo.length - 1);
    this.objeto = this.catalogo[this.page];
  }

  async establecerPrecio() {
    let user = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    let rut = user ? user.documentId : '0';

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const params: any = { sucursal: sucursal, rut: rut, skus: this.skus };

    let respuesta: any[] = await this.catalogoService.establecerPrecios(
      params
    );

    respuesta.map((precio) => {
      this.cargandoCat = false;
      this.catalogo.map((objeto: any) => {
        if (Array.isArray(objeto.productos)) {
          objeto.productos.map((producto: any) => {
            producto.rut = rut;
            if (producto.sku == precio.sku && rut != '0') {
              producto.precioEsp = precio.precioCliente;
              producto.precio = precio.precioMeson;
            } else if (producto.sku == precio.sku && rut == '0') {
              producto.precioEsp = precio.precioCliente;
              producto.precio = precio.precioMeson;
            }
            if (producto.sku == precio.sku) {
              producto.precioEscala = precio.precioEscala;
              producto.preciosScal = precio.preciosScal;
              producto.cyber = precio.cyber;
              producto.cyberMonday = precio.cyberMonday;
            }
          });
        } else if (objeto.productos) {
          objeto.productos.rut = rut;
          objeto.cyber = precio.cyber;
          objeto.cyberMonday = precio.cyberMonday;

          if (objeto.productos.sku == precio.sku && rut != '0') {
            objeto.productos.precioEsp = precio.precioCliente;
            objeto.productos.precio = precio.precioMeson;
          } else if (objeto.productos.sku == precio.sku && rut == '0') {
            objeto.productos.precioEsp = precio.precioCliente;
            objeto.productos.precio = precio.precioMeson;
          }
          if (objeto.productos.sku == precio.sku) {
            objeto.productos.precioEscala = precio.precioEscala;
            objeto.productos.preciosScal = precio.preciosScal;
          }
        }
      });
    });

    console.log(this.catalogo, 'catalogo');
  }

  objetoMovil() {
    let catalogoMovil = [];
    let arrProd: any[] = [];
    let objetoP = this.catalogo[1];
    let objetoF = this.catalogo[this.catalogo.length - 1];
    this.catalogo.map((objeto: any, indice: any) => {
      indice == 0 && catalogoMovil.push(objeto);
      Array.isArray(objeto.productos)
        ? objeto.productos.map((obj: any) => arrProd.push(obj))
        : objeto.productos
        ? arrProd.push(objeto.productos)
        : null;
    });

    let inicio = 0;
    let final = 2;
    let cantidadProdPagina = 4;
    let cantidadProductos = 0;
    let cantidadPaginas = 0;

    if (arrProd.length > 2) {
      cantidadProductos = arrProd.length;
      cantidadPaginas = Math.round(cantidadProductos / cantidadProdPagina);
    } else {
      cantidadProductos = arrProd.length;
      cantidadPaginas = 0;
      inicio = 0;
      final = arrProd.length;
    }

    for (let index = 0; index < cantidadPaginas; index++) {
      let objetoC = {
        id: 'productosVertical',
        class: 'col-md-10 col-lg-10',
        banner: index == 0 ? objetoP.banner : null,
        header: objetoP.header,
        footer: objetoP.footer,
        productos: arrProd.slice(inicio, final),
      };
      inicio = final;
      final + 4 > arrProd.length ? (final = arrProd.length) : (final += 4);

      catalogoMovil.push(objetoC);
    }
    catalogoMovil.push(objetoF);
    this.catalogoMovil = catalogoMovil;
  }

  onResize() {
    this.innerWidth = window.innerWidth;
    this.objeto = this.catalogo[this.page];
  }
}
