// Angular
import { Injectable } from '@angular/core';
// Constants
import { StorageKey } from './storage-keys.enum';
// Services
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { ICustomerPreference } from '@core/services-v2/customer-preference/models/customer-preference.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerPreferencesStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): ICustomerPreference {
    return (
      this.localStorageService.get(StorageKey.preferenciasCliente) || {
        deliveryAddress: null,
      }
    );
  }

  set(preferences: ICustomerPreference): void {
    this.localStorageService.set(StorageKey.preferenciasCliente, preferences);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.preferenciasCliente);
  }
}
