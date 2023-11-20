// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
// Environment
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriasHeaderSubject: Subject<any> = new Subject();
  readonly $categoriasHeader: Observable<any> =
    this.categoriasHeaderSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtieneCategoriasHeader() {
    return this.http
      .get(environment.apiCMS + 'categories/categorias-header/')
      .pipe(
        map((r) => {
          this.categoriasHeaderSubject.next(r);
          return r;
        })
      );
  }
}
