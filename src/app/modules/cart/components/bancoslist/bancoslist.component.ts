import { Component, OnInit } from '@angular/core';
import { PaymentMethodService } from '@core/services-v2/payment-method.service';
import { IKhipuBank } from '@core/models-v2/payment-method/khipu-bank.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bancoslist',
  templateUrl: './bancoslist.component.html',
  styleUrls: ['./bancoslist.component.scss'],
})
export class BancoslistComponent implements OnInit {
  constructor(
    private readonly toastr: ToastrService,
    // Services V2
    private readonly paymentMethodService: PaymentMethodService
  ) {}
  listaBancos: IKhipuBank[] = [];
  banco?: IKhipuBank;
  index_banco = -1;
  selectbank: boolean = false;
  loadbank: boolean = false;

  async ngOnInit() {
    this.loadbank = true;
    this.paymentMethodService.getKhipuBanks().subscribe({
      next: (banks) => {
        this.listaBancos = banks;
        this.convertir_numero();
        this.loadbank = false;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('No se pudieron listar los bancos de Khipu');
        this.loadbank = false;
      },
    });
  }

  async ngOnChange() {
    this.loadbank = false;
  }
  close() {
    this.paymentMethodService.close(true);
  }

  convertir_numero() {
    this.listaBancos.map((item: any) => {
      item.min_amount = Number(item.min_amount);
    });
  }
  Selecciona_Banco(banco: any, index: any) {
    this.index_banco = index;
    this.selectbank = true;
    this.banco = banco;
  }

  async Pagar() {
    this.loadbank = true;
    this.paymentMethodService.selectBancoKhipu(this.banco);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('listo');
      }, 5000);
    });
    this.loadbank = false;
    this.paymentMethodService.close(true);
  }
}
