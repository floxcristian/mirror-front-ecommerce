// Angular
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Rxjs
import { Observable, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
// Models
import { Product } from '../interfaces/product';
// Services
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

interface WishlistData {
  items: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private data: WishlistData = {
    items: [],
  };

  private onAddingSubject$: Subject<Product> = new Subject();
  readonly onAdding$: Observable<Product> =
    this.onAddingSubject$.asObservable();

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: any,
    private localS: LocalStorageService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.load();
    }
  }

  add(product: Product): Observable<void> {
    // timer only for demo
    return timer(1000).pipe(
      map(() => {
        this.onAddingSubject$.next(product);

        const index = this.data.items.findIndex(
          (item) => item.sku === product.sku
        );

        if (index === -1) {
          this.data.items.push(product);
          this.save();
        }
      })
    );
  }

  private save(): void {
    this.localS.set('wishlistItems', this.data.items as any);

    //this.itemsSubject$.next(this.data.items);
  }

  private load(): void {
    const items: Product[] = this.localS.get('wishlistItems') as any;
    if (items) {
      this.data.items = items;
      //this.itemsSubject$.next(this.data.items);
    }
  }
}
