// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environment
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  buscaPorVimNum(params: any) {
    return this.http.get(`${environment.apiElastic}chassis`, { params });
  }

  getStockProduct(sku: any) {
    /* se agrega tipo 2 para que muestre el stock de seguridad */
    return this.http.get(
      environment.apiShoppingCart + `stockb2b?sku=${sku}&tipo=2`
    );
  }
}
