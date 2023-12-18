// Angular
import { Injectable } from '@angular/core';
// Models
import { StorageKey } from './storage-keys.enum';
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IShoppingCart } from '@core/models-v2/cart/shopping-cart.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IShoppingCart | null {
    return this.localStorageService.get(StorageKey.carroCompraB2B) || null;
  }

  set(shoppingCart: IShoppingCart | null): void {
    this.localStorageService.set(StorageKey.carroCompraB2B, shoppingCart);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.carroCompraB2B);
  }
}
