// Angular
import { Component } from '@angular/core';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
// Models
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { ITripDate } from '@core/services-v2/logistic-promise/models/delivery-availability-response.interface';
import { FiltrosMagicos } from '@shared/components/filtro-magico/interfaces/filtro-magico.interface';
// Services
import { LogisticPromiseApiService } from '@core/services-v2/logistic-promise/logistic-promise.service';
import { DeliveryMagicFilter } from './delivery-magic-filter';

@Component({
  selector: 'app-modal-delivery',
  templateUrl: './modal-delivery.component.html',
  styleUrls: ['./modal-delivery.component.scss'],
})
export class ModalDeliveryComponent {
  selectedStore!: ISelectedStore;
  productSku!: string;
  productQuantity!: number;
  magicFilters: FiltrosMagicos;
  deliveryAvailabilities: ITripDate[] = [];

  isLoading!: boolean;

  filters: any;

  constructor(
    public readonly modalRef: BsModalRef,
    private readonly logisticPromiseApiService: LogisticPromiseApiService
  ) {
    this.magicFilters = DeliveryMagicFilter(this.logisticPromiseApiService);
  }

  /**
   * Al seleccionar una ciudad busca las disponibilidades de despacho a domicilio.
   * @param filters
   */
  onSelectCity(filters: any): void {
    console.log('onFiltersChange: ', filters);
    console.log(typeof filters);
    this.filters = filters?.localidad ? filters : null;
    if (this.filters) {
      this.getAvailability();
      // this.generateChangeGeneralData();
    }
  }

  /**
   * Obtener fechas de disponibilidad.
   */
  getAvailability(): void {
    this.isLoading = true;
    this.deliveryAvailabilities = [];
    this.logisticPromiseApiService
      .getDeliveryAvailability({
        location: this.filters.localidad.name,
        regionCode: this.filters.localidad.regionCode,
        articles: [{ sku: this.productSku, quantity: this.productQuantity }],
      })
      .subscribe({
        next: (dates) => {
          this.isLoading = false;
          this.deliveryAvailabilities = dates;
        },
      });
  }
}
