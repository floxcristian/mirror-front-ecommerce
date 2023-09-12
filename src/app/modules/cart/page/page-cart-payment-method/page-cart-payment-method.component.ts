import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { LogisticsService } from '../../../../shared/services/logistics.service';
import { CartData, ProductCart } from '../../../../shared/interfaces/cart-item';
import { Usuario } from '../../../../shared/interfaces/login';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RootService } from '../../../../shared/services/root.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseApi } from '../../../../shared/interfaces/response-api';
import {
  PaymentMethod,
  PaymentParams,
  TransBankToken,
} from '../../../../shared/interfaces/payment-method';
import { PaymentService } from '../../../../shared/services/payment.service';
import { environment } from '../../../../../environments/environment';
import { filter } from 'rxjs/internal/operators/filter';
import {
  ShippingAddress,
  ShippingStore,
} from '../../../../shared/interfaces/address';
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
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

declare const $: any;
declare let dataLayer: any;
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
  isInvoice!: boolean;
  private destroy$: Subject<void> = new Subject();
  items: any[] = [];
  inconsistencia = false;
  QUOTATION_TYPE = 1;
  propagar = new EventEmitter<any>();
  nuevoCentroCosto: boolean = false;
  files: any = [];
  loadingPage = false;
  loadingText = 'Generando orden de compra...';
  userSession!: any;
  cartSession: CartData;
  uploadedFiles!: File;
  documentType = 'factura';
  totalCarro: number | undefined = 0;
  paymentMethods: PaymentMethod[] = [];
  paymentMethodActive: string = '';
  bloqueoCliente: any;
  clienteBloqueado = false;
  getBloqueoError = false;
  urlApiWebPay = environment.apiImplementosPagos + 'webpay/pagar';
  urlPaymentVoucher = environment.urlPaymentVoucher + '?estado=confirmado';
  urlPaymentCanceled = environment.urlPaymentCanceled + '?estado=anulado';
  urlNotificationPayment = environment.apiImplementosCarro + 'generar-ov-b2b';
  paymentWebpayForm = false;
  @ViewChild('bankmodal', { static: false }) content: any;
  @ViewChild('formWp', { static: false }) tref!: ElementRef;
  formOv!: FormGroup;
  alertCart: any;
  alertCartShow = false;
  rejectedCode!: number | null;
  btnWebpayPost = false;
  invitado: any;
  formVisita!: FormGroup;
  validado!: boolean;
  innerWidth: number;
  transBankToken!: TransBankToken;
  productosSinStock: ProductCart[] | any = [];
  loadkhipu: boolean = false;
  recibe: Usuario;

  isCollapsedDespacho: boolean = false;
  addresses: ShippingAddress[] = [];
  direccionDespacho: ShippingAddress;
  shippingType = '';
  tiendaRetiro!: ShippingStore;
  pagoKhipu = null;
  esBoleta: boolean = false;
  showresumen: boolean = false;
  fechas_entregas: any = [];
  modalRef!: BsModalRef;
  archivo!: Archivo | undefined;
  idArchivo!: string;
  idArchivoMobile!: string | undefined;
  centrosCosto: CentroCosto[] = [];
  //crear nuevo centro de costo
  codigo_cc: string | null = null;
  nombre_cc: string | null = null;
  veritficar_cc: boolean = false;
  isVacio = isVacio;
  cd_ver: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cart: CartService,
    private localS: LocalStorageService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private root: RootService,
    private toast: ToastrService,
    private paymentService: PaymentService,
    private logistics: LogisticsService,
    private clientsService: ClientsService
  ) {
    this.innerWidth = window.innerWidth;
    this.formDefault();
    this.invitado = this.localS.get('invitado');
    if (this.invitado) {
      this.formVisita.setValue({
        rut: this.invitado.rut,
        nombre: this.invitado.first_name,
        apellido: this.invitado.last_name,
        telefono: (this.invitado.phone || '').slice(-8),
      });
    }

    this.recibe = this.localS.get('recibe');
    this.cartSession = this.localS.get('carroCompraB2B');
    this.direccionDespacho = <ShippingAddress>{};
  }
  ngDoCheck() {
    this.userSession = this.root.getDataSesionUsuario();
    this.cartSession = this.localS.get('carroCompraB2B');
    this.fechas_entregas = this.localS.get('fechas');
  }
  async ngOnInit() {
    this.idArchivo = uuidv1();
    this.idArchivoMobile = uuidv1();
    this.formVisita.statusChanges
      .pipe(filter(() => this.formVisita.valid))
      .subscribe(() => this.validForm());
    this.userSession = this.root.getDataSesionUsuario();
    this.fechas_entregas = this.localS.get('fechas');
    this.pagoKhipu = this.localS.get('Metodo') || null;
    this.esBoleta =
      this.userSession.giro == '' || this.userSession.giro == null;
    this.formOV();
    this.cart.load();

    this.cart.total$.subscribe((r) => {
      this.totalCarro = r;
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
    this.cartSession = this.localS.get('carroCompraB2B');
    if (this.cartSession == null || this.cartSession.productos?.length === 0) {
      this.router.navigate(['/', 'carro-compra']);
    }

    this.setMethodPayment();

    this.cart.load();
    this.cart.total$.subscribe((r) => {
      this.totalCarro = r;
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
      .getCentrosCosto(this.userSession.rut || '')
      .subscribe((resp: any) => {
        if (!resp.error) {
          this.centrosCosto = resp.data;
        }
      });

    setTimeout(() => {
      this.cart.dropCartActive$.next(false);
    });

    this.route.queryParams.subscribe((query) => {
      if (query['status']) this.showRejectedMsg(query);
      if (query['site_id'] === 'MLC' && query['external_reference'])
        this.manejarAlertaMercadoPagoSiEsNecesario(query);
    });

    // LOGICA PARA OBTENER DESPACHO A MOSTRAR
    switch (this.cartSession.despacho?.tipo) {
      case 'TIENDA': //RETIRO EN TIENDA
        //se revisa si existe la informacion en el localstorage desde el paso anterior
        this.tiendaRetiro = this.localS.get('tiendaRetiro');

        if (!this.tiendaRetiro) {
          //si no se encontró, se obtiene llamando a la api
          this.obtieneTiendaSegunRecid(
            this.cartSession.despacho.recidDireccion
          );
        }
        break;
      case 'EXP': //DESPACHO DOMICILIO
      default:
        if (this.cartSession.cliente?.rutCliente != '0') {
          //si está la informacion del cliente, se busca la direccion del usuario indicada en el despacho
          this.obtieneDireccionCliente(
            this.cartSession.despacho?.recidDireccion
          );
          break;
        }
        if (this.invitado) {
          //si es usuario invitado, se obtiene la direccion
          this.direccionDespacho.calle = this.invitado['calle'];
          this.direccionDespacho.comuna = this.invitado['comuna'];
          this.direccionDespacho.numero = this.invitado['numero'];
          break;
        }
        break;
    }
    // hilo para escuchar el close del modal
    this.paymentService.closemodal$.subscribe((r) => {
      if (r) {
        this.modalRef.hide();
        this.paymentMethodActive = '';
      }
    });

    this.paymentService.banco$.subscribe((r) => {
      this.paymentKhipu(r);
    });
    if (
      this.userSession.user_role !== 'supervisor' &&
      this.userSession.user_role !== 'comprador'
    ) {
      dataLayer.push({
        event: 'payment',
        pagePath: window.location.href,
      });
    }
  }

  manejarAlertaMercadoPagoSiEsNecesario(query: any) {
    const documento = this.paymentService.obtenerDocumentoDeBuyOrderMPago(
      query.external_reference || ''
    );
    if (
      query.external_reference &&
      documento == this.cartSession._id &&
      query.site_id &&
      query.site_id === 'MLC'
    ) {
      const reason =
        query.status && query.status == 'rejected'
          ? 'un rechazo'
          : 'una anulación';
      this.alertCartShow = true;
      this.alertCart = {
        detalleMensaje: `No se ha podido completar la transacción con Mercadopago debido a ${reason} del pago. Si el error persiste, por favor comunicate con soporte técnico.`,
        mostrarBotonVolverIntentar: true,
        proceso: 'Anulado',
      };
      if (query.status && query.status == 'null') {
        {
          this.paymentService
            .anularInicioNoPagoMercadoPago(query.external_reference)
            .subscribe((r) => {});
        }
      }
    }
  }

  obtieneTiendaSegunRecid(recid: any) {
    this.logistics
      .obtieneDireccionesTiendaRetiro({ usuario: this.userSession.rut })
      .subscribe(
        (r: ResponseApi) => {
          this.tiendaRetiro = r.data.filter(
            (x: ShippingStore) => x.recid.toString() == recid.toString()
          )[0];
          if (this.tiendaRetiro) {
            this.localS.set('tiendaRetiro', this.tiendaRetiro);
          }
        },
        (e) => {
          this.toast.error(
            'Ha ocurrido un error en servicio al obtener las direccion de la tienda'
          );
        }
      );
  }

  obtieneDireccionCliente(recidDireccion: any) {
    const usuario = this.root.getDataSesionUsuario();
    this.logistics.obtieneDireccionesCliente(usuario.rut).subscribe(
      (r: ResponseApi) => {
        if (r.error === false) {
          for (let dir of r.data) {
            if (
              dir.recid.toString() ===
              this.cartSession.despacho?.recidDireccion?.toString()
            ) {
              this.direccionDespacho = dir;

              break;
            }
          }
        }
      },
      (e) => {
        this.toast.error(
          'Ha ocurrido un error en servicio al obtener las direcciones'
        );
      }
    );
  }

  ngOnDestroy() {
    this.alertCartShow = false;
    this.alertCart = null;
    this.rejectedCode = null;
    this.btnWebpayPost = false;
    setTimeout(() => {
      this.cart.dropCartActive$.next(false);
    });
  }

  async setMethodPayment() {
    this.paymentMethods = await this.paymentService.getMetodosPago();
    if (
      this.userSession.user_role === 'comprador' ||
      this.userSession.user_role === 'supervisor'
    ) {
      const respBloqueo: any = await this.clientsService
        .getBloqueo(this.userSession.rut || '')
        .toPromise();
      if (respBloqueo.error) {
        this.getBloqueoError = true;
      } else {
        this.bloqueoCliente = respBloqueo.data;
        if (this.bloqueoCliente.estado === 'NO') {
          this.paymentMethods.push({
            name: 'Línea de crédito',
            iconClass: '',
            cod: 'ordenCompra',
          });
        } else {
          this.clienteBloqueado = true;
        }
      }
    }

    if (this.paymentMethods.length == 1) {
      this.activepaymentMethod(this.paymentMethods[0]);
    }
  }

  formOV() {
    this.formOv = this.fb.group({
      user_role: this.userSession.user_role,
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
    if (files.length > 0) {
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
    this.archivo = undefined;
    this.idArchivoMobile = undefined;
  }

  extensionValida(extension: string) {
    if (extension.toLowerCase() === 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  async paymentOv() {
    if (await this.validarStockActual()) return;

    if (
      this.archivo !== undefined &&
      !this.extensionValida(this.archivo.extension)
    ) {
      this.toast.error('Debe seleccionar un archivo de tipo PDF.');
      return;
    }

    // guarda documento
    this.loadingPage = true;
    this.loadingText = 'Subiendo OC...';

    const data: any = this.formOv.value;
    data.file = this.archivo !== undefined ? this.archivo.archivo : null;

    await this.cart.subeOrdenDeCompra(this.formOv.value).toPromise();
    await this.finishPaymentOv();
    // aqui se pone el cambio para la mensajeria
    this.loadingPage = false;
  }
  // habilitar funcion mundo buses
  async paymentOvSms() {
    if (await this.validarStockActual()) return;

    if (
      this.archivo !== undefined &&
      !this.extensionValida(this.archivo.extension)
    ) {
      this.toast.error('Debe seleccionar un archivo de tipo PDF.');
      return;
    }

    // guarda documento
    this.loadingPage = true;
    this.loadingText = 'Subiendo OC...';
    this.cd_ver = false;
    let data: any = this.formOv.value;
    data.file = this.archivo !== undefined ? this.archivo.archivo : null;
    if (this.userSession.credito) {
      if (
        this.totalCarro ||
        (0 >= this.userSession.credito.de &&
          (this.totalCarro ||
            0 < this.userSession.credito.hasta ||
            this.userSession.credito.hasta == -1))
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
  }

  Confirmar(event: any) {
    this.cd_ver = event;
    this.loadingPage = event;
    if (event) this.finishPaymentOv();
  }

  private async finishPaymentOv() {
    try {
      this.loadingText = 'Generando orden de compra...';

      // genera la orden de compra
      const data = {
        id: this.cartSession._id,
        usuario: this.userSession.email,
        tipo: 2,
        formaPago: 'OC',
        web: 1,
        proveedorPago: 'Orden de compra',
      };

      this.loadingPage = true;
      //modificar pasos

      let r: any = await this.cart.generaOrdenDeCompra(data).toPromise();

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

        this.cart.load();
        if (this.userSession.user_role === 'supervisor') {
          await this.cart.confirmarOV(this.cartSession._id).toPromise();
          this.router.navigate(['/', 'carro-compra', 'gracias-por-tu-compra'], {
            queryParams: { ...params },
          });
        } else
          this.router.navigate(['/', 'carro-compra', 'gracias-por-tu-compra'], {
            queryParams: { ...params },
          });
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

  finishQuotation() {
    const data = {
      id: this.cartSession._id,
      usuario: this.userSession.username,
      tipo: this.QUOTATION_TYPE,
      formaPago: 'OC',
    };

    this.loadingPage = true;
    this.loadingText = 'Generando cotización...';
    this.cart.generaOrdenDeCompra(data).subscribe(
      (r: ResponseApi) => {
        this.loadingPage = false;

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

  //  Sube documento y genera la solicitud
  purchaseRequestAll() {
    this.cart.subeOrdenDeCompra(this.formOv.value).subscribe((r) => {
      this.purchaseRequest();
    });
  }

  purchaseRequest() {
    const data = {
      id: this.cartSession._id,
      usuario: this.userSession.username,
      tipo: 2,
      formaPago: 'OC',
    };

    this.loadingPage = true;
    this.loadingText = 'Generando solicitud de compra...';
    this.cart.purchaseRequest(data).subscribe(
      (r: ResponseApi) => {
        this.loadingPage = false;

        if (r.error) {
          this.toast.error(r.msg);

          return;
        }
        this.cart.load();
        this.router.navigate(['/', 'carro-compra', 'comprobante-de-solicitud']);
      },
      (e) => {
        this.toast.error('Ha ocurrido un error al generar la orden de venta');
      }
    );
  }

  setDocumentType(type: any) {
    this.documentType = type;
  }

  activepaymentMethod(item: PaymentMethod) {
    this.paymentMethodActive = item.cod;
    let active_khipu = false;

    if (!this.invitado) {
      active_khipu = true;
    }

    if (this.formVisita.valid) {
      this.validado = true;

      let invitado: any = this.localS.get('invitado');
      invitado.rut = this.getValidRutFormat(this.formVisita.value.rut);
      invitado.carro_id = this.cartSession._id;
      invitado.tipoEnvio =
        this.cartSession.despacho?.codTipo === 'VEN- DPCLI' ? 'DES' : 'RC';
      this.localS.remove('invitado');
      this.localS.set('invitado', invitado);
      this.invitado = this.localS.get('invitado');
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

  async paymentMercadopago() {
    if (this.btnWebpayPost) {
      return;
    }

    this.btnWebpayPost = true;

    if (await this.validarStockActual()) return;
    await this.verificar_carro();
    const successUrl = environment.urlPaymentVoucher;
    const canceledUrl = environment.urlPaymentCanceled;
    const documento = this.cartSession._id;
    const url = `${environment.urlMercadoPago}?documento=${documento}&success=${successUrl}&pending=${canceledUrl}&failure=${canceledUrl}`;
    await this.prepararCarroPrePago();
    window.location.href = url + '&nocache=' + new Date().getTime();
  }

  async paymentKhipu(banco: any) {
    this.localS.set('Metodo', 'KHIP');
    this.localS.set('id_carro', this.cartSession._id);
    if (this.btnWebpayPost) {
      return;
    }
    this.loadkhipu = true;
    this.btnWebpayPost = true;
    if (await this.validarStockActual()) return;
    await this.verificar_carro();
    await this.prepararCarroPrePago();
    const successUrl = environment.urlPaymentVoucher;
    const canceledUrl = environment.urlPaymentCanceled;
    const documento = this.cartSession._id;
    let params = {};
    if (!this.invitado) {
      params = {
        successUrl: successUrl,
        canceledUrl: canceledUrl,
        id_carro: documento,
        usuario_email: this.userSession.username,
        usuario_name:
          this.userSession.first_name + ' ' + this.userSession.last_name,
        bank: banco,
      };
    } else {
      params = {
        successUrl: successUrl,
        canceledUrl: canceledUrl,
        id_carro: documento,
        usuario_email: this.invitado.email,
        usuario_name: this.invitado.first_name + ' ' + this.invitado.last_name,
        bank: banco,
      };
    }

    let consulta: any = await this.paymentService.createTransKhipu(params);

    window.location.href = consulta.simplified_transfer_url;
    this.loadkhipu = false;
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

  async prepararCarroPrePago() {
    let paso3: any = await this.cart
      .savePaso({ id: this.cartSession._id, paso: 3 })
      .toPromise();

    if (this.invitado) {
      this.invitado.rut = this.getValidRutFormat(this.invitado.rut || '');
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
          let userCambio: any = this.root.getDataSesionUsuario();
          userCambio._id = user.email;
          userCambio.email = user.email;
          userCambio.user_role = 'compradorB2c';
          userCambio.rut = user.rut;
          userCambio.login_temp = true;
          this.localS.set('usuario', userCambio);
        }
      }
    }
  }

  async creteateTransactionTransBank() {
    if (this.btnWebpayPost) {
      return;
    }

    this.btnWebpayPost = true;
    this.paymentWebpayForm = true;

    if (await this.validarStockActual()) return;
    await this.verificar_carro();
    let params: PaymentParams = {
      buy_order: this.cartSession._id || '',
      session_id: this.cartSession._id || '',
      amount: this.totalCarro,
      return_url: `${environment.apiImplementosPagos}transbank/confirmarTransaccion`,
    };

    await this.prepararCarroPrePago();

    let consulta: any = await this.paymentService.createTransBankTransaccion(
      params
    );
    if (consulta) {
      this.transBankToken = consulta;
      setTimeout(() => {
        $('#transBankForm').submit();
      }, 10);
    }
  }

  async showRejectedMsg(query: any) {
    this.alertCartShow = false;

    if (query.status === 'rejected') {
      this.rejectedCode = query.codRejected;
      this.alertCart = {
        pagoValidado: false,
        detalleMensaje: await this.paymentService.getPaymentErrorDetail(
          query.codRejected
        ),
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
    let consultaStock: any = await this.cart.validarStockActual(
      this.cartSession
    );
    if (consultaStock.problemaStock && consultaStock.productosSinStock) {
      this.productosSinStock = consultaStock.productosSinStock;
      document.getElementById('openModalButton')?.click();
      this.paymentService.sendEmailError(
        `Productos sin stock: <br> ${JSON.stringify(
          this.productosSinStock.map((producto: any) => {
            return `sku: ${producto.sku}, cantidad: ${producto.cantidad}`;
          })
        )} <br><br> Carro: <br> ${JSON.stringify(this.cartSession)}`,
        `[B2B ${window.location.hostname}] Error - Se ha detectado que no habia stock suficiente al momento de intengar pagar`
      );
    }
    return consultaStock.problemaStock;
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
        rut: this.userSession.rut,
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
          .getCentrosCosto(this.userSession.rut || '')
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
    await this.cart.load();
    this.cartSession = this.localS.get('carroCompraB2B');
    this.fechas_entregas = [];
    this.cartSession.grupos.forEach((item: any) => {
      this.fechas_entregas.push(item.despacho.fechaEntrega);
    });

    this.localS.set('fechas', this.fechas_entregas);
  }
}
