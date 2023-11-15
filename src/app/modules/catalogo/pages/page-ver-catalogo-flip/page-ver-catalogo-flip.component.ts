import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CatalogoService } from '../../../../shared/services/catalogo.service';
import { FlipSetting, PageFlip, SizeType } from 'page-flip';
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { isVacio } from '../../../../shared/utils/utilidades';
import { environment } from '@env/environment';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-ver-catalogo-flip',
  templateUrl: './page-ver-catalogo-flip.component.html',
  styleUrls: ['./page-ver-catalogo-flip.component.scss'],
})
export class PageVerCatalogoFlipComponent implements OnInit {
  pageFlip: any;
  pageTotal: number = 0;
  pageOrientation!: string;
  pageCurrent: number = 1;
  pageState: any;
  paginas: Array<any> = [];
  paginasMobile: Array<any> = [];
  articulos: Array<any> = [];
  portada!: string;
  contraPortada!: string;
  screenWidth: any;
  screenHeight: any;
  estado: boolean = true;
  cargandoCat = true;
  catalogo: any[] = [];
  skus!: Array<any>;
  dispositivo!: string;
  iva = true;
  IVA = environment.IVA || 0.19;
  paginasTemp: Array<any> = [];
  tipoCatalogo: string = '';
  tags: any[] = [];
  rutCatalogo = '';
  Generico = false;
  nombreCliente: string | null = '';
  folio: any;
  propuesta: any;
  constructor(
    private localS: LocalStorageService,
    private catalogoService: CatalogoService,
    private geoLocationService: GeoLocationService,
    private router: Router,
    private toast: ToastrService,
    public cart: CartService,
    public root: RootService,
    private responsive: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getTags() {
    return this.localS.get('tags');
  }

  ngOnInit() {
    this.responsive
      .observe([
        Breakpoints.TabletPortrait,
        Breakpoints.HandsetPortrait,
        Breakpoints.WebPortrait,
        Breakpoints.WebLandscape,
        Breakpoints.Web,
      ])
      .subscribe((result) => {
        this.pageTotal = 0;
        this.paginas = [];
        this.paginasMobile = [];
        this.pageFlip = null;
        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.TabletPortrait]) {
          this.dispositivo = 'tablet';
        } else if (breakpoints[Breakpoints.HandsetPortrait]) {
          this.dispositivo = 'smartphone';
        } else if (
          breakpoints[Breakpoints.WebLandscape] ||
          breakpoints[Breakpoints.WebPortrait] ||
          breakpoints[Breakpoints.Web]
        ) {
          this.dispositivo = 'web';
        } else {
          this.dispositivo = 'tablet';
        }
      });
    this.validarParametros();
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900;
  }

  async validarParametros() {
    let objeto: any = null;
    let id = null;
    let url = this.router.parseUrl(this.router.url);
    id = url.queryParams['id'];
    if (id) {
      //LLAMADA SERVICIO PARA OBTENER CATALOGO POR ID
      objeto = await this.catalogoService.obtenerCatalogoId(id);
    } else {
      objeto = await this.localS.get('catalogo');
    }
    if (!objeto) {
      this.toast.error('Error, el catalogo no se encuentra disponible');
      this.router.navigate(['/', 'catalogos']);
      return;
    } else {
      this.propuesta = await this.catalogoService.obtenerPropuesta(
        objeto.folioPropuesta
      );

      this.tipoCatalogo = objeto.tipoCatalogo;
      this.folio = objeto.folioPropuesta;
      this.nombreCliente = objeto.nombre;

      if (this.nombreCliente === 'Catalogo para ') {
        this.Generico = true;
        this.nombreCliente = null;
      }
      if (this.tipoCatalogo === 'Automatico') {
        this.rutCatalogo = objeto.clienteRut;
      }
    }
    if (objeto.neto) this.iva = !objeto.neto;
    this.skus = objeto.skus;
    this.catalogo = objeto.cuerpo;
    await this.establecerPrecio();
    await this.cargarMarcas(objeto);
    setTimeout(() => {
      this.loadFlip();
      this.cargandoCat = false;
      if (this.dispositivo === 'smartphone') {
        this.buscaTagsSmartphone(this.paginasMobile);
      } else {
        this.buscaTags(objeto.cuerpo);
      }
    }, 1300);
  }

  async establecerPrecio() {
    let user = this.root.getDataSesionUsuario();
    let rut = user ? user.rut : '0';
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;

    let params: any;
    // MEJORAR RENDIMIENTO
    console.log('test');
    console.log(this.tipoCatalogo);

    if (this.tipoCatalogo == 'Automatico') {
      console.log(this.rutCatalogo);
      params = { sucursal: sucursal, rut: this.rutCatalogo, skus: this.skus };
    } else {
      params = { sucursal: sucursal, rut: rut, skus: this.skus };
    }
    let respuesta: any[];
    if (!this.propuesta) {
      respuesta = await this.catalogoService.establecerPrecios(params);
      respuesta.map((precio) => {
        this.catalogo.map((objeto) => {
          for (let objA of objeto.ladoA) {
            if (objA.productos.tipo == 'producto') {
              if (this.tipoCatalogo == 'Automatico') {
                objA.productos.rut = this.rutCatalogo;
                if (
                  objA.productos.producto == precio.sku &&
                  this.rutCatalogo != '0'
                ) {
                  objA.productos.precioEsp = precio.precioCliente;
                  objA.productos.precio = precio.precioMeson;
                } else if (
                  objA.productos.producto == precio.sku &&
                  this.rutCatalogo == '0'
                ) {
                  objA.productos.precioEsp = precio.precioCliente;
                  objA.productos.precio = precio.precioMeson;
                }
                if (objA.productos.producto == precio.sku) {
                  objA.productos.precioEscala = precio.precioEscala;
                  objA.productos.preciosScal = precio.preciosScal;
                  objA.productos.cyber = precio.cyber;
                  objA.productos.cyberMonday = precio.cyberMonday;
                }
              } else {
                objA.productos.rut = rut;
                if (objA.productos.producto == precio.sku && rut != '0') {
                  objA.productos.precioEsp = precio.precioCliente;
                  objA.productos.precio = precio.precioMeson;
                } else if (
                  objA.productos.producto == precio.sku &&
                  rut == '0'
                ) {
                  objA.productos.precioEsp = precio.precioCliente;
                  objA.productos.precio = precio.precioMeson;
                }
                if (objA.productos.producto == precio.sku) {
                  objA.productos.precioEscala = precio.precioEscala;
                  objA.productos.preciosScal = precio.preciosScal;
                  objA.productos.cyber = precio.cyber;
                  objA.productos.cyberMonday = precio.cyberMonday;
                }
              }
            }
          }
          for (let objB of objeto.ladoB) {
            if (objB.productos.tipo == 'producto') {
              if (this.tipoCatalogo == 'Automatico') {
                objB.productos.rut = this.rutCatalogo;
                if (
                  objB.productos.producto == precio.sku &&
                  this.rutCatalogo != '0'
                ) {
                  objB.productos.precioEsp = precio.precioCliente;
                  objB.productos.precio = precio.precioMeson;
                } else if (
                  objB.productos.producto == precio.sku &&
                  this.rutCatalogo == '0'
                ) {
                  objB.productos.precioEsp = precio.precioCliente;
                  objB.productos.precio = precio.precioMeson;
                }
                if (objB.productos.producto == precio.sku) {
                  objB.productos.precioEscala = precio.precioEscala;
                  objB.productos.preciosScal = precio.preciosScal;
                  objB.productos.cyber = precio.cyber;
                  objB.productos.cyberMonday = precio.cyberMonday;
                }
              } else {
                objB.productos.rut = rut;
                if (objB.productos.producto == precio.sku && rut != '0') {
                  objB.productos.precioEsp = precio.precioCliente;
                  objB.productos.precio = precio.precioMeson;
                } else if (
                  objB.productos.producto == precio.sku &&
                  rut == '0'
                ) {
                  objB.productos.precioEsp = precio.precioCliente;
                  objB.productos.precio = precio.precioMeson;
                }
                if (objB.productos.producto == precio.sku) {
                  objB.productos.precioEscala = precio.precioEscala;
                  objB.productos.preciosScal = precio.preciosScal;
                  objB.productos.cyber = precio.cyber;
                  objB.productos.cyberMonday = precio.cyberMonday;
                }
              }
            }
          }
        });
      });
    } else {
      this.catalogo.map((objeto) => {
        for (let objA of objeto.ladoA) {
          let propuestaPrecio = this.propuesta.articulos.find(
            (x: any) => x.sku == objA.productos.producto
          );
          if (propuestaPrecio) {
            objA.productos.precioEsp = propuestaPrecio.precio.precioCliente;
            objA.productos.precio = propuestaPrecio.precio.precio;
            if (propuestaPrecio.acuerdo)
              objA.productos.cantidad = propuestaPrecio.acuerdo.cantidadMinima;
          }
        }
        for (let objB of objeto.ladoB) {
          let propuestaPrecio = this.propuesta.articulos.find(
            (x: any) => x.sku == objB.productos.producto
          );
          if (propuestaPrecio) {
            objB.productos.precioEsp = propuestaPrecio.precio.precioCliente;
            objB.productos.precio = propuestaPrecio.precio.precio;
            if (propuestaPrecio.acuerdo)
              objB.productos.cantidad = propuestaPrecio.acuerdo.cantidadMinima;
          }
        }
      });
    }

    this.catalogo.map((pagina) => {
      //LADO A
      if (pagina.ladoA[0]) {
        if (pagina.ladoA[0].tipo != 'portada') {
          pagina.ladoA.tituloA = pagina.tituloA;
          this.paginas.push(pagina.ladoA);
          this.paginasTemp.push(pagina.ladoA);
        }
      } else {
        pagina.ladoA[0] = {
          productos: { tipo: 'dinamico' },
          tipo: 'dinamico',
          titulo: undefined,
          tituloA: '',
        };
        this.paginas.push(pagina.ladoA);
      }
      //LADO B
      if (pagina.ladoB[0]) {
        if (pagina.ladoB[0].tipo != 'portada') {
          pagina.ladoB.tituloB = pagina.tituloB;
          this.paginas.push(pagina.ladoB);
          this.paginasTemp.push(pagina.ladoB);
        }
      } else {
        pagina.ladoB[0] = {
          productos: { tipo: 'dinamico' },
          tipo: 'dinamico',
          titulo: undefined,
          tituloB: '',
        };
        this.paginas.push(pagina.ladoB);
      }
      //OBTENER PORTADA Y CONTRAPORTADA (INDEPENDIENTE DEL ORDEN)
      if (
        pagina.ladoA[0].tipo === 'portada' &&
        pagina.ladoA[0].productos.tipo === 'portadaImg'
      )
        this.portada = pagina.ladoA[0].productos.url;
      if (
        pagina.ladoA[0].tipo === 'portada' &&
        pagina.ladoA[0].productos.tipo === 'contraPortadaImg'
      )
        this.contraPortada = pagina.ladoA[0].productos.url;
    });

    if (this.dispositivo === 'smartphone') {
      // OBTENGO TODOS LOS ARTICULOS
      for (let i = 0; i < this.paginasTemp.length; i++) {
        for (let x = 0; x < this.paginasTemp[i].length; x++) {
          if (this.paginasTemp[i][x].productos.length !== 0) {
            let titulo = '';
            this.paginasTemp[i].tituloA
              ? (titulo = this.paginasTemp[i].tituloA)
              : (titulo = this.paginasTemp[i].tituloB);
            this.paginasTemp[i][x].titulo = titulo;
            this.articulos.push(this.paginasTemp[i][x]);
          }
        }
      }
      // 8 ARTICULOS X PAGINA
      this.paginasMobile = this.agrupar(this.articulos, 8);
      this.paginasMobile.length > 0
        ? (this.pageTotal = this.paginasMobile.length + 2)
        : (this.pageTotal = 0);
    }
    if (this.dispositivo === 'tablet' || this.dispositivo === 'web') {
      this.paginas.length > 0
        ? (this.pageTotal = this.paginas.length + 2)
        : (this.pageTotal = 0);
    }
  }

  agrupar(array: any, chunkSize: any) {
    const output = [],
      arrayLength = array.length;
    let arrayIndex = 0;
    while (arrayIndex < arrayLength) {
      output.push(array.slice(arrayIndex, (arrayIndex += chunkSize)));
    }
    return output;
  }

  async cargarMarcas(objeto: any) {
    //LISTA DE MARCAS POR PÁGINA
    for (let i = 0; i < objeto.cuerpo.length; i++) {
      let marcas = [];
      // LADO A
      for (let x = 0; x < objeto.cuerpo[i].ladoA.length; x++) {
        if (objeto.cuerpo[i].ladoA[x].tipo != 'portada') {
          if (objeto.cuerpo[i].ladoA[x].productos.atributos) {
            if (objeto.cuerpo[i].ladoA[x].productos.atributos[5].valor) {
              let marca =
                objeto.cuerpo[i].ladoA[x].productos.atributos[5].valor;
              let existeEnArray = marcas.indexOf(marca);
              if (existeEnArray == -1)
                marcas.push(
                  objeto.cuerpo[i].ladoA[x].productos.atributos[5].valor
                );
            }
          }
        }
      }
      // LADO B
      for (let z = 0; z < objeto.cuerpo[i].ladoB.length; z++) {
        if (objeto.cuerpo[i].ladoB[z].tipo != 'portada') {
          if (objeto.cuerpo[i].ladoB[z].productos.atributos) {
            if (objeto.cuerpo[i].ladoB[z].productos.atributos[5].valor) {
              let marca =
                objeto.cuerpo[i].ladoB[z].productos.atributos[5].valor;
              let existeEnArray = marcas.indexOf(marca);
              if (existeEnArray == -1)
                marcas.push(
                  objeto.cuerpo[i].ladoB[z].productos.atributos[5].valor
                );
            }
          }
        }
      }
      //SI ARRAY MARCAS TIENE MENOS DE 6 ITEMS LO COMPLETO
      if (marcas.length < 6 && marcas.length > 0) {
        for (let i = 0; i < 6; i++) {
          marcas.push(marcas[i]);
          if (marcas.length == 6) break;
        }
      }
      //ASIGNO MISMAS MARCAS A LAS DOS CARAS
      objeto.cuerpo[i].ladoA['marcas'] = marcas;
      objeto.cuerpo[i].ladoB['marcas'] = marcas;
    }
  }

  minimo = false;
  medio = false;
  loadFlip() {
    if (this.dispositivo === 'smartphone') {
      let porcentaje = 1.9;
      if (this.screenWidth > 400 && this.screenWidth < 420) porcentaje = 5.4; //ok
      if (this.screenWidth < 400 && this.screenWidth > 360) porcentaje = 5.9; //ok
      if (this.screenWidth <= 360 && this.screenWidth > 320) porcentaje = 6.2; //ok
      if (this.screenWidth <= 320 && this.screenWidth > 300) porcentaje = 7.0;
      let height = this.screenWidth * porcentaje;
      this.pageFlip = new PageFlip(
        document.getElementById('demoBookExample') as HTMLElement,
        {
          width: this.screenWidth,
          height: height,
          maxWidth: this.screenWidth,
          maxHeight: height * 1.1,
          size: SizeType.FIXED,
          minWidth: 315,
          minHeight: 680,
          maxShadowOpacity: 0.5,
          disableFlipByClick: true,
          flippingTime: 800,
          clickEventForward: true,
          showCover: true,
          showPageCorners: true,
          startZIndex: 5,
          useMouseEvents: false,
        }
      );
    }
    if (this.dispositivo === 'web') {
      let numero;
      if (this.screenWidth > 1440 && this.screenWidth < 1540) {
        numero = 600;
        this.medio = true;
      } else if (this.screenWidth > 1540) {
        numero = 650;
      } else {
        numero = 450;
        this.minimo = true;
      }
      console.log(numero);
      console.log(this.medio);

      this.pageFlip = new PageFlip(
        document.getElementById('demoBookExample') as HTMLElement,
        {
          width: numero,
          height: 950,
          maxHeight: 940,
          maxWidth: 650,
          size: SizeType.FIXED,
          minWidth: 315, //315
          minHeight: 420, //420
          maxShadowOpacity: 0.5,
          disableFlipByClick: true,
          useMouseEvents: true,
          flippingTime: 800,
          clickEventForward: true,
          showCover: true,
          showPageCorners: true,
          startZIndex: 5,
        }
      );
    }
    if (this.dispositivo === 'tablet') {
      this.pageFlip = new PageFlip(
        document.getElementById('demoBookExample') as HTMLElement,
        {
          width: 650, //740
          height: 950, //940
          maxWidth: 650,
          maxHeight: 950,
          size: SizeType.FIXED,
          minWidth: 650,
          minHeight: 950,
          maxShadowOpacity: 0.5,
          disableFlipByClick: true,
          flippingTime: 800,
          clickEventForward: true,
          showCover: true,
          showPageCorners: true,
          startZIndex: 5,
          useMouseEvents: false,
        }
      );
    }
    this.pageFlip.loadFromHTML(document.querySelectorAll('.page'));
    this.pageFlip.on('flip', (e: any) => {
      this.pageCurrent = e.data + 1;
    });
    this.pageFlip.on('changeState', (e: any) => {
      this.pageState = e.data;
    });
    this.pageFlip.on('changeOrientation', (e: any) => {
      this.ngOnInit();
    });
  }

  nextPage() {
    let por = this.pageFlip.getOrientation();
    if (
      this.dispositivo === 'smartphone' ||
      this.dispositivo === 'tablet' ||
      por === 'portrait'
    ) {
      if (this.pageCurrent < this.pageTotal) {
        this.pageFlip.turnToNextPage();
      }
    } else {
      this.pageFlip.flipNext();
    }
  }

  prevPage() {
    let por = this.pageFlip.getOrientation();
    this.dispositivo === 'smartphone' ||
    this.dispositivo === 'tablet' ||
    por === 'portrait'
      ? this.pageFlip.turnToPrevPage()
      : this.pageFlip.flipPrev();
  }

  buscaTags(objeto: any[]) {
    let i = 0;
    this.tags = [
      ...new Set(
        objeto.map((item) => {
          i++;
          if (item.tag !== undefined) {
            return {
              index: i,
              id: item.id,
              tag: item.tag,
            };
          }
          return null;
        })
      ),
    ];
    console.log('tags: ', this.tags);
    this.tags = this.tags.filter((item) => item);
    console.log('tags: ', this.tags);
    this.localS.set('tags', this.tags);
  }

  cambiarPaginaPreview(pag: any) {
    this.pageFlip.turnToPage(pag);
  }

  buscaTagsSmartphone(objeto: any) {
    let i = 0;
    objeto.map((pagina: any) => {
      i++;
      pagina.map((articulo: any) => {
        if (articulo.titulo !== undefined && articulo.titulo != '') {
          objeto = {
            index: i,
            id: pagina.id,
            tag: articulo.titulo.substring(0, 35),
          };
          const existe = this.tags.find((obj) => {
            return obj.tag === objeto.tag;
          });
          if (!existe) {
            this.tags.push(objeto);
          }
        }
      });
    });
    this.tags = this.tags.filter((item) => item);
    this.localS.set('tags', this.tags);
  }
  cargaPrecio(productData: any) {
    if (productData.precioComun === undefined) {
      productData.precioComun = productData.precio.precioComun;
      productData.precio_escala = productData.precio.precio_escala;
    }

    this.calculaIVA(productData);
  }

  calculaIVA(producto: any) {
    if (!isVacio(this.iva)) {
      if (!this.iva) {
        producto.precio.precio = producto.precio.precio / (1 + this.IVA);
        producto.precioComun = producto.precioComun / (1 + this.IVA);
      }
    }
    return producto;
  }
}
