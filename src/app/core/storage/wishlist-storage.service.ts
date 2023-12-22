// Angular
import { Injectable } from '@angular/core';
// Constants
import { StorageKey } from './storage-keys.enum';
// Services
import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';
import { IWishlist } from '@core/services-v2/wishlist/models/wishlist-response.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistStorageService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  get(): IWishlist[] {
    return this.localStorageService.get(StorageKey.favoritos) || [];
  }

  set(wishlists: IWishlist[]): void {
    return this.localStorageService.set(StorageKey.favoritos, wishlists);
  }

  remove(): void {
    this.localStorageService.remove(StorageKey.favoritos);
  }
}
