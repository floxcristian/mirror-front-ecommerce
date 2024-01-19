// Angular
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Models
import { IConfig } from '@core/config/config.interface';
// Services
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-page-cart-co-success',
  templateUrl: './page-cart-co-success.component.html',
  styleUrls: ['./page-cart-co-success.component.scss'],
})
export class PageCartCoSuccessComponent {
  numero = 0;
  config: IConfig;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
    this.route.params.subscribe((params) => {
      this.numero = params['numero'];
    });
  }
}
