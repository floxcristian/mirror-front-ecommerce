import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PaymentService } from '../../../../shared/services/payment.service';

@Component({
  selector: 'app-lista-pago',
  templateUrl: './lista-pago.component.html',
  styleUrls: ['./lista-pago.component.scss'],
})
export class ListaPagoComponent implements OnInit {
  paymentMethods: any = [];
  paymentMethodActive: any = null;
  @Input() omni = false;
  @Output() payment: EventEmitter<any> = new EventEmitter();

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    let pago: any;
    if (this.omni) {
      pago = await this.paymentService.getMetodosPagoOmni();
    } else {
      pago = await this.paymentService.getMetodosPago();
    }
    this.paymentMethods = pago;
  }

  activepaymentMethod(item: any) {
    this.paymentMethodActive = item.cod;
    this.payment.emit(item);
  }
}
