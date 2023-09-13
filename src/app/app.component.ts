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
import { ToastrService } from 'ngx-toastr';
import { CartService } from './shared/services/cart.service';
import { CompareService } from './shared/services/compare.service';
import { WishlistService } from './shared/services/wishlist.service';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, ViewportScroller, DOCUMENT } from '@angular/common';
import { CurrencyService } from './shared/services/currency.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductCart } from './shared/interfaces/cart-item';
import { AlertCartMinComponent } from './shared/components/alert-cart-min/alert-cart-min.component';
import { SeoService } from './shared/services/seo.service';
import { GeoLocationService } from './shared/services/geo-location.service';
import { LoginService } from './shared/services/login.service';
import { Usuario } from './shared/interfaces/login';
import { RootService } from './shared/services/root.service';
import * as moment from 'moment';
import * as $ from 'jquery';
import { GeoLocation } from './shared/interfaces/geo-location';
import { LocalStorageService } from './core/modules/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  modalRef!: BsModalRef;
  productCard!: ProductCart;
  showAlertCartStatus = false;
  s: any;
  node: any;
  @ViewChild('alertCartModal', { read: TemplateRef, static: false })
  template!: TemplateRef<any>;
  @ViewChild(AlertCartMinComponent, {
    read: AlertCartMinComponent,
    static: false,
  })
  alert!: AlertCartMinComponent;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
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
    private geoService: GeoLocationService,
    private login: LoginService,
    private root: RootService,
    private localS: LocalStorageService
  ) {}

  ngOnInit() {
    console.log('amiguito');
    this.currency.options = {
      code: 'CLP',
      // display: 'symbol',
      digitsInfo: '1.0-0',
      // locale: 'en-US'
      // locale: 'CLP'
    };
    this.seoService.generarMetaTag({});

    const usuario: Usuario = this.root.getDataSesionUsuario();
    if (['supervisor', 'comprador'].includes(usuario.user_role || '')) {
      const data: FormData = new FormData();

      usuario.fechaControl = moment();
      data.append('usuario', JSON.stringify(usuario));
      this.login
        .registroSesion(data, usuario.id_sesion || '0', 'cierre')
        .then((r: any) => {
          delete usuario.fechaControl;
          this.login
            .registroSesion(data, usuario.id_sesion || '0', 'ingreso')
            .then((resp: any) => {
              usuario.id_sesion = resp.id_sesion;
              delete usuario.ultimoCierre;
              this.localS.set('usuario', usuario);
            });
        });
    }
    window.onbeforeunload = (event) => {
      const u: Usuario = this.root.getDataSesionUsuario();
      if (u.user_role === 'supervisor' || u.user_role === 'comprador') {
        u.ultimoCierre = moment();
        this.localS.set('usuario', u);
      }
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const u: Usuario = this.root.getDataSesionUsuario();
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
        } else if (
          u.user_role === 'supervisor' ||
          u.user_role === 'comprador'
        ) {
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
          console.log('entro');
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

        this.scroller.scrollToPosition([0, 0]);
      }
    });

    this.cart.onAdding$.subscribe((product: ProductCart) => {
      this.productCard = product;
      this.showAlertCart(true);
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
      this.geoService.getGeoLocation();
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

      this.geoService.localizacionObs$.subscribe((r: GeoLocation) => {
        this.cart.load();
      });

      this.geoService.localizacionObsCarro$.subscribe((r: GeoLocation) => {
        let tienda: any = r.tiendaSelecciona;
        this.cart.tiendaPrecio = r.tiendaSelecciona;
        this.cart.loadPrecio(tienda.codigo);
      });
    } else {
      this.geoService.datoPorDefecto();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-alert-cart-dialog' })
    );
  }
  showAlertCart(status: any) {
    this.alert.hide();
    this.alert.show(status);
  }
}
