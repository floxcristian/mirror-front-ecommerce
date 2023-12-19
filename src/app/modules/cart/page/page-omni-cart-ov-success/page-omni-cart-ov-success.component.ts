import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IShoppingCart } from '@core/models-v2/cart/shopping-cart.interface';
import { CartService } from '@core/services-v2/cart.service';
import { Subscription, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-page-omni-cart-ov-success',
  templateUrl: './page-omni-cart-ov-success.component.html',
  styleUrls: ['./page-omni-cart-ov-success.component.scss'],
})
export class PageOmniCartOvSuccessComponent implements OnInit {
  numeroCarro = '';
  loadingCart = true;
  cartData?: IShoppingCart;
  documento: any = null;
  SubscriptionQueryParams: Subscription;
  showFolioMsj: boolean = false;
  carro: any = [];
  //fbclid: string;

  constructor(
    private route: ActivatedRoute,
    // Services V2
    private readonly cartService: CartService
  ) {
    //Manejar respuesta desde metodos de pago.
    this.SubscriptionQueryParams = this.route.queryParams.subscribe(
      (query) => {
        this.manejaRespuesta(query);
      }
    );
  }

  async manejaRespuesta(query: any) {
    let status = query.status
      ? query.status
      : query.payment_status
      ? query.payment_status
      : null;

    if (query.shoppingCartId && status && status == 'approved') {
      this.documento = query.shoppingCartId;
      await this.loadCartData(this.documento);
      this.showFolioMsj = true;
    }
  }

  async ngOnInit() {
    this.cartService.load();
  }

  ngOnDestroy() {
    this.SubscriptionQueryParams
      ? this.SubscriptionQueryParams.unsubscribe()
      : null;
    this.showFolioMsj = false;
    this.numeroCarro = '';
  }

  async loadCartData(cartId: string) {
    this.loadingCart = true;
    let response = await firstValueFrom(this.cartService.getOneById(cartId));
    this.cartData = response.shoppingCart;
    this.numeroCarro = this.cartData.cartNumber!.toString().padStart(8, '0');

    this.loadingCart = false;
  }
}
