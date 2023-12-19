// Angular
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService as CartServiceOld } from '../../../../shared/services/cart.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import {
  CartData,
  ProductCart,
} from '../../../../shared/interfaces/cart-item';
import { Usuario } from '../../../../shared/interfaces/login';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  PaymentParams,
  TransBankToken,
} from '../../../../shared/interfaces/payment-method';
import { PaymentService } from '../../../../shared/services/payment.service';
import { environment } from '@env/environment';
import { filter } from 'rxjs/internal/operators/filter';
import { ShippingAddress } from '../../../../shared/interfaces/address';
import {
  calculaIcono,
  dataURLtoFile,
  isVacio,
  rutValidator,
} from '../../../../shared/utils/utilidades';
import { v1 as uuidv1 } from 'uuid';
import { CentroCosto } from '../../../../shared/interfaces/centroCosto';
import { ClientsService } from '../../../../shared/services/clients.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AgregarCentroCostoComponent } from '../../components/agregar-centro-costo/agregar-centro-costo.component';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DireccionMap } from 'src/app/shared/components/map/map.component';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from '@core/states-v2/session.service';
import { InvitadoStorageService } from '@core/storage/invitado-storage.service';
import { PaymentMethodService } from '@core/services-v2/payment-method.service';
import { IPaymentMethod } from '@core/models-v2/payment-method/payment-method.interface';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { StorageKey } from '@core/storage/storage-keys.enum';
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { UserRoleType } from '@core/enums/user-role-type.enum';
import { IKhipuBank } from '@core/models-v2/payment-method/khipu-bank.interface';
import { InvoiceType } from '@core/enums/invoice-type.enum';
import { IValidateShoppingCartStockLineResponse } from '@core/models-v2/cart/validate-stock-response.interface';
import { PaymentMethodType } from '@core/enums/payment-method.enum';
import { CartService } from '@core/services-v2/cart.service';
import { IShoppingCart } from '@core/models-v2/cart/shopping-cart.interface';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import { CustomerAddressApiService } from '@core/services-v2/customer-address-api.service';

declare const $: any;
export interface Archivo {
  archivo: File;
  nombre: string;
  icon: string;
  extension: string;
}

@Component({
  selector: 'app-page-cart-payment-method',
  templateUrl: './page-cart-payment-method.component.html',
  styleUrls: ['./page-cart-payment-method.component.scss'],
})
export class PageCartPaymentMethodComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  isInvoice!: boolean;
  items: any[] = [];
  inconsistencia = false;
  QUOTATION_TYPE = 1;
  propagar = new EventEmitter<any>();
  nuevoCentroCosto: boolean = false;
  files: any = [];
  loadingPage = false;
  loadingText = 'Generando orden de compra...';
  userSession!: ISession;
  cartSession: IShoppingCart;
  uploadedFiles!: File;
  documentType = 'factura';
  totalCarro = 0;
  paymentMethods: IPaymentMethod[] = [];
  paymentMethodActive: string | null = null;
  bloqueoCliente: any;
  clienteBloqueado = false;
  getBloqueoError = false;
  urlApiWebPay = environment.apiImplementosPagos + 'webpay/pagar';
  urlPaymentVoucher = environment.urlPaymentVoucher + '?estado=confirmado';
  urlPaymentCanceled = environment.urlPaymentCanceled + '?estado=anulado';
  urlNotificationPayment = environment.apiShoppingCart + 'generar-ov-b2b';
  paymentWebpayForm = false;
  @ViewChild('bankmodal', { static: false }) content: any;
  @ViewChild('formWp', { static: false }) tref!: ElementRef;
  formOv!: FormGroup;
  alertCart: any;
  alertCartShow = false;
  rejectedCode!: number | null;
  btnWebpayPost = false;
  invitado: Usuario;
  formVisita!: FormGroup;
  validado!: boolean;
  innerWidth: number;
  transBankToken!: TransBankToken;
  productosSinStock: IValidateShoppingCartStockLineResponse[] = [];
  loadkhipu: boolean = false;
  recibe: Usuario;

  isCollapsedDespacho: boolean = false;
  addresses: ShippingAddress[] = [];
  direccionDespacho!: ICustomerAddress; //ShippingAddress;
  shippingType = '';
  tiendaRetiro?: IStore = undefined;
  pagoKhipu = null;
  esBoleta: boolean = false;
  showresumen: boolean = false;
  fechas_entregas: any = [];
  modalRef!: BsModalRef;
  archivo!: Archivo | null;
  idArchivo!: string;
  idArchivoMobile!: string | null;
  centrosCosto: CentroCosto[] = [];
  //crear nuevo centro de costo
  codigo_cc: string | null = null;
  nombre_cc: string | null = null;
  veritficar_cc: boolean = false;
  isVacio = isVacio;
  cd_ver: boolean = false;

  selectedDocument!: string;
  documentOptions = [{ id: InvoiceType.RECEIPT, name: 'BOLETA' }];
  girosOptions: any[] = [];
  selectedGiro!: string;
  isB2B!: boolean;
  cargandoGiros!: boolean;
  giros$!: Observable<any[]>;

  userRoleType = UserRoleType;
  invoiceType = InvoiceType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cart: CartServiceOld,
    private localS: LocalStorageService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toast: ToastrService,
    private paymentService: PaymentService,
    private logistics: LogisticsService,
    private clientsService: ClientsService,
    private readonly gtmService: GoogleTagManagerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly invitadoStorage: InvitadoStorageService,
    private readonly toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly geolocationApiService: GeolocationApiService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly cartService: CartService,
    private readonly customerAddressService: CustomerAddressApiService
  ) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.formDefault();
    // this.invitado = this.localS.get('invitado');
    this.invitado = this.invitadoStorage.get();
    if (this.invitado) {
      this.formVisita.setValue({
        rut: this.invitado.rut,
        nombre: this.invitado.first_name,
        apellido: this.invitado.last_name,
        telefono: (this.invitado.phone || '').slice(-8),
      });
    }

    this.recibe = this.localS.get(StorageKey.recibe);
    this.cartSession = this.localS.get(StorageKey.carroCompraB2B);
  }

  ngDoCheck() {
    this.userSession = this.sessionService.getSession();
    //this.userSession = this.root.getDataSesionUsuario();
    // this.userSession['requiereValidacion'] = true;
    this.cartSession = this.localS.get(StorageKey.carroCompraB2B);
    this.fechas_entregas = this.localS.get(StorageKey.fechas);
  }

  onBlur() {
    this.obtenerGiros();
  }

  isValidRut(rut: string) {
    return rut.length > 8;
  }

  formatRut(rut: string): string {
    return rut.length > 7 ? rut.slice(0, -1) + '-' + rut.slice(-1) : rut;
  }

  obtenerGiros(): void {
    this.girosOptions = [];
    let rut = this.userSession?.documentId;
    if (this.invitado) {
      let formattedRut = this.formVisita.value.rut.includes('-')
        ? this.formVisita.value.rut
        : this.formatRut(this.formVisita.value.rut);
      rut = formattedRut;
    }

    if (this.isValidRut(rut ?? '')) {
      this.cargandoGiros = true;
      this.clientsService.obtenerGiros(rut ?? '').subscribe(
        (res: any) => {
          this.girosOptions = res.giros || [];

          if (this.girosOptions.length) {
            this.documentOptions = [
              { id: InvoiceType.RECEIPT, name: 'BOLETA' },
              { id: InvoiceType.INVOICE, name: 'FACTURA' },
            ];
          } else {
            this.documentOptions = [
              { id: InvoiceType.RECEIPT, name: 'BOLETA' },
            ];
            this.selectedDocument = InvoiceType.RECEIPT;
          }
          /*if (!this.girosOptions.length) {
            this.documentOptions = [{ id: 'BEL', name: 'BOLETA' }];
            this.selectedDocument = 'BEL';
          }*/

          this.cargandoGiros = false;
        },
        (error) => {
          this.toast.error('Ha ocurrido un error al obtener los giros.');
          this.cargandoGiros = false;
        }
      );
    } else {
      this.documentOptions = [{ id: InvoiceType.RECEIPT, name: 'BOLETA' }];
      this.selectedDocument = InvoiceType.RECEIPT;
    }
  }

  /**
   * Verifica si el usuario es B2B.
   * @returns
   */
  checkIsB2b(): boolean {
    const user = this.sessionService.getSession();
    return (
      user.userRole === UserRoleType.SUPERVISOR ||
      user.userRole === UserRoleType.BUYER
    );
  }

  async ngOnInit() {
    this.userSession = this.sessionService.getSession();
    // this.root.getDataSesionUsuario();
    this.isB2B = this.checkIsB2b();
    if (this.isB2B || this.userSession.businessLine) {
      this.documentOptions.push({ id: InvoiceType.INVOICE, name: 'FACTURA' });
    }
    if (this.invitado) {
      this.loadComunas();
      this.tienda = null;
      this.buildForm();
    }

    this.idArchivo = uuidv1();
    this.idArchivoMobile = uuidv1();
    this.formVisita.statusChanges
      .pipe(filter(() => this.formVisita.valid))
      .subscribe(() => this.validForm());

    this.fechas_entregas = this.localS.get(StorageKey.fechas);
    this.pagoKhipu = this.localS.get('Metodo') || null;
    this.esBoleta =
      this.userSession?.businessLine == '' ||
      this.userSession?.businessLine == null;
    this.selectedDocument = this.userSession?.businessLine
      ? InvoiceType.INVOICE
      : InvoiceType.RECEIPT;

    this.formOV();
    this.cartService.load();

    this.cartService.total$.subscribe((r) => {
      this.totalCarro = r || 0;
    });
    this.cartService.items$
      .pipe(
        takeUntil(this.destroy$),
        map((ProductCarts) =>
          (ProductCarts || []).map((item) => {
            return {
              ProductCart: item,
              quantity: item.quantity,
            };
          })
        )
      )
      .subscribe((items) => {
        this.items = items;
      });
    this.cartSession = this.localS.get(StorageKey.carroCompraB2B);
    if (this.cartSession == null || this.cartSession.products?.length === 0) {
      this.router.navigate(['/', 'carro-compra']);
    }

    this.setMethodPayment();

    this.cartService.load();
    this.cartService.total$.subscribe((r) => {
      this.totalCarro = r || 0;
      this.formOv.get('monto')?.setValue(r);
      this.formOv.get('folio')?.setValue(this.idArchivo.split('-')[0]);
    });
    /* Se setean datos de la OC cargados en localStorage */
    const OC: any = this.localS.get('ordenCompraCargada');
    if (!isVacio(OC)) {
      this.archivo = this.cargaArchivo(dataURLtoFile(OC.pdf, OC.nombre));
      this.formOv.get('folio')?.setValue(OC.numero);
      this.formOv.get('monto')?.setValue(OC.total);
    }

    /* Se cargan los centros de costo */
    this.clientsService
      .getCentrosCosto(this.userSession?.documentId ?? '')
      .subscribe((resp: any) => {
        if (!resp.error) {
          this.centrosCosto = resp.data;
        }
      });

    setTimeout(() => {
      this.cartService.dropCartActive$.next(false);
    });

    this.route.queryParams.subscribe((query) => {
      if (query['status']) this.showRejectedMsg(query);
      const paymentMethod = query['paymentMethod'];
      if (paymentMethod === PaymentMethodType.MERCADOPAGO) {
        this.manejarAlertaMercadoPago(query);
      }
    });

    // LOGICA PARA OBTENER DESPACHO A MOSTRAR
    switch (this.cartSession.shipment?.deliveryMode) {
      case 'TIENDA':
      case 'pickup': //RETIRO EN TIENDA
        //se revisa si existe la informacion en el localstor  age desde el paso anterior
        this.tiendaRetiro = this.localS.get(StorageKey.tiendaRetiro);

        if (!this.tiendaRetiro) {
          //si no se encontró, se obtiene llamando a la api
          this.obtieneTiendaSegunRecid(this.cartSession.shipment.addressId);
        }
        break;
      case 'EXP': //DESPACHO DOMICILIO
      case 'delivery':
      default:
        if (this.cartSession.customer?.documentId != '0') {
          //si está la informacion del cliente, se busca la direccion del usuario indicada en el despacho
          this.obtieneDireccionCliente();
          break;
        }
        if (this.invitado) {
          //si es usuario invitado, se obtiene la direccion
          this.direccionDespacho.street = this.invitado['calle'] ?? '';
          this.direccionDespacho.city = this.invitado['comuna'] ?? '';
          this.direccionDespacho.number = this.invitado['numero'] ?? '';
          break;
        }
        break;
    }
    // hilo para escuchar el close del modal
    this.paymentService.closemodal$.subscribe((r) => {
      if (r) {
        this.modalRef.hide();
        this.paymentMethodActive = null;
      }
    });

    this.paymentService.banco$.subscribe((r) => {
      this.paymentKhipu(r);
    });
    if (
      this.userSession?.userRole !== UserRoleType.SUPERVISOR &&
      this.userSession?.userRole !== UserRoleType.BUYER
    ) {
      this.gtmService.pushTag({
        event: 'payment',
        pagePath: window.location.href,
      });
    }
    if (!this.userSession?.businessLine) {
      this.obtenerGiros();
    }
  }

  manejarAlertaMercadoPago(query: any) {
    const message = query.message;
    const reason = message;
    this.alertCartShow = true;
    this.alertCart = {
      detalleMensaje: `No se ha podido completar la transacción con Mercadopago debido a ${reason} del pago. Si el error persiste, por favor comunicate con soporte técnico.`,
      mostrarBotonVolverIntentar: true,
      proceso: 'Anulado',
    };
  }

  obtieneTiendaSegunRecid(recid: any) {
    this.geolocationApiService.getStores().subscribe({
      next: (data) => {
        this.tiendaRetiro = data.find(
          (x) => x.id.toString() === recid.toString()
        );
        if (this.tiendaRetiro) {
          this.localS.set(StorageKey.tiendaRetiro, this.tiendaRetiro);
        }
      },
      error: (err) => {
        console.log(err);
        this.toast.error(
          'Ha ocurrido un error en servicio al obtener las direccion de la tienda'
        );
      },
    });
  }

  obtieneDireccionCliente() {
    if (!this.cartSession.shipment?.addressId) return;
    const currentCartDeliveryAddress =
      this.cartSession.shipment.addressId.toString();
    const { documentId } = this.sessionService.getSession();
    this.customerAddressService.getDeliveryAddresses(documentId).subscribe({
      next: (addresses) => {
        const cartDeliveryAddress = addresses.find(
          (address) => address.id === currentCartDeliveryAddress
        );
        if (cartDeliveryAddress) {
          this.direccionDespacho = cartDeliveryAddress;
        }
      },
      error: () => {
        this.toast.error(
          'Ha ocurrido un error en servicio al obtener las direcciones'
        );
      },
    });
  }

  ngOnDestroy() {
    this.alertCartShow = false;
    this.alertCart = null;
    this.rejectedCode = null;
    this.btnWebpayPost = false;
    setTimeout(() => {
      this.cartService.dropCartActive$.next(false);
    });
  }

  async setMethodPayment() {
    const username = this.sessionService.getSession().username ?? '';
    this.paymentMethodService.getPaymentMethods({ username }).subscribe({
      next: (data) => {
        this.paymentMethods = data;
        if (this.paymentMethods.length > 0)
          this.activepaymentMethod(this.paymentMethods[0]);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('No se pudo cargar los métodos de pago');
      },
    });
  }

  formOV() {
    this.formOv = this.fb.group({
      user_role: this.userSession?.userRole,
      id: this.cartSession._id,
      file: [null],
      centroCosto: [''],
      folio: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  // Funcion que se encarga de seleccionar el primer metodo de pago cuando existe un solo metodo y el formulario de invitado esta validado
  validForm() {
    if (this.paymentMethods.length == 1) {
      this.activepaymentMethod(this.paymentMethods[0]);
    }
  }

  onFileChange(event: any) {
    let files = event.target.files;
    if (files.length) {
      this.archivo = this.cargaArchivo(files[0]);

      $('#' + this.idArchivo).val(null);
      $('#' + this.idArchivoMobile).val(null);
    }
  }

  cargaArchivo(file: File) {
    const partes = file.name.split('.');
    const extension = partes[partes.length - 1];
    const aux: Archivo = {
      archivo: file,
      nombre: file.name,
      icon: calculaIcono(extension),
      extension,
    };

    return aux;
  }

  eliminaArchivo() {
    this.archivo = null;
    this.idArchivoMobile = null;
  }

  extensionValida(extension: string) {
    if (extension.toLowerCase() === 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  Confirmar(event: any) {
    this.cd_ver = event;
    this.loadingPage = event;
    if (event) this.finishPaymentOv();
  }

  private async finishPaymentOv(): Promise<void> {
    try {
      this.loadingText = 'Generando orden de compra...';
      // FIXME: enviar direccion
      // genera la orden de compra
      const data = {
        id: this.cartSession._id,
        usuario: this.userSession?.email,
        tipo: 2,
        formaPago: 'OC',
        web: 1,
        proveedorPago: 'Orden de compra',
        /*documentType: this.documentType,
        giro: this.selectedGiro || null,
        calle: this.formDireccion.value.calle || null,
        numero: this.formDireccion.value.numero || null,
        comuna: this.formDireccion.value.comuna || null*/
      };

      this.loadingPage = true;
      //modificar pasos

      let r: any = await this.cartService
        .generaOrdenDeCompra(data)
        .toPromise();

      this.loadingPage = false;
      this.localS.remove('ordenCompraCargada');
      let cart_id = this.cartSession._id;
      if (r.error) {
        this.alertCartShow = true;
        this.alertCart = {
          detalleMensaje: `No se ha podido completar esta compra, favor volver a intentar. De persistir el problema comunicarse con nosotros.`,
          mostrarBotonVolverIntentar: true,
          proceso: 'Anulado',
        };
        this.toast.error(r.msg);
        this.paymentService.sendEmailError(
          `A ocurrido error para orden decompra B2B: <br> ${JSON.stringify(
            r
          )} <br><br> Carro: <br> ${cart_id}`,
          `[B2B ${window.location.hostname}] Error - Generando OV para usuario B2B con Orden de Compra`
        );

        return;
      }

      if (!r.error) {
        let params = {
          site_id: 'OC',
          external_reference: cart_id,
          status: 'approved',
        };

        this.cartService.load();
        if (this.userSession?.userRole === UserRoleType.SUPERVISOR) {
          await this.cart.confirmarOV(this.cartSession._id).toPromise();
          this.router.navigate(
            ['/', 'carro-compra', 'gracias-por-tu-compra'],
            { queryParams: { ...params } }
          );
        } else
          this.router.navigate(
            ['/', 'carro-compra', 'gracias-por-tu-compra'],
            { queryParams: { ...params } }
          );
      }
    } catch (e) {
      console.log(e);
      this.paymentService.sendEmailError(
        `A ocurrido error para orden decompra B2B: <br> ${JSON.stringify(
          e
        )} <br><br> Carro: <br> ${this.cartSession._id}`,
        `[B2B ${window.location.hostname}] Error - Generando OV para usuario B2B con Orden de Compra`
      );
    }
  }

  /**
   * Generar cotización.
   */
  finishQuotation(): void {
    const data = {
      id: this.cartSession._id,
      usuario: this.userSession?.username,
      tipo: this.QUOTATION_TYPE,
      formaPago: 'OC',
    };

    this.loadingPage = true;
    this.loadingText = 'Generando cotización...';
    this.cartService.generaOrdenDeCompra(data).subscribe(
      (r: any) => {
        this.loadingPage = false;

        if (r.error) {
          this.toast.error(r.msg);
          return;
        }

        this.cartService.load();
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

  //  Sube documento y genera la solicitud
  purchaseRequestAll() {
    this.cart.subeOrdenDeCompra(this.formOv.value).subscribe((r) => {
      this.purchaseRequest();
    });
  }

  purchaseRequest() {
    const data = {
      id: this.cartSession._id,
      usuario: this.userSession?.username,
      tipo: 2,
      formaPago: 'OC',
    };

    this.loadingPage = true;
    this.loadingText = 'Generando solicitud de compra...';
    this.cart.purchaseRequest(data).subscribe(
      (r: any) => {
        this.loadingPage = false;

        if (r.error) {
          this.toast.error(r.msg);

          return;
        }
        this.cartService.load();
        this.router.navigate([
          '/',
          'carro-compra',
          'comprobante-de-solicitud',
        ]);
      },
      (e) => {
        this.toast.error('Ha ocurrido un error al generar la orden de venta');
      }
    );
  }

  setDocumentType(type: string) {
    this.documentType = type;
  }

  /**
   * Seleccionar pago.
   * @param item
   */
  activepaymentMethod(item: IPaymentMethod) {
    if (item.code === 'OC') {
      this.selectedDocument = InvoiceType.INVOICE;
    }
    this.paymentMethodActive = item.code;
    let active_khipu = false;

    if (!this.invitado) {
      active_khipu = true;
    }

    if (this.formVisita.valid) {
      this.validado = true;

      // let invitado: any = this.localS.get('invitado');
      let invitado = this.invitadoStorage.get();
      invitado.rut = this.getValidRutFormat(this.formVisita.value.rut);
      invitado.carro_id = this.cartSession._id || '';
      invitado.tipoEnvio =
        this.cartSession.shipment?.deliveryMode === 'VEN- DPCLI' ||
        this.cartSession.shipment?.deliveryMode === 'delivery'
          ? 'DES'
          : 'RC';
      // this.localS.remove('invitado');
      this.invitadoStorage.remove();
      // this.localS.set('invitado', invitado);
      this.invitadoStorage.set(invitado);
      // this.invitado = this.localS.get('invitado');
      this.invitado = this.invitadoStorage.get();
      active_khipu = true;
    }

    if (this.paymentMethodActive == 'khipu' && active_khipu == true) {
      this.openModal();
    }
  }

  getValidRutFormat(rut: string) {
    if (rut.indexOf('-') != -1) return rut.trim();

    let dv = rut.slice(rut.length - 1, rut.length);
    let strRut = rut.slice(0, rut.length - 1);

    return `${strRut}-${dv}`.trim();
  }

  formDefault() {
    this.formVisita = this.fb.group({
      rut: [, [Validators.required, rutValidator, Validators.minLength(6)]],
      nombre: [, Validators.required],
      apellido: [, Validators.required],
      telefono: [
        ,
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8}$/),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
    });
  }

  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  openAbrirCentroCosto() {}

  /**
   * Actualiza carro.
   * + Si es invitado se guarda.
   */
  async prepararCarroPrePago(): Promise<void> {
    if (this.invitado) {
      this.invitado.rut = this.getValidRutFormat(this.invitado.rut ?? '');

      const isValidAddress =
        this.selectedDocument === InvoiceType.INVOICE &&
        this.formDireccion &&
        this.formDireccion.value &&
        this.formDireccion.value.calle &&
        this.formDireccion.value.numero &&
        this.formDireccion.value.comuna;
      if (isValidAddress) {
        this.invitado['calle'] = this.formDireccion.value.calle;
        this.invitado['numero'] = this.formDireccion.value.numero;
        this.invitado['comunaCompleta'] = this.formDireccion.value.comuna;
      }

      this.invitado.giro = this.selectedGiro || '';
      let respuesta: any = await this.cart
        .saveInvitado(this.invitado)
        .toPromise();

      if (!respuesta.error) {
        let user: any = this.invitado;
        let objeto = {
          carro_id: user.carro_id,
          rut: user.rut,
          recid: respuesta.data,
          email: user.email,
        };

        let resp: any = await this.cart.saveCarroTemp(objeto).toPromise();

        if (!resp.error) {
          let userCambio = this.sessionService.getSession();
          // let userCambio: any = this.root.getDataSesionUsuario();
          //userCambio._id = user.email;
          userCambio.email = user.email;
          userCambio.userRole = UserRoleType.B2C;
          userCambio.documentId = user.rut;
          userCambio.login_temp = true;
          userCambio.firstName = this.formVisita.value.nombre || '';
          userCambio.lastName = this.formVisita.value.apellido || '';
          this.sessionStorage.set(userCambio);
          // this.localS.set('usuario', userCambio);
        }
      }
    }

    // FIXME: se debe actualizar giro si
  }

  async showRejectedMsg(query: any) {
    this.alertCartShow = false;

    if (query.status === 'rejected') {
      const message = query.message;
      this.alertCart = {
        pagoValidado: false,
        detalleMensaje: message,
        mostrarBotonVolverIntentar: true,
      };
      this.alertCartShow = true;
    }
  }

  intentarPagoNuevamente() {
    this.alertCartShow = false;
    this.alertCart = null;
    this.rejectedCode = null;
    this.router.navigate(['/', 'carro-compra', 'forma-de-pago']);
  }

  async validarStockActual() {
    let consultaStock = await firstValueFrom(
      this.cartService.validateStock({
        shoppingCartId: this.cartSession._id!.toString(),
      })
    );
    if (consultaStock.stockProblem && consultaStock.stockProblemLines) {
      this.productosSinStock = consultaStock.stockProblemLines;
      document.getElementById('openModalButton')?.click();
      this.paymentService.sendEmailError(
        `Productos sin stock: <br> ${JSON.stringify(
          this.productosSinStock.map((producto) => {
            return `sku: ${producto.sku}, cantidad: ${producto.quantity}`;
          })
        )} <br><br> Carro: <br> ${JSON.stringify(this.cartSession)}`,
        `[B2B ${window.location.hostname}] Error - Se ha detectado que no habia stock suficiente al momento de intengar pagar`
      );
    }
    return consultaStock.stockProblem;
  }

  VolverPaginaCarro() {
    this.router.navigate(['/', 'carro-compra']);
  }

  openModal() {
    this.modalRef = this.modalService.show(this.content, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  openModalCentroCosto() {
    const modal = this.modalService.show(AgregarCentroCostoComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    modal.content?.event.subscribe(async (res) => {
      const request: any = {
        rut: this.userSession?.documentId,
        codigo: res.codigo,
        nombre: res.nombre,
      };

      //recargar el selec centro de costo

      const respuesta: any = await this.clientsService
        .setCentroCosto(request)
        .toPromise();
      if (!respuesta.error) {
        this.toast.success('Centro de costo ingresado exitosamente.');
        let resp: any = await this.clientsService
          .getCentrosCosto(this.userSession?.documentId ?? '')
          .toPromise();
        if (!resp.error) {
          this.centrosCosto = resp.data;
          this.formOv.controls['centroCosto'].setValue(request.codigo);
        }
        modal.hide();
      } else {
        this.toast.error(respuesta.msg);
        modal.hide();
      }
    });
  }

  async verificar_carro() {
    await this.cartService.load();
    this.cartSession = this.localS.get(StorageKey.carroCompraB2B);
    this.fechas_entregas = [];
    (this.cartSession.groups ?? []).forEach((item) => {
      this.fechas_entregas.push(item.shipment.requestedDate);
    });

    this.localS.set(StorageKey.fechas, this.fechas_entregas);
  }

  private updateCartAndUserTurn(): Promise<any> {
    const isValidAddress =
      this.selectedDocument === InvoiceType.INVOICE &&
      this.formDireccion &&
      this.formDireccion.value;
    const params = {
      shoppingCartId: this.cartSession._id!,
      street:
        isValidAddress && this.formDireccion.value.calle
          ? this.formDireccion.value.calle
          : null,
      number:
        isValidAddress && this.formDireccion.value.numero
          ? this.formDireccion.value.numero
          : null,
      city:
        isValidAddress && this.formDireccion.value.comuna
          ? this.formDireccion.value.comuna.split('@')[0]
          : null,
      invoiceType: this.selectedDocument,
      businessLine: this.selectedGiro || undefined,
    };
    return firstValueFrom(this.cartService.prepay(params));
  }

  /*********************************************************************
   * Métodos de pago
   *********************************************************************/
  /**
   * Continuar pago con Webpay.
   */
  async creteateTransactionTransBank() {
    try {
      if (this.btnWebpayPost) return;

      this.btnWebpayPost = true;
      this.paymentWebpayForm = true;

      if (await this.validarStockActual()) return;
      await this.verificar_carro();
      await this.updateCartAndUserTurn();
      await this.prepararCarroPrePago();

      this.paymentMethodService.redirectToWebpayTransaction({
        shoppingCartId: this.cartSession._id!.toString(),
      });
    } catch (err) {
      this.toast.error('Ha ocurrido un error al gestionar el pago.');
      this.btnWebpayPost = false;
    }
  }

  /**
   * Continuar pago con MercadoPago.
   */
  async paymentMercadopago() {
    try {
      if (this.btnWebpayPost) {
        return;
      }

      this.btnWebpayPost = true;

      if (await this.validarStockActual()) return;
      await this.verificar_carro();
      await this.updateCartAndUserTurn();
      await this.prepararCarroPrePago();

      this.paymentMethodService.redirectToMercadoPagoTransaction({
        shoppingCartId: this.cartSession._id!.toString(),
      });
    } catch (err) {
      this.toast.error('Ha ocurrido un error al gestionar el pago.');
      this.btnWebpayPost = false;
    }
  }

  /**
   * Continuar pago con Khipu.
   */
  async paymentKhipu(banco?: IKhipuBank) {
    try {
      this.localS.set('Metodo', 'KHIP');
      this.localS.set('id_carro', this.cartSession._id);
      if (this.btnWebpayPost) {
        return;
      }
      this.loadkhipu = true;
      this.btnWebpayPost = true;
      if (await this.validarStockActual()) return;
      await this.verificar_carro();
      await this.updateCartAndUserTurn();
      await this.prepararCarroPrePago();

      this.loadkhipu = false;
      this.paymentMethodService.redirectToKhipuTransaction({
        shoppingCartId: this.cartSession._id!.toString(),
        bankId: banco ? banco.bankId : '',
        bankName: banco ? banco.name : '',
      });
    } catch (err) {
      this.toast.error('Ha ocurrido un error al gestionar el pago.');
      this.loadkhipu = false;
      this.btnWebpayPost = false;
    }
  }

  /**
   * Continuar pago con XXX.
   */
  async paymentOv() {
    try {
      if (await this.validarStockActual()) return;

      if (
        this.archivo !== undefined &&
        !this.extensionValida(this.archivo?.extension || '')
      ) {
        this.toast.error('Debe seleccionar un archivo de tipo PDF.');
        return;
      }
      await this.updateCartAndUserTurn();

      // guarda documento
      this.loadingPage = true;
      this.loadingText = 'Subiendo OC...';

      const data: any = this.formOv.value;
      data.file = this.archivo !== undefined ? this.archivo?.archivo : null;

      await this.cart.subeOrdenDeCompra(this.formOv.value).toPromise();
      await this.updateCartAndUserTurn();
      await this.prepararCarroPrePago();
      await this.finishPaymentOv();
      // aqui se pone el cambio para la mensajeria
      this.loadingPage = false;
    } catch (err) {
      this.toast.error('Ha ocurrido un error al gestionar el pago.');
      this.loadingPage = false;
    }
  }

  /**
   * Continuar pago con XXX.
   * - habilitar funcion mundo buses.
   */
  async paymentOvSms() {
    try {
      if (await this.validarStockActual()) return;

      if (
        this.archivo !== undefined &&
        !this.extensionValida(this.archivo?.extension || '')
      ) {
        this.toast.error('Debe seleccionar un archivo de tipo PDF.');
        return;
      }

      // guarda documento
      this.loadingPage = true;
      this.loadingText = 'Subiendo OC...';
      this.cd_ver = false;
      let data: any = this.formOv.value;
      data.file = this.archivo !== undefined ? this.archivo?.archivo : null;
      if (this.userSession.creditLine) {
        if (
          this.totalCarro >= this.userSession.creditLine.fromAmount &&
          (this.totalCarro < this.userSession.creditLine.toAmount ||
            this.userSession.creditLine.toAmount == -1)
        ) {
          data.credito = true;
        } else {
          data.credito = false;
        }
        this.cd_ver = true;
      }

      if (!data.credito) {
        this.cart.subeOrdenDeCompra(data).subscribe((r) => {
          this.purchaseRequest();
        });
      } else {
        await this.cart.subeOrdenDeCompra(data).toPromise();
      }

      // aqui se pone el cambio para la mensajeria

      this.loadingPage = false;
    } catch (err) {
      this.toast.error('Ha ocurrido un error al gestionar el pago.');
      this.loadingPage = false;
    }
  }

  /*********************************************************************
   * Dirección
   *********************************************************************/
  comunas!: any[];
  localidades!: any[];
  formDireccion!: FormGroup;
  tienda!: DireccionMap | null;
  coleccionComuna!: any[];
  autocompletado = true;
  loadingForm = false;

  buildForm() {
    this.formDireccion = this.fb.group({
      calle: new FormControl(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      depto: new FormControl(null),
      numero: new FormControl(null),
      comuna: new FormControl(null, { validators: [Validators.required] }),
      localizacion: new FormControl(null, {
        validators: [Validators.required],
      }),
      latitud: new FormControl(null),
      longitud: new FormControl(null),
      referencia: new FormControl(null),
    });
  }

  getAddress(address_components: any[], tipo: string): string {
    let value = '';
    address_components.forEach((element) => {
      if (element.types[0] == tipo) {
        value = element.long_name;
        return;
      }
    });
    return value;
  }

  setAddress(data: any[]): void {
    this.clearAddress();

    if (this.getAddress(data[0], 'street_number')) {
      this.formDireccion.controls['calle'].enable();

      if (this.getAddress(data[0], 'locality')) {
        this.formDireccion.controls['comuna'].setValue(
          this.findCommune(this.getAddress(data[0], 'locality'))
        );
      } else {
        this.formDireccion.controls['comuna'].setValue(
          this.findCommune(
            this.getAddress(data[0], 'administrative_area_level_3')
          )
        );
      }
      this.formDireccion.controls['calle'].setValue(
        this.getAddress(data[0], 'route')
      );
      this.formDireccion.controls['numero'].setValue(
        this.getAddress(data[0], 'street_number')
      );
      this.formDireccion.controls['latitud'].setValue(data[1].lat);
      this.formDireccion.controls['longitud'].setValue(data[1].lng);

      this.cargarDireccion();
    }
  }

  cargarDireccion() {
    this.tienda = null;
    if (!this.formDireccion.valid) {
      return;
    }
    const { calle, numero, comuna, localizacion } = this.formDireccion.value;
    const comunaArr = comuna.split('@');

    this.tienda = {
      direccion: `${calle} ${numero}`,
      zona: `${comunaArr[0]} ${localizacion}`,
    };
  }

  obtenerLocalidades(event: any) {
    const localidades: any[] = [];
    const comunaArr = event.id.split('@');
    const comunas = this.coleccionComuna.filter(
      (comuna) => comuna.comuna == comunaArr[0]
    );
    comunas.map((comuna) =>
      (comuna.localidades as any[]).map((localidad) =>
        localidades.push(localidad)
      )
    );
    this.localidades = localidades;
  }

  loadComunas() {
    this.logistics.obtieneComunas().subscribe(
      (r: any) => {
        this.coleccionComuna = r.data;
        this.comunas = (r.data as any[]).map((record) => {
          const v =
            record.comuna + '@' + record.provincia + '@' + record.region;
          return { id: v, value: record.comuna };
        });
      },
      (error) => {
        this.toast.error(error.error.msg);
      }
    );
  }

  findCommune(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      var result = this.comunas.find(
        (data) => this.quitarAcentos(data.value) === nombre
      );

      if (result && result.id) {
        this.obtenerLocalidades(result);
        this.findComunaLozalizacion(result.value);
        return result.id;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  clearAddress(): void {
    this.formDireccion.setValue({
      calle: '',
      depto: '',
      numero: '',
      comuna: '',
      localizacion: '',
      referencia: '',
      latitud: '',
      longitud: '',
    });
  }

  quitarAcentos(cadena: string): string {
    // Definimos los caracteres que queremos eliminar
    var specialChars = '!@#$^&%*()+=-[]/{}|:<>?,.';

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, '_');

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, 'a');
    cadena = cadena.replace(/é/gi, 'e');
    cadena = cadena.replace(/í/gi, 'i');
    cadena = cadena.replace(/ó/gi, 'o');
    cadena = cadena.replace(/ú/gi, 'u');
    cadena = cadena.replace(/ñ/gi, 'n');

    return cadena;
  }

  findComunaLozalizacion(nombre: string) {
    if (nombre != '') {
      nombre = this.quitarAcentos(nombre);

      var result = this.localidades.find(
        (data) => this.quitarAcentos(data.localidad) === nombre
      );

      if (result && result.localidad) {
        this.formDireccion.controls['localizacion'].setValue(result.localidad);
      }
    }
  }

  geolocalizacion(event: any): void {
    this.formDireccion.controls['latitud'].setValue(event.lat);
    this.formDireccion.controls['longitud'].setValue(event.lng);
  }

  addAddress() {
    const dataSave = { ...this.formDireccion.value };
    const arr = dataSave.comuna.split('@');

    const direccion = {
      calle: dataSave.calle,
      comunaCompleta: dataSave.comuna,
      comuna: arr[0],
      numero: dataSave.numero,
      depto: dataSave.depto,
    };

    // let invitado: any = this.localS.get('invitado');
    let invitado = this.invitadoStorage.get();

    invitado.calle = direccion.calle;
    invitado.comuna = direccion.comuna;
    invitado.comunaCompleta = direccion.comunaCompleta;
    invitado.numero = direccion.numero;
    invitado.depto = direccion.depto ? direccion.depto : 0;

    // this.localS.remove('invitado');
    this.invitadoStorage.remove();
    // this.localS.set('invitado', invitado);
    this.invitadoStorage.set(invitado);

    /*
    invitado.rut = this.getValidRutFormat(this.formVisita.value.rut);
    invitado.carro_id = this.cartSession._id;
    invitado.tipoEnvio = this.cartSession.despacho.codTipo === 'VEN- DPCLI' ? 'DES' : 'RC';*/
    // this.invitado = this.localS.get('invitado');
    this.invitado = this.invitadoStorage.get();
  }
}
