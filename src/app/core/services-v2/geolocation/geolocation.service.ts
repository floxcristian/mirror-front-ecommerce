// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Models
import {
  IGeolocation,
  ITiendaLocation,
} from '@core/services-v2/geolocation/models/geolocation.interface';
// Consts
import { DEFAULT_LOCATION } from './default-location';
// Services
import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';
import { GeolocationApiService } from './geolocation-api.service';
import { IStore } from './models/store.interface';

@Injectable({
  providedIn: 'root',
})
export class GeolocationServiceV2 {
  private locationSubject: Subject<IGeolocation> = new Subject();
  readonly location$: Observable<IGeolocation> =
    this.locationSubject.asObservable();

  private storesSubject: BehaviorSubject<IStore[]> = new BehaviorSubject<
    IStore[]
  >([]);
  readonly stores$: Observable<IStore[]> = this.storesSubject.asObservable();

  // FIXME: quitar dependencia de esta variable.
  geolocation!: IGeolocation;

  constructor(
    private readonly geolocationApiService: GeolocationApiService,
    private readonly geolocationStorage: GeolocationStorageService
  ) {}

  /**
   * Establecer tienda por defecto.
   * @returns
   */
  setDefaultLocation(): IGeolocation {
    const stores = this.storesSubject.value;
    const defaultStore = stores.find((store) => store.default);
    if (defaultStore) {
      this.geolocation = {
        esNuevaUbicacion: false,
        obtenida: false,
        esSeleccionaPorCliente: false,
        actual: { lat: defaultStore.lat, lon: defaultStore.lng },
        tiendaSelecciona: {
          zona: defaultStore.zone,
          codigo: defaultStore.code,
        },
      };
    } else {
      this.geolocation = DEFAULT_LOCATION;
    }
    console.log('1::::');
    this.geolocationStorage.set(this.geolocation);
    return this.geolocation;
  }

  // FIXME: verificar esto.
  /**
   * Establecer tienda.
   * @param params
   */
  setGeolocation(params: {
    lat: number;
    lon: number;
    zona: string;
    codigo: string;
  }): void {
    console.log('2::::');
    const { lat, lon, zona, codigo } = params;
    this.geolocation = {
      esNuevaUbicacion: false,
      obtenida: false,
      esSeleccionaPorCliente: true,
      actual: { lat, lon },
      tiendaSelecciona: {
        zona,
        codigo,
      },
    };
    this.geolocationStorage.set(this.geolocation);
    this.locationSubject.next(this.geolocation);
  }

  /**
   * Obtener tienda seleccionada.
   * @returns
   */
  getSelectedStore(): ITiendaLocation {
    console.log('3::::');
    let geolocation = this.geolocationStorage.get();
    if (geolocation) {
      this.geolocation = geolocation;
      return this.geolocation.tiendaSelecciona;
    } else {
      geolocation = this.setDefaultLocation();
      return geolocation.tiendaSelecciona;
    }
  }

  /**
   * Se llama solo una vez en el app.component.
   */
  initGeolocation(): void {
    console.log('4::::');
    console.log('initGeolocation...');
    this.geolocationApiService.getStores().subscribe({
      next: (stores) => {
        this.storesSubject.next(stores);
        let geolocation = this.geolocationStorage.get();
        if (!geolocation) {
          geolocation = this.setDefaultLocation();
        }
      },
    });

    let geolocation = this.geolocationStorage.get();
    if (geolocation) {
      this.geolocation = geolocation;
    } else {
      geolocation = this.setDefaultLocation();
    }

    if (navigator.geolocation && !geolocation.esSeleccionaPorCliente) {
      this.setNearestStore();
    } else {
      console.warn('El navegador no soporta la ubicación automática.');
      this.locationSubject.next(this.geolocation);
    }
  }

  /**
   * Establecer tienda más cercana.
   */
  private setNearestStore(): void {
    console.log('5::::');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.geolocationApiService
          .getNearestStore(latitude, longitude)
          .subscribe({
            next: (res) => {
              this.geolocation.esNuevaUbicacion =
                this.geolocation.tiendaSelecciona.codigo === res.code;
              this.geolocation.obtenida = true;
              this.geolocation.esSeleccionaPorCliente = false;
              this.geolocation.tiendaSelecciona = {
                _id: res.id,
                zona: res.zone,
                codigo: res.code,
                lat: res.lat,
                lon: res.lng,
                comuna: res.city,
              };
              this.geolocationStorage.set(this.geolocation);
              this.locationSubject.next(this.geolocation);
            },
            error: () => {
              console.warn(
                'No se ha podido establecer la tienda más cercana.'
              );
              this.locationSubject.next(this.geolocation);
            },
          });
      },
      () => {
        console.warn(
          'No se ha podido obtener su ubicación. Puede cambiar manualmente la tienda.'
        );
        this.locationSubject.next(this.geolocation);
      }
    );
  }
}
