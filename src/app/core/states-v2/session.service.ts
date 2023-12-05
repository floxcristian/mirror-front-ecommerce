// Angular
import { Injectable } from '@angular/core';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionStorageService } from '../storage/session-storage.service';
// Libs
import { v4 as uuidv4 } from 'uuid';
import { InvitadoStorageService } from '@core/storage/invitado-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    private readonly sessionStorage: SessionStorageService,
    private readonly invitadoStorage: InvitadoStorageService
  ) {}

  getSession(): ISession {
    const currentSession = this.sessionStorage.get();
    if (currentSession) return currentSession;

    const newSession: ISession = {
      email: uuidv4(),
      login_temp: true,
      documentId: '0',
      userRole: 'temp',
      preferences: {
        iva: true,
      },
    };
    this.sessionStorage.set(newSession);
    return newSession;
  }

  isLoggedIn(): boolean {
    const user = this.sessionStorage.get();
    if (!user) {
      return false;
    } else {
      if (user.login_temp) {
        return false;
      } else {
        // Porque borramos esto?
        this.invitadoStorage.remove();
        return true;
      }
    }
  }

  isB2B(): boolean {
    const session = this.getSession();
    return ['supervisor', 'comprador'].includes(session.userRole);
  }
}
