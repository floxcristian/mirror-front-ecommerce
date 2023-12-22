// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder, IOrdersResponse } from '@core/models-v2/oms/order.interface';
// Environment
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const API_OMS = `${environment.apiEcommerce}/api/v1/oms`;

@Injectable({
  providedIn: 'root',
})
export class OmsService {
  constructor(private http: HttpClient) {}

  getOrders(params: { search: string; page: number; limit: number; sort?: string }):Observable<IOrdersResponse> {
    return this.http.get<IOrdersResponse>(`${API_OMS}/orders`, { params });
  }

  getOrderDetailAndSummary(trackingNumber: string):Observable<IOrder> {
    return this.http.get<IOrder>(`${API_OMS}/order/tracking/${trackingNumber}`);
  }

  getOrderDetail(trackingNumber: string):Observable<IOrder> {
    return this.http.get<IOrder>(`${API_OMS}/order/${trackingNumber}`);
  }
}
