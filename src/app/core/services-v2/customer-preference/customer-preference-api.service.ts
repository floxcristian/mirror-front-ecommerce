// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';
// Environment
import { environment } from '@env/environment';
// Models
import { IPreference } from '@core/models-v2/customer/customer-preference.interface';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerPreferenceApiService {
  constructor(private http: HttpClient) {}

  getPreferences(): Observable<IPreference> {
    return this.http.get<IPreference>(`${API_CUSTOMER}/preferences`);
  }

  updatePreferenceIva(iva: boolean) {
    return this.http.put(`${API_CUSTOMER}/preferences/iva`, { iva });
  }
}
