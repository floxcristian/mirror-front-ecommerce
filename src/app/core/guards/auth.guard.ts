import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Usuario } from '../../shared/interfaces/login';
import { LoginService } from '../../shared/services/login.service';
import { RootService } from '../../shared/services/root.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private root: RootService,
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const usuario: Usuario = this.root.getDataSesionUsuario();
    const links = this.loginService.setRoles(usuario.user_role);

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
