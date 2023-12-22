// Angular
import { Component, OnInit } from '@angular/core';
// Envs
import { environment } from '@env/environment';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { IScalePrice } from '@core/models-v2/cms/special-reponse.interface';
// Services
import { SessionService } from '@core/services-v2/session/session.service';

@Component({
  selector: 'app-modal-scale-price',
  templateUrl: './modal-scale-price.component.html',
  styleUrls: ['./modal-scale-price.component.scss'],
})
export class ModalScalePriceComponent implements OnInit {
  IVA: number;
  user: ISession;
  scalePrices!: IScalePrice[];

  constructor(
    public readonly modalRef: BsModalRef,
    private readonly sessionService: SessionService
  ) {
    this.IVA = environment.IVA;
    this.user = this.sessionService.getSession();
  }

  ngOnInit() {
    console.log('scalePrices: ', this.scalePrices);
  }
}
