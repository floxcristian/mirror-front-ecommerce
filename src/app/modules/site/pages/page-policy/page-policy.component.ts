// Angular
import { Component } from '@angular/core';
// Models
import { IConfig } from '@core/config/config.interface';
// Services
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-policy',
  templateUrl: './page-policy.component.html',
  styleUrls: ['./page-policy.component.scss'],
})
export class PagePolicyComponent {
  config!: IConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
}
