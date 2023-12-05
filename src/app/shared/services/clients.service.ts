// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
// Environment
import { environment } from '@env/environment';

import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

import { Flota } from '../interfaces/flota';
import { isVacio } from '../utils/utilidades';
import { ResponseApi } from '../interfaces/response-api';
import { ArticuloFavorito } from '../interfaces/articuloFavorito';
import { CargosContactoResponse } from '../interfaces/cargoContacto';
import { SessionService } from '@core/states-v2/session.service';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(
    private http: HttpClient,
    private localS: LocalStorageService,
    // Services V2
    private readonly sessionService: SessionService
  ) {}

  obtenerGiros(rut: string) {
    return this.http
      .get(`${environment.apiCustomer}girosSII`, {
        params: {
          rut,
        },
      })
      .pipe(
        map((res: any) => {
          if (res.error)
            throw new Error('Has error an occurred on giros SII.');
          return res;
        }),
        retry(3)
      );
  }

  buscarOvsGeneradas() {
    const estado = 'generado';
    const call =
      environment.apiShoppingCart +
      `busquedaAll?estado=${estado}&carroPorPagina=100000&pagina=1`;
    return this.http.get(call);
  }

  cotizacionAOV(idCarro: any, usuario: any) {
    return this.http.put(environment.apiShoppingCart + `cotizacionov`, {
      numero: idCarro,
      usuario,
    });
  }

  /**
   * Recuperar contraseña.
   * @param data
   * @returns
   */
  recuperarPassword(data: any) {
    return this.http.post(environment.apiCMS + `users/recover-pass`, data);
  }

  updatePassword(data: any) {
    const call = environment.apiCMS + `users/` + data.clientId;
    return this.http.patch(call, data);
  }

  updateIVA(data: any) {
    const call = environment.apiCustomer + `actualizarIva`;
    return this.http.put<ResponseApi>(call, data);
  }

  buscarUsuario(id: string) {
    const call = environment.apiCMS + `users/${id}`;
    return this.http.get(call);
  }

  crearUsuario(data: any) {
    const call = environment.apiCMS + `users/ingresar`;
    return this.http.post(call, data);
  }

  updateUsuario(data: any) {
    const call = environment.apiCMS + `users/` + data._id;
    return this.http.patch(call, data);
  }

  addAdreess(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      `${environment.apiCustomer}direccionCRM`,
      request
    );
  }

  async updateProfile(data: any) {
    const endpoint = `${environment.apiCustomer}actualizarPerfil`;
    const params = `?rut=${data.rut}&nombre=${data.nombre}&apellido=${data.apellido}&correo=${data.correo}&telefono=${data.telefono}`;
    const url = `${endpoint}${params}`;
    return this.http.get(url).toPromise();
  }

  async changePassword(data: any) {
    const usuario = this.sessionService.getSession();
    const params: any = {
      correo: usuario.username,
      passActual: data.password,
      passNueva: data.pwd,
    };
    const url = `${environment.apiCustomer}actualizarContrasenna`;
    return this.http.get(url, { params }).toPromise();
  }

  async ValidarCorreo(data: any) {
    let consulta = null;
    const endpoint = `${environment.apiCustomer}buscarCorreo`;
    const params = `?correo=${data}`;
    const url = `${endpoint}${params}`;
    consulta = await this.http.get(url).toPromise();

    return consulta;
  }

  buscarGiros() {
    const call = environment.apiCustomer + `giros`;
    return this.http.get(call);
  }

  graficoVentaValorada(request: any) {
    const url = `${environment.apiCustomer}graficos/ventaValorada?rutCliente=${request.rutCliente}&anio=${request.anio}`;
    return this.http.get(url);
  }

  graficoVentasPorUen(request: any) {
    let consulta = null;

    const url = `${environment.apiCustomer}tablas/ventasPorUen?rutCliente=${request.rutCliente}`;
    let params = '';
    if (!isVacio(request.anio)) {
      params = params + `&anio=${request.anio}`;
    }
    if (!isVacio(request.mes)) {
      params = params + `&mes=${request.mes}`;
    }
    consulta = this.http.get(url + params);

    return consulta;
  }

  buscarSaldo(rut: any) {
    const call = environment.apiCustomer + `saldo?rut=${rut}`;
    return this.http.get(call);
  }

  buscarFacturas(rut: any) {
    const call = environment.apiCustomer + `facturas?rut=${rut}`;
    return this.http.get(call);
  }

  register(data: any) {
    return this.http.post(environment.apiCustomer + `nuevo`, data);
  }

  registerb2b(data: any) {
    return this.http.post(environment.apiCustomer + `nuevob2b`, data);
  }
  validateCustomer(rut: any) {
    return this.http.get(environment.apiCustomer + `rut?rut=${rut}`);
  }

  validateCustomerb2b(rut: any) {
    return this.http.get(environment.apiCustomer + `rutb2b?rut=${rut}`);
  }
  getDataClient(data: any) {
    return this.http.post(environment.apiCustomer + `GetDatosCliente`, data);
  }

  getCustomerDebt(data: any) {
    return this.http.post(environment.apiCustomer + `deuda/listado`, data);
  }

  generatePayment(data: any) {
    return this.http.post(environment.apiCustomer + `deuda/generaPago`, data);
  }

  getListaArticulosFavoritos(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `favoritos/lista?rut=${rut}`
    );
  }

  setDevolucion(data: any) {
    return this.http.post(environment.apiCustomer + `devolucion`, data);
  }

  setListaArticulosFavoritos(
    nombre: string,
    rut: string
  ): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `favoritos/lista`,
      { nombre, rut }
    );
  }

  setArticulosFavoritos(
    sku: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      environment.apiCustomer + `favoritos/sku/${idLista}`,
      { sku, rut }
    );
  }

  deleteArticulosFavoritos(
    sku: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    const options = {
      body: {
        sku,
        rut,
      },
    };
    return this.http.delete<ResponseApi>(
      environment.apiCustomer + `favoritos/sku/${idLista}`,
      options
    );
  }

  deleteTodosArticulosFavoritos(
    sku: string,
    rut: string
  ): Observable<ResponseApi> {
    const options = {
      body: {
        sku,
        rut,
      },
    };
    return this.http.delete<ResponseApi>(
      environment.apiCustomer + `favoritos/sku`,
      options
    );
  }

  updateListaArticulosFavoritos(
    nombre: string,
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiCustomer + `favoritos/lista/${idLista}`,
      { nombre, rut }
    );
  }

  predeterminadaListaArticulosFavoritos(
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiCustomer + `favoritos/lista/${idLista}/predeterminada`,
      { rut }
    );
  }

  deleteListaArticulosFavoritos(
    rut: string,
    idLista: string
  ): Observable<ResponseApi> {
    const options = {
      body: {
        rut,
      },
    };
    return this.http.delete<ResponseApi>(
      environment.apiCustomer + `favoritos/lista/${idLista}`,
      options
    );
  }

  setArticulosFavoritosMasivo(
    formData: FormData,
    idLista: string
  ): Observable<ResponseApi> {
    let url: string;
    if (isVacio(idLista)) {
      url = 'favoritos/excel';
    } else {
      url = `favoritos/excel/${idLista}`;
    }
    return this.http.post<ResponseApi>(
      environment.apiCustomer + url,
      formData
    );
  }

  setArticulosFavoritosUnitario(
    request: any,
    idLista: string
  ): Observable<ResponseApi> {
    let url: string;
    if (isVacio(idLista)) {
      url = 'favoritos/skus';
    } else {
      url = `favoritos/skus/${idLista}`;
    }
    return this.http.post<ResponseApi>(environment.apiCustomer + url, request);
  }

  async cargaFavoritosLocalStorage(rut: string) {
    let favoritos: ArticuloFavorito;
    const resp: any = await this.getListaArticulosFavoritos(rut).toPromise();
    if (resp.data.length > 0) {
      favoritos = resp.data[0];

      this.localS.set('favoritos', favoritos);
    } else {
      this.localS.set('favoritos', {
        _id: 0,
        rut,
        listas: [],
      });
    }
  }

  getCentrosCosto(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `centroCosto?rut=${rut}`
    );
  }

  setCentroCosto(request: any) {
    return this.http.post(environment.apiCustomer + `centroCosto`, request);
  }

  updateCentroCosto(
    nombre: string,
    rut: string,
    idCentro: string
  ): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      environment.apiCustomer + `centroCosto/${idCentro}`,
      { nombre, rut }
    );
  }

  deleteCentroCosto(rut: string, idCentro: string) {
    const options = {
      body: {
        rut,
      },
    };
    return this.http.delete(
      environment.apiCustomer + `centroCosto/${idCentro}`,
      options
    );
  }

  getCargosContacto(): Observable<CargosContactoResponse> {
    return this.http.get<CargosContactoResponse>(
      `${environment.apiCustomer}filtros/cargosContacto`
    );
  }

  actualizaDireccion(request: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${environment.apiCustomer}direccionCRM`,
      request
    );
  }

  eliminaDireccion(
    request: any,
    rutCliente: string,
    recid: number
  ): Observable<ResponseApi> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: request,
    };
    return this.http.delete<ResponseApi>(
      `${environment.apiCustomer}direccionCRM/${rutCliente}/${recid}`,
      options
    );
  }

  nuevoContacto(request: any): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      `${environment.apiCustomer}contactoCRM`,
      request
    );
  }

  actualizaContacto(request: any): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(
      `${environment.apiCustomer}contactoCRM`,
      request
    );
  }

  eliminaContacto(
    request: any,
    rutCliente: string,
    contactoId: string
  ): Observable<ResponseApi> {
    const options = {
      body: request,
    };
    return this.http.delete<ResponseApi>(
      `${environment.apiCustomer}contactoCRM/${rutCliente}/${contactoId}`,
      options
    );
  }

  getBloqueo(rutCliente: string) {
    return this.http.get(
      `${environment.apiCustomer}bloqueo?rut=${rutCliente}`
    );
  }

  // NOVA
  deleteBusquedaVin(busqueda: Flota) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        idFlota: busqueda._id,
      },
    };
    return this.http.delete(environment.apiCustomer + `busquedaVin`, options);
  }

  // NOVA
  deleteFlota(flota: Flota) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        idFlota: flota._id,
      },
    };
    return this.http.delete(environment.apiCustomer + `flota`, options);
  }

  // NOVA
  updateFlota(request: any) {
    return this.http.put(environment.apiCustomer + `flota`, request);
  }

  // NOVA
  getBusquedasVin(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `busquedasVin?rutCliente=${rut}`
    );
  }

  // NOVA
  getFlota(rut: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      environment.apiCustomer + `flota?rutCliente=${rut}`
    );
  }

  // NOVA
  setFlota(request: any) {
    return this.http.post(environment.apiCustomer + `flota`, request);
  }
}
