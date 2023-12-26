// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environments
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  constructor(private http: HttpClient) {}

  buscarEstadosOV(ov: string) {
    return this.http.get(
      `${environment.apiOms}ordenes-venta/listadoFiltrado/${ov}`
    );
  }

  getClienteOv(params: any) {
    return this.http.post(`${environment.apiOms}oms/clienteOv`, params);
  }

  recibo(ov: string) {
    return this.http.get(`${environment.apiLogistic}respaldos/${ov}`);
  }
}
