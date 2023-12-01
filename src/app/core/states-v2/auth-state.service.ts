// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, Subject } from 'rxjs';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateServiceV2 {
  private sessionSubject: Subject<ISession> = new Subject<ISession>();
  readonly session$: Observable<ISession> = this.sessionSubject.asObservable();

  constructor(private readonly sessionService: SessionService) {}

  setSession(session: ISession | null): void {
    if (session) {
      this.sessionSubject.next(session);
    } else {
      const previousSession = this.sessionService.getSession();
      this.sessionSubject.next(previousSession);
    }
  }
}
