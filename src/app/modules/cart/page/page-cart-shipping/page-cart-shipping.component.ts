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
  ShippingStore,
  ShippingDateItem,
} from '../../../../shared/interfaces/address';
import { Usuario } from '../../../../shared/interfaces/login';
import { Banner } from '../../../../shared/interfaces/banner';
// Components
import { TabsetComponent } from 'ngx-bootstrap/tabs';
// Services
import { CartService } from '../../../../shared/services/cart.service';
import { RootService } from '../../../../shared/services/root.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { LoginService } from '../../../../shared/services/login.service';
import { GeoLocationService } from '../../../../shared/services/geo-location.service';
// Constants
import { ShippingType } from '../../../../core/enums';
import { ModalConfirmDatesComponent } from './components/modal-confirm-dates/modal-confirm-dates.component';
import { map, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { BsModalService } from 'ngx-bootstrap/modal';

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
  direccion: boolean | null = false;
  usuarioInv: any;
  recibeType = 'yo';
  recibeOtra: boolean = false;
  recibeOtraname: string = '';
  recibeYoname: string = '';
  showNewAddress: boolean = false;
  showDetalleProductos: boolean = false;
  showresumen: boolean = false;
  tienda: any;
  retiro = '';
  conflictoEntrega: boolean = false;
  //variables para el despachos
  shippingType = '';
  tienda_actual: any = null;
  grupos = 0;
  items: any[] = [];

  indexTemp = -1;
  select_grupos: boolean = false;
  confirmar: boolean = false;
  obj_fecha: any = [];
  fecha_actual = moment().startOf('day').toISOString();
  sucursal = null;

  shippingSelected!: ShippingService | null;

  userSession!: Usuario;
  cartSession!: CartData;
  recidDireccion = 0;
  showMap: boolean = false;

  // retiro
  cardShippingActiveStore = 0;
  selectedShippingIdStore: any;
  tempShippingIdStore: any;
  shippingDaysStore: ShippingDateItem[] = [];
  shippingStore: ShippingStore[] = [];
  TiendasCargadas: boolean = false;
  loadingShippingStore = false;
  fecha = new Date();
  // despacho
  cardShippingActive = 0;
  grupoShippingActive: number | undefined = 0;
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
  public isLogin = false;
  public loadingResumen = false;
  subscription!: Subscription;

  // productos validados
  productsValidate: ProductCart[] = [];
  productosSeleccionado: any = [];
  fechas: any = [];
  //generar grupo de carritos
  grupoShippingCart: any = {};
  documentType = 'factura';
  loadingCotizacion = false;

  constructor(
    public cart: CartService,
    private logistics: LogisticsService,
    private toast: ToastrService,
    private root: RootService,
    private datePipe: DatePipe,
    private router: Router,
    private localS: LocalStorageService,
    private loginService: LoginService,
    private modalService: BsModalService,
    private geoService: GeoLocationService,
    private geoLocationService: GeoLocationService,
    private cd: ChangeDetectorRef
  ) {
    this.localS.set('recibe', {});
    this.innerWidth = window.innerWidth;

    this.tienda_actual = this.localS.get('geolocalizacion');
  }

  async ngOnInit() {
    this.cartSession = this.localS.get('carroCompraB2B');

    this.invitado = this.localS.get('invitado');
    this.tienda_actual = this.localS.get('geolocalizacion');
    this.userSession = this.root.getDataSesionUsuario();
    this.contacto_notificaciones();
    this.obtieneDireccionesCliente();
    this.obtieneTiendas();

    this.isLogin = this.loginService.isLogin();

    if (!this.HideResumen()) {
      this.recibeType = 'yo';
    }

    setTimeout(() => {
      this.cart.dropCartActive$.next(false);
    });

    this.subscribeOnLogin();

    this.cart.shippingValidateProducts$.subscribe((r: ProductCart[]) => {
      this.productsValidate = r;
      this.invitado = this.localS.get('invitado');
      this.userSession = this.root.getDataSesionUsuario();
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
      this.userSession.user_role !== 'supervisor' &&
      this.userSession.user_role !== 'comprador'
    ) {
      dataLayer.push({
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

  async obtieneDireccionesCliente() {
    this.loadingShippingAll = true;
    const usuario = this.root.getDataSesionUsuario();
    this.logistics.obtieneDireccionesCliente(usuario.rut).subscribe(
      (r: ResponseApi) => {
        this.loadingShippingAll = false;

        if (r.error === false) {
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
            if (item.deptocasa?.length || 0 > 0) {
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

    this.userSession = this.root.getDataSesionUsuario();
    this.invitado = this.localS.get('invitado');
    if (this.userSession.user_role != 'temp') {
      data.id = this.cartSession._id;
      data.texto4 = this.userSession.phone;
      data.texto5 = this.userSession.email;
      data.textoNombre =
        this.userSession.first_name + ' ' + this.userSession.last_name;
    } else if (this.userSession.user_role == 'temp' && this.invitado != null) {
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

    const usuario = this.root.getDataSesionUsuario();
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
    let usuarioRole = this.userSession.user_role;
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
    if (usuarioRole == 'temp') data_usuario = this.userSession.email;

    this.logistics
      .obtieneDireccionesTiendaRetiro({ usuario: this.userSession.rut })
      .subscribe(
        (r: ResponseApi) => {
          r.data.todos.map((item: ShippingStore) => {
            //item.direccionCompleta = `${item.nombre} - ${item.direccion}`;
            item.direccionCompleta = `${item.nombre}`;
          });
          this.shippingStore = r.data.todos;

          // seteamos que las tiendas ya fueron cargadas.
          this.TiendasCargadas = true;

          // Seleccionamos tienda actual y ademas lo colocamos en el primer lugar de la lista.
          var tiendaActual = this.shippingStore.find(
            (store) =>
              store.comuna.toUpperCase() ===
              this.geoService
                .getTiendaSeleccionada()
                ?.zona.toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
          );

          if (tiendaActual && tiendaActual.recid.length) {
            var tiendas = this.shippingStore.filter(
              (store) => store.recid != tiendaActual?.recid
            );
            tiendas.unshift(tiendaActual);

            this.shippingStore = tiendas;
            this.selectedShippingIdStore = tiendaActual.recid;
            this.tempShippingIdStore = this.selectedShippingIdStore;

            this.obtieneRetiro(false);
          }
        },
        (e) => {
          this.toast.error(
            'Ha ocurrido un error en servicio al obtener las direcciones de la tiendas'
          );
        }
      );
  }

  /**
   * Obtiene retiro en tienda.
   */
  async obtieneRetiro(removeShipping = true) {
    this.loadingShippingStore = true;

    this.fechas = [];

    // let idStore: any = this.selectedShippingIdStore;
    this.selectedShippingId = this.selectedShippingIdStore;
    const usuario = this.root.getDataSesionUsuario();

    if (!usuario.hasOwnProperty('username')) usuario.username = usuario.email;
    const resultado = this.shippingStore.find(
      (item) => item.recid == this.selectedShippingIdStore
    );

    if (!resultado) return;

    this.tienda = resultado;
    this.cambiarTienda(this.tienda);
    this.localS.set('tiendaRetiro', resultado);

    let disponible: any = resultado;
    const data = {
      usuario: usuario.username,
      destino: disponible.codigo + '|' + disponible.codRegion,
      tipo: 'RC',
    };

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
      if (this.userSession.user_role == 'temp') {
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

  /* funcion de prueba*/
  seleccionaDespacho(item: ShippingService, pos: number) {
    let invitado: any = null;

    if (this.isLogin) {
      this.recibeYoname = this.getFullName(this.userSession);
      this.recidDireccion = this.selectedShippingId;
      this.obj_fecha[pos] = item;
    }
    if (this.invitado) {
      invitado = this.localS.get('invitado');
      this.recibeYoname = this.getFullName(invitado);
      this.recidDireccion = 0;
      this.localS.set('invitado', invitado);
      this.usuarioInv = this.localS.get('invitado');
    }

    this.grupoShippingActive = this.shippingDays[pos].grupo;
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
    this.grupoShippingActive = this.shippingDaysStore[pos].grupo;
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
    else if (this.shippingSelected) {
      this.shippingSelected.tipopedido = 'VEN- DPCLI';
    }
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
    this.loginService.loginSessionObs$.pipe().subscribe((usuario) => {
      this.isLogin = this.loginService.isLogin();
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
  respuesta(event: any) {
    if (event) {
      this.obtieneDireccionesCliente();
      this.shippingSelected = null;
      this.showAllAddress = false;
      window.scrollTo({ top: 0 });
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
      this.recibeType = 'yo';
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

      if (this.HideResumen()) {
        this.recibeType = 'yo';
      } else {
        this.recibeType = 'yo';
      }
      this.setDefaultAddress();
      if (this.selectedShippingId) {
        this.obtieneDespachos();
      }
    } else {
      this.retiroFlag = false;
    }

    let invitado: any = this.localS.get('invitado');
    if (invitado != null) {
      invitado.tipoEnvio = 'RC';
      this.localS.remove('invitado');
      this.localS.set('invitado', invitado);
      this.usuarioInv = this.localS.get('invitado');

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
    this.localS.set('invitado', invitado);

    this.contacto_notificaciones();
    window.scrollTo({ top: 0 });
  }

  // evento ejecutado cuando un invitado agrega una nueva direccion.
  async direccionVisita(direccion: any, removeShipping = true) {
    this.direccion = true;
    let invitado: any = this.localS.get('invitado');

    invitado.calle = direccion.calle;
    invitado.comuna = direccion.comuna;
    invitado.comunaCompleta = direccion.comunaCompleta;
    invitado.numero = direccion.numero;
    invitado.depto = direccion.depto ? direccion.depto : 0;
    this.localS.remove('invitado');
    this.localS.set('invitado', invitado);
    this.usuarioInv = this.localS.get('invitado');
    this.loadingShipping = true;
    this.shippingSelected = null;

    const data = {
      usuario: invitado._id,
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
  }

  reciboPedido(recibe: any) {
    this.recibeOtra = false;
    this.recibeOtraname =
      recibe.first_name + ' ' + recibe.last_name + ', Celular: ' + recibe.phone;
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
      direccion = this.shippingStore.find(
        (tienda) => tienda.recid === this.selectedShippingIdStore
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
      this.direccion = null;
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

  /**
   *@author
   * @param {*} tiendaTemporal
   * @returns
   * @memberof PageCartShippingComponent
   */
  cambiarTienda(tiendaTemporal: any) {
    const tienda = tiendaTemporal;
    const coord = {
      lat: tiendaTemporal.lat,
      lon: tiendaTemporal.lon,
    };

    return this.geoLocationService.cambiarTiendaCliente(coord, tienda);
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
    const resultado = this.addresses.find(
      (item) => item.recid == this.selectedShippingId
    );

    const usuario = this.root.getDataSesionUsuario();
    let params = {};
    if (this.shippingType === ShippingType.DESPACHO) {
      params = {
        usuario: usuario.username,
        id: index,
        destino: resultado?.comuna,
      };
    } else {
      let disponible: any = this.shippingStore.find(
        (item) => item.recid == this.selectedShippingIdStore
      );
      params = {
        usuario: usuario.username,
        id: index,
        sucursal: disponible.codigo,
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
    const usuario = this.root.getDataSesionUsuario();
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

  setSeleccionarEnvioChilexpress(item: any, pos: any) {}

  ver_fechas() {
    if (this.shippingDaysStore) {
      let menor = this.shippingDaysStore[0].fechas?.[0].fecha;
      let menor_fecha: any = new Date(menor);
      this.shippingDaysStore.map((item: any) => {
        let fecha_comparar: any = new Date(item.fechas[0].fecha);
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
}
