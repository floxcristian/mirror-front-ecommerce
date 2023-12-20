import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { ISession } from '@core/models-v2/auth/session.interface';
import { PaymentMethodPurchaseOrderRequestService } from '@core/services-v2/payment-method-purchase-order-request.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-codigo-oc',
  templateUrl: './codigo-oc.component.html',
  styleUrls: ['./codigo-oc.component.scss'],
})
export class CodigoOcComponent implements OnInit {
  formulario!: FormGroup;
  @Input() id: any = null;
  @Input() purchaseOrderId: string = '';
  user!: ISession | null;
  fecha_limite = new Date();
  finishDateString = '';
  reenviar_codigo: boolean = false;
  confirmar: boolean = true;
  @Output() verificar: EventEmitter<any> = new EventEmitter();
  @Output() renv_cod: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private readonly toastr: ToastrService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly paymentMethodPurchaseOrderRequestService: PaymentMethodPurchaseOrderRequestService
  ) {
    this.iniciar_formulario();
  }

  async ngOnInit() {
    this.fecha_limite.setTime(
      this.fecha_limite.setMinutes(this.fecha_limite.getMinutes() + 1)
    );
    this.fecha_limite.setTime(
      this.fecha_limite.setSeconds(this.fecha_limite.getSeconds() + 30)
    );
    this.finishDateString = this.fecha_limite.toISOString();
    await this.id;
    this.user = this.sessionStorage.get();
  }
  // se inicia el formulario
  iniciar_formulario() {
    this.formulario = this.fb.group({
      codigo: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^([0-9])*$/),
        Validators.maxLength(6),
        Validators.minLength(6),
      ]),
    });
  }

  async Verificar_codigo() {
    this.paymentMethodPurchaseOrderRequestService
      .confirmOTP({
        purchaseOrderId: this.purchaseOrderId,
        otp: this.formulario.controls['codigo'].value,
      })
      .subscribe({
        next: () => {
          this.verificar.emit(true);
        },
        error: (e) => {
          console.error(e);
          this.toastr.error('No se pudo verificar el código');
        },
      });
  }

  async Atras_codigo() {
    this.verificar.emit(false);
  }

  async timeout(event: any) {
    this.reenviar_codigo = event;
    this.confirmar = true;
  }

  async reenvio_codigo() {
    this.fecha_limite = new Date();
    this.fecha_limite.setTime(
      this.fecha_limite.setMinutes(this.fecha_limite.getMinutes() + 1)
    );
    this.fecha_limite.setTime(
      this.fecha_limite.setSeconds(this.fecha_limite.getSeconds() + 30)
    );
    this.finishDateString = this.fecha_limite.toISOString();
    this.reenviar_codigo = false;
    this.renv_cod.emit(true);
  }
}
