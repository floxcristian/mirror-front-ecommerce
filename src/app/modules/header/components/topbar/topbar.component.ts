// Angular
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Environment
import { environment } from '@env/environment';
// Models
import { IConfig } from '@core/config/config.interface';
// Services
import { CurrencyService } from '../../../../shared/services/currency.service';
import { ConfigService } from '@core/config/config.service';
import { SessionService } from '@core/services-v2/session/session.service';

@Component({
  selector: 'app-header-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  @Input() desde: string = '';
  logoSrc = environment.logoSrc;
  config: IConfig;
  showCartHeader!: boolean;
  isB2B: boolean;

  constructor(
    public currencyService: CurrencyService,
    private router: Router,
    // Services V2
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService
  ) {
    this.config = this.configService.getConfig();
    this.isB2B = this.sessionService.isB2B();
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

  private hideMenub2c(): void {
    if (
      this.router.url.includes('/carro-compra/') &&
      this.router.url !== '/carro-compra/comprobante-de-solicitud'
    ) {
      this.showCartHeader = true;
    } else {
      this.showCartHeader = false;
    }
  }
}
