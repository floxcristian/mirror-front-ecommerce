import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { LoginService } from '../../shared/services/login.service';
import { SessionService } from '@core/states-v2/session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private loginService: LoginService,
    private router: Router,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const usuario: Usuario = this.root.getDataSesionUsuario();
    const user = this.sessionService.getSession();
    const links = this.loginService.setRoles(user.userRole);

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
