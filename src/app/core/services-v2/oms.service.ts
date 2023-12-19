// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrdersResponse } from '@core/models-v2/oms/order.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_OMS = `${environment.apiEcommerce}/api/v1/oms`;

@Injectable({
  providedIn: 'root',
})
export class OmsService {
  constructor(private http: HttpClient) {}

  getOrders(params: { search: string; page: number; limit: number }):Observable<IOrdersResponse> {
    return this.http.get<IOrdersResponse>(`${API_OMS}/orders`, { params });
  }

  getOrderDetailAndSummary(trackingNumber: string) {
    return this.http.get(`${API_OMS}/orders/tracking/${trackingNumber}`);
  }

  getOrderDetail(trackingNumber: string) {
    return this.http.get(`${API_OMS}/orders/${trackingNumber}`);
  }
}
