// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IPurchaseOrderLoaded } from '@core/models-v2/storage/purchaseOrderLoaded.interface';

@Injectable({
  providedIn: 'root',
})
export class PurshaseOrderLoadedStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IPurchaseOrderLoaded | null {
    return this.localStorageService.get(StorageKey.ordenCompraCargada) || null;
  }

  set(guest: IPurchaseOrderLoaded | null): void {
    this.localStorageService.set(StorageKey.ordenCompraCargada, guest);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.ordenCompraCargada);
  }
}
