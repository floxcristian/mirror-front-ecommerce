import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-resumen-retiro',
  templateUrl: './resumen-retiro.component.html',
  styleUrls: ['./resumen-retiro.component.scss'],
})
export class ResumenRetiroComponent implements OnInit {
  @Input() direccion: any
  @Input() despacho: any
  @Input() shippingType: any
  fechas: any
  @Input() set fechasEvent(value: any) {
    this.fechas = value
  }
  tipo: any = null
  constructor() {}

  async ngOnInit() {
    await this.direccion
    await this.shippingType

    if (this.shippingType === 'STD') this.tipo = 'Despacho a domicilio'
    else this.tipo = 'Retiro en tienda'
  }
}
