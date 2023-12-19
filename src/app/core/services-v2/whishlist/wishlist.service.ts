import { Injectable } from '@angular/core';
import { WishlistStorageService } from '@core/storage/wishlist-storage.service';
import { WishlistApiService } from './whishlist-api.service';
import { Observable, tap } from 'rxjs';
import { IWishlist } from './models/whishlist-response.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(
    private readonly wishlistApiService: WishlistApiService,
    private readonly wishlistStorage: WishlistStorageService
  ) {}

  setWishlistOnStorage(documentId: string): Observable<IWishlist[]> {
    return this.wishlistApiService
      .getWishlists(documentId)
      .pipe(tap((wishlists) => this.wishlistStorage.set(wishlists)));
  }
}
