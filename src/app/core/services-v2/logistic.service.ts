// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';
import { ICity } from '@core/models-v2/logistic/city.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_LOGISTIC = `${environment.apiEcommerce}/api/v1/logistic`;

@Injectable({
  providedIn: 'root',
})
export class LogisticService {
  constructor(private http: HttpClient) {}

  getCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(`${API_LOGISTIC}/cities`);
  }
}
