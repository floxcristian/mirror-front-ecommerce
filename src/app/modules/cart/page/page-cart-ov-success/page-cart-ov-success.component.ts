// Angular
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
// Rxjs
import { Subscription } from 'rxjs';
// Services
import { PaymentService } from './../../../../shared/services/payment.service';
import { CartService } from '../../../../shared/services/cart.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SessionService } from '@core/states-v2/session.service';
import { ISession } from '@core/models-v2/auth/session.interface';
declare let fbq: any;

@Component({
  selector: 'app-page-cart-ov-success',
  templateUrl: './page-cart-ov-success.component.html',
  styleUrls: ['./page-cart-ov-success.component.scss'],
})
export class PageCartOvSuccessComponent implements OnInit, OnDestroy {
  numero = 0;
  numeroCarro = '';
  proveedorPago = '';
  loadingCart = true;
  cartData: any = null;
  documento: any = null;
  SubscriptionQueryParams: Subscription;
  SubscriptionParams: Subscription;
  showFolioMsj: boolean = false;
  carro: any = [];
  total: any = 0;
  usuario!: ISession;
  screenWidth: any;
  fbclid!: string;
  gclid: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private localS: LocalStorageService,
    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly gtmService: GoogleTagManagerService,
    // Services V2
    private readonly sessionService: SessionService
  ) {
    console.log('cart load desde PageCartOvSuccessComponent 1');
    this.cart.load();
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    // cuando hay OV en la url. Generalmente al generar ov desde OC
    this.SubscriptionParams = this.route.params.subscribe((params) => {
      if (params['numeroOv']) {
        this.numero = params['numeroOv'];
        this.showFolioMsj = false;
      }
    });

    //Manejar respuesta desde metodos de pago.
    this.SubscriptionQueryParams = this.route.queryParams.subscribe(
      (query) => {
        this.manejaRespuesta(query);
      }
    );
  }

  ngOnInit(): void {
    this.gclid = this.localS.get('gclid');
    console.log('cart load desde PageCartOvSuccessComponent 2');
    this.cart.load();
  }

  async manejaRespuesta(query: any) {
    let status = query.status
      ? query.status
      : query.payment_status
      ? query.payment_status
      : null;

    if (query.external_reference && status && status == 'approved') {
      this.documento = this.paymentService.obtenerDocumentoDeBuyOrderMPago(
        query.external_reference
      );
      await this.loadCartData(this.documento);
      this.proveedorPago = query.site_id ? query.site_id : 'MLC';
      this.showFolioMsj = true;
    }
  }

  ngOnDestroy(): void {
    this.SubscriptionQueryParams
      ? this.SubscriptionQueryParams.unsubscribe()
      : null;
    this.SubscriptionParams ? this.SubscriptionParams.unsubscribe() : null;
    this.showFolioMsj = false;
    this.numeroCarro = '';
    this.numero = 0;
  }

  async loadCartData(cartId: string) {
    this.loadingCart = true;
    let response: any = await this.cart.getOrderDetail(cartId).toPromise();
    this.total = response.total;
    this.cartData = response.data;
    this.mostrar_detalle();
    this.numero = this.cartData.numero ? this.cartData.numero : 0;
    this.numeroCarro = this.cartData.folio.toString();
    this.carro = await this.cart.cargar_folio(this.numeroCarro).toPromise();
    let index = 0;

    await Promise.all(
      this.carro.data.map(async (item: any) => {
        let tempcarro: any = this.carro.carro[index];
        index = index + 1;

        if (!tempcarro.gtag) {
          this.gtmService.pushTag({
            event: 'transaction',
            ecommerce: item,
          });

          await this.cart.confirmarGtag(tempcarro._id).toPromise();
        }
      })
    );

    this.addFacebookPixel();
    this.loadingCart = false;
  }

  mostrar_detalle(): void {
    this.usuario = this.sessionService.getSession(); //this.root.getDataSesionUsuario();

    this.usuario.firstName + ' ' + this.usuario.lastName;
  }

  /**
   * Agrega pixel de facebook con el valor de la compra.
   */
  addFacebookPixel(): void {
    this.fbclid = this.localS.get('fbclid');
    if (this.fbclid) {
      fbq('track', 'Purchase', {
        value: this.total,
        currency: 'CLP',
      });
      this.localS.remove('fbclid');
    }
  }
}
