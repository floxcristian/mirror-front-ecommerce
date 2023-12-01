// Angular
import { Injectable } from '@angular/core';
// Interfaces
import { SessionStorageService } from '@core/storage/session-storage.service';
import { InvitadoStorageService } from '@core/storage/invitado-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  linkMiCuenta: any = [];

  constructor(
    // Services V2
    private readonly sessionStorage: SessionStorageService,
    private readonly invitadoStorage: InvitadoStorageService
  ) {}

  isLogin() {
    const user = this.sessionStorage.get();
    if (!user) {
      return false;
    } else {
      if (user.login_temp) {
        return false;
      } else {
        // this.localS.remove('invitado');
        this.invitadoStorage.remove();
        return true;
      }
    }
  }
}
