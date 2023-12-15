// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IPreference } from '@core/models-v2/customer/customer-preference.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerPreferenceStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IPreference | null {
    return (
      this.localStorageService.get(StorageKey.preferenciasCliente) || null
    );
  }

  set(preferences: IPreference | null): void {
    this.localStorageService.set(StorageKey.preferenciasCliente, preferences);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.preferenciasCliente);
  }
}
