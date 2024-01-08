// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Env
import { environment } from '@env/environment';

@Component({
  selector: 'app-footer-b2c',
  templateUrl: './footer-b2c.component.html',
  styleUrls: ['./footer-b2c.component.scss'],
})
export class FooterB2cComponent implements OnInit {
  logoSrc = environment.logoSrcFooter;

  constructor(public router: Router) {}

  async ngOnInit() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }

  // Funcion utilizada para ocultar footer para dispositivos mobiles en las pantallas de seleccion de despacho y pago.
  HideFooter(): boolean {
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
