// Angular
import { Injectable } from '@angular/core';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { ITokenResponse } from '@core/services-v2/auth/models/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionTokenStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): ITokenResponse | null {
    return this.localStorageService.get(StorageKey.tokens) || null;
  }

  set(tokens: ITokenResponse | null): void {
    this.localStorageService.set(StorageKey.tokens, tokens);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.tokens);
  }
}
