// Angular
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// Libs
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
// Rxjs
import { Subject, Subscription } from 'rxjs';
// Models
import {
  ProductCart,
  CartTotal,
  CartData,
} from '../../../../shared/interfaces/cart-item';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import {
  ShippingAddress,
  ShippingService,
  ShippingDateItem,
} from '../../../../shared/interfaces/address';
import { Usuario } from '../../../../shared/interfaces/login';
import { Banner } from '../../../../shared/interfaces/banner';
// Components
import { TabsetComponent } from 'ngx-bootstrap/tabs';
// Services
import { CartService } from '../../../../shared/services/cart.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
// Constants
import { ShippingType } from '../../../../core/enums';
import { ModalConfirmDatesComponent } from './components/modal-confirm-dates/modal-confirm-dates.component';
import { map, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { PreferenciasCliente } from '@shared/interfaces/preferenciasCliente';
import { ClientsService } from '@shared/services/clients.service';
import {
  DataModal,
  ModalComponent,
  TipoIcon,
  TipoModal,
} from '@shared/components/modal/modal.component';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { InvitadoStorageService } from '@core/storage/invitado-storage.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';

export let browserRefresh = false;
declare let dataLayer: any;
@Component({
  selector: 'app-page-cart-shipping',
  templateUrl: './page-cart-shipping.component.html',
  styleUrls: ['./page-cart-shipping.component.scss'],
  providers: [DatePipe],
})
export class PageCartShippingComponent implements OnInit, OnDestroy {
  productCart!: ProductCart[];
  @ViewChild('tabsShipping', { static: false }) tabsShipping!: TabsetComponent;

  innerWidth: number;
  loadingSucursal: boolean = true;
  banners: Banner[] = [];
  private destroy$: Subject<void> = new Subject();
  usuarioInvitado: boolean = false;
  invitado!: Usuario;
  direccion: boolean = false;
  usuarioInv: any;
  recibeType = 'yo';
  recibeOtra: boolean = false;
  recibeOtraname: string = '';
  recibeYoname: string = '';
  showNewAddress: boolean = false;
  showDetalleProductos: boolean = false;
  showresumen: boolean = false;
  tienda!: IStore;
  retiro = '';
  conflictoEntrega: boolean = false;
  //variables para el despachos
  shippingType: string = '';
  tienda_actual: any = null;
  grupos = 0;
  items: any[] = [];

  indexTemp = -1;
  select_grupos: boolean = false;
  confirmar: boolean = false;
  obj_fecha: any = [];
  fecha_actual = moment().startOf('day').toISOString();
  sucursal = null;

  shippingSelected: ShippingService | null = null;

  userSession!: ISession;
  cartSession!: any; //CartData;
  recidDireccion = 0;
  showMap: boolean = false;

  // retiro
  cardShippingActiveStore = 0;
  selectedShippingIdStore: any;
  tempShippingIdStore: any;
  shippingDaysStore: ShippingDateItem[] = [];
  //shippingStore: ShippingStore[] = [];
  TiendasCargadas: boolean = false;
  loadingShippingStore = false;
  fecha = new Date();
  // despacho
  cardShippingActive = 0;
  grupoShippingActive: number | null = 0;
  selectedShippingId: any;
  selectedStoreItem = {};
  addresses: ShippingAddress[] = [];
  shippingDays: ShippingDateItem[] = [];

  loadingShipping = false;
  direccionName: string = '';
  tituloDespacho: string = '';
  tituloRecibe: string = 'Persona que recibe';
  loadingShippingAll = false;
  showAllAddress: boolean = false;
  isLogin!: boolean;
  loadingResumen = false;
  subscription!: Subscription;

  // productos validados
  productsValidate: ProductCart[] = [];
  productosSeleccionado: any = [];
  fechas: any = [];
  //generar grupo de carritos
  grupoShippingCart: any = {};
  documentType = 'factura';
  loadingCotizacion = false;
  direccionConfigurada!: PreferenciasCliente;

  stores: IStore[] = [];

  constructor(
    public cart: CartService,
    private logistics: LogisticsService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private router: Router,
    private localS: LocalStorageService,
    private modalService: BsModalService,

    private cd: ChangeDetectorRef,
    private readonly gtmService: GoogleTagManagerService,
    private clientsService: ClientsService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly invitadoStorage: InvitadoStorageService,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly geolocationApiService: GeolocationApiService,
    private readonly geolocationStorage: GeolocationStorageService
  ) {
    this.localS.set('recibe', {});
    this.innerWidth = window.innerWidth;

    this.tienda_actual = this.geolocationStorage.get();
  }

  async ngOnInit() {
    this.cartSession = this.localS.get('carroCompraB2B');

    this.invitado = this.invitadoStorage.get();
    this.tienda_actual = this.geolocationStorage.get();
    this.userSession = this.sessionService.getSession();
    this.contacto_notificaciones();
    this.obtieneDireccionesCliente();
    this.obtieneTiendas();
    this.direccionConfigurada = this.localS.get('preferenciasCliente');
    this.isLogin = this.sessionService.isLoggedIn();

    if (!this.HideResumen()) {
      this.recibeType = 'yo';
    }

    setTimeout(() => {
      this.cart.dropCartActive$.next(false);
    });

    this.subscribeOnLogin();

    this.cart.shippingValidateProducts$.subscribe((r: ProductCart[]) => {
      this.productsValidate = r;

      this.invitado = this.invitadoStorage.get();
      this.userSession = this.sessionService.getSession();
      this.grupoShippingCart.grupo = [];
    });

    this.cart.items$
      .pipe(
        takeUntil(this.destroy$),
        map((ProductCarts) =>
          (ProductCarts || []).map((item) => {
            return {
              ProductCart: item,
              quantity: item.cantidad,
            };
          })
        )
      )
      .subscribe((items) => {
        this.items = items;
      });
    //marcaje google tag
    if (
      this.userSession.userRole !== 'supervisor' &&
      this.userSession.userRole !== 'comprador'
    ) {
      this.gtmService.pushTag({
        event: 'shipping',
        pagePath: window.location.href,
      });
    }
    this.onSelect(null, 'retiro');
  }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy() {}

  async obtieneDireccionesCliente(isDelete: boolean = false) {
    this.loadingShippingAll = true;
    const usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();
    this.logistics.obtieneDireccionesCliente(usuario.documentId).subscribe(
      (r: ResponseApi) => {
        this.loadingShippingAll = false;

        if (r.error === false) {
          if (!isDelete) {
            this.selectedShippingId = String(
              Math.max.apply(
                Math,
                r.data.map((o: any) => o.recid)
              )
            );
          }
          this.selectedShippingId = String(
            Math.max.apply(
              Math,
              r.data.map((o: any) => o.recid)
            )
          );

          r.data.map((item: ShippingAddress) => {
            if (item.recid === this.selectedShippingId) {
              item.default = true;
            }
            if (item.deptocasa?.length) {
              item.direccionCompleta =
                item.calle +
                ' ' +
                item.numero +
                ', depto/casa: ' +
                item.deptocasa +
                ', ' +
                item.comuna;
            } else {
              item.direccionCompleta =
                item.calle + ' ' + item.numero + ', ' + item.comuna;
            }
          });

          this.addresses = r.data;
          if (this.shippingType === 'despacho') this.obtieneDespachos();

          this.showNewAddress = false;
        }
      },
      (e) => {
        this.toast.error(
          'Ha ocurrido un error en servicio al obtener las direcciones'
        );
      }
    );
  }

  /**
   * Obtiene contacto notificaciones.
   */
  async contacto_notificaciones() {
    let data: any = {};

    this.userSession = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    // this.invitado = this.localS.get('invitado');
    this.invitado = this.invitadoStorage.get();
    if (this.userSession.userRole != 'temp') {
      data.id = this.cartSession._id;
      data.texto4 = this.userSession.phone;
      data.texto5 = this.userSession.email;
      data.textoNombre =
        this.userSession.firstName + ' ' + this.userSession.lastName;
    } else if (this.userSession.userRole == 'temp' && this.invitado != null) {
      data.id = this.cartSession._id;
      data.texto4 = this.invitado.phone;
      data.texto5 = this.invitado.email;
      data.textoNombre = this.getFullName(this.invitado);
    }

    if (Object.keys(data).length > 0)
      await this.cart.registrar_contacto(data).toPromise();
  }

  /**
   * Obtiene despachos a domicilio.
   */
  async obtieneDespachos(removeShipping = true) {
    this.fechas = [];

    const usuario = this.sessionService.getSession();
    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;

    const resultado = this.addresses.find(
      (item) => item.recid == this.selectedShippingId
    );

    if (resultado) {
      this.loadingShipping = true;
      const data = {
        usuario: usuario.username,
        destino:
          resultado.comuna.normalize('NFD').replace(/[\u0300-\u036f]/g, '') +
          '|' +
          resultado.codRegion,
        tipo: 'DES',
      };

      this.cardShippingActiveStore = 0;

      if (removeShipping) {
        this.cart.removeTotalShipping();
        this.cart.removeTotalDiscount();
      }

      this.cardShippingActive = 0;
      this.shippingDays = [];

      let i = 0;
      let carro = await this.logistics.obtenerMultiDespachos(data).toPromise();

      if (carro.error) {
        this.shippingDays = [];
      } else {
        if (carro.length) {
          this.shippingDays = [];

          carro.forEach((r: any) => {
            let j = 0;
            let dia_despacho: any = [];
            i = i + 1;
            r.flete.forEach((item: any) => {
              let index = j++;
              const obj = {
                index,
                id: r.id,
                diasdemora: item.diasdemora,
                fecha: item.fecha,
                fechaPicking: item.fechaPicking,
                origen: r.origen,
                precio: item.valor,
                proveedor: item.proveedor,
                tipoenvio: item.opcionServicio.tser_codi,
                tipopedido: item.opcionServicio.tser_codi,
              };
              dia_despacho.push(obj);
            });

            this.shippingDays.push({
              grupo: r.id,
              productodespacho: r.productos,
              fechas: dia_despacho,
            });
          });
        }
      }
      this.loadingResumen = false;

      this.loadingShipping = false;
    } else this.loadingResumen = false;
    this.ver_fechas();
  }

  obtieneTiendas() {
    let usuarioRole = this.userSession.userRole;
    let data_usuario;

    if (
      this.userSession.username &&
      this.userSession.username != this.userSession.email
    )
      data_usuario = this.userSession.username;
    else if (
      this.userSession.username &&
      this.userSession.username == this.userSession.email
    )
      data_usuario = this.userSession.email;
    else data_usuario = this.userSession.email;
    if (usuarioRole === 'temp') {
      data_usuario = this.userSession.email;
    }

    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        this.stores = stores;
        this.TiendasCargadas = true;

        // Poner tienda seleccionada al comienzo de la lista.
        console.log('getSelectedStore desde PageCartShippingComponent');
        const selectedStore = this.geolocationService.getSelectedStore();
        const tiendaActual = this.stores.find((store) => {
          return store.code === selectedStore.code /*selectedStore.codigo*/;
        });

        // Hacer algo..
        if (tiendaActual) {
          const tiendas = this.stores.filter(
            (store) => store.id != tiendaActual.id
          );
          tiendas.unshift(tiendaActual);
          this.stores = tiendas;
          this.selectedShippingIdStore = tiendaActual.id;
          this.tempShippingIdStore = this.selectedShippingIdStore;
          this.obtieneRetiro(false);
        }
      },
    });
  }

  /**
   * Obtiene retiro en tienda.
   */
  async obtieneRetiro(removeShipping = true) {
    console.log('obtieneRetiro...');
    this.loadingShippingStore = true;

    this.fechas = [];

    // let idStore: any = this.selectedShippingIdStore;
    this.selectedShippingId = this.selectedShippingIdStore;
    const usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    const resultado = this.stores.find(
      (item) => item.id == this.selectedShippingIdStore
    );
    if (!resultado) return;

    this.tienda = resultado;
    this.cambiarTienda(this.tienda);
    this.localS.set('tiendaRetiro', resultado);

    console.log();
    let disponible = resultado;
    const data = {
      usuario: usuario.username,
      destino: disponible.code + '|' + disponible.regionCode,
      tipo: 'RC',
    };

    /*
    const sucursal = {
      usuario: usuario.username,
      sucursal: disponible.codigo
    };*/

    if (removeShipping) {
      this.shippingSelected = null;
      // reiniciamos las variables del despacho
      this.shippingDays = [];
      this.cardShippingActive = 0;
      this.cardShippingActiveStore = 0;
      this.selectedShippingId = null;
      this.cart.removeTotalShipping();
      this.cart.removeTotalDiscount();
    }

    //this.logistics.obtieneDespachoCompleto(sucursal).subscribe(async (resp: any) => {
    const consulta: any = await this.logistics.obtienRetiro(data).toPromise();
    if (consulta.error) {
      this.shippingDaysStore = [];
    } else {
      if (consulta.length) {
        this.shippingDaysStore = [];

        consulta.forEach((r: any) => {
          let i = 0;
          let dia_despacho: any = [];

          r.flete.forEach((item: any) => {
            let isSabado = this.valFindeSemana(item.fecha);
            const obj = {
              index: i++,
              id: r.id,
              diasdemora: item.diasdemora,
              fecha: item.fecha,
              fechaPicking: item.fechaPicking,
              origen: r.origen,
              precio: item.valor,
              proveedor: item.proveedor,
              tipoenvio: 'TIENDA',
              tipopedido: 'VEN- RPTDA',
              isSabado: isSabado,
            };

            dia_despacho.push(obj);
          });

          this.shippingDaysStore.push({
            grupo: r.id,
            productodespacho: r.productos,
            fechas: dia_despacho,
          });
        });
      }
      if (this.userSession.userRole == 'temp') {
        this.loadingResumen = false;
      }
    }
    this.loadingShippingStore = false;
    this.ver_fechas();
    //});
  }

  /**
   * Obtiene el nombre del usuario.
   */
  private getFullName(session: Usuario): string {
    const { first_name, last_name } = session;
    return `${first_name} ${last_name}`;
  }

  /**
   * TODO: juntar con seleccionar despacho.
   */
  //  seleccionaDespachoInvitado(item: ShippingService, pos): void {
  // // invitado solamente <<<<<<<<<<<<<<<

  //   let invitado: any = this.localS.get('invitado');
  //   invitado.tipoEnvio = 'DES';
  //   this.localS.remove('invitado');
  //   this.localS.set('invitado', invitado);
  //   this.usuarioInv = this.localS.get('invitado');
  //   // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //   this.recibeYoname = this.getFullName(invitado);

  //   this.cardShippingActive = item.index;
  //   this.grupoShippingActive = this.shippingDays[pos].grupo;
  //   this.shippingSelected = this.shippingDays[pos].fechas.find(item => item.index === this.cardShippingActive);
  //   this.productosSeleccionado = this.shippingDays[pos].productodespacho;
  //   this.recidDireccion = 0;
  //   const nombre = `Despacho ` + this.datePipe.transform(this.shippingSelected.fecha, 'EEEE dd MMM');

  //   const envio: CartTotal = {
  //     price: this.shippingSelected.precio,
  //     title: nombre,
  //     type: 'shipping'
  //   };

  //   this.cart.addTotalShipping(envio);

  //   // guardamos el despacho y vericamos si tiene descuento o no
  //   this.saveShipping();
  // }

  /**
   *
   */
  // seleccionaDespachoOriginal(item: ShippingService, pos: number): void {
  //   this.obj_fecha[pos] = item; // no esta
  //   this.recibeYoname = this.getFullName(this.userSession);

  //   this.cardShippingActive = item.index;
  //   this.grupoShippingActive = this.shippingDays[pos].grupo;
  //   this.shippingSelected = this.shippingDays[pos].fechas.find(item => item.index === this.cardShippingActive);
  //   this.productosSeleccionado = this.shippingDays[pos].productodespacho;
  //   this.recidDireccion = this.selectedShippingId;
  //   const nombre = `Despacho ` + this.datePipe.transform(this.shippingSelected.fecha, 'EEEE dd MMM');
  //   const envio: CartTotal = {
  //     price: this.shippingSelected.precio,
  //     title: nombre,
  //     type: 'shipping'
  //   };

  //   this.cart.addTotalShipping(envio);
  //   // guardamos el despacho y vericamos si tiene descuento o no
  //   this.saveShipping();

  //   // TODO:
  //   this.fechas[pos] = this.shippingSelected.fecha;
  //   this.localS.set('fechas', this.fechas);
  //   this.localS.remove('tiendaRetiro');
  // }

  /* funcion de prueba*/
  seleccionaDespacho(item: ShippingService, pos: number) {
    let invitado: any = null;

    if (this.isLogin) {
      this.recibeYoname = this.getFullName(this.userSession);
      this.recidDireccion = this.selectedShippingId;
      this.obj_fecha[pos] = item;
    }
    if (this.invitado) {
      // invitado = this.localS.get('invitado');

      invitado = this.invitadoStorage.get();
      this.recibeYoname = this.getFullName(invitado);
      this.recidDireccion = 0;
      // this.localS.set('invitado', invitado);
      this.invitadoStorage.set(invitado);
      // this.usuarioInv = this.localS.get('invitado');
      this.usuarioInv = this.invitadoStorage.get();
    }

    this.grupoShippingActive = this.shippingDays[pos].grupo ?? null;
    this.productosSeleccionado = this.shippingDays[pos].productodespacho;

    this.cardShippingActive = item.index;
    this.shippingSelected = (this.shippingDays[pos].fechas || []).find(
      (item) => item.index === this.cardShippingActive
    );

    const nombre =
      `Despacho ` +
      this.datePipe.transform(this.shippingSelected?.fecha, 'EEEE dd MMM');

    const envio: CartTotal = {
      price: this.shippingSelected?.precio,
      title: nombre,
      type: 'shipping',
    };
    this.cart.addTotalShipping(envio);

    // guardamos el despacho y vericamos si tiene descuento o no
    this.saveShipping();
    this.fechas[pos] = this.shippingSelected?.fecha;
    this.localS.set('fechas', this.fechas);
    this.localS.remove('tiendaRetiro');
  }
  /** */
  /**
   *
   */
  seleccionaRetiro(item: ShippingService, pos: number) {
    this.obj_fecha[pos] = item;
    this.cardShippingActiveStore = item.index;
    this.grupoShippingActive = this.shippingDaysStore[pos].grupo ?? null;
    this.shippingSelected = (this.shippingDaysStore[pos].fechas || []).find(
      (item) => item.index === this.cardShippingActiveStore
    );
    this.recidDireccion = this.selectedShippingIdStore;
    this.fechas[pos] = this.shippingSelected?.fecha;
    const envio: CartTotal = {
      price: this.shippingSelected?.precio,
      title: `Retiro tienda ${this.datePipe.transform(
        this.shippingSelected?.fecha,
        'EEEE dd MMM'
      )}`,
      type: 'shipping',
    };
    this.cart.addTotalShipping(envio);

    // guardamos el despacho y vericamos si tiene descuento o no
    this.saveShipping();
    this.localS.set('fechas', this.fechas);
  }

  addShipping(data: any) {
    if (data.despacho.descuento > 0) {
      const descuentoEnvio: CartTotal = {
        price: data.despacho.descuento * -1,
        title: 'Descuento Despacho',
        type: 'discount',
      };
      this.cart.addTotaldiscount(descuentoEnvio);
    }
  }

  next() {
    this.saveShipping(true);
  }

  saveShipping(redirect = false) {
    if (!this.loadingResumen) this.loadingResumen = true;
    if (this.shippingSelected?.tipoenvio === 'TIENDA')
      this.shippingSelected.tipopedido = 'VEN- RPTDA';
    else if (this.shippingSelected)
      this.shippingSelected.tipopedido = 'VEN- DPCLI';
    const despacho = {
      id: this.shippingSelected?.id,
      tipo: this.shippingSelected?.tipoenvio,
      codTipo: this.shippingSelected?.tipopedido,
      origen: this.shippingSelected?.origen,
      recidDireccion: this.recidDireccion,
      codProveedor: this.shippingSelected?.proveedor,
      nombreProveedor: this.shippingSelected?.proveedor,
      precio: this.shippingSelected?.precio,
      observacion: 'b2b',
      diasNecesarios: this.shippingSelected?.diasdemora,
      fechaPicking: this.shippingSelected?.fechaPicking,
      fechaEntrega: this.shippingSelected?.fecha,
      fechaDespacho: this.shippingSelected?.fecha,
    };

    this.cart.updateShipping(despacho).subscribe(
      (r: ResponseApi) => {
        this.loadingResumen = false;

        if (r.error) {
          this.toast.error(r.msg);
        } else {
          if (redirect) {
            this.router.navigate(['/', 'carro-compra', 'forma-de-pago']);
          }
          this.addShipping(r.data);
        }
      },
      (e) => {
        this.toast.error(
          'Ha ocurrido un error en servicio al actualizar el carro de compra'
        );
      }
    );
    this.getDireccionName(despacho.tipo || '');
  }

  subscribeOnLogin() {
    this.authStateService.session$.subscribe((user) => {
      this.isLogin = this.sessionService.isLoggedIn();
      this.obtieneDireccionesCliente();
      this.contacto_notificaciones();
    });
  }

  openModal() {
    const modalConfirmDates = this.modalService.show(
      ModalConfirmDatesComponent,
      {
        backdrop: 'static',
        keyboard: false,
        initialState: {
          shippingType: this.shippingType as any,
          confirmar: this.confirmar,
          obj_fecha: this.obj_fecha,
          select_grupos: this.select_grupos,
        },
      }
    );
    modalConfirmDates.content?.select_grupos_change.subscribe((res) => {
      this.select_grupos = res;
    });
    modalConfirmDates.content?.selectTab.subscribe((res) => {
      this.onSelect(null, res);
    });
  }

  // Evento activado cuando se un usuario logeado agrega o cancela la accion de agregar una nueva direccion.
  respuesta(event: any, isDelete: boolean = false) {
    if (event) {
      // this.obtieneDireccionesCliente();
      this.shippingSelected = null;
      if (isDelete) {
        this.obtieneDireccionesCliente(true);
        this.showAllAddress = true;
      } else {
        this.obtieneDireccionesCliente();
        this.showAllAddress = false;
        window.scrollTo({ top: 0 });
      }
    } else {
      this.showNewAddress = false;
      window.scrollTo({ top: 0 });
    }
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  retiroFlag: boolean = false;

  onSelect(event: any, formaEntrega: 'retiro' | 'despacho' | 'sucursal') {
    this.loadingResumen = true;
    this.select_grupos = false;
    this.confirmar = false;
    this.indexTemp = -1;
    this.grupos = 0;
    this.fechas = [];

    this.localS.remove('fechas');
    if (formaEntrega == 'sucursal') {
      this.loadingSucursal = true;
      formaEntrega = 'despacho';
      this.shippingType = formaEntrega;
    } else {
      this.shippingType = formaEntrega;
      this.loadingSucursal = false;
    }
    this.cart.updateShippingType(formaEntrega);

    if (formaEntrega === 'retiro') {
      this.retiroFlag = true;
      // this.recibeType = 'yo';
      this.showAllAddress = false;
      this.showNewAddress = false;
      this.direccion = false;
      this.selectedShippingIdStore = this.tempShippingIdStore;

      if (!this.selectedShippingIdStore) {
        this.shippingDaysStore = [];
        this.loadingResumen = false;
      } else if (this.selectedShippingIdStore) {
        this.obtieneRetiro(false);
      }
    } else if (formaEntrega === 'despacho' && this.isLogin) {
      this.selectedShippingId = null;

      // if (this.HideResumen()) {
      //   this.recibeType = 'yo';
      // } else {
      //   this.recibeType = 'yo';
      // }
      this.setDefaultAddress();
      if (this.selectedShippingId) {
        this.obtieneDespachos();
      }
    } else {
      this.retiroFlag = false;
    }

    // let invitado: any = this.localS.get('invitado');
    let invitado = this.invitadoStorage.get();
    if (invitado != null) {
      invitado.tipoEnvio = 'RC';
      // this.localS.remove('invitado');
      this.invitadoStorage.remove();
      // this.localS.set('invitado', invitado);
      this.invitadoStorage.set(invitado);
      // this.usuarioInv = this.localS.get('invitado');
      this.usuarioInv = this.invitadoStorage.get();

      this.obtieneDespachos();
    }
    //poner RC a cliente
    this.shippingDays = [];
    this.cardShippingActive = 0;
    //this.selectedShippingId = null;
    this.shippingSelected = null;
  }

  usuarioVisita(invitado: any) {
    this.usuarioInvitado = true;
    invitado.tipoEnvio = '';
    // this.localS.set('invitado', invitado);
    this.invitadoStorage.set(invitado);

    this.contacto_notificaciones();
    window.scrollTo({ top: 0 });
  }

  // evento ejecutado cuando un invitado agrega una nueva direccion.
  async direccionVisita(direccion: any, removeShipping = true) {
    this.direccion = true;
    let invitado = this.invitadoStorage.get();

    invitado.calle = direccion.calle;
    invitado.comuna = direccion.comuna;
    invitado.comunaCompleta = direccion.comunaCompleta;
    invitado.numero = direccion.numero;
    invitado.depto = direccion.depto ? direccion.depto : 0;
    this.invitadoStorage.remove();
    this.invitadoStorage.set(invitado);
    this.usuarioInv = this.invitadoStorage.get();
    this.loadingShipping = true;
    this.shippingSelected = null;

    const data = {
      //FIXME: revisar bien el tema del id , hasta tener las nuevas apis
      // usuario: invitado._id,
      destino: direccion.comuna
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
      tipo: 'DES',
    };

    // reiniciamos las variables del retiro en tienda
    this.shippingDaysStore = [];
    this.cardShippingActiveStore = 0;
    this.selectedShippingIdStore = null;

    if (removeShipping) {
      this.cart.removeTotalShipping();
      this.cart.removeTotalDiscount();
    }

    this.shippingDays = [];
    this.cardShippingActive = 0;
    let i = 0;
    let carro = await this.logistics.obtenerMultiDespachos(data).toPromise();

    if (carro.error) {
      this.shippingDays = [];
    } else {
      if (carro.length > 0) {
        this.shippingDays = [];

        carro.forEach((r: any) => {
          let j = 0;
          let dia_despacho: any = [];
          i = i + 1;
          r.flete.forEach((item: any) => {
            let index = j++;
            const obj = {
              index,
              id: r.id,
              diasdemora: item.diasdemora,
              fecha: item.fecha,
              fechaPicking: item.fechaPicking,
              origen: r.origen,
              precio: item.valor,
              proveedor: item.proveedor,
              tipoenvio: item.opcionServicio.tser_codi,
              tipopedido: r.codTipo,
            };
            dia_despacho.push(obj);
          });

          this.shippingDays.push({
            grupo: r.id,
            productodespacho: r.productos,
            fechas: dia_despacho,
          });
        });
      }
    }
    this.loadingResumen = false;
    this.loadingShipping = false;
  }

  setRecibe(type: any) {
    this.recibeType = type;
    this.recibeType == 'otra'
      ? (this.recibeOtra = true)
      : (this.recibeOtra = false);
    this.localS.set('recibe', {});
    this.recibeOtraname = '';
  }

  reciboPedido(recibe: any) {
    this.recibeOtra = false;
    this.recibeOtraname =
      recibe.first_name +
      ' ' +
      recibe.last_name +
      ', Celular: ' +
      recibe.phone;
    this.localS.set('recibe', recibe);
  }

  removeDespacho() {
    this.cart.removeTotalShipping();
  }

  removeAddressInvitado() {
    this.direccion = false;
    this.shippingSelected = null;
    this.selectedShippingId = null;
    this.shippingDays = [];
  }
  toggleMap() {
    this.showMap = !this.showMap;
  }

  // Funcion encargada de ocultar el resumen de la compra cuando se esta seleccionando direccion de envio.
  HideResumen() {
    if (this.innerWidth <= 800) {
      return true;
    } else {
      return false;
    }
  }

  valshowDetalleProductos() {
    if (
      (this.HideResumen() && this.shippingSelected && this.recibeType != '') ||
      (this.HideResumen() && this.showDetalleProductos === true) ||
      !this.HideResumen()
    ) {
      return true;
    } else {
      return false;
    }
  }

  valshowDetalleDireccion() {
    if (
      this.HideResumen() &&
      this.shippingSelected &&
      this.recibeOtra == false &&
      (this.recibeType == 'yo' || this.recibeType == 'otra')
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Funcion utilizada para verificar y devolver el nombre completo de una direccion, siendo usuario logeado o invitado.
  getDireccionName(tipo: string) {
    var direccion: any;
    if (tipo != 'TIENDA') {
      this.tituloDespacho = 'Dirección de despacho';
      this.tituloRecibe = 'Persona que recibe';
      if (this.isLogin) {
        direccion = this.addresses.find(
          (direccion) => direccion.recid === this.selectedShippingId
        );

        if (direccion !== undefined) {
          direccion = direccion.direccionCompleta;
        }
      } else {
        if (this.usuarioInv.depto.length > 0) {
          direccion =
            this.usuarioInv.calle +
            ', ' +
            this.usuarioInv.numero +
            ', depto/casa: ' +
            this.usuarioInv.depto +
            ', ' +
            this.usuarioInv.comuna;
        } else {
          direccion =
            this.usuarioInv.calle +
            ', ' +
            this.usuarioInv.numero +
            ', ' +
            this.usuarioInv.comuna;
        }
      }
    } else {
      this.tituloDespacho = 'Retiro en';
      this.tituloRecibe = '';
      direccion = this.stores.find(
        (tienda) => tienda.id === this.selectedShippingIdStore
      );
      if (direccion && direccion.nombre) {
        direccion = direccion.nombre;
      }
    }

    if (direccion) {
      this.direccionName = direccion;
    } else {
      this.direccionName = '';
    }
  }

  setShowDetalleProductos(value: any) {
    this.showDetalleProductos = value;
  }

  // Metodo que permite controlar cuando se muestran todas las direcciones de un usuario logeado.
  viewAllAddress() {
    this.showAllAddress = true;
    this.selectedShippingId = null;
    this.shippingSelected = null;
  }

  changeAddress(recid: any) {
    if (recid.length > 0) {
      this.selectedShippingId = recid;
      this.showAllAddress = false;
      this.showDetalleProductos = false;
      this.obtieneDespachos();
      window.scrollTo({ top: 0 });
    }
  }

  // permite setear los valores necesarios para modificar la direccion desde el boton de modificar direccion que solo aparece para pantallas mobiles.
  modificarSelectedAddress() {
    this.shippingSelected = null;
    if (this.selectedShippingIdStore == null) {
      this.selectedShippingIdStore = this.tempShippingIdStore;
      this.loadingShippingStore = true;
      this.obtieneTiendas();
    }

    if (this.isLogin) {
      this.setDefaultAddress();
      this.obtieneDespachos();
    } else {
      this.direccion = false; // null;
    }
    this.showDetalleProductos = false;
    this.onSelect(null, 'retiro');
  }

  setDefaultAddress() {
    if (this.selectedShippingId == null) {
      this.selectedShippingId = String(
        Math.max.apply(
          Math,
          this.addresses.map((o) => o.recid)
        )
      );
    }
  }

  cambiarTienda(newStore: IStore): void {
    console.log('cambiarTienda: ');
    this.geolocationService.setSelectedStore({
      zone: newStore.zone,
      code: newStore.code,
      city: newStore.city,
    });
  }

  /**
   * @author ignacio zapata  \"2020-11-06\
   * @desc funcion utilizada para verificar si la fecha es un dia sabado.
   * @params fecha en string
   * @return
   */
  valFindeSemana(fecha: string) {
    let isSabado = false;

    let dia =
      fecha && fecha.length > 0
        ? moment(fecha).locale('es').format('dddd')
        : null;
    isSabado = dia && dia === 'sábado' ? true : false;

    return isSabado;
  }

  /**
   * @author Sebastian Aracena  \2021-04-15\
   * @desc funcion utilizada para verificar si la fecha de la semana
   * @params item de grupo
   * @return
   */
  setSeleccionarEnvio(item: any, i: any) {
    if (this.shippingType == 'despacho') {
      if (this.isLogin || this.usuarioInvitado)
        this.seleccionaDespacho(item, i);
      //else if (this.usuarioInvitado) this.seleccionaDespachoInvitado(item, i);
    } else {
      if (this.isLogin || this.usuarioInvitado) this.seleccionaRetiro(item, i);
      //else if () this.seleccionaRetiro(item, i);
    }
  }

  /**
   * @author Sebastian Aracena  \2021-04-15\
   * @desc funcion utilizada para verificar si la fecha de la semana
   * @params item de grupo
   * @return
   */
  setSeleccionarEnvioMobile(item: any, i: any) {
    if (this.grupos == 0) this.grupos = this.grupos + 1;
    else if (this.grupos != 0 && this.indexTemp != i)
      this.grupos = this.grupos + 1;

    if (this.shippingType == 'despacho') {
      this.seleccionaDespacho(item, i);
      while (this.obj_fecha.length > this.shippingDays.length) {
        this.obj_fecha.splice(this.obj_fecha.length - 1, 1);
      }
      if (this.shippingDays.length == this.grupos) {
        this.confirmar = true;
        this.openModal();
      }
    } else {
      this.seleccionaRetiro(item, i);
      while (this.obj_fecha.length > this.shippingDaysStore.length) {
        this.obj_fecha.splice(this.obj_fecha.length - 1, 1);
      }
      if (this.shippingDaysStore.length == this.grupos) {
        this.confirmar = true;
        this.openModal();
      }
    }

    this.indexTemp = i;
  }

  /**
   * @author Sebastian Aracena  \2021-04-15\
   * @desc funcion utilizada para verificar si la fecha de la semana
   * @params item de grupo
   * @return
   */
  async eliminarGrupo(index: any) {
    this.loadingShipping = true;
    this.loadingResumen = true;
    const resultado: any = this.addresses.find(
      (item) => item.recid == this.selectedShippingId
    );

    const usuario = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    let params = {};
    if (this.shippingType === ShippingType.DESPACHO) {
      params = {
        usuario: usuario.username,
        id: index,
        destino: resultado.comuna,
      };
    } else {
      let disponible = this.stores.find(
        (item) => item.id == this.selectedShippingIdStore
      );
      params = {
        usuario: usuario.username,
        id: index,
        sucursal: disponible?.code,
      };
    }

    this.cart.removeGroup(params).subscribe((r) => {
      this.cart.load();

      this.shippingDaysStore = [];
      this.shippingDays = [];

      this.obtieneDespachos();
      this.obtieneTiendas();
    });
  }

  //realizando la funcion para chilexpress
  async obtieneChilexpress(removeShipping = true, chilexpress: any) {
    this.fechas = [];
    const usuario = this.sessionService.getSession(); // this.root.getDataSesionUsuario();
    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;

    const resultado = this.addresses.find(
      (item) => item.recid == this.selectedShippingId
    );

    if (resultado) {
      if (chilexpress.countyName === 'SANTIAGO CENTRO')
        chilexpress.countyName = 'SANTIAGO';
      const data = {
        usuario: usuario.username,
        destino: chilexpress.countyName,
        chilexpress: 1,
        tipo: 'DES',
      };

      this.cardShippingActiveStore = 0;

      if (removeShipping) {
        this.cart.removeTotalShipping();
        this.cart.removeTotalDiscount();
      }

      this.cardShippingActive = 0;
      this.shippingDays = [];

      let i = 0;
      let carro = await this.logistics.obtenerMultiDespachos(data).toPromise();

      if (carro.error) {
        this.shippingDays = [];
      } else {
        if (carro.length) {
          this.shippingDays = [];

          carro.forEach((r: any) => {
            let j = 0;
            let dia_despacho: any = [];
            i = i + 1;
            r.flete.forEach((item: any) => {
              let index = j++;
              const obj = {
                index,
                id: r.id,
                diasdemora: item.diasdemora,
                fecha: item.fecha,
                fechaPicking: item.fechaPicking,
                origen: r.origen,
                precio: item.valor,
                proveedor: item.proveedor,
                tipoenvio: item.tipo,
                tipopedido: r.codTipo,
              };
              dia_despacho.push(obj);
            });

            this.shippingDays.push({
              grupo: r.id,
              productodespacho: r.productos,
              fechas: dia_despacho,
            });
          });

          // verificar fechas
          if (this.shippingDays.length > 1) {
            let fechaInicial = this.shippingDays[0].fechas?.[0].fecha;
            let pos = 0;
            let i = 0;

            this.shippingDays.forEach((item) => {
              if (moment(item.fechas?.[0].fecha).isAfter(fechaInicial)) {
                fechaInicial = item.fechas?.[0].fecha;
                this.shippingDays[pos].fechas = item.fechas;
                pos = i;
              }
              i++;
            });
          }
        }
      }
      this.loadingResumen = false;
    } else this.loadingResumen = false;
  }

  setSeleccionarEnvioChilexpress(item: any, pos: any) {
    /* let i = 0;
    //console.log(item);
    this.fechas_despacho.forEach(resp => {
      this.setSeleccionarEnvio(item, pos);
      i = i + 1;
      pos = i;
    });*/
  }

  ver_fechas() {
    if (this.shippingDaysStore.length) {
      console.log('xxx: ', this.shippingDaysStore);
      let menor = this.shippingDaysStore[0].fechas?.[0].fecha;
      let menor_fecha: any = new Date(menor);
      this.shippingDaysStore.map((item) => {
        let fecha_comparar: any = new Date(item.fechas?.[0].fecha);
        if (menor_fecha.getTime() >= fecha_comparar.getTime()) {
          menor = item.fechas?.[0].fecha;
          menor_fecha = new Date(menor);
        }
      });

      if (moment(menor).startOf('day').toISOString() === this.fecha_actual) {
        this.retiro = 'Retira Hoy';
      } else {
        if (moment(menor).weekday() == 1) this.retiro = 'Retira el día lunes';
        else if (moment(menor).weekday() == 2)
          this.retiro = 'Retira el día martes';
        else if (moment(menor).weekday() == 3)
          this.retiro = 'Retira el día miercoles';
        else if (moment(menor).weekday() == 4)
          this.retiro = 'Retira el día jueves';
        else if (moment(menor).weekday() == 5)
          this.retiro = 'Retira el día viernes';
        else if (moment(menor).weekday() == 6)
          this.retiro = 'Retira el día  sabado';
        else if (moment(menor).weekday() == 7)
          this.retiro = 'Retira el día  domingo';
      }
    }
  }

  finishQuotation() {
    const data = {
      id: this.cartSession._id,
      usuario: this.userSession.username,
      tipo: 1,
      formaPago: 'OC',
    };

    this.loadingCotizacion = true;
    this.cart.generaOrdenDeCompra(data).subscribe(
      (r: ResponseApi) => {
        this.loadingCotizacion = false;

        if (r.error) {
          this.toast.error(r.msg);
          return;
        }

        this.cart.load();
        this.router.navigate([
          '/carro-compra/comprobante-de-cotizacion',
          r.data.numero,
        ]);
      },
      (e) => {
        this.toast.error('Ha ocurrido un error al generar la cotización');
      }
    );
  }

  // Eliminar dirección
  deleteAddress(direccion: any) {
    const initialState: DataModal = {
      titulo: 'Confirmación',
      mensaje: `¿Esta seguro que desea <strong>eliminar</strong> esta direccion?<br><br>
                  Calle: <strong>${direccion.calle}</strong><br>
                  Número: <strong>${direccion.numero}</strong>`,
      tipoIcon: TipoIcon.QUESTION,
      tipoModal: TipoModal.QUESTION,
    };
    const bsModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState,
      ignoreBackdropClick: true,
    });
    bsModalRef.content.event.subscribe(async (res: any) => {
      if (res) {
        const usuario = this.sessionService.getSession(); //: Usuario = this.root.getDataSesionUsuario();
        const request = {
          codEmpleado: 0,
          codUsuario: 0,
          cuentaUsuario: usuario.username,
          rutUsuario: usuario.documentId,
          nombreUsuario: `${usuario.firstName} ${usuario.lastName}`,
        };
        const respuesta: any = await this.clientsService
          .eliminaDireccion(
            request,
            this.userSession.documentId ?? '',
            direccion.recid
          )
          .toPromise();
        if (!respuesta.error) {
          this.toast.success('Dirección eliminada exitosamente.');
          if (
            this.direccionConfigurada.direccionDespacho?.id === direccion.recid
          )
            this.cambioDireccionPreferenciaCliente(direccion.recid);
          this.respuesta(true);
        } else {
          this.toast.error(respuesta.msg);
        }
      }
    });
  }

  //Se activa si se elimina la dirección preferencia del cliente
  cambioDireccionPreferenciaCliente(recid: any) {
    let nueva_preferencia = this.addresses.find((x) => x.recid != recid);
    console.log('nueva', nueva_preferencia);
    // this.logistics.guardarDireccionCliente(nueva_preferencia);
    this.localS.set('preferenciasCliente', nueva_preferencia);
  }
}
