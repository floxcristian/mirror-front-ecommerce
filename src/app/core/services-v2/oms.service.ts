// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Environment
import { environment } from '@env/environment';

const API_OMS = `${environment.apiEcommerce}/api/v1/oms`;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getOrders(params: { search: string; page: number; limit: number }) {
    return this.http.get(`${API_OMS}/orders`, { params });
  }

  getOrderDetailAndSummary(trackingNumber: string) {
    return this.http.get(`${API_OMS}/orders/tracking/${trackingNumber}`);
  }

  getOrderDetail(trackingNumber: string) {
    return this.http.get(`${API_OMS}/orders/${trackingNumber}`);
  }
}
