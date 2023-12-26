// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';
// Env
import { environment } from '@env/environment';
// Models
import { IPreference } from '@core/models-v2/customer/customer-preference.interface';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerPreferenceApiService {
  constructor(private http: HttpClient) {}

  /**
   * Obtener preferencias del cliente.
   * @returns
   */
  getPreferences(): Observable<IPreference> {
    return this.http.get<IPreference>(`${API_CUSTOMER}/preferences`);
  }

  /**
   * Actualizar preferencias del cliente.
   * @param iva
   * @returns
   */
  updatePreferenceIva(iva: boolean) {
    return this.http.put(`${API_CUSTOMER}/preferences/iva`, { iva });
  }
}
