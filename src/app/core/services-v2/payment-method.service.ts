// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IKhipuBank } from '@core/models-v2/payment-method/khipu-bank.interface';
import { IPaymentMethod } from '@core/models-v2/payment-method/payment-method.interface';
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
  }): Observable<IPaymentMethod[]> {
    return this.http.get<IPaymentMethod[]>(`${API_PAYMENT}/payment-methods`, {
      params,
    });
  }

  redirectToWebpayTransaction(params: { shoppingCartId: string }) {
    const { shoppingCartId } = params;
    let qs = `shoppingCartId=${shoppingCartId}&redirect=1`;
    qs += '&nocache=' + new Date().getTime();
    const url = `${API_PAYMENT}/webpay/create-transaction?${qs}`;
    window.location.href = url;
  }

  redirectToMercadoPagoTransaction(params: { shoppingCartId: string }) {
    const { shoppingCartId } = params;
    let qs = `shoppingCartId=${shoppingCartId}&redirect=1`;
    qs += '&nocache=' + new Date().getTime();
    const url = `${API_PAYMENT}/mercadopago/create-transaction?${qs}`;
    window.location.href = url;
  }

  redirectToKhipuTransaction(params: {
    shoppingCartId: string;
    bankName: string;
    bankId: string;
  }) {
    const { shoppingCartId, bankName, bankId } = params;
    let qs = `shoppingCartId=${shoppingCartId}&bankId=${bankId}&bankName=${bankName}&redirect=1`;
    qs += '&nocache=' + new Date().getTime();
    const url = `${API_PAYMENT}/khipu/create-transaction?${qs}`;
    window.location.href = url;
  }

  getKhipuBanks(): Observable<IKhipuBank[]> {
    const url = `${API_PAYMENT}/khipu/banks`;
    return this.http.get<IKhipuBank[]>(url);
  }
}
