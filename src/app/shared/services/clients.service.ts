// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
// Env
import { environment } from '@env/environment';

import { LocalStorageService } from '@core/modules/local-storage/local-storage.service';

import { Flota } from '../interfaces/flota';
import { ResponseApi } from '../interfaces/response-api';
import { CargosContactoResponse } from '../interfaces/cargoContacto';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private http: HttpClient, private localS: LocalStorageService) {}

  buscarOvsGeneradas() {
    const estado = 'generado';
    const call =
      environment.apiShoppingCart +
      `busquedaAll?estado=${estado}&carroPorPagina=100000&pagina=1`;
    return this.http.get(call);
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

  setDevolucion(data: any) {
    return this.http.post(environment.apiCustomer + `devolucion`, data);
  }

  getCargosContacto(): Observable<CargosContactoResponse> {
    return this.http.get<CargosContactoResponse>(
      `${environment.apiCustomer}filtros/cargosContacto`
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
