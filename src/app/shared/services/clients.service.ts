// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Env
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  updatePassword(data: any) {
    const call = environment.apiCMS + `users/` + data.clientId;
    return this.http.patch(call, data);
  }

  buscarUsuario(id: string) {
    const call = environment.apiCMS + `users/${id}`;
    return this.http.get(call);
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
}
