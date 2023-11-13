import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { StoresService } from '../../shared/services/stores.service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { BuscadorB2B } from '../../shared/interfaces/buscadorB2B';
import { isVacio } from '../../shared/utils/utilidades';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  @Input() layout: 'classic' | 'compact' | any = 'classic';
  @Input() tipo: 'b2b' | 'b2c' | any = 'b2c';

  countries: any[] = [];
  logoSrc = environment.logoSrc;
  innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = isPlatformBrowser(this.platformId)
      ? window.innerWidth
      : 900;
  }

  constructor(
    public readonly stores: StoresService,
    private route: Router,
    private localS: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.countries.push({
      label: 'Chile ',
      img: 'assets/images/countries/cl.png',
    });

    const buscadorB2B = this.localS.get('buscadorB2B');
    if (buscadorB2B == null) {
      const data: BuscadorB2B = {
        indicadores: null,
        collapsed: null,
        vinBuscado: null,
      };
      this.localS.set('buscadorB2B', data);
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
