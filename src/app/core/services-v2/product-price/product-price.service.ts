// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Rxjs
import { Observable } from 'rxjs';
// Envs
import { environment } from '@env/environment';
// Models
import { IPriceInfo } from '@core/models-v2/cms/special-reponse.interface';

const API_PRODUCT = `${environment.apiEcommerce}/api/v1/article`;

@Injectable({
  providedIn: 'root',
})
export class ProductPriceApiService {
  constructor(private http: HttpClient) {}

  /**
   * Obtener precio de un producto.
   * @param params
   * @returns
   */
  getProductPrice(params: {
    documentId: string;
    sku: string;
    branchCode: string;
    quantity?: number;
  }): Observable<IPriceInfo> {
    const { sku, quantity, ..._params } = params;
    return this.http.get<IPriceInfo>(`${API_PRODUCT}/${sku}/price`, {
      params: { ..._params, quantity: quantity || 1 },
    });
  }
}
