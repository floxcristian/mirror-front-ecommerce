import { Component, OnInit, Input } from '@angular/core'
import { CartService } from '../../services/cart.service'
import { RootService } from '../../services/root.service'
import { LogisticsService } from '../../services/logistics.service'

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  @Input() set id(value: any) {
    this.getData(value)
  }
  @Input() title = 'Detalle'

  data: any
  deliveryText: any

  constructor(
    private cartService: CartService,
    public root: RootService,
    private logisticaService: LogisticsService,
  ) {}

  ngOnInit() {}

  async getData(id: any) {
    let r: any = await this.cartService.getOrderDetail(id).toPromise()

    if (!r.error) {
      this.data = r.data

      if (this.data.despacho.tipo === 'REP') {
        this.deliveryText = 'Despacho'
      } else {
        let tiendas: any = await this.logisticaService
          .obtenerTiendas()
          .toPromise()

        let tienda = tiendas.data.filter(
          (item: any) => item.codigo === this.data.codigoSucursal,
        )

        this.deliveryText = 'Retiro en tienda ' + tienda[0].zona
      }
    }
  }
}
