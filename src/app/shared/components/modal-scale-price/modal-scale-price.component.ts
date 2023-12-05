import { Component } from '@angular/core';
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from '@core/states-v2/session.service';
import { environment } from '@env/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IScalePriceItem } from '../product/scale-price-item.interface';

@Component({
  selector: 'app-modal-scale-price',
  templateUrl: './modal-scale-price.component.html',
  styleUrls: ['./modal-scale-price.component.scss'],
})
export class ModalScalePriceComponent {
  IVA: number;
  user: ISession;
  scalePrices!: IScalePriceItem[];

  constructor(
    public readonly modalRef: BsModalRef,
    private readonly sessionService: SessionService
  ) {
    this.IVA = environment.IVA;
    this.user = this.sessionService.getSession();
  }
}
