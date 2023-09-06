import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../../shared/services/cart.service';
import { PaymentService } from '../../../../shared/services/payment.service';

@Component({
  selector: 'app-page-omni-cart-ov-success',
  templateUrl: './page-omni-cart-ov-success.component.html',
  styleUrls: ['./page-omni-cart-ov-success.component.scss']
})
export class PageOmniCartOvSuccessComponent implements OnInit {
  numeroCarro = '';
  loadingCart = true;
  cartData:any = null;
  documento:any = null;
  SubscriptionQueryParams: Subscription;
  showFolioMsj: boolean = false;
  carro: any = [];
  //fbclid: string;

  constructor(private route: ActivatedRoute, private cart: CartService, private paymentService: PaymentService) {
    //Manejar respuesta desde metodos de pago.
    this.SubscriptionQueryParams = this.route.queryParams.subscribe(query => {
      this.manejaRespuesta(query);
    });
  }

  async manejaRespuesta(query:any) {
    let status = query.status ? query.status : query.payment_status ? query.payment_status : null;

    if (query.external_reference && status && status == 'approved') {
      this.documento = this.paymentService.obtenerDocumentoDeBuyOrderMPago(query.external_reference);
      await this.loadCartData(this.documento);
      this.showFolioMsj = true;
    }
  }

  async ngOnInit() {
    this.cart.load();
  }

  ngOnDestroy() {
    this.SubscriptionQueryParams ? this.SubscriptionQueryParams.unsubscribe() : null;
    this.showFolioMsj = false;
    this.numeroCarro = '';
  }

  async loadCartData(cartId: string) {
    this.loadingCart = true;
    let response: any = await this.cart.getOrderDetail(cartId).toPromise();
    this.cartData = response.data;
    this.numeroCarro = this.cartData.folio.toString().padStart(8, '0');

    this.loadingCart = false;
  }
}
