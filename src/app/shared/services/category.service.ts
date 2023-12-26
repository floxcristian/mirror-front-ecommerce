// Angular
import { Injectable } from '@angular/core';
// Rxjs
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriasHeaderSubject: Subject<any> = new Subject();
  readonly $categoriasHeader: Observable<any> =
    this.categoriasHeaderSubject.asObservable();

  constructor() {}

}
