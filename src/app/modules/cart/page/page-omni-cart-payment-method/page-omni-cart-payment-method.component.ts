import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { PaymentParams } from '../../../../shared/interfaces/payment-method'
import { LogisticsService } from '../../../../shared/services/logistics.service'
import { PaymentService } from '../../../../shared/services/payment.service'
import { environment } from '../../../../../environments/environment'
import { CartService } from '../../../../shared/services/cart.service'
import { ClientsService } from '../../../../shared/services/clients.service'
import { isVacio } from '../../../../shared/utils/utilidades'

@Component({
  selector: 'app-page-omni-cart-payment-method',
  templateUrl: './page-omni-cart-payment-method.component.html',
  styleUrls: ['./page-omni-cart-payment-method.component.scss'],
})
export class PageOmniCartPaymentMethodComponent implements OnInit {
  id: string = ''
  @ViewChild('bankmodal', { static: false }) content: any
  cartSession: any = []
  shippingType: string = ''
  productCart: any = []
  loadCart = false
  linkNoValido = false
  direccion: any
  pago: any = null
  transBankToken: any = null
  alertCart: any
  alertCartShow = false
  rejectedCode!: number

  totalCarro: any = '0'
  modalRef!: BsModalRef
  constructor(
    private cartService: CartService,
    private logisticaService: LogisticsService,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClientsService,
    private paymentService: PaymentService,
    private modalService: BsModalService,
  ) {}

  async ngOnInit() {
    this.loadCart = true
    this.route.queryParams.subscribe((params) => {
      this.id = params['cart_id']
    })
    await this.loadData()

    this.cartService.total$.subscribe((r) => (this.totalCarro = r))
    this.paymentService.banco$.subscribe((r) => {
      this.paymentKhipu(r)
    })

    this.route.queryParams.subscribe((query) => {
      if (query['status']) {
        this.showRejectedMsg(query)
      }
      // if (query.site_id === 'MLC' && query.external_reference) this.manejarAlertaMercadoPagoSiEsNecesario(query);
    })

    this.loadCart = false
  }

  async loadData() {
    let consulta: any = await this.cartService
      .getCarroOmniChannel(this.id)
      .toPromise()
    if (!isVacio(consulta.data)) {
      this.cartSession = consulta.data
      await this.getDireccion()
      this.shippingType = this.cartSession.despacho.tipo
      this.productCart = this.cartSession.productos
      await this.cartService.loadOmni(this.id)
    } else {
      this.linkNoValido = true
    }
  }

  async getDireccion() {
    let data = {
      rut: this.cartSession.usuario,
    }
    if (this.cartSession.despacho.codTipo === 'VEN- DPCLI') {
      let cliente: any = await this.clienteService
        .getDataClient(data)
        .toPromise()
      this.direccion = cliente.data[0].direcciones.filter(
        (item: any) => item.recid == this.cartSession.despacho.recidDireccion,
      )
    } else {
      let consulta: any = await this.logisticaService
        .obtenerTiendasOmni()
        .toPromise()
      let tiendas: any = consulta.data
      this.direccion = tiendas.filter(
        (item: any) =>
          item.recid == this.cartSession.grupos[0].despacho.recidDireccion,
      )
    }
  }
  //fincuon para activar el boton de pago
  async Activepayment(event: any) {
    this.pago = event
  }

  async payment() {
    if (this.pago.cod == 'mercadopago') this.PaymentMercadoPago()
    if (this.pago.cod == 'webPay') this.PaymentWebpay()
    if (this.pago.cod == 'khipu') {
      this.openModal()
    }
  }

  //funciones para los pagos
  async PaymentMercadoPago() {
    const successUrl = environment.urlPaymentOmniVoucher
    const canceledUrl = environment.urlPaymentOmniCanceled
    const documento = this.cartSession._id
    const url = `${environment.urlMercadoPago}?documento=${documento}&success=${successUrl}&pending=${canceledUrl}&failure=${canceledUrl}`
    window.location.href = url + '&nocache=' + new Date().getTime()
  }

  async PaymentWebpay() {
    let params: PaymentParams = {
      buy_order: this.cartSession._id,
      session_id: this.cartSession._id,
      amount: this.totalCarro,
      return_url: `${environment.apiImplementosPagos}transbank/confirmarTransaccion`,
    }

    let consulta: any =
      await this.paymentService.createTransBankTransaccion(params)
    if (consulta) {
      this.transBankToken = consulta
      setTimeout(() => {
        $('#transBankForm').submit()
      }, 10)
    }
  }

  //proceso khipu
  async paymentKhipu(banco: any) {
    const successUrl = environment.urlPaymentOmniVoucher
    const canceledUrl = environment.urlPaymentOmniCanceled
    const documento = this.cartSession._id

    const params = {
      successUrl: successUrl,
      canceledUrl: canceledUrl,
      id_carro: documento,
      usuario_email: this.cartSession.emailNotificacion,
      usuario_name: this.cartSession.emailNotificacion,
      bank: banco,
    }

    let consulta: any = await this.paymentService.createTransKhipu(params)

    window.location.href = consulta.simplified_transfer_url
  }

  async showRejectedMsg(query: any) {
    this.alertCartShow = false

    if (query.status === 'rejected') {
      this.rejectedCode = query.codRejected
      this.alertCart = {
        pagoValidado: false,
        detalleMensaje: await this.paymentService.getPaymentErrorDetail(
          query.codRejected,
        ),
        mostrarBotonVolverIntentar: true,
      }
      this.alertCartShow = true
    }
  }

  intentarPagoNuevamente() {
    this.alertCartShow = false
    this.alertCart = null
    this.rejectedCode = 0
    this.router.navigate(['/', 'carro-compra', 'omni-forma-de-pago'], {
      queryParams: { cart_id: this.id },
    })
  }

  openModal() {
    this.modalRef = this.modalService.show(this.content, {
      backdrop: 'static',
      keyboard: false,
    })
  }
}
