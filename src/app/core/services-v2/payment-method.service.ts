// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentMethod } from '@core/models-v2/payment-method/payment-method.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_PAYMENT = `${environment.apiEcommerce}/api/v1/payment`;

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  constructor(private http: HttpClient) {}

  getPaymentMethods(params: {
    username: string;
  }): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${API_PAYMENT}/payment-methods`, {
      params,
    });
  }
}
