// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Services
import { LoginService } from '../../../../shared/services/login.service';
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss'],
})
export class PageLoginComponent {
  constructor(
    private router: Router,
    private localS: LocalStorageService,
    private loginService: LoginService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly authStateService: AuthStateServiceV2
  ) {
    // Cerramos la sesion del usuario
    // this.localS.remove('usuario');
    this.sessionStorage.remove();
    this.localS.remove('preferenciasCliente');
    this.localS.remove('ordenCompraCargada');
    this.localS.remove('buscadorB2B');
    this.localS.remove('favoritos');
    this.authStateService.setSession(null);
    // this.loginService.notify(null);

    this.router.navigate(['/inicio']).then(() => {
      window.location.reload();
    });
  }
}
