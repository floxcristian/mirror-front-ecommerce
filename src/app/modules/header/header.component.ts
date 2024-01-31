// Angular
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
// Env
import { environment } from '@env/environment';
// Models
import { BuscadorB2B } from '../../shared/interfaces/buscadorB2B';
// Services
import { isVacio } from '../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { StorageKey } from '@core/storage/storage-keys.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  logoSrc = environment.logoSrc;

  constructor(private route: Router, private localS: LocalStorageService) {
    const buscadorB2B = this.localS.get(StorageKey.buscadorB2B);
    if (!buscadorB2B) {
      const data: BuscadorB2B = {
        indicadores: null,
        collapsed: null,
        vinBuscado: null,
      };
      this.localS.set(StorageKey.buscadorB2B, data);
    }
  }
  ngAfterViewInit(): void {
    /*  Sticky Header */
    const header = document.getElementById('sticky_header_b2c');
    const nav = document.getElementById('sticky_header_b2c_nav');
    if (!isVacio(header) && !isVacio(nav)) {
      const sticky = header?.offsetTop || 0;
      window.onscroll = () => {
        if (window.pageYOffset > sticky) {
          header?.classList.add('sticky');
          nav?.classList.add('sticky_nav');
        } else {
          header?.classList.remove('sticky');
          nav?.classList.remove('sticky_nav');
        }
      };
    }
    /*para el header de nav*/
  }

  Hidebar() {
    let url = this.route.url;
    if (this.route.url.split('?')[0] != undefined) {
      url = '' + this.route.url.split('?')[0];
    }

    return ![
      '/carro-compra/metodo-de-envio',
      '/carro-compra/forma-de-pago',
      '/carro-compra/omni-forma-de-pago',
      '/carro-compra/resumen',
      '/carro-compra/gracias-por-tu-compra',
      '/carro-compra/downloadpdf',
      '/carro-compra/omni-gracias-por-tu-compra',
      '/carro-compra/confirmar-orden-oc',
    ].includes(url);
  }

  getDesde() {
    let url = this.route.url;
    if (this.route.url.split('?')[0] != undefined) {
      url = '' + this.route.url.split('?')[0];
    }
    if (
      [
        '/carro-compra/omni-forma-de-pago',
        '/carro-compra/omni-gracias-por-tu-compra',
      ].includes(url)
    ) {
      return 'omni';
    } else {
      return '';
    }
  }
}
