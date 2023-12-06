import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  EventEmitter,
  AfterViewInit,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { GeolocationServiceV2 } from '@core/services-v2/geolocation/geolocation.service';
import { ITiendaLocation } from '@core/models-v2/geolocation.interface';
import { GeolocationApiService } from '@core/services-v2/geolocation/geolocation-api.service';
import { IStore } from '@core/services-v2/geolocation/store.interface';

@Component({
  selector: 'app-modal-stores',
  templateUrl: './modal-stores.component.html',
  styleUrls: ['./modal-stores.component.scss'],
})
export class ModalStoresComponent implements OnInit, AfterViewInit {
  @ViewChild('modalTemplate', { static: false }) modalTemplate!: ElementRef;
  @Input() modalRef!: BsModalRef;
  @Output() template = new EventEmitter<any>();

  tiendas!: IStore[];
  tienda!: ITiendaLocation;
  tiendaTemporal!: any;
  geoLocationServicePromise!: Subscription;
  subscriptions: Subscription[] = [];
  i = 0;

  constructor(
    // Services V2
    private readonly geolocationService: GeolocationServiceV2,
    private readonly geolocationApiService: GeolocationApiService
  ) {}

  ngOnInit() {
    this.tienda = this.geolocationService.getSelectedStore();

    this.geolocationApiService.getStores().subscribe({
      next: (res) => {
        this.tiendas = res;
      },
    });
    /*this.logisticsService.obtenerTiendas().subscribe((r: ResponseApi) => {
      this.tiendas = r.data;
    });*/

    this.geoLocationServicePromise =
      this.geolocationService.location$.subscribe({
        next: (res) => {
          this.tienda = this.geolocationService.getSelectedStore();
        },
      });

    /*
    this.geoLocationServicePromise =
      this.geoLocationService.localizacionObs$.subscribe(
        (r) => (this.tienda = this.geoLocationService.getTiendaSeleccionada())
      );*/
  }

  ngAfterViewInit(): void {
    this.template.emit(this.modalTemplate);
  }

  ngOndestroy() {
    this.geoLocationServicePromise
      ? this.geoLocationServicePromise.unsubscribe()
      : '';
  }

  estebleceTienda() {}

  cambiarTienda() {
    const tienda = this.tiendaTemporal;
    const coord = {
      lat: this.tiendaTemporal.lat,
      lon: this.tiendaTemporal.lon,
    };

    console.log('cambiarTienda: ', this.tiendaTemporal);

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
