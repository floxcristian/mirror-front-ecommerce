// Angular
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// Rxjs
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Services
import { RootService } from './root.service';
import { GeoLocationService } from './geo-location.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isVacio } from '../utils/utilidades';
// Libs
import { ToastrService } from 'ngx-toastr';
// Interfaces
import { Product, ProductPrecio, ProductOrigen } from '../interfaces/product';
import { CartData, ProductCart, CartTotal } from '../interfaces/cart-item';
import { Usuario } from '../interfaces/login';
import { ResponseApi } from '../interfaces/response-api';

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
  loadingCart = false;

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
  origenHistory: string[] = [];
  IVA = environment.IVA || 0.19;

  constructor(
    private http: HttpClient,
    private root: RootService,
    private localS: LocalStorageService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private geoLocationService: GeoLocationService
  ) {}

  add(
    producto: Product,
    quantity: number,
    options: { name: string; value: string }[] = []
  ): Observable<any> {
    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;

    this.cartSession = this.localS.get('carroCompraB2B') as any;
    let productoCarro;

    if (this.cartSession == null) {
      productoCarro = { cantidad: 0 };
    } else {
      productoCarro = (this.cartSession.productos || []).find(
        (item) => item.sku === producto.sku
      ) || { cantidad: 0 };
    }

    const usuario = this.root.getDataSesionUsuario();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;

    const data = {
      usuario: usuario.username,
      rut: usuario.rut,
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
          this.localS.remove('ordenCompraCargada');
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

  addLista(products: Product[] | any[] | undefined): Observable<any> {
    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;

    this.cartSession = this.localS.get('carroCompraB2B') as any;
    let productoCarro;
    const productos: any[] = [];

    (products || []).forEach((producto) => {
      if (this.cartSession == null) {
        productoCarro = { cantidad: 0 };
      } else {
        productoCarro = (this.cartSession.productos || []).find(
          (item) => item.sku === producto.sku
        ) || { cantidad: 0 };
      }

      productos.push({
        sku: producto.sku,
        cantidad: (productoCarro.cantidad || 0) + 1,
        origen: producto.origen ? producto.origen : null,
        estado: producto.estado,
      });
    });

    const usuario = this.root.getDataSesionUsuario();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;

    const data = {
      usuario: usuario.username,
      rut: usuario.rut,
      sucursal,
      productos,
    };

    return this.http.post(`${environment.apiShoppingCart}articulo`, data).pipe(
      map((r: any) => {
        this.CartData = r.data;

        if (r.error !== true) {
          this.data.productos = this.CartData.productos;
          /* se limpia OV cargada */
          this.localS.remove('ordenCompraCargada');
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

  // seleccion de la pestaña de despachos
  updateShippingType(type: any) {
    this.shippingTypeSubject$.next(type);
    this.shippingType = type;
    this.calc();
  }

  calc(totalesFull = false): void {
    let quantity = 0;
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
    this.localS.set('carroCompraB2B', this.CartData as any);
  }

  private saveOmni(): void {
    this.localS.set('carroCompraOMNI', this.CartData as any);
  }

  load(): void {
    if (this.loadingCart) {
      return;
    }
    this.loadingCart = true;

    const usuario: Usuario = this.localS.get('usuario') as any;
    if (usuario == null) {
      return;
    }

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    if (!usuario.hasOwnProperty('rut')) usuario.rut = '0';

    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;

    this.http
      .get(
        environment.apiShoppingCart +
          `?usuario=${usuario.username}&sucursal=${sucursal}&rut=${usuario.rut}`
      )
      .pipe(
        map((r: any) => {
          this.loadingCart = false;

          this.CartData = r.data;
          this.cartTempData = r.data;
          this.CartDataSubject$.next(this.CartData);
          if (!r.error) {
            this.data.productos = this.CartData.productos;

            // obtenemos el despacho desde el carro
            if (this.CartData.despacho) {
              let nombre = '';
              if (this.CartData.despacho.tipo == 'TIENDA') {
                if (this.cartTempData.grupos.length > 1) {
                  //ver quien tiene la mayor fecha para el despacho
                  let temp: any[] = [];

                  this.cartTempData.grupos.forEach((item: any) => {
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
                      this.CartData.despacho.fechaDespacho,
                      'EEEE dd MMM'
                    );
                }

                this.updateShippingType('retiro');
              } else if (
                this.CartData.despacho.tipo != '' &&
                this.CartData.despacho.tipo != 'TIENDA'
              ) {
                if (this.cartTempData.grupos.length > 1) {
                  //ver quien tiene la mayor fecha para el despacho
                  let temp: any[] = [];
                  this.cartTempData.grupos.forEach((item: any) => {
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
                      this.CartData.despacho.fechaDespacho,
                      'EEEE dd MMM'
                    );
                  this.updateShippingType('despacho');
                }
              } else if (this.CartData.despacho.tipo == '') {
                nombre = `Seleccione Fecha `;
              }

              let suma = 0;
              let array_precio: any = [];
              if (
                this.CartData.despacho.tipo == 'STD' ||
                this.CartData.despacho.tipo == 'TIENDA' ||
                this.CartData.despacho.tipo == 'EXP'
              ) {
                this.cartTempData.grupos.forEach((item: any) => {
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
              this.cartTempData.grupos.forEach((item: any) => {
                if (
                  array_precio[index] >= 60000 ||
                  (usuario.user_role != 'compradorb2c' &&
                    usuario.user_role != 'temp')
                ) {
                  descuento = descuento + item.despacho.descuento;
                }

                index = index + 1;
              });

              if (
                descuento > 0 &&
                (this.CartData.despacho.tipo == 'STD' ||
                  this.CartData.despacho.tipo == 'TIENDA' ||
                  this.CartData.despacho.tipo == 'EXP')
              ) {
                this.discount = {
                  price: descuento * -1,
                  title: 'Descuento Despacho',
                  type: 'discount',
                };
              }
            }
          } else {
            this.data.productos = [];
          }
          this.calc();
          this.save();
        })
      )
      .subscribe(
        (r) => {},
        (e) => {
          console.log('error', e);
        }
      );
  }

  //funcion para el load Omni
  async loadOmni(id: any) {
    this.loadingCart = false;

    if (this.loadingCart) {
      return;
    }
    this.loadingCart = true;

    let r: any = await this.http
      .get(environment.apiShoppingCart + `omni?id=${id}`)
      .toPromise();
    this.loadingCart = false;

    this.CartData = r.data;
    this.cartTempData = r.data;
    this.CartDataSubject$.next(this.CartData);
    if (!r.error) {
      this.data.productos = this.CartData.productos;

      // obtenemos el despacho desde el carro
      if (this.CartData.despacho) {
        let nombre = '';
        if (this.CartData.despacho.tipo == 'TIENDA') {
          if (this.cartTempData.grupos.length > 1) {
            //ver quien tiene la mayor fecha para el despacho
            let temp: any[] = [];

            this.cartTempData.grupos.forEach((item: any) => {
              temp.push(item.despacho.fechaDespacho);
            });

            temp = (temp || []).sort(
              (a, b) => new Date(b).getTime() - new Date(a).getTime()
            );

            nombre =
              `Retiro en tienda ` +
              this.datePipe.transform(temp[0], 'EEEE dd MMM');
          } else {
            nombre =
              `Retiro en tienda ` +
              this.datePipe.transform(
                this.CartData.despacho.fechaDespacho,
                'EEEE dd MMM'
              );
          }

          this.updateShippingType('retiro');
        } else if (
          this.CartData.despacho.tipo != '' &&
          this.CartData.despacho.tipo != 'TIENDA'
        ) {
          if (this.cartTempData.grupos.length > 1) {
            //ver quien tiene la mayor fecha para el despacho
            let temp: any[] = [];
            this.cartTempData.grupos.forEach((item: any) => {
              temp.push(item.despacho.fechaDespacho);
            });

            temp = temp.sort(
              (a, b) => new Date(b).getTime() - new Date(a).getTime()
            );

            nombre =
              `Despacho ` + this.datePipe.transform(temp[0], 'EEEE dd MMM');
            this.updateShippingType('despacho');
          } else {
            nombre =
              `Despacho ` +
              this.datePipe.transform(
                this.CartData.despacho.fechaDespacho,
                'EEEE dd MMM'
              );
            this.updateShippingType('despacho');
          }
        } else if (this.CartData.despacho.tipo == '') {
          nombre = `Seleccione Fecha `;
        }

        let suma = 0;
        let array_precio: any = [];
        if (
          this.CartData.despacho.tipo == 'STD' ||
          this.CartData.despacho.tipo == 'TIENDA' ||
          this.CartData.despacho.tipo == 'EXP'
        ) {
          this.cartTempData.grupos.forEach((item: any) => {
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
        this.cartTempData.grupos.forEach((item: any) => {
          descuento = descuento + item.despacho.descuento;

          index = index + 1;
        });

        if (
          descuento > 0 &&
          (this.CartData.despacho.tipo == 'STD' ||
            this.CartData.despacho.tipo == 'TIENDA' ||
            this.CartData.despacho.tipo == 'EXP')
        ) {
          this.discount = {
            price: descuento * -1,
            title: 'Descuento Despacho',
            type: 'discount',
          };
        }
      }
    } else {
      this.data.productos = [];
    }
    this.calc();
    this.saveOmni();
  }

  loadPrecio(codigo_tienda: any): void {
    if (this.loadingCart) {
      return;
    }
    this.loadingCart = true;
    const usuario: Usuario = this.localS.get('usuario') as any;
    if (usuario == null) {
      return;
    }
    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const sucursalPrecio = codigo_tienda;
    this.http
      .get(
        environment.apiShoppingCart +
          `?usuario=${usuario.username}&sucursal=${sucursal}&sucursalPrecio=${sucursalPrecio}&rut=${usuario.rut}`
      )
      .pipe(
        map((r: any) => {
          this.loadingCart = false;

          this.CartData = r.data;
          this.cartTempData = r.data;
          this.CartDataSubject$.next(this.CartData);
          if (!r.error) {
            this.data.productos = this.CartData.productos;

            // obtenemos el despacho desde el carro
            if (this.CartData.despacho) {
              let nombre = '';
              if (this.CartData.despacho.tipo == 'TIENDA') {
                if (this.cartTempData.grupos.length > 1) {
                  //ver quien tiene la mayor fecha para el despacho
                  let temp: any[] = [];

                  this.cartTempData.grupos.forEach((item: any) => {
                    temp.push(item.despacho.fechaDespacho);
                  });

                  temp = (temp || []).sort(
                    (a, b) => new Date(b).getTime() - new Date(a).getTime()
                  );

                  nombre =
                    `Retiro en tienda ` +
                    this.datePipe.transform(temp[0], 'EEEE dd MMM');
                } else {
                  nombre =
                    `Retiro en tienda ` +
                    this.datePipe.transform(
                      this.CartData.despacho.fechaDespacho,
                      'EEEE dd MMM'
                    );
                }

                this.updateShippingType('retiro');
              } else if (
                this.CartData.despacho.tipo != '' &&
                this.CartData.despacho.tipo != 'TIENDA'
              ) {
                if (this.cartTempData.grupos.length > 1) {
                  //ver quien tiene la mayor fecha para el despacho
                  let temp: any[] = [];
                  this.cartTempData.grupos.forEach((item: any) => {
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
                      this.CartData.despacho.fechaDespacho,
                      'EEEE dd MMM'
                    );
                  this.updateShippingType('despacho');
                }
              } else if (this.CartData.despacho.tipo == '') {
                nombre = `Seleccione Fecha `;
              }

              let suma = 0;
              let array_precio: any = [];
              if (
                this.CartData.despacho.tipo == 'STD' ||
                this.CartData.despacho.tipo == 'TIENDA' ||
                this.CartData.despacho.tipo == 'EXP'
              ) {
                this.cartTempData.grupos.forEach((item: any) => {
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
              this.cartTempData.grupos.forEach((item: any) => {
                if (
                  array_precio[index] >= 60000 ||
                  (usuario.user_role != 'compradorb2c' &&
                    usuario.user_role != 'temp')
                ) {
                  descuento = descuento + item.despacho.descuento;
                }

                index = index + 1;
              });

              if (
                descuento > 0 &&
                (this.CartData.despacho.tipo == 'STD' ||
                  this.CartData.despacho.tipo == 'TIENDA' ||
                  this.CartData.despacho.tipo == 'EXP')
              ) {
                this.discount = {
                  price: descuento * -1,
                  title: 'Descuento Despacho',
                  type: 'discount',
                };
              }
            }
          } else {
            this.data.productos = [];
          }
          this.calc();
          this.save();
        })
      )
      .subscribe(
        (r) => {},
        (e) => {
          console.log('error', e);
        }
      );
  }

  remove(item: any): Observable<any> {
    const carro: CartData = this.localS.get('carroCompraB2B') as any;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        sku: item.sku,
        usuario: carro.usuario,
        sucursal: item.sucursalOrigen,
      },
    };

    return this.http
      .delete(environment.apiShoppingCart + 'articulo', options)
      .pipe(
        map((r: any) => {
          if (!r.error) {
            if (r.data == null) {
              this.CartData.productos = [];
            } else {
              this.CartData = r.data;
            }

            this.data.productos = this.CartData.productos;
            /* se limpia OV cargada */
            this.localS.remove('ordenCompraCargada');
            this.save();
            this.calc();
          }

          return r;
        })
      );
  }

  removeGroup(params: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: params.id,
        usuario: params.usuario,
        sucursal: params.destino,
      },
    };
    return this.http
      .delete(environment.apiShoppingCart + 'grupo', options)
      .pipe(
        map((r: any) => {
          if (!r.error) {
            if (r.data == null) {
              this.CartData.productos = [];
            } else {
              this.CartData = r.data;
            }

            this.data.productos = this.CartData.productos;
            /* se limpia OV cargada */
            this.localS.remove('ordenCompraCargada');
            this.save();
            this.calc();
          }

          return r;
        })
      );
  }

  updateCart(items: any) {
    this.CartData.productos = items;
    this.calc();
    this.save();
  }

  saveCart(productos: any) {
    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const usuario = this.root.getDataSesionUsuario();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    const data = {
      usuario: usuario.username,
      rut: usuario.rut,
      sucursal,
      productos,
    };

    return this.http.post(environment.apiShoppingCart + 'articulo', data).pipe(
      map((r: any) => {
        this.CartData.despacho = r.data.despacho;

        let nombre = '';
        if (this.CartData.despacho?.tipo == 'TIENDA') {
          nombre =
            `Retiro en tienda ` +
            this.datePipe.transform(
              this.CartData.despacho?.fechaDespacho,
              'EEEE dd MMM'
            );
          this.updateShippingType('retiro');
        } else {
          nombre =
            `Despacho ` +
            this.datePipe.transform(
              this.CartData.despacho?.fechaDespacho,
              'EEEE dd MMM'
            );
          this.updateShippingType('despacho');
        }

        this.shipping = {
          price: this.CartData.despacho?.precio,
          title: nombre,
          type: 'shipping',
        };
        return r;
      })
    );
  }

  updateShipping(despacho: any) {
    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const carro: CartData = this.localS.get('carroCompraB2B') as any;
    const usuario: Usuario = this.root.getDataSesionUsuario();
    const invitado: Usuario = this.localS.get('invitado') as any;
    const recibe: any = this.localS.get('recibe');
    const productos = (carro.productos || []).map((item) => {
      return {
        sku: item.sku,
        cantidad: item.cantidad,
      };
    });

    const data = {
      usuario: usuario.username ? usuario.username : invitado._id,
      rut: usuario.rut ? usuario.rut : 0,
      sucursal,
      productos,
      despacho,
      invitado,
      recibe,
    };

    return this.http.post(environment.apiShoppingCart + 'articulo', data).pipe(
      map((r: any) => {
        this.load();
        return r;
      })
    );
  }
  //* funcion para el cambio de sucursalPrecio//

  updateShippingPrecio(despacho: any) {
    // Sucursal
    const sucursal = this.tiendaPrecio.codigo;
    const carro: CartData = this.localS.get('carroCompraB2B') as any;
    const usuario: Usuario = this.root.getDataSesionUsuario();
    const invitado: Usuario = this.localS.get('invitado') as any;
    const recibe: any = this.localS.get('recibe');
    const productos = (carro.productos || []).map((item) => {
      return {
        sku: item.sku,
        cantidad: item.cantidad,
      };
    });

    const data = {
      usuario: usuario.username ? usuario.username : invitado._id,
      rut: usuario.rut ? usuario.rut : 0,
      sucursal,
      productos,
      despacho,
      invitado,
      recibe,
    };
    return this.http.post(environment.apiShoppingCart + 'articulo', data).pipe(
      map((r: any) => {
        this.loadPrecio(sucursal);
        return r;
      })
    );
  }

  updateShippingPrecioDespacho(despacho: any) {
    // Sucursal
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const carro: CartData = this.localS.get('carroCompraB2B') as any;
    const usuario: Usuario = this.root.getDataSesionUsuario();
    const invitado: Usuario = this.localS.get('invitado') as any;
    const recibe: any = this.localS.get('recibe');
    const productos = (carro.productos || []).map((item) => {
      return {
        sku: item.sku,
        cantidad: item.cantidad,
      };
    });

    const data = {
      usuario: usuario.username ? usuario.username : invitado._id,
      rut: usuario.rut ? usuario.rut : 0,
      sucursal,
      productos,
      despacho,
      invitado,
      recibe,
    };
    // const data = data

    return this.http.post(environment.apiShoppingCart + 'articulo', data).pipe(
      map((r: any) => {
        this.loadPrecio(sucursal);
        return r;
      })
    );
  }

  emitValidateProducts(products: any) {
    this.shippingValidateProductsSubject$.next(products);
  }

  generaOrdenDeCompra(data: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiShoppingCart + `generar`,
      data
    );
  }

  purchaseRequest(data: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiShoppingCart + `solicitaraprobacion`,
      data
    );
  }

  refuseOrder(data: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiShoppingCart + `rechazarcarro`,
      data
    );
  }

  subeOrdenDeCompra(data: any) {
    const optionsHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    const formData: FormData = new FormData();
    // tslint:disable-next-line: forin
    for (const key in data) {
      formData.append(key, data[key]);
    }

    return this.http.post(environment.apiShoppingCart + 'cargaoc', formData);
  }

  addTotalShipping(envio: any) {
    this.shipping = envio;
    this.calc();
  }

  removeTotalShipping() {
    this.shipping = null;
    this.calc();
  }

  addTotaldiscount(envio: any) {
    this.discount = envio;
    this.calc();
  }

  addProductfromMovilButton() {
    this.onAddingMovilButtonSubject$.next(null);
  }

  removeTotalDiscount() {
    this.discount = null;
    this.calc();
  }

  cargarPrecioEnProducto(producto: Product) {
    //obtiene el usuario
    const user = this.root.getDataSesionUsuario();
    let rut = user && user.rut ? user.rut : 0;

    //obtiene la tienda seleccionada
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();

    const parametrosPrecios = {
      sku: producto.sku,
      sucursal: tiendaSeleccionada?.codigo,
      rut: rut,
    };

    this.getPriceProduct(parametrosPrecios).subscribe((r: any) => {
      const precio: ProductPrecio = r.precio;

      precio.precio = !isVacio(user.iva)
        ? user.iva
          ? precio.precio
          : precio.precio / (1 + this.IVA)
        : precio.precio;
      producto.precio = precio;
      producto.precioComun = !isVacio(user.iva)
        ? user.iva
          ? r.precioComun
          : r.precioComun / (1 + this.IVA)
        : r.precioComun;
    });
  }

  uploadExcel(data: any) {
    const formData: FormData = new FormData();
    // tslint:disable-next-line: forin
    for (const key in data) {
      formData.append(key, data[key]);
    }

    return this.http.post<ResponseApi>(
      environment.apiShoppingCart + 'cargarlistado',
      formData
    );
  }

  uploadOC(data: any) {
    const formData: FormData = new FormData();
    // tslint:disable-next-line: forin
    for (const key in data) {
      formData.append(key, data[key]);
    }

    return this.http.post<ResponseApi>(
      environment.apiShoppingCart + 'cargarListadoPdf',
      formData
    );
  }

  pendingOrders(data: any) {
    return this.http.post(
      environment.apiShoppingCart + 'listadoPedidos',
      data
    );
  }

  getOrderDetail(id: any) {
    return this.http.get(environment.apiShoppingCart + `detallePedido/${id}`);
  }

  cartTransfer(data: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiShoppingCart + `traspaso`,
      data
    );
  }

  getPriceProduct(params: any) {
    return this.http.get(environment.apiShoppingCart + `buscaprecio`, {
      params,
    });
  }

  getPriceScale(params: any) {
    return this.http.get(`${environment.apiShoppingCart}buscaprecioescala`, {
      params,
    });
  }

  saveInvitado(params: any) {
    return this.http.post(`${environment.apiCustomer}nuevotemporal`, params);
  }
  savePaso(params: any) {
    return this.http.put(`${environment.apiShoppingCart}paso`, params);
  }
  saveCarroTemp(params: any) {
    return this.http.post(`${environment.apiShoppingCart}carrotemp`, params);
  }
  agregaInvitado(params: any) {
    return this.http.post(
      `${environment.apiShoppingCart}agregarinvitado`,
      params
    );
  }
  agregaBusqueda(params: any) {
    return this.http.post(
      `${environment.apiShoppingCart}agregarbusquedas`,
      params
    );
  }

  getInfoOV(ov: string) {
    let params = new HttpParams().append('ov', ov);
    return this.http.get(`${environment.apiShoppingCart}detallepago`, {
      params: params,
    });
  }

  getSaveCart(pagina: number, carrosPorPagina: number) {
    const usuario: Usuario = this.localS.get('usuario') as any;
    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    let params: any = {
      usuario: usuario.username,
      estado: 'guardado',
      pagina: pagina.toString(),
      carroPorPagina: carrosPorPagina.toString(),
    };
    return this.http.get(`${environment.apiShoppingCart}busquedas`, {
      params,
    });
  }

  setSaveCart(objeto: any): Observable<any> {
    const usuario: Usuario = this.localS.get('usuario') as any;
    if (usuario.login_temp) {
      this.toast.warning('Debe iniciar sesion para guardar el carro');
      throw Error('Debe iniciar sesion para guardar el carro');
      //return;
    }
    let params = objeto;

    return this.http.put(environment.apiShoppingCart + `estado`, params);
  }

  /**
   * @author ignacio zapata  \"2020-09-28\
   * @desc Metodo utilizado para guardar el origen y seccion al momento de ingresar a una ficha de producto.
   * @params
   * @return
   */
  setOrigenHistory(origen: string[]) {
    this.origenHistory = this.origenHistory ? origen : [];
  }

  getOrigenHistory() {
    return this.origenHistory;
  }

  /**
   * @author ignacio zapata  \"2020-09-28\
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

  /**
   * @author José Espinoza
   * @description Actualiza y obtiene la primera visita del gracias por tu compra en el carro
   * @param idCarro
   * Ejemplo de respuesta:
   * {
   *    "esPrimeraVisita": false,
   *    "carro": {
   *      "correlativo": 39747,
   *      "primeraVisitaGraciasPorTuCompra": "2021-03-19T13:20:08.806Z",
   *      "_id": "6053bc88439ad02bc1a5f0f0"
   *    }
   * }
   */
  primeraVisitaGraciasPorTuCompra(idCarro: string): Observable<any> {
    return this.http.post(
      environment.apiShoppingCart + 'primeraVisitaGraciasPorTuCompra',
      {
        id: idCarro,
      }
    );
  }

  /**
   * @author Ignacio zapata
   * @description Valida el stock actual con la cantidad de productos solicitadas de un carro especifico.
   * @param idCarro
   */
  async validarStockActual(carro: any) {
    try {
      let url = `${environment.apiShoppingCart}validarStockActual/?idCarro=${carro._id}`;
      let consulta: any = await this.http.get(url).toPromise();
      if (consulta.error) {
        this.toast.error('Ha ocurrido un error validando el stock');
        console.log(
          'Ha ocurrido un problema validando el stock',
          consulta.msg
        );
      }
      return consulta.data;
    } catch (e) {
      this.toast.error('Ha ocurrido un error validando el stock');
      console.log('Ha ocurrido un problema validando el stock', e);
      return { error: true, msg: e, data: {} };
    }
  }

  /**
   * @author Sebastian Aracena  \"2021-07-30\
   * @desc Metodo utilizado para llamar al carro de forma sincronica.
   * @return cartSession
   */
  cargar_carro() {
    const tiendaSeleccionada = this.geoLocationService.getTiendaSeleccionada();
    const sucursal = tiendaSeleccionada?.codigo;
    const usuario = this.root.getDataSesionUsuario();
    let consulta = null;
    if (usuario.user_role != 'temp') {
      usuario.username = usuario.username ? usuario.username : usuario.email;
      consulta = this.http.get(
        environment.apiShoppingCart +
          `?usuario=${usuario.username}&sucursal=${sucursal}&rut=${usuario.rut}`
      );
    } else {
      consulta = this.http.get(
        environment.apiShoppingCart +
          `?usuario=${usuario.email}&sucursal=${sucursal}&rut=${usuario.rut}`
      );
    }
    return consulta;
  }

  cargar_folio(folio: any) {
    return this.http.get(
      environment.apiShoppingCart + 'carro_folio?folio=' + folio
    );
  }

  cargar_carro_oc(id: any) {
    return this.http.get(
      environment.apiShoppingCart + 'carromsg/cargar_carro?id=' + id
    );
  }

  verificar_supervisor(rut: any) {
    return this.http.get(
      environment.apiShoppingCart + 'carromsg/verificar_supervisor?rut=' + rut
    );
  }

  ingresarContacto(data: any) {
    return this.http.post(
      environment.apiShoppingCart + `agregarContactos`,
      data
    );
  }

  confirmarGtag(id: any) {
    return this.http.get(
      environment.apiShoppingCart + 'googleTag/verificar?id=' + id
    );
  }

  getCarroOmniChannel(id: any) {
    return this.http.get(
      environment.apiShoppingCart + 'getCarroOmnichanel?id=' + id
    );
  }

  registrar_contacto(data: any) {
    return this.http.post(
      environment.apiShoppingCart + 'agregarContactos',
      data
    );
  }

  confirmarOc(param: any) {
    return this.http.post(
      environment.apiShoppingCart + 'carromsg/confimar_clave',
      param
    );
  }

  confirmarOV(idCarro: any) {
    return this.http.post(environment.apiShoppingCart + `confirmar`, {
      id: idCarro,
    });
  }
}
