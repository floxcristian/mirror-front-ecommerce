// Angular
import { Component, OnInit } from '@angular/core';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
// Models
import { IStore } from '@core/services-v2/geolocation/models/store.interface';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';
import { ITripDate } from '@core/services-v2/logistic-promise/models/availability-response.interface';
// Services
import { FiltrosMagicos } from '@shared/components/filtro-magico/interfaces/filtro-magico.interface';
import { PickupMagicFilter } from './pickup-magic-filter';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { LogisticPromiseApiService } from '@core/services-v2/logistic-promise/logistic-promise.service';

@Component({
  selector: 'app-modal-pickup',
  templateUrl: './modal-pickup.component.html',
  styleUrls: ['./modal-pickup.component.scss'],
})
export class ModalPickupComponent implements OnInit {
  productSku!: string;
  productQuantity!: number;
  selectedStore!: ISelectedStore;
  magicFilters!: FiltrosMagicos;
  isLoading!: boolean;
  currentSelectedStore!: IStore;
  availabilities: ITripDate[] = [];
  maxStock!: number;

  constructor(
    public readonly modalRef: BsModalRef,
    private readonly geolocationService: GeolocationServiceV2,
    private readonly logisticPromiseApiService: LogisticPromiseApiService
  ) {}

  ngOnInit(): void {
    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        this.magicFilters = PickupMagicFilter(this.selectedStore, stores);
      },
    });
  }

  /**
   * Al seleccionar una tienda busca las disponibilidades de retiro en tienda.
   * @param filters
   */
  onSelectStore(filter: any): void {
    this.currentSelectedStore = filter.tienda;
    this.getAvailability();
  }

  /**
   * Obtener fechas de disponibilidad para retiro en tienda.
   */
  getAvailability(): void {
    this.availabilities = [];
    if (!this.currentSelectedStore) return;

    this.isLoading = true;
    this.logisticPromiseApiService
      .getPickupAvailability({
        location: this.currentSelectedStore.code,
        regionCode: this.currentSelectedStore.regionCode,
        articles: [{ sku: this.productSku, quantity: this.productQuantity }],
      })
      .subscribe({
        next: ({ maxStock, tripDates }) => {
          this.maxStock = maxStock;
          this.availabilities = tripDates;
          this.isLoading = false;
        },
      });
  }
}
