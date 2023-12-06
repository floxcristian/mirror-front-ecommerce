// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IGeolocation } from '@core/services-v2/geolocation/models/geolocation.interface';

@Injectable({
  providedIn: 'root',
})
export class GeolocationStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IGeolocation | null {
    return this.localStorageService.get(StorageKey.geolocalizacion) || null;
  }

  set(session: IGeolocation): void {
    this.localStorageService.set(StorageKey.geolocalizacion, session);
  }
}
