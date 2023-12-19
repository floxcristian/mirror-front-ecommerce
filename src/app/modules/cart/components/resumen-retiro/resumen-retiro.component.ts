import { Component, Input, OnInit } from '@angular/core';
import { DeliveryModeType } from '@core/enums/delivery-mode.enum';
import { IShoppingCartShipment } from '@core/models-v2/cart/shopping-cart.interface';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import { IStore } from '@core/services-v2/geolocation/models/store.interface';

@Component({
  selector: 'app-resumen-retiro',
  templateUrl: './resumen-retiro.component.html',
  styleUrls: ['./resumen-retiro.component.scss'],
})
export class ResumenRetiroComponent implements OnInit {
  @Input() direccion: ICustomerAddress | IStore | undefined;
  @Input() despacho!: IShoppingCartShipment | undefined;
  @Input() shippingType: any;
  fechas: any;
  @Input() set fechasEvent(value: any) {
    this.fechas = value;
  }
  tipo: any = null;
  constructor() {}

  async ngOnInit() {
    await this.direccion;
    await this.shippingType;

    if (this.shippingType === DeliveryModeType.DELIVERY)
      this.tipo = 'Despacho a domicilio';
    else this.tipo = 'Retiro en tienda';
  }
}
