// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IInvitado } from '@core/models-v2/storage/invitado.interface';

@Injectable({
  providedIn: 'root',
})
export class InvitadoStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IInvitado {
    return this.localStorageService.get(StorageKey.invitado);
  }

  set(invitado: IInvitado): void {
    this.localStorageService.set(StorageKey.invitado, invitado);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.invitado);
  }
}
