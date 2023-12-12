// Angular
import { NavigationEnd, Router } from '@angular/router';
import {
  isPlatformBrowser,
  ViewportScroller,
  DOCUMENT,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
// Libs
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import * as $ from 'jquery';
// Services
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';
import { CurrencyService } from './shared/services/currency.service';
import { SeoService } from './shared/services/seo.service';
// Models
import { ProductCart } from './shared/interfaces/cart-item';
// Components
import { AlertCartMinComponent } from './shared/components/alert-cart-min/alert-cart-min.component';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { SessionService } from '@core/states-v2/session.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('alertCartModal', { read: TemplateRef, static: false })
  template!: TemplateRef<any>;
  @ViewChild(AlertCartMinComponent, {
    read: AlertCartMinComponent,
    static: false,
  })
  alert!: AlertCartMinComponent;

  modalRef!: BsModalRef;
  productCard!: ProductCart;
  s: any;
  node: any;
  isOmni!: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    private toastr: ToastrService,
    private cart: CartService,
    private compare: CompareService,
    private wishlist: WishlistService,
    private zone: NgZone,
    private scroller: ViewportScroller,
    private currency: CurrencyService,
    private modalService: BsModalService,
    private seoService: SeoService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly sessionService: SessionService,
    private readonly geolocationService: GeolocationServiceV2
  ) {}

  setLastSession(): void {
    if (!this.sessionService.isB2B()) return;
    const user = this.sessionService.getSession();
    user.ultimoCierre = moment();
    this.sessionStorage.set(user);
  }

  deleteLastSession(): void {
    if (!this.sessionService.isB2B()) return;
    const user = this.sessionService.getSession();
    delete user.ultimoCierre;
    this.sessionStorage.set(user);
  }

  ngOnInit(): void {
    this.currency.options = {
      code: 'CLP',
      // display: 'symbol',
      digitsInfo: '1.0-0',
      // locale: 'en-US'
      // locale: 'CLP'
    };
    this.seoService.generarMetaTag({});

    this.deleteLastSession();
    if (isPlatformBrowser(this.platformId)) {
      window.onbeforeunload = () => {
        this.setLastSession();
      };
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/carro-compra')) {
          this.document.body.classList.remove('home');
          this.document.body.classList.remove('pdp');
          this.document.body.classList.add('carrito');
          this.document.body.classList.remove('categoria');
          $('.webchatStartButtonContainer').hide();
        } else if (event.url.includes('/catalogos')) {
          this.document.body.classList.remove('home');
          this.document.body.classList.remove('pdp');
          this.document.body.classList.remove('carrito');
          this.document.body.classList.remove('categoria');
          $('.webchatStartButtonContainer').hide();
        } else if (event.url.includes('/categoria')) {
          this.document.body.classList.remove('home');
          this.document.body.classList.remove('pdp');
          this.document.body.classList.remove('carrito');
          this.document.body.classList.add('categoria');
          $('.webchatStartButtonContainer').hide();
        } else if (this.sessionService.isB2B()) {
          this.document.body.classList.remove('home');
          this.document.body.classList.remove('pdp');
          this.document.body.classList.remove('carrito');
          this.document.body.classList.remove('categoria');
          $('.webchatStartButtonContainer').hide();
        } else if (event.url.includes('/ficha')) {
          this.document.body.classList.remove('home');
          this.document.body.classList.remove('categoria');
          this.document.body.classList.remove('carrito');
          this.document.body.classList.add('pdp');
          $('.webchatStartButtonContainer').show();
        } else if (event.url.includes('/especial/')) {
          this.document.body.classList.add('home');
          this.document.body.classList.remove('categoria');
          this.document.body.classList.remove('carrito');
          this.document.body.classList.remove('pdp');
          $('.webchatStartButtonContainer').show();
        } else {
          this.document.body.classList.add('home');
          this.document.body.classList.remove('pdp');
          this.document.body.classList.remove('carrito');
          this.document.body.classList.remove('categoria');
          $('.webchatStartButtonContainer').show();
        }
        if (event.url.includes('/omni-forma-de-pago')) {
          this.isOmni = true;
        }

        this.scroller.scrollToPosition([0, 0]);
      }
    });

    this.cart.onAdding$.subscribe((product: ProductCart) => {
      this.productCard = product;
      this.showAlertCart();
    });

    this.compare.onAdding$.subscribe((product) => {
      this.toastr.success(
        `Producto "${product.nombre}" agregado para comparar!`
      );
    });

    this.wishlist.onAdding$.subscribe((product) => {
      this.toastr.success(
        `Producto "${product.nombre}" agregado a la lista de deseos!`
      );
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('entro A');
      this.geolocationService.initGeolocation();

      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          const preloader = document.querySelector('.site-preloader');
          if (preloader) {
            preloader.addEventListener('transitionend', (event: any) => {
              if (event.propertyName === 'opacity') {
                preloader.remove();
              }
            });
            preloader.classList.add('site-preloader__fade');
          }
        }, 300);
      });

      this.geolocationService.selectedStore$.subscribe({
        next: () => {
          // si es que la tienda seleccionada no cambia no se carga el carro.
          console.log(
            'selectedStore$ desde [AppComponent]===================='
          );
          if (!this.isOmni) {
            console.log('hago cart load 1');
            this.cart.load();
          }
        },
      });
    } else {
      // FIXME: tiene dependencia de stores que no se cargan en este caso.
      // En que momento pasa por aquí?
      console.log('setDefaultLocation desde app.component.ts');
      this.geolocationService.setDefaultLocation();
    }
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-alert-cart-dialog',
    });
  }

  showAlertCart(): void {
    this.alert.hide();
    this.alert.show();
  }
}
