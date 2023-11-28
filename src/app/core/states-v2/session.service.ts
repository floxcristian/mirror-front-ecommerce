// Angular
import { Injectable } from '@angular/core';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionStorageService } from '../storage/session-storage.service';
// Libs
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private readonly sessionStorage: SessionStorageService) {}

  getSession(): ISession {
    const currentSession = this.sessionStorage.get();
    if (currentSession) return currentSession;

    const newSession: ISession = {
      email: uuidv4(),
      login_temp: true,
      documentId: '0',
      userRole: 'temp',
      iva: true,
      /*"preferences": {
        "iva": true
      }*/
    };
    this.sessionStorage.set(newSession);
    return newSession;
  }
}
