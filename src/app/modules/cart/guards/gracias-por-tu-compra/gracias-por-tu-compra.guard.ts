import { PaymentService } from './../../../../shared/services/payment.service'
import { map } from 'rxjs/operators'
import { CartService } from './../../../../shared/services/cart.service'
import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Params,
} from '@angular/router'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class GraciasPorTuCompraGuard implements CanActivate {
  constructor(
    private cartService: CartService,
    private router: Router,
    private paymentService: PaymentService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let haveAccess = false
    const queryParams = next.queryParams

    if (this.isPaymentApproved(queryParams)) {
      const documento = this.paymentService.obtenerDocumentoDeBuyOrderMPago(
        queryParams['external_reference'],
      )
      return this.cartService
        .primeraVisitaGraciasPorTuCompra(documento)
        .pipe(
          map((r) =>
            r.esPrimeraVisita ? true : this.router.parseUrl('/inicio'),
          ),
        )
    } else {
      if (!haveAccess) {
        return this.router.parseUrl('/inicio')
      }
      return true
    }
  }

  isPaymentApproved(query: Params): boolean {
    let status = query['status']
      ? query['status']
      : query['payment_status']
      ? query['payment_status']
      : null

    return query['external_reference'] && status && status == 'approved'
  }
}
