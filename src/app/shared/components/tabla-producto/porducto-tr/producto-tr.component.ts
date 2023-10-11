import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import {
  Product,
  ProductPrecio,
  ProductOrigen,
} from '../../../interfaces/product';
import { WishlistService } from '../../../services/wishlist.service';
import { CompareService } from '../../../services/compare.service';
import { QuickviewService } from '../../../services/quickview.service';
import { RootService } from '../../../services/root.service';
import { CurrencyService } from '../../../services/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';

import { Usuario } from '../../../interfaces/login';
import { GeoLocationService } from '../../../services/geo-location.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import 'moment/min/locales';
import { isVacio } from '../../../utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-producto-tr',
  templateUrl: './producto-tr.component.html',
  styleUrls: ['./producto-tr.component.scss'],
})
export class PorductoTrComponent implements OnInit {
  private destroy$: Subject<void> = new Subject();
  @Input() home!: boolean;
  @Input() cartClass!: boolean;
  @Input() set product(value: Product) {
    this.productData = value;
    this.productData.nombre = this.root.limpiarNombres(
      this.productData.nombre
    );

    this.cargaPrecio(value);
    this.cargaAtributos(value);
    this.quality = this.root.setQuality(this.productData);
    this.root.limpiaAtributos(value);
  }

  @Input() layout:
    | 'grid-sm'
    | 'grid-nl'
    | 'grid-lg'
    | 'list'
    | 'horizontal'
    | null = null;
  @Input() grid: any;
  @Input() paramsCategory: any;
  @Input() origen!: string[];
  @Input() tipoOrigen: string = '';
  preferenciaCliente: any;
  addingToCart = false;
  addingToWishlist = false;
  addingToCompare = false;
  showingQuickview = false;
  urlImage = environment.urlFotoOmnichannel;
  productData!: Product & { url?: SafeUrl; gimage?: SafeUrl };
  quality: any = 0;
  quantity: FormControl = new FormControl(1);
  precioProducto = 0;
  today = Date.now();
  stockProducto: any = [];
  productModal: any;
  modalRef!: BsModalRef;
  convertir: boolean = false;
  tomorrow = false;
  fecha!: string;
  usuario: any;
  atributos: any[] = [];
  exists: boolean = true;
  IVA = environment.IVA || 0.19;
  isVacio = isVacio;

  dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  constructor(
    private cd: ChangeDetectorRef,
    public root: RootService,
    public cart: CartService,
    public wishlist: WishlistService,
    public compare: CompareService,
    public quickview: QuickviewService,
    public currency: CurrencyService,
    private modalService: BsModalService,
    private localS: LocalStorageService,
    private geoLocationService: GeoLocationService,
    private productService: ProductsService,
    public sanitizer: DomSanitizer
  ) {
    this.preferenciaCliente = this.localS.get('preferenciasCliente');
    this.usuario = this.root.getDataSesionUsuario();
  }

  ngOnInit(): void {
    this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cd.markForCheck();
    });

    this.dias_semana();
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.dias_semana();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargaPrecio(producto: any) {
    if (this.home) {
      return;
    }

    // verificamos si esta la session iniciada
    const usuario: Usuario = this.localS.get('usuario') as any;
    let rut = '0';

    if (usuario != null) {
      rut = usuario.rut || '';
    }

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    const parametrosPrecios = {
      sku: producto.sku,
      sucursal: tiendaSeleccionada?.codigo,
      rut,
    };

    this.cart.getPriceProduct(parametrosPrecios).subscribe(async (r: any) => {
      //buscar fecha
      if (
        this.usuario.user_role != 'compradorb2c' &&
        this.usuario.user_role != 'cms' &&
        this.usuario.user_role != 'temp'
      ) {
        const params = {
          sku: producto.sku,
          codigoSucursal: tiendaSeleccionada?.codigo,
          destino: this.preferenciaCliente.direccionDespacho.comuna,
          tipo: 'DES',
        };

        // let consultaFecha:any=await this.logistics.obtieneDespachoProducto(params).toPromise();
        // this.productData.fecha=consultaFecha.fecha;
      }
      const precio: ProductPrecio = r.precio;

      this.productData.precio = precio;
      this.productData.precioComun = r.precioComun;
      this.productData.precio_escala = r.precio_escala;
      this.cd.markForCheck();

      let url: string = this.root.product(
        this.productData.sku,
        this.productData.nombre,
        false
      );
      let gimage: string =
        'https://images.implementos.cl/img/watermarked/' +
        this.productData.sku +
        '-watermarked.jpg';

      this.productData.url =
        this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.productData.gimage =
        this.sanitizer.bypassSecurityTrustResourceUrl(gimage);

      this.calculaIVA(this.productData);
    });
  }

  cargaAtributos(producto: any) {
    if (!isVacio(producto.filtros)) {
      const max = 3;
      let cont = 1;
      while (cont <= max) {
        const attr = producto.filtros.find(
          (f: any) => f.orden === cont.toString()
        );
        if (!isVacio(attr)) {
          this.atributos.push(attr);
        }
        cont++;
      }
    }
  }

  calculaIVA(producto: Product) {
    if (!isVacio(this.usuario.iva)) {
      if (!this.usuario.iva) {
        this.productData.precio.precio =
          producto.precio.precio / (1 + this.IVA);
        this.productData.precioComun =
          (producto.precioComun || 0) / (1 + this.IVA);
      }
    }
  }

  addToCart(): void {
    if (this.addingToCart) {
      return;
    }

    this.productData.origen = {} as ProductOrigen;

    if (this.origen) {
      // Seteamos el origen de donde se hizo click a add cart.
      this.productData.origen.origen = this.origen[0] ? this.origen[0] : '';
      this.productData.origen.subOrigen = this.origen[1] ? this.origen[1] : '';
      this.productData.origen.seccion = this.origen[2] ? this.origen[2] : '';
      this.productData.origen.recomendado = this.origen[3]
        ? this.origen[3]
        : '';
      this.productData.origen.ficha = false;
      this.productData.origen.cyber = this.productData.cyber
        ? this.productData.cyber
        : 0;
    }

    this.addingToCart = true;
    this.cart.add(this.productData, this.quantity.value).subscribe({
      complete: () => {
        this.addingToCart = false;
        this.cd.markForCheck();
      },
    });
  }

  async updateCart(cantidad: any) {
    const usuario: Usuario = this.localS.get('usuario') as any;
    let rut = '0';

    if (usuario != null) {
      rut = usuario.rut || '';
    }

    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    this.comprobarStock(this.productData.sku, tiendaSeleccionada);

    const parametrosPrecios = {
      sku: this.productData.sku,
      sucursal: tiendaSeleccionada?.codigo,
      rut,
      cantidad,
    };

    let datos: any = await this.cart
      .getPriceProduct(parametrosPrecios)
      .toPromise();

    if (datos['precio_escala']) {
      this.productData.precioComun = datos['precio'].precio;
      this.productData.precio.precio = datos['precio'].precio;
    }
  }

  async comprobarStock(sku: any, tienda: any) {
    this.productService.getStockProduct(sku).subscribe((x: any) => {});
  }

  dias_semana() {
    // const prueba = '2021-06-26T07:11:57.272Z';
    let actual = moment().format('W');
    let entrega = moment(this.productData.fechaEntrega).format('W');
    let date = this.productData.fechaEntrega;

    if (entrega == actual) {
      let tomorrow = moment().locale('es').add(1, 'd').format('D');
      let diaEntrega = moment(date).locale('es').format('D');

      if (diaEntrega == tomorrow) {
        this.fecha = 'mañana';
        this.tomorrow = true;
      } else {
        this.fecha = moment(date).locale('es').format('dddd');
        this.tomorrow = false;
      }
      this.convertir = true;
    } else {
      this.convertir = false;
      this.tomorrow = false;
    }
  }

  addToWishlist(): void {
    if (this.addingToWishlist) {
      return;
    }

    this.addingToWishlist = true;

    this.wishlist.add(this.productData).subscribe({
      complete: () => {
        this.addingToWishlist = false;
        this.cd.markForCheck();
      },
    });
  }

  addToCompare(): void {
    if (this.addingToCompare) {
      return;
    }

    this.addingToCompare = true;
    this.compare.add(this.productData).subscribe({
      complete: () => {
        this.addingToCompare = false;
        this.cd.markForCheck();
      },
    });
  }

  showQuickview(): void {
    if (this.showingQuickview) {
      return;
    }

    this.showingQuickview = true;
    this.quickview.show(this.productData).subscribe({
      complete: () => {
        this.showingQuickview = false;
        this.cd.markForCheck();
      },
    });
  }

  /**
   * @author ignacio zapata  \"2020-09-28\
   * @desc metodo utilizado cuando se hace clic en el card, y antes de redireccionar a la ficha del prod, se guarda el origen en una variable de cart service
   * @params
   * @return
   */
  setOrigenBeforeFicha() {
    this.cart.setOrigenHistory(this.origen);
  }

  //abrir modal para los stock
  async openModal(template: any, item: any) {
    this.productModal = {};
    this.productModal = item;
    let consultaStock: any = await this.productService
      .getStockProduct(item.sku)
      .toPromise();
    this.stockProducto = consultaStock;
    this.modalRef = this.modalService.show(template, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  ErrorImage(event: any) {
    this.exists = false;
  }
}
