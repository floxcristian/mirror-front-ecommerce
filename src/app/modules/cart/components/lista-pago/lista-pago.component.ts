import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PaymentMethodService } from '@core/services-v2/payment-method.service';
import { IPaymentMethod } from '@core/models-v2/payment-method/payment-method.interface';
import { SessionService } from '@core/services-v2/session/session.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethodOmniService } from '@core/services-v2/payment-method-omni.service';

@Component({
  selector: 'app-lista-pago',
  templateUrl: './lista-pago.component.html',
  styleUrls: ['./lista-pago.component.scss'],
})
export class ListaPagoComponent implements OnInit {
  paymentMethods: IPaymentMethod[] = [];
  paymentMethodActive: any = null;
  @Input() omni = false;
  @Output() payment: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly toastr: ToastrService,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly paymentMethodOmniService: PaymentMethodOmniService
  ) {}

  async ngOnInit() {
    const username = this.sessionService.getSession().username ?? '';
    if (this.omni) {
      this.paymentMethodOmniService.getPaymentMethods({ username }).subscribe({
        next: (data) => {
          this.paymentMethods = data;
          if (this.paymentMethods.length > 0)
            this.activepaymentMethod(this.paymentMethods[0]);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('No se pudo cargar los métodos de pago');
        },
      });
    } else {
      this.paymentMethodService.getPaymentMethods({ username }).subscribe({
        next: (data) => {
          this.paymentMethods = data;
          if (this.paymentMethods.length > 0)
            this.activepaymentMethod(this.paymentMethods[0]);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('No se pudo cargar los métodos de pago');
        },
      });
    }
  }

  activepaymentMethod(item: IPaymentMethod) {
    this.paymentMethodActive = item.code;
    this.payment.emit(item);
  }
}
