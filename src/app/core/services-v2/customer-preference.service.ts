// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPreference } from '@core/models-v2/customer/customer-preference.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_CUSTOMER = `${environment.apiEcommerce}/api/v1/customer`;

@Injectable({
  providedIn: 'root',
})
export class CustomerPreferenceService {
  constructor(private http: HttpClient) {}

  getPreferences(): Observable<IPreference> {
    return this.http.get<IPreference>(`${API_CUSTOMER}/preferences`);
  }

  updatePreferenceIva(params: { iva: boolean }) {
    const { iva } = params;
    return this.http.put(`${API_CUSTOMER}/preferences/iva`, {
      iva,
    });
  }
}
