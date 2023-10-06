import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ArticuloResponse } from '../interfaces/articulos.response';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class LogisticsService {
  private urlApi = environment.apiImplementosLogistica;
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
  obtieneDespachoProducto(data: any) {
    return this.http.post(this.urlApi + `despachoProducto`, data);
  }

  obtieneDespachos(data: any) {
    return this.http.post(this.urlApi + `despachocarro2`, data);
  }

  obtienRetiro(data: any) {
    return this.http.post(
      environment.apiImplementosLogistica + `retirocarro`,
      data
    );
  }

  obtieneDireccionesTienda() {
    return this.http.get(this.urlApi + `direccionestiendas`);
  }

  obtieneDespachoCompleto(params: any) {
    return this.http.get(
      environment.apiImplementosLogistica + `productosRetiro`,
      { params }
    );
  }

  obtieneDireccionesTiendaRetiro(params: any): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiImplementosLogistica + `tiendasretiroomni`,
      { params }
    );
  }

  obtieneEstadoOV(OV: string) {
    let consulta: any = this.http.get(
      environment.apiImplementosLogistica + 'prestador-seguimiento/' + OV
    );
    return consulta;
  }

  obtieneComunas() {
    return this.http.get(this.urlApi + `comunas`);
  }

  guardarDireccionCliente(data: any) {
    this.direccion$.next(data);
  }

  obtenerTiendas() {
    return this.http.get<ResponseApi>(this.urlApi + `tiendas`).pipe(
      map((r) => {
        this.storesSubject.next(r);
        return r;
      })
    );
  }
  obtenerTiendasOmni() {
    return this.http.get(this.urlApi + `tiendas`);
  }

  ReciboEnvio(guia_despacho: string) {
    let consulta: any = this.http.get(
      environment.apiImplementosLogistica + 'receptorGD/SAMEX/' + guia_despacho
    );
    return consulta;
  }

  obtieneOvEspera(sucursal: string) {
    let consulta: any = this.http.get(
      environment.apiOms +
        `propagandaTV/esperaClienteEnTienda?tvLocation=${sucursal}&fakeData=0`
    );
    return consulta;
  }

  async saveStatusTv(objSave: any) {
    const respuesta: any = await this.http
      .post(`${environment.urlScreen}SetScreenactiva`, objSave)
      .toPromise();
    return respuesta;
  }

  obtenerGrupoDespacho(id_carro: any, comuna: any) {
    let consulta: any = this.http.get(
      environment.apiPromesa + 'domicilio/' + id_carro + '/' + comuna
    );
    return consulta;
  }

  obtenerMultiDespachos(data: any) {
    let consulta: any = this.http.post(
      environment.apiImplementosLogistica + 'despachocarro3/',
      data
    );
    return consulta;
  }

  articulos(search: string = ''): Observable<ArticuloResponse> {
    return this.http
      .get<ArticuloResponse>(
        `${environment.apiImplementosLogistica}articulos?search=${search}`
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
