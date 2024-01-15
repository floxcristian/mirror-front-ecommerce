// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';
// Env
import { environment } from '@env/environment';
// Models
import {
  ISalesBySbuResponse,
  ISalesMonthResponse,
} from '@core/services-v2/customer-sale/models/customer-sale.interface';
import { IOrders } from '@core/models-v2/customer/orders.interface';
import { IPaginated } from '@core/models-v2/shared/paginated.interface';
import { IDebtSales } from './models/debt-sale.interface';

const API_CUSTOMER_SALE = `${environment.apiEcommerce}/api/v1/customer-sale`;

@Injectable({
  providedIn: 'root',
})
export class CustomerSaleService {
  constructor(private http: HttpClient) {}
  /**
   * Obtener deudas de un cliente.
   * @returns
   */
  getCustomerSalesDebt(): Observable<IDebtSales> {
    return this.http.get<IDebtSales>(`${API_CUSTOMER_SALE}/debt-sales`);
  }

  //*** REPORT */
  getOneMonthSalesGroupedBySbu(
    year: number,
    month: number
  ): Observable<ISalesBySbuResponse> {
    return this.http.get<ISalesBySbuResponse>(
      `${API_CUSTOMER_SALE}/report/sales-by-sbu`,
      { params: { year, month } }
    );
  }

  getLastwoYearsSalesByMonth(year: number): Observable<ISalesMonthResponse> {
    return this.http.get<ISalesMonthResponse>(
      `${API_CUSTOMER_SALE}/report/last-sales-by-month`,
      { params: { year } }
    );
  }

  getSales(params: {
    search: string;
    page: number;
    limit: number;
  }): Observable<IPaginated<IOrders>> {
    return this.http.get<IPaginated<IOrders>>(`${API_CUSTOMER_SALE}/sales`, {
      params: params,
    });
  }
}
