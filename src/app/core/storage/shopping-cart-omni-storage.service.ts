// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IShoppingCart } from '@core/models-v2/cart/shopping-cart.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartOmniStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IShoppingCart | null {
    return this.localStorageService.get(StorageKey.carroCompraOMNI) || null;
  }

  set(shoppingCart: IShoppingCart | null): void {
    this.localStorageService.set(StorageKey.carroCompraOMNI, shoppingCart);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.carroCompraOMNI);
  }
}
