// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, Subject } from 'rxjs';
// Models
import {
  IGeolocation,
  ITiendaLocation,
} from '@core/models-v2/geolocation.interface';
// Consts
import { DEFAULT_LOCATION } from './default-location';
// Services
import { GeolocationStorageService } from '@core/storage/geolocation-storage.service';
import { GeolocationApiService } from './geolocation-api.service';

@Injectable({
  providedIn: 'root',
})
export class GeolocationServiceV2 {
  private locationSubject: Subject<IGeolocation> = new Subject();
  readonly location$: Observable<IGeolocation> =
    this.locationSubject.asObservable();
  geolocation!: IGeolocation;

  private localizacionCarroSubject: Subject<any> = new Subject();
  readonly localizacionObsCarro$: Observable<any> =
    this.localizacionCarroSubject.asObservable();

  constructor(
    private readonly geolocationApiService: GeolocationApiService,
    private readonly geolocationStorage: GeolocationStorageService
  ) {}

  /**
   * Establecer tienda por defecto.
   * @returns
   */
  setDefaultLocation(): IGeolocation {
    this.geolocation = DEFAULT_LOCATION;
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
    let geolocation = this.geolocationStorage.get();
    if (geolocation) {
      this.geolocation = geolocation;
      return this.geolocation.tiendaSelecciona;
    } else {
      geolocation = this.setDefaultLocation();
      return geolocation.tiendaSelecciona;
    }
  }

  getGeolocation(): void {
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
