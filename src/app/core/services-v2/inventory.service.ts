// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Environment
import { environment } from '@env/environment';

const API_INVENTORY = `${environment.apiEcommerce}/api/v1/inventory`;

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  requestForStock(params: {
    sku: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  }) {
    return this.http.get(`${API_INVENTORY}/request-product-out-of-stock`, {
      params,
    });
  }
}
