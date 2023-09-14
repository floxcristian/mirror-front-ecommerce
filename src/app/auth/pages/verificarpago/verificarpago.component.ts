import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../../shared/services/payment.service';

@Component({
  selector: 'app-verificarpago',
  templateUrl: './verificarpago.component.html',
  styleUrls: ['./verificarpago.component.scss'],
})
export class VerificarpagoComponent {
  SubscriptionQueryParams: Subscription;
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {
    this.SubscriptionQueryParams = this.route.queryParams.subscribe((query) => {
      this.manejaRespuesta(query);
    });
  }

  async manejaRespuesta(query: any) {
    let consulta: any = await this.paymentService
      .Verificar_pagoKhipu(query)
      .toPromise();
    let status = consulta.status;

    while (status !== 'done') {
      consulta = await this.paymentService
        .Verificar_pagoKhipu(query)
        .toPromise();
      status = consulta.status;
    }

    let confirmar_pago: any = await this.paymentService
      .Confirmar_pagoKhipu(query)
      .toPromise();
    window.location.href = confirmar_pago.return_url;
  }
}
