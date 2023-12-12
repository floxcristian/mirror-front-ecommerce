// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Rxjs
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Interfaces
import { ArticuloResponse } from '../interfaces/articulos.response';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class LogisticsService {
  private urlApi = environment.apiLogistic;
  private direccion$: Subject<any> = new Subject();
  readonly direccionCliente$: Observable<any> = this.direccion$.asObservable();

  private storesSubject: Subject<any> = new Subject();
  readonly $stores: Observable<any> = this.storesSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtieneDireccionesCliente(clienteRut: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      this.urlApi + `direccionescliente?rut=${clienteRut}&tipo=2`
    );
  }

  obtienRetiro(data: any) {
    return this.http.post(environment.apiLogistic + `retirocarro`, data);
  }

  /**
   * Eliminar.
   * @param params
   * @returns
   */
  obtieneDireccionesTiendaRetiro(params: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiLogistic + `tiendasretiroomni`,
      { params }
    );
  }

  /**
   * Eliminar.
   * @returns
   */
  obtenerTiendas() {
    return this.http.get<ResponseApi>(this.urlApi + `tiendas`).pipe(
      map((r) => {
        this.storesSubject.next(r);
        return r;
      })
    );
  }

  /**
   * Eliminar.
   * @returns
   */
  obtenerTiendasOmni() {
    return this.http.get(this.urlApi + `tiendas`);
  }

  obtieneComunas() {
    return this.http.get(this.urlApi + `comunas`);
  }

  guardarDireccionCliente(data: any) {
    this.direccion$.next(data);
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
