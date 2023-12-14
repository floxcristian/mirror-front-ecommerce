// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  ICartTotal,
  IShoppingCart,
  IShoppingCartProduct,
} from '@core/models-v2/cart/shopping-cart.interface';
// Environment
import { environment } from '@env/environment';
import { GeolocationServiceV2 } from './geolocation/geolocation.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ShoppingCartStorageService } from '@core/storage/shopping-cart-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { IError } from '@core/models-v2/error/error.interface';
import { ToastrService } from 'ngx-toastr';

const API_CART = `${environment.apiEcommerce}/api/v1/shopping-cart`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private geolocationService = inject(GeolocationServiceV2);
  private sessionStorage = inject(SessionStorageService);
  private shoppingCartStorage = inject(ShoppingCartStorageService);
  private sessionService = inject(SessionService);
  private datePipe = inject(DatePipe);
  private toastrServise = inject(ToastrService);

  private data: IShoppingCart = {
    products: [],
    quantity: 0,
    subtotal: 0,
    totals: [],
    total: 0,
  };
  private CartData!: IShoppingCart;
  private cartTempData!: IShoppingCart;
  shipping!: ICartTotal;
  discount: ICartTotal | null = null;
  private shippingType!: string;
  private isLoadingCart!: boolean;

  private itemsSubject$: BehaviorSubject<IShoppingCartProduct[]> =
    new BehaviorSubject(this.data.products);
  private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(
    this.data.quantity
  );
  private subtotalSubject$: BehaviorSubject<number | undefined> =
    new BehaviorSubject(this.data.subtotal);
  private totalsSubject$: BehaviorSubject<ICartTotal[] | undefined> =
    new BehaviorSubject(this.data.totals);
  private totalSubject$: BehaviorSubject<number | undefined> =
    new BehaviorSubject(this.data.total);
  private onAddingSubject$: Subject<IShoppingCartProduct> = new Subject();
  private shippingTypeSubject$: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  /* dropdown */
  public dropCartActive$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public cartDataSubject$: BehaviorSubject<IShoppingCart> =
    new BehaviorSubject(this.CartData);

  readonly items$: Observable<IShoppingCartProduct[] | undefined> =
    this.itemsSubject$.asObservable();
  readonly quantity$: Observable<number> =
    this.quantitySubject$.asObservable();
  readonly subtotal$: Observable<number | undefined> =
    this.subtotalSubject$.asObservable();
  readonly totals$: Observable<ICartTotal[] | undefined> =
    this.totalsSubject$.asObservable();
  readonly total$: Observable<number | undefined> =
    this.totalSubject$.asObservable();
  readonly onAdding$: Observable<IShoppingCartProduct> =
    this.onAddingSubject$.asObservable();
  readonly isDropCartActive$: Observable<any> =
    this.dropCartActive$.asObservable();
  readonly shippingType$: Observable<any> =
    this.shippingTypeSubject$.asObservable();
  // readonly shippingValidateProducts$: Observable<any> = this.shippingValidateProductsSubject$.asObservable();
  // readonly onAddingmovilButton$: Observable<IShoppingCartProduct | null> = this.onAddingMovilButtonSubject$.asObservable();

  load(): void {
    if (this.isLoadingCart) return;

    this.isLoadingCart = true;
    const usuario = this.sessionStorage.get();
    if (!usuario) {
      return;
    }

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    if (!usuario.hasOwnProperty('documentId')) usuario.documentId = '0';

    // Sucursal
    console.log('getSelectedStore desde load');
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    const sucursal = tiendaSeleccionada.code;

    this.http
      .get<IShoppingCart>(
        `${API_CART}?user=${usuario.username}&branch=${sucursal}&documentId=${usuario.documentId}`
      )
      .subscribe({
        next: (response: IShoppingCart) => {
          this.isLoadingCart = false;

          this.CartData = response;
          this.cartTempData = response;
          this.cartDataSubject$.next(this.CartData);
          this.data.products = this.CartData.products;

          // obtenemos el despacho desde el carro
          if (this.CartData.shipment) {
            let nombre = '';
            if (this.CartData.shipment.serviceType == 'TIENDA') {
              if (
                this.cartTempData.groups &&
                this.cartTempData.groups.length > 1
              ) {
                //ver quien tiene la mayor fecha para el despacho
                let temp: any[] = [];

                this.cartTempData.groups.forEach((item: any) => {
                  temp.push(item.despacho.fechaDespacho);
                });

                temp = temp.sort(
                  (a, b) => new Date(b).getTime() - new Date(a).getTime()
                );

                nombre =
                  `Retiro en tienda ` +
                  this.datePipe.transform(temp[0], 'EEEE dd MMM');
              } else {
                nombre =
                  `Retiro en tienda ` +
                  this.datePipe.transform(
                    this.CartData.shipment.requestedDate,
                    'EEEE dd MMM'
                  );
              }

              this.updateShippingType('retiro');
            } else if (
              this.CartData.shipment.serviceType != '' &&
              this.CartData.shipment.serviceType != 'TIENDA'
            ) {
              if (
                this.cartTempData.groups &&
                this.cartTempData.groups.length > 1
              ) {
                //ver quien tiene la mayor fecha para el despacho
                let temp: any[] = [];
                this.cartTempData.groups.forEach((item: any) => {
                  temp.push(item.despacho.fechaDespacho);
                });

                temp = temp.sort(
                  (a, b) => new Date(b).getTime() - new Date(a).getTime()
                );

                nombre =
                  `Despacho ` +
                  this.datePipe.transform(temp[0], 'EEEE dd MMM');
                this.updateShippingType('despacho');
              } else {
                nombre =
                  `Despacho ` +
                  this.datePipe.transform(
                    this.CartData.shipment.requestedDate,
                    'EEEE dd MMM'
                  );
                this.updateShippingType('despacho');
              }
            } else if (this.CartData.shipment.serviceType == '') {
              nombre = `Seleccione Fecha `;
            }

            let suma = 0;
            let array_precio: any = [];
            if (
              this.CartData.shipment.serviceType == 'STD' ||
              this.CartData.shipment.serviceType == 'TIENDA' ||
              this.CartData.shipment.serviceType == 'EXP'
            ) {
              this.cartTempData.groups?.forEach((item: any) => {
                let precio: number = 0;
                suma = Number(suma + item.despacho.precio);

                // calculando el total
                item.productos.forEach((prod: any) => {
                  precio = Number(precio + prod.precio * prod.cantidad);
                });

                array_precio.push(precio);
              });
            }

            this.shipping = {
              price: suma,
              title: nombre,
              type: 'shipping',
            };

            // si existe descuento de despacho se agrega
            let descuento = 0;
            this.discount = null;
            let index = 0;
            this.cartTempData.groups?.forEach((item: any) => {
              if (
                array_precio[index] >= 60000 ||
                (usuario.userRole != 'compradorb2c' &&
                  usuario.userRole != 'temp')
              ) {
                descuento = descuento + item.despacho.descuento;
              }

              index = index + 1;
            });

            if (
              descuento > 0 &&
              (this.CartData.shipment.serviceType == 'STD' ||
                this.CartData.shipment.serviceType == 'TIENDA' ||
                this.CartData.shipment.serviceType == 'EXP')
            ) {
              this.discount = {
                price: descuento * -1,
                title: 'Descuento Despacho',
                type: 'discount',
              };
            }
          }

          this.calc();
          this.save();
        },
        error: (error: any) => {
          console.log('error', JSON.stringify(error));
          this.data.products = [];
          if (error.errorCode !== 'SHOPPING_CART_NOT_FOUND') {
            this.toastrServise.error(error.message);
          }
        },
      });
  }

  updateShippingType(type: any) {
    this.shippingTypeSubject$.next(type);
    this.shippingType = type;
    this.calc();
  }

  private save(): void {
    this.shoppingCartStorage.set(this.CartData);
  }

  calc(totalesFull = false): void {
    // let quantity = 0;
    let subtotal = 0;
    let totalNeto = 0;

    if (document.URL.indexOf('/carro-compra/resumen') > 0) {
      (this.data.products || []).forEach((item) => {
        if (totalesFull) {
          subtotal += (item.price || 0) * (item.quantity || 0);
        } else {
          subtotal += (item.price || 0) * (item.quantity || 0);
        }
      });
    } else {
      (this.data.products || []).forEach((item) => {
        if (totalesFull) {
          subtotal += (item.price || 0) * (item.quantity || 0);
        } else {
          if (this.shippingType === 'retiro') {
            if (!item.pickupConflict) {
              subtotal += (item.price || 0) * (item.quantity || 0);
            }
          } else {
            if (!item.deliveryConflict) {
              subtotal += (item.price || 0) * (item.quantity || 0);
            }
          }
        }
      });
    }

    const totals: ICartTotal[] = [];
    totalNeto = subtotal;
    subtotal = subtotal / 1.19;

    if (this.shipping !== undefined && this.shipping != null) {
      if (!this.shipping.price) {
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
    this.data.quantity = this.data.products?.length || 0;
    this.data.subtotal = subtotal;
    this.data.totals = totals;
    this.data.total = total;

    this.itemsSubject$.next(this.data.products);
    this.quantitySubject$.next(this.data.quantity);
    this.subtotalSubject$.next(this.data.subtotal);
    this.totalsSubject$.next(this.data.totals);
    this.totalSubject$.next(this.data.total);
  }

  updateCart(items: any) {
    this.CartData.products = items;
    this.calc();
    this.save();
  }

  saveCart(productos: any) {
    // Sucursal
    console.log('getSelectedStore desde saveCart');
    const tiendaSeleccionada = this.geolocationService.getSelectedStore();
    const sucursal = tiendaSeleccionada.code;
    const usuario = this.sessionService.getSession();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    const data = {
      usuario: usuario.username,
      rut: usuario.documentId,
      sucursal,
      productos,
    };

    return this.http.post(environment.apiShoppingCart + 'articulo', data).pipe(
      map((r: any) => {
        this.CartData.shipment = r.data.despacho;

        let nombre = '';
        if (this.CartData.shipment?.serviceType == 'TIENDA') {
          nombre =
            `Retiro en tienda ` +
            this.datePipe.transform(
              this.CartData.shipment?.requestedDate,
              'EEEE dd MMM'
            );
          this.updateShippingType('retiro');
        } else {
          nombre =
            `Despacho ` +
            this.datePipe.transform(
              this.CartData.shipment?.requestedDate,
              'EEEE dd MMM'
            );
          this.updateShippingType('despacho');
        }

        this.shipping = {
          price: this.CartData.shipment?.price,
          title: nombre,
          type: 'shipping',
        };
        return r;
      })
    );
  }

  setSaveCart(id: string | undefined, status: string): Observable<any> {
    const usuario = this.sessionStorage.get();
    if (usuario?.login_temp) {
      this.toastrServise.warning('Debe iniciar sesion para guardar el carro');
      throw Error('Debe iniciar sesion para guardar el carro');
    }

    return this.http.put(`${API_CART}/${id}/status/${status}`, {});
  }

  getPriceArticle(params: {
    sku: string;
    branch: string;
    documentId: string;
  }) {
    return this.http.get(API_CART, {
      params,
    });
  }
}
