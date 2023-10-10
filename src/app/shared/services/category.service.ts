import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriasHeaderSubject: Subject<any> = new Subject();
  readonly $categoriasHeader: Observable<any> =
    this.categoriasHeaderSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtieneCategorias() {
    return this.http.get(`${environment.apib2b}/api/categorias/listado`);
  }

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
