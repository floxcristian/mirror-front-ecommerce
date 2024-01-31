// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private loadData$: Subject<any> = new Subject();
  readonly loadDataRead$: Observable<number> = this.loadData$.asObservable();
  private template$: Subject<any> = new Subject();
  readonly templateRead$: Observable<number> = this.template$.asObservable();

  activarModal(item: any) {
    this.template$.next(item);
  }

  LoadData() {
    this.loadData$.next(null);
  }
}
