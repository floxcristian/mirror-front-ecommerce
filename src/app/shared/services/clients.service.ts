// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Rxjs
import { Observable } from 'rxjs';
// Env
import { environment } from '@env/environment';
// Models
import { Flota } from '../interfaces/flota';
import { ResponseApi } from '../interfaces/response-api';
import { CargosContactoResponse } from '../interfaces/cargoContacto';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private http: HttpClient) {}

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

  register(data: any) {
    return this.http.post(environment.apiCustomer + `nuevo`, data);
  }

  validateCustomer(rut: any) {
    return this.http.get(environment.apiCustomer + `rut?rut=${rut}`);
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
}
