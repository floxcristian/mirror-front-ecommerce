// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Libs
import { BsModalService } from 'ngx-bootstrap/modal';
// Rxjs
import { firstValueFrom } from 'rxjs';
// Models
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import {
  IShoppingCart,
  IShoppingCartProduct,
} from '@core/models-v2/cart/shopping-cart.interface';
import { DeliveryModeType } from '@core/enums/delivery-mode.enum';
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
// Services
import { PaymentMethodOmniService } from '@core/services-v2/payment-method-omni.service';
import { CartService } from '@core/services-v2/cart.service';
import { CustomerAddressApiService } from '@core/services-v2/customer-address/customer-address-api.service';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { SHOPPING_CART_STATUS_TYPE } from '@core/enums/shopping-cart-status.enum';

@Component({
  selector: 'app-page-omni-cart-payment-method',
  templateUrl: './page-omni-cart-payment-method.component.html',
  styleUrls: ['./page-omni-cart-payment-method.component.scss'],
})
export class PageOmniCartPaymentMethodComponent implements OnInit {
  @ViewChild('bankmodal', { static: false }) content: any;

  id: string = '';
  cartSession!: IShoppingCart;
  shippingType: string = '';
  productCart: IShoppingCartProduct[] = [];
  loadCart = false;
  linkNoValido = false;
  direccion: ICustomerAddress | IStore | undefined = undefined;
  pago: any = null;
  transBankToken: any = null;
  alertCart: any;
  alertCartShow = false;
  rejectedCode!: number;

  totalCarro: any = '0';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    // Services V2
    private readonly cartService: CartService,
    private readonly geolocationApiService: GeolocationApiService,
    private readonly customerAddressService: CustomerAddressApiService,
    private readonly paymentMethodOmniService: PaymentMethodOmniService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadCart = true;
    this.route.queryParams.subscribe((params) => {
      this.id = params['cart_id'];
    });
    await this.loadData();

    this.cartService.total$.subscribe((r) => (this.totalCarro = r));
    this.paymentMethodOmniService.banco$.subscribe((r) => {
      this.paymentKhipu(r);
    });

    this.route.queryParams.subscribe((query) => {
      if (query['status']) {
        this.showRejectedMsg(query);
      }
      // if (query.site_id === 'MLC' && query.external_reference) this.manejarAlertaMercadoPagoSiEsNecesario(query);
    });

    this.loadCart = false;
  }

  async loadData() {
    try {
      const resp = await firstValueFrom(
        this.cartService.getOmniShoppingCart(this.id)
      );
      this.cartSession = resp.shoppingCart;
      if (this.cartSession.status === SHOPPING_CART_STATUS_TYPE.OPEN) {
        await this.getDireccion();
        this.shippingType = this.cartSession.shipment?.deliveryMode ?? '';
        this.productCart = this.cartSession.products;
        await this.cartService.loadOmni(this.id);
      } else {
        this.loadCart = false;
        this.linkNoValido = true;
      }
    } catch (e) {
      console.error(e);
      this.loadCart = false;
      this.linkNoValido = true;
    }
  }

  private async getDireccion() {
    if (
      this.cartSession.shipment?.deliveryMode === DeliveryModeType.DELIVERY
    ) {
      const documentId = this.cartSession.customer?.documentId ?? '';
      const addresses = await firstValueFrom(
        this.customerAddressService.getDeliveryAddresses(documentId)
      );
      this.direccion = addresses.find(
        (item) => item.id == this.cartSession.shipment?.addressId
      );
    } else {
      const stores = await firstValueFrom(
        this.geolocationApiService.getStores()
      );
      if (this.cartSession.groups?.length) {
        this.direccion = stores.find(
          (item) => item.id === this.cartSession.groups![0].shipment.addressId
        );
      }
    }
  }
  /**
   * Activa el botón de pago.
   * @param event
   */
  Activepayment(event: any): void {
    this.pago = event;
  }

  payment(): void {
    if (this.pago.cod == 'mercadopago') this.PaymentMercadoPago();
    if (this.pago.cod == 'webPay') this.PaymentWebpay();
    if (this.pago.cod == 'khipu') {
      this.openModal();
    }
  }

  //funciones para los pagos
  private async PaymentMercadoPago() {
    this.paymentMethodOmniService.redirectToMercadoPagoTransaction({
      shoppingCartId: this.cartSession._id!.toString(),
    });
  }

  private async PaymentWebpay() {
    this.paymentMethodOmniService.redirectToWebpayTransaction({
      shoppingCartId: this.cartSession._id!.toString(),
    });
  }

  //proceso khipu
  private async paymentKhipu(banco: any) {
    this.paymentMethodOmniService.redirectToKhipuTransaction({
      shoppingCartId: this.cartSession._id!.toString(),
      bankId: banco ? banco.bankId : '',
      bankName: banco ? banco.name : '',
      payerName: this.cartSession.notification?.email ?? undefined,
      payerEmail: this.cartSession.notification?.email ?? undefined,
    });
  }

  private async showRejectedMsg(query: any) {
    this.alertCartShow = false;

    if (query.status === 'rejected') {
      this.rejectedCode = query.codRejected;
      this.alertCart = {
        pagoValidado: false,
        detalleMensaje: query.message,
        mostrarBotonVolverIntentar: true,
      };
      this.alertCartShow = true;
    }
  }

  intentarPagoNuevamente(): void {
    this.alertCartShow = false;
    this.alertCart = null;
    this.rejectedCode = 0;
    this.router.navigate(['/', 'carro-compra', 'omni-forma-de-pago'], {
      queryParams: { cart_id: this.id },
    });
  }

  /**
   * Abrir modal de pago para Khipu.
   */
  private openModal(): void {
    this.modalService.show(this.content, {
      backdrop: 'static',
      keyboard: false,
    });
  }
}
