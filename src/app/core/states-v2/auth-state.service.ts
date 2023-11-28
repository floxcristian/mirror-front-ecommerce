// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { BehaviorSubject, Observable } from 'rxjs';
// Models
import { ISession } from '@core/models-v2/auth/session.interface';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateServiceV2 {
  private sessionSubject: BehaviorSubject<ISession | null> =
    new BehaviorSubject<ISession | null>(null);
  readonly session$: Observable<ISession | null> =
    this.sessionSubject.asObservable();

  constructor(private readonly sessionService: SessionService) {}

  // notify
  setSession(session: ISession): void {
    if (session) {
      this.sessionSubject.next(session);
    } else {
      const previousSession = this.sessionService.getSession();
      this.sessionSubject.next(previousSession);
    }
  }
}
