// Angular
import { Component } from '@angular/core';
// Models
import { IConfig } from '@core/config/config.interface';
// Services
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-fotter-site-mobile',
  templateUrl: './fotter-site-mobile.component.html',
  styleUrls: ['./fotter-site-mobile.component.scss'],
})
export class FotterSiteMobileComponent {
  readonly config: IConfig;

  constructor(public readonly configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
}
