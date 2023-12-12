// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { ISelectedStore } from '@core/services-v2/geolocation/models/geolocation.interface';

@Injectable({
  providedIn: 'root',
})
export class GeolocationStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): ISelectedStore | null {
    return this.localStorageService.get(StorageKey.geolocalizacion) || null;
  }

  set(session: ISelectedStore): void {
    this.localStorageService.set(StorageKey.geolocalizacion, session);
  }
}
