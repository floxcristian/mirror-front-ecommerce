// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PathStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): string[] | null {
    return this.localStorageService.get(StorageKey.ruta) || null;
  }

  set(path: string[] | null): void {
    this.localStorageService.set(StorageKey.ruta, path);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.ruta);
  }
}
