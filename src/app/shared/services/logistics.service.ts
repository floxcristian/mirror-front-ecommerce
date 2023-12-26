// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
// Env
import { environment } from '@env/environment';
// Interfaces
import { ArticuloResponse } from '../interfaces/articulos.response';

@Injectable({
  providedIn: 'root',
})
export class LogisticsService {
  private urlApi = environment.apiLogistic;

  private storesSubject: Subject<any> = new Subject();
  readonly $stores: Observable<any> = this.storesSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtieneComunas() {
    return this.http.get(this.urlApi + `comunas`);
  }

  obtenerMultiDespachos(data: any) {
    let consulta: any = this.http.post(
      environment.apiLogistic + 'despachocarro3/',
      data
    );
    return consulta;
  }

  articulos(search: string = ''): Observable<ArticuloResponse> {
    return this.http
      .get<ArticuloResponse>(
        `${environment.apiLogistic}articulos?search=${search}`
      )
      .pipe(
        map((response) => {
          response.data = response.data.map((articulo: any) => {
            try {
              articulo.image =
                articulo.images[0][150].length > 0
                  ? articulo.images[0][150][0]
                  : '';
            } catch (e) {
              articulo.image =
                articulo.images.hasOwnProperty(150) &&
                articulo.images[150].length > 0
                  ? articulo.images[150][0]
                  : '';
            }
            if (!articulo.image) {
              articulo.image =
                '/assets/images/products/no-image-listado-2.jpg';
            }
            return articulo;
          });
          return response;
        })
      );
  }
}
