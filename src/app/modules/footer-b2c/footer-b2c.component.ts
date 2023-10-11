import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer-b2c',
  templateUrl: './footer-b2c.component.html',
  styleUrls: ['./footer-b2c.component.scss'],
})
export class FooterB2cComponent implements OnInit {
  screenWidth: any;
  screenHeight: any;
  logoSrc = environment.logoSrcFooter;
  load = false;
  constructor(
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900;
  }

  async ngOnInit() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }

  // Funcion utilizada para ocultar footer para dispositivos mobiles en las pantallas de seleccion de despacho y pago.
  HideFooter() {
    if (
      this.router.url.includes('/inicio') ||
      this.router.url.includes('/productos/ficha/') ||
      this.router.url.includes('/especial/') ||
      this.router.url.includes('/not-found')
    ) {
      return false;
    } else {
      return true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
    this.screenHeight = isPlatformBrowser(this.platformId)
      ? window.innerHeight
      : 900;
  }

  HideFooter2() {
    if (
      this.router.url.includes('/carro-compra') ||
      this.router.url.includes('/sitio')
    ) {
      return false;
    } else {
      return true;
    }
  }
}
