// Angular
import { Component } from '@angular/core';
// Models
import { IConfig } from '@core/config/config.interface';
// Services
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './page-about-us.component.html',
  styleUrls: ['./page-about-us.component.scss'],
})
export class PageAboutUsComponent {
  config: IConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
}
