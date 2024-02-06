import { Component } from '@angular/core';
import { IConfig } from '@core/config/config.interface';
import { ConfigService } from '@core/config/config.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-devolucion-ok-modal',
  templateUrl: './devolucion-ok-modal.component.html',
  styleUrls: ['./devolucion-ok-modal.component.scss'],
})
export class DevolucionOkModalComponent {
  readonly config: IConfig;
  constructor(
    public readonly ModalRef: BsModalRef,
    public readonly configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
  }
}
