// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IGuest } from '@core/models-v2/storage/guest.interface';

@Injectable({
  providedIn: 'root',
})
export class GuestStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IGuest | null {
    return this.localStorageService.get(StorageKey.invitado) || null;
  }

  set(guest: IGuest | null): void {
    this.localStorageService.set(StorageKey.invitado, guest);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.invitado);
  }
}
