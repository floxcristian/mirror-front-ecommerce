// Angular
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
// Services
import { SessionService } from '@core/services-v2/session/session.service';
import { MenuService } from '@core/services-v2/menu/menu.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private readonly sessionService: SessionService,
    private readonly menuService: MenuService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { userRole } = this.sessionService.getSession();
    const links = this.menuService.get(userRole);

    const urls = links.map((x) => {
      x.url.shift();
      return `/${x.url.join('/')}`;
    });

    if (urls.includes(state.url)) return true;

    this.router.navigate(['/inicio']);
    return false;
  }
}
