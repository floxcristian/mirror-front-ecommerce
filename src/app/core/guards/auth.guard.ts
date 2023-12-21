import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { SessionService } from '@core/services-v2/session/session.service';
import { MenuService } from '@core/services-v2/menu/menu.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    // Services V2
    private readonly sessionService: SessionService,
    private readonly menuService: MenuService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.sessionService.getSession();
    const links = this.menuService.get(user.userRole);

    const urls = links.map((x: any) => {
      x.url.shift();
      return `/${x.url.join('/')}`;
    });

    if (!urls.includes(state.url)) {
      this.router.navigate(['/inicio']);
      return false;
    } else {
      return true;
    }
  }
}
