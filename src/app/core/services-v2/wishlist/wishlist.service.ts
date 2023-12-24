import { Injectable } from '@angular/core';
import { WishlistStorageService } from '@core/storage/wishlist-storage.service';
import { WishlistApiService } from './wishlist-api.service';
import { Observable, tap } from 'rxjs';
import { IWishlist } from './models/wishlist-response.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(
    private readonly wishlistApiService: WishlistApiService,
    private readonly wishlistStorage: WishlistStorageService
  ) {}

  /**
   * Obtener listas de deseos desde el API y guardarlas en el localstorage.
   * @param documentId
   * @returns
   */
  setWishlistsOnStorage(documentId: string): Observable<IWishlist[]> {
    return this.wishlistApiService
      .getWishlists(documentId)
      .pipe(tap((wishlists) => this.wishlistStorage.set(wishlists)));
  }
}
