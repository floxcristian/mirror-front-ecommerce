import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private loadData$: Subject<any> = new Subject();
  readonly loadDataRead$: Observable<number> = this.loadData$.asObservable();
  private template$: Subject<any> = new Subject();
  readonly templateRead$: Observable<number> = this.template$.asObservable();
  constructor() {}

  activarModal(item: any) {
    this.template$.next(item);
  }

  LoadData() {
    this.loadData$.next(null);
  }
}
