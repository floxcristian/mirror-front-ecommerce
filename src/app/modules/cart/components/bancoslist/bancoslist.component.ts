import { Component, OnInit } from '@angular/core'
import { PaymentService } from '../../../../shared/services/payment.service'

@Component({
  selector: 'app-bancoslist',
  templateUrl: './bancoslist.component.html',
  styleUrls: ['./bancoslist.component.scss'],
})
export class BancoslistComponent implements OnInit {
  constructor(private bancosService: PaymentService) {}
  listaBancos: any = []
  banco: any
  index_banco = -1
  selectbank: boolean = false
  loadbank: boolean = false
  async ngOnInit() {
    this.loadbank = true
    let consulta: any = await this.bancosService.listaBancoKhipu()
    this.loadbank = false
    this.listaBancos = consulta.data.banks
    this.convertir_numero()
  }
  async ngOnChange() {
    this.loadbank = false
  }
  close() {
    this.bancosService.close(true)
  }

  convertir_numero() {
    this.listaBancos.map((item: any) => {
      item.min_amount = Number(item.min_amount)
    })
  }
  Selecciona_Banco(banco: any, index: any) {
    this.index_banco = index
    this.selectbank = true
    this.banco = banco
  }

  async Pagar() {
    this.loadbank = true
    this.bancosService.selectBancoKhipu(this.banco)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('listo')
      }, 5000)
    })
    this.loadbank = false
    this.bancosService.close(true)
  }
}
