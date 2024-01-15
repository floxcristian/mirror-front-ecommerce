// Angular
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Rxjs
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Services
import { RootService } from './root.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
// Libs
import { ToastrService } from 'ngx-toastr';
// Interfaces
import { Product, ProductOrigen } from '../interfaces/product';
import { CartData, ProductCart, CartTotal } from '../interfaces/cart-item';
import { SessionService } from '@core/services-v2/session/session.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { StorageKey } from '@core/storage/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private data: CartData = {
    productos: [],
    quantity: 0,
    subtotal: 0,
    totals: [],
    total: 0,
  };

  private itemsSubject$: BehaviorSubject<ProductCart[] | undefined> =
    new BehaviorSubject(this.data.productos);
  private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(
    this.data.quantity
  );
  private subtotalSubject$: BehaviorSubject<number | undefined> =
    new BehaviorSubject(this.data.subtotal);
  private totalsSubject$: BehaviorSubject<CartTotal[] | undefined> =
    new BehaviorSubject(this.data.totals);
  private totalSubject$: BehaviorSubject<number | undefined> =
    new BehaviorSubject(this.data.total);
  private onAddingSubject$: Subject<ProductCart> = new Subject();
  private shippingTypeSubject$: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  private shippingValidateProductsSubject$: BehaviorSubject<[]> =
    new BehaviorSubject([]);
  private onAddingMovilButtonSubject$: Subject<ProductCart | null> =
    new Subject();

  private CartData!: CartData;
  cartTempData: any;
  cartSession!: CartData;

  // muestra el dropdown carro de compras flotante
  dropCartActive$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  CartDataSubject$: BehaviorSubject<CartData> = new BehaviorSubject(
    this.CartData
  );

  private shipping: any = [];
  private discount: CartTotal | null = null;
  isLoadingCart!: boolean;

  get items(): ReadonlyArray<ProductCart> | undefined {
    return this.data.productos;
  }

  get quantity(): number {
    return this.data.quantity;
  }

  readonly items$: Observable<ProductCart[] | undefined> =
    this.itemsSubject$.asObservable();
  readonly quantity$: Observable<number> =
    this.quantitySubject$.asObservable();
  readonly subtotal$: Observable<number | undefined> =
    this.subtotalSubject$.asObservable();
  readonly totals$: Observable<CartTotal[] | undefined> =
    this.totalsSubject$.asObservable();
  readonly total$: Observable<number | undefined> =
    this.totalSubject$.asObservable();
  readonly onAdding$: Observable<ProductCart> =
    this.onAddingSubject$.asObservable();
  readonly isDropCartActive$: Observable<any> =
    this.dropCartActive$.asObservable();
  readonly shippingType$: Observable<any> =
    this.shippingTypeSubject$.asObservable();
  readonly shippingValidateProducts$: Observable<any> =
    this.shippingValidateProductsSubject$.asObservable();
  readonly onAddingmovilButton$: Observable<ProductCart | null> =
    this.onAddingMovilButtonSubject$.asObservable();

  tiendaPrecio: any = null;
  shippingType!: string;
  IVA = environment.IVA;

  constructor(
    private http: HttpClient,
    private root: RootService,
    private localS: LocalStorageService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly sessionStorage: SessionStorageService,
    private readonly geolocationService: GeolocationServiceV2
  ) {}

  add(
    producto: any,
    quantity: number
    //options: { name: string; value: string }[] = []
  ): Observable<any> {
    // Sucursal
    console.log('getSelectedStore desde add');
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    const sucursal = tiendaSeleccionada.code;

    this.cartSession = this.localS.get('carroCompraB2B') as any;
    let productoCarro;

    if (this.cartSession == null) {
      productoCarro = { cantidad: 0 };
    } else {
      productoCarro = (this.cartSession.productos || []).find(
        (item) => item.sku === producto.sku
      ) || { cantidad: 0 };
    }

    const usuario = this.sessionService.getSession();
    // this.root.getDataSesionUsuario();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;

    const data = {
      usuario: usuario.username,
      rut: usuario.documentId,
      sucursal,
      productos: [
        {
          sku: producto.sku,
          cantidad: (productoCarro.cantidad || 0) + quantity,
          origen: producto.origen ? producto.origen : null,
          estado: producto.estado,
        },
      ],
    };

    const url = environment.apiShoppingCart;
    return this.http.post(`${environment.apiShoppingCart}articulo`, data).pipe(
      map((r: any) => {
        this.CartData = r.data;

        const productoCart: ProductCart = {
          nombre: producto.nombre,
          sku: producto.sku,
          cantidad: quantity,
          image: this.root.getUrlImagenMiniatura150(producto),
        };

        if (r.error !== true) {
          this.onAddingSubject$.next(productoCart);
          this.data.productos = this.CartData.productos;
          /* se limpia OV cargada */
          this.localS.remove(StorageKey.ordenCompraCargada);
          this.save();
          this.calc();
        } else {
          if (r.errorDetalle === 'Error: limite') {
            this.toast.warning(
              'Ha llegado al límite de 17 artículos en el carro.'
            );
          } else {
            this.toast.error(r.msg);
          }
        }

        return r;
      })
    );
  }

  calc(totalesFull = false): void {
    // let quantity = 0;
    let subtotal = 0;
    let totalNeto = 0;

    if (document.URL.indexOf('/carro-compra/resumen') > 0) {
      (this.data.productos || []).forEach((item) => {
        if (totalesFull) {
          subtotal += (item.precio || 0) * (item.cantidad || 0);
        } else {
          subtotal += (item.precio || 0) * (item.cantidad || 0);
        }
      });
    } else {
      (this.data.productos || []).forEach((item) => {
        if (totalesFull) {
          subtotal += (item.precio || 0) * (item.cantidad || 0);
        } else {
          if (this.shippingType === 'retiro') {
            if (!item.conflictoRetiro) {
              subtotal += (item.precio || 0) * (item.cantidad || 0);
            }
          } else {
            if (!item.conflictoEntrega) {
              subtotal += (item.precio || 0) * (item.cantidad || 0);
            }
          }
        }
      });
    }

    const totals: CartTotal[] = [];
    totalNeto = subtotal;
    subtotal = subtotal / 1.19;

    if (this.shipping !== undefined && this.shipping != null) {
      if (this.shipping.length == 0) {
        this.shipping.price = 0;
        this.shipping.title = 'Seleccione Fecha ';
      }
      totals.push(this.shipping);
    }

    if (this.discount != null && this.shipping != null) {
      if (this.shipping.price !== 0) {
        totals.push(this.discount);
      }
    }

    totals.push({
      title: 'IVA',
      price: totalNeto - subtotal,
      type: 'tax',
    });

    const total =
      subtotal +
      totals.reduce((acc, eachTotal) => acc + (eachTotal.price || 0), 0);
    this.data.quantity = this.data.productos?.length || 0;
    this.data.subtotal = subtotal;
    this.data.totals = totals;
    this.data.total = total;

    this.itemsSubject$.next(this.data.productos);
    this.quantitySubject$.next(this.data.quantity);
    this.subtotalSubject$.next(this.data.subtotal);
    this.totalsSubject$.next(this.data.totals);
    this.totalSubject$.next(this.data.total);
  }

  private save(): void {
    this.localS.set(StorageKey.carroCompraB2B, this.CartData as any);
  }

  /**
   * @desc Metodo utilizado para setear el origen a los productos agregados al carro desde un catalogo dinamico.
   * @params dato de tipo producto.
   * @return
   */
  async setProductoOrigen_catDinamicos(producto: Product, tipoCat: string) {
    producto.origen = {} as ProductOrigen;

    // Obtenemos los datos del catalogo desde el localstorage
    let catalogo: any = this.localS.get('catalogo');

    // seteamos los datos del origen del producto.
    producto.origen.origen = 'catalogo-dinamico';
    producto.origen.subOrigen = catalogo ? catalogo.nombre : '';
    producto.origen.seccion = tipoCat ? tipoCat : '';
    producto.origen.recomendado = '';
    producto.origen.ficha = false;

    return producto;
  }
}
