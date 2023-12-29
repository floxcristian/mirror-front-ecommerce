// Angular
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
// Environment
import { environment } from '@env/environment';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
// Services
import { CurrencyService } from '../../../../shared/services/currency.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthStateServiceV2 } from '@core/services-v2/session/auth-state.service';
import { StorageKey } from '@core/storage/storage-keys.enum';

@Component({
  selector: 'app-header-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() tipo: any = 'b2c'; // 'b2b' | 'b2c'
  @Input() desde: string = '';

  languages = [
    { name: 'English', image: 'language-1' },
    { name: 'French', image: 'language-2' },
    { name: 'German', image: 'language-3' },
    { name: 'Russian', image: 'language-4' },
    { name: 'Italian', image: 'language-5' },
  ];

  currencies = [
    { name: '€ Euro', url: '', code: 'EUR', symbol: '€' },
    { name: '£ Pound Sterling', url: '', code: 'GBP', symbol: '£' },
    { name: '$ US Dollar', url: '', code: 'USD', symbol: '$' },
    { name: '₽ Russian Ruble', url: '', code: 'RUB', symbol: '₽' },
  ];

  @Input() logo: any;
  usuario: ISession | null;
  logoSrc = environment.logoSrc;

  constructor(
    public currencyService: CurrencyService,
    private router: Router,
    public localS: LocalStorageService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authStateSession: AuthStateServiceV2
  ) {
    this.usuario = this.sessionStorage.get();

    this.authStateSession.session$.subscribe((user) => {
      this.usuario = user;
    });
  }

  setCurrency(currency: any): void {
    this.currencyService.options = {
      code: currency.code,
      display: currency.symbol,
    };
  }

  async validarCuenta() {
    this.localS.set(StorageKey.ruta, ['/', 'mi-cuenta', 'seguimiento']);
    let usuario = this.usuario;

    if (!usuario) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
      return;
    }

    if (usuario.hasOwnProperty('login_temp') && usuario.login_temp === true) {
      this.router.navigate(['sitio', 'iniciar-sesion']);
      return;
    }

    this.usuario = usuario;

    this.router.navigate(['/mi-cuenta', 'seguimiento']);
  }

  Hide_menub2c() {
    if (this.router.url.includes('/carro-compra/')) {
      return false;
    } else {
      return true;
    }
  }
}
