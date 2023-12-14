// Angular
import { Component, Input } from '@angular/core';
// Services
import { CartService } from '../../services/cart.service';
import { RootService } from '../../services/root.service';
import { LogisticsService } from '../../services/logistics.service';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
  @Input() set id(value: any) {
    this.getData(value);
  }
  @Input() title = 'Detalle';

  data: any;
  deliveryText: any;

  constructor(
    private cartService: CartService,
    public root: RootService,
    private logisticaService: LogisticsService,
    // Services V2
    private readonly geolocationService: GeolocationServiceV2
  ) {}

  async getData(id: any) {
    let r: any = await this.cartService.getOrderDetail(id).toPromise();

    if (!r.error) {
      this.data = r.data;
      if (this.data.despacho.codTipo === 'VEN- RPTDA') {
        // FIXME: este método ya no se usará, usar geolocationService.stores$
        let tiendas: any = await this.logisticaService
          .obtenerTiendas()
          .toPromise();

        let tienda = tiendas.data.filter(
          (item: any) => item.codigo === this.data.codigoSucursal
        );

        this.deliveryText = 'Retiro en tienda ' + tienda[0].zona;
      } else {
        this.deliveryText = 'Despacho';
      }
    }
  }
}
