// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IValidateShoppingCartStockResponse } from '@core/models-v2/shopping-cart/validate-stock-response.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_SHOPPING_CART = `${environment.apiEcommerce}/api/v1/shopping-cart`;

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private http: HttpClient) {}

  validateStock(params: {
    shoppingCartId: string;
  }): Observable<IValidateShoppingCartStockResponse> {
    return this.http.post<IValidateShoppingCartStockResponse>(
      `${API_SHOPPING_CART}/validate-stock`,
      {
        shoppingCartId: params.shoppingCartId,
      }
    );
  }

  prepay(params: {
    shoppingCartId: string;
    invoiceType: string; // invoice, receipt
    street?: string;
    number?: string;
    city?: string;
    businessLine?: string;
  }) {
    return this.http.post(`${API_SHOPPING_CART}/prepay`, {
      shoppingCartId: params.shoppingCartId,
      invoiceType: params.invoiceType,
      street: params.street,
      number: params.number,
      city: params.city,
      businessLine: params.businessLine,
    });
  }
}
