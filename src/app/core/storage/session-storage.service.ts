// Angular
import { Injectable } from '@angular/core';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): ISession | null {
    return this.localStorageService.get(StorageKey.usuario) || null;
  }

  set(session: ISession | null): void {
    this.localStorageService.set(StorageKey.usuario, session);
  }

  remove() {
    this.localStorageService.remove(StorageKey.usuario);
  }
}
