// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Services
import { LocalStorageService } from 'src/app/core/modules/local-storage/local-storage.service';
import { SessionStorageService } from '@core/storage/session-storage.service';
import { AuthStateServiceV2 } from '@core/states-v2/auth-state.service';
import { SessionTokenStorageService } from '@core/storage/session-token-storage.service';
import { CustomerPreferencesStorageService } from '@core/storage/customer-preferences-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss'],
})
export class PageLoginComponent {
  constructor(
    private router: Router,
    private localS: LocalStorageService,
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly sessionTokenStorage: SessionTokenStorageService,
    private readonly authStateService: AuthStateServiceV2,
    private readonly customerPreferencesStorage: CustomerPreferencesStorageService
  ) {
    // Cerramos la sesion del usuario
    this.sessionStorage.remove();
    this.sessionTokenStorage.remove();
    this.customerPreferencesStorage.remove();
    //this.localS.remove('preferenciasCliente');
    this.localS.remove('ordenCompraCargada');
    this.localS.remove('buscadorB2B');
    this.localS.remove('favoritos');
    this.authStateService.setSession(null);

    this.router.navigate(['/inicio']).then(() => {
      window.location.reload();
    });
  }
}
