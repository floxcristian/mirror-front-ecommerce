// Angular
import { Component, OnInit } from '@angular/core';
// Rxjs
import { Subscription } from 'rxjs';
// Libs
import { BsModalRef } from 'ngx-bootstrap/modal';
// Services
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
// Models
import { ITiendaLocation } from '@core/services-v2/geolocation/models/geolocation.interface';
import { IStore } from '@core/services-v2/geolocation/models/store.interface';

@Component({
  selector: 'app-modal-stores',
  templateUrl: './modal-stores.component.html',
  styleUrls: ['./modal-stores.component.scss'],
})
export class ModalStoresComponent implements OnInit {
  tiendas!: IStore[];
  tienda!: ITiendaLocation;
  tiendaTemporal: any = null;
  geoLocationServicePromise!: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    // Services V2
    public readonly modalRef: BsModalRef,
    private readonly geolocationService: GeolocationServiceV2
  ) {}

  ngOnInit(): void {
    this.tienda = this.geolocationService.getSelectedStore();

    this.geolocationService.stores$.subscribe({
      next: (stores) => {
        this.tiendas = stores;
      },
    });

    this.geoLocationServicePromise =
      this.geolocationService.location$.subscribe({
        next: (res) => {
          console.log('location$: ', res);
          this.tienda = this.geolocationService.getSelectedStore();
        },
      });
  }

  ngOndestroy(): void {
    this.geoLocationServicePromise
      ? this.geoLocationServicePromise.unsubscribe()
      : '';
  }

  cambiarTienda(): void {
    this.geolocationService.setGeolocation({
      lat: this.tiendaTemporal.lat || 0,
      lon: this.tiendaTemporal.lng || 0,
      zona: this.tiendaTemporal.zone,
      codigo: this.tiendaTemporal.code,
    });

    this.tienda = this.geolocationService.getSelectedStore();
    this.modalRef.hide();
  }
}
