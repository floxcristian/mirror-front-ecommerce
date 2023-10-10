// Angular
import { Injectable, OnDestroy } from '@angular/core';
// Rxjs
import { Observable, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// Others
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class QuickviewService implements OnDestroy {
  private destroy$: Subject<void> = new Subject();
  private showSubject$: Subject<Product> = new Subject();

  show$: Observable<Product> = this.showSubject$.pipe(
    takeUntil(this.destroy$)
  );

  show(product: Product): Observable<void> {
    // timer only for demo
    return timer(200).pipe(
      map(() => {
        this.showSubject$.next(product);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
