import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'angular-2-local-storage';
import { GeoLocation, TiendaLocation } from '../interfaces/geo-location';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  private localizacion$: Subject<any> = new Subject();
  readonly localizacionObs$: Observable<any> =
    this.localizacion$.asObservable();

  private localizacionCarro$: Subject<any> = new Subject();
  readonly localizacionObsCarro$: Observable<any> =
    this.localizacionCarro$.asObservable();

  constructor(
    private toastr: ToastrService,
    private localStorage: LocalStorageService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  geoLocation!: GeoLocation;

  // verifica la si la tienda esta en la sesion, sino lo esta toma la por defecto
  getTiendaSeleccionada() {
    let geo: GeoLocation = this.localStorage.get('geolocalizacion');
    if (geo != null) {
      this.geoLocation = geo;
      return this.geoLocation.tiendaSelecciona;
    } else {
      geo = this.datoPorDefecto();
      return geo.tiendaSelecciona;
    }
  }

  getGeoLocation() {
    // rescatamos la ubicacion de la sesion
    let geo: GeoLocation = this.localStorage.get('geolocalizacion');

    if (geo != null) {
      this.geoLocation = geo;
    } else {
      geo = this.datoPorDefecto();
    }

    if (navigator.geolocation && geo.esSeleccionaPorCliente === false) {
      this.estableceTiendaAutomaticamente();
    } else {
      console.warn('El navegador no soporta la ubicacion automatica');
      this.localizacion$.next(this.geoLocation);
    }
  }

  getDistanceMatrix(params: any): Observable<ResponseApi> {
    const url = environment.apiImplementosLogistica + 'maps/tienda-mas-cercana';
    return this.http.get<ResponseApi>(url, { params });
  }

  estableceTiendaAutomaticamente() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const geoLocationActual = this.geoLocation;

        // ontenemos la tienda mas cercana a la ubicacion
        this.getDistanceMatrix({ lat: latitude, lon: longitude }).subscribe(
          (r: ResponseApi) => {
            if (r.error === false) {
              const tienda: TiendaLocation = r.data.tienda;
              if (
                geoLocationActual.tiendaSelecciona?.codigo !== tienda.codigo
              ) {
                this.geoLocation.esNuevaUbicacion = true;
              } else {
                this.geoLocation.esNuevaUbicacion = false;
              }

              this.geoLocation.obtenida = true;
              this.geoLocation.esSeleccionaPorCliente = false;
              this.geoLocation.tiendaSelecciona = tienda;
              this.localStorage.set('geolocalizacion', this.geoLocation);
              this.localizacion$.next(this.geoLocation);
            }
          },
          (e) => {
            console.warn('No se ha podido establecer la tienda mas cercana ');
            this.localizacion$.next(this.geoLocation);
          }
        );
      },
      (e) => {
        console.warn(
          'No se ha podido obtener su ubicación. \n  Puede cambiar manualmente la tienda',
          'Información'
        );
        this.localizacion$.next(this.geoLocation);
      }
    );
  }

  datoPorDefecto() {
    this.geoLocation = {
      esNuevaUbicacion: false,
      obtenida: false,
      esSeleccionaPorCliente: false,
      actual: { lat: 0, lon: 0 },
      tiendaSelecciona: {
        zona: 'San Bernardo',
        codigo: 'SAN BRNRDO',
      },
    };
    this.localStorage.set('geolocalizacion', this.geoLocation);
    return this.geoLocation;
  }

  cambiarTiendaCliente(coordenadas: any, tienda: any) {
    this.geoLocation = {
      esNuevaUbicacion: false,
      obtenida: false,
      esSeleccionaPorCliente: true,
      actual: coordenadas,
      tiendaSelecciona: tienda,
    };

    this.localStorage.set('geolocalizacion', this.geoLocation);
    this.localizacion$.next(this.geoLocation);
  }

  cambiarTiendaCarro(coordenadas: any, tienda: any) {
    this.geoLocation = {
      esNuevaUbicacion: false,
      obtenida: false,
      esSeleccionaPorCliente: true,
      actual: coordenadas,
      tiendaSelecciona: tienda,
    };

    this.localizacionCarro$.next(this.geoLocation);
  }
}
