// Angular
import { Component, Input, OnInit } from '@angular/core';
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
import { StorageKey } from '@core/storage/storage-keys.enum';
import { SessionService } from '@core/services-v2/session/session.service';

@Component({
  selector: 'app-header-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  @Input() desde: string = '';
  @Input() logo: any;
  usuario: ISession | null;
  logoSrc = environment.logoSrc;
  config: IConfig;
  menub2c!: boolean;
  isB2B: boolean;
  constructor(
    public currencyService: CurrencyService,
    private router: Router,
    public localS: LocalStorageService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authStateSession: AuthStateServiceV2,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService
  ) {
    this.config = this.configService.getConfig();
    this.usuario = this.sessionStorage.get();
    this.isB2B = this.sessionService.isB2B();
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
  ngOnInit(): void {
    this.hideMenub2c();
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

  hideMenub2c() {
    const exclusionPath = '/carro-compra/comprobante-de-solicitud';
    if (
      this.router.url.includes('/carro-compra/') &&
      this.router.url !== exclusionPath
    ) {
      this.menub2c = true;
    } else {
      this.menub2c = false;
    }
  }
}
