// Angular
import { Component, Input } from '@angular/core';
//Models
import { ICollapsableStore } from '../../pages/page-stores/collapsable-store.interface';
import { ConfigService } from '@core/config/config.service';
import { IConfig } from '@core/config/config.interface';

@Component({
  selector: 'app-colapse',
  templateUrl: './colapse.component.html',
  styleUrls: ['./colapse.component.scss'],
})
export class ColapseComponent {
  @Input() store!: ICollapsableStore;
  @Input() innerWidth!: number;
  config: IConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
}
