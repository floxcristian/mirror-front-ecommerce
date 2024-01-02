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
import { ConfigService } from '@core/config/config.service';
import { IConfig } from '@core/config/config.interface';

@Component({
  selector: 'app-header-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() tipo: any = 'b2c'; // 'b2b' | 'b2c'
  @Input() desde: string = '';
  @Input() logo: any;
  usuario: ISession | null;
  logoSrc = environment.logoSrc;
  config!: IConfig;

  constructor(
    public currencyService: CurrencyService,
    private router: Router,
    public localS: LocalStorageService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authStateSession: AuthStateServiceV2,
    private readonly configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
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
    this.localS.set('ruta', ['/', 'mi-cuenta', 'seguimiento']);
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
