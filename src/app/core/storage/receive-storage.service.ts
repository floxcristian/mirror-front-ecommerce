// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IReceive } from '@core/models-v2/storage/receive.interface';

@Injectable({
  providedIn: 'root',
})
export class ReceiveStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IReceive | null {
    return this.localStorageService.get(StorageKey.recibe) || null;
  }

  set(guest: IReceive | null): void {
    this.localStorageService.set(StorageKey.recibe, guest);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.recibe);
  }
}
