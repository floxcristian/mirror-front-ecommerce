import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  UrlTree,
  Params,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '@core/services-v2/cart.service';

@Injectable({
  providedIn: 'root',
})
export class GraciasPorTuCompraGuard {
  constructor(
    private router: Router,
    // Services V2
    private readonly cartService: CartService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let haveAccess = false;
    const queryParams = route.queryParams;

    if (this.isPaymentApproved(queryParams)) {
      const shoppingCartId = queryParams['shoppingCartId'];
      return this.cartService.thanksForYourPurchase({ shoppingCartId }).pipe(
        map((r) => {
          if (r.isFirstVisit) {
            return true;
          } else {
            this.router.parseUrl('/inicio');
            return false;
          }
        })
      );
    } else {
      if (!haveAccess) {
        this.router.parseUrl('/inicio');
        return false;
      }
      return true;
    }
  }

  isPaymentApproved(query: Params): boolean {
    let status = query['status']
      ? query['status']
      : query['payment_status']
      ? query['payment_status']
      : null;

    return query['shoppingCartId'] && status && status == 'approved';
  }
}
