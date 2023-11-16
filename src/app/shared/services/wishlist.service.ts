// Angular
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Rxjs
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// Services
import { Product } from '../interfaces/product';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';

interface WishlistData {
  items: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService implements OnDestroy {
  private data: WishlistData = {
    items: [],
  };

  private destroy$: Subject<void> = new Subject();
  private itemsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);
  private onAddingSubject$: Subject<Product> = new Subject();

  readonly items$: Observable<Product[]> = this.itemsSubject$.pipe(
    takeUntil(this.destroy$)
  );
  readonly count$: Observable<number> = this.itemsSubject$.pipe(
    map((items) => items.length)
  );
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

  //NO SE UTILIZA
  // remove(product: Product): Observable<void> {
  //   // timer only for demo
  //   return timer(1000).pipe(
  //     map(() => {
  //       const index = this.data.items.findIndex(
  //         (item) => item.sku === product.sku
  //       );

  //       if (index !== -1) {
  //         this.data.items.splice(index, 1);
  //         this.save();
  //       }
  //     })
  //   );
  // }

  private save(): void {
    this.localS.set('wishlistItems', this.data.items as any);

    this.itemsSubject$.next(this.data.items);
  }

  private load(): void {
    const items: Product[] = this.localS.get('wishlistItems') as any;
    if (items) {
      this.data.items = items;
      this.itemsSubject$.next(this.data.items);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
